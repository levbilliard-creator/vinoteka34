const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

fetch("./data/products.json")
  .then(res => res.json())
  .then(data => {

    const wine = data.find(w => w.id === id)

    document.querySelector(".productTitle").innerText = wine.name_ru
    document.querySelector(".wine-img-big").src = wine.image
    document.querySelector(".wine-price-big").innerText = wine.price + " ₽"

    renderSimilar(data, wine)
  })


function renderSimilar(all, current){

  const block = document.querySelector(".similarGrid")

  const items = all
    .filter(w => w.type === current.type && w.id !== current.id)
    .slice(0,4)

  block.innerHTML = ""

  items.forEach(wine => {

    block.innerHTML += `
      <div class="product-card">
        <img src="${wine.image}" class="wine-img">

        <div class="wine-ru">${wine.name_ru}</div>
        <div class="wine-price">${wine.price} ₽</div>

        <a href="./product.html?id=${wine.id}">
          Подробнее →
        </a>
      </div>
    `
  })
}