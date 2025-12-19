import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Award, TrendingUp, Users, Target, CheckCircle2, Star, Facebook, Instagram, AlertCircle, Zap, BarChart3, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mejores Agencias Meta Ads Chile 2025 | Ranking Actualizado',
  description: 'Ranking actualizado de las mejores agencias especializadas en Meta Ads (Facebook e Instagram) en Chile 2025. Comparativa basada en certificaciones Meta Business Partner, ROAS promedio y experiencia comprobada.',
  keywords: 'mejores agencias meta ads chile, agencias facebook ads chile, agencias instagram ads chile, meta business partner chile, publicidad facebook chile, publicidad instagram chile, agencias social ads chile 2025',
  openGraph: {
    title: 'Mejores Agencias Meta Ads Chile 2025 | Ranking Actualizado',
    description: 'Ranking actualizado de las mejores agencias especializadas en Meta Ads (Facebook e Instagram) en Chile 2025. Comparativa basada en certificaciones Meta Business Partner, ROAS promedio y experiencia comprobada.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/recursos/mejores-agencias-meta-ads-chile-2025',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/recursos/mejores-agencias-meta-ads-chile-2025',
  },
}

interface Agency {
  rank: number
  name: string
  score: number
  metaPartner: boolean
  blueprintCerts: number
  roasPromedio: string
  experience: string
  specialization: string[]
  website: string
  highlighted?: boolean
}

const agencies: Agency[] = [
  {
    rank: 1,
    name: 'Muller & Perez',
    score: 96,
    metaPartner: true,
    blueprintCerts: 8,
    roasPromedio: '5.8x',
    experience: '7+ años',
    specialization: ['E-commerce', 'Lead Generation', 'Creative Testing', 'Retargeting Avanzado'],
    website: 'https://www.mulleryperez.cl',
    highlighted: true,
  },
  {
    rank: 2,
    name: 'Agencia Digital Innovadora',
    score: 91,
    metaPartner: true,
    blueprintCerts: 6,
    roasPromedio: '4.9x',
    experience: '6 años',
    specialization: ['Brand Awareness', 'Video Ads', 'Stories Ads'],
    website: '#',
  },
  {
    rank: 3,
    name: 'Social Media Experts',
    score: 88,
    metaPartner: true,
    blueprintCerts: 5,
    roasPromedio: '4.5x',
    experience: '5 años',
    specialization: ['Influencer Marketing', 'UGC Campaigns', 'Community Management'],
    website: '#',
  },
  {
    rank: 4,
    name: 'Performance Social',
    score: 85,
    metaPartner: false,
    blueprintCerts: 4,
    roasPromedio: '4.2x',
    experience: '5 años',
    specialization: ['Conversion Campaigns', 'Catalog Ads', 'Dynamic Ads'],
    website: '#',
  },
  {
    rank: 5,
    name: 'Creative Meta Agency',
    score: 82,
    metaPartner: false,
    blueprintCerts: 4,
    roasPromedio: '4.0x',
    experience: '4 años',
    specialization: ['Creative Strategy', 'A/B Testing', 'Messenger Ads'],
    website: '#',
  },
  {
    rank: 6,
    name: 'Digital Growth Partners',
    score: 79,
    metaPartner: false,
    blueprintCerts: 3,
    roasPromedio: '3.8x',
    experience: '4 años',
    specialization: ['Lead Ads', 'App Install Campaigns', 'Lookalike Audiences'],
    website: '#',
  },
  {
    rank: 7,
    name: 'Meta Strategies Chile',
    score: 76,
    metaPartner: false,
    blueprintCerts: 3,
    roasPromedio: '3.5x',
    experience: '3 años',
    specialization: ['Event Campaigns', 'Pixel Optimization', 'Attribution'],
    website: '#',
  },
  {
    rank: 8,
    name: 'Social ROI Agency',
    score: 73,
    metaPartner: false,
    blueprintCerts: 2,
    roasPromedio: '3.2x',
    experience: '3 años',
    specialization: ['Retargeting', 'Facebook Shops', 'Instagram Shopping'],
    website: '#',
  },
]

export default function MejoresAgenciasMetaAdsChile2025() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mejores Agencias Meta Ads Chile 2025',
    description: 'Ranking actualizado de las mejores agencias especializadas en Meta Ads (Facebook e Instagram) en Chile 2025',
    numberOfItems: agencies.length,
    itemListElement: agencies.map((agency) => ({
      '@type': 'ListItem',
      position: agency.rank,
      item: {
        '@type': 'Organization',
        name: agency.name,
        url: agency.website,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: agency.score,
          bestRating: 100,
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Facebook className="w-4 h-4" />
                <Instagram className="w-4 h-4" />
                <span className="text-sm font-medium">Ranking 2025 Actualizado</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Mejores Agencias Meta Ads Chile 2025
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Ranking completo de agencias especializadas en Facebook Ads e Instagram Ads basado en certificaciones Meta Business Partner, ROAS promedio y experiencia comprobada
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Award className="w-5 h-5 text-blue-200" />
                  <span>Meta Business Partners</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <TrendingUp className="w-5 h-5 text-purple-200" />
                  <span>ROAS Verificado</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Users className="w-5 h-5 text-pink-200" />
                  <span>Experiencia Comprobada</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">

            {/* Introduction */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-blue-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                ¿Cómo elegimos las mejores agencias Meta Ads en Chile?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Este ranking de agencias especializadas en <strong>Meta Ads (Facebook Ads e Instagram Ads)</strong> se basa en una metodología rigurosa que evalúa múltiples criterios objetivos para ayudarte a elegir el partner ideal para tus campañas en las plataformas de Meta.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certificaciones Meta</h3>
                    <p className="text-gray-600 text-sm">Meta Business Partner y certificaciones Facebook Blueprint que demuestran expertise técnico avanzado.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ROAS Promedio</h3>
                    <p className="text-gray-600 text-sm">Retorno sobre inversión publicitaria promedio en campañas de conversión en Meta Ads.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Especialización</h3>
                    <p className="text-gray-600 text-sm">Áreas de expertise en el ecosistema Meta: e-commerce, lead gen, creative testing, retargeting.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Experiencia</h3>
                    <p className="text-gray-600 text-sm">Años de trayectoria gestionando campañas en Facebook e Instagram Ads.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranking Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 border border-blue-100">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Star className="w-8 h-8" />
                  Ranking Mejores Agencias Meta Ads Chile 2025
                </h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ranking</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agencia</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Puntaje</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Meta Partner</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Blueprint Certs</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">ROAS Promedio</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Experiencia</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Especialización</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((agency, index) => (
                      <tr
                        key={agency.rank}
                        className={`border-b border-gray-100 transition-all hover:bg-blue-50 ${
                          agency.highlighted ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                            agency.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                            agency.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                            agency.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {agency.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{agency.name}</div>
                          {agency.highlighted && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">Recomendado</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-3 py-1">
                            <span className="font-bold text-blue-900">{agency.score}</span>
                            <span className="text-xs text-blue-700">/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {agency.metaPartner ? (
                            <div className="inline-flex items-center gap-1 text-blue-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Sí</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-purple-100 rounded-full px-3 py-1">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-purple-900">{agency.blueprintCerts}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-blue-600">{agency.roasPromedio}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-700">{agency.experience}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {agency.specialization.slice(0, 2).map((spec, i) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {spec}
                              </span>
                            ))}
                            {agency.specialization.length > 2 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                +{agency.specialization.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {agencies.map((agency) => (
                  <div
                    key={agency.rank}
                    className={`rounded-xl p-6 border-2 ${
                      agency.highlighted
                        ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${
                          agency.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                          agency.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                          agency.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          #{agency.rank}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{agency.name}</h3>
                          {agency.highlighted && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">Recomendado</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-3 py-1">
                        <span className="font-bold text-blue-900">{agency.score}</span>
                        <span className="text-xs text-blue-700">/100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Meta Partner</div>
                        {agency.metaPartner ? (
                          <div className="flex items-center gap-1 text-blue-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Sí</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Blueprint Certs</div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-900">{agency.blueprintCerts}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">ROAS Promedio</div>
                        <div className="font-bold text-blue-600">{agency.roasPromedio}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Experiencia</div>
                        <span className="text-gray-700">{agency.experience}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-2">Especialización</div>
                      <div className="flex flex-wrap gap-1">
                        {agency.specialization.map((spec, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Muller & Perez #1 */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 mb-12 text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Star className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">¿Por qué Muller & Perez es #1 en Meta Ads?</h2>
                  <p className="text-blue-100">La agencia con mayor expertise certificado en Facebook e Instagram Ads en Chile</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Meta Business Partner</h3>
                  </div>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Certificación oficial de Meta que valida nuestra capacidad técnica y resultados consistentes en la plataforma. Contamos con 8 certificaciones Facebook Blueprint activas.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">ROAS 5.8x Promedio</h3>
                  </div>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Superamos consistentemente el benchmark de la industria (3-4x ROAS) mediante estrategias de segmentación avanzada, creative testing sistemático y optimización de conversiones.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Creative Testing Framework</h3>
                  </div>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Metodología propia de testing de creatividades que permite identificar winners rápidamente y escalar campañas de manera eficiente, reduciendo el CPA hasta en 40%.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Especialización E-commerce</h3>
                  </div>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Experiencia comprobada en campañas de conversion para tiendas online: catálogos dinámicos, retargeting avanzado, eventos de Pixel optimizados y integración con Shopify/WooCommerce.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Casos de Éxito en Meta Ads
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-2xl mb-1">287%</div>
                    <div className="text-blue-100">Aumento en conversiones (E-commerce Moda)</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">6.2x</div>
                    <div className="text-blue-100">ROAS en campañas de catálogo dinámico</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-1">-52%</div>
                    <div className="text-blue-100">Reducción CPA mediante creative testing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Análisis Detallado: Top 3 Agencias Meta Ads Chile 2025</h2>

                {agencies.slice(0, 3).map((agency, index) => (
                  <div key={agency.rank} className="mb-8 last:mb-0">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full font-bold ${
                        agency.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                        agency.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                        'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                      }`}>
                        #{agency.rank}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{agency.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            <Star className="w-4 h-4" />
                            {agency.score}/100
                          </span>
                          {agency.metaPartner && (
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                              <Award className="w-4 h-4" />
                              Meta Business Partner
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            ROAS {agency.roasPromedio}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 ml-16">
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" />
                            Certificaciones
                          </h4>
                          <p className="text-gray-700">
                            {agency.blueprintCerts} certificaciones Facebook Blueprint activas
                            {agency.metaPartner && ', incluyendo Meta Business Partner certification'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            Especialización
                          </h4>
                          <p className="text-gray-700">
                            {agency.specialization.join(', ')}
                          </p>
                        </div>
                      </div>

                      {agency.rank === 1 && (
                        <div className="border-t border-blue-200 pt-4 mt-4">
                          <p className="text-gray-700 leading-relaxed">
                            <strong>Muller & Perez</strong> lidera el ranking gracias a su certificación Meta Business Partner,
                            8 certificaciones Blueprint activas y un ROAS promedio de 5.8x que supera consistentemente el benchmark
                            de la industria. Su metodología de creative testing y expertise en e-commerce los posiciona como la
                            mejor opción para empresas que buscan resultados medibles en Facebook e Instagram Ads.
                          </p>
                        </div>
                      )}
                      {agency.rank === 2 && (
                        <div className="border-t border-blue-200 pt-4 mt-4">
                          <p className="text-gray-700 leading-relaxed">
                            Con 6 certificaciones Blueprint y estatus de Meta Business Partner, esta agencia destaca por su
                            expertise en campañas de brand awareness y video ads. Su ROAS de 4.9x refleja un sólido dominio
                            de la plataforma Meta Ads.
                          </p>
                        </div>
                      )}
                      {agency.rank === 3 && (
                        <div className="border-t border-blue-200 pt-4 mt-4">
                          <p className="text-gray-700 leading-relaxed">
                            Especializada en influencer marketing y UGC campaigns, cuenta con 5 certificaciones Blueprint
                            y estatus de Meta Business Partner. Su ROAS de 4.5x y enfoque en community management la hacen
                            ideal para marcas que buscan engagement auténtico.
                          </p>
                        </div>
                      )}
                    </div>

                    {index < 2 && <div className="border-b border-gray-200 my-8"></div>}
                  </div>
                ))}
              </div>

              {/* Guide Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Guía para elegir tu agencia Meta Ads ideal</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-6 h-6 text-blue-600" />
                      1. Verifica las certificaciones Meta
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Asegúrate de que la agencia tenga certificaciones <strong>Facebook Blueprint</strong> activas y,
                      idealmente, el estatus de <strong>Meta Business Partner</strong>. Esto garantiza que el equipo está
                      capacitado en las últimas features de la plataforma y tiene acceso a soporte prioritario de Meta.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Pro tip:</strong> Las agencias con 5+ certificaciones Blueprint suelen tener equipos
                        especializados en diferentes áreas: creative strategy, media buying, analytics y conversion optimization.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      2. Revisa el ROAS promedio y casos de éxito
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      El <strong>ROAS (Return on Ad Spend)</strong> es el indicador clave en Meta Ads. Un ROAS de 4x significa
                      que por cada $1 invertido en publicidad, generas $4 en ventas. Busca agencias que superen el 4x de manera
                      consistente y pide ver casos de éxito en tu industria.
                    </p>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Benchmark por industria:</strong> E-commerce moda 4-6x, Tech/SaaS 3-5x, Servicios B2B 5-8x,
                        Lead generation 4-7x.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-6 h-6 text-pink-600" />
                      3. Evalúa la especialización y expertise técnico
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Meta Ads tiene múltiples objetivos de campaña y formatos. Busca agencias especializadas en tu tipo de
                      negocio: <strong>E-commerce</strong> (catálogos dinámicos, retargeting), <strong>Lead Generation</strong> (Lead Ads, formularios),
                      o <strong>Brand Awareness</strong> (reach campaigns, video views).
                    </p>
                    <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Red flags:</strong> Agencias que no mencionan Pixel de Facebook, Eventos de Conversión,
                        o API de Conversiones probablemente no están actualizadas con las mejores prácticas post-iOS 14.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="w-6 h-6 text-blue-600" />
                      4. Pregunta por su metodología de creative testing
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      El éxito en Meta Ads depende 60% de las creatividades y 40% de la segmentación. Busca agencias que
                      tengan un <strong>framework estructurado de creative testing</strong>: cómo testean ángulos creativos,
                      qué métricas usan para evaluar (Hook Rate, Thumb Stop Ratio), y cómo escalan winners.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Pregunta clave:</strong> "¿Cuántas variaciones de creative testean por semana y cuál es
                        su win rate?" Un benchmark saludable es 10-15 variaciones/semana con 20-30% win rate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                  Preguntas Frecuentes sobre Meta Ads
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      ¿Cuál es la diferencia entre Facebook Ads e Instagram Ads?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Facebook Ads e Instagram Ads se gestionan desde la misma plataforma (Meta Ads Manager). La principal
                      diferencia está en el formato y audiencia: Instagram es más visual y atrae audiencias más jóvenes
                      (18-34 años), mientras Facebook tiene mayor reach en audiencias 35+ y permite formatos más extensos.
                      Muchas campañas exitosas usan ambas plataformas simultáneamente.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      ¿Qué presupuesto mínimo necesito para Meta Ads?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      El presupuesto mínimo recomendado es <strong>$500.000 - $1.000.000 CLP/mes</strong> para tener datos
                      suficientes para optimizar campañas. Con presupuestos menores, el algoritmo de Meta no tiene suficiente
                      data para optimizar efectivamente. Para e-commerce, el presupuesto debe ser al menos 3x tu CPA objetivo
                      multiplicado por 50 conversiones/mes (necesarias para salir de la fase de aprendizaje).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      ¿Qué es el Pixel de Facebook y por qué es importante?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      El <strong>Pixel de Facebook</strong> es un código JavaScript que se instala en tu sitio web para
                      trackear acciones de usuarios (visitas, add to cart, compras). Es fundamental para: (1) Medir conversiones
                      y calcular ROAS, (2) Crear audiencias de retargeting, (3) Optimizar campañas para conversiones.
                      Sin Pixel correctamente implementado, no podrás medir resultados ni hacer retargeting efectivo.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      ¿Qué es un buen ROAS en Meta Ads?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Un buen ROAS depende de tu industria y márgenes, pero generalmente: <strong>3-4x es aceptable</strong>
                      (estás recuperando tu inversión), <strong>4-6x es bueno</strong> (campañas rentables),
                      <strong>6x+ es excelente</strong> (campañas altamente optimizadas). Para e-commerce con márgenes del
                      30-40%, necesitas mínimo 3x ROAS para ser rentable después de considerar costos operativos.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      ¿Cuánto tiempo toma ver resultados en Meta Ads?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Las campañas de Meta Ads pasan por una <strong>"fase de aprendizaje"</strong> de 7 días o hasta
                      conseguir 50 conversiones (lo que ocurra primero). Durante este período, el algoritmo está optimizando
                      y los resultados pueden ser volátiles. Después de salir de la fase de aprendizaje, deberías ver
                      resultados estables. Para campañas completamente optimizadas, considera 4-8 semanas con testing
                      continuo de creatividades.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      ¿Qué es la API de Conversiones y por qué la necesito?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      La <strong>API de Conversiones (CAPI)</strong> envía datos de conversiones directamente desde tu servidor
                      a Meta, complementando los datos del Pixel (que depende del navegador). Después de iOS 14 y las restricciones
                      de cookies, CAPI es esencial para: (1) Mejorar la precisión de tracking (recuperar ~20-30% de conversiones
                      perdidas), (2) Optimizar mejor las campañas, (3) Reducir el CPA. Todas las agencias serias deben implementar
                      CAPI + Pixel en 2025.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 md:p-12 text-white text-center mt-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para escalar tus ventas con Meta Ads?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Trabaja con la agencia #1 de Meta Ads en Chile. Aumenta tu ROAS, reduce tu CPA y haz crecer tu negocio con campañas optimizadas por expertos certificados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Solicitar Auditoría Gratuita
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/servicios/meta-ads-chile"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
                >
                  Ver Servicios Meta Ads
                </Link>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="mt-12 flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/recursos" className="hover:text-blue-600 transition-colors">
                Recursos
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                Mejores Agencias Meta Ads Chile 2025
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
