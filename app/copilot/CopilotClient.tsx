'use client'

import React, { useState, useEffect } from 'react'

function fmt(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

function useScrollReveal() {
  useEffect(function() {
    var els = document.querySelectorAll('.reveal')
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    els.forEach(function(el) { observer.observe(el) })
    return function() { observer.disconnect() }
  }, [])
}

/* ─── IMAGE URLS (mockups reales del producto) ─── */
var IMG_DASHBOARD = '/copilot/mockup-dashboard.png'
var IMG_SOCIAL = '/copilot/mockup-email-diario.png'
var IMG_TEAM = '/copilot/mockup-copies.png'
var IMG_MOBILE = '/copilot/mockup-email-diario.png'
var IMG_CALENDAR = '/copilot/mockup-grilla.png'
var IMG_AI = '/copilot/mockup-copies.png'
var IMG_REPORTS = '/copilot/mockup-reporte.png'
var IMG_ENGAGEMENT = '/copilot/mockup-auditoria.png'
var IMG_BENCHMARK = '/copilot/mockup-dashboard.png'

/* ─── FEATURE CARDS — mapeadas 1:1 con el dashboard ─── */
var featureCards = [
  { title: 'Instagram + LinkedIn en paralelo', desc: 'Monitorea a tus competidores en ambas redes. Engagement, formatos y temas analizados por separado porque IG y LinkedIn son mundos distintos. Cada dato comparado con tu industria en Chile.', img: '/copilot/mockup-email-diario.png', icon: '\uD83D\uDD0D' },
  { title: 'Contenido diferenciado por red', desc: 'Copies profesionales para Instagram (hooks cortos, visual) y LinkedIn (thought leadership, datos). 16 posts con calendario, guiones de video y sugerencias de dise\u00f1o. Listos para publicar.', img: '/copilot/mockup-copies.png', icon: '\u270D\uFE0F' },
  { title: 'Auditor\u00eda por plataforma', desc: 'Score mensual con criterios separados para IG y LinkedIn. Cada uno con dato real, benchmark de tu rubro y acci\u00f3n concreta. No mezcla m\u00e9tricas de redes distintas.', img: '/copilot/mockup-auditoria.png', icon: '\uD83D\uDCCA' },
  { title: '\u00c1rbol de inversi\u00f3n digital', desc: 'Cu\u00e1nto invertir en cada canal, cu\u00e1ntos leads esperar, y tres escenarios de retorno. Calculado con datos reales de 22 industrias en Chile.', img: '/copilot/mockup-grilla.png', icon: '\uD83C\uDF33' },
  { title: 'Reporte con acciones por red', desc: 'Reporte ejecutivo mensual con acciones priorizadas, hallazgos separados por Instagram y LinkedIn, y predicci\u00f3n del mes siguiente. Para tomar decisiones, no para decorar.', img: '/copilot/mockup-reporte.png', icon: '\uD83C\uDFAF' },
  { title: 'Aprende de tu negocio', desc: 'Copilot recuerda qu\u00e9 aprobaste, qu\u00e9 rechazaste, qu\u00e9 funcion\u00f3. Cada mes el contenido es m\u00e1s preciso. Los agentes se retroalimentan entre s\u00ed: el brief mejora los copies, la auditor\u00eda mejora el brief.', img: '/copilot/mockup-email-diario.png', icon: '\uD83E\uDDE0' },
]

/* ─── PLANS DATA ─── */
var plans = [
  {
    name: 'Starter',
    price: 34990,
    desc: 'Monitoreo b\u00e1sico de competencia',
    features: [
      '5 cuentas Instagram + LinkedIn',
      'An\u00e1lisis semanal con IA',
      '4 copies por semana',
      'Email semanal de competencia',
      'Dashboard con m\u00e9tricas',
    ],
    cta: 'Comenzar gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 69990,
    desc: 'Inteligencia competitiva completa',
    features: [
      '15 cuentas IG + LinkedIn',
      'Copies diferenciados IG vs LinkedIn',
      'Grilla mensual 8 posts con calendario',
      'Auditor\u00eda mensual por plataforma',
      'Brief estrat\u00e9gico con territorios',
      'Reporte ejecutivo con acciones',
      'Banco de ideas + aprendizaje',
    ],
    cta: 'Probar gratis 7 d\u00edas',
    popular: true,
  },
  {
    name: 'Business',
    price: 119990,
    desc: 'Estrategia completa multi-red',
    features: [
      '30 cuentas IG + LinkedIn',
      'Grilla 16 posts + guiones de video',
      'Benchmark competitivo mensual',
      '\u00c1rbol de inversi\u00f3n con predictor',
      'Copies de anuncios Google + Meta',
      'Excel descargable de grilla',
      'Todo lo de Pro incluido',
    ],
    cta: 'Hablar con ventas',
    popular: false,
  },
]

/* ─── DEEP DIVE DATA — c\u00f3mo funciona Copilot ─── */
var deepDive = [
  {
    title: 'Instagram y LinkedIn analizados por separado',
    desc: 'No mezcla m\u00e9tricas de redes distintas. En Instagram mide engagement visual (likes, comentarios, saves). En LinkedIn mide reacciones, comentarios y alcance B2B. Cada competidor con desglose por red, formato ganador y tema dominante.',
    img: '/copilot/mockup-email-diario.png',
    reverse: false,
  },
  {
    title: 'Copies que suenan a cada plataforma',
    desc: 'Para Instagram: hooks cortos que paran el scroll, CTAs interactivos, 6-10 hashtags. Para LinkedIn: thought leadership con datos de industria, tono profesional, estructura larga. El mismo tema, dos enfoques completamente distintos.',
    img: '/copilot/mockup-grilla.png',
    reverse: true,
  },
  {
    title: '21 agentes que se retroalimentan',
    desc: 'Brief \u2192 Contenido \u2192 Grilla \u2192 Auditor\u00eda \u2192 Benchmark \u2192 Reporte. Cada agente lee lo que gener\u00f3 el anterior y mejora su output. La auditor\u00eda alimenta el brief del mes siguiente. El reporte corrige a los dem\u00e1s agentes. Ciclo continuo.',
    img: '/copilot/mockup-auditoria.png',
    reverse: false,
  },
  {
    title: 'Acciones concretas, no m\u00e9tricas vac\u00edas',
    desc: 'Reporte ejecutivo con acciones separadas por plataforma: qu\u00e9 hacer en Instagram esta semana, qu\u00e9 publicar en LinkedIn, con qu\u00e9 prioridad. Auditor\u00eda con benchmarks reales de tu industria. Explicado para que un due\u00f1o de empresa lo entienda.',
    img: '/copilot/mockup-dashboard.png',
    reverse: true,
  },
]

/* ─── COMPONENT ─── */
export default function CopilotClient() {
  var [trialEmail, setTrialEmail] = useState('')
  var [nombreEmpresa, setNombreEmpresa] = useState('')
  var [descripcion, setDescripcion] = useState('')
  var [webCliente, setWebCliente] = useState('')
  var [igCliente, setIgCliente] = useState('')
  var [url1, setUrl1] = useState('')
  var [url2, setUrl2] = useState('')
  var [url3, setUrl3] = useState('')
  var [enviado, setEnviado] = useState(false)
  var [enviando, setEnviando] = useState(false)
  var [tab, setTab] = useState('competencia')
  var [faqOpen, setFaqOpen] = useState(-1)
  var [modalOpen, setModalOpen] = useState(false)

  useScrollReveal()

  function handleTrial(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    fetch('/api/copilot/trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trialEmail,
        nombre_empresa: nombreEmpresa,
        descripcion: descripcion,
        web: webCliente,
        instagram: igCliente,
        competidores: [url1, url2, url3].filter(Boolean),
      }),
    })
      .then(function(res) { return res.json() })
      .then(function(data) {
        setEnviando(false)
        if (data.error) {
          alert(data.error)
          return
        }
        setEnviado(true)
        // NO redirigir al dashboard — mostrar página de gracias
      })
      .catch(function() {
        setEnviando(false)
        alert('Error al enviar. Intenta de nuevo.')
      })
  }

  function scrollTo(id: string) {
    var el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  function initAgentCanvas(canvas: HTMLCanvasElement) {
    var ctx = canvas.getContext('2d')
    if (!ctx) return
    var container = canvas.parentElement
    if (!container) return
    function resize() { canvas.width = container!.clientWidth; canvas.height = container!.clientHeight }
    resize(); window.addEventListener('resize', resize)
    var GW = function() { return canvas.width }, GH = function() { return canvas.height }

    var COLS = [[56,189,248],[129,140,248],[167,139,250],[192,132,252],[232,121,249],[244,114,182],[34,211,238],[96,165,250]]
    var AD = [
      {n:'Scraping',ci:0,r:0,d:'Extrae posts de Instagram y LinkedIn de tus competidores.',dt:'Apify + LinkdAPI'},
      {n:'Memoria',ci:3,r:0,d:'Recuerda qu\u00e9 funcion\u00f3, qu\u00e9 rechazaste, qu\u00e9 aprob\u00f3 tu equipo.',dt:'Persistent storage'},
      {n:'Brief',ci:7,r:0,d:'Genera territorios de contenido para Instagram y LinkedIn por separado.',dt:'Planning layer'},
      {n:'Copies',ci:6,r:0,d:'IG: hooks cortos. LI: thought leadership con datos.',dt:'Dual generation'},
      {n:'Grilla',ci:4,r:0,d:'16 posts con calendario. C\u00f3digo decide estructura, IA genera contenido.',dt:'11 IG + 5 LI'},
      {n:'Guiones',ci:5,r:0,d:'Scripts de video con storyboard: escenas, texto, timing.',dt:'Video pipeline'},
      {n:'Auditor\u00eda',ci:1,r:0,d:'Score separado IG vs LinkedIn con benchmark de tu industria.',dt:'Per-platform scoring'},
      {n:'Benchmark',ci:2,r:0,d:'Cuadro comparativo competidor \u00d7 formato \u00d7 tono \u00d7 engagement.',dt:'Claude Sonnet'},
      {n:'\u00c1rbol',ci:4,r:1,d:'Inversi\u00f3n por canal con 3 escenarios de retorno.',dt:'M&P Predictor'},
      {n:'Reporte',ci:0,r:1,d:'6 acciones priorizadas, hallazgos, predicci\u00f3n.',dt:'Executive output'},
      {n:'Ads',ci:5,r:1,d:'Headlines Google 30ch + Meta 125ch. Auto-validated.',dt:'Ad creative'},
      {n:'Campa\u00f1a',ci:6,r:1,d:'Canales, presupuesto, calendario, KPIs.',dt:'Execution plan'},
      {n:'Ideas',ci:3,r:1,d:'Gaps vs competencia y oportunidades.',dt:'Opportunity bank'},
      {n:'Industria',ci:7,r:2,d:'22 industrias \u00d7 CPC \u00d7 CVR \u00d7 ROAS.',dt:'Reference data'},
      {n:'Decisiones',ci:1,r:2,d:'Decide qu\u00e9 agentes correr seg\u00fan plan y datos.',dt:'Signal router'},
      {n:'Perfil',ci:2,r:2,d:'Auto-genera rubro, competencia, diferenciadores.',dt:'Auto-detection'},
      {n:'Lifecycle',ci:5,r:2,d:'6 emails con data real del dashboard.',dt:'Conversion funnel'},
      {n:'Validador',ci:6,r:2,d:'Verifica cuentas IG/LinkedIn.',dt:'Input validation'},
      {n:'QA',ci:5,r:2,d:'Revisa todos los entregables. Rechaza basura.',dt:'Quality gate'},
      {n:'Aprendizaje',ci:3,r:2,d:'Correcciones del QA \u2192 agentes se autocorrigen.',dt:'Self-correction'},
      {n:'LinkdAPI',ci:0,r:2,d:'Posts LinkedIn con reacciones y comentarios.',dt:'LinkedIn data'},
    ]
    var SYN = [[0,1],[0,2],[0,3],[0,6],[0,7],[1,2],[1,3],[1,4],[1,6],[2,3],[2,4],[2,5],[2,11],[3,4],[3,12],[6,9],[6,2],[7,9],[7,8],[8,9],[8,11],[9,19],[13,6],[13,8],[13,7],[14,3],[14,5],[15,2],[20,0],[18,19],[18,9],[19,1],[10,11],[16,15],[17,0],[10,9],[10,3],[12,2],[12,6],[16,9],[16,1],[17,6],[17,7],[20,7],[20,6],[5,4],[5,3],[11,9],[11,8],[15,9],[4,9],[13,2],[19,0]]
    var phi=(1+Math.sqrt(5))/2
    var nodes=AD.map(function(a,i){var fA=i*Math.PI*2/phi;var bR=a.r===0?110+(i%8)*15:a.r===1?210+(i%5)*18:310+(i%8)*14;return{name:a.n,ring:a.r,desc:a.d,detail:a.dt,color:COLS[a.ci],baseAngle:fA,radius:bR,offsetX:Math.sin(i*2.7)*40,offsetY:Math.cos(i*3.1)*25,size:a.r===0?15:a.r===1?11:8,x:0,y:0,cz:0,fireLevel:0,breathPhase:Math.random()*Math.PI*2,driftX:(Math.random()-0.5)*0.06,driftY:(Math.random()-0.5)*0.04}})
    var dust=Array.from({length:150},function(){return{x:Math.random()*2000,y:Math.random()*1000,vx:(Math.random()-0.5)*0.12,vy:(Math.random()-0.5)*0.08,size:Math.random()*1.1,color:COLS[Math.floor(Math.random()*COLS.length)],alpha:0.03+Math.random()*0.1,twinkle:Math.random()*Math.PI*2,twinkleSpeed:0.5+Math.random()*2}})
    var particles:any[]=[];var time2=0;var hovN:any=null;var selN:any=null;var lastH='';var mmx=0;var mmy=0

    canvas.addEventListener('mousemove',function(e:any){var rect=canvas.getBoundingClientRect();mmx=e.clientX-rect.left;mmy=e.clientY-rect.top;hovN=null
      for(var i=0;i<nodes.length;i++){var dx=mmx-nodes[i].x,dy=mmy-nodes[i].y;if(dx*dx+dy*dy<nodes[i].size*nodes[i].size*6){hovN=nodes[i];break}}
      canvas.style.cursor=hovN?'pointer':'default'
      var sp=document.getElementById('copilot-spotlight');if(!sp)return
      if(hovN&&hovN.name!==lastH){lastH=hovN.name;selN=hovN;sp.querySelector('#copilot-spot-name')!.textContent=hovN.name.toUpperCase();sp.querySelector('#copilot-spot-desc')!.textContent=hovN.desc;sp.querySelector('#copilot-spot-detail')!.textContent=hovN.detail;(sp as HTMLElement).style.opacity='1'}
      else if(!hovN&&lastH){lastH='';selN=null;(sp as HTMLElement).style.opacity='0'}
    })

    function frame(){time2+=0.016;var w=GW(),h=GH();ctx!.fillStyle='rgba(2,8,23,0.07)';ctx!.fillRect(0,0,w,h)
      var cx=w/2,cy=h/2,rot=time2*0.004
      // Stardust
      dust.forEach(function(d){d.x+=d.vx;d.y+=d.vy;if(d.x<-10)d.x=w+10;if(d.x>w+10)d.x=-10;if(d.y<-10)d.y=h+10;if(d.y>h+10)d.y=-10
        var tw=(Math.sin(time2*d.twinkleSpeed+d.twinkle)*0.5+0.5);var a=d.alpha*tw
        ctx!.beginPath();ctx!.arc(d.x,d.y,d.size,0,Math.PI*2);ctx!.fillStyle='rgba('+d.color.join(',')+','+a+')';ctx!.fill()
        if(d.size>0.8&&tw>0.7){ctx!.beginPath();ctx!.arc(d.x,d.y,d.size*3,0,Math.PI*2);ctx!.fillStyle='rgba('+d.color.join(',')+','+(a*0.15)+')';ctx!.fill()}
      })
      // Nebula + pulse
      var ng=ctx!.createRadialGradient(cx,cy,0,cx,cy,300);ng.addColorStop(0,'rgba(255,220,180,0.02)');ng.addColorStop(0.15,'rgba(192,132,252,0.025)');ng.addColorStop(0.35,'rgba(56,189,248,0.015)');ng.addColorStop(1,'rgba(2,8,23,0)')
      ctx!.beginPath();ctx!.arc(cx,cy,300,0,Math.PI*2);ctx!.fillStyle=ng;ctx!.fill()
      var pR=80+Math.sin(time2*0.5)*25;var pg=ctx!.createRadialGradient(cx,cy,0,cx,cy,pR);pg.addColorStop(0,'rgba(255,230,200,0.025)');pg.addColorStop(1,'rgba(139,92,246,0)')
      ctx!.beginPath();ctx!.arc(cx,cy,pR,0,Math.PI*2);ctx!.fillStyle=pg;ctx!.fill()
      // Update nodes
      nodes.forEach(function(n){var a2=n.baseAngle+rot*(n.ring===0?0.8:n.ring===1?0.4:0.2);var br=1+Math.sin(time2*0.25+n.breathPhase)*0.02
        n.x=cx+Math.cos(a2)*n.radius*br+n.offsetX+Math.sin(time2*n.driftX)*10;n.y=cy+Math.sin(a2)*n.radius*0.52*br+n.offsetY+Math.cos(time2*n.driftY)*7
        n.cz=Math.cos(a2)*50;n.fireLevel=Math.max(0,n.fireLevel-0.005)})
      // Connections
      SYN.forEach(function(s){var f=nodes[s[0]],t=nodes[s[1]];var act=selN&&(selN===f||selN===t);var fire=Math.max(f.fireLevel,t.fireLevel)
        var mc=[Math.round((f.color[0]+t.color[0])/2),Math.round((f.color[1]+t.color[1])/2),Math.round((f.color[2]+t.color[2])/2)]
        var al=act?0.3:0.04*((f.cz+t.cz+100)/200*0.5+0.5)+fire*0.15
        var mx2=(f.x+t.x)/2+(f.y-t.y)*0.06,my2=(f.y+t.y)/2+(t.x-f.x)*0.06
        if(act||fire>0.2){ctx!.beginPath();ctx!.moveTo(f.x,f.y);ctx!.quadraticCurveTo(mx2,my2,t.x,t.y);ctx!.strokeStyle='rgba('+mc.join(',')+','+(act?0.08:fire*0.06)+')';ctx!.lineWidth=4;ctx!.stroke()}
        ctx!.beginPath();ctx!.moveTo(f.x,f.y);ctx!.quadraticCurveTo(mx2,my2,t.x,t.y);ctx!.strokeStyle='rgba('+mc.join(',')+','+al+')';ctx!.lineWidth=act?1.5:0.5+fire*0.7;ctx!.stroke()})
      // Impulses
      if(Math.random()<0.05){var si=SYN[Math.floor(Math.random()*SYN.length)];particles.push({fi:si[0],ti:si[1],progress:0,speed:0.002+Math.random()*0.003,color:nodes[si[0]].color})}
      particles=particles.filter(function(p:any){p.progress+=p.speed;if(p.progress>=1){nodes[p.ti].fireLevel=Math.min(1,nodes[p.ti].fireLevel+0.6);return false}
        var f=nodes[p.fi],t=nodes[p.ti],tp=p.progress;var mx2=(f.x+t.x)/2+(f.y-t.y)*0.06,my2=(f.y+t.y)/2+(t.x-f.x)*0.06
        var px=(1-tp)*(1-tp)*f.x+2*(1-tp)*tp*mx2+tp*tp*t.x,py=(1-tp)*(1-tp)*f.y+2*(1-tp)*tp*my2+tp*tp*t.y
        var ig=ctx!.createRadialGradient(px,py,0,px,py,8);ig.addColorStop(0,'rgba('+p.color.join(',')+',0.35)');ig.addColorStop(1,'rgba('+p.color.join(',')+',0)')
        ctx!.beginPath();ctx!.arc(px,py,8,0,Math.PI*2);ctx!.fillStyle=ig;ctx!.fill()
        ctx!.beginPath();ctx!.arc(px,py,1.5,0,Math.PI*2);ctx!.fillStyle='rgba(224,242,254,0.8)';ctx!.fill();return true})
      // Nodes
      nodes.slice().sort(function(a:any,b:any){return a.cz-b.cz}).forEach(function(n:any){var da=0.3+(n.cz+50)/100*0.7;var act=hovN===n||selN===n;var fire=n.fireLevel;var sz=n.size*(act?1.4:1);var col=n.color
        if(fire>0.03){var fr2=sz*(2+fire*3);var fg=ctx!.createRadialGradient(n.x,n.y,sz*0.5,n.x,n.y,fr2);fg.addColorStop(0,'rgba('+col.join(',')+','+(fire*0.2)+')');fg.addColorStop(1,'rgba('+col.join(',')+',0)');ctx!.beginPath();ctx!.arc(n.x,n.y,fr2,0,Math.PI*2);ctx!.fillStyle=fg;ctx!.fill()
          ctx!.beginPath();ctx!.arc(n.x,n.y,sz*(1.2+fire),0,Math.PI*2);ctx!.strokeStyle='rgba('+col.join(',')+','+(fire*0.25)+')';ctx!.lineWidth=0.5;ctx!.stroke()}
        var og=ctx!.createRadialGradient(n.x,n.y,0,n.x,n.y,sz*(act?4:2.8));og.addColorStop(0,'rgba('+col.join(',')+','+(act?0.25:0.08*da+fire*0.12)+')');og.addColorStop(0.5,'rgba('+col.join(',')+','+(act?0.08:0.02*da+fire*0.04)+')');og.addColorStop(1,'rgba('+col.join(',')+',0)')
        ctx!.beginPath();ctx!.arc(n.x,n.y,sz*(act?4:2.8),0,Math.PI*2);ctx!.fillStyle=og;ctx!.fill()
        ctx!.beginPath();ctx!.arc(n.x,n.y,sz,0,Math.PI*2);ctx!.strokeStyle='rgba('+col.join(',')+','+(act?0.9:da*0.4+fire*0.4)+')';ctx!.lineWidth=act?2:1+fire;ctx!.stroke()
        var ig2=ctx!.createRadialGradient(n.x,n.y,0,n.x,n.y,sz*0.85);ig2.addColorStop(0,'rgba(255,255,255,'+(act?0.35:0.1*da+fire*0.15)+')');ig2.addColorStop(0.5,'rgba('+col.join(',')+','+(act?0.5:0.2*da+fire*0.25)+')');ig2.addColorStop(1,'rgba('+col.join(',')+','+(act?0.3:0.08*da+fire*0.12)+')')
        ctx!.beginPath();ctx!.arc(n.x,n.y,sz*0.85,0,Math.PI*2);ctx!.fillStyle=ig2;ctx!.fill()
        ctx!.beginPath();ctx!.arc(n.x,n.y,3+fire*2,0,Math.PI*2);ctx!.fillStyle='rgba(255,255,255,'+(act?0.8:da*0.35+fire*0.4)+')';ctx!.fill()
        var fs2=act?13:n.ring===0?11:9;ctx!.font=(act?'700 ':'500 ')+fs2+'px Inter,sans-serif';ctx!.textAlign='center'
        ctx!.fillStyle='rgba(2,8,23,0.5)';ctx!.fillText(n.name,n.x+1,n.y+sz+15)
        ctx!.fillStyle='rgba('+col.join(',')+','+(act?1:da*(n.ring===0?0.7:0.5)+fire*0.3)+')';ctx!.fillText(n.name,n.x,n.y+sz+14)})
      requestAnimationFrame(frame)}
    frame()
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ─── GLOBAL STYLES ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .revealed { opacity: 1; transform: none; }
        .gradient-text { background: linear-gradient(135deg, #4338CA, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .btn-primary { background: linear-gradient(135deg, #4338CA, #7C3AED); color: white; border: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.35); }
        .btn-secondary { background: white; color: #4338CA; border: 2px solid #E0E7FF; padding: 12px 30px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-secondary:hover { border-color: #7C3AED; background: #F5F3FF; }
        .card-hover { transition: all 0.3s; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .plan-card { border: 2px solid #E5E7EB; border-radius: 20px; padding: 40px 32px; background: white; transition: all 0.3s; }
        .plan-card.popular { border-color: #7C3AED; box-shadow: 0 8px 40px rgba(124,58,237,0.15); position: relative; }
        .input-field { width: 100%; padding: 14px 18px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 15px; font-family: Inter, sans-serif; transition: border-color 0.3s; outline: none; box-sizing: border-box; }
        .input-field:focus { border-color: #7C3AED; }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .deep-row { flex-direction: column !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }} className="hero-grid">
          {/* Left */}
          <div style={{ flex: 1 }}>
            <div className="reveal" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #EEF2FF, #F3E8FF)', borderRadius: 100, padding: '8px 20px', marginBottom: 24, fontSize: 14, fontWeight: 600, color: '#4338CA' }}>
              Instagram + LinkedIn + Estrategia + Predicci{'\u00f3'}n
            </div>
            <h1 className="reveal" style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', color: '#111827' }}>
              Inteligencia competitiva<br/>para Instagram y LinkedIn.<br/><span className="gradient-text">Desde $34.990/mes.</span>
            </h1>
            <p className="reveal" style={{ fontSize: 19, lineHeight: 1.65, color: '#6B7280', margin: '0 0 32px', maxWidth: 560 }}>
              Copilot monitorea a tu competencia en ambas redes, genera contenido profesional diferenciado por plataforma, y te entrega acciones concretas cada mes. 21 agentes de IA que aprenden de tu negocio.
            </p>
            <div className="reveal" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <button className="btn-primary" onClick={function() { scrollTo('trial') }}>
                Probar gratis 7 días
              </button>
              <button className="btn-secondary" onClick={function() { scrollTo('que-incluye') }}>
                Ver qué incluye
              </button>
            </div>
            <p className="reveal" style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
              Sin tarjeta · Se cancela solo · 37 empresas activas
            </p>
          </div>

          {/* Right — Mock Dashboard Card */}
          <div className="reveal" style={{ flex: 1, maxWidth: 520 }}>
            <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              {/* Tab bar */}
              <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6', padding: '0 24px' }}>
                {['Competencia', 'Contenido', 'Mi marca'].map(function(t) {
                  var isActive = tab === t.toLowerCase().replace(' ', '-')
                  return (
                    <button key={t} onClick={function() { setTab(t.toLowerCase().replace(' ', '-')) }} style={{ padding: '14px 20px', fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? '#4338CA' : '#9CA3AF', borderBottom: isActive ? '3px solid #4338CA' : '3px solid transparent', background: 'none', border: 'none', borderBottomWidth: 3, borderBottomStyle: 'solid', borderBottomColor: isActive ? '#4338CA' : 'transparent', cursor: 'pointer' }}>
                      {t}
                    </button>
                  )
                })}
              </div>
              {/* Card content */}
              <div style={{ padding: 24 }}>
                {tab === 'competencia' && (
                  <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1, background: '#F5F3FF', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Posts detectados hoy</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#4338CA' }}>24</div>
                      </div>
                      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Empresas monitoreadas</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>5</div>
                      </div>
                    </div>
                    <img src="/copilot/mockup-email-diario.png" alt="Informe diario de competencia" style={{ width: '100%', borderRadius: 12, height: 180, objectFit: 'cover' }} />
                  </>
                )}
                {tab === 'contenido' && (
                  <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1, background: '#F5F3FF', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Copies generados</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#4338CA' }}>8</div>
                      </div>
                      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Score promedio</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>84</div>
                      </div>
                    </div>
                    <img src="/copilot/mockup-copies.png" alt="Copies generados por IA" style={{ width: '100%', borderRadius: 12, height: 180, objectFit: 'cover' }} />
                  </>
                )}
                {tab === 'mi-marca' && (
                  <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1, background: '#F5F3FF', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Score de perfil</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#4338CA' }}>76</div>
                      </div>
                      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Redes auditadas</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>3</div>
                      </div>
                    </div>
                    <img src="/copilot/mockup-auditoria.png" alt="Auditoría de marca" style={{ width: '100%', borderRadius: 12, height: 180, objectFit: 'cover' }} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — WHAT COPILOT DOES */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="que-incluye" style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Todo lo que hace <span className="gradient-text">Copilot</span> por ti
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 600, margin: '0 auto' }}>
              Seis capacidades que trabajan juntas, cada día, sin que tengas que hacer nada.
            </p>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {featureCards.map(function(card, i) {
              return (
                <div key={i} className="reveal card-hover" style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ padding: '24px 24px 28px' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{card.title}</h3>
                    <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — HOW IT WORKS (3D Visualization) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '60px 24px 40px', background: '#0a0a1a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, margin: '0 0 12px', background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              21 Agentes de IA trabajando juntos
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)' }}>
              Un sistema que piensa, aprende y se corrige solo. Haz click en cada agente.
            </p>
          </div>

          {/* 3 Steps over the visualization */}
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 16 }}>
            {[
              { step: '1', title: 'Conecta', desc: 'Agrega competidores de IG + LinkedIn', icon: '\u26A1', color: '#818cf8' },
              { step: '2', title: '21 agentes analizan', desc: 'Scraping, brief, copies, auditor\u00eda, benchmark, reporte', icon: '\uD83E\uDDE0', color: '#c084fc' },
              { step: '3', title: 'Apruebas y aprende', desc: 'Lo que apruebas se refuerza. Cada mes es mejor', icon: '\uD83D\uDE80', color: '#f472b6' },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ textAlign: 'center', padding: '16px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase' as const, letterSpacing: 1, marginLeft: 8 }}>Paso {s.step}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'white', marginLeft: 8 }}>{s.title}</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>{s.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Spotlight info — zona fija entre pasos y canvas */}
          <div id="copilot-spotlight" style={{ height: 70, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 0, transition: 'opacity 0.4s ease', marginBottom: 8 }}>
            <div id="copilot-spot-name" style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: 2 }}></div>
            <div id="copilot-spot-desc" style={{ fontSize: 13, fontWeight: 400, color: 'rgba(226,232,240,0.75)', lineHeight: 1.6, marginTop: 5, maxWidth: 500 }}></div>
            <div id="copilot-spot-detail" style={{ fontSize: 10, color: 'rgba(56,189,248,0.55)', fontWeight: 500, marginTop: 4, letterSpacing: 1 }}></div>
          </div>

          {/* Canvas container */}
          <div style={{ position: 'relative', height: 540 }}>
            <canvas ref={function(el) { if (el && !(el as any)._copilotInit) { (el as any)._copilotInit = true; initAgentCanvas(el) } }} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 16 }}>
            {[
              { num: '21', label: 'Agentes IA' },
              { num: '34', label: 'Conexiones' },
              { num: '2', label: 'Plataformas' },
              { num: '8', label: 'Herramientas' },
              { num: '22', label: 'Industrias' },
            ].map(function(s, i) {
              return <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' as const }}>{s.label}</div>
              </div>
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — FEATURES DEEP DIVE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Funcionalidades que marcan <span className="gradient-text">la diferencia</span>
            </h2>
          </div>

          {deepDive.map(function(item, i) {
            return (
              <div key={i} className="reveal deep-row" style={{ display: 'flex', alignItems: 'center', gap: 60, marginBottom: 80, flexDirection: item.reverse ? 'row-reverse' : 'row' }}>
                <div style={{ flex: 1 }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', borderRadius: 20, objectFit: 'cover', maxHeight: 340 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>{item.title}</h3>
                  <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4B — EJEMPLO DE INFORMES */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #111827 0%, #1E1B4B 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
              Así se ven tus informes
            </h2>
            <p style={{ fontSize: 18, color: '#94a3b8' }}>
              Inteligencia competitiva + contenido + estrategia. Todo en tu correo y dashboard.
            </p>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { img: '/copilot/mockup-email-diario.png', title: 'Competencia IG + LinkedIn', desc: 'Qu\u00e9 publican tus competidores en cada red, qu\u00e9 formatos les funcionan, d\u00f3nde hay gaps. Cuadro comparativo por empresa.', tag: 'Cada semana' },
              { img: '/copilot/mockup-copies.png', title: 'Contenido por plataforma', desc: 'Copies para Instagram (visual, hooks cortos) y LinkedIn (datos, B2B). Grilla con calendario. Guiones de video. Copies de anuncios.', tag: 'Cada semana' },
              { img: '/copilot/mockup-reporte.png', title: 'Reporte + Auditor\u00eda', desc: 'Acciones priorizadas por red, auditor\u00eda con criterios separados IG vs LinkedIn, \u00e1rbol de inversi\u00f3n y predicci\u00f3n del pr\u00f3ximo mes.', tag: 'Cada mes' },
            ].map(function(item, i) {
              return (
                <div key={i} className="reveal card-hover" style={{ background: '#0F0D2E', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
                  <div style={{ padding: '24px 24px 28px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.6 }}>{item.desc}</p>
                    <span style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 100 }}>{item.tag}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4C — SOCIAL PROOF */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F5F3FF' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 40px' }}>
              Empresas que ya usan <span className="gradient-text">Copilot</span>
            </h2>
            <div style={{ background: 'white', borderRadius: 20, padding: '48px 40px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 20, fontStyle: 'italic', color: '#374151', lineHeight: 1.7, margin: '0 0 24px' }}>
                &ldquo;Copilot nos permite saber exactamente qué está haciendo nuestra competencia cada día. Los copies sugeridos nos ahorran horas de trabajo semanal.&rdquo;
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                Genera HR
              </p>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px' }}>
                Control de asistencia líder en Chile
              </p>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                37 empresas activas en Copilot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — PLANS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>
              Planes simples, sin letra chica
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280' }}>Todos los planes incluyen 7 días gratis. Precios + IVA.</p>
          </div>

          <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, alignItems: 'start' }}>
            {plans.map(function(plan, i) {
              return (
                <div key={i} className={'reveal plan-card' + (plan.popular ? ' popular' : '')}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #4338CA, #7C3AED)', color: 'white', fontSize: 12, fontWeight: 700, padding: '6px 20px', borderRadius: 100, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                      Más elegido
                    </div>
                  )}
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{plan.name}</h3>
                  <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 20px' }}>{plan.desc}</p>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: '#111827' }}>{fmt(plan.price)}</span>
                    <span style={{ fontSize: 15, color: '#9CA3AF', marginLeft: 4 }}>/mes</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                    {plan.features.map(function(f, fi) {
                      return (
                        <li key={fi} style={{ padding: '8px 0', fontSize: 15, color: '#374151', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                          {f}
                        </li>
                      )
                    })}
                  </ul>
                  <button className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', textAlign: 'center' }} onClick={function() { scrollTo('trial') }}>
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — TRIAL FORM */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="trial" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>
              Activa tu <span className="gradient-text">Copilot</span> gratis
            </h2>
            <p style={{ fontSize: 17, color: '#6B7280' }}>7 días sin costo. Configura en 2 minutos.</p>
          </div>

          {enviado ? (
            <div className="reveal" style={{ textAlign: 'center', background: 'white', borderRadius: 20, padding: 48, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u2705'}</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Tu Copilot se est{'a'} preparando</h3>
              <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 20 }}>Revisa tu email — te enviamos tus credenciales de acceso.</p>
              <div style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: 8, padding: '16px 20px', textAlign: 'left', marginBottom: 20 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#92400E', margin: 0 }}>Ma{'n'}ana a las 8:00 AM recibes tu primer an{'a'}lisis</p>
                <p style={{ fontSize: 13, color: '#92400E', margin: '6px 0 0' }}>Esta noche 21 agentes de IA analizan tu competencia, generan contenido y preparan tu reporte. Todo llega a tu correo.</p>
              </div>
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>Si no ves el email, revisa tu carpeta de spam.</p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="reveal" style={{ background: 'white', borderRadius: 20, padding: '40px 36px', border: '1px solid #E5E7EB', boxShadow: '0 8px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email corporativo</label>
                <input type="email" required className="input-field" placeholder="tu@empresa.cl" value={trialEmail} onChange={function(e) { setTrialEmail(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nombre de tu empresa</label>
                <input type="text" required className="input-field" placeholder="Mi Empresa SpA" value={nombreEmpresa} onChange={function(e) { setNombreEmpresa(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Describe tu empresa en 1 l{'í'}nea</label>
                <input type="text" className="input-field" placeholder="Vendemos X a Y en Chile" value={descripcion} onChange={function(e) { setDescripcion(e.target.value) }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Sitio web</label>
                  <input type="text" className="input-field" placeholder="www.tuempresa.cl" value={webCliente} onChange={function(e) { setWebCliente(e.target.value) }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Instagram de tu empresa</label>
                  <input type="text" className="input-field" placeholder="@tuempresa" value={igCliente} onChange={function(e) { setIgCliente(e.target.value) }} />
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Competidores a monitorear</label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <input type="url" className="input-field" placeholder="Instagram o LinkedIn del competidor 1" value={url1} onChange={function(e) { setUrl1(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input type="url" className="input-field" placeholder="Instagram o LinkedIn del competidor 2" value={url2} onChange={function(e) { setUrl2(e.target.value) }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <input type="url" className="input-field" placeholder="Instagram o LinkedIn del competidor 3" value={url3} onChange={function(e) { setUrl3(e.target.value) }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', textAlign: 'center', fontSize: 17, padding: '16px 32px' }} disabled={enviando}>
                {enviando ? 'Activando...' : 'Activar mi Copilot gratis'}
              </button>
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
                Sin tarjeta de crédito · Cancela cuando quieras
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — FOOTER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer style={{ padding: '40px 24px', background: '#111827', textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#9CA3AF', margin: 0 }}>
          M&amp;P Copilot by <a href="https://www.mulleryperez.cl" style={{ color: '#A5B4FC', textDecoration: 'none' }}>Muller y Pérez</a> · mulleryperez.cl
        </p>
      </footer>
    </div>
  )
}
