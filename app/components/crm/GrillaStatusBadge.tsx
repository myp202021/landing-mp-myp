'use client'

import { GrillaEstado, getEstadoLabel, getEstadoColors } from './grillas-mock-data'

export default function GrillaStatusBadge({ estado }: { estado: GrillaEstado }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColors(estado)}`}>
      {getEstadoLabel(estado)}
    </span>
  )
}
