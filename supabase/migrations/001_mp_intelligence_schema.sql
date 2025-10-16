-- M&P Intelligence Database Schema
-- Migration: 001_mp_intelligence_schema
-- Created: 2025-10-16

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: searches
-- Almacena todas las búsquedas de competidores
-- =====================================================
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- User info
  user_email TEXT,
  user_ip TEXT,

  -- Competitor info
  competitor_name TEXT NOT NULL,
  competitor_url TEXT,
  competitor_fb_page TEXT,
  competitor_industry TEXT,

  -- Search config
  modules_requested JSONB NOT NULL DEFAULT '{}',
  -- Example: {"meta_ads": true, "web_presence": true, "social_activity": false}

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- Values: pending | processing | completed | error

  -- Results
  results_summary JSONB,
  pressure_index INT, -- 0-100

  -- Error handling
  error_message TEXT,
  retry_count INT DEFAULT 0,

  -- Metadata
  processing_time_ms INT,
  api_calls_used JSONB -- Track API usage per module
);

CREATE INDEX idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX idx_searches_status ON searches(status);
CREATE INDEX idx_searches_user_email ON searches(user_email);
CREATE INDEX idx_searches_competitor_name ON searches(competitor_name);

-- =====================================================
-- TABLA: meta_ads_cache
-- Cache de anuncios de Meta Ad Library
-- =====================================================
CREATE TABLE IF NOT EXISTS meta_ads_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Page info
  fb_page_id TEXT NOT NULL,
  fb_page_name TEXT,

  -- Ad info
  ad_id TEXT NOT NULL,
  ad_creative_url TEXT,
  ad_creative_body TEXT,
  ad_snapshot_url TEXT,

  -- Ad metadata
  ad_format TEXT, -- image | video | carousel | collection
  ad_start_date DATE,
  ad_end_date DATE,
  ad_is_active BOOLEAN DEFAULT true,

  -- Creative details
  ad_cta_text TEXT,
  ad_headline TEXT,
  ad_link_description TEXT,

  -- Targeting
  platforms TEXT[], -- {facebook, instagram, messenger, audience_network}
  languages TEXT[],
  regions TEXT[],

  -- Fetch metadata
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(fb_page_id, ad_id)
);

CREATE INDEX idx_meta_ads_page ON meta_ads_cache(fb_page_id);
CREATE INDEX idx_meta_ads_dates ON meta_ads_cache(ad_start_date, ad_end_date);
CREATE INDEX idx_meta_ads_active ON meta_ads_cache(ad_is_active);
CREATE INDEX idx_meta_ads_fetched ON meta_ads_cache(fetched_at DESC);

-- =====================================================
-- TABLA: web_presence_cache
-- Cache de análisis de presencia web
-- =====================================================
CREATE TABLE IF NOT EXISTS web_presence_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- URL
  url TEXT NOT NULL UNIQUE,
  domain TEXT,

  -- PageSpeed scores
  pagespeed_score_mobile INT,
  pagespeed_score_desktop INT,

  -- Core Web Vitals (mobile)
  lcp_mobile FLOAT, -- Largest Contentful Paint (seconds)
  fcp_mobile FLOAT, -- First Contentful Paint (seconds)
  tbt_mobile FLOAT, -- Total Blocking Time (ms)
  cls_mobile FLOAT, -- Cumulative Layout Shift
  speed_index_mobile FLOAT,

  -- Core Web Vitals (desktop)
  lcp_desktop FLOAT,
  fcp_desktop FLOAT,
  tbt_desktop FLOAT,
  cls_desktop FLOAT,
  speed_index_desktop FLOAT,

  -- Technologies detected
  technologies JSONB,
  -- Example: {
  --   "cms": "WordPress",
  --   "analytics": ["Google Analytics 4", "Meta Pixel"],
  --   "tag_manager": ["Google Tag Manager"],
  --   "cdn": ["Cloudflare"],
  --   "hosting": "Vercel"
  -- }

  -- Basic checks
  ssl_valid BOOLEAN,
  ssl_issuer TEXT,
  mobile_friendly BOOLEAN,
  has_sitemap BOOLEAN,
  has_robots_txt BOOLEAN,

  -- Fetch metadata
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fetch_duration_ms INT,

  -- Cache expiry (revalidar después de 7 días)
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX idx_web_presence_url ON web_presence_cache(url);
CREATE INDEX idx_web_presence_domain ON web_presence_cache(domain);
CREATE INDEX idx_web_presence_expires ON web_presence_cache(expires_at);

-- =====================================================
-- TABLA: social_activity_cache
-- Cache de actividad en redes sociales
-- =====================================================
CREATE TABLE IF NOT EXISTS social_activity_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Platform info
  platform TEXT NOT NULL, -- facebook | instagram | youtube | linkedin
  profile_id TEXT NOT NULL,
  profile_name TEXT,
  profile_url TEXT,
  profile_verified BOOLEAN,

  -- Follower metrics
  followers_count INT,
  following_count INT,

  -- Activity metrics (últimos 30 días)
  posts_count_30d INT,
  posts_count_7d INT,
  avg_likes_per_post FLOAT,
  avg_comments_per_post FLOAT,
  avg_shares_per_post FLOAT,
  engagement_rate FLOAT, -- (likes + comments + shares) / followers

  -- Posting patterns
  posting_frequency TEXT, -- daily | 3x_week | weekly | biweekly | monthly | sporadic
  best_posting_day TEXT, -- monday | tuesday | ...
  best_posting_hour INT, -- 0-23

  -- Content analysis
  top_hashtags TEXT[],
  content_types JSONB,
  -- Example: {"image": 45, "video": 30, "link": 15, "text": 10}

  -- Fetch metadata
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),

  UNIQUE(platform, profile_id)
);

CREATE INDEX idx_social_activity_platform ON social_activity_cache(platform);
CREATE INDEX idx_social_activity_profile ON social_activity_cache(profile_id);
CREATE INDEX idx_social_activity_expires ON social_activity_cache(expires_at);

-- =====================================================
-- TABLA: pressure_index_history
-- Histórico del índice de presión publicitaria
-- =====================================================
CREATE TABLE IF NOT EXISTS pressure_index_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_fb_page TEXT NOT NULL,
  competitor_name TEXT,

  -- Index calculation
  pressure_index INT NOT NULL, -- 0-100

  -- Components (para debugging y análisis)
  volume_score FLOAT,      -- Basado en # de anuncios activos
  frequency_score FLOAT,   -- Basado en frecuencia de publicación
  variety_score FLOAT,     -- Basado en variedad de formatos
  duration_score FLOAT,    -- Basado en duración promedio
  social_score FLOAT,      -- Basado en actividad orgánica

  -- Context
  num_active_ads INT,
  num_total_ads_30d INT,

  -- Timestamp
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pressure_history_page ON pressure_index_history(competitor_fb_page);
CREATE INDEX idx_pressure_history_date ON pressure_index_history(calculated_at DESC);

-- =====================================================
-- TABLA: api_usage_tracking
-- Tracking de uso de APIs para rate limiting
-- =====================================================
CREATE TABLE IF NOT EXISTS api_usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT,
  user_ip TEXT,
  api_name TEXT NOT NULL, -- meta_ads | pagespeed | builtwith | etc
  endpoint TEXT,
  calls_count INT DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  hour INT DEFAULT EXTRACT(HOUR FROM NOW()),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_email, api_name, date, hour)
);

CREATE INDEX idx_api_usage_user ON api_usage_tracking(user_email, date);
CREATE INDEX idx_api_usage_api ON api_usage_tracking(api_name, date);

-- =====================================================
-- FUNCIÓN: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a searches
CREATE TRIGGER update_searches_updated_at
  BEFORE UPDATE ON searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIÓN: Increment API usage
-- =====================================================
CREATE OR REPLACE FUNCTION increment_api_usage(
  p_user_email TEXT,
  p_user_ip TEXT,
  p_api_name TEXT,
  p_endpoint TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO api_usage_tracking (user_email, user_ip, api_name, endpoint, date, hour)
  VALUES (p_user_email, p_user_ip, p_api_name, p_endpoint, CURRENT_DATE, EXTRACT(HOUR FROM NOW()))
  ON CONFLICT (user_email, api_name, date, hour)
  DO UPDATE SET calls_count = api_usage_tracking.calls_count + 1;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Check rate limit
-- =====================================================
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_email TEXT,
  p_api_name TEXT,
  p_max_calls_per_hour INT DEFAULT 50
)
RETURNS BOOLEAN AS $$
DECLARE
  v_calls_count INT;
BEGIN
  SELECT COALESCE(SUM(calls_count), 0)
  INTO v_calls_count
  FROM api_usage_tracking
  WHERE user_email = p_user_email
    AND api_name = p_api_name
    AND date = CURRENT_DATE
    AND hour = EXTRACT(HOUR FROM NOW());

  RETURN v_calls_count < p_max_calls_per_hour;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (opcional para multi-tenant)
-- =====================================================
-- ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE meta_ads_cache ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE web_presence_cache ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON TABLE searches IS 'Almacena búsquedas de análisis competitivo';
COMMENT ON TABLE meta_ads_cache IS 'Cache de anuncios de Meta Ad Library';
COMMENT ON TABLE web_presence_cache IS 'Cache de análisis de presencia web';
COMMENT ON TABLE social_activity_cache IS 'Cache de actividad en redes sociales';
COMMENT ON TABLE pressure_index_history IS 'Histórico del índice de presión publicitaria';
COMMENT ON TABLE api_usage_tracking IS 'Tracking de uso de APIs para rate limiting';
