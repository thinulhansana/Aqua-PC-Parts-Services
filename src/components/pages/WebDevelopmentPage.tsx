"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Code2,
  Globe,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  Store,
  User,
  Zap,
} from "lucide-react";
import heroStudioImg from "@/assets/images/web_dev_hero_studio_1795711940326.jpg";
import businessWebImg from "@/assets/images/web_dev_business_ecommerce_1795711937294.jpg";
import personalWebImg from "@/assets/images/web_dev_personal_portfolio_1795711939202.jpg";
import {
  SITE_LOCATION,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_EMAIL,
  SITE_EMAIL_HREF,
} from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/shopData";
import {
  RevealSection,
  EASE_PREMIUM,
  fadeUpVariants,
} from "@/components/ui/MotionPrimitives";

type AudienceTab = "business" | "personal";

interface CapabilityItem {
  num: string;
  title: string;
  summary: string;
  outcome: string;
  span: string;
}

const BUSINESS_CAPABILITIES: CapabilityItem[] = [
  {
    num: "01.",
    title: "Corporate & Local Business Websites",
    summary:
      "Fast, credible company websites built to convert Sri Lankan and international visitors into phone calls, WhatsApp inquiries, and booked appointments.",
    outcome: "Google Maps, SEO metadata, custom email & mobile-first layout",
    span: "lg:col-span-7",
  },
  {
    num: "02.",
    title: "E-Commerce & Online Catalogs",
    summary:
      "Complete online stores with LKR product filtering, shopping cart, WhatsApp or gateway checkout, and an easy admin view to update stock and prices.",
    outcome: "Instant search, variant pricing & inventory management",
    span: "lg:col-span-5",
  },
  {
    num: "03.",
    title: "Booking, Clinic & Hospitality Portals",
    summary:
      "Structured reservation pages for hotels, villas, salons, tuition academies, and medical practices with clear schedules, menus, and direct inquiry routing.",
    outcome: "Reduced manual messaging & clear service rate tables",
    span: "lg:col-span-5",
  },
  {
    num: "04.",
    title: "Custom Web Applications & Client Dashboards",
    summary:
      "Bespoke Next.js web systems including customer portals, repair or order tracking tools, quotation builders, and secure cloud-backed databases.",
    outcome: "Role-based sign-in, live status tracking & cloud persistence",
    span: "lg:col-span-7",
  },
];

const PERSONAL_CAPABILITIES: CapabilityItem[] = [
  {
    num: "01.",
    title: "Personal Portfolios & Creative Showcases",
    summary:
      "Editorial-grade showcase sites for photographers, videographers, designers, software engineers, and freelancers who want their work framed without platform clutter.",
    outcome: "High-speed image galleries, project case studies & direct contact",
    span: "lg:col-span-7",
  },
  {
    num: "02.",
    title: "Interactive Resumes & Career Profiles",
    summary:
      "A clean personal website under your own name that pairs downloadable CV access with project proof to stand out to local and overseas employers.",
    outcome: "Custom domain ready, printable layout & LinkedIn/GitHub sync",
    span: "lg:col-span-5",
  },
  {
    num: "03.",
    title: "Wedding, Event & Invitation Microsites",
    summary:
      "Shareable digital invitations with ceremony schedules, Google Maps directions, dress-code details, RSVP submission, and post-event photo albums.",
    outcome: "One link for WhatsApp guests across Sri Lanka & abroad",
    span: "lg:col-span-5",
  },
  {
    num: "04.",
    title: "Personal Brands, Blogs & Educator Hubs",
    summary:
      "Own your audience outside social algorithms with a fast personal blog, tuition resource portal, or creator link hub tailored to your visual identity.",
    outcome: "Zero monthly platform lock-in, clean typography & SEO ready",
    span: "lg:col-span-7",
  },
];

const PACKAGES = [
  {
    id: "personal",
    audience: "Personal & Creator",
    name: "Personal Starter",
    price: 15000,
    priceLabel: "From Rs. 15,000",
    timeline: "5 – 7 Days",
    summary:
      "Ideal for personal portfolios, interactive resumes, freelancers, and digital wedding or event microsites.",
    features: [
      "Up to 3 tailored sections or pages",
      "Responsive design for mobile, tablet & desktop",
      "Direct WhatsApp & email inquiry integration",
      "Free SSL security certificate & launch setup",
      "1 month of post-launch text & photo support",
    ],
    featured: false,
  },
  {
    id: "business",
    audience: "Small & Growing Business",
    name: "Business Growth",
    price: 35000,
    priceLabel: "From Rs. 35,000",
    timeline: "7 – 14 Days",
    summary:
      "Designed for companies, shops, clinics, and service providers ready to generate consistent local and online leads.",
    features: [
      "Up to 6 custom-designed pages & service views",
      "On-page Google SEO, OpenGraph & Maps embed",
      "Validated lead capture form & WhatsApp routing",
      "Speed-tuned image & Core Web Vitals optimization",
      "3 months of technical support & minor updates",
    ],
    featured: true,
  },
  {
    id: "ecommerce",
    audience: "Retail & Custom Platform",
    name: "E-Commerce & Web App",
    price: 75000,
    priceLabel: "From Rs. 75,000",
    timeline: "2 – 4 Weeks",
    summary:
      "Full online storefronts, searchable catalogs, booking platforms, or custom dashboards built with modern cloud stacks.",
    features: [
      "Product catalog, category filters & shopping cart",
      "Admin dashboard for live price & stock edits",
      "Customer authentication & order / quote history",
      "WhatsApp order checkout or payment integration",
      "6 months priority maintenance & hosting guidance",
    ],
    featured: false,
  },
] as const;

const ESTIMATOR_TYPES = [
  { id: "personal", label: "Personal / Portfolio", base: 15000, days: "5–7 days" },
  { id: "business", label: "Business Website", base: 35000, days: "7–14 days" },
  { id: "ecommerce", label: "E-Commerce Store", base: 75000, days: "2–3 weeks" },
  { id: "webapp", label: "Custom Web App", base: 110000, days: "3–5 weeks" },
] as const;

const ESTIMATOR_SCOPES = [
  { id: "compact", label: "1–3 Pages", delta: 0 },
  { id: "standard", label: "4–7 Pages", delta: 12000 },
  { id: "expanded", label: "8+ Pages / Catalog", delta: 26000 },
] as const;

const ESTIMATOR_ADDONS = [
  { id: "domain", label: "Domain (.com / .lk) & Business Email Setup", cost: 6500 },
  { id: "cms", label: "Admin Panel to Edit Content & Prices", cost: 14000 },
  { id: "cart", label: "Shopping Cart / WhatsApp Order Builder", cost: 12000 },
  { id: "bilingual", label: "Dual Language (English + Sinhala)", cost: 9500 },
  { id: "express", label: "Priority Express Turnaround", cost: 10000 },
] as const;

const PROCESS_STEPS = [
  {
    step: "01.",
    title: "Discovery & Structure",
    desc: "We map your business goals or personal brand story, agree on exact pages, and lock a transparent LKR scope before writing code.",
  },
  {
    step: "02.",
    title: "Interface & Mobile Design",
    desc: "Every layout is crafted specifically for your brand—no bloated templates—tested across mobile screens and desktop monitors.",
  },
  {
    step: "03.",
    title: "Clean Engineering & SEO",
    desc: "Built on modern React, Next.js, and edge hosting for instant page loads, clean semantic HTML, and strong Google Search indexing.",
  },
  {
    step: "04.",
    title: "Launch & Ongoing Care",
    desc: "We connect your domain, SSL certificate, analytics, and WhatsApp channels—plus stay available directly whenever you need updates.",
  },
];

function formatLkr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

export default function WebDevelopmentPage() {
  const [audience, setAudience] = useState<AudienceTab>("business");

  // Interactive Project Estimator State
  const [projectType, setProjectType] = useState<string>("business");
  const [scopeId, setScopeId] = useState<string>("standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["domain"]);

  // Lead Capture Brief Form State
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyPackagePreset = (pkgId: "personal" | "business" | "ecommerce") => {
    setProjectType(pkgId);
    setScopeId(pkgId === "personal" ? "compact" : pkgId === "business" ? "standard" : "expanded");
    setSelectedAddons(pkgId === "ecommerce" ? ["domain", "cms", "cart"] : ["domain"]);
    const el = document.getElementById("estimator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const estimate = useMemo(() => {
    const typeObj =
      ESTIMATOR_TYPES.find((t) => t.id === projectType) ?? ESTIMATOR_TYPES[1];
    const scopeObj =
      ESTIMATOR_SCOPES.find((s) => s.id === scopeId) ?? ESTIMATOR_SCOPES[1];
    const addonCost = selectedAddons.reduce((sum, id) => {
      const addon = ESTIMATOR_ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.cost : 0);
    }, 0);

    // Avoid double-charging scope delta when already included in starter/ecom baseline
    const effectiveScopeDelta =
      projectType === "ecommerce" && scopeId === "expanded"
        ? 10000
        : scopeObj.delta;

    const minTotal = typeObj.base + effectiveScopeDelta + addonCost;
    const maxTotal = Math.round((minTotal * 1.18) / 500) * 500;

    return {
      typeObj,
      scopeObj,
      minTotal,
      maxTotal,
      timeline: selectedAddons.includes("express")
        ? "Priority Fast-Track"
        : typeObj.days,
    };
  }, [projectType, scopeId, selectedAddons]);

  const addonLabels = selectedAddons
    .map((id) => ESTIMATOR_ADDONS.find((a) => a.id === id)?.label)
    .filter(Boolean) as string[];

  const whatsappEstimateUrl = buildWhatsAppUrl(
    [
      `Hi ${SITE_NAME}, I'd like a website development quote:`,
      `• Project Type: ${estimate.typeObj.label}`,
      `• Scope: ${estimate.scopeObj.label}`,
      `• Add-ons: ${addonLabels.length ? addonLabels.join(", ") : "None"}`,
      `• Estimated Budget: ${formatLkr(estimate.minTotal)} – ${formatLkr(estimate.maxTotal)}`,
      clientName ? `• Name: ${clientName}` : null,
      clientContact ? `• Contact: ${clientContact}` : null,
      projectNotes ? `• Notes: ${projectNotes}` : null,
    ]
      .filter(Boolean)
      .join("\n")
  );

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = clientName.trim();
    const trimmedContact = clientContact.trim();

    if (trimmedName.length < 2) {
      setFormError("Please enter your full name or business name.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const isValidPhone = /^[+\d][\d\s-]{7,18}$/.test(trimmedContact);

    if (!isValidEmail && !isValidPhone) {
      setFormError("Please enter a valid phone/WhatsApp number or email address.");
      return;
    }

    setSubmitting(true);
    const refCode = `AQW-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const res = await fetch("https://formspree.io/f/mljjkokj", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "Brief Reference": refCode,
          "Service Division": "Aqua Web Studio (Website Development)",
          "Client Name": trimmedName,
          "Phone / Email": trimmedContact,
          "Project Type": estimate.typeObj.label,
          "Page Scope": estimate.scopeObj.label,
          "Selected Add-ons": addonLabels.join(", ") || "None",
          "Estimated Range": `${formatLkr(estimate.minTotal)} – ${formatLkr(estimate.maxTotal)}`,
          "Project Notes": projectNotes.trim() || "No extra notes provided",
          _subject: `[${SITE_NAME} Web Studio] ${refCode} - ${trimmedName}`,
        }),
      });

      if (!res.ok) {
        setFormError(
          "We could not submit the form right now. Use the WhatsApp button below for an instant reply."
        );
      } else {
        setSubmittedRef(refCode);
      }
    } catch {
      setFormError(
        `Network issue while sending your brief. Please tap WhatsApp or call ${SITE_PHONE_DISPLAY}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const activeCapabilities =
    audience === "business" ? BUSINESS_CAPABILITIES : PERSONAL_CAPABILITIES;

  return (
    <div className="flex flex-col w-full overflow-x-clip bg-surface">
      {/* ── 1. Hero Section ── */}
      <section className="relative w-full bg-surface-container-lowest -mt-20 pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-10 border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface-variant"
            >
              <span className="text-primary font-semibold">Aqua Web Studio</span>
              <span aria-hidden="true">·</span>
              <span>Business &amp; Personal Websites</span>
              <span aria-hidden="true">·</span>
              <span>{SITE_LOCATION}</span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-syne text-[clamp(2.25rem,4vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-on-surface [text-wrap:balance]"
            >
              Websites built for Sri Lankan businesses and personal ambitions.
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant leading-relaxed max-w-[60ch]"
            >
              We design and engineer fast, mobile-first websites for retail shops,
              service companies, online stores, portfolios, resumes, and events.
              Direct communication, clean code ownership, and honest LKR pricing.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <a
                href="#estimator"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne font-bold text-body-md transition-all duration-200 whitespace-nowrap shrink-0 shadow-sm"
              >
                <span>Estimate Your Website</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href={whatsappEstimateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne font-semibold text-body-md border border-outline-variant/35 transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-secondary shrink-0" />
                <span>Discuss on WhatsApp</span>
              </a>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-on-surface-variant"
            >
              <span>Personal sites from Rs. 15,000</span>
              <span aria-hidden="true" className="text-outline-variant">·</span>
              <span>Business sites from Rs. 35,000</span>
              <span aria-hidden="true" className="text-outline-variant">·</span>
              <span>SSL, SEO &amp; mobile-ready included</span>
            </motion.div>
          </div>

          {/* Right Dominant 16:9 / Full-Height Studio Image */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="lg:col-span-6 flex"
          >
            <div className="relative w-full min-h-[300px] sm:min-h-[380px] lg:h-full rounded-2xl overflow-hidden border border-outline-variant/25 bg-surface-container">
              <Image
                src={heroStudioImg}
                alt="Aqua Web Studio workstation showcasing responsive business websites across desktop, laptop, and mobile devices"
                fill
                priority
                referrerPolicy="no-referrer"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-white">
                <div>
                  <p className="font-mono text-xs text-cyan-300 tracking-wide">
                    Responsive Web Engineering
                  </p>
                  <p className="font-syne text-title-md font-bold mt-0.5">
                    Desktop, Tablet &amp; Mobile Precision
                  </p>
                </div>
                <span className="font-mono text-xs text-white/85 tabular-nums">
                  5 – 21 Day Delivery
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Key Capabilities Strip Below Hero Split */}
        <div className="max-w-[1320px] mx-auto mt-10 pt-8 border-t border-outline-variant/20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Smartphone,
              label: "Mobile-First Layouts",
              detail: "Built for Sri Lankan 4G & mobile shoppers",
            },
            {
              icon: Zap,
              label: "Fast Edge Loading",
              detail: "Modern Next.js & static edge architecture",
            },
            {
              icon: Globe,
              label: "Google Search Ready",
              detail: "Structured SEO, sitemaps & LocalBusiness schema",
            },
            {
              icon: ShieldCheck,
              label: "Full Code Ownership",
              detail: "Your domain, SSL & files with zero lock-in",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/25 flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-syne text-body-md font-bold text-on-surface">
                    {item.label}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 2. Business vs Personal Interactive Capabilities ── */}
      <RevealSection className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-10 bg-surface">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-primary font-semibold">
                Tailored Solutions
              </p>
              <h2 className="font-syne text-headline-lg text-on-surface mt-1.5 [text-wrap:balance]">
                What we build for businesses and individuals
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">
                Switch between commercial business systems and personal web projects
                to explore deliverables crafted for your exact goal.
              </p>
            </div>

            {/* Functional Segmented Switcher */}
            <div
              role="tablist"
              aria-label="Website solution category"
              className="inline-flex items-center p-1 rounded-xl bg-surface-container-high border border-outline-variant/25 self-start lg:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={audience === "business"}
                onClick={() => setAudience("business")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-syne text-body-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  audience === "business"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>For Businesses</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={audience === "personal"}
                onClick={() => setAudience("personal")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-syne text-body-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  audience === "personal"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>For Personal Needs</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE_PREMIUM }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Showcase Preview */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20">
                <div className="relative aspect-[4/3] w-full bg-surface-container-lowest">
                  <Image
                    src={audience === "business" ? businessWebImg : personalWebImg}
                    alt={
                      audience === "business"
                        ? "Business website and e-commerce storefront mockup"
                        : "Personal portfolio and resume website mockup"
                    }
                    fill
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <p className="font-mono text-xs text-cyan-300">
                      {audience === "business"
                        ? "Business & E-Commerce"
                        : "Personal & Creative"}
                    </p>
                    <p className="font-syne text-title-md font-bold mt-0.5">
                      {audience === "business"
                        ? "Built to earn trust and drive real LKR sales"
                        : "Designed to make your name and work unforgettable"}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {audience === "business"
                      ? "From retail stores, vehicle dealers, and restaurants to clinics and engineering firms, we build websites that rank on Google and route ready-to-buy customers directly to your phone and WhatsApp."
                      : "Whether you are applying for software roles, showcasing photography, announcing a wedding, or launching a personal brand, you get a polished custom website without wrestling with clunky builders."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 text-body-sm">
                    <span className="font-mono text-on-surface-variant tabular-nums">
                      {audience === "business"
                        ? "Starting from Rs. 35,000"
                        : "Starting from Rs. 15,000"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        applyPackagePreset(
                          audience === "business" ? "business" : "personal"
                        )
                      }
                      className="inline-flex items-center gap-1.5 font-syne font-semibold text-primary hover:underline cursor-pointer whitespace-nowrap"
                    >
                      <span>Configure Scope</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Asymmetric Bento Capabilities */}
              <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {activeCapabilities.map((item) => (
                  <div
                    key={item.title}
                    className={`${item.span} p-6 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between gap-4 hover:border-primary/40 transition-colors duration-200`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-xs text-primary font-semibold">
                        {item.num}
                      </span>
                      <h3 className="font-syne text-title-lg font-bold text-on-surface">
                        {item.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <p className="pt-3 border-t border-outline-variant/15 font-mono text-xs text-on-surface-variant">
                      {item.outcome}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </RevealSection>

      {/* ── 3. Transparent LKR Web Packages ── */}
      <RevealSection className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-10 bg-surface-container-lowest border-y border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-secondary font-semibold">
                Transparent LKR Pricing
              </p>
              <h2 className="font-syne text-headline-lg text-on-surface mt-1.5">
                Clear packages with no hidden retainers
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Choose a starting tier below or fine-tune exact features in the
              interactive scope estimator directly beneath.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-7 rounded-2xl flex flex-col justify-between gap-6 border transition-colors duration-200 ${
                  pkg.featured
                    ? "bg-surface-container border-primary/60"
                    : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/50"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-on-surface-variant">
                    <span>{pkg.audience}</span>
                    <span className="tabular-nums">{pkg.timeline}</span>
                  </div>

                  <div>
                    <h3 className="font-syne text-headline-sm font-bold text-on-surface">
                      {pkg.name}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                      {pkg.summary}
                    </p>
                  </div>

                  <div className="py-3 border-y border-outline-variant/20 flex items-baseline justify-between">
                    <span className="font-syne text-headline-md font-bold text-primary tabular-nums">
                      {pkg.priceLabel}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">
                      One-time build
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5 text-body-sm text-on-surface">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => applyPackagePreset(pkg.id)}
                  className={`w-full py-3 px-4 rounded-xl font-syne font-bold text-body-md transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                    pkg.featured
                      ? "bg-primary hover:bg-primary-fixed-dim text-on-primary"
                      : "bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant/30"
                  }`}
                >
                  Select {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 4. Interactive Website Cost Estimator & Project Brief ── */}
      <section
        id="estimator"
        className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-10 bg-surface scroll-mt-24"
      >
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Configurator */}
          <div className="lg:col-span-7 flex flex-col gap-8 p-6 sm:p-8 rounded-2xl bg-surface-container border border-outline-variant/20">
            <div>
              <p className="font-mono text-xs text-primary font-semibold">
                Interactive Scope Builder
              </p>
              <h2 className="font-syne text-headline-md text-on-surface mt-1">
                Estimate your website budget in seconds
              </h2>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Configure your site type, page count, and add-ons to see a realistic
                Sri Lankan LKR estimate immediately.
              </p>
            </div>

            {/* Step 1: Project Type */}
            <div className="flex flex-col gap-3">
              <span className="font-syne text-body-md font-bold text-on-surface">
                01. What type of website do you need?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ESTIMATOR_TYPES.map((t) => {
                  const active = projectType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setProjectType(t.id)}
                      className={`p-4 rounded-xl text-left border transition-colors duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        active
                          ? "bg-primary/10 border-primary text-on-surface"
                          : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50 hover:text-on-surface"
                      }`}
                    >
                      <span className="font-syne font-semibold text-body-md">
                        {t.label}
                      </span>
                      <span className="font-mono text-xs text-primary tabular-nums whitespace-nowrap">
                        {formatLkr(t.base)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Size / Pages */}
            <div className="flex flex-col gap-3">
              <span className="font-syne text-body-md font-bold text-on-surface">
                02. Estimated size &amp; number of pages
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ESTIMATOR_SCOPES.map((s) => {
                  const active = scopeId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setScopeId(s.id)}
                      className={`p-3.5 rounded-xl text-left border transition-colors duration-200 cursor-pointer flex flex-col gap-1 ${
                        active
                          ? "bg-primary/10 border-primary text-on-surface"
                          : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50 hover:text-on-surface"
                      }`}
                    >
                      <span className="font-syne font-semibold text-body-sm">
                        {s.label}
                      </span>
                      <span className="font-mono text-xs text-outline tabular-nums">
                        {s.delta === 0 ? "Included" : `+ ${formatLkr(s.delta)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Features */}
            <div className="flex flex-col gap-3">
              <span className="font-syne text-body-md font-bold text-on-surface">
                03. Optional capabilities &amp; integrations
              </span>
              <div className="flex flex-col gap-2.5">
                {ESTIMATOR_ADDONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`p-3.5 rounded-xl border transition-colors duration-200 cursor-pointer flex items-center justify-between gap-4 select-none ${
                        checked
                          ? "bg-primary/10 border-primary/60 text-on-surface"
                          : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(addon.id)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                        <span className="text-body-sm font-medium text-on-surface">
                          {addon.label}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-secondary tabular-nums whitespace-nowrap">
                        + {formatLkr(addon.cost)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Estimate Summary & Brief Capture Form */}
          <div className="lg:col-span-5 flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/25 lg:sticky lg:top-24">
            <div className="flex flex-col gap-2 pb-5 border-b border-outline-variant/20">
              <span className="font-mono text-xs text-on-surface-variant">
                Estimated Investment
              </span>
              <div className="font-syne text-[clamp(1.65rem,2.6vw,2.2rem)] font-bold text-primary tabular-nums leading-tight">
                {formatLkr(estimate.minTotal)} – {formatLkr(estimate.maxTotal)}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface-variant pt-1">
                <span>{estimate.typeObj.label}</span>
                <span aria-hidden="true">·</span>
                <span>{estimate.scopeObj.label}</span>
                <span aria-hidden="true">·</span>
                <span>{estimate.timeline}</span>
              </div>
            </div>

            {submittedRef ? (
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-2 text-secondary font-syne font-bold text-title-md">
                  <Check className="w-5 h-5" />
                  <span>Project Brief Received</span>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Reference <strong className="font-mono text-on-surface">{submittedRef}</strong>{" "}
                  has been logged for {clientName}. We will review your scope and reply
                  with a fixed LKR proposal shortly.
                </p>
                <div className="flex flex-col gap-2.5 pt-2">
                  <a
                    href={whatsappEstimateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne font-bold text-body-md flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>Also Send Scope via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setProjectNotes("");
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne font-semibold text-body-sm border border-outline-variant/30 transition-colors cursor-pointer"
                  >
                    Configure Another Estimate
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBriefSubmit} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="web-client-name"
                    className="font-mono text-xs text-on-surface-variant"
                  >
                    Your Name or Business Name
                  </label>
                  <input
                    id="web-client-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Kasun Perera / Lanka Auto Parts"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface text-on-surface placeholder:text-outline text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="web-client-contact"
                    className="font-mono text-xs text-on-surface-variant"
                  >
                    WhatsApp Number or Email
                  </label>
                  <input
                    id="web-client-contact"
                    type="text"
                    required
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="+94 7X XXX XXXX or name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface text-on-surface placeholder:text-outline text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="web-project-notes"
                    className="font-mono text-xs text-on-surface-variant"
                  >
                    Brief Project Goal (Optional)
                  </label>
                  <textarea
                    id="web-project-notes"
                    rows={3}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Share your industry, reference links, or target launch date..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface text-on-surface placeholder:text-outline text-body-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-xs text-error font-medium">
                    {formError}
                  </p>
                )}

                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne font-bold text-body-md transition-colors duration-200 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  >
                    {submitting ? "Sending Project Brief..." : "Request Fixed Proposal"}
                  </button>

                  <a
                    href={whatsappEstimateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne font-semibold text-body-sm border border-outline-variant/30 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>Send This Estimate on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
              <a
                href={SITE_PHONE_HREF}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">{SITE_PHONE_DISPLAY}</span>
              </a>
              <a
                href={SITE_EMAIL_HREF}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{SITE_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Engineering Process & Technical Stack ── */}
      <RevealSection className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-10 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-mono text-xs text-primary font-semibold">
                How We Deliver
              </p>
              <h2 className="font-syne text-headline-lg text-on-surface mt-1.5">
                From first conversation to live domain
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                Next.js &amp; React
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-secondary" />
                Cloud Databases &amp; Auth
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-primary" />
                SEO &amp; Analytics
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col gap-3"
              >
                <span className="font-mono text-sm font-bold text-primary">
                  {item.step}
                </span>
                <h3 className="font-syne text-title-md font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quiet Closing Action Row */}
          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-syne text-headline-sm text-on-surface">
                Need both office PCs and a business website?
              </h3>
              <p className="text-body-md text-on-surface-variant mt-1">
                Bundle your workstation hardware setup with a custom website from one
                team in {SITE_LOCATION}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact?service=web-business"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-fixed-dim text-on-primary font-syne font-bold text-body-sm transition-colors whitespace-nowrap shrink-0"
              >
                <span>Open Project Intake</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne font-semibold text-body-sm border border-outline-variant/30 transition-colors whitespace-nowrap shrink-0"
              >
                <span>View All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
