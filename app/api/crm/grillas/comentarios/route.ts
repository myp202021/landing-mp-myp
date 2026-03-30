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
    const grillaId = searchParams.get('grilla_id')
    const postId = searchParams.get('post_id')

    if (!grillaId) {
      return NextResponse.json({ error: 'grilla_id es requerido' }, { status: 400 })
    }

    let query = supabase
      .from('grilla_comentarios')
      .select('*')
      .eq('grilla_id', grillaId)
      .order('created_at', { ascending: true })

    if (postId) {
      query = query.eq('post_id', postId)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ comentarios: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('GET comentarios error:', message)
    return NextResponse.json({ error: 'Error al obtener comentarios', details: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { grilla_id, post_id, autor, texto, es_cliente } = body

    if (!grilla_id || !post_id || !autor || !texto) {
      return NextResponse.json({ error: 'grilla_id, post_id, autor y texto son requeridos' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('grilla_comentarios')
      .insert({
        grilla_id,
        post_id,
        autor: autor.trim(),
        texto: texto.trim(),
        es_cliente: es_cliente || false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, comentario: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('POST comentarios error:', message)
    return NextResponse.json({ error: 'Error al crear comentario', details: message }, { status: 500 })
  }
}
