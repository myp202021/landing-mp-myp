// radar-industria.js
// Datos de industria REALES del predictor M&P
// Lee y parsea lib/config/industry-insights.ts (tips, KPIs, estacionalidad, ciclo venta)
// y lib/config/cpc-calibrado-chile.ts (CPC reales Ubersuggest)
// USO: solo en Brief (contexto estratégico) y Auditoría (benchmark)
// NO se inyecta en copies, guiones ni grilla (ruido innecesario)

var fs = require('fs')
var path = require('path')

var _cache = null

// ═══════════════════════════════════════════════
// PARSEAR ARCHIVOS TS DEL PREDICTOR
// ═══════════════════════════════════════════════
function cargarDatosPredictor() {
  if (_cache) return _cache

  var basePath = path.join(__dirname, '..', 'lib', 'config')
  var datos = {}

  // Keys conocidas del archivo industry-insights.ts
  var INSIGHT_KEYS = ['ECOMMERCE', 'TECNOLOGIA_SAAS', 'FINTECH', 'INMOBILIARIA', 'SALUD_MEDICINA', 'EDUCACION', 'SERVICIOS_LEGALES', 'AUTOMOTRIZ', 'TURISMO', 'GASTRONOMIA', 'MODA_RETAIL', 'BELLEZA_PERSONAL']

  // 1. Industry insights (tips, KPIs, estacionalidad, ciclo venta, errores, plataforma)
  try {
    var insightsRaw = fs.readFileSync(path.join(basePath, 'industry-insights.ts'), 'utf-8')

    INSIGHT_KEYS.forEach(function(key) {
      var start = insightsRaw.indexOf(key + ':')
      if (start === -1) return

      // Encontrar el final del bloque (inicio del siguiente key o fin)
      var nextStart = insightsRaw.length
      INSIGHT_KEYS.forEach(function(k2) {
        if (k2 !== key) {
          var idx = insightsRaw.indexOf(k2 + ':', start + key.length)
          if (idx > 0 && idx < nextStart) nextStart = idx
        }
      })
      var block = insightsRaw.substring(start, nextStart)
      var k = key.toLowerCase()
      datos[k] = {}
      var d = datos[k]

      d.nombre = (block.match(/nombre:\s*'([^']+)'/) || [])[1] || key
      d.mejor_plataforma = (block.match(/mejor_plataforma:\s*'(\w+)'/) || [])[1] || null
      d.ciclo_venta = (block.match(/ciclo_venta_tipico:\s*'([^']+)'/) || [])[1] || null
      d.estacionalidad = (block.match(/estacionalidad:\s*'([^']+)'/) || [])[1] || null

      // ROAS
      var roasBlock = block.match(/benchmark_roas:\s*\{([^}]+)\}/)
      if (roasBlock) {
        d.roas_min = parseFloat((roasBlock[1].match(/min:\s*([\d.]+)/) || [])[1]) || null
        d.roas_avg = parseFloat((roasBlock[1].match(/promedio:\s*([\d.]+)/) || [])[1]) || null
        d.roas_top = parseFloat((roasBlock[1].match(/top:\s*([\d.]+)/) || [])[1]) || null
      }

      // CPL
      var cplBlock = block.match(/benchmark_cpl:\s*\{([^}]+)\}/)
      if (cplBlock) {
        d.cpl_min = parseFloat((cplBlock[1].match(/min:\s*([\d.]+)/) || [])[1]) || null
        d.cpl_avg = parseFloat((cplBlock[1].match(/promedio:\s*([\d.]+)/) || [])[1]) || null
        d.cpl_max = parseFloat((cplBlock[1].match(/max:\s*([\d.]+)/) || [])[1]) || null
      }

      // Tips
      var tipsBlock = block.match(/tips:\s*\[([\s\S]*?)\],/)
      if (tipsBlock) {
        d.tips = (tipsBlock[1].match(/'([^']+)'/g) || []).map(function(t) { return t.replace(/'/g, '') })
      }

      // Errores comunes
      var errBlock = block.match(/errores_comunes:\s*\[([\s\S]*?)\],/)
      if (errBlock) {
        d.errores_comunes = (errBlock[1].match(/'([^']+)'/g) || []).map(function(t) { return t.replace(/'/g, '') })
      }

      // KPIs
      var kpisBlock = block.match(/kpis_clave:\s*\[([\s\S]*?)\]/)
      if (kpisBlock) {
        d.kpis = (kpisBlock[1].match(/'([^']+)'/g) || []).map(function(t) { return t.replace(/'/g, '') })
      }
    })
  } catch (e) { console.log('   industria: industry-insights.ts no encontrado') }

  // 2. CPC calibrado Chile (solo para referencia en brief, no para copies)
  try {
    var cpcRaw = fs.readFileSync(path.join(basePath, 'cpc-calibrado-chile.ts'), 'utf-8')
    var cpcBlocks = cpcRaw.match(/(\w+):\s*\{[^}]*cpc_promedio:\s*([\d.]+)[^}]*\}/g) || []
    cpcBlocks.forEach(function(block) {
      var nameMatch = block.match(/^(\w+):/)
      var cpcMatch = block.match(/cpc_promedio:\s*([\d.]+)/)
      if (nameMatch && cpcMatch) {
        var k = nameMatch[1].toLowerCase()
        if (!datos[k]) datos[k] = {}
        datos[k].cpc_google = Math.round(parseFloat(cpcMatch[1]))
      }
    })
  } catch (e) {}

  _cache = datos
  return datos
}

// ═══════════════════════════════════════════════
// MAPEO: rubro del cliente → key de industria
// ═══════════════════════════════════════════════
var RUBRO_MAP = [
  { keywords: ['rrhh', 'recursos humanos', 'asistencia', 'talento', 'hr ', 'gestion de personas', 'nomina', 'remuneraciones'], key: 'tecnologia_saas' },
  { keywords: ['saas', 'software', 'plataforma digital', 'app'], key: 'tecnologia_saas' },
  { keywords: ['ecommerce', 'tienda online', 'retail online', 'venta online'], key: 'ecommerce' },
  { keywords: ['inmobil', 'propiedad', 'corredor', 'arriendo', 'departamento'], key: 'inmobiliaria' },
  { keywords: ['salud', 'medic', 'clinic', 'dental', 'hospital'], key: 'salud_medicina' },
  { keywords: ['educa', 'universidad', 'colegio', 'capacit', 'curso'], key: 'educacion' },
  { keywords: ['legal', 'abogad', 'juridic'], key: 'servicios_legales' },
  { keywords: ['auto', 'vehicul', 'concesionari'], key: 'automotriz' },
  { keywords: ['restaur', 'comida', 'delivery', 'cafe', 'gastronom'], key: 'gastronomia' },
  { keywords: ['financ', 'banco', 'inversion', 'fintech', 'credito'], key: 'fintech' },
  { keywords: ['turismo', 'hotel', 'viaje', 'agencia de viaje'], key: 'turismo' },
  { keywords: ['moda', 'ropa', 'zapato', 'boutique', 'retail'], key: 'moda_retail' },
  { keywords: ['belleza', 'cosmet', 'peluquer', 'estetica'], key: 'belleza_personal' },
]

function detectarIndustria(perfil) {
  if (!perfil) return null
  var datos = cargarDatosPredictor()
  var rubro = ((perfil.rubro || '') + ' ' + (perfil.descripcion || '') + ' ' + (perfil.productos || '') + ' ' + (perfil.nombre || '')).toLowerCase()

  for (var i = 0; i < RUBRO_MAP.length; i++) {
    var map = RUBRO_MAP[i]
    for (var j = 0; j < map.keywords.length; j++) {
      if (rubro.includes(map.keywords[j])) {
        var d = datos[map.key]
        if (d) { d._key = map.key; return d }
      }
    }
  }
  return null
}

// ═══════════════════════════════════════════════
// CONTEXTO PARA BRIEF (estratégico, no para copies)
// ═══════════════════════════════════════════════
function generarContextoIndustria(perfil) {
  var ind = detectarIndustria(perfil)
  if (!ind) return ''

  var ctx = '\n═══ CONTEXTO DE INDUSTRIA (Predictor M&P — datos reales Chile) ═══\n'
  ctx += 'Industria: ' + (ind.nombre || ind._key) + '\n'
  if (ind.mejor_plataforma) ctx += '- Mejor plataforma paid: ' + ind.mejor_plataforma + '\n'
  if (ind.ciclo_venta) ctx += '- Ciclo de venta típico: ' + ind.ciclo_venta + '\n'
  if (ind.estacionalidad) ctx += '- Estacionalidad: ' + ind.estacionalidad + '\n'
  if (ind.roas_avg) ctx += '- ROAS promedio industria: ' + ind.roas_avg + 'x (rango ' + (ind.roas_min || '?') + '-' + (ind.roas_top || '?') + ')\n'
  if (ind.cpl_avg) ctx += '- CPL promedio: $' + ind.cpl_avg.toLocaleString() + ' CLP\n'
  if (ind.kpis && ind.kpis.length > 0) ctx += '- KPIs clave: ' + ind.kpis.join(', ') + '\n'
  if (ind.tips && ind.tips.length > 0) {
    ctx += '- Mejores prácticas de la industria:\n'
    ind.tips.forEach(function(t) { ctx += '  * ' + t + '\n' })
  }
  if (ind.errores_comunes && ind.errores_comunes.length > 0) {
    ctx += '- Errores comunes a evitar:\n'
    ind.errores_comunes.forEach(function(e) { ctx += '  * ' + e + '\n' })
  }
  return ctx
}

module.exports = {
  cargarDatosPredictor: cargarDatosPredictor,
  detectarIndustria: detectarIndustria,
  generarContextoIndustria: generarContextoIndustria,
}
