const PptxGenJS = require('pptxgenjs');
const fs = require('fs');

const dataFile = process.argv[2] || '/tmp/genera-full.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// THEME
const BG='0A0A0F',CARD='161B2E',HD='1E293B',BD='2D3548',W='FFFFFF',G1='94A3B8',G2='64748B',G3='CBD5E1';
const BLU='4285F4',GRN='34A853',PUR='8B5CF6',OK='10B981',BAD='EF4444',WARN='F59E0B',MYP='0055A4';

const fmt=n=>Math.round(n).toLocaleString('es-CL');
const fM=n=>'$'+fmt(n);
const fP=n=>(n*100).toFixed(1)+'%';

const pptx=new PptxGenJS();
pptx.layout='LAYOUT_WIDE';
let slideCount=0;

function addSlide(){slideCount++;return pptx.addSlide();}

function hdr(s,title,sub){
  s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.33,h:0.9,fill:{color:HD}});
  s.addText(title,{x:0.5,y:0.12,w:9,h:0.38,fontSize:15,bold:true,color:W,fontFace:'Arial'});
  if(sub)s.addText(sub,{x:0.5,y:0.5,w:9,h:0.25,fontSize:9,color:G1,fontFace:'Arial'});
  s.addText(data.cliente+' · '+data.mes+' '+data.anio,{x:9,y:0.3,w:4,h:0.25,fontSize:8,color:G2,fontFace:'Arial',align:'right'});
}

function kpiSlide(s,title,sub,items){
  hdr(s,title,sub);
  items.forEach((m,i)=>{
    const col=i%4,row=Math.floor(i/4);
    const x=0.3+col*3.25,y=1.15+row*2.7;
    s.addShape(pptx.ShapeType.rect,{x,y,w:3,h:2.3,fill:{color:CARD},rectRadius:0.06,line:{color:BD,width:0.4}});
    s.addText(m.label.toUpperCase(),{x:x+0.15,y:y+0.12,w:2.7,h:0.22,fontSize:8,color:G1,fontFace:'Arial',charSpacing:1});
    s.addText(m.val,{x:x+0.15,y:y+0.4,w:2.7,h:0.65,fontSize:24,bold:true,color:W,fontFace:'Arial'});
    if(m.change){
      const p=parseFloat(m.change),up=p>0,good=m.inv?!up:up,cc=good?OK:BAD;
      s.addShape(pptx.ShapeType.rect,{x:x+0.15,y:y+1.25,w:2.7,h:0.7,fill:{color:good?'0D3320':'3B1111'},rectRadius:0.05});
      s.addText((up?'▲ ':'▼ ')+m.change,{x:x+0.15,y:y+1.3,w:2.7,h:0.55,fontSize:12,bold:true,color:cc,align:'center',fontFace:'Arial'});
    }
  });
}

function tableSlide(s,title,sub,headers,rows,colW){
  hdr(s,title,sub);
  const ho={fill:{color:HD},color:'93C5FD',fontSize:8,bold:true,align:'center'};
  const tRows=[[...headers.map((h,i)=>({text:h,options:{...ho,align:i===0?'left':'center'}}))]];
  rows.forEach((r,ri)=>{
    const bg=ri%2===0?'111827':'0D1117';
    tRows.push(r.map((cell,ci)=>{
      const base={fill:{color:bg},color:G3,fontSize:8,align:ci===0?'left':'center'};
      if(typeof cell==='object')return{text:cell.text,options:{...base,...cell.opts}};
      return{text:String(cell),options:base};
    }));
  });
  s.addTable(tRows,{x:0.2,y:1.05,w:12.9,border:{pt:0.3,color:'1E293B'},rowH:0.38,colW});
}

// ========== SLIDE 1: PORTADA ==========
let s=addSlide();s.background={color:BG};
s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.33,h:0.04,fill:{color:MYP}});
s.addText('INFORME DE',{x:0.8,y:1.5,w:11,h:0.5,fontSize:14,color:G2,fontFace:'Arial',charSpacing:6});
s.addText('CAMPAÑAS',{x:0.8,y:2,w:11,h:1,fontSize:50,bold:true,color:W,fontFace:'Arial'});
s.addText(data.mes.toUpperCase()+' '+data.anio,{x:0.8,y:3,w:11,h:0.7,fontSize:28,color:BLU,fontFace:'Arial'});
s.addText(data.cliente,{x:0.8,y:3.7,w:11,h:0.5,fontSize:18,color:G1,fontFace:'Arial'});
s.addShape(pptx.ShapeType.rect,{x:0,y:6.8,w:13.33,h:0.7,fill:{color:CARD}});
s.addText('Muller y Pérez · Performance Marketing',{x:0.8,y:6.85,w:11,h:0.5,fontSize:10,color:G1,fontFace:'Arial'});

// ========== SLIDE 2: SEPARADOR GOOGLE ==========
s=addSlide();s.background={color:BG};
s.addShape(pptx.ShapeType.rect,{x:0,y:3.2,w:13.33,h:0.03,fill:{color:BLU}});
s.addText('RESULTADOS',{x:0.8,y:1.8,w:11,h:0.4,fontSize:13,color:G2,fontFace:'Arial',charSpacing:6});
s.addText('GOOGLE ADS',{x:0.8,y:2.3,w:11,h:0.9,fontSize:44,bold:true,color:BLU,fontFace:'Arial'});

// ========== SLIDE 3: KPIs GOOGLE ==========
s=addSlide();s.background={color:BG};
const gk=data.google.kpis;
kpiSlide(s,'MÉTRICAS GENERALES GOOGLE',data.mes+' '+data.anio+' vs Febrero '+data.anio,[
  {label:'Inversión',val:fM(gk.Inversión?.value||0),change:gk.Inversión?.change,inv:false},
  {label:'Clics',val:fmt(gk.Clics?.value||0),change:gk.Clics?.change,inv:false},
  {label:'Impresiones',val:fmt(gk.Impresiones?.value||0),change:gk.Impresiones?.change,inv:false},
  {label:'Conversiones',val:fmt(Math.round(gk.Conversiones?.value||0)),change:gk.Conversiones?.change,inv:false},
  {label:'CTR',val:fP(gk.CTR?.value||0),change:gk.CTR?.change,inv:false},
  {label:'CPC Promedio',val:fM(gk.CPC?.value||0),change:gk.CPC?.change,inv:true},
  {label:'CPA',val:fM(gk.CPA?.value||0),change:gk.CPA?.change,inv:true},
]);

// ========== SLIDE 4: TABLA CAMPAÑAS GOOGLE ==========
s=addSlide();s.background={color:BG};
const gc=data.google.campaigns;
const gcRows=gc.map(c=>[
  c[0],
  String(c[1]||'').replace('Performance_max','PMAX'),
  fmt(c[4]||0), fmt(c[2]||0), fP(c[6]||0), fM(c[7]||0),
  {text:fmt(Math.round(c[5]||0)),opts:{bold:true,color:'60A5FA'}},
  {text:fM(c[8]||0),opts:{bold:true,color:parseFloat(c[8]||0)>10000?'F87171':'34D399'}},
  fM(c[3]||0)
]);
// Total
const tI=gc.reduce((s,c)=>s+(parseInt(c[4])||0),0),tCl=gc.reduce((s,c)=>s+(parseInt(c[2])||0),0);
const tCo=gc.reduce((s,c)=>s+(parseFloat(c[3])||0),0),tCv=gc.reduce((s,c)=>s+(parseFloat(c[5])||0),0);
gcRows.push([{text:'TOTAL',opts:{bold:true,color:W,fill:{color:MYP}}},{text:'',opts:{fill:{color:MYP}}},
  {text:fmt(tI),opts:{bold:true,color:W,fill:{color:MYP}}},{text:fmt(tCl),opts:{bold:true,color:W,fill:{color:MYP}}},
  {text:fP(tCl/tI),opts:{color:W,fill:{color:MYP}}},{text:fM(tCo/tCl),opts:{color:W,fill:{color:MYP}}},
  {text:fmt(Math.round(tCv)),opts:{bold:true,color:W,fill:{color:MYP}}},{text:fM(tCo/tCv),opts:{bold:true,color:W,fill:{color:MYP}}},
  {text:fM(tCo),opts:{bold:true,color:W,fill:{color:MYP}}}]);
tableSlide(s,'RESULTADOS GOOGLE ADS','Detalle por campaña',
  ['Campaña','Tipo','Impr.','Clics','CTR','CPC','Conv.','CPA','Costo'],gcRows,
  [3,1,1.2,1,0.9,1,1,1.1,1.7]);

// ========== SLIDE 5: AD GROUPS ==========
s=addSlide();s.background={color:BG};
const gag=data.google.adGroups;
tableSlide(s,'DETALLE POR GRUPO DE ANUNCIOS','Google Ads · Ad Groups',
  ['Ad Group','Clics','Impr.','CTR','CPC','Conv.','CPA','Costo'],
  gag.map(g=>[g[0],fmt(g[1]||0),fmt(g[2]||0),fP(g[5]||0),fM(g[6]||0),
    {text:fmt(Math.round(g[3]||0)),opts:{bold:true,color:'60A5FA'}},
    {text:fM(g[7]||0),opts:{bold:true,color:parseFloat(g[7]||0)>15000?'F87171':'34D399'}},
    fM(g[4]||0)]),
  [3,1,1.2,0.9,1,1,1.1,1.7]);

// ========== SLIDE 6: TOP SEARCH TERMS ==========
s=addSlide();s.background={color:BG};
const st=data.google.searchTerms.filter(k=>parseFloat(k[0])>0).slice(0,15);
tableSlide(s,'TOP SEARCH TERMS POR CONVERSIÓN','Términos buscados por usuarios en Google',
  ['Término de búsqueda','Conv.','Clics','Impr.','Costo','CPC'],
  st.map(k=>[String(k[5]||'').substring(0,45),
    {text:fmt(Math.round(parseFloat(k[0])||0)),opts:{bold:true,color:'60A5FA'}},
    fmt(parseInt(k[1])||0),fmt(parseInt(k[2])||0),fM(parseFloat(k[3])||0),fM(parseFloat(k[4])||0)]),
  [4.5,0.9,0.9,0.9,1.5,1.2]);

// ========== SLIDE 7: TOP KEYWORDS COMPRADAS ==========
s=addSlide();s.background={color:BG};
const kw=data.google.keywords.filter(k=>parseInt(k[1])>0).sort((a,b)=>(parseInt(b[1])||0)-(parseInt(a[1])||0)).slice(0,15);
tableSlide(s,'TOP KEYWORDS COMPRADAS','Keywords configuradas en Google Ads por clics',
  ['Keyword','Clics','Impr.','Conv.','Costo'],
  kw.map(k=>[String(k[0]||'').substring(0,45),
    {text:fmt(parseInt(k[1])||0),opts:{bold:true}},
    fmt(parseInt(k[2])||0),
    {text:fmt(Math.round(parseFloat(k[3])||0)),opts:{color:'60A5FA'}},
    fM(parseFloat(k[4])||0)]),
  [5,1.2,1.2,1,1.5]);

// ========== SLIDE 8: DEMOGRÁFICO GOOGLE ==========
s=addSlide();s.background={color:BG};
hdr(s,'DEMOGRÁFICO GOOGLE ADS','Distribución por edad y género');
// Age table
const age=data.google.age;
if(age.length>0){
  s.addText('POR EDAD',{x:0.5,y:1.1,w:6,h:0.3,fontSize:10,bold:true,color:'93C5FD',fontFace:'Arial'});
  const aRows=age.map((a,i)=>{
    const bg=i%2===0?'111827':'0D1117';
    return [{text:String(a[0]),options:{fill:{color:bg},color:W,fontSize:9,bold:true}},
      {text:fmt(a[1]||0),options:{fill:{color:bg},color:G3,fontSize:9,align:'center'}},
      {text:fmt(a[2]||0),options:{fill:{color:bg},color:G3,fontSize:9,align:'center'}}];
  });
  const aH=[{text:'Rango',options:{fill:{color:HD},color:'93C5FD',fontSize:8,bold:true}},
    {text:'Clics',options:{fill:{color:HD},color:'93C5FD',fontSize:8,bold:true,align:'center'}},
    {text:'Impr.',options:{fill:{color:HD},color:'93C5FD',fontSize:8,bold:true,align:'center'}}];
  s.addTable([aH,...aRows],{x:0.3,y:1.5,w:6,border:{pt:0.3,color:'1E293B'},rowH:0.4,colW:[2,2,2]});
}
// Gender
const gen=data.google.gender;
if(gen.length>0){
  s.addText('POR GÉNERO',{x:6.8,y:1.1,w:6,h:0.3,fontSize:10,bold:true,color:'93C5FD',fontFace:'Arial'});
  const gRows=gen.map((g,i)=>{
    const bg=i%2===0?'111827':'0D1117';
    return [{text:String(g[0]),options:{fill:{color:bg},color:W,fontSize:9,bold:true}},
      {text:fmt(g[1]||0),options:{fill:{color:bg},color:G3,fontSize:9,align:'center'}},
      {text:fmt(g[2]||0),options:{fill:{color:bg},color:G3,fontSize:9,align:'center'}}];
  });
  const gH=[{text:'Género',options:{fill:{color:HD},color:'93C5FD',fontSize:8,bold:true}},
    {text:'Clics',options:{fill:{color:HD},color:'93C5FD',fontSize:8,bold:true,align:'center'}},
    {text:'Impr.',options:{fill:{color:HD},color:'93C5FD',fontSize:8,bold:true,align:'center'}}];
  s.addTable([gH,...gRows],{x:6.8,y:1.5,w:6,border:{pt:0.3,color:'1E293B'},rowH:0.45,colW:[2,2,2]});
}

// ========== SLIDE 9: LANDING PAGES ==========
s=addSlide();s.background={color:BG};
const lp=data.google.landingPages.filter(l=>parseInt(l[1])>0).sort((a,b)=>(parseInt(b[1])||0)-(parseInt(a[1])||0)).slice(0,12);
tableSlide(s,'TOP LANDING PAGES','Páginas de destino Google Ads por clics',
  ['URL','Clics','Impr.','Conv.'],
  lp.map(l=>[String(l[0]||'').replace('https://','').substring(0,55),
    {text:fmt(parseInt(l[1])||0),opts:{bold:true}},
    fmt(parseInt(l[2])||0),
    {text:fmt(Math.round(parseFloat(l[3])||0)),opts:{color:'60A5FA'}}]),
  [7,1.5,1.5,1.5]);

// ========== SLIDE 10: % IMPRESIONES ==========
s=addSlide();s.background={color:BG};
tableSlide(s,'% IMPRESIONES EN SUBASTA','Posición competitiva Google Ads',
  ['Campaña','Tipo','% Impr. Search','% Top','% Absoluto Top'],
  gc.map(c=>[c[0],String(c[1]||'').replace('Performance_max','PMAX'),
    {text:c[9]?fP(c[9]):'N/A',opts:{bold:true,color:c[9]>0.1?'34D399':c[9]>0.05?WARN:'F87171'}},
    {text:c[10]?fP(c[10]):'N/A',opts:{color:c[10]>0.05?'34D399':G1}},
    {text:c[11]?fP(c[11]):'N/A',opts:{color:c[11]>0.05?'34D399':G1}}]),
  [4,2,2,2,2]);

// ========== SLIDE 11: SEPARADOR META ==========
s=addSlide();s.background={color:BG};
s.addShape(pptx.ShapeType.rect,{x:0,y:3.2,w:13.33,h:0.03,fill:{color:PUR}});
s.addText('RESULTADOS',{x:0.8,y:1.8,w:11,h:0.4,fontSize:13,color:G2,fontFace:'Arial',charSpacing:6});
s.addText('META ADS',{x:0.8,y:2.3,w:11,h:0.9,fontSize:44,bold:true,color:PUR,fontFace:'Arial'});

// ========== SLIDE 12: KPIs META ==========
s=addSlide();s.background={color:BG};
const mk=data.meta.kpis;
kpiSlide(s,'MÉTRICAS GENERALES META',data.mes+' '+data.anio+' vs Febrero '+data.anio,[
  {label:'Inversión',val:fM(mk.Inversión?.value||0),change:mk.Inversión?.change,inv:false},
  {label:'Clics',val:fmt(mk.Clics?.value||0),change:mk.Clics?.change,inv:false},
  {label:'Alcance',val:fmt(mk.Alcance?.value||0),change:mk.Alcance?.change,inv:false},
  {label:'Impresiones',val:fmt(mk.Impresiones?.value||0),change:mk.Impresiones?.change,inv:false},
  {label:'WhatsApp',val:fmt(mk.WhatsApp?.value||0),change:mk.WhatsApp?.change,inv:false},
  {label:'CPC',val:fM(mk.CPC?.value||0),change:mk.CPC?.change,inv:true},
  {label:'CTR',val:fP(mk.CTR?.value/100||0),change:mk.CTR?.change,inv:false},
]);

// ========== SLIDE 13: ACCIONES META ==========
s=addSlide();s.background={color:BG};
hdr(s,'ACCIONES META ADS','Desglose de resultados por tipo');
const mAct=data.meta.actions[0]||[];
const actions=[
  {label:'WhatsApp',val:mAct[0]||0,color:OK,icon:'💬'},
  {label:'Leads',val:mAct[1]||0,color:'60A5FA',icon:'📋'},
  {label:'Pixel Leads',val:mAct[2]||0,color:PUR,icon:'🎯'},
  {label:'Link Clicks',val:mAct[3]||0,color:BLU,icon:'🔗'},
  {label:'Engagement',val:mAct[4]||0,color:WARN,icon:'❤️'},
  {label:'Video Views',val:mAct[5]||0,color:'EC4899',icon:'▶️'},
];
actions.forEach((a,i)=>{
  const col=i%3,row=Math.floor(i/3);
  const x=0.5+col*4.2,y=1.2+row*2.8;
  s.addShape(pptx.ShapeType.rect,{x,y,w:3.8,h:2.3,fill:{color:CARD},rectRadius:0.06,line:{color:BD,width:0.4}});
  s.addText(a.icon+' '+a.label.toUpperCase(),{x:x+0.2,y:y+0.15,w:3.4,h:0.25,fontSize:9,color:G1,fontFace:'Arial'});
  s.addText(fmt(a.val),{x:x+0.2,y:y+0.5,w:3.4,h:0.8,fontSize:30,bold:true,color:a.color,fontFace:'Arial'});
});

// ========== SLIDE 14: GA4 CANALES ==========
s=addSlide();s.background={color:BG};
const ch=data.ga4.channels.sort((a,b)=>(parseInt(b[1])||0)-(parseInt(a[1])||0));
tableSlide(s,'CANALES DE TRÁFICO','Google Analytics 4 · '+data.mes+' '+data.anio,
  ['Canal','Sesiones','Usuarios','Nuevos'],
  ch.map(c=>[String(c[0]),{text:fmt(parseInt(c[1])||0),opts:{bold:true}},fmt(parseInt(c[2])||0),fmt(parseInt(c[3])||0)]),
  [4,2.5,2.5,2.5]);

// ========== SLIDE 15: TOP PÁGINAS ==========
s=addSlide();s.background={color:BG};
const pg=data.ga4.pages.sort((a,b)=>(parseInt(b[1])||0)-(parseInt(a[1])||0)).slice(0,15);
tableSlide(s,'TOP PÁGINAS DEL SITIO','Google Analytics 4 · Por pageviews',
  ['Página','Pageviews','Sesiones','Usuarios'],
  pg.map(p=>[String(p[0]).substring(0,50),{text:fmt(parseInt(p[1])||0),opts:{bold:true}},fmt(parseInt(p[2])||0),fmt(parseInt(p[3])||0)]),
  [5.5,2,2,2]);

// ========== SLIDE 16: INSTAGRAM ==========
s=addSlide();s.background={color:BG};
hdr(s,'INSTAGRAM','Mejores publicaciones del mes');
const posts=data.instagram.posts;
if(posts.length>0){
  posts.slice(0,4).forEach((p,i)=>{
    const obj=typeof p[0]==='object'?p[0]:{};
    const text=obj.text||'';
    const y=1.1+i*1.4;
    s.addShape(pptx.ShapeType.rect,{x:0.3,y,w:12.7,h:1.15,fill:{color:CARD},rectRadius:0.06});
    s.addText(text.substring(0,120)+(text.length>120?'...':''),{x:0.5,y:y+0.05,w:8,h:0.55,fontSize:8,color:G3,fontFace:'Arial'});
    const reach=obj.reach||p[1]||0,interactions=obj.total_interactions||p[3]||0,likes=obj.likes||p[4]||0;
    s.addText('Alcance: '+fmt(reach)+' · Interacciones: '+fmt(interactions)+' · Likes: '+fmt(likes),{x:0.5,y:y+0.65,w:8,h:0.3,fontSize:8,bold:true,color:'60A5FA',fontFace:'Arial'});
  });
}

// ========== SLIDES MANUALES ==========
['DETALLE GEOGRÁFICO GOOGLE','RESULTADOS POR PLATAFORMA META','RESULTADOS DEMOGRÁFICOS META'].forEach(title=>{
  s=addSlide();s.background={color:BG};
  hdr(s,title,'Completar por el equipo');
  s.addShape(pptx.ShapeType.rect,{x:2.5,y:2.5,w:8,h:2,fill:{color:CARD},rectRadius:0.08,line:{color:BD,width:0.5}});
  s.addText('Slide para completar manualmente\nDatos no disponibles via Reportei API',{x:2.5,y:2.7,w:8,h:1.6,fontSize:12,color:G2,align:'center',fontFace:'Arial'});
});

// ========== CIERRE ==========
s=addSlide();s.background={color:BG};
s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.33,h:0.04,fill:{color:MYP}});
s.addShape(pptx.ShapeType.rect,{x:0,y:5.5,w:13.33,h:2,fill:{color:CARD}});
s.addText('MULLER Y PÉREZ',{x:0.8,y:2.2,w:11,h:0.8,fontSize:30,bold:true,color:W,align:'center',fontFace:'Arial'});
s.addText('Performance Marketing',{x:0.8,y:3,w:11,h:0.4,fontSize:13,color:G1,align:'center',fontFace:'Arial'});
s.addText('contacto@mulleryperez.cl · +56 9 5419 7432 · mulleryperez.cl',{x:0.8,y:5.8,w:11,h:0.4,fontSize:10,color:G1,align:'center',fontFace:'Arial'});

const outFile = '/Users/christophermuller/Desktop/Informe_'+data.cliente.replace(/\s+/g,'_')+'_'+data.mes+data.anio+'.pptx';
pptx.writeFile({fileName:outFile}).then(()=>console.log('✅ '+slideCount+' slides → '+outFile)).catch(e=>console.error(e.message));
