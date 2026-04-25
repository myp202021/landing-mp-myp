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
// CHECK 5: Email HTML Quality
// ═══════════════════════════════════════════════
async function checkEmailHTML(supabase, suscripcionId) {
  console.log('\n   === CHECK 5: Email HTML Quality ===')

  // Generar email HTML de test usando el mismo modulo
  try {
    var subRes = await supabase.from('clipping_suscripciones').select('*').eq('id', suscripcionId).single()
    if (!subRes.data) { registrar('EMAIL', 'suscripcion carga', false, 'no encontrada'); return }
    var sub = subRes.data

    // Cargar datos necesarios para generar email
    var postsRes = await supabase.from('radar_posts').select('*')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false }).limit(50)
    var posts = postsRes.data || []

    var contenidoRes = await supabase.from('radar_contenido').select('*')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false }).limit(5)
    var contenido = contenidoRes.data || []

    var audRes = await supabase.from('copilot_auditorias').select('*')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false }).limit(1)
    var auditoria = audRes.data && audRes.data.length > 0 ? audRes.data[0] : null

    var guionesRes = await supabase.from('copilot_guiones').select('*')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false }).limit(1)
    var guiones = guionesRes.data && guionesRes.data.length > 0 ? guionesRes.data[0].datos : null

    // Check datos disponibles para email
    registrar('EMAIL', 'posts para email', posts.length > 0, posts.length + ' posts')
    registrar('EMAIL', 'contenido para email', contenido.length > 0, contenido.length + ' entries')

    // Verificar que el contenido no tiene [object Object]
    var objectObjectCount = 0
    contenido.forEach(function(c) {
      if (Array.isArray(c.datos)) {
        c.datos.forEach(function(d) {
          var json = JSON.stringify(d)
          if (json.includes('[object Object]')) objectObjectCount++
        })
      }
    })
    registrar('EMAIL', 'sin [object Object] en contenido', objectObjectCount === 0,
      objectObjectCount === 0 ? 'OK' : objectObjectCount + ' items con [object Object]')

    // Verificar copies tienen campos minimos
    var copiesSinCopy = 0
    var copiesSinTitulo = 0
    var copiesSinScore = 0
    contenido.forEach(function(c) {
      if (c.tipo === 'copy' && Array.isArray(c.datos)) {
        c.datos.forEach(function(d) {
          if (!d.copy || d.copy.length < 10) copiesSinCopy++
          if (!d.titulo || d.titulo.length < 3) copiesSinTitulo++
          if (!d.score && d.score !== 0) copiesSinScore++
        })
      }
    })
    registrar('EMAIL', 'copies con texto completo', copiesSinCopy === 0,
      copiesSinCopy === 0 ? 'OK' : copiesSinCopy + ' copies sin copy valido')
    registrar('EMAIL', 'copies con titulo', copiesSinTitulo === 0,
      copiesSinTitulo === 0 ? 'OK' : copiesSinTitulo + ' copies sin titulo')

    // Verificar auditoria tiene score correcto
    if (auditoria) {
      registrar('EMAIL', 'auditoria score_general existe', typeof auditoria.score_general === 'number',
        'score=' + auditoria.score_general)
      registrar('EMAIL', 'auditoria scores_red existe', auditoria.scores_red && typeof auditoria.scores_red === 'object',
        auditoria.scores_red ? JSON.stringify(auditoria.scores_red).substring(0, 80) : 'null')
      registrar('EMAIL', 'auditoria criterios formato', Array.isArray(auditoria.criterios) && auditoria.criterios.length >= 8,
        (auditoria.criterios || []).length + ' criterios')

      // Verificar que criterios tienen nombre y score (no [object Object])
      if (Array.isArray(auditoria.criterios)) {
        var criteriosOk = auditoria.criterios.every(function(c) {
          return typeof c === 'object' && c !== null && typeof c.nombre === 'string' && typeof c.score === 'number'
        })
        registrar('EMAIL', 'auditoria criterios nombre+score', criteriosOk,
          criteriosOk ? 'todos OK' : 'algunos criterios malformados')
      }
    } else {
      registrar('EMAIL', 'auditoria disponible', false, 'sin auditoria (mensual pendiente)')
    }

    // Verificar guiones tienen estructura correcta
    if (guiones && Array.isArray(guiones)) {
      guiones.forEach(function(g, i) {
        var gancho = g.gancho
        var ganchoOk = gancho && (typeof gancho === 'string' || (typeof gancho === 'object' && gancho.frase))
        registrar('EMAIL', 'guion ' + (i+1) + ' gancho', ganchoOk,
          typeof gancho === 'object' ? 'objeto con frase' : typeof gancho)

        var cierre = g.cierre
        var cierreOk = cierre && (typeof cierre === 'string' || (typeof cierre === 'object' && cierre.frase_cta))
        registrar('EMAIL', 'guion ' + (i+1) + ' cierre', cierreOk,
          typeof cierre === 'object' ? 'objeto con frase_cta' : typeof cierre)

        var escenas = g.escenas
        var escenasOk = Array.isArray(escenas) && escenas.length >= 2
        registrar('EMAIL', 'guion ' + (i+1) + ' escenas', escenasOk,
          (escenas || []).length + ' escenas')
      })
    }

    // Verificar brief existe en perfil_empresa
    // El brief se genera en runs semanales/mensuales — si no existe, es porque no se ha corrido aun
    var brief = sub.perfil_empresa && sub.perfil_empresa.brief
    registrar('EMAIL', 'brief estrategico existe', !!brief,
      brief ? (brief.territorios_contenido || []).length + ' territorios' : 'sin brief (se genera en proximo run semanal/mensual)')
    if (brief) {
      registrar('EMAIL', 'brief tiene resumen_negocio', !!(brief.resumen_negocio),
        brief.resumen_negocio ? (brief.resumen_negocio.length + ' chars') : 'vacio')
      registrar('EMAIL', 'brief tiene competidores', Array.isArray(brief.competidores_analizados) && brief.competidores_analizados.length > 0,
        (brief.competidores_analizados || []).length + ' competidores')
      registrar('EMAIL', 'brief tiene reglas', Array.isArray(brief.reglas_contenido) && brief.reglas_contenido.length > 0,
        (brief.reglas_contenido || []).length + ' reglas')
    }

  } catch (e) {
    registrar('EMAIL', 'email QA ejecucion', false, 'Error: ' + e.message)
  }
}

// ═══════════════════════════════════════════════
// CHECK 6: Dashboard renders correctly
// ═══════════════════════════════════════════════
async function checkDashboard(suscripcionId) {
  console.log('\n   === CHECK 6: Dashboard Rendering ===')

  var dashUrl = BASE_URL + '/copilot/dashboard/' + suscripcionId
  try {
    var res = await fetch(dashUrl, {
      headers: { 'User-Agent': 'CopilotQA/1.0' },
      redirect: 'follow',
      timeout: 20000,
    })
    registrar('DASHBOARD', 'HTTP status', res.status >= 200 && res.status < 400, 'HTTP ' + res.status)

    var html = await res.text()
    var htmlLen = html.length

    // Basic rendering checks
    registrar('DASHBOARD', 'HTML no vacio', htmlLen > 1000, htmlLen + ' chars')

    // Check no [object Object] in rendered HTML
    var objectObjectMatches = (html.match(/\[object Object\]/g) || []).length
    registrar('DASHBOARD', 'sin [object Object]', objectObjectMatches === 0,
      objectObjectMatches === 0 ? 'limpio' : objectObjectMatches + ' ocurrencias de [object Object]')

    // Check no undefined/null rendered as text
    var undefinedMatches = (html.match(/>undefined</g) || []).length
    var nullMatches = (html.match(/>null</g) || []).length
    registrar('DASHBOARD', 'sin undefined/null renderizado', undefinedMatches === 0 && nullMatches === 0,
      'undefined=' + undefinedMatches + ', null=' + nullMatches)

    // Check tabs exist in HTML (React SPA: tabs may be in JS bundle, not plain HTML)
    var tabKeywords = ['Competencia', 'Brief', 'Contenido', 'Auditor', 'competencia', 'brief', 'contenido', 'auditoria']
    var tabsPresent = tabKeywords.filter(function(t) { return html.includes(t) })
    // For React SPAs, even 1-2 matches in the JS bundle is enough
    registrar('DASHBOARD', 'tabs en bundle', tabsPresent.length >= 1,
      tabsPresent.length + ' keywords encontrados (React SPA: tabs renderizan client-side)')

    // Check no error messages
    var errorPatterns = ['Error:', 'error boundary', 'Something went wrong', 'Suscripci\u00f3n no encontrada']
    var errorsFound = errorPatterns.filter(function(p) { return html.includes(p) })
    registrar('DASHBOARD', 'sin errores visibles', errorsFound.length === 0,
      errorsFound.length === 0 ? 'limpio' : 'errores: ' + errorsFound.join(', '))

    // Check dark theme present (bg colors)
    var hasDarkTheme = html.includes('#0F0D2E') || html.includes('0F0D2E') || html.includes('bg-[#0F0D2E]')
    registrar('DASHBOARD', 'dark theme aplicado', hasDarkTheme, hasDarkTheme ? 'OK' : 'sin dark theme detectado')

    // Check M&P branding
    var hasBranding = html.includes('M&amp;P') || html.includes('M&P') || html.includes('Muller')
    registrar('DASHBOARD', 'branding M&P presente', hasBranding, hasBranding ? 'OK' : 'sin branding')

  } catch (e) {
    registrar('DASHBOARD', 'dashboard carga', false, 'Error: ' + e.message)
  }
}

// ═══════════════════════════════════════════════
// CHECK 7: Memoria / Learning system
// ═══════════════════════════════════════════════
async function checkMemoria(supabase, suscripcionId) {
  console.log('\n   === CHECK 7: Sistema de Memoria ===')

  try {
    var memoriaModule = require('./radar-memoria.js')
    var memoria = await memoriaModule.cargarMemoria(supabase, suscripcionId)

    registrar('MEMORIA', 'carga sin error', !!memoria, memoria ? 'OK' : 'null')

    if (memoria) {
      registrar('MEMORIA', 'copiesAprendizaje', !!memoria.copiesAprendizaje,
        'totalCopies=' + (memoria.copiesAprendizaje.totalCopiesHistoricos || 0) + ', scoreAvg=' + (memoria.copiesAprendizaje.scorePromedio || 0))

      registrar('MEMORIA', 'ideasContext', !!memoria.ideasContext,
        'total=' + (memoria.ideasContext.totalIdeas || 0) + ', aprobadas=' + (memoria.ideasContext.aprobadas || []).length)

      registrar('MEMORIA', 'auditoriaAprendizaje', !!memoria.auditoriaAprendizaje,
        'ultimoScore=' + (memoria.auditoriaAprendizaje.ultimoScore || 0) + ', tendencia=' + (memoria.auditoriaAprendizaje.tendenciaScore || 'n/a'))

      registrar('MEMORIA', 'competenciaPatrones', !!memoria.competenciaPatrones,
        (memoria.competenciaPatrones.competidores || []).length + ' competidores tracked')

      registrar('MEMORIA', 'guionesPrevios', !!memoria.guionesPrevios,
        (memoria.guionesPrevios.totalGuiones || 0) + ' guiones')

      // Test context generation
      var ctx = memoriaModule.generarContextoAprendizaje(memoria)
      registrar('MEMORIA', 'contexto generado', ctx && ctx.length > 0,
        ctx ? ctx.split('\n').length + ' lineas' : 'vacio')

      // Test recommendations
      var recs = memoriaModule.generarRecomendacionesBrief(memoria)
      registrar('MEMORIA', 'recomendaciones brief', Array.isArray(recs),
        recs.length + ' recomendaciones')
    }
  } catch (e) {
    registrar('MEMORIA', 'memoria ejecucion', false, 'Error: ' + e.message)
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
  await checkEmailHTML(supabase, suscripcionId)
  await checkDashboard(suscripcionId)
  await checkMemoria(supabase, suscripcionId)

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
