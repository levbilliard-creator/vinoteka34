let ALL = []
let IMAGES = []
let IMAGE_MAP = {}

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

    buildImageMap()   // ← ВАЖНО (ОДИН РАЗ)

    render(ALL)
    bindButtons()
    bindSearch()

  }catch(e){
    console.error("Ошибка загрузки", e)
  }
}


/* ===== НОРМАЛИЗАЦИЯ ===== */

function normalize(str){
  return (str || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}


/* ===== СТРОИМ КАРТИНКИ 1 РАЗ (УБИРАЕТ МИГАНИЕ) ===== */

function buildImageMap(){

  ALL.forEach(product => {

    if(product.image){
      IMAGE_MAP[product.id] = "./assets/wines/" + product.image
      return
    }

    const name = normalize(product.name_ru + " " + product.name_en)

    let bestMatch = null
    let bestScore = 0

    IMAGES.forEach(file => {

      const fileName = normalize(file.replace(/\.(png|jpg|jpeg)/, ""))

      let score = 0

      fileName.split(" ").forEach(word => {

        if(word.length < 3) return
        if(name.includes(word)) score++

      })

      if(score > bestScore){
        bestScore = score
        bestMatch = file
      }

    })

    if(bestMatch){
      IMAGE_MAP[product.id] = "./assets/wines/" + bestMatch
    }else{
      IMAGE_MAP[product.id] = "./assets/no-wine.png"
    }

  })
}


/* ===== КНОПКИ (ПРЯМОЕ СРАВНЕНИЕ) ===== */

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

      const filtered = ALL.filter(w => {

        const t = (w.type || "").toLowerCase()

        if(type === "wine") return t.includes("вино")
        if(type === "sparkling") return t.includes("игрист")
        if(type === "beer") return t.includes("пиво")
        if(type === "strong") return t.includes("виск") || t.includes("коньяк") || t.includes("ром") || t.includes("водка")
        if(type === "grocery") return t.includes("бакале")
        if(type === "soft") return t.includes("безалк")
        if(type === "tea") return t.includes("чай")
        if(type === "accessories") return t.includes("аксесс")

        return false
      })

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


/* ===== РЕНДЕР (СТАБИЛЬНЫЙ) ===== */

function render(items){

  if(!grid) return

  if(items.length === 0){
    grid.innerHTML = "<p style='opacity:0.6'>Нет товаров</p>"
    return
  }

  let html = ""

  items.forEach(w => {

    const img = IMAGE_MAP[w.id] || "./assets/no-wine.png"

    html += `
      <div class="product-card">

        <div class="img-wrap">
          <img src="${img}" class="wine-img"
               loading="lazy"
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

  grid.innerHTML = html
}


/* ===== ПЕРЕВОД ===== */

function translate(type){

  if(type.includes("вино")) return "Вино"
  if(type.includes("игрист")) return "Игристое"
  if(type.includes("пиво")) return "Пиво"
  if(type.includes("креп")) return "Крепкий алкоголь"
  if(type.includes("бакале")) return "Бакалея"
  if(type.includes("безалк")) return "Безалкогольные"
  if(type.includes("чай")) return "Чай"
  if(type.includes("аксесс")) return "Аксессуары"

  return type
}