/* ZAYRA V40 — publication en une étape des avis authentiques autorisés; export statique. */
(()=>{
'use strict';
const KEY='zayra-front-reviews-v37';
const $=(s,r=document)=>r.querySelector(s);
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const catalog=Array.isArray(window.ZAYRA_CATALOG)?window.ZAYRA_CATALOG:[];
const productMap=new Map(catalog.map(x=>[x.id,x]));
let search='',status='all',skuFilter='all',editingPhoto='',reviewModal=null;
const today=()=>new Date().toISOString().slice(0,10);
const valid=(r)=>r&&productMap.has(r.sku)&&typeof r.author==='string'&&typeof r.text==='string'&&Number(r.rating)>=1&&Number(r.rating)<=5;
const clean=x=>({id:String(x.id||'').slice(0,65),sku:String(x.sku||'').slice(0,105),author:String(x.author||'').trim().slice(0,75),rating:Math.min(5,Math.max(1,Math.trunc(Number(x.rating)||5))),title:String(x.title||'').trim().slice(0,110),text:String(x.text||'').trim().slice(0,1400),date:/^\d{4}-\d{2}-\d{2}$/.test(x.date)?x.date:today(),photo:typeof x.photo==='string'&&x.photo.length<240000&&(/^data:image\/(?:webp|png|jpeg);base64,[a-z0-9+/=]+$/i.test(x.photo)||/^assets\/images\/[a-z0-9_./-]+\.(?:webp|png|jpe?g)$/i.test(x.photo)&&!x.photo.includes('..'))?x.photo:'',verified:x.verified===true,consent:x.consent===true,authentic:x.authentic===true||(x.authentic===undefined&&x.status==='published'&&x.verified===true&&x.consent===true),status:x.status==='published'?'published':'draft',orderRef:String(x.orderRef||'').slice(0,50),origin:x.origin==='customer_form'?'customer_form':'admin',updatedAt:String(x.updatedAt||new Date().toISOString())});
function getAll(){
 try{
  const stored=localStorage.getItem(KEY);
  if(stored!==null){const v=JSON.parse(stored);return Array.isArray(v)?v.filter(valid).slice(0,750).map(clean):[]}
  const staticSource=window.ZAYRA_VERIFIED_REVIEWS||{};
  const shipped=[];
  for(const [sku,rows] of Object.entries(staticSource))if(productMap.has(sku)&&Array.isArray(rows))rows.forEach((r,index)=>shipped.push({...r,sku,status:'published',id:r.id||'published-'+sku+'-'+index}));
  return shipped.filter(valid).slice(0,750).map(clean);
 }catch{return []}
}
function save(list){try{localStorage.setItem(KEY,JSON.stringify(list));return true}catch{notify('Stockage local saturé. Exportez une sauvegarde et réduisez la taille des photos.',true);return false}}
function importRecords(list){if(!Array.isArray(list))return false;return save(list.filter(valid).slice(0,750).map(clean));}
function reset(){try{localStorage.removeItem(KEY)}catch{}}
function notify(msg,error=false){const node=$('#toast');if(node){node.className='visible'+(error?' error':'');node.textContent=msg;setTimeout(()=>node.className='',4700)}else alert(msg)}
function printName(id){return productMap.get(id)?.name||id;}
function thumb(id){const img=productMap.get(id)?.image||'';return /^assets\/images\/[a-z0-9_./-]+\.(?:webp|png|jpe?g)$/i.test(img)&&!img.includes('..')?'../'+img:''}
const published=r=>r.status==='published'&&r.consent===true&&r.authentic===true;
function render(){const all=getAll(), live=all.filter(published), drafts=all.filter(x=>!published(x));const found=all.filter(x=>(status==='all'||(status==='published'?published(x):!published(x)))&&(skuFilter==='all'||x.sku===skuFilter)&&[x.author,x.title,x.text,printName(x.sku)].join(' ').toLowerCase().includes(search.toLowerCase()));
 return `<div class="cards z37-reviews-cards"><div class="metric"><div class="metric-top"><span class="metric-title">Avis enregistrés</span></div><div class="metric-value">${all.length}</div></div><div class="metric"><div class="metric-top"><span class="metric-title">Publiés</span></div><div class="metric-value">${live.length}</div></div><div class="metric"><div class="metric-top"><span class="metric-title">Masqués</span></div><div class="metric-value">${drafts.length}</div></div><div class="metric"><div class="metric-top"><span class="metric-title">Produits avec avis</span></div><div class="metric-value">${new Set(live.map(r=>r.sku)).size}</div></div></div>
 <section class="panel z37-reviews-panel"><div class="panel-head"><div><h2>Gestion des avis</h2></div><div class="actions"><button class="btn" data-action="review-export-csv" type="button">CSV</button><button class="btn" data-action="review-export" type="button">Exporter pour la boutique</button><button class="btn btn-primary" data-action="review-add" type="button">+ Ajouter un avis</button></div></div>
 <div class="z37-reviews-tools"><input id="z37-review-search" aria-label="Rechercher des avis" placeholder="Recherche par auteur ou produit" value="${escape(search)}" type="search"><select id="z37-review-filter"><option value="all">Tous les statuts</option><option value="draft" ${status==='draft'?'selected':''}>Brouillons</option><option value="published" ${status==='published'?'selected':''}>Publiés</option></select><select id="z37-review-product"><option value="all">Tous les produits</option>${catalog.map(p=>`<option value="${escape(p.id)}" ${skuFilter===p.id?'selected':''}>${escape(p.name)}</option>`).join('')}</select></div>
 ${found.length?`<div class="z37-review-admin-list">${found.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).map(r=>`<article class="z37-review-admin-item"><img alt="" src="${escape(thumb(r.sku))}"><div class="z37-review-admin-copy"><div class="z37-review-admin-meta"><strong>${escape(r.author)}</strong><span class="z37-admin-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span><span class="status ${published(r)?'good':'neutral'}">${published(r)?'Publié':'Brouillon'}</span></div><h3>${escape(r.title||printName(r.sku))}</h3><small>${escape(printName(r.sku))} · ${escape(r.date)}${r.orderRef?` · Commande ${escape(r.orderRef)}`:""}</small><p>${escape(r.text)}</p></div><div class="z37-review-admin-buttons"><button class="btn btn-small" data-action="review-edit" data-id="${escape(r.id)}">Modifier</button><button class="btn btn-small" data-action="${published(r)?'review-hide':'review-publish'}" data-id="${escape(r.id)}">${published(r)?'Masquer':'Publier'}</button><button class="btn btn-small btn-danger" data-action="review-delete" data-id="${escape(r.id)}">Supprimer</button></div></article>`).join('')}</div>`:`<div class="z37-review-admin-empty"><strong>Aucun avis à afficher</strong><p>Ajoutez un retour client pour commencer.</p></div>`}
 <div class="z37-reviews-footer"><span>Publication immédiate dans le navigateur pour les avis authentiques et autorisés. Exportez reviews.js pour mettre à jour le site public.</span><a href="../parfums/${encodeURIComponent((skuFilter!=='all'?skuFilter:catalog[0]?.id)||'')}.html?previewAvis=1" target="_blank" rel="noopener">Prévisualiser le design ↗</a></div></section>`;
}
function bind(){const input=$('#z37-review-search'),f=$('#z37-review-filter'),sel=$('#z37-review-product');if(input)input.oninput=()=>{search=input.value;refresh()};if(f)f.onchange=()=>{status=f.value;refresh()};if(sel)sel.onchange=()=>{skuFilter=sel.value;refresh()};}
function refresh(){if(!$('#content'))return;$('#content').innerHTML=render();bind()}
function openModal(id=''){
 const review=getAll().find(r=>r.id===id)||{sku:skuFilter!=='all'?skuFilter:(skuFilter!=='all'?skuFilter:catalog[0]?.id)||'',author:'',rating:5,title:'',text:'',date:today(),photo:'',status:'published',consent:false,verified:false,authentic:false};
 editingPhoto=review.photo||'';
 const overlay=document.createElement('div');overlay.className='modal-overlay';overlay.id='z37-reviews-modal';
 overlay.innerHTML=`<section class="modal wide-modal z37-review-modal" role="dialog" aria-modal="true" aria-labelledby="z37-modal-title"><div class="modal-head"><div><h2 id="z37-modal-title">${id?'Modifier l’avis':'Nouvel avis client'}</h2></div><button aria-label="Fermer" class="close-modal" id="z37-modal-close" type="button">×</button></div><div class="modal-body"><form id="z37-review-form" data-id="${escape(id)}">
 <div class="form-grid"><label class="field-label wide">Produit<select class="field" name="sku" required>${catalog.map(p=>`<option value="${escape(p.id)}" ${p.id===review.sku?'selected':''}>${escape(p.name)}</option>`).join('')}</select></label>
 <label class="field-label">Nom affiché<input class="field" name="author" maxlength="75" placeholder="Prénom ou pseudonyme autorisé" value="${escape(review.author)}" required></label>
 <label class="field-label">Étoiles<select class="field" name="rating">${[5,4,3,2,1].map(n=>`<option value="${n}" ${n===review.rating?'selected':''}>${'★'.repeat(n)} (${n}/5)</option>`).join('')}</select></label>
 <label class="field-label">Titre<input class="field" name="title" maxlength="110" value="${escape(review.title)}" placeholder="Résumé de l'expérience"></label>
 <label class="field-label">Date<input class="field" name="date" type="date" value="${escape(review.date)}" required></label>
 <label class="field-label wide">Commentaire<textarea class="field" name="text" maxlength="1400" rows="4" required placeholder="Texte exact fourni par la personne">${escape(review.text)}</textarea></label>
 <label class="field-label wide">Photo associée (facultative)<input id="z37-review-upload" type="file" class="field" accept="image/jpeg,image/png,image/webp"><small>Sans photo jointe, la fiche affichera automatiquement l’image du produit.</small></label>
 <div id="z37-review-photo-preview" class="z37-review-photo-preview" ${editingPhoto?'':'hidden'}><img src="${escape(editingPhoto)}" alt="Aperçu"><button type="button" id="z37-review-photo-delete" class="btn btn-small">Retirer</button></div>
 <label class="z37-check"><input type="checkbox" name="verified" ${review.verified?'checked':''}> Achat vérifié (facultatif : affichage du badge « Achat confirmé »)</label>
 <label class="z37-check"><input type="checkbox" name="authentic" ${review.authentic?'checked':''} required> Je confirme qu’il s’agit du retour authentique d’un client, sans avis inventé</label>
 <label class="z37-check"><input type="checkbox" name="consent" ${review.consent?'checked':''} required> Accord du client pour publier son avis et sa photo</label></div>
 <div class="modal-actions"><button type="button" class="btn" id="z37-review-cancel">Annuler</button><button type="submit" class="btn btn-primary">Enregistrer et publier</button></div>
 </form></div></section>`;
 document.body.append(overlay);document.body.style.overflow='hidden';reviewModal=overlay;
 overlay.onclick=e=>{if(e.target===overlay||e.target.closest('#z37-modal-close,#z37-review-cancel'))closeModal()};
 $('#z37-review-upload',overlay)?.addEventListener('change',async e=>{try{if(e.target.files?.[0]){editingPhoto=await compress(e.target.files[0]);const box=$('#z37-review-photo-preview');box.hidden=false;$('img',box).src=editingPhoto;}}catch(err){notify(err.message,true)}});
 $('#z37-review-photo-delete',overlay)?.addEventListener('click',()=>{editingPhoto='';$('#z37-review-photo-preview').hidden=true});
 $('#z37-review-form',overlay)?.addEventListener('submit',submit);
 $('#z37-review-form [name="author"]',overlay)?.focus();
}
function closeModal(){reviewModal?.remove();reviewModal=null;document.body.style.overflow=''}
async function compress(file){if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>6000000)throw Error('Image JPG, PNG ou WebP de moins de 6 Mo requise.');const raw=await new Promise((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.onerror=reject;f.readAsDataURL(file)});const image=new Image();image.src=raw;await image.decode();const canvas=document.createElement('canvas'),ratio=Math.min(1,720/Math.max(image.width,image.height));canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/webp',.68);if(data.length>230000)throw Error('Photo trop volumineuse après réduction. Choisissez une image plus légère.');return data;}
function submit(e){e.preventDefault();const d=new FormData(e.target),id=e.target.dataset.id;
 const obj=clean({id:id||'AV-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),sku:d.get('sku'),author:d.get('author'),rating:Number(d.get('rating')),title:d.get('title'),text:d.get('text'),date:d.get('date'),photo:editingPhoto,verified:d.has('verified'),consent:d.has('consent'),authentic:d.has('authentic'),status:'published',orderRef:getAll().find(r=>r.id===id)?.orderRef||'',origin:getAll().find(r=>r.id===id)?.origin||'admin',updatedAt:new Date().toISOString()});
 if(!valid(obj)||!obj.author||!obj.text||obj.author.length<2){notify('Vérifiez le produit, le nom, la note et le commentaire.',true);return}
 if(!obj.authentic||!obj.consent){notify('Confirmez l’authenticité du retour et l’accord du client.',true);return}
 const entries=getAll().filter(r=>r.id!==obj.id);entries.push(obj);
 if(!save(entries))return;closeModal();refresh();notify('Avis enregistré. '+(published(obj)?'Il sera visible dans le même navigateur et après export sur le site.':''));
}
function download(name,text,type){const link=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type}));link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function exportJS(){const grouped={};for(const p of catalog)grouped[p.id]=[];for(const r of getAll().filter(published)){grouped[r.sku].push({id:r.id,author:r.author,title:r.title,text:r.text,rating:r.rating,date:r.date,photo:r.photo,verified:r.verified===true,consent:true,authentic:true})}const js='/* ZAYRA — avis clients consentis. Généré depuis /admin/#reviews */\nwindow.ZAYRA_VERIFIED_REVIEWS = '+JSON.stringify(grouped,null,2)+';\n';download('reviews.js',js,'text/javascript;charset=utf-8');notify('reviews.js téléchargé. Remplacez le fichier assets/reviews.js du site pour publier les avis à tous les visiteurs.');}
function exportCSV(){const rows=getAll();const fields=['Produit','Auteur','Note','Titre','Avis','Date','Achat vérifié','Authentique','Accord','Statut'];const safe=v=>{const value=String(v??'').replace(/^[=+@\-]/,'\'$&');return '"'+value.replace(/"/g,'""')+'"'};const data='\uFEFF'+[fields,...rows.map(r=>[printName(r.sku),r.author,r.rating,r.title,r.text,r.date,r.verified?'Oui':'Non',r.authentic?'Oui':'Non',r.consent?'Oui':'Non',published(r)?'Publié':'Brouillon'])].map(a=>a.map(safe).join(';')).join('\r\n');download('ZAYRA_AVIS_CLIENTS.csv',data,'text/csv;charset=utf-8');}
function action(act,id){const all=getAll(),review=all.find(x=>x.id===id);
 if(act==='review-add'||act==='review-edit'){openModal(act==='review-edit'?id:'');return}
 if(act==='review-export'){exportJS();return}
 if(act==='review-export-csv'){exportCSV();return}
 if(!review)return;
 if(act==='review-publish'&&(!review.consent||!review.authentic)){notify('Publication impossible sans retour authentique et accord du client.',true);return}
 if(act==='review-delete'&&!confirm('Supprimer définitivement cet avis ?'))return;
 if(act==='review-publish'||act==='review-hide'||act==='review-delete'){
  const edited=act==='review-delete'?all.filter(x=>x.id!==id):all.map(x=>x.id===id?{...x,status:act==='review-publish'?'published':'draft',updatedAt:new Date().toISOString()}:x);
  if(save(edited)){refresh();notify(act==='review-delete'?'Avis supprimé.':act==='review-publish'?'Avis publié localement. Exportez pour mettre en ligne.':'Avis masqué. Exportez pour mettre à jour le site.')}
 }
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&reviewModal)closeModal()});
window.ZAYRA_ADMIN_REVIEWS={render,bind,action,getAll,importRecords,reset};
})();
