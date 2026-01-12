import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, XCircle, ArrowRight, Users, Target, BarChart3, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Muller y Pérez vs Otras Agencias de Marketing Digital Chile 2025',
  description: 'Comparativa objetiva de Muller y Pérez frente a otras agencias de marketing digital en Chile. Diferencias en metodología, precios, resultados y enfoque.',
  keywords: [
    'muller y perez vs cebra',
    'muller y perez vs seonet',
    'comparar agencias marketing digital chile',
    'mejor agencia marketing digital chile',
    'agencias google ads chile comparativa'
  ],
  alternates: {
    canonical: 'https://www.mulleryperez.cl/comparativa/muller-perez-vs-agencias-chile'
  },
  openGraph: {
    title: 'Muller y Pérez vs Otras Agencias de Marketing Digital Chile 2025',
    description: 'Comparativa objetiva: metodología, precios, resultados y enfoque de las principales agencias.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/comparativa/muller-perez-vs-agencias-chile'
  }
}

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Muller y Pérez vs Otras Agencias de Marketing Digital Chile 2025',
  description: 'Comparativa objetiva de Muller y Pérez frente a otras agencias de marketing digital en Chile.',
  url: 'https://www.mulleryperez.cl/comparativa/muller-perez-vs-agencias-chile',
  datePublished: '2025-01-08T10:00:00Z',
  author: {
    '@type': 'Organization',
    name: 'Muller y Pérez'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.mulleryperez.cl/logo-color.png'
    }
  }
}

export default function ComparativaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <img src="/logo-color.png" alt="Muller y Pérez" className="h-10 w-auto" />
            </Link>
            <Link href="/cotizador" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all">
              Cotizar Ahora
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blue-600/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              Comparativa Objetiva 2025
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Muller y Pérez vs Otras Agencias de Marketing Digital en Chile
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Una comparación honesta para ayudarte a elegir la agencia correcta según tus necesidades específicas.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-12">
              <h2 className="font-bold text-gray-900 mb-2">Nota de transparencia</h2>
              <p className="text-gray-700">
                Esta comparativa está hecha por Muller y Pérez. Intentamos ser objetivos, pero te recomendamos
                siempre hablar con varias agencias antes de decidir. Cada negocio tiene necesidades diferentes.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Qué nos diferencia?</h2>

            {/* Diferenciadores */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enfoque 100% Performance</h3>
                <p className="text-gray-600">
                  No hacemos branding ni campañas de "awareness" sin métricas. Todo lo que hacemos
                  tiene un KPI medible: leads, ventas, ROAS.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data Real, No Promesas</h3>
                <p className="text-gray-600">
                  Compartimos benchmarks reales de +200 campañas en Chile. No vendemos con
                  "casos de éxito" genéricos de otros países.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Equipo Dedicado</h3>
                <p className="text-gray-600">
                  No rotamos ejecutivos. Tu equipo te conoce, conoce tu negocio y optimiza
                  basado en historia, no desde cero cada mes.
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Herramientas Propias</h3>
                <p className="text-gray-600">
                  Desarrollamos Labs y calculadoras gratuitas. No solo vendemos servicios,
                  aportamos valor a la comunidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabla Comparativa */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Comparativa por Tipo de Agencia
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Característica</th>
                    <th className="px-6 py-4 text-center font-semibold bg-blue-600">M&P</th>
                    <th className="px-6 py-4 text-center font-semibold">Agencias Grandes</th>
                    <th className="px-6 py-4 text-center font-semibold">Freelancers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Equipo dedicado</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500 text-sm">Varía según cuenta</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Acceso full a cuentas</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500 text-sm">A veces restringido</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Reportes transparentes</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500 text-sm">Variable</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Benchmarks de industria</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Herramientas propias</td>
                    <td className="px-6 py-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-500 text-sm">Algunas</td>
                    <td className="px-6 py-4 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Precio mensual desde</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">$750.000</td>
                    <td className="px-6 py-4 text-center text-gray-700">$1.500.000+</td>
                    <td className="px-6 py-4 text-center text-gray-700">$300.000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Ideal para</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">PYMEs y medianas</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Grandes empresas</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Startups pequeñas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Cuándo NO elegir M&P */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Cuándo NO somos la mejor opción?</h2>

            <div className="space-y-4 mb-12">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Si solo buscas branding o awareness</h3>
                  <p className="text-gray-600 text-sm">Nos especializamos en performance con métricas de conversión. Si tu objetivo es solo visibilidad de marca sin medir ventas, hay agencias mejor enfocadas en eso.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Si tu presupuesto es menor a $300.000/mes en ads</h3>
                  <p className="text-gray-600 text-sm">Con presupuestos muy bajos, el costo de gestión no se justifica. Te recomendamos aprender a hacerlo tú mismo o usar un freelancer.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Si necesitas una agencia 360 con PR, eventos, etc.</h3>
                  <p className="text-gray-600 text-sm">Hacemos marketing digital de performance. No ofrecemos relaciones públicas, eventos ni producción de TV.</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Cuándo SÍ somos la mejor opción?</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quieres resultados medibles (leads, ventas, ROAS)</h3>
                  <p className="text-gray-600 text-sm">Cada peso que inviertes debe tener un retorno medible. Esa es nuestra obsesión.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Necesitas un equipo que entienda tu negocio</h3>
                  <p className="text-gray-600 text-sm">No rotamos ejecutivos. Tu equipo te conoce, conoce tu industria y optimiza con contexto.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Valoras la transparencia y acceso a datos</h3>
                  <p className="text-gray-600 text-sm">Tienes acceso completo a tus cuentas, reportes y métricas. Nada oculto.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">¿Quieres ver si somos el fit correcto?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Agenda una llamada de 30 minutos. Sin compromiso. Te decimos honestamente si podemos ayudarte o no.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all"
              >
                Cotizar Ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/56992258137"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                WhatsApp Directo
              </a>
            </div>
          </div>
        </section>

        {/* Footer simple */}
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
