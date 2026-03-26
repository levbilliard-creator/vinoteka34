// ===== ID из URL =====
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));


// ===== ПЕРЕВОД ТИПА =====
function translateType(type){
  if(type === "wine") return "Вино"
  if(type === "sparkling") return "Игристое"
  if(type === "strong") return "Крепкий алкоголь"
  if(type === "beer") return "Пиво"
  if(type === "grocery") return "Бакалея"
  if(type === "soft") return "Безалкогольные"
  if(type === "tea") return "Чай"
  if(type === "accessories") return "Аксессуары"
  return type
}


// ===== ЗАГРУЗКА =====
fetch("/data/products.json")
  .then(res => res.json())
  .then(products => {

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
      translateType(product.type);


    // ===== СТИЛЬ =====
    document.querySelector(".product-style").textContent =
      `${product.color || ""} ${product.style || ""}`.trim();


    // ===== ЦЕНА =====
    document.querySelector(".product-price").textContent =
      (product.price || 0) + " ₽";


    // ===== КАРТИНКА (умный подбор по имени) =====
    const img = document.querySelector(".product-image img");

    function normalize(str){
      return (str || "")
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/[^a-zа-я0-9 ]/gi, "")
        .split(" ")
        .filter(w => w.length > 2);
    }

    function matchImage(productName, fileList){
      const words = normalize(productName);

      let bestMatch = null;
      let bestScore = 0;

      fileList.forEach(file => {
        const fileWords = normalize(file);

        let score = 0;

        words.forEach(w => {
          if(fileWords.includes(w)) score++;
        });

        if(score > bestScore){
          bestScore = score;
          bestMatch = file;
        }
      });

      return bestScore >= 2 ? bestMatch : null;
    }

    fetch("/data/images.json")
      .then(res => res.json())
      .then(images => {

        const match = matchImage(product.name_ru, images);

        if(match){
          img.src = "/assets/wines/" + match;
        } else {
          img.src = "/assets/no-wine.png";
        }

      })
      .catch(() => {
        img.src = "/assets/no-wine.png";
      });


    // ===== ОПИСАНИЕ (УЛУЧШЕННОЕ) =====
    function capitalize(str) {
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
    }

    function generateDescription(p) {

      if (p.type === "wine" || p.type === "sparkling") {

        let parts = [];
        if(p.color) parts.push(p.color);
        if(p.style) parts.push(p.style);

        return `${capitalize(parts.join(" "))} ${p.name_ru}.
Происхождение: ${p.country || "не указано"}.
Рекомендации: ${getFoodPairing(p)}`;
      }

      if (p.type === "strong") {
        return `${p.name_ru}.
Крепкий напиток, рекомендуется употреблять в чистом виде.`;
      }

      return p.name_ru || "Описание отсутствует";
    }

    document.querySelector(".product-description p").textContent =
      generateDescription(product);


    // ===== ГАСТРОНОМИЯ =====
    function getFoodPairing(p) {

      if (p.type !== "wine" && p.type !== "sparkling") {
        return "Рекомендуется употреблять в чистом виде.";
      }

      if (p.color === "красное") {
        return "Идеально к мясу и сырам.";
      }

      if (p.color === "белое") {
        return "Подходит к рыбе и морепродуктам.";
      }

      if (p.color === "розе") {
        return "Хорошо к легким закускам.";
      }

      if (p.style === "игристое") {
        return "Отлично к закускам и десертам.";
      }

      return "Универсальное сочетание.";
    }


    // ===== ХАРАКТЕРИСТИКИ =====
    document.querySelector(".product-specs").innerHTML = `
      <div><span>Тип:</span> ${translateType(product.type) || "-"}</div>
      <div><span>Цвет:</span> ${product.color || "-"}</div>
      <div><span>Стиль:</span> ${product.style || "-"}</div>
      <div><span>Страна:</span> ${product.country || "-"}</div>
      <div><span>Регион:</span> ${product.region || "-"}</div>
      <div><span>Гастрономия:</span> ${getFoodPairing(product)}</div>
    `;


    // ===== ПОХОЖИЕ ТОВАРЫ =====
    function getSimilar(products, current) {
      return products
        .filter(p =>
          p.id !== current.id &&
          p.type === current.type
        )
        .slice(0, 4);
    }

    const similar = getSimilar(products, product);

    const container = document.querySelector(".similar-grid");

    if (similar.length > 0) {
      container.innerHTML = similar.map(p => `
        <a href="/product.html?id=${p.id}" class="similar-card">

          <img src="/assets/no-wine.png">

          <div class="wine-type">${translateType(p.type)}</div>

          ${p.name_en ? `<div class="wine-en">${p.name_en}</div>` : ""}

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