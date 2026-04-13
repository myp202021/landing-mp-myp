/**
 * FASE 0 — Optimizar Briefings de todos los clientes
 *
 * Recorre los 34 clientes con briefing y completa lo que falta:
 * 1. brief_estrategico (10 sin) — OpenAI genera uno basado en web + tono + productos
 * 2. analisis_competitivo (33 sin) — OpenAI analiza posicionamiento vs categoría
 * 3. copies_referencia — extrae los 5 mejores posts de grillas anteriores
 *
 * USO:
 *   node scripts/optimizar-briefings.js                    # todos
 *   node scripts/optimizar-briefings.js --cliente <id>     # solo uno
 *   node scripts/optimizar-briefings.js --dry-run          # solo muestra qué haría
 *
 * Env vars: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')

const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!OPENAI_KEY) { console.error('❌ OPENAI_API_KEY no configurada'); process.exit(1) }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ SUPABASE vars no configuradas'); process.exit(1) }

const sleep = ms => new Promise(r => setTimeout(r, ms))
const isDryRun = process.argv.includes('--dry-run')
const clienteFilter = process.argv.includes('--cliente') ? process.argv[process.argv.indexOf('--cliente') + 1] : null

// ── Supabase helpers ────────────────────────────────────

const SB_HEADERS = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }

async function sbGet(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: SB_HEADERS })
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...SB_HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify({ ...data, updated_at: new Date().toISOString() })
  })
  if (!res.ok) console.log(`   ⚠️ PATCH ${table}: ${res.status}`)
  return res.ok
}

// ── OpenAI ──────────────────────────────────────────────

async function callOpenAI(system, user, maxTokens = 4000) {
  await sleep(2000)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: maxTokens,
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

// ── PASO 1: Generar brief estratégico ───────────────────

async function generarBriefEstrategico(cliente, briefing) {
  const analisisWeb = briefing.analisis_web || {}
  const analisisTono = briefing.analisis_tono || {}

  const prompt = `Eres el director de estrategia de M&P, una agencia de performance marketing en Chile. Necesitas crear un BRIEF ESTRATÉGICO completo para el cliente "${cliente.nombre}" (${cliente.rubro}).

Con la información disponible, genera un brief estratégico profesional que incluya:

1. CONTEXTO DEL NEGOCIO
   - Qué hace la empresa, a quién le vende, modelo de negocio
   - Propuesta de valor central

2. PÚBLICO OBJETIVO
   - Perfil del cliente ideal (decisor)
   - Pain points principales
   - Qué buscan en una solución como esta

3. TERRITORIOS DE CONTENIDO (4-5 pilares temáticos)
   - Cada pilar con: nombre, descripción, ejemplo de post
   - Deben cubrir: educación, autoridad, venta, comunidad

4. POSICIONAMIENTO DESEADO
   - Cómo quiere ser percibida la marca
   - Qué la diferencia de la competencia genérica
   - Frase de posicionamiento (1 línea)

5. REGLAS DE VOZ Y TONO
   - Cómo habla la marca (ejemplos de frases)
   - Qué NUNCA diría
   - Nivel de tecnicismo

6. OBJETIVOS DE CONTENIDO
   - Qué debe lograr el contenido (leads, awareness, autoridad, etc.)
   - KPIs de referencia

=== DATOS DEL CLIENTE ===
Nombre: ${cliente.nombre}
Rubro: ${cliente.rubro}
Web: ${briefing.web || 'no disponible'}
Productos: ${briefing.productos || 'no especificado'}
Plataformas: ${JSON.stringify(briefing.plataformas || [])}
Tono actual: ${briefing.tono || 'profesional'}

${analisisWeb.propuesta_valor ? `Propuesta de valor: ${analisisWeb.propuesta_valor}` : ''}
${analisisWeb.diferenciadores ? `Diferenciadores: ${JSON.stringify(analisisWeb.diferenciadores)}` : ''}
${analisisWeb.productos_servicios ? `Productos/servicios: ${JSON.stringify(analisisWeb.productos_servicios)}` : ''}
${analisisWeb.numeros_clave ? `Números verificables: ${JSON.stringify(analisisWeb.numeros_clave)}` : ''}

${analisisTono.tono_general ? `Tono general: ${analisisTono.tono_general}` : ''}
${analisisTono.temas_fuertes ? `Temas fuertes: ${JSON.stringify(analisisTono.temas_fuertes)}` : ''}
${analisisTono.nivel_formalidad ? `Formalidad: ${analisisTono.nivel_formalidad}/10` : ''}

${briefing.cierre_obligatorio ? `Cierre obligatorio: "${briefing.cierre_obligatorio}"` : ''}
${(briefing.palabras_prohibidas || []).length > 0 ? `Palabras prohibidas: ${briefing.palabras_prohibidas.join(', ')}` : ''}

IMPORTANTE:
- NO inventes datos del cliente que no están en la información proporcionada
- Basa todo en la información real disponible
- Si falta información, indica "pendiente de definir" en vez de inventar
- Escribe en español de Chile
- El brief debe ser accionable — que un community manager pueda crear contenido solo con esto`

  return await callOpenAI(
    'Eres un estratega de marketing digital senior en Chile. Escribes briefs profesionales, concisos y accionables.',
    prompt,
    3000
  )
}

// ── PASO 2: Generar análisis competitivo ────────────────

async function generarAnalisisCompetitivo(cliente, briefing) {
  const prompt = `Analiza el posicionamiento competitivo de "${cliente.nombre}" en el rubro "${cliente.rubro}" en Chile.

Información del cliente:
- Web: ${briefing.web || 'no disponible'}
- Propuesta de valor: ${(briefing.analisis_web || {}).propuesta_valor || 'no definida'}
- Diferenciadores: ${JSON.stringify((briefing.analisis_web || {}).diferenciadores || [])}
- Tono: ${(briefing.analisis_tono || {}).tono_general || briefing.tono || 'profesional'}
${briefing.competidores ? `- Competidores conocidos: ${briefing.competidores}` : ''}

Responde SOLO en JSON con esta estructura exacta:
{
  "que_dicen_todos": "Qué dice toda la categoría (mensajes genéricos que usan TODOS en este rubro — el cliente debe evitarlos)",
  "que_dice_solo_este_cliente": "Qué puede decir SOLO ${cliente.nombre} que nadie más puede decir (basado en sus diferenciadores reales)",
  "angulos_diferenciadores": ["Ángulo 1 para contenido", "Ángulo 2", "Ángulo 3", "Ángulo 4"],
  "temas_a_evitar": ["Tema 1 que la competencia ya gastó", "Tema 2", "Tema 3"],
  "oportunidades_contenido": ["Oportunidad 1 de contenido que nadie está explotando", "Oportunidad 2", "Oportunidad 3"]
}`

  const raw = await callOpenAI(
    'Eres un analista de mercado en Chile. Respondes SOLO en JSON válido, sin explicaciones adicionales.',
    prompt,
    1500
  )
  return extractJSON(raw)
}

// ── PASO 3: Extraer copies referencia de grillas ────────

async function extraerCopiesReferencia(clienteId) {
  const grillas = await sbGet('grillas_contenido', `cliente_id=eq.${clienteId}&select=posts,mes,anio&order=anio.desc,mes.desc&limit=3`)

  const allPosts = []
  for (const g of grillas) {
    if (!Array.isArray(g.posts)) continue
    for (const p of g.posts) {
      if (!p.copy || p.copy.length < 100) continue
      const words = p.copy.split(/\s+/).filter(Boolean).length
      // Score básico: más largo = más desarrollado = mejor referencia
      // Penalizar ChatGPT speak
      const chatgptPhrases = ['¿sabías que', 'en un mundo donde', 'hoy más que nunca', 'en la era digital', 'solución integral', 'revolucionario']
      const copyLower = p.copy.toLowerCase()
      const hasChatGPT = chatgptPhrases.some(f => copyLower.includes(f))
      if (hasChatGPT) continue // skip posts con ChatGPT speak

      allPosts.push({
        copy: p.copy,
        plataforma: p.plataforma,
        words,
        mes: g.mes,
        anio: g.anio,
      })
    }
  }

  // Ordenar por largo (los más desarrollados son mejores referencias)
  allPosts.sort((a, b) => b.words - a.words)

  // Tomar los 5 mejores, variando plataforma
  const selected = []
  const usedPlatforms = { LinkedIn: 0, 'Facebook/Instagram': 0 }
  for (const p of allPosts) {
    if (selected.length >= 5) break
    const plat = p.plataforma || 'Facebook/Instagram'
    if (usedPlatforms[plat] >= 3) continue
    selected.push(p.copy)
    usedPlatforms[plat] = (usedPlatforms[plat] || 0) + 1
  }

  return selected
}

// ── MAIN ────────────────────────────────────────────────

async function main() {
  console.log('🔧 OPTIMIZADOR DE BRIEFINGS M&P')
  console.log('================================')
  if (isDryRun) console.log('⚠️  DRY-RUN — solo muestra qué haría, no modifica nada\n')

  // Load all briefings + clients
  const briefings = await sbGet('briefings_cliente', 'select=*')
  const clientes = await sbGet('clientes', 'select=id,nombre,rubro')
  const nameMap = {}
  clientes.forEach(c => nameMap[c.id] = c)

  const toProcess = clienteFilter
    ? briefings.filter(b => b.cliente_id === clienteFilter)
    : briefings

  console.log(`📋 ${toProcess.length} briefings a procesar\n`)

  const stats = { briefGenerados: 0, compGenerados: 0, copiesExtraidos: 0, errores: 0 }

  for (const b of toProcess) {
    const cliente = nameMap[b.cliente_id]
    if (!cliente) { console.log(`⚠️ Cliente ${b.cliente_id} no encontrado — saltando`); continue }

    console.log(`\n── ${cliente.nombre} (${cliente.rubro}) ──`)

    const updates = {}
    let changed = false

    // 1. Brief estratégico
    const needsBrief = !b.brief_estrategico || b.brief_estrategico.length < 50
    if (needsBrief) {
      console.log('   📝 Generando brief estratégico...')
      if (!isDryRun) {
        try {
          const brief = await generarBriefEstrategico(cliente, b)
          updates.brief_estrategico = brief
          changed = true
          stats.briefGenerados++
          console.log(`   ✅ Brief generado (${brief.length} chars)`)
        } catch (e) {
          console.log(`   ❌ Error brief: ${e.message}`)
          stats.errores++
        }
      } else {
        console.log('   [DRY-RUN] Generaría brief estratégico')
      }
    } else {
      console.log('   ✅ Brief estratégico OK')
    }

    // 2. Análisis competitivo
    const needsComp = !b.analisis_competitivo || Object.keys(b.analisis_competitivo).length === 0
    if (needsComp) {
      console.log('   🏢 Generando análisis competitivo...')
      if (!isDryRun) {
        try {
          const comp = await generarAnalisisCompetitivo(cliente, b)
          if (comp) {
            updates.analisis_competitivo = comp
            changed = true
            stats.compGenerados++
            console.log(`   ✅ Análisis competitivo generado`)
          } else {
            console.log('   ❌ No se pudo parsear JSON del análisis')
            stats.errores++
          }
        } catch (e) {
          console.log(`   ❌ Error competitivo: ${e.message}`)
          stats.errores++
        }
      } else {
        console.log('   [DRY-RUN] Generaría análisis competitivo')
      }
    } else {
      console.log('   ✅ Análisis competitivo OK')
    }

    // 3. Copies referencia (extraer de grillas anteriores)
    const needsCopies = !b.copies_referencia || b.copies_referencia.length === 0
    if (needsCopies) {
      console.log('   📚 Extrayendo copies referencia de grillas anteriores...')
      if (!isDryRun) {
        try {
          const copies = await extraerCopiesReferencia(b.cliente_id)
          if (copies.length > 0) {
            updates.copies_referencia = copies
            changed = true
            stats.copiesExtraidos++
            console.log(`   ✅ ${copies.length} copies extraídos (sin ChatGPT speak)`)
          } else {
            console.log('   ⚠️ No hay copies limpios en grillas anteriores')
          }
        } catch (e) {
          console.log(`   ❌ Error copies: ${e.message}`)
          stats.errores++
        }
      } else {
        console.log('   [DRY-RUN] Extraería copies de grillas')
      }
    } else {
      console.log(`   ✅ Copies referencia OK (${b.copies_referencia.length})`)
    }

    // Save
    if (changed && !isDryRun) {
      const ok = await sbUpdate('briefings_cliente', b.id, updates)
      console.log(ok ? '   💾 Guardado en Supabase' : '   ❌ Error guardando')
    }

    // Rate limit between clients
    if (!isDryRun) await sleep(1000)
  }

  // Resumen
  console.log('\n\n════════════════════════════════')
  console.log('📊 RESUMEN')
  console.log('════════════════════════════════')
  console.log(`Briefs estratégicos generados: ${stats.briefGenerados}`)
  console.log(`Análisis competitivos generados: ${stats.compGenerados}`)
  console.log(`Copies referencia extraídos: ${stats.copiesExtraidos}`)
  console.log(`Errores: ${stats.errores}`)
  if (isDryRun) console.log('\n⚠️ DRY-RUN — nada fue modificado')
  console.log('\n✅ Proceso completado')
}

main().catch(e => { console.error('❌ Error fatal:', e.message); process.exit(1) })
