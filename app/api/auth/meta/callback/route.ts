import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/auth/meta/callback
 * Recibe el callback de Meta después de la autorización
 * Intercambia el código por un access token
 * Guarda el token en la base de datos
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Si el usuario canceló la autorización
    if (error) {
      console.error('❌ Usuario canceló autorización:', error)
      return NextResponse.redirect(
        new URL('/crm/integraciones?error=auth_cancelled', req.url)
      )
    }

    if (!code || !state) {
      console.error('❌ Falta code o state en callback')
      return NextResponse.redirect(
        new URL('/crm/integraciones?error=invalid_callback', req.url)
      )
    }

    // Decodificar state para obtener cliente_id
    const { cliente_id } = JSON.parse(Buffer.from(state, 'base64').toString())

    console.log('✅ Recibido callback de Meta:', { cliente_id, code_length: code.length })

    // Intercambiar código por access token
    const tokenUrl = 'https://graph.facebook.com/v21.0/oauth/access_token'
    const tokenParams = new URLSearchParams({
      client_id: process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_URI!,
      code
    })

    console.log('🔄 Intercambiando código por access token...')

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`)
    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('❌ Error obteniendo access token:', tokenData.error)
      return NextResponse.redirect(
        new URL(`/crm/integraciones?error=token_exchange_failed&details=${tokenData.error.message}`, req.url)
      )
    }

    const { access_token } = tokenData

    console.log('✅ Access token obtenido')

    // Obtener información de la cuenta de Ads
    console.log('📊 Obteniendo información de Ad Accounts...')

    const adAccountsUrl = `https://graph.facebook.com/v21.0/me/adaccounts?fields=id,name,account_status&access_token=${access_token}`
    const adAccountsResponse = await fetch(adAccountsUrl)
    const adAccountsData = await adAccountsResponse.json()

    if (adAccountsData.error) {
      console.error('❌ Error obteniendo Ad Accounts:', adAccountsData.error)
      return NextResponse.redirect(
        new URL(`/crm/integraciones?error=no_ad_accounts&details=${adAccountsData.error.message}`, req.url)
      )
    }

    const adAccounts = adAccountsData.data || []

    if (adAccounts.length === 0) {
      console.error('❌ No se encontraron Ad Accounts')
      return NextResponse.redirect(
        new URL('/crm/integraciones?error=no_ad_accounts', req.url)
      )
    }

    // Usar la primera cuenta de ads (o permitir al usuario elegir)
    const primaryAccount = adAccounts[0]

    console.log('✅ Ad Account encontrada:', {
      id: primaryAccount.id,
      name: primaryAccount.name,
      status: primaryAccount.account_status
    })

    // Guardar o actualizar integración en la base de datos
    const { data: existingIntegration } = await supabase
      .from('platform_integrations')
      .select('id')
      .eq('cliente_id', cliente_id)
      .eq('plataforma', 'meta_ads')
      .single()

    const integrationData = {
      cliente_id,
      plataforma: 'meta_ads',
      account_id: primaryAccount.id,
      account_name: primaryAccount.name,
      access_token,
      token_expires_at: null, // Meta tokens duran 60 días, implementaremos refresh
      active: true,
      last_sync: null,
      sync_status: 'pending'
    }

    if (existingIntegration) {
      // Actualizar integración existente
      await supabase
        .from('platform_integrations')
        .update(integrationData)
        .eq('id', existingIntegration.id)

      console.log('✅ Integración actualizada:', existingIntegration.id)
    } else {
      // Crear nueva integración
      const { data: newIntegration } = await supabase
        .from('platform_integrations')
        .insert(integrationData)
        .select()
        .single()

      console.log('✅ Nueva integración creada:', newIntegration?.id)
    }

    // Redirigir de vuelta a la página de integraciones con éxito
    return NextResponse.redirect(
      new URL('/crm/integraciones?success=meta_connected', req.url)
    )

  } catch (error: any) {
    console.error('❌ Error en OAuth callback:', error)
    return NextResponse.redirect(
      new URL(`/crm/integraciones?error=callback_failed&details=${encodeURIComponent(error.message)}`, req.url)
    )
  }
}
