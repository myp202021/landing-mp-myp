'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import GrillaStatusBadge from '@/app/components/crm/GrillaStatusBadge'
import GrillaPostCard from '@/app/components/crm/GrillaPostCard'
import GrillaPostEditModal from '@/app/components/crm/GrillaPostEditModal'
import GrillaCommentsPanel from '@/app/components/crm/GrillaCommentsPanel'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import type { GrillaContenido, GrillaPost, GrillaComentario } from '@/app/components/crm/grillas-types'
import { MESES } from '@/app/components/crm/grillas-types'

// Group posts into weeks
function groupIntoWeeks(posts: GrillaPost[], mes: number, anio: number) {
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

export default function GrillaEditorPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useSimpleAuth()
  const clienteId = params?.clienteId as string

  const [cliente, setCliente] = useState<{ nombre: string; rubro: string } | null>(null)
  const [grilla, setGrilla] = useState<GrillaContenido | null>(null)
  const [mesNum, setMesNum] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [vista, setVista] = useState<'semanal' | 'lista'>('semanal')

  // Edit modal
  const [editingPost, setEditingPost] = useState<GrillaPost | null>(null)
  // Comments panel
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null)
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)

  const loadCliente = useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/clientes?id=${clienteId}`)
      const data = await res.json()
      if (data.cliente) setCliente({ nombre: data.cliente.nombre, rubro: data.cliente.rubro })
    } catch (e) { console.error(e) }
  }, [clienteId])

  const loadGrilla = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/grillas?cliente_id=${clienteId}&mes=${mesNum}&anio=${anio}`)
      const data = await res.json()
      setGrilla(data.grilla || null)
      // Load comment counts
      if (data.grilla?.id) {
        const cRes = await fetch(`/api/crm/grillas/comentarios?grilla_id=${data.grilla.id}`)
        const cData = await cRes.json()
        const counts: Record<string, number> = {}
        ;(cData.comentarios || []).forEach((c: GrillaComentario) => {
          counts[c.post_id] = (counts[c.post_id] || 0) + 1
        })
        setCommentCounts(counts)
      } else {
        setCommentCounts({})
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [clienteId, mesNum, anio])

  useEffect(() => { loadCliente() }, [loadCliente])
  useEffect(() => { loadGrilla() }, [loadGrilla])

  const navMes = (dir: -1 | 1) => {
    let m = mesNum + dir, a = anio
    if (m < 1) { m = 12; a-- }
    if (m > 12) { m = 1; a++ }
    setMesNum(m)
    setAnio(a)
  }

  // Save edited post
  const handleSavePost = async (updated: GrillaPost) => {
    if (!grilla) return
    setSaving(true)
    const newPosts = grilla.posts.map(p => p.id === updated.id ? updated : p)
    try {
      const res = await fetch('/api/crm/grillas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grilla.id, posts: newPosts }),
      })
      const data = await res.json()
      if (data.success) setGrilla(data.grilla)
    } catch (e) { console.error(e) }
    setSaving(false)
    setEditingPost(null)
  }

  // Add new post
  const handleAddPost = async () => {
    if (!grilla) return
    const newPost: GrillaPost = {
      id: crypto.randomUUID(),
      dia: 1,
      dia_semana: 'Lunes',
      plataforma: 'LinkedIn',
      tipo_post: 'Post',
      copy: '',
      hashtags: '',
      nota_interna: '',
    }
    setEditingPost(newPost)
  }

  const handleSaveNewPost = async (post: GrillaPost) => {
    if (!grilla) return
    setSaving(true)
    const exists = grilla.posts.some(p => p.id === post.id)
    const newPosts = exists
      ? grilla.posts.map(p => p.id === post.id ? post : p)
      : [...grilla.posts, post]
    try {
      const res = await fetch('/api/crm/grillas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grilla.id, posts: newPosts }),
      })
      const data = await res.json()
      if (data.success) setGrilla(data.grilla)
    } catch (e) { console.error(e) }
    setSaving(false)
    setEditingPost(null)
  }

  // Create empty grilla
  const handleCreateGrilla = async () => {
    try {
      const res = await fetch('/api/crm/grillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId, mes: mesNum, anio }),
      })
      const data = await res.json()
      if (data.success) setGrilla(data.grilla)
      else alert(data.error || 'Error al crear grilla')
    } catch (e) { console.error(e) }
  }

  // Change estado
  const handleChangeEstado = async (estado: string) => {
    if (!grilla) return
    try {
      const res = await fetch('/api/crm/grillas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grilla.id, estado }),
      })
      const data = await res.json()
      if (data.success) setGrilla(data.grilla)
    } catch (e) { console.error(e) }
  }

  // Send to client
  const handleEnviar = async () => {
    if (!grilla) return
    if (!confirm('¿Enviar la grilla al cliente por email?')) return
    setSending(true)
    try {
      const res = await fetch('/api/crm/grillas/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grilla_id: grilla.id }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`Email enviado a ${data.email_sent_to}`)
        loadGrilla()
      } else {
        alert(data.error || 'Error al enviar')
      }
    } catch (e) { console.error(e) }
    setSending(false)
  }

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!grilla || !confirm('¿Eliminar este post?')) return
    const newPosts = grilla.posts.filter(p => p.id !== postId)
    try {
      const res = await fetch('/api/crm/grillas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grilla.id, posts: newPosts }),
      })
      const data = await res.json()
      if (data.success) setGrilla(data.grilla)
    } catch (e) { console.error(e) }
  }

  const posts = grilla?.posts || []
  const weeks = groupIntoWeeks(posts, mesNum, anio)
  const stats = {
    total: posts.length,
    linkedin: posts.filter(p => p.plataforma === 'LinkedIn').length,
    igfb: posts.filter(p => p.plataforma === 'Facebook/Instagram').length,
    carruseles: posts.filter(p => p.tipo_post === 'Carrusel').length,
  }

  if (!cliente && !loading) {
    return (
      <CRMLayout title="Grilla">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400 text-lg">Cliente no encontrado</p>
          <button onClick={() => router.push('/crm/grillas')} className="mt-4 text-blue-600 hover:underline text-sm">← Volver</button>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title={`Grilla — ${cliente?.nombre || '...'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button onClick={() => router.push('/crm/grillas')} className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block">
              ← Volver a Grillas
            </button>
            <h2 className="text-xl font-bold text-gray-900">{cliente?.nombre}</h2>
            <p className="text-sm text-gray-500">{cliente?.rubro}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {grilla && <GrillaStatusBadge estado={grilla.estado} />}
            {grilla && grilla.estado === 'borrador' && (
              <button onClick={() => handleChangeEstado('en_revision')} className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs font-semibold hover:bg-yellow-600 transition">
                📋 En Revisión
              </button>
            )}
            {grilla && (grilla.estado === 'en_revision' || grilla.estado === 'borrador') && (
              <button onClick={() => handleChangeEstado('aprobado')} className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition">
                ✓ Aprobar
              </button>
            )}
            {grilla && grilla.estado === 'aprobado' && (
              <button onClick={handleEnviar} disabled={sending} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {sending ? 'Enviando...' : '📩 Enviar al Cliente'}
              </button>
            )}
          </div>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navMes(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition">‹</button>
          <h3 className="text-lg font-bold text-gray-900 min-w-[180px] text-center">{MESES[mesNum]} {anio}</h3>
          <button onClick={() => navMes(1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition">›</button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Cargando...</div>
        ) : grilla ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox label="Total Posts" value={stats.total} icon="📝" />
              <StatBox label="LinkedIn" value={stats.linkedin} icon="🔵" />
              <StatBox label="IG / Facebook" value={stats.igfb} icon="🟣" />
              <StatBox label="Carruseles" value={stats.carruseles} icon="🎠" />
            </div>

            {/* View toggle + add post */}
            <div className="flex items-center justify-between">
              <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                <button onClick={() => setVista('semanal')} className={`px-5 py-2 text-sm font-semibold transition ${vista === 'semanal' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  Vista Semanal
                </button>
                <button onClick={() => setVista('lista')} className={`px-5 py-2 text-sm font-semibold transition ${vista === 'lista' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  Vista Lista
                </button>
              </div>
              <button onClick={handleAddPost} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                + Agregar Post
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 py-16 text-center">
                <p className="text-gray-400 text-lg">Grilla vacía — agrega posts manualmente o genera con IA</p>
              </div>
            ) : vista === 'semanal' ? (
              <div className="space-y-6">
                {weeks.map((semana, i) => (
                  <div key={i}>
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-xl px-5 py-3">
                      <h4 className="font-bold text-sm">Semana {i + 1} — {semana.rango}</h4>
                      <p className="text-blue-200 text-xs">{semana.dias.length} posts</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-b-xl border border-gray-200 border-t-0">
                      {semana.dias.map(post => (
                        <GrillaPostCard
                          key={post.id}
                          post={post}
                          showNotas={true}
                          onEdit={setEditingPost}
                          commentCount={commentCounts[post.id] || 0}
                          onCommentClick={setCommentsPostId}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Día</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plataforma</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-1/2">Copy</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...posts].sort((a, b) => a.dia - b.dia).map(post => (
                        <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{post.dia_semana} {post.dia}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.plataforma === 'LinkedIn' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {post.plataforma === 'LinkedIn' ? 'LinkedIn' : 'IG/FB'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{post.tipo_post}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-md"><p className="line-clamp-2">{post.copy}</p></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditingPost(post)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Editar</button>
                              <button onClick={() => setCommentsPostId(post.id)} className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100 relative">
                                💬{commentCounts[post.id] ? ` ${commentCounts[post.id]}` : ''}
                              </button>
                              <button onClick={() => handleDeletePost(post.id)} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">✕</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-500 text-lg font-medium">No hay grilla para {MESES[mesNum]} {anio}</p>
            <button onClick={handleCreateGrilla} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              + Crear Grilla {MESES[mesNum]}
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingPost && (
        <GrillaPostEditModal
          post={editingPost}
          onSave={handleSaveNewPost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* Comments panel */}
      {commentsPostId && grilla && (
        <GrillaCommentsPanel
          grillaId={grilla.id}
          postId={commentsPostId}
          autorDefault={user?.nombre || 'Equipo M&P'}
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
