'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'

interface Lead {
  id: number
  nombre: string | null
  email: string | null
  telefono: string | null
  cliente_id: string
}

interface Cliente {
  id: string
  nombre: string
}

export default function CotizarPage() {
  const router = useRouter()
  const params = useParams()
  const lead_id = params?.lead_id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lead, setLead] = useState<Lead | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)

  const [formData, setFormData] = useState({
    descripcion_servicio: '',
    monto_subtotal: '',
    monto_iva: '',
    monto_total: ''
  })

  useEffect(() => {
    if (lead_id) {
      fetchLead()
    }
  }, [lead_id])

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/crm/leads?id=${lead_id}`)
      const data = await response.json()

      if (data.leads && data.leads.length > 0) {
        const leadData = data.leads[0]
        setLead(leadData)

        // Fetch cliente data
        if (leadData.cliente_id) {
          const clienteResponse = await fetch(`/api/crm/clientes?id=${leadData.cliente_id}`)
          const clienteData = await clienteResponse.json()
          if (clienteData.clientes && clienteData.clientes.length > 0) {
            setCliente(clienteData.clientes[0])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }

    // Auto-calculate total if subtotal and IVA are provided
    if (name === 'monto_subtotal' || name === 'monto_iva') {
      const subtotal = parseFloat(newFormData.monto_subtotal || '0')
      const iva = parseFloat(newFormData.monto_iva || '0')
      newFormData.monto_total = (subtotal + iva).toString()
    }

    setFormData(newFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/crm/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: parseInt(lead_id),
          cliente_id: lead?.cliente_id,
          descripcion_servicio: formData.descripcion_servicio,
          monto_subtotal: parseFloat(formData.monto_subtotal || '0'),
          monto_iva: parseFloat(formData.monto_iva || '0'),
          monto_total: parseFloat(formData.monto_total || '0'),
          estado: 'pendiente'
        })
      })

      const data = await response.json()

      if (data.success) {
        const cotizacionId = data.cotizacion.id

        // Mostrar opción de ver PDF
        if (confirm('Cotización creada exitosamente. ¿Deseas ver el PDF ahora?')) {
          window.open(`/api/crm/cotizaciones/${cotizacionId}/pdf`, '_blank')
        }

        router.push(`/crm/cotizaciones`)
      } else {
        alert('Error al crear cotización: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating cotización:', error)
      alert('Error al crear cotización')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Lead no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/crm/leads')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Leads
        </Button>

        <h1 className="text-3xl font-bold">Nueva Cotización</h1>
        <p className="text-muted-foreground mt-2">
          Lead: {lead.nombre || 'Sin nombre'} {lead.email && `(${lead.email})`}
        </p>
        {cliente && (
          <p className="text-sm text-muted-foreground">
            Cliente: {cliente.nombre}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información de la Cotización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="descripcion_servicio">
                Descripción del Servicio *
              </Label>
              <Textarea
                id="descripcion_servicio"
                name="descripcion_servicio"
                value={formData.descripcion_servicio}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Describe el servicio que se está cotizando..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="monto_subtotal">
                  Subtotal ($)
                </Label>
                <Input
                  id="monto_subtotal"
                  name="monto_subtotal"
                  type="number"
                  step="0.01"
                  value={formData.monto_subtotal}
                  onChange={handleMontoChange}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monto_iva">
                  IVA ($)
                </Label>
                <Input
                  id="monto_iva"
                  name="monto_iva"
                  type="number"
                  step="0.01"
                  value={formData.monto_iva}
                  onChange={handleMontoChange}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monto_total">
                  Total ($) *
                </Label>
                <Input
                  id="monto_total"
                  name="monto_total"
                  type="number"
                  step="0.01"
                  value={formData.monto_total}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="mt-1 font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/crm/leads')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Cotización'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
