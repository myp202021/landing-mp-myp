'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'

interface Competidor { nombre: string; web: string; ig: string }
interface CompAnalysis { nombre: string; web: string; ig: string; propuesta_valor?: string; ideas_fuerza?: string[]; tono?: string; nivel_formalidad?: string; diferenciadores?: string[]; debilidades_comunicacion?: string[]; error?: string }

export default function BenchmarkClientePage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params?.clienteId as string

  const [cliente, setCliente] = useState<{ nombre: string; rubro: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Form
  const [clienteWeb, setClienteWeb] = useState('')
  const [clienteIg, setClienteIg] = useState('')
  const [competidores, setCompetidores] = useState<Competidor[]>([{ nombre: '', web: '', ig: '' }])

  // Results
  const [resultado, setResultado] = useState<Record<string, unknown> | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const cRes = await fetch(`/api/crm/clientes?id=${clienteId}`)
      const cData = await cRes.json()
      if (cData.cliente) setCliente({ nombre: cData.cliente.nombre, rubro: cData.cliente.rubro })

      const bRes = await fetch(`/api/crm/benchmark?cliente_id=${clienteId}`)
      const bData = await bRes.json()
      if (bData.benchmark) {
        setClienteWeb(bData.benchmark.cliente_web || '')
        setClienteIg(bData.benchmark.cliente_ig || '')
        if (bData.benchmark.competidores?.length) setCompetidores(bData.benchmark.competidores)
        if (bData.benchmark.resultado) setResultado(bData.benchmark.resultado)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [clienteId])

  useEffect(() => { loadData() }, [loadData])

  const handleSave = async () => {
    await fetch('/api/crm/benchmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: clienteId,
        cliente_web: clienteWeb,
        cliente_ig: clienteIg,
        competidores: competidores.filter(c => c.nombre || c.web),
      }),
    })
  }

  const handleGenerate = async () => {
    await handleSave()
    setGenerating(true)
    try {
      const res = await fetch('/api/crm/benchmark/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId }),
      })
      const data = await res.json()
      if (data.success) {
        setResultado(data.resultado)
      } else {
        alert(data.error || 'Error al generar')
      }
    } catch (e) { console.error(e) }
    setGenerating(false)
  }

  const handleExportPPT = () => {
    window.open(`/api/crm/benchmark/exportar?cliente_id=${clienteId}`, '_blank')
  }

  const addComp = () => setCompetidores(prev => [...prev, { nombre: '', web: '', ig: '' }])
  const updateComp = (i: number, field: keyof Competidor, val: string) => {
    setCompetidores(prev => prev.map((c, j) => j === i ? { ...c, [field]: val } : c))
  }
  const removeComp = (i: number) => setCompetidores(prev => prev.filter((_, j) => j !== i))

  const comp = resultado?.comparativo as Record<string, unknown> | undefined
  const clienteAnalisis = resultado?.cliente as Record<string, unknown> | undefined
  const compResults = (resultado?.competidores || []) as CompAnalysis[]

  if (loading) return <CRMLayout title="Benchmark"><div className="py-20 text-center text-gray-400">Cargando...</div></CRMLayout>

  return (
    <CRMLayout title={`Benchmark — ${cliente?.nombre || '...'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => router.push('/crm/benchmark')} className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block">← Volver</button>
            <h2 className="text-xl font-bold text-gray-900">{cliente?.nombre}</h2>
            <p className="text-sm text-gray-500">{cliente?.rubro}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleGenerate} disabled={generating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
              {generating ? '🔄 Analizando (~60s)...' : '🤖 Generar Benchmark'}
            </button>
            {resultado && (
              <button onClick={handleExportPPT} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                📊 Exportar PowerPoint
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">CONFIGURACIÓN</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Web del cliente</label>
              <input type="text" value={clienteWeb} onChange={e => setClienteWeb(e.target.value)} placeholder="https://cliente.cl"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram del cliente</label>
              <input type="text" value={clienteIg} onChange={e => setClienteIg(e.target.value)} placeholder="@cuenta"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Competidores (máx 5)</h4>
          <div className="space-y-2">
            {competidores.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={c.nombre} onChange={e => updateComp(i, 'nombre', e.target.value)} placeholder="Nombre"
                  className="w-1/4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input type="text" value={c.web} onChange={e => updateComp(i, 'web', e.target.value)} placeholder="https://competidor.cl"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input type="text" value={c.ig} onChange={e => updateComp(i, 'ig', e.target.value)} placeholder="@ig"
                  className="w-1/5 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                {competidores.length > 1 && (
                  <button onClick={() => removeComp(i)} className="px-3 text-red-400 hover:text-red-600">✕</button>
                )}
              </div>
            ))}
            {competidores.length < 5 && (
              <button onClick={addComp} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Agregar competidor</button>
            )}
          </div>
        </div>

        {/* Results */}
        {resultado && (
          <>
            {/* Resumen ejecutivo */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Resumen Ejecutivo</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{(comp?.resumen_ejecutivo as string) || ''}</p>
            </div>

            {/* Score digital */}
            {comp?.score_digital && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">{(comp.score_digital as Record<string, string>).cliente || '?'}</p>
                  <p className="text-xs text-blue-600 font-medium">{cliente?.nombre}</p>
                </div>
                {Object.entries((comp.score_digital as Record<string, unknown>).competidores as Record<string, string> || {}).map(([nombre, score]) => (
                  <div key={nombre} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-700">{score}</p>
                    <p className="text-xs text-gray-500 font-medium">{nombre}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Cliente analysis */}
            {clienteAnalisis && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">ANÁLISIS {cliente?.nombre?.toUpperCase()}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm"><span className="font-semibold text-gray-700">Propuesta de valor:</span> {clienteAnalisis.propuesta_valor as string}</p>
                    <p className="text-sm mt-2"><span className="font-semibold text-gray-700">Tono:</span> {clienteAnalisis.tono as string} (formalidad: {clienteAnalisis.nivel_formalidad as string}/10)</p>
                    <p className="text-sm mt-2"><span className="font-semibold text-gray-700">CTA principal:</span> {clienteAnalisis.cta_principal as string}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Ideas fuerza:</p>
                    <ul className="space-y-1">
                      {((clienteAnalisis.ideas_fuerza as string[]) || []).map((idea, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-blue-500">→</span>{idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Competitors */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">COMPETIDORES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compResults.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <h4 className="font-bold text-gray-900">{c.nombre}</h4>
                    <p className="text-xs text-gray-400">{c.web}</p>
                    {c.error ? (
                      <p className="text-xs text-red-500 mt-2">{c.error}</p>
                    ) : (
                      <>
                        <p className="text-sm mt-2"><span className="font-semibold">Tono:</span> {c.tono}</p>
                        <p className="text-sm"><span className="font-semibold">Propuesta:</span> {c.propuesta_valor}</p>
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-500">Ideas fuerza:</p>
                          {(c.ideas_fuerza || []).map((idea, j) => (
                            <p key={j} className="text-xs text-gray-600">→ {idea}</p>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fortalezas, brechas, oportunidades */}
            {comp && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-green-700 mb-2">Fortalezas</h4>
                  {((comp.fortalezas_cliente as string[]) || []).map((f, i) => (
                    <p key={i} className="text-xs text-green-800 mb-1">✅ {f}</p>
                  ))}
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-red-700 mb-2">Brechas</h4>
                  {((comp.brechas_cliente as string[]) || []).map((b, i) => (
                    <p key={i} className="text-xs text-red-800 mb-1">⚠️ {b}</p>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Oportunidades</h4>
                  {((comp.oportunidades as string[]) || []).map((o, i) => (
                    <p key={i} className="text-xs text-blue-800 mb-1">💡 {o}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Tono recomendado */}
            {comp?.tono_recomendado && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-purple-700 mb-3">Tono Recomendado para {cliente?.nombre}</h3>
                <p className="text-sm text-purple-800 mb-3">{(comp.tono_recomendado as Record<string, unknown>).descripcion as string}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-purple-600 mb-1">Palabras clave:</p>
                    <div className="flex flex-wrap gap-1">
                      {((comp.tono_recomendado as Record<string, unknown>).palabras_clave as string[] || []).map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-600 mb-1">Frases ejemplo:</p>
                    {((comp.tono_recomendado as Record<string, unknown>).frases_ejemplo as string[] || []).map((f, i) => (
                      <p key={i} className="text-xs text-purple-800 italic mb-1">"{f}"</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </CRMLayout>
  )
}
