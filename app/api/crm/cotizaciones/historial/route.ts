import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Obtener historial de cotizaciones por cliente
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id es requerido' },
        { status: 400 }
      )
    }

    // Intentar obtener historial de la tabla
    const { data: historial, error } = await supabase
      .from('cotizaciones_audits')
      .select('*')
      .eq('cliente_id', cliente_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      // Si la tabla no existe, devolver array vacío
      console.warn('Tabla cotizaciones_audits no existe aún:', error.message)
      return NextResponse.json({ historial: [], total: 0 })
    }

    // Contar total de registros
    const { count } = await supabase
      .from('cotizaciones_audits')
      .select('*', { count: 'exact', head: true })
      .eq('cliente_id', cliente_id)

    return NextResponse.json({
      historial,
      total: count || 0,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Error en GET /api/crm/cotizaciones/historial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// POST: Crear entrada en historial de cotizaciones
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      cotizacion_id,
      cliente_id,
      nombre_proyecto,
      usuario,
      accion,
      estado_anterior,
      estado_nuevo,
      descripcion
    } = body

    if (!cotizacion_id || !cliente_id || !accion) {
      return NextResponse.json(
        { error: 'cotizacion_id, cliente_id y accion son requeridos' },
        { status: 400 }
      )
    }

    // Intentar insertar en historial
    const { data, error } = await supabase
      .from('cotizaciones_audits')
      .insert({
        cotizacion_id,
        cliente_id,
        nombre_proyecto: nombre_proyecto || null,
        usuario: usuario || 'Sistema',
        accion,
        estado_anterior: estado_anterior || null,
        estado_nuevo: estado_nuevo || null,
        descripcion: descripcion || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error insertando historial de cotizaciones:', error)
      // No fallar si el historial no se puede guardar
      return NextResponse.json({
        success: true,
        message: 'Cambio registrado (historial no disponible)',
        historial: null
      })
    }

    return NextResponse.json({
      success: true,
      historial: data
    })

  } catch (error: any) {
    console.error('Error en POST /api/crm/cotizaciones/historial:', error)
    // No fallar si el historial no se puede guardar
    return NextResponse.json({
      success: true,
      message: 'Cambio registrado (historial no disponible)',
      historial: null
    })
  }
}
