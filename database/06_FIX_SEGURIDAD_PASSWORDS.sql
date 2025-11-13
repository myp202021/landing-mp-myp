-- =====================================================
-- FIX CRÍTICO DE SEGURIDAD: Hash de contraseñas en PATCH
-- =====================================================
-- Fecha: 13 de Noviembre 2025
-- Problema: PATCH /api/crm/usuarios guardaba contraseñas sin hashear
-- Solución: Función SQL que hashea con bcrypt antes de actualizar

-- Crear función para actualizar contraseña hasheada
CREATE OR REPLACE FUNCTION actualizar_password_usuario(
  p_user_id INTEGER,
  p_new_password TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Validar que la contraseña tenga al menos 8 caracteres
  IF LENGTH(p_new_password) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
  END IF;

  -- Actualizar contraseña con hash bcrypt
  UPDATE usuarios
  SET
    password_hash = crypt(p_new_password, gen_salt('bf')),
    actualizado_en = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  RAISE NOTICE 'Contraseña actualizada para usuario ID: %', p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION actualizar_password_usuario IS
'Actualiza la contraseña de un usuario hasheándola con bcrypt (SECURITY FIX)';

-- Test de la función (comentar después de verificar)
-- SELECT actualizar_password_usuario(1, 'NuevaPassword123!');

DO $$
BEGIN
  RAISE NOTICE '✅ Función actualizar_password_usuario creada correctamente';
  RAISE NOTICE '⚠️  RECORDATORIO: Ejecutar este script en Supabase Dashboard → SQL Editor';
END $$;
