-- Agregar campo prioridad a tabla leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS prioridad BOOLEAN DEFAULT false;

-- Agregar campo costo_publicidad para ROAS
ALTER TABLE leads ADD COLUMN IF NOT EXISTS costo_publicidad NUMERIC(12,2) DEFAULT 0;

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_prioridad ON leads(prioridad);
CREATE INDEX IF NOT EXISTS idx_leads_costo ON leads(costo_publicidad);

-- Verificar
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('prioridad', 'costo_publicidad');
