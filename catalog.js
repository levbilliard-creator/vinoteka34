let ALL = []

let grid
let buttons
let searchInput

let rendered = 0
const CHUNK = 20
let currentItems = []
let currentType = "all"

window.addEventListener("load", () => {

grid = document.querySelector(".catalogGrid")
buttons = document.querySelectorAll(".categories button")
searchInput = document.getElementById("searchInput")

if(!grid){
console.error("catalogGrid не найден")
return
}

const params = new URLSearchParams(window.location.search)
const from = params.get("type")
if(from){
currentType = from
}

init()
})

async function init(){
try{
const res = await fetch("/data/products.json")
ALL = await res.json()

applyFilter(currentType)

bindButtons()
bindSearch()
initScroll()

}catch(e){
console.error("Ошибка загрузки данных", e)
}
}

function applyFilter(type){

if(type === "all"){
render(ALL)
return
}

let filtered = ALL.filter(w => w.type === type)
render(filtered)
}

function getImage(product){

if(product.image){
return "/assets/wines/" + product.image
}

if(product.id){
return "/assets/wines/" + product.id + ".jpg"
}

return ""
}

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

    <a href="/product.html?id=${w.id}&from=${currentType}" class="btn-link">
      Подробнее →
    </a>

  </div>

</div>
`

})

rendered += CHUNK
}

function initScroll(){
window.addEventListener("scroll", () => {
if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){
renderNext()
}
})
}

function bindButtons(){

buttons.forEach(btn => {

btn.addEventListener("click", () => {

buttons.forEach(b => b.classList.remove("active"))
btn.classList.add("active")

const type = btn.dataset.type
currentType = type

applyFilter(type)

})

})
}

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