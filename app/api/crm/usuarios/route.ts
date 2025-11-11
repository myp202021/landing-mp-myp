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
    const { username, password, cliente_id, role, nombre } = body

    // Validaciones
    if (!username || !password || !role || !nombre) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: username, password, role, nombre' },
        { status: 400 }
      )
    }

    if (role !== 'admin' && role !== 'cliente') {
      return NextResponse.json(
        { error: 'El role debe ser "admin" o "cliente"' },
        { status: 400 }
      )
    }

    if (role === 'cliente' && !cliente_id) {
      return NextResponse.json(
        { error: 'Los usuarios de tipo "cliente" requieren cliente_id' },
        { status: 400 }
      )
    }

    // Verificar que el username no exista
    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('username', username)
      .single()

    if (existente) {
      return NextResponse.json(
        { error: 'El username ya existe' },
        { status: 400 }
      )
    }

    // Crear usuario
    // NOTA: En producción, password debería hashearse con bcrypt
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({
        username,
        password_hash: password, // En producción: await bcrypt.hash(password, 10)
        cliente_id: role === 'cliente' ? cliente_id : null,
        role,
        nombre,
        activo: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        usuario: {
          id: usuario.id,
          username: usuario.username,
          nombre: usuario.nombre,
          role: usuario.role,
          cliente_id: usuario.cliente_id
        },
        message: 'Usuario creado exitosamente'
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

    // Solo actualizar password si se proporciona uno nuevo
    if (password) {
      updateData.password_hash = password // En producción: await bcrypt.hash(password, 10)
    }

    updateData.actualizado_en = new Date().toISOString()

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        role: usuario.role,
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
      .select('username, role')
      .eq('id', id)
      .single()

    if (usuario && usuario.username === 'admin' && usuario.role === 'admin') {
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
