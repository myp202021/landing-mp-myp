-- Test verificar_login function
-- Ejecuta esto en Supabase SQL Editor para verificar si funciona

-- 1. Verificar que existe la función
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'verificar_login';

-- 2. Probar login directamente
SELECT * FROM verificar_login('admin@mulleryperez.cl', 'admin123');

-- 3. Ver el usuario en la tabla
SELECT id, email, nombre, rol, activo, password_hash IS NOT NULL as tiene_password
FROM usuarios
WHERE email = 'admin@mulleryperez.cl';
