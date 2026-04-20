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
async function generarGrillaMensual(posts, empresas, suscriptor, mesSiguiente, anio) {
  console.log('\n   === GRILLA MENSUAL: ' + MESES[mesSiguiente] + ' ' + anio + ' ===')

  if (!OPENAI_KEY || !ANTHROPIC_KEY) {
    console.log('   Faltan API keys, saltando grilla')
    return null
  }

  // Extraer perfil del suscriptor
  var perfil = suscriptor.perfil_empresa || {}
  var nombreEmpresa = perfil.nombre || suscriptor.nombre || 'Mi empresa'
  var rubro = perfil.rubro || inferirRubro(suscriptor.cuentas || [])
  var tono = perfil.tono || 'profesional y directo'
  var diferenciadores = perfil.diferenciadores || []
  var plataformas = extraerPlataformas(suscriptor.cuentas || [])

  console.log('   Empresa: ' + nombreEmpresa + ' | Rubro: ' + rubro + ' | Plataformas: ' + plataformas.join(', '))

  // Extraer insights de los posts de competencia
  var insights = extraerInsights(posts)

  // ═══ PASO 1: OpenAI genera brief ═══
  console.log('   GRILLA PASO 1: OpenAI genera brief...')
  var brief = await generarBrief(nombreEmpresa, rubro, tono, diferenciadores, plataformas, insights, mesSiguiente, anio)
  if (!brief || !brief.posts || brief.posts.length === 0) {
    console.log('   Brief vacio, abortando grilla')
    return null
  }
  console.log('   Brief OK: ' + brief.posts.length + ' posts planificados')

  // ═══ PASO 2: Claude genera copies ═══
  console.log('   GRILLA PASO 2: Claude genera copies...')
  var grilla = []
  for (var i = 0; i < brief.posts.length; i++) {
    var plan = brief.posts[i]
    console.log('   Post ' + (i+1) + '/' + brief.posts.length + ': ' + plan.plataforma + ' ' + plan.tipo_post + ' - ' + (plan.gancho || '').substring(0, 50))
    var copy = await generarCopy(plan, nombreEmpresa, rubro, tono, insights, plataformas)
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

  // ═══ PASO 3: QA heuristico ═══
  console.log('   GRILLA PASO 3: QA heuristico...')
  var aprobados = 0
  var corregidos = 0
  for (var j = 0; j < grilla.length; j++) {
    var g = grilla[j]
    var score = 100
    var problemas = []

    // Largo minimo
    if (g.plataforma === 'LinkedIn' && g.palabras < 120) { score -= 20; problemas.push('corto LI') }
    if (g.plataforma !== 'LinkedIn' && g.palabras < 80) { score -= 15; problemas.push('corto') }

    // ChatGPT speak
    var lower = g.copy.toLowerCase()
    var prohibited = ['en el vertiginoso', 'no es solo', 'en la era digital', 'sin lugar a dudas', 'es importante destacar', 'cabe mencionar', 'paradigma', 'sinergia', 'revolucionando']
    for (var k = 0; k < prohibited.length; k++) {
      if (lower.includes(prohibited[k])) { score -= 10; problemas.push('"' + prohibited[k] + '"') }
    }

    // Sin hashtags
    if (!g.copy.includes('#') && !g.hashtags) { score -= 5; problemas.push('sin hashtags') }

    // Sin titulo grafico
    if (!g.titulo_grafico) { score -= 5; problemas.push('sin titulo grafico') }

    g.score = score

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
async function generarBrief(nombre, rubro, tono, difs, plats, insights, mes, anio) {
  var est = ESTACIONALIDAD[mes] || ''

  var prompt = 'Eres director de estrategia de contenido para redes sociales B2B en Chile. '
    + 'Genera un plan de 16 posts para ' + MESES[mes] + ' ' + anio + '.\n\n'
    + '=== EMPRESA ===\n' + nombre + ' | Rubro: ' + rubro + '\n'
    + 'Tono: ' + tono + '\n'
    + (difs.length > 0 ? 'Diferenciadores: ' + difs.join(', ') + '\n' : '')
    + 'Plataformas: ' + plats.join(', ') + '\n\n'
    + '=== CONTEXTO COMPETITIVO (datos reales de Radar) ===\n'
    + 'Posts de competencia analizados: ' + insights.totalPosts + '\n'
    + 'Empresa mas activa: ' + insights.empresaMasActiva + '\n'
    + 'Formato ganador del mes: ' + insights.formatoGanador + '\n'
    + 'Temas de competencia: ' + insights.temasCompetencia.substring(0, 500) + '\n\n'
    + '=== ESTACIONALIDAD ' + MESES[mes].toUpperCase() + ' ===\n' + est + '\n\n'
    + '=== TAREA ===\n'
    + 'Genera 16 posts. Para CADA post define:\n'
    + '- semana: 1-4\n- dia: numero del mes\n- dia_semana: Lunes-Viernes\n'
    + '- plataforma: ' + plats.join(' o ') + ' (alternar)\n'
    + '- tipo_post: Post|Carrusel|Reel|Video|Articulo\n'
    + '- angulo: educativo|comercial|caso_exito|estacional|diferenciacion|objecion (rotar, nunca 2 seguidos iguales)\n'
    + '- tipo_contenido: tutorial|testimonio|behind the scenes|tip|comparativa|dato|historia|pregunta\n'
    + '- objetivo: awareness|engagement|conversion|posicionamiento\n'
    + '- gancho: primera frase ESPECIFICA (dato real, escenario, pregunta provocadora)\n'
    + '- argumento: desarrollo central en 1-2 frases\n'
    + '- cta: cierre con llamado a accion\n\n'
    + 'REGLAS:\n'
    + '- NO ganchos tipo "Sabias que..." ni "Te imaginas..."\n'
    + '- NO inventes datos ni porcentajes\n'
    + '- Usar formato ganador del mes (' + insights.formatoGanador + ') en al menos 4 posts\n'
    + '- Incluir 2-3 posts estacionales de ' + MESES[mes] + '\n'
    + '- Diferenciarse de lo que hace la competencia (no repetir sus temas)\n\n'
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
async function generarCopy(plan, nombre, rubro, tono, insights, plats) {
  var prompt = 'Eres copywriter senior para redes sociales B2B en Chile. '
    + 'Empresa: ' + nombre + ' (' + rubro + '). Tono: ' + tono + '.\n\n'
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
