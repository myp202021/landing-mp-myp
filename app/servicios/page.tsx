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
    price: 'Desde $990.000/mes',
    benefits: [
      'Intención de compra alta',
      'Resultados desde día 1',
      'Equipo certificado Google Partner',
      '100% medible y optimizable'
    ],
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    slug: 'meta-ads-chile',
    title: 'Meta Ads',
    subtitle: 'Facebook, Instagram y WhatsApp Ads',
    description: 'Campañas de alto impacto en redes sociales. Alcanza a tu audiencia donde pasan más tiempo con anuncios personalizados y remarketing inteligente.',
    icon: '📱',
    price: 'Desde $890.000/mes',
    benefits: [
      'Targeting preciso por intereses',
      'Contenido visual atractivo',
      'Remarketing automatizado',
      'WhatsApp como canal de conversión'
    ],
    gradient: 'from-pink-500 to-purple-600'
  },
  {
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    subtitle: 'Estrategia completa basada en datos',
    description: 'Estrategia integral que combina Google Ads, Meta Ads, analítica avanzada y optimización continua. Máximo rendimiento de tu inversión.',
    icon: '🚀',
    price: 'Desde $1.490.000/mes',
    benefits: [
      'Estrategia multicanal integrada',
      'Optimización basada en datos',
      'Equipo dedicado de 3+ personas',
      'ROI y ROAS optimizados'
    ],
    gradient: 'from-green-500 to-teal-600'
  }
]

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Servicios de Marketing Digital en Chile
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Soluciones completas de performance marketing con equipo dedicado, transparencia total
              y resultados medibles. Elige el servicio que necesitas o combínalos para máximo impacto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
              >
                Solicitar Cotización
              </Link>
              <Link
                href="/agencia-marketing-digital-chile"
                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold"
              >
                Conocer la Agencia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="grid md:grid-cols-1 gap-8">
          {services.map((service, index) => (
            <div
              key={service.slug}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Izquierda: Info */}
                <div className="p-8">
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${service.gradient} text-white mb-4`}>
                    <span className="text-2xl mr-2">{service.icon}</span>
                    <span className="font-semibold">{service.title}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.subtitle}
                  </h2>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Incluye:</div>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 text-lg">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-sm text-gray-600">Inversión</div>
                      <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                    </div>
                    <Link
                      href={`/servicios/${service.slug}`}
                      className={`px-6 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-lg hover:opacity-90 transition font-semibold`}
                    >
                      Ver Detalles →
                    </Link>
                  </div>
                </div>

                {/* Derecha: Visual */}
                <div className={`bg-gradient-to-br ${service.gradient} p-8 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-8xl mb-6">{service.icon}</div>
                    <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                    <p className="text-xl opacity-90">{service.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por Qué Elegir a Muller y Pérez?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Equipo Dedicado
              </h3>
              <p className="text-gray-700">
                3 profesionales asignados exclusivamente a tu cuenta. No eres un cliente más.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🔓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transparencia Total
              </h3>
              <p className="text-gray-700">
                Acceso full a todas tus cuentas. Las cuentas son tuyas, nosotros solo las administramos.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Performance Real
              </h3>
              <p className="text-gray-700">
                No vendemos "impresiones". Te decimos cuánto cuesta conseguir un cliente nuevo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿No Estás Seguro Cuál Servicio Necesitas?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Agenda una reunión gratuita de 30 minutos. Te ayudamos a diseñar la estrategia
            perfecta para tu negocio.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
          >
            Agendar Reunión Gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
