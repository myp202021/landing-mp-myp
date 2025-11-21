-- Migración 007: Arreglar constraint para incluir publisher_platform
-- Problema: Los registros se sobrescriben porque el unique constraint no incluye publisher_platform

-- 1. Primero, eliminar el constraint antiguo si existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'ads_metrics_daily_cliente_id_integration_id_campaign_id_fecha_key'
    ) THEN
        ALTER TABLE ads_metrics_daily
        DROP CONSTRAINT ads_metrics_daily_cliente_id_integration_id_campaign_id_fecha_key;
    END IF;
END $$;

-- 2. Asegurarnos de que publisher_platform no tenga valores NULL
UPDATE ads_metrics_daily
SET publisher_platform = 'unknown'
WHERE publisher_platform IS NULL;

-- 3. Crear nuevo constraint único que incluya publisher_platform
ALTER TABLE ads_metrics_daily
ADD CONSTRAINT ads_metrics_daily_unique_platform
UNIQUE (cliente_id, integration_id, campaign_id, fecha, publisher_platform);

-- 4. Crear índice para mejorar performance de queries por plataforma
CREATE INDEX IF NOT EXISTS idx_ads_metrics_publisher_platform
ON ads_metrics_daily(publisher_platform);

CREATE INDEX IF NOT EXISTS idx_ads_metrics_cliente_fecha_platform
ON ads_metrics_daily(cliente_id, fecha, publisher_platform);

-- Comentarios
COMMENT ON CONSTRAINT ads_metrics_daily_unique_platform ON ads_metrics_daily IS
'Garantiza que no haya duplicados por cliente, campaña, fecha Y plataforma (Instagram, Facebook, etc.)';
