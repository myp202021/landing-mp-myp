-- ============================================
-- AGREGAR RLS FALTANTE
-- Migración: Habilitar Row Level Security en tablas sin protección
-- ============================================

-- 1. COTIZACIONES_CRM
ALTER TABLE cotizaciones_crm ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Solo ver cotizaciones de su propio cliente
CREATE POLICY cotizaciones_select ON cotizaciones_crm
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  );

-- Política INSERT: Solo crear cotizaciones para su propio cliente
CREATE POLICY cotizaciones_insert ON cotizaciones_crm
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  );

-- Política UPDATE: Solo actualizar cotizaciones de su propio cliente
CREATE POLICY cotizaciones_update ON cotizaciones_crm
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  );

-- Política DELETE: Solo eliminar cotizaciones de su propio cliente
CREATE POLICY cotizaciones_delete ON cotizaciones_crm
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  );

-- 2. SYNC_META_LOGS (si existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sync_meta_logs') THEN
    ALTER TABLE sync_meta_logs ENABLE ROW LEVEL SECURITY;

    -- Solo ver logs de su propio cliente
    CREATE POLICY sync_logs_select ON sync_meta_logs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM usuarios u
          WHERE u.id = auth.uid()
          AND u.cliente_id = sync_meta_logs.cliente_id
        )
      );

    -- Solo insertar logs para su propio cliente
    CREATE POLICY sync_logs_insert ON sync_meta_logs
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM usuarios u
          WHERE u.id = auth.uid()
          AND u.cliente_id = sync_meta_logs.cliente_id
        )
      );
  END IF;
END $$;

-- 3. CATALOGO_RAZONES
-- Todos pueden leer, solo admins pueden modificar
ALTER TABLE catalogo_razones ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden leer
CREATE POLICY catalogo_read_all ON catalogo_razones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid())
  );

-- Solo admins pueden insertar
CREATE POLICY catalogo_insert_admin ON catalogo_razones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Solo admins pueden actualizar
CREATE POLICY catalogo_update_admin ON catalogo_razones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Solo admins pueden eliminar
CREATE POLICY catalogo_delete_admin ON catalogo_razones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- 4. Verificar que todas las tablas críticas tengan RLS
DO $$
DECLARE
  tbl record;
  missing_rls text[] := ARRAY[]::text[];
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('clientes', 'usuarios', 'leads', 'cargas', 'lead_audits', 'cotizaciones_crm', 'catalogo_razones')
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = tbl.tablename
      AND n.nspname = 'public'
      AND c.relrowsecurity = true
    ) THEN
      missing_rls := array_append(missing_rls, tbl.tablename);
    END IF;
  END LOOP;

  IF array_length(missing_rls, 1) > 0 THEN
    RAISE WARNING 'Tablas sin RLS: %', array_to_string(missing_rls, ', ');
  ELSE
    RAISE NOTICE '✅ Todas las tablas críticas tienen RLS habilitado';
  END IF;
END $$;

COMMENT ON POLICY cotizaciones_select ON cotizaciones_crm IS 'Usuarios solo ven cotizaciones de su cliente';
COMMENT ON POLICY catalogo_read_all ON catalogo_razones IS 'Catálogo visible para todos, modificable solo por admins';
