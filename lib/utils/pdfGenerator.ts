import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface CotizacionItem {
  descripcion: string
  cantidad: number
  precio?: number
  precio_unitario?: number
}

interface CotizacionData {
  id: number
  nombre_proyecto: string
  cliente_nombre?: string
  cliente_email?: string
  cliente_telefono?: string
  items: CotizacionItem[]
  subtotal: number
  descuento?: number
  total: number
  moneda?: string
  notas?: string
  vigencia_dias?: number
  creado_en: string
  logo_url?: string | null
}

/**
 * Convierte una URL de imagen a base64
 */
async function imageUrlToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } else {
        reject(new Error('No se pudo obtener contexto del canvas'))
      }
    }
    img.onerror = () => reject(new Error('Error cargando imagen'))
    img.src = url
  })
}

export async function generarPDFCotizacion(cotizacion: CotizacionData) {
  const doc = new jsPDF()

  // Colores M&P - Usando colores del template HTML (#4A90E2)
  const azulPrincipal = {r: 74, g: 144, b: 226} // #4A90E2
  const azulOscuro = {r: 30, g: 58, b: 138} // #1E3A8A
  const grisTexto = {r: 51, g: 51, b: 51} // #333
  const grisFondo = {r: 248, g: 249, b: 250} // #f8f9fa

  let yPos = 20

  // HEADER - Fondo blanco con borde azul (estilo más profesional)
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 210, 60, 'F') // Aumentado a 60 para dar espacio al logo

  // Línea decorativa superior
  doc.setFillColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.rect(0, 0, 210, 3, 'F')

  // Si hay logo del cliente, lo mostramos en la esquina superior izquierda
  if (cotizacion.logo_url) {
    try {
      const logoBase64 = await imageUrlToBase64(cotizacion.logo_url)
      // Logo del cliente en esquina superior izquierda
      doc.addImage(logoBase64, 'PNG', 15, 8, 40, 15) // x, y, ancho, alto
    } catch (error) {
      console.error('Error cargando logo del cliente:', error)
      // Continuar sin logo si hay error
    }
  }

  // Título principal (ajustado para dar espacio al logo)
  doc.setTextColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPUESTA COMERCIAL', 105, 20, { align: 'center' })

  doc.setFontSize(16)
  doc.setTextColor(grisTexto.r, grisTexto.g, grisTexto.b)
  doc.text('MÜLLER & PÉREZ', 105, 30, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Marketing Digital & Desarrollo Web', 105, 36, { align: 'center' })
  doc.text('www.mulleryperez.cl', 105, 42, { align: 'center' })

  const fecha = new Date(cotizacion.creado_en).toLocaleDateString('es-CL')

  yPos = 70 // Aumentado para dar espacio al header expandido

  // Información de la cotización (estilo meta-info)
  doc.setTextColor(102, 102, 102) // #666
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  const metaX = 195
  doc.text(`N°: ${cotizacion.id}`, metaX, yPos, { align: 'right' })
  doc.text(`Fecha: ${fecha}`, metaX, yPos + 5, { align: 'right' })
  if (cotizacion.vigencia_dias) {
    const fechaVencimiento = new Date(cotizacion.creado_en)
    fechaVencimiento.setDate(fechaVencimiento.getDate() + cotizacion.vigencia_dias)
    doc.text(`Válida hasta: ${fechaVencimiento.toLocaleDateString('es-CL')}`, metaX, yPos + 10, { align: 'right' })
  }

  yPos += 20

  // DATOS DEL CLIENTE - Estilo caja (client-box)
  doc.setFillColor(grisFondo.r, grisFondo.g, grisFondo.b)
  doc.rect(15, yPos, 180, 25, 'F')

  // Borde izquierdo azul
  doc.setFillColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.rect(15, yPos, 4, 25, 'F')

  doc.setTextColor(grisTexto.r, grisTexto.g, grisTexto.b)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:', 22, yPos + 8)

  doc.setFont('helvetica', 'normal')
  let clienteY = yPos + 8
  if (cotizacion.cliente_nombre) {
    doc.text(cotizacion.cliente_nombre, 45, clienteY)
  }
  if (cotizacion.cliente_email) {
    doc.text(`Email: ${cotizacion.cliente_email}`, 22, clienteY + 6)
  }
  if (cotizacion.cliente_telefono) {
    doc.text(`Tel: ${cotizacion.cliente_telefono}`, 22, clienteY + 12)
  }

  yPos += 35

  // NOMBRE DEL PROYECTO - Título con estilo section-title
  doc.setTextColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(cotizacion.nombre_proyecto.toUpperCase(), 15, yPos)

  // Línea decorativa debajo del título
  doc.setDrawColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.setLineWidth(1)
  doc.line(15, yPos + 2, 195, yPos + 2)

  yPos += 10

  // TABLA DE ITEMS
  const tableData = cotizacion.items.map((item: CotizacionItem) => {
    const precioUnitario = item.precio || item.precio_unitario || 0
    return [
      item.descripcion,
      item.cantidad.toString(),
      `$${precioUnitario.toLocaleString('es-CL')}`,
      `$${(item.cantidad * precioUnitario).toLocaleString('es-CL')}`
    ]
  })

  autoTable(doc, {
    startY: yPos,
    head: [['Descripción', 'Cantidad', 'Precio Unitario', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [azulPrincipal.r, azulPrincipal.g, azulPrincipal.b],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      textColor: [grisTexto.r, grisTexto.g, grisTexto.b],
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [grisFondo.r, grisFondo.g, grisFondo.b]
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { halign: 'center', cellWidth: 25 },
      2: { halign: 'right', cellWidth: 30 },
      3: { halign: 'right', cellWidth: 30 }
    },
    margin: { left: 15, right: 15 }
  })

  // @ts-ignore - autoTable modifica el objeto doc
  yPos = doc.lastAutoTable.finalY + 10

  // SUBTOTAL, DESCUENTO, TOTAL
  const xLabel = 130
  const xValor = 195

  doc.setTextColor(grisTexto.r, grisTexto.g, grisTexto.b)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  doc.text('Subtotal:', xLabel, yPos, { align: 'right' })
  doc.text(`$${cotizacion.subtotal.toLocaleString('es-CL')}`, xValor, yPos, { align: 'right' })
  yPos += 7

  if (cotizacion.descuento && cotizacion.descuento > 0) {
    doc.text('Descuento:', xLabel, yPos, { align: 'right' })
    doc.text(`-$${cotizacion.descuento.toLocaleString('es-CL')}`, xValor, yPos, { align: 'right' })
    yPos += 7
  }

  // Línea separadora
  doc.setDrawColor(azulOscuro.r, azulOscuro.g, azulOscuro.b)
  doc.setLineWidth(0.5)
  doc.line(xLabel - 65, yPos, xValor, yPos)
  yPos += 7

  // TOTAL - Resaltado
  doc.setFillColor(227, 242, 253) // #e3f2fd
  doc.rect(xLabel - 65, yPos - 5, 70, 10, 'F')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.text('TOTAL:', xLabel, yPos, { align: 'right' })
  doc.text(`$${cotizacion.total.toLocaleString('es-CL')} ${cotizacion.moneda || 'CLP'}`, xValor, yPos, { align: 'right' })

  yPos += 15

  // NOTAS
  if (cotizacion.notas) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(grisTexto.r, grisTexto.g, grisTexto.b)
    doc.text('NOTAS ADICIONALES', 15, yPos)

    yPos += 7
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    const lineasNotas = doc.splitTextToSize(cotizacion.notas, 180)
    doc.text(lineasNotas, 15, yPos)
    yPos += (lineasNotas.length * 5) + 10
  }

  // FOOTER - Estilo profesional
  const footerY = 280

  // Línea decorativa azul
  doc.setFillColor(azulPrincipal.r, azulPrincipal.g, azulPrincipal.b)
  doc.rect(0, footerY, 210, 3, 'F')

  // Fondo gris claro
  doc.setFillColor(248, 249, 250)
  doc.rect(0, footerY + 3, 210, 14, 'F')

  doc.setTextColor(102, 102, 102) // #666
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('"Menos improvisación. Más performance."', 105, footerY + 8, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('Müller & Pérez - Marketing Digital | contacto@mulleryperez.cl | www.mulleryperez.cl', 105, footerY + 13, { align: 'center' })

  // Guardar PDF
  const nombreArchivo = `Cotizacion_${cotizacion.id}_${cotizacion.nombre_proyecto.replace(/\s+/g, '_')}.pdf`
  doc.save(nombreArchivo)
}
