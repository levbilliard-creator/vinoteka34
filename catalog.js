const grid = document.querySelector(".catalogGrid")

fetch("./data/products.json")
  .then(res => res.json())
  .then(data => {

    const urlParams = new URLSearchParams(window.location.search)
    const filter = urlParams.get("filter")

    if(filter === "smart"){
      data = data.filter(w => w.type === "wine")
    }

    render(data)
  })


function render(items){

  grid.innerHTML = ""

  items.forEach(wine => {

    const card = document.createElement("div")
    card.className = "product-card"

    const type = getTypeLabel(wine.type)

    card.innerHTML = `
      <div class="image-wrap">
        <img src="${wine.image || './assets/no-wine.png'}" class="wine-img">
      </div>

      <div class="wine-type">${type}</div>

      <div class="wine-en">${wine.name_en || ""}</div>
      <div class="wine-ru">${wine.name_ru}</div>

      <div class="wine-style">
        ${wine.color || ""} ${wine.sweetness || ""}
      </div>

      <div class="wine-price">${wine.price} ₽</div>

      <a href="./product.html?id=${wine.id}" class="btn-link">
        Подробнее →
      </a>
    `

    grid.appendChild(card)
  })
}


function getTypeLabel(type){
  if(type === "wine") return "Вино"
  if(type === "sparkling") return "Игристое"
  if(type === "strong") return "Крепкий алкоголь"
  if(type === "beer") return "Пиво"
  return "Напиток"
}