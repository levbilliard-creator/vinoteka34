document.addEventListener("DOMContentLoaded", () => {

let products = []
let filtered = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")

// соответствие кнопок и категорий из JSON
const CATEGORY_MAP = {
  wine: "вино",
  sparkling: "игрист",
  strong: "креп",
  grocery: "бакале",
  tea: "чай"
}

async function loadCatalog(){
  try{
    const res = await fetch("/data/products.json")
    const data = await res.json()

    products = Array.isArray(data) ? data : data.products || []
    filtered = products

    renderCatalog()
  }catch(e){
    console.error("Ошибка загрузки каталога", e)
  }
}

function renderCatalog(){
  if(!grid) return

  grid.innerHTML = filtered.map(p => `
    <div class="catalog-card">
      <div class="catalog-card-title">
        ${p.name_ru || ""}
      </div>

      <div class="catalog-card-price">
        ${p.price ? p.price + " ₽" : ""}
      </div>

      <a class="catalog-card-link" href="product.html?id=${p.id}">
        Подробнее
      </a>
    </div>
  `).join("")
}

function searchProducts(){
  const value = searchInput.value.toLowerCase()

  filtered = products.filter(p =>
    (p.name_ru || "").toLowerCase().includes(value) ||
    (p.name_en || "").toLowerCase().includes(value)
  )

  renderCatalog()
}

function categoryFilter(key){

  if(key === "all"){
    filtered = products
  }else{

    const target = CATEGORY_MAP[key]

    filtered = products.filter(p =>
      (p.category || "").toLowerCase().includes(target)
    )
  }

  renderCatalog()
}

function initFilters(){

  document.querySelectorAll("[data-filter]").forEach(btn => {

    btn.addEventListener("click", () => {

      const key = btn.dataset.filter
      categoryFilter(key)

    })

  })

  if(searchInput){
    searchInput.addEventListener("input", searchProducts)
  }
}

initFilters()
loadCatalog()

})