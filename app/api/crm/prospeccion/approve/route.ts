import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/crm/prospeccion/approve
// Body: { company_id: number, action: 'approve' | 'disqualify' }
// Bulk: { company_ids: number[], action: 'approve' | 'disqualify' }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body
    const companyIds: number[] = body.company_ids || (body.company_id ? [body.company_id] : [])

    if (!companyIds.length || !['approve', 'disqualify'].includes(action)) {
      return NextResponse.json({ error: 'company_id(s) y action (approve|disqualify) requeridos' }, { status: 400 })
    }

    const newStatus = action === 'approve' ? 'qualified' : 'disqualified'

    const { data, error } = await supabase
      .from('prospect_companies')
      .update({ status: newStatus })
      .in('id', companyIds)
      .select('id, name, status')

    if (error) throw error

    return NextResponse.json({ updated: data, count: data?.length || 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
