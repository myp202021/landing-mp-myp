import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Youtube, Target, DollarSign, TrendingUp, CheckCircle, Video } from 'lucide-react'

export const metadata: Metadata = {
  title: 'YouTube Ads en Chile 2025: Cómo una Agencia de Marketing Digital Usa Video Performance para Aumentar Conversiones',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa YouTube Ads y video performance para aumentar conversiones. Costos reales y estrategias.',
  keywords: 'YouTube Ads Chile, publicidad en video, costos YouTube Ads, agencia marketing digital video, agencia de marketing digital',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/youtube-ads-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'YouTube Ads en Chile 2025: Cómo una Agencia de Marketing Digital Usa Video Performance',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa YouTube Ads y video performance para aumentar conversiones. Costos reales y estrategias.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/youtube-ads-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-white">
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">YouTube Ads</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 15 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            YouTube Ads en Chile 2025: Cómo una Agencia de Marketing Digital Usa Video Performance para Aumentar Conversiones
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            En Chile 2025, YouTube se transformó en un motor de performance capaz de generar conversiones directas con costos competitivos y resultados medibles en tiempo real.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2025, el consumo de video online alcanzó cifras históricas: más del 92% de los usuarios de internet ven YouTube al menos una vez al mes, y el tiempo promedio diario dedicado a la plataforma supera los 60 minutos.
              </p>
              <p className="text-gray-700 mb-4">
                Para las marcas, YouTube ya no es solo un canal de branding. Hoy, bien gestionado, se convierte en un motor de performance capaz de generar conversiones directas. Sin embargo, el éxito depende de la estrategia y de contar con una agencia de marketing digital especializada en performance y datos.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Youtube className="w-8 h-8 text-red-600" />
              El poder del video en Chile
            </h2>

            <div className="bg-white border-2 border-red-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>92% de penetración</strong> entre usuarios de internet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Segmentación avanzada</strong> gracias a Google Ads (intereses, afinidades, intención de compra)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Creciente uso de Shorts</strong> (más de 2.000 millones de visualizaciones diarias globales)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Alta recordación:</strong> hasta 70% más awareness que TV tradicional</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Video className="w-8 h-8 text-purple-600" />
              Formatos de YouTube Ads
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">TrueView in-stream (salteables)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Los más usados</li>
                  <li>Se pagan solo si el usuario ve más de 30 segundos o interactúa</li>
                  <li>Útiles para awareness y consideración</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">TrueView discovery</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Aparecen en resultados de búsqueda o junto a videos relacionados</li>
                  <li>Útiles para captar usuarios en etapa de investigación</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bumper Ads (6 segundos)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>No salteables</li>
                  <li>CPM más bajo</li>
                  <li>Altísima recordación, pero limitados en storytelling</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Shorts Ads</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Integrados en YouTube Shorts</li>
                  <li>Consumo masivo en Chile (similar a TikTok)</li>
                  <li>Excelente para awareness masivo y rápido</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Costos reales de YouTube Ads en Chile 2025
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPV promedio</h3>
                <p className="text-3xl font-black text-green-600 mb-2">$40 - $120</p>
                <p className="text-gray-600">CLP por vista</p>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPC promedio</h3>
                <p className="text-3xl font-black text-blue-600 mb-2">$350 - $600</p>
                <p className="text-gray-600">CLP por clic</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPM promedio</h3>
                <p className="text-3xl font-black text-purple-600 mb-2">$2.000 - $5.000</p>
                <p className="text-gray-600">CLP por mil impresiones</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Estrategia de una agencia de marketing digital
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Paso 1 – Definición de objetivos</h3>
                <ul className="space-y-2">
                  <li>• Awareness: alcance y recordación</li>
                  <li>• Consideración: interacción con contenido</li>
                  <li>• Conversión: leads o ventas</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Paso 2 – Segmentación precisa</h3>
                <ul className="space-y-2">
                  <li>• Intereses + intención de compra</li>
                  <li>• Audiencias personalizadas (visitantes del sitio, leads)</li>
                  <li>• Ubicaciones estratégicas (videos de la competencia)</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Paso 3 – Creatividad optimizada</h3>
                <ul className="space-y-2">
                  <li>• Primeros 5 segundos: gancho visual + verbal</li>
                  <li>• Storytelling breve y directo</li>
                  <li>• CTA claro: clic a landing, descargar guía, agendar demo</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Paso 4 – Medición y optimización</h3>
                <ul className="space-y-2">
                  <li>• Dashboards conectados a Google Ads y Analytics 4</li>
                  <li>• KPIs: CPV, CPC, CPL, CAC y ROI por campaña</li>
                  <li>• Ajustes semanales en segmentación y creatividades</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Casos prácticos en Chile</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Caso 1: Inmobiliaria en Temuco</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Campaña de videos 15 segundos</li>
                  <li>• CPV: $60 CLP</li>
                  <li>• Leads generados: 500 en un mes</li>
                  <li>• CAC: $380.000 CLP (ticket 3.500 UF)</li>
                </ul>
                <p className="text-xl font-bold">ROI positivo gracias a segmentación por intención de compra</p>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-pink-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Caso 2: SaaS B2B en Santiago</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Document Ads + video explicativo</li>
                  <li>• CPC: $480 CLP</li>
                  <li>• CAC: $290.000 CLP</li>
                  <li>• Ticket anual: $2.500.000 CLP</li>
                </ul>
                <p className="text-xl font-bold">ROI altamente rentable, payback de 2 meses</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&amp;P para YouTube Ads
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define si el objetivo es awareness, consideración o conversión</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa formatos distintos según etapa del funnel (TrueView, Shorts, Bumper)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Segmenta por intereses + intención de compra + remarketing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Optimiza creatividades pensando en los primeros 5 segundos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide CPV, CPL y CAC, no solo vistas</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              En 2025, YouTube Ads en Chile dejó de ser un canal exclusivo de branding. Bien trabajado por una agencia de marketing digital especializada en performance, puede transformarse en un motor de leads y ventas con costos competitivos y resultados medibles en tiempo real.
            </p>

            <p className="text-gray-700 mb-6">
              En M&amp;P diseñamos campañas de YouTube Ads con foco en ROI, integradas a Google, Meta y LinkedIn, y conectadas a dashboards que hablan el lenguaje de las finanzas.
            </p>

            <div className="bg-gradient-to-br from-red-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres convertir YouTube en un motor de ventas?
              </h3>
              <p className="text-xl text-red-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo usar video performance en tu industria.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-red-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
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
