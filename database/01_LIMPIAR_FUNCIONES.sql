-- =====================================================
-- SCRIPT 1: LIMPIAR FUNCIONES EXISTENTES
-- Ejecuta este primero para eliminar funciones antiguas
-- =====================================================

-- Eliminar funciones existentes si existen
DROP FUNCTION IF EXISTS verificar_login(text, text);
DROP FUNCTION IF EXISTS cambiar_password(integer, text, text);
DROP FUNCTION IF EXISTS admin_reset_password(integer, text, boolean);
DROP FUNCTION IF EXISTS crear_usuario(text, text, text, text, uuid);
DROP FUNCTION IF EXISTS log_auth_event(integer, text, text, text, jsonb);

-- Eliminar tabla de logs si existe (para recrearla correctamente)
DROP TABLE IF EXISTS auth_logs CASCADE;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Funciones y tablas antiguas eliminadas. Ahora ejecuta 02_INSTALAR_AUTENTICACION.sql';
END $$;
