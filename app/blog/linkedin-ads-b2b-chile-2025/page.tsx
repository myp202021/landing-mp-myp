import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Target, DollarSign, Users, CheckCircle, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'LinkedIn Ads para B2B de Alto Ticket en Chile: Segmentaciones, Costos y Playbooks',
  description: 'Aprende a usar LinkedIn Ads en Chile 2026 para negocios B2B de alto ticket. Segmentaciones, costos reales y playbooks de campañas exitosas.',
  keywords: 'LinkedIn Ads B2B Chile, publicidad LinkedIn Chile, segmentación LinkedIn Ads, CPL LinkedIn Chile, marketing B2B Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/linkedin-ads-b2b-chile-2025'
  },
  openGraph: {
    title: 'LinkedIn Ads para B2B de Alto Ticket en Chile: Segmentaciones, Costos y Playbooks',
    description: 'Aprende a usar LinkedIn Ads en Chile 2026 para negocios B2B de alto ticket. Segmentaciones, costos reales y playbooks de campañas exitosas.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/linkedin-ads-b2b-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'LinkedIn Ads para B2B de Alto Ticket en Chile: Segmentaciones, Costos y Playbooks',
    description: 'Aprende a usar LinkedIn Ads en Chile 2026 para negocios B2B de alto ticket. Segmentaciones, costos reales y playbooks de campañas exitosas.',
    url: 'https://www.mulleryperez.cl/blog/linkedin-ads-b2b-chile-2025',
    datePublished: '2025-10-09T00:00:00.000Z',
    dateModified: '2025-10-09T00:00:00.000Z',
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
      '@id': 'https://www.mulleryperez.cl/blog/linkedin-ads-b2b-chile-2025'
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
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">LinkedIn Ads</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2026 · 19 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            LinkedIn Ads para B2B de Alto Ticket en Chile: Segmentaciones, Costos y Playbooks
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            La plataforma clave para captar decisores B2B de alto ticket en Chile. Segmentaciones, costos reales 2026 y playbooks de campañas ganadoras.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2026, LinkedIn Ads dejó de ser "el canal caro" para transformarse en la plataforma clave para negocios B2B de alto ticket.
              </p>
              <p className="text-gray-700 mb-4">
                Cuando hablamos de ventas corporativas —software SaaS, consultorías, servicios financieros, maquinaria industrial, educación ejecutiva—, el valor de un cliente puede superar fácilmente los $2.000.000 CLP anuales, y en algunos casos bordear millones de dólares. En ese escenario, un CPL de $30.000 CLP o incluso $50.000 CLP puede ser totalmente rentable.
              </p>
              <p className="text-gray-700">
                Este artículo explica cómo usar LinkedIn Ads en Chile para captar decisores B2B de alto ticket, cuáles son los costos reales en 2026, qué segmentaciones funcionan, y cómo diseñar playbooks de campañas ganadoras con lógica ingenieril.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Linkedin className="w-8 h-8 text-blue-600" />
              ¿Por qué LinkedIn Ads es distinto?
            </h2>

            <p className="text-gray-700 mb-4">
              A diferencia de Google o Meta, LinkedIn no es una red masiva. Es una plataforma profesional donde los usuarios declaran información verificada:
            </p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Cargo</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Industria</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Empresa</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Antigüedad laboral</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Nivel de estudios</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">👉 Esto permite:</p>
              <p className="text-gray-700">
                Segmentar con precisión a decisores de compra: gerentes, directores, fundadores, CFOs, CMOs.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Costos reales de LinkedIn Ads en Chile 2026
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPC (costo por clic)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Promedio:</strong> $1.500 – $2.500 CLP</li>
                  <li>• <strong>En industrias de nicho</strong> (finanzas, SaaS, educación ejecutiva): $3.000 CLP o más</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPL (costo por lead)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Rango:</strong> $20.000 – $50.000 CLP</li>
                  <li>• <strong>Casos extremos</strong> (mercados muy competitivos): $70.000 CLP</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">👉 Aunque parecen costos altos, la ecuación cambia al comparar con ticket promedio:</h3>
              <ul className="space-y-2">
                <li>• <strong>SaaS B2B:</strong> ticket anual $2M CLP</li>
                <li>• <strong>CAC aceptable:</strong> hasta $400.000 CLP</li>
                <li>• Con CPL $40.000 CLP y conversión del 10%, el ROI es muy positivo</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Segmentaciones que funcionan en Chile
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Por cargo</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Gerentes de Finanzas, RRHH, Operaciones</li>
                  <li>Directores de Tecnología, Marketing, Compras</li>
                  <li>C-level (CEO, CFO, CTO)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Por industria</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Minería</li>
                  <li>Construcción</li>
                  <li>Tecnología SaaS</li>
                  <li>Salud privada</li>
                  <li>Educación superior y ejecutiva</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Por tamaño de empresa</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>51–200 empleados (medianas)</li>
                  <li>201–500 empleados (grandes)</li>
                  <li>+500 empleados (corporativos)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Por grupos y afinidades</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Miembros de grupos de SaaS, HRTech, construcción, energía</li>
                  <li>Certificaciones específicas (ej: PMI, Six Sigma)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-pink-600" />
              Formatos de anuncios en LinkedIn Ads
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔹 Lead Gen Forms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Captura de datos sin salir de LinkedIn</li>
                  <li>CPL más alto que Meta, pero leads más calificados</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔹 Conversation Ads</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Mensajes directos a inbox</li>
                  <li>Útiles para awareness y generación de reuniones</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔹 Document Ads</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Descarga de estudios, ebooks, whitepapers</li>
                  <li>Ideal para SaaS y consultorías que necesitan educar antes de vender</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔹 Sponsored Content (posts patrocinados)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Anuncios nativos en el feed</li>
                  <li>Buen rendimiento en retargeting</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Playbook M&amp;P para LinkedIn Ads B2B
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Etapa 1 – Awareness</h3>
                <ul className="space-y-2">
                  <li>• <strong>Objetivo:</strong> reconocimiento de marca</li>
                  <li>• <strong>Formato:</strong> Sponsored Content + Video Ads</li>
                  <li>• <strong>Segmentación:</strong> industria + cargo + tamaño de empresa</li>
                  <li>• <strong>Métrica clave:</strong> CTR y alcance en decisores</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Etapa 2 – Consideración</h3>
                <ul className="space-y-2">
                  <li>• <strong>Objetivo:</strong> leads interesados</li>
                  <li>• <strong>Formato:</strong> Document Ads (ebooks, estudios)</li>
                  <li>• <strong>Segmentación:</strong> retargeting de quienes vieron videos/visitaron sitio</li>
                  <li>• <strong>Métrica clave:</strong> CPL</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Etapa 3 – Conversión</h3>
                <ul className="space-y-2">
                  <li>• <strong>Objetivo:</strong> generar reuniones / demos</li>
                  <li>• <strong>Formato:</strong> Lead Gen Forms + Conversation Ads</li>
                  <li>• <strong>Segmentación:</strong> decisores de alta seniority</li>
                  <li>• <strong>Métrica clave:</strong> CAC y payback</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Ejemplo práctico en Chile</h2>

            <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Caso: SaaS de gestión de RRHH en Santiago</h3>
              <ul className="space-y-2 mb-4">
                <li>• <strong>Presupuesto:</strong> $1.000.000 CLP/mes</li>
                <li>• <strong>Ticket:</strong> $2.500.000 CLP anual</li>
              </ul>
              <p className="text-xl font-bold mb-3">Estrategia:</p>
              <ul className="space-y-2 mb-4">
                <li>• Awareness con videos ($200.000 CLP)</li>
                <li>• Consideración con Document Ads ($500.000 CLP)</li>
                <li>• Conversión con Lead Gen Forms ($300.000 CLP)</li>
              </ul>
              <p className="text-xl font-bold mb-3">Resultados en 6 meses:</p>
              <ul className="space-y-2 mb-4">
                <li>• CPL promedio: $32.000 CLP</li>
                <li>• CAC: $320.000 CLP</li>
                <li>• LTV: $2.5M CLP</li>
              </ul>
              <p className="text-2xl font-bold">👉 ROI positivo, payback en 2–3 meses.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&amp;P para LinkedIn Ads
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define ticket promedio y CAC aceptable antes de invertir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Segmenta por cargo, industria y tamaño de empresa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa Document Ads para nutrir decisores.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Integra Lead Gen Forms con CRM para seguimiento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Calcula CPL, CAC y LTV, no solo clics.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              LinkedIn Ads en Chile 2026 no es un lujo: es una necesidad estratégica para empresas B2B de alto ticket.
            </p>

            <p className="text-gray-700 mb-6">
              Mientras Google y Meta capturan volumen, LinkedIn permite llegar directamente a los tomadores de decisiones que pueden firmar contratos millonarios.
            </p>

            <p className="text-gray-700 mb-6">
              👉 En M&amp;P diseñamos y ejecutamos campañas B2B en LinkedIn que combinan segmentación avanzada, creatividad enfocada en valor, y dashboards que miden ROI real.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres captar decisores B2B con LinkedIn Ads?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo segmentar y convertir en tu industria.
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
          <p className="text-gray-400">© 2026 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
