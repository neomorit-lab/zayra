/* Formulaire public V41 : enregistrement local + export JSON.
   Sans API, un autre appareil ne peut pas synchroniser ses avis avec l'administration. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ar=document.documentElement.lang.startsWith('ar');
const say=(fr,arb)=>ar?arb:fr;
const catalog=Array.isArray(window.ZAYRA_CATALOG)?window.ZAYRA_CATALOG:[];
const params=new URLSearchParams(location.search);
const orderRef=String(params.get('commande')||'').slice(0,50).replace(/[^a-zA-Z0-9_-]/g,'');
const selected=[...new Set(String(params.get('produits')||params.get('sku')||'').split(',').map(x=>x.trim()).filter(x=>catalog.some(p=>p.id===x)))].slice(0,20);
let photo='';let payload=null;
const products=selected.length?catalog.filter(p=>selected.includes(p.id)):catalog;
const sel=$('#feedback-sku');
if(sel)sel.innerHTML=products.map(p=>`<option value="${esc(p.id)}">${esc(ar?p.name_ar||p.name:p.name)}</option>`).join('');
const showProduct=()=>{const p=catalog.find(x=>x.id===sel.value);if(!p)return;
 const img=$('#feedback-product-img');if(img){img.src=(ar?'../':'')+(p.image||'');img.alt=ar?p.name_ar||p.name:p.name}
 $('#feedback-product-name').textContent=ar?p.name_ar||p.name:p.name;
};sel?.addEventListener('change',showProduct);showProduct();
if(orderRef)$('#feedback-order').textContent=orderRef;else $('#feedback-order-wrap').hidden=true;
const maxPhoto=210000;
if($('#feedback-again'))$('#feedback-again').href=location.pathname+location.search;
$('#feedback-photo')?.addEventListener('change',async e=>{
 photo='';const file=e.target.files?.[0],preview=$('#feedback-preview');preview.hidden=true;if(!file)return;
 try{if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>5e6)throw Error(say('Photo JPG/PNG/WebP de moins de 5 Mo.','صورة JPG/PNG/WebP أقل من 5 ميغابايت.'));
 const src=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(file)});
 const image=new Image();image.src=src;await image.decode();const cv=document.createElement('canvas');const ratio=Math.min(1,600/Math.max(image.width,image.height));cv.width=Math.max(1,Math.round(image.width*ratio));cv.height=Math.max(1,Math.round(image.height*ratio));cv.getContext('2d').drawImage(image,0,0,cv.width,cv.height);photo=cv.toDataURL('image/webp',.63);
 if(photo.length>maxPhoto)throw Error(say('Choisissez une photo moins lourde.','اختر صورة بحجم أصغر.'));
 preview.src=photo;preview.hidden=false;
 }catch(error){alert(error.message);e.target.value='';photo=''}
});
function download(){if(!payload)return;const text=JSON.stringify(payload,null,2);const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='ZAYRA_AVIS_'+payload.reviews[0].id+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1800)}
$('#feedback-form')?.addEventListener('submit',event=>{
 event.preventDefault();const data=new FormData(event.currentTarget),author=String(data.get('author')||'').trim().slice(0,75),text=String(data.get('text')||'').trim().slice(0,1400),rating=Number(data.get('rating')),sku=String(data.get('sku')||'');
 if(!catalog.some(p=>p.id===sku)||author.length<2||text.length<8||!Number.isInteger(rating)||rating<1||rating>5||!data.has('consent')){alert(say('Vérifiez le produit, la note, le commentaire et l’accord de publication.','تحقق من العطر والتقييم والتعليق والموافقة.'));return}
 const id='CR-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
 const review={id,sku,author,rating,title:String(data.get('title')||'').trim().slice(0,110),text,date:new Date().toISOString().slice(0,10),photo,consent:true,orderRef,source:'customer_form'};
 payload={format:'zayra-customer-review-v41',createdAt:new Date().toISOString(),reviews:[review]};
 try{const key='zayra-front-reviews-v37',current=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(current))throw Error('invalid');current.push({...review,status:'draft',authentic:false,verified:false,origin:'customer_form'});localStorage.setItem(key,JSON.stringify(current));}catch{ /* L'export fonctionne même sans stockage partagé. */ }
 $('#feedback-form').hidden=true;$('#feedback-success').classList.add('visible');$('#feedback-success').hidden=false;
});
$('#feedback-download')?.addEventListener('click',download);
$('#feedback-copy')?.addEventListener('click',async()=>{if(!payload)return;const r=payload.reviews[0],p=catalog.find(x=>x.id===r.sku);const text=`Avis ZAYRA ${orderRef||''}\n${p?.name||r.sku} — ${r.rating}/5\n${r.author}: ${r.title}\n${r.text}`;try{await navigator.clipboard.writeText(text);alert(say('Avis copié. Vous pouvez le transmettre à ZAYRA.','تم نسخ رأيك. يمكنك إرساله إلى ZAYRA.'))}catch{alert(say('Utilisez le téléchargement du fichier.','استخدم تنزيل الملف.'))}});
})();
