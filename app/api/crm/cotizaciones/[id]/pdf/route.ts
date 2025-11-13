import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch cotización con datos relacionados
    const { data: cotizacion, error } = await supabase
      .from('cotizaciones_crm')
      .select(`
        *,
        lead:leads(id, nombre, email, telefono),
        cliente:clientes(id, nombre)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!cotizacion) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    // Generar HTML para el PDF
    const html = generatePDFHTML(cotizacion)

    // Por ahora retornamos HTML simple
    // TODO: Integrar con librería de generación de PDF (puppeteer, jsPDF, etc)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function generatePDFHTML(cotizacion: any) {
  const fecha = new Date(cotizacion.created_at).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización ${cotizacion.numero_cotizacion}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }

    .header h1 {
      font-size: 28px;
      color: #1e40af;
      margin-bottom: 10px;
    }

    .header .numero {
      font-size: 18px;
      color: #64748b;
      font-weight: 500;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    .info-label {
      font-weight: 600;
      color: #64748b;
    }

    .info-value {
      color: #334155;
    }

    .descripcion {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
      white-space: pre-wrap;
      line-height: 1.8;
    }

    .montos {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }

    .monto-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .monto-row:last-child {
      border-bottom: none;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 2px solid #2563eb;
    }

    .monto-label {
      font-weight: 600;
      color: #64748b;
    }

    .monto-value {
      font-weight: 700;
      color: #1e40af;
      font-size: 18px;
    }

    .monto-row:last-child .monto-value {
      font-size: 24px;
      color: #1e40af;
    }

    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    }

    .estado {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .estado.pendiente {
      background: #fef3c7;
      color: #92400e;
    }

    .estado.enviada {
      background: #dbeafe;
      color: #1e40af;
    }

    .estado.aceptada {
      background: #d1fae5;
      color: #065f46;
    }

    .estado.rechazada {
      background: #fee2e2;
      color: #991b1b;
    }

    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>COTIZACIÓN</h1>
    <div class="numero">${cotizacion.numero_cotizacion}</div>
  </div>

  <div class="section">
    <div class="section-title">Información General</div>
    <div class="info-grid">
      <div class="info-label">Fecha:</div>
      <div class="info-value">${fecha}</div>

      <div class="info-label">Cliente:</div>
      <div class="info-value">${cotizacion.cliente?.nombre || 'N/A'}</div>

      <div class="info-label">Contacto:</div>
      <div class="info-value">${cotizacion.lead?.nombre || 'N/A'}</div>

      ${cotizacion.lead?.email ? `
      <div class="info-label">Email:</div>
      <div class="info-value">${cotizacion.lead.email}</div>
      ` : ''}

      ${cotizacion.lead?.telefono ? `
      <div class="info-label">Teléfono:</div>
      <div class="info-value">${cotizacion.lead.telefono}</div>
      ` : ''}

      <div class="info-label">Estado:</div>
      <div class="info-value">
        <span class="estado ${cotizacion.estado}">${cotizacion.estado}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Descripción del Servicio</div>
    <div class="descripcion">
      ${cotizacion.descripcion_servicio}
    </div>
  </div>

  <div class="montos">
    ${cotizacion.monto_subtotal > 0 ? `
    <div class="monto-row">
      <div class="monto-label">Subtotal:</div>
      <div class="monto-value">$${cotizacion.monto_subtotal.toLocaleString('es-CL')}</div>
    </div>
    ` : ''}

    ${cotizacion.monto_iva > 0 ? `
    <div class="monto-row">
      <div class="monto-label">IVA (19%):</div>
      <div class="monto-value">$${cotizacion.monto_iva.toLocaleString('es-CL')}</div>
    </div>
    ` : ''}

    <div class="monto-row">
      <div class="monto-label">TOTAL:</div>
      <div class="monto-value">$${cotizacion.monto_total.toLocaleString('es-CL')}</div>
    </div>
  </div>

  <div class="footer">
    <p>Cotización generada el ${fecha}</p>
    <p>Válida por 30 días desde la fecha de emisión</p>
  </div>

  <script>
    // Auto-print on load if requested
    if (window.location.search.includes('print=true')) {
      window.print();
    }
  </script>
</body>
</html>
  `
}
