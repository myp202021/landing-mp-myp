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

    // Notificar a M&P internamente
    try {
      const cuentasStr = cuentas.filter((c: any) => c.red !== 'prensa').map((c: any) => c.red + ':' + c.handle).join(', ')
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Radar <contacto@mulleryperez.cl>',
          to: ['contacto@mulleryperez.cl'],
          subject: `Nuevo trial Radar: ${email}`,
          html: `<div style="font-family:sans-serif;padding:20px;">
            <h2 style="color:#4338CA;">Nuevo trial Radar</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${nombre_empresa || '(no especificado)'}</p>
            <p><strong>Descripcion:</strong> ${descripcion || '(no especificado)'}</p>
            <p><strong>Cuentas:</strong> ${cuentasStr}</p>
            <p><strong>Trial hasta:</strong> ${trialEnds.toISOString().split('T')[0]}</p>
            <p style="margin-top:16px;"><a href="https://www.mulleryperez.cl/crm/radar" style="color:#4338CA;font-weight:bold;">Ver en panel CRM</a></p>
          </div>`,
        }),
      })
    } catch (notifErr) { console.error('Notificacion interna falló (no critico)') }

    console.log(`Trial creado: ${email} con ${cuentas.length} cuentas, expira ${trialEnds.toISOString().split('T')[0]}`)
    return NextResponse.json({ ok: true, trial_ends: trialEnds.toISOString(), id: data?.id })

  } catch (err: any) {
    console.error('Error trial:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
