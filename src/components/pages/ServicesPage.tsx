"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  {
    id: "srv-01",
    code: "SRV-01 // DIAGNOSTICS",
    title: "Emergency Diagnostics & Component-Level Repair",
    desc: "Immediate triage for catastrophic hardware failures. We bypass basic part-swapping using board-level logic analysis, short-circuit injection, and micro-soldering precision.",
    price: "From $79",
    tat: "24-48h TAT",
    badgeType: "secondary",
    span: "lg:col-span-7",
    color: "text-primary",
    bgColor: "bg-primary-container/20",
    icon: "power_off",
    specs: [
      {
        title: "No-POST Circuit Trace",
        desc: "Oscilloscope bus & rail frequency verification",
      },
      {
        title: "BGA Re-balling & Solder",
        desc: "VRAM chips, VRM MOSFETs, SMD decoupling caps",
      },
      {
        title: "Short-Circuit Thermal Cam",
        desc: "FLIR detection down to 0.05°C resistance gradients",
      },
      {
        title: "NVMe / NAND Recovery",
        desc: "Hardware-level bridge controller raw data extraction",
      },
    ],
    footer: "Diagnostic fee credited directly to repair execution.",
    action: "Initiate Triage",
  },
  {
    id: "srv-02",
    code: "SRV-02 // HYDRO-LOOP",
    title: "Custom Hardline & Soft-Tube Liquid Cooling",
    desc: "Hydro-dynamic perfection. Acrylic, PMMA, and copper tubing routing with custom manifold distribution plates, pneumatic pressure validation, and biocide purification.",
    price: "From $249",
    tat: "Bespoke",
    badgeType: "primary",
    span: "lg:col-span-5",
    color: "text-secondary",
    bgColor: "bg-secondary-container/20",
    icon: "water_drop",
    rows: [
      { label: "Manifold Precision Cut", value: "CNC Milling 0.01mm" },
      { label: "Hydrostatic Pressure Seal", value: "2.0 BAR N2 Cert" },
      { label: "Biological Protection", value: "Glycol-Free Inhibitors" },
    ],
    footer: "Full 2-Year Anti-Leak Guarantee.",
    action: "Design Loop",
  },
  {
    id: "srv-03",
    code: "SRV-03 // THERMAL",
    title: "Thermal Overhaul & Delidding / Liquid Metal",
    desc: "Exposing raw silicon for direct-die cooling. We dissolve factory solder, coat SMDs in high-temp acrylic sealant, and apply gallium-indium thermal compound.",
    price: "From $89",
    tat: "Same Day",
    badgeType: "tertiary",
    span: "lg:col-span-4",
    color: "text-tertiary",
    bgColor: "bg-tertiary-container/20",
    icon: "thermostat",
    highlight: {
      label: "Observed Delta Drop",
      metric: "-18.4 °C AVG",
      note: "Tested on Intel i9-14900KS / AMD 7950X3D",
    },
    action: "View Delid Compatibility",
  },
  {
    id: "srv-04",
    code: "SRV-04 // TUNING",
    title: "Overclocking & BIOS Optimization",
    desc: "Granular memory sub-timing tuning (tRFC, tREFI), per-core voltage offset curve shaping, and comprehensive 24-hour AIDA64 / Karhu RAM burn-in certification.",
    price: "From $119",
    tat: "48h Cycle",
    badgeType: "primary",
    span: "lg:col-span-4",
    color: "text-primary",
    bgColor: "bg-primary-container/20",
    icon: "speed",
    highlight: {
      label: "Benchmark Validation",
      metric: "0 WHEA Errors",
      note: "Karhu RAM 10,000% Coverage guaranteed",
    },
    action: "Examine Profiles",
  },
  {
    id: "srv-05",
    code: "SRV-05 // ENTERPRISE",
    title: "Corporate AI & Render Fleet Advisory",
    desc: "Multi-GPU topology planning, PCIe lane arbitration, dual-PSU redundant delivery, and silent server-rack deployment for deep learning & architectural modeling.",
    price: "From $199",
    tat: "Priority SLA",
    badgeType: "secondary",
    span: "lg:col-span-4",
    color: "text-secondary",
    bgColor: "bg-secondary-container/20",
    icon: "hub",
    highlight: {
      label: "Fleet Reliability MTBF",
      metric: "99.98% Up",
      note: "Dedicated enterprise SLA agreement",
    },
    action: "Consultation Intake",
  },
];

const LAB_INSTRUMENTS = [
  {
    category: "Optical Diagnostics",
    title: "FLIR High-Res Thermal Imagers",
    desc: "Pinpoints microscopic current leakage and VRM choke degradation before fatal catastrophic shorting occurs.",
    res: "0.02°C Res",
    cal: "CALIBRATED: 08/2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzS0OV_GjMRxC5RSUeXfo3lNcFq8Vvts_5cT4tZ7OwKuUkR7IEGHhHwLxLvkvmQeXuUmQUWrGn6gnsf5HYn972wdgs0PoK5aZ1IheThPc2OoMu1LIT5JkAZDJQxm9FiZI1rh7JB5X9JersJ9ljXEOPiQWkGtCZUsMt7Z6_CTBPho6PYCF-1VJM9Dua-amja62E6qR2CzRrSsQbeuHkb797Z5ys2nKWSXMA2h6nKjWv",
    color: "text-primary",
  },
  {
    category: "Bus Verification",
    title: "Rigol 4-Channel Oscilloscopes",
    desc: "Analyzes clock signal jitter, SMBus handshakes, and PCIe lane signal integrity at nano-second resolution.",
    res: "1 GHz / 5 GSa/s",
    cal: "TRACE: BUS 0..3",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0GCc5lvH47moTUGucnRkAX24g5RkUIyG-Q0FCsFaMv0dU9YpTMg62s7Zy82sP0GA-6t90obCy2mebDUAGjrI67agMGplXcE_8TcG7vUGhugW1ckOEzZ1669a3FszNpC-t45nH6SBoRFYjjX7ZmpmeprqNxRbdbjFDE-oKqqVX1VwfbqFKKaoMP78dtnAfAebN3eVCGQzK-9Xn7fRLYQuI1cYpnWwxPk3CtWMv4vyT",
    color: "text-secondary",
  },
  {
    category: "Decontamination",
    title: "Ultrasonic Cavitation Baths",
    desc: "Removes sub-micron flux residue, corrosion oxide, and particulate matter from intricate micro-fin channels.",
    res: "40 kHz Sweep",
    cal: "SOLVENT: LAB-GRADE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsDcSJyCjEDKn-NL8IVOr_XuENglq7HbnYtYef3h4y1G-BQZ7EwHejc58vWjlBn-iRkoNUY4hhJWksmr8YIT_oHsKw9GvEft3Nsfylz7lSHSwFg2LssIJxyvRyGGACa7KipLRflOabPqF2aVzE7lxiKcEBJKHx0DkvyJNauYFZ3d58bNMYaCeannAemSmqdWFoaP3M0E3qF1HmYzfAYSFdPqn3-9trXJZtTO6O6j1v",
    color: "text-tertiary",
  },
  {
    category: "Pneumatic Seal",
    title: "Dry Nitrogen Testing Chambers",
    desc: "Pre-fill zero-moisture pressure retention chamber prevents hydro-leak contamination before liquid ever touches circuitry.",
    res: "N2 Gas Cert",
    cal: "SENSOR: DIGITAL BARO",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCN8UTLwD73J0AWYyu8-ZSrF8As2wjQY6d1v06xRPR0jdoQsz7iuoZVhyghZxpX6HpeW6OL5rU1GxPspprDmrn9rqjW1ZN57wj8v2jmenccTTYZS5Sdq2_3gPPTSwy6uCvfB4Lr6IJQw2_9bRKug9zr7ZkDQSfiI-lceU80rJfl14LTWq_KOsn8J1w2Fl-b-GrpLHoLbQASuj0eMFMJ0I1NfAFR913_8ZlGGfIFve5Z",
    color: "text-primary",
  },
];

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Intake & Visual Audit",
    desc: "High-resolution 360° macro photographic cataloging and ESD containment bagging.",
    color: "text-primary",
  },
  {
    step: "02",
    title: "Telemetry Diagnostic",
    desc: "Thermal scanning, oscilloscope rail traces, and memory parity checks run in parallel.",
    color: "text-primary",
  },
  {
    step: "03",
    title: "Transparent Quote",
    desc: "Itemized lab scope including part serial numbers and guaranteed flat-rate pricing.",
    color: "text-secondary",
  },
  {
    step: "04",
    title: "Precision Engineering",
    desc: "Micro-soldering, delidding, CNC tube routing, and thermal interface reconstruction.",
    color: "text-secondary",
  },
  {
    step: "05",
    title: "Burn-in Stress Test",
    desc: "24-hour AIDA64 / FurMark / Karhu RAM burn-in with continuous thermocouple tracking.",
    color: "text-tertiary",
  },
  {
    step: "06",
    title: "Delivery & Certification",
    desc: "Detailed telemetry dossier certificate and zero-leak verification documentation.",
    color: "text-primary",
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState("srv-01");

  return (
    <div className="flex flex-col w-full">
      {/* ── Section 1: Hero Header ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-space-2xl">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-gutter-lg relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-space-xl">
            <div className="flex flex-col max-w-3xl">
              <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-high w-fit mb-space-md shadow-sm border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(76,215,246,0.8)] animate-pulse" />
                <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
                  ISO-4 Standard Certified Clean Bench
                </span>
              </div>
              <h1 className="font-syne text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight uppercase">
                Comprehensive PC Repair, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">
                  Custom Architecture
                </span>{" "}
                <br />
                &amp; Expert Advisory
              </h1>
              <p className="text-body-lg text-on-surface-variant mt-space-md max-w-2xl">
                Specialized micro-soldering labs, calibrated fluid dynamics testing, and component-level triage executed by master hardware engineers. Every rig is treated as mission-critical infrastructure.
              </p>
              <div className="flex flex-wrap items-center gap-space-md mt-space-xl">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne text-title-md transition-all shadow-cyan-glow hover:shadow-cyan-glow-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_today
                  </span>
                  <span>Reserve Lab Slot</span>
                </Link>
                <a
                  href="#lab-tech"
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    biotech
                  </span>
                  <span>Inspect Lab Telemetry</span>
                </a>
              </div>
            </div>

            {/* Hero Telemetry Matrix HUD */}
            <div className="w-full lg:w-[420px] bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-md shadow-xl border border-primary/20 relative">
              <div className="flex items-center justify-between">
                <span className="font-syne text-headline-sm text-on-surface">
                  Lab Active Status
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30">
                  ALL SYSTEMS LIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                    Current Queue
                  </span>
                  <span className="font-mono text-telemetry-num text-primary mt-1">
                    4 Triage Units
                  </span>
                </div>
                <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                    Ambient Loop Temp
                  </span>
                  <span className="font-mono text-telemetry-num text-secondary mt-1">
                    19.4 °C Stable
                  </span>
                </div>
                <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                    Nitrogen Press.
                  </span>
                  <span className="font-mono text-telemetry-num text-tertiary mt-1">
                    1.82 BAR Test
                  </span>
                </div>
                <div className="bg-surface-container p-space-sm rounded-lg flex flex-col border border-outline-variant/15">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                    Soldering Station
                  </span>
                  <span className="font-mono text-telemetry-num text-primary mt-1">
                    360 °C Calibrated
                  </span>
                </div>
              </div>

              {/* Dynamic Load Gauge */}
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs border border-outline-variant/15">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface">
                    Thermal Dissipation Capacity
                  </span>
                  <span className="font-mono text-telemetry-num text-primary">
                    88.4%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary via-primary to-tertiary w-[88%] rounded-full shadow-[0_0_10px_rgba(76,215,246,0.5)]" />
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-mono text-label-tech mt-1">
                  <span>0 W</span>
                  <span>Load: 2400 W Max</span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm pt-space-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  verified_user
                </span>
                <span className="text-body-sm text-on-surface-variant">
                  Class 100 ESD-Grounding Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Core Service Offerings (Bento Grid) ── */}
      <section className="max-w-[1440px] mx-auto px-gutter-lg py-space-2xl w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div>
            <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
              // DEPT_SERVICES_CATALOG
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface mt-space-xs uppercase">
              Core Engineering Modules
            </h2>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-md">
            Transparent flat-rate diagnostic baselines paired with surgical component-level interventions. Select an active module to view testing criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-lg">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className={`${srv.span} bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-lg relative overflow-hidden group hover:bg-surface-container transition-all border border-outline-variant/15 hover:border-primary/40`}
            >
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between flex-wrap gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span
                      className={`p-space-xs ${srv.bgColor} ${srv.color} rounded-lg flex items-center justify-center`}
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

                <h3 className="font-syne text-headline-sm text-on-surface mt-space-xs">
                  {srv.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {srv.desc}
                </p>

                {/* Sub-specs if available */}
                {srv.specs && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-xs">
                    {srv.specs.map((item, i) => (
                      <div
                        key={i}
                        className="bg-surface-container-high p-space-sm rounded-lg flex items-start gap-space-xs border border-outline-variant/10"
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

                {/* Spec rows if available */}
                {srv.rows && (
                  <div className="flex flex-col gap-space-xs mt-space-xs">
                    {srv.rows.map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-body-sm p-space-xs rounded bg-surface-container-high"
                      >
                        <span className="text-on-surface">{row.label}</span>
                        <span className="font-mono text-label-tech text-secondary font-bold">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlight metric if available */}
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

              <div className="mt-space-lg pt-space-sm flex items-center justify-between bg-surface-container-lowest/50 p-space-sm rounded-lg border-t border-outline-variant/10">
                <span className="font-mono text-label-tech text-on-surface-variant">
                  {srv.footer || "Priority laboratory bench queuing."}
                </span>
                <Link
                  href="/contact"
                  className={`inline-flex items-center gap-space-xs ${srv.color} font-syne text-title-md hover:underline`}
                >
                  <span>{srv.action}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Diagnostic Laboratory Technology Showcase ── */}
      <section className="max-w-[1440px] mx-auto px-gutter-lg py-space-2xl w-full" id="lab-tech">
        <div className="flex flex-col gap-space-xs mb-space-xl">
          <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
            // INSTRUMENTATION_ARRAY
          </span>
          <h2 className="font-syne text-headline-lg text-on-surface uppercase">
            Certified Diagnostic Bench Architecture
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            We operate military-spec diagnostic apparatus inside an ESD-controlled containment suite. Precision diagnosis eliminates guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {LAB_INSTRUMENTS.map((inst, i) => (
            <div
              key={i}
              className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between shadow-md hover:shadow-xl transition-all border border-outline-variant/20 hover:border-primary/40"
            >
              <div className="flex flex-col gap-space-md">
                <div className="w-full h-44 rounded-lg overflow-hidden relative bg-surface-container">
                  <Image
                    src={inst.image}
                    alt={inst.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 right-2 px-space-xs py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-primary border border-primary/20">
                    {inst.res}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`font-mono text-label-tech ${inst.color} uppercase`}>
                    {inst.category}
                  </span>
                  <h4 className="font-syne text-title-md text-on-surface">
                    {inst.title}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant">
                    {inst.desc}
                  </p>
                </div>
              </div>

              <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm border-t border-outline-variant/15">
                <span className="font-mono text-label-tech text-outline">
                  {inst.cal}
                </span>
                <span className="font-mono text-telemetry-num text-secondary font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Engineering Lifecycle Pipeline ── */}
      <section className="max-w-[1440px] mx-auto px-gutter-lg py-space-xl w-full">
        <div className="bg-surface-container-low rounded-2xl p-space-xl md:p-space-2xl shadow-xl relative overflow-hidden border border-outline-variant/20">
          <div className="flex flex-col gap-space-xs mb-space-2xl text-center items-center">
            <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
              // THE_AQUA_PROTOCOL
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface uppercase">
              Engineering Lifecycle Pipeline
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl">
              From arrival to unboxing, your system is tracked by encrypted unique telemetry logs with live bench camera monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-gutter-sm relative">
            {/* Connector line for desktop */}
            <div className="hidden lg:block absolute top-10 left-12 right-12 h-0.5 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30 z-0" />

            {PIPELINE_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col items-center text-center relative z-10 gap-space-sm"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-surface-container-high ${step.color} flex items-center justify-center font-mono text-[20px] font-bold shadow-[0_0_15px_rgba(76,215,246,0.2)] border border-outline-variant/20`}
                >
                  {step.step}
                </div>
                <span className="font-syne text-title-md text-on-surface">
                  {step.title}
                </span>
                <p className="text-body-sm text-on-surface-variant">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA Strip ── */}
      <section className="w-full py-space-xl px-gutter-lg bg-surface">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-space-md py-space-xl rounded-2xl bg-surface-container border border-primary/20">
          <h2 className="font-syne text-headline-lg text-on-surface">
            Ready to Schedule Your Hardware Diagnostic?
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl">
            Our Austin laboratory processes emergency triage in under 24 hours. Submit your symptom profile online.
          </p>
          <div className="flex gap-space-md pt-space-xs">
            <Link
              href="/contact"
              className="px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all"
            >
              Start Intake Requisition
            </Link>
            <Link
              href="/pricing"
              className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-colors"
            >
              Review Rate Card
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

