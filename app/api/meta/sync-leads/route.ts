import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { alertarLeadFallido } from '@/lib/crm/alerta-lead-fallido'

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
      .limit(1)
      .maybeSingle()

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
    // Leads que no se pudieron guardar: se alertan juntos al final (un solo correo)
    const fallidos: Record<string, unknown>[] = []

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

        // Verificar si el lead ya existe (la columna real es meta_lead_id; facebook_lead_id no existe)
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('meta_lead_id', leadId)
          .limit(1)
          .maybeSingle()

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
          fallidos.push({ meta_lead_id: leadId, form_id: formId, motivo: `Graph API respondió ${leadDetailsResponse.status} al pedir el detalle` })
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
        // Antes usaba columnas inexistentes (cargo, origen, facebook_lead_id, estado_contacto, raw_data)
        // y omitía fecha_ingreso (obligatoria): el insert fallaba siempre en silencio.
        const fechaLead = leadDetails.created_time ? new Date(leadDetails.created_time) : new Date()
        const fechaValida = isNaN(fechaLead.getTime()) ? new Date() : fechaLead
        const nuevoLead = {
          cliente_id,
          nombre: leadInfo.nombre || 'Sin nombre',
          email: leadInfo.email || null,
          telefono: leadInfo.telefono || null,
          empresa: leadInfo.empresa || null,
          nombre_empresa: leadInfo.empresa || null, // Guardar en ambos campos
          fuente: `Facebook - ${page_name}`,
          form_nombre: form.name || formId,
          meta_lead_id: leadId,
          observaciones: leadInfo.cargo ? `Cargo: ${leadInfo.cargo}` : null,
          contactado: false,
          vendido: false,
          fecha_ingreso: fechaValida.toISOString(),
          mes_ingreso: fechaValida.toISOString().substring(0, 7)
        }
        const { error: insertError } = await supabase
          .from('leads')
          .insert(nuevoLead)

        if (insertError) {
          // 23505 = ya existe (índice único meta_lead_id): duplicado, no es falla
          if (insertError.code !== '23505') {
            console.error('Error inserting lead:', insertError)
            fallidos.push({ ...nuevoLead, motivo: insertError.message })
          }
          continue
        }

        newLeads++
        console.log(`✓ Lead ${leadId} saved successfully`)
      }
    }

    if (fallidos.length > 0) {
      await alertarLeadFallido({
        fuente: `Sync manual Meta (/api/meta/sync-leads) — ${page_name}`,
        motivo: `${fallidos.length} lead(s) no se guardaron en la sincronización`,
        datos: Object.fromEntries(fallidos.map((f, i) => [`Lead ${i + 1}`, f]))
      })
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
