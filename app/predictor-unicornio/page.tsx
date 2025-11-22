// @ts-nocheck
'use client'

/**
 * PREDICTOR PROFESIONAL - DISEÑO UNICORNIO V3
 *
 * Standards: Figma, Linear, Stripe
 * Design Director: World-class data visualization + business intelligence
 *
 * Nuevas características v3:
 * - Ciclo de venta con chips interactivos
 * - Margen bruto con slider visual premium
 * - Gráfico de proyección con bandas de confianza
 * - Insights cards estilo Linear
 * - Data density óptima estilo Stripe
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { generarPDF } from '@/lib/utils/pdf-export'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  Download,
  ChevronRight,
  RotateCcw,
  Zap,
  Calendar,
  BarChart3,
  Percent,
  Clock,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Lightbulb,
  Star,
  MessageSquare,
  Send,
  Share2,
  Mail
} from 'lucide-react'

// ============================================================================
// CONSTANTES Y RANGOS
// ============================================================================

const RANGOS_TASA_CIERRE = {
  ECOMMERCE: { min: 1, max: 15, default: 5 },
  TECNOLOGIA_SAAS: { min: 3, max: 15, default: 10 },
  FINTECH: { min: 1, max: 8, default: 3 },
  INMOBILIARIA: { min: 1, max: 10, default: 3 },
  SALUD_MEDICINA: { min: 10, max: 40, default: 20 },
  EDUCACION: { min: 5, max: 25, default: 12 },
  TURISMO: { min: 3, max: 20, default: 10 },
  GASTRONOMIA: { min: 5, max: 30, default: 15 },
  AUTOMOTRIZ: { min: 1, max: 8, default: 3 },
  MODA_RETAIL: { min: 2, max: 12, default: 6 },
  SERVICIOS_LEGALES: { min: 3, max: 15, default: 8 },
  BELLEZA_PERSONAL: { min: 15, max: 50, default: 25 },
}

const CICLOS_VENTA = [
  { value: 'INSTANTANEO', label: 'Instantáneo', desc: '<24hrs', icon: '⚡' },
  { value: 'MENOS_1_MES', label: '<1 mes', desc: '1-30 días', icon: '📅' },
  { value: 'UNO_A_TRES_MESES', label: '1-3 meses', desc: 'B2B típico', icon: '📊' },
  { value: 'MAS_3_MESES', label: '>3 meses', desc: 'Enterprise', icon: '🏢' }
]

// ============================================================================
// COMPONENTES PREMIUM
// ============================================================================

const InfoTooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block">
      <Info
        className="w-4 h-4 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute z-50 w-80 p-4 bg-gray-900 text-white text-sm rounded-2xl shadow-2xl -top-2 left-6 animate-in fade-in slide-in-from-left-2 duration-200">
          {text}
          <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 -left-1.5 top-5"></div>
        </div>
      )}
    </div>
  )
}

// Insight Card estilo Linear
const InsightCard = ({ icon: Icon, title, description, trend, color = 'indigo' }: any) => {
  const colors = {
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' }
  }

  const c = colors[color]

  return (
    <div className={`group relative ${c.bg} p-5 rounded-2xl border-2 ${c.border} hover:shadow-lg transition-all duration-300 cursor-pointer`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 bg-white rounded-xl ${c.icon} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-bold ${c.text}`}>{title}</h4>
            {trend && (
              <Badge className={`${color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'} font-semibold`}>
                {trend}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

const KPICard = ({ title, value, change, icon: Icon, tooltip, color = 'indigo' }: any) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20'
  }

  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${colorClasses[color]}`}></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="text-4xl font-bold text-gray-900 mb-2">
        {value}
      </div>

      {change && (
        <div className={`flex items-center gap-1.5 text-sm font-semibold ${
          change.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {change.direction === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>{change.value}</span>
        </div>
      )}
    </div>
  )
}

const TrafficLight = ({ status }: { status: 'green' | 'amber' | 'red' }) => {
  const config = {
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-500/20', label: 'Excelente', icon: CheckCircle2 },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', ring: 'ring-amber-500/20', label: 'Revisar', icon: AlertCircle },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', ring: 'ring-red-500/20', label: 'Crítico', icon: AlertCircle }
  }

  const { bg, border, text, dot, ring, label, icon: Icon } = config[status]

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-2xl border-2 ${bg} ${border} ring-4 ${ring}`}>
      <div className={`w-3 h-3 rounded-full ${dot} ${status === 'green' ? 'animate-pulse' : ''}`}></div>
      <Icon className={`w-5 h-5 ${text}`} />
      <span className={`text-base font-bold ${text}`}>{label}</span>
    </div>
  )
}

const FormInput = ({ label, value, onChange, type = 'text', placeholder, tooltip, error }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-12 px-4 rounded-xl border-2 transition-all duration-200 text-base ${
        error ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
      }`}
    />
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1.5 font-medium">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
)

const FormSelect = ({ label, value, onChange, options, tooltip }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 text-base font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

// Ciclo de venta con chips interactivos
const CicloVentaChips = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-semibold text-gray-700">Ciclo de Venta</Label>
      <InfoTooltip text="Tiempo promedio desde que un lead ingresa hasta que cierra como cliente pagado" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {CICLOS_VENTA.map((ciclo) => (
        <button
          key={ciclo.value}
          onClick={() => onChange(ciclo.value)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            value === ciclo.value
              ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/20 shadow-lg'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="text-3xl mb-2">{ciclo.icon}</div>
          <div className={`text-sm font-bold mb-1 ${value === ciclo.value ? 'text-indigo-900' : 'text-gray-900'}`}>
            {ciclo.label}
          </div>
          <div className="text-xs text-gray-600">{ciclo.desc}</div>
        </button>
      ))}
    </div>
  </div>
)

// Slider de margen bruto premium
const MargenBrutoSlider = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
  const getColor = (val: number) => {
    if (val >= 60) return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Excelente' }
    if (val >= 40) return { bg: 'bg-indigo-500', text: 'text-indigo-600', label: 'Bueno' }
    if (val >= 20) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Regular' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Bajo' }
  }

  const color = getColor(value)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-gray-700">Margen Bruto</Label>
          <InfoTooltip text="Porcentaje de ganancia bruta sobre la venta. Margen = (Precio - Costo) / Precio × 100" />
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${color.bg} text-white font-bold px-3 py-1`}>
            {color.label}
          </Badge>
          <div className={`flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border-2 border-gray-200`}>
            <Percent className={`w-4 h-4 ${color.text}`} />
            <span className={`text-2xl font-bold ${color.text}`}>{value}%</span>
          </div>
        </div>
      </div>

      <div className="relative pt-2 pb-6">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-premium"
          style={{
            background: `linear-gradient(to right, ${color.bg.replace('bg-', '#')} 0%, ${color.bg.replace('bg-', '#')} ${value}%, #E5E7EB ${value}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
          <span className="text-red-600">0% (Crítico)</span>
          <span>20%</span>
          <span>40%</span>
          <span>60%</span>
          <span className="text-emerald-600">100% (Ideal)</span>
        </div>
      </div>

      <style jsx>{`
        .slider-premium::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 4px solid ${color.bg.replace('bg-', '#')};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s;
        }
        .slider-premium::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

const TasaCierreSlider = ({ value, onChange, industria }: any) => {
  const rango = RANGOS_TASA_CIERRE[industria] || { min: 1, max: 50, default: 5 }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-gray-700">Tasa de Cierre</Label>
          <InfoTooltip text={`Rango típico para ${industria}: ${rango.min}% - ${rango.max}%. Porcentaje de leads que se convierten en ventas cerradas.`} />
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border-2 border-indigo-200">
          <Percent className="w-4 h-4 text-indigo-600" />
          <span className="text-2xl font-bold text-indigo-600">{value}%</span>
        </div>
      </div>

      <div className="relative pt-2 pb-6">
        <input
          type="range"
          min={rango.min}
          max={rango.max}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-custom"
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${((value - rango.min) / (rango.max - rango.min)) * 100}%, #E5E7EB ${((value - rango.min) / (rango.max - rango.min)) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 font-medium mt-2">
          <span>{rango.min}% (Mín)</span>
          <span className="text-indigo-600 font-bold">{rango.default}% (Típico)</span>
          <span>{rango.max}% (Máx)</span>
        </div>
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #6366F1;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
          transition: all 0.2s;
        }
        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.6);
        }
      `}</style>
    </div>
  )
}

const PrimaryButton = ({ children, onClick, disabled = false, loading = false, icon: Icon }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 px-8 h-14 rounded-xl font-bold text-base transition-all duration-200 shadow-lg ${
      disabled || loading
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 active:scale-95 shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40'
    }`}
  >
    {loading ? (
      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
    ) : Icon ? (
      <Icon className="w-5 h-5" />
    ) : null}
    <span>{children}</span>
  </button>
)

const SecondaryButton = ({ children, onClick, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl font-semibold text-base border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all duration-200"
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span>{children}</span>
  </button>
)

// Gráfico premium con bandas de confianza (estilo Stripe)
const ProyeccionPremium = ({ data, industria }: { data: any[], industria: string }) => {
  // Generar bandas de confianza (conservador y agresivo)
  const dataConBandas = data.map((item: any, idx: number) => ({
    ...item,
    conservador: item.revenue_esperado * 0.7,  // 30% menos
    agresivo: item.revenue_esperado * 1.4,     // 40% más
    mes_num: idx + 1
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 shadow-2xl min-w-[280px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-100">
            <p className="font-bold text-gray-900 text-lg">{data.nombre}</p>
            <Badge className="bg-indigo-100 text-indigo-700 font-bold">Mes {data.mes_num}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                Optimista
              </span>
              <span className="font-bold text-emerald-600">${(data.agresivo / 1000000).toFixed(1)}M</span>
            </div>

            <div className="flex items-center justify-between py-2 bg-indigo-50 rounded-lg px-3">
              <span className="text-sm text-gray-900 font-semibold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                Base (esperado)
              </span>
              <span className="font-bold text-indigo-600 text-lg">${(data.revenue_esperado / 1000000).toFixed(1)}M</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                Conservador
              </span>
              <span className="font-bold text-amber-600">${(data.conservador / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-gray-100 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-600 mb-1">ROAS</div>
              <div className="font-bold text-gray-900">{data.roas_esperado?.toFixed(1)}x</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Ventas</div>
              <div className="font-bold text-gray-900">{data.ventas_esperadas}</div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dataConBandas} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <defs>
            {/* Gradiente para banda de confianza */}
            <linearGradient id="bandaConfianza" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.15}/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05}/>
            </linearGradient>

            {/* Gradiente para línea base */}
            <linearGradient id="revenueBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0.1}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.5} />

          <XAxis
            dataKey="nombre"
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 2, strokeDasharray: '5 5' }} />

          {/* Banda de confianza (área entre conservador y agresivo) */}
          <Area
            type="monotone"
            dataKey="agresivo"
            stroke="none"
            fill="url(#bandaConfianza)"
            fillOpacity={1}
          />

          <Area
            type="monotone"
            dataKey="conservador"
            stroke="none"
            fill="white"
            fillOpacity={1}
          />

          {/* Línea base (predicción realista) */}
          <Area
            type="monotone"
            dataKey="revenue_esperado"
            stroke="#6366F1"
            strokeWidth={3}
            fill="url(#revenueBase)"
            dot={{ fill: '#6366F1', r: 5, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 7, strokeWidth: 3, stroke: 'white' }}
          />

          {/* Líneas de referencia para fases */}
          <ReferenceLine x="Mar" stroke="#F59E0B" strokeDasharray="3 3" strokeWidth={2} />
          <ReferenceLine x="Ago" stroke="#10B981" strokeDasharray="3 3" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const MixCampanasVisual = ({ mix }: { mix: any }) => (
  <div className="space-y-4">
    {Object.entries(mix).map(([plataforma, data]: [string, any]) => {
      const colors = {
        'GOOGLE_SEARCH': { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-500/20' },
        'LINKEDIN': { bg: 'bg-sky-600', light: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-600/20' },
        'META_ADS': { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-600/20' },
        'GOOGLE_DISPLAY': { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-500/20' },
        'GOOGLE_SHOPPING': { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-500/20' },
        'TIKTOK': { bg: 'bg-pink-600', light: 'bg-pink-50', text: 'text-pink-700', ring: 'ring-pink-600/20' },
        'YOUTUBE': { bg: 'bg-red-600', light: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20' },
      }

      const color = colors[plataforma] || colors['GOOGLE_SEARCH']

      return (
        <div key={plataforma} className={`p-5 ${color.light} rounded-2xl border-2 border-transparent hover:border-gray-200 ring-4 ${color.ring} transition-all duration-200`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-bold text-gray-900 text-lg">{plataforma.replace('_', ' ')}</h4>
                <Badge className={`${color.bg} text-white font-bold px-3 py-1`}>
                  {data.porcentaje_presupuesto}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{data.plataforma_justificacion}</p>
            </div>
          </div>

          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className={`absolute top-0 left-0 h-full ${color.bg} transition-all duration-500`}
              style={{ width: `${data.porcentaje_presupuesto}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-gray-200">
            <div>
              <div className="text-xs text-gray-600 font-medium mb-1">Presupuesto Asignado</div>
              <div className="text-xl font-bold text-gray-900">
                ${(data.presupuesto_asignado / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 font-medium mb-1">Conversiones Esperadas</div>
              <div className="text-xl font-bold text-gray-900">
                {data.conversiones_esperadas} <span className="text-sm font-normal text-gray-600">/ mes</span>
              </div>
            </div>
          </div>
        </div>
      )
    })}
  </div>
)

const ScenarioCard = ({ title, subtitle, metrics, highlighted = false, probability }: any) => (
  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
    highlighted
      ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-500/20'
      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
  }`}>
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {probability && (
          <Badge className={highlighted ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}>
            {probability}% prob.
          </Badge>
        )}
      </div>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>

    <div className="space-y-3">
      {metrics.map((metric: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
          <span className="text-sm font-medium text-gray-600">{metric.label}</span>
          <span className="text-base font-bold text-gray-900">{metric.value}</span>
        </div>
      ))}
    </div>

    {highlighted && (
      <div className="mt-4 pt-4 border-t-2 border-indigo-200">
        <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold">
          ⭐ Escenario Recomendado
        </Badge>
      </div>
    )}
  </div>
)

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PredictorUnicornio() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [logId, setLogId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ rating: number | null, comentario: string, submitted: boolean }>({
    rating: null,
    comentario: '',
    submitted: false
  })

  const [formData, setFormData] = useState({
    presupuesto: '',
    ticket: '',
    industria: 'ECOMMERCE',
    tipoCliente: 'B2C',
    tasaCierre: 5,
    madurez: 'INTERMEDIO',
    cicloVenta: 'MENOS_1_MES',
    margenBruto: 50
  })

  const [contactForm, setContactForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    solicitud: '',
    enviando: false,
    enviado: false
  })

  useEffect(() => {
    const rango = RANGOS_TASA_CIERRE[formData.industria]
    if (rango) {
      setFormData(prev => ({ ...prev, tasaCierre: rango.default }))
    }
  }, [formData.industria])

  const isFormValid = formData.presupuesto && formData.ticket && formData.tasaCierre

  const handlePredict = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/predictions/motor-2025', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          X_presupuesto_mensual: parseInt(formData.presupuesto),
          Y_tasa_cierre: formData.tasaCierre,
          Z_ticket_promedio: parseInt(formData.ticket),
          industria: formData.industria,
          tipo_cliente: formData.tipoCliente,
          madurez_digital: formData.madurez,
          ciclo_venta: formData.cicloVenta,
          margen_bruto: formData.margenBruto,
          decision_maker: 'PROPIETARIO',
          geo_objetivo: 'NACIONAL'
        })
      })

      const data = await response.json()
      setResult(data)

      // Guardar log de la predicción
      try {
        const logResponse = await fetch('/api/predictions/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: {
              X_presupuesto_mensual: parseInt(formData.presupuesto),
              Y_tasa_cierre: formData.tasaCierre,
              Z_ticket_promedio: parseInt(formData.ticket),
              industria: formData.industria,
              tipo_cliente: formData.tipoCliente,
              ciclo_venta: formData.cicloVenta,
              margen_bruto: formData.margenBruto
            },
            output: data
          })
        })
        const logData = await logResponse.json()
        if (logData.success) {
          setLogId(logData.log_id)
          setFeedback({ rating: null, comentario: '', submitted: false })
        }
      } catch (logError) {
        console.error('Error guardando log:', logError)
      }

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNuevaPredicion = () => {
    setResult(null)
    setLogId(null)
    setFeedback({ rating: null, comentario: '', submitted: false })
    setFormData({
      presupuesto: '',
      ticket: '',
      industria: 'ECOMMERCE',
      tipoCliente: 'B2C',
      tasaCierre: 5,
      madurez: 'INTERMEDIO',
      cicloVenta: 'MENOS_1_MES',
      margenBruto: 50
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitFeedback = async () => {
    if (!logId || !feedback.rating) return

    try {
      const response = await fetch('/api/predictions/log', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          log_id: logId,
          rating: feedback.rating,
          comentario: feedback.comentario
        })
      })

      const data = await response.json()
      if (data.success) {
        setFeedback(prev => ({ ...prev, submitted: true }))
      }
    } catch (error) {
      console.error('Error enviando feedback:', error)
    }
  }

  const handleCompartirWhatsApp = () => {
    if (!result) return

    const conversiones = result.predictor?.metricas?.conversiones_mensuales || 0
    const revenue = result.predictor?.metricas?.revenue_mensual || 0
    const roas = result.predictor?.metricas?.roas || 0
    const presupuesto = parseInt(formData.presupuesto)

    const texto = `🎯 *Predicción Google Ads - Muller y Pérez*

📊 *Industria:* ${formData.industria}
💰 *Presupuesto:* $${presupuesto.toLocaleString('es-CL')} CLP/mes
🎯 *Conversiones esperadas:* ${conversiones}/mes
📈 *ROAS proyectado:* ${roas.toFixed(1)}x
💵 *Revenue esperado:* $${(revenue / 1000000).toFixed(1)}M CLP/mes

✨ Predicción generada con Motor 2025 v2025.1.0

🔗 Ver predicción completa: ${window.location.href}`

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank')
  }

  const handleCompartirEmail = () => {
    if (!result) return

    const conversiones = result.predictor?.metricas?.conversiones_mensuales || 0
    const revenue = result.predictor?.metricas?.revenue_mensual || 0
    const roas = result.predictor?.metricas?.roas || 0
    const presupuesto = parseInt(formData.presupuesto)

    const subject = `Predicción Google Ads - ${formData.industria} | Muller y Pérez`

    const body = `Hola,

Te comparto mi predicción de Google Ads generada con el Motor 2025 de Muller y Pérez:

DATOS DE ENTRADA:
- Industria: ${formData.industria}
- Tipo de cliente: ${formData.tipoCliente}
- Presupuesto mensual: $${presupuesto.toLocaleString('es-CL')} CLP
- Ticket promedio: $${parseInt(formData.ticket).toLocaleString('es-CL')} CLP
- Tasa de cierre: ${formData.tasaCierre}%

RESULTADOS PROYECTADOS:
- Conversiones esperadas: ${conversiones} por mes
- ROAS proyectado: ${roas.toFixed(1)}x
- Revenue mensual: $${(revenue / 1000000).toFixed(1)}M CLP
- CPA estimado: $${((presupuesto / conversiones) / 1000).toFixed(0)}k CLP

La predicción incluye proyecciones a 12 meses considerando curva de aprendizaje, estacionalidad y factores de performance específicos de la industria.

---
Generado con Motor 2025 v2025.1.0
Muller y Pérez - Marketing & Performance
${window.location.href}`

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  const handleExportarPDF = async () => {
    if (!result) return

    const conversiones = result.predictor?.metricas?.conversiones_mensuales || 0
    const revenue = result.predictor?.metricas?.revenue_mensual || 0
    const roas = result.predictor?.metricas?.roas_esperado || 0
    const cpa = result.predictor?.metricas?.cpa_promedio || 0
    const presupuesto = parseInt(formData.presupuesto)

    await generarPDF({
      presupuesto,
      ticket: parseInt(formData.ticket),
      industria: formData.industria,
      tipoCliente: formData.tipoCliente,
      tasaCierre: formData.tasaCierre,
      cicloVenta: formData.cicloVenta,
      margenBruto: formData.margenBruto,
      conversiones,
      revenue,
      roas,
      cpa,
      escenarios: {
        conservador: {
          ventas: result.recomendador?.escenarios?.conservador?.ventas_esperadas || 0,
          revenue: result.recomendador?.escenarios?.conservador?.revenue_esperado || 0,
          roas: result.recomendador?.escenarios?.conservador?.roas_esperado || 0
        },
        base: {
          ventas: result.recomendador?.escenarios?.base?.ventas_esperadas || 0,
          revenue: result.recomendador?.escenarios?.base?.revenue_esperado || 0,
          roas: result.recomendador?.escenarios?.base?.roas_esperado || 0
        },
        agresivo: {
          ventas: result.recomendador?.escenarios?.agresivo?.ventas_esperadas || 0,
          revenue: result.recomendador?.escenarios?.agresivo?.revenue_esperado || 0,
          roas: result.recomendador?.escenarios?.agresivo?.roas_esperado || 0
        }
      },
      fecha: new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo M&P */}
            <a href="/" className="flex items-center gap-3 group">
              <img src="/logo-mp.png" alt="Muller y Pérez - Marketing & Performance" className="h-12 transition-transform group-hover:scale-105" />
            </a>

            <div className="h-8 w-px bg-gray-200"></div>

            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Predictor 2025
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <a href="#input" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Input</a>
              <a href="#results" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Resultados</a>
              <a href="#projections" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Proyecciones</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {result && (
              <>
                <SecondaryButton onClick={handleNuevaPredicion} icon={RotateCcw}>
                  Nueva Predicción
                </SecondaryButton>

                {/* Compartir */}
                <button
                  onClick={handleCompartirWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 font-semibold transition-all"
                  title="Compartir por WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">WhatsApp</span>
                </button>

                <button
                  onClick={handleCompartirEmail}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-semibold transition-all"
                  title="Compartir por Email"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden md:inline">Email</span>
                </button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportarPDF}
              disabled={!result}
              className="text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Exportar PDF</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-8 py-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-3 py-1 text-xs">
              Motor 2025 v2025.1.0
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Predicción de Performance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            Sistema de predicción calibrado con benchmarks 2025 de <span className="font-semibold text-gray-900">WordStream</span>, <span className="font-semibold text-gray-900">Triple Whale</span> y <span className="font-semibold text-gray-900">Databox</span> para el mercado chileno.
          </p>
        </div>

        {/* Form section */}
        <div id="input" className="mb-8">
          <Card className="border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Datos de entrada</h3>
            </div>

            <div className="p-6">
              {/* Primera fila: Presupuesto, Ticket, Industria, Tipo Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput
                  label="Presupuesto Mensual (CLP)"
                  value={formData.presupuesto}
                  onChange={(v: string) => setFormData({ ...formData, presupuesto: v })}
                  type="number"
                  placeholder="2000000"
                  tooltip="Presupuesto mensual en pesos chilenos que destinarás a campañas de marketing digital"
                />

                <FormInput
                  label="Ticket Promedio (CLP)"
                  value={formData.ticket}
                  onChange={(v: string) => setFormData({ ...formData, ticket: v })}
                  type="number"
                  placeholder="50000"
                  tooltip="Valor promedio de venta o ingreso por transacción"
                />

                <FormSelect
                  label="Industria"
                  value={formData.industria}
                  onChange={(v: string) => setFormData({ ...formData, industria: v })}
                  tooltip="Cada industria tiene benchmarks específicos de tasa de cierre, CPC y conversión"
                  options={[
                    { value: 'ECOMMERCE', label: '🛒 E-commerce' },
                    { value: 'TECNOLOGIA_SAAS', label: '💻 Tecnología / SaaS' },
                    { value: 'FINTECH', label: '💳 Fintech' },
                    { value: 'INMOBILIARIA', label: '🏠 Inmobiliaria' },
                    { value: 'SALUD_MEDICINA', label: '⚕️ Salud / Medicina' },
                    { value: 'EDUCACION', label: '📚 Educación' },
                    { value: 'TURISMO', label: '✈️ Turismo' },
                    { value: 'GASTRONOMIA', label: '🍽️ Gastronomía' },
                    { value: 'AUTOMOTRIZ', label: '🚗 Automotriz' },
                    { value: 'MODA_RETAIL', label: '👔 Moda / Retail' },
                    { value: 'SERVICIOS_LEGALES', label: '⚖️ Servicios Legales' },
                    { value: 'BELLEZA_PERSONAL', label: '💅 Belleza / Personal' },
                  ]}
                />

                <FormSelect
                  label="Tipo de Cliente"
                  value={formData.tipoCliente}
                  onChange={(v: string) => setFormData({ ...formData, tipoCliente: v })}
                  tooltip="B2B: Ventas a empresas. B2C: Ventas a consumidores finales"
                  options={[
                    { value: 'B2C', label: 'B2C (Consumidor final)' },
                    { value: 'B2B', label: 'B2B (Empresas)' },
                  ]}
                />
              </div>

              {/* Ciclo de venta */}
              <div className="mb-6">
                <CicloVentaChips
                  value={formData.cicloVenta}
                  onChange={(v: string) => setFormData({ ...formData, cicloVenta: v })}
                />
              </div>

              {/* Sliders */}
              <div className="space-y-6 mb-6">
                <TasaCierreSlider
                  value={formData.tasaCierre}
                  onChange={(v: number) => setFormData({ ...formData, tasaCierre: v })}
                  industria={formData.industria}
                />

                <MargenBrutoSlider
                  value={formData.margenBruto}
                  onChange={(v: number) => setFormData({ ...formData, margenBruto: v })}
                />
              </div>

              {/* Madurez digital */}
              <div className="grid grid-cols-1 mb-6">
                <FormSelect
                  label="Madurez Digital"
                  value={formData.madurez}
                  onChange={(v: string) => setFormData({ ...formData, madurez: v })}
                  tooltip="Nivel de sofisticación en herramientas y procesos digitales"
                  options={[
                    { value: 'PRINCIPIANTE', label: 'Principiante (Procesos básicos)' },
                    { value: 'INTERMEDIO', label: 'Intermedio (Automatización parcial)' },
                    { value: 'AVANZADO', label: 'Avanzado (Full analytics & automation)' },
                  ]}
                />
              </div>

              {/* CTA */}
              <div className="pt-6 border-t-2 border-gray-200">
                <PrimaryButton
                  onClick={handlePredict}
                  disabled={!isFormValid}
                  loading={loading}
                  icon={ArrowRight}
                >
                  {loading ? 'Calculando predicción...' : 'Generar Predicción'}
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Insights Cards (estilo Linear) */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InsightCard
                  icon={Lightbulb}
                  title="Curva de aprendizaje"
                  description={`Los primeros 3 meses las campañas optimizan. Esperá un 40% menos de performance inicial que luego se recupera.`}
                  trend="Mes 4 stabiliza"
                  color="indigo"
                />
                <InsightCard
                  icon={Activity}
                  title={`Estacionalidad en ${formData.industria}`}
                  description="Tu industria tiene patrones estacionales que afectan performance. El motor los considera en proyecciones."
                  color="emerald"
                />
              </div>
            </div>

            {/* KPIs */}
            <div id="results" className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Métricas principales</h3>
                <Badge className="bg-emerald-500 text-white font-bold px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  Predicción generada
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPICard
                  title="Conversiones / Mes"
                  value={String(result.predictor?.metricas?.conversiones_mensuales || '0')}
                  icon={Target}
                  color="indigo"
                  tooltip="Número estimado de conversiones mensuales"
                />

                <KPICard
                  title="Revenue Mensual"
                  value={`$${((result.predictor?.metricas?.revenue_mensual || 0) / 1000000).toFixed(1)}M`}
                  icon={DollarSign}
                  color="emerald"
                  tooltip="Ingresos mensuales esperados"
                />

                <KPICard
                  title="ROAS Esperado"
                  value={`${(result.predictor?.metricas?.roas_esperado || 0).toFixed(1)}x`}
                  change={{ value: '+12%', direction: 'up' }}
                  icon={TrendingUp}
                  color="purple"
                  tooltip="Return on Ad Spend"
                />
              </div>

              {/* Viabilidad */}
              <Card className="border-2 border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <BarChart3 className="w-7 h-7 text-indigo-600" />
                        Estado del proyecto
                      </h4>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {result.indices_calculados?.score_combinado?.recomendacion || 'Evaluando viabilidad...'}
                      </p>
                    </div>
                    <TrafficLight
                      status={
                        result.indices_calculados?.score_combinado?.valor > 70 ? 'green' :
                        result.indices_calculados?.score_combinado?.valor > 40 ? 'amber' : 'red'
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Escenarios */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-indigo-600" />
                <h3 className="text-3xl font-bold text-gray-900">Escenarios de proyección</h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                Tres escenarios basados en diferentes niveles de ejecución y condiciones de mercado
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScenarioCard
                  title="Conservador"
                  subtitle="Escenario defensivo"
                  probability={85}
                  metrics={[
                    { label: 'Ventas esperadas', value: String(result.recomendador?.escenarios?.conservador?.ventas_esperadas || 0) },
                    { label: 'Revenue', value: `$${((result.recomendador?.escenarios?.conservador?.revenue_esperado || 0) / 1000000).toFixed(1)}M` },
                    { label: 'ROAS', value: `${(result.recomendador?.escenarios?.conservador?.roas_esperado || 0).toFixed(1)}x` },
                  ]}
                />

                <ScenarioCard
                  title="Base"
                  subtitle="Proyección realista"
                  probability={70}
                  highlighted
                  metrics={[
                    { label: 'Ventas esperadas', value: String(result.recomendador?.escenarios?.base?.ventas_esperadas || 0) },
                    { label: 'Revenue', value: `$${((result.recomendador?.escenarios?.base?.revenue_esperado || 0) / 1000000).toFixed(1)}M` },
                    { label: 'ROAS', value: `${(result.recomendador?.escenarios?.base?.roas_esperado || 0).toFixed(1)}x` },
                  ]}
                />

                <ScenarioCard
                  title="Agresivo"
                  subtitle="Escenario optimista"
                  probability={50}
                  metrics={[
                    { label: 'Ventas esperadas', value: String(result.recomendador?.escenarios?.agresivo?.ventas_esperadas || 0) },
                    { label: 'Revenue', value: `$${((result.recomendador?.escenarios?.agresivo?.revenue_esperado || 0) / 1000000).toFixed(1)}M` },
                    { label: 'ROAS', value: `${(result.recomendador?.escenarios?.agresivo?.roas_esperado || 0).toFixed(1)}x` },
                  ]}
                />
              </div>
            </div>

            {/* Proyección 12 meses PREMIUM */}
            {result.proyeccion_12_meses && (
              <div id="projections" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Proyección 12 meses</h3>
                </div>
                <p className="text-gray-600 mb-8 text-lg">
                  Evolución esperada con <span className="font-semibold text-gray-900">bandas de confianza</span> considerando curva de aprendizaje, estacionalidad y competencia
                </p>

                <Card className="border-2 border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                  <div className="p-8">
                    <ProyeccionPremium
                      data={result.proyeccion_12_meses}
                      industria={formData.industria}
                    />

                    {/* Insights */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-200">
                        <div className="text-sm text-indigo-600 font-bold mb-1">Mes 1-3</div>
                        <div className="text-xl font-bold text-gray-900 mb-1">Fase Aprendizaje</div>
                        <div className="text-sm text-gray-600">Algoritmos optimizando</div>
                        <div className="text-xs text-indigo-600 font-semibold mt-2">60-75% performance</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200">
                        <div className="text-sm text-emerald-600 font-bold mb-1">Mes 4-8</div>
                        <div className="text-xl font-bold text-gray-900 mb-1">Fase Optimización</div>
                        <div className="text-sm text-gray-600">Performance estabilizado</div>
                        <div className="text-xs text-emerald-600 font-semibold mt-2">90-100% performance</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200">
                        <div className="text-sm text-purple-600 font-bold mb-1">Mes 9-12</div>
                        <div className="text-xl font-bold text-gray-900 mb-1">Máximo Performance</div>
                        <div className="text-sm text-gray-600">ROAS optimizado</div>
                        <div className="text-xs text-purple-600 font-semibold mt-2">110-115% performance</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Mix de campañas */}
            {result.recomendador?.mix_campanas_recomendado && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Mix de campañas recomendado</h3>
                </div>
                <p className="text-gray-600 mb-8 text-lg">
                  Distribución óptima de presupuesto por plataforma según {formData.industria} ({formData.tipoCliente})
                </p>

                <Card className="border-2 border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                  <div className="p-8">
                    <MixCampanasVisual mix={result.recomendador.mix_campanas_recomendado} />
                  </div>
                </Card>
              </div>
            )}

            {/* Feedback Section */}
            <div className="mt-16">
              <Card className="border-2 border-indigo-200 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-7 h-7 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-900">¿Qué tan útil fue esta predicción?</h3>
                  </div>

                  {!feedback.submitted ? (
                    <>
                      <p className="text-gray-600 mb-6 text-base">
                        Tu feedback nos ayuda a calibrar el modelo. Las predicciones con 4-5 ⭐ se usan como casos válidos para mejorar precisión.
                      </p>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-3 mb-6">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                            className="group transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-12 h-12 transition-all ${
                                feedback.rating && feedback.rating >= star
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 group-hover:text-yellow-300'
                              }`}
                            />
                          </button>
                        ))}
                        {feedback.rating && (
                          <div className="ml-4">
                            <Badge className={`text-base px-4 py-2 font-bold ${
                              feedback.rating >= 4 ? 'bg-emerald-500' : 'bg-amber-500'
                            } text-white`}>
                              {feedback.rating} {feedback.rating === 1 ? 'estrella' : 'estrellas'}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Comment (optional) */}
                      {feedback.rating && (
                        <div className="mb-6">
                          <Label className="text-sm font-semibold text-gray-700 mb-2">
                            ¿Algún comentario? (opcional)
                          </Label>
                          <textarea
                            value={feedback.comentario}
                            onChange={(e) => setFeedback(prev => ({ ...prev, comentario: e.target.value }))}
                            placeholder="Ej: Los números se alinean con mi experiencia, pero me gustaría ver más detalle en..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none"
                          />
                        </div>
                      )}

                      {/* Submit Button */}
                      {feedback.rating && (
                        <button
                          onClick={handleSubmitFeedback}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                        >
                          <Send className="w-5 h-5" />
                          Enviar Feedback
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por tu feedback!</h4>
                      <p className="text-gray-600">
                        {feedback.rating >= 4
                          ? '✅ Este caso se usará para calibrar el modelo cuando tengamos 500 casos válidos.'
                          : '📊 Tu feedback nos ayuda a identificar áreas de mejora.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4 shadow-md">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Listo para comenzar</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Completa el formulario con los datos de tu negocio y genera tu predicción personalizada
            </p>
            <a href="#input" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 group">
              Ir al formulario
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}

      </main>

      {/* Sección de Contacto y WhatsApp */}
      <section id="contacto" className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Formulario de Contacto */}
          <Card className="p-8 border-2 border-gray-200 hover:border-indigo-300 transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-6 h-6 text-indigo-600" />
                ¿Necesitas ayuda con tu predicción?
              </h3>
              <p className="text-gray-600">
                Completa el formulario y te contactaremos para ayudarte a optimizar tu inversión en Google Ads.
              </p>
            </div>

            {contactForm.enviado ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-emerald-900 mb-2">¡Mensaje enviado!</h4>
                <p className="text-emerald-700">Nos contactaremos contigo pronto.</p>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault()
                setContactForm(prev => ({ ...prev, enviando: true }))

                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      nombre: contactForm.nombre,
                      empresa: contactForm.empresa,
                      email: contactForm.email,
                      telefono: contactForm.telefono,
                      solicitud: contactForm.solicitud,
                      destinatario: 'contacto@mulleryperez.com'
                    })
                  })

                  if (response.ok) {
                    setContactForm(prev => ({ ...prev, enviado: true, enviando: false }))
                  } else {
                    alert('Error al enviar el mensaje. Por favor intenta nuevamente.')
                    setContactForm(prev => ({ ...prev, enviando: false }))
                  }
                } catch (error) {
                  alert('Error al enviar el mensaje. Por favor intenta nuevamente.')
                  setContactForm(prev => ({ ...prev, enviando: false }))
                }
              }} className="space-y-4">
                <div>
                  <Label htmlFor="nombre" className="text-sm font-semibold text-gray-700">Nombre *</Label>
                  <Input
                    id="nombre"
                    required
                    value={contactForm.nombre}
                    onChange={(e) => setContactForm(prev => ({ ...prev, nombre: e.target.value }))}
                    className="mt-1"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor="empresa" className="text-sm font-semibold text-gray-700">Empresa *</Label>
                  <Input
                    id="empresa"
                    required
                    value={contactForm.empresa}
                    onChange={(e) => setContactForm(prev => ({ ...prev, empresa: e.target.value }))}
                    className="mt-1"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono" className="text-sm font-semibold text-gray-700">Teléfono *</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    required
                    value={contactForm.telefono}
                    onChange={(e) => setContactForm(prev => ({ ...prev, telefono: e.target.value }))}
                    className="mt-1"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="solicitud" className="text-sm font-semibold text-gray-700">Solicitud *</Label>
                  <textarea
                    id="solicitud"
                    required
                    value={contactForm.solicitud}
                    onChange={(e) => setContactForm(prev => ({ ...prev, solicitud: e.target.value }))}
                    className="mt-1 w-full min-h-[120px] px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    placeholder="Cuéntanos qué necesitas..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={contactForm.enviando}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactForm.enviando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>

          {/* Botón de WhatsApp */}
          <Card className="p-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:border-emerald-300 transition-all">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ¿Prefieres conversar directamente?
              </h3>

              <p className="text-gray-600 mb-8 max-w-md">
                Chatea con nosotros por WhatsApp y resuelve tus dudas sobre Google Ads al instante.
              </p>

              <a
                href="https://wa.me/56992258137?text=Hola%2C%20quiero%20consultar%20sobre%20el%20Predictor%20de%20Google%20Ads"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/30"
              >
                <MessageSquare className="w-6 h-6" />
                Conversemos
              </a>

              <p className="text-sm text-gray-500 mt-4">
                +56 9 9225 8137
              </p>
            </div>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 mt-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold">
                Motor 2025 v2025.1.0
              </Badge>
              <span className="text-gray-600">• Validado con 108 casos • 100% coherencia matemática</span>
            </div>
            <div className="flex items-center gap-6 text-gray-600 font-medium">
              <a href="#" className="hover:text-indigo-600 transition-colors">Documentación</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">API</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
