-- =====================================================
-- FIX COMPLETO: AUTENTICACIÓN Y CONTRASEÑAS
-- Compatible con esquema existente (usuarios con SERIAL id)
-- =====================================================

-- =====================================================
-- PASO 1: Agregar campos para gestión de contraseñas
-- =====================================================

-- Agregar columna para forzar cambio de contraseña
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS debe_cambiar_password BOOLEAN DEFAULT false;

-- Agregar columna de último cambio de contraseña
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ DEFAULT NOW();

-- =====================================================
-- PASO 2: Habilitar extensión pgcrypto para bcrypt
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- PASO 3: Migrar contraseñas actuales a bcrypt
-- =====================================================

-- Solo migrar si hay contraseñas en texto plano
DO $$
DECLARE
  usuario RECORD;
BEGIN
  FOR usuario IN SELECT id, username, password_hash FROM usuarios
  LOOP
    -- Si la contraseña no empieza con $2, no es bcrypt
    IF usuario.password_hash IS NOT NULL AND NOT (usuario.password_hash LIKE '$2%') THEN
      UPDATE usuarios
      SET password_hash = crypt(usuario.password_hash, gen_salt('bf'))
      WHERE id = usuario.id;

      RAISE NOTICE 'Password hasheado para usuario: %', usuario.username;
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- PASO 4: Funciones de autenticación
-- =====================================================

-- Función para verificar login
CREATE OR REPLACE FUNCTION verificar_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE(
  user_id INTEGER,
  username TEXT,
  nombre TEXT,
  rol TEXT,
  cliente_id UUID,
  debe_cambiar_password BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.username,
    u.nombre,
    u.rol,
    u.cliente_id,
    u.debe_cambiar_password
  FROM usuarios u
  WHERE
    u.username = p_username
    AND u.password_hash = crypt(p_password, u.password_hash)
    AND u.activo = true;

  -- Actualizar último login si hay match
  IF FOUND THEN
    UPDATE usuarios
    SET actualizado_en = NOW()
    WHERE username = p_username;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 5: Función para cambiar contraseña
-- =====================================================

CREATE OR REPLACE FUNCTION cambiar_password(
  p_user_id INTEGER,
  p_old_password TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_password_hash TEXT;
  v_username TEXT;
BEGIN
  -- Validar que el usuario existe
  SELECT password_hash, username INTO v_password_hash, v_username
  FROM usuarios
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- Validar contraseña actual
  IF v_password_hash != crypt(p_old_password, v_password_hash) THEN
    RAISE EXCEPTION 'Contraseña actual incorrecta';
  END IF;

  -- Validar nueva contraseña (mínimo 8 caracteres, al menos una letra y un número)
  IF LENGTH(p_new_password) < 8 THEN
    RAISE EXCEPTION 'La nueva contraseña debe tener al menos 8 caracteres';
  END IF;

  IF NOT (p_new_password ~ '[a-zA-Z]') THEN
    RAISE EXCEPTION 'La nueva contraseña debe contener al menos una letra';
  END IF;

  IF NOT (p_new_password ~ '[0-9]') THEN
    RAISE EXCEPTION 'La nueva contraseña debe contener al menos un número';
  END IF;

  -- No puede ser igual a la anterior
  IF crypt(p_new_password, v_password_hash) = v_password_hash THEN
    RAISE EXCEPTION 'La nueva contraseña no puede ser igual a la anterior';
  END IF;

  -- Actualizar contraseña
  UPDATE usuarios
  SET
    password_hash = crypt(p_new_password, gen_salt('bf')),
    debe_cambiar_password = false,
    password_changed_at = NOW(),
    actualizado_en = NOW()
  WHERE id = p_user_id;

  RAISE NOTICE 'Contraseña actualizada para usuario: %', v_username;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 6: Función para ADMIN resetear contraseña
-- =====================================================

CREATE OR REPLACE FUNCTION admin_reset_password(
  p_user_id INTEGER,
  p_new_password TEXT,
  p_force_change BOOLEAN DEFAULT true
)
RETURNS BOOLEAN AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Validar que el usuario existe
  SELECT username INTO v_username
  FROM usuarios
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- Validar nueva contraseña
  IF LENGTH(p_new_password) < 8 THEN
    RAISE EXCEPTION 'La nueva contraseña debe tener al menos 8 caracteres';
  END IF;

  -- Actualizar contraseña
  UPDATE usuarios
  SET
    password_hash = crypt(p_new_password, gen_salt('bf')),
    debe_cambiar_password = p_force_change,
    password_changed_at = NOW(),
    actualizado_en = NOW()
  WHERE id = p_user_id;

  RAISE NOTICE 'Contraseña reseteada por admin para usuario: % (debe cambiar: %)',
    v_username, p_force_change;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 7: Función para crear usuario con contraseña
-- =====================================================

CREATE OR REPLACE FUNCTION crear_usuario(
  p_username TEXT,
  p_password TEXT,
  p_nombre TEXT,
  p_rol TEXT,
  p_cliente_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_user_id INTEGER;
BEGIN
  -- Validar que el username no existe
  IF EXISTS (SELECT 1 FROM usuarios WHERE username = p_username) THEN
    RAISE EXCEPTION 'El username "%" ya existe', p_username;
  END IF;

  -- Validar rol
  IF p_rol NOT IN ('admin', 'cliente') THEN
    RAISE EXCEPTION 'Rol inválido. Debe ser "admin" o "cliente"';
  END IF;

  -- Validar que clientes tengan cliente_id
  IF p_rol = 'cliente' AND p_cliente_id IS NULL THEN
    RAISE EXCEPTION 'Los usuarios con rol "cliente" deben tener un cliente_id';
  END IF;

  -- Validar contraseña
  IF LENGTH(p_password) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
  END IF;

  -- Crear usuario
  INSERT INTO usuarios (username, password_hash, nombre, rol, cliente_id, activo)
  VALUES (
    p_username,
    crypt(p_password, gen_salt('bf')),
    p_nombre,
    p_rol,
    p_cliente_id,
    true
  )
  RETURNING id INTO v_user_id;

  RAISE NOTICE 'Usuario creado: % (ID: %)', p_username, v_user_id;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 8: Actualizar usuario admin existente
-- =====================================================

-- Actualizar password del admin a una contraseña segura hasheada
UPDATE usuarios
SET
  password_hash = crypt('MYP@admin2025!', gen_salt('bf')),
  debe_cambiar_password = false,
  password_changed_at = NOW()
WHERE username = 'admin';

-- =====================================================
-- PASO 9: Crear tabla de logs de autenticación (opcional)
-- =====================================================

CREATE TABLE IF NOT EXISTS auth_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  username TEXT,
  evento TEXT NOT NULL, -- 'login_exitoso', 'login_fallido', 'password_changed', 'password_reset'
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_logs_user ON auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_evento ON auth_logs(evento);
CREATE INDEX IF NOT EXISTS idx_auth_logs_fecha ON auth_logs(creado_en DESC);

-- =====================================================
-- PASO 10: Función helper para log de autenticación
-- =====================================================

CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id INTEGER,
  p_username TEXT,
  p_evento TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO auth_logs (user_id, username, evento, ip_address, metadata)
  VALUES (p_user_id, p_username, p_evento, p_ip_address, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '================================';
  RAISE NOTICE '✅ SISTEMA DE AUTENTICACIÓN CONFIGURADO';
  RAISE NOTICE '================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Funciones disponibles:';
  RAISE NOTICE '  • verificar_login(username, password)';
  RAISE NOTICE '  • cambiar_password(user_id, old_pass, new_pass)';
  RAISE NOTICE '  • admin_reset_password(user_id, new_pass, force_change)';
  RAISE NOTICE '  • crear_usuario(username, password, nombre, rol, cliente_id)';
  RAISE NOTICE '  • log_auth_event(user_id, username, evento, ip, metadata)';
  RAISE NOTICE '';
  RAISE NOTICE '🔑 Credenciales admin:';
  RAISE NOTICE '  Username: admin';
  RAISE NOTICE '  Password: MYP@admin2025!';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANTE: Todas las contraseñas ahora usan bcrypt';
  RAISE NOTICE '';
END $$;

-- Mostrar usuarios actuales
SELECT
  id,
  username,
  nombre,
  rol,
  cliente_id,
  activo,
  debe_cambiar_password,
  password_changed_at,
  creado_en
FROM usuarios
ORDER BY id;
