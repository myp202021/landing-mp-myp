-- ============================================================================
-- SOLUCIÓN COMPLETA Y DEFINITIVA PARA ELIMINACIÓN DE LEADS
-- ============================================================================

-- PASO 1: Eliminar los triggers problemáticos de auditoría
DROP TRIGGER IF EXISTS trg_leads_del ON leads;
DROP TRIGGER IF EXISTS trg_leads_ins ON leads;
DROP TRIGGER IF EXISTS trg_leads_upd ON leads;

-- PASO 2: Verificar que se eliminaron
SELECT COUNT(*) as triggers_restantes
FROM information_schema.triggers
WHERE event_object_table = 'leads';

-- PASO 3: Configurar CASCADE en todas las FK constraints de lead_audits
-- (Si falla, significa que ya tiene CASCADE o la constraint no existe)
ALTER TABLE lead_audits
DROP CONSTRAINT IF EXISTS lead_audits_lead_id_fkey;

ALTER TABLE lead_audits
ADD CONSTRAINT lead_audits_lead_id_fkey
FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE;

-- PASO 4: Lo mismo para cotizaciones
ALTER TABLE cotizaciones
DROP CONSTRAINT IF EXISTS cotizaciones_lead_id_fkey;

ALTER TABLE cotizaciones
ADD CONSTRAINT cotizaciones_lead_id_fkey
FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE;

-- PASO 5: Y para cotizaciones_crm si existe
ALTER TABLE cotizaciones_crm
DROP CONSTRAINT IF EXISTS cotizaciones_crm_lead_id_fkey;

ALTER TABLE cotizaciones_crm
ADD CONSTRAINT cotizaciones_crm_lead_id_fkey
FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE;

-- ============================================================================
-- RESULTADO: Ahora los leads se pueden eliminar SIN triggers problemáticos
-- y con CASCADE automático en todas las tablas relacionadas
-- ============================================================================
