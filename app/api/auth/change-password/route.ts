/**
 * CHANGE PASSWORD API
 * POST: Cambiar contraseña del usuario actual
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/change-password
 *
 * Body: {
 *   oldPassword: string
 *   newPassword: string
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Obtener sesión actual desde cookie
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('mp_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)
    const { oldPassword, newPassword } = await req.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva son requeridas' },
        { status: 400 }
      )
    }

    // Validación básica de nueva contraseña
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (!/[a-zA-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe contener al menos una letra' },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe contener al menos un número' },
        { status: 400 }
      )
    }

    // Llamar a función SQL de cambio de contraseña
    const { data, error } = await supabase.rpc('cambiar_password', {
      p_user_id: session.userId,
      p_old_password: oldPassword,
      p_new_password: newPassword
    })

    if (error) {
      console.error('Error cambiando contraseña:', error)
      return NextResponse.json(
        { error: error.message || 'Error al cambiar contraseña' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    })

  } catch (error: any) {
    console.error('Error en change-password:', error)
    return NextResponse.json(
      { error: error.message || 'Error al cambiar contraseña' },
      { status: 500 }
    )
  }
}
