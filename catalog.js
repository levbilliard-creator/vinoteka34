let ALL = []
let IMAGES = []

const grid = document.querySelector(".catalogGrid")
const buttons = document.querySelectorAll(".categories button")
const searchInput = document.getElementById("searchInput")

/* ===== LAZY ===== */
let rendered = 0
const CHUNK = 40
let currentItems = []

init()

async function init(){
  try{
    const [productsRes, imagesRes] = await Promise.all([
      fetch("./data/products.json"),
      fetch("./data/images.json")
    ])

    ALL = await productsRes.json()
    IMAGES = await imagesRes.json()

    ALL = ALL.map(p => ({
      ...p,
      type: detectType(p)
    }))

    render(ALL)
    bindButtons()
    bindSearch()
    initScroll()

  }catch(e){
    console.error("Ошибка загрузки данных", e)
  }
}


/* ===== detectType (НЕ ТРОГАЮ) ===== */

function detectType(p){

  const name = (p.name_ru || "").toLowerCase()

  if(name.includes("николаев")) return "wine"
  if(name.includes("вермут")) return "wine"
  if(name.includes("ракия")) return "strong"
  if(name.includes("ром выдержанный эль")) return "strong"

  if(
    name.includes("чипс") ||
    name.includes("сорбиодетокс") ||
    name.includes("стакан")
  ) return "grocery"

  if(name.includes("бокал")) return "accessories"

  if(
    name.includes("сыр") ||
    name.includes("салями") ||
    name.includes("колбас") ||
    name.includes("ветчина") ||
    name.includes("брезаола") ||
    name.includes("анчоус") ||
    name.includes("оливк") ||
    name.includes("томат") ||
    name.includes("песто") ||
    name.includes("масло") ||
    name.includes("перчик") ||
    name.includes("палочки") ||
    name.includes("гриссини") ||
    name.includes("ассорти") ||
    name.includes("леденцы") ||
    name.includes("печенье") ||
    name.includes("шоколад") ||
    name.includes("приправа")
  ) return "grocery"

  if(
    name.includes("вода") ||
    name.includes("кола") ||
    name.includes("сок") ||
    name.includes("тоник")
  ) return "soft"

  if(
    name.includes("брют") ||
    name.includes("шампан") ||
    name.includes("просекко") ||
    name.includes("кава")
  ) return "sparkling"

  if(
    name.includes("шато") ||
    name.includes("бордо") ||
    name.includes("бургунд") ||
    name.includes("тоскана") ||
    name.includes("риоха") ||
    name.includes("совиньон") ||
    name.includes("мерло") ||
    name.includes("пино") ||
    name.includes("шардоне") ||
    name.includes("рислинг") ||
    name.includes("эльзас") ||
    name.includes("вино")
  ) return "wine"

  if(
    name.startsWith("пиво") ||
    name.includes(" пиво") ||
    name.includes("пивной напиток") ||
    name.includes("пивосодержащ") ||
    name.includes(" лагер") ||
    name.endsWith(" лагер") ||
    name.includes(" эль ") ||
    name.endsWith(" эль")
  ) return "beer"

  if(
    name.includes("виски") ||
    name.includes("ром") ||
    name.includes("джин") ||
    name.includes("водка") ||
    name.includes("текила") ||
    name.includes("коньяк") ||
    name.includes("бренди")
  ) return "strong"

  if(name.includes("чай")) return "tea"

  return "wine"
}


/* ===== КАРТИНКИ (ИСПРАВЛЕНО — БЕЗ МИГАНИЯ) ===== */

function getImage(product){

  if(product.image){
    return "./assets/wines/" + product.image
  }

  return "" // нет фото → пусто
}


/* ===== LAZY RENDER ===== */

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
          ${
            img
              ? `<img src="${img}" class="wine-img" loading="lazy">`
              : ``
          }
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

          <a href="product.html?id=${w.id}&from=${w.type}" class="btn-link">
            Подробнее →
          </a>
        </div>

      </div>
    `
  })

  rendered += CHUNK
}


/* ===== SCROLL LOAD ===== */

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

      if(type === "all"){
        render(ALL)
        return
      }

      const filtered = ALL.filter(w => w.type === type)

      render(filtered)

    })

  })

}


/* ===== ПОИСК ===== */

function bindSearch(){

  searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase()

    const filtered = ALL.filter(w =>
      (w.name_ru && w.name_ru.toLowerCase().includes(value)) ||
      (w.name_en && w.name_en.toLowerCase().includes(value))
    )

    render(filtered)

  })

}


/* ===== КНОПКА ВВЕРХ ===== */

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
  if(window.scrollY > 400){
    upBtn.style.display = "block"
  } else {
    upBtn.style.display = "none"
  }
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