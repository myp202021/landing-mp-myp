import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifyPassword(password: string, stored: string): boolean {
  // Formato con salt: sha256:salt:hash
  if (stored.startsWith('sha256:')) {
    const parts = stored.split(':')
    const salt = parts[1]
    const hash = parts[2]
    const check = crypto.createHash('sha256').update(salt + password).digest('hex')
    return check === hash
  }
  // Formato simple: hash directo (generado por trial)
  const simpleHash = crypto.createHash('sha256').update(password).digest('hex')
  return simpleHash === stored
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y password son requeridos' }, { status: 400 })
    }

    // Buscar suscripción
    const { data: sub, error } = await supabase
      .from('clipping_suscripciones')
      .select('id, email, nombre, plan, estado, password_hash, debe_cambiar_password')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !sub) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Verificar estado
    if (sub.estado === 'cancelado' || sub.estado === 'vencido') {
      return NextResponse.json({ error: 'Tu suscripción está ' + sub.estado + '. Contáctanos para reactivar.' }, { status: 403 })
    }

    // Verificar que tiene password configurado
    if (!sub.password_hash) {
      return NextResponse.json({ error: 'Tu cuenta no tiene contraseña configurada. Contacta a soporte.' }, { status: 403 })
    }

    // Verificar password
    const valid = verifyPassword(password, sub.password_hash)
    if (!valid) {
      // Log intento fallido
      await supabase.from('copilot_access_log').insert({
        suscripcion_id: sub.id,
        accion: 'login_fallido',
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: (req.headers.get('user-agent') || '').substring(0, 200),
      }); // @ts-ignore

      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Login exitoso — generar session token
    const sessionToken = generateSessionToken()

    // Actualizar ultimo_login
    await supabase.from('clipping_suscripciones')
      .update({ ultimo_login: new Date().toISOString() })
      .eq('id', sub.id)

    // Log login exitoso
    await supabase.from('copilot_access_log').insert({
      suscripcion_id: sub.id,
      accion: 'login',
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: (req.headers.get('user-agent') || '').substring(0, 200),
    }); // @ts-ignore

    // Crear response con httpOnly cookie
    const res = NextResponse.json({
      success: true,
      user: {
        id: sub.id,
        email: sub.email,
        nombre: sub.nombre,
        plan: sub.plan,
        debe_cambiar_password: sub.debe_cambiar_password,
      },
      redirect: '/copilot/dashboard/' + sub.id,
    })

    // Cookie segura: httpOnly, SameSite, Secure en producción
    // Token format: subId:sessionToken (para validar que el user solo accede a su dashboard)
    const cookieValue = sub.id + ':' + sessionToken
    res.cookies.set('copilot_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 días
    })

    return res
  } catch (e: any) {
    console.error('Copilot login error:', e.message)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
