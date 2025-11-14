-- ================================================================
-- SPRINT 4: INTEGRACIONES LOG Y CONFIGURACIONES
-- Autor: Claude Code
-- Fecha: 2025-11-13
-- Descripción: Sistema de historial y configuración de integraciones
-- ================================================================

-- Tabla de historial de integraciones
CREATE TABLE IF NOT EXISTS integraciones_log (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'zapier', 'google_ads', 'meta_ads'
  accion TEXT NOT NULL, -- 'activado', 'desactivado', 'configurado', 'error', 'test_exitoso', 'test_fallido'
  descripcion TEXT,
  metadata JSONB DEFAULT '{}',
  webhook_url TEXT,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_integraciones_cliente ON integraciones_log(cliente_id);
CREATE INDEX idx_integraciones_tipo ON integraciones_log(tipo);
CREATE INDEX idx_integraciones_accion ON integraciones_log(accion);
CREATE INDEX idx_integraciones_fecha ON integraciones_log(creado_en DESC);

-- Tabla de configuraciones de integraciones (para futuro)
CREATE TABLE IF NOT EXISTS integraciones_config (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  activo BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cliente_id, tipo)
);

CREATE INDEX idx_config_cliente_tipo ON integraciones_config(cliente_id, tipo);

-- Función para registrar evento de integración
CREATE OR REPLACE FUNCTION registrar_integracion_evento(
  p_cliente_id UUID,
  p_tipo TEXT,
  p_accion TEXT,
  p_descripcion TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_webhook_url TEXT DEFAULT NULL,
  p_user_id INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  nuevo_id INTEGER;
BEGIN
  INSERT INTO integraciones_log (
    cliente_id,
    tipo,
    accion,
    descripcion,
    metadata,
    webhook_url,
    user_id
  ) VALUES (
    p_cliente_id,
    p_tipo,
    p_accion,
    p_descripcion,
    p_metadata,
    p_webhook_url,
    p_user_id
  )
  RETURNING id INTO nuevo_id;

  RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp en integraciones_config
CREATE OR REPLACE FUNCTION actualizar_integracion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_integraciones_config_updated
  BEFORE UPDATE ON integraciones_config
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_integracion_timestamp();

-- Comentarios para documentación
COMMENT ON TABLE integraciones_log IS 'Historial de eventos de integraciones (Zapier, Google Ads, Meta)';
COMMENT ON TABLE integraciones_config IS 'Configuraciones de integraciones por cliente';
COMMENT ON COLUMN integraciones_log.tipo IS 'Tipo de integración: zapier, google_ads, meta_ads';
COMMENT ON COLUMN integraciones_log.accion IS 'Acción realizada: activado, desactivado, configurado, error, test_exitoso, test_fallido';
COMMENT ON COLUMN integraciones_log.metadata IS 'Información adicional en formato JSON';

-- Agregar campos de integración a tabla clientes si no existen
DO $$
BEGIN
  -- Verificar si la columna zapier_webhook_url existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'zapier_webhook_url'
  ) THEN
    ALTER TABLE clientes ADD COLUMN zapier_webhook_url TEXT;
  END IF;

  -- Verificar si la columna zapier_activo existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'zapier_activo'
  ) THEN
    ALTER TABLE clientes ADD COLUMN zapier_activo BOOLEAN DEFAULT false;
  END IF;

  -- Agregar columnas para Google Ads (preparación futura)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'google_ads_activo'
  ) THEN
    ALTER TABLE clientes ADD COLUMN google_ads_activo BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'google_ads_customer_id'
  ) THEN
    ALTER TABLE clientes ADD COLUMN google_ads_customer_id TEXT;
  END IF;

  -- Agregar columnas para Meta Ads (preparación futura)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'meta_ads_activo'
  ) THEN
    ALTER TABLE clientes ADD COLUMN meta_ads_activo BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'meta_ads_account_id'
  ) THEN
    ALTER TABLE clientes ADD COLUMN meta_ads_account_id TEXT;
  END IF;
END $$;

COMMENT ON COLUMN clientes.zapier_webhook_url IS 'URL del webhook de Zapier para este cliente';
COMMENT ON COLUMN clientes.zapier_activo IS 'Indica si la integración con Zapier está activa';
COMMENT ON COLUMN clientes.google_ads_activo IS 'Indica si la integración con Google Ads está activa';
COMMENT ON COLUMN clientes.google_ads_customer_id IS 'ID de cliente de Google Ads';
COMMENT ON COLUMN clientes.meta_ads_activo IS 'Indica si la integración con Meta Ads está activa';
COMMENT ON COLUMN clientes.meta_ads_account_id IS 'ID de cuenta publicitaria de Meta';

-- Vista para resumen de integraciones por cliente
CREATE OR REPLACE VIEW v_resumen_integraciones AS
SELECT
  c.id AS cliente_id,
  c.nombre AS cliente_nombre,
  c.zapier_activo,
  c.zapier_webhook_url,
  c.google_ads_activo,
  c.meta_ads_activo,
  (
    SELECT COUNT(*)
    FROM integraciones_log il
    WHERE il.cliente_id = c.id AND il.tipo = 'zapier'
  ) AS eventos_zapier,
  (
    SELECT MAX(creado_en)
    FROM integraciones_log il
    WHERE il.cliente_id = c.id AND il.tipo = 'zapier'
  ) AS ultima_actividad_zapier,
  (
    SELECT COUNT(*)
    FROM integraciones_log il
    WHERE il.cliente_id = c.id
    AND il.accion = 'error'
    AND il.creado_en > NOW() - INTERVAL '7 days'
  ) AS errores_recientes
FROM clientes c
WHERE c.activo = true
ORDER BY c.nombre;

COMMENT ON VIEW v_resumen_integraciones IS 'Vista resumen del estado de integraciones por cliente';

-- Insertar ejemplo de log inicial (solo si no existe)
DO $$
BEGIN
  -- Esto es solo para testing, no insertará nada en producción
  -- Se puede descomentar para pruebas locales

  -- INSERT INTO integraciones_log (cliente_id, tipo, accion, descripcion, metadata)
  -- SELECT
  --   id,
  --   'zapier',
  --   'configurado',
  --   'Migración inicial - sistema configurado',
  --   '{"version": "1.0", "migrado_desde": "sistema_anterior"}'::jsonb
  -- FROM clientes
  -- WHERE zapier_activo = true
  -- ON CONFLICT DO NOTHING;
END $$;

-- Verificación final
SELECT
  'integraciones_log' AS tabla,
  COUNT(*) AS registros
FROM integraciones_log
UNION ALL
SELECT
  'integraciones_config' AS tabla,
  COUNT(*) AS registros
FROM integraciones_config;

RAISE NOTICE 'Migración 11_INTEGRACIONES_LOG.sql completada exitosamente';
