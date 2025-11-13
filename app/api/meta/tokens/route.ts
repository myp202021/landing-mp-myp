import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET - Obtener tokens de un cliente
 * POST - Agregar nuevo token
 * DELETE - Eliminar token
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

    const { data: tokens, error } = await supabase
      .from('meta_pages')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tokens: tokens || [] })
  } catch (error: any) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, page_id, page_name, page_access_token } = body

    if (!cliente_id || !page_id || !page_name || !page_access_token) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el cliente existe
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', cliente_id)
      .single()

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente not found' },
        { status: 404 }
      )
    }

    // Insertar o actualizar el token
    const { data, error } = await supabase
      .from('meta_pages')
      .upsert({
        cliente_id,
        page_id,
        page_name,
        page_access_token,
        sync_enabled: true
      }, {
        onConflict: 'page_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, token: data })
  } catch (error: any) {
    console.error('Error adding token:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tokenId = searchParams.get('token_id')

    if (!tokenId) {
      return NextResponse.json(
        { error: 'token_id is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('meta_pages')
      .delete()
      .eq('id', tokenId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting token:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
