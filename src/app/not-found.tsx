"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUpVariants } from "@/components/ui/MotionPrimitives";
import { AQUA_PC_PARTS_URL } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-gutter-lg py-space-2xl text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-orb-drift pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xl gap-space-md">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-space-xs px-space-md py-0.5 rounded-full bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
          <span>HTTP 404 // PAGE NOT FOUND</span>
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="font-syne text-display-hero text-shimmer tracking-tight"
        >
          404
        </motion.h1>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="flex flex-col gap-space-xs"
        >
          <h2 className="font-syne text-headline-sm text-on-surface">
            This Route Couldn&apos;t Be Found
          </h2>
          <p className="text-body-md text-on-surface-variant">
            The page you requested may have moved or the URL may contain a typo. Jump back to Aqua PC Solutions home, browse our catalog, or contact our team.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="pt-space-md flex flex-wrap items-center justify-center gap-space-md"
        >
          <Link
            href="/"
            className="relative overflow-hidden group px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg hover:-translate-y-0.5 transition-all"
          >
            <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Return Home</span>
          </Link>
          <a
            href={AQUA_PC_PARTS_URL}
            className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-all hover:border-primary/40 hover:-translate-y-0.5"
          >
            Browse Aqua PC Parts
          </a>
          <Link
            href="/contact"
            className="px-space-xl py-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-syne text-title-md border border-outline-variant/20 transition-all hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
