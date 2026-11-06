'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'

interface Plataforma {
  id: string
  nombre: string
  checked: boolean
  distribucion: string
}

const plataformasDisponibles: Omit<Plataforma, 'checked' | 'distribucion'>[] = [
  { id: 'googleAds', nombre: 'Google Ads' },
  { id: 'metaAds', nombre: 'Meta Ads (Instagram/Facebook)' },
  { id: 'tiktokAds', nombre: 'TikTok Ads' },
  { id: 'linkedinAds', nombre: 'LinkedIn Ads' },
  { id: 'emailMarketing', nombre: 'Email Marketing' }
]

export default function CalculadoraCAC() {

  const cacSchema = createSoftwareAppSchema(
    'Calculadora CAC - Costo de Adquisición de Cliente',
    'Herramienta gratuita para calcular el CAC (Costo de Adquisición de Cliente) por plataforma publicitaria. Analiza Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads y Email Marketing. Incluye evaluación de ROI y recomendaciones estratégicas.',
    'https://www.mulleryperez.cl/utilidades/calculadora-cac'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Utilidades', url: 'https://www.mulleryperez.cl/utilidades' },
    { name: 'Calculadora CAC', url: 'https://www.mulleryperez.cl/utilidades/calculadora-cac' }
  ])

  const [inversion, setInversion] = useState('')
  const [ventas, setVentas] = useState('')
  const [ticketPromedio, setTicketPromedio] = useState('')
  const [plataformas, setPlataformas] = useState<Plataforma[]>(
    plataformasDisponibles.map(p => ({ ...p, checked: false, distribucion: '' }))
  )
  const [resultados, setResultados] = useState<any>(null)
  const [puedeCalcular, setPuedeCalcular] = useState(false)
  const [errorDistribucion, setErrorDistribucion] = useState(false)

  const plataformasActivas = plataformas.filter(p => p.checked)
  const necesitaDistribucion = plataformasActivas.length > 1

  useEffect(() => {
    verificarFormulario()
  }, [inversion, ventas, ticketPromedio, plataformas])

  const verificarFormulario = () => {
    const tieneInversion = inversion.trim() !== ''
    const tieneVentas = ventas.trim() !== ''
    const tieneTicket = ticketPromedio.trim() !== ''
    const tieneAlgunaPlataforma = plataformasActivas.length > 0

    let distribucionValida = true

    if (necesitaDistribucion) {
      distribucionValida = plataformasActivas.every(p => p.distribucion.trim() !== '')

      if (distribucionValida) {
        const suma = plataformasActivas.reduce((sum, p) => sum + parseInt(p.distribucion || '0'), 0)
        if (suma !== 100) {
          setErrorDistribucion(true)
          distribucionValida = false
        } else {
          setErrorDistribucion(false)
        }
      }
    } else {
      setErrorDistribucion(false)
    }

    setPuedeCalcular(tieneInversion && tieneVentas && tieneTicket && tieneAlgunaPlataforma && distribucionValida)
  }

  const handlePlataformaChange = (id: string) => {
    setPlataformas(prev => prev.map(p =>
      p.id === id ? { ...p, checked: !p.checked, distribucion: !p.checked ? p.distribucion : '' } : p
    ))
  }

  const handleDistribucionChange = (id: string, valor: string) => {
    const numerico = valor.replace(/\D/g, '')
    setPlataformas(prev => prev.map(p =>
      p.id === id ? { ...p, distribucion: numerico } : p
    ))
  }

  const formatCLP = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('es-CL')
  }

  const formatPorcentaje = (valor: number) => {
    return (valor * 100).toFixed(1) + '%'
  }

  const calcularResultados = () => {
    const inversionTotal = parseFloat(inversion)
    const ventasTotal = parseFloat(ventas)
    const ticketPromedioValor = parseFloat(ticketPromedio)

    const cacsCalculados: { [key: string]: number } = {}
    const ranking: { plataforma: string; cac: number; nombre: string }[] = []

    plataformasActivas.forEach(plataforma => {
      let inversionPlataforma = inversionTotal

      if (necesitaDistribucion) {
        const porcentaje = parseInt(plataforma.distribucion) / 100
        inversionPlataforma = inversionTotal * porcentaje
      }

      const cac = ventasTotal > 0 ? inversionPlataforma / ventasTotal : 0
      cacsCalculados[plataforma.id] = cac

      ranking.push({
        plataforma: plataforma.id,
        cac,
        nombre: plataforma.nombre
      })
    })

    ranking.sort((a, b) => a.cac - b.cac)

    const ingresos = ventasTotal * ticketPromedioValor
    const roi = (ingresos - inversionTotal) / inversionTotal

    let evaluacionTexto = ''
    let evaluacionColor = ''
    let evaluacionIcono = null

    if (roi > 0.5 && ranking[0]?.cac < (ticketPromedioValor * 0.3)) {
      evaluacionTexto = 'Excelente (CAC bajo y ROI alto)'
      evaluacionColor = 'text-emerald-600'
      evaluacionIcono = <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    } else if (roi > 0 && ranking[0]?.cac < ticketPromedioValor) {
      evaluacionTexto = 'Mejorable (CAC alto pero ROI aceptable)'
      evaluacionColor = 'text-amber-600'
      evaluacionIcono = <AlertCircle className="w-5 h-5 text-amber-600" />
    } else {
      evaluacionTexto = 'Pésimo (CAC > ticket promedio o ROI negativo)'
      evaluacionColor = 'text-red-600'
      evaluacionIcono = <AlertCircle className="w-5 h-5 text-red-600" />
    }

    let recomendacionTexto = ''

    if (ranking.length > 1 && (ranking[0].cac * 1.5 < ranking[ranking.length - 1].cac)) {
      recomendacionTexto = `Podrías redistribuir tu inversión: ${ranking[0].nombre} está rindiendo mejor que ${ranking[ranking.length - 1].nombre}.`
    } else if (ranking[0]?.cac > (ticketPromedioValor * 0.3)) {
      recomendacionTexto = "Si tu CAC supera el 30% de tu ticket promedio, considera mejorar tu segmentación o mensaje."
    } else {
      recomendacionTexto = "Tu estrategia actual se ve bien. Continúa monitoreando y optimizando tus campañas."
    }

    setResultados({
      cacs: cacsCalculados,
      roi,
      evaluacion: evaluacionTexto,
      evaluacionColor,
      evaluacionIcono,
      ranking,
      recomendacion: recomendacionTexto
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cacSchema) }}
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
            ¿Estás aprovechando bien<br />tu inversión en campañas?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Descubre en segundos si tus campañas digitales están rindiendo lo que deberían
          </p>
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel Inputs */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📥 Inputs
            </h3>

            {/* Inversión */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Inversión mensual total (CLP)
              </label>
              <input
                type="text"
                value={inversion}
                onChange={(e) => setInversion(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 500000"
              />
            </div>

            {/* Plataformas */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ¿En qué plataformas inviertes?
              </label>
              <div className="space-y-2">
                {plataformas.map(plataforma => (
                  <label key={plataforma.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={plataforma.checked}
                      onChange={() => handlePlataformaChange(plataforma.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {plataforma.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distribución */}
            {necesitaDistribucion && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Distribución % por plataforma
                </label>
                <div className="space-y-2">
                  {plataformasActivas.map(plataforma => (
                    <div key={plataforma.id} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 w-48">{plataforma.nombre}</span>
                      <input
                        type="text"
                        value={plataforma.distribucion}
                        onChange={(e) => handleDistribucionChange(plataforma.id, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  ))}
                </div>
                {errorDistribucion && (
                  <p className="text-red-600 text-sm mt-2">
                    La suma de la distribución debe ser exactamente 100%
                  </p>
                )}
              </div>
            )}

            {/* Ventas */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad de ventas mensuales obtenidas
              </label>
              <input
                type="text"
                value={ventas}
                onChange={(e) => setVentas(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 25"
              />
            </div>

            {/* Ticket Promedio */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ticket promedio por venta (CLP)
              </label>
              <input
                type="text"
                value={ticketPromedio}
                onChange={(e) => setTicketPromedio(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 50000"
              />
            </div>

            {/* Botón Calcular */}
            <button
              onClick={calcularResultados}
              disabled={!puedeCalcular}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
            >
              Calcular
            </button>
          </div>

          {/* Panel Resultados */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            {!resultados ? (
              <div className="h-full flex items-center justify-center text-center text-gray-500 min-h-[400px]">
                <p>Completa los campos y haz clic en "Calcular"<br />para ver tus resultados</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📊 Resultados
                </h3>

                {/* CAC por plataforma */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Costo de Adquisición (CAC)</h4>
                  <div className="space-y-2">
                    {resultados.ranking.map((item: any) => (
                      <div key={item.plataforma} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{item.nombre}</span>
                        <span className="text-sm font-bold text-gray-900">{formatCLP(item.cac)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROI */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">ROI estimado general</h4>
                  <div className={`text-3xl font-bold ${resultados.roi >= 0 ? 'text-emerald-600' : 'text-red-600'} flex items-center gap-2`}>
                    {resultados.roi >= 0 ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                    {formatPorcentaje(resultados.roi)}
                  </div>
                </div>

                {/* Evaluación */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Evaluación</h4>
                  <div className={`flex items-center gap-2 font-semibold ${resultados.evaluacionColor}`}>
                    {resultados.evaluacionIcono}
                    <span>{resultados.evaluacion}</span>
                  </div>
                </div>

                {/* Ranking */}
                {resultados.ranking.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Ranking de plataformas por rentabilidad</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {resultados.ranking.map((item: any, idx: number) => (
                        <li key={idx}>{item.nombre} - CAC: {formatCLP(item.cac)}</li>
                      ))}
                    </ol>
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
      </main>

      {/* Footer */}
      
      </div>
    </>
  )
}
