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

      // Load benchmark data
      const bRes = await fetch(`/api/crm/benchmark?cliente_id=${clienteId}`)
      const bData = await bRes.json()
      if (bData.benchmark) {
        setClienteWeb(bData.benchmark.cliente_web || '')
        setClienteIg(bData.benchmark.cliente_ig || '')
        if (bData.benchmark.competidores?.length) setCompetidores(bData.benchmark.competidores)
        if (bData.benchmark.resultado) setResultado(bData.benchmark.resultado)
      }

      // If no benchmark data, try to prefill from briefing
      if (!bData.benchmark?.cliente_web) {
        const brRes = await fetch(`/api/crm/briefings?cliente_id=${clienteId}`)
        const brData = await brRes.json()
        if (brData.briefing) {
          if (brData.briefing.web && !bData.benchmark?.cliente_web) setClienteWeb(brData.briefing.web)
          if (brData.briefing.instagram && !bData.benchmark?.cliente_ig) setClienteIg(brData.briefing.instagram)
          if (brData.briefing.competidores?.length && (!bData.benchmark?.competidores?.length)) {
            setCompetidores((brData.briefing.competidores as Array<{nombre: string; web: string}>).map(c => ({ nombre: c.nombre || '', web: c.web || '', ig: '' })))
          }
        }
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

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este benchmark? Se borrarán los datos y resultados.')) return
    try {
      await fetch(`/api/crm/benchmark?cliente_id=${clienteId}`, { method: 'DELETE' })
      setResultado(null)
      setClienteWeb('')
      setClienteIg('')
      setCompetidores([{ nombre: '', web: '', ig: '' }])
      loadData()
    } catch (e) { console.error(e) }
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
            <button onClick={() => handleSave()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              💾 Guardar
            </button>
            <button onClick={handleGenerate} disabled={generating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
              {generating ? '🔄 Analizando (~60s)...' : '🤖 Generar Benchmark'}
            </button>
            {resultado && (
              <button onClick={handleExportPPT} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                📊 Exportar PowerPoint
              </button>
            )}
            {resultado && (
              <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-100 transition border border-red-200">
                🗑 Eliminar
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

            {/* Score digital por dimensión */}
            {comp?.score_digital && (() => {
              const sd = comp.score_digital as Record<string, unknown>
              const dims = (sd.dimensiones as string[]) || []
              const scores = (sd.scores as Record<string, number[]>) || {}
              return dims.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 overflow-x-auto">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">SCORE DIGITAL POR DIMENSIÓN</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="px-3 py-2 text-left text-xs font-bold">Empresa</th>
                        {dims.map(d => <th key={d} className="px-3 py-2 text-center text-xs font-bold">{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(scores).map(([name, vals]) => (
                        <tr key={name} className={name === cliente?.nombre ? 'bg-blue-50' : 'bg-gray-50'}>
                          <td className={`px-3 py-2 font-bold text-xs ${name === cliente?.nombre ? 'text-blue-700' : 'text-gray-700'}`}>{name}</td>
                          {(vals || []).map((v, i) => (
                            <td key={i} className={`px-3 py-2 text-center font-bold text-xs ${v >= 7 ? 'text-green-700 bg-green-50' : v >= 5 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>
                              {v}/10
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null
            })()}

            {/* Análisis cliente */}
            {clienteAnalisis && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">ANÁLISIS {cliente?.nombre?.toUpperCase()}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {clienteAnalisis.propuesta_valor && <div><p className="text-xs font-bold text-gray-500">Propuesta de valor</p><p className="text-sm text-gray-800">{clienteAnalisis.propuesta_valor as string}</p></div>}
                    {(() => { const t = clienteAnalisis.tono_comunicacional as Record<string, string> | undefined; return t ? (
                      <div><p className="text-xs font-bold text-gray-500">Tono comunicacional</p><p className="text-sm text-gray-800">{t.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">Formalidad: {t.formalidad}/10 · Calidez: {t.calidez}/10 · Tecnicismo: {t.tecnicismo}/10</p>
                      {t.personalidad && <p className="text-xs text-purple-600 italic mt-1">Personalidad: {t.personalidad}</p>}</div>
                    ) : null })()}
                    {clienteAnalisis.publico_objetivo && <div><p className="text-xs font-bold text-gray-500">Público objetivo</p><p className="text-sm text-gray-800">{clienteAnalisis.publico_objetivo as string}</p></div>}
                    {clienteAnalisis.cta_principal && <div><p className="text-xs font-bold text-gray-500">CTA principal</p><p className="text-sm text-gray-800">{clienteAnalisis.cta_principal as string}</p></div>}
                    {clienteAnalisis.nivel_profesionalismo && <div><p className="text-xs font-bold text-gray-500">Profesionalismo web: {clienteAnalisis.nivel_profesionalismo as string}/10</p></div>}
                  </div>
                  <div className="space-y-3">
                    <div><p className="text-xs font-bold text-gray-500 mb-1">Ideas fuerza</p>
                      {((clienteAnalisis.ideas_fuerza as string[]) || []).map((idea, i) => <p key={i} className="text-xs text-gray-700 mb-1">→ {idea}</p>)}
                    </div>
                    <div><p className="text-xs font-bold text-gray-500 mb-1">Diferenciadores reales</p>
                      {((clienteAnalisis.diferenciadores_reales as string[]) || []).map((d, i) => <p key={i} className="text-xs text-green-700 mb-1">✓ {d}</p>)}
                    </div>
                    <div><p className="text-xs font-bold text-red-500 mb-1">Debilidades</p>
                      {((clienteAnalisis.debilidades_comunicacion as string[]) || []).map((d, i) => <p key={i} className="text-xs text-red-700 mb-1">⚠ {d}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabla comparativa */}
            {comp?.tabla_comparativa && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 overflow-x-auto">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">TABLA COMPARATIVA</h3>
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-900 text-white">
                    <th className="px-3 py-2 text-left text-xs">Dimensión</th>
                    <th className="px-3 py-2 text-center text-xs">{cliente?.nombre}</th>
                    <th className="px-3 py-2 text-center text-xs">Mejor competidor</th>
                    <th className="px-3 py-2 text-center text-xs">Evaluación</th>
                  </tr></thead>
                  <tbody>
                    {((comp.tabla_comparativa as Array<Record<string, string>>) || []).map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-3 py-2 font-semibold text-xs text-gray-800">{row.dimension}</td>
                        <td className="px-3 py-2 text-xs text-center text-gray-600">{row.cliente}</td>
                        <td className="px-3 py-2 text-xs text-center text-gray-600">{row.mejor_competidor}</td>
                        <td className={`px-3 py-2 text-xs text-center font-bold ${row.evaluacion === 'ventaja' ? 'text-green-700 bg-green-50' : row.evaluacion === 'desventaja' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'}`}>
                          {row.evaluacion?.toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Competidores */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">COMPETIDORES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compResults.map((c, i) => {
                  const tono = c.tono_comunicacional as Record<string, string> | undefined
                  return (
                    <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-bold text-gray-900">{c.nombre}</h4>
                      <p className="text-xs text-gray-400 mb-2">{c.web}</p>
                      {c.error ? <p className="text-xs text-red-500">{c.error}</p> : (<>
                        <p className="text-sm text-gray-700 mb-2">{c.propuesta_valor as string}</p>
                        {tono && <p className="text-xs text-gray-500 mb-2">Tono: {tono.descripcion} · Formalidad {tono.formalidad}/10 · Calidez {tono.calidez}/10</p>}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-red-50 rounded p-2"><p className="text-xs font-bold text-red-600 mb-1">Nos gana en:</p>
                            {((c[`que_hace_mejor_que_${(cliente?.nombre || '').toLowerCase().replace(/\s/g, '_')}`] as string[]) || (c.diferenciadores as string[]) || []).slice(0, 3).map((m, j) => <p key={j} className="text-xs text-red-700">• {m}</p>)}
                          </div>
                          <div className="bg-green-50 rounded p-2"><p className="text-xs font-bold text-green-600 mb-1">Le ganamos en:</p>
                            {((c.que_hace_peor as string[]) || (c.debilidades as string[]) || []).slice(0, 3).map((p, j) => <p key={j} className="text-xs text-green-700">• {p}</p>)}
                          </div>
                        </div>
                      </>)}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Fortalezas + Brechas + Oportunidades */}
            {comp && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-green-700 mb-3">Fortalezas</h4>
                  {((comp.fortalezas_cliente as string[]) || []).map((f, i) => <p key={i} className="text-xs text-green-800 mb-2">✅ {f}</p>)}
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-red-700 mb-3">Brechas Críticas</h4>
                  {((comp.brechas_criticas as string[]) || (comp.brechas_cliente as string[]) || []).map((b, i) => <p key={i} className="text-xs text-red-800 mb-2">⚠️ {b}</p>)}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-700 mb-3">Oportunidades</h4>
                  {((comp.oportunidades_accionables as string[]) || (comp.oportunidades as string[]) || []).map((o, i) => <p key={i} className="text-xs text-blue-800 mb-2">💡 {o}</p>)}
                </div>
              </div>
            )}

            {/* Pilares de contenido */}
            {comp?.pilares_contenido && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">PILARES DE CONTENIDO RECOMENDADOS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {((comp.pilares_contenido as Array<Record<string, string>>) || []).map((pilar, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 text-sm">{pilar.pilar}</h4>
                      <p className="text-xs text-gray-600 mt-1">{pilar.descripcion}</p>
                      <p className="text-xs text-blue-600 italic mt-2">Ejemplo: "{pilar.ejemplo_post}"</p>
                      <p className="text-xs text-gray-400 mt-1">{pilar.frecuencia}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tono recomendado */}
            {comp?.tono_recomendado && (() => {
              const tr = comp.tono_recomendado as Record<string, unknown>
              return (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-purple-700 mb-3">Tono Recomendado para {cliente?.nombre}</h3>
                  <p className="text-sm text-purple-800 mb-4 leading-relaxed">{tr.descripcion as string}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {((tr.palabras_clave as string[]) || []).map((p, i) => (
                      <span key={i} className="px-2.5 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">{p}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-green-700 mb-2">SÍ DECIR</p>
                      {((tr.frases_ejemplo as string[]) || []).map((f, i) => <p key={i} className="text-xs text-green-800 italic mb-1">"{f}"</p>)}
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-red-700 mb-2">NUNCA DECIR</p>
                      {((tr.que_nunca_decir as string[]) || []).map((n, i) => <p key={i} className="text-xs text-red-800 mb-1">✕ {n}</p>)}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Quick wins */}
            {comp?.quick_wins && (
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-5 text-white">
                <h3 className="font-bold text-sm mb-3">QUICK WINS — Acciones para esta semana</h3>
                {((comp.quick_wins as string[]) || []).map((qw, i) => (
                  <p key={i} className="text-sm text-blue-100 mb-2">→ {qw}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </CRMLayout>
  )
}
