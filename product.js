let ALL = []

init()

async function init(){

  const res = await fetch("./data/products.json")
  ALL = await res.json()

  const params = new URLSearchParams(window.location.search)
  const id = Number(params.get("id"))

  const product = ALL.find(w => w.id === id)

  if(!product) return

  render(product)
  renderSimilar(product)

}


/* ===== КАРТИНКИ ===== */

function getImage(id){

  const map = {
    1: "./assets/wines/арманьяк сент обен.png",
    5: "./assets/wines/марселан дивноморское.jpg"
  }

  return map[id] || "./assets/no-wine.png"
}


/* ===== РЕНДЕР ТОВАРА ===== */

function render(p){

  document.getElementById("productImage").src = getImage(p.id)

  document.getElementById("productType").innerText = translate(p.type)

  document.getElementById("productName").innerText = p.name_ru

  document.getElementById("productStyle").innerText =
    `${p.color || ""} ${p.style || ""}`

  document.getElementById("productPrice").innerText =
    `${p.price} ₽`

}


/* ===== ПОХОЖИЕ ===== */

function renderSimilar(p){

  const container = document.querySelector(".similarGrid")

  if(!container) return

  const similar = ALL
    .filter(w => w.type === p.type && w.id !== p.id)
    .slice(0,4)

  container.innerHTML = ""

  similar.forEach(w => {

    container.innerHTML += `
      <div class="product-card">

        <img src="${getImage(w.id)}" class="wine-img">

        <div class="wine-type">${translate(w.type)}</div>

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
  if(type === "beer") return "Пиво"
  if(type === "strong") return "Крепкий алкоголь"
  if(type === "grocery") return "Бакалея"
  if(type === "soft") return "Безалкогольные"
  if(type === "tea") return "Чай"
  if(type === "accessories") return "Аксессуары"

  return type
}