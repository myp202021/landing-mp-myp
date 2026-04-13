/**
 * GENERADOR PRO DE GRILLAS v2 — Pipeline OpenAI → Claude
 * ═══════════════════════════════════════════════════════
 *
 * FASE 1: OpenAI GPT-4o analiza briefing + grillas anteriores → genera Brief PRO mensual
 * FASE 2: Claude Sonnet 4 genera 16 posts basados en el Brief PRO (1 post por llamada)
 * FASE 3: Revisor heurístico inline → Claude regenera si score < 70
 *
 * USO:
 *   node scripts/generar-grilla-pro.js <cliente_id> <mes> <anio> [contexto_mes]
 *   node scripts/generar-grilla-pro.js all <mes> <anio> [contexto_mes]
 *   node scripts/generar-grilla-pro.js all 5 2026 "CyberDay mayo, Día de la Madre"
 *
 * PREREQUISITOS:
 *   - Briefings optimizados (correr FASE 0: optimizar-briefings.yml primero)
 *   - Secrets: OPENAI_API_KEY, ANTHROPIC_API_KEY_GRILLAS, SUPABASE_URL, SUPABASE_SERVICE_KEY
 *
 * COSTO: ~$0.09/cliente (OpenAI ~$0.03 + Claude ~$0.06)
 * DURACIÓN: ~6-8 min por cliente, ~3-4 horas para 30 clientes
 */

const fetch = require('node-fetch')

const OPENAI_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS || process.env.ANTHROPIC_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_KEY = process.env.RESEND || process.env.RESEND_API_KEY

if (!OPENAI_KEY) { console.error('❌ OPENAI_API_KEY no configurada'); process.exit(1) }
if (!ANTHROPIC_KEY) { console.error('❌ ANTHROPIC_API_KEY_GRILLAS no configurada'); process.exit(1) }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ SUPABASE vars no configuradas'); process.exit(1) }
console.log('🔑 Env vars OK: OpenAI ✓ Claude ✓ Supabase ✓')

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const SB_HEADERS = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }

async function sbGet(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: SB_HEADERS })
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function sbPost(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: { ...SB_HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  })
  return await res.json()
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH', headers: { ...SB_HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  })
  return res.ok
}

async function callOpenAI(system, user, maxTokens = 4000) {
  await sleep(1500)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.4, max_tokens: maxTokens })
  })
  const data = await res.json()
  if (data.error) throw new Error(`OpenAI: ${data.error.message}`)
  return data.choices?.[0]?.message?.content || ''
}

async function callClaude(system, user, maxTokens = 4000) {
  await sleep(1000)
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }], temperature: 0.6 })
  })
  const data = await res.json()
  if (data.error) throw new Error(`Claude: ${data.error.message}`)
  return data.content?.[0]?.text || ''
}

function extractJSON(text) {
  try { return JSON.parse(text) } catch {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (match) try { return JSON.parse(match[1]) } catch {}
  const arr = text.match(/\[[\s\S]*\]/)
  if (arr) try { return JSON.parse(arr[0]) } catch {}
  const obj = text.match(/\{[\s\S]*\}/)
  if (obj) try { return JSON.parse(obj[0]) } catch {}
  return null
}

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const ESTACIONALIDAD = {
  1: 'Año Nuevo, vuelta al trabajo, planificación anual',
  2: 'San Valentín (14), clima laboral, bienestar',
  3: 'Día de la Mujer (8), vuelta a clases, equidad',
  4: 'Semana Santa, otoño, adaptación normativa',
  5: 'Día del Trabajador (1), Día de la Madre (11), CyberDay, otoño avanzado',
  6: 'Día del Padre, mid-year review, invierno',
  7: 'Vacaciones invierno, Virgen del Carmen (16), temporada baja',
  8: 'Asunción (15), preparación Fiestas Patrias',
  9: 'Fiestas Patrias (18-19), chilenidad, consumo alto',
  10: 'Halloween (31), CyberMonday, Q4, planificación fin de año',
  11: 'Cyber Monday, Black Friday, peak comercio',
  12: 'Navidad (25), Año Nuevo (31), cierre de año, verano',
}

// Ángulos temáticos con rotación forzada
const ANGULOS = [
  { id: 'educativo', nombre: 'Educativo', desc: 'Enseña algo útil al público, posiciona como experto' },
  { id: 'comercial', nombre: 'Comercial', desc: 'Vende directo, muestra beneficios concretos del producto/servicio' },
  { id: 'inspiracional', nombre: 'Inspiracional', desc: 'Motiva, cuenta historias de transformación o visión' },
  { id: 'caso', nombre: 'Caso / Ejemplo', desc: 'Muestra un escenario real, caso de uso, o ejemplo concreto' },
  { id: 'objecion', nombre: 'Objeción', desc: 'Enfrenta una duda o resistencia común del público' },
  { id: 'diferenciacion', nombre: 'Diferenciación', desc: 'Destaca qué hace único al cliente vs la competencia' },
]

// ═══════════════════════════════════════════════════════════
// REVISOR HEURÍSTICO (inline, sin LLM)
// ═══════════════════════════════════════════════════════════

const CHATGPT_SPEAK = [
  'en la era digital', 'en un mundo donde', 'en este mundo cada vez más',
  'sumérgete', 'desbloquea', 'revoluciona', 'descubre el poder',
  'transforma tu', 'desata tu potencial', 'eleva tu', 'más que nunca',
  'imprescindible', 'game changer', 'next level', 'hoy más que nunca',
  'solución integral', 'revolucionario', 'líder del mercado', 'de vanguardia',
  'a tu alcance', 'a la vanguardia', 'sinónimo de', 'experiencia única',
  'en el mundo de', 'el futuro es', 'el futuro del', 'sabías que',
  '¿sabías que', 'en la actualidad', 'hoy en día', 'cada vez más',
  'sin lugar a dudas', 'sin duda alguna', 'resulta fundamental',
  'juega un papel', 'un papel fundamental', 'un papel clave',
  'no cabe duda', 'es importante destacar', 'cabe mencionar',
  '¿te imaginas', '¿cuántas veces', '¿cuánto podrías',
]

const SCORE_UMBRAL = 70

function reviewPost(post, allPosts) {
  const copy = post.copy || ''
  const copyLower = copy.toLowerCase()
  const issues = []
  let score = 100

  // 1. ChatGPT-speak
  for (const frase of CHATGPT_SPEAK) {
    if (copyLower.includes(frase)) {
      issues.push(`Frase prohibida: "${frase}"`)
      score -= 20
    }
  }

  // 2. Emoji stuffing (>3)
  const emojis = (copy.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1F2FF}]|[\u{1F680}-\u{1F6FF}]/gu) || []).length
  if (emojis > 3) { issues.push(`${emojis} emojis (máx 3)`); score -= 10 }

  // 3. Emoji al inicio
  const firstChar = copy.trim().charAt(0)
  if (firstChar.match?.(/[\u{1F600}-\u{1F9FF}]/u)) { issues.push('Empieza con emoji'); score -= 10 }

  // 4. Longitud
  const words = copy.split(/\s+/).filter(Boolean).length
  const isLinkedIn = (post.plataforma || '').includes('LinkedIn')
  const minW = isLinkedIn ? 150 : (post.tipo_post === 'Reel' ? 50 : 80)
  if (words < minW) { issues.push(`${words} palabras (mín ${minW})`); score -= 15 }

  // 5. Datos inventados (porcentajes sin fuente)
  const pctMatches = copy.match(/\d{2,3}%/g) || []
  if (pctMatches.length > 0 && !copy.includes('según') && !copy.includes('fuente') && !copy.includes('estudio') && !copy.includes('INE') && !copy.includes('encuesta')) {
    issues.push(`Porcentaje sin fuente: ${pctMatches[0]}`)
    score -= 15
  }

  // 6. Repetición interna (similitud Jaccard)
  const tok = s => new Set(s.toLowerCase().replace(/[^\wáéíóúñ\s]/g, ' ').split(/\s+/).filter(w => w.length > 3))
  const myTokens = tok(copy)
  for (const otro of allPosts) {
    if (otro.dia === post.dia && otro.plataforma === post.plataforma) continue
    const otherTokens = tok(otro.copy || '')
    if (myTokens.size === 0 || otherTokens.size === 0) continue
    let inter = 0
    for (const t of myTokens) if (otherTokens.has(t)) inter++
    const sim = inter / (myTokens.size + otherTokens.size - inter)
    if (sim > 0.65) { issues.push(`Similar ${Math.round(sim * 100)}% a otro post`); score -= 20; break }
  }

  return { score: Math.max(0, score), issues }
}

// ═══════════════════════════════════════════════════════════
// FASE 1: BRIEF PRO (OpenAI)
// ═══════════════════════════════════════════════════════════

async function generarBriefPro(cliente, briefing, prevPosts, mes, anio, contextoMes) {
  console.log('   📋 FASE 1: Generando Brief PRO con OpenAI...')

  const analisisWeb = briefing.analisis_web || {}
  const analisisTono = briefing.analisis_tono || {}
  const analisisComp = briefing.analisis_competitivo || {}
  const copiesRef = briefing.copies_referencia || []
  const est = ESTACIONALIDAD[mes] || ''

  const prompt = `Eres el director de estrategia de contenido de M&P, agencia de performance marketing en Chile. Necesitas crear un PLAN DE CONTENIDO MENSUAL detallado para ${MESES[mes]} ${anio}.

=== CLIENTE ===
${cliente.nombre} — ${cliente.rubro}
Web: ${briefing.web || 'N/A'}
Plataformas: ${JSON.stringify(briefing.plataformas || ['Facebook/Instagram'])}

=== BRIEF ESTRATÉGICO ===
${(briefing.brief_estrategico || '').substring(0, 4000)}

=== PROPUESTA DE VALOR Y DIFERENCIADORES ===
Propuesta: ${analisisWeb.propuesta_valor || 'no definida'}
Diferenciadores: ${JSON.stringify(analisisWeb.diferenciadores || [])}
Productos: ${JSON.stringify(analisisWeb.productos_servicios || [])}
Números verificables: ${JSON.stringify(analisisWeb.numeros_clave || [])}

=== TONO ===
${analisisTono.tono_general || briefing.tono || 'profesional'}
Formalidad: ${analisisTono.nivel_formalidad || '7'}/10
Temas fuertes: ${JSON.stringify(analisisTono.temas_fuertes || [])}

=== POSICIONAMIENTO COMPETITIVO ===
Lo que dice toda la categoría (EVITAR): ${analisisComp.que_dicen_todos || 'no analizado'}
Lo que dice SOLO este cliente (EXPLOTAR): ${analisisComp.que_dice_solo_este_cliente || 'no analizado'}
Ángulos diferenciadores: ${JSON.stringify(analisisComp.angulos_diferenciadores || [])}
Temas a evitar: ${JSON.stringify(analisisComp.temas_a_evitar || [])}

=== ESTACIONALIDAD ${MESES[mes].toUpperCase()} ===
${est}
${contextoMes ? `Contexto especial: ${contextoMes}` : ''}

=== COPIES ANTERIORES (NO repetir estos enfoques) ===
${prevPosts.slice(0, 8).map((p, i) => `${i + 1}. [${p.plataforma}] ${p.copy.substring(0, 120)}...`).join('\n')}

=== TU TAREA ===
Genera un plan de 16 posts para el mes. Para CADA post define:
1. "dia" y "dia_semana": fecha real del mes (lunes a viernes, distribuidos)
2. "plataforma": alternar LinkedIn y Facebook/Instagram si tiene ambas
3. "tipo_post": Post (mayoría), Carrusel (2-3), Reel (2)
4. "angulo": uno de [educativo, comercial, inspiracional, caso, objecion, diferenciacion] — ROTAR, nunca 2 seguidos iguales
5. "tipo_contenido": qué tipo de contenido es (ej: "tutorial", "testimonio", "behind the scenes", "tip práctico", "comparativa", etc.)
6. "objetivo": qué debe lograr (ej: "generar leads", "posicionamiento", "engagement", "tráfico web", "awareness")
7. "gancho": la primera frase del post (ESPECÍFICA, no genérica — un dato real, escenario concreto, o pregunta provocadora)
8. "argumento": el desarrollo central del post en 1-2 frases (qué punto va a hacer, con qué evidencia)
9. "cta": el cierre/llamado a la acción específico
${briefing.cierre_obligatorio ? `10. CADA post debe cerrar con: "${briefing.cierre_obligatorio}"` : ''}

REGLAS:
- NO uses ganchos tipo "¿Sabías que...?", "¿Te imaginas...?", "¿Cuántas veces...?"
- NO inventes datos ni porcentajes — usa solo los números verificables del cliente
- Cada gancho debe ser ÚNICO — no repetir estructura ni fórmula
- Los ganchos deben ser específicos al cliente, no genéricos de marketing
- Varía: dato real → escenario concreto → afirmación contraintuitiva → problema específico
- Al menos 4 posts deben conectar con estacionalidad del mes

Responde SOLO JSON array:
[{"dia":1,"dia_semana":"Lunes","plataforma":"LinkedIn","tipo_post":"Post","angulo":"educativo","tipo_contenido":"tip práctico","objetivo":"posicionamiento","gancho":"Primera frase del post","argumento":"Desarrollo central","cta":"Llamado a la acción"}]`

  const raw = await callOpenAI(
    'Eres un estratega de contenido senior. Respondes SOLO en JSON válido. No inventas datos.',
    prompt,
    6000
  )

  const plan = extractJSON(raw)
  if (!Array.isArray(plan) || plan.length < 10) {
    throw new Error(`Brief PRO inválido: ${Array.isArray(plan) ? plan.length : 0} posts (esperados 16)`)
  }

  console.log(`   ✅ Brief PRO: ${plan.length} posts planificados`)
  return plan
}

// ═══════════════════════════════════════════════════════════
// FASE 2: GENERAR COPIES (Claude)
// ═══════════════════════════════════════════════════════════

const CLAUDE_SYSTEM = `Eres un copywriter senior de una agencia de performance marketing en Chile. Escribes contenido para redes sociales que genera engagement real.

Tu trabajo NO es responder preguntas — es crear copies profesionales que una marca publicaría tal cual.

REGLAS ABSOLUTAS:
1. Escribe en español de Chile con acentos correctos
2. NUNCA uses frases de IA: "¿Sabías que...?", "En un mundo donde...", "Hoy más que nunca...", "En la era digital...", "solución integral", "revolucionario", "líder del mercado", "de vanguardia", "¿Te imaginas...?", "¿Cuántas veces...?"
3. NUNCA empieces con emoji
4. NUNCA inventes datos, porcentajes ni estadísticas. Si no tienes un dato real con fuente, usa un escenario concreto o beneficio tangible
5. Cada post tiene estructura: GANCHO → DESARROLLO → RESOLUCIÓN → CTA
6. El copy_grafica es el TEXTO PARA LA IMAGEN — headline corto e impactante, NO el caption
7. Responde SOLO JSON, sin texto adicional`

async function generarPostClaude(briefPro, clienteInfo, postPlan, prevCopies, attempt = 1) {
  const { nombre, rubro, briefing } = clienteInfo
  const analisisTono = briefing.analisis_tono || {}
  const isLinkedIn = postPlan.plataforma === 'LinkedIn'
  const minWords = isLinkedIn ? 180 : (postPlan.tipo_post === 'Reel' ? 60 : 100)

  const prompt = `=== CLIENTE ===
${nombre} — ${rubro}
Tono: ${analisisTono.tono_general || briefing.tono || 'profesional'}
${briefing.cierre_obligatorio ? `Cierre obligatorio: "${briefing.cierre_obligatorio}"` : ''}

=== POST A ESCRIBIR ===
Día: ${postPlan.dia_semana} ${postPlan.dia} de ${MESES[postPlan.mes || 5]}
Plataforma: ${postPlan.plataforma}
Tipo: ${postPlan.tipo_post}
Ángulo: ${postPlan.angulo} — ${(ANGULOS.find(a => a.id === postPlan.angulo) || {}).desc || ''}
Tipo contenido: ${postPlan.tipo_contenido}
Objetivo: ${postPlan.objetivo}

=== DIRECCIÓN ESTRATÉGICA (del Brief PRO) ===
Gancho asignado: "${postPlan.gancho}"
Argumento central: "${postPlan.argumento}"
CTA: "${postPlan.cta}"

=== REQUISITOS ===
- MÍNIMO ${minWords} palabras en el copy
- Usa el gancho asignado como punto de partida (puedes mejorarlo, NO cambiarlo completamente)
- Desarrolla el argumento con profundidad — escenarios, beneficios concretos, comparaciones
- copy_grafica: ${postPlan.tipo_post === 'Carrusel' ? 'texto de cada slide separado por ---' : postPlan.tipo_post === 'Reel' ? 'guión por escenas con tiempos' : 'headline visual impactante (máx 10 palabras) + subtítulo corto'}
- nota_interna: instrucciones para el diseñador (tipo de visual, paleta, qué destacar)

${prevCopies.length > 0 ? `=== NO REPETIR estos enfoques ===\n${prevCopies.slice(0, 3).map(c => '• ' + c.substring(0, 100) + '...').join('\n')}` : ''}

Responde SOLO JSON:
{
  "copy": "COPY COMPLETO mínimo ${minWords} palabras",
  "copy_grafica": "TEXTO PARA LA IMAGEN (headline visual, NO el caption)",
  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5",
  "nota_interna": "Instrucciones diseño: tipo visual, paleta, formato, qué destacar"
}`

  const raw = await callClaude(CLAUDE_SYSTEM, prompt, 3000)
  const post = extractJSON(raw)

  if (!post || !post.copy || post.copy.length < 30) {
    if (attempt < 3) {
      console.log(`      ⚠️ Copy vacío — retry ${attempt + 1}...`)
      await sleep(2000)
      return generarPostClaude(briefPro, clienteInfo, postPlan, prevCopies, attempt + 1)
    }
    throw new Error('Copy vacío después de 3 intentos')
  }

  return {
    id: `pro2-${Date.now()}-${postPlan.dia}`,
    dia: postPlan.dia,
    dia_semana: postPlan.dia_semana,
    plataforma: postPlan.plataforma,
    tipo_post: postPlan.tipo_post,
    angulo: postPlan.angulo,
    tipo_contenido: postPlan.tipo_contenido,
    objetivo: postPlan.objetivo,
    copy: post.copy,
    copy_grafica: post.copy_grafica || '',
    hashtags: post.hashtags || '',
    nota_interna: post.nota_interna || '',
    _words: post.copy.split(/\s+/).filter(Boolean).length,
  }
}

// ═══════════════════════════════════════════════════════════
// FASE 3: REVISIÓN + FIX (heurístico + Claude)
// ═══════════════════════════════════════════════════════════

async function revisarYFixPost(post, allPosts, clienteInfo, postPlan) {
  const { score, issues } = reviewPost(post, allPosts)

  if (score >= SCORE_UMBRAL) return { ...post, _score: score }

  console.log(`      🔧 Score ${score} < ${SCORE_UMBRAL} — regenerando con Claude...`)
  console.log(`         Issues: ${issues.join(', ')}`)

  const fixPrompt = `El siguiente post fue rechazado por calidad. REESCRÍBELO completamente corrigiendo los problemas.

POST RECHAZADO:
${post.copy}

PROBLEMAS DETECTADOS:
${issues.map(i => '- ' + i).join('\n')}

REGLAS PARA EL NUEVO COPY:
- MÍNIMO ${post.plataforma.includes('LinkedIn') ? 180 : 100} palabras
- NO usar frases genéricas de IA ("¿Sabías que", "En un mundo donde", etc.)
- NO empezar con emoji
- NO inventar porcentajes ni datos sin fuente
- Estructura: gancho → desarrollo → resolución → CTA
- Plataforma: ${post.plataforma}
- Ángulo: ${post.angulo}
- Objetivo: ${post.objetivo}

Responde SOLO JSON:
{"copy": "NUEVO COPY COMPLETO", "copy_grafica": "headline visual", "hashtags": "${post.hashtags}", "nota_interna": "instrucciones diseño"}`

  try {
    const raw = await callClaude(CLAUDE_SYSTEM, fixPrompt, 3000)
    const fixed = extractJSON(raw)
    if (fixed && fixed.copy && fixed.copy.length > 50) {
      const newReview = reviewPost({ ...post, copy: fixed.copy }, allPosts)
      console.log(`      ✅ Fix: score ${score} → ${newReview.score}`)
      return {
        ...post,
        copy: fixed.copy,
        copy_grafica: fixed.copy_grafica || post.copy_grafica,
        nota_interna: fixed.nota_interna || post.nota_interna,
        _score: newReview.score,
        _fixed: true,
      }
    }
  } catch (e) {
    console.log(`      ❌ Fix falló: ${e.message}`)
  }

  return { ...post, _score: score, _needsManualReview: true }
}

// ═══════════════════════════════════════════════════════════
// ORQUESTADOR — 1 CLIENTE COMPLETO
// ═══════════════════════════════════════════════════════════

async function generateGrilla(clienteId, mes, anio, contextoMes) {
  // 1. Cargar cliente + briefing
  const [cliente] = await sbGet('clientes', `id=eq.${clienteId}&select=nombre,rubro`)
  if (!cliente) throw new Error('Cliente no encontrado')

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 ${cliente.nombre} (${cliente.rubro}) — ${MESES[mes]} ${anio}`)
  console.log('═'.repeat(60))

  // Skip si ya tiene grilla
  const existing = await sbGet('grillas_contenido', `cliente_id=eq.${clienteId}&mes=eq.${mes}&anio=eq.${anio}&select=id`)
  if (existing.length > 0) {
    console.log('   ⏭️ Ya tiene grilla — sobreescribiendo')
  }

  const [briefing] = await sbGet('briefings_cliente', `cliente_id=eq.${clienteId}`)
  if (!briefing) throw new Error('Sin briefing — correr FASE 0 primero')

  // 2. Cargar posts anteriores (para no repetir)
  const prevGrillas = await sbGet('grillas_contenido', `cliente_id=eq.${clienteId}&order=anio.desc,mes.desc&limit=3&select=posts,mes,anio`)
  const prevPosts = prevGrillas.flatMap(g => (Array.isArray(g.posts) ? g.posts : []).filter(p => p.copy && p.copy.length > 30))

  // ── FASE 1: Brief PRO ──
  const briefPro = await generarBriefPro(cliente, briefing, prevPosts, mes, anio, contextoMes)

  // Asignar mes a cada post del plan
  briefPro.forEach(p => { p.mes = mes; p.anio = anio })

  // ── FASE 2: Generar copies con Claude ──
  console.log(`   🤖 FASE 2: Generando ${briefPro.length} posts con Claude...`)

  const clienteInfo = { nombre: cliente.nombre, rubro: cliente.rubro, briefing }
  const posts = []
  const generatedCopies = []

  for (let i = 0; i < briefPro.length; i++) {
    const plan = briefPro[i]
    const progress = `[${i + 1}/${briefPro.length}]`
    process.stdout.write(`   ${progress} ${plan.dia_semana} ${plan.dia} ${plan.plataforma} ${plan.tipo_post} (${plan.angulo})... `)

    try {
      const post = await generarPostClaude(briefPro, clienteInfo, plan, generatedCopies)
      posts.push(post)
      generatedCopies.push(post.copy)
      console.log(`✅ ${post._words} pal`)
    } catch (e) {
      console.log(`❌ ${e.message}`)
    }

    await sleep(1500)
  }

  // ── FASE 3: Revisor heurístico + fix ──
  console.log(`\n   🔍 FASE 3: Revisando calidad...`)
  const finalPosts = []
  let fixed = 0, manual = 0

  for (const post of posts) {
    const reviewed = await revisarYFixPost(post, posts, clienteInfo, briefPro.find(p => p.dia === post.dia))
    if (reviewed._fixed) fixed++
    if (reviewed._needsManualReview) manual++
    finalPosts.push(reviewed)
  }

  // Stats
  const scores = finalPosts.map(p => p._score || 100)
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const wordCounts = finalPosts.map(p => p._words || 0)
  const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length)
  const linkedin = finalPosts.filter(p => p.plataforma === 'LinkedIn').length
  const igfb = finalPosts.filter(p => p.plataforma !== 'LinkedIn').length

  console.log(`\n   📈 STATS:`)
  console.log(`      Posts: ${finalPosts.length} | Promedio: ${avgWords} pal | Score: ${avgScore}/100`)
  console.log(`      LinkedIn: ${linkedin} | IG/FB: ${igfb}`)
  console.log(`      Auto-fix: ${fixed} | Revisión manual: ${manual}`)

  // Clean and save
  const postsClean = finalPosts.map(p => {
    const { _words, _score, _fixed, _needsManualReview, ...rest } = p
    return {
      ...rest,
      _calidad: { score: _score || 100, fixed: !!_fixed, manual: !!_needsManualReview },
    }
  })

  if (existing.length > 0) {
    await sbUpdate('grillas_contenido', existing[0].id, { posts: postsClean, estado: 'borrador', updated_at: new Date().toISOString() })
    console.log(`   💾 Grilla actualizada (${existing[0].id})`)
  } else {
    const [created] = await sbPost('grillas_contenido', { cliente_id: clienteId, mes, anio, posts: postsClean, estado: 'borrador' })
    console.log(`   💾 Grilla creada (${created?.id || 'ok'})`)
  }

  // Email notification
  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Muller y Perez <noreply@mulleryperez.cl>',
          to: 'contacto@mulleryperez.cl',
          subject: `✅ Grilla ${MESES[mes]} ${anio} — ${cliente.nombre} (score ${avgScore})`,
          html: `<div style="font-family:Arial;max-width:600px;"><div style="background:linear-gradient(135deg,#0A1628,#0055A4);padding:20px;border-radius:12px 12px 0 0;"><h2 style="color:white;margin:0;">Grilla v2 Generada</h2><p style="color:#93C5FD;margin:5px 0 0;">${cliente.nombre} — ${MESES[mes]} ${anio}</p></div><div style="background:#f8fafc;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;"><p><strong>Pipeline:</strong> OpenAI (Brief PRO) → Claude (Copies) → Revisor heurístico</p><table style="width:100%;"><tr><td>Posts</td><td><b>${finalPosts.length}</b></td></tr><tr><td>Promedio palabras</td><td><b>${avgWords}</b></td></tr><tr><td>Score promedio</td><td><b style="color:${avgScore >= 80 ? '#059669' : avgScore >= 60 ? '#D97706' : '#DC2626'}">${avgScore}/100</b></td></tr><tr><td>Auto-corregidos</td><td>${fixed}</td></tr><tr><td>Revisión manual</td><td>${manual}</td></tr></table><div style="margin-top:15px;text-align:center;"><a href="https://www.mulleryperez.cl/crm/grillas/${clienteId}" style="background:#0055A4;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Ver Grilla →</a></div></div></div>`
        })
      })
      console.log(`   📧 Email enviado`)
    } catch (e) { console.log(`   ⚠️ Email: ${e.message}`) }
  }

  return { nombre: cliente.nombre, posts: finalPosts.length, avgWords, avgScore, fixed, manual }
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
  const clienteId = process.argv[2]
  const mes = parseInt(process.argv[3])
  const anio = parseInt(process.argv[4])
  const contextoMes = process.argv.slice(5).join(' ') || ''

  if (!clienteId || !mes || !anio) {
    console.log('Uso: node scripts/generar-grilla-pro.js <cliente_id|all> <mes> <anio> [contexto]')
    console.log('Ej:  node scripts/generar-grilla-pro.js all 5 2026 "CyberDay, Día de la Madre"')
    process.exit(1)
  }

  console.log('🚀 GENERADOR PRO v2 — Pipeline OpenAI → Claude')
  console.log('================================================')
  console.log(`   Mes: ${MESES[mes]} ${anio}`)
  console.log(`   Pipeline: OpenAI (Brief PRO) → Claude (Copies) → Revisor (Heurístico)`)
  if (contextoMes) console.log(`   Contexto: ${contextoMes}`)

  if (clienteId === 'all') {
    const briefings = await sbGet('briefings_cliente', 'select=cliente_id')
    console.log(`\n📋 ${briefings.length} clientes con briefing\n`)

    const results = []
    for (const b of briefings) {
      try {
        const r = await generateGrilla(b.cliente_id, mes, anio, contextoMes)
        if (r) results.push(r)
      } catch (e) {
        console.log(`\n❌ Error: ${e.message}`)
        results.push({ nombre: '?', posts: 0, avgWords: 0, avgScore: 0, error: e.message })
      }
    }

    console.log('\n\n' + '═'.repeat(60))
    console.log('📊 RESUMEN FINAL')
    console.log('═'.repeat(60))
    results.forEach(r => {
      const icon = r.posts > 0 ? (r.avgScore >= 80 ? '✅' : '⚠️') : '❌'
      console.log(`${icon} ${(r.nombre || '?').padEnd(25)} ${r.posts} posts | ${r.avgWords} pal | score ${r.avgScore}${r.error ? ' — ' + r.error : ''}`)
    })
    const ok = results.filter(r => r.posts > 0)
    console.log(`\nTotal: ${ok.length}/${results.length} exitosos | Promedio score: ${ok.length > 0 ? Math.round(ok.reduce((a, r) => a + r.avgScore, 0) / ok.length) : 0}`)
  } else {
    await generateGrilla(clienteId, mes, anio, contextoMes)
  }

  console.log('\n✅ Proceso completado')
}

main().catch(e => { console.error('❌ Error fatal:', e.message); process.exit(1) })
