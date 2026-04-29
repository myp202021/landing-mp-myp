// radar-reporte.js
// AGENTE REPORTE — El agente CLAVE que resume TODOS los demás
// Lee: competencia, brief, contenido, auditoría, benchmark, árbol, ads, guiones, ideas, aprendizajes
// Genera: resumen ejecutivo, acciones inteligentes, feedback para otros agentes
// Es el cerebro que conecta todo y aprende
// Costo: ~$0.04/run (1 call Claude Sonnet)
// Se llama desde radar-clipping.js al FINAL del pipeline (después de todos los agentes)

var fetch = require('node-fetch')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

async function generarReporte(contexto, supabase, suscripcionId) {
  console.log('\n   === AGENTE REPORTE INTELIGENTE ===')

  if (!ANTHROPIC_KEY) {
    console.log('   Sin ANTHROPIC_API_KEY_GRILLAS, saltando reporte')
    return null
  }

  var c = contexto || {}

  // Construir resumen de TODOS los agentes
  var agentesCtx = ''

  // 1. Competencia
  if (c.posts && c.posts.length > 0) {
    var empresas = {}
    c.posts.forEach(function(p) {
      var n = p.nombre || p.handle || '?'
      if (!empresas[n]) empresas[n] = { posts: 0, eng: 0 }
      empresas[n].posts++
      empresas[n].eng += (p.likes || 0) + (p.comments || 0)
    })
    agentesCtx += 'COMPETENCIA: ' + c.posts.length + ' posts de ' + Object.keys(empresas).length + ' empresas.\n'
    Object.keys(empresas).forEach(function(n) {
      agentesCtx += '  - ' + n + ': ' + empresas[n].posts + ' posts, avg ' + Math.round(empresas[n].eng / empresas[n].posts) + ' eng/post\n'
    })
  }

  // 2. Brief
  if (c.brief) {
    agentesCtx += '\nBRIEF: ' + (c.brief.propuesta_valor_unica || '').substring(0, 150) + '\n'
    if (c.brief.territorios_contenido) agentesCtx += '  Territorios: ' + (c.brief.territorios_contenido || []).length + '\n'
  }

  // 3. Contenido generado
  if (c.contenido && c.contenido.length > 0) {
    var totalCopies = c.contenido.reduce(function(s, co) { return s + (Array.isArray(co.datos) ? co.datos.length : 0) }, 0)
    var avgScore = 0; var nScores = 0
    c.contenido.forEach(function(co) { if (co.score_promedio > 0) { avgScore += co.score_promedio; nScores++ } })
    avgScore = nScores > 0 ? Math.round(avgScore / nScores) : 0
    agentesCtx += '\nCONTENIDO: ' + totalCopies + ' copies generados, score promedio ' + avgScore + '/100\n'
  }

  // 4. Auditoría
  if (c.auditoria) {
    agentesCtx += '\nAUDITORÍA: score ' + (c.auditoria.score_general || '?') + '/100\n'
    if (c.auditoria.resumen_ejecutivo) agentesCtx += '  ' + (c.auditoria.resumen_ejecutivo || '').substring(0, 200) + '\n'
    if (c.auditoria.top_3_acciones) {
      c.auditoria.top_3_acciones.forEach(function(a) {
        agentesCtx += '  Acción: [' + (a.prioridad || '?') + '] ' + (a.accion || '') + '\n'
      })
    }
  }

  // 5. Benchmark
  if (c.benchmark) {
    var bd = c.benchmark.datos || c.benchmark
    agentesCtx += '\nBENCHMARK: '
    if (bd.analisis_ia) agentesCtx += (typeof bd.analisis_ia === 'string' ? bd.analisis_ia : bd.analisis_ia.resumen_ejecutivo || '').substring(0, 200) + '\n'
    if (bd.content_gaps) agentesCtx += '  Gaps: ' + (bd.content_gaps || []).slice(0, 3).join(', ') + '\n'
  }

  // 6. Árbol
  if (c.arbol) {
    var ad = c.arbol.datos || c.arbol
    agentesCtx += '\nÁRBOL: ' + (ad.ramas || []).length + ' ramas, $' + ((ad.presupuesto_total || 0).toLocaleString()) + '\n'
    ;(ad.ramas || []).forEach(function(r) {
      agentesCtx += '  - ' + (r.nombre || '?') + ': ' + (r.porcentaje || '?') + '% ($' + ((r.presupuesto || 0).toLocaleString()) + ')\n'
    })
  }

  // 7. Ads Creative
  if (c.adsCreativos) {
    var acd = c.adsCreativos.datos || c.adsCreativos
    var gAds = (acd.google_ads || []).length
    var mAds = (acd.meta_ads || []).length
    agentesCtx += '\nADS CREATIVE: ' + gAds + ' grupos Google, ' + mAds + ' conjuntos Meta\n'
  }

  // 8. Guiones
  if (c.guiones && c.guiones.length > 0) {
    var totalGuiones = c.guiones.reduce(function(s, g) { return s + (Array.isArray(g.datos) ? g.datos.length : 1) }, 0)
    agentesCtx += '\nGUIONES: ' + totalGuiones + ' guiones generados\n'
  }

  // 9. Ideas
  if (c.ideas && c.ideas.length > 0) {
    var ideasPorEstado = {}
    c.ideas.forEach(function(i) { ideasPorEstado[i.estado || 'nueva'] = (ideasPorEstado[i.estado || 'nueva'] || 0) + 1 })
    agentesCtx += '\nIDEAS: ' + c.ideas.length + ' (' + Object.keys(ideasPorEstado).map(function(k) { return k + ':' + ideasPorEstado[k] }).join(', ') + ')\n'
  }

  // 10. Aprendizajes
  if (c.aprendizajes && c.aprendizajes.length > 0) {
    agentesCtx += '\nAPRENDIZAJES ACUMULADOS: ' + c.aprendizajes.length + '\n'
    c.aprendizajes.slice(0, 5).forEach(function(a) {
      agentesCtx += '  - [' + (a.tipo || '?') + '] ' + (a.aprendizaje || '') + '\n'
    })
  }

  // 11. Posts del cliente
  if (c.postsCliente && c.postsCliente.length > 0) {
    var clienteAvg = Math.round(c.postsCliente.reduce(function(s, p) { return s + (p.likes || 0) + (p.comments || 0) }, 0) / c.postsCliente.length)
    agentesCtx += '\nCLIENTE PROPIO: ' + c.postsCliente.length + ' posts, avg ' + clienteAvg + ' eng/post\n'
  }

  var perfil = c.perfil || {}
  var rubro = perfil.rubro || ''

  var prompt = 'Eres el DIRECTOR DE ESTRATEGIA de una agencia de performance marketing en Chile. '
    + 'Tu trabajo es leer TODO lo que generaron los otros agentes del sistema y producir un REPORTE EJECUTIVO con acciones inteligentes.\n\n'
    + 'CLIENTE: ' + (perfil.nombre || '?') + ' (' + rubro + ')\n\n'
    + '═══ DATOS DE TODOS LOS AGENTES ═══\n'
    + agentesCtx + '\n'
    + '═══ TAREA ═══\n'
    + 'Genera un REPORTE EJECUTIVO en JSON:\n\n'
    + '{\n'
    + '  "titulo": "Reporte de [mes] — [nombre cliente]",\n'
    + '  "resumen_ejecutivo": "5-6 oraciones. Estado general, qué va bien, qué va mal, qué hacer AHORA. Lenguaje simple, sin jerga.",\n'
    + '  "score_general": 0-100,\n'
    + '  "hallazgos_clave": [\n'
    + '    { "tipo": "positivo|negativo|neutro", "hallazgo": "Descripción concreta", "fuente": "qué agente lo detectó", "impacto": "alto|medio|bajo" }\n'
    + '  ],\n'
    + '  "acciones_inteligentes": [\n'
    + '    {\n'
    + '      "prioridad": 1,\n'
    + '      "area": "competencia|contenido|paid|organico|comercial",\n'
    + '      "accion": "Descripción concreta de qué hacer",\n'
    + '      "por_que": "Basado en qué dato de qué agente",\n'
    + '      "impacto_esperado": "Qué va a mejorar",\n'
    + '      "plazo": "esta semana|este mes|próximo mes"\n'
    + '    }\n'
    + '  ],\n'
    + '  "feedback_para_agentes": [\n'
    + '    { "agente": "brief|contenido|auditoria|benchmark|arbol|ads", "feedback": "Qué debería cambiar o mejorar este agente la próxima vez" }\n'
    + '  ],\n'
    + '  "kpis_seguimiento": [\n'
    + '    { "kpi": "Nombre", "valor_actual": "X", "meta": "Y", "tendencia": "subiendo|bajando|estable" }\n'
    + '  ],\n'
    + '  "prediccion_mes_siguiente": "Qué esperar el próximo mes basado en los datos actuales"\n'
    + '}\n\n'
    + 'REGLAS:\n'
    + '- Mínimo 3 hallazgos clave, mínimo 5 acciones inteligentes\n'
    + '- Cada acción debe citar el agente/dato que la justifica\n'
    + '- El feedback para agentes es CRÍTICO — mejora el sistema mes a mes\n'
    + '- Lenguaje simple, un dueño de empresa que NO sabe de marketing debe entender\n'
    + '- NO inventes datos — usa SOLO lo que proporcionaron los agentes\n'
    + '- Las acciones deben ser CONCRETAS con plazo y responsable implícito\n\n'
    + 'Responde SOLO JSON válido.'

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
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error('Claude reporte: HTTP ' + res.status)
    var data = await res.json()
    var raw = data.content[0].text || ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    var reporte = JSON.parse(raw)

    console.log('   Reporte: score ' + reporte.score_general + ', ' + (reporte.acciones_inteligentes || []).length + ' acciones, ' + (reporte.hallazgos_clave || []).length + ' hallazgos')

    // Guardar feedback para agentes como aprendizajes
    if (supabase && suscripcionId && reporte.feedback_para_agentes) {
      try {
        var memModule = require('./radar-memoria-persistente.js')
        for (var i = 0; i < reporte.feedback_para_agentes.length; i++) {
          var fb = reporte.feedback_para_agentes[i]
          await memModule.guardarAprendizaje(supabase, suscripcionId, 'reporte', 'insight', 'Feedback para ' + fb.agente + ': ' + fb.feedback, 0.6, { agente_target: fb.agente })
        }
        console.log('   Feedback para agentes guardado como aprendizajes')
      } catch (e) {}
    }

    // Guardar reporte en Supabase
    if (supabase && suscripcionId) {
      try {
        var ahora = new Date()
        await supabase.from('copilot_reportes').insert({
          suscripcion_id: suscripcionId,
          mes: ahora.getMonth() + 1,
          anio: ahora.getFullYear(),
          datos: reporte,
        })
        console.log('   Reporte guardado en copilot_reportes')
      } catch (e) { console.log('   Reporte save: ' + e.message) }
    }

    console.log('   === REPORTE COMPLETADO ===\n')
    return reporte
  } catch (e) {
    console.error('   Reporte error: ' + e.message)
    return null
  }
}

module.exports = { generarReporte: generarReporte }
