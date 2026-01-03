import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Stethoscope, Building2, Users, CheckCircle, Shield, Calendar, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Salud en Chile | Clínicas y Médicos | M&P',
  description: 'Agencia de marketing digital especializada en el sector salud en Chile. Clínicas, centros médicos, dentistas y especialistas. Generamos pacientes calificados con estrategias éticas y efectivas.',
  keywords: 'marketing digital salud chile, marketing clinicas chile, publicidad medicos chile, marketing dental chile, marketing centros medicos, pacientes nuevos clinica',
  openGraph: {
    title: 'Marketing Digital para Salud en Chile | M&P',
    description: 'Especialistas en generar pacientes para clínicas y centros médicos. Marketing ético y efectivo.',
    url: 'https://www.mulleryperez.cl/marketing-digital-salud-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-salud-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-salud-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-salud-chile',
      name: 'Marketing Digital para Salud en Chile',
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital Salud',
      description: 'Marketing digital especializado para el sector salud',
      provider: { '@type': 'Organization', name: 'Müller & Pérez' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta captar un paciente nuevo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El costo por paciente nuevo varía según especialidad: Dental $15.000-30.000 CLP, Medicina general $20.000-40.000 CLP, Especialidades $30.000-60.000 CLP, Cirugía estética $50.000-100.000 CLP. El ROI depende del valor de vida del paciente.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Es legal hacer publicidad médica en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, es legal pero regulada. Debe cumplir con normas del Colegio Médico y Minsal: no prometer resultados, no comparar con otros profesionales, incluir registro ISP en productos, y mantener la dignidad de la profesión. En M&P conocemos estas regulaciones.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué canales funcionan mejor para clínicas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads es el más efectivo (60-70% del presupuesto) porque captura pacientes buscando activamente. Meta Ads funciona para awareness y remarketing (20-30%). SEO local es fundamental para aparecer en búsquedas de zona.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo manejan la confidencialidad de pacientes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cumplimos estrictamente con la Ley de Protección de Datos Personales. No accedemos a fichas clínicas, solo gestionamos leads de marketing. Los datos de contacto se transfieren de forma segura al CRM de la clínica.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Trabajan con todas las especialidades médicas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, tenemos experiencia en: Odontología, Oftalmología, Dermatología, Cirugía plástica, Traumatología, Ginecología, Pediatría, Medicina estética, Psicología, Nutrición, y clínicas multiespecialidad.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué resultados puedo esperar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'En promedio, nuestros clientes de salud ven: +150% en consultas agendadas, -40% en costo por paciente nuevo, 4-6 semanas para ver resultados iniciales, y ROI de 5-10x considerando el valor de vida del paciente.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Incluyen gestión de reputación online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, es parte integral del servicio. Incluye: gestión de Google Business Profile, estrategia de reseñas, monitoreo de menciones, y respuesta a comentarios. Las reseñas positivas son cruciales en salud.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Pueden hacer marketing para Isapres y Fonasa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, segmentamos campañas según convenios. Podemos destacar qué Isapres tienen convenio, bonificaciones, y facilidades de pago. También campañas específicas para pacientes Fonasa en centros que los atienden.',
          },
        },
      ],
    },
  ],
}

export default function MarketingSaludPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-900 via-red-800 to-pink-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium">Marketing Ético para Salud</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-red-400">Salud</span> en Chile
              </h1>

              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
                Generamos pacientes calificados para clínicas, centros médicos y profesionales de la salud.
                Estrategias éticas que cumplen con la normativa chilena.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-red-400">+150%</div>
                  <div className="text-sm text-red-200">Más Consultas</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-red-400">$25.000</div>
                  <div className="text-sm text-red-200">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-red-400">8x</div>
                  <div className="text-sm text-red-200">ROI Promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular Resultados
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Especialidades */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Experiencia en Todas las Especialidades
                </h2>
                <p className="text-xl text-gray-600">
                  Estrategias adaptadas a cada tipo de servicio de salud
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <Stethoscope className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Clínicas y Centros Médicos</h3>
                  <p className="text-sm text-gray-600">Multiespecialidad, urgencias, medicina general</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <Heart className="w-10 h-10 text-pink-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Odontología</h3>
                  <p className="text-sm text-gray-600">Clínicas dentales, ortodoncia, implantes</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <Users className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Medicina Estética</h3>
                  <p className="text-sm text-gray-600">Cirugía plástica, dermatología, tratamientos</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <Building2 className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Especialidades</h3>
                  <p className="text-sm text-gray-600">Oftalmología, traumatología, ginecología</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Shield className="w-12 h-12 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Marketing Ético y Regulado
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Conocemos y cumplimos la normativa de publicidad médica en Chile:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Código de Ética del Colegio Médico
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Normativa Minsal de publicidad
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Ley de Protección de Datos Personales
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Registro ISP cuando aplica
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Servicios de Marketing para Salud
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Google Ads para Salud</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Capturamos pacientes buscando activamente servicios médicos en tu zona.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Keywords por especialidad</li>
                    <li>• Extensiones de llamada</li>
                    <li>• Segmentación geográfica</li>
                    <li>• Campañas por convenio</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">SEO Local Médico</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Posicionamiento orgánico para búsquedas de salud en tu comuna.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Google Business Profile</li>
                    <li>• Contenido de salud</li>
                    <li>• Schema MedicalOrganization</li>
                    <li>• Citas de directorios médicos</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Gestión de Reputación</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Las reseñas son críticas en salud. Gestionamos tu reputación online.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Estrategia de reseñas</li>
                    <li>• Monitoreo de menciones</li>
                    <li>• Respuesta a comentarios</li>
                    <li>• Gestión de crisis</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Meta Ads para Clínicas</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Awareness y remarketing en Facebook e Instagram.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Campañas de awareness</li>
                    <li>• Remarketing de visitantes</li>
                    <li>• Lead Ads para consultas</li>
                    <li>• Contenido educativo</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Contenido de Salud</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Contenido educativo que posiciona tu expertise y genera confianza.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Artículos de blog</li>
                    <li>• Videos explicativos</li>
                    <li>• Guías de pacientes</li>
                    <li>• FAQ de especialidad</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Sistema de Agendamiento</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Integración de reserva online para convertir más leads.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Widget de agenda en web</li>
                    <li>• WhatsApp Business</li>
                    <li>• Recordatorios automáticos</li>
                    <li>• Integración con software médico</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks Sector Salud Chile 2025
              </h2>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Especialidad</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CPL Promedio</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Conversión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Odontología</td>
                      <td className="px-6 py-4 text-center">$15.000 - $30.000</td>
                      <td className="px-6 py-4 text-center">8-12%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Medicina General</td>
                      <td className="px-6 py-4 text-center">$20.000 - $40.000</td>
                      <td className="px-6 py-4 text-center">6-10%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Especialidades</td>
                      <td className="px-6 py-4 text-center">$30.000 - $60.000</td>
                      <td className="px-6 py-4 text-center">5-8%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Cirugía Estética</td>
                      <td className="px-6 py-4 text-center">$50.000 - $100.000</td>
                      <td className="px-6 py-4 text-center">3-6%</td>
                    </tr>
                    <tr className="bg-red-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-red-600">$25.000</td>
                      <td className="px-6 py-4 text-center text-red-600">9.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cuánto cuesta captar un paciente nuevo?</h3>
                  <p className="text-gray-600 text-sm">
                    Varía por especialidad: Dental $15.000-30.000, Medicina general $20.000-40.000,
                    Especialidades $30.000-60.000, Cirugía estética $50.000-100.000. El ROI depende del valor de vida del paciente.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Es legal hacer publicidad médica en Chile?</h3>
                  <p className="text-gray-600 text-sm">
                    Sí, es legal pero regulada. Debe cumplir normas del Colegio Médico y Minsal. En M&P conocemos estas regulaciones
                    y creamos campañas que cumplen con toda la normativa.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué canales funcionan mejor para clínicas?</h3>
                  <p className="text-gray-600 text-sm">
                    Google Ads es el más efectivo (60-70%) porque captura pacientes buscando activamente.
                    Meta Ads funciona para awareness y remarketing (20-30%). SEO local es fundamental.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cómo manejan la confidencialidad?</h3>
                  <p className="text-gray-600 text-sm">
                    Cumplimos la Ley de Protección de Datos. No accedemos a fichas clínicas, solo gestionamos leads de marketing.
                    Los datos se transfieren de forma segura al CRM de la clínica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Páginas Relacionadas */}
        <section className="py-12 bg-red-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold mb-4">También te puede interesar:</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/marketing-digital-b2b-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Marketing B2B
                </Link>
                <Link href="/servicios/google-ads-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Google Ads Chile
                </Link>
                <Link href="/marketing-digital-educacion-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Marketing Educación
                </Link>
                <Link href="/precios-agencia-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Precios Agencias
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-red-900 to-pink-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Atraer Más Pacientes?
              </h2>
              <p className="text-xl text-red-100 mb-8">
                Agenda una reunión estratégica. Analizamos tu clínica y
                diseñamos un plan de marketing ético y efectivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
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
