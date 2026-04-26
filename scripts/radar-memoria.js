// radar-memoria.js
// Sistema de memoria y aprendizaje inter-agente
// Lee datos historicos de TODAS las tablas y genera un contexto de aprendizaje
// que cada agente consume para mejorar sus outputs run tras run.
//
// NO usa APIs externas — pura logica sobre datos historicos de Supabase
// Costo: $0 por run
//
// Se llama desde radar-clipping.js ANTES de cualquier agente
// Output: objeto "memoria" que se pasa a brief, contenido, grilla, guiones, auditoria

// ═══════════════════════════════════════════════
// CARGAR MEMORIA COMPLETA DE UN SUSCRIPTOR
// ═══════════════════════════════════════════════
async function cargarMemoria(supabase, suscripcionId) {
  console.log('\n   === SISTEMA DE MEMORIA ===')
  var memoria = {
    // Performance de copies
    copiesAprendizaje: {
      mejorAngulo: null,        // angulo con mejor score promedio historico
      peorAngulo: null,         // angulo con peor score (evitar o mejorar)
      mejorPlataforma: null,    // plataforma donde copies scorean mas
      scorePromedio: 0,         // baseline para comparar
      problemasRecurrentes: [], // problemas que se repiten en QA
      bonosRecurrentes: [],     // bonos que se ganan frecuentemente
      palabrasPromedio: 0,      // largo promedio de copies aprobados
      totalCopiesHistoricos: 0,
    },
    // Ideas pendientes y aprobadas
    ideasContext: {
      aprobadas: [],     // ideas que el cliente aprobo — priorizar en contenido
      descartadas: [],   // ideas rechazadas — NO repetir estos temas
      enProgreso: [],    // ideas en desarrollo — no duplicar
      nuevas: [],        // ideas sin revisar
      totalIdeas: 0,
    },
    // Auditoria historica
    auditoriaAprendizaje: {
      ultimoScore: 0,
      tendenciaScore: 'estable', // subiendo, bajando, estable
      criteriosDebiles: [],      // criterios que consistentemente puntuan bajo
      criteriosFuertes: [],      // criterios que consistentemente puntuan alto
      historicoScores: [],       // ultimos 6 meses de scores
    },
    // Competencia — patrones a lo largo del tiempo
    competenciaPatrones: {
      // Por competidor: {nombre, frecuenciaActual, frecuenciaAnterior, tendencia, formatoDominante, temaDominante, ultimoTopPost}
      competidores: [],
      competidorMasActivo: null,
      competidorEnCrecimiento: null,  // el que mas crecio en frecuencia
      competidorEnCaida: null,        // el que mas bajo
      formatoGanadorGlobal: null,     // formato con mas engagement en todo el historico
      temaGanadorGlobal: null,
    },
    // Guiones previos
    guionesPrevios: {
      titulosPrevios: [],   // para evitar repeticion
      tiposPrevios: [],     // reel/story distribution
      totalGuiones: 0,
    },
    // Meta
    fechaCarga: new Date().toISOString(),
    suscripcionId: suscripcionId,
  }

  try {
    // ═══ 1. COPIES HISTORICOS ═══
    var copiesRes = await supabase.from('radar_contenido')
      .select('datos, score_promedio, mes, anio')
      .eq('suscripcion_id', suscripcionId)
      .eq('tipo', 'copy')
      .order('id', { ascending: false })
      .limit(12) // ultimos 12 batches (~3 meses)

    if (copiesRes.data && copiesRes.data.length > 0) {
      var todosLosCopies = []
      copiesRes.data.forEach(function(batch) {
        if (Array.isArray(batch.datos)) {
          batch.datos.forEach(function(c) { todosLosCopies.push(c) })
        }
      })

      memoria.copiesAprendizaje.totalCopiesHistoricos = todosLosCopies.length

      if (todosLosCopies.length > 0) {
        // Score promedio historico
        var totalScore = todosLosCopies.reduce(function(s, c) { return s + (c.score || 0) }, 0)
        memoria.copiesAprendizaje.scorePromedio = Math.round(totalScore / todosLosCopies.length)

        // Palabras promedio de copies con score >= 75
        var aprobados = todosLosCopies.filter(function(c) { return (c.score || 0) >= 75 })
        if (aprobados.length > 0) {
          var totalPalabras = aprobados.reduce(function(s, c) { return s + (c.palabras || 0) }, 0)
          memoria.copiesAprendizaje.palabrasPromedio = Math.round(totalPalabras / aprobados.length)
        }

        // Mejor y peor angulo
        var porAngulo = {}
        todosLosCopies.forEach(function(c) {
          var ang = c.angulo || 'general'
          if (!porAngulo[ang]) porAngulo[ang] = { total: 0, count: 0 }
          porAngulo[ang].total += (c.score || 0)
          porAngulo[ang].count++
        })
        var angulos = Object.keys(porAngulo).map(function(k) {
          return { angulo: k, avg: Math.round(porAngulo[k].total / porAngulo[k].count), count: porAngulo[k].count }
        }).sort(function(a, b) { return b.avg - a.avg })
        if (angulos.length > 0) {
          memoria.copiesAprendizaje.mejorAngulo = angulos[0]
          memoria.copiesAprendizaje.peorAngulo = angulos[angulos.length - 1]
        }

        // Mejor plataforma
        var porPlat = {}
        todosLosCopies.forEach(function(c) {
          var plat = c.plataforma || 'General'
          if (!porPlat[plat]) porPlat[plat] = { total: 0, count: 0 }
          porPlat[plat].total += (c.score || 0)
          porPlat[plat].count++
        })
        var plats = Object.keys(porPlat).map(function(k) {
          return { plataforma: k, avg: Math.round(porPlat[k].total / porPlat[k].count) }
        }).sort(function(a, b) { return b.avg - a.avg })
        if (plats.length > 0) memoria.copiesAprendizaje.mejorPlataforma = plats[0]

        // Problemas recurrentes (los que aparecen en 3+ copies)
        var problemaCount = {}
        todosLosCopies.forEach(function(c) {
          if (c.problemas && Array.isArray(c.problemas)) {
            c.problemas.forEach(function(p) {
              // Normalizar problema (quitar valores especificos)
              var normalizado = p.replace(/\d+/g, 'N').replace(/"[^"]+"/g, '"X"')
              problemaCount[normalizado] = (problemaCount[normalizado] || 0) + 1
            })
          }
        })
        memoria.copiesAprendizaje.problemasRecurrentes = Object.keys(problemaCount)
          .filter(function(k) { return problemaCount[k] >= 3 })
          .map(function(k) { return { problema: k, frecuencia: problemaCount[k] } })
          .sort(function(a, b) { return b.frecuencia - a.frecuencia })
          .slice(0, 5)

        // Bonos recurrentes
        var bonoCount = {}
        todosLosCopies.forEach(function(c) {
          if (c.bonos && Array.isArray(c.bonos)) {
            c.bonos.forEach(function(b) {
              var normalizado = b.replace(/\(\+\d+\)/g, '').trim()
              bonoCount[normalizado] = (bonoCount[normalizado] || 0) + 1
            })
          }
        })
        memoria.copiesAprendizaje.bonosRecurrentes = Object.keys(bonoCount)
          .filter(function(k) { return bonoCount[k] >= 3 })
          .map(function(k) { return { bono: k, frecuencia: bonoCount[k] } })
          .sort(function(a, b) { return b.frecuencia - a.frecuencia })
          .slice(0, 5)
      }
      console.log('   Copies historicos: ' + todosLosCopies.length + ', score promedio: ' + memoria.copiesAprendizaje.scorePromedio)
    }

    // ═══ 2. IDEAS ═══
    var ideasRes = await supabase.from('copilot_ideas')
      .select('titulo, descripcion, categoria, prioridad, estado')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false })
      .limit(50)

    if (ideasRes.data && ideasRes.data.length > 0) {
      memoria.ideasContext.totalIdeas = ideasRes.data.length
      ideasRes.data.forEach(function(idea) {
        var resumen = { titulo: idea.titulo, categoria: idea.categoria, prioridad: idea.prioridad }
        var estado = (idea.estado || 'nueva').toLowerCase()
        if (estado === 'aprobada') memoria.ideasContext.aprobadas.push(resumen)
        else if (estado === 'descartada') memoria.ideasContext.descartadas.push(resumen)
        else if (estado === 'en_progreso') memoria.ideasContext.enProgreso.push(resumen)
        else memoria.ideasContext.nuevas.push(resumen)
      })
      console.log('   Ideas: ' + memoria.ideasContext.totalIdeas + ' total (' + memoria.ideasContext.aprobadas.length + ' aprobadas, ' + memoria.ideasContext.descartadas.length + ' descartadas)')
    }

    // ═══ 3. AUDITORIA HISTORICA ═══
    var auditRes = await supabase.from('copilot_auditorias')
      .select('score_general, criterios, mes, anio, created_at')
      .eq('suscripcion_id', suscripcionId)
      .order('created_at', { ascending: false })
      .limit(6) // ultimos 6 meses

    if (auditRes.data && auditRes.data.length > 0) {
      memoria.auditoriaAprendizaje.ultimoScore = auditRes.data[0].score_general || 0
      memoria.auditoriaAprendizaje.historicoScores = auditRes.data.map(function(a) {
        return { mes: a.mes, anio: a.anio, score: a.score_general || 0 }
      })

      // Tendencia (comparar ultimo vs penultimo)
      if (auditRes.data.length >= 2) {
        var diff = (auditRes.data[0].score_general || 0) - (auditRes.data[1].score_general || 0)
        if (diff > 5) memoria.auditoriaAprendizaje.tendenciaScore = 'subiendo'
        else if (diff < -5) memoria.auditoriaAprendizaje.tendenciaScore = 'bajando'
      }

      // Criterios consistentemente debiles/fuertes (aparecen en 2+ auditorias como top/bottom)
      var criterioScores = {}
      auditRes.data.forEach(function(audit) {
        if (audit.criterios && Array.isArray(audit.criterios)) {
          audit.criterios.forEach(function(c) {
            var nombre = typeof c === 'object' ? (c.nombre || '') : ''
            var score = typeof c === 'object' ? (c.score || 0) : (c || 0)
            if (nombre) {
              if (!criterioScores[nombre]) criterioScores[nombre] = []
              criterioScores[nombre].push(score)
            }
          })
        }
      })
      Object.keys(criterioScores).forEach(function(nombre) {
        var scores = criterioScores[nombre]
        var avg = scores.reduce(function(s, v) { return s + v }, 0) / scores.length
        if (avg <= 5 && scores.length >= 2) {
          memoria.auditoriaAprendizaje.criteriosDebiles.push({ nombre: nombre, avgScore: Math.round(avg * 10) / 10 })
        }
        if (avg >= 8 && scores.length >= 2) {
          memoria.auditoriaAprendizaje.criteriosFuertes.push({ nombre: nombre, avgScore: Math.round(avg * 10) / 10 })
        }
      })

      console.log('   Auditoria: ultimo score=' + memoria.auditoriaAprendizaje.ultimoScore + ', tendencia=' + memoria.auditoriaAprendizaje.tendenciaScore + ', debiles=' + memoria.auditoriaAprendizaje.criteriosDebiles.length)
    }

    // ═══ 4. COMPETENCIA — PATRONES HISTORICOS ═══
    // Cargar posts de los ultimos 60 dias para analizar patrones
    var hace60dias = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    var hace30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    var postsRes = await supabase.from('radar_posts')
      .select('nombre_empresa, red, likes, comments, tipo_post, texto, fecha_scrape')
      .eq('suscripcion_id', suscripcionId)
      .gte('fecha_scrape', hace60dias)
      .order('fecha_scrape', { ascending: false })
      .limit(500)

    if (postsRes.data && postsRes.data.length > 0) {
      var allPosts = postsRes.data
      var porCompetidor = {}

      allPosts.forEach(function(p) {
        var nombre = p.nombre_empresa || 'desconocido'
        if (!porCompetidor[nombre]) {
          porCompetidor[nombre] = {
            nombre: nombre,
            postsUltimos30: 0,
            postsAnterior30: 0,
            likesTotal: 0,
            commentsTotal: 0,
            formatos: {},
            temas: {},
            totalPosts: 0,
          }
        }
        var comp = porCompetidor[nombre]
        comp.totalPosts++

        // Separar periodos
        if (p.fecha_scrape >= hace30dias) comp.postsUltimos30++
        else comp.postsAnterior30++

        comp.likesTotal += (p.likes || 0)
        comp.commentsTotal += (p.comments || 0)

        // Formato
        var formato = detectarFormato(p.tipo_post || '')
        comp.formatos[formato] = (comp.formatos[formato] || 0) + 1

        // Tema
        var tema = detectarTemaBasico(p.texto || '')
        comp.temas[tema] = (comp.temas[tema] || 0) + 1
      })

      // Analizar cada competidor
      var competidores = Object.values(porCompetidor).map(function(comp) {
        var tendencia = 'estable'
        if (comp.postsAnterior30 > 0) {
          var cambio = ((comp.postsUltimos30 - comp.postsAnterior30) / comp.postsAnterior30) * 100
          if (cambio > 30) tendencia = 'creciendo (+' + Math.round(cambio) + '%)'
          else if (cambio < -30) tendencia = 'cayendo (' + Math.round(cambio) + '%)'
        } else if (comp.postsUltimos30 > 0) {
          tendencia = 'nuevo'
        }

        // Formato dominante
        var formatoDominante = Object.keys(comp.formatos).sort(function(a, b) { return comp.formatos[b] - comp.formatos[a] })[0] || 'post'
        var temaDominante = Object.keys(comp.temas).sort(function(a, b) { return comp.temas[b] - comp.temas[a] })[0] || 'general'
        var avgEng = comp.totalPosts > 0 ? Math.round((comp.likesTotal + comp.commentsTotal) / comp.totalPosts) : 0

        return {
          nombre: comp.nombre,
          frecuenciaActual: comp.postsUltimos30,
          frecuenciaAnterior: comp.postsAnterior30,
          tendencia: tendencia,
          formatoDominante: formatoDominante,
          temaDominante: temaDominante,
          avgEngagement: avgEng,
          totalPosts: comp.totalPosts,
        }
      }).sort(function(a, b) { return b.totalPosts - a.totalPosts })

      memoria.competenciaPatrones.competidores = competidores

      if (competidores.length > 0) {
        memoria.competenciaPatrones.competidorMasActivo = competidores[0].nombre

        // Competidor en crecimiento
        var creciendo = competidores.filter(function(c) { return c.tendencia.includes('creciendo') })
          .sort(function(a, b) { return b.frecuenciaActual - a.frecuenciaActual })
        if (creciendo.length > 0) memoria.competenciaPatrones.competidorEnCrecimiento = creciendo[0].nombre

        // Competidor en caida
        var cayendo = competidores.filter(function(c) { return c.tendencia.includes('cayendo') })
        if (cayendo.length > 0) memoria.competenciaPatrones.competidorEnCaida = cayendo[0].nombre
      }

      // Formato y tema ganador global
      var formatoGlobal = {}
      var temaGlobal = {}
      allPosts.forEach(function(p) {
        var eng = (p.likes || 0) + (p.comments || 0)
        var fmt = detectarFormato(p.tipo_post || '')
        var tema = detectarTemaBasico(p.texto || '')
        if (!formatoGlobal[fmt]) formatoGlobal[fmt] = { total: 0, count: 0 }
        formatoGlobal[fmt].total += eng
        formatoGlobal[fmt].count++
        if (!temaGlobal[tema]) temaGlobal[tema] = { total: 0, count: 0 }
        temaGlobal[tema].total += eng
        temaGlobal[tema].count++
      })
      var fmtOrdenados = Object.keys(formatoGlobal).map(function(k) {
        return { formato: k, avgEng: Math.round(formatoGlobal[k].total / formatoGlobal[k].count) }
      }).sort(function(a, b) { return b.avgEng - a.avgEng })
      var temaOrdenados = Object.keys(temaGlobal).map(function(k) {
        return { tema: k, avgEng: Math.round(temaGlobal[k].total / temaGlobal[k].count) }
      }).sort(function(a, b) { return b.avgEng - a.avgEng })

      if (fmtOrdenados.length > 0) memoria.competenciaPatrones.formatoGanadorGlobal = fmtOrdenados[0]
      if (temaOrdenados.length > 0) memoria.competenciaPatrones.temaGanadorGlobal = temaOrdenados[0]

      console.log('   Competencia: ' + competidores.length + ' competidores tracked, ' + allPosts.length + ' posts historicos')
    }

    // ═══ 5. GUIONES PREVIOS ═══
    var guionesRes = await supabase.from('copilot_guiones')
      .select('datos, mes, anio')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false })
      .limit(6)

    if (guionesRes.data && guionesRes.data.length > 0) {
      guionesRes.data.forEach(function(batch) {
        if (Array.isArray(batch.datos)) {
          batch.datos.forEach(function(g) {
            memoria.guionesPrevios.totalGuiones++
            if (g.titulo) memoria.guionesPrevios.titulosPrevios.push(g.titulo)
            if (g.tipo) memoria.guionesPrevios.tiposPrevios.push(g.tipo)
          })
        }
      })
      console.log('   Guiones previos: ' + memoria.guionesPrevios.totalGuiones)
    }

  } catch (e) {
    console.error('   MEMORIA ERROR: ' + e.message)
  }

  console.log('   === MEMORIA CARGADA ===\n')
  return memoria
}

// ═══════════════════════════════════════════════
// GENERAR CONTEXTO TEXTUAL PARA INYECTAR EN PROMPTS
// ═══════════════════════════════════════════════
function generarContextoAprendizaje(memoria) {
  if (!memoria) return ''
  var ctx = ''

  // 1. Aprendizaje de copies
  var ca = memoria.copiesAprendizaje
  if (ca.totalCopiesHistoricos > 0) {
    ctx += '\n═══ APRENDIZAJE DE COPIES (basado en ' + ca.totalCopiesHistoricos + ' copies historicos) ═══\n'
    ctx += '- Score promedio historico: ' + ca.scorePromedio + '/95\n'
    if (ca.mejorAngulo) ctx += '- MEJOR angulo: "' + ca.mejorAngulo.angulo + '" (score avg ' + ca.mejorAngulo.avg + ', ' + ca.mejorAngulo.count + ' copies) — PRIORIZAR este angulo\n'
    if (ca.peorAngulo && ca.peorAngulo.angulo !== ca.mejorAngulo.angulo) ctx += '- PEOR angulo: "' + ca.peorAngulo.angulo + '" (score avg ' + ca.peorAngulo.avg + ') — mejorar o evitar\n'
    if (ca.mejorPlataforma) ctx += '- Mejor plataforma: ' + ca.mejorPlataforma.plataforma + ' (score avg ' + ca.mejorPlataforma.avg + ')\n'
    if (ca.palabrasPromedio > 0) ctx += '- Largo optimo de copies aprobados: ~' + ca.palabrasPromedio + ' palabras\n'
    if (ca.problemasRecurrentes.length > 0) {
      ctx += '- PROBLEMAS RECURRENTES (evitar a toda costa):\n'
      ca.problemasRecurrentes.forEach(function(p) {
        ctx += '  * ' + p.problema + ' (ocurrio ' + p.frecuencia + ' veces)\n'
      })
    }
    if (ca.bonosRecurrentes.length > 0) {
      ctx += '- FACTORES DE EXITO (replicar siempre):\n'
      ca.bonosRecurrentes.forEach(function(b) {
        ctx += '  * ' + b.bono + ' (logrado ' + b.frecuencia + ' veces)\n'
      })
    }
  }

  // 2. Ideas aprobadas/descartadas
  var ic = memoria.ideasContext
  if (ic.totalIdeas > 0) {
    ctx += '\n═══ IDEAS DEL CLIENTE ═══\n'
    if (ic.aprobadas.length > 0) {
      ctx += '- IDEAS APROBADAS POR EL CLIENTE (PRIORIZAR para generar contenido):\n'
      ic.aprobadas.slice(0, 5).forEach(function(idea) {
        ctx += '  * "' + idea.titulo + '" [' + idea.categoria + ', prioridad ' + idea.prioridad + ']\n'
      })
    }
    if (ic.descartadas.length > 0) {
      ctx += '- IDEAS DESCARTADAS (NO generar contenido sobre estos temas):\n'
      ic.descartadas.slice(0, 5).forEach(function(idea) {
        ctx += '  * "' + idea.titulo + '" [' + idea.categoria + ']\n'
      })
    }
    if (ic.enProgreso.length > 0) {
      ctx += '- IDEAS EN PROGRESO (no duplicar, ya se estan trabajando):\n'
      ic.enProgreso.slice(0, 3).forEach(function(idea) {
        ctx += '  * "' + idea.titulo + '"\n'
      })
    }
  }

  // 3. Auditoria
  var aa = memoria.auditoriaAprendizaje
  if (aa.ultimoScore > 0) {
    ctx += '\n═══ APRENDIZAJE DE AUDITORIA ═══\n'
    ctx += '- Ultimo score: ' + aa.ultimoScore + '/100, tendencia: ' + aa.tendenciaScore + '\n'
    if (aa.criteriosDebiles.length > 0) {
      ctx += '- AREAS DEBILES (el contenido DEBE mejorar esto):\n'
      aa.criteriosDebiles.forEach(function(c) {
        ctx += '  * ' + c.nombre + ' (promedio ' + c.avgScore + '/10) — COMPENSAR con contenido que fortalezca esta area\n'
      })
    }
    if (aa.criteriosFuertes.length > 0) {
      ctx += '- AREAS FUERTES (mantener):\n'
      aa.criteriosFuertes.forEach(function(c) {
        ctx += '  * ' + c.nombre + ' (promedio ' + c.avgScore + '/10)\n'
      })
    }
  }

  // 4. Competencia
  var cp = memoria.competenciaPatrones
  if (cp.competidores.length > 0) {
    ctx += '\n═══ PATRONES DE COMPETENCIA (60 dias) ═══\n'
    cp.competidores.forEach(function(c) {
      ctx += '- ' + c.nombre + ': ' + c.frecuenciaActual + ' posts (30d), tendencia ' + c.tendencia
        + ', formato dom. ' + c.formatoDominante + ', tema dom. ' + c.temaDominante
        + ', eng prom ' + c.avgEngagement + '\n'
    })
    if (cp.competidorEnCrecimiento) ctx += '- ALERTA: ' + cp.competidorEnCrecimiento + ' esta CRECIENDO — monitorear de cerca\n'
    if (cp.competidorEnCaida) ctx += '- OPORTUNIDAD: ' + cp.competidorEnCaida + ' esta CAYENDO — oportunidad de capturar su audiencia\n'
    if (cp.formatoGanadorGlobal) ctx += '- Formato con mas engagement: ' + cp.formatoGanadorGlobal.formato + ' (avg ' + cp.formatoGanadorGlobal.avgEng + ' eng)\n'
    if (cp.temaGanadorGlobal) ctx += '- Tema con mas engagement: ' + cp.temaGanadorGlobal.tema + ' (avg ' + cp.temaGanadorGlobal.avgEng + ' eng)\n'
  }

  return ctx
}

// ═══════════════════════════════════════════════
// GENERAR RECOMENDACIONES PARA EL BRIEF
// (basado en auditoria + ideas + performance)
// ═══════════════════════════════════════════════
function generarRecomendacionesBrief(memoria) {
  if (!memoria) return []
  var recs = []

  // Basado en auditoria
  var aa = memoria.auditoriaAprendizaje
  if (aa.criteriosDebiles.length > 0) {
    aa.criteriosDebiles.forEach(function(c) {
      if (c.nombre.includes('Frecuencia')) recs.push('DEBILIDAD DETECTADA: frecuencia de publicacion baja — el brief debe enfatizar publicar mas seguido, minimo 3-4 posts/semana')
      if (c.nombre.includes('Engagement')) recs.push('DEBILIDAD DETECTADA: engagement bajo — el brief debe priorizar formatos interactivos (preguntas, polls, carruseles educativos)')
      if (c.nombre.includes('Variedad')) recs.push('DEBILIDAD DETECTADA: poca variedad de formatos — el brief debe exigir mix de reels, carruseles, imagenes y articulos')
      if (c.nombre.includes('Consistencia')) recs.push('DEBILIDAD DETECTADA: inconsistencia visual — el brief debe establecer dias fijos de publicacion')
      if (c.nombre.includes('hashtags')) recs.push('DEBILIDAD DETECTADA: uso pobre de hashtags — el brief debe incluir set de hashtags obligatorios')
      if (c.nombre.includes('Interaccion')) recs.push('DEBILIDAD DETECTADA: baja interaccion — el brief debe incluir CTAs que fomenten comentarios y compartidos')
      if (c.nombre.includes('Cobertura')) recs.push('DEBILIDAD DETECTADA: territorios del brief no se estan cubriendo — reducir territorios o generar mas contenido')
      if (c.nombre.includes('Alineacion')) recs.push('DEBILIDAD DETECTADA: copies no siguen el brief — reforzar reglas y simplificar directrices')
    })
  }

  // Basado en tendencia
  if (aa.tendenciaScore === 'bajando') {
    recs.push('ALERTA: el score de auditoria esta BAJANDO — revisar estrategia y ajustar territorios')
  }

  // Basado en ideas aprobadas
  var ic = memoria.ideasContext
  if (ic.aprobadas.length > 0) {
    recs.push('El cliente tiene ' + ic.aprobadas.length + ' ideas APROBADAS — el brief debe incorporar estas ideas como prioridad')
  }

  // Basado en competencia
  var cp = memoria.competenciaPatrones
  if (cp.competidorEnCrecimiento) {
    recs.push('COMPETIDOR CRECIENDO: ' + cp.competidorEnCrecimiento + ' — el brief debe incluir estrategia de contraataque')
  }
  if (cp.formatoGanadorGlobal && cp.formatoGanadorGlobal.avgEng > 50) {
    recs.push('El formato "' + cp.formatoGanadorGlobal.formato + '" genera mas engagement (avg ' + cp.formatoGanadorGlobal.avgEng + ') — priorizar en la grilla')
  }

  // Basado en copies
  var ca = memoria.copiesAprendizaje
  if (ca.problemasRecurrentes.length > 0) {
    recs.push('PROBLEMA RECURRENTE en copies: "' + ca.problemasRecurrentes[0].problema + '" — agregar regla explicita al brief')
  }

  return recs
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function detectarFormato(tipo) {
  var t = (tipo || '').toLowerCase()
  if (t.includes('video') || t.includes('reel')) return 'video/reel'
  if (t.includes('sidecar') || t.includes('carousel') || t.includes('carrusel')) return 'carrusel'
  return 'imagen'
}

function detectarTemaBasico(texto) {
  var t = (texto || '').toLowerCase()
  if (t.includes('oferta') || t.includes('descuento') || t.includes('promo') || t.includes('precio')) return 'promocional'
  if (t.includes('equipo') || t.includes('detras') || t.includes('cultura') || t.includes('historia')) return 'marca_humana'
  if (t.includes('tip') || t.includes('consejo') || t.includes('como') || t.includes('guia') || t.includes('aprende')) return 'educativo'
  if (t.includes('cliente') || t.includes('testimonio') || t.includes('caso') || t.includes('resultado')) return 'caso_exito'
  if (t.includes('tendencia') || t.includes('novedad') || t.includes('nuevo') || t.includes('lanz')) return 'tendencia'
  if (t.includes('dato') || t.includes('estadistic') || t.includes('estudio') || t.includes('%')) return 'datos_mercado'
  if (t.includes('evento') || t.includes('webinar') || t.includes('conferencia')) return 'eventos'
  return 'general'
}

module.exports = {
  cargarMemoria: cargarMemoria,
  generarContextoAprendizaje: generarContextoAprendizaje,
  generarRecomendacionesBrief: generarRecomendacionesBrief,
}
