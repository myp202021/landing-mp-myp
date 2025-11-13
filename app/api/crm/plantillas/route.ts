import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

// GET - Listar todas las plantillas o una específica
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const tipo = searchParams.get('tipo') // 'base', 'cliente', o null (todas)
    const cliente_id = searchParams.get('cliente_id')

    if (id) {
      // Obtener plantilla específica con información del cliente
      const { data, error } = await supabase
        .from('plantillas_cotizacion')
        .select(`
          *,
          clientes (
            id,
            nombre,
            empresa
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return NextResponse.json({ plantilla: data })
    }

    // Construir query base con información de clientes
    let query = supabase
      .from('plantillas_cotizacion')
      .select(`
        *,
        clientes (
          id,
          nombre,
          empresa
        )
      `)
      .eq('activa', true)

    // Filtrar por tipo
    if (tipo === 'base') {
      query = query.eq('es_base', true)
    } else if (tipo === 'cliente') {
      query = query.eq('es_base', false)
    }

    // Filtrar por cliente específico
    if (cliente_id) {
      query = query.eq('cliente_id', cliente_id)
    }

    // Ordenar: primero plantillas base, luego por nombre
    query = query.order('es_base', { ascending: false })
    query = query.order('nombre', { ascending: true })

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json({ plantillas: data || [] })
  } catch (error: any) {
    console.error('Error obteniendo plantillas:', error)
    return NextResponse.json(
      { error: error.message || 'Error obteniendo plantillas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva plantilla
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nombre,
      descripcion,
      items_default,
      notas_default,
      vigencia_dias_default,
      descuento_default,
      activa,
      logo_url,
      logo_filename,
      cliente_id,
      es_base
    } = body

    const { data, error } = await supabase
      .from('plantillas_cotizacion')
      .insert({
        nombre,
        descripcion,
        items_default,
        notas_default,
        vigencia_dias_default: vigencia_dias_default || 15,
        descuento_default: descuento_default || 0,
        activa: activa !== undefined ? activa : true,
        logo_url: logo_url || null,
        logo_filename: logo_filename || null,
        cliente_id: cliente_id || null,
        es_base: es_base !== undefined ? es_base : false
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ plantilla: data }, { status: 201 })
  } catch (error: any) {
    console.error('Error creando plantilla:', error)
    return NextResponse.json(
      { error: error.message || 'Error creando plantilla' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar plantilla
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la plantilla' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const updates = {
      ...body,
      actualizado_en: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('plantillas_cotizacion')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ plantilla: data })
  } catch (error: any) {
    console.error('Error actualizando plantilla:', error)
    return NextResponse.json(
      { error: error.message || 'Error actualizando plantilla' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar plantilla (soft delete: activa = false)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la plantilla' },
        { status: 400 }
      )
    }

    // Soft delete: marcar como inactiva
    const { error } = await supabase
      .from('plantillas_cotizacion')
      .update({ activa: false, actualizado_en: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ message: 'Plantilla eliminada correctamente' })
  } catch (error: any) {
    console.error('Error eliminando plantilla:', error)
    return NextResponse.json(
      { error: error.message || 'Error eliminando plantilla' },
      { status: 500 }
    )
  }
}
