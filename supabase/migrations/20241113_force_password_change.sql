-- ============================================
-- FORZAR CAMBIO DE CONTRASEÑA
-- Migración de seguridad: Obligar a cambiar password por defecto
-- ============================================

-- 1. Agregar columna para forzar cambio de contraseña
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS debe_cambiar_password BOOLEAN DEFAULT false;

-- 2. Forzar cambio de contraseña al usuario admin
UPDATE usuarios
SET debe_cambiar_password = true
WHERE email = 'admin@mulleryperez.cl'
  AND password_hash = crypt('admin123', password_hash);

-- 3. Agregar columna de último cambio de contraseña
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

-- 4. Actualizar usuarios existentes
UPDATE usuarios
SET password_changed_at = creado_en
WHERE password_changed_at IS NULL;

-- 5. Función para validar fortaleza de contraseña
CREATE OR REPLACE FUNCTION validar_password_fuerte(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Mínimo 8 caracteres
  IF length(password) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
  END IF;

  -- Debe contener al menos una letra
  IF password !~ '[a-zA-Z]' THEN
    RAISE EXCEPTION 'La contraseña debe contener al menos una letra';
  END IF;

  -- Debe contener al menos un número
  IF password !~ '[0-9]' THEN
    RAISE EXCEPTION 'La contraseña debe contener al menos un número';
  END IF;

  -- No puede ser contraseña común
  IF password IN ('password', 'admin123', '12345678', 'qwerty', 'letmein') THEN
    RAISE EXCEPTION 'Esta contraseña es demasiado común, elige otra';
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 6. Función para cambiar contraseña (validando fortaleza)
CREATE OR REPLACE FUNCTION cambiar_password(
  p_user_id UUID,
  p_old_password TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_password_hash TEXT;
BEGIN
  -- Validar contraseña actual
  SELECT password_hash INTO v_password_hash
  FROM usuarios
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  IF v_password_hash != crypt(p_old_password, v_password_hash) THEN
    RAISE EXCEPTION 'Contraseña actual incorrecta';
  END IF;

  -- Validar nueva contraseña
  PERFORM validar_password_fuerte(p_new_password);

  -- No puede ser igual a la anterior
  IF crypt(p_new_password, v_password_hash) = v_password_hash THEN
    RAISE EXCEPTION 'La nueva contraseña no puede ser igual a la anterior';
  END IF;

  -- Actualizar contraseña
  UPDATE usuarios
  SET
    password_hash = crypt(p_new_password, gen_salt('bf')),
    debe_cambiar_password = false,
    password_changed_at = now()
  WHERE id = p_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Crear tabla de historial de contraseñas (opcional)
CREATE TABLE IF NOT EXISTS password_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_history_user ON password_history(user_id, changed_at DESC);

-- 8. Trigger para guardar historial de contraseñas
CREATE OR REPLACE FUNCTION save_password_history()
RETURNS trigger AS $$
BEGIN
  IF NEW.password_hash IS DISTINCT FROM OLD.password_hash THEN
    INSERT INTO password_history (user_id, password_hash)
    VALUES (NEW.id, OLD.password_hash);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_password_history ON usuarios;
CREATE TRIGGER trg_password_history
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  WHEN (OLD.password_hash IS DISTINCT FROM NEW.password_hash)
  EXECUTE FUNCTION save_password_history();

-- 9. Comentarios
COMMENT ON COLUMN usuarios.debe_cambiar_password IS 'TRUE si el usuario debe cambiar su contraseña en el próximo login';
COMMENT ON COLUMN usuarios.password_changed_at IS 'Fecha del último cambio de contraseña';
COMMENT ON FUNCTION validar_password_fuerte IS 'Valida que la contraseña cumpla requisitos mínimos de seguridad';
COMMENT ON FUNCTION cambiar_password IS 'Cambia la contraseña del usuario validando fortaleza';
COMMENT ON TABLE password_history IS 'Historial de contraseñas anteriores para evitar reutilización';

-- 10. Notificar
DO $$
DECLARE
  usuarios_afectados INTEGER;
BEGIN
  SELECT COUNT(*) INTO usuarios_afectados
  FROM usuarios
  WHERE debe_cambiar_password = true;

  RAISE NOTICE '✅ Migración de seguridad completada';
  RAISE NOTICE '⚠️  % usuario(s) deben cambiar su contraseña', usuarios_afectados;
  RAISE NOTICE 'ℹ️  Las contraseñas ahora requieren mínimo 8 caracteres con letras y números';
END $$;
