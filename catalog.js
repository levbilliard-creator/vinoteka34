let ALL = []
let IMAGES = []
let IMAGE_CACHE = {}

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

    buildImageCache()
    render(ALL)

    bindButtons()
    bindSearch()

  }catch(e){
    console.error("Ошибка загрузки данных", e)
  }
}


/* ===== НОРМАЛИЗАЦИЯ ===== */

function normalize(str){
  return (str || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[’']/g, "")   // 🔥 ключевая строка
    .replace(/[^a-zа-я0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}


/* ===== СЛОВА ===== */

function words(str){
  return normalize(str)
    .split(" ")
    .filter(w => w.length > 2)
}


/* ===== ПОИСК ФАЙЛА (ГЛАВНОЕ) ===== */

function findRealImage(product){

  const pWords = words(product.name_ru)

  let bestMatch = null
  let bestScore = 0

  IMAGES.forEach(file => {

    const fWords = words(file)

    let score = 0

    pWords.forEach(w => {
      if(fWords.includes(w)){
        score++
      }
    })

    if(score > bestScore){
      bestScore = score
      bestMatch = file
    }

  })

  return bestMatch
}


/* ===== КЭШ ===== */

function buildImageCache(){

  ALL.forEach(product => {

    // ручная картинка
    if(product.image && product.image.trim() !== ""){
      IMAGE_CACHE[product.id] = "./assets/wines/" + product.image.trim()
      return
    }

    const file = findRealImage(product)

    if(file){
      IMAGE_CACHE[product.id] = "./assets/wines/" + file
    } else {
      IMAGE_CACHE[product.id] = "./assets/no-wine.png"
    }

  })

}


/* ===== ПОЛУЧЕНИЕ ===== */

function getImage(product){
  return IMAGE_CACHE[product.id] || "./assets/no-wine.png"
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

  if(items.length === 0){
    grid.innerHTML = "<p style='opacity:0.6'>Нет товаров</p>"
    return
  }

  let html = ""

  items.forEach(w => {

    const img = getImage(w)

    html += `
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
            Открыть →
          </a>
        </div>

      </div>
    `
  })

  grid.innerHTML = html
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