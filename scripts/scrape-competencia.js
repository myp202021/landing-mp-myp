// scrape-competencia.js
// Corre todos los días L-V a las 08:50 AM via GitHub Actions
// Scrape Instagram de competidores de Buses Hualpén y guarda en Supabase

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const COMPETIDORES = [
  { nombre: 'Viggo',                 instagram: 'viggo_chile',           web: 'viggo.cl' },
  { nombre: 'Tándem Industrial',     instagram: 'tandem.industrial',     web: 'tandemindustrial.cl' },
  { nombre: 'Yanguas',               instagram: 'yanguas.cl',            web: 'yanguas.cl' },
  { nombre: 'Buses JM',              instagram: 'busesjm.cl',            web: 'busesjm.cl' },
  { nombre: 'CVU',                   instagram: 'transportescvu_ssee',   web: 'transportescvu.cl' },
  { nombre: 'Nortrans',              instagram: 'nortransspa',           web: 'nortrans.cl' },
  { nombre: 'Géminis',               instagram: 'busesgeminis',          web: 'geminis.cl' },
  { nombre: 'Verschae',              instagram: 'flota_verschae',        web: 'verschae.cl' },
  { nombre: 'Transportes Calderón',  instagram: 'transportescalderon',   web: 'transportescalderon.cl' },
  { nombre: 'Pullman Yuris',         instagram: 'busesyuris',            web: 'pullmanyuris.cl' },
  // Sokol y Pullman San Luis sin Instagram confirmado — aparecen como sin actividad
  { nombre: 'Sokol',                 instagram: null,                    web: 'gruposokol.com' },
  { nombre: 'Pullman San Luis',      instagram: null,                    web: 'pullmansanluis.cl' },
]

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  console.log(`📅 Generando reporte para ${hoy}...`)

  // Eliminar reporte del día (para evitar duplicados si se corre de nuevo)
  await supabase.from('reportes_competencia').delete().eq('fecha_reporte', hoy)

  // Competidores con Instagram
  const conIG = COMPETIDORES.filter(c => c.instagram)
  const profileUrls = conIG.map(c => `https://www.instagram.com/${c.instagram}/`)

  let posts = []

  try {
    console.log(`🔍 Scrapeando ${profileUrls.length} perfiles de Instagram...`)

    // Llamada sincrónica a Apify (espera hasta 5 min)
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=280`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: profileUrls,
          resultsType: 'posts',
          resultsLimit: 6,          // últimos 6 posts por perfil
          addParentData: true,      // incluye ownerUsername
        }),
      }
    )

    if (!res.ok) {
      throw new Error(`Apify error: ${res.status} ${await res.text()}`)
    }

    const allPosts = await res.json()

    // Filtrar solo posts de las últimas 24 horas
    posts = allPosts.filter(p => p.timestamp && new Date(p.timestamp) > hace24h)
    console.log(`✅ ${posts.length} posts nuevos en las últimas 24h`)

  } catch (err) {
    console.error('❌ Error en scraping:', err.message)
    // Continua para registrar sin_actividad en todos
  }

  // Insertar posts encontrados
  const competidoresConPost = new Set()

  for (const post of posts) {
    const handle = post.ownerUsername?.toLowerCase()
    const competidor = conIG.find(c => c.instagram?.toLowerCase() === handle)
    if (!competidor) continue

    competidoresConPost.add(competidor.nombre)

    const { error } = await supabase.from('reportes_competencia').insert({
      competidor:       competidor.nombre,
      instagram_handle: competidor.instagram,
      red_social:       'Instagram',
      post_url:         post.url || `https://www.instagram.com/p/${post.shortCode}/`,
      post_texto:       (post.caption || '').substring(0, 600),
      post_imagen:      post.displayUrl || null,
      likes:            post.likesCount || 0,
      comentarios:      post.commentsCount || 0,
      fecha_post:       post.timestamp || null,
      fecha_reporte:    hoy,
      sin_actividad:    false,
    })

    if (error) console.error(`Error guardando post de ${competidor.nombre}:`, error.message)
  }

  // Insertar sin_actividad para los que no publicaron
  for (const comp of COMPETIDORES) {
    if (competidoresConPost.has(comp.nombre)) continue

    await supabase.from('reportes_competencia').insert({
      competidor:       comp.nombre,
      instagram_handle: comp.instagram || null,
      red_social:       'Instagram',
      post_url:         null,
      post_texto:       null,
      post_imagen:      null,
      likes:            null,
      comentarios:      null,
      fecha_post:       null,
      fecha_reporte:    hoy,
      sin_actividad:    true,
    })
  }

  const sinActividad = COMPETIDORES.filter(c => !competidoresConPost.has(c.nombre))
  console.log(`🏁 Reporte listo: ${competidoresConPost.size} con actividad, ${sinActividad.length} sin actividad.`)

  // Enviar email con el reporte
  await enviarEmail({ hoy, postsGuardados: posts, competidoresConPost, sinActividad })
}

function generarHtmlEmail({ hoy, postsGuardados, competidoresConPost, sinActividad }) {
  const fecha = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const conActividad = [...competidoresConPost]

  const postsHtml = postsGuardados.map(post => {
    const handle = post.ownerUsername?.toLowerCase()
    const comp = COMPETIDORES.find(c => c.instagram?.toLowerCase() === handle)
    if (!comp) return ''

    const hora = post.timestamp
      ? new Date(post.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      : ''

    const imagen = post.displayUrl
      ? `<img src="${post.displayUrl}" alt="post" style="width:80px;height:80px;border-radius:8px;object-fit:cover;flex-shrink:0;">`
      : `<div style="width:80px;height:80px;border-radius:8px;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">🚌</div>`

    const postUrl = post.url || `https://www.instagram.com/p/${post.shortCode}/`
    const texto = (post.caption || '').substring(0, 200) + ((post.caption || '').length > 200 ? '...' : '')

    return `
      <div style="display:flex;gap:14px;border:1px solid #E2E8F0;border-radius:10px;padding:14px;margin-bottom:10px;background:#fff;">
        ${imagen}
        <div style="flex:1;min-width:0;">
          <div style="margin-bottom:6px;">
            <strong style="color:#0F172A;font-size:14px;">${comp.nombre}</strong>
            <span style="background:#FCE7F3;color:#9D174D;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:6px;">@${comp.instagram}</span>
            ${hora ? `<span style="color:#94A3B8;font-size:11px;margin-left:6px;">${hora}</span>` : ''}
          </div>
          <p style="font-size:13px;color:#475569;line-height:1.5;margin:0 0 8px;">${texto}</p>
          <span style="font-size:12px;color:#64748B;margin-right:12px;">❤️ ${post.likesCount || 0} likes</span>
          <span style="font-size:12px;color:#64748B;margin-right:12px;">💬 ${post.commentsCount || 0} comentarios</span>
          <a href="${postUrl}" style="font-size:12px;color:#3B82F6;font-weight:600;text-decoration:none;">Ver post →</a>
        </div>
      </div>`
  }).join('')

  const sinActividadHtml = sinActividad.map(c =>
    `<span style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:5px 14px;font-size:12px;color:#94A3B8;display:inline-block;margin:3px;">${c.nombre}</span>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1E293B;">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#0F172A;border-radius:12px 12px 0 0;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <p style="color:#94A3B8;font-size:11px;margin:0 0 4px;">Müller & Pérez — Monitor Competencia</p>
        <h1 style="color:#fff;font-size:17px;font-weight:800;margin:0;">🚌 Reporte Diario — Buses Hualpén</h1>
        <p style="color:#94A3B8;font-size:11px;margin:4px 0 0;">${fecha} · Instagram · 12 competidores monitoreados</p>
      </div>
      <div style="text-align:right;">
        <div style="font-size:26px;font-weight:900;color:#3B82F6;line-height:1;">${conActividad.length}</div>
        <div style="font-size:10px;color:#94A3B8;">con actividad</div>
        <div style="font-size:20px;font-weight:900;color:#94A3B8;line-height:1;margin-top:6px;">${sinActividad.length}</div>
        <div style="font-size:10px;color:#94A3B8;">sin actividad</div>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">

      ${conActividad.length > 0 ? `
      <!-- Con actividad -->
      <div style="background:#DCFCE7;color:#166534;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:14px;">
        ✅ Con actividad hoy — ${conActividad.length} posts
      </div>
      ${postsHtml}
      ` : `
      <div style="background:#FEF9C3;border:1px solid #FDE68A;border-radius:8px;padding:14px;margin-bottom:16px;color:#92400E;font-size:13px;">
        ⚠️ Ningún competidor publicó en las últimas 24 horas.
      </div>
      `}

      <!-- Sin actividad -->
      ${sinActividad.length > 0 ? `
      <div style="margin-top:20px;">
        <div style="background:#F1F5F9;color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:10px;">
          ⚪ Sin actividad hoy — ${sinActividad.length} competidores
        </div>
        <div>${sinActividadHtml}</div>
      </div>
      ` : ''}

    </div>

    <!-- Footer -->
    <p style="text-align:center;font-size:11px;color:#94A3B8;margin-top:16px;">
      Müller & Pérez — Marketing & Performance · Reporte automático L-V 09:00 AM<br>
      <a href="https://www.mulleryperez.cl/crm" style="color:#3B82F6;">Ver en CRM →</a>
    </p>
  </div>
</body>
</html>`
}

async function enviarEmail({ hoy, postsGuardados, competidoresConPost, sinActividad }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no definida — email no enviado.')
    return
  }

  const html = generarHtmlEmail({ hoy, postsGuardados, competidoresConPost, sinActividad })
  const fecha = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Müller & Pérez <contacto@mulleryperez.cl>',
      to: ['felipe.munoz@buseshualpen.cl', 'contacto@mulleryperez.cl'],
      subject: `🚌 Competencia Hualpén — ${fecha} (${competidoresConPost.size} con actividad)`,
      html,
    }),
  })

  if (res.ok) {
    console.log('✉️  Email enviado a felipe.munoz@buseshualpen.cl y contacto@mulleryperez.cl')
  } else {
    const err = await res.text()
    console.error('❌ Error enviando email:', err)
  }
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
