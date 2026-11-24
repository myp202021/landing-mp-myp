// Flow vuelve aquí tras registrar la tarjeta: se crea la suscripción y se manda al informe.
import { NextRequest, NextResponse } from 'next/server'
import { PLANES, flow, guardarJson, leerJson, Suscripcion } from '@/lib/visibilidad'

const SITIO = 'https://www.mulleryperez.cl'
async function vuelta(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || ''
  const ruta = `suscripciones/${id}.json`, sus = await leerJson<Suscripcion>(ruta)
  if (!sus || !sus.flowCustomerId) return NextResponse.redirect(`${SITIO}/visibilidad-ia?error=sin-registro`, 303)
  if (sus.estado !== 'activo') {
    const c = await flow('/customer/get', { customerId: sus.flowCustomerId }, 'GET')
    if (!c.creditCardType && !c.last4CardDigits) return NextResponse.redirect(`${SITIO}/visibilidad-ia?error=tarjeta`, 303)
    const s = await flow('/subscription/create', { planId: PLANES[sus.plan].planId, customerId: sus.flowCustomerId })
    if (!s.subscriptionId) return NextResponse.redirect(`${SITIO}/visibilidad-ia?error=suscripcion`, 303)
    Object.assign(sus, { flowSubscriptionId: String(s.subscriptionId), estado: 'activo', actualizado: new Date().toISOString() })
    await guardarJson(ruta, sus)
  }
  return NextResponse.redirect(`${SITIO}/visibilidad-ia/informe/${sus.token}?nuevo=1`, 303)
}
export const GET = vuelta
export const POST = vuelta
