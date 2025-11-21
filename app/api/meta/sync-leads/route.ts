import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/meta/sync-leads
 * Sincroniza leads manualmente desde Facebook usando Page Access Token
 */
export async function POST(req: NextRequest) {
  try {
    const { page_id } = await req.json()

    if (!page_id) {
      return NextResponse.json(
        { error: 'page_id is required' },
        { status: 400 }
      )
    }

    // Obtener el Page Access Token de la base de datos
    const { data: pageData, error: pageError } = await supabase
      .from('meta_pages')
      .select('page_access_token, cliente_id, page_name')
      .eq('page_id', page_id)
      .single()

    if (pageError || !pageData) {
      return NextResponse.json(
        { error: 'Page not found or token not configured' },
        { status: 404 }
      )
    }

    const { page_access_token, cliente_id, page_name } = pageData

    // 1. Obtener todos los formularios de lead ads de la página
    const formsResponse = await fetch(
      `https://graph.facebook.com/v21.0/${page_id}/leadgen_forms?access_token=${page_access_token}`
    )

    if (!formsResponse.ok) {
      const errorData = await formsResponse.json()
      console.error('Error fetching lead forms:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch lead forms', details: errorData },
        { status: 500 }
      )
    }

    const formsData = await formsResponse.json()
    const forms = formsData.data || []

    console.log(`Found ${forms.length} lead forms for page ${page_id}`)

    let totalLeads = 0
    let newLeads = 0

    // 2. Para cada formulario, obtener sus leads
    for (const form of forms) {
      const formId = form.id

      // Obtener leads del formulario
      const leadsResponse = await fetch(
        `https://graph.facebook.com/v21.0/${formId}/leads?access_token=${page_access_token}`
      )

      if (!leadsResponse.ok) {
        console.error(`Error fetching leads for form ${formId}`)
        continue
      }

      const leadsData = await leadsResponse.json()
      const leads = leadsData.data || []

      console.log(`Form ${formId}: ${leads.length} leads`)

      // 3. Para cada lead, obtener detalles completos y guardarlo
      for (const lead of leads) {
        totalLeads++
        const leadId = lead.id

        // Verificar si el lead ya existe
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('facebook_lead_id', leadId)
          .single()

        if (existingLead) {
          console.log(`Lead ${leadId} already exists, skipping`)
          continue
        }

        // Obtener detalles del lead
        const leadDetailsResponse = await fetch(
          `https://graph.facebook.com/v21.0/${leadId}?access_token=${page_access_token}`
        )

        if (!leadDetailsResponse.ok) {
          console.error(`Error fetching details for lead ${leadId}`)
          continue
        }

        const leadDetails = await leadDetailsResponse.json()

        // Extraer información del lead
        const fieldData = leadDetails.field_data || []
        const leadInfo: any = {}

        fieldData.forEach((field: any) => {
          const name = field.name.toLowerCase()
          const value = field.values && field.values[0]

          if (name.includes('email') || name === 'correo_electrónico') {
            leadInfo.email = value
          } else if (name.includes('nombre') || name === 'full_name' || name.includes('name')) {
            leadInfo.nombre = value
          } else if (name.includes('teléfono') || name.includes('telefono') || name.includes('phone')) {
            leadInfo.telefono = value
          } else if (name.includes('empresa') || name.includes('company')) {
            leadInfo.empresa = value
          } else if (name.includes('cargo') || name.includes('job_title')) {
            leadInfo.cargo = value
          }
        })

        // Insertar lead en la base de datos
        const { error: insertError } = await supabase
          .from('leads')
          .insert({
            cliente_id,
            nombre: leadInfo.nombre || 'Sin nombre',
            email: leadInfo.email || null,
            telefono: leadInfo.telefono || null,
            empresa: leadInfo.empresa || null,
            nombre_empresa: leadInfo.empresa || null, // Guardar en ambos campos
            cargo: leadInfo.cargo || null,
            origen: `Facebook - ${page_name}`,
            facebook_lead_id: leadId,
            estado_contacto: 'sin_contactar',
            raw_data: leadDetails
          })

        if (insertError) {
          console.error('Error inserting lead:', insertError)
          continue
        }

        newLeads++
        console.log(`✓ Lead ${leadId} saved successfully`)
      }
    }

    return NextResponse.json({
      success: true,
      total_leads_found: totalLeads,
      new_leads_saved: newLeads,
      message: `Sincronización completa. ${newLeads} leads nuevos de ${totalLeads} encontrados.`
    })

  } catch (error: any) {
    console.error('Error in sync-leads:', error)
    return NextResponse.json(
      { error: error.message || 'Error syncing leads' },
      { status: 500 }
    )
  }
}
