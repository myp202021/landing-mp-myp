import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/copilot/feedback
// Recibe feedback del cliente desde el dashboard y lo guarda como aprendizaje
// El próximo run de los agentes lee estos aprendizajes y mejora
//
// Body: {
//   suscripcion_id: string,
//   tipo: "contenido" | "grilla" | "guion" | "auditoria" | "arbol" | "ads" | "general",
//   feedback: string,  // texto libre del cliente
//   item_id?: string,  // ID del item específico (copy, post, etc)
//   accion?: "aprobar" | "rechazar" | "editar" | "comentar",
//   contexto?: object, // datos adicionales
// }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { suscripcion_id, tipo, feedback, item_id, accion, contexto } = body

    if (!suscripcion_id || !tipo || !feedback) {
      return NextResponse.json({ error: 'suscripcion_id, tipo y feedback son requeridos' }, { status: 400 })
    }

    // Mapear el feedback a un aprendizaje que los agentes puedan usar
    let agente = 'cliente'
    let tipoAprendizaje = 'preferencia_cliente'
    let confianza = 0.7 // feedback directo del cliente tiene alta confianza

    let textoAprendizaje = ''

    switch (accion) {
      case 'aprobar':
        textoAprendizaje = `Cliente aprobó ${tipo}: "${feedback}"`
        confianza = 0.8
        break
      case 'rechazar':
        textoAprendizaje = `Cliente rechazó ${tipo}: "${feedback}". NO repetir este enfoque.`
        confianza = 0.9 // rechazo tiene máxima confianza
        tipoAprendizaje = 'alerta'
        break
      case 'editar':
        textoAprendizaje = `Cliente editó ${tipo}: "${feedback}". Preferencia de estilo/tono.`
        confianza = 0.7
        break
      default:
        textoAprendizaje = `Feedback del cliente sobre ${tipo}: "${feedback}"`
        confianza = 0.6
    }

    // Guardar como aprendizaje persistente
    const { error: aprendizajeError } = await supabase
      .from('copilot_aprendizajes')
      .insert({
        suscripcion_id,
        agente,
        tipo: tipoAprendizaje,
        aprendizaje: textoAprendizaje,
        confianza,
        confirmaciones: 1,
        contexto: {
          tipo_feedback: tipo,
          accion: accion || 'comentar',
          item_id: item_id || null,
          feedback_original: feedback,
          ...(contexto || {}),
          fecha: new Date().toISOString(),
        },
        activo: true,
      })

    if (aprendizajeError) {
      // Tabla puede no existir aún
      console.error('Feedback save error:', aprendizajeError.message)
      return NextResponse.json({ error: 'Error guardando feedback: ' + aprendizajeError.message }, { status: 500 })
    }

    // Si es aprobación/rechazo de una idea, actualizar estado en copilot_ideas
    if (tipo === 'contenido' && item_id && (accion === 'aprobar' || accion === 'rechazar')) {
      await supabase
        .from('copilot_ideas')
        .update({ estado: accion === 'aprobar' ? 'aprobada' : 'descartada' })
        .eq('id', item_id)
    }

    return NextResponse.json({
      ok: true,
      mensaje: 'Feedback guardado. Los agentes lo usarán en el próximo run.',
      aprendizaje: textoAprendizaje,
    })
  } catch (e: any) {
    console.error('Feedback API error:', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// GET /api/copilot/feedback?suscripcion_id=xxx
// Lista los aprendizajes del cliente para mostrar en dashboard
export async function GET(request: Request) {
  const url = new URL(request.url)
  const suscripcionId = url.searchParams.get('suscripcion_id')

  if (!suscripcionId) {
    return NextResponse.json({ error: 'suscripcion_id requerido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('copilot_aprendizajes')
    .select('*')
    .eq('suscripcion_id', suscripcionId)
    .eq('activo', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ aprendizajes: data || [] })
}
