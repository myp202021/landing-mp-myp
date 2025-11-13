'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Item {
  descripcion: string
  especificacion: string
  empaque: string
  cantidad: number
  unidad: string
  precio_fob_unitario: number
  precio_fob_total: number
  foto_url: string
}

interface Cotizacion {
  id: string
  numero_cotizacion: string
  cliente: string
  container: string
  puerto_embarque: string
  oferta_valida: string
  produccion: string
  proveedor: string
  direccion: string
  persona_contacto: string
  email: string
  total_usd_fob: number
  condiciones_pago: string
  notas: string
  items: Item[]
}

export default function PDFViewPage() {
  const params = useParams()
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchCotizacion()
    }
  }, [params.id])

  const fetchCotizacion = async () => {
    try {
      const response = await fetch('/api/cotizaciones')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar cotización')
      }

      const found = data.cotizaciones.find((c: Cotizacion) => c.id === params.id)
      if (!found) {
        throw new Error('Cotización no encontrada')
      }

      setCotizacion(found)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando cotización...</div>
      </div>
    )
  }

  if (error || !cotizacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || 'Cotización no encontrada'}</div>
          <button
            onClick={() => router.push('/cotizador/historico')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Volver al Histórico
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Controls - No Print */}
      <div className="no-print bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/cotizador/historico')}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold"
          >
            ← Volver al Histórico
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Generar PDF
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="pdf-container">
        <div className="pdf-page">
          {/* Header Row */}
          <div className="header-row">
            <div className="header-cell">
              <span className="header-label">Cotización N° :</span>
              <span className="header-value">{cotizacion.numero_cotizacion}</span>
            </div>
            <div className="header-cell">
              <span className="header-label">Cliente :</span>
              <span className="header-value">{cotizacion.cliente}</span>
            </div>
            <div className="header-cell">
              <span className="header-label">Página:</span>
              <span className="header-value">1 de 1</span>
            </div>
          </div>

          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-text">MERCATOR GROUP</div>
          </div>

          {/* Info Tables */}
          <div className="info-tables">
            <div className="info-table">
              <div className="info-row">
                <div className="info-label">Container</div>
                <div className="info-value">{cotizacion.container || '-'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Puerto embarque</div>
                <div className="info-value">{cotizacion.puerto_embarque || '-'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Oferta válida</div>
                <div className="info-value">{cotizacion.oferta_valida || '-'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Producción</div>
                <div className="info-value">{cotizacion.produccion || '-'}</div>
              </div>
            </div>

            <div className="info-table">
              <div className="info-row">
                <div className="info-label">Proveedor</div>
                <div className="info-value">{cotizacion.proveedor}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Dirección</div>
                <div className="info-value">{cotizacion.direccion}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Persona Contacto</div>
                <div className="info-value">{cotizacion.persona_contacto}</div>
              </div>
              <div className="info-row">
                <div className="info-label">E-mail</div>
                <div className="info-value">{cotizacion.email}</div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-descripcion">Descripción</th>
                <th className="col-especificacion">Especificación</th>
                <th className="col-empaque">Empaque</th>
                <th className="col-cantidad">Cantidad<br />(unidad)</th>
                <th className="col-precio">Precio FOB<br />(USD/unidad)</th>
                <th className="col-total">Precio FOB<br />Total USD</th>
                <th className="col-foto">Foto Producto<br />referencial</th>
              </tr>
            </thead>
            <tbody>
              {cotizacion.items.map((item, index) => (
                <tr key={index}>
                  <td className="cell-descripcion">{item.descripcion}</td>
                  <td className="cell-especificacion">{item.especificacion || '-'}</td>
                  <td className="cell-empaque">{item.empaque || '-'}</td>
                  <td className="cell-cantidad">{item.cantidad} {item.unidad}</td>
                  <td className="cell-precio">${formatCurrency(item.precio_fob_unitario)}</td>
                  <td className="cell-total">${formatCurrency(item.precio_fob_total)}</td>
                  <td className="cell-foto">
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.descripcion} className="product-img" />
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="total-section">
            <div className="total-label">Total cotizado en USD FOB</div>
            <div className="total-value">${formatCurrency(cotizacion.total_usd_fob)}</div>
          </div>

          {/* Conditions */}
          {cotizacion.condiciones_pago && (
            <div className="conditions-section">
              <div className="conditions-title">CONDICIONES DE PAGO:</div>
              <div className="conditions-text">{cotizacion.condiciones_pago}</div>
            </div>
          )}

          {/* Notes */}
          {cotizacion.notas && (
            <div className="notes-section">
              <div className="notes-title">NOTAS:</div>
              <div className="notes-text">{cotizacion.notas}</div>
            </div>
          )}

          {/* Footer */}
          <div className="footer">
            MERCATOR GROUP | Franklin 338, Santiago, Chile
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @page {
          size: letter;
          margin: 0.5in;
        }

        @media print {
          .no-print {
            display: none !important;
          }
        }

        .pdf-container {
          max-width: 8.5in;
          margin: 20px auto;
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .pdf-page {
          padding: 40px;
          min-height: 11in;
        }

        .header-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
          border: 2px solid #003366;
          background: #e6f2ff;
        }

        .header-cell {
          padding: 10px;
          border-right: 1px solid #003366;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-cell:last-child {
          border-right: none;
        }

        .header-label {
          font-weight: bold;
          color: #003366;
          font-size: 12px;
        }

        .header-value {
          font-size: 12px;
          color: #000;
        }

        .logo-section {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .logo-text {
          font-size: 48px;
          font-weight: bold;
          color: white;
          letter-spacing: 4px;
        }

        .info-tables {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 30px;
        }

        .info-table {
          border: 1px solid #ccc;
        }

        .info-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          border-bottom: 1px solid #ccc;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          background: #e6e6e6;
          padding: 8px;
          font-weight: bold;
          font-size: 11px;
          border-right: 1px solid #ccc;
        }

        .info-value {
          padding: 8px;
          font-size: 11px;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 10px;
        }

        .products-table th {
          background: #4472C4;
          color: white;
          padding: 10px 5px;
          text-align: center;
          border: 1px solid #fff;
          font-size: 10px;
          font-weight: bold;
        }

        .products-table td {
          border: 1px solid #ccc;
          padding: 8px 5px;
          vertical-align: top;
        }

        .col-descripcion { width: 15%; }
        .col-especificacion { width: 20%; }
        .col-empaque { width: 12%; }
        .col-cantidad { width: 10%; text-align: center; }
        .col-precio { width: 12%; text-align: center; }
        .col-total { width: 13%; text-align: center; }
        .col-foto { width: 10%; text-align: center; }

        .cell-cantidad,
        .cell-precio,
        .cell-total {
          text-align: right;
          padding-right: 10px;
        }

        .cell-foto {
          text-align: center;
        }

        .product-img {
          max-width: 60px;
          max-height: 60px;
          object-fit: contain;
        }

        .total-section {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 20px;
          margin: 30px 0;
          padding: 15px;
          background: #f5f5f5;
          border: 2px solid #003366;
        }

        .total-label {
          font-weight: bold;
          font-size: 14px;
          color: #003366;
        }

        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #003366;
        }

        .conditions-section,
        .notes-section {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ccc;
          background: #f9f9f9;
        }

        .conditions-title,
        .notes-title {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 8px;
          color: #003366;
        }

        .conditions-text,
        .notes-text {
          font-size: 11px;
          line-height: 1.5;
        }

        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #003366;
          font-weight: bold;
          font-size: 12px;
          color: #003366;
        }
      `}</style>
    </div>
  )
}
