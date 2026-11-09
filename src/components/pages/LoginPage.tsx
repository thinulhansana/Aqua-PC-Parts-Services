"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import AuthPanel, { type AuthMode } from "@/components/auth/AuthPanel";
import {
  CircuitFlowBackdrop,
  MaskedReveal,
  TiltSpotlightCard,
  SpotlightCard,
  fadeUpVariants,
} from "@/components/ui/MotionPrimitives";

interface LoginPageProps {
  googleEnabled: boolean;
}

const PORTAL_HIGHLIGHTS = [
  {
    icon: "memory",
    title: "Saved Rig Blueprint",
    desc: "Store your CPU, GPU, motherboard & custom loop layout once for effortless consultations.",
  },
  {
    icon: "bolt",
    title: "1-Click Intake Prefill",
    desc: "Your verified contact details & hardware blueprint auto-populate repair and build forms.",
  },
  {
    icon: "shield",
    title: "Google & Email Security",
    desc: "Sign in seamlessly with Google OAuth or salted cryptographic email credentials.",
  },
];

export default function LoginPage({ googleEnabled }: LoginPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const rawCallback = searchParams.get("callbackUrl") || "/account";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/account";
  const initialError = searchParams.get("error");
  const modeParam = searchParams.get("mode");
  const initialMode: AuthMode =
    modeParam === "register" ? "register" : "signin";

  return (
    <div className="relative flex flex-col w-full min-h-[calc(100vh-5rem)] overflow-hidden bg-surface-container-lowest">
      <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-45" />
      <div className="pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[340px] rounded-full bg-primary/12 blur-[120px] animate-orb-drift" />
      <div className="pointer-events-none absolute bottom-0 right-1/5 w-[460px] h-[320px] rounded-full bg-secondary/10 blur-[120px] animate-orb-drift-delay" />

      <section className="relative z-10 max-w-6xl mx-auto px-gutter-lg py-space-xl lg:py-space-2xl w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center w-full">
          {/* Left Column: Engineering Identity & Benefits */}
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                AQUA LAB PORTAL // AUTH v2
              </span>
              <span className="font-mono text-label-tech text-outline">
                ENCRYPTED SESSION
              </span>
            </motion.div>

            <h1 className="font-syne text-display-hero-mobile sm:text-headline-lg text-on-surface uppercase tracking-tight">
              <MaskedReveal delay={0.05}>Access Your</MaskedReveal>{" "}
              <MaskedReveal delay={0.16}>
                <span className="text-shimmer">Aqua Client Lab</span>
              </MaskedReveal>
            </h1>

            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant max-w-xl"
            >
              Sign in with Google or email to manage your PC blueprint, accelerate diagnostic ticket intakes, and track custom engineering services.
            </motion.p>

            <div className="grid grid-cols-1 gap-3 max-w-xl">
              {PORTAL_HIGHLIGHTS.map((item, idx) => (
                <motion.div
                  key={item.title}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={idx + 3}
                >
                  <SpotlightCard className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/20 hover:border-primary/40 transition-colors flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 relative z-10">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 relative z-10">
                      <h3 className="font-syne text-title-md text-on-surface">
                        {item.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">
                        {item.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Auth Panel or Already-Signed-In Card */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="lg:col-span-6 w-full max-w-md mx-auto lg:ml-auto lg:mr-0"
          >
            {status === "authenticated" && session?.user ? (
              <TiltSpotlightCard
                conicBorder
                maxTilt={2.5}
                className="rounded-xl shadow-2xl"
                innerClassName="rounded-xl"
              >
                <div className="p-8 bg-surface-container-low/95 backdrop-blur-2xl flex flex-col gap-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary text-on-primary font-syne font-bold text-headline-sm flex items-center justify-center shadow-cyan-glow shrink-0">
                      {(session.user.name || session.user.email || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                        Session Active
                      </span>
                      <h2 className="font-syne text-headline-sm text-on-surface truncate">
                        {session.user.name || "Aqua Member"}
                      </h2>
                      <p className="font-mono text-body-sm text-on-surface-variant truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <p className="text-body-md text-on-surface-variant">
                    You are already signed in. Continue to your customer account portal or explore services.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={callbackUrl}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-primary text-on-primary font-syne font-bold text-body-md text-center shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        dashboard
                      </span>
                      <span>Open Account Portal</span>
                    </Link>
                    <Link
                      href="/"
                      className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-jakarta font-semibold text-body-md border border-outline-variant/30 transition-colors text-center"
                    >
                      Home
                    </Link>
                  </div>
                </div>
              </TiltSpotlightCard>
            ) : (
              <TiltSpotlightCard
                conicBorder
                maxTilt={2}
                className="rounded-xl shadow-2xl"
                innerClassName="rounded-xl"
              >
                <AuthPanel
                  initialMode={initialMode}
                  callbackUrl={callbackUrl}
                  googleEnabled={googleEnabled}
                  initialError={initialError}
                  onSuccess={(target) => {
                    router.push(target);
                  }}
                />
              </TiltSpotlightCard>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

