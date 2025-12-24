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
      .select('id, nombre')
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
      'correo', 'Correo', 'e-mail', 'E-mail',
      'email_address', 'emailAddress'
    )

    const telefono = extractField(body,
      'phone_number', 'phoneNumber', 'PHONE_NUMBER',
      'phone', 'Phone', 'PHONE',
      'telefono', 'Telefono', 'TELEFONO',
      'tel', 'mobile', 'celular', 'Celular'
    )

    const empresa = extractField(body,
      'company', 'Company', 'COMPANY',
      'empresa', 'Empresa', 'EMPRESA',
      'company_name', 'companyName', 'business',
      'nombre_empresa', 'Nombre de empresa'
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

    // Insertar el lead
    const leadData = {
      cliente_id: body.client_id,
      nombre: nombreCompleto.trim(),
      email: email,
      telefono: telefono,
      empresa: empresa,
      nombre_empresa: empresa,
      form_nombre: extractField(body, 'form_name', 'formName', 'form_id'),
      ad_nombre: extractField(body, 'ad_name', 'adName', 'ad_id'),
      campana_nombre: extractField(body, 'campaign_name', 'campaignName', 'campaign_id'),
      meta_lead_id: extractField(body, 'form_id', 'lead_id', 'leadId'),
      fuente: 'zapier',
      origen: 'Google Ads (Zapier)',
      contactado: false,
      vendido: false,
      monto_vendido: null,
      observaciones: `Datos originales recibidos: ${JSON.stringify(body)}`,
      fecha_ingreso: new Date().toISOString(),
      mes_ingreso: new Date().toISOString().substring(0, 7)
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
