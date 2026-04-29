import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHash('sha256').update(salt + password).digest('hex')
  return 'sha256:' + salt + ':' + hash
}

function verifyPassword(password: string, stored: string): boolean {
  if (stored.startsWith('sha256:')) {
    const parts = stored.split(':')
    const salt = parts[1]
    const hash = parts[2]
    return crypto.createHash('sha256').update(salt + password).digest('hex') === hash
  }
  return false
}

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('copilot_session')
    if (!cookie || !cookie.value) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const subId = cookie.value.split(':')[0]
    const { current_password, new_password } = await req.json()

    if (!current_password || !new_password) {
      return NextResponse.json({ error: 'Se requiere password actual y nuevo' }, { status: 400 })
    }
    if (new_password.length < 6) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    // Verificar password actual
    const { data: sub } = await supabase
      .from('clipping_suscripciones')
      .select('id, password_hash')
      .eq('id', subId)
      .single()

    if (!sub || !sub.password_hash) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    if (!verifyPassword(current_password, sub.password_hash)) {
      return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 401 })
    }

    // Actualizar password
    const newHash = hashPassword(new_password)
    await supabase.from('clipping_suscripciones')
      .update({ password_hash: newHash, debe_cambiar_password: false })
      .eq('id', subId)

    // Log
    await supabase.from('copilot_access_log').insert({
      suscripcion_id: subId,
      accion: 'password_change',
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    }); // @ts-ignore

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
