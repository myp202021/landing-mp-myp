-- =====================================================
-- MIGRACION 004: TABLAS DE INTEGRACIONES DE PLATAFORMAS
-- =====================================================
-- Fecha: 2025-11-20
-- Propósito: Permitir integración centralizada de Google Ads, Meta Ads, etc.

-- Tabla de integraciones centralizadas (tokens OAuth de M&P)
CREATE TABLE IF NOT EXISTS platform_integrations (
  id SERIAL PRIMARY KEY,
  plataforma VARCHAR(50) NOT NULL, -- 'google_ads', 'meta_ads', 'ga4', 'linkedin_ads'
  account_id VARCHAR(255) NOT NULL, -- ID de la cuenta en la plataforma
  account_name VARCHAR(255), -- Nombre legible de la cuenta

  -- Tokens OAuth (guardados por M&P, no por el cliente)
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP,

  -- Metadata
  connected_by VARCHAR(255), -- Usuario admin que conectó (email)
  connected_at TIMESTAMP DEFAULT NOW(),
  last_sync TIMESTAMP,
  sync_status VARCHAR(50) DEFAULT 'active', -- 'active', 'error', 'paused'
  sync_error TEXT,
  active BOOLEAN DEFAULT TRUE,

  UNIQUE(plataforma, account_id)
);

-- Tabla de asignación: cuenta de plataforma → cliente del CRM
CREATE TABLE IF NOT EXISTS client_platform_mapping (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  integration_id INTEGER NOT NULL REFERENCES platform_integrations(id) ON DELETE CASCADE,

  -- Metadata
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by VARCHAR(255), -- Usuario admin que asignó
  active BOOLEAN DEFAULT TRUE,

  UNIQUE(cliente_id, integration_id)
);

-- Tabla de cache de métricas diarias (para no llamar APIs constantemente)
CREATE TABLE IF NOT EXISTS ads_metrics_daily (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  integration_id INTEGER NOT NULL REFERENCES platform_integrations(id) ON DELETE CASCADE,
  plataforma VARCHAR(50) NOT NULL,

  -- Identificadores de campaña
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  campaign_status VARCHAR(50), -- 'ACTIVE', 'PAUSED', 'DELETED'

  -- Fecha de los datos
  fecha DATE NOT NULL,

  -- Métricas principales
  inversion DECIMAL(12,2) DEFAULT 0, -- Gasto/Spend
  impresiones INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversiones DECIMAL(10,2) DEFAULT 0,

  -- Métricas calculadas
  ctr DECIMAL(5,2) DEFAULT 0, -- Click-through rate
  cpc DECIMAL(10,2) DEFAULT 0, -- Cost per click
  cpm DECIMAL(10,2) DEFAULT 0, -- Cost per mille (1000 impresiones)
  cpa DECIMAL(10,2) DEFAULT 0, -- Cost per acquisition

  -- Métricas específicas de Meta
  reach INTEGER DEFAULT 0, -- Alcance
  frequency DECIMAL(5,2) DEFAULT 0, -- Frecuencia

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(cliente_id, integration_id, campaign_id, fecha)
);

-- Tabla de promedios históricos pre-calculados
CREATE TABLE IF NOT EXISTS ads_historical_averages (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  plataforma VARCHAR(50),

  -- Periodo del promedio
  periodo VARCHAR(20) NOT NULL, -- '7d', '30d', '90d', '180d', '365d'
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,

  -- Promedios
  avg_ctr DECIMAL(5,2) DEFAULT 0,
  avg_cpc DECIMAL(10,2) DEFAULT 0,
  avg_cpm DECIMAL(10,2) DEFAULT 0,
  avg_conversion_rate DECIMAL(5,2) DEFAULT 0,
  total_inversion DECIMAL(12,2) DEFAULT 0,
  total_conversiones DECIMAL(10,2) DEFAULT 0,

  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(cliente_id, plataforma, periodo)
);

-- Índices para mejorar performance
CREATE INDEX idx_platform_integrations_plataforma ON platform_integrations(plataforma);
CREATE INDEX idx_platform_integrations_active ON platform_integrations(active);
CREATE INDEX idx_client_platform_mapping_cliente ON client_platform_mapping(cliente_id);
CREATE INDEX idx_client_platform_mapping_integration ON client_platform_mapping(integration_id);
CREATE INDEX idx_ads_metrics_cliente_fecha ON ads_metrics_daily(cliente_id, fecha DESC);
CREATE INDEX idx_ads_metrics_plataforma ON ads_metrics_daily(plataforma);
CREATE INDEX idx_ads_metrics_campaign ON ads_metrics_daily(campaign_id);
CREATE INDEX idx_ads_historical_cliente ON ads_historical_averages(cliente_id);

-- Comentarios
COMMENT ON TABLE platform_integrations IS 'Integraciones OAuth centralizadas de plataformas publicitarias (Google Ads, Meta Ads, etc.)';
COMMENT ON TABLE client_platform_mapping IS 'Mapeo de cuentas de plataformas a clientes del CRM';
COMMENT ON TABLE ads_metrics_daily IS 'Cache de métricas diarias de campañas publicitarias';
COMMENT ON TABLE ads_historical_averages IS 'Promedios históricos pre-calculados para comparaciones';

-- =====================================================
-- FIN DE MIGRACION 004
-- =====================================================
