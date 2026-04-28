// radar-arbol-decision.js
// Genera ÁRBOL DE DECISIÓN DIGITAL con data real del predictor M&P
// Diferenciador CORE: distribuye pauta en ramas con KPIs esperados reales
//
// INTERACCIONES:
// - Lee de: Predictor API (/api/predictions/motor-2025) — CPC, CVR, ROAS, escenarios
// - Lee de: Brief (público, diferenciadores, tono)
// - Lee de: Industria (benchmarks, estacionalidad)
// - Lee de: Benchmark + Meta Ad Library (qué hace la competencia en paid)
// - Lee de: Memoria persistente (qué ramas funcionaron antes)
// - Lee de: Cotizaciones aprendidas (patrones de árboles exitosos por industria)
// - Alimenta: Dashboard (muestra árbol visual), Campaña (ramas a ejecutar), Reporting
//
// Output: Árbol con ramas, presupuestos, KPIs proyectados por rama,
//         escenarios pesimista/realista/optimista, recomendaciones de poda
//
// Costo: ~$0.03/run (1 call Claude Sonnet) + $0 predictor (API interna)

var fetch = require('node-fetch')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS
// URL del predictor — en producción es la API de Vercel, en local es localhost
var PREDICTOR_URL = process.env.PREDICTOR_URL || 'https://www.mulleryperez.cl/api/predictions/motor-2025'

// ═══════════════════════════════════════════════
// CONSULTAR EL PREDICTOR M&P PARA OBTENER PROYECCIONES REALES
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

    if (!res.ok) {
      console.log('   Predictor HTTP ' + res.status)
      return null
    }

    var data = await res.json()
    return data
  } catch (e) {
    console.log('   Predictor error: ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// GENERAR ÁRBOL DE DECISIÓN CON DATA REAL
// ═══════════════════════════════════════════════
async function generarArbolDecision(perfil, brief, industria, competenciaPaid, memoria, aprendizajes, supabase, suscripcionId) {
  console.log('\n   === ÁRBOL DE DECISIÓN DIGITAL ===')

  perfil = perfil || {}
  brief = brief || {}
  industria = industria || {}
  competenciaPaid = competenciaPaid || {}
  memoria = memoria || {}
  aprendizajes = aprendizajes || []

  var nombreEmpresa = perfil.nombre || 'la empresa'
  var rubro = perfil.rubro || 'general'

  // Obtener presupuesto estimado (del perfil o del brief)
  var presupuesto = perfil.presupuesto_mensual || brief.presupuesto_estimado || 1000000
  var tasaCierre = perfil.tasa_cierre || 5
  var ticketPromedio = perfil.ticket_promedio || 500000

  // Detectar industria del predictor
  var industriaPredictor = mapearIndustriaPredictor(rubro)

  // ═══ PASO 1: Consultar predictor para proyecciones reales ═══
  console.log('   Consultando predictor M&P para ' + industriaPredictor + ' con $' + presupuesto.toLocaleString())
  var prediccion = await consultarPredictor(
    industriaPredictor,
    presupuesto,
    tasaCierre,
    ticketPromedio,
    {
      tipo_cliente: perfil.tipo_cliente || 'B2C',
      competencia: perfil.competencia_percibida || 5,
      madurez: perfil.madurez_digital || 'INTERMEDIO',
      geo: perfil.geo || 'NACIONAL',
      ciclo_venta: perfil.ciclo_venta || 'UNO_A_TRES_MESES',
      margen: perfil.margen_bruto || 40,
    }
  )

  var predictorCtx = ''
  if (prediccion) {
    var esc = prediccion.escenarios || {}
    var base = esc.base || esc.realista || {}
    var conservador = esc.conservador || esc.pesimista || {}
    var agresivo = esc.agresivo || esc.optimista || {}

    predictorCtx = '═══ DATOS REALES DEL PREDICTOR M&P ═══\n'
    predictorCtx += 'Industria: ' + industriaPredictor + '\n'
    predictorCtx += 'Presupuesto: $' + presupuesto.toLocaleString() + ' CLP/mes\n'

    if (base.conversiones !== undefined) predictorCtx += 'Conversiones base: ' + base.conversiones + '/mes\n'
    if (base.cpa !== undefined) predictorCtx += 'CPA base: $' + Math.round(base.cpa).toLocaleString() + '\n'
    if (base.roas !== undefined) predictorCtx += 'ROAS base: ' + base.roas.toFixed(1) + 'x\n'
    if (base.revenue !== undefined) predictorCtx += 'Revenue base: $' + Math.round(base.revenue).toLocaleString() + '\n'

    if (prediccion.performance) {
      var perf = prediccion.performance
      if (perf.clicks_estimados) predictorCtx += 'Clicks estimados: ' + perf.clicks_estimados + '\n'
      if (perf.ctr) predictorCtx += 'CTR: ' + perf.ctr + '%\n'
      if (perf.cvr) predictorCtx += 'CVR: ' + perf.cvr + '%\n'
    }

    if (prediccion.mix_campanas) {
      predictorCtx += '\nMix de plataformas recomendado:\n'
      prediccion.mix_campanas.forEach(function(m) {
        predictorCtx += '- ' + (m.plataforma || m.canal) + ': ' + (m.porcentaje || m.pct) + '% — ' + (m.justificacion || '') + '\n'
      })
    }

    if (prediccion.recomendaciones) {
      var rec = prediccion.recomendaciones
      if (rec.estrategia) predictorCtx += '\nEstrategia recomendada: ' + rec.estrategia + '\n'
      if (rec.tipo_campana) predictorCtx += 'Tipo campaña: ' + rec.tipo_campana + '\n'
    }

    console.log('   Predictor OK: ROAS base ' + (base.roas || '?') + 'x, ' + (base.conversiones || '?') + ' conversiones/mes')
  } else {
    predictorCtx = 'Predictor no disponible — usar benchmarks de industria\n'
    if (industria.cpl_avg) predictorCtx += 'CPL industria: $' + industria.cpl_avg + '\n'
    if (industria.roas_avg) predictorCtx += 'ROAS industria: ' + industria.roas_avg + 'x\n'
  }

  // ═══ PASO 2: Contexto de competencia paid ═══
  var compPaidCtx = ''
  if (competenciaPaid && competenciaPaid.totalAds > 0) {
    compPaidCtx = '═══ COMPETENCIA PAID (Meta Ad Library) ═══\n'
    compPaidCtx += 'Ads activos: ' + competenciaPaid.totalAds + '\n'
    compPaidCtx += 'Competidor más activo: ' + (competenciaPaid.competidorMasActivo || {}).nombre + ' (' + (competenciaPaid.competidorMasActivo || {}).count + ' ads)\n'
    compPaidCtx += 'Ángulo dominante: ' + (competenciaPaid.anguloDominante || '?') + '\n'
  }

  // ═══ PASO 3: Aprendizajes de runs anteriores ═══
  var aprendCtx = ''
  if (aprendizajes.length > 0) {
    var relevantes = aprendizajes.filter(function(a) {
      return a.agente === 'arbol_decision' || a.agente === 'campana' || a.tipo === 'patron'
    })
    if (relevantes.length > 0) {
      aprendCtx = '═══ APRENDIZAJES DE ÁRBOLES ANTERIORES ═══\n'
      relevantes.slice(0, 5).forEach(function(a) {
        aprendCtx += '- ' + a.aprendizaje + ' (confianza: ' + a.confianza.toFixed(1) + ')\n'
      })
    }
  }

  // ═══ PASO 4: Brief context ═══
  var briefCtx = ''
  if (brief.propuesta_valor_unica) briefCtx += 'PVU: ' + brief.propuesta_valor_unica + '\n'
  if (brief.publico_objetivo) briefCtx += 'Público: ' + (typeof brief.publico_objetivo === 'string' ? brief.publico_objetivo : JSON.stringify(brief.publico_objetivo)) + '\n'
  if (brief.diferenciadores) briefCtx += 'Diferenciadores: ' + (Array.isArray(brief.diferenciadores) ? brief.diferenciadores.join(', ') : brief.diferenciadores) + '\n'

  // ═══ PASO 5: Generar árbol con Claude ═══
  if (!ANTHROPIC_KEY) {
    console.log('   Sin ANTHROPIC_API_KEY_GRILLAS, generando árbol básico')
    return generarArbolBasico(prediccion, presupuesto, industriaPredictor)
  }

  var prompt = 'Eres un DIRECTOR DE PERFORMANCE MARKETING con 15 años de experiencia en Chile. '
    + 'Generas ÁRBOLES DE DECISIÓN DIGITAL para distribuir presupuesto de pauta en ramas medibles.\n\n'
    + '═══ CLIENTE ═══\n'
    + 'Empresa: ' + nombreEmpresa + '\n'
    + 'Rubro: ' + rubro + '\n'
    + 'Presupuesto mensual pauta: $' + presupuesto.toLocaleString() + ' CLP\n'
    + 'Tasa cierre comercial: ' + tasaCierre + '%\n'
    + 'Ticket promedio: $' + ticketPromedio.toLocaleString() + ' CLP\n'
    + briefCtx + '\n'
    + predictorCtx + '\n'
    + compPaidCtx + '\n'
    + aprendCtx + '\n'
    + '═══ TAREA ═══\n'
    + 'Genera un ÁRBOL DE DECISIÓN DIGITAL en JSON con esta estructura:\n\n'
    + '{\n'
    + '  "resumen": "2-3 oraciones sobre la estrategia de distribución",\n'
    + '  "presupuesto_total": ' + presupuesto + ',\n'
    + '  "ramas": [\n'
    + '    {\n'
    + '      "nombre": "Nombre descriptivo de la rama",\n'
    + '      "plataforma": "Google Search|Meta Ads|Google PMax|Google Display|YouTube|Remarketing",\n'
    + '      "objetivo": "leads|awareness|remarketing|conquista",\n'
    + '      "presupuesto": 250000,\n'
    + '      "porcentaje": 25,\n'
    + '      "segmentacion": "Descripción de la audiencia target",\n'
    + '      "formatos": ["search ads", "lead form", "video"],\n'
    + '      "kpis_esperados": {\n'
    + '        "clicks": 500,\n'
    + '        "cpc": 500,\n'
    + '        "leads": 25,\n'
    + '        "cpl": 10000,\n'
    + '        "conversiones": 2,\n'
    + '        "cpa": 125000\n'
    + '      },\n'
    + '      "justificacion": "Por qué esta rama basado en datos del predictor y competencia",\n'
    + '      "criterio_poda": "Cuándo cortar esta rama (ej: si CPL > $X después de 2 semanas)"\n'
    + '    }\n'
    + '  ],\n'
    + '  "escenarios": {\n'
    + '    "pesimista": { "leads_totales": 0, "conversiones": 0, "cpa": 0, "roas": 0 },\n'
    + '    "realista": { "leads_totales": 0, "conversiones": 0, "cpa": 0, "roas": 0 },\n'
    + '    "optimista": { "leads_totales": 0, "conversiones": 0, "cpa": 0, "roas": 0 }\n'
    + '  },\n'
    + '  "reglas_poda": [\n'
    + '    "Regla 1: si rama X no genera leads en 15 días, redistribuir a rama Y",\n'
    + '    "Regla 2: si CPL > 2x benchmark, pausar y analizar"\n'
    + '  ],\n'
    + '  "cronograma": [\n'
    + '    { "semana": "1-2", "accion": "Lanzar todas las ramas con presupuesto base" },\n'
    + '    { "semana": "3-4", "accion": "Primera poda, escalar ganadoras" }\n'
    + '  ]\n'
    + '}\n\n'
    + 'REGLAS CRÍTICAS:\n'
    + '- MÍNIMO 4 ramas, MÁXIMO 8\n'
    + '- Los KPIs deben ser COHERENTES con los datos del predictor (CPC, CVR, etc)\n'
    + '- La suma de presupuestos de todas las ramas = presupuesto total\n'
    + '- Cada rama tiene un criterio de poda concreto (no genérico)\n'
    + '- Los escenarios deben sumar los KPIs de todas las ramas\n'
    + '- Si hay datos de competencia paid, citarlos en justificaciones\n'
    + '- NO inventar datos — usa los del predictor y benchmarks proporcionados\n\n'
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
        max_tokens: 4000,
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

    // Validar coherencia
    var sumaPresupuesto = (arbol.ramas || []).reduce(function(s, r) { return s + (r.presupuesto || 0) }, 0)
    if (Math.abs(sumaPresupuesto - presupuesto) > presupuesto * 0.05) {
      console.log('   ⚠️ Suma de ramas ($' + sumaPresupuesto.toLocaleString() + ') difiere del total ($' + presupuesto.toLocaleString() + ')')
    }

    console.log('   Árbol generado: ' + (arbol.ramas || []).length + ' ramas, presupuesto $' + presupuesto.toLocaleString())

    // Guardar en Supabase
    if (supabase && suscripcionId) {
      try {
        var ahora = new Date()
        var mesTarget = ahora.getMonth() + 2 > 12 ? 1 : ahora.getMonth() + 2
        var anioTarget = ahora.getMonth() + 2 > 12 ? ahora.getFullYear() + 1 : ahora.getFullYear()

        var existeRes = await supabase.from('copilot_arboles')
          .select('id')
          .eq('suscripcion_id', suscripcionId)
          .eq('mes', mesTarget)
          .eq('anio', anioTarget)
          .limit(1)

        var payload = {
          suscripcion_id: suscripcionId,
          mes: mesTarget,
          anio: anioTarget,
          datos: arbol,
          predictor_input: { industria: industriaPredictor, presupuesto: presupuesto, tasa_cierre: tasaCierre, ticket: ticketPromedio },
          predictor_output: prediccion ? { escenarios: prediccion.escenarios, mix: prediccion.mix_campanas } : null,
        }

        if (existeRes.data && existeRes.data.length > 0) {
          await supabase.from('copilot_arboles').update({ datos: arbol, predictor_input: payload.predictor_input, predictor_output: payload.predictor_output }).eq('id', existeRes.data[0].id)
        } else {
          await supabase.from('copilot_arboles').insert(payload)
        }
        console.log('   Árbol guardado para mes ' + mesTarget + '/' + anioTarget)
      } catch (e) {
        console.log('   Árbol save error (tabla puede no existir): ' + e.message)
      }
    }

    console.log('   === ÁRBOL DE DECISIÓN COMPLETADO ===\n')
    return arbol
  } catch (e) {
    console.error('   Árbol de decisión error: ' + e.message)
    return generarArbolBasico(prediccion, presupuesto, industriaPredictor)
  }
}

// ═══════════════════════════════════════════════
// ÁRBOL BÁSICO (fallback sin Claude)
// ═══════════════════════════════════════════════
function generarArbolBasico(prediccion, presupuesto, industria) {
  var ramas = [
    { nombre: 'Google Search — Intent alto', plataforma: 'Google Search', presupuesto: Math.round(presupuesto * 0.35), porcentaje: 35 },
    { nombre: 'Meta Ads — Lead Forms', plataforma: 'Meta Ads', presupuesto: Math.round(presupuesto * 0.30), porcentaje: 30 },
    { nombre: 'Google PMax — Cobertura', plataforma: 'Google PMax', presupuesto: Math.round(presupuesto * 0.20), porcentaje: 20 },
    { nombre: 'Remarketing — Rescate', plataforma: 'Remarketing', presupuesto: Math.round(presupuesto * 0.15), porcentaje: 15 },
  ]
  return { resumen: 'Distribución estándar por industria ' + industria, presupuesto_total: presupuesto, ramas: ramas }
}

// ═══════════════════════════════════════════════
// MAPEAR RUBRO A INDUSTRIA DEL PREDICTOR
// ═══════════════════════════════════════════════
function mapearIndustriaPredictor(rubro) {
  var r = (rubro || '').toLowerCase()
  var mapa = {
    'inmobiliaria': 'INMOBILIARIA', 'inmuebles': 'INMOBILIARIA', 'propiedades': 'INMOBILIARIA', 'bienes raíces': 'INMOBILIARIA',
    'ecommerce': 'ECOMMERCE', 'tienda online': 'ECOMMERCE', 'retail': 'MODA_RETAIL',
    'salud': 'SALUD_MEDICINA', 'medicina': 'SALUD_MEDICINA', 'clínica': 'SALUD_MEDICINA', 'dental': 'SALUD_MEDICINA', 'enfermería': 'SALUD_MEDICINA',
    'educación': 'EDUCACION', 'universidad': 'EDUCACION', 'colegio': 'EDUCACION', 'instituto': 'EDUCACION',
    'turismo': 'TURISMO', 'hotel': 'TURISMO', 'viajes': 'TURISMO',
    'automotriz': 'AUTOMOTRIZ', 'auto': 'AUTOMOTRIZ', 'vehículo': 'AUTOMOTRIZ',
    'fintech': 'FINTECH', 'finanzas': 'FINTECH', 'banco': 'FINTECH',
    'software': 'TECNOLOGIA_SAAS', 'saas': 'TECNOLOGIA_SAAS', 'tecnología': 'TECNOLOGIA_SAAS',
    'gastronomía': 'GASTRONOMIA', 'restaurante': 'GASTRONOMIA', 'comida': 'GASTRONOMIA',
    'legal': 'SERVICIOS_LEGALES', 'abogado': 'SERVICIOS_LEGALES',
    'belleza': 'BELLEZA_PERSONAL', 'estética': 'BELLEZA_PERSONAL',
    'construcción': 'CONSTRUCCION_REMODELACION', 'constructora': 'CONSTRUCCION_REMODELACION',
    'deporte': 'DEPORTES_FITNESS', 'gym': 'DEPORTES_FITNESS', 'fitness': 'DEPORTES_FITNESS',
    'veterinaria': 'VETERINARIA_MASCOTAS', 'mascota': 'VETERINARIA_MASCOTAS',
    'logística': 'LOGISTICA_TRANSPORTE', 'transporte': 'LOGISTICA_TRANSPORTE',
    'seguros': 'SEGUROS',
    'agricultura': 'AGRICULTURA_AGROINDUSTRIA',
    'energía': 'ENERGIA_UTILITIES',
    'hogar': 'HOGAR_DECORACION', 'decoración': 'HOGAR_DECORACION',
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
  mapearIndustriaPredictor: mapearIndustriaPredictor,
}
