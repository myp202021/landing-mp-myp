import { NextRequest, NextResponse } from 'next/server'
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
    const { plan, email, nombre } = body

    if (!plan || !email || !PLAN_MAP[plan]) {
      return NextResponse.json({ error: 'Plan o email invalido' }, { status: 400 })
    }

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

    // Paso 2: Crear suscripcion
    const subData = await flowRequest('/subscription/create', {
      planId: planId,
      customerId: customerId,
      url_return: 'https://www.mulleryperez.cl/clipping/confirmacion',
      url_callback: 'https://www.mulleryperez.cl/api/webhooks/flow',
    })

    if (!subData.url && !subData.token) {
      console.error('Flow subscription error:', subData)
      return NextResponse.json({ error: 'Error creando suscripcion en Flow', detail: subData }, { status: 500 })
    }

    const redirectUrl = subData.url ? subData.url + '?token=' + subData.token : 'https://www.flow.cl/app/pay/suscription?token=' + subData.token
    return NextResponse.json({ url: redirectUrl })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
