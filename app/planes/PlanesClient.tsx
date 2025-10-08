'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, X, ArrowLeft, Zap, Star, Crown, Rocket, Target, MessageSquare } from 'lucide-react'

const planes = [
  {
    id: 'campanas',
    nombre: 'Plan Campañas',
    precio: '490.000',
    descripcion: 'Ideal para empresas que quieren empezar con Paid Media',
    icon: Target,
    color: 'blue',
    popular: false,
    incluye: [
      'Hasta 2 campañas mensuales',
      'Máximo 6 gráficas en total',
      'Google Ads, Meta, LinkedIn & TikTok',
      'Monitoreo y ajustes según KPIs',
      'Equipo: Paid Media & Diseño',
      'Diagnóstico inicial de marca',
      'Análisis de palabras clave',
      'Benchmarking competitivo',
      'Proyección a 3 meses',
      'Reuniones mensuales'
    ],
    noIncluye: [
      'Contenidos orgánicos',
      'Grabación audiovisual',
      'Email marketing',
      'Gestión de influencers'
    ]
  },
  {
    id: 'contenidos',
    nombre: 'Plan Contenidos',
    precio: '650.000',
    descripcion: 'Perfecto para construir presencia orgánica en redes',
    icon: MessageSquare,
    color: 'purple',
    popular: false,
    incluye: [
      '20 contenidos orgánicos mensuales',
      '8 Posts/Carruseles + 8 Stories + 4 Reels',
      'Gestión de RRSS con derivación',
      'Media jornada de grabación mensual',
      '4 a 5 cápsulas audiovisuales',
      'Equipo: Publicidad & Diseño',
      'Diagnóstico inicial de marca',
      'Benchmarking',
      'Estrategias comunicacionales',
      'Reuniones quincenales'
    ],
    noIncluye: [
      'Campañas pagadas',
      'Google Ads / Meta Ads',
      'Email marketing',
      'Gestión de influencers'
    ]
  },
  {
    id: 'silver',
    nombre: 'Plan Silver',
    precio: '750.000',
    descripcion: 'Combina Paid Media + Contenidos orgánicos',
    icon: Zap,
    color: 'cyan',
    popular: true,
    incluye: [
      'Hasta 2 campañas mensuales + 6 gráficas',
      '20 contenidos orgánicos (8+8+4)',
      'Google Ads, Meta, LinkedIn & TikTok',
      'Gestión completa de RRSS',
      'Media jornada grabación mensual',
      'Monitoreo y ajustes KPIs',
      'Equipo completo: Paid Media, Publicidad & Diseño',
      'Diagnóstico + Benchmarking',
      'Proyección a 3 meses',
      'Reuniones mensuales'
    ],
    noIncluye: [
      'Email marketing',
      'Gestión de influencers',
      'Más de 2 campañas/mes'
    ]
  },
  {
    id: 'gold',
    nombre: 'Plan Gold',
    precio: '1.200.000',
    descripcion: 'Estrategia completa con email marketing',
    icon: Star,
    color: 'yellow',
    popular: false,
    incluye: [
      'Hasta 4 campañas mensuales + 6 gráficas',
      '28 contenidos orgánicos (16+8+4)',
      'Google Ads, Meta, LinkedIn & TikTok',
      'Gestión completa de RRSS',
      'Media jornada grabación mensual',
      '2 campañas de email marketing',
      'Monitoreo avanzado de KPIs',
      'Equipo completo dedicado',
      'Diagnóstico + Benchmarking',
      'Reuniones quincenales'
    ],
    noIncluye: [
      'Gestión de influencers',
      'Más de 4 campañas/mes'
    ]
  },
  {
    id: 'platinum',
    nombre: 'Plan Platinum',
    precio: '1.900.000',
    descripcion: 'Máximo rendimiento con gestión de influencers',
    icon: Crown,
    color: 'gradient',
    popular: false,
    incluye: [
      'Hasta 6 campañas mensuales + 10 gráficas',
      '44 contenidos orgánicos (28+8+8)',
      'Google Ads, Meta, LinkedIn & TikTok',
      'Jornada completa de grabación mensual',
      '8 a 10 cápsulas audiovisuales',
      '4 campañas de email marketing',
      'Gestión de influencers',
      'Equipo completo premium',
      'Diagnóstico + Benchmarking avanzado',
      'Reuniones quincenales',
      'Soporte prioritario'
    ],
    noIncluye: []
  }
]

export default function PlanesClient() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const getColorClasses = (color: string, type: 'bg' | 'border' | 'text' | 'hover') => {
    const colors: any = {
      blue: {
        bg: 'bg-blue-600',
        border: 'border-blue-600',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-600',
        border: 'border-purple-600',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-700'
      },
      cyan: {
        bg: 'bg-cyan-600',
        border: 'border-cyan-600',
        text: 'text-cyan-600',
        hover: 'hover:bg-cyan-700'
      },
      yellow: {
        bg: 'bg-yellow-600',
        border: 'border-yellow-600',
        text: 'text-yellow-600',
        hover: 'hover:bg-yellow-700'
      },
      gradient: {
        bg: 'bg-gradient-to-r from-purple-600 to-blue-600',
        border: 'border-purple-600',
        text: 'text-purple-600',
        hover: 'hover:from-purple-700 hover:to-blue-700'
      }
    }
    return colors[color][type]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            🎯 Elige el Plan que Impulse tu Crecimiento
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Planes de Marketing Digital<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Diseñados para Resultados
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Desde Paid Media focalizado hasta estrategias completas con influencers. <br />
            Todos incluyen diagnóstico inicial, benchmarking y equipo dedicado.
          </p>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Planes Disponibles</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">+40</div>
              <div className="text-sm text-gray-600">Clientes Activos</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">3 meses</div>
              <div className="text-sm text-gray-600">Compromiso Mínimo</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Monitoreo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planes.map((plan) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                    plan.popular ? 'ring-4 ring-cyan-500 scale-105' : 'hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-xl">
                      ⭐ MÁS POPULAR
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl ${getColorClasses(plan.color, 'bg')} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Título y Descripción */}
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.nombre}</h3>
                    <p className="text-gray-600 mb-6">{plan.descripcion}</p>

                    {/* Precio */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900">${plan.precio}</span>
                        <span className="text-gray-500">+ IVA</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">por mes</p>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={`https://wa.me/56992258137?text=Hola%20M%26P%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20${encodeURIComponent(plan.nombre)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center ${getColorClasses(plan.color, 'bg')} ${getColorClasses(plan.color, 'hover')} text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg mb-6`}
                    >
                      Solicitar Información
                    </a>

                    {/* Lo que incluye */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-bold text-gray-900 mb-4">✅ Lo que incluye:</h4>
                      <ul className="space-y-3">
                        {plan.incluye.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 ${getColorClasses(plan.color, 'text')} flex-shrink-0 mt-0.5`} />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.noIncluye.length > 0 && (
                        <>
                          <h4 className="font-bold text-gray-900 mb-4 mt-6">❌ No incluye:</h4>
                          <ul className="space-y-3">
                            {plan.noIncluye.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-500">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparativa */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Comparativa de Planes
            </h2>
            <p className="text-lg text-gray-600">
              Encuentra el balance perfecto entre servicios y presupuesto
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Característica</th>
                  <th className="px-6 py-4 text-center font-bold">Campañas</th>
                  <th className="px-6 py-4 text-center font-bold">Contenidos</th>
                  <th className="px-6 py-4 text-center font-bold bg-cyan-600">Silver ⭐</th>
                  <th className="px-6 py-4 text-center font-bold">Gold</th>
                  <th className="px-6 py-4 text-center font-bold">Platinum</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Campañas Mensuales</td>
                  <td className="px-6 py-4 text-center">Hasta 2</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center bg-cyan-50">Hasta 2</td>
                  <td className="px-6 py-4 text-center">Hasta 4</td>
                  <td className="px-6 py-4 text-center">Hasta 6</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Contenidos Orgánicos</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center">20/mes</td>
                  <td className="px-6 py-4 text-center bg-cyan-50">20/mes</td>
                  <td className="px-6 py-4 text-center">28/mes</td>
                  <td className="px-6 py-4 text-center">44/mes</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Grabación Audiovisual</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center">1/2 jornada</td>
                  <td className="px-6 py-4 text-center bg-cyan-50">1/2 jornada</td>
                  <td className="px-6 py-4 text-center">1/2 jornada</td>
                  <td className="px-6 py-4 text-center">Jornada completa</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Email Marketing</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center text-gray-400 bg-cyan-50">-</td>
                  <td className="px-6 py-4 text-center">2 campañas</td>
                  <td className="px-6 py-4 text-center">4 campañas</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold">Gestión Influencers</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center text-gray-400 bg-cyan-50">-</td>
                  <td className="px-6 py-4 text-center text-gray-400">-</td>
                  <td className="px-6 py-4 text-center text-green-600 font-bold">✓</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 font-bold">Precio Mensual</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">$490K</td>
                  <td className="px-6 py-4 text-center font-bold text-purple-600">$650K</td>
                  <td className="px-6 py-4 text-center font-bold text-cyan-600 bg-cyan-100">$750K</td>
                  <td className="px-6 py-4 text-center font-bold text-yellow-600">$1.2M</td>
                  <td className="px-6 py-4 text-center font-bold text-purple-600">$1.9M</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            * Todos los precios son + IVA. Compromiso mínimo 3 meses.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Rocket className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              ¿No estás seguro cuál elegir?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Agenda una reunión de 30 minutos y te ayudamos a encontrar el plan perfecto para tus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/56992258137?text=Hola%20M%26P%2C%20quiero%20ayuda%20para%20elegir%20el%20mejor%20plan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Hablar por WhatsApp
              </a>
              <button
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
              >
                Agendar Reunión
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
