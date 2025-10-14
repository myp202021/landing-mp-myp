'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database, Users, CheckCircle2, Share2 } from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'
import toast, { Toaster } from 'react-hot-toast'
import type {
  CampaignMetric,
  Industry,
  Channel,
  Region,
  CompanySize,
  Benchmark,
} from '@/lib/types/intelligence'
import {
  INDUSTRY_LABELS as INDUSTRIES,
  CHANNEL_LABELS as CHANNELS,
  REGION_LABELS as REGIONS,
  COMPANY_SIZE_LABELS as COMPANY_SIZES
} from '@/lib/types/intelligence'
import { calculateQuartiles, getValuePercentile, getUserPosition } from '@/lib/utils/percentiles'
import { MetricTooltip } from '@/components/ui/Tooltip'
import LoadingState, { FormSkeleton } from '@/components/intelligence/LoadingState'
import EmptyState, { InitialState } from '@/components/intelligence/EmptyState'
import ErrorState, { FieldError } from '@/components/intelligence/ErrorState'
import BenchmarkResults from '@/components/intelligence/BenchmarkResults'
import { getReferenceBenchmark, shouldUseReferences, getDataQualityLabel } from '@/lib/reference-benchmarks'

// Validaciones de rangos razonables (basado en mercado chileno)
const VALIDATIONS = {
  budget: { min: 50000, max: 50000000 },
  revenue: { min: 0, max: 500000000 },
  roas: { min: 0.05, max: 50 },
  cac: { min: 100, max: 5000000 },
  conversion_rate: { min: 0.05, max: 80 },
  leads: { min: 1, max: 100000 },
  sales: { min: 1, max: 50000 }
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
  const [isLoadingBenchmark, setIsLoadingBenchmark] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
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
    try {
      const response = await fetch('/api/intelligence/count')
      const result = await response.json()

      if (response.ok && result.count) {
        setTotalContributions(result.count)
      }
    } catch (error) {
      console.error('Error al cargar total de contribuciones:', error)
    }
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

  const validateMetrics = (): Record<string, string> => {
    const errors: Record<string, string> = {}
    const budget = parseFloat(budgetMonthly)
    const rev = parseFloat(revenue)
    const sales = parseFloat(salesGenerated || '0')
    const leads = parseFloat(leadsGenerated || '0')
    const { cac, roas, conversionRate } = calcularMetricas()

    if (budget < VALIDATIONS.budget.min || budget > VALIDATIONS.budget.max) {
      errors.budgetMonthly = `Presupuesto debe estar entre ${formatCLP(VALIDATIONS.budget.min)} y ${formatCLP(VALIDATIONS.budget.max)}`
    }

    if (rev < VALIDATIONS.revenue.min || rev > VALIDATIONS.revenue.max) {
      errors.revenue = `Ingresos no pueden superar ${formatCLP(VALIDATIONS.revenue.max)}`
    }

    if (roas < VALIDATIONS.roas.min || roas > VALIDATIONS.roas.max) {
      errors.roas = `ROAS de ${roas.toFixed(2)}x parece inusual (rango típico: ${VALIDATIONS.roas.min}x - ${VALIDATIONS.roas.max}x)`
    }

    if (cac && (cac < VALIDATIONS.cac.min || cac > VALIDATIONS.cac.max)) {
      errors.cac = `CAC de ${formatCLP(cac)} está fuera del rango típico`
    }

    if (conversionRate && (conversionRate < VALIDATIONS.conversion_rate.min || conversionRate > VALIDATIONS.conversion_rate.max)) {
      errors.conversionRate = `Conversión de ${conversionRate.toFixed(1)}% parece inusual`
    }

    if (leads > 0 && (leads < VALIDATIONS.leads.min || leads > VALIDATIONS.leads.max)) {
      errors.leadsGenerated = `Leads debe estar entre ${VALIDATIONS.leads.min} y ${VALIDATIONS.leads.max.toLocaleString()}`
    }

    if (sales > 0 && (sales < VALIDATIONS.sales.min || sales > VALIDATIONS.sales.max)) {
      errors.salesGenerated = `Ventas debe estar entre ${VALIDATIONS.sales.min} y ${VALIDATIONS.sales.max.toLocaleString()}`
    }

    return errors
  }

  const enviarMetricas = async () => {
    if (!puedeEnviar) return

    setIsSubmitting(true)
    setFieldErrors({})
    setSubmitSuccess(false)

    try {
      // Validar
      const errors = validateMetrics()
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        toast.error('Por favor corrige los errores en el formulario')
        setIsSubmitting(false)
        return
      }

      const { cac, roas, conversionRate } = calcularMetricas()

      // Construir payload para API
      const payload = {
        industry,
        channel,
        budget_monthly: parseInt(budgetMonthly),
        revenue: parseInt(revenue),
        anonymous_user_id: getAnonymousUserId(),
        roas,
        leads_generated: leadsGenerated ? parseInt(leadsGenerated) : undefined,
        sales_generated: salesGenerated ? parseInt(salesGenerated) : undefined,
        cac,
        conversion_rate: conversionRate,
        region: region || undefined,
        company_size: companySize || undefined
      }

      console.log('📤 Enviando métricas a API:', JSON.stringify(payload, null, 2))

      // Llamar al API route en lugar de Supabase directamente
      const response = await fetch('/api/intelligence/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Error del servidor:', result)
        throw new Error(result.error || 'Error al guardar métricas')
      }

      console.log('✅ Métricas guardadas:', result)

      setSubmitSuccess(true)
      toast.success('¡Datos compartidos exitosamente! 🎉')

      await obtenerBenchmark()
      await cargarTotalContribuciones()

    } catch (error: any) {
      console.error('Error al enviar métricas:', error)
      toast.error(error?.message || 'Error al enviar datos. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const obtenerBenchmark = async () => {
    if (!industry || !channel) return

    setIsLoadingBenchmark(true)

    try {
      // 1. Obtener datos reales de la comunidad
      const response = await fetch(
        `/api/intelligence/benchmark?industry=${industry}&channel=${channel}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Error del servidor:', result)
        throw new Error(result.error || 'Error al cargar benchmark')
      }

      const realData = result.data || []
      const totalSamples = realData.length

      console.log(`📊 Muestras reales encontradas: ${totalSamples}`)

      // 2. Decidir si usar referencias o datos reales
      const useReferences = shouldUseReferences(totalSamples)
      const referenceBenchmark = getReferenceBenchmark(industry as Industry, channel as Channel)

      console.log(`🎯 Usar referencias: ${useReferences}, Tiene referencias: ${!!referenceBenchmark}`)

      // 3. Si no hay datos ni referencias, mostrar null
      if (useReferences && !referenceBenchmark) {
        console.log('⚠️ Sin datos reales ni referencias disponibles')
        setBenchmark(null)
        return
      }

      // 4. Calcular métricas
      let avgBudget = 0
      let avgRevenue = 0
      let avgCAC = 0
      let avgROAS = 0
      let avgConversionRate = 0
      let percentiles: any = {}

      if (useReferences && referenceBenchmark) {
        // USAR REFERENCIAS (<10 muestras)
        console.log(`📚 Usando referencias (solo ${totalSamples} muestras)`)
        avgCAC = referenceBenchmark.cac.median
        avgROAS = referenceBenchmark.roas.median
        avgConversionRate = referenceBenchmark.conversion.median
        percentiles = {
          budget: { p25: 0, median: 0, p75: 0 },
          revenue: { p25: 0, median: 0, p75: 0 },
          cac: referenceBenchmark.cac,
          roas: referenceBenchmark.roas,
          conversion: referenceBenchmark.conversion,
        }
      } else {
        // USAR DATOS REALES (10+ muestras)
        console.log(`✅ Usando datos reales (${totalSamples} muestras)`)
        avgBudget = calculateQuartiles(realData.map(m => m.budget_monthly)).median
        avgRevenue = calculateQuartiles(realData.map(m => m.revenue)).median

        const cacValues = realData.filter(m => m.cac).map(m => m.cac!)
        avgCAC = cacValues.length > 0 ? calculateQuartiles(cacValues).median : 0

        const roasValues = realData.filter(m => m.roas).map(m => m.roas!)
        avgROAS = roasValues.length > 0 ? calculateQuartiles(roasValues).median : 0

        const conversionValues = realData.filter(m => m.conversion_rate).map(m => m.conversion_rate!)
        avgConversionRate = conversionValues.length > 0 ? calculateQuartiles(conversionValues).median : 0

        percentiles = {
          budget: calculateQuartiles(realData.map(m => m.budget_monthly)),
          revenue: calculateQuartiles(realData.map(m => m.revenue)),
          cac: cacValues.length > 0 ? calculateQuartiles(cacValues) : { p25: 0, median: 0, p75: 0 },
          roas: roasValues.length > 0 ? calculateQuartiles(roasValues) : { p25: 0, median: 0, p75: 0 },
          conversion: conversionValues.length > 0 ? calculateQuartiles(conversionValues) : { p25: 0, median: 0, p75: 0 },
        }
      }

      // 5. Calcular percentiles del usuario (contra referencias o data real, según corresponda)
      const userMetrics = calcularMetricas()

      const roasForComparison = useReferences && referenceBenchmark
        ? [referenceBenchmark.roas.p25, referenceBenchmark.roas.median, referenceBenchmark.roas.p75]
        : realData.filter(m => m.roas).map(m => m.roas!)

      const userROASPercentile = roasForComparison.length > 0
        ? getValuePercentile(userMetrics.roas, roasForComparison)
        : 50

      const cacForComparison = useReferences && referenceBenchmark
        ? [referenceBenchmark.cac.p25, referenceBenchmark.cac.median, referenceBenchmark.cac.p75]
        : realData.filter(m => m.cac).map(m => m.cac!)

      const userCACPercentile = userMetrics.cac && cacForComparison.length > 0
        ? 100 - getValuePercentile(userMetrics.cac, cacForComparison)
        : 50

      const conversionForComparison = useReferences && referenceBenchmark
        ? [referenceBenchmark.conversion.p25, referenceBenchmark.conversion.median, referenceBenchmark.conversion.p75]
        : realData.filter(m => m.conversion_rate).map(m => m.conversion_rate!)

      const userConversionPercentile = userMetrics.conversionRate && conversionForComparison.length > 0
        ? getValuePercentile(userMetrics.conversionRate, conversionForComparison)
        : 50

      const userPos = getUserPosition(userROASPercentile)

      // 6. Construir benchmark final
      setBenchmark({
        industry: industry as Industry,
        channel: channel as Channel,
        avgBudget,
        avgRevenue,
        avgCAC,
        avgROAS,
        avgConversionRate,
        totalSamples,
        userPosition: userPos,
        percentiles,
        userPercentiles: {
          roas: userROASPercentile,
          cac: userCACPercentile,
          conversion: userConversionPercentile,
        },
        dataQuality: useReferences ? 'REFERENCE' : 'HIGH',
        isHybrid: false,
        isReference: useReferences
      })

      console.log('✅ Benchmark calculado:', { useReferences, totalSamples, avgROAS, avgCAC })

    } catch (error) {
      console.error('Error al obtener benchmark:', error)
      toast.error('Error al cargar benchmarks')
    } finally {
      setIsLoadingBenchmark(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText('https://www.mulleryperez.cl/labs/mp-intelligence')
    toast.success('¡Link copiado! Compártelo con tu red 🎉')
  }

  return (
    <>
      <Toaster position="top-right" />
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
              <span className="text-emerald-200 text-sm font-semibold">🌐 Red Colaborativa · 100% Anónimo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              La primera red colaborativa de<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                benchmarks de marketing en Chile
              </span>
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-4 leading-relaxed">
              <strong>¿Estás invirtiendo bien en publicidad?</strong> Descúbrelo comparando tus métricas con las de tu industria.<br />
              Comparte tus datos anónimamente y accede a benchmarks reales que nadie más publica.
            </p>

            {/* Value Prop Bullets */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Datos reales, no inventados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>100% anónimo y seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Instantáneo y gratis</span>
              </div>
            </div>

            {/* Stats */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
              <Users className="w-5 h-5 text-emerald-300" />
              <span className="text-lg font-bold text-white">{totalContributions}+ empresas</span>
              <span className="text-emerald-200">ya forman parte de la red</span>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Presupuesto mensual (CLP) *
                  <MetricTooltip metric="budget" />
                </label>
                <input
                  type="text"
                  value={budgetMonthly}
                  onChange={(e) => setBudgetMonthly(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.budgetMonthly ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 500000"
                />
                {fieldErrors.budgetMonthly && <FieldError message={fieldErrors.budgetMonthly} />}
              </div>

              {/* Ingresos */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Ingresos generados mensuales (CLP) *
                  <MetricTooltip metric="revenue" />
                </label>
                <input
                  type="text"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.revenue ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 2000000"
                />
                {fieldErrors.revenue && <FieldError message={fieldErrors.revenue} />}
              </div>

              {/* Leads (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leads generados del mes (opcional)
                </label>
                <input
                  type="text"
                  value={leadsGenerated}
                  onChange={(e) => setLeadsGenerated(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.leadsGenerated ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 100"
                />
                {fieldErrors.leadsGenerated && <FieldError message={fieldErrors.leadsGenerated} />}
              </div>

              {/* Ventas (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ventas cerradas del mes (opcional)
                </label>
                <input
                  type="text"
                  value={salesGenerated}
                  onChange={(e) => setSalesGenerated(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.salesGenerated ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 25"
                />
                {fieldErrors.salesGenerated && <FieldError message={fieldErrors.salesGenerated} />}
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

              {/* Nota de privacidad */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 text-center mb-2">
                  <strong>🔒 Garantía de privacidad total</strong>
                </p>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  No guardamos emails, nombres ni datos de contacto. Solo métricas agregadas.
                  Tu información se mezcla con la de otras empresas para calcular promedios.
                  <strong className="text-gray-800"> Imposible identificarte.</strong>
                </p>
              </div>
            </div>

            {/* Panel Benchmark */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              {isLoadingBenchmark ? (
                <LoadingState />
              ) : !benchmark ? (
                <div className="h-full flex items-center justify-center min-h-[400px]">
                  <InitialState />
                </div>
              ) : (
                <BenchmarkResults
                  benchmark={benchmark}
                  userMetrics={{
                    budget: parseFloat(budgetMonthly),
                    revenue: parseFloat(revenue),
                    ...calcularMetricas(),
                    leads: leadsGenerated ? parseFloat(leadsGenerated) : undefined,
                    sales: salesGenerated ? parseFloat(salesGenerated) : undefined,
                  }}
                  totalContributions={totalContributions}
                  onShare={handleShare}
                />
              )}
            </div>
          </div>

          {/* Info sections remain the same... */}
          <div className="mt-12 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">¿Qué obtienes al compartir tus métricas?</h3>
            <p className="text-emerald-200 text-center mb-8 max-w-2xl mx-auto">
              Acceso instantáneo a datos que normalmente cuestan miles de dólares o simplemente no existen para Chile
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Benchmarks con percentiles</h4>
                  <p className="text-sm text-emerald-100">Ve dónde estás en top 25%, mediana o top 75%</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Insights automáticos</h4>
                  <p className="text-sm text-emerald-100">Recomendaciones accionables basadas en tus métricas</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Tu posición visual</h4>
                  <p className="text-sm text-emerald-100">Percentile rings animados que muestran tu ranking</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Badges y logros</h4>
                  <p className="text-sm text-emerald-100">Gamificación por contribuir a la comunidad</p>
                </div>
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
