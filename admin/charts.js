/* ZAYRA — graphiques liés aux commandes et stocks enregistrés sur cet appareil.
   D3.js is bundled locally; none of the metrics below are fabricated. */
(function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const COLOR={ink:'#30241f',muted:'#8a8178',grid:'#ede7df',gold:'#b18452',cream:'#ead8be',dark:'#352326',green:'#6d8977',warm:'#cd9f6a'};
  const palette=['#b18452','#352326','#6d8977','#d3b58b','#997974','#8e9a9b','#bc965a','#756456','#b4ab9f','#a8b0a3'];
  let current=null, activePage=null;
  const money=n=>new Intl.NumberFormat('fr-MA',{maximumFractionDigits:0}).format(n)+' DH';
  const human=n=>new Intl.NumberFormat('fr-MA',{maximumFractionDigits:0}).format(n);
  function root(id){const node=document.getElementById(id);if(!node)return null;node.replaceChildren();return node;}
  function empty(node,message){
    if(!node)return;const p=document.createElement('p');p.className='z57-chart-empty';p.textContent=message;node.appendChild(p);
  }
  function svg(node,width,height,label){
    const el=document.createElementNS(NS,'svg');el.setAttribute('viewBox',`0 0 ${width} ${height}`);el.setAttribute('preserveAspectRatio','xMidYMid meet');el.setAttribute('role','img');el.setAttribute('aria-label',label);el.classList.add('z57-svg');node.appendChild(el);return d3.select(el);
  }
  function text(g,x,y,value,opts={}){return g.append('text').attr('x',x).attr('y',y).attr('text-anchor',opts.anchor||'start').attr('font-size',opts.size||12).attr('font-weight',opts.weight||400).attr('fill',opts.color||COLOR.muted).text(value);}
  function revenue(snapshot,days){
    const node=root('z57-sales');if(!node)return;
    const now=new Date();now.setHours(12,0,0,0);
    const start=new Date(now);start.setDate(now.getDate()-(days-1));
    const values=Array.from({length:days},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return {key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,day:d,value:0,count:0};});
    const indexes=new Map(values.map((v,i)=>[v.key,i]));
    for(const order of snapshot.orders){if(order.status!=='delivered')continue;const index=indexes.get(order.delivered);if(index!==undefined){values[index].value+=order.total;values[index].count++;}}
    if(!values.some(v=>v.count>0))return empty(node,'Aucune livraison sur la période');
    const W=620,H=232,m={l:58,r:15,t:22,b:38},w=W-m.l-m.r,h=H-m.t-m.b;
    const g=svg(node,W,H,'Évolution des ventes livrées en dirhams').append('g').attr('transform',`translate(${m.l},${m.t})`);
    const x=d3.scale.linear().domain([0,Math.max(1,days-1)]).range([0,w]);
    const ymax=Math.max(100,d3.max(values,v=>v.value)*1.2);
    const y=d3.scale.linear().domain([0,ymax]).range([h,0]);
    for(let i=0;i<=4;i++){
      const val=ymax*i/4,yy=y(val);
      g.append('line').attr('x1',0).attr('x2',w).attr('y1',yy).attr('y2',yy).attr('stroke',COLOR.grid).attr('stroke-width',1);
      text(g,-12,yy+4,val>=1000?`${(val/1000).toFixed(1)}k`:human(Math.round(val)),{anchor:'end',size:11});
    }
    const area=d3.svg.area().x((d,i)=>x(i)).y0(h).y1(d=>y(d.value)).interpolate('monotone');
    const line=d3.svg.line().x((d,i)=>x(i)).y(d=>y(d.value)).interpolate('monotone');
    g.append('path').datum(values).attr('d',area).attr('fill',COLOR.gold).attr('fill-opacity',.14);
    g.append('path').datum(values).attr('d',line).attr('fill','none').attr('stroke',COLOR.gold).attr('stroke-width',3).attr('stroke-linecap','round');
    g.selectAll('circle.z57-pt').data(values).enter().append('circle').attr('class','z57-pt').attr('cx',(d,i)=>x(i)).attr('cy',d=>y(d.value)).attr('r',d=>d.count?4.5:2.2).attr('fill',d=>d.count?COLOR.dark:COLOR.gold).attr('stroke','#fff').attr('stroke-width',1.4)
      .append('title').text(d=>`${d.day.toLocaleDateString('fr-FR',{day:'numeric',month:'short'})} : ${money(d.value)} · ${d.count} commande(s)`);
    const steps=days>20?[0,Math.floor((days-1)/4),Math.floor((days-1)/2),Math.floor(3*(days-1)/4),days-1]:[0,Math.floor((days-1)/3),Math.floor(2*(days-1)/3),days-1];
    [...new Set(steps)].forEach(i=>text(g,x(i),h+25,values[i].day.toLocaleDateString('fr-FR',{day:'numeric',month:'short'}),{anchor:i===0?'start':i===days-1?'end':'middle',size:11}));
  }
  function donut(snapshot){
    const node=root('z57-sources');if(!node)return;
    const list=d3.nest().key(d=>d.source).rollup(rows=>rows.length).entries(snapshot.orders.filter(x=>x.status!=='cancelled'))
      .map(d=>({label:d.key,value:d.values})).sort((a,b)=>b.value-a.value);
    const total=d3.sum(list,d=>d.value);
    if(!total)return empty(node,'Aucune source renseignée');
    const W=540,H=240,svgRoot=svg(node,W,H,'Répartition des commandes par canal'),group=svgRoot.append('g').attr('transform','translate(129,117)');
    const pie=d3.layout.pie().sort(null).value(d=>d.value),arc=d3.svg.arc().innerRadius(66).outerRadius(95);
    group.selectAll('path').data(pie(list)).enter().append('path').attr('d',arc).attr('fill',(d,i)=>palette[i%palette.length]).attr('stroke','#fff').attr('stroke-width',2)
      .append('title').text(d=>`${d.data.label} : ${d.data.value} commande(s)`);
    text(group,0,0,human(total),{anchor:'middle',size:30,weight:700,color:COLOR.ink});
    text(group,0,21,'commandes',{anchor:'middle',size:11});
    const leg=svgRoot.append('g').attr('transform','translate(252,34)');
    list.slice(0,8).forEach((d,i)=>{
      const y=i*24;
      leg.append('circle').attr('cx',0).attr('cy',y+3).attr('r',4.5).attr('fill',palette[i%palette.length]);
      text(leg,13,y+7,d.label.length>23?d.label.slice(0,21)+'…':d.label,{size:11,color:COLOR.ink});
      text(leg,256,y+7,String(d.value),{anchor:'end',size:11,weight:700,color:COLOR.ink});
    });
  }
  function horizontal(nodeId,rows,title,opts={}){
    const node=root(nodeId);if(!node)return;
    rows=rows.filter(x=>x.value>0).slice(0,7);
    if(!rows.length)return empty(node,opts.empty||'Aucune donnée');
    const W=620,H=Math.max(180,42+rows.length*36),m={l:171,r:50,t:20,b:14},w=W-m.l-m.r;
    const g=svg(node,W,H,title).append('g').attr('transform',`translate(${m.l},${m.t})`);
    const max=d3.max(rows,x=>x.value)||1;
    const scale=d3.scale.linear().domain([0,max]).range([0,w]);
    rows.forEach((d,i)=>{
      const y=i*36,short=d.name.length>23?d.name.slice(0,21)+'…':d.name;
      text(g,-10,y+17,short,{anchor:'end',size:12,color:COLOR.ink});
      g.append('rect').attr('x',0).attr('y',y+4).attr('width',w).attr('height',17).attr('rx',5).attr('fill','#f2eee8');
      g.append('rect').attr('x',0).attr('y',y+4).attr('width',scale(d.value)).attr('height',17).attr('rx',5).attr('fill',opts.palette?.[i%opts.palette.length]||COLOR.gold).append('title').text(`${d.name} : ${human(d.value)}`);
      text(g,w+10,y+17,human(d.value),{size:12,weight:700,color:COLOR.ink});
    });
  }
  function statuses(snapshot){
    const labels={pending:'À confirmer',confirmed:'Confirmée',packing:'Préparation',shipped:'Expédiée',delivered:'Livrée',cancelled:'Annulée'};
    horizontal('z57-status',Object.entries(labels).map(([status,name])=>({name,value:snapshot.orders.filter(x=>x.status===status).length})),'Nombre de commandes par statut',{empty:'Aucune commande enregistrée',palette:['#b18452','#987354','#7c8b83','#4e6668','#456d53','#a66e68']});
  }
  function products(snapshot){horizontal('z57-products',snapshot.top.map(x=>({name:x.name,value:x.value})),'Top produits commandés',{empty:'Les produits apparaîtront après la première commande'});}
  function render(data,page){
    if(typeof d3==='undefined')return;
    current=data;activePage=page;
    const select=document.getElementById('z57-sales-period');
    if(select&&!select.dataset.ready){select.dataset.ready='1';select.addEventListener('change',()=>revenue(current,Number(select.value)||14));}
    revenue(data,Number(select?.value)||14);
    donut(data);
    if(page==='reports'){statuses(data);products(data);}
  }
  window.ZAYRA_CHARTS={render};
})();
