import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Sincroniza leads históricos de Facebook Lead Ads
 *
 * POST /api/facebook/sync-leads
 * Body: { cliente_id, fb_page_id, fb_form_id?, date_from?, date_to? }
 */
export async function POST(req: NextRequest) {
  try {
    const { cliente_id, fb_page_id, fb_form_id, date_from, date_to } = await req.json()

    if (!cliente_id || !fb_page_id) {
      return NextResponse.json(
        { error: 'cliente_id and fb_page_id are required' },
        { status: 400 }
      )
    }

    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { error: 'FACEBOOK_PAGE_ACCESS_TOKEN not configured' },
        { status: 500 }
      )
    }

    // 1. Obtener formularios de la página (si no se especificó uno)
    let formIds: string[] = []

    if (fb_form_id) {
      formIds = [fb_form_id]
    } else {
      formIds = await fetchPageForms(fb_page_id, accessToken)
    }

    if (formIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No se encontraron formularios de leads en esta página'
      })
    }

    // 2. Obtener leads de cada formulario
    let totalLeads = 0
    const errors: string[] = []

    for (const formId of formIds) {
      try {
        const leads = await fetchFormLeads(formId, accessToken, date_from, date_to)

        // 3. Guardar cada lead en Supabase
        for (const lead of leads) {
          try {
            await saveLead(lead, cliente_id, fb_page_id, formId)
            totalLeads++
          } catch (error: any) {
            console.error(`Error guardando lead ${lead.id}:`, error)
            errors.push(`Lead ${lead.id}: ${error.message}`)
          }
        }
      } catch (error: any) {
        console.error(`Error con formulario ${formId}:`, error)
        errors.push(`Formulario ${formId}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      total_leads: totalLeads,
      forms_processed: formIds.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Error sincronizando leads:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function fetchPageForms(pageId: string, accessToken: string): Promise<string[]> {
  try {
    const url = `https://graph.facebook.com/v21.0/${pageId}/leadgen_forms?access_token=${accessToken}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Error fetching forms from Facebook')
    }

    const data = await response.json()
    return data.data ? data.data.map((form: any) => form.id) : []
  } catch (error) {
    console.error('Error fetching page forms:', error)
    return []
  }
}

async function fetchFormLeads(
  formId: string,
  accessToken: string,
  dateFrom?: string,
  dateTo?: string
): Promise<any[]> {
  try {
    let url = `https://graph.facebook.com/v21.0/${formId}/leads?access_token=${accessToken}&limit=100`

    // Agregar filtros de fecha si se proporcionan
    if (dateFrom) {
      const timestamp = new Date(dateFrom).getTime() / 1000
      url += `&filtering=[{"field":"time_created","operator":"GREATER_THAN","value":${timestamp}}]`
    }

    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Error fetching leads')
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error(`Error fetching leads for form ${formId}:`, error)
    throw error
  }
}

async function saveLead(leadData: any, clienteId: string, pageId: string, formId: string) {
  // Extraer campos del formulario
  const fields = leadData.field_data || []
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

  // Verificar si el lead ya existe
  const { data: existing } = await supabase
    .from('leads')
    .select('id')
    .eq('cliente_id', clienteId)
    .eq('email', leadInfo.email)
    .eq('form_nombre', formId)
    .single()

  if (existing) {
    console.log(`Lead ${leadData.id} ya existe, saltando...`)
    return
  }

  // Insertar lead
  const { error } = await supabase
    .from('leads')
    .insert({
      cliente_id: clienteId,
      rubro: 'Facebook Lead Ads',
      form_nombre: formId,
      fecha_ingreso: new Date(leadData.created_time).toISOString(),
      mes_ingreso: new Date(leadData.created_time).toISOString().substring(0, 7),
      nombre: leadInfo.nombre,
      empresa: leadInfo.empresa,
      telefono: leadInfo.telefono,
      email: leadInfo.email,
      ciudad: leadInfo.ciudad,
      mensaje: leadInfo.mensaje,
      contactado: false,
      vendido: false,
      observaciones: `Lead de Facebook. ID: ${leadData.id}, Page: ${pageId}, Form: ${formId}`,
    })

  if (error) {
    throw new Error(`Error insertando lead: ${error.message}`)
  }

  console.log(`✅ Lead ${leadData.id} guardado`)
}
