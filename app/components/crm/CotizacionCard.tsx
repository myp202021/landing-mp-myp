import Link from 'next/link'

interface CotizacionCardProps {
  id: number
  nombre_proyecto: string
  cliente_nombre: string
  total: number
  estado: string
  creado_en: string
  enviada_en?: string
  aceptada_en?: string
}

export default function CotizacionCard({
  id,
  nombre_proyecto,
  cliente_nombre,
  total,
  estado,
  creado_en,
  enviada_en,
  aceptada_en
}: CotizacionCardProps) {
  const estadoColors = {
    borrador: 'bg-gray-100 text-gray-700 border-gray-300',
    enviada: 'bg-blue-100 text-blue-700 border-blue-300',
    aceptada: 'bg-green-100 text-green-700 border-green-300',
    rechazada: 'bg-red-100 text-red-700 border-red-300',
  }

  const estadoColor = estadoColors[estado as keyof typeof estadoColors] || estadoColors.borrador

  return (
    <Link href={`/crm/cotizaciones/${id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 p-6 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{nombre_proyecto}</h3>
            <p className="text-gray-600 text-sm mt-1">{cliente_nombre}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoColor} ml-2 flex-shrink-0`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Monto:</span>
            <span className="text-2xl font-bold text-blue-900">
              ${Number(total).toLocaleString('es-CL')}
            </span>
          </div>

          <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200">
            <div>Creada: {new Date(creado_en).toLocaleDateString('es-CL')}</div>
            {enviada_en && (
              <div>Enviada: {new Date(enviada_en).toLocaleDateString('es-CL')}</div>
            )}
            {aceptada_en && (
              <div className="text-green-600 font-medium">
                Aceptada: {new Date(aceptada_en).toLocaleDateString('es-CL')}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
