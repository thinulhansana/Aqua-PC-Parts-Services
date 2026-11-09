"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  CircuitFlowBackdrop,
  TiltSpotlightCard,
} from "@/components/ui/MotionPrimitives";

interface AdminRestrictedViewProps {
  signedInEmail: string;
}

export default function AdminRestrictedView({
  signedInEmail,
}: AdminRestrictedViewProps) {
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchAccount = async () => {
    setIsSwitching(true);
    await signOut({ callbackUrl: "/login?callbackUrl=/admin" });
  };

  return (
    <div className="relative flex flex-col w-full min-h-[calc(100vh-5rem)] overflow-hidden bg-surface-container-lowest">
      <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-40" />
      <div className="pointer-events-none absolute -top-20 left-1/3 w-[480px] h-[280px] rounded-full bg-error/10 blur-[120px]" />

      <section className="relative z-10 max-w-2xl mx-auto px-gutter-lg py-space-2xl w-full flex-1 flex items-center justify-center">
        <TiltSpotlightCard
          conicBorder
          maxTilt={2}
          className="rounded-2xl shadow-2xl w-full"
          innerClassName="rounded-2xl"
        >
          <div className="p-8 sm:p-10 bg-surface-container-low/95 backdrop-blur-2xl flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-error-container/30 border border-error/40 flex items-center justify-center text-error shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  shield_lock
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-error block">
                  FOUNDER RESTRICTED ZONE // ACCESS DENIED
                </span>
                <h1 className="font-syne text-headline-sm sm:text-headline-md text-on-surface">
                  Admin Console Restricted
                </h1>
              </div>
            </div>

            <p className="text-body-md text-on-surface-variant leading-relaxed">
              You are currently signed in as{" "}
              <span className="font-mono text-on-surface font-semibold break-all">
                {signedInEmail}
              </span>
              . Customer registry access is limited strictly to authorized{" "}
              <span className="text-on-surface font-medium">Aqua PC Solutions</span>{" "}
              founder accounts.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSwitchAccount}
                disabled={isSwitching}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-primary text-on-primary font-syne font-bold text-body-md shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSwitching ? "progress_activity" : "switch_account"}
                </span>
                <span>
                  {isSwitching ? "Signing Out..." : "Switch to Admin Account"}
                </span>
              </button>

              <Link
                href="/account"
                className="py-3 px-5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-jakarta font-semibold text-body-md border border-outline-variant/35 transition-colors text-center"
              >
                Client Portal
              </Link>

              <Link
                href="/"
                className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-jakarta font-semibold text-body-md border border-outline-variant/25 transition-colors text-center"
              >
                Home
              </Link>
            </div>
          </div>
        </TiltSpotlightCard>
      </section>
    </div>
  );
}

