import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/crm/prospeccion?tab=empresas|outreach|benchmarks&industry=X&status=X&page=1&limit=50
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab') || 'empresas'
  const industry = searchParams.get('industry')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = (page - 1) * limit

  try {
    if (tab === 'empresas') {
      let query = supabase
        .from('prospect_companies')
        .select(`
          *,
          prospect_contacts(id, contact_email, email_type, is_primary, is_valid, verification_status)
        `, { count: 'exact' })
        .order('creado_en', { ascending: false })
        .range(offset, offset + limit - 1)

      if (industry) query = query.eq('industry', industry)
      if (status) query = query.eq('status', status)

      // Filtro por verificación Snov.io
      const verified = searchParams.get('verified')
      // Este filtro se aplica en frontend porque el filtro de relación es complejo

      const { data, count, error } = await query
      if (error) throw error

      return NextResponse.json({ empresas: data, total: count })
    }

    if (tab === 'outreach') {
      let query = supabase
        .from('prospect_outreach')
        .select(`
          *,
          prospect_companies(id, name, website, industry, city),
          prospect_contacts(contact_email, contact_name),
          prospect_benchmarks(final_score)
        `, { count: 'exact' })
        .order('creado_en', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) query = query.eq('status', status)

      const { data, count, error } = await query
      if (error) throw error

      return NextResponse.json({ outreach: data, total: count })
    }

    if (tab === 'benchmarks') {
      // Mostrar empresas con email válido, listas para aprobar/enviar
      let query = supabase
        .from('prospect_companies')
        .select(`
          *,
          prospect_contacts!inner(id, contact_email, email_type, is_primary, is_valid, verification_status)
        `, { count: 'exact' })
        .in('status', ['enriched', 'benchmarked', 'qualified', 'discovered'])
        .order('creado_en', { ascending: false })
        .range(offset, offset + limit - 1)

      if (industry) query = query.eq('industry', industry)

      const { data, count, error } = await query
      if (error) throw error

      return NextResponse.json({ benchmarks: data, total: count })
    }

    // Stats generales — usar select con count para evitar bugs de head:true
    if (tab === 'stats') {
      const { data: allCompanies } = await supabase.from('prospect_companies').select('id, status')
      const { data: allContacts } = await supabase.from('prospect_contacts').select('id, is_valid, verification_status')

      const companies = allCompanies || []
      const contacts = allContacts || []

      return NextResponse.json({
        total_empresas: companies.length,
        con_email: contacts.filter(c => c.is_valid === true).length,
        enriched: companies.filter(c => ['enriched', 'benchmarked'].includes(c.status)).length,
        qualified: companies.filter(c => c.status === 'qualified').length,
        emailed: companies.filter(c => c.status === 'emailed').length,
        replied: companies.filter(c => c.status === 'replied').length,
      })
    }

    return NextResponse.json({ error: 'Tab no válido' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
