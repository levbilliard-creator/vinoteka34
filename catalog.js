async function loadProducts(){

  try{

    const res = await fetch("./data/products.json")
    const products = await res.json()

    window.ALL_PRODUCTS = products

    initFilters(products)
    render(products)

  }catch(e){
    console.error("Ошибка загрузки товаров", e)
  }

}


/* ---------- КАРТИНКА ---------- */

function wineImage(id){
  return `/assets/labels/${(id % 30) + 1}.jpg`
}


/* ---------- РЕНДЕР ---------- */

function render(list){

  const grid = document.getElementById("catalogGrid")
  if(!grid) return

  grid.innerHTML = ""

  list.forEach(p => {

    const image = wineImage(p.id)

    const card = document.createElement("div")
    card.className = "product-card"

    card.innerHTML = `

      <div class="image-wrap">
        <img class="wine-img"
        src="${image}"
        loading="lazy"
        onerror="this.src='/assets/wine.jpg'">
      </div>

      <div class="wine-type">
        ${p.category || "Вино"}
      </div>

      <div class="wine-en">
        ${p.name_en || ""}
      </div>

      <div class="wine-ru">
        ${p.name_ru}
      </div>

      <div class="wine-style">
        ${p.color || ""} ${p.style || ""}
      </div>

      <div class="wine-price">
        ${p.price ? p.price + " ₽" : ""}
      </div>

      <a href="./product.html?id=${p.id}" class="btn-link">
        Подробнее →
      </a>

    `

    grid.appendChild(card)

  })

}


/* ---------- ФИЛЬТРЫ ---------- */

function initFilters(products){

  const buttons = document.querySelectorAll(".category-btn")

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      const cat = btn.dataset.category

      if(cat === "all"){
        render(products)
      } else {
        const filtered = products.filter(p => p.category === cat)
        render(filtered)
      }

    })
  })


  const search = document.getElementById("searchInput")

  if(search){
    search.addEventListener("input", () => {

      const q = search.value.toLowerCase()

      const filtered = products.filter(p =>
        (p.name_ru && p.name_ru.toLowerCase().includes(q)) ||
        (p.name_en && p.name_en.toLowerCase().includes(q))
      )

      render(filtered)

    })
  }

}


/* ---------- СТАРТ ---------- */

loadProducts()