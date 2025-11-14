import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Listar historial de integraciones
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('cliente_id')
    const tipo = searchParams.get('tipo')
    const accion = searchParams.get('accion')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('integraciones_log')
      .select(`
        *,
        clientes:cliente_id (
          nombre
        ),
        usuarios:user_id (
          nombre,
          username
        )
      `, { count: 'exact' })
      .order('creado_en', { ascending: false })
      .range(offset, offset + limit - 1)

    if (clienteId) {
      query = query.eq('cliente_id', clienteId)
    }

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    if (accion) {
      query = query.eq('accion', accion)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      historial: data,
      total: count,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error en GET historial:', error)
    return NextResponse.json(
      { error: 'Error obteniendo historial', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Registrar evento de integración
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, tipo, accion, descripcion, metadata, webhook_url, user_id } = body

    if (!cliente_id || !tipo || !accion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: cliente_id, tipo, accion' },
        { status: 400 }
      )
    }

    // Validar tipo
    const tiposValidos = ['zapier', 'google_ads', 'meta_ads']
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: `Tipo inválido. Debe ser uno de: ${tiposValidos.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar acción
    const accionesValidas = ['activado', 'desactivado', 'configurado', 'error', 'test_exitoso', 'test_fallido']
    if (!accionesValidas.includes(accion)) {
      return NextResponse.json(
        { error: `Acción inválida. Debe ser una de: ${accionesValidas.join(', ')}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('integraciones_log')
      .insert({
        cliente_id,
        tipo,
        accion,
        descripcion,
        metadata: metadata || {},
        webhook_url,
        user_id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, evento: data },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en POST historial:', error)
    return NextResponse.json(
      { error: 'Error registrando evento', details: error.message },
      { status: 500 }
    )
  }
}
