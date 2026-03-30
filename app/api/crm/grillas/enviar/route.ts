import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export async function POST(req: NextRequest) {
  try {
    const { grilla_id } = await req.json()

    if (!grilla_id) {
      return NextResponse.json({ error: 'grilla_id es requerido' }, { status: 400 })
    }

    // Get grilla + client data
    const { data: grilla, error: grillaError } = await supabase
      .from('grillas_contenido')
      .select('*, clientes(nombre, contacto_email, rubro)')
      .eq('id', grilla_id)
      .single()

    if (grillaError || !grilla) {
      return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
    }

    const cliente = grilla.clientes as { nombre: string; contacto_email: string; rubro: string }
    if (!cliente?.contacto_email) {
      return NextResponse.json({ error: 'El cliente no tiene email de contacto configurado' }, { status: 400 })
    }

    // Update estado to enviado
    const { error: updateError } = await supabase
      .from('grillas_contenido')
      .update({ estado: 'enviado', updated_at: new Date().toISOString() })
      .eq('id', grilla_id)

    if (updateError) throw updateError

    // Send email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mulleryperez.cl'
    const publicUrl = `${siteUrl}/grilla/${grilla.token_publico}`
    const mesNombre = MESES[grilla.mes]
    const posts = grilla.posts as Array<{ plataforma: string }>
    const totalPosts = posts.length
    const linkedin = posts.filter((p: { plataforma: string }) => p.plataforma === 'LinkedIn').length
    const igfb = totalPosts - linkedin

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'M&P Grillas <noreply@mulleryperez.cl>',
      to: cliente.contacto_email,
      cc: 'contacto@mulleryperez.cl',
      subject: `Tu grilla de contenido ${mesNombre} ${grilla.anio} está lista — Muller y Pérez`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Grilla de Contenido</h1>
            <p style="color: #93c5fd; margin: 8px 0 0 0; font-size: 14px;">${mesNombre} ${grilla.anio} — ${cliente.nombre}</p>
          </div>
          <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="color: #334155; font-size: 16px; margin: 0 0 16px 0;">
              Hola ${cliente.nombre},
            </p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              Tu grilla de contenido para <strong>${mesNombre} ${grilla.anio}</strong> está lista para revisión.
              Incluye <strong>${totalPosts} publicaciones</strong> (${linkedin} LinkedIn + ${igfb} Instagram/Facebook).
            </p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              Puedes revisar cada publicación y dejar comentarios directamente en el link.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${publicUrl}"
                 style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                Ver Grilla →
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
              Este link es privado y exclusivo para ti. No requiere contraseña.
            </p>
          </div>
          <div style="background: #1e293b; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Muller y Pérez — Performance Marketing · mulleryperez.cl
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      email_sent_to: cliente.contacto_email,
      public_url: publicUrl,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('POST enviar grilla error:', message)
    return NextResponse.json({ error: 'Error al enviar grilla', details: message }, { status: 500 })
  }
}
