// =====================
// ПАРАМЕТРЫ URL
// =====================
const params = new URLSearchParams(window.location.search)
const startCategory = params.get("category")

// =====================
// СОСТОЯНИЕ
// =====================
let activeCategory = startCategory || "all"
let searchQuery = ""

// =====================
// БЕЗОПАСНЫЙ ДОСТУП К DOM
// =====================
const grid = document.querySelector(".catalog-grid")

// 🔥 ВАЖНО — если нет контейнера → не падаем
if (!grid) {
  console.error("❌ .catalog-grid НЕ найден — каталог не отрисуется")
}

// =====================
// ДАННЫЕ
// =====================
const wines = window.WINES || []

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

  if (!grid) return

  let filtered = wines

  if(activeCategory !== "all"){
    filtered = filtered.filter(w => w.category === activeCategory)
  }

  if(searchQuery){
    filtered = filtered.filter(w =>
      w.name.toLowerCase().includes(searchQuery)
    )
  }

  grid.innerHTML = filtered.map(w => `
    <div class="card">

      <img src="${getImage(w.id)}" class="card-img">

      <div class="card-type">${w.categoryRu || w.category}</div>

      <div class="card-title">${w.name}</div>

      <div class="card-sub">${w.sub || ""}</div>

      <div class="card-price">${w.price} ₽</div>

      <a href="/product?id=${w.id}" class="card-btn">
        Подробнее →
      </a>

    </div>
  `).join("")
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
// СТАРТОВАЯ АКТИВАЦИЯ
// =====================
document.querySelectorAll(".category-btn").forEach(btn=>{
  if(btn.dataset.category === activeCategory){
    btn.classList.add("active")
  }
})

// =====================
render()