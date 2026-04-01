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
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000)
  } catch { return '' }
}

async function callAI(system: string, user: string, maxTokens = 4000): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.3, max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || '{}'
}

const RUBRICA = `
RÚBRICA DE EVALUACIÓN (15 DIMENSIONES, 1-10 cada una):

BLOQUE COMUNICACIÓN:
1. PROPUESTA DE VALOR: 1-3=no se entiende qué hacen/"soluciones integrales". 4-5=se entiende pero intercambiable. 6-7=clara con diferencial pero no convence. 8-9=específica con dato o beneficio concreto. 10=única, memorable, con prueba.
2. TONO COMUNICACIONAL: 1-3=inconsistente o corporativo vacío. 4-5=definido pero genérico. 6-7=personalidad propia. 8-9=reconocible sin ver el logo. 10=icónico, el tono ES la marca.
3. CLARIDAD DE OFERTA: 1-3=no se entiende qué venden. 4-5=productos listados sin contexto. 6-7=clara con beneficios, falta pricing. 8-9=qué+para quién+cuánto+por qué. 10=oferta irresistible.
4. COPYWRITING: 1-3=buzzwords "líderes","innovadores". 4-5=correcto sin gancho. 6-7=bueno con datos. 8-9=excelente, ganchos y estructura persuasiva. 10=cada frase tiene función estratégica.
5. STORYTELLING/CASOS: 1-3=zero casos. 4-5=mencionan clientes sin detalle. 6-7=casos sin métricas. 8-9=problema→solución→resultado medible. 10=casos con video, datos, timeline.
6. SOCIAL PROOF: 1-3=nada. 4-5=logos sin contexto. 6-7=logos+testimonio genérico. 8-9=testimonios con nombre+cargo+métricas. 10=reviews verificables+certificaciones+premios.

BLOQUE DIGITAL:
7. EXPERIENCIA WEB: 1-3=lenta, desordenada, no mobile. 4-5=funcional básica, template. 6-7=profesional, rápida, mobile OK. 8-9=premium, UX pensada. 10=nivel SaaS top.
8. CTA/CONVERSIÓN: 1-3=sin CTA o perdido en footer. 4-5=genérico "solicitar info". 6-7=claro con valor "cotiza gratis". 8-9=múltiples CTAs+WhatsApp+chat. 10=CTAs con urgencia+prueba social.
9. CONTENIDO VISUAL: 1-3=stock genérico. 4-5=mezcla stock+propias. 6-7=fotos propias, paleta definida. 8-9=profesional+videos propios. 10=visual premium diferenciador.
10. PRESENCIA REDES: 1-3=sin redes o abandonadas. 4-5=esporádica sin estrategia. 6-7=regular 2-3/semana. 8-9=alta frecuencia+engagement+ads. 10=comunidad activa, referente.
11. FUNNEL VISIBLE: 1-3=web estática. 4-5=formulario básico. 6-7=form+WhatsApp+lead magnet. 8-9=lead magnets+remarketing+email. 10=funnel multicanal con nurturing.

BLOQUE ESTRATÉGICO:
12. POSICIONAMIENTO PRECIO: 1-3=no se percibe. 4-5=commodity/barato. 6-7=medio competitivo. 8-9=premium justificado. 10=luxury/aspiracional con evidencia.
13. DIFERENCIACIÓN REAL: 1-3=intercambiable con 10 competidores. 4-5=algo los distingue pero no lo comunican. 6-7=diferencial comunicado parcialmente. 8-9=claro con prueba. 10=categoría propia.
14. COBERTURA MERCADO: 1-3=local sin proyección. 4-5=nacional básico. 6-7=nacional con industrias. 8-9=multi-mercado segmentado. 10=regional/global verificable.
15. MADUREZ DIGITAL: 1-3=sin presencia. 4-5=web+redes básicas. 6-7=web pro+redes+algunas campañas. 8-9=ecosistema completo (web+ads+CRM+tracking). 10=data-driven, full stack.

REGLA: Cuando NO puedas evaluar una dimensión porque no hay datos visibles, pon nota 0 y justificación "Sin datos detectables desde la web". Los 0 NO cuentan en el promedio.
REGLA: Cada nota DEBE tener justificación de 1 línea con EVIDENCIA concreta, no opinión.`

interface Competidor { nombre: string; web: string; ig: string }

export async function POST(req: NextRequest) {
  try {
    const { cliente_id } = await req.json()
    if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    const { data: benchmark } = await supabase.from('benchmarks_cliente').select('*').eq('cliente_id', cliente_id).single()
    if (!benchmark) return NextResponse.json({ error: 'Primero configura el benchmark' }, { status: 400 })

    const { data: cliente } = await supabase.from('clientes').select('nombre, rubro').eq('id', cliente_id).single()
    const competidores = (benchmark.competidores || []) as Competidor[]
    const nombre = cliente?.nombre || 'Cliente'
    const rubro = cliente?.rubro || ''

    // 1. Scrape webs
    const clienteWeb = benchmark.cliente_web ? await fetchWeb(benchmark.cliente_web) : ''
    const compData = await Promise.all(
      competidores.slice(0, 5).map(async c => ({ ...c, webContent: c.web ? await fetchWeb(c.web) : '' }))
    )

    // 2. Evaluate client (15 dimensions)
    const clienteEval = JSON.parse(await callAI(
      RUBRICA + '\n\nEvalúa esta empresa con la rúbrica. Sé ESTRICTO y HONESTO.',
      `EMPRESA: ${nombre} (${rubro})
WEB: ${benchmark.cliente_web}
CONTENIDO: ${clienteWeb || 'No se pudo acceder a la web'}

Evalúa las 15 dimensiones. Responde JSON:
{
  "propuesta_valor_resumida": "2-3 frases interpretando su propuesta",
  "publico_objetivo": "a quién le hablan",
  "tono": {"descripcion": "3-4 frases", "formalidad": "1-10", "calidez": "1-10", "tecnicismo": "1-10", "personalidad": "si fuera persona"},
  "scores": [
    {"dimension": "Propuesta de valor", "nota": 7, "justificacion": "evidencia concreta en 1 línea"},
    {"dimension": "Tono comunicacional", "nota": 6, "justificacion": "..."},
    {"dimension": "Claridad de oferta", "nota": 5, "justificacion": "..."},
    {"dimension": "Copywriting", "nota": 4, "justificacion": "..."},
    {"dimension": "Storytelling / Casos", "nota": 3, "justificacion": "..."},
    {"dimension": "Social proof", "nota": 5, "justificacion": "..."},
    {"dimension": "Experiencia web", "nota": 6, "justificacion": "..."},
    {"dimension": "CTA / Conversión", "nota": 5, "justificacion": "..."},
    {"dimension": "Contenido visual", "nota": 4, "justificacion": "..."},
    {"dimension": "Presencia en redes", "nota": 3, "justificacion": "..."},
    {"dimension": "Funnel visible", "nota": 2, "justificacion": "..."},
    {"dimension": "Posicionamiento precio", "nota": 5, "justificacion": "..."},
    {"dimension": "Diferenciación real", "nota": 4, "justificacion": "..."},
    {"dimension": "Cobertura mercado", "nota": 5, "justificacion": "..."},
    {"dimension": "Madurez digital", "nota": 3, "justificacion": "..."}
  ]
}`, 3000))

    // 3. Evaluate each competitor
    const compEvals = []
    for (const c of compData) {
      if (!c.webContent) {
        compEvals.push({ nombre: c.nombre, web: c.web, ig: c.ig, error: 'No se pudo acceder', scores: [] })
        continue
      }
      const ev = JSON.parse(await callAI(
        RUBRICA + '\n\nEvalúa este competidor con la rúbrica. Sé ESTRICTO.',
        `COMPETIDOR: ${c.nombre} (compite con ${nombre} en ${rubro})
WEB: ${c.web}
CONTENIDO: ${c.webContent}

Evalúa las 15 dimensiones. Mismo formato JSON:
{
  "propuesta_valor_resumida": "...",
  "tono": {"descripcion": "...", "formalidad": "1-10", "calidez": "1-10", "tecnicismo": "1-10"},
  "scores": [
    {"dimension": "Propuesta de valor", "nota": 7, "justificacion": "..."},
    {"dimension": "Tono comunicacional", "nota": 6, "justificacion": "..."},
    {"dimension": "Claridad de oferta", "nota": 5, "justificacion": "..."},
    {"dimension": "Copywriting", "nota": 4, "justificacion": "..."},
    {"dimension": "Storytelling / Casos", "nota": 3, "justificacion": "..."},
    {"dimension": "Social proof", "nota": 5, "justificacion": "..."},
    {"dimension": "Experiencia web", "nota": 6, "justificacion": "..."},
    {"dimension": "CTA / Conversión", "nota": 5, "justificacion": "..."},
    {"dimension": "Contenido visual", "nota": 4, "justificacion": "..."},
    {"dimension": "Presencia en redes", "nota": 3, "justificacion": "..."},
    {"dimension": "Funnel visible", "nota": 2, "justificacion": "..."},
    {"dimension": "Posicionamiento precio", "nota": 5, "justificacion": "..."},
    {"dimension": "Diferenciación real", "nota": 4, "justificacion": "..."},
    {"dimension": "Cobertura mercado", "nota": 5, "justificacion": "..."},
    {"dimension": "Madurez digital", "nota": 3, "justificacion": "..."}
  ]
}`, 2500))
      compEvals.push({ nombre: c.nombre, web: c.web, ig: c.ig, ...ev })
    }

    // 4. Strategic analysis
    const estrategia = JSON.parse(await callAI(
      `Eres director de estrategia digital de una agencia top en Chile. Analizas benchmarks competitivos con rigor. Cada insight es ACCIONABLE y ESPECÍFICO. Nunca genérico.`,
      `BENCHMARK para ${nombre} (${rubro}).

SCORES CLIENTE: ${JSON.stringify(clienteEval.scores)}
PROPUESTA CLIENTE: ${clienteEval.propuesta_valor_resumida}

SCORES COMPETIDORES:
${compEvals.filter(c => !c.error).map(c => `${c.nombre}: ${JSON.stringify(c.scores)}\nPropuesta: ${c.propuesta_valor_resumida}`).join('\n\n')}

Con base en los SCORES REALES (no inventes datos), genera:
{
  "resumen_ejecutivo": "5-6 frases con datos concretos de los scores. Menciona notas específicas. Ej: 'M&P obtiene 7/10 en propuesta de valor vs 8/10 de Cebra...'",

  "ranking": [{"nombre": "empresa", "promedio": 6.5, "mejor_dimension": "nombre", "peor_dimension": "nombre"}],

  "fortalezas": ["4-5 fortalezas BASADAS EN LAS NOTAS — cita la dimensión y nota"],
  "brechas": ["4-5 brechas BASADAS EN LAS NOTAS — cita la dimensión, nota del cliente vs nota del mejor competidor"],
  "oportunidades": ["5-6 oportunidades CONCRETAS y ACCIONABLES"],

  "tono_recomendado": {
    "descripcion": "4-5 frases de cómo debería comunicar",
    "palabras_clave": ["8-10 palabras"],
    "si_decir": ["5 frases ejemplo que SÍ usar"],
    "nunca_decir": ["5 frases o estilos que NUNCA usar y por qué"]
  },

  "pilares_contenido": [
    {"pilar": "nombre", "descripcion": "de qué trata", "ejemplo": "post ejemplo real", "frecuencia": "x/semana"}
  ],

  "quick_wins": ["4-5 acciones para ESTA SEMANA basadas en las brechas detectadas"]
}`, 5000))

    // 5. Save
    const resultado = {
      cliente: { nombre, rubro, web: benchmark.cliente_web, ig: benchmark.cliente_ig, ...clienteEval },
      competidores: compEvals,
      estrategia,
      generado_en: new Date().toISOString(),
    }

    await supabase.from('benchmarks_cliente').update({ resultado }).eq('cliente_id', cliente_id)
    return NextResponse.json({ success: true, resultado })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('Benchmark error:', msg)
    return NextResponse.json({ error: 'Error al generar', details: msg }, { status: 500 })
  }
}
