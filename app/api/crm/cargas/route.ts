/**
 * CRM CARGAS API
 * GET: Historial de cargas/archivos subidos
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/crm/cargas
 *
 * Query params:
 *   - clientId: UUID (required)
 *   - limit: número (default 50)
 *   - offset: número (default 0)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId es requerido' },
        { status: 400 }
      )
    }

    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error, count } = await supabase
      .from('cargas')
      .select('*', { count: 'exact' })
      .eq('cliente_id', clientId)
      .order('creado_en', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching cargas:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      cargas: data,
      total: count,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Error en GET cargas:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
