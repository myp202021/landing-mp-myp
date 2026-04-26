// radar-decisiones.js
// Motor de decisiones inteligentes para el pipeline de agentes
// NO es un wrapper de API — es LÓGICA PURA que decide:
// - Qué agente correr y cuándo
// - Qué datos pasar a cada agente y cuáles ignorar
// - Cuándo parar y alertar vs seguir
// - Cómo adaptar la estrategia basándose en datos reales
// Costo: $0 (pura lógica, sin APIs)

// ═══════════════════════════════════════════════
// EVALUAR CONTEXTO ANTES DE CADA AGENTE
// ═══════════════════════════════════════════════
function evaluarContexto(memoria, posts, postsCliente, sub) {
  var perfil = sub.perfil_empresa || {}
  var brief = perfil.brief || null
  var ctx = {
    // Datos disponibles
    tieneMemoria: !!memoria && memoria.copiesAprendizaje.totalCopiesHistoricos > 0,
    tieneBrief: !!brief && !!(brief.territorios_contenido) && brief.territorios_contenido.length >= 2,
    tienePostsCompetencia: posts.length >= 3,
    tienePostsCliente: postsCliente && postsCliente.length > 0,
    tienePerfil: !!(perfil.rubro),
    tieneIndustria: !!(perfil.rubro || perfil.descripcion),

    // Calidad del brief
    briefEdadDias: brief && brief.fecha_generacion ? Math.round((Date.now() - new Date(brief.fecha_generacion).getTime()) / (1000*60*60*24)) : 999,
    briefEditadoPorCliente: brief && brief.editado_por_cliente === true,
    briefTerritorios: brief ? (brief.territorios_contenido || []).length : 0,
    briefCompetidores: brief ? (brief.competidores_analizados || []).length : 0,

    // Performance del cliente
    clienteEngAvg: 0,
    clienteTendencia: 'sin_datos', // subiendo, bajando, estable, sin_datos
    clienteFreqSemanal: 0,
    clienteFormatoGanador: null,
    clienteTemaGanador: null,

    // Performance de copies
    copiesScoreAvg: memoria ? memoria.copiesAprendizaje.scorePromedio : 0,
    copiesMejorAngulo: memoria && memoria.copiesAprendizaje.mejorAngulo ? memoria.copiesAprendizaje.mejorAngulo.angulo : null,
    copiesPeorAngulo: memoria && memoria.copiesAprendizaje.peorAngulo ? memoria.copiesAprendizaje.peorAngulo.angulo : null,
    problemasRecurrentes: memoria ? memoria.copiesAprendizaje.problemasRecurrentes : [],

    // Competencia
    competidorCreciendo: memoria ? memoria.competenciaPatrones.competidorEnCrecimiento : null,
    competidorCayendo: memoria ? memoria.competenciaPatrones.competidorEnCaida : null,

    // Ideas
    ideasAprobadas: memoria ? memoria.ideasContext.aprobadas.length : 0,
    ideasDescartadas: memoria ? memoria.ideasContext.descartadas.length : 0,

    // Auditoría
    ultimoScoreAudit: memoria ? memoria.auditoriaAprendizaje.ultimoScore : 0,
    tendenciaAudit: memoria ? memoria.auditoriaAprendizaje.tendenciaScore : 'estable',
    criteriosDebiles: memoria ? memoria.auditoriaAprendizaje.criteriosDebiles : [],

    // Decisiones (se llenan abajo)
    decisiones: [],
    alertas: [],
    estrategia: {},
  }

  // Calcular datos del cliente
  if (postsCliente && postsCliente.length > 0) {
    ctx.clienteEngAvg = Math.round(postsCliente.reduce(function(s, p) { return s + (p.likes||0) + (p.comments||0) }, 0) / postsCliente.length)
    ctx.clienteFreqSemanal = Math.round(postsCliente.length / (Math.max(1, ctx.briefEdadDias / 7)))

    // Formato y tema ganador del cliente
    var fmtCount = {}; var temaCount = {}
    postsCliente.forEach(function(p) {
      var fmt = detectarFormatoSimple(p.type || p.tipo_post || '')
      var tema = detectarTemaSimple(p.texto || '')
      var eng = (p.likes||0) + (p.comments||0)
      if (!fmtCount[fmt]) fmtCount[fmt] = { total: 0, count: 0 }
      fmtCount[fmt].total += eng; fmtCount[fmt].count++
      if (!temaCount[tema]) temaCount[tema] = { total: 0, count: 0 }
      temaCount[tema].total += eng; temaCount[tema].count++
    })
    var fmtOrdenado = Object.keys(fmtCount).sort(function(a,b) { return (fmtCount[b].total/fmtCount[b].count) - (fmtCount[a].total/fmtCount[a].count) })
    var temaOrdenado = Object.keys(temaCount).sort(function(a,b) { return (temaCount[b].total/temaCount[b].count) - (temaCount[a].total/temaCount[a].count) })
    if (fmtOrdenado[0]) ctx.clienteFormatoGanador = fmtOrdenado[0]
    if (temaOrdenado[0]) ctx.clienteTemaGanador = temaOrdenado[0]
  }

  return ctx
}

// ═══════════════════════════════════════════════
// DECIDIR: ¿REGENERAR BRIEF O USAR EL EXISTENTE?
// ═══════════════════════════════════════════════
function decidirBrief(ctx) {
  var decision = { regenerar: false, razones: [], prioridades: [] }

  // Si no hay brief → generar
  if (!ctx.tieneBrief) {
    decision.regenerar = true
    decision.razones.push('No existe brief')
    return decision
  }

  // Si el cliente editó el brief → RESPETAR, no sobreescribir
  if (ctx.briefEditadoPorCliente) {
    decision.regenerar = false
    decision.razones.push('Brief editado por el cliente — se respeta')
    return decision
  }

  // Si el brief tiene más de 14 días → regenerar
  if (ctx.briefEdadDias > 14) {
    decision.regenerar = true
    decision.razones.push('Brief tiene ' + ctx.briefEdadDias + ' dias — desactualizado')
  }

  // Si la auditoría bajó → regenerar con foco en áreas débiles
  if (ctx.tendenciaAudit === 'bajando') {
    decision.regenerar = true
    decision.razones.push('Score auditoría bajando — brief necesita ajuste')
    decision.prioridades.push('Compensar criterios débiles: ' + ctx.criteriosDebiles.map(function(c) { return c.nombre }).join(', '))
  }

  // Si hay competidor creciendo → actualizar brief con contraataque
  if (ctx.competidorCreciendo) {
    decision.regenerar = true
    decision.razones.push('Competidor ' + ctx.competidorCreciendo + ' está creciendo')
    decision.prioridades.push('Incluir contraataque vs ' + ctx.competidorCreciendo)
  }

  // Si hay ideas aprobadas nuevas → actualizar brief
  if (ctx.ideasAprobadas > 0) {
    decision.regenerar = true
    decision.razones.push(ctx.ideasAprobadas + ' ideas aprobadas por incorporar')
  }

  return decision
}

// ═══════════════════════════════════════════════
// DECIDIR: ¿QUÉ TIPO DE COPIES GENERAR?
// ═══════════════════════════════════════════════
function decidirCopies(ctx) {
  var decision = {
    generar: true,
    anguloPrioridad: null,   // ángulo a priorizar
    anguloEvitar: null,      // ángulo a evitar
    formatoPrioridad: null,  // formato a priorizar
    largoPrioridad: null,    // largo sugerido
    tonoAjuste: null,        // ajuste de tono
    razones: [],
  }

  // Si no hay suficientes posts → no generar
  if (!ctx.tienePostsCompetencia) {
    decision.generar = false
    decision.razones.push('Menos de 3 posts de competencia — no hay datos suficientes')
    return decision
  }

  // Priorizar ángulo que mejor scorea
  if (ctx.copiesMejorAngulo) {
    decision.anguloPrioridad = ctx.copiesMejorAngulo
    decision.razones.push('Priorizar ángulo "' + ctx.copiesMejorAngulo + '" (mejor score histórico)')
  }

  // Evitar ángulo que peor scorea
  if (ctx.copiesPeorAngulo && ctx.copiesPeorAngulo !== ctx.copiesMejorAngulo) {
    decision.anguloEvitar = ctx.copiesPeorAngulo
    decision.razones.push('Evitar ángulo "' + ctx.copiesPeorAngulo + '" (peor score histórico)')
  }

  // Si el cliente tiene datos reales → priorizar SU formato ganador
  if (ctx.clienteFormatoGanador) {
    decision.formatoPrioridad = ctx.clienteFormatoGanador
    decision.razones.push('Priorizar formato "' + ctx.clienteFormatoGanador + '" (mejor engagement REAL del cliente)')
  }

  // Si hay ideas aprobadas → que 1 copy cubra una idea aprobada
  if (ctx.ideasAprobadas > 0) {
    decision.razones.push('1 de los 3 copies debe cubrir una idea aprobada por el cliente')
  }

  // Si hay problemas recurrentes → instrucción explícita
  if (ctx.problemasRecurrentes.length > 0) {
    decision.razones.push('EVITAR: ' + ctx.problemasRecurrentes[0].problema)
  }

  // Si engagement del cliente está bajo → copies más provocadores
  if (ctx.tienePostsCliente && ctx.clienteEngAvg < 30) {
    decision.tonoAjuste = 'Más provocador y directo — el engagement del cliente está bajo (' + ctx.clienteEngAvg + ')'
    decision.razones.push(decision.tonoAjuste)
  }

  return decision
}

// ═══════════════════════════════════════════════
// DECIDIR: ¿GUIONES NECESARIOS?
// ═══════════════════════════════════════════════
function decidirGuiones(ctx, memoria) {
  var decision = { generar: true, razones: [] }

  // Si ya se generaron guiones esta semana → no duplicar
  if (memoria && memoria.guionesPrevios) {
    var guionesRecientes = memoria.guionesPrevios.totalGuiones
    if (guionesRecientes >= 8) {
      decision.razones.push('Ya hay ' + guionesRecientes + ' guiones acumulados — generar igualmente para variedad')
    }
  }

  // Si el formato video no es el ganador del cliente → advertir
  if (ctx.clienteFormatoGanador && ctx.clienteFormatoGanador !== 'video/reel') {
    decision.razones.push('El formato ganador del cliente es "' + ctx.clienteFormatoGanador + '", no video — considerar si guiones son la prioridad')
  }

  return decision
}

// ═══════════════════════════════════════════════
// QUALITY GATE: evaluar output de un agente antes de pasar al siguiente
// ═══════════════════════════════════════════════
function qualityGateBrief(brief) {
  var issues = []
  if (!brief) return { pass: false, issues: ['Brief es null'] }
  if (!brief.propuesta_valor_unica || brief.propuesta_valor_unica.length < 20) issues.push('PVU muy corta o vacía')
  if (!brief.territorios_contenido || brief.territorios_contenido.length < 2) issues.push('Menos de 2 territorios')
  if (!brief.competidores_analizados || brief.competidores_analizados.length < 1) issues.push('Sin competidores analizados')
  if (!brief.reglas_contenido || brief.reglas_contenido.length < 2) issues.push('Menos de 2 reglas')
  return { pass: issues.length === 0, issues: issues }
}

function qualityGateCopies(copies) {
  var issues = []
  if (!copies || copies.length === 0) return { pass: false, issues: ['Sin copies generados'] }
  var avgScore = copies.reduce(function(s,c) { return s + (c.score||0) }, 0) / copies.length
  if (avgScore < 65) issues.push('Score promedio bajo: ' + Math.round(avgScore))
  copies.forEach(function(c, i) {
    if ((c.palabras||0) < 80) issues.push('Copy ' + (i+1) + ' muy corto: ' + c.palabras + ' palabras')
    if ((c.copy||'').includes('[object Object]')) issues.push('Copy ' + (i+1) + ' tiene [object Object]')
  })
  return { pass: issues.length === 0, issues: issues }
}

function qualityGateGuiones(guiones) {
  var issues = []
  if (!guiones || guiones.length === 0) return { pass: false, issues: ['Sin guiones'] }
  guiones.forEach(function(g, i) {
    if (!g.gancho) issues.push('Guion ' + (i+1) + ' sin gancho')
    if (!g.escenas || g.escenas.length < 2) issues.push('Guion ' + (i+1) + ' menos de 2 escenas')
    if (!g.cierre) issues.push('Guion ' + (i+1) + ' sin cierre')
    // CTA genérico
    var cta = g.cierre && (typeof g.cierre === 'object' ? g.cierre.frase_cta : g.cierre) || ''
    if (cta.toLowerCase().includes('visita') || cta.toLowerCase().includes('siguenos') || cta.toLowerCase().includes('mas informacion')) {
      issues.push('Guion ' + (i+1) + ' CTA genérico: "' + cta.substring(0, 40) + '"')
    }
  })
  return { pass: issues.length === 0, issues: issues }
}

// ═══════════════════════════════════════════════
// GENERAR INSTRUCCIONES ESTRATÉGICAS PARA CADA AGENTE
// (esto es lo que va al prompt, basado en decisiones)
// ═══════════════════════════════════════════════
function generarInstruccionesParaCopies(ctx, decisionCopies) {
  var instr = '\n═══ INSTRUCCIONES ESTRATÉGICAS (decisiones del motor inteligente) ═══\n'

  if (decisionCopies.anguloPrioridad) {
    instr += '- PRIORIZAR ángulo "' + decisionCopies.anguloPrioridad + '" (históricamente es el que mejor scorea)\n'
  }
  if (decisionCopies.anguloEvitar) {
    instr += '- EVITAR ángulo "' + decisionCopies.anguloEvitar + '" (históricamente es el que peor scorea)\n'
  }
  if (decisionCopies.formatoPrioridad) {
    instr += '- Al menos 1 copy debe ser formato "' + decisionCopies.formatoPrioridad + '" (formato con mejor engagement REAL del cliente)\n'
  }
  if (decisionCopies.tonoAjuste) {
    instr += '- TONO: ' + decisionCopies.tonoAjuste + '\n'
  }
  if (ctx.clienteTemaGanador) {
    instr += '- TEMA: priorizar temas de tipo "' + ctx.clienteTemaGanador + '" (mejor engagement del cliente en su propia cuenta)\n'
  }
  if (ctx.ideasAprobadas > 0) {
    instr += '- 1 de los 3 copies DEBE abordar una idea aprobada por el cliente\n'
  }
  decisionCopies.razones.forEach(function(r) {
    if (r.startsWith('EVITAR:')) instr += '- ' + r + '\n'
  })

  // Datos del cliente para referencia
  if (ctx.tienePostsCliente) {
    instr += '- Datos reales del cliente: ' + ctx.clienteFreqSemanal + ' posts/semana, engagement avg ' + ctx.clienteEngAvg + '\n'
    if (ctx.clienteFormatoGanador) instr += '- Su formato ganador: ' + ctx.clienteFormatoGanador + '\n'
    if (ctx.clienteTemaGanador) instr += '- Su tema ganador: ' + ctx.clienteTemaGanador + '\n'
  }

  return instr
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function detectarFormatoSimple(tipo) {
  var t = (tipo || '').toLowerCase()
  if (t.includes('video') || t.includes('reel')) return 'video/reel'
  if (t.includes('sidecar') || t.includes('carousel') || t.includes('carrusel')) return 'carrusel'
  return 'imagen'
}

function detectarTemaSimple(texto) {
  var t = (texto || '').toLowerCase()
  if (t.includes('oferta') || t.includes('descuento') || t.includes('promo')) return 'promocional'
  if (t.includes('equipo') || t.includes('cultura') || t.includes('detras')) return 'marca_humana'
  if (t.includes('tip') || t.includes('consejo') || t.includes('aprende') || t.includes('como')) return 'educativo'
  if (t.includes('cliente') || t.includes('testimonio') || t.includes('caso')) return 'caso_exito'
  if (t.includes('tendencia') || t.includes('novedad') || t.includes('nuevo')) return 'tendencia'
  return 'general'
}

module.exports = {
  evaluarContexto: evaluarContexto,
  decidirBrief: decidirBrief,
  decidirCopies: decidirCopies,
  decidirGuiones: decidirGuiones,
  qualityGateBrief: qualityGateBrief,
  qualityGateCopies: qualityGateCopies,
  qualityGateGuiones: qualityGateGuiones,
  generarInstruccionesParaCopies: generarInstruccionesParaCopies,
}
