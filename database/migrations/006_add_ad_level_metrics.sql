-- =====================================================
-- MIGRACION 006: METRICAS A NIVEL DE AD/POST Y PLATAFORMA
-- =====================================================
-- Fecha: 2025-11-20
-- Propósito: Agregar métricas granulares por ad/post y separar Instagram/Facebook

-- 1. Agregar campo publisher_platform a ads_metrics_daily
ALTER TABLE ads_metrics_daily
ADD COLUMN IF NOT EXISTS publisher_platform VARCHAR(50);

COMMENT ON COLUMN ads_metrics_daily.publisher_platform IS 'Plataforma específica: instagram, facebook, audience_network, messenger';

-- 2. Crear tabla para métricas de ads (nivel post/anuncio individual)
CREATE TABLE IF NOT EXISTS ads_metrics_by_ad (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  integration_id INTEGER NOT NULL REFERENCES platform_integrations(id) ON DELETE CASCADE,
  plataforma VARCHAR(50) NOT NULL,

  -- Identificadores de campaña y ad
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  adset_id VARCHAR(255),
  adset_name VARCHAR(255),
  ad_id VARCHAR(255) NOT NULL,
  ad_name VARCHAR(255),
  ad_status VARCHAR(50),

  -- Creativo/Post info
  ad_creative_id VARCHAR(255),
  ad_creative_name VARCHAR(255),
  ad_creative_thumbnail_url TEXT,
  ad_creative_body TEXT,
  ad_creative_link_url TEXT,

  -- Plataforma de publicación
  publisher_platform VARCHAR(50), -- 'instagram', 'facebook', 'audience_network', 'messenger'

  -- Fecha de los datos
  fecha DATE NOT NULL,

  -- Métricas principales
  inversion DECIMAL(12,2) DEFAULT 0,
  impresiones INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversiones DECIMAL(10,2) DEFAULT 0,

  -- Métricas calculadas
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(10,2) DEFAULT 0,
  cpm DECIMAL(10,2) DEFAULT 0,
  cpa DECIMAL(10,2) DEFAULT 0,

  -- Métricas específicas de Meta
  reach INTEGER DEFAULT 0,
  frequency DECIMAL(5,2) DEFAULT 0,

  -- Engagement (específico para posts)
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  video_views INTEGER DEFAULT 0,
  video_avg_watch_time DECIMAL(10,2) DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(cliente_id, integration_id, ad_id, publisher_platform, fecha)
);

-- 3. Crear tabla para contenido orgánico (posts de página, no ads)
CREATE TABLE IF NOT EXISTS organic_content_metrics (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  -- Info de la página de Facebook/Instagram
  page_id VARCHAR(255) NOT NULL,
  page_name VARCHAR(255),
  platform VARCHAR(50) NOT NULL, -- 'facebook_page', 'instagram_business'

  -- Info del post
  post_id VARCHAR(255) NOT NULL,
  post_type VARCHAR(50), -- 'photo', 'video', 'link', 'status', 'carousel'
  post_message TEXT,
  post_created_time TIMESTAMP,
  post_permalink_url TEXT,
  post_thumbnail_url TEXT,

  -- Fecha de las métricas
  fecha DATE NOT NULL,

  -- Métricas de alcance
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,

  -- Engagement
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,

  -- Video metrics (si aplica)
  video_views INTEGER DEFAULT 0,
  video_avg_watch_time DECIMAL(10,2) DEFAULT 0,
  video_complete_views INTEGER DEFAULT 0,

  -- Clicks
  clicks INTEGER DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,

  -- Engagement rate calculado
  engagement_rate DECIMAL(5,2) DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(cliente_id, page_id, post_id, fecha)
);

-- 4. Crear tabla de asignación de páginas a clientes
CREATE TABLE IF NOT EXISTS client_social_pages (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  platform VARCHAR(50) NOT NULL, -- 'facebook_page', 'instagram_business'
  page_id VARCHAR(255) NOT NULL,
  page_name VARCHAR(255),
  page_username VARCHAR(255),
  page_access_token TEXT, -- Token específico de la página

  -- Metadata
  connected_at TIMESTAMP DEFAULT NOW(),
  last_sync TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,

  UNIQUE(cliente_id, platform, page_id)
);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_ads_metrics_by_ad_cliente_fecha ON ads_metrics_by_ad(cliente_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_ads_metrics_by_ad_platform ON ads_metrics_by_ad(publisher_platform);
CREATE INDEX IF NOT EXISTS idx_ads_metrics_by_ad_campaign ON ads_metrics_by_ad(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ads_metrics_by_ad_ad ON ads_metrics_by_ad(ad_id);

CREATE INDEX IF NOT EXISTS idx_organic_content_cliente_fecha ON organic_content_metrics(cliente_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_organic_content_platform ON organic_content_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_organic_content_post ON organic_content_metrics(post_id);

CREATE INDEX IF NOT EXISTS idx_client_social_pages_cliente ON client_social_pages(cliente_id);
CREATE INDEX IF NOT EXISTS idx_client_social_pages_platform ON client_social_pages(platform);

-- 6. Comentarios
COMMENT ON TABLE ads_metrics_by_ad IS 'Métricas diarias por anuncio individual (nivel post)';
COMMENT ON TABLE organic_content_metrics IS 'Métricas de contenido orgánico (no pagado) de páginas de Facebook e Instagram';
COMMENT ON TABLE client_social_pages IS 'Páginas sociales asignadas a cada cliente';

-- =====================================================
-- FIN DE MIGRACION 006
-- =====================================================
