-- =====================================================
-- SCHEMA COMPLETO CRM MÜLLER & PÉREZ
-- Ejecutar este script en Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FUNCIÓN: Update updated_at timestamp (si no existe)
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLA: usuarios
-- Sistema de autenticación para CRM
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'cliente')),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_cliente_id ON usuarios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario admin por defecto
INSERT INTO usuarios (username, password_hash, nombre, rol, cliente_id, activo)
VALUES ('admin', '2025Chile!', 'Administrador M&P', 'admin', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- TABLA: cotizaciones
-- =====================================================
CREATE TABLE IF NOT EXISTS cotizaciones (
  id SERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  lead_id INT8 REFERENCES leads(id) ON DELETE SET NULL,
  nombre_proyecto TEXT NOT NULL,
  cliente_nombre TEXT,
  cliente_email TEXT,
  cliente_empresa TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  descuento NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  vigencia_dias INT DEFAULT 30,
  estado TEXT DEFAULT 'borrador',
  enviada_en TIMESTAMPTZ,
  aceptada_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_lead ON cotizaciones(lead_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);

DROP TRIGGER IF EXISTS update_cotizaciones_updated_at ON cotizaciones;
CREATE TRIGGER update_cotizaciones_updated_at
  BEFORE UPDATE ON cotizaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: plantillas_cotizacion
-- =====================================================
CREATE TABLE IF NOT EXISTS plantillas_cotizacion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  items_default JSONB DEFAULT '[]'::jsonb,
  notas_default TEXT,
  vigencia_dias_default INTEGER DEFAULT 15,
  descuento_default NUMERIC(12,2) DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plantillas_activa ON plantillas_cotizacion(activa);
CREATE INDEX IF NOT EXISTS idx_plantillas_nombre ON plantillas_cotizacion(nombre);

-- =====================================================
-- VERIFICAR TABLAS CREADAS
-- =====================================================
SELECT 'usuarios' as tabla, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'cotizaciones', COUNT(*) FROM cotizaciones
UNION ALL
SELECT 'plantillas_cotizacion', COUNT(*) FROM plantillas_cotizacion;

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON TABLE usuarios IS 'Usuarios del CRM con sistema de roles (admin/cliente)';
COMMENT ON TABLE cotizaciones IS 'Cotizaciones generadas para clientes';
COMMENT ON TABLE plantillas_cotizacion IS 'Plantillas predefinidas para generar cotizaciones';
