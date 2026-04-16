// clipping-swing-artistas.js
// Scrapea Instagram de artistas Swing Producciones, envía email diario con últimos posts.
// Cron: 07:00 AM Chile (10:00 UTC) via GitHub Actions

const fetch = require('node-fetch')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const RESEND_KEY = process.env.RESEND

const ARTISTAS = [
  { nombre: 'Luis Fonsi',             instagram: 'luisfonsi' },
  { nombre: 'Il Volo',                instagram: 'ilvolomusic' },
  { nombre: 'Emmanuel',               instagram: 'emmanueloficial' },
  { nombre: 'Paul Anka',              instagram: 'paulankaofficial' },
  { nombre: 'Nito Mestre',            instagram: 'nitomestre' },
  { nombre: 'Lucero',                 instagram: 'luceromexico' },
  { nombre: 'Auténticos Decadentes',  instagram: 'autenticosdecadentes' },
  { nombre: 'Paloma San Basilio',     instagram: 'palomasanbasiliooficial' },
  { nombre: 'Cristian Castro',        instagram: 'cristiancastromoments' },
  { nombre: 'Marco Antonio Solís',    instagram: 'marcoantoniosolis_oficial' },
]

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  const desde = new Date(Date.now() - 48 * 60 * 60 * 1000)

  console.log(`🎵 Clipping Artistas Swing — ${hoy}`)
  console.log(`   Artistas: ${ARTISTAS.length}`)
  console.log(`   Ventana: últimas 48h`)

  const profileUrls = ARTISTAS.map(a => `https://www.instagram.com/${a.instagram}/`)
  let posts = []

  try {
    console.log(`📸 Scrapeando ${profileUrls.length} artistas en Instagram...`)
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=280`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directUrls: profileUrls, resultsType: 'posts', resultsLimit: 5, addParentData: true }),
      }
    )
    if (!res.ok) throw new Error(`Apify IG: ${res.status} ${await res.text()}`)
    const all = await res.json()
    console.log(`   Total posts recibidos: ${all.length}`)

    const recientes = all.filter(p => p.timestamp && new Date(p.timestamp) > desde)
    console.log(`   En ventana 48h: ${recientes.length}`)

    posts = recientes.map(p => {
      const handle = (p.ownerUsername || '').toLowerCase()
      const artista = ARTISTAS.find(a => a.instagram.toLowerCase() === handle)
      return {
        artista: artista?.nombre || handle,
        handle,
        texto: (p.caption || '').substring(0, 300),
        url: p.url || `https://www.instagram.com/p/${p.shortCode}/`,
        timestamp: p.timestamp,
        likes: p.likesCount || 0,
        comments: p.commentsCount || 0,
        type: p.type || 'Image',
        imageUrl: p.displayUrl || null,
      }
    })

    console.log(`✅ Posts recientes: ${posts.length}`)

    for (const a of ARTISTAS) {
      const count = posts.filter(p => p.handle === a.instagram.toLowerCase()).length
      console.log(`   ${a.nombre}: ${count} posts`)
    }
  } catch (err) {
    console.error('❌ Error Instagram:', err.message)
  }

  await enviarEmail({ hoy, posts })
}

async function enviarEmail({ hoy, posts }) {
  const fechaLegible = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const porArtista = new Map()
  for (const p of posts) {
    if (!porArtista.has(p.artista)) porArtista.set(p.artista, [])
    porArtista.get(p.artista).push(p)
  }

  const artistasConPosts = porArtista.size
  const artistasSinPosts = ARTISTAS.filter(a => !porArtista.has(a.nombre))

  let bodyHtml = `
  <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
    <div style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; font-size: 22px;">🎵 Clipping Artistas — Swing Producciones</h1>
      <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.95;">${fechaLegible} · Últimas 48 horas</p>
    </div>
    <div style="background: #f8f9fa; padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
      <strong>${posts.length} post${posts.length === 1 ? '' : 's'}</strong> de <strong>${artistasConPosts}</strong> artistas en las últimas 48 horas.
      ${artistasSinPosts.length > 0 ? `<br><span style="font-size: 13px; color: #6b7280;">Sin actividad: ${artistasSinPosts.map(a => a.nombre).join(', ')}</span>` : ''}
    </div>
    <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
  `

  if (posts.length === 0) {
    bodyHtml += `<p style="color: #6b7280; font-style: italic;">Ningún artista publicó en las últimas 48 horas.</p>`
  } else {
    for (const [artista, aPosts] of porArtista) {
      bodyHtml += `<h3 style="margin: 20px 0 8px; font-size: 15px; color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 4px;">🎤 ${artista}</h3>`
      for (const p of aPosts) {
        const preview = (p.texto || '(sin caption)').substring(0, 200).replace(/\n/g, ' ')
        const engagement = p.likes > 0 ? `❤️ ${p.likes.toLocaleString()} · 💬 ${p.comments.toLocaleString()}` : ''
        bodyHtml += `
        <div style="margin-bottom: 14px; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #7C3AED;">
          <p style="margin: 0 0 6px; font-size: 13px; color: #1f2937;">${preview}${p.texto.length > 200 ? '…' : ''}</p>
          ${engagement ? `<p style="margin: 0 0 6px; font-size: 12px; color: #6b7280;">${engagement}</p>` : ''}
          <a href="${p.url}" style="font-size: 12px; color: #2563eb;">Ver post →</a>
        </div>`
      }
    }
  }

  bodyHtml += `
    </div>
    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Müller & Pérez para Swing Producciones — Reporte automático diario 07:00 AM</p>
  </div>
  `

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Clipping Artistas <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl', 'nicole@mulleryperez.cl', 'nicolas@mulleryperez.cl'],
      subject: `🎵 Clipping Artistas Swing — ${posts.length} posts — ${hoy}`,
      html: bodyHtml,
    }),
  })
  const data = await resp.json()
  if (!resp.ok) {
    console.error('❌ Error Resend:', data)
    throw new Error(`Resend: ${resp.status}`)
  }
  console.log(`✉️  Email enviado: ${data.id}`)
}

main().catch(err => { console.error(err); process.exit(1) })
