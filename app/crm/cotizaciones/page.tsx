'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileText, Loader2, Download, CheckCircle, XCircle, Clock, Send } from 'lucide-react'

interface Cotizacion {
  id: string
  numero_cotizacion: string
  descripcion_servicio: string
  monto_total: number
  monto_subtotal: number
  monto_iva: number
  estado: 'pendiente' | 'enviada' | 'aceptada' | 'rechazada'
  vendido: boolean
  fecha_venta: string | null
  created_at: string
  lead: {
    id: number
    nombre: string | null
    email: string | null
    telefono: string | null
  }
  cliente: {
    id: string
    nombre: string
  }
}

export default function CotizacionesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [filtroVendido, setFiltroVendido] = useState<string>('')
  const [filtroEstado, setFiltroEstado] = useState<string>('')

  useEffect(() => {
    fetchCotizaciones()
  }, [filtroVendido, filtroEstado])

  const fetchCotizaciones = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtroVendido) params.append('vendido', filtroVendido)

      const response = await fetch(`/api/crm/cotizaciones?${params}`)
      const data = await response.json()

      let filtered = data.cotizaciones || []

      // Filtrar por estado si está seleccionado
      if (filtroEstado) {
        filtered = filtered.filter((c: Cotizacion) => c.estado === filtroEstado)
      }

      setCotizaciones(filtered)
    } catch (error) {
      console.error('Error fetching cotizaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoVendido = async (id: string) => {
    if (!confirm('¿Marcar esta cotización como vendida?')) return

    try {
      const response = await fetch('/api/crm/cotizaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          vendido: true,
          estado: 'aceptada'
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Cotización marcada como vendida')
        fetchCotizaciones()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating cotización:', error)
      alert('Error al actualizar cotización')
    }
  }

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const response = await fetch('/api/crm/cotizaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          estado: nuevoEstado
        })
      })

      const data = await response.json()

      if (data.success) {
        fetchCotizaciones()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating cotización:', error)
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'enviada':
        return <Send className="h-4 w-4 text-blue-600" />
      case 'aceptada':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rechazada':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'enviada':
        return 'bg-blue-100 text-blue-800'
      case 'aceptada':
        return 'bg-green-100 text-green-800'
      case 'rechazada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Estadísticas
  const totalCotizaciones = cotizaciones.length
  const totalVendidas = cotizaciones.filter(c => c.vendido).length
  const montoTotalVendido = cotizaciones
    .filter(c => c.vendido)
    .reduce((sum, c) => sum + c.monto_total, 0)
  const tasaConversion = totalCotizaciones > 0
    ? ((totalVendidas / totalCotizaciones) * 100).toFixed(1)
    : '0'

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Historial de Cotizaciones</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y revisa todas las cotizaciones del CRM
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalCotizaciones}</div>
            <p className="text-xs text-muted-foreground">Total Cotizaciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalVendidas}</div>
            <p className="text-xs text-muted-foreground">Vendidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">${montoTotalVendido.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monto Vendido</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{tasaConversion}%</div>
            <p className="text-xs text-muted-foreground">Tasa Conversión</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Estado</Label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="enviada">Enviada</option>
                <option value="aceptada">Aceptada</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>
            <div className="flex-1">
              <Label>Vendido</Label>
              <select
                value={filtroVendido}
                onChange={(e) => setFiltroVendido(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
                <option value="">Todos</option>
                <option value="true">Vendidas</option>
                <option value="false">No vendidas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cotizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cotizaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : cotizaciones.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay cotizaciones que mostrar
            </div>
          ) : (
            <div className="space-y-4">
              {cotizaciones.map((cot) => (
                <div
                  key={cot.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{cot.numero_cotizacion}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getEstadoClass(cot.estado)}`}>
                          {getEstadoIcon(cot.estado)}
                          {cot.estado}
                        </span>
                        {cot.vendido && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-600 text-white">
                            VENDIDO
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Cliente:</strong> {cot.cliente?.nombre}</p>
                        <p><strong>Lead:</strong> {cot.lead?.nombre || 'N/A'}</p>
                        <p><strong>Fecha:</strong> {new Date(cot.created_at).toLocaleDateString('es-CL')}</p>
                        <p><strong>Monto:</strong> ${cot.monto_total.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/api/crm/cotizaciones/${cot.id}/pdf`, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Ver PDF
                      </Button>
                      {!cot.vendido && (
                        <Button
                          size="sm"
                          onClick={() => marcarComoVendido(cot.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar Vendido
                        </Button>
                      )}
                      {!cot.vendido && cot.estado === 'pendiente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cambiarEstado(cot.id, 'enviada')}
                        >
                          Marcar Enviada
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
