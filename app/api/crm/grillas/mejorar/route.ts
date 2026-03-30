import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function callOpenAI(system: string, user: string, maxTokens = 12000): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.5,
      max_tokens: maxTokens,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

function extractJSON(text: string): unknown {
  try { return JSON.parse(text) } catch { /* continue */ }
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (match) { try { return JSON.parse(match[1]) } catch { /* continue */ } }
  const arrMatch = text.match(/\[[\s\S]*\]/)
  if (arrMatch) { try { return JSON.parse(arrMatch[0]) } catch { /* continue */ } }
  throw new Error('No se pudo parsear JSON')
}

export async function POST(req: NextRequest) {
  try {
    const { grilla_id, instrucciones } = await req.json()
    if (!grilla_id) return NextResponse.json({ error: 'grilla_id requerido' }, { status: 400 })

    // Load grilla + briefing
    const { data: grilla } = await supabase
      .from('grillas_contenido')
      .select('*, clientes(nombre, rubro)')
      .eq('id', grilla_id)
      .single()

    if (!grilla) return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })

    const cliente = grilla.clientes as { nombre: string; rubro: string }
    const posts = grilla.posts as Array<{
      id: string; dia: number; dia_semana: string; plataforma: string;
      tipo_post: string; copy: string; hashtags: string; nota_interna: string
    }>

    if (!posts.length) return NextResponse.json({ error: 'La grilla no tiene posts para mejorar' }, { status: 400 })

    // Load briefing for context
    const { data: briefing } = await supabase
      .from('briefings_cliente')
      .select('tono, cierre_obligatorio, analisis_tono, palabras_prohibidas')
      .eq('cliente_id', grilla.cliente_id)
      .single()

    const tono = (briefing?.analisis_tono as Record<string, unknown>)?.tono_general || briefing?.tono || 'profesional'
    const cierre = briefing?.cierre_obligatorio || ''

    const systemPrompt = `Eres un editor senior de contenido para redes sociales en Chile. Tu trabajo es tomar copies existentes y MEJORARLOS: hacerlos más largos, más específicos, más persuasivos, con mejor estructura. NUNCA los acortes — solo mejóralos.

REGLAS:
- Mantén la MISMA idea central de cada post, pero desarróllala más
- LinkedIn: el copy mejorado debe tener MÍNIMO 180 palabras
- Facebook/Instagram: MÍNIMO 100 palabras
- Agrega datos concretos, escenarios, preguntas provocadoras donde falten
- Mejora las aperturas genéricas por ganchos más fuertes
- Mejora las notas internas con más detalle para diseño
- NO cambies plataforma, tipo_post, día ni hashtags (a menos que los hashtags sean muy genéricos)
- Mantén el tono: ${tono}
${cierre ? `- Cada post DEBE cerrar con: "${cierre}"` : ''}`

    const userPrompt = `Cliente: ${cliente.nombre} (${cliente.rubro})

${instrucciones ? `INSTRUCCIONES ESPECÍFICAS DE MEJORA:\n${instrucciones}\n` : ''}
POSTS ACTUALES A MEJORAR:
${JSON.stringify(posts.map(p => ({ id: p.id, dia: p.dia, dia_semana: p.dia_semana, plataforma: p.plataforma, tipo_post: p.tipo_post, copy: p.copy, hashtags: p.hashtags, nota_interna: p.nota_interna })), null, 2)}

Devuelve el MISMO array con los copies mejorados. Mantén EXACTAMENTE los mismos IDs, días, plataformas. Solo mejora: copy, hashtags (si son genéricos), nota_interna.

Responde SOLO con JSON array, sin texto adicional.`

    const rawResponse = await callOpenAI(systemPrompt, userPrompt)
    const improved = extractJSON(rawResponse) as typeof posts

    if (!Array.isArray(improved) || improved.length < posts.length * 0.7) {
      return NextResponse.json({ error: 'La IA no devolvió suficientes posts mejorados' }, { status: 422 })
    }

    // Merge: keep original structure, replace copy/hashtags/nota_interna
    const merged = posts.map(original => {
      const imp = improved.find(p => p.id === original.id) || improved.find(p => p.dia === original.dia && p.plataforma === original.plataforma)
      if (!imp) return original
      return {
        ...original,
        copy: imp.copy && imp.copy.length > original.copy.length * 0.8 ? imp.copy : original.copy,
        hashtags: imp.hashtags || original.hashtags,
        nota_interna: imp.nota_interna || original.nota_interna,
      }
    })

    // Save
    const { data: updated, error } = await supabase
      .from('grillas_contenido')
      .update({ posts: merged, updated_at: new Date().toISOString() })
      .eq('id', grilla_id)
      .select('*, clientes(nombre, rubro, contacto_email)')
      .single()

    if (error) throw error

    // Stats
    const avgBefore = Math.round(posts.reduce((s, p) => s + (p.copy?.split(/\s+/).length || 0), 0) / posts.length)
    const avgAfter = Math.round(merged.reduce((s, p) => s + (p.copy?.split(/\s+/).length || 0), 0) / merged.length)

    return NextResponse.json({
      success: true,
      grilla: updated,
      stats: {
        posts_mejorados: merged.length,
        promedio_palabras_antes: avgBefore,
        promedio_palabras_despues: avgAfter,
        mejora_pct: avgBefore > 0 ? Math.round(((avgAfter - avgBefore) / avgBefore) * 100) : 0,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('POST mejorar grilla error:', msg)
    return NextResponse.json({ error: 'Error al mejorar', details: msg }, { status: 500 })
  }
}
