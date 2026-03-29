const API_URL = "/data/products.json"

let PRODUCTS = []
let FILTER = "all"

/* ===================== */
/* ЗАГРУЗКА */
/* ===================== */
async function loadProducts(){
  try{
    const res = await fetch(API_URL)
    const data = await res.json()

    PRODUCTS = data.map(p => ({
      ...p,
      category: detectType(p)
    }))

    render()
  }catch(e){
    console.error("Ошибка загрузки", e)
  }
}

/* ===================== */
/* КАТЕГОРИИ (ИСПРАВЛЕНО) */
/* ===================== */
function detectType(p){

  const name = (p.name_ru || "").toLowerCase()

  /* АКСЕССУАРЫ */
  if(name.includes("бокал")){
    return "accessories"
  }

  /* БАКАЛЕЯ */
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
    name.includes("леденцы") ||
    name.includes("печенье") ||
    name.includes("шоколад") ||
    name.includes("приправа")
  ){
    return "grocery"
  }

  /* ВИНО + ВЕРМУТ */
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
  ){
    return "wine"
  }

  /* ИГРИСТОЕ */
  if(
    name.includes("брют") ||
    name.includes("шампан") ||
    name.includes("просекко") ||
    name.includes("кава")
  ){
    return "sparkling"
  }

  /* КРЕПКИЙ */
  if(
    name.includes("виски") ||
    name.includes("ром") ||
    name.includes("джин") ||
    name.includes("водка") ||
    name.includes("текила") ||
    name.includes("коньяк") ||
    name.includes("бренди")
  ){
    return "strong"
  }

  /* ПИВО */
  if(
    name.startsWith("пиво") ||
    name.includes(" пиво") ||
    name.includes("пивной напиток") ||
    name.includes("пивосодержащ") ||
    name.includes(" лагер") ||
    name.endsWith(" лагер") ||
    name.includes(" эль ") ||
    name.endsWith(" эль")
  ){
    return "beer"
  }

  /* ЧАЙ */
  if(name.includes("чай")){
    return "tea"
  }

  /* БЕЗАЛКО */
  if(
    name.includes("вода") ||
    name.includes("кола") ||
    name.includes("сок") ||
    name.includes("тоник")
  ){
    return "soft"
  }

  return "wine"
}

/* ===================== */
/* ФИЛЬТР */
/* ===================== */
function setFilter(f){
  FILTER = f
  render()
}

/* ===================== */
/* РЕНДЕР */
/* ===================== */
function render(){

  const grid = document.getElementById("catalogGrid")
  if(!grid) return

  grid.innerHTML = ""

  let items = PRODUCTS

  if(FILTER !== "all"){
    items = items.filter(p => p.category === FILTER)
  }

  items.forEach(p => {
    grid.appendChild(createCard(p))
  })
}

/* ===================== */
/* КАРТОЧКА */
/* ===================== */
function createCard(p){

  const div = document.createElement("div")
  div.className = "card"

  const img = p.image || "/assets/placeholder.png"

  div.innerHTML = `
    <div class="card-image">
      <img src="${img}" loading="lazy">
    </div>

    <div class="card-body">
      <div class="card-type">${getTypeLabel(p.category)}</div>

      <div class="card-title">${p.name_ru}</div>

      ${p.color ? `<div class="card-sub">${p.color}</div>` : ""}

      <div class="card-price">${formatPrice(p.price)}</div>

      <a href="product.html?id=${p.id}" class="card-btn">Подробнее →</a>
    </div>
  `

  return div
}

/* ===================== */
/* ЛЕЙБЛЫ */
/* ===================== */
function getTypeLabel(t){
  return {
    wine: "Вино",
    sparkling: "Игристое",
    strong: "Крепкий алкоголь",
    beer: "Пиво",
    soft: "Безалкогольные",
    grocery: "Бакалея",
    tea: "Чай",
    accessories: "Аксессуары"
  }[t] || ""
}

/* ===================== */
/* ЦЕНА */
/* ===================== */
function formatPrice(p){
  return new Intl.NumberFormat('ru-RU').format(p) + " ₽"
}

/* ===================== */
/* СТАРТ */
/* ===================== */
loadProducts()