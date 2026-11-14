(function () {
  "use strict";

  const catalog = window.AQUA_PARTS_CATALOG || {};
  const USED = catalog.usedSections || catalog.sections || [];
  const NEW = catalog.brandNewSections || [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const countItems = (secs) =>
    secs.reduce((s, sec) => s + sec.categories.reduce((c, cat) => c + cat.items.length, 0), 0);
  const secCount = (sec) => sec.categories.reduce((c, cat) => c + cat.items.length, 0);

  function minPriceInSection(sec) {
    let min = Infinity;
    if (!sec || !sec.categories) return null;
    sec.categories.forEach((cat) => {
      cat.items.forEach((it) => {
        if (typeof it.price === "number" && Number.isFinite(it.price) && it.price > 0 && it.price < min) {
          min = it.price;
        }
      });
    });
    return Number.isFinite(min) ? min : null;
  }

  function formatLKR(val) {
    if (typeof val !== "number" || !Number.isFinite(val)) return "Live Quote";
    return "Rs. " + Math.round(val).toLocaleString("en-US");
  }

  const TOTAL_USED = catalog.usedTotalItems || countItems(USED);
  const TOTAL_NEW = catalog.brandNewTotalItems || countItems(NEW);
  const TOTAL_DEPTS = USED.length + NEW.length;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // ── Bind catalog numbers ────────────────────────────────────────────────────
  const binds = { "used-count": TOTAL_USED, "new-count": TOTAL_NEW, "dept-count": TOTAL_DEPTS };
  $$("[data-bind]").forEach((el) => {
    const v = binds[el.getAttribute("data-bind")];
    if (v !== undefined) el.textContent = String(v);
  });
  $$("[data-count-bind]").forEach((el) => {
    const v = binds[el.getAttribute("data-count-bind")];
    if (v !== undefined) el.setAttribute("data-count", String(v));
  });

  // ── Theme toggle ────────────────────────────────────────────────────────────
  const themeBtn = $("#theme-toggle-btn");
  const themeIcon = $("#theme-toggle-icon");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (themeIcon) themeIcon.textContent = t === "dark" ? "light_mode" : "dark_mode";
    try { localStorage.setItem("aqua-parts-theme", t); } catch (_) {}
  }
  try {
    const saved = localStorage.getItem("aqua-parts-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
      if (themeIcon) themeIcon.textContent = saved === "dark" ? "light_mode" : "dark_mode";
    }
  } catch (_) {}
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  }

  // ── Main site links / footer ────────────────────────────────────────────────
  const mainBase = (catalog.mainSiteUrl || "https://aquapcsolutions.yyth.workers.dev/").replace(/\/$/, "");
  const mainLink = $("#main-site-link");
  if (mainLink) mainLink.href = mainBase + "/";

  const footerMain = $("#footer-mainsite-links");
  if (footerMain) {
    [
      ["Home — Aqua PC Solutions", ""],
      ["Repairs & Lab Services", "services"],
      ["Service Rates & Pricing", "pricing"],
      ["About & Founder", "about"],
      ["Contact & Book Repair", "contact"],
    ].forEach(([label, path]) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = mainBase + "/" + path;
      a.textContent = label;
      li.appendChild(a);
      footerMain.appendChild(li);
    });
  }

  const footerDept = $("#footer-dept-links");
  if (footerDept) {
    ["vga-cards", "processors", "motherboards", "storage", "monitors"].forEach((id) => {
      const sec = USED.find((s) => s.id === id);
      if (!sec) return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "./used-parts.html?category=" + encodeURIComponent(id);
      a.textContent = sec.label + " (" + secCount(sec) + ")";
      li.appendChild(a);
      footerDept.appendChild(li);
    });
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "./brand-new-parts.html";
    a.textContent = "Brand New Peripherals (" + TOTAL_NEW + ")";
    li.appendChild(a);
    footerDept.appendChild(li);
  }

  const yearEl = $("#footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ── Shared Quote Badge ──────────────────────────────────────────────────────
  try {
    const raw = localStorage.getItem("aqua-parts-quote-v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      const total = Object.values((parsed && parsed.quoteList) || {}).reduce(
        (s, e) => s + (e.quantity || 1),
        0
      );
      const badge = $("#quote-count-badge");
      if (badge) badge.textContent = String(total);
    }
  } catch (_) {}

  // ── Build Flat Search Index for Instant Autocomplete ────────────────────────
  const flatCatalog = [];
  function rebuildFlatCatalog() {
    flatCatalog.length = 0;
    USED.forEach((sec) => {
      sec.categories.forEach((cat) => {
        cat.items.forEach((it) => {
          flatCatalog.push({
            id: it.id,
            name: it.name,
            price: it.price,
            secId: sec.id,
            secLabel: sec.label,
            catName: cat.name,
            isNew: it.condition === "new" || it.specs === "Brand New",
            page: "used-parts.html",
            hay: (it.name + " " + cat.name + " " + sec.label + " " + (it.specs || "")).toLowerCase(),
          });
        });
      });
    });
    NEW.forEach((sec) => {
      sec.categories.forEach((cat) => {
        cat.items.forEach((it) => {
          flatCatalog.push({
            id: it.id,
            name: it.name,
            price: it.price,
            secId: sec.id,
            secLabel: sec.label,
            catName: cat.name,
            isNew: true,
            page: "brand-new-parts.html",
            hay: (it.name + " " + cat.name + " " + sec.label + " " + (it.specs || "")).toLowerCase(),
          });
        });
      });
    });
  }
  rebuildFlatCatalog();

  function searchCatalogItems(rawQuery, limit) {
    const q = (rawQuery || "").trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const matches = [];
    const seenNames = new Set();

    for (let i = 0; i < flatCatalog.length; i++) {
      const entry = flatCatalog[i];
      const allMatch = tokens.every((tk) => entry.hay.includes(tk));
      if (!allMatch) continue;
      const dedupeKey = entry.name.toLowerCase() + "|" + (entry.price || "");
      if (seenNames.has(dedupeKey)) continue;
      seenNames.add(dedupeKey);
      matches.push(entry);
      if (matches.length >= (limit || 6)) break;
    }
    return matches;
  }

  function countMatches(secs, q) {
    let n = 0;
    secs.forEach((sec) =>
      sec.categories.forEach((cat) =>
        cat.items.forEach((it) => {
          const hay = (it.name + " " + (it.specs || "") + " " + cat.name + " " + sec.label).toLowerCase();
          if (hay.includes(q)) n++;
        })
      )
    );
    return n;
  }

  function routeSearch(raw) {
    const trimmed = (raw || "").trim();
    if (!trimmed) return;
    const q = trimmed.toLowerCase();
    const page = countMatches(NEW, q) > countMatches(USED, q) ? "brand-new-parts.html" : "used-parts.html";
    window.location.href = "./" + page + "?q=" + encodeURIComponent(trimmed);
  }

  function renderLiveMatches(container, query) {
    if (!container) return;
    const trimmed = (query || "").trim();
    if (trimmed.length < 2) {
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }
    const hits = searchCatalogItems(trimmed, 6);
    if (hits.length === 0) {
      container.innerHTML =
        '<div class="live-match-empty">' +
        '<span>No exact match for &ldquo;' + escapeHtml(trimmed) + '&rdquo; — ask our bench on WhatsApp!</span>' +
        '<a href="https://wa.me/94788194535?text=' + encodeURIComponent("Hi Aqua PC Parts! Do you have " + trimmed + " in stock?") + '" target="_blank" rel="noopener noreferrer" class="live-match-wa">Ask on WhatsApp →</a>' +
        "</div>";
      container.classList.remove("hidden");
      return;
    }

    container.innerHTML =
      hits
        .map((h) => {
          const href = "./" + h.page + "?category=" + encodeURIComponent(h.secId) + "&q=" + encodeURIComponent(trimmed);
          const badgeClass = h.isNew ? "emerald" : "cyan";
          const badgeText = h.isNew ? "Brand New" : "Used · Grade A";
          return (
            '<a href="' + href + '" class="live-match-row">' +
            '<div class="live-match-main">' +
            '<span class="live-match-name">' + escapeHtml(h.name) + "</span>" +
            '<span class="live-match-meta"><em class="match-pill ' + badgeClass + '">' + badgeText + "</em> · " + escapeHtml(h.secLabel) + "</span>" +
            "</div>" +
            '<div class="live-match-price">' +
            "<strong>" + formatLKR(h.price) + "</strong>" +
            '<span class="material-symbols-outlined">arrow_outward</span>' +
            "</div>" +
            "</a>"
          );
        })
        .join("") +
      '<button type="button" class="live-match-all" data-search-all="' + escapeHtml(trimmed) + '">' +
      "<span>See all catalog matches for &ldquo;" + escapeHtml(trimmed) + "&rdquo;</span>" +
      '<span class="material-symbols-outlined">arrow_forward</span>' +
      "</button>";

    container.classList.remove("hidden");
    const allBtn = container.querySelector("[data-search-all]");
    if (allBtn) {
      allBtn.addEventListener("click", () => routeSearch(trimmed));
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Bind Header Search + Hero Finder Search
  const headerSearchForm = $("#header-search-form");
  const headerSearchInput = $("#global-search-input");
  const headerDropdown = $("#header-search-dropdown");

  if (headerSearchForm && headerSearchInput) {
    headerSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      routeSearch(headerSearchInput.value);
    });
    headerSearchInput.addEventListener("input", () => {
      renderLiveMatches(headerDropdown, headerSearchInput.value);
    });
  }

  const heroFinderForm = $("#hero-finder-form");
  const heroFinderInput = $("#hero-finder-input");
  const heroFinderResults = $("#hero-finder-results");

  if (heroFinderForm && heroFinderInput) {
    heroFinderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      routeSearch(heroFinderInput.value);
    });
    heroFinderInput.addEventListener("input", () => {
      renderLiveMatches(heroFinderResults, heroFinderInput.value);
    });
  }

  document.addEventListener("click", (e) => {
    if (headerDropdown && !headerSearchForm.contains(e.target)) {
      headerDropdown.classList.add("hidden");
    }
    if (heroFinderResults && heroFinderForm && !heroFinderForm.parentElement.contains(e.target)) {
      heroFinderResults.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !["INPUT", "TEXTAREA", "SELECT"].includes((document.activeElement || {}).tagName)
    ) {
      e.preventDefault();
      const targetInput = heroFinderInput || headerSearchInput;
      if (targetInput) targetInput.focus();
    } else if (e.key === "Escape") {
      if (headerDropdown) headerDropdown.classList.add("hidden");
      if (heroFinderResults) heroFinderResults.classList.add("hidden");
    }
  });

  // ── Scroll progress + header state ──────────────────────────────────────────
  const progress = $("#scroll-progress");
  const header = $("#site-header");
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    if (header) header.classList.toggle("is-scrolled", h.scrollTop > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ── Reveal on scroll ────────────────────────────────────────────────────────
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ── Animated counters ───────────────────────────────────────────────────────
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    if (!Number.isFinite(target)) return;
    const suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = Math.round(target).toLocaleString("en-US") + suffix;
      return;
    }
    const dur = 1400;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animateCount(en.target);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  // ── Rotating headline phrase ────────────────────────────────────────────────
  const words = [
    "1080p Gaming Rig.",
    "Home Office Setup.",
    "RTX Creator Workstation.",
    "Frameless IPS Display.",
    "NVMe Speed Upgrade.",
  ];
  const rotator = $("#rotator-word");
  if (rotator && !reduceMotion) {
    let idx = 0;
    setInterval(() => {
      rotator.classList.add("out");
      setTimeout(() => {
        idx = (idx + 1) % words.length;
        rotator.textContent = words[idx];
        rotator.classList.remove("out");
        rotator.classList.add("in-start");
        requestAnimationFrame(() =>
          requestAnimationFrame(() => rotator.classList.remove("in-start"))
        );
      }, 340);
    }, 2900);
  }

  // ── Marquee duplicate for seamless loop ─────────────────────────────────────
  const track = $("#marquee-track");
  if (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HERO INTERACTIVE RIG & SCHEMATIC INSPECTOR
  // ═══════════════════════════════════════════════════════════════════════════
  const RIG_NODES = [
    {
      code: "BENCH-INSPECTOR // NODE 01: GRAPHICS",
      telemetry: "63°C FurMark 24h Pass",
      photo: "./assets/hero-rig.jpg",
      badge: "GRADE-A BENCH TESTED",
      badgeClass: "cyan",
      count: "34 models",
      title: "NVIDIA RTX, GTX & AMD Radeon GPUs",
      desc: "Stress-tested for 24h in FurMark & 3DMark. Thermal paste refreshed, axial fans silent, HDMI & DisplayPort outputs verified.",
      price: "Rs. 4,450",
      link: "./used-parts.html?category=vga-cards",
      linkText: "Browse VGA Cards",
      svg:
        '<svg viewBox="0 0 180 100" fill="none" class="node-schematic-svg">' +
        '<rect x="8" y="18" width="164" height="62" rx="10" stroke="#38bdf8" stroke-width="2" fill="rgba(56,189,248,0.06)"/>' +
        '<path d="M22 80v9h46v-9M76 80v9h18v-9" stroke="#f59e0b" stroke-width="2"/>' +
        '<g class="svg-spin-fan" style="transform-origin: 54px 49px">' +
        '<circle cx="54" cy="49" r="21" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="5 3"/>' +
        '<circle cx="54" cy="49" r="6" fill="#38bdf8"/>' +
        '<path d="M54 28v15M54 55v15M33 49h15M60 49h15M39 34l10 10M59 54l10 10M69 34L59 44M49 54L39 64" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>' +
        "</g>" +
        '<g class="svg-spin-fan" style="transform-origin: 124px 49px">' +
        '<circle cx="124" cy="49" r="21" stroke="#10b981" stroke-width="1.6" stroke-dasharray="5 3"/>' +
        '<circle cx="124" cy="49" r="6" fill="#10b981"/>' +
        '<path d="M124 28v15M124 55v15M103 49h15M130 49h15M109 34l10 10M129 54l10 10M139 34l-10 10M119 54l-10 10" stroke="#10b981" stroke-width="1.6" stroke-linecap="round"/>' +
        "</g>" +
        "</svg>",
    },
    {
      code: "BENCH-INSPECTOR // NODE 02: SILICON & VRM",
      telemetry: "OCCT & Prime95 Verified",
      photo: "./assets/lab-gpu-install.jpg",
      badge: "SOCKET & PIN VERIFIED",
      badgeClass: "cyan",
      count: "79 items",
      title: "Intel Core & AMD Ryzen CPUs + Boards",
      desc: "From budget i3/i5 & H61/H81 combos to Ryzen 5 5600X, Core i5-12400 & B450/B550 motherboards — every RAM slot & PCIe lane tested.",
      price: "Rs. 1,100",
      link: "./used-parts.html?category=processors",
      linkText: "Browse CPUs & Boards",
      svg:
        '<svg viewBox="0 0 180 100" fill="none" class="node-schematic-svg">' +
        '<rect x="46" y="14" width="88" height="72" rx="9" stroke="#38bdf8" stroke-width="2" fill="rgba(56,189,248,0.06)"/>' +
        '<rect x="64" y="28" width="52" height="44" rx="5" stroke="#10b981" stroke-width="1.8" fill="rgba(16,185,129,0.1)"/>' +
        '<path d="M58 6v8M74 6v8M90 6v8M106 6v8M122 6v8M58 86v8M74 86v8M90 86v8M106 86v8M122 86v8" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M36 26h10M36 40h10M36 54h10M36 68h10M134 26h10M134 40h10M134 54h10M134 68h10" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path class="svg-pulse-wave" d="M70 50h10l6-10 8 20 8-14 5 4h13" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>",
    },
    {
      code: "BENCH-INSPECTOR // NODE 03: DISPLAY & NVME",
      telemetry: "100% SMART · Zero Dead Pixels",
      photo: "./assets/rgb-ram-macro.jpg",
      badge: "ZERO BAD SECTORS",
      badgeClass: "amber",
      count: "95 items",
      title: "Frameless IPS Monitors, NVMe & RAM",
      desc: "19\" to 27\" LED/IPS monitors checked for color uniformity, plus 100%-health NVMe M.2 SSDs, SATA SSDs, HDDs, and DDR3/DDR4 memory.",
      price: "Rs. 2,100",
      link: "./used-parts.html?category=monitors",
      linkText: "Browse Displays & Storage",
      svg:
        '<svg viewBox="0 0 180 100" fill="none" class="node-schematic-svg">' +
        '<rect x="18" y="14" width="104" height="62" rx="6" stroke="#38bdf8" stroke-width="2" fill="rgba(56,189,248,0.06)"/>' +
        '<path d="M54 86h32M70 76v10" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>' +
        '<rect x="134" y="20" width="30" height="64" rx="4" stroke="#10b981" stroke-width="1.8" fill="rgba(16,185,129,0.08)"/>' +
        '<rect x="140" y="28" width="18" height="14" rx="2" fill="#10b981" fill-opacity="0.35"/>' +
        '<rect x="140" y="48" width="18" height="14" rx="2" fill="#38bdf8" fill-opacity="0.35"/>' +
        '<path d="M30 58L52 38l18 14 24-22 14 12" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>",
    },
    {
      code: "BENCH-INSPECTOR // NODE 04: FACTORY SEALED",
      telemetry: "100% Sealed Retail Stock",
      photo: "./assets/cooling-loop.jpg",
      badge: "FACTORY-SEALED BRAND NEW",
      badgeClass: "emerald",
      count: "34 SKUs",
      title: "Brand-New Gaming Mice, Keyboards & Audio",
      desc: "Unbox brand-new gaming mice, mechanical-feel & multimedia keyboards, GTX360/W500 combos, 1080p webcams, USB studio mics & sound cards.",
      price: "Rs. 980",
      link: "./brand-new-parts.html",
      linkText: "Open Brand New Store",
      svg:
        '<svg viewBox="0 0 180 100" fill="none" class="node-schematic-svg">' +
        '<rect x="14" y="26" width="96" height="52" rx="7" stroke="#10b981" stroke-width="2" fill="rgba(16,185,129,0.07)"/>' +
        '<rect x="24" y="36" width="12" height="10" rx="2" stroke="#10b981" stroke-width="1.5"/>' +
        '<rect x="40" y="36" width="12" height="10" rx="2" stroke="#10b981" stroke-width="1.5"/>' +
        '<rect x="56" y="36" width="12" height="10" rx="2" stroke="#10b981" stroke-width="1.5"/>' +
        '<rect x="72" y="36" width="26" height="10" rx="2" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<rect x="32" y="54" width="60" height="12" rx="3" fill="#10b981" fill-opacity="0.28" stroke="#10b981" stroke-width="1.5"/>' +
        '<rect x="124" y="20" width="40" height="62" rx="20" stroke="#38bdf8" stroke-width="2" fill="rgba(56,189,248,0.07)"/>' +
        '<line x1="144" y1="28" x2="144" y2="42" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>' +
        "</svg>",
    },
  ];

  const rigInspector = $("#rig-inspector");
  const rigViewport = $("#rig-viewport");
  const rigPhoto = $("#rig-main-photo");
  const rigBezelCode = $("#rig-bezel-code");
  const rigBezelTelemetry = $("#rig-bezel-telemetry");
  const rigSchematicSvg = $("#rig-schematic-svg");
  const rigNodeBadge = $("#rig-node-badge");
  const rigNodeCount = $("#rig-node-count");
  const rigNodeTitle = $("#rig-node-title");
  const rigNodeDesc = $("#rig-node-desc");
  const rigNodePrice = $("#rig-node-price");
  const rigNodeLink = $("#rig-node-link");
  const rigPins = $$(".rig-pin");
  const rigDockBtns = $$(".rig-dock-btn");

  let activeRigIndex = 0;
  let rigTimer = null;
  let rigHovered = false;

  function setRigNode(index) {
    const node = RIG_NODES[index] || RIG_NODES[0];
    activeRigIndex = index;

    rigPins.forEach((pin, i) => pin.classList.toggle("active", i === index));
    rigDockBtns.forEach((btn, i) => {
      const on = i === index;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", String(on));
    });

    if (rigBezelCode) rigBezelCode.textContent = node.code;
    if (rigBezelTelemetry) {
      rigBezelTelemetry.innerHTML =
        '<span class="material-symbols-outlined">verified</span><span>' + escapeHtml(node.telemetry) + "</span>";
    }
    if (rigPhoto && rigPhoto.getAttribute("src") !== node.photo) {
      rigPhoto.classList.add("switching");
      setTimeout(() => {
        rigPhoto.src = node.photo;
        rigPhoto.onload = () => rigPhoto.classList.remove("switching");
        setTimeout(() => rigPhoto.classList.remove("switching"), 120);
      }, 140);
    }
    if (rigSchematicSvg) rigSchematicSvg.innerHTML = node.svg;
    if (rigNodeBadge) {
      rigNodeBadge.textContent = node.badge;
      rigNodeBadge.className = "schematic-badge " + node.badgeClass;
    }
    if (rigNodeCount) rigNodeCount.textContent = node.count;
    if (rigNodeTitle) rigNodeTitle.textContent = node.title;
    if (rigNodeDesc) rigNodeDesc.textContent = node.desc;
    if (rigNodePrice) rigNodePrice.textContent = node.price;
    if (rigNodeLink) {
      rigNodeLink.href = node.link;
      rigNodeLink.innerHTML =
        "<span>" + escapeHtml(node.linkText) + '</span><span class="material-symbols-outlined">arrow_outward</span>';
    }
  }

  function startRigAutoCycle() {
    if (reduceMotion) return;
    clearInterval(rigTimer);
    rigTimer = setInterval(() => {
      if (!rigHovered && !document.hidden) {
        setRigNode((activeRigIndex + 1) % RIG_NODES.length);
      }
    }, 5200);
  }

  rigPins.forEach((pin) => {
    pin.addEventListener("click", () => {
      const idx = parseInt(pin.getAttribute("data-rig-node"), 10) || 0;
      setRigNode(idx);
      startRigAutoCycle();
    });
  });

  rigDockBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-rig-node"), 10) || 0;
      setRigNode(idx);
      startRigAutoCycle();
    });
  });

  if (rigInspector) {
    rigInspector.addEventListener("pointerenter", () => { rigHovered = true; });
    rigInspector.addEventListener("pointerleave", () => {
      rigHovered = false;
      if (rigViewport) {
        rigViewport.style.transform = "";
      }
    });
    if (rigViewport && !reduceMotion) {
      rigViewport.addEventListener("pointermove", (e) => {
        const r = rigViewport.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rigViewport.style.transform =
          "perspective(1100px) rotateX(" + (-py * 4.5).toFixed(2) + "deg) rotateY(" + (px * 5.5).toFixed(2) + "deg)";
      });
    }
    setRigNode(0);
    startRigAutoCycle();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE UPGRADE PATHFINDER (PERSONA WORKBENCH)
  // ═══════════════════════════════════════════════════════════════════════════
  const PERSONAS = {
    gaming: {
      tag: "BUILD PROFILE 01 · SMOOTH 1080P & 1440P GAMING",
      title: "High-Frame-Rate Gaming Upgrade Path",
      desc: "Prioritize a 24h FurMark-tested graphics card paired with dual-channel 16GB RAM, a reliable 80+ power supply, and responsive gaming peripherals.",
      waText: "Hi Aqua PC Parts! I want to upgrade my PC for 1080p/1440p gaming. Can you recommend available GPU + PSU + RAM options?",
      metrics: [
        { label: "1080p Esports & AAA FPS", val: 94, color: "#38bdf8" },
        { label: "Thermal & PSU Headroom", val: 90, color: "#10b981" },
        { label: "Price-to-Performance", val: 96, color: "#f59e0b" },
      ],
      picks: [
        {
          dept: "Graphics Cards (VGA)",
          badge: "Used · 06-Mo Warranty",
          models: "GTX 1660 Super, RTX 2060, RTX 3060 Ti, RX 580 8GB",
          price: "From Rs. 4,450",
          href: "./used-parts.html?category=vga-cards",
        },
        {
          dept: "Intel & Ryzen Processors",
          badge: "Used · Socket Verified",
          models: "Core i5 10th/12th Gen, Ryzen 5 3600 / 5600X",
          price: "From Rs. 1,100",
          href: "./used-parts.html?category=processors",
        },
        {
          dept: "80+ Power Supplies",
          badge: "Used · Load Tested",
          models: "500W, 600W, 650W & 750W 80+ Bronze/Gold PSUs",
          price: "From Rs. 2,900",
          href: "./used-parts.html?category=power-cooling",
        },
        {
          dept: "Brand-New Gaming Combos & Mice",
          badge: "Brand New · Sealed",
          models: "GTX360 RGB Combo, Banda V2/V3 Keyboard, G102/X1 Mouse",
          price: "From Rs. 1,020",
          href: "./brand-new-parts.html?category=bn-combos",
        },
      ],
    },
    office: {
      tag: "BUILD PROFILE 02 · HOME OFFICE, STUDY & CODING",
      title: "Quiet, Eye-Friendly Everyday Productivity",
      desc: "Upgrade to a crisp frameless 22\" or 24\" IPS monitor, a fast SATA/NVMe SSD boot drive, a comfortable keyboard, and an HD webcam for calls.",
      waText: "Hi Aqua PC Parts! I'm setting up a Home Office / Study PC and need recommendations for a monitor, SSD, and peripherals.",
      metrics: [
        { label: "Boot & App Launch Speed", val: 95, color: "#10b981" },
        { label: "IPS Eye Comfort & Clarity", val: 92, color: "#38bdf8" },
        { label: "Low-Budget Efficiency", val: 98, color: "#f59e0b" },
      ],
      picks: [
        {
          dept: "Frameless IPS & LED Monitors",
          badge: "Used · Zero Dead Pixels",
          models: "19\", 22\" & 24\" FHD IPS Frameless Dell, HP, Samsung",
          price: "From Rs. 8,500",
          href: "./used-parts.html?category=monitors",
        },
        {
          dept: "SSD & NVMe Boot Drives",
          badge: "Used · 100% SMART Health",
          models: "128GB, 256GB & 512GB SATA / M.2 NVMe SSDs",
          price: "From Rs. 5,300",
          href: "./used-parts.html?category=storage",
        },
        {
          dept: "Brand-New Keyboards & Mice",
          badge: "Brand New · Sealed",
          models: "Dell MS111, Three-Language USB Keyboard, Wireless W500",
          price: "From Rs. 1,020",
          href: "./brand-new-parts.html?category=bn-keyboards",
        },
        {
          dept: "Brand-New HD Webcams",
          badge: "Brand New · Plug & Play",
          models: "720p USB+Sound & 1080p Full HD Web Cameras",
          price: "From Rs. 1,940",
          href: "./brand-new-parts.html?category=bn-webcams",
        },
      ],
    },
    creator: {
      tag: "BUILD PROFILE 03 · VIDEO EDITING, 3D & STREAMING",
      title: "Creator, Premiere Pro & Streaming Workstation",
      desc: "Combine NVIDIA RTX CUDA acceleration, multi-core processors, high-capacity NVMe + HDD storage, and a dedicated USB microphone + sound interface.",
      waText: "Hi Aqua PC Parts! I need parts for Video Editing / 3D / Streaming. Can you help me put together a quote?",
      metrics: [
        { label: "CUDA & Timeline Scrubbing", val: 93, color: "#38bdf8" },
        { label: "Multi-Core Render Stability", val: 91, color: "#10b981" },
        { label: "Scratch Disk & Audio I/O", val: 94, color: "#f59e0b" },
      ],
      picks: [
        {
          dept: "RTX & High-VRAM Graphics",
          badge: "Used · 24h Stress Tested",
          models: "RTX 2060, RTX 3060 12GB, RTX 3060 Ti, GTX 1660 Ti",
          price: "From Rs. 54,500",
          href: "./used-parts.html?category=vga-cards",
        },
        {
          dept: "Motherboards & Multi-Core CPUs",
          badge: "Used · VRM Verified",
          models: "B450 / B550 / Z-Series Boards + Core i7 & Ryzen 5/7",
          price: "From Rs. 5,300",
          href: "./used-parts.html?category=motherboards",
        },
        {
          dept: "NVMe SSDs + 1TB/2TB HDDs",
          badge: "Used · 100% Health",
          models: "512GB/1TB NVMe M.2 + 1TB/2TB Desktop Hard Drives",
          price: "From Rs. 2,500",
          href: "./used-parts.html?category=storage",
        },
        {
          dept: "USB Studio Mic & 7.1 Sound Cards",
          badge: "Brand New · Sealed",
          models: "Tucci MK-100 USB Mic + 7.1 HiFi / PCIe Sound Cards",
          price: "From Rs. 980",
          href: "./brand-new-parts.html?category=bn-microphones",
        },
      ],
    },
    budget: {
      tag: "BUILD PROFILE 04 · UNDER RS. 10,000 INSTANT REVIVAL",
      title: "Make an Older Desktop or Laptop Feel Brand New",
      desc: "You don't need a new PC to fix slow boot times. A tested SSD, an extra 8GB stick of RAM, fresh thermal cooling, or a new mouse & keyboard combo transforms daily speed.",
      waText: "Hi Aqua PC Parts! I want to speed up my current PC on a budget under Rs. 10,000. What SSD or RAM do you recommend?",
      metrics: [
        { label: "Windows Startup Speedup", val: 97, color: "#10b981" },
        { label: "Rupee-for-Rupee Value", val: 99, color: "#f59e0b" },
        { label: "Plug-and-Play Simplicity", val: 95, color: "#38bdf8" },
      ],
      picks: [
        {
          dept: "DDR3 & DDR4 RAM Modules",
          badge: "Used · MemTest86 Passed",
          models: "4GB & 8GB DDR3 / DDR4 Desktop & Laptop RAM",
          price: "From Rs. 2,100",
          href: "./used-parts.html?category=memory",
        },
        {
          dept: "128GB & 256GB SSDs + HDDs",
          badge: "Used · 100% Health",
          models: "Fast SATA & M.2 SSDs + 500GB HDDs",
          price: "From Rs. 2,500",
          href: "./used-parts.html?category=storage",
        },
        {
          dept: "CPU Coolers, Fans & Cables",
          badge: "Used · Workshop Tested",
          models: "Intel/AMD Coolers, RGB Case Fans, Display & Power Cables",
          price: "From Rs. 250",
          href: "./used-parts.html?category=cooling",
        },
        {
          dept: "Brand-New Mice & Keyboards",
          badge: "Brand New · Sealed",
          models: "Jedel 220 Mouse (Rs. 1,020), PS2/USB Keyboards (Rs. 1,310+)",
          price: "From Rs. 1,020",
          href: "./brand-new-parts.html?category=bn-mice",
        },
      ],
    },
  };

  const advisorStage = $("#advisor-stage");
  const personaBtns = $$("[data-persona]");

  function renderPersona(key) {
    if (!advisorStage) return;
    const p = PERSONAS[key] || PERSONAS.gaming;
    const waHref = "https://wa.me/94788194535?text=" + encodeURIComponent(p.waText);

    advisorStage.innerHTML =
      '<div class="advisor-blueprint">' +
      '<div class="blueprint-summary">' +
      '<span class="blueprint-kicker">' + escapeHtml(p.tag) + "</span>" +
      "<h3>" + escapeHtml(p.title) + "</h3>" +
      "<p>" + escapeHtml(p.desc) + "</p>" +
      '<div class="blueprint-bars">' +
      p.metrics
        .map(
          (m) =>
            '<div class="bp-bar-row">' +
            '<div class="bp-bar-label"><span>' + escapeHtml(m.label) + "</span><strong>" + m.val + "%</strong></div>" +
            '<div class="bp-bar-track"><span class="bp-bar-fill" style="width:' + m.val + "%; background:" + m.color + '"></span></div>' +
            "</div>"
        )
        .join("") +
      "</div>" +
      '<a href="' + waHref + '" target="_blank" rel="noopener noreferrer" class="lp-btn lp-btn-ghost blueprint-wa-btn">' +
      '<span class="material-symbols-outlined">chat</span>' +
      "<span>Ask Technician for This Setup</span>" +
      "</a>" +
      "</div>" +
      '<div class="blueprint-picks-grid">' +
      p.picks
        .map(
          (pk, idx) =>
            '<a href="' + pk.href + '" class="bp-pick-card spotlight">' +
            '<div class="bp-pick-top">' +
            '<span class="bp-pick-num">0' + (idx + 1) + "</span>" +
            '<span class="bp-pick-badge">' + escapeHtml(pk.badge) + "</span>" +
            "</div>" +
            "<h4>" + escapeHtml(pk.dept) + "</h4>" +
            "<p>" + escapeHtml(pk.models) + "</p>" +
            '<div class="bp-pick-foot">' +
            "<strong>" + escapeHtml(pk.price) + "</strong>" +
            '<span class="bp-pick-arrow">Open Department <span class="material-symbols-outlined">arrow_outward</span></span>' +
            "</div>" +
            "</a>"
        )
        .join("") +
      "</div>" +
      "</div>";

    bindInteractive(advisorStage);
  }

  personaBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      personaBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      renderPersona(btn.getAttribute("data-persona"));
    });
  });
  renderPersona("gaming");

  // ═══════════════════════════════════════════════════════════════════════════
  // BESPOKE ILLUSTRATED DEPARTMENT EXPLORER
  // ═══════════════════════════════════════════════════════════════════════════
  const DEPT_SVGS = {
    monitors:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="6" y="4" width="44" height="28" rx="4" stroke="currentColor" stroke-width="2"/><path d="M18 39h20M28 32v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="art-accent" d="M14 24l9-9 7 6 11-10" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "vga-cards":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="4" y="10" width="48" height="24" rx="5" stroke="currentColor" stroke-width="2"/><circle class="art-spin" style="transform-origin:19px 22px" cx="19" cy="22" r="7.5" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 2"/><circle class="art-spin" style="transform-origin:37px 22px" cx="37" cy="22" r="7.5" stroke="#10b981" stroke-width="1.8" stroke-dasharray="3 2"/><path d="M12 34v4h16v-4" stroke="#f59e0b" stroke-width="1.8"/></svg>',
    processors:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="14" y="8" width="28" height="28" rx="5" stroke="currentColor" stroke-width="2"/><rect class="art-accent" x="21" y="15" width="14" height="14" rx="2.5" stroke="#38bdf8" stroke-width="1.8"/><path d="M20 3v5M28 3v5M36 3v5M20 36v5M28 36v5M36 36v5M9 14h5M9 22h5M9 30h5M42 14h5M42 22h5M42 30h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    motherboards:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="8" y="4" width="40" height="36" rx="4" stroke="currentColor" stroke-width="2"/><rect x="15" y="10" width="14" height="14" rx="2" stroke="#38bdf8" stroke-width="1.8"/><path d="M34 10v14M39 10v14M15 30h24M15 35h18" stroke="#10b981" stroke-width="1.8" stroke-linecap="round"/></svg>',
    storage:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="8" y="13" width="40" height="18" rx="4" stroke="currentColor" stroke-width="2"/><rect x="14" y="18" width="9" height="8" rx="1.5" stroke="#38bdf8" stroke-width="1.6"/><rect x="27" y="18" width="9" height="8" rx="1.5" stroke="#10b981" stroke-width="1.6"/><circle cx="42" cy="22" r="2" fill="#f59e0b"/></svg>',
    memory:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="6" y="12" width="44" height="18" rx="3" stroke="currentColor" stroke-width="2"/><path d="M14 18v6M22 18v6M30 18v6M38 18v6" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/><path d="M12 30v4h32v-4" stroke="#f59e0b" stroke-width="1.6"/></svg>',
    "power-cooling":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="8" y="6" width="40" height="32" rx="5" stroke="currentColor" stroke-width="2"/><circle class="art-spin" style="transform-origin:24px 22px" cx="24" cy="22" r="10" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 2"/><path d="M40 14l-4 7h5l-3 7" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cooling:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><circle cx="28" cy="22" r="16" stroke="currentColor" stroke-width="2"/><g class="art-spin" style="transform-origin:28px 22px"><circle cx="28" cy="22" r="4" fill="#38bdf8"/><path d="M28 9v9M28 26v9M15 22h9M32 22h9" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></g></svg>',
    "cables-cases":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="14" y="5" width="28" height="34" rx="4" stroke="currentColor" stroke-width="2"/><line x1="20" y1="11" x2="28" y2="11" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="11" r="1.8" fill="#10b981"/><rect x="20" y="17" width="16" height="16" rx="2" stroke="#38bdf8" stroke-width="1.5"/></svg>',
    peripherals:
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="6" y="14" width="30" height="18" rx="4" stroke="currentColor" stroke-width="2"/><rect x="40" y="12" width="11" height="20" rx="5.5" stroke="#10b981" stroke-width="2"/><path d="M12 20h18M14 26h14" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "bn-mice":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="17" y="5" width="22" height="34" rx="11" stroke="currentColor" stroke-width="2"/><line x1="28" y1="11" x2="28" y2="18" stroke="#10b981" stroke-width="2.4" stroke-linecap="round"/><path d="M18 19h20" stroke="currentColor" stroke-width="1.5"/></svg>',
    "bn-combos":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="4" y="13" width="32" height="20" rx="4" stroke="currentColor" stroke-width="2"/><rect x="40" y="11" width="12" height="22" rx="6" stroke="#10b981" stroke-width="2"/><path d="M10 20h20M12 26h16" stroke="#10b981" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "bn-keyboards":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="5" y="10" width="46" height="24" rx="5" stroke="currentColor" stroke-width="2"/><path d="M12 17h5M21 17h5M30 17h5M39 17h5M16 26h24" stroke="#10b981" stroke-width="2.2" stroke-linecap="round"/></svg>',
    "bn-webcams":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><circle cx="28" cy="19" r="12" stroke="currentColor" stroke-width="2"/><circle cx="28" cy="19" r="5" stroke="#10b981" stroke-width="2"/><path d="M16 36c4-4 20-4 24 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    "bn-microphones":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="22" y="6" width="12" height="20" rx="6" stroke="currentColor" stroke-width="2"/><path d="M17 19a11 11 0 0022 0M28 30v8M21 38h14" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>',
    "bn-sound-cards":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><rect x="8" y="11" width="40" height="22" rx="4" stroke="currentColor" stroke-width="2"/><path d="M16 25v-6M22 28V16M28 24v-4M34 29V15M40 25v-6" stroke="#10b981" stroke-width="2.2" stroke-linecap="round"/></svg>',
    "bn-components":
      '<svg viewBox="0 0 56 44" fill="none" class="dept-art-svg"><path d="M28 5L46 14v16L28 39 10 30V14L28 5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 14l18 9 18-9M28 23v16" stroke="#10b981" stroke-width="1.8"/></svg>',
  };

  const deptGrid = $("#dept-grid");
  const tabs = $$("[data-dept-tab]");
  const indicator = $("#dept-indicator");

  function moveIndicator(btn) {
    if (!indicator || !btn) return;
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = "translateX(" + btn.offsetLeft + "px)";
    indicator.classList.toggle("emerald", btn.getAttribute("data-dept-tab") === "new");
  }

  function renderDepts(kind) {
    if (!deptGrid) return;
    const secs = kind === "new" ? NEW : USED;
    const page = kind === "new" ? "brand-new-parts.html" : "used-parts.html";
    deptGrid.classList.toggle("is-new", kind === "new");
    deptGrid.innerHTML = "";
    secs.forEach((sec, i) => {
      const a = document.createElement("a");
      a.className = "lp-dept spotlight tilt";
      a.href = "./" + page + "?category=" + encodeURIComponent(sec.id);
      a.style.animationDelay = i * 40 + "ms";
      const minP = minPriceInSection(sec);
      const priceLabel = minP ? "From " + formatLKR(minP) : "Live LKR Quote";
      const artSvg = DEPT_SVGS[sec.id] || DEPT_SVGS.processors;

      a.innerHTML =
        '<div class="lp-dept-top">' +
        '<div class="lp-dept-art">' + artSvg + "</div>" +
        '<span class="lp-dept-count"><b>' + secCount(sec) + "</b> items</span>" +
        "</div>" +
        '<span class="lp-dept-name">' + escapeHtml(sec.label) + "</span>" +
        '<div class="lp-dept-foot">' +
        '<span class="lp-dept-price">' + escapeHtml(priceLabel) + "</span>" +
        '<span class="material-symbols-outlined">arrow_outward</span>' +
        "</div>";
      deptGrid.appendChild(a);
    });
    bindInteractive(deptGrid);
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      moveIndicator(btn);
      renderDepts(btn.getAttribute("data-dept-tab"));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE 4-STAGE EMBILIPITIYA BENCH SIMULATOR
  // ═══════════════════════════════════════════════════════════════════════════
  const BENCH_STAGES = [
    {
      photo: "./assets/micro-solder.jpg",
      step: "STAGE 01 // PCB & PORT DIAGNOSTIC",
      title: "Zero Reworked Dies · Clean VRM Rails",
      sub: "Microscope & multimeter inspection on every incoming board and GPU",
      svg:
        '<svg viewBox="0 0 120 36" fill="none"><circle cx="18" cy="18" r="11" stroke="#38bdf8" stroke-width="2"/><path d="M14 18l3 3 6-6" stroke="#10b981" stroke-width="2" stroke-linecap="round"/><path d="M38 12h72M38 24h52" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>',
    },
    {
      photo: "./assets/cooling-loop.jpg",
      step: "STAGE 02 // ULTRASONIC CLEAN & REPASTE",
      title: "Fresh Thermal Compound · -12°C Drop",
      sub: "Heatsinks cleaned and repasted before thermal burn-in testing",
      svg:
        '<svg viewBox="0 0 120 36" fill="none"><path d="M10 28C28 28 38 10 62 10s34 14 48 14" stroke="#10b981" stroke-width="2.2" stroke-linecap="round"/><circle cx="62" cy="10" r="4" fill="#38bdf8"/></svg>',
    },
    {
      photo: "./assets/lab-gpu-install.jpg",
      step: "STAGE 03 // 24-HOUR FURMARK & OCCT BURN-IN",
      title: "Continuous 3D Load · 100% SMART Health",
      sub: "Only hardware that runs rock-solid for 24 hours makes our catalog",
      svg:
        '<svg viewBox="0 0 120 36" fill="none"><path d="M4 24h18l7-14 8 20 8-12 6 6h22l7-15 8 19 7-8h21" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      photo: "./assets/rgb-ram-macro.jpg",
      step: "STAGE 04 // 06-MONTH WARRANTY & ESD DISPATCH",
      title: "Written 06-Mo Warranty · Anti-Static Packed",
      sub: "Collect at our Embilipitiya bench or couriered safely island-wide",
      svg:
        '<svg viewBox="0 0 120 36" fill="none"><path d="M20 6l12 5v9c0 7-5 12-12 14-7-2-12-7-12-14v-9l12-5z" stroke="#10b981" stroke-width="2"/><path d="M15 18l3 3 6-6" stroke="#10b981" stroke-width="2" stroke-linecap="round"/><path d="M44 18h66" stroke="#10b981" stroke-width="2" stroke-dasharray="4 4"/></svg>',
    },
  ];

  const benchCards = $$(".bench-step-card");
  const benchPhoto = $("#bench-stage-photo");
  const benchHudStep = $("#bench-hud-step");
  const benchHudTitle = $("#bench-hud-title");
  const benchHudSub = $("#bench-hud-sub");
  const benchHudSvg = $("#bench-hud-svg");

  function setBenchStage(idx) {
    const st = BENCH_STAGES[idx] || BENCH_STAGES[0];
    benchCards.forEach((c, i) => {
      const on = i === idx;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    if (benchPhoto && benchPhoto.getAttribute("src") !== st.photo) {
      benchPhoto.src = st.photo;
    }
    if (benchHudStep) benchHudStep.textContent = st.step;
    if (benchHudTitle) benchHudTitle.textContent = st.title;
    if (benchHudSub) benchHudSub.textContent = st.sub;
    if (benchHudSvg) benchHudSvg.innerHTML = st.svg;
  }

  benchCards.forEach((card) => {
    const activate = () => {
      const idx = parseInt(card.getAttribute("data-bench-step"), 10) || 0;
      setBenchStage(idx);
    };
    card.addEventListener("click", activate);
    card.addEventListener("pointerenter", activate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
  setBenchStage(0);

  // ── Spotlight + tilt + magnetic micro-interactions ──────────────────────────
  function bindInteractive(root) {
    $$(".spotlight", root).forEach((el) => {
      if (el.__spot) return;
      el.__spot = true;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
    if (reduceMotion) return;
    $$(".tilt", root).forEach((el) => {
      if (el.__tilt) return;
      el.__tilt = true;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          "perspective(900px) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg) translateY(-3px)";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
    $$(".magnetic", root).forEach((el) => {
      if (el.__mag) return;
      el.__mag = true;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.14;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.18;
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // ── Boot ────────────────────────────────────────────────────────────────────
  renderDepts("used");
  const activeTab = $("[data-dept-tab].active");
  moveIndicator(activeTab);
  window.addEventListener("resize", () => moveIndicator($("[data-dept-tab].active")));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moveIndicator($("[data-dept-tab].active")));
  }
  bindInteractive(document);

  window.addEventListener("aqua:catalog-updated", () => {
    rebuildFlatCatalog();
    const nextUsed = countItems(USED);
    const nextNew = countItems(NEW);
    const nextDepts = USED.length + NEW.length;
    const nextBinds = { "used-count": nextUsed, "new-count": nextNew, "dept-count": nextDepts };
    $$("[data-bind]").forEach((el) => {
      const v = nextBinds[el.getAttribute("data-bind")];
      if (v !== undefined) el.textContent = String(v);
    });
    $$("[data-count-bind]").forEach((el) => {
      const v = nextBinds[el.getAttribute("data-count-bind")];
      if (v !== undefined) el.textContent = String(v);
    });
    const curTab = $("[data-dept-tab].active");
    renderDepts(curTab ? curTab.getAttribute("data-dept-tab") : "used");
  });
})();
