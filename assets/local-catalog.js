/* Boutique ZAYRA — mode frontend de demonstration.
   Les editions sont stockees dans ce navigateur uniquement.
   Aucun stock, prix ou commande ne peut etre securise cote client. */
(() => {
  'use strict';
  const KEY='zayra-front-products-v1';
  let edits={};
  try{edits=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
  (window.ZAYRA_CATALOG||[]).forEach(p=>{
    const edit=edits[p.id];
    if(!edit||typeof edit!=='object')return;
    if(Number.isFinite(+edit.price)&&+edit.price>=0)p.price=+edit.price;
    p.stock=edit.stock===null||edit.stock===''?null:(Number.isInteger(+edit.stock)&&+edit.stock>=0?+edit.stock:null);
    p.active=edit.active!==false;
    if(typeof edit.name==='string' && edit.name.trim())p.name=edit.name.slice(0,130);
    if(typeof edit.name_ar==='string' && edit.name_ar.trim())p.name_ar=edit.name_ar.slice(0,130);
    if(['H','F','P'].includes(edit.category))p.category=edit.category;
    if(Array.isArray(edit.components))p.components=edit.components.filter(x=>typeof x==='string');
    if(typeof edit.imageData==='string' && /^data:image\/(?:webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(edit.imageData) && edit.imageData.length<800000)p.image=edit.imageData;
    if(typeof edit.image==='string' && /^assets\/images\/[a-z0-9_./-]+\.(png|jpe?g|webp)$/i.test(edit.image)&&!edit.image.includes('..')&&!p.image.startsWith('data:image/'))p.image=edit.image;
  });
})();
