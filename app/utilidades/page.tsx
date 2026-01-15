'use client'

/**
 * Utilidades M&P - Calculadoras y herramientas prácticas
 * Diseño consistente con www.mulleryperez.cl
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calculator,
  Gauge,
  GitBranch,
  Gamepad2,
  BookOpen,
  TrendingUp,
  Users,
  ArrowRight,
  Wrench,
  Download
} from 'lucide-react'

export default function Utilidades() {
  const destacado = {
    nombre: 'Ebook: Marketing de Datos 2025',
    descripcion: 'Descarga gratis la guía definitiva del marketing basado en datos e IA. 50+ páginas con estrategias, frameworks y casos reales.',
    icono: BookOpen,
    url: '/recursos/ebook-marketing-datos-2025',
    gradient: 'from-violet-600 to-fuchsia-600'
  }

  const calculadoras = [
    {
      nombre: 'Calculadora de CAC',
      descripcion: 'Calcula tu Costo de Adquisición de Cliente por canal de forma precisa.',
      icono: Calculator,
      url: '/utilidades/calculadora-cac',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      nombre: 'Calculadora ROI / ROAS',
      descripcion: 'Mide la rentabilidad real de tus campañas publicitarias.',
      icono: TrendingUp,
      url: '/utilidades/calculadora-roi-roas',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      nombre: 'Calculadora LTV',
      descripcion: 'Calcula el valor de vida de tus clientes y proyecta ingresos futuros.',
      icono: Users,
      url: '/utilidades/calculadora-ltv',
      gradient: 'from-purple-500 to-indigo-600'
    }
  ]

  const herramientas = [
    {
      nombre: 'Comparador de Velocidad Web',
      descripcion: 'Compara la velocidad de tu sitio contra la competencia con Core Web Vitals.',
      icono: Gauge,
      url: '/utilidades/comparador-web',
      gradient: 'from-orange-500 to-amber-600'
    },
    {
      nombre: 'Generador de Funnels CRM',
      descripcion: 'Crea funnels de venta personalizados para tu sistema CRM.',
      icono: GitBranch,
      url: '/utilidades/generador-funnels',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      nombre: 'Juega y Aprende con M&P',
      descripcion: 'Simulador interactivo de estrategias de marketing digital.',
      icono: Gamepad2,
      url: '/utilidades/juega-aprende',
      gradient: 'from-indigo-500 to-blue-600'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Consistente con home */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo-color.png"
              alt="Muller y Pérez"
              width={140}
              height={45}
              className="h-11 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/labs"
              className="hidden md:block text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              M&P Labs
            </Link>
            <Link
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Estilo consistente con home */}
      <section className="pt-36 pb-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Utilidades M&P</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Calculadoras y Herramientas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Prácticas
            </span>
          </h1>

          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-8">
            Herramientas simples para calcular métricas clave de tu negocio digital
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-blue-300">
              <Calculator className="w-4 h-4" />
              <span>CAC, LTV, ROI</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Gauge className="w-4 h-4" />
              <span>Core Web Vitals</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Download className="w-4 h-4" />
              <span>Recursos gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ebook Destacado */}
      <section className="py-12 px-6 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100">
        <div className="max-w-5xl mx-auto">
          <Link
            href={destacado.url}
            className="group flex flex-col md:flex-row items-center gap-8 p-8 bg-white rounded-2xl border border-violet-200 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
          >
            <div className={`w-20 h-20 bg-gradient-to-br ${destacado.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full">
                <Download className="w-3 h-3" />
                GRATIS
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                {destacado.nombre}
              </h2>
              <p className="text-gray-600">
                {destacado.descripcion}
              </p>
            </div>
            <div className="flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all duration-300">
              <span>Descargar</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Calculadoras */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadoras de Métricas</h2>
            <p className="text-gray-600">Calcula las métricas más importantes de tu negocio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {calculadoras.map((tool, idx) => {
              const IconComponent = tool.icono
              return (
                <Link
                  key={idx}
                  href={tool.url}
                  className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.descripcion}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Calcular</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Otras Herramientas */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Otras Herramientas</h2>
            <p className="text-gray-600">Herramientas adicionales para optimizar tu estrategia</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {herramientas.map((tool, idx) => {
              const IconComponent = tool.icono
              return (
                <Link
                  key={idx}
                  href={tool.url}
                  className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.descripcion}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Usar</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ¿Buscas herramientas más avanzadas?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Visita M&P Labs para acceder a predictores, comparadores y herramientas con IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/labs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-300"
            >
              Ir a M&P Labs
            </Link>
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold rounded-lg transition-all duration-300"
            >
              Hablar con un experto
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Muller y Pérez · Utilidades</p>
          <div className="flex gap-6 text-sm">
            <Link href="/labs" className="text-gray-500 hover:text-blue-600 transition-colors">
              M&P Labs
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
