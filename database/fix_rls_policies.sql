-- FIX: Desactivar RLS temporalmente para permitir eliminaciones
-- Ejecutar esto en Supabase SQL Editor

-- OPCIÓN 1: Desactivar RLS completamente (MÁS SIMPLE)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones DISABLE ROW LEVEL SECURITY;

-- OPCIÓN 2: Mantener RLS pero permitir eliminaciones con SERVICE_ROLE
-- (Descomenta esto si prefieres mantener RLS activo)

/*
-- Política para permitir DELETE en leads con SERVICE_ROLE
DROP POLICY IF EXISTS "Service role can delete leads" ON leads;
CREATE POLICY "Service role can delete leads"
ON leads
FOR DELETE
TO service_role
USING (true);

-- Política para permitir DELETE en clientes con SERVICE_ROLE
DROP POLICY IF EXISTS "Service role can delete clientes" ON clientes;
CREATE POLICY "Service role can delete clientes"
ON clientes
FOR DELETE
TO service_role
USING (true);

-- Política para permitir DELETE en cotizaciones con SERVICE_ROLE
DROP POLICY IF EXISTS "Service role can delete cotizaciones" ON cotizaciones;
CREATE POLICY "Service role can delete cotizaciones"
ON cotizaciones
FOR DELETE
TO service_role
USING (true);
*/
