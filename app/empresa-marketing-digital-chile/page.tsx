/**
 * Página SEO: Empresa Marketing Digital Chile
 * Optimizada para rankear #1 en Chile con keywords de empresa
 * Enfoque corporativo: experiencia, equipo profesional, infraestructura
 * +2500 palabras de contenido SEO-optimizado original
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createWebPageSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
  createOrganizationSchema,
  createServiceSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Empresa Marketing Digital Chile | Líderes en Performance y Resultados',
  description: 'Empresa de marketing digital establecida en Chile desde 2020. Equipo profesional especializado, infraestructura propia y casos de éxito corporativos. Desde $590.000/mes.',
  keywords: [
    'empresa marketing digital chile',
    'empresa publicidad digital chile',
    'compañia marketing digital chile',
    'empresa marketing digital santiago',
    'empresa performance marketing chile',
    'mejor empresa marketing digital chile',
    'empresa marketing digital establecida',
    'empresa marketing digital corporativa',
    'empresa google ads chile',
    'empresa meta ads chile'
  ],
  path: '/empresa-marketing-digital-chile'
})

export default function EmpresaMarketingDigitalChilePage() {
  // Schema markup para SEO avanzado
  const webPageSchema = createWebPageSchema(
    'Empresa Marketing Digital Chile | Muller y Pérez',
    'Empresa de marketing digital establecida en Chile con equipo profesional especializado, infraestructura propia y casos de éxito corporativos comprobados',
    'https://www.mulleryperez.cl/empresa-marketing-digital-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Empresa Marketing Digital Chile', url: 'https://www.mulleryperez.cl/empresa-marketing-digital-chile' }
  ])

  const organizationSchema = createOrganizationSchema()

  const serviceSchema = createServiceSchema({
    name: 'Servicios de Marketing Digital Corporativo',
    description: 'Servicios profesionales de marketing digital para empresas establecidas en Chile: Google Ads, Meta Ads, LinkedIn Ads, analytics avanzado y estrategia digital integral',
    serviceType: 'Marketing Digital Corporativo',
    price: '980000'
  })

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Qué diferencia a una empresa de marketing digital de una agencia pequeña?',
      answer: 'Una empresa de marketing digital establecida como Muller y Pérez se diferencia por su infraestructura profesional, equipo especializado de tiempo completo, procesos estandarizados, tecnología propia, casos de éxito corporativos comprobados y respaldo financiero. A diferencia de agencias pequeñas o freelancers, una empresa puede garantizar continuidad, escalabilidad y resultados consistentes.'
    },
    {
      question: '¿Cuánto cuesta contratar una empresa de marketing digital en Chile?',
      answer: 'Los servicios de una empresa de marketing digital profesional en Chile oscilan entre $590.000 y $2.500.000+ mensuales según el nivel de servicio. En Muller y Pérez ofrecemos: Plan Corporativo Starter ($590k), Plan Business Growth ($980k), Plan Enterprise ($1.8M) y Plan Custom ($2.5M+). Todos incluyen equipo dedicado, infraestructura tecnológica y reportería ejecutiva.'
    },
    {
      question: '¿Qué ventajas tiene trabajar con una empresa establecida vs un freelancer?',
      answer: 'Una empresa de marketing digital establecida ofrece: equipo multidisciplinario completo (no una sola persona), continuidad del servicio (sin riesgo de que el freelancer se vaya), infraestructura tecnológica profesional, procesos documentados, respaldo legal y financiero, escalabilidad inmediata, casos de éxito comprobados y capacidad para manejar presupuestos grandes sin riesgo.'
    },
    {
      question: '¿Qué infraestructura tecnológica debe tener una empresa de marketing digital profesional?',
      answer: 'Una empresa de marketing digital profesional debe contar con: licencias empresariales de Google Ads y Meta Business Suite, herramientas de analytics avanzado (GA4, Tag Manager, Data Studio), plataformas de automatización, CRM integrado, herramientas de diseño profesionales (Adobe Suite), sistemas de gestión de proyectos, infraestructura de servidores y backup, y certificaciones oficiales de Google y Meta.'
    },
    {
      question: '¿Cómo verificar los casos de éxito de una empresa de marketing digital?',
      answer: 'Para verificar casos de éxito corporativos: solicita estudios de caso con datos reales (no testimonios genéricos), pide referencias verificables de empresas similares a la tuya, revisa certificaciones oficiales de plataformas (Google Partner, Meta Business Partner), consulta presencia digital de la empresa (su propio marketing), verifica tiempo en el mercado y experiencia comprobada, y solicita portfolio con resultados medibles y KPIs específicos.'
    },
    {
      question: '¿Qué equipo profesional debería tener una empresa de marketing digital?',
      answer: 'Una empresa de marketing digital profesional debe contar con equipo especializado de tiempo completo: Estrategas Digitales certificados, Especialistas en Google Ads y Meta Ads con certificaciones oficiales, Analistas de Datos y BI, Diseñadores Gráficos y de Contenido, Desarrolladores Web y de Landing Pages, Account Managers dedicados, y equipo de soporte técnico. En M&P, cada cliente tiene un equipo asignado de 3-5 profesionales según el plan.'
    },
    {
      question: '¿Cómo funciona el modelo de trabajo con una empresa de marketing digital corporativa?',
      answer: 'El modelo corporativo funciona así: 1) Kickoff inicial con análisis profundo de negocio y competencia, 2) Asignación de equipo dedicado con roles específicos, 3) Implementación de infraestructura tecnológica completa, 4) Ejecución de estrategia multi-canal coordinada, 5) Monitoreo en tiempo real con dashboards ejecutivos, 6) Reportería semanal con insights accionables, 7) Reuniones estratégicas mensuales con tu equipo ejecutivo, 8) Optimización continua basada en datos reales.'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
        {/* Hero Section Corporativo */}
        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-blue-300 hover:text-white transition">
                Inicio
              </Link>
              <span className="mx-2 text-blue-400">/</span>
              <span className="text-white font-semibold">Empresa Marketing Digital Chile</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  Empresa Establecida desde 2020
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Empresa de Marketing Digital en Chile
                </h1>
                <p className="text-2xl text-blue-100 mb-6 leading-relaxed">
                  Líderes en Performance Marketing Corporativo
                </p>
                <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                  Somos una <strong>empresa de marketing digital establecida en Chile</strong> con equipo profesional
                  especializado, infraestructura propia y casos de éxito corporativos comprobados. Trabajamos con empresas
                  que buscan resultados reales y medibles, no métricas de vanidad.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/#contact"
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center text-lg shadow-lg"
                  >
                    Solicitar Propuesta Corporativa
                  </Link>
                  <Link
                    href="/#pricing"
                    className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition font-semibold text-center text-lg"
                  >
                    Ver Planes desde $590k
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">¿Por qué elegir una empresa establecida?</h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 text-2xl">✓</span>
                    <span><strong>Equipo profesional</strong> de 15+ especialistas de tiempo completo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 text-2xl">✓</span>
                    <span><strong>Infraestructura propia</strong> con tecnología empresarial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 text-2xl">✓</span>
                    <span><strong>Casos de éxito</strong> con empresas +$50M en inversión publicitaria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 text-2xl">✓</span>
                    <span><strong>Continuidad garantizada</strong> sin dependencia de una sola persona</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3 text-2xl">✓</span>
                    <span><strong>Respaldo corporativo</strong> con contratos empresariales formales</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-5xl py-20">
          {/* Introducción Corporativa */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              ¿Qué es una Empresa de Marketing Digital en Chile?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Una <strong>empresa de marketing digital en Chile</strong> es una organización establecida, con estructura corporativa,
                equipo profesional especializado e infraestructura tecnológica propia, dedicada a diseñar, ejecutar y optimizar
                estrategias de marketing digital para empresas que buscan resultados medibles y escalables.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                A diferencia de agencias pequeñas o freelancers, una <strong>empresa de marketing digital corporativa</strong> como
                <strong> Muller y Pérez</strong> ofrece respaldo empresarial completo, continuidad del servicio, escalabilidad inmediata
                y capacidad para manejar presupuestos grandes sin riesgo operacional.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Como <strong>empresa de publicidad digital establecida desde 2020</strong>, nos especializamos en <strong>performance
                marketing corporativo</strong>, lo que significa que trabajamos exclusivamente con datos reales y resultados medibles,
                no con métricas de vanidad como impresiones o alcance.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nuestra Diferencia como Empresa de Marketing Digital
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Agencias pequeñas dicen:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>"Obtuviste 100,000 impresiones"</li>
                    <li>"Tu alcance fue de 50,000 personas"</li>
                    <li>"Tuviste 5,000 clicks"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-green-700">Nosotros te decimos:</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>✓ "Tu CPL fue $8,500 (costo por lead)"</li>
                    <li>✓ "Tu CAC fue $127,000 (costo de cliente nuevo)"</li>
                    <li>✓ "Tu ROAS fue 4.2x (retorno sobre inversión)"</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Infraestructura y Capacidades */}
          <section className="mb-20 bg-gray-50 rounded-3xl p-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Infraestructura Profesional de Nuestra Empresa
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Como <strong>empresa de marketing digital establecida</strong>, contamos con infraestructura tecnológica empresarial
              que garantiza resultados profesionales y continuidad del servicio:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏢</span>
                  Infraestructura Corporativa
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">▪</span>
                    <span>Oficinas corporativas en Santiago, Chile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">▪</span>
                    <span>Equipo de 15+ profesionales de tiempo completo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">▪</span>
                    <span>Infraestructura de servidores y backup empresarial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">▪</span>
                    <span>Contratos corporativos formales con SLA</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">▪</span>
                    <span>Respaldo financiero y seguro de responsabilidad</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💻</span>
                  Tecnología Empresarial
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">▪</span>
                    <span>Licencias empresariales Google Ads y Meta Business</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">▪</span>
                    <span>Plataformas de automatización y BI avanzado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">▪</span>
                    <span>Adobe Creative Suite completo para diseño</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">▪</span>
                    <span>CRM integrado y gestión de proyectos empresarial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">▪</span>
                    <span>Dashboards ejecutivos en tiempo real</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎓</span>
                  Certificaciones y Experticia
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">▪</span>
                    <span>Google Partner certificado oficial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">▪</span>
                    <span>Meta Business Partner reconocido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">▪</span>
                    <span>Equipo con certificaciones Google Ads avanzadas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">▪</span>
                    <span>Especialistas certificados en Analytics y GTM</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">▪</span>
                    <span>Formación continua en plataformas oficiales</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📊</span>
                  Casos de Éxito Corporativos
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">▪</span>
                    <span>+$50M gestionados en inversión publicitaria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">▪</span>
                    <span>Clientes con presupuestos de $5M+ mensuales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">▪</span>
                    <span>Empresas B2B y E-commerce de alto volumen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">▪</span>
                    <span>Resultados comprobados con estudios de caso</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">▪</span>
                    <span>Referencias verificables de clientes actuales</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Equipo Profesional */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Equipo Profesional Especializado
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Como <strong>empresa de marketing digital corporativa</strong>, contamos con un equipo multidisciplinario de
              profesionales especializados de tiempo completo. No somos freelancers ni una agencia de una sola persona.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
                <div className="text-4xl mb-4">👨‍💼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Estrategas Digitales
                </h3>
                <p className="text-gray-700 mb-4">
                  Profesionales senior con +5 años de experiencia en marketing digital corporativo. Certificados en Google y Meta.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Análisis de mercado y competencia</li>
                  <li>• Diseño de estrategia multi-canal</li>
                  <li>• Optimización de funnel completo</li>
                  <li>• Reporting ejecutivo y KPIs</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Especialistas en Pauta
                </h3>
                <p className="text-gray-700 mb-4">
                  Expertos dedicados en Google Ads, Meta Ads y LinkedIn Ads con certificaciones oficiales de cada plataforma.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gestión de Google Ads avanzado</li>
                  <li>• Campañas Meta Ads optimizadas</li>
                  <li>• LinkedIn Ads para B2B</li>
                  <li>• Optimización continua de CPL/CAC</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Analistas de Datos
                </h3>
                <p className="text-gray-700 mb-4">
                  Especialistas en Google Analytics 4, Tag Manager, Data Studio y análisis avanzado de datos de marketing.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Implementación GA4 y GTM</li>
                  <li>• Análisis de funnel y conversiones</li>
                  <li>• Dashboards ejecutivos personalizados</li>
                  <li>• Insights accionables semanales</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Diseñadores Creativos
                </h3>
                <p className="text-gray-700 mb-4">
                  Equipo de diseño gráfico y contenido especializado en creatividades publicitarias de alto rendimiento.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Diseño de ads para todas las plataformas</li>
                  <li>• Testing A/B de creatividades</li>
                  <li>• Video marketing y motion graphics</li>
                  <li>• Contenido optimizado para conversión</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Desarrolladores Web
                </h3>
                <p className="text-gray-700 mb-4">
                  Programadores especializados en landing pages, tracking avanzado y optimización de conversión.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Desarrollo de landing pages</li>
                  <li>• Implementación de tracking</li>
                  <li>• Optimización de velocidad y UX</li>
                  <li>• A/B testing técnico</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Account Managers
                </h3>
                <p className="text-gray-700 mb-4">
                  Ejecutivos de cuenta dedicados que coordinan todo tu equipo y son tu punto de contacto principal.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Coordinación de equipo dedicado</li>
                  <li>• Reuniones estratégicas mensuales</li>
                  <li>• Seguimiento de objetivos y KPIs</li>
                  <li>• Soporte prioritario y comunicación</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-blue-900 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Tu Equipo Dedicado con Cada Plan</h3>
              <p className="text-lg text-blue-100 mb-4">
                A diferencia de agencias pequeñas donde eres un cliente más, en Muller y Pérez tienes un equipo asignado
                exclusivamente para tu cuenta:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-bold mb-2">Plan Corporativo Starter</div>
                  <div className="text-blue-200">3 profesionales dedicados</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-bold mb-2">Plan Business Growth</div>
                  <div className="text-blue-200">4 profesionales dedicados</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-bold mb-2">Plan Enterprise / Custom</div>
                  <div className="text-blue-200">5+ profesionales dedicados</div>
                </div>
              </div>
            </div>
          </section>

          {/* Servicios Corporativos */}
          <section className="mb-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Servicios Corporativos de Marketing Digital
            </h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              Como <strong>empresa de publicidad digital establecida</strong>, ofrecemos una suite completa de servicios
              profesionales para empresas que buscan resultados escalables:
            </p>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-blue-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl">1</span>
                  Google Ads Corporativo (SEM & Shopping)
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Gestión profesional de <strong>Google Ads</strong> con estrategia multi-canal: búsqueda, shopping, display,
                  YouTube y Performance Max. Como <strong>Google Partner certificado</strong>, manejamos presupuestos desde
                  $500k hasta $10M+ mensuales.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Auditoría completa de cuenta actual</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Estructura de campañas optimizada</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Keyword research avanzado competitivo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Optimización continua de Quality Score</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>A/B testing de anuncios y landing pages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Remarketing inteligente multi-etapa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Shopping Ads para E-commerce</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Performance Max con AI de Google</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-purple-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl">2</span>
                  Meta Ads Profesional (Facebook & Instagram)
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Campañas de alto rendimiento en <strong>Meta Ads</strong> (Facebook e Instagram) con estrategia basada en
                  datos. Como <strong>Meta Business Partner</strong>, implementamos campañas complejas con audiencias
                  personalizadas, lookalikes y remarketing avanzado.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Estrategia de audiencias personalizadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Lookalike audiences de alto rendimiento</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Campañas de conversión optimizadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Catálogos dinámicos para E-commerce</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Testing de creatividades continuo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Video marketing y reels optimizados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Remarketing multi-etapa inteligente</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Instagram Shopping integrado</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-indigo-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl">3</span>
                  LinkedIn Ads Corporativo (B2B)
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Especialistas en <strong>LinkedIn Ads para empresas B2B</strong> con targeting preciso por cargo, industria,
                  empresa y seniority. Ideal para generación de leads corporativos de alta calidad y posicionamiento de marca
                  empresarial.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Targeting B2B avanzado por industria</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Campañas de generación de leads MQL</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Account-Based Marketing (ABM)</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Content marketing profesional</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Retargeting de tomadores de decisión</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Integración con CRM corporativo</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-green-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl">4</span>
                  Analytics Avanzado y Business Intelligence
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Implementación completa de <strong>Google Analytics 4</strong>, Tag Manager, dashboards ejecutivos y reportería
                  de BI avanzado. Medimos todo el funnel desde el primer click hasta la venta final y LTV del cliente.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Configuración GA4 empresarial completa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Google Tag Manager avanzado</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Tracking de conversiones multi-canal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Análisis de funnel completo y drop-off</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Dashboards ejecutivos personalizados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Reportería automatizada semanal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Análisis de atribución multi-touch</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Integración con CRM y herramientas BI</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Precios Corporativos */}
          <section className="mb-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white rounded-3xl p-10">
            <h2 className="text-4xl font-bold mb-8">
              Inversión en una Empresa de Marketing Digital Profesional
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Como <strong>empresa de marketing digital establecida</strong>, ofrecemos planes corporativos con transparencia
              total de costos, equipo dedicado y resultados medibles garantizados:
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-sm font-semibold text-blue-300 mb-2">Para Empresas en Crecimiento</div>
                <h3 className="text-3xl font-bold mb-4">Plan Corporativo Starter</h3>
                <div className="text-5xl font-bold mb-6">$590.000<span className="text-2xl text-blue-300">/mes</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Equipo dedicado de 3 profesionales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Google Ads + Meta Ads gestionados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Analytics y tracking completo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Reportería semanal + reunión mensual</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Acceso full a todas tus cuentas</span>
                  </li>
                </ul>
                <div className="text-sm text-blue-200">
                  Ideal para empresas con presupuesto publicitario de $1M-$3M/mes
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 border-4 border-yellow-400 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MÁS POPULAR
                </div>
                <div className="text-sm font-semibold text-green-100 mb-2">Para Empresas que Escalan</div>
                <h3 className="text-3xl font-bold mb-4">Plan Business Growth</h3>
                <div className="text-5xl font-bold mb-6">$980.000<span className="text-2xl text-green-100">/mes</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-white mr-3">✓</span>
                    <span>Equipo dedicado de 4 profesionales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3">✓</span>
                    <span>Multi-canal: Google + Meta + LinkedIn</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3">✓</span>
                    <span>Dashboards ejecutivos personalizados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3">✓</span>
                    <span>Optimización de conversión (CRO)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3">✓</span>
                    <span>Landing pages y A/B testing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3">✓</span>
                    <span>Account Manager dedicado</span>
                  </li>
                </ul>
                <div className="text-sm text-green-50 font-semibold">
                  Ideal para empresas con presupuesto publicitario de $3M-$8M/mes
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-sm font-semibold text-purple-300 mb-2">Para Empresas Enterprise</div>
                <h3 className="text-3xl font-bold mb-4">Plan Enterprise</h3>
                <div className="text-5xl font-bold mb-6">$1.800.000<span className="text-2xl text-purple-300">/mes</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Equipo dedicado de 5+ profesionales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Estrategia omnicanal completa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>BI avanzado y data warehouse</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Desarrollo web y técnico incluido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Reuniones ejecutivas semanales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>SLA garantizado con penalizaciones</span>
                  </li>
                </ul>
                <div className="text-sm text-purple-200">
                  Para empresas con presupuesto publicitario de $8M+/mes
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-sm font-semibold text-orange-300 mb-2">Proyectos Especiales</div>
                <h3 className="text-3xl font-bold mb-4">Plan Custom</h3>
                <div className="text-5xl font-bold mb-6">$2.500.000<span className="text-2xl text-orange-300">+/mes</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Equipo completo multidisciplinario</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Infraestructura tecnológica dedicada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Desarrollo de plataformas propias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Consultoría estratégica ejecutiva</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Integración total con tu equipo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Contrato enterprise personalizado</span>
                  </li>
                </ul>
                <div className="text-sm text-orange-200">
                  Para grandes empresas y proyectos complejos +$15M/mes
                </div>
              </div>
            </div>

            <div className="bg-yellow-400 text-gray-900 rounded-2xl p-6 text-center">
              <p className="text-lg font-semibold mb-2">
                💰 Nota Importante sobre Inversión en Marketing Digital
              </p>
              <p className="text-gray-800">
                Los precios mostrados son por gestión profesional de campañas. El presupuesto de publicidad (Google Ads,
                Meta Ads, etc.) es adicional y lo defines tú según tus objetivos de crecimiento.
              </p>
            </div>
          </section>

          {/* Por qué elegir una empresa establecida */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              ¿Por Qué Elegir una Empresa de Marketing Digital Establecida?
            </h2>

            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-4xl mr-4">🏢</span>
                  Continuidad y Respaldo Corporativo
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Con una <strong>empresa de marketing digital establecida</strong> como Muller y Pérez, no dependes de una
                  sola persona. Si un miembro del equipo se enferma, renuncia o está de vacaciones, tu servicio continúa sin
                  interrupciones. Tenemos backup completo, procesos documentados y equipo de reemplazo inmediato.
                </p>
                <div className="mt-4 bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700">
                    <strong>Riesgo con freelancer:</strong> Si el freelancer se va, pierdes todo el conocimiento, accesos y
                    configuraciones. Con una empresa establecida, todo está documentado y respaldado corporativamente.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-4xl mr-4">💪</span>
                  Capacidad para Escalar Rápidamente
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  ¿Necesitas aumentar tu presupuesto de $2M a $10M mensuales? Una <strong>empresa de marketing digital
                  corporativa</strong> puede escalar contigo inmediatamente. Tenemos el equipo, la experiencia y la infraestructura
                  para manejar cuentas grandes sin comprometer la calidad.
                </p>
                <div className="mt-4 bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-gray-700">
                    <strong>Riesgo con agencias pequeñas:</strong> No pueden escalar rápidamente. Un freelancer que maneja
                    $500k/mes no tiene la experiencia ni capacidad para gestionar $10M/mes sin cometer errores costosos.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-4xl mr-4">🎓</span>
                  Expertise Multi-Plataforma Real
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Una persona no puede ser experta en todo. En una <strong>empresa de marketing digital profesional</strong>,
                  tienes especialistas dedicados: experto en Google Ads, experto en Meta Ads, experto en Analytics, experto en
                  CRO. Cada uno con certificaciones oficiales y años de experiencia específica.
                </p>
                <div className="mt-4 bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-gray-700">
                    <strong>Realidad del freelancer:</strong> Cuando un freelancer dice que "hace de todo", significa que no
                    es experto en nada. Google Ads, Meta Ads, Analytics, CRO... cada plataforma requiere especialización.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-4xl mr-4">🔒</span>
                  Contratos Empresariales y SLA
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Como <strong>empresa establecida</strong>, trabajamos con contratos corporativos formales, acuerdos de nivel
                  de servicio (SLA), cláusulas de confidencialidad y respaldo legal completo. Tu inversión está protegida con
                  garantías empresariales reales.
                </p>
                <div className="mt-4 bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="text-gray-700">
                    <strong>Riesgo con proveedores informales:</strong> Sin contrato formal, sin SLA, sin garantías. Si algo
                    sale mal, no tienes respaldo legal ni forma de exigir cumplimiento o compensación.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-4xl mr-4">📊</span>
                  Casos de Éxito Corporativos Comprobados
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hemos gestionado más de <strong>$50 millones en inversión publicitaria</strong> para empresas de diversos
                  rubros. Tenemos casos de éxito documentados, referencias verificables de clientes actuales y experiencia
                  comprobada con presupuestos grandes.
                </p>
                <div className="mt-4 bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-gray-700">
                    <strong>Cuidado con testimonios no verificables:</strong> Cualquiera puede poner un testimonio genérico
                    en su sitio. Solicita siempre referencias verificables, estudios de caso con datos reales y contactos de
                    clientes actuales.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs Extendidas */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-10">
              Preguntas Frecuentes: Empresa de Marketing Digital en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Qué diferencia a una empresa de marketing digital de una agencia pequeña?',
                  a: 'Una empresa de marketing digital establecida como Muller y Pérez se diferencia por su infraestructura profesional, equipo especializado de tiempo completo, procesos estandarizados, tecnología propia, casos de éxito corporativos comprobados y respaldo financiero. A diferencia de agencias pequeñas o freelancers, una empresa puede garantizar continuidad, escalabilidad y resultados consistentes sin depender de una sola persona.'
                },
                {
                  q: '¿Cuánto cuesta contratar una empresa de marketing digital en Chile?',
                  a: 'Los servicios de una empresa de marketing digital profesional en Chile oscilan entre $590.000 y $2.500.000+ mensuales según el nivel de servicio requerido. En Muller y Pérez ofrecemos: Plan Corporativo Starter ($590k) para empresas en crecimiento, Plan Business Growth ($980k) nuestro más popular, Plan Enterprise ($1.8M) para grandes empresas, y Plan Custom ($2.5M+) para proyectos especiales. Todos incluyen equipo dedicado completo, infraestructura tecnológica empresarial y reportería ejecutiva.'
                },
                {
                  q: '¿Qué ventajas tiene trabajar con una empresa establecida vs un freelancer?',
                  a: 'Una empresa de marketing digital establecida ofrece: (1) Equipo multidisciplinario completo en lugar de una sola persona, (2) Continuidad garantizada del servicio sin riesgo de que alguien se vaya, (3) Infraestructura tecnológica profesional con herramientas empresariales, (4) Procesos documentados y estandarizados, (5) Respaldo legal, financiero y contractual formal, (6) Escalabilidad inmediata para crecer sin límites, (7) Casos de éxito corporativos comprobados, y (8) Capacidad para manejar presupuestos grandes ($5M-$20M+/mes) sin riesgo operacional.'
                },
                {
                  q: '¿Qué infraestructura tecnológica debe tener una empresa de marketing digital profesional?',
                  a: 'Una empresa de marketing digital profesional debe contar con: Licencias empresariales de Google Ads y Meta Business Suite, herramientas de analytics avanzado (GA4, Tag Manager, Data Studio/Looker), plataformas de automatización de marketing, CRM integrado tipo HubSpot o Salesforce, herramientas de diseño profesionales (Adobe Creative Suite completo), sistemas de gestión de proyectos empresariales, infraestructura de servidores y backup corporativo, herramientas de BI y data warehouse, y certificaciones oficiales vigentes de Google Partner y Meta Business Partner.'
                },
                {
                  q: '¿Cómo verificar los casos de éxito de una empresa de marketing digital?',
                  a: 'Para verificar casos de éxito corporativos de forma seria: (1) Solicita estudios de caso con datos reales y KPIs específicos, no solo testimonios genéricos, (2) Pide referencias verificables de empresas similares a la tuya con contactos reales, (3) Revisa certificaciones oficiales vigentes de plataformas (Google Partner, Meta Business Partner), (4) Consulta la presencia digital de la empresa misma (si no hacen bien su propio marketing, ¿cómo harán el tuyo?), (5) Verifica tiempo real en el mercado y trayectoria comprobada, (6) Solicita portfolio con resultados medibles, inversión publicitaria gestionada y ROI/ROAS alcanzados, y (7) Busca reviews independientes en Google My Business o LinkedIn.'
                },
                {
                  q: '¿Qué equipo profesional debería tener una empresa de marketing digital?',
                  a: 'Una empresa de marketing digital profesional debe contar con equipo especializado de tiempo completo: Estrategas Digitales senior certificados con +5 años de experiencia, Especialistas en Google Ads con certificaciones oficiales de Google, Especialistas en Meta Ads certificados por Meta, Especialistas en LinkedIn Ads para B2B, Analistas de Datos y BI con dominio de GA4/GTM, Diseñadores Gráficos y de Contenido profesionales, Desarrolladores Web y de Landing Pages, Especialistas en CRO (optimización de conversión), Account Managers dedicados para cada cliente, y equipo de soporte técnico. En Muller y Pérez, cada cliente corporativo tiene un equipo asignado de 3-5 profesionales según el plan contratado.'
                },
                {
                  q: '¿Cómo funciona el modelo de trabajo con una empresa de marketing digital corporativa?',
                  a: 'El modelo corporativo funciona en 8 fases: (1) Kickoff inicial de 2-3 semanas con análisis profundo de negocio, competencia y mercado, (2) Asignación de equipo dedicado con roles específicos y responsabilidades claras, (3) Implementación de infraestructura tecnológica completa (GA4, GTM, pixels, conversiones), (4) Desarrollo e implementación de estrategia multi-canal coordinada, (5) Lanzamiento de campañas con monitoreo en tiempo real, (6) Dashboards ejecutivos con acceso 24/7 a datos en vivo, (7) Reportería semanal automatizada con insights accionables, y (8) Reuniones estratégicas mensuales con tu equipo ejecutivo. Todo con transparencia total y acceso completo a tus cuentas desde el día 1.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final Corporativo */}
          <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 text-center text-white shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                Empresa Establecida desde 2020 | +$50M Gestionados
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                ¿Listo para Trabajar con una Empresa de Marketing Digital Profesional?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Agenda una reunión estratégica gratuita de 45 minutos con nuestro equipo ejecutivo. Te mostraremos
                cómo funciona el performance marketing corporativo con datos reales, te daremos un análisis completo
                de tu situación actual y una propuesta personalizada sin compromiso.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">En la reunión estratégica recibirás:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2 text-xl">✓</span>
                      <span>Auditoría preliminar de tus campañas actuales</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2 text-xl">✓</span>
                      <span>Análisis de competencia en tu industria</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2 text-xl">✓</span>
                      <span>Proyección de resultados esperados (CPL/CAC/ROAS)</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2 text-xl">✓</span>
                      <span>Plan estratégico personalizado para tu empresa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2 text-xl">✓</span>
                      <span>Propuesta con equipo dedicado y presupuesto</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2 text-xl">✓</span>
                      <span>Casos de éxito en tu industria específica</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="px-10 py-5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold text-xl shadow-lg transform hover:scale-105"
                >
                  Solicitar Reunión Estratégica Gratis
                </Link>
                <Link
                  href="/#pricing"
                  className="px-10 py-5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition font-bold text-xl"
                >
                  Ver Planes Corporativos
                </Link>
              </div>

              <p className="text-sm text-blue-200 mt-6">
                Sin compromiso | Reunión de 45 minutos | Propuesta personalizada el mismo día
              </p>
            </div>
          </section>
        </article>

        {/* Footer Corporativo */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Muller y Pérez</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Empresa de marketing digital establecida en Chile desde 2020. Equipo profesional, infraestructura propia
                  y resultados medibles.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Servicios</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/#services" className="hover:text-white transition">Google Ads</Link></li>
                  <li><Link href="/#services" className="hover:text-white transition">Meta Ads</Link></li>
                  <li><Link href="/#services" className="hover:text-white transition">LinkedIn Ads</Link></li>
                  <li><Link href="/#services" className="hover:text-white transition">Analytics</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/#about" className="hover:text-white transition">Nosotros</Link></li>
                  <li><Link href="/#pricing" className="hover:text-white transition">Planes</Link></li>
                  <li><Link href="/#contact" className="hover:text-white transition">Contacto</Link></li>
                  <li><Link href="/agencia-marketing-digital-chile" className="hover:text-white transition">Agencia</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contacto</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Santiago, Chile</li>
                  <li>Lunes a Viernes 9:00-18:00</li>
                  <li><a href="/#contact" className="hover:text-white transition">Solicitar Reunión</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                © 2025 Muller y Pérez - Empresa de Marketing Digital Chile | Todos los derechos reservados
              </p>
              <div className="flex justify-center gap-6 text-sm text-gray-400">
                <Link href="/" className="hover:text-white transition">Inicio</Link>
                <Link href="/#pricing" className="hover:text-white transition">Planes Corporativos</Link>
                <Link href="/#contact" className="hover:text-white transition">Solicitar Propuesta</Link>
                <Link href="/agencia-marketing-digital-chile" className="hover:text-white transition">Agencia</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
