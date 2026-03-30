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
    const { cliente_id, mes, anio, contexto_mes } = await req.json()
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
    const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const estacionalidad = getEstacionalidadMes(rubroCliente, mes)

    // 4b. Fetch current contingency/trends for Chile (via OpenAI, cheap call)
    let contingencia = ''
    try {
      const contRes = await callOpenAI(
        'Eres un analista de mercado en Chile. Responde SOLO con datos concretos, verificables y actuales.',
        `Estamos en ${MESES[mes]} ${anio} en Chile. Dame 6-8 hechos concretos sobre la economía, mercado laboral, tendencias de consumo, noticias regulatorias o eventos relevantes de este mes en Chile que sirvan como contexto para contenido de redes sociales de una empresa del rubro "${rubroCliente}". Solo hechos, sin opiniones. Formato: lista con viñetas.`,
        800
      )
      contingencia = contRes
    } catch { contingencia = '' }

    // 5. Build prompt

    const plataformas = (briefing.plataformas || ['Facebook/Instagram']).join(', ')
    const analisisWeb = briefing.analisis_web as Record<string, unknown> | null
    const analisisTono = briefing.analisis_tono as Record<string, unknown> | null
    const analisisComp = briefing.analisis_competitivo as Record<string, unknown> | null
    const feedback = briefing.feedback_equipo as Array<{ original: string; editado: string }> | null
    const copiesRef = briefing.copies_referencia as string[] | null

    const systemPrompt = `Eres un director de contenidos con 10 años de experiencia en performance marketing en Chile. Escribes copies para redes sociales que generan engagement real — no relleno genérico. Cada post que escribes tiene una TESIS clara, desarrollo con datos o escenarios concretos, y un cierre que mueve a la acción.

REGLAS INQUEBRANTABLES DE CALIDAD:
1. CADA post debe tener una idea central específica. "Nuestro producto es bueno" NO es una idea. "El 73% del agua de red contiene sedimentos que alteran el sabor del café" SÍ es una idea.
2. Los posts de Facebook/Instagram deben tener MÍNIMO 100 palabras. Los de LinkedIn MÍNIMO 180 palabras. Si un post tiene menos, está MAL.
3. La estructura de cada post es: GANCHO (primera frase que atrapa) → DESARROLLO (argumento, dato, escenario) → RESOLUCIÓN (cómo el producto/servicio resuelve) → CTA o cierre.
4. NUNCA uses frases genéricas como "somos la mejor opción", "calidad garantizada", "confía en nosotros". Muestra, no digas.
5. Cada post debe poder funcionar SOLO — sin necesitar contexto de otros posts.
6. Escribe en español de Chile con acentos correctos (á, é, í, ó, ú, ñ).`

    const userPrompt = `
=== CLIENTE ===
${nombreCliente} — ${rubroCliente}
${briefing.web ? `Web: ${briefing.web}` : ''}
${briefing.productos ? `Productos/Servicios: ${briefing.productos}` : ''}
${analisisWeb ? `
PROPUESTA DE VALOR: ${analisisWeb.propuesta_valor || ''}
PRODUCTOS ESPECÍFICOS: ${JSON.stringify(analisisWeb.productos_servicios || [])}
DIFERENCIADORES REALES: ${JSON.stringify(analisisWeb.diferenciadores || [])}
NÚMEROS VERIFICABLES: ${JSON.stringify(analisisWeb.numeros_clave || [])}
SECTORES TARGET: ${JSON.stringify((analisisWeb as Record<string, unknown>).sectores_target || [])}` : ''}

=== TONO Y PERSONALIDAD DE MARCA ===
${analisisTono ? `Tono: ${analisisTono.tono_general || briefing.tono || 'profesional'}
Formalidad: ${analisisTono.nivel_formalidad || '7'}/10
Estructura preferida: ${analisisTono.estructura_preferida || 'Gancho → Desarrollo → CTA'}
Palabras que SÍ usar: ${JSON.stringify(analisisTono.palabras_frecuentes || [])}
Temas fuertes del cliente: ${JSON.stringify(analisisTono.temas_fuertes || [])}
Emojis: ${analisisTono.uso_emojis || 'máximo 1-2 al final, NUNCA al inicio'}` : `Tono: ${briefing.tono || 'profesional'}`}
${briefing.cierre_obligatorio ? `\nCIERRE OBLIGATORIO — incluir al final de CADA post: "${briefing.cierre_obligatorio}"` : ''}

=== PLATAFORMAS Y FRECUENCIA ===
${plataformas} · ${briefing.frecuencia || '3-4 posts/semana'}

${analisisComp ? `=== POSICIONAMIENTO COMPETITIVO ===
Lo que dice TODA la categoría (evitar repetir): ${analisisComp.que_dicen_todos || ''}
Lo que dice SOLO ${nombreCliente} (explotar): ${analisisComp.que_dice_solo_este_cliente || ''}
Ángulos diferenciadores para contenido: ${JSON.stringify(analisisComp.angulos_diferenciadores || [])}
Temas a evitar (la competencia ya los gastó): ${JSON.stringify(analisisComp.temas_a_evitar || [])}` : ''}

=== ESTACIONALIDAD ${MESES[mes].toUpperCase()} ${anio} ===
${estacionalidad}
${contingencia ? `\n=== CONTINGENCIA ACTUAL EN CHILE (usar como contexto) ===\n${contingencia}` : ''}
${contexto_mes ? `\n=== INSTRUCCIONES ESPECIALES ESTE MES (PRIORIDAD ALTA) ===\nEl equipo indicó lo siguiente para este mes — DEBE reflejarse en al menos 3-4 posts:\n${contexto_mes}` : ''}
IMPORTANTE: Al menos 4 posts DEBEN conectar con fechas, contingencia o contexto del mes. No de forma forzada — la conexión debe ser natural y relevante para el rubro.

${copiesRef && copiesRef.length > 0 ? `=== COPIES DE REFERENCIA (este es el nivel de calidad esperado) ===
Estudia estos copies del cliente y replica su nivel de profundidad, largo y estilo:
${copiesRef.slice(0, 5).join('\n---\n')}` : ''}

${feedback && feedback.length > 0 ? `=== CORRECCIONES DEL EQUIPO (incorporar obligatoriamente) ===
El equipo editó copies anteriores. Aprende de estas correcciones:
${feedback.slice(0, 5).map(f => `ANTES: "${f.original?.substring(0, 150)}..." → DESPUÉS: "${f.editado?.substring(0, 150)}..."`).join('\n')}` : ''}

=== ESPECIFICACIONES TÉCNICAS ===
- Genera exactamente 16 posts para ${MESES[mes]} ${anio}
- Distribúyelos de lunes a viernes, 3-4 por semana (algunos sábados si hay contenido estacional)
- Alterna plataformas: ${plataformas}
- Tipos: Post (10-12), Carrusel (2-3), Reel (1-2)
- NO generes Stories (esas las hace el equipo de diseño)

=== LARGO MÍNIMO OBLIGATORIO ===
- Facebook/Instagram Post: MÍNIMO 100 palabras, ideal 120-160
- Facebook/Instagram Carrusel: MÍNIMO 80 palabras + descripción de cada slide en nota_interna
- Facebook/Instagram Reel: MÍNIMO 60 palabras (es guión de voz/subtítulos)
- LinkedIn Post: MÍNIMO 180 palabras, ideal 200-280
- LinkedIn Carrusel: MÍNIMO 150 palabras + slides en nota_interna
- SI UN POST TIENE MENOS DEL MÍNIMO, ESTÁ MAL. Desarrolla más la idea.

=== VARIEDAD DE APERTURAS (rotar, nunca repetir 2 seguidas iguales) ===
1. DATO DURO: "El 34% de las empresas en Chile..." / "Cada mes se pierden 1.500 horas en..."
2. ESCENARIO REAL: "Imagina que llegas a tu oficina y..." / "Son las 7am. Tu equipo de RRHH ya está..."
3. PREGUNTA PROVOCADORA: "¿Cuánto le cuesta a tu empresa cada error en la nómina?"
4. AFIRMACIÓN CONTRAINTUITIVA: "El agua potable en Chile es segura. Pero eso no significa que sea buena."
5. PROBLEMA CONCRETO: "Firmas un contrato. Lo escaneas. Lo mandas por email. Te lo devuelven sin firma..."

=== PROHIBICIONES ABSOLUTAS ===
- JAMÁS empezar con: "¿Sabías que...?", "En un mundo donde...", "Hoy más que nunca...", "En la era digital..."
- JAMÁS usar emojis al inicio del copy
- JAMÁS inventar estadísticas — usa solo datos del briefing o datos públicos verificables
- JAMÁS usar: "solución integral", "revolucionario", "líder del mercado", "innovador", "de vanguardia", "a tu alcance"
- JAMÁS hacer posts genéricos tipo "Feliz Día de..." sin conexión real con el producto/servicio
- JAMÁS escribir copies de menos de 3 párrafos para Posts de LinkedIn
- JAMÁS repetir la misma estructura en 2 posts consecutivos
${(briefing.palabras_prohibidas || []).length > 0 ? `- Palabras prohibidas del cliente: ${(briefing.palabras_prohibidas as string[]).join(', ')}` : ''}
${briefing.reglas_adicionales ? `- Regla adicional: ${briefing.reglas_adicionales}` : ''}

${copiesRecientes.length > 0 ? `=== COPIES RECIENTES (no repetir ideas ni estructuras) ===
${copiesRecientes.slice(0, 8).map(c => `• ${c.substring(0, 100)}...`).join('\n')}` : ''}

=== NOTA INTERNA ===
Cada post DEBE incluir nota_interna detallada para el equipo de diseño:
- Tipo de visual (foto, ilustración, screenshot, gráfico comparativo)
- Paleta de colores sugerida
- Texto destacado para la imagen (si aplica)
- Para Carruseles: descripción de cada slide (mínimo 4 slides)
- Para Reels: descripción de escenas, duración sugerida, si necesita subtítulos

=== FORMATO JSON ===
Responde ÚNICAMENTE con un JSON array. Sin texto antes ni después. Sin markdown.
[
  {
    "dia": 1,
    "dia_semana": "Lunes",
    "plataforma": "LinkedIn" o "Facebook/Instagram",
    "tipo_post": "Post" o "Carrusel" o "Reel",
    "copy": "EL COPY COMPLETO — largo, desarrollado, con sustancia",
    "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5",
    "nota_interna": "Instrucciones detalladas para diseño"
  }
]`

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

    // Validate word counts and quality
    const validated = posts.map(p => {
      const wordCount = p.copy?.split(/\s+/).filter(Boolean).length || 0
      const isLinkedIn = p.plataforma === 'LinkedIn'
      const minWords = isLinkedIn ? 150 : (p.tipo_post === 'Reel' ? 50 : 80)
      // If too short, flag it but don't reject
      const needsExpansion = wordCount < minWords
      return { ...p, wordCount, needsExpansion }
    })

    const shortPosts = validated.filter(p => p.needsExpansion)
    const avgWords = Math.round(validated.reduce((sum, p) => sum + p.wordCount, 0) / validated.length)

    // Add IDs
    const postsConId = validated.map((p, i) => ({
      dia: p.dia,
      dia_semana: p.dia_semana,
      plataforma: p.plataforma === 'LinkedIn' ? 'LinkedIn' : 'Facebook/Instagram',
      tipo_post: p.tipo_post,
      copy: p.copy,
      hashtags: p.hashtags,
      nota_interna: p.nota_interna + (p.needsExpansion ? ` [⚠️ Copy corto: ${p.wordCount} palabras — expandir]` : ''),
      id: `gen-${Date.now()}-${i}`,
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
        promedio_palabras: avgWords,
        posts_cortos: shortPosts.length,
        con_contingencia: contingencia ? true : false,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('POST generar grilla error:', msg)
    return NextResponse.json({ error: 'Error al generar grilla', details: msg }, { status: 500 })
  }
}
