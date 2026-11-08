"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const TEAM_MEMBERS = [
  {
    name: "Dr. Elena Vance",
    role: "Chief Hardware Architect",
    spec: "ARCHITECTURE",
    bio: "Former senior semiconductor validation specialist. Over a decade analyzing silicon tolerances, lithography stepping variance, and hyper-dense VRM topologies for extreme stability.",
    focus: "Silicon Binning & VRM",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQluUJ47xmJOVtD-sJJky87yse07ULtotthtXNWuLZLMpNa0SYaajPsrae0vTGfF0f2JnMWJrZWsP5efWajAwfofzePVbZeSX_UXo-h8hCdOGla0OeDecgdrV9UJiiYSFkf9ByqkKTSTFFIEoNNSMeKsTMgxknrck1T-kgZAoEOIbWMjunuC3zRcVHXYtXDtyVb3RbJ99E1tGBx-RoNcn5ozCuIiQELvyz6VXCU_gO",
  },
  {
    name: "Marcus Thorne",
    role: "Master Liquid Cooling Modder",
    spec: "FLUID DYNAMICS",
    bio: "Internationally recognized custom loop modder and CNC manifold fabricator. Pioneers dual-loop flow channel manifolds that minimize head pressure while eliminating micro-cavitation.",
    focus: "Manifold CNC & Hydro",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwgzsbj9NKBkmSh5V0BqidW1YYNTIS5ZKzmpCqsIBt4sbkBFK9yHK7HVun_mSRWaWocxZtsxP6UdMC_5gq35RrB3SVVW97LuLvXVTATaHhWA5fo1HQ4j8-iogz74ZKXRzrt47nB7qOLS2Ul9lEdMJYNX4o2N56l-oVoj-kdzeRHZY5zQeXmoKPk6eis4d9-TcwJhNxkKrP2jk9BiRJFO152zhtih7r5236sslRUnYh",
  },
  {
    name: "Sarah Jenkins",
    role: "Lead Diagnostic & Repair Tech",
    spec: "MICRO-SURGERY",
    bio: "Precision component-level solderer with over 8,000 successful board restorations. Expert in multilayer PCB trace rebuilding, high-pitch BGA GPU re-flowing, and MOSFET trace repair.",
    focus: "BGA Reballing & Traces",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEKQpoMDMl5-QreQTDqUVUi6aB_k4vciyWJoxNWptHflW1y0JMGzfeexSh_yEe3I3tahUSQH__8X19eHi2QTMLsc9P0D_mtOA4J1zXWDY498JMx_sR1Xia3hqVuE0qCJa2sIRfjkWPK9Xwa31oWgvEcFZjGGRrlTruHRScE9V0hqSri3PrtFwag-9yuX9zO2jeT49RaXERlkoHoNeNSnyjztSeL7LNQPENWfREcINQ",
  },
  {
    name: "David Chen",
    role: "Enterprise & AI Infra Lead",
    spec: "AI WORKSTATIONS",
    bio: "Designs multi-GPU Threadripper and Xeon clusters for local deep learning inference and VFX rendering houses. Configures redundant sub-systems for 24/7/365 mission-critical duty.",
    focus: "Multi-GPU & ECC Memory",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTOWCkPOAx5cEtsEyPq5jHgqLGeDnj2PK-4nrhu8dIpS9lutvo5CK3QQoNHlMpCg-mK5y5lnqEPtRCtCDnEHT3RA7hqcLbRrsdo0s8n6vb80JYzWnmZwZk1iGe-1Tl1ugKi73WOUuEyz97g_WyRAuXFERE1YUnU8AwB5NsmGfrkkX1CmzNgKss1POpq_FbQ0N_RIMgdhEKjWpG3wJykSR2b_KV6cJITnwloE1YvO2e",
  },
];

const PROTOCOLS = [
  {
    code: "PR-01",
    title: "Silicon Purity & Authenticity",
    desc: "100% genuine factory sealed hardware sourced via direct authorized tier-1 channels. Every processor undergoes SP rating classification and cold boot stress verification before system pairing.",
    footer: "DIRECT OEM WARRANTY",
    icon: "verified_user",
    color: "text-primary",
  },
  {
    code: "PR-02",
    title: "Zero Thermal Throttling",
    desc: "Every bespoke loop configuration is engineered around a stringent thermal ceiling: sub-65°C under continuous 100% rendering and compute load. No micro-stutter, no frequency drops.",
    footer: "ΔT < 8°C COOLANT FLUID",
    icon: "device_thermostat",
    color: "text-secondary",
  },
  {
    code: "PR-03",
    title: "Precision Micro-Soldering",
    desc: "We rescue high-value GPUs and motherboards down to SMD component, power trace, and VRAM reballing levels. Repairing the microscopic prevents unnecessary multi-thousand-dollar replacements.",
    footer: "MICROSCOPIC BGA LEVEL",
    icon: "precision_manufacturing",
    color: "text-tertiary",
  },
  {
    code: "PR-04",
    title: "Sustainable Tech Lifecycle",
    desc: "Responsibly diverting e-waste. Usable copper blocks are ultrasonically stripped and electro-replated, unrepairable circuit silicon is refined, and non-hazardous coolants are chemically recycled.",
    footer: "CIRCULAR TECH INITIATIVE",
    icon: "recycling",
    color: "text-primary",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Dynamic Hero / Origin Narrative Section ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-2xl px-gutter-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.18),rgba(11,18,41,0))] pointer-events-none" />
        <div className="absolute -right-32 top-10 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="flex flex-wrap items-center gap-space-sm mb-space-md">
            <span className="px-space-md py-1 rounded-full bg-surface-container-high text-primary font-mono text-label-tech tracking-wider uppercase border border-primary/20">
              ARCHIVAL DOSSIER: ORIGIN PROTOCOL
            </span>
            <span className="text-outline font-mono text-label-tech">
              // REV. 2024.11
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <h1 className="font-syne text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight">
                Engineered by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">
                  Enthusiasts
                </span>
                .<br />
                Built for Uncompromising Performance.
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Aqua PC Parts &amp; Services emerged in 2018 inside an underground competitive benching lab. Founded by hardware electrical engineers and top-tier extreme overclockers, we rejected the disposable consumer tech paradigm. Instead, we established an uncompromising standard: relentless silicon binning, surgical micro-soldering, and closed-loop hydrodynamic thermals capable of sustaining peak clock frequencies indefinitely.
              </p>

              <div className="grid grid-cols-3 gap-space-md pt-space-sm">
                <div className="p-space-md rounded-xl bg-surface-container shadow-md flex flex-col gap-1 border border-outline-variant/15">
                  <span className="font-mono text-label-tech text-primary">
                    OPERATIONAL SINCE
                  </span>
                  <span className="font-syne text-headline-md text-on-surface">
                    2018
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    Cleanroom Calibrated
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container shadow-md flex flex-col gap-1 border border-outline-variant/15">
                  <span className="font-mono text-label-tech text-secondary">
                    MAX TARGET TEMP
                  </span>
                  <span className="font-syne text-headline-md text-secondary">
                    &lt; 65°C
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    Sustained AVX-512 Load
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container shadow-md flex flex-col gap-1 border border-outline-variant/15">
                  <span className="font-mono text-label-tech text-tertiary">
                    REPAIR YIELD RATE
                  </span>
                  <span className="font-syne text-headline-md text-on-surface">
                    94.7%
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    BGA &amp; Traces Saved
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden bg-surface-container-high shadow-2xl relative group border border-primary/20">
                <div className="relative w-full h-[460px]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp5XScZK4J0J5uZcjpWUe9tLQHruoNtDTru3Suf2QQO7OzsRmeNGxFYv0m7kUcGuQj93-k-oFAsXVhdM5yq_I7ELDoqXrKkZzS9zze64mlZroyW5zOBLo-zK44XVE789CnAk6nIlUwmE7MyekZpeBE9rkKcH3qNNWMTFysyb_1jtMfjLpUeu2pAAyCeN59NN_rKXKwLKGaHhneSjgKLO0rDfYMutiY9bfXvwM2qvBm"
                    alt="Cleanroom laboratory workbench in deep abyssal cyan tones"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-space-lg flex items-center justify-between">
                    <div>
                      <span className="font-mono text-label-badge text-primary uppercase tracking-widest block">
                        AQUA BENCHMARK RIG 01
                      </span>
                      <span className="font-syne text-title-md text-on-surface">
                        Sub-Ambient Fluid Tunnel
                      </span>
                    </div>
                    <span className="flex h-3 w-3 rounded-full bg-secondary shadow-[0_0_12px_rgba(79,219,200,0.9)] animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-surface-container p-space-md rounded-xl shadow-xl backdrop-blur-md max-w-xs border border-primary/20">
                <div className="flex items-center gap-space-xs mb-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    verified
                  </span>
                  <span className="font-mono text-label-tech text-on-surface">
                    ISO Class 6 Certified Bay
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Sub-micron particulate filtering ensures zero contamination in loop blocks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values & Engineering Standards ── */}
      <section className="w-full py-space-2xl px-gutter-lg bg-surface">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-mono text-label-tech text-secondary tracking-widest uppercase">
                // 02 PROTOCOLS &amp; RIGOR
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface mt-1">
                Foundational Engineering Standards
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Consumer PCs fail because corners are cut in power delivery and thermal dispersion. Here is how we build differently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {PROTOCOLS.map((protocol) => (
              <div
                key={protocol.code}
                className="p-space-lg rounded-2xl bg-surface-container flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-md group border border-outline-variant/15 hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="font-mono text-label-tech text-primary bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant/20">
                      {protocol.code}
                    </span>
                    <span
                      className={`material-symbols-outlined ${protocol.color} group-hover:scale-110 transition-transform`}
                    >
                      {protocol.icon}
                    </span>
                  </div>
                  <h3 className="font-syne text-headline-sm text-on-surface mb-space-xs">
                    {protocol.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {protocol.desc}
                  </p>
                </div>
                <div
                  className={`pt-space-lg flex items-center gap-space-xs ${protocol.color} font-mono text-label-tech`}
                >
                  <span>{protocol.footer}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Thermal Telemetry & Architecture Comparison ── */}
      <section className="w-full py-space-xl px-gutter-lg bg-surface-container-low border-y border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
              // RIGOROUS BENCH DATA
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface">
              The Aqua Hydro-Curve vs. Generic Air/AIO
            </h2>
            <p className="text-body-md text-on-surface-variant">
              While standard mass-market builds rapidly heat-soak within 15 minutes, our custom parallel manifolds and triple-pass radiators lock thermals in equilibrium at ambient delta +18°C.
            </p>

            <div className="flex flex-col gap-space-sm mt-space-xs">
              <div className="flex items-center justify-between font-mono text-label-tech text-on-surface">
                <span>AQUA CUSTOM LOOP (DUAL 480MM RADS)</span>
                <span className="text-secondary font-bold">54°C STEADY</span>
              </div>
              <div className="w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary w-[54%] rounded-full shadow-[0_0_10px_rgba(79,219,200,0.8)]" />
              </div>

              <div className="flex items-center justify-between font-mono text-label-tech text-on-surface-variant mt-space-xs">
                <span>STANDARD 360MM AIO COOLER</span>
                <span className="text-primary font-bold">78°C WARM</span>
              </div>
              <div className="w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-primary/70 w-[78%] rounded-full" />
              </div>

              <div className="flex items-center justify-between font-mono text-label-tech text-on-surface-variant mt-space-xs">
                <span>GENERIC STOCK DUAL FAN AIR COOLER</span>
                <span className="text-error font-bold">96°C THROTTLED</span>
              </div>
              <div className="w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-error w-[96%] rounded-full" />
              </div>
            </div>
          </div>

          {/* SVG Thermal Wave & Telemetry Cluster */}
          <div className="lg:col-span-7 bg-surface-container p-space-lg rounded-2xl shadow-xl flex flex-col gap-space-md border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(76,215,246,1)]" />
                <span className="font-syne text-headline-sm text-on-surface">
                  Transient Thermal Response (60-Min Run)
                </span>
              </div>
              <span className="font-mono text-label-tech text-outline">
                CH-04 SENSORS LIVE
              </span>
            </div>

            <div className="w-full h-48 bg-surface-container-lowest rounded-xl p-space-sm flex items-center justify-center relative overflow-hidden border border-outline-variant/20">
              <svg
                className="w-full h-full text-primary"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 600 160"
              >
                <line
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeOpacity="0.08"
                  x1="0"
                  x2="600"
                  y1="40"
                  y2="40"
                />
                <line
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeOpacity="0.08"
                  x1="0"
                  x2="600"
                  y1="80"
                  y2="80"
                />
                <line
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeOpacity="0.08"
                  x1="0"
                  x2="600"
                  y1="120"
                  y2="120"
                />

                {/* Standard Throttling Thermal Curve */}
                <path
                  d="M 0 130 Q 80 110, 150 60 T 300 25 T 450 20 T 600 18"
                  fill="none"
                  opacity="0.6"
                  stroke="#ffb4ab"
                  strokeDasharray="6 4"
                  strokeWidth="2"
                />

                {/* Aqua PC Flatlined Hydro Loop Curve */}
                <path
                  d="M 0 145 C 50 140, 100 100, 180 95 C 280 92, 420 90, 600 89"
                  fill="none"
                  stroke="#4cd7f6"
                  strokeWidth="3.5"
                />

                {/* Shaded cool zone below Aqua PC line */}
                <path
                  d="M 0 145 C 50 140, 100 100, 180 95 C 280 92, 420 90, 600 89 L 600 160 L 0 160 Z"
                  fill="url(#aquaGlow)"
                  opacity="0.2"
                />

                <defs>
                  <linearGradient id="aquaGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4cd7f6" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute right-4 top-4 bg-surface-container/90 px-space-sm py-1 rounded backdrop-blur font-mono text-label-tech text-secondary border border-secondary/30">
                ΔT Margin: -42.4°C Peak Delta
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="p-space-sm bg-surface-container-high rounded-lg text-center border border-outline-variant/15">
                <span className="block font-mono text-[10px] text-on-surface-variant">
                  FLUID FLOW RATE
                </span>
                <span className="font-mono text-telemetry-num text-primary">
                  4.82 L/MIN
                </span>
              </div>
              <div className="p-space-sm bg-surface-container-high rounded-lg text-center border border-outline-variant/15">
                <span className="block font-mono text-[10px] text-on-surface-variant">
                  LOOP HEAD PRESSURE
                </span>
                <span className="font-mono text-telemetry-num text-secondary">
                  3.9 PSI NOM
                </span>
              </div>
              <div className="p-space-sm bg-surface-container-high rounded-lg text-center border border-outline-variant/15">
                <span className="block font-mono text-[10px] text-on-surface-variant">
                  VOLTAGE RIPPLE
                </span>
                <span className="font-mono text-telemetry-num text-tertiary">
                  &lt; 9.4 mV
                </span>
              </div>
              <div className="p-space-sm bg-surface-container-high rounded-lg text-center border border-outline-variant/15">
                <span className="block font-mono text-[10px] text-on-surface-variant">
                  ACOUSTIC NOISE
                </span>
                <span className="font-mono text-telemetry-num text-on-surface">
                  19.2 dBA (IDLE)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Master Team & Hardware Specialists ── */}
      <section className="w-full py-space-2xl px-gutter-lg bg-surface">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs text-center max-w-3xl mx-auto">
            <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
              // THE ENGINEERING DIRECTORS
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface">
              Master Technicians &amp; Systems Architects
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Handcrafted builds and critical diagnostic procedures are managed by engineers with backgrounds spanning semiconductor fabrication, competitive modding, and datacenter hardware deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-surface-container rounded-2xl overflow-hidden shadow-lg flex flex-col hover:-translate-y-1.5 transition-transform duration-300 group border border-outline-variant/20 hover:border-primary/40"
              >
                <div className="relative h-72 overflow-hidden bg-surface-container-highest">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-surface-container-lowest/80 backdrop-blur px-space-xs py-0.5 rounded font-mono text-label-tech text-primary border border-primary/20">
                    SPEC: {member.spec}
                  </div>
                </div>

                <div className="p-space-lg flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-syne text-headline-sm text-on-surface">
                      {member.name}
                    </h3>
                    <span className="font-mono text-label-tech text-secondary block mb-space-sm">
                      {member.role}
                    </span>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                  <div className="pt-space-md mt-space-md bg-surface-container-high/50 p-space-sm rounded-lg flex items-center justify-between font-mono text-label-tech border border-outline-variant/15">
                    <span className="text-outline">Focus:</span>
                    <span className="text-on-surface">{member.focus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Laboratory & Workshop Virtual Showcase ── */}
      <section className="w-full py-space-2xl px-gutter-lg bg-surface-container-lowest border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
                // FACILITY SCAN
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface mt-1">
                The Aqua Research &amp; Assembly Bay
              </h2>
            </div>
            <div className="flex items-center gap-space-sm bg-surface-container px-space-md py-space-xs rounded-xl border border-secondary/30">
              <span className="flex h-2.5 w-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-mono text-label-tech text-on-surface">
                Facility Status: 100% OPERATIONAL (ESD-SECURE)
              </span>
            </div>
          </div>

          {/* Bento Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Bay 1: Cleanroom Assembly */}
            <div className="md:col-span-8 rounded-2xl bg-surface-container overflow-hidden shadow-xl relative group min-h-[380px] flex flex-col justify-end p-space-lg border border-outline-variant/20">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSc7OPt0Q3jyxB45NZwvQxBlI5M_vhQ_8VGt8ZqWQCz2LXk55XWPEX0rk59YV5ToagdQthCPIKm1xxivn_L6DGdDgfJWCBHqLbMObLTbVwfaPlc3yJShN4Wb3Vsq3d7y6fYFVENDB-3WslUPAiwB3EksI4WCQwdXY0DMg93U4R5hMX1iuqNdvZ87gtZPwYfUymU1q3DGIPKKfAdX89dwES4k6bOrBZUcAL_r9A4e3e')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
              <div className="relative z-10 flex flex-col gap-space-xs max-w-xl">
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-sm py-0.5 rounded bg-primary/20 text-primary font-mono text-label-tech uppercase border border-primary/30">
                    BAY 01
                  </span>
                  <span className="text-on-surface-variant font-mono text-label-tech">
                    ISO CLASS 6 SPEC
                  </span>
                </div>
                <h3 className="font-syne text-headline-md text-on-surface">
                  Static Cleanroom Assembly Bays
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Every Aqua PC chassis enters our pressurized assembly enclosure equipped with ionized air filtration and ESD-continuous grounding paths, guaranteeing component isolation from dust and static voltage discharges.
                </p>
              </div>
            </div>

            {/* Bay 2: CNC Reservoirs */}
            <div className="md:col-span-4 rounded-2xl bg-surface-container overflow-hidden shadow-xl relative group min-h-[380px] flex flex-col justify-end p-space-lg border border-outline-variant/20">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCt5wPEAgqDQ0N9M06B-id1i1hsboM7jF6mSOLJRPXxHOeUhdxDB2ajiqtwnn_f7uLUdTTVcpLACXBy44urBf7YHS74Zh6ilOfEv_TI7MsKAFLU2PAMIfr3SVsq2lNAWSIZeef-Pj-p5HxaXPobhWJl154zN2c_04QX06ADDTy-vdy2Dp8HSmhBydJzVn0c-iwFeR0VhxKD1Mb5hzoA2ppHPmyPY35OUHGW7OcRcIgW')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent" />
              <div className="relative z-10 flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-sm py-0.5 rounded bg-secondary/20 text-secondary font-mono text-label-tech uppercase border border-secondary/30">
                    BAY 02
                  </span>
                  <span className="text-on-surface-variant font-mono text-label-tech">
                    CNC MILLING
                  </span>
                </div>
                <h3 className="font-syne text-headline-sm text-on-surface">
                  Fluid Distribution CNC Bay
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Custom-milled cast PMMA distribution plates crafted in-house to millimeter tolerances, matching your exact GPU and pump dimensions.
                </p>
              </div>
            </div>

            {/* Bay 3: Diagnostics & Soldering */}
            <div className="md:col-span-4 rounded-2xl bg-surface-container overflow-hidden shadow-xl relative group min-h-[340px] flex flex-col justify-end p-space-lg border border-outline-variant/20">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4G7ZxvPLR_CpF92cgUiuAJOM_TaZo5qhsOtsy3vwzJdyVqk96dA9MmTx_JF6U-reN7yjhPy8zSaWvTn4iHwUL4EQocBF4gQaMTaauWtdHc2COeHknA9PHAtFydJsSfJ82rxO6G_QaP_aLEAiLzps8bKy14mN6DX697XSWSlWl3YvkEZ92cbhtX4oElqLZTxeh5z6DmGEZjdOSz6XOTwqiW3hrf29dfZjjVWuVtCjT')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent" />
              <div className="relative z-10 flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-sm py-0.5 rounded bg-tertiary/20 text-tertiary font-mono text-label-tech uppercase border border-tertiary/30">
                    BAY 03
                  </span>
                  <span className="text-on-surface-variant font-mono text-label-tech">
                    MICRO-SURGERY
                  </span>
                </div>
                <h3 className="font-syne text-headline-sm text-on-surface">
                  SMD Micro-Soldering Station
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Stereo optical zoom microscope arrays for precision BGA reballing, damaged trace bridging, and thermal imaging diagnostics.
                </p>
              </div>
            </div>

            {/* Bay 4: Silicon Stress-Test Chamber */}
            <div className="md:col-span-8 rounded-2xl bg-surface-container overflow-hidden shadow-xl relative group min-h-[340px] flex flex-col justify-end p-space-lg border border-outline-variant/20">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCN8UTLwD73J0AWYyu8-ZSrF8As2wjQY6d1v06xRPR0jdoQsz7iuoZVhyghZxpX6HpeW6OL5rU1GxPspprDmrn9rqjW1ZN57wj8v2jmenccTTYZS5Sdq2_3gPPTSwy6uCvfB4Lr6IJQw2_9bRKug9zr7ZkDQSfiI-lceU80rJfl14LTWq_KOsn8J1w2Fl-b-GrpLHoLbQASuj0eMFMJ0I1NfAFR913_8ZlGGfIFve5Z')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent" />
              <div className="relative z-10 flex flex-col gap-space-xs max-w-xl">
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-sm py-0.5 rounded bg-primary/20 text-primary font-mono text-label-tech uppercase border border-primary/30">
                    BAY 04
                  </span>
                  <span className="text-on-surface-variant font-mono text-label-tech">
                    BENCHMARK CHAMBER
                  </span>
                </div>
                <h3 className="font-syne text-headline-md text-on-surface">
                  24-Hour Burn-In Validation Chamber
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Every custom loop and repaired motherboard undergoes 24 hours of sustained AIDA64, Prime95, and 3DMark thermal cycling to verify absolute zero-leak and zero-throttle integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full py-space-xl px-gutter-lg bg-surface">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-space-md py-space-xl rounded-2xl bg-surface-container border border-primary/20">
          <h2 className="font-syne text-headline-lg text-on-surface">
            Meet Our Master Engineers in Austin
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl">
            Drop by our cleanroom facility or book a virtual session to discuss your next custom loop or complex hardware diagnosis.
          </p>
          <div className="flex gap-space-md pt-space-xs">
            <Link
              href="/contact"
              className="px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all"
            >
              Contact the Lab
            </Link>
            <Link
              href="/services"
              className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

