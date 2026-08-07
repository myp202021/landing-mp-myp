// @ts-nocheck
'use client'

/**
 * PREDICTOR v4.2 — Stripe/Linear Style
 *
 * UX:
 * - Dropdown con búsqueda para industria
 * - E-commerce: conversión = compra (sin tasa de cierre)
 * - Servicios: conversión = lead, tasa de cierre separada
 * - Estadística visible: IC 90%, P(ROAS>1), histograma MC
 * - Diseño Stripe/Linear: limpio, Inter, whitespace, datos precisos
 */

import React, { useState, useMemo, useRef, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const INDUSTRIAS = [
  { value: 'ECOMMERCE', label: 'E-commerce / Retail Online', type: 'ecommerce' },
  { value: 'MODA_RETAIL', label: 'Moda / Retail', type: 'ecommerce' },
  { value: 'HOGAR_DECORACION', label: 'Hogar / Decoración', type: 'ecommerce' },
  { value: 'INMOBILIARIA', label: 'Inmobiliaria / Corredoras', type: 'servicios' },
  { value: 'SALUD_MEDICINA', label: 'Salud / Clínicas / Medicina', type: 'servicios' },
  { value: 'EDUCACION', label: 'Educación / Capacitación', type: 'servicios' },
  { value: 'TECNOLOGIA_SAAS', label: 'Tecnología / SaaS', type: 'servicios' },
  { value: 'FINTECH', label: 'Fintech / Servicios Financieros', type: 'servicios' },
  { value: 'AUTOMOTRIZ', label: 'Automotriz', type: 'servicios' },
  { value: 'TURISMO', label: 'Turismo / Hotelería', type: 'servicios' },
  { value: 'GASTRONOMIA', label: 'Gastronomía / Restaurantes', type: 'servicios' },
  { value: 'BELLEZA_PERSONAL', label: 'Belleza / Cuidado Personal', type: 'servicios' },
  { value: 'SERVICIOS_LEGALES', label: 'Servicios Legales', type: 'servicios' },
  { value: 'CONSTRUCCION_REMODELACION', label: 'Construcción / Remodelación', type: 'servicios' },
  { value: 'DEPORTES_FITNESS', label: 'Deportes / Fitness', type: 'servicios' },
  { value: 'VETERINARIA_MASCOTAS', label: 'Veterinaria / Mascotas', type: 'servicios' },
  { value: 'MANUFACTURA_INDUSTRIAL', label: 'Manufactura / Industrial', type: 'servicios' },
  { value: 'LOGISTICA_TRANSPORTE', label: 'Logística / Transporte', type: 'servicios' },
  { value: 'SEGUROS', label: 'Seguros', type: 'servicios' },
  { value: 'AGRICULTURA_AGROINDUSTRIA', label: 'Agricultura / Agroindustria', type: 'servicios' },
  { value: 'SERVICIOS_PROFESIONALES', label: 'Servicios Profesionales B2B', type: 'servicios' },
  { value: 'ENERGIA_UTILITIES', label: 'Energía / Utilities', type: 'servicios' },
]

const PAISES = [
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
]

const PLAT: Record<string, string> = { google_search: 'Google Search', google_display: 'Google Display', meta_ads: 'Meta Ads' }

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => {
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${Math.round(n)}`
}
const fmtN = (n: number) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return Math.round(n).toString()
}

// ═══════════════════════════════════════════════════════════════════
// SEARCHABLE DROPDOWN
// ═══════════════════════════════════════════════════════════════════

function SearchDropdown({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setSearch('') }}
        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-left text-[14px] text-gray-900 hover:border-gray-300 transition flex items-center justify-between"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>{selected?.label || placeholder}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar industria..."
              className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-md text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map(o => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition ${
                  o.value === value
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {o.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-gray-400">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <span
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full border border-gray-300 text-gray-400 text-[9px] font-bold cursor-help hover:border-indigo-400 hover:text-indigo-500 transition"
      >?</span>
      {show && (
        <span className="absolute z-50 bottom-7 left-1/2 -translate-x-1/2 w-60 px-3 py-2 bg-gray-900 text-white text-[11px] leading-[1.5] rounded-lg shadow-xl">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function PredictorV4Client() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    industria: '', pais: 'CL', presupuesto_mensual: 1500000,
    ticket_promedio: '', tasa_cierre: '',
    objetivo: 'LEADS', tipo_cliente: 'B2C', tamano_empresa: 'PYME',
    competencia_percibida: 5, madurez_digital: 'INTERMEDIO',
    margen_bruto: 40,
  })

  const industriaData = INDUSTRIAS.find(i => i.value === form.industria)
  const isEcommerce = industriaData?.type === 'ecommerce'
  const isValid = form.industria && form.presupuesto_mensual >= 300000

  const handleSubmit = async () => {
    setStep('loading'); setError(null)
    try {
      const body: any = {
        industria: form.industria, pais: form.pais,
        presupuesto_mensual: form.presupuesto_mensual,
        objetivo: isEcommerce ? 'VENTAS_DIRECTAS' : form.objetivo,
        tipo_cliente: form.tipo_cliente, tamano_empresa: form.tamano_empresa,
      }
      if (form.ticket_promedio) body.ticket_promedio = parseInt(form.ticket_promedio)
      // E-commerce: no enviar tasa de cierre (la conversión ES la compra)
      if (!isEcommerce && form.tasa_cierre) body.tasa_cierre = parseInt(form.tasa_cierre)
      if (isEcommerce) body.tasa_cierre = 100 // CVR ya incluye la compra
      if (form.competencia_percibida !== 5) body.competencia_percibida = form.competencia_percibida
      if (form.madurez_digital !== 'INTERMEDIO') body.madurez_digital = form.madurez_digital
      if (form.margen_bruto !== 40) body.margen_bruto = form.margen_bruto

      const res = await fetch('/api/predictions/monte-carlo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).message || 'Error')
      setResult(await res.json())
      setStep('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) { setError(e.message); setStep('input') }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav — Stripe style */}
      <nav className="border-b border-gray-100">
        <div className="max-w-[720px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo-myp.png" alt="M&P" className="h-7" /></a>
            <span className="text-gray-200">/</span>
            <span className="text-[13px] font-medium text-gray-500">Predictor</span>
          </div>
          {step === 'results' && (
            <button onClick={() => { setResult(null); setStep('input'); window.scrollTo({ top: 0 }) }}
              className="text-[13px] text-indigo-600 hover:text-indigo-700 font-medium transition">
              Nuevo análisis
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-[720px] mx-auto px-6">

        {/* ═══ INPUT ═══ */}
        {step === 'input' && (
          <div className="py-12 space-y-10">
            {/* Header */}
            <div>
              <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Predictor de campañas</h1>
              <p className="text-[15px] text-gray-500 mt-1">
                Simulación Monte Carlo con 10,000 iteraciones. Data verificada 2026.
              </p>
            </div>

            {/* Industria */}
            <Field label="Industria" tip="Los benchmarks (CPC, CTR, CVR) se ajustan automáticamente según la industria seleccionada.">
              <SearchDropdown
                value={form.industria}
                onChange={v => setForm({ ...form, industria: v })}
                options={INDUSTRIAS}
                placeholder="Seleccionar industria..."
              />
              {isEcommerce && (
                <p className="text-[12px] text-indigo-600 mt-2 font-medium">
                  E-commerce: la conversión es la compra. No se aplica tasa de cierre adicional.
                </p>
              )}
              {industriaData && !isEcommerce && (
                <p className="text-[12px] text-gray-400 mt-2">
                  Servicios: la conversión es un lead (formulario, llamada, WhatsApp). Se aplica tasa de cierre para estimar ventas.
                </p>
              )}
            </Field>

            {/* País + Presupuesto */}
            <div className="grid grid-cols-2 gap-6">
              <Field label="País">
                <div className="flex gap-1.5">
                  {PAISES.map(p => (
                    <button key={p.code} onClick={() => setForm({ ...form, pais: p.code })}
                      className={`flex-1 py-2 rounded-md text-[12px] font-medium transition border ${
                        form.pais === p.code
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{p.flag} {p.code}</button>
                  ))}
                </div>
              </Field>

              <Field label="Presupuesto mensual" tip="Inversión en pauta (Google + Meta). No incluye fee de gestión.">
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-semibold text-gray-900 tabular-nums">{fmt(form.presupuesto_mensual)}</span>
                </div>
                <input type="range" min={300000} max={20000000} step={100000}
                  value={form.presupuesto_mensual}
                  onChange={e => setForm({ ...form, presupuesto_mensual: parseInt(e.target.value) })}
                  className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600 mt-2"
                />
              </Field>
            </div>

            {/* Ticket */}
            <Field label={isEcommerce ? 'Ticket promedio (valor de compra)' : 'Ticket promedio'} tip="Valor promedio de cada venta o contrato. Si lo dejas vacío, se usa la referencia de tu industria.">
              <input type="number" value={form.ticket_promedio}
                onChange={e => setForm({ ...form, ticket_promedio: e.target.value })}
                placeholder="Referencia de la industria"
                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 transition"
              />
            </Field>

            {/* Tasa de cierre — SOLO para servicios */}
            {!isEcommerce && form.industria && (
              <Field label="Tasa de cierre (%)" tip="% de leads que se convierten en venta cerrada. Si no la conoces, usamos la referencia de mercado según tu industria, tipo de cliente y tamaño.">
                <input type="number" value={form.tasa_cierre}
                  onChange={e => setForm({ ...form, tasa_cierre: e.target.value })}
                  placeholder="Referencia de mercado"
                  className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 transition"
                />
              </Field>
            )}

            {/* Objetivo — SOLO para servicios */}
            {!isEcommerce && form.industria && (
              <Field label="Objetivo">
                <div className="flex gap-2">
                  {[
                    { v: 'LEADS', l: 'Generación de leads' },
                    { v: 'VENTAS_DIRECTAS', l: 'Ventas directas' },
                    { v: 'AWARENESS', l: 'Awareness' },
                  ].map(o => (
                    <button key={o.v} onClick={() => setForm({ ...form, objetivo: o.v })}
                      className={`flex-1 py-2.5 rounded-md text-[12px] font-medium transition border ${
                        form.objetivo === o.v
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{o.l}</button>
                  ))}
                </div>
              </Field>
            )}

            {/* Tipo + Tamaño */}
            <div className="grid grid-cols-2 gap-6">
              <Field label="Tipo de cliente">
                <div className="flex gap-2">
                  {['B2C', 'B2B'].map(t => (
                    <button key={t} onClick={() => setForm({ ...form, tipo_cliente: t })}
                      className={`flex-1 py-2.5 rounded-md text-[13px] font-medium transition border ${
                        form.tipo_cliente === t ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{t}</button>
                  ))}
                </div>
              </Field>
              <Field label="Tamaño empresa" tip="Afecta la tasa de cierre de referencia. Empresas más grandes suelen cerrar mejor.">
                <div className="flex gap-1.5">
                  {[{ v: 'MICRO', l: '<10' }, { v: 'PYME', l: '10-50' }, { v: 'MEDIANA', l: '50-200' }, { v: 'GRANDE', l: '>200' }].map(t => (
                    <button key={t.v} onClick={() => setForm({ ...form, tamano_empresa: t.v })}
                      className={`flex-1 py-2 rounded-md text-[11px] font-medium transition border ${
                        form.tamano_empresa === t.v ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{t.l}</button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Submit */}
            <div>
              <button onClick={handleSubmit} disabled={!isValid}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-[14px] font-medium rounded-lg transition">
                Generar predicción
              </button>
              {error && <p className="text-red-500 text-[13px] mt-2">{error}</p>}
            </div>
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {step === 'loading' && (
          <div className="py-32 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-[13px] text-gray-400 mt-4">Ejecutando 10,000 simulaciones...</p>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {step === 'results' && result && <Results data={result} isEcommerce={INDUSTRIAS.find(i => i.value === result.montecarlo.meta.industria_codigo)?.type === 'ecommerce'} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-[720px] mx-auto px-6 py-5 flex items-center justify-between text-[12px] text-gray-400">
          <span>Motor Monte Carlo v4.2 · Benchmarks 2026 · {new Date().getFullYear()}</span>
          <div className="flex gap-4">
            <a href="/labs" className="hover:text-gray-600 transition">Labs</a>
            <a href="/" className="hover:text-gray-600 transition">Inicio</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// FIELD WRAPPER
// ═══════════════════════════════════════════════════════════════════

function Field({ label, tip, children }: { label: string; tip?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-2">
        {label}{tip && <Tip text={tip} />}
      </label>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════════════

function Results({ data, isEcommerce }: { data: any; isEcommerce: boolean }) {
  const mc = data.montecarlo
  const t = mc.total
  const m = mc.meta
  const opt = data.optimal
  const mainMetric = isEcommerce ? t.leads : t.leads // leads = conversiones Google Ads en ambos casos
  const mainLabel = isEcommerce ? 'compras' : 'leads'

  return (
    <div className="py-12 space-y-12">

      {/* Context line */}
      <div className="text-[12px] text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
        <span>{m.industria}</span>
        <span className="text-gray-200">·</span>
        <span>{PAISES.find(p => p.code === m.pais)?.flag} {PAISES.find(p => p.code === m.pais)?.name}</span>
        <span className="text-gray-200">·</span>
        <span>{fmt(m.presupuesto)}/mes</span>
        <span className="text-gray-200">·</span>
        <span>{fmtN(m.iterations)} simulaciones</span>
        {m.tasa_cierre_es_default && !isEcommerce && (
          <><span className="text-gray-200">·</span><span className="text-amber-500">Tasa cierre {m.tasa_cierre}% (ref. mercado)</span></>
        )}
        {m.ticket_es_default && (
          <><span className="text-gray-200">·</span><span className="text-amber-500">Ticket {fmt(m.ticket_promedio)} (ref. industria)</span></>
        )}
      </div>

      {/* ═══ HEADLINE ═══ */}
      <div>
        <p className="text-[48px] font-semibold text-gray-900 tracking-tight leading-none tabular-nums">
          {Math.round(mainMetric.p50)}
        </p>
        <p className="text-[15px] text-gray-500 mt-1">{mainLabel} estimados por mes</p>
        {!isEcommerce && (
          <p className="text-[13px] text-gray-400 mt-0.5">
            {Math.round(t.conversiones.p50)} ventas estimadas (tasa de cierre {m.tasa_cierre}%)
          </p>
        )}
      </div>

      {/* ═══ STATISTICAL CONFIDENCE ═══ */}
      <div className="grid grid-cols-4 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
        <Stat label="IC 90%" value={`${Math.round(mainMetric.p5)} — ${Math.round(mainMetric.p95)}`} sub={mainLabel} />
        <Stat label="P(ROAS > 1)" value={`${mc.confidence.prob_roas_gt_1}%`}
          sub={mc.confidence.prob_roas_gt_1 >= 70 ? 'Alta prob.' : mc.confidence.prob_roas_gt_1 >= 40 ? 'Media' : 'Baja'}
          color={mc.confidence.prob_roas_gt_1 >= 70 ? 'text-emerald-600' : mc.confidence.prob_roas_gt_1 >= 40 ? 'text-amber-600' : 'text-red-500'} />
        <Stat label="ROAS mediana" value={`${t.roas.p50.toFixed(1)}x`} sub={`IC: ${t.roas.p5.toFixed(1)}x — ${t.roas.p95.toFixed(1)}x`}
          color={t.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'} />
        <Stat label={isEcommerce ? 'CPA mediana' : 'CPL mediana'} value={fmt(isEcommerce ? t.cpa.p50 : t.cpl.p50)} sub={`IC: ${fmt(isEcommerce ? t.cpa.p5 : t.cpl.p5)} — ${fmt(isEcommerce ? t.cpa.p95 : t.cpl.p95)}`} />
      </div>

      {/* ═══ 3 ESCENARIOS ═══ */}
      <div>
        <h2 className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-4">Escenarios</h2>
        <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
          {[
            { label: 'Conservador', sub: 'Percentil 25 — 75% prob. de alcanzar o superar', leads: mainMetric.p25, conv: t.conversiones.p25, rev: t.revenue.p25, roas: t.roas.p25, cpl: t.cpl.p75 },
            { label: 'Base', sub: 'Percentil 50 — resultado más probable', leads: mainMetric.p50, conv: t.conversiones.p50, rev: t.revenue.p50, roas: t.roas.p50, cpl: t.cpl.p50 },
            { label: 'Favorable', sub: 'Percentil 75 — 25% prob.', leads: mainMetric.p75, conv: t.conversiones.p75, rev: t.revenue.p75, roas: t.roas.p75, cpl: t.cpl.p25 },
          ].map(s => (
            <div key={s.label} className="bg-white p-5">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-[11px] text-gray-300 mb-3">{s.sub}</p>
              <p className="text-[28px] font-semibold text-gray-900 tabular-nums">{Math.round(s.leads)}</p>
              <p className="text-[12px] text-gray-400 mb-3">{mainLabel}</p>
              <div className="space-y-1 text-[12px]">
                {!isEcommerce && <Row label="Ventas" value={Math.round(s.conv).toString()} />}
                <Row label="Revenue" value={fmt(s.rev)} />
                <Row label="ROAS" value={`${s.roas.toFixed(1)}x`} color={s.roas >= 1 ? 'text-emerald-600' : 'text-red-500'} />
                <Row label={isEcommerce ? 'CPA' : 'CPL'} value={fmt(s.cpl)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HISTOGRAMA MC ═══ */}
      <div>
        <h2 className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-1">Distribución Monte Carlo</h2>
        <p className="text-[12px] text-gray-400 mb-4">10,000 simulaciones. Cada barra es un rango de {mainLabel} posibles.</p>
        <Histogram data={mc.histogram.conversiones} p25={mainMetric.p25} p50={mainMetric.p50} p75={mainMetric.p75} />
      </div>

      {/* ═══ EMBUDOS POR PLATAFORMA ═══ */}
      <div>
        <h2 className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-4">Embudo por plataforma</h2>
        <div className="space-y-3">
          {mc.funnels.map((f: any) => (
            <Funnel key={f.platform} f={f} isEcommerce={isEcommerce} tasaCierre={m.tasa_cierre} />
          ))}
        </div>
      </div>

      {/* ═══ ÓPTIMOS INDUSTRIA ═══ */}
      {opt && (
        <div>
          <h2 className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-1">Referencia de mercado</h2>
          <p className="text-[12px] text-gray-400 mb-4">{opt.industria} · {opt.tipo_cliente} · {opt.tamano} · Fuentes: WordStream, Get-Ryze, Ubersuggest {opt.benchmark_year}</p>
          <div className="grid grid-cols-4 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
            <Stat label="CPC Search" value={fmt(opt.google_search.cpc)} sub={`${opt.google_search.ctr}% CTR · ${opt.google_search.cvr}% CVR`} />
            <Stat label="CPA estimado" value={fmt(opt.cpa_estimado)} />
            <Stat label="ROAS típico" value={`${opt.roas_tipico}x`} />
            <Stat label="Presup. recomendado" value={fmt(opt.presupuesto_optimo.recomendado)} sub={`Min: ${fmt(opt.presupuesto_optimo.min)}`} />
          </div>
        </div>
      )}

      {/* ═══ DISCLAIMER ═══ */}
      <div className="text-[12px] text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
        Esta predicción es una referencia de mercado basada en benchmarks 2026 (WordStream, Get-Ryze, Ubersuggest)
        y simulación Monte Carlo con {fmtN(m.iterations)} iteraciones. No constituye una garantía de resultados.
        El rendimiento real depende de la calidad de los anuncios, landing pages, velocidad de respuesta,
        estacionalidad y condiciones del mercado.
      </div>

      {/* CTA */}
      <div className="border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-[15px] font-medium text-gray-900">Predicción personalizada con data de tu negocio</p>
        <p className="text-[13px] text-gray-500 mt-1 mb-4">Te ayudamos a ejecutar la estrategia</p>
        <a href="https://wa.me/56992258137?text=Hola%2C%20us%C3%A9%20el%20Predictor%20y%20me%20gustar%C3%ADa%20una%20asesor%C3%ADa"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition">
          Contactar M&P
        </a>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white p-4">
      <p className="text-[11px] text-gray-400 font-medium">{label}</p>
      <p className={`text-[18px] font-semibold tabular-nums ${color || 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-300 mt-0.5">{sub}</p>}
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium tabular-nums ${color || 'text-gray-700'}`}>{value}</span>
    </div>
  )
}

function Funnel({ f, isEcommerce, tasaCierre }: { f: any; isEcommerce: boolean; tasaCierre: number }) {
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-gray-700">{PLAT[f.platform]}</span>
          <span className="text-[11px] text-gray-400">{f.allocation_pct}% · {fmt(f.budget_allocated)}</span>
        </div>
        <span className={`text-[13px] font-semibold tabular-nums ${f.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>
          {f.roas.p50.toFixed(1)}x ROAS
        </span>
      </div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="text-[11px] text-gray-400 border-b border-gray-50">
            <th className="text-left py-2 px-4 font-medium">Etapa</th>
            <th className="text-right py-2 px-4 font-medium">P25</th>
            <th className="text-right py-2 px-4 font-medium text-indigo-500">P50</th>
            <th className="text-right py-2 px-4 font-medium">P75</th>
            <th className="text-right py-2 px-4 font-medium">Bench.</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          <tr className="border-b border-gray-50"><td className="py-2 px-4 text-gray-500">Impresiones</td><td className="text-right px-4 text-gray-400">{fmtN(f.impressions.p25)}</td><td className="text-right px-4 font-medium text-gray-700">{fmtN(f.impressions.p50)}</td><td className="text-right px-4 text-gray-400">{fmtN(f.impressions.p75)}</td><td className="text-right px-4 text-gray-300"></td></tr>
          <tr className="border-b border-gray-50"><td className="py-2 px-4 text-gray-500">Clicks <span className="text-gray-300">CTR {f.benchmark.ctr}%</span></td><td className="text-right px-4 text-gray-400">{fmtN(f.clicks.p25)}</td><td className="text-right px-4 font-medium text-gray-700">{fmtN(f.clicks.p50)}</td><td className="text-right px-4 text-gray-400">{fmtN(f.clicks.p75)}</td><td className="text-right px-4 text-gray-300">CPC {fmt(f.benchmark.cpc)}</td></tr>
          <tr className="border-b border-gray-50"><td className="py-2 px-4 text-gray-500">{isEcommerce ? 'Compras' : 'Leads'} <span className="text-gray-300">CVR {f.benchmark.cvr}%</span></td><td className="text-right px-4 text-gray-400">{Math.round(f.leads.p25)}</td><td className="text-right px-4 font-medium text-gray-700">{Math.round(f.leads.p50)}</td><td className="text-right px-4 text-gray-400">{Math.round(f.leads.p75)}</td><td className="text-right px-4 text-gray-300"></td></tr>
          {!isEcommerce && (
            <tr className="border-b border-gray-50"><td className="py-2 px-4 text-gray-500">Ventas <span className="text-gray-300">cierre {tasaCierre}%</span></td><td className="text-right px-4 text-gray-400">{f.ventas.p25.toFixed(1)}</td><td className="text-right px-4 font-medium text-gray-700">{f.ventas.p50.toFixed(1)}</td><td className="text-right px-4 text-gray-400">{f.ventas.p75.toFixed(1)}</td><td className="text-right px-4 text-gray-300"></td></tr>
          )}
          <tr><td className="py-2 px-4 font-medium text-gray-700">Revenue</td><td className="text-right px-4 text-gray-400">{fmt(f.revenue.p25)}</td><td className="text-right px-4 font-medium text-gray-700">{fmt(f.revenue.p50)}</td><td className="text-right px-4 text-gray-400">{fmt(f.revenue.p75)}</td><td className="text-right px-4 text-gray-300"></td></tr>
        </tbody>
      </table>
    </div>
  )
}

function Histogram({ data, p25, p50, p75 }: { data: any[]; p25: number; p50: number; p75: number }) {
  if (!data?.length) return null
  const max = Math.max(...data.map((d: any) => d.count))
  const w = 720, h = 120, pad = { t: 18, b: 16, l: 0, r: 0 }
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b
  const minB = data[0].bin, maxB = data[data.length - 1].bin, range = maxB - minB || 1
  const bw = cw / data.length - 0.5
  const getX = (v: number) => pad.l + ((v - minB) / range) * cw

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }}>
      {data.map((d: any, i: number) => (
        <rect key={i} x={pad.l + (i / data.length) * cw} y={pad.t + ch - (d.count / max) * ch}
          width={bw} height={(d.count / max) * ch} fill="#e0e7ff" rx={1} />
      ))}
      {[
        { x: getX(p25), color: '#f59e0b', label: `P25: ${Math.round(p25)}` },
        { x: getX(p50), color: '#6366f1', label: `P50: ${Math.round(p50)}` },
        { x: getX(p75), color: '#10b981', label: `P75: ${Math.round(p75)}` },
      ].map(l => (
        <g key={l.label}>
          <line x1={l.x} y1={pad.t} x2={l.x} y2={pad.t + ch} stroke={l.color} strokeWidth={1} strokeDasharray={l.color === '#6366f1' ? '' : '3 2'} />
          <text x={l.x} y={pad.t - 4} textAnchor="middle" fontSize={9} fill={l.color} fontWeight={l.color === '#6366f1' ? '600' : '400'}>{l.label}</text>
        </g>
      ))}
    </svg>
  )
}
