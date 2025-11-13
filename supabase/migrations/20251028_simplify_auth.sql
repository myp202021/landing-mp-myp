-- ============================================
-- SIMPLIFICACIÓN DE AUTENTICACIÓN
-- Migración 2: Agregar passwords y simplificar usuarios
-- ============================================

-- 1. Modificar tabla usuarios para incluir password
ALTER TABLE usuarios
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Agregar columna de password (bcrypt hash)
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Crear función para hash de passwords (usando pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. Función helper para crear usuarios con password
CREATE OR REPLACE FUNCTION crear_usuario_con_password(
  p_email TEXT,
  p_password TEXT,
  p_nombre TEXT,
  p_cliente_id UUID,
  p_rol TEXT DEFAULT 'cliente'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Validar email único
  IF EXISTS (SELECT 1 FROM usuarios WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email ya existe';
  END IF;

  -- Crear usuario con password hasheado
  INSERT INTO usuarios (email, password_hash, nombre, cliente_id, rol, activo)
  VALUES (
    p_email,
    crypt(p_password, gen_salt('bf')),  -- bcrypt
    p_nombre,
    p_cliente_id,
    p_rol,
    true
  )
  RETURNING id INTO v_user_id;

  RETURN v_user_id;
END;
$$;

-- 4. Función para verificar login
CREATE OR REPLACE FUNCTION verificar_login(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  nombre TEXT,
  cliente_id UUID,
  rol TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.nombre,
    u.cliente_id,
    u.rol
  FROM usuarios u
  WHERE
    u.email = p_email
    AND u.password_hash = crypt(p_password, u.password_hash)
    AND u.activo = true;

  -- Actualizar último login si hay match
  IF FOUND THEN
    UPDATE usuarios
    SET ultimo_login = now()
    WHERE email = p_email;
  END IF;
END;
$$;

-- 5. Crear usuario admin por defecto (password: admin123)
-- IMPORTANTE: Cambiar este password después del primer login
INSERT INTO usuarios (id, email, password_hash, nombre, rol, activo)
VALUES (
  gen_random_uuid(),
  'admin@mulleryperez.cl',
  crypt('admin123', gen_salt('bf')),
  'Administrador M&P',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- 6. Comentarios
COMMENT ON FUNCTION crear_usuario_con_password IS 'Crea un usuario con password hasheado usando bcrypt';
COMMENT ON FUNCTION verificar_login IS 'Verifica credenciales y retorna datos del usuario';
