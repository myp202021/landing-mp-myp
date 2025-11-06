import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Obtener todos los leads o filtrar por cliente_id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')
    const limit = searchParams.get('limit') || '100'

    let query = supabase
      .from('leads')
      .select(`
        *,
        clientes (
          id,
          nombre,
          rubro
        )
      `)
      .order('fecha_ingreso', { ascending: false })
      .limit(parseInt(limit))

    if (cliente_id) {
      query = query.eq('cliente_id', cliente_id)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('❌ Error obteniendo leads:', error)
      return NextResponse.json(
        { error: 'Error obteniendo leads', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ leads, total: leads.length })

  } catch (error: any) {
    console.error('❌ Error en GET /api/crm/leads:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH: Actualizar un lead (estado, monto, etc.)
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

    // Actualizar lead
    const { data: lead, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error actualizando lead:', error)
      return NextResponse.json(
        { error: 'Error actualizando lead', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Lead actualizado:', id)

    return NextResponse.json({
      success: true,
      lead
    })

  } catch (error: any) {
    console.error('❌ Error en PATCH /api/crm/leads:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar un lead
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
      console.error('❌ Error eliminando lead:', error)
      return NextResponse.json(
        { error: 'Error eliminando lead', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Lead eliminado:', id)

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en DELETE /api/crm/leads:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
