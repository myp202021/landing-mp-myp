import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ESTADOS_VALIDOS, booleanosDeEstado, type Estado } from '@/lib/crm/leads-pipeline'

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

    // PostgREST corta en 1000 filas por request: paginar hasta `limit`
    const max = parseInt(limit)
    const PAGE = 1000
    const leads: any[] = []
    for (let from = 0; from < max; from += PAGE) {
      const to = Math.min(from + PAGE, max) - 1
      let query = supabase
        .from('leads')
        .select('*')
        .order('fecha_ingreso', { ascending: false })
        .order('id', { ascending: false })
        .range(from, to)

      if (cliente_id) {
        query = query.eq('cliente_id', cliente_id)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error obteniendo leads:', error)
        return NextResponse.json(
          { error: 'Error obteniendo leads', details: error.message },
          { status: 500 }
        )
      }

      leads.push(...data)
      if (data.length < to - from + 1) break
    }

    console.log(`✅ Leads obtenidos: ${leads.length} (cliente_id: ${cliente_id || 'todos'})`)

    return NextResponse.json({ leads, total: leads.length })

  } catch (error: any) {
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
    const { id, _usuario, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    const { data: actual, error: actualError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (actualError) {
      return NextResponse.json(
        { error: 'Lead no encontrado', details: actualError.message },
        { status: 404 }
      )
    }

    // Estado y booleanos legacy (contactado/vendido) siempre alineados
    if (updates.estado !== undefined) {
      if (!ESTADOS_VALIDOS.includes(updates.estado)) {
        return NextResponse.json(
          { error: `estado inválido: ${updates.estado}` },
          { status: 400 }
        )
      }
      Object.assign(updates, booleanosDeEstado(updates.estado as Estado))
    } else if (updates.vendido !== undefined || updates.contactado !== undefined) {
      const vendido = updates.vendido ?? actual.vendido
      const contactado = updates.contactado ?? actual.contactado
      actual.estado ??= actual.vendido ? 'vendido' : actual.contactado ? 'contactado' : 'nuevo'
      if (vendido) updates.estado = 'vendido'
      else if (!contactado) updates.estado = 'nuevo'
      else if (actual.estado === 'nuevo' || actual.estado === 'vendido') updates.estado = 'contactado'
    }

    if (updates.contactado && !actual.fecha_contacto && updates.fecha_contacto === undefined) {
      updates.fecha_contacto = new Date().toISOString()
    }

    // Sin migración aplicada (columna estado inexistente) solo se guardan los booleanos
    const tieneEstado = 'estado' in actual
    if (!tieneEstado && updates.estado && !['nuevo', 'contactado', 'vendido'].includes(updates.estado)) {
      return NextResponse.json(
        { error: 'Falta aplicar la migración de estados (supabase/migrations/20260925_leads_estado.sql)' },
        { status: 409 }
      )
    }
    const { estado: estadoNuevo, ...resto } = updates
    const cambios = tieneEstado ? updates : resto

    // Actualizar lead
    const { data: leadDb, error } = await supabase
      .from('leads')
      .update(cambios)
      .eq('id', id)
      .select()
      .single()
    const lead = leadDb && !tieneEstado ? { ...leadDb, estado: estadoNuevo ?? actual.estado } : leadDb

    if (error) {
      return NextResponse.json(
        { error: 'Error actualizando lead', details: error.message },
        { status: 500 }
      )
    }

    if (tieneEstado && updates.estado && updates.estado !== actual.estado) {
      await supabase.from('lead_historial').insert({
        lead_id: id,
        usuario: _usuario || 'Sistema',
        accion: 'estado',
        campo_cambiado: 'estado',
        valor_anterior: actual.estado,
        valor_nuevo: updates.estado,
        descripcion: updates.razon_no_venta ? `Motivo: ${updates.razon_no_venta}` : null
      })
    }

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

// POST: Crear un nuevo lead manualmente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      cliente_id,
      nombre,
      email,
      telefono,
      empresa,
      fuente, // email, whatsapp, zapier, meta
      observaciones,
      apellido,
      mensaje,
      estado
    } = body

    // Validar campos requeridos
    if (!cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id es requerido' },
        { status: 400 }
      )
    }

    if (!fuente) {
      return NextResponse.json(
        { error: 'fuente es requerida (email, whatsapp, zapier, meta)' },
        { status: 400 }
      )
    }

    if (!nombre && !email && !telefono) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos nombre, email o teléfono' },
        { status: 400 }
      )
    }

    // Crear el lead
    const fila = {
        cliente_id,
        nombre: nombre || null,
        email: email || null,
        telefono: telefono || null,
        empresa: empresa || null,
        fuente,
        observaciones: observaciones || null,
        apellido: apellido || null,
        mensaje: mensaje || null,
        ...(estado && ESTADOS_VALIDOS.includes(estado)
          ? { estado, ...booleanosDeEstado(estado as Estado) }
          : { contactado: false, vendido: false }),
        fecha_ingreso: new Date().toISOString()
    }
    let { data: lead, error } = await supabase.from('leads').insert(fila).select().single()
    // Sin migración aplicada: reintentar sin la columna estado
    if (error?.message.includes('estado')) {
      const { estado: _e, ...sinEstado } = fila as Record<string, unknown>
      ;({ data: lead, error } = await supabase.from('leads').insert(sinEstado).select().single())
    }

    if (error) {
      console.error('Error creando lead:', error)
      return NextResponse.json(
        { error: 'Error creando lead', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Lead creado manualmente: ${lead.id} - Fuente: ${fuente}`)

    return NextResponse.json({
      success: true,
      lead
    })

  } catch (error: any) {
    console.error('❌ Error en POST /api/crm/leads:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar uno o múltiples leads
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const ids = searchParams.get('ids') // Para eliminación múltiple: "1,2,3,4"

    // Eliminación múltiple
    if (ids) {
      const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))

      if (idArray.length === 0) {
        return NextResponse.json(
          { error: 'No se proporcionaron IDs válidos' },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', idArray)

      if (error) {
        return NextResponse.json(
          { error: 'Error eliminando leads', details: error.message },
          { status: 500 }
        )
      }

      console.log(`✅ ${idArray.length} leads eliminados: ${idArray.join(', ')}`)

      return NextResponse.json({
        success: true,
        message: `${idArray.length} leads eliminados exitosamente`,
        deletedCount: idArray.length
      })
    }

    // Eliminación individual
    if (!id) {
      return NextResponse.json(
        { error: 'id o ids es requerido' },
        { status: 400 }
      )
    }

    // Eliminar lead DIRECTAMENTE - las FK con CASCADE manejarán el resto
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Error eliminando lead', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Lead eliminado: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado exitosamente'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
