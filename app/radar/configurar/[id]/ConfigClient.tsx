'use client'

import React, { useState, useEffect } from 'react'

var SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
var SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function hdrs() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' }
}

var PLAN_LIMITS: Record<string, number> = { starter: 5, pro: 15, business: 30 }

export default function ConfigClient(props: { suscripcionId: string }) {
  var [sub, setSub] = useState(null as any)
  var [loading, setLoading] = useState(true)
  var [saving, setSaving] = useState(false)
  var [saved, setSaved] = useState(false)
  var [error, setError] = useState('')
  var [cuentas, setCuentas] = useState([] as any[])
  var [nombre, setNombre] = useState('')
  var [descripcion, setDescripcion] = useState('')
  var [tono, setTono] = useState('profesional')
  var [web, setWeb] = useState('')
  var [igPropio, setIgPropio] = useState('')
  var [liPropio, setLiPropio] = useState('')
  var [fbPropio, setFbPropio] = useState('')
  var [kwStr, setKwStr] = useState('')

  useEffect(function() { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      var r = await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId + '&select=*', { headers: hdrs() })
      var data = await r.json()
      if (!data || data.length === 0) { setError('Suscripcion no encontrada'); setLoading(false); return }
      var s = data[0]
      setSub(s)
      var c = (s.cuentas || []).filter(function(x: any) { return x.red !== 'prensa' })
      setCuentas(c)
      var prensa = (s.cuentas || []).find(function(x: any) { return x.red === 'prensa' })
      if (prensa && prensa.keywords) setKwStr(prensa.keywords.join(', '))
      var perfil = s.perfil_empresa || {}
      setNombre(perfil.nombre || s.nombre || '')
      setDescripcion(perfil.descripcion || '')
      setTono(perfil.tono || 'profesional')
      setWeb(perfil.web || '')
      setIgPropio(perfil.instagram || '')
      setLiPropio(perfil.linkedin || '')
      setFbPropio(perfil.facebook || '')
    } catch (e) { setError('Error cargando datos') }
    setLoading(false)
  }

  function addCuenta() {
    var limit = PLAN_LIMITS[sub.plan] || 5
    if (cuentas.length >= limit) return
    setCuentas(cuentas.concat([{ red: 'instagram', handle: '', nombre: '' }]))
  }

  function removeCuenta(idx: number) {
    setCuentas(cuentas.filter(function(_: any, i: number) { return i !== idx }))
  }

  function updateCuenta(idx: number, field: string, value: string) {
    var n = cuentas.map(function(c: any, i: number) {
      if (i !== idx) return c
      var copy = Object.assign({}, c)
      copy[field] = value
      return copy
    })
    setCuentas(n)
  }

  async function guardar() {
    setSaving(true)
    setSaved(false)
    var allCuentas = cuentas.filter(function(c: any) { return c.handle.trim() !== '' })
    if (kwStr.trim()) {
      allCuentas.push({ red: 'prensa', keywords: kwStr.split(',').map(function(k: string) { return k.trim().toLowerCase() }).filter(function(k: string) { return k !== '' }) })
    }
    try {
      var r = await fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId, {
        method: 'PATCH', headers: hdrs(),
        body: JSON.stringify({
          cuentas: allCuentas,
          nombre: nombre,
          perfil_empresa: {
            nombre: nombre,
            descripcion: descripcion,
            tono: tono,
            web: web,
            instagram: igPropio,
            linkedin: liPropio,
            facebook: fbPropio,
          },
          updated_at: new Date().toISOString(),
        }),
      })
      if (r.ok) { setSaved(true); setTimeout(function() { setSaved(false) }, 3000) }
    } catch (e) { setError('Error guardando') }
    setSaving(false)
  }

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">{error}</p>
    </div>
  )
  if (loading || !sub) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Cargando configuracion...</p>
    </div>
  )

  var limit = PLAN_LIMITS[sub.plan] || 5
  var used = cuentas.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-8">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs opacity-60 tracking-widest mb-2">RADAR BY MULLER Y PEREZ</p>
            <h1 className="text-2xl font-bold">Configurar tu Radar</h1>
            <p className="text-sm opacity-80 mt-1">Plan {sub.plan} | {used} de {limit} cuentas usadas</p>
          </div>
          {sub.estado === 'trial' && (
            <a href={'/clipping/contratar/' + props.suscripcionId} className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-indigo-50 transition shadow-lg">
              Contratar plan
            </a>
          )}
          {sub.estado === 'activo' && sub.plan !== 'business' && (
            <a href={'/clipping/contratar/' + props.suscripcionId} className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-indigo-50 transition shadow-lg">
              Subir de plan
            </a>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* PERFIL EMPRESA */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Tu empresa</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
              <input type="text" value={nombre} onChange={function(e: any) { setNombre(e.target.value) }} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tono de comunicacion</label>
              <select value={tono} onChange={function(e: any) { setTono(e.target.value) }} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                <option value="profesional">Profesional y directo</option>
                <option value="cercano">Cercano y amigable</option>
                <option value="tecnico">Tecnico y especializado</option>
                <option value="corporativo">Corporativo y formal</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">A que se dedica tu empresa</label>
            <textarea value={descripcion} onChange={function(e: any) { setDescripcion(e.target.value) }} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Ej: Software de control de asistencia y gestion de personas para empresas medianas y grandes en Chile" />
          </div>
        </div>

        {/* WEB Y RRSS DEL CLIENTE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Tu presencia digital</h2>
          <p className="text-sm text-gray-500 mb-4">Usamos esta info para generar copies y grillas de contenido alineados a tu marca.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sitio web</label>
              <input type="text" value={web} onChange={function(e: any) { setWeb(e.target.value) }} placeholder="www.tuempresa.cl" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram</label>
              <input type="text" value={igPropio} onChange={function(e: any) { setIgPropio(e.target.value) }} placeholder="@tuempresa" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
              <input type="text" value={liPropio} onChange={function(e: any) { setLiPropio(e.target.value) }} placeholder="linkedin.com/company/tuempresa" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
              <input type="text" value={fbPropio} onChange={function(e: any) { setFbPropio(e.target.value) }} placeholder="facebook.com/tuempresa" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        {/* CUENTAS COMPETIDORES */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-gray-900">Competidores a monitorear</h2>
              <p className="text-sm text-gray-500 mt-1">Cuentas de la competencia que Radar analiza diariamente.</p>
            </div>
            <span className={'text-sm font-semibold ' + (used >= limit ? 'text-red-500' : 'text-gray-500')}>{used} / {limit}</span>
          </div>

          {cuentas.map(function(c: any, i: number) {
            return (
              <div key={i} className="flex gap-3 mb-3 items-center">
                <select value={c.red} onChange={function(e: any) { updateCuenta(i, 'red', e.target.value) }} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-36 focus:ring-2 focus:ring-indigo-500">
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
                <input type="text" value={c.handle} onChange={function(e: any) { updateCuenta(i, 'handle', e.target.value) }} placeholder="handle o URL" className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                <input type="text" value={c.nombre || ''} onChange={function(e: any) { updateCuenta(i, 'nombre', e.target.value) }} placeholder="Nombre empresa" className="w-40 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
                <button onClick={function() { removeCuenta(i) }} className="text-red-400 hover:text-red-600 text-lg font-bold px-2">x</button>
              </div>
            )
          })}

          {used < limit && (
            <button onClick={addCuenta} className="mt-2 text-sm text-indigo-600 font-semibold hover:text-indigo-700">+ Agregar cuenta</button>
          )}
          {used >= limit && (
            <div className="mt-3 flex items-center gap-3">
              <p className="text-sm text-amber-600">Llegaste al limite de tu plan ({limit} cuentas).</p>
              <a href={'/clipping/contratar/' + props.suscripcionId} className="text-sm font-bold text-indigo-600 hover:underline">Subir de plan</a>
            </div>
          )}
        </div>

        {/* KEYWORDS PRENSA */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Keywords de prensa</h2>
          <p className="text-sm text-gray-500 mb-3">Palabras que buscaremos en 11 medios chilenos. Separadas por coma.</p>
          <input type="text" value={kwStr} onChange={function(e: any) { setKwStr(e.target.value) }} placeholder="Ej: genera hr, control de asistencia, buk chile" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* GUARDAR */}
        <div className="flex items-center gap-4">
          <button onClick={guardar} disabled={saving} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar configuracion'}
          </button>
          {saved && <span className="text-green-600 font-semibold text-sm">Guardado. Los cambios aplican desde el proximo informe.</span>}
        </div>

        {/* LINKS */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <a href={'/radar/' + props.suscripcionId} className="text-indigo-600 font-semibold hover:underline">Ver mi dashboard</a>
          <span className="mx-3">|</span>
          <a href="/clipping" className="text-indigo-600 font-semibold hover:underline">Volver a Radar</a>
        </div>
      </div>
    </div>
  )
}
