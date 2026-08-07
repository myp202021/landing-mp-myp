// @ts-nocheck
'use client'

/**
 * PREDICTOR v4.3 — Diseño nivel simulador M&P
 *
 * - Hero con gradiente + badges
 * - Cards con shadow-xl, rounded-2xl
 * - Framer Motion transiciones
 * - PercentileRing animado
 * - Dropdown búsqueda para industria
 * - E-commerce = compra (sin tasa cierre), Servicios = lead + cierre
 * - Estadística visible: IC 90%, P(ROAS>1), histograma
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Target, BarChart3, Zap, Shield,
  Activity, ChevronDown, Search, Info, ArrowRight, RefreshCw,
  MessageSquare
} from 'lucide-react'
import PercentileRing from '@/components/ui/PercentileRing'

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
const PLAT_ICON: Record<string, string> = { google_search: '🔍', google_display: '📺', meta_ads: '📱' }

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
// DROPDOWN CON BÚSQUEDA
// ═══════════════════════════════════════════════════════════════════

function IndustryDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const selected = INDUSTRIAS.find(i => i.value === value)

  const filtered = INDUSTRIAS.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => { setOpen(!open); setSearch('') }}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
        <span className={selected ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selected?.label || 'Seleccionar industria...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar industria..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.map(i => (
                <button key={i.value} onClick={() => { onChange(i.value); setOpen(false) }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                    i.value === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span>{i.label}</span>
                  {i.type === 'ecommerce' && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">E-commerce</span>}
                </button>
              ))}
              {filtered.length === 0 && <p className="px-4 py-4 text-sm text-gray-400 text-center">Sin resultados</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HINT (tooltip educativo)
// ═══════════════════════════════════════════════════════════════════

function Hint({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1.5">
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold cursor-help hover:bg-blue-100 hover:text-blue-600 transition-colors">
        <Info className="w-2.5 h-2.5" />
      </span>
      <AnimatePresence>
        {show && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute z-50 bottom-7 left-1/2 -translate-x-1/2 w-64 px-3 py-2.5 bg-gray-900 text-white text-xs leading-relaxed rounded-lg shadow-xl">
            {text}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

export default function PredictorV4Client() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    industria: '', pais: 'CL', presupuesto_mensual: 1500000,
    ticket_promedio: '', tasa_cierre: '', objetivo: 'LEADS',
    tipo_cliente: 'B2C', tamano_empresa: 'PYME',
    competencia_percibida: 5, madurez_digital: 'INTERMEDIO', margen_bruto: 40,
  })

  const ind = INDUSTRIAS.find(i => i.value === form.industria)
  const isEcommerce = ind?.type === 'ecommerce'
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
      if (!isEcommerce && form.tasa_cierre) body.tasa_cierre = parseInt(form.tasa_cierre)
      if (isEcommerce) body.tasa_cierre = 100
      if (form.competencia_percibida !== 5) body.competencia_percibida = form.competencia_percibida
      if (form.madurez_digital !== 'INTERMEDIO') body.madurez_digital = form.madurez_digital
      if (form.margen_bruto !== 40) body.margen_bruto = form.margen_bruto

      const res = await fetch('/api/predictions/monte-carlo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).message || 'Error en predicción')
      setResult(await res.json())
      setStep('results')
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e: any) { setError(e.message); setStep('input') }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-color.png" alt="M&P" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            {step === 'results' && (
              <button onClick={() => { setResult(null); setStep('input'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                <RefreshCw className="w-4 h-4" /> Nuevo análisis
              </button>
            )}
            <a href="/labs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">← Labs</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* ═══ STEP: INPUT ═══ */}
        {step === 'input' && (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                <BarChart3 className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-semibold">Predictor Monte Carlo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Predice tus resultados<br />antes de invertir
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                Simulación estadística con 10,000 iteraciones.<br />
                Data verificada 2026. 22 industrias. 6 países LATAM.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-blue-500" /> Intervalos de confianza</span>
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-500" /> 3 escenarios probabilísticos</span>
                <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-purple-500" /> Embudo por plataforma</span>
              </div>
            </div>

            {/* Form Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Configura tu predicción</h3>
              <p className="text-gray-500 mb-8">Los campos opcionales usan referencias de mercado de tu industria.</p>

              <div className="space-y-6">
                {/* Industria */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Industria <Hint text="Selecciona tu industria. Los benchmarks de CPC, CTR y tasa de conversión se ajustan automáticamente. Las industrias de e-commerce miden compras directas; las de servicios miden leads." />
                  </label>
                  <IndustryDropdown value={form.industria} onChange={v => setForm({ ...form, industria: v })} />
                  {ind && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`text-xs mt-2 font-medium ${isEcommerce ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {isEcommerce ? '🛒 E-commerce: la conversión es la compra directa. No se aplica tasa de cierre.' :
                        '📋 Servicios: la conversión es un lead (formulario, llamada, WhatsApp). Se aplica tasa de cierre para estimar ventas.'}
                    </motion.p>
                  )}
                </div>

                {/* País + Presupuesto */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                    <div className="grid grid-cols-6 gap-2">
                      {PAISES.map(p => (
                        <button key={p.code} onClick={() => setForm({ ...form, pais: p.code })}
                          className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                            form.pais === p.code
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>{p.flag} {p.code}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Presupuesto mensual: <span className="text-blue-600">{fmt(form.presupuesto_mensual)}</span>
                      <Hint text="Inversión mensual en pauta publicitaria (Google + Meta). No incluye fee de gestión de agencia." />
                    </label>
                    <input type="range" min={300000} max={20000000} step={100000}
                      value={form.presupuesto_mensual}
                      onChange={e => setForm({ ...form, presupuesto_mensual: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>$300K</span><span>$20M</span>
                    </div>
                  </div>
                </div>

                {/* Ticket + Tasa de cierre */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isEcommerce ? 'Valor promedio de compra' : 'Ticket promedio'} (CLP)
                      <Hint text="Si lo dejas vacío, se usa el promedio de tu industria como referencia." />
                    </label>
                    <input type="number" value={form.ticket_promedio}
                      onChange={e => setForm({ ...form, ticket_promedio: e.target.value })}
                      placeholder="Usar referencia de la industria"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {!isEcommerce && form.industria && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tasa de cierre (%)
                        <Hint text="% de leads que se convierten en venta cerrada. Varía según industria, tipo de cliente y tamaño. Si no la conoces, usamos la referencia de mercado." />
                      </label>
                      <input type="number" value={form.tasa_cierre}
                        onChange={e => setForm({ ...form, tasa_cierre: e.target.value })}
                        placeholder="Usar referencia de mercado"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Tipo cliente + Tamaño */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de cliente</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['B2C', 'B2B'].map(t => (
                        <button key={t} onClick={() => setForm({ ...form, tipo_cliente: t })}
                          className={`py-3 rounded-lg border-2 font-medium transition-all ${
                            form.tipo_cliente === t
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>{t === 'B2C' ? 'B2C (Consumidores)' : 'B2B (Empresas)'}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tamaño empresa
                      <Hint text="Empresas más grandes suelen tener mejor tasa de cierre. Afecta la referencia de mercado." />
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { v: 'MICRO', l: '<10', d: 'personas' },
                        { v: 'PYME', l: '10-50', d: 'personas' },
                        { v: 'MEDIANA', l: '50-200', d: 'personas' },
                        { v: 'GRANDE', l: '>200', d: 'personas' },
                      ].map(t => (
                        <button key={t.v} onClick={() => setForm({ ...form, tamano_empresa: t.v })}
                          className={`py-2.5 rounded-lg border-2 text-xs font-medium transition-all ${
                            form.tamano_empresa === t.v
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>{t.l}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Objetivo — solo servicios */}
                {!isEcommerce && form.industria && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Objetivo principal</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { v: 'LEADS', l: 'Generación de leads', icon: Target },
                        { v: 'VENTAS_DIRECTAS', l: 'Ventas directas', icon: DollarSign },
                        { v: 'AWARENESS', l: 'Awareness', icon: TrendingUp },
                      ].map(o => (
                        <button key={o.v} onClick={() => setForm({ ...form, objetivo: o.v })}
                          className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                            form.objetivo === o.v
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>
                          <o.icon className="w-4 h-4" />{o.l}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Advanced */}
                <div>
                  <button onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    Ajustes avanzados
                  </button>
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 grid md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Competencia percibida: {form.competencia_percibida}/10</label>
                          <input type="range" min={1} max={10} value={form.competencia_percibida}
                            onChange={e => setForm({ ...form, competencia_percibida: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                          <p className="text-xs text-gray-400 mt-1">Mayor competencia → más dispersión en resultados</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Madurez digital</label>
                          <select value={form.madurez_digital} onChange={e => setForm({ ...form, madurez_digital: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                            <option value="PRINCIPIANTE">Principiante</option>
                            <option value="INTERMEDIO">Intermedio</option>
                            <option value="AVANZADO">Avanzado</option>
                          </select>
                          <p className="text-xs text-gray-400 mt-1">Afecta el CPC y la tasa de conversión</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Margen bruto: {form.margen_bruto}%</label>
                          <input type="range" min={5} max={90} value={form.margen_bruto}
                            onChange={e => setForm({ ...form, margen_bruto: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                          <p className="text-xs text-gray-400 mt-1">{form.margen_bruto < 25 ? '⚠️ Margen bajo — cuidado con la rentabilidad' : 'Para cálculo de ROAS breakeven'}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA */}
                <button onClick={handleSubmit} disabled={!isValid}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 disabled:shadow-none flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" /> Generar predicción
                </button>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              </div>
            </motion.div>
          </>
        )}

        {/* ═══ STEP: LOADING ═══ */}
        {step === 'loading' && (
          <div className="py-32 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-lg font-semibold text-gray-900">Ejecutando simulación...</p>
              <p className="text-sm text-gray-500">10,000 iteraciones Monte Carlo</p>
              <div className="flex justify-center gap-3 text-xs text-gray-400">
                <span>Google Search</span><span>·</span><span>Google Display</span><span>·</span><span>Meta Ads</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══ STEP: RESULTS ═══ */}
        {step === 'results' && result && (
          <div ref={resultsRef}>
            <ResultsView data={result} isEcommerce={INDUSTRIAS.find(i => i.value === result.montecarlo.meta.industria_codigo)?.type === 'ecommerce'} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-gray-400">
          <span>Motor Monte Carlo v4.3 · Benchmarks 2026 · M&P Labs</span>
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
// RESULTS VIEW
// ═══════════════════════════════════════════════════════════════════

function ResultsView({ data, isEcommerce }: { data: any; isEcommerce: boolean }) {
  const mc = data.montecarlo
  const t = mc.total
  const m = mc.meta
  const opt = data.optimal
  const mainLabel = isEcommerce ? 'compras' : 'leads'

  // Calcular percentil de confianza (0-100, donde 100 = muy confiable)
  const confScore = Math.min(Math.round(mc.confidence.prob_roas_gt_1), 100)

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="py-12 space-y-8">

      {/* Context badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">{m.industria}</span>
        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{PAISES.find(p => p.code === m.pais)?.flag} {PAISES.find(p => p.code === m.pais)?.name}</span>
        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{fmt(m.presupuesto)}/mes</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">{fmtN(m.iterations)} simulaciones</span>
        {m.tasa_cierre_es_default && !isEcommerce && (
          <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">Tasa cierre: {m.tasa_cierre}% (ref. mercado)</span>
        )}
        {m.ticket_es_default && (
          <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">Ticket: {fmt(m.ticket_promedio)} (ref. industria)</span>
        )}
      </div>

      {/* ═══ HEADLINE + CONFIDENCE RING ═══ */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <p className="text-5xl font-bold text-gray-900 tracking-tight tabular-nums">
              {Math.round(t.leads.p50).toLocaleString()}
            </p>
            <p className="text-lg text-gray-600 mt-1">{mainLabel} estimados por mes</p>
            {!isEcommerce && (
              <p className="text-sm text-gray-400 mt-1">
                → {Math.round(t.conversiones.p50)} ventas estimadas ({m.tasa_cierre}% tasa de cierre)
              </p>
            )}
            <div className="flex items-center gap-6 mt-4">
              <div>
                <p className={`text-2xl font-bold tabular-nums ${t.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {t.roas.p50.toFixed(1)}x
                </p>
                <p className="text-xs text-gray-400">ROAS mediana</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(t.revenue.p50)}</p>
                <p className="text-xs text-gray-400">Revenue mensual</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(isEcommerce ? t.cpa.p50 : t.cpl.p50)}</p>
                <p className="text-xs text-gray-400">{isEcommerce ? 'CPA' : 'CPL'} mediana</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <PercentileRing
              percentile={100 - confScore}
              label={`P(ROAS > 1) = ${mc.confidence.prob_roas_gt_1}%`}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* ═══ ESTADÍSTICA ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Intervalo de confianza 90%" value={`${Math.round(t.leads.p5)} — ${Math.round(t.leads.p95)}`} sub={mainLabel} icon={Shield} />
        <StatCard label="P(ROAS > 1)" value={`${mc.confidence.prob_roas_gt_1}%`}
          sub={mc.confidence.prob_roas_gt_1 >= 70 ? 'Alta probabilidad' : mc.confidence.prob_roas_gt_1 >= 40 ? 'Probabilidad media' : 'Baja probabilidad'}
          color={mc.confidence.prob_roas_gt_1 >= 70 ? 'text-emerald-600' : mc.confidence.prob_roas_gt_1 >= 40 ? 'text-amber-600' : 'text-red-500'}
          icon={Target} />
        <StatCard label="ROAS IC 90%" value={`${t.roas.p5.toFixed(1)}x — ${t.roas.p95.toFixed(1)}x`} sub="Rango de retorno" icon={TrendingUp} />
        <StatCard label={`${isEcommerce ? 'CPA' : 'CPL'} IC 90%`}
          value={`${fmt(isEcommerce ? t.cpa.p5 : t.cpl.p5)} — ${fmt(isEcommerce ? t.cpa.p95 : t.cpl.p95)}`}
          sub="Rango de costo" icon={DollarSign} />
      </div>

      {/* ═══ 3 ESCENARIOS ═══ */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Escenarios probabilísticos</h2>
          <p className="text-sm text-gray-500">Basados en percentiles de la distribución Monte Carlo</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: 'Conservador', sub: 'P25 — 75% de alcanzar', leads: t.leads.p25, conv: t.conversiones.p25, rev: t.revenue.p25, roas: t.roas.p25, cost: isEcommerce ? t.cpa.p75 : t.cpl.p75, bg: 'bg-amber-50', accent: 'text-amber-600', border: 'border-amber-200' },
            { label: 'Base', sub: 'P50 — más probable', leads: t.leads.p50, conv: t.conversiones.p50, rev: t.revenue.p50, roas: t.roas.p50, cost: isEcommerce ? t.cpa.p50 : t.cpl.p50, bg: 'bg-blue-50', accent: 'text-blue-600', border: 'border-blue-200' },
            { label: 'Favorable', sub: 'P75 — 25% prob.', leads: t.leads.p75, conv: t.conversiones.p75, rev: t.revenue.p75, roas: t.roas.p75, cost: isEcommerce ? t.cpa.p25 : t.cpl.p25, bg: 'bg-emerald-50', accent: 'text-emerald-600', border: 'border-emerald-200' },
          ].map(s => (
            <div key={s.label} className="p-6">
              <p className={`text-xs font-bold uppercase tracking-wider ${s.accent}`}>{s.label}</p>
              <p className="text-xs text-gray-400 mb-4">{s.sub}</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{Math.round(s.leads).toLocaleString()}</p>
              <p className="text-sm text-gray-400 mb-4">{mainLabel}</p>
              <div className="space-y-2 text-sm">
                {!isEcommerce && <div className="flex justify-between"><span className="text-gray-400">Ventas</span><span className="text-gray-700 font-medium tabular-nums">{Math.round(s.conv)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-400">Revenue</span><span className="text-gray-700 font-medium">{fmt(s.rev)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ROAS</span><span className={`font-semibold ${s.roas >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>{s.roas.toFixed(1)}x</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{isEcommerce ? 'CPA' : 'CPL'}</span><span className="text-gray-700 font-medium">{fmt(s.cost)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HISTOGRAMA ═══ */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Distribución Monte Carlo</h2>
        <p className="text-sm text-gray-500 mb-6">10,000 simulaciones — cada barra es un rango de {mainLabel} posibles</p>
        <MCHistogram data={mc.histogram.conversiones} p25={t.leads.p25} p50={t.leads.p50} p75={t.leads.p75} />
      </div>

      {/* ═══ EMBUDOS ═══ */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Embudo por plataforma</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {mc.funnels.map((f: any) => (
            <FunnelRow key={f.platform} f={f} isEcommerce={isEcommerce} tasaCierre={m.tasa_cierre} />
          ))}
        </div>
      </div>

      {/* ═══ ÓPTIMOS ═══ */}
      {opt && (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Referencia de mercado para tu industria</h2>
          <p className="text-sm text-gray-500 mb-6">{opt.industria} · {opt.tipo_cliente} · {opt.tamano} · Fuentes: WordStream, Get-Ryze, Ubersuggest {opt.benchmark_year}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MiniStat label="CPC Search" value={fmt(opt.google_search.cpc)} />
            <MiniStat label="CTR Search" value={`${opt.google_search.ctr}%`} />
            <MiniStat label="CVR Search" value={`${opt.google_search.cvr}%`} />
            <MiniStat label="CPA estimado" value={fmt(opt.cpa_estimado)} />
            <MiniStat label="Presup. óptimo" value={fmt(opt.presupuesto_optimo.recomendado)} />
          </div>
        </div>
      )}

      {/* ═══ DISCLAIMER + CTA ═══ */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-sm text-gray-500 leading-relaxed">
        Esta predicción es una referencia de mercado basada en benchmarks 2026 (WordStream, Get-Ryze, Ubersuggest)
        y simulación Monte Carlo con {fmtN(m.iterations)} iteraciones. No constituye una garantía de resultados.
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">¿Quieres una predicción personalizada?</h3>
        <p className="text-blue-100 mb-6">Con data real de tu negocio y optimización profesional</p>
        <a href="https://wa.me/56992258137?text=Hola%2C%20us%C3%A9%20el%20Predictor%20y%20me%20gustar%C3%ADa%20una%20asesor%C3%ADa"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
          <MessageSquare className="w-5 h-5" /> Contactar M&P
        </a>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function StatCard({ label, value, sub, color, icon: Icon }: { label: string; value: string; sub?: string; color?: string; icon: any }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
      <p className={`text-lg font-bold tabular-nums ${color || 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-700 tabular-nums">{value}</p>
    </div>
  )
}

function FunnelRow({ f, isEcommerce, tasaCierre }: { f: any; isEcommerce: boolean; tasaCierre: number }) {
  const rows = [
    { label: 'Impresiones', p25: fmtN(f.impressions.p25), p50: fmtN(f.impressions.p50), p75: fmtN(f.impressions.p75), bench: '' },
    { label: `Clicks`, p25: fmtN(f.clicks.p25), p50: fmtN(f.clicks.p50), p75: fmtN(f.clicks.p75), bench: `CPC ${fmt(f.benchmark.cpc)}`, rate: `CTR ${f.benchmark.ctr}%` },
    { label: isEcommerce ? 'Compras' : 'Leads', p25: Math.round(f.leads.p25).toString(), p50: Math.round(f.leads.p50).toString(), p75: Math.round(f.leads.p75).toString(), bench: '', rate: `CVR ${f.benchmark.cvr}%` },
  ]
  if (!isEcommerce) {
    rows.push({ label: 'Ventas', p25: f.ventas.p25.toFixed(1), p50: f.ventas.p50.toFixed(1), p75: f.ventas.p75.toFixed(1), bench: '', rate: `Cierre ${tasaCierre}%` })
  }
  rows.push({ label: 'Revenue', p25: fmt(f.revenue.p25), p50: fmt(f.revenue.p50), p75: fmt(f.revenue.p75), bench: '' })

  return (
    <div className="px-8 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{PLAT_ICON[f.platform]}</span>
          <span className="font-semibold text-gray-800">{PLAT[f.platform]}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{f.allocation_pct}% · {fmt(f.budget_allocated)}</span>
        </div>
        <span className={`text-sm font-bold tabular-nums ${f.roas.p50 >= 1 ? 'text-emerald-600' : 'text-red-500'}`}>
          {f.roas.p50.toFixed(1)}x ROAS
        </span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400">
            <th className="text-left py-1 font-medium w-[30%]">Etapa</th>
            <th className="text-right py-1 font-medium w-[14%] text-amber-500">P25</th>
            <th className="text-right py-1 font-medium w-[14%] text-blue-600">P50</th>
            <th className="text-right py-1 font-medium w-[14%] text-emerald-500">P75</th>
            <th className="text-right py-1 font-medium w-[28%]">Benchmark</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} className="border-t border-gray-50">
              <td className="py-2 text-gray-600">
                {r.label} {r.rate && <span className="text-gray-300 text-xs">({r.rate})</span>}
              </td>
              <td className="py-2 text-right text-gray-400 tabular-nums">{r.p25}</td>
              <td className="py-2 text-right text-gray-800 font-semibold tabular-nums">{r.p50}</td>
              <td className="py-2 text-right text-gray-400 tabular-nums">{r.p75}</td>
              <td className="py-2 text-right text-gray-300 text-xs">{r.bench}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MCHistogram({ data, p25, p50, p75 }: { data: any[]; p25: number; p50: number; p75: number }) {
  if (!data?.length) return null
  const max = Math.max(...data.map((d: any) => d.count))
  const w = 900, h = 160, pad = { t: 24, b: 20, l: 0, r: 0 }
  const cw = w, ch = h - pad.t - pad.b
  const minB = data[0].bin, maxB = data[data.length - 1].bin, range = maxB - minB || 1
  const bw = cw / data.length - 1
  const getX = (v: number) => ((v - minB) / range) * cw

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 160 }}>
      {data.map((d: any, i: number) => {
        const barH = (d.count / max) * ch
        return (
          <rect key={i} x={(i / data.length) * cw} y={pad.t + ch - barH}
            width={bw} height={barH}
            fill="url(#barGrad)" rx={2} />
        )
      })}
      {/* Gradient definition */}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
      </defs>
      {/* Percentile lines */}
      {[
        { x: getX(p25), color: '#f59e0b', label: `P25: ${Math.round(p25)}`, dash: '4 2' },
        { x: getX(p50), color: '#3b82f6', label: `P50: ${Math.round(p50)}`, dash: '' },
        { x: getX(p75), color: '#10b981', label: `P75: ${Math.round(p75)}`, dash: '4 2' },
      ].map(l => (
        <g key={l.label}>
          <line x1={l.x} y1={pad.t} x2={l.x} y2={pad.t + ch} stroke={l.color} strokeWidth={l.dash ? 1 : 2} strokeDasharray={l.dash} />
          <text x={l.x} y={pad.t - 6} textAnchor="middle" fontSize={10} fill={l.color} fontWeight={l.dash ? '400' : '700'}>{l.label}</text>
        </g>
      ))}
      {/* X axis */}
      {data.filter((_, i) => i % 4 === 0).map((d: any) => (
        <text key={d.bin} x={getX(d.bin)} y={h - 4} textAnchor="middle" fontSize={9} fill="#94a3b8">{Math.round(d.bin)}</text>
      ))}
    </svg>
  )
}
