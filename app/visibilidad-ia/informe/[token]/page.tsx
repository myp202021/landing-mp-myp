// Informe privado del suscriptor (enlace con token, sin índice en buscadores).
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import { PLANES, leerJson, listar, Suscripcion, Resultado } from '@/lib/visibilidad'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Tu informe de visibilidad en IA | M&P', robots: { index: false, follow: false } }
type Informe = { fecha: string; resultados: Resultado[] }

export default async function Page({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ nuevo?: string }> }) {
  const { token } = await params, { nuevo } = await searchParams
  const t = await leerJson<{ id: string }>(`tokens/${token.replace(/[^A-Za-z0-9_-]/g, '')}.json`)
  const s = t ? await leerJson<Suscripcion>(`suscripciones/${t.id}.json`) : null
  if (!s) return (<><SiteHeader /><main className="mx-auto max-w-3xl px-6 pb-20 pt-32"><h1 className="text-3xl font-black">Informe no encontrado</h1><p className="mt-3">Revisa el enlace o escríbenos a contacto@mulleryperez.cl.</p></main></>)
  const rutas = (await listar(`informes/${s.id}`)).sort().reverse()
  const informes = (await Promise.all(rutas.slice(0, 12).map(r => leerJson<Informe>(r)))).filter(Boolean) as Informe[]
  const ult = informes[0], plan = PLANES[s.plan]
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-32 font-sans text-slate-900">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Visibilidad en IA · plan {plan.nombre}</p>
        <h1 className="mt-2 text-4xl font-black">{s.empresa}</h1>
        <p className="mt-1 text-slate-600">{s.rubro} · {s.ciudad} · {s.sitio}</p>
        {nuevo && <p className="mt-6 rounded-xl bg-green-50 p-4 font-semibold text-green-800">¡Listo! Tu suscripción está activa. Guarda este enlace: aquí verás cada medición. La primera queda lista dentro de 24 horas.</p>}
        {s.estado !== 'activo' && <p className="mt-6 rounded-xl bg-amber-50 p-4 font-semibold text-amber-800">Tu suscripción está {s.estado}. Escríbenos a contacto@mulleryperez.cl.</p>}
        {!ult ? <p className="mt-10 text-lg">Aún no hay mediciones. La primera ({plan.preguntas} preguntas) se hace dentro de 24 horas.</p> : (
          <>
            <h2 className="mt-10 text-2xl font-black">Medición del {ult.fecha.split('-').reverse().join('-')}: apareces en {ult.resultados.filter(r => r.puesto).length} de {ult.resultados.length} preguntas</h2>
            {informes.length > 1 && <p className="mt-2 text-slate-600">Historial: {informes.map(i => `${i.fecha.split('-').reverse().join('-')}: ${i.resultados.filter(r => r.puesto).length}/${i.resultados.length}`).join(' · ')}</p>}
            <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b-2 border-slate-900"><th className="py-2">Pregunta a ChatGPT</th><th>Tu puesto</th><th>Recomienda primero</th></tr></thead>
              <tbody>{ult.resultados.map(r => (<tr key={r.pregunta} className="border-b border-slate-200 align-top"><td className="py-2 pr-4">{r.pregunta}</td><td className={'pr-4 font-bold ' + (r.puesto ? 'text-green-700' : 'text-red-600')}>{r.error ? 'sin medir' : r.puesto ? '#' + r.puesto : r.mencion ? 'mencionado' : 'no aparece'}</td><td className="text-slate-600">{r.empresas.slice(0, 3).join(' · ')}</td></tr>))}</tbody></table></div>
          </>
        )}
        <p className="mt-10 text-xs text-slate-500">Las respuestas de la IA cambian de un día a otro: cada medición es una foto del día. Para cancelar o cambiar de plan: contacto@mulleryperez.cl.</p>
      </main>
    </>
  )
}
