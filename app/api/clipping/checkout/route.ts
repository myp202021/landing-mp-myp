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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plan, email, nombre } = body

    if (!plan || !email || !PLAN_MAP[plan]) {
      return NextResponse.json({ error: 'Plan o email invalido' }, { status: 400 })
    }

    const planId = PLAN_MAP[plan]
    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      planId: planId,
      customer_email: email,
      customer_name: nombre || email.split('@')[0],
      url_return: 'https://www.mulleryperez.cl/clipping/confirmacion',
      url_confirm: 'https://www.mulleryperez.cl/api/webhooks/flow',
    }
    params.s = signFlow(params)

    const formBody = Object.keys(params).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    }).join('&')

    const res = await fetch(FLOW_URL + '/subscription/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    })

    const data = await res.json()

    if (!res.ok || !data.url) {
      console.error('Flow checkout error:', data)
      return NextResponse.json({ error: 'Error al crear suscripcion en Flow', detail: data }, { status: 500 })
    }

    return NextResponse.json({ url: data.url + '?token=' + data.token })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
