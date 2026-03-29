let ALL = []
let IMAGES = []

const grid = document.querySelector(".catalogGrid")
const buttons = document.querySelectorAll(".categories button")
const searchInput = document.getElementById("searchInput")

init()

async function init(){
  try{
    const [productsRes, imagesRes] = await Promise.all([
      fetch("./data/products.json"),
      fetch("./data/images.json")
    ])

    ALL = await productsRes.json()
    IMAGES = await imagesRes.json()

    // 🔥 НОРМАЛИЗАЦИЯ ТИПОВ (ОДИН РАЗ)
    ALL = ALL.map(p => ({
      ...p,
      type: normalizeType(p)
    }))

    render(ALL)
    bindButtons()
    bindSearch()

  }catch(e){
    console.error("Ошибка загрузки данных", e)
  }
}

function normalizeType(p){

  const name = (p.name_ru || "").toLowerCase()

  // ВИНО
  if(name.includes("вино")) return "wine"

  // ИГРИСТОЕ
  if(name.includes("игрист") || name.includes("шампан")) return "sparkling"

  // ПИВО
  if(name.includes("пиво") || name.includes("эль") || name.includes("лагер") || name.includes("корона"))
    return "beer"

  // КРЕПКИЙ АЛКОГОЛЬ
  if(
    name.includes("виски") ||
    name.includes("ром") ||
    name.includes("джин") ||
    name.includes("водка") ||
    name.includes("текила") ||
    name.includes("бренди")
  ) return "strong"

  // БЕЗАЛКОГОЛЬНЫЕ
  if(
    name.includes("вода") ||
    name.includes("cola") ||
    name.includes("кола") ||
    name.includes("сок") ||
    name.includes("тоник")
  ) return "soft"

  // ЧАЙ
  if(name.includes("чай")) return "tea"

  // АКСЕССУАРЫ
  if(name.includes("бокал") || name.includes("штопор"))
    return "accessories"

  // БАКАЛЕЯ
  return "grocery"
}


/* ===== ИЗОБРАЖЕНИЯ (СТАБИЛЬНО) ===== */

const imageMap = {}

function getImage(product){

  if(product.image){
    return "./assets/wines/" + product.image
  }

  const key = product.id

  if(imageMap[key]){
    return imageMap[key]
  }

  const name = (product.name_ru || "").toLowerCase()

  let found = IMAGES.find(img =>
    name.includes(img.split(".")[0].toLowerCase())
  )

  const result = found
    ? "./assets/wines/" + found
    : "./assets/no-wine.png"

  imageMap[key] = result
  return result
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


/* ===== РЕНДЕР ===== */

function render(items){

  if(!grid){
    console.error("catalogGrid не найден")
    return
  }

  grid.innerHTML = ""

  if(items.length === 0){
    grid.innerHTML = "<p style='opacity:0.6'>Нет товаров</p>"
    return
  }

  items.forEach(w => {

    const img = getImage(w)

    grid.innerHTML += `
      <div class="product-card">

        <div class="img-wrap">
          <img src="${img}" class="wine-img"
               onerror="this.src='./assets/no-wine.png'">
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
            Подробнее →
          </a>
        </div>

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