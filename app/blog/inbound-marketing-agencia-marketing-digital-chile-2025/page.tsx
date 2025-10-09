import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Inbound Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Contenido en Clientes',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 convierte contenido en clientes con estrategias de Inbound Marketing. Casos y costos reales.',
  keywords: 'agencia de marketing digital, inbound marketing Chile, contenidos digitales 2025, agencia marketing digital inbound, CAC inbound marketing',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/inbound-marketing-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Inbound Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Contenido en Clientes',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 convierte contenido en clientes con estrategias de Inbound Marketing. Casos y costos reales.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/inbound-marketing-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-15T00:00:00.000Z'
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">Performance</span>
            <p className="text-gray-500 mt-4">15 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Inbound Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Contenido en Clientes
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En un mercado cada vez más saturado de anuncios, los consumidores chilenos se han vuelto inmunes a la publicidad invasiva. Hoy, el 70% de los usuarios prefiere investigar por su cuenta antes de hablar con un vendedor.
              </p>
              <p className="text-gray-700 mb-4">
                Aquí es donde entra el Inbound Marketing, una metodología que transforma el contenido en un imán para atraer, nutrir y convertir clientes. Pero el Inbound no se trata de escribir artículos al azar ni de llenar las redes de publicaciones genéricas. Se trata de diseñar un ecosistema de contenidos alineados con el journey del cliente, integrados a CRM y conectados con ventas.
              </p>
              <p className="text-gray-700 mb-4">
                El verdadero potencial del Inbound se activa cuando lo gestiona una agencia de marketing digital que entienda de estrategia, performance y reportería de ROI.
              </p>
              <p className="text-gray-700 mb-4">
                ¿Qué es el Inbound Marketing?
              </p>
              <p className="text-gray-700 mb-4">
                El Inbound Marketing es una estrategia basada en atraer clientes con contenido relevante y de valor, en lugar de perseguirlos con publicidad intrusiva.
              </p>
              <p className="text-gray-700 mb-4">
                Su flujo clásico:
              </p>
              <p className="text-gray-700 mb-4">
                1.	Atracción: contenido optimizado para SEO y redes sociales.
              </p>
              <p className="text-gray-700 mb-4">
                2.	Conversión: llamadas a la acción y formularios.
              </p>
              <p className="text-gray-700 mb-4">
                3.	Cierre: nurturing y seguimiento con CRM.
              </p>
              <p className="text-gray-700 mb-4">
                4.	Fidelización: contenidos exclusivos y programas de retención.
              </p>
              <p className="text-gray-700 mb-4">
                👉 A diferencia del outbound (pauta pagada), el Inbound reduce CAC y aumenta el LTV.
              </p>
              <p className="text-gray-700 mb-4">
                Por qué el Inbound Marketing es clave en Chile 2025
              </p>
            </div>

            {/* 1. Creación de buyer personas */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              1. Creación de buyer personas
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Basados en data real: industria, cargo, ticket promedio, pain points.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Ejemplo: gerente de RRHH en Santiago que busca un software de asistencia.</span>
                </li>
              </ul>
            </div>

            {/* 2. Contenido estratégico */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              2. Contenido estratégico
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Blogs de 2.500+ palabras con SEO.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Ebooks y guías descargables.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Videos explicativos en YouTube y TikTok.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Webinars y podcasts.</span>
                </li>
              </ul>
            </div>

            {/* 3. Automatización de nurturing */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              3. Automatización de nurturing
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Flujos de email marketing con IA.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Mensajes en WhatsApp Business.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Secuencias personalizadas según etapa del funnel.</span>
                </li>
              </ul>
            </div>

            {/* 4. Integración con CRM */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              4. Integración con CRM
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>HubSpot, Zoho, Pipedrive.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Seguimiento de leads desde el primer contacto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Reporterías que muestran CAC, LTV y ROI del Inbound.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: empresa B2B de logística en Santiago</p>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Objetivo: captar leads calificados de empresas medianas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Estrategia:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Blog con artículos optimizados para “outsourcing logístico Chile” y “agencia de marketing digital para logística”.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Ebook descargable con casos de éxito.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Flujos de nurturing por email y WhatsApp.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Resultados en 6 meses:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>1.800 leads nuevos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CPL promedio: $3.200 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CAC bajó 40%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>LTV subió 25%.</span>
                </li>
              </ul>
            </div>

            {/* Costos del Inbound Marketing en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Costos del Inbound Marketing en Chile 2025
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Blog post largo (2.500 palabras): $200.000 – $350.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Ebook profesional: $500.000 – $1.000.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Automatización CRM + IA: desde $600.000 CLP/mes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>El ROI promedio de un plan Inbound gestionado por agencia es de 4x a 7x en un año.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para Inbound Marketing */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para Inbound Marketing
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define buyer personas con data real.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Crea contenido largo, SEO friendly y de alto valor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Diseña flujos de nurturing con IA y email marketing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Integra CRM para seguimiento de leads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide CAC, LTV y ROI del Inbound.</span>
                </li>
              </ul>
            </div>

            {/* Una agencia de marketing digital experta en Inbound combina estrategia de contenidos, automatización e integración tecnológica para transformar visitas en clientes rentables. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Una agencia de marketing digital experta en Inbound combina estrategia de contenidos, automatización e integración tecnológica para transformar visitas en clientes rentables.
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>En M&P diseñamos planes Inbound que generan leads de calidad, bajan el CAC y multiplican el LTV, con reportería clara y dashboards ejecutivos.</span>
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
