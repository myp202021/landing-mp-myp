/**
 * SETUP INICIAL — Agente Genera
 * Se ejecuta UNA VEZ para construir el briefing completo del agente.
 * Después la grilla mensual consume este briefing.
 *
 * Paso 1: Descarga y analiza grillas históricas
 * Paso 2: Scrapea la web del cliente
 * Paso 3: Analiza RRSS del cliente (qué publican, qué funciona)
 * Paso 4: Analiza RRSS de competidores directos (para diferenciarse)
 * Paso 5: Genera el briefing completo con OpenAI
 * Paso 6: Guarda el briefing como JSON
 */

const fetch = require('node-fetch')
const fs = require('fs')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// ═══════════════════════════════════════════════════════════════
// CONFIG DEL CLIENTE
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
  nombre: 'Genera',
  slug: 'genera',
  web: 'https://www.genera.cl',
  industria: 'HR Tech / Software de RRHH',
  pais: 'Chile',

  // Google Sheets con grillas históricas
  sheetId: '1iFPnPEyBlc4GpKjvBe3_o1X52PGKRzG0kbyrt8BR_HY',
  hojas: [
    { gid: 0, nombre: 'Concepto base' },
    { gid: 819456550, nombre: 'Enero 2026' },
    { gid: 1250083556, nombre: 'Febrero 2026' },
    { gid: 963825208, nombre: 'Marzo 2026' },
    { gid: 1948170592, nombre: 'Marzo-Abril 2026' },
  ],

  // RRSS del cliente
  rrss: {
    linkedin: 'https://www.linkedin.com/company/genera-cl/',
    instagram: null, // no scrapeamos, solo web
    facebook: null,
  },

  // Competidores directos (para analizar tono y diferenciarse)
  competidores: [
    { nombre: 'Buk', web: 'https://www.buk.cl', linkedin: 'https://www.linkedin.com/company/baborabuk/' },
    { nombre: 'GeoVictoria', web: 'https://www.geovictoria.com/cl/', linkedin: 'https://www.linkedin.com/company/geovictoria/' },
    { nombre: 'Talana', web: 'https://www.talana.com', linkedin: 'https://www.linkedin.com/company/talana/' },
    { nombre: 'Rex+', web: 'https://www.rexmas.com', linkedin: 'https://www.linkedin.com/company/rexmas/' },
  ],

  // Redes activas del cliente
  plataformas: ['LinkedIn', 'Facebook / Instagram'],
  frecuencia: '3-5 posts por semana',

  // Info que ya sabemos del cliente
  contexto_extra: `
    - Producto: Software integral de RRHH (asistencia, remuneraciones, firma digital, turnos con IA)
    - GENHORAS: producto estrella de control de asistencia, acreditado por DT
    - Gestionan asistencia de +380.000 personas
    - Concepto de marca: "Hablemos de Productividad"
    - Nuevo lanzamiento abril 2026: Turnos Inteligentes con IA
    - Foco 2026: Ley 42 horas (vigente desde 26 abril 2026)
  `
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════════

async function descargarHoja(sheetId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Error descargando gid=${gid}: ${res.status}`)
  return await res.text()
}

async function scrapearWeb(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 })
    if (!res.ok) return null
    const html = await res.text()
    // Extraer texto visible (muy básico, sin parser HTML)
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000) // Limitar para no sobrecargar el prompt
  } catch (e) {
    console.warn(`⚠️ Error scrapeando ${url}: ${e.message}`)
    return null
  }
}

async function callOpenAI(systemPrompt, userPrompt, maxTokens = 4000) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.4
    })
  })
  const data = await res.json()
  if (!data.choices?.[0]) throw new Error(`OpenAI error: ${JSON.stringify(data)}`)
  return data.choices[0].message.content
}

// ═══════════════════════════════════════════════════════════════
// EJECUCIÓN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log(`  SETUP AGENTE — ${CONFIG.nombre}`)
  console.log('═══════════════════════════════════════════════')

  // ── PASO 1: Grillas históricas ──
  console.log('\n📥 Paso 1: Descargando grillas históricas...')
  const grillasRaw = []
  for (const hoja of CONFIG.hojas) {
    try {
      const csv = await descargarHoja(CONFIG.sheetId, hoja.gid)
      grillasRaw.push({ nombre: hoja.nombre, csv })
      console.log(`  ✓ ${hoja.nombre} (${csv.length} chars)`)
    } catch (e) {
      console.warn(`  ⚠ ${hoja.nombre}: ${e.message}`)
    }
  }

  // Extraer copies y feedback de las grillas
  const copiesHistoricos = []
  const feedbackHistorico = []
  for (const g of grillasRaw) {
    const lines = g.csv.split('\n')
    let enCopy = false
    let enComentarios = false
    for (const line of lines) {
      if (line.startsWith('Copy,') || line.startsWith('Copy,"')) { enCopy = true; enComentarios = false }
      else if (line.startsWith('Hashtags') || line.startsWith('Comentarios') || line.startsWith('Cometarios')) {
        if (line.startsWith('Comentarios') || line.startsWith('Cometarios')) enComentarios = true
        enCopy = false
      }

      if (enCopy && line.length > 100) {
        // Extraer copies entre comillas
        const matches = line.match(/"([^"]{80,})"/g)
        if (matches) {
          for (const m of matches) {
            copiesHistoricos.push(m.replace(/^"|"$/g, '').replace(/""/g, '"').substring(0, 500))
          }
        }
      }
      if (enComentarios && line.length > 20) {
        const matches = line.match(/"([^"]{15,})"/g)
        if (matches) {
          for (const m of matches) {
            feedbackHistorico.push(m.replace(/^"|"$/g, '').replace(/""/g, '"'))
          }
        }
      }
    }
  }
  console.log(`  → ${copiesHistoricos.length} copies extraídos`)
  console.log(`  → ${feedbackHistorico.length} comentarios de feedback extraídos`)

  // ── PASO 2: Scrapear web del cliente ──
  console.log('\n🌐 Paso 2: Scrapeando web del cliente...')
  const webTexto = await scrapearWeb(CONFIG.web)
  console.log(`  → ${webTexto ? webTexto.length : 0} chars extraídos de ${CONFIG.web}`)

  // ── PASO 3: Scrapear webs de competidores ──
  console.log('\n🔍 Paso 3: Scrapeando competidores...')
  const competidoresTexto = []
  for (const comp of CONFIG.competidores) {
    const texto = await scrapearWeb(comp.web)
    if (texto) {
      competidoresTexto.push({ nombre: comp.nombre, web: comp.web, texto: texto.substring(0, 3000) })
      console.log(`  ✓ ${comp.nombre} (${texto.length} chars)`)
    } else {
      console.log(`  ⚠ ${comp.nombre}: no se pudo scrapear`)
    }
  }

  // ── PASO 4: Generar análisis con OpenAI ──
  console.log('\n🧠 Paso 4: Analizando con GPT-4o...')

  // 4a: Análisis de tono y estilo del cliente
  console.log('  → Analizando tono y estilo...')
  const mejoresCopies = copiesHistoricos.slice(0, 15).map((c, i) => `${i + 1}. "${c}"`).join('\n')
  const analisisTono = await callOpenAI(
    'Eres un analista de comunicación corporativa. Analizas textos reales de una marca y extraes su ADN comunicacional.',
    `Analiza estos copies reales de la marca Genera (software de RRHH, Chile):

${mejoresCopies}

Extrae en formato JSON:
{
  "tono_general": "descripción en 2-3 oraciones del tono",
  "palabras_frecuentes": ["lista de 15-20 palabras/frases que usa recurrentemente"],
  "palabras_prohibidas": ["lista de palabras/frases que NUNCA usa"],
  "estructura_preferida": "cómo suelen empezar y cerrar los posts",
  "nivel_formalidad": "1-10 donde 1 es coloquial y 10 es corporativo",
  "uso_emojis": "descripción de cómo usa emojis (cuáles, dónde, frecuencia)",
  "largo_promedio_linkedin": "en palabras",
  "largo_promedio_instagram": "en palabras",
  "patron_cierre": "cómo cierra siempre los posts",
  "temas_fuertes": ["los 5 temas principales que trabaja"],
  "diferenciador_comunicacional": "qué lo hace distinto de una marca genérica"
}`,
    2000
  )

  // 4b: Análisis de feedback del equipo
  console.log('  → Analizando feedback recurrente...')
  const feedbackTexto = feedbackHistorico.slice(0, 20).map((f, i) => `${i + 1}. "${f}"`).join('\n')
  const analisisFeedback = await callOpenAI(
    'Eres un editor de contenido. Analizas las correcciones que un equipo hace repetidamente para identificar reglas implícitas.',
    `Estos son comentarios de corrección que el equipo de contenidos hace sobre los copies de Genera:

${feedbackTexto}

Extrae las REGLAS IMPLÍCITAS que el equipo quiere que se sigan. Formato JSON:
{
  "reglas_obligatorias": ["lista de reglas que se repiten y deben cumplirse siempre"],
  "errores_recurrentes": ["errores que el agente debe evitar"],
  "preferencias_editoriales": ["preferencias de estilo/formato"]
}`,
    1500
  )

  // 4c: Análisis competitivo
  console.log('  → Analizando competidores...')
  const compResumen = competidoresTexto.map(c => `## ${c.nombre} (${c.web})\n${c.texto.substring(0, 1500)}`).join('\n\n')
  const analisisCompetitivo = await callOpenAI(
    'Eres un estratega de posicionamiento de marca. Analizas competidores para encontrar diferenciación.',
    `El cliente es Genera (genera.cl) — software de RRHH en Chile, concepto "Hablemos de Productividad", gestiona asistencia de +380.000 personas.

Sus competidores directos son:

${compResumen}

Analiza y responde en JSON:
{
  "que_dicen_todos": "los mensajes/promesas que TODOS los competidores repiten (commodities)",
  "que_dice_solo_genera": "lo que Genera puede decir que los demás no",
  "angulos_diferenciadores": ["5 ángulos de comunicación que Genera debería explotar y que la competencia no cubre"],
  "tono_competidores": "resumen del tono general que usan los competidores",
  "tono_recomendado_genera": "cómo debería sonar Genera para diferenciarse",
  "temas_a_evitar": ["temas que ya están saturados por la competencia"]
}`,
    2000
  )

  // 4d: Análisis de la web del cliente
  console.log('  → Analizando web del cliente...')
  const analisisWeb = await callOpenAI(
    'Eres un analista de propuesta de valor. Extraes lo que una empresa dice de sí misma.',
    `Este es el texto extraído de genera.cl:

${(webTexto || '').substring(0, 5000)}

Extrae en JSON:
{
  "propuesta_valor": "la propuesta de valor principal en 1-2 oraciones",
  "modulos_producto": ["lista de módulos/funcionalidades del software"],
  "numeros_clave": ["cifras que mencionan: clientes, personas gestionadas, años, etc."],
  "certificaciones": ["acreditaciones o certificaciones que mencionan"],
  "sectores_target": ["industrias o tipos de empresa a los que apuntan"]
}`,
    1500
  )

  // ── PASO 5: Compilar briefing final ──
  console.log('\n📋 Paso 5: Compilando briefing...')

  let tonoJSON, feedbackJSON, competitivoJSON, webJSON
  try { tonoJSON = JSON.parse(analisisTono.replace(/```json\n?/g, '').replace(/```/g, '').trim()) } catch (e) { tonoJSON = { raw: analisisTono } }
  try { feedbackJSON = JSON.parse(analisisFeedback.replace(/```json\n?/g, '').replace(/```/g, '').trim()) } catch (e) { feedbackJSON = { raw: analisisFeedback } }
  try { competitivoJSON = JSON.parse(analisisCompetitivo.replace(/```json\n?/g, '').replace(/```/g, '').trim()) } catch (e) { competitivoJSON = { raw: analisisCompetitivo } }
  try { webJSON = JSON.parse(analisisWeb.replace(/```json\n?/g, '').replace(/```/g, '').trim()) } catch (e) { webJSON = { raw: analisisWeb } }

  const briefing = {
    meta: {
      cliente: CONFIG.nombre,
      slug: CONFIG.slug,
      industria: CONFIG.industria,
      web: CONFIG.web,
      plataformas: CONFIG.plataformas,
      frecuencia: CONFIG.frecuencia,
      fecha_setup: new Date().toISOString(),
    },
    contexto: CONFIG.contexto_extra,
    analisis_web: webJSON,
    analisis_tono: tonoJSON,
    reglas_feedback: feedbackJSON,
    analisis_competitivo: competitivoJSON,
    competidores: CONFIG.competidores.map(c => ({ nombre: c.nombre, web: c.web })),
    copies_referencia: copiesHistoricos.slice(0, 10),
    sheet_config: {
      sheetId: CONFIG.sheetId,
      hojas: CONFIG.hojas,
    }
  }

  // ── PASO 6: Guardar ──
  const outputDir = `${__dirname}/../data/agentes`
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = `${outputDir}/genera.json`
  fs.writeFileSync(outputPath, JSON.stringify(briefing, null, 2), 'utf8')
  console.log(`\n💾 Briefing guardado en: ${outputPath}`)
  console.log(`   Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`)

  // Resumen
  console.log('\n═══════════════════════════════════════════════')
  console.log(`  ✅ SETUP COMPLETADO — ${CONFIG.nombre}`)
  console.log('═══════════════════════════════════════════════')
  console.log(`  Copies analizados: ${copiesHistoricos.length}`)
  console.log(`  Feedback procesado: ${feedbackHistorico.length} correcciones`)
  console.log(`  Competidores analizados: ${competidoresTexto.length}`)
  console.log(`  Tono: ${tonoJSON.tono_general || 'ver JSON'}`)
  console.log(`  Diferenciador: ${competitivoJSON.que_dice_solo_genera || 'ver JSON'}`)
  console.log(`\n  Archivo: ${outputPath}`)
  console.log(`  Usar en grilla mensual: requiere el briefing como input`)
}

main().catch(e => { console.error('❌ Error fatal:', e); process.exit(1) })
