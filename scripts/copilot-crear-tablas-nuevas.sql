-- ═══════════════════════════════════════════════
-- TABLAS NUEVAS PARA COPILOT — Abril 2026
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Aprendizajes persistentes (memoria inter-run)
CREATE TABLE IF NOT EXISTS copilot_aprendizajes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  suscripcion_id uuid REFERENCES clipping_suscripciones(id) ON DELETE CASCADE,
  agente text NOT NULL, -- qué agente generó el aprendizaje (contenido, auditoria, benchmark, cliente, etc)
  tipo text NOT NULL, -- patron | insight | alerta | preferencia_cliente
  aprendizaje text NOT NULL, -- la conclusión
  confianza float DEFAULT 0.5, -- 0.0 a 1.0, sube con confirmaciones
  confirmaciones int DEFAULT 1, -- cuántas veces se confirmó
  contexto jsonb DEFAULT '{}', -- datos de soporte
  activo boolean DEFAULT true, -- false si fue invalidado
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aprendizajes_sub ON copilot_aprendizajes(suscripcion_id, activo);
CREATE INDEX IF NOT EXISTS idx_aprendizajes_agente ON copilot_aprendizajes(agente, tipo);

-- 2. Ads creativos generados
CREATE TABLE IF NOT EXISTS copilot_ads_creativos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  suscripcion_id uuid REFERENCES clipping_suscripciones(id) ON DELETE CASCADE,
  mes int NOT NULL,
  anio int NOT NULL,
  datos jsonb NOT NULL, -- google_ads + meta_ads + recomendaciones
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ads_creativos_unico ON copilot_ads_creativos(suscripcion_id, mes, anio);

-- 3. Árboles de decisión digital
CREATE TABLE IF NOT EXISTS copilot_arboles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  suscripcion_id uuid REFERENCES clipping_suscripciones(id) ON DELETE CASCADE,
  mes int NOT NULL,
  anio int NOT NULL,
  datos jsonb NOT NULL, -- ramas, escenarios, reglas_poda, cronograma
  predictor_input jsonb, -- qué se le pasó al predictor
  predictor_output jsonb, -- qué devolvió el predictor
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_arboles_unico ON copilot_arboles(suscripcion_id, mes, anio);

-- 4. Habilitar RLS (Row Level Security) básico
ALTER TABLE copilot_aprendizajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_ads_creativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_arboles ENABLE ROW LEVEL SECURITY;

-- Policies: service role puede todo (los scripts corren con service key)
CREATE POLICY "service_all_aprendizajes" ON copilot_aprendizajes FOR ALL USING (true);
CREATE POLICY "service_all_ads_creativos" ON copilot_ads_creativos FOR ALL USING (true);
CREATE POLICY "service_all_arboles" ON copilot_arboles FOR ALL USING (true);
