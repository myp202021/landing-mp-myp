-- =====================================================
-- INSTALACIÓN TODO EN UNO
-- Limpia y reinstala el sistema completo
-- =====================================================

-- LIMPIEZA AGRESIVA
DROP FUNCTION IF EXISTS verificar_login CASCADE;
DROP FUNCTION IF EXISTS cambiar_password CASCADE;
DROP FUNCTION IF EXISTS admin_reset_password CASCADE;
DROP FUNCTION IF EXISTS crear_usuario CASCADE;
DROP FUNCTION IF EXISTS log_auth_event CASCADE;
DROP TABLE IF EXISTS auth_logs CASCADE;

-- Agregar campos si no existen
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS debe_cambiar_password BOOLEAN DEFAULT false;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ DEFAULT NOW();

-- Habilitar pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migrar contraseñas a bcrypt
DO $$
DECLARE
  usuario RECORD;
BEGIN
  FOR usuario IN SELECT id, username, password_hash FROM usuarios
  LOOP
    IF usuario.password_hash IS NOT NULL AND NOT (usuario.password_hash LIKE '$2%') THEN
      UPDATE usuarios
      SET password_hash = crypt(usuario.password_hash, gen_salt('bf'))
      WHERE id = usuario.id;
      RAISE NOTICE 'Password hasheado para usuario: %', usuario.username;
    END IF;
  END LOOP;
END $$;

-- FUNCIONES
CREATE FUNCTION verificar_login(p_username TEXT, p_password TEXT)
RETURNS TABLE(user_id INTEGER, username TEXT, nombre TEXT, rol TEXT, cliente_id UUID, debe_cambiar_password BOOLEAN)
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.nombre, u.rol, u.cliente_id, u.debe_cambiar_password
  FROM usuarios u
  WHERE u.username = p_username
    AND u.password_hash = crypt(p_password, u.password_hash)
    AND u.activo = true;

  IF FOUND THEN
    UPDATE usuarios SET actualizado_en = NOW() WHERE username = p_username;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION cambiar_password(p_user_id INTEGER, p_old_password TEXT, p_new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_password_hash TEXT;
  v_username TEXT;
BEGIN
  SELECT password_hash, username INTO v_password_hash, v_username FROM usuarios WHERE id = p_user_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Usuario no encontrado'; END IF;
  IF v_password_hash != crypt(p_old_password, v_password_hash) THEN RAISE EXCEPTION 'Contraseña actual incorrecta'; END IF;
  IF LENGTH(p_new_password) < 8 THEN RAISE EXCEPTION 'La nueva contraseña debe tener al menos 8 caracteres'; END IF;
  IF NOT (p_new_password ~ '[a-zA-Z]') THEN RAISE EXCEPTION 'La nueva contraseña debe contener al menos una letra'; END IF;
  IF NOT (p_new_password ~ '[0-9]') THEN RAISE EXCEPTION 'La nueva contraseña debe contener al menos un número'; END IF;
  IF crypt(p_new_password, v_password_hash) = v_password_hash THEN RAISE EXCEPTION 'La nueva contraseña no puede ser igual a la anterior'; END IF;

  UPDATE usuarios SET password_hash = crypt(p_new_password, gen_salt('bf')), debe_cambiar_password = false, password_changed_at = NOW(), actualizado_en = NOW() WHERE id = p_user_id;
  RAISE NOTICE 'Contraseña actualizada para usuario: %', v_username;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION admin_reset_password(p_user_id INTEGER, p_new_password TEXT, p_force_change BOOLEAN DEFAULT true)
RETURNS BOOLEAN AS $$
DECLARE
  v_username TEXT;
BEGIN
  SELECT username INTO v_username FROM usuarios WHERE id = p_user_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Usuario no encontrado'; END IF;
  IF LENGTH(p_new_password) < 8 THEN RAISE EXCEPTION 'La nueva contraseña debe tener al menos 8 caracteres'; END IF;

  UPDATE usuarios SET password_hash = crypt(p_new_password, gen_salt('bf')), debe_cambiar_password = p_force_change, password_changed_at = NOW(), actualizado_en = NOW() WHERE id = p_user_id;
  RAISE NOTICE 'Contraseña reseteada por admin para usuario: % (debe cambiar: %)', v_username, p_force_change;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION crear_usuario(p_username TEXT, p_password TEXT, p_nombre TEXT, p_rol TEXT, p_cliente_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
  v_user_id INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM usuarios WHERE username = p_username) THEN RAISE EXCEPTION 'El username "%" ya existe', p_username; END IF;
  IF p_rol NOT IN ('admin', 'cliente') THEN RAISE EXCEPTION 'Rol inválido. Debe ser "admin" o "cliente"'; END IF;
  IF p_rol = 'cliente' AND p_cliente_id IS NULL THEN RAISE EXCEPTION 'Los usuarios con rol "cliente" deben tener un cliente_id'; END IF;
  IF LENGTH(p_password) < 8 THEN RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres'; END IF;

  INSERT INTO usuarios (username, password_hash, nombre, rol, cliente_id, activo)
  VALUES (p_username, crypt(p_password, gen_salt('bf')), p_nombre, p_rol, p_cliente_id, true)
  RETURNING id INTO v_user_id;

  RAISE NOTICE 'Usuario creado: % (ID: %)', p_username, v_user_id;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tabla de logs
CREATE TABLE auth_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  username TEXT,
  evento TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_logs_user ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_evento ON auth_logs(evento);
CREATE INDEX idx_auth_logs_fecha ON auth_logs(creado_en DESC);

CREATE FUNCTION log_auth_event(p_user_id INTEGER, p_username TEXT, p_evento TEXT, p_ip_address TEXT DEFAULT NULL, p_metadata JSONB DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO auth_logs (user_id, username, evento, ip_address, metadata) VALUES (p_user_id, p_username, p_evento, p_ip_address, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- Actualizar admin password
UPDATE usuarios SET password_hash = crypt('MYP@admin2025!', gen_salt('bf')), debe_cambiar_password = false, password_changed_at = NOW() WHERE username = 'admin';

-- VERIFICACIÓN
DO $$
BEGIN
  RAISE NOTICE '================================';
  RAISE NOTICE '✅ SISTEMA DE AUTENTICACIÓN CONFIGURADO';
  RAISE NOTICE '================================';
  RAISE NOTICE '🔑 Credenciales admin:';
  RAISE NOTICE '  Username: admin';
  RAISE NOTICE '  Password: MYP@admin2025!';
END $$;

SELECT id, username, nombre, rol, LEFT(password_hash, 10) as pwd_sample, debe_cambiar_password FROM usuarios ORDER BY id;
