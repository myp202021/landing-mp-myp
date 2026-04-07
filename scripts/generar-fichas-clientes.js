/**
 * GENERAR BRIEFINGS DE CLIENTES — Usa OpenAI GPT-4o para analizar la web de cada cliente
 * y generar un briefing completo para el generador de grillas
 *
 * Guarda en tabla briefings_cliente (la misma que usa generar-grilla-pro.js)
 * También actualiza client_profiles con la ficha
 *
 * Uso:
 *   node scripts/generar-fichas-clientes.js                    # Todos los que no tienen briefing
 *   node scripts/generar-fichas-clientes.js --nombre "Forcmin" # Solo uno
 *   node scripts/generar-fichas-clientes.js --limit 5          # Solo 5
 *   node scripts/generar-fichas-clientes.js --force            # Regenerar aunque ya tenga
 *
 * Env vars: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const OPENAI_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Fetch website content ───────────────────────────────

async function fetchWebContent(url) {
  if (!url) return null
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MYPBot/1.0)' },
      redirect: 'follow',
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const html = await res.text()
    // Strip HTML tags, keep text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000) // Limit to 8K chars
    return text
  } catch {
    return null
  }
}

// ── Gemini API ──────────────────────────────────────────

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        }
      })
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini error ${res.status}: ${err.substring(0, 200)}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Generate client profile ─────────────────────────────

async function generateProfile(client, webContent) {
  const prompt = `Eres un estratega de marketing digital de una agencia chilena (Muller y Pérez). Analiza la siguiente información de un cliente y genera una ficha completa para que un publicista pueda crear contenido para sus redes sociales.

CLIENTE: ${client.nombre}
RUBRO: ${client.rubro || 'No especificado'}
SITIO WEB: ${client.web_url || 'No tiene'}
REDES SOCIALES: ${JSON.stringify(client.rrss || [])}
PLATAFORMAS: ${JSON.stringify(client.plataformas_activas || [])}

CONTENIDO DEL SITIO WEB:
${webContent || 'No disponible — genera la ficha basándote solo en el nombre, rubro y redes sociales.'}

---

Genera la ficha en EXACTAMENTE este formato JSON (sin markdown, sin backticks, solo el JSON):

{
  "tono": "descripción del tono de comunicación recomendado (ej: profesional pero cercano, técnico, aspiracional, informal, etc)",
  "audiencia": "descripción del público objetivo principal (edad, género si aplica, perfil, necesidad)",
  "productos_servicios": "lista de los principales productos o servicios que ofrece, separados por coma",
  "diferenciacion": "qué los hace diferentes de su competencia, su propuesta de valor única",
  "que_no_hacer": "cosas que NO se deben hacer en el contenido de este cliente (restricciones de marca, temas a evitar)",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "frecuencia_recomendada": "frecuencia ideal de publicación (ej: 3 veces por semana, diario, etc)",
  "tipos_contenido": ["tipo1", "tipo2", "tipo3", "tipo4"],
  "resumen_agente": "Párrafo de 3-4 líneas que resume quién es el cliente, qué hace, a quién le habla y cómo debe ser el contenido. Este texto se usará como instrucción para el agente que genera la grilla de contenido mensual."
}

IMPORTANTE:
- El tono y contenido debe ser para el mercado CHILENO
- Usa español con modismos chilenos cuando sea apropiado
- Sé específico, no genérico. Cada ficha debe ser única para este cliente.
- Si el rubro es técnico (minería, software, logística), el tono debe ser más profesional
- Si es B2C (retail, alimentos, turismo), puede ser más cercano y emocional`

  const response = await callGemini(prompt)

  // Parse JSON from response
  try {
    // Clean response - remove markdown backticks if present
    const cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return parsed
  } catch (err) {
    console.log(`      ⚠️ Error parseando JSON: ${err.message}`)
    console.log(`      Response: ${response.substring(0, 200)}...`)
    return null
  }
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  let limitFilter = 50
  let nombreFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--nombre' && args[i + 1]) nombreFilter = args[++i]
  }

  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY requerida')
    process.exit(1)
  }

  // Obtener clientes sin ficha
  let query = supabase
    .from('client_profiles')
    .select('*')
    .eq('activo', true)
    .order('nombre')
    .limit(limitFilter)

  if (nombreFilter) {
    query = query.ilike('nombre', `%${nombreFilter}%`)
  } else {
    query = query.is('ficha_agente', null)
  }

  const { data: clients, error } = await query

  if (error) { console.error('❌', error.message); process.exit(1) }
  if (!clients || clients.length === 0) {
    console.log('✅ Todos los clientes ya tienen ficha.')
    return
  }

  console.log(`\n🤖 GENERACIÓN DE FICHAS (Gemini 2.5)`)
  console.log(`   Clientes: ${clients.length}\n`)

  let generated = 0, failed = 0

  for (const client of clients) {
    console.log(`   📡 ${client.nombre} (${client.rubro || '?'})`)

    // 1. Fetch web content
    const webContent = await fetchWebContent(client.web_url)
    console.log(`      Web: ${webContent ? webContent.length + ' chars' : 'no disponible'}`)

    // 2. Generate profile with Gemini
    const profile = await generateProfile(client, webContent)

    if (!profile) {
      failed++
      continue
    }

    // 3. Save to Supabase
    const { error: updateError } = await supabase
      .from('client_profiles')
      .update({
        tono: profile.tono,
        audiencia: profile.audiencia,
        productos_servicios: profile.productos_servicios,
        diferenciacion: profile.diferenciacion,
        que_no_hacer: profile.que_no_hacer,
        hashtags: profile.hashtags || [],
        keywords: profile.keywords || [],
        frecuencia_publicacion: profile.frecuencia_recomendada,
        ficha_agente: profile.resumen_agente,
        ficha_generada_at: new Date().toISOString(),
      })
      .eq('id', client.id)

    if (updateError) {
      console.log(`      ❌ Error guardando: ${updateError.message}`)
      failed++
    } else {
      console.log(`      ✅ Ficha generada`)
      console.log(`         Tono: ${profile.tono?.substring(0, 60)}...`)
      console.log(`         Audiencia: ${profile.audiencia?.substring(0, 60)}...`)
      generated++
    }

    // Pausa entre llamadas (Gemini rate limit)
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN`)
  console.log(`   Generadas: ${generated}`)
  console.log(`   Fallidas: ${failed}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
