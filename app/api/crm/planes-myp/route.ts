import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PlanItem {
  descripcion: string
  cantidad: number
  precio_unitario: number
}

interface Plan {
  id: number
  nombre: string
  descripcion?: string
  items_incluidos: PlanItem[]
  precio_base: number
  descuento_default: number
  vigencia_dias: number
  activo: boolean
  creado_en: string
  actualizado_en: string
}

// GET - Listar todos los planes activos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      // Obtener plan específico
      const { data: plan, error } = await supabase
        .from('planes_myp')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return NextResponse.json({ plan })
    }

    // Listar todos los planes activos
    const { data: planes, error } = await supabase
      .from('planes_myp')
      .select('*')
      .eq('activo', true)
      .order('precio_base', { ascending: true })

    if (error) throw error

    return NextResponse.json({ planes })
  } catch (error: any) {
    console.error('Error en GET /api/crm/planes-myp:', error)
    return NextResponse.json(
      { error: 'Error obteniendo planes', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo plan (solo admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      nombre,
      descripcion,
      items_incluidos,
      precio_base,
      descuento_default,
      vigencia_dias
    } = body

    // Validaciones
    if (!nombre || !items_incluidos || precio_base === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, items_incluidos, precio_base' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items_incluidos) || items_incluidos.length === 0) {
      return NextResponse.json(
        { error: 'items_incluidos debe ser un array con al menos un elemento' },
        { status: 400 }
      )
    }

    // Validar estructura de items
    for (const item of items_incluidos) {
      if (!item.descripcion || item.cantidad === undefined || item.precio_unitario === undefined) {
        return NextResponse.json(
          { error: 'Cada item debe tener: descripcion, cantidad, precio_unitario' },
          { status: 400 }
        )
      }
    }

    const { data: plan, error } = await supabase
      .from('planes_myp')
      .insert({
        nombre,
        descripcion: descripcion || null,
        items_incluidos,
        precio_base,
        descuento_default: descuento_default || 0,
        vigencia_dias: vigencia_dias || 30,
        activo: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        plan,
        message: 'Plan creado exitosamente'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en POST /api/crm/planes-myp:', error)
    return NextResponse.json(
      { error: 'Error creando plan', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar plan existente (solo admin)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      nombre,
      descripcion,
      items_incluidos,
      precio_base,
      descuento_default,
      vigencia_dias,
      activo
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id del plan' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (nombre !== undefined) updateData.nombre = nombre
    if (descripcion !== undefined) updateData.descripcion = descripcion
    if (items_incluidos !== undefined) {
      if (!Array.isArray(items_incluidos)) {
        return NextResponse.json(
          { error: 'items_incluidos debe ser un array' },
          { status: 400 }
        )
      }
      updateData.items_incluidos = items_incluidos
    }
    if (precio_base !== undefined) updateData.precio_base = precio_base
    if (descuento_default !== undefined) updateData.descuento_default = descuento_default
    if (vigencia_dias !== undefined) updateData.vigencia_dias = vigencia_dias
    if (activo !== undefined) updateData.activo = activo

    const { data: plan, error } = await supabase
      .from('planes_myp')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      plan,
      message: 'Plan actualizado exitosamente'
    })
  } catch (error: any) {
    console.error('Error en PATCH /api/crm/planes-myp:', error)
    return NextResponse.json(
      { error: 'Error actualizando plan', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Desactivar plan (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id del plan' },
        { status: 400 }
      )
    }

    // Soft delete: marcar como inactivo en lugar de eliminar
    const { data: plan, error } = await supabase
      .from('planes_myp')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      plan,
      message: 'Plan desactivado exitosamente'
    })
  } catch (error: any) {
    console.error('Error en DELETE /api/crm/planes-myp:', error)
    return NextResponse.json(
      { error: 'Error desactivando plan', details: error.message },
      { status: 500 }
    )
  }
}
