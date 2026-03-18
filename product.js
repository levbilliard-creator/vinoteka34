// ===== ID из URL =====
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));


// ===== ЗАГРУЗКА =====
fetch("/data/products.json")
  .then(res => res.json())
  .then(products => {

    // 🔥 фиксим баг с id
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

    const tryPaths = [
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


    // ===== ОПИСАНИЕ (авто) =====
    function capitalize(str) {
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
    }

    function generateDescription(p) {
      if (p.type === "wine") {
        return `${capitalize(p.color)} ${p.style} вино "${p.name_ru}" с гармоничным вкусом и приятным ароматом. Отлично подойдет как для ужина, так и для особого случая.`;
      }

      if (p.type === "strong") {
        return `${p.name_ru} — крепкий алкоголь с выразительным характером. Подходит для неспешной дегустации.`;
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
        return "Идеально подходит к мясу, стейкам и сырам.";
      }

      if (p.color === "белое") {
        return "Отлично сочетается с рыбой, морепродуктами и салатами.";
      }

      if (p.style === "игристое") {
        return "Прекрасно подходит к закускам и десертам.";
      }

      return "Универсально сочетается с различными блюдами.";
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
        </a>
      `).join("");
    } else {
      container.innerHTML = "<div style='opacity:0.6'>Нет похожих товаров</div>";
    }

  })
  .catch(() => {
    document.body.innerHTML = "<h1 style='padding:40px'>Ошибка загрузки</h1>";
  });