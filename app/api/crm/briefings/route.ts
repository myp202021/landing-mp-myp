import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const clienteId = new URL(req.url).searchParams.get('cliente_id')
    if (!clienteId) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    const { data, error } = await supabase
      .from('briefings_cliente')
      .select('*')
      .eq('cliente_id', clienteId)
      .single()

    if (error || !data) return NextResponse.json({ briefing: null })
    return NextResponse.json({ briefing: data })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, ...fields } = body
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    // Upsert: create or update
    const { data, error } = await supabase
      .from('briefings_cliente')
      .upsert({ cliente_id, ...fields, updated_at: new Date().toISOString() }, { onConflict: 'cliente_id' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, briefing: data })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, ...updates } = body
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    const { data, error } = await supabase
      .from('briefings_cliente')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('cliente_id', cliente_id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, briefing: data })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
