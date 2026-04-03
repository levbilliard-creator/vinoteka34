let ALL = []

let grid
let buttons
let searchInput

let rendered = 0
const CHUNK = 40
let currentItems = []
let currentType = "all"

document.addEventListener("DOMContentLoaded", () => {

  grid = document.querySelector(".catalogGrid")
  buttons = document.querySelectorAll(".categories button")
  searchInput = document.getElementById("searchInput")

  const params = new URLSearchParams(window.location.search)
  const from = params.get("type")
  if(from){
    currentType = from
  }

  init()
})

async function init(){
  const res = await fetch("./data/products.json")
  ALL = await res.json()

  applyFilter(currentType)

  bindButtons()
  bindSearch()
  initScroll()
}

/* ===== ФИЛЬТР (ЧИСТЫЙ) ===== */

function normalizeType(type){
  if(type === "Безалкогольные") return "soft"
  if(type === "Пиво") return "beer"
  if(type === "Вино") return "wine"
  if(type === "Игристое") return "sparkling"
  if(type === "Крепкий алкоголь") return "strong"
  if(type === "Бакалея") return "grocery"
  if(type === "Чай") return "tea"
  if(type === "Аксессуары") return "accessories"
  return type
}

function applyFilter(type){

  if(type === "all"){
    render(ALL)
    return
  }

  const normalized = normalizeType(type)

  const filtered = ALL.filter(w => w.type === normalized)

  render(filtered)
}

/* ===== КАРТИНКИ ===== */

function getImage(product){
  if(product.image){
    return "./assets/wines/" + product.image
  }
  return "./assets/wines/placeholder.jpg"
}

/* ===== RENDER ===== */

function render(items){
  grid.innerHTML = ""
  rendered = 0
  currentItems = items
  renderNext()
}

function renderNext(){

  const slice = currentItems.slice(rendered, rendered + CHUNK)

  slice.forEach(w => {

    const img = getImage(w)

    grid.innerHTML += `
      <div class="product-card">

        <div class="img-wrap">
          <img src="${img}" class="wine-img" loading="lazy">
        </div>

        <div class="wine-type">${translate(w.type)}</div>

        ${w.name_en ? `<div class="wine-en">${w.name_en}</div>` : ""}

        <div class="wine-ru">${w.name_ru}</div>

        <div class="wine-bottom">
          <div class="wine-price">${w.price} ₽</div>
          <a href="product.html?id=${w.id}&from=${currentType}" class="btn-link">
            Подробнее →
          </a>
        </div>

      </div>
    `
  })

  rendered += CHUNK
}

/* ===== SCROLL ===== */

function initScroll(){
  window.addEventListener("scroll", () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){
      renderNext()
    }
  })
}

/* ===== UI ===== */

function bindButtons(){
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"))
      btn.classList.add("active")

      currentType = btn.dataset.type
      applyFilter(currentType)
    })
  })
}

function bindSearch(){
  searchInput.addEventListener("input", () => {
    const v = searchInput.value.toLowerCase()

    render(
      ALL.filter(w =>
        w.name_ru.toLowerCase().includes(v) ||
        (w.name_en || "").toLowerCase().includes(v)
      )
    )
  })
}

/* ===== LABELS ===== */

function translate(type){
  if(type==="wine") return "Вино"
  if(type==="sparkling") return "Игристое"
  if(type==="beer") return "Пиво"
  if(type==="strong") return "Крепкий алкоголь"
  if(type==="grocery") return "Бакалея"
  if(type==="soft") return "Безалкогольные"
  if(type==="tea") return "Чай"
  if(type==="accessories") return "Аксессуары"
  return type
}