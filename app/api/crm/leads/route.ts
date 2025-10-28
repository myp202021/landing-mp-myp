/**
 * CRM LEADS API
 * GET: Listar leads con filtros
 * PATCH: Actualizar campos de gestión (contactado, vendido, etc.)
 * DELETE: Eliminar lead
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/crm/leads
 *
 * Query params:
 *   - clientId: UUID (required)
 *   - mes: YYYY-MM (opcional)
 *   - contactado: true/false (opcional)
 *   - vendido: true/false (opcional)
 *   - search: texto búsqueda (nombre, email, teléfono)
 *   - limit: número (default 100)
 *   - offset: número (default 0)
 *   - orderBy: campo (default fecha_ingreso)
 *   - order: asc/desc (default desc)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId es requerido' },
        { status: 400 }
      )
    }

    // Construir query
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('cliente_id', clientId)

    // Filtros
    const mes = searchParams.get('mes')
    if (mes) {
      query = query.eq('mes_ingreso', mes)
    }

    const contactado = searchParams.get('contactado')
    if (contactado !== null) {
      query = query.eq('contactado', contactado === 'true')
    }

    const vendido = searchParams.get('vendido')
    if (vendido !== null) {
      query = query.eq('vendido', vendido === 'true')
    }

    const search = searchParams.get('search')
    if (search) {
      // Búsqueda en nombre, email, teléfono
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%`)
    }

    // Paginación
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    query = query.range(offset, offset + limit - 1)

    // Orden
    const orderBy = searchParams.get('orderBy') || 'fecha_ingreso'
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
    query = query.order(orderBy, { ascending: order === 'asc' })

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      leads: data,
      total: count,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Error en GET leads:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/crm/leads/[id]
 *
 * Body: {
 *   contactado?: boolean
 *   fecha_contacto?: string (YYYY-MM-DD)
 *   vendido?: boolean
 *   monto_vendido?: number
 *   razon_no_venta?: string
 *   observaciones?: string
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

    // Solo permitir actualizar campos de gestión
    const allowedFields = [
      'contactado',
      'fecha_contacto',
      'vendido',
      'monto_vendido',
      'razon_no_venta',
      'observaciones'
    ]

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

    // Actualizar timestamp
    sanitizedUpdates.actualizado_en = new Date().toISOString()

    const { data, error } = await supabase
      .from('leads')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ lead: data })

  } catch (error: any) {
    console.error('Error en PATCH lead:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/crm/leads/[id]
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lead:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error en DELETE lead:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
