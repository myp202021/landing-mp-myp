// radar-clipping.js v2
// Multi-plataforma: Instagram + LinkedIn + Facebook + Prensa
// Separado por canal, con analisis IA en todos los modos
// Modo: --diario (default), --semanal, --mensual

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND_KEY = process.env.RESEND
const OPENAI_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const MODO = process.argv.includes('--semanal') ? 'semanal'
           : process.argv.includes('--mensual') ? 'mensual'
           : 'diario'

const VENTANA_HORAS = MODO === 'diario' ? 72 : MODO === 'semanal' ? 7 * 24 + 4 : 31 * 24

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  console.log(`RADAR CLIPPING v2 — ${MODO.toUpperCase()} — ${hoy}`)

  const { data: suscriptores, error } = await supabase
    .from('clipping_suscripciones')
    .select('*')
    .in('estado', ['trial', 'activo'])

  if (error) { console.error('Error:', error.message); process.exit(1) }
  if (!suscriptores || suscriptores.length === 0) { console.log('Sin suscriptores activos.'); return }

  const ahora = new Date()
  const activos = suscriptores.filter(s => {
    if (s.estado === 'trial' && s.trial_ends && new Date(s.trial_ends) < ahora) {
      supabase.from('clipping_suscripciones').update({ estado: 'cancelado', updated_at: ahora.toISOString() }).eq('id', s.id)
      return false
    }
    return true
  })

  console.log(`Suscriptores activos: ${activos.length}`)

  // Agrupar cuentas por red social
  const igHandles = new Set()
  const liHandles = new Set()
  const fbHandles = new Set()
  const prensaKeywords = new Set()

  for (const sub of activos) {
    for (const c of (sub.cuentas || [])) {
      if (c.red === 'instagram') igHandles.add(c.handle.toLowerCase())
      else if (c.red === 'linkedin') liHandles.add(c.handle.toLowerCase())
      else if (c.red === 'facebook') fbHandles.add(c.handle.toLowerCase())
      else if (c.red === 'prensa') (c.keywords || []).forEach(k => prensaKeywords.add(k.toLowerCase()))
    }
  }

  const desde = new Date(Date.now() - VENTANA_HORAS * 60 * 60 * 1000)
  let allPosts = []

  // --- INSTAGRAM ---
  if (igHandles.size > 0) {
    console.log(`\nIG: scrapeando ${igHandles.size} cuentas...`)
    try {
      const urls = Array.from(igHandles).map(h => `https://www.instagram.com/${h}/`)
      const res = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: urls, resultsType: 'posts', resultsLimit: MODO === 'diario' ? 5 : 15, addParentData: true }) }
      )
      if (!res.ok) throw new Error(`Apify IG: ${res.status}`)
      const raw = await res.json()
      const posts = raw.filter(p => p.timestamp && new Date(p.timestamp) > desde).map(p => ({
        red: 'Instagram', handle: (p.ownerUsername || '').toLowerCase(),
        texto: (p.caption || '').substring(0, 500), url: p.url || `https://www.instagram.com/p/${p.shortCode}/`,
        timestamp: p.timestamp, likes: p.likesCount || 0, comments: p.commentsCount || 0, type: p.type || 'Image'
      }))
      allPosts.push(...posts)
      console.log(`   IG: ${raw.length} raw -> ${posts.length} en ventana`)
    } catch (err) { console.error('   IG error:', err.message) }
  }

  // --- LINKEDIN ---
  if (liHandles.size > 0) {
    console.log(`LI: scrapeando ${liHandles.size} empresas...`)
    for (const handle of liHandles) {
      try {
        const res = await fetch(
          `https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=120`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: [`https://www.linkedin.com/company/${handle}/posts/`], maxPosts: MODO === 'diario' ? 5 : 15 }) }
        )
        if (!res.ok) throw new Error(`Apify LI ${handle}: ${res.status}`)
        const raw = await res.json()
        const posts = raw.filter(p => {
          const d = p.postedAt || p.date || p.publishedAt
          return d && new Date(d) > desde
        }).map(p => ({
          red: 'LinkedIn', handle: handle,
          texto: (p.text || p.commentary || '').substring(0, 500),
          url: p.url || p.postUrl || '',
          timestamp: p.postedAt || p.date || p.publishedAt,
          likes: p.likesCount || p.numLikes || 0,
          comments: p.commentsCount || p.numComments || 0,
          type: p.type || 'Post'
        }))
        allPosts.push(...posts)
        console.log(`   LI @${handle}: ${posts.length} posts`)
      } catch (err) { console.error(`   LI @${handle} error:`, err.message) }
    }
  }

  // --- FACEBOOK ---
  if (fbHandles.size > 0) {
    console.log(`FB: scrapeando ${fbHandles.size} paginas...`)
    try {
      const urls = Array.from(fbHandles).map(h => `https://www.facebook.com/${h}/`)
      const res = await fetch(
        `https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startUrls: urls.map(u => ({ url: u })), resultsLimit: MODO === 'diario' ? 5 : 15 }) }
      )
      if (!res.ok) throw new Error(`Apify FB: ${res.status}`)
      const raw = await res.json()
      const posts = raw.filter(p => {
        const d = p.time || p.timestamp
        return d && new Date(d) > desde
      }).map(p => ({
        red: 'Facebook', handle: (p.pageName || p.username || '').toLowerCase(),
        texto: (p.text || p.postText || '').substring(0, 500),
        url: p.url || p.postUrl || '',
        timestamp: p.time || p.timestamp,
        likes: p.likes || p.likesCount || 0,
        comments: p.comments || p.commentsCount || 0,
        type: 'Post'
      }))
      allPosts.push(...posts)
      console.log(`   FB: ${raw.length} raw -> ${posts.length} en ventana`)
    } catch (err) { console.error('   FB error:', err.message) }
  }

  console.log(`\nTotal posts todas las redes: ${allPosts.length}`)

  // --- POR CADA SUSCRIPTOR ---
  for (const sub of activos) {
    const cuentas = sub.cuentas || []
    const handles = cuentas.map(c => c.handle.toLowerCase())
    const misPosts = allPosts.filter(p => handles.includes(p.handle))
    const destinos = (sub.emails_destino && sub.emails_destino.length > 0) ? sub.emails_destino : [sub.email]

    console.log(`\n${sub.email}: ${misPosts.length} posts de ${cuentas.length} cuentas`)

    // Analisis IA (para todos los modos si hay posts)
    let resumenIA = ''
    if (OPENAI_KEY && misPosts.length > 0) {
      resumenIA = await generarResumenIA(misPosts, handles, MODO)
    }

    const html = generarEmailHTML(misPosts, cuentas, hoy, MODO, resumenIA)
    await enviarEmail(destinos, html, hoy, misPosts.length, MODO)
  }

  console.log(`\nRadar ${MODO} completado — ${activos.length} suscriptores`)
}

// --- IA ---
async function generarResumenIA(posts, handles, modo) {
  try {
    const dataPosts = posts.slice(0, 30).map(p =>
      `[${p.red}] @${p.handle}: "${p.texto.substring(0, 120)}" (${p.likes} likes, ${p.comments} comments, ${p.type})`
    ).join('\n')

    const prompt = modo === 'diario'
      ? `Eres un analista de redes sociales experto. Analiza estos posts de hoy de las cuentas monitoreadas. Genera un resumen ejecutivo de 3-4 puntos con: 1) Que esta haciendo cada cuenta 2) Algo que destaque (engagement inusual, promo, cambio de tono) 3) Una oportunidad o recomendacion accionable. Escribe en espanol chileno profesional, sin emojis, conciso. Maximo 120 palabras.`
      : modo === 'semanal'
      ? `Analiza estos posts de la semana. Genera: 1) Quien domino y por que 2) Que formato funciono mejor 3) Oportunidades detectadas 4) Recomendaciones para esta semana. Espanol, conciso, accionable. Maximo 150 palabras.`
      : `Analiza estos posts del mes. Genera: 1) Ranking de actividad 2) Tendencias del mes 3) Formato ganador 4) Plan de accion para el proximo mes. Espanol, conciso, accionable. Maximo 200 palabras.`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 500,
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: dataPosts }],
      }),
    })
    if (!res.ok) throw new Error(`OpenAI: ${res.status}`)
    const data = await res.json()
    return data.choices[0].message.content || ''
  } catch (err) { console.error('   IA error:', err.message); return '' }
}

// --- EMAIL HTML ---
function generarEmailHTML(posts, cuentas, fecha, modo, resumenIA) {
  const fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'

  // Separar por red
  const igPosts = posts.filter(p => p.red === 'Instagram')
  const liPosts = posts.filter(p => p.red === 'LinkedIn')
  const fbPosts = posts.filter(p => p.red === 'Facebook')

  // Agrupar por handle dentro de cada red
  function agrupar(arr) {
    const m = new Map()
    for (const p of arr) { if (!m.has(p.handle)) m.set(p.handle, []); m.get(p.handle).push(p) }
    return m
  }

  let html = `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;color:#1a1a1a;background:#f5f5f5;padding:20px;">
    <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">
      <h1 style="margin:0;font-size:24px;font-weight:800;">${titulo}</h1>
      <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">${fechaLegible}</p>
      <div style="margin-top:16px;display:flex;gap:16px;">
        <div style="background:rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;text-align:center;">
          <div style="font-size:20px;font-weight:800;">${posts.length}</div>
          <div style="font-size:11px;opacity:0.8;">Posts</div>
        </div>
        <div style="background:rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;text-align:center;">
          <div style="font-size:20px;font-weight:800;">${cuentas.length}</div>
          <div style="font-size:11px;opacity:0.8;">Cuentas</div>
        </div>
        <div style="background:rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;text-align:center;">
          <div style="font-size:20px;font-weight:800;">${new Set(posts.map(p => p.red)).size}</div>
          <div style="font-size:11px;opacity:0.8;">Redes</div>
        </div>
        <div style="background:rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;text-align:center;">
          <div style="font-size:20px;font-weight:800;">${posts.reduce((s,p) => s + p.likes, 0).toLocaleString()}</div>
          <div style="font-size:11px;opacity:0.8;">Likes total</div>
        </div>
      </div>
    </div>`

  // Analisis IA
  if (resumenIA) {
    html += `<div style="background:#EEF2FF;padding:20px 28px;border-left:4px solid #4F46E5;">
      <p style="font-weight:700;color:#3730A3;font-size:14px;margin:0 0 10px;">Analisis inteligente</p>
      <p style="font-size:13px;color:#312E81;line-height:1.7;margin:0;white-space:pre-line;">${resumenIA}</p>
    </div>`
  }

  // Cuadro comparativo para semanal/mensual
  if (modo !== 'diario' && posts.length > 0) {
    const porHandle = agrupar(posts)
    html += `<div style="background:white;padding:20px 28px;border-bottom:1px solid #e5e7eb;">
      <p style="font-weight:700;color:#0F172A;font-size:13px;margin:0 0 12px;letter-spacing:0.5px;">CUADRO COMPARATIVO</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#0F172A;color:white;">
          <th style="padding:10px 12px;text-align:left;font-weight:600;">Cuenta</th>
          <th style="padding:10px;text-align:center;font-weight:600;">Red</th>
          <th style="padding:10px;text-align:center;font-weight:600;">Posts</th>
          <th style="padding:10px;text-align:center;font-weight:600;">Likes</th>
          <th style="padding:10px;text-align:center;font-weight:600;">Comentarios</th>
        </tr>`
    let i = 0
    for (const [handle, hPosts] of porHandle) {
      const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc'
      const totalLikes = hPosts.reduce((s, p) => s + p.likes, 0)
      const totalComments = hPosts.reduce((s, p) => s + p.comments, 0)
      const redes = [...new Set(hPosts.map(p => p.red))].join(', ')
      html += `<tr style="background:${bg};border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 12px;font-weight:600;">@${handle}</td>
        <td style="padding:10px;text-align:center;font-size:12px;">${redes}</td>
        <td style="padding:10px;text-align:center;font-weight:700;">${hPosts.length}</td>
        <td style="padding:10px;text-align:center;">${totalLikes.toLocaleString()}</td>
        <td style="padding:10px;text-align:center;">${totalComments.toLocaleString()}</td>
      </tr>`
      i++
    }
    html += `</table></div>`
  }

  // SECCION INSTAGRAM
  if (igPosts.length > 0) {
    html += renderSeccion('Instagram', '#E4405F', igPosts, agrupar(igPosts))
  }

  // SECCION LINKEDIN
  if (liPosts.length > 0) {
    html += renderSeccion('LinkedIn', '#0A66C2', liPosts, agrupar(liPosts))
  }

  // SECCION FACEBOOK
  if (fbPosts.length > 0) {
    html += renderSeccion('Facebook', '#1877F2', fbPosts, agrupar(fbPosts))
  }

  if (posts.length === 0) {
    html += `<div style="background:white;padding:32px 28px;text-align:center;">
      <p style="color:#6b7280;font-size:14px;">Sin publicaciones detectadas en el periodo monitoreado.</p>
      <p style="color:#9ca3af;font-size:12px;margin-top:8px;">Las cuentas monitoreadas no publicaron en las ultimas ${VENTANA_HORAS} horas.</p>
    </div>`
  }

  html += `<div style="padding:16px 28px;background:#f0f0f0;border-radius:0 0 16px 16px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">Radar by Muller y Perez | ${modo === 'diario' ? 'Informe diario 7:30 AM' : modo === 'semanal' ? 'Resumen semanal, cada lunes 9 AM' : 'Resumen mensual, 1ro de cada mes'}</p>
      <p style="margin:4px 0 0;font-size:10px;color:#d1d5db;">mulleryperez.cl/clipping</p>
    </div>
  </div>`

  return html
}

function renderSeccion(red, color, posts, porHandle) {
  let html = `<div style="background:white;padding:20px 28px;border-top:3px solid ${color};margin-top:2px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
      <div style="background:${color};color:white;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;">${red}</div>
      <span style="font-size:13px;color:#6b7280;">${posts.length} posts de ${porHandle.size} cuenta${porHandle.size > 1 ? 's' : ''}</span>
    </div>`

  for (const [handle, hPosts] of porHandle) {
    html += `<div style="margin-bottom:16px;">
      <p style="font-weight:700;font-size:14px;color:#0F172A;margin:0 0 8px;padding-bottom:6px;border-bottom:2px solid ${color};">@${handle}</p>`

    for (const p of hPosts) {
      const preview = p.texto.substring(0, 250).replace(/\n/g, ' ')
      const isHigh = p.likes > 500
      html += `<div style="margin-bottom:8px;padding:14px;background:#fafafa;border-radius:10px;border-left:3px solid ${isHigh ? '#EF4444' : color};">
        <p style="margin:0 0 8px;font-size:13px;color:#1f2937;line-height:1.6;">${preview}${p.texto.length > 250 ? '...' : ''}</p>
        <div style="font-size:12px;color:#6b7280;">
          <span style="color:${isHigh ? '#EF4444' : '#374151'};font-weight:${isHigh ? '700' : '400'};">${p.likes.toLocaleString()} likes</span>
          &nbsp;|&nbsp; ${p.comments.toLocaleString()} comentarios
          &nbsp;|&nbsp; <span style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:11px;">${p.type}</span>
          ${isHigh ? '&nbsp;|&nbsp; <span style="background:#FEE2E2;color:#DC2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Alto engagement</span>' : ''}
          &nbsp;|&nbsp; <a href="${p.url}" style="color:${color};font-weight:600;text-decoration:none;">Ver post</a>
        </div>
      </div>`
    }
    html += `</div>`
  }
  html += `</div>`
  return html
}

// --- ENVIAR EMAIL ---
async function enviarEmail(destinos, html, fecha, nPosts, modo) {
  const titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Radar <contacto@mulleryperez.cl>',
        to: destinos,
        subject: `${titulo} | ${nPosts} posts | ${fecha}`,
        html: html,
      }),
    })
    const data = await res.json()
    if (!res.ok) console.error(`   Email error:`, data)
    else console.log(`   Email enviado a ${destinos.join(',')}: ${data.id}`)
  } catch (err) { console.error('   Resend error:', err.message) }
}

main().catch(err => { console.error(err); process.exit(1) })
