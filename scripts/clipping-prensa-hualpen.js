// clipping-prensa-hualpen.js
// Corre L-V 06:00 AM Chile via GitHub Actions
// Scrapea Instagram de medios chilenos, filtra posts sobre transporte y envía links.
// Piloto: email solo a contacto@mulleryperez.cl (antes de sumar a Felipe).

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Medios a monitorear (Instagram handles)
const MEDIOS = [
  { nombre: 'La Tercera',         instagram: 'latercera' },
  { nombre: 'BioBioChile',        instagram: 'biobio' },
  { nombre: 'Emol',               instagram: 'emol_cl' },
  { nombre: 'Diario Financiero',  instagram: 'df_mas' },
  { nombre: 'CNN Chile',          instagram: 'cnnchile' },
  { nombre: 'T13',                instagram: 't13' },
  { nombre: 'Diario Concepción',  instagram: 'diario_concepcion' },
  { nombre: 'Sabes.cl',           instagram: 'sabes.cl' },
  { nombre: 'Publimetro Chile',   instagram: 'publimetrochile' },
  { nombre: 'El Dínamo',          instagram: 'eldinamo' },
  { nombre: 'Meganoticias',       instagram: 'meganoticiascl' },
  { nombre: 'ADN Radio',          instagram: 'adnradiochile' },
  { nombre: 'Cooperativa',        instagram: 'cooperativa.cl' },
]

// Keywords: menciones de Hualpén y competidores directos
const KEYWORDS_MENCIONES = [
  // Hualpén (el cliente)
  'hualpén', 'hualpen', 'buses hualpén', 'buses hualpen',
  // Competidores directos
  'viggo', 'viggo chile',
  'tándem industrial', 'tandem industrial',
  'yanguas', 'buses yanguas',
  'buses jm', 'busesjm',
  'cvu', 'transportes cvu',
  'nortrans',
  'géminis', 'geminis', 'buses géminis', 'buses geminis',
  'verschae', 'flota verschae',
  'calderón', 'calderon', 'transportes calderón', 'transportes calderon',
  'pullman yuris', 'buses yuris',
  'sokol', 'grupo sokol',
  'pullman san luis',
  // Industria específica
  'transporte de personal', 'transporte de trabajadores',
  'buses de acercamiento', 'bus de acercamiento',
  'servicio especial de transporte', 'transporte minero',
  // Términos genéricos transporte (ampliar cobertura)
  'transporte público', 'transporte publico', 'transporte privado',
  'buses', 'bus', 'flotas', 'flota',
  'pasajeros', 'choferes', 'conductores',
  'terminal de buses', 'terminal',
  'licitación transporte', 'licitacion transporte',
  'electromovilidad', 'buses eléctricos', 'buses electricos',
  'accidente bus', 'accidente de tránsito', 'accidente de transito',
  'ruta interurbana', 'transporte interurbano',
  'transporte escolar', 'transporte urbano',
  'subsidio transporte', 'tarifa transporte',
]

function mencionaCompetencia(texto) {
  if (!texto || typeof texto !== 'string') return { match: false, kws: [] }
  const lower = texto.toLowerCase()
  const kws = KEYWORDS_MENCIONES.filter(kw => lower.includes(kw))
  return { match: kws.length > 0, kws }
}

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  // Ventana 24h: clipping del día (el workflow corre a las 06:00 AM)
  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000)

  console.log(`📅 Clipping Prensa Hualpen — ${hoy}`)

  // Limpiar reporte del día si ya existe (re-runs)
  await supabase.from('clipping_prensa').delete().eq('fecha_reporte', hoy)

  const profileUrls = MEDIOS.map(m => `https://www.instagram.com/${m.instagram}/`)
  let postsIG = []

  try {
    console.log(`📸 Scrapeando ${profileUrls.length} medios en Instagram...`)
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=280`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directUrls: profileUrls, resultsType: 'posts', resultsLimit: 10, addParentData: true }),
      }
    )
    if (!res.ok) throw new Error(`Apify IG: ${res.status} ${await res.text()}`)
    const all = await res.json()
    console.log(`   Total posts recibidos: ${all.length}`)

    const recientes = all.filter(p => p.timestamp && new Date(p.timestamp) > desde)
    console.log(`   En ventana 24h: ${recientes.length}`)

    postsIG = recientes
      .map(p => {
        const handle = (p.ownerUsername || '').toLowerCase()
        const medio = MEDIOS.find(m => m.instagram.toLowerCase() === handle)
        const texto = p.caption || ''
        const { match, kws } = mencionaCompetencia(texto)
        return { medio: medio?.nombre || handle, handle, texto, url: p.url || `https://www.instagram.com/p/${p.shortCode}/`, timestamp: p.timestamp, match, kws }
      })
      .filter(p => p.match)

    console.log(`✅ Filtrados por menciones: ${postsIG.length}`)
  } catch (err) {
    console.error('❌ Error Instagram:', err.message)
  }

  // Guardar en Supabase
  for (const p of postsIG) {
    await supabase.from('clipping_prensa').insert({
      fecha_reporte: hoy,
      red_social: 'Instagram',
      medio: p.medio,
      handle: p.handle,
      url: p.url,
      texto: p.texto.substring(0, 600),
      matched_keywords: p.kws,
      fecha_post: p.timestamp || null,
    })
  }

  await enviarEmail({ hoy, postsIG })
}

async function enviarEmail({ hoy, postsIG }) {
  const fechaLegible = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Agrupar por medio
  const porMedio = new Map()
  for (const p of postsIG) {
    if (!porMedio.has(p.medio)) porMedio.set(p.medio, [])
    porMedio.get(p.medio).push(p)
  }

  let bodyHtml = `
  <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
    <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; font-size: 22px;">📰 Clipping Prensa — Transporte</h1>
      <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.95;">${fechaLegible}</p>
    </div>
    <div style="background: #f8f9fa; padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
      <strong>${postsIG.length} post${postsIG.length === 1 ? '' : 's'}</strong> con menciones de Hualpén o competidores en medios chilenos.
    </div>
    <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
  `

  if (postsIG.length === 0) {
    bodyHtml += `<p style="color: #6b7280; font-style: italic;">Sin menciones de Hualpén ni competidores en las últimas 24 horas.</p>`
  } else {
    for (const [medio, posts] of porMedio) {
      bodyHtml += `<h3 style="margin: 20px 0 8px; font-size: 15px; color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 4px;">${medio}</h3><ul style="margin: 8px 0; padding-left: 20px;">`
      for (const p of posts) {
        const preview = (p.texto || '').substring(0, 140).replace(/\n/g, ' ')
        bodyHtml += `<li style="margin-bottom: 10px;"><a href="${p.url}" style="color: #1f2937; text-decoration: none;"><strong>${preview}${p.texto.length > 140 ? '…' : ''}</strong></a><br><a href="${p.url}" style="font-size: 12px; color: #2563eb;">${p.url}</a></li>`
      }
      bodyHtml += `</ul>`
    }
  }

  bodyHtml += `
    </div>
    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Müller & Pérez — Reporte automático L-V 06:00 AM (piloto)</p>
  </div>
  `

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.RESEND}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'contacto@mulleryperez.cl',
      to: ['felipe.munoz@buseshualpen.cl', 'contacto@mulleryperez.cl'],
      subject: `📰 Clipping Prensa Hualpen — ${hoy}`,
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
