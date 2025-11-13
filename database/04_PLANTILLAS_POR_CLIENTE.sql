-- =====================================================
-- SISTEMA DE PLANTILLAS POR CLIENTE CON LOGOS
-- Permite crear plantillas personalizadas con logo para cada cliente
-- =====================================================

-- =====================================================
-- PASO 1: Configurar Supabase Storage Bucket
-- =====================================================
-- IMPORTANTE: Este INSERT debe ejecutarse EN SUPABASE DASHBOARD
-- Si ya existe el bucket, ignorará el error

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plantillas-logos',
  'plantillas-logos',
  true,
  524288, -- 512 KB máximo
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PASO 2: Políticas de acceso al bucket
-- =====================================================

-- Política: Cualquiera puede LEER los logos (públicos)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'plantillas-logos' );

-- Política: Solo usuarios autenticados pueden SUBIR logos
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'plantillas-logos' );

-- Política: Solo usuarios autenticados pueden ACTUALIZAR logos
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'plantillas-logos' )
WITH CHECK ( bucket_id = 'plantillas-logos' );

-- Política: Solo usuarios autenticados pueden ELIMINAR logos
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'plantillas-logos' );

-- =====================================================
-- PASO 3: Actualizar tabla plantillas_cotizacion
-- =====================================================

-- Agregar columnas para sistema de plantillas por cliente
ALTER TABLE plantillas_cotizacion
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS logo_filename TEXT,
ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS plantilla_base_id INTEGER REFERENCES plantillas_cotizacion(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS es_base BOOLEAN DEFAULT false;

-- Comentarios para documentar
COMMENT ON COLUMN plantillas_cotizacion.logo_url IS 'URL pública del logo en Supabase Storage';
COMMENT ON COLUMN plantillas_cotizacion.logo_filename IS 'Nombre del archivo del logo';
COMMENT ON COLUMN plantillas_cotizacion.cliente_id IS 'NULL = plantilla base, con valor = plantilla de cliente específico';
COMMENT ON COLUMN plantillas_cotizacion.plantilla_base_id IS 'ID de la plantilla base desde la cual se clonó';
COMMENT ON COLUMN plantillas_cotizacion.es_base IS 'true = plantilla maestra/base, false = plantilla personalizada de cliente';

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_plantillas_cliente ON plantillas_cotizacion(cliente_id);
CREATE INDEX IF NOT EXISTS idx_plantillas_base ON plantillas_cotizacion(es_base);
CREATE INDEX IF NOT EXISTS idx_plantillas_base_id ON plantillas_cotizacion(plantilla_base_id);

-- =====================================================
-- PASO 4: Actualizar tabla clientes
-- =====================================================

-- Agregar columna para plantilla asignada al cliente
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS plantilla_asignada_id INTEGER REFERENCES plantillas_cotizacion(id) ON DELETE SET NULL;

COMMENT ON COLUMN clientes.plantilla_asignada_id IS 'Plantilla personalizada asignada al cliente para cotizaciones';

CREATE INDEX IF NOT EXISTS idx_clientes_plantilla ON clientes(plantilla_asignada_id);

-- =====================================================
-- PASO 5: Marcar plantillas existentes como BASE
-- =====================================================

-- Todas las plantillas actuales son plantillas base (maestras)
UPDATE plantillas_cotizacion
SET es_base = true,
    cliente_id = NULL
WHERE es_base IS NULL OR es_base = false;

-- =====================================================
-- PASO 6: Función para clonar plantilla base
-- =====================================================

CREATE OR REPLACE FUNCTION clonar_plantilla_para_cliente(
  p_plantilla_base_id INTEGER,
  p_cliente_id UUID,
  p_nombre_personalizado TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL,
  p_logo_filename TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_nueva_plantilla_id INTEGER;
  v_nombre_base TEXT;
  v_cliente_nombre TEXT;
BEGIN
  -- Obtener nombre de plantilla base
  SELECT nombre INTO v_nombre_base
  FROM plantillas_cotizacion
  WHERE id = p_plantilla_base_id AND es_base = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plantilla base no encontrada';
  END IF;

  -- Obtener nombre del cliente
  SELECT nombre INTO v_cliente_nombre
  FROM clientes
  WHERE id = p_cliente_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cliente no encontrado';
  END IF;

  -- Clonar plantilla
  INSERT INTO plantillas_cotizacion (
    nombre,
    descripcion,
    items_default,
    notas_default,
    vigencia_dias_default,
    descuento_default,
    logo_url,
    logo_filename,
    cliente_id,
    plantilla_base_id,
    es_base,
    activa
  )
  SELECT
    COALESCE(p_nombre_personalizado, v_nombre_base || ' - ' || v_cliente_nombre),
    descripcion,
    items_default,
    notas_default,
    vigencia_dias_default,
    descuento_default,
    p_logo_url,
    p_logo_filename,
    p_cliente_id,
    p_plantilla_base_id,
    false, -- No es plantilla base
    true
  FROM plantillas_cotizacion
  WHERE id = p_plantilla_base_id
  RETURNING id INTO v_nueva_plantilla_id;

  -- Asignar plantilla al cliente automáticamente
  UPDATE clientes
  SET plantilla_asignada_id = v_nueva_plantilla_id
  WHERE id = p_cliente_id;

  RAISE NOTICE 'Plantilla clonada (ID: %) y asignada al cliente: %', v_nueva_plantilla_id, v_cliente_nombre;

  RETURN v_nueva_plantilla_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION clonar_plantilla_para_cliente IS
'Clona una plantilla base para un cliente específico con logo personalizado';

-- =====================================================
-- PASO 7: Función para actualizar logo de plantilla
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_logo_plantilla(
  p_plantilla_id INTEGER,
  p_logo_url TEXT,
  p_logo_filename TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE plantillas_cotizacion
  SET
    logo_url = p_logo_url,
    logo_filename = p_logo_filename,
    actualizado_en = NOW()
  WHERE id = p_plantilla_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plantilla no encontrada';
  END IF;

  RAISE NOTICE 'Logo actualizado para plantilla ID: %', p_plantilla_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 8: Vista para plantillas con info del cliente
-- =====================================================

CREATE OR REPLACE VIEW v_plantillas_completas AS
SELECT
  p.*,
  c.nombre as cliente_nombre,
  c.empresa as cliente_empresa,
  pb.nombre as plantilla_base_nombre,
  CASE
    WHEN p.es_base THEN 'Plantilla Base'
    WHEN p.cliente_id IS NOT NULL THEN 'Plantilla de Cliente'
    ELSE 'Sin categorizar'
  END as tipo_plantilla
FROM plantillas_cotizacion p
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN plantillas_cotizacion pb ON p.plantilla_base_id = pb.id
ORDER BY p.es_base DESC, c.nombre ASC, p.nombre ASC;

COMMENT ON VIEW v_plantillas_completas IS
'Vista con información completa de plantillas y sus relaciones con clientes';

-- =====================================================
-- PASO 9: Función para obtener plantilla del cliente
-- =====================================================

CREATE OR REPLACE FUNCTION obtener_plantilla_cliente(
  p_cliente_id UUID
)
RETURNS TABLE(
  plantilla_id INTEGER,
  nombre TEXT,
  descripcion TEXT,
  items_default JSONB,
  notas_default TEXT,
  vigencia_dias_default INTEGER,
  descuento_default NUMERIC,
  logo_url TEXT,
  es_base BOOLEAN
) AS $$
BEGIN
  -- Buscar plantilla asignada al cliente
  RETURN QUERY
  SELECT
    p.id,
    p.nombre,
    p.descripcion,
    p.items_default,
    p.notas_default,
    p.vigencia_dias_default,
    p.descuento_default,
    p.logo_url,
    p.es_base
  FROM clientes c
  JOIN plantillas_cotizacion p ON c.plantilla_asignada_id = p.id
  WHERE c.id = p_cliente_id AND p.activa = true;

  -- Si no tiene plantilla asignada, devolver plantilla base por defecto
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.items_default,
      p.notas_default,
      p.vigencia_dias_default,
      p.descuento_default,
      p.logo_url,
      p.es_base
    FROM plantillas_cotizacion p
    WHERE p.es_base = true AND p.activa = true
    ORDER BY p.id ASC
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION obtener_plantilla_cliente IS
'Obtiene la plantilla asignada al cliente, o una plantilla base por defecto';

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '================================';
  RAISE NOTICE '✅ SISTEMA DE PLANTILLAS POR CLIENTE CONFIGURADO';
  RAISE NOTICE '================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Funcionalidades disponibles:';
  RAISE NOTICE '  • Bucket de Storage: plantillas-logos (512 KB max)';
  RAISE NOTICE '  • Formatos aceptados: PNG, JPG, JPEG, WebP';
  RAISE NOTICE '  • Función: clonar_plantilla_para_cliente()';
  RAISE NOTICE '  • Función: actualizar_logo_plantilla()';
  RAISE NOTICE '  • Función: obtener_plantilla_cliente()';
  RAISE NOTICE '  • Vista: v_plantillas_completas';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Columnas agregadas:';
  RAISE NOTICE '  • plantillas_cotizacion.logo_url';
  RAISE NOTICE '  • plantillas_cotizacion.cliente_id';
  RAISE NOTICE '  • plantillas_cotizacion.es_base';
  RAISE NOTICE '  • clientes.plantilla_asignada_id';
  RAISE NOTICE '';
END $$;

-- Mostrar resumen de plantillas
SELECT
  COUNT(*) FILTER (WHERE es_base = true) as plantillas_base,
  COUNT(*) FILTER (WHERE es_base = false) as plantillas_cliente,
  COUNT(*) FILTER (WHERE logo_url IS NOT NULL) as plantillas_con_logo
FROM plantillas_cotizacion;

-- Mostrar plantillas base disponibles
SELECT id, nombre, descripcion, es_base
FROM plantillas_cotizacion
WHERE es_base = true
ORDER BY nombre;
