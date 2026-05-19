/**
 * AUDIT SEO + GEO — Checks SEO Tecnico + Contenido On-Page
 * Funciones puras: reciben HTML/datos, retornan resultado estandarizado.
 *
 * CommonJS — Node 18+ con fetch nativo
 */

const { THRESHOLDS } = require('./audit-seo-geo-config')

// ===========================================================================
// Helpers internos
// ===========================================================================

function extractMeta(html, name) {
  const r1 = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')
  const m1 = html.match(r1)
  if (m1) return m1[1]
  const r2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i')
  const m2 = html.match(r2)
  return m2 ? m2[1] : null
}

function extractProperty(html, prop) {
  const r1 = new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')
  const m1 = html.match(r1)
  if (m1) return m1[1]
  const r2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${prop}["'][^>]*>`, 'i')
  const m2 = html.match(r2)
  return m2 ? m2[1] : null
}

function extractHeadings(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'gis')
  const results = []
  let m
  while ((m = regex.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]*>/g, '').trim()
    if (text.length > 0) results.push(text)
  }
  return results
}

function extractJsonLd(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const schemas = []
  let m
  while ((m = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1])
      schemas.push(parsed)
    } catch { /* skip invalid */ }
  }
  return schemas
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function result(name, score, maxScore, status, value, detail, recommendation) {
  return { name, score, maxScore, status, value, detail, recommendation }
}

// ===========================================================================
// SEO TECNICO
// ===========================================================================

/**
 * Verifica que HTTP redirige a HTTPS
 */
async function checkHTTPS(url) {
  const name = 'HTTPS'
  const maxScore = 10
  try {
    const httpUrl = url.replace(/^https:/, 'http:')
    const res = await fetch(httpUrl, { redirect: 'manual' })
    const location = res.headers.get('location') || ''
    if (location.startsWith('https://')) {
      return result(name, maxScore, maxScore, 'ok', location, 'HTTP redirige correctamente a HTTPS.', null)
    }
    if (url.startsWith('https://')) {
      return result(name, maxScore / 2, maxScore, 'warn', res.status, 'El sitio usa HTTPS pero HTTP no redirige automaticamente.', 'Configura un redirect 301 de HTTP a HTTPS.')
    }
    return result(name, 0, maxScore, 'error', res.status, 'El sitio no usa HTTPS.', 'Instala un certificado SSL y redirige todo el trafico a HTTPS.')
  } catch (err) {
    return result(name, 0, maxScore, 'error', err.message, 'No se pudo verificar HTTPS.', 'Verifica que el dominio responda en HTTP y HTTPS.')
  }
}

/**
 * Fetch /robots.txt — parsea User-agent/Disallow, verifica que no bloquea /
 */
async function checkRobotsTxt(url) {
  const name = 'Robots.txt'
  const maxScore = 10
  try {
    const origin = new URL(url).origin
    const res = await fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': 'M&P-SEO-Audit/1.0' } })
    if (!res.ok) {
      return result(name, 5, maxScore, 'warn', res.status, 'No se encontro robots.txt.', 'Crea un archivo robots.txt en la raiz del sitio.')
    }
    const text = await res.text()
    const lines = text.split('\n').map(l => l.trim())
    const blocksRoot = lines.some(l => {
      const lower = l.toLowerCase()
      return lower.startsWith('disallow') && /disallow:\s*\/\s*$/.test(lower)
    })
    const hasSitemapRef = lines.some(l => l.toLowerCase().startsWith('sitemap:'))
    if (blocksRoot) {
      return result(name, 0, maxScore, 'error', 'Disallow: /', 'robots.txt bloquea la raiz del sitio.', 'Elimina "Disallow: /" para permitir indexacion.')
    }
    const detail = hasSitemapRef
      ? 'robots.txt presente y referencia al sitemap.'
      : 'robots.txt presente pero no referencia al sitemap.'
    const score = hasSitemapRef ? maxScore : maxScore - 2
    return result(name, score, maxScore, hasSitemapRef ? 'ok' : 'warn', text.substring(0, 200), detail, hasSitemapRef ? null : 'Agrega "Sitemap: https://tudominio.com/sitemap.xml" al robots.txt.')
  } catch (err) {
    return result(name, 0, maxScore, 'error', err.message, 'Error al verificar robots.txt.', 'Verifica que el archivo sea accesible.')
  }
}

/**
 * Fetch /sitemap.xml, contar URLs, verificar HTTPS, sample 10 URLs
 */
async function checkSitemap(url) {
  const name = 'Sitemap XML'
  const maxScore = 10
  try {
    const origin = new URL(url).origin
    let sitemapUrl = `${origin}/sitemap.xml`
    let res = await fetch(sitemapUrl, { headers: { 'User-Agent': 'M&P-SEO-Audit/1.0' } })
    if (!res.ok) {
      sitemapUrl = `${origin}/sitemap_index.xml`
      res = await fetch(sitemapUrl, { headers: { 'User-Agent': 'M&P-SEO-Audit/1.0' } })
    }
    if (!res.ok) {
      return result(name, 0, maxScore, 'error', res.status, 'No se encontro sitemap.xml ni sitemap_index.xml.', 'Genera un sitemap XML y subelo a la raiz del sitio.')
    }
    const xml = await res.text()
    const locMatches = xml.match(/<loc>([^<]+)<\/loc>/gi) || []
    const urls = locMatches.map(m => m.replace(/<\/?loc>/gi, ''))
    const totalUrls = urls.length
    const httpUrls = urls.filter(u => u.startsWith('http://'))
    const sample = urls.slice(0, 10)

    if (totalUrls === 0) {
      return result(name, 2, maxScore, 'warn', 0, 'Sitemap existe pero no contiene URLs.', 'Agrega las URLs de tu sitio al sitemap.')
    }

    let score = maxScore
    const issues = []
    if (httpUrls.length > 0) {
      score -= 3
      issues.push(`${httpUrls.length} URLs usan HTTP en vez de HTTPS.`)
    }

    return result(name, score, maxScore, score === maxScore ? 'ok' : 'warn', { totalUrls, sample, httpUrls: httpUrls.length }, `Sitemap con ${totalUrls} URLs.${issues.length ? ' ' + issues.join(' ') : ''}`, issues.length ? 'Actualiza todas las URLs del sitemap a HTTPS.' : null)
  } catch (err) {
    return result(name, 0, maxScore, 'error', err.message, 'Error al verificar sitemap.', 'Verifica que el archivo sea accesible.')
  }
}

/**
 * Verifica <link rel="canonical">
 */
function checkCanonical(html) {
  const name = 'Canonical'
  const maxScore = 10
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
  if (match && match[1]) {
    const href = match[1]
    if (href.startsWith('https://')) {
      return result(name, maxScore, maxScore, 'ok', href, 'Canonical definida correctamente con HTTPS.', null)
    }
    return result(name, maxScore / 2, maxScore, 'warn', href, 'Canonical definida pero no usa HTTPS.', 'Actualiza la URL canonical a HTTPS.')
  }
  return result(name, 0, maxScore, 'error', null, 'No se encontro etiqueta canonical.', 'Agrega <link rel="canonical" href="..."> en el <head>.')
}

/**
 * Verifica que no haya noindex en homepage
 */
function checkMetaRobots(html) {
  const name = 'Meta Robots'
  const maxScore = 10
  const robots = extractMeta(html, 'robots') || ''
  const lower = robots.toLowerCase()
  if (lower.includes('noindex')) {
    return result(name, 0, maxScore, 'error', robots, 'La pagina tiene noindex — no aparecera en Google.', 'Elimina "noindex" de la meta robots.')
  }
  if (lower.includes('nofollow')) {
    return result(name, maxScore / 2, maxScore, 'warn', robots, 'La pagina tiene nofollow — los links no pasan autoridad.', 'Revisa si realmente necesitas nofollow.')
  }
  return result(name, maxScore, maxScore, 'ok', robots || 'no definida (default index,follow)', 'La pagina es indexable.', null)
}

/**
 * Parsea JSON-LD, verifica tipos y propiedades requeridas
 */
function checkSchemas(html) {
  const name = 'Schema Markup (JSON-LD)'
  const maxScore = 15
  const schemas = extractJsonLd(html)
  if (schemas.length === 0) {
    return result(name, 0, maxScore, 'error', [], 'No se encontro Schema Markup JSON-LD.', 'Agrega datos estructurados JSON-LD (Organization, LocalBusiness, FAQPage, etc.).')
  }

  const types = []
  const issues = []
  let deductions = 0

  for (const s of schemas) {
    const t = s['@type']
    if (t) types.push(Array.isArray(t) ? t.join(', ') : t)

    // Verificar propiedades requeridas por tipo
    const type = Array.isArray(t) ? t[0] : t
    if (type === 'Organization' || type === 'LocalBusiness' || type === 'ProfessionalService') {
      if (!s.name) { issues.push(`${type} sin "name".`); deductions += 2 }
      if (!s.description) { issues.push(`${type} sin "description".`); deductions += 1 }
      if (!s.url) { issues.push(`${type} sin "url".`); deductions += 1 }
    }
    if (s.aggregateRating) {
      if (!s.aggregateRating.ratingValue) { issues.push('aggregateRating sin ratingValue.'); deductions += 1 }
      if (!s.aggregateRating.ratingCount && !s.aggregateRating.reviewCount) { issues.push('aggregateRating sin ratingCount/reviewCount.'); deductions += 1 }
    }
  }

  const score = Math.max(0, maxScore - deductions)
  const status = issues.length === 0 ? 'ok' : (deductions > 4 ? 'error' : 'warn')
  return result(name, score, maxScore, status, { types: [...new Set(types)], count: schemas.length }, `${schemas.length} schema(s) encontrado(s): ${[...new Set(types)].join(', ')}.${issues.length ? ' Problemas: ' + issues.join(' ') : ''}`, issues.length ? 'Completa las propiedades requeridas de cada schema.' : null)
}

/**
 * Sigue redirects manualmente, reporta cuantos hops
 */
async function checkRedirectChain(url) {
  const name = 'Redirect Chain'
  const maxScore = 5
  try {
    let current = url
    let hops = 0
    const chain = [current]
    const maxHops = 10

    while (hops < maxHops) {
      const res = await fetch(current, { redirect: 'manual' })
      const location = res.headers.get('location')
      if (!location || res.status < 300 || res.status >= 400) break
      hops++
      // Resolve relative redirects
      current = location.startsWith('http') ? location : new URL(location, current).toString()
      chain.push(current)
    }

    if (hops === 0) {
      return result(name, maxScore, maxScore, 'ok', { hops: 0, chain }, 'Sin redirects — acceso directo.', null)
    }
    if (hops <= THRESHOLDS.redirectHopsMax) {
      return result(name, maxScore - 1, maxScore, 'warn', { hops, chain }, `${hops} redirect(s): ${chain.join(' -> ')}`, hops > 1 ? 'Reduce los redirects a 1 como maximo.' : null)
    }
    return result(name, 0, maxScore, 'error', { hops, chain }, `Cadena de ${hops} redirects excesiva.`, 'Reduce los redirects a maximo 1. Los hops extras agregan latencia y diluyen autoridad.')
  } catch (err) {
    return result(name, 0, maxScore, 'error', err.message, 'Error al verificar redirects.', 'Verifica que la URL sea accesible.')
  }
}

/**
 * Verifica HTTP/2 o HTTP/3
 */
async function checkHTTPVersion(url) {
  const name = 'HTTP Version'
  const maxScore = 5
  try {
    const res = await fetch(url, { method: 'HEAD' })
    // Node fetch no expone httpVersion directamente; usamos heuristica
    // Si hay alt-svc header => probablemente HTTP/2 o HTTP/3
    const altSvc = res.headers.get('alt-svc')
    const hasH2 = altSvc && (altSvc.includes('h2') || altSvc.includes('h3'))
    // Verificamos si el server header da pistas
    const server = res.headers.get('server') || ''

    if (hasH2) {
      return result(name, maxScore, maxScore, 'ok', altSvc, 'El servidor soporta HTTP/2 o HTTP/3 (alt-svc detectado).', null)
    }
    // Sin alt-svc no podemos estar 100% seguros, pero la mayoria de CDN/Vercel/Cloudflare usan H2
    return result(name, maxScore - 2, maxScore, 'warn', { altSvc: null, server }, 'No se detecto header alt-svc. Podria usar HTTP/2 igualmente (Node fetch no lo expone).', 'Verifica con curl --http2 o Chrome DevTools que el servidor use HTTP/2+.')
  } catch (err) {
    return result(name, 0, maxScore, 'error', err.message, 'Error al verificar version HTTP.', 'Verifica que la URL sea accesible.')
  }
}

// ===========================================================================
// CONTENIDO Y ON-PAGE
// ===========================================================================

/**
 * Verifica <title> — presente, longitud 50-60
 */
function checkTitle(html) {
  const name = 'Title'
  const maxScore = 10
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = match ? match[1].trim() : null
  if (!title) {
    return result(name, 0, maxScore, 'error', null, 'No se encontro <title>.', 'Agrega un titulo unico y descriptivo de 50-60 caracteres.')
  }
  const len = title.length
  if (len >= THRESHOLDS.title.min && len <= THRESHOLDS.title.max) {
    return result(name, maxScore, maxScore, 'ok', { title, length: len }, `Titulo de ${len} caracteres (optimo 50-60).`, null)
  }
  if (len < THRESHOLDS.title.min) {
    const score = Math.round(maxScore * (len / THRESHOLDS.title.min))
    return result(name, score, maxScore, 'warn', { title, length: len }, `Titulo muy corto: ${len} caracteres.`, `Expande el titulo a minimo ${THRESHOLDS.title.min} caracteres para mejor CTR en SERP.`)
  }
  // Demasiado largo
  return result(name, maxScore - 3, maxScore, 'warn', { title, length: len }, `Titulo largo: ${len} caracteres. Google truncara despues de ~60.`, `Acorta el titulo a maximo ${THRESHOLDS.title.max} caracteres.`)
}

/**
 * Verifica meta description — presente, longitud 150-160
 */
function checkMetaDescription(html) {
  const name = 'Meta Description'
  const maxScore = 10
  const desc = extractMeta(html, 'description')
  if (!desc) {
    return result(name, 0, maxScore, 'error', null, 'No se encontro meta description.', 'Agrega una meta description unica de 150-160 caracteres con call-to-action.')
  }
  const len = desc.length
  if (len >= THRESHOLDS.description.min && len <= THRESHOLDS.description.max) {
    return result(name, maxScore, maxScore, 'ok', { description: desc, length: len }, `Meta description de ${len} caracteres (optimo 150-160).`, null)
  }
  if (len < THRESHOLDS.description.min) {
    const score = Math.max(2, Math.round(maxScore * (len / THRESHOLDS.description.min)))
    return result(name, score, maxScore, 'warn', { description: desc, length: len }, `Meta description corta: ${len} caracteres.`, `Expande a minimo ${THRESHOLDS.description.min} caracteres.`)
  }
  return result(name, maxScore - 3, maxScore, 'warn', { description: desc, length: len }, `Meta description larga: ${len} caracteres. Google truncara.`, `Acorta a maximo ${THRESHOLDS.description.max} caracteres.`)
}

/**
 * Verifica H1 — unico, presente
 */
function checkH1(html) {
  const name = 'H1'
  const maxScore = 10
  const h1s = extractHeadings(html, 'h1')
  if (h1s.length === 0) {
    return result(name, 0, maxScore, 'error', [], 'No se encontro H1.', 'Agrega exactamente un H1 con la keyword principal.')
  }
  if (h1s.length === 1) {
    return result(name, maxScore, maxScore, 'ok', h1s, `H1 unico: "${h1s[0]}".`, null)
  }
  return result(name, maxScore - 4, maxScore, 'warn', h1s, `${h1s.length} H1 encontrados. Debe haber solo 1.`, 'Cambia los H1 extra a H2 o H3.')
}

/**
 * Verifica jerarquia H1->H2->H3 sin saltos
 */
function checkHeadingHierarchy(html) {
  const name = 'Heading Hierarchy'
  const maxScore = 5
  const headingRegex = /<(h[1-6])[^>]*>/gi
  const levels = []
  let m
  while ((m = headingRegex.exec(html)) !== null) {
    levels.push(parseInt(m[1].charAt(1)))
  }
  if (levels.length === 0) {
    return result(name, 0, maxScore, 'error', [], 'No se encontraron headings.', 'Estructura el contenido con H1, H2 y H3.')
  }

  const jumps = []
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      jumps.push(`H${levels[i - 1]} -> H${levels[i]}`)
    }
  }

  if (jumps.length === 0) {
    return result(name, maxScore, maxScore, 'ok', levels, 'Jerarquia de headings correcta, sin saltos.', null)
  }
  const score = Math.max(0, maxScore - jumps.length * 2)
  return result(name, score, maxScore, 'warn', { levels, jumps }, `Saltos en jerarquia: ${jumps.join(', ')}.`, 'Corrige la jerarquia: de H1 pasa a H2, de H2 a H3, etc.')
}

/**
 * Analiza imagenes: count, alt coverage, lazy loading
 */
function checkImages(html) {
  const name = 'Images'
  const maxScore = 10
  const imgRegex = /<img[^>]*>/gi
  const imgs = html.match(imgRegex) || []
  const total = imgs.length

  if (total === 0) {
    return result(name, maxScore - 2, maxScore, 'warn', { total: 0 }, 'No se encontraron imagenes.', 'Agrega imagenes relevantes con alt text descriptivo.')
  }

  let withAlt = 0
  let withLazy = 0
  const missingAlt = []

  imgs.forEach((img, i) => {
    if (/alt=["'][^"']+["']/i.test(img)) {
      withAlt++
    } else {
      const src = (img.match(/src=["']([^"']*)["']/i) || [])[1] || `img-${i}`
      missingAlt.push(src)
    }
    if (/loading=["']lazy["']/i.test(img)) {
      withLazy++
    }
  })

  const altPct = Math.round((withAlt / total) * 100)
  const lazyPct = Math.round((withLazy / total) * 100)
  let score = maxScore
  let status = 'ok'
  const issues = []

  if (altPct < THRESHOLDS.altCoveragePct) {
    score -= Math.round((THRESHOLDS.altCoveragePct - altPct) / 10)
    issues.push(`${total - withAlt} imagenes sin alt text.`)
    status = altPct < 50 ? 'error' : 'warn'
  }
  if (lazyPct < 50 && total > 3) {
    score -= 2
    issues.push(`Solo ${withLazy}/${total} imagenes con lazy loading.`)
    if (status === 'ok') status = 'warn'
  }

  score = Math.max(0, score)
  return result(name, score, maxScore, status, { total, withAlt, withoutAlt: total - withAlt, altPct, withLazy, lazyPct, missingAlt: missingAlt.slice(0, 5) }, `${total} imagenes: ${altPct}% con alt, ${lazyPct}% con lazy.${issues.length ? ' ' + issues.join(' ') : ''}`, issues.length ? 'Agrega alt descriptivo a todas las imagenes y loading="lazy" a las que estan below the fold.' : null)
}

/**
 * Verifica Open Graph: og:title, og:description, og:image
 */
function checkOpenGraph(html) {
  const name = 'Open Graph'
  const maxScore = 5
  const ogTitle = extractProperty(html, 'og:title')
  const ogDesc = extractProperty(html, 'og:description')
  const ogImage = extractProperty(html, 'og:image')

  const present = [ogTitle, ogDesc, ogImage].filter(Boolean).length
  if (present === 3) {
    return result(name, maxScore, maxScore, 'ok', { ogTitle, ogDesc, ogImage }, 'Open Graph completo (title, description, image).', null)
  }
  const missing = []
  if (!ogTitle) missing.push('og:title')
  if (!ogDesc) missing.push('og:description')
  if (!ogImage) missing.push('og:image')
  const score = Math.round((present / 3) * maxScore)
  return result(name, score, maxScore, present === 0 ? 'error' : 'warn', { ogTitle, ogDesc, ogImage, missing }, `Open Graph incompleto. Faltan: ${missing.join(', ')}.`, `Agrega las meta tags Open Graph faltantes: ${missing.join(', ')}.`)
}

/**
 * Verifica Twitter Card: twitter:card, twitter:title
 */
function checkTwitterCard(html) {
  const name = 'Twitter Card'
  const maxScore = 5
  const card = extractMeta(html, 'twitter:card')
  const title = extractMeta(html, 'twitter:title')

  if (card && title) {
    return result(name, maxScore, maxScore, 'ok', { card, title }, `Twitter Card configurada: ${card}.`, null)
  }
  const missing = []
  if (!card) missing.push('twitter:card')
  if (!title) missing.push('twitter:title')
  const present = 2 - missing.length
  const score = Math.round((present / 2) * maxScore)
  return result(name, score, maxScore, present === 0 ? 'warn' : 'warn', { card, title, missing }, `Twitter Card incompleta. Faltan: ${missing.join(', ')}.`, `Agrega: ${missing.join(', ')} para mejor preview en Twitter/X.`)
}

/**
 * Cuenta palabras en el body — minimo 300
 */
function checkWordCount(html) {
  const name = 'Word Count'
  const maxScore = 10
  const text = stripHtml(html)
  const words = text.split(/\s+/).filter(w => w.length > 1).length

  if (words >= THRESHOLDS.wordCountMin) {
    return result(name, maxScore, maxScore, 'ok', words, `${words} palabras (minimo recomendado: ${THRESHOLDS.wordCountMin}).`, null)
  }
  const score = Math.max(0, Math.round(maxScore * (words / THRESHOLDS.wordCountMin)))
  return result(name, score, maxScore, words < 100 ? 'error' : 'warn', words, `Solo ${words} palabras. Minimo recomendado: ${THRESHOLDS.wordCountMin}.`, 'Agrega mas contenido relevante y util para el usuario.')
}

/**
 * Cuenta links internos
 */
function checkInternalLinks(html, baseUrl) {
  const name = 'Internal Links'
  const maxScore = 5
  const linkRegex = /<a[^>]*href=["']([^"'#][^"']*)["'][^>]*>/gi
  let internal = 0
  const baseDomain = new URL(baseUrl).hostname
  let m

  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1]
    try {
      if (href.startsWith('/') || href.startsWith(baseUrl)) {
        internal++
      } else if (href.startsWith('http')) {
        if (new URL(href).hostname === baseDomain) internal++
      }
    } catch { /* skip invalid */ }
  }

  if (internal >= THRESHOLDS.internalLinksMin) {
    return result(name, maxScore, maxScore, 'ok', internal, `${internal} links internos.`, null)
  }
  return result(name, Math.round((internal / THRESHOLDS.internalLinksMin) * maxScore), maxScore, 'warn', internal, `Solo ${internal} links internos (minimo: ${THRESHOLDS.internalLinksMin}).`, 'Agrega links internos a paginas relevantes para mejorar la navegacion y distribuir autoridad.')
}

/**
 * Verifica que links externos tengan target="_blank" y rel="noopener"
 */
function checkExternalLinks(html) {
  const name = 'External Links'
  const maxScore = 5
  const linkRegex = /<a[^>]*href=["'](https?:\/\/[^"']*)["'][^>]*>/gi
  const external = []
  let m

  while ((m = linkRegex.exec(html)) !== null) {
    external.push(m[0])
  }

  if (external.length === 0) {
    return result(name, maxScore, maxScore, 'ok', 0, 'No hay links externos.', null)
  }

  let withBlank = 0
  let withNoopener = 0

  external.forEach(tag => {
    if (/target=["']_blank["']/i.test(tag)) withBlank++
    if (/rel=["'][^"']*noopener[^"']*["']/i.test(tag)) withNoopener++
  })

  const total = external.length
  const issues = []
  let deductions = 0

  if (withBlank < total) {
    issues.push(`${total - withBlank}/${total} sin target="_blank".`)
    deductions += 1
  }
  if (withNoopener < total) {
    issues.push(`${total - withNoopener}/${total} sin rel="noopener".`)
    deductions += 2
  }

  const score = Math.max(0, maxScore - deductions)
  return result(name, score, maxScore, issues.length ? 'warn' : 'ok', { total, withBlank, withNoopener }, `${total} links externos.${issues.length ? ' ' + issues.join(' ') : ''}`, issues.length ? 'Agrega target="_blank" y rel="noopener noreferrer" a los links externos.' : null)
}

// ===========================================================================
// Exports
// ===========================================================================
module.exports = {
  // SEO Tecnico
  checkHTTPS,
  checkRobotsTxt,
  checkSitemap,
  checkCanonical,
  checkMetaRobots,
  checkSchemas,
  checkRedirectChain,
  checkHTTPVersion,
  // Contenido On-Page
  checkTitle,
  checkMetaDescription,
  checkH1,
  checkHeadingHierarchy,
  checkImages,
  checkOpenGraph,
  checkTwitterCard,
  checkWordCount,
  checkInternalLinks,
  checkExternalLinks,
  // Helpers exportados para uso en geo-checks
  extractJsonLd,
  extractMeta,
  stripHtml,
}
