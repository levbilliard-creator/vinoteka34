let ALL = []
let CURRENT = []

const grid = document.querySelector(".catalogGrid")
const buttons = document.querySelectorAll(".categories button")
const searchInput = document.getElementById("searchInput")

init()

async function init(){
  try{
    const res = await fetch("./data/products.json")
    ALL = await res.json()
    CURRENT = ALL

    initialRender()   // 🔥 один раз

    bindButtons()
    bindSearch()

  }catch(e){
    console.error("Ошибка загрузки", e)
  }
}


/* ===== КАРТИНКА ===== */

function getImage(product){
  if(product.image){
    return encodeURI("./assets/wines/" + product.image)
  }
  return "./assets/no-wine.png"
}


/* ===== ПЕРВЫЙ РЕНДЕР ===== */

function initialRender(){

  let html = ""

  ALL.forEach(w => {

    const img = getImage(w)

    html += `
      <div class="product-card" data-id="${w.id}">

        <div class="img-wrap">
          <img src="${img}" class="wine-img">
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
          <a href="./product.html?id=${w.id}" class="btn-link">
            Открыть →
          </a>
        </div>

      </div>
    `
  })

  grid.innerHTML = html
}


/* ===== ФИЛЬТР БЕЗ ПЕРЕРИСОВКИ ===== */

function updateView(list){

  const ids = new Set(list.map(x => x.id))

  document.querySelectorAll(".product-card").forEach(card => {

    const id = Number(card.dataset.id)

    if(ids.has(id)){
      card.style.display = ""
    } else {
      card.style.display = "none"
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
        CURRENT = ALL
      } else {
        CURRENT = ALL.filter(w => w.type === type)
      }

      updateView(CURRENT)

    })

  })

}


/* ===== ПОИСК ===== */

function bindSearch(){

  searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase()

    CURRENT = ALL.filter(w =>
      (w.name_ru && w.name_ru.toLowerCase().includes(value)) ||
      (w.name_en && w.name_en.toLowerCase().includes(value))
    )

    updateView(CURRENT)

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