"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/components/auth/AuthContext";
import { TOTAL_SHOP_ITEMS, buildWhatsAppUrl } from "@/lib/shopData";
import {
  SITE_NAME,
  SITE_LOCATION,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_WHATSAPP_URL,
  SITE_FACEBOOK_URL,
  SITE_FACEBOOK_HANDLE,
  SITE_INSTAGRAM_URL,
  SITE_INSTAGRAM_HANDLE,
  SITE_MAPS_URL,
  SITE_HOURS,
  AQUA_PC_PARTS_URL,
  AQUA_PC_PARTS_CONTACT_URL,
  AQUA_3D_PORTAL_URL,
} from "@/lib/constants";
import {
  RevealSection,
  SpotlightCard,
  MaskedReveal,
  CircuitFlowBackdrop,
  AnimatedNumber,
  fadeUpVariants,
  scaleInVariants,
} from "@/components/ui/MotionPrimitives";

const TechnicianChat = dynamic(
  () => import("@/components/contact/TechnicianChat"),
  {
    loading: () => (
      <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl flex items-center justify-center min-h-[360px] border border-outline-variant/20 animate-pulse">
        <div className="flex flex-col items-center gap-space-sm text-on-surface-variant font-mono text-label-tech">
          <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
            progress_activity
          </span>
          <span>Loading Direct WhatsApp Console...</span>
        </div>
      </div>
    ),
  }
);

const TicketTracer = dynamic(
  () => import("@/components/contact/TicketTracer"),
  {
    loading: () => (
      <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl flex items-center justify-center min-h-[360px] border border-outline-variant/20 animate-pulse">
        <div className="flex flex-col items-center gap-space-sm text-on-surface-variant font-mono text-label-tech">
          <span className="material-symbols-outlined text-[32px] text-secondary animate-spin">
            progress_activity
          </span>
          <span>Loading Ticket Inquiry Console...</span>
        </div>
      </div>
    ),
  }
);

const CATEGORY_LABELS: Record<string, string> = {
  emergency: "Repair / No-POST Diagnostic",
  cooling: "Thermal Service & Cooling Upgrade",
  "custom-build": "Custom PC Build Consultation",
  "hardware-purchase": "PC Parts Quote & Sourcing",
  workstation: "Business / Studio Workstation Support",
};

const URGENCY_LABELS: Record<
  string,
  { label: string; time: string; color: string }
> = {
  standard: {
    label: "Standard Queue",
    time: "48 – 72 Hours",
    color: "text-on-surface",
  },
  express: {
    label: "Express 24h",
    time: "Next Bench Slot",
    color: "text-primary",
  },
  emergency: {
    label: "Same-Day Priority",
    time: "Urgent Triage",
    color: "text-secondary",
  },
};

export default function ContactPage() {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthModal();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "emergency",
    specs: "",
    description: "",
    urgency: "standard",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Auto-fill empty client fields from active Auth.js session & saved account blueprint
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || session.user.name || "",
      email: prev.email || session.user.email || "",
    }));

    let cancelled = false;
    fetch("/api/account")
      .then((res) =>
        (res.ok ? res.json() : null) as Promise<{
          user?: {
            name?: string;
            email?: string;
            phone?: string;
            rigSpecs?: string;
          };
        } | null>
      )
      .then((data) => {
        const syncedUser = data?.user;
        if (cancelled || !syncedUser) return;
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || syncedUser.name || "",
          email: prev.email || syncedUser.email || "",
          phone: prev.phone || syncedUser.phone || "",
          specs: prev.specs || syncedUser.rigSpecs || "",
        }));
      })
      .catch(() => {
        // Non-blocking profile prefill
      });

    return () => {
      cancelled = true;
    };
  }, [status, session?.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const generatedTicket = "AQ-" + Math.floor(10000 + Math.random() * 90000);
    setTicketId(generatedTicket);

    try {
      const payload = {
        "Ticket ID": generatedTicket,
        "Client Full Name": formData.fullName,
        "Contact Email": formData.email,
        "Phone / WhatsApp": formData.phone || "Not provided",
        "Service Category":
          CATEGORY_LABELS[formData.category] || formData.category,
        "PC Specs": formData.specs || "None specified",
        "Issue & Request Details": formData.description,
        "Priority Level": formData.urgency.toUpperCase(),
        _subject: `[${SITE_NAME} Intake] ${generatedTicket} - ${formData.fullName}`,
      };

      const response = await fetch("https://formspree.io/f/mljjkokj", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = (await response.json().catch(() => null)) as {
          errors?: Array<{ message: string }>;
        } | null;
        if (data?.errors && data.errors.length > 0) {
          setSubmitError(
            data.errors
              .map((err: { message: string }) => err.message)
              .join(", ")
          );
        } else {
          setSubmitError(
            "Submission could not be completed. Please verify your email address or contact us directly on WhatsApp."
          );
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitError(
        `Network timeout. Please check your connection, call ${SITE_PHONE_DISPLAY}, or message us on WhatsApp.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(ticketId);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      category: "emergency",
      specs: "",
      description: "",
      urgency: "standard",
    });
    setIsSubmitted(false);
    setSubmitError(null);
    setTicketId("");
  };

  const scrollToTracer = () => {
    const el = document.getElementById("telemetry-tracer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ticketWhatsAppUrl = buildWhatsAppUrl(
    `Hi ${SITE_NAME}, I just submitted Ticket ${ticketId}.\nName: ${formData.fullName}\nService: ${CATEGORY_LABELS[formData.category] || formData.category
    }\nPriority: ${formData.urgency.toUpperCase()}${formData.specs ? `\nSpecs: ${formData.specs}` : ""
    }\nDetails: ${formData.description}`
  );

  return (
    <div className="flex flex-col w-full">
      {/* ── Top Ambient Glow & Header Block ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-space-lg">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-55" />
        <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] animate-orb-drift pointer-events-none" />
        <div className="absolute -top-20 right-1/4 w-[450px] h-[300px] bg-secondary/10 rounded-full blur-[100px] animate-orb-drift-delay pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-gutter-lg pt-space-xl pb-space-lg w-full relative z-10">
          <div className="flex flex-col gap-space-xs max-w-4xl">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex flex-wrap items-center gap-space-sm"
            >
              <span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
                WORKSHOP &amp; INTAKE ACTIVE
              </span>
              <span className="font-mono text-label-tech text-outline uppercase">
                {SITE_LOCATION} // ONLINE &amp; IN-STORE
              </span>
            </motion.div>
            <h1 className="font-syne text-display-hero-mobile lg:text-headline-lg text-on-surface uppercase tracking-tight">
              <MaskedReveal delay={0.05}>Get in Touch with</MaskedReveal>{" "}
              <MaskedReveal delay={0.18}>
                <span className="text-shimmer">{SITE_NAME}</span>
              </MaskedReveal>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant max-w-2xl"
            >
              Request part pricing in LKR, plan a custom PC build, or book diagnostics and thermal servicing at our {SITE_LOCATION} workshop.
            </motion.p>
          </div>

          {/* Honest Workshop Snapshot Strip */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-lg"
          >
            <SpotlightCard className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  CATALOGED HARDWARE
                </span>
                <span className="font-syne text-headline-sm text-on-surface">
                  <AnimatedNumber value={`${TOTAL_SHOP_ITEMS} Items`} />
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                inventory_2
              </span>
            </SpotlightCard>
            <SpotlightCard
              glowColor="rgb(var(--color-secondary) / 0.14)"
              className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  TESTING WARRANTY
                </span>
                <span className="font-syne text-headline-sm text-secondary">
                  <AnimatedNumber value="06 Months" />
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                verified
              </span>
            </SpotlightCard>
            <SpotlightCard className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-tertiary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  BURN-IN VALIDATION
                </span>
                <span className="font-syne text-headline-sm text-tertiary">
                  <AnimatedNumber value="24 Hours" />
                </span>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                speed
              </span>
            </SpotlightCard>
            <SpotlightCard className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  DELIVERY COVERAGE
                </span>
                <span className="font-syne text-headline-sm text-primary">
                  Island-wide
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                local_shipping
              </span>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* ── Main Dual-Column Interactive Hub ── */}
      <section className="max-w-[1440px] mx-auto px-gutter-lg pb-space-2xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Left Column: Direct Repair Intake & Quote Request Form */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl relative overflow-hidden border border-outline-variant/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-space-lg"
                >
                  {/* Glowing Success Emblem */}
                  <div className="flex flex-col items-center sm:items-start gap-space-md text-center sm:text-left">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-secondary/30 blur-xl animate-pulse" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 via-surface-container-high to-surface-container flex items-center justify-center border-2 border-secondary shadow-[0_0_25px_rgba(79,219,200,0.5)]">
                        <span className="material-symbols-outlined text-[36px] text-secondary">
                          verified
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary/10 border border-secondary/30 w-fit mx-auto sm:mx-0">
                        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
                        <span className="font-mono text-label-tech text-secondary tracking-wider uppercase">
                          Request Submitted // Ticket Reference Issued
                        </span>
                      </div>
                      <h2 className="font-syne text-headline-md text-on-surface">
                        Thank You, {formData.fullName}
                      </h2>
                      <p className="text-body-md text-on-surface-variant max-w-xl">
                        Your inquiry and system details have been delivered to the {SITE_NAME} workshop intake desk. Save your reference number below or send it directly on WhatsApp for faster follow-up.
                      </p>
                    </div>
                  </div>

                  {/* Ticket Summary Card */}
                  <div className="p-space-lg rounded-xl bg-surface-container flex flex-col gap-space-md border border-primary/30 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Ticket Header & Copy Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/15">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-outline tracking-wider uppercase">
                          Assigned Ticket Reference
                        </span>
                        <span className="font-mono text-headline-sm text-primary tracking-widest font-bold">
                          {ticketId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyTicket}
                        className={`inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-mono text-label-tech transition-all border ${copied
                            ? "bg-secondary/20 text-secondary border-secondary/40 shadow-sm"
                            : "bg-surface-container-high hover:bg-surface-bright text-on-surface border-outline-variant/30"
                          }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copied ? "check" : "content_copy"}
                        </span>
                        <span>{copied ? "Copied to Clipboard" : "Copy Ticket ID"}</span>
                      </button>
                    </div>

                    {/* Summary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-body-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col border border-outline-variant/10">
                        <span className="font-mono text-[10px] text-outline uppercase">
                          Contact Email
                        </span>
                        <span className="font-mono text-body-sm text-on-surface truncate">
                          {formData.email}
                        </span>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col border border-outline-variant/10">
                        <span className="font-mono text-[10px] text-outline uppercase">
                          Requested Turnaround
                        </span>
                        <span
                          className={`font-mono text-body-sm font-bold ${URGENCY_LABELS[formData.urgency]?.color || "text-primary"
                            }`}
                        >
                          {URGENCY_LABELS[formData.urgency]?.label} (
                          {URGENCY_LABELS[formData.urgency]?.time})
                        </span>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col sm:col-span-2 border border-outline-variant/10">
                        <span className="font-mono text-[10px] text-outline uppercase">
                          Service Category
                        </span>
                        <span className="font-syne text-body-md text-on-surface">
                          {CATEGORY_LABELS[formData.category] || formData.category}
                        </span>
                      </div>
                      {formData.specs && (
                        <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col sm:col-span-2 border border-outline-variant/10">
                          <span className="font-mono text-[10px] text-outline uppercase">
                            System Specs Provided
                          </span>
                          <span className="font-mono text-[12px] text-on-surface-variant truncate">
                            {formData.specs}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3-Step Intake Pipeline */}
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
                      Next Steps
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container/70 flex items-start gap-space-xs border border-outline-variant/15">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <div className="flex flex-col">
                          <span className="font-syne text-body-sm font-semibold text-on-surface">
                            Requisition Logged
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Sent to our intake inbox
                          </span>
                        </div>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container/70 flex items-start gap-space-xs border border-outline-variant/15">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                          engineering
                        </span>
                        <div className="flex flex-col">
                          <span className="font-syne text-body-sm font-semibold text-on-surface">
                            Workshop Review
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Specs &amp; parts checked in {SITE_LOCATION}
                          </span>
                        </div>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container/70 flex items-start gap-space-xs border border-outline-variant/15">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                          mark_email_read
                        </span>
                        <div className="flex flex-col">
                          <span className="font-syne text-body-sm font-semibold text-on-surface">
                            Direct LKR Quote
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Sent via email, call, or WhatsApp
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-space-sm flex flex-wrap items-center gap-space-sm">
                    <a
                      href={ticketWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-body-md font-bold transition-all"
                    >
                      <span>Share Ticket on WhatsApp</span>
                      <span className="material-symbols-outlined text-[18px]">
                        open_in_new
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={scrollToTracer}
                      className="px-space-lg py-space-sm rounded-lg bg-gradient-to-r from-primary to-secondary text-surface font-syne text-body-md font-bold transition-all shadow-cyan-glow hover:shadow-cyan-glow-lg flex items-center justify-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        query_stats
                      </span>
                      <span>Check Ticket Status</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-space-lg py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-md border border-outline-variant/30 transition-all flex items-center justify-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        restart_alt
                      </span>
                      <span>Submit Another Request</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-space-lg">
                    <div>
                      <span className="font-mono text-label-tech text-primary uppercase tracking-widest block">
                        SERVICE &amp; QUOTE FORM // 01
                      </span>
                      <h2 className="font-syne text-headline-md text-on-surface">
                        Book a Repair, Build or Parts Quote
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {status === "authenticated" && session?.user ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/15 border border-secondary/35 font-mono text-[11px] text-secondary">
                          <span className="material-symbols-outlined text-[15px]">
                            verified_user
                          </span>
                          <span>Profile Synced</span>
                        </span>
                      ) : status === "unauthenticated" ? (
                        <button
                          type="button"
                          onClick={() => openAuthModal("signin", "/contact")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-primary/30 text-primary font-mono text-[11px] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            login
                          </span>
                          <span>Sign In to Autofill</span>
                        </button>
                      ) : null}
                      <span className="p-space-sm rounded-lg bg-surface-container text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[24px]">
                          hardware
                        </span>
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
                    {submitError && (
                      <div className="p-space-md rounded-lg bg-error-container/20 text-on-error-container border border-error/40 flex items-start gap-space-sm text-body-sm">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">
                          error
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold">Submission Interrupted</span>
                          <span>{submitError}</span>
                        </div>
                      </div>
                    )}

                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <label
                          className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                          htmlFor="full-name"
                        >
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-outline-variant/20 disabled:opacity-60"
                            id="full-name"
                            placeholder="Kasun Perera"
                            required
                            type="text"
                            disabled={isSubmitting}
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({ ...formData, fullName: e.target.value })
                            }
                          />
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                            person
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <label
                          className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                          htmlFor="email"
                        >
                          Email Address *
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-outline-variant/20 disabled:opacity-60"
                            id="email"
                            placeholder="yourname@gmail.com"
                            required
                            type="email"
                            disabled={isSubmitting}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                            alternate_email
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Phone & Service Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <label
                          className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                          htmlFor="phone"
                        >
                          Phone / WhatsApp Number
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-outline-variant/20 disabled:opacity-60"
                            id="phone"
                            placeholder="+94 78 819 4535"
                            type="tel"
                            disabled={isSubmitting}
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                            smartphone
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <label
                          className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                          htmlFor="category"
                        >
                          Service Category *
                        </label>
                        <div className="relative">
                          <select
                            className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/20 disabled:opacity-60"
                            id="category"
                            required
                            disabled={isSubmitting}
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({ ...formData, category: e.target.value })
                            }
                          >
                            <option value="emergency">
                              Repair / No-POST Diagnostic
                            </option>
                            <option value="cooling">
                              Thermal Service &amp; Cooling Upgrade
                            </option>
                            <option value="custom-build">
                              Custom PC Build Consultation
                            </option>
                            <option value="hardware-purchase">
                              PC Parts Quote &amp; Sourcing
                            </option>
                            <option value="workstation">
                              Business / Studio Workstation Support
                            </option>
                          </select>
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                            tune
                          </span>
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-[18px] pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hardware Specifications Field */}
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                        htmlFor="specs"
                      >
                        Current PC Specs or Requested Parts (Optional)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-outline font-mono text-label-tech focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-outline-variant/20 disabled:opacity-60"
                          id="specs"
                          placeholder="e.g. Ryzen 7 5700X / B550 Board / RTX 3060 12GB / 16GB DDR4"
                          type="text"
                          disabled={isSubmitting}
                          value={formData.specs}
                          onChange={(e) =>
                            setFormData({ ...formData, specs: e.target.value })
                          }
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                          memory
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                        htmlFor="description"
                      >
                        Issue Description, Build Budget (LKR), or Parts Needed *
                      </label>
                      <textarea
                        className="w-full p-space-md rounded-lg bg-surface-container text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y border border-outline-variant/20 disabled:opacity-60"
                        id="description"
                        placeholder="Describe your issue or request (e.g. no display on startup, overheating during gaming, looking for an RTX 3060 / B550 upgrade, or planning a Rs. 250,000 gaming build)..."
                        required
                        rows={4}
                        disabled={isSubmitting}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>

                    {/* Urgency Selector */}
                    <div className="flex flex-col gap-space-xs pt-space-xs">
                      <span className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider">
                        Preferred Turnaround
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                        {[
                          {
                            id: "standard",
                            title: "Standard",
                            time: "48 – 72 Hours",
                            note: "Standard workshop queue",
                            color: "text-on-surface",
                          },
                          {
                            id: "express",
                            title: "Express 24h",
                            time: "Next Bench Slot",
                            note: "Priority testing & parts check",
                            color: "text-primary",
                          },
                          {
                            id: "emergency",
                            title: "Same-Day Priority",
                            time: "Urgent Triage",
                            note: "Fastest workshop attention",
                            color: "text-secondary",
                          },
                        ].map((tier) => (
                          <label
                            key={tier.id}
                            className={`cursor-pointer relative p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex flex-col gap-1 text-left border ${formData.urgency === tier.id
                                ? "border-primary bg-primary/10"
                                : "border-outline-variant/20"
                              } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            <input
                              className="peer sr-only"
                              name="urgency"
                              type="radio"
                              value={tier.id}
                              disabled={isSubmitting}
                              checked={formData.urgency === tier.id}
                              onChange={() =>
                                setFormData({ ...formData, urgency: tier.id })
                              }
                            />
                            <div className="flex items-center justify-between">
                              <span className={`font-syne text-title-md ${tier.color}`}>
                                {tier.title}
                              </span>
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${formData.urgency === tier.id
                                    ? "bg-primary"
                                    : "bg-outline"
                                  }`}
                              />
                            </div>
                            <span className="font-mono text-label-tech text-outline">
                              {tier.time}
                            </span>
                            <span className="text-body-sm text-on-surface-variant mt-1">
                              {tier.note}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                      <div className="flex items-center gap-space-xs text-outline font-mono text-label-tech">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          verified_user
                        </span>
                        <span>Sent directly to {SITE_NAME} Intake Desk</span>
                      </div>
                      <button
                        className={`w-full sm:w-auto px-space-xl py-space-md rounded-lg bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold transition-all shadow-cyan-glow flex items-center justify-center gap-space-sm ${isSubmitting
                            ? "cursor-not-allowed opacity-85"
                            : "hover:shadow-cyan-glow-lg hover:-translate-y-0.5 cursor-pointer"
                          }`}
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-surface shrink-0"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-90"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">
                              assignment_turned_in
                            </span>
                            <span>Submit Request &amp; Get Ticket ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Workshop Location & Channels */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* HQ Facility Card */}
            <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.8)]" />
                  <span className="font-mono text-label-tech text-secondary">
                    WORKSHOP &amp; TEST LAB
                  </span>
                </div>
                <span className="font-mono text-label-badge text-outline border border-outline-variant/30 px-2 py-0.5 rounded">
                  ESD-SAFE BENCH
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-syne text-title-md text-on-surface">
                  {SITE_NAME}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {SITE_LOCATION}
                </p>
              </div>

              {/* Operating Hours Table */}
              <div className="bg-surface-container rounded-lg p-space-md flex flex-col gap-space-xs border border-outline-variant/15">
                <span className="font-mono text-label-tech text-tertiary">
                  OPERATING HOURS
                </span>
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">
                    Monday – Friday
                  </span>
                  <span className="text-on-surface font-mono text-label-tech">
                    {SITE_HOURS.weekdays}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">
                    Saturday
                  </span>
                  <span className="text-on-surface font-mono text-label-tech">
                    {SITE_HOURS.saturday}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm pt-space-xs border-t border-outline-variant/10">
                  <span className="text-primary font-semibold">
                    Online Intake &amp; Quotes
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary font-mono text-label-tech">
                    {SITE_HOURS.online}
                  </span>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="w-full rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container shadow-inner flex flex-col">
                <div className="w-full h-64 relative bg-surface-container-high">
                  <iframe
                    title={`${SITE_NAME} - ${SITE_LOCATION}`}
                    src="https://maps.google.com/maps?q=Embilipitiya,+Sri+Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-3 bg-surface-container flex items-center justify-between border-t border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      location_on
                    </span>
                    <span className="font-mono text-label-tech text-on-surface">
                      {SITE_LOCATION}
                    </span>
                  </div>
                  <a
                    href={SITE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary text-body-sm font-medium transition-colors border border-outline-variant/30"
                  >
                    <span>Open in Maps</span>
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/20">
              <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
                DIRECT CONTACT CHANNELS
              </span>
              <div className="grid grid-cols-1 gap-space-sm">
                <a
                  className="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-outline-variant/15 hover:border-primary/40"
                  href={SITE_PHONE_HREF}
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 transition-transform border border-primary/20">
                      <span className="material-symbols-outlined text-[20px]">
                        call
                      </span>
                    </div>
                    <div>
                      <span className="font-syne text-title-md text-on-surface block">
                        Direct Call &amp; Support Line
                      </span>
                      <span className="font-mono text-telemetry-num text-outline group-hover:text-primary transition-colors">
                        {SITE_PHONE_DISPLAY}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors">
                    chevron_right
                  </span>
                </a>

                <a
                  className="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-outline-variant/15 hover:border-secondary/40"
                  href={SITE_EMAIL_HREF}
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-105 transition-transform border border-secondary/20">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="font-syne text-title-md text-on-surface block">
                        Direct Email &amp; Quotes
                      </span>
                      <span className="font-mono text-telemetry-num text-outline group-hover:text-secondary transition-colors break-all">
                        {SITE_EMAIL}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors shrink-0">
                    chevron_right
                  </span>
                </a>

                <a
                  href={SITE_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-space-md rounded-lg bg-gradient-to-br from-surface-container to-surface-container-high hover:border-[#25D366]/50 transition-all flex items-center justify-between group border border-outline-variant/20"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform border border-[#25D366]/30">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-syne text-title-md text-on-surface block group-hover:text-[#25D366] transition-colors">
                        WhatsApp Instant Support
                      </span>
                      <span className="font-mono text-label-tech text-outline">
                        Fast Quotes &amp; Stock Checks
                      </span>
                    </div>
                  </div>
                  <span className="px-space-md py-space-xs rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-title-md transition-all shadow-sm">
                    Chat Now
                  </span>
                </a>

                <a
                  href={SITE_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-outline-variant/15 hover:border-[#1877F2]/40"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-[#1877F2]/15 flex items-center justify-center text-[#1877F2] group-hover:scale-105 transition-transform border border-[#1877F2]/25">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-syne text-title-md text-on-surface block group-hover:text-[#1877F2] transition-colors">
                        Official Facebook Page
                      </span>
                      <span className="font-mono text-label-tech text-outline">
                        {SITE_FACEBOOK_HANDLE} · Stock Drops &amp; Updates
                      </span>
                    </div>
                  </div>
                  <span className="px-space-md py-space-xs rounded-lg bg-surface-container-high group-hover:bg-[#1877F2] text-on-surface group-hover:text-white font-syne text-body-sm transition-all border border-outline-variant/30 group-hover:border-transparent">
                    Follow
                  </span>
                </a>

                <a
                  href={SITE_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-outline-variant/15 hover:border-[#E1306C]/40"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-[#E1306C]/15 flex items-center justify-center text-[#E1306C] group-hover:scale-105 transition-transform border border-[#E1306C]/25">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-syne text-title-md text-on-surface block group-hover:text-[#E1306C] transition-colors">
                        Official Instagram Profile
                      </span>
                      <span className="font-mono text-label-tech text-outline">
                        {SITE_INSTAGRAM_HANDLE} · Custom Rig Reels &amp; DMs
                      </span>
                    </div>
                  </div>
                  <span className="px-space-md py-space-xs rounded-lg bg-surface-container-high group-hover:bg-[#E1306C] text-on-surface group-hover:text-white font-syne text-body-sm transition-all border border-outline-variant/30 group-hover:border-transparent">
                    Follow
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Connected 3-Site Chain & Global Ecosystem Hub ── */}
      <RevealSection className="max-w-[1440px] mx-auto px-gutter-lg pb-space-2xl w-full">
        <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl relative overflow-hidden border border-outline-variant/20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  hub
                </span>
                <span className="font-mono text-label-tech text-primary uppercase tracking-widest">
                  SYNCHRONIZED 3-SITE CHAIN // ONE ECOSYSTEM
                </span>
              </div>
              <h2 className="font-syne text-headline-md text-on-surface">
                Our Connected Hardware &amp; 3D Builder Network
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Whether you need bench-tested PC components in LKR, an interactive 3D build studio, or board-level diagnostics, our 3 integrated sites and social channels work together seamlessly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={SITE_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-[#1877F2] font-mono text-label-tech border border-outline-variant/20 transition-colors"
              >
                <span>Facebook</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <a
                href={SITE_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-[#E1306C] font-mono text-label-tech border border-outline-variant/20 transition-colors"
              >
                <span>Instagram</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <a
              href={AQUA_PC_PARTS_URL}
              className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                  </span>
                  <span className="font-mono text-[10px] text-primary uppercase">SITE 01</span>
                </div>
                <h3 className="font-syne text-title-md text-on-surface group-hover:text-primary transition-colors">
                  Aqua PC Parts Store
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  390+ tested used &amp; brand new GPUs, CPUs, motherboards, RAM, and SSDs with instant quotes.
                </p>
              </div>
              <span className="pt-3 font-mono text-label-tech text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Catalog</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </a>

            <a
              href={AQUA_PC_PARTS_CONTACT_URL}
              className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 hover:border-secondary/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  </span>
                  <span className="font-mono text-[10px] text-secondary uppercase">PARTS DESK</span>
                </div>
                <h3 className="font-syne text-title-md text-on-surface group-hover:text-secondary transition-colors">
                  Parts Contact &amp; Showroom
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Dedicated parts inquiry form, stock availability checks, and Embilipitiya showroom directions.
                </p>
              </div>
              <span className="pt-3 font-mono text-label-tech text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open Parts Desk</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </a>

            <a
              href={AQUA_3D_PORTAL_URL}
              className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 hover:border-tertiary/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-tertiary/15 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
                  </span>
                  <span className="font-mono text-[10px] text-tertiary uppercase">SITE 02</span>
                </div>
                <h3 className="font-syne text-title-md text-on-surface group-hover:text-tertiary transition-colors">
                  3D PC Builder Studio
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Interactive real-time 3D rig configurator, photorealistic showroom lighting, and video gallery.
                </p>
              </div>
              <span className="pt-3 font-mono text-label-tech text-tertiary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Launch 3D Bay</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </a>

            <a
              href={SITE_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-md rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 hover:border-[#1877F2]/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-[#1877F2]/15 flex items-center justify-center text-[#1877F2] group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#1877F2] uppercase">COMMUNITY</span>
                </div>
                <h3 className="font-syne text-title-md text-on-surface group-hover:text-[#1877F2] transition-colors">
                  Social Channels
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Follow {SITE_FACEBOOK_HANDLE} on Facebook &amp; Instagram for daily stock drops and build reels.
                </p>
              </div>
              <span className="pt-3 font-mono text-label-tech text-[#1877F2] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Follow Community</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </span>
            </a>
          </div>
        </div>
      </RevealSection>

      {/* ── Sri Lanka Courier & Safe Drop-Off Guide ── */}
      <RevealSection className="max-w-[1440px] mx-auto px-gutter-lg pb-space-2xl w-full">
        <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl relative overflow-hidden border border-outline-variant/20">
          <motion.div
            variants={fadeUpVariants}
            custom={0}
            className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl"
          >
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  local_shipping
                </span>
                <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
                  SRI LANKA COURIER &amp; IN-STORE DROP-OFF
                </span>
              </div>
              <h2 className="font-syne text-headline-md text-on-surface">
                Island-Wide Courier &amp; Safe Packing Guide
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Outside {SITE_LOCATION}? Follow these quick packing steps when sending a PC, motherboard, or graphics card via Sri Lankan courier so it arrives safely at our bench.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(
                `Hi ${SITE_NAME}, I need help packing and sending my PC / component via Sri Lanka courier for service.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-surface-container hover:bg-surface-bright text-primary font-syne text-title-md transition-all shadow-sm self-start md:self-auto border border-primary/20 hover:border-primary/50 hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]">
                support_agent
              </span>
              <span>Get Courier Packing Help</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Step 1 Card */}
            <motion.div variants={scaleInVariants} custom={0}>
              <SpotlightCard className="bg-surface-container rounded-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/15 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center justify-between relative z-10">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary font-mono text-telemetry-num flex items-center justify-center font-bold">
                    01
                  </span>
                  <span className="material-symbols-outlined text-outline text-[24px] group-hover:text-primary transition-colors">
                    inventory
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs relative z-10">
                  <h3 className="font-syne text-title-md text-on-surface">
                    Unseat GPUs &amp; Heavy Coolers
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    Before shipping a full desktop tower, remove heavy graphics cards or large tower coolers and wrap them separately in anti-static sleeve and bubble wrap or firm foam.
                  </p>
                </div>
                <div className="mt-auto pt-space-xs relative z-10">
                  <span className="font-mono text-label-tech text-tertiary">
                    PROTECTS PCIE SLOTS IN TRANSIT
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Step 2 Card */}
            <motion.div variants={scaleInVariants} custom={1}>
              <SpotlightCard
                glowColor="rgb(var(--color-secondary) / 0.14)"
                className="bg-surface-container rounded-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary font-mono text-telemetry-num flex items-center justify-center font-bold">
                    02
                  </span>
                  <span className="material-symbols-outlined text-outline text-[24px] group-hover:text-secondary transition-colors">
                    local_shipping
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs relative z-10">
                  <h3 className="font-syne text-title-md text-on-surface">
                    Double-Box &amp; Tracked Delivery
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    Place wrapped parts inside a sturdy outer box with padding on all sides, and message your waybill or tracking number to {SITE_PHONE_DISPLAY} on WhatsApp before dispatch.
                  </p>
                </div>
                <div className="mt-auto pt-space-xs relative z-10">
                  <span className="font-mono text-label-tech text-secondary">
                    ISLAND-WIDE COURIER SUPPORT
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Step 3 Card */}
            <motion.div variants={scaleInVariants} custom={2}>
              <SpotlightCard className="bg-surface-container rounded-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/15 hover:border-tertiary/40 hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center justify-between relative z-10">
                  <span className="w-8 h-8 rounded-full bg-tertiary/20 text-tertiary font-mono text-telemetry-num flex items-center justify-center font-bold">
                    03
                  </span>
                  <span className="material-symbols-outlined text-outline text-[24px] group-hover:text-tertiary transition-colors">
                    photo_camera
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs relative z-10">
                  <h3 className="font-syne text-title-md text-on-surface">
                    Arrival Photo &amp; Bench Log
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    As soon as your parcel reaches our {SITE_LOCATION} workshop, we photograph unboxing condition, log serial numbers, and message you before bench diagnostics begin.
                  </p>
                </div>
                <div className="mt-auto pt-space-xs relative z-10">
                  <span className="font-mono text-label-tech text-primary">
                    TRANSPARENT CHAIN OF CUSTODY
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* ── Direct WhatsApp & Ticket Status Inquiry Section ── */}
      <section className="max-w-[1440px] mx-auto px-gutter-lg pb-space-2xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-lg">
          <div className="md:col-span-6">
            <TechnicianChat />
          </div>

          <div className="md:col-span-6 scroll-mt-28" id="telemetry-tracer">
            <TicketTracer initialTicketId={ticketId || undefined} />
          </div>
        </div>
      </section>
    </div>
  );
}
