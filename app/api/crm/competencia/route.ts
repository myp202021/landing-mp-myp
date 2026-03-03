import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { searchParams } = new URL(request.url)
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('reportes_competencia')
    .select('*')
    .eq('fecha_reporte', fecha)
    .order('sin_actividad', { ascending: true })
    .order('likes', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ reportes: data || [], fecha })
}
