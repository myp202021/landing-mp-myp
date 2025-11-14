-- ==================================================================
-- MIGRACIÓN 08: PLANES M&P (Silver, Gold, Platinum)
-- ==================================================================
-- Descripción: Crear tabla de planes predefinidos para cotizaciones
-- Autor: Sistema CRM
-- Fecha: 2025-11-13
-- ==================================================================

-- Crear tabla de planes M&P
CREATE TABLE IF NOT EXISTS planes_myp (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  items_incluidos JSONB NOT NULL DEFAULT '[]',
  precio_base NUMERIC NOT NULL,
  descuento_default NUMERIC DEFAULT 0,
  vigencia_dias INTEGER DEFAULT 30,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE planes_myp IS 'Planes predefinidos de servicios M&P (Silver, Gold, Platinum)';
COMMENT ON COLUMN planes_myp.items_incluidos IS 'Array JSON de items: [{"descripcion": "...", "cantidad": 1, "precio_unitario": 150000}]';
COMMENT ON COLUMN planes_myp.descuento_default IS 'Descuento por defecto en porcentaje (0-100)';

-- Seed de 3 planes predefinidos
INSERT INTO planes_myp (nombre, descripcion, items_incluidos, precio_base, descuento_default, vigencia_dias) VALUES
(
  'Silver',
  'Plan básico para empresas pequeñas',
  '[
    {"descripcion": "Gestión de campañas Meta Ads", "cantidad": 1, "precio_unitario": 150000},
    {"descripcion": "Optimización de anuncios", "cantidad": 1, "precio_unitario": 100000},
    {"descripcion": "Reportes mensuales", "cantidad": 1, "precio_unitario": 80000},
    {"descripcion": "Soporte por email", "cantidad": 1, "precio_unitario": 70000},
    {"descripcion": "Revisión de métricas", "cantidad": 1, "precio_unitario": 50000}
  ]'::jsonb,
  450000,
  0,
  30
),
(
  'Gold',
  'Plan intermedio con más beneficios',
  '[
    {"descripcion": "Gestión de campañas Meta Ads", "cantidad": 1, "precio_unitario": 200000},
    {"descripcion": "Optimización avanzada de anuncios", "cantidad": 1, "precio_unitario": 150000},
    {"descripcion": "A/B Testing", "cantidad": 1, "precio_unitario": 120000},
    {"descripcion": "Reportes semanales", "cantidad": 1, "precio_unitario": 100000},
    {"descripcion": "Soporte prioritario WhatsApp", "cantidad": 1, "precio_unitario": 80000},
    {"descripcion": "Análisis de competencia", "cantidad": 1, "precio_unitario": 100000}
  ]'::jsonb,
  750000,
  5,
  30
),
(
  'Platinum',
  'Plan premium con servicio completo',
  '[
    {"descripcion": "Gestión de campañas Meta + Google Ads", "cantidad": 1, "precio_unitario": 300000},
    {"descripcion": "Optimización con IA", "cantidad": 1, "precio_unitario": 200000},
    {"descripcion": "A/B Testing avanzado", "cantidad": 1, "precio_unitario": 150000},
    {"descripcion": "Reportes personalizados", "cantidad": 1, "precio_unitario": 120000},
    {"descripcion": "Soporte 24/7", "cantidad": 1, "precio_unitario": 100000},
    {"descripcion": "Consultoría estratégica mensual", "cantidad": 1, "precio_unitario": 180000},
    {"descripcion": "Creación de contenido", "cantidad": 1, "precio_unitario": 150000}
  ]'::jsonb,
  1200000,
  10,
  30
);

-- Crear índice para búsquedas rápidas de planes activos
CREATE INDEX IF NOT EXISTS idx_planes_activo ON planes_myp(activo) WHERE activo = true;

-- Trigger para actualizar fecha de actualización
CREATE OR REPLACE FUNCTION update_planes_myp_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_planes_myp_timestamp
  BEFORE UPDATE ON planes_myp
  FOR EACH ROW
  EXECUTE FUNCTION update_planes_myp_timestamp();

-- Verificar inserción
SELECT
  nombre,
  descripcion,
  precio_base,
  descuento_default,
  jsonb_array_length(items_incluidos) as num_items,
  activo
FROM planes_myp
ORDER BY precio_base ASC;

-- ==================================================================
-- FIN DE MIGRACIÓN 08
-- ==================================================================
