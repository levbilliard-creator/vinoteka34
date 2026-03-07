fetch('/data/products.json')
.then(res => res.json())
.then(products => {

const featured = products.filter(p => p.featured === true).slice(0,6)

const container = document.querySelector('#featured-wines')

if(!container) return

container.innerHTML = featured.map(p => `

<div class="wine-card">

<img src="${p.image}">

<div class="wine-category">
${p.category}
</div>

<div class="wine-title">
${p.name}
</div>

<div class="wine-type">
${p.type}
</div>

<div class="wine-price">
${p.price} ₽
</div>

<a href="/product.html?id=${p.id}" class="wine-btn">
Открыть
</a>

</div>

`).join('')

})