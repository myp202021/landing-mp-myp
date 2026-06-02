/**
 * Página Pilar SEO: Agencia de Marketing Digital en Chile
 * Target keyword: "agencia de marketing digital chile"
 * Contenido largo (2000+ palabras), schemas completos, internal links
 * Actualizado mayo 2026
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createOrganizationSchema,
  createWebPageSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
  createServiceSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia de Marketing Digital en Chile — Muller y Pérez',
  description: 'Agencia de marketing digital y performance marketing en Chile. Google Ads, Meta Ads, LinkedIn Ads. +50 clientes, ROAS promedio 4.2x. Equipo dedicado.',
  keywords: [
    'agencia marketing digital chile',
    'agencia de marketing digital',
    'marketing digital chile',
    'agencia digital chile',
    'agencia de marketing digital chile',
    'agencia performance marketing chile',
    'agencia google ads chile',
    'agencia meta ads chile',
    'mejor agencia marketing digital chile',
    'contratar agencia marketing digital chile',
    'precios agencia marketing digital chile'
  ],
  path: '/agencia-marketing-digital-chile'
})

const faqs = [
  {
    question: '¿Cuánto cuesta una agencia de marketing digital en Chile?',
    answer: 'Los precios de una agencia de marketing digital en Chile varían según el nivel de servicio. Agencias básicas cobran entre $300.000 y $600.000 mensuales con servicios limitados. Agencias profesionales como Muller y Pérez ofrecen planes desde $950.000 hasta $2.200.000 mensuales + IVA, con equipo dedicado de 3 profesionales, acceso total a cuentas publicitarias y herramientas propietarias incluidas. El cliente paga la pauta directamente a Google o Meta, sin markup.'
  },
  {
    question: '¿Qué diferencia hay entre marketing digital y performance marketing?',
    answer: 'El marketing digital es un término amplio que incluye cualquier acción de marketing online: redes sociales orgánicas, SEO, email marketing, branding digital, etc. El performance marketing es una disciplina específica dentro del marketing digital que se enfoca exclusivamente en resultados medibles: conversiones, ventas, leads calificados y retorno sobre la inversión (ROAS). En Muller y Pérez nos especializamos en performance marketing, lo que significa que cada peso invertido se mide y optimiza para generar resultados concretos.'
  },
  {
    question: '¿Cuánto debería invertir en publicidad digital en Chile?',
    answer: 'La inversión mínima recomendada en publicidad digital depende de tu industria y objetivos. Para campañas de Google Ads en Chile, recomendamos un mínimo de $500.000 a $1.000.000 mensuales en pauta para obtener datos suficientes para optimizar. Para Meta Ads, el mínimo viable es de $300.000 a $500.000 mensuales. Estas cifras son adicionales al fee de la agencia. Nuestro Predictor de Campañas te permite estimar tu CPC y CPA antes de invertir, basándose en datos reales de más de 1.200 keywords del mercado chileno.'
  },
  {
    question: '¿Cuánto tarda en verse resultados con una agencia de marketing digital?',
    answer: 'Los primeros leads pueden llegar desde la primera semana de campaña activa. Sin embargo, la optimización real requiere entre 2 y 3 meses de data acumulada para ajustar audiencias, pujas y creatividades. En Muller y Pérez entregamos reportes semanales desde el día 1, y los clientes ven mejoras consistentes en CPA y ROAS a partir del segundo mes. La clave es la paciencia y la data: mientras más información acumulamos, mejor optimizamos.'
  },
  {
    question: '¿Qué plataformas publicitarias maneja una agencia de marketing digital?',
    answer: 'Una agencia de marketing digital completa debe manejar al menos Google Ads (Search, Shopping, Display, YouTube, Performance Max), Meta Ads (Facebook, Instagram, WhatsApp, Advantage+) y LinkedIn Ads para B2B. En Muller y Pérez gestionamos todas estas plataformas de forma integrada, con estrategias cross-channel que optimizan el presupuesto según el rendimiento de cada canal para tu industria específica.'
  },
  {
    question: '¿Cómo saber si una agencia de marketing digital es confiable?',
    answer: 'Verifica estos 7 indicadores: 1) ¿Te dan acceso completo a tus cuentas de Google Ads y Meta? 2) ¿Tienen clientes activos verificables? 3) ¿Ofrecen dashboard o reportería en tiempo real? 4) ¿Su fee es transparente (fijo vs comisión sobre pauta)? 5) ¿Cuántas personas trabajan realmente en tu cuenta? 6) ¿Tienen certificaciones verificables? 7) ¿Tienen tecnología o metodología propia? Muller y Pérez cumple los 7 criterios con más de 50 clientes activos verificables y 6 herramientas propietarias.'
  },
  {
    question: '¿Es mejor contratar una agencia o un equipo interno de marketing?',
    answer: 'Depende de tu presupuesto y escala. Un equipo interno mínimo (1 media buyer + 1 diseñador + 1 analista) cuesta más de $4.000.000 mensuales en sueldos, sin contar herramientas, capacitación ni supervisión. Una agencia como Muller y Pérez ofrece un equipo de 3 profesionales dedicados desde $950.000/mes, con acceso a herramientas propietarias, benchmarks de industria y experiencia multi-sector. Para empresas con inversión en pauta menor a $10.000.000 mensuales, la agencia es más eficiente.'
  },
  {
    question: '¿Qué industrias atiende Muller y Pérez?',
    answer: 'Atendemos más de 15 industrias en Chile, incluyendo: e-commerce, SaaS, fintech, inmobiliaria, salud, educación, servicios profesionales, B2B industrial, transporte, minería, seguros, turismo, legal, manufactura y retail. Nuestro sistema de benchmarks de industria nos permite calibrar campañas con datos reales de CPC, CVR y CPA específicos del mercado chileno para cada sector.'
  },
  {
    question: '¿Qué herramientas tecnológicas usa Muller y Pérez?',
    answer: 'Contamos con 6 herramientas propietarias: 1) Predictor de Campañas — estima CPC y CPA antes de invertir con datos de +1.200 keywords chilenas, 2) Buyer Gen — genera segmentaciones con IA, 3) Radar de Industrias — benchmarks por sector, 4) Termómetro Marketing Digital Chile — indicadores semanales del mercado, 5) CRM con Portal Cliente — dashboard en tiempo real, 6) Monitor de Competencia — seguimiento automático de competidores en redes sociales.'
  },
  {
    question: '¿Muller y Pérez trabaja con empresas fuera de Santiago?',
    answer: 'Sí. Aunque nuestras oficinas están en Las Condes, Santiago, atendemos empresas de todo Chile de forma remota. Tenemos clientes en Concepción, Valparaíso, Antofagasta, Temuco, Puerto Montt y otras ciudades. Las reuniones se realizan por videollamada y toda nuestra plataforma de reportería y dashboards es 100% online.'
  },
  {
    question: '¿Cuánto cobra una agencia de marketing digital en Chile?',
    answer: 'Los honorarios varían según el alcance del servicio. Agencias freelance o unipersonales cobran entre $200.000 y $500.000 mensuales, pero suelen manejar decenas de cuentas simultáneamente. Agencias medianas cobran entre $600.000 y $1.500.000 mensuales. Agencias premium con equipo dedicado, como Muller y Pérez, tienen planes desde $950.000 hasta $2.200.000 mensuales + IVA. A esto se suma la inversión en pauta publicitaria, que el cliente paga directamente a las plataformas (Google, Meta, LinkedIn).'
  },
  {
    question: '¿Qué diferencia hay entre una agencia de marketing y una agencia de publicidad?',
    answer: 'Una agencia de publicidad tradicional se enfoca en creatividad, branding y producción de piezas (spots de TV, radio, vía pública). Una agencia de marketing digital se especializa en canales online: Google Ads, Meta Ads, LinkedIn Ads, SEO, email marketing y analítica. Dentro del marketing digital, las agencias de performance marketing como Muller y Pérez van un paso más allá: cada acción se mide por su impacto en ventas reales, no solo en métricas de visibilidad.'
  },
  {
    question: '¿Cuánto tiempo dura un contrato con una agencia de marketing digital?',
    answer: 'Depende de la agencia. Muchas exigen contratos de 6 a 12 meses con penalización por salida anticipada. En Muller y Pérez no tenemos contrato de permanencia: trabajamos mes a mes y los resultados hablan por sí solos. Recomendamos un mínimo de 3 meses para que la optimización de campañas alcance su potencial completo, pero la continuidad es decisión del cliente.'
  },
  {
    question: '¿Cómo medir si mi agencia de marketing digital está haciendo un buen trabajo?',
    answer: 'Deberías evaluar: 1) Evolución del CPA (costo por adquisición) mes a mes, 2) Calidad de los leads o ventas generadas, no solo cantidad, 3) ROAS (retorno sobre inversión publicitaria), 4) Transparencia en el acceso a cuentas y datos, 5) Proactividad en proponer mejoras y nuevas estrategias. Si tu agencia solo te envía un PDF mensual con impresiones y clicks sin conectarlo a resultados de negocio, es una señal de alerta.'
  },
  {
    question: '¿Una agencia de marketing digital puede ayudar a mi empresa si recién empiezo?',
    answer: 'Sí, pero es importante tener expectativas realistas. Para empresas que recién comienzan, recomendamos una inversión mínima en pauta de $500.000 mensuales y un plan de al menos 3 meses para recopilar datos suficientes. En Muller y Pérez, nuestro Predictor de Campañas te permite estimar costos y resultados antes de invertir, lo que reduce el riesgo significativamente. El Plan Silver está diseñado específicamente para PYMEs que dan sus primeros pasos en publicidad digital.'
  }
]

const servicios = [
  {
    nombre: 'Google Ads',
    icono: '🎯',
    descripcion: 'Campañas de Search, Shopping, Display, YouTube y Performance Max. Optimizamos para conversiones reales con pujas inteligentes y estructura de cuenta avanzada.',
    link: '/servicios/google-ads-chile'
  },
  {
    nombre: 'Meta Ads',
    icono: '📱',
    descripcion: 'Facebook, Instagram, WhatsApp y Advantage+. Audiencias personalizadas, creatividades de alto rendimiento y optimización de conversiones con pixel avanzado.',
    link: '/servicios/meta-ads-chile'
  },
  {
    nombre: 'LinkedIn Ads',
    icono: '💼',
    descripcion: 'Campañas B2B con targeting por cargo, industria, empresa y antigüedad. Generación de leads empresariales de alta calidad para ciclos de venta largos.',
    link: '/servicios/performance-marketing'
  },
  {
    nombre: 'Analytics y Medición',
    icono: '📊',
    descripcion: 'Google Analytics 4, Tag Manager, dashboards personalizados y modelado de atribución. Medimos todo el funnel: del primer click a la venta cerrada.',
    link: '/servicios/performance-marketing'
  },
  {
    nombre: 'Landing Pages',
    icono: '🖥️',
    descripcion: 'Diseño y desarrollo de landing pages optimizadas para conversión. A/B testing, velocidad de carga y experiencia mobile-first para maximizar tu tasa de conversión.',
    link: '/servicios/performance-marketing'
  },
  {
    nombre: 'CRM y Automatización',
    icono: '⚙️',
    descripcion: 'Portal de cliente con métricas en tiempo real, integración con tu CRM y automatización de reportería. Visibilidad total de tu inversión y resultados.',
    link: '/servicios/performance-marketing'
  }
]

const industrias = [
  { nombre: 'E-commerce y Retail', link: '/marketing-digital-ecommerce-chile' },
  { nombre: 'SaaS y Software', link: '/marketing-digital-saas-chile' },
  { nombre: 'Fintech', link: '/marketing-digital-fintech-chile' },
  { nombre: 'Inmobiliaria', link: '/marketing-digital-inmobiliario-chile' },
  { nombre: 'Salud y Bienestar', link: '/marketing-digital-salud-chile' },
  { nombre: 'Educación', link: '/marketing-digital-educacion-chile' },
  { nombre: 'Servicios Profesionales', link: '/marketing-digital-servicios-profesionales-chile' },
  { nombre: 'B2B Industrial', link: '/marketing-digital-b2b-chile' },
  { nombre: 'Seguros', link: '/marketing-digital-seguros-chile' },
  { nombre: 'Turismo y Hotelería', link: '/marketing-digital-turismo-chile' },
  { nombre: 'Legal', link: '/marketing-digital-legal-chile' },
  { nombre: 'Manufactura', link: '/marketing-digital-manufactura-chile' }
]

export default function AgenciaMarketingDigitalChilePage() {
  const orgSchema = createOrganizationSchema()

  const webPageSchema = createWebPageSchema(
    'Agencia de Marketing Digital en Chile — Muller y Pérez',
    'Agencia de marketing digital y performance marketing en Chile. Google Ads, Meta Ads, LinkedIn Ads. +50 clientes, ROAS promedio 4.2x. Equipo dedicado.',
    'https://www.mulleryperez.cl/agencia-marketing-digital-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia de Marketing Digital en Chile', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-chile' }
  ])

  const faqSchema = createFAQPageSchema(faqs)

  const googleAdsSchema = createServiceSchema({
    name: 'Gestión de Google Ads en Chile',
    description: 'Gestión profesional de campañas Google Ads: Search, Shopping, Display, YouTube y Performance Max. Optimización para conversiones reales con equipo dedicado.',
    serviceType: 'Search Engine Marketing',
    price: '950000'
  })

  const metaAdsSchema = createServiceSchema({
    name: 'Gestión de Meta Ads en Chile',
    description: 'Campañas de alto rendimiento en Facebook, Instagram y WhatsApp. Audiencias personalizadas, remarketing inteligente y optimización de conversiones.',
    serviceType: 'Social Media Advertising',
    price: '950000'
  })

  const linkedInAdsSchema = createServiceSchema({
    name: 'LinkedIn Ads B2B en Chile',
    description: 'Campañas especializadas en LinkedIn para generación de leads B2B. Targeting por cargo, industria y empresa.',
    serviceType: 'B2B Advertising',
    price: '950000'
  })

  const analyticsSchema = createServiceSchema({
    name: 'Analytics y Medición Digital',
    description: 'Implementación de Google Analytics 4, Tag Manager, dashboards personalizados y reportería semanal con métricas de negocio.',
    serviceType: 'Digital Analytics',
    price: '950000'
  })

  const landingSchema = createServiceSchema({
    name: 'Landing Pages de Conversión',
    description: 'Diseño y desarrollo de landing pages optimizadas para conversión con A/B testing y experiencia mobile-first.',
    serviceType: 'Web Development',
    price: '950000'
  })

  const crmSchema = createServiceSchema({
    name: 'CRM y Automatización de Marketing',
    description: 'Portal de cliente con métricas en tiempo real, integración CRM y automatización de reportería.',
    serviceType: 'Marketing Automation',
    price: '950000'
  })

  return (
    <>
      {/* Schemas JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(googleAdsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(metaAdsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(linkedInAdsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(analyticsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crmSchema) }} />

      <div className="min-h-screen bg-white">

        {/* ============================================================ */}
        {/* 1. HERO SECTION */}
        {/* ============================================================ */}
        <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-blue-200 hover:text-white transition">Inicio</Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white font-semibold">Agencia de Marketing Digital en Chile</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Agencia de Marketing Digital en Chile
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
              Somos <strong>Muller y Pérez</strong>, una agencia de performance marketing que convierte tu inversión publicitaria
              en clientes reales. Google Ads, Meta Ads y LinkedIn Ads con equipo dedicado, datos reales del mercado chileno
              y herramientas propietarias que ninguna otra agencia tiene.
            </p>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">+50</p>
                <p className="text-blue-200 text-sm mt-1">Clientes activos</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">4.2x</p>
                <p className="text-blue-200 text-sm mt-1">ROAS promedio</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">+15</p>
                <p className="text-blue-200 text-sm mt-1">Industrias</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center text-lg"
              >
                Agendar Reunión Gratis
              </Link>
              <Link
                href="/labs/predictor"
                className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-center text-lg"
              >
                Probar el Predictor de Campañas
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CONTENIDO PRINCIPAL */}
        {/* ============================================================ */}
        <article className="container mx-auto px-6 max-w-4xl py-16">

          {/* ============================================================ */}
          {/* 2. ¿QUÉ HACE UNA AGENCIA DE MARKETING DIGITAL? */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Qué Hace una Agencia de Marketing Digital?
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Una <strong>agencia de marketing digital</strong> es una empresa especializada en diseñar, ejecutar y optimizar
              estrategias de publicidad online para que las empresas consigan más clientes a través de internet.
              Sin embargo, no todas las agencias funcionan igual ni entregan los mismos resultados.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Los servicios principales de una agencia de marketing digital incluyen la gestión de campañas en
              <strong> Google Ads</strong> (para aparecer cuando tus potenciales clientes buscan tu producto o servicio),
              <strong> Meta Ads</strong> (publicidad en Facebook, Instagram y WhatsApp para generar demanda y remarketing),
              <strong> LinkedIn Ads</strong> (ideal para empresas B2B que necesitan llegar a tomadores de decisión),
              analítica avanzada con Google Analytics 4 y Tag Manager, y optimización continua de conversiones.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              El trabajo de una buena agencia no se limita a crear anuncios y activar campañas. Incluye investigación de
              mercado, análisis de competencia, definición de audiencias, creación de contenido publicitario, configuración
              de tracking y medición, optimización semanal de pujas y presupuestos, y reportería con métricas de negocio reales.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              La diferencia entre una agencia que genera resultados y una que quema presupuesto está en su enfoque.
              Las agencias tradicionales optimizan para métricas de vanidad como impresiones, clicks o alcance.
              Las <strong>agencias de performance marketing</strong> como Muller y Pérez optimizan para lo que realmente importa:
              leads calificados, ventas y retorno sobre la inversión.
            </p>
          </section>

          {/* ============================================================ */}
          {/* 3. ¿POR QUÉ ELEGIR MULLER Y PÉREZ? */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Elegir a Muller y Pérez como Tu Agencia de Marketing Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              En un mercado con más de 500 agencias de marketing digital en Chile, elegir la correcta puede significar
              la diferencia entre generar clientes reales y perder tu inversión. Estos son los diferenciadores que
              nos posicionan como una de las <Link href="/ranking-agencias-marketing-digital-chile" className="text-blue-600 hover:underline font-semibold">mejores agencias de marketing digital en Chile</Link>:
            </p>

            <div className="space-y-8">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Performance Puro: Sin Branding ni Community Management
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  No hacemos community management, no publicamos memes ni gestionamos comentarios. Nos especializamos
                  exclusivamente en <strong>performance marketing</strong>: campañas de publicidad pagada diseñadas para
                  generar leads, ventas y retorno medible. Cada peso de tu inversión se optimiza para resultados concretos,
                  no para métricas de vanidad.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Herramientas Propietarias que Ninguna Otra Agencia Tiene
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-3">
                  Desarrollamos 6 herramientas propias que nos dan una ventaja competitiva real:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong><Link href="/labs/predictor" className="text-blue-600 hover:underline">Predictor de Campañas</Link></strong> — estima tu CPC y CPA antes de invertir un peso, con datos de +1.200 keywords chilenas</li>
                  <li><strong>Buyer Gen</strong> — genera segmentaciones de audiencia con inteligencia artificial basada en datos reales</li>
                  <li><strong><Link href="/utilidades" className="text-blue-600 hover:underline">Radar de Industrias</Link></strong> — benchmarks de CPC, CVR y CPA por sector del mercado chileno</li>
                  <li><strong><Link href="/indicadores" className="text-blue-600 hover:underline">Termómetro Marketing Digital Chile</Link></strong> — indicadores semanales del mercado (USD/CLP, CPC, CPA)</li>
                  <li><strong>CRM con Portal Cliente</strong> — dashboard en tiempo real con todas tus métricas</li>
                  <li><strong>Monitor de Competencia</strong> — seguimiento automático de competidores en Instagram, LinkedIn y Facebook</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Fee Fijo sin Markup sobre Pauta
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Muchas agencias cobran un porcentaje de tu inversión publicitaria (15-25%), lo que genera un conflicto
                  de interés: ganan más si gastas más, no si vendes más. En Muller y Pérez cobramos un fee fijo mensual
                  y el cliente paga la pauta directamente a Google o Meta. Nuestro incentivo es optimizar tus resultados,
                  no inflar tu presupuesto.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Equipo Dedicado de 3 Profesionales por Cliente
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Cada cliente tiene asignado un equipo exclusivo: un Paid Media Planner (estrategia y optimización),
                  un Publicista (contenido y narrativa) y un Diseñador (piezas gráficas y video). No eres un cliente
                  más en una lista de 50. Tu equipo conoce tu negocio, tu industria y tus objetivos.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Dashboard en Tiempo Real y Reportería Semanal
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  No esperamos al cierre de mes para decirte cómo van las cosas. Tienes acceso 24/7 a tu dashboard
                  con métricas actualizadas, recibes reportes semanales con análisis y recomendaciones, y tenemos
                  reuniones estratégicas periódicas. Transparencia total desde el día 1.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Datos Reales del Mercado Chileno
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nuestro sistema de benchmarks contiene datos calibrados de CPC, CVR y CPA para más de 50 industrias
                  del mercado chileno, basados en más de 1.200 keywords reales. Esto nos permite configurar campañas
                  con expectativas realistas desde el primer día, no con promesas genéricas.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. SERVICIOS */}
          {/* ============================================================ */}
          <section className="mb-16 bg-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Servicios de Nuestra Agencia de Marketing Digital
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Ofrecemos una suite completa de servicios de <strong>marketing digital en Chile</strong>, todos
              enfocados en generar resultados medibles para tu negocio:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {servicios.map((servicio, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    <span className="mr-2">{servicio.icono}</span>
                    <Link href={servicio.link} className="hover:text-blue-600 transition">
                      {servicio.nombre}
                    </Link>
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {servicio.descripcion}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                Todos nuestros planes incluyen equipo dedicado de 3 profesionales
              </p>
              <p className="text-gray-700">
                Paid Media Planner + Publicista + Diseñador trabajando exclusivamente en tu cuenta.
                Acceso total a tus cuentas publicitarias desde el primer día.
              </p>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 5. INDUSTRIAS QUE ATENDEMOS */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Industrias que Atendemos
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Trabajamos con empresas de más de 15 industrias en Chile. Nuestro sistema de benchmarks
              nos permite calibrar campañas con datos reales de cada sector, optimizando desde el primer día:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {industrias.map((ind, i) => (
                <Link
                  key={i}
                  href={ind.link}
                  className="bg-gray-50 hover:bg-blue-50 rounded-xl p-4 text-center transition group"
                >
                  <p className="text-gray-900 font-medium group-hover:text-blue-600 transition">
                    {ind.nombre}
                  </p>
                </Link>
              ))}
            </div>

            <p className="text-gray-600 text-sm mt-4 text-center">
              <Link href="/utilidades" className="text-blue-600 hover:underline">
                Ver benchmarks por industria en nuestras herramientas gratuitas
              </Link>
            </p>
          </section>

          {/* ============================================================ */}
          {/* 6. PLANES */}
          {/* ============================================================ */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Planes y Precios de Marketing Digital en Chile
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Planes transparentes con fee fijo. El cliente paga la pauta directo a Google o Meta.
              Todos los planes incluyen equipo dedicado y acceso total a cuentas.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Silver */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Silver</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">$950.000<span className="text-sm font-normal text-gray-500">/mes + IVA</span></p>
                <p className="text-sm text-gray-500 mb-4">Ideal para PYMEs que empiezan</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>1 producto en foco</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Google Ads + Meta Ads</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Equipo de 3 profesionales</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Reunión quincenal</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Reporte mensual</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Grilla contenido orgánico</li>
                </ul>
              </div>

              {/* Gold */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-500 relative">
                <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Más popular
                </span>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Plan Gold</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">$1.350.000<span className="text-sm font-normal text-gray-500">/mes + IVA</span></p>
                <p className="text-sm text-gray-500 mb-4">Para empresas en crecimiento</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Hasta 2 productos</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Google + Meta + LinkedIn</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Equipo de 3 profesionales</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Reunión semanal</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>A/B testing + remarketing</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Reporte lead-a-venta</li>
                </ul>
              </div>

              {/* Platinum */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Platinum</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">$2.200.000<span className="text-sm font-normal text-gray-500">/mes + IVA</span></p>
                <p className="text-sm text-gray-500 mb-4">Escalamiento agresivo</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Todos los canales</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Productos ilimitados</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Equipo de 3 profesionales</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Dashboard tiempo real</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Webinar mensual</li>
                  <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">&#10003;</span>Expansión regional LATAM</li>
                </ul>
              </div>
            </div>

            <p className="text-center text-gray-600">
              <Link href="/planes" className="text-blue-600 hover:underline font-semibold">
                Ver detalle completo de planes y comparar funcionalidades
              </Link>
            </p>
          </section>

          {/* ============================================================ */}
          {/* 7. SOCIAL PROOF / CASOS */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resultados Reales de Nuestros Clientes
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              No hablamos de promesas. Estos son resultados reales medidos en las cuentas publicitarias de nuestros clientes:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2">E-commerce / Retail</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">ROAS 5.8x en Google Shopping</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Cliente de retail con catálogo de +2.000 SKUs. Optimización de feed, segmentación por margen
                  y pujas automatizadas. Inversión mensual de $3.5M en pauta con retorno de $20.3M en ventas atribuidas.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2">B2B / Servicios Profesionales</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">Reducción de CAC en 42%</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Empresa de servicios B2B. Combinación de Google Search + LinkedIn Ads con landing pages
                  optimizadas. El costo de adquisición bajó de $85.000 a $49.000 en 3 meses.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2">SaaS / Tecnología</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">+340% en leads calificados</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Startup SaaS chilena. Reestructuración completa de cuenta Google Ads, nuevas campañas
                  de Performance Max y remarketing en Meta. De 12 a 53 leads calificados por mes.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2">Inmobiliaria</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">CPL de $4.200 en promedio</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Inmobiliaria con proyectos en Santiago y regiones. Campañas de Meta Ads + Google Search
                  con formularios nativos y seguimiento de lead-a-visita. CPL 35% bajo el benchmark de la industria.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <p className="text-lg text-gray-800 mb-3">
                <strong>4.9/5 estrellas</strong> en satisfacción de clientes
                <span className="text-gray-500 ml-2">(47 evaluaciones)</span>
              </p>
              <Link href="/casos-de-exito" className="text-blue-600 hover:underline font-semibold">
                Ver todos los casos de éxito
              </Link>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 8. METODOLOGIA */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Metodologia M&P: Como Trabajamos
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Cada proyecto sigue un proceso estructurado de 4 etapas que nos permite entregar resultados
              consistentes independientemente de la industria o el tamaño de la empresa. Asi es como una
              <strong> agencia de marketing digital</strong> profesional deberia funcionar:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 relative">
                <span className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">1</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 ml-4">Diagnostico</h3>
                <p className="text-gray-700 leading-relaxed">
                  Auditamos tu situacion actual: cuentas publicitarias, tracking, landing pages, competencia
                  y mercado. Usamos nuestro <Link href="/labs/predictor" className="text-blue-600 hover:underline">Predictor de Campanas</Link> para
                  estimar CPC y CPA reales de tu industria en Chile antes de invertir un peso.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 relative">
                <span className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">2</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 ml-4">Estrategia</h3>
                <p className="text-gray-700 leading-relaxed">
                  Definimos canales, presupuesto, audiencias y KPIs con base en datos reales del mercado chileno.
                  No usamos plantillas genericas: cada estrategia se construye desde cero para tu negocio,
                  usando benchmarks de mas de 50 industrias locales.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 relative">
                <span className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">3</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 ml-4">Ejecucion</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tu equipo dedicado de 3 profesionales (Paid Media Planner, Publicista y Disenador) lanza las
                  campanas en <Link href="/servicios/google-ads-chile" className="text-blue-600 hover:underline">Google Ads</Link>,{' '}
                  <Link href="/servicios/meta-ads-chile" className="text-blue-600 hover:underline">Meta Ads</Link> y/o LinkedIn Ads.
                  Configuramos tracking avanzado con GA4 y Tag Manager para medir cada conversion.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 relative">
                <span className="absolute -top-3 -left-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">4</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 ml-4">Optimizacion Continua</h3>
                <p className="text-gray-700 leading-relaxed">
                  Cada semana analizamos resultados, ajustamos pujas, rotamos creatividades y refinamos
                  audiencias. Recibes reportes semanales con metricas de negocio reales (no vanidad),
                  y reuniones estrategicas para alinear la campana con tus objetivos comerciales.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 9. CASOS DE EXITO POR INDUSTRIA */}
          {/* ============================================================ */}
          <section className="mb-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Casos de Exito por Industria
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Trabajamos con empresas de multiples sectores en Chile. Estos son resultados representativos
              por industria, medidos directamente en las plataformas publicitarias de nuestros clientes:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-3 rounded-tl-lg font-semibold">Industria</th>
                    <th className="px-4 py-3 font-semibold">Canal Principal</th>
                    <th className="px-4 py-3 font-semibold">Resultado Clave</th>
                    <th className="px-4 py-3 rounded-tr-lg font-semibold">Periodo</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="px-4 py-3 font-medium">
                      <Link href="/marketing-digital-inmobiliario-chile" className="text-blue-600 hover:underline">Inmobiliario</Link>
                    </td>
                    <td className="px-4 py-3">Meta Ads + Google Search</td>
                    <td className="px-4 py-3">Reduccion CPA 40% vs benchmark</td>
                    <td className="px-4 py-3">4 meses</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      <Link href="/marketing-digital-salud-chile" className="text-blue-600 hover:underline">Salud</Link>
                    </td>
                    <td className="px-4 py-3">Google Ads + Landing</td>
                    <td className="px-4 py-3">ROAS 4.2x en captacion de pacientes</td>
                    <td className="px-4 py-3">6 meses</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="px-4 py-3 font-medium">
                      <Link href="/marketing-digital-saas-chile" className="text-blue-600 hover:underline">SaaS</Link>
                    </td>
                    <td className="px-4 py-3">Google + LinkedIn Ads</td>
                    <td className="px-4 py-3">+340% leads calificados MoM</td>
                    <td className="px-4 py-3">3 meses</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3 font-medium">Transporte</td>
                    <td className="px-4 py-3">Meta Ads + Google Display</td>
                    <td className="px-4 py-3">CPL bajo $3.500 en zona centro-sur</td>
                    <td className="px-4 py-3">5 meses</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">
                      <Link href="/marketing-digital-educacion-chile" className="text-blue-600 hover:underline">Educacion</Link>
                    </td>
                    <td className="px-4 py-3">Meta Ads + Performance Max</td>
                    <td className="px-4 py-3">ROAS 3.8x en matriculas online</td>
                    <td className="px-4 py-3">4 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Los resultados varian segun industria, presupuesto y condiciones de mercado. Cifras basadas en datos
              reales de campanas gestionadas por M&P entre 2024 y 2026.
            </p>
          </section>

          {/* ============================================================ */}
          {/* 10. COMPARATIVA M&P VS OTRAS AGENCIAS */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Comparativa: M&P vs Otras Agencias de Marketing Digital en Chile
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              No todas las agencias de marketing digital entregan el mismo nivel de servicio.
              Esta comparativa te ayuda a evaluar que esperar al contratar una agencia profesional
              versus lo que ofrece el promedio del mercado chileno:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-3 rounded-tl-lg font-semibold">Criterio</th>
                    <th className="px-4 py-3 font-semibold text-center">Muller y Perez</th>
                    <th className="px-4 py-3 rounded-tr-lg font-semibold text-center">Agencia Promedio</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="px-4 py-3 font-medium">Equipo dedicado por cliente</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">3 profesionales exclusivos</td>
                    <td className="px-4 py-3 text-center text-gray-500">1 ejecutivo compartido (10+ cuentas)</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3 font-medium">Acceso a cuentas publicitarias</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">100% del cliente</td>
                    <td className="px-4 py-3 text-center text-gray-500">Cuentas de la agencia</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="px-4 py-3 font-medium">Modelo de cobro</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">Fee fijo, sin markup</td>
                    <td className="px-4 py-3 text-center text-gray-500">15-25% sobre pauta</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3 font-medium">Herramientas propias</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">6 herramientas propietarias</td>
                    <td className="px-4 py-3 text-center text-gray-500">Solo herramientas de terceros</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="px-4 py-3 font-medium">Frecuencia de reporteria</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">Semanal + dashboard 24/7</td>
                    <td className="px-4 py-3 text-center text-gray-500">Mensual (PDF basico)</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3 font-medium">Contrato de permanencia</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">Sin contrato, mes a mes</td>
                    <td className="px-4 py-3 text-center text-gray-500">6-12 meses obligatorio</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">Benchmarks por industria</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">Datos propios de 50+ industrias</td>
                    <td className="px-4 py-3 text-center text-gray-500">Estimaciones genericas</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center mt-6">
              <Link href="/comparativa/muller-perez-vs-agencias-chile" className="text-blue-600 hover:underline font-semibold">
                Ver comparativa detallada completa
              </Link>
            </p>
          </section>

          {/* ============================================================ */}
          {/* 11. HERRAMIENTAS PROPIAS */}
          {/* ============================================================ */}
          <section className="mb-16 bg-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Herramientas Propias que Nos Diferencian
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Mientras la mayoria de las agencias de marketing digital en Chile depende de herramientas
              de terceros, en Muller y Perez desarrollamos tecnologia propia que nos da una ventaja
              competitiva real sobre el mercado:
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href="/labs/predictor" className="hover:text-blue-600 transition">Predictor de Campanas</Link>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Estima tu CPC, CPA y presupuesto optimo antes de invertir, usando datos reales de mas de 1.200 keywords
                  del mercado chileno. Permite tomar decisiones informadas y reducir el riesgo de campanas nuevas.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href="/indicadores" className="hover:text-blue-600 transition">Termometro Marketing Digital Chile</Link>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Indicadores semanales del mercado digital chileno: tipo de cambio USD/CLP, CPC promedio por industria
                  y CPA estimado. Se actualiza automaticamente cada semana con datos del mercado en tiempo real.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Buyer Gen</h3>
                <p className="text-gray-700 leading-relaxed">
                  Motor de inteligencia artificial que genera segmentaciones de audiencia optimizadas para cada industria,
                  combinando datos demograficos, intereses y comportamiento de compra del mercado chileno.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href="/utilidades" className="hover:text-blue-600 transition">Radar de Industrias</Link>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Base de datos propia con benchmarks de CPC, CVR, CPA y ROAS para mas de 50 industrias en Chile.
                  Permite calibrar expectativas y configurar campanas con metas realistas desde el primer dia.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">MP Intelligence</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sistema de monitoreo automatico de competidores en Instagram, LinkedIn y Facebook. Detecta
                  publicaciones, ofertas laborales y movimientos estrategicos de la competencia de cada cliente,
                  entregando alertas diarias por email con analisis consolidado.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 12. COBERTURA NACIONAL */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Cobertura Nacional: Servicios de Marketing Digital en Todo Chile
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Nuestras oficinas centrales estan en <Link href="/agencia-marketing-digital-las-condes" className="text-blue-600 hover:underline">Las Condes, Santiago</Link>,
              pero atendemos empresas de todo Chile con el mismo nivel de servicio. Toda nuestra operacion
              es 100% digital: dashboards en tiempo real, reuniones por videollamada y reporteria online.
              No importa donde estes, tu equipo dedicado trabaja como si estuviera en la oficina de al lado.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Link href="/agencia-marketing-digital-santiago" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Santiago</p>
              </Link>
              <Link href="/agencia-marketing-digital-valparaiso" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Valparaiso</p>
              </Link>
              <Link href="/agencia-marketing-digital-concepcion" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Concepcion</p>
              </Link>
              <Link href="/agencia-marketing-digital-antofagasta" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Antofagasta</p>
              </Link>
              <Link href="/agencia-marketing-digital-temuco" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Temuco</p>
              </Link>
              <Link href="/agencia-marketing-digital-la-serena" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">La Serena</p>
              </Link>
              <Link href="/agencia-marketing-digital-puerto-montt" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Puerto Montt</p>
              </Link>
              <Link href="/agencia-marketing-digital-vina-del-mar" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Vina del Mar</p>
              </Link>
              <Link href="/agencia-marketing-digital-rancagua" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Rancagua</p>
              </Link>
              <Link href="/agencia-marketing-digital-talca" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Talca</p>
              </Link>
              <Link href="/agencia-marketing-digital-iquique" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Iquique</p>
              </Link>
              <Link href="/agencia-marketing-digital-vitacura" className="bg-gray-50 hover:bg-blue-50 rounded-lg p-3 text-center transition group">
                <p className="text-gray-900 font-medium group-hover:text-blue-600 text-sm">Vitacura</p>
              </Link>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <p className="text-gray-800 leading-relaxed">
                <strong>Atencion regional con estandar Santiago:</strong> cada cliente regional recibe el mismo equipo
                dedicado de 3 profesionales, acceso al dashboard en tiempo real y reporteria semanal que nuestros
                clientes de la capital. La distancia no afecta la calidad del servicio.
              </p>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 13. FAQ */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre Agencias de Marketing Digital en Chile
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 14. CTA FINAL */}
          {/* ============================================================ */}
          <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-12 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Agenda una Reunión con Nuestro Equipo
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              30 minutos para conocer tu negocio, analizar tu situación actual y mostrarte cómo el performance
              marketing con datos reales puede transformar tus resultados. Sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Agendar Reunión Gratis
              </Link>
              <Link
                href="/labs/predictor"
                className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
              >
                Probar el Predictor de Campañas
              </Link>
            </div>
          </section>

          {/* ============================================================ */}
          {/* INTERNAL LINKS FOOTER */}
          {/* ============================================================ */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recursos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link href="/ranking-agencias-marketing-digital-chile" className="text-blue-600 hover:underline text-sm">
                Ranking Agencias Marketing Digital Chile 2026
              </Link>
              <Link href="/precios-agencia-marketing-digital-chile" className="text-blue-600 hover:underline text-sm">
                Precios de Agencias de Marketing Digital en Chile
              </Link>
              <Link href="/labs/predictor" className="text-blue-600 hover:underline text-sm">
                Predictor de Campañas (herramienta gratuita)
              </Link>
              <Link href="/indicadores" className="text-blue-600 hover:underline text-sm">
                Termómetro Marketing Digital Chile
              </Link>
              <Link href="/servicios" className="text-blue-600 hover:underline text-sm">
                Servicios de Marketing Digital
              </Link>
              <Link href="/blog" className="text-blue-600 hover:underline text-sm">
                Blog de Marketing Digital
              </Link>
              <Link href="/utilidades" className="text-blue-600 hover:underline text-sm">
                Herramientas Gratuitas de Marketing
              </Link>
              <Link href="/comparativa/muller-perez-vs-agencias-chile" className="text-blue-600 hover:underline text-sm">
                M&P vs Otras Agencias en Chile
              </Link>
            </div>
          </section>
        </article>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400 mb-4">
              © 2026 Muller y Pérez — Agencia de Marketing Digital en Chile | Todos los derechos reservados
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <Link href="/planes" className="hover:text-white transition">Planes</Link>
              <Link href="/servicios" className="hover:text-white transition">Servicios</Link>
              <Link href="/#contact" className="hover:text-white transition">Contacto</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
