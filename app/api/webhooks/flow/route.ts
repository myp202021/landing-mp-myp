import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''

function verifyFlowSignature(params: Record<string, string>): boolean {
  const sorted = Object.keys(params)
    .filter(k => k !== 's')
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  const hash = crypto.createHmac('sha256', FLOW_SECRET).update(sorted).digest('hex')
  return hash === params.s
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const params: Record<string, string> = {}
    formData.forEach((value, key) => { params[key] = value.toString() })

    if (!verifyFlowSignature(params)) {
      console.error('Flow webhook: firma inválida')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const { status, subscriptionId, planId, customerId } = params
    console.log(`Flow webhook: status=${status} sub=${subscriptionId} plan=${planId}`)

    if (!subscriptionId) {
      return NextResponse.json({ ok: true })
    }

    const nuevoEstado =
      status === '2' ? 'activo' :
      status === '3' ? 'suspendido' :
      status === '4' ? 'cancelado' :
      null

    if (!nuevoEstado) {
      console.log(`Flow webhook: status ${status} no mapeado, ignorando`)
      return NextResponse.json({ ok: true })
    }

    const { error } = await supabase
      .from('clipping_suscripciones')
      .update({
        estado: nuevoEstado,
        flow_subscription_id: subscriptionId,
        flow_customer_id: customerId || null,
        updated_at: new Date().toISOString()
      })
      .eq('flow_subscription_id', subscriptionId)

    if (error) {
      console.error('Flow webhook: error Supabase', error.message)
      const { error: err2 } = await supabase
        .from('clipping_suscripciones')
        .update({
          estado: nuevoEstado,
          flow_subscription_id: subscriptionId,
          updated_at: new Date().toISOString()
        })
        .eq('flow_customer_id', customerId)

      if (err2) console.error('Flow webhook: fallback también falló', err2.message)
    }

    console.log(`Flow webhook: suscripción ${subscriptionId} → ${nuevoEstado}`)
    return NextResponse.json({ ok: true })

  } catch (err: any) {
    console.error('Flow webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Flow webhook activo' })
}
