'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import GrillaStatusBadge from '@/app/components/crm/GrillaStatusBadge'
import GrillaPostCard from '@/app/components/crm/GrillaPostCard'
import { MOCK_CLIENTES, MOCK_GRILLAS, MESES } from '@/app/components/crm/grillas-mock-data'

export default function GrillaClienteEditorPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params?.clienteId as string

  const cliente = MOCK_CLIENTES.find(c => c.id === clienteId)
  const [mesNum, setMesNum] = useState(3)
  const [anio, setAnio] = useState(2026)
  const [vista, setVista] = useState<'semanal' | 'lista'>('semanal')

  const grilla = MOCK_GRILLAS[clienteId]
  const tieneGrilla = grilla && grilla.mes_num === mesNum && grilla.anio === anio

  // Métricas
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

  if (!cliente) {
    return (
      <CRMLayout title="Grilla">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400 text-lg">Cliente no encontrado</p>
          <button onClick={() => router.push('/crm/grillas')} className="mt-4 text-blue-600 hover:underline text-sm">
            ← Volver a Grillas
          </button>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title={`Grilla — ${cliente.nombre}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.push('/crm/grillas')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block"
            >
              ← Volver a Grillas
            </button>
            <h2 className="text-xl font-bold text-gray-900">{cliente.nombre}</h2>
            <p className="text-sm text-gray-500">{cliente.rubro}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {tieneGrilla && <GrillaStatusBadge estado={grilla.estado} />}
            <button
              onClick={() => alert('Generación con IA disponible en Fase 2')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              🤖 Generar Grilla
            </button>
            <button
              onClick={() => alert('Aprobación disponible en Fase 2')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              ✓ Aprobar
            </button>
            <button
              onClick={() => alert('Envío al cliente disponible en Fase 2')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-300"
            >
              📩 Enviar al Cliente
            </button>
          </div>
        </div>

        {/* Navegador de mes */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navMes(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
          >
            ‹
          </button>
          <h3 className="text-lg font-bold text-gray-900 min-w-[180px] text-center">
            {MESES[mesNum]} {anio}
          </h3>
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

            {/* Toggle vista */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setVista('semanal')}
                  className={`px-5 py-2 text-sm font-semibold transition ${
                    vista === 'semanal' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Vista Semanal
                </button>
                <button
                  onClick={() => setVista('lista')}
                  className={`px-5 py-2 text-sm font-semibold transition ${
                    vista === 'lista' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Vista Lista
                </button>
              </div>
            </div>

            {/* Vista Semanal */}
            {vista === 'semanal' && (
              <div className="space-y-6">
                {grilla.semanas.map((semana, i) => (
                  <div key={i}>
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-xl px-5 py-3">
                      <h4 className="font-bold text-sm">Semana {i + 1} — {semana.rango}</h4>
                      <p className="text-blue-200 text-xs">{semana.dias.length} posts</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-b-xl border border-gray-200 border-t-0">
                      {semana.dias.map(post => (
                        <GrillaPostCard key={post.id} post={post} showNotas={true} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vista Lista */}
            {vista === 'lista' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Día</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plataforma</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-1/2">Copy</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hashtags</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPosts.map(post => {
                        const plat = post.plataforma === 'LinkedIn'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                        return (
                          <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {post.dia_semana} {post.dia}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${plat}`}>
                                {post.plataforma === 'LinkedIn' ? 'LinkedIn' : 'IG/FB'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{post.tipo_post}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 max-w-md">
                              <p className="line-clamp-2">{post.copy}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-blue-500 max-w-[200px]">
                              <p className="line-clamp-1">{post.hashtags}</p>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-xl shadow-md border border-gray-200 py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-500 text-lg font-medium">No hay grilla para {MESES[mesNum]} {anio}</p>
            <p className="text-gray-400 text-sm mt-1">Genera una nueva grilla con IA para este mes</p>
            <button
              onClick={() => alert('Generación con IA disponible en Fase 2')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              🤖 Generar Grilla {MESES[mesNum]}
            </button>
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
