-- SCHEMA CRM MULLER Y PÉREZ
-- Base de datos en Supabase

-- Tabla de clientes (ya existe en Supabase)
-- clientes
--   id (uuid, primary key)
--   nombre (text) - nombre del cliente
--   email (text)
--   empresa (text)
--   telefono (text)
--   activo (boolean) - si el cliente tiene acceso activo
--   creado_en (timestamptz)
--   actualizado_en (timestamptz)

-- Tabla de leads (ya existe en Supabase, con estructura conocida)
-- leads
--   id (int8, primary key)
--   cliente_id (uuid, foreign key -> clientes.id)
--   fuente (text) - 'facebook_lead_ads', 'manual', etc.
--   nombre (text)
--   apellido (text)
--   email (text)
--   telefono (text)
--   empresa (text)
--   ciudad (text)
--   region (text)
--   mensaje (text)
--   presupuesto (text)
--   servicio (text)
--   rubro (text)
--   campana_nombre (text)
--   adset_nombre (text)
--   ad_nombre (text)
--   form_nombre (text)
--   meta_lead_id (text)
--   contactado (boolean) - Estado: fue contactado?
--   fecha_contacto (date)
--   vendido (boolean) - Estado: se cerró venta?
--   monto_vendido (numeric)
--   razon_no_venta (text)
--   observaciones (text)
--   notas (text) - Campo de texto libre para detalles adicionales
--   fecha_ingreso (timestamptz, NOT NULL)
--   mes_ingreso (text) - formato YYYY-MM
--   creado_en (timestamptz)
--   actualizado_en (timestamptz)

-- Nueva tabla: cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
  id SERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  lead_id INT8 REFERENCES leads(id) ON DELETE SET NULL,
  nombre_proyecto TEXT NOT NULL,
  cliente_nombre TEXT,
  cliente_email TEXT,
  cliente_empresa TEXT,
  items JSONB NOT NULL DEFAULT '[]', -- Array de items de la cotización
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  descuento NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  vigencia_dias INT DEFAULT 30,
  estado TEXT DEFAULT 'borrador', -- 'borrador', 'enviada', 'aceptada', 'rechazada'
  enviada_en TIMESTAMPTZ,
  aceptada_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_lead ON cotizaciones(lead_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_leads_cliente ON leads(cliente_id);
CREATE INDEX IF NOT EXISTS idx_leads_fecha ON leads(fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_leads_mes ON leads(mes_ingreso);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para cotizaciones
DROP TRIGGER IF EXISTS update_cotizaciones_updated_at ON cotizaciones;
CREATE TRIGGER update_cotizaciones_updated_at
    BEFORE UPDATE ON cotizaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
