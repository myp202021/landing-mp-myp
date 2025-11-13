import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Listar todos los usuarios (solo admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      // Obtener usuario específico
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          clientes (
            id,
            nombre,
            rubro
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return NextResponse.json({ usuario })
    }

    // Listar todos los usuarios
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        clientes (
          id,
          nombre,
          rubro
        )
      `)
      .order('creado_en', { ascending: false })

    if (error) throw error

    return NextResponse.json({ usuarios })
  } catch (error: any) {
    console.error('Error en GET /api/crm/usuarios:', error)
    return NextResponse.json(
      { error: 'Error obteniendo usuarios', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo usuario
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, cliente_id, rol, nombre } = body

    // Validaciones
    if (!username || !password || !rol || !nombre) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: username, password, rol, nombre' },
        { status: 400 }
      )
    }

    if (rol !== 'admin' && rol !== 'cliente') {
      return NextResponse.json(
        { error: 'El rol debe ser "admin" o "cliente"' },
        { status: 400 }
      )
    }

    if (rol === 'cliente' && !cliente_id) {
      return NextResponse.json(
        { error: 'Los usuarios de tipo "cliente" requieren cliente_id' },
        { status: 400 }
      )
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Usar función SQL que hashea con bcrypt automáticamente
    const { data, error } = await supabase.rpc('crear_usuario', {
      p_username: username,
      p_password: password,
      p_nombre: nombre,
      p_rol: rol,
      p_cliente_id: rol === 'cliente' ? cliente_id : null
    })

    if (error) {
      console.error('Error creando usuario:', error)
      return NextResponse.json(
        { error: error.message || 'Error creando usuario', details: error.hint },
        { status: 400 }
      )
    }

    // data contiene el ID del usuario creado
    const user_id = data

    // Obtener el usuario recién creado con información del cliente
    const { data: usuario, error: fetchError } = await supabase
      .from('usuarios')
      .select(`
        *,
        clientes (
          id,
          nombre,
          rubro
        )
      `)
      .eq('id', user_id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json(
      {
        success: true,
        usuario: {
          id: usuario.id,
          username: usuario.username,
          nombre: usuario.nombre,
          rol: usuario.rol,
          cliente_id: usuario.cliente_id,
          clientes: usuario.clientes
        },
        message: 'Usuario creado exitosamente con contraseña hasheada'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en POST /api/crm/usuarios:', error)
    return NextResponse.json(
      { error: 'Error creando usuario', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar usuario existente
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, username, password, nombre, activo } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id del usuario' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (username !== undefined) updateData.username = username
    if (nombre !== undefined) updateData.nombre = nombre
    if (activo !== undefined) updateData.activo = activo

    // Actualizar campos básicos primero
    updateData.actualizado_en = new Date().toISOString()

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Si se proporciona una nueva contraseña, actualizarla usando crypt()
    if (password) {
      const { error: pwdError } = await supabase.rpc('actualizar_password_usuario', {
        p_user_id: parseInt(id),
        p_new_password: password
      })

      if (pwdError) {
        console.error('Error actualizando contraseña:', pwdError)
        throw new Error('Error actualizando contraseña')
      }
    }

    if (error) throw error

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        rol: usuario.rol,
        cliente_id: usuario.cliente_id,
        activo: usuario.activo
      },
      message: 'Usuario actualizado exitosamente'
    })
  } catch (error: any) {
    console.error('Error en PATCH /api/crm/usuarios:', error)
    return NextResponse.json(
      { error: 'Error actualizando usuario', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar usuario
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id del usuario' },
        { status: 400 }
      )
    }

    // Verificar que no sea el admin principal
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('username, rol')
      .eq('id', id)
      .single()

    if (usuario && usuario.username === 'admin' && usuario.rol === 'admin') {
      return NextResponse.json(
        { error: 'No se puede eliminar el usuario administrador principal' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error: any) {
    console.error('Error en DELETE /api/crm/usuarios:', error)
    return NextResponse.json(
      { error: 'Error eliminando usuario', details: error.message },
      { status: 500 }
    )
  }
}
