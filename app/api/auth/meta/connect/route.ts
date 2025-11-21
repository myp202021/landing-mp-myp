import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/meta/connect
 * Inicia el flujo OAuth de Meta Ads
 * Redirige al usuario a Meta para autorizar la app
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')

    if (!cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id es requerido' },
        { status: 400 }
      )
    }

    const appId = process.env.META_APP_ID
    const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI

    if (!appId || !redirectUri) {
      console.error('❌ META_APP_ID o NEXT_PUBLIC_META_REDIRECT_URI no están configurados')
      return NextResponse.json(
        { error: 'Configuración de OAuth incompleta' },
        { status: 500 }
      )
    }

    // Scopes necesarios para Meta Ads
    const scopes = [
      'ads_read',
      'ads_management',
      'business_management',
      'leads_retrieval',
      'pages_show_list',
      'pages_read_engagement'
    ].join(',')

    // State para validar el callback y pasar el cliente_id
    const state = Buffer.from(JSON.stringify({ cliente_id })).toString('base64')

    // URL de autorización de Meta
    const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth')
    authUrl.searchParams.set('client_id', appId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('response_type', 'code')

    console.log('🔗 Redirigiendo a Meta OAuth:', {
      cliente_id,
      redirectUri,
      scopes
    })

    // Redirigir a Meta
    return NextResponse.redirect(authUrl.toString())

  } catch (error: any) {
    console.error('❌ Error en OAuth connect:', error)
    return NextResponse.json(
      { error: error.message || 'Error iniciando OAuth' },
      { status: 500 }
    )
  }
}
