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
}

export function generarPDFCotizacion(cotizacion: CotizacionData) {
  const doc = new jsPDF()

  // Colores M&P
  const azulOscuro = {r: 30, g: 58, b: 138} // #1E3A8A
  const azulClaro = {r: 59, g: 130, b: 246} // #3B82F6
  const grisTexto = {r: 55, g: 65, b: 81} // #374151

  let yPos = 20

  // HEADER - Logo y datos de empresa
  doc.setFillColor(azulOscuro.r, azulOscuro.g, azulOscuro.b)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('MULLER & PÉREZ', 15, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Marketing Digital & Desarrollo Web', 15, 27)
  doc.text('www.mulleryperez.cl', 15, 32)

  // Número de cotización (alineado a la derecha)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`COTIZACIÓN #${cotizacion.id}`, 210 - 15, 20, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const fecha = new Date(cotizacion.creado_en).toLocaleDateString('es-CL')
  doc.text(`Fecha: ${fecha}`, 210 - 15, 27, { align: 'right' })

  if (cotizacion.vigencia_dias) {
    const fechaVencimiento = new Date(cotizacion.creado_en)
    fechaVencimiento.setDate(fechaVencimiento.getDate() + cotizacion.vigencia_dias)
    doc.text(`Válida hasta: ${fechaVencimiento.toLocaleDateString('es-CL')}`, 210 - 15, 32, { align: 'right' })
  }

  yPos = 50

  // DATOS DEL CLIENTE
  doc.setTextColor(grisTexto.r, grisTexto.g, grisTexto.b)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DEL CLIENTE', 15, yPos)

  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  if (cotizacion.cliente_nombre) {
    doc.text(`Cliente: ${cotizacion.cliente_nombre}`, 15, yPos)
    yPos += 6
  }

  if (cotizacion.cliente_email) {
    doc.text(`Email: ${cotizacion.cliente_email}`, 15, yPos)
    yPos += 6
  }

  if (cotizacion.cliente_telefono) {
    doc.text(`Teléfono: ${cotizacion.cliente_telefono}`, 15, yPos)
    yPos += 6
  }

  yPos += 5

  // NOMBRE DEL PROYECTO
  doc.setFillColor(azulClaro.r, azulClaro.g, azulClaro.b)
  doc.rect(15, yPos, 180, 10, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(cotizacion.nombre_proyecto.toUpperCase(), 20, yPos + 7)

  yPos += 15

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
      fillColor: [azulOscuro.r, azulOscuro.g, azulOscuro.b],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      textColor: [grisTexto.r, grisTexto.g, grisTexto.b],
      fontSize: 9
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

  // TOTAL
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(azulOscuro.r, azulOscuro.g, azulOscuro.b)
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

  // FOOTER
  const footerY = 280
  doc.setFillColor(245, 245, 245)
  doc.rect(0, footerY, 210, 17, 'F')

  doc.setTextColor(grisTexto.r, grisTexto.g, grisTexto.b)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Muller & Pérez - Marketing Digital', 105, footerY + 6, { align: 'center' })
  doc.text('contacto@mulleryperez.cl | +56 9 XXXX XXXX | www.mulleryperez.cl', 105, footerY + 11, { align: 'center' })

  // Guardar PDF
  const nombreArchivo = `Cotizacion_${cotizacion.id}_${cotizacion.nombre_proyecto.replace(/\s+/g, '_')}.pdf`
  doc.save(nombreArchivo)
}
