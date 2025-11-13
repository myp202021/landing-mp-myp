'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Item {
  id: string
  descripcion: string
  especificacion: string
  empaque: string
  cantidad: number
  unidad: string
  precio_fob_unitario: number
  precio_fob_total: number
  foto_url: string
}

export default function CotizadorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cotización data
  const [numeroCotizacion, setNumeroCotizacion] = useState('')
  const [cliente, setCliente] = useState('')
  const [container, setContainer] = useState('')
  const [puertoEmbarque, setPuertoEmbarque] = useState('')
  const [ofertaValida, setOfertaValida] = useState('')
  const [produccion, setProduccion] = useState('')
  const [condicionesPago, setCondicionesPago] = useState('Pago del 100% contra la entrega del B/L original')

  // Notas por defecto de Mercator
  const [notas, setNotas] = useState(`1. La cotización es modalidad FOB. Debido a las variaciones del valor del transporte marítimo, sólo podremos definir el precio del flete al momento del embarque. Actualmente nosotros trabajamos con 3 forwarder de los cuales informamos el costo del transporte, para que sea evaluado por el cliente y si estima adecuado de el Ok. En el caso que el cliente tenga un precio menor incluyendo los costos en origen y destino para el envío, nosotros no tenemos inconveniente en realizar el traslado con el forwarder informado por el cliente, siempre que la tarifa sea menor a la informada por nosotros.

2. El tiempo de producción mínimo son 35 días y luego tenemos 10 días entre el traslado y zarpe del puerto, posterior a esto se deben considerar 45 días de traslado desde China a Chile, por, lo que en total se deben considerar 90 ± 10 días.

3. La garantía del producto es 12 meses desde su fecha de producción.

4. Tener presente que los tiempos informados están considerando condiciones normales de producción y despacho y no considera eventos de fuerza mayor que puedan modificar los tiempos de entrega como son: Desastres naturales (huracanes y terremotos), Huelgas en Puertos y cualquier otro evento que pueda escapar a la gestión como proveedor.

5. Fecha de cotización: ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')}`)

  // Proveedor info (defaults)
  const [proveedor, setProveedor] = useState('Mercator Group')
  const [direccion, setDireccion] = useState('Franklin 338, Santiago Centro, Chile')
  const [personaContacto, setPersonaContacto] = useState('Jose Marilaf Pablaza')
  const [email, setEmail] = useState('jmarilaf@mercator-group.com')

  // Items
  const [items, setItems] = useState<Item[]>([
    {
      id: Math.random().toString(),
      descripcion: '',
      especificacion: '',
      empaque: '',
      cantidad: 1,
      unidad: 'unidad',
      precio_fob_unitario: 0,
      precio_fob_total: 0,
      foto_url: ''
    }
  ])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        descripcion: '',
        especificacion: '',
        empaque: '',
        cantidad: 1,
        unidad: 'unidad',
        precio_fob_unitario: 0,
        precio_fob_total: 0,
        foto_url: ''
      }
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          // Recalcular total
          if (field === 'cantidad' || field === 'precio_fob_unitario') {
            updated.precio_fob_total = updated.cantidad * updated.precio_fob_unitario
          }
          return updated
        }
        return item
      })
    )
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.precio_fob_total, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cotizacion: {
            numero_cotizacion: numeroCotizacion,
            cliente,
            container,
            puerto_embarque: puertoEmbarque,
            oferta_valida: ofertaValida,
            produccion,
            proveedor,
            direccion,
            persona_contacto: personaContacto,
            email,
            condiciones_pago: condicionesPago,
            notas
          },
          items: items.map((item, index) => ({
            descripcion: item.descripcion,
            especificacion: item.especificacion,
            empaque: item.empaque,
            cantidad: item.cantidad,
            unidad: item.unidad,
            precio_fob_unitario: item.precio_fob_unitario,
            foto_url: item.foto_url,
            orden: index
          }))
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear cotización')
      }

      // Redirigir al histórico o a la vista de PDF
      router.push(`/cotizador/historico`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Cotizador Mercator
            </h1>
            <button
              onClick={() => router.push('/cotizador/historico')}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              Ver Histórico
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  N° Cotización *
                </label>
                <input
                  type="text"
                  required
                  value={numeroCotizacion}
                  onChange={e => setNumeroCotizacion(e.target.value)}
                  placeholder="Ej: 18072025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={cliente}
                  onChange={e => setCliente(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Container
                </label>
                <input
                  type="text"
                  value={container}
                  onChange={e => setContainer(e.target.value)}
                  placeholder="Ej: 2x40HQ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Puerto Embarque
                </label>
                <input
                  type="text"
                  value={puertoEmbarque}
                  onChange={e => setPuertoEmbarque(e.target.value)}
                  placeholder="Ej: QINGDAO"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Oferta Válida
                </label>
                <input
                  type="text"
                  value={ofertaValida}
                  onChange={e => setOfertaValida(e.target.value)}
                  placeholder="Ej: 5 días"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Producción
                </label>
                <input
                  type="text"
                  value={produccion}
                  onChange={e => setProduccion(e.target.value)}
                  placeholder="Ej: 35 días"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Información Proveedor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Información Proveedor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proveedor
                </label>
                <input
                  type="text"
                  value={proveedor}
                  onChange={e => setProveedor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Persona Contacto
                </label>
                <input
                  type="text"
                  value={personaContacto}
                  onChange={e => setPersonaContacto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items / Productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Productos</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
              >
                + Agregar Producto
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Producto #{index + 1}
                    </h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.descripcion}
                        onChange={e =>
                          updateItem(item.id, 'descripcion', e.target.value)
                        }
                        placeholder="Nombre del producto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Especificación
                      </label>
                      <input
                        type="text"
                        value={item.especificacion}
                        onChange={e =>
                          updateItem(item.id, 'especificacion', e.target.value)
                        }
                        placeholder="Ej: Acero inoxidable"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Empaque
                      </label>
                      <input
                        type="text"
                        value={item.empaque}
                        onChange={e =>
                          updateItem(item.id, 'empaque', e.target.value)
                        }
                        placeholder="Ej: Caja de cartón"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.cantidad}
                          onChange={e =>
                            updateItem(
                              item.id,
                              'cantidad',
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Unidad
                        </label>
                        <input
                          type="text"
                          value={item.unidad}
                          onChange={e =>
                            updateItem(item.id, 'unidad', e.target.value)
                          }
                          placeholder="unidad"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio FOB Unitario (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.precio_fob_unitario}
                        onChange={e =>
                          updateItem(
                            item.id,
                            'precio_fob_unitario',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio FOB Total (USD)
                      </label>
                      <input
                        type="number"
                        disabled
                        value={item.precio_fob_total.toFixed(2)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Foto URL (Opcional)
                      </label>
                      <input
                        type="url"
                        value={item.foto_url}
                        onChange={e =>
                          updateItem(item.id, 'foto_url', e.target.value)
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end items-center">
                <span className="text-xl font-bold text-gray-900 mr-4">
                  Total cotizado en USD FOB:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculateTotal().toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Condiciones de Pago y Notas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Condiciones y Notas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condiciones de Pago
                </label>
                <textarea
                  value={condicionesPago}
                  onChange={e => setCondicionesPago(e.target.value)}
                  rows={3}
                  placeholder="Ej: 30% adelanto, 70% contra entrega"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  rows={3}
                  placeholder="Notas adicionales..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/cotizador/historico')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
