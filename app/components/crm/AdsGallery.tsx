'use client'

import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, Eye, MousePointerClick, TrendingUp, ExternalLink, Instagram, Facebook } from 'lucide-react'
import Image from 'next/image'

interface Ad {
  ad_id: string
  ad_name: string
  ad_status: string
  campaign_name: string
  publisher_platform: string
  ad_creative_thumbnail_url?: string
  ad_creative_body?: string
  ad_creative_link_url?: string
  inversion: number
  impresiones: number
  clicks: number
  conversiones: number
  ctr: number
  cpc: number
  likes: number
  comments: number
  shares: number
  video_views: number
  reach: number
}

interface AdsGalleryProps {
  ads: Ad[]
}

export default function AdsGallery({ ads }: AdsGalleryProps) {
  const [sortBy, setSortBy] = useState<'inversion' | 'clicks' | 'likes'>('inversion')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(num)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    const normalized = platform?.toLowerCase() || ''
    if (normalized.includes('instagram')) {
      return <Instagram className="w-4 h-4 text-pink-600" />
    }
    if (normalized.includes('facebook')) {
      return <Facebook className="w-4 h-4 text-blue-600" />
    }
    return null
  }

  const getPlatformBadge = (platform: string) => {
    const normalized = platform?.toLowerCase() || ''
    if (normalized.includes('instagram')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
          <Instagram className="w-3 h-3" />
          Instagram
        </span>
      )
    }
    if (normalized.includes('facebook')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Facebook className="w-3 h-3" />
          Facebook
        </span>
      )
    }
    if (normalized.includes('audience')) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Audience Network
        </span>
      )
    }
    if (normalized.includes('messenger')) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
          Messenger
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {platform}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
      PAUSED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pausado' },
      ARCHIVED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archivado' }
    }

    const config = statusConfig[status] || statusConfig.PAUSED

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  // Filter ads by platform
  let filteredAds = ads
  if (filterPlatform !== 'all') {
    filteredAds = ads.filter(ad =>
      ad.publisher_platform?.toLowerCase().includes(filterPlatform.toLowerCase())
    )
  }

  // Sort ads
  const sortedAds = [...filteredAds].sort((a, b) => {
    return b[sortBy] - a[sortBy]
  })

  const platforms = ['all', 'instagram', 'facebook', 'audience', 'messenger']
  const platformCounts = {
    all: ads.length,
    instagram: ads.filter(a => a.publisher_platform?.toLowerCase().includes('instagram')).length,
    facebook: ads.filter(a => a.publisher_platform?.toLowerCase().includes('facebook')).length,
    audience: ads.filter(a => a.publisher_platform?.toLowerCase().includes('audience')).length,
    messenger: ads.filter(a => a.publisher_platform?.toLowerCase().includes('messenger')).length
  }

  if (ads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🎨 Anuncios Individuales
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>No hay datos de anuncios disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          🎨 Anuncios Individuales
        </h3>
        <p className="text-sm text-gray-600">
          Rendimiento detallado por cada anuncio/post
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <label className="text-sm font-medium text-gray-700">Filtrar:</label>
          <div className="flex gap-2">
            {platforms.map(platform => {
              const count = platformCounts[platform as keyof typeof platformCounts]
              if (count === 0 && platform !== 'all') return null

              return (
                <button
                  key={platform}
                  onClick={() => setFilterPlatform(platform)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterPlatform === platform
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {platform === 'all' ? `Todos (${count})` : `${platform.charAt(0).toUpperCase() + platform.slice(1)} (${count})`}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="inversion">Inversión</option>
            <option value="clicks">Clicks</option>
            <option value="likes">Engagement</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAds.map((ad) => (
          <div
            key={ad.ad_id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Thumbnail */}
            {ad.ad_creative_thumbnail_url ? (
              <div className="relative w-full h-48 bg-gray-100">
                <img
                  src={ad.ad_creative_thumbnail_url}
                  alt={ad.ad_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Sin imagen</div>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                    {ad.ad_name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {ad.campaign_name}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {getPlatformBadge(ad.publisher_platform)}
                {getStatusBadge(ad.ad_status)}
              </div>

              {/* Body text */}
              {ad.ad_creative_body && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {ad.ad_creative_body}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-xs text-blue-600 font-medium">Inversión</div>
                  <div className="text-sm font-bold text-blue-900">{formatCurrency(ad.inversion)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-xs text-green-600 font-medium">Clicks</div>
                  <div className="text-sm font-bold text-green-900">{formatNumber(ad.clicks)}</div>
                </div>
              </div>

              {/* Engagement */}
              <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatNumber(ad.likes)}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {formatNumber(ad.comments)}
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  {formatNumber(ad.shares)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(ad.reach)}
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-3 border-t border-gray-100 flex justify-between text-xs">
                <div>
                  <span className="text-gray-500">CTR:</span>{' '}
                  <span className="font-medium text-gray-900">{ad.ctr.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-gray-500">CPC:</span>{' '}
                  <span className="font-medium text-gray-900">{formatCurrency(ad.cpc)}</span>
                </div>
                {ad.conversiones > 0 && (
                  <div>
                    <span className="text-gray-500">Conv:</span>{' '}
                    <span className="font-medium text-green-600">{ad.conversiones}</span>
                  </div>
                )}
              </div>

              {/* Link */}
              {ad.ad_creative_link_url && (
                <a
                  href={ad.ad_creative_link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver anuncio
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedAds.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay anuncios para el filtro seleccionado
        </div>
      )}
    </div>
  )
}
