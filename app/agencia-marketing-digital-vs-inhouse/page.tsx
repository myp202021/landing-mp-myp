import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, Users, CheckCircle, X, DollarSign, Clock, TrendingUp, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Agencia de Marketing Digital vs Equipo In-House | Comparativa Chile 2025 | M&P',
  description: 'Comparativa entre contratar una agencia de marketing digital o un equipo interno en Chile. Costos reales, ventajas, desventajas y cuándo elegir cada opción.',
  keywords: 'agencia marketing digital vs inhouse, contratar agencia o equipo interno, equipo marketing interno vs externo, agencia vs freelance, outsourcing marketing digital',
  openGraph: {
    title: 'Agencia vs In-House: ¿Qué conviene más en Chile?',
    description: 'Análisis de costos y beneficios para elegir entre agencia externa o equipo interno de marketing.',
    url: 'https://www.mulleryperez.cl/agencia-marketing-digital-vs-inhouse',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/agencia-marketing-digital-vs-inhouse',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Agencia de Marketing Digital vs Equipo In-House en Chile',
      description: 'Comparativa completa para elegir entre agencia externa o equipo interno.',
      author: { '@type': 'Organization', name: 'Müller & Pérez' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Es más barato contratar una agencia o un equipo in-house?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Depende del tamaño. Un equipo mínimo in-house (2 personas) cuesta ~$3.5M CLP/mes en sueldos + herramientas. Una agencia parte desde $750K-1.5M CLP/mes. Para presupuestos bajo $5M/mes en ads, generalmente la agencia es más costo-efectiva.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuándo conviene tener equipo in-house?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cuando: inviertes más de $10M CLP/mes en ads, tienes necesidades muy específicas de tu industria, requieres respuesta en tiempo real (ecommerce alto volumen), o el marketing es core de tu negocio (ej: marketplaces).',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo combinar agencia con equipo interno?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, es un modelo muy efectivo llamado "hybrid". La agencia maneja la ejecución táctica (campañas, optimización) mientras el equipo interno se enfoca en estrategia, contenido de marca y coordinación con otras áreas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuáles son los riesgos de depender de una agencia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Principales riesgos: dependencia de conocimiento externo, posible falta de inmersión en la marca, tiempos de respuesta en algunas agencias. Se mitigan eligiendo agencias con modelo de equipo dedicado y transferencia de conocimiento.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué pasa si la agencia no funciona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cambiar de agencia es más fácil que despedir empleados. Los contratos suelen ser mensuales o trimestrales. Las buenas agencias entregan acceso completo a cuentas y datos, permitiendo transición suave.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un equipo in-house completo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Equipo mínimo viable: Growth/Performance Manager ($1.5-2.5M), Ejecutivo de campañas ($900K-1.3M), más herramientas (~$300K). Total: ~$3-4M CLP/mes. Equipo completo con diseño y contenido: $6-10M/mes.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Las agencias tienen conflictos de interés?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Puede ocurrir si la agencia gana por % de inversión sin límite. En M&P trabajamos con fee fijo transparente, sin incentivo a gastar más de lo necesario. Siempre optimizamos para ROI del cliente.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué preguntar antes de contratar una agencia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Preguntas clave: ¿Tendré equipo dedicado o compartido? ¿Acceso completo a cuentas y datos? ¿Frecuencia de reportes y reuniones? ¿Experiencia en mi industria? ¿Modelo de cobro? ¿Cláusula de salida?',
          },
        },
      ],
    },
  ],
}

export default function AgenciaVsInhousePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-blue-400">Agencia</span> vs{' '}
                <span className="text-green-400">In-House</span>
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                ¿Qué conviene más para tu empresa en Chile?
              </p>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Análisis de costos reales, ventajas y desventajas de cada modelo.
                Te ayudamos a tomar la mejor decisión.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar con Agencia
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Resumen Ejecutivo
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="w-8 h-8 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Agencia Externa</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">$750K - $2M/mes</div>
                    <p className="text-sm text-gray-600 mb-4">Fee de gestión típico</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Equipo especializado desde día 1
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Acceso a múltiples especialistas
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Flexibilidad para escalar
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Equipo In-House</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">$3.5M - $10M/mes</div>
                    <p className="text-sm text-gray-600 mb-4">Costo equipo + herramientas</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Dedicación 100% a tu empresa
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Control total del proceso
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Conocimiento interno acumulado
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparativa de Costos */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Comparativa de Costos Reales (Chile 2025)
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Ítem</th>
                      <th className="px-6 py-4 text-center font-bold text-blue-600">Agencia</th>
                      <th className="px-6 py-4 text-center font-bold text-green-600">In-House (Mínimo)</th>
                      <th className="px-6 py-4 text-center font-bold text-green-600">In-House (Completo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Performance Manager</td>
                      <td className="px-6 py-4 text-center text-gray-500">Incluido</td>
                      <td className="px-6 py-4 text-center">$1.800.000</td>
                      <td className="px-6 py-4 text-center">$2.500.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Ejecutivo de Campañas</td>
                      <td className="px-6 py-4 text-center text-gray-500">Incluido</td>
                      <td className="px-6 py-4 text-center">$1.100.000</td>
                      <td className="px-6 py-4 text-center">$1.300.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Diseñador</td>
                      <td className="px-6 py-4 text-center text-gray-500">Incluido/Adicional</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center">$1.200.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Content Manager</td>
                      <td className="px-6 py-4 text-center text-gray-500">Incluido/Adicional</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center">$1.300.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Herramientas (SEMrush, etc.)</td>
                      <td className="px-6 py-4 text-center text-gray-500">Incluido</td>
                      <td className="px-6 py-4 text-center">$300.000</td>
                      <td className="px-6 py-4 text-center">$500.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Capacitación/Actualización</td>
                      <td className="px-6 py-4 text-center text-gray-500">Incluido</td>
                      <td className="px-6 py-4 text-center">$200.000</td>
                      <td className="px-6 py-4 text-center">$400.000</td>
                    </tr>
                    <tr className="bg-blue-50 font-bold">
                      <td className="px-6 py-4">TOTAL MENSUAL</td>
                      <td className="px-6 py-4 text-center text-blue-600">$750K - $2M</td>
                      <td className="px-6 py-4 text-center text-green-600">$3.4M</td>
                      <td className="px-6 py-4 text-center text-green-600">$7.2M</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-center text-gray-500 text-sm mt-4">
                * Sueldos líquidos estimados. Costo empresa es ~30% mayor.
              </p>
            </div>
          </div>
        </section>

        {/* Pros y Contras */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Ventajas y Desventajas
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Agencia */}
                <div>
                  <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                    <Building2 className="w-6 h-6" />
                    Agencia Externa
                  </h3>

                  <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                    <h4 className="font-bold text-green-600 mb-3">Ventajas</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Menor costo para presupuestos bajo $5M/mes
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Equipo especializado y actualizado
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Experiencia multi-industria
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Flexibilidad para escalar
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Sin costos de contratación/despido
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-bold text-red-600 mb-3">Desventajas</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Menos inmersión en la marca
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Dependencia de tercero
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Posible atención compartida
                      </li>
                    </ul>
                  </div>
                </div>

                {/* In-House */}
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Equipo In-House
                  </h3>

                  <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
                    <h4 className="font-bold text-green-600 mb-3">Ventajas</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Dedicación 100% a tu empresa
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Control total del proceso
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Conocimiento acumulado
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Respuesta inmediata
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Alineación cultural
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-bold text-red-600 mb-3">Desventajas</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Alto costo fijo mensual
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Dificultad para encontrar talento
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Riesgo de rotación
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Actualización constante requerida
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cuándo elegir cada uno */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                ¿Cuándo Elegir Cada Opción?
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-8 rounded-xl">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Elige Agencia si:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      Inviertes menos de $5M/mes en ads
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      Estás empezando con marketing digital
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      Necesitas resultados rápidos
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      No quieres lidiar con contrataciones
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      Valoras flexibilidad para escalar
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-8 rounded-xl">
                  <h3 className="text-xl font-bold text-green-800 mb-4">Elige In-House si:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      Inviertes más de $10M/mes en ads
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      Marketing es core de tu negocio
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      Requieres respuesta en tiempo real
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      Tienes necesidades muy específicas
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      Puedes atraer y retener talento
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">¿Es más barato agencia o in-house?</h3>
                  <p className="text-gray-600 text-sm">
                    Depende del tamaño. Equipo mínimo in-house cuesta ~$3.5M/mes. Agencia parte desde $750K-1.5M/mes.
                    <strong> Para presupuestos bajo $5M/mes en ads, la agencia es más costo-efectiva.</strong>
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">¿Puedo combinar ambos modelos?</h3>
                  <p className="text-gray-600 text-sm">
                    Sí, el modelo <strong>híbrido es muy efectivo</strong>. La agencia maneja ejecución táctica mientras
                    el equipo interno se enfoca en estrategia, contenido de marca y coordinación.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué riesgos tiene depender de una agencia?</h3>
                  <p className="text-gray-600 text-sm">
                    Dependencia de conocimiento externo, posible falta de inmersión en marca. <strong>Se mitigan eligiendo
                    agencias con equipo dedicado</strong>, acceso completo a cuentas, y transferencia de conocimiento.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué pasa si la agencia no funciona?</h3>
                  <p className="text-gray-600 text-sm">
                    <strong>Cambiar de agencia es más fácil que despedir empleados.</strong> Los contratos suelen ser mensuales.
                    Las buenas agencias entregan acceso completo a cuentas para transición suave.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Páginas Relacionadas */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold mb-4">Páginas Relacionadas:</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/precios-agencia-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Precios Agencias Chile
                </Link>
                <Link href="/guia-contratar-agencia-marketing-digital" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Guía de Contratación
                </Link>
                <Link href="/ranking-agencias-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Ranking Agencias
                </Link>
                <Link href="/cuanto-cuesta-agencia-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Cuánto Cuesta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Quieres Conocer Nuestro Modelo?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                En M&P ofrecemos equipo dedicado, acceso completo a cuentas,
                y reuniones semanales. Lo mejor de ambos mundos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
