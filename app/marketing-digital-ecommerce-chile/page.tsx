import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, TrendingUp, Target, BarChart3, Zap, CheckCircle, DollarSign, Users, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Ecommerce en Chile | Agencia Especializada | M&P',
  description: 'Agencia de marketing digital especializada en ecommerce en Chile. Aumentamos ventas online con Google Shopping, Meta Ads, remarketing y estrategias de conversión. ROAS promedio 8.5x.',
  keywords: 'marketing digital ecommerce chile, agencia ecommerce chile, google shopping chile, publicidad ecommerce, aumentar ventas online chile, marketing tienda online',
  openGraph: {
    title: 'Marketing Digital para Ecommerce en Chile | M&P',
    description: 'Especialistas en hacer crecer tiendas online. ROAS promedio 8.5x en campañas de ecommerce.',
    url: 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile',
      name: 'Marketing Digital para Ecommerce en Chile',
      description: 'Agencia especializada en marketing digital para tiendas online y ecommerce en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
      breadcrumb: { '@id': 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@id': 'https://www.mulleryperez.cl/', name: 'Inicio' } },
        { '@type': 'ListItem', position: 2, item: { '@id': 'https://www.mulleryperez.cl/servicios', name: 'Servicios' } },
        { '@type': 'ListItem', position: 3, item: { name: 'Marketing Digital Ecommerce' } },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-ecommerce-chile#service',
      name: 'Marketing Digital para Ecommerce',
      description: 'Servicio especializado de marketing digital para tiendas online en Chile',
      provider: {
        '@type': 'Organization',
        name: 'Müller & Pérez',
        url: 'https://www.mulleryperez.cl',
      },
      areaServed: { '@type': 'Country', name: 'Chile' },
      serviceType: 'Marketing Digital Ecommerce',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta el marketing digital para ecommerce en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La inversión mínima recomendada para ecommerce es de $750.000 CLP mensuales en gestión + inversión publicitaria. El presupuesto publicitario ideal parte desde $1.500.000 CLP/mes para tiendas con catálogo mediano.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué ROAS puedo esperar en mi tienda online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El ROAS promedio en ecommerce chileno es de 4-6x. En M&P logramos ROAS promedio de 8.5x gracias a estrategias de segmentación avanzada y optimización continua.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Google Ads o Meta Ads para ecommerce?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ambos son complementarios. Google Shopping captura demanda existente (usuarios buscando productos). Meta Ads genera demanda nueva y remarketing. La estrategia óptima combina ambos canales.',
          },
        },
      ],
    },
  ],
}

export default function MarketingEcommercePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <ShoppingCart className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Especialistas en Ecommerce</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-yellow-400">Ecommerce</span> en Chile
              </h1>

              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Aumentamos las ventas de tu tienda online con estrategias de performance comprobadas.
                Google Shopping, Meta Ads, remarketing y optimización de conversión.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">8.5x</div>
                  <div className="text-sm text-blue-200">ROAS Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">+120%</div>
                  <div className="text-sm text-blue-200">Aumento Ventas</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">-35%</div>
                  <div className="text-sm text-blue-200">Reducción CAC</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-lg transition-colors"
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

        {/* Servicios Ecommerce */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Servicios de Marketing para Ecommerce
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Estrategias especializadas para cada etapa del funnel de tu tienda online
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <ShoppingCart className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Google Shopping</h3>
                  <p className="text-gray-600 mb-4">
                    Campañas de Shopping optimizadas para capturar compradores con alta intención.
                    Feed de productos optimizado, pujas inteligentes y segmentación por margen.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Optimización de feed de productos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Performance Max para ecommerce
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Remarketing dinámico
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Meta Ads para Tiendas</h3>
                  <p className="text-gray-600 mb-4">
                    Campañas en Facebook e Instagram optimizadas para ventas.
                    Catálogo de productos, colecciones y anuncios dinámicos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Catálogo de productos optimizado
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Advantage+ Shopping Campaigns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lookalike de compradores
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Optimización de Conversión</h3>
                  <p className="text-gray-600 mb-4">
                    Mejoramos tu tasa de conversión con análisis de datos,
                    A/B testing y optimización de checkout.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Análisis de embudo de ventas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Reducción abandono de carrito
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Upselling y cross-selling
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Remarketing Avanzado</h3>
                  <p className="text-gray-600 mb-4">
                    Recuperamos visitantes y carritos abandonados con
                    remarketing dinámico multicanal.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Remarketing por comportamiento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Email de carrito abandonado
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      WhatsApp marketing
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Ecommerce</h3>
                  <p className="text-gray-600 mb-4">
                    Dashboard con métricas clave: ROAS, AOV, CLV,
                    tasa de conversión y análisis de cohortes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Tracking avanzado GA4
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Atribución multi-touch
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Reportes semanales
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Automatización</h3>
                  <p className="text-gray-600 mb-4">
                    Flujos automatizados de email, notificaciones y
                    campañas basadas en comportamiento del usuario.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Secuencias post-compra
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Reactivación de clientes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Alertas de restock
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks Ecommerce */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Benchmarks de Ecommerce en Chile 2025
                </h2>
                <p className="text-xl text-gray-600">
                  Métricas de referencia para tiendas online en el mercado chileno
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">1.8%</div>
                  <div className="text-gray-700 font-medium">Tasa de Conversión Promedio</div>
                  <div className="text-sm text-gray-500 mt-2">Ecommerce Chile</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">$45.000</div>
                  <div className="text-gray-700 font-medium">Ticket Promedio</div>
                  <div className="text-sm text-gray-500 mt-2">AOV Chile</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">4.5x</div>
                  <div className="text-gray-700 font-medium">ROAS Promedio</div>
                  <div className="text-sm text-gray-500 mt-2">Google Shopping</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">68%</div>
                  <div className="text-gray-700 font-medium">Abandono de Carrito</div>
                  <div className="text-sm text-gray-500 mt-2">Promedio Chile</div>
                </div>
              </div>

              <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Nuestros Resultados en Ecommerce
                    </h3>
                    <p className="text-gray-700 mb-4">
                      En M&P superamos consistentemente los benchmarks del mercado:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">3.2%</div>
                        <div className="text-sm text-gray-600">Tasa Conversión (vs 1.8%)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">8.5x</div>
                        <div className="text-sm text-gray-600">ROAS (vs 4.5x)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">52%</div>
                        <div className="text-sm text-gray-600">Abandono Carrito (vs 68%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing para Ecommerce
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta el marketing digital para ecommerce en Chile?
                  </h3>
                  <p className="text-gray-600">
                    La inversión mínima recomendada para ecommerce es de <strong>$750.000 CLP mensuales</strong> en gestión
                    + inversión publicitaria. El presupuesto publicitario ideal parte desde <strong>$1.500.000 CLP/mes</strong> para
                    tiendas con catálogo mediano. Para tiendas grandes (+1000 SKUs), recomendamos presupuestos desde $3.000.000 CLP/mes.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué ROAS puedo esperar en mi tienda online?
                  </h3>
                  <p className="text-gray-600">
                    El ROAS promedio en ecommerce chileno es de <strong>4-6x</strong>. En M&P logramos ROAS promedio de
                    <strong> 8.5x</strong> gracias a estrategias de segmentación avanzada y optimización continua.
                    El ROAS varía según la industria: moda 5-8x, tecnología 4-6x, hogar 6-10x.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Google Ads o Meta Ads para ecommerce?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Ambos son complementarios.</strong> Google Shopping captura demanda existente (usuarios buscando productos).
                    Meta Ads genera demanda nueva y remarketing. La estrategia óptima combina ambos canales:
                    60% Google para captura, 40% Meta para awareness y retargeting.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿En cuánto tiempo veo resultados?
                  </h3>
                  <p className="text-gray-600">
                    Las campañas de ecommerce muestran resultados inmediatos en ventas. Sin embargo,
                    la optimización completa toma <strong>2-3 meses</strong> para alcanzar el ROAS óptimo.
                    El algoritmo de Google Shopping necesita ~1000 conversiones para optimizar correctamente.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué plataformas de ecommerce trabajan?
                  </h3>
                  <p className="text-gray-600">
                    Trabajamos con todas las plataformas principales: <strong>Shopify, WooCommerce, VTEX, Magento,
                    Jumpseller, PrestaShop</strong> y desarrollos custom. Integramos tracking avanzado y feeds
                    de productos optimizados para cada plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios Relacionados */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Servicios para Ecommerce</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Google Shopping</h3>
                <p className="text-gray-600 text-sm mb-3">Campañas de Shopping y Performance Max para tu catálogo de productos</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/servicios/meta-ads-chile" className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Meta Ads</h3>
                <p className="text-gray-600 text-sm mb-3">Facebook e Instagram Ads con catálogo dinámico y remarketing</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/servicios/performance-marketing" className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Performance Marketing</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategia integral multicanal para maximizar ventas y ROAS</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Relacionados */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Artículos sobre Ecommerce</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/estrategia-meta-ads-ecommerce-chile" className="group block bg-white hover:bg-blue-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">Meta Ads</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Estrategia Meta Ads para Ecommerce Chile</h3>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/optimizar-roas-meta-ads-2025" className="group block bg-white hover:bg-blue-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-3">ROAS</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Cómo Optimizar ROAS en Meta Ads 2025</h3>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/marketing-retail-ecommerce-agencia-marketing-digital-chile-2025" className="group block bg-white hover:bg-blue-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3">Industria</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Marketing Retail y Ecommerce 2025</h3>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Escalar tu Tienda Online?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Agenda una reunión estratégica gratuita. Analizamos tu ecommerce y
                te mostramos oportunidades de crecimiento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular ROAS de mi Tienda
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
