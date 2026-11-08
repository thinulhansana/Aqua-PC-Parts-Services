"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: "cpu" | "gpu" | "cooling" | "memory";
  platform: string;
  price: number;
  badge: string;
  badgeType: "stock" | "limited" | "exclusive";
  featureTag: string;
  image: string;
  specs: { label: string; value: string }[];
}

const PRODUCTS: Product[] = [
  {
    id: "amd-7950x3d",
    name: "AMD Ryzen 9 7950X3D",
    category: "cpu",
    platform: "Socket AM5 · Zen 4 V-Cache",
    price: 599.0,
    badge: "IN STOCK (4)",
    badgeType: "stock",
    featureTag: "BIN: GOLD GRADE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJCbPTu_N-WytQ-UtptENHzT27-mtjjj-B5M-Dd0wadhoIiMwdKDX-r9Emzwjc07HQDjteORB4TjOW66i-Y1Q-ZeJjkuivn52So6-WIpjHEb4wYPkWC34e9eBYn84Fb0dbzK25VxR0egzMRihyEMDUDHRoMwnD2sTz9ED0GxmM5kLr7O9S6-cAE4fmBjxicL_lXnXhyJKLDcdQuFKDAQ4r9fo66yD-KrLH9zRAvKRt",
    specs: [
      { label: "Boost", value: "5.70 GHz" },
      { label: "Cores", value: "16C / 32T" },
      { label: "TDP", value: "120W" },
      { label: "L3", value: "128MB Cache" },
    ],
  },
  {
    id: "intel-14900ks",
    name: "Intel Core i9-14900KS",
    category: "cpu",
    platform: "LGA1700 · Raptor Lake Refresh",
    price: 689.99,
    badge: "LIMITED BIN",
    badgeType: "limited",
    featureTag: "6.2 GHz RECORD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEnkge0rLgjvddL47p1TJB_Hb2oLQ_fe6az7ZZNnLRwaJBR85YK586z2KsgPwUlhCpD7l34ngwYWhCLyG0lMfkv2hf1nfbouawg9nZyJozaytJGhWHqT_PbKw0IHQQ40LipSHoV2A3ZuBfU0XkorcksEoJEZBeIdRhhmpA9UEq02R7DJMiYq8rzHdBzOGJEicUpgOg8rFFpkbFUa40LsBjDW4iBKM-OGFxcotPFjVt",
    specs: [
      { label: "Max", value: "6.20 GHz" },
      { label: "Cores", value: "24C / 32T" },
      { label: "TDP", value: "150W Base" },
      { label: "Opt", value: "Delid Ready" },
    ],
  },
  {
    id: "rtx-4090-hydro",
    name: "RTX 4090 Hydro Copper",
    category: "gpu",
    platform: "Ada Lovelace · 24GB GDDR6X",
    price: 1799.99,
    badge: "IN STOCK (2)",
    badgeType: "stock",
    featureTag: "4K ULTRA DLSS 3.5",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXFQ2wLOb528u8nW8kIqjoC5iSHVmR-U9Oy58eCnnOF3EsXoTfgOBfltZu5jEGIkjkOMRYxlMWxxXO0OZkYdfAjhZ5xj3L3uaeLNmwA3pJqjal7FrcFUNMCheTG1RTbcEnpckuySVPG4Q8f-lZOzIDsUWNkAgypmh0XsWe2asNpvIjL5BrEkttvHOH2oPAD-nku8csetof9_sdI76UbgNKIt8A8l7Mbp-uRX-4XgJS",
    specs: [
      { label: "vRAM", value: "24GB 384b" },
      { label: "Water", value: "G1/4\" Nickel" },
      { label: "TGP", value: "450W Loop" },
      { label: "RT", value: "3rd Gen Core" },
    ],
  },
  {
    id: "rx-7900-xtx",
    name: "RX 7900 XTX AquaForce",
    category: "gpu",
    platform: "RDNA 3 · 24GB GDDR6",
    price: 949.0,
    badge: "IN STOCK (5)",
    badgeType: "stock",
    featureTag: "DISPLAYPORT 2.1",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDb6DDmG89bLfE5pBvVF4V01KlaZYoclQkulVwPhhOkM75nkdQJBaFpda4LKW5i9JJj_pMFknSIixmZMhmpmn5AXy6Z90x-XfoLjR9u-bosQWYij7yMJOC_BlDn81TLK_5zUnCya4flEQo4hIajtUESKfyyoggKpMGVY45BderR9dGQZqhovY3eFJhTZjILwAYTUxQaPIyZP9uJvWkSFjylZWtbJZJlM_w9MhqYC-Da",
    specs: [
      { label: "Clock", value: "2615 MHz" },
      { label: "Memory", value: "24GB VRAM" },
      { label: "Stream", value: "6144 Cores" },
      { label: "Block", value: "Full Nickel" },
    ],
  },
  {
    id: "aqua-vortex-360",
    name: "Aqua Vortex Pro 360 Liquid",
    category: "cooling",
    platform: "AIO · Triple 120mm Magnetic Fan",
    price: 229.0,
    badge: "IN STOCK",
    badgeType: "stock",
    featureTag: "IPS DISPLAY PUMP",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ843wJX7_Nb_hzXLIiVgqMn-loFiUKNkSdX5-d3fl0lU2M5AYvV7uLjZ_WXjx3bsAS4YMBJiG3NrhJ1Lnh7TzT0-AWIP89wvmwBnWm2nRvpTH7GZB15aIqrVRYKDtLvlIfAwU0CeFlgF04HYNkMUYxtacCBctjpdIRkI4KNWLGbA4Ndnt70kA7glEqHXSpnXkLQzGvQz6bQ790j_JuWFzoP5oAjDyc8XWsvYo78I9",
    specs: [
      { label: "Radiator", value: "397mm Copper" },
      { label: "Pump", value: "3200 RPM" },
      { label: "Noise", value: "18.2 dBA max" },
      { label: "Socket", value: "LGA1700/AM5" },
    ],
  },
  {
    id: "direct-die-block",
    name: "Direct-Die Mirror Copper Block",
    category: "cooling",
    platform: "Custom Loop · Direct Die Contact",
    price: 119.0,
    badge: "DELID OPTIMIZED",
    badgeType: "limited",
    featureTag: "PURE C1100 COPPER",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-eFc0cxcHHxk884HOCMr8vpYIGMJxgDVXwYwH2irGHeG69xVs-trobjK_8OwWNsNTsFVefbetc2rIP9iVjZviYO9DS22S3z43V6VuQfI6vLJdG05l2iSMlItjF7yrqIlQzVCaIFNUtjcbBmBOkOm9-64PQY4Vn1FQ47ZauXQqq-eY7bhTsTgoDMA9lMyvshtmVh-27CchOx8KGx7fs6zLLhayXDANDQMR3RaB64Xg",
    specs: [
      { label: "Material", value: "C1100 Copper" },
      { label: "Finish", value: "Mirror Polish" },
      { label: "Delta T", value: "-14.2 °C" },
      { label: "Fitting", value: "G1/4\" Standard" },
    ],
  },
  {
    id: "gskill-trident-64",
    name: "G.Skill Trident Z5 RGB 64GB",
    category: "memory",
    platform: "DDR5 · Dual Channel Kit (2x32GB)",
    price: 289.0,
    badge: "IN STOCK",
    badgeType: "stock",
    featureTag: "CL30 LOW LATENCY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJCbPTu_N-WytQ-UtptENHzT27-mtjjj-B5M-Dd0wadhoIiMwdKDX-r9Emzwjc07HQDjteORB4TjOW66i-Y1Q-ZeJjkuivn52So6-WIpjHEb4wYPkWC34e9eBYn84Fb0dbzK25VxR0egzMRihyEMDUDHRoMwnD2sTz9ED0GxmM5kLr7O9S6-cAE4fmBjxicL_lXnXhyJKLDcdQuFKDAQ4r9fo66yD-KrLH9zRAvKRt",
    specs: [
      { label: "Speed", value: "DDR5-6400" },
      { label: "Timings", value: "30-38-38-96" },
      { label: "Voltage", value: "1.40V" },
      { label: "Profile", value: "Intel XMP / AMD EXPO" },
    ],
  },
  {
    id: "asus-rog-hero",
    name: "ROG Maximus Z790 Dark Hero",
    category: "memory",
    platform: "LGA1700 · Intel Z790 Chipset",
    price: 699.0,
    badge: "TIER-1 LAB SPEC",
    badgeType: "exclusive",
    featureTag: "20+1+2 POWER STAGES",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEnkge0rLgjvddL47p1TJB_Hb2oLQ_fe6az7ZZNnLRwaJBR85YK586z2KsgPwUlhCpD7l34ngwYWhCLyG0lMfkv2hf1nfbouawg9nZyJozaytJGhWHqT_PbKw0IHQQ40LipSHoV2A3ZuBfU0XkorcksEoJEZBeIdRhhmpA9UEq02R7DJMiYq8rzHdBzOGJEicUpgOg8rFFpkbFUa40LsBjDW4iBKM-OGFxcotPFjVt",
    specs: [
      { label: "VRM", value: "90A Power Stages" },
      { label: "PCIe", value: "Gen 5.0 x16" },
      { label: "Network", value: "Wi-Fi 7 + 2.5G LAN" },
      { label: "Audio", value: "SupremeFX ALC4082" },
    ],
  },
];

const TRUST_STATS = [
  {
    icon: "verified",
    value: "99.4%",
    title: "Repair Success Rate",
    description: "Validated component micro-soldering level",
    color: "text-primary",
  },
  {
    icon: "desktop_windows",
    value: "15,000+",
    title: "Custom Builds Delivered",
    description: "Bespoke hardline & extreme workstations",
    color: "text-secondary",
  },
  {
    icon: "timelapse",
    value: "24h",
    title: "Diagnostic Turnaround",
    description: "Oscilloscope and stress load benchmarks",
    color: "text-tertiary",
  },
  {
    icon: "handshake",
    value: "Tier-1",
    title: "Authorized Partner",
    description: "Direct OEM Intel, AMD & NVIDIA Allocation",
    color: "text-primary-fixed-dim",
  },
];

export default function HomePage() {
  const [filter, setFilter] = useState<string>("all");
  const [cartCount, setCartCount] = useState(3);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const filteredProducts =
    filter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === filter);

  const handleAddToCart = (id: string) => {
    setCartCount((prev) => prev + 1);
    setAddedItem(id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── Immersive Cyber-Aquatic Hero Section ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-space-2xl">
        {/* Ambient Bioluminescent Glow Elements */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-secondary-container/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-gutter-lg relative z-10 flex flex-col gap-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center pt-space-md">
            {/* Hero Left Column: Narrative & Action with Framer Motion Fade-ins */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-high w-fit shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_currentColor] animate-pulse" />
                <span className="font-mono text-label-tech text-secondary tracking-wider uppercase">
                  Next-Gen Hydro Telemetry Active
                </span>
                <span className="font-mono text-label-badge text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded">
                  v4.8 REV
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-space-sm"
              >
                <h1 className="font-syne text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight">
                  Liquid-Cooled Precision.{" "}
                  <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
                    Elite PC Hardware
                  </span>{" "}
                  &amp; Master Repair Services.
                </h1>
                <p className="text-body-lg text-on-surface-variant max-w-2xl">
                  Discover next-gen silicon, custom enthusiast water-cooling loops, and white-glove diagnostic &amp; repair solutions engineered for extreme performance and sustained acoustic calm.
                </p>
              </motion.div>

              {/* Dual CTAs with subtle stagger */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-space-md pt-space-xs"
              >
                <a
                  href="#hardware-showcase"
                  className="inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary-container via-primary to-secondary text-on-primary font-syne text-title-md shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(6,182,212,0.65)] hover:-translate-y-0.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    memory
                  </span>
                  <span>Explore PC Hardware</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-space-sm px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all hover:border-primary/40 hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    build_circle
                  </span>
                  <span>Book Repair Diagnosis</span>
                </Link>
              </motion.div>

              {/* Quick Hardware Assurance Micro-badges */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-space-lg pt-space-sm text-on-surface-variant"
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    verified
                  </span>
                  <span className="text-body-sm">
                    Silicon Binning &amp; Delid Guarantee
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    water_drop
                  </span>
                  <span className="text-body-sm">
                    0.00% Leak Tolerance
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Column: Graphic Rig Showcase & Telemetry HUD with entrance motion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl bg-surface-container-high/90 backdrop-blur-2xl p-space-lg shadow-xl border border-primary/20 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header of HUD */}
                <div className="flex items-center justify-between pb-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      thermostat
                    </span>
                    <span className="font-mono text-label-tech text-on-surface uppercase tracking-wider">
                      AQUA-LAB TEST BENCH 07
                    </span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full bg-secondary/10 text-secondary font-mono text-label-badge uppercase border border-secondary/20">
                    LOOP INTACT
                  </span>
                </div>

                {/* Hardware Rig Image (Optimized with priority & responsive sizes) */}
                <div className="relative w-full h-72 rounded-xl overflow-hidden bg-surface-container-lowest">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzAgT1ycU31D0XXng7zUxriWh_-AJeqiSxHggoL5n3OUn4967qRAk-8lipNJE3yhEI7S-rW0Vsvwu_WISzGD-15X3dYeF9K8GgkFpO0o95G7tY4kRuq23kMPeGXuxcIWu_DjNPW1oqvT0x2nL2DyfK_lPLNU9uUWFRgb9EIlVpHynrASnW-tXBGyJPMH-euBM4FfPsd68trJRjtrzVLpUxXR_f5_msEEoRUSf5azYx"
                    alt="High-end enthusiast open-frame liquid-cooled gaming PC"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />

                  {/* Floating Pill on Image */}
                  <div className="absolute bottom-3 left-3 bg-surface-container/90 backdrop-blur-md px-space-md py-space-xs rounded-lg flex items-center gap-space-sm shadow-md border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      speed
                    </span>
                    <span className="font-mono text-label-tech text-on-surface">
                      Flow Velocity: 3.8 L/min
                    </span>
                  </div>
                </div>

                {/* Dynamic Telemetry Feed Grid */}
                <div className="grid grid-cols-3 gap-space-sm mt-space-md">
                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col border border-outline-variant/15">
                    <span className="font-mono text-[10px] text-outline uppercase">
                      Core Delta-T
                    </span>
                    <span className="font-mono text-telemetry-num text-primary pt-0.5">
                      +24.3 °C
                    </span>
                    <span className="text-[10px] text-secondary">
                      Ambient Balanced
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col border border-outline-variant/15">
                    <span className="font-mono text-[10px] text-outline uppercase">
                      Draw Active
                    </span>
                    <span className="font-mono text-telemetry-num text-on-surface pt-0.5">
                      582 W
                    </span>
                    <span className="text-[10px] text-primary">
                      96.8% Titanium Eff.
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col border border-outline-variant/15">
                    <span className="font-mono text-[10px] text-outline uppercase">
                      Acoustic SPL
                    </span>
                    <span className="font-mono text-telemetry-num text-secondary pt-0.5">
                      21.4 dBA
                    </span>
                    <span className="text-[10px] text-outline">
                      Whisper Tier
                    </span>
                  </div>
                </div>

                {/* Mini Live Wattage / Thermal Gauge Chart */}
                <div className="mt-space-md flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant font-mono text-label-tech">
                      Hydro-Loop Saturation Capacity
                    </span>
                    <span className="text-primary font-mono text-telemetry-num">
                      44% Used
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary via-primary to-tertiary w-[44%] rounded-full shadow-[0_0_12px_rgba(76,215,246,0.6)]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Trust Proof Stats Banner ── */}
          <div className="w-full rounded-2xl bg-surface-container p-space-lg shadow-lg border border-outline-variant/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {TRUST_STATS.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1 items-start">
                  <div className={`flex items-center gap-space-xs ${stat.color}`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {stat.icon}
                    </span>
                    <span className="font-syne text-display-hero-mobile tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <span className="font-syne text-title-md text-on-surface">
                    {stat.title}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {stat.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Featured PC Hardware Showcase ── */}
      <section className="w-full py-space-2xl bg-surface" id="hardware-showcase">
        <div className="max-w-[1440px] mx-auto px-gutter-lg flex flex-col gap-space-xl">
          {/* Showcase Header with Tab Switches */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  developer_board
                </span>
                <span className="font-mono text-label-tech uppercase tracking-widest">
                  Inventory Lab Access
                </span>
              </div>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Featured Enthusiast Hardware
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Factory-binned processors, high-copper cooling solutions, and flagship graphics engines.
              </p>
            </div>

            {/* Filter Tab Buttons */}
            <div className="flex flex-wrap items-center gap-space-xs p-1 rounded-xl bg-surface-container-high border border-outline-variant/20">
              {[
                { id: "all", label: "All Silicon" },
                { id: "cpu", label: "Processors" },
                { id: "gpu", label: "Graphics Cards" },
                { id: "cooling", label: "Liquid Cooling" },
                { id: "memory", label: "Memory & Boards" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-space-md py-space-xs rounded-lg font-syne text-title-md transition-all ${
                    filter === tab.id
                      ? "bg-primary-container text-on-primary-container shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-surface-container p-space-md flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-outline-variant/15 hover:border-primary/40"
              >
                <div className="flex flex-col gap-space-md">
                  {/* Hardware Image Well */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-2.5 right-2.5 px-space-sm py-0.5 rounded-full font-mono text-[10px] uppercase border ${
                        product.badgeType === "stock"
                          ? "bg-secondary/15 text-secondary border-secondary/30"
                          : product.badgeType === "limited"
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-tertiary/15 text-tertiary border-tertiary/30"
                      }`}
                    >
                      {product.badge}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 px-space-sm py-0.5 rounded bg-surface-container-high/90 text-primary font-mono text-label-tech border border-outline-variant/20">
                      {product.featureTag}
                    </span>
                  </div>

                  {/* Hardware Titles & Specs */}
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
                      {product.platform}
                    </span>
                    <h3 className="font-syne text-title-md text-on-surface group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Spec Pairing */}
                    <div className="grid grid-cols-2 gap-space-xs mt-space-xs">
                      {product.specs.map((spec, i) => (
                        <div
                          key={i}
                          className="p-space-xs rounded bg-surface-container-high font-mono text-label-tech text-on-surface-variant flex justify-between"
                        >
                          <span>{spec.label}:</span>
                          <span className="text-on-surface font-semibold">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Price & Action */}
                <div className="mt-space-lg pt-space-sm flex items-center justify-between border-t border-outline-variant/15">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-outline uppercase">
                      Retail Lab Price
                    </span>
                    <span className="font-syne text-headline-sm text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      aria-label="Compare Product"
                      className="p-space-sm rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        balance
                      </span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`px-space-md py-space-sm rounded-lg font-syne text-body-md transition-all shadow-sm ${
                        addedItem === product.id
                          ? "bg-secondary text-surface font-bold"
                          : "bg-primary text-on-primary hover:bg-primary-fixed-dim"
                      }`}
                      type="button"
                    >
                      {addedItem === product.id ? "Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Bespoke Water-Cooling Architecture Teaser ── */}
      <section className="w-full py-space-2xl bg-surface-container-lowest border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto px-gutter-lg flex flex-col gap-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
                // HYDRO DYNAMICS SPECIALIZATION
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Precision Hand-Bent Hardline Loops
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Every custom water loop we design is measured down to the millimeter. Using premium acrylic or industrial copper tubing, CNC-milled acrylic distribution plates, and dual-pump D5 redundant loops, we guarantee sub-ambient thermal margins and whisper-silent acoustic performance.
              </p>
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary">
                    check_circle
                  </span>
                  <span className="text-on-surface text-body-md">
                    Helium &amp; dry-nitrogen leak test certified up to 2.0 BAR
                  </span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary">
                    check_circle
                  </span>
                  <span className="text-on-surface text-body-md">
                    Custom fluid viscosity and biocide formulation included
                  </span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary">
                    check_circle
                  </span>
                  <span className="text-on-surface text-body-md">
                    Direct-die CPU delid and custom full-cover GPU water blocks
                  </span>
                </div>
              </div>
              <div className="pt-space-sm">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-space-xs text-primary hover:text-primary-fixed font-syne text-title-md transition-colors"
                >
                  <span>Explore Liquid Cooling Protocols</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-primary/20 p-space-lg shadow-xl">
                <div className="relative w-full h-[360px] rounded-xl overflow-hidden">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp5XScZK4J0J5uZcjpWUe9tLQHruoNtDTru3Suf2QQO7OzsRmeNGxFYv0m7kUcGuQj93-k-oFAsXVhdM5yq_I7ELDoqXrKkZzS9zze64mlZroyW5zOBLo-zK44XVE789CnAk6nIlUwmE7MyekZpeBE9rkKcH3qNNWMTFysyb_1jtMfjLpUeu2pAAyCeN59NN_rKXKwLKGaHhneSjgKLO0rDfYMutiY9bfXvwM2qvBm"
                    alt="Precision custom liquid loop assembly workbench"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-surface-container-high/90 backdrop-blur-md p-space-md rounded-xl border border-outline-variant/30">
                    <div>
                      <span className="font-mono text-[10px] text-primary uppercase block">
                        BENCH LAB SPECIFICATION
                      </span>
                      <span className="font-syne text-title-md text-on-surface">
                        Zero-Leak Hydro Dynamics Guarantee
                      </span>
                    </div>
                    <span className="px-space-sm py-1 rounded bg-secondary/15 text-secondary font-mono text-label-tech">
                      2-YEAR SLA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Call to Action Banner ── */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-[1440px] mx-auto px-gutter-lg">
          <div className="rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-space-xl md:p-space-2xl border border-primary/30 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="max-w-2xl flex flex-col gap-space-md relative z-10">
              <span className="font-mono text-label-tech text-secondary tracking-widest uppercase">
                READY TO ELEVATE YOUR RIG?
              </span>
              <h2 className="font-syne text-headline-lg text-on-surface">
                Consult With Our Master Hardware Engineers Today
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Whether you need catastrophic diagnostic triage, custom loop maintenance, or are planning your next dream workstation build, our Austin laboratory is ready.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link
                  href="/contact"
                  className="px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all"
                >
                  Book Diagnostics Intake
                </Link>
                <Link
                  href="/pricing"
                  className="px-space-xl py-space-md rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-colors"
                >
                  View Service Rate Card
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
