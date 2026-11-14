(function () {
  "use strict";
  const C = window.AQUA_PARTS_CATALOG || {};
  const PHONE = C.whatsappPhone || "94788194535";
  const CART_KEY = "aqua-shop-cart-v1";
  const PAGE = 24;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmtLKR = (n) => Number(n).toLocaleString("en-LK") + " LKR";
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const getPartImg =
    typeof window.getAquaPartImage === "function"
      ? window.getAquaPartImage
      : () => "assets/parts/gpu-prime.webp";
  const getPartFallback =
    typeof window.getAquaPartFallback === "function"
      ? window.getAquaPartFallback
      : () => "assets/parts/gpu-prime.webp";
  const getCatImg =
    typeof window.getAquaCategoryIcon === "function"
      ? window.getAquaCategoryIcon
      : () => "assets/cats/expansion.webp";

  let PRODUCTS = [];
  let CATS = [];

  function build() {
    const used = C.usedSections || C.sections || [];
    const fresh = C.brandNewSections || [];
    const seen = new Set();
    PRODUCTS = [];
    CATS = [];

    const newIds = new Set();
    fresh.forEach((sec) =>
      (sec.categories || []).forEach((sub) =>
        (sub.items || []).forEach((it) => newIds.add(it.id))
      )
    );

    const addSection = (sec, div, skipSet) => {
      const cat = {
        id: sec.id,
        label: sec.label,
        div,
        iconImg: getCatImg(sec.id),
        count: 0,
        subcats: [],
      };
      (sec.categories || []).forEach((sub) => {
        let subCount = 0;
        (sub.items || []).forEach((it) => {
          if (skipSet && skipSet.has(it.id)) return;
          if (seen.has(it.id)) return;
          seen.add(it.id);

          const isNew = it.condition === "new" || div === "new";
          const price = typeof it.price === "number" ? it.price : null;
          const img = getPartImg(it, sec.id, sub.name);
          const fallbackImg = getPartFallback(it, sec.id, sub.name);

          PRODUCTS.push({
            id: it.id,
            name: it.name,
            price,
            inStock: it.inStock !== false,
            cond: isNew ? "new" : "used",
            warranty: it.warranty || (isNew ? "Brand New · Store Warranty" : "06 Months Testing Warranty"),
            specs: it.specs || "",
            sec: sec.id,
            secLabel: sec.label,
            sub: sub.name || "",
            img,
            fallbackImg,
            order: PRODUCTS.length,
          });
          cat.count++;
          subCount++;
        });
        if (sub.name && subCount > 0) {
          cat.subcats.push({ name: sub.name, count: subCount });
        }
      });
      if (cat.count > 0) CATS.push(cat);
    };

    used.forEach((s) => addSection(s, "used", s.id === "peripherals" ? newIds : null));
    fresh.forEach((s) => addSection(s, "new", null));
  }

  // ───────── Cart & Official Quote Printer ─────────
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (_) {}
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {} };
  const prod = (id) => PRODUCTS.find((p) => p.id === id);

  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function addToCart(id) {
    const p = prod(id);
    if (!p) return;
    const row = cart.find((c) => c.id === id);
    if (row) row.qty++;
    else cart.push({ id, name: p.name, qty: 1 });
    saveCart();
    renderCart();
    toast("Added to Cart: " + p.name);
  }

  function renderCart() {
    let total = 0, qty = 0, unpriced = 0;
    const lines = cart.map((c) => {
      const p = prod(c.id);
      const price = p && p.price != null ? p.price : null;
      qty += c.qty;
      if (price != null) total += price * c.qty;
      else unpriced++;
      return { c, p, price };
    });

    $("#cart-count").textContent = qty;
    $("#cart-total-top").textContent = fmtLKR(total);
    $("#cart-sub").textContent = fmtLKR(total) + (unpriced ? " + " + unpriced + " TBC" : "");

    const box = $("#cart-items");
    if (!lines.length) {
      box.innerHTML =
        '<div class="cart-empty"><span class="material-symbols-outlined">shopping_cart</span><p>Your cart is empty</p></div>';
    } else {
      box.innerHTML = lines
        .map(
          ({ c, p, price }) =>
            '<div class="cart-row"><img src="' +
            esc(p ? p.img : "assets/parts/gpu-prime.webp") +
            '" onerror="this.onerror=null;this.src=\'' +
            esc(p ? p.fallbackImg : "assets/parts/gpu-prime.webp") +
            '\'" alt="" /><div class="cr-info"><b>' +
            esc(c.name) +
            "</b><span>" +
            (price != null ? fmtLKR(price) : "Call for price") +
            '</span><div class="qty"><button type="button" data-q="-1" data-id="' +
            esc(c.id) +
            '">−</button><i>' +
            c.qty +
            '</i><button type="button" data-q="1" data-id="' +
            esc(c.id) +
            '">+</button></div></div><button type="button" class="rm" data-rm="' +
            esc(c.id) +
            '" aria-label="Remove"><span class="material-symbols-outlined">delete</span></button></div>'
        )
        .join("");
    }

    const msg = lines.length
      ? "Hello Aqua PC Parts, I would like to order / request a quotation:\n" +
        lines
          .map(
            ({ c, price }, i) =>
              i + 1 + ". " + c.name + " x" + c.qty + " – " + (price != null ? fmtLKR(price * c.qty) : "Price TBC")
          )
          .join("\n") +
        "\n\nEstimated Subtotal: " +
        fmtLKR(total) +
        (unpriced ? " + " + unpriced + " item(s) price TBC" : "")
      : "Hello Aqua PC Parts";
    $("#cart-checkout").href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
  }

  function printOfficialQuotation() {
    if (!cart.length) {
      toast("Add at least one item to your cart first.");
      return;
    }
    let total = 0, unpriced = 0;
    const rows = cart
      .map((c, idx) => {
        const p = prod(c.id);
        const unit = p && p.price != null ? p.price : null;
        const lineTotal = unit != null ? unit * c.qty : null;
        if (lineTotal != null) total += lineTotal;
        else unpriced++;
        return (
          "<tr><td>" + (idx + 1) + "</td><td><strong>" + esc(c.name) + "</strong><br/><small>" +
          esc(p ? p.warranty : "Warranty Included") + "</small></td><td>" +
          esc(p ? (p.cond === "new" ? "Brand New" : "Used · Tested") : "—") +
          "</td><td>" + c.qty + "</td><td>" +
          (unit != null ? fmtLKR(unit) : "Call / TBC") + "</td><td><strong>" +
          (lineTotal != null ? fmtLKR(lineTotal) : "TBC") + "</strong></td></tr>"
        );
      })
      .join("");

    const quoteNo = "AQP-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.floor(100 + Math.random() * 900);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Quotation ${quoteNo} - Aqua PC Parts</title>
<style>body{font-family:Arial,sans-serif;padding:32px;color:#0f172a;max-width:840px;margin:auto}
.top{display:flex;justify-content:space-between;border-bottom:3px solid #ff9400;padding-bottom:16px;margin-bottom:20px}
h1{margin:0;color:#1c1c1c;font-size:24px}small{color:#64748b}
table{width:100%;border-collapse:collapse;margin-top:14px}
th,td{border:1px solid #cbd5e1;padding:10px;text-align:left;font-size:13.5px}
th{background:#1c1c1c;color:#ff9400}
.tot{margin-top:18px;text-align:right;font-size:18px}
.note{margin-top:24px;padding:12px;background:#fff8ec;border-left:4px solid #ff9400;font-size:12.5px;color:#475569}
@media print{.noprint{display:none}}</style></head><body>
<div class="top"><div style="display:flex;align-items:center;gap:14px"><img src="assets/logo.jpg" alt="Aqua PC Parts" style="width:54px;height:54px;border-radius:10px;object-fit:cover" /><div><h1>AQUA PC PARTS</h1><div>Aqua PC Solutions · Embilipitiya, Sri Lanka</div><div>Tel / WhatsApp: +94 78 819 4535</div></div></div>
<div style="text-align:right"><strong>QUOTATION #${quoteNo}</strong><div>Date: ${new Date().toLocaleDateString("en-LK")}</div></div></div>
<table><thead><tr><th>#</th><th>Item &amp; Warranty</th><th>Condition</th><th>Qty</th><th>Unit Price</th><th>Line Total</th></tr></thead><tbody>${rows}</tbody></table>
<div class="tot"><strong>Estimated Total: ${fmtLKR(total)}${unpriced ? " (+ " + unpriced + " item TBC)" : ""}</strong></div>
<div class="note">Used hardware is 24-hour bench-tested and includes a 06-month testing warranty. Prices are valid for 48 hours subject to stock confirmation on WhatsApp (+94 78 819 4535).</div>
<p class="noprint" style="margin-top:20px"><button onclick="window.print()" style="padding:10px 18px;background:#ff9400;color:#1c1c1c;border:0;border-radius:6px;cursor:pointer;font-weight:bold">Print / Save as PDF</button></p>
</body></html>`;
    const win = window.open("", "_blank");
    if (!win) {
      toast("Allow pop-ups to open printable quotation.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function drawer(open) {
    $("#drawer").hidden = false;
    $("#overlay").hidden = false;
    requestAnimationFrame(() => {
      $("#drawer").classList.toggle("open", open);
      $("#overlay").classList.toggle("open", open);
    });
    if (!open) {
      setTimeout(() => {
        if (!$("#drawer").classList.contains("open")) {
          $("#drawer").hidden = true;
          $("#overlay").hidden = true;
        }
      }, 280);
    }
  }

  // ───────── Exact Nanotek.lk Product Card ─────────
  function productCard(p) {
    const catLine = p.sub ? p.secLabel + " · " + p.sub : p.secLabel;
    const priceHtml =
      p.price != null
        ? '<h2 class="ty-productBlock-price-retail">' + fmtLKR(p.price) + "</h2>"
        : '<h2 class="ty-productBlock-price-retail is-call">Call for Price</h2>';
    const badgeCls = p.cond === "new" ? "nt-cond-pill is-new" : "nt-cond-pill";
    const badgeTxt = p.cond === "new" ? "Brand New" : "Used · 06M Warranty";

    return (
      '<li class="ty-catPage-productListItem' + (p.inStock ? "" : " oos") + '">' +
      '<div class="ty-productBlock-wrap">' +
      '<div class="ty-productBlock">' +
      '<div class="ty-specialIconHolder"><span class="' + badgeCls + '">' + badgeTxt + "</span></div>" +
      '<div class="ty-productBlock-imgHolder"><img src="' + esc(p.img) + '" onerror="this.onerror=null;this.src=\'' + esc(p.fallbackImg) + '\'" alt="' + esc(p.name) + '" loading="lazy" /></div>' +
      '<div class="ty-productBlock-content">' +
      '<div class="ty-productBlock-title"><h1 title="' + esc(p.name) + '">' + esc(p.name) + "</h1></div>" +
      '<span class="ty-productBlock-cat" title="' + esc(catLine) + '">' + esc(catLine) + "</span>" +
      '<div class="ty-productBlock-price">' + priceHtml + "</div>" +
      "</div>" +
      '<div class="ty-product-quoteBtn">' +
      (p.inStock
        ? '<button type="button" class="js-add-quote-btn" data-add="' + esc(p.id) + '">Add to Cart</button>'
        : '<a class="js-add-quote-btn" target="_blank" rel="noopener" href="https://wa.me/' + PHONE + "?text=" + encodeURIComponent("Hi, is " + p.name + " back in stock?") + '">Ask Stock</a>') +
      '<a class="nt-wa-mini" target="_blank" rel="noopener" aria-label="Order on WhatsApp" href="https://wa.me/' +
      PHONE + "?text=" + encodeURIComponent("Hi Aqua PC Parts, interested in: " + p.name + (p.price != null ? " (" + fmtLKR(p.price) + ")" : "")) +
      '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.7.63.72.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 7c0 5.45-4.44 9.88-9.89 9.88M20.46 3.49A11.8 11.8 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 005.68 1.45c6.55 0 11.89-5.34 11.9-11.9 0-3.18-1.24-6.17-3.48-8.41"/></svg></a>' +
      "</div>" +
      '<div class="ty-productBlock-specialMsg"><span class="' + (p.inStock ? "" : "out") + '">' +
      (p.inStock ? "In Stock" : "Out of Stock") +
      "</span></div>" +
      '<div class="ty-product-hoverBlock-wrap"><div class="ty-product-hoverBlock"></div></div>' +
      "</div></div></li>"
    );
  }

  // ───────── Filters & State ─────────
  const F = { div: "all", cat: "", sub: "", q: "", min: null, max: null, stock: false, priced: false, sort: "default", shown: PAGE };
  let filtered = [];

  function apply() {
    const q = F.q.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    filtered = PRODUCTS.filter((p) => {
      if (F.div !== "all" && p.cond !== F.div) return false;
      if (F.cat && p.sec !== F.cat) return false;
      if (F.sub && p.sub !== F.sub) return false;
      if (F.stock && !p.inStock) return false;
      if (F.priced && p.price == null) return false;
      if (F.min != null && (p.price == null || p.price < F.min)) return false;
      if (F.max != null && (p.price == null || p.price > F.max)) return false;
      if (words.length) {
        const hay = (p.name + " " + p.secLabel + " " + p.sub + " " + p.specs).toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });

    const priceKey = (p, dir) => (p.price == null ? (dir > 0 ? Infinity : -1) : p.price);
    if (F.sort === "low") filtered.sort((a, b) => priceKey(a, 1) - priceKey(b, 1));
    else if (F.sort === "high") filtered.sort((a, b) => priceKey(b, -1) - priceKey(a, -1));
    else if (F.sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => a.order - b.order);

    renderGrid();
  }

  function renderSubcats() {
    const box = $("#f-subcats");
    const activeCat = CATS.find((c) => c.id === F.cat);
    if (!activeCat || activeCat.subcats.length <= 1) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML =
      '<button type="button" data-sub="" class="' + (F.sub === "" ? "on" : "") + '">All ' + esc(activeCat.label) + "</button>" +
      activeCat.subcats
        .map(
          (s) =>
            '<button type="button" data-sub="' + esc(s.name) + '" class="' + (F.sub === s.name ? "on" : "") + '">' +
            esc(s.name) + " (" + s.count + ")</button>"
        )
        .join("");
  }

  function renderGrid() {
    const slice = filtered.slice(0, F.shown);
    $("#grid").innerHTML = slice.map(productCard).join("");
    $("#result-count").textContent = filtered.length + " product" + (filtered.length === 1 ? "" : "s");
    $("#empty").hidden = filtered.length > 0;
    $("#load-more-wrap").hidden = filtered.length <= F.shown;

    const activeCatObj = CATS.find((c) => c.id === F.cat);
    $("#active-cat-title").textContent = activeCatObj
      ? activeCatObj.label
      : F.div === "new"
      ? "Brand New Parts & Accessories"
      : F.div === "used"
      ? "Used Bench-Tested Hardware"
      : "All PC Parts";

    renderSubcats();

    $$("#side-cats li, #mobile-cats li").forEach((li) => {
      const a = li.querySelector("a");
      li.classList.toggle("active", a && a.dataset.cat === F.cat);
    });

    const chips = [];
    if (F.cat) {
      chips.push(["cat", activeCatObj ? activeCatObj.label : F.cat]);
    }
    if (F.sub) chips.push(["sub", F.sub]);
    if (F.div !== "all") chips.push(["div", F.div === "new" ? "Brand New" : "Used · 06M Warranty"]);
    if (F.q) chips.push(["q", "“" + F.q + "”"]);
    $("#chips").innerHTML = chips
      .map(([k, l]) => '<button type="button" class="chip" data-chip="' + k + '">' + esc(l) + ' <span class="material-symbols-outlined">close</span></button>')
      .join("");
  }

  function setFilters(patch, scroll) {
    if (patch.cat !== undefined && patch.cat !== F.cat && patch.sub === undefined) {
      patch.sub = "";
    }
    Object.assign(F, patch, { shown: PAGE });
    apply();
    if (scroll) $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ───────── Populate Sidebars, Search Dropdown & Showcase Tabs ─────────
  function renderStatic() {
    const catListHtml = CATS.map(
      (c) =>
        '<li class="ty-catListItem"><a href="#shop" data-cat="' + esc(c.id) + '">' +
        '<div class="ty-catIconWrap"><img src="' + esc(c.iconImg) + '" alt="' + esc(c.label) + '" /></div>' +
        '<div class="ty-catTitle"><span>' + esc(c.label) + "</span><em>" + c.count + "</em></div>" +
        "</a></li>"
    ).join("");
    $("#side-cats").innerHTML = catListHtml;
    $("#mobile-cats").innerHTML = catListHtml;

    const sel = $("#search-cat");
    const cur = sel.value;
    sel.innerHTML =
      '<option value="">All Categories (' + PRODUCTS.length + ")</option>" +
      CATS.map((c) => '<option value="' + c.id + '">' + esc(c.label) + " (" + c.count + ")</option>").join("");
    sel.value = cur;

    // Special Offers & Featured Tabs
    const priced = PRODUCTS.filter((p) => p.price != null && p.inStock);
    const specialPicks = [
      ...priced.filter((p) => p.sec === "vga-cards").slice(0, 2),
      ...priced.filter((p) => p.sec === "processors").slice(0, 2),
      ...priced.filter((p) => p.cond === "new").slice(0, 4),
    ].slice(0, 8);
    const featuredPicks = [
      ...priced.filter((p) => p.sec === "vga-cards").slice(4, 6),
      ...priced.filter((p) => p.sec === "motherboards").slice(0, 2),
      ...priced.filter((p) => p.sec === "monitors").slice(0, 2),
      ...priced.filter((p) => p.sec === "ram").slice(0, 2),
    ].slice(0, 8);

    $("#row-special").innerHTML = specialPicks.map(productCard).join("");
    $("#row-featured").innerHTML = featuredPicks.map(productCard).join("");
  }

  // ───────── Hero Slider ─────────
  function slider() {
    const track = $("#slides-track");
    const n = track.children.length;
    let i = 0, timer;
    const dots = $("#dots");
    dots.innerHTML = Array.from({ length: n }, (_, k) => '<li><button type="button" aria-label="Slide ' + (k + 1) + '"></button></li>').join("");
    const go = (k) => {
      i = (k + n) % n;
      track.style.transform = "translateX(" + -i * 100 + "%)";
      $$("#dots button").forEach((d, x) => d.classList.toggle("on", x === i));
    };
    const auto = () => {
      clearInterval(timer);
      timer = setInterval(() => go(i + 1), 5500);
    };
    $("#sl-prev").onclick = () => { go(i - 1); auto(); };
    $("#sl-next").onclick = () => { go(i + 1); auto(); };
    $$("#dots button").forEach((d, x) => (d.onclick = () => { go(x); auto(); }));
    go(0);
    auto();
  }

  // ───────── Instant Search & Fullscreen Search Modal ─────────
  function suggest() {
    const input = $("#search-input"), box = $("#suggest"), sel = $("#search-cat");
    const run = () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.hidden = true; return; }
      const words = q.split(/\s+/);
      const hits = PRODUCTS.filter(
        (p) => (!sel.value || p.sec === sel.value) && words.every((w) => (p.name + " " + p.sub + " " + p.secLabel).toLowerCase().includes(w))
      ).slice(0, 7);
      box.innerHTML = hits.length
        ? hits
            .map(
              (p) =>
                '<button type="button" data-q="' + esc(p.name) + '"><img src="' + esc(p.img) + '" onerror="this.onerror=null;this.src=\'' + esc(p.fallbackImg) + '\'" alt="" />' +
                '<span class="suggest-meta"><strong>' + esc(p.name) + "</strong><small>" +
                esc(p.secLabel) + " · " + esc(p.warranty) + "</small></span><b>" +
                (p.price != null ? fmtLKR(p.price) : "Call") + "</b></button>"
            )
            .join("")
        : '<div class="nores">No matches found — try a broader term or ask Rose AI below</div>';
      box.hidden = false;
    };
    input.addEventListener("input", run);
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-q]");
      if (!b) return;
      input.value = b.dataset.q;
      box.hidden = true;
      setFilters({ q: b.dataset.q, cat: sel.value }, true);
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#search-form")) box.hidden = true;
    });
    $("#search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      box.hidden = true;
      setFilters({ q: input.value, cat: sel.value }, true);
    });

    // Header Nanotek Orange Search Modal
    const modal = $("#search-modal");
    const mIn = $("#modal-search-input");
    const mRes = $("#modal-search-results");
    const openModal = () => {
      modal.hidden = false;
      mIn.value = input.value;
      renderModal();
      setTimeout(() => mIn.focus(), 50);
    };
    const closeModal = () => { modal.hidden = true; };
    const renderModal = () => {
      const q = mIn.value.trim().toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      const hits = (words.length
        ? PRODUCTS.filter((p) => words.every((w) => (p.name + " " + p.secLabel + " " + p.sub).toLowerCase().includes(w)))
        : PRODUCTS.filter((p) => p.price != null && p.inStock)
      ).slice(0, 8);
      mRes.innerHTML = hits
        .map(
          (p) =>
            '<li><button type="button" data-mq="' + esc(p.name) + '"><img src="' + esc(p.img) + '" onerror="this.onerror=null;this.src=\'' + esc(p.fallbackImg) + '\'" alt="" /><strong>' +
            esc(p.name) + "</strong><span>" + (p.price != null ? fmtLKR(p.price) : "Call") + "</span></button></li>"
        )
        .join("");
    };
    $("#search-modal-open").addEventListener("click", openModal);
    $("#search-modal-close").addEventListener("click", closeModal);
    mIn.addEventListener("input", renderModal);
    $("#modal-search-go").addEventListener("click", () => {
      input.value = mIn.value;
      closeModal();
      setFilters({ q: mIn.value, cat: "" }, true);
    });
    mRes.addEventListener("click", (e) => {
      const b = e.target.closest("[data-mq]");
      if (!b) return;
      input.value = b.dataset.mq;
      closeModal();
      setFilters({ q: b.dataset.mq, cat: "" }, true);
    });
  }

  // ───────── Rose AI Hardware Assistant ─────────
  function initRose() {
    const fab = $("#rose-fab"), panel = $("#rose-panel"), closeBtn = $("#rose-close");
    const msgs = $("#rose-msgs"), form = $("#rose-form"), input = $("#rose-input");

    function addMsg(html, who) {
      const div = document.createElement("div");
      div.className = "rmsg " + who;
      div.innerHTML = html;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function toggle(force) {
      const open = force !== undefined ? force : panel.hidden;
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", String(open));
      if (open && msgs.children.length === 0) {
        addMsg(
          "Hi! I'm <strong>Rose</strong>, your Aqua PC Parts assistant. Ask me for prices, parts under a budget (e.g. <em>GPU under 40000</em>), or warranty info.",
          "bot"
        );
      }
      if (open && input) setTimeout(() => input.focus(), 60);
    }

    function answer(raw) {
      const q = raw.trim().toLowerCase();
      addMsg(esc(raw), "user");

      if (/warranty|guarant|test/.test(q)) {
        addMsg(
          "All bench-tested used parts carry a <strong>06-Month Written Testing Warranty</strong>. Brand new peripherals include <strong>Store / Agent Warranty</strong>.",
          "bot"
        );
        return;
      }
      if (/deliver|courier|ship|location|address|where|embilipitiya/.test(q)) {
        addMsg(
          "Our workshop is in <strong>Embilipitiya, Sri Lanka</strong> (Mon–Sat). ESD-safe islandwide delivery available.<br/><a class='rose-wa-link' target='_blank' rel='noopener' href='https://wa.me/" +
            PHONE + "?text=" + encodeURIComponent("Hi, I'd like delivery details from Embilipitiya.") + "'>Ask on WhatsApp →</a>",
          "bot"
        );
        return;
      }

      let maxPrice = null;
      const m = q.match(/(?:under|below|less than|<)\s*(\d+(?:,\d{3})*)\s*(k)?/i);
      if (m) maxPrice = Number(m[1].replace(/,/g, "")) * (m[2] ? 1000 : 1);

      const stop = new Set(["price", "under", "below", "less", "than", "for", "how", "much", "is", "the", "a", "any", "show", "me", "budget", "in", "stock", "parts", "details", "new"]);
      const alias = { gpu: "vga", graphics: "vga", cpu: "processor", intel: "core", mobo: "motherboard", mice: "mouse" };
      const tokens = q
        .replace(/[<>,?]/g, " ")
        .split(/\s+/)
        .filter((w) => w && !stop.has(w) && !/^\d+k?$/.test(w))
        .map((w) => alias[w] || w);

      const matches = PRODUCTS.filter((p) => {
        if (maxPrice !== null && (p.price == null || p.price > maxPrice)) return false;
        if (q.includes("brand new") && p.cond !== "new") return false;
        if (!tokens.length) return true;
        const hay = (p.name + " " + p.secLabel + " " + p.sub).toLowerCase();
        return tokens.some((t) => hay.includes(t));
      })
        .sort((a, b) => (a.price == null ? 9e9 : a.price) - (b.price == null ? 9e9 : b.price))
        .slice(0, 5);

      if (!matches.length) {
        addMsg(
          "No exact match found for <strong>" + esc(raw) +
            "</strong>. Confirm availability with our technicians on WhatsApp:<br/><a class='rose-wa-link' target='_blank' rel='noopener' href='https://wa.me/" +
            PHONE + "?text=" + encodeURIComponent("Hi Aqua PC Parts, looking for: " + raw) + "'>Chat on WhatsApp →</a>",
          "bot"
        );
        return;
      }

      addMsg(
        "Closest matches" + (maxPrice ? " (under " + fmtLKR(maxPrice) + ")" : "") +
          ':<div class="rose-cards">' +
          matches
            .map(
              (p) =>
                '<button type="button" class="rose-item" data-rose-find="' + esc(p.name) + '"><span>' +
                esc(p.name) + "</span><b>" + (p.price != null ? fmtLKR(p.price) : "Call") + "</b></button>"
            )
            .join("") +
          "</div>",
        "bot"
      );
    }

    fab.addEventListener("click", () => toggle());
    closeBtn.addEventListener("click", () => toggle(false));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
      const val = input.value;
      input.value = "";
      answer(val);
    });
    panel.addEventListener("click", (e) => {
      const rq = e.target.closest("[data-rq]");
      if (rq) answer(rq.dataset.rq);
      const rf = e.target.closest("[data-rose-find]");
      if (rf) {
        $("#search-input").value = rf.dataset.roseFind;
        setFilters({ q: rf.dataset.roseFind, cat: "", div: "all" }, true);
      }
    });
  }

  // ───────── Events ─────────
  function bind() {
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) { addToCart(add.dataset.add); return; }

      const link = e.target.closest("a[data-cat], a[data-div]");
      if (link) {
        e.preventDefault();
        const patch = {};
        if (link.dataset.cat !== undefined) patch.cat = link.dataset.cat;
        if (link.dataset.div) {
          patch.div = link.dataset.div;
          if (link.dataset.cat === undefined) patch.cat = "";
        } else if (link.dataset.cat) {
          patch.div = "all";
        }
        patch.q = "";
        $("#search-input").value = "";
        setFilters(patch, true);
        setOffcanvas(false);
        $("#nav-links").classList.remove("open");
        return;
      }

      const qBtn = e.target.closest("[data-q]");
      if (qBtn && qBtn.closest(".qty")) {
        const row = cart.find((c) => c.id === qBtn.dataset.id);
        if (!row) return;
        row.qty += Number(qBtn.dataset.q);
        if (row.qty < 1) cart = cart.filter((c) => c !== row);
        saveCart();
        renderCart();
        return;
      }

      const rm = e.target.closest("[data-rm]");
      if (rm) {
        cart = cart.filter((c) => c !== rm.dataset.rm);
        saveCart();
        renderCart();
        return;
      }

      const chip = e.target.closest("[data-chip]");
      if (chip) {
        const k = chip.dataset.chip;
        if (k === "cat") { F.cat = ""; F.sub = ""; }
        if (k === "sub") F.sub = "";
        if (k === "div") F.div = "all";
        if (k === "q") { F.q = ""; $("#search-input").value = ""; }
        setFilters({});
      }
    });

    // Home Tab Switcher (Special Offers <-> Featured)
    $$(".ty-homeTabs-selectItem").forEach((el) => {
      el.addEventListener("click", () => {
        const t = el.dataset.tab;
        $("#tab-special").classList.toggle("active", t === "special");
        $("#tab-featured").classList.toggle("active", t === "featured");
        $("#panel-special").classList.toggle("active", t === "special");
        $("#panel-featured").classList.toggle("active", t === "featured");
      });
    });

    // Base Filter Buttons
    $$("[data-quick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".ty-catPage-baseFilters li").forEach((li) => li.classList.remove("active"));
        btn.parentElement.classList.add("active");
        const mode = btn.dataset.quick;
        if (mode === "all") setFilters({ div: "all", stock: false, priced: false });
        else if (mode === "used") setFilters({ div: "used" });
        else if (mode === "new") setFilters({ div: "new" });
        else if (mode === "instock") setFilters({ stock: true });
        else if (mode === "priced") setFilters({ priced: true });
      });
    });

    $("#f-subcats").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) setFilters({ sub: b.dataset.sub });
    });
    $("#pmin").addEventListener("input", (e) => setFilters({ min: e.target.value === "" ? null : Number(e.target.value) }));
    $("#pmax").addEventListener("input", (e) => setFilters({ max: e.target.value === "" ? null : Number(e.target.value) }));
    $("#sort").addEventListener("change", (e) => setFilters({ sort: e.target.value }));
    $("#f-reset").addEventListener("click", () => {
      $("#pmin").value = "";
      $("#pmax").value = "";
      $("#sort").value = "default";
      $("#search-input").value = "";
      $$(".ty-catPage-baseFilters li").forEach((li, i) => li.classList.toggle("active", i === 0));
      setFilters({ div: "all", cat: "", sub: "", q: "", min: null, max: null, stock: false, priced: false, sort: "default" });
    });
    $("#load-more").addEventListener("click", () => { F.shown += PAGE; renderGrid(); });

    // Cart Drawer
    $("#cart-open").addEventListener("click", () => drawer(true));
    $("#cart-close").addEventListener("click", () => drawer(false));
    $("#overlay").addEventListener("click", () => drawer(false));
    $("#cart-clear").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
    $("#cart-print").addEventListener("click", printOfficialQuotation);

    // Off-Canvas Mobile Category Drawer & Menu
    function setOffcanvas(open) {
      $("#offcanvas-nav").classList.toggle("open", open);
      $("#offcanvas-overlay").classList.toggle("open", open);
    }
    $("#nav-cat-trigger").addEventListener("click", () => setOffcanvas(true));
    $("#offcanvas-close").addEventListener("click", () => setOffcanvas(false));
    $("#offcanvas-overlay").addEventListener("click", () => setOffcanvas(false));
    $("#menu-toggle").addEventListener("click", () => $("#nav-links").classList.toggle("open"));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        drawer(false);
        setOffcanvas(false);
        $("#search-modal").hidden = true;
      }
    });

    const tt = $("#to-top");
    tt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener(
      "scroll",
      () => {
        tt.classList.toggle("show", window.scrollY > 500);
        $("#headroom").classList.toggle("stuck", window.scrollY > 24);
      },
      { passive: true }
    );
  }

  function refresh() {
    build();
    renderStatic();
    renderCart();
    apply();
  }

  build();
  renderStatic();
  bind();
  slider();
  suggest();
  initRose();
  renderCart();
  apply();
  $("#yr").textContent = new Date().getFullYear();
  window.addEventListener("aqua:catalog-updated", refresh);
})();
