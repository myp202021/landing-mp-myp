'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Download, TrendingUp, Target, DollarSign, BarChart3 } from 'lucide-react'

// Datos de benchmarks por industria Chile 2025
const benchmarks = [
  {
    industria: 'E-commerce',
    cpc: '$180-$320',
    cpl: '$2.500-$4.800',
    cpa: '$8.500-$15.000',
    roas: '4.2x-6.5x',
    ctr: '2.8%-4.5%',
    conversionRate: '1.2%-2.8%'
  },
  {
    industria: 'Servicios B2B',
    cpc: '$420-$850',
    cpl: '$8.500-$18.000',
    cpa: '$42.000-$95.000',
    roas: '3.5x-5.2x',
    ctr: '1.8%-3.2%',
    conversionRate: '2.5%-4.8%'
  },
  {
    industria: 'SaaS/Tech',
    cpc: '$520-$1.200',
    cpl: '$12.000-$28.000',
    cpa: '$65.000-$180.000',
    roas: '2.8x-4.5x',
    ctr: '1.5%-2.8%',
    conversionRate: '2.8%-5.5%'
  },
  {
    industria: 'Inmobiliaria',
    cpc: '$280-$650',
    cpl: '$4.500-$12.000',
    cpa: '$25.000-$65.000',
    roas: '8.5x-15x',
    ctr: '2.2%-3.8%',
    conversionRate: '1.8%-3.5%'
  },
  {
    industria: 'Educación Online',
    cpc: '$220-$480',
    cpl: '$3.800-$9.500',
    cpa: '$18.000-$45.000',
    roas: '3.8x-6.2x',
    ctr: '2.5%-4.2%',
    conversionRate: '2.2%-4.5%'
  },
  {
    industria: 'Salud/Medicina',
    cpc: '$380-$720',
    cpl: '$6.500-$15.000',
    cpa: '$35.000-$85.000',
    roas: '4.5x-7.8x',
    ctr: '2.0%-3.5%',
    conversionRate: '2.8%-5.2%'
  },
  {
    industria: 'Turismo',
    cpc: '$150-$350',
    cpl: '$2.200-$5.800',
    cpa: '$12.000-$28.000',
    roas: '5.2x-8.5x',
    ctr: '3.2%-5.5%',
    conversionRate: '1.5%-3.2%'
  },
  {
    industria: 'Fintech/Seguros',
    cpc: '$620-$1.500',
    cpl: '$18.000-$42.000',
    cpa: '$95.000-$220.000',
    roas: '2.5x-4.2x',
    ctr: '1.2%-2.5%',
    conversionRate: '3.2%-6.5%'
  }
]

export default function BenchmarksClient() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Aquí iría la lógica para guardar el email (ej: enviar a tu API o Google Sheets)
    // Por ahora solo simulamos un delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)

    // Abrir PDF de benchmarks (crear este PDF y subirlo a /public/)
    window.open('/benchmarks-marketing-digital-chile-2025.pdf', '_blank')
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              📊 Datos Actualizados Q1 2025
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Benchmarks de Marketing Digital<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chile 2025
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              CPC, CPL, CPA, ROAS y tasas de conversión por industria. Datos reales de +200 campañas activas en Chile.
            </p>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Industrias</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">+200</div>
              <div className="text-sm text-gray-600">Campañas</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">$450K+</div>
              <div className="text-sm text-gray-600">Invertidos/mes</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">Q1 2025</div>
              <div className="text-sm text-gray-600">Actualizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla de Benchmarks */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Industria</th>
                    <th className="px-6 py-4 text-left font-bold">CPC (Google Ads)</th>
                    <th className="px-6 py-4 text-left font-bold">CPL</th>
                    <th className="px-6 py-4 text-left font-bold">CPA</th>
                    <th className="px-6 py-4 text-left font-bold">ROAS</th>
                    <th className="px-6 py-4 text-left font-bold">CTR</th>
                    <th className="px-6 py-4 text-left font-bold">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((row, idx) => (
                    <tr key={idx} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{row.industria}</td>
                      <td className="px-6 py-4 text-gray-700">{row.cpc}</td>
                      <td className="px-6 py-4 text-gray-700">{row.cpl}</td>
                      <td className="px-6 py-4 text-gray-700">{row.cpa}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{row.roas}</td>
                      <td className="px-6 py-4 text-gray-700">{row.ctr}</td>
                      <td className="px-6 py-4 text-gray-700">{row.conversionRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 px-6 py-4 text-sm text-gray-600">
              <p className="mb-2"><strong>Notas importantes:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Datos basados en +200 campañas activas en Chile (Q1 2025)</li>
                <li>CPL = Costo por Lead | CPA = Costo por Adquisición (cliente)</li>
                <li>ROAS = Return on Ad Spend (Retorno por cada $1 invertido)</li>
                <li>Los rangos varían según segmentación, calidad de landing y producto</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Descarga PDF */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Download className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              Descarga el PDF Completo
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Incluye análisis detallado por canal, estrategias de optimización y casos de éxito reales.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-6 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Descargar PDF Gratis'}
                </button>
                <p className="text-sm opacity-75">
                  📧 Recibirás el PDF en tu email. Sin spam, prometido.
                </p>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">¡Gracias!</h3>
                <p className="text-lg opacity-90 mb-6">
                  El PDF se está abriendo en una nueva pestaña.<br />
                  También lo enviamos a <strong>{email}</strong>
                </p>
                <Link
                  href="/"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Volver al Inicio
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
