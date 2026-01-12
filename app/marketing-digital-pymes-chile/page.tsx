/**
 * Landing Page SEO: Marketing Digital para PYMEs Chile
 * Optimizada para rankear #1 en Google para keywords de PYMEs
 * Contenido empático, accesible y enfocado en resultados medibles
 * Target: "marketing digital pymes chile", "marketing digital para pequeñas empresas chile"
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
  title: 'Marketing Digital para PYMEs Chile | Desde $390k/mes Sin Contratos Largos',
  description: 'Marketing digital para pequeñas empresas en Chile. Presupuestos accesibles desde $390k/mes, sin contratos largos, resultados medibles y acompañamiento cercano. Especialistas en PYMEs.',
  keywords: [
    'marketing digital pymes chile',
    'marketing digital para pequeñas empresas chile',
    'agencia marketing pymes',
    'marketing digital pyme',
    'publicidad online para pymes chile',
    'google ads para pymes chile',
    'marketing digital pequeñas empresas',
    'precios marketing digital pymes',
    'agencia pymes chile',
    'marketing digital presupuesto bajo chile'
  ],
  path: '/marketing-digital-pymes-chile'
})

export default function MarketingDigitalPymesChilePage() {
  // Schema markup para Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Marketing Digital para PYMEs Chile',
    provider: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Chile'
    },
    description: 'Servicios de marketing digital especializados para pequeñas y medianas empresas en Chile, con presupuestos accesibles y sin contratos largos',
    offers: {
      '@type': 'Offer',
      price: '390000',
      priceCurrency: 'CLP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '390000',
        priceCurrency: 'CLP',
        unitText: 'MONTH'
      }
    }
  }

  const webPageSchema = createWebPageSchema(
    'Marketing Digital para PYMEs Chile | Muller y Pérez',
    'Servicios de marketing digital accesibles para pequeñas empresas en Chile. Desde $390k/mes, sin contratos largos, con resultados medibles y acompañamiento cercano',
    'https://www.mulleryperez.cl/marketing-digital-pymes-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Marketing Digital PYMEs Chile', url: 'https://www.mulleryperez.cl/marketing-digital-pymes-chile' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Cuánto cuesta marketing digital para una PYME en Chile?',
      answer: 'El costo de marketing digital para PYMEs en Chile varía entre $390.000 y $890.000 mensuales. En Muller y Pérez tenemos planes especiales para pequeñas empresas: Plan PYME Starter ($390k/mes) para empezar, Plan PYME Growth ($590k/mes) para crecer, y Plan PYME Pro ($890k/mes) para escalar. Todos incluyen Google Ads, Meta Ads, diseño de contenido y sin contratos largos.'
    },
    {
      question: '¿Por qué una PYME necesita marketing digital en Chile?',
      answer: 'Una PYME en Chile necesita marketing digital porque el 89% de chilenos busca productos y servicios en Google antes de comprar. Sin presencia digital, tu competencia te está quitando clientes todos los días. El marketing digital permite a las PYMEs competir de igual a igual con empresas más grandes, invirtiendo presupuestos accesibles y obteniendo resultados medibles desde el primer mes.'
    },
    {
      question: '¿Qué resultados puede esperar una PYME con marketing digital?',
      answer: 'Una PYME puede esperar entre 15-50 leads calificados mensuales con una inversión de $1-2M en publicidad + fee de agencia. Los primeros leads llegan desde la primera semana, pero los resultados consistentes se ven en 2-3 meses. Trabajamos con datos reales: te decimos exactamente cuánto cuesta cada lead, cada cliente nuevo y el retorno de inversión (ROI) de cada peso gastado.'
    },
    {
      question: '¿Las PYMEs deben firmar contratos largos para marketing digital?',
      answer: 'NO. En Muller y Pérez entendemos que las PYMEs necesitan flexibilidad. Por eso NO exigimos contratos largos. Trabajamos mes a mes: si no ves resultados, puedes cancelar cuando quieras. Esta confianza nos obliga a entregar resultados desde el primer día. La mayoría de nuestros clientes PYME llevan 12+ meses con nosotros porque los resultados hablan por sí solos.'
    },
    {
      question: '¿Qué incluyen los planes de marketing digital para PYMEs?',
      answer: 'Nuestros planes PYME incluyen: gestión completa de Google Ads (campañas de búsqueda y display), Meta Ads (Facebook e Instagram), diseño de contenido publicitario (imágenes y textos), optimización constante de campañas, reportería quincenal con datos reales (CPL, CAC, ROAS), acceso completo a tus cuentas publicitarias, y atención directa por WhatsApp. Todo transparente, sin sorpresas.'
    },
    {
      question: '¿Una PYME puede competir con empresas grandes en marketing digital?',
      answer: 'SÍ, absolutamente. El marketing digital es el gran nivelador para PYMEs. Con una buena estrategia y optimización profesional, una PYME puede aparecer en los mismos lugares que empresas grandes en Google, Facebook e Instagram. La clave está en segmentar bien tu audiencia, optimizar cada peso invertido y trabajar con datos reales. Muchas PYMEs obtienen mejor ROI que grandes empresas porque son más ágiles y toman decisiones más rápido.'
    },
    {
      question: '¿Cuánto presupuesto publicitario necesita una PYME para empezar?',
      answer: 'Recomendamos que una PYME invierta mínimo $800k-1.5M mensuales en publicidad (sin contar el fee de agencia). Con menos presupuesto, los algoritmos de Google y Facebook no tienen suficiente data para optimizar. Si tu presupuesto es menor, es mejor enfocarse en 1 canal (Google Ads) hasta tener resultados, luego expandir a Meta Ads. Nosotros te ayudamos a priorizar según tu industria y objetivos.'
    },
    {
      question: '¿Qué diferencia a una agencia especializada en PYMEs vs una agencia tradicional?',
      answer: 'Una agencia especializada en PYMEs como M&P entiende tus limitaciones de presupuesto, la necesidad de resultados rápidos, y la importancia de cada peso invertido. No te vendemos planes premium innecesarios. Trabajamos con transparencia, sin contratos largos, con reportería constante y atención cercana. Las agencias tradicionales tienen planes rígidos desde $1.5M+/mes y contratos de 6-12 meses que no funcionan para PYMEs.'
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
        {/* Hero Section - Enfocado en PYMEs */}
        <section className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-emerald-200 hover:text-white transition">
                Inicio
              </Link>
              <span className="mx-2 text-emerald-300">/</span>
              <span className="text-white font-semibold">Marketing Digital PYMEs Chile</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Marketing Digital para PYMEs en Chile:<br />
              Presupuestos Accesibles, Resultados Reales
            </h1>
            <p className="text-xl text-emerald-100 mb-6 leading-relaxed">
              Somos especialistas en <strong>marketing digital para pequeñas empresas en Chile</strong>.
              Entendemos tus desafíos: presupuesto ajustado, necesidad de resultados rápidos y cero margen para
              experimentos costosos.
            </p>
            <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
              Por eso creamos planes especiales para <strong>PYMEs chilenas</strong>: desde <strong>$390.000/mes</strong>,
              sin contratos largos, con acompañamiento cercano y resultados medibles desde el primer mes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-center text-lg shadow-lg"
              >
                Agenda tu Asesoría Gratis
              </Link>
              <Link
                href="#planes-pyme"
                className="px-8 py-4 bg-white text-emerald-900 rounded-lg hover:bg-emerald-50 transition font-semibold text-center text-lg"
              >
                Ver Planes para PYMEs
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-emerald-700">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-300">$390k</div>
                  <div className="text-sm text-emerald-200">Desde/mes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-300">0</div>
                  <div className="text-sm text-emerald-200">Contratos largos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-300">15-50</div>
                  <div className="text-sm text-emerald-200">Leads/mes típicos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-4xl py-16">
          {/* Por qué las PYMEs necesitan marketing digital */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Tu PYME Necesita Marketing Digital en Chile?
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Si eres dueño de una pequeña o mediana empresa en Chile, probablemente has escuchado sobre
              <strong> marketing digital</strong> mil veces. Pero seamos honestos: también has escuchado promesas
              imposibles, presupuestos inflados y contratos que te amarran por 12 meses.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              La realidad es que el <strong>89% de los chilenos busca productos y servicios en Google antes de comprar</strong>.
              Si tu PYME no aparece ahí, esos clientes potenciales están yendo directamente con tu competencia.
            </p>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                El Problema Real de las PYMEs Chilenas:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Presupuesto limitado:</strong> No puedes gastar $2M+/mes como las grandes empresas</li>
                <li><strong>Necesitas resultados YA:</strong> No puedes esperar 6 meses para ver si funciona</li>
                <li><strong>Sin margen para errores:</strong> Cada peso mal invertido duele en el bolsillo</li>
                <li><strong>Tiempo limitado:</strong> Ya tienes mil cosas que hacer en tu empresa</li>
                <li><strong>Desconfianza:</strong> Te han vendido humo antes (y seguimos pagando)</li>
              </ul>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Por eso creamos <strong>planes especiales de marketing digital para PYMEs en Chile</strong>: presupuestos
              accesibles, sin contratos largos, transparencia total y enfoque obsesivo en resultados medibles.
            </p>
          </section>

          {/* Problemas típicos de PYMEs */}
          <section className="mb-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Los 7 Problemas Más Comunes que Enfrentan las PYMEs con Marketing Digital
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Después de trabajar con decenas de pequeñas empresas chilenas, estos son los problemas que vemos
              una y otra vez:
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. "Invertimos en publicidad pero no sabemos si funciona"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Muchas PYMEs gastan $500k-2M/mes en Facebook o Google pero no tienen idea de cuántos clientes
                  reales les genera. Solo ven "clicks" y "alcance" (métricas de vanidad que no se traducen en ventas).
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Te decimos exactamente cuánto te cuesta cada lead, cada cliente nuevo y
                  el ROI de cada peso invertido. Datos reales, reportes quincenales.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. "Las agencias nos piden contratos de 12 meses y presupuestos altísimos"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  La mayoría de agencias tienen planes desde $1.5M+/mes y contratos de 6-12 meses. Para una PYME
                  eso es inviable y riesgoso.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Planes desde $390k/mes, SIN contratos largos. Trabajamos mes a mes. Si no
                  ves resultados, cancelas cuando quieras.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. "No tenemos acceso a nuestras propias cuentas publicitarias"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Muchas agencias crean las cuentas de Google Ads y Facebook bajo su nombre, secuestrando tu data
                  y audiencias. Si cancelas, pierdes todo.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Las cuentas son TUYAS desde el día 1. Tienes acceso completo, transparencia
                  total. Si algún día te vas, te llevas todo.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. "Gastamos plata en publicidad pero los leads que llegan no compran"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Recibir 100 leads suena genial, hasta que te das cuenta que 90 son personas que solo preguntan
                  precio y desaparecen. El problema: leads de baja calidad por mala segmentación.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Optimizamos para CALIDAD, no solo cantidad. Mejor 20 leads calificados que
                  100 curiosos. Trabajamos contigo para entender tu cliente ideal y segmentamos con precisión.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  5. "No entendemos los reportes que nos manda la agencia"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Reportes de 40 páginas llenos de gráficos bonitos pero imposibles de entender. CTR, CPM, CPC...
                  ¿qué significa todo eso para tu negocio?
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Reportes simples y directos. Te decimos: gastaste $X, generaste Y leads,
                  cerraste Z ventas, ganaste $. Punto. Sin jerga técnica innecesaria.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  6. "Contratamos un freelancer barato y desapareció a los 2 meses"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Freelancers individuales son más baratos pero inconsistentes. Se enferman, se van de vacaciones,
                  consiguen otro cliente mejor pagado y tu pauta queda abandonada.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Equipo completo dedicado (estratega + especialista + diseñador). Si alguien
                  falta, hay respaldo. Tu pauta NUNCA queda abandonada.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  7. "Intentamos hacerlo nosotros mismos pero no tenemos tiempo ni conocimiento"
                </h3>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Google Ads y Facebook Ads parecen fáciles al principio. Pero optimizar campañas, hacer pruebas A/B,
                  analizar data, crear contenido... es un trabajo de tiempo completo que termina mal hecho.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Cómo lo resolvemos: Déjanos hacer lo que mejor sabemos hacer. Tú enfócate en tu negocio, nosotros
                  nos encargamos de traerte clientes. Simple.
                </p>
              </div>
            </div>
          </section>

          {/* Cómo funciona nuestro servicio para PYMEs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Cómo Funciona Nuestro Marketing Digital para PYMEs
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Diseñamos un proceso simple, transparente y enfocado en resultados medibles para pequeñas empresas:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Reunión Inicial Gratuita (30 min)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Conversamos sobre tu negocio, tus objetivos, tu presupuesto disponible y expectativas realistas.
                    Te mostramos casos de éxito de otras PYMEs en tu industria. Sin compromiso, sin presión.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Auditoría Express de tu Situación Actual
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Si ya tienes publicidad corriendo (Google, Facebook, Instagram), hacemos una auditoría rápida
                    para identificar fugas de presupuesto y oportunidades de mejora. Si estás empezando desde cero,
                    te armamos una estrategia inicial basada en tu industria y competencia.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Configuración Inicial (Semana 1)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Creamos o migramos tus cuentas de Google Ads, Facebook Business Manager, píxel de seguimiento,
                    audiencias, conversiones y estructura de campañas. Todo bajo TU nombre, con acceso completo para ti.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Lanzamiento de Campañas (Semana 2)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Comenzamos con campañas de búsqueda en Google (intención alta de compra) y remarketing en Facebook
                    para recuperar visitantes. Diseñamos los anuncios, textos, imágenes y landing pages si es necesario.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Optimización Constante
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Monitoreamos campañas diariamente: pausamos anuncios que no funcionan, escalamos los que sí,
                    probamos nuevas audiencias y creatividades. No esperamos al final del mes para optimizar.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  6
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Reportería Quincenal + Reunión Mensual
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cada 15 días recibes un reporte con números claros: inversión, leads, costo por lead, conversión
                    a ventas, ROI. Una vez al mes nos reunimos para revisar resultados, ajustar estrategia y planificar
                    el siguiente mes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                Todo Esto Sin Contratos Largos
              </p>
              <p className="text-gray-700">
                Trabajamos mes a mes. Si en cualquier momento no estás satisfecho con los resultados, puedes cancelar.
                Esta flexibilidad nos obliga a darte resultados desde el primer día.
              </p>
            </div>
          </section>

          {/* Planes especiales para PYMEs */}
          <section id="planes-pyme" className="mb-16 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Planes de Marketing Digital Especiales para PYMEs
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Diseñamos estos planes pensando en la realidad de las pequeñas empresas chilenas: presupuesto ajustado,
              necesidad de resultados medibles y cero tolerancia al humo.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Plan PYME Starter */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">PYME Starter</h3>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">$390k</div>
                  <div className="text-gray-600">por mes</div>
                </div>
                <p className="text-gray-700 mb-4 text-center text-sm">
                  Ideal para PYMEs que están comenzando con marketing digital
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Google Ads (1-2 campañas)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Meta Ads básico (Facebook/Instagram)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">4 diseños de anuncios/mes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Reportería quincenal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Atención por WhatsApp</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Acceso full a tus cuentas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Sin contrato, mes a mes</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link
                    href="/#contact"
                    className="block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                  >
                    Comenzar Ahora
                  </Link>
                </div>
              </div>

              {/* Plan PYME Growth - Destacado */}
              <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-xl p-6 shadow-xl border-4 border-emerald-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  MÁS POPULAR
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">PYME Growth</h3>
                  <div className="text-4xl font-bold text-white mb-2">$590k</div>
                  <div className="text-emerald-100">por mes</div>
                </div>
                <p className="text-white mb-4 text-center text-sm">
                  Para PYMEs que quieren crecer y escalar resultados
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white font-semibold">Todo lo de Starter +</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">Google Ads completo (3-4 campañas)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">Meta Ads avanzado + Remarketing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">8 diseños de anuncios/mes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">Optimización diaria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">Reunión mensual de estrategia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">Dashboard en tiempo real</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-200 mr-2">✓</span>
                    <span className="text-white">Atención prioritaria</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link
                    href="/#contact"
                    className="block px-6 py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition font-semibold"
                  >
                    Elegir Growth
                  </Link>
                </div>
              </div>

              {/* Plan PYME Pro */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">PYME Pro</h3>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">$890k</div>
                  <div className="text-gray-600">por mes</div>
                </div>
                <p className="text-gray-700 mb-4 text-center text-sm">
                  Para PYMEs consolidadas que buscan maximizar resultados
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700 font-semibold">Todo lo de Growth +</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Equipo dedicado completo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">LinkedIn Ads (B2B)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">12 diseños de anuncios/mes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Videos publicitarios (2/mes)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">A/B testing avanzado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Reportería semanal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span className="text-gray-700">Consultor estratégico asignado</span>
                  </li>
                </ul>
                <div className="text-center">
                  <Link
                    href="/#contact"
                    className="block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                  >
                    Quiero Pro
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                Importante: Presupuesto Publicitario Adicional
              </h4>
              <p className="text-gray-700 leading-relaxed mb-2">
                Los valores anteriores son solo por el <strong>servicio de gestión</strong>. Adicional a esto,
                necesitas presupuesto para invertir en publicidad (Google Ads, Facebook Ads):
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Mínimo recomendado:</strong> $800k - 1.5M mensuales en pauta</li>
                <li><strong>Ideal para resultados consistentes:</strong> $2M - 3M mensuales</li>
                <li><strong>Para escalar agresivamente:</strong> $4M+ mensuales</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Ejemplo: Plan Growth ($590k/mes) + $2M en pauta = Inversión total de $2.59M/mes
              </p>
            </div>
          </section>

          {/* Casos de éxito de PYMEs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Casos de Éxito: PYMEs Chilenas que Ya Están Creciendo con Nosotros
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Estas son empresas reales (omitimos nombres por confidencialidad) con resultados reales:
            </p>

            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-xl p-6 border-l-4 border-emerald-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ferretería en Providencia, Santiago
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Industria:</strong> Retail / Ferretería<br />
                  <strong>Inversión mensual:</strong> $590k (fee) + $1.8M (pauta) = $2.39M total<br />
                  <strong>Tiempo trabajando juntos:</strong> 8 meses
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-gray-800 font-semibold mb-2">Resultados:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 32 leads calificados promedio/mes (personas que piden cotización)</li>
                    <li>• Costo por lead: $56.250</li>
                    <li>• Conversión a venta: 28% (9 ventas/mes)</li>
                    <li>• Ticket promedio: $450.000</li>
                    <li>• Facturación generada: $4.05M/mes</li>
                    <li>• ROI: 69% (por cada peso invertido, retornan $1.69)</li>
                  </ul>
                </div>
                <p className="text-emerald-700 font-semibold">
                  "Antes pagábamos publicidad sin saber si funcionaba. Ahora sabemos exactamente cuánto nos cuesta
                  cada cliente nuevo y estamos creciendo sostenidamente."
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Clínica Dental en Ñuñoa, Santiago
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Industria:</strong> Salud / Odontología<br />
                  <strong>Inversión mensual:</strong> $390k (fee) + $1.2M (pauta) = $1.59M total<br />
                  <strong>Tiempo trabajando juntos:</strong> 5 meses
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-gray-800 font-semibold mb-2">Resultados:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 24 leads calificados promedio/mes (solicitudes de hora)</li>
                    <li>• Costo por lead: $50.000</li>
                    <li>• Conversión a paciente: 42% (10 pacientes nuevos/mes)</li>
                    <li>• Valor promedio primer tratamiento: $320.000</li>
                    <li>• Facturación generada: $3.2M/mes</li>
                    <li>• ROI: 101% (duplican la inversión)</li>
                  </ul>
                </div>
                <p className="text-blue-700 font-semibold">
                  "Empezamos con el plan Starter porque teníamos miedo de invertir. A los 3 meses los resultados
                  eran tan buenos que subimos a Growth. Ahora tenemos agenda llena."
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  E-commerce de Productos Sustentables
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Industria:</strong> E-commerce<br />
                  <strong>Inversión mensual:</strong> $890k (fee) + $3.5M (pauta) = $4.39M total<br />
                  <strong>Tiempo trabajando juntos:</strong> 11 meses
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-gray-800 font-semibold mb-2">Resultados:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 180 ventas promedio/mes (online)</li>
                    <li>• Costo por adquisición: $24.390</li>
                    <li>• Ticket promedio: $85.000</li>
                    <li>• Facturación generada: $15.3M/mes</li>
                    <li>• ROI: 248% (casi 3.5x la inversión)</li>
                    <li>• Margen neto después de costos: 45%</li>
                  </ul>
                </div>
                <p className="text-purple-700 font-semibold">
                  "Éramos un emprendimiento pequeño. Con marketing digital bien hecho pasamos de vender $4M/mes
                  a $15M/mes. Ahora estamos contratando más gente."
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                Patrón Común en Todas las PYMEs Exitosas:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Empiezan con presupuesto conservador y escalan según resultados</li>
                <li>• Mantienen comunicación constante con el equipo</li>
                <li>• Confían en los datos y toman decisiones basadas en números reales</li>
                <li>• Dan tiempo para optimizar (2-3 meses) antes de juzgar resultados finales</li>
                <li>• Reinvierten las ganancias en más publicidad para escalar</li>
              </ul>
            </div>
          </section>

          {/* Por qué somos diferentes */}
          <section className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Por Qué las PYMEs Chilenas Nos Eligen (y Se Quedan)
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Entendemos la Realidad PYME
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  No somos una agencia grande con oficinas lujosas en Las Condes. Somos un equipo que entiende las
                  limitaciones de presupuesto, la necesidad de resultados rápidos y la importancia de cada peso invertido.
                  Trabajamos CON PYMEs, no solo PARA PYMEs.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Sin Contratos Largos = Confianza
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Si te pedimos contrato de 12 meses es porque no confiamos en nuestros resultados. Nosotros trabajamos
                  mes a mes: si no estás satisfecho, cancelas. Simple. Esta política nos obliga a entregar valor desde
                  el día 1.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Transparencia Total (No Sorpresas)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tienes acceso completo a todas tus cuentas publicitarias. Ves cada peso que se invierte, cada anuncio
                  que se publica, cada resultado que se obtiene. Cero cajas negras, cero secretos, cero letra chica.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Atención Cercana y Humana
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  No eres un número de ticket. Tienes contacto directo por WhatsApp con tu equipo. Respondemos rápido,
                  hablamos en lenguaje simple (sin jerga técnica innecesaria) y estamos disponibles cuando nos necesitas.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  5. Datos Reales, No Humo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  No te vendemos "impresiones" ni "alcance". Te decimos: gastaste X, generaste Y leads, cerraste Z ventas,
                  ganaste $. Métricas que importan para tu negocio, no métricas de vanidad que solo sirven para hacer
                  bonitos los reportes.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Flexibilidad y Adaptación
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Entendemos que las PYMEs tienen meses buenos y meses malos. Si necesitas ajustar el presupuesto, pausar
                  temporalmente o cambiar de estrategia, conversamos y encontramos soluciones. No somos rígidos como las
                  agencias grandes.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs específicos de PYMEs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes de PYMEs Sobre Marketing Digital
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto cuesta marketing digital para una PYME en Chile?',
                  a: 'El costo de marketing digital para PYMEs en Chile varía entre $390.000 y $890.000 mensuales por el servicio de gestión. En Muller y Pérez tenemos planes especiales para pequeñas empresas: Plan PYME Starter ($390k/mes) para empezar, Plan PYME Growth ($590k/mes) para crecer, y Plan PYME Pro ($890k/mes) para escalar. Adicional a esto, necesitas presupuesto para invertir en publicidad (Google Ads, Facebook Ads), idealmente entre $800k-3M mensuales dependiendo de tus objetivos. Todos nuestros planes incluyen acceso full a cuentas y sin contratos largos.'
                },
                {
                  q: '¿Por qué una PYME necesita marketing digital en Chile?',
                  a: 'Una PYME en Chile necesita marketing digital porque el 89% de chilenos busca productos y servicios en Google antes de comprar. Sin presencia digital, tu competencia te está quitando clientes todos los días. El marketing digital permite a las PYMEs competir de igual a igual con empresas más grandes, invirtiendo presupuestos accesibles y obteniendo resultados medibles desde el primer mes. Es la forma más eficiente de conseguir clientes nuevos de manera predecible y escalable.'
                },
                {
                  q: '¿Qué resultados puede esperar una PYME con marketing digital?',
                  a: 'Una PYME puede esperar entre 15-50 leads calificados mensuales con una inversión de $1-2M en publicidad + fee de agencia. Los primeros leads llegan desde la primera semana, pero los resultados consistentes se ven en 2-3 meses cuando ya hay suficiente data para optimizar. Trabajamos con datos reales: te decimos exactamente cuánto cuesta cada lead, cada cliente nuevo y el retorno de inversión (ROI) de cada peso gastado. Las PYMEs que trabajan con nosotros típicamente recuperan su inversión en 60-90 días.'
                },
                {
                  q: '¿Las PYMEs deben firmar contratos largos para marketing digital?',
                  a: 'NO. En Muller y Pérez entendemos que las PYMEs necesitan flexibilidad. Por eso NO exigimos contratos largos. Trabajamos mes a mes: si no ves resultados, puedes cancelar cuando quieras sin penalizaciones. Esta confianza nos obliga a entregar resultados desde el primer día. La mayoría de nuestros clientes PYME llevan 12+ meses con nosotros no porque estén atados a un contrato, sino porque los resultados hablan por sí solos.'
                },
                {
                  q: '¿Qué incluyen los planes de marketing digital para PYMEs?',
                  a: 'Nuestros planes PYME incluyen: gestión completa de Google Ads (campañas de búsqueda y display), Meta Ads (Facebook e Instagram), diseño de contenido publicitario (imágenes y textos), optimización constante de campañas, reportería quincenal con datos reales (CPL, CAC, ROAS), acceso completo a tus cuentas publicitarias, atención directa por WhatsApp, y reunión mensual de estrategia. Todo diseñado específicamente para las necesidades y presupuestos de pequeñas empresas.'
                },
                {
                  q: '¿Una PYME puede competir con empresas grandes en marketing digital?',
                  a: 'SÍ, absolutamente. El marketing digital es el gran nivelador para PYMEs. Con una buena estrategia y optimización profesional, una PYME puede aparecer en los mismos lugares que empresas grandes en Google, Facebook e Instagram. La clave está en segmentar bien tu audiencia, optimizar cada peso invertido y trabajar con datos reales. Muchas PYMEs obtienen mejor ROI que grandes empresas porque son más ágiles, toman decisiones más rápido y están más cerca de sus clientes.'
                },
                {
                  q: '¿Cuánto presupuesto publicitario necesita una PYME para empezar?',
                  a: 'Recomendamos que una PYME invierta mínimo $800k-1.5M mensuales en publicidad (sin contar el fee de agencia). Con menos presupuesto, los algoritmos de Google y Facebook no tienen suficiente data para optimizar correctamente. Si tu presupuesto es muy limitado, es mejor enfocarse en 1 canal (Google Ads) hasta tener resultados consistentes, luego expandir a Meta Ads. Nosotros te ayudamos a priorizar según tu industria, competencia y objetivos de negocio.'
                },
                {
                  q: '¿Qué diferencia a una agencia especializada en PYMEs vs una agencia tradicional?',
                  a: 'Una agencia especializada en PYMEs como M&P entiende tus limitaciones de presupuesto, la necesidad de resultados rápidos, y la importancia de cada peso invertido. No te vendemos planes premium innecesarios. Trabajamos con transparencia total, sin contratos largos, con reportería constante y atención cercana. Las agencias tradicionales tienen planes rígidos desde $1.5M+/mes y contratos de 6-12 meses que no funcionan para la realidad de las pequeñas empresas. Nosotros trabajamos CON PYMEs, entendiendo que cada negocio es diferente.'
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

          {/* Garantías para PYMEs */}
          <section className="mb-16 bg-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nuestras Garantías para PYMEs
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Entendemos que invertir en marketing digital es una decisión importante para una PYME. Por eso ofrecemos
              estas garantías:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-600 mb-3">
                  ✓ Sin Contratos Largos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Trabajamos mes a mes. Si no estás satisfecho con los resultados, puedes cancelar cuando quieras
                  sin penalizaciones ni letra chica.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-600 mb-3">
                  ✓ Acceso Full a Tus Cuentas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Las cuentas de Google Ads, Facebook y toda la data son TUYAS desde el día 1. Si te vas, te llevas todo.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-600 mb-3">
                  ✓ Transparencia Total
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Reportes quincenales con números reales: inversión, leads, conversiones, ROI. Sin métricas de vanidad,
                  solo datos que importan para tu negocio.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-emerald-600 mb-3">
                  ✓ Respuesta Rápida
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Atención directa por WhatsApp con tu equipo. Respondemos consultas en menos de 24 horas hábiles.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-r from-emerald-900 to-blue-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Hacer Crecer Tu PYME con Marketing Digital?
            </h2>
            <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto leading-relaxed">
              Agenda una reunión gratuita de 30 minutos. Te mostramos casos de éxito de PYMEs en tu industria,
              te damos una auditoría inicial de tu situación actual y armamos un plan realista según tu presupuesto.
            </p>
            <p className="text-lg text-emerald-200 mb-8">
              Sin compromiso. Sin presión. Solo conversación honesta sobre cómo hacer crecer tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-lg shadow-lg"
              >
                Agendar Asesoría Gratis
              </Link>
              <Link
                href="#planes-pyme"
                className="px-8 py-4 bg-white text-emerald-900 rounded-lg hover:bg-emerald-50 transition font-semibold text-lg"
              >
                Ver Planes y Precios
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-emerald-700">
              <p className="text-emerald-200 text-sm">
                Más de 50 PYMEs chilenas ya están creciendo con nosotros. Sin contratos largos. Sin sorpresas.
              </p>
            </div>
          </section>

          {/* Última sección: Por qué ahora */}
          <section className="mt-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Comenzar con Marketing Digital Ahora?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Cada mes que pasa sin presencia digital profesional, tu competencia te está quitando clientes.
              Mientras lees esto, tus competidores están apareciendo en Google cuando alguien busca tus servicios.
            </p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                La Realidad del Mercado Chileno en 2025:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• El 89% de chilenos busca en Google antes de comprar cualquier cosa</li>
                <li>• El 76% de búsquedas locales termina en una visita a la tienda/empresa dentro de 24 horas</li>
                <li>• Las PYMEs que invierten en marketing digital crecen 3.5x más rápido que las que no lo hacen</li>
                <li>• El costo de adquisición de clientes (CAC) sube un 12% anual por mayor competencia</li>
                <li>• Los que empiezan ahora tienen ventaja sobre los que esperan</li>
              </ul>
            </div>

            <div className="bg-emerald-600 text-white rounded-xl p-6 text-center">
              <p className="text-xl font-semibold mb-2">
                Comenzar es Simple:
              </p>
              <p className="text-emerald-100 text-lg">
                1. Agendas reunión (30 min) → 2. Armamos estrategia juntos → 3. Lanzamos en 7-10 días →
                4. Primeros leads en semana 1-2 → 5. Optimizamos constantemente
              </p>
            </div>
          </section>
        </article>

        {/* Servicios Relacionados */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Servicios para PYMEs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="group block bg-gray-50 hover:bg-emerald-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Google Ads para PYMEs</h3>
                <p className="text-gray-600 text-sm mb-3">Campañas de búsqueda optimizadas para presupuestos acotados</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver servicio →</span>
              </Link>
              <Link href="/servicios/meta-ads-chile" className="group block bg-gray-50 hover:bg-emerald-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Meta Ads para PYMEs</h3>
                <p className="text-gray-600 text-sm mb-3">Facebook e Instagram Ads con remarketing incluido</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver servicio →</span>
              </Link>
              <Link href="/servicios/performance-marketing" className="group block bg-gray-50 hover:bg-emerald-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Performance Marketing</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategia completa enfocada en resultados medibles</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver servicio →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Relacionados */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Artículos para PYMEs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/guia-marketing-digital-pymes-chile-2025" className="group block bg-white hover:bg-emerald-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mb-3">Guía</span>
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Guía Marketing Digital PYMEs 2025</h3>
                <span className="text-sm text-emerald-600 font-medium">Leer más →</span>
              </Link>
              <Link href="/blog/presupuesto-marketing-digital-chile-2025" className="group block bg-white hover:bg-emerald-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">Presupuesto</span>
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Cómo Planificar tu Presupuesto</h3>
                <span className="text-sm text-emerald-600 font-medium">Leer más →</span>
              </Link>
              <Link href="/blog/errores-comunes-campanas-digitales-chile" className="group block bg-white hover:bg-emerald-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold mb-3">Errores</span>
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Errores Comunes en Campañas</h3>
                <span className="text-sm text-emerald-600 font-medium">Leer más →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400 mb-4">
              © 2025 Muller y Pérez - Marketing Digital para PYMEs Chile | Todos los derechos reservados
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <Link href="/#pricing" className="hover:text-white transition">Planes</Link>
              <Link href="/#contact" className="hover:text-white transition">Contacto</Link>
              <Link href="/agencia-marketing-digital-chile" className="hover:text-white transition">
                Agencia Marketing Digital
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              Especialistas en marketing digital para pequeñas y medianas empresas en Chile.<br />
              Presupuestos accesibles, sin contratos largos, resultados medibles.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
