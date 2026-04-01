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
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    })
    if (!res.ok) return ''
    const html = await res.text()
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000)
  } catch { return '' }
}

async function callOpenAI(system: string, user: string, maxTokens = 4000): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || '{}'
}

interface Competidor { nombre: string; web: string; ig: string }

const SYSTEM_ANALYST = `Eres un director de estrategia digital con 15 años de experiencia en Chile. Analizas empresas con profundidad: no repites lo que dice la web — interpretas, comparas, encuentras lo que no se ve a simple vista. Escribes en español de Chile. Cada punto que haces es accionable y específico. NUNCA des respuestas genéricas.`

export async function POST(req: NextRequest) {
  try {
    const { cliente_id } = await req.json()
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

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
    const nombreCliente = cliente?.nombre || 'Cliente'
    const rubroCliente = cliente?.rubro || benchmark.rubro || ''

    // 1. Scrape all websites in parallel
    const clienteWeb = benchmark.cliente_web ? await fetchWeb(benchmark.cliente_web) : ''
    const compDataRaw = await Promise.all(
      competidores.slice(0, 5).map(async comp => ({
        ...comp,
        webContent: comp.web ? await fetchWeb(comp.web) : '',
      }))
    )

    // 2. DEEP ANALYSIS — Client (separate call for depth)
    const clienteAnalysis = clienteWeb ? JSON.parse(await callOpenAI(SYSTEM_ANALYST,
      `Analiza en PROFUNDIDAD la comunicación digital de esta empresa:

EMPRESA: ${nombreCliente} (${rubroCliente})
WEB: ${benchmark.cliente_web}
CONTENIDO WEB:
${clienteWeb}

Responde JSON con DETALLE (no respuestas de 1 línea, desarrolla cada punto):
{
  "propuesta_valor": "la promesa central en 2-3 frases — no copies de la web, interpreta",
  "productos_servicios": ["lista detallada de cada producto/servicio que ofrecen"],
  "publico_objetivo": "a quién le hablan, qué perfil de cliente buscan, en qué industrias",
  "ideas_fuerza": ["5-7 mensajes clave que comunican — explícitos e implícitos"],
  "tono_comunicacional": {
    "descripcion": "descripción detallada del tono (3-4 frases)",
    "formalidad": "1-10",
    "calidez": "1-10 (1=frío corporativo, 10=cercano personal)",
    "tecnicismo": "1-10",
    "personalidad": "si la marca fuera una persona, cómo sería"
  },
  "diferenciadores_reales": ["3-5 cosas que SOLO esta empresa tiene vs competencia — no genéricos"],
  "debilidades_comunicacion": ["4-6 problemas concretos que tiene la web/comunicación"],
  "cta_principal": "cuál es el llamado a la acción principal y si funciona",
  "estructura_web": "cómo está organizado el sitio, qué prioriza, qué esconde",
  "nivel_profesionalismo": "1-10 — qué tan profesional se ve el sitio",
  "numeros_sociales": "si menciona cifras, clientes, años, proyectos — cuáles",
  "contenido_visual": "calidad de fotos, videos, diseño general"
}`, 3000)) : {}

    // 3. DEEP ANALYSIS — Each competitor
    const compAnalyses = []
    for (const comp of compDataRaw) {
      if (!comp.webContent) {
        compAnalyses.push({ nombre: comp.nombre, web: comp.web, ig: comp.ig, error: 'No se pudo acceder a la web' })
        continue
      }
      const analysis = JSON.parse(await callOpenAI(SYSTEM_ANALYST,
        `Analiza en PROFUNDIDAD este competidor de ${nombreCliente} (${rubroCliente}):

COMPETIDOR: ${comp.nombre}
WEB: ${comp.web}
CONTENIDO:
${comp.webContent}

Responde JSON detallado:
{
  "propuesta_valor": "la promesa central interpretada",
  "productos_servicios": ["lista detallada"],
  "ideas_fuerza": ["5-7 mensajes clave"],
  "tono_comunicacional": {
    "descripcion": "descripción detallada",
    "formalidad": "1-10",
    "calidez": "1-10",
    "tecnicismo": "1-10",
    "personalidad": "si fuera persona"
  },
  "diferenciadores": ["3-5 diferenciadores reales"],
  "debilidades": ["3-4 debilidades de comunicación"],
  "que_hace_mejor_que_${nombreCliente.toLowerCase().replace(/\s/g, '_')}": ["2-3 cosas en que le gana al cliente"],
  "que_hace_peor": ["2-3 cosas en que el cliente le gana"],
  "nivel_profesionalismo": "1-10",
  "estrategia_visible": "qué estrategia digital se percibe (ads, contenido, SEO, nada)"
}`, 2500))
      compAnalyses.push({ nombre: comp.nombre, web: comp.web, ig: comp.ig, ...analysis })
    }

    // 4. COMPARATIVE DEEP ANALYSIS (the strategic insight)
    const comparativo = JSON.parse(await callOpenAI(SYSTEM_ANALYST,
      `Eres el director de estrategia de una agencia de performance marketing en Chile. Genera un benchmark competitivo PROFESIONAL y PROFUNDO.

CLIENTE: ${nombreCliente} (${rubroCliente})
ANÁLISIS CLIENTE: ${JSON.stringify(clienteAnalysis)}

COMPETIDORES ANALIZADOS:
${compAnalyses.filter(c => !c.error).map(c => `${c.nombre}: ${JSON.stringify(c)}`).join('\n\n')}

Genera un análisis comparativo que sirva para presentar al directorio del cliente. NO genérico. ESPECÍFICO. JSON:
{
  "resumen_ejecutivo": "5-6 frases de panorama competitivo — con datos concretos, nombres, y una tesis clara de dónde está parado el cliente",

  "mapa_posicionamiento": {
    "eje_x": "nombre del eje horizontal (ej: precio vs premium)",
    "eje_y": "nombre del eje vertical (ej: digital vs tradicional)",
    "posiciones": [{"nombre": "empresa", "x": "1-10", "y": "1-10"}]
  },

  "tabla_comparativa": [
    {"dimension": "Propuesta de valor", "cliente": "evaluación específica", "mejor_competidor": "quién y por qué", "evaluacion": "ventaja|paridad|desventaja"},
    {"dimension": "Tono comunicacional", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."},
    {"dimension": "Profesionalismo web", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."},
    {"dimension": "Claridad de oferta", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."},
    {"dimension": "Llamado a la acción", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."},
    {"dimension": "Social proof / confianza", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."},
    {"dimension": "Contenido visual", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."},
    {"dimension": "Presencia digital", "cliente": "eval", "mejor_competidor": "quién", "evaluacion": "..."}
  ],

  "score_digital": {
    "dimensiones": ["Sitio web", "Propuesta de valor", "Contenido", "Tono", "CTA", "Social proof"],
    "scores": {"${nombreCliente}": [7,6,5,8,6,7], "comp1": [8,7,6,7,7,8]}
  },

  "fortalezas_cliente": ["4-5 fortalezas ESPECÍFICAS con contexto — no 'buena propuesta', sino 'la mención de +38 años y clientes como Mallplaza genera confianza inmediata'"],
  "brechas_criticas": ["4-5 brechas ESPECÍFICAS — no 'falta presencia', sino 'Solcor tiene 15K seguidores y publica 4x/semana vs Tritec que no tiene actividad'"],
  "oportunidades_accionables": ["5-6 oportunidades CONCRETAS que se pueden ejecutar — con el qué, cómo y por qué"],

  "tono_recomendado": {
    "descripcion": "4-5 frases de cómo debería comunicar — con personalidad, no genérico",
    "formalidad_recomendada": "1-10",
    "calidez_recomendada": "1-10",
    "palabras_clave": ["8-10 palabras que debería usar consistentemente"],
    "frases_ejemplo": ["5-6 frases de ejemplo en el tono recomendado — que se puedan usar en posts reales"],
    "que_nunca_decir": ["4-5 frases o estilos que NUNCA debería usar y por qué"]
  },

  "pilares_contenido": [
    {"pilar": "nombre del pilar", "descripcion": "de qué trata", "ejemplo_post": "un ejemplo de post real", "frecuencia": "x por semana"},
    {"pilar": "pilar 2", "descripcion": "...", "ejemplo_post": "...", "frecuencia": "..."}
  ],

  "quick_wins": ["3-4 acciones que se pueden hacer ESTA SEMANA para mejorar inmediatamente"]
}`, 5000))

    // 5. Save
    const resultado = {
      cliente: { nombre: nombreCliente, rubro: rubroCliente, web: benchmark.cliente_web, ig: benchmark.cliente_ig, ...clienteAnalysis },
      competidores: compAnalyses,
      comparativo,
      generado_en: new Date().toISOString(),
    }

    await supabase
      .from('benchmarks_cliente')
      .update({ resultado })
      .eq('cliente_id', cliente_id)

    return NextResponse.json({ success: true, resultado })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('Benchmark error:', msg)
    return NextResponse.json({ error: 'Error al generar benchmark', details: msg }, { status: 500 })
  }
}
