"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
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
          <span>Loading Inventory Lab Telemetry...</span>
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
              className="flex items-center gap-space-xs"
            >
              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-label-tech border border-secondary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
                ZERO ARBITRARY MARKUPS
              </span>
              <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                Telemetry Verified Rates
              </span>
            </motion.div>
            <h1 className="font-syne text-display-hero-mobile lg:text-headline-lg text-on-surface tracking-tight">
              <MaskedReveal delay={0.05}>Transparent Tiered Pricing for</MaskedReveal>{" "}
              <MaskedReveal delay={0.18}>
                <span className="text-shimmer">Parts, Repairs &amp; Consultations</span>
              </MaskedReveal>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant"
            >
              Engineered for enthusiasts and workstations. Certified retail component sourcing, flat-rate precision labor, and verified zero-diagnostic penalty billing.
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
              <span>$0 Diagnostic Fee With Any Repair</span>
            </div>
            <div className="px-space-md py-space-xs rounded-xl bg-surface-container text-on-surface flex items-center gap-space-sm shadow-sm border border-outline-variant/20 hover:border-secondary/40 transition-colors">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                price_check
              </span>
              <span>Official Authorized MSRP Benchmark</span>
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
                Fixed Labor Schedule
              </span>
              <h2 className="font-syne text-headline-md text-on-surface mt-space-xs">
                Service Packages &amp; Diagnostic Tiers
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Standardized service times logged on automated thermal test-benches. No hidden line-items or open-ended hourly creep.
            </p>
          </motion.div>

          {/* 4 Tier Bento Grid with Smooth Hover-Lift Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter items-stretch">
            {/* Tier 1: Essential */}
            <motion.div variants={fadeUpVariants} custom={0} className="flex">
              <SpotlightCard className="w-full flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container shadow-md hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.35)] transition-all duration-300 ease-out hover:-translate-y-2.5 border border-outline-variant/15 hover:border-primary/50">
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                      TIER 01
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[10px]">
                      RAPID TURNOVER
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Essential Checkup
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Full thermal audit and baseline stability stress testing for unstable or dusty systems.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      $49
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
                      <span>Hardware Stress-Testing</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Malware Sanitization Audit</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Thermal Flir Auditing</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>High-Pressure Dust Blowout</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all shadow-sm border border-outline-variant/30 hover:border-primary/40"
                  >
                    Select Package
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Tier 2: Pro (Featured with Conic Liquid Border & 3D Spring Tilt) */}
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
                    Pro Hardware Repair &amp; Tuning
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Micro-precision fixes, component swaps, BIOS re-flashes, and clean cable architecture.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      $129
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
                      <span>Component Swap &amp; Diagnostic Lab</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Custom BIOS Flash &amp; Curve Tuning</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Thermal Grizzly Kryonaut Repaste</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Chassis Cable Routing Refactor</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        verified
                      </span>
                      <span className="text-primary font-medium">
                        30-Day Aqua Lab Warranty
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="relative sheen-hover block text-center w-full py-space-sm rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne text-title-md transition-all shadow-cyan-glow"
                  >
                    <span className="relative z-10">Book Pro Service</span>
                  </Link>
                </div>
              </TiltSpotlightCard>
            </motion.div>

            {/* Tier 3: Custom Loop */}
            <motion.div variants={fadeUpVariants} custom={2} className="flex">
              <SpotlightCard className="w-full flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container shadow-md hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.35)] transition-all duration-300 ease-out hover:-translate-y-2.5 border border-outline-variant/15 hover:border-primary/50">
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                      TIER 03
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-[10px]">
                      HYDRO LAB
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Enthusiast Custom Loop
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Complete custom open liquid assembly, drain/flush service, pressure leak-testing.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      $299
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / build cycle
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Full Hardline / Softline Assembly</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>24-Hour Pneumatic Leak Test</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Direct-Die Block Fitting Optional</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Bespoke Sleeved Cable Routing</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        verified
                      </span>
                      <span className="text-primary font-medium">
                        90-Day Zero-Leak Guarantee
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all shadow-sm border border-outline-variant/30 hover:border-primary/40"
                  >
                    Schedule Loop Build
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Tier 4: Enterprise Retainer */}
            <motion.div variants={fadeUpVariants} custom={3} className="flex">
              <SpotlightCard className="w-full flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container shadow-md hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.35)] transition-all duration-300 ease-out hover:-translate-y-2.5 border border-outline-variant/15 hover:border-primary/50">
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                    <span className="font-mono text-label-tech text-outline tracking-wider uppercase">
                      TIER 04
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-tertiary font-mono text-[10px]">
                      SLA BACKED
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface">
                    Enterprise Retainer
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                    Continuous mission-critical hardware assurance for 3D render farms and studio workstations.
                  </p>
                  <div className="my-space-md flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-lg text-primary">
                      $499
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / month
                    </span>
                  </div>
                  <ul className="flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Priority 4-Hour On-Site Dispatch</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Up to 5 Full Rig Diagnostics / Mo</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Volume Procurement Tier Discounts</span>
                    </li>
                    <li className="flex items-center gap-space-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        check_circle
                      </span>
                      <span>Hot-Swap Spare Component Bank</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-space-lg mt-space-md relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all shadow-sm border border-outline-variant/30 hover:border-primary/40"
                  >
                    Contact Enterprise
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* ── Consultation Hourly Rates & Diagnostic Policy Bento ── */}
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
              Transparent Benchmarks. Honest Billing.
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              We despise arbitrary $100 diagnostic fees that leave clients empty-handed. If we find an issue and you approve the repair, your diagnosis is strictly $0. If you choose not to proceed, our comprehensive bench report is just $30 flat.
            </p>

            {/* Animated Sparkline Visual */}
            <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-inner border border-outline-variant/15">
              <div className="flex items-center justify-between font-mono text-label-tech">
                <span className="text-on-surface-variant">
                  Lab Sensor Telemetry Output
                </span>
                <span className="text-secondary font-bold">Delta T: 8.4°C</span>
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
                <span>Ambient: 21.0°C</span>
                <span>Loop Flow: 220 L/h</span>
                <span>Acoustic: 24.1 dBA</span>
              </div>
            </div>
          </motion.div>

          {/* Right side: Hourly Consultation Rate Cards with Hover-Lift */}
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
                    Virtual PC Build Architect
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs">
                    45-minute live screen share to optimize your PCPartPicker list, component clearance, and radiator airflow before spending a dime.
                  </p>
                  <div className="mt-space-md mb-space-xs flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-md text-on-surface">
                      $45
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / 45 min
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-highest text-secondary font-mono text-[10px]">
                    <span className="material-symbols-outlined text-[14px]">
                      redeem
                    </span>
                    <span>100% credited toward parts purchase</span>
                  </div>
                </div>
                <div className="pt-space-lg relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all border border-outline-variant/30 hover:border-primary/40"
                  >
                    Schedule Architect
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
                    In-Lab Hardware Engineering
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-space-xs">
                    Bespoke micro-soldering, delidding, custom loop tubing bending, and extreme overclocking conducted on our ISO-certified test bench.
                  </p>
                  <div className="mt-space-md mb-space-xs flex items-baseline gap-space-xs">
                    <span className="font-syne text-headline-md text-on-surface">
                      $95
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      / hour
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-highest text-tertiary font-mono text-[10px]">
                    <span className="material-symbols-outlined text-[14px]">
                      timer
                    </span>
                    <span>Billed in granular 15-minute blocks</span>
                  </div>
                </div>
                <div className="pt-space-lg relative z-10">
                  <Link
                    href="/contact"
                    className="block text-center w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md transition-all border border-outline-variant/30 hover:border-secondary/40"
                  >
                    Book Bench Time
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* ── Interactive PC Parts Catalog (Code-Split via dynamic import) ── */}
      <section className="w-full px-gutter-lg py-space-2xl bg-surface" id="parts-catalog">
        <div className="max-w-[1440px] mx-auto">
          <InteractiveCatalog />
        </div>
      </section>
    </div>
  );
}
