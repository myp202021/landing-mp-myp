/**
 * UTILIDAD: Exportación de predicciones a PDF
 *
 * Genera un PDF profesional con los resultados de la predicción
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface DatosPDF {
  // Input
  presupuesto: number
  ticket: number
  industria: string
  tipoCliente: string
  tasaCierre: number
  cicloVenta: string
  margenBruto: number

  // Output
  conversiones: number
  revenue: number
  roas: number
  cpa: number

  // Escenarios
  escenarios: {
    conservador: { ventas: number, revenue: number, roas: number }
    base: { ventas: number, revenue: number, roas: number }
    agresivo: { ventas: number, revenue: number, roas: number }
  }

  // Metadata
  fecha: string
}

export async function generarPDF(datos: DatosPDF): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Configuración de fuentes
  pdf.setFont('helvetica')

  // ==========================================
  // PÁGINA 1: PORTADA + RESUMEN EJECUTIVO
  // ==========================================

  // Header - Logo M&P (placeholder)
  pdf.setFillColor(99, 102, 241) // Indigo-600
  pdf.rect(0, 0, pageWidth, 40, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.text('Muller y Pérez', 20, 20)
  pdf.setFontSize(12)
  pdf.text('Marketing & Performance', 20, 28)

  // Título
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(20)
  pdf.text('Predicción de Performance', 20, 55)
  pdf.setFontSize(12)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Generado: ${datos.fecha}`, 20, 62)

  // Datos de entrada (cuadro)
  pdf.setFillColor(245, 247, 250)
  pdf.roundedRect(20, 75, pageWidth - 40, 50, 3, 3, 'F')

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(11)
  pdf.text('DATOS DE ENTRADA', 25, 85)

  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  pdf.text(`Industria: ${datos.industria}`, 25, 95)
  pdf.text(`Tipo: ${datos.tipoCliente}`, 25, 102)
  pdf.text(`Presupuesto: $${datos.presupuesto.toLocaleString('es-CL')} CLP/mes`, 25, 109)
  pdf.text(`Ticket promedio: $${datos.ticket.toLocaleString('es-CL')} CLP`, 25, 116)
  pdf.text(`Tasa de cierre: ${datos.tasaCierre}%`, pageWidth - 85, 95)
  pdf.text(`Ciclo de venta: ${datos.cicloVenta}`, pageWidth - 85, 102)
  pdf.text(`Margen bruto: ${datos.margenBruto}%`, pageWidth - 85, 109)

  // Métricas principales (destacadas)
  const metricsY = 140

  // KPI 1: Conversiones
  pdf.setFillColor(99, 102, 241)
  pdf.roundedRect(20, metricsY, 50, 30, 3, 3, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.text('CONVERSIONES/MES', 25, metricsY + 8)
  pdf.setFontSize(16)
  pdf.text(String(datos.conversiones), 25, metricsY + 20)

  // KPI 2: Revenue
  pdf.setFillColor(16, 185, 129)
  pdf.roundedRect(75, metricsY, 50, 30, 3, 3, 'F')
  pdf.setFontSize(8)
  pdf.text('REVENUE MENSUAL', 80, metricsY + 8)
  pdf.setFontSize(12)
  pdf.text(`$${(datos.revenue / 1000000).toFixed(1)}M`, 80, metricsY + 20)

  // KPI 3: ROAS
  pdf.setFillColor(139, 92, 246)
  pdf.roundedRect(130, metricsY, 50, 30, 3, 3, 'F')
  pdf.setFontSize(8)
  pdf.text('ROAS ESPERADO', 135, metricsY + 8)
  pdf.setFontSize(16)
  pdf.text(`${datos.roas.toFixed(1)}x`, 135, metricsY + 20)

  // Escenarios
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.text('ESCENARIOS DE PROYECCIÓN', 20, 185)

  const escenariosY = 195
  const escenarioWidth = (pageWidth - 50) / 3

  // Conservador
  pdf.setFillColor(251, 191, 36)
  pdf.roundedRect(20, escenariosY, escenarioWidth, 40, 3, 3, 'F')
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Conservador', 25, escenariosY + 8)
  pdf.setFontSize(8)
  pdf.text(`${datos.escenarios.conservador.ventas} ventas`, 25, escenariosY + 16)
  pdf.text(`$${(datos.escenarios.conservador.revenue / 1000000).toFixed(1)}M`, 25, escenariosY + 23)
  pdf.text(`ROAS: ${datos.escenarios.conservador.roas.toFixed(1)}x`, 25, escenariosY + 30)

  // Base
  pdf.setFillColor(99, 102, 241)
  pdf.roundedRect(20 + escenarioWidth + 5, escenariosY, escenarioWidth, 40, 3, 3, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.text('Base ⭐', 25 + escenarioWidth + 5, escenariosY + 8)
  pdf.setFontSize(8)
  pdf.text(`${datos.escenarios.base.ventas} ventas`, 25 + escenarioWidth + 5, escenariosY + 16)
  pdf.text(`$${(datos.escenarios.base.revenue / 1000000).toFixed(1)}M`, 25 + escenarioWidth + 5, escenariosY + 23)
  pdf.text(`ROAS: ${datos.escenarios.base.roas.toFixed(1)}x`, 25 + escenarioWidth + 5, escenariosY + 30)

  // Agresivo
  pdf.setFillColor(16, 185, 129)
  pdf.roundedRect(20 + (escenarioWidth + 5) * 2, escenariosY, escenarioWidth, 40, 3, 3, 'F')
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.text('Agresivo', 25 + (escenarioWidth + 5) * 2, escenariosY + 8)
  pdf.setFontSize(8)
  pdf.text(`${datos.escenarios.agresivo.ventas} ventas`, 25 + (escenarioWidth + 5) * 2, escenariosY + 16)
  pdf.text(`$${(datos.escenarios.agresivo.revenue / 1000000).toFixed(1)}M`, 25 + (escenarioWidth + 5) * 2, escenariosY + 23)
  pdf.text(`ROAS: ${datos.escenarios.agresivo.roas.toFixed(1)}x`, 25 + (escenarioWidth + 5) * 2, escenariosY + 30)

  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(150, 150, 150)
  pdf.text('Generado con Motor 2024 v2024.1.0 | Muller y Pérez', pageWidth / 2, pageHeight - 10, { align: 'center' })
  pdf.text('www.mulleryperez.cl | contacto@mulleryperez.cl', pageWidth / 2, pageHeight - 6, { align: 'center' })

  // Guardar PDF
  pdf.save(`prediccion_${datos.industria}_${new Date().getTime()}.pdf`)
}

/**
 * Exportar desde elemento HTML (alternativa visual)
 */
export async function exportarDesdeHTML(elementId: string, nombreArchivo: string): Promise<void> {
  const elemento = document.getElementById(elementId)
  if (!elemento) {
    console.error('Elemento no encontrado:', elementId)
    return
  }

  // Capturar como imagen
  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    logging: false
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let position = 10

  // Si la imagen es más alta que la página, dividir en múltiples páginas
  if (imgHeight > pageHeight - 20) {
    const pagesNeeded = Math.ceil(imgHeight / (pageHeight - 20))

    for (let i = 0; i < pagesNeeded; i++) {
      if (i > 0) pdf.addPage()

      const sourceY = i * (pageHeight - 20) * (canvas.height / imgHeight)
      const sourceHeight = Math.min((pageHeight - 20) * (canvas.height / imgHeight), canvas.height - sourceY)

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sourceHeight

      const ctx = pageCanvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)
        const pageImgData = pageCanvas.toDataURL('image/png')
        pdf.addImage(pageImgData, 'PNG', 10, 10, imgWidth, (sourceHeight * imgWidth) / canvas.width)
      }
    }
  } else {
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
  }

  pdf.save(nombreArchivo)
}
