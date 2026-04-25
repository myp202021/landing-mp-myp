// radar-auditoria.js
// Calcula auditoria mensual del perfil del suscriptor
// Usa datos existentes de radar_posts y radar_contenido
// Se llama desde radar-clipping.js en modo mensual (todos los planes)
// Costo: $0 (pura logica, sin APIs)

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function getWeekNumber(date) {
  var d = new Date(date)
  var dayOfMonth = d.getDate()
  return Math.ceil(dayOfMonth / 7)
}

function stddev(arr) {
  if (arr.length === 0) return 0
  var avg = arr.reduce(function(s, v) { return s + v }, 0) / arr.length
  var sqDiffs = arr.map(function(v) { return Math.pow(v - avg, 2) })
  var avgSqDiff = sqDiffs.reduce(function(s, v) { return s + v }, 0) / sqDiffs.length
  return Math.sqrt(avgSqDiff)
}

// ═══════════════════════════════════════════════
// CRITERIOS DE AUDITORIA (8)
// ═══════════════════════════════════════════════

function calcFrecuencia(posts, empresas) {
  // Count posts per company, calculate avg
  var counts = {}
  for (var i = 0; i < posts.length; i++) {
    var key = posts[i].nombre || posts[i].handle || 'desconocido'
    counts[key] = (counts[key] || 0) + 1
  }
  var vals = Object.values(counts)
  if (vals.length === 0) return { nombre: 'Frecuencia de publicacion', score: 4 }
  var avg = vals.reduce(function(s, v) { return s + v }, 0) / vals.length

  var score = 4
  if (avg >= 12) score = 10
  else if (avg >= 8) score = 8
  else if (avg >= 4) score = 6

  return { nombre: 'Frecuencia de publicacion', score: score }
}

function calcEngagement(posts) {
  if (posts.length === 0) return { nombre: 'Engagement rate', score: 4 }

  var total = posts.reduce(function(s, p) {
    return s + (p.likes || 0) + (p.comments || 0)
  }, 0)
  var avg = total / posts.length

  var score = 4
  if (avg >= 100) score = 10
  else if (avg >= 50) score = 8
  else if (avg >= 20) score = 6

  return { nombre: 'Engagement rate', score: score }
}

function calcConsistencia(posts) {
  if (posts.length === 0) return { nombre: 'Consistencia visual', score: 4 }

  // Group posts by week number
  var weeks = {}
  for (var i = 0; i < posts.length; i++) {
    var fecha = posts[i].fecha || posts[i].postedAt || posts[i].created_at
    if (!fecha) continue
    var w = getWeekNumber(fecha)
    weeks[w] = (weeks[w] || 0) + 1
  }

  var vals = Object.values(weeks)
  if (vals.length < 2) return { nombre: 'Consistencia visual', score: 6 }

  var sd = stddev(vals)
  var score = 4
  if (sd < 1) score = 10
  else if (sd < 2) score = 8
  else if (sd < 3) score = 6

  return { nombre: 'Consistencia visual', score: score }
}

function calcCalidadCopies(contenido) {
  if (!contenido || contenido.length === 0) return { nombre: 'Calidad de copies', score: 7 }

  var scores = contenido.map(function(c) { return c.score_promedio || 0 }).filter(function(s) { return s > 0 })
  if (scores.length === 0) return { nombre: 'Calidad de copies', score: 7 }

  var avg = scores.reduce(function(s, v) { return s + v }, 0) / scores.length

  var score = 4
  if (avg >= 85) score = 10
  else if (avg >= 75) score = 8
  else if (avg >= 65) score = 6

  return { nombre: 'Calidad de copies', score: score }
}

function calcHashtags(contenido) {
  if (!contenido || contenido.length === 0) return { nombre: 'Uso de hashtags', score: 8 }

  // Check if generated copies have hashtags
  var conHashtags = 0
  var total = 0
  for (var i = 0; i < contenido.length; i++) {
    var datos = contenido[i].datos || []
    if (!Array.isArray(datos)) continue
    for (var j = 0; j < datos.length; j++) {
      total++
      if (datos[j].copy && datos[j].copy.includes('#')) conHashtags++
    }
  }

  if (total === 0) return { nombre: 'Uso de hashtags', score: 8 }
  return { nombre: 'Uso de hashtags', score: (conHashtags / total) >= 0.5 ? 8 : 6 }
}

function calcHorarios() {
  // We don't track exact times yet
  return { nombre: 'Horarios de publicacion', score: 7 }
}

function calcVariedad(posts) {
  if (posts.length === 0) return { nombre: 'Variedad de formatos', score: 4 }

  var tipos = {}
  for (var i = 0; i < posts.length; i++) {
    var tipo = (posts[i].type || posts[i].tipo || 'post').toLowerCase()
    tipos[tipo] = true
  }
  var count = Object.keys(tipos).length

  var score = 4
  if (count >= 4) score = 10
  else if (count >= 3) score = 8
  else if (count >= 2) score = 6

  return { nombre: 'Variedad de formatos', score: score }
}

function calcInteraccion(posts) {
  if (posts.length === 0) return { nombre: 'Interaccion con audiencia', score: 4 }

  var ratios = []
  for (var i = 0; i < posts.length; i++) {
    var likes = posts[i].likes || 0
    var comments = posts[i].comments || 0
    if (likes > 0) ratios.push(comments / likes)
  }

  if (ratios.length === 0) return { nombre: 'Interaccion con audiencia', score: 4 }
  var avgRatio = ratios.reduce(function(s, v) { return s + v }, 0) / ratios.length

  var score = 4
  if (avgRatio > 0.05) score = 10
  else if (avgRatio > 0.03) score = 8
  else if (avgRatio > 0.01) score = 6

  return { nombre: 'Interaccion con audiencia', score: score }
}

// ═══════════════════════════════════════════════
// SCORES POR RED
// ═══════════════════════════════════════════════
function calcScoresPorRed(posts) {
  var redes = {}
  for (var i = 0; i < posts.length; i++) {
    var red = posts[i].red || posts[i].plataforma || 'Otro'
    if (!redes[red]) redes[red] = []
    redes[red].push(posts[i])
  }

  var scores = {}
  var redesKeys = Object.keys(redes)
  for (var j = 0; j < redesKeys.length; j++) {
    var redName = redesKeys[j]
    var redPosts = redes[redName]
    var freq = calcFrecuencia(redPosts)
    var eng = calcEngagement(redPosts)
    scores[redName] = Math.round((freq.score + eng.score) / 2 * 10)
  }

  return scores
}

// ═══════════════════════════════════════════════
// FUNCION PRINCIPAL
// ═══════════════════════════════════════════════
async function generarAuditoria(posts, contenido, cuentas, supabase, suscripcionId, briefEstrategico, modo) {
  modo = modo || 'mensual'
  console.log('\n   === AUDITORIA ' + modo.toUpperCase() + ' ===')

  posts = posts || []
  contenido = contenido || []
  cuentas = cuentas || []
  briefEstrategico = briefEstrategico || null

  // Datos de industria para benchmarking
  var industria = null
  try {
    var industriaModule = require('./radar-industria.js')
    // Necesitamos el perfil para detectar industria — lo extraemos de las cuentas
    var perfilProxy = {}
    if (cuentas && cuentas.length > 0) {
      var nombres = cuentas.filter(function(c) { return c.nombre }).map(function(c) { return c.nombre })
      perfilProxy.rubro = nombres.join(' ')
    }
    industria = industriaModule.detectarIndustria(perfilProxy)
  } catch (e) {}

  // Calcular 8 criterios base
  var criterios = [
    calcFrecuencia(posts),
    calcEngagement(posts),
    calcConsistencia(posts),
    calcCalidadCopies(contenido),
    calcHashtags(contenido),
    calcHorarios(),
    calcVariedad(posts),
    calcInteraccion(posts),
  ]

  // ═══ CRITERIO ADICIONAL: BENCHMARK VS INDUSTRIA ═══
  if (industria && posts.length > 0) {
    var avgEngPosts = posts.reduce(function(s, p) { return s + (p.likes || 0) + (p.comments || 0) }, 0) / posts.length
    var benchmarkEng = industria.engagement_benchmark ? industria.engagement_benchmark.ig_avg : 50
    var ratio = benchmarkEng > 0 ? avgEngPosts / benchmarkEng : 1
    var benchScore = 5
    if (ratio >= 2.0) benchScore = 10
    else if (ratio >= 1.5) benchScore = 9
    else if (ratio >= 1.0) benchScore = 8
    else if (ratio >= 0.7) benchScore = 6
    else if (ratio >= 0.4) benchScore = 4
    else benchScore = 3
    criterios.push({ nombre: 'Engagement vs benchmark industria (' + industria.nombre + ')', score: benchScore })
    console.log('   Benchmark industria: avg eng ' + Math.round(avgEngPosts) + ' vs benchmark ' + benchmarkEng + ' (ratio ' + ratio.toFixed(1) + ', score ' + benchScore + ')')
  }

  // ═══ CRITERIOS ADICIONALES BASADOS EN BRIEF (si existe) ═══
  if (briefEstrategico) {
    console.log('   Brief estratégico conectado a auditoría')

    // Criterio 9: Cobertura de territorios
    if (briefEstrategico.territorios_contenido && Array.isArray(briefEstrategico.territorios_contenido)) {
      var territorios = briefEstrategico.territorios_contenido
      var territoriosCubiertos = 0
      var totalTerritorios = territorios.length
      territorios.forEach(function(t) {
        var nombreTerr = (typeof t === 'object' ? (t.territorio || t.nombre || '') : t).toLowerCase()
        // Verificar si algún copy cubre este territorio
        var cubierto = false
        if (contenido && contenido.length > 0) {
          contenido.forEach(function(c) {
            var datos = c.datos || []
            if (Array.isArray(datos)) {
              datos.forEach(function(d) {
                var textoCompleto = ((d.titulo || '') + ' ' + (d.copy || '') + ' ' + (d.angulo || '')).toLowerCase()
                if (textoCompleto.includes(nombreTerr) || nombreTerr.split(' ').some(function(w) { return w.length > 4 && textoCompleto.includes(w) })) {
                  cubierto = true
                }
              })
            }
          })
        }
        if (cubierto) territoriosCubiertos++
      })
      var cobertura = totalTerritorios > 0 ? Math.round((territoriosCubiertos / totalTerritorios) * 10) : 7
      criterios.push({ nombre: 'Cobertura de territorios (brief)', score: cobertura })
      console.log('   Territorios cubiertos: ' + territoriosCubiertos + '/' + totalTerritorios + ' (score: ' + cobertura + ')')
    }

    // Criterio 10: Alineación con reglas del brief
    if (briefEstrategico.reglas_contenido && Array.isArray(briefEstrategico.reglas_contenido)) {
      // Si hay copies con score > 75, las reglas se están siguiendo
      var avgCopyScore = 0
      var copiesCount = 0
      if (contenido && contenido.length > 0) {
        contenido.forEach(function(c) { if (c.score_promedio > 0) { avgCopyScore += c.score_promedio; copiesCount++ } })
      }
      avgCopyScore = copiesCount > 0 ? avgCopyScore / copiesCount : 0
      var reglaScore = avgCopyScore >= 85 ? 9 : avgCopyScore >= 75 ? 7 : avgCopyScore >= 60 ? 5 : 4
      criterios.push({ nombre: 'Alineación con brief estratégico', score: reglaScore })
    }
  }

  // Score general (promedio ponderado igual, escala 0-100)
  var sumaScores = criterios.reduce(function(s, c) { return s + c.score }, 0)
  var scoreGeneral = Math.round((sumaScores / criterios.length) * 10) / 10
  // Escalar a 0-100
  var scoreGeneral100 = Math.round(scoreGeneral * 10)

  console.log('   Score general: ' + scoreGeneral100 + '/100')
  for (var i = 0; i < criterios.length; i++) {
    console.log('   ' + criterios[i].nombre + ': ' + criterios[i].score + '/10')
  }

  // Scores por red
  var scoresRed = calcScoresPorRed(posts)
  var redesStr = Object.keys(scoresRed).map(function(r) { return r + '=' + scoresRed[r] }).join(', ')
  console.log('   Scores por red: ' + (redesStr || 'sin datos'))

  // Generar fortaleza y debilidad basados en criterios
  var criteriosOrdenados = criterios.slice().sort(function(a, b) { return b.score - a.score })
  var fortaleza = criteriosOrdenados[0] ? criteriosOrdenados[0].nombre + ' (' + criteriosOrdenados[0].score + '/10)' : null
  var debilidad = criteriosOrdenados[criteriosOrdenados.length - 1] ? criteriosOrdenados[criteriosOrdenados.length - 1].nombre + ' (' + criteriosOrdenados[criteriosOrdenados.length - 1].score + '/10)' : null

  // Guardar en Supabase (mensual siempre, semanal solo si no hay del mes)
  if (supabase && suscripcionId) {
    var ahora = new Date()
    var guardar = modo === 'mensual'

    if (modo === 'semanal') {
      // En semanal: guardar solo si no hay auditoria del mes actual
      try {
        var existeRes = await supabase.from('copilot_auditorias')
          .select('id', { count: 'exact', head: true })
          .eq('suscripcion_id', suscripcionId)
          .eq('mes', ahora.getMonth() + 1)
          .eq('anio', ahora.getFullYear())
        guardar = (existeRes.count || 0) === 0
        if (!guardar) console.log('   Auditoria semanal: ya existe del mes, solo se usa en email')
      } catch (e) { guardar = false }
    }

    if (guardar) {
      try {
        await supabase.from('copilot_auditorias').insert({
          suscripcion_id: suscripcionId,
          mes: ahora.getMonth() + 1,
          anio: ahora.getFullYear(),
          score_general: scoreGeneral100,
          scores_red: scoresRed,
          criterios: criterios,
          fortaleza: fortaleza,
          debilidad: debilidad,
        })
        console.log('   Auditoria guardada en copilot_auditorias')
      } catch (e) {
        console.log('   Error guardando auditoria: ' + e.message)
      }
    }
  }

  console.log('   === AUDITORIA COMPLETADA ===\n')

  return {
    score_general: scoreGeneral100,
    scores_red: scoresRed,
    criterios: criterios,
    fortaleza: fortaleza,
    debilidad: debilidad,
  }
}

module.exports = { generarAuditoria: generarAuditoria }
