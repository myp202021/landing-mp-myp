/**
 * AGENTE MENSUAL — Genera (HR Tech Chile)
 * Genera la grilla de contenido del mes siguiente.
 *
 * Lee el briefing generado por setup-agente-genera.js
 * Consulta contingencia Chile actual
 * Genera copies de EXCELENCIA con GPT-4o
 * Crea un Google Sheet editable con la grilla
 * Envía email con link al Sheet
 *
 * Cron: 15 de cada mes via GitHub Actions
 */

const fetch = require('node-fetch')
const fs = require('fs')
const { google } = require('googleapis')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const RESEND_API_KEY = process.env.RESEND
const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : null

// ═══════════════════════════════════════════════════════════════
// CALENDARIO CHILE 2026
// ═══════════════════════════════════════════════════════════════

const CALENDARIO = {
  1: { fechas: ['1 Año Nuevo'], contexto: 'Vuelta al trabajo, planificación anual, objetivos RRHH' },
  2: { fechas: ['14 San Valentín'], contexto: 'Clima laboral, bienestar, cultura organizacional' },
  3: { fechas: ['8 Día de la Mujer'], contexto: 'Equidad de género, liderazgo femenino en empresas' },
  4: { fechas: ['Semana Santa', '26 Entrada en vigencia 42 hrs'], contexto: 'Implementación ley 42 horas, adaptación normativa' },
  5: { fechas: ['1 Día del Trabajador', '10 Día de la Madre'], contexto: 'Reconocimiento laboral, bienestar, ausentismo mayo, temporada licencias médicas, post-implementación 42 hrs' },
  6: { fechas: ['20 Día del Padre'], contexto: 'Corresponsabilidad, mid-year review, evaluación primer semestre' },
  7: { fechas: ['16 Virgen del Carmen'], contexto: 'Mitad de año, ajustes presupuestarios, evaluación desempeño' },
  8: { fechas: ['15 Asunción'], contexto: 'Preparación Fiestas Patrias, gestión vacaciones, turnos alta demanda' },
  9: { fechas: ['18-19 Fiestas Patrias'], contexto: 'Feriados largos, permisos, asistencia post-feriado, ausentismo' },
  10: { fechas: ['12 Encuentro de Dos Mundos', '31 Halloween'], contexto: 'Q4, cierre de año, bonos, gratificaciones' },
  11: { fechas: ['1 Todos los Santos'], contexto: 'Cierre fiscal, finiquitos, renovaciones contrato' },
  12: { fechas: ['8 Inmaculada', '25 Navidad'], contexto: 'Cierre anual RRHH, aguinaldos, vacaciones colectivas, dotación año siguiente' },
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════════

async function callOpenAI(system, user, maxTokens = 8000, temp = 0.6) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      max_tokens: maxTokens,
      temperature: temp
    })
  })
  const data = await res.json()
  if (!data.choices?.[0]) throw new Error(`OpenAI error: ${JSON.stringify(data).substring(0, 500)}`)
  return data.choices[0].message.content
}

async function obtenerContingencia(mes, año) {
  const raw = await callOpenAI(
    'Eres un analista económico y laboral chileno. Solo entregas datos verificables.',
    `Estamos en ${mes} ${año} en Chile. Lista 6-8 hechos económicos, laborales o regulatorios relevantes de las últimas semanas que afecten a empresas medianas/grandes en gestión de personas. Solo hechos concretos, no opiniones. Formato JSON array de strings.`,
    600, 0.3
  )
  try {
    return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```/g, '').trim())
  } catch (e) {
    return ['Costos operativos en alza', 'Mercado laboral competitivo en Chile']
  }
}

async function descargarHoja(sheetId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) return ''
  return await res.text()
}

function extraerCopiesRecientes(csvTexts) {
  const copies = []
  for (const csv of csvTexts) {
    const matches = csv.match(/"([^"]{100,600})"/g)
    if (matches) {
      for (const m of matches) {
        const clean = m.replace(/^"|"$/g, '').replace(/""/g, '"')
        if (!clean.startsWith('#') && !clean.includes('Ajustar') && !clean.includes('Finalizar')) {
          copies.push(clean.substring(0, 400))
        }
      }
    }
  }
  return copies
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE SHEETS — Crear sheet editable
// ═══════════════════════════════════════════════════════════════

// Sheet existente del cliente — se agrega una hoja nueva por mes
const GENERA_SHEET_ID = '1iFPnPEyBlc4GpKjvBe3_o1X52PGKRzG0kbyrt8BR_HY'

async function crearGoogleSheet(grilla, mesNombre, año) {
  if (!GOOGLE_CREDENTIALS) {
    console.log('⚠️ GOOGLE_CREDENTIALS no configuradas — saltando creación de Sheet')
    return null
  }

  const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = GENERA_SHEET_ID
  const hojaTitle = `${mesNombre} ${año} (BORRADOR)`

  // Verificar si ya existe una hoja con ese nombre
  const info = await sheets.spreadsheets.get({ spreadsheetId })
  const existente = info.data.sheets.find(s => s.properties.title === hojaTitle)
  if (existente) {
    // Borrar la existente para recrearla limpia
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests: [{ deleteSheet: { sheetId: existente.properties.sheetId } }] }
    })
  }

  // Crear hoja nueva
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: { requests: [{ addSheet: { properties: { title: hojaTitle } } }] }
  })

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=` +
    (await sheets.spreadsheets.get({ spreadsheetId })).data.sheets.find(s => s.properties.title === hojaTitle).properties.sheetId

  // Armar filas
  const rows = []

  // Header
  rows.push([mesNombre + ' ' + año, '', '', '', '', '', '', ''])
  rows.push(['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', '', ''])
  rows.push([])

  for (const semana of grilla.semanas) {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const mapa = {}
    for (const d of (semana.dias || [])) { mapa[d.dia_semana] = d }

    // Rango
    rows.push([semana.rango])
    rows.push([])

    // Dia
    const filaDia = ['Dia']
    for (const ds of diasSemana) { filaDia.push(mapa[ds]?.dia || '') }
    rows.push(filaDia)

    // Plataforma
    const filaPlatf = ['Plataforma']
    for (const ds of diasSemana) { filaPlatf.push(mapa[ds]?.plataforma || '') }
    rows.push(filaPlatf)

    // IMAGEN/VIDEO
    rows.push(['IMAGEN /VIDEO', '', '', '', '', '', '', ''])

    // Tipo Post
    const filaTipo = ['Tipo Post']
    for (const ds of diasSemana) { filaTipo.push(mapa[ds]?.tipo_post || '') }
    rows.push(filaTipo)

    // Copy
    const filaCopy = ['Copy']
    for (const ds of diasSemana) { filaCopy.push(mapa[ds]?.copy || '') }
    rows.push(filaCopy)

    // Hashtags
    const filaHash = ['Hashtags']
    for (const ds of diasSemana) { filaHash.push(mapa[ds]?.hashtags || '') }
    rows.push(filaHash)

    // Comentarios
    const filaComent = ['Comentarios']
    for (const ds of diasSemana) { filaComent.push(mapa[ds]?.nota_interna || '') }
    rows.push(filaComent)

    rows.push([]) // Separador
  }

  // Escribir datos
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${mesNombre}!A1`,
    valueInputOption: 'RAW',
    resource: { values: rows }
  })

  console.log(`✅ Hoja "${hojaTitle}" creada en Sheet de Genera: ${sheetUrl}`)
  return sheetUrl
}

// ═══════════════════════════════════════════════════════════════
// EMAIL
// ═══════════════════════════════════════════════════════════════

async function enviarEmail(grilla, mesNombre, año, sheetUrl) {
  let totalPosts = grilla.semanas.reduce((a, s) => a + (s.dias?.length || 0), 0)

  let postsPreview = ''
  for (const sem of grilla.semanas) {
    postsPreview += `<tr><td colspan="4" style="background:#0A1628;color:#60A5FA;padding:8px 12px;font-weight:700;font-size:12px;">${sem.rango}</td></tr>`
    for (const d of (sem.dias || [])) {
      const plColor = d.plataforma === 'LinkedIn' ? '#0077B5' : '#E1306C'
      postsPreview += `<tr style="border-bottom:1px solid #eee;">
        <td style="padding:10px;font-size:12px;font-weight:700;white-space:nowrap;">${d.dia_semana} ${d.dia}</td>
        <td style="padding:10px;"><span style="background:${plColor};color:#fff;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">${d.plataforma}</span></td>
        <td style="padding:10px;font-size:11px;color:#666;">${d.tipo_post}</td>
        <td style="padding:10px;font-size:11px;color:#333;line-height:1.5;">${d.copy}</td>
      </tr>`
    }
  }

  const sheetButton = sheetUrl
    ? `<a href="${sheetUrl}" style="display:inline-block;background:#0055A4;color:#fff;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;margin:16px 0;">Abrir Grilla en Google Sheets →</a>
       <p style="font-size:11px;color:#888;margin-top:4px;">Link editable — el equipo puede modificar directamente</p>`
    : '<p style="color:#EA580C;font-size:11px;">⚠️ Google Sheets no configurado. Ver CSV adjunto.</p>'

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#0A1628,#0055A4);color:#fff;padding:24px 28px;border-radius:12px 12px 0 0;">
        <h2 style="margin:0;font-size:20px;">Grilla de Contenido — Genera</h2>
        <p style="margin:6px 0 0;opacity:0.8;font-size:14px;">${mesNombre} ${año} · ${totalPosts} publicaciones · Borrador para revisión</p>
      </div>
      <div style="background:#fff;padding:20px 28px;border:1px solid #e0e0e0;text-align:center;">
        ${sheetButton}
      </div>
      <div style="background:#fff;padding:0 28px 20px;border:1px solid #e0e0e0;border-top:none;">
        <h3 style="font-size:13px;color:#0055A4;margin:16px 0 8px;">PREVIEW COMPLETO</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f8f9fa;"><th style="padding:6px 10px;text-align:left;font-size:10px;">Día</th><th style="padding:6px 10px;text-align:left;font-size:10px;">Red</th><th style="padding:6px 10px;text-align:left;font-size:10px;">Tipo</th><th style="padding:6px 10px;text-align:left;font-size:10px;">Copy</th></tr>
          ${postsPreview}
        </table>
      </div>
      <div style="background:#f8f9fa;padding:16px 28px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;font-size:11px;color:#666;">
        <strong>Borrador generado automáticamente.</strong> El equipo de contenidos revisa, edita y aprueba antes de enviar al cliente.
        <br>Muller y Pérez — Performance Marketing
      </div>
    </div>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'M&P Contenidos <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      subject: `📋 Grilla Genera — ${mesNombre} ${año} (borrador para revisión)`,
      html
    })
  })
  console.log('✅ Email enviado con preview + link a Sheet')
}

// ═══════════════════════════════════════════════════════════════
// GENERACIÓN DE GRILLA — EL PROMPT DURO
// ═══════════════════════════════════════════════════════════════

async function generarGrilla(mesNum, año, contingencia, briefing, copiesRecientes) {
  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const mesNombre = meses[mesNum]
  const cal = CALENDARIO[mesNum] || { fechas: [], contexto: '' }
  const ultimoDia = new Date(año, mesNum, 0).getDate()

  // Copies de referencia (los mejores del cliente)
  const refCopies = (briefing.copies_referencia || []).slice(0, 6).map((c, i) => `EJEMPLO ${i + 1}:\n${c}`).join('\n\n')

  // Extraer datos del briefing
  const tono = briefing.analisis_tono || {}
  const reglas = briefing.reglas_feedback || {}
  const competitivo = briefing.analisis_competitivo || {}
  const web = briefing.analisis_web || {}

  const SYSTEM = `Eres el copywriter senior de Genera, empresa de software de RRHH en Chile. Llevas años escribiendo para esta marca. Conoces su tono, sus productos, su público y su competencia. NO eres una IA generando contenido — eres un profesional que escribe como si cada post fuera a ser leído por el gerente de RRHH de Copefrut o Agrosuper y tiene que sentirse identificado.

Tu trabajo NO es "crear contenido de redes sociales". Tu trabajo es posicionar a Genera como el aliado estratégico que entiende la operación de RRHH mejor que nadie en Chile.`

  const PROMPT = `## BRIEFING GENERA

### Propuesta de valor
${web.propuesta_valor || 'Software integral de RRHH: asistencia, remuneraciones, firma digital, turnos con IA.'}

### Módulos del producto
${(web.modulos_producto || ['Control de Asistencia', 'Remuneraciones', 'Firma Digital', 'Turnos Inteligentes con IA', 'GENHORAS']).join(', ')}

### Números clave
${(web.numeros_clave || ['+380.000 personas gestionadas', '+40 años de experiencia']).join(' · ')}

### Tono de la marca
${tono.tono_general || 'Corporativo sin ser frío. Habla desde la autoridad de gestionar +380.000 personas. Usa datos concretos, no adjetivos vacíos.'}
Nivel de formalidad: ${tono.nivel_formalidad || '7'}/10
Palabras frecuentes: ${(tono.palabras_frecuentes || ['productividad', 'procesos', 'operación', 'fricción operativa', 'normativa']).join(', ')}
Cierre: ${tono.patron_cierre || 'genera.cl + variación de "Hablemos de Productividad"'}

### Reglas del equipo de contenidos
${(reglas.reglas_obligatorias || ['Cerrar siempre con "Hablemos de Productividad"', 'Punto después de hrs.', 'G mayúscula en Genera', 'Titulares como pregunta o frase de impacto']).map(r => `- ${r}`).join('\n')}

### Errores a evitar
${(reglas.errores_recurrentes || ['No empezar con pregunta retórica vacía', 'No usar datos inventados']).map(r => `- ${r}`).join('\n')}

### Diferenciación vs competencia (Buk, GeoVictoria, Talana, Rex+)
Lo que Genera puede decir que otros no: ${competitivo.que_dice_solo_genera || 'Gestiona +380.000 personas, acreditación DT, concepto de productividad (no solo software de RRHH)'}
Ángulos diferenciadores: ${(competitivo.angulos_diferenciadores || ['Productividad como eje central', 'Experiencia con empresas grandes', 'IA aplicada a turnos']).join(' · ')}
Temas saturados por competencia: ${(competitivo.temas_a_evitar || ['Digitalización genérica', 'Nube vs on-premise']).join(', ')}

---

## COPIES DE REFERENCIA — ASÍ ESCRIBE GENERA (copiar este nivel)
${refCopies}

---

## COPIES RECIENTES (NO repetir estos ángulos)
${copiesRecientes.slice(0, 15).map((c, i) => `${i + 1}. ${c.substring(0, 150)}...`).join('\n')}

---

## CONTINGENCIA CHILE — ${mesNombre} ${año}
${contingencia.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## CALENDARIO
Fechas: ${cal.fechas.join(', ')}
Contexto estacional: ${cal.contexto}

---

## TAREA
Genera la grilla completa de ${mesNombre} ${año} para Genera. Del 1 al ${ultimoDia}.

## PROHIBICIONES ABSOLUTAS — Si violas alguna, el copy se descarta
1. PROHIBIDO empezar con "¿Sabías que...?", "En un mundo donde...", "Hoy más que nunca...", "En la era de..."
2. PROHIBIDO usar emojis al inicio del copy. Si usas emoji, máximo 1 por copy y solo como marcador visual (📊, 👉, 📌) al final, antes del CTA.
3. PROHIBIDO inventar estadísticas o porcentajes. Solo usar datos que Genera publica: +380.000 personas, +40 años, acreditación DT.
4. PROHIBIDO copies de menos de 120 palabras en LinkedIn o menos de 70 palabras en Instagram. TODO copy debe ser robusto, sustantivo, con desarrollo argumental.
5. PROHIBIDO dos copies seguidos con la misma estructura (ej: dos que empiecen con pregunta, o dos que empiecen con afirmación).
6. PROHIBIDO usar "solución", "revolucionario", "líder del mercado", "innovador", "cutting-edge", "game-changer" o cualquier buzzword vacío.
7. PROHIBIDO posts genéricos tipo "Feliz Día del Trabajador". Si hay fecha especial, conectar CON SUSTANCIA al producto o al dolor del gerente de RRHH.
8. PROHIBIDO repetir temas de los copies recientes listados arriba.
9. PROHIBIDO copies que suenen a "IA generó esto". Cada copy debe tener un punto de vista, una postura, una tensión. Como si lo escribiera alguien que lleva 10 años en la industria de RRHH.
10. PROHIBIDO cerrar sin "genera.cl" y sin alguna variación de "Hablemos de Productividad".

## OBLIGACIONES
- LinkedIn: 150-250 palabras mínimo. Desarrollo argumental. Premisa → tensión → resolución → CTA.
- Facebook/Instagram: 70-150 palabras mínimo. Más directo pero igualmente sustantivo.
- 15-18 posts en total para el mes.
- 3-4 posts por semana (L-V). Alternar LinkedIn (2/semana) y FB/IG (2/semana).
- Al menos 2 carruseles en el mes (con nota interna de qué slides).
- Al menos 3 posts que conecten con la contingencia de Chile.
- Rotar módulos: Asistencia, Remuneraciones, Firma Digital, Turnos IA. No más de 3 posts del mismo módulo.
- Variar aperturas: dato concreto, escenario real, afirmación provocadora, pregunta genuina (no retórica).
- Los hashtags siempre incluyen #Genera #Productividad + 3-4 del tema.

## FORMATO JSON
{
  "mes": "${mesNombre} ${año}",
  "semanas": [
    {
      "rango": "1-5 ${mesNombre.toLowerCase()}",
      "dias": [
        {
          "dia": 1,
          "dia_semana": "Jueves",
          "plataforma": "LinkedIn",
          "tipo_post": "Post",
          "copy": "Copy completo aquí. Mínimo 150 palabras para LinkedIn, 70 para Instagram. Robusto, con argumento, sin relleno.",
          "hashtags": "#Genera #Productividad #RRHH #Tag4 #Tag5",
          "nota_interna": "Nota para el equipo de diseño/contenidos"
        }
      ]
    }
  ]
}

Genera SOLO el JSON. Nada más.`

  console.log('🧠 Generando grilla con GPT-4o (prompt duro)...')
  const raw = await callOpenAI(SYSTEM, PROMPT, 12000, 0.6)
  const json = raw.replace(/```json\n?/g, '').replace(/```/g, '').trim()

  try {
    return JSON.parse(json)
  } catch (e) {
    console.error('❌ Error parseando JSON. Primeros 500 chars:', json.substring(0, 500))
    throw e
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('  AGENTE GENERA — Grilla Mensual (v2)')
  console.log('═══════════════════════════════════════════════')

  // Mes target: el siguiente al actual
  const hoy = new Date()
  let mesTarget = hoy.getMonth() + 2
  let añoTarget = hoy.getFullYear()
  if (mesTarget > 12) { mesTarget = 1; añoTarget++ }
  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  console.log(`📅 Generando grilla: ${meses[mesTarget]} ${añoTarget}`)

  // Cargar briefing
  const briefingPath = `${__dirname}/../data/agentes/genera.json`
  let briefing = {}
  if (fs.existsSync(briefingPath)) {
    briefing = JSON.parse(fs.readFileSync(briefingPath, 'utf8'))
    console.log('📋 Briefing cargado desde:', briefingPath)
  } else {
    console.warn('⚠️ Sin briefing — ejecutar setup-agente-genera.js primero')
    console.log('  Continuando con briefing mínimo...')
  }

  // Descargar grillas recientes para no repetir
  console.log('📥 Descargando grillas históricas...')
  const sheetConfig = briefing.sheet_config || { sheetId: '1iFPnPEyBlc4GpKjvBe3_o1X52PGKRzG0kbyrt8BR_HY', hojas: [{ gid: 1948170592 }, { gid: 963825208 }] }
  const csvTexts = []
  for (const h of (sheetConfig.hojas || [])) {
    const csv = await descargarHoja(sheetConfig.sheetId, h.gid)
    if (csv) csvTexts.push(csv)
  }
  const copiesRecientes = extraerCopiesRecientes(csvTexts)
  console.log(`  → ${copiesRecientes.length} copies recientes extraídos`)

  // Contingencia Chile
  console.log('🇨🇱 Consultando contingencia...')
  const contingencia = await obtenerContingencia(meses[mesTarget], añoTarget)
  contingencia.forEach((c, i) => console.log(`  ${i + 1}. ${c}`))

  // Generar grilla (con retry si sale incompleta)
  let grilla = null
  for (let intento = 1; intento <= 2; intento++) {
    grilla = await generarGrilla(mesTarget, añoTarget, contingencia, briefing, copiesRecientes)
    const totalPosts = grilla.semanas.reduce((a, s) => a + (s.dias?.length || 0), 0)
    console.log(`✅ Intento ${intento}: ${grilla.semanas.length} semanas, ${totalPosts} posts`)
    if (totalPosts >= 12) break
    console.warn(`⚠️ Grilla incompleta (${totalPosts} posts, mínimo 12). Reintentando...`)
  }
  const totalPosts = grilla.semanas.reduce((a, s) => a + (s.dias?.length || 0), 0)

  // Validar mínimos
  for (const sem of grilla.semanas) {
    for (const d of (sem.dias || [])) {
      const words = d.copy.split(/\s+/).length
      const min = d.plataforma === 'LinkedIn' ? 150 : 70
      if (words < min * 0.7) {
        console.warn(`  ⚠ ${d.dia_semana} ${d.dia}: ${words} palabras (mínimo ${min}) — copy corto`)
      }
    }
  }

  // Crear Google Sheet (si falla, continúa sin link)
  let sheetUrl = null
  try {
    sheetUrl = await crearGoogleSheet(grilla, meses[mesTarget], añoTarget)
  } catch (e) {
    console.warn(`⚠️ No se pudo crear Google Sheet: ${e.message}`)
    console.warn('  Continuando sin link — revisa permisos de la Service Account')
  }

  // Guardar CSV local como respaldo
  const csvPath = `/tmp/grilla-genera-${meses[mesTarget].toLowerCase()}-${añoTarget}.csv`
  let csvContent = `${grilla.mes}\n\n`
  for (const sem of grilla.semanas) {
    csvContent += `${sem.rango}\n`
    for (const d of (sem.dias || [])) {
      csvContent += `${d.dia_semana} ${d.dia},${d.plataforma},${d.tipo_post},"${d.copy.replace(/"/g, '""')}",${d.hashtags}\n`
    }
    csvContent += '\n'
  }
  fs.writeFileSync(csvPath, csvContent, 'utf8')
  console.log(`💾 CSV respaldo: ${csvPath}`)

  // Preview en consola
  console.log('\n📋 PREVIEW:')
  console.log('─'.repeat(70))
  for (const sem of grilla.semanas) {
    console.log(`\n📅 ${sem.rango}`)
    for (const d of (sem.dias || [])) {
      const pl = d.plataforma === 'LinkedIn' ? 'LI' : 'IG'
      const words = d.copy.split(/\s+/).length
      console.log(`  ${d.dia_semana} ${d.dia} | ${pl} | ${d.tipo_post} | ${words}w | ${d.copy.substring(0, 90)}...`)
    }
  }

  // Enviar email
  if (RESEND_API_KEY) {
    console.log('\n📧 Enviando email...')
    await enviarEmail(grilla, meses[mesTarget], añoTarget, sheetUrl)
  }

  console.log('\n═══════════════════════════════════════════════')
  console.log('  ✅ AGENTE GENERA COMPLETADO (v2)')
  if (sheetUrl) console.log(`  📊 Sheet: ${sheetUrl}`)
  console.log('═══════════════════════════════════════════════')
}

main().catch(e => { console.error('❌ Error fatal:', e); process.exit(1) })
