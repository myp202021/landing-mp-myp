import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FLOW_API_KEY = process.env.FLOW_API_KEY || ''
const FLOW_SECRET = process.env.FLOW_SECRET_KEY || ''
const FLOW_URL = 'https://www.flow.cl/api'
const RESEND_KEY = process.env.RESEND_API_KEY || ''

function signFlow(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().map(function(k) { return k + '=' + params[k] }).join('&')
  return crypto.createHmac('sha256', FLOW_SECRET).update(sorted).digest('hex')
}

function verifyFlowSignature(params: Record<string, string>): boolean {
  const sorted = Object.keys(params)
    .filter(k => k !== 's')
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  const hash = crypto.createHmac('sha256', FLOW_SECRET).update(sorted).digest('hex')
  return hash === params.s
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

    console.log('Flow-agentes webhook received:', JSON.stringify(params))

    if (params.s && !verifyFlowSignature(params)) {
      console.warn('Flow-agentes webhook: firma no coincide (procesando igual)')
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
    let sub: any = null

    if (subscriptionId) {
      const { data } = await supabase
        .from('agentes_suscripciones')
        .select('*')
        .eq('flow_subscription_id', subscriptionId)
        .limit(1)
      if (data && data.length > 0) sub = data[0]
    }

    if (!sub && customerId) {
      const { data } = await supabase
        .from('agentes_suscripciones')
        .select('*')
        .eq('flow_customer_id', customerId)
        .limit(1)
      if (data && data.length > 0) sub = data[0]
    }

    if (sub && nuevoEstado) {
      await supabase
        .from('agentes_suscripciones')
        .update({
          estado: nuevoEstado,
          pagado: nuevoEstado === 'activo',
          flow_subscription_id: subscriptionId || sub.flow_subscription_id || null,
          flow_customer_id: customerId || sub.flow_customer_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sub.id)

      console.log('Flow-agentes webhook: ' + sub.id + ' -> ' + nuevoEstado)

      // Emails de notificacion
      if (RESEND_KEY) {
        if (nuevoEstado === 'activo') {
          await enviarEmailCliente(sub.email, sub.nombre)
          await enviarEmailAdmin(sub.email, sub.nombre, sub.empresa, sub.url_sitio, 'activo')
        } else if (nuevoEstado === 'suspendido' || nuevoEstado === 'cancelado') {
          await enviarEmailAdmin(sub.email, sub.nombre, sub.empresa, sub.url_sitio, nuevoEstado)
        }
      }
    } else if (sub && !nuevoEstado) {
      // Flow notifica registro de tarjeta — crear suscripcion
      if (sub.flow_customer_id && sub.flow_plan_pendiente) {
        const subData = await flowRequest('/subscription/create', {
          planId: sub.flow_plan_pendiente,
          customerId: sub.flow_customer_id,
          url_return: 'https://www.mulleryperez.cl/agentes/confirmacion?email=' + encodeURIComponent(sub.email),
          url_callback: 'https://www.mulleryperez.cl/api/webhooks/flow-agentes',
        })
        if (subData.subscriptionId) {
          await supabase.from('agentes_suscripciones').update({
            flow_subscription_id: String(subData.subscriptionId),
            estado: 'activo',
            pagado: true,
            updated_at: new Date().toISOString(),
          }).eq('id', sub.id)
          console.log('Flow-agentes: suscripcion creada post-tarjeta: ' + subData.subscriptionId)
          if (RESEND_KEY) {
            await enviarEmailCliente(sub.email, sub.nombre)
            await enviarEmailAdmin(sub.email, sub.nombre, sub.empresa, sub.url_sitio, 'activo')
          }
        }
      }
      console.log('Flow-agentes webhook: sin status definido para sub=' + (sub?.id || '?'))
    } else {
      console.log('Flow-agentes webhook: no se encontro suscripcion para sub=' + subscriptionId + ' cust=' + customerId)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Flow-agentes webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function enviarEmailCliente(email: string, nombre: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P Agentes <contacto@mulleryperez.cl>',
        to: [email],
        subject: (nombre || 'Hola') + ', tu Agente de Blog IA esta activo',
        html: '<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;">'
          + '<div style="background:linear-gradient(135deg,#059669,#10B981);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
          + '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1.5px;">M&P AGENTES IA</p>'
          + '<h1 style="margin:8px 0;font-size:22px;font-weight:800;">Tu Agente de Blog IA esta activo</h1>'
          + '</div>'
          + '<div style="background:white;padding:28px 32px;">'
          + '<p style="font-size:15px;color:#374151;line-height:1.7;">Tu suscripcion fue procesada exitosamente. Tu Agente de Blog IA comenzara a publicar contenido SEO en tu sitio.</p>'
          + '<div style="background:#f0fdf4;padding:16px 20px;border-radius:10px;margin:20px 0;border:1px solid #bbf7d0;">'
          + '<p style="margin:0 0 8px;font-size:14px;color:#166534;font-weight:700;">Proximos pasos</p>'
          + '<p style="margin:0;font-size:13px;color:#166534;">Te contactaremos en las proximas 48 horas para coordinar la reunion de onboarding y configurar tu agente.</p>'
          + '</div>'
          + '<div style="text-align:center;margin:24px 0;">'
          + '<a href="https://wa.me/56962470533" style="display:inline-block;background:#059669;color:white;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;">Contactar por WhatsApp</a>'
          + '</div>'
          + '<p style="font-size:13px;color:#6b7280;">Plan: Blog IA Mensual — $99.990 + IVA/mes — 24 articulos/mes</p>'
          + '</div>'
          + '<div style="padding:16px 28px;background:#064E3B;border-radius:0 0 16px 16px;text-align:center;">'
          + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">M&P Agentes IA by Muller y Perez</p>'
          + '</div></div>',
      }),
    })
    console.log('Email activacion enviado a ' + email)
  } catch (e) {
    console.error('Error enviando email cliente agentes:', e)
  }
}

async function enviarEmailAdmin(email: string, nombre: string, empresa: string, urlSitio: string, estado: string) {
  try {
    const asunto = estado === 'activo'
      ? '[Agentes IA] Nuevo cliente: ' + (nombre || email)
      : '[Agentes IA] ' + estado.charAt(0).toUpperCase() + estado.slice(1) + ': ' + (nombre || email)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P Agentes <contacto@mulleryperez.cl>',
        to: ['contacto@mulleryperez.cl'],
        subject: asunto,
        html: '<div style="font-family:sans-serif;padding:20px;">'
          + '<h2 style="color:' + (estado === 'activo' ? '#10B981' : estado === 'suspendido' ? '#F59E0B' : '#EF4444') + ';">'
          + 'Agente Blog IA — ' + estado.charAt(0).toUpperCase() + estado.slice(1) + '</h2>'
          + '<p><strong>Cliente:</strong> ' + (nombre || '(sin nombre)') + '</p>'
          + '<p><strong>Email:</strong> ' + email + '</p>'
          + (empresa ? '<p><strong>Empresa:</strong> ' + empresa + '</p>' : '')
          + (urlSitio ? '<p><strong>Sitio:</strong> ' + urlSitio + '</p>' : '')
          + '<p><a href="https://www.mulleryperez.cl/crm/agentes" style="color:#059669;font-weight:bold;">Ver en CRM</a></p></div>',
      }),
    })
  } catch (e) {
    console.error('Error enviando email admin agentes:', e)
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Flow-agentes webhook activo' })
}
