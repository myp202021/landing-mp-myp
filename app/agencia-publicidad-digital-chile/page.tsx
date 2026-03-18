/**
 * Página Pilar SEO: Agencia Publicidad Digital Chile
 * Optimizada para rankear en Google con keywords principales
 * +1500 palabras de contenido SEO-optimizado
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createWebPageSchema,
  createFAQPageSchema,
  createBreadcrumbSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia Publicidad Digital Chile | Google Ads, Meta Ads, LinkedIn & TikTok Ads',
  description: 'Agencia publicidad digital en Chile especializada en Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads. Campañas pagas de alto rendimiento con datos reales. Cotiza hoy.',
  keywords: [
    'agencia publicidad digital chile',
    'publicidad digital chile',
    'agencia de publicidad online chile',
    'agencia google ads chile',
    'agencia meta ads chile',
    'agencia linkedin ads chile',
    'agencia tiktok ads chile',
    'publicidad digital vs marketing digital',
    'campañas pagas chile'
  ],
  path: '/agencia-publicidad-digital-chile'
})

export default function AgenciaPublicidadDigitalChilePage() {
  // Schema markup
  const webPageSchema = createWebPageSchema(
    'Agencia Publicidad Digital Chile | Muller y Pérez',
    'Agencia publicidad digital en Chile especializada en Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads con equipo dedicado y resultados medibles',
    'https://www.mulleryperez.cl/agencia-publicidad-digital-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Publicidad Digital Chile', url: 'https://www.mulleryperez.cl/agencia-publicidad-digital-chile' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Qué es una agencia de publicidad digital en Chile?',
      answer: 'Una agencia de publicidad digital en Chile es una empresa especializada en crear, gestionar y optimizar campañas publicitarias pagas en plataformas como Google Ads, Meta Ads (Facebook/Instagram), LinkedIn Ads y TikTok Ads. En Muller y Pérez nos enfocamos en publicidad digital de performance, optimizando cada peso invertido para generar resultados medibles.'
    },
    {
      question: '¿Cuál es la diferencia entre publicidad digital y marketing digital?',
      answer: 'La publicidad digital es un componente del marketing digital. Marketing digital abarca SEO, contenido, redes sociales, email marketing, analítica, etc. Publicidad digital se enfoca específicamente en campañas pagas (Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads). En M&P somos expertos en publicidad paga de alto rendimiento.'
    },
    {
      question: '¿Cuánto cuesta contratar una agencia de publicidad digital en Chile?',
      answer: 'El costo de una agencia de publicidad digital en Chile varía entre $950.000 y $1.500.000+ mensuales dependiendo del servicio. En M&P ofrecemos planes transparentes desde $950k/mes que incluyen gestión de Google Ads, Meta Ads, LinkedIn Ads, equipo dedicado de 3 profesionales, acceso full a cuentas y reportería semanal.'
    },
    {
      question: '¿Qué plataformas de publicidad digital manejan en M&P?',
      answer: 'En Muller y Pérez manejamos las principales plataformas de publicidad digital: Google Ads (Search, Shopping, Display, Performance Max), Meta Ads (Facebook e Instagram), LinkedIn Ads (ideal para B2B) y TikTok Ads (para audiencias jóvenes). Todas optimizadas para conversiones reales, no solo clicks.'
    },
    {
      question: '¿Cuánto presupuesto necesito para publicidad digital en Chile?',
      answer: 'Recomendamos mínimo $500.000/mes en inversión publicitaria (más el fee de agencia) para obtener data suficiente y optimizar. Con presupuestos menores es difícil generar volumen de datos necesario para tomar decisiones informadas. En M&P trabajamos con presupuestos desde $500k/mes hasta $50M+/mes.'
    },
    {
      question: '¿Cuánto tiempo tarda en verse resultados con publicidad digital?',
      answer: 'Con publicidad digital, los primeros resultados se ven desde el día 1 (primeros clicks y conversiones). Sin embargo, la optimización real y CAC (costo de adquisición) eficiente se logra entre 4-8 semanas cuando tenemos suficiente data. A diferencia del SEO, la publicidad digital genera tráfico inmediato.'
    }
  ])

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-purple-200 hover:text-white transition">
                Inicio
              </Link>
              <span className="mx-2 text-purple-300">/</span>
              <span className="text-white font-semibold">Agencia Publicidad Digital Chile</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Agencia de Publicidad Digital en Chile:<br />
              Google Ads, Meta Ads, LinkedIn & TikTok Ads
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Somos una <strong>agencia de publicidad digital en Chile</strong> especializada en campañas pagas de alto rendimiento.
              Gestionamos <strong>Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads</strong> con datos reales y te decimos exactamente
              cuánto te cuesta conseguir cada cliente nuevo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center text-lg"
              >
                Cotizar Publicidad Digital
              </Link>
              <Link
                href="/#pricing"
                className="px-8 py-4 bg-white text-purple-900 rounded-lg hover:bg-purple-50 transition font-semibold text-center text-lg"
              >
                Ver Planes y Precios
              </Link>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-4xl py-16">
          {/* Introducción */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Qué es una Agencia de Publicidad Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Una <strong>agencia de publicidad digital en Chile</strong> es una empresa especializada en crear, gestionar y optimizar
              <strong> campañas publicitarias pagas</strong> en plataformas digitales como Google Ads, Meta Ads (Facebook/Instagram),
              LinkedIn Ads y TikTok Ads.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              A diferencia de una agencia de marketing digital (que abarca SEO, contenido, redes sociales orgánicas, email marketing, etc.),
              una <strong>agencia de publicidad digital</strong> se enfoca específicamente en <strong>campañas pagas que generan resultados
              inmediatos y medibles</strong>.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              En <strong>Muller y Pérez</strong>, somos especialistas en <strong>publicidad digital de performance</strong>, lo que significa
              que optimizamos cada peso invertido para generar el máximo retorno. No te vendemos clicks ni impresiones, te decimos exactamente:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2 ml-4">
              <li><strong>¿Cuánto te cuesta conseguir un lead?</strong> (CPL - Costo Por Lead)</li>
              <li><strong>¿Cuánto te cuesta conseguir un cliente nuevo?</strong> (CAC - Costo de Adquisición de Cliente)</li>
              <li><strong>¿Cuánto retorno obtienes por cada peso invertido?</strong> (ROAS - Return on Ad Spend)</li>
              <li><strong>¿Qué plataforma (Google, Meta, LinkedIn, TikTok) genera mejores resultados?</strong></li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              Esta transparencia y enfoque en datos reales es lo que nos diferencia como <strong>agencia de publicidad online en Chile</strong>.
            </p>
          </section>

          {/* Diferencia clave */}
          <section className="mb-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Publicidad Digital vs Marketing Digital: ¿Cuál es la Diferencia?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Esta es una de las confusiones más comunes. Aclaremos la diferencia:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">
                  Publicidad Digital
                </h3>
                <p className="text-gray-700 mb-4 font-semibold">
                  Campañas PAGAS en plataformas digitales:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Google Ads (Search, Shopping, Display)</li>
                  <li>✓ Meta Ads (Facebook e Instagram)</li>
                  <li>✓ LinkedIn Ads (B2B)</li>
                  <li>✓ TikTok Ads</li>
                  <li>✓ Twitter/X Ads</li>
                  <li>✓ YouTube Ads</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4 italic">
                  Resultados inmediatos, inversión directa en medios
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  Marketing Digital
                </h3>
                <p className="text-gray-700 mb-4 font-semibold">
                  Ecosistema completo de estrategias digitales:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Publicidad Digital (campañas pagas)</li>
                  <li>✓ SEO (posicionamiento orgánico)</li>
                  <li>✓ Marketing de Contenidos</li>
                  <li>✓ Email Marketing</li>
                  <li>✓ Redes Sociales (orgánicas)</li>
                  <li>✓ Analítica Web</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4 italic">
                  Estrategia integral, resultados a mediano/largo plazo
                </p>
              </div>
            </div>

            <div className="bg-purple-100 border-l-4 border-purple-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                En resumen:
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>La publicidad digital ES PARTE del marketing digital.</strong> Si necesitas resultados inmediatos, tráfico
                ahora mismo y conversiones desde la primera semana, necesitas <strong>publicidad digital</strong> (campañas pagas).
                Si buscas construir presencia a largo plazo, necesitas <strong>marketing digital completo</strong> (SEO + contenido + publicidad).
              </p>
            </div>
          </section>

          {/* Plataformas */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Plataformas de Publicidad Digital Que Gestionamos
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Como <strong>agencia de publicidad digital en Chile</strong>, dominamos las principales plataformas de pauta paga:
            </p>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🔍</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Google Ads - Publicidad en el Buscador #1 del Mundo
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      <strong>Google Ads</strong> es la plataforma de publicidad digital más poderosa del mundo. Permite mostrar
                      anuncios a personas que están <strong>buscando activamente</strong> tus productos o servicios en Google.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tipos de campañas que gestionamos:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• <strong>Search (Búsqueda):</strong> Anuncios de texto en resultados de Google</li>
                          <li>• <strong>Shopping:</strong> Productos con foto, precio y tienda (ecommerce)</li>
                          <li>• <strong>Display:</strong> Banners visuales en sitios web asociados</li>
                          <li>• <strong>Performance Max:</strong> Campañas automatizadas multi-canal</li>
                          <li>• <strong>YouTube Ads:</strong> Videos publicitarios en YouTube</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Ideal para:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>✓ Captar demanda existente (gente que ya busca tu servicio)</li>
                          <li>✓ Ecommerce (Shopping Ads)</li>
                          <li>✓ Servicios profesionales (abogados, médicos, contadores)</li>
                          <li>✓ B2B (empresas que venden a empresas)</li>
                          <li>✓ Leads de alta intención de compra</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      En M&P somos <strong>Google Partner</strong> certificados en Google Ads. Gestionamos campañas desde $500k/mes hasta $50M+/mes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📱</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Meta Ads - Publicidad en Facebook e Instagram
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      <strong>Meta Ads</strong> (anteriormente Facebook Ads) te permite mostrar anuncios en <strong>Facebook e Instagram</strong>
                      con el targeting más preciso del mercado: edad, género, ubicación, intereses, comportamientos y más.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Formatos que utilizamos:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• <strong>Feed Ads:</strong> Anuncios en el feed de noticias</li>
                          <li>• <strong>Stories Ads:</strong> Anuncios full-screen en historias</li>
                          <li>• <strong>Reels Ads:</strong> Videos cortos (formato TikTok)</li>
                          <li>• <strong>Carousel:</strong> Múltiples imágenes/productos</li>
                          <li>• <strong>Video Ads:</strong> Anuncios en video optimizados</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Ideal para:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>✓ Generar demanda (crear interés en tu producto)</li>
                          <li>✓ Ecommerce visual (ropa, decoración, productos)</li>
                          <li>✓ Remarketing (impactar a quien visitó tu sitio)</li>
                          <li>✓ B2C (marcas que venden al consumidor final)</li>
                          <li>✓ Branding y awareness</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      Especialistas en <strong>Meta Ads Chile</strong> con campañas optimizadas para el mercado chileno. Creamos audiencias
                      custom, lookalikes y remarketing de alto rendimiento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💼</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      LinkedIn Ads - Publicidad B2B Profesional
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      <strong>LinkedIn Ads</strong> es LA plataforma para <strong>publicidad B2B</strong> (business to business).
                      Permite segmentar por cargo, industria, tamaño de empresa, antigüedad laboral y más.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Formatos disponibles:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• <strong>Sponsored Content:</strong> Posts patrocinados en el feed</li>
                          <li>• <strong>Message Ads:</strong> Mensajes directos (InMail)</li>
                          <li>• <strong>Dynamic Ads:</strong> Anuncios personalizados</li>
                          <li>• <strong>Text Ads:</strong> Anuncios de texto en sidebar</li>
                          <li>• <strong>Lead Gen Forms:</strong> Formularios nativos</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Ideal para:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>✓ Empresas B2B (software, servicios corporativos)</li>
                          <li>✓ Leads de alta calidad (gerentes, directores, CEOs)</li>
                          <li>✓ Generación de oportunidades comerciales</li>
                          <li>✓ Webinars y eventos profesionales</li>
                          <li>✓ Posicionamiento de marca B2B</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      <strong>LinkedIn Ads Chile:</strong> Gestionamos campañas B2B con targeting ultra-específico. Ideal si vendes
                      a empresas y necesitas llegar a tomadores de decisión.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎵</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      TikTok Ads - Publicidad para Audiencias Jóvenes
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      <strong>TikTok Ads</strong> es la plataforma de publicidad digital de más rápido crecimiento. Perfecta para
                      llegar a audiencias <strong>Gen Z y Millennials</strong> (18-35 años) con contenido visual y entretenido.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Formatos de TikTok Ads:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>• <strong>In-Feed Ads:</strong> Videos en el feed "For You"</li>
                          <li>• <strong>TopView:</strong> Primer video al abrir la app</li>
                          <li>• <strong>Spark Ads:</strong> Boostear contenido orgánico</li>
                          <li>• <strong>Collection Ads:</strong> Catálogos de productos</li>
                          <li>• <strong>Branded Hashtags:</strong> Challenges patrocinados</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Ideal para:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li>✓ Marcas dirigidas a audiencias jóvenes (18-35 años)</li>
                          <li>✓ Ecommerce de moda, belleza, tech</li>
                          <li>✓ Lanzamientos de productos virales</li>
                          <li>✓ Awareness y branding creativo</li>
                          <li>✓ Contenido entretenido y auténtico</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      <strong>TikTok Ads Chile:</strong> Creamos campañas nativas que no parecen publicidad. Producimos contenido
                      vertical optimizado para TikTok que genera engagement y conversiones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Servicios */}
          <section className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Qué Incluye Nuestro Servicio de Publicidad Digital?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Como <strong>agencia de publicidad online en Chile</strong>, ofrecemos un servicio completo end-to-end:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Estrategia de Pauta Digital
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Análisis de mercado y competencia</li>
                  <li>• Definición de objetivos y KPIs</li>
                  <li>• Selección de plataformas (Google, Meta, LinkedIn, TikTok)</li>
                  <li>• Distribución de presupuesto por canal</li>
                  <li>• Plan de medios mensual</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Implementación de Campañas
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Configuración de cuentas publicitarias</li>
                  <li>• Creación de campañas en Google/Meta/LinkedIn/TikTok</li>
                  <li>• Segmentación de audiencias</li>
                  <li>• Configuración de conversiones y tracking</li>
                  <li>• Instalación de píxeles y etiquetas</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Creación de Contenido Publicitario
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Diseño de anuncios (imágenes, videos, banners)</li>
                  <li>• Redacción de copies persuasivos</li>
                  <li>• Producción de creatividades A/B testing</li>
                  <li>• Adaptación de formatos por plataforma</li>
                  <li>• Diseño de landing pages (opcional)</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Optimización Continua
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Monitoreo diario de rendimiento</li>
                  <li>• Ajuste de pujas y presupuestos</li>
                  <li>• Pausar/activar anuncios de bajo rendimiento</li>
                  <li>• Testing de audiencias y creatividades</li>
                  <li>• Optimización de CAC y ROAS</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Analítica y Reportería
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dashboards en tiempo real</li>
                  <li>• Reportes semanales automatizados</li>
                  <li>• Informes mensuales ejecutivos</li>
                  <li>• Análisis de CAC, CPL, ROAS, ROI</li>
                  <li>• Reuniones estratégicas mensuales</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  Equipo Dedicado
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Estratega Digital senior</li>
                  <li>• Especialista en Google Ads/Meta Ads</li>
                  <li>• Diseñador de contenido publicitario</li>
                  <li>• Soporte en horario chileno</li>
                  <li>• Acceso full a todas las cuentas</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-purple-100 border-l-4 border-purple-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                Transparencia Total:
              </p>
              <p className="text-gray-700 leading-relaxed">
                A diferencia de otras agencias de publicidad digital, te damos <strong>acceso completo</strong> a tus cuentas
                de Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads desde el día 1. Las cuentas son tuyas, la data es tuya,
                nosotros solo las administramos profesionalmente.
              </p>
            </div>
          </section>

          {/* Por qué elegirnos */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Elegir a M&P Como Tu Agencia de Publicidad Digital en Chile?
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">✅</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    1. Especialistas en Performance, No en Vanity Metrics
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    No te vendemos "impresiones" ni "alcance". Te decimos exactamente <strong>cuánto te cuesta conseguir un
                    cliente nuevo</strong> (CAC) y optimizamos tus campañas de Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads
                    para ese resultado. Trabajamos con <strong>datos reales y resultados medibles</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    2. Multi-Plataforma: Gestionamos Todas las Principales Redes
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Muchas agencias solo manejan Google Ads o solo Meta Ads. Nosotros gestionamos <strong>Google Ads, Meta Ads,
                    LinkedIn Ads y TikTok Ads</strong> de forma integrada. Medimos qué plataforma te da mejor ROAS y distribuimos
                    presupuesto de forma inteligente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">👥</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    3. Equipo Dedicado de 3 Profesionales (No Eres Un Número Más)
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    En otras agencias de publicidad digital, tu cuenta es manejada por una sola persona que atiende 20+ clientes.
                    En M&P, tienes un <strong>equipo de 3 personas asignadas exclusivamente</strong>: Estratega Digital, Especialista
                    en Pauta (Google/Meta/LinkedIn/TikTok) y Diseñador de Contenido.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🔓</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    4. Acceso Full a Tus Cuentas Publicitarias (Sin Secuestro de Data)
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Muchas agencias mantienen tus cuentas de Google Ads, Meta Ads y LinkedIn Ads bajo su control. Nosotros te damos
                    <strong> acceso completo desde el día 1</strong>. Las cuentas son tuyas, la data histórica es tuya, los píxeles
                    son tuyos. Si algún día decides irte, te llevas todo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    5. Reportería Semanal y Transparencia Total
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Recibes <strong>reportes completos cada semana</strong> con métricas de todas las plataformas: Google Ads,
                    Meta Ads, LinkedIn Ads, TikTok Ads. Tenemos reuniones estratégicas mensuales. Siempre sabes exactamente
                    qué está pasando con cada peso invertido en publicidad digital.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🇨🇱</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    6. Experiencia Comprobada en el Mercado Chileno
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Trabajamos con empresas chilenas desde 2019. Conocemos el comportamiento del consumidor local, horarios
                    comerciales de Chile, regulaciones, competencia específica y particularidades del mercado chileno en
                    <strong> Santiago, Las Condes, Providencia y todo Chile</strong>. Soporte en horario chileno y facturación en CLP.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="mb-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Cuánto Cuesta Contratar una Agencia de Publicidad Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Esta es una de las preguntas más frecuentes al <strong>contratar una agencia de publicidad digital</strong>.
              El costo tiene dos componentes:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">
                  1. Fee de la Agencia
                </h3>
                <p className="text-gray-700 mb-4">
                  Lo que le pagas a la agencia por gestionar tus campañas:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Plan Silver:</strong> $950.000/mes<br />
                    <span className="text-sm text-gray-600">Ideal para presupuestos publicitarios de $500k-$2M/mes</span>
                  </li>
                  <li>
                    <strong>Plan Gold:</strong> $1.350.000/mes<br />
                    <span className="text-sm text-gray-600">Para presupuestos de $2M-$5M/mes (más popular)</span>
                  </li>
                  <li>
                    <strong>Plan Platinum:</strong> $2.200.000/mes<br />
                    <span className="text-sm text-gray-600">Para presupuestos de $5M+/mes (escala agresiva)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-pink-200">
                <h3 className="text-xl font-semibold text-pink-900 mb-4">
                  2. Inversión Publicitaria (Ad Spend)
                </h3>
                <p className="text-gray-700 mb-4">
                  Lo que inviertes en las plataformas (Google, Meta, LinkedIn, TikTok):
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Mínimo recomendado:</strong> $500k/mes<br />
                    <span className="text-sm text-gray-600">Presupuesto mínimo para generar data suficiente</span>
                  </li>
                  <li>
                    <strong>Promedio PYMEs:</strong> $1M-$3M/mes<br />
                    <span className="text-sm text-gray-600">Rango típico para empresas medianas</span>
                  </li>
                  <li>
                    <strong>Empresas grandes:</strong> $5M-$50M+/mes<br />
                    <span className="text-sm text-gray-600">Escalando agresivamente en múltiples plataformas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Ejemplo de Inversión Total:</h4>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Empresa mediana con presupuesto de $3M/mes en publicidad digital:</strong>
                </p>
                <ul className="ml-6 space-y-1">
                  <li>• Fee agencia (Plan Gold): <strong>$1.350.000/mes</strong></li>
                  <li>• Inversión publicitaria: <strong>$3.000.000/mes</strong></li>
                  <li>• <strong>Total inversión mensual: $4.130.000</strong></li>
                </ul>
                <p className="text-sm text-gray-600 mt-3 italic">
                  De esos $3M, distribuimos estratégicamente entre Google Ads, Meta Ads, LinkedIn Ads según rendimiento.
                  El fee de agencia incluye equipo dedicado, diseño de anuncios, optimización diaria y reportería.
                </p>
              </div>
            </div>

            <div className="bg-purple-100 border-l-4 border-purple-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                ¿Vale la pena contratar una agencia de publicidad digital?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Absolutamente.</strong> Si hoy gastas $3M/mes en publicidad digital sin optimización profesional,
                podrías estar perdiendo 40-60% de ese presupuesto en segmentaciones mal hechas, pujas incorrectas o anuncios
                de bajo rendimiento. Una buena agencia <strong>recupera su costo optimizando tu inversión publicitaria</strong>.
              </p>
            </div>
          </section>

          {/* Proceso */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Cómo Funciona el Proceso de Publicidad Digital con M&P?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-purple-900 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Reunión de Diagnóstico Gratuita (30 min)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Agendas una llamada sin costo. Analizamos tu situación actual: ¿Estás invirtiendo en publicidad digital?
                    ¿Qué plataformas? ¿Qué resultados obtienes? ¿Cuál es tu CAC actual? Te damos un diagnóstico inicial honesto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-purple-900 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Propuesta Estratégica Personalizada
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Si hay fit, creamos una propuesta detallada: ¿Qué plataformas recomendamos (Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads)?
                    ¿Cómo distribuir presupuesto? ¿Qué KPIs mediremos? ¿Qué plan de M&P se ajusta a tu presupuesto?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-purple-900 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Onboarding y Setup (Semana 1-2)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Configuramos todas las cuentas publicitarias (Google Ads, Meta Business Manager, LinkedIn Campaign Manager, TikTok Ads Manager).
                    Instalamos píxeles, configuramos conversiones, creamos primeras campañas. Te damos acceso full a todo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-purple-900 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Lanzamiento y Testing (Semana 3-6)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Lanzamos campañas en las plataformas seleccionadas. Testeamos diferentes audiencias, creatividades y mensajes.
                    Primeros resultados visibles desde la semana 1. Comenzamos a recopilar data para optimización.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-purple-900 flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Optimización y Escala (Mes 2+)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Con data suficiente, optimizamos agresivamente: pausamos lo que no funciona, escalamos lo que sí. Reducimos CAC,
                    mejoramos ROAS. Reuniones mensuales para ajustar estrategia. Reportería semanal automatizada.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes Sobre Publicidad Digital en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Qué es una agencia de publicidad digital en Chile?',
                  a: 'Una agencia de publicidad digital en Chile es una empresa especializada en crear, gestionar y optimizar campañas publicitarias pagas en plataformas como Google Ads, Meta Ads (Facebook/Instagram), LinkedIn Ads y TikTok Ads. En Muller y Pérez nos enfocamos en publicidad digital de performance, optimizando cada peso invertido para generar resultados medibles.'
                },
                {
                  q: '¿Cuál es la diferencia entre publicidad digital y marketing digital?',
                  a: 'La publicidad digital es un componente del marketing digital. Marketing digital abarca SEO, contenido, redes sociales, email marketing, analítica, etc. Publicidad digital se enfoca específicamente en campañas pagas (Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads). En M&P somos expertos en publicidad paga de alto rendimiento.'
                },
                {
                  q: '¿Cuánto cuesta contratar una agencia de publicidad digital en Chile?',
                  a: 'El costo de una agencia de publicidad digital en Chile varía entre $950.000 y $1.500.000+ mensuales dependiendo del servicio. En M&P ofrecemos planes transparentes desde $950k/mes que incluyen gestión de Google Ads, Meta Ads, LinkedIn Ads, equipo dedicado de 3 profesionales, acceso full a cuentas y reportería semanal.'
                },
                {
                  q: '¿Qué plataformas de publicidad digital manejan en M&P?',
                  a: 'En Muller y Pérez manejamos las principales plataformas de publicidad digital: Google Ads (Search, Shopping, Display, Performance Max), Meta Ads (Facebook e Instagram), LinkedIn Ads (ideal para B2B) y TikTok Ads (para audiencias jóvenes). Todas optimizadas para conversiones reales, no solo clicks.'
                },
                {
                  q: '¿Cuánto presupuesto necesito para publicidad digital en Chile?',
                  a: 'Recomendamos mínimo $500.000/mes en inversión publicitaria (más el fee de agencia) para obtener data suficiente y optimizar. Con presupuestos menores es difícil generar volumen de datos necesario para tomar decisiones informadas. En M&P trabajamos con presupuestos desde $500k/mes hasta $50M+/mes.'
                },
                {
                  q: '¿Cuánto tiempo tarda en verse resultados con publicidad digital?',
                  a: 'Con publicidad digital, los primeros resultados se ven desde el día 1 (primeros clicks y conversiones). Sin embargo, la optimización real y CAC (costo de adquisición) eficiente se logra entre 4-8 semanas cuando tenemos suficiente data. A diferencia del SEO, la publicidad digital genera tráfico inmediato.'
                },
                {
                  q: '¿Qué es mejor: Google Ads, Meta Ads, LinkedIn Ads o TikTok Ads?',
                  a: 'No hay una plataforma "mejor", depende de tu negocio. Google Ads es ideal para captar demanda existente (gente que busca tu producto). Meta Ads es mejor para generar demanda (crear interés). LinkedIn Ads funciona excelente para B2B. TikTok Ads es perfecto para audiencias jóvenes. En M&P medimos qué plataforma te da mejor ROAS.'
                },
                {
                  q: '¿Puedo tener acceso a mis cuentas de Google Ads, Meta Ads y LinkedIn Ads?',
                  a: 'Sí, absolutamente. En M&P te damos acceso completo a todas tus cuentas publicitarias desde el día 1. A diferencia de otras agencias que mantienen tus cuentas bajo su control, nosotros creemos en transparencia total. Las cuentas son tuyas, la data es tuya, nosotros solo las administramos.'
                },
                {
                  q: '¿Necesito tener un sitio web para hacer publicidad digital?',
                  a: 'Depende de la plataforma. Para Google Ads Search sí necesitas un sitio web. Para Meta Ads puedes enviar tráfico a WhatsApp, Instagram o un sitio web. Para LinkedIn Ads puedes usar Lead Gen Forms sin landing page. TikTok Ads también permite enviar a WhatsApp. Te ayudamos a encontrar la mejor solución según tu situación.'
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

          {/* CTA Final */}
          <section className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Escalar Tu Negocio con Publicidad Digital de Alto Rendimiento?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Agenda una reunión gratuita de 30 minutos. Te mostramos cómo funcionan las campañas de Google Ads,
              Meta Ads, LinkedIn Ads y TikTok Ads con datos reales y te damos un análisis inicial de tu situación actual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Cotizar Publicidad Digital
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-white text-purple-900 rounded-lg hover:bg-purple-50 transition font-semibold text-lg"
              >
                Volver al Inicio
              </Link>
            </div>
          </section>
        </article>

        {/* Footer simple */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400 mb-4">
              © 2025 Muller y Pérez - Agencia de Publicidad Digital Chile | Todos los derechos reservados
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <Link href="/#pricing" className="hover:text-white transition">Planes</Link>
              <Link href="/#contact" className="hover:text-white transition">Contacto</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
