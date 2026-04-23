// radar-clipping.js v6
// 4 canales: Instagram + LinkedIn + Facebook + Prensa
// Persiste posts en radar_posts, calcula trends vs periodo anterior
// IA: Claude para semanal/mensual, OpenAI para diario
// Pipeline contenido: OpenAI analiza → Claude crea → OpenAI QA
// Modo: --diario | --semanal | --mensual | --dry-run

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')
var fs = require('fs')
var childProcess = require('child_process')
var contenidoModule = require('./radar-contenido.js')
var grillaModule = require('./radar-grilla-mensual.js')
var perfilModule = require('./radar-perfil.js')
var guionesModule = require('./radar-guiones.js')
var auditoriaModule = require('./radar-auditoria.js')

var APIFY_TOKEN = process.env.APIFY_TOKEN
var RESEND_KEY = process.env.RESEND
var OPENAI_KEY = process.env.OPENAI_API_KEY
var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS
var supabase = supabaseLib.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

var MODO = process.argv.includes('--semanal') ? 'semanal'
         : process.argv.includes('--mensual') ? 'mensual' : 'diario'
var DRY_RUN = process.argv.includes('--dry-run')
var VENTANA_HORAS = MODO === 'diario' ? 72 : MODO === 'semanal' ? 7 * 24 + 4 : 31 * 24
var SOLO_ID = (process.argv.find(function(a) { return a.startsWith('--id=') }) || '').replace('--id=', '')
var SOLO_EMAIL = (process.argv.find(function(a) { return a.startsWith('--email=') }) || '').replace('--email=', '')

var MEDIOS_PRENSA = [
  { nombre: 'La Tercera', handle: 'latercera' },
  { nombre: 'BioBioChile', handle: 'biobio' },
  { nombre: 'Emol', handle: 'emol_cl' },
  { nombre: 'Diario Financiero', handle: 'df_mas' },
  { nombre: 'CNN Chile', handle: 'cnnchile' },
  { nombre: 'T13', handle: 't13' },
  { nombre: 'Publimetro', handle: 'publimetrochile' },
  { nombre: 'El Dinamo', handle: 'eldinamo' },
  { nombre: 'Meganoticias', handle: 'meganoticiascl' },
  { nombre: 'ADN Radio', handle: 'adnradiochile' },
  { nombre: 'Cooperativa', handle: 'cooperativa.cl' },
]

// Fechas relevantes Chile para contexto estacional IA
var FECHAS_CHILE = [
  { mes: 1, dia: 1, nombre: 'Anio Nuevo' },
  { mes: 3, dia: 8, nombre: 'Dia Internacional de la Mujer' },
  { mes: 4, dia: 18, nombre: 'Viernes Santo' },
  { mes: 5, dia: 1, nombre: 'Dia del Trabajo' },
  { mes: 5, dia: 11, nombre: 'Dia de la Madre' },
  { mes: 5, dia: 21, nombre: 'Dia de las Glorias Navales' },
  { mes: 6, dia: 15, nombre: 'Dia del Padre' },
  { mes: 6, dia: 20, nombre: 'Dia Nacional de los Pueblos Indigenas' },
  { mes: 7, dia: 16, nombre: 'Dia de la Virgen del Carmen' },
  { mes: 8, dia: 15, nombre: 'Asuncion de la Virgen' },
  { mes: 9, dia: 18, nombre: 'Fiestas Patrias' },
  { mes: 9, dia: 19, nombre: 'Dia de las Glorias del Ejercito' },
  { mes: 10, dia: 12, nombre: 'Encuentro de Dos Mundos' },
  { mes: 10, dia: 31, nombre: 'Dia de las Iglesias Evangelicas / Halloween' },
  { mes: 11, dia: 1, nombre: 'Dia de Todos los Santos' },
  { mes: 11, dia: 25, nombre: 'Black Friday (aprox)' },
  { mes: 12, dia: 25, nombre: 'Navidad' },
  { mes: 12, dia: 12, nombre: 'CyberMonday Chile (aprox)' },
]

// Mapa handle -> nombre empresa (se llena desde cuentas del suscriptor)
var handleToNombre = {}

async function main() {
  var hoy = new Date().toISOString().split('T')[0]
  console.log('RADAR v5 | ' + MODO.toUpperCase() + ' | ' + hoy + (DRY_RUN ? ' | DRY-RUN' : ''))

  var result = await supabase.from('clipping_suscripciones').select('*').in('estado', ['trial', 'activo'])
  if (result.error) { console.error('BD error:', result.error.message); process.exit(1) }
  var subs = result.data || []
  if (subs.length === 0) { console.log('Sin suscriptores.'); return }

  var ahora = new Date()
  var activos = subs.filter(function(s) {
    if (s.estado === 'trial' && s.trial_ends && new Date(s.trial_ends) < ahora) {
      supabase.from('clipping_suscripciones').update({ estado: 'cancelado' }).eq('id', s.id)
      return false
    }
    if (SOLO_ID && s.id !== SOLO_ID) return false
    if (SOLO_EMAIL && s.email !== SOLO_EMAIL) return false
    return true
  })
  if (SOLO_ID || SOLO_EMAIL) console.log('Filtro: ' + (SOLO_ID || SOLO_EMAIL))
  console.log('Suscriptores: ' + activos.length)

  // Construir mapa handle->nombre y sets por red
  var igSet = new Set(), liSet = new Set(), fbSet = new Set(), prensaKws = []
  for (var i = 0; i < activos.length; i++) {
    var cuentas = activos[i].cuentas || []
    for (var j = 0; j < cuentas.length; j++) {
      var c = cuentas[j]
      if (c.nombre) handleToNombre[c.handle.toLowerCase()] = c.nombre
      // Saltar cuentas marcadas como inválidas por el validador
      if (c.validada === false) {
        console.log('   Saltando ' + c.red + ' @' + c.handle + ' (inválida: ' + (c.motivo_invalida || 'sin motivo') + ')')
        continue
      }
      if (c.red === 'instagram') igSet.add(c.handle.toLowerCase())
      else if (c.red === 'linkedin') liSet.add(c.handle.toLowerCase())
      else if (c.red === 'facebook') fbSet.add(c.handle.toLowerCase())
      else if (c.red === 'prensa' && c.keywords) prensaKws = c.keywords.map(function(k) { return k.toLowerCase() })
    }
  }

  var desde = new Date(Date.now() - VENTANA_HORAS * 60 * 60 * 1000)
  var allPosts = []

  // === INSTAGRAM ===
  if (igSet.size > 0) {
    console.log('\n--- INSTAGRAM: ' + igSet.size + ' cuentas ---')
    try {
      var urls = Array.from(igSet).map(function(h) { return 'https://www.instagram.com/' + h + '/' })
      var r = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: urls, resultsType: 'posts', resultsLimit: MODO === 'diario' ? 5 : 15, addParentData: true }) })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      var raw = await r.json()
      var posts = raw.filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })
        .map(function(p) { var h = (p.ownerUsername || '').toLowerCase(); return {
          red: 'Instagram', handle: h, nombre: handleToNombre[h] || h,
          texto: (p.caption || '').substring(0, 500), url: p.url || 'https://www.instagram.com/p/' + p.shortCode + '/',
          timestamp: p.timestamp, likes: p.likesCount || 0, comments: p.commentsCount || 0, type: p.type || 'Image'
        }})
      allPosts = allPosts.concat(posts)
      Array.from(igSet).forEach(function(h) { var n = posts.filter(function(p) { return p.handle === h }).length; console.log('   ' + (handleToNombre[h] || h) + ': ' + n) })
    } catch (e) { console.error('   IG error: ' + e.message) }
  }

  // === LINKEDIN ===
  if (liSet.size > 0) {
    console.log('\n--- LINKEDIN: ' + liSet.size + ' empresas ---')
    for (var handle of liSet) {
      try {
        var r = await fetch('https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: ['https://www.linkedin.com/company/' + handle + '/posts/'], maxPosts: MODO === 'diario' ? 5 : 15 }) })
        if (!r.ok) throw new Error('HTTP ' + r.status)
        var raw = await r.json()
        var posts = raw.filter(function(p) { var d = p.postedAt || p.date || p.publishedAt; return d && new Date(d) > desde })
          .map(function(p) { return {
            red: 'LinkedIn', handle: handle, nombre: handleToNombre[handle] || handle,
            texto: (p.text || p.commentary || '').substring(0, 500), url: p.url || p.postUrl || '',
            timestamp: p.postedAt || p.date || p.publishedAt,
            likes: p.likesCount || p.numLikes || 0, comments: p.commentsCount || p.numComments || 0, type: 'Post'
          }})
        allPosts = allPosts.concat(posts)
        console.log('   ' + (handleToNombre[handle] || handle) + ': ' + posts.length)
      } catch (e) { console.error('   ' + handle + ': ' + e.message) }
    }
  }

  // === FACEBOOK ===
  if (fbSet.size > 0) {
    console.log('\n--- FACEBOOK: ' + fbSet.size + ' paginas ---')
    try {
      var urls = Array.from(fbSet).map(function(h) { return 'https://www.facebook.com/' + h + '/' })
      var r = await fetch('https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startUrls: urls.map(function(u) { return { url: u } }), resultsLimit: MODO === 'diario' ? 5 : 15 }) })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      var raw = await r.json()
      var posts = raw.filter(function(p) { var d = p.time || p.timestamp; return d && new Date(d) > desde })
        .map(function(p) { var h = (p.pageName || p.username || '').toLowerCase()
          // Buscar nombre por coincidencia parcial
          var nom = h
          Object.keys(handleToNombre).forEach(function(key) { if (h.includes(key.toLowerCase().substring(0,6))) nom = handleToNombre[key] })
          return { red: 'Facebook', handle: h, nombre: nom,
            texto: (p.text || p.postText || '').substring(0, 500), url: p.url || p.postUrl || '',
            timestamp: p.time || p.timestamp, likes: p.likes || p.likesCount || 0,
            comments: p.comments || p.commentsCount || 0, type: 'Post'
          }})
      allPosts = allPosts.concat(posts)
      console.log('   Total FB en ventana: ' + posts.length)
    } catch (e) { console.error('   FB error: ' + e.message) }
  }

  // === PRENSA ===
  if (prensaKws.length > 0) {
    console.log('\n--- PRENSA: ' + MEDIOS_PRENSA.length + ' medios, keywords: [' + prensaKws.join(', ') + '] ---')
    try {
      var urls = MEDIOS_PRENSA.map(function(m) { return 'https://www.instagram.com/' + m.handle + '/' })
      var r = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: urls, resultsType: 'posts', resultsLimit: 10, addParentData: true }) })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      var raw = await r.json()
      var recientes = raw.filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })
      console.log('   Posts de medios en ventana: ' + recientes.length)
      var menciones = recientes.filter(function(p) {
        var txt = ((p.caption || '') + ' ' + (p.ownerUsername || '')).toLowerCase()
        return prensaKws.some(function(kw) { return txt.includes(kw) })
      }).map(function(p) {
        var medio = MEDIOS_PRENSA.find(function(m) { return m.handle.toLowerCase() === (p.ownerUsername || '').toLowerCase() })
        var kwFound = prensaKws.filter(function(kw) { return (p.caption || '').toLowerCase().includes(kw) })
        return { red: 'Prensa', handle: (p.ownerUsername || '').toLowerCase(),
          nombre: medio ? medio.nombre : (p.ownerUsername || ''),
          texto: (p.caption || '').substring(0, 500), url: p.url || 'https://www.instagram.com/p/' + p.shortCode + '/',
          timestamp: p.timestamp, likes: p.likesCount || 0, comments: p.commentsCount || 0,
          type: 'Mencion', keywords: kwFound
        }
      })
      allPosts = allPosts.concat(menciones)
      console.log('   Menciones: ' + menciones.length)
    } catch (e) { console.error('   Prensa error: ' + e.message) }
  }

  // === TOTALES ===
  var ig = allPosts.filter(function(p) { return p.red === 'Instagram' }).length
  var li = allPosts.filter(function(p) { return p.red === 'LinkedIn' }).length
  var fb = allPosts.filter(function(p) { return p.red === 'Facebook' }).length
  var pr = allPosts.filter(function(p) { return p.red === 'Prensa' }).length
  console.log('\n=== TOTAL: ' + allPosts.length + ' (IG:' + ig + ' LI:' + li + ' FB:' + fb + ' Prensa:' + pr + ') ===')

  if (DRY_RUN) { console.log('DRY-RUN: fin.'); return }

  // === POR SUSCRIPTOR ===
  for (var si = 0; si < activos.length; si++) {
    var sub = activos[si]
    var cuentas = sub.cuentas || []
    var handles = cuentas.filter(function(c) { return c.red !== 'prensa' }).map(function(c) { return c.handle.toLowerCase() })
    var misPosts = allPosts.filter(function(p) {
      if (p.red === 'Prensa') return true
      return handles.includes(p.handle)
    })
    var destinos = (sub.emails_destino && sub.emails_destino.length > 0) ? sub.emails_destino : [sub.email]
    console.log('\n' + sub.email + ': ' + misPosts.length + ' posts')

    // Persist posts to radar_posts
    await persistirPosts(sub.id, misPosts, MODO)

    // Query previous period for trends
    var trends = await calcularTrends(sub.id, misPosts, cuentas, MODO)

    var empresas = extraerEmpresas(cuentas)

    var resumenIA = ''
    if (misPosts.length > 0) {
      if (MODO === 'diario' && OPENAI_KEY) {
        resumenIA = await generarResumenOpenAI(misPosts, cuentas, MODO, trends)
      } else if ((MODO === 'semanal' || MODO === 'mensual') && ANTHROPIC_KEY) {
        resumenIA = await generarResumenClaude(misPosts, cuentas, MODO, trends)
      } else if (OPENAI_KEY) {
        resumenIA = await generarResumenOpenAI(misPosts, cuentas, MODO, trends)
      }
    }

    // Verificar/generar perfil empresa antes de contenido (semanal/mensual)
    if ((MODO === 'semanal' || MODO === 'mensual') && misPosts.length >= 2) {
      var perfilActual = sub.perfil_empresa || {}
      if (!perfilActual.rubro || !perfilActual.productos || !perfilActual.propuesta_valor) {
        console.log('   Perfil incompleto, generando automaticamente...')
        var nuevoPerfil = await perfilModule.generarPerfil(sub)
        if (nuevoPerfil && nuevoPerfil.rubro) {
          sub.perfil_empresa = nuevoPerfil
          await supabase.from('clipping_suscripciones').update({ perfil_empresa: nuevoPerfil, updated_at: new Date().toISOString() }).eq('id', sub.id)
          console.log('   Perfil actualizado: ' + nuevoPerfil.rubro)
        }
      }
    }

    // Pipeline contenido sugerido (semanal/mensual, pro y business)
    var contenidoSugerido = []
    if ((MODO === 'semanal' || MODO === 'mensual') && misPosts.length >= 2 && (sub.plan === 'pro' || sub.plan === 'business' || sub.plan === 'test')) {
      contenidoSugerido = await contenidoModule.generarContenidoSugerido(misPosts, empresas, MODO, sub.perfil_empresa || {}, supabase, sub.id)
    }

    // Grilla mensual (todos los planes, cantidad de posts varía)
    var grillaMensual = null
    if (MODO === 'mensual' && misPosts.length >= 2) {
      var POSTS_POR_PLAN = { starter: 4, pro: 8, business: 16, test: 16 }
      var cantidadPosts = POSTS_POR_PLAN[sub.plan] || 8
      var mesSig = new Date().getMonth() + 2
      var anioSig = new Date().getFullYear()
      if (mesSig > 12) { mesSig = 1; anioSig++ }
      grillaMensual = await grillaModule.generarGrillaMensual(misPosts, empresas, sub, mesSig, anioSig, supabase, cantidadPosts)
    }

    // Guiones de reels (semanal/mensual, solo business)
    var guionesData = null
    if ((MODO === 'semanal' || MODO === 'mensual') && (sub.plan === 'business' || sub.plan === 'test') && misPosts.length >= 2) {
      guionesData = await guionesModule.generarGuiones(misPosts, empresas, sub.perfil_empresa || {}, contenidoSugerido, supabase, sub.id)
    }

    // Auditoría mensual (mensual, todos los planes)
    var auditoriaData = null
    if (MODO === 'mensual') {
      var contenidoMes = contenidoSugerido || []
      auditoriaData = await auditoriaModule.generarAuditoria(misPosts, contenidoMes, cuentas, supabase, sub.id)
    }

    var html = generarEmailHTML(misPosts, cuentas, hoy, MODO, resumenIA, empresas, trends, sub.id, contenidoSugerido, sub.estado, sub.plan, sub.trial_ends, grillaMensual, guionesData, auditoriaData)
    var pdf = generarPDF(html, hoy, MODO)
    var excel = null
    if (MODO === 'mensual' && grillaMensual && grillaMensual.length > 0) {
      excel = generarExcel(grillaMensual, sub.nombre || sub.email, hoy)
    }
    await enviarEmail(destinos, html, hoy, misPosts.length, MODO, pdf, excel, sub.nombre || sub.email)
  }
  console.log('\nRadar ' + MODO + ' completado | ' + activos.length + ' suscriptores')
}

// === PERSISTIR POSTS ===
async function persistirPosts(suscripcionId, posts, modo) {
  if (posts.length === 0) return
  var fechaScrape = new Date().toISOString()
  var rows = posts.map(function(p) {
    return {
      suscripcion_id: suscripcionId,
      red: p.red,
      handle: p.handle,
      nombre_empresa: p.nombre,
      post_url: (p.url || '').substring(0, 2000),
      texto: (p.texto || '').substring(0, 1000),
      likes: p.likes || 0,
      comments: p.comments || 0,
      tipo_post: p.type || 'Post',
      keywords_match: p.keywords || [],
      fecha_post: p.timestamp ? new Date(p.timestamp).toISOString() : null,
      fecha_scrape: fechaScrape,
      modo: modo
    }
  })
  // Insert in batches of 50
  var batchSize = 50
  for (var i = 0; i < rows.length; i += batchSize) {
    var batch = rows.slice(i, i + batchSize)
    var res = await supabase.from('radar_posts').insert(batch)
    if (res.error) {
      console.error('   radar_posts insert error: ' + res.error.message)
    }
  }
  console.log('   Persistidos: ' + rows.length + ' posts en radar_posts')
}

// === CALCULAR TRENDS ===
async function calcularTrends(suscripcionId, currentPosts, cuentas, modo) {
  var trends = {}
  // Determine previous period range
  var ahora = new Date()
  var prevDesde, prevHasta
  if (modo === 'diario') {
    // Yesterday = 24-48h ago
    prevHasta = new Date(ahora.getTime() - 24 * 60 * 60 * 1000)
    prevDesde = new Date(ahora.getTime() - 48 * 60 * 60 * 1000)
  } else if (modo === 'semanal') {
    // Previous week
    prevHasta = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
    prevDesde = new Date(ahora.getTime() - 14 * 24 * 60 * 60 * 1000)
  } else {
    // Previous month
    prevHasta = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
    prevDesde = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000)
  }

  try {
    var res = await supabase.from('radar_posts')
      .select('*')
      .eq('suscripcion_id', suscripcionId)
      .gte('fecha_scrape', prevDesde.toISOString())
      .lte('fecha_scrape', prevHasta.toISOString())
    var prevPosts = (res.data || [])

    // Group current posts by empresa
    var empresas = extraerEmpresas(cuentas)
    Object.keys(empresas).forEach(function(nombre) {
      var emp = empresas[nombre]
      var empHandles = [emp.ig, emp.li, emp.fb].filter(Boolean)
      var currEmp = currentPosts.filter(function(p) { return p.red !== 'Prensa' && empHandles.includes(p.handle) })
      var prevEmp = prevPosts.filter(function(p) { return p.red !== 'Prensa' && empHandles.includes(p.handle) })

      var currTotal = currEmp.length
      var prevTotal = prevEmp.length
      var currLikes = currEmp.reduce(function(s, p) { return s + (p.likes || 0) }, 0)
      var prevLikes = prevEmp.reduce(function(s, p) { return s + (p.likes || 0) }, 0)
      var currEng = currTotal > 0 ? Math.round((currLikes + currEmp.reduce(function(s, p) { return s + (p.comments || 0) }, 0)) / currTotal) : 0
      var prevEng = prevTotal > 0 ? Math.round((prevLikes + prevEmp.reduce(function(s, p) { return s + (p.comments || 0) }, 0)) / prevTotal) : 0

      var postsPct = 0
      if (prevTotal > 0) postsPct = Math.round(((currTotal - prevTotal) / prevTotal) * 100)
      else if (currTotal > 0) postsPct = 100

      var likesPct = 0
      if (prevLikes > 0) likesPct = Math.round(((currLikes - prevLikes) / prevLikes) * 100)
      else if (currLikes > 0) likesPct = 100

      var engPct = 0
      if (prevEng > 0) engPct = Math.round(((currEng - prevEng) / prevEng) * 100)
      else if (currEng > 0) engPct = 100

      trends[nombre] = {
        postsPct: postsPct,
        likesPct: likesPct,
        engPct: engPct,
        prevTotal: prevTotal,
        prevLikes: prevLikes,
        prevEng: prevEng,
        hasPrev: prevPosts.length > 0
      }
    })
    console.log('   Trends: ' + Object.keys(trends).length + ' empresas, prev posts: ' + prevPosts.length)
  } catch (e) {
    console.error('   Trends error: ' + e.message)
  }
  return trends
}

function extraerEmpresas(cuentas) {
  var empresas = {}
  cuentas.forEach(function(c) {
    if (c.red === 'prensa' || !c.nombre) return
    if (!empresas[c.nombre]) empresas[c.nombre] = { ig: null, li: null, fb: null }
    if (c.red === 'instagram') empresas[c.nombre].ig = c.handle.toLowerCase()
    else if (c.red === 'linkedin') empresas[c.nombre].li = c.handle.toLowerCase()
    else if (c.red === 'facebook') empresas[c.nombre].fb = c.handle.toLowerCase()
  })
  return empresas
}

// === CONTEXTO ESTACIONAL ===
function getContextoEstacional() {
  var ahora = new Date()
  var mes = ahora.getMonth() + 1
  var dia = ahora.getDate()
  var proximas = []
  for (var i = 0; i < FECHAS_CHILE.length; i++) {
    var f = FECHAS_CHILE[i]
    var diaFecha = new Date(ahora.getFullYear(), f.mes - 1, f.dia)
    var diff = (diaFecha.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
    if (diff >= -2 && diff <= 30) {
      proximas.push(f.nombre + ' (' + f.dia + '/' + f.mes + ', en ' + Math.round(diff) + ' dias)')
    }
  }
  if (proximas.length === 0) return 'Sin fechas comerciales relevantes en los proximos 30 dias.'
  return 'Fechas proximas: ' + proximas.join('; ') + '.'
}

// === IA - OPENAI (diario) ===
async function generarResumenOpenAI(posts, cuentas, modo, trends) {
  try {
    var empresas = cuentas.filter(function(c) { return c.nombre && c.red !== 'prensa' }).map(function(c) { return c.nombre })
    var unicas = Array.from(new Set(empresas)).join(', ')
    var data = posts.slice(0, 30).map(function(p) {
      return '[' + p.red + '] ' + p.nombre + ': "' + p.texto.substring(0, 120) + '" (' + p.likes + ' likes)'
    }).join('\n')

    var trendTxt = ''
    Object.keys(trends).forEach(function(nombre) {
      var t = trends[nombre]
      if (t.hasPrev) {
        trendTxt = trendTxt + nombre + ': posts ' + (t.postsPct >= 0 ? '+' : '') + t.postsPct + '%, likes ' + (t.likesPct >= 0 ? '+' : '') + t.likesPct + '%. '
      }
    })

    var prompt = 'Eres un analista de redes sociales. Analiza posts de hoy de: ' + unicas + '.'
    if (trendTxt) prompt = prompt + ' Tendencias vs periodo anterior: ' + trendTxt
    prompt = prompt + ' Contexto: ' + getContextoEstacional()
    prompt = prompt + ' Genera un JSON con esta estructura exacta (sin markdown, solo JSON): {"contexto":"texto corto sobre el mercado hoy","empresas":[{"nombre":"X","badge":"green|yellow|red","texto":"analisis breve"}],"oportunidad":"texto","alerta":"texto"}'
    prompt = prompt + ' Usa badge green=activa, yellow=moderada, red=inactiva. Max 200 palabras total. Espanol sin acentos ni emojis.'

    var r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 800,
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: data }] }) })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    var d = await r.json()
    return d.choices[0].message.content || ''
  } catch (e) { console.error('   IA OpenAI: ' + e.message); return '' }
}

// === IA - CLAUDE (semanal/mensual) ===
async function generarResumenClaude(posts, cuentas, modo, trends) {
  try {
    var empresas = cuentas.filter(function(c) { return c.nombre && c.red !== 'prensa' }).map(function(c) { return c.nombre })
    var unicas = Array.from(new Set(empresas)).join(', ')
    var data = posts.slice(0, 50).map(function(p) {
      return '[' + p.red + '] ' + p.nombre + ': "' + p.texto.substring(0, 150) + '" (' + p.likes + ' likes, ' + p.comments + ' comments)'
    }).join('\n')

    var trendTxt = ''
    Object.keys(trends).forEach(function(nombre) {
      var t = trends[nombre]
      if (t.hasPrev) {
        trendTxt = trendTxt + nombre + ': posts ' + (t.postsPct >= 0 ? '+' : '') + t.postsPct + '% (prev ' + t.prevTotal + '), likes ' + (t.likesPct >= 0 ? '+' : '') + t.likesPct + '% (prev ' + t.prevLikes + '), eng prom ' + (t.engPct >= 0 ? '+' : '') + t.engPct + '%. '
      }
    })

    var periodoLabel = modo === 'semanal' ? 'esta semana' : 'este mes'
    var prompt = 'Eres un analista senior de marketing digital especializado en el mercado chileno.'
    prompt = prompt + ' Empresas monitoreadas: ' + unicas + '.'
    prompt = prompt + ' Industria: HR tech, control de asistencia, gestion de personas en Chile.'
    prompt = prompt + ' Periodo: ' + periodoLabel + '.'
    if (trendTxt) prompt = prompt + ' Comparacion vs periodo anterior: ' + trendTxt
    prompt = prompt + ' Contexto estacional Chile: ' + getContextoEstacional()
    prompt = prompt + '\n\nGenera un JSON con esta estructura exacta (sin markdown, sin backticks, solo JSON puro):'
    prompt = prompt + ' {"contexto":"parrafo sobre el contexto de mercado esta semana/mes, mencionar fechas relevantes y como afectan al sector HR tech",'
    prompt = prompt + '"empresas":[{"nombre":"X","badge":"green|yellow|red","texto":"analisis con numeros especificos del periodo y comparacion vs anterior"}],'
    prompt = prompt + '"oportunidad":"oportunidad concreta basada en datos y contexto",'
    prompt = prompt + '"alerta":"alerta o riesgo detectado",'
    prompt = prompt + '"contenido_sugerido":[{"titulo":"titulo del post","red":"Instagram|LinkedIn|Facebook","descripcion":"que publicar y por que, con copy sugerido"}]}'
    prompt = prompt + ' Incluir 2-3 ideas de contenido en contenido_sugerido. Usa badge green=muy activa, yellow=actividad moderada, red=inactiva/sin posts.'
    prompt = prompt + ' Max 400 palabras total. Espanol profesional sin acentos ni emojis.'

    var r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: 'Aqui estan los posts del periodo:\n\n' + data + '\n\nGenera el JSON de analisis.'
        }],
        system: prompt
      })
    })
    if (!r.ok) {
      var errBody = await r.text()
      throw new Error('HTTP ' + r.status + ' ' + errBody.substring(0, 200))
    }
    var d = await r.json()
    var txt = d.content && d.content[0] ? d.content[0].text : ''
    return txt
  } catch (e) { console.error('   IA Claude: ' + e.message); return '' }
}

// === PARSE IA JSON SAFE ===
function parseIAResponse(raw) {
  if (!raw) return null
  try {
    // Strip markdown code fences if present
    var cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    return JSON.parse(cleaned)
  } catch (e) {
    console.error('   IA JSON parse error, using raw text')
    return null
  }
}

// === RENDER TREND CELL ===
function renderTrend(pct, totalN, hasPrev) {
  if (totalN === 0) {
    return '<td style="padding:10px 8px;text-align:center;color:#dc2626;font-weight:700;">&#9660; inactivo</td>'
  }
  if (!hasPrev) {
    return '<td style="padding:10px 8px;text-align:center;color:#6b7280;">&#9644; nuevo</td>'
  }
  if (pct > 0) {
    return '<td style="padding:10px 8px;text-align:center;color:#059669;font-weight:700;">&#9650; +' + pct + '%</td>'
  } else if (pct < 0) {
    return '<td style="padding:10px 8px;text-align:center;color:#dc2626;font-weight:700;">&#9660; ' + pct + '%</td>'
  }
  return '<td style="padding:10px 8px;text-align:center;color:#6b7280;">&#9644; =</td>'
}

// === EMAIL HTML v5 ===
function generarEmailHTML(posts, cuentas, fecha, modo, resumenIA, empresas, trends, subId, contenidoSugerido, estado, plan, trialEnds, grillaMensual, guionesData, ideasData, auditoriaData) {
  contenidoSugerido = contenidoSugerido || []
  grillaMensual = grillaMensual || null
  guionesData = guionesData || null
  ideasData = ideasData || null
  auditoriaData = auditoriaData || null
  estado = estado || 'trial'
  plan = plan || 'starter'
  var fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  var titulo = modo === 'mensual' ? 'Resumen mensual Copilot' : modo === 'semanal' ? 'Resumen semanal Copilot' : 'Tu Copilot diario'
  var ventanaLabel = modo === 'diario' ? '72 horas' : modo === 'semanal' ? '7 días' : '30 días'
  var totalLikes = posts.reduce(function(s, p) { return s + p.likes }, 0)
  var redesActivas = Array.from(new Set(posts.map(function(p) { return p.red }))).length
  var nEmpresas = Object.keys(empresas).length

  var igPosts = posts.filter(function(p) { return p.red === 'Instagram' })
  var liPosts = posts.filter(function(p) { return p.red === 'LinkedIn' })
  var fbPosts = posts.filter(function(p) { return p.red === 'Facebook' })
  var prPosts = posts.filter(function(p) { return p.red === 'Prensa' })
  var prensaKws = (cuentas.find(function(c) { return c.red === 'prensa' }) || {}).keywords || []

  var ia = parseIAResponse(resumenIA)

  var h = ''
  h += '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;color:#1a1a1a;">'

  // HEADER
  h += '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:30px 32px;border-radius:16px 16px 0 0;">'
  h += '<table style="width:100%;"><tr>'
  h += '<td style="vertical-align:top;">'
  h += '<p style="margin:0;font-size:12px;opacity:0.7;letter-spacing:1px;">M&P COPILOT</p>'
  h += '<h1 style="margin:8px 0 4px;font-size:26px;font-weight:800;">' + titulo + '</h1>'
  h += '<p style="margin:0;font-size:14px;opacity:0.9;">' + fechaLegible + '</p>'
  h += '</td>'
  h += '<td style="vertical-align:top;text-align:right;width:200px;">'
  h += '<div style="display:inline-block;background:rgba(255,255,255,0.12);padding:6px 14px;border-radius:8px;margin-bottom:4px;">'
  h += '<span style="font-size:11px;opacity:0.7;">Ventana</span><br>'
  h += '<span style="font-size:14px;font-weight:700;">' + ventanaLabel + '</span>'
  h += '</div></td></tr></table>'
  // KPI boxes
  h += '<table style="margin-top:18px;width:100%;border-collapse:separate;border-spacing:8px 0;"><tr>'
  h += '<td style="background:rgba(255,255,255,0.12);padding:12px 0;border-radius:10px;text-align:center;width:25%;"><div style="font-size:28px;font-weight:800;">' + posts.length + '</div><div style="font-size:10px;opacity:0.7;margin-top:2px;">Posts</div></td>'
  h += '<td style="background:rgba(255,255,255,0.12);padding:12px 0;border-radius:10px;text-align:center;width:25%;"><div style="font-size:28px;font-weight:800;">' + redesActivas + '</div><div style="font-size:10px;opacity:0.7;margin-top:2px;">Redes activas</div></td>'
  h += '<td style="background:rgba(255,255,255,0.12);padding:12px 0;border-radius:10px;text-align:center;width:25%;"><div style="font-size:28px;font-weight:800;">' + totalLikes.toLocaleString() + '</div><div style="font-size:10px;opacity:0.7;margin-top:2px;">Likes total</div></td>'
  h += '<td style="background:rgba(255,255,255,0.12);padding:12px 0;border-radius:10px;text-align:center;width:25%;"><div style="font-size:28px;font-weight:800;">' + nEmpresas + '</div><div style="font-size:10px;opacity:0.7;margin-top:2px;">Empresas</div></td>'
  h += '</tr></table></div>'

  // AI SECTION
  h += '<div style="background:white;padding:24px 28px;border-bottom:1px solid #e5e7eb;">'
  h += '<table style="margin-bottom:14px;"><tr>'
  h += '<td style="vertical-align:middle;"><div style="background:#4338CA;color:white;width:28px;height:28px;border-radius:8px;text-align:center;line-height:28px;font-size:14px;">AI</div></td>'
  h += '<td style="vertical-align:middle;padding-left:8px;"><p style="font-weight:700;color:#1e1b4b;font-size:15px;margin:0;">Análisis inteligente</p></td>'
  h += '</tr></table>'

  if (ia) {
    // Contexto de mercado box
    if (ia.contexto) {
      h += '<div style="background:#f5f3ff;padding:16px 20px;border-radius:12px;border:1px solid #e9e5ff;margin-bottom:12px;">'
      h += '<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6d28d9;letter-spacing:0.5px;">CONTEXTO DE MERCADO</p>'
      h += '<p style="margin:0;font-size:13px;color:#4c1d95;line-height:1.6;">' + ia.contexto + '</p></div>'
    }
    // Per-empresa badges
    h += '<div style="font-size:13px;color:#312E81;line-height:1.7;">'
    if (ia.empresas && ia.empresas.length > 0) {
      for (var ei = 0; ei < ia.empresas.length; ei++) {
        var emp = ia.empresas[ei]
        var badgeColor = '#dcfce7'
        var badgeText = '#166534'
        if (emp.badge === 'yellow') { badgeColor = '#fef9c3'; badgeText = '#854d0e' }
        else if (emp.badge === 'red') { badgeColor = '#fee2e2'; badgeText = '#991b1b' }
        h += '<p style="margin:0 0 10px;"><span style="background:' + badgeColor + ';color:' + badgeText + ';padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">' + emp.nombre + '</span> ' + emp.texto + '</p>'
      }
    }
    // Oportunidad
    if (ia.oportunidad) {
      h += '<p style="margin:0 0 10px;"><span style="background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Oportunidad</span> ' + ia.oportunidad + '</p>'
    }
    // Alerta
    if (ia.alerta) {
      h += '<p style="margin:0;"><span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Alerta</span> ' + ia.alerta + '</p>'
    }
    h += '</div>'
  } else if (resumenIA) {
    // Fallback: raw text
    h += '<div style="font-size:13px;color:#312E81;line-height:1.7;white-space:pre-line;">' + resumenIA + '</div>'
  }
  h += '</div>'

  // CTA PRINCIPAL (arriba, visible sin scroll)
  if (subId) {
    h += '<div style="background:white;padding:16px 28px;text-align:center;border-bottom:1px solid #e5e7eb;">'
    if (estado === 'trial') {
      var diasR = trialEnds ? Math.max(0, Math.ceil((new Date(trialEnds).getTime() - Date.now()) / (1000*60*60*24))) : 7
      h += '<span style="background:#fef3c7;padding:6px 14px;border-radius:8px;font-size:12px;color:#92400e;font-weight:600;">Prueba gratuita | ' + diasR + ' dias restantes</span> '
      h += '<a href="https://www.mulleryperez.cl/copilot/contratar/' + subId + '" style="display:inline-block;background:#4338CA;color:white;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;margin-left:8px;">Contrata tu plan</a>'
    } else {
      h += '<span style="background:#dcfce7;padding:6px 14px;border-radius:8px;font-size:12px;color:#166534;font-weight:600;">Plan ' + plan + '</span> '
      h += '<a href="https://www.mulleryperez.cl/copilot/configurar/' + subId + '" style="display:inline-block;background:#4338CA;color:white;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;margin-left:8px;">Configurar cuentas</a>'
    }
    h += '</div>'
  }

  // TABLA COMPARATIVA POR EMPRESA
  h += '<div style="background:white;padding:20px 28px;border-bottom:1px solid #e5e7eb;">'
  h += '<p style="font-weight:700;color:#0F172A;font-size:13px;margin:0 0 14px;letter-spacing:0.3px;">ACTIVIDAD POR EMPRESA</p>'
  h += '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
  h += '<tr style="background:#0F172A;color:white;">'
  h += '<th style="padding:10px 14px;text-align:left;font-weight:600;">Empresa</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;width:40px;">IG</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;width:40px;">LI</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;width:40px;">FB</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;width:50px;">Total</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;">Likes</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;">Eng.</th>'
  h += '<th style="padding:10px 8px;text-align:center;font-weight:600;">Trend</th>'
  h += '</tr>'
  var idx = 0
  Object.keys(empresas).forEach(function(nombre) {
    var emp = empresas[nombre]
    var empHandles = [emp.ig, emp.li, emp.fb].filter(Boolean)
    var empPosts = posts.filter(function(p) { return p.red !== 'Prensa' && empHandles.includes(p.handle) })
    var igN = empPosts.filter(function(p) { return p.red === 'Instagram' }).length
    var liN = empPosts.filter(function(p) { return p.red === 'LinkedIn' }).length
    var fbN = empPosts.filter(function(p) { return p.red === 'Facebook' }).length
    var totalN = empPosts.length
    var totalL = empPosts.reduce(function(s, p) { return s + p.likes }, 0)
    var totalC = empPosts.reduce(function(s, p) { return s + p.comments }, 0)
    var avgEng = totalN > 0 ? Math.round((totalL + totalC) / totalN) : 0
    var isInactive = totalN === 0
    var bg = isInactive ? '#fef2f2' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc')
    var nameColor = isInactive ? '#991b1b' : '#0F172A'
    var z = function(n) { return n === 0 ? '<span style="color:#d1d5db;">0</span>' : '<strong>' + n + '</strong>' }
    var t = trends[nombre] || { postsPct: 0, hasPrev: false }

    h += '<tr style="background:' + bg + ';border-bottom:1px solid #f1f5f9;">'
    h += '<td style="padding:12px 14px;font-weight:700;color:' + nameColor + ';">' + nombre + '</td>'
    h += '<td style="padding:10px 8px;text-align:center;">' + z(igN) + '</td>'
    h += '<td style="padding:10px 8px;text-align:center;">' + z(liN) + '</td>'
    h += '<td style="padding:10px 8px;text-align:center;">' + z(fbN) + '</td>'
    h += '<td style="padding:10px 8px;text-align:center;font-weight:800;' + (isInactive ? 'color:#991b1b;' : '') + '">' + totalN + '</td>'
    if (isInactive) {
      h += '<td style="padding:10px 8px;text-align:center;color:#d1d5db;">-</td>'
      h += '<td style="padding:10px 8px;text-align:center;color:#d1d5db;">-</td>'
    } else {
      h += '<td style="padding:10px 8px;text-align:center;">' + totalL.toLocaleString() + '</td>'
      h += '<td style="padding:10px 8px;text-align:center;">' + avgEng.toLocaleString() + '</td>'
    }
    h += renderTrend(t.postsPct, totalN, t.hasPrev)
    h += '</tr>'
    idx++
  })
  h += '</table></div>'

  // SECCIONES POR RED
  if (igPosts.length > 0) h += renderSeccion('Instagram', '#E4405F', igPosts)
  if (liPosts.length > 0) h += renderSeccion('LinkedIn', '#0A66C2', liPosts)
  if (fbPosts.length > 0) h += renderSeccion('Facebook', '#1877F2', fbPosts)
  if (prPosts.length > 0) {
    h += renderSeccionPrensa(prPosts, prensaKws)
  }

  if (posts.length === 0) {
    h += '<div style="background:white;padding:32px 28px;text-align:center;"><p style="color:#6b7280;">Sin publicaciones en el periodo.</p></div>'
  }

  // CONTENIDO SUGERIDO (semanal/mensual only)
  if (ia && ia.contenido_sugerido && ia.contenido_sugerido.length > 0 && (modo === 'semanal' || modo === 'mensual')) {
    h += '<div style="background:white;padding:22px 28px;border-top:4px solid #10b981;margin-top:3px;">'
    h += '<table style="width:100%;margin-bottom:16px;"><tr>'
    h += '<td><span style="background:#10b981;color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Contenido sugerido</span></td>'
    h += '<td style="text-align:right;font-size:12px;color:#6b7280;">' + ia.contenido_sugerido.length + ' ideas</td>'
    h += '</tr></table>'
    for (var ci = 0; ci < ia.contenido_sugerido.length; ci++) {
      var sug = ia.contenido_sugerido[ci]
      var redBadge = sug.red || 'General'
      var redColor = '#6b7280'
      if (redBadge === 'Instagram') redColor = '#E4405F'
      else if (redBadge === 'LinkedIn') redColor = '#0A66C2'
      else if (redBadge === 'Facebook') redColor = '#1877F2'
      h += '<div style="padding:16px;background:#f0fdf4;border-radius:12px;border-left:4px solid #10b981;margin-bottom:8px;">'
      h += '<table style="width:100%;margin-bottom:8px;"><tr>'
      h += '<td><strong style="font-size:14px;color:#064e3b;">' + (sug.titulo || 'Idea ' + (ci + 1)) + '</strong></td>'
      h += '<td style="text-align:right;"><span style="background:' + redColor + ';color:white;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;">' + redBadge + '</span></td>'
      h += '</tr></table>'
      h += '<p style="margin:0;font-size:13px;color:#1f2937;line-height:1.65;">' + (sug.descripcion || '') + '</p>'
      h += '</div>'
    }
    h += '</div>'
  }

  // CONTENIDO SUGERIDO (pipeline 3 agentes)
  if (contenidoSugerido.length > 0) {
    h += '<div style="background:white;padding:22px 28px;border-top:4px solid #10b981;margin-top:3px;">'
    h += '<table style="width:100%;margin-bottom:16px;"><tr><td><span style="background:#10b981;color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Contenido sugerido</span></td>'
    h += '<td style="text-align:right;font-size:11px;color:#6b7280;">' + contenidoSugerido.length + ' ideas con copy listo | OpenAI + Claude + QA</td></tr></table>'
    for (var ci = 0; ci < contenidoSugerido.length; ci++) {
      var cs = contenidoSugerido[ci]
      var pColor = cs.plataforma === 'Instagram' ? '#E4405F' : cs.plataforma === 'LinkedIn' ? '#0A66C2' : '#1877F2'
      h += '<div style="padding:18px;background:#f0fdf4;border-radius:12px;border-left:4px solid #10b981;margin-bottom:12px;">'
      h += '<table style="width:100%;margin-bottom:8px;font-size:11px;"><tr>'
      h += '<td><span style="background:' + pColor + ';color:white;padding:2px 8px;border-radius:4px;font-weight:600;">' + cs.plataforma + ' ' + cs.tipo + '</span></td>'
      h += '<td style="text-align:right;"><span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-weight:600;">' + cs.angulo + '</span> '
      h += '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-weight:600;">' + cs.objetivo + '</span>'
      if (cs.score) h += ' <span style="background:' + (cs.score >= 80 ? '#dcfce7;color:#166534' : '#fef3c7;color:#92400e') + ';padding:2px 8px;border-radius:4px;font-weight:600;">Score: ' + cs.score + '</span>'
      h += '</td></tr></table>'
      h += '<p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0F172A;">' + (cs.titulo || '') + '</p>'
      h += '<div style="background:white;padding:14px;border-radius:8px;border:1px solid #d1fae5;margin-bottom:8px;">'
      h += '<p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#059669;letter-spacing:0.5px;">COPY LISTO PARA PUBLICAR</p>'
      h += '<p style="margin:0;font-size:13px;color:#374151;line-height:1.7;white-space:pre-line;">' + (cs.copy || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>'
      h += '</div>'
      if (cs.justificacion) {
        h += '<p style="margin:0;font-size:12px;color:#059669;line-height:1.5;"><strong>Por que funciona:</strong> ' + cs.justificacion + '</p>'
      }
      if (cs.fixed) h += '<p style="margin:4px 0 0;font-size:10px;color:#d97706;">* Copy corregido automaticamente por QA</p>'
      h += '</div>'
    }
    h += '</div>'
  }

  // GRILLA MENSUAL (solo plan business, solo modo mensual)
  if (grillaMensual && grillaMensual.posts && grillaMensual.posts.length > 0) {
    h += '<div style="background:white;padding:22px 28px;border-top:4px solid #8b5cf6;margin-top:3px;">'
    h += '<table style="width:100%;margin-bottom:16px;"><tr><td><span style="background:#8b5cf6;color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Grilla mensual</span></td>'
    h += '<td style="text-align:right;font-size:11px;color:#6b7280;">' + grillaMensual.posts.length + ' posts | Calendario ' + (grillaMensual.mes || '') + '</td></tr></table>'
    for (var gi = 0; gi < grillaMensual.posts.length; gi++) {
      var gp = grillaMensual.posts[gi]
      var gpColor = (gp.plataforma || '').includes('Instagram') ? '#E4405F' : (gp.plataforma || '').includes('LinkedIn') ? '#0A66C2' : '#1877F2'
      h += '<div style="padding:14px;background:#f5f3ff;border-radius:10px;border-left:4px solid #8b5cf6;margin-bottom:10px;">'
      h += '<table style="width:100%;margin-bottom:6px;font-size:11px;"><tr>'
      h += '<td><span style="background:' + gpColor + ';color:white;padding:2px 8px;border-radius:4px;font-weight:600;">' + (gp.plataforma || 'IG') + '</span>'
      h += ' <span style="color:#6b7280;">' + (gp.fecha_sugerida || 'Dia ' + (gi + 1)) + '</span></td>'
      h += '<td style="text-align:right;"><span style="background:#ede9fe;color:#5b21b6;padding:2px 8px;border-radius:4px;font-weight:600;">' + (gp.tipo_post || 'Post') + '</span></td>'
      h += '</tr></table>'
      h += '<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#0F172A;">' + (gp.titulo || '') + '</p>'
      h += '<div style="background:white;padding:12px;border-radius:8px;border:1px solid #ddd6fe;margin-bottom:6px;">'
      h += '<p style="margin:0 0 3px;font-size:10px;font-weight:700;color:#7c3aed;letter-spacing:0.5px;">COPY</p>'
      h += '<p style="margin:0;font-size:12px;color:#374151;line-height:1.6;white-space:pre-line;">' + (gp.copy || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>'
      h += '</div>'
      if (gp.nota_diseno) h += '<p style="margin:0;font-size:11px;color:#7c3aed;">Diseno: ' + gp.nota_diseno + '</p>'
      h += '</div>'
    }
    h += '</div>'
  }

  // GUIONES DE REELS (semanal/mensual, si hay data)
  if (guionesData && guionesData.length > 0 && (modo === 'semanal' || modo === 'mensual')) {
    var maxGuiones = Math.min(guionesData.length, 3)
    h += '<div style="background:white;padding:22px 28px;border-top:4px solid #E4405F;margin-top:3px;">'
    h += '<table style="width:100%;margin-bottom:16px;"><tr><td><span style="background:#E4405F;color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Guiones de reels</span></td>'
    h += '<td style="text-align:right;font-size:12px;color:#6b7280;">' + maxGuiones + ' guiones</td></tr></table>'
    for (var gui = 0; gui < maxGuiones; gui++) {
      var guion = guionesData[gui]
      var durColor = (guion.duracion || '30s') === '15s' ? '#10b981' : (guion.duracion || '30s') === '60s' ? '#dc2626' : '#f59e0b'
      var tipoGuion = guion.tipo || 'Reel'
      h += '<div style="padding:16px;background:#fff1f2;border-radius:12px;border-left:4px solid #E4405F;margin-bottom:10px;">'
      h += '<table style="width:100%;margin-bottom:10px;"><tr><td>'
      h += '<span style="background:' + durColor + ';color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">' + (guion.duracion || '30s') + '</span> '
      h += '<span style="background:#fecdd3;color:#9f1239;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">' + tipoGuion + '</span>'
      h += '</td></tr></table>'
      if (guion.gancho) {
        h += '<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#9f1239;">Gancho: ' + guion.gancho + '</p>'
      }
      if (guion.desarrollo) {
        var devPreview = guion.desarrollo.length > 100 ? guion.desarrollo.substring(0, 100) + '...' : guion.desarrollo
        h += '<p style="margin:0 0 6px;font-size:13px;color:#1f2937;line-height:1.6;">' + devPreview + '</p>'
      }
      if (guion.cierre) {
        h += '<p style="margin:0 0 6px;font-size:13px;color:#1f2937;"><strong>CTA:</strong> ' + guion.cierre + '</p>'
      }
      if (guion.visual) {
        h += '<p style="margin:0;font-size:12px;color:#9ca3af;font-style:italic;">Visual: ' + guion.visual + '</p>'
      }
      h += '</div>'
    }
    h += '</div>'
  }

  // BANCO DE IDEAS (semanal/mensual, si hay data)
  if (ideasData && ideasData.length > 0 && (modo === 'semanal' || modo === 'mensual')) {
    var maxIdeas = Math.min(ideasData.length, 5)
    h += '<div style="background:white;padding:22px 28px;border-top:4px solid #F59E0B;margin-top:3px;">'
    h += '<table style="width:100%;margin-bottom:16px;"><tr><td><span style="background:#F59E0B;color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Ideas para tu contenido</span></td>'
    h += '<td style="text-align:right;font-size:12px;color:#6b7280;">' + maxIdeas + ' ideas</td></tr></table>'
    for (var idi = 0; idi < maxIdeas; idi++) {
      var idea = ideasData[idi]
      var catMap = { educativo: { bg: '#e0e7ff', color: '#3730a3' }, entretenimiento: { bg: '#fce7f3', color: '#9d174d' }, producto: { bg: '#dcfce7', color: '#166534' }, testimonial: { bg: '#fef3c7', color: '#92400e' }, tendencia: { bg: '#f3e8ff', color: '#6b21a8' } }
      var catStyle = catMap[(idea.categoria || '').toLowerCase()] || { bg: '#f3f4f6', color: '#374151' }
      var prioMap = { alta: '#dc2626', media: '#f59e0b', baja: '#9ca3af' }
      var prioColor = prioMap[(idea.prioridad || '').toLowerCase()] || '#9ca3af'
      h += '<div style="padding:14px;background:#fffbeb;border-radius:12px;border-left:4px solid #F59E0B;margin-bottom:8px;">'
      h += '<table style="width:100%;margin-bottom:6px;"><tr><td>'
      h += '<span style="background:' + catStyle.bg + ';color:' + catStyle.color + ';padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">' + (idea.categoria || 'General') + '</span>'
      h += ' <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + prioColor + ';vertical-align:middle;margin-left:6px;"></span>'
      h += '</td></tr></table>'
      h += '<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0F172A;">' + (idea.titulo || 'Idea ' + (idi + 1)) + '</p>'
      if (idea.descripcion) {
        h += '<p style="margin:0;font-size:13px;color:#1f2937;line-height:1.6;">' + idea.descripcion + '</p>'
      }
      h += '</div>'
    }
    h += '</div>'
  }

  // AUDITORIA MENSUAL (solo mensual, si hay data)
  if (auditoriaData && modo === 'mensual') {
    var scoreColor = auditoriaData.score >= 75 ? '#059669' : auditoriaData.score >= 50 ? '#d97706' : '#dc2626'
    var scoreBg = auditoriaData.score >= 75 ? '#dcfce7' : auditoriaData.score >= 50 ? '#fef3c7' : '#fee2e2'
    h += '<div style="background:white;padding:22px 28px;border-top:4px solid #6366F1;margin-top:3px;">'
    h += '<table style="width:100%;margin-bottom:16px;"><tr><td><span style="background:#6366F1;color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Auditoría mensual de tu marca</span></td></tr></table>'
    // Score principal
    h += '<div style="text-align:center;margin-bottom:18px;">'
    h += '<div style="display:inline-block;background:' + scoreBg + ';padding:20px 32px;border-radius:16px;">'
    h += '<div style="font-size:48px;font-weight:800;color:' + scoreColor + ';">' + (auditoriaData.score || 0) + '</div>'
    h += '<div style="font-size:12px;color:#6b7280;margin-top:4px;">Puntaje general</div>'
    h += '</div></div>'
    // Mini bars por red
    var redes = [
      { nombre: 'Instagram', valor: auditoriaData.instagram || 0, color: '#E4405F' },
      { nombre: 'LinkedIn', valor: auditoriaData.linkedin || 0, color: '#0A66C2' },
      { nombre: 'Facebook', valor: auditoriaData.facebook || 0, color: '#1877F2' }
    ]
    h += '<table style="width:100%;margin-bottom:16px;border-collapse:separate;border-spacing:8px 0;"><tr>'
    for (var ri = 0; ri < redes.length; ri++) {
      var red = redes[ri]
      h += '<td style="background:#f8fafc;padding:12px;border-radius:10px;text-align:center;width:33%;">'
      h += '<div style="font-size:11px;color:#6b7280;margin-bottom:4px;">' + red.nombre + '</div>'
      h += '<div style="background:#e5e7eb;border-radius:4px;height:8px;overflow:hidden;"><div style="background:' + red.color + ';height:100%;width:' + Math.min(red.valor, 100) + '%;border-radius:4px;"></div></div>'
      h += '<div style="font-size:14px;font-weight:700;color:#0F172A;margin-top:4px;">' + red.valor + '</div>'
      h += '</td>'
    }
    h += '</tr></table>'
    // Fortaleza y debilidad
    if (auditoriaData.fortaleza) {
      h += '<div style="background:#dcfce7;padding:12px 16px;border-radius:10px;margin-bottom:8px;">'
      h += '<p style="margin:0;font-size:12px;"><span style="font-weight:700;color:#166534;">Fortaleza principal:</span> <span style="color:#1f2937;">' + auditoriaData.fortaleza + '</span></p></div>'
    }
    if (auditoriaData.debilidad) {
      h += '<div style="background:#fee2e2;padding:12px 16px;border-radius:10px;">'
      h += '<p style="margin:0;font-size:12px;"><span style="font-weight:700;color:#991b1b;">Área de mejora:</span> <span style="color:#1f2937;">' + auditoriaData.debilidad + '</span></p></div>'
    }
    h += '</div>'
  }

  // DASHBOARD LINK
  if (subId) {
    h += '<div style="background:white;padding:18px 28px;text-align:center;border-bottom:1px solid #e5e7eb;">'
    if (estado === 'trial') {
      // Trial: CTA principal es contratar
      var diasRestantes = trialEnds ? Math.max(0, Math.ceil((new Date(trialEnds).getTime() - Date.now()) / (1000*60*60*24))) : 7
      h += '<div style="background:#fef3c7;padding:8px 16px;border-radius:8px;margin-bottom:12px;display:inline-block;"><span style="font-size:12px;color:#92400e;font-weight:600;">Prueba gratuita | ' + diasRestantes + ' dias restantes</span></div><br>'
      h += '<a href="https://www.mulleryperez.cl/copilot/contratar/' + subId + '" style="display:inline-block;background:#4338CA;color:white;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">Contrata tu plan →</a>'
      h += '<p style="margin:8px 0 0;font-size:11px;color:#9ca3af;"><a href="https://www.mulleryperez.cl/copilot/dashboard/' + subId + '" style="color:#6366f1;text-decoration:none;">Ver dashboard</a></p>'
    } else {
      // Activo: CTA principal es configurar cuentas
      h += '<div style="background:#dcfce7;padding:8px 16px;border-radius:8px;margin-bottom:12px;display:inline-block;"><span style="font-size:12px;color:#166534;font-weight:600;">Plan ' + plan + '</span></div><br>'
      h += '<a href="https://www.mulleryperez.cl/copilot/configurar/' + subId + '" style="display:inline-block;background:#4338CA;color:white;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">Configurar cuentas →</a>'
      h += '<p style="margin:8px 0 0;font-size:11px;color:#9ca3af;"><a href="https://www.mulleryperez.cl/copilot/dashboard/' + subId + '" style="color:#6366f1;text-decoration:none;">Ver dashboard</a></p>'
    }
    h += '</div>'
  }

  // FOOTER
  h += '<div style="padding:20px 28px;background:#1e1b4b;border-radius:0 0 16px 16px;text-align:center;">'
  h += '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">Copilot by <strong style="color:white;">Muller y Pérez</strong> | '
  h += modo === 'diario' ? 'Informe diario 7:30 AM' : modo === 'semanal' ? 'Resumen semanal, lunes 9 AM' : 'Resumen mensual, 1ro de cada mes'
  h += '</p>'
  var planIncluye = plan === 'business' ? 'Todo incluido: informes + copies + grilla + guiones + auditoría + reporte'
    : plan === 'pro' ? 'Informe diario + copies + grilla mensual'
    : 'Informe diario + copies semanales'
  h += '<p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.5);">' + planIncluye + '</p>'
  h += '<p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">mulleryperez.cl/copilot | Responde este email para ajustar cuentas</p></div></div>'
  return h
}

function renderSeccion(red, color, posts) {
  var porNombre = new Map()
  posts.forEach(function(p) { var n = p.nombre || p.handle; if (!porNombre.has(n)) porNombre.set(n, []); porNombre.get(n).push(p) })

  var h = '<div style="background:white;padding:22px 28px;border-top:4px solid ' + color + ';margin-top:3px;">'
  h += '<table style="width:100%;margin-bottom:16px;"><tr>'
  h += '<td><span style="background:' + color + ';color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">' + red + '</span></td>'
  h += '<td style="text-align:right;font-size:12px;color:#6b7280;">' + posts.length + ' posts | ' + porNombre.size + ' empresa' + (porNombre.size > 1 ? 's' : '') + '</td>'
  h += '</tr></table>'

  porNombre.forEach(function(hPosts, nombre) {
    var handle = hPosts[0].handle
    h += '<div style="margin-bottom:18px;">'
    h += '<table style="width:100%;margin-bottom:10px;"><tr>'
    h += '<td><span style="font-weight:800;font-size:15px;color:#0F172A;">' + nombre + '</span> <span style="font-size:11px;color:#9ca3af;">@' + handle + '</span></td>'
    h += '<td style="text-align:right;"><span style="background:#dcfce7;color:#166534;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;">' + hPosts.length + ' posts</span></td>'
    h += '</tr></table>'
    hPosts.forEach(function(p) {
      var preview = p.texto.substring(0, 250).replace(/\n/g, ' ')
      var isHigh = p.likes > 500
      h += '<div style="padding:16px;background:#fafafa;border-radius:12px;border-left:4px solid ' + (isHigh ? '#dc2626' : color) + ';margin-bottom:8px;">'
      h += '<p style="margin:0 0 10px;font-size:13px;color:#1f2937;line-height:1.65;">' + preview + (p.texto.length > 250 ? '...' : '') + '</p>'
      h += '<table style="width:100%;font-size:12px;color:#6b7280;"><tr>'
      h += '<td>'
      h += '<span style="color:' + (isHigh ? '#dc2626' : '#1f2937') + ';font-weight:' + (isHigh ? '700' : '600') + ';">' + p.likes.toLocaleString() + ' likes</span>'
      h += ' &nbsp; ' + p.comments.toLocaleString() + ' comentarios'
      if (isHigh) h += ' &nbsp; <span style="background:#fee2e2;color:#dc2626;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;">Alto engagement</span>'
      h += '</td><td style="text-align:right;">'
      h += '<span style="background:#f3e8ff;color:#7c3aed;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;">' + p.type + '</span>'
      if (p.url) h += ' &nbsp; <a href="' + p.url + '" style="color:' + color + ';font-weight:600;text-decoration:none;">Ver →</a>'
      h += '</td></tr></table></div>'
    })
    h += '</div>'
  })
  h += '</div>'
  return h
}

function renderSeccionPrensa(posts, prensaKws) {
  var porNombre = new Map()
  posts.forEach(function(p) { var n = p.nombre || p.handle; if (!porNombre.has(n)) porNombre.set(n, []); porNombre.get(n).push(p) })

  var color = '#d97706'
  var h = '<div style="background:white;padding:22px 28px;border-top:4px solid ' + color + ';margin-top:3px;">'
  h += '<table style="width:100%;margin-bottom:16px;"><tr>'
  h += '<td><span style="background:' + color + ';color:white;padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;">Prensa y medios</span></td>'
  h += '<td style="text-align:right;font-size:12px;color:#6b7280;">' + posts.length + ' menciones encontradas</td>'
  h += '</tr></table>'

  porNombre.forEach(function(hPosts, nombre) {
    var handle = hPosts[0].handle
    h += '<div style="margin-bottom:18px;">'
    h += '<table style="width:100%;margin-bottom:10px;"><tr>'
    h += '<td><span style="font-weight:800;font-size:15px;color:#0F172A;">' + nombre + '</span> <span style="font-size:11px;color:#9ca3af;">@' + handle + '</span></td>'
    h += '</tr></table>'
    hPosts.forEach(function(p) {
      var preview = p.texto.substring(0, 250).replace(/\n/g, ' ')
      var isHigh = p.likes > 500
      h += '<div style="padding:16px;background:#fffbeb;border-radius:12px;border-left:4px solid ' + color + ';margin-bottom:8px;">'
      h += '<p style="margin:0 0 10px;font-size:13px;color:#1f2937;line-height:1.65;">' + preview + (p.texto.length > 250 ? '...' : '') + '</p>'
      h += '<table style="width:100%;font-size:12px;color:#6b7280;"><tr>'
      h += '<td>'
      h += '<span style="color:' + (isHigh ? '#dc2626' : '#1f2937') + ';font-weight:' + (isHigh ? '700' : '600') + ';">' + p.likes.toLocaleString() + ' likes</span>'
      h += ' &nbsp; ' + p.comments.toLocaleString() + ' comentarios'
      if (isHigh) h += ' &nbsp; <span style="background:#fee2e2;color:#dc2626;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;">Alto engagement</span>'
      if (p.keywords && p.keywords.length > 0) h += ' &nbsp; <span style="background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;">Menciona: ' + p.keywords.join(', ') + '</span>'
      h += '</td></tr><tr><td style="padding-top:6px;">'
      if (p.url) h += '<a href="' + p.url + '" style="color:' + color + ';font-weight:600;text-decoration:none;">Ver →</a>'
      h += '</td></tr></table></div>'
    })
    h += '</div>'
  })

  // Medios box
  h += '<div style="background:#fefce8;padding:14px 18px;border-radius:10px;border:1px solid #fde68a;margin-top:14px;">'
  h += '<p style="margin:0 0 4px;font-size:11px;color:#854d0e;"><strong>Medios analizados (' + MEDIOS_PRENSA.length + '):</strong> ' + MEDIOS_PRENSA.map(function(m) { return m.nombre }).join(', ') + '</p>'
  h += '<p style="margin:0;font-size:11px;color:#854d0e;"><strong>Keywords:</strong> ' + prensaKws.join(', ') + '</p></div>'
  h += '</div>'
  return h
}

// === PDF ===
function generarPDF(html, fecha, modo) {
  var tmpH = '/tmp/radar-' + fecha + '-' + modo + '.html'
  var tmpP = '/tmp/radar-' + fecha + '-' + modo + '.pdf'
  fs.writeFileSync(tmpH, '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:20px;background:#eef0f4;font-family:-apple-system,Helvetica,Arial,sans-serif;}</style></head><body>' + html + '</body></html>')
  try {
    childProcess.execSync('wkhtmltopdf --quiet --enable-local-file-access --page-size A4 --margin-top 10 --margin-bottom 10 --margin-left 10 --margin-right 10 "' + tmpH + '" "' + tmpP + '"', { timeout: 30000 })
    var buf = fs.readFileSync(tmpP)
    console.log('   PDF: ' + (buf.length / 1024).toFixed(0) + ' KB')
    return buf.toString('base64')
  } catch (e) { console.error('   PDF: ' + e.message); return null }
}

// === EXCEL GRILLA ===
function generarExcel(grilla, nombre, fecha) {
  try {
    var XLSX = require('xlsx')
    var rows = grilla.map(function(g, i) {
      return {
        '#': i + 1,
        'Fecha': g.fecha_sugerida || g.dia_semana || ('Dia ' + (g.dia || i + 1)),
        'Plataforma': g.plataforma || '',
        'Tipo': g.tipo_post || g.tipo || '',
        'Angulo': g.angulo || '',
        'Titulo': g.titulo || g.titulo_grafico || g.gancho || '',
        'Copy': g.copy || '',
        'Hashtags': g.hashtags || '',
        'Nota diseno': g.nota_diseno || '',
        'Score': g.score || '',
      }
    })
    var wb = XLSX.utils.book_new()
    var ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 4 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 60 }, { wch: 30 }, { wch: 25 }, { wch: 8 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Grilla')
    var buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    console.log('   Excel: ' + (buf.length / 1024).toFixed(0) + ' KB, ' + rows.length + ' posts')
    return buf.toString('base64')
  } catch (e) { console.error('   Excel: ' + e.message); return null }
}

// === ENVIAR ===
async function enviarEmail(destinos, html, fecha, nPosts, modo, pdf, excel, nombreCliente) {
  var titulo = modo === 'mensual' ? 'Resumen mensual Copilot' : modo === 'semanal' ? 'Resumen semanal Copilot' : 'Tu Copilot diario'
  var asunto = (nombreCliente ? nombreCliente + ' | ' : '') + titulo + ' | ' + nPosts + ' posts | ' + fecha
  var body = { from: 'Copilot <contacto@mulleryperez.cl>', to: destinos,
    subject: asunto, html: html }
  var attachments = []
  if (pdf) attachments.push({ filename: 'Copilot_' + modo + '_' + fecha + '.pdf', content: pdf })
  if (excel) attachments.push({ filename: 'Grilla_' + fecha + '.xlsx', content: excel })
  if (attachments.length > 0) body.attachments = attachments
  try {
    var r = await fetch('https://api.resend.com/emails', { method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body) })
    var d = await r.json()
    if (!r.ok) console.error('   Email error:', d)
    else console.log('   Email: ' + destinos.join(',') + ' ' + d.id + (pdf ? ' +PDF' : '') + (excel ? ' +Excel' : ''))
  } catch (e) { console.error('   Resend: ' + e.message) }
}

main().catch(function(e) { console.error(e); process.exit(1) })
