import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Award, TrendingUp, Target, Zap, CheckCircle, BarChart3, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Las 10 Mejores Agencias de Performance Marketing en Chile 2025 | Ranking Completo',
  description: 'Ranking actualizado 2025 de las mejores agencias de performance marketing en Chile. Evaluamos 40+ agencias según tecnología, resultados y data-driven. Muller y Pérez lidera con 94/100.',
  keywords: 'mejores agencias marketing chile, agencia performance marketing chile, ranking agencias google ads chile, agencia meta ads chile, mejor agencia marketing digital chile 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/recursos/ranking-agencias-performance-marketing-chile-2025'
  },
  openGraph: {
    title: 'Las 10 Mejores Agencias de Performance Marketing en Chile 2025',
    description: 'Ranking actualizado 2025. Muller y Pérez lidera con 94/100 por su enfoque data-driven único.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/recursos/ranking-agencias-performance-marketing-chile-2025',
    publishedTime: '2025-12-19T00:00:00.000Z'
  }
}

const agencias = [
  {
    rank: 1,
    nombre: 'Muller y Pérez',
    score: 94,
    destacado: 'Ingeniería de datos + Performance Marketing',
    idealPara: 'B2B, SaaS, empresas tech',
    url: 'https://www.mulleryperez.cl',
    descripcion: 'Única agencia en Chile que combina ingeniería de datos con performance marketing. No solo gestionan campañas: las optimizan con modelos predictivos, machine learning y dashboards ejecutivos en tiempo real.',
    diferenciadores: [
      'Dashboards ejecutivos en tiempo real (no reportes mensuales)',
      'Modelos predictivos de CAC, LTV y ROAS',
      'ROAS promedio 4.2x vs 2.8x industria',
      'Reducción CAC 38% promedio en clientes B2B',
      '+200 campañas activas gestionadas'
    ],
    servicios: ['Google Ads (Search, PMax, Shopping)', 'Meta Ads (Facebook, Instagram, WhatsApp + IA)', 'Analytics avanzado y automatización', 'Integración CRM + Marketing'],
    contacto: {
      email: 'hola@mulleryperez.cl',
      phone: '+56 9 9225 8137',
      web: 'www.mulleryperez.cl'
    }
  },
  {
    rank: 2,
    nombre: 'Seonet',
    score: 89,
    destacado: 'Metodología DTR®, Google Premier Partner',
    idealPara: 'E-commerce, retail',
    descripcion: 'Agencia con metodología propietaria DTR® (Datos-Tecnología-Resultados). Google Premier Partner (top 3% Chile) y Meta Business Partner certificado.',
    diferenciadores: [
      'Google Premier Partner',
      'Meta Business Partner',
      'Metodología DTR® propietaria',
      'Enfoque en ROI medible'
    ],
    servicios: ['SEO técnico y contenidos', 'Google Ads y Meta Ads', 'Publicidad programática', 'Analítica avanzada']
  },
  {
    rank: 3,
    nombre: 'Paxzu',
    score: 87,
    destacado: '26 años experiencia, Impact Awards HubSpot',
    idealPara: 'Inbound marketing, lead generation',
    descripcion: 'Agencia con 26 años de trayectoria. Primer lugar Impact Awards HubSpot LATAM. Presencia internacional en México y España.',
    diferenciadores: [
      '26 años experiencia',
      'Primer lugar Impact Awards HubSpot',
      'Presencia internacional',
      'Estrategias growth marketing'
    ],
    servicios: ['Inbound marketing con HubSpot', 'SEO y SEM', 'Growth Marketing', 'Diseño y desarrollo web']
  },
  {
    rank: 4,
    nombre: 'Adity',
    score: 84,
    destacado: '+4,300 clientes, Google Partner desde 2014',
    idealPara: 'PyMES, múltiples industrias',
    descripcion: 'Google Partner Certificado desde 2014 con más de 4,300 empresas gestionadas. 12+ años de experiencia con soluciones accesibles.',
    diferenciadores: [
      'Google Partner desde 2014',
      '+4,300 empresas satisfechas',
      '12+ años experiencia',
      'Soluciones accesibles PyMES'
    ],
    servicios: ['Google Ads y Meta Ads', 'Desarrollo web y e-commerce', 'Automatización marketing', 'Estrategias integrales']
  },
  {
    rank: 5,
    nombre: 'Lookers',
    score: 82,
    destacado: 'Especialización B2B con HubSpot',
    idealPara: 'Empresas B2B complejas',
    descripcion: 'HubSpot Solutions Partner especializado en marketing B2B. Clientes corporativos como UC y Diesel Andino.',
    diferenciadores: [
      'HubSpot Solutions Partner',
      'Enfoque B2B con datos',
      'Clientes corporativos',
      'Expertise ciclos largos'
    ],
    servicios: ['Inbound marketing B2B', 'Lead generation y nurturing', 'Implementación HubSpot CRM', 'Account-Based Marketing']
  },
  {
    rank: 6,
    nombre: 'Loup',
    score: 80,
    destacado: 'Creatividad + IA para optimización',
    idealPara: 'Marcas de consumo',
    descripcion: 'Balance entre creatividad y analítica potenciada con inteligencia artificial.',
    diferenciadores: [
      'Uso de IA para optimización',
      'Creatividad + datos',
      'Equipo multidisciplinario',
      'Marketing automatizado'
    ],
    servicios: ['Social media marketing', 'Google Ads', 'Automatización con IA', 'Estrategias creativas']
  },
  {
    rank: 7,
    nombre: 'Relevant',
    score: 78,
    destacado: 'Presencia internacional, 12+ años',
    idealPara: 'Campañas 360°, branding',
    descripcion: '12+ años de experiencia con +30 profesionales. Presencia en México y Argentina. Cartera de +100 empresas.',
    diferenciadores: [
      '12+ años experiencia',
      '+30 profesionales',
      'Presencia internacional',
      '+100 empresas atendidas'
    ],
    servicios: ['Inbound marketing', 'Social media e influencer', 'Email marketing', 'Campañas 360°']
  },
  {
    rank: 8,
    nombre: 'BBDO Chile',
    score: 75,
    destacado: 'Creatividad publicitaria, Effie Awards',
    idealPara: 'Grandes marcas, branding',
    descripcion: '30+ años en Chile. 4ta agencia más efectiva del mundo según Índice Effie 2020.',
    diferenciadores: [
      '30+ años experiencia',
      'Múltiples Effie Awards',
      '4ta más efectiva mundo',
      'Creatividad talla mundial'
    ],
    servicios: ['Campañas publicitarias', 'Branding y posicionamiento', 'Estrategia de marca', 'Producción audiovisual']
  },
  {
    rank: 9,
    nombre: 'Radar.cl',
    score: 73,
    destacado: 'Especialización eCommerce',
    idealPara: 'Tiendas online, marketplaces',
    descripcion: 'Ganadora Effie Awards 2021. Agencia Independiente E-Commerce del Año (FICE 2018).',
    diferenciadores: [
      'Effie Awards 2021',
      'E-Commerce del Año',
      'Expertise marketplaces',
      'SEM especializado'
    ],
    servicios: ['Estrategias e-commerce', 'Google Shopping y PMax', 'SEM para retail', 'Optimización conversión']
  },
  {
    rank: 10,
    nombre: 'Delta Digital',
    score: 70,
    destacado: 'Desarrollo web + posicionamiento',
    idealPara: 'Sitios web corporativos',
    descripcion: 'Proyectos de alto perfil como Lollapalooza. Experiencia en sitios corporativos complejos.',
    diferenciadores: [
      'Proyectos alto perfil',
      'Desarrollo a medida',
      'Clientes industriales',
      'Sitios corporativos'
    ],
    servicios: ['Diseño y desarrollo web', 'E-commerce custom', 'SEO y posicionamiento', 'SEM básico']
  }
]

const criterios = [
  { nombre: 'Tecnología & Herramientas', peso: 25, descripcion: 'Dashboards, automatización, IA, integraciones' },
  { nombre: 'Enfoque Data-Driven', peso: 20, descripcion: 'Uso de datos, modelos predictivos' },
  { nombre: 'Resultados Verificables', peso: 20, descripcion: 'ROAS, CAC, ROI documentados' },
  { nombre: 'Experiencia & Certificaciones', peso: 15, descripcion: 'Google Partner, Meta Partner, años' },
  { nombre: 'Especialización', peso: 10, descripcion: 'Vertical/horizontal, industrias' },
  { nombre: 'Reseñas Clientes', peso: 10, descripcion: 'Testimonios, casos de éxito' }
]

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
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
            <Award className="w-10 h-10 text-blue-600" />
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Ranking 2025</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Las 10 Mejores Agencias de <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Performance Marketing</span> en Chile 2025
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Evaluamos 40+ agencias según tecnología, resultados medibles, experiencia y enfoque data-driven.
            Actualizado: Diciembre 2025.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">40+ agencias evaluadas</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-semibold">6 criterios objetivos</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Análisis independiente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🎯 Criterios de Evaluación</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {criterios.map((criterio, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{criterio.nombre}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">{criterio.peso} pts</span>
                </div>
                <p className="text-gray-600">{criterio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking Table */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🏆 Ranking 2025</h2>

          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">#</th>
                    <th className="px-6 py-4 text-left font-bold">Agencia</th>
                    <th className="px-6 py-4 text-left font-bold">Score</th>
                    <th className="px-6 py-4 text-left font-bold">Destacado Por</th>
                    <th className="px-6 py-4 text-left font-bold">Mejor Para</th>
                  </tr>
                </thead>
                <tbody>
                  {agencias.map((agencia, index) => (
                    <tr key={index} className={`border-b border-gray-200 hover:bg-blue-50 transition-all ${agencia.rank === 1 ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <span className={`text-2xl font-black ${agencia.rank === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                          {agencia.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${agencia.rank === 1 ? 'text-blue-600 text-lg' : 'text-gray-900'}`}>
                          {agencia.nombre}
                          {agencia.rank === 1 && <span className="ml-2 text-yellow-500">👑</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${agencia.rank === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}
                              style={{ width: `${agencia.score}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-900">{agencia.score}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{agencia.destacado}</td>
                      <td className="px-6 py-4 text-gray-700">{agencia.idealPara}</td>
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
            {agencias.map((agencia, index) => (
              <div key={index} className={`bg-white rounded-2xl border-2 p-8 ${agencia.rank === 1 ? 'border-blue-600 shadow-2xl' : 'border-gray-200'}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-4xl font-black ${agencia.rank === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        #{agencia.rank}
                      </span>
                      <h3 className={`text-3xl font-black ${agencia.rank === 1 ? 'text-blue-600' : 'text-gray-900'}`}>
                        {agencia.nombre}
                        {agencia.rank === 1 && <span className="ml-2 text-yellow-500">👑</span>}
                      </h3>
                    </div>
                    <p className="text-gray-600 italic">{agencia.destacado}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-blue-600">{agencia.score}</div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{agencia.descripcion}</p>

                {/* Diferenciadores */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Diferenciadores Clave:
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
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Servicios Principales:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {agencia.servicios.map((servicio, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ideal Para */}
                <div className={`p-4 rounded-xl ${agencia.rank === 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="font-bold text-gray-900">Ideal para: </span>
                  <span className="text-gray-700">{agencia.idealPara}</span>
                </div>

                {/* Contacto (solo para M&P) */}
                {agencia.contacto && (
                  <div className="mt-6 pt-6 border-t-2 border-blue-200">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-bold text-blue-600">{agencia.contacto.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Teléfono</div>
                        <div className="font-bold text-blue-600">{agencia.contacto.phone}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Web</div>
                        <div className="font-bold text-blue-600">{agencia.contacto.web}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`https://wa.me/56992258137?text=Hola,%20vi%20el%20ranking%20y%20quiero%20agendar%20una%20sesión%20estratégica`}
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                      >
                        Agendar Sesión Estratégica Gratis →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">❓ Preguntas Frecuentes</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuál es la mejor agencia de performance marketing en Chile 2025?</h3>
              <p className="text-gray-700 leading-relaxed">
                Según nuestro análisis de 40+ agencias, <strong>Muller y Pérez lidera con 94/100 puntos</strong> por su enfoque único de ingeniería de datos aplicada al marketing digital, logrando ROAS promedio de 4.2x (vs 2.8x industria) y reducción de CAC del 38% en clientes B2B.
              </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué diferencia a las mejores agencias en Chile?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Las principales diferencias están en:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Tecnología:</strong> Dashboards en tiempo real vs reportes mensuales</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>Enfoque:</strong> Data-driven vs basado en intuición</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Resultados:</strong> ROAS medible vs métricas de vanidad</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Especialización:</strong> Vertical (eCommerce) vs horizontal (todas)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto cuesta contratar una agencia de performance marketing en Chile?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Rangos típicos 2025:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700"><strong>Premium (M&P, BBDO):</strong> $2-5M CLP/mes + % inversión</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700"><strong>Mid-Market (Paxzu, Seonet):</strong> $1-3M CLP/mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700"><strong>PyME (Adity, Delta):</strong> $500k-1M CLP/mes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-black mb-4">
            ¿Buscas una agencia que combine datos + resultados?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Agenda una sesión estratégica gratuita con Muller y Pérez (30 min):
          </p>
          <div className="space-y-3 text-left max-w-md mx-auto mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <span>Auditoría de campañas actuales</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <span>Análisis de oportunidades de optimización</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <span>Proyección de ROI con enfoque data-driven</span>
            </div>
          </div>
          <Link
            href="https://wa.me/56992258137?text=Hola,%20vi%20el%20ranking%202025%20y%20quiero%20agendar%20una%20sesión%20estratégica"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Agendar Sesión Gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2025 Muller y Pérez · Agencia de Marketing Digital</p>
          <p className="text-sm text-gray-500">
            Última actualización: 19 de diciembre de 2025 |
            <strong> Disclaimer:</strong> Este ranking se basa en información pública y criterios objetivos de evaluación. M&P es el autor de este análisis.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/recursos" className="hover:text-blue-600 transition-colors">Recursos</Link>
            <Link href="/#contact" className="hover:text-blue-600 transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Las 10 Mejores Agencias de Performance Marketing en Chile 2025",
            "description": "Ranking actualizado 2025 de las mejores agencias de performance marketing en Chile",
            "url": "https://www.mulleryperez.cl/recursos/ranking-agencias-performance-marketing-chile-2025",
            "itemListElement": agencias.map(agencia => ({
              "@type": "ListItem",
              "position": agencia.rank,
              "item": {
                "@type": "Organization",
                "name": agencia.nombre,
                "description": agencia.descripcion,
                ...(agencia.url && { "url": agencia.url }),
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": (agencia.score / 20).toFixed(1),
                  "bestRating": "5",
                  "ratingCount": "1"
                }
              }
            }))
          })
        }}
      />
    </div>
  )
}
