(function () {
  "use strict";

  const catalog = window.AQUA_PARTS_CATALOG || {
    siteName: "Aqua PC Parts",
    whatsappPhone: "94788194535",
    whatsappDirectBase: "https://wa.me/94788194535",
    mainSiteUrl: "https://aquapcsolutions.yyth.workers.dev/",
    totalItems: 0,
    usedTotalItems: 0,
    brandNewTotalItems: 0,
    sections: [],
    usedSections: [],
    brandNewSections: [],
  };

  const PAGE_MODE = document.body.getAttribute("data-page") || "home";
  const QUOTE_STORAGE_KEY = "aqua-parts-quote-v1";
  const THEME_STORAGE_KEY = "aqua-parts-theme";
  const VIEW_STORAGE_KEY = "aqua-parts-view";

  const USED_SECTIONS = catalog.usedSections && catalog.usedSections.length > 0
    ? catalog.usedSections
    : catalog.sections || [];
  const BRAND_NEW_SECTIONS = catalog.brandNewSections || [];

  function countItemsInSections(sections) {
    return sections.reduce(
      (sum, sec) => sum + sec.categories.reduce((cs, c) => cs + c.items.length, 0),
      0
    );
  }

  // On Home "all" view, show the 9 used hardware departments + all 7 Brand New departments
  // cleanly without duplicating the 28 peripheral items that exist in both catalogs.
  const COMBINED_ALL_SECTIONS = [
    ...USED_SECTIONS.filter((s) => s.id !== "peripherals"),
    ...BRAND_NEW_SECTIONS,
  ];

  const TOTAL_USED = catalog.usedTotalItems || countItemsInSections(USED_SECTIONS);
  const TOTAL_NEW = catalog.brandNewTotalItems || countItemsInSections(BRAND_NEW_SECTIONS);
  const TOTAL_ALL = countItemsInSections(COMBINED_ALL_SECTIONS);

  // Resolve Main Site base URL
  const isSameHostSubpath = window.location.pathname.includes("/aqua-pc-parts");
  const MAIN_SITE_BASE = isSameHostSubpath
    ? "/"
    : catalog.mainSiteUrl || "https://aquapcsolutions.yyth.workers.dev/";

  function mainSiteHref(path) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    if (MAIN_SITE_BASE === "/") return "/" + cleanPath;
    return MAIN_SITE_BASE.replace(/\/$/, "") + "/" + cleanPath;
  }

  const INTENT_LABELS = {
    order: "Place Order / Reserve Item",
    availability: "Check Stock Availability",
    compatibility: "Check PC Compatibility",
    install: "Order with Workshop Installation",
  };

  const FULFILLMENT_LABELS = {
    pickup: "Store Pickup (Embilipitiya)",
    delivery: "Island-wide Safe Delivery",
    "workshop-install": "Workshop Fitting & Stress Test (+Rs. 1,500)",
  };

  const INTENT_OPTIONS = [
    { id: "order", label: "Order Now", icon: "shopping_bag" },
    { id: "availability", label: "Check Availability", icon: "inventory_2" },
    { id: "compatibility", label: "Compatibility Help", icon: "build" },
    { id: "install", label: "With Lab Install", icon: "handyman" },
  ];

  const FULFILLMENT_OPTIONS = [
    { id: "pickup", label: "Store Pickup (Embilipitiya)", icon: "storefront" },
    { id: "delivery", label: "Island-wide Delivery", icon: "local_shipping" },
    { id: "workshop-install", label: "Workshop Fitting (+Rs. 1,500)", icon: "engineering" },
  ];

  // App State
  const state = {
    condition: PAGE_MODE === "used" ? "used" : PAGE_MODE === "new" ? "new" : "all",
    activeSection: "all",
    searchQuery: "",
    sortOrder: "default",
    pricedOnly: false,
    viewMode: "list",
    openCustomizers: new Set(),
    itemOptions: {},
    quoteList: {},
    quoteFulfillment: "pickup",
  };

  function getActiveConditionSections() {
    if (PAGE_MODE === "used" || state.condition === "used") return USED_SECTIONS;
    if (PAGE_MODE === "new" || state.condition === "new") return BRAND_NEW_SECTIONS;
    return COMBINED_ALL_SECTIONS;
  }

  function isNewConditionItem(item, sec) {
    return (
      item.condition === "new" ||
      item.specs === "Brand New" ||
      (item.specs && item.specs.toLowerCase().includes("brand new")) ||
      (sec && sec.condition === "new")
    );
  }

  function formatPriceLKR(price) {
    if (typeof price !== "number" || !Number.isFinite(price)) {
      return "Price on Inquiry";
    }
    return "Rs. " + price.toLocaleString("en-US");
  }

  function getItemOpts(itemId) {
    if (!state.itemOptions[itemId]) {
      state.itemOptions[itemId] = {
        quantity: 1,
        intent: "order",
        fulfillment: "pickup",
        customNote: "",
      };
    }
    return state.itemOptions[itemId];
  }

  function buildItemWhatsAppMessage(item, categoryName, sectionLabel, opts, isBrandNew) {
    const qty = Math.max(1, Math.min(20, Math.floor(opts.quantity || 1)));
    const unitPriceText = formatPriceLKR(item.price);
    const warrantyText =
      item.warranty || (isBrandNew ? "Brand New · Store Warranty" : "06 Months Testing Warranty");
    const conditionText = isBrandNew ? "Brand New" : "Used (Grade A Bench Tested)";
    const categoryLine = [sectionLabel, categoryName].filter(Boolean).join(" › ");

    const lines = [
      "Hello Aqua PC Parts / Aqua PC Solutions! I'm contacting you about this item:",
      "",
      "• Item: " + item.name,
      "• Condition: " + conditionText,
    ];
    if (categoryLine) lines.push("• Category: " + categoryLine);
    if (item.specs) lines.push("• Specs: " + item.specs);
    lines.push("• Listed Price: " + unitPriceText);
    if (qty > 1) {
      lines.push("• Quantity: " + qty);
      if (typeof item.price === "number") {
        lines.push("• Total Estimate: " + formatPriceLKR(item.price * qty));
      }
    }
    lines.push("• Warranty: " + warrantyText);
    lines.push("• Inquiry Type: " + (INTENT_LABELS[opts.intent] || INTENT_LABELS.order));
    lines.push(
      "• Preferred Option: " + (FULFILLMENT_LABELS[opts.fulfillment] || FULFILLMENT_LABELS.pickup)
    );
    if (opts.customNote && opts.customNote.trim()) {
      lines.push("• Note: " + opts.customNote.trim());
    }
    lines.push("", "Please confirm current stock and next steps. Thank you!");
    return lines.join("\n");
  }

  function buildWhatsAppUrl(message) {
    return catalog.whatsappDirectBase + "?text=" + encodeURIComponent(message);
  }

  function findCatalogItemById(itemId) {
    const allSecs = [...USED_SECTIONS, ...BRAND_NEW_SECTIONS];
    for (const sec of allSecs) {
      for (const cat of sec.categories || []) {
        for (const item of cat.items || []) {
          if (item.id === itemId) {
            return {
              item,
              categoryName: cat.name,
              sectionLabel: sec.label,
              isBrandNew: isNewConditionItem(item, sec),
            };
          }
        }
      }
    }
    return null;
  }

  // Quote persistence helpers (bidirectional sync with Nanotek storefront cart)
  function loadPersistedQuote() {
    try {
      const raw = localStorage.getItem(QUOTE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.quoteList && typeof parsed.quoteList === "object") {
            state.quoteList = parsed.quoteList;
          }
          if (typeof parsed.quoteFulfillment === "string") {
            state.quoteFulfillment = parsed.quoteFulfillment;
          }
        }
      }
      if (Object.keys(state.quoteList).length === 0) {
        const shopRaw = localStorage.getItem("aqua-shop-cart-v1");
        if (shopRaw) {
          const arr = JSON.parse(shopRaw);
          if (Array.isArray(arr) && arr.length) {
            arr.forEach((c) => {
              if (!c || !c.id) return;
              const found = findCatalogItemById(c.id);
              if (found) {
                state.quoteList[found.item.id] = {
                  item: found.item,
                  quantity: Math.max(1, Math.min(50, Number(c.qty) || 1)),
                  categoryName: found.categoryName,
                  sectionLabel: found.sectionLabel,
                  isBrandNew: found.isBrandNew,
                };
              }
            });
          }
        }
      }
    } catch (_) { }
  }

  function savePersistedQuote() {
    try {
      localStorage.setItem(
        QUOTE_STORAGE_KEY,
        JSON.stringify({
          quoteList: state.quoteList,
          quoteFulfillment: state.quoteFulfillment,
        })
      );
      const cartArr = Object.values(state.quoteList).map((e) => ({
        id: e.item.id,
        name: e.item.name,
        qty: e.quantity,
      }));
      localStorage.setItem("aqua-shop-cart-v1", JSON.stringify(cartArr));
    } catch (_) { }
  }

  // DOM Elements
  const categoryNavEl = document.getElementById("category-nav");
  const catalogListEl = document.getElementById("catalog-list");
  const activeSectionIconEl = document.getElementById("active-section-icon");
  const activeSectionTitleEl = document.getElementById("active-section-title");
  const activeSectionCountEl = document.getElementById("active-section-count");
  const sidebarCondLabelEl = document.getElementById("sidebar-condition-label");
  const globalSearchInput = document.getElementById("global-search-input");
  const globalSearchClear = document.getElementById("global-search-clear");
  const sortSelect = document.getElementById("sort-select");
  const pricedOnlyCheckbox = document.getElementById("priced-only-checkbox");
  const sectionWaBanner = document.getElementById("section-whatsapp-banner");
  const mainSiteLink = document.getElementById("main-site-link");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");

  // Quote Drawer elements
  const quoteOpenBtn = document.getElementById("quote-drawer-open-btn");
  const quoteCloseBtn = document.getElementById("quote-drawer-close-btn");
  const quoteDrawer = document.getElementById("quote-drawer");
  const quoteBackdrop = document.getElementById("quote-drawer-backdrop");
  const quoteItemsEl = document.getElementById("quote-drawer-items");
  const quoteCountBadge = document.getElementById("quote-count-badge");
  const quoteTotalVal = document.getElementById("quote-total-val");
  const quoteClearBtn = document.getElementById("quote-clear-btn");
  const quoteSendWaBtn = document.getElementById("quote-send-wa-btn");

  // Populate dynamic counters in header, cards & hero
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };

  setText("nav-used-count", TOTAL_USED);
  setText("nav-new-count", TOTAL_NEW);
  setText("card-used-count", TOTAL_USED);
  setText("card-new-count", TOTAL_NEW);
  setText("cond-all-count", TOTAL_ALL);
  setText("cond-used-count", TOTAL_USED);
  setText("cond-new-count", TOTAL_NEW);

  if (PAGE_MODE === "new") {
    setText("hero-total-items", TOTAL_NEW);
    setText("hero-total-sections", BRAND_NEW_SECTIONS.length);
  } else {
    setText("hero-total-items", TOTAL_USED);
    setText("hero-new-items", TOTAL_NEW);
    setText("hero-total-sections", USED_SECTIONS.length);
  }

  if (mainSiteLink) {
    mainSiteLink.href = mainSiteHref("");
  }

  const footerYearEl = document.getElementById("footer-year");
  if (footerYearEl) footerYearEl.textContent = String(new Date().getFullYear());

  // Footer department links match the active page's division
  const footerDeptLinksEl = document.getElementById("footer-dept-links");
  if (footerDeptLinksEl) {
    const footerSections = PAGE_MODE === "new" ? BRAND_NEW_SECTIONS : USED_SECTIONS;
    footerSections.forEach((sec) => {
      const count = sec.categories.reduce((s, c) => s + c.items.length, 0);
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = sec.label + " (" + count + ")";
      btn.addEventListener("click", () => {
        if (PAGE_MODE === "home") {
          state.condition = "used";
          syncConditionButtonsUI();
        }
        setActiveSection(sec.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      li.appendChild(btn);
      footerDeptLinksEl.appendChild(li);
    });
  }

  const footerMainLinksEl = document.getElementById("footer-mainsite-links");
  if (footerMainLinksEl) {
    [
      { label: "Home — Aqua PC Solutions", path: "" },
      { label: "Interactive 3D PC Builder", externalUrl: "https://aquapc3dportal.pages.dev/" },
      { label: "Repairs & Lab Services", path: "services" },
      { label: "Service Rates & Pricing", path: "pricing" },
      { label: "About & Founder", path: "about" },
      { label: "Main Site Repair Desk", path: "contact" },
      { label: "Parts Store Contact & Showroom", externalUrl: "./contact.html" },
      { label: "Facebook (@aquapcsolutions)", externalUrl: "https://www.facebook.com/aquapcsolutions" },
      { label: "Instagram (@aquapcsolutions)", externalUrl: "https://www.instagram.com/aquapcsolutions/" },
    ].forEach((entry) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = entry.externalUrl || mainSiteHref(entry.path);
      a.textContent = entry.label;
      li.appendChild(a);
      footerMainLinksEl.appendChild(li);
    });
  }

  // Theme Toggle
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggleIcon) {
      themeToggleIcon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) { }
  }

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
  } catch (_) { }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // View Mode (List / Grid)
  function applyViewMode(mode) {
    state.viewMode = mode === "grid" ? "grid" : "list";
    if (catalogListEl) {
      catalogListEl.classList.toggle("catalog-grid-mode", state.viewMode === "grid");
    }
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-view") === state.viewMode);
    });
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, state.viewMode);
    } catch (_) { }
  }

  try {
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
    if (savedView === "grid" || savedView === "list") {
      state.viewMode = savedView;
    }
  } catch (_) { }

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyViewMode(btn.getAttribute("data-view") || "list");
    });
  });

  // Condition Switcher (on Storefront Hub home)
  function syncConditionButtonsUI() {
    document.querySelectorAll(".cond-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-condition") === state.condition);
    });
    if (sidebarCondLabelEl) {
      sidebarCondLabelEl.textContent =
        PAGE_MODE === "used" || state.condition === "used"
          ? "USED"
          : PAGE_MODE === "new" || state.condition === "new"
            ? "NEW"
            : "ALL";
    }
  }

  document.querySelectorAll(".cond-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-condition") || "all";
      state.condition = next;
      state.activeSection = "all";
      const url = new URL(window.location.href);
      if (next === "all") url.searchParams.delete("condition");
      else url.searchParams.set("condition", next);
      url.searchParams.delete("category");
      window.history.replaceState({}, "", url.toString());
      syncConditionButtonsUI();
      renderSidebar();
      renderCatalog();
    });
  });

  // Read URL params (?condition=...&category=...&q=...)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCond = urlParams.get("condition");
  const initialCat = urlParams.get("category");
  const initialQ = urlParams.get("q");

  if (PAGE_MODE === "home" && (initialCond === "used" || initialCond === "new" || initialCond === "all")) {
    state.condition = initialCond;
  }

  const activeConditionSections = getActiveConditionSections();
  if (initialCat && activeConditionSections.some((s) => s.id === initialCat)) {
    state.activeSection = initialCat;
  } else if (
    initialCat &&
    PAGE_MODE === "home" &&
    USED_SECTIONS.some((s) => s.id === initialCat)
  ) {
    state.condition = "used";
    state.activeSection = initialCat;
  }

  if (initialQ) {
    state.searchQuery = initialQ;
    if (globalSearchInput) globalSearchInput.value = initialQ;
    if (globalSearchClear) globalSearchClear.classList.remove("hidden");
  }

  function setActiveSection(sectionId) {
    state.activeSection = sectionId;
    const url = new URL(window.location.href);
    if (sectionId === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", sectionId);
    }
    window.history.replaceState({}, "", url.toString());
    renderSidebar();
    renderCatalog();
  }

  function renderSidebar() {
    if (!categoryNavEl) return;
    categoryNavEl.innerHTML = "";

    const sections = getActiveConditionSections();
    const sectionTotal = countItemsInSections(sections);
    const allLabel =
      PAGE_MODE === "used" || state.condition === "used"
        ? "All Used Parts"
        : PAGE_MODE === "new" || state.condition === "new"
          ? "All Brand New Parts"
          : "All Parts";

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "cat-tab" + (state.activeSection === "all" ? " active" : "");
    allBtn.innerHTML = `
      <span class="material-symbols-outlined">apps</span>
      <span class="cat-tab-label">${allLabel}</span>
      <span class="cat-tab-count">${sectionTotal}</span>
    `;
    allBtn.addEventListener("click", () => setActiveSection("all"));
    categoryNavEl.appendChild(allBtn);

    sections.forEach((sec) => {
      const count = sec.categories.reduce((sum, c) => sum + c.items.length, 0);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cat-tab" + (state.activeSection === sec.id ? " active" : "");
      btn.innerHTML = `
        <span class="material-symbols-outlined">${sec.icon}</span>
        <span class="cat-tab-label">${sec.label}</span>
        <span class="cat-tab-count">${count}</span>
      `;
      btn.addEventListener("click", () => setActiveSection(sec.id));
      categoryNavEl.appendChild(btn);
    });
  }

  function sortItems(items) {
    if (state.sortOrder === "default") return items;
    return items.slice().sort((a, b) => {
      if (state.sortOrder === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      const pa = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
      const pb = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
      if (state.sortOrder === "price-asc") {
        return pa - pb;
      }
      if (pa === Number.POSITIVE_INFINITY && pb === Number.POSITIVE_INFINITY) return 0;
      if (pa === Number.POSITIVE_INFINITY) return 1;
      if (pb === Number.POSITIVE_INFINITY) return -1;
      return pb - pa;
    });
  }

  function createWhatsAppSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("class", "wa-svg");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    );
    svg.appendChild(path);
    return svg;
  }

  function renderItemCard(item, categoryName, sectionLabel, sec) {
    const hasPrice = typeof item.price === "number" && Number.isFinite(item.price);
    const isBrandNew = isNewConditionItem(item, sec);
    const isOutOfStock = item.inStock === false;
    const isCustomizing = state.openCustomizers.has(item.id);
    const inQuote = Boolean(state.quoteList[item.id]);
    const opts = getItemOpts(item.id);
    const waUrl = buildWhatsAppUrl(
      buildItemWhatsAppMessage(item, categoryName, sectionLabel, opts, isBrandNew)
    );

    const card = document.createElement("div");
    card.className =
      "item-card" +
      (isBrandNew ? " is-new-item" : "") +
      (isOutOfStock ? " is-out-of-stock" : "") +
      (isCustomizing ? " customizing" : "");

    const mainRow = document.createElement("div");
    mainRow.className = "item-main-row";

    // Left: Info
    const infoDiv = document.createElement("div");
    infoDiv.className = "item-info";
    const imgSrc =
      typeof window.getAquaPartImage === "function"
        ? window.getAquaPartImage(item, sec && sec.id, categoryName)
        : "assets/cats/expansion.webp";
    const thumb = document.createElement("div");
    thumb.className = "part-thumb" + (isBrandNew ? " new-thumb" : "");
    const thumbImg = document.createElement("img");
    thumbImg.src = imgSrc;
    thumbImg.alt = item.name;
    thumbImg.loading = "lazy";
    thumbImg.decoding = "async";
    thumbImg.onerror = () => {
      thumbImg.onerror = null;
      thumbImg.src =
        typeof window.getAquaPartFallback === "function"
          ? window.getAquaPartFallback(item, sec && sec.id, categoryName)
          : "assets/cats/expansion.webp";
    };
    thumb.appendChild(thumbImg);

    const metaWrap = document.createElement("div");
    const titleEl = document.createElement("div");
    titleEl.className = "item-title";
    titleEl.textContent = item.name;

    const badgesEl = document.createElement("div");
    badgesEl.className = "item-badges";
    const condBadgeText =
      item.specs && item.specs.toLowerCase().includes("sealed")
        ? "Brand New · Sealed"
        : isBrandNew
          ? "Brand New"
          : "Used · Grade A";
    const warrantyText =
      item.warranty || (isBrandNew ? "Store Warranty" : "06 Mo. Warranty");

    badgesEl.innerHTML = `
      <span class="badge-condition ${isBrandNew ? "new" : "used"}">${condBadgeText}</span>
      ${isOutOfStock ? '<span class="badge-out-of-stock">Out of Stock</span>' : ""}
      <span class="badge-warranty">${warrantyText}</span>
      <span class="badge-grade">${categoryName}</span>
    `;

    metaWrap.appendChild(titleEl);
    metaWrap.appendChild(badgesEl);
    infoDiv.appendChild(thumb);
    infoDiv.appendChild(metaWrap);

    // Right: Price + Buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "item-actions";

    const priceBadge = document.createElement("span");
    priceBadge.className = "price-badge" + (hasPrice ? "" : " inquiry");
    priceBadge.textContent = formatPriceLKR(item.price);

    const quoteBtn = document.createElement("button");
    quoteBtn.type = "button";
    quoteBtn.className = "btn-card" + (inQuote ? " in-quote" : "");
    quoteBtn.innerHTML = `
      <span class="material-symbols-outlined">${inQuote ? "check" : "add_shopping_cart"}</span>
      <span>${inQuote ? "In Quote" : "+ Quote"}</span>
    `;
    quoteBtn.addEventListener("click", () => {
      if (state.quoteList[item.id]) {
        delete state.quoteList[item.id];
      } else {
        state.quoteList[item.id] = {
          item,
          categoryName,
          sectionLabel,
          isBrandNew,
          quantity: opts.quantity || 1,
        };
      }
      savePersistedQuote();
      updateQuoteDrawerUI();
      renderCatalog();
    });

    const customizeBtn = document.createElement("button");
    customizeBtn.type = "button";
    customizeBtn.className = "btn-card" + (isCustomizing ? " active" : "");
    customizeBtn.setAttribute("aria-expanded", String(isCustomizing));
    customizeBtn.innerHTML = `
      <span class="material-symbols-outlined">tune</span>
      <span>Customize</span>
    `;

    const waBtn = document.createElement("a");
    waBtn.className = "btn-wa";
    waBtn.href = waUrl;
    waBtn.target = "_blank";
    waBtn.rel = "noopener noreferrer";
    waBtn.appendChild(createWhatsAppSvg());
    const waLabel = document.createElement("span");
    waLabel.textContent = hasPrice ? "Buy / Ask" : "Get Quote";
    waBtn.appendChild(waLabel);

    actionsDiv.appendChild(priceBadge);
    actionsDiv.appendChild(quoteBtn);
    actionsDiv.appendChild(customizeBtn);
    actionsDiv.appendChild(waBtn);

    mainRow.appendChild(infoDiv);
    mainRow.appendChild(actionsDiv);
    card.appendChild(mainRow);

    // Customizer Drawer
    const customizerPanel = document.createElement("div");
    customizerPanel.className = "customizer-panel" + (isCustomizing ? "" : " hidden");

    function updateCustomizerPreview() {
      const msg = buildItemWhatsAppMessage(item, categoryName, sectionLabel, opts, isBrandNew);
      const nextUrl = buildWhatsAppUrl(msg);
      waBtn.href = nextUrl;
      const sendCustomBtn = customizerPanel.querySelector(".send-custom-wa");
      if (sendCustomBtn) sendCustomBtn.href = nextUrl;
      const previewEl = customizerPanel.querySelector(".preview-msg");
      if (previewEl) previewEl.textContent = msg;
      const qtySpan = customizerPanel.querySelector(".qty-val");
      if (qtySpan) qtySpan.textContent = String(opts.quantity);
      const totalEl = customizerPanel.querySelector(".est-total-val");
      if (totalEl && hasPrice) {
        totalEl.textContent = formatPriceLKR(item.price * opts.quantity);
      }
      const minusBtn = customizerPanel.querySelector(".qty-minus");
      const plusBtn = customizerPanel.querySelector(".qty-plus");
      if (minusBtn) minusBtn.disabled = opts.quantity <= 1;
      if (plusBtn) plusBtn.disabled = opts.quantity >= 20;
    }

    if (isCustomizing) {
      const topRow = document.createElement("div");
      topRow.className = "customizer-top-row";

      const qtyGroup = document.createElement("div");
      qtyGroup.className = "qty-group";
      qtyGroup.innerHTML = `<span class="field-label">Quantity</span>`;

      const stepper = document.createElement("div");
      stepper.className = "qty-stepper";
      const minusBtn = document.createElement("button");
      minusBtn.type = "button";
      minusBtn.className = "qty-minus";
      minusBtn.textContent = "−";
      minusBtn.disabled = opts.quantity <= 1;
      minusBtn.addEventListener("click", () => {
        opts.quantity = Math.max(1, opts.quantity - 1);
        updateCustomizerPreview();
      });

      const qtySpan = document.createElement("span");
      qtySpan.className = "qty-val";
      qtySpan.textContent = String(opts.quantity);

      const plusBtn = document.createElement("button");
      plusBtn.type = "button";
      plusBtn.className = "qty-plus";
      plusBtn.textContent = "+";
      plusBtn.disabled = opts.quantity >= 20;
      plusBtn.addEventListener("click", () => {
        opts.quantity = Math.min(20, opts.quantity + 1);
        updateCustomizerPreview();
      });

      stepper.appendChild(minusBtn);
      stepper.appendChild(qtySpan);
      stepper.appendChild(plusBtn);
      qtyGroup.appendChild(stepper);
      topRow.appendChild(qtyGroup);

      if (hasPrice) {
        const totalDiv = document.createElement("div");
        totalDiv.className = "est-total";
        totalDiv.innerHTML = `Estimated Total: <strong class="est-total-val">${formatPriceLKR(
          item.price * opts.quantity
        )}</strong>`;
        topRow.appendChild(totalDiv);
      }
      customizerPanel.appendChild(topRow);

      // Inquiry Type pills
      const intentField = document.createElement("div");
      intentField.className = "customizer-field";
      intentField.innerHTML = `<span class="field-label">Inquiry Type</span>`;
      const intentRow = document.createElement("div");
      intentRow.className = "pill-row";
      INTENT_OPTIONS.forEach((opt) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "opt-pill" + (opts.intent === opt.id ? " active" : "");
        pill.innerHTML = `<span class="material-symbols-outlined">${opt.icon}</span><span>${opt.label}</span>`;
        pill.addEventListener("click", () => {
          opts.intent = opt.id;
          intentRow.querySelectorAll(".opt-pill").forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          updateCustomizerPreview();
        });
        intentRow.appendChild(pill);
      });
      intentField.appendChild(intentRow);
      customizerPanel.appendChild(intentField);

      // Delivery / Pickup pills
      const fulfillField = document.createElement("div");
      fulfillField.className = "customizer-field";
      fulfillField.innerHTML = `<span class="field-label">Delivery / Pickup Option</span>`;
      const fulfillRow = document.createElement("div");
      fulfillRow.className = "pill-row";
      FULFILLMENT_OPTIONS.forEach((opt) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "opt-pill" + (opts.fulfillment === opt.id ? " active-teal" : "");
        pill.innerHTML = `<span class="material-symbols-outlined">${opt.icon}</span><span>${opt.label}</span>`;
        pill.addEventListener("click", () => {
          opts.fulfillment = opt.id;
          fulfillRow.querySelectorAll(".opt-pill").forEach((p) => p.classList.remove("active-teal"));
          pill.classList.add("active-teal");
          updateCustomizerPreview();
        });
        fulfillRow.appendChild(pill);
      });
      fulfillField.appendChild(fulfillRow);
      customizerPanel.appendChild(fulfillField);

      // Custom Note
      const noteField = document.createElement("div");
      noteField.className = "customizer-field";
      const noteLabel = document.createElement("label");
      noteLabel.className = "field-label";
      noteLabel.setAttribute("for", "note-" + item.id);
      noteLabel.textContent = "Custom Note (Optional)";
      const noteInput = document.createElement("input");
      noteInput.id = "note-" + item.id;
      noteInput.type = "text";
      noteInput.className = "note-input";
      noteInput.maxLength = 200;
      noteInput.placeholder = 'e.g. "Need compatible cooler" or "Can you send photos?"';
      noteInput.value = opts.customNote || "";
      noteInput.addEventListener("input", (e) => {
        opts.customNote = e.target.value;
        updateCustomizerPreview();
      });
      noteField.appendChild(noteLabel);
      noteField.appendChild(noteInput);
      customizerPanel.appendChild(noteField);

      // Live Preview + CTA
      const previewBox = document.createElement("div");
      previewBox.className = "preview-box";
      const pre = document.createElement("pre");
      pre.className = "preview-msg";
      pre.textContent = buildItemWhatsAppMessage(item, categoryName, sectionLabel, opts, isBrandNew);

      const sendBtn = document.createElement("a");
      sendBtn.className = "btn-wa send-custom-wa";
      sendBtn.href = waUrl;
      sendBtn.target = "_blank";
      sendBtn.rel = "noopener noreferrer";
      sendBtn.appendChild(createWhatsAppSvg());
      const sendTxt = document.createElement("span");
      sendTxt.textContent = "Send Custom WhatsApp";
      sendBtn.appendChild(sendTxt);

      previewBox.appendChild(pre);
      previewBox.appendChild(sendBtn);
      customizerPanel.appendChild(previewBox);
    }

    customizeBtn.addEventListener("click", () => {
      if (state.openCustomizers.has(item.id)) {
        state.openCustomizers.delete(item.id);
      } else {
        state.openCustomizers.add(item.id);
      }
      renderCatalog();
    });

    card.appendChild(customizerPanel);
    return card;
  }

  function renderCatalog() {
    if (!catalogListEl) return;
    catalogListEl.innerHTML = "";

    const q = state.searchQuery.trim().toLowerCase();
    const sections = getActiveConditionSections();
    const targetSections =
      state.activeSection === "all"
        ? sections
        : sections.filter((s) => s.id === state.activeSection);

    const defaultAllMeta =
      PAGE_MODE === "used" || state.condition === "used"
        ? { label: "All Used Parts", icon: "verified" }
        : PAGE_MODE === "new" || state.condition === "new"
          ? { label: "All Brand New Parts", icon: "new_releases" }
          : { label: "All Parts (Used & Brand New)", icon: "apps" };

    const activeMeta =
      state.activeSection === "all"
        ? defaultAllMeta
        : targetSections[0] || defaultAllMeta;

    if (activeSectionIconEl) activeSectionIconEl.textContent = activeMeta.icon;
    if (activeSectionTitleEl) activeSectionTitleEl.textContent = activeMeta.label;
    if (sectionWaBanner) {
      sectionWaBanner.href = buildWhatsAppUrl(
        `Hello Aqua PC Parts! I'm browsing ${activeMeta.label} and would like assistance.`
      );
    }

    let renderedTotal = 0;

    targetSections.forEach((sec) => {
      sec.categories.forEach((cat) => {
        const filtered = cat.items.filter((item) => {
          if (state.pricedOnly && typeof item.price !== "number") return false;
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q) ||
            sec.label.toLowerCase().includes(q) ||
            (item.specs && item.specs.toLowerCase().includes(q)) ||
            (isNewConditionItem(item, sec) ? "brand new" : "used grade a").includes(q)
          );
        });

        const sorted = sortItems(filtered);
        if (sorted.length === 0) return;

        renderedTotal += sorted.length;

        const block = document.createElement("div");
        block.className = "category-block";

        const header = document.createElement("div");
        header.className = "category-block-header";
        header.innerHTML = `
          <span class="material-symbols-outlined">${cat.icon || sec.icon}</span>
          <h3 class="category-block-title">${cat.name}</h3>
          <span class="category-block-meta">${sec.label} · ${sorted.length} items</span>
        `;

        const stack = document.createElement("div");
        stack.className = "items-stack";
        sorted.forEach((item) => {
          stack.appendChild(renderItemCard(item, cat.name, sec.label, sec));
        });

        block.appendChild(header);
        block.appendChild(stack);
        catalogListEl.appendChild(block);
      });
    });

    if (activeSectionCountEl) {
      activeSectionCountEl.textContent = `${renderedTotal} matching items available`;
    }

    if (renderedTotal === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = `
        <span class="material-symbols-outlined">search_off</span>
        <h3>No matching hardware found</h3>
        <p>Try clearing your search filter or resetting department filters.</p>
      `;
      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "btn-reset";
      resetBtn.textContent = "Reset All Filters";
      resetBtn.addEventListener("click", () => {
        state.searchQuery = "";
        state.pricedOnly = false;
        state.sortOrder = "default";
        if (PAGE_MODE === "home") {
          state.condition = "all";
          syncConditionButtonsUI();
        }
        if (globalSearchInput) globalSearchInput.value = "";
        if (globalSearchClear) globalSearchClear.classList.add("hidden");
        if (pricedOnlyCheckbox) pricedOnlyCheckbox.checked = false;
        if (sortSelect) sortSelect.value = "default";
        setActiveSection("all");
      });
      empty.appendChild(resetBtn);
      catalogListEl.appendChild(empty);
    }
  }

  // Quote Drawer UI
  function openQuoteDrawer() {
    if (quoteDrawer) quoteDrawer.classList.add("open");
    if (quoteBackdrop) quoteBackdrop.classList.remove("hidden");
  }

  function closeQuoteDrawer() {
    if (quoteDrawer) quoteDrawer.classList.remove("open");
    if (quoteBackdrop) quoteBackdrop.classList.add("hidden");
  }

  function updateQuoteDrawerUI() {
    const entries = Object.values(state.quoteList);
    const totalCount = entries.reduce((sum, e) => sum + e.quantity, 0);
    if (quoteCountBadge) quoteCountBadge.textContent = String(totalCount);

    document.querySelectorAll("[data-quote-fulfillment]").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-quote-fulfillment") === state.quoteFulfillment
      );
    });

    let totalLkr = 0;
    let hasUnpriced = false;
    entries.forEach((e) => {
      if (typeof e.item.price === "number") {
        totalLkr += e.item.price * e.quantity;
      } else {
        hasUnpriced = true;
      }
    });

    if (quoteTotalVal) {
      quoteTotalVal.textContent =
        entries.length === 0
          ? "Rs. 0"
          : formatPriceLKR(totalLkr) + (hasUnpriced ? " + Inquiry items" : "");
    }

    if (quoteItemsEl) {
      quoteItemsEl.innerHTML = "";
      if (entries.length === 0) {
        quoteItemsEl.innerHTML = `
          <div class="empty-state">
            <span class="material-symbols-outlined">shopping_bag</span>
            <h3>Your Quote List is empty</h3>
            <p>Click <b>+ Quote</b> on any Used or Brand New item to bundle parts into a single WhatsApp order.</p>
          </div>
        `;
      } else {
        entries.forEach((entry) => {
          const row = document.createElement("div");
          row.className = "drawer-item-row";
          const condTag = entry.isBrandNew ? "Brand New" : "Used · Grade A";

          const top = document.createElement("div");
          top.className = "drawer-item-top";
          top.innerHTML = `
            <div>
              <div class="drawer-item-name">${entry.item.name}</div>
              <div class="drawer-item-cat">${condTag} · ${entry.sectionLabel} › ${entry.categoryName}</div>
            </div>
            <div class="price-badge ${typeof entry.item.price === "number" ? "" : "inquiry"}">
              ${typeof entry.item.price === "number"
              ? formatPriceLKR(entry.item.price * entry.quantity)
              : "Inquiry"
            }
            </div>
          `;

          const bottom = document.createElement("div");
          bottom.className = "drawer-item-bottom";

          const stepper = document.createElement("div");
          stepper.className = "qty-stepper";
          const mBtn = document.createElement("button");
          mBtn.type = "button";
          mBtn.textContent = "−";
          mBtn.disabled = entry.quantity <= 1;
          mBtn.addEventListener("click", () => {
            entry.quantity = Math.max(1, entry.quantity - 1);
            savePersistedQuote();
            updateQuoteDrawerUI();
          });
          const qSpan = document.createElement("span");
          qSpan.textContent = String(entry.quantity);
          const pBtn = document.createElement("button");
          pBtn.type = "button";
          pBtn.textContent = "+";
          pBtn.disabled = entry.quantity >= 20;
          pBtn.addEventListener("click", () => {
            entry.quantity = Math.min(20, entry.quantity + 1);
            savePersistedQuote();
            updateQuoteDrawerUI();
          });
          stepper.appendChild(mBtn);
          stepper.appendChild(qSpan);
          stepper.appendChild(pBtn);

          const remBtn = document.createElement("button");
          remBtn.type = "button";
          remBtn.className = "drawer-remove-btn";
          remBtn.textContent = "Remove";
          remBtn.addEventListener("click", () => {
            delete state.quoteList[entry.item.id];
            savePersistedQuote();
            updateQuoteDrawerUI();
            renderCatalog();
          });

          bottom.appendChild(stepper);
          bottom.appendChild(remBtn);
          row.appendChild(top);
          row.appendChild(bottom);
          quoteItemsEl.appendChild(row);
        });
      }
    }

    if (quoteSendWaBtn) {
      if (entries.length === 0) {
        quoteSendWaBtn.classList.add("disabled");
        quoteSendWaBtn.href = catalog.whatsappDirectBase;
      } else {
        quoteSendWaBtn.classList.remove("disabled");
        const lines = [
          "Hello Aqua PC Parts! I would like to order / request a quote for these items:",
          "",
        ];
        entries.forEach((e, idx) => {
          const linePrice =
            typeof e.item.price === "number"
              ? formatPriceLKR(e.item.price * e.quantity)
              : "Price on Inquiry";
          const condTag = e.isBrandNew ? "Brand New" : "Used Grade-A";
          lines.push(`${idx + 1}. ${e.item.name} [${condTag}] × ${e.quantity} — ${linePrice}`);
        });
        lines.push("");
        lines.push(
          `• Estimated Subtotal: ${formatPriceLKR(totalLkr)}${hasUnpriced ? " (+ Inquiry items)" : ""
          }`
        );
        lines.push(
          `• Preferred Option: ${FULFILLMENT_LABELS[state.quoteFulfillment] || FULFILLMENT_LABELS.pickup
          }`
        );
        lines.push("", "Please confirm stock availability and total. Thank you!");
        quoteSendWaBtn.href = buildWhatsAppUrl(lines.join("\n"));
      }
    }
  }

  // Event Listeners
  if (globalSearchInput) {
    globalSearchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      if (globalSearchClear) {
        globalSearchClear.classList.toggle("hidden", !state.searchQuery);
      }
      renderCatalog();
    });
  }

  if (globalSearchClear && globalSearchInput) {
    globalSearchClear.addEventListener("click", () => {
      state.searchQuery = "";
      globalSearchInput.value = "";
      globalSearchClear.classList.add("hidden");
      renderCatalog();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortOrder = e.target.value;
      renderCatalog();
    });
  }

  if (pricedOnlyCheckbox) {
    pricedOnlyCheckbox.addEventListener("change", (e) => {
      state.pricedOnly = e.target.checked;
      renderCatalog();
    });
  }

  if (quoteOpenBtn) quoteOpenBtn.addEventListener("click", openQuoteDrawer);
  if (quoteCloseBtn) quoteCloseBtn.addEventListener("click", closeQuoteDrawer);
  if (quoteBackdrop) quoteBackdrop.addEventListener("click", closeQuoteDrawer);

  if (quoteClearBtn) {
    quoteClearBtn.addEventListener("click", () => {
      state.quoteList = {};
      savePersistedQuote();
      updateQuoteDrawerUI();
      renderCatalog();
    });
  }

  document.querySelectorAll("[data-quote-fulfillment]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.quoteFulfillment = btn.getAttribute("data-quote-fulfillment") || "pickup";
      savePersistedQuote();
      updateQuoteDrawerUI();
    });
  });

  // Keyboard shortcuts: "/" focuses search, "Escape" closes Quote Drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuoteDrawer();
      return;
    }
    if (
      e.key === "/" &&
      globalSearchInput &&
      document.activeElement &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      globalSearchInput.focus();
    }
  });

  // Initial Boot
  loadPersistedQuote();
  applyViewMode(state.viewMode);
  syncConditionButtonsUI();
  renderSidebar();
  renderCatalog();
  updateQuoteDrawerUI();
  if (urlParams.get("quote") === "open") openQuoteDrawer();

  // Re-render automatically when live cloud catalog updates arrive
  window.addEventListener("aqua:catalog-updated", () => {
    const nextUsed = countItemsInSections(USED_SECTIONS);
    const nextNew = countItemsInSections(BRAND_NEW_SECTIONS);
    setText("nav-used-count", nextUsed);
    setText("nav-new-count", nextNew);
    if (PAGE_MODE === "new") {
      setText("hero-total-items", nextNew);
      setText("hero-total-sections", BRAND_NEW_SECTIONS.length);
    } else {
      setText("hero-total-items", nextUsed);
      setText("hero-total-sections", USED_SECTIONS.length);
    }
    renderSidebar();
    renderCatalog();
    updateQuoteDrawerUI();
  });
})();
