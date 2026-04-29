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

    // ── PENALIZACIONES ──

    // Largo minimo por plataforma
    if (g.plataforma === 'LinkedIn' && palabras < 150) { score -= 15; problemas.push('LinkedIn requiere min 150 palabras (' + palabras + ')') }
    else if (palabras < 80) { score -= 20; problemas.push('Copy muy corto: ' + palabras + ' palabras') }
    else if (palabras < 100) { score -= 10; problemas.push('Copy corto: ' + palabras + ' palabras') }

    // ChatGPT speak
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

    // Sin hashtags
    var hashCount = ((g.copy || '').match(/#\w+/g) || []).length + ((g.hashtags || '').match(/#\w+/g) || []).length
    if (hashCount === 0) { score -= 8; problemas.push('Sin hashtags') }
    else if (hashCount < 3) { score -= 4; problemas.push('Pocos hashtags: ' + hashCount) }

    // Sin titulo grafico
    if (!g.titulo_grafico) { score -= 5; problemas.push('Sin titulo grafico') }

    // Sin CTA
    var tieneCTA = lower.includes('comenta') || lower.includes('comparte') || lower.includes('guarda')
      || lower.includes('escribe') || lower.includes('agenda') || lower.includes('cotiza')
      || lower.includes('descarga') || lower.includes('whatsapp') || lower.includes('dm')
      || lower.includes('envia') || lower.includes('envía')
    if (!tieneCTA && !ctaGenerico) { score -= 8; problemas.push('Sin CTA detectado') }

    // ── BONOS ──
    if (/\d{2,}/.test(g.copy || '') || lower.includes('%')) { score += 4; }
    if (palabras >= 200) { score += 4; }
    if (hashCount >= 5 && hashCount <= 10) { score += 3; }
    var lineas = (g.copy || '').split('\n').filter(function(l) { return l.trim().length > 0 })
    if (lineas.length >= 4) { score += 2; }
    var ctaMedible = lower.includes('comenta con') || lower.includes('guarda este') || lower.includes('etiqueta a')
    if (ctaMedible && !ctaGenerico) { score += 2; }

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
  var porFormato = {}
  var porEmpresa = {}
  var temas = []

  posts.forEach(function(p) {
    // Formato
    var tipo = p.type || p.tipo_post || 'Post'
    if (!porFormato[tipo]) porFormato[tipo] = { count: 0, likes: 0 }
    porFormato[tipo].count++
    porFormato[tipo].likes += (p.likes || 0)

    // Empresa
    var nombre = p.nombre || p.nombre_empresa || p.handle
    if (!porEmpresa[nombre]) porEmpresa[nombre] = { count: 0, likes: 0 }
    porEmpresa[nombre].count++
    porEmpresa[nombre].likes += (p.likes || 0)

    // Temas (primeras 20 palabras del texto)
    if (p.texto) temas.push(p.texto.substring(0, 100))
  })

  return {
    formatoGanador: Object.keys(porFormato).sort(function(a, b) {
      return (porFormato[b].likes / porFormato[b].count) - (porFormato[a].likes / porFormato[a].count)
    })[0] || 'Post',
    totalPosts: posts.length,
    empresaMasActiva: Object.keys(porEmpresa).sort(function(a, b) { return porEmpresa[b].count - porEmpresa[a].count })[0] || '',
    temasCompetencia: temas.slice(0, 10).join(' | '),
    porFormato: porFormato,
    porEmpresa: porEmpresa,
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
    + '=== COMPETENCIA ===\n'
    + 'Posts analizados: ' + insights.totalPosts + ' | Empresa más activa: ' + insights.empresaMasActiva + '\n'
    + 'Formato ganador: ' + insights.formatoGanador + '\n'
    + 'Temas competencia: ' + insights.temasCompetencia.substring(0, 300) + '\n\n'
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

  var prompt = 'Eres copywriter senior para redes sociales B2B en Chile. '
    + 'Empresa: ' + nombre + ' (' + rubro + '). Tono: ' + tono + '.\n'
    + (briefRules ? '\nDIRECTRICES DEL BRIEF ESTRATEGICO:\n' + briefRules + '\n' : '')
    + 'BRIEF DEL POST:\n'
    + '- Plataforma: ' + plan.plataforma + '\n'
    + '- Tipo: ' + plan.tipo_post + '\n'
    + '- Angulo: ' + plan.angulo + '\n'
    + '- Objetivo: ' + plan.objetivo + '\n'
    + '- Gancho: ' + plan.gancho + '\n'
    + '- Argumento: ' + plan.argumento + '\n'
    + '- CTA: ' + plan.cta + '\n\n'
    + 'CONTEXTO: formato ganador del mes es ' + insights.formatoGanador + '. '
    + 'La competencia esta publicando sobre: ' + insights.temasCompetencia.substring(0, 200) + '\n\n'
    + 'ESCRIBE:\n'
    + '1. copy: el post completo (min 150 pal LinkedIn, 100 pal IG/FB). '
    + 'Si es carrusel escribe el contenido de cada slide. Si es reel escribe guion con texto en pantalla.\n'
    + '2. titulo_grafico: headline corto para la pieza visual (max 8 palabras)\n'
    + '3. hashtags: 5-8 hashtags relevantes\n'
    + '4. nota_diseno: instruccion para el disenador (colores, estilo, elementos)\n\n'
    + 'NO uses frases cliche. NO inventes estadisticas. Escribe como humano, no como robot.\n\n'
    + 'Responde SOLO en JSON: {"copy":"...","titulo_grafico":"...","hashtags":"...","nota_diseno":"..."}'

  try {
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    var data = await res.json()
    var text = data.content[0].text || '{}'
    // Limpiar markdown si viene envuelto
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    return JSON.parse(text)
  } catch (e) {
    console.error('   Copy error: ' + e.message)
    return { copy: '', titulo_grafico: '', hashtags: '', nota_diseno: '' }
  }
}

module.exports = { generarGrillaMensual: generarGrillaMensual }
