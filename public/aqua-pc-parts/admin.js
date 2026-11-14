(function () {
  "use strict";

  const STORAGE_KEY = window.AQUA_CATALOG_STORAGE_KEY || "aqua-parts-catalog-override-v1";
  const SESSION_PASS_KEY = "aqua-admin-passcode-v1";
  const LOCAL_CUSTOM_PASS_KEY = "aqua-admin-local-pass-v1";
  const THEME_STORAGE_KEY = "aqua-parts-theme";

  const catalog = window.AQUA_PARTS_CATALOG || {
    siteName: "Aqua PC Parts",
    whatsappPhone: "94788194535",
    whatsappDirectBase: "https://wa.me/94788194535",
    mainSiteUrl: "https://aquapcsolutions.yyth.workers.dev/",
    usedSections: [],
    brandNewSections: [],
    sections: [],
  };

  if (!Array.isArray(catalog.usedSections) || catalog.usedSections.length === 0) {
    catalog.usedSections = Array.isArray(catalog.sections) ? catalog.sections : [];
  }
  if (!Array.isArray(catalog.brandNewSections)) {
    catalog.brandNewSections = [];
  }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const state = {
    unlocked: false,
    passcode: "",
    unsavedCount: 0,
    activeTab: "items",
    divisionFilter: "used", // "used" | "new" | "all"
    deptFilter: "all",
    catFilter: "all",
    statusFilter: "all",
    searchQuery: "",
    cloudAvailable: false,
    lastSavedAt: null,
  };

  // ── Toast Helper ────────────────────────────────────────────────────────────
  const toastEl = $("#admin-toast");
  let toastTimer = null;
  function showToast(msg, kind) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = "admin-toast " + (kind || "success");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add("hidden");
    }, 3600);
  }

  // ── Theme Toggle ────────────────────────────────────────────────────────────
  const themeBtn = $("#theme-toggle-btn");
  const themeIcon = $("#theme-toggle-icon");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (themeIcon) themeIcon.textContent = t === "dark" ? "light_mode" : "dark_mode";
    try { localStorage.setItem(THEME_STORAGE_KEY, t); } catch (_) {}
  }
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
  } catch (_) {}
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  }

  // ── Authentication Gate ─────────────────────────────────────────────────────
  const authGate = $("#admin-auth-gate");
  const adminApp = $("#admin-app");
  const loginForm = $("#admin-login-form");
  const passInput = $("#admin-passcode-input");
  const loginError = $("#admin-login-error");
  const lockBtn = $("#btn-lock-admin");

  function getLocalExpectedPass() {
    try {
      return localStorage.getItem(LOCAL_CUSTOM_PASS_KEY) || "aqua2026";
    } catch (_) {
      return "aqua2026";
    }
  }

  async function verifyPasscode(candidate) {
    const clean = String(candidate || "").trim();
    if (!clean) return { ok: false, error: "Please enter a passcode." };

    if (typeof fetch === "function" && /^https?:/i.test(window.location.protocol)) {
      try {
        const res = await fetch("/api/catalog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Passcode": clean,
          },
          body: JSON.stringify({ action: "verify", passcode: clean }),
        });
        if (res.status === 401) {
          return { ok: false, error: "Incorrect admin passcode." };
        }
        if (res.ok) {
          const data = await res.json();
          state.cloudAvailable = Boolean(data && data.kvAvailable);
          return { ok: true };
        }
      } catch (_) {}
    }

    // Fallback local verification
    if (clean === getLocalExpectedPass()) {
      return { ok: true };
    }
    return { ok: false, error: "Incorrect admin passcode (default is aqua2026)." };
  }

  function unlockAdmin(pass) {
    state.unlocked = true;
    state.passcode = pass;
    try { sessionStorage.setItem(SESSION_PASS_KEY, pass); } catch (_) {}
    if (authGate) authGate.classList.add("hidden");
    if (adminApp) adminApp.classList.remove("hidden");
    refreshAllUI();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (loginError) loginError.classList.add("hidden");
      const val = passInput ? passInput.value : "";
      const check = await verifyPasscode(val);
      if (check.ok) {
        unlockAdmin(val.trim());
        showToast("Admin Console Unlocked", "success");
      } else if (loginError) {
        loginError.textContent = check.error || "Invalid passcode";
        loginError.classList.remove("hidden");
      }
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener("click", () => {
      state.unlocked = false;
      state.passcode = "";
      try { sessionStorage.removeItem(SESSION_PASS_KEY); } catch (_) {}
      if (adminApp) adminApp.classList.add("hidden");
      if (authGate) authGate.classList.remove("hidden");
      if (passInput) passInput.value = "";
    });
  }

  // Auto-unlock if session passcode is saved
  (async function checkSavedSession() {
    try {
      const savedPass = sessionStorage.getItem(SESSION_PASS_KEY);
      if (savedPass) {
        const check = await verifyPasscode(savedPass);
        if (check.ok) {
          unlockAdmin(savedPass);
        }
      }
    } catch (_) {}
  })();

  // ── Catalog Helpers & Cross-Section Sync ────────────────────────────────────
  function getUsedSections() {
    return catalog.usedSections || [];
  }

  function getNewSections() {
    return catalog.brandNewSections || [];
  }

  function recomputeCatalogTotals() {
    if (typeof window.applyAquaCatalogOverride === "function") {
      window.applyAquaCatalogOverride(
        {
          usedSections: getUsedSections(),
          brandNewSections: getNewSections(),
        },
        true
      );
    }
  }

  // When an item exists in both usedSections (peripherals) and brandNewSections, keep them synced
  function syncSharedItemById(itemId, updaterFn) {
    [getUsedSections(), getNewSections()].forEach((secList) => {
      secList.forEach((sec) => {
        (sec.categories || []).forEach((cat) => {
          (cat.items || []).forEach((it) => {
            if (it.id === itemId) {
              updaterFn(it);
            }
          });
        });
      });
    });
  }

  function saveLocalDraft() {
    recomputeCatalogTotals();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          updatedAt: new Date().toISOString(),
          catalog: {
            siteName: catalog.siteName,
            whatsappPhone: catalog.whatsappPhone,
            whatsappDirectBase: catalog.whatsappDirectBase,
            mainSiteUrl: catalog.mainSiteUrl,
            usedSections: getUsedSections(),
            brandNewSections: getNewSections(),
          },
        })
      );
    } catch (_) {}
  }

  function markChanged(countDelta) {
    state.unsavedCount += countDelta || 1;
    saveLocalDraft();
    updateUnsavedUI();
    updateKPIs();
  }

  function updateUnsavedUI() {
    const pill = $("#unsaved-pill");
    const countEl = $("#unsaved-count");
    const syncStatusEl = $("#admin-sync-status");
    if (countEl) countEl.textContent = String(state.unsavedCount);
    if (pill) {
      pill.classList.toggle("hidden", state.unsavedCount <= 0);
    }
    if (syncStatusEl) {
      if (state.unsavedCount > 0) {
        syncStatusEl.textContent =
          state.unsavedCount + " local change(s) ready — click Save & Publish Live";
      } else if (state.lastSavedAt) {
        syncStatusEl.textContent = "Published Live · " + new Date(state.lastSavedAt).toLocaleTimeString();
      } else {
        syncStatusEl.textContent = "Live Cloud & Local Catalog Manager";
      }
    }
  }

  // ── Publish Live to Cloudflare KV + LocalStorage ────────────────────────────
  const publishBtn = $("#btn-publish-live");
  async function publishCatalogLive() {
    recomputeCatalogTotals();
    saveLocalDraft();

    const payloadCatalog = {
      siteName: catalog.siteName || "Aqua PC Parts",
      whatsappPhone: catalog.whatsappPhone || "94788194535",
      whatsappDirectBase: catalog.whatsappDirectBase || "https://wa.me/94788194535",
      mainSiteUrl: catalog.mainSiteUrl || "https://aquapcsolutions.yyth.workers.dev/",
      markupLkr: catalog.markupLkr || 2000,
      totalItems: catalog.totalItems,
      usedTotalItems: catalog.usedTotalItems,
      brandNewTotalItems: catalog.brandNewTotalItems,
      sectionItemCounts: catalog.sectionItemCounts,
      brandNewSectionItemCounts: catalog.brandNewSectionItemCounts,
      sections: getUsedSections(),
      usedSections: getUsedSections(),
      brandNewSections: getNewSections(),
    };

    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.innerHTML =
        '<span class="material-symbols-outlined">sync</span><span>Publishing...</span>';
    }

    let publishedCloud = false;
    if (typeof fetch === "function" && /^https?:/i.test(window.location.protocol)) {
      try {
        const res = await fetch("/api/catalog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Passcode": state.passcode,
          },
          body: JSON.stringify({
            action: "save",
            passcode: state.passcode,
            catalog: payloadCatalog,
          }),
        });
        const data = await res.json();
        if (res.ok && data && data.ok) {
          publishedCloud = true;
          state.lastSavedAt = data.updatedAt || new Date().toISOString();
        } else if (data && data.error) {
          showToast("Cloud warning: " + data.error + " (Saved locally)", "warn");
        }
      } catch (_) {}
    }

    state.unsavedCount = 0;
    updateUnsavedUI();

    if (publishBtn) {
      publishBtn.disabled = false;
      publishBtn.innerHTML =
        '<span class="material-symbols-outlined">cloud_upload</span><span>Save &amp; Publish Live</span>';
    }

    if (publishedCloud) {
      showToast("Saved & Published Live to aquapcparts.pages.dev!", "success");
    } else {
      showToast("Saved to browser catalog! Download catalog.js for permanent file backup.", "success");
    }
  }

  if (publishBtn) {
    publishBtn.addEventListener("click", publishCatalogLive);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && state.unlocked) {
      e.preventDefault();
      publishCatalogLive();
    }
  });

  // ── KPI Calculations ────────────────────────────────────────────────────────
  function updateKPIs() {
    const usedSecs = getUsedSections();
    const newSecs = getNewSections();

    let usedTotal = 0;
    let newTotal = 0;
    let pricedCount = 0;
    let inquiryCount = 0;
    let inStockCount = 0;
    let outStockCount = 0;

    usedSecs.forEach((sec) => {
      (sec.categories || []).forEach((cat) => {
        (cat.items || []).forEach((it) => {
          usedTotal++;
          if (typeof it.price === "number" && Number.isFinite(it.price)) pricedCount++;
          else inquiryCount++;
          if (it.inStock === false) outStockCount++;
          else inStockCount++;
        });
      });
    });

    newSecs.forEach((sec) => {
      (sec.categories || []).forEach((cat) => {
        (cat.items || []).forEach((it) => {
          newTotal++;
        });
      });
    });

    const setTxt = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(v);
    };

    setTxt("kpi-used-items", usedTotal);
    setTxt("kpi-used-depts", "Across " + usedSecs.length + " hardware departments");
    setTxt("kpi-new-items", newTotal);
    setTxt("kpi-new-depts", "Across " + newSecs.length + " brand-new departments");
    setTxt("kpi-priced-items", pricedCount);
    setTxt("kpi-inquiry-items", inquiryCount);
    setTxt("kpi-instock-items", inStockCount);
    setTxt("kpi-outstock-items", outStockCount);
    setTxt("nav-admin-used", usedTotal);
    setTxt("nav-admin-new", newTotal);
    setTxt("seg-used-count", usedTotal);
    setTxt("seg-new-count", newTotal);
  }

  // ── Admin Tabs Navigation ───────────────────────────────────────────────────
  const tabBtns = $$("[data-admin-tab]");
  const panels = {
    items: $("#admin-panel-items"),
    add: $("#admin-panel-add"),
    bulk: $("#admin-panel-bulk"),
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-admin-tab") || "items";
      state.activeTab = target;
      tabBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      Object.keys(panels).forEach((k) => {
        if (panels[k]) panels[k].classList.toggle("hidden", k !== target);
      });
    });
  });

  // ── Filter Controls in Tab 1 ────────────────────────────────────────────────
  const divSegBtns = $$("[data-div-filter]");
  const deptSelect = $("#admin-dept-filter");
  const catSelect = $("#admin-cat-filter");
  const statusSelect = $("#admin-status-filter");
  const searchInput = $("#admin-search-input");
  const showingLabel = $("#admin-showing-label");
  const tbodyEl = $("#admin-items-tbody");

  function getActiveDivisionSections() {
    if (state.divisionFilter === "used") return getUsedSections();
    if (state.divisionFilter === "new") return getNewSections();
    return [...getUsedSections(), ...getNewSections()];
  }

  function populateDeptDropdown() {
    if (!deptSelect) return;
    const secs = getActiveDivisionSections();
    const prev = state.deptFilter;
    deptSelect.innerHTML = '<option value="all">All Departments (' + secs.length + ')</option>';
    secs.forEach((sec) => {
      const count = (sec.categories || []).reduce((s, c) => s + (c.items || []).length, 0);
      const opt = document.createElement("option");
      opt.value = sec.id;
      opt.textContent = sec.label + " (" + count + ")";
      deptSelect.appendChild(opt);
    });
    if (secs.some((s) => s.id === prev)) {
      deptSelect.value = prev;
    } else {
      state.deptFilter = "all";
      deptSelect.value = "all";
    }
    populateCatDropdown();
  }

  function populateCatDropdown() {
    if (!catSelect) return;
    const secs = getActiveDivisionSections().filter(
      (s) => state.deptFilter === "all" || s.id === state.deptFilter
    );
    const prev = state.catFilter;
    catSelect.innerHTML = '<option value="all">All Subcategories</option>';
    secs.forEach((sec) => {
      (sec.categories || []).forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = sec.id + "::" + cat.id;
        opt.textContent = sec.label + " › " + cat.name + " (" + (cat.items || []).length + ")";
        catSelect.appendChild(opt);
      });
    });
    if ([...catSelect.options].some((o) => o.value === prev)) {
      catSelect.value = prev;
    } else {
      state.catFilter = "all";
      catSelect.value = "all";
    }
  }

  divSegBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.divisionFilter = btn.getAttribute("data-div-filter") || "used";
      state.deptFilter = "all";
      state.catFilter = "all";
      divSegBtns.forEach((b) => b.classList.toggle("active", b === btn));
      populateDeptDropdown();
      renderItemsTable();
    });
  });

  if (deptSelect) {
    deptSelect.addEventListener("change", () => {
      state.deptFilter = deptSelect.value;
      state.catFilter = "all";
      populateCatDropdown();
      renderItemsTable();
    });
  }

  if (catSelect) {
    catSelect.addEventListener("change", () => {
      state.catFilter = catSelect.value;
      renderItemsTable();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", () => {
      state.statusFilter = statusSelect.value;
      renderItemsTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.searchQuery = searchInput.value;
      renderItemsTable();
    });
  }

  // Collect filtered rows for Tab 1 (and Bulk "filtered" target)
  function getFilteredRowRecords() {
    const secs = getActiveDivisionSections();
    const q = (state.searchQuery || "").trim().toLowerCase();
    const records = [];

    secs.forEach((sec) => {
      if (state.deptFilter !== "all" && sec.id !== state.deptFilter) return;
      (sec.categories || []).forEach((cat) => {
        const catKey = sec.id + "::" + cat.id;
        if (state.catFilter !== "all" && state.catFilter !== catKey) return;
        (cat.items || []).forEach((item, idx) => {
          const hasPrice = typeof item.price === "number" && Number.isFinite(item.price);
          const isOut = item.inStock === false;
          if (state.statusFilter === "priced" && !hasPrice) return;
          if (state.statusFilter === "inquiry" && hasPrice) return;
          if (state.statusFilter === "out" && !isOut) return;

          if (q) {
            const hay = (
              item.name +
              " " +
              sec.label +
              " " +
              cat.name +
              " " +
              (item.price || "") +
              " " +
              (item.retailPrice || "")
            ).toLowerCase();
            if (!hay.includes(q)) return;
          }

          records.push({
            sec,
            cat,
            item,
            itemIndex: idx,
          });
        });
      });
    });

    return records;
  }

  // ── Render Inline Editable Table ────────────────────────────────────────────
  function renderItemsTable() {
    if (!tbodyEl) return;
    const rows = getFilteredRowRecords();
    if (showingLabel) {
      showingLabel.textContent = "Showing " + rows.length + " matching item(s)";
    }

    tbodyEl.innerHTML = "";
    if (rows.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td colspan="7" class="admin-empty-cell">No items match your current filter. Try clearing the search or switching divisions.</td>';
      tbodyEl.appendChild(tr);
      return;
    }

    const frag = document.createDocumentFragment();

    rows.forEach(({ sec, cat, item }) => {
      const tr = document.createElement("tr");
      tr.className = "admin-row" + (item.inStock === false ? " is-out" : "");

      // 1. Item Name Input
      const tdName = document.createElement("td");
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "admin-inline-input name-input";
      nameInput.value = item.name || "";
      nameInput.setAttribute("aria-label", "Item Name");
      nameInput.addEventListener("change", () => {
        const nextName = nameInput.value.trim();
        if (nextName && nextName !== item.name) {
          syncSharedItemById(item.id, (it) => {
            it.name = nextName;
          });
          markChanged(1);
          showToast("Updated name: " + nextName, "success");
        }
      });
      tdName.appendChild(nameInput);

      // 2. Department / Subcategory
      const tdDept = document.createElement("td");
      tdDept.innerHTML =
        '<div class="admin-dept-cell">' +
        "<strong>" + escapeHtml(sec.label) + "</strong>" +
        "<span>" + escapeHtml(cat.name) + "</span>" +
        "</div>";

      // 3. Base / Retail Price Input
      const tdBase = document.createElement("td");
      const baseInput = document.createElement("input");
      baseInput.type = "number";
      baseInput.min = "0";
      baseInput.step = "10";
      baseInput.placeholder = "—";
      baseInput.className = "admin-inline-input num-input";
      baseInput.value =
        typeof item.retailPrice === "number" && Number.isFinite(item.retailPrice)
          ? String(item.retailPrice)
          : "";

      // 4. Quick Markup Buttons (+750, +2000, Inquiry)
      const tdMarkup = document.createElement("td");
      const markupWrap = document.createElement("div");
      markupWrap.className = "admin-markup-btns";

      const btn750 = document.createElement("button");
      btn750.type = "button";
      btn750.className = "markup-chip emerald";
      btn750.textContent = "+750";
      btn750.title = "Set Selling Price = Base Price + Rs. 750";

      const btn2000 = document.createElement("button");
      btn2000.type = "button";
      btn2000.className = "markup-chip cyan";
      btn2000.textContent = "+2000";
      btn2000.title = "Set Selling Price = Base Price + Rs. 2,000";

      const btnInq = document.createElement("button");
      btnInq.type = "button";
      btnInq.className = "markup-chip dim";
      btnInq.textContent = "Inquiry";
      btnInq.title = "Set to Price on Inquiry";

      markupWrap.appendChild(btn750);
      markupWrap.appendChild(btn2000);
      markupWrap.appendChild(btnInq);
      tdMarkup.appendChild(markupWrap);

      // 5. Final Selling Price Input
      const tdPrice = document.createElement("td");
      const priceInput = document.createElement("input");
      priceInput.type = "number";
      priceInput.min = "0";
      priceInput.step = "10";
      priceInput.placeholder = "Price on Inquiry";
      priceInput.className = "admin-inline-input sell-price-input";
      priceInput.value =
        typeof item.price === "number" && Number.isFinite(item.price)
          ? String(item.price)
          : "";
      tdPrice.appendChild(priceInput);

      // Wire Base Price & Quick Markup Events
      baseInput.addEventListener("change", () => {
        const raw = baseInput.value.trim();
        const parsed = raw === "" ? undefined : Number(raw);
        syncSharedItemById(item.id, (it) => {
          if (parsed !== undefined && Number.isFinite(parsed)) {
            it.retailPrice = parsed;
          } else {
            delete it.retailPrice;
          }
        });
        markChanged(1);
      });
      tdBase.appendChild(baseInput);

      function applyRowMarkup(offset) {
        const baseVal =
          baseInput.value.trim() !== ""
            ? Number(baseInput.value)
            : typeof item.price === "number"
            ? item.price
            : 0;
        if (!Number.isFinite(baseVal) || baseVal <= 0) {
          showToast("Enter a Base/Retail price first to apply +" + offset, "warn");
          baseInput.focus();
          return;
        }
        const nextSell = Math.round(baseVal + offset);
        priceInput.value = String(nextSell);
        syncSharedItemById(item.id, (it) => {
          it.retailPrice = baseVal;
          it.price = nextSell;
        });
        markChanged(1);
        showToast(item.name + " → Rs. " + nextSell.toLocaleString("en-US"), "success");
      }

      btn750.addEventListener("click", () => applyRowMarkup(750));
      btn2000.addEventListener("click", () => applyRowMarkup(2000));
      btnInq.addEventListener("click", () => {
        priceInput.value = "";
        syncSharedItemById(item.id, (it) => {
          delete it.price;
        });
        markChanged(1);
        showToast(item.name + " set to Price on Inquiry", "success");
      });

      priceInput.addEventListener("change", () => {
        const raw = priceInput.value.trim();
        const parsed = raw === "" ? null : Number(raw);
        syncSharedItemById(item.id, (it) => {
          if (parsed !== null && Number.isFinite(parsed) && parsed >= 0) {
            it.price = Math.round(parsed);
          } else {
            delete it.price;
          }
        });
        markChanged(1);
      });

      // 6. Stock Status Button
      const tdStock = document.createElement("td");
      const stockBtn = document.createElement("button");
      stockBtn.type = "button";
      const renderStockBtn = () => {
        const out = item.inStock === false;
        stockBtn.className = "stock-toggle-btn " + (out ? "out" : "in");
        stockBtn.textContent = out ? "Out of Stock" : "In Stock";
      };
      renderStockBtn();
      stockBtn.addEventListener("click", () => {
        const nextStock = item.inStock === false ? true : false;
        syncSharedItemById(item.id, (it) => {
          it.inStock = nextStock;
        });
        tr.classList.toggle("is-out", !nextStock);
        renderStockBtn();
        markChanged(1);
      });
      tdStock.appendChild(stockBtn);

      // 7. Delete Action
      const tdAct = document.createElement("td");
      tdAct.style.textAlign = "right";
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "admin-del-btn";
      delBtn.title = "Delete Item";
      delBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
      delBtn.addEventListener("click", () => {
        if (!window.confirm('Remove "' + item.name + '" from ' + sec.label + '?')) return;
        const idx = cat.items.findIndex((x) => x.id === item.id);
        if (idx !== -1) cat.items.splice(idx, 1);
        markChanged(1);
        renderItemsTable();
        showToast("Deleted " + item.name, "success");
      });
      tdAct.appendChild(delBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdDept);
      tr.appendChild(tdBase);
      tr.appendChild(tdMarkup);
      tr.appendChild(tdPrice);
      tr.appendChild(tdStock);
      tr.appendChild(tdAct);
      frag.appendChild(tr);
    });

    tbodyEl.appendChild(frag);
  }

  // ── Tab 2: Add Single Item & Batch Paste Importer ───────────────────────────
  const addDivisionSel = $("#add-division");
  const addSectionSel = $("#add-section");
  const addCategorySel = $("#add-category");
  const addNewCategoryInput = $("#add-new-category");
  const addItemNameInput = $("#add-item-name");
  const addBasePriceInput = $("#add-base-price");
  const addMarkupSel = $("#add-markup-preset");
  const addFinalPriceInput = $("#add-final-price");
  const addWarrantyInput = $("#add-warranty");
  const addStockSel = $("#add-stock-status");
  const addSingleForm = $("#admin-add-single-form");

  function syncAddFormDropdowns() {
    if (!addDivisionSel || !addSectionSel) return;
    const isNew = addDivisionSel.value === "new";
    const secs = isNew ? getNewSections() : getUsedSections();
    addSectionSel.innerHTML = "";
    secs.forEach((sec) => {
      const opt = document.createElement("option");
      opt.value = sec.id;
      opt.textContent = sec.label;
      addSectionSel.appendChild(opt);
    });
    if (addMarkupSel) {
      addMarkupSel.value = isNew ? "750" : "2000";
    }
    if (addWarrantyInput) {
      addWarrantyInput.value = isNew
        ? "Brand New · Store Warranty"
        : "06 Months Testing Warranty";
    }
    syncAddCategoryDropdown();
  }

  function syncAddCategoryDropdown() {
    if (!addDivisionSel || !addSectionSel || !addCategorySel) return;
    const isNew = addDivisionSel.value === "new";
    const secs = isNew ? getNewSections() : getUsedSections();
    const sec = secs.find((s) => s.id === addSectionSel.value) || secs[0];
    addCategorySel.innerHTML = "";
    if (!sec) return;
    (sec.categories || []).forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.name;
      addCategorySel.appendChild(opt);
    });
  }

  function autoComputeFinalPrice() {
    if (!addBasePriceInput || !addMarkupSel || !addFinalPriceInput) return;
    const baseRaw = addBasePriceInput.value.trim();
    if (!baseRaw) return;
    const baseVal = Number(baseRaw);
    const markupVal = Number(addMarkupSel.value) || 0;
    if (Number.isFinite(baseVal)) {
      addFinalPriceInput.value = String(Math.round(baseVal + markupVal));
    }
  }

  if (addDivisionSel) addDivisionSel.addEventListener("change", syncAddFormDropdowns);
  if (addSectionSel) addSectionSel.addEventListener("change", syncAddCategoryDropdown);
  if (addBasePriceInput) addBasePriceInput.addEventListener("input", autoComputeFinalPrice);
  if (addMarkupSel) addMarkupSel.addEventListener("change", autoComputeFinalPrice);

  function slugify(str) {
    return (
      String(str || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) +
      "-" +
      Math.floor(1000 + Math.random() * 9000)
    );
  }

  function resolveTargetCategoryForAdd() {
    const isNew = addDivisionSel && addDivisionSel.value === "new";
    const secs = isNew ? getNewSections() : getUsedSections();
    const sec = secs.find((s) => s.id === (addSectionSel && addSectionSel.value)) || secs[0];
    if (!sec) return null;

    const customCatName = addNewCategoryInput ? addNewCategoryInput.value.trim() : "";
    if (customCatName) {
      let existing = (sec.categories || []).find(
        (c) => c.name.toLowerCase() === customCatName.toLowerCase()
      );
      if (!existing) {
        existing = {
          id: slugify(customCatName),
          name: customCatName,
          icon: sec.icon || "inventory_2",
          items: [],
        };
        sec.categories.push(existing);
      }
      return { sec, cat: existing, isNew };
    }

    const cat =
      (sec.categories || []).find((c) => c.id === (addCategorySel && addCategorySel.value)) ||
      sec.categories[0];
    return { sec, cat, isNew };
  }

  if (addSingleForm) {
    addSingleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = resolveTargetCategoryForAdd();
      if (!target || !target.cat) {
        showToast("Please select a valid department & subcategory.", "warn");
        return;
      }

      const name = addItemNameInput ? addItemNameInput.value.trim() : "";
      if (!name) return;

      const baseRaw = addBasePriceInput ? addBasePriceInput.value.trim() : "";
      const finalRaw = addFinalPriceInput ? addFinalPriceInput.value.trim() : "";
      const baseNum = baseRaw !== "" ? Number(baseRaw) : undefined;
      const finalNum = finalRaw !== "" ? Number(finalRaw) : undefined;

      const newItem = {
        id: slugify(name),
        name,
        condition: target.isNew ? "new" : "used",
        warranty:
          (addWarrantyInput && addWarrantyInput.value.trim()) ||
          (target.isNew ? "Brand New · Store Warranty" : "06 Months Testing Warranty"),
        inStock: !addStockSel || addStockSel.value !== "out",
      };

      if (target.isNew) {
        newItem.specs = "Brand New";
      }
      if (baseNum !== undefined && Number.isFinite(baseNum)) {
        newItem.retailPrice = Math.round(baseNum);
      }
      if (finalNum !== undefined && Number.isFinite(finalNum)) {
        newItem.price = Math.round(finalNum);
      }

      target.cat.items.push(newItem);
      if (addItemNameInput) addItemNameInput.value = "";
      if (addBasePriceInput) addBasePriceInput.value = "";
      if (addFinalPriceInput) addFinalPriceInput.value = "";
      if (addNewCategoryInput) addNewCategoryInput.value = "";

      syncAddCategoryDropdown();
      populateDeptDropdown();
      renderItemsTable();
      markChanged(1);
      showToast('Added "' + name + '" to ' + target.sec.label, "success");
    });
  }

  // Batch Importer
  const batchForm = $("#admin-batch-form");
  const batchLinesInput = $("#batch-lines");
  const batchMarkupSel = $("#batch-markup");

  if (batchForm) {
    batchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = resolveTargetCategoryForAdd();
      if (!target || !target.cat) {
        showToast("Select a target Department first.", "warn");
        return;
      }
      const rawText = batchLinesInput ? batchLinesInput.value.trim() : "";
      if (!rawText) {
        showToast("Paste at least one line in format: Item Name | Price", "warn");
        return;
      }
      const markup = Number(batchMarkupSel ? batchMarkupSel.value : 0) || 0;
      const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      let addedCount = 0;

      lines.forEach((line) => {
        const parts = line.split("|").map((p) => p.trim());
        const itemName = parts[0];
        if (!itemName) return;
        const pricePart = parts[1] ? Number(parts[1].replace(/,/g, "")) : NaN;

        const newItem = {
          id: slugify(itemName),
          name: itemName,
          condition: target.isNew ? "new" : "used",
          warranty: target.isNew ? "Brand New · Store Warranty" : "06 Months Testing Warranty",
          inStock: true,
        };
        if (target.isNew) newItem.specs = "Brand New";
        if (Number.isFinite(pricePart) && pricePart > 0) {
          newItem.retailPrice = Math.round(pricePart);
          newItem.price = Math.round(pricePart + markup);
        }
        target.cat.items.push(newItem);
        addedCount++;
      });

      if (addedCount > 0) {
        if (batchLinesInput) batchLinesInput.value = "";
        syncAddCategoryDropdown();
        populateDeptDropdown();
        renderItemsTable();
        markChanged(addedCount);
        showToast("Imported " + addedCount + " item(s) into " + target.sec.label, "success");
      }
    });
  }

  // ── Tab 3: Bulk Price Adjuster, Export, Import & Passcode ──────────────────
  const bulkForm = $("#admin-bulk-price-form");
  const bulkTargetSel = $("#bulk-target");
  const bulkModeSel = $("#bulk-mode");
  const bulkAmountInput = $("#bulk-amount");

  if (bulkForm) {
    bulkForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const targetKind = bulkTargetSel ? bulkTargetSel.value : "used";
      const mode = bulkModeSel ? bulkModeSel.value : "retail-plus";
      const amount = Number(bulkAmountInput ? bulkAmountInput.value : 0);
      if (!Number.isFinite(amount)) return;

      let itemsToUpdate = [];
      if (targetKind === "filtered") {
        itemsToUpdate = getFilteredRowRecords().map((r) => r.item);
      } else {
        const secs = targetKind === "new" ? getNewSections() : getUsedSections();
        secs.forEach((sec) =>
          (sec.categories || []).forEach((cat) =>
            (cat.items || []).forEach((it) => itemsToUpdate.push(it))
          )
        );
      }

      if (itemsToUpdate.length === 0) {
        showToast("No items in selected scope.", "warn");
        return;
      }

      if (
        !window.confirm(
          "Apply bulk price update across " + itemsToUpdate.length + " item(s)?"
        )
      ) {
        return;
      }

      let updated = 0;
      itemsToUpdate.forEach((it) => {
        if (mode === "retail-plus") {
          if (typeof it.retailPrice === "number" && Number.isFinite(it.retailPrice)) {
            const nextP = Math.max(0, Math.round(it.retailPrice + amount));
            syncSharedItemById(it.id, (shared) => {
              shared.price = nextP;
            });
            updated++;
          }
        } else if (mode === "add-flat") {
          if (typeof it.price === "number" && Number.isFinite(it.price)) {
            const nextP = Math.max(0, Math.round(it.price + amount));
            syncSharedItemById(it.id, (shared) => {
              shared.price = nextP;
            });
            updated++;
          }
        } else if (mode === "percent") {
          if (typeof it.price === "number" && Number.isFinite(it.price)) {
            const rawNext = it.price * (1 + amount / 100);
            const rounded = Math.max(0, Math.round(rawNext / 10) * 10);
            syncSharedItemById(it.id, (shared) => {
              shared.price = rounded;
            });
            updated++;
          }
        }
      });

      renderItemsTable();
      markChanged(updated || 1);
      showToast("Bulk updated " + updated + " item price(s)!", "success");
    });
  }

  // Export catalog.js
  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }

  function generateCatalogJsContent() {
    recomputeCatalogTotals();
    const cleanData = {
      siteName: catalog.siteName || "Aqua PC Parts",
      whatsappPhone: catalog.whatsappPhone || "94788194535",
      whatsappDirectBase: catalog.whatsappDirectBase || "https://wa.me/94788194535",
      mainSiteUrl: catalog.mainSiteUrl || "https://aquapcsolutions.yyth.workers.dev/",
      markupLkr: catalog.markupLkr || 2000,
      totalItems: catalog.totalItems,
      usedTotalItems: catalog.usedTotalItems,
      brandNewTotalItems: catalog.brandNewTotalItems,
      sectionItemCounts: catalog.sectionItemCounts,
      brandNewSectionItemCounts: catalog.brandNewSectionItemCounts,
      sections: getUsedSections(),
      usedSections: getUsedSections(),
      brandNewSections: getNewSections(),
    };
    return (
      "// Auto-generated catalog for Aqua PC Parts (Updated via Admin Panel: " +
      new Date().toISOString() +
      ")\nwindow.AQUA_PARTS_CATALOG = " +
      JSON.stringify(cleanData, null, 2) +
      ";\n" +
      "// Live Catalog Sync Runtime preserved\n" +
      "window.__AQUA_SYNC_RUNTIME_FN__ = " +
      String(window.__AQUA_SYNC_RUNTIME_FN__ || function () {}) +
      ";\nwindow.__AQUA_SYNC_RUNTIME_FN__();\n"
    );
  }

  const btnDownloadCatalog = $("#btn-download-catalog");
  const btnExportJs = $("#btn-export-js");
  const btnExportJson = $("#btn-export-json");
  const btnExportCsv = $("#btn-export-csv");
  const inputImportJson = $("#input-import-json");

  if (btnDownloadCatalog) {
    btnDownloadCatalog.addEventListener("click", () => {
      downloadFile("catalog.js", generateCatalogJsContent(), "application/javascript");
      showToast("Downloaded catalog.js", "success");
    });
  }
  if (btnExportJs) {
    btnExportJs.addEventListener("click", () => {
      downloadFile("catalog.js", generateCatalogJsContent(), "application/javascript");
      showToast("Downloaded catalog.js", "success");
    });
  }
  if (btnExportJson) {
    btnExportJson.addEventListener("click", () => {
      recomputeCatalogTotals();
      const jsonStr = JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          usedSections: getUsedSections(),
          brandNewSections: getNewSections(),
        },
        null,
        2
      );
      downloadFile("aqua-pc-parts-backup.json", jsonStr, "application/json");
      showToast("Exported JSON backup", "success");
    });
  }
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
      const lines = ["Division,Department,Subcategory,Item ID,Item Name,Base Price (LKR),Selling Price (LKR),Stock Status"];
      const appendSecs = (divName, secs) => {
        secs.forEach((sec) => {
          (sec.categories || []).forEach((cat) => {
            (cat.items || []).forEach((it) => {
              const row = [
                divName,
                '"' + String(sec.label || "").replace(/"/g, '""') + '"',
                '"' + String(cat.name || "").replace(/"/g, '""') + '"',
                it.id || "",
                '"' + String(it.name || "").replace(/"/g, '""') + '"',
                typeof it.retailPrice === "number" ? it.retailPrice : "",
                typeof it.price === "number" ? it.price : "Inquiry",
                it.inStock === false ? "Out of Stock" : "In Stock",
              ];
              lines.push(row.join(","));
            });
          });
        });
      };
      appendSecs("Used Parts", getUsedSections());
      appendSecs("Brand New", getNewSections());
      downloadFile("aqua-pc-parts-prices.csv", lines.join("\n"), "text/csv;charset=utf-8");
      showToast("Exported CSV price sheet", "success");
    });
  }

  if (inputImportJson) {
    inputImportJson.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));
          const data = parsed.catalog ? parsed.catalog : parsed;
          if (!data.usedSections && !data.sections && !data.brandNewSections) {
            showToast("Invalid backup JSON file.", "warn");
            return;
          }
          if (typeof window.applyAquaCatalogOverride === "function") {
            window.applyAquaCatalogOverride(data, false);
          }
          markChanged(1);
          refreshAllUI();
          showToast("Imported JSON catalog successfully! Click Save & Publish Live.", "success");
        } catch (_) {
          showToast("Could not parse JSON file.", "warn");
        }
      };
      reader.readAsText(file);
    });
  }

  // Passcode update form
  const passcodeForm = $("#admin-passcode-form");
  const newPassInput = $("#new-admin-passcode");
  if (passcodeForm) {
    passcodeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nextPass = newPassInput ? newPassInput.value.trim() : "";
      if (nextPass.length < 4) {
        showToast("Passcode must be at least 4 characters.", "warn");
        return;
      }
      try {
        localStorage.setItem(LOCAL_CUSTOM_PASS_KEY, nextPass);
      } catch (_) {}

      if (typeof fetch === "function" && /^https?:/i.test(window.location.protocol)) {
        try {
          const res = await fetch("/api/catalog", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Admin-Passcode": state.passcode,
            },
            body: JSON.stringify({
              action: "change-passcode",
              passcode: state.passcode,
              newPasscode: nextPass,
            }),
          });
          if (res.ok) {
            state.passcode = nextPass;
            try { sessionStorage.setItem(SESSION_PASS_KEY, nextPass); } catch (_) {}
          }
        } catch (_) {}
      }
      state.passcode = nextPass;
      if (newPassInput) newPassInput.value = "";
      showToast("Admin passcode updated!", "success");
    });
  }

  // Factory Reset
  const btnResetFactory = $("#btn-reset-factory");
  if (btnResetFactory) {
    btnResetFactory.addEventListener("click", async () => {
      if (
        !window.confirm(
          "Reset all prices and items back to the original factory catalog?"
        )
      ) {
        return;
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}

      if (window.AQUA_PARTS_DEFAULT_CATALOG && typeof window.applyAquaCatalogOverride === "function") {
        const clone = JSON.parse(JSON.stringify(window.AQUA_PARTS_DEFAULT_CATALOG));
        window.applyAquaCatalogOverride(clone, false);
      }

      if (typeof fetch === "function" && /^https?:/i.test(window.location.protocol)) {
        try {
          await fetch("/api/catalog", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Admin-Passcode": state.passcode,
            },
            body: JSON.stringify({ action: "reset", passcode: state.passcode }),
          });
        } catch (_) {}
      }

      state.unsavedCount = 0;
      updateUnsavedUI();
      refreshAllUI();
      showToast("Catalog reset to factory baseline.", "success");
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function refreshAllUI() {
    updateKPIs();
    populateDeptDropdown();
    syncAddFormDropdowns();
    renderItemsTable();
    updateUnsavedUI();
  }

  window.addEventListener("aqua:catalog-updated", () => {
    if (state.unlocked) refreshAllUI();
  });
})();
