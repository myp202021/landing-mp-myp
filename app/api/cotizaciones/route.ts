import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ===========================================
// GET: Listar todas las cotizaciones
// ===========================================
export async function GET(req: NextRequest) {
  try {
    const { data: cotizaciones, error } = await supabase
      .from('cotizaciones_mercator')
      .select(`
        *,
        items:cotizacion_items(*)
      `)
      .order('created_at', { ascending: false })

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
    const { cotizacion, items } = body

    // Validar datos requeridos
    if (!cotizacion?.numero_cotizacion || !cotizacion?.cliente) {
      return NextResponse.json(
        { error: 'Número de cotización y cliente son obligatorios' },
        { status: 400 }
      )
    }

    // Insertar cotización principal
    const { data: newCotizacion, error: cotizacionError } = await supabase
      .from('cotizaciones_mercator')
      .insert({
        numero_cotizacion: cotizacion.numero_cotizacion,
        cliente: cotizacion.cliente,
        container: cotizacion.container || null,
        puerto_embarque: cotizacion.puerto_embarque || null,
        oferta_valida: cotizacion.oferta_valida || null,
        produccion: cotizacion.produccion || null,
        proveedor: cotizacion.proveedor || 'Mercator Group',
        direccion: cotizacion.direccion || 'Franklin 338, Santiago Centro, Chile',
        persona_contacto: cotizacion.persona_contacto || 'Jose Marilaf Pablaza',
        email: cotizacion.email || 'jmarilaf@mercator-group.com',
        condiciones_pago: cotizacion.condiciones_pago || null,
        notas: cotizacion.notas || null,
        created_by: cotizacion.created_by || null
      })
      .select()
      .single()

    if (cotizacionError) throw cotizacionError

    // Insertar items si existen
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any, index: number) => ({
        cotizacion_id: newCotizacion.id,
        descripcion: item.descripcion,
        especificacion: item.especificacion || null,
        empaque: item.empaque || null,
        cantidad: item.cantidad || 1,
        unidad: item.unidad || 'unidad',
        precio_fob_unitario: item.precio_fob_unitario || 0,
        foto_url: item.foto_url || null,
        orden: index
      }))

      const { error: itemsError } = await supabase
        .from('cotizacion_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError
    }

    // Obtener cotización completa con items
    const { data: fullCotizacion, error: fetchError } = await supabase
      .from('cotizaciones_mercator')
      .select(`
        *,
        items:cotizacion_items(*)
      `)
      .eq('id', newCotizacion.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json({
      success: true,
      cotizacion: fullCotizacion
    })
  } catch (error: any) {
    console.error('Error creating cotización:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ===========================================
// PATCH: Actualizar cotización existente
// ===========================================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, cotizacion, items } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de cotización requerido' },
        { status: 400 }
      )
    }

    // Actualizar cotización principal
    if (cotizacion) {
      const { error: updateError } = await supabase
        .from('cotizaciones_mercator')
        .update(cotizacion)
        .eq('id', id)

      if (updateError) throw updateError
    }

    // Actualizar items si se proporcionan
    if (items) {
      // Eliminar items existentes
      await supabase
        .from('cotizacion_items')
        .delete()
        .eq('cotizacion_id', id)

      // Insertar nuevos items
      if (items.length > 0) {
        const itemsToInsert = items.map((item: any, index: number) => ({
          cotizacion_id: id,
          descripcion: item.descripcion,
          especificacion: item.especificacion || null,
          empaque: item.empaque || null,
          cantidad: item.cantidad || 1,
          unidad: item.unidad || 'unidad',
          precio_fob_unitario: item.precio_fob_unitario || 0,
          foto_url: item.foto_url || null,
          orden: index
        }))

        const { error: itemsError } = await supabase
          .from('cotizacion_items')
          .insert(itemsToInsert)

        if (itemsError) throw itemsError
      }
    }

    // Obtener cotización actualizada
    const { data: updatedCotizacion, error: fetchError } = await supabase
      .from('cotizaciones_mercator')
      .select(`
        *,
        items:cotizacion_items(*)
      `)
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

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
      .from('cotizaciones_mercator')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting cotización:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
