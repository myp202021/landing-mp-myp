'use client'

/**
 * Utilidades M&P - Herramientas prácticas de marketing
 * Calculadoras y herramientas de análisis
 */

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, Gauge, GitBranch, Gamepad2 } from 'lucide-react'
import { createSoftwareAppSchema } from '@/lib/metadata'

export default function Utilidades() {
  useEffect(() => {
    document.title = 'Utilidades Marketing Digital - Calculadoras Gratis Chile | M&P'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Herramientas prácticas de marketing digital: calculadora CAC, comparador de velocidad web, generador de funnels CRM y simulador de estrategias. Gratis.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Herramientas prácticas de marketing digital: calculadora CAC, comparador de velocidad web, generador de funnels CRM y simulador de estrategias. Gratis.'
      document.head.appendChild(meta)
    }
  }, [])

  const utilidadesSchema = createSoftwareAppSchema(
    'Utilidades M&P - Herramientas de Marketing Digital',
    'Hub de herramientas prácticas para marketing digital: calculadora de CAC (costo de adquisición de cliente), comparador de velocidad web, generador de funnels para CRM y simulador de estrategias de marketing.',
    'https://www.mulleryperez.cl/utilidades'
  )

  const herramientas = [
    {
      nombre: 'Calculadora de CAC',
      descripcion: 'Calcula tu Costo de Adquisición de Cliente de forma precisa',
      icono: Calculator,
      url: '/utilidades/calculadora-cac',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      nombre: 'Comparador de Velocidad Web',
      descripcion: 'Compara la velocidad de tu sitio contra la competencia',
      icono: Gauge,
      url: '/utilidades/comparador-web',
      color: 'from-orange-600 to-amber-600'
    },
    {
      nombre: 'Generador de Funnels CRM',
      descripcion: 'Crea funnels personalizados para tu sistema CRM',
      icono: GitBranch,
      url: '/utilidades/generador-funnels',
      color: 'from-purple-600 to-pink-600'
    },
    {
      nombre: 'Juega y Aprende con M&P',
      descripcion: 'Simulador interactivo de estrategias de marketing digital',
      icono: Gamepad2,
      url: '/utilidades/juega-aprende',
      color: 'from-blue-600 to-indigo-600'
    }
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(utilidadesSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo-blanco.png" alt="M&P Logo" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <Link href="/" className="text-white font-semibold text-sm hover:text-purple-300 transition-colors">
            ← Volver
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-purple-500/20 border border-purple-400/30">
            <Calculator className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">Utilidades M&P</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Herramientas prácticas<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              para tu negocio digital
            </span>
          </h1>

          <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Calculadoras y herramientas de análisis para tomar mejores decisiones de marketing
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
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${herramienta.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {herramienta.nombre}
                  </h3>
                  <p className="text-purple-200 leading-relaxed">
                    {herramienta.descripcion}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-purple-300 font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Usar ahora</span>
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
        <div className="max-w-7xl mx-auto text-center text-purple-300 text-sm">
          <p>© 2024 Muller y Pérez · Utilidades</p>
        </div>
      </footer>
      </div>
    </>
  )
}
