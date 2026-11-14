(function () {
  "use strict";

  const catalog = window.AQUA_PARTS_CATALOG || {};
  const USED = catalog.usedSections || catalog.sections || [];
  const NEW = catalog.brandNewSections || [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const countItems = (secs) =>
    secs.reduce((s, sec) => s + sec.categories.reduce((c, cat) => c + cat.items.length, 0), 0);
  const secCount = (sec) => sec.categories.reduce((c, cat) => c + cat.items.length, 0);

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

  // ── Theme ───────────────────────────────────────────────────────────────────
  const themeBtn = $("#theme-toggle-btn");
  const themeIcon = $("#theme-toggle-icon");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (themeIcon) themeIcon.textContent = t === "dark" ? "light_mode" : "dark_mode";
    try { localStorage.setItem("aqua-parts-theme", t); } catch (_) {}
    initCanvasColors();
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
    a.textContent = "Brand New Peripherals";
    li.appendChild(a);
    footerDept.appendChild(li);
  }

  const yearEl = $("#footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ── Quote badge (shared localStorage with catalog pages) ────────────────────
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

  // ── Smart search → routes to the page with most matches ─────────────────────
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
  const searchForm = $("#header-search-form");
  const searchInput = $("#global-search-input");
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = searchInput.value.trim();
      if (!raw) return;
      const q = raw.toLowerCase();
      const page = countMatches(NEW, q) > countMatches(USED, q) ? "brand-new-parts.html" : "used-parts.html";
      window.location.href = "./" + page + "?q=" + encodeURIComponent(raw);
    });
  }
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      searchInput &&
      !["INPUT", "TEXTAREA", "SELECT"].includes((document.activeElement || {}).tagName)
    ) {
      e.preventDefault();
      searchInput.focus();
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
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
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
    const dur = 1500;
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
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  // ── Rotating headline word ──────────────────────────────────────────────────
  const words = [
    "Graphics Cards",
    "Processors",
    "Motherboards",
    "NVMe Storage",
    "Gaming Peripherals",
    "Memory & Power",
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
      }, 380);
    }, 2600);
  }

  // ── Marquee duplicate for seamless loop ─────────────────────────────────────
  const track = $("#marquee-track");
  if (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  }

  // ── Department tiles + tab switcher ─────────────────────────────────────────
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
      a.style.animationDelay = i * 45 + "ms";
      a.innerHTML =
        '<span class="lp-dept-icon material-symbols-outlined">' + sec.icon + "</span>" +
        '<span class="lp-dept-name">' + sec.label + "</span>" +
        '<span class="lp-dept-meta"><b>' + secCount(sec) + "</b> items" +
        '<span class="material-symbols-outlined">arrow_outward</span></span>';
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

  // ── Spotlight + tilt + magnetic ─────────────────────────────────────────────
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
          "perspective(900px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-3px)";
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
        const x = (e.clientX - (r.left + r.width / 2)) * 0.16;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.22;
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // ── Chip stage parallax ─────────────────────────────────────────────────────
  const stage = $("#chip-stage");
  const hero = $(".lp-hero");
  if (stage && hero && !reduceMotion) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--rx", (-py * 10).toFixed(2) + "deg");
      stage.style.setProperty("--ry", (px * 14).toFixed(2) + "deg");
    });
    hero.addEventListener("pointerleave", () => {
      stage.style.setProperty("--rx", "0deg");
      stage.style.setProperty("--ry", "0deg");
    });
  }

  // ── Hero canvas: interactive circuit-node network ───────────────────────────
  const canvas = $("#hero-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let nodes = [];
  let W = 0, H = 0, dpr = 1;
  let colorA = "6,214,224";
  let colorB = "52,211,153";
  const mouse = { x: -9999, y: -9999 };
  let running = false;
  let rafId = 0;

  function initCanvasColors() {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    colorA = light ? "8,145,178" : "6,214,224";
    colorB = light ? "5,150,105" : "52,211,153";
  }
  initCanvasColors();

  function resizeCanvas() {
    if (!canvas || !ctx || !hero) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(28, Math.min(80, Math.round((W * H) / 20000)));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.7,
      c: Math.random() > 0.5 ? 0 : 1,
    }));
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const maxD = 140;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;

      const mdx = a.x - mouse.x;
      const mdy = a.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 130) {
        a.x += (mdx / md) * 0.6;
        a.y += (mdy / md) * 0.6;
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = "rgba(" + colorA + "," + (0.16 * (1 - d / maxD)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(" + (a.c ? colorB : colorA) + ",0.75)";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(loop);
  }

  if (canvas && ctx && hero) {
    resizeCanvas();
    let resizeT;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(resizeCanvas, 150);
    });
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => {
      mouse.x = mouse.y = -9999;
    });

    if (reduceMotion) {
      draw();
    } else {
      const vio = new IntersectionObserver((entries) => {
        const vis = entries[0].isIntersecting;
        if (vis && !running) {
          running = true;
          loop();
        } else if (!vis) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      });
      vio.observe(hero);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      });
    }
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
})();
