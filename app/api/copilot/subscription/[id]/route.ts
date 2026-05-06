import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verificar que el usuario autenticado es dueño de esta suscripción
function verifyOwnership(request: NextRequest, id: string): boolean {
  const session = request.cookies.get('copilot_session')
  if (!session || !session.value) return false
  const sessionSubId = session.value.split(':')[0]
  return sessionSubId === id
}

// GET: obtener datos de suscripción
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!verifyOwnership(req, id)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('clipping_suscripciones')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PATCH: actualizar datos básicos de suscripción (perfil_empresa, etc.)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!verifyOwnership(req, id)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()

  // Solo permitir campos seguros
  const allowed: Record<string, any> = {}
  if (body.perfil_empresa) allowed.perfil_empresa = body.perfil_empresa
  if (body.cuentas) allowed.cuentas = body.cuentas
  if (body.emails_destino) allowed.emails_destino = body.emails_destino

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
  }

  const { error } = await supabase
    .from('clipping_suscripciones')
    .update(allowed)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
