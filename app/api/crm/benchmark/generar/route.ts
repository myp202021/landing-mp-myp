import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fetchWeb(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MYP-Bot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return ''
    const html = await res.text()
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 6000)
  } catch { return '' }
}

async function callOpenAI(system: string, user: string, maxTokens = 3000): Promise<string> {
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
  return data.choices?.[0]?.message?.content || '{}'
}

interface Competidor { nombre: string; web: string; ig: string }

export async function POST(req: NextRequest) {
  try {
    const { cliente_id } = await req.json()
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    // Load benchmark config
    const { data: benchmark } = await supabase
      .from('benchmarks_cliente')
      .select('*')
      .eq('cliente_id', cliente_id)
      .single()

    if (!benchmark) return NextResponse.json({ error: 'Primero configura el benchmark' }, { status: 400 })

    const { data: cliente } = await supabase
      .from('clientes')
      .select('nombre, rubro')
      .eq('id', cliente_id)
      .single()

    const competidores = (benchmark.competidores || []) as Competidor[]

    // 1. Scrape all websites
    const clienteWeb = benchmark.cliente_web ? await fetchWeb(benchmark.cliente_web) : ''

    const compData: Array<{ nombre: string; web: string; ig: string; webContent: string }> = []
    for (const comp of competidores.slice(0, 5)) {
      const webContent = comp.web ? await fetchWeb(comp.web) : ''
      compData.push({ ...comp, webContent })
    }

    // 2. Analyze client
    const clienteAnalysis = clienteWeb ? JSON.parse(await callOpenAI(
      'Analiza la comunicación digital de esta empresa chilena. Responde en JSON.',
      `Empresa: ${cliente?.nombre} (${cliente?.rubro || benchmark.rubro || ''})
Web: ${benchmark.cliente_web}
Contenido:
${clienteWeb}

Responde con JSON:
{
  "propuesta_valor": "resumen en 1-2 frases",
  "productos_servicios": ["lista"],
  "ideas_fuerza": ["3-5 mensajes clave que comunican"],
  "tono": "descripción del tono (formal, cercano, técnico, etc)",
  "nivel_formalidad": "1-10",
  "diferenciadores": ["qué los hace únicos"],
  "debilidades_comunicacion": ["qué les falta o hacen mal en la web"],
  "colores_marca": "colores predominantes que se perciben",
  "cta_principal": "llamado a la acción principal del sitio"
}`
    )) : {}

    // 3. Analyze each competitor
    const compAnalyses = []
    for (const comp of compData) {
      if (!comp.webContent) {
        compAnalyses.push({ nombre: comp.nombre, web: comp.web, ig: comp.ig, error: 'No se pudo acceder a la web' })
        continue
      }
      const analysis = JSON.parse(await callOpenAI(
        'Analiza la comunicación digital de esta empresa. Responde en JSON.',
        `Empresa competidora: ${comp.nombre}
Web: ${comp.web}
Contenido:
${comp.webContent}

Responde con JSON:
{
  "propuesta_valor": "resumen en 1-2 frases",
  "productos_servicios": ["lista"],
  "ideas_fuerza": ["3-5 mensajes clave"],
  "tono": "descripción del tono",
  "nivel_formalidad": "1-10",
  "diferenciadores": ["qué los hace únicos"],
  "debilidades_comunicacion": ["qué les falta"],
  "cta_principal": "CTA principal"
}`
      ))
      compAnalyses.push({ nombre: comp.nombre, web: comp.web, ig: comp.ig, ...analysis })
    }

    // 4. Generate comparative analysis
    const comparativo = JSON.parse(await callOpenAI(
      'Eres un estratega de marketing digital en Chile. Genera un análisis comparativo profesional.',
      `CLIENTE: ${cliente?.nombre} (${cliente?.rubro})
Análisis: ${JSON.stringify(clienteAnalysis)}

COMPETIDORES:
${compAnalyses.map(c => `${c.nombre}: ${JSON.stringify(c)}`).join('\n\n')}

Genera un análisis comparativo en JSON:
{
  "resumen_ejecutivo": "3-4 frases del panorama competitivo",
  "tabla_comparativa": [
    {
      "dimension": "Propuesta de valor",
      "cliente": "cómo lo hace el cliente",
      "promedio_competidores": "cómo lo hacen los competidores en promedio",
      "evaluacion": "ventaja|paridad|desventaja"
    }
  ],
  "fortalezas_cliente": ["3-4 fortalezas vs competencia"],
  "brechas_cliente": ["3-4 áreas donde la competencia es mejor"],
  "oportunidades": ["3-5 oportunidades concretas de diferenciación"],
  "tono_recomendado": {
    "descripcion": "cómo debería comunicar el cliente",
    "nivel_formalidad": "1-10",
    "palabras_clave": ["5-8 palabras que debería usar"],
    "frases_ejemplo": ["3-4 frases de ejemplo en el tono recomendado"],
    "que_evitar": ["3-4 cosas que NO hacer"]
  },
  "score_digital": {
    "cliente": "1-10",
    "competidores": {"nombre1": "1-10", "nombre2": "1-10"}
  }
}`
    ))

    // 5. Save result
    const resultado = {
      cliente: { nombre: cliente?.nombre, rubro: cliente?.rubro, web: benchmark.cliente_web, ig: benchmark.cliente_ig, ...clienteAnalysis },
      competidores: compAnalyses,
      comparativo,
      generado_en: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('benchmarks_cliente')
      .update({ resultado })
      .eq('cliente_id', cliente_id)

    if (error) throw error

    return NextResponse.json({ success: true, resultado })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('Benchmark error:', msg)
    return NextResponse.json({ error: 'Error al generar benchmark', details: msg }, { status: 500 })
  }
}
