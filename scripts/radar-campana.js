// radar-campana.js
// Generador de árbol de decisión de campaña sugerido
// Input: brief + competencia + industria + datos cliente + presupuesto estimado
// Output: plan de campaña completo tipo cotización M&P
// Usa Claude Sonnet para máxima calidad
// Se llama desde radar-clipping.js en modo mensual (plan business)
// Costo: ~$0.03/run (1 call Claude Sonnet)

var fetch = require('node-fetch')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

async function generarPlanCampana(posts, empresas, perfil, brief, memoria, postsCliente, industria, supabase, suscripcionId) {
  console.log('\n   === PLAN DE CAMPAÑA SUGERIDO ===')

  if (!ANTHROPIC_KEY) {
    console.log('   Sin ANTHROPIC_API_KEY_GRILLAS, saltando')
    return null
  }

  perfil = perfil || {}
  brief = brief || {}
  memoria = memoria || {}
  postsCliente = postsCliente || []
  industria = industria || {}

  var nombreEmpresa = perfil.nombre || 'la empresa'
  var rubro = perfil.rubro || 'general'

  // Construir contexto completo para Claude
  var postsOrdenados = posts.slice().sort(function(a, b) {
    return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
  })

  // Métricas de competencia
  var compMetricas = {}
  posts.forEach(function(p) {
    var n = p.nombre || p.handle || 'desconocido'
    if (!compMetricas[n]) compMetricas[n] = { posts: 0, likes: 0, comments: 0, formatos: {}, temas: {} }
    var m = compMetricas[n]
    m.posts++
    m.likes += (p.likes || 0)
    m.comments += (p.comments || 0)
    var fmt = detectarFormato(p.type || p.tipo_post || '')
    m.formatos[fmt] = (m.formatos[fmt] || 0) + 1
    var tema = detectarTema(p.texto || '')
    m.temas[tema] = (m.temas[tema] || 0) + 1
  })

  var compResumen = Object.keys(compMetricas).map(function(n) {
    var m = compMetricas[n]
    var avgEng = m.posts > 0 ? Math.round((m.likes + m.comments) / m.posts) : 0
    var topFmt = Object.keys(m.formatos).sort(function(a, b) { return m.formatos[b] - m.formatos[a] })[0] || 'post'
    var topTema = Object.keys(m.temas).sort(function(a, b) { return m.temas[b] - m.temas[a] })[0] || 'general'
    return n + ': ' + m.posts + ' posts, avg engagement ' + avgEng + ', formato top: ' + topFmt + ', tema top: ' + topTema
  }).join('\n')

  // Métricas del cliente
  var clienteCtx = ''
  if (postsCliente.length > 0) {
    var cAvg = Math.round(postsCliente.reduce(function(s, p) { return s + (p.likes || 0) + (p.comments || 0) }, 0) / postsCliente.length)
    clienteCtx = '\nDATOS REALES DEL CLIENTE:\n'
    clienteCtx += '- Posts propios: ' + postsCliente.length + '\n'
    clienteCtx += '- Engagement promedio: ' + cAvg + '\n'
  }

  // Brief context
  var briefCtx = ''
  if (brief.propuesta_valor_unica) briefCtx += 'PVU: ' + brief.propuesta_valor_unica + '\n'
  if (brief.territorios_contenido) briefCtx += 'Territorios: ' + (brief.territorios_contenido || []).map(function(t) { return typeof t === 'object' ? t.territorio : t }).join(', ') + '\n'
  if (brief.tono_comunicacion && brief.tono_comunicacion.estilo) briefCtx += 'Tono: ' + brief.tono_comunicacion.estilo + '\n'

  // Industria context
  var indCtx = ''
  if (industria.nombre) indCtx += 'Industria: ' + industria.nombre + '\n'
  if (industria.mejor_plataforma) indCtx += 'Mejor plataforma paid: ' + industria.mejor_plataforma + '\n'
  if (industria.ciclo_venta) indCtx += 'Ciclo de venta: ' + industria.ciclo_venta + '\n'
  if (industria.estacionalidad) indCtx += 'Estacionalidad: ' + industria.estacionalidad + '\n'
  if (industria.kpis) indCtx += 'KPIs industria: ' + industria.kpis.join(', ') + '\n'
  if (industria.roas_avg) indCtx += 'ROAS promedio industria: ' + industria.roas_avg + 'x\n'
  if (industria.cpl_avg) indCtx += 'CPL promedio industria: $' + industria.cpl_avg + ' CLP\n'

  // Memoria
  var memCtx = ''
  if (memoria.copiesAprendizaje && memoria.copiesAprendizaje.mejorAngulo) {
    memCtx += 'Mejor ángulo histórico: ' + memoria.copiesAprendizaje.mejorAngulo.angulo + ' (score avg ' + memoria.copiesAprendizaje.mejorAngulo.avg + ')\n'
  }
  if (memoria.competenciaPatrones && memoria.competenciaPatrones.competidorEnCrecimiento) {
    memCtx += 'Competidor en crecimiento: ' + memoria.competenciaPatrones.competidorEnCrecimiento + '\n'
  }

  var ahora = new Date()
  var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  var mesSiguiente = meses[(ahora.getMonth() + 1) % 12]

  var prompt = 'Eres un DIRECTOR DE MARKETING con 15 años de experiencia en Chile. '
    + 'Generas planes de campaña basados en DATOS REALES de competencia e industria, no intuición.\n\n'
    + '═══ CLIENTE ═══\n'
    + 'Empresa: ' + nombreEmpresa + '\n'
    + 'Rubro: ' + rubro + '\n'
    + briefCtx + '\n'
    + '═══ INDUSTRIA ═══\n'
    + indCtx + '\n'
    + '═══ COMPETENCIA (datos reales scraping) ═══\n'
    + compResumen + '\n'
    + clienteCtx + '\n'
    + '═══ APRENDIZAJE ═══\n'
    + memCtx + '\n'
    + '═══ TOP 5 POSTS POR ENGAGEMENT ═══\n'
    + postsOrdenados.slice(0, 5).map(function(p, i) {
        return (i + 1) + '. ' + (p.nombre || p.handle) + ': "' + (p.texto || '').substring(0, 100) + '" (eng: ' + ((p.likes || 0) + (p.comments || 0)) + ')'
      }).join('\n') + '\n\n'
    + '═══ TAREA ═══\n'
    + 'Genera un PLAN DE CAMPAÑA COMPLETO para ' + mesSiguiente + ' en formato JSON con:\n\n'
    + '{\n'
    + '  "resumen_estrategico": "2-3 oraciones sobre la estrategia general basada en datos",\n'
    + '  "objetivo_principal": "awareness|engagement|conversion|posicionamiento",\n'
    + '  "arbol_decision": [\n'
    + '    {\n'
    + '      "canal": "Instagram|LinkedIn|Google Ads|Meta Ads|YouTube",\n'
    + '      "justificacion": "por qué este canal basado en datos de competencia/industria",\n'
    + '      "formato_recomendado": "reel|carrusel|imagen|artículo|video",\n'
    + '      "frecuencia": "3/semana",\n'
    + '      "presupuesto_pct": 40,\n'
    + '      "kpi": "engagement rate",\n'
    + '      "meta_kpi": "avg 80+ eng/post",\n'
    + '      "contenido_sugerido": ["tema 1 específico", "tema 2 específico"]\n'
    + '    }\n'
    + '  ],\n'
    + '  "calendario_semanal": [\n'
    + '    {"semana": 1, "enfoque": "descripción", "posts": [{"dia": "Lunes", "canal": "IG", "formato": "reel", "tema": "específico"}]},\n'
    + '  ],\n'
    + '  "presupuesto_estimado": {\n'
    + '    "organico_horas_semana": 8,\n'
    + '    "paid_ads_clp_mes": 500000,\n'
    + '    "justificacion": "por qué esta inversión basada en benchmarks"\n'
    + '  },\n'
    + '  "metricas_esperadas": {\n'
    + '    "engagement_esperado": "basado en benchmark competencia",\n'
    + '    "crecimiento_seguidores": "estimado",\n'
    + '    "leads_estimados": "si aplica"\n'
    + '  },\n'
    + '  "riesgos": ["riesgo 1 con mitigación"]\n'
    + '}\n\n'
    + 'REGLAS:\n'
    + '- Cada decisión debe citar DATOS REALES (engagement de competidor, formato ganador, etc)\n'
    + '- El calendario debe ser ejecutable (días, canales, temas específicos)\n'
    + '- Los KPIs deben ser medibles y basados en benchmarks de la industria\n'
    + '- El presupuesto debe ser realista para una empresa de ' + rubro + ' en Chile\n'
    + '- NO inventes datos — usa solo lo que se proporcionó arriba\n\n'
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
      throw new Error('Claude campaña: HTTP ' + res.status + ' ' + errText.substring(0, 200))
    }

    var data = await res.json()
    var raw = data.content[0].text || ''
    // Limpiar markdown
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    var plan = JSON.parse(raw)

    console.log('   Plan de campaña generado: ' + (plan.arbol_decision || []).length + ' canales, ' + (plan.calendario_semanal || []).length + ' semanas')

    // Guardar en Supabase
    if (supabase && suscripcionId) {
      try {
        var ahora = new Date()
        // Upsert por mes
        var existeRes = await supabase.from('copilot_campanas')
          .select('id')
          .eq('suscripcion_id', suscripcionId)
          .eq('mes', ahora.getMonth() + 2 > 12 ? 1 : ahora.getMonth() + 2)
          .eq('anio', ahora.getMonth() + 2 > 12 ? ahora.getFullYear() + 1 : ahora.getFullYear())
          .limit(1)

        var mesTarget = ahora.getMonth() + 2 > 12 ? 1 : ahora.getMonth() + 2
        var anioTarget = ahora.getMonth() + 2 > 12 ? ahora.getFullYear() + 1 : ahora.getFullYear()

        if (existeRes.data && existeRes.data.length > 0) {
          await supabase.from('copilot_campanas').update({ datos: plan }).eq('id', existeRes.data[0].id)
        } else {
          await supabase.from('copilot_campanas').insert({
            suscripcion_id: suscripcionId,
            mes: mesTarget,
            anio: anioTarget,
            datos: plan,
          })
        }
        console.log('   Plan de campaña guardado para ' + meses[mesTarget - 1] + ' ' + anioTarget)
      } catch (e) {
        console.log('   Plan campaña save error (tabla puede no existir): ' + e.message)
      }
    }

    console.log('   === PLAN DE CAMPAÑA COMPLETADO ===\n')
    return plan
  } catch (e) {
    console.error('   Plan campaña error: ' + e.message)
    return null
  }
}

// Helpers
function detectarFormato(tipo) {
  var t = (tipo || '').toLowerCase()
  if (t.includes('video') || t.includes('reel')) return 'video/reel'
  if (t.includes('sidecar') || t.includes('carousel') || t.includes('carrusel')) return 'carrusel'
  return 'imagen'
}

function detectarTema(texto) {
  var t = (texto || '').toLowerCase()
  if (t.includes('oferta') || t.includes('descuento') || t.includes('promo')) return 'promocional'
  if (t.includes('equipo') || t.includes('cultura') || t.includes('detras')) return 'marca_humana'
  if (t.includes('tip') || t.includes('consejo') || t.includes('aprende')) return 'educativo'
  if (t.includes('cliente') || t.includes('testimonio') || t.includes('caso')) return 'caso_exito'
  if (t.includes('tendencia') || t.includes('novedad') || t.includes('nuevo')) return 'tendencia'
  return 'general'
}

module.exports = { generarPlanCampana: generarPlanCampana }
