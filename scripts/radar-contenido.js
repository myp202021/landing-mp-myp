// radar-contenido.js
// Pipeline de contenido sugerido: OpenAI analiza → Claude crea → OpenAI revisa
// Se llama desde radar-clipping.js en modo semanal/mensual
// Requiere: OPENAI_API_KEY, ANTHROPIC_API_KEY_GRILLAS

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY
var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

// Palabras prohibidas (ChatGPT speak)
var PALABRAS_PROHIBIDAS = [
  'en el vertiginoso', 'no es solo', 'en la era digital', 'sin lugar a dudas',
  'es importante destacar', 'cabe mencionar', 'en este sentido', 'paradigma',
  'sinergia', 'holistic', 'en un mundo cada vez', 'potenciar al maximo',
  'es fundamental', 'en definitiva', 'a modo de conclusion',
  'revolucionando', 'transformando el panorama', 'de vanguardia',
]

// ═══════════════════════════════════════════════
// PASO 1: OpenAI analiza y genera briefs
// ═══════════════════════════════════════════════
async function paso1_analizar(posts, empresas, modo) {
  console.log('   CONTENIDO PASO 1: OpenAI analiza...')

  var postsSummary = posts.slice(0, 40).map(function(p) {
    return '[' + p.red + '] ' + (p.nombre || p.handle) + ': "' + p.texto.substring(0, 100) + '" (' + p.likes + ' likes, ' + p.type + ')'
  }).join('\n')

  var empresasStr = Object.keys(empresas).join(', ')

  var prompt = 'Eres un estratega de contenido digital para empresas B2B en Chile. '
    + 'Analiza estos posts de la competencia de la industria de RRHH y control de asistencia.\n\n'
    + 'POSTS DE LA SEMANA:\n' + postsSummary + '\n\n'
    + 'EMPRESAS MONITOREADAS: ' + empresasStr + '\n\n'
    + 'TAREA: Genera exactamente 3 briefs de contenido para que el cliente (la empresa que contrata Radar) publique esta semana. '
    + 'Cada brief debe ser distinto en angulo y plataforma.\n\n'
    + 'Para cada brief incluye:\n'
    + '- plataforma: Instagram|LinkedIn|Facebook\n'
    + '- tipo: Reel|Carrusel|Post|Imagen|Articulo|Video\n'
    + '- angulo: educativo|comercial|caso_exito|estacional|diferenciacion|objecion\n'
    + '- objetivo: awareness|engagement|conversion|posicionamiento\n'
    + '- titulo: titulo del post (maximo 15 palabras)\n'
    + '- justificacion: por que este contenido, basado en datos reales de los posts analizados (maximo 2 oraciones)\n'
    + '- instrucciones_copy: que tono usar, que incluir, que evitar (para el copywriter)\n\n'
    + 'Responde SOLO en JSON valido: {"briefs": [{plataforma, tipo, angulo, objetivo, titulo, justificacion, instrucciones_copy}, ...]}\n'
    + 'No inventes datos ni porcentajes. Usa solo lo que esta en los posts de arriba.'

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error('OpenAI paso1: HTTP ' + res.status)
    var data = await res.json()
    var content = data.choices[0].message.content
    var parsed = JSON.parse(content)
    var briefs = parsed.briefs || []
    console.log('   PASO 1 OK: ' + briefs.length + ' briefs generados')
    return briefs
  } catch (e) {
    console.error('   PASO 1 ERROR: ' + e.message)
    return []
  }
}

// ═══════════════════════════════════════════════
// PASO 2: Claude crea copies completos
// ═══════════════════════════════════════════════
async function paso2_crear(briefs, posts) {
  console.log('   CONTENIDO PASO 2: Claude crea copies...')
  var copies = []

  for (var i = 0; i < briefs.length; i++) {
    var brief = briefs[i]
    console.log('   Copy ' + (i+1) + ': ' + brief.plataforma + ' ' + brief.tipo + ' - ' + brief.titulo)

    var contextPosts = posts.slice(0, 10).map(function(p) {
      return (p.nombre || p.handle) + ' publico: "' + p.texto.substring(0, 80) + '"'
    }).join('\n')

    var prompt = 'Eres un copywriter senior especializado en redes sociales B2B para empresas chilenas. '
      + 'Escribes en espanol chileno profesional: directo, sin rodeos, sin ChatGPT speak, sin frases cliche.\n\n'
      + 'BRIEF:\n'
      + '- Plataforma: ' + brief.plataforma + '\n'
      + '- Tipo de post: ' + brief.tipo + '\n'
      + '- Angulo: ' + brief.angulo + '\n'
      + '- Objetivo: ' + brief.objetivo + '\n'
      + '- Titulo: ' + brief.titulo + '\n'
      + '- Justificacion: ' + brief.justificacion + '\n'
      + '- Instrucciones: ' + brief.instrucciones_copy + '\n\n'
      + 'CONTEXTO (posts reales de la competencia esta semana):\n' + contextPosts + '\n\n'
      + 'REGLAS:\n'
      + '- Copy de minimo 150 palabras para LinkedIn, 100 para Instagram, 80 para Facebook\n'
      + '- Si es Carrusel: escribe el contenido de cada slide (minimo 5 slides)\n'
      + '- Si es Reel: escribe el guion con texto en pantalla\n'
      + '- Incluye hashtags relevantes (5-8)\n'
      + '- Incluye CTA claro\n'
      + '- NO uses: "en el vertiginoso", "no es solo", "es fundamental", "sin lugar a dudas", "paradigma", "sinergia"\n'
      + '- NO inventes estadisticas ni porcentajes sin fuente\n'
      + '- Escribe como si fueras el community manager de la empresa, no como un robot\n\n'
      + 'Responde SOLO el copy listo para publicar. Nada mas.'

    try {
      var res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) {
        var errText = await res.text()
        throw new Error('Claude paso2: HTTP ' + res.status + ' ' + errText.substring(0, 200))
      }
      var data = await res.json()
      var copy = data.content[0].text || ''
      copies.push({
        plataforma: brief.plataforma,
        tipo: brief.tipo,
        angulo: brief.angulo,
        objetivo: brief.objetivo,
        titulo: brief.titulo,
        justificacion: brief.justificacion,
        copy: copy,
        palabras: copy.split(/\s+/).length,
      })
      console.log('   Copy ' + (i+1) + ' OK: ' + copy.split(/\s+/).length + ' palabras')
    } catch (e) {
      console.error('   Copy ' + (i+1) + ' ERROR: ' + e.message)
      copies.push({
        plataforma: brief.plataforma, tipo: brief.tipo, angulo: brief.angulo,
        objetivo: brief.objetivo, titulo: brief.titulo, justificacion: brief.justificacion,
        copy: '(Error generando copy. Se reintentara en el proximo informe.)',
        palabras: 0, error: true,
      })
    }
  }
  console.log('   PASO 2 OK: ' + copies.length + ' copies creados')
  return copies
}

// ═══════════════════════════════════════════════
// PASO 3: OpenAI revisa calidad (QA)
// ═══════════════════════════════════════════════
async function paso3_revisar(copies) {
  console.log('   CONTENIDO PASO 3: OpenAI revisa calidad...')
  var revisados = []

  for (var i = 0; i < copies.length; i++) {
    var c = copies[i]
    if (c.error) { revisados.push(c); continue }

    // Check basico local
    var score = 100
    var problemas = []

    // Largo minimo
    if (c.plataforma === 'LinkedIn' && c.palabras < 120) { score -= 20; problemas.push('Muy corto para LinkedIn (min 120 pal)') }
    if (c.plataforma === 'Instagram' && c.palabras < 80) { score -= 15; problemas.push('Muy corto para Instagram (min 80 pal)') }
    if (c.plataforma === 'Facebook' && c.palabras < 60) { score -= 10; problemas.push('Muy corto para Facebook (min 60 pal)') }

    // Palabras prohibidas
    var copyLower = c.copy.toLowerCase()
    PALABRAS_PROHIBIDAS.forEach(function(palabra) {
      if (copyLower.includes(palabra)) {
        score -= 10
        problemas.push('ChatGPT speak: "' + palabra + '"')
      }
    })

    // Sin hashtags
    if (!c.copy.includes('#')) { score -= 5; problemas.push('Sin hashtags') }

    // Si score < 70, pedir a OpenAI que corrija
    if (score < 70 && OPENAI_KEY) {
      console.log('   Copy ' + (i+1) + ' score=' + score + ', corrigiendo con OpenAI...')
      try {
        var fixPrompt = 'Este copy tiene problemas: ' + problemas.join(', ') + '.\n\n'
          + 'COPY ORIGINAL:\n' + c.copy + '\n\n'
          + 'CORRIGE los problemas manteniendo el mensaje. '
          + 'Elimina frases cliche, agrega hashtags si faltan, extiende si es muy corto. '
          + 'Responde SOLO con el copy corregido.'

        var res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 800,
            messages: [{ role: 'user', content: fixPrompt }],
          }),
        })
        if (res.ok) {
          var data = await res.json()
          c.copy = data.choices[0].message.content || c.copy
          c.palabras = c.copy.split(/\s+/).length
          c.fixed = true
          score = Math.min(score + 20, 85)
          console.log('   Copy ' + (i+1) + ' corregido, nuevo score=' + score)
        }
      } catch (e) { console.error('   Fix error: ' + e.message) }
    }

    c.score = score
    c.problemas = problemas
    if (score >= 70) {
      console.log('   Copy ' + (i+1) + ' APROBADO (score=' + score + ')')
    } else {
      console.log('   Copy ' + (i+1) + ' BAJO (score=' + score + ') pero se incluye con advertencia')
    }
    revisados.push(c)
  }

  var avgScore = revisados.reduce(function(s, c) { return s + (c.score || 0) }, 0) / (revisados.length || 1)
  console.log('   PASO 3 OK: score promedio=' + Math.round(avgScore))
  return revisados
}

// ═══════════════════════════════════════════════
// FUNCION PRINCIPAL (llamada desde radar-clipping.js)
// ═══════════════════════════════════════════════
async function generarContenidoSugerido(posts, empresas, modo) {
  console.log('\n   === PIPELINE CONTENIDO SUGERIDO ===')

  if (!OPENAI_KEY || !ANTHROPIC_KEY) {
    console.log('   Faltan API keys, saltando pipeline')
    return []
  }

  if (posts.length < 2) {
    console.log('   Pocos posts (' + posts.length + '), saltando pipeline')
    return []
  }

  // Paso 1: OpenAI analiza
  var briefs = await paso1_analizar(posts, empresas, modo)
  if (briefs.length === 0) {
    console.log('   Sin briefs, abortando pipeline')
    return []
  }

  // Paso 2: Claude crea
  var copies = await paso2_crear(briefs, posts)
  if (copies.length === 0) {
    console.log('   Sin copies, abortando pipeline')
    return []
  }

  // Paso 3: OpenAI revisa
  var revisados = await paso3_revisar(copies)

  console.log('   === PIPELINE COMPLETADO: ' + revisados.length + ' copies ===\n')
  return revisados
}

module.exports = { generarContenidoSugerido: generarContenidoSugerido }
