/* ZAYRA V41 — après-livraison, sans backend.
   Les actions WhatsApp/email ouvrent uniquement l'application de l'opérateur.
   Aucune communication n'est envoyée automatiquement. */
(()=>{
'use strict';
const KEY='zayra-post-sale-v41';
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?{publicUrl:String(x.publicUrl||''),outreach:x.outreach&&typeof x.outreach==='object'?x.outreach:{}}:{publicUrl:'',outreach:{}}}catch{return {publicUrl:'',outreach:{}}}};
let model=read();
const notify=(message,error=false)=>{const e=document.querySelector('#toast');if(e){e.textContent=message;e.className='visible'+(error?' error':'');setTimeout(()=>e.className='',4800)}else alert(message)};
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(model));return true}catch{notify('Impossible d’enregistrer le suivi local.',true);return false}};
const update=()=>{if(location.hash==='#postSale'&&window.ZAYRA_ADMIN_REPAINT)window.ZAYRA_ADMIN_REPAINT()};
const byId=(arr,id)=>arr.find(x=>x.id===id);
const status=o=>{const incoming=window.ZAYRA_ADMIN_REVIEWS?.getAll?.()||[];if(incoming.some(r=>r.origin==='customer_form'&&r.orderRef===o.id))return 'received';return model.outreach[o.id]?.status||'ready'};
const eligible=(orders)=>orders.filter(o=>o.status==='delivered');
function onDelivered(order){if(!order||order.status!=='delivered'||!order.id)return;
 if(!model.outreach[order.id]){model.outreach[order.id]={status:'ready',deliveredAt:new Date().toISOString(),sentAt:'',channel:''};persist()}
}
const catalog=Array.isArray(window.ZAYRA_CATALOG)?window.ZAYRA_CATALOG:[];
const skuSet=new Set(catalog.map(p=>p.id));
const options=o=>[...new Set((o.items||[]).map(l=>l.id).filter(id=>skuSet.has(id)))].slice(0,20);
function link(o,preview=false){const skus=options(o);if(!skus.length)return '';
 const params=new URLSearchParams({produits:skus.join(','),commande:String(o.id||'').slice(0,50)});
 if(preview)return new URL('../avis-commande.html?'+params,location.href).href;
 if(!/^https:\/\/[^\s/]+\.[^\s/]+/.test(model.publicUrl))return '';
 return model.publicUrl.replace(/\/+$/,'')+'/avis-commande.html?'+params;
}
function message(o){const name=String(o.name||'').trim().split(/\s+/)[0];const productNames=options(o).map(id=>catalog.find(p=>p.id===id)?.name||id);
 return `Bonjour${name?' '+name:''} 👋\n\nMerci pour votre commande ZAYRA ${o.id} ! Nous espérons que vos parfums vous plaisent.\n\nVotre avis sincère nous aide à améliorer l’expérience, qu’il soit positif ou négatif. Vous pouvez noter ${productNames.length>1?'les parfums reçus':'votre parfum'} et, si vous le souhaitez, joindre une photo du décant prise avec votre téléphone :\n${link(o)}\n\nMerci pour votre confiance,\nL'équipe ZAYRA Fragrances`;
}
function getClient(o,clients){return byId(clients,o.clientId)||{};}
function normalizedPhone(o,clients){const phone=String(getClient(o,clients).phone||o.phone||'').replace(/[^\d]/g,'');if(/^0[67]\d{8}$/.test(phone))return '212'+phone.slice(1);if(/^212[67]\d{8}$/.test(phone))return phone;return ''}
function rows(orders,clients){return eligible(orders).sort((a,b)=>String(b.deliveredAt||b.updatedAt||b.createdAt).localeCompare(String(a.deliveredAt||a.updatedAt||a.createdAt))).map(o=>{
 const rec={...(model.outreach[o.id]||{status:'ready'}),status:status(o)};const who=getClient(o,clients),skus=options(o);
 const label={ready:'À envoyer',sent:'Envoyé',received:'Avis reçu'}[rec.status]||'À envoyer';
 const tone={ready:'warn',sent:'blue',received:'good'}[rec.status]||'warn';
 return `<tr><td><strong>${escape(o.id)}</strong><div class="minor">${new Date(rec.deliveredAt||o.updatedAt||o.createdAt).toLocaleDateString('fr-MA')}</div></td>
 <td><strong>${escape(o.name||who.name||'Client')}</strong><div class="minor">${escape(who.phone||who.email||'Contact à compléter')}</div></td>
 <td>${skus.map(id=>escape(catalog.find(p=>p.id===id)?.name||id)).join(' · ')}</td>
 <td><span class="status ${tone}">${label}</span>${rec.sentAt?`<div class="minor">${new Date(rec.sentAt).toLocaleDateString('fr-MA')}</div>`:''}</td>
 <td><div class="ps-actions"><button class="btn btn-small" data-action="ps-wa" data-id="${escape(o.id)}">WhatsApp</button><button class="btn btn-small" data-action="ps-email" data-id="${escape(o.id)}">Email</button><button class="btn btn-small" data-action="ps-copy" data-id="${escape(o.id)}">Copier</button><button class="btn btn-small" data-action="ps-preview" data-id="${escape(o.id)}">Aperçu</button>
 ${rec.status!=='sent'?`<button class="btn btn-small btn-primary" data-action="ps-mark" data-id="${escape(o.id)}">Marquer envoyé</button>`:`<button class="btn btn-small" data-action="ps-unmark" data-id="${escape(o.id)}">À relancer</button>`}</div></td></tr>`;
 }).join('')||'<tr><td colspan="5"><div class="ps-empty">Aucune commande livrée pour le moment. Les demandes de retour apparaissent ici dès qu’une commande passe au statut « Livrée ».</div></td></tr>';
}
function render(orders,clients){const delivered=eligible(orders),sent=delivered.filter(o=>status(o)==='sent').length,received=delivered.filter(o=>status(o)==='received').length;
 const incoming=window.ZAYRA_ADMIN_REVIEWS?.getAll?.().filter(r=>r.origin==='customer_form')||[];
 return `<div class="cards cards-three"><div class="metric"><div class="metric-top"><span class="metric-title">À contacter</span></div><div class="metric-value">${delivered.length-sent-received}</div></div><div class="metric"><div class="metric-top"><span class="metric-title">Demandes envoyées</span></div><div class="metric-value">${sent}</div></div><div class="metric"><div class="metric-top"><span class="metric-title">Avis reçus en local</span></div><div class="metric-value">${incoming.length}</div></div></div>
 <section class="panel ps-panel"><div class="panel-head"><div><h2>Suivi après livraison</h2><p>Remerciement et demande d’avis sur les produits réellement commandés.</p></div><button class="btn" type="button" data-action="ps-import">Importer un retour client</button></div>
 <div class="ps-config"><label class="field-label">Adresse publique du site <small>(à renseigner avant d'envoyer)</small><div class="ps-url"><input id="ps-public-url" class="field" type="url" placeholder="https://votre-domaine.ma" value="${escape(model.publicUrl)}"><button class="btn btn-primary" type="button" data-action="ps-save-url">Enregistrer</button></div></label><p class="hint">Ne partagez pas de lien <strong>file://</strong> : le formulaire doit être hébergé en ligne.</p></div>
 <div class="table-scroller"><table class="data-table ps-table"><thead><tr><th>Commande</th><th>Client</th><th>Produit(s)</th><th>Suivi</th><th>Actions</th></tr></thead><tbody>${rows(orders,clients)}</tbody></table></div>
 <div class="ps-bottom"><span>Une commande livrée prépare un message ; aucun envoi n’a lieu sans action de l’équipe.</span><button class="btn btn-small" type="button" data-page="reviews">Gérer les avis reçus ↗</button></div></section>
 <section class="panel ps-panel"><div class="panel-head"><div><h2>Comment fonctionne la collecte ?</h2></div></div><div class="ps-steps"><div><strong>01</strong><span>Commande livrée</span></div><div><strong>02</strong><span>Message préparé</span></div><div><strong>03</strong><span>Client donne son avis</span></div><div><strong>04</strong><span>Import et publication</span></div></div><p class="hint">Sur ce site statique, le client peut télécharger son avis et vous le transmettre. S’il utilise le même navigateur que l’admin, l’avis arrive directement en brouillon. Sur un autre appareil, importez le fichier JSON reçu. Pour des envois programmés et une synchronisation multi-appareils, un backend avec service de messagerie sera nécessaire.</p></section>
 <input id="ps-import-file" type="file" accept=".json,application/json" hidden>`;
}
function bind(){const file=document.querySelector('#ps-import-file');if(file)file.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;await importFile(f);e.target.value='';}}
async function importFile(file){try{if(file.size>800000)throw Error('Fichier trop volumineux (800 Ko maximum).');const payload=JSON.parse(await file.text());if(payload?.format!=='zayra-customer-review-v41'||!Array.isArray(payload.reviews)||payload.reviews.length>30)throw Error('Format de retour client non reconnu.');
 const current=window.ZAYRA_ADMIN_REVIEWS?.getAll?.()||[];const existing=new Set(current.map(x=>x.id));let count=0;
 for(const r of payload.reviews){if(!skuSet.has(r.sku)||!Number.isInteger(r.rating)||r.rating<1||r.rating>5||!r.consent||typeof r.text!=='string'||r.text.trim().length<8||typeof r.author!=='string'||r.author.trim().length<2)continue;
 const id=/^CR-[a-zA-Z0-9-]{8,65}$/.test(r.id||'')?r.id:'CR-'+Date.now().toString(36)+'-'+count;if(existing.has(id))continue;existing.add(id);
 if(r.orderRef&&model.outreach[r.orderRef])model.outreach[r.orderRef]={...model.outreach[r.orderRef],status:'received'};
 current.push({id,sku:r.sku,author:r.author.slice(0,75),rating:r.rating,title:String(r.title||'').slice(0,110),text:r.text.trim().slice(0,1400),date:/^\d{4}-\d{2}-\d{2}$/.test(r.date)?r.date:new Date().toISOString().slice(0,10),photo:typeof r.photo==='string'&&r.photo.length<230000?r.photo:'',verified:false,authentic:false,consent:true,status:'draft',orderRef:String(r.orderRef||'').slice(0,50),origin:'customer_form'});count++;
 }
 if(count&&window.ZAYRA_ADMIN_REVIEWS?.importRecords?.(current)){persist();notify(count+' avis importé(s) en attente de vérification.');update()}else notify(count?'Impossible d’enregistrer les avis.':'Aucun avis nouveau ou valide.',true);
 }catch(err){notify('Import refusé : '+err.message,true)}}
async function copy(text){try{await navigator.clipboard.writeText(text);notify('Message copié.')}catch{const box=document.createElement('textarea');box.value=text;document.body.append(box);box.select();document.execCommand('copy');box.remove();notify('Message copié.')}}
function action(act,id,orders,clients){const o=orders.find(x=>x.id===id),rec=o?model.outreach[id]||{status:'ready'}:null;
 if(act==='ps-save-url'){const raw=String(document.querySelector('#ps-public-url')?.value||'').trim().replace(/\/+$/,'');if(raw&&!/^https:\/\/[^\s/]+\.[^\s/]+(?:\/.*)?$/.test(raw)){notify('Adresse HTTPS publique invalide.',true);return}model.publicUrl=raw;persist();notify(raw?'Adresse publique enregistrée.':'Adresse effacée.');update();return}
 if(act==='ps-import'){document.querySelector('#ps-import-file')?.click();return}
 if(!o||o.status!=='delivered')return;
 if(act==='ps-preview'){window.open(link(o,true),'_blank','noopener');return}
 if(act==='ps-mark'){if(!model.publicUrl){notify('Configurez d’abord le domaine public.',true);return}model.outreach[id]={...rec,status:'sent',sentAt:new Date().toISOString(),channel:rec.channel||'manuel'};persist();notify('Suivi marqué « Envoyé ».');update();return}
 if(act==='ps-unmark'){model.outreach[id]={...rec,status:'ready',sentAt:''};persist();update();return}
 if(!link(o)){notify('Renseignez et enregistrez l’adresse publique du site avant l’envoi.',true);return}
 if(act==='ps-copy'){copy(message(o));return}
 if(act==='ps-wa'){const phone=normalizedPhone(o,clients);if(!phone){notify('Ajoutez un numéro marocain valide à la fiche client pour WhatsApp.',true);return}model.outreach[id]={...rec,channel:'whatsapp'};persist();window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(message(o)),'_blank','noopener');notify('WhatsApp ouvert : validez l’envoi vous-même.');return}
 if(act==='ps-email'){const c=getClient(o,clients),email=String(c.email||o.email||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){notify('Ajoutez une adresse email valide à la fiche client.',true);return}model.outreach[id]={...rec,channel:'email'};persist();location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('Merci pour votre commande ZAYRA · Votre avis')+'&body='+encodeURIComponent(message(o));notify('Email préparé : validez l’envoi dans votre messagerie.');}
}
function getBackup(){return model}
function importBackup(v){if(!v||typeof v!=='object')return;model={publicUrl:typeof v.publicUrl==='string'?v.publicUrl.slice(0,300):'',outreach:v.outreach&&typeof v.outreach==='object'?v.outreach:{}};persist()}
function reset(){model={publicUrl:'',outreach:{}};persist()}
window.ZAYRA_POST_SALE={onDelivered,render,bind,action,getBackup,importBackup,reset,importFile};
})();
