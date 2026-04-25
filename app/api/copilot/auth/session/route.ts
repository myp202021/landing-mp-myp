import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: verificar sesión actual (llamado por middleware y dashboard)
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('copilot_session')
  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const parts = cookie.value.split(':')
  if (parts.length < 2) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const subId = parts[0]

  // Verificar que la suscripción existe y está activa
  const { data: sub, error } = await supabase
    .from('clipping_suscripciones')
    .select('id, email, nombre, plan, estado')
    .eq('id', subId)
    .single()

  if (error || !sub || sub.estado === 'cancelado' || sub.estado === 'vencido') {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: sub.id,
      email: sub.email,
      nombre: sub.nombre,
      plan: sub.plan,
    },
  })
}
