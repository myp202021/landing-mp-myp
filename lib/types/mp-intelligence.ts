/**
 * M&P Intelligence - TypeScript Types
 * Tipos para análisis de inteligencia competitiva
 */

// =====================================================
// ENUMS
// =====================================================

export enum SearchStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum AdFormat {
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  COLLECTION = 'collection',
}

export enum Platform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  MESSENGER = 'messenger',
  AUDIENCE_NETWORK = 'audience_network',
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  LINKEDIN = 'linkedin',
}

export enum PostingFrequency {
  DAILY = 'daily',
  THREE_PER_WEEK = '3x_week',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  SPORADIC = 'sporadic',
}

// =====================================================
// SEARCH TYPES
// =====================================================

export interface SearchRequest {
  competitor_name: string
  competitor_url?: string
  competitor_fb_page?: string
  competitor_industry?: string
  modules: {
    meta_ads: boolean
    web_presence: boolean
    social_activity: boolean
  }
  user_email?: string
}

export interface Search {
  id: string
  created_at: string
  updated_at: string
  user_email?: string
  competitor_name: string
  competitor_url?: string
  competitor_fb_page?: string
  competitor_industry?: string
  modules_requested: Record<string, boolean>
  status: SearchStatus
  results_summary?: SearchResults
  pressure_index?: number
  error_message?: string
  processing_time_ms?: number
}

export interface SearchResults {
  meta_ads?: MetaAdsResults
  web_presence?: WebPresenceResults
  social_activity?: SocialActivityResults
  pressure_index: number
  generated_at: string
}

// =====================================================
// META ADS TYPES
// =====================================================

export interface MetaAd {
  id: string
  fb_page_id: string
  fb_page_name?: string
  ad_id: string
  ad_creative_url?: string
  ad_creative_body?: string
  ad_snapshot_url?: string
  ad_format: AdFormat
  ad_start_date: string
  ad_end_date?: string
  ad_is_active: boolean
  ad_cta_text?: string
  ad_headline?: string
  ad_link_description?: string
  platforms: Platform[]
  languages?: string[]
  regions?: string[]
  fetched_at: string
  last_seen_at: string
}

export interface MetaAdsResults {
  page_id: string
  page_name: string
  total_ads_30d: number
  total_ads_7d: number
  active_ads_now: number
  ads: MetaAd[]

  // Analytics
  format_distribution: Record<AdFormat, number>
  platform_distribution: Record<Platform, number>
  avg_ad_duration_days: number
  posting_frequency: PostingFrequency

  // Top insights
  top_ctas: Array<{ text: string; count: number }>
  top_headlines: Array<{ text: string; count: number }>

  // Timeline
  timeline: Array<{
    date: string
    new_ads: number
    stopped_ads: number
    active_ads: number
  }>

  // Scores
  volume_score: number // 0-100
  frequency_score: number // 0-100
  variety_score: number // 0-100

  fetched_at: string
}

// =====================================================
// WEB PRESENCE TYPES
// =====================================================

export interface CoreWebVitals {
  lcp: number // Largest Contentful Paint (seconds)
  fcp: number // First Contentful Paint (seconds)
  tbt: number // Total Blocking Time (ms)
  cls: number // Cumulative Layout Shift
  speed_index: number
}

export interface TechnologyStack {
  cms?: string
  analytics?: string[]
  tag_manager?: string[]
  cdn?: string[]
  hosting?: string
  ecommerce?: string
  marketing_tools?: string[]
}

export interface WebPresenceResults {
  url: string
  domain: string

  // PageSpeed scores
  pagespeed_score_mobile: number
  pagespeed_score_desktop: number

  // Core Web Vitals
  cwv_mobile: CoreWebVitals
  cwv_desktop: CoreWebVitals

  // Technologies
  technologies: TechnologyStack

  // Basic checks
  ssl_valid: boolean
  ssl_issuer?: string
  mobile_friendly: boolean
  has_sitemap: boolean
  has_robots_txt: boolean

  // Comparison
  industry_benchmark?: {
    avg_pagespeed_mobile: number
    avg_lcp: number
  }

  fetched_at: string
}

// =====================================================
// SOCIAL ACTIVITY TYPES
// =====================================================

export interface SocialProfile {
  platform: SocialPlatform
  profile_id: string
  profile_name: string
  profile_url: string
  profile_verified: boolean

  // Followers
  followers_count: number
  following_count?: number

  // Activity
  posts_count_30d: number
  posts_count_7d: number
  avg_likes_per_post: number
  avg_comments_per_post: number
  avg_shares_per_post?: number
  engagement_rate: number // percentage

  // Patterns
  posting_frequency: PostingFrequency
  best_posting_day?: string
  best_posting_hour?: number

  // Content
  top_hashtags: string[]
  content_types: Record<string, number> // {image: 45, video: 30, ...}

  fetched_at: string
}

export interface SocialActivityResults {
  profiles: SocialProfile[]

  // Aggregated metrics
  total_followers: number
  avg_engagement_rate: number
  total_posts_30d: number

  // Cross-platform insights
  most_active_platform: SocialPlatform
  best_performing_content_type: string

  // Score
  social_activity_score: number // 0-100

  fetched_at: string
}

// =====================================================
// PRESSURE INDEX TYPES
// =====================================================

export interface PressureIndexComponents {
  volume_score: number // 0-100 (based on # of active ads)
  frequency_score: number // 0-100 (based on posting frequency)
  variety_score: number // 0-100 (based on format variety)
  duration_score: number // 0-100 (based on avg ad duration)
  social_score: number // 0-100 (based on organic activity)
}

export interface PressureIndex {
  overall_score: number // 0-100
  components: PressureIndexComponents
  context: {
    num_active_ads: number
    num_total_ads_30d: number
  }
  calculated_at: string
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SearchResponse extends ApiResponse {
  data: {
    search_id: string
    status: SearchStatus
    estimated_time_seconds: number
  }
}

export interface ResultsResponse extends ApiResponse {
  data: {
    search: Search
    results: SearchResults
  }
}

// =====================================================
// CACHE TYPES
// =====================================================

export interface CacheEntry<T = any> {
  data: T
  fetched_at: string
  expires_at: string
  is_fresh: boolean
}

// =====================================================
// RATE LIMITING TYPES
// =====================================================

export interface RateLimitConfig {
  max_searches_per_day: number
  max_api_calls_per_hour: number
}

export interface RateLimitStatus {
  remaining_searches: number
  remaining_api_calls: number
  reset_at: string
  is_allowed: boolean
}

// =====================================================
// EXPORT PDF TYPES
// =====================================================

export interface PDFExportOptions {
  search_id: string
  include_modules: {
    meta_ads: boolean
    web_presence: boolean
    social_activity: boolean
  }
  branding: {
    logo_url?: string
    company_name: string
    footer_text?: string
  }
}

export interface PDFExportResult {
  pdf_url: string
  filename: string
  size_bytes: number
  generated_at: string
}
