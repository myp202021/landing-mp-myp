import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GOOGLE_PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY

interface PageSpeedResult {
  url: string
  score: number
  fcp: string
  lcp: string
  cls: string
  tbt: number
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PAGESPEED_API_KEY) {
      return NextResponse.json(
        { error: 'API Key no configurada' },
        { status: 500 }
      )
    }

    // Validar URL
    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl
    }

    // Llamar a Google PageSpeed Insights API
    const pagespeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}&key=${GOOGLE_PAGESPEED_API_KEY}&category=PERFORMANCE&strategy=MOBILE`

    console.log('Llamando a PageSpeed API:', cleanUrl)

    const response = await fetch(pagespeedUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PageSpeed API error:', response.status, errorText)

      return NextResponse.json(
        {
          url: cleanUrl,
          error: 'No se pudo analizar el sitio. Verifica que la URL sea válida y esté accesible.',
          score: 0,
          fcp: '0',
          lcp: '0',
          cls: '0',
          tbt: 0
        },
        { status: 200 } // Retornamos 200 para que el frontend maneje el error gracefully
      )
    }

    const data = await response.json()

    // Extraer métricas
    const lighthouseResult = data.lighthouseResult
    const performanceScore = Math.round((lighthouseResult?.categories?.performance?.score || 0) * 100)

    // Core Web Vitals
    const audits = lighthouseResult?.audits || {}

    const fcp = audits['first-contentful-paint']?.displayValue || '0 s'
    const lcp = audits['largest-contentful-paint']?.displayValue || '0 s'
    const cls = audits['cumulative-layout-shift']?.displayValue || '0'
    const tbt = parseInt(audits['total-blocking-time']?.displayValue?.replace(/[^0-9]/g, '') || '0')

    const result: PageSpeedResult = {
      url: cleanUrl,
      score: performanceScore,
      fcp: fcp.replace(' s', ''),
      lcp: lcp.replace(' s', ''),
      cls: cls,
      tbt: tbt
    }

    console.log('PageSpeed result:', result)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Error en PageSpeed API:', error)
    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        details: error.message
      },
      { status: 500 }
    )
  }
}
