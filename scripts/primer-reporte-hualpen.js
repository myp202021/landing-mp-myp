// primer-reporte-hualpen.js
// Script ONE-TIME: obtiene el último post de cada competidor (sin filtro de 24h)
// y manda un email completo con el resumen inicial a Buses Hualpén

const fetch = require('node-fetch')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND_KEY  = process.env.RESEND || process.env.RESEND_API_KEY

const COMPETIDORES = [
  { nombre: 'Viggo',                instagram: 'viggo_chile',         linkedin: 'https://www.linkedin.com/company/viggo-chile/' },
  { nombre: 'Tándem Industrial',    instagram: 'tandem.industrial',   linkedin: 'https://www.linkedin.com/company/tandem-industrial/' },
  { nombre: 'Yanguas',              instagram: 'yanguas.cl',          linkedin: 'https://www.linkedin.com/company/buses-yanguas/' },
  { nombre: 'Buses JM',             instagram: 'busesjm.cl',          linkedin: null },
  { nombre: 'CVU',                  instagram: 'transportescvu_ssee', linkedin: 'https://www.linkedin.com/company/transportes-cvu/' },
  { nombre: 'Nortrans',             instagram: 'nortransspa',         linkedin: 'https://www.linkedin.com/company/nortrans-ltda/' },
  { nombre: 'Géminis',              instagram: 'busesgeminis',        linkedin: 'https://www.linkedin.com/company/geminis/' },
  { nombre: 'Verschae',             instagram: 'flota_verschae',      linkedin: null },
  { nombre: 'Transportes Calderón', instagram: 'transportescalderon', linkedin: null },
  { nombre: 'Pullman Yuris',        instagram: 'busesyuris',          linkedin: null },
]

const SOLO_LINKEDIN = [
  { nombre: 'Sokol',            linkedin: 'https://www.linkedin.com/company/sokol-s-a/' },
  { nombre: 'Pullman San Luis', linkedin: null },
]

function diasDesde(fecha) {
  if (!fecha) return '—'
  const diff = Math.floor((Date.now() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `Hace ${diff} días`
}

function formatFecha(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function truncar(texto, n = 180) {
  if (!texto) return ''
  return texto.length > n ? texto.slice(0, n) + '...' : texto
}

async function main() {
  console.log('🔍 Scrapeando último post de cada competidor...')

  const profileUrls = COMPETIDORES.map(c => `https://www.instagram.com/${c.instagram}/`)

  let allPosts = []
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: profileUrls,
          resultsType: 'posts',
          resultsLimit: 3, // últimos 3 para tener más datos disponibles
          addParentData: true,
        }),
      }
    )
    if (!res.ok) throw new Error(`Apify ${res.status}: ${await res.text()}`)
    allPosts = await res.json()
    console.log(`✅ ${allPosts.length} posts obtenidos`)
  } catch (err) {
    console.error('❌ Error Apify:', err.message)
  }

  // Agrupar por competidor — quedarse con el más reciente
  const mapaUltimoPosts = {}
  for (const post of allPosts) {
    const handle = post.ownerUsername?.toLowerCase()
    const comp = COMPETIDORES.find(c => c.instagram?.toLowerCase() === handle)
    if (!comp) continue
    const nombre = comp.nombre
    if (!mapaUltimoPosts[nombre] || new Date(post.timestamp) > new Date(mapaUltimoPosts[nombre].timestamp)) {
      mapaUltimoPosts[nombre] = post
    }
  }

  const fechaHoy = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  const conActividad = Object.keys(mapaUltimoPosts).length
  const sinActividad = COMPETIDORES.length - conActividad

  // ── Generar HTML ──────────────────────────────────────────────────────────
  const filasCompetidores = COMPETIDORES.map(comp => {
    const post = mapaUltimoPosts[comp.nombre]

    if (!post) {
      return `
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:16px 12px; font-weight:600; color:#1e293b;">${comp.nombre}</td>
          <td style="padding:16px 12px; text-align:center;">
            <span style="background:#fef2f2;color:#ef4444;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;">Sin actividad reciente</span>
          </td>
          <td style="padding:16px 12px; color:#94a3b8; font-size:13px;" colspan="3">No se encontraron publicaciones recientes</td>
        </tr>`
    }

    const imgHtml = post.displayUrl
      ? `<img src="${post.displayUrl}" style="width:72px;height:72px;object-fit:cover;border-radius:8px;display:block;" />`
      : `<div style="width:72px;height:72px;background:#e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:11px;">Sin imagen</div>`

    const url = post.url || `https://www.instagram.com/${comp.instagram}/`
    const liTag = comp.linkedin
      ? `<a href="${comp.linkedin}" target="_blank" style="display:inline-block;padding:3px 8px;background:#e0f2fe;color:#0369a1;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;">Ver LinkedIn →</a>`
      : `<span style="color:#cbd5e1;font-size:11px;">—</span>`

    return `
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:16px 12px; font-weight:600; color:#1e293b; vertical-align:top;">${comp.nombre}</td>
        <td style="padding:16px 12px; vertical-align:top; text-align:center;">
          <a href="${url}" target="_blank">${imgHtml}</a>
        </td>
        <td style="padding:16px 12px; font-size:13px; color:#475569; vertical-align:top; max-width:240px;">
          ${truncar(post.caption)}
        </td>
        <td style="padding:16px 12px; vertical-align:top; text-align:center; white-space:nowrap;">
          <div style="font-weight:700; color:#1e293b; font-size:14px;">${diasDesde(post.timestamp)}</div>
          <div style="color:#94a3b8; font-size:11px; margin-top:2px;">${formatFecha(post.timestamp)}</div>
        </td>
        <td style="padding:16px 12px; vertical-align:top; text-align:center; white-space:nowrap;">
          <div style="font-size:13px; color:#64748b;">❤️ ${(post.likesCount || 0).toLocaleString('es-CL')}</div>
          <div style="font-size:13px; color:#64748b; margin-top:2px;">💬 ${(post.commentsCount || 0).toLocaleString('es-CL')}</div>
          <a href="${url}" target="_blank" style="display:inline-block;margin-top:6px;font-size:11px;color:#3b82f6;">Ver IG →</a>
        </td>
        <td style="padding:16px 12px; vertical-align:top; text-align:center;">
          ${liTag}
        </td>
      </tr>`
  }).join('')

  const filasLinkedin = SOLO_LINKEDIN.map(comp => {
    const liTag = comp.linkedin
      ? `<a href="${comp.linkedin}" target="_blank" style="display:inline-block;padding:3px 8px;background:#e0f2fe;color:#0369a1;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;">Ver LinkedIn →</a>`
      : `<span style="color:#cbd5e1;font-size:11px;">—</span>`
    return `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:14px 12px; font-weight:600; color:#1e293b;">${comp.nombre}</td>
      <td style="padding:14px 12px; color:#94a3b8; font-size:13px; text-align:center;">—</td>
      <td style="padding:14px 12px; color:#94a3b8; font-size:13px;">Sin Instagram detectado</td>
      <td style="padding:14px 12px; color:#94a3b8; font-size:13px; text-align:center;">—</td>
      <td style="padding:14px 12px; color:#94a3b8; font-size:13px; text-align:center;">—</td>
      <td style="padding:14px 12px; text-align:center;">${liTag}</td>
    </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Primer Informe Competencia — Buses Hualpén</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td>
<table width="640" align="center" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:32px 40px;">
      <img src="https://www.mulleryperez.cl/logo-color.png" style="height:44px;margin-bottom:20px;display:block;" alt="Muller y Pérez"/>
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">Primer Informe de Competencia Digital</h1>
      <p style="margin:8px 0 0;color:#93c5fd;font-size:14px;">Buses Hualpén · ${fechaHoy}</p>
    </td>
  </tr>

  <!-- Intro -->
  <tr>
    <td style="padding:28px 40px 16px;">
      <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
        Este es el <strong>primer informe de monitoreo de competencia</strong> para Buses Hualpén.
        A partir de ahora recibirás este reporte <strong>todos los días hábiles a las 9:00 AM</strong>
        con las publicaciones de las últimas 24 horas. En este primer informe incluimos
        la <strong>última publicación conocida de cada competidor</strong>, independiente de su fecha.
      </p>
    </td>
  </tr>

  <!-- Resumen -->
  <tr>
    <td style="padding:8px 40px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;background:#eff6ff;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:800;color:#1d4ed8;">${COMPETIDORES.length + SOLO_LINKEDIN.length}</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px;">Competidores monitoreados</div>
          </td>
          <td width="16"></td>
          <td style="text-align:center;background:#f0fdf4;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:800;color:#16a34a;">${conActividad}</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px;">Con publicaciones encontradas</div>
          </td>
          <td width="16"></td>
          <td style="text-align:center;background:#fef2f2;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:800;color:#dc2626;">${sinActividad + SOLO_LINKEDIN.length}</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px;">Sin actividad reciente</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Tabla Instagram -->
  <tr>
    <td style="padding:0 40px 8px;">
      <h2 style="font-size:16px;font-weight:800;color:#1e293b;margin:0 0 12px;">Última publicación por competidor — Instagram</h2>
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <thead>
          <tr style="background:#1e293b;">
            <th style="padding:12px;color:#fff;font-size:12px;text-align:left;font-weight:700;">Competidor</th>
            <th style="padding:12px;color:#fff;font-size:12px;text-align:center;font-weight:700;">Imagen</th>
            <th style="padding:12px;color:#fff;font-size:12px;text-align:left;font-weight:700;">Caption</th>
            <th style="padding:12px;color:#fff;font-size:12px;text-align:center;font-weight:700;">Publicado</th>
            <th style="padding:12px;color:#fff;font-size:12px;text-align:center;font-weight:700;">Engagement</th>
            <th style="padding:12px;color:#fff;font-size:12px;text-align:center;font-weight:700;">LinkedIn</th>
          </tr>
        </thead>
        <tbody>
          ${filasCompetidores}
          ${filasLinkedin}
        </tbody>
      </table>
    </td>
  </tr>

  <!-- Nota -->
  <tr>
    <td style="padding:0 40px 32px;">
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 16px;">
        <strong style="color:#92400e;font-size:13px;">Importante:</strong>
        <span style="color:#78350f;font-size:13px;"> A partir de mañana el informe mostrará solo publicaciones de las últimas 24 horas. Este primer reporte incluye el historial disponible de cada cuenta.</span>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#1e293b;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Muller & Pérez · contacto@mulleryperez.cl · www.mulleryperez.cl</p>
      <p style="margin:6px 0 0;color:#64748b;font-size:11px;">Este informe es confidencial y fue preparado exclusivamente para Buses Hualpén</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`

  // ── Enviar por email ──────────────────────────────────────────────────────
  console.log('📧 Enviando email...')
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'M&P <contacto@mulleryperez.cl>',
        to: ['felipe.munoz@buseshualpen.cl', 'contacto@mulleryperez.cl'],
        subject: `Primer Informe Competencia Digital — Buses Hualpén (${fechaHoy})`,
        html,
      }),
    })
    const emailData = await emailRes.json()
    if (!emailRes.ok) throw new Error(JSON.stringify(emailData))
    console.log('✅ Email enviado:', emailData.id)
  } catch (err) {
    console.error('❌ Error enviando email:', err.message)
  }
}

main()
