/**
 * AUTH SESSION API
 * GET: Obtener sesión actual del usuario
 * POST: Refrescar datos del usuario desde Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Use POST para refrescar sesión' })
}

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username requerido' },
        { status: 400 }
      )
    }

    // Obtener datos actualizados del usuario desde Supabase
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, username, nombre, rol, cliente_id, debe_cambiar_password, activo')
      .eq('username', username)
      .single()

    if (error || !usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Usuario inactivo' },
        { status: 403 }
      )
    }

    // Retornar datos actualizados
    const user = {
      id: usuario.id,
      username: usuario.username,
      role: usuario.rol,
      nombre: usuario.nombre,
      cliente_id: usuario.cliente_id,
      debe_cambiar_password: usuario.debe_cambiar_password
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error: any) {
    console.error('Error en POST /api/auth/session:', error)
    return NextResponse.json(
      { error: 'Error refrescando sesión', details: error.message },
      { status: 500 }
    )
  }
}
