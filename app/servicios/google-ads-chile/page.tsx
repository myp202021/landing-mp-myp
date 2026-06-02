/**
 * Página Servicio: Google Ads Chile
 * SEO optimizada para rankear "agencia google ads chile"
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createServiceSchema,
  createFAQPageSchema,
  createBreadcrumbSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia Google Ads Chile | Expertos Certificados en SEM y Performance',
  description: 'Agencia Google Ads en Chile especializada en campañas de alto rendimiento. Equipo certificado, transparencia total y resultados medibles. Desde $990.000/mes.',
  keywords: [
    'agencia google ads chile',
    'google ads chile',
    'agencia google ads santiago',
    'mejor agencia google ads chile',
    'especialistas google ads chile',
    'gestión google ads chile',
    'campañas google ads chile',
    'google adwords chile',
    'sem chile',
    'publicidad google chile'
  ],
  path: '/servicios/google-ads-chile'
})

export default function GoogleAdsChilePage() {
  // Schema markup
  const serviceSchema = createServiceSchema({
    name: 'Gestión Google Ads Chile',
    description: 'Servicio profesional de gestión de campañas Google Ads en Chile con equipo dedicado y optimización continua',
    serviceType: 'Publicidad Digital',
    price: '990000',
    priceCurrency: 'CLP'
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Servicios', url: 'https://www.mulleryperez.cl' },
    { name: 'Google Ads Chile', url: 'https://www.mulleryperez.cl/servicios/google-ads-chile' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Cuánto cuesta una agencia de Google Ads en Chile?',
      answer: 'El costo de una agencia de Google Ads en Chile varía entre $600.000 y $1.500.000+ mensuales. En Muller y Pérez ofrecemos gestión profesional desde $990.000/mes con equipo dedicado de 3 personas, acceso full a tu cuenta y reportería semanal.'
    },
    {
      question: '¿Qué incluye el servicio de Google Ads?',
      answer: 'Nuestro servicio incluye: investigación de keywords, creación y optimización de campañas Search, Shopping, Display y Performance Max, gestión de presupuesto, optimización de pujas, testing de anuncios, análisis de conversiones, reportería semanal y reuniones mensuales estratégicas.'
    },
    {
      question: '¿Cuánto debería invertir en Google Ads mensualmente?',
      answer: 'Recomendamos un mínimo de $1.500.000 - $2.000.000 CLP mensuales en inversión publicitaria (además del fee de agencia) para tener data suficiente y optimizar correctamente. Con presupuestos menores, la fase de aprendizaje toma más tiempo.'
    },
    {
      question: '¿En cuánto tiempo se ven resultados con Google Ads?',
      answer: 'Los primeros leads pueden llegar desde el día 1 de activar las campañas. Sin embargo, la optimización real requiere 2-3 meses de data para alcanzar el costo por adquisición (CPA) óptimo. Trabajamos con transparencia total desde el inicio.'
    },
    {
      question: '¿Por qué elegir una agencia certificada de Google Ads?',
      answer: 'Las agencias certificadas Google Partner tienen acceso a soporte prioritario de Google, herramientas exclusivas, capacitación constante y han demostrado expertise manejando campañas exitosas. En M&P somos Google Partners certificados.'
    },
    {
      question: '¿Cuánto debo invertir en Google Ads?',
      answer: 'La inversión mínima recomendada en Google Ads para Chile es de $1.500.000 a $2.000.000 CLP mensuales en pauta publicitaria, además del fee de agencia. Este monto permite recopilar datos suficientes para optimizar campañas en 4-6 semanas. Industrias con CPC alto como legal o salud pueden requerir presupuestos mayores.'
    },
    {
      question: '¿Cuánto tiempo toma ver resultados con Google Ads?',
      answer: 'Los primeros clicks y leads pueden llegar en las primeras 24-48 horas de activar una campaña. Sin embargo, la optimización real del CPA y ROAS requiere entre 2 y 3 meses de data acumulada. Durante este período se refinan keywords, pujas, audiencias y anuncios para alcanzar el rendimiento óptimo.'
    },
    {
      question: '¿Necesito una landing page para Google Ads?',
      answer: 'Sí, contar con una landing page dedicada y optimizada es fundamental para maximizar la tasa de conversión de tus campañas Google Ads. Una landing page bien diseñada puede duplicar o triplicar tu tasa de conversión comparada con enviar tráfico a la home de tu sitio. En M&P te asesoramos en la estructura ideal.'
    },
    {
      question: '¿Qué es Quality Score y por qué importa?',
      answer: 'El Quality Score es una métrica de Google (1-10) que evalúa la relevancia de tus keywords, anuncios y landing pages. Un Quality Score alto reduce tu CPC real y mejora tu posición en los resultados. Optimizar el Quality Score puede reducir tus costos entre un 20% y 50% sin perder visibilidad.'
    },
    {
      question: '¿Google Ads sirve para empresas pequeñas?',
      answer: 'Absolutamente. Google Ads es una de las herramientas más efectivas para PYMEs porque pagas solo cuando alguien hace clic en tu anuncio y puedes definir presupuestos diarios controlados. Lo clave es elegir las keywords correctas y tener una estrategia enfocada para no desperdiciar presupuesto en búsquedas irrelevantes.'
    }
  ])

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-blue-200 hover:text-white transition">Inicio</Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white font-semibold">Google Ads Chile</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full mb-6">
                  <span className="text-green-300 font-semibold">✓ Google Partner Certificado</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Agencia Google Ads Chile:<br />
                  <span className="text-blue-300">Resultados Medibles, Transparencia Total</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Somos una agencia especializada en <strong>Google Ads en Chile</strong> con equipo certificado,
                  acceso full a tu cuenta y foco 100% en performance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/#contact"
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center"
                  >
                    Solicitar Auditoría Gratis
                  </Link>
                  <Link
                    href="/#pricing"
                    className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg hover:bg-white/20 transition font-semibold text-center"
                  >
                    Ver Planes
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">¿Por Qué Google Ads?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Intención de compra alta</strong>
                      <span className="text-blue-200">Usuarios buscando activamente tu servicio</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Resultados desde día 1</strong>
                      <span className="text-blue-200">Tráfico calificado inmediato</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">100% medible</strong>
                      <span className="text-blue-200">Sabes cuánto te cuesta cada cliente</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-5xl py-16">
          {/* Qué incluye */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ¿Qué Incluye Nuestro Servicio de Google Ads en Chile?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Campañas Search (Búsqueda)
                </h3>
                <p className="text-gray-700">
                  Aparece en los primeros resultados cuando tus clientes potenciales buscan tu servicio en Google.
                  Optimización de keywords, anuncios y landing pages.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Campañas Shopping (E-commerce)
                </h3>
                <p className="text-gray-700">
                  Muestra tus productos con imagen, precio y disponibilidad directamente en Google. Ideal para
                  tiendas online con alto ROAS.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Campañas Display (Remarketing)
                </h3>
                <p className="text-gray-700">
                  Re-impacta a usuarios que visitaron tu sitio pero no convirtieron. Banners visuales en la red
                  de display de Google.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Performance Max (Automatización IA)
                </h3>
                <p className="text-gray-700">
                  La tecnología más avanzada de Google. Automatiza la distribución de presupuesto entre todos
                  los canales para maximizar conversiones.
                </p>
              </div>
            </div>
          </section>

          {/* Proceso */}
          <section className="mb-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nuestro Proceso de Gestión de Google Ads
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Auditoría Inicial y Estrategia
                  </h3>
                  <p className="text-gray-700">
                    Analizamos tu situación actual (si ya tienes Google Ads) o hacemos research de mercado.
                    Definimos keywords, presupuesto y KPIs objetivos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Configuración y Lanzamiento
                  </h3>
                  <p className="text-gray-700">
                    Creamos las campañas optimizadas, configuramos tracking completo (conversiones, GA4, Tag Manager)
                    y lanzamos. Primeros resultados en 24-48 horas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Optimización Continua
                  </h3>
                  <p className="text-gray-700">
                    Monitoreamos diariamente, optimizamos semanalmente. Ajustamos pujas, pausamos keywords
                    no rentables, testeamos nuevos anuncios, mejoramos Quality Score.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Reportería y Escalamiento
                  </h3>
                  <p className="text-gray-700">
                    Reportes semanales automáticos + reunión mensual estratégica. Cuando las campañas están
                    rentables, escalamos presupuesto para crecer sin perder eficiencia.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Diferenciadores */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ¿Por Qué Somos la Mejor Agencia de Google Ads en Chile?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Google Partner Certificado
                </h3>
                <p className="text-gray-700">
                  Equipo con certificaciones oficiales de Google y años de experiencia gestionando millones
                  en inversión publicitaria.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🔓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Acceso Full a Tu Cuenta
                </h3>
                <p className="text-gray-700">
                  No somos propietarios de tu cuenta. Tienes acceso completo desde día 1. Si te vas, te llevas
                  todo tu historial.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Performance, No Vanidad
                </h3>
                <p className="text-gray-700">
                  No te vendemos "impresiones" o "clicks". Te decimos exactamente cuánto te cuesta conseguir
                  un cliente nuevo (CAC).
                </p>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Planes de Google Ads en Chile
            </h2>

            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Gold</h3>
                  <p className="text-gray-600">El más popular para empresas en crecimiento</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">$990.000</div>
                  <div className="text-gray-600">/ mes + IVA</div>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Equipo dedicado de 3 profesionales</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Todas las campañas Google Ads</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Acceso full a tu cuenta</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Reportería semanal</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Optimización diaria</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Reuniones mensuales estratégicas</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              * Presupuesto publicitario aparte (mínimo recomendado: $1.5M - $2M CLP/mes)
            </p>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre Google Ads en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto cuesta una agencia de Google Ads en Chile?',
                  a: 'El costo de una agencia de Google Ads en Chile varía entre $600.000 y $1.500.000+ mensuales. En Muller y Pérez ofrecemos gestión profesional desde $990.000/mes con equipo dedicado de 3 personas, acceso full a tu cuenta y reportería semanal.'
                },
                {
                  q: '¿Qué incluye el servicio de Google Ads?',
                  a: 'Nuestro servicio incluye: investigación de keywords, creación y optimización de campañas Search, Shopping, Display y Performance Max, gestión de presupuesto, optimización de pujas, testing de anuncios, análisis de conversiones, reportería semanal y reuniones mensuales estratégicas.'
                },
                {
                  q: '¿Cuánto debería invertir en Google Ads mensualmente?',
                  a: 'Recomendamos un mínimo de $1.500.000 - $2.000.000 CLP mensuales en inversión publicitaria (además del fee de agencia) para tener data suficiente y optimizar correctamente. Con presupuestos menores, la fase de aprendizaje toma más tiempo.'
                },
                {
                  q: '¿En cuánto tiempo se ven resultados con Google Ads?',
                  a: 'Los primeros leads pueden llegar desde el día 1 de activar las campañas. Sin embargo, la optimización real requiere 2-3 meses de data para alcanzar el costo por adquisición (CPA) óptimo. Trabajamos con transparencia total desde el inicio.'
                },
                {
                  q: '¿Por qué elegir una agencia certificada de Google Ads?',
                  a: 'Las agencias certificadas Google Partner tienen acceso a soporte prioritario de Google, herramientas exclusivas, capacitación constante y han demostrado expertise manejando campañas exitosas. En M&P somos Google Partners certificados.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tipos de Campañas */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tipos de Campañas Google Ads que Gestionamos
            </h2>
            <p className="text-gray-700 mb-8">
              Como <strong>agencia Google Ads en Chile</strong> con experiencia en múltiples industrias, gestionamos todos los formatos de campaña disponibles en la plataforma. Cada tipo cumple un rol distinto dentro de tu estrategia de performance.
            </p>

            <div className="space-y-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Campañas Search (Búsqueda)</h3>
                <p className="text-gray-700">
                  Las campañas de búsqueda son el pilar de cualquier estrategia de Google Ads. Tus anuncios aparecen cuando un usuario busca activamente tu producto o servicio, lo que significa alta intención de compra. Ideal para servicios profesionales, salud, legal y cualquier negocio B2B donde el cliente investiga antes de contratar.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Campañas Shopping</h3>
                <p className="text-gray-700">
                  Shopping muestra tus productos con imagen, precio y nombre de tu tienda directamente en los resultados de Google. Es el formato con mayor ROAS para e-commerce, ya que el usuario ve el producto y su precio antes de hacer clic. Requiere un feed de productos bien estructurado en Google Merchant Center.
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Campañas Display y Remarketing</h3>
                <p className="text-gray-700">
                  La red de Display de Google alcanza al 90% de los usuarios de internet. Usamos Display principalmente para remarketing: re-impactar a personas que visitaron tu sitio pero no convirtieron. También es efectiva para branding y posicionamiento de marca con audiencias segmentadas por intereses y comportamiento.
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Max</h3>
                <p className="text-gray-700">
                  Performance Max utiliza inteligencia artificial de Google para distribuir tu presupuesto entre Search, Display, YouTube, Gmail, Discover y Maps simultáneamente. Es la campaña más avanzada de Google y funciona especialmente bien cuando tienes suficientes datos de conversión (al menos 30 conversiones mensuales) para que el algoritmo optimice.
                </p>
              </div>

              <div className="border-l-4 border-red-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">YouTube Ads (Video)</h3>
                <p className="text-gray-700">
                  YouTube es el segundo motor de búsqueda del mundo. Las campañas de video permiten llegar a audiencias masivas con costos por vista muy bajos (desde $5-15 CLP por vista). Ideales para awareness de marca, lanzamientos de producto y remarketing en video para audiencias que ya interactuaron con tu sitio.
                </p>
              </div>

              <div className="border-l-4 border-indigo-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Campañas Demand Gen (ex Discovery)</h3>
                <p className="text-gray-700">
                  Las campañas Demand Gen aparecen en YouTube, Gmail y el feed Discover de Google con formatos visuales atractivos. Son perfectas para generar demanda en etapas tempranas del funnel, especialmente en industrias B2C donde la decisión de compra se alimenta de inspiración visual y descubrimiento.
                </p>
              </div>
            </div>
          </section>

          {/* Resultados Reales */}
          <section className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resultados Reales con Google Ads en Chile
            </h2>
            <p className="text-gray-700 mb-8">
              Estos son ejemplos de resultados obtenidos por clientes gestionados por nuestro equipo. Los datos son reales, aunque omitimos nombres por confidencialidad.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-blue-600 mb-2">Inmobiliaria en Santiago</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">CPA reducido de $12.000 a $4.800 en 90 días</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Reestructuramos las campañas Search segmentando por comuna y tipo de propiedad. Implementamos extensiones de ubicación y optimizamos landing pages específicas por proyecto.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">-60% CPA</div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">+140% leads</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-purple-600 mb-2">E-commerce de Moda</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">ROAS de 2.1x a 5.8x con Shopping + PMax</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Migramos de campañas Search genéricas a Shopping segmentado por categoría combinado con Performance Max. Optimizamos el feed de productos y creamos audiencias de remarketing.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">ROAS 5.8x</div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">+176% ventas</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-green-600 mb-2">Clínica Dental en Providencia</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">De 15 a 48 agendamientos mensuales</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Implementamos campañas Search con keywords de alta intención (&quot;dentista urgencia providencia&quot;) y remarketing Display para pacientes que visitaron el sitio sin agendar.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">+220% leads</div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">CPA $6.200</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-orange-600 mb-2">SaaS B2B (Software de Gestión)</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">CAC reducido en 45% en 4 meses</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Combinamos Search de alta intención con remarketing en YouTube. Implementamos conversiones offline importando datos del CRM para optimizar hacia leads calificados, no solo formularios.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">-45% CAC</div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">+85% MQLs</div>
                </div>
              </div>
            </div>
          </section>

          {/* Cuánto Cuesta Google Ads en Chile */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cuánto Cuesta Google Ads en Chile en 2026
            </h2>
            <p className="text-gray-700 mb-6">
              El costo por clic (CPC) en Google Ads varía significativamente según la industria en Chile. Estos son los promedios actualizados que manejamos basados en nuestra experiencia y datos de mercado. Para datos en tiempo real, consulta nuestro{' '}
              <Link href="/indicadores" className="text-blue-600 hover:underline font-semibold">
                Termómetro de Marketing Digital
              </Link>.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="text-left px-6 py-4 font-semibold">Industria</th>
                    <th className="text-center px-6 py-4 font-semibold">CPC Promedio (CLP)</th>
                    <th className="text-center px-6 py-4 font-semibold">CVR Promedio</th>
                    <th className="text-center px-6 py-4 font-semibold">CPA Estimado (CLP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Inmobiliario</td>
                    <td className="px-6 py-4 text-center text-gray-700">$800 - $1.500</td>
                    <td className="px-6 py-4 text-center text-gray-700">2.5% - 4.0%</td>
                    <td className="px-6 py-4 text-center text-gray-700">$25.000 - $50.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Salud y Clínicas</td>
                    <td className="px-6 py-4 text-center text-gray-700">$600 - $1.200</td>
                    <td className="px-6 py-4 text-center text-gray-700">3.0% - 5.0%</td>
                    <td className="px-6 py-4 text-center text-gray-700">$15.000 - $35.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Legal / Abogados</td>
                    <td className="px-6 py-4 text-center text-gray-700">$1.200 - $2.500</td>
                    <td className="px-6 py-4 text-center text-gray-700">2.0% - 3.5%</td>
                    <td className="px-6 py-4 text-center text-gray-700">$40.000 - $80.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">E-commerce</td>
                    <td className="px-6 py-4 text-center text-gray-700">$300 - $700</td>
                    <td className="px-6 py-4 text-center text-gray-700">1.5% - 3.0%</td>
                    <td className="px-6 py-4 text-center text-gray-700">$12.000 - $30.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">SaaS / Tecnología</td>
                    <td className="px-6 py-4 text-center text-gray-700">$900 - $2.000</td>
                    <td className="px-6 py-4 text-center text-gray-700">1.5% - 2.5%</td>
                    <td className="px-6 py-4 text-center text-gray-700">$45.000 - $90.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Educación</td>
                    <td className="px-6 py-4 text-center text-gray-700">$400 - $900</td>
                    <td className="px-6 py-4 text-center text-gray-700">3.0% - 5.5%</td>
                    <td className="px-6 py-4 text-center text-gray-700">$10.000 - $25.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-600 text-sm">
              * Datos referenciales basados en campañas gestionadas en Chile. Los valores reales dependen de la competencia, ubicación y calidad de la cuenta. Simula tu CPA estimado con nuestro{' '}
              <Link href="/labs/predictor" className="text-blue-600 hover:underline font-semibold">
                Predictor de Resultados
              </Link>.
            </p>
          </section>

          {/* Google Ads vs Meta Ads */}
          <section className="mb-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Google Ads vs Meta Ads: ¿Cuál Elegir?
            </h2>
            <p className="text-gray-700 mb-6">
              Una de las preguntas más comunes que recibimos como <strong>agencia de Google Ads en Chile</strong> es si conviene más invertir en Google o en Meta (Facebook e Instagram). La respuesta depende de tu modelo de negocio.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="text-left px-6 py-4 font-semibold">Criterio</th>
                    <th className="text-center px-6 py-4 font-semibold">Google Ads</th>
                    <th className="text-center px-6 py-4 font-semibold">Meta Ads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Tipo de demanda</td>
                    <td className="px-6 py-4 text-center text-gray-700">Intención de búsqueda activa</td>
                    <td className="px-6 py-4 text-center text-gray-700">Descubrimiento e interrupción</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">CPC promedio Chile</td>
                    <td className="px-6 py-4 text-center text-gray-700">$500 - $2.000 CLP</td>
                    <td className="px-6 py-4 text-center text-gray-700">$100 - $500 CLP</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Mejor para B2B</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Excelente</td>
                    <td className="px-6 py-4 text-center text-gray-700">Limitado (LinkedIn mejor)</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Mejor para B2C</td>
                    <td className="px-6 py-4 text-center text-gray-700">Muy bueno (Search)</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Excelente</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Volumen de leads</td>
                    <td className="px-6 py-4 text-center text-gray-700">Menor pero más calificados</td>
                    <td className="px-6 py-4 text-center text-gray-700">Mayor volumen, menor calificación</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">E-commerce</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Shopping + PMax</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Catálogo + Advantage+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 mb-4">
              En la mayoría de los casos, recomendamos una estrategia combinada: Google Ads para capturar demanda existente y Meta Ads para generar demanda nueva. La proporción de inversión depende de tu industria y objetivos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/blog/google-ads-vs-meta-ads-cual-elegir-chile-2025"
                className="text-blue-600 hover:underline font-semibold"
              >
                Leer comparativa completa en el blog →
              </Link>
              <Link
                href="/servicios/meta-ads-chile"
                className="text-blue-600 hover:underline font-semibold"
              >
                Ver servicio Meta Ads Chile →
              </Link>
            </div>
          </section>

          {/* Errores Comunes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Errores Comunes en Google Ads (y Cómo los Evitamos)
            </h2>
            <p className="text-gray-700 mb-8">
              Después de auditar cientos de cuentas de Google Ads en Chile, estos son los errores más frecuentes que encontramos y que impactan directamente en el rendimiento de las campañas.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No usar palabras clave negativas</h3>
                  <p className="text-gray-700">
                    Sin negativas, tus anuncios aparecen en búsquedas irrelevantes que consumen presupuesto sin generar conversiones. Revisamos el informe de términos de búsqueda semanalmente y mantenemos listas de negativas actualizadas por campaña y a nivel de cuenta.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Landing page lenta o no optimizada</h3>
                  <p className="text-gray-700">
                    Una landing que carga en más de 3 segundos pierde hasta el 53% de los visitantes móviles. Además, Google penaliza con un Quality Score bajo. Nos aseguramos de que tu landing cargue rápido, sea mobile-first y tenga un CTA claro.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No trackear conversiones correctamente</h3>
                  <p className="text-gray-700">
                    Si no mides conversiones (formularios, llamadas, compras), Google no puede optimizar tus campañas. Configuramos tracking completo con Google Tag Manager, GA4 y conversiones importadas desde tu CRM para medir el valor real de cada lead.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Presupuesto mal distribuido entre campañas</h3>
                  <p className="text-gray-700">
                    Es común ver cuentas donde el 80% del presupuesto va a una sola campaña genérica. Distribuimos inversión según datos de rendimiento real: más presupuesto a campañas con mejor CPA, menos a las que están en fase de test.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Usar solo concordancia amplia sin control</h3>
                  <p className="text-gray-700">
                    La concordancia amplia puede generar mucho volumen pero con baja calidad. Usamos una mezcla estratégica de concordancia de frase y exacta para las keywords principales, y amplia solo con smart bidding y suficientes datos de conversión.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                  6
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No hacer testing de anuncios</h3>
                  <p className="text-gray-700">
                    Muchas cuentas tienen los mismos anuncios desde hace meses sin variaciones. Mantenemos al menos 3 variantes de anuncio por grupo, testamos títulos y descripciones continuamente, y pausamos los de peor rendimiento cada 2-3 semanas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs Adicionales */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes Adicionales sobre Google Ads
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto debo invertir en Google Ads?',
                  a: 'La inversión mínima recomendada en Google Ads para Chile es de $1.500.000 a $2.000.000 CLP mensuales en pauta publicitaria, además del fee de agencia. Este monto permite recopilar datos suficientes para optimizar campañas en 4-6 semanas. Industrias con CPC alto como legal o salud pueden requerir presupuestos mayores.'
                },
                {
                  q: '¿Cuánto tiempo toma ver resultados con Google Ads?',
                  a: 'Los primeros clicks y leads pueden llegar en las primeras 24-48 horas de activar una campaña. Sin embargo, la optimización real del CPA y ROAS requiere entre 2 y 3 meses de data acumulada. Durante este período se refinan keywords, pujas, audiencias y anuncios para alcanzar el rendimiento óptimo.'
                },
                {
                  q: '¿Necesito una landing page para Google Ads?',
                  a: 'Sí, contar con una landing page dedicada y optimizada es fundamental para maximizar la tasa de conversión de tus campañas Google Ads. Una landing page bien diseñada puede duplicar o triplicar tu tasa de conversión comparada con enviar tráfico a la home de tu sitio. En M&P te asesoramos en la estructura ideal.'
                },
                {
                  q: '¿Qué es Quality Score y por qué importa?',
                  a: 'El Quality Score es una métrica de Google (1-10) que evalúa la relevancia de tus keywords, anuncios y landing pages. Un Quality Score alto reduce tu CPC real y mejora tu posición en los resultados. Optimizar el Quality Score puede reducir tus costos entre un 20% y 50% sin perder visibilidad.'
                },
                {
                  q: '¿Google Ads sirve para empresas pequeñas?',
                  a: 'Absolutamente. Google Ads es una de las herramientas más efectivas para PYMEs porque pagas solo cuando alguien hace clic en tu anuncio y puedes definir presupuestos diarios controlados. Lo clave es elegir las keywords correctas y tener una estrategia enfocada para no desperdiciar presupuesto en búsquedas irrelevantes.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/planes"
                className="text-blue-600 hover:underline font-semibold"
              >
                Ver todos nuestros planes →
              </Link>
              <Link
                href="/labs/predictor"
                className="text-blue-600 hover:underline font-semibold"
              >
                Simula tus resultados con el Predictor →
              </Link>
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Crecer con Google Ads?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Solicita una auditoría gratuita de 30 minutos. Analizamos tu situación actual y te mostramos
              oportunidades concretas de mejora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Solicitar Auditoría Gratis
              </Link>
              <Link
                href="/agencia-marketing-digital-chile"
                className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
              >
                Conocer Todos los Servicios
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
