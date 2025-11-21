-- Migración 009: Sincronizar datos de empresa entre campos
-- Copiar datos del campo 'empresa' al nuevo campo 'nombre_empresa' para leads existentes

-- Actualizar nombre_empresa con los datos de empresa donde nombre_empresa está vacío
UPDATE leads
SET nombre_empresa = empresa
WHERE empresa IS NOT NULL
  AND (nombre_empresa IS NULL OR nombre_empresa = '');

-- Verificar cuántos registros se actualizaron
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM leads
  WHERE nombre_empresa IS NOT NULL;

  RAISE NOTICE 'Leads con nombre_empresa: %', updated_count;
END $$;
