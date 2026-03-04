// scrape-competencia.js
// Corre todos los días L-V a las 08:50 AM via GitHub Actions
// Scrape Instagram + LinkedIn + Facebook de competidores de Buses Hualpén
// Detecta ofertas laborales y envía reporte como PDF adjunto

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const COMPETIDORES = [
  { nombre: 'Viggo',                instagram: 'viggo_chile',         linkedin: 'https://www.linkedin.com/company/viggo-chile/',       facebook: 'https://www.facebook.com/ViggoChile/',                                       web: 'viggo.cl' },
  { nombre: 'Tándem Industrial',    instagram: 'tandem.industrial',   linkedin: 'https://www.linkedin.com/company/tandem-industrial/', facebook: 'https://www.facebook.com/tandemindustrial.cl',                               web: 'tandemindustrial.cl' },
  { nombre: 'Yanguas',              instagram: 'yanguas.cl',          linkedin: 'https://www.linkedin.com/company/buses-yanguas/',     facebook: null,                                                                         web: 'yanguas.cl' },
  { nombre: 'Buses JM',             instagram: 'busesjm.cl',          linkedin: null,                                                 facebook: 'https://www.facebook.com/BusesjmEmpresas/',                                  web: 'busesjm.cl' },
  { nombre: 'CVU',                  instagram: 'transportescvu_ssee', linkedin: 'https://www.linkedin.com/company/transportes-cvu/',  facebook: null,                                                                         web: 'transportescvu.cl' },
  { nombre: 'Nortrans',             instagram: 'nortransspa',         linkedin: 'https://www.linkedin.com/company/nortrans-ltda/',    facebook: 'https://www.facebook.com/sociedaddetransportesnortransLtda',                 web: 'nortrans.cl' },
  { nombre: 'Géminis',              instagram: 'busesgeminis',        linkedin: 'https://www.linkedin.com/company/geminis/',          facebook: 'https://www.facebook.com/Buses-G%C3%A9minis-210346879150954/',              web: 'geminis.cl' },
  { nombre: 'Verschae',             instagram: 'flota_verschae',      linkedin: null,                                                 facebook: 'https://www.facebook.com/profile.php?id=100063564674214',                   web: 'verschae.cl' },
  { nombre: 'Transportes Calderón', instagram: 'transportescalderon', linkedin: null,                                                 facebook: null,                                                                         web: 'transportescalderon.cl' },
  { nombre: 'Pullman Yuris',        instagram: 'busesyuris',          linkedin: null,                                                 facebook: 'https://www.facebook.com/busesyuris',                                        web: 'pullmanyuris.cl' },
  { nombre: 'Sokol',                instagram: null,                  linkedin: 'https://www.linkedin.com/company/sokol-s-a/',        facebook: null,                                                                         web: 'gruposokol.com' },
  { nombre: 'Pullman San Luis',     instagram: null,                  linkedin: null,                                                 facebook: null,                                                                         web: 'pullmansanluis.cl' },
]

// ─── Detección de ofertas laborales ─────────────────────────────────────────
const KEYWORDS_OFERTA = [
  'se busca', 'buscamos', 'oferta laboral', 'postula', 'postúlate', 'vacante',
  'cargo disponible', 'remuneración', 'conductor', 'chofer', 'mecánico', 'técnico',
  'operador', 'jornada', 'contrato', 'enviar cv', 'envía tu cv', 'trabaja con nosotros',
  'únete a', 'incorporar', 'requisitos', 'experiencia comprobable', 'disponibilidad',
]

function esOfertaLaboral(texto) {
  if (!texto) return false
  const lower = texto.toLowerCase()
  return KEYWORDS_OFERTA.some(kw => lower.includes(kw))
}


// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  console.log(`📅 Generando reporte para ${hoy}...`)

  await supabase.from('reportes_competencia').delete().eq('fecha_reporte', hoy)

  // ── Instagram ──────────────────────────────────────────────────────────────
  const conIG = COMPETIDORES.filter(c => c.instagram)
  const profileUrls = conIG.map(c => `https://www.instagram.com/${c.instagram}/`)
  let postsIG = []

  try {
    console.log(`📸 Scrapeando ${profileUrls.length} perfiles de Instagram...`)
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=280`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directUrls: profileUrls, resultsType: 'posts', resultsLimit: 6, addParentData: true }),
      }
    )
    if (!res.ok) throw new Error(`Apify IG: ${res.status} ${await res.text()}`)
    const all = await res.json()
    postsIG = all.filter(p => p.timestamp && new Date(p.timestamp) > hace24h)
    console.log(`✅ Instagram: ${postsIG.length} posts en las últimas 24h`)
  } catch (err) {
    console.error('❌ Error Instagram:', err.message)
  }

  // Guardar posts Instagram
  const competidoresConPost = new Set()
  for (const post of postsIG) {
    const handle = post.ownerUsername?.toLowerCase()
    const comp = conIG.find(c => c.instagram?.toLowerCase() === handle)
    if (!comp) continue
    competidoresConPost.add(comp.nombre)

    await supabase.from('reportes_competencia').insert({
      competidor: comp.nombre, instagram_handle: comp.instagram, red_social: 'Instagram',
      post_url: post.url || `https://www.instagram.com/p/${post.shortCode}/`,
      post_texto: (post.caption || '').substring(0, 600),
      post_imagen: post.displayUrl || null,
      likes: post.likesCount || 0, comentarios: post.commentsCount || 0,
      fecha_post: post.timestamp || null, fecha_reporte: hoy, sin_actividad: false,
    })
  }

  // sin_actividad para los que no publicaron
  for (const comp of COMPETIDORES) {
    if (competidoresConPost.has(comp.nombre)) continue
    await supabase.from('reportes_competencia').insert({
      competidor: comp.nombre, instagram_handle: comp.instagram || null, red_social: 'Instagram',
      post_url: null, post_texto: null, post_imagen: null, likes: null, comentarios: null,
      fecha_post: null, fecha_reporte: hoy, sin_actividad: true,
    })
  }

  const sinActividad = COMPETIDORES.filter(c => !competidoresConPost.has(c.nombre))
  console.log(`🏁 Instagram: ${competidoresConPost.size} con actividad, ${sinActividad.length} sin actividad.`)

  // ── LinkedIn ───────────────────────────────────────────────────────────────
  const postsLinkedin = await scrapeLinkedin(hace24h)

  // ── Facebook ───────────────────────────────────────────────────────────────
  const postsFacebook = await scrapeFacebook(hace24h)

  // ── Email con PDF ──────────────────────────────────────────────────────────
  await enviarEmail({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook })
}

// ─── Scraping LinkedIn ───────────────────────────────────────────────────────
async function scrapeLinkedin(hace24h) {
  const conLI = COMPETIDORES.filter(c => c.linkedin)
  if (conLI.length === 0) return []
  console.log(`💼 Scrapeando ${conLI.length} perfiles de LinkedIn...`)
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/bebity~linkedin-company-posts-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyUrls: conLI.map(c => c.linkedin), maxPosts: 5 }),
      }
    )
    if (!res.ok) { console.warn(`⚠️ LinkedIn: ${res.status}`); return [] }
    const all = await res.json()
    const recientes = all.filter(p => p.postedAt && new Date(p.postedAt) > hace24h)
    console.log(`✅ LinkedIn: ${recientes.length} posts en últimas 24h`)
    return recientes
  } catch (err) {
    console.warn('⚠️ Error LinkedIn (se omite):', err.message)
    return []
  }
}

// ─── Scraping Facebook ───────────────────────────────────────────────────────
async function scrapeFacebook(hace24h) {
  const conFB = COMPETIDORES.filter(c => c.facebook)
  if (conFB.length === 0) return []
  console.log(`📘 Scrapeando ${conFB.length} perfiles de Facebook...`)
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startUrls: conFB.map(c => ({ url: c.facebook })), resultsLimit: 5 }),
      }
    )
    if (!res.ok) { console.warn(`⚠️ Facebook: ${res.status}`); return [] }
    const all = await res.json()
    const recientes = all.filter(p => p.time && new Date(p.time) > hace24h)
    console.log(`✅ Facebook: ${recientes.length} posts en últimas 24h`)
    return recientes
  } catch (err) {
    console.warn('⚠️ Error Facebook (se omite):', err.message)
    return []
  }
}

// ─── HTML del reporte (usado tanto en PDF como fallback del email) ────────────
function generarHtmlReporte({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook }) {
  const fecha = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const conActividad = [...competidoresConPost]

  function ofertaBadge(texto) {
    return esOfertaLaboral(texto)
      ? `<span style="background:#FEF9C3;color:#92400E;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:6px;border:1px solid #FDE68A;">💼 OFERTA LABORAL</span>`
      : ''
  }

  const postsIGHtml = postsIG.map(post => {
    const handle = post.ownerUsername?.toLowerCase()
    const comp = COMPETIDORES.find(c => c.instagram?.toLowerCase() === handle)
    if (!comp) return ''
    const hora = post.timestamp ? new Date(post.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : ''
    const imagen = post.displayUrl
      ? `<img src="${post.displayUrl}" alt="post" style="width:72px;height:72px;border-radius:8px;object-fit:cover;flex-shrink:0;">`
      : `<div style="width:72px;height:72px;border-radius:8px;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">🚌</div>`
    const texto = (post.caption || '').substring(0, 200) + ((post.caption || '').length > 200 ? '...' : '')
    const postUrl = post.url || `https://www.instagram.com/p/${post.shortCode}/`
    return `
      <div style="display:flex;gap:12px;border:1px solid #E2E8F0;border-radius:10px;padding:12px;margin-bottom:10px;background:#fff;">
        ${imagen}
        <div style="flex:1;min-width:0;">
          <div style="margin-bottom:5px;">
            <strong style="color:#0F172A;font-size:13px;">${comp.nombre}</strong>
            <span style="background:#FCE7F3;color:#9D174D;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:5px;">@${comp.instagram}</span>
            ${ofertaBadge(post.caption)}
            ${hora ? `<span style="color:#94A3B8;font-size:11px;margin-left:5px;">${hora}</span>` : ''}
          </div>
          <p style="font-size:12px;color:#475569;line-height:1.5;margin:0 0 6px;">${texto}</p>
          <span style="font-size:11px;color:#64748B;margin-right:10px;">❤️ ${post.likesCount || 0}</span>
          <span style="font-size:11px;color:#64748B;margin-right:10px;">💬 ${post.commentsCount || 0}</span>
          <a href="${postUrl}" style="font-size:11px;color:#3B82F6;font-weight:600;text-decoration:none;">Ver →</a>
        </div>
      </div>`
  }).join('')

  const postsLIHtml = postsLinkedin.map(p => {
    const url = p.postUrl || p.url || ''
    const nombre = p.companyName || 'Competidor'
    const texto = (p.text || p.commentary || '').substring(0, 200)
    return `
      <div style="border:1px solid #E2E8F0;border-radius:10px;padding:12px;margin-bottom:10px;background:#fff;">
        <div style="margin-bottom:5px;">
          <strong style="color:#0F172A;font-size:13px;">${nombre}</strong>
          <span style="background:#DBEAFE;color:#1E40AF;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:5px;">💼 LinkedIn</span>
          ${ofertaBadge(p.text || p.commentary)}
        </div>
        <p style="font-size:12px;color:#475569;line-height:1.5;margin:0 0 6px;">${texto}${texto.length >= 200 ? '...' : ''}</p>
        ${p.likesCount ? `<span style="font-size:11px;color:#64748B;margin-right:10px;">👍 ${p.likesCount}</span>` : ''}
        ${url ? `<a href="${url}" style="font-size:11px;color:#3B82F6;font-weight:600;text-decoration:none;">Ver →</a>` : ''}
      </div>`
  }).join('')

  const postsFBHtml = postsFacebook.map(p => {
    const url = p.url || ''
    const nombre = p.pageName || p.authorName || 'Competidor'
    const texto = (p.text || p.message || '').substring(0, 200)
    const hora = p.time ? new Date(p.time).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : ''
    return `
      <div style="border:1px solid #E2E8F0;border-radius:10px;padding:12px;margin-bottom:10px;background:#fff;">
        <div style="margin-bottom:5px;">
          <strong style="color:#0F172A;font-size:13px;">${nombre}</strong>
          <span style="background:#EDE9FE;color:#5B21B6;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:5px;">📘 Facebook</span>
          ${ofertaBadge(p.text || p.message)}
          ${hora ? `<span style="color:#94A3B8;font-size:11px;margin-left:5px;">${hora}</span>` : ''}
        </div>
        <p style="font-size:12px;color:#475569;line-height:1.5;margin:0 0 6px;">${texto}${texto.length >= 200 ? '...' : ''}</p>
        ${p.likes ? `<span style="font-size:11px;color:#64748B;margin-right:10px;">👍 ${p.likes}</span>` : ''}
        ${url ? `<a href="${url}" style="font-size:11px;color:#3B82F6;font-weight:600;text-decoration:none;">Ver →</a>` : ''}
      </div>`
  }).join('')

  const sinActividadHtml = sinActividad.map(c =>
    `<span style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:4px 12px;font-size:11px;color:#94A3B8;display:inline-block;margin:3px;">${c.nombre}</span>`
  ).join('')

  const totalPosts = postsIG.length + postsLinkedin.length + postsFacebook.length
  const totalOfertas = [...postsIG, ...postsLinkedin, ...postsFacebook]
    .filter(p => esOfertaLaboral(p.caption || p.text || p.commentary || p.message || '')).length

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
        <p style="color:#94A3B8;font-size:11px;margin:4px 0 0;">${fecha} · IG + LinkedIn + Facebook · 12 competidores</p>
      </div>
      <div style="text-align:right;">
        <div style="font-size:26px;font-weight:900;color:#3B82F6;line-height:1;">${totalPosts}</div>
        <div style="font-size:10px;color:#94A3B8;">posts hoy</div>
        ${totalOfertas > 0 ? `
        <div style="font-size:18px;font-weight:900;color:#F59E0B;line-height:1;margin-top:6px;">${totalOfertas}</div>
        <div style="font-size:10px;color:#F59E0B;">oferta${totalOfertas > 1 ? 's' : ''} laboral${totalOfertas > 1 ? 'es' : ''}</div>
        ` : ''}
      </div>
    </div>

    <!-- Body -->
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">

      <!-- Instagram -->
      ${conActividad.length > 0 ? `
      <div style="background:#DCFCE7;color:#166534;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:14px;">
        📸 Instagram — ${postsIG.length} posts hoy
      </div>
      ${postsIGHtml}
      ` : `
      <div style="background:#F1F5F9;color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:12px;">
        📸 Instagram — sin actividad hoy
      </div>
      `}

      <!-- LinkedIn -->
      <div style="margin-top:20px;border-top:1px solid #E2E8F0;padding-top:18px;">
        <div style="background:${postsLinkedin.length > 0 ? '#EFF6FF' : '#F1F5F9'};color:${postsLinkedin.length > 0 ? '#1E40AF' : '#64748B'};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:${postsLinkedin.length > 0 ? '14px' : '10px'};">
          💼 LinkedIn — ${postsLinkedin.length > 0 ? `${postsLinkedin.length} posts hoy` : 'sin actividad hoy'}
        </div>
        ${postsLinkedin.length > 0 ? postsLIHtml : `
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${COMPETIDORES.filter(c => c.linkedin).map(c =>
            `<a href="${c.linkedin}" style="background:#fff;border:1px solid #DBEAFE;border-radius:20px;padding:4px 12px;font-size:11px;color:#1E40AF;text-decoration:none;display:inline-block;">${c.nombre} →</a>`
          ).join('')}
        </div>`}
      </div>

      <!-- Facebook -->
      <div style="margin-top:20px;border-top:1px solid #E2E8F0;padding-top:18px;">
        <div style="background:${postsFacebook.length > 0 ? '#EDE9FE' : '#F1F5F9'};color:${postsFacebook.length > 0 ? '#5B21B6' : '#64748B'};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:${postsFacebook.length > 0 ? '14px' : '10px'};">
          📘 Facebook — ${postsFacebook.length > 0 ? `${postsFacebook.length} posts hoy` : 'sin actividad hoy'}
        </div>
        ${postsFacebook.length > 0 ? postsFBHtml : `
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${COMPETIDORES.filter(c => c.facebook).map(c =>
            `<a href="${c.facebook}" style="background:#fff;border:1px solid #EDE9FE;border-radius:20px;padding:4px 12px;font-size:11px;color:#5B21B6;text-decoration:none;display:inline-block;">${c.nombre} →</a>`
          ).join('')}
        </div>`}
      </div>

      <!-- Sin actividad Instagram -->
      ${sinActividad.length > 0 ? `
      <div style="margin-top:20px;border-top:1px solid #E2E8F0;padding-top:16px;">
        <div style="background:#F1F5F9;color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:10px;">
          ⚪ Sin actividad IG — ${sinActividad.length} competidores
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

// ─── Envío de email con PDF adjunto ─────────────────────────────────────────
async function enviarEmail({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook }) {
  const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no definida — email no enviado.')
    return
  }

  const reporteHtml = generarHtmlReporte({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook })
  const fecha = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const totalPosts = postsIG.length + postsLinkedin.length + postsFacebook.length
  const totalOfertas = [...postsIG, ...postsLinkedin, ...postsFacebook]
    .filter(p => esOfertaLaboral(p.caption || p.text || p.commentary || p.message || '')).length

  const payload = {
    from: 'Müller & Pérez <contacto@mulleryperez.cl>',
    to: ['felipe.munoz@buseshualpen.cl', 'contacto@mulleryperez.cl'],
    subject: `🚌 Competencia Hualpén — ${fecha}${totalOfertas > 0 ? ` · ⚠️ ${totalOfertas} oferta${totalOfertas > 1 ? 's' : ''} laboral${totalOfertas > 1 ? 'es' : ''}` : ''} (${totalPosts} posts)`,
    html: `<div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:0 auto;padding:32px 16px;color:#1E293B;">
    <h2 style="font-size:18px;font-weight:800;margin:0 0 8px;">🚌 Reporte Diario — Competencia Hualpén</h2>
    <p style="color:#64748B;font-size:13px;margin:0 0 20px;">${fecha}</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts Instagram</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsIG.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts LinkedIn</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsLinkedin.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts Facebook</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsFacebook.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Sin actividad</td><td style="padding:8px 0;font-weight:700;text-align:right;">${sinActividad.length}</td></tr>
      ${totalOfertas > 0 ? `<tr><td style="padding:8px 0;color:#92400E;font-weight:700;">⚠️ Ofertas laborales detectadas</td><td style="padding:8px 0;font-weight:700;color:#92400E;text-align:right;">${totalOfertas}</td></tr>` : ''}
    </table>
    <p style="font-size:12px;color:#94A3B8;">El reporte completo se adjunta como archivo HTML — ábrelo en Chrome para verlo completo.<br>
    <a href="https://www.mulleryperez.cl/crm" style="color:#3B82F6;">Ver en CRM →</a></p>
  </div>`,
    attachments: [{
      filename: `Competencia-Hualpen-${hoy}.html`,
      content: Buffer.from(reporteHtml).toString('base64'),
    }],
  }
  console.log(`📎 Email con HTML adjunto listo`)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
