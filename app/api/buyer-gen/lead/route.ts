import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface LeadData {
  nombre: string
  email: string
  empresa?: string
  formData: {
    industry: string
    businessModel: string
    companySize: string
    mainGoal: string
    monthlyBudget: string
  }
  personas: Array<{
    nombre: string
    score: number
    motivaciones: string
    puntosDolor: string
  }>
}

const industryLabels: { [key: string]: string } = {
  tecnologia: 'Tecnologia & Software',
  salud: 'Salud & Medicina',
  educacion: 'Educacion & E-learning',
  finanzas: 'Finanzas & Fintech',
  retail: 'Retail & E-commerce',
  servicios: 'Servicios Profesionales',
  inmobiliaria: 'Inmobiliaria',
  automotriz: 'Automotriz',
  gastronomia: 'Gastronomia & Restaurantes',
  turismo: 'Turismo & Hoteleria',
  construccion: 'Construccion & Remodelacion',
  legal: 'Legal & Abogados'
}

export async function POST(request: Request) {
  try {
    const data: LeadData = await request.json()

    if (!data.nombre || !data.email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    const industryLabel = industryLabels[data.formData.industry] || data.formData.industry

    // Email a M&P
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
    .highlight { background: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
    .persona-card { background: white; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Nuevo Lead desde Buyer Gen</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">M&P Labs</p>
    </div>
    <div class="content">
      <div class="highlight">
        <strong>Un usuario genero sus buyer personas y dejo sus datos</strong>
      </div>

      <div class="field">
        <div class="label">Nombre</div>
        <div class="value">${data.nombre}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>

      ${data.empresa ? `
      <div class="field">
        <div class="label">Empresa</div>
        <div class="value">${data.empresa}</div>
      </div>
      ` : ''}

      <div class="field">
        <div class="label">Industria</div>
        <div class="value">${industryLabel}</div>
      </div>

      <div class="field">
        <div class="label">Modelo de Negocio</div>
        <div class="value">${data.formData.businessModel.toUpperCase()}</div>
      </div>

      <div class="field">
        <div class="label">Tamano Empresa</div>
        <div class="value">${data.formData.companySize}</div>
      </div>

      <div class="field">
        <div class="label">Objetivo Principal</div>
        <div class="value">${data.formData.mainGoal}</div>
      </div>

      <div class="field">
        <div class="label">Presupuesto Marketing</div>
        <div class="value">${data.formData.monthlyBudget}</div>
      </div>

      <div class="field">
        <div class="label">Buyer Personas Generadas</div>
        ${data.personas.map(p => `
          <div class="persona-card">
            <strong>${p.nombre}</strong> - Score: ${p.score}%<br>
            <small style="color: #666;">${p.motivaciones.substring(0, 100)}...</small>
          </div>
        `).join('')}
      </div>

      <div class="field">
        <div class="label">Fecha</div>
        <div class="value">${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</div>
      </div>

      <a href="mailto:${data.email}?subject=Buyer%20Personas%20-%20${encodeURIComponent(data.nombre)}" class="cta">
        Responder al Lead
      </a>
    </div>
    <div class="footer">
      Lead capturado desde Buyer Gen - M&P Labs
    </div>
  </div>
</body>
</html>
    `

    const { error: emailError } = await resend.emails.send({
      from: 'M&P Labs <noreply@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      reply_to: data.email,
      subject: `Nuevo Lead Buyer Gen: ${data.nombre} - ${industryLabel}`,
      html: emailHtml
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
    }

    // Email de confirmacion al lead
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
    .cta { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">M&P Labs</div>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Buyer Gen - Generador de Buyer Personas</p>
    </div>
    <div class="content">
      <h2>Hola ${data.nombre},</h2>

      <p>Gracias por usar <strong>Buyer Gen</strong>. Esperamos que tus buyer personas te sean utiles para tu estrategia de marketing.</p>

      <div class="highlight">
        <strong>Generaste ${data.personas.length} buyer personas para ${industryLabel}</strong>
      </div>

      <p>Si quieres llevar tu estrategia al siguiente nivel, te invitamos a agendar una consultoria gratuita con nuestro equipo.</p>

      <div style="text-align: center;">
        <a href="https://wa.me/56992258137?text=${encodeURIComponent(`Hola! Acabo de usar Buyer Gen para ${industryLabel} y me gustaria una consultoria`)}" class="cta">
          Agendar Consultoria Gratis
        </a>
      </div>

      <div class="contact">
        <strong>Contactanos:</strong><br><br>
        WhatsApp: <a href="https://wa.me/56992258137">+56 9 9225 8137</a><br>
        Email: <a href="mailto:contacto@mulleryperez.cl">contacto@mulleryperez.cl</a><br>
        Web: <a href="https://www.mulleryperez.cl">www.mulleryperez.cl</a>
      </div>

      <p style="margin-top: 20px;">Saludos,</p>
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
      subject: 'Tus Buyer Personas - M&P Labs',
      html: confirmationHtml
    })

    return NextResponse.json({
      success: true,
      message: 'Lead guardado y emails enviados'
    })

  } catch (error) {
    console.error('Error processing buyer gen lead:', error)
    return NextResponse.json(
      { error: 'Error procesando el lead' },
      { status: 500 }
    )
  }
}
