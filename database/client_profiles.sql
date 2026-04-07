ff
-- =============================================
-- PERFILES DE CLIENTES PARA GENERACIÓN DE GRILLAS
-- Almacena ficha de cada cliente: rubro, web, RRSS, tono, historial
-- =============================================

CREATE TABLE IF NOT EXISTS client_profiles (
  id BIGSERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  rubro TEXT,
  web_url TEXT,
  grilla_historica_url TEXT,
  drive_url TEXT,
  rrss JSONB DEFAULT '[]',

  -- Ficha del agente (generada por Gemini)
  tono TEXT,
  audiencia TEXT,
  productos_servicios TEXT,
  diferenciacion TEXT,
  que_no_hacer TEXT,
  hashtags JSONB DEFAULT '[]',
  keywords JSONB DEFAULT '[]',
  frecuencia_publicacion TEXT,
  plataformas_activas JSONB DEFAULT '[]',

  -- Contexto para generación
  ficha_agente TEXT,
  ficha_generada_at TIMESTAMPTZ,

  -- Estado
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_client_profiles_nombre ON client_profiles(nombre);
CREATE INDEX IF NOT EXISTS idx_client_profiles_cliente ON client_profiles(cliente_id);

-- RLS
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura libre" ON client_profiles FOR SELECT USING (true);
CREATE POLICY "Service role escribe" ON client_profiles FOR ALL USING (true) WITH CHECK (true);
