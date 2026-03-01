(function(){
  // Gallery thumbnails (works with either a hero image or a hero video)
  const thumbs = document.getElementById("thumbs");
  const list = window.__GALLERY__ || [];
  const heroImg = document.querySelector(".hero__img img");
  const heroVideo = document.querySelector(".hero__img video");

  if (thumbs && list.length) {
    let cur = 0;

    const setActive = () => {
      thumbs.querySelectorAll(".thumb").forEach((el, i) =>
        el.setAttribute("aria-current", String(i === cur))
      );
    };

    const render = () => {
      if (heroImg) {
        heroImg.src = `assets/img/${list[cur]}`;
        heroImg.alt = "Интерьер ВИНОТЕКА";
      }
      setActive();
    };

    // If hero is an image: clicking thumb swaps the hero image.
    // If hero is a video: thumbs are just links to photos (video stays).
    thumbs.innerHTML = list
      .map((n, i) =>
        heroImg
          ? `<button class="thumb" type="button" aria-current="${i === 0}" title="Фото ${i + 1}">
              <img src="assets/img/${n}" alt="">
            </button>`
          : `<a class="thumb thumb--link" href="assets/img/${n}" target="_blank" rel="noopener" aria-current="${i === 0}" title="Открыть фото ${i + 1}">
              <img src="assets/img/${n}" alt="">
            </a>`
      )
      .join("");

    if (heroImg) {
      thumbs.querySelectorAll(".thumb").forEach((b, i) =>
        b.addEventListener("click", () => {
          cur = i;
          render();
        })
      );
      render();
    } else if (heroVideo) {
      // keep video; just mark the first thumb as active
      setActive();
    }
  }

  // Footer year
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();