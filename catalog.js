// =====================
// ПОЛУЧЕНИЕ ПАРАМЕТРОВ
// =====================
const params = new URLSearchParams(window.location.search)
const startCategory = params.get("category")

// =====================
// СОСТОЯНИЕ
// =====================
let activeCategory = startCategory || "all"
let searchQuery = ""

// =====================
// МАППИНГ КАРТИНОК
// =====================
function getImage(id){
  const map = {
    1: "./assets/wines/арманьяк сент обен.png",
    5: "./assets/wines/марселан дивноморское.jpg"
  }

  return map[id] || "./assets/no-wine.png"
}

// =====================
// ДАННЫЕ (пример)
// =====================
const wines = window.WINES || []

// =====================
// DOM
// =====================
const grid = document.querySelector(".catalog-grid")
const searchInput = document.querySelector(".search-input")
const buttons = document.querySelectorAll(".category-btn")

// =====================
// РЕНДЕР
// =====================
function render(){
  let filtered = wines

  // фильтр категории
  if(activeCategory !== "all"){
    filtered = filtered.filter(w => w.category === activeCategory)
  }

  // поиск
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
// СОБЫТИЯ
// =====================

// кнопки категорий
buttons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    activeCategory = btn.dataset.category

    buttons.forEach(b=>b.classList.remove("active"))
    btn.classList.add("active")

    render()
  })
})

// поиск
if(searchInput){
  searchInput.addEventListener("input", (e)=>{
    searchQuery = e.target.value.toLowerCase()
    render()
  })
}

// =====================
// ИНИЦИАЛИЗАЦИЯ
// =====================

// активная кнопка при загрузке
buttons.forEach(btn=>{
  if(btn.dataset.category === activeCategory){
    btn.classList.add("active")
  }
})

// первый рендер
render()