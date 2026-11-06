'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, TrendingUp, Users, AlertCircle, CheckCircle2, Target } from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'

export default function CalculadoraLTV() {

  const ltvSchema = createSoftwareAppSchema(
    'Calculadora LTV - Lifetime Value del Cliente',
    'Herramienta gratuita para calcular el LTV (Lifetime Value) de tus clientes. Proyecta ingresos a largo plazo, calcula tasa de retención, churn rate y evalúa la relación LTV/CAC. Ideal para negocios B2B y B2C.',
    'https://www.mulleryperez.cl/utilidades/calculadora-ltv'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Utilidades', url: 'https://www.mulleryperez.cl/utilidades' },
    { name: 'Calculadora LTV', url: 'https://www.mulleryperez.cl/utilidades/calculadora-ltv' }
  ])

  const [valorCompraPromedio, setValorCompraPromedio] = useState('')
  const [frecuenciaCompraAnual, setFrecuenciaCompraAnual] = useState('')
  const [vidaClienteAnios, setVidaClienteAnios] = useState('')
  const [margenGanancia, setMargenGanancia] = useState('')
  const [cacOptional, setCacOptional] = useState('')
  const [resultados, setResultados] = useState<any>(null)
  const [puedeCalcular, setPuedeCalcular] = useState(false)

  useEffect(() => {
    verificarFormulario()
  }, [valorCompraPromedio, frecuenciaCompraAnual, vidaClienteAnios, margenGanancia])

  const verificarFormulario = () => {
    const tieneValor = valorCompraPromedio.trim() !== ''
    const tieneFrecuencia = frecuenciaCompraAnual.trim() !== ''
    const tieneVida = vidaClienteAnios.trim() !== ''
    const tieneMargen = margenGanancia.trim() !== ''

    setPuedeCalcular(tieneValor && tieneFrecuencia && tieneVida && tieneMargen)
  }

  const formatCLP = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('es-CL')
  }

  const formatPorcentaje = (valor: number) => {
    return valor.toFixed(1) + '%'
  }

  const calcularResultados = () => {
    const valorCompra = parseFloat(valorCompraPromedio)
    const frecuencia = parseFloat(frecuenciaCompraAnual)
    const vidaAnios = parseFloat(vidaClienteAnios)
    const margen = parseFloat(margenGanancia) / 100
    const cac = cacOptional ? parseFloat(cacOptional) : 0

    // Cálculo de LTV básico
    // LTV = Valor promedio de compra × Frecuencia de compra anual × Vida del cliente en años
    const ltvBruto = valorCompra * frecuencia * vidaAnios

    // LTV neto (considerando margen de ganancia)
    const ltvNeto = ltvBruto * margen

    // Valor mensual del cliente
    const valorMensual = (valorCompra * frecuencia) / 12

    // Ingresos anuales por cliente
    const ingresosAnuales = valorCompra * frecuencia

    // Churn rate estimado (inverso de vida del cliente)
    const churnRate = (1 / vidaAnios) * 100

    // Tasa de retención
    const tasaRetencion = 100 - churnRate

    // Evaluar LTV/CAC ratio si se proporcionó CAC
    let ltvCacRatio = null
    let evaluacionLtvCac = ''
    let evaluacionColor = ''
    let evaluacionIcono = null

    if (cac > 0) {
      ltvCacRatio = ltvNeto / cac

      if (ltvCacRatio >= 3) {
        evaluacionLtvCac = 'Excelente (LTV/CAC ≥ 3:1)'
        evaluacionColor = 'text-emerald-600'
        evaluacionIcono = <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      } else if (ltvCacRatio >= 1) {
        evaluacionLtvCac = 'Aceptable (LTV/CAC entre 1:1 y 3:1)'
        evaluacionColor = 'text-amber-600'
        evaluacionIcono = <AlertCircle className="w-5 h-5 text-amber-600" />
      } else {
        evaluacionLtvCac = 'Crítico (LTV/CAC < 1:1)'
        evaluacionColor = 'text-red-600'
        evaluacionIcono = <AlertCircle className="w-5 h-5 text-red-600" />
      }
    }

    // Evaluación de retención
    let evaluacionRetencion = ''
    if (tasaRetencion >= 80) {
      evaluacionRetencion = 'Excelente retención (>80%)'
    } else if (tasaRetencion >= 60) {
      evaluacionRetencion = 'Buena retención (60-80%)'
    } else if (tasaRetencion >= 40) {
      evaluacionRetencion = 'Retención regular (40-60%)'
    } else {
      evaluacionRetencion = 'Baja retención (<40%)'
    }

    // Recomendaciones
    let recomendacion = ''

    if (ltvCacRatio && ltvCacRatio < 1) {
      recomendacion = '⚠️ Urgente: Tu CAC es mayor que el LTV. Reduce costos de adquisición o mejora la retención y el valor de vida del cliente inmediatamente.'
    } else if (ltvCacRatio && ltvCacRatio < 3) {
      recomendacion = '📈 Necesitas optimizar: Aumenta la frecuencia de compra mediante programas de fidelización, upselling o cross-selling. También considera mejorar la retención.'
    } else if (tasaRetencion < 60) {
      recomendacion = '🎯 Enfócate en retención: Tu churn rate es alto. Implementa programas de lealtad, mejora el servicio postventa y mantén comunicación regular con clientes.'
    } else if (ltvCacRatio && ltvCacRatio >= 3) {
      recomendacion = '✅ Excelente desempeño: Tu LTV justifica ampliamente el CAC. Puedes escalar la adquisición de clientes con confianza.'
    } else {
      recomendacion = '💡 Vas bien: Considera estrategias para aumentar el ticket promedio o la frecuencia de compra para maximizar el LTV.'
    }

    setResultados({
      ltvBruto,
      ltvNeto,
      valorMensual,
      ingresosAnuales,
      churnRate,
      tasaRetencion,
      ltvCacRatio,
      evaluacionLtvCac,
      evaluacionRetencion,
      evaluacionColor,
      evaluacionIcono,
      recomendacion
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ltvSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-sm">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200 text-sm font-semibold">Herramienta Gratuita</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Cuánto vale realmente<br />cada cliente para tu negocio?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Calcula el Lifetime Value (LTV) y proyecta los ingresos que generará cada cliente a largo plazo
          </p>
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel Inputs */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📥 Datos de tus clientes
            </h3>

            {/* Valor Compra Promedio */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor promedio de compra (CLP)
              </label>
              <input
                type="text"
                value={valorCompraPromedio}
                onChange={(e) => setValorCompraPromedio(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 50000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ticket promedio por transacción
              </p>
            </div>

            {/* Frecuencia Compra Anual */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Frecuencia de compra anual
              </label>
              <input
                type="text"
                value={frecuenciaCompraAnual}
                onChange={(e) => setFrecuenciaCompraAnual(e.target.value.replace(/[^\d.]/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 4"
              />
              <p className="text-xs text-gray-500 mt-1">
                ¿Cuántas veces al año compra un cliente? (puede ser decimal)
              </p>
            </div>

            {/* Vida Cliente Años */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vida del cliente (años)
              </label>
              <input
                type="text"
                value={vidaClienteAnios}
                onChange={(e) => setVidaClienteAnios(e.target.value.replace(/[^\d.]/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 3"
              />
              <p className="text-xs text-gray-500 mt-1">
                ¿Cuántos años se mantiene activo un cliente promedio?
              </p>
            </div>

            {/* Margen de Ganancia */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Margen de ganancia (%)
              </label>
              <input
                type="text"
                value={margenGanancia}
                onChange={(e) => setMargenGanancia(e.target.value.replace(/[^\d.]/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 40"
              />
              <p className="text-xs text-gray-500 mt-1">
                Porcentaje de ganancia después de costos
              </p>
            </div>

            {/* CAC (Opcional) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CAC - Costo de Adquisición (opcional)
              </label>
              <input
                type="text"
                value={cacOptional}
                onChange={(e) => setCacOptional(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 20000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Costo para adquirir un cliente (para calcular LTV/CAC ratio)
              </p>
            </div>

            {/* Botón Calcular */}
            <button
              onClick={calcularResultados}
              disabled={!puedeCalcular}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
            >
              Calcular LTV
            </button>
          </div>

          {/* Panel Resultados */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            {!resultados ? (
              <div className="h-full flex items-center justify-center text-center text-gray-500 min-h-[400px]">
                <p>Completa los datos de tus clientes y haz clic en "Calcular"<br />para ver tus resultados</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📊 Valor de tus clientes
                </h3>

                {/* LTV Neto */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">LTV Neto (Lifetime Value)</h4>
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {formatCLP(resultados.ltvNeto)}
                  </div>
                  <p className="text-xs text-gray-600">
                    Ganancia real por cliente durante su vida
                  </p>
                </div>

                {/* LTV Bruto */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">LTV Bruto</h4>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCLP(resultados.ltvBruto)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ingresos totales antes de costos
                  </p>
                </div>

                {/* Ingresos Anuales */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingresos anuales por cliente</h4>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCLP(resultados.ingresosAnuales)}
                  </div>
                </div>

                {/* Valor Mensual */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Valor mensual por cliente</h4>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCLP(resultados.valorMensual)}
                  </div>
                </div>

                {/* Retención y Churn */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Métricas de retención</h4>
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tasa de retención</p>
                      <p className="text-lg font-bold text-emerald-600">{formatPorcentaje(resultados.tasaRetencion)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Churn rate</p>
                      <p className="text-lg font-bold text-red-600">{formatPorcentaje(resultados.churnRate)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{resultados.evaluacionRetencion}</p>
                </div>

                {/* LTV/CAC Ratio */}
                {resultados.ltvCacRatio !== null && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Relación LTV/CAC</h4>
                    <div className="flex items-center gap-2 mb-2">
                      {resultados.evaluacionIcono}
                      <span className="text-2xl font-bold text-blue-600">
                        {resultados.ltvCacRatio.toFixed(2)}:1
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${resultados.evaluacionColor}`}>
                      {resultados.evaluacionLtvCac}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Por cada peso invertido en adquirir un cliente, generas {resultados.ltvCacRatio.toFixed(2)} pesos de ganancia
                    </p>
                  </div>
                )}

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
          <h3 className="text-2xl font-bold text-white mb-6">¿Qué es el LTV y por qué importa?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Lifetime Value (LTV)</h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                Es el ingreso total que genera un cliente durante toda su relación con tu negocio.
                Te ayuda a entender cuánto puedes invertir para adquirir clientes de forma rentable.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-2">LTV/CAC Ratio</h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                Compara el valor de vida del cliente con el costo de adquisición. Un ratio 3:1 o mayor
                indica que tu modelo de negocio es sostenible y escalable.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-2">Churn Rate</h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                Es el porcentaje de clientes que dejan de comprar cada año. Reducir el churn aumenta
                dramáticamente el LTV y la rentabilidad del negocio.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      
      </div>
    </>
  )
}
