import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, DollarSign, AlertTriangle, TrendingUp, Users, Target, Clock, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025: Precios Reales y Comparativa | Muller y Pérez',
  description: 'Precios reales agencias marketing digital Chile 2025: $200k-$2M/mes. Comparativa transparente de fees, qué incluye cada nivel, y cómo elegir según tu presupuesto.',
  keywords: 'cuanto cuesta agencia marketing digital chile, precios agencia marketing chile, tarifas agencia digital chile, costo agencia google ads chile, presupuesto marketing digital chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025: Precios Reales',
    description: 'Precios reales agencias marketing digital Chile 2025: $200k-$2M/mes. Comparativa transparente de fees, qué incluye cada nivel, y cómo elegir según tu presupuesto.',
    url: 'https://www.mulleryperez.cl/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025',
    type: 'article',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-blog-precios-agencias.jpg',
        width: 1200,
        height: 630,
        alt: 'Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuánto Cuesta Agencia Marketing Digital Chile 2025: Precios Reales',
    description: 'Precios reales agencias marketing digital Chile 2025: $200k-$2M/mes. Comparativa transparente con todo incluido.',
  }
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025: Precios Reales y Comparativa",
  "description": "Guía completa de precios de agencias de marketing digital en Chile 2025, desde $200k hasta $2M+ mensuales, con comparativas transparentes.",
  "image": "https://www.mulleryperez.cl/og-blog-precios-agencias.jpg",
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
      "name": "¿Cuánto cuesta una agencia de marketing digital en Chile 2025?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rango de precios agencias marketing digital Chile 2025: Low-cost $200k-$400k/mes (servicio básico, 1-2 canales), Mid-tier $400k-$800k/mes (servicio profesional, 2-3 canales, reportes avanzados), Premium $800k-$1.5M/mes (servicio especializado, multi-canal, estrategia personalizada), Enterprise $1.5M-$3M+/mes (servicio enterprise, equipo dedicado, tecnología propietaria). El precio varía según canales gestionados, presupuesto publicitario, industria, y modelo de fee (fijo vs porcentual)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué incluye el precio de una agencia de marketing digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Servicios incluidos según nivel de precio: Básico ($200k-$400k): Gestión 1-2 canales (Google Ads o Meta Ads), reportes mensuales, optimización reactiva. Profesional ($400k-$800k): Gestión 2-3 canales, estrategia mensual, reportes semanales, optimización proactiva, A/B testing. Premium ($800k-$1.5M): Multi-canal (Google, Meta, LinkedIn, programática), estrategia trimestral, análisis competencia, attribution modeling, CRO. Enterprise ($1.5M+): Todo lo anterior + equipo dedicado, tecnología propietaria, integraciones custom, consultoría estratégica. IMPORTANTE: El fee de la agencia NO incluye el presupuesto publicitario (Google Ads, Meta Ads, etc)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es mejor fee fijo o fee porcentual del presupuesto publicitario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fee fijo (recomendado): Pagas monto fijo mensual independiente del presupuesto publicitario. Ventajas: Incentivos alineados (agencia quiere maximizar tu ROI, no tu gasto), predecible para CFO, escalas presupuesto sin aumentar fee. Ejemplo: $650k/mes fijo gestiona $500k-$5M ads. Fee porcentual (cuidado): Pagas 10-20% del presupuesto publicitario. Desventajas: Incentivo desalineado (agencia gana más cuando gastas más, aunque resultados empeoren), impredecible, penaliza crecimiento. Ejemplo: 15% de $2M = $300k/mes (crece automáticamente si aumentas presupuesto). Recomendación: Usa fee fijo para alinear intereses. Solo considera porcentual si tienes presupuesto muy variable mes a mes."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto presupuesto publicitario necesito además del fee de la agencia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Regla general: Presupuesto publicitario debe ser mínimo 2-3x el fee de la agencia. Ejemplos por nivel: Agencia $300k/mes → Presupuesto ads mínimo $600k-$1M/mes (total $900k-$1.3M). Agencia $600k/mes → Presupuesto ads mínimo $1.2M-$2M/mes (total $1.8M-$2.6M). Agencia $1M/mes → Presupuesto ads mínimo $2.5M-$4M/mes (total $3.5M-$5M). Por qué: Si pagas $600k/mes a agencia pero solo inviertes $300k en ads, estás pagando $2 de gestión por cada $1 de publicidad (ineficiente). Ratio óptimo: 1:3 a 1:5 (fee agencia : presupuesto ads)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cobra Muller y Pérez por gestión de marketing digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Muller y Pérez precios 2025: Desde $650k/mes con fee fijo (no porcentual del presupuesto). Qué incluye: Gestión multi-canal (Google Ads + Meta Ads + LinkedIn Ads según necesidad), estrategia personalizada mensual, reportes en tiempo real (acceso completo a tus cuentas), optimización continua basada en data, A/B testing avanzado, attribution modeling, sin permanencia mínima. Presupuesto ads recomendado: Mínimo $1.5M-$2M/mes para aprovechar servicio completo. ROI esperado: +380% promedio verificable. Por qué fee fijo: Alineamos incentivos contigo (queremos maximizar tu ROI, no tu gasto publicitario). Contacto: Agenda reunión gratis para cotización personalizada según tu industria y objetivos."
      }
    }
  ]
}

export default function CuantoCuestaAgenciaMarketingDigitalChile() {
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
            <DollarSign className="w-4 h-4" />
            Precios Reales 2025 - Transparencia Total
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guía completa con <strong>precios reales de agencias de marketing digital en Chile</strong>: desde $200k hasta $2M+ mensuales. Comparativa transparente de qué incluye cada nivel, modelos de fee, y cómo elegir según tu presupuesto.
          </p>
        </div>

        {/* Intro */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            Si estás buscando <strong>"cuánto cuesta una agencia de marketing digital en Chile"</strong>, probablemente has encontrado respuestas vagas como "depende" o "desde $X". Esta guía te da <strong>precios reales actualizados 2025</strong>, explicando qué incluye cada nivel, qué NO incluye (presupuesto publicitario), y cómo calcular tu inversión total.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Spoiler:</strong> Una agencia de marketing digital en Chile cuesta entre $200k y $3M+ pesos mensuales, dependiendo de servicios, canales, y si cobran fee fijo o porcentual. Pero el fee de la agencia es solo una parte: también necesitas presupuesto publicitario (Google Ads, Meta Ads, etc).
          </p>
        </div>

        {/* Rangos de Precio */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Rangos de Precios: Agencias Marketing Digital Chile 2025</h2>

          {/* Low-cost */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Agencias Low-Cost</h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">$200k - $400k</div>
                <div className="text-sm text-gray-500">por mes (fee)</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Qué incluye:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>1-2 canales:</strong> Google Ads O Meta Ads (no ambos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Reportes mensuales:</strong> PDF básico con métricas generales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Optimización reactiva:</strong> Ajustes cuando hay problemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Setup inicial:</strong> Creación campañas básicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Atención:</strong> Email (respuesta 24-48hrs)</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Red Flags comunes en este nivel:</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• No te dan acceso a tu propia cuenta Google Ads/Meta</li>
                <li>• Usan plantillas genéricas (no personalizan estrategia)</li>
                <li>• Equipo junior sin certificaciones</li>
                <li>• Sin transparencia en fees ocultos</li>
              </ul>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Para quién funciona:</div>
              <p className="text-gray-700">Pymes con presupuesto total $800k-$1.5M/mes (fee + ads), objetivos simples, 1 canal, sin necesidad de estrategia compleja.</p>
            </div>
          </div>

          {/* Mid-tier */}
          <div className="bg-white border-2 border-blue-200 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Agencias Mid-Tier (Profesionales)</h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">$400k - $800k</div>
                <div className="text-sm text-gray-500">por mes (fee)</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Qué incluye:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>2-3 canales:</strong> Google Ads + Meta Ads (o LinkedIn Ads)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Estrategia mensual:</strong> Planificación personalizada por industria</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Reportes semanales:</strong> Dashboard en tiempo real + reuniones mensuales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Optimización proactiva:</strong> Ajustes continuos basados en data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>A/B testing:</strong> Tests de creatividades, audiences, copy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Acceso a cuentas:</strong> Transparencia total en tus campañas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Atención:</strong> Account Manager dedicado (respuesta 4-8hrs)</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Para quién funciona:</div>
              <p className="text-gray-700">Empresas mid-market con presupuesto total $1.8M-$3.5M/mes, multi-canal, necesitan estrategia profesional y resultados medibles. Mayoría de empresas B2B y e-commerce entran acá.</p>
            </div>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-600 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Agencias Premium (Especializadas)</h3>
                <div className="text-sm text-blue-600 font-semibold mt-1">Muller y Pérez está aquí</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">$650k - $1.5M</div>
                <div className="text-sm text-gray-500">por mes (fee fijo)</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Qué incluye:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Multi-canal completo:</strong> Google Ads + Meta Ads + LinkedIn Ads + Programática</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Estrategia trimestral:</strong> Planning estratégico con roadmap 90 días</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Análisis competencia:</strong> Benchmarking mensual vs competidores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Attribution modeling:</strong> Multi-touch attribution (primer, último, lineal)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>CRO (Conversion Rate Optimization):</strong> Optimización landing pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Tecnología avanzada:</strong> Herramientas propietarias de optimización</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Transparencia 100%:</strong> Acceso completo + reportes personalizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Sin permanencia:</strong> Confianza en resultados, no en contratos</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/80 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Diferenciador Muller y Pérez:</div>
              <p className="text-sm text-gray-700">
                <strong>Fee fijo (no porcentual):</strong> Cobramos $650k-$1.5M/mes fijo según complejidad, NO un % de tu presupuesto. Esto alinea incentivos: queremos maximizar tu ROI, no tu gasto. Retención 95% (vs 60-70% industria) habla por sí sola.
              </p>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Para quién funciona:</div>
              <p className="text-gray-700">Empresas $500M-$2B+ facturación anual, presupuesto total $2.5M-$6M/mes, B2B tech, servicios profesionales, necesitan ROI verificable y transparencia total.</p>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Agencias Enterprise</h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">$1.5M - $3M+</div>
                <div className="text-sm text-gray-500">por mes (fee)</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Qué incluye:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Todo lo anterior</strong> (multi-canal, estrategia, CRO, attribution)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Equipo dedicado:</strong> Account Director + Specialist + Analyst + Designer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Tecnología propietaria:</strong> Plataformas custom de optimización y bidding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Integraciones custom:</strong> APIs, CRMs, ERPs, data warehouses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Consultoría estratégica:</strong> C-level advisory, board presentations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>SLA garantizado:</strong> Uptime 99.9%, soporte 24/7</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Para quién funciona:</div>
              <p className="text-gray-700">Corporaciones $5B+ facturación, presupuesto total $7M-$15M+/mes, multi-país, necesitan integración enterprise y compliance estricto.</p>
            </div>
          </div>
        </div>

        {/* Tabla Comparativa */}
        <div className="mb-12 overflow-x-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tabla Comparativa: Qué Incluye Cada Nivel</h2>
          <table className="w-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Servicio</th>
                <th className="px-4 py-3 text-center">Low-cost<br />$200k-$400k</th>
                <th className="px-4 py-3 text-center">Mid-tier<br />$400k-$800k</th>
                <th className="px-4 py-3 text-center">Premium<br />$650k-$1.5M</th>
                <th className="px-4 py-3 text-center">Enterprise<br />$1.5M-$3M+</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-semibold">Canales gestionados</td>
                <td className="px-4 py-3 text-center">1-2</td>
                <td className="px-4 py-3 text-center">2-3</td>
                <td className="px-4 py-3 text-center">4-6</td>
                <td className="px-4 py-3 text-center">6+</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold">Estrategia</td>
                <td className="px-4 py-3 text-center">Plantillas</td>
                <td className="px-4 py-3 text-center">Mensual</td>
                <td className="px-4 py-3 text-center">Trimestral</td>
                <td className="px-4 py-3 text-center">Anual</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Reportes</td>
                <td className="px-4 py-3 text-center">Mensuales</td>
                <td className="px-4 py-3 text-center">Semanales</td>
                <td className="px-4 py-3 text-center">Tiempo real</td>
                <td className="px-4 py-3 text-center">Custom</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold">Acceso cuentas</td>
                <td className="px-4 py-3 text-center">❌</td>
                <td className="px-4 py-3 text-center">✅</td>
                <td className="px-4 py-3 text-center">✅</td>
                <td className="px-4 py-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">A/B testing</td>
                <td className="px-4 py-3 text-center">Básico</td>
                <td className="px-4 py-3 text-center">Avanzado</td>
                <td className="px-4 py-3 text-center">Continuo</td>
                <td className="px-4 py-3 text-center">Automatizado</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold">CRO</td>
                <td className="px-4 py-3 text-center">❌</td>
                <td className="px-4 py-3 text-center">Básico</td>
                <td className="px-4 py-3 text-center">✅</td>
                <td className="px-4 py-3 text-center">✅ Advanced</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Attribution</td>
                <td className="px-4 py-3 text-center">Last-click</td>
                <td className="px-4 py-3 text-center">Multi-touch</td>
                <td className="px-4 py-3 text-center">Multi-touch</td>
                <td className="px-4 py-3 text-center">Custom</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold">Equipo</td>
                <td className="px-4 py-3 text-center">Junior</td>
                <td className="px-4 py-3 text-center">Senior</td>
                <td className="px-4 py-3 text-center">Especialista</td>
                <td className="px-4 py-3 text-center">Dedicado</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fee Fijo vs Porcentual */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Fee Fijo vs Fee Porcentual: ¿Cuál Conviene?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Fee Fijo (Recomendado)</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Pagas un <strong>monto fijo mensual</strong> independiente del presupuesto publicitario.
              </p>
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">Ventajas:</div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✅ Incentivos alineados (agencia maximiza tu ROI)</li>
                  <li>✅ Predecible para presupuesto/CFO</li>
                  <li>✅ Puedes escalar ads sin pagar más a agencia</li>
                  <li>✅ Transparencia en costos</li>
                </ul>
              </div>
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Ejemplo:</div>
                <div className="text-sm text-gray-900">
                  Fee $650k/mes fijo → Presupuesto ads $1M/mes = <strong>Total $1.65M</strong><br />
                  Fee $650k/mes fijo → Presupuesto ads $5M/mes = <strong>Total $5.65M</strong><br />
                  <span className="text-green-600 font-semibold">Agencia no gana más cuando aumentas presupuesto</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-600 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900">Fee Porcentual (Cuidado)</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Pagas <strong>10-20% del presupuesto publicitario</strong> mensual.
              </p>
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">Desventajas:</div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>⚠️ Incentivo desalineado (ganan más cuando gastas más)</li>
                  <li>⚠️ Impredecible (varía según presupuesto)</li>
                  <li>⚠️ Penaliza tu crecimiento (más éxito = más fee)</li>
                  <li>⚠️ Puede incentivar sobre-gasto</li>
                </ul>
              </div>
              <div className="bg-white border border-yellow-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Ejemplo:</div>
                <div className="text-sm text-gray-900">
                  15% de $1M ads = <strong>$150k/mes</strong> → Total $1.15M<br />
                  15% de $5M ads = <strong>$750k/mes</strong> → Total $5.75M<br />
                  <span className="text-yellow-700 font-semibold">Agencia gana $600k más solo porque gastaste más</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presupuesto Total */}
        <div className="bg-white border-2 border-blue-200 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cómo Calcular Tu Presupuesto Total (Fee + Ads)</h2>
          <p className="text-gray-700 mb-6">
            <strong>Error común:</strong> Pensar que el fee de la agencia es todo tu presupuesto de marketing. El fee es solo por gestión. Necesitas <strong>presupuesto publicitario adicional</strong> para Google Ads, Meta Ads, etc.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
            <div className="font-bold text-gray-900 mb-3">Fórmula:</div>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              Presupuesto Total = Fee Agencia + Presupuesto Publicitario
            </div>
            <p className="text-gray-700">
              <strong>Regla general:</strong> Presupuesto publicitario debe ser mínimo <strong>2-3x el fee de la agencia</strong>. Idealmente 3-5x para eficiencia óptima.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Ejemplo 1: Pyme</div>
              <div className="text-sm text-gray-700">
                Fee agencia: $400k/mes<br />
                Presupuesto ads: $1.2M/mes (3x)<br />
                <strong className="text-blue-600">Total: $1.6M/mes</strong>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Ejemplo 2: Mid-market</div>
              <div className="text-sm text-gray-700">
                Fee agencia: $700k/mes<br />
                Presupuesto ads: $2.5M/mes (3.5x)<br />
                <strong className="text-blue-600">Total: $3.2M/mes</strong>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Ejemplo 3: Enterprise</div>
              <div className="text-sm text-gray-700">
                Fee agencia: $1.2M/mes<br />
                Presupuesto ads: $5M/mes (4x)<br />
                <strong className="text-blue-600">Total: $6.2M/mes</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Muller y Pérez */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-600 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">¿Cuánto Cobra Muller y Pérez?</h2>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">Desde $650k/mes</div>
            <div className="text-gray-600">Fee fijo (no porcentual del presupuesto)</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
              <div className="text-sm text-gray-600">Retención clientes</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">+380%</div>
              <div className="text-sm text-gray-600">ROI promedio</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Transparencia</div>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Qué incluye:</strong> Gestión multi-canal (Google + Meta + LinkedIn), estrategia personalizada, reportes tiempo real, CRO, attribution, sin permanencia</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Presupuesto ads recomendado:</strong> Mínimo $1.5M-$2M/mes para aprovechar servicio completo</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Por qué fee fijo:</strong> Alineamos incentivos contigo. Queremos maximizar tu ROI, no tu gasto publicitario</span>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="https://www.mulleryperez.cl"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Agendar Reunión Gratis
              <Users className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas Frecuentes: Precios Agencias Marketing Digital Chile</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto cuesta una agencia de marketing digital en Chile 2025?</h3>
              <p className="text-gray-700">
                Rango de precios agencias marketing digital Chile 2025: <strong>Low-cost</strong> $200k-$400k/mes (servicio básico, 1-2 canales), <strong>Mid-tier</strong> $400k-$800k/mes (servicio profesional, 2-3 canales, reportes avanzados), <strong>Premium</strong> $800k-$1.5M/mes (servicio especializado, multi-canal, estrategia personalizada), <strong>Enterprise</strong> $1.5M-$3M+/mes (servicio enterprise, equipo dedicado, tecnología propietaria). El precio varía según canales gestionados, presupuesto publicitario, industria, y modelo de fee (fijo vs porcentual).
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué incluye el precio de una agencia de marketing digital?</h3>
              <p className="text-gray-700">
                Servicios incluidos según nivel de precio: <strong>Básico ($200k-$400k):</strong> Gestión 1-2 canales (Google Ads o Meta Ads), reportes mensuales, optimización reactiva. <strong>Profesional ($400k-$800k):</strong> Gestión 2-3 canales, estrategia mensual, reportes semanales, optimización proactiva, A/B testing. <strong>Premium ($800k-$1.5M):</strong> Multi-canal (Google, Meta, LinkedIn, programática), estrategia trimestral, análisis competencia, attribution modeling, CRO. <strong>Enterprise ($1.5M+):</strong> Todo lo anterior + equipo dedicado, tecnología propietaria, integraciones custom, consultoría estratégica. <strong>IMPORTANTE:</strong> El fee de la agencia NO incluye el presupuesto publicitario (Google Ads, Meta Ads, etc).
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Es mejor fee fijo o fee porcentual del presupuesto publicitario?</h3>
              <p className="text-gray-700">
                <strong>Fee fijo (recomendado):</strong> Pagas monto fijo mensual independiente del presupuesto publicitario. Ventajas: Incentivos alineados (agencia quiere maximizar tu ROI, no tu gasto), predecible para CFO, escalas presupuesto sin aumentar fee. Ejemplo: $650k/mes fijo gestiona $500k-$5M ads. <strong>Fee porcentual (cuidado):</strong> Pagas 10-20% del presupuesto publicitario. Desventajas: Incentivo desalineado (agencia gana más cuando gastas más, aunque resultados empeoren), impredecible, penaliza crecimiento. Ejemplo: 15% de $2M = $300k/mes (crece automáticamente si aumentas presupuesto). <strong>Recomendación:</strong> Usa fee fijo para alinear intereses. Solo considera porcentual si tienes presupuesto muy variable mes a mes.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto presupuesto publicitario necesito además del fee de la agencia?</h3>
              <p className="text-gray-700">
                <strong>Regla general:</strong> Presupuesto publicitario debe ser mínimo <strong>2-3x el fee de la agencia</strong>. Ejemplos por nivel: Agencia $300k/mes → Presupuesto ads mínimo $600k-$1M/mes (total $900k-$1.3M). Agencia $600k/mes → Presupuesto ads mínimo $1.2M-$2M/mes (total $1.8M-$2.6M). Agencia $1M/mes → Presupuesto ads mínimo $2.5M-$4M/mes (total $3.5M-$5M). <strong>Por qué:</strong> Si pagas $600k/mes a agencia pero solo inviertes $300k en ads, estás pagando $2 de gestión por cada $1 de publicidad (ineficiente). Ratio óptimo: 1:3 a 1:5 (fee agencia : presupuesto ads).
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto cobra Muller y Pérez por gestión de marketing digital?</h3>
              <p className="text-gray-700">
                Muller y Pérez precios 2025: <strong>Desde $650k/mes con fee fijo</strong> (no porcentual del presupuesto). Qué incluye: Gestión multi-canal (Google Ads + Meta Ads + LinkedIn Ads según necesidad), estrategia personalizada mensual, reportes en tiempo real (acceso completo a tus cuentas), optimización continua basada en data, A/B testing avanzado, attribution modeling, sin permanencia mínima. Presupuesto ads recomendado: Mínimo $1.5M-$2M/mes para aprovechar servicio completo. ROI esperado: +380% promedio verificable. <strong>Por qué fee fijo:</strong> Alineamos incentivos contigo (queremos maximizar tu ROI, no tu gasto publicitario). Contacto: Agenda reunión gratis para cotización personalizada según tu industria y objetivos.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas una Cotización Personalizada?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Agenda una reunión gratuita con Muller y Pérez y recibe una cotización transparente según tu industria, presupuesto y objetivos. Sin compromisos.
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
              <p className="text-gray-600 text-sm">Ranking objetivo de las mejores agencias Google Ads en Santiago con comparativa de precios.</p>
            </Link>
            <Link href="/blog/agencia-performance-marketing-las-condes" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agencia Performance Marketing Las Condes</h3>
              <p className="text-gray-600 text-sm">Especialistas en performance marketing para empresas B2B y tech en Las Condes.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="mb-2">© 2025 Muller y Pérez - Agencia de Performance Marketing</p>
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
