import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getEstacionalidadMes } from '@/lib/config/estacionalidad-chile'

export const dynamic = 'force-dynamic'
export const maxDuration = 120 // 2 min for AI generation

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ---------- Model callers ----------

async function callOpenAI(system: string, user: string, maxTokens = 12000): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.6,
      max_tokens: maxTokens,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callClaude(system: string, user: string, maxTokens = 12000): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
      temperature: 0.6,
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

async function callModel(modelo: string, system: string, user: string): Promise<string> {
  // Mix: try primary, fallback to secondary
  if (modelo === 'claude-sonnet' && process.env.ANTHROPIC_API_KEY) {
    try { return await callClaude(system, user) } catch { /* fallback */ }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return await callOpenAI(system, user) } catch { /* fallback */ }
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return await callClaude(system, user)
  }
  throw new Error('No hay API keys configuradas (OPENAI_API_KEY o ANTHROPIC_API_KEY)')
}

// ---------- Parse JSON from LLM response ----------

function extractJSON(text: string): unknown {
  // Try direct parse
  try { return JSON.parse(text) } catch { /* continue */ }
  // Try extracting from markdown code block
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch { /* continue */ }
  }
  // Try finding array
  const arrMatch = text.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]) } catch { /* continue */ }
  }
  throw new Error('No se pudo parsear JSON de la respuesta')
}

// ---------- Main handler ----------

export async function POST(req: NextRequest) {
  try {
    const { cliente_id, mes, anio } = await req.json()
    if (!cliente_id || !mes || !anio) {
      return NextResponse.json({ error: 'cliente_id, mes y anio requeridos' }, { status: 400 })
    }

    // 1. Load briefing
    const { data: briefing } = await supabase
      .from('briefings_cliente')
      .select('*')
      .eq('cliente_id', cliente_id)
      .single()

    if (!briefing) {
      return NextResponse.json({ error: 'Este cliente no tiene briefing. Créalo primero.' }, { status: 400 })
    }

    // 2. Load client
    const { data: cliente } = await supabase
      .from('clientes')
      .select('nombre, rubro')
      .eq('id', cliente_id)
      .single()

    const nombreCliente = cliente?.nombre || 'Cliente'
    const rubroCliente = briefing.rubro || cliente?.rubro || 'general'

    // 3. Get recent copies (avoid repetition)
    const { data: grillasRecientes } = await supabase
      .from('grillas_contenido')
      .select('posts')
      .eq('cliente_id', cliente_id)
      .order('anio', { ascending: false })
      .order('mes', { ascending: false })
      .limit(2)

    const copiesRecientes = (grillasRecientes || [])
      .flatMap(g => (g.posts as Array<{ copy: string }>).map(p => p.copy))
      .filter(c => c && c.length > 30)
      .slice(0, 10)

    // 4. Build estacionalidad
    const estacionalidad = getEstacionalidadMes(rubroCliente, mes)

    // 5. Build prompt
    const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    const plataformas = (briefing.plataformas || ['Facebook/Instagram']).join(', ')
    const analisisWeb = briefing.analisis_web as Record<string, unknown> | null
    const analisisTono = briefing.analisis_tono as Record<string, unknown> | null
    const analisisComp = briefing.analisis_competitivo as Record<string, unknown> | null
    const feedback = briefing.feedback_equipo as Array<{ original: string; editado: string }> | null
    const copiesRef = briefing.copies_referencia as string[] | null

    const systemPrompt = `Eres un copywriter senior de performance marketing en Chile. Generas grillas de contenido para redes sociales. Escribes en español de Chile con acentos correctos. Cada post debe ser sustantivo, con datos concretos cuando sea posible, y nunca genérico.`

    const userPrompt = `
=== CLIENTE ===
${nombreCliente} — ${rubroCliente}
${briefing.web ? `Web: ${briefing.web}` : ''}
${briefing.productos ? `Productos/Servicios: ${briefing.productos}` : ''}
${analisisWeb ? `Propuesta de valor: ${analisisWeb.propuesta_valor || ''}
Productos: ${JSON.stringify(analisisWeb.productos_servicios || [])}
Diferenciadores: ${JSON.stringify(analisisWeb.diferenciadores || [])}
Números clave: ${JSON.stringify(analisisWeb.numeros_clave || [])}` : ''}

=== TONO DE COMUNICACIÓN ===
${analisisTono ? `Tono: ${analisisTono.tono_general || briefing.tono || 'profesional'}
Formalidad: ${analisisTono.nivel_formalidad || '7'}/10
Largo ideal: ${analisisTono.largo_ideal_post || '100-200 palabras'}
Estructura: ${analisisTono.estructura_preferida || ''}
Palabras frecuentes: ${JSON.stringify(analisisTono.palabras_frecuentes || [])}
Temas fuertes: ${JSON.stringify(analisisTono.temas_fuertes || [])}
Emojis: ${analisisTono.uso_emojis || 'máximo 1-2 por post'}` : `Tono: ${briefing.tono || 'profesional'}`}
${briefing.cierre_obligatorio ? `CIERRE OBLIGATORIO en cada post: "${briefing.cierre_obligatorio}"` : ''}

=== PLATAFORMAS ===
${plataformas} · ${briefing.frecuencia || '3-4 posts/semana'}

${analisisComp ? `=== ANÁLISIS COMPETITIVO ===
Lo que dice toda la categoría: ${analisisComp.que_dicen_todos || ''}
Lo que dice SOLO ${nombreCliente}: ${analisisComp.que_dice_solo_este_cliente || ''}
Ángulos diferenciadores: ${JSON.stringify(analisisComp.angulos_diferenciadores || [])}
Temas a evitar: ${JSON.stringify(analisisComp.temas_a_evitar || [])}` : ''}

=== CALENDARIO ${MESES[mes].toUpperCase()} ${anio} ===
${estacionalidad}

${copiesRef && copiesRef.length > 0 ? `=== COPIES DE REFERENCIA (imitar estilo) ===
${copiesRef.slice(0, 5).join('\n---\n')}` : ''}

${feedback && feedback.length > 0 ? `=== FEEDBACK DEL EQUIPO (incorporar correcciones) ===
El equipo editó estos copies así:
${feedback.slice(0, 5).map(f => `ORIGINAL: "${f.original?.substring(0, 100)}..." → EDITADO: "${f.editado?.substring(0, 100)}..."`).join('\n')}
Incorpora estas correcciones de estilo en los nuevos copies.` : ''}

=== REGLAS DE GENERACIÓN ===
- Genera exactamente 16 posts para ${MESES[mes]} ${anio}
- Distribúyelos de lunes a viernes, 3-4 por semana
- Alterna plataformas: ${plataformas}
- Tipos de post: Post (mayoría), Carrusel (2-3), Reel (1-2), Story (2-3)
- LinkedIn: 150-250 palabras mínimo, desarrollo argumentativo
- Facebook/Instagram: 70-150 palabras, directo pero sustantivo
- Varía la apertura: dato duro, pregunta provocadora, escenario real, afirmación contraintuitiva
- Al menos 3 posts deben conectar con la estacionalidad del mes
- Incluye nota_interna con indicación para diseño en cada post

=== PROHIBICIONES ABSOLUTAS ===
- NO empezar con "¿Sabías que...?", "En un mundo donde...", "Hoy más que nunca..."
- NO emojis al inicio del copy (máximo 1-2 al final como marcador visual)
- NO estadísticas inventadas
- NO buzzwords: "solución", "revolucionario", "líder del mercado", "innovador"
- NO posts genéricos tipo "Feliz Día de..." sin conexión sustantiva
${(briefing.palabras_prohibidas || []).length > 0 ? `- Palabras prohibidas: ${(briefing.palabras_prohibidas as string[]).join(', ')}` : ''}
${briefing.reglas_adicionales ? `- ${briefing.reglas_adicionales}` : ''}

${copiesRecientes.length > 0 ? `=== NO REPETIR (copies del mes anterior) ===
${copiesRecientes.slice(0, 5).map(c => c.substring(0, 80) + '...').join('\n')}` : ''}

=== FORMATO DE RESPUESTA ===
Responde SOLO con un JSON array de posts. Cada post:
[
  {
    "dia": 1,
    "dia_semana": "Lunes",
    "plataforma": "LinkedIn" o "Facebook/Instagram",
    "tipo_post": "Post" o "Carrusel" o "Reel" o "Video",
    "copy": "el copy completo",
    "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5",
    "nota_interna": "instrucción para diseño"
  }
]
Genera exactamente 16 posts. Solo JSON, sin texto adicional.`

    // 6. Call AI (mix models)
    const modelo = briefing.modelo || 'gpt-4o'
    const rawResponse = await callModel(modelo, systemPrompt, userPrompt)

    // 7. Parse response
    const posts = extractJSON(rawResponse) as Array<{
      dia: number; dia_semana: string; plataforma: string; tipo_post: string;
      copy: string; hashtags: string; nota_interna: string
    }>

    if (!Array.isArray(posts) || posts.length < 8) {
      return NextResponse.json({
        error: 'La IA generó menos de 8 posts. Intenta de nuevo.',
        posts_generados: Array.isArray(posts) ? posts.length : 0,
      }, { status: 422 })
    }

    // Add IDs
    const postsConId = posts.map((p, i) => ({
      ...p,
      id: `gen-${Date.now()}-${i}`,
      plataforma: p.plataforma === 'LinkedIn' ? 'LinkedIn' : 'Facebook/Instagram',
    }))

    // 8. Create or update grilla
    const { data: existente } = await supabase
      .from('grillas_contenido')
      .select('id')
      .eq('cliente_id', cliente_id)
      .eq('mes', mes)
      .eq('anio', anio)
      .single()

    let grilla
    if (existente) {
      const { data, error } = await supabase
        .from('grillas_contenido')
        .update({ posts: postsConId, estado: 'borrador', updated_at: new Date().toISOString() })
        .eq('id', existente.id)
        .select('*, clientes(nombre, rubro, contacto_email)')
        .single()
      if (error) throw error
      grilla = data
    } else {
      const { data, error } = await supabase
        .from('grillas_contenido')
        .insert({ cliente_id, mes, anio, posts: postsConId, estado: 'borrador' })
        .select('*, clientes(nombre, rubro, contacto_email)')
        .single()
      if (error) throw error
      grilla = data
    }

    return NextResponse.json({
      success: true,
      grilla,
      stats: {
        total_posts: postsConId.length,
        modelo_usado: modelo,
        linkedin: postsConId.filter(p => p.plataforma === 'LinkedIn').length,
        igfb: postsConId.filter(p => p.plataforma !== 'LinkedIn').length,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('POST generar grilla error:', msg)
    return NextResponse.json({ error: 'Error al generar grilla', details: msg }, { status: 500 })
  }
}
