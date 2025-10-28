-- ============================================
-- MINI-CRM PARA GESTIÓN DE LEADS META
-- Migración inicial - Schema completo
-- ============================================

-- CLIENTES (Multi-tenant)
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  rubro TEXT,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT now(),
  actualizado_en TIMESTAMPTZ DEFAULT now()
);

-- USUARIOS (vinculados a Auth.js o Supabase Auth)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY, -- auth_user_id del proveedor
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  rol TEXT CHECK (rol IN ('admin', 'cliente')) DEFAULT 'cliente',
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT now(),
  ultimo_login TIMESTAMPTZ
);

-- CATÁLOGO DE RAZONES DE NO VENTA
CREATE TABLE IF NOT EXISTS catalogo_razones (
  id SERIAL PRIMARY KEY,
  etiqueta TEXT UNIQUE NOT NULL,
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT true
);

-- LEADS (datos normalizados de Meta)
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,

  -- Contexto de campaña
  rubro TEXT,
  campana_nombre TEXT,
  adset_nombre TEXT,
  ad_nombre TEXT,
  form_nombre TEXT,

  -- Timestamp y mes derivado
  fecha_ingreso TIMESTAMPTZ NOT NULL,
  mes_ingreso TEXT,

  -- Datos del lead
  nombre TEXT,
  apellido TEXT,
  empresa TEXT,
  telefono TEXT,
  email TEXT,
  ciudad TEXT,
  region TEXT,
  mensaje TEXT,
  presupuesto TEXT,
  servicio TEXT,

  -- Gestión comercial
  contactado BOOLEAN DEFAULT false,
  fecha_contacto DATE,
  vendido BOOLEAN DEFAULT false,
  monto_vendido NUMERIC(14,2),
  razon_no_venta TEXT,
  observaciones TEXT,

  -- Metadata
  carga_id BIGINT, -- referencia a cargas (sin FK para no bloquear)
  creado_en TIMESTAMPTZ DEFAULT now(),
  actualizado_en TIMESTAMPTZ DEFAULT now(),

  -- Índices para búsqueda
  CONSTRAINT unique_lead_email_fecha UNIQUE (cliente_id, email, fecha_ingreso),
  CONSTRAINT unique_lead_telefono_fecha UNIQUE (cliente_id, telefono, fecha_ingreso)
);

-- HISTORIAL DE CARGAS / ARCHIVOS SUBIDOS
CREATE TABLE IF NOT EXISTS cargas (
  id BIGSERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  uploader_user_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

  -- Archivo
  filename TEXT NOT NULL,
  storage_url TEXT, -- URL de Supabase Storage
  size_bytes BIGINT,
  mime_type TEXT,
  checksum_sha256 TEXT,

  -- Metadata del procesamiento
  columnas_detectadas JSONB, -- ["col1", "col2", ...]
  mapeo_campos JSONB, -- { "full_name": "nombre", ... }
  esquema_snapshot JSONB, -- { "nombre": "text", ... }

  -- Resultados
  rows_ok INT DEFAULT 0,
  rows_error INT DEFAULT 0,
  rows_duplicados INT DEFAULT 0,
  ejemplos_error JSONB, -- hasta 10 errores [{ row, error }]

  -- Extras
  meta JSONB, -- { delimiter, encoding, ... }
  estado TEXT CHECK (estado IN ('procesando', 'completado', 'error')) DEFAULT 'completado',

  creado_en TIMESTAMPTZ DEFAULT now()
);

-- AUDITORÍA DE CAMBIOS EN LEADS
CREATE TABLE IF NOT EXISTS lead_audits (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL,
  actor_user_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

  accion TEXT CHECK (accion IN ('insert', 'update', 'delete', 'bulk_upload')) NOT NULL,
  cambios JSONB NOT NULL, -- { campo: { old, new }, ... }
  razon TEXT,
  request_id UUID, -- para agrupar cambios de una misma petición

  creado_en TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_cliente_id ON leads(cliente_id);
CREATE INDEX IF NOT EXISTS idx_leads_fecha_ingreso ON leads(fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_leads_mes_ingreso ON leads(mes_ingreso);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_telefono ON leads(telefono);
CREATE INDEX IF NOT EXISTS idx_leads_contactado ON leads(contactado);
CREATE INDEX IF NOT EXISTS idx_leads_vendido ON leads(vendido);

CREATE INDEX IF NOT EXISTS idx_cargas_cliente_id ON cargas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cargas_checksum ON cargas(checksum_sha256);

CREATE INDEX IF NOT EXISTS idx_audits_lead_id ON lead_audits(lead_id);
CREATE INDEX IF NOT EXISTS idx_audits_cliente_id ON lead_audits(cliente_id);
CREATE INDEX IF NOT EXISTS idx_audits_creado_en ON lead_audits(creado_en DESC);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para calcular diff entre dos JSONBs
CREATE OR REPLACE FUNCTION jsonb_diff(old_row JSONB, new_row JSONB)
RETURNS JSONB
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT COALESCE(
    jsonb_object_agg(
      k,
      jsonb_build_object('old', old_row->k, 'new', new_row->k)
    ) FILTER (WHERE old_row->k IS DISTINCT FROM new_row->k),
    '{}'::jsonb
  )
  FROM (
    SELECT jsonb_object_keys(old_row) AS k
    UNION
    SELECT jsonb_object_keys(new_row)
  ) s;
$$;

-- ============================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- ============================================

-- Trigger para calcular mes_ingreso automáticamente
CREATE OR REPLACE FUNCTION leads_set_mes_ingreso()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.mes_ingreso := to_char(NEW.fecha_ingreso, 'YYYY-MM');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_leads_set_mes ON leads;
CREATE TRIGGER trg_leads_set_mes
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION leads_set_mes_ingreso();

-- Trigger INSERT
CREATE OR REPLACE FUNCTION leads_audit_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO lead_audits(lead_id, cliente_id, actor_user_id, accion, cambios)
  VALUES (
    NEW.id,
    NEW.cliente_id,
    auth.uid(), -- Supabase auth
    'insert',
    jsonb_build_object(
      'nombre', jsonb_build_object('new', NEW.nombre),
      'email', jsonb_build_object('new', NEW.email),
      'telefono', jsonb_build_object('new', NEW.telefono)
    )
  );
  RETURN NEW;
END;
$$;

-- Trigger UPDATE
CREATE OR REPLACE FUNCTION leads_audit_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  diff JSONB;
BEGIN
  diff := jsonb_diff(to_jsonb(OLD), to_jsonb(NEW));

  IF diff <> '{}'::jsonb THEN
    INSERT INTO lead_audits(lead_id, cliente_id, actor_user_id, accion, cambios)
    VALUES (
      NEW.id,
      NEW.cliente_id,
      auth.uid(),
      'update',
      diff
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger DELETE
CREATE OR REPLACE FUNCTION leads_audit_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO lead_audits(lead_id, cliente_id, actor_user_id, accion, cambios)
  VALUES (
    OLD.id,
    OLD.cliente_id,
    auth.uid(),
    'delete',
    jsonb_build_object(
      'nombre', jsonb_build_object('old', OLD.nombre),
      'email', jsonb_build_object('old', OLD.email),
      'telefono', jsonb_build_object('old', OLD.telefono)
    )
  );
  RETURN OLD;
END;
$$;

-- Crear triggers
DROP TRIGGER IF EXISTS trg_leads_ins ON leads;
CREATE TRIGGER trg_leads_ins
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION leads_audit_insert();

DROP TRIGGER IF EXISTS trg_leads_upd ON leads;
CREATE TRIGGER trg_leads_upd
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION leads_audit_update();

DROP TRIGGER IF EXISTS trg_leads_del ON leads;
CREATE TRIGGER trg_leads_del
  AFTER DELETE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION leads_audit_delete();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_audits ENABLE ROW LEVEL SECURITY;

-- Policies para CLIENTES (solo admin puede ver todos)
CREATE POLICY clientes_admin_all ON clientes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

CREATE POLICY clientes_usuario_own ON clientes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = clientes.id
    )
  );

-- Policies para USUARIOS (admin ve todos, usuario solo a sí mismo)
CREATE POLICY usuarios_admin_all ON usuarios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

CREATE POLICY usuarios_self ON usuarios
  FOR SELECT
  USING (id = auth.uid());

-- Policies para LEADS (solo del mismo cliente)
CREATE POLICY leads_select ON leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = leads.cliente_id
    )
  );

CREATE POLICY leads_insert ON leads
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = leads.cliente_id
    )
  );

CREATE POLICY leads_update ON leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = leads.cliente_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = leads.cliente_id
    )
  );

CREATE POLICY leads_delete ON leads
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = leads.cliente_id
    )
  );

-- Policies para CARGAS (solo del mismo cliente)
CREATE POLICY cargas_access ON cargas
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = cargas.cliente_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = cargas.cliente_id
    )
  );

-- Policies para LEAD_AUDITS (solo lectura, mismo cliente)
CREATE POLICY lead_audits_select ON lead_audits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = lead_audits.cliente_id
    )
  );

-- ============================================
-- SEED DATA
-- ============================================

-- Catálogo de razones de no venta
INSERT INTO catalogo_razones (etiqueta, orden) VALUES
  ('No contesta / sin respuesta', 1),
  ('Número incorrecto / inválido', 2),
  ('Correo rebotado', 3),
  ('No interesado', 4),
  ('No tiene presupuesto', 5),
  ('Producto/servicio no disponible', 6),
  ('Fuera de cobertura geográfica', 7),
  ('Cliente duplicado', 8),
  ('Competencia cerró primero', 9),
  ('Plazo no calza', 10),
  ('Otra (especificar en observaciones)', 11)
ON CONFLICT (etiqueta) DO NOTHING;

-- Cliente demo M&P
INSERT INTO clientes (id, nombre, rubro) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Muller y Pérez', 'Agencia Marketing')
ON CONFLICT (id) DO NOTHING;

-- Cliente demo para testing
INSERT INTO clientes (id, nombre, rubro) VALUES
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Cliente Demo', 'E-commerce')
ON CONFLICT (id) DO NOTHING;

-- NOTA: Los usuarios se crearán desde el panel de admin
-- porque necesitan auth_user_id real de Supabase Auth

COMMENT ON TABLE clientes IS 'Empresas clientes del CRM';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema vinculados a Supabase Auth';
COMMENT ON TABLE leads IS 'Leads importados desde Meta Ads con datos normalizados';
COMMENT ON TABLE cargas IS 'Historial de archivos subidos con metadata de procesamiento';
COMMENT ON TABLE lead_audits IS 'Auditoría automática de cambios en leads';
