let ALL = []

let grid
let buttons
let searchInput

/* ===== LAZY ===== */
let rendered = 0
const CHUNK = 40
let currentItems = []
let currentType = "all"

document.addEventListener("DOMContentLoaded", () => {

  grid = document.querySelector(".catalogGrid")
  buttons = document.querySelectorAll(".categories button")
  searchInput = document.getElementById("searchInput")

  if(!grid){
    console.error("❌ catalogGrid не найден")
    return
  }

  const params = new URLSearchParams(window.location.search)
  const from = params.get("type")
  if(from){
    currentType = from
  }

  init()
})

async function init(){
  try{
    const res = await fetch("./data/products.json")
    ALL = await res.json()

    // ❗ ВАЖНО: БОЛЬШЕ НЕ ПЕРЕЗАТИРАЕМ type
    // detectType УДАЛЕН ИЗ РАБОЧЕЙ ЛОГИКИ

    applyFilter(currentType)

    bindButtons()
    bindSearch()
    initScroll()

  }catch(e){
    console.error("Ошибка загрузки данных", e)
  }
}


/* ===== ФИЛЬТРЫ (СТРОГО ПО TYPE) ===== */

function applyFilter(type){

  if(type === "all"){
    render(ALL)
    return
  }

  let filtered = ALL.filter(w => w.type === type)

  /* fallback только если в JSON реально пусто */
  if(filtered.length === 0){
    console.warn("⚠️ пустая категория:", type)
    filtered = ALL
  }

  render(filtered)
}


/* ===== detectType (ОСТАВЛЕН НО НЕ ИСПОЛЬЗУЕТСЯ) ===== */

function detectType(p){

  const name = (p.name_ru || "").toLowerCase()

  if(
    name.includes("виски") ||
    name.includes("ром") ||
    name.includes("текила") ||
    name.includes("ликер") ||
    name.includes("ликёр") ||
    name.includes("джин") ||
    name.includes("коньяк") ||
    name.includes("бренди") ||
    name.includes("ракия") ||
    name.includes("портвейн") ||
    name.includes("спиртной напиток")
  ) return "strong"

  if(
    name.includes("пиво") ||
    name.includes("пивосодержащ") ||
    name.includes("пивной напиток") ||
    name.includes("corona") ||
    name.includes("корона")
  ) return "beer"

  if(
    name.includes("сыр") ||
    name.includes("оливк") ||
    name.includes("анчоус") ||
    name.includes("приправа") ||
    name.includes("салями") ||
    name.includes("ветчина") ||
    name.includes("колбас") ||
    name.includes("печенье") ||
    name.includes("шоколад") ||
    name.includes("масло") ||
    name.includes("песто") ||
    name.includes("перчик") ||
    name.includes("томаты") ||
    name.includes("гриссини") ||
    name.includes("чипс") ||
    name.includes("сорбиодетокс")
  ) return "grocery"

  if(
    name.includes("вода") ||
    name.includes("сок") ||
    name.includes("нектар") ||
    name.includes("лимонад") ||
    name.includes("кола") ||
    name.includes("швепс") ||
    name.includes("тоник")
  ) return "soft"

  if(
    name.includes("брют") ||
    name.includes("шампан") ||
    name.includes("просекко") ||
    name.includes("кава") ||
    name.includes("креман")
  ) return "sparkling"

  if(name.includes("чай")) return "tea"

  if(name.includes("бокал")) return "accessories"

  if(
    name.includes("вино") ||
    name.includes("шато") ||
    name.includes("рислинг") ||
    name.includes("пино") ||
    name.includes("эльзас") ||
    name.includes("тоскана") ||
    name.includes("мальбек") ||
    name.includes("шардоне")
  ) return "wine"

  return "wine"
}


/* ===== КАРТИНКИ ===== */

function getImage(product){

  if(product.image){
    return "./assets/wines/" + product.image
  }

  if(product.id){
    return "./assets/wines/" + product.id + ".jpg"
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
          ${img ? `<img src="${img}" class="wine-img" loading="lazy">` : ``}
        </div>

        <div class="wine-type">${translate(w.type)}</div>

        ${w.name_en ? `<div class="wine-en">${w.name_en}</div>` : ""}

        <div class="wine-ru">${w.name_ru}</div>

        ${(w.color || w.style) ? `
          <div class="wine-style">
            ${w.color || ""} ${w.style || ""}
          </div>
        ` : ""}

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

      const type = btn.dataset.type
      currentType = type

      applyFilter(type)

    })

  })
}


/* ===== ПОИСК ===== */

function bindSearch(){

  searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase()

    render(
      ALL.filter(w =>
        (w.name_ru && w.name_ru.toLowerCase().includes(value)) ||
        (w.name_en && w.name_en.toLowerCase().includes(value))
      )
    )

  })
}


/* ===== КНОПКА ↑ ===== */

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