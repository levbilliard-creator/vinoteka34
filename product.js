const params = new URLSearchParams(location.search)
const id = Number(params.get("id"))

let ALL = []

init()

async function init(){

  const res = await fetch("./data/products.json")
  ALL = await res.json()

  const wine = ALL.find(w => w.id === id)

  renderProduct(wine)
  renderSimilar(wine)

}


/* ТОВАР */

function renderProduct(w){

  document.querySelector(".productWrapper").innerHTML = `
    <div class="productImage">
      <img src="${w.image || './assets/no-wine.png'}" class="wine-img-big">
    </div>

    <div class="productInfo">
      <div class="wine-type">${w.type}</div>
      <h1>${w.name_ru}</h1>
      <div>${w.color || ""} ${w.sweetness || ""}</div>

      <div class="wine-price-big">${w.price} ₽</div>

      <button class="wine-btn">Спросить сомелье</button>
    </div>
  `
}


/* РЕКОМЕНДАЦИИ */

function renderSimilar(w){

  const similar = ALL
    .filter(x => x.type === w.type && x.id !== w.id)
    .slice(0,4)

  document.querySelector(".recommendGrid").innerHTML = similar.map(x => `
    <div class="product-card">
      <img src="${x.image || './assets/no-wine.png'}" class="wine-img">
      <div class="wine-type">${x.type}</div>
      <div class="wine-ru">${x.name_ru}</div>
      <div class="wine-price">${x.price} ₽</div>
      <a href="./product.html?id=${x.id}" class="btn-link">Подробнее</a>
    </div>
  `).join("")
}