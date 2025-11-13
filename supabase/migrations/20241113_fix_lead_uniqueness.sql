-- ============================================
-- CORREGIR CONSTRAINTS DE UNICIDAD EN LEADS
-- Problema: Permite duplicados si la hora difiere
-- Solución: Comparar solo fecha (sin hora)
-- ============================================

-- 1. Eliminar constraints antiguos problemáticos
ALTER TABLE leads DROP CONSTRAINT IF EXISTS unique_lead_email_fecha;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS unique_lead_telefono_fecha;

-- 2. Crear funciones de normalización
CREATE OR REPLACE FUNCTION normalize_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email IS NULL OR email = '' THEN
    RETURN NULL;
  END IF;
  RETURN LOWER(TRIM(email));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone IS NULL OR phone = '' THEN
    RETURN NULL;
  END IF;
  -- Eliminar todo excepto números y +
  RETURN regexp_replace(phone, '[^0-9+]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Trigger para detectar duplicado de email (mismo cliente, mismo día)
CREATE OR REPLACE FUNCTION check_duplicate_lead_email()
RETURNS trigger AS $$
DECLARE
  normalized_email TEXT;
  fecha_dia DATE;
BEGIN
  -- Normalizar email
  normalized_email := normalize_email(NEW.email);

  -- Si no hay email, no validar
  IF normalized_email IS NULL THEN
    RETURN NEW;
  END IF;

  -- Extraer solo la fecha (sin hora)
  fecha_dia := DATE(NEW.fecha_ingreso);

  -- Buscar duplicado
  IF EXISTS (
    SELECT 1 FROM leads
    WHERE cliente_id = NEW.cliente_id
    AND normalize_email(email) = normalized_email
    AND DATE(fecha_ingreso) = fecha_dia
    AND id != COALESCE(NEW.id, 0)  -- Excluir el mismo registro en UPDATE
  ) THEN
    RAISE EXCEPTION 'Lead con email % ya existe para el cliente en la fecha %', NEW.email, fecha_dia
      USING ERRCODE = '23505'; -- unique_violation
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para detectar duplicado de teléfono (mismo cliente, mismo día)
CREATE OR REPLACE FUNCTION check_duplicate_lead_phone()
RETURNS trigger AS $$
DECLARE
  normalized_phone TEXT;
  fecha_dia DATE;
BEGIN
  -- Normalizar teléfono
  normalized_phone := normalize_phone(NEW.telefono);

  -- Si no hay teléfono, no validar
  IF normalized_phone IS NULL THEN
    RETURN NEW;
  END IF;

  -- Extraer solo la fecha (sin hora)
  fecha_dia := DATE(NEW.fecha_ingreso);

  -- Buscar duplicado
  IF EXISTS (
    SELECT 1 FROM leads
    WHERE cliente_id = NEW.cliente_id
    AND normalize_phone(telefono) = normalized_phone
    AND DATE(fecha_ingreso) = fecha_dia
    AND id != COALESCE(NEW.id, 0)
  ) THEN
    RAISE EXCEPTION 'Lead con teléfono % ya existe para el cliente en la fecha %', NEW.telefono, fecha_dia
      USING ERRCODE = '23505';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Crear triggers
DROP TRIGGER IF EXISTS check_lead_email_dup ON leads;
CREATE TRIGGER check_lead_email_dup
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION check_duplicate_lead_email();

DROP TRIGGER IF EXISTS check_lead_phone_dup ON leads;
CREATE TRIGGER check_lead_phone_dup
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION check_duplicate_lead_phone();

-- 6. Crear índices para optimizar búsquedas de duplicados
CREATE INDEX IF NOT EXISTS idx_leads_email_normalized
  ON leads (cliente_id, normalize_email(email), DATE(fecha_ingreso))
  WHERE email IS NOT NULL AND email != '';

CREATE INDEX IF NOT EXISTS idx_leads_phone_normalized
  ON leads (cliente_id, normalize_phone(telefono), DATE(fecha_ingreso))
  WHERE telefono IS NOT NULL AND telefono != '';

-- 7. Comentarios
COMMENT ON FUNCTION normalize_email IS 'Normaliza email a minúsculas sin espacios';
COMMENT ON FUNCTION normalize_phone IS 'Normaliza teléfono eliminando caracteres especiales';
COMMENT ON FUNCTION check_duplicate_lead_email IS 'Valida que no exista lead duplicado por email en mismo día';
COMMENT ON FUNCTION check_duplicate_lead_phone IS 'Valida que no exista lead duplicado por teléfono en mismo día';

-- 8. Test de validación (comentar en producción)
DO $$
BEGIN
  RAISE NOTICE '✅ Migración completada: Constraints de unicidad mejorados';
  RAISE NOTICE 'ℹ️  Ahora los leads se comparan por FECHA (sin hora)';
  RAISE NOTICE 'ℹ️  Emails y teléfonos se normalizan antes de comparar';
END $$;
