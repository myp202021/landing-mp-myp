/**
 * GENERAR BRIEFINGS — OpenAI GPT-4o analiza web + RRSS + historial de grillas
 * y genera briefing completo compatible con generar-grilla-pro.js
 *
 * 3 fuentes por cliente:
 * 1. Contenido del sitio web (fetch directo)
 * 2. Perfil RRSS (Instagram/Facebook URLs)
 * 3. Grillas históricas (posts anteriores guardados en Supabase)
 *
 * Guarda en tabla briefings_cliente (la misma que usa generar-grilla-pro.js)
 * Delay de 5s entre clientes para no saturar OpenAI
 *
 * Uso:
 *   node scripts/generar-fichas-clientes.js                    # Todos sin briefing
 *   node scripts/generar-fichas-clientes.js --nombre "Forcmin" # Solo uno
 *   node scripts/generar-fichas-clientes.js --limit 5          # Primeros 5
 *   node scripts/generar-fichas-clientes.js --force            # Regenerar todos
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

const sleep = ms => new Promise(r => setTimeout(r, ms))

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
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 6000)
  } catch { return null }
}

// ── OpenAI call ─────────────────────────────────────────

async function callOpenAI(system, user) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: 3000,
    })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices?.[0]?.message?.content || ''
}

function extractJSON(text) {
  try { return JSON.parse(text) } catch {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (match) try { return JSON.parse(match[1]) } catch {}
  const obj = text.match(/\{[\s\S]*\}/)
  if (obj) try { return JSON.parse(obj[0]) } catch {}
  return null
}

// ── Generate briefing ───────────────────────────────────

async function generateBriefing(profile, webContent) {
  const historicalPosts = (profile.grilla_historica_data || []).slice(0, 15)
  const historialText = historicalPosts.length > 0
    ? historicalPosts.map((p, i) => `Post ${i + 1} (${p.mes}): ${p.copy.substring(0, 200)}`).join('\n')
    : 'Sin historial disponible'

  const system = `Eres el director de contenidos de Muller y Pérez, una agencia de performance marketing en Chile. Tu trabajo es crear briefings estratégicos para cada cliente que serán usados por publicistas para generar grillas de contenido mensual.

El briefing debe ser ESPECÍFICO para este cliente — no genérico. Debe reflejar su tono real, sus productos reales, su audiencia real. Analiza las 3 fuentes disponibles y genera un briefing que un publicista pueda usar sin necesitar más contexto.`

  const prompt = `=== CLIENTE ===
Nombre: ${profile.nombre}
Rubro: ${profile.rubro || 'No especificado'}
Web: ${profile.web_url || 'No tiene'}
RRSS: ${JSON.stringify(profile.rrss || [])}
Plataformas: ${JSON.stringify(profile.plataformas_activas || [])}

=== FUENTE 1: CONTENIDO WEB ===
${webContent || 'No disponible'}

=== FUENTE 2: HISTORIAL DE GRILLAS (posts anteriores reales del cliente) ===
${historialText}

=== FUENTE 3: CONTEXTO ===
País: Chile
Agencia: Muller y Pérez (performance marketing, no branding genérico)
Objetivo: contenido para redes sociales que genere engagement y conversión

---

Genera un briefing en formato JSON con EXACTAMENTE esta estructura:

{
  "brief_estrategico": "Párrafo de 5-8 líneas que describe la estrategia de contenido para este cliente. Qué comunicar, cómo diferenciarse, qué tono usar, qué evitar. ESPECÍFICO para este cliente, no genérico.",
  "web": "${profile.web_url || ''}",
  "productos": "Lista de productos/servicios principales del cliente, separados por coma. Extraídos de la web y el historial.",
  "tono": "Descripción del tono de comunicación (basado en cómo se comunican en su historial y web)",
  "analisis_web": {
    "propuesta_valor": "La propuesta de valor principal del cliente",
    "productos_servicios": ["producto1", "producto2", "producto3", "producto4", "producto5"],
    "diferenciadores": ["diferenciador1", "diferenciador2", "diferenciador3"],
    "numeros_clave": ["dato verificable 1", "dato verificable 2"]
  },
  "analisis_tono": {
    "tono_general": "descripción del tono basada en el historial real",
    "nivel_formalidad": 7,
    "uso_emojis": "descripción de cómo usan emojis",
    "temas_fuertes": ["tema1", "tema2", "tema3"]
  },
  "palabras_prohibidas": ["¿Sabías que", "En un mundo donde", "Hoy más que nunca", "En la era digital", "solución integral", "revolucionario", "líder del mercado", "innovador", "a tu alcance", "de vanguardia"],
  "reglas_adicionales": "Reglas específicas para este cliente (basadas en su rubro y comunicación actual)",
  "cierre_obligatorio": ""
}

IMPORTANTE:
- Analiza el HISTORIAL REAL de posts para entender cómo se comunica este cliente
- Si el historial muestra un tono informal, el briefing debe reflejar eso
- Si el historial muestra foco en ciertos productos, el briefing debe priorizar esos
- Los productos deben ser REALES (extraídos de la web y el historial, no inventados)
- Las palabras prohibidas SON OBLIGATORIAS — siempre incluirlas
- El brief_estrategico es el campo más importante — debe ser útil para un publicista`

  const response = await callOpenAI(system, prompt)
  return extractJSON(response)
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  let limitFilter = 50
  let nombreFilter = null
  let force = args.includes('--force')

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--nombre' && args[i + 1]) nombreFilter = args[++i]
  }

  if (!OPENAI_KEY) { console.error('❌ OPENAI_API_KEY requerida'); process.exit(1) }

  // Get all client profiles
  let query = supabase
    .from('client_profiles')
    .select('*')
    .eq('activo', true)
    .order('nombre')
    .limit(limitFilter)

  if (nombreFilter) query = query.ilike('nombre', `%${nombreFilter}%`)

  const { data: profiles, error } = await query
  if (error) { console.error('❌', error.message); process.exit(1) }

  // Get existing briefings
  const { data: existingBriefings } = await supabase
    .from('briefings_cliente')
    .select('cliente_id')

  const briefedClientIds = new Set((existingBriefings || []).map(b => b.cliente_id))

  // Filter: only those without briefing (unless --force)
  const toProcess = force
    ? profiles
    : profiles.filter(p => !briefedClientIds.has(p.cliente_id))

  if (toProcess.length === 0) {
    console.log('✅ Todos los clientes ya tienen briefing.')
    return
  }

  console.log(`\n🤖 GENERACIÓN DE BRIEFINGS (OpenAI GPT-4o)`)
  console.log(`   Clientes sin briefing: ${toProcess.length}`)
  console.log(`   Delay entre clientes: 5s\n`)

  let generated = 0, failed = 0

  for (const profile of toProcess) {
    console.log(`   📡 ${profile.nombre} (${profile.rubro || '?'})`)

    // 1. Fetch web
    const webContent = await fetchWebContent(profile.web_url)
    console.log(`      Web: ${webContent ? webContent.length + ' chars' : 'no disponible'}`)
    console.log(`      Historial: ${(profile.grilla_historica_data || []).length} posts`)

    // 2. Generate briefing
    try {
      const briefing = await generateBriefing(profile, webContent)

      if (!briefing || !briefing.brief_estrategico) {
        console.log(`      ❌ Briefing vacío o mal formateado`)
        failed++
        await sleep(5000)
        continue
      }

      // 3. Save to briefings_cliente
      if (profile.cliente_id) {
        // Check if exists
        const { data: existing } = await supabase
          .from('briefings_cliente')
          .select('id')
          .eq('cliente_id', profile.cliente_id)
          .single()

        if (existing && !force) {
          console.log(`      ⏭️ Ya tiene briefing, skip`)
          await sleep(2000)
          continue
        }

        if (existing) {
          await supabase.from('briefings_cliente').update(briefing).eq('cliente_id', profile.cliente_id)
        } else {
          await supabase.from('briefings_cliente').insert({ ...briefing, cliente_id: profile.cliente_id })
        }
      } else {
        // Cliente no existe en tabla clientes — crear uno
        const { data: newCliente } = await supabase
          .from('clientes')
          .insert({ nombre: profile.nombre, rubro: profile.rubro, activo: true })
          .select()
          .single()

        if (newCliente) {
          await supabase.from('client_profiles').update({ cliente_id: newCliente.id }).eq('id', profile.id)
          await supabase.from('briefings_cliente').insert({ ...briefing, cliente_id: newCliente.id })
          console.log(`      📋 Cliente creado en CRM: ${newCliente.id.substring(0, 8)}`)
        }
      }

      // 4. Update client_profiles with ficha
      await supabase.from('client_profiles').update({
        tono: briefing.analisis_tono?.tono_general,
        audiencia: briefing.brief_estrategico?.substring(0, 200),
        productos_servicios: briefing.productos,
        diferenciacion: briefing.analisis_web?.diferenciadores?.join(', '),
        ficha_agente: briefing.brief_estrategico,
        ficha_generada_at: new Date().toISOString(),
      }).eq('id', profile.id)

      console.log(`      ✅ Briefing generado`)
      console.log(`         Tono: ${briefing.analisis_tono?.tono_general?.substring(0, 50)}...`)
      console.log(`         Productos: ${briefing.productos?.substring(0, 60)}...`)
      generated++

    } catch (err) {
      console.log(`      ❌ Error: ${err.message}`)
      failed++
    }

    // Delay 5s entre clientes
    console.log(`      ⏳ Esperando 5s...`)
    await sleep(5000)
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN BRIEFINGS`)
  console.log(`   Generados: ${generated}`)
  console.log(`   Fallidos: ${failed}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
