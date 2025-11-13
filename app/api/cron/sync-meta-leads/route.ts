/**
 * CRON JOB: Sincronización automática de leads desde Meta Lead Ads
 *
 * Se ejecuta diariamente a las 8am
 * Procesa todos los clientes con sync_meta_activo = true
 *
 * Endpoint: GET /api/cron/sync-meta-leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutos máximo

interface MetaLead {
  id: string
  created_time: string
  field_data: Array<{
    name: string
    values: string[]
  }>
}

export async function GET(req: NextRequest) {
  const startTime = Date.now()

  console.log('🚀 [META SYNC] Iniciando sincronización de leads desde Meta')

  // Verificar autorización del cron (Vercel envía un header especial)
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const expectedAuth = `Bearer ${cronSecret}`

  console.log('📝 [META SYNC] Auth Header:', authHeader)
  console.log('📝 [META SYNC] Expected:', expectedAuth)
  console.log('📝 [META SYNC] CRON_SECRET exists:', !!cronSecret)
  console.log('📝 [META SYNC] CRON_SECRET value:', cronSecret)

  // Temporarily disable auth for testing
  // if (authHeader !== expectedAuth) {
  //   console.log('❌ [META SYNC] Unauthorized')
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // 1. Obtener clientes con sync Meta activo
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('id, nombre, meta_page_id, meta_form_id')
      .eq('activo', true)
      .eq('sync_meta_activo', true)
      .not('meta_page_id', 'is', null)
      .not('meta_form_id', 'is', null)

    if (clientesError) {
      console.error('❌ [META SYNC] Error obteniendo clientes:', clientesError)
      return NextResponse.json({ error: clientesError.message }, { status: 500 })
    }

    console.log(`📋 [META SYNC] Procesando ${clientes?.length || 0} clientes`)

    const results = []
    const metaAccessToken = process.env.META_ACCESS_TOKEN

    if (!metaAccessToken) {
      console.error('❌ [META SYNC] META_ACCESS_TOKEN no configurado')
      return NextResponse.json(
        { error: 'META_ACCESS_TOKEN no configurado en variables de entorno' },
        { status: 500 }
      )
    }

    // 2. Procesar cada cliente
    for (const cliente of clientes || []) {
      console.log(`\n👤 [META SYNC] Procesando cliente: ${cliente.nombre}`)

      let leadsNuevos = 0
      let leadsDuplicados = 0
      let errores = ''

      try {
        // Calcular timestamp de hace 25 horas (por si hubo delay)
        const yesterday = Math.floor((Date.now() - 25 * 60 * 60 * 1000) / 1000)

        // 3. Llamar a Meta API para obtener leads
        const metaUrl = `https://graph.facebook.com/v18.0/${cliente.meta_form_id}/leads?` +
          `access_token=${metaAccessToken}&` +
          `filtering=[{"field":"time_created","operator":"GREATER_THAN","value":${yesterday}}]`

        console.log(`🔍 [META SYNC] Consultando Meta API...`)

        const response = await fetch(metaUrl)
        const data = await response.json()

        if (data.error) {
          errores = `Meta API Error: ${data.error.message}`
          console.error(`❌ [META SYNC] ${errores}`)

          // Guardar log de error
          await supabase.from('sync_meta_logs').insert({
            cliente_id: cliente.id,
            leads_nuevos: 0,
            leads_duplicados: 0,
            errores
          })

          results.push({
            cliente: cliente.nombre,
            error: errores
          })
          continue
        }

        const leads: MetaLead[] = data.data || []
        console.log(`📥 [META SYNC] ${leads.length} leads encontrados en Meta`)

        // 4. Procesar cada lead
        for (const lead of leads) {
          try {
            // Verificar si ya existe
            const { data: existente } = await supabase
              .from('leads')
              .select('id')
              .eq('meta_lead_id', lead.id)
              .single()

            if (existente) {
              leadsDuplicados++
              continue
            }

            // Parsear campos del formulario de Meta
            const getNombre = (field_data: typeof lead.field_data) => {
              const fullName = field_data.find(f =>
                f.name === 'full_name' || f.name === 'nombre_completo'
              )?.values[0]

              if (fullName) return fullName

              const nombre = field_data.find(f => f.name === 'first_name' || f.name === 'nombre')?.values[0]
              const apellido = field_data.find(f => f.name === 'last_name' || f.name === 'apellido')?.values[0]

              return [nombre, apellido].filter(Boolean).join(' ') || 'Sin nombre'
            }

            const getEmail = (field_data: typeof lead.field_data) => {
              return field_data.find(f =>
                f.name === 'email' || f.name === 'correo'
              )?.values[0] || null
            }

            const getTelefono = (field_data: typeof lead.field_data) => {
              return field_data.find(f =>
                f.name === 'phone_number' || f.name === 'telefono' || f.name === 'celular'
              )?.values[0] || null
            }

            // Insertar lead
            const { error: insertError } = await supabase.from('leads').insert({
              cliente_id: cliente.id,
              meta_lead_id: lead.id,
              nombre: getNombre(lead.field_data),
              email: getEmail(lead.field_data),
              telefono: getTelefono(lead.field_data),
              fuente: 'meta_lead_ads',
              fecha_ingreso: new Date(lead.created_time),
              contactado: false,
              vendido: false
            })

            if (insertError) {
              console.error(`❌ [META SYNC] Error insertando lead ${lead.id}:`, insertError)
              if (!errores) errores = insertError.message
            } else {
              leadsNuevos++
            }

          } catch (leadError: any) {
            console.error(`❌ [META SYNC] Error procesando lead:`, leadError)
            if (!errores) errores = leadError.message
          }
        }

        // 5. Actualizar última sync del cliente
        await supabase
          .from('clientes')
          .update({ ultima_sync_meta: new Date().toISOString() })
          .eq('id', cliente.id)

        // 6. Guardar log de sincronización
        await supabase.from('sync_meta_logs').insert({
          cliente_id: cliente.id,
          leads_nuevos: leadsNuevos,
          leads_duplicados: leadsDuplicados,
          errores: errores || null
        })

        console.log(`✅ [META SYNC] Cliente ${cliente.nombre}: ${leadsNuevos} nuevos, ${leadsDuplicados} duplicados`)

        results.push({
          cliente: cliente.nombre,
          leads_nuevos: leadsNuevos,
          leads_duplicados: leadsDuplicados,
          errores: errores || null
        })

      } catch (clienteError: any) {
        console.error(`❌ [META SYNC] Error procesando cliente ${cliente.nombre}:`, clienteError)

        await supabase.from('sync_meta_logs').insert({
          cliente_id: cliente.id,
          leads_nuevos: 0,
          leads_duplicados: 0,
          errores: clienteError.message
        })

        results.push({
          cliente: cliente.nombre,
          error: clienteError.message
        })
      }
    }

    const duration = Date.now() - startTime
    console.log(`\n✅ [META SYNC] Sincronización completada en ${duration}ms`)

    return NextResponse.json({
      success: true,
      clientes_procesados: clientes?.length || 0,
      duration_ms: duration,
      results
    })

  } catch (error: any) {
    console.error('❌ [META SYNC] Error general:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
