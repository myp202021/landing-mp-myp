// radar-auditoria.js
// AGENTE IA DE AUDITORÍA — analiza TODOS los datos del ecosistema Copilot
// Lee: posts competencia, posts cliente, benchmark, contenido, brief, árbol, aprendizajes
// Compara: vs industria, vs mes anterior, vs competencia
// Recomienda: acciones concretas por área
// Cambia cada mes porque se alimenta de data nueva
// Costo: ~$0.03/run (1 call OpenAI GPT-4o)

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY

// Benchmarks de industria para comparación
var BENCHMARKS = {
  'maquinaria': { engPerPost: 35, postsPerMonth: 12, commentRatio: 0.03, bestFormat: 'video', label: 'Maquinaria Industrial' },
  'inmobiliaria': { engPerPost: 45, postsPerMonth: 16, commentRatio: 0.04, bestFormat: 'carrusel', label: 'Inmobiliaria' },
  'tecnolog': { engPerPost: 55, postsPerMonth: 14, commentRatio: 0.05, bestFormat: 'carrusel', label: 'Tecnología' },
  'salud': { engPerPost: 65, postsPerMonth: 12, commentRatio: 0.04, bestFormat: 'reel', label: 'Salud' },
  'educaci': { engPerPost: 50, postsPerMonth: 15, commentRatio: 0.05, bestFormat: 'carrusel', label: 'Educación' },
  'gastrono': { engPerPost: 80, postsPerMonth: 18, commentRatio: 0.06, bestFormat: 'reel', label: 'Gastronomía' },
  'retail': { engPerPost: 40, postsPerMonth: 20, commentRatio: 0.03, bestFormat: 'imagen', label: 'Retail' },
  'turismo': { engPerPost: 70, postsPerMonth: 12, commentRatio: 0.05, bestFormat: 'reel', label: 'Turismo' },
  'constru': { engPerPost: 30, postsPerMonth: 10, commentRatio: 0.03, bestFormat: 'video', label: 'Construcción' },
  'transport': { engPerPost: 25, postsPerMonth: 8, commentRatio: 0.02, bestFormat: 'imagen', label: 'Transporte' },
  'default': { engPerPost: 40, postsPerMonth: 12, commentRatio: 0.04, bestFormat: 'carrusel', label: 'Promedio Chile' },
}

function getBenchmark(rubro) {
  var r = (rubro || '').toLowerCase()
  var keys = Object.keys(BENCHMARKS)
  for (var i = 0; i < keys.length; i++) {
    if (r.includes(keys[i])) return BENCHMARKS[keys[i]]
  }
  return BENCHMARKS['default']
}

async function generarAuditoria(posts, contenido, cuentas, supabase, suscripcionId, briefEstrategico, modo, postsCliente) {
  modo = modo || 'mensual'
  console.log('\n   === AUDITORÍA IA ===')

  posts = posts || []
  contenido = contenido || []
  postsCliente = postsCliente || []
  briefEstrategico = briefEstrategico || null

  // Extraer rubro del brief o cuentas
  var rubro = ''
  if (briefEstrategico && briefEstrategico.rubro) rubro = briefEstrategico.rubro
  if (!rubro && cuentas && cuentas.length > 0) {
    rubro = cuentas.filter(function(c) { return c.nombre }).map(function(c) { return c.nombre }).join(' ')
  }
  var bench = getBenchmark(rubro)

  // ═══ CALCULAR MÉTRICAS REALES ═══
  var nEmpresas = {}
  posts.forEach(function(p) { nEmpresas[p.nombre || p.handle || '?'] = true })
  var empresasCount = Object.keys(nEmpresas).length

  var totalEng = posts.reduce(function(s, p) { return s + (p.likes || 0) + (p.comments || 0) }, 0)
  var avgEngPerPost = posts.length > 0 ? Math.round(totalEng / posts.length) : 0
  var totalLikes = posts.reduce(function(s, p) { return s + (p.likes || 0) }, 0)
  var totalComments = posts.reduce(function(s, p) { return s + (p.comments || 0) }, 0)
  var commentRatio = totalLikes > 0 ? totalComments / totalLikes : 0

  // Formatos
  var formatos = {}
  posts.forEach(function(p) {
    var f = (p.type || p.tipo_post || 'post').toLowerCase()
    if (f.includes('video') || f.includes('reel')) f = 'reel/video'
    else if (f.includes('sidecar') || f.includes('carousel')) f = 'carrusel'
    else f = 'imagen/post'
    formatos[f] = (formatos[f] || 0) + 1
  })

  // Engagement por empresa
  var engPorEmpresa = {}
  posts.forEach(function(p) {
    var n = p.nombre || p.handle || '?'
    if (!engPorEmpresa[n]) engPorEmpresa[n] = { posts: 0, eng: 0 }
    engPorEmpresa[n].posts++
    engPorEmpresa[n].eng += (p.likes || 0) + (p.comments || 0)
  })

  // Métricas del cliente propio
  var clienteEng = 0
  var clienteAvg = 0
  if (postsCliente.length > 0) {
    clienteEng = postsCliente.reduce(function(s, p) { return s + (p.likes || 0) + (p.comments || 0) }, 0)
    clienteAvg = Math.round(clienteEng / postsCliente.length)
  }

  // Calidad copies generados
  var copiesScores = []
  contenido.forEach(function(c) {
    if (c.score_promedio > 0) copiesScores.push(c.score_promedio)
  })
  var avgCopyScore = copiesScores.length > 0 ? Math.round(copiesScores.reduce(function(s, v) { return s + v }, 0) / copiesScores.length) : 0

  // Cargar auditoría anterior para comparar
  var auditoriaAnterior = null
  if (supabase && suscripcionId) {
    try {
      var prevRes = await supabase.from('copilot_auditorias')
        .select('score_general, datos')
        .eq('suscripcion_id', suscripcionId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (prevRes.data && prevRes.data.length > 0) {
        auditoriaAnterior = prevRes.data[0]
      }
    } catch (e) {}
  }

  // Cargar aprendizajes
  var aprendizajes = []
  if (supabase && suscripcionId) {
    try {
      var apRes = await supabase.from('copilot_aprendizajes')
        .select('aprendizaje, confianza, tipo')
        .eq('suscripcion_id', suscripcionId)
        .eq('activo', true)
        .order('confianza', { ascending: false })
        .limit(5)
      aprendizajes = apRes.data || []
    } catch (e) {}
  }

  // ═══ GENERAR AUDITORÍA CON IA ═══
  if (!OPENAI_KEY) {
    console.log('   Sin OPENAI_API_KEY, generando auditoría básica')
    return generarAuditoriaBasica(posts, postsCliente, contenido, bench, avgEngPerPost, avgCopyScore, formatos, engPorEmpresa, supabase, suscripcionId, modo)
  }

  // Separar métricas por red
  var igPosts = posts.filter(function(p) { return (p.red || 'Instagram') === 'Instagram' })
  var liPosts = posts.filter(function(p) { return p.red === 'LinkedIn' })
  var avgEngIG = igPosts.length > 0 ? Math.round(igPosts.reduce(function(s, p) { return s + (p.likes||0) + (p.comments||0) }, 0) / igPosts.length) : 0
  var avgEngLI = liPosts.length > 0 ? Math.round(liPosts.reduce(function(s, p) { return s + (p.likes||0) + (p.comments||0) }, 0) / liPosts.length) : 0

  var empresasResumen = Object.keys(engPorEmpresa).map(function(n) {
    var e = engPorEmpresa[n]
    return n + ': ' + e.posts + ' posts, avg ' + Math.round(e.eng / e.posts) + ' eng/post'
  }).join('\n')

  var formatosStr = Object.keys(formatos).map(function(f) { return f + ': ' + formatos[f] }).join(', ')

  var prompt = 'Eres un AUDITOR DE MARKETING DIGITAL senior. Generas auditorías accionables, no reportes genéricos.\n\n'
    + 'DATOS REALES (no inventes nada, usa SOLO estos datos):\n\n'
    + 'INDUSTRIA: ' + bench.label + '\n'
    + 'BENCHMARK INDUSTRIA: ' + bench.engPerPost + ' eng/post, ' + bench.postsPerMonth + ' posts/mes, mejor formato: ' + bench.bestFormat + '\n\n'
    + 'COMPETENCIA (' + empresasCount + ' empresas, ' + posts.length + ' posts):\n'
    + empresasResumen + '\n\n'
    + '── DESGLOSE POR PLATAFORMA (OBLIGATORIO generar criterios separados) ──\n'
    + (igPosts.length > 0
      ? 'INSTAGRAM: ' + igPosts.length + ' posts, avg ' + avgEngIG + ' eng/post (benchmark industria: ' + bench.engPerPost + ')\n'
        + '  Ratio comentarios/likes IG: ' + (igPosts.reduce(function(s,p){return s+(p.comments||0)},0) > 0 ? (igPosts.reduce(function(s,p){return s+(p.comments||0)},0) / Math.max(1, igPosts.reduce(function(s,p){return s+(p.likes||0)},0)) * 100).toFixed(1) + '%' : 'sin datos') + '\n'
      : 'INSTAGRAM: sin posts de competencia\n')
    + (liPosts.length > 0
      ? 'LINKEDIN: ' + liPosts.length + ' posts, avg ' + avgEngLI + ' eng/post (benchmark LI B2B: 25-50 reactions)\n'
        + '  Ratio comentarios/reacciones LI: ' + (liPosts.reduce(function(s,p){return s+(p.comments||0)},0) > 0 ? (liPosts.reduce(function(s,p){return s+(p.comments||0)},0) / Math.max(1, liPosts.reduce(function(s,p){return s+(p.likes||0)},0)) * 100).toFixed(1) + '%' : 'sin datos') + '\n'
      : 'LINKEDIN: sin posts de competencia\n')
    + '\nFormatos: ' + formatosStr + '\n\n'
    + (postsCliente.length > 0 ? 'CLIENTE PROPIO: ' + postsCliente.length + ' posts, avg ' + clienteAvg + ' eng/post (vs competencia: ' + avgEngPerPost + ')\n\n' : '')
    + (avgCopyScore > 0 ? 'CONTENIDO GENERADO: score promedio ' + avgCopyScore + '/100\n\n' : '')
    + (briefEstrategico ? 'BRIEF: ' + (briefEstrategico.propuesta_valor_unica || '').substring(0, 200) + '\n' : '')
    + (auditoriaAnterior ? 'AUDITORÍA ANTERIOR: score ' + auditoriaAnterior.score_general + '/100\n' : '')
    + (aprendizajes.length > 0 ? 'APRENDIZAJES: ' + aprendizajes.map(function(a) { return a.aprendizaje }).join('; ').substring(0, 300) + '\n' : '')
    + '\nGENERA UNA AUDITORÍA en JSON con esta estructura:\n'
    + '{\n'
    + '  "score_general": 0-100,\n'
    + '  "resumen_ejecutivo": "3-4 oraciones. Qué está pasando, qué está bien, qué está mal, qué hacer primero.",\n'
    + '  "criterios": [\n'
    + '    {\n'
    + '      "nombre": "Nombre del criterio",\n'
    + '      "score": 0-10,\n'
    + '      "dato": "El número real (ej: 42 eng/post)",\n'
    + '      "benchmark": "El benchmark de la industria (ej: 35 eng/post para Maquinaria)",\n'
    + '      "comparacion": "X% sobre/bajo el benchmark",\n'
    + '      "explicacion": "Qué significa este dato en lenguaje simple. Por qué importa.",\n'
    + '      "accion": "Qué hacer concretamente para mejorar este criterio. 1 acción específica.",\n'
    + '      "fuente": "competencia|cliente|copies|brief|industria"\n'
    + '    }\n'
    + '  ],\n'
    + '  "top_3_acciones": [\n'
    + '    { "prioridad": "URGENTE|IMPORTANTE|MEJORA", "accion": "Descripción concreta", "impacto_esperado": "Qué va a mejorar y en cuánto" }\n'
    + '  ],\n'
    + '  "vs_mes_anterior": "Subió/bajó/estable + por qué (si hay datos anteriores)",\n'
    + '  "fortaleza_principal": "Lo mejor que tiene el cliente/competencia",\n'
    + '  "debilidad_principal": "Lo peor, con acción para resolverlo"\n'
    + '}\n\n'
    + 'REGLAS:\n'
    + '- Mínimo 8 criterios, máximo 12\n'
    + '- Si hay datos de AMBAS redes (IG + LinkedIn), OBLIGATORIO incluir criterios SEPARADOS:\n'
    + '  * "Engagement Instagram" con benchmark de IG\n'
    + '  * "Engagement LinkedIn" con benchmark de LI (distinto: LI mide reacciones, no likes)\n'
    + '  * "Frecuencia Instagram" vs "Frecuencia LinkedIn"\n'
    + '  * "Formatos Instagram" (reel>carrusel>post) vs "Formatos LinkedIn" (artículo>carrusel>post)\n'
    + '- CADA criterio DEBE tener dato real, benchmark, comparación y acción\n'
    + '- Las acciones deben ser CONCRETAS (no "mejorar contenido" sino "publicar 2 reels/semana con formato X")\n'
    + '- Si el dato del cliente está sobre el benchmark: explicar por qué y cómo mantenerlo\n'
    + '- Si está bajo: explicar qué hacer para subirlo con número meta\n'
    + '- El resumen ejecutivo debe ser útil para alguien que NO sabe de marketing\n'
    + '- NUNCA inventar datos. Si no hay datos de algo, decir "sin datos" no inventar un número\n'
    + '- Cada criterio DEBE incluir "fuente" indicando de dónde viene el dato\n\n'
    + 'Responde SOLO JSON válido.'

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.4,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error('OpenAI auditoria: HTTP ' + res.status)
    var data = await res.json()
    var parsed = JSON.parse(data.choices[0].message.content)

    console.log('   Auditoría IA: score ' + parsed.score_general + '/100, ' + (parsed.criterios || []).length + ' criterios, ' + (parsed.top_3_acciones || []).length + ' acciones')

    // Guardar
    if (supabase && suscripcionId) {
      var ahora = new Date()
      var guardar = modo === 'mensual'
      if (modo === 'semanal') {
        try {
          var existeRes = await supabase.from('copilot_auditorias').select('id', { count: 'exact', head: true }).eq('suscripcion_id', suscripcionId).eq('mes', ahora.getMonth() + 1).eq('anio', ahora.getFullYear())
          guardar = (existeRes.count || 0) === 0
        } catch (e) { guardar = false }
      }
      if (guardar) {
        try {
          // Buscar si ya existe para este mes — si existe, actualizar
          var existeCheck = await supabase.from('copilot_auditorias')
            .select('id')
            .eq('suscripcion_id', suscripcionId)
            .eq('mes', ahora.getMonth() + 1)
            .eq('anio', ahora.getFullYear())
            .limit(1)
          if (existeCheck.data && existeCheck.data.length > 0) {
            await supabase.from('copilot_auditorias')
              .update({ score_general: parsed.score_general, datos: parsed })
              .eq('id', existeCheck.data[0].id)
            console.log('   Auditoría actualizada (existía)')
          } else {
            await supabase.from('copilot_auditorias').insert({
              suscripcion_id: suscripcionId,
              mes: ahora.getMonth() + 1,
              anio: ahora.getFullYear(),
              score_general: parsed.score_general,
              datos: parsed,
            })
            console.log('   Auditoría guardada (nueva)')
          }
        } catch (e) { console.log('   Auditoría save error: ' + e.message) }
      }
    }

    // Guardar aprendizajes de la auditoría
    if (supabase && suscripcionId && parsed.debilidad_principal) {
      try {
        var memModule = require('./radar-memoria-persistente.js')
        await memModule.guardarAprendizaje(supabase, suscripcionId, 'auditoria', 'alerta', 'Debilidad: ' + parsed.debilidad_principal, 0.5, { score: parsed.score_general })
      } catch (e) {}
    }

    console.log('   === AUDITORÍA IA COMPLETADA ===\n')
    return parsed
  } catch (e) {
    console.error('   Auditoría IA error: ' + e.message)
    return generarAuditoriaBasica(posts, postsCliente, contenido, bench, avgEngPerPost, avgCopyScore, formatos, engPorEmpresa, supabase, suscripcionId, modo)
  }
}

// Fallback sin IA
function generarAuditoriaBasica(posts, postsCliente, contenido, bench, avgEng, avgCopyScore, formatos, engPorEmpresa, supabase, suscripcionId, modo) {
  var criterios = [
    { nombre: 'Engagement vs industria', score: avgEng >= bench.engPerPost ? 8 : avgEng >= bench.engPerPost * 0.7 ? 6 : 4, dato: avgEng + ' eng/post', benchmark: bench.engPerPost + ' eng/post (' + bench.label + ')', comparacion: Math.round(((avgEng - bench.engPerPost) / bench.engPerPost) * 100) + '%', explicacion: 'Engagement = likes + comentarios por post. Mide cuánto interactúa la audiencia.', accion: avgEng < bench.engPerPost ? 'Testear reels y carruseles que tienen 2-3x más engagement.' : 'Mantener esta línea.', fuente: 'competencia' },
    { nombre: 'Frecuencia publicación', score: posts.length >= bench.postsPerMonth * Object.keys(engPorEmpresa).length ? 8 : 5, dato: posts.length + ' posts totales', benchmark: bench.postsPerMonth + ' posts/mes por empresa', explicacion: 'Cuánto publica la competencia.', accion: 'Igualar frecuencia del competidor más activo.', fuente: 'competencia' },
    { nombre: 'Variedad de formatos', score: Object.keys(formatos).length >= 3 ? 8 : 5, dato: Object.keys(formatos).join(', '), benchmark: 'Mínimo 3 formatos', explicacion: 'Diversificar formatos mejora alcance.', accion: 'Agregar ' + bench.bestFormat + ' si no se usa.', fuente: 'competencia' },
  ]
  if (avgCopyScore > 0) {
    criterios.push({ nombre: 'Calidad copies generados', score: avgCopyScore >= 85 ? 9 : avgCopyScore >= 70 ? 7 : 5, dato: avgCopyScore + '/100', benchmark: '85/100 excelente', explicacion: 'Score del QA automático.', accion: 'Revisar copies con score < 75.', fuente: 'copies' })
  }

  var scoreGeneral = Math.round(criterios.reduce(function(s, c) { return s + c.score }, 0) / criterios.length * 10)

  return { score_general: scoreGeneral, criterios: criterios, resumen_ejecutivo: 'Auditoría básica sin IA. ' + posts.length + ' posts analizados.', top_3_acciones: [], fortaleza_principal: '', debilidad_principal: '' }
}

module.exports = { generarAuditoria: generarAuditoria }
