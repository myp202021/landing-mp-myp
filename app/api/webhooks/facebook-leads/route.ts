import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// =====================================================
// WEBHOOK VERIFICATION (GET)
// Facebook envía esto para verificar tu webhook
// =====================================================
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const mode = searchParams.get('hub.mode')
  const challenge = searchParams.get('hub.challenge')

  console.log('🔍 Webhook verification:', { mode, challenge })

  // Simplemente retornar el challenge si es subscribe
  if (mode === 'subscribe' && challenge) {
    console.log('✅ Webhook verificado')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

// =====================================================
// WEBHOOK RECEIVER (POST)
// Facebook envía los datos del lead aquí
// =====================================================
export async function POST(req: NextRequest) {
  try {
    // Verificar firma de Facebook (seguridad) - OPCIONAL
    const signature = req.headers.get('x-hub-signature-256')
    const body = await req.text()

    // Solo validar firma si está configurado el APP_SECRET y viene una firma
    if (process.env.FACEBOOK_APP_SECRET && signature) {
      const expectedSignature = 'sha256=' +
        crypto
          .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
          .update(body)
          .digest('hex')

      if (signature !== expectedSignature) {
        console.error('❌ Firma inválida')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
      }
      console.log('✅ Firma verificada correctamente')
    } else {
      console.log('⚠️ Procesando sin verificación de firma')
    }

    const data = JSON.parse(body)

    console.log('📥 Webhook recibido:', JSON.stringify(data, null, 2))

    // Facebook puede enviar varios tipos de eventos
    if (data.object === 'page') {
      for (const entry of data.entry) {
        // Procesar leads
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'leadgen') {
              await processLead(change.value)
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Error procesando webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// =====================================================
// PROCESAR LEAD
// =====================================================
async function processLead(leadData: any) {
  try {
    console.log('🔄 Procesando lead:', leadData)

    const { leadgen_id, page_id, form_id, adgroup_id, ad_id, created_time } = leadData

    // Buscar la página y su conexión para obtener el token y cliente_id
    const { data: metaPage } = await supabase
      .from('meta_pages')
      .select(`
        id,
        page_access_token,
        meta_connections!inner(cliente_id)
      `)
      .eq('page_id', page_id)
      .eq('sync_enabled', true)
      .single()

    if (!metaPage || !metaPage.meta_connections) {
      console.error(`❌ No se encontró página activa para page_id: ${page_id}`)
      return
    }

    const pageAccessToken = metaPage.page_access_token
    const clienteId = (metaPage.meta_connections as any).cliente_id

    // Obtener datos completos del lead usando la Graph API
    const leadDetails = await fetchLeadDetails(leadgen_id, pageAccessToken)

    if (!leadDetails) {
      console.error('❌ No se pudieron obtener los detalles del lead')
      return
    }

    // Extraer campos del formulario
    const fields = leadDetails.field_data || []
    const leadInfo: any = {}

    fields.forEach((field: any) => {
      const fieldName = field.name.toLowerCase()
      const fieldValue = field.values[0]

      if (fieldName.includes('name') || fieldName.includes('nombre')) {
        leadInfo.nombre = fieldValue
      } else if (fieldName.includes('email') || fieldName.includes('correo')) {
        leadInfo.email = fieldValue
      } else if (fieldName.includes('phone') || fieldName.includes('telefono') || fieldName.includes('teléfono')) {
        leadInfo.telefono = fieldValue
      } else if (fieldName.includes('company') || fieldName.includes('empresa')) {
        leadInfo.empresa = fieldValue
      } else if (fieldName.includes('city') || fieldName.includes('ciudad')) {
        leadInfo.ciudad = fieldValue
      } else if (fieldName.includes('message') || fieldName.includes('mensaje')) {
        leadInfo.mensaje = fieldValue
      }
    })

    // Obtener información de la campaña si está disponible
    let campana_nombre = null
    let adset_nombre = null
    let ad_nombre = null

    if (ad_id) {
      try {
        const adInfo = await fetchAdInfo(ad_id, pageAccessToken)
        if (adInfo) {
          campana_nombre = adInfo.campaign?.name
          adset_nombre = adInfo.adset?.name
          ad_nombre = adInfo.name
        }
      } catch (error) {
        console.error('Error obteniendo info del anuncio:', error)
      }
    }

    // Insertar lead en Supabase
    const { data: insertedLead, error } = await supabase
      .from('leads')
      .insert({
        cliente_id: clienteId,
        rubro: 'Facebook Lead Ads',
        campana_nombre,
        adset_nombre,
        ad_nombre,
        form_nombre: form_id,
        fecha_ingreso: new Date(created_time * 1000).toISOString(),
        mes_ingreso: new Date(created_time * 1000).toISOString().substring(0, 7),
        nombre: leadInfo.nombre,
        empresa: leadInfo.empresa,
        telefono: leadInfo.telefono,
        email: leadInfo.email,
        ciudad: leadInfo.ciudad,
        mensaje: leadInfo.mensaje,
        contactado: false,
        vendido: false,
        // Guardar datos raw en observaciones
        observaciones: `Lead de Facebook Lead Ads. Lead ID: ${leadgen_id}`,
      })
      .select()

    if (error) {
      console.error('❌ Error guardando lead:', error)
      return
    }

    console.log('✅ Lead guardado exitosamente:', insertedLead)
  } catch (error: any) {
    console.error('❌ Error en processLead:', error)
  }
}

// =====================================================
// OBTENER DETALLES DEL LEAD
// =====================================================
async function fetchLeadDetails(leadgenId: string, pageAccessToken: string) {
  try {
    if (!pageAccessToken) {
      console.error('❌ pageAccessToken no proporcionado')
      return null
    }

    const url = `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${pageAccessToken}`
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Error de Facebook API:', error)
      return null
    }

    return await response.json()
  } catch (error: any) {
    console.error('❌ Error fetching lead details:', error)
    return null
  }
}

// =====================================================
// OBTENER INFO DEL ANUNCIO
// =====================================================
async function fetchAdInfo(adId: string, pageAccessToken: string) {
  try {
    if (!pageAccessToken) {
      return null
    }

    const url = `https://graph.facebook.com/v21.0/${adId}?fields=name,campaign{name},adset{name}&access_token=${pageAccessToken}`
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching ad info:', error)
    return null
  }
}
