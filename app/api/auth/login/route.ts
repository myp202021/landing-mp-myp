import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Se requieren username y password' },
        { status: 400 }
      )
    }

    // Usar función SQL verificar_login() que valida con bcrypt
    const { data, error } = await supabase
      .rpc('verificar_login', {
        p_username: username,
        p_password: password
      })

    if (error) {
      console.error('Error en verificar_login:', error)
      return NextResponse.json(
        { error: 'Error al verificar credenciales' },
        { status: 500 }
      )
    }

    // Si no hay datos, credenciales incorrectas
    if (!data || data.length === 0) {
      // Verificar si el usuario existe pero está inactivo
      const { data: userCheck, error: checkError } = await supabase
        .from('usuarios')
        .select('username, activo')
        .eq('username', username)
        .single()

      if (!checkError && userCheck) {
        if (!userCheck.activo) {
          return NextResponse.json(
            { error: 'Usuario inactivo. Contacte al administrador.' },
            { status: 403 }
          )
        }
        // Usuario existe y está activo, entonces la contraseña es incorrecta
        return NextResponse.json(
          { error: 'Contraseña incorrecta' },
          { status: 401 }
        )
      }

      // Usuario no existe o error al verificar
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }

    const usuario = data[0]

    // Autenticación exitosa
    const user = {
      id: usuario.user_id,
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
    console.error('Error en POST /api/auth/login:', error)
    return NextResponse.json(
      { error: 'Error en autenticación', details: error.message },
      { status: 500 }
    )
  }
}
