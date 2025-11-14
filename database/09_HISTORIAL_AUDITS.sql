-- ==================================================================
-- MIGRACIÓN 09: TABLAS DE AUDITORÍA Y HISTORIAL
-- ==================================================================
-- Descripción: Crear tablas para auditoría de leads y cotizaciones
-- Autor: Sistema CRM
-- Fecha: 2025-11-13
-- ==================================================================

-- Tabla de historial de leads (si no existe)
CREATE TABLE IF NOT EXISTS lead_historial (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL,
  usuario TEXT NOT NULL,
  accion TEXT NOT NULL,
  campo_cambiado TEXT,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE lead_historial IS 'Historial de cambios en los leads';
COMMENT ON COLUMN lead_historial.accion IS 'insert, update, delete';

CREATE INDEX IF NOT EXISTS idx_lead_historial_lead_id ON lead_historial(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_historial_created_at ON lead_historial(created_at DESC);

-- Tabla de auditoría de cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones_audits (
  id SERIAL PRIMARY KEY,
  cotizacion_id INTEGER NOT NULL,
  cliente_id UUID NOT NULL,
  nombre_proyecto TEXT,
  usuario TEXT NOT NULL,
  accion TEXT NOT NULL,
  estado_anterior TEXT,
  estado_nuevo TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE cotizaciones_audits IS 'Auditoría de cambios en cotizaciones';
COMMENT ON COLUMN cotizaciones_audits.accion IS 'crear, actualizar_estado, enviar, aprobar, rechazar';

CREATE INDEX IF NOT EXISTS idx_cotizaciones_audits_cotizacion_id ON cotizaciones_audits(cotizacion_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_audits_cliente_id ON cotizaciones_audits(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_audits_created_at ON cotizaciones_audits(created_at DESC);

-- Función para crear tabla lead_historial (para compatibilidad con API)
CREATE OR REPLACE FUNCTION create_lead_historial_table()
RETURNS void AS $$
BEGIN
  -- Esta función ya no es necesaria porque la tabla se crea arriba
  -- Pero la mantenemos por compatibilidad con el código existente
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Verificar tablas creadas
SELECT
  'lead_historial' as tabla,
  count(*) as registros
FROM lead_historial
UNION ALL
SELECT
  'cotizaciones_audits' as tabla,
  count(*) as registros
FROM cotizaciones_audits;

-- ==================================================================
-- FIN DE MIGRACIÓN 09
-- ==================================================================
