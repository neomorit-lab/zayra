(() => {
 'use strict';
 const SETTINGS=window.ZAYRA_SETTINGS||{};
 const loadLocal=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}};
 const changes=loadLocal('zayra-front-products-v1',{}),promos=loadLocal('zayra-front-promotions-v32',[]),packs=loadLocal('zayra-front-packs-v32',{});
 const PRODUCTS=(window.ZAYRA_CATALOG||[]).map(src=>{
   const edit=changes&&typeof changes==='object'?changes[src.id]:null;
   const p={...src};if(edit&&typeof edit==='object'){
      if(typeof edit.name==='string'&&edit.name.trim())p.name=edit.name;
      if(typeof edit.name_ar==='string'&&edit.name_ar.trim())p.name_ar=edit.name_ar;
      if(Number.isInteger(edit.price)&&edit.price>=0)p.price=edit.price;
      if(Number.isInteger(edit.stock)&&edit.stock>=0)p.stock=edit.stock;
      if(edit.stock===null)p.stock=null;
      if(edit.active===false)p.active=false;
      if(['F','H','P'].includes(edit.category))p.category=edit.category;
      if(typeof edit.imageData==='string'&&/^data:image\/(webp|png|jpeg);base64,/.test(edit.imageData))p.image=edit.imageData;
      else if(typeof edit.image==='string'&&/^assets\/images\/[^.][a-z0-9_./-]+\.(webp|png|jpg|jpeg)$/i.test(edit.image)&&!edit.image.includes('..'))p.image=edit.image;
   }return p;
 });
 const byId=new Map(PRODUCTS.map(p=>[p.id,p]));
 for(const p of PRODUCTS.filter(x=>x.category==='P')){
  const raw=packs?.[p.id]?.components;if(!Array.isArray(raw)||!raw.length)continue;
  const list=raw.filter(x=>byId.has(x.id)&&byId.get(x.id).category!=='P'&&Number.isInteger(x.quantity)&&x.quantity>0);
  if(!list.length)continue;
  const amounts=list.map(x=>{const c=byId.get(x.id);return Number.isInteger(c.stock)?Math.floor(c.stock/x.quantity):0});
  p.stock=Math.max(0,Math.min(...amounts));
 }
 const today=new Date();const localDay=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 for(const p of PRODUCTS){
  const original=p.price;let best=original;
  if(Array.isArray(promos))for(const r of promos){if(!r||r.active===false||r.start&&r.start>localDay||r.end&&r.end<localDay)continue;
   const match=r.scope==='all'||r.scope===p.category||(r.scope==='product'&&r.productId===p.id);
   if(!match)continue;const value=Number(r.value);if(!Number.isFinite(value)||value<=0)continue;
   const price=Math.max(0,r.type==='percent'?Math.round(original*(1-value/100)):original-value);
   if(price<best)best=price;
  }
  if(best<original){p.originalPrice=original;p.price=best;}
 }

 const root=document.documentElement, AR=(root.lang||'').startsWith('ar'), base=root.dataset.base||'';
 const $=(s,scope=document)=>scope.querySelector(s), $$=(s,scope=document)=>Array.from(scope.querySelectorAll(s));
 const T=(fr,ar)=>AR?ar:fr;
 const secureText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function read(k,fallback){try{const r=localStorage.getItem(k);return r?JSON.parse(r):fallback}catch{return fallback}}
 function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
 const cartStorage='zayra-cart-v9', favStorage='zayra-favs-v9';
 let cart=read(cartStorage,{}),favorites=read(favStorage,[]);
 if(!cart||typeof cart!=='object'||Array.isArray(cart))cart={};
 for(const k of Object.keys(cart)){const n=Number(cart[k]);if(!byId.has(k)||byId.get(k).active===false||byId.get(k).stock===0||!Number.isInteger(n)||n<=0)delete cart[k];else cart[k]=Math.min(Number.isInteger(byId.get(k).stock)?byId.get(k).stock:30,30,n)}
 if(!Array.isArray(favorites))favorites=[];
 favorites=favorites.filter(x=>byId.has(x));
 const label=p=>(AR&&p.name_ar)||p.name;
 const currency=n=>Number(n).toLocaleString('fr-MA')+' DH';
 const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
 const maxQty=p=>Number.isInteger(p?.stock)&&p.stock>=0?Math.min(30,p.stock):30;
 const subtotal=()=>Object.entries(cart).reduce((a,[id,q])=>a+(byId.get(id)?.price||0)*q,0);
 const shipping=()=>subtotal()>=Number(SETTINGS.freeShippingFrom||500)||subtotal()===0?0:Number(SETTINGS.shippingFee||35);
 const urlProduct=p=>base+(AR?'ar/':'')+'parfums/'+p.id+'.html';
 const urlCatalog=()=>base+(AR?'ar/':'')+'catalogue.html';
 let toastTimer=0;
 function toast(s){const el=$('#toast');if(!el)return;el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}
 function persist(){
  write(cartStorage,cart);renderCart();renderCheckout();
  // A generated order summary becomes outdated as soon as the cart changes.
  const ready=$('#checkout-ready');
  if(ready&&!ready.hidden){ready.hidden=true;const form=$('#checkout-form');if(form)form.hidden=count()===0;prepared='';toast(T('Votre panier a changé : vérifiez et préparez de nouveau la demande.','تغيرت السلة: تحقق من الطلب وجهّزه من جديد.'))}
 }
 function add(id,delta=1){const product=byId.get(id);if(!product||product.active===false||product.stock===0)return;cart[id]=Math.min(maxQty(product),Math.max(1,(Number(cart[id])||0)+delta));persist();toast(T('Décant ajouté à votre sélection','تمت إضافة المنتج إلى السلة'))}
 function change(id,d){if(!byId.has(id))return;const n=(cart[id]||0)+d;if(n<=0)delete cart[id];else cart[id]=Math.min(maxQty(byId.get(id)),n);persist()}
 function remove(id){delete cart[id];persist()}
 function fav(id){if(!byId.has(id))return;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];write(favStorage,favorites);refreshFavs();toast(favorites.includes(id)?T('Ajouté aux favoris','تمت الإضافة إلى المفضلة'):T('Retiré des favoris','تم الحذف من المفضلة'))}
 function refreshFavs(){$$('[data-favorite]').forEach(el=>{const on=favorites.includes(el.dataset.favorite);el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on));el.title=on?T('Retirer des favoris','حذف من المفضلة'):T('Ajouter aux favoris','إضافة إلى المفضلة');el.textContent=on?'♥':'♡'});const b=$('#fav-count');if(b)b.textContent=String(favorites.length)}
 const overlay=$('#cart-overlay'),panel=$('#cart-panel'),cartlines=$('#cart-lines'),totals=$('#cart-totals');
 function showCart(open){if(!overlay||!panel)return;overlay.hidden=!open;panel.hidden=!open;panel.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('menu-lock',open);if(open)$('#close-cart')?.focus()}
 function renderCart(){const n=count();const bubble=$('#cart-count');if(bubble){bubble.textContent=String(n);bubble.hidden=!n}
   if(!cartlines||!totals)return;
   if(!n){cartlines.innerHTML=`<p class="muted" style="padding:35px 10px;text-align:center">${T('Votre panier est vide.','سلتك فارغة.')}</p>`;totals.innerHTML='';const c=$('#cart-checkout');if(c)c.hidden=true;return}
   const lines=Object.entries(cart).map(([id,q])=>{const p=byId.get(id);if(!p)return '';const photo=p.image?.startsWith('data:image/')?p.image:base+(p.image||('assets/images/decants/'+p.id+'.webp'));return `<article class="cart-line"><img alt="" src="${secureText(photo)}"><div><a href="${secureText(urlProduct(p))}"><strong>${secureText(label(p))}</strong></a><small>${p.category==='P'?T('Pack de décants','باك ديكانت'):T('Décant 10 ml','ديكانت 10 مل')}</small><div class="mini-qty"><button type="button" data-cart-delta="-1" data-id="${secureText(id)}" aria-label="${T('Diminuer la quantité','تقليل الكمية')}">−</button>${q}<button type="button" data-cart-delta="1" data-id="${secureText(id)}" aria-label="${T('Augmenter la quantité','زيادة الكمية')}">+</button><button type="button" data-remove="${secureText(id)}" aria-label="${T('Supprimer du panier','حذف من السلة')}" title="${T('Supprimer','حذف')}">×</button></div></div><strong>${currency(p.price*q)}</strong></article>`}).join('');
   cartlines.innerHTML=lines;
   totals.innerHTML=`<div><span>${T('Sous-total','المجموع الفرعي')}</span><strong>${currency(subtotal())}</strong></div><div><span>${T('Livraison indicative','تكلفة التوصيل التقريبية')}</span><strong>${shipping()?currency(shipping()):T('Offerte','مجانية')}</strong></div><div style="font-size:17px;color:var(--gold)"><b>${T('Total estimé','المجموع المتوقع')}</b><b>${currency(subtotal()+shipping())}</b></div>`;
   const c=$('#cart-checkout');if(c)c.hidden=false;
 }
 $$('[data-open-cart]').forEach(b=>b.addEventListener('click',()=>showCart(true)));$('#close-cart')?.addEventListener('click',()=>showCart(false));overlay?.addEventListener('click',()=>showCart(false));
 const menuToggle=$('#menu-toggle'), mobileMenu=$('#mobile-menu');
 function setMobileMenu(open){if(!mobileMenu||!menuToggle)return;mobileMenu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?T('Fermer le menu','إغلاق القائمة'):T('Ouvrir le menu','فتح القائمة'))}
 menuToggle?.addEventListener('click',()=>setMobileMenu(mobileMenu?.hidden!==false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){showCart(false);setMobileMenu(false)}});
 document.addEventListener('click',e=>{if(mobileMenu&&!mobileMenu.hidden&&!e.target.closest('#mobile-menu,#menu-toggle'))setMobileMenu(false)});
 mobileMenu?.addEventListener('click',e=>{if(e.target.closest('a'))setMobileMenu(false)});
 document.addEventListener('click',e=>{
  const duo=e.target.closest('[data-add-duo]');if(duo){
   e.preventDefault();const ids=(duo.dataset.addDuo||'').split('|');
   if(ids.length!==2||ids.some(id=>!byId.has(id)))return;
   if(ids.some(id=>byId.get(id).active===false||byId.get(id).stock===0)){toast(T('Une référence est indisponible.','أحد المنتجات غير متوفر.'));return;}
   ids.forEach(id=>{cart[id]=Math.min(maxQty(byId.get(id)),(cart[id]||0)+1)});
   persist();toast(T('Deux décants ajoutés au panier.','تمت إضافة ديكانتين للسلة.'));
   showCart(true);return;
  }
  const a=e.target.closest('[data-add]');if(a){e.preventDefault();const qty=Math.max(1,Math.min(30,Number($('#product-qty')?.textContent)||1));add(a.dataset.add,a.hasAttribute('data-detail-add')?qty:1);return}
  const b=e.target.closest('[data-cart-delta]');if(b){change(b.dataset.id,Number(b.dataset.cartDelta));return}
  const rem=e.target.closest('[data-remove]');if(rem){remove(rem.dataset.remove);return}
  const f=e.target.closest('[data-favorite]');if(f){e.preventDefault();fav(f.dataset.favorite);return}
  const step=e.target.closest('[data-qty-step]');if(step){const out=$('#product-qty');if(out){out.textContent=String(Math.max(1,Math.min(maxQty(byId.get(document.querySelector('[data-detail-add]')?.dataset.add)),(Number(out.textContent)||1)+Number(step.dataset.qtyStep))))}return}
  const gallery=e.target.closest('[data-gallery-src]');if(gallery){const im=$('#gallery-image'),note=$('#gallery-note');if(im){im.onerror=null;im.dataset.fallback=gallery.dataset.galleryFallback||'';im.onerror=()=>{if(im.dataset.fallback&&im.getAttribute('src')!==im.dataset.fallback){im.onerror=null;im.src=im.dataset.fallback}};im.src=gallery.dataset.gallerySrc;im.alt=gallery.dataset.galleryAlt||''}if(note)note.textContent=gallery.dataset.galleryNote||'';const stageRef=$('#stage-reference');if(stageRef)stageRef.hidden=gallery.dataset.showReference!=='true';$$('[data-gallery-src]').forEach(x=>{x.classList.toggle('active',x===gallery);x.setAttribute('aria-pressed',String(x===gallery))});return}
 });
 // Hero slider, intentionally no external animation library or double transform animation.
 const hero=$('[data-hero]');
 if(hero){const slides=$$('.hero-slide',hero),pips=$$('[data-hero-dot]',hero);let selected=0,timer=0;
  const show=i=>{selected=(i+slides.length)%slides.length;slides.forEach((el,j)=>el.classList.toggle('active',j===selected));pips.forEach((el,j)=>{el.classList.toggle('active',j===selected);el.setAttribute('aria-pressed',String(j===selected))});const s=slides[selected];for(const [key,selector] of [['title','#hero-title'],['text','#hero-lead'],['eyebrow','#hero-eyebrow']]){const to=$(selector);if(to){if(key==='title')to.innerHTML=s.dataset.title;else to.textContent=s.dataset[key]||''}}const c=$('#hero-main-link');if(c){c.href=s.dataset.href||urlCatalog();c.textContent=s.dataset.action+'  ↗'} };
  const stop=()=>{if(timer){clearInterval(timer);timer=0}};
  const start=()=>{stop();if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.hidden)return;timer=setInterval(()=>show(selected+1),7200)};
  pips.forEach((p,i)=>p.addEventListener('click',()=>{show(i);start()}));
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  let touch=0;hero.addEventListener('touchstart',e=>{touch=e.touches[0].clientX},{passive:true});hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touch;if(Math.abs(dx)>55){show(selected+(dx<0?1:-1));start()}},{passive:true});show(0);start();
 }
 // filters & sorting
 const catalog=$('#catalog-grid');
 if(catalog){let active=new URLSearchParams(location.search).get('cat')||'all';if(!['all','H','F'].includes(active))active='all';const filters=$$('[data-category]');const search=$('#catalog-search');const sort=$('#catalog-sort');const cards=$$('.product-card',catalog);
  const apply=()=>{const text=(search?.value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');const shown=cards.filter(c=>{const id=c.querySelector('[data-add]')?.dataset.add||c.querySelector('[data-favorite]')?.dataset.favorite,prod=byId.get(id);return prod&&prod.active!==false&&prod.stock!==0&&(active==='all'||c.dataset.cat===active)&&(!text||(c.dataset.search||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(text))});cards.forEach(c=>c.hidden=!shown.includes(c));filters.forEach(f=>{const on=f.dataset.category===active;f.classList.toggle('active',on);f.setAttribute('aria-pressed',String(on))});const mode=sort?.value||'default';shown.sort((a,b)=>mode==='priceAsc'?+a.dataset.price-+b.dataset.price:mode==='priceDesc'?+b.dataset.price-+a.dataset.price:mode==='name'?a.dataset.search.localeCompare(b.dataset.search):+a.dataset.order-+b.dataset.order);shown.forEach(c=>catalog.appendChild(c));const n=$('#catalog-count');if(n)n.textContent=String(shown.length);const empty=$('#no-results');if(empty)empty.hidden=!!shown.length;};
  filters.forEach(f=>f.addEventListener('click',()=>{active=f.dataset.category;const u=new URL(location.href);if(active==='all')u.searchParams.delete('cat');else u.searchParams.set('cat',active);history.replaceState(null,'',u);apply()}));search?.addEventListener('input',apply);sort?.addEventListener('change',apply);apply();
 }
 // Checkout summary and copy-to-message completion, no false server-side confirmation.
 function renderCheckout(){const out=$('#checkout-lines');if(!out)return;const items=Object.entries(cart).filter(([id])=>byId.has(id));const form=$('#checkout-form'),empty=$('#checkout-empty');if(empty)empty.hidden=!!items.length;if(form&&items.length===0)form.hidden=true;if(form&&items.length&&$('#checkout-ready')?.hidden!==false)form.hidden=false;out.innerHTML=items.map(([id,q])=>{const p=byId.get(id);return `<div class="order-item"><span>${secureText(label(p))} × ${q}</span><strong>${currency(p.price*q)}</strong></div>`}).join('');const st=$('#checkout-subtotal'),sh=$('#checkout-shipping'),gt=$('#checkout-total');if(st)st.textContent=currency(subtotal());if(sh)sh.textContent=shipping()?currency(shipping()):T('Offerte','مجانية');if(gt)gt.textContent=currency(subtotal()+shipping());}
 renderCheckout();renderCart();refreshFavs();
 const form=$('#checkout-form');let prepared='';
 form?.addEventListener('submit',e=>{e.preventDefault();if(!count()){toast(T('Votre panier est vide.','سلتك فارغة.'));return}const fd=new FormData(form),name=String(fd.get('name')||'').trim(),city=String(fd.get('city')||'').trim(),address=String(fd.get('address')||'').trim(),rawPhone=String(fd.get('phone')||'').replace(/[\s.()\-]/g,'');let phone=rawPhone.replace(/^\+?212/,'0');if(!name||!city||!address||!/^(0[5-7]\d{8})$/.test(phone)){toast(T('Vérifiez le nom, le téléphone marocain, la ville et l’adresse.','يرجى التحقق من الاسم ورقم الهاتف المغربي والمدينة والعنوان.'));return}
  const itemText=Object.entries(cart).map(([id,n])=>{const p=byId.get(id);return `• ${label(p)} × ${n} = ${currency(p.price*n)}`}).join('\n');prepared=`${T('DEMANDE DE COMMANDE ZAYRA','طلب لدى ZAYRA')}\n${itemText}\n\n${T('Sous-total','المجموع الفرعي')}: ${currency(subtotal())}\n${T('Livraison estimée','التوصيل التقريبي')}: ${currency(shipping())}\n${T('Total estimé','المجموع المتوقع')}: ${currency(subtotal()+shipping())}\n\n${T('Nom','الاسم')}: ${name}\n${T('Téléphone','الهاتف')}: ${phone}\n${T('Ville','المدينة')}: ${city}\n${T('Adresse','العنوان')}: ${address}${fd.get('notes')?'\n'+T('Notes','ملاحظات')+': '+fd.get('notes'):''}`;
  const preview=$('#order-preview');if(preview)preview.value=prepared;form.hidden=true;const ready=$('#checkout-ready');if(ready)ready.hidden=false;const wa=String(SETTINGS.whatsapp||'').replace(/\D/g,'');const send=$('#send-order');if(send){if(/^\d{10,15}$/.test(wa)){send.hidden=false;send.href='https://wa.me/'+wa+'?text='+encodeURIComponent(prepared)}else send.hidden=true}window.scrollTo({top:0,behavior:'smooth'});
 });
 $('#download-order')?.addEventListener('click',()=>{if(!prepared)return;const file=new Blob([prepared],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(file);const a=document.createElement('a');a.href=u;a.download='zayra-recapitulatif-demande.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)});
 $('#edit-checkout')?.addEventListener('click',()=>{if(form)form.hidden=false;const ready=$('#checkout-ready');if(ready)ready.hidden=true});
 $('#copy-order')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(prepared);toast(T('Récapitulatif copié','تم نسخ ملخص الطلب'))}catch{const el=$('#order-preview');el?.focus();el?.select();try{document.execCommand('copy');toast(T('Récapitulatif copié','تم نسخ ملخص الطلب'))}catch{toast(T('Sélectionnez le texte pour le copier.','يرجى تحديد النص ونسخه.'))}}});

 // Avis produits : gérés dans reviews-ui.js (V37).

 function enhanceProductCards(){
  $$('.product-card').forEach(card=>{
    const id=card.querySelector('[data-add]')?.dataset.add||card.querySelector('[data-favorite]')?.dataset.favorite;
    if(!id||!byId.has(id))return;
    const photo=card.querySelector('.photo');if(!photo||photo.dataset.enhanced==='true')return;
    const p=byId.get(id);
    const combined=p.image.startsWith('data:image/')?p.image:base+p.image;
    const special=new Set(['creed-aventus-10ml','dior-homme-intense-10ml-10ml-hommes','club-de-nuit-intense-10ml-10ml-hommes','azzaro-most-wanted-10ml-10ml-hommes']);
    const chosen=combined;
    const fallback=base+(p.decant_image||p.image);
    const img=document.createElement('img');img.className='z204-unified-photo';img.loading='lazy';img.decoding='async';
    img.alt=secureText(label(p)+(p.category==='P'?T(' — pack de décants',' — باك ديكانت'):T(' — flacon de référence avec décant ZAYRA 10 ml (illustration)',' — قارورة مرجعية مع ديكانت ZAYRA سعة 10 مل (صورة توضيحية)')));
    img.onerror=()=>{img.onerror=null;img.src=fallback};img.src=chosen;
    photo.replaceChildren(img);photo.dataset.enhanced='true';
  });
 }
 enhanceProductCards();
 function refreshCatalogPricing(){
  $$('.product-card').forEach(card=>{
   const id=card.querySelector('[data-add]')?.dataset.add||card.querySelector('[data-favorite]')?.dataset.favorite,p=byId.get(id);
   if(!p)return;
   card.dataset.price=String(p.price);
   const price=card.querySelector('.product-bottom .price');if(price){price.textContent=currency(p.price);if(p.originalPrice!==undefined){const prev=document.createElement('del');prev.className='z32-old-price';prev.textContent=currency(p.originalPrice);price.append(prev);if(!card.querySelector('.z32-sale-tag')){const pill=document.createElement('span');pill.className='z32-sale-tag';pill.textContent=T('OFFRE','عرض');card.querySelector('.photo')?.append(pill)}}}
   card.hidden=p.active===false||p.stock===0;
  });
  const detail=document.querySelector('[data-detail-add]');if(detail){const p=byId.get(detail.dataset.add);if(p){
   const price=document.querySelector('.buy-panel .buy-price');if(price){price.textContent=currency(p.price);if(p.originalPrice!==undefined){const del=document.createElement('del');del.className='z32-detail-old';del.textContent=currency(p.originalPrice);price.append(del)}}
   const sticky=document.querySelector('.v11-sticky-purchase .v11-sticky-info strong');if(sticky)sticky.textContent=currency(p.price);
   if(p.active===false||p.stock===0){$$('[data-detail-add]').forEach(b=>{b.disabled=true;b.textContent=T('Indisponible','غير متوفر')})}
  }}
 }
 refreshCatalogPricing();


 // Editorial navigation labels only: never invent sales volume or stock scarcity.
 function markGiftSelections(){
  const tags={
   'pack-prada-paradoxe-burberry-her':[T('Duo · 2 × 10 ml','ثنائي · 2 × 10 مل')],
   'pack-aventus-bleu-chanel':[T('Duo · 2 × 10 ml','ثنائي · 2 × 10 مل')],
   'coffret-signature-homme-3x10':[T('Coffret · 3 × 10 ml','علبة · 3 × 10 مل')],
   'coffret-decouverte-mixte-4x10':[T('Coffret · 4 × 10 ml','علبة · 4 × 10 مل')],
   'prada-paradoxe-10ml':[T('Idée cadeau','فكرة هدية')],
   'delina-exclusif-10ml-10ml-femmes':[T('Idée cadeau','فكرة هدية')]
  };
  $$('.product-card').forEach(card=>{
   const id=card.querySelector('[data-add]')?.dataset.add;
   const labels=tags[id],photo=card.querySelector('.photo');
   if(!labels||!photo||photo.querySelector('.z203-tags'))return;
   const tag=document.createElement('span');tag.className='z203-tags';tag.textContent=labels[0];photo.append(tag);
  });
 }
 markGiftSelections();

 function personaliseDetailVisuals(){
  const addBtn=document.querySelector('[data-detail-add]'); if(!addBtn) return;
  const id=addBtn.dataset.add; const p=byId.get(id); if(!p) return;
  const fallback=p.image?.startsWith('data:image/')?p.image:base+(p.decant_image||p.image||('assets/images/v16/decants/'+id+'.webp'));
  const productImg=p.image?.startsWith('data:image/')?p.image:base+(p.image||('assets/images/v16/packs/'+id+'.webp'));
  const storyImg=document.querySelector('.v16-story-media img');
  if(storyImg && !storyImg.dataset.personalized){
    storyImg.dataset.personalized='true';
    storyImg.onerror=()=>{storyImg.onerror=null;storyImg.src=fallback};
    storyImg.src=productImg;
  }
  const truthImg=document.querySelector('.v19-product-truth img');
  if(truthImg && p.category==='P' && !truthImg.dataset.personalized){
    truthImg.dataset.personalized='true';
    truthImg.onerror=()=>{truthImg.onerror=null;truthImg.src=fallback};
    truthImg.src=productImg;
  }
 }
 personaliseDetailVisuals();

 // Motion policy: keep content visible at all times. Only animate image hover and slider controls.
 // Previous on-scroll reveal could leave entire sections blank, so it is intentionally disabled.

 // Sticky mobile purchase appears only while viewing buying details. It must
 // disappear before feedback, related items, final CTA and footer, so it never
 // obscures content at the bottom of long product pages.
 const stickyPurchase=document.querySelector('.v11-sticky-purchase');
 const mainPurchase=document.querySelector('.buy-panel [data-detail-add]');
 const feedbackStart=document.querySelector('.v15-product-feedback, .v15-related, .v15-final-cta');
 if(stickyPurchase && mainPurchase){
  let pending=false;
  const updateStickyPurchase=()=>{
   pending=false;
   const r=mainPurchase.getBoundingClientRect();
   const isPastMainPurchase=r.bottom<0;
   const isBeforeFeedback=!feedbackStart || feedbackStart.getBoundingClientRect().top>innerHeight*0.83;
   stickyPurchase.classList.toggle('is-visible',isPastMainPurchase && isBeforeFeedback);
  };
  const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(updateStickyPurchase)};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  updateStickyPurchase();
 }
})();
