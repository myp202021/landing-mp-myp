import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap, BookOpen, Users, Target, CheckCircle, TrendingUp, Globe, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Educación en Chile | Universidades, Institutos y Colegios | M&P',
  description: 'Agencia de marketing digital especializada en el sector educación en Chile. Universidades, institutos, colegios y cursos online. Captamos estudiantes calificados con estrategias de performance.',
  keywords: 'marketing digital educacion chile, marketing universidades chile, publicidad institutos chile, captar estudiantes, marketing colegios chile, marketing cursos online',
  openGraph: {
    title: 'Marketing Digital para Educación en Chile | M&P',
    description: 'Especialistas en captar estudiantes para instituciones educativas. Campañas de matrícula efectivas.',
    url: 'https://www.mulleryperez.cl/marketing-digital-educacion-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-educacion-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-educacion-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-educacion-chile',
      name: 'Marketing Digital para Educación en Chile',
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital Educación',
      description: 'Marketing digital especializado para el sector educativo',
      provider: { '@type': 'Organization', name: 'Müller & Pérez' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta captar un estudiante?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CPL educacional varía según el tipo de institución: Cursos cortos $5.000-15.000 CLP, Institutos técnicos $15.000-35.000 CLP, Universidades pregrado $25.000-60.000 CLP, Postgrados $40.000-100.000 CLP. El costo por matrícula efectiva es 3-5x el CPL.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuándo debo empezar las campañas de matrícula?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para proceso regular: 3-4 meses antes del inicio de clases. Para admisión especial: 2 meses antes. Las campañas de awareness deben comenzar 6 meses antes. La competencia por estudiantes es intensa en enero-febrero y julio.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué canales funcionan mejor para captar estudiantes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para jóvenes (pregrado): Instagram/TikTok Ads (40%) + Google Ads (35%) + YouTube (25%). Para adultos (postgrado/educación continua): Google Ads (50%) + LinkedIn Ads (30%) + Meta Ads (20%). El mix varía según edad y programa.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo miden la conversión en educación?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Medimos el funnel completo: Impresiones → Clicks → Leads (solicitud info) → Contactados → Entrevistas → Postulaciones → Matrículas efectivas. El KPI principal es Costo por Matrícula (CPM), no solo CPL.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Trabajan con todas las modalidades educativas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí: Universidades tradicionales y privadas, Institutos profesionales y CFT, Colegios particulares, Preuniversitarios, Cursos y diplomados online, Educación continua, Bootcamps y programas intensivos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo segmentan por interés de carrera?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Usamos múltiples señales: búsquedas de carreras específicas, intereses en redes sociales, páginas visitadas en el sitio, resultados de test vocacionales, y datos demográficos. Creamos audiencias por facultad o área de estudio.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué pasa con los leads que no matriculan este período?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Implementamos nurturing para el siguiente período: email marketing educativo, remarketing con contenido de valor, invitaciones a eventos, y reactivación en temporada de matrícula. Un lead puede convertir hasta 2 años después.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Pueden competir con instituciones grandes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, con estrategia de nicho. Instituciones pequeñas pueden ganar en: programas específicos, ubicación geográfica, flexibilidad horaria, atención personalizada, y segmentos desatendidos. La clave es encontrar tu diferenciador.',
          },
        },
      ],
    },
  ],
}

export default function MarketingEducacionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium">Especialistas en Educación</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-indigo-400">Educación</span> en Chile
              </h1>

              <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                Captamos estudiantes calificados para universidades, institutos, colegios y cursos online.
                Estrategias de matrícula que convierten interesados en alumnos.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-400">+200%</div>
                  <div className="text-sm text-indigo-200">Más Leads</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-400">$25.000</div>
                  <div className="text-sm text-indigo-200">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-400">12%</div>
                  <div className="text-sm text-indigo-200">Lead-to-Matrícula</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Campaña de Matrícula
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

        {/* Tipos de Instituciones */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Experiencia en Todo el Sector Educativo
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
                  <GraduationCap className="w-10 h-10 text-indigo-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Universidades</h3>
                  <p className="text-sm text-gray-600">Pregrado, postgrado, educación continua y extensión</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <BookOpen className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Institutos y CFT</h3>
                  <p className="text-sm text-gray-600">Carreras técnicas, profesionales y certificaciones</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <Award className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Colegios</h3>
                  <p className="text-sm text-gray-600">Particulares, subvencionados y preuniversitarios</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <Globe className="w-10 h-10 text-green-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Online / E-learning</h3>
                  <p className="text-sm text-gray-600">Cursos, bootcamps, diplomados y programas online</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendario de Campañas */}
        <section className="py-12 bg-indigo-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Calendario de Campañas Educación Chile
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-indigo-600 font-bold">Oct - Dic</div>
                  <div className="text-sm text-gray-600">Awareness pregrado</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-indigo-600 font-bold">Ene - Mar</div>
                  <div className="text-sm text-gray-600">Matrícula 1er semestre</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-indigo-600 font-bold">Abr - Jun</div>
                  <div className="text-sm text-gray-600">Admisión especial</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-indigo-600 font-bold">Jul - Sep</div>
                  <div className="text-sm text-gray-600">Matrícula 2do semestre</div>
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
                Servicios de Marketing Educacional
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Campañas de Matrícula</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Estrategia completa para períodos de admisión con objetivos de matrícula.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Google Ads por carrera</li>
                    <li>• Social Ads segmentado</li>
                    <li>• Landing pages por programa</li>
                    <li>• Remarketing de interesados</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Social Media Educación</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Presencia en las plataformas donde están tus futuros estudiantes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Instagram para pregrado</li>
                    <li>• TikTok para Gen Z</li>
                    <li>• LinkedIn para postgrado</li>
                    <li>• YouTube para contenido largo</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">SEO Educacional</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Posicionamiento orgánico para búsquedas de carreras y programas.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SEO por carrera</li>
                    <li>• Contenido vocacional</li>
                    <li>• Schema EducationalOrganization</li>
                    <li>• Rankings de instituciones</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Lead Nurturing</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Seguimiento automatizado para convertir interesados en matriculados.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Email sequences por programa</li>
                    <li>• WhatsApp automatizado</li>
                    <li>• Contenido de decisión</li>
                    <li>• Remarketing multi-período</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Eventos Virtuales</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Open days, charlas de carrera y webinars que convierten.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Promoción de eventos</li>
                    <li>• Registro optimizado</li>
                    <li>• Seguimiento post-evento</li>
                    <li>• Contenido on-demand</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Analytics Educacional</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Métricas del funnel completo desde impresión hasta matrícula.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Costo por matrícula</li>
                    <li>• Attribution por canal</li>
                    <li>• Análisis por programa</li>
                    <li>• Reportes de admisión</li>
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
                Benchmarks Educación Chile 2025
              </h2>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Tipo</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CPL</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Lead-to-Matrícula</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Cursos cortos</td>
                      <td className="px-6 py-4 text-center">$5.000 - $15.000</td>
                      <td className="px-6 py-4 text-center">15-25%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Institutos / CFT</td>
                      <td className="px-6 py-4 text-center">$15.000 - $35.000</td>
                      <td className="px-6 py-4 text-center">8-15%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Universidades pregrado</td>
                      <td className="px-6 py-4 text-center">$25.000 - $60.000</td>
                      <td className="px-6 py-4 text-center">5-12%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Postgrados / MBA</td>
                      <td className="px-6 py-4 text-center">$40.000 - $100.000</td>
                      <td className="px-6 py-4 text-center">3-8%</td>
                    </tr>
                    <tr className="bg-indigo-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-indigo-600">$25.000</td>
                      <td className="px-6 py-4 text-center text-indigo-600">12%</td>
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
                  <h3 className="font-bold text-gray-900 mb-2">¿Cuánto cuesta captar un estudiante?</h3>
                  <p className="text-gray-600 text-sm">
                    CPL varía: Cursos cortos $5-15K, Institutos $15-35K, Universidades pregrado $25-60K, Postgrados $40-100K.
                    El costo por matrícula efectiva es 3-5x el CPL.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cuándo debo empezar las campañas?</h3>
                  <p className="text-gray-600 text-sm">
                    Proceso regular: 3-4 meses antes. Admisión especial: 2 meses. Awareness: 6 meses antes.
                    La competencia es intensa en enero-febrero y julio.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué canales funcionan mejor?</h3>
                  <p className="text-gray-600 text-sm">
                    Pregrado: Instagram/TikTok (40%) + Google (35%) + YouTube (25%).
                    Postgrado: Google (50%) + LinkedIn (30%) + Meta (20%).
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué pasa con los leads que no matriculan?</h3>
                  <p className="text-gray-600 text-sm">
                    Implementamos nurturing para el siguiente período: email marketing, remarketing, invitaciones a eventos.
                    Un lead puede convertir hasta 2 años después.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios Relacionados */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Servicios para Educación</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="group block bg-gray-50 hover:bg-indigo-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Google Ads Educación</h3>
                <p className="text-gray-600 text-sm mb-3">Campañas por carrera y programa para capturar postulantes</p>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/servicios/meta-ads-chile" className="group block bg-gray-50 hover:bg-indigo-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Meta Ads para Institutos</h3>
                <p className="text-gray-600 text-sm mb-3">Instagram, TikTok y Facebook para llegar a estudiantes</p>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/servicios/performance-marketing" className="group block bg-gray-50 hover:bg-indigo-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Performance Marketing</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategia multicanal para períodos de admisión</p>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Relacionados */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Artículos sobre Marketing Educación</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/marketing-educacion-agencia-marketing-digital-chile-2025" className="group block bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-3">Educación</span>
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Marketing Educación Chile 2025</h3>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/tiktok-ads-agencia-marketing-digital-chile-2025" className="group block bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold mb-3">TikTok</span>
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">TikTok Ads para Educación</h3>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/inbound-marketing-agencia-marketing-digital-chile-2025" className="group block bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3">Inbound</span>
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Inbound Marketing Educación</h3>
                <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Llenar tus Aulas?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Agenda una reunión estratégica. Planificamos tu próxima campaña
                de matrícula con objetivos claros.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
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
