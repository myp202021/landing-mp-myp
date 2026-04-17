// radar-clipping.js v4
// 4 canales: Instagram + LinkedIn + Facebook + Prensa
// Usa campo "nombre" de cuentas para mostrar nombre de empresa (no handle)
// Modo: --diario | --semanal | --mensual | --dry-run

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const { execSync } = require('child_process')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND_KEY = process.env.RESEND
const OPENAI_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const MODO = process.argv.includes('--semanal') ? 'semanal'
           : process.argv.includes('--mensual') ? 'mensual' : 'diario'
const DRY_RUN = process.argv.includes('--dry-run')
const VENTANA_HORAS = MODO === 'diario' ? 72 : MODO === 'semanal' ? 7 * 24 + 4 : 31 * 24

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

// Mapa handle -> nombre empresa (se llena desde cuentas del suscriptor)
var handleToNombre = {}

async function main() {
  var hoy = new Date().toISOString().split('T')[0]
  console.log('RADAR v4 | ' + MODO.toUpperCase() + ' | ' + hoy + (DRY_RUN ? ' | DRY-RUN' : ''))

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
    return true
  })
  console.log('Suscriptores: ' + activos.length)

  // Construir mapa handle->nombre y sets por red
  var igSet = new Set(), liSet = new Set(), fbSet = new Set(), prensaKws = []
  for (var i = 0; i < activos.length; i++) {
    var cuentas = activos[i].cuentas || []
    for (var j = 0; j < cuentas.length; j++) {
      var c = cuentas[j]
      if (c.nombre) handleToNombre[c.handle.toLowerCase()] = c.nombre
      if (c.red === 'instagram') igSet.add(c.handle.toLowerCase())
      else if (c.red === 'linkedin') liSet.add(c.handle.toLowerCase())
      else if (c.red === 'facebook') fbSet.add(c.handle.toLowerCase())
      else if (c.red === 'prensa' && c.keywords) prensaKws = c.keywords.map(function(k) { return k.toLowerCase() })
    }
  }

  var desde = new Date(Date.now() - VENTANA_HORAS * 60 * 60 * 1000)
  var allPosts = []

  // ═══ INSTAGRAM ═══
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

  // ═══ LINKEDIN ═══
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

  // ═══ FACEBOOK ═══
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

  // ═══ PRENSA ═══
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

  // ═══ TOTALES ═══
  var ig = allPosts.filter(function(p) { return p.red === 'Instagram' }).length
  var li = allPosts.filter(function(p) { return p.red === 'LinkedIn' }).length
  var fb = allPosts.filter(function(p) { return p.red === 'Facebook' }).length
  var pr = allPosts.filter(function(p) { return p.red === 'Prensa' }).length
  console.log('\n=== TOTAL: ' + allPosts.length + ' (IG:' + ig + ' LI:' + li + ' FB:' + fb + ' Prensa:' + pr + ') ===')

  if (DRY_RUN) { console.log('DRY-RUN: fin.'); return }

  // ═══ POR SUSCRIPTOR ═══
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

    var resumenIA = ''
    if (OPENAI_KEY && misPosts.length > 0) {
      resumenIA = await generarResumenIA(misPosts, cuentas, MODO)
    }

    var empresas = extraerEmpresas(cuentas)
    var html = generarEmailHTML(misPosts, cuentas, hoy, MODO, resumenIA, empresas)
    var pdf = generarPDF(html, hoy, MODO)
    await enviarEmail(destinos, html, hoy, misPosts.length, MODO, pdf)
  }
  console.log('\nRadar ' + MODO + ' completado | ' + activos.length + ' suscriptores')
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

// ═══ IA ═══
async function generarResumenIA(posts, cuentas, modo) {
  try {
    var empresas = cuentas.filter(function(c) { return c.nombre && c.red !== 'prensa' }).map(function(c) { return c.nombre })
    var unicas = Array.from(new Set(empresas)).join(', ')
    var data = posts.slice(0, 30).map(function(p) {
      return '[' + p.red + '] ' + p.nombre + ': "' + p.texto.substring(0, 120) + '" (' + p.likes + ' likes)'
    }).join('\n')
    var prompt = modo === 'diario'
      ? 'Eres un analista de redes sociales. Analiza posts de hoy de: ' + unicas + '. Genera resumen: 1) Actividad por empresa 2) Engagement destacado 3) Oportunidades 4) Recomendacion. Espanol profesional, sin emojis. Max 150 palabras.'
      : modo === 'semanal'
      ? 'Analiza posts de la semana de: ' + unicas + '. Genera: 1) Ranking 2) Formato ganador 3) Oportunidades 4) Recomendaciones. Max 200 palabras.'
      : 'Analiza posts del mes de: ' + unicas + '. Genera: 1) Ranking mensual 2) Tendencias 3) Formato ganador 4) Plan de accion. Max 250 palabras.'
    var r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 600,
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: data }] }) })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    var d = await r.json()
    return d.choices[0].message.content || ''
  } catch (e) { console.error('   IA: ' + e.message); return '' }
}

// ═══ EMAIL ═══
function generarEmailHTML(posts, cuentas, fecha, modo, resumenIA, empresas) {
  var fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  var titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'
  var totalLikes = posts.reduce(function(s, p) { return s + p.likes }, 0)
  var redesActivas = Array.from(new Set(posts.map(function(p) { return p.red }))).length
  var nEmpresas = Object.keys(empresas).length

  var igPosts = posts.filter(function(p) { return p.red === 'Instagram' })
  var liPosts = posts.filter(function(p) { return p.red === 'LinkedIn' })
  var fbPosts = posts.filter(function(p) { return p.red === 'Facebook' })
  var prPosts = posts.filter(function(p) { return p.red === 'Prensa' })
  var prensaKws = (cuentas.find(function(c) { return c.red === 'prensa' }) || {}).keywords || []

  var h = ''
  // HEADER
  h += '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;color:#1a1a1a;">'
  h += '<div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
  h += '<h1 style="margin:0;font-size:24px;font-weight:800;">' + titulo + '</h1>'
  h += '<p style="margin:6px 0 0;font-size:14px;opacity:0.9;">' + fechaLegible + '</p>'
  h += '<table style="margin-top:16px;border-collapse:separate;border-spacing:8px 0;"><tr>'
  h += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + posts.length + '</div><div style="font-size:10px;opacity:0.8;">Posts</div></td>'
  h += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + redesActivas + '</div><div style="font-size:10px;opacity:0.8;">Redes</div></td>'
  h += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + totalLikes.toLocaleString() + '</div><div style="font-size:10px;opacity:0.8;">Likes</div></td>'
  h += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + nEmpresas + '</div><div style="font-size:10px;opacity:0.8;">Empresas</div></td>'
  h += '</tr></table></div>'

  // RESUMEN IA
  if (resumenIA) {
    h += '<div style="background:#EEF2FF;padding:20px 28px;border-left:4px solid #4F46E5;">'
    h += '<p style="font-weight:700;color:#3730A3;font-size:15px;margin:0 0 10px;">Analisis inteligente</p>'
    h += '<div style="font-size:13px;color:#312E81;line-height:1.7;white-space:pre-line;">' + resumenIA + '</div></div>'
  }

  // TABLA COMPARATIVA POR EMPRESA
  h += '<div style="background:white;padding:20px 28px;border-bottom:1px solid #e5e7eb;">'
  h += '<p style="font-weight:700;color:#0F172A;font-size:13px;margin:0 0 14px;letter-spacing:0.3px;">ACTIVIDAD POR EMPRESA</p>'
  h += '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
  h += '<tr style="background:#0F172A;color:white;"><th style="padding:10px 14px;text-align:left;">Empresa</th><th style="padding:10px;text-align:center;">IG</th><th style="padding:10px;text-align:center;">LI</th><th style="padding:10px;text-align:center;">FB</th><th style="padding:10px;text-align:center;">Total</th><th style="padding:10px;text-align:center;">Likes</th><th style="padding:10px;text-align:center;">Eng. prom.</th></tr>'
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
    var avgL = totalN > 0 ? Math.round(totalL / totalN) : 0
    var bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc'
    var z = function(n) { return n === 0 ? '<span style="color:#ddd;">0</span>' : '<strong>' + n + '</strong>' }
    h += '<tr style="background:' + bg + ';border-bottom:1px solid #e5e7eb;"><td style="padding:10px 14px;font-weight:700;">' + nombre + '</td>'
    h += '<td style="padding:10px;text-align:center;">' + z(igN) + '</td>'
    h += '<td style="padding:10px;text-align:center;">' + z(liN) + '</td>'
    h += '<td style="padding:10px;text-align:center;">' + z(fbN) + '</td>'
    h += '<td style="padding:10px;text-align:center;font-weight:700;">' + totalN + '</td>'
    h += '<td style="padding:10px;text-align:center;">' + totalL.toLocaleString() + '</td>'
    h += '<td style="padding:10px;text-align:center;">' + avgL.toLocaleString() + '</td></tr>'
    idx++
  })
  h += '</table></div>'

  // SECCIONES POR RED
  if (igPosts.length > 0) h += renderSeccion('Instagram', '#E4405F', igPosts)
  if (liPosts.length > 0) h += renderSeccion('LinkedIn', '#0A66C2', liPosts)
  if (fbPosts.length > 0) h += renderSeccion('Facebook', '#1877F2', fbPosts)
  if (prPosts.length > 0) {
    h += renderSeccion('Prensa y medios', '#F59E0B', prPosts)
    h += '<div style="background:#FFFBEB;padding:12px 20px;border:1px solid #FDE68A;margin:0;">'
    h += '<p style="margin:0;font-size:11px;color:#92400E;"><strong>Medios analizados (' + MEDIOS_PRENSA.length + '):</strong> ' + MEDIOS_PRENSA.map(function(m) { return m.nombre }).join(', ') + '</p>'
    h += '<p style="margin:4px 0 0;font-size:11px;color:#92400E;"><strong>Keywords buscados:</strong> ' + prensaKws.join(', ') + '</p></div>'
  }

  if (posts.length === 0) {
    h += '<div style="background:white;padding:32px 28px;text-align:center;"><p style="color:#6b7280;">Sin publicaciones en el periodo.</p></div>'
  }

  // FOOTER
  h += '<div style="padding:16px 28px;background:#e8e8e8;border-radius:0 0 16px 16px;text-align:center;">'
  h += '<p style="margin:0;font-size:11px;color:#6b7280;">Radar by Muller y Perez | '
  h += modo === 'diario' ? 'Informe diario 7:30 AM' : modo === 'semanal' ? 'Resumen semanal, lunes 9 AM' : 'Resumen mensual, 1ro de cada mes'
  h += '</p><p style="margin:4px 0 0;font-size:10px;color:#9ca3af;">mulleryperez.cl/clipping</p></div></div>'
  return h
}

function renderSeccion(red, color, posts) {
  var porNombre = new Map()
  posts.forEach(function(p) { var n = p.nombre || p.handle; if (!porNombre.has(n)) porNombre.set(n, []); porNombre.get(n).push(p) })

  var h = '<div style="background:white;padding:20px 28px;border-top:3px solid ' + color + ';margin-top:2px;">'
  h += '<div style="display:inline-block;background:' + color + ';color:white;padding:5px 14px;border-radius:6px;font-size:12px;font-weight:700;">' + red + '</div>'
  h += '<span style="font-size:12px;color:#6b7280;margin-left:8px;">' + posts.length + ' posts de ' + porNombre.size + ' empresa' + (porNombre.size > 1 ? 's' : '') + '</span>'

  porNombre.forEach(function(hPosts, nombre) {
    var handle = hPosts[0].handle
    h += '<p style="font-weight:700;font-size:14px;color:#0F172A;margin:16px 0 8px;padding-bottom:6px;border-bottom:2px solid ' + color + ';">' + nombre + ' <span style="font-weight:400;font-size:11px;color:#6b7280;">@' + handle + '</span></p>'
    hPosts.forEach(function(p) {
      var preview = p.texto.substring(0, 250).replace(/\n/g, ' ')
      var isHigh = p.likes > 500
      h += '<div style="margin-bottom:8px;padding:14px;background:#fafafa;border-radius:10px;border-left:3px solid ' + (isHigh ? '#EF4444' : color) + ';">'
      h += '<p style="margin:0 0 8px;font-size:13px;color:#1f2937;line-height:1.6;">' + preview + (p.texto.length > 250 ? '...' : '') + '</p>'
      h += '<div style="font-size:12px;color:#6b7280;">'
      h += '<span style="color:' + (isHigh ? '#EF4444' : '#374151') + ';font-weight:' + (isHigh ? '700' : '400') + ';">' + p.likes.toLocaleString() + ' likes</span>'
      h += ' | ' + p.comments.toLocaleString() + ' comentarios'
      h += ' | <span style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:11px;">' + p.type + '</span>'
      if (isHigh) h += ' | <span style="background:#FEE2E2;color:#DC2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Alto engagement</span>'
      if (p.keywords && p.keywords.length > 0) h += ' | <span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Menciona: ' + p.keywords.join(', ') + '</span>'
      if (p.url) h += ' | <a href="' + p.url + '" style="color:' + color + ';font-weight:600;text-decoration:none;">Ver post</a>'
      h += '</div></div>'
    })
  })
  h += '</div>'
  return h
}

// ═══ PDF ═══
function generarPDF(html, fecha, modo) {
  var tmpH = '/tmp/radar-' + fecha + '-' + modo + '.html'
  var tmpP = '/tmp/radar-' + fecha + '-' + modo + '.pdf'
  fs.writeFileSync(tmpH, '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:20px;background:#f0f0f0;}</style></head><body>' + html + '</body></html>')
  try {
    execSync('wkhtmltopdf --quiet --enable-local-file-access --page-size A4 --margin-top 10 --margin-bottom 10 --margin-left 10 --margin-right 10 "' + tmpH + '" "' + tmpP + '"', { timeout: 30000 })
    var buf = fs.readFileSync(tmpP)
    console.log('   PDF: ' + (buf.length / 1024).toFixed(0) + ' KB')
    return buf.toString('base64')
  } catch (e) { console.error('   PDF: ' + e.message); return null }
}

// ═══ ENVIAR ═══
async function enviarEmail(destinos, html, fecha, nPosts, modo, pdf) {
  var titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'
  var body = { from: 'Radar <contacto@mulleryperez.cl>', to: destinos,
    subject: titulo + ' | ' + nPosts + ' posts | ' + fecha, html: html }
  if (pdf) body.attachments = [{ filename: 'Radar_' + modo + '_' + fecha + '.pdf', content: pdf }]
  try {
    var r = await fetch('https://api.resend.com/emails', { method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body) })
    var d = await r.json()
    if (!r.ok) console.error('   Email error:', d)
    else console.log('   Email: ' + destinos.join(',') + ' ' + d.id + (pdf ? ' (PDF)' : ''))
  } catch (e) { console.error('   Resend: ' + e.message) }
}

main().catch(function(e) { console.error(e); process.exit(1) })
