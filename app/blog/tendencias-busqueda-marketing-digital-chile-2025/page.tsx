import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Building2, Users, Target, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tendencias de Búsqueda en Marketing Digital en Chile 2025: Agencias vs. Equipos Internos',
  description: 'Descubre cómo en Chile 2025 crecen las búsquedas sobre agencias, equipos internos e híbridos en marketing digital, y cuál modelo conviene más.',
  keywords: 'tendencias de búsqueda marketing digital Chile, agencias marketing digital Chile, equipo in-house marketing, modelo híbrido marketing',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/tendencias-busqueda-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Tendencias de Búsqueda en Marketing Digital en Chile 2025: Agencias vs. Equipos Internos',
    description: 'Descubre cómo en Chile 2025 crecen las búsquedas sobre agencias, equipos internos e híbridos en marketing digital, y cuál modelo conviene más.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/tendencias-busqueda-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Tendencias de Búsqueda en Marketing Digital en Chile 2025: Agencias vs. Equipos Internos',
    description: 'Descubre cómo en Chile 2025 crecen las búsquedas sobre agencias, equipos internos e híbridos en marketing digital, y cuál modelo conviene más.',
    url: 'https://www.mulleryperez.cl/blog/tendencias-busqueda-marketing-digital-chile-2025',
    datePublished: '2025-10-09T00:00:00.000Z',
    dateModified: '2025-10-09T00:00:00.000Z',
    author: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/blog/tendencias-busqueda-marketing-digital-chile-2025'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">Tendencias</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 14 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Tendencias de Búsqueda en Marketing Digital en Chile 2025: Agencias vs. Equipos Internos
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            El 2025 marcó un cambio en cómo las empresas chilenas entienden el marketing digital. Análisis de las tendencias de búsqueda y comparación de modelos.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                El 2025 marcó un cambio en cómo las empresas chilenas entienden el marketing digital. Cada vez más gerentes y directores de marketing buscan en Google y LinkedIn comparaciones concretas:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>¿Conviene contratar una agencia externa?</li>
                <li>¿Armar un equipo interno de marketing digital?</li>
                <li>¿O avanzar hacia un modelo híbrido que combine ambos mundos?</li>
              </ul>
              <p className="text-gray-700">
                El crecimiento de estas búsquedas refleja un mercado más maduro y una necesidad clara: tomar decisiones basadas en datos, no solo en percepciones. En M&P analizamos estas tendencias y las convertimos en insights prácticos para empresas que necesitan maximizar retorno y reducir riesgos.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Qué están buscando las empresas chilenas
            </h2>

            <p className="text-gray-700 mb-4">
              Las queries que más han crecido en Google y foros profesionales en Chile durante 2025 incluyen:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>"Agencia de marketing digital en Chile".</li>
              <li>"Equipo in-house de marketing digital".</li>
              <li>"Consultor freelance marketing digital".</li>
              <li>"Costo agencia marketing digital vs equipo interno".</li>
              <li>"Caso de éxito campañas digitales Chile".</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">✅ Interpretación M&P:</p>
              <p className="text-gray-700">
                No se trata solo de contratar, sino de comparar alternativas. Las empresas están evaluando modelos de trabajo, su rentabilidad y escalabilidad.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Comparación de modelos: agencia, interno e híbrido
            </h2>

            <div className="grid md:grid-cols-1 gap-6 mb-12">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  1. Agencia externa de marketing digital
                </h3>
                <div className="mb-4">
                  <p className="font-semibold text-green-700 mb-2">Ventajas:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Acceso inmediato a especialistas en Google, Meta, TikTok y LinkedIn.</li>
                    <li>Escalabilidad rápida: más campañas, más creatividades, más reporting.</li>
                    <li>Benchmarks y aprendizajes de múltiples industrias.</li>
                  </ul>
                  <p className="font-semibold text-red-700 mb-2">Desventajas:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Menor control directo.</li>
                    <li>Riesgo de falta de personalización si la agencia es masiva.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  2. Equipo interno (in-house)
                </h3>
                <div className="mb-4">
                  <p className="font-semibold text-green-700 mb-2">Ventajas:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Control absoluto de la estrategia.</li>
                    <li>Disponibilidad diaria para iterar creatividades y campañas.</li>
                    <li>Conocimiento profundo del negocio.</li>
                  </ul>
                  <p className="font-semibold text-red-700 mb-2">Desventajas:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Costos fijos elevados (sueldos, beneficios, capacitación).</li>
                    <li>Dificultad para cubrir todas las especialidades (Paid Media, diseño, data).</li>
                    <li>Alta rotación de talento digital en Chile.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  3. Modelo híbrido
                </h3>
                <div className="mb-4">
                  <p className="font-semibold text-green-700 mb-2">Ventajas:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Balance entre control interno y expertise externo.</li>
                    <li>El equipo interno define estrategia y la agencia ejecuta o refuerza.</li>
                    <li>Permite mantener flexibilidad presupuestaria.</li>
                  </ul>
                  <p className="font-semibold text-red-700 mb-2">Desventajas:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Requiere coordinación clara de roles.</li>
                    <li>Puede generar duplicación de funciones si no hay reporting integrado.</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Factores decisivos en Chile 2025
            </h2>

            <p className="text-gray-700 mb-4">
              Cuando una empresa chilena evalúa su modelo de marketing digital, los factores que inclinan la balanza son:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Costo y ROI esperado: CAC y LTV son métricas más citadas en directorios.</li>
              <li>Especialización en plataformas: Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads.</li>
              <li>Capacidad de reporting: dashboards con métricas de negocio, no solo vanity metrics.</li>
              <li>Uso de IA y automatización: empresas buscan equipos/agencias que integren herramientas de predicción y optimización.</li>
              <li>Escalabilidad regional: capacidad de ejecutar campañas en todo Chile y Latinoamérica.</li>
            </ul>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ejemplo práctico: inmobiliaria en Temuco</h3>
              <ul className="space-y-2 mb-4">
                <li>• Agencia externa: lanza campañas en Google y Meta en 2 semanas. CPL: $15.000 CLP.</li>
                <li>• Equipo interno: tarda 2 meses en estructurar, con CPL inicial de $25.000 CLP.</li>
                <li>• Modelo híbrido: equipo interno define segmentación local, agencia optimiza campañas. CPL estabilizado en $14.000 CLP.</li>
              </ul>
              <p className="text-xl font-bold">Conclusión: el híbrido ofrece lo mejor de ambos mundos si se gestiona con reporting compartido.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para elegir el modelo correcto
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define tu ticket promedio y ciclo de venta.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Calcula cuánto cuesta un equipo interno (sueldos, cargas, capacitación).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Cotiza con al menos 2 agencias de marketing digital en Chile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Evalúa un escenario híbrido si buscas control + escalabilidad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Pide siempre reportería con CAC, LTV y ROI (no solo clics o impresiones).</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              El 2025 muestra un mercado chileno más consciente: ya no basta con "hacer campañas", ahora la pregunta es cómo estructurar el modelo de marketing digital que maximice retorno y reduzca riesgo.
            </p>

            <p className="text-gray-700 mb-6">
              Agencias externas, equipos internos y modelos híbridos tienen pros y contras. La clave está en analizar datos, proyectar escenarios y decidir con lógica ingenieril. En M&P ayudamos a empresas a diseñar ese mix, entregando benchmarks locales y dashboards que convierten la intuición en métricas claras.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Estás evaluando tu modelo de marketing digital?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Conversemos. Podemos simular costos, CAC esperado y ROI de cada alternativa para que tomes la decisión más rentable.
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
