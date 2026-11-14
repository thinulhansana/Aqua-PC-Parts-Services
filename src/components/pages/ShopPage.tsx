"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SHOP_SECTIONS,
  TOTAL_SHOP_ITEMS,
  WHATSAPP_DIRECT_BASE,
  formatPriceLKR,
  buildItemWhatsAppMessage,
  buildItemWhatsAppUrl,
  type ShopItem,
  type ItemWhatsAppIntent,
  type ItemWhatsAppFulfillment,
} from "@/lib/shopData";
import {
  MaskedReveal,
  CircuitFlowBackdrop,
  AnimatedNumber,
  fadeUpVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

type PriceSortOrder = "default" | "price-asc" | "price-desc";

const INTENT_OPTIONS: { id: ItemWhatsAppIntent; label: string; icon: string }[] = [
  { id: "order", label: "Order Now", icon: "shopping_bag" },
  { id: "availability", label: "Check Availability", icon: "inventory_2" },
  { id: "compatibility", label: "Compatibility Help", icon: "build" },
  { id: "install", label: "With Lab Install", icon: "handyman" },
];

const FULFILLMENT_OPTIONS: {
  id: ItemWhatsAppFulfillment;
  label: string;
  icon: string;
}[] = [
  { id: "pickup", label: "Store Pickup (Embilipitiya)", icon: "storefront" },
  { id: "delivery", label: "Island-wide Delivery", icon: "local_shipping" },
  {
    id: "workshop-install",
    label: "Workshop Fitting (+Rs. 1,500)",
    icon: "engineering",
  },
];

function WhatsAppIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Item Card with Price + Per-Item WhatsApp Customizer ───────────────────────
function ItemCard({
  item,
  categoryName,
  sectionLabel,
}: {
  item: ShopItem;
  categoryName: string;
  sectionLabel: string;
}) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [intent, setIntent] = useState<ItemWhatsAppIntent>("order");
  const [fulfillment, setFulfillment] =
    useState<ItemWhatsAppFulfillment>("pickup");
  const [customNote, setCustomNote] = useState("");

  const hasPrice = typeof item.price === "number" && Number.isFinite(item.price);
  const priceLabel = formatPriceLKR(item.price);

  const whatsappOptions = useMemo(
    () => ({
      item,
      categoryName,
      sectionLabel,
      quantity,
      intent,
      fulfillment,
      customNote,
    }),
    [item, categoryName, sectionLabel, quantity, intent, fulfillment, customNote]
  );

  const directLink = useMemo(
    () => buildItemWhatsAppUrl(whatsappOptions),
    [whatsappOptions]
  );

  const previewMessage = useMemo(
    () => buildItemWhatsAppMessage(whatsappOptions),
    [whatsappOptions]
  );

  const estimatedTotal = hasPrice ? item.price! * quantity : undefined;

  return (
    <div
      className={[
        "sheen-hover flex flex-col px-4 py-3.5",
        "bg-surface-container border rounded-xl transition-all duration-200 group",
        isCustomizing
          ? "border-[#25D366]/50 bg-surface-container-high/70 shadow-md"
          : "border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high/70 hover:shadow-md",
      ].join(" ")}
    >
      {/* Main Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2 sm:mt-0 group-hover:scale-150 group-hover:shadow-[0_0_8px_currentColor] transition-all duration-200" />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-body-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
              {item.name}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/10 border border-secondary/25 font-mono text-[11px] text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {item.warranty || "06 Mo. Warranty"}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container-high border border-outline-variant/20 font-mono text-[11px] text-on-surface-variant">
                Grade A
              </span>
              {item.specs && (
                <span className="font-mono text-[11px] text-outline truncate">
                  {item.specs}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Price Badge + Customize Toggle + WhatsApp Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 shrink-0">
          {hasPrice ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/12 border border-primary/35 font-syne text-title-sm sm:text-title-md font-bold text-primary whitespace-nowrap">
              {priceLabel}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 font-mono text-[11px] font-medium text-on-surface-variant whitespace-nowrap">
              Price on Inquiry
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustomizing((prev) => !prev)}
              aria-expanded={isCustomizing}
              aria-label={`Customize WhatsApp message for ${item.name}`}
              className={[
                "inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-body-sm font-medium border transition-all duration-200 whitespace-nowrap select-none",
                isCustomizing
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "bg-surface-container-high/80 border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/40",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-[16px]">
                tune
              </span>
              <span>Customize</span>
            </button>

            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contact via WhatsApp about ${item.name}`}
              className={[
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg",
                "bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#17a84e]",
                "text-white text-body-sm font-semibold",
                "transition-all duration-200 shadow-sm hover:shadow-[0_6px_18px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:translate-y-0",
                "whitespace-nowrap select-none",
              ].join(" ")}
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>{hasPrice ? "Buy / Ask" : "Inquire"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Expandable Per-Item WhatsApp Customizer */}
      <AnimatePresence initial={false}>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <div className="mt-3.5 pt-3.5 border-t border-outline-variant/25 flex flex-col gap-3.5">
              {/* Row 1: Quantity + Live Total */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-label-tech uppercase text-on-surface-variant">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-lg bg-surface border border-outline-variant/30 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="px-2.5 py-1 text-on-surface hover:bg-surface-container-high disabled:opacity-40 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-mono text-body-sm font-semibold text-on-surface min-w-[2.25rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      disabled={quantity >= 20}
                      aria-label="Increase quantity"
                      className="px-2.5 py-1 text-on-surface hover:bg-surface-container-high disabled:opacity-40 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {typeof estimatedTotal === "number" && (
                  <div className="flex items-center gap-2 font-mono text-body-sm">
                    <span className="text-on-surface-variant">
                      Estimated Total:
                    </span>
                    <span className="font-syne font-bold text-primary">
                      {formatPriceLKR(estimatedTotal)}
                    </span>
                  </div>
                )}
              </div>

              {/* Row 2: Inquiry Type */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-label-tech uppercase text-on-surface-variant">
                  Inquiry Type
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {INTENT_OPTIONS.map((opt) => {
                    const active = intent === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIntent(opt.id)}
                        className={[
                          "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium border transition-colors",
                          active
                            ? "bg-primary/15 border-primary/50 text-primary"
                            : "bg-surface border-outline-variant/25 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50",
                        ].join(" ")}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {opt.icon}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Delivery / Pickup Option */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-label-tech uppercase text-on-surface-variant">
                  Delivery / Pickup Option
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FULFILLMENT_OPTIONS.map((opt) => {
                    const active = fulfillment === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFulfillment(opt.id)}
                        className={[
                          "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium border transition-colors",
                          active
                            ? "bg-secondary/15 border-secondary/50 text-secondary"
                            : "bg-surface border-outline-variant/25 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50",
                        ].join(" ")}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {opt.icon}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Custom Note */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`note-${item.id}`}
                  className="font-mono text-label-tech uppercase text-on-surface-variant"
                >
                  Custom Note (Optional)
                </label>
                <input
                  id={`note-${item.id}`}
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder='e.g. "Need compatible cooler" or "Can you send photos?"'
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-lg text-body-sm bg-surface border border-outline-variant/30 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {/* Row 5: Live Preview & Send Custom WhatsApp */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 p-3 rounded-lg bg-surface/80 border border-outline-variant/20">
                <pre className="font-mono text-[11px] text-on-surface-variant whitespace-pre-wrap break-words leading-relaxed flex-1">
                  {previewMessage}
                </pre>
                <a
                  href={directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] active:bg-[#17a84e] text-white text-body-sm font-bold shadow-sm hover:shadow-[0_6px_18px_rgba(37,211,102,0.35)] transition-all whitespace-nowrap shrink-0"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>Send Custom WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Category Block ────────────────────────────────────────────────────────
function CategoryBlock({
  name,
  icon,
  sectionLabel,
  items,
}: {
  name: string;
  icon: string;
  sectionLabel: string;
  items: ShopItem[];
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
          <ItemCard
            key={item.id}
            item={item}
            categoryName={name}
            sectionLabel={sectionLabel}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Shop Page ────────────────────────────────────────────────────────
export default function ShopPage() {
  const [activeSection, setActiveSection] = useState(SHOP_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<PriceSortOrder>("default");

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
    const q = searchQuery.trim().toLowerCase();

    const sortItems = (items: ShopItem[]): ShopItem[] => {
      if (sortOrder === "default") return items;
      return [...items].sort((a, b) => {
        const pa = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
        const pb = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
        if (sortOrder === "price-asc") {
          return pa - pb;
        }
        // price-desc: keep unpriced items at the bottom
        if (pa === Number.POSITIVE_INFINITY && pb === Number.POSITIVE_INFINITY) return 0;
        if (pa === Number.POSITIVE_INFINITY) return 1;
        if (pb === Number.POSITIVE_INFINITY) return -1;
        return pb - pa;
      });
    };

    return {
      ...currentSection,
      categories: currentSection.categories
        .map((cat) => {
          const matching = q
            ? cat.items.filter(
                (item) =>
                  item.name.toLowerCase().includes(q) ||
                  (item.specs && item.specs.toLowerCase().includes(q))
              )
            : cat.items;
          return {
            ...cat,
            items: sortItems(matching),
          };
        })
        .filter((cat) => cat.items.length > 0),
    };
  }, [currentSection, searchQuery, sortOrder]);

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
              Browse all {TOTAL_SHOP_ITEMS} quality-tested PC parts with transparent
              LKR pricing and 06-month testing warranty. Customize your inquiry
              for any item and message us directly on WhatsApp.
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
                { icon: "verified", text: "Quality Tested · 06 Mo. Warranty" },
                { icon: "local_shipping", text: "Island-wide Delivery" },
                { icon: "support_agent", text: "Custom WhatsApp Order" },
                { icon: "currency_exchange", text: "Transparent LKR Pricing" },
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
            {/* Section Header + Search + Price Sort */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  {currentSection.icon}
                </span>
                <div>
                  <h2 className="font-syne text-headline-sm text-on-surface">
                    {currentSection.label}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant font-mono">
                    {searchQuery ? (
                      `${filteredCount} of ${totalItems} items`
                    ) : (
                      <>
                        <AnimatedNumber value={`${totalItems}`} /> items available
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Search + Sort controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
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
                      "pl-9 pr-8 py-2 rounded-xl text-body-sm w-full sm:w-64",
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

                {/* Price Sort Selector */}
                <div className="relative">
                  <label htmlFor="shop-price-sort" className="sr-only">
                    Sort items by price
                  </label>
                  <select
                    id="shop-price-sort"
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as PriceSortOrder)
                    }
                    className={[
                      "w-full sm:w-auto px-3 py-2 rounded-xl text-body-sm font-medium",
                      "bg-surface-container border border-outline-variant/30 text-on-surface",
                      "focus:outline-none focus:border-primary/60 cursor-pointer transition-colors",
                    ].join(" ")}
                  >
                    <option value="default">Sort: Default Order</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* WhatsApp Global CTA Banner */}
            <a
              href={`${WHATSAPP_DIRECT_BASE}?text=${encodeURIComponent(
                `Hello Aqua PC Solutions! I'm browsing ${currentSection.label} on your shop page and would like assistance.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex items-center gap-3 px-5 py-4 rounded-2xl mb-6",
                "bg-[#25D366]/10 border border-[#25D366]/30",
                "hover:bg-[#25D366]/15 hover:border-[#25D366]/50 hover:-translate-y-0.5 hover:shadow-md",
                "transition-all duration-200 group",
              ].join(" ")}
            >
              <WhatsAppIcon className="w-7 h-7 text-[#25D366] shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <p className="font-syne text-title-md text-on-surface group-hover:text-[#1ebe5a] transition-colors">
                  Chat with us on WhatsApp
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Click &ldquo;Customize&rdquo; on any part to select quantity,
                  delivery or workshop fitting, or message us directly here!
                </p>
              </div>
              <span className="material-symbols-outlined text-[#25D366] text-[22px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>

            {/* Category Blocks with smooth transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection + (searchQuery ? "-search" : "") + "-" + sortOrder}
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
                        sectionLabel={currentSection.label}
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
