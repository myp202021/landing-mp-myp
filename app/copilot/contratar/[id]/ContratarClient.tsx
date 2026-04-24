'use client'

import React, { useState, useEffect } from 'react'

var SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ'

function hdrs() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' }
}

function fmt(n: number) { return '$' + n.toLocaleString('es-CL') }

var PLANES_BASE = [
  { id: 'starter', nombre: 'Starter', cuentas: 5, canales: 'Instagram', mensual: 34990, anual: 27990, features: ['Email diario con posts', 'Engagement por post', 'Trends vs dia anterior', 'Analisis IA diario', 'PDF adjunto'] },
  { id: 'pro', nombre: 'Pro', cuentas: 15, canales: 'IG + LI + FB', mensual: 69990, anual: 54990, popular: true, features: ['Todo lo de Starter', 'Facebook y LinkedIn', 'Resumen semanal con ranking (lunes)', 'Resumen mensual (1ro)', '3 copies sugeridos por semana', 'Dashboard web'] },
  { id: 'business', nombre: 'Business', cuentas: 30, canales: 'IG + LI + FB', mensual: 119990, anual: 94990, features: ['Todo lo de Pro', 'Grilla mensual 16 posts con copy', 'Calendario sugerido', 'PDF consultoria + Excel', 'Analisis de posicionamiento', 'Benchmark acumulativo'] },
]

var PLAN_TEST = { id: 'test', nombre: 'Test', cuentas: 5, canales: 'Instagram', mensual: 1000, anual: 1000, features: ['Plan de prueba $1.000', 'Solo para testing interno'] }

export default function ContratarClient(props: { suscripcionId: string }) {
  var [sub, setSub] = useState(null as any)
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')
  var [anual, setAnual] = useState(true)
  var [procesando, setProcesando] = useState(false)
  var [showTest, setShowTest] = useState(false)

  useEffect(function() {
    if (window.location.search.includes('test=1')) setShowTest(true)
  }, [])

  var PLANES = showTest ? [PLAN_TEST].concat(PLANES_BASE) : PLANES_BASE

  useEffect(function() {
    fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId + '&select=*', { headers: hdrs() })
      .then(function(r) { return r.json() })
      .then(function(data) {
        if (data && data.length > 0) {
          var email = data[0].email || ''
          if (email.includes('mulleryperez') || email.includes('chmuller5')) setShowTest(true)
        }
        if (!data || data.length === 0) { setError('Suscripcion no encontrada') }
        else { setSub(data[0]) }
        setLoading(false)
      })
      .catch(function() { setError('Error cargando datos'); setLoading(false) })
  }, [])

  async function contratar(planId: string) {
    setProcesando(true)
    try {
      var periodo = anual ? 'anual' : 'mensual'
      var res = await fetch('/api/copilot/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId + '-' + periodo, email: sub.email, nombre: sub.nombre || sub.email, suscripcionId: props.suscripcionId }),
      })
      var data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout response:', JSON.stringify(data))
        setError('Error: ' + (data.error || data.detail?.message || JSON.stringify(data)))
        setProcesando(false)
      }
    } catch (e: any) {
      console.error('Checkout exception:', e)
      setError('Error de conexion: ' + (e.message || 'intenta de nuevo'))
      setProcesando(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-xl font-bold text-gray-900 mb-2">M&P Copilot</p><p className="text-gray-500">{error}</p><a href="/copilot" className="text-indigo-600 font-semibold mt-4 inline-block hover:underline">Volver a Copilot</a></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-10 text-center">
        <p className="text-xs opacity-60 tracking-widest mb-3">M&P COPILOT</p>
        <h1 className="text-3xl font-bold mb-2">Elige tu plan</h1>
        <p className="text-sm opacity-80">{sub.email} | Trial {sub.estado === 'trial' ? 'activo' : 'finalizado'}</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={'text-sm font-medium ' + (!anual ? 'text-gray-900' : 'text-gray-400')}>Mensual</span>
          <button onClick={function() { setAnual(!anual) }} className={'relative w-14 h-7 rounded-full transition ' + (anual ? 'bg-indigo-600' : 'bg-gray-300')}>
            <div className={'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ' + (anual ? 'translate-x-7' : 'translate-x-0.5')} />
          </button>
          <span className={'text-sm font-medium ' + (anual ? 'text-gray-900' : 'text-gray-400')}>Anual <span className="text-green-600 text-xs font-bold ml-1">-20%</span></span>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANES.map(function(plan) {
            return (
              <div key={plan.id} className={'rounded-2xl p-6 border-2 bg-white ' + ((plan as any).popular ? 'border-indigo-600 shadow-xl shadow-indigo-100 relative' : 'border-gray-200')}>
                {(plan as any).popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">Recomendado</div>}
                <h3 className="text-xl font-bold mb-1">{plan.nombre}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.cuentas} cuentas | {plan.canales}</p>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">{fmt(anual ? plan.anual : plan.mensual)}</span>
                  <span className="text-gray-500 text-sm"> /mes + IVA</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(function(f: string, i: number) {
                    return <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-green-500 font-bold mt-0.5">+</span> {f}</li>
                  })}
                </ul>
                <button
                  onClick={function() { contratar(plan.id) }}
                  disabled={procesando}
                  className={'w-full py-3 rounded-xl font-bold text-sm transition disabled:opacity-50 ' + ((plan as any).popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
                >
                  {procesando ? 'Procesando...' : 'Suscribirme'}
                </button>
              </div>
            )
          })}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">Pago seguro con Flow.cl | Cancela cuando quieras | Todas las cuentas y datos quedan tuyos</p>
      </div>
    </div>
  )
}
