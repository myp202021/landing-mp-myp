// radar-ads-creative.js
// Genera creativos de anuncios para Google Ads y Meta Ads
// Input: brief + competencia + industria + perfil + memoria + contenido orgánico
// Output: variaciones de headlines, descriptions, CTAs por plataforma
// Usa Claude Sonnet para máxima calidad
// Se llama desde radar-clipping.js en modo semanal/mensual
// Costo: ~$0.02/run (1 call Claude Sonnet)
//
// INTERACCIONES:
// - Lee de: Brief (tono, PVU, público), Industria (CPC, keywords), Benchmark (qué hace competencia)
// - Lee de: Contenido (copies orgánicos para alinear), Campaña (ramas que necesitan ads)
// - Alimenta a: Dashboard (muestra ads sugeridos), Email (incluye en reporte)
// - Memoria lee: qué headlines funcionaron antes (si hay data de performance)

var fetch = require('node-fetch')
var apiHelper = require('./radar-api-helper.js')

var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS

// Límites de caracteres por plataforma
var LIMITES = {
  google: {
    headline: 30,        // RSA: máximo 30 chars
    headline_largo: 90,  // RSA: headline largo
    description: 90,     // RSA: máximo 90 chars
    path: 15,            // URL path display
  },
  meta: {
    headline: 40,        // Primary text headline
    primary_text: 125,   // Primary text (visible sin "ver más")
    description: 30,     // Link description
    cta_opciones: ['Más información', 'Cotizar ahora', 'Reservar', 'Contactar', 'Ver oferta', 'Registrarse', 'Descargar'],
  }
}

// Palabras prohibidas en ads (ChatGPT speak + spam triggers)
var PALABRAS_PROHIBIDAS = [
  'revolucionario', 'increíble', 'único en el mundo', 'el mejor',
  'garantizado', 'sin lugar a dudas', 'totalmente gratis',
  'en el vertiginoso', 'paradigma', 'sinergia', 'holístico',
  'no te lo pierdas', 'oferta imperdible', 'últimas horas',
]

async function generarAdsCreativos(posts, empresas, perfil, brief, memoria, industria, contenidoOrganico, campana, supabase, suscripcionId) {
  console.log('\n   === ADS CREATIVE GENERATOR ===')

  if (!ANTHROPIC_KEY) {
    console.log('   Sin ANTHROPIC_API_KEY_GRILLAS, saltando')
    return null
  }

  perfil = perfil || {}
  brief = brief || {}
  memoria = memoria || {}
  industria = industria || {}
  contenidoOrganico = contenidoOrganico || []
  campana = campana || {}

  var nombreEmpresa = perfil.nombre || 'la empresa'
  var rubro = perfil.rubro || 'general'

  // Construir contexto de competencia paid
  var compAds = ''
  if (posts && posts.length > 0) {
    var postsOrdenados = posts.slice().sort(function(a, b) {
      return ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0))
    })
    // Los copies que mejor funcionan en la competencia
    compAds = postsOrdenados.slice(0, 8).map(function(p, i) {
      var eng = (p.likes || 0) + (p.comments || 0)
      return (i + 1) + '. ' + (p.nombre || p.handle) + ' (eng:' + eng + '): "' + (p.texto || '').substring(0, 150) + '"'
    }).join('\n')
  }

  // Brief context
  var briefCtx = ''
  if (brief.propuesta_valor_unica) briefCtx += 'PVU: ' + brief.propuesta_valor_unica + '\n'
  if (brief.publico_objetivo) {
    var pub = brief.publico_objetivo
    if (typeof pub === 'object') {
      if (pub.primario) briefCtx += 'Público primario: ' + (typeof pub.primario === 'string' ? pub.primario : JSON.stringify(pub.primario)) + '\n'
    } else {
      briefCtx += 'Público: ' + pub + '\n'
    }
  }
  if (brief.tono_comunicacion && brief.tono_comunicacion.estilo) briefCtx += 'Tono: ' + brief.tono_comunicacion.estilo + '\n'
  if (brief.diferenciadores) briefCtx += 'Diferenciadores: ' + (Array.isArray(brief.diferenciadores) ? brief.diferenciadores.join(', ') : brief.diferenciadores) + '\n'

  // Industria context
  var indCtx = ''
  if (industria.nombre) indCtx += 'Industria: ' + industria.nombre + '\n'
  if (industria.cpl_avg) indCtx += 'CPL promedio: $' + industria.cpl_avg + ' CLP\n'
  if (industria.mejor_plataforma) indCtx += 'Mejor plataforma: ' + industria.mejor_plataforma + '\n'
  if (industria.keywords_top) indCtx += 'Keywords relevantes: ' + (Array.isArray(industria.keywords_top) ? industria.keywords_top.join(', ') : '') + '\n'

  // Memoria de ads anteriores
  var memCtx = ''
  if (memoria.adsAprendizaje) {
    if (memoria.adsAprendizaje.mejorHeadline) memCtx += 'Mejor headline histórico: "' + memoria.adsAprendizaje.mejorHeadline + '"\n'
    if (memoria.adsAprendizaje.mejorCTA) memCtx += 'Mejor CTA histórico: ' + memoria.adsAprendizaje.mejorCTA + '\n'
    if (memoria.adsAprendizaje.peorAngulo) memCtx += 'Ángulo que NO funcionó: ' + memoria.adsAprendizaje.peorAngulo + '\n'
  }

  // Contenido orgánico para alinear
  var orgCtx = ''
  if (contenidoOrganico.length > 0) {
    orgCtx = 'CONTENIDO ORGÁNICO APROBADO (alinear mensajes):\n'
    contenidoOrganico.slice(0, 3).forEach(function(c, i) {
      orgCtx += (i + 1) + '. ' + (c.titulo || c.copy || '').substring(0, 100) + '\n'
    })
  }

  // Ramas de campaña que necesitan ads
  var campCtx = ''
  if (campana.arbol_decision && campana.arbol_decision.length > 0) {
    campCtx = 'RAMAS DE CAMPAÑA QUE NECESITAN ADS:\n'
    campana.arbol_decision.forEach(function(rama, i) {
      campCtx += (i + 1) + '. ' + (rama.canal || 'Canal') + ': ' + (rama.justificacion || '').substring(0, 80) + '\n'
      if (rama.contenido_sugerido) campCtx += '   Temas: ' + rama.contenido_sugerido.join(', ') + '\n'
    })
  }

  var prompt = 'Eres un COPYWRITER SENIOR de performance marketing con 10 años de experiencia en Chile. '
    + 'Generas copies de anuncios que CONVIERTEN, no que suenan bonitos. Cada palabra cuenta porque los límites son estrictos.\n\n'
    + '═══ CLIENTE ═══\n'
    + 'Empresa: ' + nombreEmpresa + '\n'
    + 'Rubro: ' + rubro + '\n'
    + briefCtx + '\n'
    + '═══ INDUSTRIA ═══\n'
    + indCtx + '\n'
    + '═══ COMPETENCIA (copies que mejor funcionan) ═══\n'
    + (compAds || 'Sin datos de competencia') + '\n\n'
    + (memCtx ? '═══ APRENDIZAJE HISTÓRICO ═══\n' + memCtx + '\n' : '')
    + (orgCtx ? '═══ ' + orgCtx + '\n' : '')
    + (campCtx ? '═══ ' + campCtx + '\n' : '')
    + '═══ TAREA ═══\n'
    + 'Genera CREATIVOS DE ANUNCIOS para Google Ads y Meta Ads en formato JSON:\n\n'
    + '{\n'
    + '  "google_ads": [\n'
    + '    {\n'
    + '      "nombre_grupo": "Nombre descriptivo del grupo de anuncios",\n'
    + '      "objetivo": "search|pmax|display",\n'
    + '      "keywords_sugeridas": ["keyword 1", "keyword 2", "keyword 3"],\n'
    + '      "headlines": ["headline 1 (máx 30 chars)", "headline 2", "headline 3", "headline 4", "headline 5"],\n'
    + '      "headlines_largos": ["headline largo (máx 90 chars)"],\n'
    + '      "descriptions": ["descripción 1 (máx 90 chars)", "descripción 2", "descripción 3"],\n'
    + '      "paths": ["path1", "path2"],\n'
    + '      "razon": "por qué estos copies basado en datos de competencia/industria"\n'
    + '    }\n'
    + '  ],\n'
    + '  "meta_ads": [\n'
    + '    {\n'
    + '      "nombre_conjunto": "Nombre del conjunto de anuncios",\n'
    + '      "objetivo": "leads|traffic|awareness",\n'
    + '      "variaciones": [\n'
    + '        {\n'
    + '          "angulo": "dolor|beneficio|social_proof|urgencia|educativo",\n'
    + '          "primary_text": "Texto principal (máx 125 chars visible sin ver más)",\n'
    + '          "headline": "Headline del anuncio (máx 40 chars)",\n'
    + '          "description": "Descripción del link (máx 30 chars)",\n'
    + '          "cta": "Más información|Cotizar ahora|Reservar|Contactar",\n'
    + '          "formato_sugerido": "imagen|video|carrusel"\n'
    + '        }\n'
    + '      ],\n'
    + '      "razon": "por qué estos ángulos basado en datos"\n'
    + '    }\n'
    + '  ],\n'
    + '  "recomendaciones_ab_test": [\n'
    + '    "Qué testear primero y por qué basado en datos de competencia"\n'
    + '  ],\n'
    + '  "notas_estrategicas": "Resumen de por qué estos copies y no otros"\n'
    + '}\n\n'
    + 'REGLAS CRÍTICAS:\n'
    + '- Headlines Google: MÁXIMO 30 caracteres (contar con espacios). Si se pasa, NO sirve.\n'
    + '- Descriptions Google: MÁXIMO 90 caracteres.\n'
    + '- Primary text Meta: MÁXIMO 125 caracteres para que se vea completo.\n'
    + '- Headline Meta: MÁXIMO 40 caracteres.\n'
    + '- CADA copy debe tener un ÁNGULO claro (dolor, beneficio, social proof, urgencia, educativo).\n'
    + '- MÍNIMO 3 Google Ad groups y 2 Meta Ad sets.\n'
    + '- Mínimo 5 headlines y 3 descriptions por grupo Google.\n'
    + '- Mínimo 3 variaciones por conjunto Meta (diferentes ángulos).\n'
    + '- CITAR datos reales de competencia para justificar cada decisión.\n'
    + '- Escribir en español chileno natural (no Spain español).\n'
    + '- NUNCA usar: ' + PALABRAS_PROHIBIDAS.join(', ') + '\n'
    + '- Los copies deben alinearse con el tono del brief y el contenido orgánico.\n\n'
    + 'Responde SOLO JSON válido.'

  try {
    var res = await apiHelper.callWithRetry(
      'https://api.anthropic.com/v1/messages',
      {
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
      },
      2 // max retries
    )

    if (!res.ok) {
      var errText = await res.text()
      throw new Error('Claude ads creative: HTTP ' + res.status + ' ' + errText.substring(0, 200))
    }

    var data = await res.json()
    var raw = data.content[0].text || ''
    raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    var ads = JSON.parse(raw)

    // Validar límites de caracteres
    var warnings = []
    if (ads.google_ads) {
      ads.google_ads.forEach(function(grupo) {
        (grupo.headlines || []).forEach(function(h, i) {
          if (h.length > LIMITES.google.headline) {
            warnings.push('Google headline "' + h.substring(0, 20) + '..." tiene ' + h.length + ' chars (máx ' + LIMITES.google.headline + ')')
          }
        })
        ;(grupo.descriptions || []).forEach(function(d, i) {
          if (d.length > LIMITES.google.description) {
            warnings.push('Google description "' + d.substring(0, 20) + '..." tiene ' + d.length + ' chars (máx ' + LIMITES.google.description + ')')
          }
        })
      })
    }
    if (ads.meta_ads) {
      ads.meta_ads.forEach(function(conjunto) {
        (conjunto.variaciones || []).forEach(function(v) {
          if (v.primary_text && v.primary_text.length > LIMITES.meta.primary_text) {
            warnings.push('Meta primary text "' + v.primary_text.substring(0, 20) + '..." tiene ' + v.primary_text.length + ' chars (máx ' + LIMITES.meta.primary_text + ')')
          }
          if (v.headline && v.headline.length > LIMITES.meta.headline) {
            warnings.push('Meta headline "' + v.headline.substring(0, 20) + '..." tiene ' + v.headline.length + ' chars (máx ' + LIMITES.meta.headline + ')')
          }
        })
      })
    }

    if (warnings.length > 0) {
      console.log('   ⚠️ WARNINGS de caracteres:')
      warnings.forEach(function(w) { console.log('     - ' + w) })
      ads._warnings = warnings
    }

    // Stats
    var googleGroups = (ads.google_ads || []).length
    var googleHeadlines = (ads.google_ads || []).reduce(function(s, g) { return s + (g.headlines || []).length }, 0)
    var metaSets = (ads.meta_ads || []).length
    var metaVariaciones = (ads.meta_ads || []).reduce(function(s, c) { return s + (c.variaciones || []).length }, 0)

    console.log('   Ads generados: ' + googleGroups + ' grupos Google (' + googleHeadlines + ' headlines), ' + metaSets + ' conjuntos Meta (' + metaVariaciones + ' variaciones)')

    // Guardar en Supabase
    if (supabase && suscripcionId) {
      try {
        var ahora = new Date()
        var mesTarget = ahora.getMonth() + 2 > 12 ? 1 : ahora.getMonth() + 2
        var anioTarget = ahora.getMonth() + 2 > 12 ? ahora.getFullYear() + 1 : ahora.getFullYear()

        // Upsert por mes
        var existeRes = await supabase.from('copilot_ads_creativos')
          .select('id')
          .eq('suscripcion_id', suscripcionId)
          .eq('mes', mesTarget)
          .eq('anio', anioTarget)
          .limit(1)

        var payload = {
          suscripcion_id: suscripcionId,
          mes: mesTarget,
          anio: anioTarget,
          datos: ads,
        }

        if (existeRes.data && existeRes.data.length > 0) {
          await supabase.from('copilot_ads_creativos').update({ datos: ads }).eq('id', existeRes.data[0].id)
        } else {
          await supabase.from('copilot_ads_creativos').insert(payload)
        }
        console.log('   Ads creativos guardados para mes ' + mesTarget + '/' + anioTarget)
      } catch (e) {
        console.log('   Ads creativos save error (tabla puede no existir): ' + e.message)
      }
    }

    console.log('   === ADS CREATIVE COMPLETADO ===\n')
    return ads
  } catch (e) {
    console.error('   Ads creative error: ' + e.message)
    return null
  }
}

module.exports = { generarAdsCreativos: generarAdsCreativos }
