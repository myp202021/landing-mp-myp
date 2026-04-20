'use client'

import React, { useState, useEffect } from 'react'

var SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
var SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function hdrs() {
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON, 'Content-Type': 'application/json' }
}

function fmt(n: number) { return '$' + n.toLocaleString('es-CL') }

var PLANES = [
  { id: 'starter', nombre: 'Starter', cuentas: 5, canales: 'Instagram', mensual: 34990, anual: 27990, features: ['Email diario con posts', 'Engagement por post', 'Trends vs dia anterior', 'Analisis IA diario', 'PDF adjunto'] },
  { id: 'pro', nombre: 'Pro', cuentas: 15, canales: 'IG + LI + FB', mensual: 69990, anual: 54990, popular: true, features: ['Todo lo de Starter', 'Facebook y LinkedIn', 'Resumen semanal con ranking (lunes)', 'Resumen mensual (1ro)', '3 copies sugeridos por semana', 'Dashboard web'] },
  { id: 'business', nombre: 'Business', cuentas: 30, canales: 'IG + LI + FB', mensual: 119990, anual: 94990, features: ['Todo lo de Pro', 'Grilla mensual 16 posts con copy', 'Calendario sugerido', 'PDF consultoria + Excel', 'Analisis de posicionamiento', 'Benchmark acumulativo'] },
]

export default function ContratarClient(props: { suscripcionId: string }) {
  var [sub, setSub] = useState(null as any)
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')
  var [anual, setAnual] = useState(true)
  var [procesando, setProcesando] = useState(false)

  useEffect(function() {
    fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?id=eq.' + props.suscripcionId + '&select=*', { headers: hdrs() })
      .then(function(r) { return r.json() })
      .then(function(data) {
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
      var res = await fetch('/api/clipping/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId + '-' + periodo, email: sub.email, nombre: sub.nombre || sub.email, suscripcionId: props.suscripcionId }),
      })
      var data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Error al procesar. Intenta de nuevo o contactanos.')
        setProcesando(false)
      }
    } catch (e) {
      setError('Error de conexion. Intenta de nuevo.')
      setProcesando(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-xl font-bold text-gray-900 mb-2">Radar</p><p className="text-gray-500">{error}</p><a href="/clipping" className="text-indigo-600 font-semibold mt-4 inline-block hover:underline">Volver a Radar</a></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-10 text-center">
        <p className="text-xs opacity-60 tracking-widest mb-3">RADAR BY MULLER Y PEREZ</p>
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
              <div key={plan.id} className={'rounded-2xl p-6 border-2 bg-white ' + (plan.popular ? 'border-indigo-600 shadow-xl shadow-indigo-100 relative' : 'border-gray-200')}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">Recomendado</div>}
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
                  className={'w-full py-3 rounded-xl font-bold text-sm transition disabled:opacity-50 ' + (plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
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
