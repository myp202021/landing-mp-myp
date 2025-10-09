import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, empresa, email, telefono, solicitud, destinatario } = body

    // Validar campos requeridos
    if (!nombre || !empresa || !email || !telefono || !solicitud) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Crear el contenido del email (texto plano)
    const emailText = `
NUEVA SOLICITUD DE CONTACTO - PREDICTOR 2025

Nombre: ${nombre}
Empresa: ${empresa}
Email: ${email}
Teléfono: ${telefono}

Solicitud:
${solicitud}

---
Enviado desde: Predictor 2025 - Muller y Pérez
Fecha: ${new Date().toLocaleString('es-CL')}
    `.trim()

    // Crear HTML mejorado para el email
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #4b5563; display: block; margin-bottom: 5px; }
    .value { color: #111827; font-size: 16px; }
    .solicitud-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 10px; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">✨ Nueva Solicitud - Predictor 2025</h1>
    </div>

    <div class="content">
      <div class="field">
        <span class="label">👤 Nombre</span>
        <span class="value">${nombre}</span>
      </div>

      <div class="field">
        <span class="label">🏢 Empresa</span>
        <span class="value">${empresa}</span>
      </div>

      <div class="field">
        <span class="label">📧 Email</span>
        <span class="value"><a href="mailto:${email}">${email}</a></span>
      </div>

      <div class="field">
        <span class="label">📱 Teléfono</span>
        <span class="value"><a href="tel:${telefono}">${telefono}</a></span>
      </div>

      <div class="field">
        <span class="label">💬 Solicitud</span>
        <div class="solicitud-box">
          ${solicitud.replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>

    <div class="footer">
      Enviado desde <strong>Predictor 2025</strong> - Muller y Pérez<br>
      ${new Date().toLocaleString('es-CL')}
    </div>
  </div>
</body>
</html>
    `.trim()

    console.log('📧 Procesando solicitud de contacto...')
    console.log(`Nombre: ${nombre}, Empresa: ${empresa}`)

    const timestamp = new Date().toISOString()

    // 1. Guardar en Google Sheets (pestaña "Contactos")
    try {
      const sheetsResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Contactos!A:F:append?valueInputOption=USER_ENTERED&key=${process.env.GOOGLE_SHEETS_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[timestamp, nombre, empresa, email, telefono, solicitud]],
          }),
        }
      );

      if (!sheetsResponse.ok) {
        const errorText = await sheetsResponse.text();
        console.error('Error guardando en Google Sheets:', errorText);
      } else {
        console.log('✅ Contacto guardado en Google Sheets');
      }
    } catch (sheetsError) {
      console.error('Error con Google Sheets:', sheetsError);
      // No fallar si Google Sheets falla
    }

    // Verificar si hay API key configurada
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no configurada. Email NO enviado.')
      console.log('📝 Contenido del email:')
      console.log(emailText)

      return NextResponse.json({
        success: true,
        message: 'Solicitud recibida (email no enviado - API key pendiente)',
        warning: 'Configura RESEND_API_KEY para enviar emails'
      })
    }

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: 'Formulario M&P <noreply@mulleryperez.cl>',
      to: destinatario || 'contacto@mulleryperez.com',
      subject: `🎯 Nueva solicitud: ${empresa} - ${nombre}`,
      text: emailText,
      html: emailHtml,
      reply_to: email // Para que puedas responder directo al cliente
    })

    if (error) {
      console.error('❌ Error enviando email:', error)
      return NextResponse.json(
        { error: 'Error al enviar el email', details: error },
        { status: 500 }
      )
    }

    console.log('✅ Email enviado exitosamente:', data)

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      emailId: data?.id
    })

  } catch (error) {
    console.error('❌ Error procesando solicitud de contacto:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
