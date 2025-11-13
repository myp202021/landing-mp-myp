import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Obtener conexiones de Meta por cliente
 * GET /api/meta/connections?cliente_id=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('cliente_id')

    if (!clienteId) {
      return NextResponse.json(
        { error: 'cliente_id is required' },
        { status: 400 }
      )
    }

    // Obtener conexión
    const { data: connection, error: connectionError } = await supabase
      .from('meta_connections')
      .select('*')
      .eq('cliente_id', clienteId)
      .single()

    if (connectionError && connectionError.code !== 'PGRST116') {
      console.error('Error fetching connection:', connectionError)
      return NextResponse.json(
        { error: connectionError.message },
        { status: 500 }
      )
    }

    // Si no hay conexión, retornar null
    if (!connection) {
      return NextResponse.json({
        connection: null,
        pages: [],
        forms: []
      })
    }

    // Obtener páginas
    const { data: pages, error: pagesError } = await supabase
      .from('meta_pages')
      .select('*')
      .eq('connection_id', connection.id)
      .order('page_name')

    if (pagesError) {
      console.error('Error fetching pages:', pagesError)
    }

    // Obtener formularios para cada página
    const pageIds = pages?.map(p => p.id) || []
    const { data: forms, error: formsError } = await supabase
      .from('meta_lead_forms')
      .select('*')
      .in('page_id', pageIds)
      .order('form_name')

    if (formsError) {
      console.error('Error fetching forms:', formsError)
    }

    return NextResponse.json({
      connection,
      pages: pages || [],
      forms: forms || []
    })
  } catch (error: any) {
    console.error('Error in /api/meta/connections:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Desconectar Meta (eliminar conexión)
 * DELETE /api/meta/connections?cliente_id=xxx
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('cliente_id')

    if (!clienteId) {
      return NextResponse.json(
        { error: 'cliente_id is required' },
        { status: 400 }
      )
    }

    // Eliminar conexión (cascade eliminará páginas y formularios)
    const { error } = await supabase
      .from('meta_connections')
      .delete()
      .eq('cliente_id', clienteId)

    if (error) {
      console.error('Error deleting connection:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/meta/connections:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
