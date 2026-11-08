"use client";

import React, { useState } from "react";

export interface CatalogItem {
  id: string;
  name: string;
  specs: string;
  category: "cpu" | "gpu" | "cooling";
  stock: number;
  price: number;
}

export const CATALOG_PARTS: CatalogItem[] = [
  {
    id: "r7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    specs: "8C/16T • 3D V-Cache • AM5",
    category: "cpu",
    stock: 6,
    price: 389.0,
  },
  {
    id: "r9-7950x3d",
    name: "AMD Ryzen 9 7950X3D",
    specs: "16C/32T • 144MB Cache • AM5",
    category: "cpu",
    stock: 4,
    price: 599.0,
  },
  {
    id: "i7-14700k",
    name: "Intel Core i7-14700K",
    specs: "20C/28T • Up to 5.6GHz • LGA1700",
    category: "cpu",
    stock: 8,
    price: 399.0,
  },
  {
    id: "i9-14900k",
    name: "Intel Core i9-14900K",
    specs: "24C/32T • Up to 6.0GHz • LGA1700",
    category: "cpu",
    stock: 3,
    price: 549.0,
  },
  {
    id: "rtx-4080s",
    name: "NVIDIA GeForce RTX 4080 Super",
    specs: "16GB GDDR6X • DLSS 3.5 • 256-bit",
    category: "gpu",
    stock: 5,
    price: 999.0,
  },
  {
    id: "rtx-4090",
    name: "NVIDIA GeForce RTX 4090 Founders/OC",
    specs: "24GB GDDR6X • 384-bit • Ada Flagship",
    category: "gpu",
    stock: 2,
    price: 1749.0,
  },
  {
    id: "vortex-360",
    name: "Aqua Vortex Pro 360 Liquid Cooler",
    specs: "360mm Radiator • Triple Mag Fans • LCD",
    category: "cooling",
    stock: 11,
    price: 229.0,
  },
  {
    id: "sam-990-2tb",
    name: "Samsung 990 Pro 2TB PCIe 4.0 NVMe",
    specs: "7450 MB/s Read • Heatsink Included",
    category: "cooling",
    stock: 14,
    price: 179.0,
  },
];

export default function InteractiveCatalog() {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mountOptions, setMountOptions] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const toggleMount = (id: string) => {
    setMountOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const filteredParts = CATALOG_PARTS.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Catalog Controls Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <span className="font-mono text-label-badge text-primary uppercase tracking-widest">
            Inventory &amp; Components
          </span>
          <h2 className="font-syne text-headline-md text-on-surface mt-space-xs">
            Individual PC Parts Catalog
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Real-time shelf pricing, manufacturer warranty, and turnkey installation options.
          </p>
        </div>

        {/* Filter Pill Bar */}
        <div className="flex items-center gap-space-xs p-1 rounded-xl bg-surface-container-high overflow-x-auto border border-outline-variant/20">
          {[
            { id: "all", label: "All Parts" },
            { id: "cpu", label: "CPUs" },
            { id: "gpu", label: "GPUs" },
            { id: "cooling", label: "Cooling & Storage" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-space-md py-space-xs rounded-lg font-syne text-title-md transition-all ${
                filter === tab.id
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Layout Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/15">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-space-md py-space-xs rounded-lg bg-surface text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
            placeholder="Filter by model, socket, or capacity..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-space-xs font-mono text-label-tech text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_currentColor] animate-pulse" />
            <span>{filteredParts.length} Matching Items</span>
          </div>
          <span className="text-outline">|</span>
          <span className="font-mono text-label-tech text-outline">
            Add-on Installation: +$35/part
          </span>
        </div>
      </div>

      {/* Parts Table Container */}
      <div className="w-full overflow-x-auto rounded-xl bg-surface-container shadow-md border border-outline-variant/15">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high text-on-surface-variant font-mono text-label-tech uppercase tracking-wider border-b border-outline-variant/20">
              <th className="py-space-md px-space-lg">Component Spec</th>
              <th className="py-space-md px-space-md">Category</th>
              <th className="py-space-md px-space-md">Availability</th>
              <th className="py-space-md px-space-md">Retail Price</th>
              <th className="py-space-md px-space-md">Lab Installation Add-on</th>
              <th className="py-space-md px-space-lg text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
            {filteredParts.map((part) => (
              <tr
                key={part.id}
                className="hover:bg-surface-container-high/60 transition-colors"
              >
                <td className="py-space-md px-space-lg flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[20px]">
                      memory
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-syne text-title-md text-on-surface">
                      {part.name}
                    </span>
                    <span className="font-mono text-label-tech text-outline">
                      {part.specs}
                    </span>
                  </div>
                </td>
                <td className="py-space-md px-space-md">
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-highest font-mono text-[10px] text-on-surface-variant uppercase">
                    {part.category}
                  </span>
                </td>
                <td className="py-space-md px-space-md">
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container-lowest text-secondary font-mono text-[11px] border border-secondary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />{" "}
                    {part.stock} IN STOCK
                  </span>
                </td>
                <td className="py-space-md px-space-md font-mono text-telemetry-num text-primary">
                  ${part.price.toFixed(2)}
                </td>
                <td className="py-space-md px-space-md">
                  <label className="flex items-center gap-space-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!mountOptions[part.id]}
                      onChange={() => toggleMount(part.id)}
                      className="w-4 h-4 rounded bg-surface-container border-0 accent-primary text-on-primary"
                    />
                    <span className="text-body-sm text-on-surface-variant">
                      +Mount &amp; Test (+$35)
                    </span>
                  </label>
                </td>
                <td className="py-space-md px-space-lg text-right">
                  <button
                    onClick={() => handleAdd(part.id)}
                    className={`px-space-md py-space-xs rounded-lg font-syne text-title-md transition-all shadow-sm ${
                      addedItems[part.id]
                        ? "bg-secondary text-surface font-bold"
                        : "bg-primary hover:bg-primary-fixed-dim text-on-primary"
                    }`}
                    type="button"
                  >
                    {addedItems[part.id] ? "Added!" : "Add to Build"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
