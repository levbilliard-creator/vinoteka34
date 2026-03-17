let ALL = []
const grid = document.querySelector(".catalogGrid")
const buttons = document.querySelectorAll(".categories button")

init()

async function init(){

  const res = await fetch("./data/products.json")
  ALL = await res.json()

  applyUrlFilter()
  bindButtons()
  render(ALL)

}


/* ===== ФИЛЬТР ИЗ URL (кнопка "подобрать") ===== */

function applyUrlFilter(){

  const params = new URLSearchParams(location.search)
  const filter = params.get("filter")

  if(filter === "wine"){
    const filtered = ALL.filter(w => w.type === "wine")
    render(filtered)
  }

}


/* ===== КНОПКИ КАТЕГОРИЙ ===== */

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


/* ===== РЕНДЕР ===== */

function render(items){

  grid.innerHTML = ""

  items.forEach(w => {

    grid.innerHTML += `
      <div class="product-card">

        <div class="image-wrap">
          <img src="${w.image || './assets/no-wine.png'}" class="wine-img">
        </div>

        <div class="wine-type">${translate(w.type)}</div>

        <div class="wine-en">${w.name_en || ""}</div>
        <div class="wine-ru">${w.name_ru}</div>

        <div class="wine-style">
          ${w.color || ""} ${w.sweetness || ""}
        </div>

        <div class="wine-price">${w.price} ₽</div>

        <a href="./product.html?id=${w.id}" class="btn-link">
          Подробнее →
        </a>

      </div>
    `
  })

}


/* ===== ПЕРЕВОД КАТЕГОРИЙ ===== */

function translate(type){

  if(type === "wine") return "Вино"
  if(type === "sparkling") return "Игристое"
  if(type === "strong") return "Крепкий алкоголь"
  if(type === "beer") return "Пиво"
  if(type === "soft") return "Безалкогольные"

  return "Напиток"
}