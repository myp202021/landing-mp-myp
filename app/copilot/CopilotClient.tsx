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
        competidores: [url1, url2, url3].filter(Boolean),
      }),
    })
      .then(function(res) { return res.json() })
      .then(function(data) {
        setEnviando(false)
        setEnviado(true)
        if (data.id) {
          window.location.href = '/copilot/dashboard/' + data.id
        }
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

    function resize() {
      canvas.width = container!.clientWidth
      canvas.height = container!.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    var W = function() { return canvas.width }
    var H = function() { return canvas.height }

    var agentesData = [
      { name: 'Scraping', color: '#f472b6', ring: 0, icon: '\uD83D\uDD0D', desc: 'Extrae posts de Instagram y LinkedIn de la competencia cada semana.', detail: 'Apify + LinkdAPI' },
      { name: 'Memoria', color: '#a78bfa', ring: 0, icon: '\uD83E\uDDE0', desc: 'Recuerda qu\u00e9 funcion\u00f3, qu\u00e9 rechazaste, qu\u00e9 aprob\u00f3 tu equipo.', detail: 'Inteligencia acumulada' },
      { name: 'Brief', color: '#60a5fa', ring: 0, icon: '\uD83C\uDFAF', desc: 'Genera territorios de contenido separados para Instagram y LinkedIn.', detail: 'La base de todo el sistema' },
      { name: 'Copies', color: '#34d399', ring: 0, icon: '\u270D\uFE0F', desc: 'LinkedIn: thought leadership. Instagram: hooks que paran el scroll.', detail: 'Prompts diferentes por red' },
      { name: 'Grilla', color: '#fbbf24', ring: 0, icon: '\uD83D\uDCC5', desc: '16 posts con calendario, plataforma y \u00e1ngulo asignados por c\u00f3digo.', detail: '11 IG + 5 LinkedIn' },
      { name: 'Guiones', color: '#f97316', ring: 0, icon: '\uD83C\uDFAC', desc: 'Scripts de video con storyboard, texto en pantalla y timing.', detail: 'Listos para grabar' },
      { name: 'Auditor\u00eda', color: '#14b8a6', ring: 0, icon: '\uD83D\uDCCA', desc: 'Score separado IG vs LinkedIn con benchmark de tu industria.', detail: 'No mezcla redes' },
      { name: 'Benchmark', color: '#8b5cf6', ring: 0, icon: '\uD83C\uDFC6', desc: 'Cuadro comparativo por competidor: formato, tono, engagement.', detail: 'An\u00e1lisis tipo consultora' },
      { name: '\u00c1rbol', color: '#ec4899', ring: 1, icon: '\uD83C\uDF33', desc: 'Cu\u00e1nto invertir por canal, cu\u00e1ntos leads esperar, 3 escenarios.', detail: 'Predictor M&P con data real' },
      { name: 'Reporte', color: '#06b6d4', ring: 1, icon: '\uD83D\uDCCB', desc: '6 acciones priorizadas por plataforma, hallazgos y predicci\u00f3n.', detail: 'Para decidir, no decorar' },
      { name: 'Ads', color: '#f43f5e', ring: 1, icon: '\uD83C\uDFAF', desc: 'Headlines Google (30 chars) + primary text Meta (125 chars).', detail: 'Google + Meta validados' },
      { name: 'Campa\u00f1a', color: '#84cc16', ring: 1, icon: '\uD83D\uDCE2', desc: 'Estrategia de campa\u00f1a: canales, presupuesto, calendario.', detail: 'Paid media plan' },
      { name: 'Ideas', color: '#a855f7', ring: 1, icon: '\uD83D\uDCA1', desc: 'Detecta gaps vs competencia y oportunidades tem\u00e1ticas.', detail: 'Acumulativo mes a mes' },
      { name: 'Industria', color: '#64748b', ring: 2, icon: '\uD83C\uDFED', desc: '22 industrias con benchmarks Chile: CPC, CVR, ROAS.', detail: 'Data real' },
      { name: 'Decisiones', color: '#94a3b8', ring: 2, icon: '\u2699\uFE0F', desc: 'Decide qu\u00e9 agentes correr seg\u00fan plan y datos.', detail: 'Inteligencia operativa' },
      { name: 'Perfil', color: '#78716c', ring: 2, icon: '\uD83D\uDC64', desc: 'Auto-genera perfil: rubro, competencia, diferenciadores.', detail: 'Desde el d\u00eda 1' },
      { name: 'Lifecycle', color: '#fb923c', ring: 2, icon: '\uD83D\uDCE7', desc: '6 emails con data real del dashboard.', detail: 'Trial \u2192 pagado' },
      { name: 'Validador', color: '#4ade80', ring: 2, icon: '\u2705', desc: 'Verifica que las cuentas IG/LinkedIn existen.', detail: 'Previene errores' },
      { name: 'QA Auditor', color: '#ef4444', ring: 2, icon: '\uD83D\uDEE1\uFE0F', desc: 'Revisa TODOS los entregables y rechaza lo que no cumple.', detail: 'Calidad certificada' },
      { name: 'Aprendizaje', color: '#c084fc', ring: 2, icon: '\uD83D\uDCDA', desc: 'Guarda correcciones del QA para el pr\u00f3ximo run.', detail: 'Autocorrecci\u00f3n' },
      { name: 'LinkedIn API', color: '#0077b5', ring: 2, icon: '\uD83D\uDD17', desc: 'Posts LinkedIn con reacciones y comentarios.', detail: 'LinkdAPI' },
    ]

    var conns = [
      [0,1],[0,2],[0,3],[0,6],[0,7],[1,2],[1,3],[1,4],[1,6],[2,3],[2,4],[2,5],[2,11],
      [3,4],[3,12],[6,9],[6,2],[7,9],[7,8],[8,9],[8,11],[9,19],[13,6],[13,8],[13,7],
      [14,3],[14,5],[15,2],[20,0],[18,19],[18,9],[19,1],[10,11],[16,15],[17,0]
    ]

    var ringCounts = [0, 0, 0]
    agentesData.forEach(function(a) { ringCounts[a.ring]++ })
    var ringIdx = [0, 0, 0]

    var nodes = agentesData.map(function(a) {
      var ring = a.ring
      var idx = ringIdx[ring]++
      var total = ringCounts[ring]
      var angle = (idx / total) * Math.PI * 2 - Math.PI / 2
      return {
        name: a.name, color: a.color, icon: a.icon, ring: ring, desc: a.desc, detail: a.detail,
        baseAngle: angle,
        radius: ring === 0 ? 160 : ring === 1 ? 260 : 340,
        size: ring === 0 ? 22 : ring === 1 ? 17 : 14,
        glowPhase: Math.random() * Math.PI * 2,
        x: 0, y: 0, cz: 0,
      }
    })

    var particles: { fi: number; ti: number; progress: number; speed: number; color: string; size: number }[] = []
    var time = 0
    var hovNode: typeof nodes[0] | null = null
    var selNode: typeof nodes[0] | null = null
    var mx = 0, my = 0

    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left; my = e.clientY - rect.top
      hovNode = null
      for (var i = 0; i < nodes.length; i++) {
        var dx = mx - nodes[i].x, dy = my - nodes[i].y
        if (dx * dx + dy * dy < nodes[i].size * nodes[i].size * 3) { hovNode = nodes[i]; break }
      }
      canvas.style.cursor = hovNode ? 'pointer' : 'default'
    })

    // Spotlight on hover (not click)
    var lastHov = ''
    canvas.addEventListener('mousemove', function(e2: any) {
      var rect2 = canvas.getBoundingClientRect()
      mx = e2.clientX - rect2.left; my = e2.clientY - rect2.top
      hovNode = null
      for (var ii = 0; ii < nodes.length; ii++) {
        var ddx = mx - nodes[ii].x, ddy = my - nodes[ii].y
        if (ddx * ddx + ddy * ddy < nodes[ii].size * nodes[ii].size * 3) { hovNode = nodes[ii]; break }
      }
      canvas.style.cursor = hovNode ? 'pointer' : 'default'

      var spot = document.getElementById('copilot-spotlight')
      if (!spot) return
      if (hovNode) {
        if (hovNode.name !== lastHov) {
          lastHov = hovNode.name
          selNode = hovNode
          spot.querySelector('#copilot-spot-name')!.textContent = hovNode.icon + ' ' + hovNode.name
          spot.querySelector('#copilot-spot-desc')!.textContent = hovNode.desc
          spot.querySelector('#copilot-spot-detail')!.textContent = hovNode.detail
          ;(spot as HTMLElement).style.opacity = '1'
        }
      } else {
        if (lastHov) {
          lastHov = ''
          selNode = null
          ;(spot as HTMLElement).style.opacity = '0'
        }
      }
    })

    function frame() {
      time += 0.016
      var w = W(), h = H()
      ctx!.fillStyle = 'rgba(10, 10, 26, 0.18)'
      ctx!.fillRect(0, 0, w, h)

      var cx = w / 2, cy = h / 2 - 10
      var rot = time * 0.018

      nodes.forEach(function(n) {
        var a = n.baseAngle + rot * (n.ring === 0 ? 1 : n.ring === 1 ? 0.7 : 0.4)
        var p = 1 + Math.sin(a * 0.5) * 0.06
        n.x = cx + Math.cos(a) * n.radius * p
        n.y = cy + Math.sin(a) * n.radius * 0.5 * p
        n.cz = Math.cos(a) * 50
      })

      // Connections
      conns.forEach(function(c) {
        var f = nodes[c[0]], t = nodes[c[1]]
        var active = selNode && (selNode === f || selNode === t)
        var alpha = active ? 0.4 : 0.07
        var mx2 = (f.x + t.x) / 2 + (f.y - t.y) * 0.12
        var my2 = (f.y + t.y) / 2 + (t.x - f.x) * 0.12
        ctx!.beginPath()
        ctx!.moveTo(f.x, f.y)
        ctx!.quadraticCurveTo(mx2, my2, t.x, t.y)
        ctx!.strokeStyle = 'rgba(124,58,237,' + alpha + ')'
        ctx!.lineWidth = active ? 2 : 0.6
        ctx!.stroke()
      })

      // Particles
      if (Math.random() < 0.12) {
        var ci = conns[Math.floor(Math.random() * conns.length)]
        particles.push({ fi: ci[0], ti: ci[1], progress: 0, speed: 0.004 + Math.random() * 0.005, color: nodes[ci[0]].color, size: 1.5 + Math.random() * 1.5 })
      }
      particles = particles.filter(function(p) {
        p.progress += p.speed
        if (p.progress >= 1) return false
        var f = nodes[p.fi], t = nodes[p.ti], tp = p.progress
        var mx2 = (f.x+t.x)/2+(f.y-t.y)*0.12, my2 = (f.y+t.y)/2+(t.x-f.x)*0.12
        var px = (1-tp)*(1-tp)*f.x+2*(1-tp)*tp*mx2+tp*tp*t.x
        var py = (1-tp)*(1-tp)*f.y+2*(1-tp)*tp*my2+tp*tp*t.y
        ctx!.beginPath(); ctx!.arc(px, py, p.size, 0, Math.PI*2)
        ctx!.fillStyle = p.color; ctx!.globalAlpha = 0.6*(1-Math.abs(tp-0.5)*2)
        ctx!.fill(); ctx!.globalAlpha = 1
        return true
      })

      // Nodes
      var sorted = nodes.slice().sort(function(a, b) { return a.cz - b.cz })
      sorted.forEach(function(n) {
        var da = 0.5 + (n.cz + 50) / 100 * 0.5
        var glow = Math.sin(time * 3 + n.glowPhase) * 0.3 + 0.7
        var act = hovNode === n || selNode === n
        var sz = n.size * (act ? 1.4 : 1) * (0.85 + da * 0.15)

        var gr = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, sz * (act ? 3.5 : 2.2))
        gr.addColorStop(0, n.color + (act ? '70' : '18'))
        gr.addColorStop(1, n.color + '00')
        ctx!.beginPath(); ctx!.arc(n.x, n.y, sz * (act ? 3.5 : 2.2), 0, Math.PI * 2)
        ctx!.fillStyle = gr; ctx!.fill()

        ctx!.beginPath(); ctx!.arc(n.x, n.y, sz, 0, Math.PI * 2)
        ctx!.fillStyle = n.color + (act ? 'ff' : Math.round(da * glow * 180).toString(16).padStart(2, '0'))
        ctx!.fill()
        ctx!.strokeStyle = n.color + (act ? 'ff' : '60')
        ctx!.lineWidth = act ? 2.5 : 0.8
        ctx!.stroke()

        ctx!.font = Math.round(sz * 0.85) + 'px serif'
        ctx!.textAlign = 'center'; ctx!.textBaseline = 'middle'
        ctx!.fillText(n.icon, n.x, n.y)

        var fs = act ? 12 : n.ring === 0 ? 11 : 9
        ctx!.font = (act ? 'bold ' : '') + fs + 'px Inter,sans-serif'
        ctx!.fillStyle = 'rgba(255,255,255,' + (act ? 1 : da * (n.ring === 0 ? 0.75 : 0.5)) + ')'
        ctx!.fillText(n.name, n.x, n.y + sz + 12)
      })

      requestAnimationFrame(frame)
    }
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

          {/* Canvas container */}
          <div style={{ position: 'relative', height: 520 }}>
            <canvas ref={function(el) { if (el && !(el as any)._copilotInit) { (el as any)._copilotInit = true; initAgentCanvas(el) } }} style={{ width: '100%', height: '100%', display: 'block' }} />
            {/* Spotlight info (click) */}
            <div id="copilot-spotlight" style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: 550, maxWidth: '90%', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.5s ease' }}>
              <div id="copilot-spot-name" style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></div>
              <div id="copilot-spot-desc" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginTop: 6 }}></div>
              <div id="copilot-spot-detail" style={{ fontSize: 12, color: 'rgba(124,58,237,0.8)', fontWeight: 600, marginTop: 6 }}></div>
            </div>
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
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Copilot activado</h3>
              <p style={{ fontSize: 16, color: '#6B7280' }}>Revisa tu email para los próximos pasos.</p>
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
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Describe tu empresa en 1 línea</label>
                <input type="text" className="input-field" placeholder="Vendemos X a Y en Chile" value={descripcion} onChange={function(e) { setDescripcion(e.target.value) }} />
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
