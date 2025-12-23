import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface LeadData {
  nombre: string
  empresa?: string
  email: string
  telefono?: string
  interes?: string
  sessionId?: string
  source?: string
}

export async function POST(request: Request) {
  try {
    const data: LeadData = await request.json()

    // Validar datos mínimos
    if (!data.nombre || !data.email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // 1. Guardar en Supabase (actualizar sesión si existe)
    if (data.sessionId) {
      await supabaseAdmin
        .from('chat_sessions')
        .update({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono || null,
          empresa: data.empresa || null,
          intent_score: 'alto',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.sessionId)
    }

    // 2. Enviar email a M&P
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #1e3a8a; }
    .value { margin-top: 5px; }
    .footer { background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Nuevo Lead desde ChatBot</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">mulleryperez.cl</p>
    </div>
    <div class="content">
      <div class="highlight">
        <strong>Un visitante quiere agendar una reunion</strong>
      </div>

      <div class="field">
        <div class="label">Nombre</div>
        <div class="value">${data.nombre}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>

      ${data.telefono ? `
      <div class="field">
        <div class="label">Telefono</div>
        <div class="value"><a href="tel:${data.telefono}">${data.telefono}</a></div>
      </div>
      ` : ''}

      ${data.empresa ? `
      <div class="field">
        <div class="label">Empresa</div>
        <div class="value">${data.empresa}</div>
      </div>
      ` : ''}

      ${data.interes ? `
      <div class="field">
        <div class="label">Interes</div>
        <div class="value">${data.interes}</div>
      </div>
      ` : ''}

      <div class="field">
        <div class="label">Fuente</div>
        <div class="value">ChatBot Landing M&P</div>
      </div>

      <div class="field">
        <div class="label">Fecha</div>
        <div class="value">${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</div>
      </div>

      <a href="mailto:${data.email}?subject=Reunion%20M%26P%20-%20${encodeURIComponent(data.nombre)}" class="cta">
        Responder al Lead
      </a>
    </div>
    <div class="footer">
      Lead capturado automaticamente por ChatBot M&P
    </div>
  </div>
</body>
</html>
    `

    const { error: emailError } = await resend.emails.send({
      from: 'M&P ChatBot <noreply@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      replyTo: data.email,
      subject: `Nuevo Lead ChatBot: ${data.nombre}${data.empresa ? ` - ${data.empresa}` : ''}`,
      html: emailHtml
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      // No fallar si el email falla, el lead ya está guardado
    }

    // 3. Enviar confirmación al lead
    const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; }
    .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #64748b; }
    .highlight { background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .contact { margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">M&P</div>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Muller & Perez Marketing</p>
    </div>
    <div class="content">
      <h2>Hola ${data.nombre},</h2>

      <p>Gracias por tu interes en M&P. Hemos recibido tu solicitud para agendar una reunion.</p>

      <div class="highlight">
        <strong>Un ejecutivo te contactara dentro de las proximas 24 horas habiles</strong>
      </div>

      <p>En la reunion analizaremos tu caso y te daremos recomendaciones personalizadas para potenciar tu presencia digital.</p>

      <div class="contact">
        <strong>Mientras tanto, puedes contactarnos directamente:</strong><br><br>
        📱 WhatsApp: <a href="https://wa.me/56992258137">+56 9 9225 8137</a><br>
        📧 Email: <a href="mailto:contacto@mulleryperez.cl">contacto@mulleryperez.cl</a><br>
        🌐 Web: <a href="https://www.mulleryperez.cl">www.mulleryperez.cl</a>
      </div>

      <p style="margin-top: 20px;">¡Nos vemos pronto!</p>
      <p><strong>Equipo M&P</strong></p>
    </div>
    <div class="footer">
      Muller & Perez Marketing<br>
      Badajoz 100, Of 523, Las Condes, Santiago<br>
      <a href="https://www.mulleryperez.cl">www.mulleryperez.cl</a>
    </div>
  </div>
</body>
</html>
    `

    await resend.emails.send({
      from: 'M&P <noreply@mulleryperez.cl>',
      to: [data.email],
      subject: 'Recibimos tu solicitud - M&P',
      html: confirmationHtml
    })

    return NextResponse.json({
      success: true,
      message: 'Lead guardado y emails enviados'
    })

  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { error: 'Error procesando el lead' },
      { status: 500 }
    )
  }
}
