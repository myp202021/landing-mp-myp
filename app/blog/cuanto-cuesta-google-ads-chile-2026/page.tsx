import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Target, TrendingUp, CheckCircle2, BarChart3, AlertTriangle, Calculator, Zap, Shield, Search, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cuanto Cuesta Google Ads en Chile 2026: CPC, CPL y Presupuestos por Industria',
  description: 'Guia completa de costos Google Ads Chile 2026: CPC $300-$3.000, CPL $6.500-$72.000. Data real de +250 campanas activas. Tablas por industria, presupuestos recomendados y costos ocultos.',
  keywords: 'cuanto cuesta google ads chile, costo google ads chile 2026, cpc google ads chile, cpl google ads, presupuesto google ads chile, precio google ads, google ads chile precio',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/cuanto-cuesta-google-ads-chile-2026'
  },
  openGraph: {
    title: 'Cuanto Cuesta Google Ads en Chile 2026: CPC, CPL y Presupuestos por Industria',
    description: 'Guia completa de costos Google Ads Chile 2026: CPC $300-$3.000, CPL $6.500-$72.000. Data real de +250 campanas activas.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/cuanto-cuesta-google-ads-chile-2026',
    publishedTime: '2026-08-04T10:00:00Z',
    authors: ['Muller y Perez'],
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cuanto Cuesta Google Ads Chile 2026'
      }
    ]
  }
}

export default function ArticlePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cuanto Cuesta Google Ads en Chile 2026: CPC, CPL y Presupuestos por Industria',
    description: 'Guia completa de costos Google Ads Chile 2026: CPC $300-$3.000, CPL $6.500-$72.000. Data real de +250 campanas activas por industria.',
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    author: {
      '@type': 'Organization',
      name: 'Muller y Perez',
      url: 'https://www.mulleryperez.cl'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Perez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    datePublished: '2026-08-04T10:00:00Z',
    dateModified: '2026-08-04T10:00:00Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/blog/cuanto-cuesta-google-ads-chile-2026'
    },
    articleSection: 'Google Ads',
    inLanguage: 'es-CL'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <img src="/logo-color.png" alt="Muller y Perez" className="h-11 w-auto" />
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Meta */}
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Google Ads</span>
            <p className="text-gray-500 mt-4">4 de agosto, 2026 · 22 min de lectura</p>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Cuanto Cuesta Google Ads en Chile 2026: Guia Completa de CPC, CPL y Presupuestos por Industria
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Basado en data real de mas de 250 campanas activas que gestionamos en Muller y Perez, esta guia te muestra exactamente cuanto cuesta Google Ads en Chile en 2026: costos por clic, por lead, por industria, presupuestos recomendados y los costos ocultos que nadie te cuenta.
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none">

            {/* Section 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              Resumen ejecutivo: costos Google Ads Chile 2026
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Antes de entrar en el detalle, aqui van los numeros clave que necesitas saber si estas evaluando invertir en Google Ads en Chile durante 2026. Estos datos provienen de campanas reales que gestionamos en industrias que van desde retail hasta servicios legales, pasando por educacion, salud y B2B.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Promedios generales Chile 2026 (Data Real M&P)</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>CPC promedio general:</strong> $300 - $3.000 CLP por clic</li>
                <li><strong>CPL promedio general:</strong> $6.500 - $72.000 CLP por lead</li>
                <li><strong>CPA promedio:</strong> $11.500 - $95.000 CLP por adquisicion</li>
                <li><strong>CTR promedio Search:</strong> 3.8% - 8.2%</li>
                <li><strong>Tasa de conversion landing:</strong> 4.5% - 12.8%</li>
                <li><strong>Presupuesto minimo recomendado:</strong> $400.000 - $1.200.000 CLP/mes</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Estos rangos son amplios porque los costos dependen de multiples factores: industria, competencia en tu nicho, calidad de tus anuncios, landing page, ubicacion geografica dentro de Chile y tipo de campana (Search, Display, Performance Max, YouTube). En las siguientes secciones desglosamos cada variable para que puedas estimar tu inversion con precision.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Si quieres una estimacion personalizada para tu negocio, puedes usar nuestro <Link href="/labs/predictor" className="text-blue-600 font-semibold hover:underline">Predictor de Google Ads</Link> que calcula conversiones y revenue esperado con data real de tu industria en Chile.
            </p>

            {/* Section 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              CPC por industria en Chile 2026
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              El Costo Por Clic (CPC) es la metrica mas basica de Google Ads y varia enormemente segun la industria. En Chile, la competencia en Google Ads ha crecido un 18% respecto a 2025, lo que ha elevado los CPC en la mayoria de las verticales. Sin embargo, industrias con menor adopcion digital siguen ofreciendo CPCs atractivos.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Industria</th>
                    <th className="px-6 py-4 text-left font-bold">CPC Promedio</th>
                    <th className="px-6 py-4 text-left font-bold">CPL Promedio</th>
                    <th className="px-6 py-4 text-left font-bold">ROAS Referencia</th>
                    <th className="px-6 py-4 text-left font-bold">Tendencia vs 2025</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Retail / E-commerce</td>
                    <td className="px-6 py-4 text-gray-700">$300 - $800</td>
                    <td className="px-6 py-4 text-gray-700">$6.500 - $18.000</td>
                    <td className="px-6 py-4 text-gray-700">3.8x - 7.2x</td>
                    <td className="px-6 py-4 text-red-600">+12%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Servicios Legales</td>
                    <td className="px-6 py-4 text-gray-700">$1.500 - $3.000</td>
                    <td className="px-6 py-4 text-gray-700">$28.000 - $72.000</td>
                    <td className="px-6 py-4 text-gray-700">2.1x - 4.5x</td>
                    <td className="px-6 py-4 text-red-600">+22%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Inmobiliaria</td>
                    <td className="px-6 py-4 text-gray-700">$600 - $1.200</td>
                    <td className="px-6 py-4 text-gray-700">$15.000 - $42.000</td>
                    <td className="px-6 py-4 text-gray-700">2.5x - 5.8x</td>
                    <td className="px-6 py-4 text-red-600">+15%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Educacion</td>
                    <td className="px-6 py-4 text-gray-700">$400 - $900</td>
                    <td className="px-6 py-4 text-gray-700">$8.500 - $24.000</td>
                    <td className="px-6 py-4 text-gray-700">3.2x - 6.1x</td>
                    <td className="px-6 py-4 text-orange-600">+8%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">B2B / Servicios Prof.</td>
                    <td className="px-6 py-4 text-gray-700">$800 - $2.000</td>
                    <td className="px-6 py-4 text-gray-700">$22.000 - $58.000</td>
                    <td className="px-6 py-4 text-gray-700">2.8x - 5.2x</td>
                    <td className="px-6 py-4 text-red-600">+18%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Salud / Clinicas</td>
                    <td className="px-6 py-4 text-gray-700">$500 - $1.500</td>
                    <td className="px-6 py-4 text-gray-700">$12.000 - $35.000</td>
                    <td className="px-6 py-4 text-gray-700">3.5x - 6.4x</td>
                    <td className="px-6 py-4 text-red-600">+14%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Automotriz</td>
                    <td className="px-6 py-4 text-gray-700">$400 - $1.000</td>
                    <td className="px-6 py-4 text-gray-700">$9.800 - $28.000</td>
                    <td className="px-6 py-4 text-gray-700">3.0x - 5.5x</td>
                    <td className="px-6 py-4 text-orange-600">+10%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Turismo / Hoteleria</td>
                    <td className="px-6 py-4 text-gray-700">$300 - $700</td>
                    <td className="px-6 py-4 text-gray-700">$7.200 - $19.500</td>
                    <td className="px-6 py-4 text-gray-700">4.0x - 8.5x</td>
                    <td className="px-6 py-4 text-orange-600">+6%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Finanzas / Seguros</td>
                    <td className="px-6 py-4 text-gray-700">$1.200 - $2.800</td>
                    <td className="px-6 py-4 text-gray-700">$25.000 - $65.000</td>
                    <td className="px-6 py-4 text-gray-700">2.2x - 4.8x</td>
                    <td className="px-6 py-4 text-red-600">+20%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Tecnologia / SaaS</td>
                    <td className="px-6 py-4 text-gray-700">$700 - $1.800</td>
                    <td className="px-6 py-4 text-gray-700">$18.000 - $48.000</td>
                    <td className="px-6 py-4 text-gray-700">3.0x - 5.8x</td>
                    <td className="px-6 py-4 text-red-600">+16%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Gastronomia / Food</td>
                    <td className="px-6 py-4 text-gray-700">$250 - $600</td>
                    <td className="px-6 py-4 text-gray-700">$5.500 - $14.000</td>
                    <td className="px-6 py-4 text-gray-700">4.5x - 9.0x</td>
                    <td className="px-6 py-4 text-green-600">+3%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Fitness / Deportes</td>
                    <td className="px-6 py-4 text-gray-700">$350 - $750</td>
                    <td className="px-6 py-4 text-gray-700">$7.800 - $20.000</td>
                    <td className="px-6 py-4 text-gray-700">3.6x - 7.0x</td>
                    <td className="px-6 py-4 text-orange-600">+7%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Es importante entender que estos promedios contemplan campanas de Search (busqueda) que es donde se concentra la mayor parte de la inversion en Google Ads en Chile. Las campanas de Display tienen CPCs significativamente menores ($50 - $200) pero tambien tasas de conversion mucho mas bajas, por lo que el CPL final puede ser similar o incluso mayor.
            </p>

            {/* Section 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-green-600" />
              Presupuestos mensuales recomendados por tamano de empresa
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Una de las preguntas mas frecuentes que recibimos es: &ldquo;Cuanto deberia invertir en Google Ads?&rdquo;. La respuesta depende del tamano de tu empresa, tus margenes y tus objetivos de crecimiento. Aqui va nuestra recomendacion basada en lo que funciona en el mercado chileno.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Tamano empresa</th>
                    <th className="px-6 py-4 text-left font-bold">Inversion Google Ads</th>
                    <th className="px-6 py-4 text-left font-bold">Leads esperados/mes</th>
                    <th className="px-6 py-4 text-left font-bold">Fee agencia tipico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Microempresa / Startup</td>
                    <td className="px-6 py-4 text-gray-700">$400.000 - $1.200.000</td>
                    <td className="px-6 py-4 text-gray-700">15 - 60</td>
                    <td className="px-6 py-4 text-gray-700">$250.000 - $450.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Pyme</td>
                    <td className="px-6 py-4 text-gray-700">$1.200.000 - $4.000.000</td>
                    <td className="px-6 py-4 text-gray-700">50 - 200</td>
                    <td className="px-6 py-4 text-gray-700">$450.000 - $900.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Mediana empresa</td>
                    <td className="px-6 py-4 text-gray-700">$4.000.000 - $15.000.000</td>
                    <td className="px-6 py-4 text-gray-700">150 - 700</td>
                    <td className="px-6 py-4 text-gray-700">$800.000 - $1.800.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Enterprise / Corporativo</td>
                    <td className="px-6 py-4 text-gray-700">$15.000.000+</td>
                    <td className="px-6 py-4 text-gray-700">500+</td>
                    <td className="px-6 py-4 text-gray-700">$1.500.000+ o % de inversion</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Es clave entender que invertir menos del minimo recomendado para tu industria genera datos insuficientes para optimizar. Google Ads necesita volumen de conversiones para que sus algoritmos de Smart Bidding funcionen correctamente. Con menos de 30 conversiones mensuales, las estrategias automatizadas como Maximizar Conversiones o Target CPA no tienen suficiente data para optimizar, y terminas pagando mas por cada lead.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Nuestra recomendacion general: invierte al menos lo suficiente para generar 50 conversiones mensuales en tu vertical. Si tu CPL promedio es $20.000, eso significa un presupuesto minimo de $1.000.000 CLP/mes solo en media.
            </p>

            {/* Section 4 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Settings className="w-8 h-8 text-indigo-600" />
              Agencia vs. in-house: analisis de costos reales
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Otra decision importante es si manejar Google Ads internamente o contratar una agencia. Ambas opciones tienen costos muy distintos y conviene analizarlos con numeros reales del mercado chileno 2026.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Opcion In-House</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>Analista SEM junior:</strong> $900.000 - $1.300.000/mes liquido</li>
                  <li><strong>Analista SEM senior:</strong> $1.500.000 - $2.200.000/mes liquido</li>
                  <li><strong>Herramientas (SEMrush, etc.):</strong> $80.000 - $250.000/mes</li>
                  <li><strong>Capacitacion continua:</strong> $200.000 - $500.000/trimestre</li>
                  <li><strong>Costo total estimado:</strong> $1.200.000 - $2.800.000/mes</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Ventaja: dedicacion exclusiva. Desventaja: vision limitada a una cuenta.</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Opcion Agencia</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>Fee mensual:</strong> $450.000 - $1.800.000/mes</li>
                  <li><strong>Setup inicial:</strong> $300.000 - $800.000 (una vez)</li>
                  <li><strong>Herramientas incluidas:</strong> Si, en la mayoria</li>
                  <li><strong>Equipo multidisciplinario:</strong> Estratega + ejecutor + disenador</li>
                  <li><strong>Costo total estimado:</strong> $450.000 - $1.800.000/mes</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Ventaja: experiencia multi-industria, benchmarks. Desventaja: atencion compartida.</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Para pymes con inversion en media bajo $5M/mes, la opcion agencia es casi siempre mas eficiente. El equipo de una agencia como M&P gestiona decenas de cuentas simultaneamente, lo que nos da acceso a benchmarks reales que un analista in-house simplemente no tiene. Ademas, el costo de un analista senior dedicado supera el fee mensual de la mayoria de las agencias.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Para empresas con inversion superior a $15M/mes, un modelo hibrido suele funcionar mejor: un analista in-house que coordina con la agencia y mantiene el conocimiento del negocio, mientras la agencia aporta la vision estrategica y la ejecucion tactica.
            </p>

            {/* Section 5 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-yellow-600" />
              Quality Score: como impacta directamente tus costos
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              El Quality Score (Nivel de Calidad) es el factor mas subestimado en los costos de Google Ads. Un QS alto puede reducir tu CPC efectivo hasta en un 50%, mientras que un QS bajo puede duplicarlo o triplicarlo. En Chile, hemos visto cuentas donde mejorar el QS de 4 a 8 redujo el CPC promedio de $1.200 a $580 sin cambiar nada mas.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Impacto del Quality Score en el CPC real</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>QS 10:</strong> Pagas hasta 50% menos que el CPC base</li>
                <li><strong>QS 7-8:</strong> Pagas el CPC de mercado o levemente menos</li>
                <li><strong>QS 5-6:</strong> Pagas el CPC base o un poco mas</li>
                <li><strong>QS 3-4:</strong> Pagas 25-50% mas que el CPC base</li>
                <li><strong>QS 1-2:</strong> Pagas hasta 400% mas (si es que apareces)</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Los tres componentes del Quality Score son: relevancia del anuncio, experiencia en la pagina de destino y CTR esperado. En nuestra experiencia gestionando campanas en Chile, el factor que mas impacto tiene es la experiencia en la landing page. Una landing rapida (menos de 2 segundos de carga), responsive, con contenido alineado a la keyword y un formulario claro puede subir tu QS de 5 a 8 en cuestion de semanas.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Si quieres entender mejor como funciona el Quality Score y su impacto en tu cuenta, te recomendamos leer nuestra <Link href="/blog/google-ads-vs-meta-ads-chile-2026" className="text-blue-600 font-semibold hover:underline">comparativa entre Google Ads y Meta Ads 2026</Link> donde analizamos como cada plataforma determina los costos de tus campanas.
            </p>

            {/* Section 6 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-600" />
              Costos de Performance Max en Chile 2026
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Performance Max (PMax) se ha convertido en el tipo de campana mas popular en Chile para e-commerce y generacion de leads. En 2026, Google ha mejorado significativamente la transparencia de PMax, permitiendo ver el desglose de rendimiento por canal (Search, Display, YouTube, Discover, Maps, Gmail).
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">PMax para E-commerce</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>CPC equivalente:</strong> $180 - $650</li>
                  <li><strong>ROAS promedio:</strong> 4.2x - 8.5x</li>
                  <li><strong>Presupuesto minimo:</strong> $800.000/mes</li>
                  <li><strong>Tiempo de aprendizaje:</strong> 3-4 semanas</li>
                  <li><strong>Requiere:</strong> Feed de productos optimizado</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">PMax para Lead Gen</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>CPL promedio:</strong> $8.000 - $35.000</li>
                  <li><strong>Calidad de leads:</strong> Variable (requiere senales de conversion)</li>
                  <li><strong>Presupuesto minimo:</strong> $1.200.000/mes</li>
                  <li><strong>Tiempo de aprendizaje:</strong> 4-6 semanas</li>
                  <li><strong>Requiere:</strong> Conversion tracking avanzado + valores de conversion</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Un error comun que vemos en Chile es lanzar PMax sin tener conversion tracking correctamente implementado. PMax es una campana basada 100% en IA y necesita datos de conversion de calidad para funcionar. Si no tienes implementado offline conversion tracking o al menos eventos de conversion en tu CRM, PMax va a optimizar hacia conversiones de baja calidad (formularios incompletos, leads falsos).
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              En M&P siempre implementamos conversion tracking avanzado con valores de conversion diferenciados antes de lanzar cualquier campana PMax. Esto permite que el algoritmo entienda que un lead calificado vale mas que un simple envio de formulario, y optimice en consecuencia. Para saber mas sobre como estructuramos estas campanas, visita nuestra pagina de <Link href="/servicios" className="text-blue-600 font-semibold hover:underline">servicios de performance marketing</Link>.
            </p>

            {/* Section 7 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              Los costos ocultos que nadie te cuenta
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              El presupuesto de Google Ads no es solo la inversion en media. Hay costos adicionales que muchas empresas no consideran y que pueden representar entre un 30% y un 60% adicional sobre la inversion en medios. Estos son los principales costos ocultos que debes contemplar.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 bg-red-50 rounded-xl p-5">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Landing pages profesionales</h3>
                  <p className="text-gray-700">Una landing page optimizada para conversion cuesta entre $300.000 y $1.500.000 CLP (pago unico). Sin una buena landing, tu Quality Score baja y tu CPC sube. Es la inversion con mayor retorno que puedes hacer antes de lanzar campanas.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-red-50 rounded-xl p-5">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Tracking y analytics</h3>
                  <p className="text-gray-700">Implementar Google Tag Manager, GA4, conversion tracking avanzado y conexion con CRM puede costar entre $200.000 y $800.000 CLP como setup inicial. Sin esto, estas volando a ciegas y no puedes optimizar correctamente.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-red-50 rounded-xl p-5">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">3. Creatividades y copy</h3>
                  <p className="text-gray-700">Google Ads requiere textos optimizados, extensiones de anuncio, imagenes para Display y assets para PMax. Esto puede costar $150.000 - $500.000 CLP mensuales si no tienes un equipo creativo interno.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-red-50 rounded-xl p-5">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. Herramientas complementarias</h3>
                  <p className="text-gray-700">SEMrush o Ahrefs para investigacion de keywords ($50.000 - $200.000/mes), herramientas de call tracking ($30.000 - $100.000/mes), CRM ($0 - $150.000/mes). Estas herramientas no son opcionales si quieres gestionar campanas profesionalmente.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-red-50 rounded-xl p-5">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5. Costo de oportunidad del aprendizaje</h3>
                  <p className="text-gray-700">Las primeras 4-8 semanas de cualquier campana son de aprendizaje. Estima que el 15-25% de tu presupuesto inicial se destina a testear audiencias, keywords y creatividades. Este &ldquo;desperdicio controlado&rdquo; es parte del proceso y no hay forma de evitarlo.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">Regla practica M&P:</p>
              <p className="text-gray-700">
                Para calcular el presupuesto total real de Google Ads, multiplica tu inversion en media por 1.4x a 1.6x. Si planeas invertir $2M/mes en media, presupuesta al menos $2.8M - $3.2M/mes en total considerando agencia, herramientas y creatividades.
              </p>
            </div>

            {/* Section 8 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Search className="w-8 h-8 text-teal-600" />
              Tipos de campana y sus costos comparados
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Google Ads ofrece multiples tipos de campana, cada uno con estructuras de costos muy diferentes. En Chile en 2026, la distribucion tipica de inversion por tipo de campana para una cuenta bien optimizada es la siguiente.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Search (Busqueda)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>% del presupuesto tipico:</strong> 40-60%</li>
                  <li><strong>CPC:</strong> $300 - $3.000</li>
                  <li><strong>CTR:</strong> 3.5% - 9%</li>
                  <li><strong>Mejor para:</strong> Alta intencion, servicios, B2B</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Max</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>% del presupuesto tipico:</strong> 20-35%</li>
                  <li><strong>CPC equivalente:</strong> $150 - $800</li>
                  <li><strong>CTR:</strong> Variable por canal</li>
                  <li><strong>Mejor para:</strong> E-commerce, volumen</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Display / Remarketing</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>% del presupuesto tipico:</strong> 10-20%</li>
                  <li><strong>CPC:</strong> $50 - $250</li>
                  <li><strong>CTR:</strong> 0.3% - 1.2%</li>
                  <li><strong>Mejor para:</strong> Remarketing, awareness</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">YouTube Ads</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>% del presupuesto tipico:</strong> 5-15%</li>
                  <li><strong>CPV:</strong> $15 - $80</li>
                  <li><strong>VTR:</strong> 15% - 35%</li>
                  <li><strong>Mejor para:</strong> Branding, consideracion</li>
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Como reducir costos sin perder resultados
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Reducir costos en Google Ads no significa bajar presupuesto; significa obtener mas resultados por cada peso invertido. Estas son las estrategias que aplicamos en M&P para reducir CPL entre un 25% y 45% en cuentas chilenas.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Negativas agresivas desde el dia 1</h3>
                  <p className="text-gray-700">En Chile, el 20-35% del gasto en Search se desperdicia en terminos irrelevantes. Implementar una lista de negativas exhaustiva (minimo 200-300 keywords negativas) puede reducir tu CPC efectivo un 15-20% en el primer mes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Segmentacion geografica inteligente</h3>
                  <p className="text-gray-700">No todas las comunas de Santiago convierten igual. Analiza tu data y ajusta bids por ubicacion. En muchos casos, excluir zonas de bajo poder adquisitivo o baja conversion puede reducir CPL un 10-15%.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">3. Programacion horaria basada en data</h3>
                  <p className="text-gray-700">En Chile, los horarios de mayor conversion varian por industria. B2B convierte mejor entre 9AM y 1PM. Retail entre 8PM y 11PM. Ajustar pujas por horario puede mejorar tu ROAS un 20-30%.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. Landing pages especificas por grupo de anuncios</h3>
                  <p className="text-gray-700">Enviar todo el trafico a tu homepage es el error numero 1 en Chile. Crear landing pages especificas por servicio o producto mejora el QS y puede reducir CPC entre 20-40%.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5. Smart Bidding con datos de valor de conversion</h3>
                  <p className="text-gray-700">Pasar datos de calidad de leads a Google (via offline conversion import) permite que el algoritmo optimice hacia leads que realmente cierran, no solo formularios enviados. Esto puede mejorar la calidad de leads un 40-60%.</p>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Proyeccion de resultados: que esperar de tu inversion
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Para ayudarte a dimensionar que resultados puedes esperar, armamos esta proyeccion basada en datos reales de campanas en Chile. Estos numeros asumen una campana bien optimizada con al menos 3 meses de historial.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Inversion $1M/mes</h3>
                <p className="text-3xl font-black text-blue-600 mb-2">40-80</p>
                <p className="text-gray-600">leads/mes</p>
                <p className="text-sm text-gray-500 mt-2">CPL estimado: $12.500 - $25.000</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Inversion $3M/mes</h3>
                <p className="text-3xl font-black text-purple-600 mb-2">130-250</p>
                <p className="text-gray-600">leads/mes</p>
                <p className="text-sm text-gray-500 mt-2">CPL estimado: $12.000 - $23.000</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Inversion $10M/mes</h3>
                <p className="text-3xl font-black text-green-600 mb-2">400-850</p>
                <p className="text-gray-600">leads/mes</p>
                <p className="text-sm text-gray-500 mt-2">CPL estimado: $11.800 - $25.000</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Es importante notar que el CPL tiende a mantenerse o incluso mejorar levemente al escalar, siempre que se mantenga la estructura de cuenta y se agreguen nuevos segmentos de forma progresiva. Sin embargo, escalar demasiado rapido (mas de 20-30% de incremento semanal) puede desestabilizar los algoritmos de Smart Bidding y elevar el CPL temporalmente.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Para una estimacion mas precisa para tu negocio, te invitamos a usar nuestro <Link href="/labs/predictor" className="text-blue-600 font-semibold hover:underline">Predictor de Campanas Google Ads</Link>, donde puedes ingresar tu industria, presupuesto y ticket promedio para obtener una proyeccion personalizada.
            </p>

            {/* Section 11 - Errores */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              Los 5 errores mas caros que cometen empresas chilenas
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Despues de auditar mas de 150 cuentas de Google Ads de empresas chilenas, estos son los errores que mas dinero desperdician. Evitarlos puede representar un ahorro de entre 30% y 50% de tu presupuesto mensual.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 1: No usar listas de keywords negativas</h3>
                <p className="text-gray-700">El 68% de las cuentas que auditamos no tienen una lista de negativas adecuada. Resultado: 25-40% del presupuesto se va en clics irrelevantes como &ldquo;gratis&rdquo;, &ldquo;empleo&rdquo;, &ldquo;practicas&rdquo; o busquedas informacionales.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 2: Landing page = homepage</h3>
                <p className="text-gray-700">Enviar todo el trafico a la pagina de inicio en vez de landing pages especificas por servicio. Esto reduce el Quality Score a 4-5 y sube el CPC entre 30% y 60%. Es dinero literalmente tirado a la basura.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 3: No medir conversiones correctamente</h3>
                <p className="text-gray-700">Sin conversion tracking, Google optimiza hacia clics, no hacia ventas. El 42% de las pymes chilenas no tienen conversiones configuradas correctamente. Sin datos de conversion, Smart Bidding no funciona y terminas pagando mas de lo necesario por cada resultado.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 4: Presupuesto insuficiente repartido en todo</h3>
                <p className="text-gray-700">Invertir $500.000/mes distribuidos en 5 campanas significa $100.000 por campana, lo cual es insuficiente para que cualquier campana tenga datos significativos. Es mejor concentrar en 1-2 campanas y escalar despues.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 5: Ignorar la competencia</h3>
                <p className="text-gray-700">No monitorear lo que hacen tus competidores en Google Ads (sus keywords, anuncios, landing pages) es perder inteligencia de mercado valiosa. En M&P usamos herramientas de benchmark competitivo para cada cuenta que gestionamos. Conoce mas sobre nuestro <Link href="/blog/tendencias-marketing-digital-chile-2026" className="text-blue-600 font-semibold hover:underline">enfoque de marketing digital 2026</Link>.</p>
              </div>
            </div>

            {/* FAQ Section */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-8">Preguntas frecuentes sobre costos de Google Ads en Chile</h2>

            <div className="space-y-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cual es el costo minimo para empezar con Google Ads en Chile?</h3>
                <p className="text-gray-700">Recomendamos un minimo de $400.000 CLP/mes en media para industrias de bajo CPC (retail, turismo, gastronomia) y $800.000 - $1.200.000 CLP/mes para industrias de alto CPC (legal, finanzas, B2B). A eso sumale el fee de agencia o el costo de tu equipo interno. Invertir menos del minimo genera datos insuficientes para optimizar y es como tirar dinero.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cuanto demora Google Ads en dar resultados?</h3>
                <p className="text-gray-700">En nuestra experiencia con campanas en Chile, los primeros leads llegan en las primeras 24-48 horas. Sin embargo, los resultados optimizados (CPL estable, Smart Bidding entrenado) toman entre 4 y 8 semanas. Para alcanzar el rendimiento optimo de la cuenta, necesitas al menos 3 meses de data y optimizacion continua.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Es mejor Google Ads o Meta Ads para mi negocio?</h3>
                <p className="text-gray-700">Depende de tu modelo de negocio. Google Ads funciona mejor para busquedas de alta intencion (servicios, B2B, urgencias). Meta Ads es superior para productos visuales, e-commerce y construccion de marca. La mayoria de las empresas se benefician de usar ambos. Lee nuestra <Link href="/blog/google-ads-vs-meta-ads-chile-2026" className="text-blue-600 font-semibold hover:underline">comparativa completa Google Ads vs Meta Ads 2026</Link>.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Que porcentaje de mi presupuesto total deberia ir a Google Ads?</h3>
                <p className="text-gray-700">Como regla general, recomendamos destinar entre un 35% y 45% de tu presupuesto total de marketing digital a Google Ads si tu negocio depende de busquedas de intencion. Si vendes productos visuales o de impulso, ese porcentaje puede bajar a 25-30% a favor de Meta o TikTok. Lee mas en nuestra <Link href="/blog/cuanto-invertir-publicidad-digital-chile-2026" className="text-blue-600 font-semibold hover:underline">guia de cuanto invertir en publicidad digital</Link>.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Por que mi CPC es mas alto que el promedio de mi industria?</h3>
                <p className="text-gray-700">Los factores mas comunes son: Quality Score bajo (landing page lenta, anuncios poco relevantes), segmentacion demasiado amplia, competencia directa con empresas de mayor presupuesto, o keywords muy genericas. Una auditoria profesional puede identificar la causa exacta y reducir tu CPC un 20-40%.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cuanto cobra una agencia por gestionar Google Ads en Chile?</h3>
                <p className="text-gray-700">Los fees de agencia en Chile van desde $250.000/mes para cuentas pequenas hasta $1.800.000+ para cuentas enterprise. Algunas agencias cobran un porcentaje de la inversion (10-20%), otras un fee fijo. En M&P trabajamos con fee fijo porque alinea los incentivos: nuestro interes es optimizar tus resultados, no que gastes mas en media.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Vale la pena Performance Max en 2026?</h3>
                <p className="text-gray-700">Si, pero con condiciones. PMax funciona bien si tienes: (1) conversion tracking correctamente implementado, (2) suficiente presupuesto (minimo $800K-$1.2M/mes), (3) assets de calidad (imagenes, textos, videos), y (4) paciencia para el periodo de aprendizaje de 3-6 semanas. Sin estos requisitos, Search clasico sigue siendo mas predecible y controlable.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Como saber si mi inversion en Google Ads esta funcionando?</h3>
                <p className="text-gray-700">Las metricas clave son: CPL (costo por lead), tasa de cierre de leads, CAC (costo de adquisicion de cliente) y ROAS (retorno sobre inversion publicitaria). Si tu ROAS es mayor a 3x, tu campana es rentable. Si tu CAC es menor que tu margen por cliente, estas generando beneficio. Usa nuestra <Link href="/utilidades/calculadora-cac" className="text-blue-600 font-semibold hover:underline">Calculadora CAC</Link> para verificar tus numeros.</p>
              </div>
            </div>

            {/* Conclusion CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                Quieres saber exactamente cuanto deberia costar Google Ads para tu negocio?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                En M&P gestionamos mas de $80M en inversion mensual para empresas chilenas. Agenda una auditoria gratuita y te mostramos cuanto puedes ahorrar en tus campanas actuales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contacto"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  Solicitar Auditoria Gratis
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-block bg-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition-all hover:scale-105 border border-blue-400"
                >
                  Usar Predictor Google Ads
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Articulos Relacionados</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/blog/cuanto-invertir-publicidad-digital-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Cuanto Invertir en Publicidad Digital Chile 2026 &rarr;
              </Link>
              <Link href="/blog/google-ads-vs-meta-ads-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Google Ads vs Meta Ads Chile 2026 &rarr;
              </Link>
              <Link href="/blog/guia-marketing-digital-pymes-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Guia Marketing Digital Pymes Chile 2026 &rarr;
              </Link>
              <Link href="/ranking-agencias-marketing-digital-chile" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Ranking Agencias Marketing Digital Chile &rarr;
              </Link>
              <Link href="/labs/predictor" className="text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg">
                Predictor de Campanas &rarr;
              </Link>
            </div>
          </nav>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">&copy; 2026 Muller y Perez - Agencia de Marketing Digital y Performance</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/labs" className="hover:text-blue-600 transition-colors">M&P Labs</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
