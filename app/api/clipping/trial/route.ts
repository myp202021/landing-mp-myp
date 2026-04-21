import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, cuentas, nombre_empresa, descripcion, tono } = await req.json()

    if (!email || !cuentas || !Array.isArray(cuentas) || cuentas.length === 0) {
      return NextResponse.json({ error: 'Email y al menos 1 cuenta requeridos' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('clipping_suscripciones')
      .select('id, estado')
      .eq('email', email)
      .in('estado', ['trial', 'activo'])
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Ya tienes un trial o suscripción activa' }, { status: 409 })
    }

    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + 7)

    const { data, error } = await supabase
      .from('clipping_suscripciones')
      .insert({
        email,
        nombre: nombre_empresa || email.split('@')[0],
        plan: 'starter',
        periodo: 'mensual',
        estado: 'trial',
        cuentas,
        emails_destino: [email],
        trial_ends: trialEnds.toISOString(),
        perfil_empresa: nombre_empresa ? {
          nombre: nombre_empresa,
          descripcion: descripcion || '',
          tono: tono || 'profesional',
        } : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creando trial:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const subId = data?.id || ''
    const configUrl = 'https://www.mulleryperez.cl/radar/configurar/' + subId
    const dashUrl = 'https://www.mulleryperez.cl/radar/' + subId
    const cuentasStr = cuentas.filter((c: any) => c.red !== 'prensa').map((c: any) => c.red + ':' + c.handle).join(', ')

    // Email de bienvenida al usuario
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Radar <contacto@mulleryperez.cl>',
          to: [email],
          subject: 'Bienvenido a Radar | Tu prueba de 7 dias comienza ahora',
          html: '<div style="font-family:-apple-system,sans-serif;max-width:580px;margin:0 auto;">'
            + '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
            + '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1.5px;">RADAR BY MULLER Y PEREZ</p>'
            + '<h1 style="margin:8px 0;font-size:22px;font-weight:800;">Bienvenido a Radar</h1>'
            + '<p style="margin:0;font-size:14px;opacity:0.9;">Tu prueba gratuita de 7 dias esta activa</p>'
            + '</div>'
            + '<div style="background:white;padding:28px 32px;">'
            + '<p style="font-size:15px;color:#374151;line-height:1.7;">Hola! Tu Radar de inteligencia competitiva esta funcionando. Manana a las 7:30 AM recibiras tu primer informe diario con el monitoreo de tus competidores.</p>'
            + '<div style="background:#f0fdf4;padding:16px 20px;border-radius:10px;margin:20px 0;border:1px solid #bbf7d0;">'
            + '<p style="margin:0 0 8px;font-size:14px;color:#166534;font-weight:700;">Configura tus cuentas</p>'
            + '<p style="margin:0;font-size:13px;color:#166534;">Agrega las cuentas de Instagram, LinkedIn y Facebook de tus competidores:</p>'
            + '</div>'
            + '<div style="text-align:center;margin:24px 0;">'
            + '<a href="' + configUrl + '" style="display:inline-block;background:#4338CA;color:white;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;">Configurar mis cuentas</a>'
            + '</div>'
            + '<div style="background:#f5f3ff;padding:14px 18px;border-radius:10px;margin:16px 0;">'
            + '<p style="margin:0 0 6px;font-size:13px;color:#4c1d95;"><strong>Tus links privados:</strong></p>'
            + '<p style="margin:0 0 4px;font-size:13px;color:#4c1d95;">Dashboard: <a href="' + dashUrl + '" style="color:#4338CA;">' + dashUrl + '</a></p>'
            + '<p style="margin:0;font-size:13px;color:#4c1d95;">Configurar: <a href="' + configUrl + '" style="color:#4338CA;">Configurar cuentas</a></p>'
            + '</div>'
            + '<div style="text-align:center;margin:20px 0 8px;">'
            + '<a href="https://www.mulleryperez.cl/clipping/contratar/' + subId + '" style="display:inline-block;background:#10B981;color:white;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">Contratar plan</a>'
            + '</div>'
            + '<p style="font-size:13px;color:#6b7280;text-align:center;">Tu trial vence el ' + trialEnds.toISOString().split('T')[0] + '. Planes desde $34.990/mes.</p>'
            + '</div>'
            + '<div style="padding:16px 28px;background:#1e1b4b;border-radius:0 0 16px 16px;text-align:center;">'
            + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">Radar by Muller y Perez</p>'
            + '</div></div>',
        }),
      })
    } catch (emailErr) { console.error('Email bienvenida fallo:', emailErr) }

    // Notificar a M&P internamente
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Radar <contacto@mulleryperez.cl>',
          to: ['contacto@mulleryperez.cl'],
          subject: 'Nuevo trial Radar: ' + email,
          html: '<div style="font-family:sans-serif;padding:20px;">'
            + '<h2 style="color:#4338CA;">Nuevo trial Radar</h2>'
            + '<p><strong>Email:</strong> ' + email + '</p>'
            + '<p><strong>Empresa:</strong> ' + (nombre_empresa || '(no especificado)') + '</p>'
            + '<p><strong>Descripcion:</strong> ' + (descripcion || '(no especificado)') + '</p>'
            + '<p><strong>Cuentas:</strong> ' + cuentasStr + '</p>'
            + '<p><strong>Trial hasta:</strong> ' + trialEnds.toISOString().split('T')[0] + '</p>'
            + '<p style="margin-top:16px;"><a href="https://www.mulleryperez.cl/crm/radar" style="color:#4338CA;font-weight:bold;">Ver en panel CRM</a></p>'
            + '</div>',
        }),
      })
    } catch (notifErr) { console.error('Notificacion interna fallo (no critico)') }

    console.log(`Trial creado: ${email} con ${cuentas.length} cuentas, expira ${trialEnds.toISOString().split('T')[0]}`)
    return NextResponse.json({ ok: true, trial_ends: trialEnds.toISOString(), id: data?.id })

  } catch (err: any) {
    console.error('Error trial:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
