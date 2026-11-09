"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicUserProfile } from "@/lib/auth-users";
import {
  CircuitFlowBackdrop,
  MaskedReveal,
  SpotlightCard,
  TiltSpotlightCard,
  fadeUpVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

interface AccountPageProps {
  initialProfile: PublicUserProfile;
}

function getInitials(name?: string | null, email?: string | null): string {
  const source = (name || email || "A").trim();
  const parts = source.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function AccountPage({ initialProfile }: AccountPageProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();

  const [profile, setProfile] = useState<PublicUserProfile>(initialProfile);
  const [name, setName] = useState(initialProfile.name || "");
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [rigSpecs, setRigSpecs] = useState(initialProfile.rigSpecs || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const memberDate = (() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(profile.createdAt));
    } catch {
      return "Active Member";
    }
  })();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          rigSpecs: rigSpecs.trim(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: unknown;
        user?: PublicUserProfile;
      };
      if (!res.ok) {
        setSaveMessage({
          type: "error",
          text:
            typeof data?.error === "string"
              ? data.error
              : "Could not save profile changes.",
        });
        setIsSaving(false);
        return;
      }

      if (data?.user) {
        setProfile(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
        setRigSpecs(data.user.rigSpecs || "");
        await updateSession({ name: data.user.name });
        router.refresh();
      }

      setSaveMessage({
        type: "success",
        text: "Profile & hardware blueprint saved. Future repair/build forms will auto-fill these details.",
      });
    } catch {
      setSaveMessage({
        type: "error",
        text: "Network error while saving profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── Top Ambient Header Banner ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-space-xl border-b border-outline-variant/15">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-50" />
        <div className="pointer-events-none absolute -top-24 left-1/4 w-[540px] h-[320px] rounded-full bg-primary/10 blur-[120px] animate-orb-drift" />
        <div className="pointer-events-none absolute -top-16 right-1/4 w-[420px] h-[280px] rounded-full bg-secondary/10 blur-[100px] animate-orb-drift-delay" />

        <div className="relative z-10 max-w-6xl mx-auto px-gutter-lg pt-space-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-primary p-[2px] shadow-cyan-glow">
                  <div className="w-full h-full rounded-[14px] bg-surface-container flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-syne font-bold text-headline-sm sm:text-headline-md text-primary">
                        {getInitials(profile.name, profile.email)}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary border-2 border-surface-container-lowest flex items-center justify-center"
                  title="Verified Session"
                >
                  <span className="material-symbols-outlined text-[12px] text-on-secondary font-bold">
                    check
                  </span>
                </span>
              </div>

              {/* Identity Meta */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container border border-primary/30 font-mono text-[10px] uppercase tracking-widest text-primary">
                    <span className="material-symbols-outlined text-[13px]">
                      {profile.provider === "google" ? "verified_user" : "mail"}
                    </span>
                    {profile.provider === "google"
                      ? "Google Account"
                      : "Email Account"}
                  </span>
                  <span className="font-mono text-[11px] text-outline">
                    MEMBER SINCE // {memberDate.toUpperCase()}
                  </span>
                </div>

                <h1 className="font-syne text-headline-md sm:text-headline-lg text-on-surface truncate">
                  <MaskedReveal delay={0.04}>{profile.name}</MaskedReveal>
                </h1>
                <p className="font-mono text-body-sm text-on-surface-variant truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant/35 hover:border-primary/40 font-jakarta font-semibold text-body-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  build_circle
                </span>
                <span>New Request</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-4 py-2.5 rounded-xl bg-error-container/20 hover:bg-error-container/35 text-on-error-container border border-error/35 font-jakarta font-semibold text-body-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSigningOut ? "progress_activity" : "logout"}
                </span>
                <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Account Workspace ── */}
      <section className="max-w-6xl mx-auto px-gutter-lg py-space-xl w-full flex flex-col gap-space-xl">
        {/* Quick Telemetry Actions */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
        >
          <Link href="/contact" className="block h-full">
            <SpotlightCard className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/45 transition-all h-full flex flex-col justify-between gap-4 hover:-translate-y-1">
              <div className="flex items-start justify-between relative z-10">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    engineering
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">
                  arrow_outward
                </span>
              </div>
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary block">
                  AUTO-PREFILLED INTAKE
                </span>
                <h2 className="font-syne text-title-md text-on-surface mt-1">
                  Book Consultation or Repair
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Launch a quote or repair ticket with your contact info &amp; saved PC specs pre-loaded.
                </p>
              </div>
            </SpotlightCard>
          </Link>

          <Link href="/contact#telemetry-tracer" className="block h-full">
            <SpotlightCard
              glowColor="rgb(var(--color-secondary) / 0.14)"
              className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/45 transition-all h-full flex flex-col justify-between gap-4 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/25 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">
                    query_stats
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">
                  arrow_outward
                </span>
              </div>
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                  BENCH TELEMETRY
                </span>
                <h2 className="font-syne text-title-md text-on-surface mt-1">
                  Trace Repair Ticket
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Inspect live cleanroom bench stages, thermal tests, and diagnostic checkpoints.
                </p>
              </div>
            </SpotlightCard>
          </Link>

          <Link href="/shop" className="block h-full">
            <SpotlightCard className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-tertiary/45 transition-all h-full flex flex-col justify-between gap-4 hover:-translate-y-1">
              <div className="flex items-start justify-between relative z-10">
                <div className="w-11 h-11 rounded-xl bg-tertiary/10 border border-tertiary/25 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[24px]">
                    desktop_windows
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">
                  arrow_outward
                </span>
              </div>
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-tertiary block">
                  CURATED HARDWARE
                </span>
                <h2 className="font-syne text-title-md text-on-surface mt-1">
                  Browse Builds &amp; Components
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Explore binned GPUs, hard-line water-cooling kits, and custom workstations.
                </p>
              </div>
            </SpotlightCard>
          </Link>
        </motion.div>

        {/* Profile & Hardware Blueprint Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          <div className="lg:col-span-8">
            <TiltSpotlightCard
              conicBorder
              maxTilt={1.5}
              className="rounded-xl shadow-xl"
              innerClassName="rounded-xl"
            >
              <div className="p-space-lg sm:p-space-xl bg-surface-container-low relative">
                <div className="flex items-center justify-between gap-4 mb-space-lg">
                  <div>
                    <span className="font-mono text-label-tech text-primary uppercase tracking-widest block">
                      CLIENT PROFILE &amp; HARDWARE BLUEPRINT
                    </span>
                    <h2 className="font-syne text-headline-sm sm:text-headline-md text-on-surface mt-0.5">
                      Saved Rig &amp; Contact Preferences
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container border border-primary/25 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      memory
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {saveMessage && (
                    <motion.div
                      key={saveMessage.text}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                      className={`mb-space-md p-3.5 rounded-xl border text-body-sm flex items-start gap-2.5 ${
                        saveMessage.type === "success"
                          ? "bg-secondary/15 border-secondary/40 text-secondary"
                          : "bg-error-container/25 border-error/45 text-on-error-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px] shrink-0 mt-0.5">
                        {saveMessage.type === "success" ? "verified" : "error"}
                      </span>
                      <span>{saveMessage.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSaveProfile} className="flex flex-col gap-space-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="account-name"
                        className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
                      >
                        Full Name *
                      </label>
                      <input
                        id="account-name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={80}
                        disabled={isSaving}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="account-phone"
                        className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
                      >
                        SMS Telemetry / WhatsApp Number
                      </label>
                      <input
                        id="account-phone"
                        type="tel"
                        maxLength={40}
                        placeholder="+94 78 819 4535"
                        disabled={isSaving}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="account-specs"
                      className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant"
                    >
                      Saved Rig Spec Blueprint (CPU, GPU, Motherboard, Cooling Loop)
                    </label>
                    <textarea
                      id="account-specs"
                      rows={3}
                      maxLength={300}
                      placeholder="e.g. Ryzen 9 7950X3D / ASUS ROG Crosshair Hero / RTX 4090 / Dual 360mm EKWB Hardline Loop"
                      disabled={isSaving}
                      value={rigSpecs}
                      onChange={(e) => setRigSpecs(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline font-mono text-label-tech border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y disabled:opacity-60"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-mono text-[11px] text-outline">
                      Synced directly to Aqua intake prefill &amp; account storage
                    </span>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 rounded-xl bg-gradient-primary text-on-primary font-syne font-bold text-body-md shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSaving ? "progress_activity" : "save"}
                      </span>
                      <span>{isSaving ? "Saving Blueprint..." : "Save Profile & Rig"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </TiltSpotlightCard>
          </div>

          {/* Right Security / Session Info Panel */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[20px]">
                  verified_user
                </span>
                <span className="font-mono text-label-tech uppercase tracking-wider font-semibold">
                  Authentication Security
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Signed in via{" "}
                <strong className="text-on-surface">
                  {profile.provider === "google"
                    ? "Google OAuth 2.0"
                    : "Email & Salted Scrypt Credentials"}
                </strong>
                . Your session uses an encrypted HTTP-only JWT cookie protected by middleware.
              </p>
              <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-1.5 font-mono text-[11px] text-outline">
                <div className="flex justify-between">
                  <span>ACCOUNT ID</span>
                  <span className="text-on-surface truncate max-w-[140px]">
                    {profile.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PROVIDER</span>
                  <span className="text-primary uppercase">{profile.provider}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
