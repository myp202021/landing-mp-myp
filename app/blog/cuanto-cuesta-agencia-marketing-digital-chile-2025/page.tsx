/**
 * Blog: Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025
 * Long-tail keyword: precios agencia marketing digital chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, createWebPageSchema, createBreadcrumbSchema } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025 | Precios Reales',
  description: 'Guía completa de precios de agencias de marketing digital en Chile 2025. Comparativa de costos por servicio, qué incluye cada plan y cómo elegir según tu presupuesto.',
  keywords: [
    'cuanto cuesta agencia marketing digital chile',
    'precios agencia marketing digital chile',
    'costo agencia marketing digital',
    'tarifas agencia marketing digital chile',
    'presupuesto agencia marketing digital',
    'agencia marketing digital precios chile 2025'
  ],
  path: '/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025'
})

export default function CuantoCuestaAgenciaPage() {
  const articleSchema = createWebPageSchema(
    'Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025',
    'Guía completa de precios de agencias de marketing digital en Chile. Comparativa de costos, qué incluye cada plan y cómo elegir.',
    'https://www.mulleryperez.cl/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'Cuánto Cuesta una Agencia de Marketing Digital', url: 'https://www.mulleryperez.cl/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025' }
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="min-h-screen bg-white">
        {/* Hero */}
        <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav className="text-blue-200 text-sm mb-6">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Precios Agencias</span>
            </nav>

            <div className="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-blue-200 text-sm mb-4">
              Guía de Precios 2025
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025
            </h1>

            <p className="text-xl text-blue-100 mb-6">
              Precios reales, qué incluye cada plan y cómo elegir la mejor opción para tu empresa.
            </p>

            <div className="flex items-center gap-4 text-blue-200 text-sm">
              <span>Por Equipo M&P</span>
              <span>•</span>
              <span>15 min lectura</span>
              <span>•</span>
              <span>Actualizado Enero 2025</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Si estás buscando contratar una agencia de marketing digital en Chile, probablemente te
              preguntas <strong>cuánto deberías pagar</strong> y <strong>qué deberías recibir</strong> por
              ese precio. En esta guía te explicamos los rangos de precios reales del mercado chileno
              en 2025, qué incluye cada nivel de servicio y cómo elegir la mejor opción para tu empresa.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Resumen Rápido</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Freelancers:</strong> $200.000 - $500.000/mes</li>
                <li>• <strong>Agencias pequeñas:</strong> $500.000 - $900.000/mes</li>
                <li>• <strong>Agencias medianas:</strong> $900.000 - $1.500.000/mes</li>
                <li>• <strong>Agencias grandes:</strong> $1.500.000 - $5.000.000+/mes</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Rangos de Precios por Tipo de Proveedor
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Freelancers y Consultores Independientes
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Rango: $200.000 - $500.000 CLP/mes</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Los freelancers son la opción más económica pero tienen limitaciones importantes.
              Generalmente se especializan en una sola plataforma (solo Google Ads o solo Meta Ads)
              y no ofrecen diseño ni producción de contenido incluido.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye típicamente?</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Gestión de 1 plataforma (Google Ads O Meta Ads)</li>
                <li>✓ Reportes mensuales básicos</li>
                <li>✓ Optimización semanal</li>
                <li>✗ Sin diseño de creatividades incluido</li>
                <li>✗ Sin estrategia multicanal</li>
                <li>✗ Disponibilidad limitada</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Agencias Pequeñas (2-5 personas)
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Rango: $500.000 - $900.000 CLP/mes</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Las agencias pequeñas ofrecen un buen balance entre precio y servicio. Suelen tener
              un equipo pequeño pero especializado que puede manejar múltiples canales.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye típicamente?</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Gestión de 1-2 plataformas</li>
                <li>✓ Reportes semanales o quincenales</li>
                <li>✓ Diseño básico de creatividades</li>
                <li>✓ Reuniones mensuales de seguimiento</li>
                <li>✗ Equipo dedicado limitado</li>
                <li>✗ Sin herramientas avanzadas de analytics</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Agencias Medianas (6-20 personas)
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Rango: $900.000 - $1.500.000 CLP/mes</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Este es el rango donde encontrarás el mejor equilibrio entre calidad, servicio y precio
              para la mayoría de las empresas. Las agencias medianas tienen equipos especializados
              y pueden ofrecer estrategias más completas.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-green-900 mb-3">¿Qué incluye típicamente? (Recomendado)</h4>
              <ul className="space-y-2 text-green-800">
                <li>✓ Gestión multicanal (Google + Meta + LinkedIn)</li>
                <li>✓ Equipo dedicado de 3+ profesionales</li>
                <li>✓ Diseño de creatividades incluido</li>
                <li>✓ Reportes ejecutivos semanales</li>
                <li>✓ Reuniones semanales o quincenales</li>
                <li>✓ Acceso a dashboards en tiempo real</li>
                <li>✓ Optimización diaria de campañas</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Agencias Grandes y Holdings
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Rango: $1.500.000 - $5.000.000+ CLP/mes</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Las agencias grandes o pertenecientes a holdings internacionales cobran premium
              por su marca y estructura. Son ideales para empresas grandes con presupuestos
              publicitarios sobre $10.000.000 mensuales.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              ¿Qué Factores Afectan el Precio?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Cantidad de Canales</h4>
                <p className="text-blue-800 text-sm">
                  Gestionar solo Google Ads es más económico que manejar Google + Meta + LinkedIn + TikTok.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Presupuesto Publicitario</h4>
                <p className="text-blue-800 text-sm">
                  A mayor presupuesto en ads, mayor trabajo de optimización y generalmente mayor fee.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Producción de Contenido</h4>
                <p className="text-blue-800 text-sm">
                  Si necesitas videos, fotografía profesional o mucho contenido, el precio sube.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Complejidad del Negocio</h4>
                <p className="text-blue-800 text-sm">
                  Ecommerce con 1000+ productos requiere más trabajo que un servicio B2B simple.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Precios por Servicio Específico
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Servicio</th>
                    <th className="border p-3 text-left">Rango de Precios</th>
                    <th className="border p-3 text-left">Qué Incluye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-semibold">Google Ads</td>
                    <td className="border p-3">$450.000 - $1.200.000/mes</td>
                    <td className="border p-3 text-sm">Search, Shopping, Display, YouTube Ads</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">Meta Ads</td>
                    <td className="border p-3">$400.000 - $1.000.000/mes</td>
                    <td className="border p-3 text-sm">Facebook, Instagram, WhatsApp Ads</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">SEO</td>
                    <td className="border p-3">$500.000 - $1.500.000/mes</td>
                    <td className="border p-3 text-sm">SEO técnico, contenido, link building</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-semibold">LinkedIn Ads</td>
                    <td className="border p-3">$600.000 - $1.200.000/mes</td>
                    <td className="border p-3 text-sm">Campañas B2B, InMail, Lead Gen</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-semibold">Pack Completo</td>
                    <td className="border p-3">$900.000 - $2.500.000/mes</td>
                    <td className="border p-3 text-sm">Google + Meta + Diseño + Reportes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Cómo Elegir la Agencia Correcta para tu Presupuesto
            </h2>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Si tienes menos de $500.000/mes</h4>
                <p className="text-gray-700">
                  Considera un freelancer especializado o herramientas de automatización. Enfócate en
                  un solo canal (el más relevante para tu negocio) y aprende lo básico para supervisar.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Si tienes $500.000 - $1.000.000/mes</h4>
                <p className="text-gray-700">
                  Busca una agencia pequeña-mediana con experiencia en tu industria. Prioriza
                  transparencia en reportes y acceso a tus cuentas publicitarias.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-2">Si tienes $1.000.000 - $2.000.000/mes (Óptimo)</h4>
                <p className="text-green-800">
                  Este es el punto óptimo. Puedes acceder a agencias medianas con equipos dedicados,
                  estrategia multicanal y producción de contenido incluida. Exige reuniones semanales
                  y dashboards en tiempo real.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Si tienes más de $2.000.000/mes</h4>
                <p className="text-gray-700">
                  Puedes acceder a servicios premium con equipos grandes, estrategia integral y
                  herramientas avanzadas. Evalúa si el valor agregado justifica el precio vs agencias medianas.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Banderas Rojas: Cuándo el Precio es Sospechoso
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-red-900 mb-3">Desconfía si:</h4>
              <ul className="space-y-2 text-red-800">
                <li>❌ Ofrecen "todo incluido" por menos de $300.000/mes</li>
                <li>❌ No te dan acceso a tus propias cuentas publicitarias</li>
                <li>❌ Cobran porcentaje del presupuesto sin tope</li>
                <li>❌ No pueden mostrar casos de éxito verificables</li>
                <li>❌ Prometen resultados específicos garantizados</li>
                <li>❌ Contratos con penalidades por salida anticipada</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Conclusión: ¿Cuánto Deberías Pagar?
            </h2>

            <p className="text-gray-700 mb-6">
              Para la mayoría de las empresas chilenas medianas, el rango óptimo está entre
              <strong> $800.000 y $1.500.000 CLP mensuales</strong>. Este presupuesto te permite acceder a:
            </p>

            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✓ Equipo dedicado de 3+ profesionales</li>
              <li>✓ Gestión de múltiples canales (Google + Meta)</li>
              <li>✓ Diseño de creatividades incluido</li>
              <li>✓ Reportes ejecutivos semanales</li>
              <li>✓ Optimización diaria de campañas</li>
              <li>✓ Reuniones de seguimiento periódicas</li>
            </ul>

            <div className="bg-blue-900 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres una Cotización Personalizada?</h3>
              <p className="text-blue-100 mb-6">
                En M&P ofrecemos planes transparentes desde $950.000/mes con equipo dedicado
                y acceso completo a tus cuentas.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Solicitar Cotización Gratis
              </Link>
            </div>

          </div>
        </div>
      </article>
    </>
  )
}
