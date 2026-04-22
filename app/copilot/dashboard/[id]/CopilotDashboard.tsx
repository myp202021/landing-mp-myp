'use client'

import React, { useState, useEffect } from 'react'

var SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ'

function hdrs() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' }
}

export default function CopilotDashboard(props: { suscripcionId: string }) {
  var [sub, setSub] = useState(null as any)
  var [posts, setPosts] = useState([] as any[])
  var [contenido, setContenido] = useState([] as any[])
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')
  var [periodo, setPeriodo] = useState('7d')
  var [tab, setTab] = useState('competencia')
  var [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1)

  useEffect(function() { loadData() }, [periodo])

  async function loadData() {
    setLoading(true)
    try {
      var r1 = await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId + '&select=*', { headers: hdrs() })
      var subs = await r1.json()
      if (!subs || subs.length === 0) { setError('Suscripcion no encontrada'); setLoading(false); return }
      setSub(subs[0])

      var dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
      var desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      var r2 = await fetch(SUPABASE_URL + '/rest/v1/radar_posts?suscripcion_id=eq.' + props.suscripcionId + '&fecha_scrape=gte.' + desde + '&select=*&order=fecha_scrape.desc', { headers: hdrs() })
      var data = await r2.json()
      setPosts(Array.isArray(data) ? data : [])

      var r3 = await fetch(SUPABASE_URL + '/rest/v1/radar_contenido?suscripcion_id=eq.' + props.suscripcionId + '&select=*&order=created_at.desc', { headers: hdrs() })
      var cData = await r3.json()
      setContenido(Array.isArray(cData) ? cData : [])
    } catch (e) { setError('Error cargando datos') }
    setLoading(false)
  }

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><p className="text-xl font-bold text-gray-900 mb-2">Radar</p><p className="text-gray-500">{error}</p></div>
    </div>
  )

  if (loading || !sub) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Cargando tu Radar...</p>
    </div>
  )

  var cuentas = (sub.cuentas || []).filter(function(c: any) { return c.red !== 'prensa' })
  var empresas = {} as Record<string, { ig: number, li: number, fb: number, likes: number, comments: number }>
  cuentas.forEach(function(c: any) {
    if (c.nombre && !empresas[c.nombre]) empresas[c.nombre] = { ig: 0, li: 0, fb: 0, likes: 0, comments: 0 }
  })
  posts.forEach(function(p: any) {
    var nombre = p.nombre_empresa || p.handle
    if (!empresas[nombre]) empresas[nombre] = { ig: 0, li: 0, fb: 0, likes: 0, comments: 0 }
    if (p.red === 'Instagram') empresas[nombre].ig++
    else if (p.red === 'LinkedIn') empresas[nombre].li++
    else if (p.red === 'Facebook') empresas[nombre].fb++
    empresas[nombre].likes += (p.likes || 0)
    empresas[nombre].comments += (p.comments || 0)
  })

  var totalPosts = posts.length
  var totalLikes = posts.reduce(function(s: number, p: any) { return s + (p.likes || 0) }, 0)
  var redes = new Set(posts.map(function(p: any) { return p.red }))

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
    <div className="min-h-screen bg-gray-50">
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
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          <button onClick={function() { setTab('competencia') }} className={'flex-1 py-2.5 rounded-lg text-sm font-semibold transition ' + (tab === 'competencia' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            Competencia
          </button>
          <button onClick={function() { setTab('contenido') }} className={'flex-1 py-2.5 rounded-lg text-sm font-semibold transition ' + (tab === 'contenido' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            Contenido ({totalCopies + totalGrillaPosts})
          </button>
        </div>

        {/* TAB: COMPETENCIA */}
        {tab === 'competencia' && (
          <>
            <div className="flex gap-2 mb-6">
              {['7d', '30d', '90d'].map(function(p) {
                return <button key={p} onClick={function() { setPeriodo(p) }}
                  className={'px-4 py-2 rounded-lg text-sm font-semibold transition ' + (periodo === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>
                  {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
                </button>
              })}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-indigo-600">{totalPosts}</div>
                <div className="text-xs text-gray-500 mt-1">Posts detectados</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-purple-600">{totalLikes.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Likes total</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-green-600">{redes.size}</div>
                <div className="text-xs text-gray-500 mt-1">Redes activas</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-gray-900">{Object.keys(empresas).length}</div>
                <div className="text-xs text-gray-500 mt-1">Empresas</div>
              </div>
            </div>

            {diasOrdenados.length > 1 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Posts detectados por dia</h2>
                <div className="flex items-end gap-1" style={{ height: '120px' }}>
                  {diasOrdenados.map(function(d) {
                    var h = Math.max(4, (porDia[d] / maxPostsDia) * 100)
                    return <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500 font-semibold">{porDia[d]}</span>
                      <div style={{ height: h + '%', minHeight: '4px' }} className="w-full bg-indigo-500 rounded-t-sm" />
                      <span className="text-[9px] text-gray-400">{d.substring(5)}</span>
                    </div>
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">Actividad por empresa</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Empresa</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">IG</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">LI</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">FB</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Likes</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Eng.</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(empresas).map(function(nombre, i) {
                    var e = empresas[nombre]
                    var total = e.ig + e.li + e.fb
                    var avg = total > 0 ? Math.round(e.likes / total) : 0
                    var inactive = total === 0
                    return <tr key={nombre} className={'border-b border-gray-100 ' + (inactive ? 'bg-red-50' : i % 2 === 0 ? '' : 'bg-gray-50')}>
                      <td className={'px-6 py-3 font-semibold ' + (inactive ? 'text-red-700' : 'text-gray-900')}>{nombre}</td>
                      <td className="px-4 py-3 text-center">{e.ig > 0 ? <strong>{e.ig}</strong> : <span className="text-gray-300">0</span>}</td>
                      <td className="px-4 py-3 text-center">{e.li > 0 ? <strong>{e.li}</strong> : <span className="text-gray-300">0</span>}</td>
                      <td className="px-4 py-3 text-center">{e.fb > 0 ? <strong>{e.fb}</strong> : <span className="text-gray-300">0</span>}</td>
                      <td className="px-4 py-3 text-center font-bold">{total}</td>
                      <td className="px-4 py-3 text-center">{e.likes.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">{avg.toLocaleString()}</td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">Ultimos posts detectados</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {posts.slice(0, 20).map(function(p: any, i: number) {
                  var redColor = p.red === 'Instagram' ? '#E4405F' : p.red === 'LinkedIn' ? '#0A66C2' : p.red === 'Facebook' ? '#1877F2' : '#d97706'
                  return <div key={i} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div style={{ background: redColor }} className="text-white text-[10px] font-bold px-2 py-1 rounded mt-0.5 flex-shrink-0">{p.red === 'Instagram' ? 'IG' : p.red === 'LinkedIn' ? 'LI' : p.red === 'Facebook' ? 'FB' : 'PR'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{p.nombre_empresa || p.handle}</span>
                          <span className="text-xs text-gray-400">{(p.fecha_scrape || '').substring(0, 10)}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{(p.texto || '').substring(0, 200)}</p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-400">
                          <span>{(p.likes || 0).toLocaleString()} likes</span>
                          <span>{(p.comments || 0).toLocaleString()} comments</span>
                          {p.post_url && <a href={p.post_url} target="_blank" className="text-indigo-600 font-semibold">Ver post</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                })}
                {posts.length === 0 && <div className="px-6 py-8 text-center text-gray-400">Sin posts en este periodo. Los datos se acumulan con cada informe diario.</div>}
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
                    className={'px-3 py-2 rounded-lg text-sm font-semibold transition ' + (mesFiltro === m ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300')}>
                    {MESES_NOMBRES[m].substring(0, 3)}
                  </button>
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-purple-600">{totalCopies}</div>
                <div className="text-xs text-gray-500 mt-1">Copies generados (total)</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-indigo-600">{totalGrillaPosts}</div>
                <div className="text-xs text-gray-500 mt-1">Posts en grillas (total)</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-green-600">{grillas.length + copies.length}</div>
                <div className="text-xs text-gray-500 mt-1">Entregas realizadas</div>
              </div>
            </div>

            {/* GRILLA MENSUAL */}
            {grillasMes.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-900">Grilla {MESES_NOMBRES[mesFiltro]} — {grillasMes[0].datos.length} posts</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Score promedio: {grillasMes[0].score_promedio || '-'}</span>
                    <a href={'/api/copilot/dashboard/export-grilla?id=' + props.suscripcionId + '&mes=' + mesFiltro} className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Descargar Excel</a>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 w-16">#</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 w-24">Fecha</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 w-24">Plataforma</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 w-20">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Copy</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 w-16">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(grillasMes[0].datos || []).map(function(g: any, i: number) {
                      var scoreColor = (g.score || 0) >= 80 ? 'text-green-600' : (g.score || 0) >= 70 ? 'text-yellow-600' : 'text-red-600'
                      return <tr key={i} className={'border-b border-gray-100 ' + (i % 2 === 0 ? '' : 'bg-gray-50')}>
                        <td className="px-4 py-3 text-gray-500 font-semibold">{i + 1}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{g.fecha_sugerida || g.dia_semana || 'Dia ' + (g.dia || i+1)}</td>
                        <td className="px-4 py-3">
                          <span className={'text-white text-[10px] font-bold px-2 py-1 rounded ' + ((g.plataforma || '').includes('Instagram') ? 'bg-pink-500' : (g.plataforma || '').includes('LinkedIn') ? 'bg-blue-600' : 'bg-blue-500')}>
                            {(g.plataforma || 'IG').substring(0, 2).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{g.tipo_post || g.tipo || '-'}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 text-xs mb-1">{g.titulo || g.titulo_grafico || g.gancho || ''}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{(g.copy || '').substring(0, 150)}{(g.copy || '').length > 150 ? '...' : ''}</p>
                        </td>
                        <td className={'px-4 py-3 text-center font-bold ' + scoreColor}>{g.score || '-'}</td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* COPIES SEMANALES */}
            {copiesMes.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-sm font-bold text-gray-900">Copies sugeridos — {MESES_NOMBRES[mesFiltro]}</h2>
                {copiesMes.map(function(batch: any, bi: number) {
                  return <div key={bi} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-gray-500">Semana {batch.semana || bi + 1} | {(batch.created_at || '').substring(0, 10)}</span>
                      <span className="text-xs text-gray-400">Score promedio: {batch.score_promedio || '-'}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {(batch.datos || []).map(function(c: any, ci: number) {
                        var platColor = (c.plataforma || '').includes('Instagram') ? 'bg-pink-100 text-pink-700' : (c.plataforma || '').includes('LinkedIn') ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'
                        return <div key={ci} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={'text-[10px] font-bold px-2 py-0.5 rounded ' + platColor}>{c.plataforma || 'IG'} {c.tipo || ''}</span>
                            <span className="text-xs text-gray-400">{c.angulo || ''}</span>
                            {c.score && <span className={'text-xs font-bold ' + (c.score >= 80 ? 'text-green-600' : 'text-yellow-600')}>Score: {c.score}</span>}
                          </div>
                          <p className="font-semibold text-sm text-gray-900 mb-1">{c.titulo || ''}</p>
                          <p className="text-xs text-gray-600 whitespace-pre-line">{(c.copy || '').substring(0, 300)}{(c.copy || '').length > 300 ? '...' : ''}</p>
                          {c.justificacion && <p className="text-xs text-indigo-600 mt-2">{c.justificacion}</p>}
                        </div>
                      })}
                    </div>
                  </div>
                })}
              </div>
            )}

            {grillasMes.length === 0 && copiesMes.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center">
                <p className="text-gray-400 mb-2">Sin contenido generado para {MESES_NOMBRES[mesFiltro]}</p>
                <p className="text-xs text-gray-300">Los copies se generan cada lunes. La grilla se genera el 1ro de cada mes.</p>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-8 text-xs text-gray-400">
          <a href={'/copilot/configurar/' + props.suscripcionId} className="text-indigo-600 font-semibold hover:underline">Configurar cuentas</a>
          <span className="mx-3">|</span>
          <a href="/clipping" className="text-indigo-600 font-semibold hover:underline">Volver a Radar</a>
        </div>
      </div>
    </div>
  )
}
