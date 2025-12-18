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
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50'
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
    gradient: 'from-pink-500 to-purple-600',
    bgGradient: 'from-pink-50 to-purple-50'
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
    gradient: 'from-green-500 to-teal-600',
    bgGradient: 'from-green-50 to-teal-50'
  }
]

export default function ServiciosPage() {
  const whatsappNumber = '+56992258137'
  const whatsappMessage = 'Hola M&P, quiero conocer más sobre sus servicios de marketing digital'
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Consistente con Home */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Servicios de Marketing Digital
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
                en Chile
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              Performance marketing con equipo dedicado, transparencia total y resultados medibles.
              <span className="block mt-2">Elige el servicio que necesitas o combínalos para máximo impacto.</span>
            </p>

            {/* CTAs - Consistente con Home */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos
              </a>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Agendar Reunión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios - Cards mejoradas */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluciones probadas para hacer crecer tu negocio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2"
              >
                {/* Header con gradiente */}
                <div className={`bg-gradient-to-br ${service.gradient} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/90 text-sm">{service.subtitle}</p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Precio */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Inversión</div>
                    <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Incluye:</div>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 text-base mt-0.5">✓</span>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/servicios/${service.slug}`}
                    className={`block w-full text-center px-6 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-lg hover:opacity-90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg`}
                  >
                    Ver Detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 bg-white">
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
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Equipo Dedicado
              </h3>
              <p className="text-gray-700 leading-relaxed">
                3 profesionales asignados exclusivamente a tu cuenta. No eres un cliente más.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🔓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Transparencia Total
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Acceso full a todas tus cuentas. Las cuentas son tuyas, nosotros solo las administramos.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Performance Real
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No vendemos "impresiones". Te decimos cuánto cuesta conseguir un cliente nuevo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Consistente con Home */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

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
                className="group px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos por WhatsApp
              </a>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl hover:scale-105"
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
