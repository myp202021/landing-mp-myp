import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'M&P CRM <crm@mulleryperez.cl>'
}: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html
    })

    if (error) {
      console.error('Error enviando email con Resend:', error)
      throw new Error(error.message)
    }

    return {
      success: true,
      messageId: data?.id,
      provider: 'resend'
    }
  } catch (error: any) {
    console.error('Excepción enviando email:', error)
    return {
      success: false,
      error: error.message,
      provider: 'resend'
    }
  }
}

export async function sendLeadWelcomeEmail({
  to,
  nombre,
  asunto,
  mensaje
}: {
  to: string
  nombre: string
  asunto: string
  mensaje: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9fafb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f3f4f6; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; }
    p { margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">M&P - Müller y Pérez</h1>
      <p style="margin: 5px 0; font-size: 14px;">Marketing y Performance</p>
    </div>
    <div class="content">
      <p>Hola ${nombre},</p>
      ${mensaje.split('\n').map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="footer">
      <p>Este es un email automático. Por favor no respondas a este correo.</p>
      <p>&copy; 2025 M&P - Müller y Pérez. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({ to, subject: asunto, html })
}

export async function sendTestEmail({
  to,
  nombre,
  asunto,
  mensaje
}: {
  to: string
  nombre: string
  asunto: string
  mensaje: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .test-banner { background: #f59e0b; color: white; padding: 15px; text-align: center; font-weight: bold; border-radius: 8px 8px 0 0; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f3f4f6; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; }
    .test-info { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
    p { margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="test-banner">
      🧪 EMAIL DE PRUEBA - NO ES UN ENVÍO REAL
    </div>
    <div class="header">
      <h1 style="margin: 0;">M&P - Müller y Pérez</h1>
      <p style="margin: 5px 0; font-size: 14px;">Marketing y Performance</p>
    </div>
    <div class="content">
      <div class="test-info">
        <strong>Información de prueba:</strong><br>
        Este es un preview de cómo se verá el email cuando se envíe a tus leads.<br>
        Las variables como {nombre}, {apellido}, etc. serán reemplazadas con los datos reales del lead.
      </div>
      <p>Hola ${nombre},</p>
      ${mensaje.split('\n').map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="footer">
      <p>Este es un email automático. Por favor no respondas a este correo.</p>
      <p>&copy; 2025 M&P - Müller y Pérez. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({ to, subject: `[PRUEBA] ${asunto}`, html })
}
