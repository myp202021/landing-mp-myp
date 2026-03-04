'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/noticias/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMsg('¡Listo! Te avisaremos cada lunes con los datos de la semana.')
        setEmail('')
      } else {
        setStatus('error')
        setMsg(json.error || 'Error al suscribirse. Inténtalo de nuevo.')
      }
    } catch {
      setStatus('error')
      setMsg('Error de conexión. Inténtalo de nuevo.')
    }
  }

  if (status === 'ok') {
    return (
      <div className="text-center py-2">
        <div className="text-2xl mb-2">✅</div>
        <p className="text-green-700 font-bold">{msg}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="flex-1 max-w-xs px-4 py-3 border border-blue-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white text-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors whitespace-nowrap"
      >
        {status === 'loading' ? 'Guardando…' : 'Suscribirme gratis'}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-xs mt-1 sm:col-span-2">{msg}</p>
      )}
    </form>
  )
}
