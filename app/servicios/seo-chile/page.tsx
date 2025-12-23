/**
 * Página Servicio: SEO Chile
 * SEO optimizada para rankear "agencia seo chile"
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
  title: 'Agencia SEO Chile | Posicionamiento Web y SEO Técnico en Santiago',
  description: 'Agencia SEO en Chile especializada en posicionamiento orgánico y SEO técnico. Combinamos SEO con Paid Media para resultados más rápidos. Desde $890.000/mes.',
  keywords: [
    'agencia seo chile',
    'posicionamiento web chile',
    'seo santiago',
    'posicionamiento google chile',
    'seo chile',
    'agencia seo santiago',
    'especialistas seo chile',
    'consultoria seo chile',
    'expertos seo chile',
    'seo tecnico chile'
  ],
  path: '/servicios/seo-chile'
})

export default function SEOChilePage() {
  // Schema markup
  const serviceSchema = createServiceSchema({
    name: 'Servicios SEO Chile',
    description: 'Servicio profesional de posicionamiento web SEO en Chile con estrategia integral: SEO técnico, on-page, off-page y local SEO',
    serviceType: 'SEO y Posicionamiento Web',
    price: '890000',
    priceCurrency: 'CLP'
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Servicios', url: 'https://www.mulleryperez.cl' },
    { name: 'SEO Chile', url: 'https://www.mulleryperez.cl/servicios/seo-chile' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Cuánto cuesta una agencia de SEO en Chile?',
      answer: 'El costo de una agencia SEO en Chile varía entre $500.000 y $2.000.000+ mensuales dependiendo de la competitividad del sector. En Muller y Pérez ofrecemos servicios de SEO desde $890.000/mes con estrategia completa: auditoría técnica, optimización on-page, link building y reportería mensual.'
    },
    {
      question: '¿Cuánto tiempo tarda en dar resultados el SEO?',
      answer: 'El SEO es una estrategia de mediano-largo plazo. Los primeros resultados visibles suelen aparecer entre 3-6 meses dependiendo de la competencia y el estado inicial del sitio. Sin embargo, en M&P combinamos SEO con campañas de Google Ads para generar tráfico inmediato mientras trabajamos en el posicionamiento orgánico.'
    },
    {
      question: '¿Qué incluye un servicio de SEO completo?',
      answer: 'Un servicio SEO completo incluye: auditoría técnica SEO, investigación de keywords, optimización on-page (contenidos, metadatos, estructura), SEO técnico (velocidad, mobile, indexación), link building (SEO off-page), optimización de conversiones y reportería mensual con KPIs claros.'
    },
    {
      question: '¿Por qué combinar SEO con Google Ads?',
      answer: 'Combinar SEO con Google Ads te permite obtener resultados inmediatos mientras construyes autoridad orgánica. Google Ads genera tráfico desde día 1, mientras el SEO construye sostenibilidad a largo plazo. Además, los datos de campañas pagas ayudan a identificar mejores keywords para SEO.'
    },
    {
      question: '¿Qué es el SEO local y por qué es importante en Chile?',
      answer: 'El SEO local optimiza tu presencia para búsquedas geográficas como "restaurante providencia" o "abogado santiago". Es crucial en Chile donde muchas búsquedas incluyen la ubicación. Incluye optimización de Google Business Profile, citaciones locales y contenido geo-optimizado.'
    },
    {
      question: '¿Qué diferencia al SEO técnico del SEO tradicional?',
      answer: 'El SEO técnico se enfoca en la infraestructura del sitio: velocidad de carga, arquitectura web, renderizado JavaScript, datos estructurados, mobile-first, Core Web Vitals y crawlability. Es la base para que el contenido (SEO on-page) pueda rankear correctamente.'
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
        <section className="bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-emerald-200 hover:text-white transition">Inicio</Link>
              <span className="mx-2 text-emerald-300">/</span>
              <span className="text-white font-semibold">SEO Chile</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full mb-6">
                  <span className="text-blue-300 font-semibold">SEO + Paid Media = Resultados Más Rápidos</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Agencia SEO Chile:<br />
                  <span className="text-emerald-300">Posicionamiento Orgánico que Convierte</span>
                </h1>
                <p className="text-xl text-emerald-100 mb-8">
                  Somos una <strong>agencia SEO en Chile</strong> especializada en posicionamiento web sostenible.
                  Combinamos SEO técnico, contenido optimizado y link building con estrategias de Paid Media para
                  resultados inmediatos y a largo plazo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/#contact"
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-center"
                  >
                    Solicitar Auditoría SEO Gratis
                  </Link>
                  <Link
                    href="/#pricing"
                    className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg hover:bg-white/20 transition font-semibold text-center"
                  >
                    Ver Planes SEO
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">¿Por Qué Invertir en SEO?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Tráfico sostenible y escalable</strong>
                      <span className="text-emerald-200">Resultados que crecen mes a mes sin aumentar inversión</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Mayor ROI a largo plazo</strong>
                      <span className="text-emerald-200">Costo por lead disminuye con el tiempo</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Autoridad y confianza</strong>
                      <span className="text-emerald-200">Los usuarios confían más en resultados orgánicos</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Ventaja competitiva duradera</strong>
                      <span className="text-emerald-200">Una vez posicionado, es difícil que te desplacen</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-5xl py-16">
          {/* Introducción al SEO */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Qué es SEO y Por Qué Tu Empresa en Chile lo Necesita?
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>SEO (Search Engine Optimization)</strong> o Posicionamiento Web es el conjunto de técnicas
                y estrategias que permiten que tu sitio web aparezca en los primeros resultados de Google cuando
                usuarios buscan productos o servicios relacionados con tu negocio.
              </p>

              <p>
                En Chile, el <strong>posicionamiento en Google</strong> se ha vuelto crítico para cualquier negocio
                que quiera crecer digitalmente. Más del 93% de las experiencias online comienzan en un buscador,
                y el 75% de los usuarios nunca pasa de la primera página de resultados.
              </p>

              <p>
                Sin embargo, el SEO no es una estrategia de resultados inmediatos. Por eso en <strong>Muller y Pérez</strong>
                combinamos el posicionamiento orgánico con campañas de <strong>Google Ads y Meta Ads</strong> para
                generar tráfico calificado desde día 1, mientras construimos tu autoridad SEO para el mediano y largo plazo.
              </p>
            </div>
          </section>

          {/* Pilares del SEO */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Los 4 Pilares de Nuestro Servicio de SEO en Chile
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. SEO Técnico
                </h3>
                <p className="text-gray-700 mb-4">
                  Optimizamos la infraestructura de tu sitio web para que Google pueda rastrearlo,
                  indexarlo y entenderlo correctamente:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Velocidad de carga y Core Web Vitals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Optimización mobile-first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Arquitectura web y crawl budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Datos estructurados (Schema Markup)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Seguridad HTTPS y certificados SSL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Sitemap XML y robots.txt optimizados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. SEO On-Page
                </h3>
                <p className="text-gray-700 mb-4">
                  Optimizamos cada página de tu sitio para que rankee por las keywords correctas
                  y genere conversiones:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Investigación y estrategia de keywords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Optimización de títulos y meta descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Estructura de headings (H1, H2, H3)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Contenido optimizado y search intent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Optimización de imágenes (alt tags, tamaño)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Internal linking estratégico</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. SEO Off-Page (Link Building)
                </h3>
                <p className="text-gray-700 mb-4">
                  Construimos autoridad de dominio a través de enlaces de calidad desde sitios
                  relevantes y confiables:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Link building en medios chilenos relevantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Guest posting en blogs de autoridad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Menciones de marca (Brand mentions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Estrategia de relaciones públicas digitales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Recuperación de enlaces rotos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Análisis de perfil de backlinks</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. SEO Local (Local SEO)
                </h3>
                <p className="text-gray-700 mb-4">
                  Optimizamos tu presencia para búsquedas locales en Santiago, Valparaíso,
                  Concepción y otras ciudades de Chile:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Optimización de Google Business Profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Gestión de reseñas y reputación online</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Citaciones locales (NAP consistency)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Contenido geo-optimizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Local Schema Markup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Optimización para "near me" searches</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Proceso */}
          <section className="mb-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nuestro Proceso de Posicionamiento SEO en Chile
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Auditoría SEO Completa
                  </h3>
                  <p className="text-gray-700">
                    Analizamos en profundidad tu sitio web actual: SEO técnico, contenido, perfil de enlaces,
                    competencia y oportunidades. Identificamos quick wins y estrategia de largo plazo.
                    Te entregamos un documento completo con hallazgos y recomendaciones priorizadas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Investigación de Keywords y Estrategia
                  </h3>
                  <p className="text-gray-700">
                    Identificamos las keywords con mejor potencial para tu negocio: volumen de búsqueda,
                    dificultad, intención comercial y relevancia. Priorizamos términos de alto impacto
                    y construimos un plan de contenidos optimizado. También analizamos qué están haciendo
                    tus competidores que rankean en top 3.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Implementación Técnica y On-Page
                  </h3>
                  <p className="text-gray-700">
                    Optimizamos la base técnica del sitio y el contenido existente. Implementamos Schema Markup,
                    mejoramos velocidad de carga, corregimos errores de crawlability, optimizamos metadatos y
                    estructuramos el contenido. Si trabajas con equipo de desarrollo, coordinamos la implementación
                    técnica y hacemos QA.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Creación de Contenido Optimizado
                  </h3>
                  <p className="text-gray-700">
                    Desarrollamos contenido nuevo optimizado para las keywords objetivo: páginas de servicios,
                    landing pages, blog posts educativos y páginas locales. Todo el contenido está orientado
                    tanto a SEO como a conversión, respondiendo exactamente lo que los usuarios buscan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Link Building y Autoridad
                  </h3>
                  <p className="text-gray-700">
                    Ejecutamos estrategia de link building: identificamos oportunidades de enlaces en medios
                    chilenos, blogs de industria y directorios relevantes. Construimos autoridad de dominio
                    de forma natural y sostenible, evitando prácticas penalizables por Google.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  6
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Monitoreo, Ajuste y Escalamiento
                  </h3>
                  <p className="text-gray-700">
                    Monitoreamos rankings, tráfico orgánico, conversiones y KPIs mensuales. Ajustamos estrategia
                    basados en data real. Identificamos nuevas oportunidades de keywords y contenido.
                    Te entregamos reportería clara con insights accionables. A medida que crecen los resultados,
                    escalamos hacia nuevas keywords y páginas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SEO + Paid Media */}
          <section className="mb-16 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold mb-6">
                La Ventaja de Muller y Pérez: SEO + Paid Media
              </h2>
              <div className="text-lg text-blue-100 leading-relaxed space-y-4">
                <p>
                  A diferencia de agencias que solo hacen SEO, en <strong>M&P combinamos posicionamiento
                  orgánico con campañas de Google Ads y Meta Ads</strong> para darte lo mejor de ambos mundos:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                    <h3 className="font-bold text-xl mb-3">Paid Media (Google Ads)</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• Resultados inmediatos desde día 1</li>
                      <li>• Tráfico calificado mientras el SEO madura</li>
                      <li>• Data de conversiones que informa al SEO</li>
                      <li>• Testeo rápido de keywords y mensajes</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                    <h3 className="font-bold text-xl mb-3">SEO Orgánico</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• ROI creciente mes a mes</li>
                      <li>• Tráfico sostenible sin pagar por click</li>
                      <li>• Mayor confianza y autoridad de marca</li>
                      <li>• Ventaja competitiva duradera</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-6 text-xl">
                  <strong>El resultado:</strong> Crecimiento acelerado en el corto plazo mientras construyes
                  un activo digital que genera leads de forma sostenible y escalable.
                </p>
              </div>
            </div>
          </section>

          {/* Diferenciadores */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ¿Por Qué Elegirnos como Tu Agencia SEO en Chile?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Enfoque en Performance
                </h3>
                <p className="text-gray-700">
                  No nos enfocamos solo en rankings. Medimos tráfico orgánico, conversiones y ROI.
                  El SEO debe generar clientes, no solo visitas.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Estrategia Integral
                </h3>
                <p className="text-gray-700">
                  Combinamos SEO con Google Ads, Meta Ads y CRO. Visión 360 del embudo de conversión
                  para maximizar resultados.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Transparencia Total
                </h3>
                <p className="text-gray-700">
                  Acceso full a Google Search Console y Analytics. Reportes mensuales claros con
                  KPIs reales y explicaciones en español simple.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Experiencia Técnica
                </h3>
                <p className="text-gray-700">
                  Equipo con experiencia en SEO técnico avanzado: JavaScript SEO, migraciones web,
                  e-commerce SEO y sitios internacionales.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🇨🇱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Conocimiento Local
                </h3>
                <p className="text-gray-700">
                  Entendemos el mercado chileno, sus particularidades de búsqueda y la competencia local.
                  SEO adaptado a Chile, no recetas internacionales.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Resultados Probados
                </h3>
                <p className="text-gray-700">
                  Hemos posicionado decenas de sitios en top 3 para keywords competitivas en Chile.
                  Experiencia real en múltiples industrias.
                </p>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="mb-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Planes de SEO en Chile
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-emerald-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan SEO Starter</h3>
                    <p className="text-gray-600">Ideal para empresas que recién comienzan con SEO</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-emerald-600">$890.000</div>
                    <div className="text-gray-600">/ mes + IVA</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <span className="text-gray-700">Auditoría SEO inicial completa</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <span className="text-gray-700">Investigación de keywords</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <span className="text-gray-700">Optimización on-page (hasta 10 páginas)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <span className="text-gray-700">SEO técnico básico</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <span className="text-gray-700">2 artículos de blog optimizados/mes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <span className="text-gray-700">Reportería mensual</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-300">
                <div className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full mb-4">
                  MÁS POPULAR
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan SEO Growth</h3>
                    <p className="text-gray-600">Para empresas que quieren crecer agresivamente</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">$1.490.000</div>
                    <div className="text-gray-600">/ mes + IVA</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">Todo lo del Plan Starter +</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">Optimización on-page ilimitada</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">SEO técnico avanzado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">4 artículos de blog optimizados/mes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">Link building (5 enlaces/mes)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">SEO Local + Google Business</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">Análisis de competencia mensual</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span className="text-gray-700">Reunión estratégica mensual</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan SEO Enterprise</h3>
                    <p className="text-gray-600">Para e-commerce y sitios corporativos grandes</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">Personalizado</div>
                    <div className="text-gray-600">Según necesidades</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-gray-700">Todo lo del Plan Growth +</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-gray-700">SEO para e-commerce (miles de URLs)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-gray-700">Contenido ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-gray-700">Link building intensivo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-gray-700">SEO internacional (múltiples países)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    <span className="text-gray-700">Account Manager dedicado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-lg"
              >
                Solicitar Propuesta Personalizada
              </Link>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre SEO en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto cuesta una agencia de SEO en Chile?',
                  a: 'El costo de una agencia SEO en Chile varía entre $500.000 y $2.000.000+ mensuales dependiendo de la competitividad del sector. En Muller y Pérez ofrecemos servicios de SEO desde $890.000/mes con estrategia completa: auditoría técnica, optimización on-page, link building y reportería mensual.'
                },
                {
                  q: '¿Cuánto tiempo tarda en dar resultados el SEO?',
                  a: 'El SEO es una estrategia de mediano-largo plazo. Los primeros resultados visibles suelen aparecer entre 3-6 meses dependiendo de la competencia y el estado inicial del sitio. Sin embargo, en M&P combinamos SEO con campañas de Google Ads para generar tráfico inmediato mientras trabajamos en el posicionamiento orgánico.'
                },
                {
                  q: '¿Qué incluye un servicio de SEO completo?',
                  a: 'Un servicio SEO completo incluye: auditoría técnica SEO, investigación de keywords, optimización on-page (contenidos, metadatos, estructura), SEO técnico (velocidad, mobile, indexación), link building (SEO off-page), optimización de conversiones y reportería mensual con KPIs claros.'
                },
                {
                  q: '¿Por qué combinar SEO con Google Ads?',
                  a: 'Combinar SEO con Google Ads te permite obtener resultados inmediatos mientras construyes autoridad orgánica. Google Ads genera tráfico desde día 1, mientras el SEO construye sostenibilidad a largo plazo. Además, los datos de campañas pagas ayudan a identificar mejores keywords para SEO.'
                },
                {
                  q: '¿Qué es el SEO local y por qué es importante en Chile?',
                  a: 'El SEO local optimiza tu presencia para búsquedas geográficas como "restaurante providencia" o "abogado santiago". Es crucial en Chile donde muchas búsquedas incluyen la ubicación. Incluye optimización de Google Business Profile, citaciones locales y contenido geo-optimizado.'
                },
                {
                  q: '¿Qué diferencia al SEO técnico del SEO tradicional?',
                  a: 'El SEO técnico se enfoca en la infraestructura del sitio: velocidad de carga, arquitectura web, renderizado JavaScript, datos estructurados, mobile-first, Core Web Vitals y crawlability. Es la base para que el contenido (SEO on-page) pueda rankear correctamente.'
                },
                {
                  q: '¿Necesito rediseñar mi sitio web para hacer SEO?',
                  a: 'No necesariamente. Muchas optimizaciones SEO se pueden hacer sin rediseñar el sitio completo. Sin embargo, si tu sitio tiene problemas técnicos graves o una UX muy deficiente, un rediseño podría ser necesario. En la auditoría inicial identificamos si es necesario o no.'
                },
                {
                  q: '¿Puedo hacer SEO yo mismo o necesito una agencia?',
                  a: 'El SEO básico puedes hacerlo tú mismo con tiempo y estudio. Sin embargo, el SEO competitivo requiere expertise técnico, herramientas profesionales (caras), experiencia en link building y dedicación constante. Una agencia te da acceso a equipo especializado y resultados más rápidos.'
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
          <section className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Posicionar Tu Sitio en Google?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Solicita una auditoría SEO gratuita. Analizamos tu sitio, identificamos oportunidades
              y te mostramos un plan concreto para mejorar tu posicionamiento orgánico en Chile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-lg"
              >
                Solicitar Auditoría SEO Gratis
              </Link>
              <Link
                href="/agencia-marketing-digital-chile"
                className="px-8 py-4 bg-white text-emerald-900 rounded-lg hover:bg-emerald-50 transition font-semibold text-lg"
              >
                Ver Todos los Servicios
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
