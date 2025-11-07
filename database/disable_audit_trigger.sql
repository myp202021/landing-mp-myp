-- SOLUCIÓN DEFINITIVA: Deshabilitar el trigger de auditoría que causa el error

-- 1. Primero ver qué triggers existen en la tabla leads
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'leads';

-- 2. Si hay un trigger de auditoría, deshabilitarlo
-- (Ejecuta esto DESPUÉS de ver el resultado del query anterior)
-- ALTER TABLE leads DISABLE TRIGGER [nombre_del_trigger];

-- 3. O eliminar el trigger completamente
-- DROP TRIGGER IF EXISTS [nombre_del_trigger] ON leads;
