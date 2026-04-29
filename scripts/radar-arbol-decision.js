// radar-arbol-decision.js
// Genera ÁRBOL DE DECISIÓN DIGITAL con data real del predictor M&P
// CICLO DE APRENDIZAJE: Predictor → Cotizaciones → Árboles anteriores → Nuevo árbol → Aprendizaje
//
// El árbol se AUTO-MEJORA porque:
// 1. Lee sus propios árboles anteriores del mismo cliente
// 2. Lee qué ramas se podaron y por qué
// 3. Lee aprendizajes guardados en copilot_aprendizajes
// 4. Lee patrones de cotizaciones pasadas de M&P (qué industria → qué árbol)
// 5. Lee el predictor para KPIs actualizados (estacionalidad, CPC del mes)
// 6. Guarda aprendizajes nuevos para el próximo run
//
// Alimenta al agente de campaña con lógica real, no estimaciones
//
// Costo: ~$0.03/run (1 call Claude Sonnet) + $0 predictor (API interna)

var fetch = require('node-fetch')
var fs = require('fs')
var path = require('path')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS
var PREDICTOR_URL = process.env.PREDICTOR_URL || 'https://www.mulleryperez.cl/api/predictions/motor-2025'
var SB_URL = process.env.SUPABASE_URL
var SB_KEY = process.env.SUPABASE_SERVICE_KEY

// Helpers Supabase directos (no depende de instancia externa)
var SB_HEADERS = SB_KEY ? { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' } : null

async function sbSelect(table, query) {
  if (!SB_URL || !SB_HEADERS) return []
  var res = await fetch(SB_URL + '/rest/v1/' + table + '?' + query, { headers: SB_HEADERS })
  var data = await res.json()
  return Array.isArray(data) ? data : []
}

async function sbInsert(table, row) {
  if (!SB_URL || !SB_HEADERS) { console.log('   sbInsert: sin SB_URL o SB_HEADERS'); return null }
  var body = safeJSON(row)
  var res = await fetch(SB_URL + '/rest/v1/' + table, { method: 'POST', headers: SB_HEADERS, body: JSON.stringify(body) })
  var result = await res.text()
  if (!res.ok) console.log('   sbInsert ' + table + ' error ' + res.status + ': ' + result.substring(0, 200))
  return res.ok ? JSON.parse(result) : null
}

function safeJSON(obj) {
  try { return JSON.parse(JSON.stringify(obj)) } catch (e) { return {} }
}

async function sbUpdate(table, id, data) {
  if (!SB_URL || !SB_HEADERS) return null
  await fetch(SB_URL + '/rest/v1/' + table + '?id=eq.' + id, { method: 'PATCH', headers: SB_HEADERS, body: JSON.stringify(data) })
}

// ═══════════════════════════════════════════════
// 1. CONSULTAR PREDICTOR M&P
// ═══════════════════════════════════════════════
async function consultarPredictor(industria, presupuesto, tasaCierre, ticketPromedio, opciones) {
  opciones = opciones || {}
  var body = {
    X_presupuesto_mensual: presupuesto,
    Y_tasa_cierre: tasaCierre || 5,
    Z_ticket_promedio: ticketPromedio || 500000,
    industria: industria || 'SERVICIOS_PROFESIONALES',
    tipo_cliente: opciones.tipo_cliente || 'B2C',
    competencia_percibida: opciones.competencia || 5,
    madurez_digital: opciones.madurez || 'INTERMEDIO',
    geo_objetivo: opciones.geo || 'NACIONAL',
    ciclo_venta: opciones.ciclo_venta || 'UNO_A_TRES_MESES',
    margen_bruto: opciones.margen || 40,
    mes_actual: new Date().getMonth() + 1,
  }

  try {
    var res = await fetch(PREDICTOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) { console.log('   Predictor HTTP ' + res.status); return null }
    return await res.json()
  } catch (e) {
    console.log('   Predictor error: ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// 2. CARGAR ÁRBOLES ANTERIORES DEL MISMO CLIENTE
// ═══════════════════════════════════════════════
async function cargarArbolesAnteriores(supabaseParam, suscripcionId) {
  try {
    var data = await sbSelect('copilot_arboles', 'suscripcion_id=eq.' + suscripcionId + '&order=created_at.desc&limit=6&select=mes,anio,datos,predictor_input,predictor_output,created_at')
    if (data.length > 0) console.log('   Árboles anteriores cargados: ' + data.length)
    return data
  } catch (e) {
    console.log('   Árboles anteriores error: ' + e.message)
    return []
  }
}

// (función legacy eliminada)

// ═══════════════════════════════════════════════
// 3. APRENDER DE COTIZACIONES PASADAS DE M&P
// ═══════════════════════════════════════════════
function cargarPatronesCotizaciones(rubro) {
  // Patrones extraídos de 30+ cotizaciones M&P reales
  // Cada patrón: industria → distribución típica → qué funcionó
  var patrones = {
    inmobiliaria: {
      distribucion_tipica: 'Search 35%, Meta Lead Forms 30%, PMax 15%, Remarketing 10%, Conquista 10%',
      aprendizajes: [
        'Keywords de proyecto específico tienen CPL 40% menor que genéricas',
        'Meta Lead Forms con preguntas de calificación reducen leads basura 60%',
        'Remarketing a visitantes de landing >30s tiene conversión 3x mayor',
        'Campañas de conquista nombran competidores directos en Search',
        'PMax con renders de proyectos supera display genérico',
        'Ciclo de venta 2-3 meses: remarketing es crítico para nutrir',
      ],
      presupuesto_ref: { min: 500000, tipico: 800000, alto: 2000000, por: 'proyecto' },
    },
    salud: {
      distribucion_tipica: 'Search 40%, Meta 25%, PMax 15%, Remarketing 10%, YouTube 10%',
      aprendizajes: [
        'Keywords de síntoma/dolor convierten mejor que nombre de procedimiento',
        'Formularios con pregunta de calificación (educación, país) filtran leads',
        'Landing con testimonios de pacientes aumenta CVR 25%',
        'Remarketing con urgencia ("cupos limitados") funciona en servicios de salud',
      ],
      presupuesto_ref: { min: 300000, tipico: 600000, alto: 1500000, por: 'servicio' },
    },
    ecommerce: {
      distribucion_tipica: 'Shopping/PMax 40%, Search 20%, Meta 20%, Remarketing 15%, Display 5%',
      aprendizajes: [
        'Shopping/PMax con feed optimizado supera Search en ROAS',
        'Remarketing de carrito abandonado tiene ROAS 5-8x',
        'Meta con catálogo dinámico escala mejor que imágenes estáticas',
        'Search genérico tiene CPL alto — priorizar long-tail y marca',
      ],
      presupuesto_ref: { min: 500000, tipico: 1500000, alto: 5000000, por: 'tienda' },
    },
    saas: {
      distribucion_tipica: 'Search 25%, Meta 30%, LinkedIn orgánico, Remarketing 15%, Webinar 15%, PMax 15%',
      aprendizajes: [
        'CFO/COO no buscan en Google el nombre del software — generar demanda con Meta',
        'Webinars como lead magnet premium tienen CPL alto pero calidad 3x mejor',
        'LinkedIn Ads CPC altísimo en Chile — mejor orgánico del CEO',
        'Remarketing con caso de éxito tiene 2x tasa de demo',
      ],
      presupuesto_ref: { min: 500000, tipico: 1000000, alto: 3000000, por: 'producto' },
    },
    educacion: {
      distribucion_tipica: 'Search 35%, Meta 30%, PMax 15%, Display 10%, Remarketing 10%',
      aprendizajes: [
        'Keywords de carrera + ciudad tienen intent alto',
        'Meta con video testimonial de egresados convierte mejor',
        'Estacionalidad fuerte: enero-marzo pico de matrícula',
        'Remarketing con becas/financiamiento cierra indecisos',
      ],
      presupuesto_ref: { min: 400000, tipico: 800000, alto: 2000000, por: 'programa' },
    },
    servicios_profesionales: {
      distribucion_tipica: 'Search 40%, Meta 25%, Remarketing 15%, PMax 10%, Display 10%',
      aprendizajes: [
        'Search captura demanda activa — base de toda la estrategia',
        'Meta para awareness y lead nurturing, no conversión directa',
        'Caso de éxito en landing multiplica conversión',
        'Ticket alto = ciclo largo, remarketing es esencial',
      ],
      presupuesto_ref: { min: 300000, tipico: 700000, alto: 1500000, por: 'servicio' },
    },
    construccion: {
      distribucion_tipica: 'Search 40%, Meta 25%, PMax 15%, Remarketing 10%, Display 10%',
      aprendizajes: [
        'Proyectos de remodelación: keywords "antes/después" tienen alto CTR',
        'Meta con fotos de obras terminadas genera leads calificados',
        'Ticket alto + ciclo largo = remarketing crítico',
      ],
      presupuesto_ref: { min: 400000, tipico: 800000, alto: 2000000, por: 'proyecto' },
    },
  }

  // Buscar match
  var r = (rubro || '').toLowerCase()
  var keys = Object.keys(patrones)
  for (var i = 0; i < keys.length; i++) {
    if (r.includes(keys[i]) || keys[i].includes(r.substring(0, 4))) {
      return patrones[keys[i]]
    }
  }
  return patrones.servicios_profesionales // default
}

// ═══════════════════════════════════════════════
// 4. GENERAR CONTEXTO DE APRENDIZAJE PARA CLAUDE
// ═══════════════════════════════════════════════
function generarContextoAprendizaje(arbolesAnteriores, aprendizajes, patronesCoti) {
  var ctx = ''

  // Árboles anteriores del mismo cliente
  if (arbolesAnteriores.length > 0) {
    ctx += '═══ ÁRBOLES ANTERIORES DE ESTE CLIENTE ═══\n'
    ctx += 'Tienes ' + arbolesAnteriores.length + ' árboles históricos. Aprende de ellos:\n\n'

    arbolesAnteriores.slice(0, 3).forEach(function(arbol, i) {
      var datos = arbol.datos || {}
      var ramas = datos.ramas || []
      var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      ctx += 'Árbol ' + (meses[(arbol.mes || 1) - 1]) + '/' + (arbol.anio || '?') + ':\n'
      ctx += '  Presupuesto: $' + ((datos.presupuesto_total || 0).toLocaleString()) + '\n'
      ctx += '  Ramas: ' + ramas.length + '\n'
      ramas.forEach(function(r) {
        ctx += '    - ' + (r.nombre || r.plataforma) + ': $' + ((r.presupuesto || 0).toLocaleString()) + ' (' + (r.porcentaje || '?') + '%)'
        if (r.kpis_esperados && r.kpis_esperados.cpl) ctx += ' CPL esperado: $' + r.kpis_esperados.cpl
        if (r.resultado_real) ctx += ' → RESULTADO REAL: ' + JSON.stringify(r.resultado_real)
        ctx += '\n'
      })
      if (datos.reglas_poda) {
        ctx += '  Reglas de poda: ' + datos.reglas_poda.slice(0, 2).join('; ') + '\n'
      }
      ctx += '\n'
    })
  }

  // Aprendizajes persistentes
  if (aprendizajes.length > 0) {
    var relevantes = aprendizajes.filter(function(a) {
      return a.agente === 'arbol_decision' || a.agente === 'campana' || a.tipo === 'patron'
    })
    if (relevantes.length > 0) {
      ctx += '═══ APRENDIZAJES CONFIRMADOS ═══\n'
      relevantes.slice(0, 8).forEach(function(a) {
        var stars = a.confianza >= 0.8 ? '★★★' : a.confianza >= 0.6 ? '★★' : '★'
        ctx += '[' + stars + '] ' + a.aprendizaje
        if (a.confirmaciones > 1) ctx += ' (confirmado ' + a.confirmaciones + 'x)'
        ctx += '\n'
      })
      ctx += '\n'
    }
  }

  // Patrones de cotizaciones M&P
  if (patronesCoti) {
    ctx += '═══ EXPERIENCIA M&P EN ESTA INDUSTRIA ═══\n'
    ctx += 'Distribución típica: ' + patronesCoti.distribucion_tipica + '\n'
    ctx += 'Presupuesto referencia: $' + (patronesCoti.presupuesto_ref.tipico || 0).toLocaleString() + ' ' + (patronesCoti.presupuesto_ref.por || '') + '\n'
    ctx += 'Aprendizajes de cotizaciones reales:\n'
    patronesCoti.aprendizajes.forEach(function(a) {
      ctx += '  • ' + a + '\n'
    })
    ctx += '\n'
  }

  return ctx
}

// ═══════════════════════════════════════════════
// 5. GENERAR ÁRBOL COMPLETO
// ═══════════════════════════════════════════════
async function generarArbolDecision(perfil, brief, industria, memoria, aprendizajes, supabase, suscripcionId) {
  console.log('\n   === ÁRBOL DE DECISIÓN DIGITAL ===')

  perfil = perfil || {}
  brief = brief || {}
  industria = industria || {}
  aprendizajes = aprendizajes || []

  var nombreEmpresa = perfil.nombre || 'la empresa'
  var rubro = perfil.rubro || 'general'
  var presupuesto = perfil.presupuesto_mensual || brief.presupuesto_estimado || 1000000
  var tasaCierre = perfil.tasa_cierre || 5
  var ticketPromedio = perfil.ticket_promedio || 500000
  var industriaPredictor = mapearIndustriaPredictor(rubro)

  // ═══ PASO 1: Predictor M&P ═══
  console.log('   [1/4] Consultando predictor para ' + industriaPredictor + ' con $' + presupuesto.toLocaleString())
  var prediccion = await consultarPredictor(industriaPredictor, presupuesto, tasaCierre, ticketPromedio, {
    tipo_cliente: perfil.tipo_cliente || 'B2C',
    competencia: perfil.competencia_percibida || 5,
    madurez: perfil.madurez_digital || 'INTERMEDIO',
    geo: perfil.geo || 'NACIONAL',
    ciclo_venta: perfil.ciclo_venta || 'UNO_A_TRES_MESES',
    margen: perfil.margen_bruto || 40,
  })

  var predictorCtx = ''
  if (prediccion) {
    var esc = prediccion.escenarios || {}
    var base = esc.base || esc.realista || {}
    predictorCtx = '═══ DATOS PREDICTOR M&P (reales, no estimaciones) ═══\n'
    predictorCtx += 'Industria: ' + industriaPredictor + ' | Presupuesto: $' + presupuesto.toLocaleString() + '\n'
    if (base.conversiones !== undefined) predictorCtx += 'Conversiones esperadas: ' + base.conversiones + '/mes\n'
    if (base.cpa !== undefined) predictorCtx += 'CPA esperado: $' + Math.round(base.cpa).toLocaleString() + '\n'
    if (base.roas !== undefined) predictorCtx += 'ROAS esperado: ' + base.roas.toFixed(1) + 'x\n'
    if (prediccion.performance) {
      if (prediccion.performance.clicks_estimados) predictorCtx += 'Clicks estimados: ' + prediccion.performance.clicks_estimados + '\n'
      if (prediccion.performance.cvr) predictorCtx += 'CVR: ' + prediccion.performance.cvr + '%\n'
    }
    if (prediccion.mix_campanas) {
      predictorCtx += 'Mix recomendado:\n'
      prediccion.mix_campanas.forEach(function(m) {
        predictorCtx += '  - ' + (m.plataforma || m.canal) + ': ' + (m.porcentaje || m.pct) + '%\n'
      })
    }
    if (prediccion.recomendaciones) {
      if (prediccion.recomendaciones.estrategia) predictorCtx += 'Estrategia: ' + prediccion.recomendaciones.estrategia + '\n'
    }
    // Escenarios completos
    var cons = esc.conservador || esc.pesimista || {}
    var agr = esc.agresivo || esc.optimista || {}
    predictorCtx += '\nEscenarios predictor:\n'
    predictorCtx += '  Pesimista: ' + (cons.conversiones || '?') + ' conv, ROAS ' + ((cons.roas || 0).toFixed(1)) + 'x\n'
    predictorCtx += '  Base: ' + (base.conversiones || '?') + ' conv, ROAS ' + ((base.roas || 0).toFixed(1)) + 'x\n'
    predictorCtx += '  Optimista: ' + (agr.conversiones || '?') + ' conv, ROAS ' + ((agr.roas || 0).toFixed(1)) + 'x\n'

    console.log('   Predictor OK: ROAS ' + (base.roas || '?') + 'x, ' + (base.conversiones || '?') + ' conv/mes')
  } else {
    predictorCtx = 'Predictor no disponible — usar benchmarks de industria\n'
  }

  // ═══ PASO 2: Árboles anteriores del mismo cliente ═══
  console.log('   [2/4] Cargando árboles anteriores...')
  var arbolesAnteriores = supabase ? await cargarArbolesAnteriores(supabase, suscripcionId) : []

  // ═══ PASO 3: Patrones de cotizaciones M&P ═══
  console.log('   [3/4] Cargando patrones de cotizaciones...')
  var patronesCoti = cargarPatronesCotizaciones(rubro)

  // ═══ PASO 4: Generar con Claude ═══
  console.log('   [4/4] Generando árbol con Claude Sonnet...')
  var ctxAprendizaje = generarContextoAprendizaje(arbolesAnteriores, aprendizajes, patronesCoti)

  var briefCtx = ''
  if (brief.propuesta_valor_unica) briefCtx += 'PVU: ' + brief.propuesta_valor_unica + '\n'
  if (brief.publico_objetivo) briefCtx += 'Público: ' + (typeof brief.publico_objetivo === 'string' ? brief.publico_objetivo : JSON.stringify(brief.publico_objetivo)) + '\n'
  if (brief.diferenciadores) briefCtx += 'Diferenciadores: ' + (Array.isArray(brief.diferenciadores) ? brief.diferenciadores.join(', ') : brief.diferenciadores) + '\n'

  if (!ANTHROPIC_KEY) {
    console.log('   Sin ANTHROPIC_API_KEY_GRILLAS, generando árbol básico')
    return generarArbolBasico(prediccion, presupuesto, industriaPredictor, patronesCoti)
  }

  var prompt = 'Eres un DIRECTOR DE PERFORMANCE MARKETING con 15 años de experiencia en Chile, '
    + 'especializado en árboles de decisión digital para distribución de pauta.\n\n'
    + 'Tu trabajo: generar un ÁRBOL DE DECISIÓN que distribuye el presupuesto del cliente '
    + 'en ramas medibles, cada una con KPIs concretos basados en DATA REAL del predictor M&P.\n\n'
    + '═══ CLIENTE ═══\n'
    + 'Empresa: ' + nombreEmpresa + '\n'
    + 'Rubro: ' + rubro + '\n'
    + 'Presupuesto mensual pauta: $' + presupuesto.toLocaleString() + ' CLP\n'
    + 'Tasa cierre comercial: ' + tasaCierre + '%\n'
    + 'Ticket promedio: $' + ticketPromedio.toLocaleString() + ' CLP\n'
    + briefCtx + '\n'
    + predictorCtx + '\n'
    + ctxAprendizaje + '\n'
    + '═══ TAREA ═══\n'
    + 'Genera un ÁRBOL DE DECISIÓN DIGITAL en JSON:\n\n'
    + '{\n'
    + '  "resumen": "2-3 oraciones estrategia basada en datos",\n'
    + '  "presupuesto_total": ' + presupuesto + ',\n'
    + '  "ramas": [\n'
    + '    {\n'
    + '      "nombre": "Nombre descriptivo",\n'
    + '      "plataforma": "Google Search|Meta Ads|Google PMax|Remarketing|YouTube|Display",\n'
    + '      "objetivo": "leads|awareness|remarketing|conquista|nurturing",\n'
    + '      "presupuesto": 250000,\n'
    + '      "porcentaje": 25,\n'
    + '      "segmentacion": "Audiencia target específica",\n'
    + '      "formatos": ["search ads", "lead form"],\n'
    + '      "kpis_esperados": {\n'
    + '        "clicks": 500, "cpc": 500, "leads": 25, "cpl": 10000,\n'
    + '        "conversiones": 2, "cpa": 125000, "roas": 0\n'
    + '      },\n'
    + '      "justificacion": "Por qué esta rama basado en predictor + experiencia M&P + árboles anteriores",\n'
    + '      "criterio_poda": "Cuándo cortar (ej: si CPL > $X después de 2 semanas)",\n'
    + '      "criterio_escalar": "Cuándo duplicar presupuesto (ej: si CPL < $Y con +10 leads)"\n'
    + '    }\n'
    + '  ],\n'
    + '  "escenarios": {\n'
    + '    "pesimista": { "leads_totales": 0, "conversiones": 0, "cpa": 0, "roas": 0, "revenue": 0 },\n'
    + '    "realista": { "leads_totales": 0, "conversiones": 0, "cpa": 0, "roas": 0, "revenue": 0 },\n'
    + '    "optimista": { "leads_totales": 0, "conversiones": 0, "cpa": 0, "roas": 0, "revenue": 0 }\n'
    + '  },\n'
    + '  "reglas_poda": ["Regla concreta con números"],\n'
    + '  "reglas_escalamiento": ["Regla concreta con números"],\n'
    + '  "cronograma": [\n'
    + '    { "semana": "1-2", "accion": "Descripción concreta" }\n'
    + '  ],\n'
    + '  "aprendizajes_aplicados": ["Qué aprendiste de árboles anteriores o cotizaciones que aplicaste aquí"],\n'
    + '  "hipotesis_nuevas": ["Qué vas a testear en este árbol que no probaste antes"]\n'
    + '}\n\n'
    + 'REGLAS CRÍTICAS:\n'
    + '- La CANTIDAD de ramas depende del presupuesto y la industria:\n'
    + '  * Presupuesto < $500K: 2-3 ramas (foco, no dispersar)\n'
    + '  * Presupuesto $500K-$1.5M: 3-5 ramas\n'
    + '  * Presupuesto > $1.5M: 5-7 ramas\n'
    + '  * B2B con ticket alto: menos ramas, más presupuesto por rama\n'
    + '  * B2C con ticket bajo: más ramas para testear audiencias\n'
    + '- Los KPIs de CADA rama DEBEN calcularse con los datos del predictor:\n'
    + '  * clicks = presupuesto_rama / CPC_industria\n'
    + '  * leads = clicks * CVR_industria\n'
    + '  * conversiones = leads * tasa_cierre_cliente\n'
    + '  * CPA = presupuesto_rama / conversiones\n'
    + '  * revenue = conversiones * ticket_promedio\n'
    + '  * ROAS = revenue / presupuesto_rama\n'
    + '- Suma de presupuestos = presupuesto total EXACTO\n'
    + '- Cada rama tiene criterio de poda Y de escalamiento con NÚMEROS concretos\n'
    + '- Los escenarios (pesimista/realista/optimista) DEBEN sumar los KPIs de todas las ramas\n'
    + '  * Pesimista: CPC +40%, CVR -30%\n'
    + '  * Realista: datos del predictor directos\n'
    + '  * Optimista: CPC -20%, CVR +20%\n'
    + '- Si hay árboles anteriores, EXPLICA qué cambiaste y por qué\n'
    + '- Si hay aprendizajes confirmados (★★★), APLÍCALOS obligatoriamente\n'
    + '- Los aprendizajes de cotizaciones M&P son experiencia real — úsalos\n'
    + '- NO inventes datos — usa SOLO los del predictor y benchmarks proporcionados\n'
    + '- Si el cliente es B2B con ciclo largo, remarketing es OBLIGATORIO (mínimo 15%)\n'
    + '- Si el cliente es B2C, priorizar Meta sobre Google (Meta tiene mejor CVR para B2C)\n\n'
    + 'Responde SOLO JSON válido.'

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
        max_tokens: 4500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      var errText = await res.text()
      throw new Error('Claude árbol: HTTP ' + res.status + ' ' + errText.substring(0, 200))
    }

    var data = await res.json()
    var raw = data.content[0].text || ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    var arbol = JSON.parse(raw)

    // Validar coherencia de presupuestos
    var sumaPresupuesto = (arbol.ramas || []).reduce(function(s, r) { return s + (r.presupuesto || 0) }, 0)
    if (Math.abs(sumaPresupuesto - presupuesto) > presupuesto * 0.05) {
      console.log('   ⚠️ Suma ramas ($' + sumaPresupuesto.toLocaleString() + ') ≠ total ($' + presupuesto.toLocaleString() + ')')
    }

    console.log('   Árbol: ' + (arbol.ramas || []).length + ' ramas, $' + presupuesto.toLocaleString())
    if (arbol.aprendizajes_aplicados) {
      console.log('   Aprendizajes aplicados: ' + arbol.aprendizajes_aplicados.length)
    }
    if (arbol.hipotesis_nuevas) {
      console.log('   Hipótesis nuevas: ' + arbol.hipotesis_nuevas.length)
    }

    // Guardar en Supabase (usando fetch directo)
    if (suscripcionId) {
      try {
        var ahora = new Date()
        var mesTarget = ahora.getMonth() + 2 > 12 ? 1 : ahora.getMonth() + 2
        var anioTarget = ahora.getMonth() + 2 > 12 ? ahora.getFullYear() + 1 : ahora.getFullYear()

        var existeRes = await sbSelect('copilot_arboles', 'suscripcion_id=eq.' + suscripcionId + '&mes=eq.' + mesTarget + '&anio=eq.' + anioTarget + '&select=id&limit=1')

        var payload = {
          suscripcion_id: suscripcionId,
          mes: mesTarget,
          anio: anioTarget,
          datos: arbol,
          predictor_input: { industria: industriaPredictor, presupuesto: presupuesto, tasa_cierre: tasaCierre, ticket: ticketPromedio },
          predictor_output: null,
        }

        console.log('   Árbol payload check: sub=' + suscripcionId + ' mes=' + mesTarget + ' anio=' + anioTarget + ' ramas=' + (arbol.ramas || []).length)

        if (existeRes.length > 0) {
          await sbUpdate('copilot_arboles', existeRes[0].id, payload)
        } else {
          // No usar safeJSON para el insert — el payload es limpio
          var res2 = await fetch(SB_URL + '/rest/v1/copilot_arboles', { method: 'POST', headers: SB_HEADERS, body: JSON.stringify(payload) })
          var result2 = await res2.text()
          if (!res2.ok) console.log('   Árbol INSERT error ' + res2.status + ': ' + result2.substring(0, 300))
          else console.log('   Árbol INSERT OK')
        }

        // Guardar aprendizajes del árbol
        if (arbol.hipotesis_nuevas && arbol.hipotesis_nuevas.length > 0) {
          var memPersModule = require('./radar-memoria-persistente.js')
          for (var h = 0; h < Math.min(arbol.hipotesis_nuevas.length, 3); h++) {
            await memPersModule.guardarAprendizaje(
              supabase, suscripcionId, 'arbol_decision', 'patron',
              arbol.hipotesis_nuevas[h], 0.3,
              { mes: mesTarget, anio: anioTarget, presupuesto: presupuesto }
            )
          }
        }

        var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
        console.log('   Árbol guardado para ' + meses[mesTarget - 1] + '/' + anioTarget)
      } catch (e) {
        console.log('   Árbol save error: ' + e.message)
      }
    }

    console.log('   === ÁRBOL DE DECISIÓN COMPLETADO ===\n')
    return arbol
  } catch (e) {
    console.error('   Árbol error: ' + e.message)
    return generarArbolBasico(prediccion, presupuesto, industriaPredictor, patronesCoti)
  }
}

// ═══════════════════════════════════════════════
// FALLBACK: ÁRBOL BÁSICO SIN CLAUDE
// ═══════════════════════════════════════════════
function generarArbolBasico(prediccion, presupuesto, industria, patronesCoti) {
  console.log('   Generando árbol básico (fallback)')
  var dist = patronesCoti ? patronesCoti.distribucion_tipica : 'Search 35%, Meta 30%, PMax 20%, Remarketing 15%'
  var ramas = [
    { nombre: 'Google Search — Intent alto', plataforma: 'Google Search', presupuesto: Math.round(presupuesto * 0.35), porcentaje: 35, criterio_poda: 'CPL > 2x benchmark por 2 semanas' },
    { nombre: 'Meta Ads — Lead Forms', plataforma: 'Meta Ads', presupuesto: Math.round(presupuesto * 0.30), porcentaje: 30, criterio_poda: 'CPL > 2x benchmark por 2 semanas' },
    { nombre: 'Google PMax — Cobertura', plataforma: 'Google PMax', presupuesto: Math.round(presupuesto * 0.20), porcentaje: 20, criterio_poda: 'Sin leads en 3 semanas' },
    { nombre: 'Remarketing — Rescate', plataforma: 'Remarketing', presupuesto: Math.round(presupuesto * 0.15), porcentaje: 15, criterio_poda: 'Frecuencia > 8' },
  ]
  return { resumen: 'Distribución basada en experiencia M&P: ' + dist, presupuesto_total: presupuesto, ramas: ramas }
}

// ═══════════════════════════════════════════════
// MAPEAR RUBRO A INDUSTRIA DEL PREDICTOR
// ═══════════════════════════════════════════════
function mapearIndustriaPredictor(rubro) {
  var r = (rubro || '').toLowerCase()
  var mapa = {
    'inmobiliaria': 'INMOBILIARIA', 'inmuebles': 'INMOBILIARIA', 'propiedades': 'INMOBILIARIA',
    'ecommerce': 'ECOMMERCE', 'tienda online': 'ECOMMERCE', 'retail': 'MODA_RETAIL',
    'salud': 'SALUD_MEDICINA', 'medicina': 'SALUD_MEDICINA', 'clínica': 'SALUD_MEDICINA', 'dental': 'SALUD_MEDICINA', 'enfermería': 'SALUD_MEDICINA',
    'educación': 'EDUCACION', 'universidad': 'EDUCACION', 'colegio': 'EDUCACION',
    'turismo': 'TURISMO', 'hotel': 'TURISMO', 'viajes': 'TURISMO',
    'automotriz': 'AUTOMOTRIZ', 'auto': 'AUTOMOTRIZ',
    'fintech': 'FINTECH', 'finanzas': 'FINTECH',
    'software': 'TECNOLOGIA_SAAS', 'saas': 'TECNOLOGIA_SAAS', 'tecnología': 'TECNOLOGIA_SAAS',
    'gastronomía': 'GASTRONOMIA', 'restaurante': 'GASTRONOMIA',
    'legal': 'SERVICIOS_LEGALES', 'abogado': 'SERVICIOS_LEGALES',
    'belleza': 'BELLEZA_PERSONAL', 'estética': 'BELLEZA_PERSONAL',
    'construcción': 'CONSTRUCCION_REMODELACION', 'constructora': 'CONSTRUCCION_REMODELACION',
    'deporte': 'DEPORTES_FITNESS', 'gym': 'DEPORTES_FITNESS',
    'veterinaria': 'VETERINARIA_MASCOTAS',
    'logística': 'LOGISTICA_TRANSPORTE', 'transporte': 'LOGISTICA_TRANSPORTE',
    'seguros': 'SEGUROS',
    'agricultura': 'AGRICULTURA_AGROINDUSTRIA',
    'energía': 'ENERGIA_UTILITIES',
    'hogar': 'HOGAR_DECORACION',
    'manufactura': 'MANUFACTURA_INDUSTRIAL', 'industrial': 'MANUFACTURA_INDUSTRIAL',
  }
  var keys = Object.keys(mapa)
  for (var i = 0; i < keys.length; i++) {
    if (r.includes(keys[i])) return mapa[keys[i]]
  }
  return 'SERVICIOS_PROFESIONALES'
}

module.exports = {
  generarArbolDecision: generarArbolDecision,
  consultarPredictor: consultarPredictor,
  cargarArbolesAnteriores: cargarArbolesAnteriores,
  cargarPatronesCotizaciones: cargarPatronesCotizaciones,
  mapearIndustriaPredictor: mapearIndustriaPredictor,
}
