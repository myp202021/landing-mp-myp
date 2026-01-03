import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building, Home, TrendingUp, Target, Users, CheckCircle, MapPin, Camera, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital Inmobiliario en Chile | Agencia Especializada | M&P',
  description: 'Agencia de marketing digital especializada en inmobiliarias y corredoras de propiedades en Chile. Google Ads, Meta Ads, portales y estrategias para vender más propiedades. CPL desde $8.000.',
  keywords: 'marketing digital inmobiliario chile, publicidad inmobiliaria chile, google ads inmobiliarias, marketing corredora propiedades, leads inmobiliarios chile, publicidad propiedades',
  openGraph: {
    title: 'Marketing Digital Inmobiliario en Chile | M&P',
    description: 'Especialistas en generar leads calificados para inmobiliarias. CPL desde $8.000.',
    url: 'https://www.mulleryperez.cl/marketing-digital-inmobiliario-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-inmobiliario-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-inmobiliario-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-inmobiliario-chile',
      name: 'Marketing Digital Inmobiliario en Chile',
      description: 'Agencia especializada en marketing digital para el sector inmobiliario en Chile.',
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital Inmobiliario',
      description: 'Servicio de marketing digital especializado para inmobiliarias y corredoras',
      provider: { '@type': 'Organization', name: 'Müller & Pérez' },
      areaServed: { '@type': 'Country', name: 'Chile' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un lead inmobiliario en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CPL inmobiliario en Chile varía según el tipo de propiedad: Departamentos $8.000-15.000 CLP, Casas $12.000-25.000 CLP, Proyectos nuevos $15.000-35.000 CLP, Propiedades de lujo $25.000-50.000 CLP. En M&P logramos CPL promedio de $12.000 con alta calificación.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué canales funcionan mejor para inmobiliarias?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La combinación más efectiva es: Google Ads (50%) para capturar búsquedas activas, Meta Ads (30%) para remarketing y awareness, y Portales inmobiliarios (20%) como Portal Inmobiliario y Yapo. El mix depende del tipo de propiedad y ticket.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto tiempo toma vender una propiedad con marketing digital?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Con una estrategia digital bien ejecutada, el tiempo promedio de venta se reduce en 40%. Departamentos: 45-60 días, Casas: 60-90 días, Propiedades comerciales: 90-120 días. La clave está en la calidad de los leads y el seguimiento.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué presupuesto necesito para publicidad inmobiliaria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para corredoras pequeñas: $500.000-800.000 CLP/mes. Corredoras medianas: $1.000.000-2.000.000 CLP/mes. Inmobiliarias con proyectos: $2.000.000-5.000.000 CLP/mes. El retorno típico es de 10-20x en comisiones generadas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo miden la calidad de los leads inmobiliarios?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Usamos lead scoring basado en: presupuesto declarado, zona de interés, tipo de propiedad, urgencia de compra, y engagement con el contenido. Solo contamos como MQL leads que cumplen criterios mínimos de calificación y tienen capacidad de compra.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Trabajan con proyectos inmobiliarios nuevos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, tenemos experiencia en lanzamiento de proyectos inmobiliarios. Incluye: campaña de pre-venta, generación de lista de interesados, eventos de lanzamiento, remarketing a visitantes de sala de ventas, y seguimiento hasta la promesa.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué incluye el servicio de marketing inmobiliario?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Incluye: gestión de campañas Google y Meta Ads, optimización de fichas en portales, fotografía y video profesional (opcional), landing pages por proyecto, CRM de leads, reportes semanales de rendimiento, y reuniones de optimización.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Hacen marketing para arriendo de propiedades?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, aunque el foco principal es venta. Para arriendos el CPL es menor ($5.000-10.000 CLP) pero el ticket también. Recomendamos arriendos solo si tienes volumen alto o propiedades de alto valor (arriendos sobre $1.500.000/mes).',
          },
        },
      ],
    },
  ],
}

export default function MarketingInmobiliarioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Building className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Especialistas Inmobiliarios</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital{' '}
                <span className="text-emerald-400">Inmobiliario</span> en Chile
              </h1>

              <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                Generamos leads calificados para tu corredora o inmobiliaria.
                Google Ads, Meta Ads y estrategias multicanal que venden propiedades.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-400">$12.000</div>
                  <div className="text-sm text-emerald-200">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-400">-40%</div>
                  <div className="text-sm text-emerald-200">Tiempo de Venta</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-400">15x</div>
                  <div className="text-sm text-emerald-200">ROI Promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
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

        {/* Tipos de Clientes */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Soluciones para Todo el Sector Inmobiliario
                </h2>
                <p className="text-xl text-gray-600">
                  Estrategias adaptadas según tu modelo de negocio
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl">
                  <Home className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Corredoras de Propiedades</h3>
                  <p className="text-gray-600 mb-4">
                    Generación de leads para corredores independientes y corredoras establecidas.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Captación de propietarios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Leads de compradores
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Posicionamiento local
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
                  <Building className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Inmobiliarias y Desarrolladores</h3>
                  <p className="text-gray-600 mb-4">
                    Lanzamiento y venta de proyectos inmobiliarios nuevos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Campañas de pre-venta
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Generación de cotizaciones
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Visitas a sala de ventas
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
                  <MapPin className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Propiedades de Lujo</h3>
                  <p className="text-gray-600 mb-4">
                    Marketing premium para propiedades de alto valor.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      Targeting high-net-worth
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      Contenido premium
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      Eventos exclusivos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Servicios de Marketing Inmobiliario
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Target className="w-10 h-10 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Google Ads Inmobiliario</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Campañas de búsqueda para capturar compradores activos buscando propiedades.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Keywords por zona y tipo</li>
                    <li>• Extensiones de ubicación</li>
                    <li>• Remarketing de visitantes</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Users className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Meta Ads para Propiedades</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Anuncios visuales en Facebook e Instagram para generar interés.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Carruseles de propiedades</li>
                    <li>• Video tours</li>
                    <li>• Lead Ads nativo</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Camera className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Contenido Visual</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Fotografía profesional, video y tours virtuales para destacar propiedades.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Fotografía HDR</li>
                    <li>• Video drone</li>
                    <li>• Tour virtual 360°</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <BarChart3 className="w-10 h-10 text-orange-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Portales Inmobiliarios</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Optimización y gestión de publicaciones en Portal Inmobiliario, Yapo y otros.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Fichas optimizadas</li>
                    <li>• Destacados estratégicos</li>
                    <li>• Análisis de competencia</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <TrendingUp className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">SEO Inmobiliario</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Posicionamiento orgánico para búsquedas de propiedades en tu zona.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• SEO local por comuna</li>
                    <li>• Contenido de valor</li>
                    <li>• Google Business Profile</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Home className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Landing Pages</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Páginas de aterrizaje optimizadas para cada proyecto o propiedad destacada.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Diseño mobile-first</li>
                    <li>• Formularios optimizados</li>
                    <li>• Integración CRM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks Inmobiliarios Chile 2025
              </h2>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Tipo de Propiedad</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CPL Promedio</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Tasa Conversión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Departamentos</td>
                      <td className="px-6 py-4 text-center">$8.000 - $15.000</td>
                      <td className="px-6 py-4 text-center">3-5%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Casas</td>
                      <td className="px-6 py-4 text-center">$12.000 - $25.000</td>
                      <td className="px-6 py-4 text-center">2-4%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Proyectos Nuevos</td>
                      <td className="px-6 py-4 text-center">$15.000 - $35.000</td>
                      <td className="px-6 py-4 text-center">4-8%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Propiedades de Lujo</td>
                      <td className="px-6 py-4 text-center">$25.000 - $50.000</td>
                      <td className="px-6 py-4 text-center">1-3%</td>
                    </tr>
                    <tr className="bg-emerald-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-emerald-600">$12.000</td>
                      <td className="px-6 py-4 text-center text-emerald-600">5.2%</td>
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
                Preguntas Frecuentes sobre Marketing Inmobiliario
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Cuánto cuesta un lead inmobiliario en Chile?
                  </h3>
                  <p className="text-gray-600">
                    El CPL varía según el tipo: <strong>Departamentos $8.000-15.000</strong>, Casas $12.000-25.000,
                    Proyectos nuevos $15.000-35.000, Lujo $25.000-50.000. En M&P logramos <strong>CPL promedio de $12.000</strong>.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Qué canales funcionan mejor para inmobiliarias?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Google Ads (50%)</strong> para búsquedas activas, <strong>Meta Ads (30%)</strong> para remarketing
                    y awareness, <strong>Portales (20%)</strong> como Portal Inmobiliario y Yapo.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Cuánto tiempo toma vender una propiedad con marketing digital?
                  </h3>
                  <p className="text-gray-600">
                    Con estrategia digital, el tiempo de venta se reduce <strong>40% en promedio</strong>.
                    Departamentos: 45-60 días, Casas: 60-90 días, Comercial: 90-120 días.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Qué presupuesto necesito para publicidad inmobiliaria?
                  </h3>
                  <p className="text-gray-600">
                    Corredoras pequeñas: $500.000-800.000/mes. Medianas: $1-2M/mes.
                    Inmobiliarias con proyectos: $2-5M/mes. <strong>ROI típico de 10-20x</strong> en comisiones.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Trabajan con proyectos inmobiliarios nuevos?
                  </h3>
                  <p className="text-gray-600">
                    Sí, tenemos experiencia en lanzamientos: campañas de pre-venta, generación de lista de interesados,
                    eventos de lanzamiento, remarketing a visitantes de sala de ventas.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Hacen marketing para arriendo de propiedades?
                  </h3>
                  <p className="text-gray-600">
                    Sí, aunque el foco es venta. Para arriendos el CPL es menor ($5.000-10.000) pero el ticket también.
                    Recomendamos arriendos solo si tienes volumen alto o arriendos sobre $1.500.000/mes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Páginas Relacionadas */}
        <section className="py-12 bg-emerald-900 text-white">
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
                <Link href="/servicios/meta-ads-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Meta Ads Chile
                </Link>
                <Link href="/precios-agencia-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Precios Agencias
                </Link>
                <Link href="/ranking-agencias-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Ranking Agencias
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Vender Más Propiedades?
              </h2>
              <p className="text-xl text-emerald-100 mb-8">
                Agenda una reunión estratégica. Analizamos tu cartera de propiedades
                y diseñamos un plan de marketing efectivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta
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
      </main>
    </>
  )
}
