/* Shared catalog and archived-product display rules. */
(function (root) {
  'use strict';
  const types = Object.freeze({all:'Все', wine:'Вино', sparkling:'Игристое', strong:'Крепкий алкоголь', beer:'Пиво', soft:'Безалкогольные', grocery:'Бакалея', tea:'Чай', accessories:'Аксессуары'});
  const placeholder = '/assets/product-placeholder.svg';
  const formatter = new Intl.NumberFormat('ru-RU', {style:'currency', currency:'RUB', minimumFractionDigits:0, maximumFractionDigits:2});
  const typeOf = value => Object.hasOwn(types, value) ? value : 'all';
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase('ru').replace(/ё/g,'е').trim();
  function filter(products, type, query) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return products.filter(p => (type === 'all' || p.type === type) && tokens.every(token => normalize([p.name_ru,p.name_en,p.kind,p.country,p.volume,p.year].filter(Boolean).join(' ')).includes(token)));
  }
  function imageOf(product) {
    const name = typeof product.image === 'string' ? product.image.trim() : '';
    // Only a verified, explicit local filename; never guess a different product.
    return name && !/[\\/]/.test(name) && name !== '..' && name !== '.'
      ? '/assets/wines/' + encodeURIComponent(name) : placeholder;
  }
  function priceOf(value) {
    const n = typeof value === 'number' || (typeof value === 'string' && value.trim()) ? Number(value) : NaN;
    return Number.isFinite(n) && n > 0 ? formatter.format(n) : 'Цена уточняется';
  }
  function catalogURL(type='all', query='', shown=20) {
    const params = new URLSearchParams();
    if(typeOf(type) !== 'all') params.set('type', type);
    if(query.trim()) params.set('q', query.trim());
    if(shown > 20) params.set('shown', String(shown));
    return '/catalog.html' + (params.size ? '?' + params.toString() : '');
  }
  function productURL(id, state={}) {
    const params = new URLSearchParams({id:String(id)});
    if(typeOf(state.type) !== 'all') params.set('from', state.type);
    if(state.query?.trim()) params.set('q', state.query.trim());
    if(state.shown > 20) params.set('shown', String(state.shown));
    return '/product.html?' + params.toString();
  }
  async function loadProducts() {
    const response = await fetch('/data/products.json?v=20261031-1', {cache:'no-store'});
    if(!response.ok) throw new Error('Не удалось загрузить каталог: HTTP ' + response.status);
    const products = await response.json();
    if(!Array.isArray(products) || !products.every(p => p && p.id != null && typeof p.name_ru === 'string')) throw new Error('Неверный формат каталога');
    return products;
  }
  // These photos have a studio backdrop that is not uniformly white.
  const photoOutlines = {
    'Печенье «Амаретти» цитрусовые.jpg': 'polygon(10.7% 9.4%, 88.5% 9%, 89% 9.4%, 83.2% 85.5%, 17% 85.1%, 16.6% 84.7%)'
  };

  function whiteBackdropPreview(img, eager) {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, (eager ? 800 : 400) / Math.max(img.naturalWidth, img.naturalHeight));
    const width = canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const context = canvas.getContext('2d', {willReadFrequently:true});
    if (!context || width < 3 || height < 3) return;
    context.drawImage(img, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    const {data} = pixels;
    const count = width * height;
    const corners = [0, width - 1, count - width, count - 1];

    function neutralLevel(index) {
      const offset = index * 4;
      if (data[offset + 3] !== 255) return 0;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const minimum = Math.min(red, green, blue);
      return Math.max(red, green, blue) - minimum <= 12 ? minimum : 0;
    }
    const cornersByLightness = corners.map(neutralLevel).filter(value => value >= 225).sort((a, b) => a - b);
    // Require several matching corners before treating a pale studio backdrop as removable.
    const whiteCorners = cornersByLightness.filter(value => value >= 244).length;
    if (whiteCorners < 3 && (cornersByLightness.length < 3
        || cornersByLightness.at(-1) - cornersByLightness[0] > 18)) return;
    const matte = whiteCorners >= 3 ? 255 : cornersByLightness[1];
    const backdropThreshold = matte === 255 ? 244 : matte - 9;

    const visited = new Uint8Array(count);
    const queue = new Uint32Array(count);
    let tail = 0;
    function visit(index) {
      if (visited[index]) return;
      visited[index] = 1;
      if (neutralLevel(index) >= backdropThreshold) queue[tail++] = index;
    }
    for (let x = 0; x < width; x++) {
      visit(x);
      visit(count - width + x);
    }
    for (let y = 0; y < height; y++) {
      visit(y * width);
      visit(y * width + width - 1);
    }
    for (let head = 0; head < tail; head++) {
      const index = queue[head];
      const x = index % width;
      if (x > 0) visit(index - 1);
      if (x < width - 1) visit(index + 1);
      if (index >= width) visit(index - width);
      if (index < count - width) visit(index + width);
    }
    if (tail < count * 0.025 || tail > count * 0.98) return;

    // Label the narrow contour before changing any pixels. Diagonal touches matter
    // where the bottle shoulder or capsule slopes across the white backdrop.
    const mask = new Uint8Array(count);
    for (let i = 0; i < tail; i++) mask[queue[i]] = 1;
    for (let i = 0; i < tail; i++) {
      const index = queue[i];
      const x = index % width;
      const y = Math.floor(index / width);
      for (let dy = Math.max(-1, -y); dy <= Math.min(1, height - 1 - y); dy++) {
        for (let dx = Math.max(-1, -x); dx <= Math.min(1, width - 1 - x); dx++) {
          const neighbor = index + dy * width + dx;
          if (mask[neighbor] === 0) mask[neighbor] = 2;
        }
      }
      data[index * 4 + 3] = 0;
    }

    for (let index = 0; index < count; index++) {
      const offset = index * 4;
      if (mask[index] !== 2 || data[offset + 3] !== 255) continue;
      const x = index % width;
      const y = Math.floor(index / width);
      let red = 0;
      let green = 0;
      let blue = 0;
      let samples = 0;
      for (let dy = Math.max(-2, -y); dy <= Math.min(2, height - 1 - y); dy++) {
        for (let dx = Math.max(-2, -x); dx <= Math.min(2, width - 1 - x); dx++) {
          const neighbor = index + dy * width + dx;
          const pos = neighbor * 4;
          if (mask[neighbor] !== 0 || data[pos + 3] !== 255) continue;
          red += matte - data[pos];
          green += matte - data[pos + 1];
          blue += matte - data[pos + 2];
          samples++;
        }
      }

      // Estimate how much white was blended into this pixel from the nearest
      // untouched part of the bottle, rather than using a fixed opacity.
      const reference = red * red + green * green + blue * blue;
      const contrast = (matte - data[offset]) * red
        + (matte - data[offset + 1]) * green + (matte - data[offset + 2]) * blue;
      const coverage = reference ? Math.max(0, Math.min(1, samples * contrast / reference)) : 0.65;
      if (coverage > 0) {
        for (let channel = 0; channel < 3; channel++) {
          data[offset + channel] = matte - (matte - data[offset + channel]) / coverage;
        }
      }
      data[offset + 3] = 224 * coverage;
    }
    context.putImageData(pixels, 0, 0);
    canvas.toBlob(blob => {
      if (!blob || !img.isConnected) return;
      const url = URL.createObjectURL(blob);
      const release = () => {
        img.removeEventListener('load', release);
        img.removeEventListener('error', release);
        URL.revokeObjectURL(url);
      };
      img.addEventListener('load', release);
      img.addEventListener('error', release);
      img.src = url;
    });
  }

  function makeImage(product, eager=false) {
    const img = document.createElement('img');
    const source = imageOf(product);
    img.alt = source === placeholder ? 'Фото товара пока нет' : product.name_ru;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.width = 320; img.height = 220;
    img.addEventListener('error', () => {img.src = placeholder; img.alt='Фото товара пока нет';}, {once:true});
    const outline = Object.hasOwn(photoOutlines, product.image) ? photoOutlines[product.image] : null;
    if (product.image === 'PHOTO-20261115-555.webp') {
      img.classList.add('photo-outline', 'organic-bottle-outline');
      img.addEventListener('error', () => img.classList.remove('photo-outline', 'organic-bottle-outline'), {once:true});
    } else if (outline) {
      img.classList.add('photo-outline');
      img.style.setProperty('--photo-outline', outline);
      img.addEventListener('error', () => img.classList.remove('photo-outline'), {once:true});
    } else if (source !== placeholder) {
      img.addEventListener('load', () => {
        if (img.getAttribute('src') === source) whiteBackdropPreview(img, eager);
      }, {once:true});
    }
    img.src = source;
    return img;
  }
  function element(tag, className, value) {
    const node = document.createElement(tag);
    node.className = className;
    if(value != null) node.textContent = value;
    return node;
  }
  function card(product, state={}) {
    const article = element('article','product-card');
    const media = element('div','img-wrap');
    media.append(makeImage(product));
    article.append(media);
    if(product.name_en) article.append(element('div','wine-en',product.name_en));
    article.append(element('h2','wine-ru',product.name_ru));
    const bottom = element('div','wine-bottom');
    bottom.append(element('div','wine-type', product.kind || types[product.type] || 'Товар'));
    const style = [product.color, product.style].filter(Boolean).join(' · ');
    if(style) bottom.append(element('div','wine-style',style));
    const details = [product.volume,product.year,product.packaging].filter(Boolean).join(' · ');
    if(details) bottom.append(element('div','wine-style',details));
    bottom.append(element('div','wine-price',priceOf(product.price)));
    const link = element('a','btn-link','Открыть →');
    link.href = productURL(product.id,state);
    link.setAttribute('aria-label','Открыть: ' + product.name_ru);
    bottom.append(link); article.append(bottom);
    return article;
  }
  const api = {types,placeholder,typeOf,filter,imageOf,priceOf,catalogURL,productURL,loadProducts,makeImage,element,card};
  if(typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.Vino = api;
})(globalThis);
