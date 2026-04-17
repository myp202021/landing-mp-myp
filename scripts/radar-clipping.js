// radar-clipping.js v3
// 4 canales: Instagram + LinkedIn + Facebook + Prensa (menciones en medios)
// Modo: --diario | --semanal | --mensual | --dry-run (no envia email)

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const { execSync } = require('child_process')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND_KEY = process.env.RESEND
const OPENAI_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const MODO = process.argv.includes('--semanal') ? 'semanal'
           : process.argv.includes('--mensual') ? 'mensual'
           : 'diario'
const DRY_RUN = process.argv.includes('--dry-run')

const VENTANA_HORAS = MODO === 'diario' ? 72 : MODO === 'semanal' ? 7 * 24 + 4 : 31 * 24

// Medios chilenos para monitoreo de prensa (IG handles)
const MEDIOS_PRENSA = [
  { nombre: 'La Tercera', handle: 'latercera' },
  { nombre: 'BioBioChile', handle: 'biobio' },
  { nombre: 'Emol', handle: 'emol_cl' },
  { nombre: 'Diario Financiero', handle: 'df_mas' },
  { nombre: 'CNN Chile', handle: 'cnnchile' },
  { nombre: 'T13', handle: 't13' },
  { nombre: 'Publimetro Chile', handle: 'publimetrochile' },
  { nombre: 'El Dinamo', handle: 'eldinamo' },
  { nombre: 'Meganoticias', handle: 'meganoticiascl' },
  { nombre: 'ADN Radio', handle: 'adnradiochile' },
  { nombre: 'Cooperativa', handle: 'cooperativa.cl' },
]

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  console.log(`RADAR CLIPPING v3 | ${MODO.toUpperCase()} | ${hoy}${DRY_RUN ? ' | DRY-RUN' : ''}`)

  const { data: suscriptores, error } = await supabase
    .from('clipping_suscripciones')
    .select('*')
    .in('estado', ['trial', 'activo'])

  if (error) { console.error('Error BD:', error.message); process.exit(1) }
  if (!suscriptores || suscriptores.length === 0) { console.log('Sin suscriptores.'); return }

  // Filtrar trials vencidos
  const ahora = new Date()
  const activos = suscriptores.filter(function(s) {
    if (s.estado === 'trial' && s.trial_ends && new Date(s.trial_ends) < ahora) {
      supabase.from('clipping_suscripciones').update({ estado: 'cancelado', updated_at: ahora.toISOString() }).eq('id', s.id)
      console.log('   Trial vencido: ' + s.email)
      return false
    }
    return true
  })
  console.log('Suscriptores activos: ' + activos.length)

  // Agrupar cuentas por red
  var igHandles = new Set()
  var liHandles = new Set()
  var fbHandles = new Set()
  var prensaKeywords = []

  for (var i = 0; i < activos.length; i++) {
    var cuentas = activos[i].cuentas || []
    for (var j = 0; j < cuentas.length; j++) {
      var c = cuentas[j]
      if (c.red === 'instagram') igHandles.add(c.handle.toLowerCase())
      else if (c.red === 'linkedin') liHandles.add(c.handle.toLowerCase())
      else if (c.red === 'facebook') fbHandles.add(c.handle.toLowerCase())
      else if (c.red === 'prensa' && c.keywords) {
        for (var k = 0; k < c.keywords.length; k++) prensaKeywords.push(c.keywords[k].toLowerCase())
      }
    }
  }

  var desde = new Date(Date.now() - VENTANA_HORAS * 60 * 60 * 1000)
  var allPosts = []

  // ════════ INSTAGRAM ════════
  if (igHandles.size > 0) {
    console.log('\n--- INSTAGRAM: ' + igHandles.size + ' cuentas ---')
    try {
      var urls = Array.from(igHandles).map(function(h) { return 'https://www.instagram.com/' + h + '/' })
      var res = await fetch(
        'https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: urls, resultsType: 'posts', resultsLimit: MODO === 'diario' ? 5 : 15, addParentData: true }) }
      )
      if (!res.ok) throw new Error('Apify IG: ' + res.status)
      var raw = await res.json()
      var posts = raw.filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })
        .map(function(p) { return {
          red: 'Instagram', handle: (p.ownerUsername || '').toLowerCase(),
          texto: (p.caption || '').substring(0, 500),
          url: p.url || 'https://www.instagram.com/p/' + p.shortCode + '/',
          timestamp: p.timestamp, likes: p.likesCount || 0, comments: p.commentsCount || 0,
          type: p.type || 'Image'
        }})
      allPosts = allPosts.concat(posts)
      console.log('   Raw: ' + raw.length + ' | En ventana: ' + posts.length)
      for (var h of igHandles) {
        var n = posts.filter(function(p) { return p.handle === h }).length
        console.log('   @' + h + ': ' + n + ' posts')
      }
    } catch (err) { console.error('   IG error: ' + err.message) }
  }

  // ════════ LINKEDIN ════════
  if (liHandles.size > 0) {
    console.log('\n--- LINKEDIN: ' + liHandles.size + ' empresas ---')
    for (var handle of liHandles) {
      try {
        var res = await fetch(
          'https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: ['https://www.linkedin.com/company/' + handle + '/posts/'], maxPosts: MODO === 'diario' ? 5 : 15 }) }
        )
        if (!res.ok) throw new Error('Apify LI: ' + res.status)
        var raw = await res.json()
        var posts = raw.filter(function(p) {
          var d = p.postedAt || p.date || p.publishedAt
          return d && new Date(d) > desde
        }).map(function(p) { return {
          red: 'LinkedIn', handle: handle,
          texto: (p.text || p.commentary || '').substring(0, 500),
          url: p.url || p.postUrl || '',
          timestamp: p.postedAt || p.date || p.publishedAt,
          likes: p.likesCount || p.numLikes || 0, comments: p.commentsCount || p.numComments || 0,
          type: p.type || 'Post'
        }})
        allPosts = allPosts.concat(posts)
        console.log('   ' + handle + ': ' + posts.length + ' posts')
      } catch (err) { console.error('   LI @' + handle + ' error: ' + err.message) }
    }
  }

  // ════════ FACEBOOK ════════
  if (fbHandles.size > 0) {
    console.log('\n--- FACEBOOK: ' + fbHandles.size + ' paginas ---')
    try {
      var urls = Array.from(fbHandles).map(function(h) { return 'https://www.facebook.com/' + h + '/' })
      var res = await fetch(
        'https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startUrls: urls.map(function(u) { return { url: u } }), resultsLimit: MODO === 'diario' ? 5 : 15 }) }
      )
      if (!res.ok) throw new Error('Apify FB: ' + res.status)
      var raw = await res.json()
      var posts = raw.filter(function(p) {
        var d = p.time || p.timestamp
        return d && new Date(d) > desde
      }).map(function(p) { return {
        red: 'Facebook', handle: (p.pageName || p.username || '').toLowerCase(),
        texto: (p.text || p.postText || '').substring(0, 500),
        url: p.url || p.postUrl || '',
        timestamp: p.time || p.timestamp,
        likes: p.likes || p.likesCount || 0, comments: p.comments || p.commentsCount || 0,
        type: 'Post'
      }})
      allPosts = allPosts.concat(posts)
      console.log('   Raw: ' + raw.length + ' | En ventana: ' + posts.length)
      for (var h of fbHandles) {
        var n = posts.filter(function(p) { return p.handle.includes(h.toLowerCase().substring(0, 8)) }).length
        console.log('   ' + h + ': ' + n + ' posts')
      }
    } catch (err) { console.error('   FB error: ' + err.message) }
  }

  // ════════ PRENSA (menciones en medios chilenos) ════════
  if (prensaKeywords.length > 0) {
    console.log('\n--- PRENSA: buscando menciones de [' + prensaKeywords.join(', ') + '] ---')
    try {
      var medioUrls = MEDIOS_PRENSA.map(function(m) { return 'https://www.instagram.com/' + m.handle + '/' })
      var res = await fetch(
        'https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=300',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: medioUrls, resultsType: 'posts', resultsLimit: 10, addParentData: true }) }
      )
      if (!res.ok) throw new Error('Apify Prensa: ' + res.status)
      var raw = await res.json()
      var recientes = raw.filter(function(p) { return p.timestamp && new Date(p.timestamp) > desde })
      console.log('   Posts de medios en ventana: ' + recientes.length)

      var menciones = recientes.filter(function(p) {
        var texto = ((p.caption || '') + ' ' + (p.ownerUsername || '')).toLowerCase()
        return prensaKeywords.some(function(kw) { return texto.includes(kw) })
      }).map(function(p) {
        var medio = MEDIOS_PRENSA.find(function(m) { return m.handle.toLowerCase() === (p.ownerUsername || '').toLowerCase() })
        var kwFound = prensaKeywords.filter(function(kw) { return (p.caption || '').toLowerCase().includes(kw) })
        return {
          red: 'Prensa', handle: medio ? medio.nombre : (p.ownerUsername || ''),
          texto: (p.caption || '').substring(0, 500),
          url: p.url || 'https://www.instagram.com/p/' + p.shortCode + '/',
          timestamp: p.timestamp, likes: p.likesCount || 0, comments: p.commentsCount || 0,
          type: 'Mencion', keywords: kwFound
        }
      })
      allPosts = allPosts.concat(menciones)
      console.log('   Menciones encontradas: ' + menciones.length)
    } catch (err) { console.error('   Prensa error: ' + err.message) }
  }

  // ════════ RESUMEN ════════
  var igCount = allPosts.filter(function(p) { return p.red === 'Instagram' }).length
  var liCount = allPosts.filter(function(p) { return p.red === 'LinkedIn' }).length
  var fbCount = allPosts.filter(function(p) { return p.red === 'Facebook' }).length
  var prCount = allPosts.filter(function(p) { return p.red === 'Prensa' }).length
  console.log('\n=== TOTAL: ' + allPosts.length + ' posts (IG:' + igCount + ' LI:' + liCount + ' FB:' + fbCount + ' Prensa:' + prCount + ') ===')

  if (DRY_RUN) {
    console.log('\nDRY-RUN: no se envian emails.')
    allPosts.slice(0, 5).forEach(function(p, i) {
      console.log('   ' + (i+1) + '. [' + p.red + '] @' + p.handle + ': ' + p.texto.substring(0, 80) + '... (' + p.likes + ' likes)')
    })
    return
  }

  // ════════ POR CADA SUSCRIPTOR ════════
  for (var si = 0; si < activos.length; si++) {
    var sub = activos[si]
    var cuentas = sub.cuentas || []
    var handles = cuentas.filter(function(c) { return c.red !== 'prensa' }).map(function(c) { return c.handle.toLowerCase() })
    var misPosts = allPosts.filter(function(p) {
      if (p.red === 'Prensa') return true // menciones de prensa van para todos
      return handles.includes(p.handle)
    })
    var destinos = (sub.emails_destino && sub.emails_destino.length > 0) ? sub.emails_destino : [sub.email]

    console.log('\n' + sub.email + ': ' + misPosts.length + ' posts')

    // Analisis IA
    var resumenIA = ''
    if (OPENAI_KEY && misPosts.length > 0) {
      resumenIA = await generarResumenIA(misPosts, cuentas, MODO)
    }

    var html = generarEmailHTML(misPosts, cuentas, hoy, MODO, resumenIA, sub)
    var pdfBase64 = generarPDF(html, hoy, MODO)
    await enviarEmail(destinos, html, hoy, misPosts.length, MODO, pdfBase64)
  }

  console.log('\nRadar ' + MODO + ' completado | ' + activos.length + ' suscriptores')
}

// ═══════════════════════ IA ═══════════════════════
async function generarResumenIA(posts, cuentas, modo) {
  try {
    var dataPosts = posts.slice(0, 30).map(function(p) {
      return '[' + p.red + '] @' + p.handle + ': "' + p.texto.substring(0, 120) + '" (' + p.likes + ' likes, ' + p.comments + ' comments)'
    }).join('\n')

    var empresas = cuentas.filter(function(c) { return c.red !== 'prensa' }).map(function(c) { return c.handle }).join(', ')

    var prompt = modo === 'diario'
      ? 'Eres un analista de redes sociales senior. Analiza estos posts de hoy de las cuentas ' + empresas + '. Genera un resumen ejecutivo con: 1) Actividad destacada por empresa 2) Engagement inusual o tendencias 3) Oportunidades o amenazas detectadas 4) Una recomendacion accionable concreta. Espanol profesional, sin emojis. Maximo 150 palabras.'
      : modo === 'semanal'
      ? 'Analiza estos posts de la semana de ' + empresas + '. Genera: 1) Ranking de actividad 2) Quien domino y por que 3) Formato que mejor funciono 4) Oportunidades 5) Recomendaciones. Espanol, conciso. Maximo 200 palabras.'
      : 'Analiza estos posts del mes de ' + empresas + '. Genera: 1) Ranking mensual 2) Tendencias del mes 3) Formato ganador 4) Mejor dia y horario 5) Plan de accion para el proximo mes. Espanol, conciso. Maximo 250 palabras.'

    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 600,
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: dataPosts }] }),
    })
    if (!res.ok) throw new Error('OpenAI: ' + res.status)
    var data = await res.json()
    return data.choices[0].message.content || ''
  } catch (err) { console.error('   IA error: ' + err.message); return '' }
}

// ═══════════════════════ EMAIL HTML ═══════════════════════
function generarEmailHTML(posts, cuentas, fecha, modo, resumenIA, sub) {
  var fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  var titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'

  var igPosts = posts.filter(function(p) { return p.red === 'Instagram' })
  var liPosts = posts.filter(function(p) { return p.red === 'LinkedIn' })
  var fbPosts = posts.filter(function(p) { return p.red === 'Facebook' })
  var prPosts = posts.filter(function(p) { return p.red === 'Prensa' })

  var totalLikes = posts.reduce(function(s, p) { return s + p.likes }, 0)
  var redesActivas = new Set(posts.map(function(p) { return p.red })).size

  var html = '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;color:#1a1a1a;background:#f5f5f5;padding:20px;">'

  // HEADER
  html += '<div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
  html += '<h1 style="margin:0;font-size:24px;font-weight:800;">' + titulo + '</h1>'
  html += '<p style="margin:6px 0 0;font-size:14px;opacity:0.9;">' + fechaLegible + '</p>'
  html += '<table style="margin-top:16px;border-collapse:separate;border-spacing:8px 0;"><tr>'
  html += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + posts.length + '</div><div style="font-size:10px;opacity:0.8;">Posts</div></td>'
  html += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + redesActivas + '</div><div style="font-size:10px;opacity:0.8;">Redes</div></td>'
  html += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + totalLikes.toLocaleString() + '</div><div style="font-size:10px;opacity:0.8;">Likes</div></td>'
  html += '<td style="background:rgba(255,255,255,0.15);padding:10px 18px;border-radius:8px;text-align:center;"><div style="font-size:22px;font-weight:800;">' + cuentas.length + '</div><div style="font-size:10px;opacity:0.8;">Cuentas</div></td>'
  html += '</tr></table></div>'

  // RESUMEN IA
  if (resumenIA) {
    html += '<div style="background:#EEF2FF;padding:20px 28px;border-left:4px solid #4F46E5;">'
    html += '<p style="font-weight:700;color:#3730A3;font-size:15px;margin:0 0 10px;">Analisis inteligente</p>'
    html += '<div style="font-size:13px;color:#312E81;line-height:1.7;margin:0;white-space:pre-line;">' + resumenIA + '</div>'
    html += '</div>'
  }

  // CUADRO COMPARATIVO (semanal/mensual)
  if (modo !== 'diario' && posts.length > 0) {
    html += renderComparativo(posts)
  }

  // SECCIONES POR RED
  if (igPosts.length > 0) html += renderSeccion('Instagram', '#E4405F', igPosts)
  if (liPosts.length > 0) html += renderSeccion('LinkedIn', '#0A66C2', liPosts)
  if (fbPosts.length > 0) html += renderSeccion('Facebook', '#1877F2', fbPosts)
  if (prPosts.length > 0) html += renderSeccion('Prensa', '#F59E0B', prPosts)

  // Sin posts
  if (posts.length === 0) {
    html += '<div style="background:white;padding:32px 28px;text-align:center;">'
    html += '<p style="color:#6b7280;font-size:14px;">Sin publicaciones detectadas en el periodo monitoreado.</p>'
    html += '<p style="color:#9ca3af;font-size:12px;margin-top:8px;">Ventana: ultimas ' + VENTANA_HORAS + ' horas.</p></div>'
  }

  // FOOTER
  html += '<div style="padding:16px 28px;background:#e8e8e8;border-radius:0 0 16px 16px;text-align:center;">'
  html += '<p style="margin:0;font-size:11px;color:#6b7280;">Radar by Muller y Perez | '
  html += modo === 'diario' ? 'Informe diario 7:30 AM' : modo === 'semanal' ? 'Resumen semanal, cada lunes 9 AM' : 'Resumen mensual, 1ro de cada mes'
  html += '</p><p style="margin:4px 0 0;font-size:10px;color:#9ca3af;">mulleryperez.cl/clipping</p></div></div>'

  return html
}

function renderComparativo(posts) {
  var porHandle = new Map()
  posts.forEach(function(p) { if (!porHandle.has(p.handle)) porHandle.set(p.handle, []); porHandle.get(p.handle).push(p) })

  var html = '<div style="background:white;padding:20px 28px;border-bottom:1px solid #e5e7eb;">'
  html += '<p style="font-weight:700;color:#0F172A;font-size:13px;margin:0 0 12px;">CUADRO COMPARATIVO</p>'
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
  html += '<tr style="background:#0F172A;color:white;"><th style="padding:10px 12px;text-align:left;">Cuenta</th><th style="padding:10px;text-align:center;">Red</th><th style="padding:10px;text-align:center;">Posts</th><th style="padding:10px;text-align:center;">Likes</th><th style="padding:10px;text-align:center;">Comentarios</th></tr>'

  var i = 0
  porHandle.forEach(function(hPosts, handle) {
    var bg = i % 2 === 0 ? '#ffffff' : '#f8fafc'
    var totalL = hPosts.reduce(function(s, p) { return s + p.likes }, 0)
    var totalC = hPosts.reduce(function(s, p) { return s + p.comments }, 0)
    var redes = Array.from(new Set(hPosts.map(function(p) { return p.red }))).join(', ')
    html += '<tr style="background:' + bg + ';border-bottom:1px solid #e5e7eb;"><td style="padding:10px 12px;font-weight:600;">@' + handle + '</td><td style="padding:10px;text-align:center;font-size:11px;">' + redes + '</td><td style="padding:10px;text-align:center;font-weight:700;">' + hPosts.length + '</td><td style="padding:10px;text-align:center;">' + totalL.toLocaleString() + '</td><td style="padding:10px;text-align:center;">' + totalC.toLocaleString() + '</td></tr>'
    i++
  })
  html += '</table></div>'
  return html
}

function renderSeccion(red, color, posts) {
  var porHandle = new Map()
  posts.forEach(function(p) { if (!porHandle.has(p.handle)) porHandle.set(p.handle, []); porHandle.get(p.handle).push(p) })

  var html = '<div style="background:white;padding:20px 28px;border-top:3px solid ' + color + ';margin-top:2px;">'
  html += '<div style="display:inline-block;background:' + color + ';color:white;padding:5px 14px;border-radius:6px;font-size:12px;font-weight:700;margin-bottom:16px;">' + red + ' | ' + posts.length + ' posts</div>'

  porHandle.forEach(function(hPosts, handle) {
    html += '<div style="margin-bottom:16px;">'
    html += '<p style="font-weight:700;font-size:14px;color:#0F172A;margin:0 0 8px;padding-bottom:6px;border-bottom:2px solid ' + color + ';">@' + handle + '</p>'

    hPosts.forEach(function(p) {
      var preview = p.texto.substring(0, 250).replace(/\n/g, ' ')
      var isHigh = p.likes > 500
      html += '<div style="margin-bottom:8px;padding:14px;background:#fafafa;border-radius:10px;border-left:3px solid ' + (isHigh ? '#EF4444' : color) + ';">'
      html += '<p style="margin:0 0 8px;font-size:13px;color:#1f2937;line-height:1.6;">' + preview + (p.texto.length > 250 ? '...' : '') + '</p>'
      html += '<div style="font-size:12px;color:#6b7280;">'
      html += '<span style="color:' + (isHigh ? '#EF4444' : '#374151') + ';font-weight:' + (isHigh ? '700' : '400') + ';">' + p.likes.toLocaleString() + ' likes</span>'
      html += ' | ' + p.comments.toLocaleString() + ' comentarios'
      html += ' | <span style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:11px;">' + p.type + '</span>'
      if (isHigh) html += ' | <span style="background:#FEE2E2;color:#DC2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Alto engagement</span>'
      if (p.keywords && p.keywords.length > 0) html += ' | <span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Menciona: ' + p.keywords.join(', ') + '</span>'
      if (p.url) html += ' | <a href="' + p.url + '" style="color:' + color + ';font-weight:600;text-decoration:none;">Ver post</a>'
      html += '</div></div>'
    })
    html += '</div>'
  })
  html += '</div>'
  return html
}

// ═══════════════════════ PDF ═══════════════════════
function generarPDF(html, fecha, modo) {
  var tmpHtml = '/tmp/radar-' + fecha + '-' + modo + '.html'
  var tmpPdf = '/tmp/radar-' + fecha + '-' + modo + '.pdf'
  var fullHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:#f5f5f5;}</style></head><body>' + html + '</body></html>'
  fs.writeFileSync(tmpHtml, fullHtml)
  try {
    execSync('wkhtmltopdf --quiet --enable-local-file-access --page-size A4 --margin-top 10 --margin-bottom 10 --margin-left 10 --margin-right 10 "' + tmpHtml + '" "' + tmpPdf + '"', { timeout: 30000 })
    var pdfBuffer = fs.readFileSync(tmpPdf)
    console.log('   PDF: ' + (pdfBuffer.length / 1024).toFixed(0) + ' KB')
    return pdfBuffer.toString('base64')
  } catch (err) {
    console.error('   PDF error: ' + err.message)
    return null
  }
}

// ═══════════════════════ EMAIL ═══════════════════════
async function enviarEmail(destinos, html, fecha, nPosts, modo, pdfBase64) {
  var titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'
  var emailBody = {
    from: 'Radar <contacto@mulleryperez.cl>',
    to: destinos,
    subject: titulo + ' | ' + nPosts + ' posts | ' + fecha,
    html: html,
  }
  if (pdfBase64) {
    emailBody.attachments = [{ filename: 'Radar_' + modo + '_' + fecha + '.pdf', content: pdfBase64 }]
  }
  try {
    var res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailBody),
    })
    var data = await res.json()
    if (!res.ok) console.error('   Email error:', data)
    else console.log('   Email enviado a ' + destinos.join(',') + ': ' + data.id + (pdfBase64 ? ' (con PDF)' : ' (sin PDF)'))
  } catch (err) { console.error('   Resend error: ' + err.message) }
}

main().catch(function(err) { console.error(err); process.exit(1) })
