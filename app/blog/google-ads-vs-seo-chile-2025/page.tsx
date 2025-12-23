/**
 * Blog: Google Ads vs SEO - Qué Conviene en Chile 2025
 * Long-tail keyword: google ads vs seo chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, createWebPageSchema, createBreadcrumbSchema } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Google Ads vs SEO: Qué Conviene para tu Empresa en Chile 2025',
  description: 'Comparativa completa entre Google Ads y SEO para empresas chilenas. Cuándo usar cada uno, costos, tiempos de resultados y cómo combinarlos para máximo ROI.',
  keywords: [
    'google ads vs seo',
    'google ads vs seo chile',
    'seo o google ads',
    'que es mejor seo o sem',
    'diferencia entre seo y google ads',
    'seo vs sem chile'
  ],
  path: '/blog/google-ads-vs-seo-chile-2025'
})

export default function GoogleAdsVsSeoPage() {
  const articleSchema = createWebPageSchema(
    'Google Ads vs SEO: Qué Conviene para tu Empresa en Chile 2025',
    'Comparativa completa entre Google Ads y SEO. Cuándo usar cada uno y cómo combinarlos.',
    'https://www.mulleryperez.cl/blog/google-ads-vs-seo-chile-2025'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'Google Ads vs SEO', url: 'https://www.mulleryperez.cl/blog/google-ads-vs-seo-chile-2025' }
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav className="text-emerald-200 text-sm mb-6">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Google Ads vs SEO</span>
            </nav>

            <div className="inline-block px-3 py-1 bg-emerald-500/30 rounded-full text-emerald-200 text-sm mb-4">
              Guía Comparativa 2025
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Google Ads vs SEO: Qué Conviene para tu Empresa en Chile 2025
            </h1>

            <p className="text-xl text-emerald-100 mb-6">
              Análisis completo para tomar la mejor decisión de inversión en marketing digital.
            </p>
          </div>
        </header>

        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Una de las preguntas más frecuentes que recibimos es: <strong>"¿Debería invertir en
              Google Ads o en SEO?"</strong>. La respuesta corta es: depende de tus objetivos,
              presupuesto y horizonte de tiempo. En esta guía te explicamos cuándo conviene cada
              estrategia y cómo combinarlas para maximizar resultados.
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Resumen Rápido</h3>
              <ul className="text-emerald-800 space-y-1">
                <li>• <strong>Google Ads:</strong> Resultados inmediatos, pagas por clic, ideal corto plazo</li>
                <li>• <strong>SEO:</strong> Resultados a mediano-largo plazo, tráfico "gratis", sostenible</li>
                <li>• <strong>Mejor estrategia:</strong> Combinar ambos (70% Ads + 30% SEO al inicio)</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Comparativa Rápida: Google Ads vs SEO
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Aspecto</th>
                    <th className="border p-3 text-left">Google Ads</th>
                    <th className="border p-3 text-left">SEO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-semibold">Tiempo de resultados</td>
                    <td className="border p-3">Inmediato (mismo día)</td>
                    <td className="border p-3">3-6 meses mínimo</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">Costo por clic</td>
                    <td className="border p-3">$200-$2.000+ CLP</td>
                    <td className="border p-3">$0 (tráfico orgánico)</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Inversión mensual</td>
                    <td className="border p-3">Fee + presupuesto ads</td>
                    <td className="border p-3">Solo fee de agencia</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">Sostenibilidad</td>
                    <td className="border p-3">Termina al parar de pagar</td>
                    <td className="border p-3">Resultados duraderos</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Control</td>
                    <td className="border p-3">Total (pausar, ajustar)</td>
                    <td className="border p-3">Limitado (depende de Google)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">Escalabilidad</td>
                    <td className="border p-3">Inmediata (más presupuesto)</td>
                    <td className="border p-3">Lenta (más contenido)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Cuándo Elegir Google Ads
            </h2>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Google Ads es ideal si:</h4>
              <ul className="space-y-2 text-blue-800">
                <li>✓ Necesitas resultados inmediatos (lanzamiento, promoción)</li>
                <li>✓ Tienes presupuesto para invertir en publicidad</li>
                <li>✓ Tu producto/servicio tiene demanda de búsqueda activa</li>
                <li>✓ Quieres testear mensajes y ofertas rápidamente</li>
                <li>✓ Operas en un mercado competitivo donde SEO toma años</li>
                <li>✓ Tu negocio es estacional (verano, navidad, cyber)</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Cuándo Elegir SEO
            </h2>

            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-green-900 mb-3">SEO es ideal si:</h4>
              <ul className="space-y-2 text-green-800">
                <li>✓ Tienes horizonte de largo plazo (+12 meses)</li>
                <li>✓ Quieres reducir dependencia de publicidad pagada</li>
                <li>✓ Tu industria tiene búsquedas informacionales (guías, tutoriales)</li>
                <li>✓ Puedes producir contenido de calidad constantemente</li>
                <li>✓ Tu sitio web tiene base técnica sólida</li>
                <li>✓ Buscas construir autoridad y confianza de marca</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Costos Reales en Chile 2025
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Inversión en Google Ads
            </h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• <strong>Fee de agencia:</strong> $450.000 - $1.200.000/mes</li>
              <li>• <strong>Presupuesto en ads:</strong> $500.000 - $10.000.000+/mes</li>
              <li>• <strong>CPC promedio Chile:</strong> $200 - $800 (varía por industria)</li>
              <li>• <strong>Total mínimo recomendado:</strong> $1.000.000/mes</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Inversión en SEO
            </h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• <strong>Fee de agencia:</strong> $500.000 - $1.500.000/mes</li>
              <li>• <strong>Producción de contenido:</strong> Incluido o adicional</li>
              <li>• <strong>Link building:</strong> $200.000 - $500.000/mes adicional</li>
              <li>• <strong>Sin costo por clic:</strong> Tráfico orgánico es "gratis"</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              La Mejor Estrategia: Combinar Ambos
            </h2>

            <p className="text-gray-700 mb-6">
              La estrategia más efectiva no es elegir uno u otro, sino <strong>combinarlos
              estratégicamente</strong>. Aquí te mostramos cómo:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Fase 1: Meses 1-3 (70% Ads, 30% SEO)</h4>
                <p className="text-gray-700">
                  Google Ads genera resultados inmediatos mientras SEO se construye. Usa los datos
                  de Ads (keywords que convierten) para informar tu estrategia de contenido SEO.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Fase 2: Meses 4-8 (50% Ads, 50% SEO)</h4>
                <p className="text-gray-700">
                  SEO empieza a generar tráfico. Mantén Ads para keywords competitivas mientras
                  posicionas orgánicamente las long-tail. Reduce dependencia gradualmente.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-2">Fase 3: Mes 9+ (30% Ads, 70% SEO)</h4>
                <p className="text-green-800">
                  SEO genera mayoría del tráfico. Ads se usa estratégicamente para remarketing,
                  lanzamientos y keywords donde aún no rankeas orgánicamente. Menor costo, mayor ROI.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Conclusión
            </h2>

            <p className="text-gray-700 mb-6">
              No existe una respuesta única. La mejor estrategia depende de tu situación específica:
            </p>

            <ul className="space-y-2 text-gray-700 mb-8">
              <li>• <strong>Startup/lanzamiento:</strong> 100% Google Ads al inicio, agregar SEO mes 3</li>
              <li>• <strong>Empresa establecida:</strong> 50/50 desde el inicio</li>
              <li>• <strong>Ecommerce:</strong> Google Shopping + SEO de categorías</li>
              <li>• <strong>B2B:</strong> LinkedIn Ads + SEO de contenido educativo</li>
            </ul>

            <div className="bg-emerald-900 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Necesitas Ayuda para Decidir?</h3>
              <p className="text-emerald-100 mb-6">
                En M&P te ayudamos a crear la estrategia perfecta combinando Google Ads y SEO
                según tus objetivos y presupuesto.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 bg-white text-emerald-900 rounded-lg font-semibold hover:bg-emerald-50 transition"
              >
                Solicitar Asesoría Gratis
              </Link>
            </div>

          </div>
        </div>
      </article>
    </>
  )
}
