// =====================
// ПАРАМЕТРЫ URL
// =====================
const params = new URLSearchParams(window.location.search)
const startCategory = params.get("category")

let activeCategory = startCategory || "all"
let searchQuery = ""

// =====================
// ДАННЫЕ
// =====================
const wines = window.WINES || []

// =====================
// НАХОДИМ ТВОЙ СТАРЫЙ КОНТЕЙНЕР
// (не catalog-grid!)
// =====================
const container = document.querySelector(".catalogPage")

// =====================
// КАРТИНКИ
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

  if(activeCategory !== "all"){
    filtered = filtered.filter(w => w.category === activeCategory)
  }

  if(searchQuery){
    filtered = filtered.filter(w =>
      w.name.toLowerCase().includes(searchQuery)
    )
  }

  // 🔥 ВАЖНО: не ломаем твою верстку
  const cards = filtered.map(w => `
    <div class="card">
      <img src="${getImage(w.id)}">

      <div>${w.categoryRu || w.category}</div>
      <div>${w.name}</div>
      <div>${w.sub || ""}</div>

      <div>${w.price} ₽</div>

      <a href="/product?id=${w.id}">
        Подробнее →
      </a>
    </div>
  `).join("")

  // вставляем В КОНЕЦ (как было)
  container.innerHTML = `
    ${container.innerHTML.split('<div class="card">')[0] || container.innerHTML}
    <div class="cards-wrap">
      ${cards}
    </div>
  `
}

// =====================
// КНОПКИ
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
const searchInput = document.querySelector(".search-input")

if(searchInput){
  searchInput.addEventListener("input", e=>{
    searchQuery = e.target.value.toLowerCase()
    render()
  })
}

// =====================
render()