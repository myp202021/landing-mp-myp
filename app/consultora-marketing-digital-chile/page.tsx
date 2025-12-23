/**
 * Página Pilar SEO: Consultoría Marketing Digital Chile
 * Optimizada para rankear en Google con keywords de consultoría estratégica
 * +2500 palabras de contenido SEO-optimizado enfocado en consultoría
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createWebPageSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
  createServiceSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Consultoría Marketing Digital Chile | Estrategia, Auditoría y Capacitación',
  description: 'Consultoría de marketing digital en Chile. Auditorías especializadas, planes estratégicos, capacitación a equipos internos y acompañamiento consultivo. Desde $890.000/mes.',
  keywords: [
    'consultora marketing digital chile',
    'consultoria marketing digital chile',
    'asesoria marketing digital chile',
    'consultora marketing digital',
    'consultoria marketing digital',
    'auditoria marketing digital chile',
    'estrategia marketing digital chile',
    'capacitacion marketing digital',
    'consultora seo chile',
    'consultoria google ads chile'
  ],
  path: '/consultora-marketing-digital-chile'
})

export default function ConsultoraMarketingDigitalChilePage() {
  // Schema markup
  const webPageSchema = createWebPageSchema(
    'Consultoría Marketing Digital Chile | Muller y Pérez',
    'Consultoría especializada en marketing digital para empresas en Chile. Auditorías, planes estratégicos, capacitación y acompañamiento consultivo con resultados medibles',
    'https://www.mulleryperez.cl/consultora-marketing-digital-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Consultoría Marketing Digital Chile', url: 'https://www.mulleryperez.cl/consultora-marketing-digital-chile' }
  ])

  const serviceSchema = createServiceSchema(
    'Consultoría de Marketing Digital',
    'Servicios de consultoría especializada en marketing digital: auditorías estratégicas, planes de optimización, capacitación a equipos internos y acompañamiento consultivo para empresas en Chile.',
    'https://www.mulleryperez.cl/consultora-marketing-digital-chile'
  )

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Qué es una consultoría de marketing digital en Chile?',
      answer: 'Una consultoría de marketing digital en Chile es un servicio especializado que se enfoca en el diagnóstico estratégico, auditoría de campañas, desarrollo de planes de marketing y capacitación de equipos internos. A diferencia de una agencia que ejecuta campañas, una consultora analiza, diseña estrategias y transfiere conocimiento para que tu empresa optimice sus resultados digitales.'
    },
    {
      question: '¿Cuál es la diferencia entre una consultoría y una agencia de marketing digital?',
      answer: 'La principal diferencia es el enfoque: una agencia de marketing digital ejecuta y gestiona tus campañas publicitarias día a día, mientras que una consultoría se enfoca en la estrategia, auditoría, diagnóstico y capacitación. La consultoría te ayuda a entender QUÉ hacer y POR QUÉ, mientras que la agencia se enfoca en CÓMO ejecutarlo. Muchas empresas contratan ambos servicios: consultoría para la estrategia y agencia para la ejecución.'
    },
    {
      question: '¿Cuánto cuesta una consultoría de marketing digital en Chile en 2025?',
      answer: 'El costo de una consultoría de marketing digital en Chile varía según el alcance. En M&P ofrecemos: Auditoría Estratégica (one-time) desde $890.000, Acompañamiento Mensual desde $1.200.000/mes, y Capacitación In-Company desde $1.500.000. Los proyectos incluyen análisis profundo, entregables estratégicos y transferencia de conocimiento real.'
    },
    {
      question: '¿Qué incluye una auditoría de marketing digital?',
      answer: 'Una auditoría completa de marketing digital incluye: análisis de Google Ads (estructura, keywords, pujas, calidad), Meta Ads (audiencias, creatividades, conversiones), Google Analytics 4 (configuración, eventos, embudos), SEO técnico y de contenido, análisis de competencia, evaluación de tracking y medición, y un plan de acción priorizado con quick wins y oportunidades de optimización.'
    },
    {
      question: '¿Para qué empresas es recomendable contratar una consultoría de marketing digital?',
      answer: 'La consultoría de marketing digital es ideal para: empresas que ya invierten $2M+/mes en publicidad y necesitan optimización estratégica, equipos de marketing internos que necesitan capacitación y dirección, empresas que quieren auditar el trabajo de su agencia actual, negocios que buscan implementar marketing digital desde cero con bases sólidas, y organizaciones que priorizan la transferencia de conocimiento sobre la dependencia de proveedores externos.'
    },
    {
      question: '¿Cuánto tiempo dura un proyecto de consultoría de marketing digital?',
      answer: 'Depende del tipo de servicio: una Auditoría Estratégica se entrega en 2-3 semanas, un Plan Estratégico completo toma 4-6 semanas, la Capacitación In-Company varía entre 8-12 semanas según módulos, y el Acompañamiento Consultivo Mensual es un servicio continuo que generalmente se contrata por mínimo 6 meses para ver resultados sostenibles.'
    },
    {
      question: '¿Qué entregables recibo en una consultoría de marketing digital?',
      answer: 'Los entregables varían según el servicio, pero generalmente incluyen: documento de auditoría completa (30-50 páginas), análisis FODA de tu estrategia digital actual, benchmarking de competencia, plan estratégico priorizado con roadmap de implementación, documentación de procesos y mejores prácticas, presentación ejecutiva con hallazgos clave, acceso a grabaciones de sesiones de trabajo, y soporte post-entrega para resolver dudas de implementación.'
    },
    {
      question: '¿Puedo contratar consultoría y que ustedes también ejecuten las campañas?',
      answer: 'Sí, absolutamente. De hecho, es uno de los modelos más efectivos. Muchas empresas comienzan con nuestra consultoría para tener un diagnóstico y estrategia clara, y luego contratan nuestros servicios de agencia para la ejecución. Este modelo híbrido combina pensamiento estratégico con implementación táctica, asegurando que la estrategia se ejecute correctamente. Ofrecemos descuentos especiales para clientes que contratan ambos servicios.'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-purple-200 hover:text-white transition">
                Inicio
              </Link>
              <span className="mx-2 text-purple-300">/</span>
              <span className="text-white font-semibold">Consultoría Marketing Digital Chile</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Consultoría de Marketing Digital en Chile:<br />
              Estrategia, Auditoría y Transferencia de Conocimiento
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Somos una <strong>consultoría de marketing digital en Chile</strong> especializada en <strong>auditorías estratégicas</strong>,
              diagnóstico de campañas, capacitación de equipos internos y acompañamiento consultivo. No solo ejecutamos,
              te enseñamos cómo optimizar tus resultados digitales con estrategia basada en datos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center text-lg"
              >
                Solicitar Auditoría Gratuita
              </Link>
              <Link
                href="#servicios"
                className="px-8 py-4 bg-white text-purple-900 rounded-lg hover:bg-purple-50 transition font-semibold text-center text-lg"
              >
                Ver Servicios de Consultoría
              </Link>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-4xl py-16">
          {/* Introducción */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Qué es una Consultoría de Marketing Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Una <strong>consultoría de marketing digital en Chile</strong> es un servicio especializado que va más allá de la
              ejecución táctica de campañas. Mientras una agencia se enfoca en gestionar tus Google Ads, Meta Ads o LinkedIn Ads
              día a día, una <strong>consultoría se enfoca en el pensamiento estratégico</strong>, el diagnóstico profundo y la
              transferencia de conocimiento.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              En <strong>Muller y Pérez</strong>, nuestra <strong>consultoría de marketing digital</strong> se diferencia por
              tres pilares fundamentales:
            </p>
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🔍</span>
                  <div>
                    <strong>Diagnóstico Estratégico:</strong> Analizamos en profundidad tus campañas actuales, identificamos
                    ineficiencias y oportunidades que están costándote dinero, y te entregamos un roadmap claro de optimización.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">📚</span>
                  <div>
                    <strong>Transferencia de Conocimiento:</strong> No creamos dependencia. Te enseñamos cómo funciona el
                    marketing digital de alto rendimiento para que tu equipo interno pueda tomar decisiones informadas.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <strong>Estrategia Basada en Datos:</strong> Cada recomendación está respaldada por análisis cuantitativo.
                    Te decimos exactamente QUÉ optimizar, POR QUÉ optimizarlo y CUÁNTO impacto tendrá.
                  </div>
                </li>
              </ul>
            </div>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              La <strong>consultoría de marketing digital</strong> es ideal para empresas que ya tienen presencia digital pero
              necesitan optimizar su estrategia, empresas que quieren auditar el trabajo de su agencia actual, o equipos internos
              que necesitan capacitación especializada en <strong>Google Ads, Meta Ads, Analytics o SEO</strong>.
            </p>
          </section>

          {/* Diferencia Consultoría vs Agencia */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Consultoría vs Agencia de Marketing Digital: ¿Cuál Necesitas?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Esta es una de las preguntas más frecuentes al buscar <strong>servicios de marketing digital en Chile</strong>.
              La respuesta depende de tu situación actual:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">
                  Consultoría de Marketing Digital
                </h3>
                <p className="text-gray-700 mb-4 font-semibold">Ideal si necesitas:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Auditar campañas existentes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Desarrollar estrategia digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Capacitar equipo interno</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Optimizar presupuestos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Revisar trabajo de tu agencia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Transferencia de conocimiento</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Enfoque:</strong> Pensamiento estratégico, diagnóstico, capacitación y consultoría especializada
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  Agencia de Marketing Digital
                </h3>
                <p className="text-gray-700 mb-4 font-semibold">Ideal si necesitas:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Gestión diaria de campañas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Ejecución táctica continua</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Creación de contenido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Optimización permanente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Reportería y análisis semanal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Equipo dedicado full-time</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Enfoque:</strong> Ejecución operativa, gestión continua y optimización táctica
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                El Modelo Ideal: Consultoría + Agencia
              </p>
              <p className="text-gray-700 leading-relaxed">
                Muchas empresas líderes combinan ambos servicios: contratan <strong>consultoría estratégica</strong> para
                desarrollar el plan maestro, identificar oportunidades y auditar resultados, y contratan una <strong>agencia
                de marketing digital</strong> para la ejecución diaria. Este modelo híbrido asegura que la estrategia se ejecute
                correctamente. En M&P ofrecemos ambos servicios con descuentos especiales para clientes que contratan el paquete completo.
              </p>
            </div>
          </section>

          {/* Servicios de Consultoría */}
          <section id="servicios" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Servicios de Consultoría de Marketing Digital en Chile
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Nuestra <strong>consultoría de marketing digital</strong> ofrece servicios especializados adaptados a las
              necesidades de empresas chilenas:
            </p>

            <div className="space-y-6">
              {/* Servicio 1 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    1. Auditoría Estratégica de Marketing Digital
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                    Desde $890.000
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Un análisis completo y profundo de tu ecosistema digital actual para identificar ineficiencias,
                  oportunidades perdidas y quick wins que generan ROI inmediato.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">La auditoría incluye:</h4>
                  <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Análisis completo de Google Ads (estructura, keywords, pujas, Quality Score)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Auditoría de Meta Ads (audiencias, creatividades, píxel, conversiones)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Revisión de Google Analytics 4 y configuración de tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Análisis SEO técnico y de contenido</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Benchmarking de competencia digital</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Evaluación de funnel de conversión y UX</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Análisis de asignación de presupuesto publicitario</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Identificación de desperdicios y oportunidades de ahorro</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Entregable:</strong> Documento de auditoría de 30-50 páginas con hallazgos priorizados,
                    roadmap de implementación y proyección de impacto. Presentación ejecutiva incluida.
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Duración:</strong> 2-3 semanas desde inicio hasta entrega final.
                  </p>
                </div>
              </div>

              {/* Servicio 2 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    2. Plan Estratégico de Marketing Digital 360°
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                    Desde $1.500.000
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Desarrollo de un plan maestro de marketing digital para 6-12 meses, diseñado específicamente para
                  tus objetivos de negocio, mercado y competencia en Chile.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">El plan estratégico incluye:</h4>
                  <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Diagnóstico completo de situación actual (auditoría incluida)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Definición de objetivos SMART y KPIs por canal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Estrategia de segmentación y buyer personas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Mix de medios y asignación de presupuesto optimizada</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Estrategia de contenido y mensajes clave</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Plan de implementación con timeline y priorización</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Framework de medición y reportería</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Proyección de inversión y retorno esperado por canal</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Entregable:</strong> Plan estratégico completo (50-80 páginas), roadmap visual,
                    templates de implementación y 2 sesiones de trabajo con tu equipo.
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Duración:</strong> 4-6 semanas con sesiones de co-creación incluidas.
                  </p>
                </div>
              </div>

              {/* Servicio 3 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    3. Capacitación In-Company de Marketing Digital
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                    Desde $1.500.000
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Programa de capacitación especializada para equipos de marketing internos en Google Ads, Meta Ads,
                  Analytics, SEO o estrategia digital, adaptado al nivel de tu equipo.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Módulos de capacitación disponibles:</h4>
                  <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Google Ads Avanzado (Search, Shopping, Performance Max)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Meta Ads Performance (Facebook & Instagram Ads)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Google Analytics 4 y medición avanzada</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>LinkedIn Ads para B2B</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>SEO estratégico y contenido</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Optimización de conversiones (CRO)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Performance Marketing y análisis de datos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Estrategia digital para gerentes</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Formato:</strong> Sesiones de 3-4 horas, modalidad presencial u online, con casos
                    prácticos aplicados a tu empresa. Incluye material didáctico y certificado.
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Duración:</strong> 8-12 semanas según módulos contratados (generalmente 1 sesión/semana).
                  </p>
                </div>
              </div>

              {/* Servicio 4 */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    4. Acompañamiento Consultivo Mensual
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                    Desde $1.200.000/mes
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Servicio de consultoría continua donde actuamos como tu CMO externo o asesor estratégico mensual,
                  guiando decisiones, revisando resultados y optimizando estrategia de forma permanente.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">El acompañamiento incluye:</h4>
                  <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>2 sesiones estratégicas mensuales (2 horas cada una)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Revisión y análisis de campañas activas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Optimización de presupuestos y asignación</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Auditoría mensual de performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Recomendaciones estratégicas priorizadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Acceso a consultas por email/Slack ilimitado</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Revisión de trabajo de agencias o freelancers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Reportes mensuales con insights accionables</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Ideal para:</strong> Empresas con equipo interno o agencia que necesitan dirección
                    estratégica senior, supervisión de proveedores externos o mentoría continua.
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Compromiso mínimo:</strong> 6 meses (recomendado 12 meses para resultados sostenibles).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Proceso de Consultoría */}
          <section className="mb-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Proceso de Trabajo de Nuestra Consultoría de Marketing Digital
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Nuestra metodología de <strong>consultoría de marketing digital</strong> sigue un proceso estructurado
              y basado en datos:
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Diagnóstico y Discovery
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Comenzamos con una sesión profunda de discovery donde entendemos tu negocio, objetivos, desafíos
                      actuales y situación digital. Solicitamos acceso a tus cuentas (Google Ads, Meta Ads, Analytics)
                      para realizar un análisis cuantitativo inicial. Esta fase nos permite identificar las áreas críticas
                      de oportunidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Análisis Profundo y Auditoría
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Realizamos un análisis exhaustivo de todas tus campañas, canales y estrategias digitales actuales.
                      Evaluamos estructura de campañas, segmentación, creatividades, landing pages, tracking, asignación
                      de presupuesto y competencia. Identificamos desperdicios, oportunidades de quick wins y gaps estratégicos.
                      Esta fase toma 1-2 semanas dependiendo de la complejidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Desarrollo de Estrategia y Recomendaciones
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Basados en el análisis, desarrollamos un plan estratégico con recomendaciones priorizadas según
                      impacto esperado y esfuerzo de implementación. Cada recomendación incluye el racional estratégico,
                      pasos de implementación, recursos necesarios y proyección de impacto en métricas clave (conversiones,
                      CAC, ROAS). Priorizamos quick wins que generan resultados rápidos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Presentación y Transferencia de Conocimiento
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Presentamos los hallazgos, estrategia y plan de acción en una sesión ejecutiva (generalmente 2-3 horas).
                      No solo entregamos un documento, explicamos el racional detrás de cada recomendación para que tu equipo
                      entienda el "por qué". Esta transferencia de conocimiento es clave para que puedan tomar decisiones
                      informadas a futuro. Incluye Q&A y discusión estratégica.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Soporte en Implementación (Opcional)
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Ofrecemos soporte post-consultoría para resolver dudas durante la implementación. Esto puede ser
                      revisiones puntuales, sesiones de seguimiento o acompañamiento mensual continuo. Muchos clientes
                      contratan nuestro servicio de <strong>acompañamiento consultivo mensual</strong> para tener un
                      consultor estratégico permanente que guíe la ejecución del plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Por qué elegirnos */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Elegir a Muller y Pérez Como Tu Consultoría de Marketing Digital?
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  1. Experiencia Comprobada en Performance Marketing
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  No somos teóricos. Somos consultores que gestionan +$100M anuales en pauta digital para nuestros
                  clientes de agencia. Esto significa que nuestras recomendaciones están basadas en experiencia real
                  de optimización, no en teoría de libro. Sabemos qué funciona en el mercado chileno porque lo ejecutamos
                  diariamente para empresas reales.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  2. Enfoque 100% Basado en Datos, No en Opiniones
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Cada recomendación de nuestra <strong>consultoría de marketing digital</strong> está respaldada por
                  análisis cuantitativo. No te decimos "creemos que deberías...", te decimos "los datos muestran que
                  optimizando X puedes reducir tu CAC en Y% basado en Z evidencia". Este rigor analítico es lo que
                  diferencia una consultoría profesional de asesoría genérica.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  3. Transferencia Real de Conocimiento
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nuestra filosofía es empoderar a tu equipo, no crear dependencia. Por eso incluimos sesiones de trabajo,
                  explicamos el racional estratégico y te damos frameworks que puedes replicar. Queremos que después de
                  trabajar con nosotros, tu equipo sea más competente y autónomo en <strong>marketing digital</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  4. Conocimiento Profundo del Mercado Chileno
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Trabajamos exclusivamente con empresas en Chile desde 2019. Conocemos la competencia local, comportamiento
                  del consumidor chileno, estacionalidades del mercado, regulaciones específicas y mejores prácticas que
                  funcionan en Santiago, Valparaíso, Concepción y todo Chile. No aplicamos recetas internacionales genéricas.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  5. Flexibilidad: Consultoría Pura o Modelo Híbrido
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Entendemos que cada empresa tiene necesidades diferentes. Puedes contratar solo <strong>consultoría
                  estratégica</strong> si tienes equipo interno, solo servicios de <strong>agencia</strong> si necesitas
                  ejecución, o ambos en un modelo híbrido (consultoría + ejecución). Somos agnósticos al modelo, nos
                  adaptamos a tu situación y presupuesto.
                </p>
              </div>
            </div>
          </section>

          {/* Casos de uso */}
          <section className="mb-16 bg-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Para Quién es Ideal una Consultoría de Marketing Digital?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Empresas con Equipo Interno
                </h3>
                <p className="text-gray-700 mb-3">
                  Tienes un equipo de marketing interno que gestiona campañas pero necesitan:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Dirección estratégica senior</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Capacitación especializada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Auditoría externa de su trabajo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Mentoring y upskilling continuo</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Empresas con Agencia Actual
                </h3>
                <p className="text-gray-700 mb-3">
                  Ya trabajas con una agencia pero necesitas:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Auditar el trabajo de tu agencia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Segunda opinión experta</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Supervisión estratégica independiente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Validar que estés obteniendo valor</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Empresas con Alta Inversión
                </h3>
                <p className="text-gray-700 mb-3">
                  Inviertes $3M+/mes en publicidad digital y necesitas:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Optimización de presupuesto significativa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Estrategia de asignación por canal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Identificar desperdicios y oportunidades</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Mejorar ROI y eficiencia de gasto</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Startups y Scale-ups
                </h3>
                <p className="text-gray-700 mb-3">
                  Estás escalando rápido y necesitas:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Bases sólidas de marketing digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Estrategia de go-to-market digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Mentoría de CMO sin contrato full-time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Frameworks escalables de medición</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes Sobre Consultoría de Marketing Digital en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Qué es una consultoría de marketing digital en Chile?',
                  a: 'Una consultoría de marketing digital en Chile es un servicio especializado que se enfoca en el diagnóstico estratégico, auditoría de campañas, desarrollo de planes de marketing y capacitación de equipos internos. A diferencia de una agencia que ejecuta campañas, una consultora analiza, diseña estrategias y transfiere conocimiento para que tu empresa optimice sus resultados digitales.'
                },
                {
                  q: '¿Cuál es la diferencia entre una consultoría y una agencia de marketing digital?',
                  a: 'La principal diferencia es el enfoque: una agencia de marketing digital ejecuta y gestiona tus campañas publicitarias día a día, mientras que una consultoría se enfoca en la estrategia, auditoría, diagnóstico y capacitación. La consultoría te ayuda a entender QUÉ hacer y POR QUÉ, mientras que la agencia se enfoca en CÓMO ejecutarlo. Muchas empresas contratan ambos servicios: consultoría para la estrategia y agencia para la ejecución.'
                },
                {
                  q: '¿Cuánto cuesta una consultoría de marketing digital en Chile en 2025?',
                  a: 'El costo de una consultoría de marketing digital en Chile varía según el alcance. En M&P ofrecemos: Auditoría Estratégica (one-time) desde $890.000, Acompañamiento Mensual desde $1.200.000/mes, y Capacitación In-Company desde $1.500.000. Los proyectos incluyen análisis profundo, entregables estratégicos y transferencia de conocimiento real.'
                },
                {
                  q: '¿Qué incluye una auditoría de marketing digital?',
                  a: 'Una auditoría completa de marketing digital incluye: análisis de Google Ads (estructura, keywords, pujas, calidad), Meta Ads (audiencias, creatividades, conversiones), Google Analytics 4 (configuración, eventos, embudos), SEO técnico y de contenido, análisis de competencia, evaluación de tracking y medición, y un plan de acción priorizado con quick wins y oportunidades de optimización.'
                },
                {
                  q: '¿Para qué empresas es recomendable contratar una consultoría de marketing digital?',
                  a: 'La consultoría de marketing digital es ideal para: empresas que ya invierten $2M+/mes en publicidad y necesitan optimización estratégica, equipos de marketing internos que necesitan capacitación y dirección, empresas que quieren auditar el trabajo de su agencia actual, negocios que buscan implementar marketing digital desde cero con bases sólidas, y organizaciones que priorizan la transferencia de conocimiento sobre la dependencia de proveedores externos.'
                },
                {
                  q: '¿Cuánto tiempo dura un proyecto de consultoría de marketing digital?',
                  a: 'Depende del tipo de servicio: una Auditoría Estratégica se entrega en 2-3 semanas, un Plan Estratégico completo toma 4-6 semanas, la Capacitación In-Company varía entre 8-12 semanas según módulos, y el Acompañamiento Consultivo Mensual es un servicio continuo que generalmente se contrata por mínimo 6 meses para ver resultados sostenibles.'
                },
                {
                  q: '¿Qué entregables recibo en una consultoría de marketing digital?',
                  a: 'Los entregables varían según el servicio, pero generalmente incluyen: documento de auditoría completa (30-50 páginas), análisis FODA de tu estrategia digital actual, benchmarking de competencia, plan estratégico priorizado con roadmap de implementación, documentación de procesos y mejores prácticas, presentación ejecutiva con hallazgos clave, acceso a grabaciones de sesiones de trabajo, y soporte post-entrega para resolver dudas de implementación.'
                },
                {
                  q: '¿Puedo contratar consultoría y que ustedes también ejecuten las campañas?',
                  a: 'Sí, absolutamente. De hecho, es uno de los modelos más efectivos. Muchas empresas comienzan con nuestra consultoría para tener un diagnóstico y estrategia clara, y luego contratan nuestros servicios de agencia para la ejecución. Este modelo híbrido combina pensamiento estratégico con implementación táctica, asegurando que la estrategia se ejecute correctamente. Ofrecemos descuentos especiales para clientes que contratan ambos servicios.'
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
          <section className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Optimizar Tu Estrategia de Marketing Digital?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Agenda una sesión diagnóstica gratuita de 45 minutos. Revisaremos tu situación actual,
              identificaremos oportunidades de optimización y te daremos un análisis inicial sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Solicitar Auditoría Gratuita
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
              © 2025 Muller y Pérez - Consultoría de Marketing Digital Chile | Todos los derechos reservados
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <Link href="/agencia-marketing-digital-chile" className="hover:text-white transition">Agencia</Link>
              <Link href="/#contact" className="hover:text-white transition">Contacto</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
