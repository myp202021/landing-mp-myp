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
  const [generating, setGenerating] = useState(false)
  const [hasBriefing, setHasBriefing] = useState(false)
  const [showGenerarModal, setShowGenerarModal] = useState(false)
  const [contextoMes, setContextoMes] = useState('')
  const [showMejorarModal, setShowMejorarModal] = useState(false)
  const [instruccionesMejora, setInstruccionesMejora] = useState('')
  const [improving, setImproving] = useState(false)
  // History: which months have grillas
  const [historial, setHistorial] = useState<{ mes: number; anio: number; estado: string }[]>([])

  const loadCliente = useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/clientes?id=${clienteId}`)
      const data = await res.json()
      if (data.cliente) setCliente({ nombre: data.cliente.nombre, rubro: data.cliente.rubro })
      // Load all grillas for this client (history)
      const hRes = await fetch(`/api/crm/grillas?cliente_id=${clienteId}`)
      const hData = await hRes.json()
      setHistorial((hData.grillas || []).map((g: { mes: number; anio: number; estado: string }) => ({ mes: g.mes, anio: g.anio, estado: g.estado })))
      // Check briefing
      const bRes = await fetch(`/api/crm/briefings?cliente_id=${clienteId}`)
      const bData = await bRes.json()
      setHasBriefing(!!bData.briefing)
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

  // Generate with AI
  // Open generation modal (or redirect to briefing)
  const handleGenerarClick = () => {
    if (!hasBriefing) {
      router.push(`/crm/grillas/${clienteId}/briefing`)
      return
    }
    setShowGenerarModal(true)
  }

  // Actually generate
  const handleGenerar = async () => {
    setShowGenerarModal(false)
    setGenerating(true)
    try {
      const res = await fetch('/api/crm/grillas/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId, mes: mesNum, anio, contexto_mes: contextoMes.trim() || undefined }),
      })
      const data = await res.json()
      if (data.success) {
        setGrilla(data.grilla)
        alert(`✅ ${data.stats.total_posts} posts generados (${data.stats.modelo_usado}) · Promedio: ${data.stats.promedio_palabras} palabras`)
        loadGrilla()
      } else {
        alert(data.error || 'Error al generar')
      }
    } catch (e) { console.error(e) }
    setGenerating(false)
    setContextoMes('')
  }

  // Improve existing grilla with AI
  const handleMejorar = async () => {
    if (!grilla) return
    setShowMejorarModal(false)
    setImproving(true)
    try {
      const res = await fetch('/api/crm/grillas/mejorar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grilla_id: grilla.id, instrucciones: instruccionesMejora.trim() || undefined }),
      })
      const data = await res.json()
      if (data.success) {
        setGrilla(data.grilla)
        alert(`✨ Posts mejorados · Promedio: ${data.stats.promedio_palabras_antes} → ${data.stats.promedio_palabras_despues} palabras (+${data.stats.mejora_pct}%)`)
        loadGrilla()
      } else {
        alert(data.error || 'Error al mejorar')
      }
    } catch (e) { console.error(e) }
    setImproving(false)
    setInstruccionesMejora('')
  }

  // Delete entire grilla
  const handleDeleteGrilla = async () => {
    if (!grilla || !confirm('¿Eliminar esta grilla completa? Se perderán todos los posts y comentarios.')) return
    try {
      await fetch(`/api/crm/grillas?id=${grilla.id}`, { method: 'DELETE' })
      setGrilla(null)
      loadCliente() // refresh historial
    } catch (e) { console.error(e) }
  }

  // Export to formatted Excel
  const handleExport = () => {
    if (!grilla) return
    window.open(`/api/crm/grillas/exportar?grilla_id=${grilla.id}`, '_blank')
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
            <button onClick={handleGenerarClick} disabled={generating}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50">
              {generating ? '🔄 Generando (~30s)...' : '🤖 Generar con IA'}
            </button>
            {grilla && posts.length > 0 && (
              <button onClick={() => setShowMejorarModal(true)} disabled={improving}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition disabled:opacity-50">
                {improving ? '🔄 Mejorando...' : '✨ Mejorar con IA'}
              </button>
            )}
            <button onClick={() => router.push(`/crm/grillas/${clienteId}/briefing`)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition border ${hasBriefing ? 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' : 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'}`}>
              {hasBriefing ? '📋 Briefing' : '⚠️ Crear Briefing'}
            </button>
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
            {grilla && posts.length > 0 && (
              <button onClick={handleExport} className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition">
                📊 Exportar Excel
              </button>
            )}
            {grilla && (
              <button onClick={handleDeleteGrilla} className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition border border-red-200" title="Eliminar grilla">
                🗑 Eliminar
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

        {/* Month chips — history */}
        {historial.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 mr-1">Meses con grilla:</span>
            {historial.map(h => {
              const isActive = h.mes === mesNum && h.anio === anio
              const colors: Record<string, string> = {
                borrador: 'bg-gray-100 text-gray-600 border-gray-300',
                en_revision: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                aprobado: 'bg-green-100 text-green-700 border-green-300',
                enviado: 'bg-blue-100 text-blue-700 border-blue-300',
              }
              return (
                <button
                  key={`${h.mes}-${h.anio}`}
                  onClick={() => { setMesNum(h.mes); setAnio(h.anio) }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${colors[h.estado] || colors.borrador} ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:opacity-80'}`}
                >
                  {MESES[h.mes].substring(0, 3)} {h.anio}
                </button>
              )
            })}
          </div>
        )}

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
                          onDelete={handleDeletePost}
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
            <button onClick={handleGenerarClick} disabled={generating} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
              {generating ? '🔄 Generando...' : `🤖 Generar Grilla ${MESES[mesNum]} con IA`}
            </button>
          </div>
        )}
      </div>

      {/* Generate modal with month context */}
      {showGenerarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowGenerarModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-5 rounded-t-xl">
              <h2 className="text-lg font-bold">🤖 Generar Grilla — {MESES[mesNum]} {anio}</h2>
              <p className="text-purple-200 text-sm mt-1">{cliente?.nombre} · {grilla && posts.length > 0 ? '⚠️ Se reemplazarán los posts actuales' : 'Se creará una nueva grilla'}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Contexto especial para este mes</label>
                <p className="text-xs text-gray-500 mb-2">Promociones, lanzamientos, eventos, ofertas, productos destacados, noticias del cliente... todo lo que la IA debe considerar además del briefing base.</p>
                <textarea
                  value={contextoMes}
                  onChange={e => setContextoMes(e.target.value)}
                  rows={5}
                  placeholder={"Ej:\n• Lanzamiento nuevo modelo Zero 20 RO en abril\n• Promo 20% dcto primer mes para empresas\n• Participamos en feria ExpoAgua Santiago 15-17 abril\n• Destacar servicio HORECA para restaurantes"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent leading-relaxed"
                />
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-700">La IA usará: briefing del cliente + estacionalidad {MESES[mesNum]} + contingencia Chile + competidores + este contexto. Toma ~30-60 segundos.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowGenerarModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-300">Cancelar</button>
              <button onClick={handleGenerar} className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition">
                🤖 Generar {posts.length > 0 ? '(reemplazar)' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Improve modal */}
      {showMejorarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowMejorarModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white p-5 rounded-t-xl">
              <h2 className="text-lg font-bold">✨ Mejorar Grilla con IA</h2>
              <p className="text-amber-100 text-sm mt-1">Toma los {posts.length} posts actuales y los mejora sin cambiar la estructura</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">¿Qué quieres mejorar? (opcional)</label>
                <textarea
                  value={instruccionesMejora}
                  onChange={e => setInstruccionesMejora(e.target.value)}
                  rows={4}
                  placeholder={"Ej:\n• Hacer los copies más largos y con más datos\n• Mejorar las aperturas, son muy genéricas\n• Agregar más CTA concretos\n• El tono está muy formal, hacerlo más cercano\n• Los carruseles necesitan más detalle en cada slide"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent leading-relaxed"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">La IA mantiene la misma estructura (días, plataformas, tipo de post) pero mejora: copies más largos, aperturas más fuertes, notas internas más detalladas, hashtags más específicos.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowMejorarModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-300">Cancelar</button>
              <button onClick={handleMejorar} className="px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
                ✨ Mejorar Posts
              </button>
            </div>
          </div>
        </div>
      )}

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
