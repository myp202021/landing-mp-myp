import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const clienteId = searchParams.get('cliente_id')
    const mes = searchParams.get('mes')
    const anio = searchParams.get('anio')
    const token = searchParams.get('token')

    // Public access by token
    if (token) {
      const { data, error } = await supabase
        .from('grillas_contenido')
        .select('*, clientes(nombre, rubro, contacto_email)')
        .eq('token_publico', token)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
      }
      return NextResponse.json({ grilla: data })
    }

    // Single by ID
    if (id) {
      const { data, error } = await supabase
        .from('grillas_contenido')
        .select('*, clientes(nombre, rubro, contacto_email)')
        .eq('id', id)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
      }
      return NextResponse.json({ grilla: data })
    }

    // By cliente + mes + anio
    if (clienteId && mes && anio) {
      const { data, error } = await supabase
        .from('grillas_contenido')
        .select('*, clientes(nombre, rubro, contacto_email)')
        .eq('cliente_id', clienteId)
        .eq('mes', parseInt(mes))
        .eq('anio', parseInt(anio))
        .single()

      if (error || !data) {
        return NextResponse.json({ grilla: null })
      }
      return NextResponse.json({ grilla: data })
    }

    // All by cliente
    if (clienteId) {
      const { data, error } = await supabase
        .from('grillas_contenido')
        .select('*, clientes(nombre, rubro, contacto_email)')
        .eq('cliente_id', clienteId)
        .order('anio', { ascending: false })
        .order('mes', { ascending: false })

      if (error) throw error
      return NextResponse.json({ grillas: data })
    }

    // All grillas (hub admin) — optionally filter by mes/anio
    let query = supabase
      .from('grillas_contenido')
      .select('id, cliente_id, mes, anio, estado, token_publico, updated_at, clientes(nombre, rubro, contacto_email)')

    if (mes && anio) {
      query = query.eq('mes', parseInt(mes)).eq('anio', parseInt(anio))
    }

    const { data, error } = await query.order('updated_at', { ascending: false })
    if (error) throw error

    return NextResponse.json({ grillas: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('GET /api/crm/grillas error:', message)
    return NextResponse.json({ error: 'Error al obtener grillas', details: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, mes, anio, posts } = body

    if (!cliente_id || !mes || !anio) {
      return NextResponse.json({ error: 'cliente_id, mes y anio son requeridos' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('grillas_contenido')
      .insert({
        cliente_id,
        mes,
        anio,
        posts: posts || [],
        estado: 'borrador',
      })
      .select('*, clientes(nombre, rubro, contacto_email)')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ya existe una grilla para este cliente/mes/año' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true, grilla: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('POST /api/crm/grillas error:', message)
    return NextResponse.json({ error: 'Error al crear grilla', details: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('grillas_contenido')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, clientes(nombre, rubro, contacto_email)')
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, grilla: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('PATCH /api/crm/grillas error:', message)
    return NextResponse.json({ error: 'Error al actualizar grilla', details: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('grillas_contenido')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('DELETE /api/crm/grillas error:', message)
    return NextResponse.json({ error: 'Error al eliminar grilla', details: message }, { status: 500 })
  }
}
