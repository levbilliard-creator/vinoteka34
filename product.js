const TG="https://t.me/vinotekakaram";

function rub(n){return new Intl.NumberFormat("ru-RU").format(n)+" ₽";}

function getId(){
  const u=new URL(location.href);
  const id=u.searchParams.get('id');
  return id?Number(id):null;
}

async function loadData(){
  const [prodRes, ovRes] = await Promise.all([
    fetch('/data/products.json', {cache:'no-store'}),
    fetch('/data/overrides.json', {cache:'no-store'}).catch(()=>null)
  ]);
  const products=await prodRes.json();
  let overrides={};
  if(ovRes && ovRes.ok){
    overrides = await ovRes.json();
  }
  return { items: products.items||[], overrides };
}

function pickTaste(p){
  if(p.category!=='Вино' && p.category!=='Игристое') return "Напишите сомелье — расскажем профиль и подберём аналог.";
  const color=p.color||'';
  if(color==='Красное') return "Темные ягоды, специи и мягкие танины. Профиль зависит от региона и стиля.";
  if(color==='Белое') return "Цитрус, яблоко и цветочные ноты. Свежесть или более округлый стиль — уточним в чате.";
  if(color==='Розовое') return "Красные ягоды, легкость и освежающий финиш.";
  if(color==='Игристое') return "Свежесть, фрукты, тонкие пузырьки. Стиль от брют до более мягкого.";
  return "Свежий, понятный стиль. Уточним детали по запросу.";
}

function pickPair(p){
  if(p.category==='Виски') return "Соло, с льдом или в коктейлях. Хорошо к темному шоколаду, орехам, сырам.";
  if(p.category==='Джин') return "Тоник, цитрус, лёгкие закуски, морепродукты.";
  if(p.category==='Ром') return "Соло/коктейли. Хорошо к десертам, шоколаду, фруктам.";
  if(p.category==='Текила') return "Коктейли, тако/сальса, цитрус.";
  if(p.category==='Коньяк/Бренди') return "Сыры, шоколад, десерты, сигарные пары (по желанию).";
  if(p.category==='Вино' || p.category==='Игристое') {
    const c=p.color||'';
    if(c==='Красное') return "Мясо, паста, выдержанные сыры, блюда с грибами.";
    if(c==='Белое') return "Рыба, морепродукты, птица, легкие салаты и сыры.";
    if(c==='Розовое') return "Лёгкие закуски, салаты, гриль, азиатская кухня умеренной остроты.";
    if(c==='Игристое') return "Апперитив, морепродукты, закуски, сыры, лёгкие десерты.";
  }
  return "Напишите сомелье — подберём пару под ваш ужин.";
}

function pickServe(p){
  if(p.category==='Виски') return "Подача: 16–20°C. Можно 1–2 кубика льда или капля воды.";
  if(p.category==='Джин') return "Подача: охлажденным. Идеально с тоником и льдом.";
  if(p.category==='Ром') return "Подача: 16–20°C (соло) или в коктейлях.";
  if(p.category==='Текила') return "Подача: охлажденной. Классика — с лаймом.";
  if(p.category==='Коньяк/Бренди') return "Подача: 18–22°C, в снифтере или тюльпане.";
  if(p.category==='Вино' || p.category==='Игристое') {
    const c=p.color||'';
    if(c==='Красное') return "Подача: 16–18°C. При необходимости — декантация 15–30 минут.";
    if(c==='Белое') return "Подача: 8–12°C. Для более плотных — ближе к 10–12°C.";
    if(c==='Розовое') return "Подача: 8–10°C.";
    if(c==='Игристое') return "Подача: 6–8°C.";
  }
  return "Подскажем идеальную подачу под вашу ситуацию — напишите в Telegram.";
}

function sanitize(text){
  // Убираем нежелательные формулировки, если вдруг появятся в пользовательских описаниях
  const bad=[
    "вино сортовое","вино выдержанное","вино марочное","вино ординарное"
  ];
  let t=String(text||"");
  bad.forEach(b=>{ t=t.replaceAll(new RegExp(b,'ig'),""); });
  t=t.replace(/\s+/g,' ').trim();
  return t;
}

function similarItems(all, p){
  // score: same category, same color, same country, price proximity
  const basePrice=p.price_rub||0;
  return all
    .filter(x=>x.id!==p.id)
    .map(x=>{
      let s=0;
      if(x.category===p.category) s+=3;
      if((x.color||'')===(p.color||'')) s+=2;
      if((x.country||'')===(p.country||'')) s+=1;
      const dp=Math.abs((x.price_rub||0)-basePrice);
      s+= Math.max(0, 2 - Math.min(2, dp/2000)); // closer price -> higher
      return {x,s};
    })
    .sort((a,b)=>b.s-a.s)
    .slice(0,6)
    .map(o=>o.x);
}

function buildCard(p){
  const badges=[];
  if(p.category) badges.push(p.category);
  if(p.color) badges.push(p.color);
  if(p.country) badges.push(p.country);
  const badgeHtml=badges.slice(0,3).map(b=>`<span class="badge">${b}</span>`).join('');
  const sub=[p.region?`Регион: ${p.region}`:null,(p.stock!=null?`Наличие: ${p.stock}`:null)].filter(Boolean).join(' • ');
  return `
    <div class="p">
      <div class="p__top">
        <div style="min-width:0">
          <a class="p__t p__tlink" href="/product.html?id=${p.id}">${p.title}</a>
          <div class="p__sub">${sub||''}</div>
        </div>
        <div class="badges">${badgeHtml}</div>
      </div>
      <div class="p__bot">
        <div>
          <div class="price">${rub(p.price_rub)}</div>
          <div class="p__sub">Цена на сайте</div>
        </div>
        <a class="btn btn--ghost" href="/product.html?id=${p.id}">Открыть</a>
      </div>
    </div>`;
}

(async function(){
  const id=getId();
  const {items, overrides}=await loadData();
  const p=items.find(x=>x.id===id) || items[0];

  const ov=overrides[String(p.id)] || {};

  document.title = `${p.title} — Винотека`;
  document.getElementById('pTitle').textContent = p.title;
  document.getElementById('crumbTitle').textContent = p.title;

  const meta=[p.category, p.color, p.country, p.region].filter(Boolean).join(' • ');
  document.getElementById('pMeta').textContent = meta;

  document.getElementById('pPrice').textContent = rub(p.price_rub);
  document.getElementById('pStock').textContent = (p.stock!=null?`Наличие: ${p.stock}`:"Наличие уточняйте");

  const taste = sanitize(ov.taste || pickTaste(p));
  const pair = sanitize(ov.pair || pickPair(p));
  const serve = sanitize(ov.serve || pickServe(p));
  document.getElementById('pTaste').textContent = taste;
  document.getElementById('pPair').textContent = pair;
  document.getElementById('pServe').textContent = serve;

  const img = document.getElementById('pImg');
  const imgNote = document.getElementById('imgNote');

  if(ov.photo){
    img.src = ov.photo;
    imgNote.textContent = "Фото товара.";
  } else {
    // fallback to hero
    img.src = "/assets/img/hero.jpg";
    imgNote.textContent = "Фото временное. Позже добавим фото каждой позиции.";
  }
  img.alt = p.title;

  const msg=encodeURIComponent(`Здравствуйте! Хочу уточнить по позиции:\n\n${p.full_name}\nЦена: ${p.price_rub} ₽`);
  document.getElementById('askBtn').href = `${TG}?text=${msg}`;

  const sim = similarItems(items, p);
  document.getElementById('similar').innerHTML = sim.map(buildCard).join('');
})();