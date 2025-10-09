import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog Marketing Digital 2025 - Guías Google Ads y Performance | M&P',
  description: 'Aprende estrategias de marketing digital, Google Ads, Meta Ads y performance marketing. Guías prácticas con datos reales de +200 campañas Chile 2025',
  keywords: 'blog marketing digital chile, guias google ads, estrategias performance marketing, tutoriales meta ads, marketing datos chile, roi roas optimización',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog'
  },
  openGraph: {
    title: 'Blog Marketing Digital 2025 - Guías Google Ads y Performance | M&P',
    description: 'Aprende estrategias de marketing digital, Google Ads, Meta Ads y performance marketing. Guías prácticas con datos reales de +200 campañas Chile 2025',
    type: 'website',
    url: 'https://www.mulleryperez.cl/blog',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Blog Marketing Digital M&P'
      }
    ]
  }
}

const articles = [
  {
    slug: 'tendencias-marketing-digital-chile-2025',
    title: 'Tendencias del Marketing Digital en Chile 2025: Paid Media, IA y Performance',
    excerpt: 'Conoce las principales tendencias del marketing digital en Chile 2025: paid media, inteligencia artificial, personalización y métricas de performance.',
    date: '2025-10-09',
    category: 'Tendencias',
    readTime: '18 min',
    tag: 'Tendencias 2025'
  },
  {
    slug: 'presupuesto-marketing-digital-chile-2025',
    title: 'Cómo Planificar el Presupuesto de Marketing Digital en Chile 2025',
    excerpt: 'Aprende a planificar el presupuesto de marketing digital en Chile 2025 con escenarios conservador, medio y agresivo, y benchmarks locales.',
    date: '2025-10-09',
    category: 'Presupuesto',
    readTime: '16 min',
    tag: 'Guía Completa'
  },
  {
    slug: 'tendencias-busqueda-marketing-digital-chile-2025',
    title: 'Tendencias de Búsqueda en Marketing Digital en Chile 2025: Agencias vs. Equipos Internos',
    excerpt: 'Descubre cómo en Chile 2025 crecen las búsquedas sobre agencias, equipos internos e híbridos en marketing digital, y cuál modelo conviene más.',
    date: '2025-10-09',
    category: 'Análisis',
    readTime: '14 min',
    tag: 'Insights'
  },
  {
    slug: 'correlaciones-inesperadas-marketing-digital',
    title: '15 Correlaciones Inesperadas en Marketing Digital que Desafían la Intuición',
    excerpt: 'Descubre 15 correlaciones inesperadas en marketing digital que contradicen la intuición y pueden transformar tu CAC, ROI y resultados.',
    date: '2025-10-09',
    category: 'Performance Marketing',
    readTime: '15 min',
    tag: 'Insights'
  },
  {
    slug: 'marketing-de-datos-no-es-un-juego',
    title: 'Marketing de Datos: No es un Juego, es Ingeniería',
    excerpt: 'El marketing de datos no es azar: requiere ingeniería, modelos de decisión y métricas claras para lograr resultados sostenibles en Chile.',
    date: '2025-10-09',
    category: 'Performance Marketing',
    readTime: '12 min',
    tag: 'Estrategia'
  },
  {
    slug: 'que-es-cac-como-calcularlo-reducirlo',
    title: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
    excerpt: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos). Guía completa con ejemplos reales y datos de Chile 2025.',
    date: '2025-10-08',
    category: 'Performance Marketing',
    readTime: '12 min',
    tag: 'Guía'
  },
  {
    slug: 'estrategia-meta-ads-ecommerce-chile',
    title: 'Estrategia Meta Ads para E-commerce en Chile (ROI 8.5x Comprobado)',
    excerpt: 'Estrategia completa de Meta Ads para e-commerce: prospecting, retargeting, Advantage+ Shopping y 3 casos reales Chile con ROAS 6.2x-8.5x.',
    date: '2025-10-08',
    category: 'Meta Ads',
    readTime: '16 min',
    tag: 'Estrategia'
  },
  {
    slug: 'campanas-performance-max-google-ads-2025',
    title: 'Campañas Performance Max: Guía Completa Chile 2025',
    excerpt: 'Todo sobre Performance Max (PMax): cómo funcionan, cuándo usarlas, configuración paso a paso y 3 casos de éxito Chile con ROAS 6.2x-8.5x.',
    date: '2025-10-08',
    category: 'Google Ads',
    readTime: '18 min',
    tag: 'Guía Completa'
  },
  {
    slug: 'como-aumentar-conversiones-google-ads',
    title: 'Cómo Aumentar Conversiones en Google Ads en 30 Días (Guía 2025)',
    excerpt: 'Estrategias probadas para aumentar conversiones: optimización de Quality Score, ajuste de pujas, extensiones y mejora de landing pages. 2 casos reales Chile.',
    date: '2025-10-08',
    category: 'Google Ads',
    readTime: '15 min',
    tag: 'Optimización'
  },
  {
    slug: 'mejor-agencia-google-ads-santiago-2025',
    title: 'Mejor Agencia Google Ads Santiago 2025: Cómo Elegir (Guía Completa)',
    excerpt: 'Descubre cómo elegir la mejor agencia Google Ads en Santiago 2025. Checklist de verificación, señales de alerta y benchmarks reales.',
    date: '2025-01-20',
    category: 'Agencias',
    readTime: '18 min',
    tag: 'Guía Completa'
  },
  {
    slug: 'costo-google-ads-chile-2025',
    title: 'Costo Real de Google Ads en Chile 2025: Guía Completa por Industria',
    excerpt: 'Descubre cuánto cuesta Google Ads realmente en Chile 2025. Datos de +200 campañas: CPC, CPL, CPA por industria. Calculadora incluida.',
    date: '2025-01-15',
    category: 'Google Ads',
    readTime: '12 min',
    tag: 'Datos'
  },
  {
    slug: 'optimizar-roas-meta-ads-2025',
    title: 'Cómo Optimizar ROAS en Meta Ads 2025: 7 Estrategias Probadas',
    excerpt: 'Aumenta tu ROAS en Meta Ads con estas 7 estrategias validadas con data real. Casos de éxito +380% ROI en e-commerce y B2B Chile.',
    date: '2025-01-10',
    category: 'Meta Ads',
    readTime: '15 min',
    tag: 'Estrategia'
  },
  {
    slug: 'kpis-marketing-digital-chile',
    title: 'KPIs de Marketing Digital que SÍ Importan en 2025 (No Vanity Metrics)',
    excerpt: 'CAC, LTV, ROAS, CPL, CPA: aprende a medir lo que importa. Benchmarks por industria Chile 2025 + plantilla Google Sheets gratis.',
    date: '2025-01-05',
    category: 'Performance Marketing',
    readTime: '10 min',
    tag: 'Fundamentos'
  },
  {
    slug: 'agencia-performance-marketing-las-condes',
    title: 'Agencia Performance Marketing Las Condes: Top 5 y Cómo Elegir 2025',
    excerpt: 'Las mejores agencias de performance marketing en Las Condes 2025. Comparativa de servicios, precios y resultados reales.',
    date: '2025-01-03',
    category: 'Agencias',
    readTime: '14 min',
    tag: 'Comparativa'
  },
  {
    slug: 'agencia-marketing-digital-santiago-2025',
    title: 'Agencia Marketing Digital Santiago 2025: Guía de Selección Completa',
    excerpt: 'Cómo elegir agencia de marketing digital en Santiago. Precios, servicios, casos de éxito y checklist de evaluación.',
    date: '2025-01-02',
    category: 'Agencias',
    readTime: '16 min',
    tag: 'Guía'
  },
  {
    slug: 'cuanto-cuesta-agencia-marketing-digital-chile-2025',
    title: '¿Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025?',
    excerpt: 'Precios reales de agencias de marketing digital en Chile 2025. Rangos por servicio, modelos de cobro y qué incluye cada paquete.',
    date: '2025-01-01',
    category: 'Precios',
    readTime: '11 min',
    tag: 'Precios'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <img
              src="/logo-color.png"
              alt="Muller y Pérez"
              className="h-11 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Blog de Marketing <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Data-Driven</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Estrategias, guías y casos de éxito basados en data real de +200 campañas en Chile
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Google Ads</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Meta Ads</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Performance</span>
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">ROI & ROAS</span>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-1 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {article.tag}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{article.category}</span>
                    </div>
                    <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Leer artículo <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-black mb-4">
            ¿Necesitas ayuda con tus campañas?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Agenda una reunión gratuita con nuestro equipo de expertos
          </p>
          <Link
            href="/#contacto"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Solicitar Auditoría Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2025 Muller y Pérez - Agencia de Marketing Digital y Performance</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="/labs" className="hover:text-blue-600 transition-colors">M&P Labs</Link>
            <Link href="/utilidades" className="hover:text-blue-600 transition-colors">Utilidades</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
