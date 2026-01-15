'use client'

/**
 * Comparador de Plataformas - M&P Labs
 * Diseño consistente con www.mulleryperez.cl
 */

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  X,
  Unlock,
  Award,
  AlertCircle,
  Check,
  Minus
} from 'lucide-react'

const PLATAFORMAS_POR_INDUSTRIA: Record<string, {
  google: { cpc: number, ctr: number, cvr: number, score: number, pros: string[], contras: string[] },
  meta: { cpc: number, ctr: number, cvr: number, score: number, pros: string[], contras: string[] },
  linkedin: { cpc: number, ctr: number, cvr: number, score: number, pros: string[], contras: string[] },
}> = {
  ECOMMERCE: {
    google: { cpc: 248, ctr: 2.8, cvr: 2.8, score: 90, pros: ['Alta intención de compra', 'Google Shopping', 'Remarketing'], contras: ['CPC más alto', 'Requiere optimización constante'] },
    meta: { cpc: 198, ctr: 1.6, cvr: 8.8, score: 85, pros: ['Descubrimiento de productos', 'Catálogo dinámico', 'Lookalikes'], contras: ['Menor intención', 'iOS 14 afectó tracking'] },
    linkedin: { cpc: 1500, ctr: 0.4, cvr: 1.5, score: 25, pros: ['N/A para e-commerce B2C'], contras: ['CPC muy alto', 'Audiencia no compra productos'] },
  },
  INMOBILIARIA: {
    google: { cpc: 215, ctr: 1.8, cvr: 1.2, score: 85, pros: ['Búsquedas por ubicación', 'Alta intención', 'Local Services'], contras: ['Competencia alta', 'Ciclo largo'] },
    meta: { cpc: 193, ctr: 2.6, cvr: 9.7, score: 80, pros: ['Lead Ads efectivos', 'Segmentación por ingresos', 'Video tours'], contras: ['Leads menos calificados', 'Requiere nurturing'] },
    linkedin: { cpc: 1200, ctr: 0.5, cvr: 2.0, score: 40, pros: ['Inversores profesionales', 'Bienes raíces comerciales'], contras: ['CPC alto', 'Solo B2B/inversión'] },
  },
  TECNOLOGIA_SAAS: {
    google: { cpc: 450, ctr: 3.2, cvr: 7.0, score: 75, pros: ['Búsquedas de soluciones', 'Comparativas'], contras: ['CPC muy alto', 'Competencia global'] },
    meta: { cpc: 350, ctr: 0.7, cvr: 8.8, score: 60, pros: ['Awareness', 'Retargeting'], contras: ['Baja intención B2B', 'CTR bajo'] },
    linkedin: { cpc: 1800, ctr: 0.6, cvr: 5.5, score: 90, pros: ['Segmentación por cargo', 'Decisores B2B', 'Lead Gen Forms'], contras: ['CPC alto', 'Volumen limitado'] },
  },
  FINTECH: {
    google: { cpc: 479, ctr: 1.9, cvr: 4.7, score: 80, pros: ['Alta intención', 'Búsquedas específicas'], contras: ['CPC muy alto', 'Restricciones de política'] },
    meta: { cpc: 455, ctr: 0.9, cvr: 8.8, score: 55, pros: ['Awareness masivo', 'Videos explicativos'], contras: ['Políticas restrictivas', 'Leads fríos'] },
    linkedin: { cpc: 2000, ctr: 0.5, cvr: 4.0, score: 85, pros: ['Decisores financieros', 'B2B fintech'], contras: ['CPC muy alto', 'Solo corporativo'] },
  },
  SALUD_MEDICINA: {
    google: { cpc: 369, ctr: 3.2, cvr: 7.0, score: 95, pros: ['Búsquedas de síntomas', 'Local Services', 'Alta urgencia'], contras: ['Restricciones médicas', 'CPC alto'] },
    meta: { cpc: 314, ctr: 0.7, cvr: 4.8, score: 45, pros: ['Awareness de servicios', 'Remarketing'], contras: ['Políticas muy restrictivas', 'Baja intención'] },
    linkedin: { cpc: 1500, ctr: 0.4, cvr: 2.0, score: 30, pros: ['B2B médico/farmacéutico'], contras: ['No para pacientes', 'CPC alto'] },
  },
  EDUCACION: {
    google: { cpc: 146, ctr: 3.2, cvr: 10.0, score: 85, pros: ['Búsquedas de cursos', 'Alto CVR', 'CPC accesible'], contras: ['Estacionalidad', 'Competencia en matrículas'] },
    meta: { cpc: 109, ctr: 1.6, cvr: 10.0, score: 80, pros: ['Segmentación por edad', 'Lead Ads', 'Video testimonios'], contras: ['Leads menos calificados'] },
    linkedin: { cpc: 1200, ctr: 0.6, cvr: 4.5, score: 70, pros: ['Posgrados y MBA', 'Ejecutivos', 'Educación corporativa'], contras: ['Solo educación profesional'] },
  },
  SERVICIOS_PROFESIONALES: {
    google: { cpc: 295, ctr: 2.9, cvr: 5.8, score: 80, pros: ['Búsquedas específicas', 'Alta intención'], contras: ['Competencia local'] },
    meta: { cpc: 251, ctr: 0.9, cvr: 9.2, score: 50, pros: ['Awareness', 'Remarketing'], contras: ['Baja intención B2B'] },
    linkedin: { cpc: 1500, ctr: 0.6, cvr: 5.0, score: 90, pros: ['Decisores empresariales', 'InMail', 'Segmentación precisa'], contras: ['CPC alto'] },
  },
  VETERINARIA_MASCOTAS: {
    google: { cpc: 175, ctr: 3.8, cvr: 9.5, score: 90, pros: ['Emergencias 24/7', 'Local Services', 'Alto CTR'], contras: ['Radio geográfico limitado'] },
    meta: { cpc: 140, ctr: 2.1, cvr: 14.2, score: 85, pros: ['Contenido de mascotas viral', 'Alto engagement', 'Tiendas online'], contras: ['Leads impulsivos'] },
    linkedin: { cpc: 1200, ctr: 0.3, cvr: 1.0, score: 10, pros: ['N/A'], contras: ['No aplica para veterinarias'] },
  },
  DEPORTES_FITNESS: {
    google: { cpc: 195, ctr: 3.5, cvr: 8.2, score: 75, pros: ['Búsquedas locales', 'Intención clara'], contras: ['Estacionalidad'] },
    meta: { cpc: 146, ctr: 1.8, cvr: 12.5, score: 90, pros: ['Transformaciones virales', 'Video ads', 'Comunidad'], contras: ['Leads de bajo compromiso'] },
    linkedin: { cpc: 1200, ctr: 0.4, cvr: 1.5, score: 20, pros: ['Corporate wellness'], contras: ['Solo B2B'] },
  },
}

const DEFAULT_DATA = {
  google: { cpc: 300, ctr: 3.0, cvr: 6.0, score: 75, pros: ['Intención de búsqueda', 'Amplia cobertura'], contras: ['Requiere optimización'] },
  meta: { cpc: 250, ctr: 1.5, cvr: 8.0, score: 70, pros: ['Awareness', 'Segmentación'], contras: ['Menor intención'] },
  linkedin: { cpc: 1500, ctr: 0.5, cvr: 3.0, score: 50, pros: ['Profesionales', 'B2B'], contras: ['CPC alto'] },
}

const INDUSTRIAS = [
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'TECNOLOGIA_SAAS', label: 'Tecnología / SaaS' },
  { value: 'FINTECH', label: 'Fintech' },
  { value: 'INMOBILIARIA', label: 'Inmobiliaria' },
  { value: 'SALUD_MEDICINA', label: 'Salud / Medicina' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'SERVICIOS_PROFESIONALES', label: 'Servicios Profesionales' },
  { value: 'VETERINARIA_MASCOTAS', label: 'Veterinaria / Mascotas' },
  { value: 'DEPORTES_FITNESS', label: 'Deportes / Fitness' },
]

export default function ComparadorPlataformas() {
  const [industria, setIndustria] = useState('ECOMMERCE')
  const [tipoNegocio, setTipoNegocio] = useState('B2C')
  const [result, setResult] = useState<any>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [leadForm, setLeadForm] = useState({ nombre: '', email: '', empresa: '', telefono: '' })
  const [savingLead, setSavingLead] = useState(false)

  const comparar = () => {
    const data = PLATAFORMAS_POR_INDUSTRIA[industria] || DEFAULT_DATA

    let scores = {
      google: data.google.score,
      meta: data.meta.score,
      linkedin: data.linkedin.score,
    }

    if (tipoNegocio === 'B2B') {
      scores.linkedin = Math.min(100, scores.linkedin + 20)
      scores.meta = Math.max(20, scores.meta - 15)
    } else {
      scores.linkedin = Math.max(10, scores.linkedin - 30)
      scores.meta = Math.min(100, scores.meta + 10)
    }

    const maxScore = Math.max(scores.google, scores.meta, scores.linkedin)
    let ganador = 'google'
    if (scores.meta === maxScore) ganador = 'meta'
    if (scores.linkedin === maxScore) ganador = 'linkedin'

    setResult({
      industria,
      tipoNegocio,
      plataformas: {
        google: { ...data.google, score: scores.google },
        meta: { ...data.meta, score: scores.meta },
        linkedin: { ...data.linkedin, score: scores.linkedin },
      },
      ganador,
    })

    if (!leadCaptured) {
      setShowLeadModal(true)
    }
  }

  const handleSaveLead = async () => {
    if (!leadForm.email || !leadForm.nombre) return
    setSavingLead(true)

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: leadForm.nombre,
          email: leadForm.email,
          empresa: leadForm.empresa || 'No especificada',
          telefono: leadForm.telefono || 'No especificado',
          solicitud: `Lead Comparador Plataformas - Industria: ${industria}, Tipo: ${tipoNegocio}`,
          destinatario: 'contacto@mulleryperez.cl',
          fuente: 'comparador_plataformas'
        })
      })
      setLeadCaptured(true)
      setShowLeadModal(false)
    } catch (error) {
      console.error('Error guardando lead:', error)
    } finally {
      setSavingLead(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200'
    if (score >= 60) return 'bg-blue-50 border-blue-200'
    if (score >= 40) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'google': return '🔍'
      case 'meta': return '📱'
      case 'linkedin': return '💼'
      default: return '📊'
    }
  }

  const getPlatformName = (platform: string) => {
    switch(platform) {
      case 'google': return 'Google Ads'
      case 'meta': return 'Meta Ads'
      case 'linkedin': return 'LinkedIn Ads'
      default: return platform
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/logo-color.png" alt="Muller y Pérez" width={140} height={45} className="h-11 w-auto" priority />
          </Link>
          <Link href="/labs" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            ← Volver a Labs
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-violet-500/20 border border-violet-400/30">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span className="text-violet-200 text-sm font-medium">Comparador de Plataformas</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Google Ads, Meta o LinkedIn?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              Descubre cuál te conviene
            </span>
          </h1>

          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Comparativa basada en benchmarks reales de tu industria en Chile 2025
          </p>
        </div>
      </section>

      {/* Comparador */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <Building2 className="w-4 h-4 inline mr-2 text-blue-600" />
                  Industria
                </label>
                <select
                  value={industria}
                  onChange={(e) => setIndustria(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                >
                  {INDUSTRIAS.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <Target className="w-4 h-4 inline mr-2 text-blue-600" />
                  Tipo de negocio
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTipoNegocio('B2C')}
                    className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                      tipoNegocio === 'B2C'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    B2C (Consumidor)
                  </button>
                  <button
                    onClick={() => setTipoNegocio('B2B')}
                    className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                      tipoNegocio === 'B2B'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    B2B (Empresas)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={comparar}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <BarChart3 className="w-5 h-5" />
              Comparar plataformas
            </button>
          </div>

          {/* Resultados */}
          {result && (
            <div className={`mt-8 ${!leadCaptured ? 'relative' : ''}`}>
              {!leadCaptured && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Unlock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold text-lg mb-2">Desbloquea la comparativa completa</p>
                    <p className="text-gray-500 text-sm">Incluye métricas, pros y contras de cada plataforma</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                {(['google', 'meta', 'linkedin'] as const).map((platform) => {
                  const data = result.plataformas[platform]
                  const isWinner = result.ganador === platform

                  return (
                    <div
                      key={platform}
                      className={`rounded-2xl p-6 border-2 transition-all ${
                        isWinner ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-gray-200'
                      } ${getScoreBg(data.score)}`}
                    >
                      {isWinner && (
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4">
                          <Award className="w-5 h-5" />
                          RECOMENDADO
                        </div>
                      )}

                      <div className="text-3xl mb-2">{getPlatformIcon(platform)}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{getPlatformName(platform)}</h3>

                      <div className={`text-4xl font-bold mb-6 ${getScoreColor(data.score)}`}>
                        {data.score}/100
                      </div>

                      <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">CPC promedio</span>
                          <span className="font-semibold">${data.cpc.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CTR</span>
                          <span className="font-semibold">{data.ctr}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CVR</span>
                          <span className="font-semibold">{data.cvr}%</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-emerald-600 mb-2">VENTAJAS</div>
                          {data.pros.map((pro: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              {pro}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-orange-600 mb-2">LIMITACIONES</div>
                          {data.contras.map((contra: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                              <Minus className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                              {contra}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {leadCaptured && (
                <div className="mt-8 text-center">
                  <Link
                    href="/labs/predictor"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Hacer predicción de inversión
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas ayuda para elegir?</h2>
          <p className="text-gray-600 mb-8">Nuestro equipo puede analizar tu caso y recomendar la mejor estrategia multi-plataforma.</p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            Agendar reunión gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Muller y Pérez · M&P Labs</p>
          <div className="flex gap-6 text-sm">
            <Link href="/labs" className="text-gray-500 hover:text-blue-600 transition-colors">Labs</Link>
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowLeadModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Desbloquea la comparativa</h3>
              <p className="text-gray-600 text-sm">Accede a métricas detalladas y recomendaciones</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={leadForm.nombre}
                    onChange={(e) => setLeadForm({ ...leadForm, nombre: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={leadForm.empresa}
                    onChange={(e) => setLeadForm({ ...leadForm, empresa: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={leadForm.telefono}
                    onChange={(e) => setLeadForm({ ...leadForm, telefono: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveLead}
                disabled={!leadForm.nombre || !leadForm.email || savingLead}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {savingLead ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Ver comparativa completa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
