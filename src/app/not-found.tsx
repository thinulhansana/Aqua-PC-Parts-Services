"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-gutter-lg py-space-2xl text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xl gap-space-md">
        <div className="inline-flex items-center gap-space-xs px-space-md py-0.5 rounded-full bg-surface-container font-mono text-label-tech text-secondary border border-secondary/30">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
          <span>TELEMETRY FAULT // ROUTE NOT FOUND</span>
        </div>

        <h1 className="font-syne text-display-hero text-on-surface tracking-tight">
          404
        </h1>

        <div className="flex flex-col gap-space-xs">
          <h2 className="font-syne text-headline-sm text-on-surface">
            Memory Bus Void: Page Unmapped
          </h2>
          <p className="text-body-md text-on-surface-variant">
            The telemetry address requested does not match any authenticated lab bay or diagnostic queue on this server.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low font-mono text-label-tech text-outline border border-outline-variant/15 w-full max-w-md">
          <span>DIAGNOSTIC_QCODE: 0x00_NULL_POINTER_EXCEPTION</span>
        </div>

        <div className="pt-space-md flex flex-wrap items-center justify-center gap-space-md">
          <Link
            href="/"
            className="px-space-xl py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-syne text-title-md font-bold shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all"
          >
            Return to Command Center
          </Link>
          <Link
            href="/contact"
            className="px-space-xl py-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-outline-variant/30 transition-colors"
          >
            Contact Lab Support
          </Link>
        </div>
      </div>
    </div>
  );
}

