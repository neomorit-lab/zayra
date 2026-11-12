/* V23: optional gentle depth effect for pack photos, reduced-motion safe. */
(()=>{
 const section=document.querySelector('.v23-home-packs');
 if(!section||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const images=[...section.querySelectorAll('.product-card .photo img')];
 let queued=false;
 function update(){queued=false;const r=section.getBoundingClientRect(),vh=window.innerHeight;
  if(r.bottom<0||r.top>vh)return;
  const drift=Math.max(-26,Math.min(26,(vh*.5-(r.top+r.height*.5))*.055));
  images.forEach((img,i)=>img.style.setProperty('--pack-shift',((drift*(i%2?1:-1)*.6)).toFixed(1)+'px'));
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
 update();
})();
