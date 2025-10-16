/**
 * Meta Ads Library Service
 * Interactúa con la API oficial de Meta Ad Library
 * Docs: https://www.facebook.com/ads/library/api/
 */

import type { MetaAd, AdFormat, Platform, PostingFrequency } from '@/lib/types/mp-intelligence'

// =====================================================
// CONSTANTS
// =====================================================

const META_API_VERSION = 'v21.0'
const META_AD_LIBRARY_URL = `https://graph.facebook.com/${META_API_VERSION}/ads_archive`

// =====================================================
// TYPES
// =====================================================

interface MetaAdLibraryParams {
  access_token: string
  ad_reached_countries?: string // 'CL' for Chile
  search_terms?: string
  search_page_ids?: string
  ad_active_status?: 'ACTIVE' | 'INACTIVE' | 'ALL'
  ad_delivery_date_min?: string // YYYY-MM-DD
  ad_delivery_date_max?: string // YYYY-MM-DD
  limit?: number // Max 500
  fields?: string
}

interface MetaAdRawData {
  id: string
  ad_creation_time: string
  ad_creative_body: string
  ad_creative_link_caption?: string
  ad_creative_link_description?: string
  ad_creative_link_title?: string
  ad_delivery_start_time: string
  ad_delivery_stop_time?: string
  ad_snapshot_url: string
  page_id: string
  page_name: string
  languages?: string[]
  publisher_platforms?: string[]
  estimated_audience_size?: {
    lower_bound: number
    upper_bound: number
  }
}

// =====================================================
// SERVICE CLASS
// =====================================================

export class MetaAdsService {
  private accessToken: string

  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error('Meta access token is required')
    }
    this.accessToken = accessToken
  }

  /**
   * Busca anuncios activos de una página de Facebook
   */
  async searchAdsByPageId(
    pageId: string,
    options: {
      activeStatus?: 'ACTIVE' | 'INACTIVE' | 'ALL'
      dateMin?: Date
      dateMax?: Date
      limit?: number
    } = {}
  ): Promise<MetaAd[]> {
    const {
      activeStatus = 'ALL',
      dateMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      dateMax = new Date(),
      limit = 500,
    } = options

    try {
      const params: MetaAdLibraryParams = {
        access_token: this.accessToken,
        ad_reached_countries: 'CL',
        search_page_ids: pageId,
        ad_active_status: activeStatus,
        ad_delivery_date_min: this.formatDate(dateMin),
        ad_delivery_date_max: this.formatDate(dateMax),
        limit,
        fields: [
          'id',
          'ad_creation_time',
          'ad_creative_body',
          'ad_creative_link_caption',
          'ad_creative_link_description',
          'ad_creative_link_title',
          'ad_delivery_start_time',
          'ad_delivery_stop_time',
          'ad_snapshot_url',
          'page_id',
          'page_name',
          'languages',
          'publisher_platforms',
        ].join(','),
      }

      const url = this.buildUrl(params)
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Meta API Error: ${error.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()

      if (!data.data || !Array.isArray(data.data)) {
        return []
      }

      return data.data.map((rawAd: MetaAdRawData) => this.transformRawAd(rawAd))
    } catch (error) {
      console.error('Error fetching Meta ads:', error)
      throw error
    }
  }

  /**
   * Busca anuncios por término de búsqueda (nombre de marca/empresa)
   */
  async searchAdsByTerm(
    searchTerm: string,
    options: {
      activeStatus?: 'ACTIVE' | 'INACTIVE' | 'ALL'
      dateMin?: Date
      dateMax?: Date
      limit?: number
    } = {}
  ): Promise<MetaAd[]> {
    const {
      activeStatus = 'ALL',
      dateMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dateMax = new Date(),
      limit = 500,
    } = options

    try {
      const params: MetaAdLibraryParams = {
        access_token: this.accessToken,
        ad_reached_countries: 'CL',
        search_terms: searchTerm,
        ad_active_status: activeStatus,
        ad_delivery_date_min: this.formatDate(dateMin),
        ad_delivery_date_max: this.formatDate(dateMax),
        limit,
        fields: [
          'id',
          'ad_creation_time',
          'ad_creative_body',
          'ad_creative_link_caption',
          'ad_creative_link_description',
          'ad_creative_link_title',
          'ad_delivery_start_time',
          'ad_delivery_stop_time',
          'ad_snapshot_url',
          'page_id',
          'page_name',
          'languages',
          'publisher_platforms',
        ].join(','),
      }

      const url = this.buildUrl(params)
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Meta API Error: ${error.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()

      if (!data.data || !Array.isArray(data.data)) {
        return []
      }

      return data.data.map((rawAd: MetaAdRawData) => this.transformRawAd(rawAd))
    } catch (error) {
      console.error('Error fetching Meta ads:', error)
      throw error
    }
  }

  /**
   * Valida si una página de Facebook existe y tiene anuncios
   */
  async validatePageId(pageId: string): Promise<{ exists: boolean; hasAds: boolean; pageName?: string }> {
    try {
      const ads = await this.searchAdsByPageId(pageId, { limit: 1 })

      if (ads.length === 0) {
        // Página podría existir pero no tiene ads
        // Intentar buscar con status INACTIVE también
        const inactiveAds = await this.searchAdsByPageId(pageId, {
          activeStatus: 'INACTIVE',
          limit: 1,
        })

        return {
          exists: inactiveAds.length > 0,
          hasAds: false,
        }
      }

      return {
        exists: true,
        hasAds: true,
        pageName: ads[0].fb_page_name,
      }
    } catch (error) {
      return {
        exists: false,
        hasAds: false,
      }
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private buildUrl(params: MetaAdLibraryParams): string {
    const queryString = new URLSearchParams(params as any).toString()
    return `${META_AD_LIBRARY_URL}?${queryString}`
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private transformRawAd(rawAd: MetaAdRawData): MetaAd {
    const now = new Date()
    const endDate = rawAd.ad_delivery_stop_time ? new Date(rawAd.ad_delivery_stop_time) : null
    const isActive = !endDate || endDate > now

    return {
      id: rawAd.id,
      fb_page_id: rawAd.page_id,
      fb_page_name: rawAd.page_name,
      ad_id: rawAd.id,
      ad_creative_body: rawAd.ad_creative_body,
      ad_snapshot_url: rawAd.ad_snapshot_url,
      ad_format: this.detectAdFormat(rawAd),
      ad_start_date: rawAd.ad_delivery_start_time,
      ad_end_date: rawAd.ad_delivery_stop_time,
      ad_is_active: isActive,
      ad_cta_text: rawAd.ad_creative_link_caption,
      ad_headline: rawAd.ad_creative_link_title,
      ad_link_description: rawAd.ad_creative_link_description,
      platforms: this.mapPlatforms(rawAd.publisher_platforms || []),
      languages: rawAd.languages,
      regions: ['CL'], // We're only searching Chile
      fetched_at: now.toISOString(),
      last_seen_at: now.toISOString(),
    }
  }

  private detectAdFormat(rawAd: MetaAdRawData): AdFormat {
    // Meta API no siempre expone el formato directamente
    // Intentamos inferirlo del snapshot URL o datos disponibles
    // Por defecto asumimos IMAGE, pero esto podría mejorarse
    return AdFormat.IMAGE
  }

  private mapPlatforms(platforms: string[]): Platform[] {
    const mapping: Record<string, Platform> = {
      facebook: Platform.FACEBOOK,
      instagram: Platform.INSTAGRAM,
      messenger: Platform.MESSENGER,
      audience_network: Platform.AUDIENCE_NETWORK,
    }

    return platforms
      .map((p) => mapping[p.toLowerCase()])
      .filter((p) => p !== undefined)
  }
}

// =====================================================
// ANALYTICS UTILITIES
// =====================================================

export function calculateFormatDistribution(ads: MetaAd[]): Record<AdFormat, number> {
  const distribution: Record<AdFormat, number> = {
    [AdFormat.IMAGE]: 0,
    [AdFormat.VIDEO]: 0,
    [AdFormat.CAROUSEL]: 0,
    [AdFormat.COLLECTION]: 0,
  }

  ads.forEach((ad) => {
    distribution[ad.ad_format]++
  })

  return distribution
}

export function calculatePlatformDistribution(ads: MetaAd[]): Record<Platform, number> {
  const distribution: Record<Platform, number> = {
    [Platform.FACEBOOK]: 0,
    [Platform.INSTAGRAM]: 0,
    [Platform.MESSENGER]: 0,
    [Platform.AUDIENCE_NETWORK]: 0,
  }

  ads.forEach((ad) => {
    ad.platforms.forEach((platform) => {
      distribution[platform]++
    })
  })

  return distribution
}

export function calculateAverageAdDuration(ads: MetaAd[]): number {
  const adsWithEndDate = ads.filter((ad) => ad.ad_end_date)

  if (adsWithEndDate.length === 0) {
    // Si no hay ads terminados, calcular duración de los activos hasta hoy
    const activeAds = ads.filter((ad) => ad.ad_is_active)
    if (activeAds.length === 0) return 0

    const now = new Date()
    const durations = activeAds.map((ad) => {
      const start = new Date(ad.ad_start_date)
      return (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    })

    return durations.reduce((sum, d) => sum + d, 0) / durations.length
  }

  const durations = adsWithEndDate.map((ad) => {
    const start = new Date(ad.ad_start_date)
    const end = new Date(ad.ad_end_date!)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  })

  return durations.reduce((sum, d) => sum + d, 0) / durations.length
}

export function calculatePostingFrequency(ads: MetaAd[]): PostingFrequency {
  if (ads.length === 0) return PostingFrequency.SPORADIC

  // Ordenar por fecha
  const sorted = [...ads].sort(
    (a, b) => new Date(a.ad_start_date).getTime() - new Date(b.ad_start_date).getTime()
  )

  // Calcular intervalo promedio entre anuncios
  const intervals: number[] = []
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].ad_start_date)
    const curr = new Date(sorted[i].ad_start_date)
    const daysDiff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    intervals.push(daysDiff)
  }

  if (intervals.length === 0) return PostingFrequency.SPORADIC

  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length

  if (avgInterval <= 1.5) return PostingFrequency.DAILY
  if (avgInterval <= 3) return PostingFrequency.THREE_PER_WEEK
  if (avgInterval <= 7) return PostingFrequency.WEEKLY
  if (avgInterval <= 14) return PostingFrequency.BIWEEKLY
  if (avgInterval <= 30) return PostingFrequency.MONTHLY

  return PostingFrequency.SPORADIC
}

export function extractTopCTAs(ads: MetaAd[], limit = 5): Array<{ text: string; count: number }> {
  const ctaCounts = new Map<string, number>()

  ads.forEach((ad) => {
    if (ad.ad_cta_text) {
      const current = ctaCounts.get(ad.ad_cta_text) || 0
      ctaCounts.set(ad.ad_cta_text, current + 1)
    }
  })

  return Array.from(ctaCounts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function extractTopHeadlines(ads: MetaAd[], limit = 5): Array<{ text: string; count: number }> {
  const headlineCounts = new Map<string, number>()

  ads.forEach((ad) => {
    if (ad.ad_headline) {
      const current = headlineCounts.get(ad.ad_headline) || 0
      headlineCounts.set(ad.ad_headline, current + 1)
    }
  })

  return Array.from(headlineCounts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function generateTimeline(
  ads: MetaAd[],
  startDate: Date,
  endDate: Date
): Array<{ date: string; new_ads: number; stopped_ads: number; active_ads: number }> {
  const timeline: Array<{
    date: string
    new_ads: number
    stopped_ads: number
    active_ads: number
  }> = []

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]

    const newAds = ads.filter((ad) => ad.ad_start_date.startsWith(dateStr)).length

    const stoppedAds = ads.filter((ad) => ad.ad_end_date && ad.ad_end_date.startsWith(dateStr)).length

    const activeAds = ads.filter((ad) => {
      const start = new Date(ad.ad_start_date)
      const end = ad.ad_end_date ? new Date(ad.ad_end_date) : new Date()
      return start <= currentDate && end >= currentDate
    }).length

    timeline.push({
      date: dateStr,
      new_ads: newAds,
      stopped_ads: stoppedAds,
      active_ads: activeAds,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return timeline
}
