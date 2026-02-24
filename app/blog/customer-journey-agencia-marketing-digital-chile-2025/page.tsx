import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Customer Journey en Chile 2025: Cómo una Agencia de Marketing Digital Diseña Mapas de Decisión para Aumentar Conversiones',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 diseña customer journeys con IA y CRM para aumentar conversiones y reducir CAC.',
  keywords: 'agencia de marketing digital, customer journey Chile, mapa de decisión clientes, agencia marketing digital customer journey, performance marketing Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/customer-journey-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Customer Journey en Chile 2025: Cómo una Agencia de Marketing Digital Diseña Mapas de Decisión para Aumentar Conversiones',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 diseña customer journeys con IA y CRM para aumentar conversiones y reducir CAC.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/customer-journey-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-18T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Customer Journey en Chile 2025: Cómo una Agencia de Marketing Digital Diseña Mapas de Decisión para Aumentar Conversiones',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 diseña customer journeys con IA y CRM para aumentar conversiones y reducir CAC.',
    url: 'https://www.mulleryperez.cl/blog/customer-journey-agencia-marketing-digital-chile-2025',
    datePublished: '2025-01-18T00:00:00.000Z',
    dateModified: '2025-01-18T00:00:00.000Z',
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
      '@id': 'https://www.mulleryperez.cl/blog/customer-journey-agencia-marketing-digital-chile-2025'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-white">
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">Performance</span>
            <p className="text-gray-500 mt-4">18 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Customer Journey en Chile 2025: Cómo una Agencia de Marketing Digital Diseña Mapas de Decisión para Aumentar Conversiones
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En 2025, el marketing digital en Chile dejó de centrarse en “atraer clics” y evolucionó hacia algo más profundo: entender cómo deciden los clientes. Hoy, las empresas que no tienen claridad sobre el journey de sus consumidores pierden oportunidades, gastan de más en Ads y no logran fidelización.
              </p>
              <p className="text-gray-700 mb-4">
                El Customer Journey es el mapa que muestra todos los puntos de contacto entre un cliente y una marca: desde el primer anuncio visto hasta la recompra o recomendación. Pero no basta con dibujar un esquema bonito: se requiere análisis de datos, integración de plataformas y reportería financiera.
              </p>
              <p className="text-gray-700 mb-4">
                Aquí es donde entra en juego una agencia de marketing digital capaz de diseñar journeys detallados y dinámicos, conectados a métricas como CAC, LTV y ROI.
              </p>
              <p className="text-gray-700 mb-4">
                ¿Qué es el Customer Journey?
              </p>
              <p className="text-gray-700 mb-4">
                Es la representación visual y estratégica de las etapas por las que pasa un cliente:
              </p>
              <p className="text-gray-700 mb-4">
                1.	Awareness (descubrimiento): cuando el cliente identifica una necesidad.
              </p>
              <p className="text-gray-700 mb-4">
                2.	Consideración: evalúa alternativas.
              </p>
              <p className="text-gray-700 mb-4">
                3.	Decisión: compara proveedores y toma acción.
              </p>
              <p className="text-gray-700 mb-4">
                4.	Postventa y fidelización: se convierte en cliente recurrente y recomienda la marca.
              </p>
              <p className="text-gray-700 mb-4">
                👉 El objetivo es entender dónde impactar, con qué mensaje y a través de qué canal.
              </p>
              <p className="text-gray-700 mb-4">
                Por qué es clave en Chile 2025
              </p>
            </div>

            {/* 1. Investigación y data */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              1. Investigación y data
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Análisis de campañas anteriores (Google, Meta, LinkedIn, TikTok).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Encuestas y entrevistas con clientes reales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Benchmarks por industria en Chile.</span>
                </li>
              </ul>
            </div>

            {/* 2. Mapeo de etapas */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              2. Mapeo de etapas
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Awareness: anuncios de video, blogs SEO.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Consideración: comparativas, ebooks, webinars.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Decisión: demos, casos de éxito, retargeting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Postventa: emails personalizados, WhatsApp de seguimiento.</span>
                </li>
              </ul>
            </div>

            {/* 3. Identificación de puntos de fricción */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              3. Identificación de puntos de fricción
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Formularios demasiado largos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Landing pages poco claras.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Ausencia de testimonios o validación social.</span>
                </li>
              </ul>
            </div>

            {/* 4. Diseño de journeys dinámicos */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              4. Diseño de journeys dinámicos
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Árbol de decisión con IA.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Segmentación por ticket promedio y zona geográfica.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Rutas diferenciadas para B2B vs B2C.</span>
                </li>
              </ul>
            </div>

            {/* 5. Reporterías conectadas */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              5. Reporterías conectadas
            </h2>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Dashboards que muestran CAC, LTV y payback por etapa del journey.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Ajustes de inversión mes a mes según métricas reales.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: universidad privada en Santiago</p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Problema: alto volumen de leads pero baja tasa de matrícula.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Estrategia:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Awareness: campañas en TikTok y YouTube con testimonios.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Consideración: ebooks de carreras y webinars en vivo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Decisión: retargeting en Meta + WhatsApp para agendar visitas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Resultados:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Tasa de conversión a matrícula ↑ 42%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>CAC bajó en 33%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>ROI en 6 meses: 5.7x.</span>
                </li>
              </ul>
            </div>

            {/* Costos de implementar un Customer Journey en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Costos de implementar un Customer Journey en Chile
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Investigación y diseño inicial: $1.500.000 – $3.000.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Herramientas (CRM, dashboards): $300.000 – $800.000 CLP/mes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Gestión por agencia de marketing digital: $800.000 – $1.500.000 CLP/mes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Aunque la inversión inicial es alta, el impacto en reducción de CAC y aumento de LTV justifica el gasto.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para Customer Journey */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para Customer Journey
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Identifica etapas del journey con data real.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Diseña mensajes y canales específicos para cada fase.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa IA para construir journeys dinámicos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Integra CRM y dashboards para seguimiento financiero.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Ajusta continuamente según métricas de conversión.</span>
                </li>
              </ul>
            </div>

            {/* Cuando lo diseña una agencia de marketing digital, el journey se convierte en una herramienta de performance que conecta campañas con resultados financieros tangibles. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Cuando lo diseña una agencia de marketing digital, el journey se convierte en una herramienta de performance que conecta campañas con resultados financieros tangibles.
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>En M&P ayudamos a empresas a transformar su marketing con journeys inteligentes, integrados a CRM y reportados como estados financieros de clientes.</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres transformar tu marketing digital?
              </h3>
              <p className="text-xl text-red-100 mb-8">
                Agenda una sesión estratégica gratuita con nuestros especialistas.
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

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 Muller y Pérez · Agencia de Marketing Digital</p>
        </div>
      </footer>
    </div>
  )
}
