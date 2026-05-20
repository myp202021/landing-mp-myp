import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const FLOW_API_KEY = process.env.FLOW_API_KEY || ''
const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''
const FLOW_URL = 'https://www.flow.cl/api'

const PLAN_ID = 'BLOG-IA-MENSUAL'

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
    const { email, nombre, empresa, urlSitio, plataforma } = body

    if (!email || !nombre) {
      return NextResponse.json({ error: 'Email y nombre son requeridos' }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const returnUrl = 'https://www.mulleryperez.cl/agentes/confirmacion?email=' + encodeURIComponent(email)
    const callbackUrl = 'https://www.mulleryperez.cl/api/webhooks/flow-agentes'
    const customerName = (nombre || email.split('@')[0]).replace(/[^a-zA-Z0-9 ]/g, '')

    // Paso 1: Crear o obtener customer en Flow
    console.log('Agentes checkout: email=' + email + ' nombre=' + nombre)
    const custData = await flowRequest('/customer/create', {
      name: customerName,
      email: email,
      externalId: email,
    })
    console.log('Flow customer/create response:', JSON.stringify(custData))

    let customerId = ''
    if (custData.customerId) {
      customerId = String(custData.customerId)
    } else if (custData.code === 300 || custData.code === 501 || (custData.message && custData.message.includes('externalId'))) {
      // Customer ya existe, buscarlo
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

    // Guardar en Supabase (upsert por email)
    const { data: existing } = await supabase
      .from('agentes_suscripciones')
      .select('id')
      .eq('email', email)
      .limit(1)

    let suscripcionId = ''
    if (existing && existing.length > 0) {
      suscripcionId = existing[0].id
      await supabase.from('agentes_suscripciones').update({
        nombre,
        empresa: empresa || null,
        url_sitio: urlSitio || null,
        plataforma: plataforma || null,
        flow_customer_id: customerId,
        updated_at: new Date().toISOString(),
      }).eq('id', suscripcionId)
    } else {
      const { data: inserted } = await supabase.from('agentes_suscripciones').insert({
        nombre,
        email,
        empresa: empresa || null,
        url_sitio: urlSitio || null,
        plataforma: plataforma || null,
        flow_customer_id: customerId,
        estado: 'pendiente',
      }).select('id').single()
      if (inserted) suscripcionId = inserted.id
    }

    // Paso 2: Registrar tarjeta del customer (genera URL de pago)
    const regData = await flowRequest('/customer/register', {
      customerId: customerId,
      url_return: returnUrl,
    })
    console.log('Flow customer/register response:', JSON.stringify(regData))

    if (regData.url && regData.token) {
      // Guardar plan pendiente
      await supabase.from('agentes_suscripciones').update({
        flow_plan_pendiente: PLAN_ID,
        updated_at: new Date().toISOString(),
      }).eq(suscripcionId ? 'id' : 'email', suscripcionId || email)
      return NextResponse.json({ url: regData.url + '?token=' + regData.token })
    }

    // Si customer ya tiene tarjeta, crear suscripcion directamente
    const subData = await flowRequest('/subscription/create', {
      planId: PLAN_ID,
      customerId: customerId,
      url_return: returnUrl,
      url_callback: callbackUrl,
    })

    if (subData.subscriptionId) {
      await supabase.from('agentes_suscripciones').update({
        flow_subscription_id: String(subData.subscriptionId),
        estado: 'activo',
        pagado: true,
        updated_at: new Date().toISOString(),
      }).eq(suscripcionId ? 'id' : 'email', suscripcionId || email)
      return NextResponse.json({ url: returnUrl, subscriptionId: subData.subscriptionId })
    }

    // Si Flow rechaza (suscripcion duplicada)
    console.warn('Flow subscription/create respondio:', JSON.stringify(subData))
    if (subData.code === 300 || subData.code === 501 || (subData.message && subData.message.includes('already'))) {
      await supabase.from('agentes_suscripciones').update({
        estado: 'activo',
        pagado: true,
        updated_at: new Date().toISOString(),
      }).eq(suscripcionId ? 'id' : 'email', suscripcionId || email)
      return NextResponse.json({ url: returnUrl })
    }

    console.error('Flow error:', subData)
    return NextResponse.json({ error: 'Error en Flow', detail: subData }, { status: 500 })
  } catch (err: any) {
    console.error('Agentes checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
