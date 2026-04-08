const fetch = require('node-fetch')
const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND = process.env.RESEND

async function run() {
  console.log('🔍 Scraping stories viggo_chile...')

  const res = await fetch(
    `https://api.apify.com/v2/acts/louisdeconinck~instagram-story-details-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: ['viggo_chile'] })
    }
  )

  if (!res.ok) { console.log('❌', res.status, await res.text()); return }

  const stories = await res.json()
  console.log('✅ Stories:', stories.length)
  // Print ALL keys to find media fields
  const s0 = stories[0] || {}
  console.log('All top-level keys:', Object.keys(s0).join(', '))
  // Look for nested media
  if (s0.video_versions) console.log('video_versions:', JSON.stringify(s0.video_versions[0]).substring(0, 200))
  if (s0.image_versions2) console.log('image_versions2:', JSON.stringify(s0.image_versions2?.candidates?.[0]).substring(0, 200))
  // Print any key containing url/video/image
  for (const [k, v] of Object.entries(s0)) {
    if (typeof v === 'string' && (k.includes('url') || k.includes('video') || k.includes('image'))) {
      console.log(`  ${k}: ${v.substring(0, 150)}`)
    }
  }

  // Build email with story data
  let storiesHtml = ''
  for (const s of stories) {
    // IG story fields: video in video_versions[], image in image_versions2.candidates[]
    const mediaUrl = s.video_versions?.[0]?.url || s.image_versions2?.candidates?.[0]?.url || s.video_url || s.image_url || s.media_url || s.url || s.display_url || ''
    const thumbUrl = s.image_versions2?.candidates?.[0]?.url || s.video_versions?.[0]?.url || s.thumbnail_url || mediaUrl || ''
    const ts = s.taken_at || s.timestamp || s.takenAt || 0
    const date = ts ? new Date(ts * 1000).toLocaleString('es-CL', {timeZone:'America/Santiago'}) : '?'
    const type = s.media_type === 2 || s.type === 2 ? 'Video' : 'Imagen'

    storiesHtml += `
    <tr><td style="padding:12px; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:8px;">
      <p style="margin:0 0 4px; font-size:12px; color:#6b7280;">${date} · ${type}</p>
      <p style="margin:0 0 8px; font-size:13px; color:#1a1a1a;"><strong>@viggo_chile</strong></p>
      ${thumbUrl ? `<img src="${thumbUrl}" width="300" style="border-radius:6px; max-width:100%;">` : '<p style="color:#999;">Sin preview disponible</p>'}
      ${mediaUrl ? `<p style="margin:8px 0 0;"><a href="${mediaUrl}" style="color:#1a73e8; font-size:12px;">Ver media original →</a></p>` : ''}
      <p style="margin:4px 0 0; font-size:10px; color:#9ca3af;">Story ID: ${s.pk || s.id || '?'}</p>
    </td></tr>
    <tr><td style="height:8px;"></td></tr>`
  }

  if (stories.length === 0) {
    storiesHtml = '<tr><td style="padding:16px; text-align:center; color:#999;">No hay stories activas en este momento</td></tr>'
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
  <body style="font-family:Arial,sans-serif; background:#f4f4f4; padding:20px;">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; margin:0 auto; overflow:hidden;">
    <tr><td style="background:#0A1628; padding:20px; text-align:center;">
      <span style="color:#fff; font-size:16px; font-weight:bold;">Prueba Stories Scraper — Hualpén</span>
    </td></tr>
    <tr><td style="padding:20px;">
      <p style="font-size:14px; color:#374151;">Stories activas de <strong>@viggo_chile</strong> detectadas ahora:</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${storiesHtml}
      </table>
      <p style="font-size:11px; color:#9ca3af; margin-top:16px;">Actor: louisdeconinck/instagram-story-details-scraper · Sin login requerido</p>
    </td></tr>
  </table>
  </body></html>`

  // Send email
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Müller & Pérez <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      subject: 'Prueba Stories: @viggo_chile — ' + stories.length + ' story(s) detectada(s)',
      html
    })
  })
  const emailData = await emailRes.json()
  console.log(emailRes.ok ? '✅ Email enviado: ' + emailData.id : '❌ ' + JSON.stringify(emailData))
}

run().catch(e => console.error('💥', e.message))
