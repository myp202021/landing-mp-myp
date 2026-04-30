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
async function paso1_analizar(posts, empresas, modo, perfil, copiesPrevios, briefEstrategico, memoria, instrEstrategicas) {
  console.log('   CONTENIDO PASO 1: OpenAI analiza...')

  // Ordenar posts por engagement real (likes + comments)
  var postsOrdenados = posts.slice().sort(function(a, b) {
    var engA = (parseInt(a.likes) || 0) + (parseInt(a.comments) || 0)
    var engB = (parseInt(b.likes) || 0) + (parseInt(b.comments) || 0)
    return engB - engA
  })

  // Separar posts por plataforma ANTES de rankear
  var igPosts = postsOrdenados.filter(function(p) { return ((p.red || 'Instagram') + '').toLowerCase() !== 'linkedin' })
  var liPosts = postsOrdenados.filter(function(p) { return ((p.red || '') + '').toLowerCase() === 'linkedin' })

  function formatearTop(postsList, label, limit) {
    return postsList.slice(0, limit).map(function(p, idx) {
      var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
      return 'TOP ' + (idx + 1) + ' [' + label + '] ' + (p.nombre || p.handle || 'desconocido')
        + ' | Engagement: ' + eng + ' (likes: ' + (p.likes || 0) + ', comments: ' + (p.comments || 0) + ')'
        + ' | Tipo: ' + (p.type || 'post')
        + '\nTexto completo: "' + (p.texto || '').substring(0, 500) + '"'
        + '\n---'
    }).join('\n')
  }

  // Top por plataforma (no mezclados)
  var topIG = formatearTop(igPosts, 'IG', 6)
  var topLI = formatearTop(liPosts, 'LI', 4)
  var top10 = ''
  if (igPosts.length > 0) top10 += '── INSTAGRAM ──\n' + topIG + '\n'
  if (liPosts.length > 0) top10 += '\n── LINKEDIN ──\n' + topLI + '\n'
  if (!top10) top10 = formatearTop(postsOrdenados, 'IG', 10) // fallback

  // Métricas por plataforma
  var avgEngIG = igPosts.length > 0 ? Math.round(igPosts.reduce(function(s, p) { return s + (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0) }, 0) / igPosts.length) : 0
  var avgEngLI = liPosts.length > 0 ? Math.round(liPosts.reduce(function(s, p) { return s + (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0) }, 0) / liPosts.length) : 0

  // Resumen (posts restantes)
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

  // Contexto de aprendizaje (memoria inter-run)
  var memoriaCtx = ''
  if (memoria) {
    var memoriaModule = require('./radar-memoria.js')
    memoriaCtx = memoriaModule.generarContextoAprendizaje(memoria)
    if (memoriaCtx) console.log('   Memoria de aprendizaje inyectada: ' + memoriaCtx.split('\n').length + ' lineas')
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
    + (memoriaCtx ? memoriaCtx + '\n' : '')
    + (instrEstrategicas ? instrEstrategicas + '\n' : '')
    + estacionalidad + '\n'
    + '══════════════════════════════════\n'
    + 'MÉTRICAS POR PLATAFORMA:\n'
    + '══════════════════════════════════\n'
    + (igPosts.length > 0 ? 'Instagram: ' + igPosts.length + ' posts, avg ' + avgEngIG + ' eng/post\n' : '')
    + (liPosts.length > 0 ? 'LinkedIn: ' + liPosts.length + ' posts, avg ' + avgEngLI + ' eng/post\n' : '')
    + '\n'
    + '══════════════════════════════════\n'
    + 'TOP POSTS POR PLATAFORMA (separados porque IG y LI son MUNDOS DIFERENTES):\n'
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
    + 'CADA brief debe ser distinto en angulo, plataforma y formato.\n'
    + 'Si el cliente tiene Instagram Y LinkedIn: al menos 1 brief debe ser para LinkedIn (formato artículo/carrusel profesional, tono B2B) y al menos 1 para Instagram (formato reel/post visual).\n\n'
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
    + 'Responde SOLO en JSON valido con esta estructura:\n'
    + '{\n'
    + '  "razonamiento": "Tu analisis interno: que patron detectaste, por que elegiste estos angulos y no otros, que dato te llamo la atencion, que descartaste y por que. Minimo 5 oraciones.",\n'
    + '  "analisis_competencia": "Resumen ejecutivo de 3-5 oraciones sobre que funciona y que no en la competencia.",\n'
    + '  "decision_estrategica": "Explica por que cada brief es diferente y como se complementan los 3. Que haria un director de marketing con estos 3 contenidos.",\n'
    + '  "briefs": [{plataforma, tipo, angulo, objetivo, titulo, justificacion, instrucciones_copy, competidor_referencia, post_referencia_texto, engagement_referencia}]\n'
    + '}\n\n'
    + 'REGLAS DE RAZONAMIENTO:\n'
    + '- Si el motor de decisiones indica un angulo a priorizar, JUSTIFICA por que lo usas (o por que decides no usarlo)\n'
    + '- Si hay datos del cliente real (engagement, formato ganador), USA esos datos para decidir formatos\n'
    + '- Los 3 briefs deben COMPLEMENTARSE: si uno es educativo, otro debe ser comercial o caso de exito\n'
    + '- Nunca 2 briefs del mismo formato ni del mismo angulo\n'
    + '- Cada justificacion debe citar un POST REAL ESPECIFICO con su engagement\n'
    + '- NO inventes datos ni porcentajes. USA SOLO lo que esta en los posts de arriba\n'
    + '- NO generes briefs genericos. Cada uno debe ser ESPECIFICO para ' + (perfil.nombre || 'el cliente') + ' en ' + (perfil.rubro || 'su industria')

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

    // ═══ VALIDACIÓN DE PLATAFORMAS (código, no IA) ═══
    // Determinar plataformas válidas del cliente
    var platsValidas = []
    if (perfil.instagram) platsValidas.push('Instagram')
    if (perfil.linkedin) platsValidas.push('LinkedIn')
    if (perfil.facebook) platsValidas.push('Facebook')
    if (platsValidas.length === 0) platsValidas = ['Instagram'] // default

    // Corregir briefs que usen plataformas no disponibles
    briefs.forEach(function(b) {
      if (platsValidas.indexOf(b.plataforma) === -1) {
        var original = b.plataforma
        b.plataforma = platsValidas[0] // reemplazar por la primera válida
        console.log('   CORRECCIÓN: brief usaba "' + original + '" (cliente no tiene), cambiado a "' + b.plataforma + '"')
      }
    })

    console.log('   PASO 1 OK: ' + briefs.length + ' briefs generados (plataformas válidas: ' + platsValidas.join('+') + ')')
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

    // Mínimo de palabras y contexto por plataforma
    var esLI = (brief.plataforma || '').toLowerCase() === 'linkedin'
    var minPalabras = esLI ? 250 : brief.tipo === 'Reel' ? 80 : 150

    // Extraer datos de competidor de referencia
    var refInfo = ''
    if (brief.competidor_referencia) {
      refInfo = '\nCOMPETIDOR DE REFERENCIA: ' + brief.competidor_referencia
      if (brief.post_referencia_texto) refInfo += '\nPost que inspira este copy: "' + brief.post_referencia_texto + '"'
      if (brief.engagement_referencia) refInfo += '\nEngagement de ese post: ' + brief.engagement_referencia
      refInfo += '\nTu copy debe SUPERAR ese post tomando el mismo tema pero con el angulo unico de ' + (perfil.nombre || 'la empresa') + '.\n'
    }

    // Construir datos del competidor para que el copy lo mencione
    var compData = ''
    if (brief.competidor_referencia) {
      var compPosts = posts.filter(function(p) { return (p.nombre || p.handle || '').toLowerCase().includes(brief.competidor_referencia.toLowerCase()) })
      var compTopPost = compPosts.sort(function(a, b) { return ((b.likes||0)+(b.comments||0)) - ((a.likes||0)+(a.comments||0)) })[0]
      compData = '\nDATOS REALES DEL COMPETIDOR (DEBES mencionar esto en el copy):\n'
      compData += '- Competidor: ' + brief.competidor_referencia + '\n'
      compData += '- Posts recientes: ' + compPosts.length + '\n'
      if (compTopPost) {
        compData += '- Su mejor post: "' + (compTopPost.texto || '').substring(0, 150) + '"\n'
        compData += '- Engagement de ese post: ' + ((compTopPost.likes||0) + (compTopPost.comments||0)) + ' (likes: ' + (compTopPost.likes||0) + ', comments: ' + (compTopPost.comments||0) + ')\n'
      }
      compData += '- OBLIGATORIO: el copy debe mencionar este competidor por nombre o hacer referencia clara a lo que publican. Ejemplo: "Mientras empresas como ' + brief.competidor_referencia + ' apuestan por [tema], nosotros en ' + (perfil.nombre || 'la empresa') + ' vamos mas alla con [diferenciador]"\n'
    }

    // ═══ PROMPT COMPLETAMENTE DIFERENTE POR PLATAFORMA ═══
    var reglasPlataforma
    if (esLI) {
      reglasPlataforma = 'REGLAS LINKEDIN (plataforma profesional B2B):\n'
        + '1. HOOK: empieza con DATO de industria o INSIGHT provocador. "En 2026, el ' + (perfil.rubro || 'sector') + ' en Chile enfrenta..." — NO preguntas retóricas.\n'
        + '2. TONO: líder de opinión. "He visto que...", "Los datos muestran...", "En mi experiencia con empresas de ' + (perfil.rubro || 'este sector') + '...".\n'
        + '3. ESTRUCTURA: gancho (1 línea) → contexto (2-3 líneas) → desarrollo con datos (3-4 párrafos) → reflexión → CTA profesional.\n'
        + '4. USA saltos de línea cada 2-3 oraciones. LinkedIn muestra "ver más" después de 3 líneas.\n'
        + '5. MÍNIMO 250 palabras. LinkedIn premia contenido largo y reflexivo.\n'
        + '6. CTA PROFESIONAL: "Qué opinas? Te leo en comentarios", "Comparte si te identificas", "Guarda para tu próxima reunión de equipo".\n'
        + '7. Máximo 3-4 emojis SUTILES. LinkedIn NO es Instagram.\n'
        + '8. Hashtags: 3-5 profesionales al final (#' + (perfil.rubro || 'Industria').replace(/\s+/g, '') + ' #B2B #Chile).\n'
        + '9. Si es Artículo: mínimo 400 palabras con subtítulos H2. Si es Carrusel: insights por slide para decisores.\n'
        + '10. DATO REAL: al menos 1 número concreto de la industria ' + (perfil.rubro || '') + '.\n'
    } else {
      reglasPlataforma = 'REGLAS INSTAGRAM (plataforma visual, scroll rápido):\n'
        + '1. HOOK: primera línea PARA EL SCROLL. Máximo 60-80 chars. Dato impactante o afirmación fuerte.\n'
        + '2. TONO: cercano, directo, como alguien que te cuenta algo útil. "Te cuento algo", "El error más común que veo".\n'
        + '3. ESTRUCTURA: hook corto → desarrollo breve → valor → CTA interactivo.\n'
        + '4. MÍNIMO ' + minPalabras + ' palabras, MÁXIMO 180 (Instagram = conciso + impactante).\n'
        + '5. Emojis estratégicos: 3-5 bien ubicados, no spam.\n'
        + '6. CTA INTERACTIVO: "Comenta 🔥 si te pasó", "Guarda este post para después", "Etiqueta a quien necesite ver esto".\n'
        + '7. Si es Reel: escenas con [PANTALLA: texto overlay] + [VOZ: narración] por escena.\n'
        + '8. Si es Carrusel: contenido por slide (min 5), cada slide 1 idea clara con visual.\n'
        + '9. Hashtags: 6-10 al final (mix nicho + populares).\n'
        + '10. TEMPORAL: menciona mes actual o temporada.\n'
    }

    var prompt = 'Eres copywriter senior de ' + (esLI ? 'LINKEDIN' : 'INSTAGRAM') + ' para ' + (perfil.nombre || 'la empresa') + '. '
      + 'NO escribes copies genéricos. Tu ventaja: tienes DATOS REALES de la competencia.\n\n'
      + clienteCtx + '\n'
      + refInfo
      + compData + '\n'
      + 'BRIEF:\n'
      + '- Plataforma: ' + brief.plataforma + '\n'
      + '- Tipo: ' + brief.tipo + ' | Angulo: ' + brief.angulo + ' | Objetivo: ' + brief.objetivo + '\n'
      + '- Titulo: ' + brief.titulo + '\n'
      + '- Justificacion: ' + brief.justificacion + '\n'
      + '- Instrucciones: ' + brief.instrucciones_copy + '\n\n'
      + 'CONTEXTO COMPETITIVO (posts reales esta semana):\n' + contextPosts + '\n\n'
      + reglasPlataforma + '\n'
      + 'PROHIBIDO: "no es solo", "es fundamental", "en la era digital", "paradigma", "sinergia", "te invitamos", "de vanguardia".\n'
      + 'Escribe como CM senior con 10 años de experiencia, NO como chatbot.\n\n'
      + 'Responde SOLO el copy listo para publicar.'

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
      var copyRaw = data.content[0].text || ''
      // Extraer auto-evaluación si existe
      var autoEval = null
      var copyClean = copyRaw
      var evalMatch = copyRaw.match(/\[AUTO-EVAL:\s*([\d.]+)\/10\s*[—–-]\s*(.+)\]/i)
      if (evalMatch) {
        autoEval = { score: parseFloat(evalMatch[1]), razon: evalMatch[2].trim() }
        copyClean = copyRaw.replace(/\[AUTO-EVAL:[^\]]+\]/i, '').trim()
        console.log('   Auto-eval: ' + autoEval.score + '/10 — ' + autoEval.razon.substring(0, 60))
      }
      copies.push({
        plataforma: brief.plataforma,
        tipo: brief.tipo,
        angulo: brief.angulo,
        objetivo: brief.objetivo,
        titulo: brief.titulo,
        justificacion: brief.justificacion,
        competidor_referencia: brief.competidor_referencia || null,
        post_referencia_texto: brief.post_referencia_texto || null,
        engagement_referencia: brief.engagement_referencia || null,
        copy: copyClean,
        palabras: copyClean.split(/\s+/).length,
        auto_eval: autoEval,
      })
      console.log('   Copy ' + (i+1) + ' OK: ' + copyClean.split(/\s+/).length + ' palabras')
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

    // ── PENALIZACIONES POR PLATAFORMA ──
    var esLI = (c.plataforma || '').toLowerCase() === 'linkedin'

    if (esLI) {
      // LinkedIn: contenido largo, profesional, datos obligatorios
      if (palabras < 150) { score -= 25; problemas.push('LinkedIn inaceptablemente corto: ' + palabras + ' palabras (mínimo 250)') }
      else if (palabras < 250) { score -= 15; problemas.push('LinkedIn corto: ' + palabras + ' palabras (mínimo 250 para thought leadership)') }
      if (palabras > 600) { score -= 5; problemas.push('LinkedIn excesivamente largo: ' + palabras + ' palabras (ideal 250-500)') }
    } else {
      // Instagram: contenido conciso, visual, hooks cortos
      if (palabras < 60) { score -= 25; problemas.push('Instagram inaceptablemente corto: ' + palabras + ' palabras (mínimo 80 reels, 100 posts)') }
      else if (c.tipo === 'Reel' && palabras < 80) { score -= 10; problemas.push('Reel muy corto: ' + palabras + ' palabras (mínimo 80)') }
      else if (c.tipo !== 'Reel' && palabras < 100) { score -= 10; problemas.push('Instagram copy corto: ' + palabras + ' palabras (mínimo 100)') }
      if (palabras > 250) { score -= 5; problemas.push('Instagram demasiado largo: ' + palabras + ' palabras — pierde atención') }
    }

    // Hashtags — criterio por plataforma
    var hashtagCount = (c.copy.match(/#\w+/g) || []).length
    if (esLI) {
      if (hashtagCount === 0) { score -= 6; problemas.push('LinkedIn sin hashtags (necesita 3-5 profesionales)') }
      else if (hashtagCount > 7) { score -= 4; problemas.push('LinkedIn demasiados hashtags: ' + hashtagCount + ' (máx 5)') }
    } else {
      if (hashtagCount === 0) { score -= 10; problemas.push('Instagram sin hashtags (necesita 6-10)') }
      else if (hashtagCount < 4) { score -= 5; problemas.push('Instagram pocos hashtags: ' + hashtagCount + ' (mínimo 6)') }
    }

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

    // ── BONOS POR PLATAFORMA ──
    if (esLI) {
      // LinkedIn bonos
      var tieneNumero = /\d{2,}/.test(c.copy) || (copyLower.includes('%') && /\d/.test(c.copy))
      if (tieneNumero) { score += 5; bonos.push('LinkedIn con datos concretos (+5)') }
      if (c.competidor_referencia || c.engagement_referencia) { score += 3; bonos.push('Referencia competidor especifico (+3)') }
      if (palabras >= 250 && palabras <= 500) { score += 5; bonos.push('LinkedIn largo ideal: ' + palabras + ' palabras (+5)') }
      if (hashtagCount >= 3 && hashtagCount <= 5) { score += 3; bonos.push('LinkedIn hashtags profesionales calibrados (+3)') }
      if (lineas.length >= 6) { score += 3; bonos.push('LinkedIn buena estructura visual (+3)') }
      var ctaProfesional = copyLower.includes('que opinas') || copyLower.includes('qué opinas')
        || copyLower.includes('comparte si') || copyLower.includes('te leo')
      if (ctaProfesional && !ctaGenerico) { score += 3; bonos.push('LinkedIn CTA profesional (+3)') }
      // Tono thought leadership
      if (copyLower.includes('en mi experiencia') || copyLower.includes('he visto') || copyLower.includes('los datos muestran')) {
        score += 2; bonos.push('Tono thought leadership (+2)')
      }
    } else {
      // Instagram bonos
      var tieneNumeroIG = /\d{2,}/.test(c.copy) || (copyLower.includes('%') && /\d/.test(c.copy))
      if (tieneNumeroIG) { score += 3; bonos.push('Incluye dato numérico (+3)') }
      if (c.competidor_referencia || c.engagement_referencia) { score += 3; bonos.push('Referencia competidor (+3)') }
      if (palabras >= 100 && palabras <= 180) { score += 4; bonos.push('Instagram largo ideal: ' + palabras + ' palabras (+4)') }
      if (hashtagCount >= 6 && hashtagCount <= 10) { score += 3; bonos.push('Instagram hashtags bien calibrados (+3)') }
      if (lineas.length >= 4) { score += 2; bonos.push('Buena estructura visual (+2)') }
      var ctaInteractivo = copyLower.includes('comenta con') || copyLower.includes('guarda este')
        || copyLower.includes('etiqueta a') || copyLower.includes('comparte con')
      if (ctaInteractivo && !ctaGenerico) { score += 3; bonos.push('Instagram CTA interactivo (+3)') }
      // Hook conciso
      var hook = c.copy.split('\n')[0] || ''
      if (hook.length <= 80 && hook.length > 10) { score += 2; bonos.push('Hook conciso y directo (+2)') }
    }

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
async function generarContenidoSugerido(posts, empresas, modo, perfil, supabase, suscripcionId, briefEstrategico, memoria, instrEstrategicas) {
  briefEstrategico = briefEstrategico || null
  memoria = memoria || null
  instrEstrategicas = instrEstrategicas || ''
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
  var briefs = await paso1_analizar(posts, empresas, modo, perfil || {}, copiesPrevios, briefEstrategico, memoria, instrEstrategicas)
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

  // Filtrar copies con score < 70 o con error — NO guardar basura
  var aprobados = revisados.filter(function(c) { return (c.score || 0) >= 70 && !c.error && c.copy && c.copy.length > 50 })
  var rechazados = revisados.length - aprobados.length
  if (rechazados > 0) console.log('   ' + rechazados + ' copies rechazados (score < 70 o error)')

  if (supabase && suscripcionId && aprobados.length > 0) {
    try {
      var ahora = new Date()
      var mesSave = ahora.getMonth() + 1
      var anioSave = ahora.getFullYear()
      var semanaSave = Math.ceil(ahora.getDate() / 7)
      var avgScore = aprobados.reduce(function(s, c) { return s + (c.score || 0) }, 0) / aprobados.length
      // UPSERT: si ya existe copy de esta semana+mes, actualizar en vez de duplicar
      var existCheck = await supabase.from('radar_contenido')
        .select('id')
        .eq('suscripcion_id', suscripcionId)
        .eq('tipo', 'copy')
        .eq('mes', mesSave)
        .eq('anio', anioSave)
        .eq('semana', semanaSave)
        .limit(1)
      if (existCheck.data && existCheck.data.length > 0) {
        await supabase.from('radar_contenido')
          .update({ datos: aprobados, score_promedio: Math.round(avgScore) })
          .eq('id', existCheck.data[0].id)
        console.log('   ' + aprobados.length + ' copies ACTUALIZADOS (upsert, score avg ' + Math.round(avgScore) + ')')
      } else {
        await supabase.from('radar_contenido').insert({
          suscripcion_id: suscripcionId,
          tipo: 'copy',
          datos: aprobados,
          semana: semanaSave,
          mes: mesSave,
          anio: anioSave,
          score_promedio: Math.round(avgScore),
        })
        console.log('   ' + aprobados.length + ' copies NUEVOS guardados (score avg ' + Math.round(avgScore) + ')')
      }
    } catch (e) { console.error('   Error guardando copies: ' + e.message) }
  } else if (aprobados.length === 0) {
    console.log('   ⚠ Ningun copy aprobado — no se guarda nada')
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

      // Generar ideas ACCIONABLES basadas en gaps reales
      var ideas = []
      var perfNombre = (perfil.nombre || 'el cliente')

      // Ideas desde copies — solo si tienen ref competidor (valor real)
      aprobados.forEach(function(c) {
        if (c.competidor_referencia && c.engagement_referencia) {
          ideas.push({
            suscripcion_id: suscripcionId,
            titulo: 'Publicar: ' + (c.titulo || '').substring(0, 50) + ' [' + c.plataforma + ']',
            descripcion: 'Copy listo (score ' + c.score + '). Basado en post de ' + c.competidor_referencia + ' que obtuvo ' + c.engagement_referencia + ' engagement. Angulo: ' + c.angulo + '. ' + (c.palabras || 0) + ' palabras.',
            categoria: (c.angulo || 'general'),
            prioridad: 'alta',
            estado: 'nueva',
          })
        }
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

      // Detectar temas que FALTAN — con acción concreta
      var temasEsperados = ['educativo', 'caso_exito', 'marca_humana', 'datos_mercado', 'tendencia']
      var accionPorTema = {
        educativo: 'Crear carrusel con tips practicos del rubro',
        caso_exito: 'Publicar caso de cliente con numeros reales (antes/despues)',
        marca_humana: 'Mostrar al equipo detras del producto (behind the scenes)',
        datos_mercado: 'Post con estadistica clave de la industria + opinion experta',
        tendencia: 'Contenido sobre tendencia del rubro + posicion de ' + perfNombre,
      }
      temasEsperados.forEach(function(tema) {
        if (!temasCompetencia[tema]) {
          ideas.push({
            suscripcion_id: suscripcionId,
            titulo: (accionPorTema[tema] || 'Cubrir "' + tema.replace(/_/g, ' ') + '"'),
            descripcion: 'Ningun competidor en el top 5 publica "' + tema.replace(/_/g, ' ')
              + '". Esto representa una oportunidad de diferenciacion: ser el primero en abordar este angulo puede capturar atencion sin competencia directa.',
            categoria: tema,
            prioridad: 'alta',
            estado: 'nueva',
          })
        }
      })

      // Dedup: no insertar ideas con titulo que ya existe para este suscriptor
      var existRes = await supabase.from('copilot_ideas').select('titulo').eq('suscripcion_id', suscripcionId)
      var existentes = (existRes.data || []).map(function(i) { return i.titulo })
      var ideasNuevas = ideas.filter(function(i) { return existentes.indexOf(i.titulo) === -1 })

      if (ideasNuevas.length > 0) {
        await supabase.from('copilot_ideas').insert(ideasNuevas)
        console.log('   ' + ideasNuevas.length + ' ideas NUEVAS guardadas (' + (ideas.length - ideasNuevas.length) + ' duplicadas filtradas)')
      } else {
        console.log('   0 ideas nuevas (todas duplicadas)')
      }
    } catch (e) { console.log('   Ideas skip: ' + e.message) }
  }

  return revisados
}

// ═══════════════════════════════════════════════
// MODO ADS: Genera copies específicos para anuncios Google + Meta
// Se llama por separado o como complemento del contenido orgánico
// ═══════════════════════════════════════════════
async function generarCopiesAds(posts, perfil, brief, industria, memoria) {
  console.log('   CONTENIDO MODO ADS: Generando copies de anuncios...')

  if (!ANTHROPIC_KEY) {
    console.log('   Sin ANTHROPIC_API_KEY_GRILLAS, saltando modo ads')
    return null
  }

  perfil = perfil || {}
  brief = brief || {}
  industria = industria || {}

  var nombreEmpresa = perfil.nombre || 'la empresa'
  var rubro = perfil.rubro || 'general'

  // Top posts competencia para inspiración
  var topPosts = (posts || []).slice().sort(function(a, b) {
    return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
  }).slice(0, 5).map(function(p, i) {
    return (i + 1) + '. ' + (p.nombre || p.handle) + ': "' + (p.texto || '').substring(0, 120) + '" (eng: ' + ((p.likes || 0) + (p.comments || 0)) + ')'
  }).join('\n')

  var briefCtx = ''
  if (brief.propuesta_valor_unica) briefCtx += 'PVU: ' + brief.propuesta_valor_unica + '\n'
  if (brief.diferenciadores) briefCtx += 'Diferenciadores: ' + (Array.isArray(brief.diferenciadores) ? brief.diferenciadores.join(', ') : brief.diferenciadores) + '\n'
  if (brief.tono_comunicacion) {
    var tono = brief.tono_comunicacion
    briefCtx += 'Tono: ' + (typeof tono === 'object' ? tono.estilo || '' : tono) + '\n'
  }

  var indCtx = ''
  if (industria.cpl_avg) indCtx += 'CPL industria: $' + industria.cpl_avg + '\n'
  if (industria.mejor_plataforma) indCtx += 'Mejor plataforma: ' + industria.mejor_plataforma + '\n'

  var memCtx = ''
  if (memoria && memoria.copiesAprendizaje && memoria.copiesAprendizaje.mejorAngulo) {
    memCtx += 'Mejor ángulo histórico: ' + memoria.copiesAprendizaje.mejorAngulo.angulo + '\n'
  }

  var prompt = 'Eres un COPYWRITER DE PERFORMANCE con experiencia en Google Ads y Meta Ads en Chile. '
    + 'Generas copies que CONVIERTEN — cada carácter cuenta.\n\n'
    + 'CLIENTE: ' + nombreEmpresa + ' (' + rubro + ')\n'
    + briefCtx + indCtx + memCtx + '\n'
    + 'TOP POSTS COMPETENCIA:\n' + (topPosts || 'Sin datos') + '\n\n'
    + 'Genera copies de anuncios en JSON:\n'
    + '{\n'
    + '  "google_search": {\n'
    + '    "headlines_30": ["5 headlines de máximo 30 caracteres cada uno"],\n'
    + '    "headlines_90": ["2 headlines largos de máximo 90 caracteres"],\n'
    + '    "descriptions_90": ["3 descriptions de máximo 90 caracteres"],\n'
    + '    "keywords_sugeridas": ["5-8 keywords de búsqueda relevantes"]\n'
    + '  },\n'
    + '  "meta_leads": [\n'
    + '    {\n'
    + '      "angulo": "dolor|beneficio|social_proof|urgencia",\n'
    + '      "primary_text_125": "Texto principal máximo 125 chars",\n'
    + '      "headline_40": "Headline máximo 40 chars",\n'
    + '      "description_30": "Descripción máximo 30 chars",\n'
    + '      "cta": "Más información|Cotizar|Contactar"\n'
    + '    }\n'
    + '  ],\n'
    + '  "ab_test_sugerido": "Qué testear primero basado en competencia"\n'
    + '}\n\n'
    + 'REGLAS: Headlines Google ≤30 chars. Descriptions ≤90. Primary text Meta ≤125. Headline Meta ≤40. '
    + 'Mínimo 4 variaciones Meta (diferentes ángulos). Español chileno natural. SOLO JSON.'

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
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error('Claude ads: HTTP ' + res.status)
    var data = await res.json()
    var raw = data.content[0].text || ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    var ads = JSON.parse(raw)

    // Validar límites
    var ok = true
    if (ads.google_search) {
      (ads.google_search.headlines_30 || []).forEach(function(h) {
        if (h.length > 30) { console.log('   ⚠️ Google headline excede 30: "' + h + '" (' + h.length + ')'); ok = false }
      })
    }
    if (ads.meta_leads) {
      ads.meta_leads.forEach(function(v) {
        if (v.primary_text_125 && v.primary_text_125.length > 125) { console.log('   ⚠️ Meta text excede 125: ' + v.primary_text_125.length); ok = false }
        if (v.headline_40 && v.headline_40.length > 40) { console.log('   ⚠️ Meta headline excede 40: ' + v.headline_40.length); ok = false }
      })
    }

    var gH = (ads.google_search || {}).headlines_30 || []
    var mV = (ads.meta_leads || []).length
    console.log('   Modo ADS OK: ' + gH.length + ' headlines Google, ' + mV + ' variaciones Meta' + (ok ? '' : ' (con warnings)'))

    return ads
  } catch (e) {
    console.error('   Modo ADS error: ' + e.message)
    return null
  }
}

module.exports = {
  generarContenidoSugerido: generarContenidoSugerido,
  generarCopiesAds: generarCopiesAds,
}
