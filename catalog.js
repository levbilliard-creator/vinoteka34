(() => {
  const $ = (id) => document.getElementById(id);

  const elTitle = $("pageTitle");
  const elMeta = $("meta");
  const elGrid = $("grid");

  const elQ = $("q");
  const elCategory = $("category");
  const elColor = $("color");
  const elCountry = $("country");
  const elMin = $("minPrice");
  const elMax = $("maxPrice");
  const elSort = $("sort");
  const elReset = $("resetBtn");

  // --- Group mapping (tiles -> categories) ---
  // IMPORTANT: categories must match *exactly* what is stored in data/products.json.
  // Current inventory categories:
  // ["Вино","Игристое","Виски","Водка","Джин","Коньяк/Бренди","Пиво/Сидр","Ром","Снеки","Текила","Другое"]
  const GROUPS = {
    wine: { title: "Вино", categories: ["Вино", "Игристое"] },
    spirits: { title: "Крепкие напитки", categories: ["Виски", "Водка", "Джин", "Коньяк/Бренди", "Ром", "Текила"] },
    // Пока в текущем файле нет безалкогольных позиций — оставляем пустым (появятся в следующей выгрузке).
    nonalc: { title: "Безалкогольные напитки", categories: [] },
    snacks: { title: "Закуски", categories: ["Снеки"] },
    tea: { title: "Чаи", categories: [] },
    // В текущем файле «стекло/аксессуары» лежит в категории «Другое».
    glass: { title: "Стекло и аксессуары", categories: ["Другое"] },
  };

  function getParam(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }

  function norm(s) {
    return String(s ?? "").toLowerCase().trim();
  }

  function toNum(v) {
    const n = Number(String(v ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  function uniq(arr) {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b, "ru"));
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildCard(p) {
    const title = escapeHtml(p.title);
    const subtitle = escapeHtml([p.region, p.country].filter(Boolean).join(" • "));
    const price = Number(p.price_rub || 0).toLocaleString("ru-RU");
    const cat = escapeHtml(p.category || "");
    const color = escapeHtml(p.color || "");

    const badges = [];
    if (p.type === "wine" && color) badges.push(`<span class="pill">${color}</span>`);
    if (cat) badges.push(`<span class="pill">${cat}</span>`);

    return `
      <article class="card product">
        <div class="prod-head">
          <div class="prod-title-wrap">
            <a class="prod-title" href="/product.html?id=${encodeURIComponent(p.id)}">${title}</a>
            <div class="muted">${subtitle || "&nbsp;"}</div>
            <div class="muted">Наличие: ${escapeHtml(p.stock ?? 0)}</div>
          </div>
          <div class="prod-pills">${badges.join("")}</div>
        </div>
        <div class="prod-foot">
          <div>
            <div class="price">${price} ₽</div>
            <div class="muted">Цена на сайте</div>
          </div>
          <a class="btn" href="/product.html?id=${encodeURIComponent(p.id)}">Открыть</a>
        </div>
      </article>
    `;
  }

  function setSelectOptions(selectEl, values, includeAll = true) {
    if (!selectEl) return;
    const current = selectEl.value;
    const opts = [];
    if (includeAll) opts.push(`<option value="">Все</option>`);
    for (const v of values) opts.push(`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`);
    selectEl.innerHTML = opts.join("");
    // try keep current if possible
    selectEl.value = values.includes(current) ? current : "";
  }

  async function loadData() {
    // cache-bust to avoid Cloudflare/browser caching during rapid updates
    const url = `/data/products.json?v=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Не удалось загрузить каталог (${res.status})`);
    return res.json();
  }

  function applyFilters(items) {
    const q = norm(elQ?.value);
    const cat = elCategory?.value || "";
    const col = elColor?.value || "";
    const ctry = elCountry?.value || "";
    const minP = toNum(elMin?.value);
    const maxP = toNum(elMax?.value);

    let out = items;

    if (q) {
      out = out.filter((p) => {
        const hay = norm(`${p.title} ${p.region} ${p.country} ${p.sku}`);
        return hay.includes(q);
      });
    }
    if (cat) out = out.filter((p) => (p.category || "") === cat);
    if (ctry) out = out.filter((p) => (p.country || "") === ctry);
    if (col) out = out.filter((p) => (p.color || "") === col);
    if (minP != null) out = out.filter((p) => Number(p.price_rub || 0) >= minP);
    if (maxP != null) out = out.filter((p) => Number(p.price_rub || 0) <= maxP);

    // sort
    const s = elSort?.value || "";
    if (s === "price_asc") out = [...out].sort((a, b) => (a.price_rub || 0) - (b.price_rub || 0));
    else if (s === "price_desc") out = [...out].sort((a, b) => (b.price_rub || 0) - (a.price_rub || 0));
    else if (s === "name") out = [...out].sort((a, b) => String(a.title).localeCompare(String(b.title), "ru"));
    else if (s === "stock") out = [...out].sort((a, b) => (b.stock || 0) - (a.stock || 0));

    return out;
  }

  function render(items, total) {
    if (!elGrid) return;
    elGrid.innerHTML = items.map(buildCard).join("");
    if (elMeta) elMeta.textContent = `Показано: ${items.length} из ${total}`;
  }

  function wireEvents(items, total) {
    const onChange = () => render(applyFilters(items), total);

    [elQ, elCategory, elColor, elCountry, elMin, elMax, elSort].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", onChange);
      el.addEventListener("change", onChange);
    });

    if (elReset) {
      elReset.addEventListener("click", () => {
        if (elQ) elQ.value = "";
        if (elCategory) elCategory.value = "";
        if (elColor) elColor.value = "";
        if (elCountry) elCountry.value = "";
        if (elMin) elMin.value = "";
        if (elMax) elMax.value = "";
        if (elSort) elSort.value = "";
        onChange();
      });
    }
  }

  function normalizeData(raw) {
    const items = (raw && raw.items) ? raw.items : [];
    return items.map((p) => ({
      ...p,
      // defensive defaults
      title: p.title ?? "",
      category: p.category ?? "",
      country: p.country ?? "",
      region: p.region ?? "",
      color: p.color ?? "",
      price_rub: Number(p.price_rub ?? 0),
      stock: Number(p.stock ?? 0),
      sku: p.sku ?? "",
    }));
  }

  function applyGroup(items) {
    const g = getParam("group");
    const gInfo = GROUPS[g] || null;

    if (gInfo && elTitle) elTitle.textContent = gInfo.title;

    // show color filter only for wine group
    const colorWrap = document.querySelector('[data-filter="color"]') || elColor?.closest(".filter");
    if (colorWrap) colorWrap.style.display = (g === "wine") ? "" : "none";

    if (!gInfo) return items;

    const allowed = new Set(gInfo.categories);
    return items.filter((p) => allowed.has(p.category));
  }

  function initSortOptions() {
    if (!elSort) return;
    // Keep existing options if present, otherwise set
    const has = elSort.querySelector("option");
    if (has) return;
    elSort.innerHTML = `
      <option value="">По умолчанию</option>
      <option value="price_asc">Цена ↑</option>
      <option value="price_desc">Цена ↓</option>
      <option value="name">Название</option>
      <option value="stock">Наличие</option>
    `;
  }

  async function main() {
    try {
      initSortOptions();

      const raw = await loadData();
      let items = normalizeData(raw);
      items = applyGroup(items);

      const total = items.length;

      // Populate select filters based on *grouped* items
      setSelectOptions(elCategory, uniq(items.map((p) => p.category).filter(Boolean)), true);
      setSelectOptions(elCountry, uniq(items.map((p) => p.country).filter(Boolean)), true);
      setSelectOptions(elColor, uniq(items.map((p) => p.color).filter(Boolean)), true);

      render(items, total);
      wireEvents(items, total);
    } catch (e) {
      console.error(e);
      if (elGrid) {
        elGrid.innerHTML = `
          <div class="card" style="padding:16px">
            <div style="font-weight:700;margin-bottom:6px">Каталог временно недоступен</div>
            <div class="muted">${escapeHtml(e?.message || "Ошибка загрузки")}</div>
          </div>
        `;
      }
    }
  }

  main();
})();