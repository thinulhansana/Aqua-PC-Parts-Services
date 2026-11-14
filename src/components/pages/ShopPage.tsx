"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AQUA_PC_PARTS_SITE_NAME,
  AQUA_PC_PARTS_URL,
} from "@/lib/constants";
import { CircuitFlowBackdrop, fadeUpVariants } from "@/components/ui/MotionPrimitives";

export default function ShopPage() {
  const [targetUrl, setTargetUrl] = useState(AQUA_PC_PARTS_URL);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = window.location.search || "";
    let nextUrl = AQUA_PC_PARTS_URL;
    if (search) {
      const cleanQuery = search.startsWith("?") ? search.slice(1) : search;
      const sep = nextUrl.includes("?") ? "&" : "?";
      nextUrl = `${nextUrl}${sep}${cleanQuery}`;
    }
    setTargetUrl(nextUrl);
    window.location.replace(nextUrl);
  }, []);

  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center px-4 py-space-2xl overflow-hidden bg-surface-container-lowest">
      <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-55" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-[130px] animate-orb-drift pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/15 rounded-full blur-[130px] animate-orb-drift-delay pointer-events-none" />

      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        className="relative z-10 max-w-xl w-full p-space-xl rounded-3xl bg-surface-container/90 backdrop-blur-xl border border-primary/30 shadow-2xl text-center flex flex-col items-center gap-space-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[34px] animate-pulse">
            storefront
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 font-mono text-label-tech text-secondary uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
          OFFICIAL HARDWARE STOREFRONT
        </span>

        <h1 className="font-syne text-headline-lg text-on-surface tracking-tight">
          Redirecting to{" "}
          <span className="text-shimmer">{AQUA_PC_PARTS_SITE_NAME}</span>
        </h1>

        <p className="text-body-md text-on-surface-variant">
          Our PC parts &amp; components shop now has its own dedicated website
          with transparent LKR pricing, multi-item quotes, and instant WhatsApp
          customization.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
          <a
            href={targetUrl}
            className="inline-flex items-center gap-2 px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all"
          >
            <span>Enter {AQUA_PC_PARTS_SITE_NAME} Now</span>
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-space-lg py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-body-md font-semibold border border-outline-variant/30 transition-all"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
