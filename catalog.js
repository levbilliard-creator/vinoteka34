// =====================
// ПАРАМЕТРЫ URL
// =====================
const params = new URLSearchParams(window.location.search)
let activeCategory = params.get("category") || "all"
let searchQuery = ""

// =====================
let wines = []

const container = document.querySelector(".catalogPage")

// =====================
// ЗАГРУЗКА ДАННЫХ
// =====================
async function loadData(){
  try {
    const res = await fetch("./data/products.json")
    wines = await res.json()

    render()

  } catch(e){
    console.error("Ошибка загрузки данных", e)
  }
}

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
      w.name?.toLowerCase().includes(searchQuery)
    )
  }

  const cards = filtered.map(w => `
    <div class="card">
      <img src="${getImage(w.id)}">

      <div>${w.category}</div>
      <div>${w.name}</div>
      <div>${w.type || ""}</div>

      <div>${w.price} ₽</div>

      <a href="/product?id=${w.id}">
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
loadData()