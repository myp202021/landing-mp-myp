/**
 * Página Pilar SEO: Agencia Marketing Digital Chile
 * Optimizada para rankear en Google con keywords principales
 * +2000 palabras de contenido SEO-optimizado
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
  title: 'Agencia Marketing Digital Chile | Expertos en Performance y Google Ads',
  description: 'Agencia marketing digital en Chile especializada en performance marketing, Google Ads y Meta Ads. Equipo dedicado, datos reales y resultados medibles. Cotiza hoy.',
  keywords: [
    'agencia marketing digital chile',
    'agencia marketing digital',
    'agencia marketing digital santiago',
    'agencia performance marketing',
    'agencia google ads chile',
    'mejor agencia marketing digital chile',
    'contratar agencia marketing digital',
    'precios agencia marketing digital chile'
  ],
  path: '/agencia-marketing-digital-chile'
})

export default function AgenciaMarketingDigitalChilePage() {
  // Schema markup
  const webPageSchema = createWebPageSchema(
    'Agencia Marketing Digital Chile | Muller y Pérez',
    'Agencia marketing digital en Chile especializada en performance marketing, Google Ads y Meta Ads con equipo dedicado y resultados medibles',
    'https://www.mulleryperez.cl/agencia-marketing-digital-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Marketing Digital Chile', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-chile' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Qué es una agencia de marketing digital en Chile?',
      answer: 'Una agencia de marketing digital en Chile es una empresa especializada en diseñar, ejecutar y optimizar estrategias de marketing online para empresas chilenas. En Muller y Pérez somos una agencia de performance marketing que se diferencia por trabajar con datos reales y resultados medibles, no con métricas de vanidad.'
    },
    {
      question: '¿Cuánto cuesta una agencia de marketing digital en Chile en 2025?',
      answer: 'El costo de una agencia de marketing digital en Chile varía entre $950.000 y $1.500.000+ mensuales dependiendo del nivel de servicio. En M&P ofrecemos planes transparentes: Silver ($950k), Gold ($1.200.000) y Platinum ($1.5M+), todos con equipo dedicado de 3 profesionales, acceso full a cuentas y reportería semanal.'
    },
    {
      question: '¿Qué diferencia a una agencia de performance marketing de una tradicional?',
      answer: 'Una agencia de performance marketing como M&P cobra y optimiza basándose en resultados medibles: conversiones, ventas, leads calificados. Las agencias tradicionales optimizan para clicks, impresiones o "engagement". Nosotros te decimos exactamente cuánto te cuesta conseguir un cliente nuevo, no solo cuántos clicks obtuviste.'
    },
    {
      question: '¿Por qué elegir una agencia de marketing digital en Chile vs una internacional?',
      answer: 'Una agencia de marketing digital en Chile como Muller y Pérez conoce el mercado local, horarios comerciales, comportamiento del consumidor chileno, regulaciones locales y competencia específica. Además, ofrecemos soporte en horario chileno, reuniones presenciales en Santiago y facturación en CLP.'
    },
    {
      question: '¿Qué servicios incluye una agencia de marketing digital completa?',
      answer: 'Una agencia de marketing digital completa debe incluir: gestión de Google Ads, Meta Ads (Facebook/Instagram), LinkedIn Ads, creación de contenido, análisis de datos, reportería, optimización de conversiones, estrategia digital y atención de equipo dedicado. En M&P todos nuestros planes incluyen estos servicios.'
    },
    {
      question: '¿Cuánto tiempo tarda en verse resultados con una agencia de marketing digital?',
      answer: 'Los primeros resultados con una agencia de marketing digital pueden verse desde la semana 1 (primeros leads). Sin embargo, la optimización real y resultados consistentes se logran entre 2-3 meses cuando ya tenemos suficiente data para optimizar. En M&P trabajamos con transparencia total desde el día 1.'
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
        <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-blue-200 hover:text-white transition">
                Inicio
              </Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white font-semibold">Agencia Marketing Digital Chile</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Agencia Marketing Digital en Chile:<br />
              Performance, Datos Reales, Resultados Medibles
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Somos una <strong>agencia de marketing digital en Chile</strong> especializada en <strong>performance marketing</strong>,
              Google Ads y Meta Ads. A diferencia de otras agencias, trabajamos con datos reales y te decimos exactamente
              cuánto te cuesta conseguir un cliente nuevo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center text-lg"
              >
                Agendar Reunión Gratis
              </Link>
              <Link
                href="/#pricing"
                className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-center text-lg"
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
              ¿Qué es una Agencia de Marketing Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Una <strong>agencia de marketing digital en Chile</strong> es una empresa especializada en diseñar, ejecutar y optimizar
              estrategias de marketing online para empresas chilenas. Sin embargo, no todas las agencias son iguales.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              En <strong>Muller y Pérez</strong>, somos una <strong>agencia de performance marketing</strong>, lo que significa que nos
              diferenciamos de las agencias tradicionales en un punto fundamental: <strong>trabajamos con resultados medibles, no con
              métricas de vanidad</strong>.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Mientras otras agencias te hablan de "impresiones", "alcance" o "engagement", nosotros te decimos exactamente:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2 ml-4">
              <li><strong>¿Cuánto te cuesta conseguir un lead?</strong> (CPL)</li>
              <li><strong>¿Cuánto te cuesta conseguir un cliente nuevo?</strong> (CAC)</li>
              <li><strong>¿Cuánto retorno obtienes por cada peso invertido?</strong> (ROAS)</li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              Esta transparencia y enfoque en datos reales es lo que nos convierte en una de las mejores <strong>agencias de marketing
              digital en Chile</strong>.
            </p>
          </section>

          {/* Servicios */}
          <section className="mb-16 bg-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Servicios de Nuestra Agencia de Marketing Digital
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Como <strong>agencia de marketing digital en Chile</strong>, ofrecemos una suite completa de servicios
              enfocados en performance:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🎯 Google Ads (SEM)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Gestión profesional de campañas de búsqueda, shopping, display y Performance Max. Optimizamos para
                  conversiones reales, no solo clicks. Somos especialistas en <strong>Google Ads Chile</strong> con
                  certificaciones oficiales.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  📱 Meta Ads (Facebook & Instagram)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Campañas de alto rendimiento en Facebook e Instagram Ads. Creamos audiencias personalizadas, contenido
                  atractivo y optimizamos para conversiones. Expertos en <strong>Meta Ads Chile</strong> y remarketing inteligente.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  💼 LinkedIn Ads (B2B)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Campañas especializadas para empresas B2B. Targeting preciso por cargo, industria y empresa. Ideal para
                  generación de leads empresariales de alta calidad en el mercado chileno.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  📊 Analytics & Reportería
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Implementación de Google Analytics 4, Tag Manager, dashboards personalizados y reportería semanal.
                  Medimos todo el funnel de conversión, desde el primer click hasta la venta final.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                ✅ Todos nuestros planes incluyen equipo dedicado de 3 profesionales
              </p>
              <p className="text-gray-700">
                A diferencia de otras agencias donde eres un cliente más, en M&P tienes un equipo asignado exclusivamente
                para tu cuenta: Estratega Digital, Especialista en Pauta y Diseñador de Contenido.
              </p>
            </div>
          </section>

          {/* Por qué elegirnos */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Elegir a Muller y Pérez Como Tu Agencia de Marketing Digital en Chile?
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  1. Transparencia Total: Acceso Full a Tus Cuentas
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Muchas <strong>agencias de marketing digital</strong> mantienen tus cuentas de Google Ads y Facebook bajo
                  su control. Nosotros te damos <strong>acceso completo desde el día 1</strong>. Las cuentas son tuyas,
                  la data es tuya, nosotros solo las administramos.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  2. Performance Marketing, No Métricas de Vanidad
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  No te vendemos "impresiones" ni "alcance". Te decimos exactamente cuánto te cuesta conseguir un cliente
                  nuevo (CAC) y optimizamos para ese resultado. Así funciona el <strong>marketing basado en datos</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  3. Equipo Dedicado de 3 Profesionales
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  En otras agencias, tu cuenta es manejada por una sola persona que atiende 20+ clientes. En M&P, tienes
                  un equipo de 3 personas asignadas exclusivamente: Estratega, Especialista en Pauta y Diseñador.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  4. Reportería Semanal y Reuniones Mensuales
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Recibes reportes completos cada semana y tenemos reuniones estratégicas mensuales. Siempre sabes qué está
                  pasando con tu inversión en <strong>publicidad digital</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  5. Experiencia Comprobada en el Mercado Chileno
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Trabajamos con empresas chilenas desde 2019. Conocemos el comportamiento del consumidor local, horarios
                  comerciales de Chile, regulaciones y competencia específica del mercado chileno en <strong>Santiago,
                  Las Condes, Providencia y todo Chile</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Cuánto Cuesta una Agencia de Marketing Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Esta es una de las preguntas más frecuentes al <strong>contratar una agencia de marketing digital</strong>.
              En el mercado chileno, los precios varían significativamente:
            </p>

            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rangos de Precios en Chile (2025)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💸</span>
                  <div>
                    <strong>Agencias básicas o freelancers:</strong> $300k - $500k/mes<br />
                    <span className="text-sm text-gray-600">Generalmente 1 persona, servicio limitado, sin equipo dedicado</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <strong>Agencias intermedias:</strong> $600k - $1M/mes<br />
                    <span className="text-sm text-gray-600">Servicio más completo pero aún limitado en recursos</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💎</span>
                  <div>
                    <strong>Agencias premium (M&P):</strong> $1.200k - $1.5M+/mes<br />
                    <span className="text-sm text-gray-600">Equipo dedicado, acceso full, performance marketing real</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Nuestros Planes de Marketing Digital:</h4>
              <ul className="space-y-2 text-gray-800">
                <li><strong>Plan Silver:</strong> $950.000/mes - Ideal para PYMEs que empiezan</li>
                <li><strong>Plan Gold:</strong> $1.200.000/mes - Más popular, para empresas en crecimiento</li>
                <li><strong>Plan Platinum:</strong> $1.500.000+/mes - Para empresas que escalan agresivamente</li>
              </ul>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>¿Vale la pena invertir en una agencia de marketing digital?</strong> Absolutamente. Si hoy gastas
              $3M/mes en publicidad sin agencia, podrías estar perdiendo 40-60% de ese presupuesto en optimizaciones mal
              hechas. Una buena agencia recupera su costo optimizando tu inversión publicitaria.
            </p>
          </section>

          {/* Casos de uso */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Para Qué Tipo de Empresas Funciona una Agencia de Marketing Digital?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🏢 Empresas B2B
                </h3>
                <p className="text-gray-700">
                  <strong>Agencia marketing digital B2B</strong> especializada en LinkedIn Ads, Google Search y generación
                  de leads calificados para empresas que venden a otras empresas.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🛍️ E-commerce
                </h3>
                <p className="text-gray-700">
                  <strong>Agencia marketing digital ecommerce</strong> con experiencia en Shopping Ads, catálogos dinámicos
                  y remarketing de alto rendimiento para tiendas online.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🏪 PYMEs y Retail
                </h3>
                <p className="text-gray-700">
                  <strong>Agencia marketing digital para PYMEs</strong> con planes accesibles y resultados medibles, ideal
                  para empresas que buscan crecer en el entorno digital.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes Sobre Agencias de Marketing Digital en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Qué es una agencia de marketing digital en Chile?',
                  a: 'Una agencia de marketing digital en Chile es una empresa especializada en diseñar, ejecutar y optimizar estrategias de marketing online para empresas chilenas. En Muller y Pérez somos una agencia de performance marketing que se diferencia por trabajar con datos reales y resultados medibles, no con métricas de vanidad.'
                },
                {
                  q: '¿Cuánto cuesta una agencia de marketing digital en Chile en 2025?',
                  a: 'El costo de una agencia de marketing digital en Chile varía entre $950.000 y $1.500.000+ mensuales dependiendo del nivel de servicio. En M&P ofrecemos planes transparentes: Silver ($950k), Gold ($1.200.000) y Platinum ($1.5M+), todos con equipo dedicado de 3 profesionales, acceso full a cuentas y reportería semanal.'
                },
                {
                  q: '¿Qué diferencia a una agencia de performance marketing de una tradicional?',
                  a: 'Una agencia de performance marketing como M&P cobra y optimiza basándose en resultados medibles: conversiones, ventas, leads calificados. Las agencias tradicionales optimizan para clicks, impresiones o "engagement". Nosotros te decimos exactamente cuánto te cuesta conseguir un cliente nuevo, no solo cuántos clicks obtuviste.'
                },
                {
                  q: '¿Por qué elegir una agencia de marketing digital en Chile vs una internacional?',
                  a: 'Una agencia de marketing digital en Chile como Muller y Pérez conoce el mercado local, horarios comerciales, comportamiento del consumidor chileno, regulaciones locales y competencia específica. Además, ofrecemos soporte en horario chileno, reuniones presenciales en Santiago y facturación en CLP.'
                },
                {
                  q: '¿Qué servicios incluye una agencia de marketing digital completa?',
                  a: 'Una agencia de marketing digital completa debe incluir: gestión de Google Ads, Meta Ads (Facebook/Instagram), LinkedIn Ads, creación de contenido, análisis de datos, reportería, optimización de conversiones, estrategia digital y atención de equipo dedicado. En M&P todos nuestros planes incluyen estos servicios.'
                },
                {
                  q: '¿Cuánto tiempo tarda en verse resultados con una agencia de marketing digital?',
                  a: 'Los primeros resultados con una agencia de marketing digital pueden verse desde la semana 1 (primeros leads). Sin embargo, la optimización real y resultados consistentes se logran entre 2-3 meses cuando ya tenemos suficiente data para optimizar. En M&P trabajamos con transparencia total desde el día 1.'
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
          <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Trabajar con la Mejor Agencia de Marketing Digital en Chile?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Agenda una reunión gratuita de 30 minutos. Te mostramos cómo funciona el performance marketing
              con datos reales y te damos un análisis inicial de tu situación actual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Agendar Reunión Gratis
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
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
              © 2025 Muller y Pérez - Agencia de Marketing Digital Chile | Todos los derechos reservados
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
