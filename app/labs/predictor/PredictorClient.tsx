'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
  Award,
  Users
} from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'

export default function PredictorClient() {
  const predictorSchema = createSoftwareAppSchema(
    'Predictor Google Ads Chile - Calculadora de Conversiones',
    'Herramienta gratuita para predecir conversiones y revenue de campañas Google Ads en Chile. Basada en data real de 200+ campañas activas. Calcula CPL, CPA, ROI y proyecciones por industria.',
    'https://www.mulleryperez.cl/labs/predictor'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'M&P Labs', url: 'https://www.mulleryperez.cl/labs' },
    { name: 'Predictor Google Ads', url: 'https://www.mulleryperez.cl/labs/predictor' }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(predictorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo-color.png" alt="M&P Logo" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <Link href="/labs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            ← Volver
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            100% Gratis · Sin registro · Resultados inmediatos
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            ¿Cuántas ventas generarás con<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Google Ads en Chile?
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Descúbrelo en <span className="font-bold text-gray-900">30 segundos</span> con nuestro predictor profesional.
            Calibrado con benchmarks reales de <span className="font-semibold">WordStream</span>, <span className="font-semibold">Triple Whale</span> y <span className="font-semibold">Databox</span> para el mercado chileno.
          </p>

          <Link
            href="https://wa.me/56944460270?text=Hola!%20Quiero%20calcular%20mi%20predicción%20de%20Google%20Ads"
            target="_blank"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95"
          >
            <Zap className="w-6 h-6" />
            Calcular mi predicción gratis
            <ArrowRight className="w-6 h-6" />
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            ⚡ No requiere tarjeta de crédito ni registro
          </p>
        </div>

        {/* Proof / Social Proof */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">216+</div>
            <div className="text-sm text-gray-600">Casos validados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">12</div>
            <div className="text-sm text-gray-600">Industrias</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">100%</div>
            <div className="text-sm text-gray-600">Coherencia matemática</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">2024</div>
            <div className="text-sm text-gray-600">Benchmarks actualizados</div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Qué obtienes con el predictor?
            </h2>
            <p className="text-xl text-gray-600">
              Predicción profesional en minutos, no en días
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Conversiones mensuales</h3>
              <p className="text-gray-600 leading-relaxed">
                Cantidad exacta de ventas/leads que generarás según tu presupuesto, industria y tasa de cierre.
              </p>
            </div>

            <div className="p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ROAS proyectado</h3>
              <p className="text-gray-600 leading-relaxed">
                Return on Ad Spend realista (no inflado) basado en tu ticket promedio y benchmarks de industria.
              </p>
            </div>

            <div className="p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proyección 12 meses</h3>
              <p className="text-gray-600 leading-relaxed">
                Evolución mes a mes considerando curva de aprendizaje, estacionalidad y saturación de mercado.
              </p>
            </div>

            <div className="p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3 escenarios</h3>
              <p className="text-gray-600 leading-relaxed">
                Conservador, base y agresivo. Cada uno con probabilidad de éxito basada en tu perfil.
              </p>
            </div>

            <div className="p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mix de campañas</h3>
              <p className="text-gray-600 leading-relaxed">
                Distribución óptima de presupuesto entre Google Search, Display, Shopping y más plataformas.
              </p>
            </div>

            <div className="p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exportar PDF</h3>
              <p className="text-gray-600 leading-relaxed">
                Descarga tu predicción profesional para compartir con socios o directorio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrias soportadas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Calibrado para tu industria
            </h2>
            <p className="text-xl text-gray-600">
              Benchmarks específicos por vertical
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              '🛒 E-commerce',
              '💻 Tecnología / SaaS',
              '💳 Fintech',
              '🏠 Inmobiliaria',
              '⚕️ Salud / Medicina',
              '📚 Educación',
              '✈️ Turismo',
              '🍽️ Gastronomía',
              '🚗 Automotriz',
              '👔 Moda / Retail',
              '⚖️ Servicios Legales',
              '💅 Belleza / Personal'
            ].map(industria => (
              <div key={industria} className="bg-white p-4 rounded-xl border border-gray-200 text-center font-medium text-gray-700">
                {industria}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Empieza tu predicción ahora
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Toma mejores decisiones con data, no con intuición
          </p>

          <Link
            href="https://wa.me/56944460270?text=Hola!%20Quiero%20calcular%20mi%20predicción%20de%20Google%20Ads"
            target="_blank"
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-6 h-6" />
            Calcular predicción gratis
            <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-white">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <span>Sin registro</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <span>Resultados inmediatos</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <span>100% gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-blanco.png" alt="Muller y Pérez" className="h-8" />
                <span className="font-bold text-white">Muller y Pérez</span>
              </div>
              <p className="text-sm text-gray-400">
                Agencia de marketing digital especializada en performance y ROI medible.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Herramientas</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://wa.me/56944460270?text=Hola!%20Quiero%20calcular%20mi%20predicción%20de%20Google%20Ads" target="_blank" className="hover:text-white">Predictor Google Ads</a></li>
                <li><a href="https://mulleryperez.cl" className="hover:text-white">Servicios</a></li>
                <li><a href="https://mulleryperez.cl" className="hover:text-white">Casos de éxito</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:contacto@mulleryperez.cl" className="hover:text-white">contacto@mulleryperez.cl</a></li>
                <li><a href="https://mulleryperez.cl" className="hover:text-white">www.mulleryperez.cl</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Muller y Pérez. Motor 2024 v2024.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
