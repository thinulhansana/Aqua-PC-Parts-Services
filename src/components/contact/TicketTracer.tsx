"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/shopData";
import { SITE_NAME, SITE_EMAIL } from "@/lib/constants";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";

interface TicketTracerProps {
  initialTicketId?: string;
}

const WORKSHOP_STAGES = [
  { num: "01", label: "Intake Logged", note: "Serials & visual check recorded" },
  { num: "02", label: "Bench Diagnosis", note: "Fault isolation & thermal check" },
  { num: "03", label: "LKR Quote Approval", note: "Confirmed with you before work" },
  { num: "04", label: "Repair / Assembly", note: "Parts fitted & cable managed" },
  { num: "05", label: "24h Stress Test", note: "Continuous load verification" },
  { num: "06", label: "Ready / Dispatched", note: "Workshop pickup or Sri Lanka courier" },
];

export default function TicketTracer({ initialTicketId }: TicketTracerProps) {
  const [ticketInput, setTicketInput] = useState(initialTicketId || "");
  const [queriedId, setQueriedId] = useState<string | null>(
    initialTicketId || null
  );

  useEffect(() => {
    if (initialTicketId) {
      setTicketInput(initialTicketId);
      setQueriedId(initialTicketId);
    }
  }, [initialTicketId]);

  const handlePrepareInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = ticketInput.trim().toUpperCase();
    if (!cleaned) return;
    setQueriedId(cleaned);
  };

  const activeTicket = queriedId || ticketInput.trim().toUpperCase();
  const whatsappStatusUrl = buildWhatsAppUrl(
    activeTicket
      ? `Hi ${SITE_NAME}, I'd like a workshop status update for my Ticket ID: ${activeTicket}.`
      : `Hi ${SITE_NAME}, I'd like to check the status of my repair / custom build.`
  );
  const emailSubject = encodeURIComponent(
    activeTicket
      ? `[Ticket Status] ${activeTicket} - ${SITE_NAME}`
      : `[Ticket Status Inquiry] - ${SITE_NAME}`
  );
  const emailBody = encodeURIComponent(
    activeTicket
      ? `Hello ${SITE_NAME},\n\nPlease share the current workshop stage for my Ticket ID: ${activeTicket}.\n\nThank you.`
      : `Hello ${SITE_NAME},\n\nPlease share a status update for my repair / build.\n\nThank you.`
  );

  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl flex flex-col justify-between gap-space-lg relative overflow-hidden border border-outline-variant/20 h-full">
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">
            query_stats
          </span>
          <span className="font-mono text-label-tech text-primary uppercase">
            TICKET STATUS INQUIRY
          </span>
        </div>
        <h3 className="font-syne text-headline-md text-on-surface">
          Check Your Repair or Build Status
        </h3>
        <p className="text-body-md text-on-surface-variant mt-space-xs">
          Enter your ticket reference (e.g. <span className="font-mono text-primary">AQ-XXXXX</span> from your online requisition or drop-off receipt) to request an instant status photo or update via WhatsApp or email.
        </p>
      </div>

      <div className="flex flex-col gap-space-md">
        <form onSubmit={handlePrepareInquiry} className="flex gap-space-xs">
          <input
            className="w-full px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface font-mono text-label-tech placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary uppercase border border-outline-variant/20"
            placeholder="e.g. AQ-48219"
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed-dim font-syne text-title-md transition-all shrink-0"
            type="submit"
          >
            Prepare Check
          </motion.button>
        </form>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTicket || "workflow"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-sm border border-outline-variant/20"
          >
            <div className="flex items-center justify-between flex-wrap gap-2 pb-space-xs border-b border-outline-variant/15">
              <span className="font-mono text-label-tech text-on-surface font-bold">
                {activeTicket
                  ? `REFERENCE READY: ${activeTicket}`
                  : "6-STAGE WORKSHOP PROCESS"}
              </span>
              <span className="px-space-xs py-0.5 rounded bg-secondary/15 text-secondary font-mono text-[10px] font-bold">
                EMBILIPITIYA BENCH
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
              {WORKSHOP_STAGES.map((stage) => (
                <div
                  key={stage.num}
                  className="p-2 rounded bg-surface-container-high/60 border border-outline-variant/10 flex flex-col gap-0.5"
                >
                  <span className="font-mono text-[10px] text-primary font-bold">
                    {stage.num} // {stage.label}
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight">
                    {stage.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
              <a
                href={whatsappStatusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-body-sm font-bold transition-colors"
              >
                <span>Check on WhatsApp</span>
                <span className="material-symbols-outlined text-[16px]">
                  open_in_new
                </span>
              </a>
              <a
                href={`mailto:${SITE_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                className="inline-flex items-center justify-center gap-1.5 px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-sm border border-outline-variant/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  mail
                </span>
                <span>Email Update</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
