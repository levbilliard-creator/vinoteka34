let ALL = []

const grid = document.querySelector(".catalogGrid")
const buttons = document.querySelectorAll(".categories button")
const searchInput = document.getElementById("searchInput")

init()

async function init(){

  const res = await fetch("./data/products.json")
  ALL = await res.json()

  console.log("ВСЕ ТОВАРЫ:", ALL) // для проверки

  render(ALL)
  bindButtons()
  bindSearch()
}


/* ===== КНОПКИ ===== */

function bindButtons(){

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"))
      btn.classList.add("active")

      const type = btn.dataset.type

      console.log("ФИЛЬТР:", type)

      if(type === "all"){
        render(ALL)
        return
      }

      const filtered = ALL.filter(w => w.type === type)

      console.log("НАЙДЕНО:", filtered.length)

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


/* ===== РЕНДЕР ===== */

function render(items){

  grid.innerHTML = ""

  if(items.length === 0){
    grid.innerHTML = "<p style='opacity:0.6'>Нет товаров</p>"
    return
  }

  items.forEach(w => {

    grid.innerHTML += `
      <div class="product-card">

        <img src="${w.image || './assets/no-wine.png'}" class="wine-img">

        <div class="wine-type">${translate(w.type)}</div>

        <div class="wine-en">${w.name_en || ""}</div>
        <div class="wine-ru">${w.name_ru}</div>

        <div class="wine-style">
          ${w.color || ""} ${w.style || ""}
        </div>

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