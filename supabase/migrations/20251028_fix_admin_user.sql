-- ============================================
-- FIX ADMIN USER - Crear cliente M&P y asociar admin
-- ============================================

-- 1. Crear cliente M&P si no existe
INSERT INTO clientes (nombre, rubro, activo)
VALUES ('Müller & Pérez', 'Agencia Marketing', true)
ON CONFLICT DO NOTHING
RETURNING id;

-- 2. Actualizar o crear usuario admin con cliente M&P
DO $$
DECLARE
  v_cliente_id UUID;
BEGIN
  -- Obtener ID del cliente M&P
  SELECT id INTO v_cliente_id
  FROM clientes
  WHERE nombre = 'Müller & Pérez'
  LIMIT 1;

  -- Si existe usuario admin, actualizarlo
  IF EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@mulleryperez.cl') THEN
    UPDATE usuarios
    SET
      cliente_id = v_cliente_id,
      password_hash = crypt('admin123', gen_salt('bf')),
      activo = true
    WHERE email = 'admin@mulleryperez.cl';
  ELSE
    -- Si no existe, crearlo
    INSERT INTO usuarios (email, password_hash, nombre, cliente_id, rol, activo)
    VALUES (
      'admin@mulleryperez.cl',
      crypt('admin123', gen_salt('bf')),
      'Administrador M&P',
      v_cliente_id,
      'admin',
      true
    );
  END IF;
END $$;

-- 3. Verificar que se creó correctamente
SELECT
  u.id,
  u.email,
  u.nombre,
  u.rol,
  c.nombre as cliente_nombre,
  u.activo
FROM usuarios u
LEFT JOIN clientes c ON u.cliente_id = c.id
WHERE u.email = 'admin@mulleryperez.cl';
