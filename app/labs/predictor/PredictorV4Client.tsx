// @ts-nocheck
'use client'

/**
 * PREDICTOR v4.1 — Monte Carlo · Light Theme · Glassmorphism
 *
 * - Formulario 2 columnas: inputs + panel referencia industria en vivo
 * - Tasa de cierre y ticket pre-llenados con referencia de mercado
 * - Resultados: escenarios P25/P50/P75, embudos por plataforma, óptimos industria
 * - Diseño light con glassmorphism, tooltips, hints
 */

import React, { useState, useMemo } from 'react'

// ═══════════════════════════════════════════════════════════════════
// DATOS ESTÁTICOS
// ═══════════════════════════════════════════════════════════════════

const INDUSTRIAS = [
  { value: 'ECOMMERCE', label: 'E-commerce', icon: '🛒' },
  { value: 'INMOBILIARIA', label: 'Inmobiliaria', icon: '🏠' },
  { value: 'SALUD_MEDICINA', label: 'Salud / Clínicas', icon: '🏥' },
  { value: 'EDUCACION', label: 'Educación', icon: '🎓' },
  { value: 'TECNOLOGIA_SAAS', label: 'SaaS / Tech', icon: '💻' },
  { value: 'FINTECH', label: 'Fintech', icon: '💳' },
  { value: 'AUTOMOTRIZ', label: 'Automotriz', icon: '🚗' },
  { value: 'TURISMO', label: 'Turismo', icon: '✈️' },
  { value: 'GASTRONOMIA', label: 'Gastronomía', icon: '🍽️' },
  { value: 'MODA_RETAIL', label: 'Moda / Retail', icon: '👗' },
  { value: 'BELLEZA_PERSONAL', label: 'Belleza', icon: '💄' },
  { value: 'SERVICIOS_LEGALES', label: 'Legales', icon: '⚖️' },
  { value: 'CONSTRUCCION_REMODELACION', label: 'Construcción', icon: '🔨' },
  { value: 'DEPORTES_FITNESS', label: 'Fitness', icon: '🏋️' },
  { value: 'VETERINARIA_MASCOTAS', label: 'Veterinaria', icon: '🐾' },
  { value: 'MANUFACTURA_INDUSTRIAL', label: 'Manufactura', icon: '🏭' },
  { value: 'LOGISTICA_TRANSPORTE', label: 'Logística', icon: '🚛' },
  { value: 'SEGUROS', label: 'Seguros', icon: '🛡️' },
  { value: 'AGRICULTURA_AGROINDUSTRIA', label: 'Agricultura', icon: '🌾' },
  { value: 'SERVICIOS_PROFESIONALES', label: 'Serv. Profesionales', icon: '💼' },
  { value: 'ENERGIA_UTILITIES', label: 'Energía', icon: '⚡' },
  { value: 'HOGAR_DECORACION', label: 'Hogar / Deco', icon: '🏡' },
]

const PAISES = [
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
]

const PLATFORM_NAMES: Record<string, string> = {
  google_search: 'Google Search', google_display: 'Google Display', meta_ads: 'Meta Ads',
}
const PLATFORM_COLORS: Record<string, string> = {
  google_search: 'bg-blue-500', google_display: 'bg-amber-500', meta_ads: 'bg-purple-500',
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${Math.round(n)}`
}
const fmtN = (n: number) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return Math.round(n).toString()
}

// Tooltip component
const Hint = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1">
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[9px] font-bold cursor-help hover:bg-indigo-100 hover:text-indigo-600 transition"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >?</span>
      {show && (
        <span className="absolute z-50 bottom-6 left-1/2 -translate-x-1/2 w-56 p-2.5 bg-slate-900 text-white text-[11px] leading-snug rounded-lg shadow-xl">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

export default function PredictorV4Client() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [form, setForm] = useState({
    industria: '', pais: 'CL',
    presupuesto_mensual: 1500000,
    ticket_promedio: '', tasa_cierre: '',
    objetivo: 'LEADS',
    tipo_cliente: 'B2C', tamano_empresa: 'PYME',
    competencia_percibida: 5,
    madurez_digital: 'INTERMEDIO',
    margen_bruto: 40, geo_objetivo: 'NACIONAL',
  })

  const isValid = form.industria && form.presupuesto_mensual >= 300000
  const selectedIndustria = INDUSTRIAS.find(i => i.value === form.industria)

  const handleSubmit = async () => {
    setStep('loading')
    setError(null)
    try {
      const body: any = {
        industria: form.industria, pais: form.pais,
        presupuesto_mensual: form.presupuesto_mensual,
        objetivo: form.objetivo,
        tipo_cliente: form.tipo_cliente,
        tamano_empresa: form.tamano_empresa,
      }
      if (form.ticket_promedio) body.ticket_promedio = parseInt(form.ticket_promedio)
      if (form.tasa_cierre) body.tasa_cierre = parseInt(form.tasa_cierre)
      if (form.competencia_percibida !== 5) body.competencia_percibida = form.competencia_percibida
      if (form.madurez_digital !== 'INTERMEDIO') body.madurez_digital = form.madurez_digital
      if (form.margen_bruto !== 40) body.margen_bruto = form.margen_bruto
      if (form.geo_objetivo !== 'NACIONAL') body.geo_objetivo = form.geo_objetivo

      const res = await fetch('/api/predictions/monte-carlo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).message || 'Error')
      setResult(await res.json())
      setStep('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setError(e.message)
      setStep('input')
    }
  }

  const handleReset = () => {
    setResult(null); setStep('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo-myp.png" alt="M&P" className="h-8" /></a>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-slate-600">Predictor v4</span>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Monte Carlo</span>
          </div>
          {step === 'results' && (
            <button onClick={handleReset} className="text-sm text-slate-400 hover:text-slate-700 transition font-medium">
              Nuevo análisis
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ═══ INPUT ═══ */}
        {step === 'input' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">Simulación Monte Carlo · 10,000 iteraciones · Data 2026</p>
              <h1 className="text-3xl font-bold text-slate-900">Predictor de Campañas Digitales</h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Predice resultados de Google Ads y Meta Ads con benchmarks verificados. 22 industrias, 6 países LATAM.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda: Form */}
              <div className="lg:col-span-2 space-y-6">

                {/* Industria */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">
                    Industria <Hint text="Selecciona la industria de tu negocio. Los benchmarks (CPC, CTR, CVR) se ajustan automáticamente." />
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {INDUSTRIAS.map(ind => (
                      <button key={ind.value} onClick={() => setForm({ ...form, industria: ind.value })}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-all ${
                          form.industria === ind.value
                            ? 'bg-indigo-50 border-2 border-indigo-400 text-indigo-700 font-semibold shadow-sm'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span>{ind.icon}</span>
                        <span className="truncate">{ind.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* País + Presupuesto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">País</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PAISES.map(p => (
                        <button key={p.code} onClick={() => setForm({ ...form, pais: p.code })}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition ${
                            form.pais === p.code
                              ? 'bg-indigo-50 border-2 border-indigo-400 text-indigo-700 font-semibold'
                              : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <span>{p.flag}</span><span className="text-xs">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Presupuesto mensual <Hint text="Inversión mensual en pauta publicitaria (Google + Meta). No incluye fee de gestión." />
                    </label>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">{fmt(form.presupuesto_mensual)}</p>
                    <input type="range" min={300000} max={20000000} step={100000}
                      value={form.presupuesto_mensual}
                      onChange={e => setForm({ ...form, presupuesto_mensual: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex gap-1.5 mt-2">
                      {[500000, 1000000, 2000000, 5000000].map(p => (
                        <button key={p} onClick={() => setForm({ ...form, presupuesto_mensual: p })}
                          className={`text-[10px] px-2 py-1 rounded transition ${
                            form.presupuesto_mensual === p ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}>{fmt(p)}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket + Tasa cierre + Objetivo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Ticket promedio <Hint text="Valor promedio de cada venta o contrato. Si no lo sabes, usamos el promedio de tu industria." />
                    </label>
                    <input type="number" value={form.ticket_promedio}
                      onChange={e => setForm({ ...form, ticket_promedio: e.target.value })}
                      placeholder="Ref. industria"
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Si vacío, se usa referencia de la industria</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Tasa de cierre (%) <Hint text="% de leads que se convierten en venta. Depende de tu industria, tipo de cliente y tamaño. Si no lo sabes, usamos la referencia de mercado." />
                    </label>
                    <input type="number" value={form.tasa_cierre}
                      onChange={e => setForm({ ...form, tasa_cierre: e.target.value })}
                      placeholder="Ref. mercado"
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Si vacío, se usa referencia según industria + B2B/B2C + tamaño</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Objetivo</label>
                    <div className="space-y-1.5">
                      {[
                        { value: 'LEADS', label: 'Leads' },
                        { value: 'VENTAS_DIRECTAS', label: 'Ventas directas' },
                        { value: 'AWARENESS', label: 'Awareness' },
                      ].map(o => (
                        <button key={o.value} onClick={() => setForm({ ...form, objetivo: o.value })}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                            form.objetivo === o.value
                              ? 'bg-indigo-50 border border-indigo-300 text-indigo-700 font-semibold'
                              : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}>{o.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tipo cliente + Tamaño */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Tipo cliente</label>
                    <div className="flex gap-2">
                      {['B2C', 'B2B'].map(t => (
                        <button key={t} onClick={() => setForm({ ...form, tipo_cliente: t })}
                          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                            form.tipo_cliente === t
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                              : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                          }`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                      Tamaño empresa <Hint text="Afecta la tasa de cierre de referencia. Empresas grandes suelen tener mejor tasa." />
                    </label>
                    <div className="flex gap-1">
                      {[
                        { v: 'MICRO', l: '<10' }, { v: 'PYME', l: '10-50' },
                        { v: 'MEDIANA', l: '50-200' }, { v: 'GRANDE', l: '>200' },
                      ].map(t => (
                        <button key={t.v} onClick={() => setForm({ ...form, tamano_empresa: t.v })}
                          className={`flex-1 py-1.5 rounded text-[10px] font-semibold transition ${
                            form.tamano_empresa === t.v
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                              : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                          }`}>{t.l}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced */}
                <button onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition font-medium">
                  {showAdvanced ? '▾' : '▸'} Ajustes avanzados
                </button>
                {showAdvanced && (
                  <div className="grid grid-cols-3 gap-3 p-4 bg-white/60 rounded-xl border border-slate-200/60">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Competencia ({form.competencia_percibida})</label>
                      <input type="range" min={1} max={10} value={form.competencia_percibida}
                        onChange={e => setForm({ ...form, competencia_percibida: parseInt(e.target.value) })}
                        className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Madurez digital</label>
                      <select value={form.madurez_digital} onChange={e => setForm({ ...form, madurez_digital: e.target.value })}
                        className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-700">
                        <option value="PRINCIPIANTE">Principiante</option>
                        <option value="INTERMEDIO">Intermedio</option>
                        <option value="AVANZADO">Avanzado</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Margen bruto ({form.margen_bruto}%)</label>
                      <input type="range" min={10} max={80} value={form.margen_bruto}
                        onChange={e => setForm({ ...form, margen_bruto: parseInt(e.target.value) })}
                        className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button onClick={handleSubmit} disabled={!isValid}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition text-sm shadow-lg shadow-indigo-200 disabled:shadow-none">
                  Generar predicción
                </button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </div>

              {/* Columna derecha: Panel referencia industria (en vivo) */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    {selectedIndustria ? `${selectedIndustria.icon} ${selectedIndustria.label}` : 'Selecciona industria'}
                  </h3>
                  {form.industria ? (
                    <IndustryRefPanel industria={form.industria} pais={form.pais} tipo={form.tipo_cliente} tamano={form.tamano_empresa} />
                  ) : (
                    <p className="text-xs text-slate-400">Los benchmarks de CPC, CTR, CVR y tasa de cierre aparecerán aquí al seleccionar una industria.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {step === 'loading' && (
          <div className="text-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 text-sm">Ejecutando 10,000 simulaciones...</p>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {step === 'results' && result && <ResultsView data={result} onReset={handleReset} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-slate-400">
          <span>Motor Monte Carlo v4.1 · Benchmarks 2026 · M&P Labs</span>
          <div className="flex gap-4">
            <a href="/labs" className="hover:text-slate-600 transition">Labs</a>
            <a href="/" className="hover:text-slate-600 transition">Inicio</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PANEL REFERENCIA INDUSTRIA (dinámico, side panel)
// ═══════════════════════════════════════════════════════════════════

function IndustryRefPanel({ industria, pais, tipo, tamano }: { industria: string; pais: string; tipo: string; tamano: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    setLoading(true)
    fetch(`/api/predictions/monte-carlo?industria=${industria}&pais=${pais}&tipo_cliente=${tipo}&tamano=${tamano}`)
      .catch(() => null)

    // Fetch optimal via POST with minimal data
    fetch('/api/predictions/monte-carlo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industria, pais, presupuesto_mensual: 1500000, objetivo: 'LEADS', tipo_cliente: tipo, tamano_empresa: tamano }),
    })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [industria, pais, tipo, tamano])

  if (loading || !data?.optimal) {
    return <div className="text-xs text-slate-400 animate-pulse">Cargando benchmarks...</div>
  }

  const opt = data.optimal
  const meta = data.montecarlo?.meta

  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <RefStat label="CPC Google" value={fmt(opt.google_search.cpc)} />
        <RefStat label="CPC Meta" value={fmt(opt.meta_ads.cpc)} />
        <RefStat label="CTR Search" value={`${opt.google_search.ctr}%`} />
        <RefStat label="CVR Search" value={`${opt.google_search.cvr}%`} />
      </div>
      <div className="border-t border-slate-100 pt-2 space-y-1.5">
        <RefStat label={`Tasa cierre ref. (${tipo} ${tamano})`} value={`${opt.tasa_cierre_ref}%`} highlight />
        <RefStat label="Ticket ref." value={fmt(opt.ticket_ref.medio)} />
        <RefStat label="CPA estimado" value={fmt(opt.cpa_estimado)} />
        <RefStat label="ROAS típico" value={`${opt.roas_tipico}x`} />
      </div>
      <div className="border-t border-slate-100 pt-2">
        <p className="text-[10px] text-slate-400 font-semibold mb-1">Presupuesto recomendado</p>
        <p className="text-slate-600">{fmt(opt.presupuesto_optimo.min)} — {fmt(opt.presupuesto_optimo.recomendado)}</p>
      </div>
      <p className="text-[9px] text-slate-300 leading-snug">
        Fuentes: WordStream 2026, Get-Ryze 2026, Ubersuggest Chile · {opt.benchmark_year}
      </p>
    </div>
  )
}

function RefStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`${highlight ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50'} rounded-lg px-2.5 py-1.5`}>
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{value}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS VIEW
// ═══════════════════════════════════════════════════════════════════

function ResultsView({ data, onReset }: { data: any; onReset: () => void }) {
  const mc = data.montecarlo
  const t = mc.total
  const opt = data.optimal
  const meta = mc.meta

  return (
    <div className="space-y-6">

      {/* Context badges */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{meta.industria}</span>
        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{PAISES.find(p => p.code === meta.pais)?.flag} {PAISES.find(p => p.code === meta.pais)?.name}</span>
        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{fmt(meta.presupuesto)}/mes</span>
        <span className="bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-semibold">{fmtN(meta.iterations)} simulaciones</span>
        {meta.tasa_cierre_es_default && (
          <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">Tasa cierre: {meta.tasa_cierre}% (ref. mercado)</span>
        )}
        {meta.ticket_es_default && (
          <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">Ticket: {fmt(meta.ticket_promedio)} (ref. industria)</span>
        )}
      </div>

      {/* ═══ SECCIÓN A: Resumen ═══ */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm">
        <div className="text-center mb-5">
          <p className="text-4xl font-bold text-slate-900">{Math.round(t.leads.p50)}</p>
          <p className="text-slate-500 text-sm">leads/mes estimados <span className="text-slate-300">(conversiones Google Ads)</span></p>
          <p className="text-slate-400 text-xs mt-1">
            Ventas estimadas: {Math.round(t.conversiones.p50)}/mes (con {meta.tasa_cierre}% tasa de cierre)
          </p>
          <p className="text-slate-300 text-[10px] mt-0.5">CPL: {fmt(t.cpl.p50)}</p>
          <div className="flex items-center justify-center gap-3 mt-2 text-sm">
            <span className="font-bold text-slate-700">{fmt(t.revenue.p50)} revenue</span>
            <span className="text-slate-300">·</span>
            <span className={`font-bold ${t.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>{t.roas.p50.toFixed(1)}x ROAS</span>
          </div>
          <p className={`text-xs font-semibold mt-1.5 ${mc.confidence.prob_roas_gt_1 >= 70 ? 'text-emerald-600' : mc.confidence.prob_roas_gt_1 >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
            {mc.confidence.prob_roas_gt_1}% probabilidad de recuperar la inversión
          </p>
        </div>

        {/* 3 escenarios */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Conservador', sub: 'P25', leads: t.leads.p25, conv: t.conversiones.p25, rev: t.revenue.p25, roas: t.roas.p25, cpl: t.cpl.p75, color: 'border-amber-200 bg-amber-50/50', accent: 'text-amber-600' },
            { label: 'Base', sub: 'P50', leads: t.leads.p50, conv: t.conversiones.p50, rev: t.revenue.p50, roas: t.roas.p50, cpl: t.cpl.p50, color: 'border-indigo-200 bg-indigo-50/50', accent: 'text-indigo-600' },
            { label: 'Favorable', sub: 'P75', leads: t.leads.p75, conv: t.conversiones.p75, rev: t.revenue.p75, roas: t.roas.p75, cpl: t.cpl.p25, color: 'border-emerald-200 bg-emerald-50/50', accent: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 border ${s.color} text-center`}>
              <p className={`text-xs font-bold ${s.accent}`}>{s.label} <span className="font-normal text-slate-400">({s.sub})</span></p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{Math.round(s.leads)}</p>
              <p className="text-[10px] text-slate-400">leads</p>
              <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                <p>{Math.round(s.conv)} ventas · {fmt(s.rev)}</p>
                <p className={s.roas >= 1 ? 'text-emerald-600 font-semibold' : 'text-red-500'}>{s.roas.toFixed(1)}x ROAS</p>
                <p>{fmt(s.cpl)} CPL</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SECCIÓN B: Embudos por plataforma ═══ */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Embudo predictivo por plataforma</h2>
        <div className="space-y-3">
          {mc.funnels.map((f: any) => (
            <FunnelCard key={f.platform} funnel={f} />
          ))}
        </div>
      </div>

      {/* ═══ SECCIÓN C: Tu predicción vs Óptimo industria ═══ */}
      {opt && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-1">Tu predicción vs referencia de la industria</h2>
          <p className="text-xs text-slate-400 mb-4">{opt.industria} · {opt.tipo_cliente} · {opt.tamano}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CompareCard label="CPA" yours={fmt(t.cpa.p50)} ref_val={fmt(opt.cpa_estimado)} better={t.cpa.p50 < opt.cpa_estimado} />
            <CompareCard label="ROAS" yours={`${t.roas.p50.toFixed(1)}x`} ref_val={`${opt.roas_tipico}x`} better={t.roas.p50 > opt.roas_tipico} />
            <CompareCard label="Tasa cierre" yours={`${meta.tasa_cierre}%`} ref_val={`${opt.tasa_cierre_ref}%`} better={meta.tasa_cierre >= opt.tasa_cierre_ref} />
            <CompareCard label="Presup. óptimo" yours={fmt(meta.presupuesto)} ref_val={fmt(opt.presupuesto_optimo.recomendado)} />
          </div>
        </div>
      )}

      {/* ═══ SECCIÓN D: Histograma ═══ */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-1">Distribución de resultados</h2>
        <p className="text-xs text-slate-400 mb-4">10,000 simulaciones — cada barra es un rango de conversiones posibles</p>
        <HistogramChart data={mc.histogram.conversiones} p25={t.leads.p25} p50={t.leads.p50} p75={t.leads.p75} />
      </div>

      {/* ═══ SECCIÓN E: Budget split ═══ */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-3">Distribución de presupuesto</h2>
        {mc.funnels.map((f: any) => (
          <div key={f.platform} className="flex items-center gap-3 mb-2">
            <div className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[f.platform]}`} />
            <span className="text-xs text-slate-600 w-28">{PLATFORM_NAMES[f.platform]}</span>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${PLATFORM_COLORS[f.platform]}`} style={{ width: `${f.allocation_pct}%` }} />
            </div>
            <span className="text-xs text-slate-400 w-20 text-right">{f.allocation_pct}% · {fmt(f.budget_allocated)}</span>
          </div>
        ))}
      </div>

      {/* ═══ SECCIÓN F: Disclaimer ═══ */}
      <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200/60">
        Esta predicción es una referencia de mercado basada en benchmarks 2026 (WordStream, Get-Ryze, Ubersuggest)
        y simulación Monte Carlo con {fmtN(mc.meta.iterations)} iteraciones. No constituye una garantía de resultados.
        El rendimiento real depende de la calidad de los anuncios, landing pages, velocidad de respuesta a leads,
        estacionalidad y condiciones del mercado.
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50 p-5 text-center">
        <p className="font-bold text-slate-800 text-sm">Predicción personalizada con data de tu negocio</p>
        <p className="text-slate-500 text-xs mb-3">Te ayudamos a ejecutar la estrategia con resultados reales</p>
        <a href="https://wa.me/56992258137?text=Hola%2C%20hice%20una%20predicción%20en%20el%20Predictor%20v4%20y%20me%20gustaría%20una%20asesoría"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg transition text-sm shadow-md shadow-emerald-200">
          WhatsApp M&P
        </a>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════

function FunnelCard({ funnel: f }: { funnel: any }) {
  const stages = [
    { label: 'Impresiones', p25: f.impressions.p25, p50: f.impressions.p50, p75: f.impressions.p75, fmt: fmtN },
    { label: 'Clicks', p25: f.clicks.p25, p50: f.clicks.p50, p75: f.clicks.p75, fmt: fmtN, rate: f.benchmark.ctr, rateLabel: 'CTR' },
    { label: 'Leads', p25: f.leads.p25, p50: f.leads.p50, p75: f.leads.p75, fmt: (n: number) => Math.round(n).toString(), rate: f.benchmark.cvr, rateLabel: 'CVR' },
    { label: 'Ventas', p25: f.ventas.p25, p50: f.ventas.p50, p75: f.ventas.p75, fmt: (n: number) => n.toFixed(1) },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${PLATFORM_COLORS[f.platform]}`} />
          <span className="text-sm font-bold text-slate-700">{PLATFORM_NAMES[f.platform]}</span>
          <span className="text-[10px] text-slate-400">{f.allocation_pct}% · {fmt(f.budget_allocated)}</span>
        </div>
        <div className="text-right">
          <span className={`text-xs font-bold ${f.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>{f.roas.p50.toFixed(1)}x</span>
          <span className="text-[10px] text-slate-400 ml-1">ROAS</span>
        </div>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-slate-400 border-b border-slate-100">
            <th className="text-left py-1.5 font-medium">Etapa</th>
            <th className="text-center py-1.5 font-medium text-amber-500">P25</th>
            <th className="text-center py-1.5 font-medium text-indigo-500">P50</th>
            <th className="text-center py-1.5 font-medium text-emerald-500">P75</th>
            <th className="text-right py-1.5 font-medium">Bench.</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((s, i) => (
            <tr key={s.label} className="border-b border-slate-50">
              <td className="py-1.5 text-slate-600">
                {i > 0 && <span className="text-slate-300 mr-0.5 text-[9px]">↓</span>}
                {s.label}
                {s.rate !== undefined && <span className="text-slate-300 ml-0.5">({s.rateLabel} {s.rate}%)</span>}
              </td>
              <td className="text-center text-amber-600/70">{s.fmt(s.p25)}</td>
              <td className="text-center text-indigo-600 font-semibold">{s.fmt(s.p50)}</td>
              <td className="text-center text-emerald-600/70">{s.fmt(s.p75)}</td>
              <td className="text-right text-slate-300">{s.label === 'Clicks' ? `CPC ${fmt(f.benchmark.cpc)}` : ''}</td>
            </tr>
          ))}
          <tr className="border-t border-slate-200">
            <td className="py-1.5 text-slate-700 font-semibold">Revenue</td>
            <td className="text-center text-amber-600/70">{fmt(f.revenue.p25)}</td>
            <td className="text-center text-indigo-600 font-semibold">{fmt(f.revenue.p50)}</td>
            <td className="text-center text-emerald-600/70">{fmt(f.revenue.p75)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function CompareCard({ label, yours, ref_val, better }: { label: string; yours: string; ref_val: string; better?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <p className="text-[10px] text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{yours}</p>
      <p className={`text-[10px] mt-0.5 ${better === true ? 'text-emerald-500' : better === false ? 'text-red-400' : 'text-slate-400'}`}>
        vs {ref_val} {better === true ? '(mejor)' : better === false ? '(peor)' : '(ref.)'}
      </p>
    </div>
  )
}

function HistogramChart({ data, p25, p50, p75 }: { data: any[]; p25: number; p50: number; p75: number }) {
  if (!data?.length) return null
  const maxCount = Math.max(...data.map((d: any) => d.count))
  const w = 800, h = 160, pad = { t: 22, b: 20, l: 8, r: 8 }
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b
  const minB = data[0].bin, maxB = data[data.length - 1].bin, range = maxB - minB || 1
  const bw = cw / data.length - 1
  const getX = (v: number) => pad.l + ((v - minB) / range) * cw

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 160 }}>
      {data.map((d: any, i: number) => (
        <rect key={i} x={pad.l + (i / data.length) * cw} y={pad.t + ch - (d.count / maxCount) * ch}
          width={bw} height={(d.count / maxCount) * ch} fill="#6366f1" opacity={0.5} rx={1} />
      ))}
      <line x1={getX(p25)} y1={pad.t} x2={getX(p25)} y2={pad.t + ch} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={getX(p25)} y={pad.t - 5} textAnchor="middle" fontSize={9} fill="#f59e0b">P25: {Math.round(p25)}</text>
      <line x1={getX(p50)} y1={pad.t} x2={getX(p50)} y2={pad.t + ch} stroke="#6366f1" strokeWidth={2} />
      <text x={getX(p50)} y={pad.t - 5} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight="bold">P50: {Math.round(p50)}</text>
      <line x1={getX(p75)} y1={pad.t} x2={getX(p75)} y2={pad.t + ch} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={getX(p75)} y={pad.t - 5} textAnchor="middle" fontSize={9} fill="#10b981">P75: {Math.round(p75)}</text>
      {data.filter((_: any, i: number) => i % 4 === 0).map((d: any, i: number) => (
        <text key={i} x={pad.l + ((d.bin - minB) / range) * cw} y={h - 4} textAnchor="middle" fontSize={8} fill="#94a3b8">{Math.round(d.bin)}</text>
      ))}
    </svg>
  )
}
