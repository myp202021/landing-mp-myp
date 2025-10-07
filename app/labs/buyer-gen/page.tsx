'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserCircle, ArrowRight, Download, MessageCircle, RefreshCw, ChevronDown } from 'lucide-react'
import { personasDatabase, BasePersona } from './personasData'
import { createSoftwareAppSchema } from '@/lib/metadata'

interface EnrichedPersona extends BasePersona {
  score: number
  channels: string[]
  keywords: string[]
  kpis: string[]
  contentStrategy: string[]
}

interface FormData {
  industry: string
  businessModel: string
  companySize: string
  mainGoal: string
  monthlyBudget: string
  ticketPromedio: string
  channels: string[]
  salesCycle: string
  decisionMakers: string
}

const avatars = ['👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🔬', '👩‍🎓', '🧑‍⚕️']

export default function BuyerGen() {
  useEffect(() => {
    document.title = 'Buyer Gen - Generador de Buyer Personas Gratis | M&P Labs'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Crea buyer personas basados en data intelligence en 4 pasos. Herramienta gratuita con estrategias de contenido y KPIs para empresas chilenas.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Crea buyer personas basados en data intelligence en 4 pasos. Herramienta gratuita con estrategias de contenido y KPIs para empresas chilenas.'
      document.head.appendChild(meta)
    }
  }, [])

  const buyerGenSchema = createSoftwareAppSchema(
    'Buyer Gen - Generador de Buyer Personas',
    'Herramienta gratuita para crear buyer personas detallados basados en data intelligence. Genera perfiles con motivaciones, puntos de dolor, canales recomendados, keywords y estrategias de contenido para tu negocio.',
    'https://agencia.mulleryperez.cl/labs/buyer-gen'
  )

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    businessModel: '',
    companySize: '',
    mainGoal: '',
    monthlyBudget: '',
    ticketPromedio: '',
    channels: [],
    salesCycle: '',
    decisionMakers: ''
  })
  const [personas, setPersonas] = useState<EnrichedPersona[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1:
        if (!formData.industry || !formData.businessModel || !formData.companySize) {
          alert('Por favor completa todos los campos del paso 1')
          return false
        }
        break
      case 2:
        if (!formData.mainGoal || !formData.monthlyBudget) {
          alert('Por favor completa todos los campos requeridos del paso 2')
          return false
        }
        break
      case 3:
        if (formData.channels.length === 0) {
          alert('Por favor selecciona al menos un canal de marketing')
          return false
        }
        break
      case 4:
        if (!formData.salesCycle || !formData.decisionMakers) {
          alert('Por favor completa todos los campos del paso 4')
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const calculateScore = (persona: BasePersona, data: FormData): number => {
    let score = 70

    if (data.monthlyBudget === 'premium' && persona.ingresos === 'Alto') score += 10
    if (data.monthlyBudget === 'alto' && persona.ingresos === 'Medio-alto') score += 8
    if (data.salesCycle === 'complejo' && data.businessModel === 'b2b') score += 10
    if (data.salesCycle === 'impulso' && data.businessModel === 'b2c') score += 10
    if (data.channels.includes('linkedin') && data.businessModel === 'b2b') score += 8
    if (data.channels.includes('meta_ads') && data.businessModel === 'b2c') score += 8
    if (data.channels.includes('tiktok') && persona.edad?.includes('18-25')) score += 10
    if (data.mainGoal === 'leads' && data.businessModel === 'b2b') score += 5
    if (data.mainGoal === 'ventas' && data.salesCycle === 'corto') score += 5

    return Math.min(100, score)
  }

  const getRecommendedChannels = (data: FormData): string[] => {
    const channels = []
    if (data.businessModel === 'b2b') {
      channels.push('LinkedIn Ads', 'Google Search', 'Email Marketing')
    } else {
      channels.push('Meta Ads (Instagram/Facebook)', 'Google Display', 'TikTok')
    }
    if (data.channels.includes('seo')) channels.push('SEO Orgánico')
    if (data.channels.includes('content')) channels.push('Content Marketing')
    return channels.slice(0, 4)
  }

  const getKeywords = (industry: string): string[] => {
    const keywords: { [key: string]: string[] } = {
      tecnologia: ['software', 'tecnología', 'digital', 'soluciones tech'],
      salud: ['salud', 'médico', 'clínica', 'tratamiento'],
      educacion: ['curso', 'capacitación', 'aprender', 'educación online'],
      finanzas: ['finanzas', 'inversión', 'préstamo', 'crédito'],
      retail: ['comprar', 'tienda', 'oferta', 'moda'],
      servicios: ['servicios', 'consultoría', 'asesoría', 'profesional']
    }
    return keywords[industry] || ['producto', 'servicio', 'comprar', 'contratar']
  }

  const getKPIs = (goal: string): string[] => {
    const kpis: { [key: string]: string[] } = {
      leads: ['CPL (Costo por Lead)', 'Tasa de Conversión Landing', 'Lead Quality Score'],
      ventas: ['ROAS (Return on Ad Spend)', 'CPA (Costo por Adquisición)', 'Tasa de Conversión'],
      awareness: ['Alcance', 'Impresiones', 'Engagement Rate'],
      default: ['CAC (Costo Adquisición Cliente)', 'LTV (Lifetime Value)', 'Tasa Retención']
    }
    return kpis[goal] || kpis.default
  }

  const getContentStrategy = (businessModel: string): string[] => {
    const strategies: { [key: string]: string[] } = {
      b2b: ['Whitepapers y estudios de caso', 'Webinars y demos', 'LinkedIn thought leadership', 'Email nurturing sequences'],
      b2c: ['Stories y reels en Instagram', 'Video contenido corto', 'UGC (User Generated Content)', 'Influencer partnerships'],
      b2b2c: ['Content híbrido B2B/B2C', 'Educational videos', 'Blog posts SEO-optimized', 'Social proof campaigns']
    }
    return strategies[businessModel] || strategies.b2c
  }

  const generatePersonas = () => {
    if (!validateStep(4)) return

    setLoading(true)
    setShowResults(false)

    setTimeout(() => {
      const basePersonas = personasDatabase[formData.businessModel]?.[formData.industry] || []

      const enrichedPersonas: EnrichedPersona[] = basePersonas.map(persona => ({
        ...persona,
        score: calculateScore(persona, formData),
        channels: getRecommendedChannels(formData),
        keywords: getKeywords(formData.industry),
        kpis: getKPIs(formData.mainGoal),
        contentStrategy: getContentStrategy(formData.businessModel)
      }))

      const sortedPersonas = enrichedPersonas.sort((a, b) => b.score - a.score).slice(0, 3)
      setPersonas(sortedPersonas)
      setLoading(false)
      setShowResults(true)

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 2000)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify({ formData, personas }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'buyer-personas-mp.json'
    link.click()
  }

  const contactWhatsApp = () => {
    const message = 'Hola! Acabo de generar mis buyer personas con Buyer Gen y me gustaría agendar una consultoría para optimizar mi estrategia de marketing 🚀'
    window.open(`https://wa.me/56992225813?text=${encodeURIComponent(message)}`, '_blank')
  }

  const resetTool = () => {
    if (confirm('¿Estás seguro de que quieres empezar de nuevo?')) {
      setCurrentStep(1)
      setFormData({
        industry: '',
        businessModel: '',
        companySize: '',
        mainGoal: '',
        monthlyBudget: '',
        ticketPromedio: '',
        channels: [],
        salesCycle: '',
        decisionMakers: ''
      })
      setPersonas([])
      setShowResults(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buyerGenSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/labs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all">
            ← Volver a M&P Labs
          </Link>
          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-900">Buyer Gen</h1>
            <p className="text-xs text-gray-600">Generador de Buyer Personas</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <UserCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Data Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descubre tus Buyer Personas<br />ideales en 4 pasos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Genera perfiles detallados de tus clientes ideales basados en data intelligence y mejores prácticas
          </p>
        </div>

        {!showResults && !loading && (
          <>
            {/* Progress */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[1, 2, 3, 4].map(num => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full transition-all ${
                    num === currentStep
                      ? 'bg-blue-600 scale-125 ring-4 ring-blue-200'
                      : num < currentStep
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 1: Información Básica</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🏭 Industria / Rubro</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona tu industria --</option>
                      <option value="tecnologia">Tecnología & Software</option>
                      <option value="salud">Salud & Medicina</option>
                      <option value="educacion">Educación & E-learning</option>
                      <option value="finanzas">Finanzas & Fintech</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="servicios">Servicios Profesionales</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🏢 Modelo de Negocio</label>
                    <select
                      value={formData.businessModel}
                      onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona tu modelo --</option>
                      <option value="b2c">B2C - Venta directa a consumidores</option>
                      <option value="b2b">B2B - Venta a otras empresas</option>
                      <option value="b2b2c">B2B2C - Híbrido (empresas y consumidores)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🏪 Tamaño de tu Empresa</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona el tamaño --</option>
                      <option value="startup">Startup (1-10 empleados)</option>
                      <option value="pequena">Pequeña (11-50 empleados)</option>
                      <option value="mediana">Mediana (51-200 empleados)</option>
                      <option value="grande">Grande (200+ empleados)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Continuar <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 2: Objetivos de Marketing</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 Objetivo Principal</label>
                    <select
                      value={formData.mainGoal}
                      onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona tu objetivo --</option>
                      <option value="leads">Generación de Leads</option>
                      <option value="ventas">Aumento de Ventas</option>
                      <option value="awareness">Brand Awareness</option>
                      <option value="conversion">Optimización de Conversión</option>
                      <option value="retention">Retención de Clientes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Presupuesto Mensual de Marketing (CLP)</label>
                    <select
                      value={formData.monthlyBudget}
                      onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona tu presupuesto --</option>
                      <option value="bajo">Hasta $500.000</option>
                      <option value="medio">$500.000 - $2.000.000</option>
                      <option value="alto">$2.000.000 - $5.000.000</option>
                      <option value="premium">Más de $5.000.000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">💵 Ticket Promedio de Venta (CLP)</label>
                    <input
                      type="number"
                      value={formData.ticketPromedio}
                      onChange={(e) => setFormData({ ...formData, ticketPromedio: e.target.value })}
                      placeholder="Ej: 150000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all"
                  >
                    Volver
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Continuar <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 3: Canales de Marketing</h3>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">📡 Selecciona los canales que usas o quieres usar:</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { value: 'google_ads', label: 'Google Ads' },
                      { value: 'meta_ads', label: 'Meta Ads (FB/IG)' },
                      { value: 'linkedin', label: 'LinkedIn Ads' },
                      { value: 'tiktok', label: 'TikTok Ads' },
                      { value: 'email', label: 'Email Marketing' },
                      { value: 'seo', label: 'SEO' },
                      { value: 'content', label: 'Content Marketing' },
                      { value: 'influencers', label: 'Influencers' }
                    ].map(channel => (
                      <label
                        key={channel.value}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.channels.includes(channel.value)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.channels.includes(channel.value)}
                          onChange={() => toggleChannel(channel.value)}
                          className="w-5 h-5"
                        />
                        <span className="font-medium text-gray-700">{channel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all"
                  >
                    Volver
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Continuar <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 4: Ciclo de Compra</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Ciclo de Venta Promedio</label>
                    <select
                      value={formData.salesCycle}
                      onChange={(e) => setFormData({ ...formData, salesCycle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona el ciclo --</option>
                      <option value="impulso">Impulso (minutos a horas)</option>
                      <option value="corto">Corto (1-7 días)</option>
                      <option value="medio">Medio (1-4 semanas)</option>
                      <option value="largo">Largo (1-3 meses)</option>
                      <option value="complejo">Complejo (3+ meses)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">👥 Personas Involucradas en Decisión de Compra</label>
                    <select
                      value={formData.decisionMakers}
                      onChange={(e) => setFormData({ ...formData, decisionMakers: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="individual">1 persona (decisión individual)</option>
                      <option value="pareja">2 personas (pareja/socio)</option>
                      <option value="comite">3-5 personas (comité pequeño)</option>
                      <option value="multiple">5+ personas (decisión corporativa)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all"
                  >
                    Volver
                  </button>
                  <button
                    onClick={generatePersonas}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg"
                  >
                    ✨ Generar Buyer Personas
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-200">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Analizando datos y generando tus buyer personas...</p>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div id="results">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🎯 Tus Buyer Personas Recomendadas</h2>
              <p className="text-gray-600">Basadas en data intelligence y mejores prácticas de marketing</p>
            </div>

            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              <button
                onClick={exportJSON}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-5 h-5" /> Exportar JSON
              </button>
              <button
                onClick={contactWhatsApp}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Consultoría M&P
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {personas.map((persona, index) => {
                const avatar = avatars[index] || '👤'
                const isB2B = !!persona.sector

                return (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-all">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white/30">
                        {avatar}
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">{persona.nombre}</h3>
                      <div className="text-center text-sm">
                        Score de Afinidad: {persona.score}%
                        <div className="w-full h-2 bg-white/30 rounded-full mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all"
                            style={{ width: `${persona.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      {/* Profile */}
                      <div>
                        <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">
                          {isB2B ? '🏢 Perfil Empresarial' : '👤 Perfil Demográfico'}
                        </h4>
                        {isB2B ? (
                          <div className="text-sm text-gray-700 space-y-1">
                            <p><strong>Sector:</strong> {persona.sector}</p>
                            <p><strong>Tamaño:</strong> {persona.tamaño}</p>
                            <p><strong>Decisores:</strong> {persona.decisores}</p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-700 space-y-1">
                            <p><strong>Edad:</strong> {persona.edad}</p>
                            <p><strong>Ocupación:</strong> {persona.ocupacion}</p>
                            <p><strong>Ingresos:</strong> {persona.ingresos}</p>
                          </div>
                        )}
                      </div>

                      {/* Motivations */}
                      <div>
                        <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">💡 Motivaciones</h4>
                        <p className="text-sm text-gray-700">{persona.motivaciones}</p>
                      </div>

                      {/* Pain Points */}
                      <div>
                        <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">⚠️ Puntos de Dolor</h4>
                        <p className="text-sm text-gray-700">{persona.puntosDolor}</p>
                      </div>

                      {/* Collapsible Sections */}
                      <div className="space-y-2">
                        {[
                          { key: `channels-${index}`, title: '📡 Canales Recomendados', items: persona.channels },
                          { key: `keywords-${index}`, title: '🔑 Keywords Objetivo', items: persona.keywords },
                          { key: `kpis-${index}`, title: '📊 KPIs Clave', items: persona.kpis },
                          { key: `content-${index}`, title: '📝 Estrategia de Contenido', items: persona.contentStrategy }
                        ].map(section => (
                          <div key={section.key} className="bg-gray-50 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleSection(section.key)}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-all"
                            >
                              <span className="text-sm font-semibold text-gray-700">{section.title}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections[section.key] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections[section.key] && (
                              <div className="px-4 pb-3">
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {section.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <button
                onClick={resetTool}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" /> Generar Nuevas Personas
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 Muller y Pérez · Buyer Personas basadas en data intelligence</p>
        </div>
      </footer>
      </div>
    </>
  )
}
