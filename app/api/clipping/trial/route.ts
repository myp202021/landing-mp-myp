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

    // TODO: enviar email de bienvenida con Resend

    console.log(`Trial creado: ${email} con ${cuentas.length} cuentas, expira ${trialEnds.toISOString().split('T')[0]}`)
    return NextResponse.json({ ok: true, trial_ends: trialEnds.toISOString() })

  } catch (err: any) {
    console.error('Error trial:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
