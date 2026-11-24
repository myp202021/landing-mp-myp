// Avisos de Flow sobre suscripciones de Visibilidad en IA (pago, suspensión, cancelación).
import { NextRequest, NextResponse } from 'next/server'
import { firmaValida, listar, leerJson, guardarJson, Suscripcion } from '@/lib/visibilidad'

export async function POST(req: NextRequest) {
  const p: Record<string, string> = {}
  ;(await req.formData().catch(() => new FormData())).forEach((v, k) => { p[k] = String(v) })
  if (!firmaValida(p)) return NextResponse.json({ ok: false }, { status: 401 })
  const estado = p.status === '2' ? 'activo' : p.status === '3' ? 'suspendido' : p.status === '4' ? 'cancelado' : null
  if (!estado) return NextResponse.json({ ok: true })
  for (const ruta of await listar('suscripciones')) {
    const s = await leerJson<Suscripcion>(ruta)
    if (s && (s.flowSubscriptionId === p.subscriptionId || s.flowCustomerId === p.customerId)) {
      Object.assign(s, { estado, actualizado: new Date().toISOString() }); await guardarJson(ruta, s)
    }
  }
  return NextResponse.json({ ok: true })
}
