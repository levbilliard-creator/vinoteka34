// ===== ID из URL =====
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));


// ===== ЗАГРУЗКА =====
Promise.all([
  fetch("/data/products.json").then(res => res.json()),
  fetch("/data/images.json").then(res => res.json())
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


  // ===== ПОИСК КАРТИНКИ =====
  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-zа-я0-9 ]/gi, "")
      .split(" ")
      .filter(w => w.length > 2);
  }

  function findImage(productName, images) {
    const words = normalize(productName);

    let bestMatch = null;
    let bestScore = 0;

    images.forEach(img => {
      const imgWords = normalize(img);

      let score = words.filter(w => imgWords.includes(w)).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = img;
      }
    });

    return bestScore >= 2 ? bestMatch : null;
  }

  const img = document.querySelector(".product-image img");

  const foundImage = findImage(product.name_ru, images);

  if (foundImage) {
    img.src = `/assets/wines/${foundImage}`;
  } else {
    img.src = "/images/no-wine.png";
  }


  // ===== ОПИСАНИЕ =====
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  function generateDescription(p) {
    if (p.type === "wine") {
      return `${capitalize(p.color)} ${p.style} вино "${p.name_ru}" с гармоничным вкусом и приятным ароматом. Отлично подойдет как для ужина, так и для особого случая.`;
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
    if (p.type !== "wine") {
      return "Рекомендуется употреблять в чистом виде.";
    }

    if (p.color === "красное") {
      return "Идеально к мясу и сырам.";
    }

    if (p.color === "белое") {
      return "Подходит к рыбе и морепродуктам.";
    }

    if (p.style === "игристое") {
      return "Отлично к закускам и десертам.";
    }

    return "Универсальное сочетание.";
  }


  // ===== ХАРАКТЕРИСТИКИ =====
  document.querySelector(".product-specs").innerHTML = `
    <div><span>Тип:</span> ${product.type || "-"}</div>
    <div><span>Цвет:</span> ${product.color || "-"}</div>
    <div><span>Стиль:</span> ${product.style || "-"}</div>
    <div><span>Гастрономия:</span> ${getFoodPairing(product)}</div>
  `;


  // ===== ПОХОЖИЕ =====
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
        <div>${p.name_ru}</div>
        <div>${p.price} ₽</div>
      </a>
    `).join("");
  } else {
    container.innerHTML = "<div style='opacity:0.6'>Нет похожих товаров</div>";
  }

})
.catch(() => {
  document.body.innerHTML = "<h1 style='padding:40px'>Ошибка загрузки</h1>";
});