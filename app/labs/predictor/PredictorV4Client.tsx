// @ts-nocheck
'use client'

/**
 * PREDICTOR M&P v5 — Simulador en tiempo real
 *
 * - Resultados se actualizan EN VIVO al mover sliders (sin botón "generar")
 * - Layout split: config izquierda, resultados derecha
 * - Gauge de ROAS, embudo visual, ring de confianza
 * - E-commerce = compra directa, Servicios = lead + tasa cierre
 * - Sin mencionar Monte Carlo
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Target, BarChart3, Shield,
  Activity, ChevronDown, Search, Info, RefreshCw
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const IND = [
  { v: 'ECOMMERCE', l: 'E-commerce / Retail Online', t: 'ecommerce' },
  { v: 'MODA_RETAIL', l: 'Moda / Retail', t: 'ecommerce' },
  { v: 'HOGAR_DECORACION', l: 'Hogar / Decoración', t: 'ecommerce' },
  { v: 'INMOBILIARIA', l: 'Inmobiliaria / Corredoras', t: 'servicios' },
  { v: 'SALUD_MEDICINA', l: 'Salud / Clínicas / Medicina', t: 'servicios' },
  { v: 'EDUCACION', l: 'Educación / Capacitación', t: 'servicios' },
  { v: 'TECNOLOGIA_SAAS', l: 'Tecnología / SaaS', t: 'servicios' },
  { v: 'FINTECH', l: 'Fintech / Servicios Financieros', t: 'servicios' },
  { v: 'AUTOMOTRIZ', l: 'Automotriz', t: 'servicios' },
  { v: 'TURISMO', l: 'Turismo / Hotelería', t: 'servicios' },
  { v: 'GASTRONOMIA', l: 'Gastronomía / Restaurantes', t: 'servicios' },
  { v: 'BELLEZA_PERSONAL', l: 'Belleza / Cuidado Personal', t: 'servicios' },
  { v: 'SERVICIOS_LEGALES', l: 'Servicios Legales', t: 'servicios' },
  { v: 'CONSTRUCCION_REMODELACION', l: 'Construcción / Remodelación', t: 'servicios' },
  { v: 'DEPORTES_FITNESS', l: 'Deportes / Fitness', t: 'servicios' },
  { v: 'VETERINARIA_MASCOTAS', l: 'Veterinaria / Mascotas', t: 'servicios' },
  { v: 'MANUFACTURA_INDUSTRIAL', l: 'Manufactura / Industrial', t: 'servicios' },
  { v: 'LOGISTICA_TRANSPORTE', l: 'Logística / Transporte', t: 'servicios' },
  { v: 'SEGUROS', l: 'Seguros', t: 'servicios' },
  { v: 'AGRICULTURA_AGROINDUSTRIA', l: 'Agricultura', t: 'servicios' },
  { v: 'SERVICIOS_PROFESIONALES', l: 'Servicios Profesionales B2B', t: 'servicios' },
  { v: 'ENERGIA_UTILITIES', l: 'Energía / Utilities', t: 'servicios' },
]

const PAISES = [
  { c: 'CL', n: 'Chile', f: '🇨🇱' },
  { c: 'MX', n: 'México', f: '🇲🇽' },
  { c: 'CO', n: 'Colombia', f: '🇨🇴' },
  { c: 'AR', n: 'Argentina', f: '🇦🇷' },
  { c: 'BR', n: 'Brasil', f: '🇧🇷' },
  { c: 'PE', n: 'Perú', f: '🇵🇪' },
]

const PN: Record<string, string> = { google_search: 'Google Search', google_display: 'Google Display', meta_ads: 'Meta Ads' }

const fmt = (n: number) => {
  if (Math.abs(n) >= 1e9) return `$${(n/1e9).toFixed(1)}B`
  if (Math.abs(n) >= 1e6) return `$${(n/1e6).toFixed(1)}M`
  if (Math.abs(n) >= 1e3) return `$${(n/1e3).toFixed(0)}K`
  return `$${Math.round(n)}`
}
const fmtN = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : Math.round(n).toString()

// ═══════════════════════════════════════════════════════════════════
// DROPDOWN
// ═══════════════════════════════════════════════════════════════════

function Dropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const sel = IND.find(i => i.v === value)
  const filtered = IND.filter(i => i.l.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => { setOpen(!open); setQ('') }}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-indigo-300 transition-all shadow-sm">
        <span className={sel ? 'text-gray-900 font-medium' : 'text-gray-400 text-sm'}>{sel?.l || 'Seleccionar industria...'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400" />
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filtered.map(i => (
                <button key={i.v} onClick={() => { onChange(i.v); setOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex justify-between items-center transition ${
                    i.v === value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span>{i.l}</span>
                  {i.t === 'ecommerce' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">E-com</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════

function Tip({ t }: { t: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1 align-middle">
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[9px] cursor-help hover:bg-indigo-100 hover:text-indigo-600 transition">
        <Info className="w-2.5 h-2.5" />
      </span>
      {show && (
        <span className="absolute z-50 bottom-7 left-1/2 -translate-x-1/2 w-60 px-3 py-2 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl">
          {t}<span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

export default function PredictorV4Client() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [adv, setAdv] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  const [f, setF] = useState({
    industria: '', pais: 'CL', presupuesto: 1500000,
    ticket: '', tasa: '', objetivo: 'LEADS',
    tipo: 'B2C', tamano: 'PYME',
    comp: 5, madurez: 'INTERMEDIO', margen: 40,
  })

  const ind = IND.find(i => i.v === f.industria)
  const isEC = ind?.t === 'ecommerce'

  // AUTO-RECALCULAR al cambiar cualquier input (debounce 400ms)
  useEffect(() => {
    if (!f.industria) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchPrediction()
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [f.industria, f.pais, f.presupuesto, f.ticket, f.tasa, f.objetivo, f.tipo, f.tamano, f.comp, f.madurez, f.margen])

  const fetchPrediction = async () => {
    setLoading(true)
    try {
      const body: any = {
        industria: f.industria, pais: f.pais,
        presupuesto_mensual: f.presupuesto,
        objetivo: isEC ? 'VENTAS_DIRECTAS' : f.objetivo,
        tipo_cliente: f.tipo, tamano_empresa: f.tamano,
      }
      if (f.ticket) body.ticket_promedio = parseInt(f.ticket)
      if (!isEC && f.tasa) body.tasa_cierre = parseInt(f.tasa)
      if (isEC) body.tasa_cierre = 100
      if (f.comp !== 5) body.competencia_percibida = f.comp
      if (f.madurez !== 'INTERMEDIO') body.madurez_digital = f.madurez
      if (f.margen !== 40) body.margen_bruto = f.margen

      const res = await fetch('/api/predictions/monte-carlo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) setResult(await res.json())
    } catch {}
    setLoading(false)
  }

  const mc = result?.montecarlo
  const t = mc?.total
  const m = mc?.meta
  const opt = result?.optimal
  const mainLabel = isEC ? 'compras' : 'leads'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3"><img src="/logo-color.png" alt="M&P" className="h-7" /></a>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Predictor</span>
            <a href="/labs" className="text-sm text-gray-500 hover:text-indigo-600 transition">Labs</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Predictor de Campañas Digitales</h1>
          <p className="text-gray-500 mt-1">Anticipa resultados con data real de mercado · 22 industrias · 6 países LATAM</p>
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ═══ LEFT: CONFIG ═══ */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Industria <Tip t="Los benchmarks se ajustan automáticamente." /></label>
                <Dropdown value={f.industria} onChange={v => setF({...f, industria: v})} />
                {ind && (
                  <p className={`text-[11px] mt-2 font-medium ${isEC ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {isEC ? '🛒 E-commerce: conversión = compra directa' : '📋 Servicios: conversión = lead → se aplica tasa de cierre'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">País</label>
                <div className="grid grid-cols-6 gap-1">
                  {PAISES.map(p => (
                    <button key={p.c} onClick={() => setF({...f, pais: p.c})}
                      className={`py-2 rounded-lg text-xs font-medium transition border ${
                        f.pais === p.c ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{p.f}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Presupuesto: <span className="text-indigo-600">{fmt(f.presupuesto)}</span>/mes
                  <Tip t="Inversión mensual en pauta (Google + Meta). No incluye fee de gestión." />
                </label>
                <input type="range" min={300000} max={20000000} step={100000} value={f.presupuesto}
                  onChange={e => setF({...f, presupuesto: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gradient-to-r from-gray-200 to-indigo-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                <div className="flex gap-1 mt-2">
                  {[500000, 1000000, 2000000, 5000000].map(p => (
                    <button key={p} onClick={() => setF({...f, presupuesto: p})}
                      className={`flex-1 py-1.5 text-[10px] rounded-md font-medium transition border ${
                        f.presupuesto === p ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-400'
                      }`}>{fmt(p)}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {isEC ? 'Valor promedio compra' : 'Ticket promedio'} <Tip t="Si vacío, se usa referencia de la industria." />
                </label>
                <input type="number" value={f.ticket} onChange={e => setF({...f, ticket: e.target.value})}
                  placeholder="Ref. industria"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 shadow-sm" />
              </div>

              {!isEC && f.industria && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Tasa de cierre (%) <Tip t="% de leads que se convierten en venta. Si vacío, se usa referencia según industria, tipo y tamaño." />
                  </label>
                  <input type="number" value={f.tasa} onChange={e => setF({...f, tasa: e.target.value})}
                    placeholder="Ref. mercado"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 shadow-sm" />
                  {m?.tasa_cierre_es_default && <p className="text-[10px] text-amber-600 mt-1">Usando ref: {m.tasa_cierre}% ({m.tipo_cliente} {m.tamano_empresa})</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Tipo</label>
                  <div className="flex gap-1">
                    {['B2C','B2B'].map(t => (
                      <button key={t} onClick={() => setF({...f, tipo: t})}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                          f.tipo === t ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-500'
                        }`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Tamaño</label>
                  <div className="flex gap-0.5">
                    {[{v:'MICRO',l:'<10'},{v:'PYME',l:'10-50'},{v:'MEDIANA',l:'50+'},{v:'GRANDE',l:'>200'}].map(s => (
                      <button key={s.v} onClick={() => setF({...f, tamano: s.v})}
                        className={`flex-1 py-2 rounded text-[9px] font-medium border transition ${
                          f.tamano === s.v ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-400'
                        }`}>{s.l}</button>
                    ))}
                  </div>
                </div>
              </div>

              {!isEC && f.industria && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Objetivo</label>
                  <div className="flex gap-1">
                    {[{v:'LEADS',l:'Leads'},{v:'VENTAS_DIRECTAS',l:'Ventas'},{v:'AWARENESS',l:'Awareness'}].map(o => (
                      <button key={o.v} onClick={() => setF({...f, objetivo: o.v})}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                          f.objetivo === o.v ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-500'
                        }`}>{o.l}</button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setAdv(!adv)} className="text-xs text-gray-400 hover:text-indigo-600 transition flex items-center gap-1">
                <ChevronDown className={`w-3 h-3 transition-transform ${adv ? 'rotate-180' : ''}`} /> Avanzado
              </button>
              {adv && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl text-xs">
                  <div>
                    <label className="font-semibold text-gray-500">Competencia: {f.comp}/10</label>
                    <input type="range" min={1} max={10} value={f.comp}
                      onChange={e => setF({...f, comp: parseInt(e.target.value)})}
                      className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">Madurez</label>
                    <select value={f.madurez} onChange={e => setF({...f, madurez: e.target.value})}
                      className="w-full mt-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                      <option value="PRINCIPIANTE">Principiante</option>
                      <option value="INTERMEDIO">Intermedio</option>
                      <option value="AVANZADO">Avanzado</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">Margen: {f.margen}%</label>
                    <input type="range" min={5} max={90} value={f.margen}
                      onChange={e => setF({...f, margen: parseInt(e.target.value)})}
                      className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══ RIGHT: RESULTS (en tiempo real) ═══ */}
          <div className="lg:col-span-8 space-y-5">
            {!f.industria ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Selecciona una industria para ver la predicción en tiempo real</p>
              </div>
            ) : loading && !result ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Analizando tu mercado...</p>
              </div>
            ) : t ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

                {/* HEADLINE */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <motion.p key={t.leads.p50} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                        className="text-5xl font-bold text-gray-900 tabular-nums tracking-tight">
                        {Math.round(t.leads.p50).toLocaleString()}
                      </motion.p>
                      <p className="text-gray-500 mt-1">{mainLabel} estimados por mes</p>
                      {!isEC && m && (
                        <p className="text-sm text-gray-400">→ {Math.round(t.conversiones.p50)} ventas ({m.tasa_cierre}% cierre)</p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className={`text-2xl font-bold tabular-nums ${t.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>{t.roas.p50.toFixed(1)}x</p>
                      <p className="text-xs text-gray-400">ROAS</p>
                      <p className="text-lg font-bold text-gray-900 tabular-nums">{fmt(isEC ? t.cpa.p50 : t.cpl.p50)}</p>
                      <p className="text-xs text-gray-400">{isEC ? 'CPA' : 'CPL'}</p>
                    </div>
                  </div>

                  {/* ROAS Gauge */}
                  {opt && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>ROAS rango industria</span>
                        <span>{opt.roas_tipico}x típico</span>
                      </div>
                      <div className="relative h-3 bg-gradient-to-r from-red-100 via-amber-100 via-emerald-100 to-emerald-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 h-full w-0.5 bg-gray-400"
                          style={{ left: `${Math.min(Math.max((t.roas.p50 / (opt.presupuesto_optimo ? 15 : 10)) * 100, 2), 98)}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                        <span>0x</span><span>5x</span><span>10x</span><span>15x</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* STATS */}
                <div className="grid grid-cols-4 gap-3">
                  <Stat icon={Shield} label="IC 90%" value={`${Math.round(t.leads.p5)} — ${Math.round(t.leads.p95)}`} sub={mainLabel} />
                  <Stat icon={Target} label="P(ROAS > 1)"
                    value={`${mc.confidence.prob_roas_gt_1}%`}
                    color={mc.confidence.prob_roas_gt_1 >= 70 ? 'text-emerald-600' : mc.confidence.prob_roas_gt_1 >= 40 ? 'text-amber-600' : 'text-red-500'}
                    sub={mc.confidence.prob_roas_gt_1 >= 70 ? 'Alta' : mc.confidence.prob_roas_gt_1 >= 40 ? 'Media' : 'Baja'} />
                  <Stat icon={TrendingUp} label="Revenue" value={fmt(t.revenue.p50)} sub={`IC: ${fmt(t.revenue.p5)} — ${fmt(t.revenue.p95)}`} />
                  <Stat icon={DollarSign} label={isEC ? 'CPA IC' : 'CPL IC'} value={`${fmt(isEC ? t.cpa.p25 : t.cpl.p25)} — ${fmt(isEC ? t.cpa.p75 : t.cpl.p75)}`} />
                </div>

                {/* 3 ESCENARIOS */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Escenarios</h2>
                    {loading && <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />}
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-gray-50">
                    {[
                      { l: 'Conservador', s: 'P25 · 75% prob.', leads: t.leads.p25, conv: t.conversiones.p25, rev: t.revenue.p25, roas: t.roas.p25, cost: isEC ? t.cpa.p75 : t.cpl.p75, a: 'text-amber-600' },
                      { l: 'Base', s: 'P50 · Más probable', leads: t.leads.p50, conv: t.conversiones.p50, rev: t.revenue.p50, roas: t.roas.p50, cost: isEC ? t.cpa.p50 : t.cpl.p50, a: 'text-indigo-600' },
                      { l: 'Favorable', s: 'P75 · 25% prob.', leads: t.leads.p75, conv: t.conversiones.p75, rev: t.revenue.p75, roas: t.roas.p75, cost: isEC ? t.cpa.p25 : t.cpl.p25, a: 'text-emerald-600' },
                    ].map(sc => (
                      <div key={sc.l} className="p-5">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${sc.a}`}>{sc.l}</p>
                        <p className="text-[10px] text-gray-300 mb-2">{sc.s}</p>
                        <p className="text-2xl font-bold text-gray-900 tabular-nums">{Math.round(sc.leads).toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mb-2">{mainLabel}</p>
                        <div className="space-y-1 text-[11px]">
                          {!isEC && <Row l="Ventas" v={Math.round(sc.conv).toString()} />}
                          <Row l="Revenue" v={fmt(sc.rev)} />
                          <Row l="ROAS" v={`${sc.roas.toFixed(1)}x`} c={sc.roas >= 1 ? 'text-emerald-600' : 'text-red-500'} />
                          <Row l={isEC ? 'CPA' : 'CPL'} v={fmt(sc.cost)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EMBUDOS */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50"><h2 className="font-bold text-gray-900">Embudo por plataforma</h2></div>
                  <div className="divide-y divide-gray-50">
                    {mc.funnels.map((fun: any) => (
                      <div key={fun.platform} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 text-sm">{PN[fun.platform]}</span>
                            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{fun.allocation_pct}% · {fmt(fun.budget_allocated)}</span>
                          </div>
                          <span className={`text-sm font-bold tabular-nums ${fun.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>{fun.roas.p50.toFixed(1)}x</span>
                        </div>
                        {/* Embudo visual con barras */}
                        <div className="space-y-1">
                          {[
                            { l: 'Impresiones', v: fun.impressions.p50, max: fun.impressions.p75 },
                            { l: `Clicks (CTR ${fun.benchmark.ctr}%)`, v: fun.clicks.p50, max: fun.impressions.p50 },
                            { l: `${isEC ? 'Compras' : 'Leads'} (CVR ${fun.benchmark.cvr}%)`, v: fun.leads.p50, max: fun.clicks.p50 },
                          ].map((stage, i) => (
                            <div key={stage.l} className="flex items-center gap-3">
                              <span className="text-[10px] text-gray-400 w-40 text-right">{stage.l}</span>
                              <div className="flex-1 h-5 bg-gray-50 rounded-md overflow-hidden relative">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(Math.max((stage.v / (fun.impressions.p50 || 1)) * 100, 2), 100)}%` }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-md"
                                />
                              </div>
                              <span className="text-xs text-gray-700 font-medium tabular-nums w-16 text-right">{fmtN(stage.v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HISTOGRAMA */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="font-bold text-gray-900 mb-1">Distribución de resultados</h2>
                  <p className="text-xs text-gray-400 mb-4">Rango de {mainLabel} posibles según análisis probabilístico</p>
                  <Hist data={mc.histogram.conversiones} p25={t.leads.p25} p50={t.leads.p50} p75={t.leads.p75} />
                </div>

                {/* DISCLAIMER */}
                <p className="text-[11px] text-gray-400 leading-relaxed px-2">
                  Referencia de mercado basada en benchmarks 2026 (WordStream, Get-Ryze, Ubersuggest) y análisis estadístico. No constituye garantía de resultados. Rendimiento real depende de calidad de anuncios, landing pages, velocidad de respuesta y condiciones del mercado.
                </p>

                {/* CTA */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-center text-white shadow-xl">
                  <p className="font-bold text-lg">¿Quieres ejecutar esta estrategia?</p>
                  <p className="text-indigo-200 text-sm mb-4">Predicción personalizada con data real de tu negocio</p>
                  <a href="https://wa.me/56992258137?text=Hola%2C%20us%C3%A9%20el%20Predictor%20M%26P"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition shadow-lg text-sm">
                    Contactar M&P
                  </a>
                </div>

                {/* Defaults usados */}
                {m && (m.tasa_cierre_es_default || m.ticket_es_default) && (
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {m.ticket_es_default && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full">Ticket: {fmt(m.ticket_promedio)} (ref. industria)</span>}
                    {m.tasa_cierre_es_default && !isEC && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full">Tasa cierre: {m.tasa_cierre}% (ref. mercado {m.tipo_cliente} {m.tamano_empresa})</span>}
                    <span className="bg-gray-50 text-gray-400 px-2 py-1 rounded-full">{m.industria} · {PAISES.find(p => p.c === m.pais)?.f} · {fmtN(m.iterations)} sim.</span>
                  </div>
                )}
              </motion.div>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-gray-400">
          <span>Predictor M&P · Benchmarks 2026 · M&P Labs</span>
          <a href="/labs" className="hover:text-indigo-600 transition">Labs</a>
        </div>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Stat({ icon: I, label, value, sub, color }: any) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1"><I className="w-3.5 h-3.5 text-gray-400" /><span className="text-[10px] text-gray-500 font-medium">{label}</span></div>
      <p className={`text-base font-bold tabular-nums ${color || 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-300">{sub}</p>}
    </div>
  )
}

function Row({ l, v, c }: { l: string; v: string; c?: string }) {
  return <div className="flex justify-between"><span className="text-gray-400">{l}</span><span className={`font-medium tabular-nums ${c || 'text-gray-700'}`}>{v}</span></div>
}

function Hist({ data, p25, p50, p75 }: { data: any[]; p25: number; p50: number; p75: number }) {
  if (!data?.length) return null
  const max = Math.max(...data.map((d: any) => d.count))
  const w = 800, h = 120
  const minB = data[0].bin, maxB = data[data.length-1].bin, rng = maxB - minB || 1
  const bw = w / data.length - 0.5
  const getX = (v: number) => ((v - minB) / rng) * w

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }}>
      <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#c7d2fe"/></linearGradient></defs>
      {data.map((d: any, i: number) => (
        <rect key={i} x={(i/data.length)*w} y={20 + (h-36) - (d.count/max)*(h-36)} width={bw} height={(d.count/max)*(h-36)} fill="url(#hg)" rx={2} />
      ))}
      {[{x:getX(p25),c:'#f59e0b',l:`P25: ${Math.round(p25)}`,d:'3 2'},{x:getX(p50),c:'#6366f1',l:`P50: ${Math.round(p50)}`,d:''},{x:getX(p75),c:'#10b981',l:`P75: ${Math.round(p75)}`,d:'3 2'}].map(l => (
        <g key={l.l}><line x1={l.x} y1={20} x2={l.x} y2={h-16} stroke={l.c} strokeWidth={l.d?1:2} strokeDasharray={l.d} /><text x={l.x} y={14} textAnchor="middle" fontSize={9} fill={l.c} fontWeight={l.d?'400':'700'}>{l.l}</text></g>
      ))}
    </svg>
  )
}
