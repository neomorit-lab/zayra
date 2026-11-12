/* V21: progressive checkout handoff and accessibility. No unconfigured order is reported as sent. */
(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const AR=document.documentElement.lang.startsWith('ar');
  const T=(fr,ar)=>AR?ar:fr;

  // Anonymous ecommerce events. A reporting provider must be connected separately.
  const catalogue=window.ZAYRA_CATALOG||[];
  const byId=new Map(catalogue.map(p=>[p.id,p]));
  window.dataLayer=window.dataLayer||[];
  const event=(name,id,qty=1)=>{const p=byId.get(id);if(!p)return;window.dataLayer.push({event:name,ecommerce:{currency:'MAD',value:Number(p.price)*qty,items:[{item_id:id,item_name:p.name,price:Number(p.price),quantity:qty}]}})};
  const detail=document.querySelector('.buy-panel [data-detail-add]');
  if(detail)event('view_item',detail.dataset.add);
  document.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add)event('add_to_cart',add.dataset.add,add.hasAttribute('data-detail-add')?Math.max(1,Number(document.querySelector('#product-qty')?.textContent)||1):1)},true);
  if(document.querySelector('#checkout-form'))window.dataLayer.push({event:'begin_checkout'});
  const ready=$('#checkout-ready');
  if(ready){
    const settings=window.ZAYRA_SETTINGS||{};
    const email=String(settings.email||'').trim();
    const instagram=String(settings.instagram||'').trim();
    const parent=ready.querySelector('.checkout-actions')||ready;
    const info=document.createElement('p');
    info.className='v21-checkout-guidance';
    info.textContent=T('Le récapitulatif ci-dessus n’est pas une commande envoyée. Transmettez-le à ZAYRA et attendez la confirmation du montant, du stock et de la livraison.','الملخص أعلاه ليس طلبًا تم إرساله. أرسله إلى ZAYRA وانتظر تأكيد المبلغ والتوفر والتوصيل.');
    info.style.cssText='font-size:13px;line-height:1.6;color:#6b5848;margin:12px 0';
    ready.append(info);
    // First-party order API: displayed only if configured in settings.js.
    const endpoint=String(settings.apiEndpoint||'').trim();
    if(endpoint.startsWith('/')&&!endpoint.startsWith('//')){
      const send=document.createElement('button');send.type='button';send.className='button button-gold';
      send.textContent=T('Transmettre ma demande','إرسال الطلب');
      const status=document.createElement('p');status.setAttribute('role','status');
      parent.append(send,status);
      send.addEventListener('click',async()=>{
        if(ready.hidden)return;
        const form=$('#checkout-form');if(!form)return;
        const d=new FormData(form);let cart={};
        try{cart=JSON.parse(localStorage.getItem('zayra-cart-v9')||'{}')}catch{}
        const items=Object.entries(cart).map(([id,quantity])=>({id,quantity:Number(quantity)}));
        if(!items.length){status.textContent=T('Votre panier est vide.','السلة فارغة.');return}
        send.disabled=true;send.textContent=T('Envoi en cours…','جار الإرسال…');
        const payload={name:String(d.get('name')||''),phone:String(d.get('phone')||''),city:String(d.get('city')||''),address:String(d.get('address')||''),notes:String(d.get('notes')||''),items};
        try{
          const res=await fetch(endpoint,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
          const data=await res.json();if(!res.ok||!data.orderId)throw Error(data.error||'failed');
          status.textContent=T('Demande '+data.orderId+' reçue, en attente de confirmation.','تم استلام الطلب '+data.orderId+'، في انتظار التأكيد.');
          window.dataLayer.push({event:'generate_lead',order_id:data.orderId,value:Number(data.estimatedTotal),currency:'MAD'});
          send.hidden=true;
        }catch{
          status.textContent=T('Envoi impossible. Copiez le récapitulatif et contactez-nous.','تعذر الإرسال. انسخ الملخص وتواصل معنا.');
          send.disabled=false;send.textContent=T('Réessayer','إعادة المحاولة');
        }
      });
      const notice=document.createElement('small');notice.textContent=T('Les coordonnées servent au traitement de votre demande. Aucun paiement prélevé.','بياناتك لمعالجة طلبك فقط. لا يتم سحب أي مبلغ.');parent.append(notice);
    }
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      const mail=document.createElement('a');mail.className='button button-outline';
      mail.textContent=T('Ouvrir un e-mail de commande ↗','فتح رسالة طلب بالبريد ↗');
      mail.style.marginTop='8px';
      const setHref=()=>{const text=$('#order-preview')?.value||''; mail.href=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Demande ZAYRA')}&body=${encodeURIComponent(text)}`;};
      mail.addEventListener('click',setHref);setHref();parent.append(mail);
    }else if(/^https:\/\/(www\.)?instagram\.com\//.test(instagram)){
      const link=document.createElement('a');link.href=instagram;link.target='_blank';link.rel='noopener noreferrer';
      link.className='button button-outline';
      link.textContent=T('Contacter ZAYRA sur Instagram ↗','تواصل مع ZAYRA على إنستغرام ↗');
      link.title=T('Copiez le récapitulatif avant de contacter ZAYRA : il ne sera pas transmis automatiquement.','انسخ ملخص الطلب قبل التواصل: لن يتم إرساله تلقائيًا.');
      parent.append(link);
    }
  }
  // Keep search count understandable to screen readers.
  const catalogCount=$('#catalog-count');
  if(catalogCount)catalogCount.setAttribute('aria-live','polite');
  const nav=$('#mobile-menu');
  if(nav){
    nav.setAttribute('aria-label',T('Navigation mobile','التنقل على الهاتف'));
    const toggle=$('#menu-toggle');
    toggle?.addEventListener('click',()=>{
      if(nav.hidden===false)setTimeout(()=>nav.querySelector('a')?.focus(),0);
    });
  }
})();
