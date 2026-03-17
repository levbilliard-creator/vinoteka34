// =====================
// СОСТОЯНИЕ
// =====================
const params = new URLSearchParams(window.location.search)

let activeCategory = params.get("category") || "all"
let searchQuery = ""

let wines = []

// =====================
// DOM
// =====================
const container = document.querySelector(".catalogPage")
const searchInput = document.querySelector(".search-input")

// =====================
// ЗАГРУЗКА JSON
// =====================
async function loadData(){
  try {
    const res = await fetch("./data/products.json")
    wines = await res.json()

    render()

  } catch(e){
    console.error("Ошибка загрузки products.json", e)
  }
}

// =====================
// КАРТИНКИ (оставляем как есть)
// =====================
function getImage(id){
  const map = {
    1: "./assets/wines/арманьяк сент обен.png",
    5: "./assets/wines/марселан дивноморское.jpg"
  }

  return map[id] || "./assets/no-wine.png"
}

// =====================
// РЕНДЕР
// =====================
function render(){

  if (!container) return

  let filtered = wines

  // фильтр категории
  if(activeCategory !== "all"){
    filtered = filtered.filter(w => w.category === activeCategory)
  }

  // поиск
  if(searchQuery){
    filtered = filtered.filter(w =>
      w.name_ru?.toLowerCase().includes(searchQuery)
    )
  }

  const cards = filtered.map(w => `
    <div class="card">

      <img src="${getImage(w.id)}" alt="${w.name_ru}">

      <div class="card-type">
        ${w.category}
      </div>

      <div class="card-title">
        ${w.name_en ? `<div class="en">${w.name_en}</div>` : ""}
        <div class="ru">${w.name_ru}</div>
      </div>

      <div class="card-meta">
        ${w.color || ""} ${w.style || ""}
      </div>

      <div class="card-price">
        ${w.price} ₽
      </div>

      <a class="card-btn" href="/product?id=${w.id}">
        Подробнее →
      </a>

    </div>
  `).join("")

  container.innerHTML = `
    <div class="cards-wrap">
      ${cards}
    </div>
  `
}

// =====================
// КАТЕГОРИИ
// =====================
document.querySelectorAll(".category-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    activeCategory = btn.dataset.category

    document.querySelectorAll(".category-btn")
      .forEach(b=>b.classList.remove("active"))

    btn.classList.add("active")

    render()
  })
})

// =====================
// ПОИСК
// =====================
if(searchInput){
  searchInput.addEventListener("input", e=>{
    searchQuery = e.target.value.toLowerCase()
    render()
  })
}

// =====================
loadData()