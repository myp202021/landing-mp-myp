import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Target, TrendingUp, DollarSign, Users, CheckCircle, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Google Ads vs Meta Ads: Cuál Elegir en Chile 2025 (Comparativa Completa)',
  description: 'Comparativa completa Google Ads vs Meta Ads en Chile 2025. CPL, ROAS, industrias ideales y cuándo usar cada plataforma. Datos reales de +200 campañas.',
  keywords: 'google ads vs meta ads, google ads vs facebook ads chile, comparacion plataformas publicidad digital, cpc google ads chile, cpl meta ads chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/google-ads-vs-meta-ads-cual-elegir-chile-2025'
  },
  openGraph: {
    title: 'Google Ads vs Meta Ads: Cuál Elegir en Chile 2025 (Comparativa Completa)',
    description: 'Comparativa completa Google Ads vs Meta Ads en Chile 2025. CPL, ROAS, industrias ideales y cuándo usar cada plataforma. Datos reales de +200 campañas.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/google-ads-vs-meta-ads-cual-elegir-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" /></Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Comparativa</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 16 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Google Ads vs Meta Ads: Cuál Elegir en Chile 2025
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Comparativa completa basada en datos reales de +200 campañas en Chile. CPL, ROAS, industrias ideales y cuándo usar cada plataforma.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                Una de las preguntas más frecuentes que recibimos en M&P es: "¿Dónde invierto primero: Google Ads o Meta Ads?". La respuesta, como en todo lo que tiene que ver con marketing data-driven, es: depende de tu industria, ticket promedio, ciclo de venta y objetivos.
              </p>
              <p className="text-gray-700 mb-4">
                En este artículo hacemos una comparativa completa entre Google Ads y Meta Ads en Chile 2025, con datos reales de más de 200 campañas que hemos gestionado. Te mostraremos CPL promedio, ROAS esperado, industrias donde cada plataforma funciona mejor, y cómo combinarlas para maximizar resultados.
              </p>
              <p className="text-gray-700">
                Si estás buscando una respuesta rápida y datos concretos para tomar decisiones, este artículo es para ti.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Las diferencias fundamentales
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">Google Ads</span>
                </h3>
                <p className="text-gray-700 mb-4 font-semibold">Tipo de intención: Demanda activa (pull marketing)</p>
                <p className="text-gray-700 mb-4">
                  El usuario está buscando activamente una solución. Ej: "agencia marketing digital Santiago", "arriendo departamento Las Condes".
                </p>
                <p className="text-gray-700 font-semibold mb-2">Formatos principales:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Search (anuncios en búsqueda)</li>
                  <li>Performance Max (multicanal automatizado)</li>
                  <li>Display (banners en red de Google)</li>
                  <li>YouTube (video)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">Meta Ads</span>
                </h3>
                <p className="text-gray-700 mb-4 font-semibold">Tipo de intención: Demanda latente (push marketing)</p>
                <p className="text-gray-700 mb-4">
                  El usuario no está buscando, pero tiene un perfil que calza con tu cliente ideal. Ej: mujer 25-40 años, interesada en fitness, vive en Santiago.
                </p>
                <p className="text-gray-700 font-semibold mb-2">Formatos principales:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Feed (Facebook e Instagram)</li>
                  <li>Stories (formato vertical)</li>
                  <li>Reels (video corto)</li>
                  <li>Advantage+ Shopping (ecommerce)</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">Regla clave M&P:</p>
              <p className="text-gray-700">
                Google captura demanda existente. Meta genera demanda nueva. Ambas son complementarias, no excluyentes.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Comparativa de costos: CPL y CPC en Chile 2025
            </h2>

            <p className="text-gray-700 mb-4">
              Basado en nuestros datos de más de 200 campañas activas en Chile durante 2025:
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Métrica</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-blue-700">Google Ads</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-purple-700">Meta Ads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">CPC promedio</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$350 - $1.200 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$120 - $450 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">CPL B2C</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$3.000 - $8.000 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$1.500 - $5.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">CPL B2B</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$8.000 - $25.000 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$6.000 - $18.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">ROAS promedio</td>
                    <td className="px-6 py-4 text-sm text-gray-700">3.5x - 6.5x</td>
                    <td className="px-6 py-4 text-sm text-gray-700">4.2x - 8.5x</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Presupuesto mínimo</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$300.000 CLP/mes</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$200.000 CLP/mes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">Nota importante:</p>
              <p className="text-gray-700">
                Estos son promedios. En retail y ecommerce, Meta suele tener CPL más bajo. En servicios profesionales y B2B de ticket alto, Google Search cierra mejor.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              ¿Cuándo elegir Google Ads?
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Google Ads es ideal para:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>Servicios profesionales:</strong> abogados, contadores, agencias, consultoras.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>Inmobiliarias:</strong> arriendo, venta, proyectos nuevos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>SaaS y tecnología B2B:</strong> usuarios buscando software específico.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>Educación online:</strong> cursos, diplomados, MBA.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>Salud privada:</strong> clínicas, dentistas, cirugías estéticas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>Seguros y finanzas:</strong> créditos, seguros de vida, inversiones.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Caso real: Inmobiliaria en Las Condes</h3>
              <ul className="space-y-2">
                <li>• Plataforma: Google Search</li>
                <li>• Inversión mensual: $2.500.000 CLP</li>
                <li>• CPL: $18.000 CLP</li>
                <li>• Leads mensuales: 139</li>
                <li>• Conversión a venta: 3.5%</li>
                <li>• Ticket promedio: 2.200 UF</li>
              </ul>
              <p className="text-xl font-bold mt-4">ROAS: 6.8x (altamente positivo)</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-pink-600" />
              ¿Cuándo elegir Meta Ads?
            </h2>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Meta Ads es ideal para:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>E-commerce:</strong> retail, moda, electrónica, belleza.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>Restaurantes y delivery:</strong> foodtech, apps de comida.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>Gimnasios y fitness:</strong> clases, nutrición, entrenadores.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>Eventos y ticketing:</strong> conciertos, workshops, conferencias.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>Turismo local:</strong> hoteles, tours, actividades.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>Apps móviles:</strong> instalaciones y engagement.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Caso real: E-commerce moda femenina</h3>
              <ul className="space-y-2">
                <li>• Plataforma: Meta Ads (Advantage+ Shopping)</li>
                <li>• Inversión mensual: $1.800.000 CLP</li>
                <li>• CPL: $2.400 CLP</li>
                <li>• Conversión: 8.5%</li>
                <li>• Ticket promedio: $42.000 CLP</li>
              </ul>
              <p className="text-xl font-bold mt-4">ROAS: 8.2x</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-600" />
              La estrategia óptima: combinar ambas plataformas
            </h2>

            <p className="text-gray-700 mb-4">
              En M&P, el 78% de nuestros clientes más exitosos usan ambas plataformas de manera complementaria:
            </p>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Modelo de inversión recomendado:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">1.</span>
                  <span><strong>Google Search (40%):</strong> captura demanda directa y bottom-funnel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">2.</span>
                  <span><strong>Meta Ads (35%):</strong> prospecting, awareness y remarketing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">3.</span>
                  <span><strong>Google PMax (15%):</strong> automatización multicanal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">4.</span>
                  <span><strong>LinkedIn/YouTube (10%):</strong> autoridad y awareness.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist de decisión M&P
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <p className="text-gray-700 font-semibold mb-4">Responde estas preguntas para decidir:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>¿La gente busca activamente tu producto/servicio en Google? → <strong>Prioriza Google Ads</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>¿Tu público objetivo está claramente segmentado por edad, ubicación e intereses? → <strong>Prioriza Meta Ads</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>¿Tu producto es visual (fotos, videos)? → <strong>Meta Ads</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>¿Vendes servicios de alto ticket ({'>'} $500.000 CLP)? → <strong>Google Search</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>¿Quieres awareness antes de conversión? → <strong>Meta primero, Google después</strong></span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              No existe una respuesta universal sobre cuál plataforma es "mejor". Google Ads y Meta Ads tienen fortalezas complementarias que, cuando se usan de forma estratégica, multiplican resultados.
            </p>

            <p className="text-gray-700 mb-6">
              En M&P diseñamos estrategias multicanal basadas en datos reales de tu industria en Chile, proyectando CAC, LTV y ROAS antes de invertir. Así aseguramos que cada peso se distribuya en el canal correcto, en el momento correcto.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿No sabes por dónde empezar?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos, con datos de tu industria, cuál es el mix óptimo de inversión.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/"><img src="/logo-blanco.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" /></Link>
          <p className="text-gray-400">© 2025 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
