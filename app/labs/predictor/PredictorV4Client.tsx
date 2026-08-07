// @ts-nocheck
'use client'

/**
 * PREDICTOR v4 — Monte Carlo
 *
 * Input simple (6 campos), resultados con:
 * - Resumen ejecutivo con 3 escenarios (P25/P50/P75)
 * - Embudos por plataforma (Google Search, Display, Meta)
 * - Comparación vs benchmarks industria
 * - Histograma Monte Carlo
 * - Distribución presupuesto
 * - Disclaimer + CTA
 */

import React, { useState } from 'react'

// ═══════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════

interface PercentileSet {
  p5: number; p25: number; p50: number; p75: number; p95: number
}

interface PlatformFunnel {
  platform: string
  budget_allocated: number
  allocation_pct: number
  impressions: PercentileSet
  clicks: PercentileSet
  leads: PercentileSet
  ventas: PercentileSet
  revenue: PercentileSet
  cpa: PercentileSet
  roas: PercentileSet
  benchmark: { cpc: number; ctr: number; cvr: number; cpa_usd: number }
}

interface MCResponse {
  montecarlo: {
    total: {
      conversiones: PercentileSet
      revenue: PercentileSet
      roas: PercentileSet
      cpa: PercentileSet
    }
    funnels: PlatformFunnel[]
    confidence: {
      prob_roas_gt_1: number
      prob_profitable: number
      roas_breakeven: number
      ic_90_conversiones: [number, number]
      ic_90_revenue: [number, number]
    }
    histogram: {
      conversiones: { bin: number; count: number }[]
      roas: { bin: number; count: number }[]
    }
    meta: { iterations: number; industria: string; pais: string; fuentes: string[]; benchmark_year: number }
  }
  contexto: any
  benchmarks: any
  fuentes: any
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════

const INDUSTRIAS = [
  { value: 'ECOMMERCE', label: 'E-commerce / Retail Online', icon: '🛒' },
  { value: 'INMOBILIARIA', label: 'Inmobiliaria / Corredoras', icon: '🏠' },
  { value: 'SALUD_MEDICINA', label: 'Salud / Clínicas', icon: '🏥' },
  { value: 'EDUCACION', label: 'Educación / Capacitación', icon: '🎓' },
  { value: 'TECNOLOGIA_SAAS', label: 'Tecnología / SaaS', icon: '💻' },
  { value: 'FINTECH', label: 'Fintech / Servicios Financieros', icon: '💳' },
  { value: 'AUTOMOTRIZ', label: 'Automotriz', icon: '🚗' },
  { value: 'TURISMO', label: 'Turismo / Hotelería', icon: '✈️' },
  { value: 'GASTRONOMIA', label: 'Gastronomía / Restaurantes', icon: '🍽️' },
  { value: 'MODA_RETAIL', label: 'Moda / Retail', icon: '👗' },
  { value: 'BELLEZA_PERSONAL', label: 'Belleza / Cuidado Personal', icon: '💄' },
  { value: 'SERVICIOS_LEGALES', label: 'Servicios Legales', icon: '⚖️' },
  { value: 'CONSTRUCCION_REMODELACION', label: 'Construcción / Remodelación', icon: '🔨' },
  { value: 'DEPORTES_FITNESS', label: 'Deportes / Fitness', icon: '🏋️' },
  { value: 'VETERINARIA_MASCOTAS', label: 'Veterinaria / Mascotas', icon: '🐾' },
  { value: 'MANUFACTURA_INDUSTRIAL', label: 'Manufactura / Industrial', icon: '🏭' },
  { value: 'LOGISTICA_TRANSPORTE', label: 'Logística / Transporte', icon: '🚛' },
  { value: 'SEGUROS', label: 'Seguros', icon: '🛡️' },
  { value: 'AGRICULTURA_AGROINDUSTRIA', label: 'Agricultura / Agroindustria', icon: '🌾' },
  { value: 'SERVICIOS_PROFESIONALES', label: 'Servicios Profesionales B2B', icon: '💼' },
  { value: 'ENERGIA_UTILITIES', label: 'Energía / Utilities', icon: '⚡' },
  { value: 'HOGAR_DECORACION', label: 'Hogar / Decoración', icon: '🏡' },
]

const PAISES = [
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
]

const BUDGET_PRESETS = [500000, 1000000, 2000000, 5000000, 10000000]

const PLATFORM_NAMES: Record<string, string> = {
  google_search: 'Google Search',
  google_display: 'Google Display',
  meta_ads: 'Meta Ads',
}

const PLATFORM_ICONS: Record<string, string> = {
  google_search: '🔍',
  google_display: '📺',
  meta_ads: '📱',
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${Math.round(n)}`
}

const fmtN = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return `${Math.round(n)}`
}

const fmtPct = (n: number): string => `${n.toFixed(1)}%`

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

export default function PredictorV4Client() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input')
  const [result, setResult] = useState<MCResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [form, setForm] = useState({
    industria: '',
    pais: 'CL',
    presupuesto_mensual: 1500000,
    ticket_promedio: '',
    tasa_cierre: '',
    objetivo: 'LEADS',
    // Advanced
    tipo_cliente: '',
    competencia_percibida: 5,
    madurez_digital: 'INTERMEDIO',
    margen_bruto: 40,
    geo_objetivo: 'NACIONAL',
  })

  const isValid = form.industria && form.presupuesto_mensual >= 300000

  const handleSubmit = async () => {
    setStep('loading')
    setError(null)

    try {
      const body: any = {
        industria: form.industria,
        pais: form.pais,
        presupuesto_mensual: form.presupuesto_mensual,
        objetivo: form.objetivo,
      }
      if (form.ticket_promedio) body.ticket_promedio = parseInt(form.ticket_promedio as string)
      if (form.tasa_cierre) body.tasa_cierre = parseInt(form.tasa_cierre as string)
      if (form.tipo_cliente) body.tipo_cliente = form.tipo_cliente
      if (form.competencia_percibida !== 5) body.competencia_percibida = form.competencia_percibida
      if (form.madurez_digital !== 'INTERMEDIO') body.madurez_digital = form.madurez_digital
      if (form.margen_bruto !== 40) body.margen_bruto = form.margen_bruto
      if (form.geo_objetivo !== 'NACIONAL') body.geo_objetivo = form.geo_objetivo

      const res = await fetch('/api/predictions/monte-carlo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Error en predicción')
      }

      const data = await res.json()
      setResult(data)
      setStep('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setError(e.message)
      setStep('input')
    }
  }

  const handleReset = () => {
    setResult(null)
    setStep('input')
    setForm({ ...form, industria: '', ticket_promedio: '', tasa_cierre: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo-myp.png" alt="M&P" className="h-8 invert brightness-200" />
            </a>
            <span className="text-white/30">|</span>
            <span className="text-sm font-semibold text-white/70">Predictor v4</span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Monte Carlo</span>
          </div>
          {step === 'results' && (
            <button onClick={handleReset} className="text-sm text-white/50 hover:text-white transition">
              Nuevo análisis
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ═══ STEP: INPUT ═══ */}
        {step === 'input' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Simulación Monte Carlo · 10,000 iteraciones · Data 2026</p>
              <h1 className="text-3xl font-bold text-white">Predictor de Campañas Digitales</h1>
              <p className="text-white/50 max-w-xl mx-auto text-sm">
                22 industrias · 6 países LATAM · Google Search + Display + Meta Ads
              </p>
            </div>

            {/* Industria */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">Industria</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {INDUSTRIAS.map(ind => (
                  <button
                    key={ind.value}
                    onClick={() => setForm({ ...form, industria: ind.value })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                      form.industria === ind.value
                        ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                    }`}
                  >
                    <span className="text-lg">{ind.icon}</span>
                    <span className="truncate">{ind.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">País</label>
              <div className="flex flex-wrap gap-2">
                {PAISES.map(p => (
                  <button
                    key={p.code}
                    onClick={() => setForm({ ...form, pais: p.code })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      form.pais === p.code
                        ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{p.flag}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presupuesto */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Presupuesto mensual: <span className="text-indigo-400 font-bold">{fmt(form.presupuesto_mensual)}</span>
              </label>
              <input
                type="range"
                min={300000}
                max={20000000}
                step={100000}
                value={form.presupuesto_mensual}
                onChange={e => setForm({ ...form, presupuesto_mensual: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex gap-2 mt-3">
                {BUDGET_PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => setForm({ ...form, presupuesto_mensual: p })}
                    className={`text-xs px-3 py-1.5 rounded-md transition ${
                      form.presupuesto_mensual === p
                        ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                        : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {fmt(p)}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket + Tasa de cierre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Ticket promedio (CLP)
                  <span className="text-white/30 font-normal ml-1">— opcional</span>
                </label>
                <input
                  type="number"
                  value={form.ticket_promedio}
                  onChange={e => setForm({ ...form, ticket_promedio: e.target.value })}
                  placeholder="Se usa promedio de la industria"
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Tasa de cierre (%)
                  <span className="text-white/30 font-normal ml-1">— opcional</span>
                </label>
                <input
                  type="number"
                  value={form.tasa_cierre}
                  onChange={e => setForm({ ...form, tasa_cierre: e.target.value })}
                  placeholder="Se usa promedio de la industria"
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">Objetivo</label>
              <div className="flex gap-2">
                {[
                  { value: 'LEADS', label: 'Leads', desc: 'Captar prospectos' },
                  { value: 'VENTAS_DIRECTAS', label: 'Ventas', desc: 'Conversiones directas' },
                  { value: 'AWARENESS', label: 'Awareness', desc: 'Visibilidad de marca' },
                ].map(obj => (
                  <button
                    key={obj.value}
                    onClick={() => setForm({ ...form, objetivo: obj.value })}
                    className={`flex-1 p-3 rounded-lg text-center transition-all ${
                      form.objetivo === obj.value
                        ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <p className="font-semibold text-sm">{obj.label}</p>
                    <p className="text-xs mt-0.5 opacity-60">{obj.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-white/40 hover:text-white/60 transition"
              >
                {showAdvanced ? '▾' : '▸'} Ajustes avanzados
              </button>
              {showAdvanced && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1">Tipo cliente</label>
                    <select
                      value={form.tipo_cliente}
                      onChange={e => setForm({ ...form, tipo_cliente: e.target.value })}
                      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm"
                    >
                      <option value="">Auto (por industria)</option>
                      <option value="B2C">B2C</option>
                      <option value="B2B">B2B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1">Competencia ({form.competencia_percibida})</label>
                    <input
                      type="range" min={1} max={10}
                      value={form.competencia_percibida}
                      onChange={e => setForm({ ...form, competencia_percibida: parseInt(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1">Madurez digital</label>
                    <select
                      value={form.madurez_digital}
                      onChange={e => setForm({ ...form, madurez_digital: e.target.value })}
                      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm"
                    >
                      <option value="PRINCIPIANTE">Principiante</option>
                      <option value="INTERMEDIO">Intermedio</option>
                      <option value="AVANZADO">Avanzado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1">Margen bruto ({form.margen_bruto}%)</label>
                    <input
                      type="range" min={10} max={80}
                      value={form.margen_bruto}
                      onChange={e => setForm({ ...form, margen_bruto: parseInt(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1">Geo objetivo</label>
                    <select
                      value={form.geo_objetivo}
                      onChange={e => setForm({ ...form, geo_objetivo: e.target.value })}
                      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm"
                    >
                      <option value="NACIONAL">Nacional</option>
                      <option value="SANTIAGO">Santiago</option>
                      <option value="REGIONES">Regiones</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="text-center space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold rounded-lg transition-all text-sm"
              >
                Generar predicción Monte Carlo
              </button>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              {!isValid && (
                <p className="text-white/30 text-xs">Selecciona una industria y presupuesto mínimo $300K</p>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP: LOADING ═══ */}
        {step === 'loading' && (
          <div className="text-center py-20 space-y-4">
            <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm">Ejecutando 10,000 simulaciones...</p>
            <p className="text-white/30 text-xs">Google Search · Google Display · Meta Ads</p>
          </div>
        )}

        {/* ═══ STEP: RESULTS ═══ */}
        {step === 'results' && result && (
          <div className="space-y-8">
            <ResultsView data={result} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>Motor Monte Carlo v4.0 · Benchmarks 2026 · {new Date().getFullYear()}</span>
          <div className="flex gap-4">
            <a href="/labs" className="hover:text-white/60 transition">M&P Labs</a>
            <a href="/" className="hover:text-white/60 transition">Inicio</a>
            <a href="https://wa.me/56992258137" className="hover:text-white/60 transition">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS VIEW
// ═══════════════════════════════════════════════════════════════════

function ResultsView({ data, onReset }: { data: MCResponse; onReset: () => void }) {
  const mc = data.montecarlo
  const ctx = data.contexto
  const t = mc.total

  return (
    <>
      {/* Header contexto */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full">{mc.meta.industria}</span>
        <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full">{PAISES.find(p => p.code === mc.meta.pais)?.flag} {PAISES.find(p => p.code === mc.meta.pais)?.name}</span>
        <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full">{fmt(mc.meta.presupuesto)}/mes</span>
        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Monte Carlo · {fmtN(mc.meta.iterations)} simulaciones</span>
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">Data {mc.meta.benchmark_year}</span>
      </div>

      {/* Defaults usados */}
      {(ctx.defaults_usados.ticket || ctx.defaults_usados.tasa_cierre) && (
        <div className="text-xs text-white/30 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
          Defaults usados:
          {ctx.defaults_usados.ticket && <span className="ml-2">Ticket = {fmt(ctx.defaults_usados.ticket_default)}</span>}
          {ctx.defaults_usados.tasa_cierre && <span className="ml-2">Tasa cierre = {ctx.defaults_usados.tasa_cierre_default}%</span>}
        </div>
      )}

      {/* ═══ SECCIÓN A: Resumen ejecutivo ═══ */}
      <section className="bg-white/5 rounded-xl border border-white/10 p-6">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-white">{Math.round(t.conversiones.p50)} <span className="text-lg text-white/50">conversiones/mes</span></p>
          <p className="text-white/40 text-sm mt-1">IC 90%: entre {Math.round(mc.confidence.ic_90_conversiones[0])} y {Math.round(mc.confidence.ic_90_conversiones[1])} conversiones</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-emerald-400 font-bold">{fmt(t.revenue.p50)} revenue</span>
            <span className="text-white/30">·</span>
            <span className={`font-bold ${t.roas.p50 >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>{t.roas.p50.toFixed(1)}x ROAS</span>
          </div>
          <p className={`text-sm mt-2 font-semibold ${mc.confidence.prob_roas_gt_1 >= 70 ? 'text-emerald-400' : mc.confidence.prob_roas_gt_1 >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
            {mc.confidence.prob_roas_gt_1}% probabilidad de recuperar la inversión
          </p>
        </div>

        {/* 3 escenarios */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Conservador', sub: 'P25 — 75% prob.', conv: t.conversiones.p25, rev: t.revenue.p25, roas: t.roas.p25, cpa: t.cpa.p75, accent: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Base', sub: 'P50 — Mediana', conv: t.conversiones.p50, rev: t.revenue.p50, roas: t.roas.p50, cpa: t.cpa.p50, accent: 'text-indigo-400', border: 'border-indigo-500/30' },
            { label: 'Favorable', sub: 'P75 — 25% prob.', conv: t.conversiones.p75, rev: t.revenue.p75, roas: t.roas.p75, cpa: t.cpa.p25, accent: 'text-emerald-400', border: 'border-emerald-500/20' },
          ].map(s => (
            <div key={s.label} className={`bg-white/5 rounded-lg p-4 border ${s.border} text-center`}>
              <p className={`text-xs font-semibold ${s.accent} mb-1`}>{s.label}</p>
              <p className="text-xs text-white/30 mb-3">{s.sub}</p>
              <p className="text-2xl font-bold text-white">{Math.round(s.conv)}</p>
              <p className="text-xs text-white/40 mb-2">conversiones</p>
              <div className="space-y-1 text-xs">
                <p className="text-white/60">{fmt(s.rev)} revenue</p>
                <p className={s.roas >= 1 ? 'text-emerald-400' : 'text-red-400'}>{s.roas.toFixed(1)}x ROAS</p>
                <p className="text-white/40">{fmt(s.cpa)} CPA</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECCIÓN B: Embudos por plataforma ═══ */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Embudo predictivo por plataforma</h2>
        <div className="space-y-4">
          {mc.funnels.map(funnel => (
            <FunnelCard key={funnel.platform} funnel={funnel} />
          ))}
        </div>
      </section>

      {/* ═══ SECCIÓN C: Comparación vs industria ═══ */}
      {data.benchmarks && (
        <section className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-1">Tu predicción vs promedio de la industria</h2>
          <p className="text-xs text-white/30 mb-4">
            Fuentes: {data.fuentes.attribution} · {data.fuentes.year}
          </p>
          <div className="space-y-4">
            {mc.funnels.map(f => {
              const userCPA = f.cpa.p50
              const benchCPA = f.benchmark.cpa_usd * 935 // approx CLP
              const cpaDiff = ((userCPA / benchCPA - 1) * 100)
              const userROAS = f.roas.p50
              return (
                <div key={f.platform} className="space-y-2">
                  <p className="text-sm font-semibold text-white/70">{PLATFORM_ICONS[f.platform]} {PLATFORM_NAMES[f.platform]}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <BenchmarkBar label="CPC" userVal={`${fmt(f.benchmark.cpc)}`} benchVal={`${fmt(f.benchmark.cpc)}`} diff={0} />
                    <BenchmarkBar label="CTR" userVal={`${f.benchmark.ctr}%`} benchVal={`${f.benchmark.ctr}%`} diff={0} />
                    <BenchmarkBar label="CVR" userVal={`${f.benchmark.cvr}%`} benchVal={`${f.benchmark.cvr}%`} diff={0} />
                    <BenchmarkBar label="CPA" userVal={fmt(userCPA)} benchVal={fmt(benchCPA)} diff={-cpaDiff} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══ SECCIÓN D: Histograma Monte Carlo ═══ */}
      <section className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-1">Distribución de resultados</h2>
        <p className="text-xs text-white/30 mb-4">10,000 simulaciones — cada barra = rango de conversiones posibles</p>
        <HistogramChart
          data={mc.histogram.conversiones}
          p25={t.conversiones.p25}
          p50={t.conversiones.p50}
          p75={t.conversiones.p75}
        />
      </section>

      {/* ═══ SECCIÓN E: Distribución presupuesto ═══ */}
      <section className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Distribución de presupuesto</h2>
        <div className="space-y-3">
          {mc.funnels.map(f => (
            <div key={f.platform} className="flex items-center gap-4">
              <span className="text-lg">{PLATFORM_ICONS[f.platform]}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/70 font-medium">{PLATFORM_NAMES[f.platform]}</span>
                  <span className="text-white/50">{f.allocation_pct}% — {fmt(f.budget_allocated)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${f.allocation_pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.benchmarks?.recomendaciones && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-white/40">
            <p className="font-semibold text-white/60 mb-1">Recomendación para tu industria:</p>
            <p>{data.benchmarks.recomendaciones.estrategia_principal}</p>
          </div>
        )}
      </section>

      {/* ═══ SECCIÓN F: Disclaimer + CTA ═══ */}
      <section className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-xs text-white/30 leading-relaxed">
          Esta predicción es una referencia de mercado basada en benchmarks 2026 (WordStream, Get-Ryze, Ubersuggest)
          y simulación Monte Carlo con {fmtN(mc.meta.iterations)} iteraciones. No constituye una garantía de resultados.
          El rendimiento real depende de la calidad de los anuncios, landing pages, velocidad de respuesta a leads,
          estacionalidad y condiciones del mercado.
        </div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 p-6 text-center">
          <p className="text-white font-bold mb-1">Predicción personalizada con data de tu negocio</p>
          <p className="text-white/50 text-sm mb-4">Te ayudamos a ejecutar la estrategia con resultados reales</p>
          <a
            href="https://wa.me/56992258137?text=Hola%2C%20hice%20una%20predicción%20en%20el%20Predictor%20v4%20y%20me%20gustaría%20una%20asesoría"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm"
          >
            WhatsApp M&P
          </a>
        </div>
      </section>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════
// FUNNEL CARD
// ═══════════════════════════════════════════════════════════════════

function FunnelCard({ funnel }: { funnel: PlatformFunnel }) {
  const f = funnel
  const stages = [
    { label: 'Impresiones', p25: f.impressions.p25, p50: f.impressions.p50, p75: f.impressions.p75, format: fmtN },
    { label: 'Clicks', p25: f.clicks.p25, p50: f.clicks.p50, p75: f.clicks.p75, format: fmtN, rate: f.benchmark.ctr, rateLabel: 'CTR' },
    { label: 'Leads', p25: f.leads.p25, p50: f.leads.p50, p75: f.leads.p75, format: (n: number) => Math.round(n).toString(), rate: f.benchmark.cvr, rateLabel: 'CVR' },
    { label: 'Ventas', p25: f.ventas.p25, p50: f.ventas.p50, p75: f.ventas.p75, format: (n: number) => n.toFixed(1) },
  ]

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[f.platform]}</span>
          <div>
            <p className="font-bold text-white text-sm">{PLATFORM_NAMES[f.platform]}</p>
            <p className="text-xs text-white/40">{f.allocation_pct}% del presupuesto — {fmt(f.budget_allocated)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${f.roas.p50 >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
            {f.roas.p50.toFixed(1)}x ROAS
          </p>
          <p className="text-xs text-white/40">{fmt(f.cpa.p50)} CPA</p>
        </div>
      </div>

      {/* Tabla embudo */}
      <table className="w-full text-xs">
        <thead>
          <tr className="text-white/40 border-b border-white/10">
            <th className="text-left py-2 font-medium">Etapa</th>
            <th className="text-center py-2 font-medium">Conservador</th>
            <th className="text-center py-2 font-medium text-indigo-400">Base</th>
            <th className="text-center py-2 font-medium">Favorable</th>
            <th className="text-right py-2 font-medium">Benchmark</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((s, i) => (
            <tr key={s.label} className="border-b border-white/5">
              <td className="py-2 text-white/60">
                {i > 0 && <span className="text-white/20 mr-1">↓</span>}
                {s.label}
                {s.rate !== undefined && <span className="text-white/20 ml-1">({s.rateLabel} {s.rate}%)</span>}
              </td>
              <td className="py-2 text-center text-amber-400/70">{s.format(s.p25)}</td>
              <td className="py-2 text-center text-indigo-300 font-semibold">{s.format(s.p50)}</td>
              <td className="py-2 text-center text-emerald-400/70">{s.format(s.p75)}</td>
              <td className="py-2 text-right text-white/20">
                {s.label === 'Clicks' ? `CPC ${fmt(f.benchmark.cpc)}` : ''}
              </td>
            </tr>
          ))}
          <tr className="border-t border-white/10">
            <td className="py-2 text-white/60 font-semibold">Revenue</td>
            <td className="py-2 text-center text-amber-400/70">{fmt(f.revenue.p25)}</td>
            <td className="py-2 text-center text-indigo-300 font-semibold">{fmt(f.revenue.p50)}</td>
            <td className="py-2 text-center text-emerald-400/70">{fmt(f.revenue.p75)}</td>
            <td className="py-2 text-right text-white/20"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// BENCHMARK BAR
// ═══════════════════════════════════════════════════════════════════

function BenchmarkBar({ label, userVal, benchVal, diff }: { label: string; userVal: string; benchVal: string; diff: number }) {
  return (
    <div className="bg-white/5 rounded-lg p-2">
      <p className="text-white/40 mb-1">{label}</p>
      <p className="text-white font-semibold">{userVal}</p>
      {diff !== 0 && (
        <p className={`text-[10px] mt-0.5 ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {diff > 0 ? '+' : ''}{diff.toFixed(0)}% vs prom.
        </p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HISTOGRAM CHART (SVG puro)
// ═══════════════════════════════════════════════════════════════════

function HistogramChart({
  data,
  p25,
  p50,
  p75,
}: {
  data: { bin: number; count: number }[]
  p25: number
  p50: number
  p75: number
}) {
  if (!data || data.length === 0) return null

  const maxCount = Math.max(...data.map(d => d.count))
  const width = 800
  const height = 200
  const barWidth = width / data.length - 2
  const padding = { top: 20, bottom: 30, left: 10, right: 10 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const minBin = data[0].bin
  const maxBin = data[data.length - 1].bin
  const binRange = maxBin - minBin || 1

  const getX = (val: number) => padding.left + ((val - minBin) / binRange) * chartWidth

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 200 }}>
        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.count / maxCount) * chartHeight
          const x = padding.left + (i / data.length) * chartWidth
          const y = padding.top + chartHeight - barHeight

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#6366f1"
              opacity={0.6}
              rx={1}
            />
          )
        })}

        {/* P25 line */}
        <line x1={getX(p25)} y1={padding.top} x2={getX(p25)} y2={padding.top + chartHeight} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={getX(p25)} y={padding.top - 4} textAnchor="middle" fontSize={10} fill="#f59e0b">P25: {Math.round(p25)}</text>

        {/* P50 line */}
        <line x1={getX(p50)} y1={padding.top} x2={getX(p50)} y2={padding.top + chartHeight} stroke="#818cf8" strokeWidth={2} />
        <text x={getX(p50)} y={padding.top - 4} textAnchor="middle" fontSize={10} fill="#818cf8" fontWeight="bold">P50: {Math.round(p50)}</text>

        {/* P75 line */}
        <line x1={getX(p75)} y1={padding.top} x2={getX(p75)} y2={padding.top + chartHeight} stroke="#34d399" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={getX(p75)} y={padding.top - 4} textAnchor="middle" fontSize={10} fill="#34d399">P75: {Math.round(p75)}</text>

        {/* X axis labels */}
        {data.filter((_, i) => i % 4 === 0).map((d, i) => (
          <text
            key={i}
            x={padding.left + ((d.bin - minBin) / binRange) * chartWidth}
            y={height - 8}
            textAnchor="middle"
            fontSize={9}
            fill="#ffffff33"
          >
            {Math.round(d.bin)}
          </text>
        ))}
      </svg>
    </div>
  )
}
