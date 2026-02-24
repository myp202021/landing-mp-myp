import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, XCircle, TrendingDown, Target, CheckCircle, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: '10 Errores Comunes en Campañas Digitales en Chile (y Cómo Evitarlos)',
  description: 'Los 10 errores más comunes que cometen empresas chilenas en Google Ads y Meta Ads, y cómo evitarlos. Datos reales, ejemplos y soluciones prácticas.',
  keywords: 'errores google ads chile, errores meta ads, optimizar campañas digitales, mejorar roas, reducir cac, marketing digital errores comunes',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/errores-comunes-campanas-digitales-chile'
  },
  openGraph: {
    title: '10 Errores Comunes en Campañas Digitales en Chile (y Cómo Evitarlos)',
    description: 'Los 10 errores más comunes que cometen empresas chilenas en Google Ads y Meta Ads, y cómo evitarlos. Datos reales, ejemplos y soluciones prácticas.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/errores-comunes-campanas-digitales-chile',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '10 Errores Comunes en Campañas Digitales en Chile (y Cómo Evitarlos)',
    description: 'Los 10 errores más comunes que cometen empresas chilenas en Google Ads y Meta Ads, y cómo evitarlos. Datos reales, ejemplos y soluciones prácticas.',
    url: 'https://www.mulleryperez.cl/blog/errores-comunes-campanas-digitales-chile',
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
      '@id': 'https://www.mulleryperez.cl/blog/errores-comunes-campanas-digitales-chile'
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">Optimización</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 14 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            10 Errores Comunes en Campañas Digitales en Chile (y Cómo Evitarlos)
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Basado en auditorías de +200 cuentas en Chile, estos son los errores que más dinero cuestan y cómo solucionarlos.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En M&P hemos auditado más de 200 cuentas de Google Ads y Meta Ads en Chile durante los últimos dos años. El 87% de ellas presentaba al menos 3 de los 10 errores que verás en este artículo.
              </p>
              <p className="text-gray-700 mb-4">
                Estos errores no son obvios. Muchas veces las campañas "funcionan" (generan clics, leads, ventas), pero están lejos de su potencial máximo. Y esa diferencia entre "funcionar" y "optimizar" puede significar miles de dólares al mes.
              </p>
              <p className="text-gray-700">
                Este artículo está pensado para gerentes de marketing, dueños de negocio y equipos internos que gestionan campañas digitales. Si sientes que tus campañas podrían rendir más, probablemente tengas razón.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              Error #1: No medir el CAC real
            </h2>

            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-red-700">El error:</strong> La empresa mide CPL (costo por lead), pero no sabe cuánto cuesta adquirir un cliente real que paga.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Un CPL bajo puede esconder un CAC altísimo si la tasa de conversión lead→cliente es mala.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Conecta tu CRM con tus campañas. Mide el CAC verdadero: inversión total / clientes que pagaron. Optimiza campañas en base a CAC, no solo CPL.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Ejemplo real: SaaS B2B en Chile</h3>
              <p className="text-gray-700 mb-2">• CPL aparente: $12.000 CLP (parecía excelente)</p>
              <p className="text-gray-700 mb-2">• Tasa de conversión lead→cliente: 4%</p>
              <p className="text-gray-700 mb-4">• <strong>CAC real: $300.000 CLP</strong> (insostenible con LTV de $450.000)</p>
              <p className="text-gray-700 font-semibold">Después de optimizar calidad de leads (no volumen), CAC bajó a $180.000 con LTV de $520.000.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-orange-600" />
              Error #2: Pausar campañas que "no convierten" sin analizar el funnel completo
            </h2>

            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-orange-700">El error:</strong> Pausar campañas de awareness o top-funnel porque "no generan ventas directas".
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Las campañas de awareness alimentan el remarketing y las búsquedas de marca. Al pausarlas, todo el funnel se debilita.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Usa modelos de atribución multi-touch. Analiza el impacto de cada campaña en todo el journey, no solo en el último clic.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              Error #3: Segmentar demasiado en Meta Ads
            </h2>

            <div className="bg-white border-l-4 border-yellow-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-yellow-700">El error:</strong> Crear 15 conjuntos de anuncios ultra-segmentados (por edad, interés, región) con $50.000 CLP cada uno.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Meta necesita volumen para aprender. Audiencias muy pequeñas nunca optimizan.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Usa audiencias amplias (Advantage+ o segmentación básica) y deja que el algoritmo optimice. Presupuesto mínimo: $300.000 CLP/mes por conjunto.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #4: No excluir conversiones de remarketing en Google Ads
            </h2>

            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-red-700">El error:</strong> Contar como "nueva conversión" a alguien que ya compró y volvió a hacer clic en un anuncio.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Infla métricas y engaña al algoritmo, que optimiza hacia clientes existentes en vez de nuevos.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Excluye audiencias de clientes existentes en campañas de prospecting. Crea campañas separadas para upsell/cross-sell.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #5: No testear creatividades constantemente
            </h2>

            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-blue-700">El error:</strong> Usar las mismas 2-3 creatividades durante meses sin renovarlas.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Las creatividades se "queman" (fatiga de audiencia). El CTR cae, el CPC sube, el CPL empeora.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Testea al menos 2 creatividades nuevas por semana. Usa IA generativa para escalar producción. Rota cada 15-30 días.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #6: Ignorar la concordancia de palabras clave en Google Ads
            </h2>

            <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-purple-700">El error:</strong> Usar solo concordancia amplia sin revisar términos de búsqueda reales.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Gastas presupuesto en búsquedas irrelevantes. Ejemplo: anuncio de "arriendo departamento" aparece en "arriendo bodega industrial".
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Revisa el informe de términos de búsqueda semanalmente. Agrega palabras clave negativas. Usa concordancia de frase + amplia, no solo amplia.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #7: Landing pages genéricas
            </h2>

            <div className="bg-white border-l-4 border-green-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">El error:</strong> Enviar todo el tráfico de campañas a la home del sitio o a una landing única para todos los anuncios.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> El mensaje del anuncio no calza con la landing. Conversión cae 40-60%.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Crea landings específicas por campaña. Mensaje coherente: anuncio → landing → CTA. Usa herramientas como Unbounce o Webflow.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #8: No configurar conversiones offline
            </h2>

            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-red-700">El error:</strong> Solo trackear leads online, sin subir a Google/Meta qué leads se convirtieron en clientes.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> El algoritmo optimiza para "cualquier lead", no para "leads que cierran". Desperdicia presupuesto.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Configura conversiones offline con tu CRM (Salesforce, HubSpot, Pipedrive). Sube datos de clientes cerrados cada semana.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #9: Presupuesto mal distribuido entre campañas
            </h2>

            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-orange-700">El error:</strong> Repartir el presupuesto equitativamente entre todas las campañas sin analizar performance.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Campañas malas reciben el mismo dinero que las ganadoras. ROI se diluye.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Redistribuye cada semana según ROAS. Campañas top: +30% presupuesto. Campañas bottom: pausa o reduce 50%.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Error #10: No usar extensiones de anuncios en Google Ads
            </h2>

            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-700 mb-4">
                <strong className="text-blue-700">El error:</strong> Publicar anuncios sin extensiones de sitio, llamada, ubicación o snippets.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-gray-900">Por qué es grave:</strong> Los anuncios ocupan menos espacio, tienen menor CTR y peor Quality Score. CPC sube 20-40%.
              </p>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-700">La solución:</strong> Activa todas las extensiones posibles. Mejora el CTR y baja el CPC sin costo adicional.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist rápida: ¿Estás cometiendo estos errores?
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Conoces tu CAC real (no solo CPL)?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Usas modelos de atribución multi-touch?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Testas creatividades al menos 2 veces al mes?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Revisas términos de búsqueda cada semana?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Tienes landings específicas por campaña?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Subes conversiones offline a Google/Meta?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Redistribuyes presupuesto según performance real?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">☑</span>
                  <span>¿Usas todas las extensiones en Google Ads?</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">
                <Lightbulb className="inline w-5 h-5 mr-2 text-yellow-600" />
                Regla M&P:
              </p>
              <p className="text-gray-700">
                "Si respondiste NO a 3 o más preguntas, tus campañas tienen potencial de mejora del 30-60% sin aumentar presupuesto."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              Los errores en campañas digitales no siempre son evidentes. Muchas veces las campañas "funcionan", pero están dejando dinero sobre la mesa porque no están optimizadas.
            </p>

            <p className="text-gray-700 mb-6">
              En M&P hacemos auditorías completas de cuentas Google Ads y Meta Ads. Identificamos los 3-5 errores que más impacto tienen en tu ROI y entregamos un plan de acción priorizado con proyecciones de mejora.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres saber qué errores está cometiendo tu cuenta?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Agenda una auditoría gratuita de 30 minutos. Te mostramos los 3 quick wins con mayor impacto en tu CAC y ROAS.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Solicitar Auditoría Gratis
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
