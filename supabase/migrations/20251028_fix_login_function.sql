-- ============================================
-- FIX verificar_login function - Resolver ambigüedad
-- ============================================

-- Recrear función verificar_login con alias de tabla
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
    UPDATE usuarios u
    SET ultimo_login = now()
    WHERE u.email = p_email;
  END IF;
END;
$$;

-- Probar la función
SELECT * FROM verificar_login('admin@mulleryperez.cl', 'admin123');
