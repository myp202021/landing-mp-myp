'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3, TrendingUp } from 'lucide-react'
import { createSoftwareAppSchema, addCanonicalLink, createBreadcrumbSchema } from '@/lib/metadata'

interface IndustryData {
  nombre: string
  madurez: number
  nivel: 'avanzado' | 'intermedio' | 'basico'
  ranking: number
  metrics: number[]
  metricNames: string[]
  stats: { inversion: string; cac: string; ticket: string }
  recs: { titulo: string; desc: string }[]
}

const industriasData: { [key: string]: IndustryData } = {
  tecnologia: {
    nombre: 'Tecnología',
    madurez: 71,
    nivel: 'avanzado',
    ranking: 1,
    metrics: [85, 80, 75, 90, 76, 82],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$4.5M', cac: '$4,500', ticket: '$30,000' },
    recs: [
      { titulo: 'Optimiza velocidad móvil', desc: 'Reduce tiempo de carga a <3s para mejorar conversión 25%' },
      { titulo: 'Implementa marketing de contenidos', desc: 'Blog técnico + whitepapers aumentan leads calificados 40%' },
      { titulo: 'Aprovecha LinkedIn Ads', desc: 'B2B tech: CPL 30% menor que Google Ads, mayor calidad' }
    ]
  },
  banca: {
    nombre: 'Banca y Finanzas',
    madurez: 68,
    nivel: 'avanzado',
    ranking: 2,
    metrics: [82, 78, 80, 88, 72, 75],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$8.2M', cac: '$8,200', ticket: '$95,000' },
    recs: [
      { titulo: 'Refuerza seguridad percibida', desc: 'Certificados SSL, badges de seguridad aumentan confianza 35%' },
      { titulo: 'Video marketing educativo', desc: 'Tutoriales productos financieros mejoran engagement 50%' },
      { titulo: 'Retargeting inteligente', desc: 'Audiencias segmentadas por producto aumentan ROI 45%' }
    ]
  },
  retail: {
    nombre: 'Retail y E-commerce',
    madurez: 65,
    nivel: 'intermedio',
    ranking: 3,
    metrics: [78, 82, 70, 85, 68, 80],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$6.8M', cac: '$2,100', ticket: '$18,500' },
    recs: [
      { titulo: 'Shopping Ads avanzado', desc: 'Feed optimizado + smart bidding aumenta ROAS 60%' },
      { titulo: 'Personalización web', desc: 'Recomendaciones IA aumentan ticket promedio 28%' },
      { titulo: 'Email automation', desc: 'Carritos abandonados + cross-sell recuperan 22% ventas' }
    ]
  },
  salud: {
    nombre: 'Salud y Medicina',
    madurez: 58,
    nivel: 'intermedio',
    ranking: 4,
    metrics: [65, 70, 68, 75, 55, 72],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$3.2M', cac: '$5,800', ticket: '$42,000' },
    recs: [
      { titulo: 'Google My Business PRO', desc: 'Optimiza fichas + posts semanales aumenta consultas 45%' },
      { titulo: 'Contenido de autoridad', desc: 'Blog médico + videos especialistas mejoran SEO 40%' },
      { titulo: 'Campañas locales', desc: 'Radio 5km + horarios estratégicos aumentan reservas 35%' }
    ]
  },
  educacion: {
    nombre: 'Educación',
    madurez: 55,
    nivel: 'intermedio',
    ranking: 5,
    metrics: [60, 65, 62, 72, 58, 68],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$2.8M', cac: '$3,500', ticket: '$28,000' },
    recs: [
      { titulo: 'Webinars como lead magnet', desc: 'Clases demo online generan leads 3x más calificados' },
      { titulo: 'YouTube SEO', desc: 'Canal educativo optimizado aumenta inscripciones 38%' },
      { titulo: 'Remarketing secuencial', desc: 'Nurturing 14 días aumenta conversión 42%' }
    ]
  },
  inmobiliaria: {
    nombre: 'Inmobiliaria',
    madurez: 52,
    nivel: 'intermedio',
    ranking: 6,
    metrics: [58, 62, 60, 68, 48, 65],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$4.5M', cac: '$12,000', ticket: '$185,000' },
    recs: [
      { titulo: 'Tours virtuales 360°', desc: 'Reduce visitas innecesarias 40%, mejora calidad leads' },
      { titulo: 'Facebook + Instagram Ads', desc: 'Carousel propiedades + geolocalización aumenta consultas 50%' },
      { titulo: 'CRM inmobiliario', desc: 'Automatización seguimiento aumenta cierre 32%' }
    ]
  },
  automotriz: {
    nombre: 'Automotriz',
    madurez: 48,
    nivel: 'basico',
    ranking: 7,
    metrics: [55, 58, 52, 65, 42, 60],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$5.5M', cac: '$15,000', ticket: '$12.5M' },
    recs: [
      { titulo: 'Video marketing vehicular', desc: 'Test drives virtuales aumentan consultas 45%' },
      { titulo: 'Lead scoring avanzado', desc: 'Califica intención compra, prioriza seguimiento vendedores' },
      { titulo: 'Google Ads inventario', desc: 'Feed vehículos + Vehicle Ads aumenta showroom 38%' }
    ]
  },
  turismo: {
    nombre: 'Turismo',
    madurez: 45,
    nivel: 'basico',
    ranking: 8,
    metrics: [50, 55, 48, 62, 40, 58],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$3.8M', cac: '$4,200', ticket: '$38,000' },
    recs: [
      { titulo: 'UGC y social proof', desc: 'Reviews + fotos clientes aumentan conversión 52%' },
      { titulo: 'Google Travel Ads', desc: 'Hotel Ads + vuelos aumenta reservas directas 40%' },
      { titulo: 'Email estacional', desc: 'Campañas temporada alta/baja optimizan ocupación' }
    ]
  },
  construccion: {
    nombre: 'Construcción',
    madurez: 42,
    nivel: 'basico',
    ranking: 9,
    metrics: [45, 50, 45, 58, 38, 55],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$2.2M', cac: '$8,500', ticket: '$125,000' },
    recs: [
      { titulo: 'Portfolio digital', desc: 'Galería proyectos + testimonios aumenta cotizaciones 48%' },
      { titulo: 'LinkedIn B2B', desc: 'Networking empresas constructoras genera proyectos grandes' },
      { titulo: 'WhatsApp Business', desc: 'Chat proactivo aumenta conversión cotizaciones 35%' }
    ]
  },
  gastronomia: {
    nombre: 'Gastronomía',
    madurez: 38,
    nivel: 'basico',
    ranking: 10,
    metrics: [40, 48, 42, 55, 35, 52],
    metricNames: ['Google Ads', 'Competencia', 'ROAS', 'Plataformas', 'IA', 'Velocidad'],
    stats: { inversion: '$1.8M', cac: '$1,200', ticket: '$8,500' },
    recs: [
      { titulo: 'Instagram + TikTok Food', desc: 'Contenido visual aumenta pedidos online 65%' },
      { titulo: 'Google My Business + pedidos', desc: 'Integración delivery aumenta órdenes directas 42%' },
      { titulo: 'Programas de fidelización', desc: 'App loyalty + promociones aumenta recurrencia 55%' }
    ]
  }
}

export default function RadarIndustrias() {
  useEffect(() => {
    document.title = 'Radar de Industrias Chile 2024 - Madurez Digital | M&P Labs'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Análisis de madurez digital por industria en Chile 2024. Compara Google Ads, ROAS, plataformas digitales, IA y velocidad web por sector.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Análisis de madurez digital por industria en Chile 2024. Compara Google Ads, ROAS, plataformas digitales, IA y velocidad web por sector.'
      document.head.appendChild(meta)
    }

    // OG Image específica
    const ogImageMeta = document.querySelector('meta[property="og:image"]')
    const twitterImageMeta = document.querySelector('meta[name="twitter:image"]')
    const imageUrl = 'https://www.mulleryperez.cl/og-radar.svg'

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

    addCanonicalLink('/labs/radar-industrias')
  }, [])

  const radarSchema = createSoftwareAppSchema(
    'Radar de Industrias - Análisis de Madurez Digital Chile',
    'Herramienta de análisis de madurez digital por industria en Chile 2024. Evalúa 10 sectores clave en Google Ads, competencia, ROAS, plataformas digitales, implementación de IA, velocidad web y Google My Business con recomendaciones estratégicas.',
    'https://www.mulleryperez.cl/labs/radar-industrias'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'M&P Labs', url: 'https://www.mulleryperez.cl/labs' },
    { name: 'Radar Industrias', url: 'https://www.mulleryperez.cl/labs/radar-industrias' }
  ])

  const [selectedIndustry, setSelectedIndustry] = useState('tecnologia')
  const currentData = industriasData[selectedIndustry]

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const createRadarPoints = () => {
    const centerX = 200
    const centerY = 200
    const maxRadius = 160
    const angleStep = 60

    return currentData.metrics.map((value, index) => {
      const angle = index * angleStep
      const radius = (value / 100) * maxRadius
      const point = polarToCartesian(centerX, centerY, radius, angle)
      return `${point.x},${point.y}`
    }).join(' ')
  }

  const getNivelColor = (nivel: string) => {
    switch(nivel) {
      case 'avanzado': return 'bg-green-100 text-green-700'
      case 'intermedio': return 'bg-yellow-100 text-yellow-700'
      case 'basico': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(radarSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo-color.png" alt="M&P Logo" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <Link href="/labs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            ← Volver
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Chile 2024</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Radar de Madurez Digital<br />por Industria
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Análisis de 10 sectores clave evaluando efectividad en Google Ads, competencia, ROAS, plataformas digitales, IA, velocidad web y Google My Business
          </p>
        </div>

        {/* Industry Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(industriasData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedIndustry(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedIndustry === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {data.nombre}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 mb-8">
          {/* Madurez Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div
              className="w-44 h-44 mx-auto rounded-full flex items-center justify-center mb-4 transition-all"
              style={{
                background: `conic-gradient(#667eea 0% ${currentData.madurez}%, #f5f7fa ${currentData.madurez}%)`
              }}
            >
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-blue-600">{currentData.madurez}</div>
                <div className="text-sm text-gray-600">Madurez</div>
              </div>
            </div>
            <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${getNivelColor(currentData.nivel)}`}>
              Nivel {currentData.nivel.charAt(0).toUpperCase() + currentData.nivel.slice(1)}
            </div>
            <div className="text-gray-600 text-sm mt-2">
              Ranking: #{currentData.ranking} de 10
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Métricas de Performance Digital</h3>

            <svg className="w-full max-w-md mx-auto mb-6" viewBox="0 0 400 400">
              {/* Grid circles */}
              {[160, 120, 80, 40].map((r, i) => (
                <circle key={i} cx="200" cy="200" r={r} fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              ))}

              {/* Axes */}
              {currentData.metrics.map((_, index) => {
                const angle = index * 60
                const end = polarToCartesian(200, 200, 160, angle)
                return (
                  <line
                    key={index}
                    x1="200"
                    y1="200"
                    x2={end.x}
                    y2={end.y}
                    stroke="#cbd5e0"
                    strokeWidth="1"
                  />
                )
              })}

              {/* Labels */}
              {currentData.metricNames.map((name, index) => {
                const angle = index * 60
                const labelPos = polarToCartesian(200, 200, 180, angle)
                return (
                  <text
                    key={index}
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#4a5568"
                  >
                    {name}
                  </text>
                )
              })}

              {/* Data polygon */}
              <polygon
                points={createRadarPoints()}
                fill="rgba(102, 126, 234, 0.2)"
                stroke="#667eea"
                strokeWidth="2"
              />

              {/* Data points */}
              {currentData.metrics.map((value, index) => {
                const angle = index * 60
                const radius = (value / 100) * 160
                const point = polarToCartesian(200, 200, radius, angle)
                return (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#667eea"
                  />
                )
              })}
            </svg>

            {/* Metrics List */}
            <div className="grid grid-cols-2 gap-3">
              {currentData.metricNames.map((name, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">{name}</span>
                  <span className="text-sm font-bold text-blue-600">{currentData.metrics[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
            <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">Inversión Promedio</div>
            <div className="text-3xl font-bold text-gray-900">{currentData.stats.inversion}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
            <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">CAC Promedio</div>
            <div className="text-3xl font-bold text-gray-900">{currentData.stats.cac}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
            <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">Ticket Promedio</div>
            <div className="text-3xl font-bold text-gray-900">{currentData.stats.ticket}</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Recomendaciones Estratégicas
          </h3>
          <div className="grid gap-4">
            {currentData.recs.map((rec, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <h4 className="font-bold text-gray-900 mb-2">{rec.titulo}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">
            <strong>📊 Metodología del Estudio:</strong> El Radar de Industrias M&P analiza 10 sectores clave del mercado chileno, evaluando 7 dimensiones críticas: efectividad en Google Ads, análisis competitivo, ROAS promedio, adopción de plataformas digitales, implementación de IA, velocidad web y optimización de Google My Business. Los datos se actualizan trimestralmente.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 Muller y Pérez · Análisis de Madurez Digital - Chile 2024</p>
        </div>
      </footer>
      </div>
    </>
  )
}
