import type { Metadata } from "next";
import React, { Suspense } from "react";
import { isGoogleOAuthConfigured } from "@/auth.config";
import LoginPage from "@/components/pages/LoginPage";

export const metadata: Metadata = {
  title: "Sign In & Create Account | Aqua PC Solutions",
  description:
    "Sign in with Google or Email & Password to access your Aqua PC Solutions client portal, save rig specifications, and prefill consultation requests.",
};

export default function LoginRoutePage() {
  const googleEnabled = isGoogleOAuthConfigured();

  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-surface-container-lowest">
          <div className="flex flex-col items-center gap-3 text-on-surface-variant font-mono text-label-tech">
            <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
              progress_activity
            </span>
            <span>Initializing Secure Auth Portal...</span>
          </div>
        </div>
      }
    >
      <LoginPage googleEnabled={googleEnabled} />
    </Suspense>
  );
}

