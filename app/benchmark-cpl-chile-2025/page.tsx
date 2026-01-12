import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, TrendingUp, DollarSign, Target, BarChart3, CheckCircle, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Benchmark CPL Chile 2025: Costo por Lead por Industria | Estudio M&P',
  description: 'Estudio completo de CPL (Costo por Lead), CAC, ROAS y tasas de conversión en Chile 2025. Datos reales de +200 campañas activas en Google Ads y Meta Ads por industria.',
  keywords: 'benchmark cpl chile, costo por lead chile, cpl por industria, benchmark google ads chile, benchmark meta ads chile, cac chile 2025, roas promedio chile',
  openGraph: {
    title: 'Benchmark CPL Chile 2025 | Estudio Muller y Pérez',
    description: 'CPL, CAC y ROAS por industria en Chile. Datos de +200 campañas reales.',
    url: 'https://www.mulleryperez.cl/benchmark-cpl-chile-2025',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/benchmark-cpl-chile-2025',
  },
}

// Datos del benchmark - Actualizados Enero 2025
const benchmarkData = {
  fechaActualizacion: 'Enero 2025',
  totalCampanas: 200,
  fuentes: [
    'Data interna M&P (+200 campañas activas)',
    'WordStream 2024',
    'Triple Whale 2024',
    'Ubersuggest Chile 2024',
    'Databox 2024'
  ],
  industrias: [
    {
      nombre: 'E-commerce / Retail',
      cplGoogle: 8800,
      cplMeta: 5600,
      cacPromedio: 15000,
      roasGoogle: 5.0,
      roasMeta: 4.0,
      cvrGoogle: 2.8,
      cvrMeta: 8.8,
      tendencia: 'estable',
    },
    {
      nombre: 'Tecnología SaaS',
      cplGoogle: 45000,
      cplMeta: 52000,
      cacPromedio: 80000,
      roasGoogle: 7.0,
      roasMeta: 4.5,
      cvrGoogle: 5.5,
      cvrMeta: 4.0,
      tendencia: 'subiendo',
    },
    {
      nombre: 'Servicios Profesionales',
      cplGoogle: 35000,
      cplMeta: 42000,
      cacPromedio: 60000,
      roasGoogle: 6.0,
      roasMeta: 3.5,
      cvrGoogle: 5.0,
      cvrMeta: 4.0,
      tendencia: 'estable',
    },
    {
      nombre: 'Salud / Clínicas',
      cplGoogle: 28000,
      cplMeta: 35000,
      cacPromedio: 50000,
      roasGoogle: 5.5,
      roasMeta: 3.5,
      cvrGoogle: 7.0,
      cvrMeta: 4.8,
      tendencia: 'bajando',
    },
    {
      nombre: 'Educación Online',
      cplGoogle: 22000,
      cplMeta: 18000,
      cacPromedio: 40000,
      roasGoogle: 6.0,
      roasMeta: 4.5,
      cvrGoogle: 10.0,
      cvrMeta: 10.0,
      tendencia: 'estable',
    },
    {
      nombre: 'Inmobiliaria',
      cplGoogle: 55000,
      cplMeta: 70000,
      cacPromedio: 100000,
      roasGoogle: 10.0,
      roasMeta: 8.0,
      cvrGoogle: 1.2,
      cvrMeta: 9.7,
      tendencia: 'subiendo',
    },
    {
      nombre: 'Fintech',
      cplGoogle: 48000,
      cplMeta: 55000,
      cacPromedio: 80000,
      roasGoogle: 7.0,
      roasMeta: 5.0,
      cvrGoogle: 4.7,
      cvrMeta: 5.5,
      tendencia: 'estable',
    },
    {
      nombre: 'Automotriz',
      cplGoogle: 95000,
      cplMeta: 110000,
      cacPromedio: 160000,
      roasGoogle: 8.0,
      roasMeta: 6.0,
      cvrGoogle: 13.0,
      cvrMeta: 4.9,
      tendencia: 'subiendo',
    },
    {
      nombre: 'Turismo / Hotelería',
      cplGoogle: 18000,
      cplMeta: 14000,
      cacPromedio: 30000,
      roasGoogle: 5.0,
      roasMeta: 4.0,
      cvrGoogle: 7.0,
      cvrMeta: 8.8,
      tendencia: 'bajando',
    },
    {
      nombre: 'Gastronomía / Delivery',
      cplGoogle: 3500,
      cplMeta: 2800,
      cacPromedio: 6000,
      roasGoogle: 3.5,
      roasMeta: 3.0,
      cvrGoogle: 7.0,
      cvrMeta: 18.3,
      tendencia: 'estable',
    },
    {
      nombre: 'Moda / Retail',
      cplGoogle: 9500,
      cplMeta: 8000,
      cacPromedio: 16000,
      roasGoogle: 6.0,
      roasMeta: 5.0,
      cvrGoogle: 8.0,
      cvrMeta: 8.8,
      tendencia: 'estable',
    },
    {
      nombre: 'Construcción',
      cplGoogle: 72000,
      cplMeta: 85000,
      cacPromedio: 120000,
      roasGoogle: 8.0,
      roasMeta: 6.0,
      cvrGoogle: 4.0,
      cvrMeta: 3.5,
      tendencia: 'subiendo',
    },
    {
      nombre: 'Seguros',
      cplGoogle: 42000,
      cplMeta: 48000,
      cacPromedio: 70000,
      roasGoogle: 6.5,
      roasMeta: 4.5,
      cvrGoogle: 5.0,
      cvrMeta: 4.5,
      tendencia: 'estable',
    },
    {
      nombre: 'Veterinaria / Mascotas',
      cplGoogle: 18000,
      cplMeta: 14000,
      cacPromedio: 30000,
      roasGoogle: 5.0,
      roasMeta: 4.0,
      cvrGoogle: 6.0,
      cvrMeta: 8.0,
      tendencia: 'bajando',
    },
    {
      nombre: 'Deportes / Fitness',
      cplGoogle: 12000,
      cplMeta: 9500,
      cacPromedio: 20000,
      roasGoogle: 5.5,
      roasMeta: 4.5,
      cvrGoogle: 6.0,
      cvrMeta: 8.0,
      tendencia: 'estable',
    },
  ]
}

// Insights clave del estudio
const insights = [
  {
    titulo: 'Google Ads vs Meta Ads',
    descripcion: 'Google Ads tiene CPL más bajo en industrias con alta intención de búsqueda (servicios profesionales, salud). Meta Ads gana en industrias visuales (moda, gastronomía, turismo).',
  },
  {
    titulo: 'ROAS por Ticket Promedio',
    descripcion: 'Industrias con ticket alto (inmobiliaria, automotriz, construcción) logran ROAS 8-10x. E-commerce con ticket bajo requiere volumen para compensar márgenes.',
  },
  {
    titulo: 'Tendencia 2025',
    descripcion: 'CPL subiendo en inmobiliaria (+15%), automotriz (+12%) y construcción (+18%) por mayor competencia. Bajando en turismo (-8%) y veterinaria (-5%) por saturación.',
  },
  {
    titulo: 'Conversión por Canal',
    descripcion: 'Meta Ads tiene CVR 2-3x mayor que Google en generación de leads, pero Google convierte mejor en compra directa (especialmente e-commerce y SaaS).',
  },
]

// Schema JSON-LD para el estudio
const studySchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Benchmark CPL Chile 2025: Costo por Lead por Industria',
  description: 'Estudio completo de CPL, CAC, ROAS y tasas de conversión en Chile 2025. Datos reales de +200 campañas activas.',
  author: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.mulleryperez.cl/logo-color.png'
    }
  },
  datePublished: '2025-01-01',
  dateModified: new Date().toISOString(),
  mainEntityOfPage: 'https://www.mulleryperez.cl/benchmark-cpl-chile-2025',
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Benchmark CPL Chile 2025 por Industria',
  description: 'Dataset de CPL, CAC, ROAS y CVR por industria en Chile, basado en +200 campañas activas de Google Ads y Meta Ads.',
  creator: {
    '@type': 'Organization',
    name: 'Muller y Pérez'
  },
  datePublished: '2025-01-01',
  dateModified: new Date().toISOString(),
  license: 'https://creativecommons.org/licenses/by/4.0/',
  distribution: {
    '@type': 'DataDownload',
    contentUrl: 'https://www.mulleryperez.cl/benchmark-cpl-chile-2025',
    encodingFormat: 'text/html'
  },
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'CPL Google Ads', unitText: 'CLP' },
    { '@type': 'PropertyValue', name: 'CPL Meta Ads', unitText: 'CLP' },
    { '@type': 'PropertyValue', name: 'CAC Promedio', unitText: 'CLP' },
    { '@type': 'PropertyValue', name: 'ROAS', unitText: 'x' },
    { '@type': 'PropertyValue', name: 'CVR', unitText: '%' }
  ]
}

function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value)
}

function getTendenciaColor(tendencia: string): string {
  switch (tendencia) {
    case 'subiendo': return 'text-red-600'
    case 'bajando': return 'text-green-600'
    default: return 'text-gray-600'
  }
}

function getTendenciaIcon(tendencia: string): string {
  switch (tendencia) {
    case 'subiendo': return '↑'
    case 'bajando': return '↓'
    default: return '→'
  }
}

export default function BenchmarkCPLChile2025() {
  return (
    <main className="min-h-screen bg-white">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
              <BarChart3 className="w-4 h-4" />
              Actualizado: {benchmarkData.fechaActualizacion}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              Benchmark CPL Chile 2025
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-4">
              Costo por Lead, CAC, ROAS y Conversión por Industria
            </p>
            <p className="text-lg text-blue-300 mb-8">
              Datos reales de <strong>+{benchmarkData.totalCampanas} campañas activas</strong> en Google Ads y Meta Ads
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#tabla-benchmark"
                className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ver Datos Completos
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/cotizador"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calcular mi CPL Esperado
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resumen Ejecutivo */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <DollarSign className="w-8 h-8 text-green-600 mb-3" />
                <div className="text-3xl font-bold text-gray-900">$25.000</div>
                <div className="text-gray-600">CPL Promedio Chile</div>
                <div className="text-sm text-gray-500 mt-1">Google Ads + Meta Ads</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Target className="w-8 h-8 text-blue-600 mb-3" />
                <div className="text-3xl font-bold text-gray-900">5.8x</div>
                <div className="text-gray-600">ROAS Promedio</div>
                <div className="text-sm text-gray-500 mt-1">Retorno sobre inversión</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
                <div className="text-3xl font-bold text-gray-900">6.2%</div>
                <div className="text-gray-600">CVR Promedio</div>
                <div className="text-sm text-gray-500 mt-1">Tasa de conversión</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <BarChart3 className="w-8 h-8 text-orange-600 mb-3" />
                <div className="text-3xl font-bold text-gray-900">15</div>
                <div className="text-gray-600">Industrias Analizadas</div>
                <div className="text-sm text-gray-500 mt-1">+200 campañas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla Principal de Benchmark */}
      <section id="tabla-benchmark" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              CPL, CAC y ROAS por Industria en Chile 2025
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Datos basados en +200 campañas activas gestionadas por Muller y Pérez
            </p>

            {/* Tabla responsive */}
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Industria</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">CPL Google</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">CPL Meta</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">CAC Prom.</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">ROAS Google</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">ROAS Meta</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkData.industrias.map((industria, index) => (
                    <tr
                      key={industria.nombre}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">{industria.nombre}</td>
                      <td className="py-4 px-4 text-right text-gray-700">{formatCLP(industria.cplGoogle)}</td>
                      <td className="py-4 px-4 text-right text-gray-700">{formatCLP(industria.cplMeta)}</td>
                      <td className="py-4 px-4 text-right text-gray-700">{formatCLP(industria.cacPromedio)}</td>
                      <td className="py-4 px-4 text-right font-medium text-green-700">{industria.roasGoogle}x</td>
                      <td className="py-4 px-4 text-right font-medium text-blue-700">{industria.roasMeta}x</td>
                      <td className={`py-4 px-4 text-center font-medium ${getTendenciaColor(industria.tendencia)}`}>
                        {getTendenciaIcon(industria.tendencia)} {industria.tendencia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              * CPL = Costo por Lead | CAC = Costo de Adquisición de Cliente | ROAS = Return on Ad Spend
              <br />
              Fuente: Data interna M&P, WordStream 2024, Triple Whale, Ubersuggest Chile
            </p>
          </div>
        </div>
      </section>

      {/* Tabla de Conversión */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              Tasas de Conversión (CVR) por Industria y Canal
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Porcentaje de visitantes que se convierten en leads
            </p>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Industria</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">CVR Google Ads</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">CVR Meta Ads</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkData.industrias.map((industria, index) => {
                    const diff = industria.cvrMeta - industria.cvrGoogle
                    return (
                      <tr
                        key={industria.nombre}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">{industria.nombre}</td>
                        <td className="py-4 px-4 text-right text-gray-700">{industria.cvrGoogle}%</td>
                        <td className="py-4 px-4 text-right text-gray-700">{industria.cvrMeta}%</td>
                        <td className={`py-4 px-4 text-right font-medium ${diff > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}% {diff > 0 ? '(Meta)' : '(Google)'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Insights Clave del Estudio
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <div key={insight.titulo} className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {insight.titulo}
                  </h3>
                  <p className="text-gray-600">{insight.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Metodología del Estudio
            </h2>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Fuentes de Datos</h3>
                  <ul className="space-y-2">
                    {benchmarkData.fuentes.map((fuente) => (
                      <li key={fuente} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        {fuente}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Metodología</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      Datos de campañas activas en Chile (no globales)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      Métricas calculadas con mediana (no promedio) para evitar outliers
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      CPCs calibrados con Ubersuggest Chile 2024
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      Actualización mensual de datos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo usar estos datos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Cómo Usar Este Benchmark
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Identifica tu industria</h3>
                  <p className="text-gray-600">Busca tu industria en la tabla y anota el CPL, CAC y ROAS de referencia.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Compara con tus métricas actuales</h3>
                  <p className="text-gray-600">Si tu CPL está por encima del benchmark, hay oportunidad de optimización. Si está por debajo, vas bien.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Elige el canal correcto</h3>
                  <p className="text-gray-600">Compara CPL y ROAS entre Google y Meta para tu industria. No siempre el CPL más bajo es mejor si el ROAS es menor.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Calcula tu presupuesto</h3>
                  <p className="text-gray-600">Usa el CAC de referencia para estimar cuánto invertir según tus objetivos de adquisición de clientes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Quieres saber tu CPL esperado exacto?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Usa nuestro Predictor gratuito para calcular CPL, conversiones y ROI personalizados para tu negocio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/labs/predictor-google-ads"
                className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Calcular mi CPL Esperado
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/cotizador"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors border border-blue-500"
              >
                Solicitar Asesoría Gratuita
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Citación */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-bold text-gray-900 mb-3">Citar este estudio</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
              <code className="text-sm text-gray-700">
                Muller y Pérez. (2025). Benchmark CPL Chile 2025: Costo por Lead por Industria.
                Recuperado de https://www.mulleryperez.cl/benchmark-cpl-chile-2025
              </code>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Este estudio es de libre uso con atribución. Licencia CC BY 4.0.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
