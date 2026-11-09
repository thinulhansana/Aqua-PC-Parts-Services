"use client";

import React, { useState, useId, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";

export type AuthMode = "signin" | "register";

interface AuthPanelProps {
  initialMode?: AuthMode;
  callbackUrl?: string;
  googleEnabled: boolean;
  initialError?: string | null;
  onSuccess?: (targetUrl: string) => void;
  onClose?: () => void;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already registered with another sign-in method. Please sign in with Email & Password.",
  OAuthSignin:
    "Could not initialize Google sign-in. Verify Google OAuth credentials in .env.local.",
  OAuthCallbackError:
    "Google sign-in callback was canceled or rejected. Please try again.",
  AccessDenied: "Access denied. Please try again or use Email & Password.",
  CredentialsSignin: "Invalid email or password. Please verify your credentials.",
  Configuration:
    "Authentication provider needs configuration. Check AUTH_SECRET and Google credentials in .env.local.",
  Default: "Authentication failed. Please try again.",
};

function sanitizeCallbackUrl(raw?: string): string {
  if (!raw || typeof raw !== "string") return "/account";
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  return "/account";
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  barClass: string;
  textClass: string;
} {
  if (!password) {
    return {
      score: 0,
      label: "Minimum 8 characters",
      barClass: "bg-outline-variant/30",
      textClass: "text-outline",
    };
  }
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score: 1,
      label: password.length < 8 ? "Too short (min 8 chars)" : "Fair",
      barClass: "bg-error",
      textClass: "text-error",
    };
  }
  if (score === 2) {
    return {
      score: 2,
      label: "Good",
      barClass: "bg-tertiary",
      textClass: "text-tertiary",
    };
  }
  if (score === 3) {
    return {
      score: 3,
      label: "Strong",
      barClass: "bg-primary",
      textClass: "text-primary",
    };
  }
  return {
    score: 4,
    label: "Excellent",
    barClass: "bg-secondary",
    textClass: "text-secondary",
  };
}

export default function AuthPanel({
  initialMode = "signin",
  callbackUrl = "/account",
  googleEnabled,
  initialError = null,
  onSuccess,
  onClose,
}: AuthPanelProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const tabGroupId = useId();
  const formId = useId();
  const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    initialError ? AUTH_ERROR_MESSAGES[initialError] || AUTH_ERROR_MESSAGES.Default : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(
      initialError
        ? AUTH_ERROR_MESSAGES[initialError] || AUTH_ERROR_MESSAGES.Default
        : null
    );
    setSuccessMsg(null);
  }, [initialMode, initialError]);

  const strength = getPasswordStrength(password);

  const handleModeSwitch = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!googleEnabled) {
      setShowGoogleSetup((prev) => !prev);
      return;
    }

    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: safeCallbackUrl });
    } catch {
      setIsGoogleLoading(false);
      setErrorMsg("Unable to start Google Sign-In. Please try again.");
    }
  };

  const handleCopyRedirectUri = () => {
    const uri =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/auth/callback/google`
        : "http://localhost:3000/api/auth/callback/google";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(uri);
    }
    setCopiedCallback(true);
    setTimeout(() => setCopiedCallback(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (mode === "register") {
      if (cleanName.length < 2) {
        setErrorMsg("Please enter your full name (at least 2 characters).");
        return;
      }
      if (password.length < 8) {
        setErrorMsg("Password must be at least 8 characters long.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorMsg(
            typeof data?.error === "string"
              ? data.error
              : "Could not create account. Please check your details."
          );
          setIsLoading(false);
          return;
        }
      }

      const signInRes = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (!signInRes || signInRes.error) {
        setErrorMsg(
          mode === "register"
            ? "Account created, but automatic sign-in failed. Please sign in manually."
            : "Invalid email or password. Please verify your details or create a new account."
        );
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        mode === "register"
          ? "Account created & verified. Syncing your Aqua profile..."
          : "Welcome back! Syncing your Aqua session..."
      );
      await updateSession();
      router.refresh();

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(safeCallbackUrl);
        } else {
          router.push(safeCallbackUrl);
        }
      }, 350);
    } catch {
      setErrorMsg("Network timeout while signing in. Please try again.");
      setIsLoading(false);
    }
  };

  const busy = isLoading || isGoogleLoading;

  return (
    <div className="relative flex flex-col gap-space-md p-6 sm:p-8 bg-surface-container-low/95 backdrop-blur-2xl text-on-surface">
      {/* Top gradient hairline */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
              Aqua Lab Client Access
            </span>
          </div>
          <h2 className="font-syne text-headline-sm sm:text-headline-md text-on-surface mt-1">
            {mode === "signin" ? "Sign In to Your Account" : "Create Aqua Account"}
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Save your rig blueprint, fast-track intake forms, and manage builds.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in dialog"
            className="w-9 h-9 rounded-full bg-surface-container-high/80 hover:bg-surface-bright border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Continue with Google Button */}
      <div className="flex flex-col gap-2">
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-primary/45 text-on-surface font-jakarta font-semibold text-body-md flex items-center justify-center gap-3 shadow-sm hover:shadow-cyan-glow transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <span className="material-symbols-outlined text-[20px] text-primary animate-spin">
              progress_activity
            </span>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
          )}
          <span>
            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
          </span>
          {!googleEnabled && (
            <span className="ml-auto font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant/30">
              Setup Needed
            </span>
          )}
        </motion.button>

        {/* Friendly inline setup instructions if Google OAuth env keys aren't set yet */}
        <AnimatePresence>
          {showGoogleSetup && !googleEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE_PREMIUM }}
              className="overflow-hidden"
            >
              <div className="p-3.5 rounded-xl bg-surface-container border border-primary/30 text-body-sm flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                    key
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-on-surface">
                      Add Google OAuth Credentials in <code className="font-mono text-primary">.env.local</code>
                    </span>
                    <span className="text-on-surface-variant text-xs leading-relaxed">
                      Set <code className="font-mono text-on-surface">AUTH_GOOGLE_ID</code> and{" "}
                      <code className="font-mono text-on-surface">AUTH_GOOGLE_SECRET</code> from Google Cloud Console, then restart <code className="font-mono text-on-surface">npm run dev</code>. Email &amp; Password login works immediately below.
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                  <code className="font-mono text-[11px] text-secondary truncate">
                    http://localhost:3000/api/auth/callback/google
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyRedirectUri}
                    className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline shrink-0 cursor-pointer"
                  >
                    {copiedCallback ? "Copied" : "Copy URI"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant/30" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-outline">
          OR CONTINUE WITH EMAIL
        </span>
        <div className="h-px flex-1 bg-outline-variant/30" />
      </div>

      {/* Segmented Pill Toggle */}
      <div
        role="tablist"
        aria-label="Authentication mode"
        className="grid grid-cols-2 p-1 rounded-xl bg-surface-container border border-outline-variant/25"
      >
        {(
          [
            { id: "signin", label: "Sign In", icon: "login" },
            { id: "register", label: "Create Account", icon: "person_add" },
          ] as const
        ).map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleModeSwitch(tab.id)}
              disabled={busy}
              className={`relative py-2 px-3 rounded-lg font-jakarta text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer z-10 ${
                active
                  ? "text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`auth-tab-${tabGroupId}`}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-gradient-primary shadow-cyan-glow -z-10"
                />
              )}
              <span className="material-symbols-outlined text-[16px]">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inline Feedback Alerts */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div
            key="auth-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-xl bg-error-container/25 border border-error/45 text-on-error-container text-body-sm flex items-start gap-2"
            role="alert"
          >
            <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">
              error
            </span>
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            key="auth-success"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-xl bg-secondary/15 border border-secondary/45 text-secondary text-body-sm flex items-start gap-2"
            role="status"
          >
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
              verified
            </span>
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email + Password Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <AnimatePresence initial={false}>
          {mode === "register" && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 pb-1">
                <label
                  htmlFor={`${formId}-name`}
                  className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id={`${formId}-name`}
                    type="text"
                    required={mode === "register"}
                    autoComplete="name"
                    placeholder="Kasun Perera"
                    disabled={busy}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[19px]">
                    person
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-email`}
            className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
          >
            Email Address *
          </label>
          <div className="relative">
            <input
              id={`${formId}-email`}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              disabled={busy}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[19px]">
              alternate_email
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-password`}
            className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
          >
            Password *
          </label>
          <div className="relative">
            <input
              id={`${formId}-password`}
              type={showPassword ? "text" : "password"}
              required
              minLength={mode === "register" ? 8 : 1}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              placeholder={
                mode === "register" ? "At least 8 characters" : "Enter your password"
              }
              disabled={busy}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[19px]">
              lock
            </span>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-2 p-1 rounded-lg text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          {mode === "register" && (
            <div className="flex flex-col gap-1 pt-0.5">
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      strength.score >= step
                        ? strength.barClass
                        : "bg-outline-variant/25"
                    }`}
                  />
                ))}
              </div>
              <span className={`font-mono text-[10px] ${strength.textClass}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={busy}
          whileTap={{ scale: 0.99 }}
          className="mt-1 w-full py-3 px-5 rounded-xl bg-gradient-primary text-on-primary font-syne font-bold text-body-lg shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              <span>
                {mode === "register" ? "Creating Account..." : "Signing In..."}
              </span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">
                {mode === "register" ? "how_to_reg" : "verified_user"}
              </span>
              <span>
                {mode === "register"
                  ? "Create Account & Continue"
                  : "Sign In with Email"}
              </span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
