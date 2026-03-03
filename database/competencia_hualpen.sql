-- Tabla para reportes diarios de competencia — Buses Hualpén
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS reportes_competencia (
  id               SERIAL PRIMARY KEY,
  competidor       VARCHAR(100) NOT NULL,
  instagram_handle VARCHAR(100),
  red_social       VARCHAR(50) DEFAULT 'Instagram',
  post_url         TEXT,
  post_texto       TEXT,
  post_imagen      TEXT,
  likes            INTEGER,
  comentarios      INTEGER,
  fecha_post       TIMESTAMPTZ,
  fecha_reporte    DATE NOT NULL DEFAULT CURRENT_DATE,
  sin_actividad    BOOLEAN DEFAULT FALSE,
  creado_en        TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas rápidas por fecha
CREATE INDEX IF NOT EXISTS idx_reportes_fecha
  ON reportes_competencia(fecha_reporte DESC);

-- Política de acceso: lectura pública (la key anon del CRM puede leer)
ALTER TABLE reportes_competencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura libre" ON reportes_competencia
  FOR SELECT USING (true);

CREATE POLICY "Solo service role puede escribir" ON reportes_competencia
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo service role puede borrar" ON reportes_competencia
  FOR DELETE USING (true);
