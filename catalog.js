let ALL = []

let grid
let buttons
let searchInput

let IMAGES = []

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

  init()
})

async function init(){
  try{

    const [resProducts, resImages] = await Promise.all([
      fetch("./data/products.json"),
      fetch("./data/images.json")
    ])

    ALL = await resProducts.json()
    IMAGES = await resImages.json()

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


/* ===================== FIX detectType ===================== */

function detectType(p){

  const name = (p.name_ru || "").toLowerCase()

  /* 🔥 критические фиксы */
  if(name.includes("corona")) return "beer"
  if(name.includes("пивосодержащ")) return "beer"

  if(name.includes("cola") || name.includes("кола") || name.includes("schweppes") || name.includes("швепс") || name.includes("tonic")) return "soft"

  if(name.includes("brandy") || name.includes("бренди")) return "strong"

  if(name.includes("николаев")) return "wine"
  if(name.includes("вермут")) return "wine"
  if(name.includes("ракия")) return "strong"
  if(name.includes("ром выдержанный эль")) return "strong"

  if(name.includes("чипс") || name.includes("сорбиодетокс") || name.includes("стакан")) return "grocery"
  if(name.includes("бокал")) return "accessories"

  if(name.includes("сыр") || name.includes("оливк") || name.includes("анчоус") || name.includes("приправа")) return "grocery"

  if(name.includes("вода") || name.includes("сок")) return "soft"

  if(name.includes("брют") || name.includes("шампан") || name.includes("просекко") || name.includes("кава")) return "sparkling"

  if(name.includes("вино") || name.includes("шато") || name.includes("рислинг") || name.includes("пино")) return "wine"

  if(name.includes("пиво")) return "beer"

  if(name.includes("виски") || name.includes("ром") || name.includes("джин") || name.includes("коньяк")) return "strong"

  if(name.includes("чай")) return "tea"

  return "wine"
}


/* ===================== IMAGES ===================== */

function normalize(str){
  return (str || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeFile(file){
  return normalize(file.replace(/\.[^/.]+$/, ""))
}

function getTokens(str){
  return normalize(str).split(" ").filter(w => w.length > 2)
}

function matchScore(productTokens, fileTokens){
  let score = 0
  productTokens.forEach(t => {
    if(fileTokens.includes(t)) score++
  })
  return score
}

function findBestImage(product){

  if(!Array.isArray(IMAGES)) return null

  const pTokens = getTokens(product.name_ru)

  let best = null
  let bestScore = 0

  IMAGES.forEach(file => {

    const fTokens = getTokens(normalizeFile(file))
    const score = matchScore(pTokens, fTokens)

    if(score > bestScore && score >= 3){   // 🔥 ТВОЁ правило
      bestScore = score
      best = file
    }

  })

  return best
}


/* ===================== FIX getImage ===================== */

function getImage(product){

  /* 🔥 1. ID система (если внедришь) */
  if(!Array.isArray(IMAGES) && IMAGES[product.id]){
    return "./assets/wines/" + IMAGES[product.id]
  }

  /* 🔥 2. матчинг (текущий режим) */
  const best = findBestImage(product)

  if(best){
    return "./assets/wines/" + best
  }

  /* ❌ убрали fallback по ID — он ломал */
  return ""
}


/* ===================== RENDER ===================== */

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
          ${img ? `<img src="${img}" class="wine-img" loading="lazy" onerror="this.style.display='none'">` : ``}
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


/* ===================== SCROLL ===================== */

function initScroll(){
  window.addEventListener("scroll", () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){
      renderNext()
    }
  })
}


/* ===================== BUTTONS ===================== */

function bindButtons(){

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"))
      btn.classList.add("active")

      const type = btn.dataset.type
      currentType = type

      if(type === "all"){
        render(ALL)
        return
      }

      render(ALL.filter(w => w.type === type))

    })

  })
}


/* ===================== SEARCH ===================== */

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


/* ===================== UP BUTTON ===================== */

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


/* ===================== TRANSLATE ===================== */

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