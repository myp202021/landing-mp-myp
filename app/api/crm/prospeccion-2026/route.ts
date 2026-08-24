import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/crm/prospeccion-2026?industria=X&estado=X&score_min=30&search=texto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const industria = searchParams.get('industria')
  const estado = searchParams.get('estado')
  const scoreMin = searchParams.get('score_min')
  const search = searchParams.get('search')

  try {
    let query = supabase
      .from('prospeccion_2026')
      .select('*', { count: 'exact' })
      .order('score', { ascending: false })

    if (industria) query = query.eq('industria', industria)
    if (estado) query = query.eq('estado', estado)
    if (scoreMin) query = query.gte('score', parseInt(scoreMin))
    if (search) query = query.or(`empresa.ilike.%${search}%,website.ilike.%${search}%`)

    const { data, error, count } = await query

    if (error) throw error

    // Stats
    const { data: allData } = await supabase
      .from('prospeccion_2026')
      .select('industria, estado')

    const stats = {
      total: allData?.length || 0,
      por_industria: {} as Record<string, number>,
      contactadas: allData?.filter(e => e.estado === 'contactada').length || 0,
      con_respuesta: allData?.filter(e => e.estado === 'respondio').length || 0,
      reuniones: allData?.filter(e => e.estado === 'reunion').length || 0,
    }

    if (allData) {
      for (const e of allData) {
        if (e.industria) {
          stats.por_industria[e.industria] = (stats.por_industria[e.industria] || 0) + 1
        }
      }
    }

    return NextResponse.json({ empresas: data || [], total: count || 0, stats })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/crm/prospeccion-2026
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { empresa, website, industria, que_hacen, email, ciudad, score, estado, notas, batch } = body

    if (!empresa) {
      return NextResponse.json({ error: 'empresa es requerido' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('prospeccion_2026')
      .insert({
        empresa,
        website: website || null,
        industria: industria || null,
        que_hacen: que_hacen || null,
        email: email || null,
        ciudad: ciudad || 'Santiago',
        score: score || 0,
        estado: estado || 'nueva',
        notas: notas || null,
        batch: batch || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, empresa: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/crm/prospeccion-2026 — update estado, score, notas
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const allowedFields = ['estado', 'score', 'notas', 'email', 'industria', 'que_hacen', 'website', 'ciudad', 'batch']
    const cleanUpdates: Record<string, any> = {}
    for (const key of allowedFields) {
      if (key in updates) cleanUpdates[key] = updates[key]
    }

    const { data, error } = await supabase
      .from('prospeccion_2026')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, empresa: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
