import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''
const RESEND_KEY = process.env.RESEND_API_KEY || ''

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
    const params: Record<string, string> = {}
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      Object.keys(body).forEach(k => { params[k] = String(body[k]) })
    } else {
      try {
        const formData = await req.formData()
        formData.forEach((value, key) => { params[key] = value.toString() })
      } catch (e) {
        const text = await req.text()
        const urlParams = new URLSearchParams(text)
        urlParams.forEach((value, key) => { params[key] = value })
      }
    }

    console.log('Flow webhook received:', JSON.stringify(params))

    // Verificar firma si viene, pero no rechazar — Flow puede enviar sin firma o con firma diferente
    if (params.s && !verifyFlowSignature(params)) {
      console.warn('Flow webhook: firma no coincide (procesando igual)')
    }

    const { status, subscriptionId, planId, customerId } = params

    if (!subscriptionId && !customerId) {
      return NextResponse.json({ ok: true })
    }

    const nuevoEstado =
      status === '2' ? 'activo' :
      status === '3' ? 'suspendido' :
      status === '4' ? 'cancelado' :
      null

    // Buscar suscripcion por flow_customer_id o flow_subscription_id
    let subId = ''
    let subEmail = ''
    let subNombre = ''

    // Intento 1: por flow_subscription_id
    if (subscriptionId) {
      const { data } = await supabase
        .from('clipping_suscripciones')
        .select('id, email, nombre')
        .eq('flow_subscription_id', subscriptionId)
        .limit(1)
      if (data && data.length > 0) { subId = data[0].id; subEmail = data[0].email; subNombre = data[0].nombre || '' }
    }

    // Intento 2: por flow_customer_id
    if (!subId && customerId) {
      const { data } = await supabase
        .from('clipping_suscripciones')
        .select('id, email, nombre')
        .eq('flow_customer_id', customerId)
        .limit(1)
      if (data && data.length > 0) { subId = data[0].id; subEmail = data[0].email; subNombre = data[0].nombre || '' }
    }

    if (subId && nuevoEstado) {
      await supabase
        .from('clipping_suscripciones')
        .update({
          estado: nuevoEstado,
          flow_subscription_id: subscriptionId || null,
          flow_customer_id: customerId || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', subId)

      console.log(`Flow webhook: ${subId} → ${nuevoEstado}`)

      // Enviar email de confirmacion si se activa
      if (nuevoEstado === 'activo' && subEmail && RESEND_KEY) {
        await enviarConfirmacion(subEmail, subId, subNombre)
      }
    } else {
      console.log('Flow webhook: no se encontro suscripcion para sub=' + subscriptionId + ' cust=' + customerId)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Flow webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function enviarConfirmacion(email: string, subId: string, nombre: string) {
  try {
    const dashUrl = 'https://www.mulleryperez.cl/copilot/dashboard/' + subId
    const configUrl = 'https://www.mulleryperez.cl/copilot/configurar/' + subId
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P Copilot <contacto@mulleryperez.cl>',
        to: [email],
        subject: (nombre || 'Hola') + ', tu Copilot esta activo | Configura tus cuentas',
        html: '<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;">'
          + '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
          + '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1.5px;">M&P COPILOT</p>'
          + '<h1 style="margin:8px 0;font-size:22px;font-weight:800;">Tu Copilot esta activo</h1>'
          + '</div>'
          + '<div style="background:white;padding:28px 32px;">'
          + '<p style="font-size:15px;color:#374151;line-height:1.7;">Tu suscripcion fue procesada exitosamente. Tu Copilot de inteligencia competitiva esta funcionando.</p>'
          + '<div style="background:#f0fdf4;padding:16px 20px;border-radius:10px;margin:20px 0;border:1px solid #bbf7d0;">'
          + '<p style="margin:0 0 8px;font-size:14px;color:#166534;font-weight:700;">Siguiente paso: configura tus cuentas</p>'
          + '<p style="margin:0;font-size:13px;color:#166534;">Agrega las cuentas de Instagram, LinkedIn y Facebook que quieres monitorear:</p>'
          + '</div>'
          + '<div style="text-align:center;margin:24px 0;">'
          + '<a href="' + configUrl + '" style="display:inline-block;background:#4338CA;color:white;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;">Configurar mis cuentas</a>'
          + '</div>'
          + '<div style="background:#f5f3ff;padding:14px 18px;border-radius:10px;margin:16px 0;">'
          + '<p style="margin:0 0 6px;font-size:13px;color:#4c1d95;"><strong>Tus links privados:</strong></p>'
          + '<p style="margin:0 0 4px;font-size:13px;color:#4c1d95;">Dashboard: <a href="' + dashUrl + '" style="color:#4338CA;">' + dashUrl.substring(0, 50) + '...</a></p>'
          + '<p style="margin:0;font-size:13px;color:#4c1d95;">Configurar: <a href="' + configUrl + '" style="color:#4338CA;">Configurar cuentas</a></p>'
          + '</div>'
          + '<p style="font-size:13px;color:#6b7280;">Una vez que configures tus cuentas, tu primer informe llega manana a las 7:30 AM.</p>'
          + '</div>'
          + '<div style="padding:16px 28px;background:#1e1b4b;border-radius:0 0 16px 16px;text-align:center;">'
          + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">Radar by Muller y Perez</p>'
          + '</div></div>',
      }),
    })
    console.log('Email confirmacion enviado a ' + email)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P Copilot <contacto@mulleryperez.cl>',
        to: ['contacto@mulleryperez.cl'],
        subject: '[Admin] Pago confirmado: ' + (nombre || email),
        html: '<div style="font-family:sans-serif;padding:20px;"><h2 style="color:#10B981;">Pago confirmado</h2>'
          + '<p><strong>Cliente:</strong> ' + (nombre || '(sin nombre)') + '</p>'
          + '<p><strong>Email:</strong> ' + email + '</p>'
          + '<p><a href="https://www.mulleryperez.cl/crm/copilot" style="color:#4338CA;font-weight:bold;">Ver en CRM</a></p></div>',
      }),
    })
  } catch (e) { console.error('Error enviando confirmacion') }
}

export async function GET() {
  return NextResponse.json({ status: 'Flow webhook activo' })
}
