import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper para extraer valores con múltiples nombres posibles
function extractField(body: any, ...possibleNames: string[]): string | null {
  for (const name of possibleNames) {
    // Buscar exacto
    if (body[name] && body[name] !== '') return String(body[name])
    // Buscar en mayúsculas
    if (body[name.toUpperCase()] && body[name.toUpperCase()] !== '') return String(body[name.toUpperCase()])
    // Buscar en minúsculas
    if (body[name.toLowerCase()] && body[name.toLowerCase()] !== '') return String(body[name.toLowerCase()])
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('📥 Webhook recibido de Zapier:', JSON.stringify(body, null, 2))

    // Validar datos requeridos
    if (!body.client_id) {
      return NextResponse.json(
        { error: 'client_id es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el cliente existe
    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .select('id, nombre, contacto_email')
      .eq('id', body.client_id)
      .single()

    if (clienteError || !clienteData) {
      console.error('❌ Cliente no encontrado:', body.client_id)
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Cliente encontrado:', clienteData.nombre)

    // Extraer campos con múltiples nombres posibles
    // Google Ads, Meta, etc envían campos con diferentes nombres
    const nombre = extractField(body,
      'full_name', 'fullName', 'FULL_NAME',
      'nombre', 'name', 'Name', 'NAME',
      'first_name', 'firstName', 'FIRST_NAME',
      'Nombre completo', 'Nombre Completo'
    )

    const apellido = extractField(body,
      'last_name', 'lastName', 'LAST_NAME',
      'apellido', 'Apellido', 'surname'
    )

    const email = extractField(body,
      'email', 'Email', 'EMAIL',
      'mail', 'Mail', 'MAIL',
      'correo', 'Correo', 'e-mail', 'E-mail',
      'email_address', 'emailAddress'
    )

    const telefono = extractField(body,
      'phone_number', 'phoneNumber', 'PHONE_NUMBER',
      'phone', 'Phone', 'PHONE',
      'telefono', 'Telefono', 'TELEFONO',
      'tel', 'mobile', 'celular', 'Celular',
      'número_de_teléfono', 'numero_de_telefono'
    )

    const empresa = extractField(body,
      'company', 'Company', 'COMPANY',
      'empresa', 'Empresa', 'EMPRESA',
      'company_name', 'companyName', 'business',
      'nombre_empresa', 'Nombre de empresa',
      'nombre_de_la_empresa', 'Nombre de la empresa'
    )

    // Construir nombre completo
    let nombreCompleto = nombre || ''
    if (apellido && nombreCompleto) {
      nombreCompleto = `${nombreCompleto} ${apellido}`
    } else if (apellido) {
      nombreCompleto = apellido
    }

    // Si no hay nombre, intentar extraer de otros campos o usar placeholder
    if (!nombreCompleto || nombreCompleto.trim() === '') {
      nombreCompleto = 'Lead Google Ads'
    }

    // Construir observaciones con info adicional de la campaña
    const formName = extractField(body, 'form_name', 'formName', 'form_id')
    const adName = extractField(body, 'ad_name', 'adName', 'ad_id')
    const campaignName = extractField(body, 'campaign_name', 'campaignName', 'campaign_id')
    const ciudad = extractField(body, 'ciudad', 'city', 'City', 'CITY')
    const facturacion = extractField(body, 'facturación_mensual_empresa', 'facturacion_mensual_empresa', 'monthly_revenue', 'revenue')

    const observacionesParts: string[] = []
    if (campaignName) observacionesParts.push(`Campaña: ${campaignName}`)
    if (adName) observacionesParts.push(`Anuncio: ${adName}`)
    if (formName) observacionesParts.push(`Formulario: ${formName}`)
    if (ciudad) observacionesParts.push(`Ciudad: ${ciudad}`)
    if (facturacion) observacionesParts.push(`Facturación: ${facturacion}`)

    // Insertar el lead - SOLO campos que existen en la tabla
    const leadData = {
      cliente_id: body.client_id,
      nombre: nombreCompleto.trim(),
      email: email,
      telefono: telefono,
      empresa: empresa,
      fuente: 'zapier',
      contactado: false,
      vendido: false,
      observaciones: observacionesParts.length > 0 ? observacionesParts.join(' | ') : null,
      fecha_ingreso: new Date().toISOString()
    }

    console.log('📝 Datos del lead a insertar:', {
      nombre: leadData.nombre,
      email: leadData.email,
      telefono: leadData.telefono,
      empresa: leadData.empresa
    })

    const { data: leadInserted, error: leadError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (leadError) {
      console.error('❌ Error insertando lead:', leadError)
      return NextResponse.json(
        { error: 'Error creando lead', details: leadError.message },
        { status: 500 }
      )
    }

    console.log('✅ Lead creado exitosamente:', leadInserted.id)

    // Enviar notificación email al cliente (no bloquea la respuesta)
    const RESEND_KEY = process.env.RESEND_API_KEY || process.env.RESEND
    const notifyEmail = clienteData.contacto_email
    const ALWAYS_CC = 'arturo@mulleryperez.cl'

    if (RESEND_KEY) {
      const toList = notifyEmail ? [notifyEmail] : [ALWAYS_CC]
      // Agregar CC si notifyEmail no es ya arturo
      const ccList = (notifyEmail && notifyEmail !== ALWAYS_CC) ? [ALWAYS_CC] : []

      console.log('📧 Enviando notificación a:', toList, 'CC:', ccList)

      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'contacto@mulleryperez.cl',
          to: toList,
          ...(ccList.length > 0 ? { cc: ccList } : {}),
          subject: `🔔 Nuevo lead: ${leadData.nombre} — ${clienteData.nombre}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:24px;border-radius:12px 12px 0 0;">
                <h2 style="color:#fff;margin:0;">🔔 Nuevo Lead Recibido</h2>
                <p style="color:#93c5fd;margin:8px 0 0;">Muller y Pérez — ${clienteData.nombre}</p>
              </div>
              <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Nombre</td><td style="padding:8px 0;font-weight:600;color:#111827;">${leadData.nombre}</td></tr>
                  ${leadData.email ? `<tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;color:#111827;">${leadData.email}</td></tr>` : ''}
                  ${leadData.telefono ? `<tr><td style="padding:8px 0;color:#6b7280;">Teléfono</td><td style="padding:8px 0;color:#111827;">${leadData.telefono}</td></tr>` : ''}
                  ${leadData.empresa ? `<tr><td style="padding:8px 0;color:#6b7280;">Empresa</td><td style="padding:8px 0;color:#111827;">${leadData.empresa}</td></tr>` : ''}
                  ${leadData.observaciones ? `<tr><td style="padding:8px 0;color:#6b7280;">Detalles</td><td style="padding:8px 0;color:#111827;font-size:13px;">${leadData.observaciones}</td></tr>` : ''}
                </table>
                <div style="margin-top:20px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;">
                  ⏱️ Contacta este lead lo antes posible. Los leads contactados dentro de las primeras 24 horas tienen mayor probabilidad de conversión.
                </div>
                <div style="margin-top:16px;text-align:center;">
                  <a href="https://www.mulleryperez.cl/crm/cliente/dashboard" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Ver en Dashboard</a>
                </div>
              </div>
              <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">Muller y Pérez — Performance Marketing</p>
            </div>
          `
        })
      })
        .then(r => r.json())
        .then(d => {
          if (d.id) {
            console.log('📧 Notificación enviada OK:', d.id, '→', toList)
          } else {
            console.error('⚠️ Resend respondió sin ID:', JSON.stringify(d))
          }
        })
        .catch(e => console.error('⚠️ Error enviando notificación:', e.message))
    } else {
      console.warn('⚠️ RESEND_API_KEY / RESEND no configurada — notificación NO enviada')
    }

    return NextResponse.json({
      success: true,
      lead_id: leadInserted.id,
      message: 'Lead creado exitosamente',
      data: {
        nombre: leadData.nombre,
        email: leadData.email,
        telefono: leadData.telefono
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error en webhook Zapier:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
