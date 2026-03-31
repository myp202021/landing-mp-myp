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

    const { data } = await supabase
      .from('benchmarks_cliente')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({ benchmark: data || null })
  } catch {
    return NextResponse.json({ benchmark: null })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cliente_id, cliente_web, cliente_ig, competidores } = body
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    const { data, error } = await supabase
      .from('benchmarks_cliente')
      .upsert({
        cliente_id,
        cliente_web: cliente_web || '',
        cliente_ig: cliente_ig || '',
        competidores: competidores || [],
      }, { onConflict: 'cliente_id' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, benchmark: data })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
