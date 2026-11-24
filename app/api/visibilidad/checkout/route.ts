// Contratar un plan: crea cliente en Flow, registra la tarjeta y, al volver, crea la suscripción (ver webhook y /visibilidad-ia/confirmacion).
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { PLANES, PlanKey, flow, guardarJson, leerJson, idEmail, dominio, Suscripcion } from '@/lib/visibilidad'

const SITIO = 'https://www.mulleryperez.cl'

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const plan = String(b.plan || '') as PlanKey
  const email = String(b.email || '').trim().toLowerCase(), nombre = String(b.nombre || '').trim().slice(0, 80)
  const empresa = String(b.empresa || '').trim().slice(0, 80), sitio = String(b.sitio || '').trim().slice(0, 120)
  if (!PLANES[plan] || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email) || !nombre || !empresa || !dominio(sitio) || !String(b.rubro || '').trim())
    return NextResponse.json({ error: 'Completa nombre, correo, empresa, sitio web y rubro.' }, { status: 400 })

  const id = idEmail(email), ruta = `suscripciones/${id}.json`
  const prev = await leerJson<Suscripcion>(ruta)
  if (prev?.estado === 'activo') return NextResponse.json({ url: `${SITIO}/visibilidad-ia/informe/${prev.token}` })

  let customerId = prev?.flowCustomerId || ''
  if (!customerId) {
    const c = await flow('/customer/create', { name: nombre.normalize('NFD').replace(/[^a-zA-Z0-9 ]/g, '') || email.split('@')[0], email, externalId: 'vis-' + id })
    customerId = c.customerId ? String(c.customerId) : ''
    if (!customerId) {
      const l = await flow('/customer/list', { start: '0', limit: '100', filter: email }, 'GET')
      const f = (l.data || []).find((x: { email: string }) => x.email === email)
      if (f) customerId = String(f.customerId)
    }
    if (!customerId) return NextResponse.json({ error: 'No pudimos iniciar el pago. Escríbenos a contacto@mulleryperez.cl.' }, { status: 502 })
  }
  const ahora = new Date().toISOString()
  const sus: Suscripcion = {
    id, email, nombre, empresa, sitio, rubro: String(b.rubro).trim().slice(0, 80), ciudad: String(b.ciudad || 'Chile').trim().slice(0, 60),
    competidores: (Array.isArray(b.competidores) ? b.competidores : []).map(String).filter(Boolean).slice(0, 3),
    plan, estado: 'pendiente', flowCustomerId: customerId, token: prev?.token || crypto.randomBytes(18).toString('base64url'),
    creado: prev?.creado || ahora, actualizado: ahora,
  }
  await guardarJson(ruta, sus)
  await guardarJson(`tokens/${sus.token}.json`, { id })
  const reg = await flow('/customer/register', { customerId, url_return: `${SITIO}/api/visibilidad/checkout/vuelta?id=${id}` })
  if (reg.url && reg.token) return NextResponse.json({ url: reg.url + '?token=' + reg.token })
  return NextResponse.json({ error: 'No pudimos abrir el registro de la tarjeta. Escríbenos a contacto@mulleryperez.cl.' }, { status: 502 })
}
