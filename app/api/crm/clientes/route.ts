/**
 * CRM CLIENTES API
 * GET: Listar clientes
 * POST: Crear cliente (admin only)
 * DELETE: Eliminar cliente (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'


/**
 * GET /api/crm/clientes
 * GET /api/crm/clientes?id=xxx (obtener cliente específico)
 */
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // Si se proporciona ID, obtener cliente específico
    if (id) {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .eq('activo', true)
        .single()

      if (error) {
        console.error('Error fetching cliente:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ cliente: data })
    }

    // Si no hay ID, obtener todos los clientes
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error fetching clientes:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ clientes: data })

  } catch (error: any) {
    console.error('Error en GET clientes:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crm/clientes
 *
 * Body: {
 *   nombre: string
 *   rubro?: string
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await req.json()
    const { nombre, rubro } = body

    if (!nombre) {
      return NextResponse.json(
        { error: 'nombre es requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nombre,
        rubro: rubro || null,
        activo: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating cliente:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ cliente: data })

  } catch (error: any) {
    console.error('Error en POST cliente:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/crm/clientes
 * Actualizar cliente (ej: inversión mensual, campos Meta)
 *
 * Body: {
 *   id: string
 *   inversion_mensual?: number
 *   nombre?: string
 *   rubro?: string
 *   meta_page_id?: string
 *   meta_form_id?: string
 *   sync_meta_activo?: boolean
 * }
 */
export async function PATCH(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await req.json()
    const { id, inversion_mensual, nombre, rubro, meta_page_id, meta_form_id, sync_meta_activo } = body

    console.log('📝 PATCH /api/crm/clientes - Body recibido:', body)

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    // Construir objeto de actualización solo con campos presentes
    const updates: any = {}
    if (inversion_mensual !== undefined) updates.inversion_mensual = inversion_mensual
    if (nombre) updates.nombre = nombre
    if (rubro !== undefined) updates.rubro = rubro
    if (meta_page_id !== undefined) updates.meta_page_id = meta_page_id
    if (meta_form_id !== undefined) updates.meta_form_id = meta_form_id
    if (sync_meta_activo !== undefined) updates.sync_meta_activo = sync_meta_activo

    console.log('🔄 Actualizando cliente con:', { id, updates })

    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating cliente:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cliente actualizado:', data)
    return NextResponse.json({ cliente: data })

  } catch (error: any) {
    console.error('❌ Error en PATCH cliente:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/crm/clientes?id=xxx
 * Soft delete - marca como inactivo
 */
export async function DELETE(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    // Soft delete - marcar como inactivo
    const { error } = await supabase
      .from('clientes')
      .update({ activo: false })
      .eq('id', id)

    if (error) {
      console.error('Error deleting cliente:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error en DELETE cliente:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
