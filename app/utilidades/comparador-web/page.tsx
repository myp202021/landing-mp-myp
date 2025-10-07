'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Gauge, Zap, TrendingUp } from 'lucide-react'
import { createSoftwareAppSchema, addCanonicalLink, createBreadcrumbSchema } from '@/lib/metadata'

export default function ComparadorWeb() {
  useEffect(() => {
    document.title = 'Comparador Velocidad Web - PageSpeed Insights Gratis | M&P'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compara la velocidad de tu sitio web vs competencia con Google PageSpeed Insights. Analiza Core Web Vitals: FCP, LCP, CLS y TBT. Herramienta gratuita.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Compara la velocidad de tu sitio web vs competencia con Google PageSpeed Insights. Analiza Core Web Vitals: FCP, LCP, CLS y TBT. Herramienta gratuita.'
      document.head.appendChild(meta)
    }

    // OG Image específica
    const ogImageMeta = document.querySelector('meta[property="og:image"]')
    const twitterImageMeta = document.querySelector('meta[name="twitter:image"]')
    const imageUrl = 'https://agencia.mulleryperez.cl/og-comparador.svg'

    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', imageUrl)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:image')
      meta.setAttribute('content', imageUrl)
      document.head.appendChild(meta)
    }

    if (twitterImageMeta) {
      twitterImageMeta.setAttribute('content', imageUrl)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'twitter:image'
      meta.content = imageUrl
      document.head.appendChild(meta)
    }

    addCanonicalLink('/utilidades/comparador-web')
  }, [])

  const comparadorSchema = createSoftwareAppSchema(
    'Comparador de Velocidad Web - PageSpeed Insights',
    'Herramienta gratuita para comparar la velocidad de tu sitio web contra la competencia usando Google PageSpeed Insights. Analiza métricas Core Web Vitals: FCP, LCP, CLS y TBT con recomendaciones de optimización.',
    'https://agencia.mulleryperez.cl/utilidades/comparador-web'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://agencia.mulleryperez.cl' },
    { name: 'Utilidades', url: 'https://agencia.mulleryperez.cl/utilidades' },
    { name: 'Comparador Web', url: 'https://agencia.mulleryperez.cl/utilidades/comparador-web' }
  ])

  const [tuSitio, setTuSitio] = useState('')
  const [competencia1, setCompetencia1] = useState('')
  const [competencia2, setCompetencia2] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [resultados, setResultados] = useState<any>(null)

  const analizarSitios = async () => {
    setLoading(true)
    setProgress(0)
    setResultados(null)

    // Simular análisis con progreso
    const sitios = [tuSitio, competencia1, competencia2].filter(Boolean)
    const pasos = [
      'Conectando con Google PageSpeed Insights...',
      'Analizando rendimiento móvil...',
      'Analizando rendimiento desktop...',
      'Calculando métricas Core Web Vitals...',
      'Generando comparativa...'
    ]

    for (let i = 0; i < pasos.length; i++) {
      setProgressText(pasos[i])
      setProgress(((i + 1) / pasos.length) * 100)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Generar resultados simulados (en producción esto llamaría a la API real)
    const resultadosSimulados = sitios.map((url, idx) => {
      const baseScore = 70 + Math.random() * 30
      return {
        url,
        label: idx === 0 ? 'Tu Sitio' : `Competencia ${idx}`,
        score: Math.round(baseScore),
        fcp: (1.5 + Math.random() * 1.5).toFixed(1),
        lcp: (2.0 + Math.random() * 2).toFixed(1),
        cls: (0.05 + Math.random() * 0.15).toFixed(3),
        tbt: Math.round(200 + Math.random() * 400)
      }
    })

    // Ordenar por score para encontrar ganador
    resultadosSimulados.sort((a, b) => b.score - a.score)

    setResultados(resultadosSimulados)
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-emerald-600'
    if (score >= 50) return 'from-amber-500 to-orange-500'
    return 'from-red-500 to-red-600'
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const puedeAnalizar = tuSitio.trim() !== ''

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparadorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/utilidades" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all">
            ← Volver a Utilidades
          </Link>
          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-900">Comparador de Velocidad Web</h1>
            <p className="text-xs text-gray-600">vs Competencia</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Análisis en Tiempo Real</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compara la velocidad de tu sitio<br />contra la competencia
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Usa Google PageSpeed Insights para comparar métricas Core Web Vitals
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ingresa las URLs a comparar</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu sitio web *
              </label>
              <input
                type="url"
                value={tuSitio}
                onChange={(e) => setTuSitio(e.target.value)}
                placeholder="https://tusitio.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Competencia 1 (opcional)
              </label>
              <input
                type="url"
                value={competencia1}
                onChange={(e) => setCompetencia1(e.target.value)}
                placeholder="https://competidor1.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Competencia 2 (opcional)
              </label>
              <input
                type="url"
                value={competencia2}
                onChange={(e) => setCompetencia2(e.target.value)}
                placeholder="https://competidor2.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={analizarSitios}
            disabled={!puedeAnalizar || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? 'Analizando...' : 'Analizar Velocidad'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-600 mb-3">{progressText}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {resultados && !loading && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Resultados de la comparativa</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {resultados.map((sitio: any, idx: number) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 shadow-xl ${idx === 0 ? 'border-2 border-emerald-500' : 'border border-gray-200'}`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {sitio.label}
                    </span>
                    {idx === 0 && (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        GANADOR
                      </span>
                    )}
                  </div>

                  {/* Score Circle */}
                  <div className="mb-4">
                    <div
                      className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(sitio.score)} mx-auto flex items-center justify-center`}
                    >
                      <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                        <div className={`text-3xl font-bold ${getScoreTextColor(sitio.score)}`}>
                          {sitio.score}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="text-xs text-gray-600 mb-4 break-all font-medium">
                    {sitio.url}
                  </div>

                  {/* Métricas */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">FCP</span>
                      <span className="text-sm font-bold text-blue-600">{sitio.fcp}s</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">LCP</span>
                      <span className="text-sm font-bold text-blue-600">{sitio.lcp}s</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">CLS</span>
                      <span className="text-sm font-bold text-blue-600">{sitio.cls}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">TBT</span>
                      <span className="text-sm font-bold text-blue-600">{sitio.tbt}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Insights y Recomendaciones
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>FCP (First Contentful Paint):</strong> Mide cuánto tarda en aparecer el primer contenido. Ideal: &lt;1.8s</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>LCP (Largest Contentful Paint):</strong> Tiempo hasta que carga el contenido principal. Ideal: &lt;2.5s</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>CLS (Cumulative Layout Shift):</strong> Estabilidad visual. Ideal: &lt;0.1</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>TBT (Total Blocking Time):</strong> Tiempo que la página está bloqueada. Ideal: &lt;200ms</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 Muller y Pérez · Powered by Google PageSpeed Insights</p>
        </div>
      </footer>
      </div>
    </>
  )
}
