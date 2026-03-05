// scrape-genera.js
// Radar de Competencia — Genera Chile (Piloto)
// Corre L-V 08:30 AM via GitHub Actions
// Scrape Instagram + LinkedIn de competidores de software RRHH
// Detecta ofertas laborales y promociones comerciales
// Envía reporte premium como HTML en el cuerpo del email

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
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
  // Generales — señales de publicación de empleo
  'se busca', 'buscamos', 'oferta laboral', 'postula', 'postúlate', 'vacante',
  'cargo disponible', 'remuneración', 'jornada', 'contrato', 'enviar cv', 'envía tu cv',
  'trabaja con nosotros', 'únete a', 'únete al equipo', 'incorporar', 'requisitos',
  'join our team', 'we are hiring', 'hiring', 'open position', 'job opening', 'apply now',

  // Cargos operativos RRHH
  'asistente de recursos humanos', 'administrativo de rr.hh', 'asistente de personal',
  'asistente de talento humano', 'asistente de gestión de personas',
  'asistente de reclutamiento', 'coordinador de reclutamiento', 'sourcer de talento',
  'reclutador junior', 'analista de rr.hh', 'analista de nómina',
  'analista de remuneraciones', 'analista de control de asistencia', 'analista de personal',
  'people operations assistant', 'talent operations assistant', 'people coordinator',

  // Cargos medios / especialistas RRHH
  'analista de recursos humanos', 'generalista de rr.hh', 'hr generalist',
  'business partner junior', 'hr business partner',
  'especialista en atracción de talento', 'talent acquisition specialist',
  'talent partner', 'talent manager',
  'especialista en desarrollo organizacional', 'especialista en cultura organizacional',
  'especialista en capacitación', 'learning & development',
  'especialista en compensaciones', 'compensation & benefits',
  'coordinador de rr.hh', 'coordinador de talento', 'coordinador de cultura',
  'coordinador de desarrollo organizacional',
  'people manager', 'people operations manager', 'talent development manager',

  // Cargos altos / dirección RRHH
  'jefe de recursos humanos', 'gerente de recursos humanos',
  'gerente de gestión de personas', 'gerente de talento',
  'gerente de cultura organizacional',
  'director de recursos humanos', 'director de talento', 'director de personas',
  'director de people', 'chief people officer', 'chief talent officer',
  'chief human resources officer', 'chief culture officer', 'chro', 'cpo',

  // Variantes modernas (startups / tech / SaaS)
  'people experience manager', 'employee experience manager',
  'head of people', 'head of talent', 'head of',
  'workforce strategy', 'organizational effectiveness',
  'human capital manager', 'talent acquisition',

  // Roles comerciales / ventas SaaS
  'ejecutivo comercial', 'account executive', 'account manager', 'key account',
  'sales representative', 'sales manager', 'sales executive',
  'closer', 'sdr', 'bdr', 'pre-venta', 'preventa', 'business development',

  // Roles Customer Success / Soporte
  'customer success', 'csm', 'onboarding', 'consultor de implementación',
  'implementation consultant', 'soporte técnico',

  // Roles Tech / Producto
  'desarrollador', 'developer', 'full stack', 'fullstack', 'frontend', 'backend',
  'software engineer', 'product manager', 'product owner',
  'ux designer', 'data engineer', 'data analyst',

  // Liderazgo general
  'líder de', 'jefe de', 'gerente de', 'director de', 'vp of', 'country manager',
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
  const hace72h = new Date(Date.now() - 72 * 60 * 60 * 1000)

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
    postsIG = all.filter(p => p.timestamp && new Date(p.timestamp) > hace72h)
    console.log(`✅ Instagram: ${postsIG.length} posts en las últimas 72h`)
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
  const postsLinkedin = await scrapeLinkedin(hace72h)

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
async function scrapeLinkedin(hace72h) {
  const conLI = COMPETIDORES.filter(c => c.linkedin)
  if (conLI.length === 0) return []

  // Actor primario: apimaestro (2.4M runs, 99.99% éxito)
  console.log(`💼 LinkedIn [primario: apimaestro] — ${conLI.length} empresas...`)
  let posts = await tryLinkedinActor(
    'apimaestro~linkedin-company-posts',
    { urls: conLI.map(c => c.linkedin) },
    hace72h, conLI
  )

  if (posts === null) {
    // Fallback: harvestapi (547K runs, 100% éxito 30d)
    console.log(`⚠️ Primario falló. LinkedIn [fallback: harvestapi]...`)
    posts = await tryLinkedinActor(
      'harvestapi~linkedin-company-posts',
      { targetUrls: conLI.map(c => c.linkedin), maxPosts: 5 },
      hace72h, conLI
    )
  }

  if (posts === null) {
    console.warn('❌ Ambos actores LinkedIn fallaron. Continuando sin LinkedIn.')
    return []
  }

  return posts
}

async function tryLinkedinActor(actorId, input, hace72h, conLI) {
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
      return fecha && new Date(fecha) > hace72h
    }).map(p => {
      // Intentar matchear con competidor por URL o nombre
      const compName = p.companyName || p.authorName || p.author || ''
      const matched = conLI.find(c =>
        compName.toLowerCase().includes(c.nombre.toLowerCase()) ||
        (p.companyUrl && c.linkedin && p.companyUrl.includes(c.linkedin.replace('https://www.linkedin.com', '')))
      )
      return { ...p, _competidor: matched ? matched.nombre : compName }
    })

    console.log(`✅ LinkedIn [${actorId}]: ${recientes.length} posts en últimas 72h (de ${all.length} total)`)
    return recientes
  } catch (err) {
    console.warn(`⚠️ ${actorId} error:`, err.message)
    return null
  }
}


// (PDF removido — el reporte se envía como HTML en el cuerpo del email)


// ─── HTML del reporte (100% tablas — compatible Gmail/Outlook) ───────────────
function generarHtmlReporte({ hoy, postsIG, postsLinkedin, competidoresConPostIG, sinActividadIG, allPosts }) {
  const fechaObj = new Date(hoy + 'T12:00:00')
  const fecha = fechaObj.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const hora = '08:30 AM'

  const totalPosts = postsIG.length + postsLinkedin.length
  const totalLikes = allPosts.reduce((s, p) => s + (getLikes(p) || 0), 0)
  const totalComentarios = allPosts.reduce((s, p) => s + (getComentarios(p) || 0), 0)
  const totalCompartidos = allPosts.reduce((s, p) => s + (getCompartidos(p) || 0), 0)

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

  const maxEng = Math.max(...engSorted.map(e => e.total), 1)

  function getEstado(comp) {
    const posts = allPosts.filter(p => (p._comp?.nombre || p._competidor) === comp.nombre)
    if (posts.some(p => esOfertaLaboral(getTextoPost(p)))) return { bg: '#FEE2E2', color: '#991B1B', label: '⚠ Oferta' }
    if (posts.some(p => esPromocion(getTextoPost(p)))) return { bg: '#EDE9FE', color: '#5B21B6', label: 'Promo' }
    if (posts.length === 0) return { bg: '#F3F4F6', color: '#6B7280', label: 'Silencio' }
    return { bg: '#D1FAE5', color: '#065F46', label: 'Normal' }
  }

  // ── Alertas rows (table-based) ──
  let alertRows = ''
  let alertCount = 0

  ofertas.forEach(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const texto = getTextoPost(p).substring(0, 200)
    alertRows += `<tr><td style="padding:8px 0;vertical-align:top;width:90px;"><span style="display:inline-block;padding:4px 10px;background:#4A1515;color:#FCA5A5;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">🚨 URGENTE</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#A0A8C0;line-height:1.55;"><strong style="color:#fff;">${comp}</strong> publicó oferta laboral: "${texto}..."</td></tr>`
    alertCount++
  })

  promos.forEach(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const texto = getTextoPost(p).substring(0, 200)
    alertRows += `<tr><td style="padding:8px 0;vertical-align:top;width:90px;"><span style="display:inline-block;padding:4px 10px;background:#3D2B08;color:#FCD34D;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">⚠ ATENCIÓN</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#A0A8C0;line-height:1.55;"><strong style="color:#fff;">${comp}</strong> lanzó promoción: "${texto}..."</td></tr>`
    alertCount++
  })

  const sinActividad = COMPETIDORES.filter(c => engagementMap[c.nombre].posts === 0)
  if (sinActividad.length > 0) {
    alertRows += `<tr><td style="padding:8px 0;vertical-align:top;width:90px;"><span style="display:inline-block;padding:4px 10px;background:#0A2E1F;color:#6EE7B7;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">✓ OK</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#A0A8C0;line-height:1.55;"><strong style="color:#fff;">${sinActividad.map(c => c.nombre).join(' y ')}</strong> sin actividad relevante (72h).</td></tr>`
  }

  if (!alertRows) {
    alertRows = `<tr><td style="padding:8px 0;vertical-align:top;width:90px;"><span style="display:inline-block;padding:4px 10px;background:#0A2E1F;color:#6EE7B7;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">✓ OK</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#A0A8C0;line-height:1.55;">Sin alertas relevantes. Todos los competidores con actividad normal.</td></tr>`
  }

  // ── Engagement rows (table-based bars) ──
  const engRows = engSorted.map(e => {
    const pct = maxEng > 0 ? Math.max(Math.round((e.total / maxEng) * 100), 2) : 2
    return `<tr>
      <td style="padding:10px 12px;vertical-align:middle;width:120px;border-bottom:1px solid #E4E8F0;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="width:28px;height:28px;background-color:${e.color};color:#fff;font-size:12px;font-weight:900;text-align:center;border-radius:7px;">${e.initial}</td>
          <td style="padding-left:8px;font-size:13px;font-weight:700;color:#0D1226;">${e.nombre}</td>
        </tr></table>
      </td>
      <td style="padding:10px 12px;vertical-align:middle;border-bottom:1px solid #E4E8F0;">
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr>
          <td style="width:${pct}%;height:8px;background-color:#6C31D9;border-radius:4px;font-size:1px;">&nbsp;</td>
          <td style="font-size:1px;">&nbsp;</td>
        </tr></table>
      </td>
      <td style="padding:10px 12px;vertical-align:middle;text-align:center;width:60px;border-bottom:1px solid #E4E8F0;">
        <span style="font-size:11px;font-weight:600;color:#485270;">❤️ ${e.likes}</span>
      </td>
      <td style="padding:10px 12px;vertical-align:middle;text-align:center;width:60px;border-bottom:1px solid #E4E8F0;">
        <span style="font-size:11px;font-weight:600;color:#485270;">💬 ${e.comentarios}</span>
      </td>
      <td style="padding:10px 12px;vertical-align:middle;text-align:right;width:70px;border-bottom:1px solid #E4E8F0;">
        <span style="font-size:18px;font-weight:800;color:#0D1226;">${e.total.toLocaleString('es-CL')}</span>
      </td>
    </tr>`
  }).join('')

  // ── Ranking rows ──
  const rankRows = engSorted.map((e, i) => {
    const estado = getEstado(e)
    const rkBg = i === 0 ? '#6C31D9' : i === 1 ? '#EDE9FE' : i === 2 ? '#DBEAFE' : '#F7F8FC'
    const rkColor = i === 0 ? '#fff' : i === 1 ? '#6D28D9' : i === 2 ? '#1D4ED8' : '#8A93B0'
    return `<tr>
      <td style="padding:12px 16px;border-bottom:1px solid #E4E8F0;text-align:center;width:40px;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;border-radius:6px;font-size:10px;font-weight:800;text-align:center;background-color:${rkBg};color:${rkColor};">${i + 1}</span></td>
      <td style="padding:12px 16px;border-bottom:1px solid #E4E8F0;font-size:13px;font-weight:700;color:#0D1226;">${e.nombre}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #E4E8F0;font-size:13px;color:#485270;text-align:center;">${e.posts}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #E4E8F0;font-size:13px;color:#485270;text-align:center;font-weight:700;">${e.likes}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #E4E8F0;text-align:center;"><span style="display:inline-block;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;background-color:${estado.bg};color:${estado.color};">${estado.label}</span></td>
    </tr>`
  }).join('')

  // ── Posts destacados (top 4) ──
  const topPosts = allPosts
    .map(p => ({ ...p, _engagement: (getLikes(p) || 0) + (getComentarios(p) || 0) + (getCompartidos(p) || 0) }))
    .sort((a, b) => b._engagement - a._engagement)
    .slice(0, 4)

  const postCells = topPosts.map(p => {
    const comp = p._comp || COMPETIDORES.find(c => c.nombre === p._competidor) || { nombre: '?', color: '#64748B', initial: '?' }
    const red = p._red || 'LinkedIn'
    const texto = getTextoPost(p).substring(0, 150)
    const likes = getLikes(p)
    const comentarios = getComentarios(p)
    const compartidos = getCompartidos(p)
    const isOferta = esOfertaLaboral(getTextoPost(p))
    const isPromo = esPromocion(getTextoPost(p))
    const url = getPostUrl(p) || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : '')
    const netBg = red === 'Instagram' ? '#FCE7F3' : '#DBEAFE'
    const netColor = red === 'Instagram' ? '#9D174D' : '#1E40AF'
    const borderLeft = isOferta ? 'border-left:4px solid #DC2626;' : ''

    return `<td style="width:50%;vertical-align:top;padding:6px;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:12px;${borderLeft}">
        <tr><td style="padding:18px 18px 10px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:36px;height:36px;background-color:${comp.color};color:#fff;font-size:14px;font-weight:900;text-align:center;line-height:36px;border-radius:8px;">${comp.initial}</td>
            <td style="padding-left:10px;vertical-align:middle;">
              <span style="font-size:14px;font-weight:800;color:#0D1226;">${comp.nombre}</span><br>
              <span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background-color:${netBg};color:${netColor};margin-top:3px;">${red}</span>
              ${isOferta ? ' <span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background-color:#FEE2E2;color:#991B1B;">⚠ Oferta</span>' : ''}
              ${isPromo ? ' <span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background-color:#EDE9FE;color:#5B21B6;">Promo</span>' : ''}
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:4px 18px 12px;font-size:13px;color:#485270;line-height:1.6;">"${texto}${texto.length >= 150 ? '...' : ''}"</td></tr>
        <tr><td style="padding:0 18px 16px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-top:1px solid #E4E8F0;">
            <tr><td style="padding-top:10px;font-size:12px;color:#0D1226;">❤️ <strong>${likes}</strong> &nbsp; 💬 <strong>${comentarios}</strong> &nbsp; 🔁 <strong>${compartidos}</strong></td>
            ${url ? `<td style="padding-top:10px;text-align:right;"><a href="${url}" style="display:inline-block;font-size:11px;color:#fff;background-color:#3B82F6;padding:6px 14px;border-radius:6px;font-weight:600;text-decoration:none;">Ver →</a></td>` : ''}
            </tr>
          </table>
        </td></tr>
      </table>
    </td>`
  })

  // Armar grilla 2×2 de posts
  let postsGrid = ''
  if (postCells.length > 0) {
    postsGrid += '<tr>' + (postCells[0] || '<td></td>') + (postCells[1] || '<td></td>') + '</tr>'
    if (postCells.length > 2) {
      postsGrid += '<tr>' + (postCells[2] || '<td></td>') + (postCells[3] || '<td></td>') + '</tr>'
    }
  } else {
    postsGrid = '<tr><td colspan="2" style="text-align:center;padding:40px;color:#8A93B0;font-size:13px;">Sin posts destacados</td></tr>'
  }

  // ── Chips competidores ──
  const chipsHtml = COMPETIDORES.map(c =>
    `<span style="display:inline-block;padding:5px 14px;border-radius:6px;font-size:11px;font-weight:700;background-color:#F7F8FC;border:1px solid #E4E8F0;color:#485270;margin:0 3px 3px 0;">${c.nombre}</span>`
  ).join('')

  // ══════════════════════════════════════════════════════════════════════════
  // HTML COMPLETO — 100% tablas, compatible Gmail / Outlook / Apple Mail
  // ══════════════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Radar Competencia · Genera Chile</title>
<!--[if mso]><style>table,td{font-family:Arial,sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F7F8FC;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#0D1226;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- TOP STRIPE -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#6C31D9;"><tr><td style="height:4px;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>

<!-- HEADER -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-bottom:1px solid #E4E8F0;">
  <tr><td style="padding:0 20px;">
    <table cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;margin:0 auto;">
      <tr>
        <td style="padding:16px 0;vertical-align:middle;">
          ${LOGO_SRC ? `<img src="${LOGO_SRC}" alt="M&P" width="110" style="display:inline-block;height:auto;max-height:40px;">` : '<span style="font-size:16px;font-weight:900;color:#6C31D9;">M&amp;P</span>'}
          <span style="display:inline-block;width:1px;height:24px;background-color:#E4E8F0;vertical-align:middle;margin:0 12px;"></span>
          <span style="font-size:11px;font-weight:600;color:#8A93B0;letter-spacing:0.5px;text-transform:uppercase;vertical-align:middle;">Inteligencia Competitiva</span>
        </td>
        <td style="padding:16px 0;text-align:right;vertical-align:middle;">
          <span style="font-size:11px;color:#8A93B0;margin-right:12px;">${fecha} · ${hora}</span>
          <span style="display:inline-block;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;color:#3730A3;background-color:#EEF2FF;border:1px solid #C7D2FE;">Genera Chile</span>
          <span style="display:inline-block;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700;color:#065F46;background-color:#ECFDF5;border:1px solid #A7F3D0;margin-left:8px;">● LIVE</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>

<!-- HERO -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-bottom:1px solid #E4E8F0;">
  <tr><td style="padding:28px 20px 24px;">
    <table cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;margin:0 auto;">
      <tr>
        <td style="vertical-align:bottom;">
          <h1 style="margin:0;font-size:24px;font-weight:900;color:#0D1226;letter-spacing:-0.5px;line-height:1.2;">Radar de Competencia</h1>
          <h1 style="margin:0;font-size:24px;font-weight:900;color:#6C31D9;letter-spacing:-0.5px;line-height:1.2;">Software RRHH &amp; Nóminas</h1>
          <p style="margin:6px 0 0;font-size:13px;color:#8A93B0;">Instagram · LinkedIn · Ofertas laborales · Actualización diaria</p>
        </td>
        <td style="vertical-align:bottom;text-align:right;">
          ${chipsHtml}
        </td>
      </tr>
    </table>
  </td></tr>
</table>

<!-- BODY -->
<table cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;margin:0 auto;padding:0 20px;">

  <!-- KPIs (4 columnas) -->
  <tr><td style="padding:28px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width:25%;padding:0 4px 0 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:10px;border-top:3px solid #6C31D9;">
            <tr><td style="padding:18px 16px 14px;">
              <span style="font-size:32px;font-weight:900;color:#6C31D9;letter-spacing:-2px;">${totalPosts}</span><br>
              <span style="font-size:10px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.5px;">Posts (72h)</span>
            </td></tr>
          </table>
        </td>
        <td style="width:25%;padding:0 4px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:10px;border-top:3px solid #6C31D9;">
            <tr><td style="padding:18px 16px 14px;">
              <span style="font-size:32px;font-weight:900;color:#0D1226;letter-spacing:-2px;">${(totalLikes + totalComentarios + totalCompartidos).toLocaleString('es-CL')}</span><br>
              <span style="font-size:10px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.5px;">Interacciones</span>
            </td></tr>
          </table>
        </td>
        <td style="width:25%;padding:0 4px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:10px;border-top:3px solid ${totalOfertas > 0 ? '#DC2626' : '#6C31D9'};">
            <tr><td style="padding:18px 16px 14px;">
              <span style="font-size:32px;font-weight:900;color:${totalOfertas > 0 ? '#DC2626' : '#0D1226'};letter-spacing:-2px;">${totalOfertas}</span><br>
              <span style="font-size:10px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.5px;">Ofertas laborales</span>
              ${totalOfertas > 0 ? `<br><span style="font-size:11px;font-weight:600;color:#DC2626;">⚠ ${ofertas.map(p => p._comp?.nombre || p._competidor).filter((v,i,a) => a.indexOf(v) === i).join(' + ')}</span>` : ''}
            </td></tr>
          </table>
        </td>
        <td style="width:25%;padding:0 0 0 4px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:10px;border-top:3px solid ${totalPromos > 0 ? '#D97706' : '#6C31D9'};">
            <tr><td style="padding:18px 16px 14px;">
              <span style="font-size:32px;font-weight:900;color:#0D1226;letter-spacing:-2px;">${totalPromos}</span><br>
              <span style="font-size:10px;font-weight:600;color:#8A93B0;text-transform:uppercase;letter-spacing:0.5px;">Promociones</span>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- SECTION: ALERTAS -->
  <tr><td style="padding:28px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;padding-bottom:12px;">Alertas ejecutivas del día
          <span style="display:inline-block;width:60%;border-bottom:1px solid #E4E8F0;vertical-align:middle;margin-left:10px;">&nbsp;</span>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0D1226;border-radius:12px;">
      <tr><td style="padding:24px 28px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-size:11px;font-weight:800;color:#555E7A;text-transform:uppercase;letter-spacing:1.2px;padding-bottom:16px;">Hallazgos · ${fecha}</td>
            ${alertCount > 0 ? `<td style="text-align:right;padding-bottom:16px;"><span style="display:inline-block;padding:3px 10px;border-radius:20px;background-color:#4A1515;color:#FCA5A5;font-size:11px;font-weight:700;">${alertCount} alerta${alertCount > 1 ? 's' : ''}</span></td>` : ''}
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${alertRows}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- SECTION: ENGAGEMENT -->
  <tr><td style="padding:28px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;padding-bottom:12px;">Engagement por competidor
        <span style="display:inline-block;width:55%;border-bottom:1px solid #E4E8F0;vertical-align:middle;margin-left:10px;">&nbsp;</span>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:12px;">
      <tr><td style="padding:12px 16px;background-color:#F7F8FC;border-bottom:1px solid #E4E8F0;font-size:11px;font-weight:600;color:#8A93B0;">
        <span style="display:inline-block;width:10px;height:10px;background-color:#6C31D9;border-radius:3px;vertical-align:middle;margin-right:4px;"></span> Likes
        &nbsp;&nbsp;
        <span style="display:inline-block;width:10px;height:10px;background-color:#0EA5E9;border-radius:3px;vertical-align:middle;margin-right:4px;"></span> Comentarios
        &nbsp;&nbsp;
        <span style="display:inline-block;width:10px;height:10px;background-color:#10B981;border-radius:3px;vertical-align:middle;margin-right:4px;"></span> Compartidos
      </td></tr>
      <tr><td style="padding:4px 8px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${engRows}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- SECTION: RANKING -->
  <tr><td style="padding:28px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;padding-bottom:12px;">Ranking de actividad
        <span style="display:inline-block;width:60%;border-bottom:1px solid #E4E8F0;vertical-align:middle;margin-left:10px;">&nbsp;</span>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E4E8F0;border-radius:12px;border-collapse:separate;">
      <tr>
        <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background-color:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;width:40px;">#</th>
        <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background-color:#F7F8FC;text-align:left;border-bottom:1px solid #E4E8F0;">Empresa</th>
        <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background-color:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;">Posts</th>
        <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background-color:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;">Likes</th>
        <th style="padding:10px 16px;font-size:10px;font-weight:700;color:#8A93B0;text-transform:uppercase;letter-spacing:0.6px;background-color:#F7F8FC;text-align:center;border-bottom:1px solid #E4E8F0;">Estado</th>
      </tr>
      ${rankRows}
    </table>
  </td></tr>

  <!-- SECTION: POSTS DESTACADOS -->
  <tr><td style="padding:28px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="font-size:11px;font-weight:800;color:#8A93B0;text-transform:uppercase;letter-spacing:1.2px;padding-bottom:12px;">Posts destacados (72h)
        <span style="display:inline-block;width:60%;border-bottom:1px solid #E4E8F0;vertical-align:middle;margin-left:10px;">&nbsp;</span>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      ${postsGrid}
    </table>
  </td></tr>

</table>

<!-- FOOTER -->
<table cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;margin:36px auto 0;">
  <tr><td style="border-top:1px solid #E4E8F0;padding:20px 20px 40px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="vertical-align:middle;">
          ${LOGO_SRC ? `<img src="${LOGO_SRC}" alt="M&P" width="80" style="display:inline-block;height:auto;max-height:28px;vertical-align:middle;">` : '<span style="font-size:12px;font-weight:900;color:#6C31D9;">M&amp;P</span>'}
          <span style="font-size:12px;font-weight:600;color:#8A93B0;vertical-align:middle;margin-left:10px;">Muller &amp; Pérez · Inteligencia Competitiva</span>
        </td>
        <td style="text-align:right;font-size:11px;color:#8A93B0;line-height:1.7;vertical-align:middle;">
          Reporte confidencial · Genera Chile<br>
          ${fecha} · ${hora}
        </td>
      </tr>
    </table>
  </td></tr>
</table>

</body>
</html>`
}


// ─── Envío de email con HTML premium en el cuerpo ───────────────────────────
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
    html: reporteHtml,
  }

  console.log(`📧 Enviando reporte HTML premium en el cuerpo del email...`)

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
