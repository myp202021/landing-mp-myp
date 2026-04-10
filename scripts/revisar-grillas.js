/**
 * Revisor de Grillas — agente heurístico (sin LLM para la revisión)
 *
 * Aplica reglas heurísticas a cada post de cada grilla del mes/año dados.
 * Calcula score 0-100 por post, umbral 70.
 * Si --fix: llama a OpenAI para regenerar los posts con score < 70 (máximo 2 intentos).
 * Al final envía informe HTML a contacto@mulleryperez.cl.
 *
 * USO:
 *   node scripts/revisar-grillas.js <mes> <anio> [--fix] [--cliente <id>]
 *
 * Ejemplos:
 *   node scripts/revisar-grillas.js 5 2026            # Solo revisa, no arregla
 *   node scripts/revisar-grillas.js 5 2026 --fix      # Revisa + auto-fix con OpenAI
 *   node scripts/revisar-grillas.js 5 2026 --fix --cliente abc-123
 *
 * Env vars: OPENAI_API_KEY (solo si --fix), SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND
 */

const fetch = require('node-fetch')

const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_KEY = process.env.RESEND || process.env.RESEND_API_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const MESES = { 1:'Enero',2:'Febrero',3:'Marzo',4:'Abril',5:'Mayo',6:'Junio',7:'Julio',8:'Agosto',9:'Septiembre',10:'Octubre',11:'Noviembre',12:'Diciembre' }

const SCORE_UMBRAL = 70
const MAX_FIX_INTENTOS = 2

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ═══════════════════════════════════════════════════════════
// REGLAS HEURÍSTICAS
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
]

const CTAS_GENERICOS = [
  'contáctanos', 'contactanos', 'visita nuestro sitio', 'visita nuestra web',
  'agenda tu cita', 'agenda una reunión', 'escríbenos', 'llámanos',
  'más información', 'para más información', 'conoce más', 'entérate más',
  'descúbrelo', 'no te lo pierdas', 'aprovecha',
]

function countEmojis(text) {
  const matches = text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1F2FF}]|[\u{1F680}-\u{1F6FF}]/gu)
  return matches ? matches.length : 0
}

function countHashtags(text) {
  const matches = text.match(/#[A-Za-zÁÉÍÓÚÑáéíóúñ0-9_]+/g)
  return matches ? matches.length : 0
}

function wordCount(text) {
  return (text || '').split(/\s+/).filter(Boolean).length
}

// Similitud Jaccard sobre tokens únicos >3 chars
function similarity(a, b) {
  if (!a || !b) return 0
  const tok = s => new Set(s.toLowerCase().replace(/[^\wáéíóúñ\s]/g, ' ').split(/\s+/).filter(w => w.length > 3))
  const A = tok(a), B = tok(b)
  if (A.size === 0 || B.size === 0) return 0
  let inter = 0
  for (const t of A) if (B.has(t)) inter++
  return inter / (A.size + B.size - inter)
}

// Hash de las primeras 10 palabras (hook)
function hookHash(copy) {
  return (copy || '').split(/\s+/).slice(0, 10).join(' ').toLowerCase().replace(/[^\wáéíóúñ\s]/g, '')
}

// ═══════════════════════════════════════════════════════════
// REVISAR UN POST
// ═══════════════════════════════════════════════════════════

function reviewPost(post, grillaPosts, otrosClientesPosts, mes) {
  const copy = post.copy || ''
  const copyLower = copy.toLowerCase()
  const issues = []
  let score = 100

  // 1. ChatGPT-speak
  for (const frase of CHATGPT_SPEAK) {
    if (copyLower.includes(frase)) {
      issues.push({ tipo: 'chatgpt-speak', detalle: `Frase prohibida: "${frase}"`, peso: 20 })
      score -= 20
    }
  }

  // 2. Emoji stuffing
  const emojis = countEmojis(copy)
  if (emojis > 3) {
    issues.push({ tipo: 'emoji-stuffing', detalle: `${emojis} emojis (máximo 3)`, peso: 10 })
    score -= 10
  }

  // 3. Hashtag stuffing (en copy + hashtags field)
  const totalHashtags = countHashtags((post.hashtags || '') + ' ' + copy)
  if (totalHashtags > 8) {
    issues.push({ tipo: 'hashtag-stuffing', detalle: `${totalHashtags} hashtags (máximo 8)`, peso: 10 })
    score -= 10
  }

  // 4. Longitud fuera de rango
  const words = wordCount(copy)
  const isLinkedIn = (post.plataforma || '').includes('LinkedIn')
  const minW = isLinkedIn ? 80 : 50
  const maxW = isLinkedIn ? 280 : 200
  if (words < minW) {
    issues.push({ tipo: 'muy-corto', detalle: `${words} palabras (mínimo ${minW} para ${post.plataforma})`, peso: 15 })
    score -= 15
  } else if (words > maxW) {
    issues.push({ tipo: 'muy-largo', detalle: `${words} palabras (máximo ${maxW})`, peso: 15 })
    score -= 15
  }

  // 5. Repetición dentro de la misma grilla (jaccard >70%)
  const otrosDeGrilla = grillaPosts.filter(p => p.dia !== post.dia)
  for (const otro of otrosDeGrilla) {
    const sim = similarity(copy, otro.copy)
    if (sim > 0.7) {
      issues.push({ tipo: 'repeticion-cliente', detalle: `Similar ${Math.round(sim*100)}% al post del día ${otro.dia}`, peso: 25 })
      score -= 25
      break
    }
  }

  // 5b. Misma hook
  const miHook = hookHash(copy)
  if (miHook.length > 10) {
    for (const otro of otrosDeGrilla) {
      if (hookHash(otro.copy) === miHook) {
        issues.push({ tipo: 'hook-repetida', detalle: `Misma hook que post del día ${otro.dia}`, peso: 15 })
        score -= 15
        break
      }
    }
  }

  // 6. Copias entre clientes (similitud >75%)
  for (const otro of otrosClientesPosts) {
    const sim = similarity(copy, otro.copy)
    if (sim > 0.75) {
      issues.push({
        tipo: 'copia-cliente',
        detalle: `Muy similar ${Math.round(sim*100)}% a post de ${otro.clienteNombre}`,
        peso: 30
      })
      score -= 30
      break
    }
  }

  // 7. CTAs genéricos débiles
  for (const cta of CTAS_GENERICOS) {
    if (copyLower.includes(cta)) {
      issues.push({ tipo: 'cta-generico', detalle: `CTA débil: "${cta}"`, peso: 10 })
      score -= 10
      break
    }
  }

  // 8. Estacionalidad Chile (hemisferio sur)
  // Verano Chile: dic-feb. Otoño: mar-may. Invierno: jun-ago. Primavera: sep-nov.
  const mencionaVerano = /\bverano\b/.test(copyLower)
  const mencionaInvierno = /\binvierno\b/.test(copyLower)
  const mencionaPrimavera = /\bprimavera\b/.test(copyLower)
  const mencionaOtono = /\b(otoño|otono)\b/.test(copyLower)
  if (mencionaVerano && [4,5,6,7,8,9].includes(mes)) {
    issues.push({ tipo: 'estacionalidad', detalle: `Menciona "verano" en ${MESES[mes]} (Chile: otoño/invierno)`, peso: 30 })
    score -= 30
  }
  if (mencionaInvierno && [12,1,2,3].includes(mes)) {
    issues.push({ tipo: 'estacionalidad', detalle: `Menciona "invierno" en ${MESES[mes]} (Chile: verano)`, peso: 30 })
    score -= 30
  }
  if (mencionaPrimavera && [3,4,5,6,7,8].includes(mes)) {
    issues.push({ tipo: 'estacionalidad', detalle: `Menciona "primavera" en ${MESES[mes]} (Chile: otoño/invierno)`, peso: 30 })
    score -= 30
  }
  if (mencionaOtono && [9,10,11,12,1,2].includes(mes)) {
    issues.push({ tipo: 'estacionalidad', detalle: `Menciona "otoño" en ${MESES[mes]} (Chile: primavera/verano)`, peso: 30 })
    score -= 30
  }

  // 9. Especificidad — sin números ni nombres propios
  const hasNumbers = /\d/.test(copy)
  // Nombres propios: palabras con mayúscula inicial que no sean inicio de frase
  const propiosMatches = copy.match(/(?:[.!?]\s+|^)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*/g) || []
  const hasProperNouns = copy.match(/(?<!^)(?<![.!?]\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}/g) !== null
  if (!hasNumbers && !hasProperNouns) {
    issues.push({ tipo: 'sin-especificidad', detalle: 'Sin números, datos ni nombres propios', peso: 10 })
    score -= 10
  }

  // 10. Gramática básica
  if (/ {2,}/.test(copy)) {
    issues.push({ tipo: 'gramatica', detalle: 'Espacios dobles', peso: 5 })
    score -= 5
  }
  // Preguntas sin ¿ de apertura
  const preguntasSinApertura = (copy.match(/\?/g) || []).length - (copy.match(/¿/g) || []).length
  if (preguntasSinApertura > 0) {
    issues.push({ tipo: 'gramatica', detalle: `${preguntasSinApertura} pregunta(s) sin ¿ de apertura`, peso: 5 })
    score -= 5 * Math.min(preguntasSinApertura, 2)
  }
  // Exclamaciones sin ¡
  const exclSinApertura = (copy.match(/!/g) || []).length - (copy.match(/¡/g) || []).length
  if (exclSinApertura > 0) {
    issues.push({ tipo: 'gramatica', detalle: `${exclSinApertura} exclamación(es) sin ¡ de apertura`, peso: 5 })
    score -= 5 * Math.min(exclSinApertura, 2)
  }

  score = Math.max(0, score)
  return { score, issues, necesitaFix: score < SCORE_UMBRAL }
}

// ═══════════════════════════════════════════════════════════
// SUPABASE
// ═══════════════════════════════════════════════════════════

async function sbGet(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  })
  return res.ok ? res.json() : []
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=representation'
    },
    body: JSON.stringify(data)
  })
  return res.ok
}

// ═══════════════════════════════════════════════════════════
// OPENAI FIX — regenera 1 post con issues específicas
// ═══════════════════════════════════════════════════════════

async function fixPost(post, issues, clienteNombre, clienteRubro, briefing, mes, anio) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY no configurada')

  const issuesList = issues.map(i => `- ${i.tipo}: ${i.detalle}`).join('\n')
  const briefEstrategico = (briefing?.brief_estrategico || '').substring(0, 2000)
  const tono = briefing?.analisis_tono?.tono_general || briefing?.tono || 'profesional'
  const isLinkedIn = (post.plataforma || '').includes('LinkedIn')
  const minW = isLinkedIn ? 120 : 80

  const prompt = `Eres editor senior de una agencia de marketing en Chile. Vas a REGENERAR un post de redes sociales que fue rechazado por calidad.

=== CLIENTE ===
${clienteNombre} — ${clienteRubro}
Tono: ${tono}

${briefEstrategico ? `=== BRIEF ESTRATÉGICO ===\n${briefEstrategico}\n` : ''}

=== POST RECHAZADO ===
Plataforma: ${post.plataforma}
Tipo: ${post.tipo_post}
Fecha: día ${post.dia}, ${MESES[mes]} ${anio}
Copy original:
"${post.copy}"

=== PROBLEMAS DETECTADOS (CORREGIR TODOS) ===
${issuesList}

=== REGLAS ESTRICTAS PARA EL NUEVO COPY ===
- MÍNIMO ${minW} palabras, copy desarrollado y con sustancia
- PROHIBIDO: "en la era digital", "sabías que", "sumérgete", "desbloquea", "revoluciona", "descubre el poder", "transforma tu", "desata tu potencial", "más que nunca", "solución integral", "líder del mercado", "de vanguardia", "hoy en día", "cada vez más", "juega un papel", "sin lugar a dudas"
- PROHIBIDO: más de 3 emojis en el copy
- PROHIBIDO: más de 8 hashtags
- PROHIBIDO: CTAs genéricos ("contáctanos", "más información") sin contexto concreto
- Primera frase DEBE ser un gancho original: dato concreto, pregunta provocadora, escenario real o afirmación contraintuitiva
- Incluir al menos 1 número concreto, dato verificable o nombre propio
- Respetar estacionalidad Chile (hemisferio sur): en ${MESES[mes]} Chile está en ${estacionDeMes(mes)}
- Preguntas con ¿ de apertura, exclamaciones con ¡

Responde SOLO JSON válido:
{
  "copy": "nuevo copy completo, mínimo ${minW} palabras",
  "copy_grafica": "texto visual corto para la pieza",
  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5",
  "nota_interna": "instrucción breve para diseño"
}`

  await sleep(2000)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres editor senior de marketing digital. Solo respondes JSON válido. No usas muletillas ni frases vacías.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  const raw = data.choices?.[0]?.message?.content || ''

  // Extract JSON
  let parsed
  try { parsed = JSON.parse(raw) }
  catch {
    const m = raw.match(/\{[\s\S]*\}/)
    if (m) parsed = JSON.parse(m[0])
    else throw new Error('No se pudo parsear respuesta de OpenAI')
  }

  if (!parsed.copy || parsed.copy.length < 50) throw new Error('Copy regenerado muy corto')

  return {
    ...post,
    copy: parsed.copy,
    copy_grafica: parsed.copy_grafica || post.copy_grafica,
    hashtags: parsed.hashtags || post.hashtags,
    nota_interna: parsed.nota_interna || post.nota_interna,
  }
}

function estacionDeMes(mes) {
  if ([12,1,2].includes(mes)) return 'verano'
  if ([3,4,5].includes(mes)) return 'otoño'
  if ([6,7,8].includes(mes)) return 'invierno'
  return 'primavera'
}

// ═══════════════════════════════════════════════════════════
// EMAIL INFORME
// ═══════════════════════════════════════════════════════════

async function enviarInforme(resumen, mes, anio) {
  if (!RESEND_KEY) { console.log('⚠️  Sin RESEND_KEY, skip email'); return }

  const { total, clientes, posts, problemas, autoFixed, manualPending, topIssues, detalleClientes } = resumen

  const topIssuesHtml = Object.entries(topIssues)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tipo, count]) => {
      const pct = Math.round(count / problemas * 100) || 0
      return `<tr>
        <td style="padding:6px 10px;font-size:12px;">${tipo}</td>
        <td style="padding:6px 10px;font-size:12px;text-align:right;font-weight:700;">${count}</td>
        <td style="padding:6px 10px;"><div style="background:#e5e7eb;border-radius:4px;height:14px;width:100%;"><div style="background:#EF4444;height:100%;width:${pct}%;border-radius:4px;"></div></div></td>
      </tr>`
    }).join('')

  const tablaClientes = detalleClientes
    .sort((a,b) => a.scorePromedio - b.scorePromedio)
    .map(c => {
      const color = c.scorePromedio >= 85 ? '#059669' : c.scorePromedio >= 70 ? '#F59E0B' : '#DC2626'
      return `<tr>
        <td style="padding:7px 10px;font-size:12px;">${c.nombre}</td>
        <td style="padding:7px 10px;font-size:12px;text-align:center;">${c.postsTotal}</td>
        <td style="padding:7px 10px;font-size:12px;text-align:center;color:${c.conProblemas > 0 ? '#DC2626' : '#059669'};font-weight:700;">${c.conProblemas}</td>
        <td style="padding:7px 10px;font-size:12px;text-align:center;font-weight:800;color:${color};">${c.scorePromedio}</td>
        <td style="padding:7px 10px;font-size:12px;text-align:center;color:#059669;">${c.autoFixed || 0}</td>
        <td style="padding:7px 10px;font-size:12px;text-align:center;color:${c.manualPending > 0 ? '#DC2626' : '#94A3B8'};">${c.manualPending || 0}</td>
      </tr>`
    }).join('')

  const detalleManual = detalleClientes
    .filter(c => c.postsManual && c.postsManual.length > 0)
    .map(c => {
      const items = c.postsManual.map(p => `
        <div style="background:#FEF2F2;border-left:4px solid #DC2626;padding:12px 14px;margin:8px 0;border-radius:0 8px 8px 0;">
          <p style="margin:0 0 4px;font-size:12px;color:#991B1B;font-weight:700;">${p.plataforma} · día ${p.dia} · score ${p.score}</p>
          <p style="margin:0 0 8px;font-size:11px;color:#7F1D1D;line-height:1.5;"><strong>Issues:</strong> ${p.issues.map(i => i.tipo).join(', ')}</p>
          <p style="margin:0;font-size:11px;color:#1F2937;font-style:italic;">"${(p.copy || '').substring(0, 180)}..."</p>
        </div>`).join('')
      return `<h3 style="font-size:13px;color:#1E293B;margin:16px 0 4px;">${c.nombre}</h3>${items}`
    }).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#1E293B;">
<div style="max-width:680px;margin:0 auto;padding:24px 16px;">

  <div style="background:linear-gradient(135deg,#0A1628,#0055A4);padding:28px 32px;color:white;border-radius:12px 12px 0 0;">
    <p style="margin:0;font-size:11px;opacity:0.8;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Muller y Perez · Revisor de Grillas</p>
    <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;">Informe de Calidad — ${MESES[mes]} ${anio}</h1>
    <p style="margin:6px 0 0;font-size:12px;opacity:0.85;">Revisión heurística automática · ${clientes} clientes · ${total} grillas · ${posts} posts analizados</p>
  </div>

  <div style="background:white;padding:24px 32px;border:1px solid #E2E8F0;border-top:none;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td width="25%" style="padding:14px;background:#EFF6FF;border-radius:8px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#0055A4;line-height:1;">${posts}</div>
          <div style="font-size:9px;color:#64748B;text-transform:uppercase;margin-top:4px;letter-spacing:0.5px;">Posts revisados</div>
        </td>
        <td width="3%"></td>
        <td width="25%" style="padding:14px;background:${problemas > 0 ? '#FEF3C7' : '#D1FAE5'};border-radius:8px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:${problemas > 0 ? '#92400E' : '#065F46'};line-height:1;">${problemas}</div>
          <div style="font-size:9px;color:${problemas > 0 ? '#92400E' : '#065F46'};text-transform:uppercase;margin-top:4px;letter-spacing:0.5px;">Con problemas</div>
        </td>
        <td width="3%"></td>
        <td width="25%" style="padding:14px;background:#D1FAE5;border-radius:8px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#065F46;line-height:1;">${autoFixed}</div>
          <div style="font-size:9px;color:#065F46;text-transform:uppercase;margin-top:4px;letter-spacing:0.5px;">Auto-corregidos</div>
        </td>
        <td width="3%"></td>
        <td width="25%" style="padding:14px;background:${manualPending > 0 ? '#FEE2E2' : '#D1FAE5'};border-radius:8px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:${manualPending > 0 ? '#991B1B' : '#065F46'};line-height:1;">${manualPending}</div>
          <div style="font-size:9px;color:${manualPending > 0 ? '#991B1B' : '#065F46'};text-transform:uppercase;margin-top:4px;letter-spacing:0.5px;">Manual pendiente</div>
        </td>
      </tr>
    </table>

    ${Object.keys(topIssues).length > 0 ? `
    <h2 style="font-size:13px;color:#0055A4;margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E2E8F0;padding-bottom:6px;">Top issues detectados</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:8px;overflow:hidden;">
      ${topIssuesHtml}
    </table>` : ''}

    <h2 style="font-size:13px;color:#0055A4;margin:24px 0 10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E2E8F0;padding-bottom:6px;">Detalle por cliente</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:11px;">
      <thead>
        <tr style="background:#0A1628;color:white;">
          <th style="padding:8px 10px;text-align:left;font-size:10px;">Cliente</th>
          <th style="padding:8px 10px;text-align:center;font-size:10px;">Posts</th>
          <th style="padding:8px 10px;text-align:center;font-size:10px;">Issues</th>
          <th style="padding:8px 10px;text-align:center;font-size:10px;">Score</th>
          <th style="padding:8px 10px;text-align:center;font-size:10px;">Fixed</th>
          <th style="padding:8px 10px;text-align:center;font-size:10px;">Manual</th>
        </tr>
      </thead>
      <tbody>${tablaClientes}</tbody>
    </table>

    ${detalleManual ? `
    <h2 style="font-size:13px;color:#DC2626;margin:24px 0 10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #FEE2E2;padding-bottom:6px;">Posts que requieren revisión manual</h2>
    <p style="font-size:11px;color:#64748B;margin:0 0 10px;">Estos posts siguen con score bajo después de ${MAX_FIX_INTENTOS} intentos de auto-corrección.</p>
    ${detalleManual}` : ''}

    <p style="margin:30px 0 0;padding-top:16px;border-top:1px solid #E2E8F0;text-align:center;font-size:11px;color:#94A3B8;">
      Revisor automático · <a href="https://www.mulleryperez.cl/crm/grillas" style="color:#0055A4;text-decoration:none;font-weight:700;">Ver CRM Grillas →</a>
    </p>

  </div>
</div>
</body></html>`

  const subject = manualPending > 0
    ? `Grillas ${MESES[mes]} ${anio} — ${manualPending} post(s) requieren revisión manual`
    : `Grillas ${MESES[mes]} ${anio} — Revisión OK (${autoFixed} auto-corregidos)`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Muller y Perez <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      subject,
      html,
    })
  })
  if (res.ok) {
    const d = await res.json()
    console.log(`✉️  Informe enviado: ${d.id}`)
  } else {
    console.error(`❌ Error enviando informe: ${await res.text()}`)
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2)
  const mes = parseInt(args[0])
  const anio = parseInt(args[1])
  const doFix = args.includes('--fix')
  const clienteIdx = args.indexOf('--cliente')
  const soloCliente = clienteIdx >= 0 ? args[clienteIdx + 1] : null

  if (!mes || !anio) {
    console.log('Uso: node scripts/revisar-grillas.js <mes> <anio> [--fix] [--cliente <id>]')
    process.exit(1)
  }

  console.log('🔍 Revisor de Grillas — Muller y Perez')
  console.log('═══════════════════════════════════════')
  console.log(`   Mes: ${MESES[mes]} ${anio}`)
  console.log(`   Fix: ${doFix ? 'SÍ (auto-regenera con OpenAI)' : 'NO (solo informa)'}`)
  console.log(`   Cliente: ${soloCliente || 'todos'}`)
  if (doFix && !OPENAI_KEY) {
    console.error('❌ --fix requiere OPENAI_API_KEY')
    process.exit(1)
  }
  console.log('')

  // 1. Load all grillas for this month/year
  let query = `mes=eq.${mes}&anio=eq.${anio}&select=id,cliente_id,posts,estado`
  if (soloCliente) query += `&cliente_id=eq.${soloCliente}`
  const grillas = await sbGet('grillas_contenido', query)

  if (grillas.length === 0) {
    console.log(`⚠️  Sin grillas para ${MESES[mes]} ${anio}`)
    process.exit(0)
  }

  console.log(`📊 ${grillas.length} grilla(s) encontrada(s)\n`)

  // 2. Load clientes map
  const clienteIds = [...new Set(grillas.map(g => g.cliente_id))]
  const clientes = await sbGet('clientes', `id=in.(${clienteIds.join(',')})&select=id,nombre,rubro`)
  const clientesMap = Object.fromEntries(clientes.map(c => [c.id, c]))

  // 3. Build corpus of all posts across clients (for cross-client similarity)
  const allPostsCorpus = []
  for (const g of grillas) {
    const c = clientesMap[g.cliente_id]
    for (const p of (g.posts || [])) {
      if (p.copy) allPostsCorpus.push({ copy: p.copy, clienteId: g.cliente_id, clienteNombre: c?.nombre || '?' })
    }
  }

  // 4. Review each grilla
  const detalleClientes = []
  let totalPosts = 0
  let totalProblemas = 0
  let totalAutoFixed = 0
  let totalManual = 0
  const topIssues = {}

  for (const grilla of grillas) {
    const cliente = clientesMap[grilla.cliente_id]
    if (!cliente) continue
    console.log(`\n📋 ${cliente.nombre}`)

    const posts = grilla.posts || []
    if (posts.length === 0) { console.log('   (sin posts)'); continue }

    // Load briefing para el fix
    let briefing = null
    if (doFix) {
      const [b] = await sbGet('briefings_cliente', `cliente_id=eq.${grilla.cliente_id}`)
      briefing = b
    }

    const postsCorpusOtros = allPostsCorpus.filter(p => p.clienteId !== grilla.cliente_id)

    let postsFixed = 0
    let postsManualCliente = 0
    let scoresSuma = 0
    let conProblemas = 0
    const postsManual = []
    const updatedPosts = []

    for (const post of posts) {
      let currentPost = { ...post }
      let review = reviewPost(currentPost, posts, postsCorpusOtros, mes)
      totalPosts++

      // Intento de fix si aplica
      if (review.necesitaFix) {
        conProblemas++
        totalProblemas++
        for (const iss of review.issues) {
          topIssues[iss.tipo] = (topIssues[iss.tipo] || 0) + 1
        }

        if (doFix) {
          let intentos = 0
          while (review.necesitaFix && intentos < MAX_FIX_INTENTOS) {
            intentos++
            console.log(`   🔧 Post día ${currentPost.dia} score ${review.score} — fix intento ${intentos}...`)
            try {
              const fixed = await fixPost(currentPost, review.issues, cliente.nombre, cliente.rubro, briefing, mes, anio)
              currentPost = fixed
              review = reviewPost(currentPost, posts, postsCorpusOtros, mes)
              if (!review.necesitaFix) {
                console.log(`      ✅ Fixed — nuevo score ${review.score}`)
                postsFixed++
                totalAutoFixed++
                break
              } else {
                console.log(`      ⚠️  Score ${review.score} — aún con issues`)
              }
            } catch (e) {
              console.log(`      ❌ Error fix: ${e.message}`)
              break
            }
          }
          if (review.necesitaFix) {
            postsManualCliente++
            totalManual++
            postsManual.push({
              dia: currentPost.dia,
              plataforma: currentPost.plataforma,
              score: review.score,
              issues: review.issues,
              copy: currentPost.copy,
            })
          }
        } else {
          postsManualCliente++
          totalManual++
          postsManual.push({
            dia: currentPost.dia,
            plataforma: currentPost.plataforma,
            score: review.score,
            issues: review.issues,
            copy: currentPost.copy,
          })
        }
      }

      // Marcar calidad en el post
      currentPost._calidad = {
        score: review.score,
        issues: review.issues.map(i => ({ tipo: i.tipo, detalle: i.detalle })),
        revisado_at: new Date().toISOString(),
        intentos_fix: doFix && review.necesitaFix ? MAX_FIX_INTENTOS : (doFix ? 1 : 0),
      }
      scoresSuma += review.score
      updatedPosts.push(currentPost)
    }

    // Update grilla in Supabase con posts revisados (y fixed si aplica)
    if (doFix || updatedPosts.some(p => p._calidad)) {
      await sbUpdate('grillas_contenido', grilla.id, {
        posts: updatedPosts,
        updated_at: new Date().toISOString()
      })
    }

    const scorePromedio = Math.round(scoresSuma / posts.length)
    console.log(`   Score promedio: ${scorePromedio} · ${conProblemas}/${posts.length} con issues · ${postsFixed} fixed · ${postsManualCliente} manual`)

    detalleClientes.push({
      nombre: cliente.nombre,
      postsTotal: posts.length,
      conProblemas,
      scorePromedio,
      autoFixed: postsFixed,
      manualPending: postsManualCliente,
      postsManual,
    })
  }

  // 5. Resumen
  console.log('\n═══════════════════════════════════════')
  console.log(`📊 RESUMEN ${MESES[mes]} ${anio}`)
  console.log(`   Grillas: ${grillas.length}`)
  console.log(`   Posts revisados: ${totalPosts}`)
  console.log(`   Con problemas: ${totalProblemas}`)
  console.log(`   Auto-corregidos: ${totalAutoFixed}`)
  console.log(`   Manual pendiente: ${totalManual}`)

  // 6. Email informe
  await enviarInforme({
    total: grillas.length,
    clientes: detalleClientes.length,
    posts: totalPosts,
    problemas: totalProblemas,
    autoFixed: totalAutoFixed,
    manualPending: totalManual,
    topIssues,
    detalleClientes,
  }, mes, anio)

  console.log('\n✅ Revisor completado')
}

main().catch(e => {
  console.error('❌ Error fatal:', e.message)
  process.exit(1)
})
