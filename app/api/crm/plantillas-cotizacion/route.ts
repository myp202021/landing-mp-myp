import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Obtener plantillas de cotización
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const { data, error } = await supabase
        .from('plantillas_cotizacion_myp')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return NextResponse.json({ plantilla: data })
    }

    // Listar todas las plantillas
    const { data, error } = await supabase
      .from('plantillas_cotizacion_myp')
      .select('*')
      .order('creado_en', { ascending: false })

    if (error) throw error
    return NextResponse.json({ plantillas: data })
  } catch (error: any) {
    console.error('Error en GET /api/crm/plantillas-cotizacion:', error)
    return NextResponse.json(
      { error: 'Error obteniendo plantillas', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Crear nueva plantilla
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, contenido } = body

    if (!nombre || !contenido) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, contenido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('plantillas_cotizacion_myp')
      .insert({
        nombre,
        contenido,
        activo: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, plantilla: data, message: 'Plantilla creada exitosamente' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en POST /api/crm/plantillas-cotizacion:', error)
    return NextResponse.json(
      { error: 'Error creando plantilla', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar plantilla
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, nombre, contenido, activo } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id de la plantilla' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (nombre !== undefined) updateData.nombre = nombre
    if (contenido !== undefined) updateData.contenido = contenido
    if (activo !== undefined) updateData.activo = activo

    const { data, error } = await supabase
      .from('plantillas_cotizacion_myp')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      plantilla: data,
      message: 'Plantilla actualizada exitosamente'
    })
  } catch (error: any) {
    console.error('Error en PATCH /api/crm/plantillas-cotizacion:', error)
    return NextResponse.json(
      { error: 'Error actualizando plantilla', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar plantilla
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id de la plantilla' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('plantillas_cotizacion_myp')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Plantilla eliminada exitosamente'
    })
  } catch (error: any) {
    console.error('Error en DELETE /api/crm/plantillas-cotizacion:', error)
    return NextResponse.json(
      { error: 'Error eliminando plantilla', details: error.message },
      { status: 500 }
    )
  }
}
