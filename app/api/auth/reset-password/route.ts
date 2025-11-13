/**
 * RESET PASSWORD API (ADMIN ONLY)
 * POST: Resetear contraseña de un usuario
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/auth/reset-password
 *
 * Body: {
 *   user_id: number
 *   new_password: string
 *   force_change: boolean (default: true)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { user_id, new_password, force_change = true } = await req.json()

    if (!user_id || !new_password) {
      return NextResponse.json(
        { error: 'user_id y new_password son requeridos' },
        { status: 400 }
      )
    }

    // Validación básica de nueva contraseña
    if (new_password.length < 8) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Llamar a función SQL de reset de contraseña
    const { data, error } = await supabase.rpc('admin_reset_password', {
      p_user_id: user_id,
      p_new_password: new_password,
      p_force_change: force_change
    })

    if (error) {
      console.error('Error reseteando contraseña:', error)
      return NextResponse.json(
        { error: error.message || 'Error al resetear contraseña' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña reseteada correctamente',
      force_change
    })

  } catch (error: any) {
    console.error('Error en reset-password:', error)
    return NextResponse.json(
      { error: error.message || 'Error al resetear contraseña' },
      { status: 500 }
    )
  }
}
