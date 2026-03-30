'use client'

import { useState, useEffect, useCallback } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import GrillaStatusBadge from '@/app/components/crm/GrillaStatusBadge'
import GrillaPostCard from '@/app/components/crm/GrillaPostCard'
import GrillaCommentsPanel from '@/app/components/crm/GrillaCommentsPanel'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import type { GrillaContenido, GrillaPost, GrillaComentario } from '@/app/components/crm/grillas-types'
import { MESES } from '@/app/components/crm/grillas-types'

function groupIntoWeeks(posts: GrillaPost[], mes: number) {
  if (!posts.length) return []
  const sorted = [...posts].sort((a, b) => a.dia - b.dia)
  const weeks: { rango: string; dias: GrillaPost[] }[] = []
  let currentWeek: GrillaPost[] = []
  let weekStart = sorted[0].dia

  for (const post of sorted) {
    if (post.dia - weekStart >= 7 && currentWeek.length > 0) {
      const last = currentWeek[currentWeek.length - 1]
      weeks.push({ rango: `${currentWeek[0].dia} – ${last.dia} ${MESES[mes].toLowerCase()}`, dias: currentWeek })
      currentWeek = [post]
      weekStart = post.dia
    } else {
      currentWeek.push(post)
    }
  }
  if (currentWeek.length > 0) {
    const last = currentWeek[currentWeek.length - 1]
    weeks.push({ rango: `${currentWeek[0].dia} – ${last.dia} ${MESES[mes].toLowerCase()}`, dias: currentWeek })
  }
  return weeks
}

export default function GrillaClientePage() {
  const { user } = useSimpleAuth()
  const [grilla, setGrilla] = useState<GrillaContenido | null>(null)
  const [loading, setLoading] = useState(true)
  const [mesNum, setMesNum] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null)
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

  const loadGrilla = useCallback(async () => {
    if (!user?.cliente_id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/grillas?cliente_id=${user.cliente_id}&mes=${mesNum}&anio=${anio}`)
      const data = await res.json()
      const g = data.grilla
      // Only show approved or sent
      if (g && (g.estado === 'aprobado' || g.estado === 'enviado')) {
        setGrilla(g)
        const cRes = await fetch(`/api/crm/grillas/comentarios?grilla_id=${g.id}`)
        const cData = await cRes.json()
        const counts: Record<string, number> = {}
        ;(cData.comentarios || []).forEach((c: GrillaComentario) => {
          counts[c.post_id] = (counts[c.post_id] || 0) + 1
        })
        setCommentCounts(counts)
      } else {
        setGrilla(null)
        setCommentCounts({})
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [user?.cliente_id, mesNum, anio])

  useEffect(() => { loadGrilla() }, [loadGrilla])

  const navMes = (dir: -1 | 1) => {
    let m = mesNum + dir, a = anio
    if (m < 1) { m = 12; a-- }
    if (m > 12) { m = 1; a++ }
    setMesNum(m)
    setAnio(a)
  }

  const posts = grilla?.posts || []
  const weeks = groupIntoWeeks(posts, mesNum)
  const stats = {
    total: posts.length,
    linkedin: posts.filter((p: GrillaPost) => p.plataforma === 'LinkedIn').length,
    igfb: posts.filter((p: GrillaPost) => p.plataforma === 'Facebook/Instagram').length,
    carruseles: posts.filter((p: GrillaPost) => p.tipo_post === 'Carrusel').length,
  }

  return (
    <CRMLayout title="Grilla de Contenido">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Month nav */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navMes(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition">‹</button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">{MESES[mesNum]} {anio}</h3>
            {grilla && <div className="mt-1"><GrillaStatusBadge estado={grilla.estado} /></div>}
          </div>
          <button onClick={() => navMes(1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition">›</button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Cargando...</div>
        ) : grilla ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox label="Total Posts" value={stats.total} icon="📝" />
              <StatBox label="LinkedIn" value={stats.linkedin} icon="🔵" />
              <StatBox label="IG / Facebook" value={stats.igfb} icon="🟣" />
              <StatBox label="Carruseles" value={stats.carruseles} icon="🎠" />
            </div>

            <div className="space-y-6">
              {weeks.map((semana, i) => (
                <div key={i}>
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-xl px-5 py-3">
                    <h4 className="font-bold text-sm">Semana {i + 1} — {semana.rango}</h4>
                    <p className="text-blue-200 text-xs">{semana.dias.length} posts</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-b-xl border border-gray-200 border-t-0">
                    {semana.dias.map((post: GrillaPost) => (
                      <GrillaPostCard
                        key={post.id}
                        post={post}
                        showNotas={false}
                        commentCount={commentCounts[post.id] || 0}
                        onCommentClick={setCommentsPostId}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700">
                Grilla aprobada por el equipo de Muller y Pérez. Para solicitar cambios, contactar a su ejecutivo o dejar comentarios en cada post.
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-500 text-lg font-medium">No hay grilla aprobada para {MESES[mesNum]} {anio}</p>
            <p className="text-gray-400 text-sm mt-1">Tu ejecutivo te notificará cuando esté lista</p>
          </div>
        )}
      </div>

      {commentsPostId && grilla && (
        <GrillaCommentsPanel
          grillaId={grilla.id}
          postId={commentsPostId}
          isPublic={false}
          autorDefault={user?.nombre || 'Cliente'}
          onClose={() => { setCommentsPostId(null); loadGrilla() }}
        />
      )}
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
