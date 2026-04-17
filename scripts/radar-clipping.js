// radar-clipping.js
// Script parametrizado: lee suscriptores activos de Supabase, scrapea sus cuentas, envia email.
// Modo: --diario (default), --semanal, --mensual
// Cron: diario 07:30 AM Chile, semanal lunes 09:00 AM, mensual 1ro 09:00 AM

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND_KEY = process.env.RESEND
const OPENAI_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const MODO = process.argv.includes('--semanal') ? 'semanal'
           : process.argv.includes('--mensual') ? 'mensual'
           : 'diario'

const VENTANA_HORAS = MODO === 'diario' ? 28 : MODO === 'semanal' ? 7 * 24 + 4 : 31 * 24

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  console.log(`📡 RADAR CLIPPING — ${MODO.toUpperCase()} — ${hoy}`)

  // 1. Leer suscriptores activos
  const { data: suscriptores, error } = await supabase
    .from('clipping_suscripciones')
    .select('*')
    .in('estado', ['trial', 'activo'])

  if (error) { console.error('Error leyendo suscriptores:', error.message); process.exit(1) }
  if (!suscriptores || suscriptores.length === 0) {
    console.log('No hay suscriptores activos. Fin.')
    return
  }

  // Filtrar trials vencidos
  const ahora = new Date()
  const activos = suscriptores.filter(s => {
    if (s.estado === 'trial' && s.trial_ends && new Date(s.trial_ends) < ahora) {
      console.log(`   Trial vencido: ${s.email} — marcando como cancelado`)
      supabase.from('clipping_suscripciones').update({ estado: 'cancelado', updated_at: ahora.toISOString() }).eq('id', s.id)
      return false
    }
    return true
  })

  console.log(`   Suscriptores activos: ${activos.length}`)

  // 2. Agrupar cuentas unicas para scrapear una sola vez
  const cuentasMap = new Map()
  for (const sub of activos) {
    const cuentas = Array.isArray(sub.cuentas) ? sub.cuentas : []
    for (const c of cuentas) {
      const key = `${c.red}:${c.handle}`
      if (!cuentasMap.has(key)) cuentasMap.set(key, c)
    }
  }

  const cuentasUnicas = Array.from(cuentasMap.values())
  console.log(`   Cuentas unicas a scrapear: ${cuentasUnicas.length}`)

  if (cuentasUnicas.length === 0) {
    console.log('No hay cuentas configuradas. Fin.')
    return
  }

  // 3. Scrapear Instagram
  const igCuentas = cuentasUnicas.filter(c => c.red === 'instagram')
  const desde = new Date(Date.now() - VENTANA_HORAS * 60 * 60 * 1000)
  let allPosts = []

  if (igCuentas.length > 0) {
    const profileUrls = igCuentas.map(c => `https://www.instagram.com/${c.handle}/`)
    console.log(`   Scrapeando ${profileUrls.length} cuentas IG...`)
    try {
      const res = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: profileUrls, resultsType: 'posts', resultsLimit: MODO === 'diario' ? 5 : 15, addParentData: true }),
        }
      )
      if (!res.ok) throw new Error(`Apify IG: ${res.status}`)
      const raw = await res.json()
      console.log(`   Posts recibidos de Apify: ${raw.length}`)

      allPosts = raw
        .filter(p => p.timestamp && new Date(p.timestamp) > desde)
        .map(p => ({
          handle: (p.ownerUsername || '').toLowerCase(),
          red: 'instagram',
          texto: (p.caption || '').substring(0, 500),
          url: p.url || `https://www.instagram.com/p/${p.shortCode}/`,
          timestamp: p.timestamp,
          likes: p.likesCount || 0,
          comments: p.commentsCount || 0,
          type: p.type || 'Image',
        }))

      console.log(`   Posts en ventana ${VENTANA_HORAS}h: ${allPosts.length}`)
    } catch (err) {
      console.error('Error Apify:', err.message)
    }
  }

  // 4. Por cada suscriptor, filtrar sus posts y enviar email
  for (const sub of activos) {
    const cuentas = Array.isArray(sub.cuentas) ? sub.cuentas : []
    const handles = cuentas.map(c => c.handle.toLowerCase())
    const misPosts = allPosts.filter(p => handles.includes(p.handle))
    const destinos = Array.isArray(sub.emails_destino) && sub.emails_destino.length > 0
      ? sub.emails_destino
      : [sub.email]

    console.log(`   ${sub.email}: ${misPosts.length} posts de ${handles.length} cuentas`)

    // Generar resumen IA para planes pro+ en modo semanal/mensual
    let resumenIA = ''
    const esPro = sub.plan === 'pro' || sub.plan === 'business'
    if (esPro && misPosts.length > 0 && OPENAI_KEY && (MODO === 'semanal' || MODO === 'mensual')) {
      resumenIA = await generarResumenIA(misPosts, handles, MODO)
    }

    const html = generarEmailHTML(misPosts, cuentas, hoy, MODO, resumenIA)
    await enviarEmail(destinos, html, hoy, misPosts.length, MODO)
  }

  console.log(`\n✅ Radar ${MODO} completado — ${activos.length} suscriptores procesados`)
}

async function generarResumenIA(posts, handles, modo) {
  try {
    const resumen = posts.map(p => `@${p.handle}: "${p.texto.substring(0, 150)}" (${p.likes} likes, ${p.comments} comments)`).join('\n')
    const prompt = modo === 'mensual'
      ? `Eres un analista de redes sociales. Analiza estos posts del mes de las cuentas ${handles.join(', ')}. Genera: 1) Ranking de actividad 2) Tendencias del mes 3) Mejor formato 4) Plan de accion para el proximo mes. En espanol, conciso, accionable. Maximo 200 palabras.`
      : `Eres un analista de redes sociales. Analiza estos posts de la semana de las cuentas ${handles.join(', ')}. Genera: 1) Quien domino 2) Que funciono y que no 3) Oportunidades detectadas 4) Recomendaciones para esta semana. En espanol, conciso, accionable. Maximo 150 palabras.`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: resumen }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })
    if (!res.ok) throw new Error(`OpenAI: ${res.status}`)
    const data = await res.json()
    return data.choices[0].message.content || ''
  } catch (err) {
    console.error('   Error IA:', err.message)
    return ''
  }
}

function generarEmailHTML(posts, cuentas, fecha, modo, resumenIA) {
  const fechaLegible = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'
  const color1 = modo === 'mensual' ? '#7C3AED' : '#4F46E5'
  const color2 = modo === 'mensual' ? '#4F46E5' : '#7C3AED'

  // Agrupar por handle
  const porHandle = new Map()
  for (const p of posts) {
    if (!porHandle.has(p.handle)) porHandle.set(p.handle, [])
    porHandle.get(p.handle).push(p)
  }

  let html = `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;color:#1a1a1a;">
    <div style="background:linear-gradient(135deg,${color1},${color2});color:white;padding:24px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;font-size:22px;">${titulo}</h1>
      <p style="margin:4px 0 0;font-size:14px;opacity:0.9;">${fechaLegible} | ${cuentas.length} cuentas | ${posts.length} posts</p>
    </div>`

  // Resumen IA
  if (resumenIA) {
    html += `
    <div style="background:#EEF2FF;padding:16px 24px;border-left:4px solid ${color1};">
      <p style="font-weight:700;color:${color1};font-size:14px;margin:0 0 8px;">Analisis inteligente</p>
      <p style="font-size:13px;color:#312E81;line-height:1.6;margin:0;white-space:pre-line;">${resumenIA}</p>
    </div>`
  }

  if (posts.length === 0) {
    html += `<div style="background:white;padding:24px;border:1px solid #e5e7eb;"><p style="color:#6b7280;">Sin publicaciones en el periodo monitoreado.</p></div>`
  } else {
    html += `<div style="background:white;padding:24px;border:1px solid #e5e7eb;border-top:none;">`

    // Cuadro comparativo para semanal/mensual
    if (modo !== 'diario' && porHandle.size > 1) {
      html += `<table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
        <tr style="background:#0F172A;color:white;">
          <th style="padding:8px 10px;text-align:left;">Cuenta</th>
          <th style="padding:8px 10px;text-align:center;">Posts</th>
          <th style="padding:8px 10px;text-align:center;">Likes total</th>
          <th style="padding:8px 10px;text-align:center;">Eng. prom.</th>
        </tr>`
      for (const [handle, hPosts] of porHandle) {
        const totalLikes = hPosts.reduce((s, p) => s + p.likes, 0)
        const avgEng = hPosts.length > 0 ? (totalLikes / hPosts.length).toFixed(0) : '0'
        html += `<tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:8px 10px;font-weight:600;">@${handle}</td>
          <td style="padding:8px 10px;text-align:center;">${hPosts.length}</td>
          <td style="padding:8px 10px;text-align:center;">${totalLikes.toLocaleString()}</td>
          <td style="padding:8px 10px;text-align:center;">${avgEng} likes/post</td>
        </tr>`
      }
      html += `</table>`
    }

    // Detalle por cuenta
    for (const [handle, hPosts] of porHandle) {
      const cuenta = cuentas.find(c => c.handle.toLowerCase() === handle) || { handle }
      html += `<h3 style="margin:16px 0 8px;font-size:15px;color:${color1};border-bottom:2px solid ${color1};padding-bottom:4px;">@${handle}</h3>`
      for (const p of hPosts) {
        const preview = p.texto.substring(0, 200).replace(/\n/g, ' ')
        html += `<div style="margin-bottom:10px;padding:12px;background:#f9fafb;border-radius:8px;border-left:3px solid ${color1};">
          <p style="margin:0 0 6px;font-size:13px;color:#1f2937;">${preview}${p.texto.length > 200 ? '...' : ''}</p>
          <p style="margin:0;font-size:12px;color:#6b7280;">
            ❤️ ${p.likes.toLocaleString()} | 💬 ${p.comments} | ${p.type}
            <a href="${p.url}" style="color:#4F46E5;margin-left:12px;">Ver post</a>
          </p>
        </div>`
      }
    }
    html += `</div>`
  }

  html += `
    <div style="padding:16px 24px;background:#f8f9fa;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Radar by Muller y Perez | ${modo === 'diario' ? 'Informe diario 7:00 AM' : modo === 'semanal' ? 'Resumen semanal, cada lunes' : 'Resumen mensual'}</p>
    </div>
  </div>`

  return html
}

async function enviarEmail(destinos, html, fecha, nPosts, modo) {
  const titulo = modo === 'mensual' ? 'Resumen mensual' : modo === 'semanal' ? 'Resumen semanal' : 'Tu Radar diario'
  const subject = `${titulo} | ${nPosts} posts | ${fecha}`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Radar <contacto@mulleryperez.cl>',
        to: destinos,
        subject: subject,
        html: html,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error(`   Email error (${destinos.join(',')}):`, data)
    } else {
      console.log(`   Email enviado a ${destinos.join(',')}: ${data.id}`)
    }
  } catch (err) {
    console.error(`   Error Resend:`, err.message)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
