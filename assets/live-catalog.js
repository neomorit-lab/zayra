/* Synchronise le DOM statique sur les valeurs locales d'edition front-only.
   Les commandes et prix publics ne sont PAS securises. */
(()=>{
  'use strict';
  const list=window.ZAYRA_CATALOG||[],m=new Map(list.map(p=>[p.id,p]));
  const AR=(document.documentElement.lang||'').startsWith('ar');
  const sold=AR?'غير متوفر حالياً':'Temporairement indisponible';
  const money=n=>Number(n).toLocaleString('fr-MA')+' DH';
  const stockLabel=p=>p.active===false?(AR?'غير متاح':'Non proposé'):p.stock===0?sold:p.stock===null||p.stock===undefined?(AR?'التوفر يؤكد عند الطلب':'Disponibilité à confirmer'):(AR?`${p.stock} متوفر (تجريبي)`:`${p.stock} disponible(s) (démo)`);
  const update=()=>{
    document.querySelectorAll('.product-card').forEach(card=>{
      const btn=card.querySelector('[data-add]'),id=btn?.dataset.add||card.querySelector('[data-favorite]')?.dataset.favorite;
      const p=m.get(id); if(!p)return;
      card.dataset.price=String(p.price);
      card.dataset.cat=p.category;
      card.dataset.search=p.name;
      const link=card.querySelector('.product-name');if(link)link.textContent=AR?(p.name_ar||p.name):p.name;
      const price=card.querySelector('.price');if(price)price.textContent=money(p.price);
      const blocked=p.active===false||p.stock===0;
      if(btn){btn.disabled=blocked;btn.title=blocked?sold:''}
      const picture=card.querySelector('.photo img');if(picture){const root=document.documentElement.dataset.base||'';const want=p.image.startsWith('data:image/')?p.image:root+p.image;if(picture.getAttribute('src')!==want)picture.src=want;}
      let mark=card.querySelector('.live-stock');
      if(blocked&&!mark){mark=document.createElement('div');mark.className='live-stock';mark.textContent=sold;card.querySelector('.product-meta')?.append(mark)}
      if(!blocked&&mark)mark.remove();
    });
    const panel=document.querySelector('.buy-panel');
    const add=panel?.querySelector('[data-add]');
    if(add){
      const p=m.get(add.dataset.add);
      if(p){
        const title=document.querySelector('.detail-info h1');if(title)title.textContent=AR?(p.name_ar||p.name):p.name;
        const sticky=document.querySelector('.v11-sticky-info strong');if(sticky)sticky.textContent=money(p.price);
        const price=panel.querySelector('.buy-price');if(price)price.textContent=money(p.price);
        const blocked=p.active===false||p.stock===0;
        add.disabled=blocked;
        add.title=blocked?sold:'';document.querySelectorAll('.v11-sticky-purchase [data-add]').forEach(b=>{b.disabled=blocked;b.title=blocked?sold:''});
        let label=panel.querySelector('.z28-stock');if(!label){label=document.createElement('p');label.className='z28-stock';const pricing=panel.querySelector('.buy-price');(pricing?.parentElement||panel).append(label)}
        label.textContent=stockLabel(p);label.dataset.status=p.active===false||p.stock===0?'unavailable':p.stock===null||p.stock===undefined?'unknown':'available';
        if(Array.isArray(p.components)&&p.category==='P'&&p.components.length){
          let included=panel.querySelector('.live-pack-composition');if(!included){included=document.createElement('p');included.className='live-pack-composition';panel.append(included)}
          const labels=p.components.map(id=>m.get(id)).filter(Boolean).map(x=>AR?(x.name_ar||x.name):x.name);
          included.textContent=(AR?'يحتوي الباك على: ':'Ce pack comprend : ')+labels.join(' · ');
        }
        const stock=p.stock; if(Number.isInteger(stock)&&stock>=0){const counter=document.querySelector('#product-qty');if(counter&&Number(counter.textContent)>stock)counter.textContent=String(Math.max(1,stock));}
        const mainGallery=document.querySelector('#gallery-image');if(mainGallery&&p.image&&mainGallery.dataset.stockImageApplied!=='yes'){const root=document.documentElement.dataset.base||''; mainGallery.src=p.image.startsWith('data:image/')?p.image:root+p.image; mainGallery.dataset.stockImageApplied='yes';}
        const frontThumb=document.querySelector('[data-gallery-src]');if(frontThumb&&frontThumb.dataset.gallerySrc && p.image.startsWith('data:image/')){
          frontThumb.dataset.gallerySrc=p.image;
          const small=frontThumb.querySelector('img');if(small)small.src=p.image;
        }
        let msg=panel.querySelector('.live-stock');
        if(blocked&&!msg){msg=document.createElement('p');msg.className='live-stock';msg.textContent=sold;panel.append(msg)}
        if(!blocked&&msg)msg.remove();
      }
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);
  else update();
})();
