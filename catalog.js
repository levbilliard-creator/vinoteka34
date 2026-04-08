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

  try{

    console.log("START LOAD")

    // ✅ ГЛАВНОЕ ИСПРАВЛЕНИЕ
    const res = await fetch("https://cdn.jsdelivr.net/gh/levbilliard-creator/vinoteka34@main/data/products.json")

    console.log("STATUS:", res.status)

    ALL = await res.json()

    console.log("LOADED:", ALL.length)

    applyFilter(currentType)

    bindButtons()
    bindSearch()
    initScroll()

  }catch(e){

    console.error("FETCH ERROR:", e)

    grid.innerHTML = `
      <div style="color:red; font-size:20px;">
        Ошибка загрузки каталога
      </div>
    `
  }
}

/* ===== ФИЛЬТР ===== */

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

  const CDN = "https://cdn.jsdelivr.net/gh/levbilliard-creator/vinoteka34@main/assets/wines/"

  let file = ""

  if(product.image){
    file = product.image
  } else if(product.id){
    file = product.id + ".jpg"
  } else {
    file = "placeholder.jpg"
  }

  return CDN + file
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
          <img 
            src="${img}" 
            class="wine-img" 
            loading="lazy"
            onerror="this.onerror=null; this.src='./assets/wines/' + this.src.split('/').pop();"
          >
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

/* ===== КНОПКИ ===== */

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

/* ===== ПОИСК ===== */

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

/* ===== СТРЕЛКА ВВЕРХ ===== */

const upBtn = document.createElement("div")
upBtn.innerHTML = "↑"
upBtn.style.position = "fixed"
upBtn.style.bottom = "30px"
upBtn.style.right = "30px"
upBtn.style.background = "#000"
upBtn.style.color = "#fff"
upBtn.style.padding = "10px 15px"
upBtn.style.cursor = "pointer"
upBtn.style.borderRadius = "8px"
upBtn.style.zIndex = "999"
upBtn.style.display = "none"

document.body.appendChild(upBtn)

window.addEventListener("scroll", () => {
  upBtn.style.display = window.scrollY > 400 ? "block" : "none"
})

upBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

/* ===== ПЕРЕВОД ===== */

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