"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RevealSection,
  SpotlightCard,
  TiltSpotlightCard,
  MagneticWrap,
  MaskedReveal,
  CircularGauge,
  CircuitFlowBackdrop,
  LiveOscilloscope,
  AnimatedNumber,
  fadeUpVariants,
  fadeInVariants,
  scaleInVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

import {
  WHATSAPP_LINK,
  TOTAL_SHOP_ITEMS,
  SECTION_ITEM_COUNTS,
  buildWhatsAppUrl,
} from "@/lib/shopData";
import {
  SITE_NAME,
  SITE_FOUNDED_DATE,
  SITE_FOUNDER,
  SITE_LOCATION,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  AQUA_PC_PARTS_URL,
  getAquaPcPartsUrl,
} from "@/lib/constants";

const WHATSAPP_BASE = WHATSAPP_LINK;

// ── Floating Orbs (decorative background) ────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[130px] animate-orb-drift" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-secondary/15 rounded-full blur-[140px] animate-orb-drift-delay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-tertiary/10 rounded-full blur-[100px] animate-float-slow" />
    </div>
  );
}

// ── Scroll Ticker ─────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { icon: "inventory_2", text: `${TOTAL_SHOP_ITEMS} Grade-A Components`, color: "text-primary" },
  { icon: "sports_esports", text: "NVIDIA RTX 30/40 Series", color: "text-secondary" },
  { icon: "memory", text: "Intel & AMD Processors", color: "text-tertiary" },
  { icon: "storage", text: "High-Speed NVMe SSDs", color: "text-primary" },
  { icon: "monitor", text: "Frameless FHD IPS Displays", color: "text-secondary" },
  { icon: "water_drop", text: "Custom Cooling & Tuning", color: "text-tertiary" },
  { icon: "verified_user", text: "06-Month Testing Warranty", color: "text-primary" },
  { icon: "local_shipping", text: "Island-wide Safe Delivery", color: "text-secondary" },
];

function ScrollTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full overflow-hidden bg-surface-container border-y border-outline-variant/20 py-3.5 relative group">
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-surface-container to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-surface-container to-transparent z-10 pointer-events-none" />
      <div className="flex gap-12 pr-12 animate-ticker group-hover:[animation-play-state:paused] whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-mono text-label-tech text-on-surface-variant tracking-wider shrink-0"
          >
            <span className={`material-symbols-outlined text-[16px] ${item.color}`}>
              {item.icon}
            </span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Data Constants ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "processors",
    name: "Processors",
    desc: "Intel Core i3/i5/i7 & AMD Ryzen 3/5/7/9",
    count: `${SECTION_ITEM_COUNTS.processors} Models`,
    icon: "memory",
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    iconColor: "text-primary",
  },
  {
    id: "vga-cards",
    name: "Graphics Cards",
    desc: "NVIDIA RTX 20/30/40, GTX Series & AMD Radeon RX",
    count: `${SECTION_ITEM_COUNTS["vga-cards"]} Models`,
    icon: "sports_esports",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-secondary",
  },
  {
    id: "motherboards",
    name: "Motherboards",
    desc: "Intel G41–Z790 & AMD A320/B450/B550/B650/B850",
    count: `${SECTION_ITEM_COUNTS.motherboards} Boards`,
    icon: "developer_board",
    color: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    iconColor: "text-tertiary",
  },
  {
    id: "storage",
    name: "SSD & HDD Storage",
    desc: "High-speed M.2 NVMe, SATA SSDs & Desktop/Laptop HDDs",
    count: `${SECTION_ITEM_COUNTS.storage} Drives`,
    icon: "storage",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
    iconColor: "text-primary",
  },
  {
    id: "monitors",
    name: "Monitors & Displays",
    desc: "Frameless FHD IPS, LED & LCD Grade-A Panels",
    count: `${SECTION_ITEM_COUNTS.monitors} Screens`,
    icon: "monitor",
    color: "from-teal-500/20 to-cyan-500/10",
    border: "border-teal-500/30",
    iconColor: "text-secondary",
  },
  {
    id: "cables",
    name: "Cables & Accessories",
    desc: "VGA/SATA/Power Cables, LCD Adapters & DVD Writers",
    count: `${SECTION_ITEM_COUNTS.cables} Items`,
    icon: "cable",
    color: "from-indigo-500/20 to-sky-500/10",
    border: "border-indigo-500/30",
    iconColor: "text-tertiary",
  },
  {
    id: "ram",
    name: "RAM Memory",
    desc: "DDR2, DDR3 & DDR4 Desktop & Laptop Modules",
    count: `${SECTION_ITEM_COUNTS.ram} Options`,
    icon: "dns",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    id: "power-supply",
    name: "Power Supplies",
    desc: "450W to 850W Branded Continuous Power Units",
    count: `${SECTION_ITEM_COUNTS["power-supply"]} Units`,
    icon: "bolt",
    color: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
  {
    id: "peripherals",
    name: "Peripherals & Audio",
    desc: "Brand New Mice, Keyboards, Combos, Webcams, Mics & Sound Cards",
    count: `${SECTION_ITEM_COUNTS.peripherals} Items`,
    icon: "devices",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/30",
    iconColor: "text-primary",
  },
  {
    id: "cooling",
    name: "CPU Cooling Fans",
    desc: "Intel Socket & AMD AM4 Copper & Stock Coolers",
    count: `${SECTION_ITEM_COUNTS.cooling} Models`,
    icon: "mode_fan",
    color: "from-sky-500/20 to-blue-500/10",
    border: "border-sky-500/30",
    iconColor: "text-primary",
  },
];

const FEATURED_HIGHLIGHTS = [
  {
    id: "amd-r7-5700x",
    name: "AMD Ryzen 7 5700X",
    category: "Processor",
    platform: "Socket AM4 · 8 Cores / 16 Threads",
    badge: "Enthusiast Pick",
    badgeType: "hot",
    specs: [
      { label: "Base/Boost", value: "3.4 / 4.6 GHz" },
      { label: "Cores/Threads", value: "8C / 16T" },
      { label: "L3 Cache", value: "32MB" },
      { label: "TDP Rating", value: "65W Efficient" },
    ],
    inquiryText:
      "Hi Aqua PC Solutions, I am interested in the AMD Ryzen 7 5700X processor. Could you please share the current price and availability?",
  },
  {
    id: "rtx-3060-12g",
    name: "NVIDIA GeForce RTX 3060 12GB",
    category: "Graphics Card",
    platform: "12GB GDDR6 · Ray Tracing & DLSS",
    badge: "Best Seller",
    badgeType: "popular",
    specs: [
      { label: "vRAM", value: "12GB GDDR6" },
      { label: "Memory Bus", value: "192-bit" },
      { label: "Output", value: "HDMI 2.1 + 3x DP" },
      { label: "Gaming Tier", value: "1080p / 1440p Ultra" },
    ],
    inquiryText:
      "Hi Aqua PC Solutions, I am interested in the NVIDIA RTX 3060 12GB graphics card. Please provide the price and warranty details.",
  },
  {
    id: "asus-b550-gaming",
    name: "AMD B550 Gaming Motherboard",
    category: "Motherboard",
    platform: "AM4 Socket · PCIe 4.0 Ready · Dual M.2",
    badge: "Grade-A Tested",
    badgeType: "certified",
    specs: [
      { label: "Chipset", value: "AMD B550" },
      { label: "Memory Support", value: "4x DDR4 Up to 4400MHz" },
      { label: "Storage", value: "PCIe 4.0 M.2 + SATA3" },
      { label: "Form Factor", value: "ATX / Micro-ATX" },
    ],
    inquiryText:
      "Hi Aqua PC Solutions, I would like to inquire about the AMD B550 Gaming Motherboard. Is it in stock and what is the price?",
  },
  {
    id: "nvme-m2-512gb",
    name: "512GB High-Speed M.2 NVMe SSD",
    category: "Storage",
    platform: "PCIe Gen3/Gen4 x4 · 3D NAND Flash",
    badge: "Speed Upgrade",
    badgeType: "speed",
    specs: [
      { label: "Capacity", value: "512 GB" },
      { label: "Form Factor", value: "M.2 2280" },
      { label: "Interface", value: "NVMe PCIe" },
      { label: "Health Check", value: "100% SMART Verified" },
    ],
    inquiryText:
      "Hi Aqua PC Solutions, could you let me know the price and brands available for the 512GB M.2 NVMe SSD?",
  },
  {
    id: "intel-i7-9700",
    name: "Intel Core i7-9700",
    category: "Processor",
    platform: "LGA1151 · 8 Cores / 8 Threads · Up to 4.70 GHz",
    badge: "Intel Power Pick",
    badgeType: "popular",
    specs: [
      { label: "Base/Boost", value: "3.00 / 4.70 GHz" },
      { label: "Cores/Threads", value: "8C / 8T" },
      { label: "Cache", value: "12MB Intel Smart" },
      { label: "Socket", value: "LGA1151 (9th Gen)" },
    ],
    inquiryText:
      "Hi Aqua PC Solutions, I want to inquire about the Intel Core i7-9700 (9th Gen) processor. What is the current price?",
  },
  {
    id: "rx-6600-8gb",
    name: "AMD Radeon RX 6600 8GB",
    category: "Graphics Card",
    platform: "8GB GDDR6 · RDNA 2 Architecture",
    badge: "High FPS Value",
    badgeType: "hot",
    specs: [
      { label: "vRAM", value: "8GB GDDR6" },
      { label: "Resolution", value: "1080p High FPS" },
      { label: "Features", value: "FSR 3.0 & Direct X12" },
      { label: "Efficiency", value: "Low Power 132W" },
    ],
    inquiryText:
      "Hi Aqua PC Solutions, please share details and price for the AMD Radeon RX 6600 8GB graphic card.",
  },
];

const TRUST_METRICS = [
  {
    value: `${TOTAL_SHOP_ITEMS}`,
    title: "Cataloged Parts",
    sub: "Processors, GPUs, boards, SSDs & more",
    icon: "inventory_2",
  },
  {
    value: "06 Mo.",
    title: "Testing Warranty",
    sub: "Peace-of-mind coverage on selected parts",
    icon: "verified_user",
  },
  {
    value: "100%",
    title: "Silicon Tested",
    sub: "Cold boot & benchmark verified",
    icon: "check_circle",
  },
  {
    value: "Island-wide",
    title: "Safe Delivery",
    sub: "Secure courier across Sri Lanka",
    icon: "local_shipping",
  },
];

const SERVICES_PREVIEW = [
  {
    title: "Custom PC Builds",
    desc: "Bespoke desktop computers crafted for esports gaming, 4K video rendering, and engineering CAD workstations with balanced airflow.",
    icon: "desktop_windows",
    tag: "GAMING & WORKSTATIONS",
    link: "/services#srv-02",
  },
  {
    title: "Diagnostics & Repairs",
    desc: "Rapid triage for no-power, no-display, blue-screens, and overheating. Board-level diagnostics and component rework to rescue valuable parts.",
    icon: "build_circle",
    tag: "BOARD-LEVEL REPAIR",
    link: "/services#srv-01",
  },
  {
    title: "Thermal & Cooling Upgrades",
    desc: "AIO & liquid loop servicing, deep dust cleaning, Kryonaut-class thermal repasting, and hardware component upgrades.",
    icon: "water_drop",
    tag: "THERMAL OPTIMIZATION",
    link: "/services#srv-03",
  },
];

const RIG_TELEMETRY = {
  specs: {
    overlayIcon: "speed",
    overlayLabel: "Zero Throttle Profile",
    overlayMetric: "< 65°C Full Load",
    barLabel: "Silicon Clock Stability",
    barValue: "99.8%",
    barWidth: "96%",
    signalLabel: "Voltage Rail Verification",
    signalValue: "STABLE LOAD",
    stats: [
      { label: "Burn-In", value: "24h Pass", sub: "Prime95 / 3DMark", color: "text-primary" },
      { label: "Grade", value: "Class-A", sub: "Verified Silicon", color: "text-secondary" },
      { label: "Support", value: "WhatsApp", sub: "Direct Chat", color: "text-[#25D366]" },
    ],
  },
  cooling: {
    overlayIcon: "water_drop",
    overlayLabel: "AIO & Liquid Cooling Lab",
    overlayMetric: "Leak Verified",
    barLabel: "Thermal Dissipation Headroom",
    barValue: "88.4%",
    barWidth: "88%",
    signalLabel: "Sustained Load Curve",
    signalValue: "BALANCED",
    stats: [
      { label: "Warranty", value: "06 Mo.", sub: "Testing Coverage", color: "text-secondary" },
      { label: "Delta-T", value: "-10 to -18°C", sub: "Kryonaut Repaste", color: "text-primary" },
      { label: "Fan Tune", value: "Custom", sub: "Low-Noise Curve", color: "text-tertiary" },
    ],
  },
} as const;

const RIG_BLUEPRINTS = [
  {
    id: "esports",
    label: "Esports Velocity",
    tag: "1080P COMPETITIVE",
    title: "High-FPS Competitive Gaming Architecture",
    summary:
      "Tuned for Valorant, CS2, Warzone, and Apex with ultra-low frametime variance, fast NVMe OS boot, and cool sustained boost clocks.",
    gauges: [
      { value: 86, label: "FPS Velocity", display: "240+" },
      { value: 84, label: "Thermal Margin", display: "56°C" },
      { value: 96, label: "Rail Stability", display: "96%" },
    ],
    specs: [
      { icon: "memory", label: "Processor", value: "AMD Ryzen 5 5600 / Intel i5-9400F" },
      { icon: "sports_esports", label: "Graphics", value: "AMD Radeon RX 6600 8GB" },
      { icon: "dns", label: "Memory", value: "16GB DDR4 Dual-Channel" },
      { icon: "storage", label: "Storage", value: "512GB High-Speed M.2 NVMe" },
    ],
    whatsappText:
      "Hi Aqua PC Solutions, I'd like a quotation for the Esports Velocity (1080p Competitive) custom PC build.",
  },
  {
    id: "creator",
    label: "Creator Pro",
    tag: "1440P WORKSTATION",
    title: "2K Gaming, Rendering & Streaming Powerhouse",
    summary:
      "Balanced multi-core compute and 12GB VRAM headroom built for DaVinci Resolve, Blender CUDA acceleration, and 1440p Ultra gaming.",
    gauges: [
      { value: 92, label: "Render Speed", display: "1440p" },
      { value: 89, label: "Thermal Margin", display: "54°C" },
      { value: 98, label: "Rail Stability", display: "98%" },
    ],
    specs: [
      { icon: "memory", label: "Processor", value: "AMD Ryzen 7 5700X (8C / 16T)" },
      { icon: "sports_esports", label: "Graphics", value: "NVIDIA RTX 3060 12GB GDDR6" },
      { icon: "dns", label: "Memory", value: "32GB DDR4 Memory Configuration" },
      { icon: "mode_fan", label: "Cooling", value: "High-Airflow Dual Tower Thermal" },
    ],
    whatsappText:
      "Hi Aqua PC Solutions, I'd like a quotation for the Creator Pro (Ryzen 7 + RTX 3060 12GB) custom PC build.",
  },
  {
    id: "hydro",
    label: "Hydro Flagship",
    tag: "4K LIQUID LAB",
    title: "Zero-Compromise Custom Loop Enthusiast Rig",
    summary:
      "Precision liquid & AIO cooling architecture, Kryonaut thermal tuning, clean cable management, and 24-hour stability burn-in validation.",
    gauges: [
      { value: 99, label: "Peak Class", display: "4K" },
      { value: 95, label: "Thermal Margin", display: "49°C" },
      { value: 99, label: "Clock Sustain", display: "99.8%" },
    ],
    specs: [
      { icon: "memory", label: "Processor", value: "AMD Ryzen 9 5900X / Custom Flagship" },
      { icon: "sports_esports", label: "Graphics", value: "NVIDIA RTX 4070 Ti 12GB / 40 Series" },
      { icon: "water_drop", label: "Cooling", value: "Custom Liquid / AIO Loop Tuning" },
      { icon: "verified_user", label: "Validation", value: "24h Burn-In + 06 Mo. Warranty" },
    ],
    whatsappText:
      "Hi Aqua PC Solutions, I'd like to discuss a Hydro Flagship custom liquid-cooled PC build.",
  },
] as const;

// ── WhatsApp SVG ───────────────────────────────────────────────────────────────
const WhatsAppIcon = ({ className = "w-5 h-5 shrink-0" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"specs" | "cooling">("specs");
  const activeTelemetry = RIG_TELEMETRY[activeTab];

  const [blueprintId, setBlueprintId] = useState<(typeof RIG_BLUEPRINTS)[number]["id"]>("creator");
  const activeBlueprint = RIG_BLUEPRINTS.find((b) => b.id === blueprintId) ?? RIG_BLUEPRINTS[1];

  return (
    <div className="flex flex-col w-full overflow-x-clip">
      {/* ── 1. Hero Section ── */}
      <section className="relative w-full bg-surface-container-lowest -mt-20 pt-28 pb-space-2xl px-gutter-lg overflow-hidden">
        <FloatingOrbs />
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-80" />

        {/* Subtle precision tech grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--color-primary)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col gap-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center pt-space-md">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-high/90 backdrop-blur-md w-fit border border-primary/25 shadow-sm"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary shadow-[0_0_10px_rgba(79,219,200,0.9)]" />
                </span>
                <span className="font-mono text-label-tech text-secondary tracking-wider uppercase font-semibold">
                  AQUA PC SOLUTIONS
                </span>
                <span className="text-outline font-mono text-[11px] hidden sm:inline">
                  • EMBILIPITIYA, SRI LANKA
                </span>
              </motion.div>

              <div className="flex flex-col gap-space-sm">
                <h1 className="font-syne text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight">
                  <MaskedReveal delay={0.05}>Build Your Dream Setup.</MaskedReveal>{" "}
                  <MaskedReveal delay={0.16}>
                    <span className="text-shimmer">Certified PC Hardware</span>
                  </MaskedReveal>{" "}
                  <MaskedReveal delay={0.26}>&amp; Expert Craftsmanship.</MaskedReveal>
                </h1>
                <motion.p
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed"
                >
                  Welcome to <strong className="text-on-surface">Aqua PC Solutions</strong>. Your trusted destination for verified Grade-A components, custom gaming rigs, thermal optimization, and micro-precision repair diagnostics in Sri Lanka.
                </motion.p>
              </div>

              {/* Action Buttons with Magnetic Spring Pull */}
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-wrap items-center gap-space-md pt-space-xs"
              >
                <MagneticWrap>
                  <a
                    href={AQUA_PC_PARTS_URL}
                    className="relative sheen-hover inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group"
                  >
                    <span className="material-symbols-outlined text-[20px] relative z-10 group-hover:rotate-12 transition-transform duration-300">
                      grid_view
                    </span>
                    <span className="relative z-10">Browse {TOTAL_SHOP_ITEMS} Parts</span>
                  </a>
                </MagneticWrap>

                <MagneticWrap>
                  <a
                    href={WHATSAPP_BASE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sheen-hover inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-syne text-title-md font-bold shadow-md hover:shadow-[0_10px_28px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </MagneticWrap>

                <MagneticWrap strength={0.16}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary">
                      build_circle
                    </span>
                    <span>Book Repair</span>
                  </Link>
                </MagneticWrap>
              </motion.div>

              {/* Trust Badges Bar */}
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={4}
                className="flex flex-wrap items-center gap-x-space-lg gap-y-space-xs pt-space-sm text-body-sm text-on-surface-variant"
              >
                {[
                  { icon: "check_circle", label: "Grade-A Bench Tested", color: "text-primary" },
                  { icon: "security", label: "06 Months Warranty", color: "text-secondary" },
                  { icon: "local_shipping", label: "Safe Island-wide Delivery", color: "text-tertiary" },
                ].map((badge, i) => (
                  <motion.div
                    key={badge.label}
                    variants={fadeInVariants}
                    custom={i}
                    className="flex items-center gap-1.5 group cursor-default"
                  >
                    <span
                      className={`material-symbols-outlined ${badge.color} text-[18px] group-hover:scale-125 transition-transform duration-200`}
                    >
                      {badge.icon}
                    </span>
                    <span className="group-hover:text-on-surface transition-colors">
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Rig Showcase with Conic Light Border & 3D Tilt */}
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="lg:col-span-5 relative"
            >
              <TiltSpotlightCard
                conicBorder
                sheen
                maxTilt={3.5}
                className="rounded-2xl shadow-2xl card-glow"
                innerClassName="bg-surface-container-high/95 backdrop-blur-xl p-space-md sm:p-space-lg"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
                      </span>
                      <span className="font-mono text-label-tech text-on-surface uppercase font-bold">
                        AQUA TECH LAB RIG
                      </span>
                    </div>
                    <span className="px-space-sm py-0.5 rounded-full bg-secondary/15 text-secondary font-mono text-[11px] font-semibold border border-secondary/20">
                      BENCHMARK ACTIVE
                    </span>
                  </div>

                  {/* Interactive Toggle Pill */}
                  <div className="flex gap-2 my-space-sm p-1 rounded-xl bg-surface-container border border-outline-variant/15">
                    {(["specs", "cooling"] as const).map((tab) => {
                      const isSelected = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-1.5 px-3 rounded-lg font-syne text-body-sm transition-colors text-center relative z-10 ${
                            isSelected
                              ? "text-surface font-bold"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="hero-rig-tab"
                              className={`absolute inset-0 rounded-lg -z-10 shadow-sm ${
                                tab === "specs" ? "bg-primary" : "bg-secondary"
                              }`}
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                          )}
                          <span>
                            {tab === "specs" ? "Hardware Stability" : "Thermal Profile"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Hardware Image */}
                  <div className="relative w-full h-60 sm:h-72 rounded-xl overflow-hidden bg-surface-container-lowest scan-overlay">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzAgT1ycU31D0XXng7zUxriWh_-AJeqiSxHggoL5n3OUn4967qRAk-8lipNJE3yhEI7S-rW0Vsvwu_WISzGD-15X3dYeF9K8GgkFpO0o95G7tY4kRuq23kMPeGXuxcIWu_DjNPW1oqvT0x2nL2DyfK_lPLNU9uUWFRgb9EIlVpHynrASnW-tXBGyJPMH-euBM4FfPsd68trJRjtrzVLpUxXR_f5_msEEoRUSf5azYx"
                      alt="Custom Liquid Cooled Gaming PC by Aqua PC Solutions"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 42vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab + "-overlay"}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                        className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-surface-container/90 backdrop-blur-md px-3 py-2 rounded-lg border border-primary/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            {activeTelemetry.overlayIcon}
                          </span>
                          <span className="font-mono text-[12px] text-on-surface">
                            {activeTelemetry.overlayLabel}
                          </span>
                        </div>
                        <span className="font-mono text-[12px] text-secondary font-bold">
                          {activeTelemetry.overlayMetric}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Live Oscilloscope + Progress Meter */}
                  <div className="mt-space-sm p-3 rounded-lg bg-surface-container border border-outline-variant/15 flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-on-surface-variant">{activeTelemetry.signalLabel}</span>
                      <span className="text-secondary font-bold">{activeTelemetry.signalValue}</span>
                    </div>
                    <LiveOscilloscope mode={activeTab === "specs" ? "primary" : "secondary"} />
                    <div className="flex items-center justify-between font-mono text-[11px] pt-0.5">
                      <span className="text-on-surface-variant">{activeTelemetry.barLabel}</span>
                      <span className="text-primary font-bold">{activeTelemetry.barValue}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
                      <motion.div
                        key={activeTab + "-bar"}
                        initial={{ width: "0%" }}
                        animate={{ width: activeTelemetry.barWidth }}
                        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                        className="h-full rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary shadow-[0_0_8px_rgba(76,215,246,0.6)]"
                      />
                    </div>
                  </div>

                  {/* Telemetry / Specs Grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                      className="grid grid-cols-3 gap-2 mt-space-sm"
                    >
                      {activeTelemetry.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="p-2.5 rounded-lg bg-surface-container flex flex-col border border-outline-variant/15 text-center hover:border-primary/35 transition-colors"
                        >
                          <span className="font-mono text-[10px] text-outline uppercase">
                            {stat.label}
                          </span>
                          <span className={`font-mono text-title-md ${stat.color} font-bold`}>
                            {stat.value}
                          </span>
                          <span className="text-[10px] text-outline truncate">{stat.sub}</span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Direct Card CTA */}
                  <div className="mt-space-sm pt-space-xs border-t border-outline-variant/15 flex items-center justify-between">
                    <span className="text-body-sm text-on-surface-variant">
                      Need a custom rig quotation?
                    </span>
                    <a
                      href={buildWhatsAppUrl(
                        "Hi Aqua PC Solutions, I would like a quotation for a custom gaming PC."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:text-[#20ba59] font-syne text-body-sm font-bold flex items-center gap-1 transition-colors group/cta"
                    >
                      <span>Message Founder</span>
                      <span className="material-symbols-outlined text-[16px] group-hover/cta:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              </TiltSpotlightCard>
            </motion.div>
          </div>

          {/* Metric Bar */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            className="w-full rounded-2xl bg-surface-container p-space-md sm:p-space-lg shadow-lg border border-outline-variant/20 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgb(var(--color-primary)) 0%, transparent 70%)",
              }}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter relative z-10">
              {TRUST_METRICS.map((metric, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpVariants}
                  custom={idx}
                  className="flex items-center gap-space-sm group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                    <span className="material-symbols-outlined text-[24px]">{metric.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-syne text-headline-sm text-on-surface font-bold leading-tight">
                      <AnimatedNumber value={metric.value} />
                    </span>
                    <span className="font-syne text-body-sm text-on-surface font-semibold">
                      {metric.title}
                    </span>
                    <span className="text-[12px] text-on-surface-variant">{metric.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Scroll Ticker ── */}
      <ScrollTicker />

      {/* ── 2. Quick Shop Categories Navigator ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <motion.div variants={fadeUpVariants} custom={0}>
              <span className="font-mono text-label-tech text-secondary uppercase tracking-widest block mb-1">
                // HARDWARE INVENTORY
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Explore Components by Category
              </h2>
            </motion.div>
            <motion.div variants={fadeInVariants} custom={1}>
              <a
                href={AQUA_PC_PARTS_URL}
                className="inline-flex items-center gap-space-xs text-primary hover:text-primary-fixed font-syne text-title-md transition-colors group"
              >
                <span>View Full {TOTAL_SHOP_ITEMS}-Item Aqua PC Parts Catalog</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
            </motion.div>
          </div>

          {/* 9-Card Category Grid covering all shop sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} variants={scaleInVariants} custom={i}>
                <TiltSpotlightCard
                  sheen
                  maxTilt={5}
                  className="rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 card-glow h-full"
                >
                  <a
                    href={getAquaPcPartsUrl(cat.id)}
                    className="p-space-lg flex flex-col justify-between h-full relative z-10"
                  >
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center ${cat.iconColor} border ${cat.border} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {cat.icon}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-outline/70">
                            0{i + 1}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px] border border-outline-variant/20">
                            {cat.count}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-syne text-title-md text-on-surface group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">{cat.desc}</p>
                      </div>
                    </div>
                    <div className="pt-space-md mt-space-md border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-syne font-semibold text-primary">
                      <span>Explore Items</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform duration-300">
                        arrow_forward
                      </span>
                    </div>
                  </a>
                </TiltSpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 3. Featured Hardware Spotlight ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface-container-low border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <motion.div variants={fadeUpVariants} custom={0}>
              <span className="font-mono text-label-tech text-primary uppercase tracking-widest block mb-1">
                // POPULAR SILICON &amp; HARDWARE
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Featured In-Demand Components
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-xl mt-1">
                All components are Grade-A verified with clean contacts, stable voltage margins, and instant WhatsApp inquiry.
              </p>
            </motion.div>
            <motion.div variants={fadeInVariants} custom={1}>
              <a
                href={AQUA_PC_PARTS_URL}
                className="px-space-md py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-md font-semibold border border-outline-variant/30 transition-all flex items-center gap-2 self-start md:self-auto hover:border-primary/40 hover:-translate-y-0.5"
              >
                <span>View All {TOTAL_SHOP_ITEMS} Products</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </motion.div>
          </div>

          {/* Product Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {FEATURED_HIGHLIGHTS.map((item, i) => (
              <motion.div key={item.id} variants={fadeUpVariants} custom={i}>
                <SpotlightCard className="sheen-hover rounded-2xl bg-surface-container p-space-lg flex flex-col justify-between border border-outline-variant/15 hover:border-primary/40 shadow-md hover:shadow-2xl transition-all duration-300 card-glow hover:-translate-y-1.5 h-full">
                  {/* Top shimmer line on hover */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-500" />

                  <div className="flex flex-col gap-space-sm relative z-10">
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px] uppercase font-semibold border border-primary/20">
                        {item.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                          item.badgeType === "hot"
                            ? "bg-rose-500/15 text-rose-400"
                            : item.badgeType === "popular"
                            ? "bg-secondary/15 text-secondary"
                            : item.badgeType === "certified"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-primary/15 text-primary"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-syne text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="font-mono text-label-tech text-outline mt-0.5">
                        {item.platform}
                      </p>
                    </div>

                    {/* Specs List */}
                    <div className="grid grid-cols-2 gap-2 mt-space-xs">
                      {item.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2 rounded-lg bg-surface-container-high/80 border border-outline-variant/10 flex flex-col hover:border-primary/25 transition-colors"
                        >
                          <span className="text-[10px] font-mono text-outline uppercase">
                            {spec.label}
                          </span>
                          <span className="text-body-sm font-mono text-on-surface font-semibold truncate">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom WhatsApp Inquiry Flow */}
                  <div className="mt-space-lg pt-space-md border-t border-outline-variant/15 flex flex-col sm:flex-row items-center gap-2 relative z-10">
                    <a
                      href={`${WHATSAPP_BASE}?text=${encodeURIComponent(item.inquiryText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-space-md rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-syne text-body-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <WhatsAppIcon className="w-4 h-4 shrink-0" />
                      <span>Check Price on WhatsApp</span>
                    </a>
                    <a
                      href={AQUA_PC_PARTS_URL}
                      className="w-full sm:w-auto p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface flex items-center justify-center border border-outline-variant/20 transition-colors hover:border-primary/30"
                      title="View in Aqua PC Parts"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 3.5 Interactive Rig Blueprints Configurator ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <motion.div variants={fadeUpVariants} custom={0}>
              <span className="font-mono text-label-tech text-primary uppercase tracking-widest block mb-1">
                // INTERACTIVE BUILD ARCHITECT
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Custom Rig Tier Blueprints
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-xl mt-1">
                Preview balanced gaming and creator builds tuned in our Embilipitiya lab—complete with thermal headroom, benchmark validation, and instant WhatsApp quotation.
              </p>
            </motion.div>

            {/* Tier Switcher Pills */}
            <motion.div
              variants={fadeInVariants}
              custom={1}
              className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-surface-container border border-outline-variant/20 w-fit"
            >
              {RIG_BLUEPRINTS.map((tier) => {
                const isSelected = blueprintId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBlueprintId(tier.id)}
                    className={`relative z-10 px-4 py-2 rounded-lg font-syne text-body-sm font-semibold transition-colors ${
                      isSelected
                        ? "text-surface"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="rig-blueprint-tab"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-secondary shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 360, damping: 32 }}
                      />
                    )}
                    {tier.label}
                  </button>
                );
              })}
            </motion.div>
          </div>

          <motion.div variants={scaleInVariants} custom={1}>
            <TiltSpotlightCard
              conicBorder
              maxTilt={1.5}
              className="rounded-3xl shadow-2xl"
              innerClassName="bg-surface-container-low p-space-lg md:p-space-2xl relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBlueprint.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center relative z-10"
                >
                  {/* Left: Overview & 4 Hardware Specs */}
                  <div className="lg:col-span-7 flex flex-col gap-space-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/15 text-primary font-mono text-[11px] font-bold border border-primary/25">
                        {activeBlueprint.tag}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-mono text-[11px] font-semibold border border-secondary/20">
                        24H BURN-IN CERTIFIED
                      </span>
                    </div>

                    <div>
                      <h3 className="font-syne text-headline-md text-on-surface">
                        {activeBlueprint.title}
                      </h3>
                      <p className="text-body-md text-on-surface-variant mt-1 leading-relaxed">
                        {activeBlueprint.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeBlueprint.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="p-3 rounded-xl bg-surface-container border border-outline-variant/15 flex items-center gap-3 hover:border-primary/35 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                            <span className="material-symbols-outlined text-[20px]">
                              {spec.icon}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="block font-mono text-[10px] uppercase text-outline">
                              {spec.label}
                            </span>
                            <span className="block font-syne text-body-sm font-semibold text-on-surface truncate">
                              {spec.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <MagneticWrap>
                        <a
                          href={`${WHATSAPP_BASE}?text=${encodeURIComponent(activeBlueprint.whatsappText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sheen-hover inline-flex items-center gap-2 px-space-lg py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-syne text-body-md font-bold shadow-md hover:shadow-[0_10px_28px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 transition-all"
                        >
                          <WhatsAppIcon className="w-4 h-4 shrink-0" />
                          <span>Request {activeBlueprint.label} Quote</span>
                        </a>
                      </MagneticWrap>
                      <a
                        href={AQUA_PC_PARTS_URL}
                        className="inline-flex items-center gap-1.5 px-space-lg py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-syne text-body-md font-semibold border border-outline-variant/30 hover:border-primary/40 transition-all"
                      >
                        <span>Customize Parts</span>
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                      </a>
                    </div>
                  </div>

                  {/* Right: Animated Circular SVG Gauges */}
                  <div className="lg:col-span-5 flex flex-col gap-space-md p-space-lg rounded-2xl bg-surface-container border border-outline-variant/20">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
                      <span className="font-mono text-label-tech text-primary uppercase font-bold">
                        LAB BENCHMARK TELEMETRY
                      </span>
                      <span className="font-mono text-[11px] text-secondary">VERIFIED PROFILE</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 py-2">
                      <CircularGauge
                        value={activeBlueprint.gauges[0].value}
                        label={activeBlueprint.gauges[0].label}
                        displayText={activeBlueprint.gauges[0].display}
                        accent="primary"
                      />
                      <CircularGauge
                        value={activeBlueprint.gauges[1].value}
                        label={activeBlueprint.gauges[1].label}
                        displayText={activeBlueprint.gauges[1].display}
                        accent="secondary"
                      />
                      <CircularGauge
                        value={activeBlueprint.gauges[2].value}
                        label={activeBlueprint.gauges[2].label}
                        displayText={activeBlueprint.gauges[2].display}
                        accent="tertiary"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/15 flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant font-mono text-[11px]">
                        Cable Management &amp; BIOS Tuning
                      </span>
                      <span className="font-mono text-[11px] text-primary font-bold">INCLUDED</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TiltSpotlightCard>
          </motion.div>
        </div>
      </RevealSection>

      {/* ── 4. Services & Repair Triage ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="text-center max-w-2xl mx-auto flex flex-col gap-space-xs"
          >
            <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
              // EXPERT LAB CAPABILITIES
            </span>
            <h2 className="font-syne text-headline-lg text-on-surface">
              More than Parts. Complete Engineering Solutions.
            </h2>
            <p className="text-body-md text-on-surface-variant">
              From assembling showpiece rigs to performing micro-soldering on damaged traces, we handle every hardware challenge with laboratory care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {SERVICES_PREVIEW.map((srv, i) => (
              <motion.div key={srv.title} variants={fadeUpVariants} custom={i}>
                <SpotlightCard
                  glowColor="rgb(var(--color-secondary) / 0.14)"
                  className="p-space-lg rounded-2xl bg-surface-container flex flex-col justify-between border border-outline-variant/15 hover:border-secondary/40 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 card-glow h-full"
                >
                  <div className="flex flex-col gap-space-md relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
                        <span className="material-symbols-outlined text-[24px]">{srv.icon}</span>
                      </div>
                      <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
                        {srv.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-syne text-headline-sm text-on-surface mb-2 group-hover:text-secondary transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-body-md text-on-surface-variant leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-space-lg mt-space-md border-t border-outline-variant/10 relative z-10">
                    <Link
                      href={srv.link}
                      className="inline-flex items-center gap-1.5 text-secondary hover:text-secondary-fixed font-syne text-body-md font-semibold transition-colors group/link"
                    >
                      <span>Learn More</span>
                      <span className="material-symbols-outlined text-[16px] group-hover/link:translate-x-2 transition-transform duration-300">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 5. Meet the Founder & Authenticity Spotlight ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface-container-lowest border-t border-outline-variant/15">
        <TiltSpotlightCard
          conicBorder
          maxTilt={1.5}
          className="max-w-[1440px] mx-auto rounded-3xl shadow-2xl"
          innerClassName="bg-surface-container p-space-lg md:p-space-2xl"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center relative z-10">
            {/* Founder Photo */}
            <motion.div variants={fadeUpVariants} custom={0} className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden bg-surface-container-high border-2 border-primary/30 shadow-2xl group/photo hover:border-primary/60 transition-colors duration-300">
                <Image
                  src="/images/founder.jpg"
                  alt="S.L.K Thinul Hansana - Founder of Aqua PC Solutions"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover object-center group-hover/photo:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-75" />
                <div className="absolute inset-0 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl scan-overlay" />
                <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-surface-container/90 backdrop-blur-md border border-primary/20 text-center">
                  <span className="block font-syne text-body-md text-on-surface font-bold">
                    S.L.K Thinul Hansana
                  </span>
                  <span className="font-mono text-[11px] text-secondary">
                    Founder &amp; Hardware Specialist
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Founder Story & Vision */}
            <motion.div
              variants={fadeUpVariants}
              custom={1}
              className="lg:col-span-8 flex flex-col gap-space-md"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-label-tech uppercase font-bold border border-primary/20">
                  OUR FOUNDER &amp; COMMITMENT
                </span>
                <span className="text-outline font-mono text-label-tech">EST. 11.06.2026</span>
              </div>

              <h2 className="font-syne text-headline-lg text-on-surface">
                &ldquo;We treat every computer like a masterwork of engineering.&rdquo;
              </h2>

              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Founded on <strong className="text-on-surface">{SITE_FOUNDED_DATE}</strong> in{" "}
                <strong className="text-on-surface">{SITE_LOCATION}</strong> by{" "}
                <strong className="text-on-surface">{SITE_FOUNDER}</strong>, {SITE_NAME} is built on an unwavering commitment to authenticity. We reject overpriced inferior hardware and unreliable repairs.
              </p>

              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Whether you need a rock-solid workstation, a high-FPS competitive esports machine, or verified Grade-A components delivered to your doorstep, we provide direct guidance, honest pricing, and personal warranty support.
              </p>

              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link
                  href="/about"
                  className="relative px-space-lg py-space-sm rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-body-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all hover:-translate-y-0.5 overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 animate-shimmer opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="relative z-10">Read Our Full Story</span>
                </Link>

                <a
                  href={WHATSAPP_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-space-lg py-space-sm rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-syne text-body-md font-semibold border border-[#25D366]/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>Chat with Founder</span>
                </a>

                <a
                  href={SITE_PHONE_HREF}
                  className="px-space-lg py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-md font-semibold border border-outline-variant/30 transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                  <span>{SITE_PHONE_DISPLAY}</span>
                </a>
              </div>
            </motion.div>
          </div>
        </TiltSpotlightCard>
      </RevealSection>

      {/* ── 6. Bottom Call to Action Banner ── */}
      <RevealSection className="w-full py-space-2xl px-gutter-lg bg-surface border-t border-outline-variant/15">
        <motion.div
          variants={scaleInVariants}
          custom={0}
          className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-space-md py-space-2xl px-space-md rounded-3xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low border border-primary/30 shadow-2xl relative overflow-hidden"
        >
          <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-45" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/15 rounded-full blur-[100px] animate-orb-drift pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] animate-orb-drift-delay pointer-events-none" />

          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl"
            style={{
              backgroundImage:
                "linear-gradient(rgb(var(--color-primary)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-primary)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <motion.span
            variants={fadeUpVariants}
            custom={0}
            className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-label-tech uppercase font-bold tracking-wider border border-primary/20 relative z-10"
          >
            CONNECT WITH AQUA PC SOLUTIONS
          </motion.span>

          <motion.h2
            variants={fadeUpVariants}
            custom={1}
            className="font-syne text-headline-lg lg:text-display-hero-mobile text-on-surface max-w-2xl font-bold relative z-10"
          >
            Ready to Build, Upgrade or Fix Your Setup?
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            custom={2}
            className="text-body-lg text-on-surface-variant max-w-xl relative z-10"
          >
            Get in touch directly with our team in Embilipitiya for component availability, custom quotation, or technical diagnostic help.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            custom={3}
            className="flex flex-wrap justify-center items-center gap-space-md pt-space-sm z-10"
          >
            <MagneticWrap>
              <a
                href={WHATSAPP_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen-hover px-space-xl py-space-md rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-syne text-title-md font-bold shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <WhatsAppIcon />
                <span>Instant WhatsApp Chat</span>
              </a>
            </MagneticWrap>

            <MagneticWrap>
              <a
                href={AQUA_PC_PARTS_URL}
                className="relative sheen-hover px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all duration-300 inline-block"
              >
                <span className="relative z-10">Browse {TOTAL_SHOP_ITEMS} Parts Shop</span>
              </a>
            </MagneticWrap>

            <MagneticWrap strength={0.16}>
              <Link
                href="/contact"
                className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 inline-block"
              >
                Visit Contact Lab
              </Link>
            </MagneticWrap>
          </motion.div>
        </motion.div>
      </RevealSection>
    </div>
  );
}
