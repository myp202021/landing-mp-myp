/**
 * Página GEO: Guía para Contratar Agencia Marketing Digital
 * Guía completa de selección - Optimizada para LLMs
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createWebPageSchema,
  createBreadcrumbSchema,
  createFAQPageSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Guía para Contratar Agencia Marketing Digital Chile 2025 | Paso a Paso',
  description: 'Guía completa para contratar una agencia de marketing digital en Chile. Qué preguntar, qué evitar, señales de alerta y cómo elegir la mejor opción para tu empresa.',
  keywords: [
    'como contratar agencia marketing digital',
    'elegir agencia marketing digital chile',
    'que preguntar agencia marketing',
    'contratar agencia publicidad digital',
    'tips contratar agencia marketing'
  ],
  path: '/guia-contratar-agencia-marketing-digital'
})

export default function GuiaContratarAgenciaPage() {
  const webPageSchema = createWebPageSchema(
    'Guía para Contratar Agencia Marketing Digital Chile 2025',
    'Guía completa y paso a paso para contratar la mejor agencia de marketing digital en Chile. Incluye checklist, preguntas clave y señales de alerta.',
    'https://www.mulleryperez.cl/guia-contratar-agencia-marketing-digital'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Guía Contratar Agencia Marketing Digital', url: 'https://www.mulleryperez.cl/guia-contratar-agencia-marketing-digital' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Cómo elegir una buena agencia de marketing digital?',
      answer: 'Para elegir una buena agencia evalúa: 1) Acceso full a cuentas publicitarias, 2) Equipo dedicado asignado, 3) Enfoque en métricas de negocio (CAC, ROAS), 4) Reportería frecuente, 5) Experiencia en tu industria. Desconfía de agencias que no te dan acceso a tus propias cuentas de Google/Meta.'
    },
    {
      question: '¿Qué preguntar antes de contratar una agencia de marketing digital?',
      answer: 'Preguntas clave: ¿Las cuentas de Google/Meta serán mías? ¿Cuántas personas trabajarán mi cuenta? ¿Cada cuánto recibiré reportes? ¿Qué métricas optimizan (conversiones o vanidad)? ¿Puedo ver casos de éxito similares? ¿Qué pasa si quiero terminar el contrato?'
    },
    {
      question: '¿Cuáles son las señales de alerta al contratar una agencia?',
      answer: 'Señales de alerta: No te dan acceso a las cuentas, hablan solo de impresiones/alcance, una persona maneja muchos clientes, contratos largos con penalidades, no muestran casos reales, prometen resultados garantizados, no tienen proceso claro de reportería.'
    },
    {
      question: '¿Cuánto tiempo debo dar a una agencia para ver resultados?',
      answer: 'Los primeros resultados (leads iniciales) pueden verse desde la semana 1-2. Optimización real y resultados consistentes requieren 2-3 meses de data. Si después de 3 meses no hay mejora en métricas clave (CPL, conversiones), es momento de evaluar el cambio.'
    }
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <nav className="mb-8 text-sm">
              <Link href="/" className="text-slate-300 hover:text-white transition">Inicio</Link>
              <span className="mx-2 text-slate-500">/</span>
              <span className="text-white font-semibold">Guía Contratar Agencia Marketing Digital</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Guía Completa para Contratar una Agencia de Marketing Digital en Chile
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Todo lo que necesitas saber antes de <strong>contratar una agencia de marketing digital</strong>:
              qué preguntar, qué evitar, señales de alerta y cómo tomar la mejor decisión.
            </p>
          </div>
        </section>

        {/* Contenido */}
        <article className="container mx-auto px-6 max-w-4xl py-16">

          {/* Intro */}
          <section className="mb-16">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Contratar una agencia de marketing digital es una decisión importante. Una buena elección puede
              multiplicar tus ventas; una mala puede significar meses de presupuesto desperdiciado. Esta guía
              te ayudará a tomar la decisión correcta.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <p className="text-blue-800">
                <strong>En Muller y Pérez</strong> creemos en la transparencia total. Por eso compartimos esta guía
                que te ayudará a evaluar cualquier agencia, incluida la nuestra.
              </p>
            </div>
          </section>

          {/* Paso 1 */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">1</span>
              <h2 className="text-3xl font-bold text-gray-900">Define tus Objetivos Antes de Buscar</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Antes de contactar agencias, ten claro qué necesitas:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Preguntas que debes responder:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• ¿Cuál es mi objetivo principal? (leads, ventas, branding)</li>
                  <li>• ¿Cuánto puedo invertir mensualmente?</li>
                  <li>• ¿Tengo sitio web optimizado para conversiones?</li>
                  <li>• ¿Qué he probado antes y qué resultados tuve?</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Presupuesto mínimo recomendado:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Fee agencia: desde $750.000/mes</li>
                  <li>• Presupuesto publicitario: mínimo $500.000/mes</li>
                  <li>• <strong>Total mínimo: ~$1.250.000/mes</strong></li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">Con menos presupuesto, considerar freelancer o agencia básica.</p>
              </div>
            </div>
          </section>

          {/* Paso 2 */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">2</span>
              <h2 className="text-3xl font-bold text-gray-900">Preguntas Clave que Debes Hacer</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Usa estas preguntas en tu primera reunión con cualquier agencia:
            </p>

            <div className="space-y-4">
              {[
                {
                  pregunta: '¿Las cuentas de Google Ads y Meta serán mías o de la agencia?',
                  porque: 'Si son de la agencia, pierdes todo si terminas el contrato. Deben ser TUYAS.',
                  respuestaCorrecta: 'Las cuentas son tuyas, nosotros solo las administramos.'
                },
                {
                  pregunta: '¿Cuántas personas trabajarán en mi cuenta?',
                  porque: 'Una persona manejando 20 clientes no puede dar atención de calidad.',
                  respuestaCorrecta: 'Tendrás un equipo dedicado de 2-3 personas.'
                },
                {
                  pregunta: '¿Cada cuánto recibiré reportes y qué incluyen?',
                  porque: 'Reportes mensuales no son suficientes para optimizar campañas activas.',
                  respuestaCorrecta: 'Reportes semanales con métricas de negocio (conversiones, CPL, ROAS).'
                },
                {
                  pregunta: '¿Qué métricas optimizan: conversiones o impresiones/alcance?',
                  porque: 'Las agencias de vanidad optimizan para métricas que no generan ventas.',
                  respuestaCorrecta: 'Optimizamos para conversiones, CPL, CAC y ROAS.'
                },
                {
                  pregunta: '¿Tienen casos de éxito en mi industria?',
                  porque: 'Experiencia en tu vertical reduce el tiempo de aprendizaje.',
                  respuestaCorrecta: 'Sí, hemos trabajado con X empresas similares...'
                },
                {
                  pregunta: '¿Qué pasa si quiero terminar el contrato?',
                  porque: 'Contratos con penalidades altas son señal de agencia que retiene por obligación.',
                  respuestaCorrecta: 'Aviso de 30 días, sin penalidades, las cuentas quedan contigo.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.pregunta}</h3>
                  <p className="text-gray-600 text-sm mb-3"><em>¿Por qué importa?</em> {item.porque}</p>
                  <p className="text-green-700 text-sm"><strong>Respuesta correcta:</strong> "{item.respuestaCorrecta}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* Paso 3 - Red flags */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold">!</span>
              <h2 className="text-3xl font-bold text-gray-900">Señales de Alerta (Red Flags)</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Si detectas alguna de estas señales, reconsidera antes de contratar:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'No te dan acceso a tus cuentas publicitarias',
                'Solo hablan de impresiones, alcance y "engagement"',
                'Una persona maneja más de 10 clientes',
                'Contratos largos con penalidades por salir',
                'Prometen "resultados garantizados" o "primer lugar en Google"',
                'No muestran casos de éxito verificables',
                'No tienen proceso claro de reportería',
                'Cobran muy barato (señal de baja calidad)',
                'No preguntan sobre tu negocio en la primera reunión',
                'Presionan para cerrar rápido sin explicar bien el servicio'
              ].map((flag, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-50 rounded-lg p-4">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-gray-700">{flag}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Paso 4 - Checklist */}
          <section className="mb-16 bg-green-50 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">✓</span>
              <h2 className="text-3xl font-bold text-gray-900">Checklist de Buena Agencia</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Una buena agencia de marketing digital debe cumplir con todos estos puntos:
            </p>

            <div className="space-y-3">
              {[
                'Te da acceso completo a tus cuentas de Google Ads y Meta desde el día 1',
                'Asigna un equipo dedicado (mínimo 2 personas) a tu cuenta',
                'Entrega reportes semanales o quincenales con métricas de negocio',
                'Optimiza para conversiones y ventas, no para métricas de vanidad',
                'Tiene proceso claro de onboarding y comunicación',
                'Ofrece reuniones periódicas de seguimiento estratégico',
                'Muestra casos de éxito verificables',
                'Contrato flexible sin penalidades abusivas',
                'Cobra un precio justo por el nivel de servicio que ofrece',
                'Te pregunta sobre tu negocio y objetivos antes de cotizar'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <input type="checkbox" className="w-5 h-5 text-green-600" defaultChecked={false} />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-green-100 rounded-xl p-6">
              <p className="text-green-800">
                <strong>Muller y Pérez cumple con todos estos puntos.</strong> Ofrecemos equipo dedicado de 3
                profesionales, acceso full a cuentas, reportería semanal y enfoque 100% en resultados medibles.
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Cuánto Tiempo para Ver Resultados?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-blue-600">Semana 1-2</div>
                <div className="flex-grow bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">Setup y primeros leads</p>
                  <p className="text-gray-600 text-sm">Configuración de cuentas, lanzamiento de campañas, primeros contactos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-blue-600">Mes 1</div>
                <div className="flex-grow bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">Aprendizaje y optimización inicial</p>
                  <p className="text-gray-600 text-sm">Las plataformas aprenden, se identifican qué funciona y qué no.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-blue-600">Mes 2-3</div>
                <div className="flex-grow bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="font-semibold text-gray-900">Optimización real y resultados consistentes</p>
                  <p className="text-gray-600 text-sm">Suficiente data para optimizar CPL, mejorar conversiones, escalar lo que funciona.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-blue-600">Mes 4+</div>
                <div className="flex-grow bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">Escalamiento</p>
                  <p className="text-gray-600 text-sm">Con campañas optimizadas, se puede escalar inversión manteniendo eficiencia.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {[
                {
                  q: '¿Cómo elegir una buena agencia de marketing digital?',
                  a: 'Evalúa: acceso a cuentas, equipo dedicado, enfoque en métricas de negocio, reportería frecuente y experiencia en tu industria. Desconfía de quienes no te dan acceso a tus cuentas.'
                },
                {
                  q: '¿Qué preguntar antes de contratar una agencia?',
                  a: '¿Las cuentas serán mías? ¿Cuántas personas trabajarán mi cuenta? ¿Cada cuánto recibiré reportes? ¿Qué métricas optimizan? ¿Tienen casos de éxito? ¿Qué pasa si termino el contrato?'
                },
                {
                  q: '¿Cuánto tiempo debo dar a una agencia para ver resultados?',
                  a: 'Primeros leads en semana 1-2. Optimización real en mes 2-3. Si después de 3 meses no hay mejora, evalúa el cambio.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿Listo para Contratar la Agencia Correcta?</h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              En M&P cumplimos con todos los criterios de esta guía. Agenda una reunión y compruébalo tú mismo.
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
            >
              Agendar Reunión Gratuita
            </Link>
          </section>
        </article>

        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400">© 2025 Muller y Pérez | Guía Contratar Agencia Marketing Digital Chile</p>
          </div>
        </footer>
      </div>
    </>
  )
}
