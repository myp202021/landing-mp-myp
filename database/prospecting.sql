-- =============================================
-- SISTEMA DE PROSPECCIÓN AUTOMÁTICA M&P
-- Tablas: companies, company_contacts, benchmarks,
--         outreach_sequences, outreach_events
-- =============================================

-- 1. EMPRESAS DESCUBIERTAS
CREATE TABLE IF NOT EXISTS prospect_companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Chile',
  industry TEXT NOT NULL,
  category TEXT,
  rating NUMERIC(2,1),
  reviews_count INTEGER DEFAULT 0,

  -- Redes sociales
  instagram_url TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,

  -- Estado del pipeline
  status TEXT DEFAULT 'discovered' CHECK (status IN (
    'discovered', 'enriched', 'benchmarked', 'qualified', 'emailed', 'replied', 'converted', 'disqualified'
  )),

  -- Fuente
  source TEXT DEFAULT 'google_maps',
  source_query TEXT,
  batch_id TEXT,

  -- Dedup
  website_domain TEXT GENERATED ALWAYS AS (
    CASE WHEN website IS NOT NULL
      THEN lower(regexp_replace(regexp_replace(website, '^https?://(www\.)?', ''), '/.*$', ''))
      ELSE NULL
    END
  ) STORED,

  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_prospect_companies_domain
  ON prospect_companies(website_domain) WHERE website_domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prospect_companies_industry ON prospect_companies(industry);
CREATE INDEX IF NOT EXISTS idx_prospect_companies_status ON prospect_companies(status);
CREATE INDEX IF NOT EXISTS idx_prospect_companies_batch ON prospect_companies(batch_id);

-- 2. CONTACTOS DE EMPRESAS
CREATE TABLE IF NOT EXISTS prospect_contacts (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES prospect_companies(id) ON DELETE CASCADE,
  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_role TEXT,
  email_type TEXT DEFAULT 'unknown' CHECK (email_type IN (
    'generic', 'sales', 'support', 'personal', 'info', 'unknown'
  )),
  is_primary BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'website',
  is_valid BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prospect_contacts_company ON prospect_contacts(company_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_prospect_contacts_email_company
  ON prospect_contacts(company_id, contact_email);

-- 3. BENCHMARKS
CREATE TABLE IF NOT EXISTS prospect_benchmarks (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES prospect_companies(id) ON DELETE CASCADE,

  -- Scores individuales
  website_score NUMERIC(4,1) DEFAULT 0,      -- /20
  instagram_score NUMERIC(4,1) DEFAULT 0,    -- /15
  linkedin_score NUMERIC(4,1) DEFAULT 0,     -- /15
  facebook_score NUMERIC(4,1) DEFAULT 0,     -- /10
  seo_score NUMERIC(4,1) DEFAULT 0,          -- /10
  paid_readiness_score NUMERIC(4,1) DEFAULT 0, -- /15
  brand_clarity_score NUMERIC(4,1) DEFAULT 0,  -- /10
  technical_score NUMERIC(4,1) DEFAULT 0,      -- /5
  final_score NUMERIC(4,1) DEFAULT 0,         -- /100

  -- Datos crudos
  pagespeed_mobile INTEGER,
  pagespeed_desktop INTEGER,
  has_analytics BOOLEAN DEFAULT FALSE,
  has_meta_pixel BOOLEAN DEFAULT FALSE,
  has_form BOOLEAN DEFAULT FALSE,
  has_whatsapp BOOLEAN DEFAULT FALSE,
  has_cta BOOLEAN DEFAULT FALSE,
  has_ssl BOOLEAN DEFAULT FALSE,
  technologies_detected JSONB DEFAULT '[]',

  -- RRSS métricas
  ig_followers INTEGER,
  ig_posts_30d INTEGER,
  ig_engagement_rate NUMERIC(5,2),
  ig_last_post_date TIMESTAMPTZ,
  ig_content_types JSONB DEFAULT '{}',

  li_followers INTEGER,
  li_posts_30d INTEGER,
  li_engagement_rate NUMERIC(5,2),
  li_last_post_date TIMESTAMPTZ,

  fb_followers INTEGER,
  fb_posts_30d INTEGER,
  fb_engagement_rate NUMERIC(5,2),
  fb_last_post_date TIMESTAMPTZ,
  fb_has_ads BOOLEAN DEFAULT FALSE,

  -- Análisis
  fortalezas JSONB DEFAULT '[]',
  brechas JSONB DEFAULT '[]',
  acciones JSONB DEFAULT '[]',
  resumen_ejecutivo TEXT,
  angulo_comercial TEXT,

  -- Comparativo con competidores
  industry_avg_score NUMERIC(4,1),
  competitors_analyzed INTEGER DEFAULT 0,
  competitor_scores JSONB DEFAULT '[]',

  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prospect_benchmarks_company ON prospect_benchmarks(company_id);
CREATE INDEX IF NOT EXISTS idx_prospect_benchmarks_score ON prospect_benchmarks(final_score);

-- 4. SECUENCIAS DE OUTREACH
CREATE TABLE IF NOT EXISTS prospect_outreach (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES prospect_companies(id) ON DELETE CASCADE,
  contact_id BIGINT REFERENCES prospect_contacts(id) ON DELETE SET NULL,
  benchmark_id BIGINT REFERENCES prospect_benchmarks(id) ON DELETE SET NULL,

  sequence_name TEXT DEFAULT 'benchmark_outbound',
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'email_1_sent', 'email_2_sent', 'email_3_sent',
    'replied', 'bounced', 'unsubscribed', 'completed', 'cancelled'
  )),
  current_step INTEGER DEFAULT 0,
  next_send_at TIMESTAMPTZ,

  email_1_sent_at TIMESTAMPTZ,
  email_2_sent_at TIMESTAMPTZ,
  email_3_sent_at TIMESTAMPTZ,

  email_1_subject TEXT,
  email_1_html TEXT,
  email_2_subject TEXT,
  email_2_html TEXT,
  email_3_subject TEXT,
  email_3_html TEXT,

  resend_message_ids JSONB DEFAULT '[]',

  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prospect_outreach_status ON prospect_outreach(status);
CREATE INDEX IF NOT EXISTS idx_prospect_outreach_next_send ON prospect_outreach(next_send_at)
  WHERE status NOT IN ('replied', 'bounced', 'unsubscribed', 'completed', 'cancelled');

-- 5. EVENTOS DE EMAIL
CREATE TABLE IF NOT EXISTS prospect_outreach_events (
  id BIGSERIAL PRIMARY KEY,
  outreach_id BIGINT REFERENCES prospect_outreach(id) ON DELETE CASCADE,
  resend_message_id TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed'
  )),
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  payload JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_prospect_events_outreach ON prospect_outreach_events(outreach_id);

-- 6. LISTA DE SUPRESIÓN
CREATE TABLE IF NOT EXISTS prospect_suppressions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  reason TEXT CHECK (reason IN ('bounced', 'unsubscribed', 'complained', 'manual')),
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES
ALTER TABLE prospect_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_suppressions ENABLE ROW LEVEL SECURITY;

-- Lectura libre (para el CRM admin)
CREATE POLICY "Lectura libre" ON prospect_companies FOR SELECT USING (true);
CREATE POLICY "Lectura libre" ON prospect_contacts FOR SELECT USING (true);
CREATE POLICY "Lectura libre" ON prospect_benchmarks FOR SELECT USING (true);
CREATE POLICY "Lectura libre" ON prospect_outreach FOR SELECT USING (true);
CREATE POLICY "Lectura libre" ON prospect_outreach_events FOR SELECT USING (true);
CREATE POLICY "Lectura libre" ON prospect_suppressions FOR SELECT USING (true);

-- Escritura solo service role
CREATE POLICY "Service role escribe" ON prospect_companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role escribe" ON prospect_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role escribe" ON prospect_benchmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role escribe" ON prospect_outreach FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role escribe" ON prospect_outreach_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role escribe" ON prospect_suppressions FOR ALL USING (true) WITH CHECK (true);

-- Trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION update_prospect_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prospect_companies_updated
  BEFORE UPDATE ON prospect_companies
  FOR EACH ROW EXECUTE FUNCTION update_prospect_timestamp();
