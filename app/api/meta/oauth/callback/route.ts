import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Callback de OAuth de Meta
 * GET /api/meta/oauth/callback?code=xxx&state=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Error de autorización
    if (error) {
      console.error('Error de OAuth:', error, searchParams.get('error_description'))
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mulleryperez.cl'
      return NextResponse.redirect(
        `${baseUrl}/crm/integraciones?error=auth_failed`
      )
    }

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state' },
        { status: 400 }
      )
    }

    // Decodificar state para obtener cliente_id
    const { cliente_id } = JSON.parse(Buffer.from(state, 'base64').toString())

    // =====================================================
    // 1. Intercambiar código por access token
    // =====================================================
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mulleryperez.cl'
    const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?` +
      `client_id=${process.env.FACEBOOK_APP_ID}` +
      `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(baseUrl + '/api/meta/oauth/callback')}` +
      `&code=${code}`

    const tokenResponse = await fetch(tokenUrl)
    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('Error obteniendo token:', tokenData.error)
      return NextResponse.redirect(
        `${baseUrl}/crm/integraciones?error=token_failed`
      )
    }

    const { access_token, expires_in } = tokenData

    // =====================================================
    // 2. Obtener info del usuario de Meta
    // =====================================================
    const userResponse = await fetch(
      `https://graph.facebook.com/v21.0/me?access_token=${access_token}`
    )
    const userData = await userResponse.json()

    // =====================================================
    // 3. Guardar o actualizar la conexión
    // =====================================================
    const expiresAt = new Date(Date.now() + expires_in * 1000)

    const { data: connection, error: connectionError } = await supabase
      .from('meta_connections')
      .upsert({
        cliente_id,
        access_token,
        token_expires_at: expiresAt.toISOString(),
        meta_user_id: userData.id,
        meta_user_name: userData.name,
        status: 'active',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'cliente_id'
      })
      .select()
      .single()

    if (connectionError) {
      console.error('Error guardando conexión:', connectionError)
      return NextResponse.redirect(
        `${baseUrl}/crm/integraciones?error=save_failed`
      )
    }

    // =====================================================
    // 4. Obtener páginas del usuario
    // =====================================================
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${access_token}`
    )
    const pagesData = await pagesResponse.json()

    // Guardar páginas
    if (pagesData.data && pagesData.data.length > 0) {
      for (const page of pagesData.data) {
        await supabase
          .from('meta_pages')
          .upsert({
            connection_id: connection.id,
            page_id: page.id,
            page_name: page.name,
            page_access_token: page.access_token,
            sync_enabled: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'page_id'
          })

        // Obtener formularios de esta página
        const formsResponse = await fetch(
          `https://graph.facebook.com/v21.0/${page.id}/leadgen_forms?access_token=${page.access_token}`
        )
        const formsData = await formsResponse.json()

        if (formsData.data && formsData.data.length > 0) {
          // Primero obtenemos el UUID de la página que acabamos de insertar
          const { data: pageRecord } = await supabase
            .from('meta_pages')
            .select('id')
            .eq('page_id', page.id)
            .single()

          for (const form of formsData.data) {
            await supabase
              .from('meta_lead_forms')
              .upsert({
                page_id: pageRecord!.id,
                form_id: form.id,
                form_name: form.name,
                form_status: form.status,
                sync_enabled: true,
                auto_sync: true,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'form_id'
              })
          }
        }
      }
    }

    // Redirigir a la página de integraciones con éxito
    return NextResponse.redirect(
      `${baseUrl}/crm/integraciones?success=true&pages=${pagesData.data?.length || 0}`
    )
  } catch (error: any) {
    console.error('Error en callback de OAuth:', error)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mulleryperez.cl'
    return NextResponse.redirect(
      `${baseUrl}/crm/integraciones?error=unknown`
    )
  }
}
