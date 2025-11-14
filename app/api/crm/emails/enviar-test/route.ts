import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail } from '@/lib/email/resend-service'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, nombre, asunto, mensaje } = body

    // Validaciones
    if (!to || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: to, asunto, mensaje' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const resultado = await sendTestEmail({
      to,
      nombre: nombre || 'Usuario',
      asunto,
      mensaje
    })

    if (resultado.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de prueba enviado correctamente',
        messageId: resultado.messageId
      })
    } else {
      return NextResponse.json(
        { error: 'Error al enviar email', details: resultado.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error en envío de test:', error)
    return NextResponse.json(
      { error: 'Error enviando email de prueba', details: error.message },
      { status: 500 }
    )
  }
}
