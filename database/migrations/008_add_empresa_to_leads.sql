-- Migración 008: Agregar campo nombre_empresa a tabla leads
-- Para mostrar tanto el nombre de la persona como el nombre de la empresa

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS nombre_empresa VARCHAR(255);

COMMENT ON COLUMN leads.nombre_empresa IS 'Nombre de la empresa del lead (si aplica)';

-- Crear índice para búsquedas por empresa
CREATE INDEX IF NOT EXISTS idx_leads_nombre_empresa
ON leads(nombre_empresa) WHERE nombre_empresa IS NOT NULL;
