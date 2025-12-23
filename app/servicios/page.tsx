/**
 * Página Hub: Servicios de Marketing Digital
 * Central de todos los servicios de M&P
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Servicios de Marketing Digital | Google Ads, Meta Ads y Performance',
  description: 'Servicios de marketing digital en Chile: Google Ads, Meta Ads, LinkedIn Ads y Performance Marketing. Equipo dedicado y resultados medibles.',
  keywords: [
    'servicios marketing digital',
    'servicios marketing digital chile',
    'agencia google ads',
    'agencia meta ads',
    'performance marketing chile'
  ],
  path: '/servicios'
})

const services = [
  {
    slug: 'google-ads-chile',
    title: 'Google Ads',
    subtitle: 'Campañas de búsqueda de alto rendimiento',
    description: 'Aparece en los primeros resultados cuando tus clientes buscan tu servicio. Gestión profesional de Search, Shopping, Display y Performance Max.',
    icon: '🎯',
    features: [
      { label: 'Tipo de campaña', value: 'Search, Shopping, Display, PMax' },
      { label: 'Intención', value: 'Alta - Usuario busca activamente' },
      { label: 'Mejor para', value: 'Servicios B2B, eCommerce, leads calificados' },
      { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
    ],
    benefits: [
      'Resultados desde día 1',
      'Equipo certificado Google Partner',
      'Optimización basada en conversiones reales',
      'Reportería ejecutiva semanal'
    ]
  },
  {
    slug: 'meta-ads-chile',
    title: 'Meta Ads',
    subtitle: 'Facebook, Instagram y WhatsApp Ads',
    description: 'Campañas de alto impacto en redes sociales. Alcanza a tu audiencia donde pasan más tiempo con anuncios personalizados y remarketing inteligente.',
    icon: '📱',
    features: [
      { label: 'Plataformas', value: 'Facebook, Instagram, WhatsApp, Messenger' },
      { label: 'Segmentación', value: 'Intereses, comportamiento, lookalike' },
      { label: 'Mejor para', value: 'eCommerce, B2C, awareness y retargeting' },
      { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
    ],
    benefits: [
      'Targeting preciso por intereses y comportamiento',
      'Contenido visual de alto impacto',
      'Remarketing automatizado',
      'WhatsApp como canal directo de conversión'
    ]
  },
  {
    slug: 'seo-chile',
    title: 'SEO',
    subtitle: 'Posicionamiento web orgánico',
    description: 'Posiciona tu sitio en los primeros resultados de Google de forma orgánica. SEO técnico, contenido optimizado y link building para resultados sostenibles.',
    icon: '🔍',
    features: [
      { label: 'Servicios', value: 'SEO técnico, On-page, Off-page, Local' },
      { label: 'Resultados', value: 'Mediano-largo plazo, sostenibles' },
      { label: 'Mejor para', value: 'Empresas que buscan tráfico orgánico' },
      { label: 'Equipo asignado', value: 'Especialista SEO + Redactor + Analista' }
    ],
    benefits: [
      'Tráfico sostenible sin pagar por click',
      'Mayor autoridad y confianza de marca',
      'ROI creciente mes a mes',
      'Combinamos SEO + Paid Media para resultados rápidos'
    ]
  },
  {
    slug: 'facebook-ads-chile',
    title: 'Facebook Ads',
    subtitle: 'Publicidad en la red social más grande',
    description: 'Campañas de Facebook Ads optimizadas para conversión. Llega a millones de usuarios chilenos con segmentación avanzada y remarketing.',
    icon: '📘',
    features: [
      { label: 'Formatos', value: 'Feed, Stories, Reels, Marketplace' },
      { label: 'Segmentación', value: 'Demográfica, intereses, comportamiento' },
      { label: 'Mejor para', value: 'B2C, eCommerce, generación de leads' },
      { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
    ],
    benefits: [
      'Alcance masivo en Chile',
      'Segmentación detallada por intereses',
      'Remarketing a visitantes del sitio',
      'Integración con WhatsApp Business'
    ]
  },
  {
    slug: 'instagram-ads-chile',
    title: 'Instagram Ads',
    subtitle: 'Publicidad visual de alto impacto',
    description: 'Campañas de Instagram Ads con contenido visual atractivo. Stories, Reels y Feed optimizados para engagement y conversiones.',
    icon: '📸',
    features: [
      { label: 'Formatos', value: 'Feed, Stories, Reels, Explore' },
      { label: 'Audiencia', value: '18-45 años, alto engagement' },
      { label: 'Mejor para', value: 'Moda, lifestyle, eCommerce, servicios' },
      { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
    ],
    benefits: [
      'Contenido visual de alto impacto',
      'Audiencia altamente comprometida',
      'Shopping integrado para eCommerce',
      'Influencer marketing y colaboraciones'
    ]
  },
  {
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    subtitle: 'Estrategia completa basada en datos',
    description: 'Estrategia integral que combina Google Ads, Meta Ads, analítica avanzada y optimización continua. Máximo rendimiento de tu inversión publicitaria.',
    icon: '🚀',
    features: [
      { label: 'Alcance', value: 'Google + Meta + LinkedIn + TikTok' },
      { label: 'Metodología', value: 'Data-driven, test continuo, optimización' },
      { label: 'Mejor para', value: 'Empresas con presupuesto >$3M/mes' },
      { label: 'Equipo asignado', value: '3+ profesionales dedicados' }
    ],
    benefits: [
      'Estrategia multicanal integrada',
      'Analítica y atribución avanzada',
      'Benchmark de competencia mensual',
      'ROI y ROAS optimizados continuamente'
    ]
  }
]

export default function ServiciosPage() {
  const whatsappNumber = '+56992258137'
  const whatsappMessage = 'Hola M&P, quiero conocer más sobre sus servicios de marketing digital'
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Consistente con Home */}
      <section className="pt-36 pb-28 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-200 text-sm font-medium">Servicios de Marketing Digital</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Estrategias de Marketing Digital
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
                con Resultados Medibles
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-4xl mx-auto">
              Equipo dedicado de 3 profesionales. Transparencia total. Métricas de negocio real.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                Agendar Reunión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios - Clean List Design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elige el servicio que necesitas o combínalos para una estrategia integral
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.slug}
                className="border-b border-gray-200 pb-16 last:border-b-0"
              >
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Left: Service Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">{service.icon}</span>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Características técnicas */}
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-gray-500 text-sm font-semibold min-w-[120px]">{feature.label}:</span>
                          <span className="text-gray-700 text-sm">{feature.value}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/servicios/${service.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Ver detalles completos
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Right: Benefits */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Qué incluye:</h4>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-gray-700 mb-4">
                        ¿Quieres saber si {service.title} es para tu negocio?
                      </p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        Consultar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciadores - Simple & Clean */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegir a Muller y Pérez?
            </h2>
            <p className="text-xl text-gray-600">
              No somos otra agencia más que promete resultados mágicos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Equipo Dedicado
              </h3>
              <p className="text-gray-700 leading-relaxed">
                3 profesionales asignados exclusivamente a tu cuenta: Paid Media Planner, Publicista y Diseñador.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Transparencia Total
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Acceso 24/7 a tus cuentas publicitarias. Las cuentas son tuyas, nosotros solo las administramos.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Métricas Reales
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No vendemos "impresiones". Medimos CPL, CPA, CAC, ROAS - métricas que mueven el negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿No Estás Seguro Cuál Servicio Necesitas?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              Agenda una reunión gratuita de 30 minutos.
              <span className="block mt-2">Te ayudamos a diseñar la estrategia perfecta para tu negocio.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos por WhatsApp
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                Agendar Reunión Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
