"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/shopData";
import {
  RevealSection,
  SpotlightCard,
  TiltSpotlightCard,
  MaskedReveal,
  CircuitFlowBackdrop,
  fadeUpVariants,
  scaleInVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

const InteractiveCatalog = dynamic(
  () => import("@/components/pricing/InteractiveCatalog"),
  {
    loading: () => (
      <div className="w-full h-80 rounded-xl bg-surface-container/60 animate-pulse flex items-center justify-center border border-outline-variant/20">
        <div className="flex flex-col items-center gap-space-sm text-on-surface-variant font-mono text-label-tech">
          <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
            progress_activity
          </span>
          <span>Loading Verified Parts Catalog...</span>
        </div>
      </div>
    ),
  }
);

export default function PricingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Top Ambient Banner & Header Info ── */}
      <section className="relative w-full px-gutter-lg py-space-xl overflow-hidden bg-surface-container-lowest -mt-20 pt-28">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-55" />
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-orb-drift pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] animate-orb-drift-delay pointer-events-none" />

        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-lg relative z-10">
          <div className="flex flex-col gap-space-sm max-w-3xl">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex flex-wrap items-center gap-space-xs"
            >
              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-label-tech border border-secondary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
                HONEST SRI LANKAN LKR RATES
              </span>
              <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                No Hidden Bench Markups
              </span>
            </motion.div>
            <h1 className="font-syne text-display-hero-mobile lg:text-headline-lg text-on-surface tracking-tight">
              <MaskedReveal delay={0.05}>Transparent Service Rates for</MaskedReveal>{" "}
              <MaskedReveal delay={0.18}>
                <span className="text-shimmer">Repairs, Builds &amp; Parts</span>
              </MaskedReveal>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant"
            >
              Built for gamers, creators, and workstations across Sri Lanka. Clear flat-rate service tiers, upfront repair quotes, and direct live parts pricing via WhatsApp.
            </motion.p>
          </div>

          {/* Trust Telemetry Pills */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap md:flex-col gap-space-sm items-start md:items-end font-mono text-label-tech"
          >
            <div className="px-space-md py-space-xs rounded-xl bg-surface-container text-on-surface flex items-center gap-space-sm shadow-sm border border-outline-variant/20 hover:border-primary/40 transition-colors">
              <span className="material-symbols-outlined text-primary text-[18px]">
                verified
              </span>
              <span>Rs. 0 Inspection When Repair Proceeds</span>
            </div>
            <div className="px-space-md py-space-xs rounded-xl bg-surface-container text-on-surface flex items-center gap-space-sm shadow-sm border border-outline-variant/20 hover:border-secondary/40 transition-colors">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                price_check
              </span>
              <span>06-Month Testing Warranty Coverage</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Service Packages & Repair Rate Card ── */}
      <RevealSection className="w-full px-gutter-lg py-space-2xl bg-surface">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
          >
            <div>
              <span className="font-mono text-label-badge text-primary uppercase tracking-widest">
                Standard LKR Labor Schedule
              </span>
              <h2 className="font-syne text-headline-md text-on-surface mt-space-xs">
                Service Packages &amp; Build Tiers
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Every diagnostic report and build quote is approved with you upfront before any paid work starts.
            </p>
          </motion.div>

          {/* 4 Tier Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter items-stretch">
            {/* Tier 1: Thermal Service & Checkup */}
            <motion.div variants={fadeUpVariants} custom={0} className="flex">
              <SpotlightCard className="w-full flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container shadow-md hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.35)] transition-all duration-300 ease-out hover:-translate-y-2.5 border border-outline-variant/15 hover:border-primary/50">
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                      TIER 01
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[10px]">
                      SAME-DAY SERVICE
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Thermal Overhaul &amp; Checkup
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Full cleaning, thermal repasting, and full-load stress audit for hot or noisy PCs.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      Rs. 2,500
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / flat rate
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Deep Chassis &amp; Fan Dust Clean</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>High-Conductivity CPU Repaste</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Full-Load Thermal Benchmark</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Fan Curve &amp; Airflow Optimization</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all shadow-sm border border-outline-variant/30 hover:border-primary/40"
                  >
                    Book Tier 01
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Tier 2: Hardware Repair & Tuning */}
            <motion.div variants={fadeUpVariants} custom={1} className="flex">
              <TiltSpotlightCard
                conicBorder
                sheen
                maxTilt={3.5}
                className="w-full rounded-xl shadow-xl hover:shadow-[0_25px_50px_-10px_rgba(79,219,200,0.45)] transition-shadow duration-300"
                innerClassName="flex flex-col justify-between p-space-lg bg-surface-container"
              >
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-primary tracking-wider uppercase">
                      TIER 02
                    </span>
                    <span className="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary-container font-mono text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse">
                      MOST POPULAR
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Hardware Repair &amp; Tuning
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Fault diagnostics, board-level repairs, BIOS recovery, and component upgrades.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      From Rs. 4,500
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / service
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Power Rail &amp; POST Diagnostics</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Board-Level Component Rework</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>BIOS Flash, XMP &amp; Driver Tuning</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Thermal Paste &amp; Cable Cleanup</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        verified
                      </span>
                      <span className="text-primary font-medium">
                        06-Month Testing Warranty (Parts)
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="relative sheen-hover block text-center w-full py-space-sm rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne text-title-md transition-all shadow-cyan-glow"
                  >
                    <span className="relative z-10">Book Repair Service</span>
                  </Link>
                </div>
              </TiltSpotlightCard>
            </motion.div>

            {/* Tier 3: Custom PC Build & Cooling */}
            <motion.div variants={fadeUpVariants} custom={2} className="flex">
              <SpotlightCard className="w-full flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container shadow-md hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.35)] transition-all duration-300 ease-out hover:-translate-y-2.5 border border-outline-variant/15 hover:border-primary/50">
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                      TIER 03
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-[10px]">
                      CUSTOM RIG LAB
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Custom PC Build &amp; Cooling
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Complete desktop assembly, AIO or liquid cooling setup, OS installation, and burn-in validation.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      From Rs. 8,500
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / build
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Clean Airflow &amp; Cable Architecture</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>AIO / Custom Liquid Leak Testing</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>BIOS, Drivers &amp; Windows Setup</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>24-Hour Stress &amp; Thermal Validation</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        verified
                      </span>
                      <span className="text-primary font-medium">
                        06-Month Build Testing Warranty
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all shadow-sm border border-outline-variant/30 hover:border-primary/40"
                  >
                    Schedule Custom Build
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Tier 4: Business & Studio Support */}
            <motion.div variants={fadeUpVariants} custom={3} className="flex">
              <SpotlightCard className="w-full flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container shadow-md hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.35)] transition-all duration-300 ease-out hover:-translate-y-2.5 border border-outline-variant/15 hover:border-primary/50">
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                      TIER 04
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-tertiary font-mono text-[10px]">
                      PRIORITY SLA
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Business &amp; Studio Fleet Support
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Bulk hardware sourcing, studio editing PCs, and ongoing office workstation care.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      Custom Quote
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Multi-PC Spec &amp; Budget Planning</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Bulk Part &amp; Monitor Sourcing</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Scheduled Preventive Servicing</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Priority Workshop Turnaround</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <a
                    href={buildWhatsAppUrl(
                      "Hi Aqua PC Solutions, I'd like a custom quote for Business / Studio PC fleet sourcing or maintenance."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all shadow-sm border border-outline-variant/30 hover:border-primary/40"
                  >
                    Request Fleet Quote
                  </a>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* ── Consultation & Diagnostic Ethics Policy Bento ── */}
      <RevealSection className="w-full px-gutter-lg py-space-xl bg-surface-container-lowest border-y border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {/* Left side: Diagnostic policy */}
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="lg:col-span-6 flex flex-col gap-space-md"
          >
            <span className="font-mono text-label-badge text-secondary uppercase tracking-widest">
              Diagnostic Ethics Policy
            </span>
            <h2 className="font-syne text-headline-md text-on-surface">
              Clear Testing. Zero Surprise Fees.
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              We inspect your system thoroughly and explain the root cause before you spend a rupee on repair work. If we find an issue and you proceed with the repair, your inspection fee is Rs. 0. If you decide not to go ahead, you only pay a flat Rs. 1,500 bench report fee.
            </p>

            {/* Thermal Stability Benchmark Visual */}
            <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-inner border border-outline-variant/15">
              <div className="flex items-center justify-between font-mono text-label-tech">
                <span className="text-on-surface-variant">
                  Post-Service Thermal Curve Sample
                </span>
                <span className="text-secondary font-bold">24h Burn-In Logged</span>
              </div>
              <div className="w-full h-16 flex items-center">
                <svg
                  className="w-full h-full overflow-visible text-primary"
                  fill="none"
                  viewBox="0 0 400 60"
                >
                  <motion.path
                    d="M 0,45 Q 40,55 80,30 T 160,20 T 240,40 T 320,15 T 400,25"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: EASE_PREMIUM }}
                  />
                  <motion.path
                    d="M 0,45 Q 40,55 80,30 T 160,20 T 240,40 T 320,15 T 400,25 L 400,60 L 0,60 Z"
                    fill="currentColor"
                    initial={{ fillOpacity: 0 }}
                    whileInView={{ fillOpacity: 0.08 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                  <circle
                    className="fill-secondary animate-pulse"
                    cx="320"
                    cy="15"
                    r="4"
                  />
                  <circle className="fill-primary" cx="160" cy="20" r="3" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-outline font-mono text-[11px]">
                <span>Idle Check</span>
                <span>Sustained Full Load</span>
                <span>06-Month Testing Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right side: Advisory & Upgrade Cards */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-gutter">
            <motion.div variants={scaleInVariants} custom={1} className="flex-1 flex">
              <SpotlightCard className="flex-1 p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-lg hover:shadow-cyan-glow hover:-translate-y-2 transition-all duration-300 ease-out border border-outline-variant/15 hover:border-primary/50">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-space-md border border-primary/20 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">
                      desktop_windows
                    </span>
                  </div>
                  <h3 className="font-syne text-title-md text-on-surface">
                    PC Build Planning &amp; Advice
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs">
                    Not sure which CPU, GPU, board, or PSU matches your LKR budget without bottlenecks? We review and optimize your complete parts list directly.
                  </p>
                  <div className="mt-space-md mb-space-xs flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-md text-on-surface">
                      Free (Rs. 0)
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      with parts / build
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-highest text-secondary font-mono text-[10px]">
                    <span className="material-symbols-outlined text-[14px]">
                      redeem
                    </span>
                    <span>Rs. 1,500 standalone (100% credited to order)</span>
                  </div>
                </div>
                <div className="pt-space-lg relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all border border-outline-variant/30 hover:border-primary/40"
                  >
                    Book Build Advice
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div variants={scaleInVariants} custom={2} className="flex-1 flex">
              <SpotlightCard
                glowColor="rgb(var(--color-secondary) / 0.14)"
                className="flex-1 p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-lg hover:shadow-cyan-glow hover:-translate-y-2 transition-all duration-300 ease-out border border-outline-variant/15 hover:border-secondary/50"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary mb-space-md border border-secondary/20 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">
                      precision_manufacturing
                    </span>
                  </div>
                  <h3 className="font-syne text-title-md text-on-surface">
                    Component Install &amp; Upgrade
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs">
                    Purchased a new GPU, SSD, RAM kit, PSU, or cooler? We handle clean mounting, BIOS verification, and thermal stability checking in our workshop.
                  </p>
                  <div className="mt-space-md mb-space-xs flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-md text-on-surface">
                      From Rs. 1,500
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / per component
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-highest text-tertiary font-mono text-[10px]">
                    <span className="material-symbols-outlined text-[14px]">
                      verified_user
                    </span>
                    <span>Includes POST &amp; temperature verification</span>
                  </div>
                </div>
                <div className="pt-space-lg relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all border border-outline-variant/30 hover:border-secondary/40"
                  >
                    Schedule Install
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* ── Interactive Verified Parts Catalog (Code-Split via dynamic import) ── */}
      <section className="w-full px-gutter-lg py-space-2xl bg-surface" id="parts-catalog">
        <div className="max-w-[1440px] mx-auto">
          <InteractiveCatalog />
        </div>
      </section>
    </div>
  );
}
