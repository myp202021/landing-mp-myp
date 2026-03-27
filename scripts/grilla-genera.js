/**
 * AGENTE DE CONTENIDO — GENERA (HR Tech Chile)
 * Genera la grilla mensual de copies para LinkedIn + Facebook/Instagram
 *
 * Corre el 15 de cada mes via GitHub Actions
 * Lee grillas históricas del Google Sheet de Genera
 * Consulta contingencia Chile + calendario estacional
 * Genera copies con OpenAI (gpt-4o)
 * Envía email con la grilla al equipo
 *
 * Cliente: Genera — genera.cl
 * Producto: Software de RRHH (asistencia, remuneraciones, firma digital, turnos)
 * Concepto de marca: "Hablemos de Productividad"
 * Redes: LinkedIn + Facebook/Instagram
 * Frecuencia: 3-5 posts/semana
 */

const fetch = require('node-fetch')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const RESEND_API_KEY = process.env.RESEND

// ═══════════════════════════════════════════════════════════════
// BRIEFING DEL AGENTE — Todo lo que necesita saber sobre Genera
// ═══════════════════════════════════════════════════════════════

const BRIEFING_GENERA = `
## CLIENTE: Genera — genera.cl
Software de Recursos Humanos para empresas medianas y grandes en Chile.

## PRODUCTO Y MÓDULOS
1. **Control de Asistencia** — Relojes biométricos, app móvil, marcación facial. Acreditado por la Dirección del Trabajo. Gestiona +380.000 personas.
2. **Remuneraciones** — Cálculo automático integrado con asistencia. Sin reprocesos manuales.
3. **Firma Digital** — Contratos, finiquitos, anexos firmados digitalmente con validez legal.
4. **Turnos Inteligentes con IA** — Funcionalidad nueva (lanzada abril 2026). Optimiza asignación de turnos considerando variables operativas y normativas.
5. **GENHORAS** — Producto estrella de control de asistencia, acreditado por la DT.

## CONCEPTO DE MARCA
"Hablemos de Productividad" — SIEMPRE cerrar los copies con esta frase o una variación.
La productividad se entiende como: eliminar fricción operativa en RRHH para que las personas y la empresa se enfoquen en lo que importa.

## TONO Y VOZ
- Corporativo pero no frío. Cercano pero no informal.
- Habla desde la autoridad (380.000 personas gestionadas) sin ser arrogante.
- Usa datos concretos, no adjetivos vacíos.
- NO usa "solución", "revolucionario", "líderes del mercado" ni buzzwords genéricos.
- SÍ usa: "procesos", "operación", "continuidad", "normativa", "productividad", "fricción operativa".
- Cierra siempre con "📊 genera.cl" o "👉 genera.cl" + "Hablemos de Productividad" o variación.
- LinkedIn: más largo (150-250 palabras), estratégico, pensado para gerentes de RRHH.
- Facebook/Instagram: más directo (80-150 palabras), emocional-racional, visual.

## REGLAS DEL EQUIPO DE CONTENIDOS (feedback recurrente)
- Finalizar siempre con la frase invitación "Hablemos de Productividad".
- Poner punto después de "hrs." (42 hrs.)
- La "G" de "genera" en mayúscula cuando se refiere a la marca.
- Destacar la palabra "productividad" cuando aparezca en titulares.
- Titulares deben ser preguntas o frases de impacto, no descripciones.
- No empezar dos posts seguidos con el mismo formato.

## QUÉ NO REPETIR (temas ya cubiertos extensamente)
- Ley 42 horas: se cubrió intensamente en marzo-abril 2026 (todos los ángulos: asistencia, remuneraciones, firma digital, turnos). Puede mencionarse como contexto pero NO como tema principal de más de 1-2 posts al mes.
- "Errores manuales en asistencia generan cadena de problemas" — ángulo ya usado 4+ veces.
- "Conectar asistencia con remuneraciones" — ángulo ya usado 5+ veces.
`

// ═══════════════════════════════════════════════════════════════
// CALENDARIO ESTACIONAL CHILE 2026
// ═══════════════════════════════════════════════════════════════

const CALENDARIO_CHILE = {
  1: { fechas: ['1 Año Nuevo'], temas: ['Vuelta al trabajo', 'Planificación anual RRHH', 'Objetivos del año'] },
  2: { fechas: ['14 San Valentín'], temas: ['Clima laboral', 'Bienestar', 'Cultura organizacional'] },
  3: { fechas: ['8 Día Internacional de la Mujer'], temas: ['Equidad', 'Liderazgo femenino', 'Políticas de género en empresas'] },
  4: { fechas: ['18-19 Semana Santa', '26 Entrada en vigencia 42 hrs.'], temas: ['Ley 42 horas implementación', 'Turnos nuevos', 'Adaptación normativa'] },
  5: { fechas: ['1 Día del Trabajador', '10 Día de la Madre (Chile)', '21 Día de las Glorias Navales'], temas: ['Reconocimiento laboral', 'Bienestar empleados', 'Productividad post-feriados', 'Gestión de ausentismo mayo', 'Temporada alta de licencias médicas'] },
  6: { fechas: ['20 Día del Padre'], temas: ['Corresponsabilidad', 'Beneficios laborales', 'Mid-year review RRHH'] },
  7: { fechas: ['16 Día de la Virgen del Carmen'], temas: ['Segundo semestre', 'Ajuste presupuestario', 'Evaluación de desempeño'] },
  8: { fechas: ['15 Asunción'], temas: ['Preparación Fiestas Patrias', 'Gestión de vacaciones', 'Turnos temporada alta'] },
  9: { fechas: ['18-19 Fiestas Patrias'], temas: ['Feriados largos', 'Gestión de permisos', 'Asistencia post-feriado'] },
  10: { fechas: ['12 Encuentro de Dos Mundos', '31 Día de la Reforma'], temas: ['Q4 planning', 'Cierre de año', 'Bonos y gratificaciones'] },
  11: { fechas: ['1 Día de Todos los Santos'], temas: ['Cierre fiscal', 'Finiquitos', 'Renovaciones contrato'] },
  12: { fechas: ['8 Inmaculada Concepción', '25 Navidad'], temas: ['Cierre de año RRHH', 'Aguinaldos', 'Planificación dotación', 'Vacaciones colectivas'] },
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════════

/**
 * Descarga una hoja del Google Sheet como CSV
 */
async function descargarHoja(sheetId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Error descargando hoja gid=${gid}: ${res.status}`)
  return await res.text()
}

/**
 * Busca noticias/contingencia de Chile relevante para RRHH y productividad
 */
async function obtenerContingencia(mes, año) {
  const prompt = `Es ${mes} ${año} en Chile. Lista las 5-7 noticias o tendencias económicas/laborales más relevantes de las últimas 4 semanas que afecten a empresas medianas y grandes en Chile, especialmente en gestión de personas y RRHH.

Ejemplos del tipo de contingencia que busco:
- Cambios en leyes laborales o normativas
- Variaciones económicas (dólar, inflación, bencina, costos operativos)
- Tendencias del mercado laboral (escasez de talento, rotación, teletrabajo)
- Eventos sectoriales o fechas importantes
- Tecnología/IA aplicada a RRHH

Responde SOLO con un JSON array de strings. Ejemplo:
["El dólar subió a $950 aumentando costos operativos", "Nueva normativa de teletrabajo en discusión"]`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3
    })
  })
  const data = await res.json()
  try {
    const raw = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(raw)
  } catch (e) {
    console.warn('⚠️ No se pudo parsear contingencia, usando fallback')
    return ['Costos operativos en alza presionan la eficiencia empresarial', 'Adopción de IA en procesos de RRHH sigue creciendo en Chile']
  }
}

/**
 * Extrae un resumen de los copies históricos para no repetir
 */
function extraerHistorico(csvTexts) {
  const temas = []
  for (const csv of csvTexts) {
    const lines = csv.split('\n')
    for (const line of lines) {
      // Buscar líneas que parecen copies (largas, con contenido)
      if (line.length > 200 && !line.startsWith('Hashtags') && !line.startsWith('Comentarios') && !line.startsWith('Cometarios')) {
        // Extraer el primer párrafo/oración como tema
        const match = line.match(/"([^"]{50,200})/)
        if (match) temas.push(match[1].substring(0, 150))
      }
    }
  }
  return temas.slice(0, 40) // Máximo 40 temas para no sobrecargar el prompt
}

/**
 * Genera la grilla completa del mes con OpenAI
 */
async function generarGrilla(mesNum, año, contingencia, temasHistoricos) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const mesNombre = meses[mesNum - 1]
  const cal = CALENDARIO_CHILE[mesNum] || { fechas: [], temas: [] }

  // Calcular semanas del mes
  const primerDia = new Date(año, mesNum - 1, 1)
  const ultimoDia = new Date(año, mesNum, 0)
  const totalDias = ultimoDia.getDate()

  const prompt = `${BRIEFING_GENERA}

## TU TAREA
Genera la grilla de contenido de ${mesNombre} ${año} para Genera.
La grilla debe cubrir TODO el mes: del 1 al ${totalDias} de ${mesNombre}.

## CALENDARIO DEL MES
Fechas importantes: ${cal.fechas.join(', ') || 'Ninguna especial'}
Temas estacionales sugeridos: ${cal.temas.join(', ')}

## CONTINGENCIA CHILE (${mesNombre} ${año})
${contingencia.map((c, i) => `${i + 1}. ${c}`).join('\n')}
IMPORTANTE: Usa la contingencia como CONTEXTO para hacer los copies más relevantes. Si los costos suben → la productividad importa más. Si hay cambios normativos → Genera resuelve eso. NO hagas posts sobre la noticia en sí, sino sobre cómo la productividad en RRHH ayuda en ese contexto.

## TEMAS YA CUBIERTOS EN MESES ANTERIORES (NO REPETIR estos ángulos)
${temasHistoricos.map((t, i) => `- ${t}`).join('\n')}

## FORMATO DE SALIDA
Genera un JSON con esta estructura exacta:
{
  "mes": "${mesNombre} ${año}",
  "semanas": [
    {
      "rango": "1-5 mayo" (ejemplo),
      "dias": [
        {
          "dia": 1,
          "dia_semana": "Jueves",
          "plataforma": "LinkedIn" o "Facebook / Instagram",
          "tipo_post": "Post" o "Carrusel",
          "copy": "El copy completo aquí...",
          "hashtags": "#Tag1 #Tag2 #Tag3",
          "nota_interna": "Breve nota para el equipo sobre el enfoque"
        }
      ]
    }
  ]
}

## REGLAS OBLIGATORIAS
1. Genera entre 3 y 5 posts por semana (L-V). NO todos los días tienen post.
2. Alterna LinkedIn (2 por semana) y Facebook/Instagram (2-3 por semana).
3. LinkedIn: copies de 150-250 palabras. Tono estratégico, para gerentes RRHH.
4. Facebook/Instagram: copies de 80-150 palabras. Más directo, con emoji al inicio.
5. SIEMPRE termina con "genera.cl" + variación de "Hablemos de Productividad".
6. Cada post debe tener un ÁNGULO ÚNICO. No repetir la misma idea con distintas palabras.
7. Al menos 1 post semanal sobre un módulo específico (Asistencia, Remuneraciones, Firma Digital, Turnos IA). Rotar módulos.
8. Al menos 1 post semanal que conecte con la contingencia actual de Chile.
9. Si hay fecha importante en la semana, 1 post debe aprovecharla (sin ser genérico tipo "feliz día de..."). Conectar con productividad.
10. Los hashtags deben incluir siempre #Genera y #Productividad + 3-4 relevantes al tema.
11. Incluye 1-2 carruseles por mes (tipo_post: "Carrusel") con nota interna sobre qué slides hacer.
12. Los copies deben ser de EXCELENCIA. Nada genérico. Cada frase debe aportar valor o provocar reflexión. Un gerente de RRHH tiene que sentir que lo escribió alguien que entiende su mundo.
13. Varía las estructuras: pregunta inicial, dato impactante, afirmación directa, escenario hipotético. NUNCA dos posts seguidos con la misma estructura.

Genera el JSON completo. Nada más.`

  console.log(`🧠 Generando grilla de ${mesNombre} ${año} con GPT-4o...`)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres el director de contenido de Genera, una empresa de software de RRHH en Chile. Generas copies de nivel profesional para LinkedIn y redes sociales. Tu trabajo es impecable: cada palabra está pensada, cada post tiene un propósito, y todo respira el concepto "Hablemos de Productividad".' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 8000,
      temperature: 0.7
    })
  })

  const data = await res.json()

  if (!data.choices || !data.choices[0]) {
    console.error('❌ Error OpenAI:', JSON.stringify(data))
    throw new Error('OpenAI no devolvió resultado')
  }

  const raw = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(raw)
  } catch (e) {
    console.error('❌ Error parseando JSON de OpenAI')
    console.log('Raw:', raw.substring(0, 500))
    throw e
  }
}

/**
 * Convierte la grilla JSON a formato CSV (mismo formato que usan)
 */
function grillaACSV(grilla) {
  let csv = `${grilla.mes}\n\n`

  for (const semana of grilla.semanas) {
    // Header de semana
    const dias = semana.dias
    if (!dias || dias.length === 0) continue

    // Determinar el rango de la semana (lunes a domingo)
    csv += `,Lunes,Martes,Miércoles,Jueves,Viernes,,\n`
    csv += `,,,,,,,\n`

    // Crear mapa dia_semana → contenido
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const mapa = {}
    for (const d of dias) {
      mapa[d.dia_semana] = d
    }

    // Fila Dia
    csv += `Dia`
    for (const ds of diasSemana) {
      const d = mapa[ds]
      csv += `,${d ? d.dia : ''}`
    }
    csv += `\n`

    // Fila Plataforma
    csv += `Plataforma`
    for (const ds of diasSemana) {
      const d = mapa[ds]
      csv += `,${d ? d.plataforma : ''}`
    }
    csv += `\n`

    // Fila IMAGEN/VIDEO
    csv += `IMAGEN /VIDEO,,,,,,,\n`

    // Fila Tipo Post
    csv += `Tipo Post`
    for (const ds of diasSemana) {
      const d = mapa[ds]
      csv += `,${d ? d.tipo_post : ''}`
    }
    csv += `\n`

    // Fila Copy
    csv += `Copy`
    for (const ds of diasSemana) {
      const d = mapa[ds]
      const copy = d ? `"${d.copy.replace(/"/g, '""')}"` : ''
      csv += `,${copy}`
    }
    csv += `\n`

    // Fila Hashtags
    csv += `Hashtags`
    for (const ds of diasSemana) {
      const d = mapa[ds]
      csv += `,${d ? d.hashtags : ''}`
    }
    csv += `\n`

    // Fila Comentarios (notas internas)
    csv += `Comentarios`
    for (const ds of diasSemana) {
      const d = mapa[ds]
      csv += `,${d ? (d.nota_interna || '') : ''}`
    }
    csv += `\n\n`
  }

  return csv
}

/**
 * Genera HTML del email con preview de la grilla
 */
function generarEmailHTML(grilla, csvContent) {
  let postsHTML = ''
  let totalPosts = 0

  for (const semana of grilla.semanas) {
    postsHTML += `<tr><td colspan="4" style="background:#0A1628;color:#60A5FA;padding:8px 12px;font-weight:700;font-size:12px;">${semana.rango}</td></tr>`
    for (const d of (semana.dias || [])) {
      totalPosts++
      const platformColor = d.plataforma === 'LinkedIn' ? '#0077B5' : '#E1306C'
      postsHTML += `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px;font-size:11px;font-weight:700;">${d.dia_semana} ${d.dia}</td>
          <td style="padding:8px;"><span style="background:${platformColor};color:#fff;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">${d.plataforma}</span></td>
          <td style="padding:8px;font-size:10px;color:#666;">${d.tipo_post}</td>
          <td style="padding:8px;font-size:10px;color:#333;max-width:400px;">${d.copy.substring(0, 120)}...</td>
        </tr>`
    }
  }

  return `
    <div style="font-family:'Segoe UI',sans-serif;max-width:700px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#0A1628,#0055A4);color:#fff;padding:20px 24px;border-radius:10px 10px 0 0;">
        <h2 style="margin:0;font-size:18px;">Grilla de Contenido — Genera</h2>
        <p style="margin:4px 0 0;opacity:0.8;font-size:13px;">${grilla.mes} · ${totalPosts} publicaciones · Borrador para revisión</p>
      </div>
      <div style="background:#fff;padding:16px;border:1px solid #e0e0e0;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <tr style="background:#f8f9fa;">
            <th style="padding:6px 8px;text-align:left;font-size:10px;">Día</th>
            <th style="padding:6px 8px;text-align:left;font-size:10px;">Red</th>
            <th style="padding:6px 8px;text-align:left;font-size:10px;">Tipo</th>
            <th style="padding:6px 8px;text-align:left;font-size:10px;">Copy (preview)</th>
          </tr>
          ${postsHTML}
        </table>
      </div>
      <div style="background:#f8f9fa;padding:16px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 10px 10px;font-size:11px;color:#666;">
        <p><strong>Este es un borrador generado automáticamente.</strong> El equipo de contenidos debe revisar, editar los copies y aprobar antes de enviar al cliente.</p>
        <p style="margin-top:8px;">Muller y Pérez — Performance Marketing</p>
      </div>
    </div>`
}

/**
 * Envía email con la grilla
 */
async function enviarEmail(html, mes) {
  // Por ahora enviar solo a M&P — después se agrega contacto del cliente
  const destinatarios = ['contacto@mulleryperez.cl']

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'M&P Contenidos <contacto@mulleryperez.cl>',
      to: destinatarios,
      subject: `📋 Grilla Genera — ${mes} (borrador)`,
      html: html
    })
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('❌ Error enviando email:', err)
  } else {
    console.log(`✅ Email enviado a: ${destinatarios.join(', ')}`)
  }
}

// ═══════════════════════════════════════════════════════════════
// EJECUCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════')
  console.log('  AGENTE GENERA — Grilla de Contenido')
  console.log('═══════════════════════════════════════')

  // Determinar mes target (el mes SIGUIENTE al actual)
  const hoy = new Date()
  let mesTarget = hoy.getMonth() + 2 // +1 porque getMonth es 0-based, +1 más para mes siguiente
  let añoTarget = hoy.getFullYear()
  if (mesTarget > 12) { mesTarget = 1; añoTarget++ }

  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  console.log(`📅 Generando grilla para: ${meses[mesTarget]} ${añoTarget}`)

  // Paso 1: Descargar grillas históricas
  console.log('📥 Descargando grillas históricas...')
  const SHEET_ID = '1iFPnPEyBlc4GpKjvBe3_o1X52PGKRzG0kbyrt8BR_HY'
  const GIDS = [0, 819456550, 1250083556, 963825208, 1948170592] // Concepto, Ene, Feb, Mar, Mar-Abr

  const csvHistoricos = []
  for (const gid of GIDS) {
    try {
      const csv = await descargarHoja(SHEET_ID, gid)
      csvHistoricos.push(csv)
      console.log(`  ✓ Hoja gid=${gid} descargada (${csv.length} chars)`)
    } catch (e) {
      console.warn(`  ⚠ Error descargando gid=${gid}: ${e.message}`)
    }
  }

  // Paso 2: Extraer temas históricos
  console.log('🔍 Analizando temas ya cubiertos...')
  const temasHistoricos = extraerHistorico(csvHistoricos)
  console.log(`  → ${temasHistoricos.length} temas/ángulos identificados`)

  // Paso 3: Obtener contingencia Chile
  console.log('🇨🇱 Consultando contingencia Chile...')
  const contingencia = await obtenerContingencia(meses[mesTarget], añoTarget)
  console.log(`  → ${contingencia.length} noticias/tendencias obtenidas`)
  contingencia.forEach((c, i) => console.log(`    ${i + 1}. ${c}`))

  // Paso 4: Generar grilla con OpenAI
  const grilla = await generarGrilla(mesTarget, añoTarget, contingencia, temasHistoricos)
  const totalPosts = grilla.semanas.reduce((acc, s) => acc + (s.dias?.length || 0), 0)
  console.log(`✅ Grilla generada: ${grilla.semanas.length} semanas, ${totalPosts} posts`)

  // Paso 5: Convertir a CSV
  const csvOutput = grillaACSV(grilla)
  const fs = require('fs')
  const outputPath = `/tmp/grilla-genera-${meses[mesTarget].toLowerCase()}-${añoTarget}.csv`
  fs.writeFileSync(outputPath, csvOutput, 'utf8')
  console.log(`💾 CSV guardado en: ${outputPath}`)

  // Paso 6: Mostrar preview
  console.log('\n📋 PREVIEW DE LA GRILLA:')
  console.log('─'.repeat(60))
  for (const semana of grilla.semanas) {
    console.log(`\n📅 ${semana.rango}`)
    for (const d of (semana.dias || [])) {
      const platform = d.plataforma === 'LinkedIn' ? '🔵 LI' : '🟣 IG'
      console.log(`  ${d.dia_semana} ${d.dia} | ${platform} | ${d.tipo_post} | ${d.copy.substring(0, 80)}...`)
    }
  }

  // Paso 7: Enviar email
  if (RESEND_API_KEY) {
    console.log('\n📧 Enviando email...')
    const html = generarEmailHTML(grilla, csvOutput)
    await enviarEmail(html, `${meses[mesTarget]} ${añoTarget}`)
  } else {
    console.log('\n⚠️ RESEND_API_KEY no configurada — email no enviado')
  }

  console.log('\n═══════════════════════════════════════')
  console.log('  ✅ AGENTE GENERA COMPLETADO')
  console.log('═══════════════════════════════════════')
}

main().catch(e => {
  console.error('❌ Error fatal:', e)
  process.exit(1)
})
