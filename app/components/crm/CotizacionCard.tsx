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
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border border-slate-200 overflow-hidden cursor-pointer hover:scale-[1.02]">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4">
          <h3 className="text-lg font-bold text-white truncate">{nombre_proyecto}</h3>
          <p className="text-blue-200 text-sm mt-1">{cliente_nombre}</p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoColor}`}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
            <span className="text-2xl font-bold text-slate-900">
              ${Number(total).toLocaleString('es-CL')}
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
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
