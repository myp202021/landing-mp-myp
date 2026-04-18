-- Tabla para persistir posts scrapeados (base para benchmarking acumulativo)
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS radar_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  suscripcion_id UUID REFERENCES clipping_suscripciones(id),
  red TEXT NOT NULL,
  handle TEXT NOT NULL,
  nombre_empresa TEXT,
  post_url TEXT,
  texto TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  tipo_post TEXT,
  keywords_match TEXT[],
  fecha_post TIMESTAMPTZ,
  fecha_scrape DATE NOT NULL DEFAULT CURRENT_DATE,
  modo TEXT DEFAULT 'diario',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_radar_posts_suscripcion ON radar_posts(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_radar_posts_handle ON radar_posts(handle);
CREATE INDEX IF NOT EXISTS idx_radar_posts_fecha ON radar_posts(fecha_scrape);
CREATE INDEX IF NOT EXISTS idx_radar_posts_red ON radar_posts(red);

ALTER TABLE radar_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON radar_posts
  FOR ALL USING (true) WITH CHECK (true);
