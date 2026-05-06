'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Calendar } from 'lucide-react'

export default function SiteHeader() {
  const [labsDropdown, setLabsDropdown] = useState(false)
  const [utilidadesDropdown, setUtilidadesDropdown] = useState(false)
  const [noticiasDropdown, setNoticiasDropdown] = useState(false)
  const [nosotrosDropdown, setNosotrosDropdown] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Ir a inicio">
          <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
        </Link>

        <nav className="flex items-center gap-5" role="navigation" aria-label="Navegación principal">
          {/* Planes */}
          <Link
            href="/#planes"
            className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            Planes
          </Link>

          {/* Tecnología */}
          <Link
            href="/tecnologia"
            className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            Tecnología
          </Link>

          {/* Clientes */}
          <Link
            href="/#clientes"
            className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            Clientes
          </Link>

          {/* Copilot */}
          <Link
            href="/copilot"
            className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            Copilot
          </Link>

          {/* M&P Labs Dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setLabsDropdown(true)}
            onMouseLeave={() => setLabsDropdown(false)}
          >
            <Link
              href="/labs"
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
              aria-expanded={labsDropdown}
              aria-haspopup="true"
            >
              M&P Labs
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${labsDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>
            {labsDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[260px] animate-in fade-in slide-in-from-top-2 duration-200">
                <Link href="/labs/predictor" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold flex items-center gap-2">Predictor + Diagnóstico <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">NUEVO</span></div>
                  <div className="text-xs text-gray-500 mt-0.5">Google vs Meta vs LinkedIn</div>
                </Link>
                <Link href="/labs/buyer-gen" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Buyer Gen</div>
                  <div className="text-xs text-gray-500 mt-0.5">Genera buyer personas</div>
                </Link>
                <Link href="/labs/radar-industrias" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Copilot Industrias</div>
                  <div className="text-xs text-gray-500 mt-0.5">Madurez digital por sector</div>
                </Link>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link href="/labs" className="block px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">Ver todas las herramientas →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Utilidades Dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setUtilidadesDropdown(true)}
            onMouseLeave={() => setUtilidadesDropdown(false)}
          >
            <Link
              href="/utilidades"
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
              aria-expanded={utilidadesDropdown}
              aria-haspopup="true"
            >
              Utilidades
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${utilidadesDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>
            {utilidadesDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[260px] animate-in fade-in slide-in-from-top-2 duration-200">
                <Link href="/utilidades/calculadora-cac" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Calculadora CAC</div>
                  <div className="text-xs text-gray-500 mt-0.5">Costo de adquisición por canal</div>
                </Link>
                <Link href="/utilidades/comparador-web" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Comparador Web</div>
                  <div className="text-xs text-gray-500 mt-0.5">Velocidad y Core Web Vitals</div>
                </Link>
                <Link href="/utilidades/generador-funnels" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Generador Funnels</div>
                  <div className="text-xs text-gray-500 mt-0.5">Embudos de venta CRM</div>
                </Link>
                <Link href="/utilidades/juega-aprende" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Juega y Aprende</div>
                  <div className="text-xs text-gray-500 mt-0.5">Simulador estrategias marketing</div>
                </Link>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link href="/utilidades" className="block px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">Ver todas las utilidades →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Noticias Dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setNoticiasDropdown(true)}
            onMouseLeave={() => setNoticiasDropdown(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
              aria-expanded={noticiasDropdown}
              aria-haspopup="true"
            >
              Noticias
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${noticiasDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {noticiasDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[260px] animate-in fade-in slide-in-from-top-2 duration-200">
                <Link href="/blog" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Blog</div>
                  <div className="text-xs text-gray-500 mt-0.5">Artículos y guías completas</div>
                </Link>
                <Link href="/indicadores" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Termómetro Marketing</div>
                  <div className="text-xs text-gray-500 mt-0.5">CPC por industria · USD · UF</div>
                </Link>
                <Link href="/investigacion" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Investigación</div>
                  <div className="text-xs text-gray-500 mt-0.5">Estudios y datos originales</div>
                </Link>
                <Link href="/benchmarks" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Benchmarks 2025</div>
                  <div className="text-xs text-gray-500 mt-0.5">Datos de industria Chile</div>
                </Link>
              </div>
            )}
          </div>

          {/* Nosotros Dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setNosotrosDropdown(true)}
            onMouseLeave={() => setNosotrosDropdown(false)}
          >
            <Link
              href="/nosotros"
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
              aria-expanded={nosotrosDropdown}
              aria-haspopup="true"
            >
              Nosotros
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${nosotrosDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>
            {nosotrosDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[260px] animate-in fade-in slide-in-from-top-2 duration-200">
                <Link href="/casos-de-exito" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Casos de Éxito</div>
                  <div className="text-xs text-gray-500 mt-0.5">Resultados reales con datos</div>
                </Link>
                <Link href="/portfolio" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Portfolio</div>
                  <div className="text-xs text-gray-500 mt-0.5">Trabajos y piezas gráficas</div>
                </Link>
                <Link href="/servicios" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <div className="font-semibold">Servicios</div>
                  <div className="text-xs text-gray-500 mt-0.5">Google Ads, Meta, LinkedIn y más</div>
                </Link>
              </div>
            )}
          </div>

          {/* Acceso Clientes */}
          <Link
            href="/copilot/login"
            className="inline-flex items-center gap-2 px-3 py-2 md:px-4 border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 rounded-lg text-sm"
            aria-label="Acceso clientes"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">Acceso Clientes</span>
          </Link>

          {/* Agendar Reunión */}
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 rounded-lg text-sm"
            aria-label="Agendar reunión con Muller y Pérez"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            Agendar Reunión
          </Link>
        </nav>
      </div>
    </header>
  )
}
