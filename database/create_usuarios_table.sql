-- =====================================================
-- TABLA: usuarios
-- Sistema de autenticación para CRM Müller & Pérez
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,

  -- Credenciales
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,

  -- Información del usuario
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'cliente')),

  -- Relación con cliente (solo para rol='cliente')
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,

  -- Estado
  activo BOOLEAN DEFAULT true,

  -- Timestamps
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_cliente_id ON usuarios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERTAR USUARIO ADMIN POR DEFECTO
-- =====================================================
-- Contraseña: 2025Chile!
-- IMPORTANTE: En producción usar bcrypt para hashear
INSERT INTO usuarios (username, password_hash, nombre, rol, cliente_id, activo)
VALUES ('admin', '2025Chile!', 'Administrador M&P', 'admin', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del CRM con sistema de roles';
COMMENT ON COLUMN usuarios.username IS 'Nombre de usuario único para login';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash de la contraseña (usar bcrypt en producción)';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: admin (acceso completo) o cliente (acceso limitado)';
COMMENT ON COLUMN usuarios.cliente_id IS 'ID del cliente asociado (solo para usuarios con rol=cliente)';
COMMENT ON COLUMN usuarios.activo IS 'Define si el usuario puede acceder al sistema';

-- =====================================================
-- VERIFICAR CREACIÓN
-- =====================================================
SELECT id, username, nombre, rol, activo, creado_en
FROM usuarios
ORDER BY creado_en DESC;
