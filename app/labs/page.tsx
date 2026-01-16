'use client'

/**
 * M&P Labs - Herramientas avanzadas de marketing digital
 * Diseño consistente con www.mulleryperez.cl
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  TrendingUp,
  Radar,
  Database,
  Calculator,
  Scale,
  Users,
  ArrowRight,
  Beaker,
  Zap,
  PenTool,
  Search
} from 'lucide-react'

export default function MPLabs() {
  const herramientas = [
    {
      nombre: 'Predictor Google Ads',
      descripcion: 'Calcula cuántas conversiones y revenue generarás con Google Ads. Incluye benchmarks reales de Chile por industria.',
      icono: TrendingUp,
      url: '/labs/predictor',
      tag: 'Popular',
      tagColor: 'bg-blue-600',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      nombre: 'Calculadora ROI',
      descripcion: 'Calcula cuánto invertir para alcanzar tu objetivo de ventas. Escenarios optimista, realista y pesimista.',
      icono: Calculator,
      url: '/labs/calculadora-roi',
      tag: 'Nuevo',
      tagColor: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      nombre: 'Comparador Plataformas',
      descripcion: 'Compara Google Ads vs Meta Ads vs LinkedIn Ads para tu industria. Descubre qué plataforma te conviene.',
      icono: Scale,
      url: '/labs/comparador-plataformas',
      tag: 'Nuevo',
      tagColor: 'bg-emerald-500',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      nombre: 'Generador de Copies',
      descripcion: 'Genera headlines, descripciones y textos para Google Ads, Meta, TikTok y LinkedIn en segundos.',
      icono: PenTool,
      url: '/labs/generador-copies',
      tag: 'Nuevo',
      tagColor: 'bg-emerald-500',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      nombre: 'Buyer Gen',
      descripcion: 'Genera perfiles de buyer personas basados en data intelligence y comportamiento de compra.',
      icono: Users,
      url: '/labs/buyer-gen',
      tag: 'IA',
      tagColor: 'bg-purple-600',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      nombre: 'Radar Industrias',
      descripcion: 'Análisis de madurez digital por industria en Chile. Identifica oportunidades de mercado.',
      icono: Radar,
      url: '/labs/radar-industrias',
      tag: 'Beta',
      tagColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-amber-600'
    },
    {
      nombre: 'M&P Intelligence',
      descripcion: 'Red colaborativa de benchmarks. Comparte métricas anónimas y recibe datos reales de tu industria.',
      icono: Database,
      url: '/labs/mp-intelligence',
      tag: 'Beta',
      tagColor: 'bg-orange-500',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      nombre: 'Auditoría SEO',
      descripcion: 'Analiza cualquier sitio web gratis. Revisa meta tags, headings, imágenes, velocidad y schema markup.',
      icono: Search,
      url: '/labs/auditoria-seo',
      tag: 'Nuevo',
      tagColor: 'bg-emerald-500',
      gradient: 'from-green-500 to-emerald-600'
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
              href="/utilidades"
              className="hidden md:block text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Utilidades
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
            <Beaker className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">M&P Labs</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Herramientas Avanzadas de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Marketing Digital
            </span>
          </h1>

          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-8">
            Predictores, comparadores y herramientas con IA para tomar mejores decisiones de inversión publicitaria
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-blue-300">
              <Zap className="w-4 h-4" />
              <span>Datos reales de Chile</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Sparkles className="w-4 h-4" />
              <span>22 industrias</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <TrendingUp className="w-4 h-4" />
              <span>Benchmarks 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid - Fondo blanco */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {herramientas.map((tool, idx) => {
              const IconComponent = tool.icono
              return (
                <Link
                  key={idx}
                  href={tool.url}
                  className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  {/* Tag */}
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 ${tool.tagColor} text-white text-xs font-bold rounded-full`}>
                      {tool.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {tool.nombre}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {tool.descripcion}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Usar herramienta</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ¿Necesitas ayuda profesional?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestro equipo puede analizar tu caso específico y crear una estrategia personalizada basada en datos reales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-300"
            >
              Agendar reunión gratis
            </Link>
            <Link
              href="/utilidades"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold rounded-lg transition-all duration-300"
            >
              Ver calculadoras simples
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Muller y Pérez · M&P Labs</p>
          <div className="flex gap-6 text-sm">
            <Link href="/utilidades" className="text-gray-500 hover:text-blue-600 transition-colors">
              Utilidades
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
