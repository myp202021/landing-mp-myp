import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

// GET - Listar respuestas automáticas del cliente
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('cliente_id')
    const id = searchParams.get('id')

    if (id) {
      // Obtener respuesta específica
      const { data, error } = await supabase
        .from('respuestas_automaticas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return NextResponse.json({ respuesta: data })
    }

    if (!clienteId) {
      return NextResponse.json(
        { error: 'Se requiere cliente_id' },
        { status: 400 }
      )
    }

    // Listar todas las respuestas del cliente
    const { data, error } = await supabase
      .from('respuestas_automaticas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('creado_en', { ascending: false })

    if (error) throw error

    return NextResponse.json({ respuestas: data })
  } catch (error: any) {
    console.error('Error en GET respuestas:', error)
    return NextResponse.json(
      { error: 'Error obteniendo respuestas', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Crear nueva respuesta automática
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, nombre, asunto, mensaje, trigger_tipo, activa } = body

    // Validaciones
    if (!cliente_id || !nombre || !asunto || !mensaje || !trigger_tipo) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const validTriggers = ['nuevo_lead', 'sin_contactar_24h', 'sin_contactar_48h']
    if (!validTriggers.includes(trigger_tipo)) {
      return NextResponse.json(
        { error: 'Trigger inválido. Opciones: ' + validTriggers.join(', ') },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('respuestas_automaticas')
      .insert({
        cliente_id,
        nombre,
        asunto,
        mensaje,
        trigger_tipo,
        activa: activa ?? false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, respuesta: data },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en POST respuestas:', error)
    return NextResponse.json(
      { error: 'Error creando respuesta', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar respuesta automática
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, nombre, asunto, mensaje, trigger_tipo, activa } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id de la respuesta' },
        { status: 400 }
      )
    }

    const updates: any = { actualizado_en: new Date().toISOString() }
    if (nombre !== undefined) updates.nombre = nombre
    if (asunto !== undefined) updates.asunto = asunto
    if (mensaje !== undefined) updates.mensaje = mensaje
    if (trigger_tipo !== undefined) updates.trigger_tipo = trigger_tipo
    if (activa !== undefined) updates.activa = activa

    const { data, error } = await supabase
      .from('respuestas_automaticas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, respuesta: data })
  } catch (error: any) {
    console.error('Error en PATCH respuestas:', error)
    return NextResponse.json(
      { error: 'Error actualizando respuesta', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar respuesta automática
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el id de la respuesta' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('respuestas_automaticas')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Respuesta eliminada' })
  } catch (error: any) {
    console.error('Error en DELETE respuestas:', error)
    return NextResponse.json(
      { error: 'Error eliminando respuesta', details: error.message },
      { status: 500 }
    )
  }
}
