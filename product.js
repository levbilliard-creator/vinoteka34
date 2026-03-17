async function loadProduct(){

  const params = new URLSearchParams(location.search)
  const id = params.get("id")

  const res = await fetch("./data/products.json")
  const products = await res.json()

  const p = products.find(w => String(w.id) === id)

  if(!p){
    document.getElementById("productPage").innerHTML = "Товар не найден"
    return
  }

  render(p)
  renderSimilar(products, p)

}

function wineImage(id){
  return `/assets/labels/${(id % 30) + 1}.jpg`
}

function render(p){

  const image = wineImage(p.id)

  const container = document.getElementById("productPage")

  container.innerHTML = `

  <div class="productWrapper">

    <div class="productImage">
      <img class="wine-img-big"
      src="${image}"
      onerror="this.src='/assets/wine.jpg'">
    </div>

    <div class="productInfo">

      <div class="wine-type">${p.category || "Вино"}</div>

      <h1>${p.name_ru}</h1>

      <div class="wine-en">${p.name_en || ""}</div>

      <div class="wine-style">
        ${p.color || ""} • ${p.style || ""}
      </div>

      <div class="wine-price-big">
        ${p.price ? p.price + " ₽" : ""}
      </div>

      <button class="wine-btn">
        Спросить сомелье
      </button>

      <div class="wine-description">
        Отличное вино для ужина, подходит к мясу, сырам и лёгким закускам.
        Рекомендуем температура подачи 16–18°C.
      </div>

    </div>

  </div>

  <h2 class="section-title">Похожие товары</h2>
  <div id="similarGrid" class="catalogGrid"></div>

  `
}

function renderSimilar(products, current){

  const grid = document.getElementById("similarGrid")

  if(!grid) return

  const similar = products
    .filter(p => p.category === current.category && p.id !== current.id)
    .slice(0,4)

  grid.innerHTML = ""

  similar.forEach(p => {

    const card = document.createElement("div")
    card.className = "product-card"

    card.innerHTML = `

      <img class="wine-img"
      src="${wineImage(p.id)}"
      onerror="this.src='/assets/wine.jpg'">

      <div class="wine-ru">${p.name_ru}</div>

      <a href="./product.html?id=${p.id}">
        Подробнее →
      </a>

    `

    grid.appendChild(card)

  })

}

loadProduct()