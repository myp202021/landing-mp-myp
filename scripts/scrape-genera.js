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
  // apimaestro usa p.stats.likes, otros usan campos directos
  if (p.stats) {
    return p.stats.likes || p.stats.reactions || p.stats.totalReactionCount || 0
  }
  return p.likesCount || p.totalReactionCount || p.reactions || p.likes || 0
}

function getComentarios(p) {
  if (p.stats) return p.stats.comments || 0
  return p.commentsCount || p.comments || p.commentCount || 0
}

function getCompartidos(p) {
  if (p.stats) return p.stats.shares || p.stats.reposts || 0
  return p.sharesCount || p.shares || p.repostCount || p.reposts || 0
}

function getPostUrl(p) {
  return p.url || p.post_url || p.postUrl || p.postLink || p.link || ''
}

function getAuthorName(p) {
  // apimaestro: author es un objeto con name, url, etc.
  if (p.author && typeof p.author === 'object') return p.author.name || ''
  if (p.source_company && typeof p.source_company === 'object') return p.source_company.name || ''
  return p.author || p.companyName || p.authorName || ''
}

function getAuthorUrl(p) {
  if (p.author && typeof p.author === 'object') return p.author.url || ''
  if (p.source_company && typeof p.source_company === 'object') return p.source_company.url || ''
  return p.companyUrl || p.authorUrl || ''
}

function getFechaPost(p) {
  // apimaestro usa posted_at (snake_case)
  const raw = p.timestamp || p.posted_at || p.postedAt || p.publishedAt || p.date || p.time
    || p.postedDate || p.publishedDate || p.createdAt || p.postedDateTimestamp || null

  // timeSincePosted: "3d", "1w", "2h", "5mo" — convertir a Date
  if (!raw && p.timeSincePosted) {
    const tsp = p.timeSincePosted.trim().toLowerCase()
    const num = parseInt(tsp)
    if (!isNaN(num)) {
      const now = Date.now()
      if (tsp.includes('h')) return new Date(now - num * 3600000).toISOString()
      if (tsp.includes('d')) return new Date(now - num * 86400000).toISOString()
      if (tsp.includes('w')) return new Date(now - num * 604800000).toISOString()
      if (tsp.includes('mo')) return new Date(now - num * 2592000000).toISOString()
      if (tsp.includes('y')) return new Date(now - num * 31536000000).toISOString()
    }
    return null
  }

  if (!raw) return null
  if (typeof raw === 'number') {
    return raw > 1e12 ? new Date(raw).toISOString() : new Date(raw * 1000).toISOString()
  }
  return raw
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
        body: JSON.stringify({ directUrls: profileUrls, resultsType: 'posts', resultsLimit: 12, addParentData: true }),
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

    // Debug: mostrar estructura de posts para entender campos
    if (all.length > 0) {
      const sample = all[0]
      console.log(`🔍 LinkedIn sample keys: ${Object.keys(sample).join(', ')}`)
      console.log(`   📅 posted_at = ${sample.posted_at}`)
      console.log(`   📅 getFechaPost = ${getFechaPost(sample)}`)
      console.log(`   🏢 getAuthorName = ${getAuthorName(sample)}`)
      console.log(`   🏢 getAuthorUrl = ${getAuthorUrl(sample)}`)
      if (sample.stats) console.log(`   📊 stats = ${JSON.stringify(sample.stats)}`)
      if (sample.source_company) console.log(`   🏢 source_company = ${JSON.stringify(sample.source_company)}`)
      // Mostrar fechas de los primeros 5 posts
      all.slice(0, 5).forEach((p, i) => {
        const f = getFechaPost(p)
        const name = getAuthorName(p)
        console.log(`   [${i}] fecha=${f} autor=${name} text=${(p.text||'').substring(0,60)}...`)
      })
    }

    // Filtrar posts recientes y asignar competidor
    const recientes = all.filter(p => {
      const fecha = getFechaPost(p)
      if (!fecha) return false
      const parsed = new Date(fecha)
      if (isNaN(parsed.getTime())) return false
      return parsed > hace72h
    }).map(p => {
      // Intentar matchear con competidor por URL o nombre
      const compName = getAuthorName(p)
      const compUrl = getAuthorUrl(p)
      const matched = conLI.find(c => {
        if (compName && compName.toLowerCase().includes(c.nombre.toLowerCase())) return true
        if (compUrl && c.linkedin) {
          const slug = c.linkedin.replace('https://www.linkedin.com', '').replace(/\/$/, '')
          if (compUrl.includes(slug)) return true
        }
        // source_company URL match
        if (p.source_company?.url && c.linkedin) {
          const slug = c.linkedin.replace('https://www.linkedin.com', '').replace(/\/$/, '')
          if (p.source_company.url.includes(slug)) return true
        }
        return false
      })
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
// Estructura: KPIs → Alertas → Instagram → LinkedIn → Ofertas Laborales
function generarHtmlReporte({ hoy, postsIG, postsLinkedin, competidoresConPostIG, sinActividadIG, allPosts }) {
  const fechaObj = new Date(hoy + 'T12:00:00')
  const fecha = fechaObj.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const hora = '08:30 AM'

  const totalPosts = postsIG.length + postsLinkedin.length
  const totalLikesIG = postsIG.reduce((s, p) => s + (getLikes(p) || 0), 0)
  const totalLikesLI = postsLinkedin.reduce((s, p) => s + (getLikes(p) || 0), 0)
  const totalReactionsLI = postsLinkedin.reduce((s, p) => s + (getLikes(p) || 0) + (getComentarios(p) || 0) + (getCompartidos(p) || 0), 0)

  const ofertas = allPosts.filter(p => esOfertaLaboral(getTextoPost(p)))
  const promos = allPosts.filter(p => esPromocion(getTextoPost(p)))
  const totalOfertas = ofertas.length
  const totalPromos = promos.length

  // ── Helpers para secciones ──
  const TH = 'padding:10px 14px;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;background-color:#F8FAFC;border-bottom:1px solid #E2E8F0;'
  const TD = 'padding:11px 14px;font-size:13px;border-bottom:1px solid #F1F5F9;'
  const W = 680 // max-width

  function sectionTitle(icon, text, color) {
    return `<tr><td style="padding:32px 0 14px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td style="font-size:13px;font-weight:800;color:${color || '#1E293B'};letter-spacing:0.3px;">${icon} ${text}</td>
        <td style="border-bottom:2px solid ${color || '#E2E8F0'};width:60%;">&nbsp;</td>
      </tr></table>
    </td></tr>`
  }

  function postCard(p, red) {
    const comp = p._comp || COMPETIDORES.find(c => c.nombre === p._competidor) || { nombre: '?', color: '#64748B', initial: '?' }
    const texto = getTextoPost(p).substring(0, 180)
    const likes = getLikes(p)
    const comentarios = getComentarios(p)
    const compartidos = getCompartidos(p)
    const isOferta = esOfertaLaboral(getTextoPost(p))
    const isPromo = esPromocion(getTextoPost(p))
    const url = getPostUrl(p) || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : '')
    const borderLeft = isOferta ? 'border-left:4px solid #DC2626;' : isPromo ? 'border-left:4px solid #7C3AED;' : ''

    return `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:10px;${borderLeft}">
      <tr><td style="padding:16px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="width:32px;height:32px;background-color:${comp.color};color:#fff;font-size:13px;font-weight:900;text-align:center;line-height:32px;border-radius:8px;vertical-align:top;">${comp.initial}</td>
          <td style="padding-left:10px;vertical-align:top;">
            <span style="font-size:13px;font-weight:800;color:#1E293B;">${comp.nombre}</span>
            ${isOferta ? ' &nbsp;<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;background-color:#FEF2F2;color:#DC2626;">OFERTA LABORAL</span>' : ''}
            ${isPromo ? ' &nbsp;<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;background-color:#F5F3FF;color:#7C3AED;">PROMO</span>' : ''}
            <p style="margin:6px 0 0;font-size:12px;color:#64748B;line-height:1.55;">${texto}${texto.length >= 180 ? '...' : ''}</p>
            <p style="margin:8px 0 0;font-size:12px;color:#94A3B8;">
              ${red === 'Instagram' ? `❤️ ${likes} &nbsp; 💬 ${comentarios}` : `👍 ${likes} &nbsp; 💬 ${comentarios} &nbsp; 🔁 ${compartidos}`}
              ${url ? ` &nbsp; <a href="${url}" style="color:#6C31D9;font-weight:600;text-decoration:none;">Ver post →</a>` : ''}
            </p>
          </td>
        </tr></table>
      </td></tr>
    </table>`
  }

  // ── Datos por competidor separados por red ──
  const igByComp = {}
  const liByComp = {}
  COMPETIDORES.forEach(c => {
    igByComp[c.nombre] = { posts: 0, likes: 0, comentarios: 0 }
    liByComp[c.nombre] = { posts: 0, likes: 0, comentarios: 0, compartidos: 0 }
  })
  postsIG.forEach(p => {
    const handle = p.ownerUsername?.toLowerCase()
    const comp = COMPETIDORES.find(c => c.instagram?.toLowerCase() === handle)
    if (comp && igByComp[comp.nombre]) {
      igByComp[comp.nombre].posts++
      igByComp[comp.nombre].likes += getLikes(p) || 0
      igByComp[comp.nombre].comentarios += getComentarios(p) || 0
    }
  })
  postsLinkedin.forEach(p => {
    const comp = COMPETIDORES.find(c => c.nombre === p._competidor)
    if (comp && liByComp[comp.nombre]) {
      liByComp[comp.nombre].posts++
      liByComp[comp.nombre].likes += getLikes(p) || 0
      liByComp[comp.nombre].comentarios += getComentarios(p) || 0
      liByComp[comp.nombre].compartidos += getCompartidos(p) || 0
    }
  })

  // ── IG table rows ──
  const igRows = COMPETIDORES.map(c => {
    const d = igByComp[c.nombre]
    return `<tr>
      <td style="${TD}font-weight:700;color:#1E293B;">${c.nombre}</td>
      <td style="${TD}text-align:center;">${d.posts}</td>
      <td style="${TD}text-align:center;font-weight:600;">${d.likes}</td>
      <td style="${TD}text-align:center;">${d.comentarios}</td>
      <td style="${TD}text-align:center;"><span style="display:inline-block;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;${d.posts > 0 ? 'background-color:#F0FDF4;color:#166534;' : 'background-color:#F8FAFC;color:#94A3B8;'}">${d.posts > 0 ? 'Activo' : 'Sin posts'}</span></td>
    </tr>`
  }).join('')

  // ── LI table rows ──
  const liRows = COMPETIDORES.map(c => {
    const d = liByComp[c.nombre]
    return `<tr>
      <td style="${TD}font-weight:700;color:#1E293B;">${c.nombre}</td>
      <td style="${TD}text-align:center;">${d.posts}</td>
      <td style="${TD}text-align:center;font-weight:600;">${d.likes}</td>
      <td style="${TD}text-align:center;">${d.comentarios}</td>
      <td style="${TD}text-align:center;">${d.compartidos}</td>
      <td style="${TD}text-align:center;"><span style="display:inline-block;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;${d.posts > 0 ? 'background-color:#EFF6FF;color:#1D4ED8;' : 'background-color:#F8FAFC;color:#94A3B8;'}">${d.posts > 0 ? 'Activo' : 'Sin posts'}</span></td>
    </tr>`
  }).join('')

  // ── Top posts IG (top 3 por likes) ──
  const topIG = [...postsIG]
    .map(p => ({ ...p, _comp: COMPETIDORES.find(c => c.instagram?.toLowerCase() === p.ownerUsername?.toLowerCase()) }))
    .sort((a, b) => (getLikes(b) || 0) - (getLikes(a) || 0))
    .slice(0, 3)

  // ── Top posts LI (top 3 por engagement) ──
  const topLI = [...postsLinkedin]
    .map(p => ({ ...p, _comp: COMPETIDORES.find(c => c.nombre === p._competidor) }))
    .sort((a, b) => ((getLikes(b)||0)+(getComentarios(b)||0)+(getCompartidos(b)||0)) - ((getLikes(a)||0)+(getComentarios(a)||0)+(getCompartidos(a)||0)))
    .slice(0, 3)

  // ── Alertas ──
  let alertRows = ''
  let alertCount = 0

  ofertas.forEach(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const texto = getTextoPost(p).substring(0, 200)
    alertRows += `<tr><td style="padding:8px 0;vertical-align:top;width:100px;"><span style="display:inline-block;padding:4px 10px;background-color:#4A1515;color:#FCA5A5;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">🚨 URGENTE</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#CBD5E1;line-height:1.55;"><strong style="color:#F8FAFC;">${comp}</strong> publicó oferta laboral: "${texto}..."</td></tr>`
    alertCount++
  })

  promos.forEach(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const texto = getTextoPost(p).substring(0, 200)
    alertRows += `<tr><td style="padding:8px 0;vertical-align:top;width:100px;"><span style="display:inline-block;padding:4px 10px;background-color:#3D2B08;color:#FCD34D;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">⚠ ATENCIÓN</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#CBD5E1;line-height:1.55;"><strong style="color:#F8FAFC;">${comp}</strong> lanzó promoción: "${texto}..."</td></tr>`
    alertCount++
  })

  const sinActividad = COMPETIDORES.filter(c => igByComp[c.nombre].posts === 0 && liByComp[c.nombre].posts === 0)
  if (sinActividad.length > 0) {
    alertRows += `<tr><td style="padding:8px 0;vertical-align:top;width:100px;"><span style="display:inline-block;padding:4px 10px;background-color:#0A2E1F;color:#6EE7B7;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">✓ OK</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#CBD5E1;line-height:1.55;"><strong style="color:#F8FAFC;">${sinActividad.map(c => c.nombre).join(', ')}</strong> sin actividad en ninguna red (72h).</td></tr>`
  }

  if (!alertRows) {
    alertRows = `<tr><td style="padding:8px 0;vertical-align:top;width:100px;"><span style="display:inline-block;padding:4px 10px;background-color:#0A2E1F;color:#6EE7B7;font-size:10px;font-weight:800;letter-spacing:0.5px;border-radius:6px;">✓ OK</span></td><td style="padding:8px 0 8px 14px;font-size:13px;color:#CBD5E1;line-height:1.55;">Sin alertas relevantes. Todos los competidores con actividad normal.</td></tr>`
  }

  // ── Ofertas laborales detalladas (al final del reporte) ──
  const ofertasRows = ofertas.map(p => {
    const comp = p._comp?.nombre || p._competidor || 'Competidor'
    const red = p._red || 'LinkedIn'
    const texto = getTextoPost(p).substring(0, 300)
    const url = getPostUrl(p) || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : '')
    return `<tr>
      <td style="${TD}font-weight:700;color:#1E293B;">${comp}</td>
      <td style="${TD}"><span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;${red === 'Instagram' ? 'background-color:#FDF2F8;color:#BE185D;' : 'background-color:#EFF6FF;color:#1D4ED8;'}">${red}</span></td>
      <td style="${TD}color:#475569;line-height:1.5;">${texto}${texto.length >= 300 ? '...' : ''} ${url ? `<a href="${url}" style="color:#6C31D9;font-weight:600;text-decoration:none;">Ver →</a>` : ''}</td>
    </tr>`
  }).join('')

  // ── Chips competidores ──
  const chipsHtml = COMPETIDORES.map(c =>
    `<span style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;background-color:#F8FAFC;border:1px solid #E2E8F0;color:#475569;margin:0 3px 3px 0;">${c.nombre}</span>`
  ).join('')

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
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#1E293B;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- TOP STRIPE -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#6C31D9;"><tr><td style="height:4px;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>

<!-- HEADER -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-bottom:2px solid #E2E8F0;">
  <tr><td style="padding:0 20px;">
    <table cellpadding="0" cellspacing="0" border="0" style="max-width:${W}px;width:100%;margin:0 auto;">
      <tr>
        <td style="padding:14px 0;vertical-align:middle;">
          ${LOGO_SRC ? `<img src="${LOGO_SRC}" alt="M&P" width="100" style="display:inline-block;height:auto;max-height:36px;vertical-align:middle;">` : '<span style="font-size:16px;font-weight:900;color:#6C31D9;">M&amp;P</span>'}
          <span style="display:inline-block;width:1px;height:22px;background-color:#E2E8F0;vertical-align:middle;margin:0 12px;"></span>
          <span style="font-size:10px;font-weight:600;color:#94A3B8;letter-spacing:0.5px;text-transform:uppercase;vertical-align:middle;">Inteligencia Competitiva</span>
        </td>
        <td style="padding:14px 0;text-align:right;vertical-align:middle;">
          <span style="font-size:11px;color:#94A3B8;">${fecha} · ${hora}</span><br>
          <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#3730A3;background-color:#EEF2FF;border:1px solid #C7D2FE;margin-top:4px;">Genera Chile</span>
          <span style="display:inline-block;padding:3px 8px;border-radius:20px;font-size:9px;font-weight:700;color:#065F46;background-color:#ECFDF5;border:1px solid #A7F3D0;margin-left:4px;">● LIVE</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>

<!-- HERO -->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-bottom:1px solid #E2E8F0;">
  <tr><td style="padding:24px 20px;">
    <table cellpadding="0" cellspacing="0" border="0" style="max-width:${W}px;width:100%;margin:0 auto;">
      <tr>
        <td style="vertical-align:bottom;">
          <span style="font-size:22px;font-weight:900;color:#1E293B;">Radar de Competencia</span><br>
          <span style="font-size:22px;font-weight:900;color:#6C31D9;">Software RRHH &amp; Nóminas</span><br>
          <span style="font-size:12px;color:#94A3B8;margin-top:4px;">Instagram · LinkedIn · Ofertas laborales · Actualización diaria</span>
        </td>
        <td style="vertical-align:bottom;text-align:right;">${chipsHtml}</td>
      </tr>
    </table>
  </td></tr>
</table>

<!-- BODY -->
<table cellpadding="0" cellspacing="0" border="0" style="max-width:${W}px;width:100%;margin:0 auto;">

  <!-- KPIs -->
  <tr><td style="padding:24px 20px 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width:25%;padding-right:6px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:8px;border-top:3px solid #6C31D9;">
            <tr><td style="padding:16px 14px;">
              <span style="font-size:28px;font-weight:900;color:#6C31D9;">${postsIG.length}</span><br>
              <span style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;">Posts IG</span>
            </td></tr>
          </table>
        </td>
        <td style="width:25%;padding:0 3px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:8px;border-top:3px solid #2563EB;">
            <tr><td style="padding:16px 14px;">
              <span style="font-size:28px;font-weight:900;color:#2563EB;">${postsLinkedin.length}</span><br>
              <span style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;">Posts LinkedIn</span>
            </td></tr>
          </table>
        </td>
        <td style="width:25%;padding:0 3px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:8px;border-top:3px solid ${totalOfertas > 0 ? '#DC2626' : '#10B981'};">
            <tr><td style="padding:16px 14px;">
              <span style="font-size:28px;font-weight:900;color:${totalOfertas > 0 ? '#DC2626' : '#1E293B'};">${totalOfertas}</span><br>
              <span style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;">Ofertas lab.</span>
            </td></tr>
          </table>
        </td>
        <td style="width:25%;padding-left:6px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:8px;border-top:3px solid ${totalPromos > 0 ? '#D97706' : '#10B981'};">
            <tr><td style="padding:16px 14px;">
              <span style="font-size:28px;font-weight:900;color:#1E293B;">${totalPromos}</span><br>
              <span style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;">Promos</span>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ALERTAS -->
  <tr><td style="padding:24px 20px 0;">
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0F172A;border-radius:10px;">
      <tr><td style="padding:22px 24px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-size:11px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:1px;padding-bottom:14px;">⚡ Alertas ejecutivas · ${fecha}</td>
            ${alertCount > 0 ? `<td style="text-align:right;padding-bottom:14px;"><span style="display:inline-block;padding:3px 10px;border-radius:20px;background-color:#4A1515;color:#FCA5A5;font-size:10px;font-weight:700;">${alertCount} alerta${alertCount > 1 ? 's' : ''}</span></td>` : ''}
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">${alertRows}</table>
      </td></tr>
    </table>
  </td></tr>

  <!-- ═══════ INSTAGRAM ═══════ -->
  <tr><td style="padding:0 20px;">
    ${sectionTitle('📸', 'Instagram — Resumen por competidor', '#E91E8C').replace('<tr><td', '<tr><td')}
  </td></tr>
  <tr><td style="padding:0 20px;">
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:10px;">
      <tr>
        <th style="${TH}text-align:left;">Empresa</th>
        <th style="${TH}text-align:center;">Posts</th>
        <th style="${TH}text-align:center;">❤️ Me gusta</th>
        <th style="${TH}text-align:center;">💬 Comentarios</th>
        <th style="${TH}text-align:center;">Estado</th>
      </tr>
      ${igRows}
    </table>
  </td></tr>

  ${topIG.length > 0 ? `
  <tr><td style="padding:14px 20px 0;">
    <span style="font-size:11px;font-weight:700;color:#E91E8C;text-transform:uppercase;letter-spacing:0.5px;">🔥 Posts calientes Instagram</span>
  </td></tr>
  <tr><td style="padding:8px 20px 0;">
    ${topIG.map(p => postCard(p, 'Instagram')).join('')}
  </td></tr>` : ''}

  <!-- ═══════ LINKEDIN ═══════ -->
  <tr><td style="padding:0 20px;">
    ${sectionTitle('💼', 'LinkedIn — Resumen por competidor', '#2563EB').replace('<tr><td', '<tr><td')}
  </td></tr>
  <tr><td style="padding:0 20px;">
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #E2E8F0;border-radius:10px;">
      <tr>
        <th style="${TH}text-align:left;">Empresa</th>
        <th style="${TH}text-align:center;">Posts</th>
        <th style="${TH}text-align:center;">👍 Reacciones</th>
        <th style="${TH}text-align:center;">💬 Comentarios</th>
        <th style="${TH}text-align:center;">🔁 Compartidos</th>
        <th style="${TH}text-align:center;">Estado</th>
      </tr>
      ${liRows}
    </table>
  </td></tr>

  ${topLI.length > 0 ? `
  <tr><td style="padding:14px 20px 0;">
    <span style="font-size:11px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:0.5px;">🔥 Posts calientes LinkedIn</span>
  </td></tr>
  <tr><td style="padding:8px 20px 0;">
    ${topLI.map(p => postCard(p, 'LinkedIn')).join('')}
  </td></tr>` : `
  <tr><td style="padding:10px 20px 0;">
    <span style="font-size:12px;color:#94A3B8;font-style:italic;">Sin posts de LinkedIn en las últimas 72h.</span>
  </td></tr>`}

  <!-- ═══════ OFERTAS LABORALES ═══════ -->
  ${totalOfertas > 0 ? `
  <tr><td style="padding:0 20px;">
    ${sectionTitle('🚨', 'Ofertas laborales detectadas (' + totalOfertas + ')', '#DC2626').replace('<tr><td', '<tr><td')}
  </td></tr>
  <tr><td style="padding:0 20px;">
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#fff;border:1px solid #FEE2E2;border-radius:10px;border-top:3px solid #DC2626;">
      <tr>
        <th style="${TH}text-align:left;width:100px;">Empresa</th>
        <th style="${TH}text-align:left;width:70px;">Red</th>
        <th style="${TH}text-align:left;">Contenido</th>
      </tr>
      ${ofertasRows}
    </table>
  </td></tr>` : ''}

</table>

<!-- FOOTER -->
<table cellpadding="0" cellspacing="0" border="0" style="max-width:${W}px;width:100%;margin:32px auto 0;">
  <tr><td style="border-top:2px solid #E2E8F0;padding:18px 20px 40px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="vertical-align:middle;">
          ${LOGO_SRC ? `<img src="${LOGO_SRC}" alt="M&P" width="80" style="display:inline-block;height:auto;max-height:26px;vertical-align:middle;">` : '<span style="font-weight:900;color:#6C31D9;">M&amp;P</span>'}
          <span style="font-size:11px;font-weight:600;color:#94A3B8;vertical-align:middle;margin-left:8px;">Muller &amp; Pérez · Inteligencia Competitiva</span>
        </td>
        <td style="text-align:right;font-size:10px;color:#94A3B8;line-height:1.7;">
          Confidencial · Genera Chile<br>${fecha} · ${hora}
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
