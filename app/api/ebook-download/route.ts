import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { guardarLeadMP } from '@/lib/crm/guardar-lead-mp';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company } = body;

    // Validación básica
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const companyText = company || 'No especificada';

    // 1. Guardar en Google Sheets via Apps Script webhook
    // TEMPORALMENTE DESHABILITADO - El webhook de Google Apps Script no responde desde servidores externos
    // TODO: Implementar con Zapier/Make.com o solución alternativa
    /*
    try {
      const sheetsResponse = await fetch(
        process.env.GOOGLE_APPS_SCRIPT_URL || '',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sheet: 'Leads',
            values: [timestamp, name, email, companyText, 'Ebook Marketing Datos 2025'],
          }),
        }
      );

      if (!sheetsResponse.ok) {
        const errorText = await sheetsResponse.text();
        console.error('Error guardando en Google Sheets:', errorText);
      } else {
        const result = await sheetsResponse.json();
        console.log('✅ Lead guardado en Google Sheets:', result);
      }
    } catch (sheetsError) {
      console.error('Error con Google Sheets:', sheetsError);
      // No fallar si Google Sheets falla
    }
    */
    console.log('📝 Lead capturado:', { name, email, companyText });

    // Guardar en el CRM (cliente M&P). Si falla, alerta por correo; no bloquea la descarga.
    await guardarLeadMP({
      nombre: name,
      email,
      empresa: company || null,
      fuente: 'ebook_download',
      form_nombre: 'eBook: Marketing con Datos 2025',
      observaciones: 'Descargó eBook Marketing con Datos 2025 desde /recursos/ebook-marketing-datos-2025',
    }, 'eBook (/api/ebook-download)');

    // 2. Enviar email de notificación a contacto@mulleryperez.com
    try {
      await resend.emails.send({
        from: 'Muller y Pérez <noreply@mulleryperez.cl>',
        to: 'contacto@mulleryperez.cl',
        subject: '📥 Nueva descarga: Ebook Marketing de Datos 2025',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Nueva descarga de Ebook</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Empresa:</strong> ${companyText}</p>
              <p style="margin: 10px 0;"><strong>Recurso:</strong> Ebook Marketing de Datos 2025</p>
              <p style="margin: 10px 0;"><strong>Fecha:</strong> ${new Date(timestamp).toLocaleString('es-CL')}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Este lead descargó el ebook desde www.mulleryperez.cl/recursos/ebook-marketing-datos-2025
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar si el email falla
    }

    // 3. Enviar email de confirmación al usuario
    try {
      await resend.emails.send({
        from: 'Muller y Pérez <noreply@mulleryperez.cl>',
        to: email,
        subject: '📚 Tu Ebook: La Guía Definitiva del Marketing de Datos 2025',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">¡Gracias ${name}!</h1>
            </div>

            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Tu ebook <strong>"La Guía Definitiva del Marketing de Datos 2025"</strong> ya se está descargando.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Si no se descargó automáticamente, puedes descargarlo haciendo clic en el botón de abajo:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.mulleryperez.cl/recursos/ebook-marketing-datos-2025.pdf"
                   style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  📥 Descargar Ebook
                </a>
              </div>

              <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af; font-weight: 600;">
                  💡 ¿Necesitas ayuda para implementar estas estrategias?
                </p>
                <p style="margin: 10px 0 0 0; color: #1e40af;">
                  Agenda una consultoría gratuita con nuestro equipo:
                  <a href="https://wa.me/56992258137?text=Hola%2C%20descargué%20el%20ebook%20y%20me%20gustaría%20una%20consultoría"
                     style="color: #2563eb; font-weight: bold;">
                    WhatsApp
                  </a>
                </p>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Saludos,<br>
                <strong>Equipo Muller y Pérez</strong><br>
                Agencia de Marketing Digital
              </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>© 2025 Muller y Pérez. Todos los derechos reservados.</p>
              <p>
                <a href="https://www.mulleryperez.cl" style="color: #2563eb; text-decoration: none;">www.mulleryperez.cl</a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError);
      // No fallar si el email falla
    }

    return NextResponse.json({
      success: true,
      message: 'Descarga iniciada exitosamente',
    });

  } catch (error) {
    console.error('Error en API ebook-download:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}
