'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import GrillaPostCard from '@/app/components/crm/GrillaPostCard'
import GrillaCommentsPanel from '@/app/components/crm/GrillaCommentsPanel'
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

export default function GrillaPublicaPage() {
  const params = useParams()
  const token = params?.token as string

  const [grilla, setGrilla] = useState<GrillaContenido | null>(null)
  const [clienteNombre, setClienteNombre] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null)
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

  const loadGrilla = useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/grillas?token=${token}`)
      const data = await res.json()
      if (data.grilla) {
        setGrilla(data.grilla)
        setClienteNombre(data.grilla.clientes?.nombre || '')
        // Load comment counts
        const cRes = await fetch(`/api/crm/grillas/comentarios?grilla_id=${data.grilla.id}`)
        const cData = await cRes.json()
        const counts: Record<string, number> = {}
        ;(cData.comentarios || []).forEach((c: GrillaComentario) => {
          counts[c.post_id] = (counts[c.post_id] || 0) + 1
        })
        setCommentCounts(counts)
      } else {
        setNotFound(true)
      }
    } catch (e) {
      console.error(e)
      setNotFound(true)
    }
    setLoading(false)
  }, [token])

  useEffect(() => { loadGrilla() }, [loadGrilla])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando grilla...</p>
      </div>
    )
  }

  if (notFound || !grilla) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🔒</p>
        <p className="text-gray-500 text-lg">Grilla no encontrada</p>
        <p className="text-gray-400 text-sm">Este link puede haber expirado o ser incorrecto.</p>
      </div>
    )
  }

  const posts = grilla.posts || []
  const weeks = groupIntoWeeks(posts, grilla.mes)
  const stats = {
    total: posts.length,
    linkedin: posts.filter((p: GrillaPost) => p.plataforma === 'LinkedIn').length,
    igfb: posts.filter((p: GrillaPost) => p.plataforma === 'Facebook/Instagram').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-900 font-bold text-sm">M&P</div>
            <span className="text-blue-200 text-sm">Muller y Pérez</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Grilla de Contenido</h1>
          <p className="text-blue-200 mt-1">{clienteNombre} — {MESES[grilla.mes]} {grilla.anio}</p>
          <p className="text-blue-300 text-sm mt-2">
            {stats.total} publicaciones · {stats.linkedin} LinkedIn · {stats.igfb} Instagram/Facebook
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* How it works */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-3">¿Cómo revisar tu grilla?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">1</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Revisa cada post</p>
                <p className="text-xs text-gray-500">Haz click en "Ver más" para leer el copy completo</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">2</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Deja comentarios</p>
                <p className="text-xs text-gray-500">Usa el botón "Comentar" en cada publicación</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Nosotros ajustamos</p>
                <p className="text-xs text-gray-500">Tu ejecutivo incorporará tus cambios</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Publicaciones</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.linkedin}</p>
            <p className="text-xs text-gray-500">LinkedIn</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{stats.igfb}</p>
            <p className="text-xs text-gray-500">Instagram / Facebook</p>
          </div>
        </div>

        {/* Weeks */}
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

        {/* Footer note */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">
            Muller y Pérez — Performance Marketing · <a href="https://www.mulleryperez.cl" className="text-blue-500 hover:underline">mulleryperez.cl</a>
          </p>
        </div>
      </div>

      {/* Comments panel */}
      {commentsPostId && (
        <GrillaCommentsPanel
          grillaId={grilla.id}
          postId={commentsPostId}
          isPublic={true}
          onClose={() => { setCommentsPostId(null); loadGrilla() }}
        />
      )}
    </div>
  )
}
