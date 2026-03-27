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
    .replace(/[^a-zа-я0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}


/* ===== УЛУЧШЕННЫЙ МАТЧИНГ ===== */

function findImage(product){

  if(!IMAGES || IMAGES.length === 0){
    return "./assets/no-wine.png"
  }

  const name = normalize(product.name_ru)

  let bestMatch = null
  let bestScore = 0

  IMAGES.forEach(file => {

    const fileName = normalize(file.replace(/\.(png|jpg|jpeg)/, ""))

    let score = 0

    const words = fileName.split(" ")

    words.forEach(word => {
      if(word.length > 2 && name.includes(word)){
        score++
      }
    })

    if(score > bestScore){
      bestScore = score
      bestMatch = file
    }

  })

  // 🔥 Порог — чтобы не было мусора
  if(bestMatch && bestScore >= 2){
    return "./assets/wines/" + bestMatch
  }

  return "./assets/no-wine.png"
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

    const img = findImage(w)

    grid.innerHTML += `
      <div class="product-card">

        <img src="${img}" class="wine-img"
             onerror="this.src='./assets/no-wine.png'">

        <div class="wine-type">${translate(w.type)}</div>

        ${w.name_en ? `<div class="wine-en">${w.name_en}</div>` : ""}

        <div class="wine-ru">${w.name_ru}</div>

        ${(w.color || w.style) ? `
          <div class="wine-style">
            ${w.color || ""} ${w.style || ""}
          </div>
        ` : ""}

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