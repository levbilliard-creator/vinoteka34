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
  all:   { title: "Каталог" },
  wine:  { title: "Вино" },
  spirits:{ title: "Крепкие напитки" },
  nonalc:{ title: "Безалкогольные напитки" },
  snacks:{ title: "Закуски" },
  tea:   { title: "Чаи" },
  glass: { title: "Стекло и аксессуары" },
};


function toLatin(str){
  if(!str) return "";
  const map = {
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya',
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
  };
  return String(str).split("").map(ch => map[ch] ?? ch).join("")
    .replace(/\s+/g," ").trim();
}
function titleEN(p){
  const src = (p && p.title_en) ? String(p.title_en).trim() : "";
  if(src) return src;
  return toLatin(p && p.title ? p.title : "");
}

function normStr(v) {
  return (v || "").toString().trim().toLowerCase();
}

function inferGroup(p) {
  const cat = normStr(p.category);
  const name = normStr(p.title || p.name || p.full_name || "");
  // explicit category buckets
  if (cat.includes("вино") || cat.includes("игрист")) return "wine";
  // Spirits: categories are often specific ("водка", "виски", "коньяк/бренди"...)
  const spiritsCatKw = [
    "водк", "виск", "конья", "бренд", "ром", "джин", "текил", "ликер", "настой", "биттер",
    "арман", "кальвад", "грапп", "абсент", "самогон", "саке", "вермут", "портвей", "херес"
  ];
  if (spiritsCatKw.some(k => cat.includes(k))) return "spirits";

  // Non-alcoholic: move water / cola / soft drinks here
  const nonalcCatKw = ["вода", "газ", "лимонад", "сок", "тоник", "безалког", "комбуч", "морс", "айран", "энерг"];
  if (nonalcCatKw.some(k => cat.includes(k))) return "nonalc";

  // keyword heuristics (works even when category is "Другое")
  const nonalcKw = ["вода", "минерал", "газир", "сод", "кола", "coca", "coke", "pepsi", "schweppes", "tonic", "тоник", "лимонад", "сок", "айран", "морс", "kombucha", "комбуч", "энерг", "чайный напиток", "матча латте"];
  if (nonalcKw.some(k => name.includes(k))) return "nonalc";

  const teaKw = ["чай", "улун", "пуэр", "ассам", "сенча", "матча", "эрл грей", "earl grey"];
  if (teaKw.some(k => name.includes(k))) return "tea";

  const snacksKw = ["сыр", "колбас", "хамон", "паштет", "олив", "орех", "шоколад", "чипс", "крекер", "прошутто", "bresaola", "prosciutto", "salami"];
  if (snacksKw.some(k => name.includes(k))) return "snacks";

  const glassKw = ["бокал", "стакан", "декантер", "штопор", "пробк", "аэратор", "стекл", "аксессуар", "glass", "decanter", "corkscrew"];
  if (glassKw.some(k => name.includes(k))) return "glass";

  return "all";
}

function inferColor(p) {
  const c = (p.color || "").toString().trim();
  if (c) return c;
  const name = normStr(p.title || p.name || p.full_name || "");
  if (name.includes("бел")) return "Белое";
  if (name.includes("красн")) return "Красное";
  if (name.includes("роз")) return "Розовое";
  if (name.includes("оранж")) return "Оранжевое";
  if (name.includes("игрист") || name.includes("шампан")) return "Игристое";
  return "";
}

function inferSweetness(item) {
  const t = ((item.title || "") + " " + (item.ru || "") + " " + (item.en || "")).toLowerCase();
  if (/(брют|brut)/.test(t)) return "Брют";
  if (/(экстра\s*драй|extra\s*dry)/.test(t)) return "Экстра драй";
  if (/(деми\s*сек|demi\s*sec)/.test(t)) return "Деми-сек";
  if (/(полусладк|semi\s*sweet)/.test(t)) return "Полусладкое";
  if (/(полусух|semi\s*dry)/.test(t)) return "Полусухое";
  if (/(сладк|sweet)/.test(t)) return "Сладкое";
  if (/(сух|dry)/.test(t)) return "Сухое";
  return "";
}

function getWineTraits(item) {
  const traits = [];
  const type = (item.category || "").trim();
  if (type && type.toLowerCase() === "игристое") traits.push("Игристое");
  const color = (item.color || inferColor(item) || "").trim();
  if (color && !traits.includes(color)) traits.push(color);
  const sweet = inferSweetness(item);
  if (sweet && !traits.includes(sweet)) traits.push(sweet);
  return traits;
}



  function getParam(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }

  function norm(s) {
    return String(s ?? "").toLowerCase().trim();
  }

  function toNum(v) {
    // Accept values like "4 052", "4 052 ₽", "4052", "4,052.50"
    const raw = String(v ?? "").replace(/\s|\u00A0|\u202F/g, "");
    const cleaned = raw.replace(/[^0-9,\.\-]/g, "");
    if (!cleaned) return null;
    // If both comma and dot exist, assume comma is thousands separator and remove commas
    let normalized = cleaned;
    const hasComma = normalized.includes(",");
    const hasDot = normalized.includes(".");
    if (hasComma && hasDot) {
      normalized = normalized.replace(/,/g, "");
    } else if (hasComma && !hasDot) {
      normalized = normalized.replace(/,/g, ".");
    }
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }


// --- helpers (layout v2) ---
function formatPrice(value){
  const n = toNum(value);
  if (n === null) return '';
  try {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  } catch (e) {
    // fallback
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }
}

// Create pill as HTML string (so it can be safely used inside template literals)
function pillHtml(text, extraClass = '') {
  const cls = 'pill' + (extraClass ? (' ' + extraClass) : '');
  return `<span class="${cls}">${escapeHtml(text || '')}</span>`;
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

  // Remove unwanted phrases from titles (safety net)
  function cleanBadPhrases(text) {
    const bad = [
      "вино выдержанное",
      "вино сортовое",
      "вино марочное",
      "вино ординарное",
    ];
    let t = String(text || "");
    for (const b of bad) t = t.replace(new RegExp(`\\b${b}\\b`, "ig"), "");
    return t.replace(/\s{2,}/g, " ").trim();
  }

  // Simple RU→LAT transliteration for bilingual titles (Variant A)
  function translitToLatin(input) {
    const map = {
      а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
    };
    return String(input || "")
      .split("")
      .map((ch) => {
        const low = ch.toLowerCase();
        const rep = map[low];
        if (rep === undefined) return ch;
        if (ch === low) return rep;
        return rep.charAt(0).toUpperCase() + rep.slice(1);
      })
      .join("")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  
function buildCard(item) {
  const href = `/product.html?id=${encodeURIComponent(item.id)}`;
  const ruTitle = (item.ru || item.title || "").trim();
  const enTitle = (item.en || item.title_en || "").trim() || titleEN(item);
  const titleHtml = ruTitle ? `${escapeHtml(enTitle)}<br><span class="card__en">${escapeHtml(ruTitle)}</span>` : escapeHtml(enTitle);

  const kind = (item.category || "Товар").trim();
  const price = formatPrice(item.price_rub ?? item.price);
  const regionLine = [item.region, item.country].filter(Boolean).join(" • ");
  const stockLine = typeof item.stock === "number" ? `Наличие: ${item.stock}` : "";

  let traits = [];
  if ((item.group || "").toLowerCase() === "wine") {
    traits = getWineTraits(item);
  } else if (item.color) {
    traits = [item.color];
  }

  const traitsHtml = traits.length
    ? `<div class="pill-row">${traits.map(t => pillHtml(t, "pill--trait")).join("")}</div>`
    : `<div class="pill-row"></div>`;

  return `
    <article class="card product">
      <div class="prod-head">
        <div class="prod-title-wrap">
          <a class="prod-title" href="${href}">${titleHtml}</a>
          ${regionLine ? `<div class="muted small">${escapeHtml(regionLine)}</div>` : ""}
          ${stockLine ? `<div class="muted small">${escapeHtml(stockLine)}</div>` : ""}
        </div>

        <div class="prod-right">
          <div class="prod-kind">${escapeHtml(kind)}</div>

          <div class="prod-right-bottom">
            <div class="prod-price">${price}</div>
            <div class="prod-price-note">Цена на сайте</div>
            <a class="btn btn-open" href="${href}">Открыть</a>
          </div>
        </div>
      </div>

      <div class="prod-foot">
        ${traitsHtml}
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
    if (col) out = out.filter((p) => inferColor(p) === col);
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
    return items.map((p) => {
      const title = cleanBadPhrases(p.title ?? "");
      const category = p.category ?? "";
      const group = inferGroup({ ...p, title, category });
      const titleEnRaw = (p.title_en ?? p.name_en ?? p.titleEn ?? p.nameEn ?? "").toString().trim();
      const title_en = titleEnRaw
        ? titleEnRaw
        : ((group === "wine" || group === "spirits") ? translitToLatin(title) : "");

      return {
        ...p,
        // defensive defaults
        title,
        title_en,
        category,
        country: p.country ?? "",
        region: p.region ?? "",
        group,
        color: inferColor({ ...p, title, category }) || "",
        price_rub: Number(p.price_rub ?? 0),
        stock: Number(p.stock ?? 0),
        sku: p.sku ?? "",
      };
    });
  }

  function applyGroup(items) {
    const g = getParam("group");
    const gInfo = GROUPS[g] || null;

    const title = gInfo ? gInfo.title : "Каталог";
    if (elTitle) elTitle.textContent = title;
    document.title = `ВИНОТЕКА — ${title}`;

    // show color filter only for wine group
    const colorWrap = document.querySelector('[data-filter="color"]') || elColor?.closest(".filter");
    if (colorWrap) colorWrap.style.display = (g === "wine") ? "" : "none";

    if (!gInfo) return items;

    // Categories vary ("Водка", "Виски", "Вода"...), so infer group by category/name.
    return items.filter((p) => inferGroup(p) === g);
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
      setSelectOptions(elColor, uniq(items.map((p) => inferColor(p)).filter(Boolean)), true);

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

function cleanTitle(s){
  if(!s) return '';
  s = cleanBadPhrases(String(s));
  // remove generic word "вино" in the name (type is shown via badges/filters)
  s = s.replace(/^\s*вино\s+/i, '');
  // remove trailing taste/color descriptors from the title
  s = s.replace(/\s+(сухое|полусухое|полусладкое|сладкое|брют|экстра\s*брют|экстра\s*драй|экстра\s*сухое)\s+(белое|красное|розовое)\s*$/i, '');
  s = s.replace(/\s+(белое|красное|розовое)\s*$/i, '');
  s = s.replace(/\s+(сухое|полусухое|полусладкое|сладкое|брют|экстра\s*брют|экстра\s*драй|экстра\s*сухое)\s*$/i, '');
  s = s.replace(/\s{2,}/g,' ').trim();
  return s;
}

})();