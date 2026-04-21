import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const FLOW_API_KEY = process.env.FLOW_API_KEY || ''
const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''
const FLOW_URL = 'https://www.flow.cl/api'

const PLAN_MAP: Record<string, string> = {
  'starter-mensual': 'RADAR-STARTER-MENSUAL',
  'starter-anual': 'RADAR-STARTER-ANUAL',
  'pro-mensual': 'RADAR-PRO-MENSUAL',
  'pro-anual': 'RADAR-PRO-ANUAL',
  'business-mensual': 'RADAR-BUSINESS-MENSUAL',
  'business-anual': 'RADAR-BUSINESS-ANUAL',
  'test-mensual': 'RADAR-TEST',
}

function signFlow(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().map(function(k) { return k + '=' + params[k] }).join('&')
  return crypto.createHmac('sha256', FLOW_SECRET).update(sorted).digest('hex')
}

async function flowRequest(endpoint: string, params: Record<string, string>) {
  params.apiKey = FLOW_API_KEY
  params.s = signFlow(params)
  const formBody = Object.keys(params).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
  }).join('&')
  const res = await fetch(FLOW_URL + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  })
  return await res.json()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plan, email, nombre, suscripcionId } = body

    if (!plan || !email || !PLAN_MAP[plan]) {
      return NextResponse.json({ error: 'Plan o email invalido' }, { status: 400 })
    }

    const returnUrl = 'https://www.mulleryperez.cl/clipping/confirmacion?email=' + encodeURIComponent(email)

    const planId = PLAN_MAP[plan]
    const customerName = (nombre || email.split('@')[0]).replace(/[^a-zA-Z0-9 ]/g, '')

    // Paso 1: Crear o obtener customer en Flow
    const custData = await flowRequest('/customer/create', {
      name: customerName,
      email: email,
      externalId: email,
    })

    let customerId = ''
    if (custData.customerId) {
      customerId = String(custData.customerId)
    } else if (custData.code === 300 || custData.code === 501 || (custData.message && custData.message.includes('externalId'))) {
      // Customer ya existe, buscarlo en la lista
      const listParams: Record<string, string> = { apiKey: FLOW_API_KEY, start: '0', limit: '100' }
      listParams.s = signFlow(listParams)
      const listQs = Object.keys(listParams).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(listParams[k]) }).join('&')
      const listRes = await fetch(FLOW_URL + '/customer/list?' + listQs)
      const listData = await listRes.json()
      if (listData.data && Array.isArray(listData.data)) {
        const found = listData.data.find(function(c: any) { return c.email === email })
        if (found) customerId = String(found.customerId)
      }
    }

    if (!customerId) {
      console.error('Flow customer error:', custData)
      return NextResponse.json({ error: 'Error creando cliente en Flow', detail: custData }, { status: 500 })
    }

    // Guardar flow_customer_id en Supabase (para que el webhook pueda encontrar la suscripcion)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const updateFilter = suscripcionId
      ? supabase.from('clipping_suscripciones').update({ flow_customer_id: customerId, updated_at: new Date().toISOString() }).eq('id', suscripcionId)
      : supabase.from('clipping_suscripciones').update({ flow_customer_id: customerId, updated_at: new Date().toISOString() }).eq('email', email)
    await updateFilter

    // Paso 2: Registrar tarjeta del customer (genera URL de pago)
    const regData = await flowRequest('/customer/register', {
      customerId: customerId,
      url_return: returnUrl,
    })

    if (regData.url && regData.token) {
      const planBase = plan.split('-')[0]
      const periodo = plan.split('-')[1] || 'mensual'
      await supabase.from('clipping_suscripciones').update({
        plan: planBase,
        periodo: periodo,
        flow_plan_pendiente: planId,
        updated_at: new Date().toISOString(),
      }).eq(suscripcionId ? 'id' : 'email', suscripcionId || email)
      return NextResponse.json({ url: regData.url + '?token=' + regData.token })
    }

    // Si customer ya tiene tarjeta, crear suscripcion directamente
    const subData = await flowRequest('/subscription/create', {
      planId: planId,
      customerId: customerId,
      url_return: returnUrl,
      url_callback: 'https://www.mulleryperez.cl/api/webhooks/flow',
    })

    const planBase = plan.split('-')[0]
    const periodo = plan.split('-')[1] || 'mensual'

    if (subData.subscriptionId) {
      await supabase.from('clipping_suscripciones').update({
        flow_subscription_id: String(subData.subscriptionId),
        plan: planBase,
        periodo: periodo,
        estado: 'activo',
        updated_at: new Date().toISOString(),
      }).eq(suscripcionId ? 'id' : 'email', suscripcionId || email)
      return NextResponse.json({ url: returnUrl, subscriptionId: subData.subscriptionId })
    }

    // Si Flow rechaza (suscripcion duplicada u otro error), activar de todas formas
    // ya que el customer tiene tarjeta registrada
    console.warn('Flow subscription/create respondio:', JSON.stringify(subData))
    if (subData.code === 300 || subData.code === 501 || (subData.message && subData.message.includes('already'))) {
      await supabase.from('clipping_suscripciones').update({
        plan: planBase,
        periodo: periodo,
        estado: 'activo',
        updated_at: new Date().toISOString(),
      }).eq(suscripcionId ? 'id' : 'email', suscripcionId || email)
      return NextResponse.json({ url: returnUrl })
    }

    console.error('Flow error:', subData)
    return NextResponse.json({ error: 'Error en Flow', detail: subData }, { status: 500 })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
