"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE, SITE_EST, LOGO_SRC } from "@/lib/constants";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuthModal } from "@/components/auth/AuthContext";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";
import { usePathname } from "next/navigation";

function getInitials(name?: string | null, email?: string | null): string {
  const source = (name || email || "A").trim();
  const parts = source.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click or Escape
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [userMenuOpen]);

  const user = session?.user;
  const isAuthenticated = status === "authenticated" && Boolean(user);
  const firstName =
    (user?.name || user?.email?.split("@")[0] || "Account").split(" ")[0];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <motion.div
        className="mx-auto mt-3 max-w-7xl px-4"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav
          className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 ${
            scrolled
              ? "bg-surface/90 backdrop-blur-2xl border border-outline-variant/40 shadow-lg shadow-black/10"
              : "bg-surface/70 backdrop-blur-xl border border-outline-variant/20 shadow-glass"
          }`}
          aria-label="Main navigation"
        >
          {/* ── Left: Logo + Brand ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src={LOGO_SRC}
                alt={`${SITE_NAME} logo`}
                width={40}
                height={40}
                className="rounded-lg relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-syne text-title-md text-on-surface whitespace-nowrap">
                  {SITE_NAME}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 animate-border-pulse">
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
            {NAV_LINKS.map((link, i) => {
              const isExternalSite =
                link.label === "Shop" ||
                link.href.includes("aqua-pc-parts") ||
                link.href.startsWith("http");
              const isActive = !isExternalSite && pathname === link.href;
              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.2, duration: 0.4 }}
                >
                  {isExternalSite ? (
                    <a
                      href={link.href}
                      className="relative inline-flex items-center gap-1 px-2.5 xl:px-3 py-2 text-body-md transition-all duration-200 rounded-lg group text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50"
                      title={
                        link.label === "3D Builder"
                          ? "Visit Interactive 3D PC Builder Studio"
                          : "Visit Aqua PC Parts Storefront"
                      }
                    >
                      <span>{link.label}</span>
                      <span className="material-symbols-outlined text-[14px] text-primary/75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        open_in_new
                      </span>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full group-hover:w-4/5 transition-all duration-300" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative px-2.5 xl:px-3 py-2 text-body-md transition-all duration-200 rounded-lg group ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20 -z-10"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      {!isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full group-hover:w-4/5 transition-all duration-300" />
                      )}
                    </Link>
                  )}
                </motion.li>
              );
            })}
          </ul>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Button
                variant="primary"
                size="sm"
                href="/contact"
                className="hidden md:inline-flex relative overflow-hidden group"
              >
                <span className="relative z-10">Book Consultation</span>
                <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </motion.div>

            {/* Auth Controls: User Avatar Dropdown or Sign In Button */}
            {status === "loading" ? (
              <div
                className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/30 animate-pulse"
                aria-hidden="true"
              />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open customer account menu"
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest border border-primary/35 hover:border-primary/60 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-primary text-on-primary font-syne font-bold text-body-sm flex items-center justify-center overflow-hidden shrink-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User avatar"}
                        width={28}
                        height={28}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(user.name, user.email)}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline font-jakarta font-semibold text-body-sm text-on-surface max-w-[96px] truncate">
                    {firstName}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: EASE_PREMIUM }}
                      className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-surface-container/95 backdrop-blur-2xl border border-outline-variant/35 shadow-glass p-2 z-50"
                    >
                      <div className="px-3 py-2.5 rounded-xl bg-surface-container-low/80 border border-outline-variant/20 mb-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                          {user.provider === "google"
                            ? "Google Verified"
                            : "Email Session"}
                        </span>
                        <p className="font-syne text-body-md font-bold text-on-surface truncate mt-0.5">
                          {user.name || "Aqua Member"}
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-body-md text-on-surface hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          account_circle
                        </span>
                        <span>Customer Portal</span>
                      </Link>

                      <Link
                        href="/contact#telemetry-tracer"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-body-md text-on-surface hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          query_stats
                        </span>
                        <span>Track Repair Ticket</span>
                      </Link>

                      <div className="my-1.5 h-px bg-outline-variant/25" />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-body-md text-error hover:bg-error-container/25 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("signin", pathname || "/account")}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-full sm:rounded-lg bg-surface-container-high/75 hover:bg-surface-container-highest border border-outline-variant/40 hover:border-primary/45 text-on-surface hover:text-primary font-jakarta font-semibold text-body-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Sign in with Google or Email"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  login
                </span>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <button
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <motion.span
                key={mobileOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="material-symbols-outlined text-[22px] block"
              >
                {mobileOpen ? "close" : "menu"}
              </motion.span>
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden mt-2 rounded-2xl bg-surface-container/95 backdrop-blur-xl border border-outline-variant/25 p-4 shadow-glass overflow-hidden"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => {
                  const isExternalSite =
                    link.label === "Shop" ||
                    link.href.includes("aqua-pc-parts") ||
                    link.href.startsWith("http");
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                    >
                      {isExternalSite ? (
                        <a
                          href={link.href}
                          className="flex items-center justify-between px-4 py-3 text-body-lg rounded-lg transition-colors text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span>
                            {link.label === "3D Builder"
                              ? "3D Builder (3D Studio)"
                              : link.label === "Shop"
                              ? "Shop (Aqua PC Parts)"
                              : link.label}
                          </span>
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            open_in_new
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 text-body-lg rounded-lg transition-colors ${
                            pathname === link.href
                              ? "text-primary bg-primary/10 font-semibold"
                              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 pt-3 border-t border-outline-variant/20 flex flex-col gap-2"
              >
                <ThemeToggle showLabel className="bg-surface-container-high/50 border border-outline-variant/30" />

                {isAuthenticated && user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-lg bg-surface-container-high/70 border border-primary/30 text-on-surface font-jakarta font-semibold text-body-sm flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        account_circle
                      </span>
                      <span>My Account</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="px-4 py-2.5 rounded-lg bg-error-container/20 border border-error/30 text-on-error-container font-jakarta font-semibold text-body-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openAuthModal("signin", pathname || "/account");
                      }}
                      className="px-4 py-2.5 rounded-lg bg-surface-container-high/70 border border-outline-variant/40 text-on-surface font-jakarta font-semibold text-body-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        login
                      </span>
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openAuthModal("register", pathname || "/account");
                      }}
                      className="px-4 py-2.5 rounded-lg bg-surface-container-high/70 border border-secondary/35 text-on-surface font-jakarta font-semibold text-body-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        person_add
                      </span>
                      <span>Register</span>
                    </button>
                  </div>
                )}

                <Button variant="primary" size="md" href="/contact" className="w-full">
                  Book Consultation
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
