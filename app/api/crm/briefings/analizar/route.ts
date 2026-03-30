import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Vercel timeout

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function callOpenAI(system: string, user: string, maxTokens = 2000) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    }),
  })
  const data = await res.json()
  return JSON.parse(data.choices?.[0]?.message?.content || '{}')
}

async function fetchWebContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MYP-Bot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return ''
    const html = await res.text()
    // Strip HTML tags, keep text
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000)
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cliente_id } = await req.json()
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY no configurada' }, { status: 500 })
    }

    // Get briefing
    const { data: briefing } = await supabase
      .from('briefings_cliente')
      .select('*')
      .eq('cliente_id', cliente_id)
      .single()

    if (!briefing) {
      return NextResponse.json({ error: 'Primero crea el briefing con los datos básicos' }, { status: 400 })
    }

    // Get client info
    const { data: cliente } = await supabase
      .from('clientes')
      .select('nombre, rubro')
      .eq('id', cliente_id)
      .single()

    // 1. Scrape website
    let webContent = ''
    if (briefing.web) {
      webContent = await fetchWebContent(briefing.web)
    }

    // 2. Scrape competitors
    const competidores = (briefing.competidores || []) as Array<{ nombre: string; web: string }>
    const compTexts: string[] = []
    for (const comp of competidores.slice(0, 4)) {
      if (comp.web) {
        const text = await fetchWebContent(comp.web)
        if (text) compTexts.push(`${comp.nombre}: ${text.substring(0, 3000)}`)
      }
    }

    // 2b. Download historical grillas from Google Sheets links
    const sheetsLinks = (briefing.sheets_links || []) as string[]
    const sheetsCopies: string[] = []
    for (const link of sheetsLinks.slice(0, 5)) {
      try {
        // Extract spreadsheet ID and gid from URL
        const idMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
        const gidMatch = link.match(/gid=(\d+)/)
        if (idMatch) {
          const sheetId = idMatch[1]
          const gid = gidMatch ? gidMatch[1] : '0'
          const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
          const csvRes = await fetch(csvUrl, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
          if (csvRes.ok) {
            const csvText = await csvRes.text()
            // Extract text content from CSV (copies are usually the longest fields)
            const lines = csvText.split('\n').slice(1) // skip header
            for (const line of lines) {
              const fields = line.split(',')
              for (const field of fields) {
                const clean = field.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
                if (clean.length > 60) sheetsCopies.push(clean)
              }
            }
          }
        }
      } catch { /* skip failed sheet */ }
    }

    // 3. Get existing copies from previous grillas (Supabase + Sheets)
    const { data: grillasAnteriores } = await supabase
      .from('grillas_contenido')
      .select('posts')
      .eq('cliente_id', cliente_id)
      .order('anio', { ascending: false })
      .order('mes', { ascending: false })
      .limit(3)

    const copiesSupabase = (grillasAnteriores || [])
      .flatMap(g => (g.posts as Array<{ copy: string }>).map(p => p.copy))
      .filter(c => c && c.length > 50)

    // Combine: Supabase copies + Sheets copies (dedup by first 80 chars)
    const allCopies = [...copiesSupabase, ...sheetsCopies]
    const seen = new Set<string>()
    const copiesAnteriores = allCopies.filter(c => {
      const key = c.substring(0, 80).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 20)

    // 4. Analysis: Web + Products
    let analisisWeb = null
    if (webContent) {
      analisisWeb = await callOpenAI(
        'Analiza el sitio web de esta empresa chilena. Responde en JSON.',
        `Empresa: ${cliente?.nombre || briefing.rubro}
Rubro: ${briefing.rubro || cliente?.rubro}
Contenido web:
${webContent}

Responde con JSON:
{
  "propuesta_valor": "resumen en 1-2 frases",
  "productos_servicios": ["lista de productos/servicios principales"],
  "numeros_clave": ["cifras destacadas (años, clientes, etc)"],
  "diferenciadores": ["qué los hace únicos vs competencia"],
  "sectores_target": ["a quién le venden"]
}`,
        1500
      )
    }

    // 5. Analysis: Tone (from copies or web)
    let analisisTono = null
    const textoParaTono = copiesAnteriores.length > 5
      ? `Copies anteriores de la marca:\n${copiesAnteriores.slice(0, 10).join('\n---\n')}`
      : webContent
        ? `Contenido del sitio web:\n${webContent.substring(0, 4000)}`
        : `Rubro: ${briefing.rubro}. Tono deseado: ${briefing.tono}`

    analisisTono = await callOpenAI(
      'Analiza el tono de comunicación de esta marca chilena. Responde en JSON.',
      `Empresa: ${cliente?.nombre}
${textoParaTono}

Responde con JSON:
{
  "tono_general": "descripción del tono (ej: corporativo sin ser frío, cercano pero profesional)",
  "nivel_formalidad": "1-10",
  "largo_ideal_post": "rango de palabras recomendado",
  "estructura_preferida": "cómo abrir y cerrar los posts",
  "palabras_frecuentes": ["5-8 palabras que deberían aparecer"],
  "temas_fuertes": ["3-5 temas principales"],
  "uso_emojis": "descripción (ej: máximo 1-2 por post, solo al final)"
}`,
      1500
    )

    // 6. Analysis: Competitive
    let analisisCompetitivo = null
    if (compTexts.length > 0) {
      analisisCompetitivo = await callOpenAI(
        'Analiza el posicionamiento competitivo. Responde en JSON.',
        `Empresa: ${cliente?.nombre} (${briefing.rubro})
Propuesta: ${analisisWeb?.propuesta_valor || briefing.productos || 'no disponible'}

Competidores:
${compTexts.join('\n\n')}

Responde con JSON:
{
  "que_dicen_todos": "mensaje común de la categoría",
  "que_dice_solo_este_cliente": "diferenciador único",
  "angulos_diferenciadores": ["3-4 ángulos para contenido"],
  "temas_a_evitar": ["temas que no convienen"]
}`,
        1500
      )
    }

    // 7. Save analysis to briefing
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (analisisWeb) updates.analisis_web = analisisWeb
    if (analisisTono) updates.analisis_tono = analisisTono
    if (analisisCompetitivo) updates.analisis_competitivo = analisisCompetitivo
    if (copiesAnteriores.length > 0) updates.copies_referencia = copiesAnteriores

    const { data: updated, error } = await supabase
      .from('briefings_cliente')
      .update(updates)
      .eq('cliente_id', cliente_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      briefing: updated,
      analisis: {
        web: !!analisisWeb,
        tono: !!analisisTono,
        competidores: !!analisisCompetitivo,
        copies_encontrados: copiesAnteriores.length,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('POST analizar briefing error:', msg)
    return NextResponse.json({ error: 'Error al analizar', details: msg }, { status: 500 })
  }
}
