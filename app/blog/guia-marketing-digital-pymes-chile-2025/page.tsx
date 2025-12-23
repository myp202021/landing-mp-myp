/**
 * Blog: Guía de Marketing Digital para Pymes Chile 2025
 * Long-tail keyword: marketing digital pymes chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, createWebPageSchema, createBreadcrumbSchema } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Guía de Marketing Digital para Pymes en Chile 2025 | Estrategias y Presupuestos',
  description: 'Guía completa de marketing digital para pymes chilenas. Estrategias efectivas con bajo presupuesto, canales recomendados y errores comunes a evitar.',
  keywords: [
    'marketing digital pymes chile',
    'marketing digital para pymes',
    'publicidad digital pymes',
    'estrategia marketing digital pyme',
    'marketing digital pequeñas empresas chile'
  ],
  path: '/blog/guia-marketing-digital-pymes-chile-2025'
})

export default function MarketingDigitalPymesPage() {
  const articleSchema = createWebPageSchema(
    'Guía de Marketing Digital para Pymes en Chile 2025',
    'Estrategias efectivas de marketing digital para pymes chilenas con presupuestos ajustados.',
    'https://www.mulleryperez.cl/blog/guia-marketing-digital-pymes-chile-2025'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'Marketing Digital Pymes', url: 'https://www.mulleryperez.cl/blog/guia-marketing-digital-pymes-chile-2025' }
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav className="text-purple-200 text-sm mb-6">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Marketing Digital Pymes</span>
            </nav>

            <div className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-purple-200 text-sm mb-4">
              Guía para Pymes 2025
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Guía de Marketing Digital para Pymes en Chile 2025
            </h1>

            <p className="text-xl text-purple-100 mb-6">
              Estrategias efectivas con presupuestos ajustados. Maximiza cada peso invertido.
            </p>
          </div>
        </header>

        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Si tienes una pyme en Chile, probablemente te preguntas cómo competir en marketing
              digital contra empresas con presupuestos 10 veces mayores. La buena noticia: con
              la estrategia correcta, puedes obtener resultados excelentes sin gastar millones.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Lo que Aprenderás</h3>
              <ul className="text-purple-800 space-y-1">
                <li>• Presupuestos realistas para pymes chilenas</li>
                <li>• Canales más efectivos según tu industria</li>
                <li>• Estrategias de bajo costo y alto impacto</li>
                <li>• Errores comunes que debes evitar</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Presupuestos Realistas para Pymes en Chile
            </h2>

            <p className="text-gray-700 mb-6">
              No necesitas millones para empezar. Estos son presupuestos realistas según el
              tamaño de tu pyme:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Micro Empresa</h4>
                <p className="text-3xl font-bold text-purple-600 mb-2">$300K-500K</p>
                <p className="text-gray-600 text-sm">mensuales</p>
                <p className="text-gray-700 text-sm mt-3">1-5 empleados. Enfócate en 1 canal.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center border-2 border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Pyme Pequeña</h4>
                <p className="text-3xl font-bold text-purple-600 mb-2">$500K-1M</p>
                <p className="text-gray-600 text-sm">mensuales</p>
                <p className="text-gray-700 text-sm mt-3">6-20 empleados. 2 canales combinados.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Pyme Mediana</h4>
                <p className="text-3xl font-bold text-purple-600 mb-2">$1M-2.5M</p>
                <p className="text-gray-600 text-sm">mensuales</p>
                <p className="text-gray-700 text-sm mt-3">21-50 empleados. Estrategia multicanal.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Los 3 Canales Más Efectivos para Pymes
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Google Ads (Búsqueda)
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-4">
                <strong>Ideal para:</strong> Servicios con demanda de búsqueda activa (plomeros,
                abogados, dentistas, etc.) y ecommerce.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Presupuesto mínimo:</strong> $300.000/mes en ads + fee de gestión
              </p>
              <p className="text-gray-700">
                <strong>Por qué funciona:</strong> Llegas a personas que ya están buscando lo que
                ofreces. Alta intención de compra.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Meta Ads (Facebook/Instagram)
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-4">
                <strong>Ideal para:</strong> Productos visuales, B2C, restaurantes, retail, moda,
                y negocios locales.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Presupuesto mínimo:</strong> $250.000/mes en ads + fee de gestión
              </p>
              <p className="text-gray-700">
                <strong>Por qué funciona:</strong> Excelente segmentación por intereses y
                ubicación. Bueno para awareness y remarketing.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Google Business Profile (Gratis)
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-green-800 mb-4">
                <strong>Ideal para:</strong> TODO negocio local. Restaurantes, tiendas, servicios
                profesionales, clínicas.
              </p>
              <p className="text-green-800 mb-4">
                <strong>Costo:</strong> GRATIS (solo requiere tiempo de mantención)
              </p>
              <p className="text-green-800">
                <strong>Por qué funciona:</strong> Apareces en Google Maps y búsquedas locales.
                Reviews aumentan confianza. Es el primer paso obligatorio.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Estrategia Recomendada por Tipo de Pyme
            </h2>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Servicios Profesionales (abogados, contadores, consultores)</h4>
                <p className="text-gray-700">
                  <strong>Prioridad:</strong> Google Ads + LinkedIn orgánico + Google Business Profile
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Retail / Ecommerce</h4>
                <p className="text-gray-700">
                  <strong>Prioridad:</strong> Google Shopping + Meta Ads + Email marketing
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Restaurantes y Food</h4>
                <p className="text-gray-700">
                  <strong>Prioridad:</strong> Instagram orgánico + Google Business + Meta Ads local
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Servicios a Domicilio (plomeros, electricistas)</h4>
                <p className="text-gray-700">
                  <strong>Prioridad:</strong> Google Ads local + Google Business Profile + WhatsApp Business
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              5 Errores Comunes de Pymes en Marketing Digital
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>1. Querer estar en todos los canales:</strong> Mejor dominar 1-2 canales
                  que estar mediocre en 5.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>2. No medir resultados:</strong> Sin tracking de conversiones, estás
                  tirando dinero a ciegas.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>3. Abandonar muy pronto:</strong> Google Ads necesita mínimo 30 días
                  para optimizar. Paciencia.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>4. Copiar a la competencia grande:</strong> Tu estrategia debe ser
                  diferente. Enfócate en nichos.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>5. Ignorar el remarketing:</strong> Seguir a quienes ya visitaron tu
                  sitio es más barato y efectivo.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Plan de Acción: Primeros 90 Días
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="font-semibold text-purple-900">Mes 1: Fundamentos</p>
                <p className="text-purple-800 text-sm">
                  Optimiza Google Business Profile. Instala Google Analytics y Pixel de Meta.
                  Define tu público objetivo. Prepara landing page.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="font-semibold text-purple-900">Mes 2: Primeras Campañas</p>
                <p className="text-purple-800 text-sm">
                  Lanza campaña en tu canal principal (Google Ads o Meta). Presupuesto conservador.
                  Recopila datos. Ajusta segmentación.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="font-semibold text-purple-900">Mes 3: Optimización</p>
                <p className="text-purple-800 text-sm">
                  Analiza resultados. Pausa lo que no funciona. Escala lo que sí. Implementa
                  remarketing. Considera segundo canal.
                </p>
              </div>
            </div>

            <div className="bg-purple-900 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Necesitas Ayuda con tu Pyme?</h3>
              <p className="text-purple-100 mb-6">
                En M&P tenemos planes especiales para pymes desde $650.000/mes. Incluye
                estrategia, ejecución y reportes.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Cotizar para mi Pyme
              </Link>
            </div>

          </div>
        </div>
      </article>
    </>
  )
}
