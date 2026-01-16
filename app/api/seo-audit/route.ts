import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface SEOIssue {
  type: 'error' | 'warning' | 'info' | 'success'
  category: string
  message: string
  details?: string
}

interface SEOAuditResult {
  url: string
  score: number
  loadTime: number
  issues: SEOIssue[]
  meta: {
    title: string | null
    titleLength: number
    description: string | null
    descriptionLength: number
    canonical: string | null
    robots: string | null
    viewport: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    twitterCard: string | null
  }
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
    h4: string[]
    h5: string[]
    h6: string[]
  }
  images: {
    total: number
    withAlt: number
    withoutAlt: number
    largeImages: string[]
  }
  links: {
    internal: number
    external: number
    broken: string[]
  }
  technical: {
    hasHttps: boolean
    hasSchemaMarkup: boolean
    schemaTypes: string[]
    hasSitemap: boolean
    hasRobotsTxt: boolean
    isIndexable: boolean
  }
}

function extractMetaContent(html: string, name: string): string | null {
  // Try name attribute
  const nameRegex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')
  const nameMatch = html.match(nameRegex)
  if (nameMatch) return nameMatch[1]

  // Try content before name
  const nameRegex2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i')
  const nameMatch2 = html.match(nameRegex2)
  if (nameMatch2) return nameMatch2[1]

  return null
}

function extractMetaProperty(html: string, property: string): string | null {
  const propRegex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')
  const propMatch = html.match(propRegex)
  if (propMatch) return propMatch[1]

  const propRegex2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["'][^>]*>`, 'i')
  const propMatch2 = html.match(propRegex2)
  if (propMatch2) return propMatch2[1]

  return null
}

function extractHeadings(html: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi')
  const results: string[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].trim()
    if (text.length > 0) results.push(text)
  }
  return results
}

function countImages(html: string): { total: number; withAlt: number; withoutAlt: number; largeImages: string[] } {
  const imgRegex = /<img[^>]*>/gi
  const images = html.match(imgRegex) || []

  let withAlt = 0
  let withoutAlt = 0
  const largeImages: string[] = []

  images.forEach(img => {
    if (/alt=["'][^"']+["']/i.test(img)) {
      withAlt++
    } else {
      withoutAlt++
    }
  })

  return { total: images.length, withAlt, withoutAlt, largeImages }
}

function countLinks(html: string, baseUrl: string): { internal: number; external: number; broken: string[] } {
  const linkRegex = /<a[^>]*href=["']([^"'#][^"']*)["'][^>]*>/gi
  let internal = 0
  let external = 0
  const broken: string[] = []
  const baseDomain = new URL(baseUrl).hostname

  let match
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]
    try {
      if (href.startsWith('/') || href.startsWith(baseUrl)) {
        internal++
      } else if (href.startsWith('http')) {
        const linkDomain = new URL(href).hostname
        if (linkDomain === baseDomain) {
          internal++
        } else {
          external++
        }
      }
    } catch {
      // Invalid URL
    }
  }

  return { internal, external, broken }
}

function detectSchemaMarkup(html: string): { hasSchema: boolean; types: string[] } {
  const schemaRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const types: string[] = []

  let match
  while ((match = schemaRegex.exec(html)) !== null) {
    try {
      const json = JSON.parse(match[1])
      if (json['@type']) {
        if (Array.isArray(json['@type'])) {
          types.push(...json['@type'])
        } else {
          types.push(json['@type'])
        }
      }
    } catch {
      // Invalid JSON
    }
  }

  return { hasSchema: types.length > 0, types: Array.from(new Set(types)) }
}

function calculateScore(issues: SEOIssue[]): number {
  let score = 100

  issues.forEach(issue => {
    if (issue.type === 'error') score -= 15
    if (issue.type === 'warning') score -= 5
  })

  return Math.max(0, Math.min(100, score))
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL es requerida' }, { status: 400 })
    }

    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
    }

    const startTime = Date.now()

    // Fetch the page
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; M&P SEO Auditor/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return NextResponse.json({
        error: `No se pudo acceder a la página (${response.status})`
      }, { status: 400 })
    }

    const html = await response.text()
    const loadTime = Date.now() - startTime

    const issues: SEOIssue[] = []

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : null
    const titleLength = title?.length || 0

    // Title checks
    if (!title) {
      issues.push({ type: 'error', category: 'Meta', message: 'Falta el título de la página', details: 'El título es fundamental para SEO y aparece en los resultados de Google.' })
    } else if (titleLength < 30) {
      issues.push({ type: 'warning', category: 'Meta', message: 'Título muy corto', details: `${titleLength} caracteres. Recomendado: 50-60 caracteres.` })
    } else if (titleLength > 60) {
      issues.push({ type: 'warning', category: 'Meta', message: 'Título muy largo', details: `${titleLength} caracteres. Google truncará después de ~60.` })
    } else {
      issues.push({ type: 'success', category: 'Meta', message: 'Título optimizado', details: `${titleLength} caracteres.` })
    }

    // Extract description
    const description = extractMetaContent(html, 'description')
    const descriptionLength = description?.length || 0

    // Description checks
    if (!description) {
      issues.push({ type: 'error', category: 'Meta', message: 'Falta la meta descripción', details: 'La meta descripción aparece en los resultados de Google y mejora el CTR.' })
    } else if (descriptionLength < 120) {
      issues.push({ type: 'warning', category: 'Meta', message: 'Meta descripción muy corta', details: `${descriptionLength} caracteres. Recomendado: 150-160.` })
    } else if (descriptionLength > 160) {
      issues.push({ type: 'warning', category: 'Meta', message: 'Meta descripción muy larga', details: `${descriptionLength} caracteres. Google truncará después de ~160.` })
    } else {
      issues.push({ type: 'success', category: 'Meta', message: 'Meta descripción optimizada', details: `${descriptionLength} caracteres.` })
    }

    // Extract other meta
    const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] || null
    const robots = extractMetaContent(html, 'robots')
    const viewport = extractMetaContent(html, 'viewport')
    const ogTitle = extractMetaProperty(html, 'og:title')
    const ogDescription = extractMetaProperty(html, 'og:description')
    const ogImage = extractMetaProperty(html, 'og:image')
    const twitterCard = extractMetaContent(html, 'twitter:card')

    // Canonical check
    if (!canonical) {
      issues.push({ type: 'warning', category: 'Meta', message: 'Falta URL canónica', details: 'Define la URL canónica para evitar contenido duplicado.' })
    } else {
      issues.push({ type: 'success', category: 'Meta', message: 'URL canónica definida' })
    }

    // Viewport check
    if (!viewport) {
      issues.push({ type: 'error', category: 'Mobile', message: 'Falta meta viewport', details: 'Esencial para que la página sea mobile-friendly.' })
    } else {
      issues.push({ type: 'success', category: 'Mobile', message: 'Meta viewport presente' })
    }

    // Open Graph checks
    if (!ogTitle || !ogDescription || !ogImage) {
      issues.push({ type: 'warning', category: 'Social', message: 'Open Graph incompleto', details: 'Mejora cómo se ve tu página al compartir en redes sociales.' })
    } else {
      issues.push({ type: 'success', category: 'Social', message: 'Open Graph configurado' })
    }

    // Extract headings
    const h1 = extractHeadings(html, 'h1')
    const h2 = extractHeadings(html, 'h2')
    const h3 = extractHeadings(html, 'h3')
    const h4 = extractHeadings(html, 'h4')
    const h5 = extractHeadings(html, 'h5')
    const h6 = extractHeadings(html, 'h6')

    // H1 checks
    if (h1.length === 0) {
      issues.push({ type: 'error', category: 'Contenido', message: 'Falta H1', details: 'Cada página debe tener exactamente un H1.' })
    } else if (h1.length > 1) {
      issues.push({ type: 'warning', category: 'Contenido', message: 'Múltiples H1', details: `${h1.length} H1 encontrados. Recomendado: solo 1.` })
    } else {
      issues.push({ type: 'success', category: 'Contenido', message: 'H1 único presente' })
    }

    // H2 checks
    if (h2.length === 0) {
      issues.push({ type: 'warning', category: 'Contenido', message: 'Sin subtítulos H2', details: 'Usa H2 para estructurar tu contenido.' })
    } else {
      issues.push({ type: 'success', category: 'Contenido', message: `${h2.length} subtítulos H2` })
    }

    // Images
    const images = countImages(html)

    if (images.withoutAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'Imágenes',
        message: 'Imágenes sin alt text',
        details: `${images.withoutAlt} de ${images.total} imágenes sin atributo alt.`
      })
    } else if (images.total > 0) {
      issues.push({ type: 'success', category: 'Imágenes', message: 'Todas las imágenes tienen alt' })
    }

    // Links
    const links = countLinks(html, validUrl.toString())

    if (links.internal < 3) {
      issues.push({ type: 'warning', category: 'Links', message: 'Pocos links internos', details: `Solo ${links.internal} links internos. Mejora la navegación.` })
    } else {
      issues.push({ type: 'success', category: 'Links', message: `${links.internal} links internos` })
    }

    if (links.external > 0) {
      issues.push({ type: 'info', category: 'Links', message: `${links.external} links externos` })
    }

    // Schema markup
    const schema = detectSchemaMarkup(html)

    if (!schema.hasSchema) {
      issues.push({ type: 'warning', category: 'Técnico', message: 'Sin Schema Markup', details: 'Agrega datos estructurados para rich snippets en Google.' })
    } else {
      issues.push({ type: 'success', category: 'Técnico', message: 'Schema Markup detectado', details: schema.types.join(', ') })
    }

    // HTTPS check
    const hasHttps = validUrl.protocol === 'https:'
    if (!hasHttps) {
      issues.push({ type: 'error', category: 'Seguridad', message: 'Sin HTTPS', details: 'Google penaliza sitios sin SSL.' })
    } else {
      issues.push({ type: 'success', category: 'Seguridad', message: 'HTTPS activo' })
    }

    // Robots check
    const isIndexable = !robots?.includes('noindex')
    if (!isIndexable) {
      issues.push({ type: 'warning', category: 'Indexación', message: 'Página con noindex', details: 'Esta página no aparecerá en Google.' })
    }

    // Load time check
    if (loadTime > 3000) {
      issues.push({ type: 'error', category: 'Performance', message: 'Página muy lenta', details: `${(loadTime/1000).toFixed(1)}s de carga. Objetivo: <3s.` })
    } else if (loadTime > 2000) {
      issues.push({ type: 'warning', category: 'Performance', message: 'Página lenta', details: `${(loadTime/1000).toFixed(1)}s de carga. Objetivo: <2s.` })
    } else {
      issues.push({ type: 'success', category: 'Performance', message: 'Buena velocidad', details: `${(loadTime/1000).toFixed(1)}s de carga.` })
    }

    const score = calculateScore(issues)

    const result: SEOAuditResult = {
      url: validUrl.toString(),
      score,
      loadTime,
      issues,
      meta: {
        title,
        titleLength,
        description,
        descriptionLength,
        canonical,
        robots,
        viewport,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
      },
      headings: { h1, h2, h3, h4, h5, h6 },
      images,
      links,
      technical: {
        hasHttps,
        hasSchemaMarkup: schema.hasSchema,
        schemaTypes: schema.types,
        hasSitemap: false, // Would need separate check
        hasRobotsTxt: false, // Would need separate check
        isIndexable,
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('SEO Audit error:', error)
    return NextResponse.json({
      error: 'Error al analizar la página. Verifica que la URL sea accesible.'
    }, { status: 500 })
  }
}
