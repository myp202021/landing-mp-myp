// radar-brief.js
// Genera brief estrategico completo del cliente
// Input: perfil_empresa + posts competencia + web del cliente
// Output: brief guardado en clipping_suscripciones.brief_estrategico
// Se corre: al crear trial + mensual para actualizar
// Requiere: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY

// Fechas relevantes Chile por mes (para calendario estacional)
var FECHAS_POR_MES = {
  1: [{ dia: 1, nombre: 'Anio Nuevo' }],
  2: [{ dia: 14, nombre: 'San Valentin' }],
  3: [{ dia: 8, nombre: 'Dia Internacional de la Mujer' }],
  4: [{ dia: 18, nombre: 'Viernes Santo (aprox)' }, { dia: 22, nombre: 'Dia de la Tierra' }],
  5: [{ dia: 1, nombre: 'Dia del Trabajo' }, { dia: 11, nombre: 'Dia de la Madre' }, { dia: 21, nombre: 'Glorias Navales' }],
  6: [{ dia: 15, nombre: 'Dia del Padre' }, { dia: 20, nombre: 'Dia Pueblos Indigenas' }],
  7: [{ dia: 16, nombre: 'Virgen del Carmen' }],
  8: [{ dia: 15, nombre: 'Asuncion de la Virgen' }, { dia: 11, nombre: 'Dia del Nino (aprox)' }],
  9: [{ dia: 18, nombre: 'Fiestas Patrias' }, { dia: 19, nombre: 'Glorias del Ejercito' }],
  10: [{ dia: 12, nombre: 'Encuentro de Dos Mundos' }, { dia: 31, nombre: 'Halloween' }],
  11: [{ dia: 1, nombre: 'Dia de Todos los Santos' }, { dia: 25, nombre: 'Black Friday (aprox)' }],
  12: [{ dia: 12, nombre: 'CyberMonday Chile (aprox)' }, { dia: 25, nombre: 'Navidad' }],
}

// ═══════════════════════════════════════════════
// Detectar temas/patrones en posts (client-side, sin API)
// ═══════════════════════════════════════════════
function detectarPatrones(posts) {
  var temas = {}
  var formatos = {}
  var tonos = { tecnico: 0, cercano: 0, aspiracional: 0, datos: 0, humor: 0 }

  posts.forEach(function(p) {
    var texto = (p.texto || '').toLowerCase()
    var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)

    // Detectar tema
    var tema = 'general'
    if (texto.includes('oferta') || texto.includes('descuento') || texto.includes('promo') || texto.includes('precio')) tema = 'promocional'
    else if (texto.includes('equipo') || texto.includes('detras') || texto.includes('cultura') || texto.includes('historia')) tema = 'marca_humana'
    else if (texto.includes('tip') || texto.includes('consejo') || texto.includes('como') || texto.includes('guia') || texto.includes('aprende')) tema = 'educativo'
    else if (texto.includes('cliente') || texto.includes('testimonio') || texto.includes('caso') || texto.includes('resultado')) tema = 'caso_exito'
    else if (texto.includes('tendencia') || texto.includes('novedad') || texto.includes('nuevo') || texto.includes('lanz')) tema = 'tendencia'
    else if (texto.includes('dato') || texto.includes('estadistic') || texto.includes('estudio') || texto.includes('%')) tema = 'datos_mercado'
    else if (texto.includes('evento') || texto.includes('webinar') || texto.includes('conferencia')) tema = 'eventos'

    if (!temas[tema]) temas[tema] = { count: 0, totalEng: 0 }
    temas[tema].count++
    temas[tema].totalEng += eng

    // Detectar formato
    var tipo = (p.type || 'post').toLowerCase()
    if (!formatos[tipo]) formatos[tipo] = { count: 0, totalEng: 0 }
    formatos[tipo].count++
    formatos[tipo].totalEng += eng

    // Detectar tono
    if (/\d{2,}/.test(texto) || texto.includes('%') || texto.includes('estudio')) tonos.datos++
    if (texto.includes('jaja') || texto.includes('😂') || texto.includes('🤣')) tonos.humor++
    if (texto.includes('suena') || texto.includes('transforma') || texto.includes('logra') || texto.includes('alcanza')) tonos.aspiracional++
    if (texto.includes('paso') || texto.includes('metodo') || texto.includes('herramienta') || texto.includes('plataforma')) tonos.tecnico++
    if (texto.includes('nosotros') || texto.includes('tu') || texto.includes('juntos') || texto.includes('equipo')) tonos.cercano++
  })

  return { temas: temas, formatos: formatos, tonos: tonos }
}

// ═══════════════════════════════════════════════
// Generar brief estrategico completo
// ═══════════════════════════════════════════════
async function generarBrief(suscriptor, posts, supabase, memoria) {
  var perfil = suscriptor.perfil_empresa || {}
  var email = suscriptor.email || ''
  var nombre = perfil.nombre || suscriptor.nombre || email.split('@')[0]

  console.log('   BRIEF: generando para ' + nombre)

  if (!OPENAI_KEY) {
    console.error('   BRIEF ERROR: sin OPENAI_API_KEY')
    return null
  }

  if (!posts || posts.length === 0) {
    console.error('   BRIEF ERROR: sin posts de competencia')
    return null
  }

  // ═══ 1. Leer perfil existente ═══
  var perfilInfo = ''
  if (perfil.nombre) perfilInfo += 'Empresa: ' + perfil.nombre + '\n'
  if (perfil.rubro) perfilInfo += 'Rubro: ' + perfil.rubro + '\n'
  if (perfil.descripcion) perfilInfo += 'Descripcion: ' + perfil.descripcion + '\n'
  if (perfil.productos) perfilInfo += 'Productos/Servicios: ' + perfil.productos + '\n'
  if (perfil.propuesta_valor) perfilInfo += 'Propuesta de valor: ' + perfil.propuesta_valor + '\n'
  if (perfil.tono) perfilInfo += 'Tono actual: ' + perfil.tono + '\n'
  if (perfil.publico_objetivo) perfilInfo += 'Publico objetivo: ' + perfil.publico_objetivo + '\n'
  if (perfil.diferenciadores && perfil.diferenciadores.length) perfilInfo += 'Diferenciadores: ' + perfil.diferenciadores.join(', ') + '\n'
  if (perfil.territorios_contenido && perfil.territorios_contenido.length) perfilInfo += 'Territorios actuales: ' + perfil.territorios_contenido.join(', ') + '\n'
  if (perfil.web) perfilInfo += 'Web: ' + perfil.web + '\n'
  if (perfil.instagram) perfilInfo += 'Instagram: ' + perfil.instagram + '\n'
  if (perfil.linkedin) perfilInfo += 'LinkedIn: ' + perfil.linkedin + '\n'

  // Data entry del dashboard (si el cliente lo configuró)
  if (perfil.presupuesto_mensual) perfilInfo += 'Presupuesto mensual pauta: $' + perfil.presupuesto_mensual.toLocaleString() + ' CLP\n'
  if (perfil.ticket_promedio) perfilInfo += 'Ticket promedio: $' + perfil.ticket_promedio.toLocaleString() + ' CLP\n'
  if (perfil.tasa_cierre) perfilInfo += 'Tasa de cierre comercial: ' + perfil.tasa_cierre + '%\n'
  if (perfil.ciclo_venta) perfilInfo += 'Ciclo de venta: ' + perfil.ciclo_venta + '\n'
  if (perfil.competencia_percibida) perfilInfo += 'Nivel competencia: ' + perfil.competencia_percibida + '/10\n'
  if (perfil.geo) perfilInfo += 'Foco geográfico: ' + perfil.geo + '\n'
  if (perfil.tipo_cliente) perfilInfo += 'Tipo: ' + perfil.tipo_cliente + '\n'

  // Aprendizajes persistentes del cliente (feedback + patrones de runs anteriores)
  var aprendizajesCtx = ''
  if (supabase && suscriptor.id) {
    try {
      var apRes = await supabase.from('copilot_aprendizajes')
        .select('aprendizaje, confianza, agente, tipo')
        .eq('suscripcion_id', suscriptor.id)
        .eq('activo', true)
        .order('confianza', { ascending: false })
        .limit(10)
      if (apRes.data && apRes.data.length > 0) {
        aprendizajesCtx = '\n\nAPRENDIZAJES DE RUNS ANTERIORES Y FEEDBACK DEL CLIENTE:\n'
        apRes.data.forEach(function(a) {
          var pref = a.tipo === 'preferencia_cliente' ? '[CLIENTE DIJO] ' : a.tipo === 'alerta' ? '[EVITAR] ' : ''
          aprendizajesCtx += '- ' + pref + a.aprendizaje + '\n'
        })
        console.log('   Brief: ' + apRes.data.length + ' aprendizajes inyectados')
      }
    } catch (e) { /* tabla puede no existir */ }
  }

  // ═══ 2. Analizar top 20 posts por engagement ═══
  var postsOrdenados = posts.slice().sort(function(a, b) {
    var engA = (parseInt(a.likes) || 0) + (parseInt(a.comments) || 0)
    var engB = (parseInt(b.likes) || 0) + (parseInt(b.comments) || 0)
    return engB - engA
  })

  var top20 = postsOrdenados.slice(0, 20)
  var top20Str = top20.map(function(p, idx) {
    var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
    return 'TOP ' + (idx + 1) + ' [' + (p.red || 'IG') + '] ' + (p.nombre || p.handle || 'desconocido')
      + ' | Engagement: ' + eng + ' (likes: ' + (p.likes || 0) + ', comments: ' + (p.comments || 0) + ')'
      + ' | Tipo: ' + (p.type || 'post')
      + '\nTexto: "' + (p.texto || '').substring(0, 400) + '"'
      + '\n---'
  }).join('\n')

  // Agrupar posts por competidor
  var competidores = {}
  posts.forEach(function(p) {
    var nom = p.nombre || p.handle || 'desconocido'
    if (!competidores[nom]) competidores[nom] = { posts: 0, totalEng: 0, textos: [] }
    competidores[nom].posts++
    competidores[nom].totalEng += (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
    if (competidores[nom].textos.length < 3) {
      competidores[nom].textos.push((p.texto || '').substring(0, 150))
    }
  })

  var competidoresStr = Object.keys(competidores).map(function(nom) {
    var d = competidores[nom]
    return nom + ': ' + d.posts + ' posts, engagement total ' + d.totalEng
      + ', promedio ' + Math.round(d.totalEng / d.posts)
      + '\n  Ejemplos: ' + d.textos.map(function(t) { return '"' + t + '"' }).join(' | ')
  }).join('\n')

  // ═══ 3. Detectar patrones client-side ═══
  var patrones = detectarPatrones(posts)
  console.log('   Patrones detectados: ' + Object.keys(patrones.temas).length + ' temas, '
    + Object.keys(patrones.formatos).length + ' formatos')

  var patronesStr = 'TEMAS detectados:\n'
  Object.keys(patrones.temas).forEach(function(tema) {
    var d = patrones.temas[tema]
    patronesStr += '- ' + tema + ': ' + d.count + ' posts, engagement total ' + d.totalEng
      + ', promedio ' + Math.round(d.totalEng / d.count) + '\n'
  })
  patronesStr += '\nFORMATOS detectados:\n'
  Object.keys(patrones.formatos).forEach(function(fmt) {
    var d = patrones.formatos[fmt]
    patronesStr += '- ' + fmt + ': ' + d.count + ' posts, engagement total ' + d.totalEng
      + ', promedio ' + Math.round(d.totalEng / d.count) + '\n'
  })
  patronesStr += '\nTONOS detectados:\n'
  Object.keys(patrones.tonos).forEach(function(tono) {
    patronesStr += '- ' + tono + ': ' + patrones.tonos[tono] + ' posts\n'
  })

  // Contexto estacional
  var ahora = new Date()
  var mesActual = ahora.getMonth() + 1
  var meses = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  var mesNombre = meses[mesActual]
  var anio = ahora.getFullYear()

  var fechasProximas = []
  // Fechas del mes actual y siguiente
  var mesesRevisar = [mesActual, mesActual === 12 ? 1 : mesActual + 1]
  mesesRevisar.forEach(function(m) {
    var fs = FECHAS_POR_MES[m] || []
    fs.forEach(function(f) {
      fechasProximas.push(f.dia + ' de ' + meses[m] + ': ' + f.nombre)
    })
  })

  // ═══ 3b. Recomendaciones de la memoria (aprendizaje inter-run) ═══
  memoria = memoria || null
  var memoriaRecsCtx = ''
  if (memoria) {
    var memoriaModule = require('./radar-memoria.js')
    var recs = memoriaModule.generarRecomendacionesBrief(memoria)
    if (recs.length > 0) {
      memoriaRecsCtx = '\n══════════════════════════════════\n'
      memoriaRecsCtx += 'APRENDIZAJE DE RUNS ANTERIORES (incorporar obligatoriamente):\n'
      memoriaRecsCtx += '══════════════════════════════════\n'
      recs.forEach(function(r) { memoriaRecsCtx += '- ' + r + '\n' })
      memoriaRecsCtx += '\n'
      console.log('   ' + recs.length + ' recomendaciones de memoria inyectadas en el brief')
    }
    // Inyectar contexto completo de aprendizaje
    var aprendizajeCtx = memoriaModule.generarContextoAprendizaje(memoria)
    if (aprendizajeCtx) {
      memoriaRecsCtx += aprendizajeCtx + '\n'
    }
  }

  // ═══ 3c. Datos de industria del predictor M&P ═══
  var industriaCtx = ''
  try {
    var industriaModule = require('./radar-industria.js')
    industriaCtx = industriaModule.generarContextoIndustria(perfil)
    console.log('   Datos de industria inyectados: ' + (industriaModule.detectarIndustria(perfil)).nombre)
  } catch (e) { console.log('   Industria skip: ' + e.message) }

  // ═══ 4. OpenAI genera brief JSON ═══
  var prompt = 'Eres un DIRECTOR DE ESTRATEGIA DE CONTENIDOS con 15 anos de experiencia en marketing digital en Chile y Latinoamerica.\n'
    + 'Tu tarea es generar un BRIEF ESTRATEGICO COMPLETO basado en datos reales de la competencia.\n\n'
    + '══════════════════════════════════\n'
    + 'PERFIL DEL CLIENTE:\n'
    + '══════════════════════════════════\n'
    + (perfilInfo || 'Sin perfil detallado. Inferir del nombre: ' + nombre) + '\n'
    + aprendizajesCtx + '\n'
    + '══════════════════════════════════\n'
    + 'ANALISIS DE COMPETIDORES (datos reales):\n'
    + '══════════════════════════════════\n'
    + competidoresStr + '\n\n'
    + '══════════════════════════════════\n'
    + 'TOP 20 POSTS POR ENGAGEMENT:\n'
    + '══════════════════════════════════\n'
    + top20Str + '\n\n'
    + '══════════════════════════════════\n'
    + 'PATRONES DETECTADOS (analisis automatico):\n'
    + '══════════════════════════════════\n'
    + patronesStr + '\n\n'
    + '══════════════════════════════════\n'
    + 'CONTEXTO ESTACIONAL:\n'
    + '══════════════════════════════════\n'
    + 'Mes actual: ' + mesNombre + ' ' + anio + '\n'
    + 'Fechas proximas relevantes: ' + fechasProximas.join(', ') + '\n\n'
    + memoriaRecsCtx
    + industriaCtx + '\n'
    + '══════════════════════════════════\n'
    + 'INSTRUCCIONES:\n'
    + '══════════════════════════════════\n'
    + 'Genera un brief estrategico COMPLETO en formato JSON con esta estructura EXACTA:\n\n'
    + '{\n'
    + '  "resumen_negocio": "1 parrafo sobre que hace la empresa y su posicion en el mercado",\n'
    + '  "publico_objetivo": {\n'
    + '    "descripcion": "quien es el cliente ideal",\n'
    + '    "pain_points": ["dolor 1", "dolor 2", "dolor 3"],\n'
    + '    "motivaciones": ["que buscan", "que valoran"]\n'
    + '  },\n'
    + '  "propuesta_valor_unica": "1 frase que diferencia al cliente de CADA competidor especifico",\n'
    + '  "competidores_analizados": [\n'
    + '    {\n'
    + '      "nombre": "nombre real del competidor",\n'
    + '      "fortalezas": ["que hacen bien en contenido"],\n'
    + '      "debilidades": ["que NO hacen o hacen mal"],\n'
    + '      "oportunidad_para_cliente": "que puede hacer el cliente que este competidor no hace"\n'
    + '    }\n'
    + '  ],\n'
    + '  "territorios_contenido": [\n'
    + '    {\n'
    + '      "territorio": "nombre del pilar tematico",\n'
    + '      "justificacion": "por que este territorio basado en data de competencia",\n'
    + '      "formatos_recomendados": ["reel", "carrusel", "articulo"],\n'
    + '      "frecuencia_sugerida": "2 por semana",\n'
    + '      "ejemplo_angulo": "angulo especifico para el primer post"\n'
    + '    }\n'
    + '  ],\n'
    + '  "tono_comunicacion": {\n'
    + '    "estilo": "profesional pero cercano",\n'
    + '    "palabras_usar": ["lista de palabras/frases que definen el tono"],\n'
    + '    "palabras_evitar": ["lista de lo que NO decir"],\n'
    + '    "referencia": "similar a [competidor] pero con [diferencia]"\n'
    + '  },\n'
    + '  "calendario_estacional": {\n'
    + '    "fechas_relevantes": ["1 mayo: Dia del Trabajo", "10 mayo: Dia de la Madre"],\n'
    + '    "temas_temporada": ["otono", "cierre Q2"],\n'
    + '    "oportunidades": ["evento X de la industria"]\n'
    + '  },\n'
    + '  "reglas_contenido": [\n'
    + '    "Nunca hablar de precio directamente",\n'
    + '    "Siempre incluir CTA medible",\n'
    + '    "Minimo 1 dato estadistico por post"\n'
    + '  ],\n'
    + '  "fecha_generacion": "' + ahora.toISOString().split('T')[0] + '"\n'
    + '}\n\n'
    + 'REGLAS OBLIGATORIAS:\n'
    + '1. competidores_analizados DEBE incluir TODOS los competidores del analisis, no solo 1\n'
    + '2. territorios_contenido DEBE incluir MINIMO 4 territorios, cada uno con justificacion basada en DATOS REALES\n'
    + '3. NO inventes datos ni porcentajes. USA SOLO lo que esta en los posts de arriba\n'
    + '4. El brief debe ser ESPECIFICO para ' + nombre + ', no generico\n'
    + '5. Las reglas_contenido deben ser accionables y especificas al rubro\n'
    + '6. El tono debe basarse en lo que FUNCIONA en la competencia (posts con mas engagement)\n'
    + '7. El calendario estacional debe ser relevante para el rubro de ' + (perfil.rubro || 'la empresa') + '\n'
    + '\nAdicional al JSON, incluye al inicio un campo "razonamiento_estrategico" (string) donde expliques:\n'
    + '1. Que patron CLAVE detectaste en la competencia que define tu estrategia\n'
    + '2. Por que elegiste ESOS territorios y no otros (basado en datos, no intuicion)\n'
    + '3. Que OPORTUNIDAD concreta tiene ' + nombre + ' que la competencia no esta aprovechando\n'
    + '4. Si hay datos de aprendizaje (runs previos, auditoria), como los incorporaste\n'
    + '5. Que RIESGO ves si el cliente no actua en las proximas 2 semanas\n\n'
    + 'Responde SOLO con el JSON valido. Nada mas.'

  console.log('   OpenAI generando brief estrategico...')
  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o', temperature: 0.4, max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) {
      var errText = await res.text()
      throw new Error('OpenAI HTTP ' + res.status + ': ' + errText.substring(0, 200))
    }
    var data = await res.json()
    var raw = data.choices[0].message.content
    var brief = JSON.parse(raw)

    // Validar estructura minima
    if (!brief.resumen_negocio) {
      console.error('   BRIEF WARNING: sin resumen_negocio en respuesta')
    }
    if (!brief.territorios_contenido || !Array.isArray(brief.territorios_contenido)) {
      console.error('   BRIEF WARNING: sin territorios_contenido validos')
      brief.territorios_contenido = []
    }
    if (!brief.competidores_analizados || !Array.isArray(brief.competidores_analizados)) {
      console.error('   BRIEF WARNING: sin competidores_analizados validos')
      brief.competidores_analizados = []
    }

    // Asegurar fecha
    brief.fecha_generacion = ahora.toISOString().split('T')[0]

    console.log('   Brief generado: ' + (brief.territorios_contenido.length || 0) + ' territorios, '
      + (brief.competidores_analizados.length || 0) + ' competidores, '
      + (brief.reglas_contenido ? brief.reglas_contenido.length : 0) + ' reglas')

    // ═══ 5. Guardar en Supabase con versionado ═══
    if (supabase && suscriptor.id) {
      try {
        var perfilActual = suscriptor.perfil_empresa || {}

        // Versionado: si ya hay un brief, guardarlo en historial antes de sobreescribir
        if (perfilActual.brief && perfilActual.brief.fecha_generacion) {
          // Solo versionar si NO fue editado por el cliente (respeto)
          if (!perfilActual.brief.editado_por_cliente) {
            if (!Array.isArray(perfilActual.brief_historial)) perfilActual.brief_historial = []
            // Guardar max 6 versiones anteriores
            perfilActual.brief_historial.unshift({
              fecha: perfilActual.brief.fecha_generacion,
              territorios: (perfilActual.brief.territorios_contenido || []).length,
              competidores: (perfilActual.brief.competidores_analizados || []).length,
              propuesta_valor: (perfilActual.brief.propuesta_valor_unica || '').substring(0, 100),
            })
            if (perfilActual.brief_historial.length > 6) perfilActual.brief_historial = perfilActual.brief_historial.slice(0, 6)
            console.log('   Brief anterior versionado (' + perfilActual.brief_historial.length + ' versiones en historial)')
          } else {
            console.log('   Brief anterior editado por cliente — NO se sobreescribe, se conserva')
            // No reemplazar un brief editado por el cliente
            return perfilActual.brief
          }
        }

        perfilActual.brief = brief
        var upd = await supabase.from('clipping_suscripciones')
          .update({ perfil_empresa: perfilActual, updated_at: new Date().toISOString() })
          .eq('id', suscriptor.id)
        if (upd.error) {
          console.error('   BRIEF ERROR guardando: ' + upd.error.message)
        } else {
          console.log('   Brief guardado en perfil_empresa.brief')
        }
      } catch (e) {
        console.error('   BRIEF ERROR guardando: ' + e.message)
      }
    }

    // ═══ 6. Retornar ═══
    return brief
  } catch (e) {
    console.error('   BRIEF ERROR: ' + e.message)
    return null
  }
}

module.exports = { generarBrief: generarBrief }
