'use client'

import { useState } from 'react'
import { GrillaPost, getPlatformStyle } from './grillas-mock-data'

interface GrillaPostCardProps {
  post: GrillaPost
  showNotas?: boolean
  onEdit?: (post: GrillaPost) => void
  onDelete?: (postId: string) => void
  commentCount?: number
  onCommentClick?: (postId: string) => void
}

export default function GrillaPostCard({ post, showNotas = true, onEdit, onDelete, commentCount, onCommentClick }: GrillaPostCardProps) {
  const [expanded, setExpanded] = useState(false)
  const platform = getPlatformStyle(post.plataforma)

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-4 flex flex-col gap-3">
      {/* Header: día + plataforma + tipo + actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${platform.bg} ${platform.text}`}>
            {platform.label}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {post.tipo_post}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-500">
          {post.dia_semana} {post.dia}
        </span>
      </div>

      {/* Copy */}
      {!post.copy || post.copy.trim().length < 10 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-2">Sin copy — genera con IA o escribe manualmente</p>
          {onEdit && (
            <button onClick={() => onEdit(post)} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition">
              🤖 Generar con IA
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <p className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${!expanded ? 'line-clamp-3' : ''}`}>
            {post.copy}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
          >
            {expanded ? '← Ver menos' : 'Ver más →'}
          </button>
      </div>

      )}

      {/* Hashtags */}
      {post.hashtags && (
        <p className="text-xs text-blue-500 leading-relaxed">
          {post.hashtags}
        </p>
      )}

      {/* Nota interna (solo admin) */}
      {showNotas && post.nota_interna && !post.nota_interna.startsWith('undefined') && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          <p className="text-xs font-semibold text-amber-700 mb-0.5">Nota interna</p>
          <p className="text-xs text-amber-800 leading-relaxed">{post.nota_interna}</p>
        </div>
      )}

      {/* Action buttons bar */}
      {(onEdit || onCommentClick) && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={() => onEdit(post)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition border border-blue-200"
            >
              ✏️ Editar
            </button>
          )}
          {onCommentClick && (
            <button
              onClick={() => onCommentClick(post.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition border border-gray-200 relative"
            >
              💬 Comentar
              {(commentCount ?? 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {commentCount}
                </span>
              )}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="w-9 flex items-center justify-center py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-semibold transition border border-red-200"
              title="Eliminar post"
            >
              🗑
            </button>
          )}
        </div>
      )}
    </div>
  )
}
