"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SHOP_SECTIONS,
  TOTAL_SHOP_ITEMS,
  SECTION_ITEM_COUNTS,
  buildWhatsAppUrl,
} from "@/lib/shopData";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";

interface FlatCatalogItem {
  id: string;
  name: string;
  specs?: string;
  sectionId: string;
  sectionLabel: string;
  categoryName: string;
  icon: string;
}

const ALL_CATALOG_ITEMS: FlatCatalogItem[] = SHOP_SECTIONS.flatMap((section) =>
  section.categories.flatMap((category) =>
    category.items.map((item) => ({
      id: item.id,
      name: item.name,
      specs: item.specs,
      sectionId: section.id,
      sectionLabel: section.label,
      categoryName: category.name,
      icon: category.icon || section.icon || "memory",
    }))
  )
);

const INITIAL_LIMIT = 24;

export default function InteractiveCatalog() {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [installOptions, setInstallOptions] = useState<Record<string, boolean>>({});
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT);

  const toggleInstall = (id: string) => {
    setInstallOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterChange = (nextFilter: string) => {
    setFilter(nextFilter);
    setVisibleLimit(INITIAL_LIMIT);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleLimit(INITIAL_LIMIT);
  };

  const filteredParts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return ALL_CATALOG_ITEMS.filter((item) => {
      const matchesFilter = filter === "all" || item.sectionId === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q) ||
        (item.specs && item.specs.toLowerCase().includes(q))
      );
    });
  }, [filter, searchTerm]);

  const displayedParts = filteredParts.slice(0, visibleLimit);
  const remainingCount = Math.max(0, filteredParts.length - displayedParts.length);

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Catalog Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div>
          <span className="font-mono text-label-badge text-primary uppercase tracking-widest">
            Live Workshop Inventory ({TOTAL_SHOP_ITEMS} Items)
          </span>
          <h2 className="font-syne text-headline-md text-on-surface mt-space-xs">
            Parts Stock &amp; Direct WhatsApp Quote Lookup
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Browse our full Grade-A parts list below, optionally include workshop installation (+From Rs. 1,500), and request today&apos;s best LKR rate directly on WhatsApp.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary font-syne text-title-md border border-primary/30 transition-all shrink-0 self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          <span>Open Full Category Shop</span>
        </Link>
      </div>

      {/* Category Pill Bar */}
      <div className="flex items-center gap-space-xs p-1.5 rounded-xl bg-surface-container-high overflow-x-auto border border-outline-variant/20">
        <button
          type="button"
          onClick={() => handleFilterChange("all")}
          className={`relative z-10 px-space-md py-space-xs rounded-lg font-syne text-body-sm font-semibold transition-colors whitespace-nowrap ${
            filter === "all"
              ? "text-on-primary-container"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {filter === "all" && (
            <motion.span
              layoutId="catalog-filter-pill"
              className="absolute inset-0 rounded-lg bg-primary-container shadow-sm -z-10"
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            />
          )}
          All Parts ({TOTAL_SHOP_ITEMS})
        </button>

        {SHOP_SECTIONS.map((sec) => {
          const active = filter === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleFilterChange(sec.id)}
              className={`relative z-10 px-space-md py-space-xs rounded-lg font-syne text-body-sm font-semibold transition-colors whitespace-nowrap ${
                active
                  ? "text-on-primary-container"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              {active && (
                <motion.span
                  layoutId="catalog-filter-pill"
                  className="absolute inset-0 rounded-lg bg-primary-container shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
              {sec.label} ({SECTION_ITEM_COUNTS[sec.id] ?? 0})
            </button>
          );
        })}
      </div>

      {/* Search & Layout Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/15">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-space-md py-space-xs rounded-lg bg-surface text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
            placeholder="Search any CPU, GPU, board, monitor, SSD..."
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-space-xs font-mono text-label-tech text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_currentColor] animate-pulse" />
            <span>
              Showing {displayedParts.length} of {filteredParts.length} Matching Items
            </span>
          </div>
          <span className="hidden md:inline text-outline">|</span>
          <span className="font-mono text-label-tech text-outline">
            Add-on Bench Install: From Rs. 1,500
          </span>
        </div>
      </div>

      {/* Parts Table Container */}
      <div className="w-full overflow-x-auto rounded-xl bg-surface-container shadow-md border border-outline-variant/15">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high text-on-surface-variant font-mono text-label-tech uppercase tracking-wider border-b border-outline-variant/20">
              <th className="py-space-md px-space-lg">Part &amp; Series</th>
              <th className="py-space-md px-space-md">Section</th>
              <th className="py-space-md px-space-md">Testing &amp; Pricing</th>
              <th className="py-space-md px-space-md">Optional Bench Install</th>
              <th className="py-space-md px-space-lg text-right">Instant Quote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
            {displayedParts.map((part) => {
              const withInstall = !!installOptions[part.id];
              const whatsappMessage = withInstall
                ? `Hi Aqua PC Solutions, I'd like to check the latest LKR price and availability for: ${part.name} (${part.categoryName}) WITH Workshop Install & Stress Check (+From Rs. 1,500).`
                : `Hi Aqua PC Solutions, I'd like to check the latest LKR price and availability for: ${part.name} (${part.categoryName}).`;

              return (
                <tr
                  key={part.id}
                  className="hover:bg-surface-container-high/60 transition-colors group"
                >
                  <td className="py-space-md px-space-lg">
                    <div className="flex items-center gap-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 border border-outline-variant/20 group-hover:scale-105 group-hover:border-primary/40 transition-all">
                        <span className="material-symbols-outlined text-[20px]">
                          {part.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-syne text-title-md text-on-surface group-hover:text-primary transition-colors">
                          {part.name}
                        </span>
                        <span className="font-mono text-label-tech text-outline">
                          {part.categoryName}
                          {part.specs ? ` · ${part.specs}` : ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-highest font-mono text-[10px] text-on-surface-variant uppercase whitespace-nowrap">
                      {part.sectionLabel}
                    </span>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col gap-0.5">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-secondary whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        Grade-A Tested · 06 Mo. Warranty
                      </span>
                      <span className="font-mono text-[11px] text-primary">
                        {withInstall
                          ? "LKR Part Rate + Rs. 1,500 Install"
                          : "Live Daily LKR Market Rate"}
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <label className="flex items-center gap-space-xs cursor-pointer select-none whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={withInstall}
                        onChange={() => toggleInstall(part.id)}
                        className="w-4 h-4 rounded bg-surface-container border-0 accent-primary text-on-primary"
                      />
                      <span className="text-body-sm text-on-surface-variant">
                        +Workshop Install &amp; Stress Check
                      </span>
                    </label>
                  </td>
                  <td className="py-space-md px-space-lg text-right">
                    <motion.a
                      whileTap={{ scale: 0.96 }}
                      href={buildWhatsAppUrl(whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-body-sm font-bold transition-all shadow-sm whitespace-nowrap"
                    >
                      <span>Inquire Price</span>
                      <span className="material-symbols-outlined text-[16px]">
                        open_in_new
                      </span>
                    </motion.a>
                  </td>
                </tr>
              );
            })}

            {displayedParts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-space-xl text-center">
                  <div className="flex flex-col items-center gap-space-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[32px] text-outline">
                      search_off
                    </span>
                    <span className="font-syne text-title-md text-on-surface">
                      No matching hardware found for &ldquo;{searchTerm}&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFilter("all");
                        setSearchTerm("");
                      }}
                      className="mt-1 px-space-md py-space-xs rounded-lg bg-surface-container-high text-primary font-mono text-label-tech border border-primary/30"
                    >
                      Reset Catalog Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show More Control */}
      {remainingCount > 0 && (
        <div className="flex justify-center pt-space-xs">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_PREMIUM }}
            onClick={() => setVisibleLimit((prev) => prev + 36)}
            className="inline-flex items-center gap-space-xs px-space-xl py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-syne text-title-md border border-primary/30 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              expand_more
            </span>
            <span>
              Show More Hardware ({remainingCount} More Remaining)
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
