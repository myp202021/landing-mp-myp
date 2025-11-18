-- =====================================================
-- FIX: Actualizar contraseñas de usuarios
-- Para sincronizar con el código hardcodeado
-- =====================================================

-- 1. Actualizar contraseña del usuario admin
UPDATE usuarios
SET password_hash = 'MYP@admin2025!'
WHERE username = 'admin';

-- 2. Insertar o actualizar usuario M&P
INSERT INTO usuarios (username, password_hash, nombre, rol, cliente_id, activo)
VALUES ('myp', 'mypcliente2025', 'M&P Marketing y Performance', 'cliente', NULL, true)
ON CONFLICT (username)
DO UPDATE SET
  password_hash = 'mypcliente2025',
  nombre = 'M&P Marketing y Performance',
  activo = true;

-- 3. Insertar o actualizar usuario cliente1 (demo)
INSERT INTO usuarios (username, password_hash, nombre, rol, cliente_id, activo)
VALUES ('cliente1', 'Cliente@2025!', 'Cliente Demo', 'cliente', NULL, true)
ON CONFLICT (username)
DO UPDATE SET
  password_hash = 'Cliente@2025!',
  nombre = 'Cliente Demo',
  activo = true;

-- 4. Verificar usuarios creados
SELECT id, username, nombre, rol, activo, creado_en
FROM usuarios
ORDER BY id;
