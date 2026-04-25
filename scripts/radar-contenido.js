// radar-contenido.js
// Pipeline de contenido sugerido: OpenAI analiza → Claude crea → OpenAI revisa
// Se llama desde radar-clipping.js en modo semanal/mensual
// Requiere: OPENAI_API_KEY, ANTHROPIC_API_KEY_GRILLAS

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY
var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

// Palabras prohibidas (ChatGPT speak)
var PALABRAS_PROHIBIDAS = [
  'en el vertiginoso', 'no es solo', 'en la era digital', 'sin lugar a dudas',
  'es importante destacar', 'cabe mencionar', 'en este sentido', 'paradigma',
  'sinergia', 'holistic', 'en un mundo cada vez', 'potenciar al maximo',
  'es fundamental', 'en definitiva', 'a modo de conclusion',
  'revolucionando', 'transformando el panorama', 'de vanguardia',
]

// ═══════════════════════════════════════════════
// PASO 1: OpenAI analiza y genera briefs
// ═══════════════════════════════════════════════
async function paso1_analizar(posts, empresas, modo, perfil, copiesPrevios, briefEstrategico) {
  console.log('   CONTENIDO PASO 1: OpenAI analiza...')

  // Ordenar posts por engagement real (likes + comments)
  var postsOrdenados = posts.slice().sort(function(a, b) {
    var engA = (parseInt(a.likes) || 0) + (parseInt(a.comments) || 0)
    var engB = (parseInt(b.likes) || 0) + (parseInt(b.comments) || 0)
    return engB - engA
  })

  // Top 10 posts por engagement con texto completo (no truncado)
  var top10 = postsOrdenados.slice(0, 10).map(function(p, idx) {
    var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
    return 'TOP ' + (idx + 1) + ' [' + (p.red || 'IG') + '] ' + (p.nombre || p.handle || 'desconocido')
      + ' | Engagement: ' + eng + ' (likes: ' + (p.likes || 0) + ', comments: ' + (p.comments || 0) + ')'
      + ' | Tipo: ' + (p.type || 'post')
      + '\nTexto completo: "' + (p.texto || '').substring(0, 500) + '"'
      + '\n---'
  }).join('\n')

  // Todos los posts para contexto general (resumen)
  var postsSummary = postsOrdenados.slice(10, 40).map(function(p) {
    var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
    return '[' + (p.red || 'IG') + '] ' + (p.nombre || p.handle) + ': "' + (p.texto || '').substring(0, 120) + '" (eng: ' + eng + ', tipo: ' + (p.type || 'post') + ')'
  }).join('\n')

  var empresasStr = Object.keys(empresas).join(', ')

  // Perfil completo del cliente
  var clienteInfo = ''
  if (perfil && perfil.nombre) {
    clienteInfo = '\n══════════════════════════════════\n'
    clienteInfo += 'CLIENTE (para quien creas contenido):\n'
    clienteInfo += '══════════════════════════════════\n'
    clienteInfo += '- Empresa: ' + perfil.nombre + '\n'
    if (perfil.rubro) clienteInfo += '- Rubro/Industria: ' + perfil.rubro + '\n'
    if (perfil.descripcion) clienteInfo += '- Descripcion del negocio: ' + perfil.descripcion + '\n'
    if (perfil.tono) clienteInfo += '- Tono de comunicacion: ' + perfil.tono + '\n'
    if (perfil.web) clienteInfo += '- Sitio web: ' + perfil.web + '\n'
    if (perfil.instagram) clienteInfo += '- Instagram: ' + perfil.instagram + '\n'
    if (perfil.linkedin) clienteInfo += '- LinkedIn: ' + perfil.linkedin + '\n'
    if (perfil.facebook) clienteInfo += '- Facebook: ' + perfil.facebook + '\n'
    if (perfil.propuesta_valor) clienteInfo += '- Propuesta de valor UNICA: ' + perfil.propuesta_valor + '\n'
    if (perfil.diferenciadores && perfil.diferenciadores.length) clienteInfo += '- Diferenciadores vs competencia: ' + perfil.diferenciadores.join(', ') + '\n'
  }

  // Contexto estacional
  var ahora = new Date()
  var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  var mesActual = meses[ahora.getMonth()]
  var anioActual = ahora.getFullYear()
  var estacionalidad = '\n══════════════════════════════════\n'
  estacionalidad += 'CONTEXTO ESTACIONAL:\n'
  estacionalidad += '══════════════════════════════════\n'
  estacionalidad += '- Mes: ' + mesActual + ' ' + anioActual + '\n'
  estacionalidad += '- Semana del mes: ' + Math.ceil(ahora.getDate() / 7) + '\n'
  // Fechas relevantes por mes en Chile
  var fechasChile = {
    0: 'Vuelta de vacaciones, inicio ano escolar, rebajas verano',
    1: 'San Valentin (14/2), Carnaval, temporada verano',
    2: 'Dia de la Mujer (8/3), inicio otono, vuelta a la rutina',
    3: 'Semana Santa, Dia de la Tierra (22/4), inicio Q2',
    4: 'Dia de la Madre (Chile: mayo), Dia del Trabajo (1/5)',
    5: 'Dia del Padre, inicio invierno, CyberDay Chile',
    6: 'Vacaciones invierno, mitad de ano, Black Winter',
    7: 'Dia del Nino (agosto Chile), fiestas patrias se acercan',
    8: 'Fiestas Patrias Chile (18-19/9), Cyber Monday, empanadas y chilenidad',
    9: 'Halloween, Dia de la Salud Mental, inicio primavera pleno',
    10: 'Black Friday, CyberMonday Chile, preventa Navidad',
    11: 'Navidad, Ano Nuevo, cierre de ano, retrospectivas, regalos',
  }
  estacionalidad += '- Fechas y eventos relevantes: ' + (fechasChile[ahora.getMonth()] || '') + '\n'
  estacionalidad += '- Considera: que eventos del sector de ' + (perfil.rubro || 'la industria') + ' ocurren en ' + mesActual + '?\n'

  // Copies previos para evitar repeticion
  var previosCtx = ''
  if (copiesPrevios && copiesPrevios.length > 0) {
    previosCtx = '\n══════════════════════════════════\n'
    previosCtx += 'COPIES GENERADOS ANTERIORMENTE (NO REPETIR estos temas/angulos):\n'
    previosCtx += '══════════════════════════════════\n'
    previosCtx += copiesPrevios.map(function(c) {
      return '- [' + (c.plataforma || '') + ' ' + (c.tipo || '') + '] ' + (c.titulo || '') + ' (angulo: ' + (c.angulo || '') + ')'
    }).join('\n')
    previosCtx += '\n'
  }

  // Brief estratégico (si existe, enriquece el prompt)
  var briefCtx = ''
  if (briefEstrategico) {
    briefCtx = '\n══════════════════════════════════\n'
    briefCtx += 'BRIEF ESTRATEGICO DEL CLIENTE (OBLIGATORIO seguir estas directrices):\n'
    briefCtx += '══════════════════════════════════\n'
    if (briefEstrategico.propuesta_valor_unica) briefCtx += '- Propuesta de valor UNICA: ' + briefEstrategico.propuesta_valor_unica + '\n'
    if (briefEstrategico.territorios_contenido) {
      briefCtx += '- Territorios de contenido autorizados:\n'
      var terrs = briefEstrategico.territorios_contenido
      if (Array.isArray(terrs)) {
        terrs.forEach(function(t) {
          if (typeof t === 'object') briefCtx += '  * ' + (t.territorio || t.nombre || '') + ': ' + (t.justificacion || '') + '\n'
          else briefCtx += '  * ' + t + '\n'
        })
      }
    }
    if (briefEstrategico.tono_comunicacion) {
      var tono = briefEstrategico.tono_comunicacion
      if (typeof tono === 'object') {
        briefCtx += '- Tono: ' + (tono.estilo || '') + '\n'
        if (tono.palabras_usar) briefCtx += '- Palabras a usar: ' + (Array.isArray(tono.palabras_usar) ? tono.palabras_usar.join(', ') : tono.palabras_usar) + '\n'
        if (tono.palabras_evitar) briefCtx += '- Palabras a EVITAR: ' + (Array.isArray(tono.palabras_evitar) ? tono.palabras_evitar.join(', ') : tono.palabras_evitar) + '\n'
      } else {
        briefCtx += '- Tono: ' + tono + '\n'
      }
    }
    if (briefEstrategico.reglas_contenido && Array.isArray(briefEstrategico.reglas_contenido)) {
      briefCtx += '- Reglas de contenido:\n'
      briefEstrategico.reglas_contenido.forEach(function(r) { briefCtx += '  * ' + r + '\n' })
    }
    if (briefEstrategico.competidores_analizados && Array.isArray(briefEstrategico.competidores_analizados)) {
      briefCtx += '- Oportunidades vs competencia:\n'
      briefEstrategico.competidores_analizados.forEach(function(c) {
        if (c.oportunidad_para_cliente) briefCtx += '  * vs ' + (c.nombre || '') + ': ' + c.oportunidad_para_cliente + '\n'
      })
    }
    briefCtx += '\n'
  }

  var prompt = 'Eres un DIRECTOR CREATIVO senior con 15 anos de experiencia en marketing digital en Chile. '
    + 'NO eres un asistente generico. Eres un estratega que analiza datos REALES de la competencia para crear contenido que SUPERE lo que ellos publican.\n\n'
    + clienteInfo + '\n'
    + briefCtx
    + estacionalidad + '\n'
    + '══════════════════════════════════\n'
    + 'TOP 10 POSTS DE LA COMPETENCIA POR ENGAGEMENT (estos son los que MAS funcionaron):\n'
    + '══════════════════════════════════\n'
    + top10 + '\n\n'
    + (postsSummary ? 'OTROS POSTS RELEVANTES:\n' + postsSummary + '\n\n' : '')
    + 'EMPRESAS MONITOREADAS (competencia directa): ' + empresasStr + '\n'
    + previosCtx + '\n'
    + '══════════════════════════════════\n'
    + 'INSTRUCCIONES DE ANALISIS (OBLIGATORIAS):\n'
    + '══════════════════════════════════\n\n'
    + 'PRIMERO analiza los top 10 posts y responde estas preguntas en tu razonamiento:\n'
    + '1. Que FORMATO funciona mejor? (carrusel, reel, imagen, articulo) — cita posts especificos\n'
    + '2. Que TEMAS generan mas engagement? — identifica patrones (ej: posts educativos > promocionales)\n'
    + '3. Que TONO usan los posts exitosos? (tecnico, cercano, aspiracional, datos duros)\n'
    + '4. Que LARGO tienen? (cortos <50 palabras o largos >150?)\n'
    + '5. Que GAPS hay? (temas que la competencia NO cubre pero deberia, o que el cliente puede abordar mejor)\n'
    + '6. Que ESTACIONALIDAD aplica en ' + mesActual + ' para el rubro ' + (perfil.rubro || 'del cliente') + '?\n\n'
    + 'LUEGO genera exactamente 3 briefs de contenido para ' + (perfil.nombre || 'el cliente') + '.\n'
    + 'CADA brief debe tener MINIMO 200 palabras en la instrucciones_copy.\n'
    + 'CADA brief debe incluir datos concretos del mercado y justificacion basada en la competencia.\n'
    + 'CADA brief debe ser distinto en angulo, plataforma y formato.\n\n'
    + 'Para cada brief incluye:\n'
    + '- plataforma: Instagram|LinkedIn|Facebook\n'
    + '- tipo: Reel|Carrusel|Post|Imagen|Articulo|Video\n'
    + '- angulo: educativo|comercial|caso_exito|estacional|diferenciacion|objecion|tendencia|detras_de_camaras\n'
    + '- objetivo: awareness|engagement|conversion|posicionamiento\n'
    + '- titulo: titulo del post (maximo 15 palabras, especifico al rubro, no generico)\n'
    + '- justificacion: OBLIGATORIO explicar POR QUE este contenido funciona citando posts especificos de la competencia. '
    + 'Ejemplo: "El post de [competidor] sobre [tema] tuvo [X] engagement. Nuestro angulo diferenciador es [Y] porque [Z]." (minimo 3 oraciones)\n'
    + '- instrucciones_copy: instrucciones DETALLADAS para el copywriter que incluyan:\n'
    + '  * Tono exacto a usar (con ejemplos de frases que SI y frases que NO)\n'
    + '  * Estructura del copy (gancho, desarrollo, CTA)\n'
    + '  * Datos o argumentos especificos a incluir (del rubro del cliente)\n'
    + '  * Que EVITAR basado en lo que la competencia hace mal\n'
    + '  * Referencia a temporada/fecha si aplica\n'
    + '  * Si es carrusel: tema de cada slide\n'
    + '  * Si es reel: escenas y texto en pantalla\n'
    + '  * Hashtags sugeridos (5-8)\n'
    + '  * CTA especifico (no generico, una accion medible)\n'
    + '  (minimo 200 palabras en este campo)\n'
    + '- competidor_referencia: nombre del competidor cuyo post inspira este brief\n'
    + '- post_referencia_texto: extracto del post de referencia (primeras 100 palabras)\n'
    + '- engagement_referencia: engagement del post de referencia\n\n'
    + 'Responde SOLO en JSON valido: {"analisis_competencia": "resumen de 3-5 oraciones de que funciona y que no en la competencia esta semana", "briefs": [{plataforma, tipo, angulo, objetivo, titulo, justificacion, instrucciones_copy, competidor_referencia, post_referencia_texto, engagement_referencia}, ...]}\n'
    + 'NO inventes datos ni porcentajes. USA SOLO lo que esta en los posts de arriba.\n'
    + 'NO generes briefs genericos que sirvan para cualquier empresa. Cada brief debe ser ESPECIFICO para ' + (perfil.nombre || 'el cliente') + ' en el rubro de ' + (perfil.rubro || 'su industria') + '.'

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.6, max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error('OpenAI paso1: HTTP ' + res.status)
    var data = await res.json()
    var content = data.choices[0].message.content
    var parsed = JSON.parse(content)
    var briefs = parsed.briefs || []
    if (parsed.analisis_competencia) {
      console.log('   Analisis competencia: ' + parsed.analisis_competencia.substring(0, 200))
    }
    console.log('   PASO 1 OK: ' + briefs.length + ' briefs generados')
    return briefs
  } catch (e) {
    console.error('   PASO 1 ERROR: ' + e.message)
    return []
  }
}

// ═══════════════════════════════════════════════
// PASO 2: Claude crea copies completos
// ═══════════════════════════════════════════════
async function paso2_crear(briefs, posts, perfil) {
  console.log('   CONTENIDO PASO 2: Claude crea copies...')
  var copies = []
  perfil = perfil || {}

  var clienteCtx = ''
  if (perfil.nombre) {
    clienteCtx = '\nEMPRESA CLIENTE: ' + perfil.nombre
    if (perfil.rubro) clienteCtx += ' | Rubro: ' + perfil.rubro
    if (perfil.descripcion) clienteCtx += '\nDescripcion: ' + perfil.descripcion
    if (perfil.propuesta_valor) clienteCtx += '\nPropuesta de valor: ' + perfil.propuesta_valor
    if (perfil.tono) clienteCtx += '\nTono deseado: ' + perfil.tono
    if (perfil.web) clienteCtx += '\nWeb: ' + perfil.web
    if (perfil.instagram) clienteCtx += ' | IG: ' + perfil.instagram
    if (perfil.linkedin) clienteCtx += ' | LI: ' + perfil.linkedin
    clienteCtx += '\n'
  }

  for (var i = 0; i < briefs.length; i++) {
    var brief = briefs[i]
    console.log('   Copy ' + (i+1) + ': ' + brief.plataforma + ' ' + brief.tipo + ' - ' + brief.titulo)

    var contextPosts = posts.slice(0, 10).map(function(p) {
      return (p.nombre || p.handle) + ' publico: "' + p.texto.substring(0, 80) + '"'
    }).join('\n')

    // Minimo de palabras por plataforma
    var minPalabras = brief.plataforma === 'LinkedIn' ? 250 : brief.tipo === 'Reel' ? 80 : 150

    // Extraer datos de competidor de referencia
    var refInfo = ''
    if (brief.competidor_referencia) {
      refInfo = '\nCOMPETIDOR DE REFERENCIA: ' + brief.competidor_referencia
      if (brief.post_referencia_texto) refInfo += '\nPost que inspira este copy: "' + brief.post_referencia_texto + '"'
      if (brief.engagement_referencia) refInfo += '\nEngagement de ese post: ' + brief.engagement_referencia
      refInfo += '\nTu copy debe SUPERAR ese post tomando el mismo tema pero con el angulo unico de ' + (perfil.nombre || 'la empresa') + '.\n'
    }

    var prompt = 'Eres un copywriter senior que escribe contenido que COMPITE Y SUPERA a la competencia. '
      + 'No escribes copies genericos. Cada copy esta basado en un INSIGHT REAL de la competencia y tiene un angulo diferenciador concreto.\n\n'
      + clienteCtx + '\n'
      + refInfo + '\n'
      + 'BRIEF:\n'
      + '- Plataforma: ' + brief.plataforma + '\n'
      + '- Tipo de post: ' + brief.tipo + '\n'
      + '- Angulo: ' + brief.angulo + '\n'
      + '- Objetivo: ' + brief.objetivo + '\n'
      + '- Titulo: ' + brief.titulo + '\n'
      + '- Justificacion estrategica: ' + brief.justificacion + '\n'
      + '- Instrucciones detalladas: ' + brief.instrucciones_copy + '\n\n'
      + 'CONTEXTO COMPETITIVO (posts reales de la competencia esta semana):\n' + contextPosts + '\n\n'
      + 'REGLAS DE CALIDAD (si las rompes, el copy sera rechazado):\n'
      + '1. HOOK (primera linea): NUNCA empieces con una pregunta generica sin dato. Buenos hooks:\n'
      + '   - "3 de cada 5 empresas en Chile [dato relevante]" — empieza con un numero\n'
      + '   - "[Competidor] publico sobre [tema] y obtuvo [N] likes. Nosotros lo hacemos diferente:" — confronta\n'
      + '   - "[Dato de industria] cambio esta semana. Esto es lo que significa para tu [rubro]:" — news-jacking\n'
      + '   NUNCA: "Sabias que...?" sin dato, "En un mundo donde...", "Te has preguntado...?"\n'
      + '2. CUERPO: Incluye AL MENOS 1 dato concreto (porcentaje real, numero de la industria, referencia a tendencia verificable)\n'
      + '3. CTA: DEBE ser una accion MEDIBLE y especifica. Buenos CTAs:\n'
      + '   - "Comenta con el emoji [X] si tu empresa ya implemento esto"\n'
      + '   - "Guarda este post y revisalo el lunes cuando planifiques tu semana"\n'
      + '   - "Envianos un DM con la palabra [X] para recibir [recurso concreto]"\n'
      + '   NUNCA: "Contactanos", "Mas informacion en el link", "Visita nuestro sitio", "Siguenos"\n'
      + '4. MINIMO ' + minPalabras + ' palabras (no negociable)\n'
      + '5. Si es Carrusel: contenido de cada slide (minimo 5 slides), cada slide con titulo y texto\n'
      + '6. Si es Reel: guion con texto en pantalla por escena\n'
      + '7. Incluye 5-8 hashtags relevantes al final\n'
      + '8. NO uses: "en el vertiginoso", "no es solo", "es fundamental", "paradigma", "sinergia", "te invitamos"\n'
      + '9. NO inventes estadisticas. Si citas un dato, debe ser plausible para la industria\n'
      + '10. Escribe como community manager senior, no como chatbot\n\n'
      + 'Responde SOLO el copy listo para publicar. Nada mas.'

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
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) {
        var errText = await res.text()
        throw new Error('Claude paso2: HTTP ' + res.status + ' ' + errText.substring(0, 200))
      }
      var data = await res.json()
      var copy = data.content[0].text || ''
      copies.push({
        plataforma: brief.plataforma,
        tipo: brief.tipo,
        angulo: brief.angulo,
        objetivo: brief.objetivo,
        titulo: brief.titulo,
        justificacion: brief.justificacion,
        copy: copy,
        palabras: copy.split(/\s+/).length,
      })
      console.log('   Copy ' + (i+1) + ' OK: ' + copy.split(/\s+/).length + ' palabras')
    } catch (e) {
      console.error('   Copy ' + (i+1) + ' ERROR: ' + e.message)
      copies.push({
        plataforma: brief.plataforma, tipo: brief.tipo, angulo: brief.angulo,
        objetivo: brief.objetivo, titulo: brief.titulo, justificacion: brief.justificacion,
        copy: '(Error generando copy. Se reintentara en el proximo informe.)',
        palabras: 0, error: true,
      })
    }
  }
  console.log('   PASO 2 OK: ' + copies.length + ' copies creados')
  return copies
}

// ═══════════════════════════════════════════════
// PASO 3: OpenAI revisa calidad (QA)
// ═══════════════════════════════════════════════
async function paso3_revisar(copies) {
  console.log('   CONTENIDO PASO 3: OpenAI revisa calidad (scoring estricto)...')
  var revisados = []

  // Frases genericas que penalizan (ademas de PALABRAS_PROHIBIDAS)
  var FRASES_GENERICAS = [
    'te invitamos a', 'no te pierdas', 'descubre como', 'conoce mas',
    'haz clic aqui', 'siguenos', 'te esperamos', 'lo mejor de lo mejor',
    'somos lideres', 'los mejores del mercado', 'calidad premium',
    'no te lo pierdas', 'aprovecha esta oportunidad', 'oferta imperdible',
    'contactanos hoy', 'estamos para ti', 'tu mejor opcion',
    'comprometidos con', 'pasion por', 'excelencia en',
  ]

  for (var i = 0; i < copies.length; i++) {
    var c = copies[i]
    if (c.error) { revisados.push(c); continue }

    // Score parte en 85 (NUNCA 100 automatico, hay que ganarselo)
    var score = 85
    var problemas = []
    var bonos = []

    var copyLower = c.copy.toLowerCase()
    var palabras = c.palabras || c.copy.split(/\s+/).length

    // ── PENALIZACIONES DURAS ──

    // Largo minimo absoluto
    if (palabras < 80) {
      score -= 25
      problemas.push('Copy inaceptablemente corto: ' + palabras + ' palabras (minimo 80 para reels, 150 IG, 250 LI)')
    } else if (palabras < 150) {
      score -= 15
      problemas.push('Copy corto: ' + palabras + ' palabras (minimo 150 para IG)')
    }

    // Largo minimo por plataforma
    if (c.plataforma === 'LinkedIn' && palabras < 250) { score -= 15; problemas.push('LinkedIn requiere minimo 250 palabras para aportar valor real') }
    if (c.plataforma === 'Instagram' && c.tipo !== 'Reel' && palabras < 150) { score -= 10; problemas.push('Instagram copy profesional necesita minimo 150 palabras') }

    // Sin hashtags
    var hashtagCount = (c.copy.match(/#\w+/g) || []).length
    if (hashtagCount === 0) { score -= 10; problemas.push('Sin hashtags (se necesitan 5-8)') }
    else if (hashtagCount < 3) { score -= 5; problemas.push('Pocos hashtags: ' + hashtagCount + ' (minimo 5)') }

    // Palabras prohibidas (ChatGPT speak)
    PALABRAS_PROHIBIDAS.forEach(function(palabra) {
      if (copyLower.includes(palabra)) {
        score -= 10
        problemas.push('ChatGPT speak: "' + palabra + '"')
      }
    })

    // Frases genericas (-10 cada una, max -30)
    var genericasEncontradas = 0
    FRASES_GENERICAS.forEach(function(frase) {
      if (copyLower.includes(frase) && genericasEncontradas < 3) {
        score -= 10
        genericasEncontradas++
        problemas.push('Frase generica: "' + frase + '"')
      }
    })

    // ── NUEVAS PENALIZACIONES: INTELIGENCIA ──

    // Sin referencia a insight competitivo (-20)
    var tieneInsightCompetitivo = false
    if (c.competidor_referencia || c.engagement_referencia) tieneInsightCompetitivo = true
    // Tambien verificar en el texto del copy si menciona competencia/mercado con dato
    var mencionaCompetencia = copyLower.includes('competencia') || copyLower.includes('mercado')
      || copyLower.includes('industria') || copyLower.includes('sector')
      || copyLower.includes('lider') || copyLower.includes('tendencia')
    var tieneDatoReal = /\d{2,}/.test(c.copy) || copyLower.includes('%')
    if (!tieneInsightCompetitivo && !(mencionaCompetencia && tieneDatoReal)) {
      score -= 20
      problemas.push('Sin referencia a insight competitivo: el copy no conecta con datos de la competencia')
    }

    // CTA generico (-15)
    var CTA_GENERICOS = ['contactanos', 'contáctanos', 'mas informacion', 'más información', 'visita nuestro sitio', 'siguenos', 'síguenos', 'te esperamos', 'haz clic', 'dale like']
    var ctaGenerico = false
    CTA_GENERICOS.forEach(function(cta) {
      if (copyLower.includes(cta)) { ctaGenerico = true }
    })
    if (ctaGenerico) {
      score -= 15
      problemas.push('CTA generico detectado: usar CTAs medibles como "comenta con [X]", "guarda este post", "envia DM con [palabra]"')
    }

    // Hook generico sin dato (-10)
    var primeraLinea = c.copy.split('\n')[0] || ''
    var primeraLineaLower = primeraLinea.toLowerCase()
    var hookGenerico = (primeraLineaLower.includes('sabias que') || primeraLineaLower.includes('sabías que')
      || primeraLineaLower.includes('te has preguntado') || primeraLineaLower.includes('alguna vez')
      || primeraLineaLower.includes('en un mundo')) && !/\d/.test(primeraLinea)
    if (hookGenerico) {
      score -= 10
      problemas.push('Hook generico sin dato: "' + primeraLinea.substring(0, 50) + '..." — agregar numero o referencia concreta')
    }

    // Sin CTA en absoluto
    var tieneCTA = copyLower.includes('comenta') || copyLower.includes('comparte')
      || copyLower.includes('escribe') || copyLower.includes('agenda') || copyLower.includes('cotiza')
      || copyLower.includes('descarga') || copyLower.includes('registrate') || copyLower.includes('inscribete')
      || copyLower.includes('whatsapp') || copyLower.includes('dm') || copyLower.includes('guarda')
      || copyLower.includes('envia') || copyLower.includes('envía') || copyLower.includes('link en bio')
    if (!tieneCTA) {
      score -= 10
      problemas.push('Sin CTA detectado en el copy')
    }

    // Sin contexto estacional
    var ahora = new Date()
    var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    var mesActual = meses[ahora.getMonth()]
    var tieneEstacionalidad = copyLower.includes(mesActual) || copyLower.includes('temporada')
      || copyLower.includes('este mes') || copyLower.includes('esta semana')
      || copyLower.includes('hoy') || copyLower.includes('' + ahora.getFullYear())
    if (!tieneEstacionalidad) {
      score -= 5
      problemas.push('Sin contexto estacional o temporal')
    }

    // Copy sin estructura visual
    var lineas = c.copy.split('\n').filter(function(l) { return l.trim().length > 0 })
    if (palabras > 100 && lineas.length < 3) {
      score -= 5
      problemas.push('Sin estructura visual (necesita parrafos/saltos de linea)')
    }

    // ── BONOS (max +20) ──
    // Bonus: incluye numero/estadistica concreta (+5)
    var tieneNumeroConcreto = /\d{2,}/.test(c.copy) || (copyLower.includes('%') && /\d/.test(c.copy))
    if (tieneNumeroConcreto) { score += 5; bonos.push('Incluye dato numerico concreto (+5)') }

    // Bonus: referencia a competidor especifico (+3)
    if (c.competidor_referencia || c.engagement_referencia) { score += 3; bonos.push('Referencia competidor especifico (+3)') }

    // Bonus: copy extenso y detallado
    if (palabras >= 250) { score += 5; bonos.push('Copy extenso y detallado (+5)') }

    // Bonus: hashtags bien calibrados
    if (hashtagCount >= 5 && hashtagCount <= 10) { score += 3; bonos.push('Hashtags bien calibrados (+3)') }

    // Bonus: buena estructura
    if (lineas.length >= 5) { score += 2; bonos.push('Buena estructura visual (+2)') }

    // Bonus: CTA medible (no generico)
    var ctaMedible = copyLower.includes('comenta con') || copyLower.includes('guarda este')
      || copyLower.includes('envia un dm') || copyLower.includes('envía un dm')
      || copyLower.includes('etiqueta a') || copyLower.includes('comparte con')
    if (ctaMedible && !ctaGenerico) { score += 2; bonos.push('CTA medible y especifico (+2)') }

    // Clamp score
    score = Math.max(0, Math.min(score, 95))

    // Si score < 65, pedir a OpenAI que corrija
    if (score < 65 && OPENAI_KEY) {
      console.log('   Copy ' + (i+1) + ' score=' + score + ', corrigiendo con OpenAI...')
      try {
        var fixPrompt = 'Eres un editor de copy profesional. Este copy para ' + (c.plataforma || 'redes sociales') + ' tiene los siguientes problemas:\n\n'
          + 'PROBLEMAS DETECTADOS:\n' + problemas.map(function(p) { return '- ' + p }).join('\n') + '\n\n'
          + 'COPY ORIGINAL:\n' + c.copy + '\n\n'
          + 'INSTRUCCIONES DE CORRECCION:\n'
          + '1. El copy debe tener MINIMO 200 palabras\n'
          + '2. Elimina TODAS las frases genericas y cliche\n'
          + '3. Agrega datos concretos del mercado o industria (puedes usar contexto del rubro)\n'
          + '4. Agrega referencia temporal (mes actual, temporada, tendencia del momento)\n'
          + '5. Incluye 5-8 hashtags relevantes al final\n'
          + '6. Incluye un CTA especifico y medible (no generico como "siguenos")\n'
          + '7. Estructura en parrafos con saltos de linea para legibilidad\n'
          + '8. Escribe en espanol chileno profesional, directo, sin rodeos\n'
          + '9. NO uses ninguna de estas frases: ' + FRASES_GENERICAS.slice(0, 10).join(', ') + '\n\n'
          + 'Responde SOLO con el copy corregido y mejorado. Nada mas.'

        var res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 1200,
            messages: [{ role: 'user', content: fixPrompt }],
          }),
        })
        if (res.ok) {
          var data = await res.json()
          var fixedCopy = data.choices[0].message.content || ''
          if (fixedCopy.split(/\s+/).length > c.copy.split(/\s+/).length) {
            c.copy = fixedCopy
            c.palabras = fixedCopy.split(/\s+/).length
            c.fixed = true
            score = Math.min(score + 15, 80)
            console.log('   Copy ' + (i+1) + ' corregido, nuevo score=' + score + ' (' + c.palabras + ' palabras)')
          }
        }
      } catch (e) { console.error('   Fix error: ' + e.message) }
    }

    c.score = score
    c.problemas = problemas
    c.bonos = bonos
    if (score >= 75) {
      console.log('   Copy ' + (i+1) + ' APROBADO (score=' + score + ', ' + palabras + ' pal, ' + problemas.length + ' issues)')
    } else if (score >= 60) {
      console.log('   Copy ' + (i+1) + ' ACEPTABLE (score=' + score + ') — ' + problemas.join('; '))
    } else {
      console.log('   Copy ' + (i+1) + ' BAJO (score=' + score + ') — ' + problemas.join('; '))
    }
    revisados.push(c)
  }

  var avgScore = revisados.reduce(function(s, c) { return s + (c.score || 0) }, 0) / (revisados.length || 1)
  console.log('   PASO 3 OK: score promedio=' + Math.round(avgScore) + ' (escala estricta, >75 = bueno, >85 = excelente)')
  return revisados
}

// ═══════════════════════════════════════════════
// FUNCION PRINCIPAL (llamada desde radar-clipping.js)
// ═══════════════════════════════════════════════
async function generarContenidoSugerido(posts, empresas, modo, perfil, supabase, suscripcionId, briefEstrategico) {
  briefEstrategico = briefEstrategico || null
  console.log('\n   === PIPELINE CONTENIDO SUGERIDO ===')

  if (!OPENAI_KEY || !ANTHROPIC_KEY) {
    console.log('   Faltan API keys, saltando pipeline')
    return []
  }

  if (posts.length < 2) {
    console.log('   Pocos posts (' + posts.length + '), saltando pipeline')
    return []
  }

  // Cargar copies previos de Supabase para evitar repeticion
  var copiesPrevios = []
  if (supabase && suscripcionId) {
    try {
      var prevRes = await supabase.from('radar_contenido')
        .select('datos')
        .eq('suscripcion_id', suscripcionId)
        .eq('tipo', 'copy')
        .order('id', { ascending: false })
        .limit(3)
      if (prevRes.data && prevRes.data.length > 0) {
        prevRes.data.forEach(function(row) {
          if (Array.isArray(row.datos)) {
            row.datos.forEach(function(c) { copiesPrevios.push(c) })
          }
        })
        console.log('   Copies previos cargados: ' + copiesPrevios.length + ' (para evitar repeticion)')
      }
    } catch (e) { console.log('   No se pudieron cargar copies previos: ' + e.message) }
  }

  // Paso 1: OpenAI analiza
  var briefs = await paso1_analizar(posts, empresas, modo, perfil || {}, copiesPrevios, briefEstrategico)
  if (briefs.length === 0) {
    console.log('   Sin briefs, abortando pipeline')
    return []
  }

  // Paso 2: Claude crea
  var copies = await paso2_crear(briefs, posts, perfil || {})
  if (copies.length === 0) {
    console.log('   Sin copies, abortando pipeline')
    return []
  }

  // Paso 3: OpenAI revisa
  var revisados = await paso3_revisar(copies)

  console.log('   === PIPELINE COMPLETADO: ' + revisados.length + ' copies ===\n')

  if (supabase && suscripcionId && revisados.length > 0) {
    try {
      var ahora = new Date()
      var avgScore = revisados.reduce(function(s, c) { return s + (c.score || 0) }, 0) / revisados.length
      await supabase.from('radar_contenido').insert({
        suscripcion_id: suscripcionId,
        tipo: 'copy',
        datos: revisados,
        semana: Math.ceil(ahora.getDate() / 7),
        mes: ahora.getMonth() + 1,
        anio: ahora.getFullYear(),
        score_promedio: Math.round(avgScore),
      })
      console.log('   Copies guardados en radar_contenido')
    } catch (e) { console.error('   Error guardando copies: ' + e.message) }
  }

  // Extraer ideas basadas en analisis de competencia y gaps
  if (supabase && suscripcionId && revisados.length > 0) {
    try {
      // Ordenar posts por engagement para analisis de gaps
      var postsOrdenados = posts.slice().sort(function(a, b) {
        var engA = (parseInt(a.likes) || 0) + (parseInt(a.comments) || 0)
        var engB = (parseInt(b.likes) || 0) + (parseInt(b.comments) || 0)
        return engB - engA
      })
      var top5 = postsOrdenados.slice(0, 5)

      // Analizar temas de los top 5
      var temasCompetencia = {}
      top5.forEach(function(p) {
        var texto = (p.texto || '').toLowerCase()
        var nombre = p.nombre || p.handle || 'competidor'
        var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
        // Detectar categorias tematicas del post
        var temaDetectado = 'general'
        if (texto.includes('oferta') || texto.includes('descuento') || texto.includes('promo') || texto.includes('precio')) temaDetectado = 'promocional'
        else if (texto.includes('equipo') || texto.includes('detras') || texto.includes('cultura') || texto.includes('historia')) temaDetectado = 'marca_humana'
        else if (texto.includes('tip') || texto.includes('consejo') || texto.includes('como') || texto.includes('guia') || texto.includes('aprende')) temaDetectado = 'educativo'
        else if (texto.includes('cliente') || texto.includes('testimonio') || texto.includes('caso') || texto.includes('resultado')) temaDetectado = 'caso_exito'
        else if (texto.includes('tendencia') || texto.includes('novedad') || texto.includes('nuevo') || texto.includes('lanz')) temaDetectado = 'tendencia'
        else if (texto.includes('dato') || texto.includes('estadistic') || texto.includes('estudio') || texto.includes('%')) temaDetectado = 'datos_mercado'

        if (!temasCompetencia[temaDetectado]) {
          temasCompetencia[temaDetectado] = { count: 0, totalEng: 0, posts: [], competidores: [] }
        }
        temasCompetencia[temaDetectado].count++
        temasCompetencia[temaDetectado].totalEng += eng
        temasCompetencia[temaDetectado].posts.push({ nombre: nombre, texto: (p.texto || '').substring(0, 80), eng: eng })
        if (temasCompetencia[temaDetectado].competidores.indexOf(nombre) === -1) {
          temasCompetencia[temaDetectado].competidores.push(nombre)
        }
      })

      // Generar ideas basadas en gaps y datos reales
      var ideas = []

      // Ideas desde los copies generados (con contexto enriquecido)
      revisados.forEach(function(c) {
        ideas.push({
          suscripcion_id: suscripcionId,
          titulo: c.titulo || 'Idea de contenido',
          descripcion: 'Basado en competencia: ' + (c.justificacion || '')
            + (c.competidor_referencia ? ' | Referencia: ' + c.competidor_referencia + ' (eng: ' + (c.engagement_referencia || 'N/A') + ')' : '')
            + ' | Angulo: ' + (c.angulo || 'sin definir'),
          categoria: (c.angulo || 'general'),
          prioridad: (c.score || 0) >= 80 ? 'alta' : (c.score || 0) >= 65 ? 'media' : 'baja',
          estado: 'nueva',
        })
      })

      // Ideas desde gaps detectados en la competencia
      var categoriasTemas = Object.keys(temasCompetencia)
      var temasOrdenados = categoriasTemas.sort(function(a, b) {
        return temasCompetencia[b].totalEng - temasCompetencia[a].totalEng
      })

      // Top temas donde la competencia es activa = oportunidad
      temasOrdenados.slice(0, 3).forEach(function(tema) {
        var datos = temasCompetencia[tema]
        var avgEng = Math.round(datos.totalEng / datos.count)
        var competidoresStr = datos.competidores.join(', ')
        var mejorPost = datos.posts.sort(function(a, b) { return b.eng - a.eng })[0]

        ideas.push({
          suscripcion_id: suscripcionId,
          titulo: 'GAP: ' + tema.replace(/_/g, ' ') + ' — competencia activa con alto engagement',
          descripcion: 'Los competidores ' + competidoresStr + ' publican sobre "' + tema.replace(/_/g, ' ') + '" con engagement promedio de ' + avgEng
            + '. Mejor post: ' + mejorPost.nombre + ' ("' + mejorPost.texto + '", eng: ' + mejorPost.eng + '). '
            + 'OPORTUNIDAD: crear contenido en este tema superando el angulo de la competencia.',
          categoria: tema,
          prioridad: 'alta',
          estado: 'nueva',
        })
      })

      // Detectar temas que FALTAN (gaps reales)
      var temasEsperados = ['educativo', 'caso_exito', 'marca_humana', 'datos_mercado', 'tendencia', 'promocional']
      temasEsperados.forEach(function(tema) {
        if (!temasCompetencia[tema]) {
          ideas.push({
            suscripcion_id: suscripcionId,
            titulo: 'OPORTUNIDAD: ningun competidor cubre "' + tema.replace(/_/g, ' ') + '"',
            descripcion: 'En el top 5 de posts por engagement, ningun competidor publica contenido de tipo "' + tema.replace(/_/g, ' ')
              + '". Esto representa una oportunidad de diferenciacion: ser el primero en abordar este angulo puede capturar atencion sin competencia directa.',
            categoria: tema,
            prioridad: 'alta',
            estado: 'nueva',
          })
        }
      })

      await supabase.from('copilot_ideas').insert(ideas)
      console.log('   ' + ideas.length + ' ideas guardadas en copilot_ideas (' + (ideas.length - revisados.length) + ' de gap analysis)')
    } catch (e) { console.log('   Ideas skip: ' + e.message) }
  }

  return revisados
}

module.exports = { generarContenidoSugerido: generarContenidoSugerido }
