import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Briefcase, Users, Target, BarChart3, Building2, CheckCircle, TrendingUp, Award, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Servicios Profesionales Chile | Consultoras, Contadores | M&P',
  description: 'Agencia de marketing digital para servicios profesionales B2B en Chile. Generamos leads para consultoras, contadores, arquitectos y estudios profesionales. CPL desde $12.000.',
  keywords: 'marketing servicios profesionales chile, marketing consultoras, marketing contadores, marketing arquitectos, publicidad estudios profesionales, leads b2b servicios',
  openGraph: {
    title: 'Marketing Digital para Servicios Profesionales Chile | M&P',
    description: 'Generamos leads calificados para consultoras, contadores y estudios profesionales.',
    url: 'https://www.mulleryperez.cl/marketing-digital-servicios-profesionales-chile',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-servicios-profesionales-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-servicios-profesionales-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-servicios-profesionales-chile',
      name: 'Marketing Digital para Servicios Profesionales en Chile',
      description: 'Agencia especializada en marketing digital para servicios profesionales B2B en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital para Servicios Profesionales',
      description: 'Marketing digital para consultoras, contadores, arquitectos y estudios profesionales',
      provider: { '@type': 'Organization', name: 'Muller y Pérez' },
      areaServed: { '@type': 'Country', name: 'Chile' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un lead para servicios profesionales?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CPL varía por tipo de servicio: Contabilidad $8.000-18.000, Consultoría empresarial $15.000-35.000, Arquitectura $12.000-25.000, Ingeniería $20.000-45.000. El ticket promedio justifica estos costos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué estrategia funciona mejor para servicios profesionales?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La combinación de Google Ads para capturar búsquedas de servicio específico + LinkedIn para posicionamiento de expertise + Content Marketing para demostrar conocimiento. El ciclo de venta es largo, requiere nurturing.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo diferenciarse de la competencia en servicios profesionales?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Thought leadership es clave: contenido que demuestre expertise específico, casos de éxito con resultados concretos, presencia en medios especializados, y testimonios de clientes en la industria target.',
          },
        },
      ],
    },
  ],
}

export default function MarketingServiciosProfesionalesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Briefcase className="w-5 h-5 text-indigo-300" />
                <span className="text-sm font-medium">Marketing B2B Servicios</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-indigo-300">Servicios Profesionales</span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Generamos leads calificados para consultoras, contadores, arquitectos
                y estudios profesionales. Posicionamos tu expertise y convertimos.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-300">$15.000</div>
                  <div className="text-sm text-slate-300">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-300">45%</div>
                  <div className="text-sm text-slate-300">Tasa Calificación</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-300">5.2x</div>
                  <div className="text-sm text-slate-300">ROI Promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Plan B2B
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular Leads para mi Estudio
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tipos de Servicios */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Servicios Profesionales que Atendemos
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Cada tipo de servicio profesional tiene su propia dinámica de venta.
                  Adaptamos las estrategias a tu realidad.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Consultoras de Gestión</h3>
                  <p className="text-gray-600 mb-4">
                    Consultoría estratégica, procesos, transformación digital.
                    Tickets altos, ciclos largos.
                  </p>
                  <div className="text-sm text-gray-500">
                    CPL típico: $20.000 - $45.000
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Contadores y Auditores</h3>
                  <p className="text-gray-600 mb-4">
                    Contabilidad, auditoría, tributario, outsourcing.
                    Alta recurrencia, relaciones largas.
                  </p>
                  <div className="text-sm text-gray-500">
                    CPL típico: $8.000 - $20.000
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Building2 className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Arquitectura y Diseño</h3>
                  <p className="text-gray-600 mb-4">
                    Arquitectura, diseño interior, paisajismo.
                    Visual importante, portfolio clave.
                  </p>
                  <div className="text-sm text-gray-500">
                    CPL típico: $12.000 - $30.000
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ingeniería</h3>
                  <p className="text-gray-600 mb-4">
                    Ingeniería civil, eléctrica, industrial, ambiental.
                    Proyectos grandes, licitaciones.
                  </p>
                  <div className="text-sm text-gray-500">
                    CPL típico: $25.000 - $50.000
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">RRHH y Headhunting</h3>
                  <p className="text-gray-600 mb-4">
                    Selección de personal, outsourcing, desarrollo organizacional.
                    Relación continua con empresas.
                  </p>
                  <div className="text-sm text-gray-500">
                    CPL típico: $15.000 - $35.000
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                    <Award className="w-7 h-7 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Capacitación Corporativa</h3>
                  <p className="text-gray-600 mb-4">
                    Training, coaching ejecutivo, desarrollo de habilidades.
                    Estacionalidad por presupuestos.
                  </p>
                  <div className="text-sm text-gray-500">
                    CPL típico: $10.000 - $25.000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estrategias */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Estrategias que Funcionan en Servicios Profesionales
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Google Ads de Alta Intención</h3>
                  <p className="text-gray-600 mb-4">
                    Capturamos personas buscando activamente servicios profesionales.
                    Keywords transaccionales con alta probabilidad de cierre.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      "Contador para pyme Santiago"
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      "Consultoría ISO 9001 Chile"
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      "Arquitecto oficinas comerciales"
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">LinkedIn para Posicionamiento</h3>
                  <p className="text-gray-600 mb-4">
                    Targeting por cargo y empresa para llegar a tomadores de decisión.
                    Contenido de thought leadership que posiciona tu expertise.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Segmentación: Gerente Finanzas, Director RRHH
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Artículos y posts de expertise
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      InMail para cuentas específicas
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Content Marketing de Expertise</h3>
                  <p className="text-gray-600 mb-4">
                    Contenido que demuestra conocimiento profundo y genera confianza.
                    SEO para términos de búsqueda informativos.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Guías y whitepapers descargables
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Webinars sobre temas técnicos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Casos de estudio con resultados
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Nurturing de Largo Plazo</h3>
                  <p className="text-gray-600 mb-4">
                    Los servicios profesionales tienen ciclos largos.
                    Mantenemos la relación hasta que estén listos.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Email sequences educativos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Remarketing con contenido relevante
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Alertas de oportunidad para ventas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks Servicios Profesionales Chile 2025
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Tipo Servicio</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CPL Típico</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Tasa Cierre</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Ticket Promedio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Consultoría Gestión</td>
                      <td className="px-6 py-4 text-center">$20.000 - $45.000</td>
                      <td className="px-6 py-4 text-center">15-25%</td>
                      <td className="px-6 py-4 text-center">$3.000.000+</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Contabilidad Pymes</td>
                      <td className="px-6 py-4 text-center">$8.000 - $18.000</td>
                      <td className="px-6 py-4 text-center">25-40%</td>
                      <td className="px-6 py-4 text-center">$150.000/mes</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Arquitectura Comercial</td>
                      <td className="px-6 py-4 text-center">$15.000 - $30.000</td>
                      <td className="px-6 py-4 text-center">10-20%</td>
                      <td className="px-6 py-4 text-center">$5.000.000+</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Ingeniería Industrial</td>
                      <td className="px-6 py-4 text-center">$25.000 - $50.000</td>
                      <td className="px-6 py-4 text-center">10-15%</td>
                      <td className="px-6 py-4 text-center">$8.000.000+</td>
                    </tr>
                    <tr className="bg-indigo-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-indigo-600">$15.000</td>
                      <td className="px-6 py-4 text-center text-indigo-600">+8pp vs industria</td>
                      <td className="px-6 py-4 text-center text-indigo-600">ROI 5.2x</td>
                    </tr>
                  </tbody>
                </table>
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

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta un lead para servicios profesionales?
                  </h3>
                  <p className="text-gray-600">
                    Depende del tipo de servicio: <strong>Contabilidad $8.000-18.000</strong>,
                    Consultoría $20.000-45.000, Arquitectura $15.000-30.000.
                    El ROI se justifica por los tickets altos y la recurrencia.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo diferenciarse de la competencia?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Thought leadership es clave:</strong> contenido que demuestre expertise,
                    casos de éxito con resultados concretos, testimonios en tu industria target,
                    y presencia en medios especializados.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto demora ver resultados?
                  </h3>
                  <p className="text-gray-600">
                    Los ciclos de venta en servicios profesionales son largos (1-6 meses).
                    <strong> Los primeros leads llegan en semana 2-3</strong>, pero el pipeline
                    se construye en 3-4 meses para ver cierres consistentes.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Google Ads o LinkedIn para mi estudio?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Ambos:</strong> Google para capturar demanda activa (personas buscando
                    servicio ahora), LinkedIn para posicionamiento y ABM con cuentas específicas.
                    El mix depende de tu ticket y cliente target.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Generar Más Clientes?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Agenda una sesión estratégica. Analizamos tu mercado objetivo
                y diseñamos un plan de generación de leads calificados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular ROI en Predictor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Links internos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recursos Relacionados</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/marketing-digital-b2b-chile" className="group block bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Marketing B2B Chile</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategias generales para empresas B2B</p>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Ver más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-saas-chile" className="group block bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Marketing SaaS</h3>
                <p className="text-gray-600 text-sm mb-3">Si tu consultora tiene software propio</p>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Ver más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/labs/predictor" className="group block bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Predictor de Marketing</h3>
                <p className="text-gray-600 text-sm mb-3">Simula CPL y ROI para tu estudio</p>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Usar herramienta <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
