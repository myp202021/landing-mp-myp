-- SOLUCIÓN TEMPORAL: Eliminar leads forzadamente
-- Esto eliminará todos los leads del cliente M&P para testing

-- 1. Primero deshabilitar todos los triggers temporalmente
SET session_replication_role = replica;

-- 2. Eliminar cotizaciones asociadas a leads
DELETE FROM cotizaciones WHERE lead_id IN (
  SELECT id FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02'
);

-- 3. Eliminar cotizaciones del cliente
DELETE FROM cotizaciones WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';

-- 4. Si existe tabla lead_audits, eliminar
DELETE FROM lead_audits WHERE lead_id IN (
  SELECT id FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02'
);

-- 5. Finalmente eliminar leads
DELETE FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';

-- 6. Reactivar triggers
SET session_replication_role = DEFAULT;

-- Verificar cuántos leads quedan
SELECT COUNT(*) as total_leads FROM leads WHERE cliente_id = 'b1f839a4-db36-4341-b1b3-7d1ec290ca02';
