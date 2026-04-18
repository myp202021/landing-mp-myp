'use client'

import React, { useState, useEffect } from 'react'

var SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
var SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function headers() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' }
}

export default function RadarDashboard(props: { suscripcionId: string }) {
  var [sub, setSub] = useState(null as any)
  var [posts, setPosts] = useState([] as any[])
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')
  var [periodo, setPeriodo] = useState('7d')

  useEffect(function() { loadData() }, [periodo])

  async function loadData() {
    setLoading(true)
    try {
      var r1 = await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId + '&select=*', { headers: headers() })
      var subs = await r1.json()
      if (!subs || subs.length === 0) { setError('Suscripcion no encontrada'); setLoading(false); return }
      setSub(subs[0])

      var dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
      var desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      var r2 = await fetch(SUPABASE_URL + '/rest/v1/radar_posts?suscripcion_id=eq.' + props.suscripcionId + '&fecha_scrape=gte.' + desde + '&select=*&order=fecha_scrape.desc', { headers: headers() })
      var data = await r2.json()
      setPosts(Array.isArray(data) ? data : [])
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

  // Stats
  var empresas = {} as Record<string, { ig: number, li: number, fb: number, likes: number, comments: number }>
  var cuentas = (sub.cuentas || []).filter(function(c: any) { return c.red !== 'prensa' })
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

  // Posts por dia (para grafico simple)
  var porDia = {} as Record<string, number>
  posts.forEach(function(p: any) {
    var d = (p.fecha_scrape || '').substring(0, 10)
    if (d) porDia[d] = (porDia[d] || 0) + 1
  })
  var diasOrdenados = Object.keys(porDia).sort()
  var maxPostsDia = Math.max(1, Math.max.apply(null, Object.values(porDia)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs opacity-60 tracking-widest mb-2">RADAR BY MULLER Y PEREZ</p>
          <h1 className="text-2xl font-bold mb-1">Tu Radar de competencia</h1>
          <p className="text-sm opacity-80">{sub.nombre || sub.email} | Plan {sub.plan} | {cuentas.length} cuentas monitoreadas</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Periodo selector */}
        <div className="flex gap-2 mb-6">
          {['7d', '30d', '90d'].map(function(p) {
            return <button key={p} onClick={function() { setPeriodo(p) }}
              className={'px-4 py-2 rounded-lg text-sm font-semibold transition ' + (periodo === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}>
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
            </button>
          })}
        </div>

        {/* KPIs */}
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

        {/* Grafico de barras simple - posts por dia */}
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

        {/* Tabla por empresa */}
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
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Eng. prom</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(empresas).map(function(nombre, i) {
                var e = empresas[nombre]
                var total = e.ig + e.li + e.fb
                var avg = total > 0 ? Math.round(e.likes / total) : 0
                var inactive = total === 0
                return <tr key={nombre} className={'border-b border-gray-100 ' + (inactive ? 'bg-red-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
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

        {/* Ultimos posts */}
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

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>Radar by Muller y Perez | mulleryperez.cl/clipping</p>
        </div>
      </div>
    </div>
  )
}
