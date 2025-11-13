-- ============================================
-- ACTUALIZACIÓN: Agregar campos faltantes
-- ============================================

-- Agregar fecha de cotización
ALTER TABLE cotizaciones_mercator
ADD COLUMN IF NOT EXISTS fecha_cotizacion DATE DEFAULT CURRENT_DATE;

-- Agregar notas estructuradas (array de objetos JSON)
ALTER TABLE cotizaciones_mercator
ADD COLUMN IF NOT EXISTS notas_detalladas JSONB;

-- Comentarios
COMMENT ON COLUMN cotizaciones_mercator.fecha_cotizacion IS 'Fecha de emisión de la cotización';
COMMENT ON COLUMN cotizaciones_mercator.notas_detalladas IS 'Notas numeradas con formato JSON: [{"numero": 1, "texto": "..."}]';

-- Verificar que las columnas se agregaron
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'cotizaciones_mercator'
ORDER BY ordinal_position;
