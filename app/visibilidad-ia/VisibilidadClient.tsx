'use client'
// Visibilidad en IA (24 nov 2026): prueba gratis (3 preguntas a ChatGPT) + planes con pago Flow.
import { useState } from 'react'

type Res = { pregunta: string; puesto: number | null; mencion: boolean; empresas: string[]; error?: string }
const PLANES = [
  { k: 'basico', n: 'Básico', p: '$9.990', d: 'al mes', items: ['10 preguntas de tu rubro a ChatGPT', 'Medición mensual', 'Tu puesto en cada respuesta', 'A quién recomienda en tu lugar', 'Informe privado en línea'] },
  { k: 'pro', n: 'Pro', p: '$49.990', d: 'al mes', destacado: true, items: ['30 preguntas de tu rubro', 'Medición semanal', 'Hasta 3 competidores comparados', 'Evolución semana a semana', 'Informe privado en línea'] },
  { k: 'agente', n: 'Pro + agente', p: '$99.990', d: 'al mes', items: ['Todo lo del plan Pro', 'Revisión de tu sitio para que la IA lo entienda', 'Recomendaciones concretas cada mes', 'Contacto directo con el equipo M&P'] },
]
const inp = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600'

export default function VisibilidadClient() {
  const [f, setF] = useState({ empresa: '', sitio: '', rubro: '', ciudad: 'Santiago', email: '', nombre: '', web2: '' })
  const [res, setRes] = useState<Res[] | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  async function probar(e: React.FormEvent) {
    e.preventDefault(); setError(''); setCargando(true); setRes(null)
    try {
      const r = await fetch('/api/visibilidad/prueba', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, origen: new URLSearchParams(location.search).get('utm_source') || '' }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'No pudimos hacer la prueba')
      setRes(j.resultados); setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) { setError((err as Error).message) } finally { setCargando(false) }
  }
  async function contratar(k: string) {
    setError('')
    if (!f.nombre || !f.email || !f.empresa || !f.sitio || !f.rubro) { setPlan(k); document.getElementById('datos')?.scrollIntoView({ behavior: 'smooth' }); setError('Completa tus datos para contratar.'); return }
    setPlan(k); setCargando(true)
    try {
      const r = await fetch('/api/visibilidad/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, plan: k }) })
      const j = await r.json()
      if (!r.ok || !j.url) throw new Error(j.error || 'No pudimos abrir el pago')
      location.href = j.url
    } catch (err) { setError((err as Error).message); setCargando(false) }
  }
  const apareces = res ? res.filter(r => r.puesto).length : 0

  return (
    <main className="font-sans bg-slate-50 text-slate-900">
      <section className="bg-[#07061A] px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Visibilidad en IA · M&amp;P</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">¿ChatGPT recomienda tu empresa?</h1>
          <p className="mt-5 max-w-2xl text-lg text-blue-100/80">Cada vez más clientes le preguntan a ChatGPT «¿qué empresa me recomiendas?». Te mostramos en un minuto si apareces, en qué lugar y a quién nombra en tu lugar.</p>

          <form id="datos" onSubmit={probar} className="mt-10 grid gap-3 rounded-2xl bg-white p-6 text-slate-900 shadow-xl md:grid-cols-2">
            <label className="text-sm font-semibold">Nombre de tu empresa<input required className={inp} value={f.empresa} onChange={set('empresa')} placeholder="Ej.: Muller y Pérez" /></label>
            <label className="text-sm font-semibold">Sitio web<input required className={inp} value={f.sitio} onChange={set('sitio')} placeholder="tuempresa.cl" /></label>
            <label className="text-sm font-semibold">¿Qué vendes? (rubro o servicio)<input required className={inp} value={f.rubro} onChange={set('rubro')} placeholder="Ej.: marketing digital, corretaje de propiedades" /></label>
            <label className="text-sm font-semibold">Ciudad<input className={inp} value={f.ciudad} onChange={set('ciudad')} placeholder="Santiago" /></label>
            <label className="text-sm font-semibold">Tu nombre<input className={inp} value={f.nombre} onChange={set('nombre')} placeholder="Para el informe" /></label>
            <label className="text-sm font-semibold">Correo<input required type="email" className={inp} value={f.email} onChange={set('email')} placeholder="tu@empresa.cl" /></label>
            <input tabIndex={-1} autoComplete="off" className="hidden" value={f.web2} onChange={set('web2')} aria-hidden="true" />
            <button disabled={cargando} className="mt-2 rounded-xl bg-blue-600 px-6 py-3.5 text-lg font-bold text-white hover:bg-blue-700 disabled:opacity-60 md:col-span-2">
              {cargando && !plan ? 'Preguntándole a ChatGPT… (hasta 1 minuto)' : 'Probar gratis'}
            </button>
            {error && <p className="text-sm font-semibold text-red-600 md:col-span-2">{error}</p>}
            <p className="text-xs text-slate-500 md:col-span-2">Hacemos 3 preguntas reales a ChatGPT con búsqueda web, como lo haría un cliente en Chile. Al probar aceptas nuestra <a className="underline" href="/privacy">política de privacidad</a>.</p>
          </form>
        </div>
      </section>

      {res && (
        <section id="resultado" className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-3xl font-black">{apareces ? `ChatGPT te recomienda en ${apareces} de ${res.length} preguntas` : `ChatGPT no te recomienda en ninguna de las ${res.length} preguntas`}</h2>
          <p className="mt-2 text-slate-600">Las respuestas de la IA cambian de un día a otro: esto es una foto de hoy. Por eso conviene medir cada mes o cada semana.</p>
          <div className="mt-6 grid gap-4">
            {res.map(r => (
              <div key={r.pregunta} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="font-semibold">«{r.pregunta}»</p>
                <p className={'mt-2 text-lg font-black ' + (r.puesto ? 'text-green-700' : 'text-red-600')}>
                  {r.error ? 'No pudimos medir esta pregunta' : r.puesto ? `Apareces en el puesto #${r.puesto}` : r.mencion ? 'Te nombra, pero no en la lista' : 'No apareces'}
                </p>
                {!r.puesto && r.empresas.length > 0 && <p className="mt-1 text-sm text-slate-600">Recomienda en tu lugar: {r.empresas.slice(0, 5).join(' · ')}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-3xl font-black">Mide tu visibilidad en IA todos los meses</h2>
        <p className="mt-2 text-slate-600">Sin contrato: pagas mes a mes con tarjeta vía Flow y cancelas cuando quieras. Precios en pesos, IVA incluido.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PLANES.map(p => (
            <div key={p.k} className={'flex flex-col rounded-2xl border bg-white p-6 ' + (p.destacado ? 'border-blue-600 shadow-lg' : 'border-slate-200')}>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{p.n}</p>
              <p className="mt-2 text-4xl font-black">{p.p}<span className="text-base font-semibold text-slate-500"> {p.d}</span></p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">{p.items.map(i => <li key={i}>✓ {i}</li>)}</ul>
              <button onClick={() => contratar(p.k)} disabled={cargando} className={'mt-6 rounded-xl px-5 py-3 font-bold ' + (p.destacado ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-700') + ' disabled:opacity-60'}>
                {cargando && plan === p.k ? 'Abriendo el pago…' : 'Contratar'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-2xl font-black">Preguntas frecuentes</h2>
        {[
          ['¿Cómo miden?', 'Le hacemos a ChatGPT, con búsqueda web y ubicado en Chile, las mismas preguntas que haría un cliente («recomiéndame empresas de tu rubro en tu ciudad») y revisamos si tu empresa aparece, en qué lugar y a quién nombra.'],
          ['¿Por qué cambia el resultado?', 'La IA responde distinto según el día y la conversación. Por eso medimos varias preguntas y repetimos cada mes (Básico) o cada semana (Pro).'],
          ['¿Cómo pago y cómo cancelo?', 'Con tarjeta a través de Flow, en pesos y mes a mes. Para cancelar basta escribir a contacto@mulleryperez.cl.'],
          ['¿Quién está detrás?', 'Muller y Pérez, agencia de marketing digital en Santiago, Socio de Google, que mide la visibilidad en IA de sus clientes cada mes.'],
        ].map(([q, a]) => (
          <details key={q} className="mt-3 rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-slate-600">{a}</p></details>
        ))}
      </section>
    </main>
  )
}
