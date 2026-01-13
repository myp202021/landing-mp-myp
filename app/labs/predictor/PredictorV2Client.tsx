// @ts-nocheck
'use client'

/**
 * PREDICTOR V2 - DIAGNÓSTICO CONSULTIVO
 *
 * Nuevo flujo:
 * 1. Input de contexto de negocio (etapa, objetivo, assets)
 * 2. Diagnóstico consultivo (¿es viable? ¿qué plataforma?)
 * 3. Predicción numérica (si es viable)
 *
 * Design: Estilo Stripe/Linear
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  Zap,
  Building2,
  Rocket,
  Crown,
  Eye,
  Users,
  ShoppingCart,
  Video,
  Image,
  FileText,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  RotateCcw,
  BarChart3,
  PieChart,
  MessageSquare,
  Mail,
  X,
  Download,
  Send,
  Share2,
  Copy,
  Check,
  Calculator,
  SlidersHorizontal,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Phone,
  Calendar,
  Star,
  Award
} from 'lucide-react'

// ============================================================================
// COMPONENTES CTA PRO
// ============================================================================

// Botón WhatsApp Sticky
const WhatsAppSticky = () => (
  <a
    href="https://wa.me/56992258137?text=Hola%2C%20acabo%20de%20usar%20el%20Predictor%20y%20me%20gustar%C3%ADa%20una%20asesor%C3%ADa%20personalizada"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 group"
  >
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </div>
    <div className="hidden sm:block">
      <p className="font-bold text-sm">¿Dudas?</p>
      <p className="text-xs opacity-90">Chatea con nosotros</p>
    </div>
  </a>
)

// CTA Card Pro
const CTACardPro = ({ variant = 'default' }: { variant?: 'default' | 'urgent' | 'premium' }) => {
  const styles = {
    default: {
      bg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      hover: 'hover:from-indigo-700 hover:to-purple-700',
      shadow: 'shadow-indigo-500/30'
    },
    urgent: {
      bg: 'bg-gradient-to-r from-orange-500 to-red-500',
      hover: 'hover:from-orange-600 hover:to-red-600',
      shadow: 'shadow-orange-500/30'
    },
    premium: {
      bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      hover: 'hover:from-amber-600 hover:to-yellow-600',
      shadow: 'shadow-amber-500/30'
    }
  }

  const style = styles[variant]

  return (
    <Card className={`p-6 ${style.bg} border-0 text-white`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-semibold text-white/90">Asesoría Gratuita</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            ¿Quieres implementar esto con expertos?
          </h3>
          <p className="text-white/80 mb-4">
            Te ayudamos a ejecutar la estrategia con resultados garantizados. Primera consulta sin costo.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/56992258137?text=Hola%2C%20quiero%20agendar%20una%20asesor%C3%ADa%20gratuita%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Agendar Asesoría Gratis
            </a>
            <a
              href="tel:+56992258137"
              className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-5 py-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +56 9 9225 8137
            </a>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl">
          <Award className="w-12 h-12 text-yellow-300" />
          <p className="text-sm font-bold text-center">Top 3<br/>Agencias Chile</p>
        </div>
      </div>
    </Card>
  )
}

// Mini CTA inline
const MiniCTA = ({ text, href }: { text: string, href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors group"
  >
    {text}
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </a>
)

// ============================================================================
// COMPONENTES UI
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
        <div className="absolute z-50 w-72 p-3 bg-gray-900 text-white text-sm rounded-xl shadow-2xl -top-2 left-6 animate-in fade-in duration-200">
          {text}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-4"></div>
        </div>
      )}
    </div>
  )
}

const SelectCard = ({ selected, onClick, icon: Icon, title, description, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
      selected
        ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/20 shadow-lg'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl ${selected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-bold ${selected ? 'text-indigo-900' : 'text-gray-900'}`}>{title}</h4>
          {badge && (
            <Badge className={`text-xs ${selected ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-600'}`}>
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </button>
)

const FormInput = ({ label, value, onChange, type = 'text', placeholder, tooltip, prefix }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{prefix}</span>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 ${prefix ? 'pl-8' : 'px-4'}`}
      />
    </div>
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
      className="h-12 w-full px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all cursor-pointer"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

const ViabilityGauge = ({ score }: { score: number }) => {
  const getColor = () => {
    if (score >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Alta Viabilidad' }
    if (score >= 50) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Viabilidad Media' }
    if (score >= 30) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Viabilidad Baja' }
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'No Recomendado' }
  }

  const color = getColor()

  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
          <circle
            cx="64" cy="64" r="56"
            stroke={score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : score >= 30 ? '#F97316' : '#EF4444'}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${score * 3.52} 352`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${color.text}`}>{score}</span>
        </div>
      </div>
      <Badge className={`${color.bg} text-white font-bold px-4 py-1`}>
        {color.label}
      </Badge>
    </div>
  )
}

const DiagnosticCard = ({ type, title, content, icon: Icon }: any) => {
  const styles = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-800' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', text: 'text-amber-800' },
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', text: 'text-red-800' },
    info: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600', text: 'text-indigo-800' }
  }

  const style = styles[type] || styles.info

  return (
    <div className={`p-5 rounded-xl ${style.bg} border-2 ${style.border}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-white ${style.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold mb-1 ${style.text}`}>{title}</h4>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  )
}

const PlatformRecommendation = ({ plataforma, justificacion }: any) => {
  const platformConfig = {
    GOOGLE: { icon: '🔍', name: 'Google Ads', color: 'bg-blue-500' },
    META: { icon: '📱', name: 'Meta Ads', color: 'bg-purple-500' },
    LINKEDIN: { icon: '💼', name: 'LinkedIn Ads', color: 'bg-sky-600' },
    MIXTO: { icon: '🎯', name: 'Mix Multiplataforma', color: 'bg-indigo-500' }
  }

  const config = platformConfig[plataforma] || platformConfig.MIXTO

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 ${config.color} rounded-xl flex items-center justify-center text-2xl`}>
          {config.icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Plataforma Recomendada</p>
          <h3 className="text-2xl font-bold text-gray-900">{config.name}</h3>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{justificacion}</p>
    </div>
  )
}

const BudgetDistribution = ({ distribucion }: { distribucion: any[] }) => (
  <div className="space-y-4">
    {distribucion.map((item, idx) => (
      <div key={idx} className="p-4 bg-white rounded-xl border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900">{item.plataforma}</h4>
          <Badge className="bg-indigo-100 text-indigo-700 font-bold">{item.porcentaje}%</Badge>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full mb-3">
          <div
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${item.porcentaje}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{item.tipo_campana}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">{item.justificacion}</p>
      </div>
    ))}
  </div>
)

// ============================================================================
// VISUALIZACIONES AVANZADAS
// ============================================================================

// Gráfico de Línea - Proyección 6 Meses
const ProjectionLineChart = ({ data, height = 200 }: { data: any[], height?: number }) => {
  if (!data || data.length === 0) return null

  const maxRevenue = Math.max(...data.map(d => d.revenue))
  const minRevenue = Math.min(...data.map(d => d.revenue))
  const range = maxRevenue - minRevenue || 1

  const width = 100
  const padding = 10

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((d.revenue - minRevenue) / range) * (height - 2 * padding - 20)
    return { x, y, ...d }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + 20 + i * ((height - 2 * padding - 20) / 3)}
            x2={width - padding}
            y2={padding + 20 + i * ((height - 2 * padding - 20) / 3)}
            stroke="#E5E7EB"
            strokeWidth="0.3"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#gradient)" opacity="0.3" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="#6366F1" />
            <circle cx={p.x} cy={p.y} r="1.5" fill="white" />
          </g>
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - 2} textAnchor="middle" fontSize="3" fill="#6B7280">
            M{p.mes}
          </text>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex justify-between mt-4 px-2">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-gray-500">{d.nombre}</p>
            <p className="text-sm font-bold text-gray-900">${(d.revenue / 1000000).toFixed(1)}M</p>
            <Badge className={`text-xs mt-1 ${d.fase === 'Aprendizaje' ? 'bg-amber-100 text-amber-700' : d.fase === 'Optimización' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {d.fase}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

// Gauge de Comparación vs Benchmark
const BenchmarkGauge = ({
  userValue,
  benchmarkMin,
  benchmarkAvg,
  benchmarkTop,
  label,
  suffix = 'x'
}: {
  userValue: number
  benchmarkMin: number
  benchmarkAvg: number
  benchmarkTop: number
  label: string
  suffix?: string
}) => {
  const maxValue = benchmarkTop * 1.2
  const userPercent = Math.min((userValue / maxValue) * 100, 100)
  const minPercent = (benchmarkMin / maxValue) * 100
  const avgPercent = (benchmarkAvg / maxValue) * 100
  const topPercent = (benchmarkTop / maxValue) * 100

  const getColor = () => {
    if (userValue >= benchmarkTop) return { color: '#10B981', label: 'Top 10%', bg: 'bg-emerald-100 text-emerald-700' }
    if (userValue >= benchmarkAvg) return { color: '#6366F1', label: 'Sobre promedio', bg: 'bg-indigo-100 text-indigo-700' }
    if (userValue >= benchmarkMin) return { color: '#F59E0B', label: 'En promedio', bg: 'bg-amber-100 text-amber-700' }
    return { color: '#EF4444', label: 'Bajo promedio', bg: 'bg-red-100 text-red-700' }
  }

  const status = getColor()

  return (
    <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <Badge className={status.bg}>{status.label}</Badge>
      </div>

      {/* Bar */}
      <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
        {/* Benchmark zones */}
        <div
          className="absolute top-0 h-full bg-red-200"
          style={{ left: 0, width: `${minPercent}%` }}
        />
        <div
          className="absolute top-0 h-full bg-amber-200"
          style={{ left: `${minPercent}%`, width: `${avgPercent - minPercent}%` }}
        />
        <div
          className="absolute top-0 h-full bg-emerald-200"
          style={{ left: `${avgPercent}%`, width: `${100 - avgPercent}%` }}
        />

        {/* User value marker */}
        <div
          className="absolute top-0 h-full w-1 bg-gray-900 transition-all duration-500"
          style={{ left: `${userPercent}%` }}
        />
        <div
          className="absolute -top-1 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-500"
          style={{ left: `calc(${userPercent}% - 12px)`, backgroundColor: status.color }}
        >
          <span className="text-white text-xs font-bold">↓</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Mín: {benchmarkMin}{suffix}</span>
        <span>Prom: {benchmarkAvg}{suffix}</span>
        <span>Top: {benchmarkTop}{suffix}</span>
      </div>

      {/* User value */}
      <div className="text-center mt-3">
        <span className="text-2xl font-bold" style={{ color: status.color }}>
          {userValue.toFixed(1)}{suffix}
        </span>
        <span className="text-sm text-gray-500 ml-2">Tu proyección</span>
      </div>
    </div>
  )
}

// Pie Chart Interactivo
const InteractivePieChart = ({ data }: { data: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const total = data.reduce((sum, item) => sum + item.porcentaje, 0)
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

  let currentAngle = -90

  const slices = data.map((item, index) => {
    const angle = (item.porcentaje / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const pathD = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`

    return {
      ...item,
      pathD,
      color: colors[index % colors.length],
      index
    }
  })

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathD}
              fill={slice.color}
              opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.5}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              transform={hoveredIndex === i ? 'scale(1.05)' : 'scale(1)'}
              style={{ transformOrigin: '50px 50px' }}
            />
          ))}
          <circle cx="50" cy="50" r="20" fill="white" />
          <text x="50" y="48" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#374151">
            {hoveredIndex !== null ? `${data[hoveredIndex].porcentaje}%` : '100%'}
          </text>
          <text x="50" y="56" textAnchor="middle" fontSize="3" fill="#6B7280">
            {hoveredIndex !== null ? data[hoveredIndex].plataforma : 'Total'}
          </text>
        </svg>
      </div>

      <div className="flex-1 space-y-2">
        {slices.map((slice, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg transition-all cursor-pointer ${hoveredIndex === i ? 'bg-gray-100 scale-102' : 'hover:bg-gray-50'}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="font-medium text-gray-900 flex-1">{slice.plataforma}</span>
              <Badge className="bg-gray-100 text-gray-700">{slice.porcentaje}%</Badge>
            </div>
            <p className="text-xs text-gray-500 ml-6 mt-1">{slice.tipo_campana}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simulador What If
const WhatIfSimulator = ({
  baseResult,
  baseInput,
  onRecalculate
}: {
  baseResult: any
  baseInput: any
  onRecalculate: (newInput: any) => void
}) => {
  const [adjustments, setAdjustments] = useState({
    presupuesto: 0,
    ticket: 0,
    tasaCierre: 0
  })
  const [simResult, setSimResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calculateSimulation = async () => {
    setLoading(true)
    try {
      const newInput = {
        ...baseInput,
        presupuesto_mensual: Math.round(baseInput.presupuesto_mensual * (1 + adjustments.presupuesto / 100)),
        ticket_promedio: Math.round(baseInput.ticket_promedio * (1 + adjustments.ticket / 100)),
        tasa_cierre: Math.max(1, Math.min(20, (baseInput.tasa_cierre || 5) + adjustments.tasaCierre))
      }

      const response = await fetch('/api/predictions/motor-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInput)
      })

      if (response.ok) {
        const data = await response.json()
        setSimResult(data)
      }
    } catch (e) {
      console.error('Error en simulación:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (adjustments.presupuesto !== 0 || adjustments.ticket !== 0 || adjustments.tasaCierre !== 0) {
        calculateSimulation()
      } else {
        setSimResult(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [adjustments])

  const compareMetric = (base: number, sim: number) => {
    if (!sim) return null
    const diff = ((sim - base) / base) * 100
    return {
      value: sim,
      diff,
      isPositive: diff > 0
    }
  }

  const baseMetrics = baseResult?.prediccion?.metricas
  const simMetrics = simResult?.prediccion?.metricas

  return (
    <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Simulador "What If"</h3>
          <p className="text-sm text-gray-500">Ajusta los parámetros y ve cómo cambian tus resultados</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-gray-700">Presupuesto</Label>
            <Badge className={adjustments.presupuesto > 0 ? 'bg-emerald-100 text-emerald-700' : adjustments.presupuesto < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}>
              {adjustments.presupuesto > 0 ? '+' : ''}{adjustments.presupuesto}%
            </Badge>
          </div>
          <input
            type="range"
            min={-50}
            max={100}
            value={adjustments.presupuesto}
            onChange={(e) => setAdjustments({ ...adjustments, presupuesto: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-50%</span>
            <span>0</span>
            <span>+100%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-gray-700">Ticket Promedio</Label>
            <Badge className={adjustments.ticket > 0 ? 'bg-emerald-100 text-emerald-700' : adjustments.ticket < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}>
              {adjustments.ticket > 0 ? '+' : ''}{adjustments.ticket}%
            </Badge>
          </div>
          <input
            type="range"
            min={-50}
            max={100}
            value={adjustments.ticket}
            onChange={(e) => setAdjustments({ ...adjustments, ticket: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-50%</span>
            <span>0</span>
            <span>+100%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-gray-700">Tasa de Cierre</Label>
            <Badge className={adjustments.tasaCierre > 0 ? 'bg-emerald-100 text-emerald-700' : adjustments.tasaCierre < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}>
              {adjustments.tasaCierre > 0 ? '+' : ''}{adjustments.tasaCierre}pts
            </Badge>
          </div>
          <input
            type="range"
            min={-4}
            max={10}
            value={adjustments.tasaCierre}
            onChange={(e) => setAdjustments({ ...adjustments, tasaCierre: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-4pts</span>
            <span>0</span>
            <span>+10pts</span>
          </div>
        </div>
      </div>

      {/* Results Comparison */}
      {baseMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Conversiones', base: baseMetrics.conversiones_mensuales, sim: simMetrics?.conversiones_mensuales, format: (v: number) => v.toString() },
            { label: 'Revenue', base: baseMetrics.revenue_mensual, sim: simMetrics?.revenue_mensual, format: (v: number) => `$${(v/1000000).toFixed(1)}M` },
            { label: 'ROAS', base: baseMetrics.roas_esperado, sim: simMetrics?.roas_esperado, format: (v: number) => `${v.toFixed(1)}x` },
            { label: 'CPA', base: baseMetrics.cpa_promedio, sim: simMetrics?.cpa_promedio, format: (v: number) => `$${(v/1000).toFixed(0)}k`, invertColor: true }
          ].map((metric, idx) => {
            const comparison = simMetrics ? compareMetric(metric.base, metric.sim) : null
            const isPositive = metric.invertColor ? comparison?.diff && comparison.diff < 0 : comparison?.isPositive

            return (
              <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {loading ? '...' : metric.format(comparison?.value || metric.base)}
                  </span>
                  {comparison && !loading && (
                    <span className={`text-xs font-semibold flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(comparison.diff).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Base: {metric.format(metric.base)}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Reset button */}
      {(adjustments.presupuesto !== 0 || adjustments.ticket !== 0 || adjustments.tasaCierre !== 0) && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdjustments({ presupuesto: 0, ticket: 0, tasaCierre: 0 })}
            className="text-gray-500"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetear ajustes
          </Button>
        </div>
      )}
    </Card>
  )
}

// Calculadora Inversa
const InverseCalculator = ({ industryData, currentResult }: { industryData: any, currentResult: any }) => {
  const [mode, setMode] = useState<'leads' | 'roas'>('leads')
  const [targetLeads, setTargetLeads] = useState('')
  const [targetRoas, setTargetRoas] = useState('')
  const [result, setResult] = useState<any>(null)

  const cplPromedio = industryData?.benchmarks?.cpl?.promedio || 15000

  const calculateForLeads = () => {
    const leads = parseInt(targetLeads)
    if (!leads || leads <= 0) return

    const requiredBudget = leads * cplPromedio
    const expectedRevenue = leads * (currentResult?.contexto_analizado?.ticket_promedio || 100000) * 0.05 // 5% tasa cierre
    const expectedRoas = expectedRevenue / requiredBudget

    setResult({
      type: 'leads',
      targetLeads: leads,
      requiredBudget,
      expectedRevenue,
      expectedRoas,
      cplUsed: cplPromedio
    })
  }

  const calculateForRoas = () => {
    const roas = parseFloat(targetRoas)
    if (!roas || roas <= 0) return

    const ticket = currentResult?.contexto_analizado?.ticket_promedio || 100000
    const tasaCierre = 0.05

    // ROAS = Revenue / Budget
    // Revenue = Conversiones * Ticket
    // Conversiones = Clicks * CVR * TasaCierre
    // Budget = Clicks * CPC
    // Simplificando: minTicket = ROAS * CPA
    const minTicket = roas * cplPromedio / tasaCierre
    const currentTicket = currentResult?.contexto_analizado?.ticket_promedio || 100000
    const ticketGap = minTicket - currentTicket

    setResult({
      type: 'roas',
      targetRoas: roas,
      minTicketRequired: minTicket,
      currentTicket,
      ticketGap,
      viable: ticketGap <= 0
    })
  }

  useEffect(() => {
    if (mode === 'leads' && targetLeads) {
      calculateForLeads()
    } else if (mode === 'roas' && targetRoas) {
      calculateForRoas()
    } else {
      setResult(null)
    }
  }, [targetLeads, targetRoas, mode])

  return (
    <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Calculator className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Calculadora Inversa</h3>
          <p className="text-sm text-gray-500">¿Qué necesitas para lograr tu objetivo?</p>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('leads'); setResult(null); setTargetRoas('') }}
          className={`flex-1 p-3 rounded-xl border-2 font-medium transition-all ${
            mode === 'leads'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Users className="w-5 h-5 mx-auto mb-1" />
          Quiero X Leads
        </button>
        <button
          onClick={() => { setMode('roas'); setResult(null); setTargetLeads('') }}
          className={`flex-1 p-3 rounded-xl border-2 font-medium transition-all ${
            mode === 'roas'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Percent className="w-5 h-5 mx-auto mb-1" />
          Quiero ROAS Xx
        </button>
      </div>

      {/* Input */}
      {mode === 'leads' && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700">¿Cuántos leads/mes quieres generar?</Label>
            <Input
              type="number"
              value={targetLeads}
              onChange={(e) => setTargetLeads(e.target.value)}
              placeholder="Ej: 50"
              className="mt-2 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500"
            />
          </div>

          {result && result.type === 'leads' && (
            <div className="p-4 bg-white rounded-xl border-2 border-purple-200">
              <h4 className="font-bold text-gray-900 mb-3">Para generar {result.targetLeads} leads/mes necesitas:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">Presupuesto Requerido</p>
                  <p className="text-2xl font-bold text-purple-700">${(result.requiredBudget / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">CLP/mes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium">ROAS Esperado</p>
                  <p className="text-2xl font-bold text-gray-700">{result.expectedRoas.toFixed(1)}x</p>
                  <p className="text-xs text-gray-500">con tu ticket actual</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Calculado con CPL promedio de tu industria: ${(result.cplUsed / 1000).toFixed(0)}k
              </p>
            </div>
          )}
        </div>
      )}

      {mode === 'roas' && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700">¿Qué ROAS objetivo tienes?</Label>
            <Input
              type="number"
              value={targetRoas}
              onChange={(e) => setTargetRoas(e.target.value)}
              placeholder="Ej: 5"
              step="0.5"
              className="mt-2 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500"
            />
          </div>

          {result && result.type === 'roas' && (
            <div className={`p-4 rounded-xl border-2 ${result.viable ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <h4 className="font-bold text-gray-900 mb-3">Para lograr ROAS {result.targetRoas}x:</h4>

              {result.viable ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-700">¡Tu ticket actual es suficiente!</p>
                    <p className="text-sm text-emerald-600">
                      Con ${(result.currentTicket / 1000).toFixed(0)}k de ticket, puedes lograr ROAS {result.targetRoas}x
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-amber-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="font-bold text-amber-700">Necesitas aumentar tu ticket</p>
                      <p className="text-sm text-amber-600">
                        Tu ticket actual (${(result.currentTicket / 1000).toFixed(0)}k) es muy bajo para ese ROAS
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Ticket Mínimo Requerido</p>
                      <p className="text-2xl font-bold text-purple-700">${(result.minTicketRequired / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Debes aumentar en</p>
                      <p className="text-2xl font-bold text-amber-600">+${(result.ticketGap / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// Modal de Captura de Email
const EmailCaptureModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string, name: string) => void
  loading: boolean
}) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && name) {
      onSubmit(email, name)
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Recibe tu Reporte Completo
              </h3>
              <p className="text-gray-600">
                Te enviamos el diagnóstico detallado con todos los insights y recomendaciones.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Nombre</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-1 h-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mt-1 h-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email || !name}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Reporte
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              No spam. Solo información útil para tu negocio.
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Reporte Enviado
            </h3>
            <p className="text-gray-600 mb-4">
              Revisa tu bandeja de entrada. El reporte llegará en los próximos minutos.
            </p>
            <Button onClick={onClose} variant="outline" className="rounded-xl">
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PredictorV2Client() {
  const [step, setStep] = useState(1) // 1: Input, 2: Resultados
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    // Datos del negocio
    industria: 'ECOMMERCE',
    tipo_cliente: 'B2C',
    ticket_promedio: '',
    ventas_actuales_mes: '',
    margen_bruto: 40,

    // Contexto estratégico
    etapa_negocio: 'CRECIMIENTO',
    objetivo_marketing: 'LEADS',
    nivel_assets: 'BASICO',

    // Presupuesto
    presupuesto_mensual: '',

    // Opcionales
    competencia_percibida: 5,
    tiene_ecommerce: false,
    tiene_equipo_ventas: true,
    ciclo_venta_dias: 30,
    tasa_cierre: 5
  })

  const isFormValid = formData.ticket_promedio && formData.presupuesto_mensual

  const handleAnalizar = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/predictions/motor-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ticket_promedio: parseInt(formData.ticket_promedio),
          presupuesto_mensual: parseInt(formData.presupuesto_mensual),
          ventas_actuales_mes: parseInt(formData.ventas_actuales_mes) || 10
        })
      })

      if (!response.ok) {
        throw new Error('Error al generar diagnóstico')
      }

      const data = await response.json()
      setResult(data)
      setStep(2)

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error: any) {
      setError(error.message || 'Error al generar diagnóstico')
    } finally {
      setLoading(false)
    }
  }

  const handleNuevoAnalisis = () => {
    setResult(null)
    setStep(1)
    setFormData({
      industria: 'ECOMMERCE',
      tipo_cliente: 'B2C',
      ticket_promedio: '',
      ventas_actuales_mes: '',
      margen_bruto: 40,
      etapa_negocio: 'CRECIMIENTO',
      objetivo_marketing: 'LEADS',
      nivel_assets: 'BASICO',
      presupuesto_mensual: '',
      competencia_percibida: 5,
      tiene_ecommerce: false,
      tiene_equipo_ventas: true,
      ciclo_venta_dias: 30,
      tasa_cierre: 5
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEmailSubmit = async (email: string, name: string) => {
    setEmailLoading(true)
    try {
      // Enviar lead a la API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          source: 'predictor_v2',
          data: {
            industria: result?.contexto_analizado?.industria,
            presupuesto: result?.contexto_analizado?.presupuesto_mensual,
            viable: result?.diagnostico?.viable,
            score: result?.diagnostico?.score_viabilidad,
            plataforma_recomendada: result?.diagnostico?.recomendacion_plataforma?.plataforma
          }
        })
      })
    } catch (e) {
      console.log('Lead capture (offline mode)')
    }
    setEmailLoading(false)
  }

  const handleCopyResults = () => {
    if (!result) return

    const texto = `
DIAGNÓSTICO DE MARKETING DIGITAL - M&P

Industria: ${result.contexto_analizado?.industria}
Presupuesto: $${(result.contexto_analizado?.presupuesto_mensual / 1000000).toFixed(1)}M CLP/mes

VIABILIDAD: ${result.diagnostico?.viable ? 'VIABLE' : 'REQUIERE AJUSTES'}
Score: ${result.diagnostico?.score_viabilidad}/100

RECOMENDACIONES:
- Plataforma: ${result.diagnostico?.recomendacion_plataforma?.plataforma}
- Tipo de Campaña: ${result.diagnostico?.recomendacion_campana?.tipo}

${result.prediccion ? `PREDICCIÓN (Escenario Base):
- Conversiones/mes: ${result.prediccion.metricas.conversiones_mensuales}
- Revenue mensual: $${(result.prediccion.metricas.revenue_mensual / 1000000).toFixed(1)}M
- ROAS esperado: ${result.prediccion.metricas.roas_esperado.toFixed(1)}x
- CPA promedio: $${(result.prediccion.metricas.cpa_promedio / 1000).toFixed(0)}k` : ''}

Generado en: https://www.mulleryperez.cl/labs/predictor
    `.trim()

    navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareResults = () => {
    const url = window.location.href
    const text = `Hice mi diagnóstico de marketing digital: ${result?.diagnostico?.viable ? 'Mi proyecto es viable' : 'Necesito ajustes'} con score ${result?.diagnostico?.score_viabilidad}/100. Pruébalo gratis:`

    if (navigator.share) {
      navigator.share({ title: 'Diagnóstico Marketing Digital', text, url })
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    }
  }

  // Mostrar modal de email después de 3 segundos en resultados
  useEffect(() => {
    if (step === 2 && result) {
      const timer = setTimeout(() => setShowEmailModal(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [step, result])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* WhatsApp Sticky Button */}
      <WhatsAppSticky />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo-myp.png" alt="M&P" className="h-10" />
            </a>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-gray-900">Predictor v2</span>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs">NUEVO</Badge>
            </div>
          </div>

          {result && (
            <Button variant="outline" onClick={handleNuevoAnalisis} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Nuevo Análisis
            </Button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-indigo-100 text-indigo-700 font-semibold mb-4">Sistema Consultivo M&P 2025</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Diagnóstico de Marketing Digital
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analiza tu negocio y recibe recomendaciones personalizadas de plataformas, campañas y presupuesto.
          </p>
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <div className="space-y-8">

            {/* Sección 1: Datos del Negocio */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Datos del Negocio</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Industria"
                  value={formData.industria}
                  onChange={(v: string) => setFormData({ ...formData, industria: v })}
                  options={[
                    { value: 'ECOMMERCE', label: 'E-commerce / Retail Online' },
                    { value: 'TECNOLOGIA_SAAS', label: 'Tecnología / SaaS' },
                    { value: 'FINTECH', label: 'Fintech / Servicios Financieros' },
                    { value: 'INMOBILIARIA', label: 'Inmobiliaria / Corredoras' },
                    { value: 'SALUD_MEDICINA', label: 'Salud / Clínicas / Medicina' },
                    { value: 'EDUCACION', label: 'Educación / Capacitación' },
                    { value: 'SERVICIOS_LEGALES', label: 'Servicios Legales / Profesionales' },
                    { value: 'AUTOMOTRIZ', label: 'Automotriz / Concesionarias' },
                    { value: 'TURISMO', label: 'Turismo / Hotelería' },
                    { value: 'GASTRONOMIA', label: 'Gastronomía / Restaurantes' },
                    { value: 'MODA_RETAIL', label: 'Moda / Retail Físico' },
                    { value: 'BELLEZA_PERSONAL', label: 'Belleza / Cuidado Personal' }
                  ]}
                />

                <FormSelect
                  label="Tipo de Cliente"
                  value={formData.tipo_cliente}
                  onChange={(v: string) => setFormData({ ...formData, tipo_cliente: v })}
                  tooltip="B2B: Vendes a empresas. B2C: Vendes a consumidores."
                  options={[
                    { value: 'B2C', label: 'B2C (Consumidor final)' },
                    { value: 'B2B', label: 'B2B (Empresas)' },
                    { value: 'MIXTO', label: 'Mixto (Ambos)' }
                  ]}
                />

                <FormInput
                  label="Ticket Promedio (CLP)"
                  value={formData.ticket_promedio}
                  onChange={(v: string) => setFormData({ ...formData, ticket_promedio: v })}
                  type="number"
                  placeholder="150000"
                  prefix="$"
                  tooltip="Valor promedio de cada venta o contrato"
                />

                <FormInput
                  label="Ventas Actuales / Mes"
                  value={formData.ventas_actuales_mes}
                  onChange={(v: string) => setFormData({ ...formData, ventas_actuales_mes: v })}
                  type="number"
                  placeholder="20"
                  tooltip="Cantidad de ventas o leads que cierras actualmente por mes"
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold text-gray-700">Margen Bruto</Label>
                    <InfoTooltip text="Porcentaje de ganancia sobre el precio de venta" />
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={10}
                      max={80}
                      value={formData.margen_bruto}
                      onChange={(e) => setFormData({ ...formData, margen_bruto: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <Badge className="bg-indigo-100 text-indigo-700 font-bold w-16 text-center">
                      {formData.margen_bruto}%
                    </Badge>
                  </div>
                </div>

                <FormInput
                  label="Presupuesto Mensual (CLP)"
                  value={formData.presupuesto_mensual}
                  onChange={(v: string) => setFormData({ ...formData, presupuesto_mensual: v })}
                  type="number"
                  placeholder="1500000"
                  prefix="$"
                  tooltip="Presupuesto que destinarás a publicidad digital por mes"
                />
              </div>
            </Card>

            {/* Sección 2: Etapa del Negocio */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Rocket className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Etapa del Negocio</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  selected={formData.etapa_negocio === 'STARTUP'}
                  onClick={() => setFormData({ ...formData, etapa_negocio: 'STARTUP' })}
                  icon={Zap}
                  title="Startup"
                  description="Validando producto, buscando PMF"
                  badge="<1 año"
                />
                <SelectCard
                  selected={formData.etapa_negocio === 'CRECIMIENTO'}
                  onClick={() => setFormData({ ...formData, etapa_negocio: 'CRECIMIENTO' })}
                  icon={TrendingUp}
                  title="Crecimiento"
                  description="Escalando, adquiriendo clientes"
                  badge="1-5 años"
                />
                <SelectCard
                  selected={formData.etapa_negocio === 'CONSOLIDADO'}
                  onClick={() => setFormData({ ...formData, etapa_negocio: 'CONSOLIDADO' })}
                  icon={Crown}
                  title="Consolidado"
                  description="Marca establecida, optimizando"
                  badge=">5 años"
                />
              </div>
            </Card>

            {/* Sección 3: Objetivo */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Objetivo Principal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  selected={formData.objetivo_marketing === 'AWARENESS'}
                  onClick={() => setFormData({ ...formData, objetivo_marketing: 'AWARENESS' })}
                  icon={Eye}
                  title="Awareness"
                  description="Dar a conocer la marca"
                />
                <SelectCard
                  selected={formData.objetivo_marketing === 'LEADS'}
                  onClick={() => setFormData({ ...formData, objetivo_marketing: 'LEADS' })}
                  icon={Users}
                  title="Generación de Leads"
                  description="Captar prospectos calificados"
                />
                <SelectCard
                  selected={formData.objetivo_marketing === 'VENTAS_DIRECTAS'}
                  onClick={() => setFormData({ ...formData, objetivo_marketing: 'VENTAS_DIRECTAS' })}
                  icon={ShoppingCart}
                  title="Ventas Directas"
                  description="Conversiones y transacciones"
                />
              </div>
            </Card>

            {/* Sección 4: Assets de Contenido */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Video className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Assets de Contenido</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  selected={formData.nivel_assets === 'SIN_CONTENIDO'}
                  onClick={() => setFormData({ ...formData, nivel_assets: 'SIN_CONTENIDO' })}
                  icon={FileText}
                  title="Sin Contenido"
                  description="No tengo piezas visuales"
                />
                <SelectCard
                  selected={formData.nivel_assets === 'BASICO'}
                  onClick={() => setFormData({ ...formData, nivel_assets: 'BASICO' })}
                  icon={Image}
                  title="Básico"
                  description="Algunas imágenes y textos"
                />
                <SelectCard
                  selected={formData.nivel_assets === 'PRODUCCION'}
                  onClick={() => setFormData({ ...formData, nivel_assets: 'PRODUCCION' })}
                  icon={Video}
                  title="Producción"
                  description="Videos, fotografía profesional"
                />
              </div>
            </Card>

            {/* Opciones adicionales */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Información Adicional</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ecommerce"
                    checked={formData.tiene_ecommerce}
                    onChange={(e) => setFormData({ ...formData, tiene_ecommerce: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="ecommerce" className="text-sm font-medium text-gray-700">
                    Tengo tienda online (e-commerce)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ventas"
                    checked={formData.tiene_equipo_ventas}
                    onChange={(e) => setFormData({ ...formData, tiene_equipo_ventas: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="ventas" className="text-sm font-medium text-gray-700">
                    Tengo equipo de ventas
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Competencia Percibida</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.competencia_percibida}
                      onChange={(e) => setFormData({ ...formData, competencia_percibida: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <Badge className="bg-gray-100 text-gray-700 font-bold w-10 text-center">
                      {formData.competencia_percibida}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 pt-6">
              <Button
                onClick={handleAnalizar}
                disabled={!isFormValid || loading}
                className="h-14 px-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generar Diagnóstico
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {!isFormValid && (
                <p className="text-sm text-gray-500">
                  Completa al menos el ticket promedio y presupuesto mensual
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Resultados */}
        {step === 2 && result && (
          <div className="space-y-8">

            {/* Score de Viabilidad */}
            <Card className="p-8 border-2 border-gray-200">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className={`mb-4 ${result.diagnostico.viable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {result.diagnostico.viable ? 'Proyecto Viable' : 'Requiere Ajustes'}
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {result.diagnostico.diagnostico_principal}
                  </h2>

                  {result.diagnostico.alertas_criticas.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {result.diagnostico.alertas_criticas.map((alerta: string, idx: number) => (
                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700">{alerta}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <ViabilityGauge score={result.diagnostico.score_viabilidad} />
              </div>
            </Card>

            {/* Recomendación de Plataforma */}
            <PlatformRecommendation
              plataforma={result.diagnostico.recomendacion_plataforma.plataforma}
              justificacion={result.diagnostico.recomendacion_plataforma.justificacion}
            />

            {/* Tipo de Campaña */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tipo de Campaña Recomendado</h3>
              </div>
              <p className="text-2xl font-bold text-indigo-600 mb-2">
                {result.diagnostico.recomendacion_campana.tipo}
              </p>
              <p className="text-gray-600">{result.diagnostico.recomendacion_campana.justificacion}</p>
            </Card>

            {/* Distribución de Presupuesto */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Distribución de Presupuesto</h3>
              </div>
              <BudgetDistribution distribucion={result.diagnostico.distribucion_presupuesto} />
            </Card>

            {/* Presupuestos Sugeridos */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Presupuestos Sugeridos</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-1">Mínimo Viable</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(result.diagnostico.presupuesto_sugerido.minimo_viable / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl text-center border-2 border-indigo-200">
                  <p className="text-sm text-indigo-600 mb-1 font-semibold">Óptimo</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${(result.diagnostico.presupuesto_sugerido.optimo / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-1">Máximo Eficiente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(result.diagnostico.presupuesto_sugerido.maximo_eficiente / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </Card>

            {/* Advertencias */}
            {result.diagnostico.advertencias.length > 0 && (
              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Consideraciones</h3>
                </div>

                <div className="space-y-4">
                  {result.diagnostico.advertencias.map((adv: any, idx: number) => (
                    <DiagnosticCard
                      key={idx}
                      type={adv.tipo === 'CRITICA' ? 'error' : adv.tipo === 'IMPORTANTE' ? 'warning' : 'info'}
                      title={adv.mensaje}
                      content={adv.accion_recomendada}
                      icon={adv.tipo === 'CRITICA' ? AlertTriangle : adv.tipo === 'IMPORTANTE' ? AlertCircle : Lightbulb}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Siguiente Paso */}
            <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 border-0">
              <div className="flex items-start gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ChevronRight className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Siguiente Paso</h3>
                  <p className="text-lg opacity-90">{result.diagnostico.siguiente_paso}</p>
                </div>
              </div>
            </Card>

            {/* Predicción Numérica (si hay) */}
            {result.prediccion && (
              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Predicción Numérica (Escenario Base)</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">Conversiones/Mes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {result.prediccion.metricas.conversiones_mensuales}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      ${(result.prediccion.metricas.revenue_mensual / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">ROAS</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {result.prediccion.metricas.roas_esperado.toFixed(1)}x
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">CPA</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${(result.prediccion.metricas.cpa_promedio / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Proyección 6 Meses - Gráfico */}
            {result.prediccion?.proyeccion_6_meses && (
              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Proyección a 6 Meses</h3>
                    <p className="text-sm text-gray-500">Curva de maduración típica de campañas</p>
                  </div>
                </div>
                <ProjectionLineChart data={result.prediccion.proyeccion_6_meses} height={180} />
              </Card>
            )}

            {/* Benchmark ROAS vs Industria */}
            {result.industry_insights?.benchmarks?.roas && result.prediccion && (
              <div className="grid md:grid-cols-2 gap-6">
                <BenchmarkGauge
                  userValue={result.prediccion.metricas.roas_esperado}
                  benchmarkMin={result.industry_insights.benchmarks.roas.min}
                  benchmarkAvg={result.industry_insights.benchmarks.roas.promedio}
                  benchmarkTop={result.industry_insights.benchmarks.roas.top}
                  label="Tu ROAS vs Industria"
                  suffix="x"
                />
                <BenchmarkGauge
                  userValue={result.prediccion.metricas.cpa_promedio / 1000}
                  benchmarkMin={result.industry_insights.benchmarks.cpl.min / 1000}
                  benchmarkAvg={result.industry_insights.benchmarks.cpl.promedio / 1000}
                  benchmarkTop={result.industry_insights.benchmarks.cpl.max / 1000}
                  label="Tu CPA vs Industria"
                  suffix="k"
                />
              </div>
            )}

            {/* Distribución de Presupuesto - Pie Chart Interactivo */}
            {result.diagnostico?.distribucion_presupuesto && (
              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Distribución de Presupuesto</h3>
                </div>
                <InteractivePieChart data={result.diagnostico.distribucion_presupuesto} />
              </Card>
            )}

            {/* Simulador What If */}
            {result.prediccion && (
              <WhatIfSimulator
                baseResult={result}
                baseInput={{
                  ...formData,
                  presupuesto_mensual: parseInt(formData.presupuesto_mensual),
                  ticket_promedio: parseInt(formData.ticket_promedio)
                }}
                onRecalculate={() => {}}
              />
            )}

            {/* Calculadora Inversa */}
            {result.industry_insights && (
              <InverseCalculator
                industryData={result.industry_insights}
                currentResult={result}
              />
            )}

            {/* CTA Pro - Asesoría */}
            <CTACardPro variant="default" />

            {/* Industry Insights */}
            {result.industry_insights && (
              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">{result.industry_insights.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Insights para {result.industry_insights.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">Benchmarks y tips específicos de tu industria</p>
                  </div>
                </div>

                {/* Benchmarks */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-sm text-emerald-600 font-semibold mb-2">Benchmark ROAS</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Mín</p>
                        <p className="text-lg font-bold text-gray-700">{result.industry_insights.benchmarks.roas.min}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Promedio</p>
                        <p className="text-xl font-bold text-emerald-600">{result.industry_insights.benchmarks.roas.promedio}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Top 10%</p>
                        <p className="text-lg font-bold text-gray-700">{result.industry_insights.benchmarks.roas.top}x</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <p className="text-sm text-indigo-600 font-semibold mb-2">Benchmark CPL</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Mín</p>
                        <p className="text-lg font-bold text-gray-700">${(result.industry_insights.benchmarks.cpl.min / 1000).toFixed(0)}k</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Promedio</p>
                        <p className="text-xl font-bold text-indigo-600">${(result.industry_insights.benchmarks.cpl.promedio / 1000).toFixed(0)}k</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Máx</p>
                        <p className="text-lg font-bold text-gray-700">${(result.industry_insights.benchmarks.cpl.max / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips de Expertos */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Tips de Expertos
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {result.industry_insights.tips_expertos.map((tip: string, idx: number) => (
                      <div key={idx} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Errores Comunes */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Errores Comunes a Evitar
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {result.industry_insights.errores_comunes.map((error: string, idx: number) => (
                      <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-700">{error}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Adicional */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Estacionalidad</p>
                    <p className="text-sm text-gray-700 font-medium">{result.industry_insights.estacionalidad}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Ciclo de Venta Típico</p>
                    <p className="text-sm text-gray-700 font-medium">{result.industry_insights.ciclo_venta_tipico}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">KPIs Clave</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.industry_insights.kpis_clave.map((kpi: string, idx: number) => (
                        <Badge key={idx} className="bg-gray-200 text-gray-700 text-xs">{kpi}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Acciones Rápidas */}
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Guarda tu Diagnóstico</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowEmailModal(true)}
                  className="h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Recibir por Email
                </Button>

                <Button
                  onClick={handleCopyResults}
                  variant="outline"
                  className="h-11 rounded-xl"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-emerald-600" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Resumen
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleShareResults}
                  variant="outline"
                  className="h-11 rounded-xl"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </Card>

            {/* CTA Final - Múltiples Opciones */}
            <Card className="p-6 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Listo para empezar?</h3>
                <p className="text-gray-600">Elige cómo quieres continuar</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Opción 1: WhatsApp */}
                <a
                  href="https://wa.me/56992258137?text=Hola%2C%20hice%20el%20diagn%C3%B3stico%20del%20Predictor%20y%20me%20gustar%C3%ADa%20una%20asesor%C3%ADa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="font-bold">WhatsApp</span>
                  <span className="text-xs text-emerald-100">Respuesta inmediata</span>
                </a>

                {/* Opción 2: Agendar Llamada */}
                <a
                  href="https://wa.me/56992258137?text=Hola%2C%20quiero%20agendar%20una%20llamada%20para%20revisar%20mi%20diagn%C3%B3stico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="font-bold">Agendar Llamada</span>
                  <span className="text-xs text-indigo-100">30 min gratis</span>
                </a>

                {/* Opción 3: Ver Planes */}
                <a
                  href="/planes"
                  className="flex flex-col items-center gap-3 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <span className="font-bold">Ver Planes</span>
                  <span className="text-xs text-purple-100">Desde $490k/mes</span>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200 flex justify-center">
                <Button variant="ghost" onClick={handleNuevoAnalisis} className="text-gray-600">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Hacer Nuevo Análisis
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Email Modal */}
        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          loading={emailLoading}
        />

      </main>

      {/* Metodología */}
      <section className="border-t border-gray-200 mt-16 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <Badge className="bg-gray-100 text-gray-700 mb-3">Metodología M&P 2025</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo calculamos las proyecciones?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro motor combina datos reales del mercado chileno con modelos predictivos validados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-5 border-2 border-gray-200 bg-white">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Data de Mercado</h3>
              <p className="text-sm text-gray-600">
                CPCs calibrados con datos reales de Google Ads Chile 2024. Actualizamos los benchmarks mensualmente con campañas activas.
              </p>
            </Card>

            <Card className="p-5 border-2 border-gray-200 bg-white">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Modelo Consultivo</h3>
              <p className="text-sm text-gray-600">
                Evaluamos viabilidad económica antes de proyectar. Si el ROAS esperado es menor a 1x, te alertamos para que no pierdas dinero.
              </p>
            </Card>

            <Card className="p-5 border-2 border-gray-200 bg-white">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Insights por Industria</h3>
              <p className="text-sm text-gray-600">
                12 industrias con benchmarks específicos, tips de expertos y errores comunes. Basado en +500 campañas gestionadas.
              </p>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-white rounded-xl border-2 border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <strong>Fuentes:</strong> Google Ads Keyword Planner Chile 2024 • Meta Business Suite • Data propietaria M&P de +500 campañas • Benchmarks WordStream/SEMrush adaptados al mercado chileno
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">v2.1</Badge>
              <span>Motor Consultivo M&P 2025</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/labs" className="hover:text-indigo-600 transition-colors">
                M&P Labs
              </a>
              <span className="text-gray-300">|</span>
              <a href="/" className="hover:text-indigo-600 transition-colors">
                Inicio
              </a>
              <span className="text-gray-300">|</span>
              <a href="https://wa.me/56992258137" className="hover:text-indigo-600 transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
