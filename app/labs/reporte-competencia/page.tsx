'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Mail, Zap } from 'lucide-react'

export default function ReporteCompetenciaPage() {
  const [email, setEmail] = useState('')
  const [industria, setIndustria] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Enviar a API de captura de leads
    console.log('Lead capturado:', { email, industria })
    setSubmitted(true)
  }

  // Datos mock para MVP (después vendrán de DB real)
  const tendencias = [
    { categoria: 'Inmobiliario', cambio: 47, adsActivos: 342, tendencia: 'alza' },
    { categoria: 'Seguros', cambio: 34, adsActivos: 218, tendencia: 'alza' },
    { categoria: 'Educación Online', cambio: 28, adsActivos: 156, tendencia: 'alza' },
    { categoria: 'SaaS & Tecnología', cambio: 12, adsActivos: 124, tendencia: 'alza' },
    { categoria: 'Retail', cambio: -23, adsActivos: 518, tendencia: 'baja' },
    { categoria: 'Salud & Medicina', cambio: -18, adsActivos: 89, tendencia: 'baja' },
  ]

  const topAlzas = tendencias.filter(t => t.tendencia === 'alza').slice(0, 4)
  const topBajas = tendencias.filter(t => t.tendencia === 'baja')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/labs">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Labs</span>
            </div>
          </Link>
          <Link href="/">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            BETA PÚBLICO
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Radar de Competencia
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Publicitaria Chile 2025
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Descubre qué categorías están en tendencia, cuántos anuncios lanzan tus competidores
            y qué formatos dominan el mercado publicitario chileno.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl max-w-3xl mx-auto text-left">
            <p className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Datos públicos de Meta Ad Library
            </p>
            <p className="text-gray-700 text-sm">
              Este radar muestra tendencias agregadas basadas en bibliotecas públicas de anuncios.
              No incluye gasto publicitario ni targeting exacto. Actualización semanal.
            </p>
          </div>
        </div>
      </section>

      {/* Bolsa de Tendencias */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            🔥 Bolsa de Tendencias - Esta Semana
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Top Alzas */}
            <div className="bg-white rounded-2xl border-2 border-green-200 p-8">
              <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                TOP ALZAS
              </h3>
              <div className="space-y-4">
                {topAlzas.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">{item.categoria}</p>
                      <p className="text-sm text-gray-600">{item.adsActivos} ads activos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">+{item.cambio}%</p>
                      <p className="text-xs text-gray-500">vs sem. anterior</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Bajas */}
            <div className="bg-white rounded-2xl border-2 border-red-200 p-8">
              <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                TOP BAJAS
              </h3>
              <div className="space-y-4">
                {topBajas.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">{item.categoria}</p>
                      <p className="text-sm text-gray-600">{item.adsActivos} ads activos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-red-600">{item.cambio}%</p>
                      <p className="text-xs text-gray-500">vs sem. anterior</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Generales */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
              <p className="text-5xl font-black mb-2">1,847</p>
              <p className="text-blue-100">Anuncios Activos</p>
              <p className="text-sm text-blue-200 mt-2">Chile, última semana</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-8 text-center text-white">
              <p className="text-5xl font-black mb-2">284</p>
              <p className="text-green-100">Nuevos Anunciantes</p>
              <p className="text-sm text-green-200 mt-2">Últimos 7 días</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
              <p className="text-5xl font-black mb-2">68%</p>
              <p className="text-orange-100">Formato Video</p>
              <p className="text-sm text-orange-200 mt-2">vs 32% imagen</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-10 lg:p-16 text-center text-white">
            {!submitted ? (
              <>
                <Mail className="w-16 h-16 mx-auto mb-6 text-blue-100" />
                <h2 className="text-3xl lg:text-4xl font-black mb-4">
                  ¿Quieres Saber Qué Hacen TUS Competidores?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Déjanos tu email y te enviamos un reporte personalizado con los anunciantes
                  más activos en tu industria.
                </p>

                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-xl text-gray-900 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  />
                  <select
                    value={industria}
                    onChange={(e) => setIndustria(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-xl text-gray-900 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <option value="">Selecciona tu industria</option>
                    <option value="inmobiliario">Inmobiliario</option>
                    <option value="seguros">Seguros</option>
                    <option value="educacion">Educación Online</option>
                    <option value="saas">SaaS & Tecnología</option>
                    <option value="retail">Retail / E-commerce</option>
                    <option value="salud">Salud & Medicina</option>
                    <option value="fintech">Fintech / Seguros</option>
                    <option value="servicios">Servicios Profesionales</option>
                    <option value="otro">Otra</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-white text-blue-600 px-10 py-4 rounded-xl font-black text-lg hover:shadow-2xl transition-all hover:scale-105"
                  >
                    Enviar Reporte Gratis
                  </button>
                  <p className="text-sm text-blue-200 mt-4">
                    🔒 No spam. Solo insights de valor. Puedes cancelar cuando quieras.
                  </p>
                </form>
              </>
            ) : (
              <div className="py-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black mb-4">¡Gracias! Reporte en Camino</h3>
                <p className="text-xl text-blue-100 mb-6">
                  Recibirás tu reporte personalizado de <strong>{industria}</strong> en las próximas 24 horas.
                </p>
                <p className="text-blue-200">
                  Mientras tanto, un Account Manager de M&P revisará tu industria y te contactará
                  si detectamos oportunidades inmediatas.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/">
            <img src="/logo-blanco.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" />
          </Link>
          <p className="text-gray-400 mb-4">
            © 2025 Muller y Pérez. Marketing Digital Basado en Datos.
          </p>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Radar de Competencia utiliza datos públicos de Meta Ad Library.
            No recopilamos información personal más allá del email proporcionado voluntariamente.
          </p>
        </div>
      </footer>
    </div>
  )
}
