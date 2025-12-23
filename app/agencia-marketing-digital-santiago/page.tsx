/**
 * Página Pilar SEO: Agencia Marketing Digital Santiago
 * Optimizada para rankear en Google con keywords de Santiago
 * +1500 palabras de contenido SEO-optimizado localizado
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
  title: 'Agencia Marketing Digital Santiago | Expertos Google Ads y Performance',
  description: 'Agencia marketing digital en Santiago especializada en performance marketing, Google Ads y Meta Ads. Oficinas en Las Condes. Equipo dedicado, datos reales y resultados medibles.',
  keywords: [
    'agencia marketing digital santiago',
    'marketing digital santiago',
    'agencia publicidad digital santiago',
    'agencia google ads santiago',
    'agencia marketing digital las condes',
    'agencia marketing digital providencia',
    'agencia performance marketing santiago',
    'agencia meta ads santiago',
    'mejor agencia marketing digital santiago',
    'contratar agencia marketing digital santiago',
    'precios agencia marketing digital santiago',
    'agencia publicidad santiago',
    'marketing digital las condes',
    'publicidad digital providencia',
    'agencia google ads las condes',
    'marketing digital santiago centro'
  ],
  path: '/agencia-marketing-digital-santiago'
})

export default function AgenciaMarketingDigitalSantiagoPage() {
  // Schema markup
  const webPageSchema = createWebPageSchema(
    'Agencia Marketing Digital Santiago | Muller y Pérez',
    'Agencia marketing digital en Santiago especializada en performance marketing, Google Ads y Meta Ads. Oficinas en Las Condes con equipo dedicado y resultados medibles',
    'https://www.mulleryperez.cl/agencia-marketing-digital-santiago'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Marketing Digital Santiago', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-santiago' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Dónde está ubicada su agencia de marketing digital en Santiago?',
      answer: 'Muller y Pérez tiene oficinas en Las Condes, Santiago. Estamos ubicados en Av Santa María 9300, Las Condes. Atendemos clientes en toda la Región Metropolitana incluyendo Las Condes, Providencia, Santiago Centro, Vitacura, Lo Barnechea, Ñuñoa y todas las comunas de Santiago.'
    },
    {
      question: '¿Por qué elegir una agencia de marketing digital en Santiago vs una agencia remota?',
      answer: 'Una agencia de marketing digital en Santiago como M&P ofrece ventajas clave: reuniones presenciales en nuestras oficinas de Las Condes, conocimiento profundo del mercado local santiaguino, atención en horario chileno, facturación en CLP y entendimiento del comportamiento del consumidor de Santiago. Conocemos las particularidades de cada comuna y sector comercial de la capital.'
    },
    {
      question: '¿Cuánto cuesta una agencia de marketing digital en Santiago en 2025?',
      answer: 'El costo de una agencia de marketing digital en Santiago varía entre $650.000 y $1.500.000+ mensuales. En M&P ofrecemos planes transparentes: Silver ($650k), Gold ($980k) y Platinum ($1.5M+), todos con equipo dedicado de 3 profesionales, acceso full a cuentas, reportería semanal y reuniones presenciales en nuestra oficina de Las Condes.'
    },
    {
      question: '¿Qué sectores de Santiago atienden como agencia de marketing digital?',
      answer: 'Como agencia de marketing digital en Santiago, atendemos empresas en todas las comunas: Las Condes, Providencia, Vitacura, Lo Barnechea, Santiago Centro, Ñuñoa, La Reina, Peñalolén, Macul, San Joaquín, La Florida, Maipú, Pudahuel y toda la Región Metropolitana. Tenemos experiencia trabajando con empresas de diferentes sectores comerciales en cada zona.'
    },
    {
      question: '¿Qué servicios incluye una agencia de marketing digital en Santiago?',
      answer: 'Una agencia de marketing digital completa en Santiago debe incluir: gestión de Google Ads, Meta Ads (Facebook/Instagram), LinkedIn Ads, creación de contenido, análisis de datos, reportería, optimización de conversiones, estrategia digital y atención de equipo dedicado. En M&P todos nuestros planes incluyen estos servicios más reuniones presenciales en nuestras oficinas de Las Condes.'
    },
    {
      question: '¿Cuánto tiempo tarda en verse resultados con una agencia de marketing digital en Santiago?',
      answer: 'Los primeros resultados con una agencia de marketing digital pueden verse desde la semana 1 (primeros leads en Santiago). Sin embargo, la optimización real y resultados consistentes se logran entre 2-3 meses cuando ya tenemos suficiente data del mercado santiaguino para optimizar. En M&P trabajamos con transparencia total desde el día 1.'
    },
    {
      question: '¿Qué diferencia a una agencia de performance marketing en Santiago de una tradicional?',
      answer: 'Una agencia de performance marketing en Santiago como M&P cobra y optimiza basándose en resultados medibles: conversiones, ventas, leads calificados. Las agencias tradicionales optimizan para clicks, impresiones o "engagement". Nosotros te decimos exactamente cuánto te cuesta conseguir un cliente nuevo en Santiago, no solo cuántos clicks obtuviste.'
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
              <span className="text-white font-semibold">Agencia Marketing Digital Santiago</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Agencia Marketing Digital en Santiago:<br />
              Performance, Datos Reales, Oficinas en Las Condes
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Somos una <strong>agencia de marketing digital en Santiago</strong> con oficinas en Las Condes, especializada en <strong>performance marketing</strong>,
              Google Ads y Meta Ads. Te decimos exactamente cuánto te cuesta conseguir un cliente nuevo en el mercado santiaguino.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center text-lg"
              >
                Agendar Reunión en Las Condes
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
              ¿Por Qué Elegir una Agencia de Marketing Digital en Santiago?
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Si estás buscando una <strong>agencia de marketing digital en Santiago</strong>, es fundamental elegir una que
              entienda el mercado local, tenga presencia física en la capital y ofrezca resultados medibles.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              En <strong>Muller y Pérez</strong>, somos una <strong>agencia de performance marketing con oficinas en Las Condes</strong>,
              lo que nos permite ofrecer reuniones presenciales, atención personalizada y un conocimiento profundo del mercado santiaguino.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              A diferencia de agencias remotas o internacionales, nosotros conocemos:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2 ml-4">
              <li><strong>El comportamiento del consumidor de Santiago</strong> por comuna (Las Condes, Providencia, Santiago Centro, etc.)</li>
              <li><strong>Los horarios comerciales óptimos</strong> para campañas en la Región Metropolitana</li>
              <li><strong>La competencia local específica</strong> en cada sector de Santiago</li>
              <li><strong>Las particularidades del mercado chileno</strong> y regulaciones locales</li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              Esta cercanía y conocimiento local nos convierte en una de las mejores <strong>agencias de marketing digital en Santiago</strong>.
            </p>
          </section>

          {/* Ubicación y Cobertura */}
          <section className="mb-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nuestra Oficina en Santiago y Cobertura Metropolitana
            </h2>
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Oficinas en Las Condes
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Nuestras oficinas de <strong>agencia de marketing digital</strong> están ubicadas en <strong>Av Santa María 9300, Las Condes</strong>,
                una de las zonas más dinámicas y empresariales de Santiago. Esto nos permite:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Reuniones presenciales con clientes de Las Condes, Vitacura, Lo Barnechea y alrededores</li>
                <li>Atención personalizada en horario de oficina chileno (9:00 - 18:00)</li>
                <li>Workshops y sesiones estratégicas en nuestras instalaciones</li>
                <li>Soporte técnico presencial cuando lo necesites</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cobertura en Toda la Región Metropolitana
              </h3>
              <p className="text-gray-700 mb-4">
                Como <strong>agencia de marketing digital en Santiago</strong>, atendemos empresas en todas las comunas:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold mb-2">Sector Oriente:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Las Condes</li>
                    <li>Providencia</li>
                    <li>Vitacura</li>
                    <li>Lo Barnechea</li>
                    <li>La Reina</li>
                    <li>Ñuñoa</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Santiago Centro y Sur:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Santiago Centro</li>
                    <li>Estación Central</li>
                    <li>San Miguel</li>
                    <li>La Florida</li>
                    <li>Maipú</li>
                    <li>Pudahuel</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Servicios */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Servicios de Nuestra Agencia de Marketing Digital en Santiago
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Como <strong>agencia de marketing digital en Santiago</strong>, ofrecemos una suite completa de servicios
              de performance marketing optimizados para el mercado local:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Google Ads Santiago
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Gestión profesional de <strong>Google Ads en Santiago</strong> con segmentación geográfica por comuna,
                  optimización de keywords locales y estrategias específicas para el mercado santiaguino. Especialistas
                  certificados en <strong>Google Ads Las Condes</strong> y toda la RM.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Meta Ads Santiago
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Campañas de alto rendimiento en Facebook e Instagram para audiencias de Santiago. Creamos segmentaciones
                  por comuna, intereses locales y comportamientos específicos del consumidor santiaguino. Expertos en
                  <strong> Meta Ads Santiago</strong> y remarketing geolocalizado.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  LinkedIn Ads B2B Santiago
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Campañas especializadas para empresas B2B en Santiago. Targeting preciso por cargo, industria y empresa
                  en las principales zonas empresariales: Las Condes, Providencia, Vitacura. Ideal para generación de
                  leads empresariales de alta calidad en el mercado corporativo santiaguino.
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Analytics & Reportería Local
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Implementación de Google Analytics 4, Tag Manager y dashboards personalizados con datos segmentados
                  por zona geográfica de Santiago. Reportería semanal con métricas de performance por comuna y sector.
                  Medimos el funnel completo desde el primer click hasta la conversión en Santiago.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                Todos nuestros planes incluyen equipo dedicado de 3 profesionales
              </p>
              <p className="text-gray-700">
                A diferencia de otras <strong>agencias de marketing digital en Santiago</strong> donde eres un cliente más,
                en M&P tienes un equipo asignado exclusivamente para tu cuenta: Estratega Digital, Especialista en Pauta
                y Diseñador de Contenido. Además, puedes reunirte presencialmente con ellos en nuestras oficinas de Las Condes.
              </p>
            </div>
          </section>

          {/* Por qué elegirnos */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Elegir a M&P Como Tu Agencia de Marketing Digital en Santiago?
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  1. Oficinas Físicas en Las Condes - Reuniones Presenciales
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Muchas <strong>agencias de marketing digital</strong> trabajan 100% remoto. Nosotros tenemos oficinas
                  físicas en <strong>Las Condes, Santiago</strong>, donde puedes reunirte presencialmente con tu equipo,
                  hacer workshops estratégicos y recibir soporte cara a cara. Esta cercanía hace la diferencia.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  2. Conocimiento Profundo del Mercado Santiaguino
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Trabajamos con empresas en <strong>Santiago, Las Condes, Providencia, Vitacura y toda la RM</strong> desde 2019.
                  Conocemos el comportamiento del consumidor local, los mejores horarios para campañas por comuna, la competencia
                  específica de cada sector y las particularidades de hacer marketing digital en Santiago.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  3. Performance Marketing, No Métricas de Vanidad
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  No te vendemos "impresiones" ni "alcance". Como <strong>agencia de performance marketing en Santiago</strong>,
                  te decimos exactamente cuánto te cuesta conseguir un cliente nuevo en el mercado santiaguino (CAC) y
                  optimizamos para ese resultado. Marketing basado en datos reales del mercado de Santiago.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  4. Transparencia Total: Acceso Full a Tus Cuentas
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Muchas <strong>agencias de publicidad digital en Santiago</strong> mantienen tus cuentas de Google Ads
                  y Facebook bajo su control. Nosotros te damos <strong>acceso completo desde el día 1</strong>. Las cuentas
                  son tuyas, la data es tuya, nosotros solo las administramos. Sin letra chica.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  5. Equipo Dedicado de 3 Profesionales
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  En otras agencias, tu cuenta es manejada por una sola persona que atiende 20+ clientes. En M&P, tienes
                  un <strong>equipo dedicado de 3 personas</strong> asignadas exclusivamente: Estratega Digital, Especialista
                  en Pauta y Diseñador de Contenido. Todos basados en Santiago y disponibles para reuniones presenciales.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  6. Atención en Horario Chileno y Facturación Local
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A diferencia de agencias internacionales, trabajamos en <strong>horario de oficina chileno</strong> (9:00 - 18:00),
                  ofrecemos facturación en CLP, cumplimos con todas las regulaciones locales y estamos disponibles para
                  reuniones de urgencia en Santiago cuando lo necesites.
                </p>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Cuánto Cuesta una Agencia de Marketing Digital en Santiago?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Esta es una de las preguntas más frecuentes al <strong>contratar una agencia de marketing digital en Santiago</strong>.
              Los precios en el mercado santiaguino varían significativamente según el nivel de servicio:
            </p>

            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rangos de Precios en Santiago (2025)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💸</span>
                  <div>
                    <strong>Agencias básicas o freelancers en Santiago:</strong> $300k - $500k/mes<br />
                    <span className="text-sm text-gray-600">Generalmente 1 persona, servicio limitado, sin oficinas físicas ni equipo dedicado</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <strong>Agencias intermedias en Santiago:</strong> $600k - $1M/mes<br />
                    <span className="text-sm text-gray-600">Servicio más completo pero aún limitado en recursos y atención personalizada</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💎</span>
                  <div>
                    <strong>Agencias premium con oficinas en Las Condes (M&P):</strong> $980k - $1.5M+/mes<br />
                    <span className="text-sm text-gray-600">Equipo dedicado, oficinas físicas, acceso full, reuniones presenciales, performance marketing real</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Nuestros Planes de Marketing Digital en Santiago:</h4>
              <ul className="space-y-2 text-gray-800">
                <li><strong>Plan Silver:</strong> $650.000/mes - Ideal para PYMEs que empiezan en Santiago</li>
                <li><strong>Plan Gold:</strong> $980.000/mes - Más popular, para empresas en crecimiento en la RM</li>
                <li><strong>Plan Platinum:</strong> $1.500.000+/mes - Para empresas que escalan agresivamente en Santiago</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Todos los planes incluyen reuniones presenciales en nuestras oficinas de Las Condes
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>¿Vale la pena invertir en una agencia de marketing digital en Santiago?</strong> Absolutamente. Si hoy gastas
              $3M/mes en publicidad en Santiago sin agencia, podrías estar perdiendo 40-60% de ese presupuesto en optimizaciones
              mal hechas. Una buena <strong>agencia de marketing digital</strong> recupera su costo optimizando tu inversión publicitaria.
            </p>
          </section>

          {/* Casos de uso por sector */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Para Qué Tipo de Empresas en Santiago Funciona una Agencia de Marketing Digital?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Empresas B2B en Las Condes
                </h3>
                <p className="text-gray-700">
                  <strong>Agencia marketing digital B2B</strong> especializada en LinkedIn Ads, Google Search y generación
                  de leads calificados para empresas que venden a otras empresas en el sector empresarial de Las Condes,
                  Providencia y Vitacura.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  E-commerce en Santiago
                </h3>
                <p className="text-gray-700">
                  <strong>Agencia marketing digital ecommerce</strong> con experiencia en Shopping Ads, catálogos dinámicos
                  y remarketing de alto rendimiento para tiendas online que venden en Santiago y toda Chile.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  PYMEs y Retail en Santiago
                </h3>
                <p className="text-gray-700">
                  <strong>Agencia marketing digital para PYMEs</strong> con planes accesibles y resultados medibles, ideal
                  para empresas locales en Santiago que buscan crecer en el entorno digital y competir con grandes marcas.
                </p>
              </div>
            </div>
          </section>

          {/* Sectores de Santiago */}
          <section className="mb-16 bg-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Marketing Digital por Sectores de Santiago
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Como <strong>agencia de marketing digital en Santiago</strong>, entendemos que cada comuna y sector tiene
              características únicas que requieren estrategias específicas:
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Marketing Digital en Las Condes y Vitacura
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  En <strong>Las Condes</strong> y <strong>Vitacura</strong>, sector de alto poder adquisitivo y empresarial,
                  las estrategias se enfocan en audiencias premium, servicios de alto valor, B2B corporativo y retail de lujo.
                  Ideal para empresas de tecnología, consultoría, servicios profesionales y retail premium.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Marketing Digital en Providencia y Ñuñoa
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Providencia</strong> y <strong>Ñuñoa</strong> son zonas de alta actividad comercial, gastronómica
                  y de servicios. Las estrategias se enfocan en consumidores jóvenes, profesionales y familias con poder
                  adquisitivo medio-alto. Ideal para restaurantes, retail, servicios educativos y entretenimiento.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Marketing Digital en Santiago Centro
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Santiago Centro</strong> requiere estrategias de alto volumen y alcance masivo. Ideal para retail,
                  servicios de consumo masivo, educación y empresas que buscan captar gran volumen de leads en el corazón
                  comercial y administrativo de la capital.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes Sobre Agencias de Marketing Digital en Santiago
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Dónde está ubicada su agencia de marketing digital en Santiago?',
                  a: 'Muller y Pérez tiene oficinas en Las Condes, Santiago. Estamos ubicados en Av Santa María 9300, Las Condes. Atendemos clientes en toda la Región Metropolitana incluyendo Las Condes, Providencia, Santiago Centro, Vitacura, Lo Barnechea, Ñuñoa y todas las comunas de Santiago.'
                },
                {
                  q: '¿Por qué elegir una agencia de marketing digital en Santiago vs una agencia remota?',
                  a: 'Una agencia de marketing digital en Santiago como M&P ofrece ventajas clave: reuniones presenciales en nuestras oficinas de Las Condes, conocimiento profundo del mercado local santiaguino, atención en horario chileno, facturación en CLP y entendimiento del comportamiento del consumidor de Santiago. Conocemos las particularidades de cada comuna y sector comercial de la capital.'
                },
                {
                  q: '¿Cuánto cuesta una agencia de marketing digital en Santiago en 2025?',
                  a: 'El costo de una agencia de marketing digital en Santiago varía entre $650.000 y $1.500.000+ mensuales. En M&P ofrecemos planes transparentes: Silver ($650k), Gold ($980k) y Platinum ($1.5M+), todos con equipo dedicado de 3 profesionales, acceso full a cuentas, reportería semanal y reuniones presenciales en nuestra oficina de Las Condes.'
                },
                {
                  q: '¿Qué sectores de Santiago atienden como agencia de marketing digital?',
                  a: 'Como agencia de marketing digital en Santiago, atendemos empresas en todas las comunas: Las Condes, Providencia, Vitacura, Lo Barnechea, Santiago Centro, Ñuñoa, La Reina, Peñalolén, Macul, San Joaquín, La Florida, Maipú, Pudahuel y toda la Región Metropolitana. Tenemos experiencia trabajando con empresas de diferentes sectores comerciales en cada zona.'
                },
                {
                  q: '¿Qué servicios incluye una agencia de marketing digital en Santiago?',
                  a: 'Una agencia de marketing digital completa en Santiago debe incluir: gestión de Google Ads, Meta Ads (Facebook/Instagram), LinkedIn Ads, creación de contenido, análisis de datos, reportería, optimización de conversiones, estrategia digital y atención de equipo dedicado. En M&P todos nuestros planes incluyen estos servicios más reuniones presenciales en nuestras oficinas de Las Condes.'
                },
                {
                  q: '¿Cuánto tiempo tarda en verse resultados con una agencia de marketing digital en Santiago?',
                  a: 'Los primeros resultados con una agencia de marketing digital pueden verse desde la semana 1 (primeros leads en Santiago). Sin embargo, la optimización real y resultados consistentes se logran entre 2-3 meses cuando ya tenemos suficiente data del mercado santiaguino para optimizar. En M&P trabajamos con transparencia total desde el día 1.'
                },
                {
                  q: '¿Qué diferencia a una agencia de performance marketing en Santiago de una tradicional?',
                  a: 'Una agencia de performance marketing en Santiago como M&P cobra y optimiza basándose en resultados medibles: conversiones, ventas, leads calificados. Las agencias tradicionales optimizan para clicks, impresiones o "engagement". Nosotros te decimos exactamente cuánto te cuesta conseguir un cliente nuevo en Santiago, no solo cuántos clicks obtuviste.'
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
              ¿Listo para Trabajar con una Agencia de Marketing Digital en Santiago con Resultados Reales?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Agenda una reunión gratuita de 30 minutos en nuestras oficinas de Las Condes. Te mostramos cómo funciona
              el performance marketing con datos reales del mercado de Santiago y te damos un análisis inicial de tu situación actual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Agendar Reunión en Las Condes
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
              © 2025 Muller y Pérez - Agencia de Marketing Digital Santiago | Oficinas en Las Condes | Todos los derechos reservados
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
