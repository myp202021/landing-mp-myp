'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginReportes() {
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setEnviando(true)
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: clave })
    if (error) {
      setEnviando(false)
      setError(/invalid/i.test(error.message) ? 'El correo o la contraseña no coinciden.' : 'No pudimos iniciar sesión. Inténtalo de nuevo en unos minutos.')
      return
    }
    window.location.href = '/clientes'
  }

  return (
    <div className="rp-login">
      <form className="rp-login-card" onSubmit={entrar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-color.png" alt="Muller y Pérez" />
        <div className="rp-eyebrow">Área de clientes</div>
        <h1>Reporte SEO y GEO</h1>
        <p className="intro">Revisa mes a mes tus búsquedas, visitas desde Google y asistentes de IA, y lo que hicimos en tu sitio.</p>
        {error && <div className="rp-error">{error}</div>}
        <div className="rp-field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="rp-field">
          <label htmlFor="clave">Contraseña</label>
          <input id="clave" type="password" autoComplete="current-password" required value={clave} onChange={e => setClave(e.target.value)} />
        </div>
        <button className="rp-submit" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
        <div className="rp-login-foot">¿Problemas para entrar? Escríbenos a contacto@mulleryperez.cl</div>
      </form>
    </div>
  )
}
