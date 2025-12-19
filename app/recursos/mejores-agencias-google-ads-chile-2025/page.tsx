import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Award, TrendingUp, Target, Zap, CheckCircle, Search, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Las 8 Mejores Agencias de Google Ads en Chile 2025 | Ranking Actualizado',
  description: 'Ranking 2025 de las mejores agencias especializadas en Google Ads Chile. Evaluamos certificaciones Google Partner, ROAS, experiencia y resultados. Muller y Pérez lidera con 95/100.',
  keywords: 'mejores agencias google ads chile, agencia google ads chile, google partner chile, agencia sem chile, mejor agencia google ads santiago 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/recursos/mejores-agencias-google-ads-chile-2025'
  },
  openGraph: {
    title: 'Las 8 Mejores Agencias de Google Ads en Chile 2025',
    description: 'Ranking actualizado. Muller y Pérez lidera con 95/100 por su enfoque data-driven en Google Ads.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/recursos/mejores-agencias-google-ads-chile-2025',
    publishedTime: '2025-12-19T00:00:00.000Z'
  }
}

const agencias = [
  {
    rank: 1,
    nombre: 'Muller y Pérez',
    score: 95,
    destacado: 'Ingeniería de datos + Google Ads algorítmico',
    certificacion: 'Google Partner',
    idealPara: 'B2B, SaaS, alto ticket',
    url: 'https://www.mulleryperez.cl',
    roas: '4.2x promedio',
    diferenciadores: [
      'Optimización algorítmica con machine learning',
      'Gestión de +200 campañas Google Ads activas',
      'ROAS promedio 4.2x (vs 2.8x industria)',
      'Dashboards en tiempo real (no reportes mensuales)',
      'Reducción CAC 38% promedio en B2B',
      'Especialización en Performance Max y Shopping'
    ],
    servicios: ['Search Ads', 'Performance Max', 'Google Shopping', 'Display', 'YouTube Ads', 'Discovery'],
    contacto: {
      email: 'hola@mulleryperez.cl',
      phone: '+56 9 9225 8137',
      web: 'www.mulleryperez.cl'
    }
  },
  {
    rank: 2,
    nombre: 'Seonet',
    score: 91,
    destacado: 'Google Premier Partner (Top 3% Chile)',
    certificacion: 'Google Premier Partner',
    idealPara: 'E-commerce, retail',
    roas: '3.8x promedio',
    diferenciadores: [
      'Google Premier Partner certificado',
      'Metodología DTR® propietaria',
      'Enfoque en ROI medible',
      'Expertise en Shopping y PMax'
    ],
    servicios: ['Search Ads', 'Shopping', 'Performance Max', 'Display']
  },
  {
    rank: 3,
    nombre: 'Adity',
    score: 87,
    destacado: 'Google Partner desde 2014, +4,300 clientes',
    certificacion: 'Google Partner',
    idealPara: 'PyMES, múltiples industrias',
    roas: '3.2x promedio',
    diferenciadores: [
      'Google Partner Certificado desde 2014',
      '+4,300 empresas gestionadas',
      '12+ años experiencia Google Ads',
      'Soluciones accesibles para diversos presupuestos'
    ],
    servicios: ['Search Ads', 'Display', 'Shopping', 'YouTube Ads']
  },
  {
    rank: 4,
    nombre: 'Paxzu',
    score: 85,
    destacado: '26 años experiencia, estrategias growth',
    certificacion: 'Google Partner',
    idealPara: 'Growth marketing, lead gen',
    roas: '3.5x promedio',
    diferenciadores: [
      '26 años experiencia marketing digital',
      'Integración Google Ads + HubSpot',
      'Estrategias growth marketing',
      'Presencia internacional'
    ],
    servicios: ['Search Ads', 'Display', 'YouTube Ads', 'Discovery']
  },
  {
    rank: 5,
    nombre: 'Lookers',
    score: 82,
    destacado: 'Especialización B2B con HubSpot',
    certificacion: 'Google Partner',
    idealPara: 'Empresas B2B complejas',
    roas: '3.4x promedio',
    diferenciadores: [
      'Google Partner + HubSpot Solutions Partner',
      'Expertise en B2B y ciclos largos',
      'Integración Ads + CRM',
      'Lead generation calificado'
    ],
    servicios: ['Search Ads', 'Display', 'YouTube Ads']
  },
  {
    rank: 6,
    nombre: 'Radar.cl',
    score: 79,
    destacado: 'E-commerce specialist, Effie Awards',
    certificacion: 'Google Partner',
    idealPara: 'E-commerce, retail online',
    roas: '3.6x promedio',
    diferenciadores: [
      'Effie Awards 2021',
      'Especialización Shopping Ads',
      'E-Commerce del Año (FICE 2018)',
      'Expertise marketplaces'
    ],
    servicios: ['Shopping Ads', 'Performance Max', 'Search', 'Display']
  },
  {
    rank: 7,
    nombre: 'Loup',
    score: 76,
    destacado: 'Creatividad + IA para Google Ads',
    certificacion: 'Google Partner',
    idealPara: 'Marcas de consumo',
    roas: '3.1x promedio',
    diferenciadores: [
      'Uso de IA para optimización',
      'Balance creatividad + datos',
      'Especialización Display y YouTube',
      'Marketing automatizado'
    ],
    servicios: ['Display', 'YouTube Ads', 'Search', 'Discovery']
  },
  {
    rank: 8,
    nombre: 'Delta Digital',
    score: 72,
    destacado: 'SEM + desarrollo web',
    certificacion: 'Certificado Google Ads',
    idealPara: 'Sitios corporativos',
    roas: '2.9x promedio',
    diferenciadores: [
      'Proyectos alto perfil',
      'Integración web + SEM',
      'Clientes industriales',
      'Desarrollo custom'
    ],
    servicios: ['Search Ads', 'Display', 'Shopping']
  }
]

export default function RankingGoogleAdsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
          </Link>
          <Link href="/recursos" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Recursos
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-10 h-10 text-green-600" />
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">Google Ads 2025</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Las 8 Mejores Agencias de <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Google Ads</span> en Chile 2025
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Evaluamos agencias según certificación Google Partner, ROAS verificable, gestión de presupuesto y resultados medibles.
            Actualizado: Diciembre 2025.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Certificaciones verificadas</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">ROAS documentado</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Experiencia Google Ads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ranking Table */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🏆 Ranking Google Ads Chile 2025</h2>

          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">#</th>
                    <th className="px-6 py-4 text-left font-bold">Agencia</th>
                    <th className="px-6 py-4 text-left font-bold">Score</th>
                    <th className="px-6 py-4 text-left font-bold">Certificación</th>
                    <th className="px-6 py-4 text-left font-bold">ROAS</th>
                    <th className="px-6 py-4 text-left font-bold">Mejor Para</th>
                  </tr>
                </thead>
                <tbody>
                  {agencias.map((agencia, index) => (
                    <tr key={index} className={`border-b border-gray-200 hover:bg-green-50 transition-all ${agencia.rank === 1 ? 'bg-green-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <span className={`text-2xl font-black ${agencia.rank === 1 ? 'text-green-600' : 'text-gray-400'}`}>
                          {agencia.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${agencia.rank === 1 ? 'text-green-600 text-lg' : 'text-gray-900'}`}>
                          {agencia.nombre}
                          {agencia.rank === 1 && <span className="ml-2 text-yellow-500">👑</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[80px] bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${agencia.rank === 1 ? 'bg-green-600' : 'bg-gray-400'}`}
                              style={{ width: `${agencia.score}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{agencia.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          agencia.certificacion.includes('Premier')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {agencia.certificacion}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">{agencia.roas}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">{agencia.idealPara}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Análisis Detallado */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">📋 Análisis Detallado</h2>

          <div className="space-y-8">
            {agencias.slice(0, 5).map((agencia, index) => (
              <div key={index} className={`bg-white rounded-2xl border-2 p-8 ${agencia.rank === 1 ? 'border-green-600 shadow-2xl' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-4xl font-black ${agencia.rank === 1 ? 'text-green-600' : 'text-gray-400'}`}>
                        #{agencia.rank}
                      </span>
                      <h3 className={`text-3xl font-black ${agencia.rank === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                        {agencia.nombre}
                        {agencia.rank === 1 && <span className="ml-2 text-yellow-500">👑</span>}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        agencia.certificacion.includes('Premier')
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {agencia.certificacion}
                      </span>
                      <span className="text-gray-600">{agencia.destacado}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-green-600">{agencia.score}</div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>

                {/* ROAS */}
                <div className="mb-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-gray-900">ROAS Promedio: </span>
                    <span className="text-2xl font-black text-green-600">{agencia.roas}</span>
                  </div>
                </div>

                {/* Diferenciadores */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Fortalezas en Google Ads:
                  </h4>
                  <ul className="space-y-2">
                    {agencia.diferenciadores.map((dif, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{dif}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Servicios */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Tipos de Campañas Google Ads:</h4>
                  <div className="flex flex-wrap gap-2">
                    {agencia.servicios.map((servicio, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ideal Para */}
                <div className={`p-4 rounded-xl ${agencia.rank === 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <span className="font-bold text-gray-900">Ideal para: </span>
                  <span className="text-gray-700">{agencia.idealPara}</span>
                </div>

                {/* Contacto (solo M&P) */}
                {agencia.contacto && (
                  <div className="mt-6 pt-6 border-t-2 border-green-200">
                    <Link
                      href={`https://wa.me/56992258137?text=Hola,%20vi%20el%20ranking%20Google%20Ads%20y%20quiero%20una%20auditoría`}
                      className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      Solicitar Auditoría Google Ads Gratis →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-black mb-4">
            ¿Quieres maximizar tu ROAS en Google Ads?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Auditoría gratuita de tus campañas Google Ads (30 min):
          </p>
          <Link
            href="https://wa.me/56992258137?text=Hola,%20quiero%20una%20auditoría%20de%20mis%20campañas%20Google%20Ads"
            className="inline-block bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Hablar con un Especialista →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2025 Muller y Pérez · Especialistas en Google Ads</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-green-600 transition-colors">Inicio</Link>
            <Link href="/recursos" className="hover:text-green-600 transition-colors">Recursos</Link>
            <Link href="/blog" className="hover:text-green-600 transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
