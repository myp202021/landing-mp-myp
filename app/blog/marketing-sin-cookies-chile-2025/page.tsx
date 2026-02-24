import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Cookie, Eye, Lock, CheckCircle, AlertTriangle, Database, Users, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing sin Cookies Chile 2025: Guía para el Mundo Cookieless',
  description: 'Prepara tu estrategia de marketing digital para un mundo sin cookies de terceros. First-party data, server-side tracking y alternativas en Chile.',
  keywords: 'marketing sin cookies Chile, cookieless marketing, first party data Chile, privacidad marketing digital, server side tracking',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/marketing-sin-cookies-chile-2025'
  },
  openGraph: {
    title: 'Marketing sin Cookies Chile 2025: Guía para el Mundo Cookieless',
    description: 'Prepara tu estrategia de marketing digital para un mundo sin cookies de terceros.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/marketing-sin-cookies-chile-2025',
    publishedTime: '2025-01-15T00:00:00.000Z'
  }
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Marketing sin Cookies Chile 2025: Guía para el Mundo Cookieless',
  description: 'Prepara tu estrategia de marketing digital para un mundo sin cookies de terceros. First-party data, server-side tracking y alternativas en Chile.',
  url: 'https://www.mulleryperez.cl/blog/marketing-sin-cookies-chile-2025',
  datePublished: '2025-01-15T00:00:00.000Z',
  dateModified: '2025-01-15T00:00:00.000Z',
  author: {
    '@type': 'Person',
    name: 'Christopher Müller',
    url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
    sameAs: [
      'https://www.linkedin.com/in/christophermullerm/',
      'https://www.mulleryperez.cl'
    ],
    jobTitle: 'CEO & Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl'
    }
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
    '@id': 'https://www.mulleryperez.cl/blog/marketing-sin-cookies-chile-2025'
  },
  articleSection: 'Marketing Digital',
  inLanguage: 'es-CL'
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
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
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">Privacidad & Data</span>
            <p className="text-gray-500 mt-4">15 de enero de 2025 · 12 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Marketing sin Cookies Chile 2025: Guía Completa para el Mundo Cookieless
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Las cookies de terceros están desapareciendo. ¿Tu estrategia de marketing está preparada? Esta guía te muestra cómo adaptarte y prosperar en el nuevo escenario de privacidad.
          </p>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" /> El Fin de una Era
              </h3>
              <p className="text-gray-700 mb-4">
                Google Chrome, que representa el 65% del mercado de navegadores, eliminará las cookies de terceros en 2025. Safari y Firefox ya lo hicieron. Esto significa que el remarketing tradicional, la atribución cross-site y la segmentación por comportamiento como los conocemos, cambiarán radicalmente.
              </p>
              <p className="text-gray-700">
                En Chile, donde el 78% de los usuarios navegan en Chrome, el impacto será significativo. Pero también es una oportunidad para quienes se preparen.
              </p>
            </div>

            {/* Sección 1: Qué son las cookies */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Cookie className="w-8 h-8 text-amber-600" />
              Cookies 101: Lo que Necesitas Saber
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-green-200">
                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Cookies First-Party
                </h4>
                <p className="text-gray-600 text-sm mb-3">Las que TÚ generas en tu sitio. <strong>Estas NO desaparecen.</strong></p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sesiones de usuario</li>
                  <li>• Preferencias del sitio</li>
                  <li>• Carrito de compras</li>
                  <li>• Login persistente</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-200">
                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Cookies Third-Party
                </h4>
                <p className="text-gray-600 text-sm mb-3">Las que generan OTROS en tu sitio. <strong>Estas SÍ desaparecen.</strong></p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tracking de Facebook/Meta Pixel</li>
                  <li>• Remarketing de Google Ads</li>
                  <li>• Pixels de afiliados</li>
                  <li>• Tracking cross-site</li>
                </ul>
              </div>
            </div>

            {/* Sección 2: Impacto */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Eye className="w-8 h-8 text-red-500" />
              Impacto Real en tus Campañas
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 my-8">
              <h4 className="font-bold text-red-800 mb-4">Lo que YA está pasando en Chile:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">📉</span>
                  <div>
                    <strong>Remarketing menos efectivo:</strong> Los usuarios en Safari/Firefox ya no son trackeables. Pierdes ~35% de tu audiencia de remarketing.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">📊</span>
                  <div>
                    <strong>Atribución imprecisa:</strong> El customer journey cross-device y cross-site está roto. No sabes qué canal realmente convirtió.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">🎯</span>
                  <div>
                    <strong>Audiencias más pequeñas:</strong> Los Lookalike Audiences de Meta y las audiencias similares de Google se reducen.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">💰</span>
                  <div>
                    <strong>CPAs subiendo:</strong> Sin data de comportamiento, los algoritmos optimizan peor y los costos suben.
                  </div>
                </li>
              </ul>
            </div>

            {/* Sección 3: Soluciones */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              5 Estrategias para Adaptarte
            </h2>

            <div className="space-y-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  First-Party Data: Tu Nuevo Oro
                </h4>
                <p className="text-gray-700 mb-4">
                  Los datos que recolectas directamente de tus usuarios son inmunes a los cambios de privacidad. Invierte en capturarlos.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700"><strong>Acciones concretas:</strong></p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Implementa login/registro con incentivos</li>
                    <li>• Crea lead magnets de valor (ebooks, herramientas)</li>
                    <li>• Usa formularios progresivos para enriquecer perfiles</li>
                    <li>• Conecta tu CRM con tus plataformas de ads</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Server-Side Tracking
                </h4>
                <p className="text-gray-700 mb-4">
                  En vez de depender del navegador del usuario, envía los eventos directamente desde tu servidor a las plataformas.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700"><strong>Implementaciones clave:</strong></p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Google Tag Manager Server-Side</li>
                    <li>• Meta Conversions API (CAPI)</li>
                    <li>• Google Ads Enhanced Conversions</li>
                    <li>• LinkedIn Conversions API</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Customer Match & Listas
                </h4>
                <p className="text-gray-700 mb-4">
                  Sube tus listas de clientes (emails, teléfonos) directamente a las plataformas para crear audiencias.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700"><strong>Plataformas que lo soportan:</strong></p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Google Ads Customer Match</li>
                    <li>• Meta Custom Audiences</li>
                    <li>• LinkedIn Matched Audiences</li>
                    <li>• TikTok Custom Audiences</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Contextual Targeting
                </h4>
                <p className="text-gray-700 mb-4">
                  Vuelve a lo básico: segmenta por el contenido que consume tu audiencia, no por su historial de navegación.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700"><strong>Ejemplos en Chile:</strong></p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Anuncios en sitios de nicho relevantes</li>
                    <li>• YouTube por temas/canales específicos</li>
                    <li>• Display en categorías de contenido</li>
                    <li>• Patrocinios de newsletters</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  Privacy Sandbox (Google)
                </h4>
                <p className="text-gray-700 mb-4">
                  Google está desarrollando alternativas privacy-first. Prepárate para adoptarlas.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700"><strong>APIs del Privacy Sandbox:</strong></p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Topics API: Intereses basados en historial local</li>
                    <li>• Protected Audience API: Remarketing privacy-safe</li>
                    <li>• Attribution Reporting API: Atribución agregada</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sección 4: Checklist */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Lock className="w-8 h-8 text-green-600" />
              Checklist de Preparación
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 my-8">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>Meta Conversions API implementada</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>Google Enhanced Conversions activo</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>GTM Server-Side configurado</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>Estrategia de captura de first-party data</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>CRM conectado a plataformas de ads</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>Consent Mode v2 implementado</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span>Modelo de atribución actualizado (data-driven)</span>
                </label>
              </div>
            </div>

            {/* Sección 5: Oportunidad */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              La Oportunidad Oculta
            </h2>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl mb-12">
              <p className="text-gray-700 mb-4">
                Mientras la mayoría de las empresas en Chile están en pánico, las que se preparen tienen una ventaja competitiva masiva:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✅ <strong>Mejor calidad de datos:</strong> First-party data es más precisa que third-party</li>
                <li>✅ <strong>Relación directa:</strong> Construyes una relación real con tu audiencia</li>
                <li>✅ <strong>Menor competencia:</strong> Los que no se adapten, saldrán del mercado</li>
                <li>✅ <strong>Confianza del usuario:</strong> Los consumidores prefieren marcas que respetan su privacidad</li>
              </ul>
            </div>

            {/* Conclusión */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-2xl my-12">
              <h3 className="text-2xl font-bold mb-4">Conclusión</h3>
              <p className="mb-4">
                El mundo cookieless no es el fin del marketing digital, es una evolución. Las empresas chilenas que inviertan ahora en first-party data, server-side tracking y relaciones directas con sus clientes, serán las ganadoras de los próximos 5 años.
              </p>
              <p className="mb-6">
                En M&P ya implementamos estas soluciones para nuestros clientes. Si quieres saber cómo está tu setup actual, te hacemos una auditoría gratuita.
              </p>
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Solicitar Auditoría Gratis <Target className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </div>
      </article>

      {/* CTA Final */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tu tracking está preparado para 2025?</h2>
          <p className="text-gray-300 mb-8">
            El 80% de las empresas en Chile aún no han implementado server-side tracking. No seas parte de ese grupo.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Hablar con un Experto
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Muller y Pérez</p>
          <div className="flex gap-6 text-sm">
            <Link href="/blog" className="text-gray-500 hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/labs" className="text-gray-500 hover:text-blue-600 transition-colors">M&P Labs</Link>
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
