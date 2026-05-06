// radar-clipping.js v7 — Orquestador con sistema de memoria y aprendizaje
// Pipeline: Scraping → Memoria → Brief → Contenido → Grilla → Guiones → Auditoría → Email
// Cada agente recibe brief + memoria + datos de agentes previos
// Modo: --diario | --semanal | --mensual | --dry-run
//
// ═══════════════════════════════════════════════════════════════════
// PLAN DE UPGRADES (en orden de impacto, pendientes)
// ═══════════════════════════════════════════════════════════════════
//
// UPGRADE 1: LinkedIn scraping [BLOQUEADO — no hay actor funcional]
//   - harvestapi devuelve 0, apimaestro devuelve posts falsos de Google
//   - Alternativas: LinkedIn API oficial (requiere app review), Proxycurl ($), Phantombuster ($)
//   - Impacto: CRITICO para clientes B2B (Genera HR, consultoras, etc.)
//   - Accion: evaluar Proxycurl ($0.01/perfil) o LinkedIn API con app de M&P
//
// UPGRADE 2: Auditoría en modo semanal (no solo mensual)
//   - Actualmente solo corre en --mensual
//   - En semanal, no hay feedback loop auditoría→brief
//   - Fix: agregar flag para correr auditoria light (sin criterios que necesitan 30 días)
//   - Impacto: feedback loop más rápido
//
// UPGRADE 3: QA de grilla más estricto
//   - Score grilla parte en 100 vs copies que parte en 85
//   - Grilla no tiene penalties por CTA genérico ni hook sin dato
//   - Fix: unificar scoring de grilla con el scoring de copies (paso3_revisar)
//   - Impacto: grilla de calidad real, no inflada
//
// UPGRADE 4: Email con preview de copy completo (no solo título)
//   - Actualmente solo muestra título + plataforma + score
//   - El cliente tiene que abrir el Excel para leer el copy
//   - Fix: mostrar primeras 2-3 líneas del copy en el email
//   - Impacto: el cliente ve valor inmediato sin abrir adjunto
//
// UPGRADE 5: Dashboard — edición inline de copies/brief
//   - El cliente puede ver pero no editar
//   - Fix: formulario de edición de brief (territorios, tono, reglas)
//   - Impacto: el cliente personaliza su estrategia
//
// UPGRADE 6: Notificación cuando ideas se aprueban
//   - El pipeline lee ideas aprobadas pero no notifica al equipo M&P
//   - Fix: email a contacto@mulleryperez.cl cuando un cliente aprueba una idea
//   - Impacto: M&P sabe qué contenido crear
//
// UPGRADE 7: Reporte PDF ejecutivo con diseño premium
//   - Actual: wkhtmltopdf del HTML del email (básico)
//   - Fix: template Puppeteer A4 con gráficos, scores visuales, comparativas
//   - Impacto: valor percibido alto, justifica precio
//
// UPGRADE 8: Flow.cl pagos integrados
//   - Ya existe la ruta /copilot/contratar/{id} pero no cobra
//   - Fix: integrar Flow.cl con webhook de confirmación
//   - Impacto: revenue directo
//
// UPGRADE 9: Crons activados (producción)
//   - Todos los crons están comentados
//   - Activar cuando: QA E2E pase 100%, cliente confirme calidad
//   - Diario 7:30 AM, Semanal lunes 9 AM, Mensual día 1 9 AM
//
// UPGRADE 10: Multi-idioma / Multi-país
//   - Actualmente solo Chile (fechas, estacionalidad, hashtags)
//   - Fix: config por suscriptor con país/idioma
//   - Impacto: expansión LATAM
// ═══════════════════════════════════════════════════════════════════

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')
var fs = require('fs')
var childProcess = require('child_process')
var contenidoModule = require('./radar-contenido.js')
var grillaModule = require('./radar-grilla-mensual.js')
var perfilModule = require('./radar-perfil.js')
var guionesModule = require('./radar-guiones.js')
var auditoriaModule = require('./radar-auditoria.js')
var briefModule = require('./radar-brief.js')
var memoriaModule = require('./radar-memoria.js')
var decisionModule = require('./radar-decisiones.js')
var benchmarkModule = require('./radar-benchmark.js')
var campanaModule = require('./radar-campana.js')
var adsCreativeModule = require('./radar-ads-creative.js')
var memoriaPersistenteModule = require('./radar-memoria-persistente.js')
var metaAdLibraryModule = require('./radar-meta-adlibrary.js')
var arbolDecisionModule = require('./radar-arbol-decision.js')
var reporteModule = require('./radar-reporte.js')
var linkedinApiModule = require('./radar-linkedin-api.js')

var APIFY_TOKEN = process.env.APIFY_TOKEN
var LINKDAPI_KEY = process.env.LINKDAPI_KEY
var RESEND_KEY = process.env.RESEND
var OPENAI_KEY = process.env.OPENAI_API_KEY
var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS
var supabase = supabaseLib.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ═══ RETRY INTELIGENTE ═══
// Reintenta agentes que fallan 1 vez con backoff, notifica si falla 2 veces
var agenteFallos = [] // acumula fallos para notificación al final
async function ejecutarConRetry(nombreAgente, fn, maxRetries) {
  maxRetries = maxRetries || 1
  for (var intento = 0; intento <= maxRetries; intento++) {
    try {
      var resultado = await fn()
      return resultado
    } catch (e) {
      if (intento < maxRetries) {
        console.log('   ⚠️ ' + nombreAgente + ' falló (intento ' + (intento + 1) + '/' + (maxRetries + 1) + '): ' + e.message)
        console.log('   Reintentando en 3s...')
        await new Promise(function(r) { setTimeout(r, 3000) })
      } else {
        console.log('   ❌ ' + nombreAgente + ' falló después de ' + (maxRetries + 1) + ' intentos: ' + e.message)
        agenteFallos.push({ agente: nombreAgente, error: e.message, timestamp: new Date().toISOString() })
        return null
      }
    }
  }
}

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
  var igSet = new Set(), liSet = new Set(), prensaKws = []
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
      var redLower = (c.red || '').toLowerCase()
      if (redLower === 'instagram') igSet.add(c.handle.toLowerCase())
      else if (redLower === 'linkedin') liSet.add(c.handle.toLowerCase())
      else if (redLower === 'prensa' && c.keywords) prensaKws = c.keywords.map(function(k) { return k.toLowerCase() })
    }
  }

  var desde = new Date(Date.now() - VENTANA_HORAS * 60 * 60 * 1000)
  var allPosts = []

  // === INSTAGRAM (multi-actor) ===
  if (igSet.size > 0) {
    console.log('\n--- INSTAGRAM: ' + igSet.size + ' cuentas ---')
    var igLimit = MODO === 'diario' ? 5 : 15
    var igUrls = Array.from(igSet).map(function(h) { return 'https://www.instagram.com/' + h + '/' })

    // Actor 1: apify~instagram-scraper (principal)
    var igRaw = []
    try {
      console.log('   Actor 1: apify~instagram-scraper')
      var r = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: igUrls, resultsType: 'posts', resultsLimit: igLimit, addParentData: true }) })
      if (r.ok) {
        igRaw = await r.json()
        console.log('   Actor 1: ' + igRaw.length + ' raw items')
      } else {
        console.log('   Actor 1 falló: HTTP ' + r.status)
      }
    } catch (e) { console.log('   Actor 1 error: ' + e.message) }

    // Actor 2 fallback: apify~instagram-post-scraper (si actor 1 trajo 0)
    if (igRaw.length === 0) {
      try {
        console.log('   Actor 2 fallback: apify~instagram-post-scraper')
        var r2 = await fetch('https://api.apify.com/v2/acts/apify~instagram-post-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ directUrls: igUrls, resultsLimit: igLimit }) })
        if (r2.ok) {
          igRaw = await r2.json()
          console.log('   Actor 2: ' + igRaw.length + ' raw items')
        }
      } catch (e) { console.log('   Actor 2 error: ' + e.message) }
    }

    var igPosts = igRaw.filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })
      .map(function(p) { var h = (p.ownerUsername || '').toLowerCase(); return {
        red: 'Instagram', handle: h, nombre: handleToNombre[h] || h,
        texto: (p.caption || '').substring(0, 500), url: p.url || 'https://www.instagram.com/p/' + (p.shortCode || '') + '/',
        timestamp: p.timestamp, likes: p.likesCount || 0, comments: p.commentsCount || 0, type: p.type || 'Image'
      }})
    allPosts = allPosts.concat(igPosts)
    Array.from(igSet).forEach(function(h) { var n = igPosts.filter(function(p) { return p.handle === h }).length; console.log('   ' + (handleToNombre[h] || h) + ': ' + n) })
  }

  // === LINKEDIN (LinkdAPI primario — $0.01/llamada, sin cookies) ===
  if (liSet.size > 0) {
    console.log('\n--- LINKEDIN: ' + liSet.size + ' empresas (LinkdAPI) ---')
    var liLimit = MODO === 'diario' ? 5 : 15
    var liTotal = 0
    var liFailed = []

    if (LINKDAPI_KEY) {
      for (var handle of liSet) {
        try {
          // Paso 1: obtener company ID
          var idRes = await fetch('https://linkdapi.com/api/v1/companies/company/universal-name-to-id?universalName=' + encodeURIComponent(handle), {
            headers: { 'X-linkdapi-apikey': LINKDAPI_KEY }
          })
          var idData = await idRes.json()

          if (!idData.success || !idData.data || !idData.data.id) {
            console.log('   ' + handle + ': empresa no encontrada en LinkedIn')
            liFailed.push(handle)
            continue
          }

          var companyId = idData.data.id

          // Paso 2: obtener posts
          var postsRes = await fetch('https://linkdapi.com/api/v1/companies/company/posts?id=' + companyId + '&start=0', {
            headers: { 'X-linkdapi-apikey': LINKDAPI_KEY }
          })
          var postsData = await postsRes.json()

          if (!postsData.success || !postsData.data) {
            console.log('   ' + handle + ': sin posts o error')
            liFailed.push(handle)
            continue
          }

          var rawPosts = postsData.data.posts || postsData.data || []
          if (!Array.isArray(rawPosts)) rawPosts = []

          var liPosts = rawPosts.slice(0, liLimit).map(function(p) {
            var eng = p.engagements || {}
            var postedAt = p.postedAt || {}
            var timestamp = postedAt.timestamp ? new Date(postedAt.timestamp).toISOString() : (postedAt.fullDate || null)
            return {
              red: 'LinkedIn', handle: handle, nombre: handleToNombre[handle] || handle,
              texto: (p.text || '').substring(0, 500),
              url: p.url || '',
              timestamp: timestamp,
              likes: eng.totalReactions || 0,
              comments: eng.commentsCount || 0,
              type: p.mediaContent ? 'media' : 'article',
            }
          }).filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })

          allPosts = allPosts.concat(liPosts)
          liTotal += liPosts.length
          var topReactions = rawPosts[0] && rawPosts[0].engagements ? rawPosts[0].engagements.totalReactions : 0
          console.log('   ' + (handleToNombre[handle] || handle) + ': ' + liPosts.length + ' posts (' + topReactions + ' reactions top)')

          // Rate limiting
          await new Promise(function(r) { setTimeout(r, 500) })
        } catch (e) {
          console.log('   ' + handle + ' error: ' + e.message)
          liFailed.push(handle)
        }
      }

      console.log('   LinkedIn total: ' + liTotal + ' posts de ' + (liSet.size - liFailed.length) + '/' + liSet.size + ' empresas')

      // ALERTA si LinkdAPI no trajo nada
      if (liTotal === 0 && liSet.size > 0) {
        console.log('   ⚠️ ALERTA: LinkdAPI devolvió 0 posts para TODAS las empresas LinkedIn')
        agenteFallos.push({ agente: 'LinkedIn (LinkdAPI)', error: '0 posts de ' + liSet.size + ' empresas — verificar créditos o API', timestamp: new Date().toISOString() })
      }
    } else {
      console.log('   ⚠️ Sin LINKDAPI_KEY — LinkedIn deshabilitado')
      agenteFallos.push({ agente: 'LinkedIn', error: 'LINKDAPI_KEY no configurada en secrets', timestamp: new Date().toISOString() })
    }

    if (liFailed.length > 0) {
      console.log('   Empresas sin LinkedIn: ' + liFailed.join(', '))
    }
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
  var pr = allPosts.filter(function(p) { return p.red === 'Prensa' }).length
  console.log('\n=== TOTAL: ' + allPosts.length + ' (IG:' + ig + ' LI:' + li + ' Prensa:' + pr + ') ===')

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

    // === SCRAPE CUENTA PROPIA DEL CLIENTE ===
    var cuentaPropia = null
    var postsCliente = []
    var perfilEmpresa = sub.perfil_empresa || {}
    // Buscar handle del cliente en: perfil_empresa.instagram o cuenta marcada como propia
    var handleCliente = (perfilEmpresa.instagram || '').replace(/@/g, '').replace(/https?:\/\/(www\.)?instagram\.com\//g, '').replace(/\//g, '').toLowerCase().trim()
    // También buscar en cuentas si alguna tiene es_propia=true
    cuentas.forEach(function(c) {
      if (c.es_propia && (c.red || '').toLowerCase() === 'instagram') {
        handleCliente = c.handle.toLowerCase()
      }
    })

    if (handleCliente && !handles.includes(handleCliente)) {
      console.log('   Cuenta propia IG: @' + handleCliente)
      try {
        var clienteUrl = 'https://www.instagram.com/' + handleCliente + '/'
        var clienteLimit = MODO === 'diario' ? 5 : 15
        var cr = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ directUrls: [clienteUrl], resultsType: 'posts', resultsLimit: clienteLimit, addParentData: true }) })
        if (cr.ok) {
          var clienteRaw = await cr.json()
          postsCliente = clienteRaw.filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })
            .map(function(p) {
              return {
                red: 'Instagram', handle: handleCliente,
                nombre: perfilEmpresa.nombre || handleCliente,
                texto: (p.caption || '').substring(0, 500),
                url: p.url || 'https://www.instagram.com/p/' + (p.shortCode || '') + '/',
                timestamp: p.timestamp,
                likes: p.likesCount || 0, comments: p.commentsCount || 0,
                type: p.type || 'Image',
                es_propio: true,
              }
            })
          console.log('   Posts propios del cliente: ' + postsCliente.length + ' (engagement avg: ' +
            (postsCliente.length > 0 ? Math.round(postsCliente.reduce(function(s, p) { return s + p.likes + p.comments }, 0) / postsCliente.length) : 0) + ')')
        } else {
          console.log('   Cuenta propia: HTTP ' + cr.status)
        }
      } catch (e) { console.log('   Cuenta propia error: ' + e.message) }
    }

    console.log('\n' + sub.email + ': ' + misPosts.length + ' posts competencia' + (postsCliente.length > 0 ? ' + ' + postsCliente.length + ' propios' : ''))

    // Persist posts to radar_posts (competencia + propios)
    await persistirPosts(sub.id, misPosts, MODO)
    if (postsCliente.length > 0) {
      await persistirPosts(sub.id, postsCliente, MODO)
    }

    // Query previous period for trends
    var trends = await calcularTrends(sub.id, misPosts, cuentas, MODO)

    var empresas = extraerEmpresas(cuentas)

    var resumenIA = ''
    if (misPosts.length > 0) {
      if (MODO === 'diario' && OPENAI_KEY) {
        resumenIA = await generarResumenOpenAI(misPosts, cuentas, MODO, trends, sub.perfil_empresa)
      } else if ((MODO === 'semanal' || MODO === 'mensual') && ANTHROPIC_KEY) {
        resumenIA = await generarResumenClaude(misPosts, cuentas, MODO, trends, sub.perfil_empresa)
      } else if (OPENAI_KEY) {
        resumenIA = await generarResumenOpenAI(misPosts, cuentas, MODO, trends, sub.perfil_empresa)
      }
    }

    // === SISTEMA DE MEMORIA: cargar aprendizaje historico ===
    var memoria = null
    if ((MODO === 'semanal' || MODO === 'mensual') && misPosts.length >= 2) {
      try {
        memoria = await memoriaModule.cargarMemoria(supabase, sub.id)
      } catch (e) { console.log('   Memoria error (no bloqueante): ' + e.message) }
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

    // ═══ MOTOR DE DECISIONES ═══
    var ctx = null
    var decBrief = null
    var decCopies = null
    var decGuiones = null
    if ((MODO === 'semanal' || MODO === 'mensual') && memoria) {
      ctx = decisionModule.evaluarContexto(memoria, misPosts, postsCliente, sub)
      // Feedback loop: enriquecer contexto con aprendizajes persistentes
      ctx = await decisionModule.enriquecerConAprendizajes(ctx, supabase, sub.id)
      decBrief = decisionModule.decidirBrief(ctx)
      decCopies = decisionModule.decidirCopies(ctx)
      decGuiones = decisionModule.decidirGuiones(ctx, memoria)

      console.log('\n   ═══ DECISIONES INTELIGENTES ═══')
      console.log('   Brief: ' + (decBrief.regenerar ? 'REGENERAR' : 'MANTENER') + ' — ' + decBrief.razones.join('; '))
      if (decCopies.generar) {
        console.log('   Copies: GENERAR')
        if (decCopies.anguloPrioridad) console.log('     Priorizar: ' + decCopies.anguloPrioridad)
        if (decCopies.anguloEvitar) console.log('     Evitar: ' + decCopies.anguloEvitar)
        if (decCopies.formatoPrioridad) console.log('     Formato: ' + decCopies.formatoPrioridad)
        if (decCopies.tonoAjuste) console.log('     Tono: ' + decCopies.tonoAjuste)
      } else {
        console.log('   Copies: NO GENERAR — ' + decCopies.razones.join('; '))
      }
      console.log('   Guiones: ' + (decGuiones.generar ? 'GENERAR' : 'SALTAR') + (decGuiones.razones.length > 0 ? ' — ' + decGuiones.razones.join('; ') : ''))
      console.log('   ═══════════════════════════════\n')
    }

    // Generar/actualizar brief estratégico (solo si el motor decide)
    if ((MODO === 'semanal' || MODO === 'mensual') && misPosts.length >= 2) {
      var debeRegenerar = !decBrief || decBrief.regenerar
      if (debeRegenerar) {
        try {
          var brief = await briefModule.generarBrief(sub, misPosts, supabase, memoria)
          if (brief) {
            // Quality gate: verificar que el brief es bueno antes de usarlo
            var qgBrief = decisionModule.qualityGateBrief(brief)
            if (qgBrief.pass) {
              sub.brief_estrategico = brief
              if (!sub.perfil_empresa) sub.perfil_empresa = {}
              sub.perfil_empresa.brief = brief
              console.log('   ✓ Brief generado y aprobado por quality gate')
            } else {
              console.log('   ⚠ Brief generado pero con issues: ' + qgBrief.issues.join(', '))
              // Usar igual pero loguear warning
              sub.brief_estrategico = brief
              if (!sub.perfil_empresa) sub.perfil_empresa = {}
              sub.perfil_empresa.brief = brief
            }
          }
        } catch (e) { console.log('   Brief error (no bloqueante): ' + e.message) }
      } else {
        sub.brief_estrategico = (sub.perfil_empresa || {}).brief || null
        console.log('   Brief mantenido (no regenerado): ' + (decBrief.razones.join('; ')))
      }
    }

    // Pipeline contenido sugerido (solo si el motor decide)
    var contenidoSugerido = []
    if ((MODO === 'semanal' || MODO === 'mensual') && misPosts.length >= 2 && (sub.plan === 'pro' || sub.plan === 'business' || sub.plan === 'test')) {
      if (!decCopies || decCopies.generar) {
        // Generar instrucciones estratégicas basadas en decisiones
        var instrEstrategicas = (ctx && decCopies) ? decisionModule.generarInstruccionesParaCopies(ctx, decCopies) : ''
        contenidoSugerido = await contenidoModule.generarContenidoSugerido(misPosts, empresas, MODO, sub.perfil_empresa || {}, supabase, sub.id, sub.brief_estrategico, memoria, instrEstrategicas)

        // Quality gate copies
        if (contenidoSugerido.length > 0) {
          var qgCopies = decisionModule.qualityGateCopies(contenidoSugerido)
          if (!qgCopies.pass) {
            console.log('   ⚠ Copies quality gate issues: ' + qgCopies.issues.join(', '))
          } else {
            console.log('   ✓ Copies aprobados por quality gate')
          }
        }
      } else {
        console.log('   Copies saltados: ' + decCopies.razones.join('; '))
      }
    }

    // Grilla mensual (todos los planes, cantidad de posts varía)
    // INTERCONEXION: recibe brief estratégico + copies previos para no repetir
    var grillaMensual = null
    if (MODO === 'mensual' && misPosts.length >= 2) {
      var POSTS_POR_PLAN = { starter: 4, pro: 8, business: 16, test: 16 }
      var cantidadPosts = POSTS_POR_PLAN[sub.plan] || 8
      var mesSig = new Date().getMonth() + 2
      var anioSig = new Date().getFullYear()
      if (mesSig > 12) { mesSig = 1; anioSig++ }
      grillaMensual = await grillaModule.generarGrillaMensual(misPosts, empresas, sub, mesSig, anioSig, supabase, cantidadPosts, sub.brief_estrategico || null, contenidoSugerido, memoria)
    }

    // Guiones de reels (semanal/mensual, solo business — si el motor decide)
    var guionesData = null
    if ((MODO === 'semanal' || MODO === 'mensual') && (sub.plan === 'business' || sub.plan === 'test') && misPosts.length >= 2) {
      if (!decGuiones || decGuiones.generar) {
        guionesData = await guionesModule.generarGuiones(misPosts, empresas, sub.perfil_empresa || {}, contenidoSugerido, supabase, sub.id, sub.brief_estrategico || null, memoria)

        // Quality gate guiones
        if (guionesData && guionesData.length > 0) {
          var qgGuiones = decisionModule.qualityGateGuiones(guionesData)
          if (!qgGuiones.pass) {
            console.log('   ⚠ Guiones quality gate issues: ' + qgGuiones.issues.join(', '))
          } else {
            console.log('   ✓ Guiones aprobados por quality gate')
          }
        }
      }
    }

    // Auditoría (mensual completa + semanal light)
    // INTERCONEXION: recibe brief + posts propios del cliente para métricas reales
    var auditoriaData = null
    if (MODO === 'mensual' || MODO === 'semanal') {
      var contenidoAud = contenidoSugerido || []
      auditoriaData = await auditoriaModule.generarAuditoria(misPosts, contenidoAud, cuentas, supabase, sub.id, sub.brief_estrategico || null, MODO, postsCliente)
    }

    // Benchmark competitivo mensual (solo mensual, usa Claude Sonnet para calidad máxima)
    var benchmarkData = null
    if (MODO === 'mensual' && ANTHROPIC_KEY && misPosts.length >= 5) {
      benchmarkData = await ejecutarConRetry('Benchmark', function() {
        return benchmarkModule.generarBenchmark(misPosts, empresas, sub.perfil_empresa || {}, supabase, sub.id, sub.brief_estrategico || null, memoria, postsCliente)
      })
      if (benchmarkData) console.log('   ✓ Benchmark competitivo generado')
    }

    // Cargar aprendizajes persistentes (alimenta a todos los agentes que siguen)
    var aprendizajesPersistentes = []
    if ((MODO === 'semanal' || MODO === 'mensual')) {
      try {
        aprendizajesPersistentes = await memoriaPersistenteModule.cargarAprendizajes(supabase, sub.id)
      } catch (e) { console.log('   Aprendizajes persistentes error: ' + e.message) }
    }

    // Árbol de decisión digital (mensual, pro+business, se alimenta del predictor)
    var arbolDecision = null
    if (MODO === 'mensual' && ANTHROPIC_KEY && (sub.plan === 'pro' || sub.plan === 'business' || sub.plan === 'test')) {
      arbolDecision = await ejecutarConRetry('Árbol de decisión', function() {
        return arbolDecisionModule.generarArbolDecision(
          sub.perfil_empresa || {}, sub.brief_estrategico || null,
          null, memoria, aprendizajesPersistentes, supabase, sub.id
        )
      })
      if (arbolDecision) console.log('   ✓ Árbol de decisión generado')
    }

    // Plan de campaña mensual (alimentado por el árbol de decisión)
    var planCampana = null
    if (MODO === 'mensual' && ANTHROPIC_KEY && (sub.plan === 'business' || sub.plan === 'test') && misPosts.length >= 5) {
      planCampana = await ejecutarConRetry('Plan de campaña', function() {
        var industriaData = null
        try { var indMod = require('./radar-industria.js'); industriaData = indMod.detectarIndustria(sub.perfil_empresa || {}) } catch (e) {}
        return campanaModule.generarPlanCampana(misPosts, empresas, sub.perfil_empresa || {}, sub.brief_estrategico || null, memoria, postsCliente, industriaData || {}, supabase, sub.id)
      })
      if (planCampana) console.log('   ✓ Plan de campaña generado')
    }

    // Ads Creative Generator (semanal/mensual, alimentado por árbol + campaña)
    var adsCreativos = null
    if ((MODO === 'semanal' || MODO === 'mensual') && ANTHROPIC_KEY && (sub.plan === 'pro' || sub.plan === 'business' || sub.plan === 'test') && misPosts.length >= 3) {
      adsCreativos = await ejecutarConRetry('Ads Creative', function() {
        var industriaData2 = null
        try { var indMod2 = require('./radar-industria.js'); industriaData2 = indMod2.detectarIndustria(sub.perfil_empresa || {}) } catch (e) {}
        return adsCreativeModule.generarAdsCreativos(misPosts, empresas, sub.perfil_empresa || {}, sub.brief_estrategico || null, memoria, industriaData2 || {}, contenidoSugerido ? contenidoSugerido.copies || [] : [], planCampana || {}, supabase, sub.id)
      })
      if (adsCreativos) console.log('   ✓ Ads creativos generados')
    }

    // Guardar aprendizajes de TODOS los agentes que corrieron
    if ((MODO === 'semanal' || MODO === 'mensual')) {
      try {
        var totalAprendidos = 0
        if (contenidoSugerido && contenidoSugerido.length > 0) {
          totalAprendidos += await memoriaPersistenteModule.extraerYGuardarAprendizajes(supabase, sub.id, 'contenido', contenidoSugerido)
        }
        if (auditoriaData) {
          totalAprendidos += await memoriaPersistenteModule.extraerYGuardarAprendizajes(supabase, sub.id, 'auditoria', auditoriaData)
        }
        if (benchmarkData) {
          totalAprendidos += await memoriaPersistenteModule.extraerYGuardarAprendizajes(supabase, sub.id, 'benchmark', benchmarkData)
        }
        if (adsCreativos) {
          totalAprendidos += await memoriaPersistenteModule.extraerYGuardarAprendizajes(supabase, sub.id, 'ads_creative', adsCreativos)
        }
        if (totalAprendidos > 0) {
          console.log('   ✓ ' + totalAprendidos + ' aprendizajes guardados para próximo run')
        }
      } catch (e) { console.log('   Aprendizajes save error: ' + e.message) }
    }

    // Agente Reporte — el cerebro que resume TODO (semanal/mensual)
    var reporteData = null
    if ((MODO === 'semanal' || MODO === 'mensual') && ANTHROPIC_KEY) {
      reporteData = await ejecutarConRetry('Reporte inteligente', function() {
        return reporteModule.generarReporte({
          posts: misPosts, postsCliente: postsCliente, perfil: sub.perfil_empresa || {},
          brief: sub.brief_estrategico, contenido: contenidoSugerido ? [{ datos: contenidoSugerido, score_promedio: 0 }] : [],
          auditoria: auditoriaData, benchmark: benchmarkData, arbol: arbolDecision,
          adsCreativos: adsCreativos, guiones: guionesData ? [{ datos: guionesData }] : [],
          ideas: [], aprendizajes: aprendizajesPersistentes,
        }, supabase, sub.id)
      })
      if (reporteData) console.log('   ✓ Reporte inteligente generado')
    }

    // ═══ QA AUDITOR — revisa TODOS los entregables ═══
    var qaResult = null
    try {
      var qaModule = require('./radar-qa-auditor.js')
      // Cargar datos completos para auditar duplicados
      var contenidoAll = []
      var auditoriasAll = []
      try {
        var cRes = await supabase.from('radar_contenido').select('tipo,mes,anio').eq('suscripcion_id', sub.id)
        contenidoAll = cRes.data || []
        var aRes = await supabase.from('copilot_auditorias').select('mes,anio').eq('suscripcion_id', sub.id)
        auditoriasAll = aRes.data || []
      } catch (e) {}

      qaResult = await qaModule.ejecutarAuditoria({
        posts: misPosts, postsCliente: postsCliente, perfil: sub.perfil_empresa || {},
        cuentas: cuentas,
        contenido: contenidoAll.concat(contenidoSugerido ? [{ tipo: 'copy', datos: contenidoSugerido, mes: new Date().getMonth() + 1, anio: new Date().getFullYear() }] : []),
        auditoria: auditoriaData,
        reporte: reporteData,
        auditorias: auditoriasAll,
      }, supabase, sub.id)

      if (qaResult) {
        console.log('   QA: ' + qaResult.veredicto + ' (' + qaResult.scoreGlobal + '/100, ' + qaResult.todosProblemas.length + ' problemas)')
        if (qaResult.todosProblemas.length > 0) {
          agenteFallos.push({ agente: 'QA Auditor', error: qaResult.todosProblemas.length + ' problemas detectados (score ' + qaResult.scoreGlobal + ')', timestamp: new Date().toISOString() })
        }
      }
    } catch (e) { console.log('   QA skip: ' + e.message) }

    var html = generarEmailHTML(misPosts, cuentas, hoy, MODO, resumenIA, empresas, trends, sub.id, contenidoSugerido, sub.estado, sub.plan, sub.trial_ends, grillaMensual, guionesData, null, auditoriaData, sub.brief_estrategico)
    var pdf = generarPDFEjecutivo(misPosts, empresas, hoy, MODO, resumenIA, contenidoSugerido, auditoriaData, guionesData, sub, grillaMensual)

    // Generar Excel adjuntos según modo y plan
    var attachments = []
    if (pdf) attachments.push({ filename: 'Copilot_' + MODO + '_' + hoy + '.pdf', content: pdf })
    if ((MODO === 'semanal' || MODO === 'mensual') && contenidoSugerido.length > 0) {
      var excelCopies = await generarExcelCopies(contenidoSugerido)
      if (excelCopies) attachments.push({ filename: 'Copies_' + hoy + '.xlsx', content: excelCopies })
    }
    if (MODO === 'mensual' && grillaMensual && grillaMensual.posts && grillaMensual.posts.length > 0) {
      var excelGrilla = await generarExcel(grillaMensual.posts, sub.nombre || sub.email, hoy)
      if (excelGrilla) attachments.push({ filename: 'Grilla_' + hoy + '.xlsx', content: excelGrilla })
    }
    if ((MODO === 'semanal' || MODO === 'mensual') && guionesData && guionesData.length > 0) {
      var excelGuiones = await generarExcelGuiones(guionesData)
      if (excelGuiones) attachments.push({ filename: 'Guiones_' + hoy + '.xlsx', content: excelGuiones })
    }
    await enviarEmailV2(destinos, html, hoy, misPosts.length, MODO, attachments, sub.nombre || sub.email)
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
      modo: modo,
      es_propio: p.es_propio || false
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
      var empHandles = [emp.ig, emp.li].filter(Boolean)
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
    var redLower = (c.red || '').toLowerCase()
    if (redLower === 'prensa' || !c.nombre) return
    if (!empresas[c.nombre]) empresas[c.nombre] = { ig: null, li: null }
    if (redLower === 'instagram') empresas[c.nombre].ig = c.handle.toLowerCase()
    else if (redLower === 'linkedin') empresas[c.nombre].li = c.handle.toLowerCase()
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
async function generarResumenOpenAI(posts, cuentas, modo, trends, perfil) {
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

    // Datos de industria
    var indCtx = ''
    try { var indMod = require('./radar-industria.js'); indCtx = indMod.generarContextoIndustria(perfil || {}) } catch(e) {}

    var prompt = 'Eres un analista de inteligencia competitiva SENIOR. NO generas observaciones obvias como "publicaron X posts" o "el engagement fue moderado". '
    + 'Tu trabajo es encontrar PATRONES ACCIONABLES y GAPS ESPECIFICOS que un director de marketing pueda usar HOY.\n\n'
    + 'Empresas monitoreadas: ' + unicas + '.\n'
    if (trendTxt) prompt = prompt + 'Tendencias vs periodo anterior: ' + trendTxt + '\n'
    prompt = prompt + 'Contexto estacional: ' + getContextoEstacional() + '\n'
    + indCtx + '\n'
    + 'INSTRUCCIONES:\n'
    + '1. Para CADA empresa, identifica su top post (el de mas engagement) y explica POR QUE funciono (formato, hook, tema, timing).\n'
    + '2. Detecta el PATRON de cada empresa: que formato prefieren (video/carrusel/imagen), que temas repiten, a que hora publican.\n'
    + '3. La "oportunidad" debe ser ESPECIFICA: "La empresa X publico sobre [tema] y obtuvo [N] likes. Tu cliente no cubre ese tema. Crear un [formato] sobre [angulo concreto] para capturar esa audiencia."\n'
    + '4. La "alerta" debe ser ACCIONABLE con numeros: "La empresa Y aumento su frecuencia de [N] a [M] posts. Si no se iguala, se pierde share of voice."\n\n'
    + 'Genera un JSON con esta estructura exacta (sin markdown, solo JSON):\n'
    + '{"contexto":"1 oracion sobre que paso HOY relevante en el mercado, con dato concreto",'
    + '"empresas":[{"nombre":"X","badge":"green|yellow|red","texto":"Top post: [tema] con [N] likes. Patron: [formato] + [temas]. Gap detectado: [que hace que el cliente no].","top_post_tema":"tema del mejor post","top_post_engagement":N,"formato_dominante":"video|carrusel|imagen|articulo","frecuencia_posts":N}],'
    + '"oportunidad":"ESPECIFICA con nombre de competidor, tema concreto, formato sugerido y engagement de referencia",'
    + '"alerta":"ACCIONABLE con dato numerico y consecuencia si no se actua",'
    + '"contenido_sugerido":"Basado en el top post de [competidor] sobre [tema] ([N] likes), crear un [formato] que [angulo diferenciador del cliente]"}'
    + '\nUsa badge green=muy activa(5+ posts), yellow=moderada(2-4), red=inactiva(0-1). Espanol sin acentos ni emojis.'

    var r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.6, max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: data }] }) })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    var d = await r.json()
    return d.choices[0].message.content || ''
  } catch (e) { console.error('   IA OpenAI: ' + e.message); return '' }
}

// === IA - CLAUDE (semanal/mensual) ===
async function generarResumenClaude(posts, cuentas, modo, trends, perfil) {
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

    // Datos de industria
    var indCtx = ''
    try { var indMod = require('./radar-industria.js'); indCtx = indMod.generarContextoIndustria(perfil || {}) } catch(e) {}

    var periodoLabel = modo === 'semanal' ? 'esta semana' : 'este mes'
    var prompt = 'Eres un DIRECTOR DE INTELIGENCIA COMPETITIVA. NO generas resúmenes genéricos. '
    + 'Tu trabajo es analizar los datos REALES de cada competidor y extraer insights que un CMO pueda convertir en decisiones esta semana.\n\n'
    + 'Empresas monitoreadas: ' + unicas + '.\n'
    + 'Periodo: ' + periodoLabel + '.\n'
    if (trendTxt) prompt = prompt + 'Cambios vs periodo anterior: ' + trendTxt + '\n'
    prompt = prompt + 'Contexto estacional Chile: ' + getContextoEstacional() + '\n'
    + indCtx + '\n'
    + 'ANALISIS OBLIGATORIO POR CADA EMPRESA:\n'
    + '1. TOP POST: Cual fue su post con mas engagement? De que tema trataba? Que formato uso? Por que crees que funciono?\n'
    + '2. PATRON DE CONTENIDO: Que tipo de contenido publica mas? (educativo, promocional, marca humana, casos de exito). Cual le genera mas engagement?\n'
    + '3. FRECUENCIA Y TIMING: Cuantos posts publico? Aumento o bajo vs periodo anterior? Que dias de la semana publica mas?\n'
    + '4. GAP vs CLIENTE: Que hace este competidor que el cliente NO esta haciendo? (tema, formato, frecuencia)\n\n'
    + 'REGLAS ESTRICTAS:\n'
    + '- NUNCA escribas "el engagement fue moderado" o "publican contenido variado" — eso no sirve de nada\n'
    + '- SIEMPRE cita el tema/contenido especifico del top post y su engagement exacto\n'
    + '- SIEMPRE incluye un gap concreto por empresa (que hacen ellos que el cliente no)\n'
    + '- La oportunidad debe nombrar al competidor, el tema, el formato y el engagement de referencia\n'
    + '- La alerta debe incluir un dato numerico y la consecuencia concreta de no actuar\n'
    + '- El contenido_sugerido debe referenciar un post real de un competidor especifico\n\n'
    + 'Genera un JSON con esta estructura exacta (sin markdown, sin backticks, solo JSON puro):\n'
    + '{"contexto":"1 parrafo corto con el hallazgo mas importante del periodo — NO un resumen generico, sino EL insight clave que cambia la estrategia",'
    + '"empresas":[{"nombre":"X","badge":"green|yellow|red",'
    + '"texto":"Top post: [descripcion del contenido] con [N] likes/[M] comentarios. Patron: publica [frecuencia] posts de [formato dominante] enfocados en [tema]. Gap: [que hace que el cliente no].",'
    + '"top_post_tema":"tema especifico del mejor post",'
    + '"top_post_likes":N,"top_post_comments":M,'
    + '"formato_dominante":"video|carrusel|imagen|articulo",'
    + '"tema_dominante":"educativo|promocional|marca_humana|caso_exito|tendencia",'
    + '"frecuencia":N,"frecuencia_anterior":N_o_null,'
    + '"gap":"descripcion concreta de lo que hacen y el cliente no"}],'
    + '"oportunidad":"[Competidor] publico un [formato] sobre [tema concreto] y obtuvo [N] engagement. El cliente deberia crear un [formato] sobre [angulo del cliente] porque [razon de diferenciacion].",'
    + '"alerta":"[Competidor] [accion concreta con dato numerico]. Si el cliente no [accion], [consecuencia medible].",'
    + '"contenido_sugerido":[{"titulo":"titulo especifico basado en gap detectado","red":"Instagram|LinkedIn","formato":"carrusel|reel|imagen|articulo",'
    + '"descripcion":"Basado en el post de [competidor] sobre [tema] ([N] likes). Crear [formato] con angulo [X] porque [justificacion con dato]. Copy sugerido: [primera linea del copy].","competidor_referencia":"nombre","engagement_referencia":N}]}'
    + '\nIncluir 2-3 ideas de contenido. Badge: green=muy activa(5+ posts), yellow=moderada(2-4), red=inactiva(0-1).'
    + '\nMax 600 palabras total. Espanol profesional sin emojis.'

    var r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
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

// === EMAIL HTML v6 — Dark theme, Gmail-safe, compact ===
function generarEmailHTML(posts, cuentas, fecha, modo, resumenIA, empresas, trends, subId, contenidoSugerido, estado, plan, trialEnds, grillaMensual, guionesData, ideasData, auditoriaData, briefData) {
  contenidoSugerido = contenidoSugerido || []
  grillaMensual = grillaMensual || null
  guionesData = guionesData || null
  ideasData = ideasData || null
  auditoriaData = auditoriaData || null
  briefData = briefData || null
  estado = estado || 'trial'
  plan = plan || 'starter'
  var fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  var titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Copilot diario'
  var ventanaLabel = modo === 'diario' ? '72h' : modo === 'semanal' ? '7 d\u00edas' : '30 d\u00edas'
  var totalLikes = posts.reduce(function(s, p) { return s + p.likes }, 0)
  var redesActivas = Array.from(new Set(posts.map(function(p) { return p.red }))).length
  var nEmpresas = Object.keys(empresas).length

  var ia = parseIAResponse(resumenIA)

  // Helper: truncate text safely
  var truncar = function(txt, max) {
    if (!txt) return ''
    if (typeof txt !== 'string') txt = String(txt)
    var clean = txt.replace(/\n/g, ' ').replace(/<[^>]*>/g, '')
    return clean.length > max ? clean.substring(0, max) + '...' : clean
  }

  var h = ''
  // Outer wrapper table for Gmail
  h += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:-apple-system,Helvetica,Arial,sans-serif;"><tr><td align="center" bgcolor="#0F0D2E" style="padding:16px 0;">'
  h += '<table cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;">'

  // === 1. HEADER ===
  h += '<tr><td bgcolor="#4F46E5" style="padding:28px 28px 20px 28px;">'
  h += '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>'
  h += '<td style="vertical-align:top;">'
  h += '<p style="margin:0 0 6px;font-size:11px;color:#a5b4fc;letter-spacing:1.5px;font-weight:600;">M&amp;P COPILOT</p>'
  h += '<p style="margin:0 0 6px;font-size:24px;font-weight:800;color:#ffffff;">' + titulo + '</p>'
  h += '<p style="margin:0;font-size:13px;color:#c4b5fd;">' + fechaLegible + '</p>'
  h += '</td>'
  h += '<td width="90" style="vertical-align:top;text-align:right;">'
  h += '<table cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#3730a3" style="padding:8px 14px;text-align:center;border-radius:8px;">'
  h += '<p style="margin:0;font-size:10px;color:#a5b4fc;">Ventana</p>'
  h += '<p style="margin:2px 0 0;font-size:16px;font-weight:800;color:#ffffff;">' + ventanaLabel + '</p>'
  h += '</td></tr></table>'
  h += '</td></tr></table>'
  h += '</td></tr>'

  // === 2. KPI ROW ===
  h += '<tr><td bgcolor="#1a1745" style="padding:16px 20px;">'
  h += '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>'
  h += '<td width="25%" style="text-align:center;padding:8px 4px;"><p style="margin:0;font-size:24px;font-weight:800;color:#a5b4fc;">' + posts.length + '</p><p style="margin:4px 0 0;font-size:10px;color:#94a3b8;">Posts</p></td>'
  h += '<td width="25%" style="text-align:center;padding:8px 4px;"><p style="margin:0;font-size:24px;font-weight:800;color:#a5b4fc;">' + redesActivas + '</p><p style="margin:4px 0 0;font-size:10px;color:#94a3b8;">Redes</p></td>'
  h += '<td width="25%" style="text-align:center;padding:8px 4px;"><p style="margin:0;font-size:24px;font-weight:800;color:#a5b4fc;">' + totalLikes.toLocaleString() + '</p><p style="margin:4px 0 0;font-size:10px;color:#94a3b8;">Likes</p></td>'
  h += '<td width="25%" style="text-align:center;padding:8px 4px;"><p style="margin:0;font-size:24px;font-weight:800;color:#a5b4fc;">' + nEmpresas + '</p><p style="margin:4px 0 0;font-size:10px;color:#94a3b8;">Empresas</p></td>'
  h += '</tr></table>'
  h += '</td></tr>'

  // === 2b. BRIEF RESUMEN (semanal/mensual) ===
  if (briefData && (modo === 'semanal' || modo === 'mensual')) {
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;border-left:4px solid #06B6D4;">'
    h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>'
    h += '<td bgcolor="#06B6D4" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">Brief estrat\u00e9gico</p></td>'
    h += '</tr></table>'
    if (briefData.propuesta_valor_unica) {
      h += '<p style="margin:0 0 8px;font-size:13px;color:#ffffff;font-weight:700;line-height:1.4;">' + truncar(briefData.propuesta_valor_unica, 200) + '</p>'
    }
    if (briefData.territorios_contenido && Array.isArray(briefData.territorios_contenido)) {
      h += '<p style="margin:0 0 4px;font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;">Territorios</p>'
      briefData.territorios_contenido.forEach(function(t) {
        var nombre = typeof t === 'object' ? (t.territorio || t.nombre || '') : t
        h += '<span style="display:inline-block;background:#0e7490;color:#cffafe;font-size:10px;font-weight:600;padding:3px 8px;border-radius:3px;margin:0 4px 4px 0;">' + truncar(nombre, 30) + '</span>'
      })
    }
    if (briefData.reglas_contenido && Array.isArray(briefData.reglas_contenido) && briefData.reglas_contenido.length > 0) {
      h += '<p style="margin:8px 0 4px;font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;">Reglas</p>'
      briefData.reglas_contenido.slice(0, 3).forEach(function(r) {
        h += '<p style="margin:0 0 2px;font-size:11px;color:#94a3b8;">&#10003; ' + truncar(r, 80) + '</p>'
      })
    }
    h += '</td></tr>'
  }

  // === 3. AI ANALYSIS ===
  if (ia || resumenIA) {
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;border-left:4px solid #7C3AED;">'
    h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>'
    h += '<td bgcolor="#7C3AED" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">An\u00e1lisis IA</p></td>'
    h += '</tr></table>'
    if (ia) {
      if (ia.contexto) {
        h += '<p style="margin:0 0 12px;font-size:13px;color:#c4b5fd;line-height:1.6;">' + truncar(ia.contexto, 300) + '</p>'
      }
      if (ia.empresas && ia.empresas.length > 0) {
        for (var ei = 0; ei < ia.empresas.length; ei++) {
          var emp = ia.empresas[ei]
          var bColor = emp.badge === 'red' ? '#7f1d1d' : emp.badge === 'yellow' ? '#713f12' : '#14532d'
          var bBg = emp.badge === 'red' ? '#450a0a' : emp.badge === 'yellow' ? '#422006' : '#052e16'
          var bText = emp.badge === 'red' ? '#EF4444' : emp.badge === 'yellow' ? '#F59E0B' : '#10B981'
          h += '<p style="margin:0 0 8px;font-size:12px;color:#c4b5fd;line-height:1.5;">'
          h += '<span style="background:' + bBg + ';color:' + bText + ';padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;border:1px solid ' + bColor + ';">' + emp.nombre + '</span> '
          h += truncar(emp.texto, 150) + '</p>'
        }
      }
      if (ia.oportunidad) {
        h += '<p style="margin:8px 0 4px;font-size:12px;color:#c4b5fd;line-height:1.5;">'
        h += '<span style="background:#422006;color:#F59E0B;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;border:1px solid #713f12;">Oportunidad</span> '
        h += truncar(ia.oportunidad, 200) + '</p>'
      }
      if (ia.alerta) {
        h += '<p style="margin:4px 0 0;font-size:12px;color:#c4b5fd;line-height:1.5;">'
        h += '<span style="background:#450a0a;color:#EF4444;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;border:1px solid #7f1d1d;">Alerta</span> '
        h += truncar(ia.alerta, 200) + '</p>'
      }
    } else if (resumenIA) {
      h += '<p style="margin:0;font-size:12px;color:#c4b5fd;line-height:1.6;">' + truncar(resumenIA, 500) + '</p>'
    }
    h += '</td></tr>'
  }

  // === 4. COMPANY TABLE ===
  h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
  h += '<tr><td bgcolor="#0F0D2E" style="padding:0 0 0 0;">'
  h += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:12px;">'
  // Table header
  h += '<tr>'
  h += '<td bgcolor="#1e1b4b" style="padding:10px 12px;font-weight:700;color:#ffffff;text-align:left;">Empresa</td>'
  h += '<td bgcolor="#1e1b4b" style="padding:10px 6px;font-weight:700;color:#ffffff;text-align:center;width:50px;">Posts</td>'
  h += '<td bgcolor="#1e1b4b" style="padding:10px 6px;font-weight:700;color:#ffffff;text-align:center;">Likes</td>'
  h += '<td bgcolor="#1e1b4b" style="padding:10px 6px;font-weight:700;color:#ffffff;text-align:center;">Eng.</td>'
  h += '</tr>'
  var idx = 0
  Object.keys(empresas).forEach(function(nombre) {
    var empData = empresas[nombre]
    var empHandles = [empData.ig, empData.li].filter(Boolean)
    var empPosts = posts.filter(function(p) { return p.red !== 'Prensa' && empHandles.includes(p.handle) })
    var igN = empPosts.filter(function(p) { return p.red === 'Instagram' }).length
    var liN = empPosts.filter(function(p) { return p.red === 'LinkedIn' }).length
    var totalN = empPosts.length
    var totalL = empPosts.reduce(function(s, p) { return s + p.likes }, 0)
    var totalC = empPosts.reduce(function(s, p) { return s + (p.comments || 0) }, 0)
    var isInactive = totalN === 0
    var rowBg = idx % 2 === 0 ? '#1a1745' : '#12102a'
    var nameColor = isInactive ? '#EF4444' : '#ffffff'
    var dimColor = '#64748b'
    var zv = function(n, color) { return n === 0 ? '<span style="color:' + dimColor + ';">0</span>' : '<span style="color:' + color + ';font-weight:700;">' + n + '</span>' }

    h += '<tr>'
    var avgEng = totalN > 0 ? Math.round((totalL + totalC) / totalN) : 0
    h += '<td bgcolor="' + rowBg + '" style="padding:10px 12px;font-weight:700;color:' + nameColor + ';border-bottom:1px solid #2d2a5e;">' + nombre + '</td>'
    h += '<td bgcolor="' + rowBg + '" style="padding:10px 6px;text-align:center;font-weight:800;color:' + (isInactive ? '#EF4444' : '#ffffff') + ';border-bottom:1px solid #2d2a5e;">' + totalN + '</td>'
    h += '<td bgcolor="' + rowBg + '" style="padding:10px 6px;text-align:center;color:' + (isInactive ? dimColor : '#c4b5fd') + ';border-bottom:1px solid #2d2a5e;">' + (isInactive ? '-' : totalL.toLocaleString()) + '</td>'
    h += '<td bgcolor="' + rowBg + '" style="padding:10px 6px;text-align:center;color:' + (isInactive ? dimColor : '#a5b4fc') + ';border-bottom:1px solid #2d2a5e;">' + (isInactive ? '-' : avgEng) + '</td>'
    h += '</tr>'
    idx++
  })
  h += '</table></td></tr>'

  // === 5. TOP 5 POSTS ===
  if (posts.length > 0) {
    var sortedPosts = posts.filter(function(p) { return p.red !== 'Prensa' }).slice().sort(function(a, b) { return b.likes - a.likes })
    var topPosts = sortedPosts.slice(0, 5)
    if (topPosts.length > 0) {
      h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
      h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;">'
      h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;"><tr>'
      h += '<td bgcolor="#4F46E5" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">Top ' + topPosts.length + ' posts</p></td>'
      h += '</tr></table>'
      for (var ti = 0; ti < topPosts.length; ti++) {
        var tp = topPosts[ti]
        var netColor = tp.red === 'Instagram' ? '#E4405F' : tp.red === 'LinkedIn' ? '#0A66C2' : '#d97706'
        var tpDate = ''
        if (tp.fecha) { try { tpDate = new Date(tp.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) } catch(e) { tpDate = '' } }
        h += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:8px;"><tr>'
        h += '<td width="4" bgcolor="' + netColor + '" style="padding:0;"></td>'
        h += '<td bgcolor="#12102a" style="padding:10px 14px;border-bottom:1px solid #2d2a5e;">'
        h += '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>'
        h += '<td style="vertical-align:top;">'
        h += '<p style="margin:0 0 2px;font-size:11px;"><span style="color:' + netColor + ';font-weight:700;">' + (tp.nombre || tp.handle) + '</span>'
        if (tpDate) h += ' <span style="color:#64748b;font-size:10px;">' + tpDate + '</span>'
        h += '</p>'
        h += '<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">' + truncar(tp.texto, 100) + '</p>'
        h += '</td>'
        h += '<td width="60" style="text-align:right;vertical-align:top;"><p style="margin:0;font-size:14px;font-weight:800;color:#a5b4fc;">' + tp.likes.toLocaleString() + '</p><p style="margin:0;font-size:9px;color:#64748b;">likes</p></td>'
        h += '</tr></table>'
        h += '</td></tr></table>'
      }
      h += '</td></tr>'
    }
  }

  if (posts.length === 0) {
    h += '<tr><td bgcolor="#1a1745" style="padding:28px;text-align:center;"><p style="margin:0;color:#64748b;font-size:13px;">Sin publicaciones en el per\u00edodo.</p></td></tr>'
  }

  // === 6. COPIES PREVIEW (semanal/mensual, Pro+Business) ===
  var hasCopies = (contenidoSugerido.length > 0 || (ia && ia.contenido_sugerido && ia.contenido_sugerido.length > 0)) && (modo === 'semanal' || modo === 'mensual')
  if (hasCopies && (plan === 'pro' || plan === 'business' || plan === 'test')) {
    var copiesList = contenidoSugerido.length > 0 ? contenidoSugerido : ia.contenido_sugerido
    var maxCopies = Math.min(copiesList.length, 5)
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;border-left:4px solid #10B981;">'
    h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>'
    h += '<td bgcolor="#10B981" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">Copies sugeridos</p></td>'
    h += '<td style="padding-left:10px;"><p style="margin:0;font-size:11px;color:#64748b;">' + copiesList.length + ' ideas</p></td>'
    h += '</tr></table>'
    for (var ci = 0; ci < maxCopies; ci++) {
      var cs = copiesList[ci]
      var cPlat = cs.plataforma || cs.red || 'General'
      var cColor = cPlat === 'Instagram' ? '#E4405F' : cPlat === 'LinkedIn' ? '#0A66C2' : '#94a3b8'
      var cTitle = cs.titulo || 'Idea ' + (ci + 1)
      h += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:6px;"><tr>'
      h += '<td bgcolor="#12102a" style="padding:8px 12px;border-bottom:1px solid #2d2a5e;">'
      h += '<span style="color:' + cColor + ';font-size:10px;font-weight:700;">' + cPlat + '</span> '
      if (cs.tipo) h += '<span style="color:#64748b;font-size:10px;">' + cs.tipo + '</span> '
      if (cs.score) {
        var scColor = cs.score >= 80 ? '#10B981' : cs.score >= 65 ? '#F59E0B' : '#EF4444'
        h += '<span style="color:' + scColor + ';font-size:10px;font-weight:700;">' + cs.score + '</span>'
      }
      h += '<br/><span style="color:#ffffff;font-size:12px;font-weight:600;">' + truncar(cTitle, 70) + '</span>'
      // Preview: primeras 2 líneas del copy
      if (cs.copy) {
        var previewLines = cs.copy.split('\n').filter(function(l) { return l.trim().length > 0 }).slice(0, 2).join(' ')
        h += '<br/><span style="color:#94a3b8;font-size:11px;line-height:1.4;">' + truncar(previewLines, 140) + '</span>'
      }
      // Referencia competitiva
      if (cs.competidor_referencia) {
        h += '<br/><span style="color:#818cf8;font-size:10px;font-style:italic;">vs ' + cs.competidor_referencia
        if (cs.engagement_referencia) h += ' (eng: ' + cs.engagement_referencia + ')'
        h += '</span>'
      }
      h += '</td></tr></table>'
    }
    if (copiesList.length > maxCopies) {
      h += '<p style="margin:6px 0 0;font-size:11px;color:#64748b;">+ ' + (copiesList.length - maxCopies) + ' m\u00e1s</p>'
    }
    h += '<p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">Ver copies completos en el Excel adjunto</p>'
    h += '</td></tr>'
  }

  // === 7. GRILLA PREVIEW (mensual only, Pro+Business) ===
  if (grillaMensual && grillaMensual.posts && grillaMensual.posts.length > 0 && modo === 'mensual' && (plan === 'pro' || plan === 'business' || plan === 'test')) {
    var grillaPosts = grillaMensual.posts
    var maxGrilla = Math.min(grillaPosts.length, 3)
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;border-left:4px solid #8B5CF6;">'
    h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>'
    h += '<td bgcolor="#8B5CF6" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">Grilla ' + (grillaMensual.mes || '') + '</p></td>'
    h += '<td style="padding-left:10px;"><p style="margin:0;font-size:11px;color:#64748b;">' + grillaPosts.length + ' posts</p></td>'
    h += '</tr></table>'
    for (var gi = 0; gi < maxGrilla; gi++) {
      var gp = grillaPosts[gi]
      var gpColor = (gp.plataforma || '').includes('Instagram') ? '#E4405F' : '#0A66C2'
      h += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:6px;"><tr>'
      h += '<td bgcolor="#12102a" style="padding:8px 12px;border-bottom:1px solid #2d2a5e;">'
      h += '<span style="color:' + gpColor + ';font-size:10px;font-weight:700;">' + (gp.plataforma || 'IG') + '</span> '
      h += '<span style="color:#64748b;font-size:10px;">' + (gp.fecha_sugerida || '') + '</span> '
      h += '<span style="color:#c4b5fd;font-size:12px;">' + truncar(gp.titulo, 50) + '</span>'
      h += '</td></tr></table>'
    }
    if (grillaPosts.length > maxGrilla) {
      h += '<p style="margin:6px 0 0;font-size:11px;color:#64748b;">+ ' + (grillaPosts.length - maxGrilla) + ' posts m\u00e1s</p>'
    }
    h += '<p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">Descargar grilla completa en el Excel adjunto</p>'
    h += '</td></tr>'
  }

  // === 8. GUIONES PREVIEW (semanal/mensual, Business only) ===
  if (guionesData && guionesData.length > 0 && (modo === 'semanal' || modo === 'mensual') && (plan === 'business' || plan === 'test')) {
    var maxGuiones = Math.min(guionesData.length, 3)
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;border-left:4px solid #E4405F;">'
    h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>'
    h += '<td bgcolor="#E4405F" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">Guiones de reels</p></td>'
    h += '<td style="padding-left:10px;"><p style="margin:0;font-size:11px;color:#64748b;">' + guionesData.length + ' guiones</p></td>'
    h += '</tr></table>'
    for (var gui = 0; gui < maxGuiones; gui++) {
      var guion = guionesData[gui]
      h += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:6px;"><tr>'
      h += '<td bgcolor="#12102a" style="padding:8px 12px;border-bottom:1px solid #2d2a5e;">'
      h += '<span style="color:#E4405F;font-size:10px;font-weight:700;">' + (guion.duracion || '30s') + '</span> '
      h += '<span style="color:#c4b5fd;font-size:12px;">' + truncar(guion.gancho || guion.titulo || 'Guion ' + (gui + 1), 60) + '</span>'
      h += '</td></tr></table>'
    }
    if (guionesData.length > maxGuiones) {
      h += '<p style="margin:6px 0 0;font-size:11px;color:#64748b;">+ ' + (guionesData.length - maxGuiones) + ' guiones m\u00e1s</p>'
    }
    h += '<p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">Ver guiones completos en el Excel adjunto</p>'
    h += '</td></tr>'
  }

  // === 9. AUDITORIA (semanal+mensual, all plans) ===
  if (auditoriaData && (modo === 'semanal' || modo === 'mensual')) {
    var scoreVal = auditoriaData.score_general || auditoriaData.score || 0
    var scoreColor = scoreVal >= 75 ? '#10B981' : scoreVal >= 50 ? '#F59E0B' : '#EF4444'
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;border-left:4px solid #6366F1;">'
    h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;"><tr>'
    h += '<td bgcolor="#6366F1" style="padding:4px 10px;border-radius:4px;"><p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">Auditor\u00eda mensual</p></td>'
    h += '</tr></table>'
    // Score + network scores in one row
    h += '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>'
    h += '<td width="80" style="text-align:center;vertical-align:middle;"><p style="margin:0;font-size:40px;font-weight:800;color:' + scoreColor + ';">' + scoreVal + '</p><p style="margin:2px 0 0;font-size:9px;color:#64748b;">PUNTAJE</p></td>'
    h += '<td style="vertical-align:middle;padding-left:16px;">'
    // scores_red es un objeto {Instagram: 70, LinkedIn: 80}
    var scoresRedData = auditoriaData.scores_red || {}
    var auditRedes = [
      { n: 'IG', v: scoresRedData.Instagram || scoresRedData.instagram || 0, c: '#E4405F' },
      { n: 'LI', v: scoresRedData.LinkedIn || scoresRedData.linkedin || 0, c: '#0A66C2' }
    ]
    for (var ri = 0; ri < auditRedes.length; ri++) {
      var ar = auditRedes[ri]
      if (ar.v > 0) {
        h += '<span style="color:' + ar.c + ';font-size:12px;font-weight:700;">' + ar.n + ' ' + ar.v + '</span>'
        if (ri < auditRedes.length - 1) h += '<span style="color:#2d2a5e;"> &nbsp;|&nbsp; </span>'
      }
    }
    h += '</td></tr></table>'
    // Criterios resumen (top 3 y bottom 3)
    if (auditoriaData.criterios && Array.isArray(auditoriaData.criterios) && auditoriaData.criterios.length > 0) {
      var critOrdenados = auditoriaData.criterios.slice().sort(function(a, b) { return (b.score || 0) - (a.score || 0) })
      var topCrit = critOrdenados[0]
      var bottomCrit = critOrdenados[critOrdenados.length - 1]
      h += '<p style="margin:12px 0 4px;font-size:12px;color:#c4b5fd;line-height:1.5;"><span style="color:#10B981;font-weight:700;">Fortaleza:</span> ' + truncar(topCrit.nombre + ' (' + topCrit.score + '/10)', 120) + '</p>'
      h += '<p style="margin:0;font-size:12px;color:#c4b5fd;line-height:1.5;"><span style="color:#EF4444;font-weight:700;">\u00c1rea de mejora:</span> ' + truncar(bottomCrit.nombre + ' (' + bottomCrit.score + '/10)', 120) + '</p>'
    } else {
      if (auditoriaData.fortaleza) {
        h += '<p style="margin:12px 0 4px;font-size:12px;color:#c4b5fd;line-height:1.5;"><span style="color:#10B981;font-weight:700;">Fortaleza:</span> ' + truncar(auditoriaData.fortaleza, 120) + '</p>'
      }
      if (auditoriaData.debilidad) {
        h += '<p style="margin:0;font-size:12px;color:#c4b5fd;line-height:1.5;"><span style="color:#EF4444;font-weight:700;">\u00c1rea de mejora:</span> ' + truncar(auditoriaData.debilidad, 120) + '</p>'
      }
    }
    // Recomendaciones accionables
    if (auditoriaData.recomendaciones && auditoriaData.recomendaciones.length > 0) {
      h += '<p style="margin:12px 0 4px;font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;">Recomendaciones</p>'
      auditoriaData.recomendaciones.slice(0, 3).forEach(function(rec) {
        var recColor = rec.includes('URGENTE') || rec.includes('CRITICO') ? '#EF4444' : rec.includes('EXCELENTE') ? '#10B981' : '#F59E0B'
        h += '<p style="margin:0 0 2px;font-size:11px;color:' + recColor + ';">&#9679; ' + truncar(rec, 100) + '</p>'
      })
    }
    h += '</td></tr>'
  }

  // === 10. CTA ===
  if (subId) {
    h += '<tr><td bgcolor="#0F0D2E" style="padding:4px 0 0 0;"></td></tr>'
    h += '<tr><td bgcolor="#1a1745" style="padding:20px 28px;text-align:center;">'
    if (estado === 'trial') {
      var diasR = trialEnds ? Math.max(0, Math.ceil((new Date(trialEnds).getTime() - Date.now()) / (1000*60*60*24))) : 7
      h += '<p style="margin:0 0 10px;font-size:11px;color:#F59E0B;font-weight:600;">Prueba gratuita | ' + diasR + ' d\u00edas restantes</p>'
    }
    h += '<table cellpadding="0" cellspacing="0" border="0" align="center"><tr>'
    h += '<td bgcolor="#4F46E5" style="padding:12px 28px;border-radius:8px;">'
    var ctaUrl = estado === 'trial' ? 'https://www.mulleryperez.cl/copilot/contratar/' + subId : 'https://www.mulleryperez.cl/copilot/dashboard/' + subId
    var ctaText = estado === 'trial' ? 'Contrata tu plan' : 'Ver dashboard'
    h += '<a href="' + ctaUrl + '" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">' + ctaText + '</a>'
    h += '</td></tr></table>'
    h += '</td></tr>'
  }

  // === 11. FOOTER ===
  h += '<tr><td bgcolor="#0a0922" style="padding:18px 28px;text-align:center;">'
  h += '<p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Copilot by <span style="color:#ffffff;font-weight:700;">Muller y P\u00e9rez</span></p>'
  var scheduleText = modo === 'diario' ? 'Informe diario 7:30 AM' : modo === 'semanal' ? 'Resumen semanal, lunes 9 AM' : 'Resumen mensual, 1ro de cada mes'
  h += '<p style="margin:0 0 4px;font-size:10px;color:#64748b;">' + scheduleText + '</p>'
  var planIncluye = (plan === 'business' || plan === 'test') ? 'Informes + copies + grilla + guiones + auditor\u00eda + reporte'
    : plan === 'pro' ? 'Informes + copies + grilla mensual'
    : 'Informes + copies semanales'
  h += '<p style="margin:0;font-size:10px;color:#64748b;">' + planIncluye + '</p>'
  h += '</td></tr>'

  // Close wrapper tables
  h += '</table></td></tr></table>'
  return h
}


// === PDF EJECUTIVO PREMIUM ===
function generarPDFEjecutivo(posts, empresas, fecha, modo, resumenIA, copies, auditoria, guiones, sub, grilla) {
  copies = copies || []
  auditoria = auditoria || null
  guiones = guiones || null
  grilla = grilla || null
  var perfil = sub.perfil_empresa || {}
  var brief = perfil.brief || null
  var nombre = perfil.nombre || sub.nombre || sub.email
  var fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  var modoLabel = modo === 'mensual' ? 'Reporte Mensual' : modo === 'semanal' ? 'Reporte Semanal' : 'Reporte Diario'
  var totalLikes = posts.reduce(function(s, p) { return s + (p.likes || 0) }, 0)
  var totalComments = posts.reduce(function(s, p) { return s + (p.comments || 0) }, 0)
  var nEmpresas = Object.keys(empresas).length
  var ia = parseIAResponse(resumenIA)

  var truncar = function(txt, max) {
    if (!txt) return ''
    if (typeof txt !== 'string') txt = String(txt)
    return txt.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').substring(0, max) + (txt.length > max ? '...' : '')
  }

  var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
  h += 'body{margin:0;padding:0;background:#0F0D2E;color:#c4b5fd;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;}'
  h += '.page{width:210mm;min-height:297mm;padding:20mm 18mm;box-sizing:border-box;page-break-after:always;}'
  h += '.page:last-child{page-break-after:auto;}'
  h += 'h1{color:#fff;font-size:22px;margin:0 0 4px;}'
  h += 'h2{color:#a5b4fc;font-size:14px;margin:20px 0 8px;padding-bottom:4px;border-bottom:2px solid #4F46E5;}'
  h += 'h3{color:#fff;font-size:12px;margin:12px 0 4px;}'
  h += '.kpi{display:inline-block;background:#1a1745;border-radius:8px;padding:10px 16px;margin:0 8px 8px 0;text-align:center;min-width:80px;}'
  h += '.kpi-val{font-size:22px;font-weight:800;color:#a5b4fc;}'
  h += '.kpi-label{font-size:9px;color:#64748b;margin-top:2px;}'
  h += '.card{background:#1a1745;border-radius:8px;padding:12px 14px;margin-bottom:8px;}'
  h += '.badge{display:inline-block;font-size:9px;font-weight:700;padding:2px 8px;border-radius:3px;}'
  h += '.green{background:#052e16;color:#10B981;}'
  h += '.yellow{background:#422006;color:#F59E0B;}'
  h += '.red{background:#450a0a;color:#EF4444;}'
  h += '.cyan{background:#083344;color:#06B6D4;}'
  h += '.purple{background:#2e1065;color:#8B5CF6;}'
  h += '.bar{height:6px;border-radius:3px;margin-top:3px;}'
  h += '.bar-fill{height:6px;border-radius:3px;}'
  h += 'table{width:100%;border-collapse:collapse;font-size:10px;}'
  h += 'th{background:#1e1b4b;color:#fff;padding:6px 8px;text-align:left;font-weight:700;}'
  h += 'td{padding:6px 8px;border-bottom:1px solid #2d2a5e;}'
  h += 'tr:nth-child(even) td{background:#12102a;}'
  h += '.footer{text-align:center;font-size:9px;color:#64748b;margin-top:20px;padding-top:12px;border-top:1px solid #2d2a5e;}'
  h += '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}'
  h += '</style></head><body>'

  // === PAGE 1: Resumen Ejecutivo ===
  h += '<div class="page">'
  h += '<p style="font-size:10px;color:#64748b;letter-spacing:2px;margin:0;">M&P COPILOT</p>'
  h += '<h1>' + modoLabel + '</h1>'
  h += '<p style="color:#94a3b8;margin:0 0 16px;">' + nombre + ' &middot; ' + fechaLegible + '</p>'

  // KPIs
  h += '<div>'
  h += '<div class="kpi"><div class="kpi-val">' + posts.length + '</div><div class="kpi-label">Posts</div></div>'
  h += '<div class="kpi"><div class="kpi-val">' + totalLikes.toLocaleString() + '</div><div class="kpi-label">Likes</div></div>'
  h += '<div class="kpi"><div class="kpi-val">' + totalComments.toLocaleString() + '</div><div class="kpi-label">Comments</div></div>'
  h += '<div class="kpi"><div class="kpi-val">' + nEmpresas + '</div><div class="kpi-label">Empresas</div></div>'
  if (auditoria) h += '<div class="kpi"><div class="kpi-val" style="color:' + (auditoria.score_general >= 75 ? '#10B981' : auditoria.score_general >= 50 ? '#F59E0B' : '#EF4444') + ';">' + (auditoria.score_general || 0) + '</div><div class="kpi-label">Score</div></div>'
  h += '</div>'

  // Brief resumen
  if (brief) {
    h += '<h2>Brief Estrat\u00e9gico</h2>'
    if (brief.propuesta_valor_unica) h += '<div class="card"><p style="color:#fff;font-weight:700;font-size:12px;margin:0;">' + truncar(brief.propuesta_valor_unica, 200) + '</p></div>'
    if (brief.territorios_contenido && Array.isArray(brief.territorios_contenido)) {
      h += '<p style="margin:8px 0 4px;font-size:10px;color:#64748b;">TERRITORIOS:</p>'
      brief.territorios_contenido.forEach(function(t) {
        var nom = typeof t === 'object' ? (t.territorio || t.nombre || '') : t
        h += '<span class="badge cyan" style="margin:0 4px 4px 0;">' + truncar(nom, 30) + '</span>'
      })
    }
  }

  // IA Analysis
  if (ia) {
    h += '<h2>An\u00e1lisis Competitivo</h2>'
    if (ia.contexto) h += '<div class="card" style="border-left:3px solid #7C3AED;"><p style="margin:0;">' + truncar(ia.contexto, 400) + '</p></div>'
    if (ia.empresas && ia.empresas.length > 0) {
      h += '<table><tr><th>Empresa</th><th>Estado</th><th>Insight</th></tr>'
      ia.empresas.forEach(function(e) {
        var bClass = e.badge === 'green' ? 'green' : e.badge === 'yellow' ? 'yellow' : 'red'
        h += '<tr><td style="color:#fff;font-weight:700;">' + (e.nombre || '') + '</td>'
        h += '<td><span class="badge ' + bClass + '">' + (e.badge || '') + '</span></td>'
        h += '<td>' + truncar(e.texto, 150) + '</td></tr>'
      })
      h += '</table>'
    }
    if (ia.oportunidad) h += '<div class="card" style="border-left:3px solid #F59E0B;"><p style="margin:0;"><span class="badge yellow">Oportunidad</span> ' + truncar(ia.oportunidad, 200) + '</p></div>'
    if (ia.alerta) h += '<div class="card" style="border-left:3px solid #EF4444;"><p style="margin:0;"><span class="badge red">Alerta</span> ' + truncar(ia.alerta, 200) + '</p></div>'
  }

  // Company table
  h += '<h2>Empresas Monitoreadas</h2>'
  h += '<table><tr><th>Empresa</th><th>Posts</th><th>Likes</th><th>Eng Prom</th></tr>'
  Object.keys(empresas).forEach(function(nom) {
    var emp = empresas[nom]
    var empHandles = [emp.ig, emp.li].filter(Boolean)
    var empPosts = posts.filter(function(p) { return p.red !== 'Prensa' && empHandles.includes(p.handle) })
    var totalN = empPosts.length
    var totalL = empPosts.reduce(function(s, p) { return s + (p.likes || 0) }, 0)
    var totalC = empPosts.reduce(function(s, p) { return s + (p.comments || 0) }, 0)
    var avgE = totalN > 0 ? Math.round((totalL + totalC) / totalN) : 0
    h += '<tr><td style="color:#fff;font-weight:700;">' + nom + '</td><td>' + totalN + '</td><td>' + totalL.toLocaleString() + '</td><td>' + avgE + '</td></tr>'
  })
  h += '</table>'

  h += '<div class="footer">Copilot by Muller y P\u00e9rez &middot; mulleryperez.cl &middot; Generado autom\u00e1ticamente</div>'
  h += '</div>'

  // === PAGE 2: Contenido (si hay copies) ===
  if (copies.length > 0) {
    h += '<div class="page">'
    h += '<p style="font-size:10px;color:#64748b;letter-spacing:2px;margin:0;">M&P COPILOT</p>'
    h += '<h1>Contenido Sugerido</h1>'
    h += '<p style="color:#94a3b8;margin:0 0 16px;">' + copies.length + ' copies generados &middot; Score promedio: ' + Math.round(copies.reduce(function(s, c) { return s + (c.score || 0) }, 0) / copies.length) + '</p>'

    copies.forEach(function(c, i) {
      var platColor = (c.plataforma || '').includes('Instagram') ? '#E4405F' : (c.plataforma || '').includes('LinkedIn') ? '#0A66C2' : '#94a3b8'
      var scoreColor = (c.score || 0) >= 80 ? '#10B981' : (c.score || 0) >= 65 ? '#F59E0B' : '#EF4444'
      h += '<div class="card" style="border-left:3px solid ' + platColor + ';">'
      h += '<p style="margin:0 0 4px;"><span class="badge" style="background:' + platColor + ';color:#fff;">' + (c.plataforma || '') + ' ' + (c.tipo || '') + '</span>'
      h += ' <span style="color:' + scoreColor + ';font-weight:700;">' + (c.score || 0) + '</span></p>'
      h += '<h3 style="margin:4px 0;">' + (c.titulo || 'Copy ' + (i+1)) + '</h3>'
      if (c.competidor_referencia) h += '<p style="font-size:9px;color:#818cf8;font-style:italic;">vs ' + c.competidor_referencia + (c.engagement_referencia ? ' (eng: ' + c.engagement_referencia + ')' : '') + '</p>'
      h += '<p style="white-space:pre-line;font-size:10px;line-height:1.5;">' + truncar(c.copy, 500) + '</p>'
      h += '</div>'
    })

    // Auditoría
    if (auditoria) {
      h += '<h2>Auditor\u00eda de Perfil</h2>'
      h += '<div class="card"><div style="display:flex;align-items:center;gap:16px;">'
      h += '<div style="font-size:36px;font-weight:800;color:' + (auditoria.score_general >= 75 ? '#10B981' : '#F59E0B') + ';">' + (auditoria.score_general || 0) + '</div>'
      h += '<div style="flex:1;">'
      if (Array.isArray(auditoria.criterios)) {
        auditoria.criterios.forEach(function(c) {
          var val = typeof c === 'object' ? c.score : c
          var nom = typeof c === 'object' ? c.nombre : 'Criterio'
          var color = val >= 8 ? '#10B981' : val >= 5 ? '#F59E0B' : '#EF4444'
          h += '<div style="margin-bottom:3px;"><span style="font-size:9px;color:#94a3b8;display:inline-block;width:140px;">' + nom + '</span>'
          h += '<div class="bar" style="display:inline-block;width:80px;background:#2d2a5e;vertical-align:middle;"><div class="bar-fill" style="width:' + (val * 10) + '%;background:' + color + ';"></div></div>'
          h += '<span style="font-size:9px;color:' + color + ';font-weight:700;margin-left:4px;">' + val + '</span></div>'
        })
      }
      h += '</div></div></div>'
    }

    h += '<div class="footer">Copilot by Muller y P\u00e9rez &middot; mulleryperez.cl</div>'
    h += '</div>'
  }

  h += '</body></html>'

  // Generar PDF con wkhtmltopdf
  var tmpH = '/tmp/radar-' + fecha + '-' + modo + '.html'
  var tmpP = '/tmp/radar-' + fecha + '-' + modo + '.pdf'
  fs.writeFileSync(tmpH, h)
  try {
    childProcess.execSync('wkhtmltopdf --quiet --enable-local-file-access --page-size A4 --margin-top 10 --margin-bottom 10 --margin-left 10 --margin-right 10 --print-media-type "' + tmpH + '" "' + tmpP + '"', { timeout: 30000 })
    var buf = fs.readFileSync(tmpP)
    console.log('   PDF ejecutivo: ' + (buf.length / 1024).toFixed(0) + ' KB')
    return buf.toString('base64')
  } catch (e) { console.error('   PDF: ' + e.message); return null }
}

// === EXCEL GRILLA ===
// === EXCEL HELPERS (ExcelJS con formato) ===
var HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338CA' } }
var HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
var BODY_FONT = { size: 10 }
var BORDER_STYLE = { top: { style: 'thin', color: { argb: 'FFE2E8F0' } }, bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }, left: { style: 'thin', color: { argb: 'FFE2E8F0' } }, right: { style: 'thin', color: { argb: 'FFE2E8F0' } } }
var ROW_EVEN = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } }
var ROW_ODD = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
var PLAT_COLORS = { Instagram: 'FFE4405F', LinkedIn: 'FF0A66C2' }

function styleSheet(ws, colCount, dataCount) {
  var hr = ws.getRow(1)
  hr.height = 28
  for (var c = 1; c <= colCount; c++) {
    var cell = hr.getCell(c)
    cell.fill = HEADER_FILL; cell.font = HEADER_FONT
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = BORDER_STYLE
  }
  for (var r = 2; r <= dataCount + 1; r++) {
    var row = ws.getRow(r)
    row.height = 40
    for (var c2 = 1; c2 <= colCount; c2++) {
      var cell2 = row.getCell(c2)
      cell2.font = BODY_FONT
      cell2.alignment = { vertical: 'top', wrapText: true }
      cell2.border = BORDER_STYLE
      cell2.fill = (r % 2 === 0) ? ROW_EVEN : ROW_ODD
    }
  }
}

async function generarExcel(grilla, nombre, fecha) {
  try {
    var ExcelJS = require('exceljs')
    var wb = new ExcelJS.Workbook()
    wb.creator = 'M&P Copilot'
    var ws = wb.addWorksheet('Grilla', { properties: { tabColor: { argb: '4338CA' } } })
    ws.columns = [
      { header: '#', key: 'n', width: 5 }, { header: 'Fecha', key: 'fecha', width: 14 },
      { header: 'Plataforma', key: 'plat', width: 14 }, { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Ángulo', key: 'angulo', width: 16 }, { header: 'Título', key: 'titulo', width: 30 },
      { header: 'Copy', key: 'copy', width: 55 }, { header: 'Hashtags', key: 'hash', width: 30 },
      { header: 'Nota diseño', key: 'diseno', width: 25 }, { header: 'Score QA', key: 'score', width: 10 },
    ]
    grilla.forEach(function(g, i) {
      var row = ws.addRow([i + 1, g.fecha_sugerida || g.dia_semana || ('Día ' + (g.dia || i + 1)),
        g.plataforma || '', g.tipo_post || g.tipo || '', g.angulo || '',
        g.titulo || g.titulo_grafico || g.gancho || '', g.copy || '',
        g.hashtags || '', g.nota_diseno || '', g.score || ''])
      var pc = PLAT_COLORS[g.plataforma] || null
      if (pc) row.getCell(3).font = { bold: true, size: 10, color: { argb: pc } }
      var sv = g.score || 0
      row.getCell(10).font = { bold: true, size: 10, color: { argb: sv >= 80 ? 'FF166534' : sv >= 70 ? 'FF92400E' : 'FF991B1B' } }
      row.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' }
    })
    styleSheet(ws, 10, grilla.length)
    var buf = await wb.xlsx.writeBuffer()
    console.log('   Excel grilla: ' + (buf.length / 1024).toFixed(0) + ' KB, ' + grilla.length + ' posts')
    return buf.toString('base64')
  } catch (e) { console.error('   Excel grilla: ' + e.message); return null }
}

async function generarExcelCopies(copies) {
  try {
    var ExcelJS = require('exceljs')
    var wb = new ExcelJS.Workbook()
    var ws = wb.addWorksheet('Copies', { properties: { tabColor: { argb: '10B981' } } })
    ws.columns = [
      { header: '#', key: 'n', width: 5 }, { header: 'Plataforma', key: 'plat', width: 14 },
      { header: 'Tipo', key: 'tipo', width: 12 }, { header: 'Ángulo', key: 'angulo', width: 18 },
      { header: 'Título', key: 'titulo', width: 30 }, { header: 'Copy completo', key: 'copy', width: 60 },
      { header: 'Hashtags', key: 'hash', width: 30 }, { header: 'Score QA', key: 'score', width: 10 },
    ]
    copies.forEach(function(c, i) {
      var row = ws.addRow([i + 1, c.plataforma || '', c.tipo || '', c.angulo || '',
        c.titulo || '', c.copy || '', c.hashtags || '', c.score || ''])
      row.height = 60
      var pc = PLAT_COLORS[c.plataforma] || null
      if (pc) row.getCell(2).font = { bold: true, size: 10, color: { argb: pc } }
    })
    styleSheet(ws, 8, copies.length)
    var buf = await wb.xlsx.writeBuffer()
    console.log('   Excel copies: ' + (buf.length / 1024).toFixed(0) + ' KB, ' + copies.length + ' copies')
    return buf.toString('base64')
  } catch (e) { console.error('   Excel copies: ' + e.message); return null }
}

async function generarExcelGuiones(guiones) {
  try {
    var ExcelJS = require('exceljs')
    var wb = new ExcelJS.Workbook()
    var ws = wb.addWorksheet('Guiones', { properties: { tabColor: { argb: 'E4405F' } } })
    ws.columns = [
      { header: '#', key: 'n', width: 5 }, { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Duración', key: 'dur', width: 10 }, { header: 'Título', key: 'titulo', width: 30 },
      { header: 'Gancho (hook)', key: 'gancho', width: 40 }, { header: 'Desarrollo', key: 'desarrollo', width: 50 },
      { header: 'Cierre / CTA', key: 'cierre', width: 35 }, { header: 'Sugerencia visual', key: 'visual', width: 40 },
    ]
    guiones.forEach(function(g, i) {
      var row = ws.addRow([i + 1, g.tipo || 'Reel', g.duracion || '30s', g.titulo || '',
        g.gancho || '', g.desarrollo || '', g.cierre || '', g.sugerencia_visual || g.visual || ''])
      row.height = 60
    })
    styleSheet(ws, 8, guiones.length)
    var buf = await wb.xlsx.writeBuffer()
    console.log('   Excel guiones: ' + (buf.length / 1024).toFixed(0) + ' KB, ' + guiones.length + ' guiones')
    return buf.toString('base64')
  } catch (e) { console.error('   Excel guiones: ' + e.message); return null }
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

async function enviarEmailV2(destinos, html, fecha, nPosts, modo, attachments, nombreCliente) {
  var titulo = modo === 'mensual' ? 'Resumen mensual Copilot' : modo === 'semanal' ? 'Resumen semanal Copilot' : 'Tu Copilot diario'
  var asunto = (nombreCliente ? nombreCliente + ' | ' : '') + titulo + ' | ' + nPosts + ' posts | ' + fecha
  var body = { from: 'Copilot <contacto@mulleryperez.cl>', to: destinos, subject: asunto, html: html }
  if (attachments && attachments.length > 0) body.attachments = attachments
  var adjLabel = attachments.map(function(a) { return a.filename.split('.').pop().toUpperCase() }).join('+')
  try {
    var r = await fetch('https://api.resend.com/emails', { method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body) })
    var d = await r.json()
    if (!r.ok) console.error('   Email error:', d)
    else console.log('   Email: ' + destinos.join(',') + ' ' + d.id + (adjLabel ? ' +' + adjLabel : ''))
  } catch (e) { console.error('   Resend: ' + e.message) }
}

// Notificar fallos de agentes a M&P al final del pipeline
async function notificarFallos() {
  if (agenteFallos.length === 0) return
  if (!RESEND_KEY) { console.log('   Sin RESEND_KEY, no se notifican fallos'); return }

  var listaFallos = agenteFallos.map(function(f) {
    return '<li><strong>' + f.agente + '</strong>: ' + f.error + ' (' + f.timestamp + ')</li>'
  }).join('\n')

  var html = '<h2>⚠️ Copilot — Agentes con fallos</h2>'
    + '<p>Los siguientes agentes fallaron después de reintentar:</p>'
    + '<ul>' + listaFallos + '</ul>'
    + '<p>Modo: ' + MODO + ' | Fecha: ' + new Date().toISOString() + '</p>'

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Copilot <contacto@mulleryperez.cl>',
        to: ['contacto@mulleryperez.cl'],
        subject: '⚠️ Copilot fallos: ' + agenteFallos.map(function(f) { return f.agente }).join(', '),
        html: html,
      }),
    })
    console.log('   ⚠️ Email de fallos enviado a contacto@mulleryperez.cl')
  } catch (e) { console.log('   Error enviando notificación de fallos: ' + e.message) }
}

main().then(function() { return notificarFallos() }).catch(function(e) { console.error(e); process.exit(1) })
