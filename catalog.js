async function loadWines() {

const response = await fetch('/data/wines.json')
const wines = await response.json()

return wines

}


function cleanTitle(title){

if(!title) return ''

return title
.replace(/\bвино\b/ig,'')
.replace(/\bбелое\b/ig,'')
.replace(/\bкрасное\b/ig,'')
.replace(/\bсухое\b/ig,'')
.replace(/\bполусухое\b/ig,'')
.replace(/\bполусладкое\b/ig,'')
.replace(/\bсладкое\b/ig,'')
.replace(/\s+/g,' ')
.trim()

}


function buildCard(w){

return `

<div class="wine-card">

<div class="wine-left">

<div class="wine-title-en">
${w.name_en}
</div>

<div class="wine-title-ru">
${cleanTitle(w.name_ru)}
</div>

<div class="wine-stock">
Наличие: ${w.stock}
</div>

</div>

<div class="wine-right">

<div class="wine-type">
${w.category}
</div>

<div class="wine-color">
${w.color}
</div>

<div class="wine-sugar">
${w.sugar}
</div>

<div class="wine-price">
${w.price} ₽
</div>

<button class="wine-open">
Открыть
</button>

</div>

</div>

`

}


async function initCatalog(){

const wines = await loadWines()

const catalog = document.querySelector('.catalog-grid')

catalog.innerHTML = wines.map(buildCard).join('')

}


initCatalog()