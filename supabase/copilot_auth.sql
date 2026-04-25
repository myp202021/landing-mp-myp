-- Copilot Auth: agregar password_hash a clipping_suscripciones
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna password_hash
ALTER TABLE clipping_suscripciones
ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT NULL;

-- 2. Agregar columna debe_cambiar_password (primer login obliga cambio)
ALTER TABLE clipping_suscripciones
ADD COLUMN IF NOT EXISTS debe_cambiar_password BOOLEAN DEFAULT true;

-- 3. Agregar columna ultimo_login
ALTER TABLE clipping_suscripciones
ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ DEFAULT NULL;

-- 4. Index para login rápido por email
CREATE INDEX IF NOT EXISTS idx_clipping_suscripciones_email
ON clipping_suscripciones (email);

-- 5. Log de accesos
CREATE TABLE IF NOT EXISTS copilot_access_log (
  id SERIAL PRIMARY KEY,
  suscripcion_id UUID REFERENCES clipping_suscripciones(id),
  accion TEXT NOT NULL, -- 'login', 'logout', 'password_change', 'password_reset'
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RLS: solo service_role puede leer password_hash
-- (la tabla ya debería tener RLS habilitado)
