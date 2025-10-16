import { NextRequest, NextResponse } from 'next/server'

/**
 * Facebook Data Deletion Callback
 * Este endpoint es requerido por Facebook para procesar solicitudes de eliminación de datos
 * cuando un usuario elimina la app desde su configuración de Facebook
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Facebook envía un signed_request
    const signedRequest = body.signed_request

    if (!signedRequest) {
      return NextResponse.json(
        { error: 'Missing signed_request' },
        { status: 400 }
      )
    }

    // TODO: Decodificar el signed_request y verificar la firma
    // const [encodedSig, payload] = signedRequest.split('.')
    // const data = JSON.parse(Buffer.from(payload, 'base64').toString())
    // const userId = data.user_id

    // Por ahora, solo logueamos la solicitud
    console.log('📧 Data deletion request received:', {
      timestamp: new Date().toISOString(),
      signedRequest: signedRequest.substring(0, 50) + '...',
    })

    // TODO: Implementar lógica real de eliminación:
    // 1. Decodificar signed_request
    // 2. Extraer user_id
    // 3. Eliminar datos del usuario de Supabase
    // 4. Enviar confirmación por email

    // Crear un código de confirmación único
    const confirmationCode = `del_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Responder a Facebook con la URL de confirmación
    return NextResponse.json({
      url: `https://www.mulleryperez.cl/data-deletion?confirmation_code=${confirmationCode}`,
      confirmation_code: confirmationCode,
    })
  } catch (error) {
    console.error('❌ Error processing data deletion request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Permitir OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
