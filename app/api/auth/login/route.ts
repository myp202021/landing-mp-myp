/**
 * AUTH LOGIN API
 * POST: Login simple con email + password
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/login
 *
 * Body: {
 *   email: string
 *   password: string
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      )
    }

    // Llamar a función SQL para verificar login
    const { data, error } = await supabase
      .rpc('verificar_login', {
        p_email: email,
        p_password: password
      })

    if (error) {
      console.error('Error en verificar_login:', error)
      return NextResponse.json(
        { error: 'Error al verificar credenciales', details: error.message },
        { status: 500 }
      )
    }

    // Si no hay datos, credenciales inválidas
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Email o password incorrectos' },
        { status: 401 }
      )
    }

    const user = data[0]

    // Validar que los datos del usuario existen
    if (!user || !user.user_id || !user.email || !user.rol) {
      return NextResponse.json(
        { error: 'Datos de usuario incompletos' },
        { status: 500 }
      )
    }

    // Crear sesión (cookie httpOnly)
    const sessionData = {
      userId: user.user_id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre || ''
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        nombre: user.nombre || '',
        rol: user.rol
      }
    })

    // Guardar sesión en cookie usando Set-Cookie header (Edge Runtime compatible)
    const cookieValue = `mp_session=${encodeURIComponent(JSON.stringify(sessionData))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`

    response.headers.set('Set-Cookie', cookieValue)

    return response

  } catch (error: any) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: error.message || 'Error en login' },
      { status: 500 }
    )
  }
}
