'use client'

import React, { useState } from 'react'

var SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ'

export default function CopilotLogin() {
  var [email, setEmail] = useState('')
  var [sent, setSent] = useState(false)
  var [error, setError] = useState('')
  var [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Look up subscription by email
    fetch(SUPABASE_URL + '/rest/v1/clipping_suscripciones?email=eq.' + encodeURIComponent(email) + '&select=id,nombre,email,estado', {
      headers: { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON }
    })
      .then(function(r) { return r.json() })
      .then(function(data) {
        setLoading(false)
        if (!data || data.length === 0) {
          setError('No encontramos una cuenta Copilot con ese email.')
          return
        }
        var sub = data[0]
        if (sub.estado === 'cancelado' || sub.estado === 'vencido') {
          setError('Tu suscripción está ' + sub.estado + '. Contáctanos para reactivar.')
          return
        }
        // Redirect to dashboard
        window.location.href = '/copilot/dashboard/' + sub.id
      })
      .catch(function() {
        setLoading(false)
        setError('Error de conexión. Intenta de nuevo.')
      })
  }

  return (
    <div className="min-h-screen bg-[#0F0D2E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-xs text-[#7C3AED] font-semibold tracking-widest mb-3">M&P COPILOT</div>
          <h1 className="text-2xl font-bold text-white mb-2">Accede a tu Copilot</h1>
          <p className="text-[#94a3b8] text-sm">Ingresa el email con el que te registraste</p>
        </div>

        {sent ? (
          <div className="bg-[#1a1745] rounded-2xl p-8 text-center border border-white/[0.06]">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-lg font-bold text-white mb-2">Acceso verificado</h2>
            <p className="text-[#94a3b8] text-sm">Redirigiendo a tu dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="bg-[#1a1745] rounded-2xl p-8 border border-white/[0.06]">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#c4b5fd] mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={function(e) { setEmail(e.target.value) }}
                placeholder="tu@empresa.cl"
                className="w-full bg-[#12102a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748b] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-900/20 border border-red-700/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
                {error.includes('No encontramos') && (
                  <a href="/copilot#trial" className="text-indigo-400 text-sm font-semibold hover:underline mt-1 block">
                    Registrar prueba gratuita →
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Acceder a mi Copilot'}
            </button>

            <p className="text-center text-sm text-[#64748b] mt-4">
              ¿No tienes cuenta?{' '}
              <a href="/copilot#trial" className="text-indigo-400 font-semibold hover:underline">
                Prueba gratis 7 días
              </a>
            </p>
          </form>
        )}

        <div className="text-center mt-6">
          <a href="/copilot" className="text-[#64748b] text-xs hover:text-white transition">
            ← Volver a Copilot
          </a>
        </div>
      </div>
    </div>
  )
}
