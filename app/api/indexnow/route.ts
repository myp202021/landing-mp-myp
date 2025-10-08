import { NextRequest, NextResponse } from 'next/server'
import { submitToIndexNow } from '@/lib/indexnow'

export const dynamic = 'force-dynamic'

/**
 * API endpoint para enviar URLs a IndexNow
 *
 * POST /api/indexnow
 * Body: { urls: string[] }
 *
 * Ejemplo:
 * fetch('/api/indexnow', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     urls: ['https://www.mulleryperez.cl/blog/nuevo-articulo']
 *   })
 * })
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected { urls: string[] }' },
        { status: 400 }
      )
    }

    const result = await submitToIndexNow(urls)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Some endpoints failed',
          errors: result.errors
        },
        { status: 207 } // Multi-Status
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully submitted ${urls.length} URL(s) to IndexNow`,
      urls
    })

  } catch (error) {
    console.error('IndexNow API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint para testing
 */
export async function GET() {
  return NextResponse.json({
    message: 'IndexNow API endpoint',
    usage: 'POST with { urls: string[] }',
    documentation: 'https://www.indexnow.org/documentation'
  })
}
