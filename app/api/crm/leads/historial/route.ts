import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Obtener historial de un lead
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lead_id = searchParams.get('lead_id')

    if (!lead_id) {
      return NextResponse.json(
        { error: 'lead_id es requerido' },
        { status: 400 }
      )
    }

    // Intentar obtener historial de la tabla
    const { data: historial, error } = await supabase
      .from('lead_historial')
      .select('*')
      .eq('lead_id', lead_id)
      .order('created_at', { ascending: false })

    if (error) {
      // Si la tabla no existe, devolver array vacío
      console.warn('⚠️ Tabla lead_historial no existe aún:', error.message)
      return NextResponse.json({ historial: [] })
    }

    return NextResponse.json({ historial })

  } catch (error: any) {
    console.error('❌ Error en GET /api/crm/leads/historial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// POST: Crear entrada en historial
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      lead_id,
      usuario,
      accion,
      campo_cambiado,
      valor_anterior,
      valor_nuevo,
      descripcion
    } = body

    if (!lead_id || !accion) {
      return NextResponse.json(
        { error: 'lead_id y accion son requeridos' },
        { status: 400 }
      )
    }

    // Intentar insertar en historial
    const { data, error } = await supabase
      .from('lead_historial')
      .insert({
        lead_id,
        usuario: usuario || 'Sistema',
        accion,
        campo_cambiado,
        valor_anterior,
        valor_nuevo,
        descripcion
      })
      .select()
      .single()

    if (error) {
      // Si la tabla no existe, intentar crearla
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('📝 Creando tabla lead_historial...')

        const { error: createError } = await supabase.rpc('create_lead_historial_table')

        if (createError) {
          console.error('❌ Error creando tabla:', createError)
          // Si no se puede crear, simplemente devolver éxito sin guardar
          return NextResponse.json({
            success: true,
            message: 'Cambio registrado (historial no disponible aún)',
            historial: null
          })
        }

        // Reintentar inserción
        const { data: retryData, error: retryError } = await supabase
          .from('lead_historial')
          .insert({
            lead_id,
            usuario: usuario || 'Sistema',
            accion,
            campo_cambiado,
            valor_anterior,
            valor_nuevo,
            descripcion
          })
          .select()
          .single()

        if (retryError) {
          console.error('❌ Error insertando historial (retry):', retryError)
          return NextResponse.json({
            success: true,
            message: 'Cambio registrado (historial no disponible)',
            historial: null
          })
        }

        return NextResponse.json({
          success: true,
          historial: retryData
        })
      }

      console.error('❌ Error insertando historial:', error)
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
    console.error('❌ Error en POST /api/crm/leads/historial:', error)
    // No fallar si el historial no se puede guardar
    return NextResponse.json({
      success: true,
      message: 'Cambio registrado (historial no disponible)',
      historial: null
    })
  }
}
