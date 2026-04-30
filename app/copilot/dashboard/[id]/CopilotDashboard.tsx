'use client'

import React, { useState, useEffect } from 'react'

var SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ'

function hdrs() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' }
}

function engagementBadge(likes: number, comments: number) {
  var total = likes + comments
  if (total >= 100) return { label: 'Alto', color: 'bg-green-900/30 text-green-400 border-green-700/50' }
  if (total >= 30) return { label: 'Medio', color: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50' }
  return { label: 'Bajo', color: 'bg-white/5 text-[#94a3b8] border-white/10' }
}

var TEMAS_CONFIG = [
  { kw: ['oferta', 'descuento', 'promo', 'precio', 'gratis', 'cupon'], label: 'promocional' },
  { kw: ['equipo', 'team', 'cultura', 'oficina', 'trabajo', 'detras', 'behind'], label: 'cultura empresarial' },
  { kw: ['tip', 'consejo', 'aprende', 'sab\u00edas', 'dato', 'guia', 'paso', 'como', 'error'], label: 'educativo' },
  { kw: ['nuevo', 'lanzamiento', 'nueva', 'novedad', 'presenta', 'llega'], label: 'lanzamientos' },
  { kw: ['cliente', 'testimonio', 'caso', 'resultado', 'logro', 'exito'], label: 'casos de \u00e9xito' },
  { kw: ['evento', 'webinar', 'charla', 'conferencia', 'summit'], label: 'eventos' },
  { kw: ['tendencia', 'trend', 'innovacion', 'futuro', 'ia', 'inteligencia artificial'], label: 'tendencias' },
]

function detectarTema(texto: string) {
  var textoLower = texto.toLowerCase()
  var mejor = { label: 'general', score: 0 }
  TEMAS_CONFIG.forEach(function(tema) {
    var score = 0
    tema.kw.forEach(function(k) { if (textoLower.includes(k)) score++ })
    if (score > mejor.score) { mejor = { label: tema.label, score: score } }
  })
  return mejor.label
}

function detectarFormato(tipo: string) {
  var t = (tipo || '').toLowerCase()
  if (t.includes('video') || t.includes('reel')) return 'video/reel'
  if (t.includes('sidecar') || t.includes('carousel') || t.includes('carrusel')) return 'carrusel'
  return 'imagen'
}

// Benchmarks de engagement por industria (referencia para contextualizar datos)
var INDUSTRY_BENCHMARKS: Record<string, { engPerPost: number, postsPerMonth: number, label: string }> = {
  'maquinaria': { engPerPost: 35, postsPerMonth: 12, label: 'Maquinaria Industrial' },
  'inmobiliaria': { engPerPost: 45, postsPerMonth: 16, label: 'Inmobiliaria' },
  'tecnolog': { engPerPost: 55, postsPerMonth: 14, label: 'Tecnolog\u00eda' },
  'salud': { engPerPost: 65, postsPerMonth: 12, label: 'Salud' },
  'educaci': { engPerPost: 50, postsPerMonth: 15, label: 'Educaci\u00f3n' },
  'gastrono': { engPerPost: 80, postsPerMonth: 18, label: 'Gastronom\u00eda' },
  'retail': { engPerPost: 40, postsPerMonth: 20, label: 'Retail' },
  'turismo': { engPerPost: 70, postsPerMonth: 12, label: 'Turismo' },
  'constru': { engPerPost: 30, postsPerMonth: 10, label: 'Construcci\u00f3n' },
  'transport': { engPerPost: 25, postsPerMonth: 8, label: 'Transporte' },
  'default': { engPerPost: 40, postsPerMonth: 12, label: 'Promedio Chile' },
}

function getIndustryBenchmark(rubro: string) {
  var r = (rubro || '').toLowerCase()
  var keys = Object.keys(INDUSTRY_BENCHMARKS)
  for (var i = 0; i < keys.length; i++) {
    if (r.includes(keys[i])) return INDUSTRY_BENCHMARKS[keys[i]]
  }
  return INDUSTRY_BENCHMARKS['default']
}

function explainMetric(value: number, benchmark: number, label: string, unit: string) {
  var diff = Math.round(((value - benchmark) / benchmark) * 100)
  var emoji = diff >= 20 ? '\u2705' : diff >= -10 ? '\u26A0\uFE0F' : '\u274C'
  var comparacion = diff > 0 ? diff + '% sobre' : Math.abs(diff) + '% bajo'
  return { emoji: emoji, texto: value + ' ' + unit + ' (' + comparacion + ' promedio industria de ' + benchmark + ')', diff: diff }
}

function generateCompanyAnalysis(nombre: string, data: { ig: number, li: number, likes: number, comments: number }, companyPosts: any[]) {
  var totalPosts = data.ig + data.li
  if (totalPosts === 0) return { resumen: nombre + ': sin actividad en este per\u00edodo. Esto puede indicar pausa estrat\u00e9gica o problemas operativos.', topPost: null, tema: '', formato: '', gap: '', avgEng: 0, frecuencia: 0, diasActivos: '' }

  var avgEng = Math.round((data.likes + data.comments) / totalPosts)

  // Find top post
  var sorted = companyPosts.slice().sort(function(a: any, b: any) {
    return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
  })
  var topPost = sorted[0] || null
  var topEng = topPost ? ((topPost.likes || 0) + (topPost.comments || 0)) : 0
  var topTema = topPost ? detectarTema(topPost.texto || '') : ''
  var topTexto = topPost ? (topPost.texto || '').substring(0, 80) : ''

  // Detect dominant format
  var formatos: Record<string, number> = {}
  companyPosts.forEach(function(p: any) {
    var f = detectarFormato(p.tipo_post || p.type || '')
    formatos[f] = (formatos[f] || 0) + 1
  })
  var formatoDominante = ''
  var maxFormato = 0
  Object.keys(formatos).forEach(function(f) {
    if (formatos[f] > maxFormato) { maxFormato = formatos[f]; formatoDominante = f }
  })

  // Detect dominant theme
  var temasCount: Record<string, number> = {}
  companyPosts.forEach(function(p: any) {
    var t = detectarTema(p.texto || '')
    temasCount[t] = (temasCount[t] || 0) + 1
  })
  var temaDominante = ''
  var maxTema = 0
  Object.keys(temasCount).forEach(function(t) {
    if (temasCount[t] > maxTema && t !== 'general') { maxTema = temasCount[t]; temaDominante = t }
  })

  // Detect posting days pattern
  var dias: Record<string, number> = {}
  companyPosts.forEach(function(p: any) {
    var fecha = p.fecha_post || p.fecha_scrape || ''
    if (fecha) {
      var d = new Date(fecha)
      var diasNombres = ['dom', 'lun', 'mar', 'mi\u00e9', 'jue', 'vie', 's\u00e1b']
      var dia = diasNombres[d.getDay()] || ''
      if (dia) dias[dia] = (dias[dia] || 0) + 1
    }
  })
  var diasActivos = Object.keys(dias).sort(function(a, b) { return dias[b] - dias[a] }).slice(0, 3).join(', ')

  var resumen = nombre + ': ' + totalPosts + ' posts'
  if (topPost) {
    resumen += '. Top post: "' + topTexto + '..." (' + topEng + ' eng, ' + topTema + ')'
  }
  resumen += '. Formato dominante: ' + (formatoDominante || 'variado') + '.'
  if (temaDominante) resumen += ' Enfoque: ' + temaDominante + '.'
  if (diasActivos) resumen += ' Publica m\u00e1s: ' + diasActivos + '.'
  resumen += ' Promedio: ' + avgEng + ' eng/post.'

  return {
    resumen: resumen,
    topPost: topPost,
    topPostEng: topEng,
    topTema: topTema,
    topTexto: topTexto,
    tema: temaDominante,
    formato: formatoDominante,
    frecuencia: totalPosts,
    avgEng: avgEng,
    diasActivos: diasActivos,
    gap: '',
  }
}

function generateExecutiveSummary(posts: any[], empresas: Record<string, any>, postsByCompany: Record<string, any[]>, copies: any[], auditorias: any[], mesReporte: number, anio: number) {
  var MESES = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  var nombreMes = MESES[mesReporte] || ''
  var totalPosts = posts.length
  var totalEng = posts.reduce(function(s: number, p: any) { return s + (p.likes || 0) + (p.comments || 0) }, 0)

  if (totalPosts === 0) return 'Copilot est\u00e1 preparando tu primer an\u00e1lisis de competencia. En las pr\u00f3ximas horas tendr\u00e1s datos de engagement, formatos y temas de tus competidores comparados con tu industria.'

  // Find most active competitor
  var maxPosts = 0; var masActivo = ''
  var maxEng = 0; var masEngagement = ''
  Object.keys(empresas).forEach(function(n) {
    var t = empresas[n].ig + empresas[n].li
    var e = empresas[n].likes + empresas[n].comments
    if (t > maxPosts) { maxPosts = t; masActivo = n }
    if (e > maxEng) { maxEng = e; masEngagement = n }
  })

  // Find top post overall
  var topGlobal = posts.slice().sort(function(a: any, b: any) {
    return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
  })[0]
  var topTemaGlobal = topGlobal ? detectarTema(topGlobal.texto || '') : ''
  var topEngGlobal = topGlobal ? ((topGlobal.likes || 0) + (topGlobal.comments || 0)) : 0

  // Detect which themes are NOT covered (gaps)
  var temasDetectados = new Set() as Set<string>
  posts.forEach(function(p: any) { temasDetectados.add(detectarTema(p.texto || '')) })
  var temasNoUsados = ['educativo', 'casos de \u00e9xito', 'tendencias', 'cultura empresarial'].filter(function(t) { return !temasDetectados.has(t) })

  // Average engagement
  var avgEng = Math.round(totalEng / totalPosts)

  // Build summary with CONTEXT (explain + compare + action)
  var parts = []
  parts.push('En ' + nombreMes + ' ' + anio + ', ' + Object.keys(empresas).length + ' competidores publicaron ' + totalPosts + ' posts con un promedio de ' + avgEng + ' interacciones por post (engagement = likes + comentarios que recibe cada publicaci\u00f3n).')

  if (masActivo) {
    parts.push(masActivo + ' fue el m\u00e1s activo con ' + maxPosts + ' posts')
    if (masEngagement && masEngagement !== masActivo) {
      parts.push(', pero ' + masEngagement + ' tuvo mejor engagement por post, lo que indica contenido de mayor calidad aunque publique menos.')
    } else {
      parts.push(' y tambi\u00e9n en engagement.')
    }
  }

  if (topGlobal) {
    parts.push(' El post estrella fue de ' + (topGlobal.nombre_empresa || topGlobal.handle) + ' sobre ' + topTemaGlobal + ' con ' + topEngGlobal + ' eng.')
  }

  if (temasNoUsados.length > 0) {
    parts.push(' Gap detectado: ning\u00fan competidor cubre ' + temasNoUsados.join(' ni ') + ' \u2014 oportunidad para diferenciarse.')
  }

  return parts.join('')
}

function generateStrategicActions(posts: any[], empresas: Record<string, any>, postsByCompany: Record<string, any[]>, copies: any[], auditorias: any[]) {
  var acciones = [] as { texto: string, prioridad: string }[]

  if (posts.length === 0) {
    return [{ texto: 'Esperar acumulaci\u00f3n de datos de competencia para generar acciones.', prioridad: 'media' }]
  }

  // Find top post and its characteristics
  var topPost = posts.slice().sort(function(a: any, b: any) {
    return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
  })[0]
  var topTema = topPost ? detectarTema(topPost.texto || '') : ''
  var topEng = topPost ? ((topPost.likes || 0) + (topPost.comments || 0)) : 0
  var topEmpresa = topPost ? (topPost.nombre_empresa || topPost.handle) : ''
  var topFormato = topPost ? detectarFormato(topPost.tipo_post || topPost.type || '') : ''

  // Action 1: Replicate top performing content
  if (topPost) {
    acciones.push({
      texto: 'Crear ' + topFormato + ' sobre ' + topTema + ' \u2014 ' + topEmpresa + ' obtuvo ' + topEng + ' eng con este formato. Tomar el mismo tema pero con el angulo diferenciador del cliente.',
      prioridad: 'alta',
    })
  }

  // Action 2: Frequency analysis
  var avgFreq = posts.length / Math.max(Object.keys(empresas).length, 1)
  var maxFreq = 0; var maxFreqEmpresa = ''
  Object.keys(empresas).forEach(function(n) {
    var t = empresas[n].ig + empresas[n].li
    if (t > maxFreq) { maxFreq = t; maxFreqEmpresa = n }
  })
  if (maxFreqEmpresa) {
    acciones.push({
      texto: 'Igualar frecuencia de ' + maxFreqEmpresa + ' (' + maxFreq + ' posts en el per\u00edodo, promedio competencia: ' + Math.round(avgFreq) + '). Si el cliente publica menos, pierde share of voice.',
      prioridad: 'alta',
    })
  }

  // Action 3: Detect format gaps
  var formatosCompetencia = new Set() as Set<string>
  posts.forEach(function(p: any) { formatosCompetencia.add(detectarFormato(p.tipo_post || p.type || '')) })
  var formatosSugeridos = ['video/reel', 'carrusel', 'imagen'].filter(function(f) { return !formatosCompetencia.has(f) })
  if (formatosSugeridos.length > 0) {
    acciones.push({
      texto: 'Probar formato ' + formatosSugeridos[0] + ' \u2014 ning\u00fan competidor lo est\u00e1 usando. Oportunidad de capturar atenci\u00f3n con formato diferenciado.',
      prioridad: 'media',
    })
  }

  // Action 4: Detect theme gaps
  var temasCompetencia = new Set() as Set<string>
  posts.forEach(function(p: any) { temasCompetencia.add(detectarTema(p.texto || '')) })
  var temasNoUsados = ['educativo', 'casos de \u00e9xito', 'tendencias', 'cultura empresarial'].filter(function(t) { return !temasCompetencia.has(t) })
  if (temasNoUsados.length > 0) {
    acciones.push({
      texto: 'Cubrir "' + temasNoUsados[0] + '" \u2014 ning\u00fan competidor lo aborda. Primera marca en publicar captura la audiencia interesada.',
      prioridad: 'media',
    })
  }

  // Action 5: Publish pending copies
  var totalCopies = copies.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
  if (totalCopies > 0) {
    acciones.push({
      texto: 'Publicar los ' + totalCopies + ' copies generados \u2014 ya est\u00e1n basados en inteligencia competitiva y listos para usar.',
      prioridad: 'alta',
    })
  }

  // Action 6: Audit improvements
  var latestAud = auditorias.length > 0 ? auditorias[0] : null
  if (latestAud && latestAud.criterios) {
    var peorCriterio = { nombre: '', score: 11 }
    ;(latestAud.criterios || []).forEach(function(raw: any, i: number) {
      var val = typeof raw === 'object' ? (raw.score || 0) : (raw || 0)
      var nombre = typeof raw === 'object' && raw.nombre ? raw.nombre : ('Criterio ' + (i + 1))
      if (val < peorCriterio.score) { peorCriterio = { nombre: nombre, score: val } }
    })
    if (peorCriterio.score <= 6) {
      acciones.push({
        texto: 'Priorizar mejora en "' + peorCriterio.nombre + '" (score ' + peorCriterio.score + '/10) \u2014 \u00e1rea m\u00e1s d\u00e9bil seg\u00fan la auditor\u00eda.',
        prioridad: peorCriterio.score <= 4 ? 'alta' : 'media',
      })
    }
  }

  return acciones
}

function criterioRecommendation(score: number) {
  if (score <= 5) return 'Necesita atenci\u00f3n urgente'
  if (score <= 7) return 'Puede mejorar con esfuerzo moderado'
  return 'Buen nivel, mantener'
}

function criterioRecommendationColor(score: number) {
  if (score <= 5) return 'text-red-400'
  if (score <= 7) return 'text-yellow-400'
  return 'text-green-400'
}

export default function CopilotDashboard(props: { suscripcionId: string }) {
  var [sub, setSub] = useState(null as any)
  var [posts, setPosts] = useState([] as any[])
  var [contenido, setContenido] = useState([] as any[])
  var [auditorias, setAuditorias] = useState([] as any[])
  var [guiones, setGuiones] = useState([] as any[])
  var [ideas, setIdeas] = useState([] as any[])
  var [benchmarks, setBenchmarks] = useState([] as any[])
  var [adsCreativos, setAdsCreativos] = useState([] as any[])
  var [arboles, setArboles] = useState([] as any[])
  var [reportes, setReportes] = useState([] as any[])
  var [aprendizajes, setAprendizajes] = useState([] as any[])
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')
  var [periodo, setPeriodo] = useState('7d')
  var [tab, setTab] = useState('competencia')
  // SELECTOR GLOBAL DE MES — uno solo para TODOS los tabs
  var [mesGlobal, setMesGlobal] = useState(new Date().getMonth() + 1) // mes actual
  var [anioGlobal, setAnioGlobal] = useState(new Date().getFullYear())
  var [ideaForm, setIdeaForm] = useState(false)
  var [ideaTitulo, setIdeaTitulo] = useState('')
  var [ideaDesc, setIdeaDesc] = useState('')
  var [ideaCat, setIdeaCat] = useState('educativo')
  var [ideaPri, setIdeaPri] = useState('media')
  var [ideaSaving, setIdeaSaving] = useState(false)
  var [ideaFiltroCategoria, setIdeaFiltroCategoria] = useState('todas')
  var [ideaFiltroEstado, setIdeaFiltroEstado] = useState('todos')
  var [copiedIndex, setCopiedIndex] = useState(null as string | null)
  var [briefEditMode, setBriefEditMode] = useState(false)
  var [briefSaving, setBriefSaving] = useState(false)

  useEffect(function() { loadData() }, [periodo])

  // Inicializar mesGlobal al mes con más datos disponibles
  useEffect(function() {
    var mesesConDatos = new Set() as Set<number>
    contenido.forEach(function(c: any) { if (c.mes) mesesConDatos.add(c.mes) })
    auditorias.forEach(function(a: any) { if (a.mes) mesesConDatos.add(a.mes) })
    guiones.forEach(function(g: any) { if (g.mes) mesesConDatos.add(g.mes) })
    if (mesesConDatos.size > 0) {
      var meses = Array.from(mesesConDatos).sort(function(a, b) { return b - a })
      setMesGlobal(meses[0])
    }
  }, [contenido, auditorias, guiones])

  async function loadData() {
    setLoading(true)
    try {
      var r1 = await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId + '&select=*', { headers: hdrs() })
      var subs = await r1.json()
      if (!subs || subs.length === 0) { setError('Suscripci\u00f3n no encontrada'); setLoading(false); return }
      setSub(subs[0])

      var dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
      var desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      var r2 = await fetch(SUPABASE_URL + '/rest/v1/radar_posts?suscripcion_id=eq.' + props.suscripcionId + '&fecha_scrape=gte.' + desde + '&select=*&order=fecha_scrape.desc', { headers: hdrs() })
      var data = await r2.json()
      setPosts(Array.isArray(data) ? data : [])

      var r3 = await fetch(SUPABASE_URL + '/rest/v1/radar_contenido?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
      var cData = await r3.json()
      setContenido(Array.isArray(cData) ? cData : [])

      var r4 = await fetch(SUPABASE_URL + '/rest/v1/copilot_auditorias?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
      var aData = await r4.json()
      setAuditorias(Array.isArray(aData) ? aData : [])

      var r5 = await fetch(SUPABASE_URL + '/rest/v1/copilot_guiones?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
      var gData = await r5.json()
      setGuiones(Array.isArray(gData) ? gData : [])

      var r6 = await fetch(SUPABASE_URL + '/rest/v1/copilot_ideas?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
      var iData = await r6.json()
      setIdeas(Array.isArray(iData) ? iData : [])

      var r7 = await fetch(SUPABASE_URL + '/rest/v1/copilot_benchmarks?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
      var bData = await r7.json()
      setBenchmarks(Array.isArray(bData) ? bData : [])

      // Nuevas tablas Copilot
      try {
        var r8 = await fetch(SUPABASE_URL + '/rest/v1/copilot_ads_creativos?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
        var adsData = await r8.json()
        setAdsCreativos(Array.isArray(adsData) ? adsData : [])
      } catch (e) { /* tabla puede no existir */ }

      try {
        var r9 = await fetch(SUPABASE_URL + '/rest/v1/copilot_arboles?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
        var arbolesData = await r9.json()
        setArboles(Array.isArray(arbolesData) ? arbolesData : [])
      } catch (e) {}

      try {
        var r11 = await fetch(SUPABASE_URL + '/rest/v1/copilot_reportes?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
        var repData = await r11.json()
        setReportes(Array.isArray(repData) ? repData : [])
      } catch (e) {}

      try {
        var r10 = await fetch(SUPABASE_URL + '/rest/v1/copilot_aprendizajes?suscripcion_id=eq.' + props.suscripcionId + '&activo=eq.true&select=*&order=confianza.desc&limit=20', { headers: hdrs() })
        var apData = await r10.json()
        setAprendizajes(Array.isArray(apData) ? apData : [])
      } catch (e) { /* tabla puede no existir */ }
    } catch (e) { setError('Error cargando datos') }
    setLoading(false)
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(function() {
      setCopiedIndex(key)
      setTimeout(function() { setCopiedIndex(null) }, 2000)
    })
  }

  var [feedbackSending, setFeedbackSending] = useState('')
  var [feedbackSent, setFeedbackSent] = useState('')

  async function enviarFeedback(tipo: string, feedback: string, accion: string, itemId?: string) {
    setFeedbackSending(itemId || tipo)
    try {
      await fetch('/api/copilot/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suscripcion_id: props.suscripcionId,
          tipo: tipo,
          feedback: feedback,
          accion: accion,
          item_id: itemId,
        }),
      })
      setFeedbackSent(itemId || tipo)
      setTimeout(function() { setFeedbackSent('') }, 3000)
      // Recargar aprendizajes
      try {
        var r = await fetch(SUPABASE_URL + '/rest/v1/copilot_aprendizajes?suscripcion_id=eq.' + props.suscripcionId + '&activo=eq.true&select=*&order=confianza.desc&limit=20', { headers: hdrs() })
        var data = await r.json()
        setAprendizajes(Array.isArray(data) ? data : [])
      } catch (e) {}
    } catch (e) {
      console.error('Feedback error:', e)
    }
    setFeedbackSending('')
  }

  if (error) return (
    <div className="min-h-screen bg-[#0F0D2E] flex items-center justify-center">
      <div className="text-center"><p className="text-xl font-bold text-white mb-2">M&P Copilot</p><p className="text-[#94a3b8]">{error}</p></div>
    </div>
  )

  if (loading || !sub) return (
    <div className="min-h-screen bg-[#0F0D2E] flex items-center justify-center">
      <p className="text-[#64748b]">Cargando tu Copilot...</p>
    </div>
  )

  var cuentas = (sub.cuentas || []).filter(function(c: any) { return c.red !== 'prensa' })
  var empresas = {} as Record<string, { ig: number, li: number, likes: number, comments: number }>
  cuentas.forEach(function(c: any) {
    if (c.nombre && !empresas[c.nombre]) empresas[c.nombre] = { ig: 0, li: 0, likes: 0, comments: 0 }
  })
  posts.forEach(function(p: any) {
    var nombre = p.nombre_empresa || p.handle
    if (!empresas[nombre]) empresas[nombre] = { ig: 0, li: 0, likes: 0, comments: 0 }
    if (p.red === 'Instagram') empresas[nombre].ig++
    else if (p.red === 'LinkedIn') empresas[nombre].li++
    empresas[nombre].likes += (p.likes || 0)
    empresas[nombre].comments += (p.comments || 0)
  })

  // Posts by company for insight generation
  var postsByCompany = {} as Record<string, any[]>
  posts.forEach(function(p: any) {
    var nombre = p.nombre_empresa || p.handle
    if (!postsByCompany[nombre]) postsByCompany[nombre] = []
    postsByCompany[nombre].push(p)
  })

  var totalPosts = posts.length
  var totalLikes = posts.reduce(function(s: number, p: any) { return s + (p.likes || 0) }, 0)
  var totalComments = posts.reduce(function(s: number, p: any) { return s + (p.comments || 0) }, 0)

  // Sort posts by engagement (likes+comments DESC) for top posts
  var postsSortedByEngagement = posts.slice().sort(function(a: any, b: any) {
    return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
  })

  // Only show IG-related redes count (LI disabled)
  var redesConDatos = new Set(posts.filter(function(p: any) { return p.red === 'Instagram' }).map(function(p: any) { return p.red }))

  var porDia = {} as Record<string, number>
  posts.forEach(function(p: any) {
    var d = (p.fecha_scrape || '').substring(0, 10)
    if (d) porDia[d] = (porDia[d] || 0) + 1
  })
  var diasOrdenados = Object.keys(porDia).sort()
  var maxPostsDia = Math.max(1, Math.max.apply(null, Object.values(porDia).concat([1])))

  var grillas = contenido.filter(function(c: any) { return c.tipo === 'grilla' })
  var copies = contenido.filter(function(c: any) { return c.tipo === 'copy' })
  var grillasMes = grillas.filter(function(c: any) { return c.mes === mesGlobal })
  var copiesMes = copies.filter(function(c: any) { return c.mes === mesGlobal })

  var totalCopies = copies.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
  var totalGrillaPosts = grillas.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)

  var MESES_NOMBRES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="min-h-screen bg-[#0F0D2E]">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs opacity-60 tracking-widest mb-2">M&P COPILOT</p>
            <h1 className="text-2xl font-bold mb-1">Tu Copilot</h1>
            <p className="text-sm opacity-80">{sub.nombre || sub.email} | Plan {sub.plan} | {cuentas.length} cuentas</p>
          </div>
          <a href={'/copilot/configurar/' + props.suscripcionId} className="bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-white/30 transition">Configurar</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* ONBOARDING — si no tiene data entry completado */}
        {sub && !(sub.perfil_empresa || {}).presupuesto_mensual && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{'\uD83D\uDC4B'}</div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Completa los datos de tu negocio para mejores resultados</h3>
                <p className="text-xs text-[#94a3b8] mb-3">Copilot usa tu presupuesto, ticket promedio y tipo de cliente para generar un {'a'}rbol de inversi{'o'}n con escenarios reales y recomendaciones m{'a'}s precisas.</p>
                <button onClick={function() { setTab('brief') }} className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Completar datos {'\u2192'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-[#12102a] rounded-xl p-1 overflow-x-auto">
          {[
            { key: 'competencia', label: 'Competencia', icon: '\uD83D\uDD0D', color: 'text-indigo-700' },
            { key: 'brief', label: 'Brief', icon: '\uD83C\uDFAF', color: 'text-cyan-700' },
            { key: 'contenido', label: 'Contenido', icon: '\u270D\uFE0F', color: 'text-purple-700' },
            { key: 'auditoria', label: 'Auditor\u00EDa', icon: '\uD83D\uDCCA', color: 'text-teal-700' },
            { key: 'guiones', label: 'Guiones', icon: '\uD83C\uDFAC', color: 'text-pink-700' },
            { key: 'benchmark', label: 'Benchmark', icon: '\uD83C\uDFC6', color: 'text-orange-700' },
            { key: 'ads', label: 'Ads', icon: '\uD83C\uDFAF', color: 'text-rose-700' },
            { key: 'arbol', label: '\u00C1rbol', icon: '\uD83C\uDF33', color: 'text-lime-700' },
            { key: 'ideas', label: 'Ideas', icon: '\uD83D\uDCA1', color: 'text-amber-700' },
            { key: 'reporte', label: 'Reporte', icon: '\uD83D\uDCCB', color: 'text-emerald-700' },
          ].map(function(t) {
            return <button key={t.key} onClick={function() { setTab(t.key) }} className={'flex-shrink-0 flex-1 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap px-3 ' + (tab === t.key ? 'bg-[#1a1745] ' + t.color + ' shadow-sm' : 'text-[#64748b] hover:text-[#c4b5fd]')}>
              <span className="mr-1">{t.icon}</span> {t.label}
            </button>
          })}
        </div>

        {/* SELECTOR GLOBAL DE MES — aplica a TODOS los tabs */}
        {tab !== 'brief' && (function() {
          var mesesConDatos = new Set() as Set<number>
          contenido.forEach(function(c: any) { if (c.mes) mesesConDatos.add(c.mes) })
          auditorias.forEach(function(a: any) { if (a.mes) mesesConDatos.add(a.mes) })
          guiones.forEach(function(g: any) { if (g.mes) mesesConDatos.add(g.mes) })
          // Agregar mes actual si tiene posts
          if (posts.length > 0) mesesConDatos.add(new Date().getMonth() + 1)
          var mesesArr = Array.from(mesesConDatos).sort()
          if (mesesArr.length === 0) mesesArr = [new Date().getMonth() + 1]

          return <div className="flex gap-2 mb-4 flex-wrap items-center">
            <span className="text-xs text-[#64748b] mr-1">Mes:</span>
            {mesesArr.map(function(m) {
              return <button key={m} onClick={function() { setMesGlobal(m) }}
                className={'px-3 py-1.5 rounded-lg text-xs font-semibold transition ' + (mesGlobal === m ? 'bg-indigo-600 text-white' : 'bg-[#1a1745] text-[#a5b4fc] border border-white/[0.06] hover:border-indigo-400')}>
                {MESES_NOMBRES[m]}
              </button>
            })}
          </div>
        })()}

        {/* TAB: BRIEF ESTRATÉGICO */}
        {tab === 'brief' && (function() {
          var brief = sub && sub.perfil_empresa && sub.perfil_empresa.brief ? sub.perfil_empresa.brief : null
          if (!brief) return <div className="bg-[#1a1745] rounded-xl p-8 border border-white/[0.06] text-center">
            <p className="text-4xl mb-4">{'\uD83C\uDFAF'}</p>
            <p className="text-[#c4b5fd] font-semibold text-lg mb-2">Brief estrat{'\u00e9'}gico pendiente</p>
            <p className="text-[#64748b] text-sm mb-3">Tu brief estrat{'e'}gico se genera autom{'a'}ticamente con el primer an{'a'}lisis. Mientras tanto, completa los datos de tu negocio arriba para que Copilot entienda mejor tu mercado.</p>
            <p className="text-[#475569] text-xs">El brief incluye: propuesta de valor {'u'}nica, territorios de contenido, an{'a'}lisis de competidores, tono de comunicaci{'o'}n y reglas de contenido. Es la base de TODO lo que genera Copilot.</p>
          </div>

          async function guardarBrief(updatedBrief: any) {
            setBriefSaving(true)
            try {
              var perfilActual = sub.perfil_empresa || {}
              perfilActual.brief = updatedBrief
              await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId, {
                method: 'PATCH',
                headers: hdrs(),
                body: JSON.stringify({ perfil_empresa: perfilActual }),
              })
              setSub(Object.assign({}, sub, { perfil_empresa: perfilActual }))
              setBriefEditMode(false)
            } catch (e) { alert('Error guardando brief') }
            setBriefSaving(false)
          }

          // Data entry handler
          async function guardarDataEntry(campo: string, valor: any) {
            var perfilActual = sub.perfil_empresa || {}
            perfilActual[campo] = valor
            await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId, {
              method: 'PATCH', headers: hdrs(), body: JSON.stringify({ perfil_empresa: perfilActual }),
            })
            setSub(Object.assign({}, sub, { perfil_empresa: perfilActual }))
          }

          var perfil = sub.perfil_empresa || {}

          return <>
            {/* DATA ENTRY — Datos del negocio */}
            <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-5 mb-4">
              <h3 className="text-sm font-bold text-indigo-400 mb-3">Datos de tu negocio (alimentan el predictor y el {'\u00e1'}rbol de decisi{'ó'}n)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Presupuesto mensual pauta</label>
                  <input type="number" defaultValue={perfil.presupuesto_mensual || ''} placeholder="ej: 500000"
                    onBlur={function(e) { if (e.target.value) guardarDataEntry('presupuesto_mensual', parseInt(e.target.value)) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Ticket promedio (CLP)</label>
                  <input type="number" defaultValue={perfil.ticket_promedio || ''} placeholder="ej: 500000"
                    onBlur={function(e) { if (e.target.value) guardarDataEntry('ticket_promedio', parseInt(e.target.value)) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Tasa cierre (%)</label>
                  <input type="number" defaultValue={perfil.tasa_cierre || ''} placeholder="ej: 5" step="0.5"
                    onBlur={function(e) { if (e.target.value) guardarDataEntry('tasa_cierre', parseFloat(e.target.value)) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Tipo cliente</label>
                  <select defaultValue={perfil.tipo_cliente || 'B2C'}
                    onChange={function(e) { guardarDataEntry('tipo_cliente', e.target.value) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none">
                    <option value="B2C">B2C</option>
                    <option value="B2B">B2B</option>
                    <option value="B2B2C">B2B2C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Ciclo de venta</label>
                  <select defaultValue={perfil.ciclo_venta || 'UNO_A_TRES_MESES'}
                    onChange={function(e) { guardarDataEntry('ciclo_venta', e.target.value) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none">
                    <option value="INSTANTANEO">Instant{'á'}neo</option>
                    <option value="MENOS_1_MES">Menos de 1 mes</option>
                    <option value="UNO_A_TRES_MESES">1 a 3 meses</option>
                    <option value="MAS_3_MESES">M{'á'}s de 3 meses</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Foco geogr{'á'}fico</label>
                  <select defaultValue={perfil.geo || 'NACIONAL'}
                    onChange={function(e) { guardarDataEntry('geo', e.target.value) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none">
                    <option value="SANTIAGO">Santiago</option>
                    <option value="REGIONES">Regiones</option>
                    <option value="NACIONAL">Nacional</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Competencia (1-10)</label>
                  <input type="number" min="1" max="10" defaultValue={perfil.competencia_percibida || 5}
                    onBlur={function(e) { guardarDataEntry('competencia_percibida', parseInt(e.target.value)) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-[#64748b] block mb-1">Madurez digital</label>
                  <select defaultValue={perfil.madurez_digital || 'INTERMEDIO'}
                    onChange={function(e) { guardarDataEntry('madurez_digital', e.target.value) }}
                    className="w-full bg-[#0f0d2e] text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-indigo-500 outline-none">
                    <option value="PRINCIPIANTE">Principiante</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-[#475569] mt-2">Estos datos se guardan autom{'á'}ticamente y alimentan el predictor, el {'á'}rbol de decisi{'ó'}n y el brief estrat{'é'}gico.</p>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-700 to-teal-700 rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-cyan-200 tracking-widest mb-1">BRIEF ESTRAT{'\u00c9'}GICO</p>
                  <h3 className="text-lg font-bold text-white">{sub.perfil_empresa?.nombre || sub.nombre || sub.email}</h3>
                  {brief.fecha_generacion && <p className="text-xs text-cyan-200 mt-1">Generado: {brief.fecha_generacion}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={function() { setBriefEditMode(!briefEditMode) }}
                    className={'text-xs font-bold px-3 py-1.5 rounded-lg transition ' + (briefEditMode ? 'bg-white/20 text-white' : 'bg-white/10 text-cyan-200 hover:bg-white/20')}>
                    {briefEditMode ? 'Cancelar' : 'Editar brief'}
                  </button>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                    <p className="text-2xl font-bold text-white">{(brief.territorios_contenido || []).length}</p>
                    <p className="text-[10px] text-cyan-200">Territorios</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit mode */}
            {briefEditMode && (function() {
              var editBrief = JSON.parse(JSON.stringify(brief))

              return <div className="bg-[#1a1745] rounded-xl p-5 border border-cyan-500/30 mb-4 space-y-4">
                <h4 className="text-sm font-bold text-cyan-400">Editar Brief</h4>

                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Propuesta de valor {'\u00fa'}nica</label>
                  <textarea defaultValue={editBrief.propuesta_valor_unica || ''} id="brief-pvunica"
                    className="w-full bg-[#12102a] text-white text-sm rounded-lg p-3 border border-white/10" rows={2} />
                </div>

                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Territorios de contenido (uno por l{'\u00ed'}nea: nombre | justificaci{'\u00f3'}n)</label>
                  <textarea defaultValue={(editBrief.territorios_contenido || []).map(function(t: any) {
                    return typeof t === 'object' ? (t.territorio || t.nombre || '') + ' | ' + (t.justificacion || '') : t
                  }).join('\n')} id="brief-territorios"
                    className="w-full bg-[#12102a] text-white text-sm rounded-lg p-3 border border-white/10" rows={5} />
                </div>

                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Reglas de contenido (una por l{'\u00ed'}nea)</label>
                  <textarea defaultValue={(editBrief.reglas_contenido || []).join('\n')} id="brief-reglas"
                    className="w-full bg-[#12102a] text-white text-sm rounded-lg p-3 border border-white/10" rows={4} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#94a3b8] block mb-1">Tono / estilo</label>
                    <input type="text" defaultValue={(editBrief.tono_comunicacion && typeof editBrief.tono_comunicacion === 'object') ? editBrief.tono_comunicacion.estilo || '' : editBrief.tono_comunicacion || ''} id="brief-tono"
                      className="w-full bg-[#12102a] text-white text-sm rounded-lg p-3 border border-white/10" />
                  </div>
                  <div>
                    <label className="text-xs text-[#94a3b8] block mb-1">Palabras a evitar (separadas por coma)</label>
                    <input type="text" defaultValue={(editBrief.tono_comunicacion && editBrief.tono_comunicacion.palabras_evitar) ? (Array.isArray(editBrief.tono_comunicacion.palabras_evitar) ? editBrief.tono_comunicacion.palabras_evitar.join(', ') : editBrief.tono_comunicacion.palabras_evitar) : ''} id="brief-evitar"
                      className="w-full bg-[#12102a] text-white text-sm rounded-lg p-3 border border-white/10" />
                  </div>
                </div>

                <button disabled={briefSaving} onClick={function() {
                  var pvunica = (document.getElementById('brief-pvunica') as HTMLTextAreaElement).value
                  var terrText = (document.getElementById('brief-territorios') as HTMLTextAreaElement).value
                  var reglasText = (document.getElementById('brief-reglas') as HTMLTextAreaElement).value
                  var tonoVal = (document.getElementById('brief-tono') as HTMLInputElement).value
                  var evitarVal = (document.getElementById('brief-evitar') as HTMLInputElement).value

                  var updated = JSON.parse(JSON.stringify(brief))
                  updated.propuesta_valor_unica = pvunica
                  updated.territorios_contenido = terrText.split('\n').filter(function(l: string) { return l.trim() }).map(function(l: string) {
                    var parts = l.split('|')
                    return { territorio: (parts[0] || '').trim(), justificacion: (parts[1] || '').trim(), formatos_recomendados: [], frecuencia_sugerida: '' }
                  })
                  updated.reglas_contenido = reglasText.split('\n').filter(function(l: string) { return l.trim() })
                  if (!updated.tono_comunicacion || typeof updated.tono_comunicacion !== 'object') updated.tono_comunicacion = {}
                  updated.tono_comunicacion.estilo = tonoVal
                  updated.tono_comunicacion.palabras_evitar = evitarVal.split(',').map(function(w: string) { return w.trim() }).filter(Boolean)
                  updated.editado_por_cliente = true
                  updated.fecha_edicion = new Date().toISOString().split('T')[0]

                  guardarBrief(updated)
                }}
                  className="bg-cyan-600 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50">
                  {briefSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <p className="text-[10px] text-[#64748b]">Los cambios se aplicar{'\u00e1'}n en el pr{'\u00f3'}ximo informe. Los agentes usar{'\u00e1'}n tu brief editado como directriz.</p>
              </div>
            })()}

            {/* Resumen del negocio */}
            {brief.resumen_negocio && (
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Resumen del negocio</h4>
                <p className="text-sm text-[#c4b5fd] leading-relaxed">{brief.resumen_negocio}</p>
              </div>
            )}

            {/* Propuesta de valor */}
            {brief.propuesta_valor_unica && (
              <div className="bg-[#1a1745] rounded-xl p-5 border-l-4 border-cyan-500 mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Propuesta de valor {'\u00fa'}nica</h4>
                <p className="text-base text-white font-semibold leading-relaxed">{brief.propuesta_valor_unica}</p>
              </div>
            )}

            {/* Público objetivo */}
            {brief.publico_objetivo && (
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">P{'\u00fa'}blico objetivo</h4>
                {brief.publico_objetivo.descripcion && <p className="text-sm text-[#c4b5fd] mb-3">{brief.publico_objetivo.descripcion}</p>}
                <div className="grid grid-cols-2 gap-4">
                  {brief.publico_objetivo.pain_points && Array.isArray(brief.publico_objetivo.pain_points) && (
                    <div>
                      <p className="text-xs font-bold text-red-400 mb-2">Dolores</p>
                      {brief.publico_objetivo.pain_points.map(function(p: string, i: number) {
                        return <p key={i} className="text-xs text-[#94a3b8] mb-1">{'\u2022'} {p}</p>
                      })}
                    </div>
                  )}
                  {brief.publico_objetivo.motivaciones && Array.isArray(brief.publico_objetivo.motivaciones) && (
                    <div>
                      <p className="text-xs font-bold text-green-400 mb-2">Motivaciones</p>
                      {brief.publico_objetivo.motivaciones.map(function(m: string, i: number) {
                        return <p key={i} className="text-xs text-[#94a3b8] mb-1">{'\u2022'} {m}</p>
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Territorios de contenido */}
            {brief.territorios_contenido && Array.isArray(brief.territorios_contenido) && brief.territorios_contenido.length > 0 && (
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Territorios de contenido</h4>
                <div className="space-y-3">
                  {brief.territorios_contenido.map(function(t: any, i: number) {
                    var nombre = typeof t === 'object' ? (t.territorio || t.nombre || 'Territorio ' + (i+1)) : t
                    var justificacion = typeof t === 'object' ? (t.justificacion || '') : ''
                    var formatos = typeof t === 'object' && Array.isArray(t.formatos_recomendados) ? t.formatos_recomendados : []
                    var frecuencia = typeof t === 'object' ? (t.frecuencia_sugerida || '') : ''
                    var ejemplo = typeof t === 'object' ? (t.ejemplo_angulo || '') : ''
                    var ejemploIG = typeof t === 'object' ? (t.ejemplo_angulo_ig || '') : ''
                    var ejemploLI = typeof t === 'object' ? (t.ejemplo_angulo_li || '') : ''
                    var platPrincipal = typeof t === 'object' ? (t.plataforma_principal || '') : ''
                    var platBadge = platPrincipal === 'Instagram' ? 'bg-pink-900/30 text-pink-400' : platPrincipal === 'LinkedIn' ? 'bg-blue-900/30 text-blue-400' : platPrincipal === 'ambas' ? 'bg-purple-900/30 text-purple-400' : ''
                    return <div key={i} className="bg-[#12102a] rounded-lg p-4 border border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-cyan-600 text-white text-xs font-bold px-2 py-0.5 rounded">{i + 1}</span>
                        <span className="text-white font-semibold text-sm">{nombre}</span>
                        {platPrincipal && <span className={'text-[9px] font-bold px-1.5 py-0.5 rounded ' + platBadge}>{platPrincipal}</span>}
                        {frecuencia && <span className="text-[10px] text-[#64748b] ml-auto">{frecuencia}</span>}
                      </div>
                      {justificacion && <p className="text-xs text-[#94a3b8] mb-2">{justificacion}</p>}
                      {formatos.length > 0 && <div className="flex gap-1 flex-wrap mb-1">{formatos.map(function(f: string, fi: number) {
                        return <span key={fi} className="text-[10px] bg-white/5 text-[#a5b4fc] px-2 py-0.5 rounded">{f}</span>
                      })}</div>}
                      {ejemplo && <p className="text-[11px] text-cyan-300 mt-1 italic">{'\u201c'}{ejemplo}{'\u201d'}</p>}
                      {ejemploIG && <p className="text-[11px] text-pink-300 mt-1"><span className="text-[9px] bg-pink-900/30 text-pink-400 px-1 rounded mr-1">IG</span> {ejemploIG}</p>}
                      {ejemploLI && <p className="text-[11px] text-blue-300 mt-1"><span className="text-[9px] bg-blue-900/30 text-blue-400 px-1 rounded mr-1">LI</span> {ejemploLI}</p>}
                    </div>
                  })}
                </div>
              </div>
            )}

            {/* Tono de comunicación */}
            {brief.tono_comunicacion && (function() {
              var tc = typeof brief.tono_comunicacion === 'object' ? brief.tono_comunicacion : { estilo: brief.tono_comunicacion }
              return <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Tono de comunicaci{'\u00f3'}n</h4>
                {tc.estilo && <p className="text-sm text-white font-semibold mb-3">{tc.estilo}</p>}
                {tc.referencia && <p className="text-xs text-[#94a3b8] mb-3 italic">{tc.referencia}</p>}
                <div className="grid grid-cols-2 gap-4">
                  {tc.palabras_usar && (
                    <div>
                      <p className="text-xs font-bold text-green-400 mb-2">Usar</p>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(tc.palabras_usar) ? tc.palabras_usar : [tc.palabras_usar]).map(function(w: string, i: number) {
                          return <span key={i} className="text-[10px] bg-green-900/30 text-green-400 border border-green-700/30 px-2 py-0.5 rounded">{w}</span>
                        })}
                      </div>
                    </div>
                  )}
                  {tc.palabras_evitar && (
                    <div>
                      <p className="text-xs font-bold text-red-400 mb-2">Evitar</p>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(tc.palabras_evitar) ? tc.palabras_evitar : [tc.palabras_evitar]).map(function(w: string, i: number) {
                          return <span key={i} className="text-[10px] bg-red-900/30 text-red-400 border border-red-700/30 px-2 py-0.5 rounded">{w}</span>
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            })()}

            {/* Competidores analizados */}
            {brief.competidores_analizados && Array.isArray(brief.competidores_analizados) && brief.competidores_analizados.length > 0 && (
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Competidores analizados</h4>
                <div className="space-y-3">
                  {brief.competidores_analizados.map(function(c: any, i: number) {
                    return <div key={i} className="bg-[#12102a] rounded-lg p-4 border border-white/[0.04]">
                      <p className="text-white font-semibold text-sm mb-2">{c.nombre}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[10px] font-bold text-green-400 mb-1">Fortalezas</p>
                          {(c.fortalezas || []).map(function(f: string, fi: number) {
                            return <p key={fi} className="text-[11px] text-[#94a3b8]">{'\u2022'} {f}</p>
                          })}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-red-400 mb-1">Debilidades</p>
                          {(c.debilidades || []).map(function(d: string, di: number) {
                            return <p key={di} className="text-[11px] text-[#94a3b8]">{'\u2022'} {d}</p>
                          })}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-amber-400 mb-1">Oportunidad</p>
                          <p className="text-[11px] text-amber-200">{c.oportunidad_para_cliente || '-'}</p>
                        </div>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            )}

            {/* Reglas de contenido */}
            {brief.reglas_contenido && Array.isArray(brief.reglas_contenido) && brief.reglas_contenido.length > 0 && (
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Reglas de contenido</h4>
                <div className="space-y-2">
                  {brief.reglas_contenido.map(function(r: string, i: number) {
                    return <div key={i} className="flex items-start gap-2">
                      <span className="text-cyan-500 text-xs mt-0.5">{'\u2714'}</span>
                      <p className="text-sm text-[#c4b5fd]">{r}</p>
                    </div>
                  })}
                </div>
              </div>
            )}

            {/* Calendario estacional */}
            {brief.calendario_estacional && (
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Calendario estacional</h4>
                {brief.calendario_estacional.fechas_relevantes && Array.isArray(brief.calendario_estacional.fechas_relevantes) && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-[#94a3b8] mb-2">Fechas relevantes</p>
                    <div className="flex flex-wrap gap-2">
                      {brief.calendario_estacional.fechas_relevantes.map(function(f: string, i: number) {
                        return <span key={i} className="text-xs bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded border border-indigo-700/30">{f}</span>
                      })}
                    </div>
                  </div>
                )}
                {brief.calendario_estacional.oportunidades && Array.isArray(brief.calendario_estacional.oportunidades) && (
                  <div>
                    <p className="text-xs font-bold text-[#94a3b8] mb-2">Oportunidades</p>
                    {brief.calendario_estacional.oportunidades.map(function(o: string, i: number) {
                      return <p key={i} className="text-xs text-amber-300 mb-1">{'\u2B50'} {o}</p>
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Versiones anteriores del brief */}
            {(function() {
              var historial = (sub.perfil_empresa || {}).brief_historial || []
              if (historial.length === 0) return null
              return <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] mb-4">
                <details>
                  <summary className="text-sm font-bold text-cyan-400 uppercase tracking-wider cursor-pointer">Versiones anteriores ({historial.length})</summary>
                  <div className="mt-3 space-y-2">
                    {historial.map(function(v: any, vi: number) {
                      return <div key={vi} className="bg-[#12102a] rounded-lg p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#64748b]">{v.fecha}</span>
                          <span className="text-[10px] text-[#94a3b8]">{v.territorios} territorios, {v.competidores} competidores</span>
                        </div>
                        {v.propuesta_valor && <p className="text-[11px] text-[#94a3b8] mt-1 italic">{v.propuesta_valor}</p>}
                      </div>
                    })}
                  </div>
                </details>
              </div>
            })()}

            {/* Interconnection diagram */}
            <div className="bg-[#12102a] rounded-xl p-5 border border-cyan-500/20">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Flujo de agentes interconectados</h4>
              <div className="flex items-center justify-between text-center text-[10px] overflow-x-auto gap-1">
                {[
                  { label: 'Brief', icon: '\uD83C\uDFAF', active: true },
                  { label: '\u2192', icon: '', active: false },
                  { label: 'Copies', icon: '\u270D\uFE0F', active: true },
                  { label: '\u2192', icon: '', active: false },
                  { label: 'Guiones', icon: '\uD83C\uDFAC', active: true },
                  { label: '\u2192', icon: '', active: false },
                  { label: 'Grilla', icon: '\uD83D\uDCC5', active: true },
                  { label: '\u2192', icon: '', active: false },
                  { label: 'Auditor\u00EDa', icon: '\uD83D\uDCCA', active: true },
                ].map(function(step, i) {
                  if (!step.active) return <span key={i} className="text-[#64748b] text-lg">{step.label}</span>
                  return <div key={i} className="bg-cyan-900/30 border border-cyan-700/30 rounded-lg px-3 py-2 min-w-[60px]">
                    <p className="text-lg">{step.icon}</p>
                    <p className="text-cyan-300 font-semibold">{step.label}</p>
                  </div>
                })}
              </div>
              <p className="text-[11px] text-[#64748b] mt-3 text-center">El brief alimenta todos los agentes. Cada agente recibe el contexto del anterior.</p>
            </div>
          </>
        })()}

        {/* TAB: COMPETENCIA */}
        {tab === 'competencia' && (
          <>
            <div className="flex gap-2 mb-6">
              {['7d', '30d', '90d'].map(function(p) {
                return <button key={p} onClick={function() { setPeriodo(p) }}
                  className={'px-4 py-2 rounded-lg text-sm font-semibold transition ' + (periodo === p ? 'bg-indigo-600 text-white' : 'bg-[#1a1745] text-[#a5b4fc] border border-white/[0.06] hover:border-indigo-300')}>
                  {p === '7d' ? '7 d\u00edas' : p === '30d' ? '30 d\u00edas' : '90 d\u00edas'}
                </button>
              })}
            </div>

            {/* KPIs con contexto — cada dato se explica y compara */}
            {(function() {
              var rubro = sub && sub.perfil_empresa ? (sub.perfil_empresa.rubro || '') : ''
              var bench = getIndustryBenchmark(rubro)
              var avgEngPerPost = totalPosts > 0 ? Math.round((totalLikes + totalComments) / totalPosts) : 0
              var engExplain = explainMetric(avgEngPerPost, bench.engPerPost, 'Engagement', 'eng/post')
              var nEmpresas = Object.keys(empresas).length
              var freqPerEmpresa = nEmpresas > 0 ? Math.round(totalPosts / nEmpresas) : 0
              var freqExplain = explainMetric(freqPerEmpresa, bench.postsPerMonth, 'Frecuencia', 'posts/empresa')

              var igCount = posts.filter(function(p: any) { return (p.red || 'Instagram') === 'Instagram' }).length
              var liCount = posts.filter(function(p: any) { return p.red === 'LinkedIn' }).length

              return <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#1a1745] rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-2xl font-bold text-indigo-400">{totalPosts}</div>
                    <div className="text-xs text-[#94a3b8] mt-1">Posts de {nEmpresas} competidores</div>
                    <div className="text-[10px] text-[#475569] mt-2">
                      {igCount > 0 && <span className="text-pink-400">{igCount} IG</span>}
                      {igCount > 0 && liCount > 0 && <span className="text-[#475569]"> + </span>}
                      {liCount > 0 && <span className="text-blue-400">{liCount} LI</span>}
                    </div>
                  </div>
                  <div className="bg-[#1a1745] rounded-xl p-4 border border-white/[0.06]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-purple-400">{avgEngPerPost}</span>
                      <span className="text-sm">{engExplain.emoji}</span>
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-1">Engagement promedio por post</div>
                    <div className="text-[10px] text-[#475569] mt-2">{engExplain.texto}</div>
                    <div className="text-[10px] text-[#64748b] mt-1">Engagement = likes + comentarios que recibe cada publicaci{'ó'}n</div>
                  </div>
                  <div className="bg-[#1a1745] rounded-xl p-4 border border-white/[0.06]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-pink-400">{freqPerEmpresa}</span>
                      <span className="text-sm">{freqExplain.emoji}</span>
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-1">Posts promedio por competidor</div>
                    <div className="text-[10px] text-[#475569] mt-2">{freqExplain.texto}</div>
                    <div className="text-[10px] text-[#64748b] mt-1">Benchmark {bench.label}: {bench.postsPerMonth} posts/mes</div>
                  </div>
                </div>
              </div>
            })()}

            {diasOrdenados.length > 1 && (
              <div className="bg-[#1a1745] rounded-xl p-6 border border-white/[0.06] mb-8">
                <h2 className="text-sm font-bold text-white mb-4">Posts detectados por d{'í'}a</h2>
                <div className="flex items-end gap-1" style={{ height: '120px' }}>
                  {diasOrdenados.map(function(d) {
                    var h = Math.max(4, (porDia[d] / maxPostsDia) * 100)
                    return <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-[#94a3b8] font-semibold">{porDia[d]}</span>
                      <div style={{ height: h + '%', minHeight: '4px' }} className="w-full bg-indigo-600 rounded-t-sm" />
                      <span className="text-[9px] text-[#64748b]">{d.substring(5)}</span>
                    </div>
                  })}
                </div>
              </div>
            )}

            {/* CUADRO COMPARATIVO */}
            <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-white/[0.04]">
                <h2 className="text-sm font-bold text-white">Cuadro comparativo</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] text-[#94a3b8] uppercase tracking-wider">
                      <th className="px-4 py-3 text-left font-semibold">Empresa</th>
                      <th className="px-2 py-3 text-center font-semibold"><span className="bg-pink-600 text-white px-1.5 py-0.5 rounded text-[8px]">IG</span></th>
                      <th className="px-2 py-3 text-center font-semibold"><span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[8px]">LI</span></th>
                      <th className="px-3 py-3 text-center font-semibold">Eng/post</th>
                      <th className="px-3 py-3 text-left font-semibold">Formato</th>
                      <th className="px-3 py-3 text-left font-semibold">Tema</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {Object.keys(empresas).map(function(nombre, i) {
                      var e = empresas[nombre]
                      var total = e.ig + e.li
                      var avgEng = total > 0 ? Math.round((e.likes + e.comments) / total) : 0
                      var compPosts = postsByCompany[nombre] || []
                      var analysis = generateCompanyAnalysis(nombre, e, compPosts)
                      var sinDatos = total === 0
                      return <tr key={nombre} className={sinDatos ? 'opacity-40' : i % 2 === 0 ? '' : 'bg-[#12102a]'}>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white">{nombre}</span>
                          {sinDatos && <span className="text-[10px] text-[#475569] ml-2">sin posts recientes</span>}
                        </td>
                        <td className="px-2 py-3 text-center text-pink-400 font-bold">{e.ig || '-'}</td>
                        <td className="px-2 py-3 text-center text-blue-400 font-bold">{e.li || '-'}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={'font-bold ' + (avgEng >= 100 ? 'text-green-400' : avgEng >= 40 ? 'text-yellow-400' : avgEng > 0 ? 'text-red-400' : 'text-[#475569]')}>{avgEng || '-'}</span>
                        </td>
                        <td className="px-3 py-3 text-xs text-[#a5b4fc]">{analysis.formato || '-'}</td>
                        <td className="px-3 py-3 text-xs text-[#a5b4fc]">{analysis.tema || '-'}</td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INSIGHT POR EMPRESA — expandido */}
            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-bold text-white">An{'á'}lisis por empresa</h2>
              {Object.keys(empresas).map(function(nombre, i) {
                var e = empresas[nombre]
                var total = e.ig + e.li
                if (total === 0) return null
                var analysis = generateCompanyAnalysis(nombre, e, postsByCompany[nombre] || [])
                var avgEng = total > 0 ? Math.round((e.likes + e.comments) / total) : 0
                return <div key={nombre} className="bg-[#12102a] rounded-xl p-5 border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{nombre}</h3>
                    <div className="flex gap-3 text-xs">
                      <span className="bg-pink-900/30 text-pink-400 px-2 py-1 rounded">{total} posts</span>
                      <span className={'px-2 py-1 rounded font-bold ' + (avgEng >= 100 ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400')}>{avgEng} eng/post</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">{analysis.resumen}</p>
                  {analysis.topPost && (
                    <div className="bg-[#1a1745] rounded-lg p-3 border-l-2 border-pink-500">
                      <p className="text-[10px] text-pink-400 font-semibold mb-1">Top post ({((analysis.topPost.likes||0)+(analysis.topPost.comments||0))} engagement)</p>
                      <p className="text-xs text-[#a5b4fc]">{(analysis.topPost.texto || '').substring(0, 200)}</p>
                    </div>
                  )}
                  {analysis.gap && <p className="text-[11px] text-amber-400 mt-2">{'💡'} Oportunidad: {analysis.gap}</p>}
                </div>
              })}
            </div>

            {/* ANÁLISIS IA — del Benchmark */}
            {(function() {
              var bm = benchmarks.length > 0 ? benchmarks[0] : null
              var datos = bm && bm.datos ? bm.datos : null
              var analisis = datos && datos.analisis_ia ? datos.analisis_ia : (datos && datos.resumen_ejecutivo ? datos : null)
              if (!analisis && !datos) return null
              return <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5 mb-8">
                <h2 className="text-sm font-bold text-indigo-400 mb-3">{'\uD83E\uDDE0'} An{'á'}lisis IA de la competencia</h2>
                {(analisis && typeof analisis === 'string') && <p className="text-sm text-[#c4b5fd] leading-relaxed">{analisis}</p>}
                {(analisis && analisis.resumen_ejecutivo) && <p className="text-sm text-[#c4b5fd] leading-relaxed">{analisis.resumen_ejecutivo}</p>}
                {(datos && datos.content_gaps && Array.isArray(datos.content_gaps) && datos.content_gaps.length > 0) && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-amber-400 mb-1">Gaps de contenido detectados</p>
                    <div className="flex flex-wrap gap-2">
                      {datos.content_gaps.slice(0, 6).map(function(g: string, gi: number) {
                        return <span key={gi} className="text-xs bg-amber-900/30 text-amber-300 px-2 py-1 rounded">{g}</span>
                      })}
                    </div>
                  </div>
                )}
                {(datos && datos.recomendaciones && Array.isArray(datos.recomendaciones)) && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-green-400 mb-1">Recomendaciones</p>
                    {datos.recomendaciones.slice(0, 3).map(function(r: any, ri: number) {
                      return <p key={ri} className="text-xs text-green-300 mb-1">{'\u2714'} {typeof r === 'string' ? r : r.texto || r.recomendacion || JSON.stringify(r)}</p>
                    })}
                  </div>
                )}
              </div>
            })()}

            {/* CONCEPTOS POR COMPETIDOR — word cloud simplificado */}
            {posts.length > 0 && (function() {
              // Extraer palabras clave de los posts por competidor
              var conceptosPorEmpresa: any = {}
              var stopwords = ['que', 'para', 'con', 'del', 'los', 'las', 'por', 'una', 'como', 'este', 'esta', 'mas', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'sus', 'son', 'ser', 'tiene', 'todo', 'cada', 'puede', 'desde', 'entre', 'sobre', 'todos', 'solo', 'tambien', 'siempre', 'cuando', 'donde', 'pero', 'nos', 'les', 'dia', 'hoy']
              posts.forEach(function(p: any) {
                var empresa = p.nombre_empresa || p.handle || '?'
                if (!conceptosPorEmpresa[empresa]) conceptosPorEmpresa[empresa] = {}
                var palabras = (p.texto || '').toLowerCase().replace(/[^a-záéíóúñü\s]/g, '').split(/\s+/).filter(function(w: string) { return w.length > 4 && stopwords.indexOf(w) === -1 })
                palabras.forEach(function(w: string) {
                  conceptosPorEmpresa[empresa][w] = (conceptosPorEmpresa[empresa][w] || 0) + 1
                })
              })
              // Top 8 conceptos por empresa
              return <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-5 mb-8">
                <h2 className="text-sm font-bold text-white mb-4">Conceptos clave por competidor</h2>
                <div className="space-y-3">
                  {Object.keys(conceptosPorEmpresa).map(function(empresa: string) {
                    var conceptos = Object.keys(conceptosPorEmpresa[empresa])
                      .map(function(w) { return { word: w, count: conceptosPorEmpresa[empresa][w] } })
                      .sort(function(a: any, b: any) { return b.count - a.count })
                      .slice(0, 10)
                    if (conceptos.length === 0) return null
                    return <div key={empresa}>
                      <p className="text-xs font-bold text-indigo-400 mb-1">{empresa}</p>
                      <div className="flex flex-wrap gap-1">
                        {conceptos.map(function(c: any, ci: number) {
                          var size = c.count >= 5 ? 'text-sm font-bold' : c.count >= 3 ? 'text-xs font-semibold' : 'text-[10px]'
                          var opacity = c.count >= 5 ? 'text-white' : c.count >= 3 ? 'text-[#c4b5fd]' : 'text-[#64748b]'
                          return <span key={ci} className={size + ' ' + opacity + ' bg-[#12102a] px-2 py-0.5 rounded'}>{c.word} <span className="text-[8px] text-[#475569]">{c.count}</span></span>
                        })}
                      </div>
                    </div>
                  })}
                </div>
              </div>
            })()}

            {/* Top posts by engagement */}
            <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.04]">
                <h2 className="text-sm font-bold text-white">Top posts por engagement</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Ordenados por likes + comentarios</p>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {postsSortedByEngagement.slice(0, 20).map(function(p: any, i: number) {
                  var badge = engagementBadge(p.likes || 0, p.comments || 0)
                  return <div key={i} className="px-6 py-4 hover:bg-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                        <span className={'text-white text-xs font-bold px-2 py-0.5 rounded ' + ((p.red || 'Instagram') === 'LinkedIn' ? 'bg-blue-600' : 'bg-pink-600')}>{(p.red || 'Instagram') === 'LinkedIn' ? 'LI' : 'IG'}</span>
                        <span className="text-[10px] text-[#64748b] font-bold">#{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm text-white">{p.nombre_empresa || p.handle}</span>
                          <span className="text-xs text-[#64748b]">{(p.fecha_scrape || '').substring(0, 10)}</span>
                          <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border ' + badge.color}>{badge.label}</span>
                        </div>
                        <p className="text-sm text-[#a5b4fc] mb-2">{(p.texto || '').substring(0, 300)}{(p.texto || '').length > 300 ? '...' : ''}</p>
                        <div className="flex gap-4 text-xs">
                          <span className="text-pink-400 font-semibold">{(p.likes || 0).toLocaleString()} likes</span>
                          <span className="text-indigo-400 font-semibold">{(p.comments || 0).toLocaleString()} comentarios</span>
                          <span className="text-[#64748b] font-semibold">Eng: {((p.likes || 0) + (p.comments || 0)).toLocaleString()}</span>
                          {p.post_url && <a href={p.post_url} target="_blank" className="text-indigo-600 font-semibold hover:underline">Ver post</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                })}
                {posts.length === 0 && <div className="px-6 py-8 text-center"><p className="text-[#94a3b8] mb-2">Copilot est{'a'} analizando a tus competidores</p><p className="text-[#475569] text-xs">En las pr{'o'}ximas horas ver{'a'}s los posts de cada competidor con likes, comentarios, formato y tema. Cada post es linkeable al original en Instagram.</p></div>}
              </div>
            </div>
          </>
        )}

        {/* TAB: CONTENIDO */}
        {tab === 'contenido' && (function() {
          // KPIs del mes seleccionado (no all-time)
          var copiesMesCount = copiesMes.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
          var grillasMesCount = grillasMes.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
          var scoreMesTotal = 0; var scoreMesN = 0
          copiesMes.forEach(function(c: any) { if (Array.isArray(c.datos)) c.datos.forEach(function(d: any) { if (d.score) { scoreMesTotal += d.score; scoreMesN++ } }) })
          var scoreMesAvg = scoreMesN > 0 ? Math.round(scoreMesTotal / scoreMesN) : 0

          // Desglose por plataforma
          var igCopies = 0; var liCopies = 0; var igGrilla = 0; var liGrilla = 0
          copiesMes.forEach(function(c: any) { if (Array.isArray(c.datos)) c.datos.forEach(function(d: any) {
            if ((d.plataforma || '').toLowerCase() === 'linkedin') liCopies++; else igCopies++
          })})
          grillasMes.forEach(function(c: any) { if (Array.isArray(c.datos)) c.datos.forEach(function(d: any) {
            if ((d.plataforma || '').toLowerCase() === 'linkedin') liGrilla++; else igGrilla++
          })})

          return <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-purple-600">{copiesMesCount}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Copies {MESES_NOMBRES[mesGlobal]}</div>
                {(igCopies > 0 || liCopies > 0) && <div className="text-[10px] mt-2">{igCopies > 0 && <span className="text-pink-400">{igCopies} IG</span>}{igCopies > 0 && liCopies > 0 && <span className="text-[#475569]"> + </span>}{liCopies > 0 && <span className="text-blue-400">{liCopies} LI</span>}</div>}
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-indigo-600">{grillasMesCount}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Posts grilla {MESES_NOMBRES[mesGlobal]}</div>
                {(igGrilla > 0 || liGrilla > 0) && <div className="text-[10px] mt-2">{igGrilla > 0 && <span className="text-pink-400">{igGrilla} IG</span>}{igGrilla > 0 && liGrilla > 0 && <span className="text-[#475569]"> + </span>}{liGrilla > 0 && <span className="text-blue-400">{liGrilla} LI</span>}</div>}
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-green-600">{scoreMesAvg || '-'}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Score promedio {MESES_NOMBRES[mesGlobal]}</div>
              </div>
            </div>

            {/* VISTA CALENDARIO */}
            {grillasMes.length > 0 && (function() {
              var grillaPosts = [] as any[]
              grillasMes.forEach(function(g: any) {
                if (Array.isArray(g.datos)) g.datos.forEach(function(p: any) { grillaPosts.push(p) })
              })
              if (grillaPosts.length === 0) return null

              // Organizar por día del mes
              var porDia: any = {}
              grillaPosts.forEach(function(p: any) {
                var dia = p.dia || p.dia_mes || 0
                if (dia > 0) {
                  if (!porDia[dia]) porDia[dia] = []
                  porDia[dia].push(p)
                }
              })

              var diasEnMes = new Date(anioGlobal, mesGlobal, 0).getDate()
              var primerDia = new Date(anioGlobal, mesGlobal - 1, 1).getDay() // 0=dom
              var diasSemana = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b']
              var celdas = []
              for (var i = 0; i < primerDia; i++) celdas.push(null)
              for (var d = 1; d <= diasEnMes; d++) celdas.push(d)

              return <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-4 mb-8">
                <h2 className="text-sm font-bold text-white mb-3">Calendario {MESES_NOMBRES[mesGlobal]} {anioGlobal}</h2>
                <div className="grid grid-cols-7 gap-1">
                  {diasSemana.map(function(ds) {
                    return <div key={ds} className="text-[10px] text-[#64748b] text-center font-bold py-1">{ds}</div>
                  })}
                  {celdas.map(function(dia, idx) {
                    if (dia === null) return <div key={'empty-' + idx} />
                    var postsDelDia = porDia[dia] || []
                    var tienePost = postsDelDia.length > 0
                    return <div key={dia} className={'rounded-lg p-1.5 min-h-[52px] ' + (tienePost ? 'bg-indigo-900/30 border border-indigo-500/20' : 'bg-[#12102a] border border-white/[0.03]')}>
                      <div className="text-[10px] text-[#64748b] mb-0.5">{dia}</div>
                      {postsDelDia.map(function(p: any, pi: number) {
                        var color = (p.plataforma || '').includes('LinkedIn') ? 'bg-blue-500' : 'bg-pink-500'
                        return <div key={pi} className={'text-[8px] text-white px-1 py-0.5 rounded truncate mb-0.5 ' + color} title={p.gancho || p.titulo || p.titulo_grafico || ''}>
                          {(p.gancho || p.titulo || p.titulo_grafico || '').substring(0, 20)}
                        </div>
                      })}
                    </div>
                  })}
                </div>
              </div>
            })()}

            {/* CONTENIDO UNIFICADO — copies y grilla en UN SOLO formato */}
            {(function() {
              // Fusionar copies + grilla en una sola lista normalizada
              var todosLosPosts = [] as any[]

              // Copies del mes
              copiesMes.forEach(function(batch: any) {
                (batch.datos || []).forEach(function(c: any) {
                  if (c.copy && c.copy.length > 20 && !c.copy.includes('(Error') && !c.error) {
                    todosLosPosts.push({
                      titulo: c.titulo || c.gancho || '',
                      copy: c.copy || '',
                      plataforma: c.plataforma || 'Instagram',
                      tipo: c.tipo || c.tipo_post || 'Post',
                      angulo: c.angulo || '',
                      score: c.score || 0,
                      dia: c.dia || null,
                      dia_semana: c.dia_semana || '',
                      hashtags: c.hashtags || '',
                      objetivo: c.objetivo || '',
                      justificacion: c.justificacion || '',
                      fuente: 'copy',
                    })
                  }
                })
              })

              // Grilla del mes
              grillasMes.forEach(function(batch: any) {
                (batch.datos || []).forEach(function(g: any) {
                  todosLosPosts.push({
                    titulo: g.titulo || g.titulo_grafico || g.gancho || '',
                    copy: g.copy || '',
                    plataforma: g.plataforma || 'Instagram',
                    tipo: g.tipo_post || g.tipo || 'Post',
                    angulo: g.angulo || '',
                    score: g.score || 0,
                    dia: g.dia || null,
                    dia_semana: g.dia_semana || '',
                    hashtags: g.hashtags || '',
                    objetivo: g.objetivo || '',
                    justificacion: '',
                    fuente: 'grilla',
                    nota_diseno: g.nota_diseno || g.instrucciones_diseno || '',
                  })
                })
              })

              // Ordenar: los que tienen día primero, luego por día
              todosLosPosts.sort(function(a, b) {
                if (a.dia && b.dia) return a.dia - b.dia
                if (a.dia) return -1
                if (b.dia) return 1
                return 0
              })

              if (todosLosPosts.length === 0) return null

              return <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Contenido {MESES_NOMBRES[mesGlobal]}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full border border-purple-700/30">{todosLosPosts.length} publicaciones</span>
                    <a href={'/api/copilot/export-grilla?id=' + props.suscripcionId + '&mes=' + mesGlobal} className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Excel</a>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {todosLosPosts.map(function(p: any, pi: number) {
                    var copyKey = 'post-' + pi
                    var platColor = (p.plataforma || '').includes('LinkedIn') ? 'bg-blue-900/30 text-blue-400' : 'bg-pink-900/30 text-pink-400'
                    var hashtagStr = Array.isArray(p.hashtags) ? p.hashtags.join(' ') : (typeof p.hashtags === 'string' ? p.hashtags : '')
                    return <div key={pi} className="border border-white/[0.04] rounded-lg p-4 hover:bg-white/[0.04]">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {p.dia && <span className="text-[10px] font-bold bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded">{p.dia_semana} {p.dia}</span>}
                        <span className={'text-[10px] font-bold px-2 py-0.5 rounded ' + platColor}>{p.plataforma} {p.tipo}</span>
                        <span className="text-[10px] text-[#64748b]">{p.angulo}</span>
                        {p.score > 0 && <span className={'text-xs font-bold ' + ((p.score) >= 80 ? 'text-green-600' : 'text-yellow-600')}>Score: {p.score}</span>}
                        <button onClick={function() { copyToClipboard(p.copy + (hashtagStr ? '\n\n' + hashtagStr : ''), copyKey) }}
                          className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded bg-white/5 text-[#a5b4fc] hover:bg-white/10 transition border border-white/10">
                          {copiedIndex === copyKey ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">{p.titulo}</h4>
                      <p className="text-xs text-[#a5b4fc] whitespace-pre-line">{(p.copy).substring(0, 400)}{p.copy.length > 400 ? '...' : ''}</p>
                      {hashtagStr && <p className="text-xs text-indigo-400 mt-2 pt-2 border-t border-white/[0.04]">{hashtagStr}</p>}
                      {p.justificacion && <p className="text-[10px] text-[#64748b] mt-1 italic">{p.justificacion}</p>}
                      {p.nota_diseno && <p className="text-[10px] text-amber-400/70 mt-1">{'\uD83C\uDFA8'} Dise{'ñ'}o: {p.nota_diseno}</p>}
                      <div className="flex gap-2 mt-2 pt-2 border-t border-white/[0.04]">
                        <button onClick={function() { enviarFeedback('contenido', 'Aprobado: ' + (p.titulo).substring(0, 50), 'aprobar', copyKey) }}
                          className={'text-[10px] px-2 py-1 rounded transition ' + (feedbackSent === copyKey ? 'bg-green-500/20 text-green-400' : 'bg-green-900/20 text-green-500 hover:bg-green-900/40')}>
                          {feedbackSent === copyKey ? 'Guardado' : 'Aprobar'}
                        </button>
                        <button onClick={function() {
                          var razon = prompt('Por qu\u00e9 rechazas este contenido?')
                          if (razon) enviarFeedback('contenido', 'Rechazado "' + (p.titulo) + '": ' + razon, 'rechazar', copyKey)
                        }}
                          className="text-[10px] px-2 py-1 rounded bg-red-900/20 text-red-400 hover:bg-red-900/40 transition">
                          Rechazar
                        </button>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            })()}

            {grillasMes.length === 0 && copiesMes.length === 0 && (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <p className="text-[#94a3b8] mb-2">Tu contenido del mes est{'a'} en camino</p>
                <p className="text-xs text-[#475569]">Copilot genera copies profesionales, una grilla con calendario y guiones de video. Basados en lo que funciona en tu industria, no en plantillas. Llegan con el pr{'o'}ximo informe semanal.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: AUDITORIA */}
        {tab === 'auditoria' && (function() {
          var mesAuditoria = mesGlobal
          var anioAuditoria = anioGlobal
          var audMes = auditorias.filter(function(a: any) { return a.mes === mesAuditoria && a.anio === anioAuditoria })
          var aud = audMes.length > 0 ? audMes[0] : (auditorias.length > 0 ? auditorias[0] : null) // fallback: más reciente
          var mesesConAuditoria = auditorias.map(function(a: any) { return a.mes }).filter(function(m: number, i: number, arr: number[]) { return arr.indexOf(m) === i })

          var criteriosDefault = [
            'Frecuencia de publicaci\u00F3n',
            'Engagement rate',
            'Consistencia visual',
            'Calidad de copies',
            'Uso de hashtags',
            'Horarios de publicaci\u00F3n',
            'Variedad de formatos',
            'Interacci\u00F3n con audiencia',
          ]

          function parseCriterio(raw: any, index: number) {
            if (typeof raw === 'object' && raw !== null) {
              return { nombre: raw.nombre || criteriosDefault[index] || 'Criterio ' + (index + 1), score: raw.score || 0 }
            }
            return { nombre: criteriosDefault[index] || 'Criterio ' + (index + 1), score: raw || 0 }
          }

          function scoreColor(s: number) { return s >= 8 ? 'text-green-600' : s >= 6 ? 'text-yellow-600' : 'text-red-600' }
          function scoreBg(s: number) { return s >= 8 ? 'bg-green-500' : s >= 6 ? 'bg-yellow-500' : 'bg-red-500' }

          function overallCircleColor(s: number) {
            if (s >= 75) return { ring: 'border-green-500', text: 'text-green-500', bg: 'bg-green-500/10' }
            if (s >= 50) return { ring: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' }
            return { ring: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500/10' }
          }

          // Network scores — only show networks with data (skip 0s)
          var networkScores = [] as { label: string, key: string, color: string, val: number }[]
          if (aud) {
            var sr = aud.scores_red || {}
            if ((sr.Instagram || aud.score_ig || 0) > 0) networkScores.push({ label: 'Instagram', key: 'score_ig', color: 'bg-pink-500', val: sr.Instagram || aud.score_ig || 0 })
            if ((sr.LinkedIn || aud.score_li || 0) > 0) networkScores.push({ label: 'LinkedIn', key: 'score_li', color: 'bg-blue-600', val: sr.LinkedIn || aud.score_li || 0 })
          }

          return <>
            {aud ? (
              <>
                <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Auditor{'\u00ed'}a de {sub.perfil_empresa?.nombre || sub.nombre || 'tu perfil'} — {MESES_NOMBRES[mesAuditoria]} {anioAuditoria}</h2>
                      <p className="text-xs text-[#94a3b8] mt-1">{aud.contexto || ('Basado en datos de competencia')}</p>
                      {aud.proxima_auditoria && <p className="text-xs text-[#64748b] mt-1">Pr\u00f3xima auditor\u00eda: {aud.proxima_auditoria}</p>}
                    </div>
                    {/* Score circle */}
                    {(function() {
                      var cc = overallCircleColor(aud.score_general || aud.score_global || 0)
                      return <div className={'flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 ' + cc.ring + ' ' + cc.bg}>
                        <div className={'text-3xl font-black ' + cc.text}>{aud.score_general || aud.score_global || 0}</div>
                        <div className="text-[10px] text-[#94a3b8]">/100</div>
                      </div>
                    })()}
                  </div>

                  {/* Score by network — only show networks with data */}
                  {networkScores.length > 0 && (
                    <div className={'grid gap-4 mb-6 ' + (networkScores.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-2')}>
                      {networkScores.map(function(red) {
                        var valColor = red.val >= 75 ? 'text-green-600' : red.val >= 50 ? 'text-yellow-600' : 'text-red-600'
                        return <div key={red.key} className="bg-[#12102a] rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-[#c4b5fd]">{red.label}</span>
                            <span className={'text-sm font-bold ' + valColor}>{red.val}/100</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5">
                            <div className={red.color + ' h-2.5 rounded-full transition-all'} style={{ width: red.val + '%' }} />
                          </div>
                        </div>
                      })}
                    </div>
                  )}

                  {/* Resumen ejecutivo IA */}
                  {(aud.datos || aud).resumen_ejecutivo && (
                    <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-[#c4b5fd] leading-relaxed">{(aud.datos || aud).resumen_ejecutivo}</p>
                    </div>
                  )}

                  {/* Top 3 acciones prioritarias */}
                  {((aud.datos || aud).top_3_acciones || []).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-white mb-2">Acciones prioritarias</h3>
                      <div className="space-y-2">
                        {(aud.datos || aud).top_3_acciones.map(function(a: any, ai: number) {
                          var prioColor = (a.prioridad || '').includes('URGENTE') ? 'bg-red-900/30 text-red-400 border-red-700/30' : (a.prioridad || '').includes('IMPORTANTE') ? 'bg-amber-900/30 text-amber-400 border-amber-700/30' : 'bg-blue-900/30 text-blue-400 border-blue-700/30'
                          return <div key={ai} className={'rounded-lg p-3 border ' + prioColor}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase">{a.prioridad || 'MEJORA'}</span>
                            </div>
                            <p className="text-xs text-white font-semibold">{a.accion}</p>
                            {a.impacto_esperado && <p className="text-[10px] text-[#94a3b8] mt-1">{a.impacto_esperado}</p>}
                          </div>
                        })}
                      </div>
                    </div>
                  )}

                  {/* Criterios con dato + benchmark + comparación + acción */}
                  <h3 className="text-sm font-bold text-white mb-3">Detalle por criterio</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {((aud.datos || aud).criterios || aud.criterios || []).map(function(raw: any, ci: number) {
                      var cr = typeof raw === 'object' ? raw : { nombre: 'Criterio ' + (ci + 1), score: raw || 0 }
                      var score = cr.score || cr.puntaje || 0
                      return <div key={ci} className="bg-[#12102a] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-[#a5b4fc] font-semibold">{cr.nombre || cr.criterio}</div>
                          <span className={'text-sm font-bold ' + scoreColor(score)}>{score}/10</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                          <div className={scoreBg(score) + ' h-2 rounded-full transition-all'} style={{ width: (score * 10) + '%' }} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-[10px] mb-2">
                          {cr.dato && <div><span className="text-[#64748b] block">Dato real</span><span className="text-white font-semibold">{cr.dato}</span></div>}
                          {cr.benchmark && <div><span className="text-[#64748b] block">Benchmark industria</span><span className="text-indigo-300 font-semibold">{cr.benchmark}</span></div>}
                          {cr.comparacion && <div><span className="text-[#64748b] block">Comparaci{'ó'}n</span><span className={score >= 7 ? 'text-green-400' : score >= 5 ? 'text-amber-400' : 'text-red-400'}>{cr.comparacion}</span></div>}
                        </div>
                        {cr.explicacion && <p className="text-[10px] text-[#94a3b8] mb-1">{cr.explicacion}</p>}
                        {cr.fuente && <span className="inline-block text-[9px] bg-white/5 text-[#64748b] px-1.5 py-0.5 rounded mb-1">Fuente: {cr.fuente}</span>}
                        {cr.accion && <p className="text-[10px] text-cyan-400 font-semibold">{'\u2192'} {cr.accion}</p>}
                      </div>
                    })}
                  </div>

                  {/* Fortaleza y debilidad */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {(aud.datos || aud).fortaleza_principal && (
                      <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-green-400 mb-1">Fortaleza principal</p>
                        <p className="text-xs text-green-300">{(aud.datos || aud).fortaleza_principal}</p>
                      </div>
                    )}
                    {(aud.datos || aud).debilidad_principal && (
                      <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-red-400 mb-1">Debilidad principal</p>
                        <p className="text-xs text-red-300">{(aud.datos || aud).debilidad_principal}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <div className="text-4xl mb-3">{'\uD83D\uDCCA'}</div>
                <p className="text-[#94a3b8] mb-2">Tu auditor{'i'}a mensual se est{'a'} preparando</p>
                <p className="text-xs text-[#475569]">Cada mes, Copilot eval{'u'}a tu marca contra el benchmark de tu industria en Chile. Incluye score por criterio, comparaci{'o'}n con datos reales, y 3 acciones prioritarias para mejorar. Generada con inteligencia artificial.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: GUIONES */}
        {tab === 'guiones' && (function() {
          var mesGuionesActivo = mesGlobal
          var guionesMesFilt = guiones.filter(function(g: any) { return g.mes === mesGuionesActivo })
          var guionesMes = guionesMesFilt.length > 0 ? guionesMesFilt : (guiones.length > 0 ? [guiones[0]] : []) // fallback: más reciente

          var guionesMesCount = guionesMes.reduce(function(s: number, g: any) { return s + (Array.isArray(g.datos) ? g.datos.length : 1) }, 0)

          return <>
            <p className="text-xs text-[#94a3b8] mb-4">{guionesMesCount} guiones en {MESES_NOMBRES[mesGuionesActivo]}</p>

            {guionesMes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guionesMes.map(function(g: any, gi: number) {
                  var scripts = Array.isArray(g.datos) ? g.datos : [g]
                  return scripts.map(function(s: any, si: number) {
                    var isReel = (s.tipo || '').toLowerCase() === 'reel'
                    var typeColor = isReel ? 'bg-purple-900/30 text-purple-400 border-purple-700' : 'bg-pink-900/30 text-pink-400 border-pink-700'
                    var borderColor = isReel ? 'border-purple-700/30' : 'border-pink-700/30'
                    var hasEscenas = Array.isArray(s.escenas) && s.escenas.length > 0

                    return <div key={gi + '-' + si} className={'bg-[#1a1745] rounded-xl border p-5 ' + borderColor}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={'text-[11px] font-bold px-2.5 py-1 rounded-full border ' + typeColor}>
                          {s.tipo || 'Reel'}
                        </span>
                        <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full">{s.duracion || '30s'}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{s.titulo || 'Gui\u00f3n ' + (si + 1)}</h3>

                      {s.referencia_competencia && (
                        <p className="text-xs text-indigo-400 italic mb-3">Ref: {s.referencia_competencia}</p>
                      )}

                      <div className="space-y-0 text-sm">
                        {/* Gancho — handles both string and object format */}
                        {s.gancho && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">Gancho</span>
                            {typeof s.gancho === 'object' ? (
                              <div className="mt-1">
                                <p className="text-white font-semibold">{s.gancho.frase || s.gancho.texto || ''}</p>
                                {s.gancho.timing && <p className="text-[10px] text-[#64748b] mt-1">{s.gancho.timing}</p>}
                                {s.gancho.texto_pantalla && <p className="text-xs text-[#a5b4fc] mt-1">Pantalla: {s.gancho.texto_pantalla}</p>}
                                {s.gancho.visual && <p className="text-xs text-[#94a3b8] mt-1 italic">{s.gancho.visual}</p>}
                              </div>
                            ) : (
                              <p className="text-[#c4b5fd] mt-1">{s.gancho}</p>
                            )}
                          </div>
                        )}

                        {/* Escenas — if the script has escenas array, render each */}
                        {hasEscenas && s.escenas.map(function(escena: any, ei: number) {
                          return <div key={ei} className="py-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Escena {ei + 1}</span>
                              {escena.timing && <span className="text-[10px] text-[#64748b] font-semibold">{escena.timing}</span>}
                            </div>
                            {escena.voiceover && <p className="text-[#c4b5fd] mt-1"><span className="text-[10px] text-[#64748b]">Voz: </span>{escena.voiceover}</p>}
                            {escena.texto_pantalla && <p className="text-[#a5b4fc] mt-1"><span className="text-[10px] text-[#64748b]">Pantalla: </span>{escena.texto_pantalla}</p>}
                            {escena.texto && !escena.voiceover && <p className="text-[#a5b4fc] mt-1">{escena.texto}</p>}
                            {escena.text && !escena.texto && !escena.voiceover && <p className="text-[#a5b4fc] mt-1">{escena.text}</p>}
                            {escena.accion && <p className="text-xs text-green-400 mt-1">Acción: {escena.accion}</p>}
                            {(escena.visual || escena.camara) && <p className="text-xs text-[#94a3b8] mt-1 italic">{escena.visual || escena.camara}</p>}
                          </div>
                        })}

                        {/* Desarrollo — old format fallback */}
                        {!hasEscenas && s.desarrollo && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Desarrollo</span>
                            <p className="text-[#a5b4fc] mt-1 whitespace-pre-line">{s.desarrollo}</p>
                          </div>
                        )}

                        {/* Cierre / CTA — handles both string and object format */}
                        {s.cierre && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-pink-600 uppercase tracking-wider">Cierre / CTA</span>
                            {typeof s.cierre === 'object' ? (
                              <div className="mt-1">
                                <p className="text-white font-semibold">{s.cierre.frase_cta || s.cierre.frase || s.cierre.texto || ''}</p>
                                {s.cierre.timing && <p className="text-[10px] text-[#64748b] mt-1">{s.cierre.timing}</p>}
                                {s.cierre.accion_medible && <p className="text-xs text-green-400 mt-1">Acción: {s.cierre.accion_medible}</p>}
                                {s.cierre.texto_pantalla && <p className="text-xs text-[#a5b4fc] mt-1">Pantalla: {s.cierre.texto_pantalla}</p>}
                              </div>
                            ) : (
                              <p className="text-[#c4b5fd] mt-1">{s.cierre}</p>
                            )}
                          </div>
                        )}

                        {s.sugerencia_visual && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">Sugerencia visual</span>
                            <p className="text-[#94a3b8] mt-1 text-xs italic">{s.sugerencia_visual}</p>
                          </div>
                        )}
                        {s.hashtags && (
                          <div className="pt-3">
                            <span className="text-xs text-indigo-400">{Array.isArray(s.hashtags) ? s.hashtags.join(' ') : s.hashtags}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  })
                })}
              </div>
            ) : (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <div className="text-4xl mb-3">{'\uD83C\uDFAC'}</div>
                <p className="text-[#94a3b8] mb-2">Guiones de video en camino</p>
                <p className="text-xs text-[#475569] mb-2">Copilot genera guiones de reels y stories listos para grabar: gancho, escenas con timing, texto en pantalla, storyboard visual y sugerencia de m{'u'}sica.</p>
                <p className="text-xs text-[#475569]">Selecciona un mes con contenido generado.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: BENCHMARK COMPETITIVO */}
        {tab === 'benchmark' && (function() {
          var bmMes = benchmarks.filter(function(b: any) { return b.mes === mesGlobal && b.anio === anioGlobal })
          var bm = bmMes.length > 0 ? bmMes[0] : (benchmarks.length > 0 ? benchmarks[0] : null)
          var datos = bm && bm.datos ? bm.datos : null
          var analisis = datos && datos.analisis_ia ? datos.analisis_ia : null

          if (!bm) return <div className="bg-[#1a1745] rounded-xl p-8 border border-white/[0.06] text-center">
            <p className="text-4xl mb-4">{'\uD83C\uDFC6'}</p>
            <p className="text-[#c4b5fd] font-semibold text-lg mb-2">Benchmark competitivo</p>
            <p className="text-[#94a3b8] text-sm mb-2">Benchmark competitivo en preparaci{'o'}n</p>
            <p className="text-[#475569] text-xs">An{'a'}lisis estrat{'e'}gico de cada competidor: posicionamiento, fortalezas, debilidades, oportunidades. Cuadro comparativo por dimensi{'o'}n (tono, concepto, formato). Generado con inteligencia artificial de m{'a'}xima calidad.</p>
          </div>

          return <>
            <div className="bg-gradient-to-r from-orange-700 to-amber-700 rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-orange-200 tracking-widest mb-1">BENCHMARK COMPETITIVO</p>
                  <h3 className="text-lg font-bold text-white">{MESES_NOMBRES[bm.mes]} {bm.anio}</h3>
                  <p className="text-xs text-orange-200 mt-1">Generado: {(bm.created_at || '').substring(0, 10)}</p>
                </div>
                {datos && datos.metricas_competidores && <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                  <p className="text-2xl font-bold text-white">{Object.keys(datos.metricas_competidores).length}</p>
                  <p className="text-[10px] text-orange-200">Competidores</p>
                </div>}
              </div>
            </div>

            {/* Resumen ejecutivo */}
            {analisis && analisis.resumen_ejecutivo && (
              <div className="bg-[#1a1745] rounded-xl p-5 border-l-4 border-orange-500 mb-4">
                <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">Resumen ejecutivo</h4>
                <p className="text-sm text-[#c4b5fd] leading-relaxed whitespace-pre-line">{analisis.resumen_ejecutivo}</p>
              </div>
            )}

            {/* Métricas por competidor — usa datos REALES de radar_posts para consistencia con tab Competencia */}
            {Object.keys(empresas).length > 0 && (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] overflow-hidden mb-4">
                <div className="px-5 py-3 border-b border-white/[0.04]">
                  <h4 className="text-sm font-bold text-white">M{'é'}tricas por competidor</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[9px] text-[#94a3b8] uppercase">
                        <th className="px-3 py-2 text-left">Empresa</th>
                        <th className="px-3 py-2 text-center">Posts</th>
                        <th className="px-3 py-2 text-center">Eng avg</th>
                        <th className="px-3 py-2 text-center">Tendencia</th>
                        <th className="px-3 py-2 text-left">Formato</th>
                        <th className="px-3 py-2 text-left">Tema</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {Object.keys(empresas).map(function(nombre: string, i: number) {
                        var e = empresas[nombre]
                        var total = e.ig + e.li
                        var avgEng = total > 0 ? Math.round((e.likes + e.comments) / total) : 0
                        var compPosts = postsByCompany[nombre] || []
                        var analysis = generateCompanyAnalysis(nombre, e, compPosts)
                        return <tr key={nombre} className={i % 2 === 0 ? '' : 'bg-[#12102a]'}>
                          <td className="px-3 py-2 font-semibold text-white">{nombre}</td>
                          <td className="px-3 py-2 text-center text-white font-bold">{total}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={avgEng >= 100 ? 'text-green-400 font-bold' : avgEng >= 40 ? 'text-yellow-400' : 'text-red-400'}>{avgEng}</span>
                          </td>
                          <td className="px-3 py-2 text-center text-[#94a3b8]">=</td>
                          <td className="px-3 py-2 text-[#a5b4fc]">{analysis.formato || '-'}</td>
                          <td className="px-3 py-2 text-[#a5b4fc]">{analysis.tema || '-'}</td>
                        </tr>
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Análisis por competidor */}
            {analisis && analisis.analisis_competidores && Array.isArray(analisis.analisis_competidores) && (
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-bold text-white">An{'á'}lisis estrat{'é'}gico</h4>
                {analisis.analisis_competidores.map(function(comp: any, i: number) {
                  return <div key={i} className="bg-[#12102a] rounded-xl p-4 border border-white/[0.04]">
                    <h5 className="text-white font-semibold mb-2">{comp.nombre || 'Competidor'}</h5>
                    {comp.posicionamiento && <p className="text-xs text-[#94a3b8] mb-2">{comp.posicionamiento}</p>}
                    <div className="grid grid-cols-3 gap-3 text-[11px]">
                      {comp.fortalezas && <div>
                        <p className="text-green-400 font-semibold text-[10px] mb-1">Fortalezas</p>
                        {(Array.isArray(comp.fortalezas) ? comp.fortalezas : [comp.fortalezas]).map(function(f: string, fi: number) {
                          return <p key={fi} className="text-[#94a3b8]">{'\u2022'} {f}</p>
                        })}
                      </div>}
                      {comp.debilidades && <div>
                        <p className="text-red-400 font-semibold text-[10px] mb-1">Debilidades</p>
                        {(Array.isArray(comp.debilidades) ? comp.debilidades : [comp.debilidades]).map(function(d: string, di: number) {
                          return <p key={di} className="text-[#94a3b8]">{'\u2022'} {d}</p>
                        })}
                      </div>}
                      {comp.oportunidades && <div>
                        <p className="text-amber-400 font-semibold text-[10px] mb-1">Oportunidad</p>
                        {(Array.isArray(comp.oportunidades) ? comp.oportunidades : [comp.oportunidades]).map(function(o: string, oi: number) {
                          return <p key={oi} className="text-amber-200">{'\u2022'} {o}</p>
                        })}
                      </div>}
                    </div>
                  </div>
                })}
              </div>
            )}

            {/* Plan de campaña */}
            {/* PLAN DE CAMPAÑA — usar árbol de decisión si existe, sino plan del benchmark */}
            {(function() {
              // Primero intentar mostrar el árbol de decisión real
              var arbolData = arboles.length > 0 ? (arboles[0].datos || {}) : null
              if (arbolData && arbolData.ramas && arbolData.ramas.length > 0) {
                return <div className="bg-[#1a1745] rounded-xl p-5 border border-orange-500/20 mb-4">
                  <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">{'\u00C1'}rbol de decisi{'ó'}n — distribuci{'ó'}n de pauta</h4>
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#9333EA] rounded-lg p-3 text-center mb-3">
                    <p className="text-white font-bold">${(arbolData.presupuesto_total || 0).toLocaleString()} / mes</p>
                  </div>
                  <div className="space-y-2">
                    {arbolData.ramas.map(function(r: any, ri: number) {
                      var kpis = r.kpis_esperados || r.kpis || {}
                      return <div key={ri} className="bg-[#12102a] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-semibold text-xs">{r.nombre || r.plataforma}</p>
                          <span className="text-orange-400 font-bold text-sm">{r.porcentaje}% (${(r.presupuesto || 0).toLocaleString()})</span>
                        </div>
                        <p className="text-[10px] text-[#94a3b8] mb-1">{r.justificacion || r.segmentacion || r.objetivo || ''}</p>
                        {kpis.leads !== undefined && (
                          <div className="flex gap-3 text-[9px] text-[#64748b]">
                            <span>{kpis.clicks || '?'} clicks</span>
                            <span>{kpis.leads || '?'} leads</span>
                            <span>CPL ${(kpis.cpl || 0).toLocaleString()}</span>
                            {kpis.roas !== undefined && <span>ROAS {kpis.roas}x</span>}
                          </div>
                        )}
                      </div>
                    })}
                  </div>
                  {arbolData.escenarios && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {['pesimista', 'realista', 'optimista'].map(function(esc) {
                        var e = arbolData.escenarios[esc] || {}
                        var c = esc === 'pesimista' ? 'text-red-400' : esc === 'optimista' ? 'text-green-400' : 'text-indigo-400'
                        return <div key={esc} className="bg-[#0f0d2e] rounded p-2 text-center">
                          <div className={'text-[9px] font-bold uppercase ' + c}>{esc}</div>
                          <div className="text-xs text-white font-bold">{e.leads || e.leads_totales || '?'} leads</div>
                          <div className="text-[9px] text-[#475569]">{e.conversiones || '?'} ventas · ROAS {e.roas || '?'}x</div>
                        </div>
                      })}
                    </div>
                  )}
                </div>
              }
              // Fallback al plan del benchmark
              if (analisis && analisis.plan_campana && analisis.plan_campana.canales) {
                return <div className="bg-[#1a1745] rounded-xl p-5 border border-orange-500/20 mb-4">
                  <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">Plan de campa{'ñ'}a sugerido</h4>
                  <div className="space-y-2">
                    {(Array.isArray(analisis.plan_campana.canales) ? analisis.plan_campana.canales : []).map(function(canal: any, ci: number) {
                      return <div key={ci} className="bg-[#12102a] rounded-lg p-3 flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-xs">{canal.canal || canal.nombre || 'Canal'}</p>
                          <p className="text-[10px] text-[#94a3b8]">{canal.formatos || canal.formato || ''} · {canal.frecuencia || ''} · {canal.justificacion || ''}</p>
                        </div>
                        {canal.presupuesto_pct && <span className="text-orange-400 font-bold text-sm">{canal.presupuesto_pct}%</span>}
                      </div>
                    })}
                  </div>
                </div>
              }
              return null
            })()}

            {/* Alertas de riesgo */}
            {analisis && analisis.alertas_riesgo && Array.isArray(analisis.alertas_riesgo) && analisis.alertas_riesgo.length > 0 && (
              <div className="bg-red-900/10 rounded-xl p-4 border border-red-700/20 mb-4">
                <h4 className="text-sm font-bold text-red-400 mb-2">{'\u26A0'} Alertas de riesgo</h4>
                {analisis.alertas_riesgo.map(function(alerta: any, ai: number) {
                  return <p key={ai} className="text-xs text-red-300 mb-1">{'\u2022'} {typeof alerta === 'string' ? alerta : (alerta.descripcion || alerta.alerta || JSON.stringify(alerta))}</p>
                })}
              </div>
            )}

            {/* Gaps de contenido */}
            {datos && datos.gaps_contenido && (
              <div className="bg-[#1a1745] rounded-xl p-4 border border-white/[0.06]">
                <h4 className="text-sm font-bold text-white mb-2">Gaps de contenido detectados</h4>
                <div className="grid grid-cols-2 gap-3">
                  {datos.gaps_contenido.temas_no_cubiertos && datos.gaps_contenido.temas_no_cubiertos.length > 0 && (
                    <div>
                      <p className="text-[10px] text-amber-400 font-semibold mb-1">Temas que la competencia cubre y t{'ú'} no</p>
                      {datos.gaps_contenido.temas_no_cubiertos.map(function(t: string, ti: number) {
                        return <p key={ti} className="text-xs text-[#94a3b8]">{'\u2022'} {t}</p>
                      })}
                    </div>
                  )}
                  {datos.gaps_contenido.formatos_no_usados && datos.gaps_contenido.formatos_no_usados.length > 0 && (
                    <div>
                      <p className="text-[10px] text-cyan-400 font-semibold mb-1">Formatos no usados</p>
                      {datos.gaps_contenido.formatos_no_usados.map(function(f: string, fi: number) {
                        return <p key={fi} className="text-xs text-[#94a3b8]">{'\u2022'} {f}</p>
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        })()}

        {/* TAB: ADS CREATIVOS */}
        {tab === 'ads' && (function() {
          var adsMes = adsCreativos.filter(function(a: any) { return a.mes === mesGlobal && a.anio === anioGlobal })
          var ads = adsMes.length > 0 ? adsMes[0] : (adsCreativos.length > 0 ? adsCreativos[0] : null)
          var datos = ads && ads.datos ? ads.datos : null

          return <>
            <h2 className="text-lg font-bold text-white mb-4">Ads creativos sugeridos</h2>
            {datos ? (
              <div className="space-y-4">
                {datos.google_ads && datos.google_ads.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-indigo-400 mb-2">Google Ads</h3>
                    {datos.google_ads.map(function(grupo: any, gi: number) {
                      return <div key={gi} className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-4 mb-3">
                        <div className="text-sm font-bold text-white mb-2">{grupo.nombre_grupo || grupo.nombre || 'Grupo ' + (gi + 1)}</div>
                        {grupo.keywords_sugeridas && <p className="text-xs text-[#64748b] mb-2">Keywords: {grupo.keywords_sugeridas.join(', ')}</p>}
                        <div className="space-y-1">
                          {(grupo.headlines || []).map(function(h: string, hi: number) {
                            return <div key={hi} className="flex items-center gap-2">
                              <span className="text-xs text-[#475569] w-6">H{hi + 1}</span>
                              <span className="text-sm text-white bg-[#0f0d2e] px-2 py-1 rounded flex-1">{h}</span>
                              <span className="text-xs text-[#475569]">{h.length}/30</span>
                            </div>
                          })}
                          {(grupo.descriptions || []).map(function(d: string, di: number) {
                            return <div key={di} className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#475569] w-6">D{di + 1}</span>
                              <span className="text-sm text-[#94a3b8] bg-[#0f0d2e] px-2 py-1 rounded flex-1">{d}</span>
                              <span className="text-xs text-[#475569]">{d.length}/90</span>
                            </div>
                          })}
                        </div>
                        {grupo.razon && <p className="text-xs text-[#64748b] mt-2 italic">{grupo.razon}</p>}
                      </div>
                    })}
                  </div>
                )}
                {datos.meta_ads && datos.meta_ads.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-pink-400 mb-2">Meta Ads</h3>
                    {datos.meta_ads.map(function(conjunto: any, ci: number) {
                      return <div key={ci} className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-4 mb-3">
                        <div className="text-sm font-bold text-white mb-2">{conjunto.nombre_conjunto || 'Conjunto ' + (ci + 1)}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(conjunto.variaciones || []).map(function(v: any, vi: number) {
                            return <div key={vi} className="bg-[#0f0d2e] rounded-lg p-3">
                              <span className="text-xs font-bold text-purple-400 uppercase">{v.angulo || 'copy'}</span>
                              <p className="text-sm text-white mt-1">{v.primary_text || v.primary_text_125 || ''}</p>
                              <p className="text-xs text-indigo-300 font-bold mt-1">{v.headline || v.headline_40 || ''}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">{v.cta || 'CTA'}</span>
                                <span className="text-xs text-[#475569]">{v.formato_sugerido || ''}</span>
                              </div>
                            </div>
                          })}
                        </div>
                        {conjunto.razon && <p className="text-xs text-[#64748b] mt-2 italic">{conjunto.razon}</p>}
                      </div>
                    })}
                  </div>
                )}
                {datos.recomendaciones_ab_test && (
                  <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-4">
                    <h3 className="text-sm font-bold text-amber-400 mb-2">A/B Test sugerido</h3>
                    {datos.recomendaciones_ab_test.map(function(r: string, ri: number) {
                      return <p key={ri} className="text-sm text-[#94a3b8]">{r}</p>
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <div className="text-4xl mb-3">{'\uD83C\uDFAF'}</div>
                <p className="text-[#94a3b8] mb-2">Copies de anuncios en preparaci{'o'}n</p>
                <p className="text-xs text-[#475569]">Copilot genera headlines para Google Ads (30 caracteres), copies para Meta Ads con variaciones por {'a'}ngulo (dolor, beneficio, urgencia, social proof), y sugerencias de A/B testing. Todo basado en tu industria.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: ÁRBOL DE DECISIÓN */}
        {/* TAB: ÁRBOL DE DECISIÓN + PREDICTOR */}
        {tab === 'arbol' && (function() {
          // Buscar árbol del mes o el más reciente disponible
          var arbolMes = arboles.filter(function(a: any) { return a.mes === mesGlobal && a.anio === anioGlobal })
          var arbol = arbolMes.length > 0 ? arbolMes[0] : (arboles.length > 0 ? arboles[0] : null)
          // Si hay árbol de otro mes, igual mostrarlo
          var datos = arbol && arbol.datos ? arbol.datos : null
          var perfil = sub && sub.perfil_empresa ? sub.perfil_empresa : {}
          var rubro = perfil.rubro || ''
          var bench = getIndustryBenchmark(rubro)
          var presupuesto = perfil.presupuesto_mensual || 1000000
          var ticket = perfil.ticket_promedio || 500000
          var tasaCierre = perfil.tasa_cierre || 5

          // Si no hay árbol del agente, generar uno básico con el predictor
          if (!datos) {
            var cpc = bench.engPerPost > 50 ? 350 : bench.engPerPost > 30 ? 500 : 700 // estimación CPC por industria
            var tipoCliente = perfil.tipo_cliente || 'B2C'
            var esB2B = tipoCliente === 'B2B'

            // Distribución según tipo de cliente y presupuesto
            var ramas = [] as any[]
            if (esB2B) {
              ramas = [
                { nombre: 'Google Search — Intent alto', plataforma: 'Google Search', porcentaje: 35, objetivo: 'leads', justificacion: 'B2B: el comprador busca activamente soluciones. Keywords de dolor y producto.' },
                { nombre: 'Meta Ads — Formulario calificado', plataforma: 'Meta Ads', porcentaje: 25, objetivo: 'leads', justificacion: 'Formularios con preguntas de calificaci\u00f3n (cargo, tama\u00f1o empresa). Genera volumen.' },
                { nombre: 'Remarketing — Nurturing', plataforma: 'Remarketing', porcentaje: 20, objetivo: 'remarketing', justificacion: 'B2B tiene ciclo largo. Remarketing nutre leads que no convirtieron en la primera visita.' },
                { nombre: 'Google PMax — Cobertura', plataforma: 'Google PMax', porcentaje: 20, objetivo: 'awareness', justificacion: 'Amplia cobertura en YouTube, Display, Gmail. Assets din\u00e1micos con base CRM como se\u00f1al.' },
              ]
            } else {
              ramas = [
                { nombre: 'Meta Ads — Lead Generation', plataforma: 'Meta Ads', porcentaje: 35, objetivo: 'leads', justificacion: 'B2C: Meta tiene mejor CVR para consumidor final. Formularios nativos con baja fricci\u00f3n.' },
                { nombre: 'Google Search — Demanda activa', plataforma: 'Google Search', porcentaje: 25, objetivo: 'leads', justificacion: 'Captura b\u00fasquedas activas de producto/servicio. Alto intent de compra.' },
                { nombre: 'Google PMax — Descubrimiento', plataforma: 'Google PMax', porcentaje: 20, objetivo: 'awareness', justificacion: 'YouTube + Display + Discovery. Genera demanda en p\u00fablico que a\u00fan no busca.' },
                { nombre: 'Remarketing — Rescate', plataforma: 'Remarketing', porcentaje: 15, objetivo: 'remarketing', justificacion: 'Recupera visitantes sin conversi\u00f3n. Mensajes de urgencia y social proof.' },
                { nombre: 'Conquista — Competencia', plataforma: 'Google Search', porcentaje: 5, objetivo: 'conquista', justificacion: 'Keywords de competidores directos. Bajo volumen pero alta intenci\u00f3n.' },
              ]
            }

            // Calcular KPIs por rama con datos del predictor
            ramas.forEach(function(r: any) {
              r.presupuesto = Math.round(presupuesto * r.porcentaje / 100)
              var cpcRama = r.plataforma.includes('Meta') ? Math.round(cpc * 0.8) : cpc
              var cvrRama = r.plataforma.includes('Meta') ? 0.08 : 0.03 // Meta tiene mejor CVR generalmente
              if (r.objetivo === 'remarketing') { cpcRama = Math.round(cpc * 0.5); cvrRama = 0.12 }
              var clicks = Math.round(r.presupuesto / cpcRama)
              var leads = Math.round(clicks * cvrRama)
              var conversiones = Math.round(leads * (tasaCierre / 100) * 10) / 10
              var cpa = conversiones > 0 ? Math.round(r.presupuesto / conversiones) : 0
              var revenue = Math.round(conversiones * ticket)
              var roas = r.presupuesto > 0 ? Math.round(revenue / r.presupuesto * 10) / 10 : 0
              r.kpis = { clicks: clicks, cpc: cpcRama, leads: leads, cpl: leads > 0 ? Math.round(r.presupuesto / leads) : 0, conversiones: conversiones, cpa: cpa, revenue: revenue, roas: roas }
            })

            // Escenarios
            var totalLeads = ramas.reduce(function(s: number, r: any) { return s + r.kpis.leads }, 0)
            var totalConv = ramas.reduce(function(s: number, r: any) { return s + r.kpis.conversiones }, 0)
            var totalRev = ramas.reduce(function(s: number, r: any) { return s + r.kpis.revenue }, 0)

            datos = {
              resumen: '\u00c1rbol generado autom\u00e1ticamente con el predictor M&P para ' + (perfil.nombre || 'tu empresa') + ' (' + rubro + '). Presupuesto $' + presupuesto.toLocaleString() + '/mes distribuido en ' + ramas.length + ' ramas. Cada KPI est\u00e1 calculado con benchmarks reales de la industria ' + bench.label + ' en Chile.',
              presupuesto_total: presupuesto,
              ramas: ramas,
              escenarios: {
                pesimista: { leads: Math.round(totalLeads * 0.6), conversiones: Math.round(totalConv * 0.5 * 10) / 10, cpa: totalConv > 0 ? Math.round(presupuesto / (totalConv * 0.5)) : 0, roas: Math.round(totalRev * 0.5 / presupuesto * 10) / 10, revenue: Math.round(totalRev * 0.5) },
                realista: { leads: totalLeads, conversiones: totalConv, cpa: totalConv > 0 ? Math.round(presupuesto / totalConv) : 0, roas: Math.round(totalRev / presupuesto * 10) / 10, revenue: totalRev },
                optimista: { leads: Math.round(totalLeads * 1.4), conversiones: Math.round(totalConv * 1.5 * 10) / 10, cpa: totalConv > 0 ? Math.round(presupuesto / (totalConv * 1.5)) : 0, roas: Math.round(totalRev * 1.5 / presupuesto * 10) / 10, revenue: Math.round(totalRev * 1.5) },
              },
              _generado_en_dashboard: true,
            }
          }

          return <>
            <h2 className="text-lg font-bold text-white mb-2">{'\u00C1'}rbol de decisi{'ó'}n digital</h2>
            <p className="text-xs text-[#64748b] mb-4">Distribuci{'ó'}n de presupuesto en ramas medibles. Cada KPI est{'á'} calculado con benchmarks reales de la industria {bench.label} en Chile. {datos._generado_en_dashboard ? 'Generado con el predictor M&P.' : 'Generado por el agente IA con Claude Sonnet.'}</p>

            {/* Resumen estratégico */}
            {datos.resumen && (
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-[#c4b5fd] leading-relaxed">{datos.resumen}</p>
              </div>
            )}

            {/* Presupuesto total */}
            <div className="bg-gradient-to-r from-[#2563EB] to-[#9333EA] rounded-xl p-4 text-center mb-4">
              <p className="text-white font-bold text-lg">${(datos.presupuesto_total || 0).toLocaleString()} / mes</p>
              <p className="text-indigo-200 text-xs mt-1">Presupuesto de pauta distribuido en {(datos.ramas || []).length} ramas</p>
            </div>

            {/* RAMAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {(datos.ramas || []).map(function(rama: any, ri: number) {
                var kpis = rama.kpis_esperados || rama.kpis || {}
                return <div key={ri} className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{rama.nombre || rama.plataforma}</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-bold">{rama.porcentaje || '?'}%</span>
                  </div>
                  <p className="text-lg font-bold text-indigo-400">${(rama.presupuesto || 0).toLocaleString()}</p>
                  {rama.justificacion && <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">{rama.justificacion}</p>}

                  {/* KPIs de la rama — cada uno explicado */}
                  <div className="grid grid-cols-4 gap-2 mt-3 bg-[#0f0d2e] rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-cyan-400">{kpis.clicks || '?'}</div>
                      <div className="text-[9px] text-[#475569]">clicks</div>
                      <div className="text-[8px] text-[#334155]">CPC ${(kpis.cpc || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-400">{kpis.leads || '?'}</div>
                      <div className="text-[9px] text-[#475569]">leads</div>
                      <div className="text-[8px] text-[#334155]">CPL ${(kpis.cpl || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-amber-400">{kpis.conversiones || '?'}</div>
                      <div className="text-[9px] text-[#475569]">ventas</div>
                      <div className="text-[8px] text-[#334155]">CPA ${(kpis.cpa || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-pink-400">{kpis.roas || '?'}x</div>
                      <div className="text-[9px] text-[#475569]">ROAS</div>
                      <div className="text-[8px] text-[#334155]">${(kpis.revenue || 0).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Explicación de KPIs */}
                  <div className="mt-2 text-[9px] text-[#475569] leading-relaxed">
                    Por cada ${(kpis.cpc || 0).toLocaleString()} invertidos obtienes 1 click. De cada {kpis.leads > 0 && kpis.clicks > 0 ? Math.round(kpis.clicks / kpis.leads) : '?'} clicks, 1 se convierte en lead. Con tasa de cierre de {tasaCierre}%, {kpis.leads || 0} leads generan {kpis.conversiones || 0} ventas a ticket promedio ${ticket.toLocaleString()}.
                  </div>

                  {rama.criterio_poda && <p className="text-[10px] text-red-400/70 mt-2 border-t border-white/[0.04] pt-2">Poda: {rama.criterio_poda}</p>}
                  {rama.criterio_escalar && <p className="text-[10px] text-green-400/70">Escalar: {rama.criterio_escalar}</p>}
                </div>
              })}
            </div>

            {/* ESCENARIOS con explicación */}
            {datos.escenarios && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Proyecci{'ó'}n de escenarios</h3>
                <p className="text-[10px] text-[#64748b] mb-3">Pesimista: CPC +40%, CVR -30% vs benchmark. Realista: datos del predictor directos. Optimista: CPC -20%, CVR +20%.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'pesimista', label: 'Pesimista', color: 'from-red-900/20 to-red-800/10', textColor: 'text-red-400', borderColor: 'border-red-500/20' },
                    { key: 'realista', label: 'Realista', color: 'from-indigo-900/20 to-indigo-800/10', textColor: 'text-indigo-400', borderColor: 'border-indigo-500/20' },
                    { key: 'optimista', label: 'Optimista', color: 'from-green-900/20 to-green-800/10', textColor: 'text-green-400', borderColor: 'border-green-500/20' },
                  ].map(function(esc) {
                    var e = datos.escenarios[esc.key] || {}
                    var esRentable = (e.revenue || 0) > presupuesto
                    return <div key={esc.key} className={'bg-gradient-to-b ' + esc.color + ' rounded-xl border ' + esc.borderColor + ' p-4'}>
                      <div className={'text-xs font-bold uppercase mb-3 ' + esc.textColor}>{esc.label}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-[#94a3b8]">Leads</span>
                          <span className="text-sm font-bold text-white">{e.leads || e.leads_totales || '?'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] text-[#94a3b8]">Ventas</span>
                          <span className="text-sm font-bold text-white">{e.conversiones || '?'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] text-[#94a3b8]">CPA</span>
                          <span className="text-sm font-bold text-white">${(e.cpa || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] text-[#94a3b8]">Revenue</span>
                          <span className="text-sm font-bold text-white">${(e.revenue || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/[0.06] pt-2">
                          <span className="text-[10px] text-[#94a3b8]">ROAS</span>
                          <span className={'text-sm font-bold ' + (esRentable ? 'text-green-400' : 'text-red-400')}>{e.roas || '?'}x</span>
                        </div>
                        <div className="text-[9px] text-center mt-1">
                          <span className={'font-bold ' + (esRentable ? 'text-green-400' : 'text-red-400')}>{esRentable ? 'Rentable' : 'No rentable'}</span>
                          <span className="text-[#475569]"> (ROAS {'>'}1x = ganas m{'á'}s de lo que inviertes)</span>
                        </div>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            )}

            {/* Explicación de métricas */}
            <div className="bg-[#12102a] rounded-xl p-4 border border-white/[0.04] mb-4">
              <h4 className="text-xs font-bold text-indigo-400 mb-2">Qu{'é'} significa cada m{'é'}trica</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#94a3b8]">
                <div><strong className="text-white">CPC</strong> (Costo por Click): lo que pagas cada vez que alguien hace click en tu anuncio.</div>
                <div><strong className="text-white">CPL</strong> (Costo por Lead): lo que pagas por cada persona que deja sus datos.</div>
                <div><strong className="text-white">CPA</strong> (Costo por Adquisici{'ó'}n): lo que pagas por cada venta cerrada.</div>
                <div><strong className="text-white">ROAS</strong> (Return on Ad Spend): cu{'á'}nto ganas por cada peso invertido. ROAS 3x = por cada $1 invertido ganas $3.</div>
                <div><strong className="text-white">CVR</strong> (Tasa de Conversi{'ó'}n): % de clicks que se convierten en leads.</div>
                <div><strong className="text-white">Tasa de cierre</strong>: % de leads que se convierten en ventas. Depende de tu equipo comercial.</div>
              </div>
            </div>

            {/* Aprendizajes */}
            {aprendizajes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Lo que Copilot aprendi{'ó'}</h3>
                <div className="space-y-1">
                  {aprendizajes.slice(0, 8).map(function(a: any, ai: number) {
                    var stars = a.confianza >= 0.8 ? '\u2605\u2605\u2605' : a.confianza >= 0.6 ? '\u2605\u2605' : '\u2605'
                    return <div key={ai} className="bg-[#0f0d2e] rounded-lg px-3 py-2 flex items-start gap-2">
                      <span className="text-amber-400 text-xs mt-0.5">{stars}</span>
                      <span className="text-xs text-[#94a3b8] flex-1">{a.aprendizaje}</span>
                    </div>
                  })}
                </div>
              </div>
            )}

            {datos._generado_en_dashboard && (
              <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-3 mt-4">
                <p className="text-[10px] text-amber-300">Este {'á'}rbol fue generado con el predictor M&P usando los datos de tu perfil. Para un {'á'}rbol m{'á'}s preciso basado en an{'á'}lisis de competencia y aprendizaje, completa los datos de tu negocio en el tab Brief y espera el pr{'ó'}ximo ciclo mensual.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: IDEAS */}
        {tab === 'ideas' && (function() {
          var categorias = ['educativo', 'entretenimiento', 'producto', 'testimonial', 'tendencia', 'behind-the-scenes', 'caso_exito', 'marca_humana', 'datos_mercado', 'promocional', 'general']
          var estados = ['nueva', 'aprobada', 'en_progreso', 'publicada', 'descartada']

          var ideasFiltradas = ideas.filter(function(idea: any) {
            if (ideaFiltroCategoria !== 'todas' && idea.categoria !== ideaFiltroCategoria) return false
            if (ideaFiltroEstado !== 'todos' && idea.estado !== ideaFiltroEstado) return false
            // Filtrar por mes global (basado en created_at)
            if (idea.created_at) {
              var mesIdea = parseInt((idea.created_at || '').substring(5, 7))
              if (mesIdea && mesIdea !== mesGlobal) return false
            }
            return true
          })

          var conteoEstados = { nueva: 0, aprobada: 0, en_progreso: 0, publicada: 0, descartada: 0 } as Record<string, number>
          ideas.forEach(function(idea: any) {
            if (conteoEstados[idea.estado] !== undefined) conteoEstados[idea.estado]++
          })

          function estadoColor(e: string) {
            if (e === 'nueva') return 'bg-blue-900/30 text-blue-400'
            if (e === 'aprobada') return 'bg-cyan-900/30 text-cyan-400'
            if (e === 'en_progreso') return 'bg-yellow-900/30 text-yellow-400'
            if (e === 'publicada') return 'bg-green-900/30 text-green-400'
            return 'bg-white/5 text-[#94a3b8]'
          }

          function prioridadColor(p: string) {
            if (p === 'alta') return 'bg-red-900/30 text-red-400 border border-red-700/50'
            if (p === 'media') return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
            return 'bg-white/5 text-[#94a3b8] border border-white/10'
          }

          function categoriaColor(c: string) {
            if (c === 'educativo') return 'bg-blue-900/20 text-blue-400'
            if (c === 'entretenimiento') return 'bg-pink-900/20 text-pink-400'
            if (c === 'producto') return 'bg-green-900/20 text-green-400'
            if (c === 'testimonial') return 'bg-amber-900/20 text-amber-400'
            if (c === 'tendencia') return 'bg-purple-900/20 text-purple-400'
            return 'bg-teal-900/20 text-teal-400'
          }

          function estadoLabel(e: string) {
            if (e === 'nueva') return 'Nueva'
            if (e === 'aprobada') return 'Aprobada'
            if (e === 'en_progreso') return 'En progreso'
            if (e === 'publicada') return 'Publicada'
            return 'Descartada'
          }

          async function actualizarEstadoIdea(ideaId: string, nuevoEstado: string) {
            try {
              await fetch(SUPABASE_URL + '/rest/v1/copilot_ideas?id=eq.' + ideaId, {
                method: 'PATCH',
                headers: hdrs(),
                body: JSON.stringify({ estado: nuevoEstado }),
              })
              // Update local state
              var ideaActualizada = ideas.find(function(i: any) { return i.id === ideaId })
              setIdeas(ideas.map(function(idea: any) {
                if (idea.id === ideaId) return Object.assign({}, idea, { estado: nuevoEstado })
                return idea
              }))
              // Notificar a M&P cuando se aprueba o descarta
              if ((nuevoEstado === 'aprobada' || nuevoEstado === 'descartada') && ideaActualizada) {
                fetch('/api/copilot/notify-idea', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    idea_id: ideaId,
                    suscripcion_id: props.suscripcionId,
                    estado: nuevoEstado,
                    titulo: ideaActualizada.titulo,
                    descripcion: ideaActualizada.descripcion,
                    categoria: ideaActualizada.categoria,
                  }),
                }).catch(function() {}) // fire and forget
              }
            } catch (e) { console.error('Error actualizando idea:', e) }
          }

          async function guardarIdea() {
            if (!ideaTitulo.trim()) return
            setIdeaSaving(true)
            try {
              var body = {
                suscripcion_id: props.suscripcionId,
                titulo: ideaTitulo,
                descripcion: ideaDesc,
                categoria: ideaCat,
                prioridad: ideaPri,
                estado: 'nueva',
              }
              var r = await fetch(SUPABASE_URL + '/rest/v1/copilot_ideas', {
                method: 'POST',
                headers: Object.assign({}, hdrs(), { 'Prefer': 'return=representation' }),
                body: JSON.stringify(body),
              })
              var newIdea = await r.json()
              if (Array.isArray(newIdea) && newIdea.length > 0) {
                setIdeas([newIdea[0]].concat(ideas))
              }
              setIdeaTitulo('')
              setIdeaDesc('')
              setIdeaCat('educativo')
              setIdeaPri('media')
              setIdeaForm(false)
            } catch (e) { alert('Error al guardar la idea') }
            setIdeaSaving(false)
          }

          return <>
            {/* Status summary */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {estados.map(function(e) {
                return <div key={e} className="bg-[#1a1745] rounded-xl p-4 border border-white/[0.06] text-center">
                  <div className="text-2xl font-bold text-white">{conteoEstados[e] || 0}</div>
                  <div className="text-xs text-[#94a3b8] mt-1">{estadoLabel(e)}</div>
                </div>
              })}
            </div>

            {/* Filters + add button */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <select value={ideaFiltroCategoria} onChange={function(e) { setIdeaFiltroCategoria(e.target.value) }}
                className="px-3 py-2 rounded-lg text-sm border border-white/10 bg-[#1a1745] text-white">
                <option value="todas">Todas las categor\u00edas</option>
                {categorias.map(function(c) { return <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option> })}
              </select>
              <select value={ideaFiltroEstado} onChange={function(e) { setIdeaFiltroEstado(e.target.value) }}
                className="px-3 py-2 rounded-lg text-sm border border-white/10 bg-[#1a1745] text-white">
                <option value="todos">Todos los estados</option>
                {estados.map(function(e) { return <option key={e} value={e}>{estadoLabel(e)}</option> })}
              </select>
              <button onClick={function() { setIdeaForm(!ideaForm) }}
                className="ml-auto bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-amber-700 transition">
                {ideaForm ? 'Cancelar' : '+ Agregar idea'}
              </button>
            </div>

            {/* Add idea form */}
            {ideaForm && (
              <div className="bg-[#1a1745] rounded-xl border border-amber-700/30 p-5 mb-6">
                <h3 className="text-sm font-bold text-white mb-3">Nueva idea</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input type="text" placeholder="T\u00edtulo de la idea" value={ideaTitulo} onChange={function(e) { setIdeaTitulo(e.target.value) }}
                    className="px-3 py-2 rounded-lg text-sm border border-white/10 bg-[#1a1745] text-white w-full placeholder-[#64748b]" />
                  <div className="flex gap-2">
                    <select value={ideaCat} onChange={function(e) { setIdeaCat(e.target.value) }}
                      className="px-3 py-2 rounded-lg text-sm border border-white/10 bg-[#1a1745] text-white flex-1">
                      {categorias.map(function(c) { return <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option> })}
                    </select>
                    <select value={ideaPri} onChange={function(e) { setIdeaPri(e.target.value) }}
                      className="px-3 py-2 rounded-lg text-sm border border-white/10 bg-[#1a1745] text-white flex-1">
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                </div>
                <textarea placeholder="Descripci\u00f3n (opcional)" value={ideaDesc} onChange={function(e) { setIdeaDesc(e.target.value) }}
                  className="px-3 py-2 rounded-lg text-sm border border-white/10 bg-[#1a1745] text-white w-full mb-3 placeholder-[#64748b]" rows={3} />
                <button onClick={guardarIdea} disabled={ideaSaving || !ideaTitulo.trim()}
                  className="bg-amber-600 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50">
                  {ideaSaving ? 'Guardando...' : 'Guardar idea'}
                </button>
              </div>
            )}

            {/* Ideas list */}
            {ideasFiltradas.length > 0 ? (
              <div className="space-y-3">
                {ideasFiltradas.map(function(idea: any, ii: number) {
                  var hasCompetitorRef = idea.referencia_competencia || idea.competitor_ref
                  return <div key={idea.id || ii} className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-5 hover:bg-white/[0.04] transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{idea.titulo}</h3>
                          <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + estadoColor(idea.estado)}>{estadoLabel(idea.estado)}</span>
                          <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + prioridadColor(idea.prioridad)}>{(idea.prioridad || 'media').charAt(0).toUpperCase() + (idea.prioridad || 'media').slice(1)}</span>
                          <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full ' + categoriaColor(idea.categoria || '')}>{(idea.categoria || '').replace('-', ' ')}</span>
                        </div>
                        {idea.descripcion && <p className="text-sm text-[#a5b4fc] mb-1 whitespace-pre-line">{idea.descripcion}</p>}
                        {hasCompetitorRef && <p className="text-xs text-indigo-400 italic mt-1">Referencia: {idea.referencia_competencia || idea.competitor_ref}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] text-[#64748b]">{(idea.created_at || '').substring(0, 10)}</span>
                        {idea.id && idea.estado !== 'publicada' && (
                          <div className="flex gap-1">
                            {idea.estado !== 'aprobada' && <button onClick={function() { actualizarEstadoIdea(idea.id, 'aprobada') }}
                              className="text-[10px] bg-cyan-900/30 text-cyan-400 border border-cyan-700/30 px-2 py-0.5 rounded hover:bg-cyan-800/50 transition" title="Aprobar — se priorizar{'\u00e1'} en pr{'\u00f3'}ximos copies">{'\u2714'} Aprobar</button>}
                            {idea.estado !== 'en_progreso' && idea.estado !== 'descartada' && <button onClick={function() { actualizarEstadoIdea(idea.id, 'en_progreso') }}
                              className="text-[10px] bg-yellow-900/30 text-yellow-400 border border-yellow-700/30 px-2 py-0.5 rounded hover:bg-yellow-800/50 transition">{'\u23F3'} En curso</button>}
                            {idea.estado !== 'descartada' && <button onClick={function() { actualizarEstadoIdea(idea.id, 'descartada') }}
                              className="text-[10px] bg-white/5 text-[#94a3b8] border border-white/10 px-2 py-0.5 rounded hover:bg-red-900/30 hover:text-red-400 transition">{'\u2716'}</button>}
                            {(idea.estado === 'aprobada' || idea.estado === 'en_progreso') && <button onClick={function() { actualizarEstadoIdea(idea.id, 'publicada') }}
                              className="text-[10px] bg-green-900/30 text-green-400 border border-green-700/30 px-2 py-0.5 rounded hover:bg-green-800/50 transition">{'\u2705'} Publicada</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                })}
              </div>
            ) : ideas.length === 0 ? (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <div className="text-4xl mb-3">{'\uD83D\uDCA1'}</div>
                <p className="text-[#64748b] mb-2">Tu banco de ideas se llena autom\u00e1ticamente con sugerencias de la IA y puedes agregar las tuyas</p>
                <p className="text-xs text-[#475569]">Usa el bot\u00f3n &quot;Agregar idea&quot; para empezar.</p>
              </div>
            ) : (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-8 text-center">
                <p className="text-[#64748b]">Sin ideas con los filtros seleccionados</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: REPORTE */}
        {tab === 'reporte' && (function() {
          var mesReporte = mesGlobal
          var anioReporte = anioGlobal
          var nombreMes = MESES_NOMBRES[mesReporte]
          var anio = anioReporte

          /* Competencia stats — filtrados por mes */
          var postsMes = posts.filter(function(p: any) {
            var fecha = p.fecha_scrape || p.created_at || ''
            return fecha.substring(5, 7) === String(mesReporte).padStart(2, '0')
          })
          var totalPostsComp = postsMes.length
          var totalLikesComp = postsMes.reduce(function(s: number, p: any) { return s + (p.likes || 0) }, 0)
          var totalCommentsComp = postsMes.reduce(function(s: number, p: any) { return s + (p.comments || 0) }, 0)
          var totalEngComp = totalLikesComp + totalCommentsComp
          var avgEngComp = totalPostsComp > 0 ? Math.round(totalEngComp / totalPostsComp) : 0

          /* Contenido stats — filtrados por mes */
          var copiesMesR = copies.filter(function(c: any) { return c.mes === mesReporte })
          var grillasMesR = grillas.filter(function(c: any) { return c.mes === mesReporte })
          var copiesTotal = copiesMesR.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
          var grillaPosts = grillasMesR.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
          var scoreSum = 0; var scoreCount = 0
          copiesMesR.forEach(function(c: any) {
            if (Array.isArray(c.datos)) c.datos.forEach(function(d: any) {
              if (d.score) { scoreSum += d.score; scoreCount++ }
            })
          })
          var avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0

          /* Auditoria data — del mes, con comparación vs anterior */
          var audMes = auditorias.filter(function(a: any) { return a.mes === mesReporte && a.anio === anio })
          var aud = audMes.length > 0 ? audMes[0] : null
          var audIsLatestFallback = false
          // Buscar auditoría del mes anterior para comparación
          var mesAnterior = mesReporte === 1 ? 12 : mesReporte - 1
          var anioAnterior = mesReporte === 1 ? anio - 1 : anio
          var audAnterior = auditorias.find(function(a: any) { return a.mes === mesAnterior && a.anio === anioAnterior })
          var scoreDelta = (aud && audAnterior) ? (aud.score_general || 0) - (audAnterior.score_general || 0) : null

          var criteriosNombres = [
            'Frecuencia de publicaci\u00f3n', 'Engagement rate', 'Consistencia visual', 'Calidad de copies',
            'Uso de hashtags', 'Horarios de publicaci\u00f3n', 'Variedad de formatos', 'Interacci\u00f3n con audiencia',
          ]

          var fortalezas = [] as { nombre: string, val: number }[]
          var mejoras = [] as { nombre: string, val: number }[]
          if (aud && aud.criterios) {
            var pares = (aud.criterios as any[]).map(function(raw: any, i: number) {
              var val = typeof raw === 'object' && raw !== null ? (raw.score || 0) : (raw || 0)
              var nombre = typeof raw === 'object' && raw !== null && raw.nombre ? raw.nombre : (criteriosNombres[i] || 'Criterio ' + (i + 1))
              return { nombre: nombre, val: val }
            })
            pares.sort(function(a: any, b: any) { return b.val - a.val })
            fortalezas = pares.slice(0, 3)
            mejoras = pares.slice(-3).reverse()
          }

          /* Executive summary */
          var summaryText = generateExecutiveSummary(posts, empresas, postsByCompany, copies, auditorias, mesReporte, anio)

          /* Company analyses */
          var companyAnalyses = Object.keys(empresas).map(function(nombre) {
            return generateCompanyAnalysis(nombre, empresas[nombre], postsByCompany[nombre] || [])
          })

          /* Strategic actions */
          var accionesData = generateStrategicActions(posts, empresas, postsByCompany, copies, auditorias)

          /* Copies performance */
          var allCopies = [] as any[]
          copies.forEach(function(batch: any) {
            if (Array.isArray(batch.datos)) {
              batch.datos.forEach(function(c: any) { allCopies.push(c) })
            }
          })
          var copiesSorted = allCopies.slice().sort(function(a: any, b: any) { return (b.score || 0) - (a.score || 0) })

          return <>
            <style dangerouslySetInnerHTML={{ __html: '@media print { .no-print { display: none !important; } .print-break { page-break-inside: avoid; } }' }} />

            <div className="flex items-center justify-end mb-4 no-print">
              <button onClick={function() { window.print() }}
                className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                Descargar PDF
              </button>
            </div>

            <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] overflow-hidden print-break">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs opacity-60 tracking-widest mb-1">M&P COPILOT</p>
                    <h2 className="text-xl font-bold">Reporte ejecutivo — {nombreMes} {anio}</h2>
                    <p className="text-sm opacity-80 mt-1">{sub.nombre || sub.email}</p>
                  </div>
                  <div className="text-right text-xs opacity-60">
                    <p>Generado: {new Date().toLocaleDateString('es-CL')}</p>
                    <p>Plan {sub.plan}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* REPORTE IA — si existe */}
                {(function() {
                  var rep = reportes.length > 0 ? reportes[0] : null
                  var rd = rep && rep.datos ? rep.datos : null
                  if (!rd) return null
                  return <div className="space-y-4 mb-6 border-b border-white/[0.06] pb-6">
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-emerald-400 mb-2">{'\uD83E\uDDE0'} Reporte IA — {rd.titulo || 'Resumen inteligente'}</h3>
                      <p className="text-sm text-[#c4b5fd] leading-relaxed">{rd.resumen_ejecutivo}</p>
                    </div>

                    {rd.acciones_inteligentes && rd.acciones_inteligentes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-white mb-2">Acciones inteligentes</h4>
                        <div className="space-y-2">
                          {rd.acciones_inteligentes.map(function(a: any, ai: number) {
                            var areaColors: any = { competencia: 'border-pink-500/30', contenido: 'border-purple-500/30', paid: 'border-blue-500/30', organico: 'border-green-500/30', comercial: 'border-amber-500/30' }
                            return <div key={ai} className={'bg-[#12102a] rounded-lg p-3 border-l-2 ' + (areaColors[a.area] || 'border-indigo-500/30')}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-indigo-400">#{a.prioridad || ai + 1}</span>
                                <span className="text-[10px] bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded">{a.area || 'general'}</span>
                                {a.plataforma && a.plataforma !== 'general' && <span className={'text-[9px] font-bold px-1.5 py-0.5 rounded ' + (a.plataforma === 'instagram' ? 'bg-pink-900/30 text-pink-400' : a.plataforma === 'linkedin' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400')}>{a.plataforma === 'ambas' ? 'IG+LI' : a.plataforma === 'instagram' ? 'IG' : 'LI'}</span>}
                                <span className="text-[10px] text-[#475569]">{a.plazo || ''}</span>
                              </div>
                              <p className="text-xs text-white font-semibold">{a.accion}</p>
                              <p className="text-[10px] text-[#94a3b8] mt-1">{a.por_que}</p>
                              {a.impacto_esperado && <p className="text-[10px] text-green-400 mt-1">{'\u2192'} {a.impacto_esperado}</p>}
                            </div>
                          })}
                        </div>
                      </div>
                    )}

                    {rd.hallazgos_clave && rd.hallazgos_clave.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-white mb-2">Hallazgos clave</h4>
                        <div className="space-y-1">
                          {rd.hallazgos_clave.map(function(h: any, hi: number) {
                            var icon = h.tipo === 'positivo' ? '\u2705' : h.tipo === 'negativo' ? '\u274C' : '\u26A0\uFE0F'
                            var platBadge = h.plataforma === 'instagram' ? 'bg-pink-900/30 text-pink-400' : h.plataforma === 'linkedin' ? 'bg-blue-900/30 text-blue-400' : h.plataforma === 'ambas' ? 'bg-purple-900/30 text-purple-400' : ''
                            return <div key={hi} className="flex items-start gap-2 text-xs">
                              <span>{icon}</span>
                              <span className="text-[#94a3b8]">{h.plataforma && platBadge && <span className={'text-[9px] font-bold px-1.5 py-0.5 rounded mr-1 ' + platBadge}>{h.plataforma === 'ambas' ? 'IG+LI' : h.plataforma === 'instagram' ? 'IG' : 'LI'}</span>}{h.hallazgo} <span className="text-[#475569]">({h.fuente})</span></span>
                            </div>
                          })}
                        </div>
                      </div>
                    )}

                    {rd.prediccion_mes_siguiente && (
                      <div className="bg-amber-900/10 border border-amber-500/20 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-amber-400 mb-1">Predicci{'ó'}n pr{'ó'}ximo mes</p>
                        <p className="text-xs text-amber-200">{rd.prediccion_mes_siguiente}</p>
                      </div>
                    )}
                  </div>
                })()}

                {/* 1. EXECUTIVE SUMMARY — resumen básico */}
                <div>
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">Resumen competencia</h3>
                  <div className="bg-indigo-900/10 rounded-lg p-4 border-l-4 border-indigo-500">
                    <p className="text-sm text-[#c4b5fd] leading-relaxed">{summaryText}</p>
                  </div>
                </div>

                {/* 2. COMPETENCIA ANALYSIS — per company */}
                <div>
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">An\u00e1lisis por competidor</h3>
                  {(function() {
                    var rubro = sub && sub.perfil_empresa ? (sub.perfil_empresa.rubro || '') : ''
                    var bench = getIndustryBenchmark(rubro)
                    var engExpl = explainMetric(avgEngComp, bench.engPerPost, 'eng', 'eng/post')
                    return <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-indigo-900/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-indigo-400">{totalPostsComp}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">Posts de {Object.keys(empresas).length} competidores</div>
                        <div className="text-[10px] text-[#475569] mt-1">Promedio {Object.keys(empresas).length > 0 ? Math.round(totalPostsComp / Object.keys(empresas).length) : 0} posts por empresa</div>
                      </div>
                      <div className="bg-indigo-900/20 rounded-lg p-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-purple-400">{avgEngComp}</span>
                          <span className="text-sm">{engExpl.emoji}</span>
                        </div>
                        <div className="text-xs text-[#94a3b8] mt-1">Engagement promedio por post</div>
                        <div className="text-[10px] text-[#475569] mt-1">{engExpl.texto}</div>
                        <div className="text-[10px] text-[#64748b] mt-1">Engagement = likes + comentarios por publicaci{'ó'}n. Mide qu{'é'} tanto interact{'ú'}a la audiencia con el contenido.</div>
                      </div>
                      <div className="bg-indigo-900/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-pink-400">{bench.engPerPost}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">Benchmark {bench.label}</div>
                        <div className="text-[10px] text-[#475569] mt-1">Promedio de la industria en Chile. Si tu competencia est{'á'} {engExpl.diff > 0 ? 'sobre' : 'bajo'} este n{'ú'}mero, el mercado es {engExpl.diff > 0 ? 'activo' : 'poco competitivo'} en redes.</div>
                      </div>
                    </div>
                  })()}

                  <div className="space-y-3">
                    {companyAnalyses.map(function(ca, ci) {
                      var isInactive = ca.frecuencia === 0
                      return <div key={ci} className={'rounded-lg p-4 border-l-4 ' + (isInactive ? 'bg-red-900/10 border-red-500' : 'bg-[#12102a] border-indigo-500')}>
                        <p className="text-sm text-[#c4b5fd] leading-relaxed">{ca.resumen}</p>
                        {ca.topPost && (
                          <div className="mt-2 flex items-center gap-3 text-xs">
                            <span className="text-pink-400 font-semibold">Top: {ca.topPostEng} eng</span>
                            <span className="text-[#64748b]">Formato: {ca.formato || 'variado'}</span>
                            <span className="text-[#64748b]">Tema: {ca.tema || 'general'}</span>
                            {ca.diasActivos && <span className="text-[#64748b]">D\u00edas: {ca.diasActivos}</span>}
                          </div>
                        )}
                      </div>
                    })}
                  </div>
                </div>

                {/* 3. CONTENT PERFORMANCE */}
                {allCopies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-3">Rendimiento de contenido generado</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{copiesTotal}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">Copies generados</div>
                      </div>
                      <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{grillaPosts}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">Posts en grilla</div>
                      </div>
                      <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                        <div className={'text-2xl font-bold ' + (avgScore >= 75 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : 'text-red-600')}>{avgScore || '-'}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">Score promedio QA</div>
                      </div>
                    </div>

                    {/* Top copies with analysis */}
                    <div className="space-y-2">
                      {copiesSorted.slice(0, 5).map(function(c: any, ci: number) {
                        var sColor = (c.score || 0) >= 80 ? 'text-green-600' : (c.score || 0) >= 65 ? 'text-yellow-600' : 'text-red-600'
                        return <div key={ci} className="bg-[#12102a] rounded-lg p-3 border-l-4 border-purple-500">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={'text-xs font-bold ' + sColor}>Score {c.score || '-'}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-900/30 text-pink-400">{c.plataforma || ''} {c.tipo || ''}</span>
                            <span className="text-xs text-[#64748b]">{c.angulo || ''}</span>
                          </div>
                          <p className="text-xs font-semibold text-white">{c.titulo || ''}</p>
                          {c.justificacion && <p className="text-xs text-indigo-400 mt-1 italic">{(c.justificacion || '').substring(0, 150)}{(c.justificacion || '').length > 150 ? '...' : ''}</p>}
                          {c.problemas && c.problemas.length > 0 && (
                            <p className="text-[10px] text-red-400 mt-1">Issues: {c.problemas.slice(0, 2).join('; ')}</p>
                          )}
                        </div>
                      })}
                    </div>
                  </div>
                )}

                {/* 4. STRATEGIC ACTIONS */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3">Acciones estrat\u00e9gicas</h3>
                  <div className="space-y-2">
                    {accionesData.map(function(a, ai) {
                      var prioColor = a.prioridad === 'alta' ? 'border-red-500 bg-red-900/10' : 'border-yellow-500 bg-yellow-900/10'
                      var prioLabel = a.prioridad === 'alta' ? 'URGENTE' : 'RECOMENDADO'
                      var prioLabelColor = a.prioridad === 'alta' ? 'text-red-400 bg-red-900/30' : 'text-yellow-400 bg-yellow-900/30'
                      return <div key={ai} className={'rounded-lg p-3 border-l-4 ' + prioColor}>
                        <div className="flex items-start gap-2">
                          <span className={'text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ' + prioLabelColor}>{prioLabel}</span>
                          <p className="text-sm text-[#c4b5fd]">{a.texto}</p>
                        </div>
                      </div>
                    })}
                  </div>
                </div>

                {/* 5. AUDIT SUMMARY */}
                {aud && (
                  <div>
                    <h3 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-3">
                      Auditor{'\u00ed'}a
                      {audIsLatestFallback && <span className="text-xs font-normal text-[#64748b] ml-2">(datos de {MESES_NOMBRES[aud.mes]})</span>}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-teal-900/20 rounded-lg p-4 text-center">
                        {(function() {
                          var scoreVal = aud.score_general || aud.score_global || 0
                          var cc = scoreVal >= 75 ? 'text-green-600' : scoreVal >= 50 ? 'text-yellow-600' : 'text-red-600'
                          return <div className={'text-3xl font-bold ' + cc}>{scoreVal}<span className="text-sm text-[#94a3b8]">/100</span></div>
                        })()}
                        <div className="text-xs text-[#94a3b8] mt-1">Score global</div>
                      </div>
                      <div className="bg-teal-900/20 rounded-lg p-4">
                        <div className="text-xs font-semibold text-green-600 mb-2">Fortalezas</div>
                        {fortalezas.map(function(f, fi) {
                          return <div key={fi} className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[#a5b4fc]">{f.nombre}</span>
                            <span className="text-green-600 font-bold">{f.val}/10</span>
                          </div>
                        })}
                      </div>
                      <div className="bg-teal-900/20 rounded-lg p-4">
                        <div className="text-xs font-semibold text-red-600 mb-2">\u00c1reas a mejorar</div>
                        {mejoras.map(function(m, mi) {
                          return <div key={mi} className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[#a5b4fc]">{m.nombre}</span>
                            <span className="text-red-600 font-bold">{m.val}/10</span>
                          </div>
                        })}
                        {mejoras.length > 0 && (
                          <p className="text-[10px] text-[#64748b] mt-2 italic">Recomendaci\u00f3n: priorizar "{mejoras[0].nombre}" con acciones espec\u00edficas esta semana.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TOP POSTS WITH ANALYSIS */}
                {postsSortedByEngagement.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wider mb-3">Top 5 posts — por qu\u00e9 funcionaron</h3>
                    <div className="space-y-2">
                      {postsSortedByEngagement.slice(0, 5).map(function(p: any, pi: number) {
                        var tema = detectarTema(p.texto || '')
                        var formato = detectarFormato(p.tipo_post || p.type || '')
                        var totalEng = (p.likes || 0) + (p.comments || 0)
                        return <div key={pi} className="bg-pink-900/10 rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <span className="text-white font-bold text-sm bg-pink-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{pi + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-semibold text-white">{p.nombre_empresa || p.handle}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/30 text-purple-400">{tema}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/30 text-indigo-400">{formato}</span>
                              </div>
                              <p className="text-xs text-[#a5b4fc] mb-1">{(p.texto || '').substring(0, 120)}{(p.texto || '').length > 120 ? '...' : ''}</p>
                              <p className="text-[10px] text-[#64748b] italic">
                                Este post funcion\u00f3 porque combina formato {formato} con tema {tema}
                                {totalEng > avgEngComp ? ' — super\u00f3 el promedio de engagement (' + totalEng + ' vs ' + avgEngComp + ' promedio)' : ''}
                                . Oportunidad: replicar este \u00e1ngulo para el cliente.
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-bold text-pink-400">{totalEng.toLocaleString()}</div>
                              <div className="text-[10px] text-[#94a3b8]">engagement</div>
                            </div>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.04] px-6 py-3 bg-[#12102a] text-center">
                <p className="text-[10px] text-[#64748b]">M&P Copilot by Muller y P\u00e9rez &middot; mulleryperez.cl &middot; Generado autom\u00e1ticamente</p>
              </div>
            </div>
          </>
        })()}

        <div className="text-center mt-8 text-xs text-[#64748b]">
          <a href={'/copilot/configurar/' + props.suscripcionId} className="text-indigo-600 font-semibold hover:underline">Configurar cuentas</a>
          <span className="mx-3">|</span>
          <a href="/copilot" className="text-indigo-600 font-semibold hover:underline">Volver a Copilot</a>
        </div>
      </div>
    </div>
  )
}
