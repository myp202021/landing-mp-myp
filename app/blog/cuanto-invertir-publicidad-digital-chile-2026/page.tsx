import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Target, TrendingUp, CheckCircle2, BarChart3, PieChart, Calendar, Layers, AlertTriangle, Zap, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cuanto Invertir en Publicidad Digital en Chile 2026: Presupuestos por Canal e Industria',
  description: 'Guia completa de presupuestos de publicidad digital Chile 2026. Distribucion por canal (Google 40%, Meta 30%, LinkedIn 15%), por tamano de empresa y por industria. Data real de +200 campanas.',
  keywords: 'cuanto invertir publicidad digital chile, presupuesto marketing digital chile 2026, inversion publicidad chile, presupuesto google ads meta ads, marketing digital presupuesto pyme',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/cuanto-invertir-publicidad-digital-chile-2026'
  },
  openGraph: {
    title: 'Cuanto Invertir en Publicidad Digital en Chile 2026: Presupuestos por Canal e Industria',
    description: 'Guia completa de presupuestos de publicidad digital Chile 2026. Distribucion por canal, tamano de empresa e industria.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/cuanto-invertir-publicidad-digital-chile-2026',
    publishedTime: '2026-08-04T10:00:00Z',
    authors: ['Muller y Perez'],
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cuanto Invertir en Publicidad Digital Chile 2026'
      }
    ]
  }
}

export default function ArticlePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cuanto Invertir en Publicidad Digital en Chile 2026: Presupuestos por Canal e Industria',
    description: 'Guia completa de presupuestos de publicidad digital Chile 2026. Distribucion por canal, tamano de empresa e industria con data real.',
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
      '@id': 'https://www.mulleryperez.cl/blog/cuanto-invertir-publicidad-digital-chile-2026'
    },
    articleSection: 'Publicidad Digital',
    inLanguage: 'es-CL'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">Presupuestos</span>
            <p className="text-gray-500 mt-4">4 de agosto, 2026 · 20 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Cuanto Invertir en Publicidad Digital en Chile 2026: Guia Completa de Presupuestos por Canal e Industria
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Definir cuanto invertir en publicidad digital es la decision mas critica de tu estrategia de marketing. Esta guia te muestra, con data real del mercado chileno 2026, como distribuir tu presupuesto entre Google, Meta, LinkedIn, TikTok y programatica segun tu industria, tamano y objetivos.
          </p>

          <div className="prose prose-lg max-w-none">

            {/* Section 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <PieChart className="w-8 h-8 text-blue-600" />
              Distribucion recomendada del presupuesto por canal en 2026
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              La distribucion del presupuesto entre canales digitales no es una formula unica. Depende de tu modelo de negocio, tu audiencia y tus objetivos. Sin embargo, despues de gestionar mas de 200 cuentas activas en Chile, hemos identificado patrones claros que funcionan como punto de partida solido para la mayoria de las empresas.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Distribucion tipica recomendada Chile 2026</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Google Ads (Search + PMax + YouTube):</strong> 40% del presupuesto total - Captura demanda existente, alta intencion de compra</li>
                <li><strong>Meta Ads (Facebook + Instagram):</strong> 30% del presupuesto total - Generacion de demanda, retargeting, productos visuales</li>
                <li><strong>LinkedIn Ads:</strong> 15% del presupuesto total - B2B de alto ticket, decision makers, servicios profesionales</li>
                <li><strong>TikTok Ads:</strong> 10% del presupuesto total - Awareness, audiencias jovenes, CPM bajo, contenido viral</li>
                <li><strong>Programatica / Display:</strong> 5% del presupuesto total - Retargeting avanzado, audiencias custom, branding complementario</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Esta distribucion 40/30/15/10/5 funciona como punto de partida, pero debe ajustarse segun los resultados de cada canal. En M&P revisamos la distribucion mensualmente y reasignamos presupuesto hacia los canales que mejor ROAS estan generando. Un error comun es fijar la distribucion al inicio y no volver a tocarla: el mercado cambia, la competencia cambia, y tu mix debe adaptarse.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Para entender los costos especificos de Google Ads, lee nuestra <Link href="/blog/cuanto-cuesta-google-ads-chile-2026" className="text-blue-600 font-semibold hover:underline">guia completa de costos de Google Ads en Chile 2026</Link>. Y para una comparativa directa entre Google y Meta, revisa nuestra <Link href="/blog/google-ads-vs-meta-ads-chile-2026" className="text-blue-600 font-semibold hover:underline">comparativa Google Ads vs Meta Ads 2026</Link>.
            </p>

            {/* Section 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-600" />
              Presupuesto recomendado por tamano de empresa
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              No todas las empresas deben invertir lo mismo. El presupuesto optimo depende de tus ingresos, margenes y velocidad de crecimiento deseada. Aqui van nuestras recomendaciones basadas en el mercado chileno, donde la publicidad digital ya representa el canal de adquisicion principal para la mayoria de las empresas.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-purple-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Tamano</th>
                    <th className="px-6 py-4 text-left font-bold">Inversion mensual total</th>
                    <th className="px-6 py-4 text-left font-bold">% de ingresos recomendado</th>
                    <th className="px-6 py-4 text-left font-bold">Canales sugeridos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Startup / Micro</td>
                    <td className="px-6 py-4 text-gray-700">$500.000 - $1.500.000</td>
                    <td className="px-6 py-4 text-gray-700">12-20%</td>
                    <td className="px-6 py-4 text-gray-700">Google Search + Meta (2 canales max)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Pyme</td>
                    <td className="px-6 py-4 text-gray-700">$1.500.000 - $5.000.000</td>
                    <td className="px-6 py-4 text-gray-700">8-15%</td>
                    <td className="px-6 py-4 text-gray-700">Google + Meta + 1 adicional</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Mediana</td>
                    <td className="px-6 py-4 text-gray-700">$5.000.000 - $15.000.000</td>
                    <td className="px-6 py-4 text-gray-700">6-12%</td>
                    <td className="px-6 py-4 text-gray-700">Google + Meta + LinkedIn + TikTok</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Enterprise</td>
                    <td className="px-6 py-4 text-gray-700">$15.000.000+</td>
                    <td className="px-6 py-4 text-gray-700">5-10%</td>
                    <td className="px-6 py-4 text-gray-700">Full mix + programatica + CTV</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Un dato importante: las startups y microempresas deben invertir un porcentaje mayor de sus ingresos en marketing digital porque necesitan generar awareness y adquisicion desde cero. A medida que la empresa crece y tiene una base de clientes, el porcentaje puede bajar porque el LTV de clientes existentes reduce la dependencia de adquisicion pura.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              La recomendacion mas importante que podemos dar: no disperses tu presupuesto en 5 canales si tu inversion total es menor a $3M/mes. Es mejor dominar 2 canales que estar presente de forma debil en 5. Google Search y Meta Ads son, sin duda, los dos canales prioritarios para una pyme chilena que esta comenzando con publicidad digital.
            </p>

            {/* Section 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              Presupuesto recomendado por industria
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Cada industria tiene una estructura de costos y competencia diferente en publicidad digital. Lo que funciona para un e-commerce no sirve para una firma de abogados, y viceversa. Aqui detallamos las inversiones recomendadas y los canales prioritarios por vertical en Chile.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-bold">Industria</th>
                    <th className="px-5 py-4 text-left font-bold">Inversion minima/mes</th>
                    <th className="px-5 py-4 text-left font-bold">Inversion optima/mes</th>
                    <th className="px-5 py-4 text-left font-bold">Canal prioritario</th>
                    <th className="px-5 py-4 text-left font-bold">ROAS esperado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">E-commerce</td>
                    <td className="px-5 py-4 text-gray-700">$1.500.000</td>
                    <td className="px-5 py-4 text-gray-700">$5.000.000 - $15.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Meta + Google PMax</td>
                    <td className="px-5 py-4 text-gray-700">3.5x - 8.0x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">Servicios Prof.</td>
                    <td className="px-5 py-4 text-gray-700">$800.000</td>
                    <td className="px-5 py-4 text-gray-700">$3.000.000 - $8.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Google Search</td>
                    <td className="px-5 py-4 text-gray-700">2.5x - 5.0x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">Inmobiliaria</td>
                    <td className="px-5 py-4 text-gray-700">$2.000.000</td>
                    <td className="px-5 py-4 text-gray-700">$5.000.000 - $20.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Google + Meta</td>
                    <td className="px-5 py-4 text-gray-700">3.0x - 12.0x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">Educacion</td>
                    <td className="px-5 py-4 text-gray-700">$1.000.000</td>
                    <td className="px-5 py-4 text-gray-700">$3.000.000 - $10.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Google + Meta</td>
                    <td className="px-5 py-4 text-gray-700">3.0x - 6.5x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">Salud / Clinicas</td>
                    <td className="px-5 py-4 text-gray-700">$1.200.000</td>
                    <td className="px-5 py-4 text-gray-700">$4.000.000 - $12.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Google Search</td>
                    <td className="px-5 py-4 text-gray-700">3.2x - 7.0x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">B2B / SaaS</td>
                    <td className="px-5 py-4 text-gray-700">$1.500.000</td>
                    <td className="px-5 py-4 text-gray-700">$5.000.000 - $15.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Google + LinkedIn</td>
                    <td className="px-5 py-4 text-gray-700">2.0x - 4.5x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">Gastronomia</td>
                    <td className="px-5 py-4 text-gray-700">$400.000</td>
                    <td className="px-5 py-4 text-gray-700">$1.500.000 - $4.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Meta + Google Maps</td>
                    <td className="px-5 py-4 text-gray-700">4.0x - 9.0x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">Turismo</td>
                    <td className="px-5 py-4 text-gray-700">$800.000</td>
                    <td className="px-5 py-4 text-gray-700">$3.000.000 - $10.000.000</td>
                    <td className="px-5 py-4 text-gray-700">Meta + Google + TikTok</td>
                    <td className="px-5 py-4 text-gray-700">3.5x - 8.5x</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Un patron claro que vemos en Chile: las industrias con ticket promedio alto (inmobiliaria, B2B, servicios profesionales) necesitan mayor inversion minima porque sus CPCs son mas altos, pero su ROAS potencial tambien es mayor por el valor de cada conversion. En cambio, industrias con ticket bajo (gastronomia, retail) pueden empezar con menos inversion pero necesitan volumen para ser rentables.
            </p>

            {/* Section 4 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-600" />
              Ajustes estacionales: cuando invertir mas y cuando menos
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              La estacionalidad es un factor clave que muchas empresas chilenas ignoran al planificar su presupuesto de publicidad digital. Los costos por clic y las tasas de conversion varian significativamente segun la epoca del ano, y ajustar tu presupuesto en consecuencia puede mejorar tu ROAS anual entre un 15% y 25%.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Periodos de alta inversion (+20-40%)</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>Octubre - Diciembre (Q4):</strong> Cyber Monday, Black Friday, Navidad. Los CPCs suben 20-35% pero la conversion tambien aumenta. Si vendes productos, es tu momento. Sube presupuesto 30-40%.</li>
                  <li><strong>Marzo:</strong> Vuelta a clases, inicio de ano laboral. Educacion, servicios profesionales y B2B ven su mejor momento. Sube 20-25%.</li>
                  <li><strong>Mayo:</strong> Dia de la Madre. Retail, gastronomia y experiencias ven un spike. Sube 15-25%.</li>
                  <li><strong>Septiembre:</strong> Fiestas Patrias. Turismo, gastronomia, retail masivo. Sube 20-30%.</li>
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Periodos de baja inversion (-15-25%)</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>Enero:</strong> Vacaciones de verano. La mayoria de las industrias B2B bajan. CPCs pueden ser menores pero la conversion tambien baja. Reduce 15-20%.</li>
                  <li><strong>Febrero:</strong> Similar a enero pero con leve recuperacion en la segunda quincena. Reduce 10-15%.</li>
                  <li><strong>Julio (primera quincena):</strong> Vacaciones de invierno. B2B desacelera, pero turismo y entretenimiento suben. Ajusta segun tu industria.</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">Nota: la estacionalidad varia por industria. Turismo tiene su propio ciclo inverso al B2B.</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              La regla de oro es: no distribuyas tu presupuesto anual de forma uniforme entre los 12 meses. Planifica un presupuesto base mensual y ten una reserva del 25-30% del total anual para redistribuir hacia los meses de mayor oportunidad en tu industria. Esta flexibilidad presupuestaria es lo que diferencia a las empresas que obtienen ROAS excepcional de las que obtienen resultados mediocres.
            </p>

            {/* Section 5 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Scale className="w-8 h-8 text-indigo-600" />
              Media mix modeling: como encontrar tu combinacion optima
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              El Media Mix Modeling (MMM) es una tecnica que permite determinar la contribucion de cada canal publicitario a tus resultados de negocio. Aunque tradicionalmente estaba reservado para grandes empresas con presupuestos millonarios, en 2026 existen herramientas accesibles que permiten a medianas empresas chilenas implementar versiones simplificadas.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Principios basicos del Media Mix para Chile</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Diversificacion minima:</strong> No pongas mas del 60% de tu presupuesto en un solo canal. Si Google Search desaparece manana (cambio de algoritmo, suspension de cuenta), necesitas otros canales activos.</li>
                <li><strong>Regla del 70/20/10:</strong> 70% en canales probados con ROAS demostrado, 20% en canales en crecimiento con potencial, 10% en experimentacion (nuevos formatos, canales emergentes).</li>
                <li><strong>Atribucion multi-touch:</strong> El ultimo clic no cuenta toda la historia. Un usuario puede ver tu anuncio en Instagram, buscarte en Google y convertir. Sin atribucion multi-touch, subestimas el valor de Meta y sobrevaloras Google.</li>
                <li><strong>Incrementalidad:</strong> No todo lo que reporta Google o Meta como conversion es incremental. Estudios de lift (conversion lift) ayudan a entender cuantas ventas son realmente generadas por la publicidad vs. las que habrian ocurrido de todas formas.</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              En la practica, para una pyme chilena con inversion bajo $10M/mes, recomendamos una version simplificada: mide la correlacion entre gasto por canal y resultados de negocio (ventas, leads calificados) de forma semanal durante al menos 3 meses. Varía tu inversion entre canales de forma controlada para entender la elasticidad. Los canales donde un aumento del 20% en gasto genera un aumento mayor al 15% en resultados tienen potencial de escalar. Los que no responden al incremento estan en su techo y no vale la pena subir mas.
            </p>

            {/* Section 6 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Cuando escalar tu inversion (y cuando cortarla)
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Saber cuando escalar y cuando frenar es una de las habilidades mas valiosas en performance marketing. Muchas empresas cometen el error de escalar demasiado rapido cuando ven buenos resultados, o de cortar presupuesto cuando los resultados bajan temporalmente sin investigar la causa.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Senales para ESCALAR</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>ROAS consistente sobre 3x por 4+ semanas:</strong> Si tus campanas estan generando al menos 3 pesos por cada peso invertido de forma sostenida, hay espacio para crecer.</li>
                  <li><strong>CPL estable o en baja:</strong> Si tu costo por lead no sube al aumentar presupuesto, el mercado tiene mas demanda que capturar.</li>
                  <li><strong>Tasa de cierre estable:</strong> Si tus leads siguen cerrando al mismo ritmo, tu equipo comercial puede absorber mas volumen.</li>
                  <li><strong>Impression Share bajo (menor a 70%):</strong> Si no estas apareciendo en todas las busquedas relevantes, hay oportunidad de crecer sin saturar.</li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">Senales para REDUCIR o PAUSAR</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>CPL en aumento sostenido por 3+ semanas:</strong> Si cada semana pagas mas por lead sin mejora en calidad, algo no esta funcionando. Investiga antes de seguir gastando.</li>
                  <li><strong>Tasa de cierre en caida:</strong> Si generas mas leads pero cierras menos, el problema puede estar en la calidad de leads o en tu proceso comercial.</li>
                  <li><strong>ROAS bajo 2x:</strong> Por debajo de 2x la mayoria de los negocios no son rentables. Reduce, optimiza y vuelve a subir cuando los numeros mejoren.</li>
                  <li><strong>Saturacion de mercado:</strong> Si tu Impression Share ya es mayor a 90% y subes presupuesto, solo pagaras mas por los mismos usuarios.</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">Regla de escalamiento M&P:</p>
              <p className="text-gray-700">
                Nunca subas mas del 20% del presupuesto por semana. Los algoritmos de Smart Bidding de Google y Meta necesitan estabilidad para optimizar. Un aumento del 50% de un dia para otro reinicia el periodo de aprendizaje y puede subir tu CPL un 30-40% temporalmente.
              </p>
            </div>

            {/* Section 7 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              Presupuesto de branding vs. performance: la proporcion correcta
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Uno de los debates mas frecuentes en marketing digital es cuanto destinar a branding (awareness, consideracion) versus performance (leads, ventas directas). La respuesta para Chile en 2026 depende de la madurez de tu marca.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Marca nueva (0-2 anos): 80% performance / 20% branding</h3>
                  <p className="text-gray-700">Cuando nadie te conoce, necesitas resultados medibles rapido. Destina la gran mayoria a campanas de conversion directa (Google Search, Meta lead gen) y una fraccion a awareness basico (Instagram stories, YouTube bumpers) para construir familiaridad.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Marca en crecimiento (2-5 anos): 65% performance / 35% branding</h3>
                  <p className="text-gray-700">Ya tienes traccion. Invertir mas en branding reduce tu dependencia de paid media a largo plazo porque el brand search crece, el CTR de tus anuncios mejora y tu CPL baja naturalmente.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Marca establecida (5+ anos): 50% performance / 50% branding</h3>
                  <p className="text-gray-700">Las marcas establecidas se benefician enormemente de mantener awareness alto. Estudios muestran que por cada 10% de aumento en awareness, el CPL de campanas de performance baja un 5-8%. El branding alimenta el performance.</p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-600" />
              Errores comunes al definir presupuesto en Chile
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Despues de analizar cientos de presupuestos de marketing digital en Chile, estos son los errores que mas dinero desperdician.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 1: Copiar el presupuesto de la competencia</h3>
                <p className="text-gray-700">Cada empresa tiene margenes, ticket promedio y capacidad comercial diferente. Lo que funciona para tu competidor puede no funcionar para ti. Calcula tu presupuesto basado en TUS numeros: ticket promedio, margen, tasa de cierre y CAC maximo aceptable.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 2: Presupuesto fijo mensual sin flexibilidad</h3>
                <p className="text-gray-700">Un presupuesto rigido ignora la estacionalidad y las oportunidades de mercado. Ten siempre un 20-30% de reserva para redistribuir hacia periodos u oportunidades de alto retorno.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 3: No incluir el costo de la agencia o equipo interno</h3>
                <p className="text-gray-700">Tu inversion total no es solo lo que pagas a Google o Meta. Incluye fee de agencia, herramientas, creatividades, landing pages y tracking. Si tienes $2M de presupuesto total, tu inversion en media sera $1.2M-$1.6M, no $2M.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 4: Evaluar demasiado pronto</h3>
                <p className="text-gray-700">Las campanas digitales necesitan al menos 4-6 semanas para estabilizarse. Evaluar resultados en la semana 2 y tomar decisiones drasticas es el equivalente a plantar un arbol y arrancarlo a los 3 dias porque no dio frutos.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-2">Error 5: Invertir en demasiados canales con poco presupuesto</h3>
                <p className="text-gray-700">Si tu presupuesto total en media es $1.5M/mes, no lo repartas entre Google, Meta, LinkedIn, TikTok y programatica. Tendrias $300K por canal, insuficiente para cualquiera. Concentrate en 2 canales maximo y dominalos.</p>
              </div>
            </div>

            {/* Section 9 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-teal-600" />
              Como calcular tu presupuesto ideal: formula practica
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Si no sabes por donde empezar, usa esta formula que utilizamos en M&P para calcular el presupuesto minimo viable para cualquier empresa.
            </p>

            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Formula de presupuesto minimo viable</h3>
              <div className="space-y-4 text-gray-700">
                <p><strong>Paso 1:</strong> Define cuantos clientes nuevos necesitas al mes para que el negocio crezca. Ejemplo: 10 clientes/mes.</p>
                <p><strong>Paso 2:</strong> Determina tu tasa de cierre de leads a clientes. Ejemplo: 20% (1 de cada 5 leads se convierte en cliente).</p>
                <p><strong>Paso 3:</strong> Calcula cuantos leads necesitas: 10 clientes / 20% = 50 leads/mes.</p>
                <p><strong>Paso 4:</strong> Estima tu CPL segun tu industria (usa nuestra tabla de arriba). Ejemplo: $18.000/lead.</p>
                <p><strong>Paso 5:</strong> Presupuesto en media = 50 leads x $18.000 = <strong>$900.000/mes</strong>.</p>
                <p><strong>Paso 6:</strong> Presupuesto total = $900.000 x 1.5 (fee agencia + herramientas) = <strong>$1.350.000/mes</strong>.</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Esta formula te da un punto de partida solido. Ajustala segun tus datos reales despues de los primeros 2-3 meses de campana. Para una calculadora interactiva, visita nuestro <Link href="/labs/predictor" className="text-blue-600 font-semibold hover:underline">Predictor de Campanas</Link> donde puedes simular diferentes escenarios de inversion y ver proyecciones de leads y revenue.
            </p>

            {/* Section 10 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Tendencias de inversion digital Chile 2026 y proyecciones
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              El mercado de publicidad digital en Chile sigue creciendo. Segun datos de la industria, la inversion total en publicidad digital en Chile alcanzara los USD $850 millones en 2026, un crecimiento del 14% respecto a 2025. Esto significa mas competencia, pero tambien mas oportunidades para las empresas que saben invertir estrategicamente.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Connected TV (CTV) gana terreno</h3>
                  <p className="text-gray-700">La publicidad en streaming (YouTube TV, Pluto TV, servicios con ads) crece un 45% en Chile. Para empresas con presupuesto sobre $10M/mes, CTV es un canal emergente interesante para awareness de alto impacto.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">TikTok madura como canal de performance</h3>
                  <p className="text-gray-700">TikTok ya no es solo awareness. Su plataforma de ads ha mejorado significativamente en targeting y conversion tracking, permitiendo campanas de lead gen y e-commerce con resultados medibles. Los CPMs siguen siendo 40-60% menores que Meta.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">IA redefine la gestion de campanas</h3>
                  <p className="text-gray-700">Performance Max de Google y Advantage+ de Meta concentran cada vez mas inversion. Estas campanas automatizadas requieren menos gestion manual pero mas habilidad en definir senales de conversion correctas y assets de calidad. Lee mas en nuestro articulo sobre <Link href="/blog/tendencias-marketing-digital-chile-2026" className="text-blue-600 font-semibold hover:underline">tendencias de marketing digital Chile 2026</Link>.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Retail Media crece en Chile</h3>
                  <p className="text-gray-700">Falabella, Mercado Libre y Cencosud ofrecen plataformas de ads dentro de sus marketplaces. Para marcas que venden en estos canales, destinar un 5-10% del presupuesto a retail media puede generar ROAS superiores a 5x por la alta intencion de compra.</p>
                </div>
              </div>
            </div>

            {/* Section 11 - Checklist */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              Checklist: antes de definir tu presupuesto
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Calcula tu ticket promedio y margen por venta. Sin esto, no puedes determinar tu CAC maximo aceptable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Define cuantos clientes nuevos necesitas al mes para alcanzar tus objetivos de crecimiento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Conoce tu tasa de cierre historica (si la tienes) o estima conservadoramente (10-20% para servicios, 1-3% para e-commerce).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">4.</span>
                  <span>Investiga los CPCs y CPLs de tu industria en Chile (usa las tablas de este articulo como referencia).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">5.</span>
                  <span>Define si priorizas volumen (mas leads, menor calificacion) o calidad (menos leads, mayor calificacion).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">6.</span>
                  <span>Incluye todos los costos (media + agencia + herramientas + creatividades) en tu presupuesto total.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">7.</span>
                  <span>Planifica al menos 3 meses de inversion. Evaluar resultados en menos de 8 semanas genera conclusiones erroneas.</span>
                </li>
              </ul>
            </div>

            {/* FAQ Section */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-8">Preguntas frecuentes sobre inversion en publicidad digital</h2>

            <div className="space-y-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cual es la inversion minima para empezar con publicidad digital en Chile?</h3>
                <p className="text-gray-700">Depende de tu industria, pero como regla general: $500.000 CLP/mes en media es el minimo absoluto para obtener datos significativos en un solo canal. Para una estrategia multicanal basica (Google + Meta), necesitas al menos $1.200.000 - $1.500.000 CLP/mes en media, mas el costo de gestion.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Que porcentaje de mis ingresos deberia destinar a marketing digital?</h3>
                <p className="text-gray-700">Las empresas chilenas exitosas destinan entre el 8% y el 15% de sus ingresos brutos a marketing digital. Startups en fase de crecimiento pueden llegar al 20%. Empresas establecidas con marca reconocida pueden bajar al 5-8%. El porcentaje correcto depende de tu margen, tu fase de crecimiento y tu dependencia de adquisicion digital.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Es mejor invertir todo en un canal o distribuir entre varios?</h3>
                <p className="text-gray-700">Si tu presupuesto es menor a $2M/mes, concentrate en 1-2 canales. Con $2M-$5M, puedes usar 2-3 canales efectivamente. Sobre $5M, distribuir en 3-4 canales es recomendable para diversificar riesgo y capturar diferentes puntos del funnel. Lee nuestra <Link href="/blog/guia-marketing-digital-pymes-chile-2026" className="text-blue-600 font-semibold hover:underline">guia de marketing digital para pymes</Link> para mas detalle.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cuanto deberia invertir en Google Ads vs Meta Ads?</h3>
                <p className="text-gray-700">La proporcion tipica es 55-60% Google / 40-45% Meta para servicios y B2B (donde la busqueda activa domina), y 40-45% Google / 55-60% Meta para e-commerce y productos visuales (donde la generacion de demanda es clave). Nuestra <Link href="/blog/google-ads-vs-meta-ads-chile-2026" className="text-blue-600 font-semibold hover:underline">comparativa Google Ads vs Meta Ads</Link> detalla los escenarios optimos.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Vale la pena invertir en LinkedIn Ads en Chile?</h3>
                <p className="text-gray-700">Si vendes servicios B2B de alto ticket (sobre $2.000.000 CLP por venta), LinkedIn Ads es muy efectivo en Chile. Los CPCs son altos ($2.000 - $5.000) pero la calidad de los leads es superior porque puedes segmentar por cargo, industria y tamano de empresa. No recomendamos LinkedIn para B2C o tickets bajos porque el costo no se justifica.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Deberia invertir en TikTok Ads en 2026?</h3>
                <p className="text-gray-700">Si tu audiencia tiene entre 18 y 40 anos y tu producto es visual o experiencial, TikTok ofrece CPMs 40-60% menores que Meta y una capacidad de viralidad unica. Para e-commerce de moda, belleza, food y entretenimiento, TikTok ya es imprescindible. Para B2B o servicios profesionales, aun no es prioritario.</p>
              </div>
            </div>

            {/* Conclusion CTA */}
            <div className="bg-gradient-to-br from-green-600 to-blue-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                Necesitas ayuda para definir tu presupuesto de publicidad digital?
              </h3>
              <p className="text-xl text-green-100 mb-8">
                En M&P analizamos tu negocio, industria y objetivos para construir un plan de inversion con proyecciones reales basadas en data del mercado chileno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contacto"
                  className="inline-block bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  Agendar Diagnostico Gratis
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-block bg-green-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-400 transition-all hover:scale-105 border border-green-400"
                >
                  Simular Mi Inversion
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <nav className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Articulos Relacionados</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/blog/cuanto-cuesta-google-ads-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Cuanto Cuesta Google Ads Chile 2026 &rarr;
              </Link>
              <Link href="/blog/google-ads-vs-meta-ads-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Google Ads vs Meta Ads Chile 2026 &rarr;
              </Link>
              <Link href="/blog/guia-marketing-digital-pymes-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Guia Marketing Digital Pymes Chile 2026 &rarr;
              </Link>
              <Link href="/blog/tendencias-marketing-digital-chile-2026" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                Tendencias Marketing Digital Chile 2026 &rarr;
              </Link>
              <Link href="/labs/predictor" className="text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg">
                Predictor de Campanas &rarr;
              </Link>
            </div>
          </nav>
        </div>
      </article>

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
