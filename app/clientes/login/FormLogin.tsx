'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Lee los valores del formulario al enviar (sirve también con el autocompletado de Chrome)
export default function FormLogin({ area, nombre, logo }: { area: string | null; nombre: string | null; logo: string | null }) {
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setError(''); setEnviando(true)
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get('email') || '').trim(), password: String(f.get('clave') || '') })
    if (error) {
      setEnviando(false)
      setError(/invalid/i.test(error.message) ? 'El correo o la contraseña no coinciden.' : 'No pudimos iniciar sesión. Inténtalo de nuevo en unos minutos.')
      return
    }
    window.location.href = area ? '/' + area : '/admin-reportes'
  }

  return (
    <div className="rp-login">
      <form className="rp-login-card" onSubmit={entrar}>
        <div className="rp-login-brands">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-color.png" alt="Muller y Pérez" />
          {logo && <><span className="x">×</span>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={logo} alt={nombre || ''} /></>}
        </div>
        <div className="rp-eyebrow">Área de clientes{nombre ? ' · ' + nombre : ''}</div>
        <h1>{nombre ? nombre : 'Reporte SEO y GEO'}</h1>
        <p className="intro">Revisa mes a mes tus búsquedas, visitas desde Google y asistentes de IA, y lo que hicimos en tu sitio.</p>
        {error && <div className="rp-error">{error}</div>}
        <div className="rp-field">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="rp-field">
          <label htmlFor="clave">Contraseña</label>
          <input id="clave" name="clave" type="password" autoComplete="current-password" required />
        </div>
        <button className="rp-submit" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
        <div className="rp-login-foot">¿Problemas para entrar? Escríbenos a contacto@mulleryperez.cl</div>
      </form>
    </div>
  )
}
