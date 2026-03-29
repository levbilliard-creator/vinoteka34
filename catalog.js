let ALL = []
let IMAGES = {}

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

    const imagesArr = await imagesRes.json()

    /* ПРЕВРАЩАЕМ В ОБЪЕКТ id → файл */
    IMAGES = {}
    imagesArr.forEach(i => {
      IMAGES[i.id] = i.file
    })

    ALL = ALL.map(p => ({
      ...p,
      type: detectType(p)
    }))

    render(ALL)
    bindButtons()
    bindSearch()

  }catch(e){
    console.error("Ошибка загрузки данных", e)
  }
}


/* ===== detectType НЕ ТРОГАЕМ ===== */

function detectType(p){

  const name = (p.name_ru || "").toLowerCase()

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
    name.includes("вермут") ||
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
    name.includes("николаев") ||
    name.includes("эльзас") ||
    name.includes("вино")
  ) return "wine"

  if(
    name.includes("брют") ||
    name.includes("шампан") ||
    name.includes("просекко") ||
    name.includes("кава")
  ) return "sparkling"

  if(
    name.startsWith("пиво") ||
    name.includes("пивной напиток") ||
    name.includes("пивосодержащ")
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


/* ===== ЖЁСТКАЯ ПРИВЯЗКА КАРТИНОК ===== */

function getImage(product){

  const file = IMAGES[product.id]

  if(file){
    return "./assets/wines/" + file
  }

  /* НЕТ ФОТО → ПУСТО */
  return ""
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

  grid.innerHTML = ""

  items.forEach(w => {

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

          <a href="product.html?id=${w.id}" class="btn-link">
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