'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  UserCircle, ArrowRight, Download, MessageCircle, RefreshCw,
  ChevronDown, Target, TrendingUp, Users, Zap, Mail, Building2,
  BarChart3, Hash, Megaphone, DollarSign, CheckCircle2
} from 'lucide-react'
import { personasDatabase, industryRecommendations, BasePersona } from './personasData'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'
import { supabase } from '@/lib/supabase'

interface EnrichedPersona extends BasePersona {
  score: number
  channels: string[]
  keywords: string[]
  kpis: string[]
  contentStrategy: string[]
  benchmarks: {
    cpl: string
    ctr: string
    conversion: string
  }
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

const avatars = [
  { emoji: '👨‍💼', bg: 'from-blue-500 to-blue-600' },
  { emoji: '👩‍💼', bg: 'from-purple-500 to-purple-600' },
  { emoji: '🧑‍💻', bg: 'from-green-500 to-green-600' }
]

const industries = [
  { value: 'tecnologia', label: 'Tecnologia & Software' },
  { value: 'salud', label: 'Salud & Medicina' },
  { value: 'educacion', label: 'Educacion & E-learning' },
  { value: 'finanzas', label: 'Finanzas & Fintech' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'servicios', label: 'Servicios Profesionales' },
  { value: 'inmobiliaria', label: 'Inmobiliaria' },
  { value: 'automotriz', label: 'Automotriz' },
  { value: 'gastronomia', label: 'Gastronomia & Restaurantes' },
  { value: 'turismo', label: 'Turismo & Hoteleria' },
  { value: 'construccion', label: 'Construccion & Remodelacion' },
  { value: 'legal', label: 'Legal & Abogados' }
]

export default function BuyerGenClient() {
  const buyerGenSchema = createSoftwareAppSchema(
    'Buyer Gen - Generador de Buyer Personas',
    'Herramienta gratuita para crear buyer personas detallados basados en data intelligence Chile 2025.',
    'https://www.mulleryperez.cl/labs/buyer-gen'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'M&P Labs', url: 'https://www.mulleryperez.cl/labs' },
    { name: 'Buyer Gen', url: 'https://www.mulleryperez.cl/labs/buyer-gen' }
  ])

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
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [leadData, setLeadData] = useState({ nombre: '', email: '', empresa: '' })
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSuccess, setLeadSuccess] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

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

  const prevStep = () => setCurrentStep(currentStep - 1)

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

  const generatePersonas = async () => {
    if (!validateStep(4)) return

    setLoading(true)
    setShowResults(false)

    setTimeout(async () => {
      const recommendations = industryRecommendations[formData.industry]
      const basePersonas = personasDatabase[formData.businessModel]?.[formData.industry] || []

      const enrichedPersonas: EnrichedPersona[] = basePersonas.map(persona => ({
        ...persona,
        score: calculateScore(persona, formData),
        channels: recommendations?.channels[formData.businessModel as 'b2b' | 'b2c'] || [],
        keywords: recommendations?.keywords || [],
        kpis: recommendations?.kpis || [],
        contentStrategy: recommendations?.contentStrategy || [],
        benchmarks: recommendations?.benchmarks || { cpl: 'N/A', ctr: 'N/A', conversion: 'N/A' }
      }))

      const sortedPersonas = enrichedPersonas.sort((a, b) => b.score - a.score).slice(0, 3)
      setPersonas(sortedPersonas)
      setLoading(false)
      setShowResults(true)

      // Guardar en Supabase
      try {
        await supabase.from('buyer_gen_sessions').insert({
          industry: formData.industry,
          business_model: formData.businessModel,
          company_size: formData.companySize,
          main_goal: formData.mainGoal,
          monthly_budget: formData.monthlyBudget,
          channels: formData.channels,
          sales_cycle: formData.salesCycle,
          personas_generated: sortedPersonas.length
        })
      } catch (err) {
        console.error('Error saving to Supabase:', err)
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 2000)
  }

  const exportPDF = () => {
    setShowLeadModal(true)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLeadSubmitting(true)

    try {
      // Guardar lead en Supabase
      await supabase.from('buyer_gen_leads').insert({
        nombre: leadData.nombre,
        email: leadData.email,
        empresa: leadData.empresa,
        industry: formData.industry,
        business_model: formData.businessModel
      })

      // Enviar email
      await fetch('/api/buyer-gen/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          formData,
          personas
        })
      })

      setLeadSuccess(true)

      // Generar PDF
      setTimeout(() => {
        generatePDFContent()
        setShowLeadModal(false)
        setLeadSuccess(false)
      }, 2000)

    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLeadSubmitting(false)
    }
  }

  const generatePDFContent = () => {
    const recommendations = industryRecommendations[formData.industry]
    const industryLabel = industries.find(i => i.value === formData.industry)?.label || formData.industry

    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Buyer Personas - ${industryLabel} | M&P</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; line-height: 1.6; }
    .page { padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { opacity: 0.9; }
    .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .section-title { font-size: 18px; font-weight: 700; color: #1e40af; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .persona-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .persona-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
    .persona-avatar { width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .persona-name { font-size: 20px; font-weight: 700; }
    .persona-score { background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .persona-detail { margin-bottom: 12px; }
    .persona-detail-label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .persona-detail-value { margin-top: 4px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .metric-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
    .metric-value { font-size: 20px; font-weight: 700; color: #1e40af; }
    .metric-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .list { list-style: none; }
    .list li { padding: 8px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 8px; }
    .list li:last-child { border-bottom: none; }
    .check { color: #10b981; }
    .footer { text-align: center; padding: 30px; color: #6b7280; font-size: 12px; border-top: 1px solid #e2e8f0; margin-top: 30px; }
    @media print { .page { padding: 20px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>Buyer Personas - ${industryLabel}</h1>
      <p>Generado con Buyer Gen de M&P | ${new Date().toLocaleDateString('es-CL')}</p>
    </div>

    <div class="section">
      <div class="section-title">👥 Tus Buyer Personas</div>
      ${personas.map((persona, i) => `
        <div class="persona-card">
          <div class="persona-header">
            <div class="persona-avatar">${avatars[i]?.emoji || '👤'}</div>
            <div>
              <div class="persona-name">${persona.nombre}</div>
              <span class="persona-score">Score: ${persona.score}%</span>
            </div>
          </div>
          <div class="grid-2">
            <div class="persona-detail">
              <div class="persona-detail-label">${persona.sector ? 'Sector' : 'Edad'}</div>
              <div class="persona-detail-value">${persona.sector || persona.edad}</div>
            </div>
            <div class="persona-detail">
              <div class="persona-detail-label">${persona.tamano ? 'Tamano' : 'Ocupacion'}</div>
              <div class="persona-detail-value">${persona.tamano || persona.ocupacion}</div>
            </div>
          </div>
          <div class="persona-detail">
            <div class="persona-detail-label">Motivaciones</div>
            <div class="persona-detail-value">${persona.motivaciones}</div>
          </div>
          <div class="persona-detail">
            <div class="persona-detail-label">Puntos de Dolor</div>
            <div class="persona-detail-value">${persona.puntosDolor}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">📊 Benchmarks Chile 2025</div>
      <div class="grid-2">
        <div class="metric-card">
          <div class="metric-value">${recommendations?.benchmarks.cpl || 'N/A'}</div>
          <div class="metric-label">CPL Esperado</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${recommendations?.benchmarks.ctr || 'N/A'}</div>
          <div class="metric-label">CTR Promedio</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${recommendations?.benchmarks.conversion || 'N/A'}</div>
          <div class="metric-label">Conversion Rate</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formData.businessModel.toUpperCase()}</div>
          <div class="metric-label">Modelo de Negocio</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📡 Canales Recomendados</div>
      <ul class="list">
        ${(recommendations?.channels[formData.businessModel as 'b2b' | 'b2c'] || []).map(ch => `
          <li><span class="check">✓</span> ${ch}</li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <div class="section-title">🔑 Keywords Objetivo</div>
      <ul class="list">
        ${(recommendations?.keywords || []).map(kw => `
          <li><span class="check">✓</span> ${kw}</li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <div class="section-title">📈 KPIs Clave</div>
      <ul class="list">
        ${(recommendations?.kpis || []).map(kpi => `
          <li><span class="check">✓</span> ${kpi}</li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <div class="section-title">📝 Estrategia de Contenido</div>
      <ul class="list">
        ${(recommendations?.contentStrategy || []).map(cs => `
          <li><span class="check">✓</span> ${cs}</li>
        `).join('')}
      </ul>
    </div>

    <div class="footer">
      <p><strong>Generado con Buyer Gen de M&P</strong></p>
      <p>www.mulleryperez.cl | contacto@mulleryperez.cl | +56 9 9225 8137</p>
      <p style="margin-top: 10px;">¿Quieres implementar esta estrategia? Agenda una reunion gratuita con nuestro equipo.</p>
    </div>
  </div>
</body>
</html>
    `

    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) {
      win.onload = () => {
        win.print()
      }
    }
  }

  const contactWhatsApp = () => {
    const message = `Hola! Acabo de generar mis buyer personas con Buyer Gen para ${industries.find(i => i.value === formData.industry)?.label || 'mi industria'} y me gustaria agendar una consultoria para optimizar mi estrategia de marketing`
    window.open(`https://wa.me/56992258137?text=${encodeURIComponent(message)}`, '_blank')
  }

  const resetTool = () => {
    if (confirm('¿Estas seguro de que quieres empezar de nuevo?')) {
      setCurrentStep(1)
      setFormData({
        industry: '', businessModel: '', companySize: '', mainGoal: '',
        monthlyBudget: '', ticketPromedio: '', channels: [], salesCycle: '', decisionMakers: ''
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buyerGenSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/logo-color.png" alt="M&P Logo" width={120} height={32} className="h-8 w-auto" />
            </Link>
            <Link href="/labs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
              ← Volver a Labs
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
              <UserCircle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Data Intelligence Chile 2025</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Descubre tus Buyer Personas<br />ideales en 4 pasos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              +12 industrias | Benchmarks reales Chile | Estrategia personalizada
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
                      num === currentStep ? 'bg-blue-600 scale-125 ring-4 ring-blue-200' :
                      num < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Paso 1: Informacion Basica</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Industria / Rubro</label>
                      <select value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona tu industria --</option>
                        {industries.map(ind => (
                          <option key={ind.value} value={ind.value}>{ind.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo de Negocio</label>
                      <select value={formData.businessModel} onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona tu modelo --</option>
                        <option value="b2c">B2C - Venta directa a consumidores</option>
                        <option value="b2b">B2B - Venta a otras empresas</option>
                        <option value="b2b2c">B2B2C - Hibrido</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tamano de tu Empresa</label>
                      <select value={formData.companySize} onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona el tamano --</option>
                        <option value="startup">Startup (1-10 empleados)</option>
                        <option value="pequena">Pequena (11-50 empleados)</option>
                        <option value="mediana">Mediana (51-200 empleados)</option>
                        <option value="grande">Grande (200+ empleados)</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={nextStep}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Objetivo Principal</label>
                      <select value={formData.mainGoal} onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona tu objetivo --</option>
                        <option value="leads">Generacion de Leads</option>
                        <option value="ventas">Aumento de Ventas</option>
                        <option value="awareness">Brand Awareness</option>
                        <option value="conversion">Optimizacion de Conversion</option>
                        <option value="retention">Retencion de Clientes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Presupuesto Mensual de Marketing (CLP)</label>
                      <select value={formData.monthlyBudget} onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona tu presupuesto --</option>
                        <option value="bajo">Hasta $500.000</option>
                        <option value="medio">$500.000 - $2.000.000</option>
                        <option value="alto">$2.000.000 - $5.000.000</option>
                        <option value="premium">Mas de $5.000.000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Promedio de Venta (CLP)</label>
                      <input type="number" value={formData.ticketPromedio} onChange={(e) => setFormData({ ...formData, ticketPromedio: e.target.value })}
                        placeholder="Ej: 150000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={prevStep} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all">Volver</button>
                    <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Selecciona los canales que usas o quieres usar:</label>
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
                        <label key={channel.value}
                          className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.channels.includes(channel.value) ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                          }`}>
                          <input type="checkbox" checked={formData.channels.includes(channel.value)} onChange={() => toggleChannel(channel.value)} className="w-5 h-5" />
                          <span className="font-medium text-gray-700">{channel.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={prevStep} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all">Volver</button>
                    <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ciclo de Venta Promedio</label>
                      <select value={formData.salesCycle} onChange={(e) => setFormData({ ...formData, salesCycle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona el ciclo --</option>
                        <option value="impulso">Impulso (minutos a horas)</option>
                        <option value="corto">Corto (1-7 dias)</option>
                        <option value="medio">Medio (1-4 semanas)</option>
                        <option value="largo">Largo (1-3 meses)</option>
                        <option value="complejo">Complejo (3+ meses)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Personas Involucradas en Decision de Compra</label>
                      <select value={formData.decisionMakers} onChange={(e) => setFormData({ ...formData, decisionMakers: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">-- Selecciona --</option>
                        <option value="individual">1 persona (decision individual)</option>
                        <option value="pareja">2 personas (pareja/socio)</option>
                        <option value="comite">3-5 personas (comite pequeno)</option>
                        <option value="multiple">5+ personas (decision corporativa)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={prevStep} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all">Volver</button>
                    <button onClick={generatePersonas} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg">
                      Generar Buyer Personas
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
            <div ref={resultsRef}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tus Buyer Personas</h2>
                <p className="text-gray-600">{industries.find(i => i.value === formData.industry)?.label} - {formData.businessModel.toUpperCase()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mb-8 flex-wrap">
                <button onClick={exportPDF}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg">
                  <Download className="w-5 h-5" /> Descargar PDF
                </button>
                <button onClick={contactWhatsApp}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg">
                  <MessageCircle className="w-5 h-5" /> Consultoria Gratis
                </button>
              </div>

              {/* Benchmarks */}
              {industryRecommendations[formData.industry] && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Benchmarks Chile 2025 - {industries.find(i => i.value === formData.industry)?.label}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">{industryRecommendations[formData.industry].benchmarks.cpl}</div>
                      <div className="text-sm opacity-80">CPL Esperado</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">{industryRecommendations[formData.industry].benchmarks.ctr}</div>
                      <div className="text-sm opacity-80">CTR Promedio</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">{industryRecommendations[formData.industry].benchmarks.conversion}</div>
                      <div className="text-sm opacity-80">Conversion Rate</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personas Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {personas.map((persona, index) => {
                  const avatar = avatars[index] || avatars[0]
                  const isB2B = !!persona.sector

                  return (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-all">
                      {/* Header */}
                      <div className={`bg-gradient-to-br ${avatar.bg} text-white p-6`}>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white/30">
                          {avatar.emoji}
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">{persona.nombre}</h3>
                        <div className="text-center">
                          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                            Score: {persona.score}%
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs font-bold text-gray-500 uppercase">{isB2B ? 'Sector' : 'Edad'}</div>
                            <div className="text-sm font-semibold text-gray-800 mt-1">{isB2B ? persona.sector : persona.edad}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs font-bold text-gray-500 uppercase">{isB2B ? 'Tamano' : 'Ingresos'}</div>
                            <div className="text-sm font-semibold text-gray-800 mt-1">{isB2B ? persona.tamano : persona.ingresos}</div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-green-600 mb-2">
                            <Target className="w-4 h-4" /> Motivaciones
                          </div>
                          <p className="text-sm text-gray-700">{persona.motivaciones}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-red-600 mb-2">
                            <Zap className="w-4 h-4" /> Puntos de Dolor
                          </div>
                          <p className="text-sm text-gray-700">{persona.puntosDolor}</p>
                        </div>

                        {/* Expandable Sections */}
                        {[
                          { key: `ch-${index}`, title: 'Canales', icon: Megaphone, items: persona.channels, color: 'blue' },
                          { key: `kw-${index}`, title: 'Keywords', icon: Hash, items: persona.keywords, color: 'purple' },
                          { key: `kp-${index}`, title: 'KPIs', icon: TrendingUp, items: persona.kpis, color: 'green' },
                          { key: `cs-${index}`, title: 'Contenido', icon: Users, items: persona.contentStrategy, color: 'orange' }
                        ].map(section => (
                          <div key={section.key} className="border border-gray-100 rounded-lg overflow-hidden">
                            <button onClick={() => toggleSection(section.key)}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-all">
                              <span className={`flex items-center gap-2 text-sm font-semibold text-${section.color}-600`}>
                                <section.icon className="w-4 h-4" /> {section.title}
                              </span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections[section.key] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections[section.key] && (
                              <div className="px-4 pb-3 space-y-1">
                                {section.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    {item}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <button onClick={resetTool}
                  className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto">
                  <RefreshCw className="w-5 h-5" /> Generar Nuevas Personas
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
            <p>© 2025 Muller y Perez · Buyer Personas basadas en data intelligence Chile</p>
          </div>
        </footer>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            {!leadSuccess ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Descarga tu reporte</h3>
                <p className="text-gray-600 mb-6">Ingresa tus datos para recibir el PDF con tus buyer personas</p>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input type="text" placeholder="Tu nombre *" value={leadData.nombre}
                    onChange={(e) => setLeadData({ ...leadData, nombre: e.target.value })} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <input type="email" placeholder="Tu email *" value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Empresa (opcional)" value={leadData.empresa}
                    onChange={(e) => setLeadData({ ...leadData, empresa: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowLeadModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                      Cancelar
                    </button>
                    <button type="submit" disabled={leadSubmitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      {leadSubmitting ? 'Enviando...' : <>
                        <Download className="w-4 h-4" /> Descargar
                      </>}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Listo!</h3>
                <p className="text-gray-600">Preparando tu PDF...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
