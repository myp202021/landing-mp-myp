-- ============================================
-- INTEGRACIÓN CON META LEAD ADS
-- Agregar campos para sincronización automática
-- ============================================

-- 1. Agregar campos Meta a la tabla clientes
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS meta_page_id TEXT,
ADD COLUMN IF NOT EXISTS meta_form_id TEXT,
ADD COLUMN IF NOT EXISTS sync_meta_activo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ultima_sync_meta TIMESTAMP;

-- Comentarios
COMMENT ON COLUMN clientes.meta_page_id IS 'ID de la página de Facebook del cliente';
COMMENT ON COLUMN clientes.meta_form_id IS 'ID del formulario de Lead Ads';
COMMENT ON COLUMN clientes.sync_meta_activo IS 'Si está activo, el cron sincronizará leads automáticamente';
COMMENT ON COLUMN clientes.ultima_sync_meta IS 'Última vez que se sincronizaron leads de Meta';

-- 2. Agregar meta_lead_id y fuente a tabla leads (para evitar duplicados)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS meta_lead_id TEXT,
ADD COLUMN IF NOT EXISTS fuente TEXT DEFAULT 'manual';

-- Índice único para evitar duplicados
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_meta_lead_id
ON leads(meta_lead_id)
WHERE meta_lead_id IS NOT NULL;

COMMENT ON COLUMN leads.meta_lead_id IS 'ID único del lead en Meta (para evitar duplicados)';
COMMENT ON COLUMN leads.fuente IS 'Origen del lead: manual, meta_lead_ads, etc';

-- 3. Tabla de logs de sincronización
CREATE TABLE IF NOT EXISTS sync_meta_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  leads_nuevos INTEGER DEFAULT 0,
  leads_duplicados INTEGER DEFAULT 0,
  errores TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE sync_meta_logs IS 'Registro de cada sincronización con Meta Lead Ads';

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_sync_meta_logs_cliente
ON sync_meta_logs(cliente_id, created_at DESC);

-- 4. Vista para ver estado de sincronización por cliente
CREATE OR REPLACE VIEW v_clientes_meta_sync AS
SELECT
  c.id,
  c.nombre,
  c.meta_page_id,
  c.meta_form_id,
  c.sync_meta_activo,
  c.ultima_sync_meta,
  COUNT(l.id) FILTER (WHERE l.fuente = 'meta_lead_ads') as total_leads_meta,
  (
    SELECT COUNT(*)
    FROM sync_meta_logs sml
    WHERE sml.cliente_id = c.id
  ) as total_syncs
FROM clientes c
LEFT JOIN leads l ON l.cliente_id = c.id
WHERE c.activo = true
GROUP BY c.id;

COMMENT ON VIEW v_clientes_meta_sync IS 'Vista con resumen de sincronización Meta por cliente';
