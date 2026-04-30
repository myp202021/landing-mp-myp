// radar-grilla-mensual.js
// Genera grilla de 16 posts para el mes siguiente
// Basada en data real de competencia (radar_posts) + perfil del suscriptor
// Pipeline: OpenAI brief → Claude copies → OpenAI QA
// Se llama desde radar-clipping.js en modo mensual

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY
var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

var MESES = { 1:'Enero',2:'Febrero',3:'Marzo',4:'Abril',5:'Mayo',6:'Junio',7:'Julio',8:'Agosto',9:'Septiembre',10:'Octubre',11:'Noviembre',12:'Diciembre' }

var ANGULOS = ['educativo', 'comercial', 'caso_exito', 'estacional', 'diferenciacion', 'objecion']

var ESTACIONALIDAD = {
  1: 'Vuelta de vacaciones, planificacion anual, presupuestos Q1',
  2: 'San Valentin, vuelta a clases, inicio productivo',
  3: 'Dia de la Mujer, fin Q1, reportes trimestrales',
  4: 'Semana Santa, Dia del Trabajo proximo, declaraciones juradas',
  5: 'Dia del Trabajo, Dia de la Madre, CyberDay',
  6: 'Fiestas Patrias en horizonte, cierre semestre, evaluaciones',
  7: 'Vacaciones invierno, planificacion S2, Black Friday cercano',
  8: 'Dia del Nino, preparacion Fiestas Patrias, presupuestos S2',
  9: 'Fiestas Patrias Chile (18-19), semana larga, patriotismo',
  10: 'Halloween, CyberMonday, planificacion fin de ano',
  11: 'Black Friday, CyberMonday, Navidad proxima, cierre anual',
  12: 'Navidad, Ano Nuevo, cierre fiscal, gratificaciones, fiestas'
}

// ═══════════════════════════════════════════════
// GENERAR GRILLA COMPLETA
// ═══════════════════════════════════════════════
async function generarGrillaMensual(posts, empresas, suscriptor, mesSiguiente, anio, supabase, cantidadPosts, briefEstrategico, copiesPrevios, memoria) {
  cantidadPosts = cantidadPosts || 16
  console.log('\n   === GRILLA MENSUAL: ' + MESES[mesSiguiente] + ' ' + anio + ' ===')

  if (!OPENAI_KEY || !ANTHROPIC_KEY) {
    console.log('   Faltan API keys, saltando grilla')
    return null
  }

  var perfil = suscriptor.perfil_empresa || {}
  var nombreEmpresa = perfil.nombre || suscriptor.nombre || 'Mi empresa'
  var rubro = perfil.rubro || inferirRubro(suscriptor.cuentas || [])
  var tono = perfil.tono || 'profesional y directo'
  var diferenciadores = perfil.diferenciadores || []
  var plataformas = extraerPlataformas(suscriptor.cuentas || [])
  var webCliente = perfil.web || ''
  var igCliente = perfil.instagram || ''
  var liCliente = perfil.linkedin || ''
  var fbCliente = perfil.facebook || ''
  var propuestaValor = perfil.propuesta_valor || ''
  var descripcionCliente = perfil.descripcion || ''
  var tieneIG = plataformas.indexOf('Instagram') !== -1
  var tieneLI = plataformas.indexOf('LinkedIn') !== -1

  briefEstrategico = briefEstrategico || null
  copiesPrevios = copiesPrevios || []

  console.log('   Empresa: ' + nombreEmpresa + ' | Rubro: ' + rubro + ' | Plataformas: ' + plataformas.join(', '))

  var insights = extraerInsights(posts)

  // ═══ PRE-ASIGNACIÓN DE SLOTS (código, no IA) ═══
  // La IA no decide estructura — el código la fuerza
  console.log('   PRE-ASIGNACIÓN de ' + cantidadPosts + ' slots...')

  var diasLaborales = []
  var primerDia = new Date(anio, mesSiguiente - 1, 1)
  var diasEnMes = new Date(anio, mesSiguiente, 0).getDate()
  var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  for (var d = 1; d <= diasEnMes; d++) {
    var dow = new Date(anio, mesSiguiente - 1, d).getDay()
    if (dow >= 1 && dow <= 5) diasLaborales.push({ dia: d, dia_semana: diasSemana[dow], semana: Math.ceil(d / 7) })
  }

  // Distribuir slots entre días laborales
  var step = Math.max(1, Math.floor(diasLaborales.length / cantidadPosts))
  var slotsAsignados = []
  for (var i = 0; i < cantidadPosts && i * step < diasLaborales.length; i++) {
    slotsAsignados.push(diasLaborales[Math.min(i * step, diasLaborales.length - 1)])
  }
  // Si faltan slots, agregar al final
  while (slotsAsignados.length < cantidadPosts && diasLaborales.length > 0) {
    slotsAsignados.push(diasLaborales[slotsAsignados.length % diasLaborales.length])
  }

  // Distribuir plataformas: 60% IG, 40% LI (si tiene ambas)
  var platDistrib = []
  if (tieneIG && tieneLI) {
    var nIG = Math.ceil(cantidadPosts * 0.6)
    var nLI = cantidadPosts - nIG
    for (var pi = 0; pi < cantidadPosts; pi++) {
      // Alternar: IG, IG, LI, IG, IG, LI...
      platDistrib.push(pi % 3 === 2 ? 'LinkedIn' : 'Instagram')
    }
  } else if (tieneIG) {
    for (var pi2 = 0; pi2 < cantidadPosts; pi2++) platDistrib.push('Instagram')
  } else if (tieneLI) {
    for (var pi3 = 0; pi3 < cantidadPosts; pi3++) platDistrib.push('LinkedIn')
  } else {
    for (var pi4 = 0; pi4 < cantidadPosts; pi4++) platDistrib.push('Instagram')
  }

  // Distribuir ángulos: rotar obligatoriamente
  var angulosRotacion = ['educativo', 'comercial', 'caso_exito', 'diferenciacion', 'tendencia', 'objecion']
  var angulosAsignados = []
  for (var ai = 0; ai < cantidadPosts; ai++) {
    angulosAsignados.push(angulosRotacion[ai % angulosRotacion.length])
  }
  // Máximo 2 estacionales (reemplazan los últimos 2)
  var est = ESTACIONALIDAD[mesSiguiente] || ''
  if (est) {
    angulosAsignados[cantidadPosts - 2] = 'estacional'
    angulosAsignados[cantidadPosts - 1] = 'estacional'
  }

  // Distribuir formatos: variar
  var formatosRotacion = ['Post', 'Carrusel', 'Reel', 'Post', 'Video', 'Carrusel']
  var formatosLI = ['Articulo', 'Carrusel', 'Post', 'Articulo', 'Post', 'Carrusel']

  // Armar slots finales
  var slotsPre = []
  for (var si = 0; si < cantidadPosts; si++) {
    var plat = platDistrib[si]
    var formato = plat === 'LinkedIn' ? formatosLI[si % formatosLI.length] : formatosRotacion[si % formatosRotacion.length]
    slotsPre.push({
      dia: slotsAsignados[si].dia,
      dia_semana: slotsAsignados[si].dia_semana,
      semana: slotsAsignados[si].semana,
      plataforma: plat,
      tipo_post: formato,
      angulo: angulosAsignados[si],
    })
  }

  console.log('   Slots: ' + slotsPre.filter(function(s) { return s.plataforma === 'Instagram' }).length + ' IG + ' + slotsPre.filter(function(s) { return s.plataforma === 'LinkedIn' }).length + ' LI')
  console.log('   Ángulos: ' + angulosAsignados.filter(function(a,i,arr) { return arr.indexOf(a) === i }).join(', '))

  // ═══ PASO 1: OpenAI genera SOLO ganchos y argumentos para cada slot ═══
  console.log('   GRILLA PASO 1: OpenAI genera ganchos para ' + slotsPre.length + ' slots...')
  var brief = await generarBrief(nombreEmpresa, rubro, tono, diferenciadores, plataformas, insights, mesSiguiente, anio, {
    web: webCliente, instagram: igCliente, linkedin: liCliente, facebook: fbCliente,
    propuesta_valor: propuestaValor, descripcion: descripcionCliente
  }, cantidadPosts, briefEstrategico, copiesPrevios, memoria, slotsPre)
  if (!brief || !brief.posts || brief.posts.length === 0) {
    console.log('   Brief vacio, abortando grilla')
    return null
  }
  // Merge pre-asignación con ganchos del modelo
  for (var mi = 0; mi < Math.min(brief.posts.length, slotsPre.length); mi++) {
    brief.posts[mi].dia = slotsPre[mi].dia
    brief.posts[mi].dia_semana = slotsPre[mi].dia_semana
    brief.posts[mi].semana = slotsPre[mi].semana
    brief.posts[mi].plataforma = slotsPre[mi].plataforma
    brief.posts[mi].tipo_post = slotsPre[mi].tipo_post
    brief.posts[mi].angulo = slotsPre[mi].angulo
  }
  console.log('   Brief OK: ' + brief.posts.length + ' posts con slots pre-asignados')

  // ═══ PASO 2: Claude genera copies ═══
  console.log('   GRILLA PASO 2: Claude genera copies...')
  var grilla = []
  for (var i = 0; i < brief.posts.length; i++) {
    var plan = brief.posts[i]
    console.log('   Post ' + (i+1) + '/' + brief.posts.length + ': ' + plan.plataforma + ' ' + plan.tipo_post + ' - ' + (plan.gancho || '').substring(0, 50))
    var copy = await generarCopy(plan, nombreEmpresa, rubro, tono, insights, plataformas, briefEstrategico)
    grilla.push({
      semana: plan.semana || Math.ceil((i+1) / 4),
      dia: plan.dia || '',
      dia_semana: plan.dia_semana || '',
      plataforma: plan.plataforma || plataformas[i % plataformas.length],
      tipo_post: plan.tipo_post || 'Post',
      angulo: plan.angulo || ANGULOS[i % ANGULOS.length],
      tipo_contenido: plan.tipo_contenido || '',
      objetivo: plan.objetivo || 'engagement',
      titulo_grafico: copy.titulo_grafico || plan.gancho || '',
      copy: copy.copy || '',
      hashtags: copy.hashtags || '',
      nota_diseno: copy.nota_diseno || '',
      score: 0,
      palabras: (copy.copy || '').split(/\s+/).length,
    })
    // Pequeña pausa entre llamadas
    if (i < brief.posts.length - 1) await new Promise(function(r) { setTimeout(r, 1000) })
  }

  // ═══ PASO 3: QA heuristico (mismo estándar que copies) ═══
  console.log('   GRILLA PASO 3: QA estricto...')
  var aprobados = 0
  var corregidos = 0

  var PALABRAS_PROHIBIDAS = [
    'en el vertiginoso', 'no es solo', 'en la era digital', 'sin lugar a dudas',
    'es importante destacar', 'cabe mencionar', 'en este sentido', 'paradigma',
    'sinergia', 'holistic', 'en un mundo cada vez', 'potenciar al maximo',
    'es fundamental', 'en definitiva', 'a modo de conclusion',
    'revolucionando', 'transformando el panorama', 'de vanguardia',
  ]
  var FRASES_GENERICAS = [
    'te invitamos a', 'no te pierdas', 'descubre como', 'conoce mas',
    'haz clic aqui', 'siguenos', 'te esperamos', 'somos lideres',
    'los mejores del mercado', 'calidad premium', 'no te lo pierdas',
    'contactanos hoy', 'estamos para ti', 'tu mejor opcion',
    'comprometidos con', 'pasion por', 'excelencia en',
  ]
  var CTA_GENERICOS = ['contactanos', 'mas informacion', 'visita nuestro sitio', 'siguenos', 'te esperamos', 'haz clic', 'dale like']

  for (var j = 0; j < grilla.length; j++) {
    var g = grilla[j]
    var score = 85 // mismo base que copies
    var problemas = []
    var lower = (g.copy || '').toLowerCase()
    var palabras = g.palabras || (g.copy || '').split(/\s+/).length

    // ── PENALIZACIONES POR PLATAFORMA ──
    var esLI = (g.plataforma || '').toLowerCase() === 'linkedin'

    // Largo mínimo diferenciado
    if (esLI) {
      if (palabras < 150) { score -= 20; problemas.push('LinkedIn REQUIERE min 200 palabras, tiene ' + palabras + ' — insuficiente para thought leadership') }
      else if (palabras < 200) { score -= 10; problemas.push('LinkedIn corto: ' + palabras + ' palabras (ideal: 200-400)') }
    } else {
      if (palabras < 80) { score -= 20; problemas.push('Instagram copy muy corto: ' + palabras + ' palabras (min 80)') }
      else if (palabras < 100) { score -= 8; problemas.push('Instagram copy corto: ' + palabras + ' palabras (ideal: 100-180)') }
      if (palabras > 250) { score -= 5; problemas.push('Instagram copy muy largo: ' + palabras + ' palabras — pierde atención') }
    }

    // ChatGPT speak (igual para ambas)
    for (var k = 0; k < PALABRAS_PROHIBIDAS.length; k++) {
      if (lower.includes(PALABRAS_PROHIBIDAS[k])) { score -= 10; problemas.push('ChatGPT speak: "' + PALABRAS_PROHIBIDAS[k] + '"') }
    }

    // Frases genéricas (-8 cada, max -24)
    var genericasN = 0
    for (var fg = 0; fg < FRASES_GENERICAS.length; fg++) {
      if (lower.includes(FRASES_GENERICAS[fg]) && genericasN < 3) { score -= 8; genericasN++; problemas.push('Frase genérica: "' + FRASES_GENERICAS[fg] + '"') }
    }

    // CTA genérico (-10)
    var ctaGenerico = false
    for (var cg = 0; cg < CTA_GENERICOS.length; cg++) {
      if (lower.includes(CTA_GENERICOS[cg])) { ctaGenerico = true }
    }
    if (ctaGenerico) { score -= 10; problemas.push('CTA genérico') }

    // Hook genérico sin dato
    var primeraLinea = (g.copy || '').split('\n')[0] || ''
    var pl = primeraLinea.toLowerCase()
    if ((pl.includes('sabias que') || pl.includes('te has preguntado') || pl.includes('en un mundo')) && !/\d/.test(primeraLinea)) {
      score -= 8; problemas.push('Hook genérico sin dato')
    }

    // Hashtags — criterio diferente por plataforma
    var hashCount = ((g.copy || '').match(/#\w+/g) || []).length + ((g.hashtags || '').match(/#\w+/g) || []).length
    if (esLI) {
      // LinkedIn: 3-5 hashtags profesionales
      if (hashCount === 0) { score -= 6; problemas.push('LinkedIn sin hashtags (necesita 3-5 profesionales)') }
      else if (hashCount > 7) { score -= 4; problemas.push('LinkedIn con demasiados hashtags: ' + hashCount + ' (máx 5)') }
    } else {
      // Instagram: 6-10 hashtags
      if (hashCount === 0) { score -= 8; problemas.push('Instagram sin hashtags (necesita 6-10)') }
      else if (hashCount < 4) { score -= 4; problemas.push('Instagram pocos hashtags: ' + hashCount + ' (min 6)') }
    }

    // Sin titulo grafico
    if (!g.titulo_grafico) { score -= 5; problemas.push('Sin titulo grafico') }

    // CTA — diferentes expectativas por plataforma
    var tieneCTAProfesional = lower.includes('comparte') || lower.includes('opinas')
      || lower.includes('te leo') || lower.includes('comenta') || lower.includes('guarda')
      || lower.includes('agenda') || lower.includes('cotiza') || lower.includes('descarga')
    var tieneCTAInteractivo = lower.includes('comenta') || lower.includes('etiqueta')
      || lower.includes('guarda') || lower.includes('escribe') || lower.includes('dm')
      || lower.includes('whatsapp') || lower.includes('envia') || lower.includes('envía')
    if (esLI && !tieneCTAProfesional && !ctaGenerico) { score -= 8; problemas.push('LinkedIn sin CTA profesional (ej: "Qué opinas?", "Comparte si te identificas")') }
    if (!esLI && !tieneCTAInteractivo && !ctaGenerico) { score -= 8; problemas.push('Instagram sin CTA interactivo (ej: "Comenta 🔥", "Etiqueta a alguien")') }

    // ── PENALIZACIONES ESPECÍFICAS POR PLATAFORMA ──

    if (esLI) {
      // LinkedIn: DEBE tener datos/números
      if (!/\d{2,}/.test(g.copy || '') && !lower.includes('%')) {
        score -= 10; problemas.push('LinkedIn sin datos numéricos — thought leadership requiere cifras')
      }
      // LinkedIn: DEBE tener estructura con saltos de línea
      var lineasLI = (g.copy || '').split('\n').filter(function(l) { return l.trim().length > 0 })
      if (lineasLI.length < 5) { score -= 8; problemas.push('LinkedIn sin estructura visual — necesita saltos de línea cada 2-3 oraciones') }
      // LinkedIn: penalizar emoji spam
      var emojiCount = ((g.copy || '').match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length
      if (emojiCount > 4) { score -= 6; problemas.push('LinkedIn con demasiados emojis: ' + emojiCount + ' (máx 3-4 sutiles)') }
    } else {
      // Instagram: DEBE tener hook visual en primera línea
      if (primeraLinea.length > 100) { score -= 5; problemas.push('Instagram hook muy largo: ' + primeraLinea.length + ' chars (ideal < 80)') }
    }

    // ── BONOS POR PLATAFORMA ──
    if (esLI) {
      // LinkedIn bonos
      if (/\d{2,}/.test(g.copy || '') || lower.includes('%')) { score += 5; } // Datos concretos
      if (palabras >= 250 && palabras <= 500) { score += 5; } // Largo ideal
      if ((g.copy || '').split('\n').filter(function(l) { return l.trim().length > 0 }).length >= 8) { score += 3; } // Buena estructura
      if (lower.includes('en mi experiencia') || lower.includes('he visto') || lower.includes('los datos muestran')) { score += 3; } // Tono lider
      var ctaMedibleLI = lower.includes('que opinas') || lower.includes('qué opinas') || lower.includes('comparte si') || lower.includes('te leo')
      if (ctaMedibleLI && !ctaGenerico) { score += 2; }
    } else {
      // Instagram bonos
      if (/\d{2,}/.test(g.copy || '') || lower.includes('%')) { score += 3; } // Datos
      if (palabras >= 100 && palabras <= 180) { score += 4; } // Largo ideal IG
      if (hashCount >= 6 && hashCount <= 10) { score += 3; } // Hashtags bien calibrados
      var lineasIG = (g.copy || '').split('\n').filter(function(l) { return l.trim().length > 0 })
      if (lineasIG.length >= 4) { score += 2; } // Estructura
      var ctaMedibleIG = lower.includes('comenta con') || lower.includes('guarda este') || lower.includes('etiqueta a')
      if (ctaMedibleIG && !ctaGenerico) { score += 3; }
      if (primeraLinea.length <= 60 && primeraLinea.length > 10) { score += 2; } // Hook conciso
    }

    // Clamp
    score = Math.max(0, Math.min(score, 95))
    g.score = score
    g.problemas = problemas

    if (score < 70 && OPENAI_KEY) {
      corregidos++
      try {
        var fixRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 600,
            messages: [{ role: 'user', content: 'Corrige este copy. Problemas: ' + problemas.join(', ') + '. Copy: ' + g.copy.substring(0, 500) + '\nResponde SOLO el copy corregido.' }],
          }),
        })
        if (fixRes.ok) {
          var fixData = await fixRes.json()
          g.copy = fixData.choices[0].message.content || g.copy
          g.palabras = g.copy.split(/\s+/).length
          g.score = Math.min(score + 20, 85)
          g.fixed = true
        }
      } catch (e) { /* keep original */ }
    }

    if (g.score >= 70) aprobados++
  }
  console.log('   QA OK: ' + aprobados + ' aprobados, ' + corregidos + ' corregidos')
  console.log('   Score promedio: ' + Math.round(grilla.reduce(function(s, g) { return s + g.score }, 0) / grilla.length))
  console.log('   === GRILLA COMPLETADA: ' + grilla.length + ' posts ===\n')

  if (supabase && suscriptor.id && grilla.length > 0) {
    try {
      var avgScore = grilla.reduce(function(s, g) { return s + g.score }, 0) / grilla.length
      await supabase.from('radar_contenido').insert({
        suscripcion_id: suscriptor.id,
        tipo: 'grilla',
        datos: grilla,
        mes: mesSiguiente,
        anio: anio,
        score_promedio: Math.round(avgScore),
      })
      console.log('   Grilla guardada en radar_contenido')
    } catch (e) { console.error('   Error guardando grilla: ' + e.message) }
  }

  return grilla
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════

function inferirRubro(cuentas) {
  var kws = []
  cuentas.forEach(function(c) {
    if (c.red === 'prensa' && c.keywords) kws = kws.concat(c.keywords)
    if (c.nombre) kws.push(c.nombre)
  })
  return kws.join(', ') || 'servicios B2B'
}

function extraerPlataformas(cuentas) {
  var redes = new Set()
  cuentas.forEach(function(c) { if (c.red !== 'prensa') redes.add(c.red) })
  var map = { instagram: 'Instagram', linkedin: 'LinkedIn', facebook: 'Facebook' }
  return Array.from(redes).map(function(r) { return map[r] || r })
}

function extraerInsights(posts) {
  // Separar posts por plataforma ANTES de analizar
  var igPosts = posts.filter(function(p) { return ((p.red || 'Instagram') + '').toLowerCase() !== 'linkedin' })
  var liPosts = posts.filter(function(p) { return ((p.red || '') + '').toLowerCase() === 'linkedin' })

  function analizarPorPlataforma(subPosts) {
    var porFormato = {}
    var porEmpresa = {}
    var temas = []
    var totalEng = 0

    subPosts.forEach(function(p) {
      var eng = (p.likes || 0) + (p.comments || 0)
      totalEng += eng

      var tipo = p.type || p.tipo_post || 'Post'
      if (!porFormato[tipo]) porFormato[tipo] = { count: 0, eng: 0 }
      porFormato[tipo].count++
      porFormato[tipo].eng += eng

      var nombre = p.nombre || p.nombre_empresa || p.handle
      if (!porEmpresa[nombre]) porEmpresa[nombre] = { count: 0, eng: 0 }
      porEmpresa[nombre].count++
      porEmpresa[nombre].eng += eng

      if (p.texto) temas.push(p.texto.substring(0, 100))
    })

    var formatoGanador = Object.keys(porFormato).sort(function(a, b) {
      var avgA = porFormato[a].count > 0 ? porFormato[a].eng / porFormato[a].count : 0
      var avgB = porFormato[b].count > 0 ? porFormato[b].eng / porFormato[b].count : 0
      return avgB - avgA
    })[0] || 'Post'

    var empresaMasActiva = Object.keys(porEmpresa).sort(function(a, b) {
      return porEmpresa[b].count - porEmpresa[a].count
    })[0] || ''

    var avgEng = subPosts.length > 0 ? Math.round(totalEng / subPosts.length) : 0

    return {
      totalPosts: subPosts.length,
      formatoGanador: formatoGanador,
      empresaMasActiva: empresaMasActiva,
      temas: temas.slice(0, 8).join(' | '),
      avgEng: avgEng,
      porFormato: porFormato,
      porEmpresa: porEmpresa,
    }
  }

  var ig = analizarPorPlataforma(igPosts)
  var li = analizarPorPlataforma(liPosts)

  return {
    // Datos globales (retrocompatibilidad)
    formatoGanador: ig.formatoGanador,
    totalPosts: posts.length,
    empresaMasActiva: ig.empresaMasActiva || li.empresaMasActiva,
    temasCompetencia: ig.temas + (li.temas ? ' ||| LI: ' + li.temas : ''),
    porFormato: ig.porFormato,
    porEmpresa: ig.porEmpresa,
    // NUEVO: datos por plataforma
    instagram: ig,
    linkedin: li,
  }
}

// ═══════════════════════════════════════════════
// PASO 1: OpenAI genera brief
// ═══════════════════════════════════════════════
async function generarBrief(nombre, rubro, tono, difs, plats, insights, mes, anio, extra, cantidadPosts, briefEstrategico, copiesPrevios, memoria, slotsPre) {
  cantidadPosts = cantidadPosts || 16
  var est = ESTACIONALIDAD[mes] || ''
  extra = extra || {}
  briefEstrategico = briefEstrategico || null
  copiesPrevios = copiesPrevios || []
  memoria = memoria || null

  // Contexto de aprendizaje
  var aprendizajeCtx = ''
  if (memoria) {
    var memoriaModule = require('./radar-memoria.js')
    aprendizajeCtx = memoriaModule.generarContextoAprendizaje(memoria)
  }


  var empresaExtra = ''
  if (extra.descripcion) empresaExtra += 'Descripcion: ' + extra.descripcion + '\n'
  if (extra.propuesta_valor) empresaExtra += 'Propuesta de valor: ' + extra.propuesta_valor + '\n'
  if (extra.web) empresaExtra += 'Web: ' + extra.web + '\n'
  if (extra.instagram) empresaExtra += 'Instagram: ' + extra.instagram + '\n'
  if (extra.linkedin) empresaExtra += 'LinkedIn: ' + extra.linkedin + '\n'
  if (extra.facebook) empresaExtra += 'Facebook: ' + extra.facebook + '\n'

  // ═══ BRIEF ESTRATEGICO (si existe, es la directriz principal) ═══
  var briefCtx = ''
  if (briefEstrategico) {
    briefCtx = '\n=== BRIEF ESTRATEGICO (DIRECTRIZ PRINCIPAL — la grilla DEBE seguir esto) ===\n'
    if (briefEstrategico.propuesta_valor_unica) briefCtx += 'Propuesta de valor: ' + briefEstrategico.propuesta_valor_unica + '\n'
    if (briefEstrategico.territorios_contenido && Array.isArray(briefEstrategico.territorios_contenido)) {
      briefCtx += 'TERRITORIOS DE CONTENIDO (los posts DEBEN distribuirse entre estos):\n'
      briefEstrategico.territorios_contenido.forEach(function(t) {
        if (typeof t === 'object') {
          briefCtx += '  - ' + (t.territorio || t.nombre || '') + ': ' + (t.justificacion || '') + ' (frecuencia: ' + (t.frecuencia_sugerida || 'variable') + ', formatos: ' + ((t.formatos_recomendados || []).join(', ') || 'cualquiera') + ')\n'
        } else {
          briefCtx += '  - ' + t + '\n'
        }
      })
    }
    if (briefEstrategico.tono_comunicacion) {
      var tc = briefEstrategico.tono_comunicacion
      if (typeof tc === 'object') {
        briefCtx += 'TONO: ' + (tc.estilo || '') + '\n'
        if (tc.palabras_usar) briefCtx += '  Palabras a usar: ' + (Array.isArray(tc.palabras_usar) ? tc.palabras_usar.join(', ') : tc.palabras_usar) + '\n'
        if (tc.palabras_evitar) briefCtx += '  Palabras a EVITAR: ' + (Array.isArray(tc.palabras_evitar) ? tc.palabras_evitar.join(', ') : tc.palabras_evitar) + '\n'
      }
    }
    if (briefEstrategico.reglas_contenido && Array.isArray(briefEstrategico.reglas_contenido)) {
      briefCtx += 'REGLAS DE CONTENIDO (obligatorias):\n'
      briefEstrategico.reglas_contenido.forEach(function(r) { briefCtx += '  - ' + r + '\n' })
    }
    if (briefEstrategico.competidores_analizados && Array.isArray(briefEstrategico.competidores_analizados)) {
      briefCtx += 'OPORTUNIDADES VS COMPETENCIA (usar en los posts):\n'
      briefEstrategico.competidores_analizados.forEach(function(c) {
        if (c.oportunidad_para_cliente) briefCtx += '  - vs ' + (c.nombre || '') + ': ' + c.oportunidad_para_cliente + '\n'
      })
    }
    if (briefEstrategico.calendario_estacional) {
      var cal = briefEstrategico.calendario_estacional
      if (cal.fechas_relevantes && Array.isArray(cal.fechas_relevantes)) {
        briefCtx += 'FECHAS RELEVANTES (del brief): ' + cal.fechas_relevantes.join(', ') + '\n'
      }
      if (cal.oportunidades && Array.isArray(cal.oportunidades)) {
        briefCtx += 'OPORTUNIDADES ESTACIONALES: ' + cal.oportunidades.join(', ') + '\n'
      }
    }
    briefCtx += '\n'
  }

  // ═══ COPIES YA GENERADOS (evitar overlap) ═══
  var copiesCtx = ''
  if (copiesPrevios.length > 0) {
    copiesCtx = '\n=== COPIES YA GENERADOS ESTA SEMANA (NO repetir estos temas/angulos) ===\n'
    copiesPrevios.forEach(function(c) {
      copiesCtx += '- [' + (c.plataforma || '') + ' ' + (c.tipo || '') + '] ' + (c.titulo || '') + ' (angulo: ' + (c.angulo || '') + ')\n'
    })
    copiesCtx += 'IMPORTANTE: La grilla debe complementar estos copies, NO repetirlos.\n\n'
  }

  // Construir la tabla de slots pre-asignados para el prompt
  var slotsCtx = ''
  if (slotsPre && slotsPre.length > 0) {
    slotsCtx = '=== SLOTS PRE-ASIGNADOS (NO cambiar plataforma, formato ni ángulo) ===\n'
    slotsPre.forEach(function(s, si) {
      slotsCtx += (si + 1) + '. ' + s.dia_semana + ' ' + s.dia + ' | ' + s.plataforma + ' | ' + s.tipo_post + ' | ' + s.angulo + '\n'
    })
    slotsCtx += '\nPara CADA slot, genera SOLO: gancho, argumento, cta, tipo_contenido, objetivo.\n'
    slotsCtx += 'NO cambies la plataforma, formato ni ángulo — ya están decididos.\n\n'
  }

  var prompt = 'Eres director de estrategia de contenido para redes sociales en Chile.\n'
    + 'La ESTRUCTURA de la grilla ya está decidida (plataformas, formatos, ángulos). Tú solo generas el CONTENIDO de cada post.\n\n'
    + '=== EMPRESA ===\n' + nombre + ' | Rubro: ' + rubro + '\n'
    + 'Tono: ' + tono + '\n'
    + (difs.length > 0 ? 'Diferenciadores: ' + difs.join(', ') + '\n' : '')
    + empresaExtra
    + briefCtx
    + copiesCtx + '\n'
    + '=== COMPETENCIA POR PLATAFORMA ===\n'
    + 'Posts totales: ' + insights.totalPosts + '\n'
    + (insights.instagram && insights.instagram.totalPosts > 0
      ? 'INSTAGRAM: ' + insights.instagram.totalPosts + ' posts, avg ' + insights.instagram.avgEng + ' eng/post, formato ganador: ' + insights.instagram.formatoGanador + '\n'
        + '  Temas IG: ' + (insights.instagram.temas || '').substring(0, 200) + '\n'
      : '')
    + (insights.linkedin && insights.linkedin.totalPosts > 0
      ? 'LINKEDIN: ' + insights.linkedin.totalPosts + ' posts, avg ' + insights.linkedin.avgEng + ' eng/post, formato ganador: ' + insights.linkedin.formatoGanador + '\n'
        + '  Temas LI: ' + (insights.linkedin.temas || '').substring(0, 200) + '\n'
      : '')
    + '\n'
    + '=== ESTACIONALIDAD ' + MESES[mes].toUpperCase() + ' (MÁXIMO 2 posts sobre esto) ===\n' + est + '\n\n'
    + (aprendizajeCtx ? aprendizajeCtx + '\n' : '')
    + slotsCtx
    + '=== TAREA ===\n'
    + 'Para CADA uno de los ' + cantidadPosts + ' slots, genera:\n'
    + '- gancho: primera frase ESPECÍFICA al rubro (NO genérica, NO "¿Sabías que...")\n'
    + '- argumento: desarrollo central en 1-2 frases\n'
    + '- cta: llamado a acción específico y medible\n'
    + '- tipo_contenido: tutorial|testimonio|behind the scenes|tip|comparativa|dato|historia\n'
    + '- objetivo: awareness|engagement|conversion|posicionamiento\n\n'
    + 'REGLAS:\n'
    + '- Respetar plataforma y formato del slot (IG = visual, LI = profesional)\n'
    + '- LinkedIn: tono B2B, datos de industria, insights para decisores\n'
    + '- Instagram: visual, cercano, ganchos cortos que paren el scroll\n'
    + '- CADA gancho debe tener estructura DIFERENTE (dato → afirmación → escenario → problema → resultado)\n'
    + '- PROHIBIDO: "¿Sabías que", "¿Te imaginas", "En la era digital", datos inventados\n'
    + '- MÁXIMO 2 posts estacionales. El resto del RUBRO del cliente.\n\n'
    + 'Responde SOLO en JSON: {"posts": [{semana, dia, dia_semana, plataforma, tipo_post, angulo, tipo_contenido, objetivo, gancho, argumento, cta}, ...]}'

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o', temperature: 0.7, max_tokens: 4000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    var data = await res.json()
    var raw = data.choices[0].message.content.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    return JSON.parse(raw)
  } catch (e) {
    console.error('   Brief error: ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// PASO 2: Claude genera copy individual
// ═══════════════════════════════════════════════
async function generarCopy(plan, nombre, rubro, tono, insights, plats, briefEstrategico) {
  // Inyectar reglas del brief estratégico en el copy
  var briefRules = ''
  if (briefEstrategico) {
    if (briefEstrategico.tono_comunicacion && typeof briefEstrategico.tono_comunicacion === 'object') {
      var tc = briefEstrategico.tono_comunicacion
      if (tc.palabras_evitar) briefRules += 'NUNCA uses: ' + (Array.isArray(tc.palabras_evitar) ? tc.palabras_evitar.join(', ') : tc.palabras_evitar) + '\n'
      if (tc.palabras_usar) briefRules += 'Usa este vocabulario: ' + (Array.isArray(tc.palabras_usar) ? tc.palabras_usar.join(', ') : tc.palabras_usar) + '\n'
    }
    if (briefEstrategico.reglas_contenido && Array.isArray(briefEstrategico.reglas_contenido)) {
      briefRules += 'REGLAS: ' + briefEstrategico.reglas_contenido.join(' | ') + '\n'
    }
    if (briefEstrategico.propuesta_valor_unica) {
      briefRules += 'Propuesta de valor a comunicar: ' + briefEstrategico.propuesta_valor_unica + '\n'
    }
  }

  var esLinkedIn = (plan.plataforma || '').toLowerCase() === 'linkedin'

  // ═══ INSIGHTS POR PLATAFORMA — el copy se nutre de la data de SU red ═══
  var platInsights = esLinkedIn ? (insights.linkedin || {}) : (insights.instagram || {})
  var formatoCtx = platInsights.totalPosts > 0
    ? 'En ' + plan.plataforma + ' el formato ganador es ' + (platInsights.formatoGanador || 'Post') + ' con avg ' + (platInsights.avgEng || 0) + ' eng/post.'
    : 'Sin datos de competencia en ' + plan.plataforma + '.'
  var temasCtx = platInsights.temas ? 'Temas que funcionan en ' + plan.plataforma + ': ' + platInsights.temas.substring(0, 200) : ''

  // ═══ PROMPT DIFERENCIADO POR PLATAFORMA ═══
  var prompt
  if (esLinkedIn) {
    // ── LINKEDIN: B2B, thought leadership, datos, largo ──
    prompt = 'Eres copywriter senior de LINKEDIN para empresas B2B en Chile. '
      + 'Tu especialidad: posts largos que posicionan como lider de opinion. Escribes para decisores (gerentes, directores, dueños de empresa).\n\n'
      + 'Empresa: ' + nombre + ' (' + rubro + '). Tono: ' + tono + ' pero siempre profesional.\n'
      + (briefRules ? '\nDIRECTRICES:\n' + briefRules + '\n' : '')
      + 'BRIEF DEL POST:\n'
      + '- Formato: ' + plan.tipo_post + ' | Angulo: ' + plan.angulo + ' | Objetivo: ' + plan.objetivo + '\n'
      + '- Gancho: ' + plan.gancho + '\n'
      + '- Argumento: ' + plan.argumento + '\n'
      + '- CTA: ' + plan.cta + '\n\n'
      + 'CONTEXTO LINKEDIN: ' + formatoCtx + '\n' + temasCtx + '\n\n'
      + 'REGLAS LINKEDIN (NO NEGOCIABLES):\n'
      + '1. MINIMO 200 palabras. LinkedIn premia contenido largo y reflexivo.\n'
      + '2. Empieza con DATO de industria o INSIGHT provocador (no pregunta retórica).\n'
      + '3. Estructura: gancho (1 línea) → contexto (2-3 líneas) → desarrollo con datos → reflexión → CTA profesional.\n'
      + '4. USA saltos de línea cada 2-3 oraciones (así se lee en LinkedIn).\n'
      + '5. CTA profesional: "Comparte si te identificas", "Qué opinas? Te leo en comentarios", "Guarda para tu próxima reunión de equipo".\n'
      + '6. NUNCA uses emojis excesivos (máximo 2-3 sutiles). LinkedIn no es Instagram.\n'
      + '7. Incluye al menos 1 dato numérico real o verosímil de la industria ' + rubro + '.\n'
      + '8. Si es Artículo: escribe mínimo 400 palabras con subtítulos. Si es Carrusel: contenido por slide con insights por cada uno.\n'
      + '9. Hashtags: 3-5 profesionales (#' + rubro.replace(/\s+/g, '') + ' #B2B #Chile #MarketingDigital #Industria).\n'
      + '10. Tono de LÍDER DE OPINIÓN: "He visto esto en la industria…", "En mi experiencia con empresas de…", "Los datos muestran que…"\n\n'
      + 'ESCRIBE en JSON: {"copy":"el post completo","titulo_grafico":"headline para pieza visual (max 8 palabras)","hashtags":"3-5 hashtags profesionales","nota_diseno":"instrucción diseño: estilo corporativo, colores sobrios, gráfico de datos si aplica"}'
  } else {
    // ── INSTAGRAM: visual, hooks cortos, scroll-stopping ──
    prompt = 'Eres copywriter senior de INSTAGRAM para marcas en Chile. '
      + 'Tu especialidad: textos que PARAN EL SCROLL. Escribes para una audiencia que consume rápido y decide en 2 segundos.\n\n'
      + 'Empresa: ' + nombre + ' (' + rubro + '). Tono: ' + tono + ' pero cercano.\n'
      + (briefRules ? '\nDIRECTRICES:\n' + briefRules + '\n' : '')
      + 'BRIEF DEL POST:\n'
      + '- Formato: ' + plan.tipo_post + ' | Angulo: ' + plan.angulo + ' | Objetivo: ' + plan.objetivo + '\n'
      + '- Gancho: ' + plan.gancho + '\n'
      + '- Argumento: ' + plan.argumento + '\n'
      + '- CTA: ' + plan.cta + '\n\n'
      + 'CONTEXTO INSTAGRAM: ' + formatoCtx + '\n' + temasCtx + '\n\n'
      + 'REGLAS INSTAGRAM (NO NEGOCIABLES):\n'
      + '1. MINIMO 100 palabras, MAXIMO 180 (Instagram = conciso + impactante).\n'
      + '2. Primera línea = HOOK que pare el scroll. Dato impactante, afirmación fuerte, o problema del cliente.\n'
      + '3. Estructura: hook (1 línea) → desarrollo breve → valor → CTA directo.\n'
      + '4. Emojis estratégicos (3-5 bien ubicados, no spam).\n'
      + '5. CTA interactivo: "Comenta 🔥 si te pasó", "Guarda este post", "Etiqueta a quien necesite ver esto".\n'
      + '6. Si es Reel: escribe guión con [PANTALLA: texto overlay] + [VOZ: lo que se dice] por escena.\n'
      + '7. Si es Carrusel: contenido por slide (min 5 slides), cada slide con 1 idea clara.\n'
      + '8. Hashtags: 6-10 (mix nicho + populares: #' + rubro.replace(/\s+/g, '') + ' #Chile #Emprendedores #Tips).\n'
      + '9. Lenguaje CERCANO y directo. "Esto te va a servir", "El error más común que veo", "Te cuento algo".\n'
      + '10. El titulo_grafico es lo que va EN LA PIEZA VISUAL — debe ser legible en thumbnail.\n\n'
      + 'ESCRIBE en JSON: {"copy":"el post completo","titulo_grafico":"headline para pieza visual (max 6 palabras, impactante)","hashtags":"6-10 hashtags","nota_diseno":"instrucción diseño: colores vibrantes, tipografía grande, visual que impacte"}'
  }

  try {
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: esLinkedIn ? 1800 : 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    var data = await res.json()
    var text = data.content[0].text || '{}'
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    return JSON.parse(text)
  } catch (e) {
    console.error('   Copy error (' + plan.plataforma + '): ' + e.message)
    return { copy: '', titulo_grafico: '', hashtags: '', nota_diseno: '' }
  }
}

module.exports = { generarGrillaMensual: generarGrillaMensual }
