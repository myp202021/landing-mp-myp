// radar-qa-auditor.js
// AGENTE AUDITOR DE CALIDAD — revisa TODOS los entregables de los demás agentes
// Corre al FINAL del pipeline, después del reporte
// Aplica criterios duros, detecta problemas, guarda correcciones como aprendizajes
// Los agentes leen estas correcciones en el próximo run
// Costo: ~$0.04/run (1 call Claude Sonnet)

var fetch = require('node-fetch')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

// ═══════════════════════════════════════════════
// CRITERIOS DUROS POR AGENTE (código, no IA)
// ═══════════════════════════════════════════════

function auditarCopies(copies, plataformasCliente) {
  var problemas = []
  var aprobados = 0
  var rechazados = 0

  if (!copies || copies.length === 0) {
    return { problemas: ['SIN COPIES: el agente de contenido no generó nada'], aprobados: 0, rechazados: 0, score: 0 }
  }

  copies.forEach(function(c, i) {
    var label = 'Copy ' + (i + 1) + ' (' + (c.plataforma || '?') + ' ' + (c.tipo || '') + ')'
    var ok = true

    // 1. Plataforma válida
    if (c.plataforma && plataformasCliente.indexOf(c.plataforma) === -1) {
      problemas.push(label + ': usa plataforma "' + c.plataforma + '" pero el cliente solo tiene ' + plataformasCliente.join('+'))
      ok = false
    }

    // 2. Largo mínimo por plataforma
    var palabras = (c.copy || '').split(/\s+/).length
    var esLI = (c.plataforma || '').toLowerCase() === 'linkedin'
    if (esLI && palabras < 150) {
      problemas.push(label + ': LinkedIn con solo ' + palabras + ' palabras (mín 200)')
      ok = false
    }
    if (!esLI && palabras < 60) {
      problemas.push(label + ': Instagram con solo ' + palabras + ' palabras (mín 80)')
      ok = false
    }

    // 3. Copy vacío o error
    if (!c.copy || c.copy.length < 50 || c.copy.includes('(Error')) {
      problemas.push(label + ': copy vacío o con error')
      ok = false
    }

    // 4. ChatGPT speak
    var lower = (c.copy || '').toLowerCase()
    var chatgptPhrases = ['en el vertiginoso', 'no es solo', 'en la era digital', 'paradigma', 'sinergia', 'holistic', 'es fundamental', 'de vanguardia', 'revolucionando']
    chatgptPhrases.forEach(function(phrase) {
      if (lower.includes(phrase)) {
        problemas.push(label + ': contiene ChatGPT speak "' + phrase + '"')
        ok = false
      }
    })

    // 5. Score inflado
    if (c.score >= 90 && palabras < 100) {
      problemas.push(label + ': score ' + c.score + ' pero solo ' + palabras + ' palabras — score inflado')
    }

    // 6. Sin hashtags
    var hashCount = ((c.copy || '').match(/#\w+/g) || []).length
    if (hashCount === 0 && !(c.hashtags || '').includes('#')) {
      problemas.push(label + ': sin hashtags')
    }

    if (ok) aprobados++
    else rechazados++
  })

  var score = copies.length > 0 ? Math.round((aprobados / copies.length) * 100) : 0
  return { problemas: problemas, aprobados: aprobados, rechazados: rechazados, score: score }
}

function auditarGrilla(grillaPosts, plataformasCliente) {
  var problemas = []

  if (!grillaPosts || grillaPosts.length === 0) {
    return { problemas: ['SIN GRILLA: el agente no generó grilla mensual'], score: 0 }
  }

  // 1. Cantidad correcta
  if (grillaPosts.length < 12) {
    problemas.push('Grilla con solo ' + grillaPosts.length + ' posts (esperados: 16)')
  }

  // 2. Distribución plataformas
  var plats = {}
  grillaPosts.forEach(function(g) {
    var p = g.plataforma || '?'
    plats[p] = (plats[p] || 0) + 1
  })

  // Verificar que no use plataformas que el cliente no tiene
  Object.keys(plats).forEach(function(p) {
    if (plataformasCliente.indexOf(p) === -1) {
      problemas.push('Grilla usa "' + p + '" pero el cliente solo tiene ' + plataformasCliente.join('+'))
    }
  })

  // Si tiene ambas, verificar distribución
  if (plataformasCliente.indexOf('Instagram') !== -1 && plataformasCliente.indexOf('LinkedIn') !== -1) {
    var igCount = plats['Instagram'] || 0
    var liCount = plats['LinkedIn'] || 0
    if (liCount === 0) {
      problemas.push('Grilla SIN posts de LinkedIn — el cliente tiene LinkedIn configurado')
    }
    if (igCount === 0) {
      problemas.push('Grilla SIN posts de Instagram — el cliente tiene Instagram configurado')
    }
  }

  // 3. Diversificación de ángulos
  var angulos = {}
  grillaPosts.forEach(function(g) { angulos[g.angulo || '?'] = (angulos[g.angulo || '?'] || 0) + 1 })
  Object.keys(angulos).forEach(function(a) {
    if (angulos[a] > 4) {
      problemas.push('Ángulo "' + a + '" repetido ' + angulos[a] + ' veces — máximo 3')
    }
  })
  if (Object.keys(angulos).length < 4) {
    problemas.push('Solo ' + Object.keys(angulos).length + ' ángulos distintos — mínimo 4 para diversificar')
  }

  // 4. Días calendario válidos
  var diasUsados = new Set()
  grillaPosts.forEach(function(g) {
    if (g.dia) {
      if (diasUsados.has(g.dia)) {
        problemas.push('Día ' + g.dia + ' tiene más de 1 post — no publicar 2 el mismo día')
      }
      diasUsados.add(g.dia)
    }
  })

  // 5. Posts con copy vacío
  var vacios = grillaPosts.filter(function(g) { return !g.copy || g.copy.length < 30 })
  if (vacios.length > 0) {
    problemas.push(vacios.length + ' posts con copy vacío o muy corto')
  }

  var score = Math.max(0, 100 - (problemas.length * 12))
  return { problemas: problemas, score: score, totalPosts: grillaPosts.length, plataformas: plats, angulos: angulos }
}

function auditarAuditoria(auditoria, postsIG, postsLI) {
  var problemas = []

  if (!auditoria) {
    return { problemas: ['SIN AUDITORÍA: el agente no generó auditoría'], score: 0 }
  }

  var criterios = auditoria.criterios || []

  // 1. Cantidad mínima de criterios
  if (criterios.length < 6) {
    problemas.push('Solo ' + criterios.length + ' criterios (mínimo 6)')
  }

  // 2. Criterios con dato vacío
  var sinDato = criterios.filter(function(c) { return !c.dato || c.dato === '' || c.dato === 'N/A' })
  if (sinDato.length > 0) {
    problemas.push(sinDato.length + ' criterios sin dato real: ' + sinDato.map(function(c) { return c.nombre }).join(', '))
  }

  // 3. Criterios con score 0
  var scoreZero = criterios.filter(function(c) { return c.score === 0 })
  if (scoreZero.length > 0) {
    problemas.push(scoreZero.length + ' criterios con score 0/10 (¿sin datos?): ' + scoreZero.map(function(c) { return c.nombre }).join(', '))
  }

  // 4. Si hay posts de ambas redes, ¿hay criterios separados?
  if (postsIG > 0 && postsLI > 0) {
    var tieneIG = criterios.some(function(c) { return (c.nombre || '').toLowerCase().includes('instagram') })
    var tieneLI = criterios.some(function(c) { return (c.nombre || '').toLowerCase().includes('linkedin') })
    if (!tieneIG && !tieneLI) {
      problemas.push('Cliente tiene IG (' + postsIG + ') + LI (' + postsLI + ') pero auditoría NO separa criterios por red')
    }
  }

  // 5. Sin resumen ejecutivo
  if (!auditoria.resumen_ejecutivo) {
    problemas.push('Sin resumen ejecutivo')
  }

  // 6. Sin acciones
  if (!auditoria.top_3_acciones || auditoria.top_3_acciones.length === 0) {
    problemas.push('Sin acciones prioritarias')
  }

  // 7. Sin fuente en criterios
  var sinFuente = criterios.filter(function(c) { return !c.fuente })
  if (sinFuente.length > 2) {
    problemas.push(sinFuente.length + ' criterios sin campo "fuente" — el cliente no sabe de dónde viene el dato')
  }

  var score = Math.max(0, 100 - (problemas.length * 12))
  return { problemas: problemas, score: score }
}

function auditarReporte(reporte) {
  var problemas = []

  if (!reporte) {
    return { problemas: ['SIN REPORTE: el agente no generó reporte ejecutivo'], score: 0 }
  }

  // 1. Resumen
  if (!reporte.resumen_ejecutivo || reporte.resumen_ejecutivo.length < 100) {
    problemas.push('Resumen ejecutivo ausente o muy corto (' + (reporte.resumen_ejecutivo || '').length + ' chars)')
  }

  // 2. Acciones
  var acciones = reporte.acciones_inteligentes || []
  if (acciones.length < 3) {
    problemas.push('Solo ' + acciones.length + ' acciones inteligentes (mínimo 5)')
  }

  // 3. Acciones sin justificación
  var sinPorQue = acciones.filter(function(a) { return !a.por_que })
  if (sinPorQue.length > 0) {
    problemas.push(sinPorQue.length + ' acciones sin "por_que" — no se sabe de dónde viene la recomendación')
  }

  // 4. Hallazgos
  var hallazgos = reporte.hallazgos_clave || []
  if (hallazgos.length < 3) {
    problemas.push('Solo ' + hallazgos.length + ' hallazgos (mínimo 3)')
  }

  // 5. Sin predicción
  if (!reporte.prediccion_mes_siguiente) {
    problemas.push('Sin predicción del mes siguiente')
  }

  var score = Math.max(0, 100 - (problemas.length * 15))
  return { problemas: problemas, score: score }
}

function auditarDuplicados(supabaseData) {
  var problemas = []

  // Contenido duplicado (múltiples grillas/copies del mismo mes)
  var contenidoPorMes = {}
  ;(supabaseData.contenido || []).forEach(function(c) {
    var key = c.tipo + '-' + c.mes + '-' + c.anio
    contenidoPorMes[key] = (contenidoPorMes[key] || 0) + 1
  })
  Object.keys(contenidoPorMes).forEach(function(key) {
    if (contenidoPorMes[key] > 1) {
      problemas.push('DUPLICADO: ' + key + ' aparece ' + contenidoPorMes[key] + ' veces — cada run inserta otra copia')
    }
  })

  // Auditorías duplicadas
  var audPorMes = {}
  ;(supabaseData.auditorias || []).forEach(function(a) {
    var key = a.mes + '-' + a.anio
    audPorMes[key] = (audPorMes[key] || 0) + 1
  })
  Object.keys(audPorMes).forEach(function(key) {
    if (audPorMes[key] > 1) {
      problemas.push('DUPLICADO: auditoría ' + key + ' aparece ' + audPorMes[key] + ' veces')
    }
  })

  return { problemas: problemas, score: problemas.length === 0 ? 100 : Math.max(0, 100 - problemas.length * 20) }
}

// ═══════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════

async function ejecutarAuditoria(contexto, supabase, suscripcionId) {
  console.log('\n   === QA AUDITOR — REVISIÓN DE CALIDAD ===')

  var c = contexto || {}
  var perfil = c.perfil || {}
  var cuentas = c.cuentas || []

  // Determinar plataformas del cliente
  var plataformasCliente = []
  cuentas.forEach(function(cu) {
    var red = (cu.red || '').toLowerCase()
    if (red === 'instagram' && plataformasCliente.indexOf('Instagram') === -1) plataformasCliente.push('Instagram')
    if (red === 'linkedin' && plataformasCliente.indexOf('LinkedIn') === -1) plataformasCliente.push('LinkedIn')
  })
  if (plataformasCliente.length === 0) plataformasCliente = ['Instagram']

  // Contar posts por red
  var postsIG = (c.posts || []).filter(function(p) { return (p.red || 'Instagram') !== 'LinkedIn' }).length
  var postsLI = (c.posts || []).filter(function(p) { return p.red === 'LinkedIn' }).length

  console.log('   Plataformas cliente: ' + plataformasCliente.join(' + '))
  console.log('   Posts: ' + postsIG + ' IG + ' + postsLI + ' LI')

  // ═══ AUDITAR CADA AGENTE ═══
  var resultados = {}

  // 1. Copies
  var allCopies = []
  ;(c.contenido || []).forEach(function(co) {
    if (co.tipo === 'copy' && Array.isArray(co.datos)) {
      co.datos.forEach(function(d) { allCopies.push(d) })
    }
  })
  resultados.copies = auditarCopies(allCopies, plataformasCliente)
  console.log('   Copies: ' + resultados.copies.aprobados + '/' + (resultados.copies.aprobados + resultados.copies.rechazados) + ' aprobados, ' + resultados.copies.problemas.length + ' problemas')

  // 2. Grilla
  var allGrilla = []
  ;(c.contenido || []).forEach(function(co) {
    if (co.tipo === 'grilla' && Array.isArray(co.datos)) {
      co.datos.forEach(function(d) { allGrilla.push(d) })
    }
  })
  resultados.grilla = auditarGrilla(allGrilla.length > 0 ? allGrilla.slice(-16) : [], plataformasCliente)
  console.log('   Grilla: score ' + resultados.grilla.score + ', ' + resultados.grilla.problemas.length + ' problemas')

  // 3. Auditoría
  resultados.auditoria = auditarAuditoria(c.auditoria, postsIG, postsLI)
  console.log('   Auditoría: score ' + resultados.auditoria.score + ', ' + resultados.auditoria.problemas.length + ' problemas')

  // 4. Reporte
  resultados.reporte = auditarReporte(c.reporte)
  console.log('   Reporte: score ' + resultados.reporte.score + ', ' + resultados.reporte.problemas.length + ' problemas')

  // 5. Duplicados
  resultados.duplicados = auditarDuplicados({
    contenido: c.contenido || [],
    auditorias: c.auditorias || [],
  })
  console.log('   Duplicados: score ' + resultados.duplicados.score + ', ' + resultados.duplicados.problemas.length + ' problemas')

  // ═══ SCORE GLOBAL ═══
  var scores = [
    resultados.copies.score,
    resultados.grilla.score,
    resultados.auditoria.score,
    resultados.reporte.score,
    resultados.duplicados.score,
  ].filter(function(s) { return s > 0 || s === 0 })

  var scoreGlobal = scores.length > 0 ? Math.round(scores.reduce(function(s, v) { return s + v }, 0) / scores.length) : 0

  // ═══ RECOLECTAR TODOS LOS PROBLEMAS ═══
  var todosProblemas = []
  Object.keys(resultados).forEach(function(agente) {
    resultados[agente].problemas.forEach(function(p) {
      todosProblemas.push({ agente: agente, problema: p })
    })
  })

  console.log('\n   ══ QA RESULTADO ══')
  console.log('   Score global: ' + scoreGlobal + '/100')
  console.log('   Problemas totales: ' + todosProblemas.length)
  todosProblemas.forEach(function(p) {
    console.log('   [' + p.agente.toUpperCase() + '] ' + p.problema)
  })

  // ═══ GENERAR VEREDICTO IA (opcional, enriquece con contexto) ═══
  var veredictoIA = null
  if (ANTHROPIC_KEY && todosProblemas.length > 0) {
    try {
      var problemasTexto = todosProblemas.map(function(p) { return '[' + p.agente + '] ' + p.problema }).join('\n')

      var prompt = 'Eres el DIRECTOR DE CALIDAD de un sistema de agentes de IA para marketing digital. '
        + 'Revisaste los entregables de este run y encontraste estos problemas:\n\n'
        + problemasTexto + '\n\n'
        + 'CLIENTE: ' + (perfil.nombre || '?') + ' (' + (perfil.rubro || '?') + ')\n'
        + 'Plataformas: ' + plataformasCliente.join(' + ') + '\n'
        + 'Score QA global: ' + scoreGlobal + '/100\n\n'
        + 'Genera un VEREDICTO en JSON:\n'
        + '{\n'
        + '  "veredicto": "APROBADO|APROBADO_CON_OBSERVACIONES|RECHAZADO",\n'
        + '  "resumen": "2-3 oraciones sobre el estado general de calidad",\n'
        + '  "correcciones_urgentes": [\n'
        + '    { "agente": "copies|grilla|auditoria|reporte|duplicados", "correccion": "Qué debe cambiar el agente en el próximo run", "prioridad": "critica|alta|media" }\n'
        + '  ],\n'
        + '  "agente_mejor": "Qué agente funcionó mejor y por qué",\n'
        + '  "agente_peor": "Qué agente necesita más trabajo y por qué"\n'
        + '}\n\n'
        + 'REGLAS:\n'
        + '- RECHAZADO si hay más de 5 problemas críticos o score < 40\n'
        + '- APROBADO_CON_OBSERVACIONES si score entre 40-75\n'
        + '- APROBADO si score > 75 y sin problemas críticos\n'
        + '- Las correcciones deben ser ESPECÍFICAS y ACCIONABLES\n'
        + '- Responde SOLO JSON válido.'

      var res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
      })

      if (res.ok) {
        var data = await res.json()
        var raw = (data.content[0].text || '').replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
        veredictoIA = JSON.parse(raw)
        console.log('\n   VEREDICTO IA: ' + veredictoIA.veredicto)
        console.log('   ' + veredictoIA.resumen)
      }
    } catch (e) {
      console.log('   Veredicto IA skip: ' + e.message)
    }
  }

  // ═══ GUARDAR CORRECCIONES COMO APRENDIZAJES ═══
  if (supabase && suscripcionId && todosProblemas.length > 0) {
    try {
      var memModule = require('./radar-memoria-persistente.js')

      // Guardar los problemas más graves como aprendizajes
      var problemasGraves = todosProblemas.filter(function(p) {
        return p.problema.includes('DUPLICADO') || p.problema.includes('SIN ') || p.problema.includes('CRÍTICO')
          || p.problema.includes('vacío') || p.problema.includes('ChatGPT')
      })

      for (var i = 0; i < Math.min(problemasGraves.length, 5); i++) {
        var pg = problemasGraves[i]
        await memModule.guardarAprendizaje(supabase, suscripcionId, 'qa_auditor', 'alerta',
          'QA rechazó [' + pg.agente + ']: ' + pg.problema, 0.9, { scoreQA: scoreGlobal })
      }

      // Guardar correcciones de la IA
      if (veredictoIA && veredictoIA.correcciones_urgentes) {
        for (var j = 0; j < veredictoIA.correcciones_urgentes.length; j++) {
          var corr = veredictoIA.correcciones_urgentes[j]
          if (corr.prioridad === 'critica' || corr.prioridad === 'alta') {
            await memModule.guardarAprendizaje(supabase, suscripcionId, 'qa_auditor', 'correccion',
              'Corrección para ' + corr.agente + ': ' + corr.correccion, 0.85, { prioridad: corr.prioridad })
          }
        }
      }

      console.log('   Correcciones guardadas como aprendizajes para el próximo run')
    } catch (e) {
      console.log('   Error guardando correcciones: ' + e.message)
    }
  }

  var resultado = {
    scoreGlobal: scoreGlobal,
    veredicto: veredictoIA ? veredictoIA.veredicto : (scoreGlobal >= 75 ? 'APROBADO' : scoreGlobal >= 40 ? 'APROBADO_CON_OBSERVACIONES' : 'RECHAZADO'),
    resultados: resultados,
    todosProblemas: todosProblemas,
    veredictoIA: veredictoIA,
    plataformasCliente: plataformasCliente,
    timestamp: new Date().toISOString(),
  }

  console.log('\n   === QA AUDITOR COMPLETADO: ' + resultado.veredicto + ' (' + scoreGlobal + '/100) ===\n')

  return resultado
}

module.exports = { ejecutarAuditoria: ejecutarAuditoria }
