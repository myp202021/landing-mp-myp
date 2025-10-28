/**
 * CRM USUARIOS API
 * GET: Listar usuarios
 * POST: Crear usuario (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/crm/usuarios
 *
 * Query params:
 *   - clientId: UUID (optional, filtra por cliente)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    let query = supabase
      .from('usuarios')
      .select(`
        *,
        cliente:clientes(id, nombre, rubro)
      `)
      .order('creado_en', { ascending: false })

    if (clientId) {
      query = query.eq('cliente_id', clientId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching usuarios:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ usuarios: data })

  } catch (error: any) {
    console.error('Error en GET usuarios:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crm/usuarios
 *
 * Body: {
 *   id: UUID (auth_user_id de Supabase Auth)
 *   email: string
 *   nombre: string
 *   cliente_id: UUID
 *   rol: 'admin' | 'cliente'
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, email, nombre, cliente_id, rol } = body

    if (!id || !email || !cliente_id) {
      return NextResponse.json(
        { error: 'id, email y cliente_id son requeridos' },
        { status: 400 }
      )
    }

    if (rol && !['admin', 'cliente'].includes(rol)) {
      return NextResponse.json(
        { error: 'rol debe ser "admin" o "cliente"' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        id,
        email,
        nombre,
        cliente_id,
        rol: rol || 'cliente',
        activo: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating usuario:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ usuario: data })

  } catch (error: any) {
    console.error('Error en POST usuario:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/crm/usuarios
 *
 * Body: {
 *   id: UUID
 *   activo?: boolean
 *   nombre?: string
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    const allowedFields = ['activo', 'nombre']
    const sanitizedUpdates: any = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field]
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos válidos para actualizar' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating usuario:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ usuario: data })

  } catch (error: any) {
    console.error('Error en PATCH usuario:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
