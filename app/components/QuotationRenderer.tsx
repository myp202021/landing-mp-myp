'use client'

/**
 * QuotationRenderer - Componente que toma datos de plantilla y genera HTML visual
 * Basado en el diseño de la cotización Gesnex
 */

interface QuotationData {
  titulo: string
  subtitulo: string
  cliente: {
    nombre: string
    contacto: string
    website: string
    telefono: string
  }
  objetivo: string
  alcance: Array<{
    area: string
    entregable: string
    detalle: string
  }>
  kpis: Array<{
    nombre: string
    frecuencia: string
  }>
  equipo: Array<{
    rol: string
    funcion: string
  }>
  precio: {
    concepto: string
    valor_mensual: number
    iva: number
    duracion_minima_meses: number
    forma_pago: string
  }
}

interface QuotationRendererProps {
  data: QuotationData
}

export default function QuotationRenderer({ data }: QuotationRendererProps) {
  const precioConIva = data.precio.valor_mensual * (1 + data.precio.iva)
  const precioTotal = precioConIva * data.precio.duracion_minima_meses

  return (
    <div className="quotation-container" style={{
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff',
      padding: '40px',
    }}>
      {/* Header con logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #4F46E5', paddingBottom: '20px' }}>
        <img
          src="/cotizaciones/logo-color.png"
          alt="M&P Marketing y Performance"
          style={{ height: '60px', marginBottom: '20px' }}
        />
        <h1 style={{ color: '#1F2937', fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
          {data.titulo}
        </h1>
        <p style={{ color: '#6B7280', fontSize: '18px', margin: '5px 0' }}>
          {data.subtitulo}
        </p>
      </div>

      {/* Información del cliente */}
      <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ color: '#1F2937', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
          📋 Información del Cliente
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
          <div><strong>Cliente:</strong> {data.cliente.nombre}</div>
          <div><strong>Contacto:</strong> {data.cliente.contacto}</div>
          <div><strong>Website:</strong> {data.cliente.website}</div>
          <div><strong>Teléfono:</strong> {data.cliente.telefono}</div>
        </div>
      </div>

      {/* Objetivo */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#4F46E5', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #4F46E5', paddingLeft: '15px' }}>
          🎯 Objetivo
        </h2>
        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>
          {data.objetivo}
        </p>
      </div>

      {/* Alcance del servicio */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#4F46E5', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #4F46E5', paddingLeft: '15px' }}>
          📦 Alcance del Servicio
        </h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {data.alcance.map((item, index) => (
            <div key={index} style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', borderLeft: '3px solid #4F46E5' }}>
              <h3 style={{ color: '#1F2937', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {item.area}
              </h3>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#4F46E5' }}>Entregable:</strong>{' '}
                <span style={{ color: '#374151' }}>{item.entregable}</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                {item.detalle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#4F46E5', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #4F46E5', paddingLeft: '15px' }}>
          📊 KPIs Clave
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#4F46E5', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>KPI</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Frecuencia de Medición</th>
            </tr>
          </thead>
          <tbody>
            {data.kpis.map((kpi, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white', borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '12px', color: '#1F2937' }}>
                  <strong>{kpi.nombre}</strong>
                </td>
                <td style={{ padding: '12px', color: '#6B7280' }}>{kpi.frecuencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Equipo */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#4F46E5', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #4F46E5', paddingLeft: '15px' }}>
          👥 Equipo Asignado
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#4F46E5', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Rol</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Función</th>
            </tr>
          </thead>
          <tbody>
            {data.equipo.map((miembro, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white', borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '12px', color: '#1F2937' }}>
                  <strong>{miembro.rol}</strong>
                </td>
                <td style={{ padding: '12px', color: '#6B7280' }}>{miembro.funcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inversión */}
      <div style={{ backgroundColor: '#EEF2FF', padding: '30px', borderRadius: '8px', border: '2px solid #4F46E5' }}>
        <h2 style={{ color: '#4F46E5', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          💰 Inversión
        </h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', color: '#1F2937', marginBottom: '10px' }}>
            <strong>{data.precio.concepto}</strong>
          </div>
          <div style={{ fontSize: '36px', color: '#4F46E5', fontWeight: 'bold', marginBottom: '5px' }}>
            ${data.precio.valor_mensual.toLocaleString('es-CL')} + IVA
          </div>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>
            Mensual ({data.precio.forma_pago})
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px', color: '#374151' }}>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Valor Mensual con IVA</div>
            <div style={{ fontSize: '20px', color: '#4F46E5', fontWeight: 'bold' }}>
              ${precioConIva.toLocaleString('es-CL')}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Total ({data.precio.duracion_minima_meses} meses)</div>
            <div style={{ fontSize: '20px', color: '#4F46E5', fontWeight: 'bold' }}>
              ${precioTotal.toLocaleString('es-CL')}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', fontSize: '14px', color: '#6B7280', textAlign: 'center' }}>
          ⚠️ Duración mínima del contrato: <strong>{data.precio.duracion_minima_meses} meses</strong>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #E5E7EB', textAlign: 'center', fontSize: '14px', color: '#6B7280' }}>
        <p style={{ marginBottom: '10px' }}>
          <strong style={{ color: '#4F46E5' }}>M&P Marketing y Performance</strong>
        </p>
        <p>contacto@mulleryperez.cl | www.mulleryperez.cl</p>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>
          Cotización válida por 30 días desde su emisión
        </p>
      </div>
    </div>
  )
}
