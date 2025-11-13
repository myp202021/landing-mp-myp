interface LeadCardProps {
  nombre: string
  email?: string
  telefono?: string
  empresa?: string
  fuente: string
  estado: 'nuevo' | 'contactado' | 'vendido' | 'negativo'
  monto_vendido?: number
  onEdit?: () => void
  onCotizar?: () => void
  onVerHistorial?: () => void
}

export default function LeadCard({
  nombre,
  email,
  telefono,
  empresa,
  fuente,
  estado,
  monto_vendido,
  onEdit,
  onCotizar,
  onVerHistorial
}: LeadCardProps) {
  const estadoColors = {
    nuevo: 'bg-gray-100 text-gray-700 border-gray-300',
    contactado: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    vendido: 'bg-green-100 text-green-700 border-green-300',
    negativo: 'bg-red-100 text-red-700 border-red-300',
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{nombre || 'Sin nombre'}</h3>
          <p className="text-sm text-slate-600">{empresa || fuente}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoColors[estado]}`}>
          {estado.charAt(0).toUpperCase() + estado.slice(1)}
        </span>
      </div>

      <div className="space-y-1 mb-3 text-sm text-slate-700">
        {email && <div>Email: {email}</div>}
        {telefono && <div>Tel: {telefono}</div>}
        {monto_vendido && (
          <div className="font-bold text-green-600">
            Vendido: ${Number(monto_vendido).toLocaleString('es-CL')}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
          >
            Editar
          </button>
        )}
        {onCotizar && (
          <button
            onClick={onCotizar}
            className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
          >
            Cotizar
          </button>
        )}
        {onVerHistorial && (
          <button
            onClick={onVerHistorial}
            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
            title="Ver cotizaciones"
          >
            📄
          </button>
        )}
      </div>
    </div>
  )
}
