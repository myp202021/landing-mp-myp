import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Iniciar flujo OAuth de Meta
 * GET /api/meta/oauth?cliente_id=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('cliente_id')

    if (!clienteId) {
      return NextResponse.json(
        { error: 'cliente_id is required' },
        { status: 400 }
      )
    }

    // Verificar que el cliente existe
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id, nombre')
      .eq('id', clienteId)
      .single()

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente not found' },
        { status: 404 }
      )
    }

    const appId = process.env.FACEBOOK_APP_ID
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mulleryperez.cl'
    const redirectUri = `${baseUrl}/api/meta/oauth/callback`

    // Permisos necesarios para Lead Ads
    const scope = [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_ads',
      'leads_retrieval',
      'pages_manage_metadata',
    ].join(',')

    // State para mantener el cliente_id durante el callback
    const state = Buffer.from(JSON.stringify({ cliente_id: clienteId })).toString('base64')

    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}` +
      `&response_type=code`

    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('Error iniciando OAuth:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
