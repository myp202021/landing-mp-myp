import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ===========================================
// GET: Listar cotizaciones (con filtros opcionales)
// ===========================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lead_id = searchParams.get('lead_id')
    const cliente_id = searchParams.get('cliente_id')
    const vendido = searchParams.get('vendido')

    let query = supabase
      .from('cotizaciones_crm')
      .select(`
        *,
        lead:leads(id, nombre, email, telefono),
        cliente:clientes(id, nombre)
      `)
      .order('created_at', { ascending: false })

    if (lead_id) {
      query = query.eq('lead_id', lead_id)
    }

    if (cliente_id) {
      query = query.eq('cliente_id', cliente_id)
    }

    if (vendido !== null && vendido !== undefined) {
      query = query.eq('vendido', vendido === 'true')
    }

    const { data: cotizaciones, error } = await query

    if (error) throw error

    return NextResponse.json({ cotizaciones })
  } catch (error: any) {
    console.error('Error fetching cotizaciones:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ===========================================
// POST: Crear nueva cotización
// ===========================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      lead_id,
      cliente_id,
      descripcion_servicio,
      monto_subtotal,
      monto_iva,
      monto_total,
      estado = 'pendiente'
    } = body

    // Validar datos requeridos
    if (!lead_id || !cliente_id || !descripcion_servicio || monto_total === undefined) {
      return NextResponse.json(
        { error: 'Campos requeridos: lead_id, cliente_id, descripcion_servicio, monto_total' },
        { status: 400 }
      )
    }

    // Generar número de cotización automático
    const { data: numeroData, error: numeroError } = await supabase
      .rpc('generar_numero_cotizacion')

    if (numeroError) throw numeroError

    const numero_cotizacion = numeroData

    // Crear cotización
    const { data: newCotizacion, error: cotizacionError } = await supabase
      .from('cotizaciones_crm')
      .insert({
        lead_id,
        cliente_id,
        numero_cotizacion,
        descripcion_servicio,
        monto_subtotal: monto_subtotal || 0,
        monto_iva: monto_iva || 0,
        monto_total,
        estado
      })
      .select(`
        *,
        lead:leads(id, nombre, email, telefono),
        cliente:clientes(id, nombre)
      `)
      .single()

    if (cotizacionError) throw cotizacionError

    return NextResponse.json({
      success: true,
      cotizacion: newCotizacion
    })
  } catch (error: any) {
    console.error('Error creating cotización:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ===========================================
// PATCH: Actualizar cotización
// ===========================================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de cotización requerido' },
        { status: 400 }
      )
    }

    // Actualizar cotización
    const { data: updatedCotizacion, error: updateError } = await supabase
      .from('cotizaciones_crm')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        lead:leads(id, nombre, email, telefono),
        cliente:clientes(id, nombre)
      `)
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      cotizacion: updatedCotizacion
    })
  } catch (error: any) {
    console.error('Error updating cotización:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ===========================================
// DELETE: Eliminar cotización
// ===========================================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de cotización requerido' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('cotizaciones_crm')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting cotización:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
