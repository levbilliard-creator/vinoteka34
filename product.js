// получаем id
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// грузим JSON
fetch("/data/products.json")
  .then(res => res.json())
  .then(products => {

    const product = products.find(p => p.id === productId);

    if (!product) {
      document.body.innerHTML = "<h1 style='padding:40px'>Товар не найден</h1>";
      return;
    }

    // название
    document.querySelector(".product-title").textContent = product.name_ru;

    // тип
    document.querySelector(".product-type").textContent =
      product.type === "wine" ? "Вино" : "Крепкий алкоголь";

    // стиль
    document.querySelector(".product-style").textContent =
      `${product.color || ""} ${product.style || ""}`.trim();

    // цена
    document.querySelector(".product-price").textContent =
      product.price + " ₽";

    // картинка (ВАЖНО — чтобы не ломалось)
    const img = document.querySelector(".product-image img");

    img.src = `/images/${product.id}.jpg`;
    img.onerror = () => {
      img.src = "/images/placeholder.jpg";
    };

    // описание (пока авто-заглушка)
    document.querySelector(".product-description p").textContent =
      product.name_ru;

    // характеристики
    document.querySelector(".product-specs").innerHTML = `
      <div><span>Тип:</span> ${product.type}</div>
      <div><span>Цвет:</span> ${product.color || "-"}</div>
      <div><span>Стиль:</span> ${product.style || "-"}</div>
    `;

  });