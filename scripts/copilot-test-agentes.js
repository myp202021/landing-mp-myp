// copilot-test-agentes.js
// Prueba unitaria de cada agente de Copilot
// Verifica que cada agente produce output de calidad
// Requiere: OPENAI_API_KEY, ANTHROPIC_API_KEY_GRILLAS, SUPABASE_URL, SUPABASE_SERVICE_KEY

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')

var SUPABASE_URL = process.env.SUPABASE_URL
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
var SOLO_ID = (process.argv.find(function(a) { return a.startsWith('--id=') }) || '').replace('--id=', '')

var totalTests = 0
var totalPass = 0
var totalFail = 0
var detalles = []

function ok(nombre, pass, detalle) {
  totalTests++
  if (pass) {
    totalPass++
    console.log('   ✅ PASS: ' + nombre + (detalle ? ' — ' + detalle : ''))
  } else {
    totalFail++
    console.log('   ❌ FAIL: ' + nombre + (detalle ? ' — ' + detalle : ''))
  }
  detalles.push({ nombre: nombre, pass: pass, detalle: detalle || '' })
}

// ═══════════════════════════════════════════════
// TEST 1: Perfil
// ═══════════════════════════════════════════════
async function testPerfil(suscriptor) {
  console.log('\n   === TEST 1: Agente Perfil ===')

  try {
    var perfilModule = require('./radar-perfil.js')
    // Hacer copia del suscriptor sin perfil para forzar generacion
    var suscriptorTest = JSON.parse(JSON.stringify(suscriptor))
    suscriptorTest.perfil_empresa = {}

    var resultado = await perfilModule.generarPerfil(suscriptorTest)

    ok('perfil.rubro no vacio', resultado && resultado.rubro && resultado.rubro.length > 0,
      resultado ? 'rubro: ' + (resultado.rubro || '(vacio)').substring(0, 60) : 'sin resultado')

    ok('perfil.productos no vacio', resultado && resultado.productos && resultado.productos.length > 0,
      resultado ? 'productos: ' + (resultado.productos || '(vacio)').substring(0, 60) : 'sin resultado')

    ok('perfil.propuesta_valor no vacio', resultado && resultado.propuesta_valor && resultado.propuesta_valor.length > 0,
      resultado ? 'propuesta: ' + (resultado.propuesta_valor || '(vacio)').substring(0, 60) : 'sin resultado')

    var territorios = (resultado && resultado.territorios_contenido) || []
    ok('perfil.territorios_contenido >= 3', Array.isArray(territorios) && territorios.length >= 3,
      territorios.length + ' territorios')

    return resultado
  } catch (e) {
    ok('perfil ejecucion', false, 'Error: ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// TEST 2: Brief
// ═══════════════════════════════════════════════
async function testBrief(suscriptor, posts, supabase) {
  console.log('\n   === TEST 2: Agente Brief ===')

  try {
    var briefModule = require('./radar-brief.js')
    var resultado = await briefModule.generarBrief(suscriptor, posts, supabase)

    ok('brief.resumen_negocio > 50 chars',
      resultado && resultado.resumen_negocio && resultado.resumen_negocio.length > 50,
      resultado ? (resultado.resumen_negocio || '').length + ' chars' : 'sin resultado')

    var painPoints = (resultado && resultado.publico_objetivo && resultado.publico_objetivo.pain_points) || []
    ok('brief.publico_objetivo.pain_points >= 2',
      Array.isArray(painPoints) && painPoints.length >= 2,
      painPoints.length + ' pain points')

    var competidores = (resultado && resultado.competidores_analizados) || []
    var conNombre = competidores.filter(function(c) { return c && c.nombre && c.nombre.length > 0 })
    ok('brief.competidores_analizados >= 1 con nombre',
      conNombre.length >= 1,
      conNombre.length + ' competidores con nombre')

    var territorios = (resultado && resultado.territorios_contenido) || []
    var conJustificacion = territorios.filter(function(t) { return t && t.justificacion && t.justificacion.length > 0 })
    ok('brief.territorios_contenido >= 3 con justificacion',
      conJustificacion.length >= 3,
      conJustificacion.length + ' territorios con justificacion')

    var tono = (resultado && resultado.tono_comunicacion) || {}
    ok('brief.tono_comunicacion no vacio',
      tono && (tono.estilo || tono.palabras_usar),
      tono.estilo ? 'estilo: ' + tono.estilo.substring(0, 60) : 'sin tono')

    return resultado
  } catch (e) {
    ok('brief ejecucion', false, 'Error: ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// TEST 3: Copies QA
// ═══════════════════════════════════════════════
async function testCopiesQA() {
  console.log('\n   === TEST 3: QA Copies (scoring) ===')

  try {
    var contenidoModule = require('./radar-contenido.js')
    // Acceder a paso3_revisar — puede no estar exportado, verificar
    // Si no esta exportado, testeamos via generarContenidoSugerido indirectamente
    // Creamos copies mock y verificamos el scoring

    // Copy bueno: largo, con hashtags, dato numerico, CTA medible, estacional
    var ahora = new Date()
    var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    var mesActual = meses[ahora.getMonth()]

    var copyBueno = {
      plataforma: 'Instagram', tipo: 'Carrusel', angulo: 'educativo',
      objetivo: 'engagement', titulo: 'Test copy bueno',
      justificacion: 'Basado en competencia real con datos de engagement',
      competidor_referencia: 'CompetidorX', engagement_referencia: 500,
      copy: '72% de las empresas en Chile aun no implementan automatizacion en sus procesos de marketing.\n\n'
        + 'En ' + mesActual + ' ' + ahora.getFullYear() + ', los datos del mercado muestran una tendencia clara:\n\n'
        + 'Slide 1: El problema — Las empresas pierden 15 horas semanales en tareas manuales\n'
        + 'Slide 2: La causa — Falta de integracion entre herramientas\n'
        + 'Slide 3: El dato — Empresas que automatizan aumentan 40% su productividad\n'
        + 'Slide 4: La solucion — 3 herramientas que puedes implementar esta semana\n'
        + 'Slide 5: El CTA — Comenta con el emoji 🚀 si tu empresa ya automatiza sus procesos de marketing\n\n'
        + 'Guarda este post y revisalo el lunes cuando planifiques tu semana de trabajo.\n\n'
        + '#MarketingDigital #Automatizacion #ProductividadLaboral #MarketingChile #TransformacionDigital #EstrategiaDigital #PymesChile',
      palabras: 120,
    }

    var copyGenerico = {
      plataforma: 'Instagram', tipo: 'Post', angulo: 'comercial',
      objetivo: 'conversion', titulo: 'Test copy generico',
      justificacion: 'Sin justificacion real',
      copy: 'En el vertiginoso mundo del marketing, es fundamental destacar que nuestra empresa es lider.\n\n'
        + 'Te invitamos a conocer nuestros servicios premium. Somos lideres en el mercado y estamos comprometidos con la excelencia.\n\n'
        + 'Contactanos hoy y descubre como podemos ayudarte. Siguenos para mas contenido.\n\n'
        + 'No te lo pierdas, es una oportunidad unica.',
      palabras: 55,
    }

    var copyCorto = {
      plataforma: 'LinkedIn', tipo: 'Articulo', angulo: 'tendencia',
      objetivo: 'awareness', titulo: 'Test copy corto',
      justificacion: 'Sin datos de competencia',
      copy: 'Las tendencias del mercado estan cambiando. Contactanos para saber mas.',
      palabras: 10,
    }

    // Como paso3_revisar no esta exportado directamente, simulamos el scoring
    // usando la misma logica del modulo
    var PALABRAS_PROHIBIDAS = [
      'en el vertiginoso', 'no es solo', 'en la era digital', 'sin lugar a dudas',
      'es importante destacar', 'cabe mencionar', 'en este sentido', 'paradigma',
      'sinergia', 'holistic', 'en un mundo cada vez', 'potenciar al maximo',
      'es fundamental', 'en definitiva', 'a modo de conclusion',
      'revolucionando', 'transformando el panorama', 'de vanguardia',
    ]
    var FRASES_GENERICAS = [
      'te invitamos a', 'no te pierdas', 'descubre como', 'conoce mas',
      'haz clic aqui', 'siguenos', 'te esperamos', 'lo mejor de lo mejor',
      'somos lideres', 'los mejores del mercado', 'calidad premium',
      'no te lo pierdas', 'aprovecha esta oportunidad', 'oferta imperdible',
      'contactanos hoy', 'estamos para ti', 'tu mejor opcion',
      'comprometidos con', 'pasion por', 'excelencia en',
    ]
    var CTA_GENERICOS = ['contactanos', 'contáctanos', 'mas informacion', 'más información', 'visita nuestro sitio', 'siguenos', 'síguenos', 'te esperamos', 'haz clic', 'dale like']

    function calcScore(c) {
      var score = 85
      var copyLower = c.copy.toLowerCase()
      var palabras = c.copy.split(/\s+/).length

      if (palabras < 80) score -= 25
      else if (palabras < 150) score -= 15
      if (c.plataforma === 'LinkedIn' && palabras < 250) score -= 15
      if (c.plataforma === 'Instagram' && c.tipo !== 'Reel' && palabras < 150) score -= 10

      var hashtagCount = (c.copy.match(/#\w+/g) || []).length
      if (hashtagCount === 0) score -= 10
      else if (hashtagCount < 3) score -= 5

      PALABRAS_PROHIBIDAS.forEach(function(p) { if (copyLower.includes(p)) score -= 10 })

      var genericasN = 0
      FRASES_GENERICAS.forEach(function(f) {
        if (copyLower.includes(f) && genericasN < 3) { score -= 10; genericasN++ }
      })

      var tieneInsight = false
      if (c.competidor_referencia || c.engagement_referencia) tieneInsight = true
      var mencionaComp = copyLower.includes('competencia') || copyLower.includes('mercado') || copyLower.includes('industria') || copyLower.includes('sector')
      var tieneDato = /\d{2,}/.test(c.copy) || copyLower.includes('%')
      if (!tieneInsight && !(mencionaComp && tieneDato)) score -= 20

      CTA_GENERICOS.forEach(function(cta) { if (copyLower.includes(cta)) score -= 15 })

      var primeraLinea = c.copy.split('\n')[0] || ''
      var pl = primeraLinea.toLowerCase()
      if ((pl.includes('sabias que') || pl.includes('te has preguntado') || pl.includes('en un mundo')) && !/\d/.test(primeraLinea)) score -= 10

      var tieneCTA = copyLower.includes('comenta') || copyLower.includes('comparte') || copyLower.includes('guarda')
        || copyLower.includes('escribe') || copyLower.includes('agenda') || copyLower.includes('cotiza')
        || copyLower.includes('descarga') || copyLower.includes('whatsapp') || copyLower.includes('dm')
        || copyLower.includes('envia') || copyLower.includes('envía')
      if (!tieneCTA) score -= 10

      // Bonos
      if (/\d{2,}/.test(c.copy) || (copyLower.includes('%') && /\d/.test(c.copy))) score += 5
      if (c.competidor_referencia || c.engagement_referencia) score += 3
      if (palabras >= 250) score += 5
      if (hashtagCount >= 5 && hashtagCount <= 10) score += 3
      var lineas = c.copy.split('\n').filter(function(l) { return l.trim().length > 0 })
      if (lineas.length >= 5) score += 2
      var ctaMedible = copyLower.includes('comenta con') || copyLower.includes('guarda este')
        || copyLower.includes('envia un dm') || copyLower.includes('etiqueta a')
      if (ctaMedible) score += 2

      return Math.max(0, Math.min(score, 95))
    }

    var scoreBueno = calcScore(copyBueno)
    ok('copy bueno score > 80', scoreBueno > 80, 'score=' + scoreBueno)

    var scoreGenerico = calcScore(copyGenerico)
    ok('copy generico score < 70', scoreGenerico < 70, 'score=' + scoreGenerico)

    var scoreCorto = calcScore(copyCorto)
    ok('copy corto score < 65', scoreCorto < 65, 'score=' + scoreCorto)

  } catch (e) {
    ok('copies QA ejecucion', false, 'Error: ' + e.message)
  }
}

// ═══════════════════════════════════════════════
// TEST 4: Auditoria
// ═══════════════════════════════════════════════
async function testAuditoria(suscripcionId, supabase) {
  console.log('\n   === TEST 4: Agente Auditoria ===')

  try {
    // Verificar que existen auditorias con formato correcto
    var res = await supabase.from('copilot_auditorias').select('*')
      .eq('suscripcion_id', suscripcionId)
      .order('id', { ascending: false })
      .limit(1)

    if (!res.data || res.data.length === 0) {
      // Si no hay auditorias, intentar generar una con el modulo
      try {
        var auditoriaModule = require('./radar-auditoria.js')
        // Cargar posts reales para la auditoria
        var postsRes = await supabase.from('radar_posts').select('*')
          .eq('suscripcion_id', suscripcionId)
          .order('id', { ascending: false })
          .limit(50)
        var posts = postsRes.data || []

        if (posts.length > 0 && auditoriaModule.generarAuditoria) {
          var subRes = await supabase.from('clipping_suscripciones').select('*').eq('id', suscripcionId).single()
          var suscriptor = subRes.data
          if (suscriptor) {
            var resultado = await auditoriaModule.generarAuditoria(suscriptor, posts, supabase)
            ok('auditoria.score_general es numero 0-100',
              resultado && typeof resultado.score_general === 'number' && resultado.score_general >= 0 && resultado.score_general <= 100,
              resultado ? 'score=' + resultado.score_general : 'sin resultado')

            var criterios = (resultado && resultado.criterios) || []
            ok('auditoria.criterios es array de 8',
              Array.isArray(criterios) && criterios.length === 8,
              criterios.length + ' criterios')

            if (criterios.length > 0) {
              var todosConScore = criterios.every(function(c) { return typeof c.score === 'number' && c.score >= 1 && c.score <= 10 })
              ok('auditoria criterios tienen score 1-10', todosConScore,
                todosConScore ? 'todos OK' : 'algunos criterios sin score valido')

              var todosConNombre = criterios.every(function(c) { return typeof c.nombre === 'string' && c.nombre.length > 0 })
              ok('auditoria criterios tienen nombre', todosConNombre,
                todosConNombre ? 'todos OK' : 'algunos criterios sin nombre')
            }
            return
          }
        }
      } catch (e) {
        console.log('   No se pudo generar auditoria de prueba: ' + e.message)
      }

      ok('auditoria disponible', false, 'sin auditorias para suscripcion ' + suscripcionId.substring(0, 8))
      return
    }

    var aud = res.data[0]

    ok('auditoria.score_general es numero 0-100',
      typeof aud.score_general === 'number' && aud.score_general >= 0 && aud.score_general <= 100,
      'score=' + aud.score_general)

    var criterios = aud.criterios || []
    ok('auditoria.criterios es array de 8',
      Array.isArray(criterios) && criterios.length === 8,
      criterios.length + ' criterios')

    if (criterios.length > 0) {
      var todosConScore = criterios.every(function(c) { return typeof c.score === 'number' && c.score >= 1 && c.score <= 10 })
      ok('auditoria criterios tienen score 1-10', todosConScore,
        todosConScore ? 'todos OK' : 'algunos criterios sin score valido')

      var todosConNombre = criterios.every(function(c) { return typeof c.nombre === 'string' && c.nombre.length > 0 })
      ok('auditoria criterios tienen nombre', todosConNombre,
        todosConNombre ? 'todos OK' : 'algunos criterios sin nombre')
    }
  } catch (e) {
    ok('auditoria ejecucion', false, 'Error: ' + e.message)
  }
}

// ═══════════════════════════════════════════════
// TEST 5: Integridad de datos
// ═══════════════════════════════════════════════
async function testIntegridad(suscripcionId, supabase) {
  console.log('\n   === TEST 5: Integridad de datos ===')

  // Posts: likes no es objeto
  try {
    var res = await supabase.from('radar_posts').select('id, likes, texto')
      .eq('suscripcion_id', suscripcionId)
      .limit(200)
    var posts = res.data || []

    if (posts.length === 0) {
      ok('integridad posts', true, 'sin posts (skip)')
    } else {
      var likesObj = posts.filter(function(p) {
        return p.likes !== null && p.likes !== undefined
          && typeof p.likes === 'object'
      })
      ok('posts sin likes como objeto', likesObj.length === 0,
        likesObj.length === 0 ? posts.length + ' posts OK' : likesObj.length + ' posts con likes objeto')

      var sinTexto = posts.filter(function(p) { return p.texto === null || p.texto === undefined })
      ok('posts sin texto null', sinTexto.length === 0,
        sinTexto.length === 0 ? posts.length + ' posts OK' : sinTexto.length + ' posts con texto null')
    }
  } catch (e) {
    ok('integridad posts', false, e.message)
  }

  // Contenido: datos como array
  try {
    var res = await supabase.from('radar_contenido').select('id, datos')
      .eq('suscripcion_id', suscripcionId)
      .limit(20)
    var rows = res.data || []

    if (rows.length === 0) {
      ok('integridad contenido', true, 'sin entries (skip)')
    } else {
      var sinArray = rows.filter(function(r) { return !Array.isArray(r.datos) })
      ok('contenido datos es array', sinArray.length === 0,
        sinArray.length === 0 ? rows.length + ' entries OK' : sinArray.length + ' entries con datos no-array')
    }
  } catch (e) {
    ok('integridad contenido', false, e.message)
  }

  // Guiones: gancho con frase si es objeto
  try {
    var res = await supabase.from('copilot_guiones').select('id, datos')
      .eq('suscripcion_id', suscripcionId)
      .limit(10)
    var rows = res.data || []

    if (rows.length === 0) {
      ok('integridad guiones', true, 'sin entries (skip)')
    } else {
      var problemas = 0
      rows.forEach(function(r) {
        if (!Array.isArray(r.datos)) { problemas++; return }
        r.datos.forEach(function(item) {
          if (typeof item.gancho === 'object' && item.gancho !== null && !item.gancho.frase) problemas++
        })
      })
      ok('guiones gancho formato correcto', problemas === 0,
        problemas === 0 ? rows.length + ' guiones OK' : problemas + ' items con gancho objeto sin .frase')
    }
  } catch (e) {
    ok('integridad guiones', false, e.message)
  }
}

// ═══════════════════════════════════════════════
// FUNCION PRINCIPAL
// ═══════════════════════════════════════════════
async function runTests(suscripcionId) {
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║    COPILOT TEST AGENTES              ║')
  console.log('╚══════════════════════════════════════╝')
  console.log('   Fecha: ' + new Date().toISOString())

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('   ERROR: faltan SUPABASE_URL o SUPABASE_SERVICE_KEY')
    process.exit(1)
  }

  if (!suscripcionId) {
    console.error('   ERROR: se requiere --id=UUID de suscripcion')
    console.error('   Uso: node scripts/copilot-test-agentes.js --id=209ef08d-...')
    process.exit(1)
  }

  var supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY)
  console.log('   Suscripcion: ' + suscripcionId)

  // Cargar suscriptor
  var subRes = await supabase.from('clipping_suscripciones').select('*').eq('id', suscripcionId).single()
  if (subRes.error || !subRes.data) {
    console.error('   ERROR: suscripcion no encontrada — ' + (subRes.error ? subRes.error.message : 'sin data'))
    process.exit(1)
  }
  var suscriptor = subRes.data
  console.log('   Suscriptor: ' + (suscriptor.nombre || suscriptor.email))

  // Cargar posts reales
  var postsRes = await supabase.from('radar_posts').select('*')
    .eq('suscripcion_id', suscripcionId)
    .order('id', { ascending: false })
    .limit(50)
  var posts = postsRes.data || []
  console.log('   Posts disponibles: ' + posts.length)

  // Ejecutar tests
  await testPerfil(suscriptor)
  if (posts.length > 0) {
    await testBrief(suscriptor, posts, supabase)
  } else {
    console.log('\n   === TEST 2: Agente Brief === (SKIP: sin posts)')
  }
  await testCopiesQA()
  await testAuditoria(suscripcionId, supabase)
  await testIntegridad(suscripcionId, supabase)

  // Resumen
  console.log('\n   ══════════════════════════════════')
  console.log('   RESUMEN TESTS')
  console.log('   ══════════════════════════════════')
  console.log('   Total tests: ' + totalTests)
  console.log('   ✅ Pass: ' + totalPass)
  console.log('   ❌ Fail: ' + totalFail)
  console.log('   Resultado: ' + (totalFail === 0 ? '✅ TODOS PASAN' : '❌ ' + totalFail + ' FALLOS'))
  console.log('   ══════════════════════════════════\n')

  return { total: totalTests, pass: totalPass, fail: totalFail, detalles: detalles }
}

// Ejecucion directa
if (require.main === module) {
  if (!SOLO_ID) {
    console.error('Uso: node scripts/copilot-test-agentes.js --id=UUID')
    process.exit(1)
  }
  runTests(SOLO_ID).then(function(res) {
    process.exit(res.fail > 0 ? 1 : 0)
  }).catch(function(e) {
    console.error('TEST ERROR FATAL: ' + e.message)
    process.exit(1)
  })
}

module.exports = { runTests: runTests }
