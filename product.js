let ALL = []

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

init()

async function init(){

  const res = await fetch("./data/products.json")
  ALL = await res.json()

  const wine = ALL.find(w => w.id === id)

  if(!wine){
    document.body.innerHTML = "Товар не найден"
    return
  }

  render(wine)
  renderSimilar(wine)

}


/* ===== ОСНОВНОЙ РЕНДЕР ===== */

function render(w){

  document.querySelector(".productTitle").innerText = w.name_ru

  document.querySelector(".wine-img-big").src =
    w.image || "./assets/no-wine.png"

  document.querySelector(".wine-price-big").innerText =
    w.price + " ₽"

  const info = document.querySelector(".productInfo")

  info.innerHTML += `
    <div class="wine-type">${translate(w.type)}</div>

    <div class="wine-en">${w.name_en || ""}</div>

    <div class="wine-style">
      ${w.color || ""} ${w.sweetness || ""}
    </div>

    <div class="wine-description">
      Идеально подходит для ужина, сочетается с мясом, сырами и закусками.
    </div>
  `

}


/* ===== РЕКОМЕНДАЦИИ ===== */

function renderSimilar(current){

  const container = document.querySelector(".similarGrid")

  if(!container) return

  const items = ALL
    .filter(w => w.type === current.type && w.id !== current.id)
    .slice(0,4)

  container.innerHTML = ""

  items.forEach(w => {

    container.innerHTML += `
      <div class="product-card">

        <div class="image-wrap">
          <img src="${w.image || './assets/no-wine.png'}" class="wine-img">
        </div>

        <div class="wine-ru">${w.name_ru}</div>

        <div class="wine-price">${w.price} ₽</div>

        <a href="./product.html?id=${w.id}" class="btn-link">
          Подробнее →
        </a>

      </div>
    `
  })

}


/* ===== ПЕРЕВОД ===== */

function translate(type){

  if(type === "wine") return "Вино"
  if(type === "sparkling") return "Игристое"
  if(type === "strong") return "Крепкий алкоголь"
  if(type === "beer") return "Пиво"

  return "Напиток"
}