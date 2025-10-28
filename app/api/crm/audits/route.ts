/**
 * CRM AUDITS API
 * GET: Historial de cambios en leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/crm/audits
 *
 * Query params:
 *   - clientId: UUID (optional, filtra por cliente)
 *   - leadId: number (optional, filtra por lead específico)
 *   - limit: número (default 100)
 *   - offset: número (default 0)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')
    const leadId = searchParams.get('leadId')

    let query = supabase
      .from('lead_audits')
      .select(`
        *,
        lead:leads(nombre, email, telefono)
      `, { count: 'exact' })

    if (clientId) {
      query = query.eq('cliente_id', clientId)
    }

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error, count } = await query
      .order('creado_en', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching audits:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      audits: data,
      total: count,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Error en GET audits:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
