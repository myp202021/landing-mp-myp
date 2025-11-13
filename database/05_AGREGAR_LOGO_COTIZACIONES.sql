-- =====================================================
-- AGREGAR LOGO A COTIZACIONES
-- Permite almacenar el logo del cliente en cada cotización
-- para mostrarlo en la interfaz y en el PDF
-- =====================================================

-- Agregar columnas para logo y plantilla en cotizaciones
ALTER TABLE cotizaciones
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS plantilla_id INTEGER REFERENCES plantillas_cotizacion(id) ON DELETE SET NULL;

-- Comentarios para documentación
COMMENT ON COLUMN cotizaciones.logo_url IS 'URL del logo del cliente usado en esta cotización (snapshot)';
COMMENT ON COLUMN cotizaciones.plantilla_id IS 'ID de la plantilla utilizada para crear esta cotización';

-- Índice para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cotizaciones_plantilla ON cotizaciones(plantilla_id);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver estructura actualizada de la tabla cotizaciones
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cotizaciones'
  AND column_name IN ('logo_url', 'plantilla_id')
ORDER BY ordinal_position;

-- ✅ Si ves las columnas logo_url y plantilla_id, la migración fue exitosa
