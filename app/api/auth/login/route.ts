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

    // Buscar usuario por username
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        username,
        password_hash,
        cliente_id,
        rol,
        nombre,
        activo
      `)
      .eq('username', username)
      .single()

    if (error || !usuario) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Usuario deshabilitado' },
        { status: 403 }
      )
    }

    // Validar contraseña
    // NOTA: En producción esto debería usar bcrypt.compare()
    // Por ahora comparamos en texto plano
    if (usuario.password_hash !== password) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Autenticación exitosa
    const user = {
      username: usuario.username,
      role: usuario.rol, // Map 'rol' (DB) to 'role' (frontend)
      nombre: usuario.nombre,
      cliente_id: usuario.cliente_id
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
