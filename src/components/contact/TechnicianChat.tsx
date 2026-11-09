"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/shopData";
import {
  SITE_NAME,
  SITE_FOUNDER,
  SITE_LOCATION,
  SITE_HOURS,
} from "@/lib/constants";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";

const QUICK_TOPICS = [
  {
    id: "stock",
    label: "Check Part Price & Stock",
    template: "Hi Aqua PC Solutions, I'd like to check today's LKR price and availability for:",
  },
  {
    id: "build",
    label: "Custom PC Quote",
    template: "Hi Aqua PC Solutions, please help me plan a custom PC build. My approximate budget in LKR is:",
  },
  {
    id: "repair",
    label: "PC Repair / No-Boot Help",
    template: "Hi Aqua PC Solutions, I need diagnostic or repair help for my PC / component. Issue:",
  },
  {
    id: "delivery",
    label: "Island-wide Delivery",
    template: "Hi Aqua PC Solutions, I'd like details about courier delivery to my city:",
  },
];

export default function TechnicianChat() {
  const [selectedTopic, setSelectedTopic] = useState<string>("stock");
  const [inputMsg, setInputMsg] = useState(
    QUICK_TOPICS[0].template + " "
  );

  const handleSelectTopic = (topicId: string, template: string) => {
    setSelectedTopic(topicId);
    setInputMsg(template + " ");
  };

  const trimmedMessage = inputMsg.trim();
  const targetUrl = buildWhatsAppUrl(
    trimmedMessage ||
      `Hi ${SITE_NAME}, I would like assistance with PC parts or diagnostic services.`
  );

  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl flex flex-col justify-between gap-space-lg relative overflow-hidden border border-outline-variant/20 h-full">
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#25D366]/10 rounded-full blur-2xl pointer-events-none" />
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span className="font-mono text-label-tech text-[#25D366] uppercase">
            DIRECT WHATSAPP DESK // {SITE_LOCATION.toUpperCase()}
          </span>
        </div>
        <h3 className="font-syne text-headline-md text-on-surface">
          Message Our Workshop Directly
        </h3>
        <p className="text-body-md text-on-surface-variant mt-space-xs">
          Need quick LKR part pricing, build compatibility advice, or troubleshooting guidance? Start a direct WhatsApp message with {SITE_FOUNDER} and the workshop team.
        </p>
      </div>

      <div className="bg-surface-container rounded-lg p-space-md flex flex-col gap-space-sm border border-outline-variant/15 relative z-10">
        {/* Quick Topic Chips */}
        <div className="flex flex-wrap gap-space-xs">
          {QUICK_TOPICS.map((topic) => {
            const active = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleSelectTopic(topic.id, topic.template)}
                className={`px-space-sm py-1 rounded-full font-mono text-[11px] transition-all border ${
                  active
                    ? "bg-primary/15 text-primary border-primary/40 font-semibold"
                    : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/30 hover:text-on-surface"
                }`}
              >
                {topic.label}
              </button>
            );
          })}
        </div>

        {/* Message Composer */}
        <textarea
          rows={3}
          placeholder="Type the PC parts, repair symptom, or budget you want to ask about..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface text-body-sm placeholder:text-outline border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-mono text-label-tech text-outline">
              Mon–Fri {SITE_HOURS.weekdays} · Sat {SITE_HOURS.saturday}
            </span>
          </div>
          <motion.a
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE_PREMIUM }}
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-space-lg py-space-sm rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-body-sm font-bold transition-colors shadow-sm"
          >
            <span>Send on WhatsApp</span>
            <span className="material-symbols-outlined text-[16px]">
              open_in_new
            </span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
