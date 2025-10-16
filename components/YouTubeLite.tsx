'use client'

/**
 * YouTube Lite Embed Component
 * Lazy loads YouTube videos only when clicked
 * Saves ~2,500 KiB per video on initial load
 */

import { useState } from 'react'
import Image from 'next/image'

interface YouTubeLiteProps {
  videoId: string
  title: string
  thumbnailQuality?: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault'
}

export default function YouTubeLite({
  videoId,
  title,
  thumbnailQuality = 'hqdefault'
}: YouTubeLiteProps) {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/${thumbnailQuality}.jpg`
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`

  if (isIframeLoaded) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={iframeSrc}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    )
  }

  return (
    <button
      onClick={() => setIsIframeLoaded(true)}
      className="relative w-full h-full group cursor-pointer bg-black"
      aria-label={`Reproducir video: ${title}`}
    >
      {/* Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover"
        loading="lazy"
        quality={85}
      />

      {/* Overlay oscuro en hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform shadow-2xl">
          <svg
            className="w-12 h-12 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Etiqueta "YouTube" estilo oficial */}
      <div className="absolute bottom-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
        YOUTUBE
      </div>
    </button>
  )
}
