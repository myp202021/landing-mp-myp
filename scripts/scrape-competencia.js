// scrape-competencia.js
// Corre todos los días L-V a las 08:50 AM via GitHub Actions
// Scrape Instagram + LinkedIn + Facebook de competidores de Buses Hualpén
// Detecta ofertas laborales y envía reporte como PDF adjunto

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
const { execSync } = require('child_process')
const fs = require('fs')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const COMPETIDORES = [
  { nombre: 'Viggo',                instagram: 'viggo_chile',         linkedin: 'https://www.linkedin.com/company/viggo-chile/',       facebook: 'https://www.facebook.com/ViggoChile/',                                       web: 'viggo.cl' },
  { nombre: 'Tándem Industrial',    instagram: 'tandem.industrial',   linkedin: 'https://www.linkedin.com/company/tandem-industrial/', facebook: 'https://www.facebook.com/tandemindustrial.cl',                               web: 'tandemindustrial.cl' },
  { nombre: 'Yanguas',              instagram: 'yanguas.cl',          linkedin: 'https://www.linkedin.com/company/buses-yanguas/',     facebook: null,                                                                         web: 'yanguas.cl' },
  { nombre: 'Buses JM',             instagram: 'busesjm.cl',          linkedin: 'https://www.linkedin.com/company/buses-jm-empresas/', facebook: 'https://www.facebook.com/BusesjmEmpresas/',                                  web: 'busesjm.cl' },
  { nombre: 'CVU',                  instagram: 'transportescvu_ssee', linkedin: 'https://www.linkedin.com/company/transportes-cvu/',  facebook: null,                                                                         web: 'transportescvu.cl' },
  { nombre: 'Nortrans',             instagram: 'nortransspa',         linkedin: 'https://www.linkedin.com/company/sociedad-de-transportes-nortrans-ltda/', facebook: 'https://www.facebook.com/sociedaddetransportesnortransLtda',                 web: 'nortrans.cl' },
  { nombre: 'Géminis',              instagram: 'busesgeminis',        linkedin: 'https://www.linkedin.com/company/geminis/',          facebook: 'https://www.facebook.com/Buses-G%C3%A9minis-210346879150954/',              web: 'geminis.cl' },
  { nombre: 'Verschae',             instagram: 'flota_verschae',      linkedin: 'https://www.linkedin.com/company/flota-verschae/',   facebook: 'https://www.facebook.com/profile.php?id=100063564674214',                   web: 'verschae.cl' },
  { nombre: 'Transportes Calderón', instagram: null,                   linkedin: null,                                                 facebook: null,                                                                         web: 'transportescalderon.cl' },
  { nombre: 'Pullman Yuris',        instagram: 'busesyuris',          linkedin: null,                                                 facebook: 'https://www.facebook.com/busesyuris',                                        web: 'pullmanyuris.cl' },
  { nombre: 'Sokol',                instagram: null,                  linkedin: 'https://www.linkedin.com/company/sokol-s-a/',        facebook: null,                                                                         web: 'gruposokol.com' },
  { nombre: 'Pullman San Luis',     instagram: 'pullmansanluis',      linkedin: 'https://www.linkedin.com/company/pullman-san-luis-spa/', facebook: null,                                                                      web: 'pullmansanluis.cl' },
]

// ─── Detección de ofertas laborales ─────────────────────────────────────────
const KEYWORDS_OFERTA = [
  // Señales genéricas de publicación de empleo
  'se busca', 'buscamos', 'oferta laboral', 'postula', 'postúlate', 'vacante',
  'cargo disponible', 'remuneración', 'jornada', 'contrato', 'enviar cv', 'envía tu cv',
  'trabaja con nosotros', 'únete a', 'únete al equipo', 'incorporar', 'requisitos',
  'experiencia comprobable', 'disponibilidad', 'join our team', 'we are hiring', 'hiring',
  'open position', 'apply now',
  // Cargos operativos — transporte y logística
  'conductor', 'chofer', 'chofer profesional', 'conductor profesional',
  'mecánico', 'mecánico diésel', 'mecánico automotriz', 'técnico mecánico',
  'técnico', 'técnico de mantenimiento', 'técnico electromecánico',
  'operador', 'operador de flota', 'operador de bus',
  'electricista', 'soldador', 'vulcanizador', 'pintor automotriz',
  'auxiliar de mantención', 'ayudante mecánico', 'lavador',
  // Cargos administrativos
  'administrativo', 'asistente administrativo', 'secretaria', 'recepcionista',
  'asistente de rrhh', 'asistente recursos humanos', 'analista de personal',
  'encargado de remuneraciones', 'analista de remuneraciones',
  'asistente contable', 'contador', 'analista contable',
  'ejecutivo de ventas', 'ejecutivo comercial', 'asesor comercial',
  'analista de operaciones', 'coordinador de operaciones', 'planificador de rutas',
  'despachador', 'inspector de flota', 'supervisor de tráfico',
  // Cargos medios
  'jefe de taller', 'jefe de mantenimiento', 'jefe de operaciones',
  'jefe de flota', 'jefe de rrhh', 'jefe de recursos humanos',
  'jefe de administración', 'jefe comercial', 'jefe de ventas',
  'coordinador', 'supervisor', 'encargado',
  'prevencionista de riesgos', 'encargado de seguridad', 'hseq',
  // Cargos altos / gerencia
  'gerente', 'gerente de operaciones', 'gerente general', 'gerente comercial',
  'gerente de administración', 'gerente de finanzas',
  'director', 'subgerente', 'jefe de área',
  // Profesionales / soporte
  'ingeniero', 'ingeniero de mantenimiento', 'ingeniero de transporte',
  'analista de datos', 'encargado de tecnología', 'soporte ti',
  'community manager', 'diseñador', 'marketing',
  'abogado', 'asesor legal',
]

function esOfertaLaboral(texto) {
  if (!texto) return false
  const lower = texto.toLowerCase()
  return KEYWORDS_OFERTA.some(kw => lower.includes(kw))
}


// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  // Ventana de 48h: tolera reportes que corren tarde y captura todo el día anterior + el actual
  const hace24h = new Date(Date.now() - 48 * 60 * 60 * 1000)

  console.log(`📅 Generando reporte para ${hoy}...`)

  await supabase.from('reportes_competencia').delete().eq('fecha_reporte', hoy)

  // ── Instagram Posts ──────────────────────────────────────────────────────
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
    console.log(`   IG total recibidos: ${all.length}`)
    if (all.length > 0) {
      const sample = all[0]
      console.log(`   IG sample: owner=${sample.ownerUsername} timestamp=${sample.timestamp} type=${sample.type}`)
      const ts = all.map(p => p.timestamp).filter(Boolean).sort().reverse().slice(0, 3)
      console.log(`   IG timestamps recientes: ${ts.join(' | ')}`)
    }
    postsIG = all.filter(p => p.timestamp && new Date(p.timestamp) > hace24h)
    console.log(`✅ Instagram: ${postsIG.length} posts en las últimas 48h (de ${all.length} total)`)
  } catch (err) {
    console.error('❌ Error Instagram:', err.message)
  }

  // ── Instagram Stories ────────────────────────────────────────────────────
  let storiesIG = []
  try {
    const igUsernames = conIG.map(c => c.instagram)
    console.log(`📱 Scrapeando Stories de ${igUsernames.length} cuentas...`)
    const stRes = await fetch(
      `https://api.apify.com/v2/acts/louisdeconinck~instagram-story-details-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=120`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviar múltiples formatos para que el actor use el que reconozca
        body: JSON.stringify({
          usernames: igUsernames,
          directUrls: igUsernames.map(u => `https://www.instagram.com/${u}/`),
        }),
      }
    )
    if (!stRes.ok) throw new Error(`Apify Stories: ${stRes.status} ${await stRes.text()}`)
    const allStories = await stRes.json()
    console.log(`   Stories raw recibidas: ${allStories.length}`)
    if (allStories.length > 0) {
      const s0 = allStories[0]
      console.log(`   Stories sample keys: ${Object.keys(s0).join(', ')}`)
      console.log(`   Stories sample: ${JSON.stringify(s0).substring(0, 400)}`)
    }
    storiesIG = allStories.map(s => {
      const username = s.user?.username || ''
      const comp = conIG.find(c => c.instagram?.toLowerCase() === username.toLowerCase())
      return {
        competidor: comp?.nombre || username,
        handle: username,
        type: s.media_type === 2 || s.is_reel_media ? 'Video' : 'Imagen',
        timestamp: s.taken_at ? new Date(s.taken_at * 1000) : null,
        imageUrl: s.image_versions2?.candidates?.[0]?.url || '',
        videoUrl: s.video_versions?.[0]?.url || '',
        pk: s.pk || s.id || '',
      }
    })
    console.log(`✅ Stories: ${storiesIG.length} stories activas`)
  } catch (err) {
    console.error('❌ Error Stories:', err.message)
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
  await enviarEmail({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook, storiesIG })
}

// ─── Generación de PDF con wkhtmltopdf ──────────────────────────────────────
function generarPDF(html) {
  try {
    const tmpHtml = '/tmp/reporte-hualpen.html'
    const tmpPdf  = '/tmp/reporte-hualpen.pdf'
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

// ─── Scraping LinkedIn ───────────────────────────────────────────────────────
async function scrapeLinkedin(hace24h) {
  const conLI = COMPETIDORES.filter(c => c.linkedin)
  if (conLI.length === 0) return []
  console.log(`💼 Scrapeando ${conLI.length} perfiles de LinkedIn...`)
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrls: conLI.map(c => c.linkedin), maxPosts: 5 }),
      }
    )
    if (!res.ok) { console.warn(`⚠️ LinkedIn: ${res.status}`); return [] }
    const all = await res.json()
    console.log(`   LinkedIn total posts recibidos: ${all.length}`)
    if (all.length > 0) {
      const sample = all[0]
      console.log(`   LinkedIn sample fields: ${Object.keys(sample).join(', ')}`)
      // Loggear los postedAt reales de los primeros 5 posts
      all.slice(0, 5).forEach((p, i) => {
        console.log(`   LI[${i}] postedAt=${JSON.stringify(p.postedAt)} postedAtTimestamp=${p.postedAtTimestamp} timeSincePosted=${p.timeSincePosted} author=${p.author?.name || p.author?.universalName || ''}`)
      })
    }
    const recientes = all.filter(p => {
      // Intentar varios campos de fecha
      const candidatos = [
        p.postedAtTimestamp, p.postedAt?.timestamp, p.postedAt,
        p.posted_at, p.publishedAt, p.date, p.timestamp
      ].filter(Boolean)

      for (const cand of candidatos) {
        let fechaDate
        if (typeof cand === 'number') {
          fechaDate = cand > 1e12 ? new Date(cand) : new Date(cand * 1000)
        } else if (typeof cand === 'string') {
          fechaDate = new Date(cand)
        } else if (typeof cand === 'object' && cand !== null) {
          continue
        }
        if (fechaDate && !isNaN(fechaDate.getTime())) {
          if (fechaDate > hace24h) return true
          return false
        }
      }
      // Fallback: parsear timeSincePosted ("3d", "1w", "2h", etc.)
      if (p.timeSincePosted) {
        const tsp = p.timeSincePosted.trim().toLowerCase()
        const num = parseInt(tsp)
        if (!isNaN(num)) {
          if (tsp.includes('h') && num <= 48) return true
          if (tsp.includes('d') && num <= 2) return true
          if (tsp.includes('m') && !tsp.includes('mo')) return true
        }
      }
      return false
    })
    console.log(`✅ LinkedIn: ${recientes.length} posts en últimas 48h (de ${all.length} total)`)
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
    console.log(`   FB total recibidos: ${all.length}`)
    if (all.length > 0) {
      console.log(`   FB sample keys: ${Object.keys(all[0]).join(', ')}`)
      all.slice(0, 3).forEach((p, i) => console.log(`   FB[${i}] time=${p.time} timestamp=${p.timestamp} pageName=${p.pageName}`))
    }
    const recientes = all.filter(p => {
      const t = p.time || p.timestamp || p.publishedAt
      if (!t) return false
      const d = typeof t === 'number' ? (t > 1e12 ? new Date(t) : new Date(t * 1000)) : new Date(t)
      return !isNaN(d.getTime()) && d > hace24h
    })
    console.log(`✅ Facebook: ${recientes.length} posts en últimas 48h (de ${all.length} total)`)
    return recientes
  } catch (err) {
    console.warn('⚠️ Error Facebook (se omite):', err.message)
    return []
  }
}

// ─── HTML del reporte (usado tanto en PDF como fallback del email) ────────────
function generarHtmlReporte({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook, storiesIG }) {
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
          <a href="${postUrl}" style="display:inline-block;font-size:11px;color:#fff;background:#3B82F6;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none;">Ver post →</a>
        </div>
      </div>`
  }).join('')

  // Stories HTML
  const storiesHtml = (storiesIG || []).length > 0 ? (storiesIG || []).map(s => {
    const hora = s.timestamp ? s.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : ''
    const thumb = s.imageUrl
      ? `<img src="${s.imageUrl}" alt="story" style="width:72px;height:72px;border-radius:8px;object-fit:cover;flex-shrink:0;">`
      : `<div style="width:72px;height:72px;border-radius:8px;background:linear-gradient(135deg,#833AB4,#E1306C,#F77737);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;color:#fff;">📱</div>`
    return `
      <div style="display:flex;gap:12px;border:1px solid #E1306C;border-radius:10px;padding:12px;margin-bottom:10px;background:#FFF5F7;">
        ${thumb}
        <div style="flex:1;min-width:0;">
          <div style="margin-bottom:5px;">
            <strong style="color:#0F172A;font-size:13px;">${s.competidor}</strong>
            <span style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:5px;">Story ${s.type}</span>
            ${hora ? `<span style="color:#94A3B8;font-size:11px;margin-left:5px;">${hora}</span>` : ''}
          </div>
          <p style="font-size:12px;color:#475569;line-height:1.5;margin:0 0 6px;">@${s.handle} subió una story (${s.type.toLowerCase()})</p>
          ${s.videoUrl ? `<a href="${s.videoUrl}" style="display:inline-block;font-size:11px;color:#fff;background:#E1306C;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none;">Ver video →</a>` : ''}
          ${!s.videoUrl && s.imageUrl ? `<a href="${s.imageUrl}" style="display:inline-block;font-size:11px;color:#fff;background:#E1306C;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none;">Ver imagen →</a>` : ''}
        </div>
      </div>`
  }).join('') : ''

  const postsLIHtml = postsLinkedin.map(p => {
    const url = p.postUrl || p.url || p.postLink || ''
    const nombre = p.companyName || p.authorName || p.author || 'Competidor'
    const texto = (p.text || p.commentary || p.content || '').substring(0, 200)
    const likes = p.likesCount || p.totalReactionCount || p.reactions || 0
    return `
      <div style="border:1px solid #E2E8F0;border-radius:10px;padding:12px;margin-bottom:10px;background:#fff;">
        <div style="margin-bottom:5px;">
          <strong style="color:#0F172A;font-size:13px;">${nombre}</strong>
          <span style="background:#DBEAFE;color:#1E40AF;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:5px;">💼 LinkedIn</span>
          ${ofertaBadge(p.text || p.commentary || p.content)}
        </div>
        <p style="font-size:12px;color:#475569;line-height:1.5;margin:0 0 6px;">${texto}${texto.length >= 200 ? '...' : ''}</p>
        ${likes ? `<span style="font-size:11px;color:#64748B;margin-right:10px;">👍 ${likes}</span>` : ''}
        ${url ? `<a href="${url}" style="display:inline-block;font-size:11px;color:#fff;background:#3B82F6;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none;">Ver post →</a>` : ''}
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
        ${url ? `<a href="${url}" style="display:inline-block;font-size:11px;color:#fff;background:#3B82F6;padding:4px 12px;border-radius:6px;font-weight:600;text-decoration:none;">Ver post →</a>` : ''}
      </div>`
  }).join('')

  const sinActividadHtml = sinActividad.map(c =>
    `<span style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:4px 12px;font-size:11px;color:#94A3B8;display:inline-block;margin:3px;">${c.nombre}</span>`
  ).join('')

  const totalPosts = postsIG.length + postsLinkedin.length + postsFacebook.length
  const totalOfertas = [...postsIG, ...postsLinkedin, ...postsFacebook]
    .filter(p => esOfertaLaboral(p.caption || p.text || p.commentary || p.content || p.message || '')).length

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

      <!-- Stories -->
      ${(storiesIG || []).length > 0 ? `
      <div style="margin-top:20px;border-top:1px solid #E2E8F0;padding-top:18px;">
        <div style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:6px;display:inline-block;margin-bottom:14px;">
          📱 Stories Instagram — ${storiesIG.length} activa${storiesIG.length > 1 ? 's' : ''}
        </div>
        ${storiesHtml}
      </div>
      ` : ''}

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
async function enviarEmail({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook, storiesIG }) {
  const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no definida — email no enviado.')
    return
  }

  const reporteHtml = generarHtmlReporte({ hoy, postsIG, competidoresConPost, sinActividad, postsLinkedin, postsFacebook, storiesIG })
  const fecha = new Date(hoy + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const totalPosts = postsIG.length + postsLinkedin.length + postsFacebook.length
  const totalOfertas = [...postsIG, ...postsLinkedin, ...postsFacebook]
    .filter(p => esOfertaLaboral(p.caption || p.text || p.commentary || p.content || p.message || '')).length

  const payload = {
    from: 'Muller y Perez <contacto@mulleryperez.cl>',
    to: ['contacto@mulleryperez.cl'],
    subject: `🚌 Competencia Hualpén — ${fecha}${totalOfertas > 0 ? ` · ⚠️ ${totalOfertas} oferta${totalOfertas > 1 ? 's' : ''} laboral${totalOfertas > 1 ? 'es' : ''}` : ''} (${totalPosts} posts)`,
    html: `<div style="font-family:'Segoe UI',sans-serif;max-width:500px;margin:0 auto;padding:32px 16px;color:#1E293B;">
    <h2 style="font-size:18px;font-weight:800;margin:0 0 8px;">🚌 Reporte Diario — Competencia Hualpén</h2>
    <p style="color:#64748B;font-size:13px;margin:0 0 20px;">${fecha}</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts Instagram</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsIG.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Stories Instagram</td><td style="padding:8px 0;font-weight:700;text-align:right;">${storiesIG.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts LinkedIn</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsLinkedin.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Posts Facebook</td><td style="padding:8px 0;font-weight:700;text-align:right;">${postsFacebook.length}</td></tr>
      <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:8px 0;color:#64748B;">Sin actividad</td><td style="padding:8px 0;font-weight:700;text-align:right;">${sinActividad.length}</td></tr>
      ${totalOfertas > 0 ? `<tr><td style="padding:8px 0;color:#92400E;font-weight:700;">⚠️ Ofertas laborales detectadas</td><td style="padding:8px 0;font-weight:700;color:#92400E;text-align:right;">${totalOfertas}</td></tr>` : ''}
    </table>
    <p style="font-size:12px;color:#94A3B8;">El reporte completo se adjunta en PDF.</p>
  </div>`,
  }

  // Generar PDF y adjuntar
  const pdfBuffer = generarPDF(reporteHtml)
  if (pdfBuffer) {
    payload.attachments = [{ filename: `Competencia-Hualpen-${hoy}.pdf`, content: pdfBuffer.toString('base64') }]
    console.log(`📎 Email con PDF adjunto`)
  } else {
    // Fallback: HTML adjunto si wkhtmltopdf no está disponible
    payload.attachments = [{ filename: `Competencia-Hualpen-${hoy}.html`, content: Buffer.from(reporteHtml).toString('base64') }]
    console.log(`📄 Email con HTML adjunto (fallback)`)
  }

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
