let ALL = []
let IMAGES = []

const grid = document.querySelector(".catalogGrid")
const buttons = document.querySelectorAll(".categories button")
const searchInput = document.getElementById("searchInput")

init()

async function init(){
  const [productsRes, imagesRes] = await Promise.all([
    fetch("./data/products.json"),
    fetch("./data/images.json")
  ])

  ALL = await productsRes.json()
  IMAGES = await imagesRes.json()

  ALL = ALL.map(p => ({
    ...p,
    type: detectType(p)
  }))

  render(ALL)
  bindButtons()
  bindSearch()
}


/* ===== ТОЛЬКО ЛОГИКА КАТЕГОРИЙ ===== */

function detectType(p){

  const name = (p.name_ru || "").toLowerCase()

  /* аксессуары */
  if(name.includes("бокал")) return "accessories"

  /* бакалея */
  if(
    name.includes("сыр") ||
    name.includes("салями") ||
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
    name.includes("леденцы") ||
    name.includes("печенье") ||
    name.includes("шоколад") ||
    name.includes("приправа")
  ) return "grocery"

  /* чай */
  if(name.includes("чай")) return "tea"

  /* пиво — строго */
  if(
    name.startsWith("пиво") ||
    name.includes(" пиво") ||
    name.includes("lager") ||
    name.includes("ipa") ||
    name.includes("stout")
  ) return "beer"

  /* игристое */
  if(
    name.includes("брют") ||
    name.includes("шампан") ||
    name.includes("просекко") ||
    name.includes("кава")
  ) return "sparkling"

  /* вино */
  if(
    name.includes("вино") ||
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
    name.includes("вермут")
  ) return "wine"

  /* крепкий */
  if(
    name.includes("виски") ||
    name.includes("ром") ||
    name.includes("джин") ||
    name.includes("водка") ||
    name.includes("текила") ||
    name.includes("коньяк") ||
    name.includes("бренди")
  ) return "strong"

  /* безалко */
  if(
    name.includes("вода") ||
    name.includes("кола") ||
    name.includes("сок") ||
    name.includes("тоник")
  ) return "soft"

  return "wine"
}


/* ===== КАРТИНКИ — КАК БЫЛО ===== */

function getImage(product){

  if(product.image){
    return "./assets/wines/" + product.image
  }

  const name = (product.name_ru || "").toLowerCase()

  let found = IMAGES.find(img =>
    name.includes(img.split(".")[0].toLowerCase())
  )

  return found
    ? "./assets/wines/" + found
    : "./assets/no-wine.png"
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
      } else {
        render(ALL.filter(w => w.type === type))
      }
    })
  })
}


/* ===== ПОИСК ===== */

function bindSearch(){
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase()

    render(ALL.filter(w =>
      (w.name_ru && w.name_ru.toLowerCase().includes(value)) ||
      (w.name_en && w.name_en.toLowerCase().includes(value))
    ))
  })
}


/* ===== РЕНДЕР — НЕ ТРОГАЕМ ===== */

function render(items){

  grid.innerHTML = ""

  if(!items.length){
    grid.innerHTML = "<p>Нет товаров</p>"
    return
  }

  items.forEach(w => {

    const img = getImage(w)

    grid.innerHTML += `
      <div class="card">

        <div class="card-image">
          <img src="${img}" loading="lazy"
               onerror="this.src='./assets/no-wine.png'">
        </div>

        <div class="card-body">

          <div class="card-type">${translate(w.type)}</div>

          ${w.name_en ? `<div class="card-en">${w.name_en}</div>` : ""}

          <div class="card-title">${w.name_ru}</div>

          <div class="card-price">${w.price} ₽</div>

          <a href="product.html?id=${w.id}" class="card-btn">
            Подробнее →
          </a>

        </div>

      </div>
    `
  })
}


/* ===== ПЕРЕВОД ===== */

function translate(type){
  return {
    wine: "Вино",
    sparkling: "Игристое",
    beer: "Пиво",
    strong: "Крепкий алкоголь",
    grocery: "Бакалея",
    soft: "Безалкогольные",
    tea: "Чай",
    accessories: "Аксессуары"
  }[type] || type
}