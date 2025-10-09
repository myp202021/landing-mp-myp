import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Home, Target, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 implementa Inmobiliario con estrategias de performance, costos reales y casos prácticos.',
  keywords: 'agencia de marketing digital, Inmobiliario Chile, marketing digital Chile 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/marketing-inmobiliario-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas',
    description: 'Estrategias de Inmobiliario en Chile 2025 por agencia de marketing digital experta en performance.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/marketing-inmobiliario-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-white">
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
            <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-bold">Inmobiliario</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 21 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas
          </h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-sky-50 border-l-4 border-sky-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">En 2025, el marketing de contenidos ya no es publicar un par de artículos en un blog y esperar resultados. En Chile, donde la competencia digital crece cada mes, las marcas que logran diferenciarse son aquellas que transforman contenido en ventas reales, no en métricas de vanidad.</p>
              <p className="text-gray-700 mb-4">El error más común es creer que contenido es solo branding. En realidad, bien ejecutado, se convierte en una de las estrategias más efectivas para reducir CAC, aumentar LTV y generar confianza en el largo plazo.</p>
              <p className="text-gray-700 mb-4">Aquí es donde una agencia de marketing digital juega un rol clave: diseña contenidos estratégicos (blogs, videos, ebooks, newsletters, podcasts) con lógica de performance y reportería financiera.</p>

            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Home className="w-8 h-8 text-sky-600" />
              Puntos Clave
            </h2>

            <div className="bg-white border-2 border-sky-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
            <p className="text-gray-700 mb-4">Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas</p>

            <p className="text-gray-700 mb-4">Aquí es donde una agencia de marketing digital juega un rol clave: diseña contenidos estratégicos (blogs, videos, ebooks, newsletters, podcasts) con lógica de performance y reportería financiera.</p>

            <p className="text-gray-700 mb-4">¿Por qué el marketing de contenidos es clave en Chile 2025?</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>📊 SEO e IA: Google y las plataformas de IA responden cada vez más con contenidos largos y bien optimizados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>📹 Consumo de video: TikTok, YouTube y Reels concentran gran parte de la atención en Chile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>🧠 Confianza: antes de comprar, los usuarios investigan, comparan y buscan validación en contenido.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>💸 Costos crecientes en Ads: el contenido ayuda a reducir dependencia de CPC altos.</span>
                </li>
            <p className="text-gray-700 mb-4">Cómo una agencia de marketing digital diseña una estrategia de contenidos</p>

            <p className="text-gray-700 mb-4">1. Investigación y planificación</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Keywords de intención comercial y long-tail.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Análisis de competidores en Google y redes sociales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Definición de rubros prioritarios (ej: inmobiliario, SaaS, retail).</span>
                </li>
            <p className="text-gray-700 mb-4">2. Producción de contenidos</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Blogs evergreen: artículos de 2.500+ palabras con data local.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Videos cortos: para TikTok, Reels y YouTube Shorts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Ebooks y guías: para captar leads B2B.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Podcasts y webinars: para reforzar autoridad de marca.</span>
                </li>
            <p className="text-gray-700 mb-4">3. Distribución multicanal</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>SEO para búsquedas en Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Promoción en LinkedIn, Meta y TikTok.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Email marketing con flujos de nurturing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>WhatsApp para seguimiento post-descarga.</span>
                </li>
            <p className="text-gray-700 mb-4">4. Medición de performance</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Tráfico orgánico.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Leads generados por contenido.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Impacto en CAC y LTV.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>ROI atribuido a contenido.</span>
                </li>
            <div className="bg-gradient-to-r from-sky-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ejemplo práctico en Chile</h3>
            </div>

            <div className="bg-gradient-to-r from-sky-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Caso: empresa de software SaaS</h3>
            </div>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Problema: dependencia de Google Ads con CPL alto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Estrategia:</span>
                </li>
            <p className="text-gray-700 mb-4">○	Blog con artículos sobre “tendencias de RRHH en Chile 2025”.</p>

            <p className="text-gray-700 mb-4">○	Videos cortos en LinkedIn con insights ejecutivos.</p>

            <p className="text-gray-700 mb-4">○	Ebook descargable con benchmark de su industria.</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Resultados:</span>
                </li>
            <p className="text-gray-700 mb-4">○	Tráfico orgánico ↑ 240% en 6 meses.</p>

            <p className="text-gray-700 mb-4">Benchmarks de marketing de contenidos en Chile 2025</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Costo promedio por lead vía contenido: \$6.000 – \$12.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>CAC reducido en promedio: 20–35%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Tiempo para resultados visibles: 4–6 meses.</span>
                </li>
            <p className="text-gray-700 mb-4">Costos de implementar marketing de contenidos con agencia</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Setup inicial (plan editorial + SEO): \$1.200.000 – \$2.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Gestión mensual con agencia de marketing digital: \$600.000 – \$1.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Producción audiovisual avanzada (videos/podcasts): desde \$800.000 CLP adicionales.</span>
                </li>
            <p className="text-gray-700 mb-4">Checklist M&P para marketing de contenidos</p>

                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>✅ Define keywords con intención de negocio.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>✅ Diseña un calendario editorial de al menos 3–6 meses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>✅ Produce blogs evergreen de +2.500 palabras.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>✅ Integra blogs con campañas pagadas y nurturing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>✅ Mide CPL, CAC y ROI atribuibles al contenido.</span>
                </li>

              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              En 2025, Inmobiliario en Chile se ha convertido en una estrategia fundamental para las empresas que buscan resultados medibles y ROI positivo.
            </p>

            <p className="text-gray-700 mb-6">
              👉 En M&P diseñamos e implementamos estrategias de Inmobiliario con foco en performance, integración multicanal y reportería financiera clara.
            </p>

            <div className="bg-gradient-to-br from-sky-600 to-pink-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres implementar Inmobiliario en tu empresa?
              </h3>
              <p className="text-xl text-sky-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo transformar tu inversión en resultados reales.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-sky-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
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
