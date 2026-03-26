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
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}


/* ===== УМНЫЙ МАТЧИНГ ===== */

function findImage(product){

  if(product.image){
    return "./assets/wines/" + product.image
  }

  if(!IMAGES || IMAGES.length === 0){
    return "./assets/no-wine.png"
  }

  const ru = normalize(product.name_ru)
  const en = normalize(product.name_en)

  const name = ru + " " + en

  let bestMatch = null
  let bestScore = 0

  IMAGES.forEach(file => {

    const fileName = normalize(file.replace(/\.(png|jpg|jpeg)/, ""))

    let score = 0

    const fileWords = fileName.split(" ")
    const nameWords = name.split(" ")

    fileWords.forEach(word => {

      if(word.length < 3) return

      if(nameWords.includes(word)){
        score += 2
      }

      if(name.includes(word)){
        score += 1
      }

    })

    if(fileWords[0] && name.startsWith(fileWords[0])){
      score += 2
    }

    if(score > bestScore){
      bestScore = score
      bestMatch = file
    }

  })

  if(bestMatch && bestScore >= 3){
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
      <div class="product-card" style="
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        height:100%;
      ">

        <div style="
          width:100%;
          height:160px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          margin-bottom:10px;
        ">
          <img src="${img}" 
               style="max-height:140px; max-width:90%; object-fit:contain;"
               onerror="this.src='./assets/no-wine.png'">
        </div>

        <div class="wine-type">${translate(w.type)}</div>

        ${w.name_en ? `<div class="wine-en">${w.name_en}</div>` : ""}

        <div class="wine-ru" style="min-height:48px;">
          ${w.name_ru}
        </div>

        ${(w.color || w.style) ? `
          <div class="wine-style">
            ${w.color || ""} ${w.style || ""}
          </div>
        ` : ""}

        <div style="
          margin-top:auto;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <div class="wine-price">${w.price} ₽</div>

          <a href="./product.html?id=${w.id}" 
             class="btn-link"
             style="pointer-events:auto;">
            Открыть →
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