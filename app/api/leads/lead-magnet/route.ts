/**
 * API para capturar leads de Lead Magnets (PDFs descargables)
 * POST /api/leads/lead-magnet
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

interface LeadMagnetRequest {
  email: string
  lead_magnet: string
  source?: string
}

const LEAD_MAGNET_INFO: Record<string, { title: string, pdfUrl: string }> = {
  ebook: {
    title: 'eBook: Marketing con Datos 2025',
    pdfUrl: 'https://www.mulleryperez.cl/recursos/ebook-marketing-datos-2025.pdf'
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadMagnetRequest = await req.json()
    const { email, lead_magnet, source } = body

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const magnetInfo = LEAD_MAGNET_INFO[lead_magnet] || LEAD_MAGNET_INFO.ebook

    // Buscar cliente M&P
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('id')
      .or('nombre.ilike.%muller%,nombre.ilike.%m&p%,nombre.ilike.%myp%')
      .single()

    if (clienteData) {
      // Guardar en leads
      const leadData = {
        cliente_id: clienteData.id,
        nombre: email.split('@')[0],
        email: email,
        telefono: null,
        nombre_empresa: null,
        fuente: 'lead_magnet',
        form_nombre: `Lead Magnet: ${magnetInfo.title}`,
        observaciones: `Descargó: ${magnetInfo.title} | Fuente: ${source || 'website'}`,
        contactado: false,
        vendido: false,
        fecha_ingreso: new Date().toISOString(),
        mes_ingreso: new Date().toISOString().substring(0, 7)
      }

      const { error: leadError } = await supabase
        .from('leads')
        .insert([leadData])

      if (leadError) {
        console.error('Error guardando lead:', leadError)
      }
    }

    // Enviar email con el PDF
    try {
      await resend.emails.send({
        from: 'M&P <noreply@mulleryperez.cl>',
        to: [email],
        subject: `Tu descarga: ${magnetInfo.title}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; background: #ffffff; }
    .download-btn { display: inline-block; background: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { padding: 30px; background: #f8fafc; text-align: center; color: #64748b; font-size: 12px; }
    .tip { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">¡Tu recurso está listo!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">${magnetInfo.title}</p>
    </div>
    <div class="content">
      <p>Hola,</p>
      <p>Gracias por descargar <strong>${magnetInfo.title}</strong>. Aquí tienes el enlace directo:</p>

      <div style="text-align: center;">
        <a href="${magnetInfo.pdfUrl}" class="download-btn">
          📥 Descargar PDF
        </a>
      </div>

      <div class="tip">
        <strong>💡 Tip:</strong> Si necesitas ayuda para implementar las estrategias del documento, agenda una consultoría gratuita con nuestro equipo.
      </div>

      <p>¿Tienes preguntas? Responde este email o escríbenos por WhatsApp:</p>
      <p>
        <a href="https://wa.me/56992258137" style="color: #25D366; font-weight: bold;">
          💬 +56 9 9225 8137
        </a>
      </p>

      <p style="margin-top: 30px;">Saludos,<br><strong>Equipo M&P</strong></p>
    </div>
    <div class="footer">
      <p>Muller y Pérez Marketing<br>
      <a href="https://www.mulleryperez.cl" style="color: #3b82f6;">www.mulleryperez.cl</a></p>
    </div>
  </div>
</body>
</html>
        `
      })
    } catch (emailError) {
      console.error('Error enviando email:', emailError)
    }

    // Notificar a M&P
    try {
      await resend.emails.send({
        from: 'Lead Magnets <noreply@mulleryperez.cl>',
        to: ['contacto@mulleryperez.cl'],
        subject: `📥 Nuevo lead magnet: ${magnetInfo.title}`,
        html: `
          <h2>Nuevo Lead desde Lead Magnet</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Descargó:</strong> ${magnetInfo.title}</p>
          <p><strong>Fuente:</strong> ${source || 'Exit Intent Popup'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</p>
        `
      })
    } catch (notifyError) {
      console.error('Error notificando:', notifyError)
    }

    return NextResponse.json({
      success: true,
      message: 'Lead registrado y email enviado'
    })

  } catch (error: any) {
    console.error('Error en lead magnet:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}
