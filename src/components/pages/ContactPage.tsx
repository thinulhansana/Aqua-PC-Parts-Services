"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/components/auth/AuthContext";
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
          <span>Connecting to Technician Console...</span>
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
          <span>Initializing Real-Time Telemetry Link...</span>
        </div>
      </div>
    ),
  }
);

const CATEGORY_LABELS: Record<string, string> = {
  emergency: "Emergency Repair / No POST Diagnostic",
  cooling: "Liquid Cooling Flush & Hard-Line Service",
  "custom-build": "Custom Enthusiast PC Build Consultation",
  "hardware-purchase": "Hardware Sourcing & Binning Procurement",
  workstation: "Corporate Multi-GPU Workstation Inquiry",
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
    label: "Emergency Rush",
    time: "Same-Day Direct",
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
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.user) return;
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || data.user.name || "",
          email: prev.email || data.user.email || "",
          phone: prev.phone || data.user.phone || "",
          specs: prev.specs || data.user.rigSpecs || "",
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
        "Diagnostic Alert Email": formData.email,
        "SMS Phone": formData.phone || "Not provided",
        "Primary Service Category":
          CATEGORY_LABELS[formData.category] || formData.category,
        "Hardware Spec Blueprint": formData.specs || "None specified",
        "Symptom Log & Scope": formData.description,
        "Triage Urgency Protocol": formData.urgency.toUpperCase(),
        _subject: `[Aqua Lab Requisition] ${generatedTicket} - ${formData.fullName}`,
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
        const data = await response.json().catch(() => null);
        if (data && data.errors && data.errors.length > 0) {
          setSubmitError(
            data.errors
              .map((err: { message: string }) => err.message)
              .join(", ")
          );
        } else {
          setSubmitError(
            "Transmission rejected by intake gateway. Please verify your email format or try again."
          );
        }
      }
    } catch (err) {
      console.error("Formspree submission error:", err);
      setSubmitError(
        "Network telemetry timeout. Please verify connectivity or call our hotline at +94 78 819 4535 or reach us via WhatsApp."
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
              className="flex items-center gap-space-sm"
            >
              <span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
                TRANSMISSION PIPELINE ACTIVE
              </span>
              <span className="font-mono text-label-tech text-outline">
                MAIN LAB // STATION #04
              </span>
            </motion.div>
            <h1 className="font-syne text-display-hero-mobile lg:text-headline-lg text-on-surface uppercase tracking-tight">
              <MaskedReveal delay={0.05}>Get in Touch with Our</MaskedReveal>{" "}
              <MaskedReveal delay={0.18}>
                <span className="text-shimmer">Hardware Engineers &amp; Diagnostic Lab</span>
              </MaskedReveal>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant max-w-2xl"
            >
              Whether your custom loop experienced thermal saturation, your rig fails POST diagnostics, or you need architecture-level silicon matching, our bench technicians respond within clock cycles.
            </motion.p>
          </div>

          {/* Quick Telemetry Strip */}
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
                  CURRENT BENCH LOAD
                </span>
                <span className="font-syne text-headline-sm text-on-surface">
                  <AnimatedNumber value="14 Units" />
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                speed
              </span>
            </SpotlightCard>
            <SpotlightCard
              glowColor="rgb(var(--color-secondary) / 0.14)"
              className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  AVG INTAKE TRIAGE
                </span>
                <span className="font-syne text-headline-sm text-secondary">
                  <AnimatedNumber value="18 Mins" />
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                timer
              </span>
            </SpotlightCard>
            <SpotlightCard className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-tertiary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  LEAK TEST RIGS
                </span>
                <span className="font-syne text-headline-sm text-tertiary">
                  <AnimatedNumber value="6 Available" />
                </span>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                water_drop
              </span>
            </SpotlightCard>
            <SpotlightCard className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm border border-outline-variant/15 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-outline block">
                  REPAIR SUCCESS RATE
                </span>
                <span className="font-syne text-headline-sm text-primary">
                  <AnimatedNumber value="99.4%" />
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-[28px] relative z-10 group-hover:scale-110 transition-transform">
                verified
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
                          Transmission Confirmed // Bench Ticket Generated
                        </span>
                      </div>
                      <h2 className="font-syne text-headline-md text-on-surface">
                        Thank You, {formData.fullName}
                      </h2>
                      <p className="text-body-md text-on-surface-variant max-w-xl">
                        Your direct inquiry and hardware telemetry profile have been successfully delivered to the Aqua PC Parts &amp; Services cleanroom intake gateway.
                      </p>
                    </div>
                  </div>

                  {/* Authenticated Intake Dossier Card */}
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

                    {/* Telemetry Summary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-body-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col border border-outline-variant/10">
                        <span className="font-mono text-[10px] text-outline uppercase">
                          Client Diagnostic Email
                        </span>
                        <span className="font-mono text-body-sm text-on-surface truncate">
                          {formData.email}
                        </span>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col border border-outline-variant/10">
                        <span className="font-mono text-[10px] text-outline uppercase">
                          Triage Protocol SLA
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
                          Selected Service Scope
                        </span>
                        <span className="font-syne text-body-md text-on-surface">
                          {CATEGORY_LABELS[formData.category] || formData.category}
                        </span>
                      </div>
                      {formData.specs && (
                        <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col sm:col-span-2 border border-outline-variant/10">
                          <span className="font-mono text-[10px] text-outline uppercase">
                            Hardware Spec Blueprint
                          </span>
                          <span className="font-mono text-[12px] text-on-surface-variant truncate">
                            {formData.specs}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3-Step Cleanroom Intake Pipeline */}
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
                      Automated Laboratory Dispatch Pipeline
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container/70 flex items-start gap-space-xs border border-outline-variant/15">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <div className="flex flex-col">
                          <span className="font-syne text-body-sm font-semibold text-on-surface">
                            Formspree Sync
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Delivered to lead engineering console
                          </span>
                        </div>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container/70 flex items-start gap-space-xs border border-outline-variant/15">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5 animate-pulse">
                          sensors
                        </span>
                        <div className="flex flex-col">
                          <span className="font-syne text-body-sm font-semibold text-on-surface">
                            Bench Allocation
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Assigned to Tech Lab Bay #01
                          </span>
                        </div>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container/70 flex items-start gap-space-xs border border-outline-variant/15">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                          mark_email_read
                        </span>
                        <div className="flex flex-col">
                          <span className="font-syne text-body-sm font-semibold text-on-surface">
                            Diagnostic Dossier
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Email dispatch confirmation sent
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-space-sm flex flex-col sm:flex-row items-center gap-space-md">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-md border border-outline-variant/30 transition-all flex items-center justify-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        restart_alt
                      </span>
                      <span>Submit Another Requisition</span>
                    </button>
                    <button
                      type="button"
                      onClick={scrollToTracer}
                      className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-gradient-to-r from-primary to-secondary text-surface font-syne text-body-md font-bold transition-all shadow-cyan-glow hover:shadow-cyan-glow-lg flex items-center justify-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        query_stats
                      </span>
                      <span>Trace Ticket in Real-Time</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-space-lg">
                    <div>
                      <span className="font-mono text-label-tech text-primary uppercase tracking-widest block">
                        SECURE INTAKE // 01
                      </span>
                      <h2 className="font-syne text-headline-md text-on-surface">
                        Repair Intake &amp; Quote Requisition
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
                    {/* Error Banner if transmission fails */}
                    {submitError && (
                      <div className="p-space-md rounded-lg bg-error-container/20 text-on-error-container border border-error/40 flex items-start gap-space-sm text-body-sm">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">
                          error
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold">Transmission Interrupted</span>
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
                          Client Full Name *
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-outline-variant/20 disabled:opacity-60"
                            id="full-name"
                            placeholder="Dr. Evelyn Vance"
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
                          Diagnostic Alert Email *
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
                          SMS Telemetry Phone
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
                          Primary Service Category *
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
                              Emergency Repair / No POST Diagnostic
                            </option>
                            <option value="cooling">
                              Liquid Cooling Flush &amp; Hard-Line Service
                            </option>
                            <option value="custom-build">
                              Custom Enthusiast PC Build Consultation
                            </option>
                            <option value="hardware-purchase">
                              Hardware Sourcing &amp; Binning Procurement
                            </option>
                            <option value="workstation">
                              Corporate Multi-GPU Workstation Inquiry
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
                        Current Rig Spec Blueprint (CPU, GPU, Motherboard, PSU)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-outline font-mono text-label-tech focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-outline-variant/20 disabled:opacity-60"
                          id="specs"
                          placeholder="e.g. AMD Ryzen 9 7950X3D / ASUS ROG Crosshair Hero / RTX 4090 OC / Seasonic 1200W"
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

                    {/* Description / Symptom Log */}
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider"
                        htmlFor="description"
                      >
                        Symptom Log / Overclock Details / Project Scope *
                      </label>
                      <textarea
                        className="w-full p-space-md rounded-lg bg-surface-container text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y border border-outline-variant/20 disabled:opacity-60"
                        id="description"
                        placeholder="Detail symptoms: e.g. Q-Code 00 on boot, pump tachometer reading zero, sudden thermal throttle to 98°C under rendering, or desired custom hardline aesthetic..."
                        required
                        rows={4}
                        disabled={isSubmitting}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>

                    {/* Urgency Tier Matrix Selector */}
                    <div className="flex flex-col gap-space-xs pt-space-xs">
                      <span className="font-mono text-label-badge text-on-surface-variant uppercase tracking-wider">
                        Triage Urgency Protocol
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                        {[
                          {
                            id: "standard",
                            title: "Standard",
                            time: "48 – 72 Hours",
                            note: "Standard queue bench schedule",
                            color: "text-on-surface",
                          },
                          {
                            id: "express",
                            title: "Express 24h",
                            time: "Next Bench Slot",
                            note: "Priority parts routing & test run",
                            color: "text-primary",
                          },
                          {
                            id: "emergency",
                            title: "Emergency Rush",
                            time: "Same-Day Direct",
                            note: "Immediate lead engineer assignment",
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

                    {/* Submit Requisition Button with Sleek Loading Spinner */}
                    <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                      <div className="flex items-center gap-space-xs text-outline font-mono text-label-tech">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          verified_user
                        </span>
                        <span>SHA-256 Encrypted Lab Intake Ticket</span>
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
                            <span>Transmitting Requisition...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">
                              assignment_turned_in
                            </span>
                            <span>Request Technical Quote &amp; Intake Ticket</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Workshop Headquarters & Channels */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* HQ Facility Card */}
            <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.8)]" />
                  <span className="font-mono text-label-tech text-secondary">
                    HEADQUARTERS &amp; CLEANROOM
                  </span>
                </div>
                <span className="font-mono text-label-badge text-outline border border-outline-variant/30 px-2 py-0.5 rounded">
                  CLASS-10K LAB
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-syne text-title-md text-on-surface">
                  Aqua PC Tech Lab
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Embilipitiya, Sri Lanka
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
                    8:00 AM – 7:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">
                    Saturday Diagnostics
                  </span>
                  <span className="text-on-surface font-mono text-label-tech">
                    10:00 AM – 5:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm pt-space-xs border-t border-outline-variant/10">
                  <span className="text-primary font-semibold">
                    Online Emergency Intake
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary font-mono text-label-tech">
                    24/7/365
                  </span>
                </div>
              </div>

              {/* Live Interactive Google Map Component */}
              <div className="w-full rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container shadow-inner flex flex-col">
                <div className="w-full h-64 relative bg-surface-container-high">
                  <iframe
                    title="Aqua PC Tech Lab - Embilipitiya, Sri Lanka"
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
                      Embilipitiya, Sri Lanka
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Embilipitiya,+Sri+Lanka"
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
                RAPID TELEMETRY CHANNELS
              </span>
              <div className="grid grid-cols-1 gap-space-sm">
                <a
                  className="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-outline-variant/15 hover:border-primary/40"
                  href="tel:+94788194535"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-105 transition-transform border border-primary/20">
                      <span className="material-symbols-outlined text-[20px]">
                        call
                      </span>
                    </div>
                    <div>
                      <span className="font-syne text-title-md text-on-surface block">
                        Repair &amp; Diagnostic Hotline
                      </span>
                      <span className="font-mono text-telemetry-num text-outline group-hover:text-primary transition-colors">
                        +94 78 819 4535
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors">
                    chevron_right
                  </span>
                </a>

                <a
                  className="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-outline-variant/15 hover:border-secondary/40"
                  href="mailto:thinulhansana.business@gmail.com"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-105 transition-transform border border-secondary/20">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                    <div>
                      <span className="font-syne text-title-md text-on-surface block">
                        Direct Inquiries &amp; Orders
                      </span>
                      <span className="font-mono text-telemetry-num text-outline group-hover:text-secondary transition-colors">
                        thinulhansana.business@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors">
                    chevron_right
                  </span>
                </a>

                <a
                  href="https://wa.me/message/CYZRQDEHLIRZF1"
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
                        Direct Inquiry &amp; Availability
                      </span>
                    </div>
                  </div>
                  <span className="px-space-md py-space-xs rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-title-md transition-all shadow-sm">
                    Chat Now
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Out-of-State Emergency Drop-Off & Mail-In Section ── */}
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
                  flight_takeoff
                </span>
                <span className="font-mono text-label-tech text-secondary uppercase tracking-widest">
                  DOMESTIC &amp; GLOBAL LOGISTICS
                </span>
              </div>
              <h2 className="font-syne text-headline-md text-on-surface">
                Out-of-State Mail-In Diagnostic Protocol
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Sending a custom rigid loop PC or an unshelled flagship GPU? Follow our lab-standard packing architecture to ensure zero mechanical deflection or transit shock.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-surface-container hover:bg-surface-bright text-primary font-syne text-title-md transition-all shadow-sm self-start md:self-auto border border-primary/20 hover:border-primary/50 hover:-translate-y-0.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span>Download Shipping Foam Cutout Template</span>
            </button>
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
                    invert_colors_off
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs relative z-10">
                  <h3 className="font-syne text-title-md text-on-surface">
                    Loop Draining &amp; Instapak
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    Fully drain all cooling fluids using the lowest manifold valve. Fill internal chassis cavities with expanding Instapak™ or high-density polyfoam to anchor the GPU bracket.
                  </p>
                </div>
                <div className="mt-auto pt-space-xs relative z-10">
                  <span className="font-mono text-label-tech text-tertiary">
                    MANDATORY FOR CUSTOM LOOPS
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
                    Insured Pre-Paid Waybills
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    We generate direct FedEx Priority or UPS Air insured labels up to $10,000 declared hardware value. Double-box rigs with a minimum of 2 inches of cushioning around original carton.
                  </p>
                </div>
                <div className="mt-auto pt-space-xs relative z-10">
                  <span className="font-mono text-label-tech text-secondary">
                    INCLUDES TRANSIT SENSOR STICKERS
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
                    sensor_occupied
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs relative z-10">
                  <h3 className="font-syne text-title-md text-on-surface">
                    In-Bay Video Unboxing
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    Every external parcel is unboxed under calibrated 4K bench cameras. You receive a link to the visual intake audit within 45 minutes of laboratory dock arrival.
                  </p>
                </div>
                <div className="mt-auto pt-space-xs relative z-10">
                  <span className="font-mono text-label-tech text-primary">
                    AUDITED CHAIN OF CUSTODY
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* ── Live Chat & Instant Ticket Status Lookup Widget Section (Code-Split) ── */}
      <section className="max-w-[1440px] mx-auto px-gutter-lg pb-space-2xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-lg">
          {/* Live Chat Launchpad (Code-Split) */}
          <div className="md:col-span-6">
            <TechnicianChat />
          </div>

          {/* Ticket Status Real-Time Telemetry Lookup (Code-Split) */}
          <div className="md:col-span-6 scroll-mt-28" id="telemetry-tracer">
            <TicketTracer />
          </div>
        </div>
      </section>
    </div>
  );
}

