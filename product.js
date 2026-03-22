// ===== ID из URL =====
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));


// ===== НОРМАЛИЗАЦИЯ =====
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s]/gi, "")
    .trim();
}

function getWords(str) {
  return normalize(str)
    .split(/\s+/)
    .filter(w => w.length > 2);
}

// убираем мусорные слова
function cleanWords(words) {
  const stopWords = [
    "вино", "шампань", "игристое",
    "белое", "красное", "розовое",
    "брют", "сухое", "полусладкое",
    "экстра", "док", "doc", "dop",
    "0", "75", "075", "л"
  ];

  return words.filter(w => !stopWords.includes(w));
}


// ===== ПОИСК КАРТИНКИ =====
function findBestImage(productName, images) {

  let productWords = cleanWords(getWords(productName));

  let bestScore = 0;
  let bestFile = null;

  images.forEach(file => {
    const fileWords = getWords(file);

    let score = 0;

    productWords.forEach(w => {
      if (fileWords.includes(w)) score++;
    });

    const ratio = score / Math.max(productWords.length, 1);

    if (ratio > bestScore) {
      bestScore = ratio;
      bestFile = file;
    }
  });

  // порог
  if (bestScore >= 0.3 && bestFile) {
    return `/assets/wines/${bestFile}`;
  }

  return "/images/no-wine.png";
}


// ===== ЗАГРУЗКА =====
Promise.all([
  fetch("/data/products.json").then(r => r.json()),
  fetch("/data/images.json").then(r => r.json())
])
.then(([products, images]) => {

  const product = products.find(p => Number(p.id) === productId);

  if (!product) {
    document.body.innerHTML = "<h1 style='padding:40px'>Товар не найден</h1>";
    return;
  }


  // ===== НАЗВАНИЕ =====
  document.querySelector(".product-title").textContent =
    product.name_ru || "Без названия";


  // ===== ТИП =====
  document.querySelector(".product-type").textContent =
    product.type === "wine" ? "Вино" :
    product.type === "strong" ? "Крепкий алкоголь" :
    product.type || "";


  // ===== СТИЛЬ =====
  document.querySelector(".product-style").textContent =
    `${product.color || ""} ${product.style || ""}`.trim();


  // ===== ЦЕНА =====
  document.querySelector(".product-price").textContent =
    (product.price || 0) + " ₽";


  // ===== КАРТИНКА =====
  const img = document.querySelector(".product-image img");

  const smartImage = findBestImage(product.name_ru || "", images);

  const tryPaths = [
    smartImage,
    `/images/wine${product.id}.jpg`,
    `/images/${product.id}.jpg`,
    `/images/${product.id}.png`,
    `/images/no-wine.png`
  ];

  let i = 0;

  function loadNext() {
    if (i >= tryPaths.length) return;
    img.src = tryPaths[i];
    i++;
  }

  img.onerror = loadNext;
  loadNext();


  // ===== ОПИСАНИЕ =====
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  function generateDescription(p) {
    if (p.type === "wine") {
      return `${capitalize(p.color)} ${p.style} вино "${p.name_ru}" с гармоничным вкусом и приятным ароматом.`;
    }

    if (p.type === "strong") {
      return `${p.name_ru} — крепкий алкоголь с выразительным характером.`;
    }

    return p.name_ru || "Описание отсутствует";
  }

  document.querySelector(".product-description p").textContent =
    generateDescription(product);


  // ===== ГАСТРОНОМИЯ =====
  function getFoodPairing(p) {

    if (p.type !== "wine") return "Рекомендуется употреблять в чистом виде.";
    if (p.color === "красное") return "Идеально к мясу и сырам.";
    if (p.color === "белое") return "К рыбе и морепродуктам.";
    if (p.style === "игристое") return "К закускам и десертам.";

    return "Универсально.";
  }


  // ===== ХАРАКТЕРИСТИКИ =====
  document.querySelector(".product-specs").innerHTML = `
    <div><span>Тип:</span> ${product.type || "-"}</div>
    <div><span>Цвет:</span> ${product.color || "-"}</div>
    <div><span>Стиль:</span> ${product.style || "-"}</div>
    <div><span>Гастрономия:</span> ${getFoodPairing(product)}</div>
  `;


  // ===== ПОХОЖИЕ ТОВАРЫ =====
  function getSimilar(products, current) {
    return products
      .filter(p =>
        p.id !== current.id &&
        p.type === current.type &&
        p.color === current.color
      )
      .slice(0, 4);
  }

  const similar = getSimilar(products, product);

  const container = document.querySelector(".similar-grid");

  if (similar.length > 0) {
    container.innerHTML = similar.map(p => `
      <a href="/product.html?id=${p.id}" class="similar-card">
        <img src="/images/wine${p.id}.jpg" onerror="this.src='/images/no-wine.png'">
        <div>${p.name_ru}</div>
        <div>${p.price} ₽</div>
      `).join("");
  } else {
    container.innerHTML = "<div style='opacity:0.6'>Нет похожих товаров</div>";
  }

})
.catch(() => {
  document.body.innerHTML = "<h1 style='padding:40px'>Ошибка загрузки</h1>";
});