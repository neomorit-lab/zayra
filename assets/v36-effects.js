/* ZAYRA V36 · Progressive, reduced-motion-aware reveal */
(()=>{
  'use strict';
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window))return;
  const items=[...document.querySelectorAll('.z36-reveal')];
  if(!items.length)return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('z36-visible');
      observer.unobserve(entry.target);
    });
  },{rootMargin:'0px 0px 45px 0px',threshold:.1});
  document.documentElement.classList.add('z36-motion');
  items.forEach((element,index)=>{
    if(element.classList.contains('z35-review-card'))element.style.transitionDelay=`${Math.min(120*(index%3),240)}ms`;
    observer.observe(element);
  });
})();
