// scrape-genera.js
// Radar de Competencia — Genera Chile (Piloto)
// Corre L-V 08:30 AM via GitHub Actions
// Scrape Instagram + LinkedIn de competidores de software RRHH
// Detecta ofertas laborales y promociones comerciales
// Envía reporte premium como PDF adjunto

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
const { execSync } = require('child_process')
const fs = require('fs')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Logo M&P embebido en base64 (leído del repo)
const logoPath = require('path').join(__dirname, 'logo-mp.png')
const LOGO_B64 = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : ''
const LOGO_SRC = LOGO_B64 ? `data:image/png;base64,${LOGO_B64}` : ''

const COMPETIDORES = [
  { nombre: 'Buk',          instagram: 'buk_chile',          linkedin: 'https://www.linkedin.com/company/buk-cl/',             color: '#6C31D9', initial: 'B' },
  { nombre: 'Talana',       instagram: 'talana_rrhh',        linkedin: 'https://www.linkedin.com/company/talana-rrhh/',        color: '#F59E0B', initial: 'T' },
  { nombre: 'Nubox',        instagram: 'nubox.chile',        linkedin: 'https://www.linkedin.com/company/nuboxchile/',         color: '#0EA5E9', initial: 'N' },
  { nombre: 'Geovictoria',  instagram: 'geovictoria.chile',  linkedin: 'https://www.linkedin.com/company/victorias-a-/',       color: '#10B981', initial: 'G' },
  { nombre: 'Workera',      instagram: 'workera_chile',      linkedin: 'https://www.linkedin.com/company/workerabyqwantec/',   color: '#64748B', initial: 'W' },
]

// ─── Detección de ofertas laborales ─────────────────────────────────────────
const KEYWORDS_OFERTA = [
  'se busca', 'buscamos', 'oferta laboral', 'postula', 'postúlate', 'vacante',
  'cargo disponible', 'remuneración', 'jornada', 'contrato', 'enviar cv', 'envía tu cv',
  'trabaja con nosotros', 'únete a', 'incorporar', 'requisitos', 'experiencia comprobable',
  'disponibilidad', 'join our team', 'we are hiring', 'hiring',
  'ejecutivo comercial', 'account manager', 'customer success', 'sales representative',
  'desarrollador', 'developer', 'ingeniero', 'product manager', 'diseñador ux',
  'head of', 'líder de', 'jefe de', 'gerente de',
]

function esOfertaLaboral(texto) {
  if (!texto) return false
  const lower = texto.toLowerCase()
  return KEYWORDS_OFERTA.some(kw => lower.includes(kw))
}

// ─── Detección de promociones comerciales ───────────────────────────────────
const KEYWORDS_PROMO = [
  'gratis', 'descuento', '% off', 'promo', 'promoción', 'oferta especial',
  'sin costo', 'sin permanencia', 'prueba gratis', 'demo gratuita', 'meses gratis',
  'precio especial', 'plan free', 'trial', 'cupón', 'código', 'free trial',
  'sin letra chica', 'sin compromiso', 'precio rebajado', 'oferta limitada',
  'black friday', 'cyber', 'hot sale',
]

function esPromocion(texto) {
  if (!texto) return false
  const lower = texto.toLowerCase()
  return KEYWORDS_PROMO.some(kw => lower.includes(kw))
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function getTextoPost(p) {
  return p.caption || p.text || p.commentary || p.content || p.message || ''
}

function getLikes(p) {
  return p.likesCount || p.totalReactionCount || p.reactions || p.likes || 0
}

function getComentarios(p) {
  return p.commentsCount || p.comments || p.commentCount || 0
}

function getCompartidos(p) {
  return p.sharesCount || p.shares || p.repostCount || p.reposts || 0
}

function getPostUrl(p) {
  return p.url || p.postUrl || p.postLink || p.link || ''
}

function getFechaPost(p) {
  return p.timestamp || p.postedAt || p.publishedAt || p.date || p.time || null
}


// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  console.log(`📊 Radar Genera — Generando reporte para ${hoy}...`)

  // Limpiar reportes del día (idempotente)
  await supabase.from('reportes_genera').delete().eq('fecha_reporte', hoy)

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

  // Guardar posts Instagram en Supabase
  const competidoresConPostIG = new Set()
  for (const post of postsIG) {
    const handle = post.ownerUsername?.toLowerCase()
    const comp = conIG.find(c => c.instagram?.toLowerCase() === handle)
    if (!comp) continue
    competidoresConPostIG.add(comp.nombre)

    const texto = getTextoPost(post)
    await supabase.from('reportes_genera').insert({
      competidor: comp.nombre, handle: comp.instagram, red_social: 'Instagram',
      post_url: post.url || `https://www.instagram.com/p/${post.shortCode}/`,
      post_texto: texto.substring(0, 600),
      post_imagen: post.displayUrl || null,
      likes: post.likesCount || 0, comentarios: post.commentsCount || 0,
      compartidos: 0,
      es_oferta: esOfertaLaboral(texto), es_promocion: esPromocion(texto),
      fecha_post: post.timestamp || null, fecha_reporte: hoy, sin_actividad: false,
    })
  }

  // Sin actividad IG
  for (const comp of COMPETIDORES) {
    if (competidoresConPostIG.has(comp.nombre)) continue
    await supabase.from('reportes_genera').insert({
      competidor: comp.nombre, handle: comp.instagram || null, red_social: 'Instagram',
      post_url: null, post_texto: null, post_imagen: null, likes: null, comentarios: null,
      compartidos: null, es_oferta: false, es_promocion: false,
      fecha_post: null, fecha_reporte: hoy, sin_actividad: true,
    })
  }

  const sinActividadIG = COMPETIDORES.filter(c => !competidoresConPostIG.has(c.nombre))
  console.log(`🏁 Instagram: ${competidoresConPostIG.size} con actividad, ${sinActividadIG.length} sin actividad.`)

  // ── LinkedIn (doble actor con fallback) ────────────────────────────────────
  const postsLinkedin = await scrapeLinkedin(hace24h)

  // Guardar posts LinkedIn en Supabase
  for (const post of postsLinkedin) {
    const texto = getTextoPost(post)
    const nombre = post._competidor || post.companyName || post.authorName || post.author || 'Competidor'
    await supabase.from('reportes_genera').insert({
      competidor: nombre, handle: null, red_social: 'LinkedIn',
      post_url: getPostUrl(post), post_texto: texto.substring(0, 600),
      post_imagen: post.imageUrl || post.image || null,
      likes: getLikes(post), comentarios: getComentarios(post),
      compartidos: getCompartidos(post),
      es_oferta: esOfertaLaboral(texto), es_promocion: esPromocion(texto),
      fecha_post: getFechaPost(post), fecha_reporte: hoy, sin_actividad: false,
    })
  }

  // ── Generar reporte y enviar ────────────────────────────────────────────────
  // Consolidar datos para el reporte
  const allPosts = [...postsIG.map(p => ({ ...p, _red: 'Instagram', _comp: conIG.find(c => c.instagram?.toLowerCase() === p.ownerUsername?.toLowerCase()) })),
                    ...postsLinkedin.map(p => ({ ...p, _red: 'LinkedIn', _comp: COMPETIDORES.find(c => c.nombre === p._competidor) }))]

  await enviarEmail({ hoy, postsIG, postsLinkedin, competidoresConPostIG, sinActividadIG, allPosts })
}


// ─── LinkedIn scraping con doble fallback ────────────────────────────────────
async function scrapeLinkedin(hace24h) {
  const conLI = COMPETIDORES.filter(c => c.linkedin)
  if (conLI.length === 0) return []

  // Actor primario: apimaestro (2.4M runs, 99.99% éxito)
  console.log(`💼 LinkedIn [primario: apimaestro] — ${conLI.length} empresas...`)
  let posts = await tryLinkedinActor(
    'apimaestro~linkedin-company-posts',
    { urls: conLI.map(c => c.linkedin) },
    hace24h, conLI
  )

  if (posts === null) {
    // Fallback: harvestapi (547K runs, 100% éxito 30d)
    console.log(`⚠️ Primario falló. LinkedIn [fallback: harvestapi]...`)
    posts = await tryLinkedinActor(
      'harvestapi~linkedin-company-posts',
      { targetUrls: conLI.map(c => c.linkedin), maxPosts: 5 },
      hace24h, conLI
    )
  }

  if (posts === null) {
    console.warn('❌ Ambos actores LinkedIn fallaron. Continuando sin LinkedIn.')
    return []
  }

  return posts
}

async function tryLinkedinActor(actorId, input, hace24h, conLI) {
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }
    )
    if (!res.ok) {
      console.warn(`⚠️ ${actorId}: HTTP ${res.status}`)
      return null
    }
    const all = await res.json()
    if (!Array.isArray(all)) {
      console.warn(`⚠️ ${actorId}: respuesta no es array`)
      return null
    }

    // Filtrar posts recientes y asignar competidor
    const recientes = all.filter(p => {
      const fecha = getFechaPost(p)
      return fecha && new Date(fecha) > hace24h
    }).map(p => {
      // Intentar matchear con competidor por URL o nombre
      const compName = p.companyName || p.authorName || p.author || ''
      const matched = conLI.find(c =>
        compName.toLowerCase().includes(c.nombre.toLowerCase()) ||
        (p.companyUrl && c.linkedin && p.companyUrl.includes(c.linkedin.replace('https://www.linkedin.com', '')))
      )
      return { ...p, _competidor: matched ? matched.nombre : compName }
    })

    console.log(`✅ LinkedIn [${actorId}]: ${recientes.length} posts en últimas 24h (de ${all.length} total)`)
    return recientes
  } catch (err) {
    console.warn(`⚠️ ${actorId} error:`, err.message)
    return null
  }
}


// ─── Generación de PDF ──────────────────────────────────────────────────────
function generarPDF(html) {
  try {
    const tmpHtml = '/tmp/reporte-genera.html'
    const tmpPdf  = '/tmp/reporte-genera.pdf'
    fs.writeFileSync(tmpHtml, html, 'utf8')
    execSync(`wkhtmltopdf --quiet --page-size A4 --margin-top 10 --margin-bottom 10 --margin-left 10 --margin-right 10 --enable-local-file-access --enable-external-links "${tmpHtml}" "${tmpPdf}"`)
    const buffer = fs.readFileSync(tmpPdf)
    console.log(`✅ PDF generado (${Math.round(buffer.length / 1024)} KB)`)
    return buffer
  } catch (err) {
    console.warn('⚠️ wkhtmltopdf falló:', err.message)
    return null
  }
}


// ─── HTML del reporte premium (diseño Radar Competencia) ─────────────────────
function generarHtmlReporte({ hoy, postsIG, postsLinkedin, competidoresConPostIG, sinActividadIG, allPosts }) {
  const fechaObj = new Date(hoy + 'T12:00:00')
  const fecha = fechaObj.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const hora = '08:30 AM'

  const totalPosts = postsIG.length + postsLinkedin.length
  const totalLikes = allPosts.reduce((s, p) => s + (getLikes(p) || 0), 0)
  const totalComentarios = allPosts.reduce((s, p) => s + (getComentarios(p) || 0), 0)
  const totalCompartidos = allPosts.reduce((s, p) => s + (getCompartidos(p) || 0), 0)

  // Ofertas y promos
  const ofertas = allPosts.filter(p => esOfertaLaboral(getTextoPost(p)))
  const promos = allPosts.filter(p => esPromocion(getTextoPost(p)))
  const totalOfertas = ofertas.length
  const totalPromos = promos.length

  // Engagement por competidor
  const engagementMap = {}
  COMPETIDORES.forEach(c => { engagementMap[c.nombre] = { likes: 0, comentarios: 0, compartidos: 0, posts: 0 } })
  allPosts.forEach(p => {
    const compName = p._comp?.nombre || p._competidor || ''
    if (engagementMap[compName]) {
      engagementMap[compName].likes += getLikes(p) || 0
      engagementMap[compName].comentarios += getComentarios(p) || 0
      engagementMap[compName].compartidos += getCompartidos(p) || 0
      engagementMap[compName].posts += 1
    }
  })

  const engSorted = COMPETIDORES.map(c => ({
    ...c,
    ...engagementMap[c.nombre],
    total: engagementMap[c.nombre].likes + engagementMap[c.nombre].comentarios + engagementMap[c.nombre].compartidos,
  })).sort((a, b) => b.total - a.total)

  const maxLikes = Math.max(...engSorted.map(e => e.likes), 1)

  // Estado por competidor
  function getEstado(comp) {
    const posts = allPosts.filter(p => (p._comp?.nombre || p._competidor) === comp.nombre)
    if (posts.some(p => esOfertaLaboral(getTextoPost(p)))) return { tag: 'tag-red', label: '⚠ Oferta' }
    if (posts.some(p => esPromocion(getTextoPost(p)))) return { tag: 'tag-purple', label: 'Promo' }
    if (posts.length === 0) return { tag: 'tag-gray', label: 'Silencio' }
    return { tag: 'tag-green', label: 'Normal' }
  }

  // Alertas automáticas
  let alertasHtml = ''
  let alertCount = 0

  ofertas.forEach(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const texto = getTextoPost(p).substring(0, 200)
    alertasHtml += `<div style="display:flex;gap:14px;align-items:flex-start;">
      <span style="padding:4px 10px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:0.5px;white-space:nowrap;flex-shrink:0;margin-top:1px;background:rgba(220,38,38,0.2);color:#FCA5A5;">🚨 URGENTE</span>
      <p style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.55;margin:0;"><strong style="color:#fff;font-weight:700;">${comp}</strong> publicó oferta laboral: "${texto}..."</p>
    </div>`
    alertCount++
  })

  promos.forEach(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const texto = getTextoPost(p).substring(0, 200)
    alertasHtml += `<div style="display:flex;gap:14px;align-items:flex-start;">
      <span style="padding:4px 10px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:0.5px;white-space:nowrap;flex-shrink:0;margin-top:1px;background:rgba(217,119,6,0.2);color:#FCD34D;">⚠ ATENCIÓN</span>
      <p style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.55;margin:0;"><strong style="color:#fff;font-weight:700;">${comp}</strong> lanzó promoción: "${texto}..."</p>
    </div>`
    alertCount++
  })

  // Competidores sin actividad
  const sinActividad = COMPETIDORES.filter(c => engagementMap[c.nombre].posts === 0)
  if (sinActividad.length > 0) {
    alertasHtml += `<div style="display:flex;gap:14px;align-items:flex-start;">
      <span style="padding:4px 10px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:0.5px;white-space:nowrap;flex-shrink:0;margin-top:1px;background:rgba(5,150,105,0.2);color:#6EE7B7;">✓ OK</span>
      <p style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.55;margin:0;"><strong style="color:#fff;font-weight:700;">${sinActividad.map(c => c.nombre).join(' y ')}</strong> sin actividad relevante hoy.</p>
    </div>`
  }

  if (!alertasHtml) {
    alertasHtml = `<div style="display:flex;gap:14px;align-items:flex-start;">
      <span style="padding:4px 10px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:0.5px;white-space:nowrap;flex-shrink:0;margin-top:1px;background:rgba(5,150,105,0.2);color:#6EE7B7;">✓ OK</span>
      <p style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.55;margin:0;">Sin alertas relevantes hoy. Todos los competidores con actividad normal.</p>
    </div>`
  }

  // Chips de competidores
  const chipsHtml = COMPETIDORES.map(c => `<span style="padding:5px 14px;border-radius:6px;font-size:11px;font-weight:700;background:#F7F8FC;border:1px solid #E4E8F0;color:#485270;letter-spacing:0.2px;">${c.nombre}</span>`).join('')

  // Engagement chart rows
  const engChartHtml = engSorted.map(e => {
    const pctLikes = Math.round((e.likes / maxLikes) * 100)
    const pctComments = Math.round((e.comentarios / maxLikes) * 100)
    const pctShares = Math.round((e.compartidos / maxLikes) * 100)
    return `<div style="display:grid;grid-template-columns:110px 1fr 80px;gap:16px;align-items:center;padding:12px 0;border-bottom:1px solid #E4E8F0;">
      <div style="font-size:13px;font-weight:700;color:#0D1226;display:flex;align-items:center;gap:8px;">
        <div style="width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;flex-shrink:0;background:${e.color};">${e.initial}</div>
        ${e.nombre}
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <div style="display:flex;align-items:center;gap:6px;"><div style="flex:1;height:7px;background:#F7F8FC;border-radius:4px;overflow:hidden;"><div style="height:100%;border-radius:4px;background:linear-gradient(90deg,#6C31D9,#2878F0);width:${pctLikes}%"></div></div><div style="font-size:11px;font-weight:600;color:#485270;width:36px;text-align:right;">${e.likes}</div></div>
        <div style="display:flex;align-items:center;gap:6px;"><div style="flex:1;height:7px;background:#F7F8FC;border-radius:4px;overflow:hidden;"><div style="height:100%;border-radius:4px;background:#0EA5E9;width:${pctComments}%"></div></div><div style="font-size:11px;font-weight:600;color:#485270;width:36px;text-align:right;">${e.comentarios}</div></div>
        <div style="display:flex;align-items:center;gap:6px;"><div style="flex:1;height:7px;background:#F7F8FC;border-radius:4px;overflow:hidden;"><div style="height:100%;border-radius:4px;background:#10B981;width:${pctShares}%"></div></div><div style="font-size:11px;font-weight:600;color:#485270;width:36px;text-align:right;">${e.compartidos}</div></div>
      </div>
      <div style="text-align:right;"><div style="font-size:20px;font-weight:800;color:#0D1226;letter-spacing:-0.5px;">${e.total.toLocaleString('es-CL')}</div><div style="font-size:10px;color:#8A93B0;font-weight:600;text-transform:uppercase;margin-top:2px;">Total</div></div>
    </div>`
  }).join('')

  // Ranking table
  const rankHtml = engSorted.map((e, i) => {
    const estado = getEstado(e)
    const rkClass = i === 0 ? 'background:linear-gradient(135deg,#6C31D9,#2878F0);color:#fff;' : i === 1 ? 'background:#EDE9FE;color:#6D28D9;' : i === 2 ? 'background:#DBEAFE;color:#1D4ED8;' : 'background:#F7F8FC;color:#8A93B0;'
    return `<tr>
      <td style="padding:13px 16px;font-size:13px;color:#485270;border-bottom:1px solid #E4E8F0;"><span style="width:22px;height:22px;border-radius:6px;font-size:10px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;${rkClass}">${i + 1}</span></td>
      <td style="padding:13px 16px;font-size:13px;font-weight:700;color:#0D1226;border-bottom:1px solid #E4E8F0;">${e.nombre}</td>
      <td style="padding:13px 16px;font-size:13px;color:#485270;text-align:center;border-bottom:1px solid #E4E8F0;">${e.posts}</td>
      <td style="padding:13px 16px;font-size:13px;color:#485270;text-align:center;border-bottom:1px solid #E4E8F0;"><strong>${e.likes}</strong></td>
      <td style="padding:13px 16px;font-size:13px;text-align:center;border-bottom:1px solid #E4E8F0;"><span style="display:inline-block;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;${estado.tag === 'tag-red' ? 'background:#FEE2E2;color:#991B1B;' : estado.tag === 'tag-purple' ? 'background:#EDE9FE;color:#5B21B6;' : estado.tag === 'tag-green' ? 'background:#D1FAE5;color:#065F46;' : 'background:#F3F4F6;color:#6B7280;'}">${estado.label}</span></td>
    </tr>`
  }).join('')

  // Posts destacados (top 4 por engagement)
  const topPosts = allPosts
    .map(p => ({ ...p, _engagement: (getLikes(p) || 0) + (getComentarios(p) || 0) + (getCompartidos(p) || 0) }))
    .sort((a, b) => b._engagement - a._engagement)
    .slice(0, 4)

  const postsHtml = topPosts.map(p => {
    const comp = p._comp || COMPETIDORES.find(c => c.nombre === p._competidor) || { nombre: 'Competidor', color: '#64748B', initial: '?' }
    const red = p._red || 'LinkedIn'
    const texto = getTextoPost(p).substring(0, 150)
    const likes = getLikes(p)
    const comentarios = getComentarios(p)
    const compartidos = getCompartidos(p)
    const isOferta = esOfertaLaboral(getTextoPost(p))
    const url = getPostUrl(p) || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : '')
    const netStyle = red === 'Instagram' ? 'background:#FCE7F3;color:#9D174D;' : 'background:#DBEAFE;color:#1E40AF;'

    return `<div style="background:#fff;border:1px solid #E4E8F0;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;${isOferta ? 'border-left:4px solid #DC2626;' : ''}">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;flex-shrink:0;background:${comp.color};">${comp.initial}</div>
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:800;color:#0D1226;">${comp.nombre}</div>
          <div style="display:flex;gap:5px;margin-top:3px;">
            <span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;${netStyle}">${red}</span>
            ${isOferta ? '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#FEE2E2;color:#991B1B;">⚠ Oferta laboral</span>' : ''}
            ${esPromocion(getTextoPost(p)) ? '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#EDE9FE;color:#5B21B6;">Promoción</span>' : ''}
          </div>
        </div>
      </div>
      <div style="font-size:13px;color:#485270;line-height:1.6;">"${texto}${texto.length >= 150 ? '...' : ''}"</div>
      <div style="display:flex;gap:14px;padding-top:12px;border-top:1px solid #E4E8F0;align-items:center;">
        <div style="display:flex;align-items:center;gap:5px;font-size:12px;"><span>❤️</span><span style="font-weight:700;color:#0D1226;">${likes}</span></div>
        <div style="display:flex;align-items:center;gap:5px;font-size:12px;"><span>💬</span><span style="font-weight:700;color:#0D1226;">${comentarios}</span></div>
        <div style="display:flex;align-items:center;gap:5px;font-size:12px;"><span>🔁</span><span style="font-weight:700;color:#0D1226;">${compartidos}</span></div>
        ${url ? `<a href="${url}" style="margin-left:auto;display:inline-block;font-size:11px;color:#fff;background:#3B82F6;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none;">Ver post →</a>` : ''}
      </div>
    </div>`
  }).join('')

  // ── HTML completo (diseño premium Radar Competencia) ─────────────────────
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #0D1226; background: #F7F8FC; min-height: 100vh; padding-bottom: 40px; }
</style>
</head>
<body>

<!-- TOP STRIPE -->
<div style="height:4px;background:linear-gradient(135deg,#6C31D9,#2878F0);"></div>

<!-- HEADER -->
<div style="background:#fff;border-bottom:1px solid #E4E8F0;padding:0 56px;">
  <div style="max-width:1040px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:72px;">
    <div style="display:flex;align-items:center;gap:14px;">
      ${LOGO_SRC ? `<img src="${LOGO_SRC}" alt="M&P" style="height:44px;width:auto;">` : '<div style="font-size:16px;font-weight:900;background:linear-gradient(135deg,#6C31D9,#2878F0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">M&P</div>'}
      <div style="width:1px;height:28px;background:#E4E8F0;"></div>
      <div style="font-size:12px;font-weight:600;color:#8A93B0;letter-spacing:0.5px;text-transform:uppercase;">Inteligencia Competitiva</div>
    </div>
    <div style="display:flex;align-items:center;gap:20px;">
      <span style="font-size:12px;color:#8A93B0;">${fecha} · ${hora}</span>
      <span style="background:#EEF2FF;border:1px solid #C7D2FE;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;color:#3730A3;">Genera Chile</span>
      <div style="display:flex;align-items:center;gap:6px;background:#ECFDF5;border:1px solid #A7F3D0;padding:5px 12px;border-radius:20px;">
        <div style="width:6px;height:6px;background:#10B981;border-radius:50%;"></div>
        <span style="font-size:11px;font-weight:700;color:#065F46;letter-spacing:0.5px;">LIVE</span>
      </div>
    </div>
  </div>
</div>

<!-- HERO -->
<div style="background:#fff;border-bottom:1px solid #E4E8F0;padding:32px 56px 28px;">
  <div style="max-width:1040px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;">
    <div>
      <h1 style="font-size:26px;font-weight:900;color:#0D1226;letter-spacing:-0.8px;line-height:1.15;">Radar de Competencia<br><span style="background:linear-gradient(135deg,#6C31D9,#2878F0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Software RRHH &amp; Nóminas</span></h1>
      <p style="font-size:13px;color:#8A93B0;margin-top:6px;">Instagram · LinkedIn · Ofertas laborales · Actualización diaria</p>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;">${chipsHtml}</div>
  </div>
</div>

<!-- BODY -->
<div style="max-width:1040px;margin:0 auto;padding:36px 56px 0;">

  <!-- KPIs -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px;">
    <div style="background:#fff;border:1px solid #E4E8F0;border-radius:12px;padding:22px 22px 18px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(135deg,#6C31D9,#2878F0);"></div>
      <div style="font-size:36px;font-weight:900;letter-spacing:-2px;line-height:1;background:linear-gradient(135deg,#6C31D9,#2878F0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${totalPosts}</div>
      <div style="font-size:11px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;margin-top:10px;">Posts publicados hoy</div>
    </div>
    <div style="background:#fff;border:1px solid #E4E8F0;border-radius:12px;padding:22px 22px 18px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(135deg,#6C31D9,#2878F0);"></div>
      <div style="font-size:36px;font-weight:900;color:#0D1226;letter-spacing:-2px;line-height:1;">${(totalLikes + totalComentarios + totalCompartidos).toLocaleString('es-CL')}</div>
      <div style="font-size:11px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;margin-top:10px;">Interacciones hoy</div>
    </div>
    <div style="background:#fff;border:1px solid #E4E8F0;border-radius:12px;padding:22px 22px 18px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${totalOfertas > 0 ? 'linear-gradient(90deg,#DC2626,#F87171)' : 'linear-gradient(135deg,#6C31D9,#2878F0)'};"></div>
      <div style="font-size:36px;font-weight:900;${totalOfertas > 0 ? 'color:#DC2626;' : 'color:#0D1226;'}letter-spacing:-2px;line-height:1;">${totalOfertas}</div>
      <div style="font-size:11px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;margin-top:10px;">Ofertas laborales</div>
      ${totalOfertas > 0 ? `<div style="font-size:12px;font-weight:600;margin-top:5px;color:#DC2626;">⚠ ${ofertas.map(p => p._comp?.nombre || p._competidor).filter((v,i,a) => a.indexOf(v) === i).join(' + ')}</div>` : ''}
    </div>
    <div style="background:#fff;border:1px solid #E4E8F0;border-radius:12px;padding:22px 22px 18px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${totalPromos > 0 ? 'linear-gradient(90deg,#D97706,#FCD34D)' : 'linear-gradient(135deg,#6C31D9,#2878F0)'};"></div>
      <div style="font-size:36px;font-weight:900;color:#0D1226;letter-spacing:-2px;line-height:1;">${totalPromos}</div>
      <div style="font-size:11px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;margin-top:10px;">Promociones detectadas</div>
    </div>
  </div>

  <!-- ALERTAS -->
  <div style="margin-bottom:32px;">
    <div style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;display:flex;align-items:center;gap:10px;margin-bottom:14px;">Alertas ejecutivas del día<div style="flex:1;height:1px;background:#E4E8F0;"></div></div>
    <div style="background:#0D1226;border-radius:14px;padding:28px 32px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1.2px;">Hallazgos · ${fecha}</div>
        ${alertCount > 0 ? `<span style="background:rgba(220,38,38,0.2);border:1px solid rgba(220,38,38,0.35);color:#FCA5A5;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">${alertCount} alerta${alertCount > 1 ? 's' : ''}</span>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${alertasHtml}
      </div>
    </div>
  </div>

  <!-- ENGAGEMENT CHART -->
  <div style="margin-bottom:32px;">
    <div style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;display:flex;align-items:center;gap:10px;margin-bottom:14px;">Engagement por competidor<div style="flex:1;height:1px;background:#E4E8F0;"></div></div>
    <div style="background:#fff;border:1px solid #E4E8F0;border-radius:14px;overflow:hidden;">
      <div style="padding:16px 22px 12px;display:flex;gap:20px;border-bottom:1px solid #E4E8F0;background:#F7F8FC;">
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#8A93B0;"><div style="width:10px;height:10px;border-radius:3px;background:linear-gradient(135deg,#6C31D9,#2878F0);"></div>Likes</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#8A93B0;"><div style="width:10px;height:10px;border-radius:3px;background:#0EA5E9;"></div>Comentarios</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#8A93B0;"><div style="width:10px;height:10px;border-radius:3px;background:#10B981;"></div>Compartidos</div>
      </div>
      <div style="padding:8px 22px;">
        ${engChartHtml}
      </div>
    </div>
  </div>

  <!-- RANKING -->
  <div style="margin-bottom:32px;">
    <div style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;display:flex;align-items:center;gap:10px;margin-bottom:14px;">Ranking de actividad<div style="flex:1;height:1px;background:#E4E8F0;"></div></div>
    <div style="background:#fff;border:1px solid #E4E8F0;border-radius:14px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background:#F7F8FC;text-align:left;border-bottom:1px solid #E4E8F0;width:40px;">#</th>
            <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background:#F7F8FC;text-align:left;border-bottom:1px solid #E4E8F0;">Empresa</th>
            <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;">Posts</th>
            <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;">Likes</th>
            <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;">Estado</th>
          </tr>
        </thead>
        <tbody>${rankHtml}</tbody>
      </table>
    </div>
  </div>

  <!-- POSTS DESTACADOS -->
  <div style="margin-bottom:32px;">
    <div style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;display:flex;align-items:center;gap:10px;margin-bottom:14px;">Posts destacados del día<div style="flex:1;height:1px;background:#E4E8F0;"></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${postsHtml || '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#8A93B0;font-size:13px;">Sin posts destacados hoy</div>'}
    </div>
  </div>

</div>

<!-- FOOTER -->
<div style="max-width:1040px;margin:40px auto 0;padding:0 56px;">
  <div style="display:flex;align-items:center;justify-content:space-between;padding-top:24px;border-top:1px solid #E4E8F0;">
    <div style="display:flex;align-items:center;gap:12px;">
      ${LOGO_SRC ? `<img src="${LOGO_SRC}" alt="M&P" style="height:30px;">` : '<div style="font-size:12px;font-weight:900;background:linear-gradient(135deg,#6C31D9,#2878F0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">M&P</div>'}
      <div style="font-size:12px;font-weight:600;color:#8A93B0;">Muller & Pérez · Inteligencia Competitiva</div>
    </div>
    <div style="font-size:11px;color:#8A93B0;text-align:right;line-height:1.7;">
      Reporte confidencial para uso exclusivo de Genera Chile<br>
      Generado automáticamente · ${fecha} · ${hora}
    </div>
  </div>
</div>

</body>
</html>`
}


// ─── Envío de email con PDF adjunto ─────────────────────────────────────────
async function enviarEmail({ hoy, postsIG, postsLinkedin, competidoresConPostIG, sinActividadIG, allPosts }) {
  const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no definida — email no enviado.')
    return
  }

  const reporteHtml = generarHtmlReporte({ hoy, postsIG, postsLinkedin, competidoresConPostIG, sinActividadIG, allPosts })
  const fecha = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const totalPosts = postsIG.length + postsLinkedin.length
  const totalOfertas = allPosts.filter(p => esOfertaLaboral(getTextoPost(p))).length
  const totalPromos = allPosts.filter(p => esPromocion(getTextoPost(p))).length

  let subjectExtra = ''
  if (totalOfertas > 0) subjectExtra += ` · ⚠️ ${totalOfertas} oferta${totalOfertas > 1 ? 's' : ''}`
  if (totalPromos > 0) subjectExtra += ` · 🏷️ ${totalPromos} promo${totalPromos > 1 ? 's' : ''}`

  const payload = {
    from: 'Müller & Pérez <contacto@mulleryperez.cl>',
    to: ['contacto@mulleryperez.cl'],
    subject: `📊 Radar Genera — ${fecha} (${totalPosts} posts${subjectExtra})`,
    html: `<div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:0 auto;padding:32px 16px;color:#1E293B;">
    <h2 style="font-size:18px;font-weight:800;margin:0 0 8px;">📊 Radar de Competencia — Genera Chile</h2>
    <p style="color:#64748B;font-size:13px;margin:0 0 20px;">${fecha}</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts Instagram</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsIG.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts LinkedIn</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsLinkedin.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Sin actividad IG</td><td style="padding:8px 0;font-weight:700;text-align:right;">${sinActividadIG.length}</td></tr>
      ${totalOfertas > 0 ? `<tr><td style="padding:8px 0;color:#92400E;font-weight:700;">⚠️ Ofertas laborales</td><td style="padding:8px 0;font-weight:700;color:#92400E;text-align:right;">${totalOfertas}</td></tr>` : ''}
      ${totalPromos > 0 ? `<tr><td style="padding:8px 0;color:#5B21B6;font-weight:700;">🏷️ Promociones</td><td style="padding:8px 0;font-weight:700;color:#5B21B6;text-align:right;">${totalPromos}</td></tr>` : ''}
    </table>
    <p style="font-size:12px;color:#94A3B8;">El reporte completo se adjunta en PDF.</p>
  </div>`,
  }

  // Generar PDF y adjuntar
  const pdfBuffer = generarPDF(reporteHtml)
  if (pdfBuffer) {
    payload.attachments = [{ filename: `Radar-Genera-${hoy}.pdf`, content: pdfBuffer.toString('base64') }]
    console.log(`📎 Email con PDF adjunto`)
  } else {
    payload.attachments = [{ filename: `Radar-Genera-${hoy}.html`, content: Buffer.from(reporteHtml).toString('base64') }]
    console.log(`📄 Email con HTML adjunto (fallback)`)
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (res.ok) {
    console.log('✉️  Email enviado a contacto@mulleryperez.cl')
  } else {
    const err = await res.text()
    console.error('❌ Error enviando email:', err)
  }
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
