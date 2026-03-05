-- Tabla para reportes diarios de competencia — Genera Chile (Piloto)
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS reportes_genera (
  id               SERIAL PRIMARY KEY,
  competidor       VARCHAR(100) NOT NULL,
  handle           VARCHAR(100),
  red_social       VARCHAR(50) DEFAULT 'Instagram',
  post_url         TEXT,
  post_texto       TEXT,
  post_imagen      TEXT,
  likes            INTEGER,
  comentarios      INTEGER,
  compartidos      INTEGER DEFAULT 0,
  es_oferta        BOOLEAN DEFAULT FALSE,
  es_promocion     BOOLEAN DEFAULT FALSE,
  fecha_post       TIMESTAMPTZ,
  fecha_reporte    DATE NOT NULL DEFAULT CURRENT_DATE,
  sin_actividad    BOOLEAN DEFAULT FALSE,
  creado_en        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reportes_genera_fecha
  ON reportes_genera(fecha_reporte DESC);

ALTER TABLE reportes_genera ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura libre genera" ON reportes_genera
  FOR SELECT USING (true);

CREATE POLICY "Solo service role puede escribir genera" ON reportes_genera
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo service role puede borrar genera" ON reportes_genera
  FOR DELETE USING (true);
