import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const FLOW_API_KEY = process.env.FLOW_API_KEY || ''
const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''
const FLOW_URL = 'https://www.flow.cl/api'

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
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: subs } = await supabase
      .from('clipping_suscripciones')
      .select('id, email, flow_customer_id, flow_plan_pendiente, estado')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!subs || subs.length === 0) {
      return NextResponse.json({ error: 'Suscripcion no encontrada' }, { status: 404 })
    }

    const sub = subs[0]

    if (sub.estado === 'activo') {
      return NextResponse.json({ status: 'activo', message: 'Ya esta activo' })
    }

    if (!sub.flow_customer_id || !sub.flow_plan_pendiente) {
      return NextResponse.json({ status: sub.estado, message: 'Sin plan pendiente' })
    }

    const subData = await flowRequest('/subscription/create', {
      planId: sub.flow_plan_pendiente,
      customerId: sub.flow_customer_id,
      url_return: 'https://www.mulleryperez.cl/copilot/confirmacion?email=' + encodeURIComponent(email),
      url_callback: 'https://www.mulleryperez.cl/api/webhooks/flow',
    })

    if (subData.subscriptionId) {
      await supabase.from('clipping_suscripciones').update({
        flow_subscription_id: String(subData.subscriptionId),
        estado: 'activo',
        flow_plan_pendiente: null,
        updated_at: new Date().toISOString(),
      }).eq('id', sub.id)

      return NextResponse.json({ status: 'activo', subscriptionId: subData.subscriptionId })
    }

    console.error('Flow activar error:', subData)
    return NextResponse.json({ status: 'error', detail: subData }, { status: 500 })
  } catch (err: any) {
    console.error('Activar error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
