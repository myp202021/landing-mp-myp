'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calculator, ArrowRight, AlertTriangle, CheckCircle2, XCircle,
  TrendingDown, TrendingUp, Users, DollarSign, Target, Zap,
  Shield, AlertCircle, ChevronDown, RefreshCw, BarChart3,
  Percent, Building2, Activity, Info
} from 'lucide-react'
import {
  calcularDecisionInversion,
  InputSimulador,
  ResultadoSimulador
} from '@/lib/engine/motor-decision-inversion'

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

export default function SimuladorClient() {
  const [formData, setFormData] = useState({
    presupuesto_mensual: '',
    ticket_promedio: '',
    margen_bruto: 40,
    conversion_sitio: 3,
    tasa_cierre: 10,
    capacidad_operativa: '',
    nivel_competencia: 'medio' as 'bajo' | 'medio' | 'alto',
    industria: '',
    // Modo Pro
    variacion_mensual: 15,
    tolerancia_riesgo: 'moderado' as 'conservador' | 'moderado' | 'agresivo'
  })

  const [resultado, setResultado] = useState<ResultadoSimulador | null>(null)
  const [loading, setLoading] = useState(false)
  const [showModoPro, setShowModoPro] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.presupuesto_mensual || Number(formData.presupuesto_mensual) < 100000) {
      alert('Presupuesto minimo: $100.000 CLP')
      return false
    }
    if (!formData.ticket_promedio || Number(formData.ticket_promedio) < 1000) {
      alert('Ticket promedio debe ser mayor a $1.000 CLP')
      return false
    }
    if (!formData.capacidad_operativa || Number(formData.capacidad_operativa) < 1) {
      alert('Capacidad operativa debe ser al menos 1')
      return false
    }
    if (!formData.industria) {
      alert('Selecciona una industria')
      return false
    }
    return true
  }

  const ejecutarSimulacion = () => {
    if (!validateForm()) return

    setLoading(true)

    setTimeout(() => {
      const input: InputSimulador = {
        presupuesto_mensual: Number(formData.presupuesto_mensual),
        ticket_promedio: Number(formData.ticket_promedio),
        margen_bruto: formData.margen_bruto,
        conversion_sitio: formData.conversion_sitio,
        tasa_cierre: formData.tasa_cierre,
        capacidad_operativa: Number(formData.capacidad_operativa),
        nivel_competencia: formData.nivel_competencia,
        industria: formData.industria,
        variacion_mensual: formData.variacion_mensual,
        tolerancia_riesgo: formData.tolerancia_riesgo
      }

      const result = calcularDecisionInversion(input)
      setResultado(result)
      setLoading(false)

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 1500)
  }

  const resetSimulador = () => {
    if (confirm('Reiniciar simulador?')) {
      setFormData({
        presupuesto_mensual: '',
        ticket_promedio: '',
        margen_bruto: 40,
        conversion_sitio: 3,
        tasa_cierre: 10,
        capacidad_operativa: '',
        nivel_competencia: 'medio',
        industria: '',
        variacion_mensual: 15,
        tolerancia_riesgo: 'moderado'
      })
      setResultado(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 55) return 'text-blue-600'
    if (score >= 35) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'from-green-500 to-green-600'
    if (score >= 55) return 'from-blue-500 to-blue-600'
    if (score >= 35) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  const getCategoriaTexto = (categoria: ResultadoSimulador['categoria_score']) => {
    switch (categoria) {
      case 'EXCELENTE': return 'Decision solida'
      case 'VIABLE': return 'Viable con precauciones'
      case 'RIESGOSO': return 'Alto riesgo'
      case 'NO_RECOMENDADO': return 'No recomendado'
    }
  }

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'RESISTENTE': return 'bg-green-100 text-green-700 border-green-200'
      case 'REDUCCION': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'PERDIDA': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'QUIEBRA': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
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
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
            <Calculator className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 text-sm font-semibold">Simulador Anti-Humo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Tu negocio esta listo<br />para invertir en marketing?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Este simulador no te dice lo que quieres oir.<br />
            Te dice lo que necesitas saber.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Diagnosticos honestos</span>
            <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> Stress test incluido</span>
            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Score M&P</span>
          </div>
        </div>

        {/* Formulario */}
        {!resultado && !loading && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ingresa tus datos reales</h3>
            <p className="text-gray-500 mb-8">Sin datos reales, no hay diagnostico real. Se honesto.</p>

            <div className="space-y-6">
              {/* Industria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industria / Rubro
                </label>
                <select
                  value={formData.industria}
                  onChange={(e) => handleInputChange('industria', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Selecciona tu industria --</option>
                  {industries.map(ind => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>

              {/* Presupuesto y Ticket */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Presupuesto Mensual (CLP) *
                  </label>
                  <input
                    type="number"
                    value={formData.presupuesto_mensual}
                    onChange={(e) => handleInputChange('presupuesto_mensual', e.target.value)}
                    placeholder="Ej: 1500000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo inversion en ads, sin fees de agencia</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ticket Promedio (CLP) *
                  </label>
                  <input
                    type="number"
                    value={formData.ticket_promedio}
                    onChange={(e) => handleInputChange('ticket_promedio', e.target.value)}
                    placeholder="Ej: 250000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valor promedio de una venta</p>
                </div>
              </div>

              {/* Margen Bruto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Margen Bruto Real: {formData.margen_bruto}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={formData.margen_bruto}
                  onChange={(e) => handleInputChange('margen_bruto', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5% (bajo)</span>
                  <span className="text-yellow-600 font-medium">
                    {formData.margen_bruto < 25 ? '⚠️ Margen muy bajo' : ''}
                  </span>
                  <span>90% (alto)</span>
                </div>
              </div>

              {/* Conversion y Cierre */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Conversion Sitio/Landing: {formData.conversion_sitio}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={formData.conversion_sitio}
                    onChange={(e) => handleInputChange('conversion_sitio', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    % de visitantes que dejan sus datos (promedio: 2-4%)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tasa de Cierre Comercial: {formData.tasa_cierre}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={formData.tasa_cierre}
                    onChange={(e) => handleInputChange('tasa_cierre', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    % de leads que se convierten en clientes
                  </p>
                </div>
              </div>

              {/* Capacidad Operativa */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacidad Operativa Maxima (ventas/mes) *
                </label>
                <input
                  type="number"
                  value={formData.capacidad_operativa}
                  onChange={(e) => handleInputChange('capacidad_operativa', e.target.value)}
                  placeholder="Ej: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ¿Cuantos clientes REALMENTE puedes atender al mes con tu equipo actual?
                </p>
              </div>

              {/* Nivel de Competencia */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nivel de Competencia en tu Mercado
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['bajo', 'medio', 'alto'] as const).map(nivel => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => handleInputChange('nivel_competencia', nivel)}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                        formData.nivel_competencia === nivel
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                    >
                      {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Alta competencia = CPC mas caro (~40% mas)
                </p>
              </div>

              {/* Modo Pro Toggle */}
              <div className="border-t pt-6">
                <button
                  type="button"
                  onClick={() => setShowModoPro(!showModoPro)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showModoPro ? 'rotate-180' : ''}`} />
                  Modo Pro (parametros avanzados)
                </button>

                {showModoPro && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Variacion Mensual Esperada: ±{formData.variacion_mensual}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={formData.variacion_mensual}
                        onChange={(e) => handleInputChange('variacion_mensual', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tolerancia al Riesgo
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['conservador', 'moderado', 'agresivo'] as const).map(tol => (
                          <button
                            key={tol}
                            type="button"
                            onClick={() => handleInputChange('tolerancia_riesgo', tol)}
                            className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                              formData.tolerancia_riesgo === tol
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-600'
                            }`}
                          >
                            {tol.charAt(0).toUpperCase() + tol.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={ejecutarSimulacion}
              className="w-full mt-8 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Ejecutar Simulacion <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Este simulador puede decirte que NO inviertas. Esa es la idea.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-200">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Analizando coherencia del modelo...</p>
            <p className="text-sm text-gray-400 mt-2">Esto no es magia, son matematicas.</p>
          </div>
        )}

        {/* Resultados */}
        {resultado && (
          <div ref={resultsRef}>
            {/* Score Principal */}
            <div className={`bg-gradient-to-br ${getScoreBg(resultado.score_decision)} rounded-2xl p-8 text-white mb-8 shadow-xl`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Score M&P</p>
                  <div className="text-6xl font-bold">{resultado.score_decision}</div>
                  <p className="text-white/90 text-lg mt-2">{getCategoriaTexto(resultado.categoria_score)}</p>
                </div>
                <div className="text-center md:text-right">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">{resultado.ventas_estimadas.probable}</div>
                      <div className="text-sm text-white/80">Ventas/mes</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">${(resultado.utilidad_estimada.probable / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-white/80">Utilidad/mes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertas Criticas */}
            {resultado.alertas_criticas.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5" /> Alertas Criticas
                </h3>
                <ul className="space-y-2">
                  {resultado.alertas_criticas.map((alerta, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-700">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{alerta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metricas Clave */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <DollarSign className="w-4 h-4" /> CAC Efectivo
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${resultado.cac_efectivo.toLocaleString('es-CL')}
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Target className="w-4 h-4" /> Punto de Quiebre
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${resultado.punto_quiebre === Infinity ? '∞' : resultado.punto_quiebre.toLocaleString('es-CL')}
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Users className="w-4 h-4" /> Uso Capacidad
                </div>
                <div className={`text-2xl font-bold ${resultado.uso_capacidad > 100 ? 'text-red-600' : resultado.uso_capacidad > 80 ? 'text-yellow-600' : 'text-gray-900'}`}>
                  {resultado.uso_capacidad}%
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <TrendingUp className="w-4 h-4" /> Rango Utilidad
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${(resultado.utilidad_estimada.min / 1000).toFixed(0)}K - ${(resultado.utilidad_estimada.max / 1000).toFixed(0)}K
                </div>
              </div>
            </div>

            {/* Diagnosticos */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> Diagnostico
              </h3>
              <div className="space-y-4">
                {resultado.diagnosticos.map((diag, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border-l-4 ${
                      diag.tipo === 'critico' ? 'bg-red-50 border-red-500' :
                      diag.tipo === 'advertencia' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <p className={`font-semibold ${
                      diag.tipo === 'critico' ? 'text-red-800' :
                      diag.tipo === 'advertencia' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {diag.mensaje}
                    </p>
                    {diag.recomendacion && (
                      <p className="text-sm text-gray-600 mt-2">{diag.recomendacion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desglose Score */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
              <button
                onClick={() => toggleSection('desglose')}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" /> Desglose del Score
                </h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections['desglose'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['desglose'] && (
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Coherencia Economica', value: resultado.desglose_score.coherencia_economica, max: 30 },
                    { label: 'Riesgo Operativo', value: resultado.desglose_score.riesgo_operativo, max: 25 },
                    { label: 'Robustez Escenario', value: resultado.desglose_score.robustez_escenario, max: 25 },
                    { label: 'Dependencia Supuestos', value: resultado.desglose_score.dependencia_supuestos, max: 20 }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold">{item.value}/{item.max}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.value / item.max >= 0.7 ? 'bg-green-500' : item.value / item.max >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stress Test */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
              <button
                onClick={() => toggleSection('stress')}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" /> Stress Test (Eventos de Realidad)
                </h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections['stress'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['stress'] && (
                <div className="mt-4 space-y-3">
                  {resultado.stress_test.map((test, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{test.evento}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactoColor(test.impacto)}`}>
                          {test.impacto}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{test.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={test.nuevo_resultado < 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                          Nueva utilidad: ${test.nuevo_resultado.toLocaleString('es-CL')}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">Probabilidad: {test.probabilidad}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Supuestos y Limitaciones */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
              <button
                onClick={() => toggleSection('supuestos')}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Supuestos y Limitaciones (Transparencia)
                </h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections['supuestos'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['supuestos'] && (
                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-600 mb-2">Supuestos del modelo:</h4>
                    <ul className="space-y-1">
                      {resultado.supuestos.map((sup, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-slate-400">•</span> {sup}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-600 mb-2">Limitaciones:</h4>
                    <ul className="space-y-1">
                      {resultado.limitaciones.map((lim, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-slate-400">•</span> {lim}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Cierre */}
            <div className="bg-slate-800 rounded-2xl p-8 text-white text-center">
              <p className="text-lg mb-4">
                {resultado.categoria_score === 'NO_RECOMENDADO' || resultado.categoria_score === 'RIESGOSO'
                  ? 'Si este simulador no cerro, una agencia seria tampoco lo hara.'
                  : 'Los numeros cierran. Ahora depende de la ejecucion.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/56992258137?text=Hola!%20Acabo%20de%20usar%20el%20Simulador%20de%20Inversion%20y%20me%20gustaria%20conversar%20sobre%20mi%20caso."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-slate-800 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Hablar con M&P
                </a>
                <button
                  onClick={resetSimulador}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Nueva Simulacion
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 Muller y Perez · Simulador de Decisiones de Inversion Digital</p>
          <p className="mt-2 text-gray-400">Este simulador puede incomodar. Esa es la idea.</p>
        </div>
      </footer>
    </div>
  )
}
