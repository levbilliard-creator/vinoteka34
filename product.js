// получаем id из URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// грузим данные
fetch("/data/products.json")
  .then(res => res.json())
  .then(products => {

    // 🔥 ВАЖНО: приведение id (фикс бага)
    const product = products.find(p => Number(p.id) === productId);

    // если не найден
    if (!product) {
      document.body.innerHTML = "<h1 style='padding:40px'>Товар не найден</h1>";
      return;
    }

    // ===== ЗАПОЛНЕНИЕ =====

    // название
    document.querySelector(".product-title").textContent = product.name_ru || "Без названия";

    // тип
    document.querySelector(".product-type").textContent =
      product.type === "wine" ? "Вино" :
      product.type === "strong" ? "Крепкий алкоголь" :
      product.type;

    // стиль
    document.querySelector(".product-style").textContent =
      `${product.color || ""} ${product.style || ""}`.trim();

    // цена
    document.querySelector(".product-price").textContent =
      (product.price || 0) + " ₽";


    // ===== КАРТИНКА (исправлено) =====

    const img = document.querySelector(".product-image img");

    // пробуем разные варианты
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


    // ===== ОПИСАНИЕ =====

    document.querySelector(".product-description p").textContent =
      product.name_ru || "Описание отсутствует";


    // ===== ХАРАКТЕРИСТИКИ =====

    document.querySelector(".product-specs").innerHTML = `
      <div><span>Тип:</span> ${product.type || "-"}</div>
      <div><span>Цвет:</span> ${product.color || "-"}</div>
      <div><span>Стиль:</span> ${product.style || "-"}</div>
      <div><span>Цена:</span> ${product.price || "-"} ₽</div>
    `;

  })
  .catch(() => {
    document.body.innerHTML = "<h1 style='padding:40px'>Ошибка загрузки данных</h1>";
  });