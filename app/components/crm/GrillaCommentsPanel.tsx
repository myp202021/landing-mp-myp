'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GrillaComentario } from './grillas-types'

interface Props {
  grillaId: string
  postId: string
  isPublic?: boolean
  autorDefault?: string
  onClose: () => void
}

export default function GrillaCommentsPanel({ grillaId, postId, isPublic = false, autorDefault = '', onClose }: Props) {
  const [comentarios, setComentarios] = useState<GrillaComentario[]>([])
  const [loading, setLoading] = useState(true)
  const [autor, setAutor] = useState(autorDefault)
  const [texto, setTexto] = useState('')
  const [sending, setSending] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/grillas/comentarios?grilla_id=${grillaId}&post_id=${postId}`)
      const data = await res.json()
      setComentarios(data.comentarios || [])
    } catch (e) {
      console.error('Error loading comments:', e)
    }
    setLoading(false)
  }, [grillaId, postId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleSubmit = async () => {
    if (!autor.trim() || !texto.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/crm/grillas/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grilla_id: grillaId,
          post_id: postId,
          autor: autor.trim(),
          texto: texto.trim(),
          es_cliente: isPublic,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setComentarios(prev => [...prev, data.comentario])
        setTexto('')
      }
    } catch (e) {
      console.error('Error posting comment:', e)
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end p-0 sm:p-4 z-50" onClick={onClose}>
      <div
        className="bg-white h-full sm:h-auto sm:max-h-[85vh] w-full sm:w-[420px] sm:rounded-xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-bold text-gray-900">Comentarios</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading && <p className="text-gray-400 text-sm text-center py-8">Cargando...</p>}
          {!loading && comentarios.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Sin comentarios aún</p>
          )}
          {comentarios.map(c => (
            <div
              key={c.id}
              className={`rounded-lg p-3 ${c.es_cliente ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  {c.autor}
                  {c.es_cliente && <span className="ml-1.5 text-xs font-normal text-blue-600">(Cliente)</span>}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{c.texto}</p>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 px-5 py-4 space-y-3 flex-shrink-0">
          {(isPublic || !autorDefault) && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={autor}
              onChange={e => setAutor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          <div className="flex gap-2">
            <textarea
              placeholder="Escribe un comentario..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              rows={2}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            />
            <button
              onClick={handleSubmit}
              disabled={sending || !autor.trim() || !texto.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              {sending ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
