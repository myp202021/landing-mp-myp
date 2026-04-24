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

function generateCompanyInsight(nombre: string, data: { ig: number, li: number, likes: number, comments: number }, companyPosts: any[]) {
  var totalPosts = data.ig + data.li
  if (totalPosts === 0) return nombre + ': sin actividad detectada en este periodo.'
  var avgLikes = Math.round(data.likes / totalPosts)
  var avgComments = Math.round(data.comments / totalPosts)

  // Find most common content theme from post text
  var textos = companyPosts.map(function(p: any) { return (p.texto || '').toLowerCase() })
  var keywords: Record<string, number> = {}
  var temas = [
    { kw: ['oferta', 'descuento', 'promo', 'precio'], label: 'promocional' },
    { kw: ['equipo', 'team', 'cultura', 'oficina', 'trabajo'], label: 'cultura empresarial' },
    { kw: ['tip', 'consejo', 'aprende', 'sab\u00edas', 'dato'], label: 'educativo' },
    { kw: ['nuevo', 'lanzamiento', 'nueva', 'novedad'], label: 'lanzamientos' },
    { kw: ['cliente', 'testimonio', 'caso', 'resultado'], label: 'casos de \u00e9xito' },
    { kw: ['evento', 'webinar', 'charla', 'conferencia'], label: 'eventos' },
  ]
  temas.forEach(function(tema) {
    var count = 0
    textos.forEach(function(t) {
      tema.kw.forEach(function(k) { if (t.includes(k)) count++ })
    })
    if (count > 0) keywords[tema.label] = count
  })
  var topTema = ''
  var maxCount = 0
  Object.keys(keywords).forEach(function(k) {
    if (keywords[k] > maxCount) { maxCount = keywords[k]; topTema = k }
  })

  var red = data.ig > 0 ? 'IG' : ''
  var parts = [nombre + ': ' + totalPosts + ' posts' + (red ? ' ' + red : '')]
  parts.push('promedio ' + avgLikes + ' likes')
  if (avgComments > 0) parts.push(avgComments + ' comentarios')
  if (topTema) parts.push('Enfoque: contenido ' + topTema + '.')
  else parts.push('Contenido variado.')
  return parts.join(', ')
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
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')
  var [periodo, setPeriodo] = useState('7d')
  var [tab, setTab] = useState('competencia')
  var [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1)
  var [ideaForm, setIdeaForm] = useState(false)
  var [ideaTitulo, setIdeaTitulo] = useState('')
  var [ideaDesc, setIdeaDesc] = useState('')
  var [ideaCat, setIdeaCat] = useState('educativo')
  var [ideaPri, setIdeaPri] = useState('media')
  var [ideaSaving, setIdeaSaving] = useState(false)
  var [ideaFiltroCategoria, setIdeaFiltroCategoria] = useState('todas')
  var [ideaFiltroEstado, setIdeaFiltroEstado] = useState('todos')
  var [copiedIndex, setCopiedIndex] = useState(null as string | null)

  useEffect(function() { loadData() }, [periodo, mesFiltro])

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
    } catch (e) { setError('Error cargando datos') }
    setLoading(false)
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(function() {
      setCopiedIndex(key)
      setTimeout(function() { setCopiedIndex(null) }, 2000)
    })
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
  var grillasMes = grillas.filter(function(c: any) { return c.mes === mesFiltro })
  var copiesMes = copies.filter(function(c: any) { return c.mes === mesFiltro })

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

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-[#12102a] rounded-xl p-1 overflow-x-auto">
          {[
            { key: 'competencia', label: 'Competencia', icon: '\uD83D\uDD0D', color: 'text-indigo-700' },
            { key: 'contenido', label: 'Contenido', icon: '\u270D\uFE0F', color: 'text-purple-700' },
            { key: 'auditoria', label: 'Auditor\u00EDa', icon: '\uD83D\uDCCA', color: 'text-teal-700' },
            { key: 'guiones', label: 'Guiones', icon: '\uD83C\uDFAC', color: 'text-pink-700' },
            { key: 'ideas', label: 'Ideas', icon: '\uD83D\uDCA1', color: 'text-amber-700' },
            { key: 'reporte', label: 'Reporte', icon: '\uD83D\uDCCB', color: 'text-emerald-700' },
          ].map(function(t) {
            return <button key={t.key} onClick={function() { setTab(t.key) }} className={'flex-shrink-0 flex-1 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap px-3 ' + (tab === t.key ? 'bg-[#1a1745] ' + t.color + ' shadow-sm' : 'text-[#64748b] hover:text-[#c4b5fd]')}>
              <span className="mr-1">{t.icon}</span> {t.label}
            </button>
          })}
        </div>

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

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-indigo-600">{totalPosts}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Posts detectados</div>
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-purple-600">{totalLikes.toLocaleString()}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Likes total</div>
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-pink-600">{totalComments.toLocaleString()}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Comentarios total</div>
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-white">{Object.keys(empresas).length}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Empresas</div>
              </div>
            </div>

            {diasOrdenados.length > 1 && (
              <div className="bg-[#1a1745] rounded-xl p-6 border border-white/[0.06] mb-8">
                <h2 className="text-sm font-bold text-white mb-4">Posts detectados por d\u00eda</h2>
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

            {/* Company table with insights */}
            <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-white/[0.04]">
                <h2 className="text-sm font-bold text-white">Actividad por empresa</h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {Object.keys(empresas).map(function(nombre, i) {
                  var e = empresas[nombre]
                  var total = e.ig + e.li
                  var avgLikes = total > 0 ? Math.round(e.likes / total) : 0
                  var inactive = total === 0
                  var insight = generateCompanyInsight(nombre, e, postsByCompany[nombre] || [])
                  return <div key={nombre} className={'px-6 py-4 ' + (inactive ? 'bg-red-900/10' : i % 2 === 0 ? '' : 'bg-[#12102a]')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={'font-semibold text-sm ' + (inactive ? 'text-red-400' : 'text-white')}>{nombre}</span>
                      <div className="flex items-center gap-4 text-xs">
                        {e.ig > 0 && <span className="text-pink-400 font-semibold">{e.ig} IG</span>}
                        <span className="text-white font-bold">{total} posts</span>
                        <span className="text-[#a5b4fc]">{e.likes.toLocaleString()} likes</span>
                        <span className="text-[#a5b4fc]">{e.comments.toLocaleString()} comments</span>
                        <span className="text-[#94a3b8]">Prom: {avgLikes} likes/post</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#64748b] italic">{insight}</p>
                  </div>
                })}
              </div>
            </div>

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
                        <span className="text-white text-xs font-bold bg-pink-600 px-2 py-0.5 rounded">IG</span>
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
                {posts.length === 0 && <div className="px-6 py-8 text-center text-[#64748b]">Sin posts en este periodo. Los datos se acumulan con cada informe diario.</div>}
              </div>
            </div>
          </>
        )}

        {/* TAB: CONTENIDO */}
        {tab === 'contenido' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10,11,12].filter(function(m) {
                  return contenido.some(function(c: any) { return c.mes === m }) || m === new Date().getMonth() + 1
                }).map(function(m) {
                  return <button key={m} onClick={function() { setMesFiltro(m) }}
                    className={'px-3 py-2 rounded-lg text-sm font-semibold transition ' + (mesFiltro === m ? 'bg-purple-600 text-white' : 'bg-[#1a1745] text-[#a5b4fc] border border-white/[0.06] hover:border-purple-300')}>
                    {MESES_NOMBRES[m].substring(0, 3)}
                  </button>
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-purple-600">{totalCopies}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Copies generados (total)</div>
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-indigo-600">{totalGrillaPosts}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Posts en grillas (total)</div>
              </div>
              <div className="bg-[#1a1745] rounded-xl p-5 border border-white/[0.06] text-center">
                <div className="text-3xl font-bold text-green-600">{grillas.length + copies.length}</div>
                <div className="text-xs text-[#94a3b8] mt-1">Entregas realizadas</div>
              </div>
            </div>

            {/* GRILLA MENSUAL */}
            {grillasMes.length > 0 && (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-white/[0.04] flex justify-between items-center">
                  <h2 className="text-sm font-bold text-white">Grilla {MESES_NOMBRES[mesFiltro]} — {grillasMes[0].datos.length} posts</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#64748b]">Score promedio: {grillasMes[0].score_promedio || '-'}</span>
                    <a href={'/api/copilot/export-grilla?id=' + props.suscripcionId + '&mes=' + mesFiltro} className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Descargar Excel</a>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1e1b4b] border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-left font-semibold text-[#c4b5fd] w-16">#</th>
                      <th className="px-4 py-3 text-left font-semibold text-[#c4b5fd] w-24">Fecha</th>
                      <th className="px-4 py-3 text-left font-semibold text-[#c4b5fd] w-24">Plataforma</th>
                      <th className="px-4 py-3 text-left font-semibold text-[#c4b5fd] w-20">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold text-[#c4b5fd]">Copy</th>
                      <th className="px-4 py-3 text-center font-semibold text-[#c4b5fd] w-16">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(grillasMes[0].datos || []).map(function(g: any, i: number) {
                      var scoreColor = (g.score || 0) >= 80 ? 'text-green-600' : (g.score || 0) >= 70 ? 'text-yellow-600' : 'text-red-600'
                      return <tr key={i} className={'border-b border-white/[0.04] ' + (i % 2 === 0 ? '' : 'bg-[#12102a]')}>
                        <td className="px-4 py-3 text-[#94a3b8] font-semibold">{i + 1}</td>
                        <td className="px-4 py-3 text-[#c4b5fd] text-xs">{g.fecha_sugerida || g.dia_semana || 'D\u00eda ' + (g.dia || i+1)}</td>
                        <td className="px-4 py-3">
                          <span className={'text-white text-[10px] font-bold px-2 py-1 rounded ' + ((g.plataforma || '').includes('Instagram') ? 'bg-pink-500' : 'bg-blue-500')}>
                            {(g.plataforma || 'IG').substring(0, 2).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#a5b4fc]">{g.tipo_post || g.tipo || '-'}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white text-xs mb-1">{g.titulo || g.titulo_grafico || g.gancho || ''}</p>
                          <p className="text-xs text-[#94a3b8] whitespace-pre-line">{g.copy || ''}</p>
                          {g.hashtags && (
                            <p className="text-xs text-indigo-400 mt-1">{Array.isArray(g.hashtags) ? g.hashtags.join(' ') : g.hashtags}</p>
                          )}
                        </td>
                        <td className={'px-4 py-3 text-center font-bold ' + scoreColor}>{g.score || '-'}</td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* COPIES SEMANALES — consistent format for all months */}
            {copiesMes.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-sm font-bold text-white">Copies sugeridos — {MESES_NOMBRES[mesFiltro]}</h2>
                {copiesMes.map(function(batch: any, bi: number) {
                  return <div key={bi} className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-[#94a3b8]">Semana {batch.semana || bi + 1} | {(batch.created_at || '').substring(0, 10)}</span>
                      <span className="text-xs text-[#64748b]">Score promedio: {batch.score_promedio || '-'}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {(batch.datos || []).map(function(c: any, ci: number) {
                        var copyKey = 'copy-' + bi + '-' + ci
                        var fullText = c.copy || ''
                        var hashtags = c.hashtags || ''
                        var hashtagStr = Array.isArray(hashtags) ? hashtags.join(' ') : (typeof hashtags === 'string' ? hashtags : '')
                        return <div key={ci} className="border border-white/[0.04] rounded-lg p-4 hover:bg-white/[0.04]">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-900/30 text-pink-400">{c.plataforma || 'IG'} {c.tipo || ''}</span>
                            <span className="text-xs text-[#64748b]">{c.angulo || ''}</span>
                            {c.score && <span className={'text-xs font-bold ' + (c.score >= 80 ? 'text-green-600' : 'text-yellow-600')}>Score: {c.score}</span>}
                            <button onClick={function() { copyToClipboard(fullText + (hashtagStr ? '\n\n' + hashtagStr : ''), copyKey) }}
                              className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded bg-white/5 text-[#a5b4fc] hover:bg-white/10 transition border border-white/10">
                              {copiedIndex === copyKey ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>
                          <p className="font-semibold text-sm text-white mb-1">{c.titulo || ''}</p>
                          <p className="text-xs text-[#a5b4fc] whitespace-pre-line">{fullText.substring(0, 500)}{fullText.length > 500 ? '...' : ''}</p>
                          {hashtagStr && (
                            <p className="text-xs text-indigo-400 mt-2 pt-2 border-t border-white/[0.04]">{hashtagStr}</p>
                          )}
                          {c.justificacion && <p className="text-xs text-indigo-600 mt-2">{c.justificacion}</p>}
                        </div>
                      })}
                    </div>
                  </div>
                })}
              </div>
            )}

            {grillasMes.length === 0 && copiesMes.length === 0 && (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <p className="text-[#64748b] mb-2">Sin contenido generado para {MESES_NOMBRES[mesFiltro]}</p>
                <p className="text-xs text-[#475569]">Los copies se generan cada lunes. La grilla se genera el 1ro de cada mes.</p>
              </div>
            )}
          </>
        )}

        {/* TAB: AUDITORIA */}
        {tab === 'auditoria' && (function() {
          var mesAuditoria = mesFiltro
          var anioAuditoria = new Date().getFullYear()
          var audMes = auditorias.filter(function(a: any) { return a.mes === mesAuditoria && a.anio === anioAuditoria })
          var aud = audMes.length > 0 ? audMes[0] : null

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
            if ((aud.score_ig || 0) > 0) networkScores.push({ label: 'Instagram', key: 'score_ig', color: 'bg-pink-500', val: aud.score_ig || 0 })
            if ((aud.score_li || 0) > 0) networkScores.push({ label: 'LinkedIn', key: 'score_li', color: 'bg-blue-600', val: aud.score_li || 0 })
          }

          return <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(function(m) {
                return <button key={m} onClick={function() { setMesFiltro(m) }}
                  className={'px-3 py-2 rounded-lg text-sm font-semibold transition ' + (mesFiltro === m ? 'bg-teal-600 text-white' : 'bg-[#1a1745] text-[#a5b4fc] border border-white/[0.06] hover:border-teal-300')}>
                  {MESES_NOMBRES[m].substring(0, 3)}
                </button>
              })}
            </div>

            {aud ? (
              <>
                <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Auditor\u00eda de {MESES_NOMBRES[mesAuditoria]} {anioAuditoria}</h2>
                      {aud.proxima_auditoria && <p className="text-xs text-[#64748b] mt-1">Pr\u00f3xima auditor\u00eda: {aud.proxima_auditoria}</p>}
                    </div>
                    {/* Score circle */}
                    {(function() {
                      var cc = overallCircleColor(aud.score_global || 0)
                      return <div className={'flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 ' + cc.ring + ' ' + cc.bg}>
                        <div className={'text-3xl font-black ' + cc.text}>{aud.score_global || 0}</div>
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

                  {/* Criteria breakdown with recommendations */}
                  <h3 className="text-sm font-bold text-white mb-3">Detalle por criterio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(aud.criterios || []).map(function(raw: any, ci: number) {
                      var cr = parseCriterio(raw, ci)
                      var recText = criterioRecommendation(cr.score)
                      var recColor = criterioRecommendationColor(cr.score)
                      return <div key={ci} className="bg-[#12102a] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-[#a5b4fc] font-semibold">{cr.nombre}</div>
                          <span className={'text-sm font-bold ' + scoreColor(cr.score)}>{cr.score}/10</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                          <div className={scoreBg(cr.score) + ' h-2 rounded-full transition-all'} style={{ width: (cr.score * 10) + '%' }} />
                        </div>
                        <p className={'text-[11px] ' + recColor}>{recText}</p>
                      </div>
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#1a1745] rounded-xl border border-white/[0.06] px-6 py-12 text-center">
                <div className="text-4xl mb-3">{'\uD83D\uDCCA'}</div>
                <p className="text-[#64748b] mb-2">La auditor\u00eda de {MESES_NOMBRES[mesAuditoria]} se genera el d\u00eda 1 de cada mes</p>
                <p className="text-xs text-[#475569]">Revisa los meses anteriores para ver auditor\u00edas completadas.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: GUIONES */}
        {tab === 'guiones' && (function() {
          var guionesMes = guiones.filter(function(g: any) { return g.mes === mesFiltro })

          return <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10,11,12].filter(function(m) {
                return guiones.some(function(g: any) { return g.mes === m }) || m === new Date().getMonth() + 1
              }).map(function(m) {
                return <button key={m} onClick={function() { setMesFiltro(m) }}
                  className={'px-3 py-2 rounded-lg text-sm font-semibold transition ' + (mesFiltro === m ? 'bg-pink-600 text-white' : 'bg-[#1a1745] text-[#a5b4fc] border border-white/[0.06] hover:border-pink-300')}>
                  {MESES_NOMBRES[m].substring(0, 3)}
                </button>
              })}
            </div>

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
                        {/* Gancho — always show if available */}
                        {s.gancho && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">Gancho</span>
                            <p className="text-[#c4b5fd] mt-1">{s.gancho}</p>
                          </div>
                        )}

                        {/* Escenas — if the script has escenas array, render each */}
                        {hasEscenas && s.escenas.map(function(escena: any, ei: number) {
                          return <div key={ei} className="py-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Escena {ei + 1}</span>
                              {escena.timing && <span className="text-[10px] text-[#64748b] font-semibold">{escena.timing}</span>}
                            </div>
                            {escena.texto && <p className="text-[#a5b4fc] mt-1 whitespace-pre-line">{escena.texto}</p>}
                            {escena.text && !escena.texto && <p className="text-[#a5b4fc] mt-1 whitespace-pre-line">{escena.text}</p>}
                            {escena.visual && <p className="text-xs text-[#94a3b8] mt-1 italic">Visual: {escena.visual}</p>}
                          </div>
                        })}

                        {/* Desarrollo — old format fallback */}
                        {!hasEscenas && s.desarrollo && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Desarrollo</span>
                            <p className="text-[#a5b4fc] mt-1 whitespace-pre-line">{s.desarrollo}</p>
                          </div>
                        )}

                        {/* Cierre / CTA */}
                        {s.cierre && (
                          <div className="py-3 border-b border-white/[0.06]">
                            <span className="text-[10px] font-semibold text-pink-600 uppercase tracking-wider">Cierre / CTA</span>
                            <p className="text-[#c4b5fd] mt-1">{s.cierre}</p>
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
                <p className="text-[#64748b] mb-2">Los guiones se generan cada lunes junto con los copies semanales</p>
                <p className="text-xs text-[#475569]">Selecciona un mes con contenido generado.</p>
              </div>
            )}
          </>
        })()}

        {/* TAB: IDEAS */}
        {tab === 'ideas' && (function() {
          var categorias = ['educativo', 'entretenimiento', 'producto', 'testimonial', 'tendencia', 'behind-the-scenes']
          var estados = ['nueva', 'en_progreso', 'publicada', 'descartada']

          var ideasFiltradas = ideas.filter(function(idea: any) {
            if (ideaFiltroCategoria !== 'todas' && idea.categoria !== ideaFiltroCategoria) return false
            if (ideaFiltroEstado !== 'todos' && idea.estado !== ideaFiltroEstado) return false
            return true
          })

          var conteoEstados = { nueva: 0, en_progreso: 0, publicada: 0, descartada: 0 } as Record<string, number>
          ideas.forEach(function(idea: any) {
            if (conteoEstados[idea.estado] !== undefined) conteoEstados[idea.estado]++
          })

          function estadoColor(e: string) {
            if (e === 'nueva') return 'bg-blue-900/30 text-blue-400'
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
            if (e === 'en_progreso') return 'En progreso'
            if (e === 'publicada') return 'Publicada'
            return 'Descartada'
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
            <div className="grid grid-cols-4 gap-4 mb-6">
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
                      <span className="text-[10px] text-[#64748b] flex-shrink-0">{(idea.created_at || '').substring(0, 10)}</span>
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
          var mesReporte = mesFiltro
          var nombreMes = MESES_NOMBRES[mesReporte]
          var anio = new Date().getFullYear()

          /* Competencia stats */
          var totalPostsComp = posts.length
          var totalLikesComp = posts.reduce(function(s: number, p: any) { return s + (p.likes || 0) }, 0)
          var totalCommentsComp = posts.reduce(function(s: number, p: any) { return s + (p.comments || 0) }, 0)
          var topCompetidor = ''
          var maxPostsEmp = 0
          Object.keys(empresas).forEach(function(n) {
            var t = empresas[n].ig + empresas[n].li
            if (t > maxPostsEmp) { maxPostsEmp = t; topCompetidor = n }
          })

          // Top competitor by engagement
          var topEngCompetidor = ''
          var maxEng = 0
          Object.keys(empresas).forEach(function(n) {
            var eng = empresas[n].likes + empresas[n].comments
            if (eng > maxEng) { maxEng = eng; topEngCompetidor = n }
          })

          /* Contenido stats */
          var copiesTotal = copies.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
          var grillaPosts = grillas.reduce(function(s: number, c: any) { return s + (Array.isArray(c.datos) ? c.datos.length : 0) }, 0)
          var scoreSum = 0; var scoreCount = 0
          grillas.forEach(function(g: any) {
            if (Array.isArray(g.datos)) g.datos.forEach(function(d: any) {
              if (d.score) { scoreSum += d.score; scoreCount++ }
            })
          })
          var avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0

          /* Auditoria data */
          var audMes = auditorias.filter(function(a: any) { return a.mes === mesReporte && a.anio === anio })
          var aud = audMes.length > 0 ? audMes[0] : null

          var criteriosNombres = [
            'Frecuencia de publicaci\u00f3n', 'Engagement rate', 'Consistencia visual', 'Calidad de copies',
            'Uso de hashtags', 'Horarios de publicaci\u00f3n', 'Variedad de formatos', 'Interacci\u00f3n con audiencia',
          ]

          var fortalezas = [] as string[]
          var mejoras = [] as string[]
          if (aud && aud.criterios) {
            var pares = (aud.criterios as any[]).map(function(raw: any, i: number) {
              var val = typeof raw === 'object' && raw !== null ? (raw.score || 0) : (raw || 0)
              var nombre = typeof raw === 'object' && raw !== null && raw.nombre ? raw.nombre : (criteriosNombres[i] || 'Criterio ' + (i + 1))
              return { nombre: nombre, val: val }
            })
            pares.sort(function(a: any, b: any) { return b.val - a.val })
            fortalezas = pares.slice(0, 3).map(function(p: any) { return p.nombre + ' (' + p.val + '/10)' })
            mejoras = pares.slice(-3).reverse().map(function(p: any) { return p.nombre + ' (' + p.val + '/10)' })
          }

          /* Acciones */
          var acciones = [] as string[]
          if (totalPostsComp > 0 && topCompetidor) acciones.push('Analizar la estrategia de ' + topCompetidor + ' que lider\u00f3 con ' + maxPostsEmp + ' posts')
          if (topEngCompetidor && topEngCompetidor !== topCompetidor) acciones.push(topEngCompetidor + ' lidera en engagement con ' + maxEng.toLocaleString() + ' interacciones — estudiar su formato')
          if (copiesTotal > 0) acciones.push('Publicar los ' + copiesTotal + ' copies generados esta semana')
          if (aud && mejoras.length > 0) acciones.push('Mejorar ' + mejoras[0].split(' (')[0].toLowerCase() + ' — \u00e1rea con menor score en la auditor\u00eda')
          if (grillaPosts > 0) acciones.push('Seguir la grilla de ' + grillaPosts + ' posts planificados para el mes')
          acciones.push('Revisar el dashboard la pr\u00f3xima semana para nuevos insights')

          return <>
            <style dangerouslySetInnerHTML={{ __html: '@media print { .no-print { display: none !important; } .print-break { page-break-inside: avoid; } }' }} />

            <div className="flex items-center justify-between mb-6 no-print">
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(function(m) {
                  return <button key={m} onClick={function() { setMesFiltro(m) }}
                    className={'px-3 py-2 rounded-lg text-sm font-semibold transition ' + (mesFiltro === m ? 'bg-emerald-600 text-white' : 'bg-[#1a1745] text-[#a5b4fc] border border-white/[0.06] hover:border-emerald-300')}>
                    {MESES_NOMBRES[m].substring(0, 3)}
                  </button>
                })}
              </div>
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
                {/* Section 1: Competencia */}
                <div>
                  <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">Competencia</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-indigo-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">{totalPostsComp}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">Posts detectados</div>
                    </div>
                    <div className="bg-indigo-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{totalLikesComp.toLocaleString()}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">Likes totales</div>
                    </div>
                    <div className="bg-indigo-900/20 rounded-lg p-4 text-center">
                      <div className="text-sm font-bold text-indigo-600">{topCompetidor || '-'}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">M\u00e1s activo ({maxPostsEmp} posts)</div>
                    </div>
                    <div className="bg-indigo-900/20 rounded-lg p-4 text-center">
                      <div className="text-sm font-bold text-indigo-600">{topEngCompetidor || '-'}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">Mayor engagement</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2 italic">vs mes anterior: datos comparativos disponibles pr\u00f3ximamente</p>
                </div>

                {/* Section 2: Contenido */}
                <div>
                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-3">Tu contenido</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{copiesTotal}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">Copies generados</div>
                    </div>
                    <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{grillaPosts}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">Posts en grilla</div>
                    </div>
                    <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{avgScore || '-'}</div>
                      <div className="text-xs text-[#94a3b8] mt-1">Score promedio QA</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2 italic">vs mes anterior: tendencia de producci\u00f3n disponible pr\u00f3ximamente</p>
                </div>

                {/* Section 3: Auditoria */}
                <div>
                  <h3 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-3">Auditor\u00eda</h3>
                  {aud ? (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="bg-teal-900/20 rounded-lg p-4 text-center">
                          {(function() {
                            var cc = aud.score_global >= 75 ? 'text-green-600' : aud.score_global >= 50 ? 'text-yellow-600' : 'text-red-600'
                            return <div className={'text-2xl font-bold ' + cc}>{aud.score_global}/100</div>
                          })()}
                          <div className="text-xs text-[#94a3b8] mt-1">Score global</div>
                        </div>
                        <div className="bg-teal-900/20 rounded-lg p-4">
                          <div className="text-xs font-semibold text-green-600 mb-1">Fortalezas</div>
                          {fortalezas.map(function(f, fi) { return <div key={fi} className="text-xs text-[#a5b4fc]">{f}</div> })}
                        </div>
                        <div className="bg-teal-900/20 rounded-lg p-4">
                          <div className="text-xs font-semibold text-red-600 mb-1">\u00c1reas a mejorar</div>
                          {mejoras.map(function(m, mi) { return <div key={mi} className="text-xs text-[#a5b4fc]">{m}</div> })}
                        </div>
                      </div>
                      <p className="text-xs text-[#64748b] italic">vs mes anterior: evoluci\u00f3n de score disponible pr\u00f3ximamente</p>
                    </>
                  ) : (
                    <p className="text-sm text-[#64748b]">Sin auditor\u00eda disponible para este mes</p>
                  )}
                </div>

                {/* Section 4: Engagement highlights */}
                {postsSortedByEngagement.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wider mb-3">Top 3 posts por engagement</h3>
                    <div className="space-y-2">
                      {postsSortedByEngagement.slice(0, 3).map(function(p: any, pi: number) {
                        return <div key={pi} className="bg-pink-900/10 rounded-lg p-3 flex items-center gap-3">
                          <span className="text-white font-bold text-sm bg-pink-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{pi + 1}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-white">{p.nombre_empresa || p.handle}</span>
                            <p className="text-xs text-[#a5b4fc] truncate">{(p.texto || '').substring(0, 100)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-pink-400">{(p.likes || 0).toLocaleString()} likes</div>
                            <div className="text-xs text-[#94a3b8]">{(p.comments || 0).toLocaleString()} comments</div>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                )}

                {/* Section 5: Acciones */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3">Pr\u00f3ximas acciones</h3>
                  <ul className="space-y-2">
                    {acciones.map(function(a, ai) {
                      return <li key={ai} className="flex items-start gap-2 text-sm text-[#c4b5fd]">
                        <span className="text-emerald-500 font-bold mt-0.5">{'>'}</span>
                        {a}
                      </li>
                    })}
                  </ul>
                </div>
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
