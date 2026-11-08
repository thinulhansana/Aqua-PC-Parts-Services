"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE, SITE_EST, LOGO_SRC } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Glassmorphic bar */}
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav
          className="flex items-center justify-between gap-4 rounded-2xl bg-surface/80 backdrop-blur-xl border border-outline-variant/25 px-4 py-2.5 shadow-glass"
          aria-label="Main navigation"
        >
          {/* ── Left: Logo + Brand ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src={LOGO_SRC}
              alt={`${SITE_NAME} logo`}
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-syne text-title-md text-on-surface whitespace-nowrap">
                  {SITE_NAME}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                  {SITE_EST}
                </span>
              </div>
              <span className="font-mono text-label-tech text-on-surface-variant tracking-widest uppercase">
                {SITE_TAGLINE}
              </span>
            </div>
          </Link>

          {/* ── Center: Nav Links (desktop) ── */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3 py-2 text-body-md text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-high/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px]">
                dark_mode
              </span>
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-surface-container-high/40 border border-outline-variant/30 rounded-lg px-3 py-1.5 text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 ml-2 font-mono text-[10px] bg-surface-container-lowest/60 border border-outline-variant/30 rounded px-1.5 py-0.5 text-on-surface-variant">
                ⌘K
              </kbd>
            </div>

            {/* Shopping bag */}
            <button
              className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
              aria-label="Shopping bag"
            >
              <span className="material-symbols-outlined text-[20px]">
                shopping_bag
              </span>
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-primary text-on-primary rounded-full">
                3
              </span>
            </button>

            {/* Book Consultation CTA */}
            <Button
              variant="primary"
              size="sm"
              href="/contact"
              className="hidden sm:inline-flex"
            >
              Book Consultation
            </Button>

            {/* Profile avatar */}
            <button
              className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center overflow-hidden"
              aria-label="User profile"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                person
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-2xl bg-surface-container/95 backdrop-blur-xl border border-outline-variant/25 p-4 shadow-glass">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-body-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-outline-variant/20">
              <Button variant="primary" size="md" href="/contact" className="w-full">
                Book Consultation
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
