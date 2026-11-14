"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TOTAL_SHOP_ITEMS } from "@/lib/shopData";
import {
  SITE_NAME,
  SITE_EST,
  SITE_FOUNDED_DATE,
  SITE_FOUNDER,
  SITE_LOCATION,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_WHATSAPP_URL,
  AQUA_PC_PARTS_URL,
} from "@/lib/constants";
import {
  RevealSection,
  SpotlightCard,
  TiltSpotlightCard,
  MaskedReveal,
  CircuitFlowBackdrop,
  fadeUpVariants,
  scaleInVariants,
} from "@/components/ui/MotionPrimitives";

const CORE_PILLARS = [
  {
    code: "01",
    title: "Grade-A Hardware Curation",
    desc: "Every processor, motherboard, GPU, RAM module, and storage drive is personally inspected and bench-tested for silicon stability before it reaches your hands.",
    icon: "verified_user",
    tag: "QUALITY GUARANTEED",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    code: "02",
    title: "Zero Thermal Throttling",
    desc: "Every custom build and cooling upgrade is tuned for optimal fluid and air thermodynamics, sustaining boost clocks under heavy multi-hour workloads.",
    icon: "device_thermostat",
    tag: "OPTIMIZED THERMALS",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    code: "03",
    title: "Component-Level Diagnostics",
    desc: "We diagnose motherboards and GPUs down to traces, power rails, and SMD components—rescuing high-value hardware rather than pushing costly full replacements.",
    icon: "precision_manufacturing",
    tag: "MICRO DIAGNOSTICS",
    color: "text-tertiary",
    bgColor: "bg-tertiary/10",
    borderColor: "border-tertiary/20",
  },
  {
    code: "04",
    title: "Direct & Honest Pricing",
    desc: "Transparent quotes, verified parts, and genuine advice. No hidden costs, no unnecessary upselling—just the right hardware tailored for your exact budget.",
    icon: "handshake",
    tag: "TRANSPARENT VALUE",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
];

const LAB_CAPABILITIES = [
  {
    title: "Extensive Hardware Catalog",
    desc: `${TOTAL_SHOP_ITEMS} processors, motherboards, GPUs, SSDs, and accessories cataloged and quality-tested, ready for delivery across Sri Lanka.`,
    icon: "memory",
  },
  {
    title: "Bespoke Custom Rigs",
    desc: "Handcrafted desktop builds tailored for high-FPS competitive esports, 4K video rendering, 3D modeling, and everyday productivity.",
    icon: "desktop_windows",
  },
  {
    title: "24-Hour Stress Testing",
    desc: "Every complete machine undergoes rigorous thermal cycling, Prime95, and 3DMark burn-in tests to guarantee 100% rock-solid stability.",
    icon: "speed",
  },
  {
    title: "Island-wide Safe Delivery",
    desc: "Secure, anti-static shockproof packaging with fast courier shipping across Sri Lanka or direct local pickup in Embilipitiya.",
    icon: "local_shipping",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Hero Section ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-xl lg:py-space-2xl px-gutter-lg">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.18),rgba(11,18,41,0))] pointer-events-none" />
        <div className="absolute -right-32 top-10 w-96 h-96 rounded-full bg-secondary/10 blur-[120px] animate-orb-drift pointer-events-none" />

        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex flex-wrap items-center gap-space-sm mb-space-md"
          >
            <span className="px-space-md py-1 rounded-full bg-surface-container-high text-primary font-mono text-label-tech tracking-wider uppercase border border-primary/20">
              {SITE_NAME.toUpperCase()} // ABOUT &amp; ORIGIN
            </span>
            <span className="text-outline font-mono text-label-tech">
              // {SITE_EST} • {SITE_LOCATION.toUpperCase()}
            </span>
          </motion.div>

          <div className="max-w-4xl flex flex-col gap-space-md">
            <h1 className="font-syne text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight">
              <MaskedReveal delay={0.05}>Engineered by an Enthusiast. Built for</MaskedReveal>{" "}
              <MaskedReveal delay={0.18}>
                <span className="text-shimmer">
                  Peak Performance.
                </span>
              </MaskedReveal>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed"
            >
              Founded on November 6, 2026 in Embilipitiya, Sri Lanka, Aqua PC Solutions was created to deliver authentic Grade-A hardware, custom liquid and thermal engineering, and transparent diagnostic repairs to gamers, creators, and professionals.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-sm"
            >
              {[
                { label: "FOUNDED DATE", value: "11.06.2026", sub: SITE_FOUNDED_DATE, labelColor: "text-primary", valueColor: "text-on-surface" },
                { label: "HEADQUARTERS", value: "Embilipitiya", sub: "Sri Lanka", labelColor: "text-secondary", valueColor: "text-secondary" },
                { label: "FOUNDER", value: SITE_FOUNDER, sub: "Lead Specialist", labelColor: "text-tertiary", valueColor: "text-on-surface" },
                { label: "SUPPORT", value: "WhatsApp", sub: "Direct Founder Chat", labelColor: "text-primary", valueColor: "text-primary" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="p-space-md rounded-xl bg-surface-container shadow-md flex flex-col gap-1 border border-outline-variant/15 hover:border-primary/35 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className={`font-mono text-label-tech ${fact.labelColor}`}>
                    {fact.label}
                  </span>
                  <span className={`font-syne text-title-md sm:text-headline-sm ${fact.valueColor}`}>
                    {fact.value}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {fact.sub}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Founder Spotlight & Brief Story Section ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {/* Founder Visual Card */}
          <motion.div
            variants={scaleInVariants}
            custom={0}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <TiltSpotlightCard
              conicBorder
              sheen
              maxTilt={4}
              className="w-full max-w-md rounded-2xl shadow-2xl"
              innerClassName="bg-surface-container"
            >
              {/* Photo Frame */}
              <div className="relative w-full aspect-[4/5] bg-surface-container-high overflow-hidden scan-overlay">
                <Image
                  src="/images/founder.jpg"
                  alt="S.L.K Thinul Hansana - Founder of Aqua PC Solutions"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 420px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/30 flex items-center gap-2 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,1)] animate-pulse" />
                  <span className="font-mono text-label-tech text-primary uppercase font-bold tracking-wider">
                    FOUNDER &amp; HARDWARE LEAD
                  </span>
                </div>
              </div>

              {/* Founder Details Box */}
              <div className="p-space-lg flex flex-col gap-space-sm bg-surface-container relative z-10">
                <div>
                  <h2 className="font-syne text-headline-md text-on-surface">
                    S.L.K Thinul Hansana
                  </h2>
                  <p className="font-mono text-label-tech text-secondary">
                    Founder &amp; Systems Architect — Aqua PC Solutions
                  </p>
                </div>

                <p className="text-body-sm text-on-surface-variant italic">
                  &ldquo;Every computer we build or repair is treated with masterwork care. We believe gamers and creators deserve genuine silicon, pristine thermals, and honest support.&rdquo;
                </p>

                <div className="pt-space-xs flex flex-col sm:flex-row gap-space-xs">
                  <a
                    href={SITE_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-space-md rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-syne text-body-md font-semibold flex items-center justify-center gap-2 border border-[#25D366]/30 transition-all hover:-translate-y-0.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a
                    href={SITE_PHONE_HREF}
                    className="py-2.5 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-md font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-all hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      call
                    </span>
                    <span>{SITE_PHONE_DISPLAY}</span>
                  </a>
                </div>
              </div>
            </TiltSpotlightCard>
          </motion.div>

          {/* Story Narrative */}
          <motion.div
            variants={fadeUpVariants}
            custom={1}
            className="lg:col-span-7 flex flex-col gap-space-lg"
          >
            <div>
              <span className="font-mono text-label-tech text-secondary uppercase tracking-widest block mb-1">
                // THE AQUA PC SOLUTIONS STORY
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Born from Passion. Rooted in Precision.
              </h2>
            </div>

            <div className="flex flex-col gap-space-md text-body-md text-on-surface-variant leading-relaxed">
              <p>
                Aqua PC Solutions was officially established on <strong className="text-on-surface">November 6, 2026 (11.06.2026)</strong> in <strong className="text-on-surface">Embilipitiya, Sri Lanka</strong> by founder and hardware enthusiast <strong className="text-on-surface">S.L.K Thinul Hansana</strong>.
              </p>

              <p>
                Having spent years analyzing PC architectures, benchmarking silicon, and building custom cooling solutions, Thinul identified a common frustration among local enthusiasts: it was increasingly difficult to source genuinely tested Grade-A hardware at fair prices, and reliable component-level repair was almost nonexistent.
              </p>

              <p>
                Rather than treating PC assembly as a commodity, Thinul launched Aqua PC Solutions with a clear mission: provide Sri Lankan gamers, creators, and power users with certified hardware, zero-compromise thermal engineering, and transparent technical diagnostic services.
              </p>

              <p>
                Today, {SITE_NAME} supplies {TOTAL_SHOP_ITEMS} rigorously categorized components—from Intel Core and AMD Ryzen processors to motherboards, graphics cards, solid-state storage, power supplies, monitors, and cooling—all backed by direct technical support and personal warranty verification.
              </p>
            </div>

            {/* Quick Fact Badges */}
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <div>
                  <span className="block font-mono text-[11px] text-on-surface-variant uppercase">Established</span>
                  <span className="font-syne text-body-md text-on-surface font-bold">11.06.2026</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <span className="block font-mono text-[11px] text-on-surface-variant uppercase">Headquarters</span>
                  <span className="font-syne text-body-md text-on-surface font-bold">Embilipitiya, LK</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0 border border-tertiary/20">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div>
                  <span className="block font-mono text-[11px] text-on-surface-variant uppercase">Founder</span>
                  <span className="font-syne text-body-md text-on-surface font-bold">{SITE_FOUNDER}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* ── Core Values & Engineering Standards ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface-container-low border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
          >
            <div>
              <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
                // WHAT DEFINES US
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface mt-1">
                Our Foundational Standards
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Every system and individual component that leaves Aqua PC Solutions meets strict benchmarks for stability, thermal performance, and longevity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {CORE_PILLARS.map((pillar, i) => (
              <motion.div key={pillar.code} variants={fadeUpVariants} custom={i}>
                <SpotlightCard className="p-space-lg rounded-2xl bg-surface-container flex flex-col justify-between hover:bg-surface-container-high transition-all duration-300 shadow-md border border-outline-variant/15 hover:border-primary/40 hover:-translate-y-1.5 card-glow h-full">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-space-md">
                      <span className="font-mono text-label-tech text-primary bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant/20">
                        {pillar.code}
                      </span>
                      <div className={`w-10 h-10 rounded-lg ${pillar.bgColor} flex items-center justify-center ${pillar.color} border ${pillar.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                        <span className="material-symbols-outlined text-[22px]">
                          {pillar.icon}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-syne text-headline-sm text-on-surface mb-space-xs group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant">
                      {pillar.desc}
                    </p>
                  </div>
                  <div
                    className={`pt-space-lg flex items-center gap-space-xs ${pillar.color} font-mono text-label-tech relative z-10`}
                  >
                    <span>{pillar.tag}</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Services & Capabilities Bento ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="flex flex-col gap-space-xs text-center max-w-2xl mx-auto"
          >
            <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
              // EXPERTISE &amp; SERVICES
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface">
              Built for Gamers, Creators &amp; Power Users
            </h2>
            <p className="text-body-md text-on-surface-variant">
              From individual component upgrades to full custom liquid-cooled systems, explore how Aqua PC Solutions powers your computing needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {LAB_CAPABILITIES.map((cap, i) => (
              <motion.div key={cap.title} variants={scaleInVariants} custom={i}>
                <SpotlightCard
                  glowColor="rgb(var(--color-secondary) / 0.14)"
                  className="p-space-lg rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all duration-300 flex flex-col gap-space-sm border border-outline-variant/15 hover:border-secondary/40 shadow-sm hover:-translate-y-1.5 card-glow h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 group-hover:scale-110 transition-transform relative z-10">
                    <span className="material-symbols-outlined text-[24px]">
                      {cap.icon}
                    </span>
                  </div>
                  <h3 className="font-syne text-title-md text-on-surface group-hover:text-secondary transition-colors relative z-10">
                    {cap.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant relative z-10">
                    {cap.desc}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Call To Action Banner ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface-container-lowest border-t border-outline-variant/15">
        <motion.div
          variants={scaleInVariants}
          custom={0}
          className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-space-md py-space-xl px-space-md rounded-2xl bg-surface-container border border-primary/20 shadow-xl relative overflow-hidden"
        >
          <span className="px-space-md py-1 rounded-full bg-primary/10 text-primary font-mono text-label-tech tracking-wider uppercase border border-primary/20">
            CONNECT WITH AQUA PC SOLUTIONS
          </span>
          <h2 className="font-syne text-headline-lg text-on-surface max-w-xl">
            Ready to Build or Upgrade Your Dream Setup?
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl">
            Get in touch directly with founder S.L.K Thinul Hansana for custom build recommendations, part availability, or technical diagnostic inquiries.
          </p>
          <div className="flex flex-wrap justify-center gap-space-md pt-space-xs">
            <a
              href={SITE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-space-xl py-space-md rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-syne text-title-md font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Inquiry</span>
            </a>
            <a
              href={AQUA_PC_PARTS_URL}
              className="relative overflow-hidden group px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Explore Aqua PC Parts</span>
            </a>
            <Link
              href="/contact"
              className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </RevealSection>
    </div>
  );
}
