/**
 * 404 Page - Not Found
 * Página personalizada para errores 404
 */

import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-12">
          <img
            src="/logo-blanco.png"
            alt="Muller y Pérez"
            className="h-16 mx-auto opacity-50"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white/10 mb-4">404</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
        </div>

        {/* Content */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Página no encontrada
        </h2>

        <p className="text-xl text-blue-200/80 mb-12 leading-relaxed">
          La página que buscas no existe o fue movida. <br />
          Verifica la URL o regresa al inicio.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>

          <Link
            href="/labs"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-xl hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Explorar M&P Labs
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-blue-300/60 mb-4">Enlaces rápidos:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/labs/predictor" className="text-blue-300 hover:text-white transition-colors">
              Predictor Google Ads
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/utilidades/calculadora-cac" className="text-blue-300 hover:text-white transition-colors">
              Calculadora CAC
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/utilidades/comparador-web" className="text-blue-300 hover:text-white transition-colors">
              Comparador Web
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/" className="text-blue-300 hover:text-white transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
