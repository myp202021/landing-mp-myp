'use client'

import { useState, useEffect } from 'react'

export default function PopupBalance2025() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Verificar si ya se mostró en los últimos 7 días
    const lastShown = localStorage.getItem('balance2025_shown')
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      if (daysSince < 7) return
    }

    // Mostrar después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('balance2025_shown', Date.now().toString())
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          animation: isClosing ? 'none' : 'popupEnter 0.4s ease-out'
        }}
      >
        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6 py-8 text-center">
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <img
            src="/logo-color.png"
            alt="M&P"
            className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white p-2"
          />
          <h2 className="text-2xl font-bold text-white mb-1">Balance 2025</h2>
          <p className="text-white/90 text-sm">Lo que construimos en 2025</p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6">
          {/* Números destacados */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#667eea]">40</div>
              <div className="text-[10px] text-gray-500 leading-tight">Clientes<br/>activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#11998e]">+20%</div>
              <div className="text-[10px] text-gray-500 leading-tight">Crecimiento<br/>ventas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f5576c]">95%</div>
              <div className="text-[10px] text-gray-500 leading-tight">Retención<br/>clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4facfe]">6</div>
              <div className="text-[10px] text-gray-500 leading-tight">Años<br/>operando</div>
            </div>
          </div>

          {/* Mensaje */}
          <p className="text-gray-600 text-sm text-center mb-4">
            Lanzamos <strong>tecnología propia</strong> para tomar mejores decisiones de marketing.
          </p>

          {/* Herramientas mini - 2 columnas */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <a href="/labs/predictor" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-base">📊</span>
              <span className="text-xs text-gray-700 group-hover:text-[#667eea]">Predictor Ads</span>
            </a>
            <a href="/labs/buyer-gen" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-base">🎯</span>
              <span className="text-xs text-gray-700 group-hover:text-[#667eea]">BuyerGen IA</span>
            </a>
            <a href="/labs/simulador-inversion" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-base">🧮</span>
              <span className="text-xs text-gray-700 group-hover:text-[#667eea]">Simulador Inversión</span>
            </a>
            <a href="/labs/radar-industrias" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-base">📡</span>
              <span className="text-xs text-gray-700 group-hover:text-[#667eea]">Radar Industrias</span>
            </a>
            <a href="/utilidades" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-base">🔢</span>
              <span className="text-xs text-gray-700 group-hover:text-[#667eea]">Calculadoras</span>
            </a>
            <a href="/crm" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-base">💼</span>
              <span className="text-xs text-gray-700 group-hover:text-[#667eea]">CRM Propio</span>
            </a>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <a
              href="/labs"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              Ver todas las herramientas
            </a>
            <a
              href="https://wa.me/56992258137"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 border-2 border-[#25D366] text-[#25D366] text-sm font-semibold rounded-xl hover:bg-[#25D366] hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-400">
            Pensamos como ingenieros, no como vendedores de humo.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes popupEnter {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
