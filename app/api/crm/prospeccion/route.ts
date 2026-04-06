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
          prospect_contacts(id, contact_email, email_type, is_primary, is_valid, verification_status),
          prospect_benchmarks(id, final_score, generated_at)
        `, { count: 'exact' })
        .order('creado_en', { ascending: false })
        .range(offset, offset + limit - 1)

      if (industry) query = query.eq('industry', industry)
      if (status) query = query.eq('status', status)

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
      const { data, count, error } = await supabase
        .from('prospect_benchmarks')
        .select(`
          *,
          prospect_companies(id, name, website, industry, city, instagram_url, linkedin_url, facebook_url)
        `, { count: 'exact' })
        .order('generated_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return NextResponse.json({ benchmarks: data, total: count })
    }

    // Stats generales
    if (tab === 'stats') {
      const [companies, enriched, benchmarked, emailed, replied] = await Promise.all([
        supabase.from('prospect_companies').select('id', { count: 'exact', head: true }),
        supabase.from('prospect_companies').select('id', { count: 'exact', head: true }).eq('status', 'enriched'),
        supabase.from('prospect_companies').select('id', { count: 'exact', head: true }).eq('status', 'benchmarked'),
        supabase.from('prospect_companies').select('id', { count: 'exact', head: true }).eq('status', 'emailed'),
        supabase.from('prospect_companies').select('id', { count: 'exact', head: true }).eq('status', 'replied'),
      ])

      return NextResponse.json({
        total_empresas: companies.count || 0,
        enriched: enriched.count || 0,
        benchmarked: benchmarked.count || 0,
        emailed: emailed.count || 0,
        replied: replied.count || 0,
      })
    }

    return NextResponse.json({ error: 'Tab no válido' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
