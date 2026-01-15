'use client'

/**
 * Calculadora ROI - M&P Labs
 * Diseño consistente con www.mulleryperez.cl
 */

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  X,
  Unlock,
  BarChart3,
  Zap
} from 'lucide-react'

const CPA_POR_INDUSTRIA: Record<string, { cpa_min: number, cpa_avg: number, cpa_max: number, roas_tipico: number }> = {
  ECOMMERCE: { cpa_min: 5000, cpa_avg: 15000, cpa_max: 35000, roas_tipico: 8 },
  INMOBILIARIA: { cpa_min: 50000, cpa_avg: 150000, cpa_max: 350000, roas_tipico: 15 },
  TURISMO: { cpa_min: 15000, cpa_avg: 45000, cpa_max: 100000, roas_tipico: 6 },
  GASTRONOMIA: { cpa_min: 3000, cpa_avg: 10000, cpa_max: 25000, roas_tipico: 4 },
  AUTOMOTRIZ: { cpa_min: 80000, cpa_avg: 200000, cpa_max: 400000, roas_tipico: 12 },
  SALUD_MEDICINA: { cpa_min: 25000, cpa_avg: 75000, cpa_max: 180000, roas_tipico: 8 },
  EDUCACION: { cpa_min: 20000, cpa_avg: 60000, cpa_max: 150000, roas_tipico: 6 },
  MODA_RETAIL: { cpa_min: 8000, cpa_avg: 25000, cpa_max: 60000, roas_tipico: 7 },
  FINTECH: { cpa_min: 40000, cpa_avg: 120000, cpa_max: 280000, roas_tipico: 10 },
  SERVICIOS_LEGALES: { cpa_min: 100000, cpa_avg: 250000, cpa_max: 500000, roas_tipico: 15 },
  BELLEZA_PERSONAL: { cpa_min: 12000, cpa_avg: 35000, cpa_max: 80000, roas_tipico: 5 },
  TECNOLOGIA_SAAS: { cpa_min: 50000, cpa_avg: 150000, cpa_max: 350000, roas_tipico: 12 },
  CONSTRUCCION_REMODELACION: { cpa_min: 120000, cpa_avg: 300000, cpa_max: 600000, roas_tipico: 10 },
  DEPORTES_FITNESS: { cpa_min: 15000, cpa_avg: 40000, cpa_max: 90000, roas_tipico: 5 },
  VETERINARIA_MASCOTAS: { cpa_min: 8000, cpa_avg: 25000, cpa_max: 55000, roas_tipico: 4 },
  MANUFACTURA_INDUSTRIAL: { cpa_min: 250000, cpa_avg: 500000, cpa_max: 1000000, roas_tipico: 18 },
  LOGISTICA_TRANSPORTE: { cpa_min: 150000, cpa_avg: 350000, cpa_max: 700000, roas_tipico: 12 },
  SEGUROS: { cpa_min: 80000, cpa_avg: 200000, cpa_max: 450000, roas_tipico: 10 },
  AGRICULTURA_AGROINDUSTRIA: { cpa_min: 100000, cpa_avg: 250000, cpa_max: 500000, roas_tipico: 8 },
  SERVICIOS_PROFESIONALES: { cpa_min: 80000, cpa_avg: 180000, cpa_max: 400000, roas_tipico: 12 },
  ENERGIA_UTILITIES: { cpa_min: 200000, cpa_avg: 450000, cpa_max: 900000, roas_tipico: 15 },
  HOGAR_DECORACION: { cpa_min: 18000, cpa_avg: 50000, cpa_max: 120000, roas_tipico: 6 },
}

const INDUSTRIAS = [
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'MODA_RETAIL', label: 'Moda / Retail' },
  { value: 'GASTRONOMIA', label: 'Gastronomía' },
  { value: 'TURISMO', label: 'Turismo' },
  { value: 'BELLEZA_PERSONAL', label: 'Belleza / Personal' },
  { value: 'DEPORTES_FITNESS', label: 'Deportes / Fitness' },
  { value: 'VETERINARIA_MASCOTAS', label: 'Veterinaria / Mascotas' },
  { value: 'HOGAR_DECORACION', label: 'Hogar / Decoración' },
  { value: 'SALUD_MEDICINA', label: 'Salud / Medicina' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'SERVICIOS_LEGALES', label: 'Servicios Legales' },
  { value: 'INMOBILIARIA', label: 'Inmobiliaria' },
  { value: 'AUTOMOTRIZ', label: 'Automotriz' },
  { value: 'SEGUROS', label: 'Seguros' },
  { value: 'CONSTRUCCION_REMODELACION', label: 'Construcción / Remodelación' },
  { value: 'TECNOLOGIA_SAAS', label: 'Tecnología / SaaS' },
  { value: 'FINTECH', label: 'Fintech' },
  { value: 'SERVICIOS_PROFESIONALES', label: 'Servicios Profesionales B2B' },
  { value: 'MANUFACTURA_INDUSTRIAL', label: 'Manufactura / Industrial' },
  { value: 'LOGISTICA_TRANSPORTE', label: 'Logística / Transporte' },
  { value: 'ENERGIA_UTILITIES', label: 'Energía / Utilities' },
  { value: 'AGRICULTURA_AGROINDUSTRIA', label: 'Agricultura / Agroindustria' },
]

export default function CalculadoraROI() {
  const [formData, setFormData] = useState({
    ventasObjetivo: '',
    ticketPromedio: '',
    industria: 'ECOMMERCE',
  })

  const [result, setResult] = useState<any>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [leadForm, setLeadForm] = useState({ nombre: '', email: '', empresa: '', telefono: '' })
  const [savingLead, setSavingLead] = useState(false)

  const calcular = () => {
    const ventas = parseInt(formData.ventasObjetivo)
    const ticket = parseInt(formData.ticketPromedio)
    const industria = CPA_POR_INDUSTRIA[formData.industria]

    if (!ventas || !ticket || !industria) return

    const presupuestoOptimista = ventas * industria.cpa_min
    const presupuestoRealista = ventas * industria.cpa_avg
    const presupuestoPesimista = ventas * industria.cpa_max

    const revenueObjetivo = ventas * ticket

    const roiOptimista = ((revenueObjetivo - presupuestoOptimista) / presupuestoOptimista) * 100
    const roiRealista = ((revenueObjetivo - presupuestoRealista) / presupuestoRealista) * 100
    const roiPesimista = ((revenueObjetivo - presupuestoPesimista) / presupuestoPesimista) * 100

    const roasOptimista = revenueObjetivo / presupuestoOptimista
    const roasRealista = revenueObjetivo / presupuestoRealista
    const roasPesimista = revenueObjetivo / presupuestoPesimista

    setResult({
      ventas,
      ticket,
      revenueObjetivo,
      industria: formData.industria,
      escenarios: {
        optimista: { presupuesto: presupuestoOptimista, cpa: industria.cpa_min, roi: roiOptimista, roas: roasOptimista },
        realista: { presupuesto: presupuestoRealista, cpa: industria.cpa_avg, roi: roiRealista, roas: roasRealista },
        pesimista: { presupuesto: presupuestoPesimista, cpa: industria.cpa_max, roi: roiPesimista, roas: roasPesimista },
      },
      roas_tipico: industria.roas_tipico,
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
          solicitud: `Lead Calculadora ROI - Industria: ${formData.industria}, Objetivo: ${formData.ventasObjetivo} ventas/mes, Ticket: $${parseInt(formData.ticketPromedio).toLocaleString('es-CL')}`,
          destinatario: 'contacto@mulleryperez.cl',
          fuente: 'calculadora_roi'
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

  const formatCLP = (num: number) => `$${Math.round(num).toLocaleString('es-CL')}`

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/logo-color.png" alt="Muller y Pérez" width={140} height={45} className="h-11 w-auto" priority />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/labs" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              ← Volver a Labs
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200 text-sm font-medium">Calculadora ROI</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Cuánto invertir para lograr{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              tus ventas objetivo?
            </span>
          </h1>

          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Calcula el presupuesto necesario en Google Ads según tu industria y objetivo de ventas mensuales
          </p>
        </div>
      </section>

      {/* Calculadora */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <Target className="w-4 h-4 inline mr-2 text-blue-600" />
                  Ventas objetivo/mes
                </label>
                <input
                  type="number"
                  value={formData.ventasObjetivo}
                  onChange={(e) => setFormData({ ...formData, ventasObjetivo: e.target.value })}
                  placeholder="Ej: 50"
                  className="w-full h-12 px-4 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2 text-blue-600" />
                  Ticket promedio (CLP)
                </label>
                <input
                  type="number"
                  value={formData.ticketPromedio}
                  onChange={(e) => setFormData({ ...formData, ticketPromedio: e.target.value })}
                  placeholder="Ej: 150000"
                  className="w-full h-12 px-4 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  <Building2 className="w-4 h-4 inline mr-2 text-blue-600" />
                  Industria
                </label>
                <select
                  value={formData.industria}
                  onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                >
                  {INDUSTRIAS.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={calcular}
              disabled={!formData.ventasObjetivo || !formData.ticketPromedio}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Calculator className="w-5 h-5" />
              Calcular presupuesto necesario
            </button>
          </div>

          {/* Resultados */}
          {result && (
            <div className={`mt-8 ${!leadCaptured ? 'relative' : ''}`}>
              {!leadCaptured && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Unlock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold text-lg mb-2">Completa tus datos para ver los resultados</p>
                    <p className="text-gray-500 text-sm">Es gratis y solo toma 10 segundos</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Para {result.ventas} ventas/mes a {formatCLP(result.ticket)}
                  </h2>
                  <p className="text-gray-600">
                    Revenue objetivo: <span className="font-bold text-emerald-600">{formatCLP(result.revenueObjetivo)}</span>/mes
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Optimista */}
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <div className="text-emerald-600 font-bold text-sm mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      OPTIMISTA
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {formatCLP(result.escenarios.optimista.presupuesto)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPA</span>
                        <span className="font-semibold">{formatCLP(result.escenarios.optimista.cpa)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI</span>
                        <span className="font-semibold text-emerald-600">{result.escenarios.optimista.roi.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROAS</span>
                        <span className="font-semibold">{result.escenarios.optimista.roas.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>

                  {/* Realista */}
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-400 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      RECOMENDADO
                    </div>
                    <div className="text-blue-600 font-bold text-sm mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      REALISTA
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {formatCLP(result.escenarios.realista.presupuesto)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPA</span>
                        <span className="font-semibold">{formatCLP(result.escenarios.realista.cpa)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI</span>
                        <span className="font-semibold text-blue-600">{result.escenarios.realista.roi.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROAS</span>
                        <span className="font-semibold">{result.escenarios.realista.roas.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>

                  {/* Pesimista */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="text-orange-600 font-bold text-sm mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      CONSERVADOR
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {formatCLP(result.escenarios.pesimista.presupuesto)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPA</span>
                        <span className="font-semibold">{formatCLP(result.escenarios.pesimista.cpa)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI</span>
                        <span className="font-semibold text-orange-600">{result.escenarios.pesimista.roi.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROAS</span>
                        <span className="font-semibold">{result.escenarios.pesimista.roas.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                </div>

                {leadCaptured && (
                  <div className="mt-8 text-center">
                    <Link
                      href="/labs/predictor"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Hacer predicción detallada
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas una estrategia personalizada?</h2>
          <p className="text-gray-600 mb-8">Nuestro equipo puede analizar tu caso y crear un plan de inversión optimizado.</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Desbloquea tus resultados</h3>
              <p className="text-gray-600 text-sm">Completa tus datos para ver los escenarios de inversión</p>
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
                    Ver mis resultados
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
