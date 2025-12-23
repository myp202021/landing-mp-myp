/**
 * Blog: Cuánto Invertir en Publicidad Digital en Chile 2025
 * Long-tail keyword: cuanto invertir publicidad digital chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, createWebPageSchema, createBreadcrumbSchema } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Cuánto Invertir en Publicidad Digital en Chile 2025 | Guía de Presupuestos',
  description: 'Guía completa de presupuestos para publicidad digital en Chile. Cuánto invertir en Google Ads, Meta Ads y otros canales según tu industria y objetivos.',
  keywords: [
    'cuanto invertir publicidad digital chile',
    'presupuesto publicidad digital',
    'cuanto gastar en google ads',
    'presupuesto marketing digital chile',
    'inversion publicidad online chile'
  ],
  path: '/blog/cuanto-invertir-publicidad-digital-chile-2025'
})

export default function CuantoInvertirPublicidadPage() {
  const articleSchema = createWebPageSchema(
    'Cuánto Invertir en Publicidad Digital en Chile 2025',
    'Guía de presupuestos para publicidad digital. Google Ads, Meta Ads y más según tu industria.',
    'https://www.mulleryperez.cl/blog/cuanto-invertir-publicidad-digital-chile-2025'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'Cuánto Invertir en Publicidad Digital', url: 'https://www.mulleryperez.cl/blog/cuanto-invertir-publicidad-digital-chile-2025' }
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav className="text-teal-200 text-sm mb-6">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Presupuesto Publicidad Digital</span>
            </nav>

            <div className="inline-block px-3 py-1 bg-teal-500/30 rounded-full text-teal-200 text-sm mb-4">
              Guía de Inversión 2025
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Cuánto Invertir en Publicidad Digital en Chile 2025
            </h1>

            <p className="text-xl text-teal-100 mb-6">
              Presupuestos por industria, canal y objetivo. Datos reales del mercado chileno.
            </p>
          </div>
        </header>

        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Una de las preguntas más difíciles de responder es: <strong>"¿Cuánto debería
              invertir en publicidad digital?"</strong>. La respuesta depende de muchos factores.
              En esta guía te damos rangos realistas basados en datos del mercado chileno y
              nuestra experiencia gestionando +$500 millones anuales en ads.
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold text-teal-900 mb-2">Regla General</h3>
              <p className="text-teal-800">
                Invierte entre el <strong>5% y 15% de tu facturación objetivo</strong> en marketing
                digital. Si quieres facturar $100M/año, tu presupuesto de marketing debería estar
                entre $5M y $15M anuales ($400K - $1.2M mensuales).
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Presupuestos Mínimos por Canal
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Canal</th>
                    <th className="border p-3 text-left">Mínimo Mensual</th>
                    <th className="border p-3 text-left">Recomendado</th>
                    <th className="border p-3 text-left">Óptimo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-semibold">Google Ads Search</td>
                    <td className="border p-3">$300.000</td>
                    <td className="border p-3">$800.000</td>
                    <td className="border p-3">$2.000.000+</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">Google Shopping</td>
                    <td className="border p-3">$500.000</td>
                    <td className="border p-3">$1.500.000</td>
                    <td className="border p-3">$5.000.000+</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Meta Ads (FB/IG)</td>
                    <td className="border p-3">$250.000</td>
                    <td className="border p-3">$600.000</td>
                    <td className="border p-3">$1.500.000+</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">LinkedIn Ads</td>
                    <td className="border p-3">$500.000</td>
                    <td className="border p-3">$1.000.000</td>
                    <td className="border p-3">$2.500.000+</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">TikTok Ads</td>
                    <td className="border p-3">$400.000</td>
                    <td className="border p-3">$800.000</td>
                    <td className="border p-3">$2.000.000+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-600 text-sm mb-8">
              * Estos valores son solo el presupuesto en ads. El fee de agencia es adicional
              ($450.000 - $1.500.000/mes dependiendo del servicio).
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Presupuestos por Industria en Chile
            </h2>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Ecommerce / Retail</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Inversión típica:</strong> $1.500.000 - $15.000.000/mes
                </p>
                <p className="text-gray-700 text-sm">
                  Alto volumen, márgenes ajustados. ROAS objetivo: 4x-8x. Canales: Google Shopping
                  + Meta Ads + Remarketing.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Servicios Profesionales B2B</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Inversión típica:</strong> $500.000 - $2.000.000/mes
                </p>
                <p className="text-gray-700 text-sm">
                  Menos volumen, tickets altos. CPL objetivo: $5.000-$20.000. Canales: Google Ads
                  + LinkedIn Ads.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Inmobiliarias</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Inversión típica:</strong> $800.000 - $5.000.000/mes
                </p>
                <p className="text-gray-700 text-sm">
                  Tickets muy altos, ciclo largo. CPL objetivo: $8.000-$25.000. Canales: Google Ads
                  + Meta Ads + Portales inmobiliarios.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">SaaS / Tecnología</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Inversión típica:</strong> $1.000.000 - $8.000.000/mes
                </p>
                <p className="text-gray-700 text-sm">
                  Modelo de recurrencia permite CAC alto. CPL objetivo: $10.000-$50.000. Canales:
                  Google Ads + LinkedIn + Content marketing.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Clínicas y Salud</h4>
                <p className="text-gray-700 mb-2">
                  <strong>Inversión típica:</strong> $400.000 - $2.000.000/mes
                </p>
                <p className="text-gray-700 text-sm">
                  Alta competencia local. CPL objetivo: $3.000-$15.000. Canales: Google Ads local
                  + Meta Ads + Google Business.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Cómo Calcular tu Presupuesto Ideal
            </h2>

            <p className="text-gray-700 mb-6">
              Sigue esta fórmula para calcular cuánto deberías invertir:
            </p>

            <div className="bg-teal-50 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-teal-900 mb-4">Fórmula de Presupuesto</h4>
              <ol className="space-y-3 text-teal-800">
                <li><strong>1.</strong> Define tu objetivo de ventas mensual (ej: $20.000.000)</li>
                <li><strong>2.</strong> Calcula tu ticket promedio (ej: $200.000)</li>
                <li><strong>3.</strong> Clientes necesarios = Ventas / Ticket (ej: 100 clientes)</li>
                <li><strong>4.</strong> Estima tu tasa de conversión (ej: 5%)</li>
                <li><strong>5.</strong> Leads necesarios = Clientes / Tasa (ej: 2.000 leads)</li>
                <li><strong>6.</strong> Multiplica por CPL promedio de tu industria (ej: $5.000)</li>
                <li><strong>7.</strong> Presupuesto = Leads x CPL (ej: $10.000.000/mes)</li>
              </ol>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Distribución Recomendada del Presupuesto
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Empresa Nueva (0-12 meses)</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• 70% Google Ads (capturar demanda)</li>
                  <li>• 20% Meta Ads (awareness + remarketing)</li>
                  <li>• 10% Testing otros canales</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Empresa Establecida (12+ meses)</h4>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• 50% Google Ads (performance)</li>
                  <li>• 30% Meta Ads (escala + remarketing)</li>
                  <li>• 20% SEO + otros canales</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Errores Comunes al Definir Presupuesto
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <ul className="space-y-2 text-red-800">
                <li>❌ <strong>Presupuesto muy bajo:</strong> $200.000/mes no permite salir de fase de aprendizaje</li>
                <li>❌ <strong>No considerar fee de agencia:</strong> El presupuesto total es ads + fee</li>
                <li>❌ <strong>Cambiar presupuesto muy seguido:</strong> Afecta optimización del algoritmo</li>
                <li>❌ <strong>No reservar para testing:</strong> Siempre destina 10-20% a probar cosas nuevas</li>
                <li>❌ <strong>Ignorar estacionalidad:</strong> En Chile, enero es bajo, noviembre-diciembre alto</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Resumen: Presupuestos Mínimos Recomendados
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Startup/Micro empresa:</strong> $500.000 - $800.000/mes (ads + fee)</li>
                <li>• <strong>Pyme pequeña:</strong> $800.000 - $1.500.000/mes (ads + fee)</li>
                <li>• <strong>Pyme mediana:</strong> $1.500.000 - $3.000.000/mes (ads + fee)</li>
                <li>• <strong>Empresa grande:</strong> $3.000.000 - $15.000.000+/mes (ads + fee)</li>
              </ul>
            </div>

            <div className="bg-teal-900 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres una Estimación Personalizada?</h3>
              <p className="text-teal-100 mb-6">
                Te ayudamos a calcular el presupuesto ideal para tu negocio basado en tus
                objetivos específicos y tu industria.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 bg-white text-teal-900 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                Solicitar Estimación Gratis
              </Link>
            </div>

          </div>
        </div>
      </article>
    </>
  )
}
