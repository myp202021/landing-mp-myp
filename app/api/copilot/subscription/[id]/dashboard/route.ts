import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: toda la data del dashboard en una sola llamada
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const { verifyOwnership } = await import('@/lib/copilot-auth')
  if (!(await verifyOwnership(req, id))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Periodo dinámico desde query param (default 60 días)
  const periodo = req.nextUrl.searchParams.get('periodo') || '60d'
  const dias = parseInt(periodo) || 60
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Ejecutar todas las queries en paralelo
  const [rSub, rPosts, rContenido, rAuditoria, rGuiones, rIdeas, rBenchmarks, rAds, rArboles, rReportes, rAprendizajes] = await Promise.all([
    supabase.from('clipping_suscripciones').select('*').eq('id', id).single(),
    supabase.from('radar_posts').select('*').eq('suscripcion_id', id).gte('fecha_scrape', desde).order('fecha_scrape', { ascending: false }),
    supabase.from('radar_contenido').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false }),
    supabase.from('copilot_auditorias').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false }),
    supabase.from('copilot_guiones').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false }),
    supabase.from('copilot_ideas').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false }),
    supabase.from('copilot_benchmarks').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false }),
    Promise.resolve(supabase.from('copilot_ads_creativos').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false })).catch(() => ({ data: [], error: null })),
    Promise.resolve(supabase.from('copilot_arboles').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false })).catch(() => ({ data: [], error: null })),
    Promise.resolve(supabase.from('copilot_reportes').select('*').eq('suscripcion_id', id).order('created_at', { ascending: false })).catch(() => ({ data: [], error: null })),
    Promise.resolve(supabase.from('copilot_aprendizajes').select('*').eq('suscripcion_id', id).eq('activo', true).order('confianza', { ascending: false }).limit(20)).catch(() => ({ data: [], error: null })),
  ])

  if (rSub.error || !rSub.data) {
    return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 })
  }

  return NextResponse.json({
    suscripcion: rSub.data,
    posts: rPosts.data || [],
    contenido: rContenido.data || [],
    auditorias: rAuditoria.data || [],
    guiones: rGuiones.data || [],
    ideas: rIdeas.data || [],
    benchmarks: rBenchmarks.data || [],
    ads: rAds.data || [],
    arboles: rArboles.data || [],
    reportes: rReportes.data || [],
    aprendizajes: rAprendizajes.data || [],
  })
}

// PATCH: actualizar ideas (aprobar/rechazar), guardar feedback
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const { verifyOwnership } = await import('@/lib/copilot-auth')
  if (!(await verifyOwnership(req, id))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()

  // Actualizar idea
  if (body.action === 'update_idea' && body.idea_id) {
    const update: Record<string, any> = {}
    if (body.estado) update.estado = body.estado
    if (body.feedback) update.feedback = body.feedback
    const { error } = await supabase.from('copilot_ideas').update(update).eq('id', body.idea_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Crear idea
  if (body.action === 'create_idea') {
    const insertData: Record<string, any> = {
      suscripcion_id: id,
      titulo: body.titulo,
      descripcion: body.descripcion || '',
      estado: 'pendiente',
    }
    if (body.categoria) insertData.categoria = body.categoria
    if (body.prioridad) insertData.prioridad = body.prioridad
    const { error } = await supabase.from('copilot_ideas').insert(insertData)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Guardar perfil empresa desde dashboard
  if (body.action === 'update_perfil' && body.perfil_empresa) {
    const { error } = await supabase.from('clipping_suscripciones').update({ perfil_empresa: body.perfil_empresa }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
