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

function norm(str){
  return (str || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[’']/g, "")
}


/* ===== ПРОСТОЙ ПОИСК ФАЙЛА ===== */

function getImage(product){

  // ручная картинка
  if(product.image){
    return encodeURI("./assets/wines/" + product.image)
  }

  const name = norm(product.name_ru)

  for(let file of IMAGES){

    const f = norm(file)

    // если хотя бы одно слово совпало — берем
    const words = name.split(" ")

    for(let w of words){
      if(w.length > 3 && f.includes(w)){
        return encodeURI("./assets/wines/" + file)
      }
    }
  }

  return "./assets/no-wine.png"
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

      render(ALL.filter(w => w.type === type))
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