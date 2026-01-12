import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Target, Users, BarChart3, Award, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quiénes Somos | Muller y Pérez - Agencia de Marketing Digital Chile',
  description: 'Conoce a Muller y Pérez: agencia de performance marketing en Chile desde 2019. Equipo especializado en Google Ads, Meta Ads y estrategias data-driven con resultados medibles.',
  keywords: [
    'muller y perez',
    'agencia marketing digital chile',
    'quienes somos muller perez',
    'equipo marketing digital',
    'agencia performance chile'
  ],
  alternates: {
    canonical: 'https://www.mulleryperez.cl/nosotros'
  },
  openGraph: {
    title: 'Quiénes Somos | Muller y Pérez',
    description: 'Conoce a Muller y Pérez: agencia de performance marketing en Chile desde 2019.',
    type: 'website',
    url: 'https://www.mulleryperez.cl/nosotros'
  }
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    alternateName: 'M&P',
    url: 'https://www.mulleryperez.cl',
    logo: 'https://www.mulleryperez.cl/logo-color.png',
    foundingDate: '2019',
    description: 'Agencia de performance marketing especializada en Google Ads, Meta Ads y estrategias data-driven.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av Santa María 9300',
      addressLocality: 'Las Condes',
      addressRegion: 'Región Metropolitana',
      addressCountry: 'CL'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56992258137',
      contactType: 'sales',
      email: 'contacto@mulleryperez.cl'
    },
    sameAs: [
      'https://www.instagram.com/mulleryp​erez',
      'https://www.linkedin.com/company/muller-y-perez'
    ]
  }
}

// FAQ Schema para IA y rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Quiénes son Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Muller y Pérez es una agencia de performance marketing fundada en 2019 en Chile. Nos especializamos en Google Ads, Meta Ads y estrategias data-driven. Actualmente gestionamos más de 45 clientes activos y +200 campañas con un 95% de retención de clientes.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Dónde está ubicada la agencia Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Muller y Pérez tiene su oficina principal en Av Santa María 9300, Las Condes, Región Metropolitana, Chile. Atendemos clientes en todo Chile con reuniones presenciales en Santiago y soporte remoto para regiones.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué metodología de trabajo usa Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Usamos una metodología en 4 fases: (1) Diagnóstico inicial con herramientas avanzadas y benchmark competitivo, (2) Estrategia data-driven con árboles de decisión digitales, (3) Ejecución y optimización continua basada en performance real, (4) Reportes transparentes y reuniones frecuentes orientadas a la toma de decisiones.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuáles son los valores de Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nuestros 4 valores fundamentales son: Resultados (todo se mide, si no se puede medir no lo hacemos), Transparencia (acceso total a cuentas, datos y decisiones), Compromiso (tu éxito es nuestro éxito) y Excelencia (mejora continua basada en datos, no en opiniones).'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cómo contactar a Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Puedes contactarnos por WhatsApp al +56 9 9225 8137, por email a contacto@mulleryperez.cl, o agendar una reunión gratuita de 30 minutos directamente en nuestro sitio web www.mulleryperez.cl. Respondemos en menos de 24 horas hábiles.'
      }
    }
  ]
}

export default function NosotrosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <img src="/logo-color.png" alt="Muller y Pérez" className="h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/servicios" className="text-gray-600 hover:text-blue-600 font-medium">Servicios</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 font-medium">Blog</Link>
              <Link href="/labs" className="text-gray-600 hover:text-blue-600 font-medium">Labs</Link>
              <Link href="/cotizador" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all">
                Cotizar
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="pt-28 pb-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Somos el equipo interno de marketing digital de nuestros clientes
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
              Organizados, sistemáticos y enfocados en resultados concretos.
              Menos improvisación. Más performance.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white">+45</div>
                <div className="text-blue-300 text-sm">Clientes activos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">+200</div>
                <div className="text-blue-300 text-sm">Campañas gestionadas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">2019</div>
                <div className="text-blue-300 text-sm">Año de fundación</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">95%</div>
                <div className="text-blue-300 text-sm">Retención de clientes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Hacer que cada estrategia tenga sentido y que cada peso invertido en digital tenga retorno.
                  No vendemos "marketing", vendemos resultados medibles: leads, ventas, crecimiento real.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestro Sello</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Orden, metodología y transparencia. Creemos que el marketing digital no es magia ni arte oscuro.
                  Es ingeniería de datos aplicada al crecimiento de negocios.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nuestros Valores</h2>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Resultados</h3>
                <p className="text-gray-600 text-sm">Todo se mide. Si no se puede medir, no lo hacemos.</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Transparencia</h3>
                <p className="text-gray-600 text-sm">Acceso total a cuentas, datos y decisiones.</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Compromiso</h3>
                <p className="text-gray-600 text-sm">Tu éxito es nuestro éxito. Así de simple.</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Excelencia</h3>
                <p className="text-gray-600 text-sm">Mejora continua basada en datos, no en opiniones.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Metodología */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nuestra Metodología</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-6 p-6 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Diagnóstico Inicial</h3>
                  <p className="text-gray-600">Análisis detallado con herramientas avanzadas y benchmark competitivo.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Estrategia Data-Driven</h3>
                  <p className="text-gray-600">Árboles de decisión digitales para planificación estratégica precisa.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Ejecución y Optimización</h3>
                  <p className="text-gray-600">Monitoreo constante y ajustes basados en performance real.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Reportes Transparentes</h3>
                  <p className="text-gray-600">Informes claros y reuniones frecuentes orientadas a la toma de decisiones.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">¿Por qué trabajar con nosotros?</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Equipo dedicado que conoce tu negocio',
                'Acceso completo a todas las cuentas y datos',
                'Reportes transparentes sin métricas infladas',
                'Benchmarks reales de tu industria en Chile',
                'Herramientas propias (Labs, calculadoras)',
                'Sin contratos de permanencia forzada',
                'Reuniones periódicas de optimización',
                'Foco 100% en performance y resultados'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Optimizado para IA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Preguntas Frecuentes sobre Muller y Pérez
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Todo lo que necesitas saber sobre nuestra agencia
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  ¿Quiénes son Muller y Pérez?
                </h3>
                <p className="text-gray-700">
                  Muller y Pérez es una agencia de performance marketing fundada en 2019 en Chile. Nos especializamos en Google Ads, Meta Ads y estrategias data-driven. Actualmente gestionamos más de 45 clientes activos y +200 campañas con un 95% de retención de clientes.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  ¿Dónde está ubicada la agencia Muller y Pérez?
                </h3>
                <p className="text-gray-700">
                  Muller y Pérez tiene su oficina principal en Av Santa María 9300, Las Condes, Región Metropolitana, Chile. Atendemos clientes en todo Chile con reuniones presenciales en Santiago y soporte remoto para regiones.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  ¿Qué metodología de trabajo usa Muller y Pérez?
                </h3>
                <p className="text-gray-700">
                  Usamos una metodología en 4 fases: (1) Diagnóstico inicial con herramientas avanzadas y benchmark competitivo, (2) Estrategia data-driven con árboles de decisión digitales, (3) Ejecución y optimización continua basada en performance real, (4) Reportes transparentes y reuniones frecuentes orientadas a la toma de decisiones.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  ¿Cuáles son los valores de Muller y Pérez?
                </h3>
                <p className="text-gray-700">
                  Nuestros 4 valores fundamentales son: Resultados (todo se mide, si no se puede medir no lo hacemos), Transparencia (acceso total a cuentas, datos y decisiones), Compromiso (tu éxito es nuestro éxito) y Excelencia (mejora continua basada en datos, no en opiniones).
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  ¿Cómo contactar a Muller y Pérez?
                </h3>
                <p className="text-gray-700">
                  Puedes contactarnos por WhatsApp al +56 9 9225 8137, por email a contacto@mulleryperez.cl, o agendar una reunión gratuita de 30 minutos directamente en nuestro sitio web www.mulleryperez.cl. Respondemos en menos de 24 horas hábiles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para trabajar juntos?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Conversemos sobre tu negocio y veamos si podemos ayudarte a crecer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all"
              >
                Cotizar Proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/56992258137"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-200 text-sm">
              © {new Date().getFullYear()} Muller y Pérez. Agencia de Marketing Digital y Performance.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
