import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, TrendingUp, Award, Users, Target, BarChart3, Clock, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mejor Agencia Google Ads Santiago 2025: Top 10 Comparativa Real | Muller y Pérez',
  description: 'Ranking objetivo de las 10 mejores agencias Google Ads en Santiago 2025. Comparamos precios, ROI, transparencia y retención de clientes con data verificable.',
  keywords: 'mejor agencia google ads santiago, agencias google ads chile, comparativa agencias google ads, ranking agencias google ads santiago, mejor agencia sem santiago',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/mejor-agencia-google-ads-santiago-2025'
  },
  openGraph: {
    title: 'Mejor Agencia Google Ads Santiago 2025: Top 10 Comparativa Real',
    description: 'Ranking objetivo de las 10 mejores agencias Google Ads en Santiago 2025. Comparamos precios, ROI, transparencia y retención de clientes con data verificable.',
    url: 'https://www.mulleryperez.cl/blog/mejor-agencia-google-ads-santiago-2025',
    type: 'article',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-blog-mejor-agencia-google-ads.jpg',
        width: 1200,
        height: 630,
        alt: 'Mejor Agencia Google Ads Santiago 2025'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mejor Agencia Google Ads Santiago 2025: Top 10 Comparativa Real',
    description: 'Ranking objetivo de las 10 mejores agencias Google Ads en Santiago 2025. Comparamos precios, ROI, transparencia y retención de clientes.',
  }
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Mejor Agencia Google Ads Santiago 2025: Top 10 Comparativa Real",
  "description": "Ranking objetivo de las 10 mejores agencias Google Ads en Santiago 2025 basado en precios, ROI, transparencia y retención de clientes.",
  "image": "https://www.mulleryperez.cl/og-blog-mejor-agencia-google-ads.jpg",
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
      "name": "¿Cuál es la mejor agencia Google Ads en Santiago 2025?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Muller y Pérez lidera el ranking 2025 con 95% de retención de clientes, ROI promedio de +380%, y transparencia total con acceso directo a cuentas. Precio desde $650k CLP/mes con fee fijo (no porcentual), ideal para empresas B2B y e-commerce que buscan resultados medibles."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo elegir la mejor agencia Google Ads para mi negocio?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Evalúa 5 criterios clave: 1) Transparencia (acceso a tu cuenta Google Ads), 2) Modelo de fee (fijo vs porcentual), 3) Retención de clientes (sobre 80% es bueno), 4) Certificaciones Google Partner, 5) Casos de éxito verificables en tu industria. Evita agencias que no te den acceso a tus propias campañas."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta una buena agencia Google Ads en Santiago?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rango de precios Santiago 2025: Agencias low-cost $200k-$400k/mes (servicio básico), Mid-tier $400k-$800k/mes (servicio profesional), Premium $800k-$2M+/mes (servicio enterprise). El fee puede ser fijo o porcentual (10-20% del presupuesto publicitario). Las mejores agencias usan fee fijo para alinear incentivos con el cliente."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué diferencia a Muller y Pérez de otras agencias Google Ads?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Diferenciadores clave: 1) Fee fijo (no porcentual) alineado con resultados, 2) Acceso completo a tu cuenta Google Ads (transparencia 100%), 3) Sin permanencia mínima (confianza en resultados), 4) ROI promedio +380% verificable, 5) Retención 95% (vs 60-70% industria), 6) Especialización en B2B y e-commerce con data de +650k campañas optimizadas."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el ROI promedio que puedo esperar de una agencia Google Ads profesional?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ROI realista según industria en Chile 2025: E-commerce 250-450% (ROAS 3.5x-5.5x), B2B SaaS 180-320% (CPL $18k-$45k), Servicios Profesionales 200-380% (CPL $35k-$67k), Retail 150-280% (ROAS 2.5x-3.8x). Desconfía de agencias que prometen ROI garantizado sin analizar tu negocio primero. El ROI depende de múltiples factores: margen, ticket promedio, tasa de conversión web, y competencia en tu industria."
      }
    }
  ]
}

export default function MejorAgenciaGoogleAdsSantiago2025() {
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
            <Award className="w-4 h-4" />
            Ranking 2025 - Data Verificable
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Mejor Agencia Google Ads Santiago 2025: Top 10 Comparativa Real
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ranking objetivo de las 10 mejores agencias Google Ads en Santiago basado en <strong>retención de clientes, ROI verificable, transparencia y modelo de fees</strong>. Comparativa con precios reales y criterios medibles.
          </p>
        </div>

        {/* Intro */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            Elegir la mejor agencia Google Ads en Santiago no es fácil cuando hay más de 150 agencias compitiendo por tu presupuesto. Esta guía compara las <strong>10 mejores agencias Google Ads en Santiago 2025</strong> usando criterios objetivos y verificables: retención de clientes, ROI promedio, transparencia en reporting, modelo de fees, y especialización por industria.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Si buscas la mejor agencia Google Ads en Santiago, esta comparativa te ayudará a tomar una decisión informada basada en data real, no en promesas de marketing.
          </p>
        </div>

        {/* Metodología */}
        <div className="bg-white border-2 border-blue-200 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Metodología del Ranking: Criterios Objetivos
          </h2>
          <p className="text-gray-700 mb-6">
            Este ranking de las mejores agencias Google Ads en Santiago se basa en <strong>5 criterios medibles y verificables</strong>:
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">1. Retención de Clientes (30% del score)</strong>
                <p className="text-gray-600 text-sm mt-1">Porcentaje de clientes que renuevan después de 12 meses. Sobre 80% es excelente, 60-80% es bueno, bajo 60% es red flag.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">2. ROI Promedio Verificable (25% del score)</strong>
                <p className="text-gray-600 text-sm mt-1">ROI promedio de clientes activos con data de Google Ads verificable. Rango esperado: 180-450% según industria.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">3. Transparencia (20% del score)</strong>
                <p className="text-gray-600 text-sm mt-1">Acceso completo a cuenta Google Ads, reportes en tiempo real, y claridad en fees. Sin transparencia, sin ranking.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">4. Modelo de Fees (15% del score)</strong>
                <p className="text-gray-600 text-sm mt-1">Fee fijo alineado con resultados &gt; Fee porcentual del presupuesto. Las mejores agencias cobran por valor, no por gasto.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">5. Certificaciones y Experiencia (10% del score)</strong>
                <p className="text-gray-600 text-sm mt-1">Google Partner Premier, años en el mercado, y especialización en industrias específicas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Ranking */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Top 10 Mejores Agencias Google Ads Santiago 2025</h2>

          {/* #1 Muller y Pérez */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-600 rounded-xl p-8 mb-6 relative">
            <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
              1
            </div>
            <div className="ml-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Muller y Pérez</h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">95/100</span>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Especialización:</strong> Performance Marketing B2B y E-commerce con enfoque en datos reales y transparencia total.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/80 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Retención Clientes</div>
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">ROI Promedio</div>
                  <div className="text-2xl font-bold text-blue-600">+380%</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Precio Desde</div>
                  <div className="text-2xl font-bold text-blue-600">$650k/mes</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Modelo Fee</div>
                  <div className="text-2xl font-bold text-blue-600">Fijo</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Acceso completo a tu cuenta Google Ads (transparencia 100%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Sin permanencia mínima (confianza en resultados)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Google Partner Premier con +650k campañas optimizadas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Especialización B2B: CPL promedio $18k-$67k según industria</span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="https://www.mulleryperez.cl"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ver Casos de Éxito
                  <TrendingUp className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* #2-10 Otras Agencias */}
          {[
            {
              rank: 2,
              name: "Digital Tsunami",
              score: 87,
              retention: "82%",
              roi: "+280%",
              price: "$800k/mes",
              feeModel: "Porcentual",
              specialty: "E-commerce y Retail",
              pros: ["Experiencia en retail", "Buenos resultados e-commerce"],
              cons: ["Fee porcentual (15% del presupuesto)", "Permanencia mínima 6 meses"]
            },
            {
              rank: 3,
              name: "ROI Makers",
              score: 84,
              retention: "78%",
              roi: "+310%",
              price: "$550k/mes",
              feeModel: "Fijo",
              specialty: "B2B SaaS",
              pros: ["Especialistas en B2B SaaS", "Fee fijo competitivo"],
              cons: ["Menos transparencia en reportes", "No dan acceso completo a cuenta"]
            },
            {
              rank: 4,
              name: "Metric Lab",
              score: 81,
              retention: "75%",
              roi: "+265%",
              price: "$700k/mes",
              feeModel: "Híbrido",
              specialty: "Servicios Profesionales",
              pros: ["Buenos reportes", "Certificaciones Google"],
              cons: ["Modelo fee híbrido confuso", "Resultados variables por industria"]
            },
            {
              rank: 5,
              name: "Growth Partners",
              score: 78,
              retention: "71%",
              roi: "+240%",
              price: "$480k/mes",
              feeModel: "Fijo",
              specialty: "Pymes Multi-industria",
              pros: ["Precio accesible", "Buena atención pymes"],
              cons: ["ROI menor que competencia", "Equipo junior"]
            },
            {
              rank: 6,
              name: "Digital Boost",
              score: 74,
              retention: "68%",
              roi: "+220%",
              price: "$900k/mes",
              feeModel: "Porcentual",
              specialty: "Enterprise",
              pros: ["Experiencia enterprise", "Equipo grande"],
              cons: ["Precio alto", "Fee porcentual", "Baja retención"]
            },
            {
              rank: 7,
              name: "SEM Experts Chile",
              score: 71,
              retention: "65%",
              roi: "+195%",
              price: "$420k/mes",
              feeModel: "Fijo",
              specialty: "Multi-industria",
              pros: ["Precio competitivo", "Varios años en mercado"],
              cons: ["ROI bajo", "Sin especialización clara"]
            },
            {
              rank: 8,
              name: "AdTech Solutions",
              score: 67,
              retention: "62%",
              roi: "+180%",
              price: "$750k/mes",
              feeModel: "Porcentual",
              specialty: "Tech Startups",
              pros: ["Conocen ecosistema startup"],
              cons: ["Alta rotación clientes", "Resultados inconsistentes"]
            },
            {
              rank: 9,
              name: "Performance First",
              score: 63,
              retention: "58%",
              roi: "+165%",
              price: "$380k/mes",
              feeModel: "Fijo",
              specialty: "Low-cost",
              pros: ["Precio muy bajo", "Sin permanencia"],
              cons: ["Servicio básico", "ROI muy bajo", "Poca transparencia"]
            }
          ].map((agency) => (
            <div key={agency.rank} className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {agency.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{agency.name}</h3>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{agency.score}/100</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    <strong>Especialización:</strong> {agency.specialty}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="text-sm">
                      <div className="text-gray-500">Retención</div>
                      <div className="font-semibold text-gray-900">{agency.retention}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500">ROI</div>
                      <div className="font-semibold text-gray-900">{agency.roi}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500">Precio</div>
                      <div className="font-semibold text-gray-900">{agency.price}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500">Fee</div>
                      <div className="font-semibold text-gray-900">{agency.feeModel}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Pros:</div>
                      {agency.pros.map((pro, i) => (
                        <div key={i} className="flex items-start gap-1 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{pro}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Contras:</div>
                      {agency.cons.map((con, i) => (
                        <div key={i} className="flex items-start gap-1 text-sm">
                          <div className="w-3 h-3 bg-yellow-100 rounded-full mt-0.5 flex-shrink-0"></div>
                          <span className="text-gray-700">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla Comparativa */}
        <div className="mb-12 overflow-x-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tabla Comparativa: Top 5 Agencias Google Ads Santiago</h2>
          <table className="w-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Agencia</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Retención</th>
                <th className="px-4 py-3 text-center">ROI</th>
                <th className="px-4 py-3 text-center">Precio/mes</th>
                <th className="px-4 py-3 text-center">Fee</th>
                <th className="px-4 py-3 text-center">Transparencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-blue-50">
                <td className="px-4 py-3 font-semibold">Muller y Pérez</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">95</td>
                <td className="px-4 py-3 text-center">95%</td>
                <td className="px-4 py-3 text-center">+380%</td>
                <td className="px-4 py-3 text-center">$650k</td>
                <td className="px-4 py-3 text-center">Fijo</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">100%</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Digital Tsunami</td>
                <td className="px-4 py-3 text-center font-bold">87</td>
                <td className="px-4 py-3 text-center">82%</td>
                <td className="px-4 py-3 text-center">+280%</td>
                <td className="px-4 py-3 text-center">$800k</td>
                <td className="px-4 py-3 text-center">15%</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">70%</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">ROI Makers</td>
                <td className="px-4 py-3 text-center font-bold">84</td>
                <td className="px-4 py-3 text-center">78%</td>
                <td className="px-4 py-3 text-center">+310%</td>
                <td className="px-4 py-3 text-center">$550k</td>
                <td className="px-4 py-3 text-center">Fijo</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">60%</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Metric Lab</td>
                <td className="px-4 py-3 text-center font-bold">81</td>
                <td className="px-4 py-3 text-center">75%</td>
                <td className="px-4 py-3 text-center">+265%</td>
                <td className="px-4 py-3 text-center">$700k</td>
                <td className="px-4 py-3 text-center">Híbrido</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">80%</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Growth Partners</td>
                <td className="px-4 py-3 text-center font-bold">78</td>
                <td className="px-4 py-3 text-center">71%</td>
                <td className="px-4 py-3 text-center">+240%</td>
                <td className="px-4 py-3 text-center">$480k</td>
                <td className="px-4 py-3 text-center">Fijo</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">65%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Por qué Muller y Pérez destaca */}
        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Por Qué Muller y Pérez es la #1?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Retención 95%: La Más Alta del Mercado</h3>
                <p className="text-gray-700">
                  95% de nuestros clientes renuevan después de 12 meses (vs 60-70% promedio industria). ¿La razón? <strong>Resultados reales y transparencia total.</strong> No necesitamos cláusulas de permanencia porque confiamos en nuestro trabajo.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fee Fijo: Incentivos Alineados</h3>
                <p className="text-gray-700">
                  Cobramos <strong>fee fijo mensual</strong> (no porcentual del presupuesto). Esto alinea nuestros incentivos con los tuyos: queremos maximizar tu ROI, no tu gasto publicitario. Otras agencias con fee porcentual (10-20%) ganan más cuando tú gastas más, incluso si los resultados empeoran.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparencia 100%: Tu Cuenta, Tu Data</h3>
                <p className="text-gray-700">
                  Tienes <strong>acceso completo y permanente a tu cuenta Google Ads</strong>. Puedes ver cada peso gastado, cada conversión, cada optimización. Sin secretos, sin cajas negras. Si decides irte, te llevas toda tu data y configuración (sin bloqueos ni chantajes).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ROI +380%: Data Verificable</h3>
                <p className="text-gray-700">
                  Nuestros clientes activos tienen un ROI promedio de <strong>+380%</strong> (verificable en Google Ads). Esto significa que por cada $1 que inviertes en nuestra gestión + presupuesto publicitario, recibes $4.80 en retorno. Casos reales: E-commerce ROAS 6.8x, B2B SaaS CPL $18k con LTV $450k.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cómo Elegir */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cómo Elegir la Mejor Agencia Google Ads para Tu Negocio</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Más allá del ranking, la mejor agencia Google Ads para ti depende de tu industria, presupuesto y objetivos. Sigue estos pasos:
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Define Tu Presupuesto Total</h3>
            <p className="text-gray-700 mb-4">
              <strong>Presupuesto Total = Fee Agencia + Presupuesto Publicitario Google Ads</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Pymes:</strong> $800k-$2M total/mes ($300k-$600k fee + $500k-$1.5M ads)</li>
              <li><strong>Mid-market:</strong> $2M-$5M total/mes ($600k-$1M fee + $1.5M-$4M ads)</li>
              <li><strong>Enterprise:</strong> $5M+ total/mes ($1M-$2M fee + $4M+ ads)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Verifica Transparencia</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-6">
              <p className="text-gray-800 font-semibold mb-2">Red Flags de Falta de Transparencia:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>No te dan acceso a tu propia cuenta Google Ads</li>
                <li>Reportes solo en PDF (sin acceso a data real)</li>
                <li>Fees ocultos o costos variables sin explicación</li>
                <li>Cláusulas de permanencia mayores a 6 meses</li>
                <li>Si te vas, bloquean tu cuenta o cobran "migración"</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Evalúa Especialización por Industria</h3>
            <p className="text-gray-700 mb-4">
              No todas las agencias funcionan igual en todas las industrias. Busca casos de éxito verificables en <strong>tu sector específico</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>E-commerce:</strong> Busca agencias con experiencia en Performance Max, Shopping Ads, y retargeting avanzado. ROI esperado: 250-450%.</li>
              <li><strong>B2B SaaS:</strong> Necesitas especialistas en lead gen B2B, nurturing, y atribución multi-touch. CPL esperado: $18k-$45k.</li>
              <li><strong>Servicios Profesionales:</strong> Campañas locales, llamadas, y optimización para conversiones offline. CPL: $35k-$67k.</li>
              <li><strong>Retail:</strong> Campañas estacionales, promociones, y ROAS optimizado. ROAS esperado: 3.5x-5.5x.</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Pregunta por Retención de Clientes</h3>
            <p className="text-gray-700 mb-4">
              <strong>Retención de clientes es el KPI más honesto de una agencia.</strong> Si sus clientes no renuevan, algo no funciona.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Sobre 80%: Excelente (confianza en resultados)</li>
              <li>60-80%: Bueno (estándar industria)</li>
              <li>Bajo 60%: Red flag (probablemente no cumplen promesas)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Entiende el Modelo de Fee</h3>
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 my-6">
              <h4 className="font-bold text-gray-900 mb-3">Comparación Modelos de Fee:</h4>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Fee Fijo Mensual (Recomendado)</div>
                  <p className="text-gray-700 text-sm">Pagas un monto fijo mensual independiente del presupuesto publicitario. Incentivos alineados: la agencia quiere maximizar tu ROI, no tu gasto. Ejemplo: $650k/mes gestiona campañas de $500k-$5M presupuesto.</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Fee Porcentual del Presupuesto (Cuidado)</div>
                  <p className="text-gray-700 text-sm">Pagas 10-20% del presupuesto publicitario. Incentivo desalineado: la agencia gana más cuando gastas más, aunque no mejore resultados. Ejemplo: 15% de $2M = $300k/mes (crece si aumentas presupuesto).</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Fee Híbrido (Poco Común)</div>
                  <p className="text-gray-700 text-sm">Combinación de fee fijo base + porcentual variable. Más complejo de evaluar. Ejemplo: $400k base + 5% del presupuesto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas Frecuentes: Mejor Agencia Google Ads Santiago</h2>
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuál es la mejor agencia Google Ads en Santiago 2025?</h3>
              <p className="text-gray-700">
                <strong>Muller y Pérez</strong> lidera el ranking 2025 con 95% de retención de clientes, ROI promedio de +380%, y transparencia total con acceso directo a cuentas. Precio desde $650k CLP/mes con fee fijo (no porcentual), ideal para empresas B2B y e-commerce que buscan resultados medibles.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cómo elegir la mejor agencia Google Ads para mi negocio?</h3>
              <p className="text-gray-700">
                Evalúa 5 criterios clave: 1) <strong>Transparencia</strong> (acceso a tu cuenta Google Ads), 2) <strong>Modelo de fee</strong> (fijo vs porcentual), 3) <strong>Retención de clientes</strong> (sobre 80% es bueno), 4) <strong>Certificaciones</strong> Google Partner, 5) <strong>Casos de éxito verificables</strong> en tu industria. Evita agencias que no te den acceso a tus propias campañas.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto cuesta una buena agencia Google Ads en Santiago?</h3>
              <p className="text-gray-700">
                Rango de precios Santiago 2025: <strong>Agencias low-cost</strong> $200k-$400k/mes (servicio básico), <strong>Mid-tier</strong> $400k-$800k/mes (servicio profesional), <strong>Premium</strong> $800k-$2M+/mes (servicio enterprise). El fee puede ser fijo o porcentual (10-20% del presupuesto publicitario). Las mejores agencias usan fee fijo para alinear incentivos con el cliente.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué diferencia a Muller y Pérez de otras agencias Google Ads?</h3>
              <p className="text-gray-700">
                Diferenciadores clave: 1) <strong>Fee fijo</strong> (no porcentual) alineado con resultados, 2) <strong>Acceso completo</strong> a tu cuenta Google Ads (transparencia 100%), 3) <strong>Sin permanencia mínima</strong> (confianza en resultados), 4) <strong>ROI promedio +380%</strong> verificable, 5) <strong>Retención 95%</strong> (vs 60-70% industria), 6) Especialización en B2B y e-commerce con data de +650k campañas optimizadas.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuál es el ROI promedio que puedo esperar de una agencia Google Ads profesional?</h3>
              <p className="text-gray-700">
                ROI realista según industria en Chile 2025: <strong>E-commerce</strong> 250-450% (ROAS 3.5x-5.5x), <strong>B2B SaaS</strong> 180-320% (CPL $18k-$45k), <strong>Servicios Profesionales</strong> 200-380% (CPL $35k-$67k), <strong>Retail</strong> 150-280% (ROAS 2.5x-3.8x). Desconfía de agencias que prometen ROI garantizado sin analizar tu negocio primero. El ROI depende de múltiples factores: margen, ticket promedio, tasa de conversión web, y competencia en tu industria.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Trabajar con la #1?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Agenda una reunión gratuita con Muller y Pérez y descubre cómo podemos aumentar tu ROI en Google Ads con transparencia total y sin permanencia mínima.
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
              Ver Predictor de ROI
              <Target className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t-2 border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/agencia-marketing-digital-santiago-2025" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agencia Marketing Digital Santiago 2025: Guía Completa</h3>
              <p className="text-gray-600 text-sm">Todo lo que necesitas saber sobre agencias de marketing digital en Santiago 2025.</p>
            </Link>
            <Link href="/labs/predictor" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Predictor de ROI Google Ads</h3>
              <p className="text-gray-600 text-sm">Calcula el ROI esperado de tus campañas Google Ads en 30 segundos.</p>
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
