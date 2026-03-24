import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Investigación y Estudios — Muller y Pérez',
  description: 'Estudios originales de performance marketing en Chile. Datos reales de +200 campañas: CPL, ROAS, CPC y benchmarks por industria. Fuente primaria del mercado chileno.',
  keywords: 'investigacion marketing digital chile, estudios performance marketing, benchmarks chile, datos reales campañas digitales',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/investigacion'
  },
  openGraph: {
    title: 'Investigación y Estudios — Muller y Pérez',
    description: 'Estudios originales de performance marketing en Chile basados en +200 campañas reales.',
    url: 'https://www.mulleryperez.cl/investigacion',
    type: 'website',
  }
}

const estudios = [
  {
    slug: 'google-meridian-marketing-mix-modeling-chile',
    titulo: 'Google Meridian en Chile: el modelo de atribución que usa Google internamente',
    descripcion: 'Qué es Google Meridian, cómo funciona el MMM bayesiano, por qué la atribución last-click ya no es suficiente y cómo aplica a la distribución de presupuesto en el mercado chileno.',
    fecha: '3 de marzo, 2026',
    tag: 'Análisis técnico',
    destacado: true,
  },
  {
    slug: 'estudio-performance-marketing-chile-2026',
    titulo: 'Benchmarks de Performance Marketing en Chile 2026',
    descripcion: 'CPL, ROAS y CPC reales por industria. Datos de +200 campañas activas en Chile: e-commerce, fintech, inmobiliaria, SaaS y 18 industrias más.',
    fecha: '3 de marzo, 2026',
    tag: 'Estudio de datos',
    destacado: false,
  },
]

export default function InvestigacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <SiteHeader />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Investigación</span>
            <h1 className="text-4xl font-black text-gray-900 mt-6 mb-3">Estudios y datos originales de marketing digital en Chile</h1>
            <p className="text-xl text-gray-600">Investigación propia basada en campañas reales gestionadas por Muller y Pérez. Sin promedios teóricos — solo datos del mercado chileno.</p>
          </div>

          <div className="space-y-6">
            {estudios.map((estudio) => (
              <Link key={estudio.slug} href={`/investigacion/${estudio.slug}`} className="block bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{estudio.tag}</span>
                  {estudio.destacado && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Nuevo</span>}
                  <span className="text-gray-400 text-xs">{estudio.fecha}</span>
                </div>
                <h2 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{estudio.titulo}</h2>
                <p className="text-gray-600">{estudio.descripcion}</p>
                <span className="text-blue-600 font-semibold text-sm mt-4 inline-block">Leer estudio →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-10 px-6 text-center">
        <Link href="/">
          <img src="/logo-color.png" alt="Muller y Pérez" className="h-9 w-auto mx-auto mb-3 opacity-80" />
        </Link>
        <p className="text-gray-400 text-sm">© 2026 Muller y Pérez — Marketing & Performance</p>
      </footer>
    </div>
  )
}
