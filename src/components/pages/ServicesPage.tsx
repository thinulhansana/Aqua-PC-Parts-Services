"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TOTAL_SHOP_ITEMS } from "@/lib/shopData";
import {
  SITE_EST,
  SITE_LOCATION,
  SITE_WHATSAPP_URL,
} from "@/lib/constants";
import {
  RevealSection,
  SpotlightCard,
  TiltSpotlightCard,
  MaskedReveal,
  CircuitFlowBackdrop,
  LiveOscilloscope,
  AnimatedNumber,
  fadeUpVariants,
  scaleInVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

const SERVICES = [
  {
    id: "srv-01",
    code: "SRV-01 // DIAGNOSTICS",
    title: "Hardware Diagnostics & Board-Level Repair",
    desc: "Fast, accurate fault isolation for dead systems, no-display issues, random shutdowns, and power rail failures using bench oscilloscopes and thermal scanning.",
    price: "From Rs. 4,500",
    tat: "24–48h TAT",
    span: "lg:col-span-7",
    color: "text-primary",
    bgColor: "bg-primary-container/20",
    icon: "power_off",
    specs: [
      {
        title: "No-POST & Rail Triage",
        desc: "Power rail voltage verification and POST sequence tracing",
      },
      {
        title: "Board-Level Component Repair",
        desc: "MOSFETs, SMD capacitors, BIOS recovery, and connector rework",
      },
      {
        title: "Thermal & Short Detection",
        desc: "Localized short-circuit detection to prevent wider board damage",
      },
      {
        title: "Storage & Data Check",
        desc: "NVMe SSD and SATA health diagnostics and partition verification",
      },
    ],
    footer: "Free inspection when repair proceeds (Rs. 1,500 report if declined).",
    action: "Request Repair",
  },
  {
    id: "srv-02",
    code: "SRV-02 // CUSTOM BUILDS",
    title: "Custom PC Builds & Liquid Cooling Setup",
    desc: "Clean, tailored desktop builds for gaming, editing, and workstations. From compact airflow rigs to AIO and liquid-cooled configurations tested end-to-end.",
    price: "From Rs. 8,500",
    tat: "2–4 Days",
    span: "lg:col-span-5",
    color: "text-secondary",
    bgColor: "bg-secondary-container/20",
    icon: "water_drop",
    rows: [
      { label: "Clean Cable Architecture", value: "Included" },
      { label: "AIO / Liquid Loop Check", value: "Leak & Pressure Tested" },
      { label: "OS, Drivers & Fan Curves", value: "Pre-Tuned" },
    ],
    footer: "Backed by our 06-Month Testing Warranty & 24h stability check.",
    action: "Book Custom Build",
  },
  {
    id: "srv-03",
    code: "SRV-03 // THERMAL",
    title: "Thermal Overhaul & Cooling Maintenance",
    desc: "Fix overheating CPUs and GPUs with deep internal dust removal, premium thermal paste replacement, pad checks, and balanced fan curve calibration.",
    price: "From Rs. 2,500",
    tat: "Same Day",
    span: "lg:col-span-4",
    color: "text-tertiary",
    bgColor: "bg-tertiary-container/20",
    icon: "thermostat",
    highlight: {
      label: "Typical Core Temp Drop",
      metric: "-10°C to -18°C",
      note: "Deep clean, fresh Kryonaut-class paste & airflow tuning",
    },
    action: "Book Thermal Service",
  },
  {
    id: "srv-04",
    code: "SRV-04 // TUNING",
    title: "BIOS, Memory & System Optimization",
    desc: "Resolve micro-stutters, instability, and sub-optimal boost behavior with safe BIOS updates, XMP/EXPO profile validation, and 24-hour load stress testing.",
    price: "From Rs. 3,500",
    tat: "24h Cycle",
    span: "lg:col-span-4",
    color: "text-primary",
    bgColor: "bg-primary-container/20",
    icon: "speed",
    highlight: {
      label: "Burn-In Validation",
      metric: "24h Verified",
      note: "Full Prime95, FurMark & memory stability check",
    },
    action: "Request Tuning",
  },
  {
    id: "srv-05",
    code: "SRV-05 // WORKSTATIONS",
    title: "Business, Studio & Bulk Hardware Support",
    desc: "Reliable hardware specification, multi-PC upgrades, workstation assembly, and direct component sourcing across Sri Lanka with transparent LKR invoicing.",
    price: "Custom Quote",
    tat: "Priority SLA",
    span: "lg:col-span-4",
    color: "text-secondary",
    bgColor: "bg-secondary-container/20",
    icon: "hub",
    highlight: {
      label: "Catalog Inventory Ready",
      metric: `${TOTAL_SHOP_ITEMS} Items`,
      note: "CPUs, GPUs, boards, RAM, SSDs & monitors ready to quote",
    },
    action: "Request Quote",
  },
];

const LAB_INSTRUMENTS = [
  {
    category: "Thermal Diagnostics",
    title: "Thermal Imaging Camera",
    desc: "Detects VRM hotspots, short circuits, and uneven cooler contact across motherboards and graphics cards.",
    res: "Thermal Scan",
    cal: "VERIFIED: LAB BENCH",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzS0OV_GjMRxC5RSUeXfo3lNcFq8Vvts_5cT4tZ7OwKuUkR7IEGHhHwLxLvkvmQeXuUmQUWrGn6gnsf5HYn972wdgs0PoK5aZ1IheThPc2OoMu1LIT5JkAZDJQxm9FiZI1rh7JB5X9JersJ9ljXEOPiQWkGtCZUsMt7Z6_CTBPho6PYCF-1VJM9Dua-amja62E6qR2CzRrSsQbeuHkb797Z5ys2nKWSXMA2h6nKjWv",
    color: "text-primary",
  },
  {
    category: "Signal Verification",
    title: "Digital Bench Oscilloscope",
    desc: "Checks power-on sequencing, clock stability, and voltage regulation behavior during no-boot troubleshooting.",
    res: "Rail & Signal Trace",
    cal: "ACTIVE DIAGNOSTICS",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0GCc5lvH47moTUGucnRkAX24g5RkUIyG-Q0FCsFaMv0dU9YpTMg62s7Zy82sP0GA-6t90obCy2mebDUAGjrI67agMGplXcE_8TcG7vUGhugW1ckOEzZ1669a3FszNpC-t45nH6SBoRFYjjX7ZmpmeprqNxRbdbjFDE-oKqqVX1VwfbqFKKaoMP78dtnAfAebN3eVCGQzK-9Xn7fRLYQuI1cYpnWwxPk3CtWMv4vyT",
    color: "text-secondary",
  },
  {
    category: "PCB Restoration",
    title: "Ultrasonic Cleaning Station",
    desc: "Gently removes dust oxidation, flux residue, and humidity corrosion from PCB surfaces and cooling fins.",
    res: "Deep PCB Clean",
    cal: "PRECISION CLEANING",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsDcSJyCjEDKn-NL8IVOr_XuENglq7HbnYtYef3h4y1G-BQZ7EwHejc58vWjlBn-iRkoNUY4hhJWksmr8YIT_oHsKw9GvEft3Nsfylz7lSHSwFg2LssIJxyvRyGGACa7KipLRflOabPqF2aVzE7lxiKcEBJKHx0DkvyJNauYFZ3d58bNMYaCeannAemSmqdWFoaP3M0E3qF1HmYzfAYSFdPqn3-9trXJZtTO6O6j1v",
    color: "text-tertiary",
  },
  {
    category: "Loop Safety",
    title: "Air & Pressure Leak Testing",
    desc: "Validates radiator, block, and fitting seals with controlled air pressure before any liquid coolant is introduced.",
    res: "Zero-Leak Check",
    cal: "PRE-FILL VERIFIED",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCN8UTLwD73J0AWYyu8-ZSrF8As2wjQY6d1v06xRPR0jdoQsz7iuoZVhyghZxpX6HpeW6OL5rU1GxPspprDmrn9rqjW1ZN57wj8v2jmenccTTYZS5Sdq2_3gPPTSwy6uCvfB4Lr6IJQw2_9bRKug9zr7ZkDQSfiI-lceU80rJfl14LTWq_KOsn8J1w2Fl-b-GrpLHoLbQASuj0eMFMJ0I1NfAFR913_8ZlGGfIFve5Z",
    color: "text-primary",
  },
];

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Intake & Visual Audit",
    desc: "Serial inspection, condition logging, and ESD-safe handling from arrival.",
    color: "text-primary",
  },
  {
    step: "02",
    title: "Bench Diagnostics",
    desc: "Power rail testing, component isolation, and thermal hotspot scans.",
    color: "text-primary",
  },
  {
    step: "03",
    title: "Clear LKR Quote",
    desc: "Upfront cost breakdown via WhatsApp or email before any paid work begins.",
    color: "text-secondary",
  },
  {
    step: "04",
    title: "Precision Work",
    desc: "Clean hardware repair, upgrade installation, repasting, or custom assembly.",
    color: "text-secondary",
  },
  {
    step: "05",
    title: "24h Stress Test",
    desc: "Continuous CPU, GPU, memory, and thermal load checks until 100% stable.",
    color: "text-tertiary",
  },
  {
    step: "06",
    title: "Quality Delivery",
    desc: "Workshop pickup in Embilipitiya or shockproof island-wide courier dispatch.",
    color: "text-primary",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Section 1: Hero Header ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-space-2xl">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-55" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[140px] animate-orb-drift pointer-events-none" />
        <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-secondary-container/10 rounded-full blur-[120px] animate-orb-drift-delay pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-gutter-lg relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-space-xl">
            <div className="flex flex-col max-w-3xl">
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-high w-fit mb-space-md shadow-sm border border-primary/20"
              >
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(76,215,246,0.8)] animate-pulse" />
                <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
                  ESD-SAFE DIAGNOSTIC LAB // {SITE_LOCATION.toUpperCase()}
                </span>
              </motion.div>
              <h1 className="font-syne text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight uppercase">
                <MaskedReveal delay={0.05}>PC Repair, Custom Builds</MaskedReveal>{" "}
                <br />
                <MaskedReveal delay={0.16}>
                  <span className="text-shimmer">
                    &amp; Thermal Engineering
                  </span>
                </MaskedReveal>{" "}
                <br />
                <MaskedReveal delay={0.26}>For Every Setup</MaskedReveal>
              </h1>
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-body-lg text-on-surface-variant mt-space-md max-w-2xl"
              >
                From component-level motherboard triage and thermal repasting to full bespoke gaming and workstation builds — every service is bench-tested in {SITE_LOCATION} and backed by transparent LKR quotes.
              </motion.p>
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-wrap items-center gap-space-md mt-space-xl"
              >
                <Link
                  href="/contact"
                  className="relative overflow-hidden group inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne text-title-md transition-all shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="material-symbols-outlined text-[20px] relative z-10">
                    calendar_today
                  </span>
                  <span className="relative z-10">Book Service Slot</span>
                </Link>
                <a
                  href="#lab-tech"
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all hover:border-primary/40 hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    biotech
                  </span>
                  <span>Inspect Lab Equipment</span>
                </a>
              </motion.div>
            </div>

            {/* Hero Workshop Benchmark Card */}
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="w-full lg:w-[420px]"
            >
              <TiltSpotlightCard
                conicBorder
                sheen
                maxTilt={3}
                className="rounded-xl shadow-xl card-glow"
                innerClassName="bg-surface-container-low p-space-lg flex flex-col gap-space-md"
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-syne text-headline-sm text-on-surface">
                    Workshop Standards
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30">
                    {SITE_EST}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-space-sm relative z-10">
                  <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15 hover:border-primary/30 transition-colors">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                      Catalog Parts
                    </span>
                    <span className="font-mono text-telemetry-num text-primary mt-1">
                      <AnimatedNumber value={`${TOTAL_SHOP_ITEMS} Items`} />
                    </span>
                  </div>
                  <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15 hover:border-secondary/30 transition-colors">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                      Standard Triage
                    </span>
                    <span className="font-mono text-telemetry-num text-secondary mt-1">
                      24–48 Hours
                    </span>
                  </div>
                  <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15 hover:border-tertiary/30 transition-colors">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                      Burn-In Check
                    </span>
                    <span className="font-mono text-telemetry-num text-tertiary mt-1">
                      24h Load Run
                    </span>
                  </div>
                  <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15 hover:border-primary/30 transition-colors">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                      Testing Warranty
                    </span>
                    <span className="font-mono text-telemetry-num text-primary mt-1">
                      06 Months
                    </span>
                  </div>
                </div>

                {/* Stability Benchmark Meter */}
                <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs border border-outline-variant/15 relative z-10">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface">
                      Pre-Delivery Verification Score
                    </span>
                    <span className="font-mono text-telemetry-num text-primary">
                      <AnimatedNumber value="100%" />
                    </span>
                  </div>
                  <LiveOscilloscope mode="secondary" className="my-1" />
                  <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.1, delay: 0.3, ease: EASE_PREMIUM }}
                      className="h-full bg-gradient-to-r from-secondary via-primary to-tertiary rounded-full shadow-[0_0_10px_rgba(76,215,246,0.5)]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-mono text-label-tech mt-1">
                    <span>Thermal Tested</span>
                    <span>Zero Shortcut Policy</span>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm pt-space-xs relative z-10">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified_user
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    ESD-Safe Workbench · {SITE_LOCATION}
                  </span>
                </div>
              </TiltSpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Core Service Offerings (Bento Grid) ── */}
      <RevealSection className="max-w-[1440px] mx-auto px-gutter-lg py-space-2xl w-full">
        <motion.div
          variants={fadeUpVariants}
          custom={0}
          className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl"
        >
          <div>
            <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
              // SERVICES_CATALOG
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface mt-space-xs uppercase">
              Core Engineering Services
            </h2>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-md">
            Honest LKR baselines and clear turnaround windows. Every job is approved with you upfront before we begin bench work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-lg">
          {SERVICES.map((srv, idx) => (
            <motion.div
              key={srv.id}
              id={srv.id}
              variants={fadeUpVariants}
              custom={idx}
              className={`${srv.span} scroll-mt-28`}
            >
              <SpotlightCard className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-lg hover:bg-surface-container transition-all duration-300 border border-outline-variant/15 hover:border-primary/40 hover:-translate-y-1 card-glow h-full">
                <div className="flex flex-col gap-space-md relative z-10">
                  <div className="flex items-center justify-between flex-wrap gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <span
                        className={`p-space-xs ${srv.bgColor} ${srv.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          {srv.icon}
                        </span>
                      </span>
                      <span className={`font-mono text-label-tech ${srv.color}`}>
                        {srv.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high font-mono text-[10px] text-secondary uppercase border border-secondary/20">
                        {srv.tat}
                      </span>
                      <span className="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary-container font-mono text-telemetry-num font-bold">
                        {srv.price}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-syne text-headline-sm text-on-surface mt-space-xs group-hover:text-primary transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {srv.desc}
                  </p>

                  {srv.specs && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-xs">
                      {srv.specs.map((item, i) => (
                        <div
                          key={i}
                          className="bg-surface-container-high p-space-sm rounded-lg flex items-start gap-space-xs border border-outline-variant/10 hover:border-primary/25 transition-colors"
                        >
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <div className="flex flex-col">
                            <span className="font-syne text-title-md text-on-surface">
                              {item.title}
                            </span>
                            <span className="text-body-sm text-on-surface-variant">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {srv.rows && (
                    <div className="flex flex-col gap-space-xs mt-space-xs">
                      {srv.rows.map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-body-sm p-space-xs rounded bg-surface-container-high border border-outline-variant/10"
                        >
                          <span className="text-on-surface">{row.label}</span>
                          <span className="font-mono text-label-tech text-secondary font-bold">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {srv.highlight && (
                    <div className="bg-surface-container-high p-space-sm rounded-lg flex flex-col gap-1 border border-outline-variant/10">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                        {srv.highlight.label}
                      </span>
                      <span
                        className={`font-syne text-[32px] ${srv.color} font-bold tracking-tight`}
                      >
                        {srv.highlight.metric}
                      </span>
                      <span className="text-body-sm text-outline">
                        {srv.highlight.note}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-space-lg pt-space-sm flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest/50 p-space-sm rounded-lg border-t border-outline-variant/10 relative z-10">
                  <span className="font-mono text-label-tech text-on-surface-variant">
                    {srv.footer || "Transparent bench workflow & warranty coverage."}
                  </span>
                  <Link
                    href="/contact"
                    className={`inline-flex items-center gap-space-xs ${srv.color} font-syne text-title-md hover:underline group/link`}
                  >
                    <span>{srv.action}</span>
                    <span className="material-symbols-outlined text-[18px] group-hover/link:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ── Section 3: Diagnostic Bench Equipment Showcase ── */}
      <RevealSection
        className="max-w-[1440px] mx-auto px-gutter-lg py-space-2xl w-full"
        id="lab-tech"
      >
        <motion.div
          variants={fadeUpVariants}
          custom={0}
          className="flex flex-col gap-space-xs mb-space-xl"
        >
          <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
            // BENCH_EQUIPMENT
          </span>
          <h2 className="font-syne text-headline-lg text-on-surface uppercase">
            Precision Diagnostic Bench Setup
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Proper bench instrumentation takes the guesswork out of repairs and ensures every custom PC leaves cooled, verified, and reliable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {LAB_INSTRUMENTS.map((inst, i) => (
            <motion.div key={i} variants={scaleInVariants} custom={i}>
              <SpotlightCard className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant/20 hover:border-primary/40 hover:-translate-y-1.5 card-glow h-full">
                <div className="flex flex-col gap-space-md relative z-10">
                  <div className="w-full h-44 rounded-lg overflow-hidden relative bg-surface-container scan-overlay">
                    <Image
                      src={inst.image}
                      alt={inst.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-2 right-2 px-space-xs py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-primary border border-primary/20">
                      {inst.res}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`font-mono text-label-tech ${inst.color} uppercase`}>
                      {inst.category}
                    </span>
                    <h4 className="font-syne text-title-md text-on-surface group-hover:text-primary transition-colors">
                      {inst.title}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {inst.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm border-t border-outline-variant/15 relative z-10">
                  <span className="font-mono text-label-tech text-outline">
                    {inst.cal}
                  </span>
                  <span className="font-mono text-telemetry-num text-secondary font-bold">
                    ACTIVE
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ── Section 4: Engineering Lifecycle Pipeline ── */}
      <RevealSection className="max-w-[1440px] mx-auto px-gutter-lg py-space-xl w-full">
        <div className="bg-surface-container-low rounded-2xl p-space-xl md:p-space-2xl shadow-xl relative overflow-hidden border border-outline-variant/20">
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="flex flex-col gap-space-xs mb-space-2xl text-center items-center"
          >
            <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
              // WORKSHOP_PROCESS
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface uppercase">
              Service &amp; Build Pipeline
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl">
              From intake inspection to 24-hour stability checks, every step is documented and shared transparently with you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-gutter-sm relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, ease: EASE_PREMIUM }}
              style={{ transformOrigin: "left" }}
              className="hidden lg:block absolute top-10 left-12 right-12 h-0.5 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-50 z-0"
            />

            {PIPELINE_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUpVariants}
                custom={i}
                className="flex flex-col items-center text-center relative z-10 gap-space-sm group"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-surface-container-high ${step.color} flex items-center justify-center font-mono text-[20px] font-bold shadow-[0_0_15px_rgba(76,215,246,0.2)] border border-outline-variant/20 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-cyan-glow transition-all duration-300`}
                >
                  {step.step}
                </div>
                <span className="font-syne text-title-md text-on-surface group-hover:text-primary transition-colors">
                  {step.title}
                </span>
                <p className="text-body-sm text-on-surface-variant">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Section 5: CTA Strip ── */}
      <RevealSection className="w-full py-space-xl px-gutter-lg bg-surface">
        <motion.div
          variants={scaleInVariants}
          custom={0}
          className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-space-md py-space-xl px-space-md rounded-2xl bg-surface-container border border-primary/20 relative overflow-hidden"
        >
          <h2 className="font-syne text-headline-lg text-on-surface">
            Need PC Repair, Upgrades, or a Custom Build?
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl">
            Visit our {SITE_LOCATION} workshop, submit an online intake ticket, or reach out directly on WhatsApp for fast quotes across Sri Lanka.
          </p>
          <div className="flex flex-wrap justify-center gap-space-md pt-space-xs">
            <Link
              href="/contact"
              className="relative overflow-hidden group px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Start Intake Ticket</span>
            </Link>
            <a
              href={SITE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-space-xl py-space-md rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-title-md font-bold transition-all hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/pricing"
              className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all hover:-translate-y-0.5"
            >
              View LKR Rate Card
            </Link>
          </div>
        </motion.div>
      </RevealSection>
    </div>
  );
}
