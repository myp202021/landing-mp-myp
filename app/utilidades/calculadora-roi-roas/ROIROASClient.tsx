'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'

export default function CalculadoraROIROAS() {

  const roiRoasSchema = createSoftwareAppSchema(
    'Calculadora ROI ROAS - Rentabilidad de Inversión Publicitaria',
    'Herramienta gratuita para calcular el ROI (Return on Investment) y ROAS (Return on Ad Spend) de tus campañas publicitarias. Analiza rentabilidad, márgenes y optimiza tu inversión en Google Ads, Meta Ads, LinkedIn Ads y más.',
    'https://www.mulleryperez.cl/utilidades/calculadora-roi-roas'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Utilidades', url: 'https://www.mulleryperez.cl/utilidades' },
    { name: 'Calculadora ROI ROAS', url: 'https://www.mulleryperez.cl/utilidades/calculadora-roi-roas' }
  ])

  const [inversionPublicitaria, setInversionPublicitaria] = useState('')
  const [ingresosGenerados, setIngresosGenerados] = useState('')
  const [costoOperacional, setCostoOperacional] = useState('')
  const [resultados, setResultados] = useState<any>(null)
  const [puedeCalcular, setPuedeCalcular] = useState(false)

  useEffect(() => {
    verificarFormulario()
  }, [inversionPublicitaria, ingresosGenerados, costoOperacional])

  const verificarFormulario = () => {
    const tieneInversion = inversionPublicitaria.trim() !== ''
    const tieneIngresos = ingresosGenerados.trim() !== ''
    const tieneCosto = costoOperacional.trim() !== ''

    setPuedeCalcular(tieneInversion && tieneIngresos && tieneCosto)
  }

  const formatCLP = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('es-CL')
  }

  const formatPorcentaje = (valor: number) => {
    return (valor * 100).toFixed(1) + '%'
  }

  const calcularResultados = () => {
    const inversion = parseFloat(inversionPublicitaria)
    const ingresos = parseFloat(ingresosGenerados)
    const costos = parseFloat(costoOperacional)

    // Cálculo de ROAS (Return on Ad Spend)
    const roas = ingresos / inversion

    // Cálculo de ganancia neta
    const gananciaNeta = ingresos - inversion - costos

    // Cálculo de ROI (Return on Investment)
    const roi = gananciaNeta / (inversion + costos)

    // Cálculo de margen de ganancia
    const margenGanancia = gananciaNeta / ingresos

    // Punto de equilibrio (cuánto necesitas vender para no perder)
    const puntoEquilibrio = inversion + costos

    // Evaluación de resultados
    let evaluacionROI = ''
    let evaluacionROAS = ''
    let evaluacionColor = ''
    let evaluacionIcono = null

    // Evaluar ROI
    if (roi > 1) {
      evaluacionROI = 'Excelente (ROI > 100%)'
      evaluacionColor = 'text-emerald-600'
      evaluacionIcono = <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    } else if (roi > 0) {
      evaluacionROI = 'Positivo pero mejorable (0% < ROI < 100%)'
      evaluacionColor = 'text-amber-600'
      evaluacionIcono = <AlertCircle className="w-5 h-5 text-amber-600" />
    } else {
      evaluacionROI = 'Negativo - Estás perdiendo dinero'
      evaluacionColor = 'text-red-600'
      evaluacionIcono = <AlertCircle className="w-5 h-5 text-red-600" />
    }

    // Evaluar ROAS
    if (roas >= 4) {
      evaluacionROAS = 'Excelente (ROAS ≥ 4)'
    } else if (roas >= 2) {
      evaluacionROAS = 'Bueno (ROAS entre 2-4)'
    } else if (roas >= 1) {
      evaluacionROAS = 'Bajo (ROAS entre 1-2)'
    } else {
      evaluacionROAS = 'Crítico (ROAS < 1)'
    }

    // Recomendaciones
    let recomendacion = ''

    if (roi < 0) {
      recomendacion = '⚠️ Urgente: Estás perdiendo dinero. Revisa tu segmentación, mensaje publicitario y proceso de venta. Considera pausar campañas de bajo rendimiento.'
    } else if (roi < 0.5 && roas < 2) {
      recomendacion = '📉 Necesitas optimizar: Tu rentabilidad es baja. Prueba mejorar la tasa de conversión, reducir costos operacionales o aumentar el ticket promedio.'
    } else if (roas < 3) {
      recomendacion = '📊 Vas bien pero hay espacio para crecer: Considera hacer A/B testing en tus anuncios, mejorar la landing page o refinar tu audiencia objetivo.'
    } else {
      recomendacion = '✅ Excelente desempeño: Tu estrategia funciona. Mantén el monitoreo constante y considera escalar la inversión gradualmente.'
    }

    setResultados({
      roas,
      roi,
      gananciaNeta,
      margenGanancia,
      puntoEquilibrio,
      evaluacionROI,
      evaluacionROAS,
      evaluacionColor,
      evaluacionIcono,
      recomendacion
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roiRoasSchema) }}
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
          <Link href="/utilidades" className="text-white font-semibold text-sm hover:text-emerald-300 transition-colors">
            ← Volver
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-sm">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200 text-sm font-semibold">Herramienta Gratuita</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Cuánto estás ganando<br />realmente con tus campañas?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Calcula tu ROI y ROAS en segundos y descubre si tus campañas son rentables
          </p>
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel Inputs */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📥 Datos de tu campaña
            </h3>

            {/* Inversión Publicitaria */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Inversión en publicidad (CLP)
              </label>
              <input
                type="text"
                value={inversionPublicitaria}
                onChange={(e) => setInversionPublicitaria(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 500000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gasto total en ads (Google, Meta, LinkedIn, etc.)
              </p>
            </div>

            {/* Ingresos Generados */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ingresos generados (CLP)
              </label>
              <input
                type="text"
                value={ingresosGenerados}
                onChange={(e) => setIngresosGenerados(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 2000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ventas totales atribuidas a las campañas
              </p>
            </div>

            {/* Costo Operacional */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Costos operacionales (CLP)
              </label>
              <input
                type="text"
                value={costoOperacional}
                onChange={(e) => setCostoOperacional(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 800000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Costos de productos, servicios, logística, etc.
              </p>
            </div>

            {/* Botón Calcular */}
            <button
              onClick={calcularResultados}
              disabled={!puedeCalcular}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
            >
              Calcular ROI y ROAS
            </button>
          </div>

          {/* Panel Resultados */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            {!resultados ? (
              <div className="h-full flex items-center justify-center text-center text-gray-500 min-h-[400px]">
                <p>Completa los datos de tu campaña y haz clic en "Calcular"<br />para ver tus resultados</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📊 Tus métricas
                </h3>

                {/* ROAS */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">ROAS (Return on Ad Spend)</h4>
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {resultados.roas.toFixed(2)}x
                  </div>
                  <p className="text-xs text-gray-600">{resultados.evaluacionROAS}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Por cada $1 invertido en ads, generas ${resultados.roas.toFixed(2)}
                  </p>
                </div>

                {/* ROI */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">ROI (Return on Investment)</h4>
                    {resultados.roi >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${resultados.roi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatPorcentaje(resultados.roi)}
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-semibold ${resultados.evaluacionColor}`}>
                    {resultados.evaluacionIcono}
                    <span>{resultados.evaluacionROI}</span>
                  </div>
                </div>

                {/* Ganancia Neta */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ganancia neta</h4>
                  <div className={`text-2xl font-bold ${resultados.gananciaNeta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCLP(resultados.gananciaNeta)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ingresos - Inversión - Costos
                  </p>
                </div>

                {/* Margen de Ganancia */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Margen de ganancia</h4>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPorcentaje(resultados.margenGanancia)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Porcentaje de ganancia sobre ventas totales
                  </p>
                </div>

                {/* Punto de Equilibrio */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Punto de equilibrio</h4>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCLP(resultados.puntoEquilibrio)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Necesitas vender esto para no perder dinero
                  </p>
                </div>

                {/* Recomendación */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Recomendación</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">{resultados.recomendacion}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información educativa */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">¿Qué significan estas métricas?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-2">ROI (Return on Investment)</h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                Mide la rentabilidad total considerando todos los costos. Un ROI de 100% significa que duplicaste tu inversión.
                Es la métrica más importante para evaluar la salud financiera real de tus campañas.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-2">ROAS (Return on Ad Spend)</h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                Mide cuántos ingresos generas por cada peso invertido en publicidad. Un ROAS de 4x significa que por cada $1 en ads,
                generas $4 en ventas. Útil para comparar plataformas publicitarias.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-purple-300 text-sm">
          <p>© 2024 Muller y Pérez · Calculadora ROI ROAS con fórmulas reales</p>
        </div>
      </footer>
      </div>
    </>
  )
}
