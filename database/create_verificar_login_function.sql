-- =====================================================
-- FUNCIÓN: verificar_login()
-- Valida credenciales de usuario con bcrypt
-- =====================================================

-- Habilitar extensión pgcrypto para bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear o reemplazar función verificar_login
CREATE OR REPLACE FUNCTION verificar_login(
    p_username TEXT,
    p_password TEXT
)
RETURNS TABLE (
    user_id INT,
    username TEXT,
    nombre TEXT,
    rol TEXT,
    cliente_id UUID,
    debe_cambiar_password BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id::INT,
        u.username,
        u.nombre,
        u.rol,
        u.cliente_id,
        u.debe_cambiar_password
    FROM usuarios u
    WHERE u.username = p_username
      AND u.activo = true
      AND (
          -- Verificar con bcrypt si el hash comienza con $2
          (u.password_hash LIKE '$2%' AND crypt(p_password, u.password_hash) = u.password_hash)
          OR
          -- Comparación directa si no está hasheado (retrocompatibilidad)
          (u.password_hash NOT LIKE '$2%' AND u.password_hash = p_password)
      );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION verificar_login IS 'Verifica las credenciales de un usuario usando bcrypt. Retorna los datos del usuario si las credenciales son correctas.';

-- Probar la función
SELECT * FROM verificar_login('myp', 'mypcliente2025');
