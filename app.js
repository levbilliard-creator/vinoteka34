(() => {
  const video=document.querySelector('.hero-video');
  const source=video?.querySelector('source[data-src]');
  if(!source) return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function update(){
    if(motion.matches){video.pause();video.removeAttribute('autoplay');source.removeAttribute('src');video.load();}
    else {source.src=source.dataset.src;video.autoplay=true;video.load();video.play().catch(()=>{});}
  }
  motion.addEventListener('change',update);
  update();
})();
