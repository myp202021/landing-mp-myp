'use client'

import { useState } from 'react'
import { GrillaPost, getPlatformStyle } from './grillas-mock-data'

interface GrillaPostCardProps {
  post: GrillaPost
  showNotas?: boolean
  onEdit?: (post: GrillaPost) => void
  commentCount?: number
  onCommentClick?: (postId: string) => void
}

export default function GrillaPostCard({ post, showNotas = true, onEdit, commentCount, onCommentClick }: GrillaPostCardProps) {
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
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(post)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition text-xs"
              title="Editar post"
            >
              ✏️
            </button>
          )}
          {onCommentClick && (
            <button
              onClick={() => onCommentClick(post.id)}
              className="relative w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition text-xs"
              title="Comentarios"
            >
              💬
              {(commentCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {commentCount}
                </span>
              )}
            </button>
          )}
          <span className="text-sm font-semibold text-gray-500">
            {post.dia_semana} {post.dia}
          </span>
        </div>
      </div>

      {/* Copy */}
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

      {/* Hashtags */}
      <p className="text-xs text-blue-500 leading-relaxed">
        {post.hashtags}
      </p>

      {/* Nota interna (solo admin) */}
      {showNotas && post.nota_interna && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          <p className="text-xs font-semibold text-amber-700 mb-0.5">Nota interna</p>
          <p className="text-xs text-amber-800 leading-relaxed">{post.nota_interna}</p>
        </div>
      )}
    </div>
  )
}
