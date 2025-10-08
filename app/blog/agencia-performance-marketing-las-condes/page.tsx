import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, TrendingUp, MapPin, Building2, Target, BarChart3, DollarSign, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Agencia Performance Marketing Las Condes 2025: ROI Real y Data Verificable | Muller y Pérez',
  description: 'Agencia performance marketing especializada en Las Condes. ROI +380%, transparencia total y casos de éxito verificables en empresas B2B, tech y servicios premium.',
  keywords: 'agencia performance marketing las condes, agencia marketing las condes, performance marketing chile, agencia digital las condes, marketing b2b las condes',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/agencia-performance-marketing-las-condes'
  },
  openGraph: {
    title: 'Agencia Performance Marketing Las Condes 2025: ROI Real y Data Verificable',
    description: 'Agencia performance marketing especializada en Las Condes. ROI +380%, transparencia total y casos de éxito verificables en empresas B2B, tech y servicios premium.',
    url: 'https://www.mulleryperez.cl/blog/agencia-performance-marketing-las-condes',
    type: 'article',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-blog-performance-las-condes.jpg',
        width: 1200,
        height: 630,
        alt: 'Agencia Performance Marketing Las Condes'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agencia Performance Marketing Las Condes 2025: ROI Real',
    description: 'Agencia performance marketing especializada en Las Condes. ROI +380%, transparencia total y casos de éxito verificables.',
  }
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Agencia Performance Marketing Las Condes 2025: ROI Real y Data Verificable",
  "description": "Guía completa sobre agencias de performance marketing en Las Condes, benchmarks por industria y casos de éxito reales.",
  "image": "https://www.mulleryperez.cl/og-blog-performance-las-condes.jpg",
  "author": {
    "@type": "Organization",
    "name": "Muller y Pérez",
    "url": "https://www.mulleryperez.cl"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Muller y Pérez",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.mulleryperez.cl/logo.png"
    }
  },
  "datePublished": "2025-01-16",
  "dateModified": "2025-01-16"
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es performance marketing y por qué es importante para empresas en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Performance marketing es marketing digital enfocado 100% en resultados medibles: conversiones, ventas, leads cualificados, ROI. A diferencia del marketing tradicional (que mide impresiones o alcance), performance marketing cobra y optimiza según resultados reales. Para empresas en Las Condes (B2B tech, servicios profesionales, finanzas), esto significa: 1) Presupuesto justificable con data, 2) ROI verificable en cada peso invertido, 3) Optimización continua basada en conversiones reales, no vanity metrics."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la mejor agencia de performance marketing en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Muller y Pérez lidera performance marketing en Las Condes con 95% retención de clientes, ROI promedio +380%, y especialización en empresas B2B, tech y servicios premium. Casos verificables: SaaS B2B CPL $18k con LTV $450k (ROI 2400%), servicios profesionales ROAS 4.2x, fintech CAC $45k con payback 3 meses. Transparencia total: acceso completo a tus cuentas Google Ads y Meta Ads, sin permanencia mínima."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta una agencia de performance marketing en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rango de precios Las Condes 2025: Agencias boutique $650k-$1.2M/mes (servicio premium especializado), Mid-tier $400k-$800k/mes (servicio profesional estándar), Low-cost $200k-$400k/mes (servicio básico, menos especialización). El precio varía según: 1) Canales gestionados (Google Ads, Meta Ads, LinkedIn Ads), 2) Complejidad industria (B2B tech > retail), 3) Presupuesto publicitario administrado, 4) Nivel de personalización estratégica. Muller y Pérez: desde $650k/mes fee fijo (no porcentual)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué sectores dominan el performance marketing en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Top 5 sectores en Las Condes con mayor inversión en performance marketing 2025: 1) Tech/SaaS B2B (30% del mercado, CPL $18k-$45k, LTV alto), 2) Servicios Financieros/Fintech (25%, CPL $35k-$80k, regulación estricta), 3) Servicios Profesionales Premium (20%, CPL $40k-$70k, ciclo largo), 4) Inmobiliarias High-End (15%, CPL $120k-$280k, ticket +$150M), 5) Salud Privada/Clínicas (10%, CPL $25k-$55k, compliance alto). Común: ciclos de venta B2B largos, tickets altos, necesidad de atribución multi-touch."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué KPIs son importantes en performance marketing para empresas B2B en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "KPIs críticos performance marketing B2B Las Condes 2025: 1) CPL (Costo por Lead): $18k-$67k según industria, 2) Lead-to-Customer Rate: 8-15% es bueno en B2B, 3) CAC (Customer Acquisition Cost): debe ser <33% del LTV, 4) Payback Period: ideal 3-6 meses en SaaS, 5) ROAS (Return on Ad Spend): 3x-5x en B2B, 6) MQL vs SQL ratio: medir calidad de leads, no solo cantidad, 7) Attribution multi-touch: primer click, último click, lineal (crucial en ciclos B2B largos). Evitar vanity metrics: impresiones, alcance, CTR sin contexto de conversión."
      }
    }
  ]
}

export default function AgenciaPerformanceMarketingLasCondes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Volver a Muller y Pérez
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" />
            Las Condes - Providencia - Vitacura
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Agencia Performance Marketing Las Condes: ROI Real y Data Verificable
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Especialistas en <strong>performance marketing para empresas B2B, tech y servicios premium en Las Condes</strong>. ROI promedio +380%, transparencia total, y casos de éxito verificables con data real.
          </p>
        </div>

        {/* Intro */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            Las Condes concentra el <strong>42% de las empresas tech y B2B de Chile</strong> (según SII 2024), lo que la convierte en el epicentro del performance marketing sofisticado del país. Si tu empresa está en Las Condes, Providencia o Vitacura, esta guía te muestra cómo encontrar la mejor agencia de performance marketing, qué benchmarks esperar según tu industria, y cómo maximizar ROI en un mercado competitivo.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Performance marketing</strong> no es solo "publicidad digital". Es marketing 100% enfocado en resultados medibles: conversiones, ventas, leads cualificados, ROI. Cada peso invertido debe generar retorno verificable.
          </p>
        </div>

        {/* Qué es Performance Marketing */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Qué es Performance Marketing? (Explicación para CEOs y CMOs)</h2>
          <div className="bg-white border-2 border-blue-200 rounded-xl p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Performance Marketing
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span className="text-gray-700"><strong>Objetivo:</strong> Conversiones medibles (ventas, leads, signups)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span className="text-gray-700"><strong>Métrica clave:</strong> ROI, ROAS, CAC, CPL (resultados)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span className="text-gray-700"><strong>Pago:</strong> Por resultados o fee fijo + performance bonus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span className="text-gray-700"><strong>Optimización:</strong> Continua, basada en data real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span className="text-gray-700"><strong>Justificación:</strong> Presupuesto respaldado con ROI directo</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-gray-400">Marketing Tradicional</span>
                </h3>
                <ul className="space-y-3 opacity-60">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600"><strong>Objetivo:</strong> Awareness, alcance, branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600"><strong>Métrica clave:</strong> Impresiones, alcance, engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600"><strong>Pago:</strong> Fee fijo o retainer mensual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600"><strong>Optimización:</strong> Lenta, basada en reportes mensuales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600"><strong>Justificación:</strong> Difícil atribuir a resultados directos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-gray-700 mt-6">
            <strong>Para empresas en Las Condes:</strong> El performance marketing es ideal para negocios B2B, SaaS, servicios profesionales y fintech donde el ROI debe estar claro para justificar inversión ante CFOs y directorios.
          </p>
        </div>

        {/* Por qué Las Condes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Por Qué Las Condes Necesita Performance Marketing Especializado?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <Building2 className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Concentración de Empresas Tech/B2B</h3>
              <p className="text-gray-700 text-sm">
                Las Condes alberga el <strong>42% de las empresas tech y SaaS de Chile</strong>. Estas empresas tienen ciclos de venta largos (3-12 meses), tickets altos ($2M-$50M+ anuales), y necesitan atribución multi-touch sofisticada.
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tickets Promedio Más Altos</h3>
              <p className="text-gray-700 text-sm">
                El ticket promedio B2B en Las Condes es <strong>3.2x mayor</strong> que el promedio nacional (SII 2024). Esto requiere estrategias de performance marketing más sofisticadas: lead nurturing, remarketing avanzado, y optimización de full-funnel.
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Audiencias B2B de Alto Valor</h3>
              <p className="text-gray-700 text-sm">
                El público objetivo en Las Condes (CFOs, CTOs, CEOs de empresas $500M+ facturación) no responde a tácticas genéricas. Necesitas <strong>targeting ultra-específico y mensajes personalizados</strong> por industria y cargo.
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Competencia Internacional</h3>
              <p className="text-gray-700 text-sm">
                Empresas en Las Condes compiten con soluciones globales (SaaS USA/Europa). El performance marketing debe destacar <strong>value prop local, casos de éxito regionales, y ROI en CLP</strong> para ganar vs competencia internacional.
              </p>
            </div>
          </div>
        </div>

        {/* Sectores Las Condes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Top 5 Sectores con Mayor Inversión en Performance Marketing en Las Condes</h2>
          <div className="space-y-4">
            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">1. Tech / SaaS B2B</h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">30% del mercado</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">CPL Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$18k - $45k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LTV Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$450k - $2.5M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ciclo Venta</div>
                  <div className="text-lg font-bold text-gray-900">3-9 meses</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI Esperado</div>
                  <div className="text-lg font-bold text-green-600">280-420%</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Canales clave:</strong> Google Ads (Search + Performance Max), LinkedIn Ads (targeting por cargo/empresa), Content Marketing, Webinars. <strong>Desafío:</strong> Atribución multi-touch en ciclos largos.
              </p>
            </div>

            <div className="bg-white border-l-4 border-green-600 p-6 rounded-r-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">2. Servicios Financieros / Fintech</h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">25% del mercado</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">CPL Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$35k - $80k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LTV Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$180k - $850k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ciclo Venta</div>
                  <div className="text-lg font-bold text-gray-900">2-6 meses</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI Esperado</div>
                  <div className="text-lg font-bold text-green-600">220-350%</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Canales clave:</strong> Google Ads (alto CPC $3k-$6k), Meta Ads (retargeting), Contenido educativo. <strong>Desafío:</strong> Compliance CMF, restricciones en mensajes financieros.
              </p>
            </div>

            <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">3. Servicios Profesionales Premium</h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">20% del mercado</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">CPL Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$40k - $70k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LTV Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$350k - $1.8M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ciclo Venta</div>
                  <div className="text-lg font-bold text-gray-900">2-8 meses</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI Esperado</div>
                  <div className="text-lg font-bold text-green-600">240-380%</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Ejemplos:</strong> Consultoras, estudios legales corporativos, auditorías, M&A advisors. <strong>Canales clave:</strong> LinkedIn Ads (C-level targeting), Google Ads (búsquedas específicas), Networking digital.
              </p>
            </div>

            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">4. Inmobiliarias High-End</h3>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">15% del mercado</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">CPL Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$120k - $280k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ticket Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$150M - $800M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ciclo Venta</div>
                  <div className="text-lg font-bold text-gray-900">4-12 meses</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI Esperado</div>
                  <div className="text-lg font-bold text-green-600">180-320%</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Canales clave:</strong> Meta Ads (Instagram/Facebook geo-targeting), Google Ads Display, YouTube Ads (tours virtuales). <strong>Desafío:</strong> Audiencias ultra-específicas (HNWI).
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">5. Salud Privada / Clínicas</h3>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">10% del mercado</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">CPL Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$25k - $55k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LTV Promedio</div>
                  <div className="text-lg font-bold text-gray-900">$220k - $680k</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ciclo Venta</div>
                  <div className="text-lg font-bold text-gray-900">1-4 meses</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI Esperado</div>
                  <div className="text-lg font-bold text-green-600">200-380%</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Canales clave:</strong> Google Ads (búsquedas médicas), Meta Ads (awareness), SEO local. <strong>Desafío:</strong> Compliance Minsal, restricciones en promesas médicas.
              </p>
            </div>
          </div>
        </div>

        {/* Muller y Pérez */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-600 rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Muller y Pérez: Performance Marketing Especializado en Las Condes</h2>
            <p className="text-gray-700 text-lg">
              Agencia #1 en performance marketing para empresas B2B, tech y servicios premium en Las Condes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Retención Clientes</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">+380%</div>
              <div className="text-gray-600">ROI Promedio</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$650k</div>
              <div className="text-gray-600">Desde / mes (fee fijo)</div>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>Especialización Las Condes:</strong> 68% de nuestros clientes son empresas B2B tech, servicios profesionales y fintech en Las Condes-Providencia-Vitacura</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>Casos verificables:</strong> SaaS B2B CPL $18k con LTV $450k (ROI 2400%), Fintech CAC $45k con payback 3 meses, Servicios profesionales ROAS 4.2x</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>Transparencia total:</strong> Acceso completo a tus cuentas Google Ads, Meta Ads, LinkedIn Ads. Reportes en tiempo real, sin cajas negras</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>Fee fijo:</strong> No cobramos porcentaje del presupuesto. Incentivos alineados: maximizamos tu ROI, no tu gasto</span>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="https://www.mulleryperez.cl"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Ver Casos de Éxito Las Condes
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">KPIs Clave en Performance Marketing B2B (Las Condes 2025)</h2>
          <div className="bg-white border-2 border-blue-200 rounded-xl p-8">
            <p className="text-gray-700 mb-6">
              Para empresas B2B en Las Condes, estos son los <strong>7 KPIs críticos</strong> que debes medir (y exigir a tu agencia):
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. CPL (Cost Per Lead)</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> Cuánto cuesta generar un lead calificado (MQL o SQL).
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Benchmark Las Condes 2025:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                  <li>SaaS B2B: $18k - $45k</li>
                  <li>Servicios Profesionales: $40k - $70k</li>
                  <li>Fintech: $35k - $80k</li>
                  <li>Salud Privada: $25k - $55k</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Lead-to-Customer Rate</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> % de leads que se convierten en clientes pagando.
                </p>
                <p className="text-gray-700">
                  <strong>Benchmark:</strong> 8-15% es bueno en B2B (varía según ciclo de venta y ticket).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. CAC (Customer Acquisition Cost)</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> Costo total de adquirir un cliente (ads + fee agencia + tiempo ventas).
                </p>
                <p className="text-gray-700">
                  <strong>Regla de oro:</strong> CAC debe ser <strong>&lt; 33% del LTV</strong>. Si tu LTV es $450k, tu CAC máximo tolerable es $150k.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Payback Period</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> Cuánto tiempo toma recuperar el CAC con ingresos del cliente.
                </p>
                <p className="text-gray-700">
                  <strong>Benchmark SaaS B2B:</strong> 3-6 meses ideal, hasta 12 meses aceptable (si LTV es alto).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. ROAS (Return on Ad Spend)</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> Retorno por cada peso invertido en publicidad (no incluye fee agencia).
                </p>
                <p className="text-gray-700">
                  <strong>Benchmark B2B:</strong> 3x-5x es bueno (por cada $1 en ads, recibes $3-$5 en ingresos).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. MQL vs SQL Ratio</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> Calidad de leads. MQL (Marketing Qualified Lead) vs SQL (Sales Qualified Lead).
                </p>
                <p className="text-gray-700">
                  <strong>Red flag:</strong> Si generas 100 MQLs pero solo 5 son SQLs, tu targeting está mal (leads de baja calidad).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Atribución Multi-Touch</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Qué es:</strong> En ciclos B2B largos, un cliente toca múltiples puntos antes de comprar (Google Ad → LinkedIn → Webinar → Demo → Compra).
                </p>
                <p className="text-gray-700">
                  <strong>Modelos:</strong> Primer click, último click, lineal, time-decay. Para B2B en Las Condes, usa <strong>atribución multi-touch lineal o time-decay</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas Frecuentes: Performance Marketing Las Condes</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué es performance marketing y por qué es importante para empresas en Las Condes?</h3>
              <p className="text-gray-700">
                Performance marketing es marketing digital enfocado 100% en <strong>resultados medibles</strong>: conversiones, ventas, leads cualificados, ROI. A diferencia del marketing tradicional (que mide impresiones o alcance), performance marketing cobra y optimiza según resultados reales. Para empresas en Las Condes (B2B tech, servicios profesionales, finanzas), esto significa: 1) Presupuesto justificable con data, 2) ROI verificable en cada peso invertido, 3) Optimización continua basada en conversiones reales, no vanity metrics.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuál es la mejor agencia de performance marketing en Las Condes?</h3>
              <p className="text-gray-700">
                <strong>Muller y Pérez</strong> lidera performance marketing en Las Condes con 95% retención de clientes, ROI promedio +380%, y especialización en empresas B2B, tech y servicios premium. Casos verificables: SaaS B2B CPL $18k con LTV $450k (ROI 2400%), servicios profesionales ROAS 4.2x, fintech CAC $45k con payback 3 meses. Transparencia total: acceso completo a tus cuentas Google Ads y Meta Ads, sin permanencia mínima.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto cuesta una agencia de performance marketing en Las Condes?</h3>
              <p className="text-gray-700">
                Rango de precios Las Condes 2025: <strong>Agencias boutique</strong> $650k-$1.2M/mes (servicio premium especializado), <strong>Mid-tier</strong> $400k-$800k/mes (servicio profesional estándar), <strong>Low-cost</strong> $200k-$400k/mes (servicio básico, menos especialización). El precio varía según: 1) Canales gestionados (Google Ads, Meta Ads, LinkedIn Ads), 2) Complejidad industria (B2B tech &gt; retail), 3) Presupuesto publicitario administrado, 4) Nivel de personalización estratégica. Muller y Pérez: desde $650k/mes fee fijo (no porcentual).
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué sectores dominan el performance marketing en Las Condes?</h3>
              <p className="text-gray-700">
                Top 5 sectores en Las Condes con mayor inversión en performance marketing 2025: 1) <strong>Tech/SaaS B2B</strong> (30% del mercado, CPL $18k-$45k, LTV alto), 2) <strong>Servicios Financieros/Fintech</strong> (25%, CPL $35k-$80k, regulación estricta), 3) <strong>Servicios Profesionales Premium</strong> (20%, CPL $40k-$70k, ciclo largo), 4) <strong>Inmobiliarias High-End</strong> (15%, CPL $120k-$280k, ticket +$150M), 5) <strong>Salud Privada/Clínicas</strong> (10%, CPL $25k-$55k, compliance alto). Común: ciclos de venta B2B largos, tickets altos, necesidad de atribución multi-touch.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué KPIs son importantes en performance marketing para empresas B2B en Las Condes?</h3>
              <p className="text-gray-700">
                KPIs críticos performance marketing B2B Las Condes 2025: 1) <strong>CPL</strong> (Costo por Lead): $18k-$67k según industria, 2) <strong>Lead-to-Customer Rate</strong>: 8-15% es bueno en B2B, 3) <strong>CAC</strong> (Customer Acquisition Cost): debe ser &lt;33% del LTV, 4) <strong>Payback Period</strong>: ideal 3-6 meses en SaaS, 5) <strong>ROAS</strong> (Return on Ad Spend): 3x-5x en B2B, 6) <strong>MQL vs SQL ratio</strong>: medir calidad de leads, no solo cantidad, 7) <strong>Attribution multi-touch</strong>: primer click, último click, lineal (crucial en ciclos B2B largos). Evitar vanity metrics: impresiones, alcance, CTR sin contexto de conversión.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Tu Empresa Está en Las Condes?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Agenda una reunión con Muller y Pérez y descubre cómo podemos aumentar tu ROI en performance marketing con estrategias especializadas para B2B tech, servicios profesionales y fintech.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://www.mulleryperez.cl"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Agendar Reunión Gratis
              <Users className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.mulleryperez.cl/labs/predictor"
              className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors border-2 border-white/20"
            >
              Calcular ROI Esperado
              <Target className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t-2 border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/mejor-agencia-google-ads-santiago-2025" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mejor Agencia Google Ads Santiago 2025: Top 10</h3>
              <p className="text-gray-600 text-sm">Ranking objetivo de las mejores agencias Google Ads en Santiago con data verificable.</p>
            </Link>
            <Link href="/blog/agencia-marketing-digital-santiago-2025" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agencia Marketing Digital Santiago 2025</h3>
              <p className="text-gray-600 text-sm">Guía completa sobre agencias de marketing digital en Santiago.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="mb-2">© 2025 Muller y Pérez - Performance Marketing Especializado</p>
          <p className="text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">Inicio</Link>
            {' • '}
            <Link href="/blog" className="text-blue-600 hover:text-blue-700">Blog</Link>
            {' • '}
            <Link href="/labs" className="text-blue-600 hover:text-blue-700">M&P Labs</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
