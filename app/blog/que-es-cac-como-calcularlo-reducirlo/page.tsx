import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart3, Target, CheckCircle, Zap } from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
  description: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos). Guía completa con ejemplos reales, datos de Chile 2025 y estrategias prácticas.',
  keywords: 'que es cac, costo adquisicion cliente, como reducir cac',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/que-es-cac-como-calcularlo-reducirlo'
  },
  openGraph: {
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
    title: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
    description: 'Guía completa con ejemplos reales y datos de Chile 2025.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/que-es-cac-como-calcularlo-reducirlo',
    publishedTime: '2025-10-08T20:08:06.152Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
    description: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos). Guía completa con ejemplos reales, datos de Chile 2025 y estrategias prácticas.',
    url: 'https://www.mulleryperez.cl/blog/que-es-cac-como-calcularlo-reducirlo',
    datePublished: '2025-10-08T20:08:06.152Z',
    dateModified: '2025-10-08T20:08:06.152Z',
    author: {
      '@type': 'Person',
      name: 'Christopher Müller',
      url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
      sameAs: [
        'https://www.linkedin.com/in/christophermullerm/',
        'https://www.mulleryperez.cl'
      ],
      jobTitle: 'CEO & Founder',
      worksFor: {
        '@type': 'Organization',
        name: 'Muller y Pérez',
        url: 'https://www.mulleryperez.cl'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/blog/que-es-cac-como-calcularlo-reducirlo'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <SiteHeader />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Performance Marketing</span>
            <p className="text-gray-500 mt-4">8 de octubre de 2025 · 12 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            El CAC (Costo de Adquisición de Cliente) es la métrica más importante en marketing digital. En esta guía aprenderás qué es, cómo calcularlo correctamente y estrategias probadas para reducirlo hasta 40% en 2025.
          </p>

          <div className="prose prose-lg max-w-none">
            {/* INTRO */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                📌 Lo que aprenderás en este artículo
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Qué es CAC y por qué es la métrica #1 en performance marketing</li>
                <li>✅ Fórmula exacta para calcular CAC (con ejemplos reales de Chile 2025)</li>
                <li>✅ CAC promedio por industria: SaaS, E-commerce, Servicios B2B</li>
                <li>✅ 7 estrategias probadas para reducir tu CAC hasta 40%</li>
                <li>✅ Relación CAC/LTV: cuándo tu negocio es rentable (y cuándo no)</li>
              </ul>
            </div>

            {/* SECCIÓN 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              ¿Qué es CAC? (Costo de Adquisición de Cliente)
            </h2>

            <p className="text-gray-700 mb-6">
              El <strong>CAC (Customer Acquisition Cost)</strong> es el costo total que inviertes para conseguir un nuevo cliente. Incluye toda la inversión en marketing y ventas dividida por el número de clientes adquiridos en ese período.
            </p>

            <p className="text-gray-700 mb-6">
              <strong>Fórmula básica del CAC:</strong>
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-center">
              <p className="text-white text-2xl lg:text-3xl font-black mb-2">
                CAC = (Gastos Marketing + Gastos Ventas) ÷ Nº Clientes Nuevos
              </p>
              <p className="text-blue-100 text-sm">Período: Mensual, trimestral o anual</p>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Ejemplo Real Chile 2025: SaaS B2B</h3>
              <p className="text-gray-700 mb-4">
                Una empresa SaaS en Santiago invirtió <strong>$2.500.000 CLP</strong> en Google Ads + Meta Ads durante marzo 2025.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Inversión publicitaria: $2.000.000 CLP</li>
                <li>Salarios equipo marketing (proporcional): $500.000 CLP</li>
                <li>Clientes nuevos conseguidos: 25</li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-lg text-gray-900 font-bold">
                  CAC = $2.500.000 ÷ 25 = <span className="text-blue-600">$100.000 CLP por cliente</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Si su LTV promedio es $450.000 CLP, tienen una relación LTV/CAC de 4.5x (excelente para SaaS).
                </p>
              </div>
            </div>

            {/* SECCIÓN 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              CAC Promedio por Industria en Chile 2025
            </h2>

            <p className="text-gray-700 mb-6">
              El CAC varía significativamente según tu industria, modelo de negocio y canal de adquisición. Basado en datos reales de +500 campañas optimizadas en Chile, USA, México, Perú y Australia:
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Industria</th>
                    <th className="px-6 py-4 text-left font-bold">CAC Promedio (CLP)</th>
                    <th className="px-6 py-4 text-left font-bold">Canal Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">SaaS B2B</td>
                    <td className="px-6 py-4 text-green-600 font-bold">$80.000 - $150.000</td>
                    <td className="px-6 py-4 text-gray-600">Google Ads Search</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">E-commerce / Retail</td>
                    <td className="px-6 py-4 text-green-600 font-bold">$12.000 - $35.000</td>
                    <td className="px-6 py-4 text-gray-600">Meta Ads + Google Shopping</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">Servicios Profesionales</td>
                    <td className="px-6 py-4 text-green-600 font-bold">$45.000 - $90.000</td>
                    <td className="px-6 py-4 text-gray-600">Google Ads + LinkedIn</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">Educación Online</td>
                    <td className="px-6 py-4 text-green-600 font-bold">$25.000 - $60.000</td>
                    <td className="px-6 py-4 text-gray-600">Meta Ads + YouTube</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">Fintech / Seguros</td>
                    <td className="px-6 py-4 text-green-600 font-bold">$95.000 - $180.000</td>
                    <td className="px-6 py-4 text-gray-600">Google Ads Display + Search</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">⚠️ Importante:</p>
              <p className="text-gray-700">
                Estos son promedios. Tu CAC real depende de competencia, calidad de landing, propuesta de valor y optimización de campañas. En M&P hemos logrado reducir CAC hasta 40% vs. promedio de industria.
              </p>
            </div>

            {/* SECCIÓN 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              7 Estrategias para Reducir tu CAC en 2025
            </h2>

            <p className="text-gray-700 mb-6">
              Estrategias probadas con datos reales que hemos implementado en +500 campañas:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1️⃣ Optimiza tu Scoring de Calidad en Google Ads</h3>
                <p className="text-gray-700 mb-2">
                  Un Quality Score de 8-10 puede reducir tu CPC hasta 50%. Enfócate en relevancia de anuncios, CTR y experiencia de landing page.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Reducción CAC 20-35%
                </p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2️⃣ Segmentación Ultra-Precisa por Buyer Persona</h3>
                <p className="text-gray-700 mb-2">
                  No dispares a todos. Usa audiencias lookalike, retargeting y exclusiones negativas para enfocarte solo en prospectos de alto valor.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Reducción CAC 15-25%
                </p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3️⃣ A/B Testing Sistemático de Landing Pages</h3>
                <p className="text-gray-700 mb-2">
                  Mejora tu tasa de conversión del 2% al 4% = reduces tu CAC a la mitad. Testea headlines, CTAs, formularios y social proof.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Reducción CAC 30-50%
                </p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">4️⃣ Automatización con Smart Bidding (tCPA/tROAS)</h3>
                <p className="text-gray-700 mb-2">
                  Deja que el algoritmo de Google optimice tus pujas hacia conversiones reales. Requiere mínimo 30 conversiones/mes para funcionar bien.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Reducción CAC 10-20%
                </p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">5️⃣ Retargeting Estratégico Multi-Etapa</h3>
                <p className="text-gray-700 mb-2">
                  Los usuarios que vieron tu producto pero no compraron tienen 70% más probabilidad de convertir. Usa secuencias de anuncios progresivos.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Reducción CAC 25-40%
                </p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">6️⃣ Contenido Orgánico + SEO como Canal Complementario</h3>
                <p className="text-gray-700 mb-2">
                  El tráfico orgánico tiene CAC casi nulo a largo plazo. Invierte en blog optimizado, guías y casos de éxito para atraer leads calificados.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Reducción CAC blended 15-30%
                </p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">7️⃣ Tracking Avanzado con Server-Side Tracking</h3>
                <p className="text-gray-700 mb-2">
                  Con iOS 14.5+ y cookieless future, el tracking tradicional pierde hasta 30% de conversiones. Implementa GTM Server-Side para datos precisos.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Impacto:</strong> Mejora atribución 20-35%
                </p>
              </div>
            </div>

            {/* CONCLUSIÓN */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              🎯 Conclusión
            </h2>

            <p className="text-gray-700 mb-4">
              El CAC es la métrica más crítica para evaluar la salud de tus campañas de marketing digital. Un CAC bajo no siempre es mejor — lo importante es la <strong>relación CAC/LTV</strong>:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>LTV/CAC {'>'} 3x:</strong> Excelente. Tu negocio es escalable y rentable.</li>
              <li><strong>LTV/CAC = 1-3x:</strong> Aceptable pero mejora. Aún puedes optimizar.</li>
              <li><strong>LTV/CAC {'<'} 1x:</strong> Crítico. Estás perdiendo dinero por cada cliente.</li>
            </ul>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <p className="text-gray-800 font-bold mb-2">✅ Próximos pasos:</p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Calcula tu CAC actual con la fórmula de este artículo</li>
                <li>Compara con los benchmarks de tu industria</li>
                <li>Implementa las 7 estrategias de optimización</li>
                <li>Mide, itera y escala lo que funciona</li>
              </ol>
            </div>

            <p className="text-gray-700">
              En <strong>Muller y Pérez</strong> hemos optimizado +500 campañas en Chile, USA, México, Perú y Australia, logrando reducciones de CAC de hasta 40% vs. promedio de industria. Si necesitas ayuda profesional, conversemos.
            </p>

            {/* CTA FINAL */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Necesitas Ayuda con tu Estrategia?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                En M&P optimizamos campañas basadas en datos reales y resultados medibles.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
            </div>
          </div>
        </div>
      </article>

      
    </div>
  )
}
