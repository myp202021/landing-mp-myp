// radar-meta-adlibrary.js
// Consulta Meta Ad Library API para obtener ads activos de competidores
// Input: lista de page IDs o nombres de competidores
// Output: ads activos con creative text, start date, plataformas
// API: graph.facebook.com/ads_archive (gratis con token de app)
// Costo: $0
//
// INTERACCIONES:
// - Alimenta: Benchmark (qué ads corre la competencia paid)
// - Alimenta: Ads Creative (inspiración de copies que funcionan)
// - Alimenta: Campaña (qué canales usa la competencia en paid)
// - Lee de: Brief (nombres de competidores)
//
// REQUISITOS:
// - META_AD_LIBRARY_TOKEN en env (token de app o usuario con permiso ads_read)
// - Los competidores deben ser páginas de Facebook (page name o page ID)

var fetch = require('node-fetch')

var META_TOKEN = process.env.META_AD_LIBRARY_TOKEN

// Países LATAM soportados para búsqueda
var PAISES_LATAM = ['CL', 'AR', 'CO', 'PE', 'MX', 'BR', 'EC', 'UY', 'BO', 'PY', 'VE', 'CR', 'PA']

// ═══════════════════════════════════════════════
// BUSCAR ADS ACTIVOS DE UN COMPETIDOR POR NOMBRE
// ═══════════════════════════════════════════════
async function buscarAdsPorNombre(nombreBusqueda, pais, limite) {
  if (!META_TOKEN) {
    console.log('   Meta Ad Library: sin token, saltando')
    return null
  }

  pais = pais || 'CL'
  limite = limite || 25

  try {
    // Paso 1: Buscar en Ad Library por término
    var url = 'https://graph.facebook.com/v24.0/ads_archive'
      + '?search_terms=' + encodeURIComponent(nombreBusqueda)
      + '&ad_reached_countries=[\'' + pais + '\']'
      + '&ad_active_status=ACTIVE'
      + '&fields=id,ad_creative_bodies,ad_creative_link_titles,ad_creative_link_descriptions,ad_creative_link_captions,page_id,page_name,ad_delivery_start_time,ad_delivery_stop_time,publisher_platforms,impressions,spend'
      + '&limit=' + limite
      + '&access_token=' + META_TOKEN

    var res = await fetch(url)

    if (!res.ok) {
      var errText = await res.text()
      console.log('   Meta Ad Library error: HTTP ' + res.status + ' ' + errText.substring(0, 200))
      return null
    }

    var data = await res.json()
    var ads = data.data || []

    console.log('   Meta Ad Library: ' + ads.length + ' ads activos para "' + nombreBusqueda + '" en ' + pais)

    return ads.map(function(ad) {
      return {
        id: ad.id,
        page_name: ad.page_name || '',
        page_id: ad.page_id || '',
        bodies: ad.ad_creative_bodies || [],
        titles: ad.ad_creative_link_titles || [],
        descriptions: ad.ad_creative_link_descriptions || [],
        captions: ad.ad_creative_link_captions || [],
        start_date: ad.ad_delivery_start_time || '',
        stop_date: ad.ad_delivery_stop_time || '',
        platforms: ad.publisher_platforms || [],
        impressions: ad.impressions || null,
        spend: ad.spend || null,
      }
    })
  } catch (e) {
    console.log('   Meta Ad Library fetch error: ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// BUSCAR ADS DE MÚLTIPLES COMPETIDORES
// ═══════════════════════════════════════════════
async function buscarAdsCompetidores(competidores, pais, limitePorCompetidor) {
  if (!META_TOKEN) {
    console.log('   Meta Ad Library: sin META_AD_LIBRARY_TOKEN, saltando')
    return {}
  }

  pais = pais || 'CL'
  limitePorCompetidor = limitePorCompetidor || 10
  var resultados = {}

  console.log('\n   === META AD LIBRARY ===')
  console.log('   Buscando ads de ' + competidores.length + ' competidores en ' + pais)

  for (var i = 0; i < competidores.length; i++) {
    var comp = competidores[i]
    var nombre = typeof comp === 'string' ? comp : (comp.nombre || comp.handle || comp.page_name || '')
    if (!nombre) continue

    // Rate limiting: 200 calls/hora, esperamos 500ms entre calls
    if (i > 0) await new Promise(function(r) { setTimeout(r, 500) })

    var ads = await buscarAdsPorNombre(nombre, pais, limitePorCompetidor)
    if (ads && ads.length > 0) {
      resultados[nombre] = ads
    }
  }

  // Stats
  var totalAds = Object.keys(resultados).reduce(function(s, k) { return s + resultados[k].length }, 0)
  var conAds = Object.keys(resultados).length
  console.log('   Total: ' + totalAds + ' ads de ' + conAds + '/' + competidores.length + ' competidores')
  console.log('   === META AD LIBRARY COMPLETADO ===\n')

  return resultados
}

// ═══════════════════════════════════════════════
// ANALIZAR PATRONES DE ADS DE COMPETENCIA
// ═══════════════════════════════════════════════
function analizarPatronesAds(resultadosAdLibrary) {
  var analisis = {
    totalAds: 0,
    competidoresConAds: 0,
    competidoresSinAds: 0,
    plataformasUsadas: {},
    copiesMasLargos: [],  // ads con bodies más largos (más elaborados)
    copiesMasCortos: [], // ads con bodies cortos (directos)
    titulosRecurrentes: {}, // palabras que se repiten en títulos
    angulos: { oferta: 0, educativo: 0, social_proof: 0, urgencia: 0, beneficio: 0, marca: 0 },
    competidorMasActivo: { nombre: '', count: 0 },
  }

  Object.keys(resultadosAdLibrary).forEach(function(comp) {
    var ads = resultadosAdLibrary[comp]
    analisis.totalAds += ads.length
    analisis.competidoresConAds++

    if (ads.length > analisis.competidorMasActivo.count) {
      analisis.competidorMasActivo = { nombre: comp, count: ads.length }
    }

    ads.forEach(function(ad) {
      // Plataformas
      (ad.platforms || []).forEach(function(p) {
        analisis.plataformasUsadas[p] = (analisis.plataformasUsadas[p] || 0) + 1
      })

      // Analizar ángulo del copy
      var bodyText = (ad.bodies || []).join(' ').toLowerCase()
      if (bodyText.includes('oferta') || bodyText.includes('descuento') || bodyText.includes('promo') || bodyText.includes('%')) analisis.angulos.oferta++
      if (bodyText.includes('aprende') || bodyText.includes('tip') || bodyText.includes('cómo') || bodyText.includes('guía')) analisis.angulos.educativo++
      if (bodyText.includes('cliente') || bodyText.includes('testimonio') || bodyText.includes('caso') || bodyText.includes('result')) analisis.angulos.social_proof++
      if (bodyText.includes('último') || bodyText.includes('hoy') || bodyText.includes('no te pierd') || bodyText.includes('cupo')) analisis.angulos.urgencia++
      if (bodyText.includes('beneficio') || bodyText.includes('ventaja') || bodyText.includes('mejor') || bodyText.includes('solución')) analisis.angulos.beneficio++
      if (!bodyText || bodyText.length < 20) analisis.angulos.marca++

      // Largos vs cortos
      var largo = (ad.bodies || []).reduce(function(s, b) { return s + b.length }, 0)
      if (largo > 200) analisis.copiesMasLargos.push({ comp: comp, body: (ad.bodies || [])[0] || '', largo: largo })
      if (largo > 0 && largo < 80) analisis.copiesMasCortos.push({ comp: comp, body: (ad.bodies || [])[0] || '', largo: largo })

      // Títulos recurrentes
      ;(ad.titles || []).forEach(function(t) {
        (t || '').toLowerCase().split(/\s+/).forEach(function(w) {
          if (w.length > 3) analisis.titulosRecurrentes[w] = (analisis.titulosRecurrentes[w] || 0) + 1
        })
      })
    })
  })

  // Top palabras en títulos
  analisis.topPalabrasTitulos = Object.keys(analisis.titulosRecurrentes)
    .map(function(k) { return { palabra: k, count: analisis.titulosRecurrentes[k] } })
    .sort(function(a, b) { return b.count - a.count })
    .slice(0, 15)

  // Ángulo dominante
  var maxAngulo = 0
  var anguloDominante = 'beneficio'
  Object.keys(analisis.angulos).forEach(function(k) {
    if (analisis.angulos[k] > maxAngulo) { maxAngulo = analisis.angulos[k]; anguloDominante = k }
  })
  analisis.anguloDominante = anguloDominante

  return analisis
}

// ═══════════════════════════════════════════════
// GENERAR CONTEXTO PARA OTROS AGENTES
// ═══════════════════════════════════════════════
function generarContextoPaid(resultadosAdLibrary, analisis) {
  if (!analisis || analisis.totalAds === 0) return ''

  var ctx = '═══ INTELIGENCIA PAID ADS (Meta Ad Library) ═══\n'
  ctx += 'Total: ' + analisis.totalAds + ' ads activos de ' + analisis.competidoresConAds + ' competidores\n'
  ctx += 'Competidor más activo en paid: ' + analisis.competidorMasActivo.nombre + ' (' + analisis.competidorMasActivo.count + ' ads)\n'
  ctx += 'Ángulo dominante: ' + analisis.anguloDominante + '\n'

  // Plataformas
  var platStr = Object.keys(analisis.plataformasUsadas).map(function(k) {
    return k + ': ' + analisis.plataformasUsadas[k]
  }).join(', ')
  ctx += 'Plataformas: ' + platStr + '\n'

  // Ejemplos de copies
  if (analisis.copiesMasLargos.length > 0) {
    ctx += '\nEjemplos de copies elaborados (competencia):\n'
    analisis.copiesMasLargos.slice(0, 3).forEach(function(c, i) {
      ctx += (i + 1) + '. ' + c.comp + ': "' + (c.body || '').substring(0, 150) + '..."\n'
    })
  }

  // Top palabras
  if (analisis.topPalabrasTitulos.length > 0) {
    ctx += '\nPalabras más usadas en títulos de ads: ' + analisis.topPalabrasTitulos.slice(0, 8).map(function(p) { return p.palabra }).join(', ') + '\n'
  }

  return ctx
}

module.exports = {
  buscarAdsPorNombre: buscarAdsPorNombre,
  buscarAdsCompetidores: buscarAdsCompetidores,
  analizarPatronesAds: analizarPatronesAds,
  generarContextoPaid: generarContextoPaid,
}
