/**
 * Generador PRO de Grillas de Contenido
 * Corre desde GitHub Actions — sin timeout de Vercel
 *
 * USO:
 *   node scripts/generar-grilla-pro.js <cliente_id> <mes> <anio> [contexto_mes]
 *   node scripts/generar-grilla-pro.js all <mes> <anio>
 *
 * Genera 16 posts de calidad agencia:
 * - 1 post por llamada a OpenAI (máxima calidad)
 * - Validación estricta de largo (retry automático)
 * - Usa briefing completo del cliente (tono, productos, competidores)
 * - Estacionalidad + contingencia Chile real
 * - Copy + copy_grafica + hashtags + nota_interna
 */

const fetch = require('node-fetch')

const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!OPENAI_KEY) { console.error('❌ OPENAI_API_KEY no configurada'); process.exit(1) }
if (!SUPABASE_URL) { console.error('❌ SUPABASE_URL no configurada'); process.exit(1) }
if (!SUPABASE_KEY) { console.error('❌ SUPABASE_SERVICE_KEY no configurada'); process.exit(1) }
console.log('🔑 Env vars OK: OpenAI ✓ Supabase ✓')

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ============================================================
// SUPABASE HELPERS
// ============================================================
async function supabaseGet(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`
  const res = await fetch(url, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  })
  const data = await res.json()
  if (data.error || data.message) console.log(`   ⚠️ Supabase GET ${table}: ${data.error || data.message}`)
  return Array.isArray(data) ? data : []
}

async function supabasePost(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  })
  const result = await res.json()
  if (!res.ok) console.log(`   ⚠️ Supabase POST ${table}: ${res.status} ${JSON.stringify(result).substring(0, 200)}`)
  return Array.isArray(result) ? result : [result]
}

async function supabaseUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  })
  const result = await res.json()
  if (!res.ok) console.log(`   ⚠️ Supabase PATCH ${table}: ${res.status} ${JSON.stringify(result).substring(0, 200)}`)
  return Array.isArray(result) ? result : [result]
}

// ============================================================
// OPENAI
// ============================================================
async function callOpenAI(system, user, maxTokens = 4000) {
  await sleep(2000) // Rate limit
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.6,
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
  throw new Error('No se pudo parsear JSON')
}

// ============================================================
// ESTACIONALIDAD
// ============================================================
const FECHAS_GENERALES = {
  1: { fechas: ['1 Año Nuevo'], contexto: 'Vuelta al trabajo, planificación anual' },
  2: { fechas: ['14 San Valentín'], contexto: 'Clima laboral, bienestar, parejas' },
  3: { fechas: ['8 Día de la Mujer', 'Vuelta a clases'], contexto: 'Equidad, liderazgo femenino, educación' },
  4: { fechas: ['Semana Santa'], contexto: 'Feriados, adaptación normativa' },
  5: { fechas: ['1 Día del Trabajador', 'Día de la Madre', 'CyberDay'], contexto: 'Derechos laborales, comercio electrónico, regalos' },
  6: { fechas: ['Día del Padre'], contexto: 'Mid-year review, evaluación' },
  7: { fechas: ['16 Virgen del Carmen'], contexto: 'Vacaciones invierno, temporada baja' },
  8: { fechas: ['15 Asunción'], contexto: 'Preparación Fiestas Patrias' },
  9: { fechas: ['18-19 Fiestas Patrias'], contexto: 'Chilenidad, consumo alto' },
  10: { fechas: ['31 Halloween', 'CyberMonday'], contexto: 'Q4, planificación fin de año' },
  11: { fechas: ['Cyber Monday', 'Black Friday'], contexto: 'Peak comercio, descuentos' },
  12: { fechas: ['25 Navidad', '31 Año Nuevo'], contexto: 'Regalos, cierre de año, vacaciones' },
}

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// ============================================================
// SYSTEM PROMPT (agencia, no ChatGPT)
// ============================================================
const SYSTEM_PROMPT = `Eres un director de contenidos de una agencia de performance marketing en Chile con 10 años de experiencia. NO eres ChatGPT respondiendo preguntas — eres un profesional que crea contenido para redes sociales que genera engagement real.

REGLAS QUE DEFINEN TU TRABAJO:
1. Cada post tiene UNA TESIS CLARA — no "nuestro producto es bueno", sino "el 73% del tiempo de tu equipo se pierde en procesos manuales que ya no deberían existir"
2. ESTRUCTURA: Gancho (1ra frase que atrapa) → Desarrollo (argumento con datos o escenario) → Resolución → CTA o cierre
3. PROHIBIDO: "¿Sabías que...?", "En un mundo donde...", "Hoy más que nunca...", "En la era digital...", "solución integral", "revolucionario", "líder del mercado", "innovador", "a tu alcance", "de vanguardia"
4. PROHIBIDO: emojis al inicio, estadísticas inventadas, buzzwords, posts genéricos tipo "Feliz día de..."
5. Si citas un dato, DEBE tener fuente verificable. Si no tienes fuente, usa un escenario real en vez de inventar
6. Escribe en español de Chile con acentos correctos
7. El copy_grafica es el TEXTO QUE VA EN LA IMAGEN — headline para post, slides separados por --- para carrusel, guión por escena para reel`

// ============================================================
// GENERATE SINGLE POST
// ============================================================
async function generateSinglePost(clienteInfo, postConfig, prevCopies, attempt = 1) {
  const { nombre, rubro, briefing, estacionalidad, contingencia, contextoMes } = clienteInfo
  const { dia, diaSemana, plataforma, tipoPost } = postConfig

  const analisisWeb = briefing.analisis_web || {}
  const analisisTono = briefing.analisis_tono || {}
  const briefEstrategico = briefing.brief_estrategico || ''

  const minWords = plataforma === 'LinkedIn' ? 180 : (tipoPost === 'Reel' ? 60 : 100)

  const prompt = `${briefEstrategico ? `=== BRIEF ESTRATÉGICO (PRIORIDAD MÁXIMA) ===\n${briefEstrategico.substring(0, 3000)}\n\n` : ''}=== CLIENTE ===
${nombre} — ${rubro}
${briefing.web ? `Web: ${briefing.web}` : ''}
${briefing.productos ? `Productos: ${briefing.productos}` : ''}
${analisisWeb.propuesta_valor ? `Propuesta de valor: ${analisisWeb.propuesta_valor}` : ''}
${analisisWeb.productos_servicios ? `Productos específicos: ${JSON.stringify(analisisWeb.productos_servicios)}` : ''}
${analisisWeb.diferenciadores ? `Diferenciadores: ${JSON.stringify(analisisWeb.diferenciadores)}` : ''}
${analisisWeb.numeros_clave ? `Números verificables: ${JSON.stringify(analisisWeb.numeros_clave)}` : ''}

=== TONO ===
${analisisTono.tono_general ? `Tono: ${analisisTono.tono_general}` : `Tono: ${briefing.tono || 'profesional'}`}
${analisisTono.nivel_formalidad ? `Formalidad: ${analisisTono.nivel_formalidad}/10` : ''}
${analisisTono.temas_fuertes ? `Temas fuertes: ${JSON.stringify(analisisTono.temas_fuertes)}` : ''}
${briefing.cierre_obligatorio ? `CIERRE OBLIGATORIO: "${briefing.cierre_obligatorio}"` : ''}

=== ESTACIONALIDAD ===
${estacionalidad}
${contingencia ? `\nContingencia Chile: ${contingencia}` : ''}
${contextoMes ? `\nContexto especial este mes: ${contextoMes}` : ''}

=== POST A GENERAR ===
Día: ${diaSemana} ${dia} de ${MESES[postConfig.mes]} ${postConfig.anio}
Plataforma: ${plataforma}
Tipo: ${tipoPost}

=== REQUISITOS ESTRICTOS ===
- MÍNIMO ${minWords} PALABRAS en el copy. NO menos. Desarrolla la idea completamente.
- Estructura: gancho → desarrollo con datos/escenario → resolución → CTA
- Varía la apertura: dato duro, pregunta provocadora, escenario real, o afirmación contraintuitiva
- copy_grafica: ${tipoPost === 'Carrusel' ? 'texto de cada slide separado por ---' : tipoPost === 'Reel' ? 'guión por escena con tiempos' : 'headline visual potente + subtítulo'}
- nota_interna: instrucciones detalladas de diseño (tipo visual, paleta, formato, qué destacar)

${prevCopies.length > 0 ? `=== NO REPETIR ===\n${prevCopies.slice(0, 5).map(c => c.substring(0, 80) + '...').join('\n')}\n` : ''}
${(briefing.palabras_prohibidas || []).length > 0 ? `Palabras prohibidas: ${briefing.palabras_prohibidas.join(', ')}` : ''}
${briefing.reglas_adicionales ? `Regla adicional: ${briefing.reglas_adicionales}` : ''}

Responde SOLO JSON:
{
  "copy": "COPY COMPLETO de mínimo ${minWords} palabras — desarrollado, con sustancia, nivel agencia",
  "copy_grafica": "texto visual para la imagen",
  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5",
  "nota_interna": "instrucciones detalladas para diseño"
}`

  const raw = await callOpenAI(SYSTEM_PROMPT, prompt, 3000)
  const post = extractJSON(raw)

  if (!post.copy || post.copy.trim().length < 30) {
    throw new Error('Copy vacío')
  }

  const wordCount = post.copy.split(/\s+/).filter(Boolean).length

  // Retry if too short (max 2 retries)
  if (wordCount < minWords && attempt < 3) {
    console.log(`      ⚠️ ${wordCount} palabras (min ${minWords}) — retry ${attempt + 1}...`)
    await sleep(3000)
    return generateSinglePost(clienteInfo, postConfig, prevCopies, attempt + 1)
  }

  return {
    id: `pro-${Date.now()}-${dia}`,
    dia,
    dia_semana: diaSemana,
    plataforma,
    tipo_post: tipoPost,
    copy: post.copy,
    copy_grafica: post.copy_grafica || '',
    hashtags: post.hashtags || '',
    nota_interna: post.nota_interna || '',
    _words: wordCount,
  }
}

// ============================================================
// GENERATE FULL GRILLA FOR 1 CLIENT
// ============================================================
async function generateGrilla(clienteId, mes, anio, contextoMes) {
  // 1. Load client
  const [cliente] = await supabaseGet('clientes', `id=eq.${clienteId}&select=nombre,rubro`)
  if (!cliente) throw new Error('Cliente no encontrado')

  console.log(`\n📊 ${cliente.nombre} (${cliente.rubro})`)
  console.log(`   Mes: ${MESES[mes]} ${anio}`)

  // 2. Load briefing
  const [briefing] = await supabaseGet('briefings_cliente', `cliente_id=eq.${clienteId}`)
  if (!briefing) throw new Error('Sin briefing — créalo primero en /crm/grillas/' + clienteId + '/briefing')

  // 3. Get previous copies
  const prevGrillas = await supabaseGet('grillas_contenido', `cliente_id=eq.${clienteId}&order=anio.desc,mes.desc&limit=2&select=posts`)
  const prevCopies = prevGrillas.flatMap(g => (g.posts || []).map(p => p.copy)).filter(c => c && c.length > 30)

  // 4. Estacionalidad
  const est = FECHAS_GENERALES[mes] || { fechas: [], contexto: '' }
  const estacionalidad = `Fechas: ${est.fechas.join(', ')}. ${est.contexto}`

  // 5. Contingencia (1 call)
  let contingencia = ''
  try {
    console.log('   🌐 Buscando contingencia Chile...')
    const contRaw = await callOpenAI(
      'Eres analista de mercado en Chile. Solo datos concretos y verificables.',
      `${MESES[mes]} ${anio}, Chile. Dame 5-6 hechos concretos sobre economía, mercado laboral, tendencias de consumo relevantes para "${cliente.rubro}". Solo hechos, sin opiniones.`,
      600
    )
    contingencia = contRaw
    console.log('   ✅ Contingencia OK')
  } catch (e) { console.log('   ⚠️ Contingencia falló:', e.message) }

  // 6. Build posting days (16 posts spread across month)
  const daysInMonth = new Date(anio, mes, 0).getDate()
  const allWeekdays = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(anio, mes - 1, d)
    const dow = date.getDay()
    if (dow >= 1 && dow <= 5) allWeekdays.push({ dia: d, diaSemana: DIAS_SEMANA[dow] })
  }

  // Pick 16 spread across month
  const step = Math.max(1, Math.floor(allWeekdays.length / 16))
  const postingDays = []
  for (let i = 0; i < allWeekdays.length && postingDays.length < 16; i += step) {
    postingDays.push(allWeekdays[i])
  }
  // Fill remaining if needed
  while (postingDays.length < 16 && allWeekdays.length > 0) {
    const remaining = allWeekdays.filter(d => !postingDays.find(p => p.dia === d.dia))
    if (remaining.length === 0) break
    postingDays.push(remaining[Math.floor(remaining.length / 2)])
    postingDays.sort((a, b) => a.dia - b.dia)
  }

  // 7. Assign platforms and types
  const plataformas = briefing.plataformas || ['Facebook/Instagram']
  const hasLinkedIn = plataformas.some(p => p.includes('LinkedIn'))

  const postConfigs = postingDays.map((day, i) => {
    let plataforma = 'Facebook/Instagram'
    if (hasLinkedIn) plataforma = i % 2 === 0 ? 'LinkedIn' : 'Facebook/Instagram'

    let tipoPost = 'Post'
    if (i === 3 || i === 10) tipoPost = 'Carrusel'
    if (i === 7 || i === 14) tipoPost = 'Reel'

    return { ...day, plataforma, tipoPost, mes, anio }
  })

  // 8. Generate 1 post at a time
  const clienteInfo = {
    nombre: cliente.nombre,
    rubro: cliente.rubro,
    briefing,
    estacionalidad,
    contingencia,
    contextoMes,
  }

  const posts = []
  const generatedCopies = [...prevCopies]

  for (let i = 0; i < postConfigs.length; i++) {
    const config = postConfigs[i]
    const progress = `[${i + 1}/${postConfigs.length}]`
    process.stdout.write(`   ${progress} ${config.diaSemana} ${config.dia} ${config.plataforma} ${config.tipoPost}... `)

    try {
      const post = await generateSinglePost(clienteInfo, config, generatedCopies)
      posts.push(post)
      generatedCopies.push(post.copy)
      console.log(`✅ ${post._words} palabras`)
    } catch (e) {
      console.log(`❌ ${e.message}`)
    }

    // Pause between posts
    await sleep(1500)
  }

  // 9. Stats
  const wordCounts = posts.map(p => p._words)
  const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length)
  const short = wordCounts.filter(w => w < 80).length
  const linkedin = posts.filter(p => p.plataforma === 'LinkedIn').length
  const igfb = posts.filter(p => p.plataforma === 'Facebook/Instagram').length
  const carruseles = posts.filter(p => p.tipo_post === 'Carrusel').length

  console.log(`\n   📈 ${posts.length} posts | Promedio: ${avg} palabras | Cortos: ${short}`)
  console.log(`   📱 LinkedIn: ${linkedin} | IG/FB: ${igfb} | Carruseles: ${carruseles}`)

  // 10. Save to Supabase
  const postsClean = posts.map(p => {
    const { _words, ...rest } = p
    return rest
  })

  // Check if grilla exists
  const existing = await supabaseGet('grillas_contenido', `cliente_id=eq.${clienteId}&mes=eq.${mes}&anio=eq.${anio}`)

  if (existing.length > 0) {
    await supabaseUpdate('grillas_contenido', existing[0].id, {
      posts: postsClean,
      estado: 'borrador',
      updated_at: new Date().toISOString()
    })
    console.log(`   💾 Grilla actualizada (${existing[0].id})`)
  } else {
    const [created] = await supabasePost('grillas_contenido', {
      cliente_id: clienteId,
      mes, anio,
      posts: postsClean,
      estado: 'borrador'
    })
    console.log(`   💾 Grilla creada (${created?.id || 'ok'})`)
  }

  return { nombre: cliente.nombre, posts: posts.length, avg, short }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const clienteId = process.argv[2]
  const mes = parseInt(process.argv[3])
  const anio = parseInt(process.argv[4])
  const contextoMes = process.argv[5] || ''

  if (!clienteId || !mes || !anio) {
    console.log('Uso: node scripts/generar-grilla-pro.js <cliente_id|all> <mes> <anio> [contexto]')
    process.exit(1)
  }

  console.log('🚀 Generador PRO de Grillas M&P')
  console.log('================================')

  if (clienteId === 'all') {
    // Generate for all clients that have briefings
    const briefings = await supabaseGet('briefings_cliente', 'select=cliente_id')
    console.log(`📋 ${briefings.length} clientes con briefing\n`)

    const results = []
    for (const b of briefings) {
      try {
        const r = await generateGrilla(b.cliente_id, mes, anio, contextoMes)
        results.push(r)
      } catch (e) {
        console.log(`❌ Error: ${e.message}`)
        results.push({ nombre: '?', posts: 0, avg: 0, error: e.message })
      }
    }

    console.log('\n\n📊 RESUMEN')
    console.log('==========')
    results.forEach(r => {
      console.log(`${r.posts > 0 ? '✅' : '❌'} ${r.nombre}: ${r.posts} posts, ${r.avg} pal/prom${r.error ? ' — ' + r.error : ''}`)
    })
    console.log(`\nTotal: ${results.filter(r => r.posts > 0).length}/${results.length} exitosos`)
  } else {
    await generateGrilla(clienteId, mes, anio, contextoMes)
  }

  console.log('\n✅ Proceso completado')
}

main().catch(e => { console.error('❌ Error fatal:', e.message); process.exit(1) })
