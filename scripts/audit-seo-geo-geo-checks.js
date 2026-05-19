/**
 * AUDIT SEO + GEO — Checks GEO (Generative Engine Optimization)
 * Funciones para evaluar optimizacion para motores IA: ChatGPT, Claude, Gemini, Perplexity
 *
 * CommonJS — Node 18+ con fetch nativo
 */

const { AI_BOTS, THRESHOLDS } = require('./audit-seo-geo-config')

// ===========================================================================
// Helpers
// ===========================================================================

function result(name, score, maxScore, status, value, detail, recommendation) {
  return { name, score, maxScore, status, value, detail, recommendation }
}

/**
 * Busca recursivamente una propiedad en un schema (o array de schemas)
 */
function findInSchemas(schemas, property) {
  const found = []
  for (const s of schemas) {
    if (s[property]) found.push(s[property])
    // Buscar en mainEntity
    if (s.mainEntity) {
      const sub = Array.isArray(s.mainEntity) ? s.mainEntity : [s.mainEntity]
      for (const entity of sub) {
        if (entity[property]) found.push(entity[property])
      }
    }
    // Buscar en @graph
    if (s['@graph'] && Array.isArray(s['@graph'])) {
      for (const node of s['@graph']) {
        if (node[property]) found.push(node[property])
      }
    }
  }
  return found
}

function findSchemaByType(schemas, type) {
  const results = []
  for (const s of schemas) {
    const sType = Array.isArray(s['@type']) ? s['@type'] : [s['@type']]
    if (sType.includes(type)) results.push(s)
    // Buscar en @graph
    if (s['@graph'] && Array.isArray(s['@graph'])) {
      for (const node of s['@graph']) {
        const nType = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
        if (nType.includes(type)) results.push(node)
      }
    }
  }
  return results
}

// ===========================================================================
// GEO CHECKS
// ===========================================================================

/**
 * Busca knowsAbout en cualquier schema
 */
function checkKnowsAbout(schemas) {
  const name = 'knowsAbout (GEO)'
  const maxScore = 10
  const found = findInSchemas(schemas, 'knowsAbout')

  if (found.length === 0) {
    return result(name, 0, maxScore, 'error', null, 'No se encontro "knowsAbout" en ningun schema.', 'Agrega "knowsAbout" a tu schema Organization/ProfessionalService con un array de temas de expertise. Esto ayuda a ChatGPT/Gemini a entender en que es experto tu sitio.')
  }

  const items = Array.isArray(found[0]) ? found[0] : [found[0]]
  const count = items.length

  if (count >= 5) {
    return result(name, maxScore, maxScore, 'ok', { count, sample: items.slice(0, 5) }, `knowsAbout encontrado con ${count} items. Excelente cobertura de expertise.`, null)
  }
  const score = Math.round(maxScore * (count / 5))
  return result(name, score, maxScore, 'warn', { count, items }, `knowsAbout con solo ${count} item(s). Recomendado: 5+.`, 'Expande knowsAbout con mas areas de expertise para mayor visibilidad en IAs.')
}

/**
 * Busca isSimilarTo en cualquier schema
 */
function checkIsSimilarTo(schemas) {
  const name = 'isSimilarTo (GEO)'
  const maxScore = 5
  const found = findInSchemas(schemas, 'isSimilarTo')

  if (found.length === 0) {
    return result(name, 0, maxScore, 'warn', null, 'No se encontro "isSimilarTo" en ningun schema.', 'Agrega "isSimilarTo" para referenciar entidades similares/competidoras. Esto ayuda a las IAs a contextualizar tu negocio dentro de la industria.')
  }

  const items = Array.isArray(found[0]) ? found[0] : [found[0]]
  return result(name, maxScore, maxScore, 'ok', items, `isSimilarTo encontrado con ${items.length} referencia(s).`, null)
}

/**
 * Busca FAQPage con Question/Answer validos
 */
function checkFAQPage(schemas) {
  const name = 'FAQPage (GEO)'
  const maxScore = 10
  const faqSchemas = findSchemaByType(schemas, 'FAQPage')

  if (faqSchemas.length === 0) {
    return result(name, 0, maxScore, 'error', null, 'No se encontro schema FAQPage.', 'Agrega un schema FAQPage con preguntas y respuestas reales. Las IAs priorizan contenido en formato Q&A para respuestas directas.')
  }

  const faq = faqSchemas[0]
  const mainEntity = faq.mainEntity || []
  const questions = Array.isArray(mainEntity) ? mainEntity : [mainEntity]
  const validQAs = questions.filter(q => {
    const isQuestion = q['@type'] === 'Question'
    const hasName = !!q.name
    const hasAnswer = q.acceptedAnswer && q.acceptedAnswer.text
    return isQuestion && hasName && hasAnswer
  })

  if (validQAs.length === 0) {
    return result(name, 2, maxScore, 'error', { totalQuestions: questions.length, valid: 0 }, 'FAQPage encontrada pero sin Question/Answer validos.', 'Cada pregunta debe ser tipo "Question" con "name" y "acceptedAnswer" con "text".')
  }

  if (validQAs.length >= 5) {
    return result(name, maxScore, maxScore, 'ok', { totalQuestions: validQAs.length, sample: validQAs.slice(0, 3).map(q => q.name) }, `FAQPage con ${validQAs.length} Q&A validos. Excelente para citacion por IAs.`, null)
  }

  const score = Math.round(maxScore * (validQAs.length / 5))
  return result(name, score, maxScore, 'warn', { totalQuestions: validQAs.length }, `FAQPage con ${validQAs.length} Q&A. Recomendado: 5+ para mayor impacto.`, 'Agrega mas preguntas frecuentes relevantes al schema FAQPage.')
}

/**
 * Busca speakable en schemas
 */
function checkSpeakable(schemas) {
  const name = 'Speakable (GEO)'
  const maxScore = 5
  const found = findInSchemas(schemas, 'speakable')

  if (found.length === 0) {
    return result(name, 0, maxScore, 'warn', null, 'No se encontro "speakable" en ningun schema.', 'Agrega SpeakableSpecification con cssSelector apuntando al contenido clave. Esto optimiza para voice search y asistentes IA.')
  }

  const spec = found[0]
  const hasSelectors = spec.cssSelector || spec.xpath
  if (hasSelectors) {
    return result(name, maxScore, maxScore, 'ok', spec, 'Speakable configurado con selectores.', null)
  }
  return result(name, maxScore - 2, maxScore, 'warn', spec, 'Speakable presente pero sin selectores definidos.', 'Agrega cssSelector o xpath al SpeakableSpecification para indicar que contenido es apto para voz.')
}

/**
 * Verifica que robots.txt NO bloquee los 7 bots IA
 */
function checkAIBots(robotsTxt) {
  const name = 'AI Bots Access'
  const maxScore = 15
  if (!robotsTxt) {
    // Sin robots.txt = todos los bots tienen acceso (por defecto)
    return result(name, maxScore, maxScore, 'ok', { robotsTxt: null, blocked: [] }, 'Sin robots.txt — todos los bots IA tienen acceso por defecto.', null)
  }

  const lines = robotsTxt.split('\n').map(l => l.trim())
  const blocked = []

  // Parse robots.txt por User-agent blocks
  let currentAgents = []
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.startsWith('user-agent:')) {
      const agent = line.split(':')[1].trim()
      currentAgents.push(agent)
    } else if (lower.startsWith('disallow:') && lower.includes('/')) {
      // Check if current agents block any AI bot
      for (const bot of AI_BOTS) {
        if (currentAgents.some(a => a === bot || a === '*')) {
          // Si es * necesitamos verificar que no haya un Allow especifico para el bot
          if (currentAgents.includes('*') && !currentAgents.includes(bot)) {
            // Bloqueado por wildcard
            if (!blocked.includes(bot)) blocked.push(bot)
          } else if (currentAgents.includes(bot)) {
            if (!blocked.includes(bot)) blocked.push(bot)
          }
        }
      }
    } else if (line === '' || lower.startsWith('#')) {
      // Reset agents on empty line or comment
      if (line === '') currentAgents = []
    }
  }

  // Verificacion robusta: parsear por bloques User-agent
  // Un bot esta bloqueado si tiene "Disallow: /" (raiz exacta) sin un "Allow: /" que lo override
  const blockedRobust = []
  const blocks = robotsTxt.split(/\n\s*\n/) // separar por lineas vacias
  for (const block of blocks) {
    const blockLines = block.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
    const agents = blockLines.filter(l => l.toLowerCase().startsWith('user-agent:')).map(l => l.split(':').slice(1).join(':').trim())
    const rules = blockLines.filter(l => !l.toLowerCase().startsWith('user-agent:') && !l.toLowerCase().startsWith('sitemap:'))

    // Check if this block blocks root "/"
    const hasDisallowRoot = rules.some(r => /^disallow:\s*\/\s*$/i.test(r))
    const hasAllowRoot = rules.some(r => /^allow:\s*\/\s*$/i.test(r))
    const hasAllowSlash = rules.some(r => /^allow:\s*\//i.test(r))

    // Un bot esta bloqueado SOLO si tiene Disallow: / (exacta, no /api/) sin Allow: /
    if (hasDisallowRoot && !hasAllowRoot && !hasAllowSlash) {
      for (const bot of AI_BOTS) {
        if (agents.some(a => a === bot || a === '*')) {
          if (!blockedRobust.includes(bot)) blockedRobust.push(bot)
        }
      }
    }
  }

  const allBlocked = [...new Set([...blocked, ...blockedRobust])]

  if (allBlocked.length === 0) {
    return result(name, maxScore, maxScore, 'ok', { blocked: [], total: AI_BOTS.length }, `Ningun bot IA bloqueado. Los ${AI_BOTS.length} bots pueden acceder.`, null)
  }

  const pctBlocked = allBlocked.length / AI_BOTS.length
  const score = Math.round(maxScore * (1 - pctBlocked))
  const status = pctBlocked > 0.5 ? 'error' : 'warn'

  return result(name, score, maxScore, status, { blocked: allBlocked, allowed: AI_BOTS.filter(b => !allBlocked.includes(b)) }, `${allBlocked.length}/${AI_BOTS.length} bots IA bloqueados: ${allBlocked.join(', ')}.`, `Elimina las directivas Disallow para: ${allBlocked.join(', ')}. Bloquear bots IA reduce tu visibilidad en ChatGPT, Claude, Perplexity y Gemini.`)
}

/**
 * Verifica E-E-A-T: autor, fecha, about page, credentials
 */
function checkEEAT(html, schemas) {
  const name = 'E-E-A-T Signals'
  const maxScore = 10
  let score = 0
  const signals = []
  const missing = []

  // 1. Autor
  const hasAuthor = findInSchemas(schemas, 'author').length > 0
  const hasAuthorMeta = html.match(/<meta[^>]*name=["']author["'][^>]*>/i)
  if (hasAuthor || hasAuthorMeta) {
    score += 3
    signals.push('Autor identificado')
  } else {
    missing.push('Agrega autor (schema author o meta author)')
  }

  // 2. Fecha (datePublished o dateModified)
  const hasDate = findInSchemas(schemas, 'datePublished').length > 0 || findInSchemas(schemas, 'dateModified').length > 0
  const hasTimeMeta = html.match(/<time[^>]*datetime/i)
  if (hasDate || hasTimeMeta) {
    score += 2
    signals.push('Fecha de publicacion/modificacion')
  } else {
    missing.push('Agrega datePublished/dateModified al schema')
  }

  // 3. About page / Organization info
  const hasAbout = findSchemaByType(schemas, 'AboutPage').length > 0 ||
    findSchemaByType(schemas, 'Organization').length > 0 ||
    findSchemaByType(schemas, 'ProfessionalService').length > 0
  if (hasAbout) {
    score += 2
    signals.push('Informacion de organizacion/about')
  } else {
    missing.push('Agrega schema Organization o ProfessionalService')
  }

  // 4. Credentials / aggregateRating / reviews
  const hasRating = findInSchemas(schemas, 'aggregateRating').length > 0
  const hasReview = findInSchemas(schemas, 'review').length > 0
  if (hasRating || hasReview) {
    score += 2
    signals.push('Reviews/ratings presentes')
  } else {
    missing.push('Agrega aggregateRating o reviews al schema')
  }

  // 5. Contacto verificable
  const hasContact = findInSchemas(schemas, 'telephone').length > 0 ||
    findInSchemas(schemas, 'email').length > 0 ||
    findInSchemas(schemas, 'contactPoint').length > 0
  if (hasContact) {
    score += 1
    signals.push('Contacto verificable en schema')
  } else {
    missing.push('Agrega telephone/email al schema')
  }

  const status = score >= 8 ? 'ok' : (score >= 5 ? 'warn' : 'error')
  return result(name, score, maxScore, status, { signals, missing }, `E-E-A-T: ${signals.length}/5 senales presentes.${missing.length ? ' Falta: ' + missing.join('; ') + '.' : ''}`, missing.length ? 'Fortalece E-E-A-T para que las IAs consideren tu contenido como autoritativo y citable.' : null)
}

/**
 * Verifica dateModified < 6 meses
 */
function checkDateModified(schemas) {
  const name = 'Content Freshness (dateModified)'
  const maxScore = 5
  const dates = findInSchemas(schemas, 'dateModified')

  if (dates.length === 0) {
    return result(name, 0, maxScore, 'warn', null, 'No se encontro dateModified en ningun schema.', 'Agrega dateModified con la fecha de ultima actualizacion. Las IAs priorizan contenido fresco.')
  }

  const latestStr = dates.sort().reverse()[0]
  const latest = new Date(latestStr)

  if (isNaN(latest.getTime())) {
    return result(name, 1, maxScore, 'warn', latestStr, `dateModified encontrado pero formato invalido: "${latestStr}".`, 'Usa formato ISO 8601: YYYY-MM-DDTHH:mm:ss.')
  }

  const now = new Date()
  const monthsDiff = (now.getFullYear() - latest.getFullYear()) * 12 + (now.getMonth() - latest.getMonth())

  if (monthsDiff <= THRESHOLDS.dateModifiedMonths) {
    return result(name, maxScore, maxScore, 'ok', { date: latestStr, monthsAgo: monthsDiff }, `Contenido actualizado hace ${monthsDiff} mes(es). Dentro del umbral de ${THRESHOLDS.dateModifiedMonths} meses.`, null)
  }

  const score = Math.max(0, maxScore - Math.floor((monthsDiff - THRESHOLDS.dateModifiedMonths) / 3))
  return result(name, score, maxScore, 'error', { date: latestStr, monthsAgo: monthsDiff }, `Contenido desactualizado: ultima modificacion hace ${monthsDiff} meses (umbral: ${THRESHOLDS.dateModifiedMonths}).`, 'Actualiza el contenido y el dateModified. Las IAs bajan prioridad a contenido antiguo.')
}

/**
 * Evalua contenido para IA via OpenAI:
 * - Contenido respuesta directa (0-10)
 * - Estructura citable (0-8)
 * - Datos verificables (0-7)
 *
 * Requiere OPENAI_API_KEY en env
 */
async function checkContentForAI(bodyText) {
  const name = 'AI Content Quality (OpenAI)'
  const maxScore = 25
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return result(name, 0, maxScore, 'warn', null, 'OPENAI_API_KEY no configurada. No se pudo evaluar contenido para IA.', 'Configura OPENAI_API_KEY como variable de entorno para habilitar este check.')
  }

  // Limitar texto a ~3000 caracteres para no gastar tokens de mas
  const truncated = bodyText.substring(0, 3000)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: `Eres un evaluador experto en GEO (Generative Engine Optimization).
Evalua el siguiente texto web en 3 dimensiones para determinar que tan bien sera citado por motores de busqueda IA (ChatGPT, Gemini, Claude, Perplexity).

Responde SOLO con un JSON valido, sin markdown, sin backticks:
{
  "directAnswer": { "score": <0-10>, "reason": "<1 frase>" },
  "citableStructure": { "score": <0-8>, "reason": "<1 frase>" },
  "verifiableData": { "score": <0-7>, "reason": "<1 frase>" },
  "summary": "<1 frase resumen general>"
}

Criterios:
- directAnswer (0-10): El contenido responde preguntas de forma directa y concisa? Tiene formato pregunta-respuesta o definiciones claras?
- citableStructure (0-8): Tiene listas, datos numericos, comparaciones, pasos claros que una IA pueda extraer y citar?
- verifiableData (0-7): Incluye estadisticas, cifras, fechas, fuentes o datos concretos que una IA pueda verificar y confiar?`
          },
          {
            role: 'user',
            content: `Evalua este texto web:\n\n${truncated}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      return result(name, 0, maxScore, 'error', { status: response.status, error: errText }, `Error de OpenAI API (${response.status}).`, 'Verifica tu OPENAI_API_KEY y los limites de la cuenta.')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Parsear JSON de la respuesta
    let evaluation
    try {
      // Limpiar posibles backticks o whitespace
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      evaluation = JSON.parse(cleaned)
    } catch {
      return result(name, 0, maxScore, 'error', content, 'La respuesta de OpenAI no fue JSON valido.', 'Reintentar la evaluacion.')
    }

    const directAnswer = Math.min(10, Math.max(0, evaluation.directAnswer?.score || 0))
    const citableStructure = Math.min(8, Math.max(0, evaluation.citableStructure?.score || 0))
    const verifiableData = Math.min(7, Math.max(0, evaluation.verifiableData?.score || 0))
    const totalScore = directAnswer + citableStructure + verifiableData

    const status = totalScore >= 18 ? 'ok' : (totalScore >= 12 ? 'warn' : 'error')

    return result(name, totalScore, maxScore, status, {
      directAnswer: { score: directAnswer, max: 10, reason: evaluation.directAnswer?.reason },
      citableStructure: { score: citableStructure, max: 8, reason: evaluation.citableStructure?.reason },
      verifiableData: { score: verifiableData, max: 7, reason: evaluation.verifiableData?.reason },
      summary: evaluation.summary,
    }, `Calidad IA: ${totalScore}/${maxScore} — Respuesta directa ${directAnswer}/10, Estructura citable ${citableStructure}/8, Datos verificables ${verifiableData}/7. ${evaluation.summary || ''}`, totalScore < 18 ? 'Mejora el contenido: agrega respuestas directas, listas con datos numericos, estadisticas verificables y formato Q&A.' : null)
  } catch (err) {
    return result(name, 0, maxScore, 'error', err.message, `Error al llamar a OpenAI: ${err.message}`, 'Verifica conectividad y OPENAI_API_KEY.')
  }
}

// ===========================================================================
// Exports
// ===========================================================================
module.exports = {
  checkKnowsAbout,
  checkIsSimilarTo,
  checkFAQPage,
  checkSpeakable,
  checkAIBots,
  checkEEAT,
  checkDateModified,
  checkContentForAI,
  // Helpers para uso externo
  findInSchemas,
  findSchemaByType,
}
