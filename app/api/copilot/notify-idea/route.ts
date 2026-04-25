import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    var body = await req.json()
    var { idea_id, suscripcion_id, estado, titulo, descripcion, categoria } = body

    if (!idea_id || !suscripcion_id || !estado) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
    }

    // Solo notificar en estados relevantes
    if (estado !== 'aprobada' && estado !== 'descartada') {
      return NextResponse.json({ ok: true, notified: false })
    }

    // Obtener nombre del suscriptor
    var subRes = await supabase.from('clipping_suscripciones').select('nombre, email').eq('id', suscripcion_id).single()
    var clienteNombre = subRes.data?.nombre || subRes.data?.email || suscripcion_id

    var accion = estado === 'aprobada' ? 'APROBÓ' : 'DESCARTÓ'
    var color = estado === 'aprobada' ? '#06B6D4' : '#EF4444'
    var emoji = estado === 'aprobada' ? '✅' : '❌'

    var html = '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#0F0D2E;padding:24px;">'
      + '<div style="max-width:500px;margin:0 auto;background:#1a1745;border-radius:12px;overflow:hidden;">'
      + '<div style="background:' + color + ';padding:16px 24px;">'
      + '<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:1.5px;">M&P COPILOT</p>'
      + '<p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#fff;">' + emoji + ' Idea ' + estado + '</p>'
      + '</div>'
      + '<div style="padding:24px;">'
      + '<p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Cliente: <strong style="color:#fff;">' + clienteNombre + '</strong></p>'
      + '<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">' + (titulo || 'Sin título') + '</p>'
      + '<p style="margin:0 0 12px;font-size:12px;color:#a5b4fc;">' + (categoria || '') + '</p>'
      + (descripcion ? '<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">' + descripcion.substring(0, 300) + '</p>' : '')
      + '<p style="margin:16px 0 0;font-size:11px;color:#64748b;">Las ideas aprobadas se priorizan automáticamente en el próximo run de contenido.</p>'
      + '</div></div></div>'

    await resend.emails.send({
      from: 'Copilot <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      subject: emoji + ' [Copilot] ' + clienteNombre + ' ' + accion + ' idea: ' + (titulo || '').substring(0, 40),
      html: html,
    })

    return NextResponse.json({ ok: true, notified: true })
  } catch (e: any) {
    console.error('notify-idea error:', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
