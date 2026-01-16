'use client'

import { useState, useEffect } from 'react'

/**
 * Exit Intent Popup - Se muestra cuando el usuario va a salir del sitio
 * Ofrece un lead magnet (PDF) a cambio del email
 */
export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedMagnet] = useState('ebook')

  useEffect(() => {
    // Verificar si ya se mostró en los últimos 3 días
    const lastShown = localStorage.getItem('exit_intent_shown')
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      if (daysSince < 3) return
    }

    // Verificar si ya descargó algo
    const hasDownloaded = localStorage.getItem('lead_magnet_downloaded')
    if (hasDownloaded) return

    // Detectar exit intent (mouse sale del viewport por arriba)
    const handleMouseLeave = (e: MouseEvent) => {
      // Solo activar si el mouse sale por la parte superior
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true)
        localStorage.setItem('exit_intent_shown', Date.now().toString())
      }
    }

    // Detectar en mobile: scroll rápido hacia arriba o botón atrás
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Si hace scroll rápido hacia arriba desde abajo, mostrar
      if (lastScrollY > 500 && currentScrollY < lastScrollY - 200 && !isVisible) {
        const lastShownMobile = localStorage.getItem('exit_intent_shown')
        if (!lastShownMobile || (Date.now() - parseInt(lastShownMobile)) > 3 * 24 * 60 * 60 * 1000) {
          setIsVisible(true)
          localStorage.setItem('exit_intent_shown', Date.now().toString())
        }
      }
      lastScrollY = currentScrollY
    }

    // Esperar 5 segundos antes de activar la detección
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('scroll', handleScroll)
    }, 5000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isVisible])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Guardar lead
      await fetch('/api/leads/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          lead_magnet: selectedMagnet,
          source: 'exit_intent_popup'
        })
      })

      // Marcar como descargado
      localStorage.setItem('lead_magnet_downloaded', 'true')
      setIsSuccess(true)

      // Abrir PDF en nueva pestaña
      setTimeout(() => {
        window.open('/recursos/ebook-marketing-datos-2025.pdf', '_blank')
        handleClose()
      }, 2000)

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) return null

  const ebookInfo = {
    title: 'eBook: Marketing con Datos 2025',
    description: 'Guía completa para tomar decisiones basadas en datos reales',
    icon: '📚'
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Espera! Llévate algo gratis
              </h2>
              <p className="text-blue-100 text-sm">
                Descarga recursos exclusivos para mejorar tu marketing
              </p>
            </div>

            {/* Contenido */}
            <div className="px-6 py-6">
              {/* Mostrar ebook */}
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-blue-500 bg-blue-50 mb-6">
                <span className="text-4xl">{ebookInfo.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-blue-700">{ebookInfo.title}</div>
                  <div className="text-sm text-gray-600">{ebookInfo.description}</div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email corporativo"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Descargando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar Gratis
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                Sin spam. Solo contenido de valor para tu negocio.
              </p>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Descarga iniciada!</h3>
            <p className="text-gray-600 text-sm mb-4">
              El PDF se abrirá en una nueva pestaña. También te enviamos una copia a tu email.
            </p>
            <p className="text-xs text-gray-400">
              Cerrando automáticamente...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
