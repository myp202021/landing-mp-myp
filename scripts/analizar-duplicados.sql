-- ============================================
-- ANÁLISIS DE DUPLICADOS EN CRM
-- Script para detectar leads duplicados
-- ============================================

-- 1. DUPLICADOS POR EMAIL (mismo cliente_id, mismo email, diferentes fechas)
SELECT
  'Duplicados por Email' as tipo,
  cliente_id,
  email,
  COUNT(*) as total_duplicados,
  MIN(fecha_ingreso) as primera_fecha,
  MAX(fecha_ingreso) as ultima_fecha,
  ARRAY_AGG(id ORDER BY fecha_ingreso DESC) as lead_ids
FROM leads
WHERE email IS NOT NULL AND email != ''
GROUP BY cliente_id, email
HAVING COUNT(*) > 1
ORDER BY total_duplicados DESC, cliente_id;

-- 2. DUPLICADOS POR TELÉFONO (mismo cliente_id, mismo teléfono, diferentes fechas)
SELECT
  'Duplicados por Teléfono' as tipo,
  cliente_id,
  telefono,
  COUNT(*) as total_duplicados,
  MIN(fecha_ingreso) as primera_fecha,
  MAX(fecha_ingreso) as ultima_fecha,
  ARRAY_AGG(id ORDER BY fecha_ingreso DESC) as lead_ids
FROM leads
WHERE telefono IS NOT NULL AND telefono != ''
GROUP BY cliente_id, telefono
HAVING COUNT(*) > 1
ORDER BY total_duplicados DESC, cliente_id;

-- 3. DUPLICADOS POR NOMBRE COMPLETO (mismo cliente, nombre+apellido similares)
SELECT
  'Duplicados por Nombre' as tipo,
  cliente_id,
  LOWER(TRIM(nombre || ' ' || COALESCE(apellido, ''))) as nombre_completo,
  COUNT(*) as total_duplicados,
  ARRAY_AGG(DISTINCT email) as emails,
  ARRAY_AGG(DISTINCT telefono) as telefonos,
  ARRAY_AGG(id ORDER BY fecha_ingreso DESC) as lead_ids
FROM leads
WHERE nombre IS NOT NULL AND nombre != ''
GROUP BY cliente_id, LOWER(TRIM(nombre || ' ' || COALESCE(apellido, '')))
HAVING COUNT(*) > 1
ORDER BY total_duplicados DESC, cliente_id;

-- 4. ESTADÍSTICAS GENERALES DE DUPLICADOS
WITH email_dups AS (
  SELECT cliente_id, email, COUNT(*) as cnt
  FROM leads
  WHERE email IS NOT NULL AND email != ''
  GROUP BY cliente_id, email
  HAVING COUNT(*) > 1
),
tel_dups AS (
  SELECT cliente_id, telefono, COUNT(*) as cnt
  FROM leads
  WHERE telefono IS NOT NULL AND telefono != ''
  GROUP BY cliente_id, telefono
  HAVING COUNT(*) > 1
)
SELECT
  c.nombre as cliente,
  COUNT(DISTINCT l.id) as total_leads,
  COALESCE((SELECT COUNT(*) FROM email_dups WHERE email_dups.cliente_id = c.id), 0) as grupos_email_duplicados,
  COALESCE((SELECT SUM(cnt) FROM email_dups WHERE email_dups.cliente_id = c.id), 0) as leads_email_duplicados,
  COALESCE((SELECT COUNT(*) FROM tel_dups WHERE tel_dups.cliente_id = c.id), 0) as grupos_tel_duplicados,
  COALESCE((SELECT SUM(cnt) FROM tel_dups WHERE tel_dups.cliente_id = c.id), 0) as leads_tel_duplicados
FROM clientes c
LEFT JOIN leads l ON l.cliente_id = c.id
WHERE c.activo = true
GROUP BY c.id, c.nombre
ORDER BY total_leads DESC;

-- 5. LEADS CON DATOS CASI IDÉNTICOS (email O teléfono iguales, mismo mes)
SELECT
  'Duplicados por Email/Tel en mismo mes' as tipo,
  l1.cliente_id,
  l1.id as lead_id_1,
  l2.id as lead_id_2,
  l1.email,
  l1.telefono,
  l1.nombre as nombre_1,
  l2.nombre as nombre_2,
  l1.fecha_ingreso as fecha_1,
  l2.fecha_ingreso as fecha_2,
  EXTRACT(DAY FROM (l2.fecha_ingreso - l1.fecha_ingreso)) as dias_diferencia
FROM leads l1
INNER JOIN leads l2 ON
  l1.cliente_id = l2.cliente_id AND
  l1.id < l2.id AND
  (
    (l1.email IS NOT NULL AND l1.email = l2.email) OR
    (l1.telefono IS NOT NULL AND l1.telefono = l2.telefono)
  ) AND
  DATE_TRUNC('month', l1.fecha_ingreso) = DATE_TRUNC('month', l2.fecha_ingreso)
ORDER BY l1.cliente_id, l1.email, l1.telefono, l1.fecha_ingreso;

-- 6. DETECCIÓN DE EMAILS/TELÉFONOS CON FORMATO INCONSISTENTE
-- Emails con espacios, mayúsculas, etc.
SELECT
  'Emails con formato inconsistente' as tipo,
  cliente_id,
  email,
  LOWER(TRIM(email)) as email_normalizado,
  COUNT(*) as total
FROM leads
WHERE email IS NOT NULL
  AND email != ''
  AND (
    email != LOWER(TRIM(email)) OR
    email LIKE '% %' OR
    email LIKE '%  %'
  )
GROUP BY cliente_id, email, email_normalizado
ORDER BY total DESC;

-- Teléfonos con formato inconsistente (con/sin espacios, guiones, paréntesis)
SELECT
  'Teléfonos con formato inconsistente' as tipo,
  cliente_id,
  telefono,
  REGEXP_REPLACE(telefono, '[^0-9+]', '', 'g') as telefono_normalizado,
  COUNT(*) as total
FROM leads
WHERE telefono IS NOT NULL
  AND telefono != ''
  AND telefono != REGEXP_REPLACE(telefono, '[^0-9+]', '', 'g')
GROUP BY cliente_id, telefono, telefono_normalizado
ORDER BY total DESC;

-- 7. RESUMEN EJECUTIVO
SELECT
  'RESUMEN EJECUTIVO' as titulo,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM clientes WHERE activo = true) as total_clientes,
  (SELECT COUNT(*) FROM (
    SELECT cliente_id, email FROM leads
    WHERE email IS NOT NULL AND email != ''
    GROUP BY cliente_id, email HAVING COUNT(*) > 1
  ) x) as grupos_duplicados_email,
  (SELECT COUNT(*) FROM (
    SELECT cliente_id, telefono FROM leads
    WHERE telefono IS NOT NULL AND telefono != ''
    GROUP BY cliente_id, telefono HAVING COUNT(*) > 1
  ) x) as grupos_duplicados_tel,
  (SELECT COUNT(*) FROM leads WHERE email IS NULL OR email = '') as leads_sin_email,
  (SELECT COUNT(*) FROM leads WHERE telefono IS NULL OR telefono = '') as leads_sin_telefono,
  (SELECT COUNT(*) FROM leads WHERE (email IS NULL OR email = '') AND (telefono IS NULL OR telefono = '')) as leads_sin_contacto;
