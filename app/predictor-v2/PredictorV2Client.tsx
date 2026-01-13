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

import React, { useState } from 'react'
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
  MessageSquare
} from 'lucide-react'

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
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PredictorV2Client() {
  const [step, setStep] = useState(1) // 1: Input, 2: Resultados
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
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
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">BETA</Badge>
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

            {/* CTA Final */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button variant="outline" onClick={handleNuevoAnalisis} className="h-12 px-6">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nuevo Análisis
              </Button>

              <a
                href="https://wa.me/56992258137?text=Hola%2C%20hice%20el%20diagn%C3%B3stico%20del%20Predictor%20y%20me%20gustar%C3%ADa%20conversar"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Conversemos por WhatsApp
              </a>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">v2.0.0 BETA</Badge>
              <span>Motor Consultivo M&P 2025</span>
            </div>
            <a href="/predictor" className="hover:text-indigo-600 transition-colors">
              Ir al Predictor Clásico →
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
