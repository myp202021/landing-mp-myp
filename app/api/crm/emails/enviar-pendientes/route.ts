import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendLeadWelcomeEmail } from '@/lib/email/resend-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Obtener emails pendientes (máximo 100 por ejecución)
    const { data: emails, error } = await supabase
      .from('emails_enviados')
      .select('*')
      .eq('estado', 'pendiente')
      .limit(100)

    if (error) throw error

    if (!emails || emails.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay emails pendientes',
        enviados: 0
      })
    }

    let enviados = 0
    let errores = 0

    // Enviar cada email
    for (const email of emails) {
      try {
        const resultado = await sendLeadWelcomeEmail({
          to: email.destinatario_email,
          nombre: email.destinatario_nombre || 'Cliente',
          asunto: email.asunto,
          mensaje: email.mensaje
        })

        if (resultado.success) {
          // Actualizar estado a enviado
          await supabase
            .from('emails_enviados')
            .update({
              estado: 'enviado',
              proveedor_message_id: resultado.messageId,
              enviado_en: new Date().toISOString()
            })
            .eq('id', email.id)

          enviados++
        } else {
          // Marcar como error
          await supabase
            .from('emails_enviados')
            .update({
              estado: 'error',
              error_mensaje: resultado.error
            })
            .eq('id', email.id)

          errores++
        }
      } catch (err: any) {
        console.error(`Error enviando email ${email.id}:`, err)

        await supabase
          .from('emails_enviados')
          .update({
            estado: 'error',
            error_mensaje: err.message
          })
          .eq('id', email.id)

        errores++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Procesados ${emails.length} emails`,
      enviados,
      errores
    })
  } catch (error: any) {
    console.error('Error procesando emails:', error)
    return NextResponse.json(
      { error: 'Error procesando emails', details: error.message },
      { status: 500 }
    )
  }
}
