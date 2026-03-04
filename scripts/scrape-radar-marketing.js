// scrape-radar-marketing.js
// Corre cada lunes 08:00 AM via GitHub Actions
// Scrappea 8 cuentas de marketing en Instagram → calcula engagement por formato
// → guarda en Supabase tabla radar_marketing → envía email a Christopher

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN  = process.env.APIFY_TOKEN
const RESEND_KEY   = process.env.RESEND || process.env.RESEND_API_KEY
const supabase     = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── Cuentas a monitorear ──────────────────────────────────────────────────────
const CUENTAS = [
  { handle: 'sproutsocial',  nombre: 'Sprout Social' },
  { handle: 'metricoolapp',  nombre: 'Metricool' },
  { handle: 'hubspot',       nombre: 'HubSpot' },
  { handle: 'later',         nombre: 'Later' },
  { handle: 'semrush',       nombre: 'SEMrush' },
  { handle: 'hootsuite',     nombre: 'Hootsuite' },
  { handle: 'databoxhq',     nombre: 'Databox' },
  { handle: 'neilpatel',     nombre: 'Neil Patel' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function getSemanaISO(fecha = new Date()) {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

function getSlug(semana, año) {
  return `semana-${semana}-${año}`
}

function detectarFormato(post) {
  if (post.type === 'Video' || post.isVideo) return 'reel'
  if (post.type === 'Sidecar' || (post.images && post.images.length > 1)) return 'carrusel'
  return 'imagen'
}

function calcularEngagement(post) {
  return (post.likesCount || 0) + (post.commentsCount || 0) + (post.videoViewCount ? Math.floor(post.videoViewCount * 0.03) : 0)
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const hoy     = new Date()
  const año     = hoy.getFullYear()
  const semana  = getSemanaISO(hoy)
  const slug    = getSlug(semana, año)

  // Lunes y domingo de esta semana
  const diasDesdeL = (hoy.getDay() + 6) % 7
  const lunes  = new Date(hoy); lunes.setDate(hoy.getDate() - diasDesdeL)
  const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6)
  const fmtFecha = d => d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })

  console.log(`📊 Radar Marketing — Semana ${semana} · ${año}`)
  console.log(`📅 ${fmtFecha(lunes)} al ${fmtFecha(domingo)} de ${año}`)

  // ── 1. Scrapping Instagram ──────────────────────────────────────────────────
  const urls = CUENTAS.map(c => `https://www.instagram.com/${c.handle}/`)
  let posts  = []

  try {
    console.log(`\n🔍 Scrapeando ${CUENTAS.length} cuentas de marketing...`)
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: urls,
          resultsType: 'posts',
          resultsLimit: 10,    // últimos 10 posts por cuenta (semana + algo más)
          addParentData: true,
        }),
      }
    )
    if (!res.ok) throw new Error(`Apify ${res.status}: ${await res.text()}`)
    const allPosts = await res.json()

    // Filtrar últimos 7 días
    const hace7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    posts = allPosts.filter(p => p.timestamp && new Date(p.timestamp) > hace7d)
    console.log(`✅ ${posts.length} posts de los últimos 7 días (de ${allPosts.length} totales)`)
  } catch (err) {
    console.error('❌ Error Apify:', err.message)
  }

  // ── 2. Análisis de engagement por formato ──────────────────────────────────
  const porFormato = { reel: [], carrusel: [], imagen: [] }

  for (const post of posts) {
    const formato = detectarFormato(post)
    const eng     = calcularEngagement(post)
    porFormato[formato].push({
      eng,
      url:      post.url,
      caption:  (post.caption || '').slice(0, 200),
      cuenta:   post.ownerUsername,
      likes:    post.likesCount || 0,
      comments: post.commentsCount || 0,
      imagen:   post.displayUrl || null,
      fecha:    post.timestamp,
    })
  }

  // Promedios por formato
  const promedios = {}
  for (const [fmt, arr] of Object.entries(porFormato)) {
    promedios[fmt] = arr.length
      ? Math.round(arr.reduce((s, p) => s + p.eng, 0) / arr.length)
      : 0
  }

  // Ordenar formatos por promedio
  const formatosOrdenados = Object.entries(promedios)
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v > 0)

  const formatoGanador  = formatosOrdenados[0]?.[0] || 'reel'
  const formatoPerdedor = formatosOrdenados[formatosOrdenados.length - 1]?.[0] || 'imagen'
  const engGanador      = formatosOrdenados[0]?.[1] || 0
  const engPerdedor     = formatosOrdenados[formatosOrdenados.length - 1]?.[1] || 0

  // Top post de la semana
  const topPost = posts
    .map(p => ({ ...p, _eng: calcularEngagement(p) }))
    .sort((a, b) => b._eng - a._eng)[0]

  // Distribución de formatos (%)
  const totalPosts = posts.length || 1
  const distFormatos = {
    reel:     Math.round((porFormato.reel.length / totalPosts) * 100),
    carrusel: Math.round((porFormato.carrusel.length / totalPosts) * 100),
    imagen:   Math.round((porFormato.imagen.length / totalPosts) * 100),
  }

  console.log(`\n📈 Engagement promedio por formato:`)
  for (const [fmt, avg] of formatosOrdenados) {
    console.log(`   ${fmt}: ${avg} (${porFormato[fmt].length} posts)`)
  }

  // ── 3. Texto LinkedIn (template con datos reales) ──────────────────────────
  const formatoLabel = { reel: 'Reels', carrusel: 'Carruseles', imagen: 'Imágenes estáticas' }
  const linkedinTexto = `📊 Semana ${semana} — Lo que movió el marketing digital:

→ Formato ganador: ${formatoLabel[formatoGanador]} con ${engGanador.toLocaleString('es-CL')} interacciones promedio
→ ${formatoLabel[formatoPerdedor]} rindieron ${Math.round(((engGanador - engPerdedor) / (engGanador || 1)) * 100)}% menos
→ Analizamos ${posts.length} publicaciones de ${CUENTAS.length} referentes globales
→ ${distFormatos.reel}% del contenido publicado fue en formato video

Análisis completo con datos y benchmarks Chile 👇
https://www.mulleryperez.cl/noticias/newsletter/${slug}

#MarketingDigital #Chile #PerformanceMarketing #Data #MarketingData`

  // ── 4. Guardar en Supabase ─────────────────────────────────────────────────
  console.log('\n💾 Guardando en Supabase...')

  // Borrar edición anterior de esta semana si existe (idempotente)
  await supabase.from('radar_marketing').delete().eq('slug', slug)

  const { error } = await supabase.from('radar_marketing').insert({
    semana,
    año,
    slug,
    fecha_inicio:        lunes.toISOString().split('T')[0],
    fecha_fin:           domingo.toISOString().split('T')[0],
    total_posts:         posts.length,
    cuentas_analizadas:  CUENTAS.length,
    formato_ganador:     formatoGanador,
    eng_ganador:         engGanador,
    formato_perdedor:    formatoPerdedor,
    eng_perdedor:        engPerdedor,
    dist_formatos:       distFormatos,
    promedios_formatos:  promedios,
    top_post:            topPost ? {
      url:      topPost.url,
      caption:  (topPost.caption || '').slice(0, 300),
      cuenta:   topPost.ownerUsername,
      likes:    topPost.likesCount || 0,
      comments: topPost.commentsCount || 0,
      imagen:   topPost.displayUrl || null,
      eng:      topPost._eng,
    } : null,
    posts_raw:           posts.slice(0, 30),   // guardar top 30 para la página
    linkedin_texto:      linkedinTexto,
  })

  if (error) {
    console.error('❌ Error Supabase:', error.message)
  } else {
    console.log('✅ Guardado en Supabase')
  }

  // ── 5. Email aviso a Christopher ──────────────────────────────────────────
  const urlNewsletter = `https://www.mulleryperez.cl/noticias/newsletter/${slug}`

  const emailHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td>
<table width="560" align="center" cellpadding="0" cellspacing="0"
  style="background:#1e293b;border-radius:16px;overflow:hidden;max-width:100%;">
  <tr>
    <td style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:28px 36px;">
      <img src="https://www.mulleryperez.cl/logo-color.png" style="height:36px;display:block;margin-bottom:16px;" />
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;">
        Radar Semanal listo — Semana ${semana} · ${año}
      </h1>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 36px;">
      <p style="color:#94a3b8;font-size:14px;margin:0 0 20px;">
        El newsletter de esta semana fue generado automáticamente con datos de
        <strong style="color:#e2e8f0;">${posts.length} posts</strong> de
        <strong style="color:#e2e8f0;">${CUENTAS.length} cuentas</strong> de marketing digital.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:#0f172a;border-radius:10px;padding:16px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#3b82f6;">${formatoLabel[formatoGanador]}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px;">Formato ganador esta semana</div>
          </td>
          <td width="12"></td>
          <td style="background:#0f172a;border-radius:10px;padding:16px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#10b981;">${engGanador.toLocaleString('es-CL')}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px;">Eng. promedio del formato ganador</div>
          </td>
        </tr>
      </table>

      <a href="${urlNewsletter}"
        style="display:block;background:#2563eb;color:#fff;text-align:center;padding:14px;
               border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;margin-bottom:24px;">
        Ver newsletter completo →
      </a>

      <div style="background:#0f172a;border-radius:10px;padding:16px;margin-bottom:8px;">
        <p style="color:#94a3b8;font-size:12px;font-weight:700;margin:0 0 8px;text-transform:uppercase;">
          Texto para LinkedIn (copia y pega):
        </p>
        <pre style="color:#e2e8f0;font-size:12px;white-space:pre-wrap;margin:0;font-family:Arial;">${linkedinTexto}</pre>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 36px;border-top:1px solid #334155;text-align:center;">
      <p style="color:#475569;font-size:11px;margin:0;">M&P · Radar Semanal automático · Cada lunes 8 AM</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P Radar <contacto@mulleryperez.cl>',
        to:   ['contacto@mulleryperez.cl'],
        subject: `📊 Radar listo — Semana ${semana} · ${año} | ${posts.length} posts analizados`,
        html: emailHtml,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))
    console.log(`\n📧 Email enviado a Christopher: ${data.id}`)
  } catch (err) {
    console.error('❌ Error email:', err.message)
  }

  console.log(`\n✅ Radar Semana ${semana} completado`)
  console.log(`🔗 ${urlNewsletter}`)
}

main()
