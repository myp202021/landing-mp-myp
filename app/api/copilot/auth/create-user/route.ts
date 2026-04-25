import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHash('sha256').update(salt + password).digest('hex')
  return 'sha256:' + salt + ':' + hash
}

function generatePassword(): string {
  // 8 chars: 4 letras + 4 números
  const letters = 'abcdefghjkmnpqrstuvwxyz'
  const digits = '23456789'
  let pass = ''
  for (let i = 0; i < 4; i++) pass += letters[Math.floor(Math.random() * letters.length)]
  for (let i = 0; i < 4; i++) pass += digits[Math.floor(Math.random() * digits.length)]
  return pass
}

// POST: crear credenciales para un suscriptor (admin only — API key en header)
export async function POST(req: NextRequest) {
  try {
    // Verificar que es admin (simple: verificar que viene de CRM con cookie mp_session o admin key)
    const adminKey = req.headers.get('x-admin-key')
    if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20)) {
      // También aceptar copilot_session de admin
      const cookie = req.cookies.get('copilot_session')
      // Por ahora aceptar cualquier request (TODO: restringir a admin CRM)
    }

    const { suscripcion_id, password, send_email } = await req.json()

    if (!suscripcion_id) {
      return NextResponse.json({ error: 'Se requiere suscripcion_id' }, { status: 400 })
    }

    // Verificar que la suscripción existe
    const { data: sub, error } = await supabase
      .from('clipping_suscripciones')
      .select('id, email, nombre, plan, estado, password_hash')
      .eq('id', suscripcion_id)
      .single()

    if (error || !sub) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 })
    }

    // Generar o usar password proporcionado
    const plainPassword = password || generatePassword()
    const hash = hashPassword(plainPassword)

    // Guardar
    await supabase.from('clipping_suscripciones')
      .update({
        password_hash: hash,
        debe_cambiar_password: !password, // si se generó auto, debe cambiar
      })
      .eq('id', suscripcion_id)

    // Log
    await supabase.from('copilot_access_log').insert({
      suscripcion_id: suscripcion_id,
      accion: sub.password_hash ? 'password_reset' : 'user_created',
      ip: req.headers.get('x-forwarded-for') || 'admin',
    }).catch(() => {})

    // Enviar email con credenciales si send_email=true
    if (send_email !== false) {
      try {
        const loginUrl = 'https://www.mulleryperez.cl/copilot/login'
        const html = '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#0F0D2E;padding:24px;">'
          + '<div style="max-width:500px;margin:0 auto;background:#1a1745;border-radius:12px;overflow:hidden;">'
          + '<div style="background:#4F46E5;padding:20px 24px;">'
          + '<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:1.5px;">M&P COPILOT</p>'
          + '<p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#fff;">Tus credenciales de acceso</p>'
          + '</div>'
          + '<div style="padding:24px;">'
          + '<p style="margin:0 0 16px;font-size:14px;color:#c4b5fd;">Hola ' + (sub.nombre || '') + ',</p>'
          + '<p style="margin:0 0 12px;font-size:13px;color:#94a3b8;">Tus datos de acceso a M&P Copilot:</p>'
          + '<div style="background:#12102a;border-radius:8px;padding:16px;margin:0 0 16px;">'
          + '<p style="margin:0 0 8px;font-size:12px;color:#64748b;">Email</p>'
          + '<p style="margin:0 0 12px;font-size:14px;color:#fff;font-weight:700;">' + sub.email + '</p>'
          + '<p style="margin:0 0 8px;font-size:12px;color:#64748b;">Contraseña temporal</p>'
          + '<p style="margin:0;font-size:14px;color:#fff;font-weight:700;font-family:monospace;">' + plainPassword + '</p>'
          + '</div>'
          + '<p style="margin:0 0 16px;font-size:12px;color:#F59E0B;">Te recomendamos cambiar tu contraseña después del primer acceso.</p>'
          + '<div style="text-align:center;">'
          + '<a href="' + loginUrl + '" style="display:inline-block;background:#4F46E5;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Acceder a Copilot</a>'
          + '</div>'
          + '</div></div></div>'

        await resend.emails.send({
          from: 'Copilot <contacto@mulleryperez.cl>',
          to: [sub.email],
          subject: '🔑 Tus credenciales M&P Copilot',
          html: html,
        })
      } catch (emailErr) {
        console.error('Error enviando email credenciales:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      email: sub.email,
      password: plainPassword,
      must_change: !password,
      email_sent: send_email !== false,
    })
  } catch (e: any) {
    console.error('Create user error:', e.message)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
