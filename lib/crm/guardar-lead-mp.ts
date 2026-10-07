import { createClient } from '@supabase/supabase-js'
import { MP_CLIENTE_ID } from '@/lib/crm/leads-pipeline'
import { alertarLeadFallido } from '@/lib/crm/alerta-lead-fallido'

interface LeadMP {
  nombre: string
  email: string
  telefono?: string | null
  empresa?: string | null
  fuente: string
  form_nombre: string
  observaciones?: string | null
}

/**
 * Guarda un lead en el CRM bajo el cliente M&P. Nunca lanza excepción:
 * si falla, avisa por correo (alertarLeadFallido) y devuelve null.
 */
export async function guardarLeadMP(lead: LeadMP, origen: string): Promise<number | null> {
  const ahora = new Date().toISOString()
  const leadData = {
    cliente_id: MP_CLIENTE_ID,
    nombre: lead.nombre,
    email: lead.email,
    telefono: lead.telefono || null,
    empresa: lead.empresa || null,
    nombre_empresa: lead.empresa || null,
    fuente: lead.fuente,
    form_nombre: lead.form_nombre,
    observaciones: lead.observaciones || null,
    contactado: false,
    vendido: false,
    fecha_ingreso: ahora,
    mes_ingreso: ahora.substring(0, 7),
  }
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data, error } = await supabase.from('leads').insert([leadData]).select('id').single()
    if (error) {
      await alertarLeadFallido({ fuente: origen, motivo: error, datos: leadData })
      return null
    }
    return data.id
  } catch (e) {
    await alertarLeadFallido({ fuente: origen, motivo: e, datos: leadData })
    return null
  }
}
