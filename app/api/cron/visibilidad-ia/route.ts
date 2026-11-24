// Cada día: mide a los suscriptores activos cuya medición venció (Básico cada 30 días, Pro cada 7). Guarda informes/<id>/<fecha>.json.
import { NextRequest, NextResponse } from 'next/server'
import { PLANES, listar, leerJson, guardarJson, medir, preguntas, hoyCL, Suscripcion } from '@/lib/visibilidad'

export const maxDuration = 300
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no' }, { status: 401 })
  const inicio = Date.now(), hechos: string[] = []
  for (const ruta of await listar('suscripciones')) {
    if (Date.now() - inicio > 200_000) break
    const s = await leerJson<Suscripcion>(ruta)
    if (!s || s.estado !== 'activo') continue
    const plan = PLANES[s.plan]
    if (s.ultimaMedicion && Date.now() - new Date(s.ultimaMedicion).getTime() < (plan.dias - 0.5) * 864e5) continue
    const resultados = await medir(s.empresa, s.sitio, preguntas(s.rubro, s.ciudad, plan.preguntas), 6)
    const fecha = hoyCL()
    await guardarJson(`informes/${s.id}/${fecha}.json`, { fecha, empresa: s.empresa, sitio: s.sitio, plan: s.plan, resultados })
    s.ultimaMedicion = new Date().toISOString(); await guardarJson(ruta, s); hechos.push(s.id)
  }
  return NextResponse.json({ ok: true, medidos: hechos.length })
}
