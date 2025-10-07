'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, CheckCircle, XCircle, AlertTriangle, TrendingUp, Globe, Smartphone } from 'lucide-react'

interface ScanResult {
  category: string
  score: number
  status: 'excellent' | 'good' | 'warning' | 'poor'
  items: {
    name: string
    status: 'pass' | 'warning' | 'fail'
    message: string
    recommendation?: string
  }[]
}

export default function ScanDigital() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<ScanResult[]>([])
  const [globalScore, setGlobalScore] = useState(0)

  const simulateScan = () => {
    if (!url.trim()) {
      alert('Por favor ingresa una URL válida')
      return
    }

    setScanning(true)
    setResults([])

    setTimeout(() => {
      // Simular resultados del scan
      const mockResults: ScanResult[] = [
        {
          category: 'Velocidad Web',
          score: Math.floor(Math.random() * 30) + 60,
          status: 'good',
          items: [
            { name: 'Tiempo de carga', status: 'pass', message: 'Carga en 2.3s (objetivo: <3s)' },
            { name: 'First Contentful Paint', status: 'warning', message: '1.8s (objetivo: <1.8s)', recommendation: 'Optimiza imágenes y comprime recursos CSS/JS' },
            { name: 'Largest Contentful Paint', status: 'pass', message: '2.1s (objetivo: <2.5s)' },
            { name: 'Cumulative Layout Shift', status: 'warning', message: '0.12 (objetivo: <0.1)', recommendation: 'Define dimensiones de imágenes para evitar saltos visuales' }
          ]
        },
        {
          category: 'SEO On-Page',
          score: Math.floor(Math.random() * 25) + 65,
          status: 'good',
          items: [
            { name: 'Meta Title', status: 'pass', message: 'Presente y optimizado (58 caracteres)' },
            { name: 'Meta Description', status: 'pass', message: 'Presente y atractiva (142 caracteres)' },
            { name: 'Headings (H1-H6)', status: 'warning', message: 'Múltiples H1 detectados', recommendation: 'Usa solo un H1 por página' },
            { name: 'Alt text en imágenes', status: 'fail', message: '8 de 15 imágenes sin alt text', recommendation: 'Agrega descripciones alt a todas las imágenes' },
            { name: 'URL amigables', status: 'pass', message: 'URLs optimizadas y descriptivas' }
          ]
        },
        {
          category: 'Mobile Responsiveness',
          score: Math.floor(Math.random() * 20) + 70,
          status: 'good',
          items: [
            { name: 'Viewport configurado', status: 'pass', message: 'Meta viewport correctamente configurado' },
            { name: 'Texto legible', status: 'pass', message: 'Tamaño de fuente adecuado para móvil' },
            { name: 'Elementos táctiles', status: 'warning', message: 'Algunos botones muy pequeños', recommendation: 'Aumenta tamaño mínimo a 48x48px' },
            { name: 'Contenido responsive', status: 'pass', message: 'Se adapta correctamente a diferentes pantallas' }
          ]
        },
        {
          category: 'Seguridad',
          score: Math.floor(Math.random() * 15) + 80,
          status: 'excellent',
          items: [
            { name: 'HTTPS habilitado', status: 'pass', message: 'Sitio servido mediante HTTPS' },
            { name: 'Certificado SSL válido', status: 'pass', message: 'Certificado válido hasta 2025' },
            { name: 'Headers de seguridad', status: 'warning', message: 'Faltan algunos headers', recommendation: 'Implementa Content-Security-Policy y X-Frame-Options' }
          ]
        },
        {
          category: 'Experiencia de Usuario',
          score: Math.floor(Math.random() * 25) + 60,
          status: 'good',
          items: [
            { name: 'Llamados a la acción', status: 'pass', message: 'CTAs claros y visibles' },
            { name: 'Formularios', status: 'pass', message: 'Formularios sencillos y accesibles' },
            { name: 'Navegación', status: 'warning', message: 'Menú complejo en móvil', recommendation: 'Simplifica navegación móvil con menú hamburguesa' },
            { name: 'Tiempo de permanencia', status: 'fail', message: 'Alta tasa de rebote (68%)', recommendation: 'Mejora contenido above the fold y relevancia' }
          ]
        },
        {
          category: 'Presencia en Redes',
          score: Math.floor(Math.random() * 30) + 50,
          status: 'warning',
          items: [
            { name: 'Enlaces sociales', status: 'pass', message: 'Links a redes sociales presentes' },
            { name: 'Open Graph tags', status: 'warning', message: 'Incompletos o faltantes', recommendation: 'Agrega og:image, og:title y og:description' },
            { name: 'Twitter Cards', status: 'fail', message: 'No implementadas', recommendation: 'Implementa Twitter Card tags para mejor sharing' },
            { name: 'WhatsApp button', status: 'warning', message: 'No visible', recommendation: 'Agrega botón flotante de WhatsApp' }
          ]
        }
      ]

      // Calcular score global
      const totalScore = mockResults.reduce((sum, cat) => sum + cat.score, 0) / mockResults.length

      // Actualizar status según score
      mockResults.forEach(result => {
        if (result.score >= 85) result.status = 'excellent'
        else if (result.score >= 70) result.status = 'good'
        else if (result.score >= 50) result.status = 'warning'
        else result.status = 'poor'
      })

      setResults(mockResults)
      setGlobalScore(Math.round(totalScore))
      setScanning(false)

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />
      default: return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-blue-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getGlobalStatus = () => {
    if (globalScore >= 85) return { text: 'Excelente', color: 'text-green-600', icon: '✓' }
    if (globalScore >= 70) return { text: 'Bueno', color: 'text-blue-600', icon: '~' }
    if (globalScore >= 50) return { text: 'Mejorable', color: 'text-yellow-600', icon: '!' }
    return { text: 'Necesita Atención', color: 'text-red-600', icon: '✕' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/labs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all">
            ← Volver a M&P Labs
          </Link>
          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-900">M&P Scan Digital</h1>
            <p className="text-xs text-gray-600">Auditoría Digital Completa</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">Análisis Automático</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Escanea tu presencia digital<br />en segundos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Análisis completo de velocidad, SEO, mobile, seguridad, UX y redes sociales con recomendaciones accionables
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                URL de tu sitio web
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://tusitio.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={simulateScan}
            disabled={scanning}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-all shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
          >
            {scanning ? 'Escaneando...' : 'Escanear Sitio'}
          </button>
        </div>

        {/* Features */}
        {!scanning && results.length === 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: <TrendingUp className="w-8 h-8 text-blue-600" />, title: 'Velocidad Web', desc: 'Core Web Vitals y tiempos de carga' },
              { icon: <Search className="w-8 h-8 text-blue-600" />, title: 'SEO On-Page', desc: 'Meta tags, headings y optimización' },
              { icon: <Smartphone className="w-8 h-8 text-blue-600" />, title: 'Mobile First', desc: 'Responsive y experiencia móvil' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {scanning && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-200">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Escaneando tu sitio...</h3>
            <p className="text-gray-600">Analizando velocidad, SEO, mobile, seguridad y más</p>
          </div>
        )}

        {/* Results */}
        {!scanning && results.length > 0 && (
          <div id="results">
            {/* Global Score */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Score Global</div>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(globalScore)}`}>
                  {globalScore}
                </div>
                <div className={`text-xl font-semibold ${getGlobalStatus().color}`}>
                  {getGlobalStatus().icon} {getGlobalStatus().text}
                </div>
              </div>
            </div>

            {/* Category Results */}
            <div className="space-y-6">
              {results.map((category, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                    <div className={`px-4 py-2 rounded-lg font-bold ${getScoreBg(category.score)} ${getScoreColor(category.score)}`}>
                      {category.score}/100
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.message}</div>
                            {item.recommendation && (
                              <div className="mt-2 p-3 bg-blue-50 border-l-2 border-blue-600 rounded">
                                <div className="text-xs font-semibold text-blue-900 mb-1">💡 Recomendación</div>
                                <div className="text-sm text-blue-800">{item.recommendation}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mt-8">
              <h3 className="text-2xl font-bold mb-4">¿Quieres optimizar tu sitio?</h3>
              <p className="text-blue-100 mb-6">
                Nuestro equipo puede implementar todas estas mejoras y llevar tu presencia digital al siguiente nivel
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => window.location.href = '/contacto'}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Agendar Consultoría
                </button>
                <a
                  href="https://wa.me/56992225813"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 Muller y Pérez · Auditoría Digital Automatizada</p>
        </div>
      </footer>
    </div>
  )
}
