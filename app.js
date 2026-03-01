(function(){
  const thumbs=document.getElementById("thumbs");
  const list=window.__GALLERY__||[];
  const hero=document.querySelector(".hero__img img");
  if(!thumbs||!hero||!list.length) return;

  let cur=0;
  thumbs.innerHTML=list.map((n,i)=>(
    `<button class="thumb" type="button" aria-current="${i===0}" title="Фото ${i+1}">
      <img src="/assets/img/${n}" alt="">
    </button>`
  )).join("");

  const render=()=>{
    hero.src=`/assets/img/${list[cur]}`;
    thumbs.querySelectorAll(".thumb").forEach((b,i)=>b.setAttribute("aria-current", String(i===cur)));
  };
  thumbs.querySelectorAll(".thumb").forEach((b,i)=>b.addEventListener("click",()=>{cur=i;render();}));
  document.getElementById("y").textContent=new Date().getFullYear();
})();