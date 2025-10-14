'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database, TrendingUp, Users, AlertCircle, CheckCircle2, BarChart3, Share2 } from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'
import { supabase } from '@/lib/supabase'
import type {
  CampaignMetric,
  Industry,
  Channel,
  Region,
  CompanySize,
  Benchmark,
  INDUSTRY_LABELS,
  CHANNEL_LABELS,
  REGION_LABELS,
  COMPANY_SIZE_LABELS
} from '@/lib/types/intelligence'
import {
  INDUSTRY_LABELS as INDUSTRIES,
  CHANNEL_LABELS as CHANNELS,
  REGION_LABELS as REGIONS,
  COMPANY_SIZE_LABELS as COMPANY_SIZES
} from '@/lib/types/intelligence'

// Validaciones de rangos razonables (basado en mercado chileno)
const VALIDATIONS = {
  budget: { min: 50000, max: 50000000 },        // $50k - $50M
  revenue: { min: 0, max: 500000000 },          // $0 - $500M
  roas: { min: 0.1, max: 20 },                  // 0.1x - 20x
  cac: { min: 500, max: 1000000 },              // $500 - $1M
  conversion_rate: { min: 0.1, max: 50 },       // 0.1% - 50%
  leads: { min: 1, max: 100000 },               // 1 - 100k leads
  sales: { min: 1, max: 50000 }                 // 1 - 50k sales
}

// Función para calcular mediana (resistente a outliers)
const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

// Generar ID anónimo único por navegador
const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return 'server'

  let userId = localStorage.getItem('mp_intelligence_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('mp_intelligence_user_id', userId)
  }
  return userId
}

export default function MPIntelligenceClient() {

  const intelligenceSchema = createSoftwareAppSchema(
    'M&P Intelligence - Red Colaborativa de Datos de Marketing Chile',
    'Plataforma colaborativa para compartir métricas de marketing en Chile. Ingresa tus datos anónimamente y recibe benchmarks reales de tu industria. Compara CAC, ROAS, conversión y más.',
    'https://www.mulleryperez.cl/labs/mp-intelligence'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'M&P Labs', url: 'https://www.mulleryperez.cl/labs' },
    { name: 'M&P Intelligence', url: 'https://www.mulleryperez.cl/labs/mp-intelligence' }
  ])

  // Estados del formulario
  const [industry, setIndustry] = useState<Industry | ''>('')
  const [channel, setChannel] = useState<Channel | ''>('')
  const [budgetMonthly, setBudgetMonthly] = useState('')
  const [revenue, setRevenue] = useState('')
  const [leadsGenerated, setLeadsGenerated] = useState('')
  const [salesGenerated, setSalesGenerated] = useState('')
  const [region, setRegion] = useState<Region | ''>('')
  const [companySize, setCompanySize] = useState<CompanySize | ''>('')

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null)
  const [totalContributions, setTotalContributions] = useState(0)
  const [puedeEnviar, setPuedeEnviar] = useState(false)

  useEffect(() => {
    verificarFormulario()
    cargarTotalContribuciones()
  }, [industry, channel, budgetMonthly, revenue])

  const verificarFormulario = () => {
    const camposRequeridos = industry && channel && budgetMonthly && revenue
    setPuedeEnviar(!!camposRequeridos)
  }

  const cargarTotalContribuciones = async () => {
    const { count } = await supabase
      .from('campaign_metrics')
      .select('*', { count: 'exact', head: true })

    if (count) setTotalContributions(count)
  }

  const formatCLP = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('es-CL')
  }

  const calcularMetricas = () => {
    const budget = parseFloat(budgetMonthly)
    const rev = parseFloat(revenue)
    const sales = parseFloat(salesGenerated || '0')
    const leads = parseFloat(leadsGenerated || '0')

    const roas = rev / budget
    const cac = sales > 0 ? budget / sales : undefined
    const conversionRate = leads > 0 && sales > 0 ? (sales / leads) * 100 : undefined

    return { cac, roas, conversionRate }
  }

  const validateMetrics = () => {
    const budget = parseFloat(budgetMonthly)
    const rev = parseFloat(revenue)
    const sales = parseFloat(salesGenerated || '0')
    const leads = parseFloat(leadsGenerated || '0')
    const { cac, roas, conversionRate } = calcularMetricas()

    // Validar presupuesto
    if (budget < VALIDATIONS.budget.min || budget > VALIDATIONS.budget.max) {
      return `Presupuesto debe estar entre ${formatCLP(VALIDATIONS.budget.min)} y ${formatCLP(VALIDATIONS.budget.max)}`
    }

    // Validar revenue
    if (rev < VALIDATIONS.revenue.min || rev > VALIDATIONS.revenue.max) {
      return `Ingresos debe estar entre $0 y ${formatCLP(VALIDATIONS.revenue.max)}`
    }

    // Validar ROAS
    if (roas < VALIDATIONS.roas.min || roas > VALIDATIONS.roas.max) {
      return `ROAS fuera de rango razonable (${VALIDATIONS.roas.min}x - ${VALIDATIONS.roas.max}x). Tu ROAS calculado es ${roas.toFixed(2)}x. Verifica tus datos.`
    }

    // Validar CAC si existe
    if (cac && (cac < VALIDATIONS.cac.min || cac > VALIDATIONS.cac.max)) {
      return `CAC fuera de rango razonable (${formatCLP(VALIDATIONS.cac.min)} - ${formatCLP(VALIDATIONS.cac.max)}). Tu CAC calculado es ${formatCLP(cac)}. Verifica tus datos.`
    }

    // Validar conversion rate si existe
    if (conversionRate && (conversionRate < VALIDATIONS.conversion_rate.min || conversionRate > VALIDATIONS.conversion_rate.max)) {
      return `Tasa de conversión fuera de rango razonable (${VALIDATIONS.conversion_rate.min}% - ${VALIDATIONS.conversion_rate.max}%). Tu tasa calculada es ${conversionRate.toFixed(1)}%. Verifica tus datos.`
    }

    // Validar leads si existe
    if (leads > 0 && (leads < VALIDATIONS.leads.min || leads > VALIDATIONS.leads.max)) {
      return `Leads fuera de rango razonable (${VALIDATIONS.leads.min} - ${VALIDATIONS.leads.max.toLocaleString()})`
    }

    // Validar sales si existe
    if (sales > 0 && (sales < VALIDATIONS.sales.min || sales > VALIDATIONS.sales.max)) {
      return `Ventas fuera de rango razonable (${VALIDATIONS.sales.min} - ${VALIDATIONS.sales.max.toLocaleString()})`
    }

    return null // Sin errores
  }

  const enviarMetricas = async () => {
    if (!puedeEnviar) return

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      // Validar antes de enviar
      const validationError = validateMetrics()
      if (validationError) {
        setSubmitError(validationError)
        setIsSubmitting(false)
        return
      }

      const { cac, roas, conversionRate } = calcularMetricas()

      const metric: CampaignMetric = {
        industry: industry as Industry,
        channel: channel as Channel,
        budget_monthly: parseInt(budgetMonthly),
        revenue: parseInt(revenue),
        leads_generated: leadsGenerated ? parseInt(leadsGenerated) : undefined,
        sales_generated: salesGenerated ? parseInt(salesGenerated) : undefined,
        cac,
        roas,
        conversion_rate: conversionRate,
        region: region as Region || undefined,
        company_size: companySize as CompanySize || undefined,
        anonymous_user_id: getAnonymousUserId()
      }

      const { error } = await supabase
        .from('campaign_metrics')
        .insert([metric])

      if (error) throw error

      setSubmitSuccess(true)
      await obtenerBenchmark()
      await cargarTotalContribuciones()

    } catch (error) {
      console.error('Error al enviar métricas:', error)
      setSubmitError('Hubo un error al enviar tus datos. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const obtenerBenchmark = async () => {
    if (!industry || !channel) return

    try {
      const { data, error } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('industry', industry)
        .eq('channel', channel)

      if (error) throw error

      if (data && data.length > 0) {
        // Usar MEDIANA en vez de promedio (resistente a outliers)
        const avgBudget = calculateMedian(data.map(m => m.budget_monthly))
        const avgRevenue = calculateMedian(data.map(m => m.revenue))
        const avgCAC = calculateMedian(data.filter(m => m.cac).map(m => m.cac || 0))
        const avgROAS = calculateMedian(data.filter(m => m.roas).map(m => m.roas || 0))
        const avgConversionRate = calculateMedian(data.filter(m => m.conversion_rate).map(m => m.conversion_rate || 0))

        // Determinar posición del usuario
        const userROAS = calcularMetricas().roas
        const sortedROAS = data.map(m => m.roas).filter(r => r).sort((a, b) => (b || 0) - (a || 0))
        const userPosition = sortedROAS.findIndex(r => r && r <= userROAS)
        const percentile = (userPosition / sortedROAS.length) * 100

        let userPos: 'TOP_10' | 'ABOVE_AVG' | 'AVERAGE' | 'BELOW_AVG' | 'BOTTOM_10'
        if (percentile <= 10) userPos = 'TOP_10'
        else if (percentile <= 40) userPos = 'ABOVE_AVG'
        else if (percentile <= 60) userPos = 'AVERAGE'
        else if (percentile <= 90) userPos = 'BELOW_AVG'
        else userPos = 'BOTTOM_10'

        setBenchmark({
          industry: industry as Industry,
          channel: channel as Channel,
          avgBudget,
          avgRevenue,
          avgCAC,
          avgROAS,
          avgConversionRate,
          totalSamples: data.length,
          userPosition: userPos
        })
      }

    } catch (error) {
      console.error('Error al obtener benchmark:', error)
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(intelligenceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/logo-blanco.png" alt="M&P Logo" width={120} height={32} className="h-8 w-auto" />
            </Link>
            <Link href="/labs" className="text-white font-semibold text-sm hover:text-emerald-300 transition-colors">
              ← Volver
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-sm">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-200 text-sm font-semibold">Red Colaborativa</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              M&P Intelligence<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Benchmarks Reales de Chile
              </span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-6">
              Comparte tus métricas anónimamente y recibe benchmarks reales de tu industria
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-emerald-300">
              <Users className="w-5 h-5" />
              <span className="text-lg font-semibold">{totalContributions} empresas ya contribuyeron</span>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Panel Formulario */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Comparte tus métricas
              </h3>

              {/* Industria */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industria *
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona tu industria</option>
                  {Object.entries(INDUSTRIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Canal */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Canal publicitario *
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as Channel)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona el canal</option>
                  {Object.entries(CHANNELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Presupuesto */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Presupuesto mensual (CLP) *
                </label>
                <input
                  type="text"
                  value={budgetMonthly}
                  onChange={(e) => setBudgetMonthly(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 500000"
                />
              </div>

              {/* Ingresos */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingresos generados (CLP) *
                </label>
                <input
                  type="text"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 2000000"
                />
              </div>

              {/* Leads (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leads generados (opcional)
                </label>
                <input
                  type="text"
                  value={leadsGenerated}
                  onChange={(e) => setLeadsGenerated(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 100"
                />
              </div>

              {/* Ventas (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ventas cerradas (opcional)
                </label>
                <input
                  type="text"
                  value={salesGenerated}
                  onChange={(e) => setSalesGenerated(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 25"
                />
              </div>

              {/* Región (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Región (opcional)
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona región</option>
                  {Object.entries(REGIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Tamaño empresa (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tamaño de empresa (opcional)
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value as CompanySize)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona tamaño</option>
                  {Object.entries(COMPANY_SIZES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Botón Enviar */}
              <button
                onClick={enviarMetricas}
                disabled={!puedeEnviar || isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Compartir y Ver Benchmark'}
              </button>

              {/* Mensajes */}
              {submitSuccess && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800">
                    ¡Gracias por contribuir! Tus datos fueron agregados anónimamente a la red.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              {/* Nota de privacidad */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                🔒 Tus datos son completamente anónimos. No guardamos información personal.
              </p>
            </div>

            {/* Panel Benchmark */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              {!benchmark ? (
                <div className="h-full flex items-center justify-center text-center text-gray-500 min-h-[400px]">
                  <div>
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">Comparte tus métricas</p>
                    <p className="text-sm">para ver cómo te comparas con otras empresas de tu industria</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tu benchmark
                  </h3>

                  {/* Warning si pocos datos */}
                  {benchmark.totalSamples < 10 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-800 mb-1">Datos insuficientes</p>
                        <p className="text-yellow-700">
                          Solo {benchmark.totalSamples} {benchmark.totalSamples === 1 ? 'empresa ha' : 'empresas han'} compartido datos.
                          Los benchmarks serán más precisos con más contribuciones (idealmente 10+).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Posición */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700">Tu posición</h4>
                      {benchmark.userPosition === 'TOP_10' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {benchmark.userPosition === 'ABOVE_AVG' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {benchmark.userPosition === 'TOP_10' && 'Top 10%'}
                      {benchmark.userPosition === 'ABOVE_AVG' && 'Sobre el promedio'}
                      {benchmark.userPosition === 'AVERAGE' && 'Promedio'}
                      {benchmark.userPosition === 'BELOW_AVG' && 'Bajo el promedio'}
                      {benchmark.userPosition === 'BOTTOM_10' && 'Necesita mejorar'}
                    </div>
                    <p className="text-xs text-gray-600">
                      Basado en {benchmark.totalSamples} empresas de {INDUSTRIES[benchmark.industry]}
                    </p>
                  </div>

                  {/* Métricas */}
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Presupuesto promedio</p>
                      <p className="text-xl font-bold text-gray-900">{formatCLP(benchmark.avgBudget)}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Ingresos promedio</p>
                      <p className="text-xl font-bold text-gray-900">{formatCLP(benchmark.avgRevenue)}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">CAC promedio</p>
                      <p className="text-xl font-bold text-gray-900">
                        {benchmark.avgCAC ? formatCLP(benchmark.avgCAC) : 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">ROAS promedio</p>
                      <p className="text-xl font-bold text-gray-900">
                        {benchmark.avgROAS ? benchmark.avgROAS.toFixed(2) + 'x' : 'N/A'}
                      </p>
                    </div>

                    {benchmark.avgConversionRate && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Conversión promedio</p>
                        <p className="text-xl font-bold text-gray-900">
                          {benchmark.avgConversionRate.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      💡 Mientras más empresas compartan datos, más precisos serán los benchmarks.
                      Comparte este link con tu red!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cómo funciona */}
          <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">¿Cómo funciona M&P Intelligence?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">1. Compartes tus métricas</h4>
                <p className="text-purple-200 text-sm">
                  Ingresas datos reales de tus campañas de forma completamente anónima
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">2. Se agrega a la red</h4>
                <p className="text-purple-200 text-sm">
                  Tus datos se agregan al pool colaborativo de tu industria y canal
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">3. Recibes benchmarks</h4>
                <p className="text-purple-200 text-sm">
                  Obtienes promedios reales y ves cómo te comparas vs tu competencia
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-6 mt-12">
          <div className="max-w-7xl mx-auto text-center text-purple-300 text-sm">
            <p>© 2024 Muller y Pérez · M&P Intelligence · Datos reales, colaborativos y anónimos</p>
          </div>
        </footer>
      </div>
    </>
  )
}
