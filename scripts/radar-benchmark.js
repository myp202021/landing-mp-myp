// radar-benchmark.js
// Genera BENCHMARK COMPETITIVO MENSUAL — reporte estrategico tipo consultora
// Usa Claude Sonnet (ANTHROPIC_API_KEY_GRILLAS) para analisis de maxima calidad
// Se llama desde radar-clipping.js en modo mensual
// Guarda en tabla copilot_benchmarks (suscripcion_id, mes, anio, datos JSONB, created_at)
//
// Export: generarBenchmark(posts, empresas, perfil, supabase, suscripcionId, brief, memoria, postsCliente)

var fetch = require('node-fetch')
var path = require('path')
var industriaModule = require('./radar-industria.js')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════

function safeInt(v) { return parseInt(v) || 0 }

function promedio(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce(function(s, v) { return s + v }, 0) / arr.length
}

function mediana(arr) {
  if (!arr || arr.length === 0) return 0
  var sorted = arr.slice().sort(function(a, b) { return a - b })
  var mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function stddev(arr) {
  if (!arr || arr.length === 0) return 0
  var avg = promedio(arr)
  var sqDiffs = arr.map(function(v) { return Math.pow(v - avg, 2) })
  return Math.sqrt(promedio(sqDiffs))
}

// Dia de la semana en espanol
var DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

function diaSemana(fecha) {
  try { return DIAS[new Date(fecha).getDay()] || 'desconocido' }
  catch (e) { return 'desconocido' }
}

// ═══════════════════════════════════════════════
// METRICAS POR COMPETIDOR
// ═══════════════════════════════════════════════

function calcularMetricasCompetidor(posts, nombre) {
  var misPosts = posts.filter(function(p) {
    return (p.nombre || p.handle || '').toLowerCase() === nombre.toLowerCase()
  })

  if (misPosts.length === 0) {
    return {
      nombre: nombre,
      total_posts: 0,
      avg_engagement: 0,
      median_engagement: 0,
      stddev_engagement: 0,
      max_engagement: 0,
      top_post: null,
      formatos: {},
      formato_dominante: null,
      temas: {},
      tema_dominante: null,
      dias_publicacion: {},
      dia_mas_activo: null,
      redes: {},
    }
  }

  // Engagement por post
  var engagements = misPosts.map(function(p) {
    return safeInt(p.likes) + safeInt(p.comments)
  })

  // Top post
  var topIdx = 0
  var topEng = engagements[0]
  for (var i = 1; i < engagements.length; i++) {
    if (engagements[i] > topEng) { topEng = engagements[i]; topIdx = i }
  }
  var topPost = misPosts[topIdx]

  // Formatos (tipo de post)
  var formatos = {}
  misPosts.forEach(function(p) {
    var tipo = (p.type || p.tipo_post || 'post').toLowerCase()
    if (!formatos[tipo]) formatos[tipo] = { count: 0, totalEng: 0 }
    formatos[tipo].count++
    formatos[tipo].totalEng += safeInt(p.likes) + safeInt(p.comments)
  })
  var formatoDominante = null
  var maxFormatoCount = 0
  Object.keys(formatos).forEach(function(f) {
    if (formatos[f].count > maxFormatoCount) { maxFormatoCount = formatos[f].count; formatoDominante = f }
  })

  // Temas (deteccion basica por keywords)
  var temas = {}
  misPosts.forEach(function(p) {
    var texto = (p.texto || '').toLowerCase()
    var tema = detectarTema(texto)
    if (!temas[tema]) temas[tema] = { count: 0, totalEng: 0 }
    temas[tema].count++
    temas[tema].totalEng += safeInt(p.likes) + safeInt(p.comments)
  })
  var temaDominante = null
  var maxTemaCount = 0
  Object.keys(temas).forEach(function(t) {
    if (temas[t].count > maxTemaCount) { maxTemaCount = temas[t].count; temaDominante = t }
  })

  // Dias de publicacion
  var dias = {}
  misPosts.forEach(function(p) {
    var dia = diaSemana(p.timestamp || p.fecha_post || p.fecha)
    if (!dias[dia]) dias[dia] = 0
    dias[dia]++
  })
  var diaMasActivo = null
  var maxDia = 0
  Object.keys(dias).forEach(function(d) {
    if (dias[d] > maxDia) { maxDia = dias[d]; diaMasActivo = d }
  })

  // Redes sociales
  var redes = {}
  misPosts.forEach(function(p) {
    var red = (p.red || 'instagram').toLowerCase()
    if (!redes[red]) redes[red] = { count: 0, totalEng: 0 }
    redes[red].count++
    redes[red].totalEng += safeInt(p.likes) + safeInt(p.comments)
  })

  return {
    nombre: nombre,
    total_posts: misPosts.length,
    avg_engagement: Math.round(promedio(engagements)),
    median_engagement: Math.round(mediana(engagements)),
    stddev_engagement: Math.round(stddev(engagements)),
    max_engagement: topEng,
    top_post: {
      texto: (topPost.texto || '').substring(0, 500),
      likes: safeInt(topPost.likes),
      comments: safeInt(topPost.comments),
      tipo: topPost.type || topPost.tipo_post || 'post',
      red: topPost.red || 'instagram',
      url: topPost.url || null,
    },
    formatos: formatos,
    formato_dominante: formatoDominante,
    temas: temas,
    tema_dominante: temaDominante,
    dias_publicacion: dias,
    dia_mas_activo: diaMasActivo,
    redes: redes,
  }
}

function detectarTema(texto) {
  if (texto.includes('oferta') || texto.includes('descuento') || texto.includes('promo') || texto.includes('precio') || texto.includes('% off')) return 'promocional'
  if (texto.includes('equipo') || texto.includes('detras') || texto.includes('cultura') || texto.includes('historia') || texto.includes('quienes somos')) return 'marca_humana'
  if (texto.includes('tip') || texto.includes('consejo') || texto.includes('como') || texto.includes('guia') || texto.includes('aprende') || texto.includes('sabias')) return 'educativo'
  if (texto.includes('cliente') || texto.includes('testimonio') || texto.includes('caso') || texto.includes('resultado') || texto.includes('exito')) return 'caso_exito'
  if (texto.includes('tendencia') || texto.includes('novedad') || texto.includes('nuevo') || texto.includes('lanz')) return 'tendencia'
  if (texto.includes('dato') || texto.includes('estadistic') || texto.includes('estudio') || texto.includes('%') || texto.includes('informe')) return 'datos_mercado'
  if (texto.includes('evento') || texto.includes('webinar') || texto.includes('conferencia') || texto.includes('feria')) return 'eventos'
  if (texto.includes('feliz') || texto.includes('felicitaciones') || texto.includes('navidad') || texto.includes('fiestas') || texto.includes('dia de')) return 'estacional'
  if (texto.includes('trabaj') || texto.includes('empleo') || texto.includes('vacante') || texto.includes('unete')) return 'reclutamiento'
  return 'general'
}

// ═══════════════════════════════════════════════
// TENDENCIA: comparar este mes vs periodo anterior
// ═══════════════════════════════════════════════

function calcularTendencia(postsActuales, postsAnteriores, nombre) {
  var filtrar = function(posts) {
    return posts.filter(function(p) {
      return (p.nombre || p.handle || '').toLowerCase() === nombre.toLowerCase()
    })
  }

  var actuales = filtrar(postsActuales)
  var anteriores = filtrar(postsAnteriores)

  var engActual = promedio(actuales.map(function(p) { return safeInt(p.likes) + safeInt(p.comments) }))
  var engAnterior = promedio(anteriores.map(function(p) { return safeInt(p.likes) + safeInt(p.comments) }))

  var freqActual = actuales.length
  var freqAnterior = anteriores.length

  var engVariacion = engAnterior > 0 ? Math.round(((engActual - engAnterior) / engAnterior) * 100) : null
  var freqVariacion = freqAnterior > 0 ? Math.round(((freqActual - freqAnterior) / freqAnterior) * 100) : null

  return {
    engagement_actual: Math.round(engActual),
    engagement_anterior: Math.round(engAnterior),
    engagement_variacion_pct: engVariacion,
    frecuencia_actual: freqActual,
    frecuencia_anterior: freqAnterior,
    frecuencia_variacion_pct: freqVariacion,
    alerta_crecimiento: engVariacion !== null && engVariacion > 30,
    alerta_caida: engVariacion !== null && engVariacion < -30,
  }
}

// ═══════════════════════════════════════════════
// CONTENT GAP ANALYSIS
// ═══════════════════════════════════════════════

function calcularContentGaps(metricasCompetidores, metricasCliente) {
  // Temas que usan competidores pero no el cliente
  var temasCompetencia = {}
  metricasCompetidores.forEach(function(m) {
    Object.keys(m.temas || {}).forEach(function(t) {
      if (!temasCompetencia[t]) temasCompetencia[t] = { competidores: 0, totalPosts: 0, avgEng: 0 }
      temasCompetencia[t].competidores++
      temasCompetencia[t].totalPosts += m.temas[t].count
      temasCompetencia[t].avgEng += m.temas[t].totalEng
    })
  })
  // Normalizar avgEng
  Object.keys(temasCompetencia).forEach(function(t) {
    if (temasCompetencia[t].totalPosts > 0) {
      temasCompetencia[t].avgEng = Math.round(temasCompetencia[t].avgEng / temasCompetencia[t].totalPosts)
    }
  })

  var temasCliente = {}
  if (metricasCliente) {
    Object.keys(metricasCliente.temas || {}).forEach(function(t) {
      temasCliente[t] = true
    })
  }

  var gaps = []
  Object.keys(temasCompetencia).forEach(function(t) {
    if (!temasCliente[t] && t !== 'general') {
      gaps.push({
        tema: t,
        competidores_que_lo_usan: temasCompetencia[t].competidores,
        posts_totales: temasCompetencia[t].totalPosts,
        avg_engagement: temasCompetencia[t].avgEng,
      })
    }
  })

  // Formatos gap
  var formatosCompetencia = {}
  metricasCompetidores.forEach(function(m) {
    Object.keys(m.formatos || {}).forEach(function(f) {
      if (!formatosCompetencia[f]) formatosCompetencia[f] = { competidores: 0, totalPosts: 0, avgEng: 0 }
      formatosCompetencia[f].competidores++
      formatosCompetencia[f].totalPosts += m.formatos[f].count
      formatosCompetencia[f].avgEng += m.formatos[f].totalEng
    })
  })
  Object.keys(formatosCompetencia).forEach(function(f) {
    if (formatosCompetencia[f].totalPosts > 0) {
      formatosCompetencia[f].avgEng = Math.round(formatosCompetencia[f].avgEng / formatosCompetencia[f].totalPosts)
    }
  })

  var formatosCliente = {}
  if (metricasCliente) {
    Object.keys(metricasCliente.formatos || {}).forEach(function(f) {
      formatosCliente[f] = true
    })
  }

  var formatoGaps = []
  Object.keys(formatosCompetencia).forEach(function(f) {
    if (!formatosCliente[f]) {
      formatoGaps.push({
        formato: f,
        competidores_que_lo_usan: formatosCompetencia[f].competidores,
        posts_totales: formatosCompetencia[f].totalPosts,
        avg_engagement: formatosCompetencia[f].avgEng,
      })
    }
  })

  return {
    temas_no_cubiertos: gaps.sort(function(a, b) { return b.avg_engagement - a.avg_engagement }),
    formatos_no_cubiertos: formatoGaps.sort(function(a, b) { return b.avg_engagement - a.avg_engagement }),
  }
}

// ═══════════════════════════════════════════════
// CARGAR POSTS ANTERIORES (30 dias previos al periodo actual)
// ═══════════════════════════════════════════════

async function cargarPostsAnteriores(supabase, suscripcionId) {
  var ahora = new Date()
  var hace60 = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000)
  var hace30 = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)

  try {
    var res = await supabase.from('radar_posts')
      .select('nombre_empresa, handle, red, likes, comments, tipo_post, texto, fecha_post')
      .eq('suscripcion_id', suscripcionId)
      .gte('fecha_post', hace60.toISOString())
      .lt('fecha_post', hace30.toISOString())
      .limit(500)

    if (res.error) {
      console.log('   BENCHMARK: error cargando posts anteriores: ' + res.error.message)
      return []
    }

    return (res.data || []).map(function(p) {
      return {
        nombre: p.nombre_empresa,
        handle: p.handle,
        red: p.red,
        likes: safeInt(p.likes),
        comments: safeInt(p.comments),
        type: p.tipo_post,
        texto: p.texto,
        timestamp: p.fecha_post,
      }
    })
  } catch (e) {
    console.log('   BENCHMARK: excepcion cargando posts anteriores: ' + e.message)
    return []
  }
}

// ═══════════════════════════════════════════════
// CARGAR CONTENIDO GENERADO (copies del cliente)
// ═══════════════════════════════════════════════

async function cargarContenidoGenerado(supabase, suscripcionId) {
  try {
    var hace30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    var res = await supabase.from('radar_contenido')
      .select('datos, tipo, created_at')
      .eq('suscripcion_id', suscripcionId)
      .gte('created_at', hace30.toISOString())
      .order('id', { ascending: false })
      .limit(10)

    if (res.error) return []
    return res.data || []
  } catch (e) {
    console.log('   BENCHMARK: error cargando contenido: ' + e.message)
    return []
  }
}

// ═══════════════════════════════════════════════
// LLAMADA A CLAUDE SONNET — ANALISIS ESTRATEGICO
// ═══════════════════════════════════════════════

async function llamarClaude(prompt, maxTokens) {
  maxTokens = maxTokens || 4000
  if (!ANTHROPIC_KEY) throw new Error('ANTHROPIC_API_KEY_GRILLAS no configurada')

  var res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    var errText = await res.text()
    throw new Error('Claude API HTTP ' + res.status + ': ' + errText.substring(0, 300))
  }

  var data = await res.json()
  return (data.content && data.content[0] && data.content[0].text) || ''
}

// ═══════════════════════════════════════════════
// CONSTRUIR PROMPT DE BENCHMARK
// ═══════════════════════════════════════════════

function construirPrompt(perfil, metricasCompetidores, metricasCliente, tendencias, contentGaps, brief, memoria, industria, postsTop, contenidoGenerado) {
  var ahora = new Date()
  var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  var mesActual = meses[ahora.getMonth()]
  var anioActual = ahora.getFullYear()
  var nombreCliente = (perfil && perfil.nombre) || 'el cliente'

  var p = 'Eres un CONSULTOR ESTRATEGICO senior de marketing digital con 20 anos de experiencia. '
    + 'Trabajas para la agencia Muller y Perez (M&P), la mejor agencia de performance marketing de Chile. '
    + 'Generas reportes de benchmark competitivo de ALTISIMA calidad, como los de McKinsey o Accenture, pero aplicados a marketing digital.\n\n'
    + 'Tu trabajo es analizar datos REALES de la competencia del ultimo mes y entregar un reporte estrategico con insights accionables.\n\n'

  // Contexto del cliente
  p += '══════════════════════════════════\n'
  p += 'CLIENTE: ' + nombreCliente + '\n'
  p += '══════════════════════════════════\n'
  if (perfil) {
    if (perfil.rubro) p += '- Rubro: ' + perfil.rubro + '\n'
    if (perfil.descripcion) p += '- Descripcion: ' + perfil.descripcion + '\n'
    if (perfil.propuesta_valor) p += '- Propuesta de valor: ' + perfil.propuesta_valor + '\n'
    if (perfil.diferenciadores && perfil.diferenciadores.length) p += '- Diferenciadores: ' + perfil.diferenciadores.join(', ') + '\n'
    if (perfil.tono) p += '- Tono de marca: ' + perfil.tono + '\n'
  }
  p += '- Periodo analizado: ' + mesActual + ' ' + anioActual + '\n\n'

  // Brief estrategico si existe
  if (brief) {
    p += '══════════════════════════════════\n'
    p += 'BRIEF ESTRATEGICO VIGENTE:\n'
    p += '══════════════════════════════════\n'
    if (brief.propuesta_valor_unica) p += '- PVU: ' + brief.propuesta_valor_unica + '\n'
    if (brief.territorios_contenido && Array.isArray(brief.territorios_contenido)) {
      p += '- Territorios de contenido:\n'
      brief.territorios_contenido.forEach(function(t) {
        if (typeof t === 'object') p += '  * ' + (t.territorio || t.nombre || '') + ': ' + (t.justificacion || '') + '\n'
        else p += '  * ' + t + '\n'
      })
    }
    if (brief.competidores_analizados && Array.isArray(brief.competidores_analizados)) {
      p += '- Competidores identificados:\n'
      brief.competidores_analizados.forEach(function(c) {
        p += '  * ' + (c.nombre || '') + (c.fortaleza ? ' — F: ' + c.fortaleza : '') + (c.debilidad ? ' — D: ' + c.debilidad : '') + '\n'
      })
    }
    p += '\n'
  }

  // Memoria del agente
  if (memoria && memoria.resumen) {
    p += '══════════════════════════════════\n'
    p += 'MEMORIA DEL AGENTE (aprendizajes previos):\n'
    p += '══════════════════════════════════\n'
    p += memoria.resumen + '\n'
    if (memoria.reglas_aprendidas && memoria.reglas_aprendidas.length > 0) {
      p += 'Reglas aprendidas:\n'
      memoria.reglas_aprendidas.forEach(function(r) { p += '- ' + r + '\n' })
    }
    p += '\n'
  }

  // Datos de industria (predictor M&P)
  if (industria) {
    p += '══════════════════════════════════\n'
    p += 'BENCHMARKS DE INDUSTRIA (Predictor M&P — datos Chile):\n'
    p += '══════════════════════════════════\n'
    p += '- Industria: ' + (industria.nombre || '') + '\n'
    if (industria.mejor_plataforma) p += '- Mejor plataforma paid: ' + industria.mejor_plataforma + '\n'
    if (industria.ciclo_venta) p += '- Ciclo de venta: ' + industria.ciclo_venta + '\n'
    if (industria.estacionalidad) p += '- Estacionalidad: ' + industria.estacionalidad + '\n'
    if (industria.roas_avg) p += '- ROAS promedio: ' + industria.roas_avg + 'x (rango ' + (industria.roas_min || '?') + '-' + (industria.roas_top || '?') + ')\n'
    if (industria.cpl_avg) p += '- CPL promedio: $' + industria.cpl_avg.toLocaleString() + ' CLP\n'
    if (industria.kpis && industria.kpis.length) p += '- KPIs clave: ' + industria.kpis.join(', ') + '\n'
    p += '\n'
  }

  // Metricas por competidor
  p += '══════════════════════════════════\n'
  p += 'DATOS DE COMPETIDORES (ultimo mes — datos reales):\n'
  p += '══════════════════════════════════\n'
  metricasCompetidores.forEach(function(m) {
    p += '\n--- ' + m.nombre + ' ---\n'
    p += '  Posts: ' + m.total_posts + ' | Engagement avg: ' + m.avg_engagement + ' | Mediana: ' + m.median_engagement + ' | Max: ' + m.max_engagement + '\n'
    p += '  Formato dominante: ' + (m.formato_dominante || 'N/A') + '\n'
    p += '  Tema dominante: ' + (m.tema_dominante || 'N/A') + '\n'
    p += '  Dia mas activo: ' + (m.dia_mas_activo || 'N/A') + '\n'
    if (m.top_post) {
      p += '  Top post (' + m.top_post.red + ', ' + m.top_post.tipo + ', eng: ' + (m.top_post.likes + m.top_post.comments) + '): "' + m.top_post.texto.substring(0, 250) + '"\n'
    }
    // Formatos detalle
    var formatoList = Object.keys(m.formatos).map(function(f) {
      return f + ': ' + m.formatos[f].count + ' posts (avg eng: ' + Math.round(m.formatos[f].totalEng / m.formatos[f].count) + ')'
    })
    if (formatoList.length > 0) p += '  Formatos: ' + formatoList.join(', ') + '\n'
    // Temas detalle
    var temaList = Object.keys(m.temas).map(function(t) {
      return t + ': ' + m.temas[t].count + ' posts (avg eng: ' + Math.round(m.temas[t].totalEng / m.temas[t].count) + ')'
    })
    if (temaList.length > 0) p += '  Temas: ' + temaList.join(', ') + '\n'
    // Desglose por red
    if (m.redes) {
      var redesList = Object.keys(m.redes).map(function(r) {
        return r + ': ' + m.redes[r].count + ' posts (avg eng: ' + Math.round(m.redes[r].totalEng / m.redes[r].count) + ')'
      })
      if (redesList.length > 1) p += '  Redes: ' + redesList.join(' | ') + '\n'
    }
  })
  p += '\n'

  // Tendencias vs mes anterior
  p += '══════════════════════════════════\n'
  p += 'TENDENCIAS vs MES ANTERIOR:\n'
  p += '══════════════════════════════════\n'
  tendencias.forEach(function(t) {
    var engLabel = t.engagement_variacion_pct !== null ? (t.engagement_variacion_pct >= 0 ? '+' : '') + t.engagement_variacion_pct + '%' : 'sin datos previos'
    var freqLabel = t.frecuencia_variacion_pct !== null ? (t.frecuencia_variacion_pct >= 0 ? '+' : '') + t.frecuencia_variacion_pct + '%' : 'sin datos previos'
    p += '- ' + t.nombre + ': engagement ' + engLabel + ' | frecuencia ' + freqLabel
    if (t.alerta_crecimiento) p += ' [ALERTA: crecimiento acelerado]'
    if (t.alerta_caida) p += ' [ALERTA: caida significativa]'
    p += '\n'
  })
  p += '\n'

  // Metricas del cliente (si hay posts propios)
  if (metricasCliente && metricasCliente.total_posts > 0) {
    p += '══════════════════════════════════\n'
    p += 'METRICAS DEL CLIENTE (posts propios):\n'
    p += '══════════════════════════════════\n'
    p += '  Posts: ' + metricasCliente.total_posts + ' | Engagement avg: ' + metricasCliente.avg_engagement + ' | Max: ' + metricasCliente.max_engagement + '\n'
    p += '  Formato dominante: ' + (metricasCliente.formato_dominante || 'N/A') + '\n'
    p += '  Tema dominante: ' + (metricasCliente.tema_dominante || 'N/A') + '\n'
    p += '  Dia mas activo: ' + (metricasCliente.dia_mas_activo || 'N/A') + '\n'
    p += '\n'
  }

  // Content gaps
  p += '══════════════════════════════════\n'
  p += 'CONTENT GAPS (temas/formatos que la competencia usa y el cliente no):\n'
  p += '══════════════════════════════════\n'
  if (contentGaps.temas_no_cubiertos.length > 0) {
    p += 'Temas no cubiertos:\n'
    contentGaps.temas_no_cubiertos.forEach(function(g) {
      p += '- ' + g.tema + ': ' + g.competidores_que_lo_usan + ' competidores, ' + g.posts_totales + ' posts, avg eng: ' + g.avg_engagement + '\n'
    })
  } else {
    p += 'No se detectaron gaps tematicos significativos.\n'
  }
  if (contentGaps.formatos_no_cubiertos.length > 0) {
    p += 'Formatos no cubiertos:\n'
    contentGaps.formatos_no_cubiertos.forEach(function(g) {
      p += '- ' + g.formato + ': ' + g.competidores_que_lo_usan + ' competidores, ' + g.posts_totales + ' posts, avg eng: ' + g.avg_engagement + '\n'
    })
  }
  p += '\n'

  // Top 10 posts globales
  p += '══════════════════════════════════\n'
  p += 'TOP 10 POSTS MAS EXITOSOS DEL MES (toda la competencia):\n'
  p += '══════════════════════════════════\n'
  postsTop.forEach(function(post, idx) {
    var eng = safeInt(post.likes) + safeInt(post.comments)
    p += (idx + 1) + '. [' + (post.red || 'IG') + '] ' + (post.nombre || post.handle) + ' | Eng: ' + eng + ' (L:' + safeInt(post.likes) + ' C:' + safeInt(post.comments) + ') | ' + (post.type || 'post')
    p += '\n   "' + (post.texto || '').substring(0, 200) + '"\n'
  })
  p += '\n'

  // Contenido generado por Copilot (para referencia)
  if (contenidoGenerado && contenidoGenerado.length > 0) {
    p += '══════════════════════════════════\n'
    p += 'CONTENIDO YA GENERADO POR COPILOT ESTE MES:\n'
    p += '══════════════════════════════════\n'
    contenidoGenerado.forEach(function(item) {
      if (Array.isArray(item.datos)) {
        item.datos.forEach(function(c) {
          p += '- [' + (c.plataforma || '') + ' ' + (c.tipo || '') + '] ' + (c.titulo || '') + (c.score ? ' (score: ' + c.score + ')' : '') + '\n'
        })
      }
    })
    p += '\n'
  }

  // Instrucciones de output
  p += '══════════════════════════════════\n'
  p += 'INSTRUCCIONES — GENERA EL BENCHMARK MENSUAL:\n'
  p += '══════════════════════════════════\n\n'
  p += 'Responde en JSON valido con esta estructura exacta:\n\n'
  p += '{\n'
  p += '  "resumen_ejecutivo": "2-3 parrafos. Que paso este mes en el panorama competitivo. '
  p += 'Tendencias principales. Oportunidades inmediatas para el cliente. Escribe como consultor estrategico, no como chatbot.",\n\n'
  p += '  "analisis_competidores": [\n'
  p += '    {\n'
  p += '      "nombre": "nombre del competidor",\n'
  p += '      "posicionamiento": "como se posiciona este mes (1-2 oraciones)",\n'
  p += '      "fortalezas": ["fortaleza 1", "fortaleza 2"],\n'
  p += '      "debilidades": ["debilidad 1", "debilidad 2"],\n'
  p += '      "oportunidad_para_cliente": "que puede hacer el cliente para ganarle a este competidor (1-2 oraciones, especifico)"\n'
  p += '    }\n'
  p += '  ],\n\n'
  p += '  "content_gap_analysis": {\n'
  p += '    "resumen": "1 parrafo explicando los gaps mas importantes",\n'
  p += '    "gaps_prioritarios": [\n'
  p += '      {\n'
  p += '        "gap": "descripcion del gap",\n'
  p += '        "impacto_estimado": "alto|medio|bajo",\n'
  p += '        "recomendacion": "como aprovecharlo"\n'
  p += '      }\n'
  p += '    ]\n'
  p += '  },\n\n'
  p += '  "cuadro_comparativo": [\n'
  p += '    {\n'
  p += '      "dimension": "Tono de comunicacion|Concepto principal|Formato dominante|Frecuencia|Engagement promedio|Canales activos|Tipo de contenido|Mensaje clave",\n'
  p += '      "valores": {\n'
  p += '        "competidor1": "valor para esta dimension",\n'
  p += '        "competidor2": "valor",\n'
  p += '        "cliente": "valor del cliente si hay datos"\n'
  p += '      },\n'
  p += '      "mejor": "quien lo hace mejor en esta dimension",\n'
  p += '      "oportunidad": "que puede hacer el cliente diferente"\n'
  p += '    }\n'
  p += '  ],\n\n'
  p += '  "alertas_riesgo": ["alerta 1 basada en datos reales", "alerta 2"],\n\n'
  p += '  "recomendaciones_contenido": [\n'
  p += '      {\n'
  p += '        "semana": 1,\n'
  p += '        "tema": "tema principal de la semana",\n'
  p += '        "angulo": "educativo|comercial|marca_humana|estacional|datos",\n'
  p += '        "justificacion": "por que este tema esta semana (basado en datos)"\n'
  p += '      }\n'
  p += '    ]\n'
  p += '  },\n\n'
  p += '  "alertas_riesgo": [\n'
  p += '    {\n'
  p += '      "tipo": "crecimiento_competidor|caida_engagement|cambio_mercado|oportunidad_urgente",\n'
  p += '      "severidad": "alta|media|baja",\n'
  p += '      "descripcion": "que esta pasando",\n'
  p += '      "accion_recomendada": "que hacer al respecto"\n'
  p += '    }\n'
  p += '  ],\n\n'
  p += '  "kpis_seguimiento": [\n'
  p += '    {\n'
  p += '      "kpi": "nombre del KPI",\n'
  p += '      "valor_actual": "valor actual del cliente o benchmark",\n'
  p += '      "meta_proximo_mes": "meta sugerida",\n'
  p += '      "benchmark_industria": "referencia de la industria"\n'
  p += '    }\n'
  p += '  ]\n'
  p += '}\n\n'
  p += 'REGLAS CRITICAS:\n'
  p += '1. Todo dato debe basarse en los numeros REALES que te di. No inventes metricas.\n'
  p += '2. Las recomendaciones deben ser ACCIONABLES y ESPECIFICAS al rubro del cliente.\n'
  p += '3. Cita competidores por nombre cuando des ejemplos.\n'
  p += '4. El plan de campana debe ser realista (no pedir 5 reels/dia a una PYME).\n'
  p += '5. Las alertas solo si hay datos que las respalden (variacion >30% o patron claro).\n'
  p += '6. Escribe en espanol de Chile (sin acentos en el JSON para compatibilidad).\n'
  p += '7. PROHIBIDO: jerga de chatbot, "es fundamental", "en la era digital", "paradigma".\n'
  p += '8. Responde SOLO el JSON, sin texto antes ni despues.\n'

  return p
}

// ═══════════════════════════════════════════════
// PARSEAR RESPUESTA JSON DE CLAUDE
// ═══════════════════════════════════════════════

function parsearRespuestaClaude(texto) {
  // Limpiar posibles bloques de codigo markdown
  var clean = texto.trim()
  if (clean.startsWith('```json')) clean = clean.substring(7)
  else if (clean.startsWith('```')) clean = clean.substring(3)
  if (clean.endsWith('```')) clean = clean.substring(0, clean.length - 3)
  clean = clean.trim()

  try {
    return JSON.parse(clean)
  } catch (e) {
    // Intentar extraer JSON del texto
    var start = clean.indexOf('{')
    var end = clean.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(clean.substring(start, end + 1))
      } catch (e2) {
        console.error('   BENCHMARK: no se pudo parsear JSON de Claude')
        return null
      }
    }
    return null
  }
}

// ═══════════════════════════════════════════════
// GUARDAR EN SUPABASE
// ═══════════════════════════════════════════════

async function guardarBenchmark(supabase, suscripcionId, datos) {
  var ahora = new Date()
  var mes = ahora.getMonth() + 1
  var anio = ahora.getFullYear()

  var row = {
    suscripcion_id: suscripcionId,
    mes: mes,
    anio: anio,
    datos: datos,
    created_at: ahora.toISOString(),
  }

  try {
    // Upsert: si ya existe benchmark del mismo mes, actualizar
    var existing = await supabase.from('copilot_benchmarks')
      .select('id')
      .eq('suscripcion_id', suscripcionId)
      .eq('mes', mes)
      .eq('anio', anio)
      .limit(1)

    if (existing.data && existing.data.length > 0) {
      var res = await supabase.from('copilot_benchmarks')
        .update({ datos: datos, created_at: ahora.toISOString() })
        .eq('id', existing.data[0].id)
      if (res.error) throw new Error(res.error.message)
      console.log('   BENCHMARK: actualizado en copilot_benchmarks (id=' + existing.data[0].id + ')')
    } else {
      var res = await supabase.from('copilot_benchmarks').insert([row])
      if (res.error) throw new Error(res.error.message)
      console.log('   BENCHMARK: guardado en copilot_benchmarks')
    }
    return true
  } catch (e) {
    console.error('   BENCHMARK: error guardando: ' + e.message)
    return false
  }
}

// ═══════════════════════════════════════════════
// FUNCION PRINCIPAL — EXPORTADA
// ═══════════════════════════════════════════════

async function generarBenchmark(posts, empresas, perfil, supabase, suscripcionId, brief, memoria, postsCliente) {
  perfil = perfil || {}
  brief = brief || null
  memoria = memoria || null
  postsCliente = postsCliente || []

  var nombreCliente = perfil.nombre || 'cliente'
  console.log('\n   === BENCHMARK COMPETITIVO MENSUAL: ' + nombreCliente + ' ===')

  if (!ANTHROPIC_KEY) {
    console.log('   BENCHMARK: ANTHROPIC_API_KEY_GRILLAS no configurada, saltando')
    return null
  }

  if (!posts || posts.length < 3) {
    console.log('   BENCHMARK: pocos posts de competencia (' + (posts ? posts.length : 0) + '), saltando')
    return null
  }

  // 1. Identificar competidores unicos
  var nombresCompetidores = {}
  posts.forEach(function(p) {
    var nombre = p.nombre || p.handle || 'desconocido'
    nombresCompetidores[nombre] = true
  })
  var listaCompetidores = Object.keys(nombresCompetidores)
  console.log('   Competidores detectados: ' + listaCompetidores.length + ' (' + listaCompetidores.join(', ') + ')')

  // 2. Calcular metricas por competidor
  console.log('   Calculando metricas por competidor...')
  var metricasCompetidores = listaCompetidores.map(function(nombre) {
    return calcularMetricasCompetidor(posts, nombre)
  })

  // 3. Metricas del cliente (si hay posts propios)
  var metricasCliente = null
  if (postsCliente.length > 0) {
    console.log('   Calculando metricas del cliente (' + postsCliente.length + ' posts propios)...')
    // Para el cliente, todos los posts son suyos — usar nombre generico
    metricasCliente = {
      nombre: nombreCliente,
      total_posts: postsCliente.length,
      avg_engagement: Math.round(promedio(postsCliente.map(function(p) { return safeInt(p.likes) + safeInt(p.comments) }))),
      median_engagement: Math.round(mediana(postsCliente.map(function(p) { return safeInt(p.likes) + safeInt(p.comments) }))),
      max_engagement: Math.max.apply(null, postsCliente.map(function(p) { return safeInt(p.likes) + safeInt(p.comments) })),
      formatos: {},
      formato_dominante: null,
      temas: {},
      tema_dominante: null,
      dias_publicacion: {},
      dia_mas_activo: null,
    }
    // Formatos y temas del cliente
    postsCliente.forEach(function(p) {
      var tipo = (p.type || p.tipo_post || 'post').toLowerCase()
      if (!metricasCliente.formatos[tipo]) metricasCliente.formatos[tipo] = { count: 0, totalEng: 0 }
      metricasCliente.formatos[tipo].count++
      metricasCliente.formatos[tipo].totalEng += safeInt(p.likes) + safeInt(p.comments)

      var tema = detectarTema((p.texto || '').toLowerCase())
      if (!metricasCliente.temas[tema]) metricasCliente.temas[tema] = { count: 0, totalEng: 0 }
      metricasCliente.temas[tema].count++
      metricasCliente.temas[tema].totalEng += safeInt(p.likes) + safeInt(p.comments)

      var dia = diaSemana(p.timestamp || p.fecha_post || p.fecha)
      if (!metricasCliente.dias_publicacion[dia]) metricasCliente.dias_publicacion[dia] = 0
      metricasCliente.dias_publicacion[dia]++
    })
    // Dominantes
    var maxF = 0; var maxT = 0; var maxD = 0
    Object.keys(metricasCliente.formatos).forEach(function(f) { if (metricasCliente.formatos[f].count > maxF) { maxF = metricasCliente.formatos[f].count; metricasCliente.formato_dominante = f } })
    Object.keys(metricasCliente.temas).forEach(function(t) { if (metricasCliente.temas[t].count > maxT) { maxT = metricasCliente.temas[t].count; metricasCliente.tema_dominante = t } })
    Object.keys(metricasCliente.dias_publicacion).forEach(function(d) { if (metricasCliente.dias_publicacion[d] > maxD) { maxD = metricasCliente.dias_publicacion[d]; metricasCliente.dia_mas_activo = d } })
  }

  // 4. Cargar posts del periodo anterior para tendencias
  console.log('   Cargando posts del periodo anterior...')
  var postsAnteriores = await cargarPostsAnteriores(supabase, suscripcionId)
  console.log('   Posts anteriores: ' + postsAnteriores.length)

  // 5. Calcular tendencias
  var tendencias = listaCompetidores.map(function(nombre) {
    var t = calcularTendencia(posts, postsAnteriores, nombre)
    t.nombre = nombre
    return t
  })

  // 6. Content gap analysis
  console.log('   Analizando content gaps...')
  var contentGaps = calcularContentGaps(metricasCompetidores, metricasCliente)

  // 7. Datos de industria
  var industria = industriaModule.detectarIndustria(perfil)
  if (industria) {
    console.log('   Industria detectada: ' + (industria.nombre || industria._key))
  }

  // 8. Top 10 posts del mes
  var postsTop = posts.slice().sort(function(a, b) {
    return (safeInt(b.likes) + safeInt(b.comments)) - (safeInt(a.likes) + safeInt(a.comments))
  }).slice(0, 10)

  // 9. Cargar contenido generado por Copilot
  console.log('   Cargando contenido generado...')
  var contenidoGenerado = await cargarContenidoGenerado(supabase, suscripcionId)

  // 10. Construir prompt y llamar a Claude
  console.log('   Generando analisis estrategico con Claude Sonnet...')
  var prompt = construirPrompt(perfil, metricasCompetidores, metricasCliente, tendencias, contentGaps, brief, memoria, industria, postsTop, contenidoGenerado)

  var respuestaRaw = null
  try {
    respuestaRaw = await llamarClaude(prompt, 4096)
  } catch (e) {
    console.error('   BENCHMARK: error en Claude API: ' + e.message)
    return null
  }

  // 11. Parsear respuesta
  var analisis = parsearRespuestaClaude(respuestaRaw)
  if (!analisis) {
    console.error('   BENCHMARK: respuesta de Claude no es JSON valido')
    console.log('   Respuesta raw (primeros 500 chars): ' + (respuestaRaw || '').substring(0, 500))
    return null
  }
  console.log('   Analisis estrategico generado correctamente')

  // 12. Ensamblar resultado completo
  var resultado = {
    meta: {
      cliente: nombreCliente,
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      fecha_generacion: new Date().toISOString(),
      competidores_analizados: listaCompetidores.length,
      posts_analizados: posts.length,
      posts_cliente: postsCliente.length,
      posts_periodo_anterior: postsAnteriores.length,
    },
    metricas_competidores: metricasCompetidores,
    metricas_cliente: metricasCliente,
    tendencias: tendencias,
    content_gaps: contentGaps,
    industria: industria ? {
      nombre: industria.nombre,
      mejor_plataforma: industria.mejor_plataforma,
      ciclo_venta: industria.ciclo_venta,
      roas_avg: industria.roas_avg,
      cpl_avg: industria.cpl_avg,
    } : null,
    analisis_ia: analisis,
  }

  // 13. Guardar en Supabase
  console.log('   Guardando benchmark en Supabase...')
  var guardado = await guardarBenchmark(supabase, suscripcionId, resultado)

  if (guardado) {
    console.log('   BENCHMARK COMPLETADO para ' + nombreCliente + ' — ' + listaCompetidores.length + ' competidores, ' + posts.length + ' posts')
  }

  return resultado
}

module.exports = {
  generarBenchmark: generarBenchmark,
  // Exportar helpers para testing
  calcularMetricasCompetidor: calcularMetricasCompetidor,
  calcularTendencia: calcularTendencia,
  calcularContentGaps: calcularContentGaps,
  detectarTema: detectarTema,
}
