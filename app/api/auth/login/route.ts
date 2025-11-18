import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

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

    // Obtener usuario de la base de datos
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, username, nombre, rol, cliente_id, debe_cambiar_password, password_hash, activo')
      .eq('username', username)
      .single()

    if (error || !usuario) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Usuario inactivo. Contacte al administrador.' },
        { status: 403 }
      )
    }

    // Validar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Autenticación exitosa
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
    console.error('Error en POST /api/auth/login:', error)
    return NextResponse.json(
      { error: 'Error en autenticación', details: error.message },
      { status: 500 }
    )
  }
}
