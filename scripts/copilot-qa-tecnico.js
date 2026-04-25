// copilot-qa-tecnico.js
// QA tecnico automatico — verifica que todo funciona
// Corre despues de cada deploy o manualmente
// NO usa APIs de IA — pura logica
// Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')

var SUPABASE_URL = process.env.SUPABASE_URL
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
var SOLO_ID = (process.argv.find(function(a) { return a.startsWith('--id=') }) || '').replace('--id=', '')
var BASE_URL = 'https://www.mulleryperez.cl'

var resultados = []
var totalChecks = 0
var totalPass = 0
var totalFail = 0

function registrar(categoria, nombre, pass, detalle) {
  totalChecks++
  if (pass) {
    totalPass++
    console.log('   ✅ [' + categoria + '] ' + nombre + (detalle ? ' — ' + detalle : ''))
  } else {
    totalFail++
    console.log('   ❌ [' + categoria + '] ' + nombre + (detalle ? ' — ' + detalle : ''))
  }
  resultados.push({ categoria: categoria, nombre: nombre, pass: pass, detalle: detalle || '' })
}

// ═══════════════════════════════════════════════
// CHECK 1: Tablas Supabase existen
// ═══════════════════════════════════════════════
async function checkTablas(supabase) {
  console.log('\n   === CHECK 1: Tablas Supabase ===')
  var tablas = [
    'clipping_suscripciones',
    'radar_posts',
    'radar_contenido',
    'copilot_auditorias',
    'copilot_guiones',
    'copilot_ideas',
  ]

  for (var i = 0; i < tablas.length; i++) {
    var tabla = tablas[i]
    try {
      var res = await supabase.from(tabla).select('id', { count: 'exact', head: true })
      if (res.error) {
        registrar('TABLAS', tabla, false, 'Error: ' + res.error.message)
      } else {
        registrar('TABLAS', tabla, true, 'existe (count: ' + (res.count || 0) + ')')
      }
    } catch (e) {
      registrar('TABLAS', tabla, false, 'Excepcion: ' + e.message)
    }
  }
}

// ═══════════════════════════════════════════════
// CHECK 2: Suscripcion de test tiene datos
// ═══════════════════════════════════════════════
async function checkDatosSuscripcion(supabase, suscripcionId) {
  console.log('\n   === CHECK 2: Datos suscripcion ' + suscripcionId.substring(0, 8) + '... ===')

  // radar_posts: count > 0
  try {
    var res = await supabase.from('radar_posts').select('id', { count: 'exact', head: true })
      .eq('suscripcion_id', suscripcionId)
    var count = res.count || 0
    registrar('DATOS', 'radar_posts count', count > 0, count + ' posts')
  } catch (e) {
    registrar('DATOS', 'radar_posts count', false, e.message)
  }

  // radar_contenido: al menos 1
  try {
    var res = await supabase.from('radar_contenido').select('id, datos')
      .eq('suscripcion_id', suscripcionId)
      .limit(1)
    var tiene = res.data && res.data.length > 0
    registrar('DATOS', 'radar_contenido existe', tiene, tiene ? 'OK' : 'sin entries')
  } catch (e) {
    registrar('DATOS', 'radar_contenido existe', false, e.message)
  }

  // copilot_auditorias: al menos 1 con score_general > 0
  try {
    var res = await supabase.from('copilot_auditorias').select('id, score_general')
      .eq('suscripcion_id', suscripcionId)
      .gt('score_general', 0)
      .limit(1)
    var tiene = res.data && res.data.length > 0
    var score = tiene ? res.data[0].score_general : 0
    registrar('DATOS', 'copilot_auditorias con score', tiene, tiene ? 'score_general=' + score : 'sin auditorias con score > 0')
  } catch (e) {
    registrar('DATOS', 'copilot_auditorias con score', false, e.message)
  }

  // copilot_guiones: al menos 1 con datos array length > 0
  try {
    var res = await supabase.from('copilot_guiones').select('id, datos')
      .eq('suscripcion_id', suscripcionId)
      .limit(5)
    var conDatos = (res.data || []).filter(function(r) {
      return Array.isArray(r.datos) && r.datos.length > 0
    })
    registrar('DATOS', 'copilot_guiones con datos', conDatos.length > 0, conDatos.length + ' guiones con datos validos')
  } catch (e) {
    registrar('DATOS', 'copilot_guiones con datos', false, e.message)
  }

  // copilot_ideas: count > 0
  try {
    var res = await supabase.from('copilot_ideas').select('id', { count: 'exact', head: true })
      .eq('suscripcion_id', suscripcionId)
    var count = res.count || 0
    registrar('DATOS', 'copilot_ideas count', count > 0, count + ' ideas')
  } catch (e) {
    registrar('DATOS', 'copilot_ideas count', false, e.message)
  }
}

// ═══════════════════════════════════════════════
// CHECK 3: Integridad de datos
// ═══════════════════════════════════════════════
async function checkIntegridad(supabase, suscripcionId) {
  console.log('\n   === CHECK 3: Integridad de datos ===')

  // Posts: red no null, likes es numero, texto es string
  try {
    var res = await supabase.from('radar_posts').select('id, red, likes, texto')
      .eq('suscripcion_id', suscripcionId)
      .limit(200)
    var posts = res.data || []

    if (posts.length === 0) {
      registrar('INTEGRIDAD', 'posts disponibles', false, 'sin posts para verificar')
    } else {
      // red no null
      var sinRed = posts.filter(function(p) { return !p.red })
      registrar('INTEGRIDAD', 'posts con campo red', sinRed.length === 0,
        sinRed.length === 0 ? posts.length + ' posts OK' : sinRed.length + ' posts sin red')

      // likes como numero
      var likesObj = posts.filter(function(p) {
        return p.likes !== null && p.likes !== undefined && typeof p.likes !== 'number' && typeof p.likes !== 'string'
      })
      var likesStr = posts.filter(function(p) {
        return typeof p.likes === 'string' && isNaN(parseInt(p.likes))
      })
      registrar('INTEGRIDAD', 'posts likes formato', likesObj.length === 0 && likesStr.length === 0,
        likesObj.length === 0 && likesStr.length === 0
          ? posts.length + ' posts OK'
          : likesObj.length + ' likes como objeto, ' + likesStr.length + ' likes como string invalido')

      // texto no null
      var sinTexto = posts.filter(function(p) { return p.texto === null || p.texto === undefined })
      registrar('INTEGRIDAD', 'posts con texto', sinTexto.length === 0,
        sinTexto.length === 0 ? posts.length + ' posts OK' : sinTexto.length + ' posts sin texto')
    }
  } catch (e) {
    registrar('INTEGRIDAD', 'posts', false, e.message)
  }

  // Contenido: datos como array
  try {
    var res = await supabase.from('radar_contenido').select('id, datos')
      .eq('suscripcion_id', suscripcionId)
      .limit(20)
    var rows = res.data || []
    var sinArray = rows.filter(function(r) { return !Array.isArray(r.datos) })
    if (rows.length > 0) {
      registrar('INTEGRIDAD', 'contenido datos es array', sinArray.length === 0,
        sinArray.length === 0 ? rows.length + ' entries OK' : sinArray.length + ' entries con datos no-array')
    } else {
      registrar('INTEGRIDAD', 'contenido datos es array', true, 'sin entries (skip)')
    }
  } catch (e) {
    registrar('INTEGRIDAD', 'contenido', false, e.message)
  }

  // Auditoria: score_general numero, criterios array con score
  try {
    var res = await supabase.from('copilot_auditorias').select('id, score_general, criterios')
      .eq('suscripcion_id', suscripcionId)
      .limit(10)
    var rows = res.data || []

    if (rows.length > 0) {
      var scoreOk = rows.filter(function(r) { return typeof r.score_general === 'number' })
      registrar('INTEGRIDAD', 'auditoria score_general es numero', scoreOk.length === rows.length,
        scoreOk.length + '/' + rows.length + ' con score numerico')

      var criteriosOk = rows.filter(function(r) {
        if (!Array.isArray(r.criterios)) return false
        return r.criterios.every(function(c) {
          return typeof c === 'object' && c !== null && typeof c.score === 'number'
        })
      })
      registrar('INTEGRIDAD', 'auditoria criterios validos', criteriosOk.length === rows.length,
        criteriosOk.length + '/' + rows.length + ' con criterios array+score')
    } else {
      registrar('INTEGRIDAD', 'auditoria', true, 'sin entries (skip)')
    }
  } catch (e) {
    registrar('INTEGRIDAD', 'auditoria', false, e.message)
  }

  // Guiones: datos items con gancho y cierre
  try {
    var res = await supabase.from('copilot_guiones').select('id, datos')
      .eq('suscripcion_id', suscripcionId)
      .limit(10)
    var rows = res.data || []

    if (rows.length > 0) {
      var problemas = []
      rows.forEach(function(r) {
        if (!Array.isArray(r.datos)) { problemas.push('id=' + r.id + ' datos no es array'); return }
        r.datos.forEach(function(item, idx) {
          // gancho: string o objeto con frase
          var gancho = item.gancho
          if (gancho === undefined || gancho === null) {
            problemas.push('id=' + r.id + ' item[' + idx + '] sin gancho')
          } else if (typeof gancho === 'object' && !gancho.frase) {
            problemas.push('id=' + r.id + ' item[' + idx + '] gancho es objeto sin .frase')
          }
          // cierre: string o objeto con frase_cta
          var cierre = item.cierre
          if (cierre === undefined || cierre === null) {
            problemas.push('id=' + r.id + ' item[' + idx + '] sin cierre')
          } else if (typeof cierre === 'object' && !cierre.frase_cta) {
            problemas.push('id=' + r.id + ' item[' + idx + '] cierre es objeto sin .frase_cta')
          }
        })
      })
      registrar('INTEGRIDAD', 'guiones gancho/cierre', problemas.length === 0,
        problemas.length === 0 ? rows.length + ' guiones OK' : problemas.length + ' problemas: ' + problemas.slice(0, 3).join('; '))
    } else {
      registrar('INTEGRIDAD', 'guiones', true, 'sin entries (skip)')
    }
  } catch (e) {
    registrar('INTEGRIDAD', 'guiones', false, e.message)
  }
}

// ═══════════════════════════════════════════════
// CHECK 4: Paginas web responden
// ═══════════════════════════════════════════════
async function checkPaginas(suscripcionId) {
  console.log('\n   === CHECK 4: Paginas web ===')

  var paginas = [
    { url: BASE_URL + '/copilot', nombre: '/copilot' },
    { url: BASE_URL + '/copilot/login', nombre: '/copilot/login' },
    { url: BASE_URL + '/copilot/dashboard/' + suscripcionId, nombre: '/copilot/dashboard/{id}' },
    { url: BASE_URL + '/copilot/configurar/' + suscripcionId, nombre: '/copilot/configurar/{id}' },
  ]

  for (var i = 0; i < paginas.length; i++) {
    var pag = paginas[i]
    try {
      var res = await fetch(pag.url, {
        method: 'GET',
        headers: { 'User-Agent': 'CopilotQA/1.0' },
        redirect: 'follow',
        timeout: 15000,
      })
      // 200 o 307/308 redirect son aceptables
      var ok = res.status >= 200 && res.status < 400
      registrar('PAGINAS', pag.nombre, ok, 'HTTP ' + res.status)
    } catch (e) {
      registrar('PAGINAS', pag.nombre, false, 'Error: ' + e.message)
    }
  }
}

// ═══════════════════════════════════════════════
// FUNCION PRINCIPAL
// ═══════════════════════════════════════════════
async function runQA(suscripcionId, supabaseOverride) {
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║    COPILOT QA TECNICO                ║')
  console.log('╚══════════════════════════════════════╝')
  console.log('   Fecha: ' + new Date().toISOString())

  var supabase = supabaseOverride || null
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('   ERROR: faltan SUPABASE_URL o SUPABASE_SERVICE_KEY')
      process.exit(1)
    }
    supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY)
  }

  if (!suscripcionId) {
    console.error('   ERROR: se requiere --id=UUID de suscripcion')
    console.error('   Uso: node scripts/copilot-qa-tecnico.js --id=209ef08d-...')
    process.exit(1)
  }

  console.log('   Suscripcion: ' + suscripcionId)

  // Ejecutar checks
  await checkTablas(supabase)
  await checkDatosSuscripcion(supabase, suscripcionId)
  await checkIntegridad(supabase, suscripcionId)
  await checkPaginas(suscripcionId)

  // Resumen
  console.log('\n   ══════════════════════════════════')
  console.log('   RESUMEN QA')
  console.log('   ══════════════════════════════════')
  console.log('   Total checks: ' + totalChecks)
  console.log('   ✅ Pass: ' + totalPass)
  console.log('   ❌ Fail: ' + totalFail)
  console.log('   Resultado: ' + (totalFail === 0 ? '✅ TODO OK' : '❌ ' + totalFail + ' FALLOS'))
  console.log('   ══════════════════════════════════\n')

  return { total: totalChecks, pass: totalPass, fail: totalFail, resultados: resultados }
}

// Ejecucion directa
if (require.main === module) {
  if (!SOLO_ID) {
    console.error('Uso: node scripts/copilot-qa-tecnico.js --id=UUID')
    process.exit(1)
  }
  runQA(SOLO_ID).then(function(res) {
    process.exit(res.fail > 0 ? 1 : 0)
  }).catch(function(e) {
    console.error('QA ERROR FATAL: ' + e.message)
    process.exit(1)
  })
}

module.exports = { runQA: runQA }
