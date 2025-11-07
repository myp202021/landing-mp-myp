-- SCRIPT PARA ELIMINAR TODOS LOS LEADS DEL CLIENTE M&P
-- Ejecutar esto en Supabase SQL Editor para limpiar TODA la base de datos

-- Cliente ID de M&P
-- b1f839a4-db36-4341-b1b3-7d1ec290ca02

-- 1. Deshabilitar triggers y constraints temporalmente
SET session_replication_role = replica;

-- 2. Eliminar de TODAS las tablas que referencian leads
DELETE FROM lead_audits WHERE lead_id IN (
  SELECT id FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02'
);

DELETE FROM cotizaciones WHERE lead_id IN (
  SELECT id FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02'
);

DELETE FROM cotizaciones_crm WHERE lead_id IN (
  SELECT id FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02'
);

-- 3. Eliminar cotizaciones del cliente directamente
DELETE FROM cotizaciones WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';

DELETE FROM cotizaciones_crm WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';

-- 4. Finalmente eliminar todos los leads
DELETE FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';

-- 5. Reactivar triggers
SET session_replication_role = DEFAULT;

-- 6. Verificar que se eliminaron todos
SELECT COUNT(*) as leads_restantes FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';
SELECT COUNT(*) as cotizaciones_restantes FROM cotizaciones WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';
