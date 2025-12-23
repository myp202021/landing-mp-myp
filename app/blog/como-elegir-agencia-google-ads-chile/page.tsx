/**
 * Blog: Cómo Elegir la Mejor Agencia de Google Ads en Chile
 * Long-tail keyword: como elegir agencia google ads chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata, createWebPageSchema, createBreadcrumbSchema } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Cómo Elegir la Mejor Agencia de Google Ads en Chile 2025 | Guía Completa',
  description: 'Guía paso a paso para elegir la mejor agencia de Google Ads en Chile. Qué preguntar, banderas rojas, certificaciones importantes y checklist de evaluación.',
  keywords: [
    'como elegir agencia google ads',
    'mejor agencia google ads chile',
    'agencia google ads recomendada',
    'que preguntar agencia google ads',
    'contratar agencia google ads chile'
  ],
  path: '/blog/como-elegir-agencia-google-ads-chile'
})

export default function ComoElegirAgenciaPage() {
  const articleSchema = createWebPageSchema(
    'Cómo Elegir la Mejor Agencia de Google Ads en Chile 2025',
    'Guía paso a paso para elegir la mejor agencia de Google Ads. Qué preguntar y banderas rojas.',
    'https://www.mulleryperez.cl/blog/como-elegir-agencia-google-ads-chile'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Blog', url: 'https://www.mulleryperez.cl/blog' },
    { name: 'Cómo Elegir Agencia Google Ads', url: 'https://www.mulleryperez.cl/blog/como-elegir-agencia-google-ads-chile' }
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <nav className="text-orange-200 text-sm mb-6">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Cómo Elegir Agencia</span>
            </nav>

            <div className="inline-block px-3 py-1 bg-orange-500/30 rounded-full text-orange-200 text-sm mb-4">
              Guía de Selección 2025
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Cómo Elegir la Mejor Agencia de Google Ads en Chile
            </h1>

            <p className="text-xl text-orange-100 mb-6">
              10 criterios esenciales, preguntas clave y banderas rojas que debes conocer.
            </p>
          </div>
        </header>

        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Elegir la agencia de Google Ads correcta puede ser la diferencia entre desperdiciar
              tu presupuesto y multiplicar tu inversión. En Chile hay cientos de opciones: desde
              freelancers hasta holdings internacionales. Esta guía te ayudará a tomar la mejor
              decisión.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              10 Criterios para Evaluar una Agencia de Google Ads
            </h2>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Certificación Google Partner</h3>
                <p className="text-gray-700">
                  Verifica que la agencia sea <strong>Google Partner</strong> o <strong>Premier Partner</strong>.
                  Esto significa que tienen profesionales certificados, cumplen requisitos de rendimiento
                  y tienen acceso a soporte directo de Google. Puedes verificarlo en
                  partners.google.com.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Acceso a Tus Cuentas</h3>
                <p className="text-gray-700">
                  <strong>CRÍTICO:</strong> La agencia debe trabajar en TU cuenta de Google Ads, no en
                  una cuenta propia. Debes tener acceso de propietario a tu cuenta y poder ver todo
                  lo que hacen. Si no te dan acceso, huye.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Experiencia en Tu Industria</h3>
                <p className="text-gray-700">
                  Pregunta por casos de éxito en tu industria específica. Una agencia con experiencia
                  en ecommerce no necesariamente sabe manejar campañas B2B de software, y viceversa.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Transparencia en Reportes</h3>
                <p className="text-gray-700">
                  Exige reportes con métricas reales: impresiones, clics, CPC, conversiones, CPA, ROAS.
                  Desconfía de reportes que solo muestran "métricas de vanidad" como alcance o
                  engagement sin conversiones.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Modelo de Cobro Claro</h3>
                <p className="text-gray-700">
                  Entiende exactamente cómo cobran: ¿fee fijo mensual? ¿porcentaje del presupuesto?
                  ¿híbrido? Lo más transparente es un fee fijo que no aumente con tu presupuesto
                  en ads.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Equipo Dedicado</h3>
                <p className="text-gray-700">
                  Pregunta quién trabajará en tu cuenta y cuántas cuentas maneja esa persona.
                  Un ejecutivo con 50 clientes no puede dar atención de calidad. Lo ideal:
                  15-20 clientes máximo por ejecutivo.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">7. Frecuencia de Optimización</h3>
                <p className="text-gray-700">
                  Google Ads requiere optimización constante. Pregunta con qué frecuencia revisan
                  y ajustan las campañas. Lo mínimo aceptable es semanal; lo ideal es diario.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">8. Comunicación y Reuniones</h3>
                <p className="text-gray-700">
                  Define expectativas de comunicación: ¿reuniones semanales o mensuales? ¿canal de
                  comunicación (email, WhatsApp, Slack)? ¿tiempo de respuesta esperado?
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">9. Sin Contratos Largos</h3>
                <p className="text-gray-700">
                  Evita contratos de 12 meses con penalidad por salida. Una buena agencia confía
                  en sus resultados y no necesita amarrarte. Lo ideal: contratos mensuales o
                  trimestrales.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">10. Referencias Verificables</h3>
                <p className="text-gray-700">
                  Pide contactos de clientes actuales que puedas llamar. Una agencia confiable
                  no tendrá problema en darte 2-3 referencias que confirmen su trabajo.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Preguntas Clave para Hacer en la Primera Reunión
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <ul className="space-y-2 text-blue-800">
                <li>1. ¿Tienen certificación Google Partner vigente?</li>
                <li>2. ¿Quién trabajará directamente en mi cuenta?</li>
                <li>3. ¿Cuántos clientes maneja esa persona actualmente?</li>
                <li>4. ¿Tendré acceso completo a mi cuenta de Google Ads?</li>
                <li>5. ¿Cómo son los reportes y con qué frecuencia los envían?</li>
                <li>6. ¿Cuál es el presupuesto mínimo que recomiendan?</li>
                <li>7. ¿Tienen casos de éxito en mi industria específica?</li>
                <li>8. ¿Qué pasa si quiero cancelar el servicio?</li>
                <li>9. ¿Crean ustedes las creatividades o debo proveerlas?</li>
                <li>10. ¿Pueden darme contacto de 2-3 clientes actuales?</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Banderas Rojas: Cuándo NO Contratar
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-red-900 mb-3">Huye si:</h4>
              <ul className="space-y-2 text-red-800">
                <li>❌ No te dan acceso a tu propia cuenta de Google Ads</li>
                <li>❌ Garantizan resultados específicos ("te conseguimos 100 leads")</li>
                <li>❌ Cobran porcentaje del presupuesto sin tope</li>
                <li>❌ Contrato mínimo de 12 meses con penalidad</li>
                <li>❌ No pueden mostrar casos de éxito verificables</li>
                <li>❌ No explican claramente cómo trabajan</li>
                <li>❌ Prometen estar en "primera posición" siempre</li>
                <li>❌ No tienen certificación Google Partner</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Checklist Final de Evaluación
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-green-900 mb-3">Antes de firmar, verifica:</h4>
              <ul className="space-y-2 text-green-800">
                <li>☐ Certificación Google Partner verificada</li>
                <li>☐ Acceso completo a tu cuenta garantizado</li>
                <li>☐ Fee y modelo de cobro claros por escrito</li>
                <li>☐ Equipo asignado identificado con nombre</li>
                <li>☐ Frecuencia de reportes definida</li>
                <li>☐ Casos de éxito en tu industria confirmados</li>
                <li>☐ Referencias de clientes contactadas</li>
                <li>☐ Contrato sin penalidad por salida anticipada</li>
                <li>☐ Canal de comunicación definido</li>
                <li>☐ Expectativas de resultados realistas (no garantías)</li>
              </ul>
            </div>

            <div className="bg-orange-600 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Buscas una Agencia de Confianza?</h3>
              <p className="text-orange-100 mb-6">
                En M&P cumplimos todos estos criterios. Somos Google Partner, damos acceso
                completo a tus cuentas y trabajamos con contratos flexibles.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition"
              >
                Agendar Reunión
              </Link>
            </div>

          </div>
        </div>
      </article>
    </>
  )
}
