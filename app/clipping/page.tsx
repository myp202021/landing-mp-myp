'use client'

import { useState } from 'react'

const PLANES = [
  {
    id: 'starter',
    nombre: 'Starter',
    cuentas: 5,
    canales: 'Instagram',
    ia: false,
    alertas: false,
    excel: false,
    mensual: 34990,
    anual: 27990,
    anualTotal: 335880,
    flowMensual: 'RADAR-STARTER-MENSUAL',
    flowAnual: 'RADAR-STARTER-ANUAL',
  },
  {
    id: 'pro',
    nombre: 'Pro',
    cuentas: 15,
    canales: 'Instagram + Facebook + LinkedIn',
    ia: true,
    alertas: false,
    excel: false,
    mensual: 69990,
    anual: 54990,
    anualTotal: 659880,
    flowMensual: 'RADAR-PRO-MENSUAL',
    flowAnual: 'RADAR-PRO-ANUAL',
    popular: true,
  },
  {
    id: 'business',
    nombre: 'Business',
    cuentas: 30,
    canales: 'Instagram + Facebook + LinkedIn',
    ia: true,
    alertas: true,
    excel: true,
    mensual: 119990,
    anual: 94990,
    anualTotal: 1139880,
    flowMensual: 'RADAR-BUSINESS-MENSUAL',
    flowAnual: 'RADAR-BUSINESS-ANUAL',
  },
]

const FEATURES = [
  { label: 'Email diario con posts recientes', starter: true, pro: true, business: true },
  { label: 'Preview de texto + link directo', starter: true, pro: true, business: true },
  { label: 'Likes y comentarios por post', starter: true, pro: true, business: true },
  { label: 'Facebook y LinkedIn', starter: false, pro: true, business: true },
  { label: 'Resumen IA semanal', starter: false, pro: true, business: true },
  { label: 'Análisis IA diario con insights', starter: false, pro: false, business: true },
  { label: 'Alertas por keyword', starter: false, pro: false, business: true },
  { label: 'Benchmark vs semana anterior', starter: false, pro: false, business: true },
  { label: 'Export semanal Excel', starter: false, pro: false, business: true },
]

function formatCLP(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

export default function ClippingPage() {
  const [anual, setAnual] = useState(false)
  const [trialEmail, setTrialEmail] = useState('')
  const [trialUrls, setTrialUrls] = useState(['', '', ''])
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleTrial = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    const cuentas = trialUrls
      .filter(u => u.trim())
      .map(u => {
        const match = u.match(/instagram\.com\/([^/?]+)/)
        return { red: 'instagram', handle: match ? match[1] : u.trim() }
      })

    try {
      const res = await fetch('/api/clipping/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trialEmail, cuentas }),
      })
      if (res.ok) setEnviado(true)
    } catch (err) {
      console.error(err)
    }
    setEnviando(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-blue-400 font-semibold text-sm tracking-wider mb-4">Muller y Pérez</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Tu radar de competencia{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              en redes sociales
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Recibe cada mañana un email con todo lo que publicó tu competencia en Instagram, Facebook y LinkedIn. Con análisis IA que te dice qué significa y qué deberías hacer.
          </p>
          <a href="#trial" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition">
            Prueba gratis 7 días
          </a>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Así de simple</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Pega las URLs', desc: 'Las cuentas de Instagram, Facebook o LinkedIn que quieres monitorear.' },
            { step: '2', title: 'Recibe tu email', desc: 'Cada mañana a las 7:00 AM te llega el clipping con todo lo que publicaron.' },
            { step: '3', title: 'Decide con datos', desc: 'La IA te resume qué están haciendo, qué tendencias hay y qué oportunidades tienes.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">{item.step}</div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ejemplo de email */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Esto es lo que recibes</h2>
        <div className="bg-white rounded-2xl p-6 text-gray-900 text-sm shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-xl mb-4">
            <p className="font-bold text-lg">📊 Tu radar diario — 17 abril 2026</p>
            <p className="text-sm opacity-90">5 cuentas monitoreadas · 8 posts nuevos</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 mb-4">
            <p className="font-bold text-purple-700">⚡ Resumen IA</p>
            <p className="text-gray-600 mt-1">CafExpress lanzó promoción "máquina gratis por 3 meses" con 847 likes (4× su promedio). CorporateCoffee publicó su primer testimonio video en 2 meses. Vendomatica sin actividad hace 5 días.</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 mb-4">
            <p className="font-bold text-green-700">💡 Oportunidad detectada</p>
            <p className="text-gray-600 mt-1">Ningún competidor está hablando de café de especialidad para cowork. Es un ángulo disponible para posicionarte primero.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-bold text-blue-700">📈 Tu benchmark semanal</p>
            <p className="text-gray-600 mt-1">Tú: 3 posts, 2.1% engagement. Competencia: 4 posts, 1.4%. Publicas menos pero con mejor calidad.</p>
          </div>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">Ejemplo real de un email Radar Pro</p>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-5xl mx-auto" id="planes">
        <h2 className="text-2xl font-bold text-center mb-4">Planes</h2>
        <p className="text-gray-400 text-center mb-8">7 días gratis en todos los planes. Sin contrato. Cancela cuando quieras.</p>

        {/* Toggle mensual/anual */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium ${!anual ? 'text-white' : 'text-gray-500'}`}>Mensual</span>
          <button
            onClick={() => setAnual(!anual)}
            className={`relative w-14 h-7 rounded-full transition ${anual ? 'bg-purple-600' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${anual ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${anual ? 'text-white' : 'text-gray-500'}`}>
            Anual <span className="text-green-400 text-xs font-bold ml-1">-20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANES.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border ${
                plan.popular
                  ? 'border-purple-500 bg-gradient-to-b from-purple-500/10 to-transparent shadow-lg shadow-purple-500/10'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Más popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.cuentas} cuentas · {plan.canales}</p>
              <div className="mb-6">
                <span className="text-3xl font-extrabold">{formatCLP(anual ? plan.anual : plan.mensual)}</span>
                <span className="text-gray-500 text-sm">/mes {anual ? '+ IVA' : '+ IVA'}</span>
                {anual && (
                  <p className="text-green-400 text-xs mt-1">Ahorras {formatCLP((plan.mensual - plan.anual) * 12)}/año</p>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {FEATURES.map(f => {
                  const included = f[plan.id as keyof typeof f]
                  return (
                    <li key={f.label} className={`flex items-start gap-2 text-sm ${included ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className={`mt-0.5 ${included ? 'text-green-400' : 'text-gray-700'}`}>{included ? '✓' : '—'}</span>
                      {f.label}
                    </li>
                  )
                })}
              </ul>
              <a
                href="#trial"
                className={`block text-center py-3 rounded-xl font-bold text-sm transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Prueba gratis 7 días
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Trial form */}
      <section className="px-6 py-16 max-w-2xl mx-auto" id="trial">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Prueba gratis 7 días</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Pega hasta 3 cuentas de Instagram y recibe tu primer clipping mañana a las 7 AM. Sin tarjeta.</p>

          {enviado ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">¡Listo!</h3>
              <p className="text-gray-400">Mañana a las 7:00 AM recibirás tu primer clipping en <strong className="text-white">{trialEmail}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleTrial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tu email</label>
                <input
                  type="email"
                  required
                  value={trialEmail}
                  onChange={e => setTrialEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              {trialUrls.map((url, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Cuenta Instagram {i + 1} {i === 0 ? '' : '(opcional)'}
                  </label>
                  <input
                    type="text"
                    required={i === 0}
                    value={url}
                    onChange={e => {
                      const n = [...trialUrls]
                      n[i] = e.target.value
                      setTrialUrls(n)
                    }}
                    placeholder="https://www.instagram.com/competidor/"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {enviando ? 'Activando...' : 'Activar prueba gratuita'}
              </button>
              <p className="text-center text-gray-600 text-xs">Sin tarjeta de crédito. 7 días gratis. Cancela cuando quieras.</p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center text-gray-600 text-sm border-t border-gray-800">
        <p>Radar es un producto de <a href="/" className="text-blue-400 hover:underline">Muller y Pérez</a> · Performance Marketing · Santiago, Chile</p>
      </footer>
    </div>
  )
}
