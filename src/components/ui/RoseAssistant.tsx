"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SHOP_SECTIONS,
  TOTAL_SHOP_ITEMS,
  ShopItem,
  formatPriceLKR,
  buildItemWhatsAppUrl,
  buildWhatsAppUrl,
} from "@/lib/shopData";
import {
  SITE_NAME,
  SITE_FOUNDER,
  SITE_LOCATION,
  SITE_HOURS,
  SITE_PHONE_DISPLAY,
  AQUA_PC_PARTS_URL,
  getAquaPcPartsUrl,
} from "@/lib/constants";
import { EASE_PREMIUM } from "@/components/ui/MotionPrimitives";

// ── Types ─────────────────────────────────────────────────────────────────────
interface IndexedPart {
  item: ShopItem;
  sectionId: string;
  sectionLabel: string;
  categoryId: string;
  categoryName: string;
  searchText: string;
}

interface MatchedPartCard {
  id: string;
  name: string;
  specs?: string;
  price?: number;
  warranty?: string;
  sectionId: string;
  sectionLabel: string;
  categoryName: string;
  whatsappUrl: string;
  browseUrl: string;
}

interface ChatAction {
  label: string;
  href: string;
  external?: boolean;
  variant?: "whatsapp" | "primary";
}

interface ChatMessage {
  id: string;
  role: "rose" | "user";
  text: string;
  parts?: MatchedPartCard[];
  actions?: ChatAction[];
  timestamp: string;
}

const STORAGE_KEY = "aqua-rose-chat-v1";
const DISMISSED_CALLOUT_KEY = "aqua-rose-callout-dismissed-v1";

const QUICK_PROMPTS = [
  { label: "Check GPU & CPU Prices", query: "Show popular RTX graphics cards and Ryzen processors" },
  { label: "Gaming PC Build", query: "Recommend a gaming PC build under 150k" },
  { label: "New Mice & Keyboards", query: "Show brand new mice and keyboards" },
  { label: "Repair & Service Rates", query: "What are your repair and diagnostic service rates?" },
  { label: "Warranty & Delivery", query: "Tell me about warranty, delivery, and workshop hours" },
];

const SYNONYMS: Record<string, string[]> = {
  gpu: ["vga", "graphics", "gtx", "rtx", "rx"],
  vga: ["vga", "graphics", "gtx", "rtx", "rx"],
  graphics: ["vga", "gtx", "rtx", "rx"],
  cpu: ["processor", "ryzen", "core", "intel", "amd", "gen"],
  processor: ["processors", "ryzen", "intel", "amd", "i3", "i5", "i7"],
  mobo: ["motherboard", "board", "ddr", "b450", "b550", "h61", "h81"],
  motherboard: ["board", "motherboards"],
  memory: ["ram", "ddr2", "ddr3", "ddr4"],
  ram: ["ram", "ddr-2", "ddr-3", "ddr-4", "ddr2", "ddr3", "ddr4"],
  drive: ["ssd", "hdd", "nvme", "m.2", "hard"],
  storage: ["ssd", "hdd", "nvme", "m.2", "hard"],
  screen: ["monitor", "lcd", "led", "ips", "frameless"],
  display: ["monitor", "lcd", "led", "ips", "frameless"],
  monitor: ["monitors", "lcd", "led", "ips", "frameless"],
  psu: ["power supply", "power", "600w", "650w", "750w", "850w"],
  cooler: ["cooling", "fan", "copper", "am4", "lga"],
  fan: ["cooling", "fan", "cooler"],
  webcam: ["web cam", "camera", "720p", "1080p"],
  camera: ["web cam", "webcam"],
  mic: ["micro phone", "microphone", "tucci"],
  microphone: ["micro phone", "mic", "tucci"],
  audio: ["sound card", "mic", "microphone"],
  sound: ["sound card", "hifi", "5.1", "7.1"],
  mouse: ["mouse", "jedel", "b300", "g102"],
  keyboard: ["keyboard", "banda", "helios", "combo"],
  peripherals: ["mouse", "keyboard", "webcam", "mic", "sound card", "brand new"],
};

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "for", "of", "to", "in", "on", "with", "and",
  "or", "do", "you", "have", "any", "show", "me", "find", "price", "prices",
  "cost", "how", "much", "give", "list", "please", "pls", "want", "need", "buy",
  "popular", "some", "best", "good", "under", "below", "cheapest", "lowest",
  "highest", "new", "brand",
]);

function buildIndex(): IndexedPart[] {
  const list: IndexedPart[] = [];
  for (const section of SHOP_SECTIONS) {
    for (const category of section.categories) {
      for (const item of category.items) {
        const searchText = [
          item.name,
          item.specs ?? "",
          category.name,
          section.label,
        ]
          .join(" ")
          .toLowerCase();
        list.push({
          item,
          sectionId: section.id,
          sectionLabel: section.label,
          categoryId: category.id,
          categoryName: category.name,
          searchText,
        });
      }
    }
  }
  return list;
}

const INDEXED_PARTS: IndexedPart[] = buildIndex();

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function parseMaxBudgetLKR(query: string): number | null {
  const lower = query.toLowerCase().replace(/,/g, "");
  const underMatch = lower.match(/(?:under|below|max|budget|around|rs\.?|lkr)\s*(\d+(?:\.\d+)?)\s*(k)?/);
  if (underMatch) {
    const raw = parseFloat(underMatch[1]);
    if (!Number.isFinite(raw)) return null;
    return underMatch[2] || raw < 1000 ? Math.round(raw * 1000) : Math.round(raw);
  }
  const standaloneK = lower.match(/\b(\d+(?:\.\d+)?)\s*k\b/);
  if (standaloneK) {
    return Math.round(parseFloat(standaloneK[1]) * 1000);
  }
  return null;
}

function toMatchedCard(entry: IndexedPart): MatchedPartCard {
  return {
    id: `${entry.sectionId}-${entry.categoryId}-${entry.item.id}`,
    name: entry.item.name,
    specs: entry.item.specs,
    price: entry.item.price,
    warranty: entry.item.warranty,
    sectionId: entry.sectionId,
    sectionLabel: entry.sectionLabel,
    categoryName: entry.categoryName,
    whatsappUrl: buildItemWhatsAppUrl({
      item: entry.item,
      categoryName: entry.categoryName,
      sectionLabel: entry.sectionLabel,
    }),
    browseUrl: getAquaPcPartsUrl(entry.sectionId),
  };
}

function searchCatalogParts(query: string, limit = 6): IndexedPart[] {
  const lower = query.toLowerCase();
  const maxBudget = parseMaxBudgetLKR(lower);
  const wantBrandNew = /\bbrand\s*new\b|\bnew\b/.test(lower);
  const sortCheapest = /\b(cheap|cheapest|lowest|budget|affordable)\b/.test(lower);
  const sortHighest = /\b(expensive|highest|top|flagship|best)\b/.test(lower);

  const rawTokens = lower
    .replace(/[^a-z0-9.\-+/\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

  // Filter out pure budget numbers like "150k" or "30000" when searching part names
  const queryTokens = rawTokens.filter((t) => !/^\d+k?$/.test(t) || /^\d{3,4}ti?$/.test(t));

  // Expand tokens with synonyms
  const expandedGroups: string[][] = queryTokens.map((tok) => {
    const alts = SYNONYMS[tok];
    return alts ? [tok, ...alts] : [tok];
  });

  if (expandedGroups.length === 0 && !wantBrandNew) {
    return [];
  }

  const scored: Array<{ entry: IndexedPart; score: number }> = [];

  for (const entry of INDEXED_PARTS) {
    if (wantBrandNew && entry.sectionId !== "peripherals") {
      continue;
    }
    if (maxBudget !== null && (typeof entry.item.price !== "number" || entry.item.price > maxBudget)) {
      continue;
    }

    let score = 0;
    const nameLower = entry.item.name.toLowerCase();
    const catLower = entry.categoryName.toLowerCase();
    const secLower = entry.sectionLabel.toLowerCase();

    if (expandedGroups.length === 0 && wantBrandNew) {
      score = 5;
    } else {
      for (const group of expandedGroups) {
        let groupMatched = false;
        for (let i = 0; i < group.length; i++) {
          const term = group[i];
          const weight = i === 0 ? 1 : 0.65;
          if (nameLower.includes(term)) {
            score += 10 * weight;
            groupMatched = true;
            break;
          } else if (catLower.includes(term) || secLower.includes(term)) {
            score += 6 * weight;
            groupMatched = true;
            break;
          } else if (entry.searchText.includes(term)) {
            score += 4 * weight;
            groupMatched = true;
            break;
          }
        }
        if (groupMatched) score += 2;
      }
    }

    // Prefer priced items slightly
    if (score > 0 && typeof entry.item.price === "number") {
      score += 1;
    }

    if (score >= 4) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => {
    if (sortCheapest) {
      const pa = a.entry.item.price ?? Number.MAX_SAFE_INTEGER;
      const pb = b.entry.item.price ?? Number.MAX_SAFE_INTEGER;
      if (b.score !== a.score && Math.abs(b.score - a.score) > 6) return b.score - a.score;
      return pa - pb;
    }
    if (sortHighest) {
      const pa = a.entry.item.price ?? 0;
      const pb = b.entry.item.price ?? 0;
      if (b.score !== a.score && Math.abs(b.score - a.score) > 6) return b.score - a.score;
      return pb - pa;
    }
    return b.score - a.score;
  });

  return scored.slice(0, limit).map((s) => s.entry);
}

function createBuildResponse(query: string): Omit<ChatMessage, "id" | "role" | "timestamp"> {
  const lower = query.toLowerCase();
  const budget = parseMaxBudgetLKR(lower);

  const isEntry =
    /\b(office|study|entry|basic|cheap)\b/.test(lower) ||
    (budget !== null && budget <= 85000);
  const isHigh =
    /\b(rtx|creator|4k|high|ultra|pro|workstation)\b/.test(lower) ||
    (budget !== null && budget >= 190000);

  if (isEntry) {
    const waText =
      "Hi Aqua PC Solutions! Rose recommended the Entry / Office & Study PC Build (~Rs. 49,980 est.). Could you confirm stock and exact quote?\n• Intel Core i5 4th Gen (Rs. 8,350)\n• H81 Motherboard (Rs. 8,550)\n• 8GB DDR3 RAM (Rs. 6,950)\n• 128GB SSD (Rs. 7,900)\n• 500W PSU (Rs. 4,730)\n• 19\" Wide LED Monitor (Rs. 11,200)\n• USB Mouse + Keyboard (Rs. 2,330)";
    return {
      text:
        "Here is my **Entry / Office & Study Build** (~Rs. 49,980 – Rs. 65,000 range depending on casing & extras):\n\n" +
        "• **CPU:** Intel Core i5 4th Gen (e.g. 4440) — **Rs. 8,350**\n" +
        "• **Motherboard:** H81 DDR3 On-Board — **Rs. 8,550**\n" +
        "• **RAM:** 8 GB DDR3 PC — **Rs. 6,950**\n" +
        "• **SSD:** 128 GB SSD — **Rs. 7,900**\n" +
        "• **PSU:** 450W–500W PSU — **Rs. 4,730**\n" +
        "• **Monitor:** 19\" Wide LED — **Rs. 11,200**\n" +
        "• **Peripherals:** USB Mouse OP-10 + PS2/USB Keyboard — **Rs. 2,330+**\n\n" +
        "Workshop assembly & 24h stress testing can be added for Rs. 6,500 (or Rs. 1,500 per component fitting). Want me to tweak any part?",
      actions: [
        { label: "Send Build Quote on WhatsApp", href: buildWhatsAppUrl(waText), external: true, variant: "whatsapp" },
        { label: "Browse Aqua PC Parts", href: AQUA_PC_PARTS_URL, external: true, variant: "primary" },
      ],
    };
  }

  if (isHigh) {
    const waText =
      "Hi Aqua PC Solutions! Rose recommended the High-FPS RTX Gaming & Creator Build (~Rs. 251,050 est.). Could you confirm availability?\n• AMD Ryzen 5 5600X (Rs. 52,900)\n• AMD B550 M.2 Board (Rs. 23,550)\n• RTX 3060 Ti 8GB (Rs. 108,500)\n• 2x 8GB DDR4 PC RAM (Rs. 31,100)\n• 256GB NVMe + 1TB HDD (Rs. 26,550)\n• 750W PSU (Rs. 8,400)";
    return {
      text:
        "Here is my **High-FPS RTX Gaming & Creator Build** (~Rs. 251,050 core parts):\n\n" +
        "• **CPU:** AMD Ryzen 5 5600X — **Rs. 52,900**\n" +
        "• **Motherboard:** AMD B550 M.2 Board — **Rs. 23,550**\n" +
        "• **GPU:** NVIDIA RTX 3060 Ti 8GB — **Rs. 108,500**\n" +
        "• **RAM:** 2× 8 GB DDR4 PC (16GB Dual-Channel) — **Rs. 31,100**\n" +
        "• **Storage:** 256 GB M.2 NVMe (Rs. 13,450) + 1TB HDD (Rs. 13,100) — **Rs. 26,550**\n" +
        "• **PSU:** 750W Power Supply — **Rs. 8,400**\n\n" +
        "Every component includes our **06-Month Testing Warranty** and full 24-hour stability burn-in at our Embilipitiya workshop.",
      actions: [
        { label: "Send Build Quote on WhatsApp", href: buildWhatsAppUrl(waText), external: true, variant: "whatsapp" },
        { label: "Browse VGA Cards", href: getAquaPcPartsUrl("vga-cards"), external: true, variant: "primary" },
      ],
    };
  }

  // Default: 1080p Esports Gaming Build (~Rs. 115k - 145k)
  const waText =
    "Hi Aqua PC Solutions! Rose recommended the 1080p Esports Gaming Build (~Rs. 132,050 est.). Could you confirm stock?\n• AMD Ryzen 5 3600 (Rs. 20,250)\n• AMD B450 Board (Rs. 19,550)\n• GTX 1660 Super 6GB (Rs. 57,500)\n• 8GB DDR4 PC RAM (Rs. 15,550)\n• 256GB M.2 NVMe SSD (Rs. 13,450)\n• 600W PSU (Rs. 5,800)";
  return {
    text:
      "Here is my **1080p Esports Gaming Build** (~Rs. 132,050 core components):\n\n" +
      "• **CPU:** AMD Ryzen 5 3600 — **Rs. 20,250**\n" +
      "• **Motherboard:** AMD B450 Board — **Rs. 19,550**\n" +
      "• **GPU:** GTX 1660 Super 6GB — **Rs. 57,500**\n" +
      "• **RAM:** 8 GB DDR4 PC — **Rs. 15,550** *(add a 2nd stick for 16GB dual-channel)*\n" +
      "• **Storage:** 256 GB M.2 NVMe SSD — **Rs. 13,450**\n" +
      "• **PSU:** 600W Power Supply — **Rs. 5,800**\n\n" +
      "Tell me your target budget (e.g. *\"build under 80k\"* or *\"RTX build\"*) if you'd like another tier!",
    actions: [
      { label: "Send Build Quote on WhatsApp", href: buildWhatsAppUrl(waText), external: true, variant: "whatsapp" },
      { label: "Open Aqua PC Parts", href: AQUA_PC_PARTS_URL, external: true, variant: "primary" },
    ],
  };
}

function generateRoseReply(rawQuery: string): Omit<ChatMessage, "id" | "role" | "timestamp"> {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // 1. Greeting
  if (/^(hi|hello|hey|ayubowan|good\s*(morning|afternoon|evening)|rose\??)$/i.test(lower)) {
    return {
      text:
        `Hi! I'm **Rose**, your AI helper at **${SITE_NAME}**.\n\n` +
        `I can search all **${TOTAL_SHOP_ITEMS} parts & brand-new peripherals** with live LKR prices, design a custom PC build for your budget, or help diagnose PC issues. What are you looking for today?`,
      actions: [
        { label: "Open Aqua PC Parts Store", href: AQUA_PC_PARTS_URL, external: true, variant: "primary" },
      ],
    };
  }

  // 2. Combined Popular GPU & CPU quick query
  if (lower.includes("rtx") && lower.includes("ryzen")) {
    const picks = [
      ...searchCatalogParts("rtx", 3),
      ...searchCatalogParts("ryzen", 3),
    ];
    return {
      text:
        `Here are popular **NVIDIA RTX Graphics Cards** and **AMD Ryzen Processors** from our **${TOTAL_SHOP_ITEMS}-item** catalog (06-Month Testing Warranty included):`,
      parts: picks.map(toMatchedCard),
      actions: [
        { label: "Browse All Parts", href: AQUA_PC_PARTS_URL, external: true, variant: "primary" },
      ],
    };
  }

  // 3. Brand new mice & keyboards quick query
  if (lower.includes("mice") && lower.includes("keyboard")) {
    const picks = [
      ...searchCatalogParts("mouse brand new", 3),
      ...searchCatalogParts("keyboard brand new", 3),
    ];
    return {
      text: "Here are our **Brand-New Peripherals & Audio** highlights (all priced transparently with Rs. 750 retail markup):",
      parts: picks.map(toMatchedCard),
      actions: [
        { label: "View All Peripherals & Audio", href: getAquaPcPartsUrl("peripherals"), external: true, variant: "primary" },
      ],
    };
  }

  // 4. Custom PC Build Recommender
  if (/\b(build|rig|gaming pc|office pc|pc quote|configure|setup)\b/.test(lower)) {
    return createBuildResponse(lower);
  }

  // 5. Repair, troubleshooting & service rates
  if (
    /\b(repair|fix|broken|no boot|no display|black screen|beep|overheat|overheating|hot|thermal|paste|liquid cool|solder|micro.?solder|bios|troubleshoot|service|diagnostic|rate|pricing|fee)\b/.test(
      lower
    )
  ) {
    const symptomsTip = /\b(no boot|no display|black screen|beep|overheat|hot)\b/.test(lower)
      ? "**Quick Diagnostic Tip:**\n• *No Display / Boot Loop:* Try reseating RAM sticks one at a time, check 24-pin/8-pin PSU connectors, and clear CMOS.\n• *Overheating / Shutoffs:* Old dry thermal paste or clogged heatsink fins cause throttling — our thermal repaste & ultrasonic cleaning restores safe temps.\n\n"
      : "";
    return {
      text:
        symptomsTip +
        "**Workshop Service Rates (Embilipitiya Lab):**\n" +
        "• **Hardware Diagnostics & Bench Test:** **Rs. 1,500** *(waived when you proceed with repair)*\n" +
        "• **Deep Thermal & Cooling Service (Repaste + Cleaning):** **Rs. 3,500**\n" +
        "• **Custom Rig Assembly & 24h Stress Test:** **Rs. 6,500**\n" +
        "• **Board-Level Micro-Soldering Repair:** Starting from **Rs. 4,500**\n" +
        "• **Single Component Fitting (Shop Add-on):** **Rs. 1,500**",
      actions: [
        {
          label: "Book Repair on WhatsApp",
          href: buildWhatsAppUrl(`Hi ${SITE_NAME}, Rose helped me check repair services. Issue: `),
          external: true,
          variant: "whatsapp",
        },
        { label: "View Full Services", href: "/services", variant: "primary" },
      ],
    };
  }

  // 6. Warranty, delivery, workshop hours, founder, contact
  if (
    /\b(warranty|guarant|deliver|delivery|courier|ship|hour|open|time|close|location|where|address|embilipitiya|founder|thinul|phone|number|contact)\b/.test(
      lower
    )
  ) {
    return {
      text:
        `**${SITE_NAME} — Store & Policy Guide:**\n` +
        `• **Warranty:** **06-Month Testing Warranty** on tested hardware + 24-hour stability verification before dispatch.\n` +
        `• **Delivery & Pickup:** Island-wide safe ESD-packed courier delivery, or direct pickup in **${SITE_LOCATION}**.\n` +
        `• **Workshop Hours:** Mon–Fri **${SITE_HOURS.weekdays}** · Sat **${SITE_HOURS.saturday}** · Online **${SITE_HOURS.online}**.\n` +
        `• **Founder & Hotline:** **${SITE_FOUNDER}** · **${SITE_PHONE_DISPLAY}**`,
      actions: [
        {
          label: "Chat on WhatsApp",
          href: buildWhatsAppUrl(`Hi ${SITE_NAME}, I'd like to confirm warranty/delivery details.`),
          external: true,
          variant: "whatsapp",
        },
        { label: "Contact & Workshop Page", href: "/contact", variant: "primary" },
      ],
    };
  }

  // 7. Live Catalog Search across all 358 items
  const matches = searchCatalogParts(query, 6);
  if (matches.length > 0) {
    const primarySection = matches[0].sectionId;
    return {
      text: `I found **${matches.length}** matching item${matches.length > 1 ? "s" : ""} from our live catalog (${TOTAL_SHOP_ITEMS} parts total). Click **WhatsApp Order** on any item for instant booking:`,
      parts: matches.map(toMatchedCard),
      actions: [
        {
          label: `Browse ${matches[0].sectionLabel}`,
          href: getAquaPcPartsUrl(primarySection),
          external: true,
          variant: "primary",
        },
      ],
    };
  }

  // 8. Friendly fallback
  return {
    text:
      `I couldn't find an exact match for *"${query}"*, but I can help if you try keywords like:\n` +
      `• **"RTX 3060"** or **"cheapest GPU under 30k"**\n` +
      `• **"Ryzen 5"** or **"H61 motherboard"**\n` +
      `• **"Brand new keyboard"** or **"USB mouse"**\n` +
      `• **"Gaming PC build under 150k"**\n` +
      `• **"No display help"** or **"warranty & delivery"**\n\n` +
      `Or chat directly with our technician desk on WhatsApp!`,
    actions: [
      {
        label: "Ask Technician on WhatsApp",
        href: buildWhatsAppUrl(`Hi ${SITE_NAME}, I wanted to ask about: ${query}`),
        external: true,
        variant: "whatsapp",
      },
      { label: "Browse All 358+ Parts", href: AQUA_PC_PARTS_URL, external: true, variant: "primary" },
    ],
  };
}

// ── Initial Welcome Message ───────────────────────────────────────────────────
const WELCOME_MESSAGE: ChatMessage = {
  id: "rose-welcome",
  role: "rose",
  text:
    `Hi! I'm **Rose**, the **${SITE_NAME}** AI assistant.\n\n` +
    `Ask me for real-time LKR prices across all **${TOTAL_SHOP_ITEMS} hardware parts & brand-new peripherals**, custom PC build suggestions, or repair rates!`,
  timestamp: "Online",
};

export default function RoseAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const feedRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionCount = useMemo(() => SHOP_SECTIONS.length, []);

  // Load persisted messages & callout preference
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
      if (sessionStorage.getItem(DISMISSED_CALLOUT_KEY) === "1") {
        setShowCallout(false);
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  // Persist messages
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage write errors
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setShowCallout(false);
      const t = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const dismissCallout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCallout(false);
    try {
      sessionStorage.setItem(DISMISSED_CALLOUT_KEY, "1");
    } catch {
      // Ignore
    }
  };

  const resetChat = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsTyping(false);
    setMessages([WELCOME_MESSAGE]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const replyData = generateRoseReply(trimmed);
      const roseMsg: ChatMessage = {
        id: `r-${Date.now()}`,
        role: "rose",
        ...replyData,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, roseMsg]);
      setIsTyping(false);
    }, 360);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Welcome Callout Pill */}
      <AnimatePresence>
        {!isOpen && showCallout && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            transition={{ delay: 1.1, duration: 0.35, ease: EASE_PREMIUM }}
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsOpen(true);
            }}
            className="cursor-pointer hidden sm:flex items-center gap-2.5 pl-3.5 pr-2 py-2 rounded-2xl bg-surface-container-high/95 backdrop-blur-xl border border-rose-400/35 shadow-glass text-left max-w-[260px] hover:border-rose-400/60 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
            <div className="text-[11px] leading-snug text-on-surface">
              <strong className="text-rose-400 font-semibold">Hi, I&apos;m Rose!</strong>{" "}
              <span className="text-on-surface-variant">Need part prices or PC advice?</span>
            </div>
            <button
              type="button"
              onClick={dismissCallout}
              className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
              aria-label="Dismiss Rose AI greeting"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Rose AI Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4, ease: EASE_PREMIUM }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-cyan-500 text-white font-syne text-body-sm font-bold shadow-[0_8px_28px_rgba(244,63,94,0.38)] hover:shadow-[0_12px_34px_rgba(244,63,94,0.52)] transition-all"
        aria-label={isOpen ? "Close Rose AI Helper" : "Open Rose AI Helper"}
        aria-expanded={isOpen}
      >
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[16px]">
            {isOpen ? "close" : "smart_toy"}
          </span>
        </span>
        <span className="hidden sm:inline">{isOpen ? "Close Rose" : "Ask Rose AI"}</span>
      </motion.button>

      {/* Interactive Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            aria-label="Rose AI Hardware & PC Assistant"
            className="fixed bottom-[136px] right-4 sm:right-5 z-[55] w-[min(93vw,420px)] h-[min(72vh,580px)] flex flex-col rounded-2xl bg-surface-container-high/95 backdrop-blur-2xl border border-primary/30 shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <header className="px-4 py-3 bg-gradient-to-r from-rose-500/15 via-surface-container to-primary/15 border-b border-outline-variant/25 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-cyan-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <span className="material-symbols-outlined text-[21px]">auto_awesome</span>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-surface-container-high"
                    title="Online"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-syne text-sm font-bold text-on-surface truncate">
                      Rose
                    </h2>
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 font-mono text-[9px] text-rose-400 uppercase tracking-wider">
                      AI Helper
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-on-surface-variant truncate">
                    {TOTAL_SHOP_ITEMS}+ PARTS · {sectionCount} DEPTS · BUILD &amp; REPAIR
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={resetChat}
                  title="Reset chat"
                  aria-label="Reset conversation"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Rose"
                  aria-label="Close Rose chat"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </header>

            {/* Message Feed */}
            <div
              ref={feedRef}
              className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 scroll-smooth"
            >
              {messages.map((msg) => {
                const isRose = msg.role === "rose";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isRose ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                        isRose
                          ? "bg-surface-container text-on-surface border border-outline-variant/20 rounded-tl-sm"
                          : "bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-tr-sm shadow-sm"
                      }`}
                    >
                      <MessageFormattedText text={msg.text} />

                      {/* Matched Catalog Item Cards */}
                      {msg.parts && msg.parts.length > 0 && (
                        <div className="mt-2.5 space-y-2">
                          {msg.parts.map((part) => (
                            <div
                              key={part.id}
                              className="p-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/25 flex flex-col gap-1.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-semibold text-on-surface text-xs leading-tight break-words">
                                    {part.name}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    <span className="font-mono text-[10px] text-primary">
                                      {part.categoryName}
                                    </span>
                                    {part.specs && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[9px] uppercase">
                                        {part.specs}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-xs text-secondary whitespace-nowrap shrink-0">
                                  {formatPriceLKR(part.price)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/15">
                                <a
                                  href={part.whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne font-bold text-[11px] transition-colors"
                                >
                                  <span>WhatsApp Order</span>
                                  <span className="material-symbols-outlined text-[13px]">
                                    open_in_new
                                  </span>
                                </a>
                                <a
                                  href={part.browseUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container border border-outline-variant/25 hover:border-primary/40 text-on-surface-variant hover:text-primary font-mono text-[10px] transition-colors"
                                >
                                  <span>View Dept</span>
                                  <span className="material-symbols-outlined text-[12px]">
                                    arrow_outward
                                  </span>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {msg.actions.map((act) => (
                            <a
                              key={act.label}
                              href={act.href}
                              target={act.external ? "_blank" : undefined}
                              rel={act.external ? "noopener noreferrer" : undefined}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                                act.variant === "whatsapp"
                                  ? "bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne"
                                  : "bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-mono"
                              }`}
                            >
                              <span>{act.label}</span>
                              <span className="material-symbols-outlined text-[13px]">
                                {act.external ? "open_in_new" : "arrow_forward"}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="mt-1 px-1 font-mono text-[9px] text-outline">
                      {isRose ? `Rose · ${msg.timestamp}` : `You · ${msg.timestamp}`}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start">
                  <div className="px-3.5 py-2 rounded-2xl rounded-tl-sm bg-surface-container border border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:240ms]" />
                    </span>
                    <span className="font-mono text-[11px]">Rose is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions Strip */}
            <div className="px-3 py-2 border-t border-outline-variant/15 bg-surface-container/60 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => sendMessage(chip.query)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-primary/15 border border-outline-variant/25 hover:border-primary/40 font-mono text-[10px] text-on-surface-variant hover:text-primary transition-colors shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-2.5 border-t border-outline-variant/25 bg-surface-container flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Rose about parts, builds, or repairs..."
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs placeholder:text-outline border border-outline-variant/25 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message to Rose"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-cyan-500 disabled:opacity-40 text-white flex items-center justify-center shadow-sm hover:brightness-110 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Lightweight Inline Markdown Formatter (**bold**, *italic*, line breaks) ───
function MessageFormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;
        const segments = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={idx}>
            {segments.map((seg, sIdx) => {
              if (seg.startsWith("**") && seg.endsWith("**")) {
                return <strong key={sIdx}>{seg.slice(2, -2)}</strong>;
              }
              if (seg.startsWith("*") && seg.endsWith("*")) {
                return <em key={sIdx}>{seg.slice(1, -1)}</em>;
              }
              return <React.Fragment key={sIdx}>{seg}</React.Fragment>;
            })}
          </p>
        );
      })}
    </div>
  );
}
