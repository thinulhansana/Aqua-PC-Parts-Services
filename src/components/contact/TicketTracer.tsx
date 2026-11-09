"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";

export default function TicketTracer() {
  const [ticketSearch, setTicketSearch] = useState("AQ-88204");
  const [ticketResult, setTicketResult] = useState<{
    id: string;
    stage: string;
    progress: number;
    bench: string;
    tech: string;
    details: string;
  } | null>({
    id: "AQ-88204",
    stage: "STRESS TEST STAGE 3/4",
    progress: 78,
    bench: "Bench #02",
    tech: "Sarah Jenkins",
    details: "Karhu RAM burn-in at 7,800% coverage. 0 WHEA errors detected.",
  });

  const handleQueryTicket = () => {
    if (!ticketSearch.trim()) return;
    const query = ticketSearch.toUpperCase();
    setTicketResult({
      id: query,
      stage: "TRIAGE VERIFICATION COMPLETE",
      progress: 92,
      bench: "Tech Lab Bay #01",
      tech: "Dr. Elena Vance",
      details: "Oscilloscope voltage rails confirmed stable. Thermal paste reapplied with liquid metal.",
    });
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl flex flex-col justify-between gap-space-lg relative overflow-hidden border border-outline-variant/20 h-full">
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">
            query_stats
          </span>
          <span className="font-mono text-label-tech text-primary uppercase">
            REAL-TIME TELEMETRY QUERY
          </span>
        </div>
        <h3 className="font-syne text-headline-md text-on-surface">
          Track Diagnostics &amp; Rig State
        </h3>
        <p className="text-body-md text-on-surface-variant mt-space-xs">
          Enter your ticket ID (from your drop-off receipt or intake email) to check pump pressure tests, memory stress iteration counts, and thermal sensor graphs.
        </p>
      </div>

      {/* Ticket Search Input */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex gap-space-xs">
          <input
            className="w-full px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface font-mono text-label-tech placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary uppercase border border-outline-variant/20"
            placeholder="e.g. AQ-94821 or AQ-88204"
            type="text"
            value={ticketSearch}
            onChange={(e) => setTicketSearch(e.target.value)}
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleQueryTicket}
            className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed-dim font-syne text-title-md transition-all shrink-0"
            type="button"
          >
            Trace Rig
          </motion.button>
        </div>

        {/* Dynamic Result Slot */}
        <AnimatePresence mode="wait">
          {ticketResult && (
            <motion.div
              key={ticketResult.id + ticketResult.progress}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs border border-outline-variant/20"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-label-tech text-on-surface font-bold">
                  TICKET #{ticketResult.id}
                </span>
                <span className="px-space-xs py-0.5 rounded bg-secondary/20 text-secondary font-mono text-[10px] font-bold">
                  {ticketResult.stage}
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${ticketResult.progress}%` }}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full shadow-[0_0_8px_rgba(76,215,246,0.5)]"
                />
              </div>
              <div className="flex justify-between items-center text-outline font-mono text-[11px] pt-1">
                <span>Assigned: {ticketResult.tech}</span>
                <span>Location: {ticketResult.bench}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant pt-1 border-t border-outline-variant/10">
                {ticketResult.details}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
