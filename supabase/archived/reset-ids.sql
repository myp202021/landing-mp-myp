-- Resetear secuencia de IDs de la tabla leads
-- Esto hará que los próximos IDs partan desde 1

-- 1. Truncar tabla leads (eliminar todos los registros y resetear secuencia)
TRUNCATE TABLE leads RESTART IDENTITY CASCADE;

-- 2. Resetear manualmente la secuencia (alternativa si truncate no funciona)
-- ALTER SEQUENCE leads_id_seq RESTART WITH 1;
