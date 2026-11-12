/* V39 homepage slider refinements: controls, live counter, non-duplicate CTAs. */
(()=>{
 'use strict';
 const hero=document.querySelector('body.z39-home [data-hero]');
 if(!hero)return;
 const slides=[...hero.querySelectorAll('.hero-slide')];
 const dots=[...hero.querySelectorAll('[data-hero-dot]')];
 const counter=hero.querySelector('#z39-hero-counter');
 const kicker=hero.querySelector('#z39-hero-kicker');
 const secondary=hero.querySelector('#z39-hero-secondary');
 const ar=document.documentElement.lang.startsWith('ar');
 if(!slides.length||!dots.length)return;
 const current=()=>Math.max(0,slides.findIndex(slide=>slide.classList.contains('active')));
 const update=()=>{
  const i=current(),slide=slides[i];
  if(counter){
   const b=counter.querySelector('b'),total=counter.querySelector('small');
   if(b)b.textContent=String(i+1).padStart(2,'0');
   if(total)total.textContent=String(slides.length).padStart(2,'0');
   counter.setAttribute('aria-label',ar?`الشريحة ${i+1} من ${slides.length}`:`Diapositive ${i+1} sur ${slides.length}`);
  }
  if(kicker)kicker.textContent=slide.dataset.z39Kicker||'';
  if(secondary){
   const packSlide=i>=3;
   secondary.href=packSlide?'catalogue.html':'packs.html';
   secondary.textContent=ar?(packSlide?'تصفح ديكانت 10 مل ↗':'اكتشف الباكات ↗'):(packSlide?'Explorer les décants ↗':'Voir les packs ↗');
  }
 };
 hero.querySelector('[data-z39-hero-prev]')?.addEventListener('click',()=>{
  dots[(current()-1+dots.length)%dots.length]?.click();
 });
 hero.querySelector('[data-z39-hero-next]')?.addEventListener('click',()=>{
  dots[(current()+1)%dots.length]?.click();
 });
 const observer=new MutationObserver(update);
 slides.forEach(slide=>observer.observe(slide,{attributes:true,attributeFilter:['class']}));
 update();
})();
