'use client'

import { useState } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import GrillaStatusBadge from '@/app/components/crm/GrillaStatusBadge'
import GrillaPostCard from '@/app/components/crm/GrillaPostCard'
import { MOCK_GRILLA_GENERA, MESES } from '@/app/components/crm/grillas-mock-data'

export default function GrillaClientePage() {
  const [mesNum, setMesNum] = useState(3)
  const [anio, setAnio] = useState(2026)

  // En Fase 2: filtrar por user.cliente_id y solo mostrar aprobado/enviado
  const grilla = mesNum === 3 && anio === 2026 ? MOCK_GRILLA_GENERA : null
  const tieneGrilla = grilla && (grilla.estado === 'aprobado' || grilla.estado === 'enviado')

  const allPosts = tieneGrilla ? grilla.semanas.flatMap(s => s.dias) : []
  const stats = {
    total: allPosts.length,
    linkedin: allPosts.filter(p => p.plataforma === 'LinkedIn').length,
    igfb: allPosts.filter(p => p.plataforma === 'Facebook/Instagram').length,
    carruseles: allPosts.filter(p => p.tipo_post === 'Carrusel').length,
  }

  const navMes = (dir: -1 | 1) => {
    let m = mesNum + dir
    let a = anio
    if (m < 1) { m = 12; a-- }
    if (m > 12) { m = 1; a++ }
    setMesNum(m)
    setAnio(a)
  }

  return (
    <CRMLayout title="Grilla de Contenido">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Navegador de mes */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navMes(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
          >
            ‹
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">{MESES[mesNum]} {anio}</h3>
            {tieneGrilla && (
              <div className="mt-1">
                <GrillaStatusBadge estado={grilla.estado} />
              </div>
            )}
          </div>
          <button
            onClick={() => navMes(1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
          >
            ›
          </button>
        </div>

        {tieneGrilla ? (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox label="Total Posts" value={stats.total} icon="📝" />
              <StatBox label="LinkedIn" value={stats.linkedin} icon="🔵" />
              <StatBox label="IG / Facebook" value={stats.igfb} icon="🟣" />
              <StatBox label="Carruseles" value={stats.carruseles} icon="🎠" />
            </div>

            {/* Semanas */}
            <div className="space-y-6">
              {grilla.semanas.map((semana, i) => (
                <div key={i}>
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-xl px-5 py-3">
                    <h4 className="font-bold text-sm">Semana {i + 1} — {semana.rango}</h4>
                    <p className="text-blue-200 text-xs">{semana.dias.length} posts</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-b-xl border border-gray-200 border-t-0">
                    {semana.dias.map(post => (
                      <GrillaPostCard key={post.id} post={post} showNotas={false} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Nota al pie */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700">
                Grilla aprobada por el equipo de Muller y Pérez. Para solicitar cambios, contactar a su ejecutivo.
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-500 text-lg font-medium">
              {grilla ? 'La grilla de este mes aún no está aprobada' : `No hay grilla para ${MESES[mesNum]} ${anio}`}
            </p>
            <p className="text-gray-400 text-sm mt-1">Tu ejecutivo te notificará cuando esté lista</p>
          </div>
        )}
      </div>
    </CRMLayout>
  )
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
