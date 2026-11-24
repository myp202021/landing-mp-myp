// Prueba gratis: 3 preguntas a ChatGPT. Límite: 1 por correo cada 7 días, 3 por IP al día y tope diario global (costo controlado).
import { NextRequest, NextResponse } from 'next/server'
import { medir, preguntas, guardarJson, leerJson, idEmail, hoyCL, dominio } from '@/lib/visibilidad'

export const maxDuration = 120
const TOPE_DIARIO = Number(process.env.VISIBILIDAD_TOPE_DIARIO || 150)

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const email = String(b.email || '').trim().toLowerCase(), empresa = String(b.empresa || '').trim().slice(0, 80)
  const sitio = String(b.sitio || '').trim().slice(0, 120), rubro = String(b.rubro || '').trim().slice(0, 80), ciudad = String(b.ciudad || 'Chile').trim().slice(0, 60)
  if (b.web2) return NextResponse.json({ ok: true, resultados: [] }) // trampa para bots
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email) || !empresa || !rubro || !dominio(sitio)) return NextResponse.json({ error: 'Completa correo, empresa, sitio web y rubro.' }, { status: 400 })

  const hoy = hoyCL(), ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'sin-ip'
  const cont = (await leerJson<{ total: number; ips: Record<string, number> }>(`contadores/${hoy}.json`)) || { total: 0, ips: {} }
  const previo = await leerJson<{ fecha: string; resultados: unknown }>(`pruebas/${idEmail(email)}.json`)
  if (previo && (Date.now() - new Date(previo.fecha).getTime()) < 7 * 864e5) return NextResponse.json({ ok: true, repetida: true, ...previo })
  if (cont.total >= TOPE_DIARIO || (cont.ips[ip] || 0) >= 3) return NextResponse.json({ error: 'Hoy se agotaron las pruebas gratis. Vuelve mañana o contrata un plan.' }, { status: 429 })
  cont.total++; cont.ips[ip] = (cont.ips[ip] || 0) + 1
  await guardarJson(`contadores/${hoy}.json`, cont)

  const resultados = await medir(empresa, sitio, preguntas(rubro, ciudad, 3), 3)
  const registro = { fecha: new Date().toISOString(), email, empresa, sitio, rubro, ciudad, ip, origen: String(b.origen || '').slice(0, 60), resultados }
  await guardarJson(`pruebas/${idEmail(email)}.json`, registro)
  return NextResponse.json({ ok: true, ...registro, ip: undefined })
}
