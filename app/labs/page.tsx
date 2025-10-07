'use client'

/**
 * M&P Labs - Herramientas experimentales e innovadoras
 * Hub central para todas las herramientas de laboratorio
 */

import React from 'react'
import Link from 'next/link'
import { Sparkles, TrendingUp, Gamepad2, Radar } from 'lucide-react'

export default function MPLabs() {
  const herramientas = [
    {
      nombre: 'Predictor Google Ads',
      descripcion: 'Calcula cuántas conversiones y revenue generarás con Google Ads en Chile',
      icono: TrendingUp,
      url: '/labs/predictor',
      tag: 'Popular',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      nombre: 'Buyer Gen',
      descripcion: 'Genera perfiles de buyer personas basados en data intelligence',
      icono: Sparkles,
      url: '/labs/buyer-gen',
      tag: 'Nuevo',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      nombre: 'Radar Industrias',
      descripcion: 'Análisis de madurez digital por industria en Chile 2024',
      icono: Radar,
      url: '/labs/radar-industrias',
      tag: 'Beta',
      color: 'from-orange-600 to-red-600'
    },
    {
      nombre: 'M&P Scan Digital',
      descripcion: 'Auditoría completa de tu presencia digital en segundos',
      icono: Gamepad2,
      url: '/labs/scan-digital',
      tag: 'Beta',
      color: 'from-emerald-600 to-teal-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl">
            ← Volver a M&P
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">M&P Labs</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Herramientas experimentales<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              para marketing digital
            </span>
          </h1>

          <p className="text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
            Experimenta con nuestras herramientas innovadoras diseñadas para optimizar tus campañas y estrategias de marketing
          </p>
        </div>
      </section>

      {/* Herramientas Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {herramientas.map((herramienta, idx) => {
              const IconComponent = herramienta.icono
              return (
                <Link
                  key={idx}
                  href={herramienta.url}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Tag */}
                  <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-400/30">
                      {herramienta.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${herramienta.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {herramienta.nombre}
                  </h3>
                  <p className="text-blue-200/80 leading-relaxed">
                    {herramienta.descripcion}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Probar ahora</span>
                    <span>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-blue-300 text-sm">
          <p>© 2024 Muller y Pérez · M&P Labs</p>
        </div>
      </footer>
    </div>
  )
}
