A-- Tabla para suscripciones del producto Radar (clipping como servicio)
-- Ejecutar en Supabase SQL Editor: app.supabase.com → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS clipping_suscripciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  nombre TEXT,
  plan TEXT NOT NULL DEFAULT 'starter',
  periodo TEXT NOT NULL DEFAULT 'mensual',
  estado TEXT NOT NULL DEFAULT 'trial',
  cuentas JSONB NOT NULL DEFAULT '[]'::jsonb,
  emails_destino TEXT[] DEFAULT '{}'::text[],
  keywords_alerta TEXT[] DEFAULT '{}'::text[],
  flow_customer_id TEXT,
  flow_subscription_id TEXT,
  trial_ends TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_clipping_estado ON clipping_suscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_clipping_email ON clipping_suscripciones(email);

-- RLS: desactivado para service_role (los scripts usan service key)
ALTER TABLE clipping_suscripciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON clipping_suscripciones
  FOR ALL USING (true) WITH CHECK (true);
