import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Obtener cotizaciones
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')
    const lead_id = searchParams.get('lead_id')
    const id = searchParams.get('id')

    if (id) {
      // Obtener cotización específica
      const { data: cotizacion, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          clientes (
            id,
            nombre,
            rubro
          ),
          leads (
            id,
            nombre,
            email,
            telefono
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error obteniendo cotización:', error)
        return NextResponse.json(
          { error: 'Error obteniendo cotización', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ cotizacion })
    }

    let query = supabase
      .from('cotizaciones')
      .select(`
        *,
        clientes (
          id,
          nombre,
          rubro
        ),
        leads (
          id,
          nombre,
          email
        )
      `)
      .order('creado_en', { ascending: false })

    if (cliente_id) {
      query = query.eq('cliente_id', cliente_id)
    }

    if (lead_id) {
      query = query.eq('lead_id', lead_id)
    }

    const { data: cotizaciones, error } = await query

    if (error) {
      console.error('❌ Error obteniendo cotizaciones:', error)
      return NextResponse.json(
        { error: 'Error obteniendo cotizaciones', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ cotizaciones, total: cotizaciones.length })

  } catch (error: any) {
    console.error('❌ Error en GET /api/crm/cotizaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// POST: Crear nueva cotización
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      cliente_id,
      lead_id,
      nombre_proyecto,
      cliente_nombre,
      cliente_email,
      cliente_empresa,
      items,
      subtotal,
      descuento,
      total,
      notas,
      vigencia_dias,
      logo_url,
      plantilla_id
    } = body

    if (!cliente_id || !nombre_proyecto) {
      return NextResponse.json(
        { error: 'cliente_id y nombre_proyecto son requeridos' },
        { status: 400 }
      )
    }

    const { data: cotizacion, error } = await supabase
      .from('cotizaciones')
      .insert({
        cliente_id,
        lead_id: lead_id || null,
        nombre_proyecto,
        cliente_nombre: cliente_nombre || null,
        cliente_email: cliente_email || null,
        cliente_empresa: cliente_empresa || null,
        items: items || [],
        subtotal: subtotal || 0,
        descuento: descuento || 0,
        total: total || 0,
        notas: notas || null,
        vigencia_dias: vigencia_dias || 30,
        estado: 'borrador',
        logo_url: logo_url || null,
        plantilla_id: plantilla_id || null
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creando cotización:', error)
      return NextResponse.json(
        { error: 'Error creando cotización', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cotización creada:', cotizacion.id)

    return NextResponse.json({
      success: true,
      cotizacion
    })

  } catch (error: any) {
    console.error('❌ Error en POST /api/crm/cotizaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH: Actualizar cotización
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

    // Si se está cambiando el estado a 'enviada' o 'aceptada', actualizar timestamp
    if (updates.estado === 'enviada' && !updates.enviada_en) {
      updates.enviada_en = new Date().toISOString()
    }
    if (updates.estado === 'aceptada' && !updates.aceptada_en) {
      updates.aceptada_en = new Date().toISOString()
    }

    const { data: cotizacion, error } = await supabase
      .from('cotizaciones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error actualizando cotización:', error)
      return NextResponse.json(
        { error: 'Error actualizando cotización', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cotización actualizada:', id)

    return NextResponse.json({
      success: true,
      cotizacion
    })

  } catch (error: any) {
    console.error('❌ Error en PATCH /api/crm/cotizaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar cotización
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
      .from('cotizaciones')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error eliminando cotización:', error)
      return NextResponse.json(
        { error: 'Error eliminando cotización', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Cotización eliminada:', id)

    return NextResponse.json({
      success: true,
      message: 'Cotización eliminada exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en DELETE /api/crm/cotizaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
