"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHOP_SECTIONS, TOTAL_SHOP_ITEMS, WHATSAPP_LINK } from "@/lib/shopData";
import {
  MaskedReveal,
  CircuitFlowBackdrop,
  AnimatedNumber,
  fadeUpVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

// ── WhatsApp Contact Button ───────────────────────────────────────────────
function WhatsAppButton({ itemName }: { itemName: string }) {
  const message = encodeURIComponent(
    `Hi! I'm interested in the following item from your shop:\n\n*${itemName}*\n\nPlease let me know if it's available and the current price. Thank you!`
  );
  const link = `${WHATSAPP_LINK}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Contact via WhatsApp about ${itemName}`}
      className={[
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
        "bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#17a84e]",
        "text-white text-body-sm font-semibold",
        "transition-all duration-200 shadow-sm hover:shadow-[0_6px_18px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:translate-y-0",
        "whitespace-nowrap select-none",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Contact
    </a>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────────
function ItemCard({ name }: { name: string }) {
  return (
    <div
      className={[
        "sheen-hover flex items-center justify-between gap-3 px-4 py-3",
        "bg-surface-container border border-outline-variant/20 rounded-xl",
        "hover:border-primary/40 hover:bg-surface-container-high/70 hover:shadow-md hover:translate-x-1",
        "transition-all duration-200 group",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 group-hover:scale-150 group-hover:shadow-[0_0_8px_currentColor] transition-all duration-200" />
        <span className="text-body-md text-on-surface font-medium truncate group-hover:text-primary transition-colors">
          {name}
        </span>
      </div>
      <div className="shrink-0">
        <WhatsAppButton itemName={name} />
      </div>
    </div>
  );
}

// ── Category Block ────────────────────────────────────────────────────────
function CategoryBlock({
  name,
  icon,
  items,
}: {
  name: string;
  icon: string;
  items: { id: string; name: string; specs?: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-primary text-[20px]">
          {icon}
        </span>
        <h3 className="font-syne text-headline-sm text-on-surface">{name}</h3>
        <span className="ml-auto font-mono text-label-tech text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-md border border-outline-variant/20">
          {items.length} items
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ItemCard key={item.id} name={item.name} />
        ))}
      </div>
    </div>
  );
}

// ── Main Shop Page ────────────────────────────────────────────────────────
export default function ShopPage() {
  const [activeSection, setActiveSection] = useState(SHOP_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category from URL parameter (e.g. from home or footer links)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat && SHOP_SECTIONS.some((s) => s.id === cat)) {
        setActiveSection(cat);
      }
    }
  }, []);

  const currentSection = SHOP_SECTIONS.find((s) => s.id === activeSection)!;

  const filteredSection = useMemo(() => {
    if (!searchQuery.trim()) return currentSection;
    const q = searchQuery.toLowerCase();
    return {
      ...currentSection,
      categories: currentSection.categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) =>
            item.name.toLowerCase().includes(q)
          ),
        }))
        .filter((cat) => cat.items.length > 0),
    };
  }, [currentSection, searchQuery]);

  const totalItems = currentSection.categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  const filteredCount = filteredSection.categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <div className="flex flex-col w-full">
      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-12">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-55" />
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-primary/12 rounded-full blur-[120px] animate-orb-drift pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-secondary/12 rounded-full blur-[140px] animate-orb-drift-delay pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-margin-md relative z-10">
          <div className="flex flex-col gap-space-sm max-w-3xl">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-space-xs w-fit"
            >
              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-label-tech border border-secondary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.9)] animate-pulse" />
                CERTIFIED HARDWARE — GRADE A
              </span>
            </motion.div>
            <h1 className="font-syne text-display-hero-mobile lg:text-headline-lg text-on-surface tracking-tight">
              <MaskedReveal delay={0.05}>Shop</MaskedReveal>{" "}
              <MaskedReveal delay={0.14}>
                <span className="text-shimmer">PC Parts &amp; Components</span>
              </MaskedReveal>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-body-lg text-on-surface-variant max-w-2xl"
            >
              Browse all {TOTAL_SHOP_ITEMS} quality-tested PC parts including
              monitors, VGA cards, processors, motherboards, storage, RAM, power
              supplies, cooling, and accessories. Contact us via WhatsApp for
              current availability and LKR pricing.
            </motion.p>

            {/* Trust Chips */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-2 mt-2"
            >
              {[
                { icon: "verified", text: "Quality Tested" },
                { icon: "local_shipping", text: "Available In Store" },
                { icon: "support_agent", text: "WhatsApp Support" },
                { icon: "currency_exchange", text: "Best Market Price" },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 font-mono text-label-tech text-on-surface-variant hover:border-primary/40 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    {icon}
                  </span>
                  {text}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Shop Content ── */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-margin-md py-space-xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar: Category Tabs ── */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 flex flex-col gap-1.5">
              <p className="font-mono text-label-tech uppercase text-primary tracking-widest mb-1 px-1">
                Categories
              </p>
              {SHOP_SECTIONS.map((section) => {
                const count = section.categories.reduce(
                  (s, c) => s + c.items.length,
                  0
                );
                const isActive = section.id === activeSection;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id);
                      setSearchQuery("");
                    }}
                    className={[
                      "relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors duration-200",
                      isActive
                        ? "text-primary font-semibold"
                        : "hover:bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface",
                    ].join(" ")}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="shop-active-category"
                        className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/30 shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 360, damping: 32 }}
                      />
                    )}
                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 ${isActive ? "text-primary" : ""}`}
                    >
                      {section.icon}
                    </span>
                    <span className="font-medium text-body-md flex-1 truncate">
                      {section.label}
                    </span>
                    <span
                      className={[
                        "font-mono text-label-tech px-1.5 py-0.5 rounded-md shrink-0",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Section Header + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  {currentSection.icon}
                </span>
                <div>
                  <h2 className="font-syne text-headline-sm text-on-surface">
                    {currentSection.label}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant font-mono">
                    {searchQuery
                      ? `${filteredCount} of ${totalItems} items`
                      : <><AnimatedNumber value={`${totalItems}`} /> items available</>}
                  </p>
                </div>
              </div>

              {/* Search within section */}
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder={`Search ${currentSection.label.toLowerCase()}…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={[
                    "pl-9 pr-8 py-2 rounded-xl text-body-sm w-full sm:w-72",
                    "bg-surface-container border border-outline-variant/30",
                    "text-on-surface placeholder:text-on-surface-variant",
                    "focus:outline-none focus:border-primary/60 focus:bg-surface-container-high/40",
                    "transition-colors duration-200",
                  ].join(" ")}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="Clear search"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* WhatsApp Global CTA Banner */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex items-center gap-3 px-5 py-4 rounded-2xl mb-6",
                "bg-[#25D366]/10 border border-[#25D366]/30",
                "hover:bg-[#25D366]/15 hover:border-[#25D366]/50 hover:-translate-y-0.5 hover:shadow-md",
                "transition-all duration-200 group",
              ].join(" ")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-[#25D366] shrink-0 group-hover:scale-110 transition-transform"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div className="flex-1">
                <p className="font-syne text-title-md text-on-surface group-hover:text-[#1ebe5a] transition-colors">
                  Chat with us on WhatsApp
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Ask about availability, pricing, or any part you need — we
                  respond fast!
                </p>
              </div>
              <span className="material-symbols-outlined text-[#25D366] text-[22px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>

            {/* Category Blocks with smooth transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection + (searchQuery ? "-search" : "")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: EASE_PREMIUM }}
              >
                {filteredSection.categories.length > 0 ? (
                  <div className="flex flex-col gap-10">
                    {filteredSection.categories.map((cat) => (
                      <CategoryBlock
                        key={cat.id}
                        name={cat.name}
                        icon={cat.icon}
                        items={cat.items}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
                      search_off
                    </span>
                    <p className="font-syne text-headline-sm text-on-surface-variant">
                      No results for &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="text-body-md text-on-surface-variant/70">
                      Try a different search term or browse another category.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-primary hover:underline text-body-md font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
