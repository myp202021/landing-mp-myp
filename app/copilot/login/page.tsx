'use client'

import React, { useState } from 'react'

export default function CopilotLogin() {
  var [email, setEmail] = useState('')
  var [password, setPassword] = useState('')
  var [error, setError] = useState('')
  var [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    fetch('/api/copilot/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password: password }),
    })
      .then(function(r) { return r.json().then(function(d) { return { status: r.status, data: d } }) })
      .then(function(result) {
        setLoading(false)
        if (result.status !== 200 || !result.data.success) {
          setError(result.data.error || 'Error al iniciar sesi\u00f3n')
          return
        }
        // Cookie httpOnly ya fue seteada por el servidor
        window.location.href = result.data.redirect
      })
      .catch(function() {
        setLoading(false)
        setError('Error de conexi\u00f3n. Intenta de nuevo.')
      })
  }

  return (
    <div className="min-h-screen bg-[#0F0D2E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-xs text-[#7C3AED] font-semibold tracking-widest mb-3">M&P COPILOT</div>
          <h1 className="text-2xl font-bold text-white mb-2">Accede a tu Copilot</h1>
          <p className="text-[#94a3b8] text-sm">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#1a1745] rounded-2xl p-8 border border-white/[0.06]">
          <div className="mb-4">
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

          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#c4b5fd] mb-2">Contrase{'\u00f1'}a</label>
            <input
              type="password"
              required
              value={password}
              onChange={function(e) { setPassword(e.target.value) }}
              placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
              className="w-full bg-[#12102a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748b] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-700/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
              {error.includes('no tiene contrase') && (
                <p className="text-[#64748b] text-xs mt-1">Cont{'\u00e1'}ctanos en contacto@mulleryperez.cl</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar sesi\u00f3n'}
          </button>

          <p className="text-center text-sm text-[#64748b] mt-4">
            {'\u00bfNo tienes cuenta? '}
            <a href="/copilot#trial" className="text-indigo-400 font-semibold hover:underline">
              Prueba gratis 7 d{'\u00ed'}as
            </a>
          </p>
        </form>

        <div className="text-center mt-6">
          <a href="/copilot" className="text-[#64748b] text-xs hover:text-white transition">
            {'\u2190'} Volver a Copilot
          </a>
        </div>
      </div>
    </div>
  )
}
