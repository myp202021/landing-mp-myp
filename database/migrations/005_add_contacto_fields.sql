-- Agregar campos de contacto persona a tabla clientes
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS contacto_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS contacto_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contacto_telefono VARCHAR(50);

-- Renombrar columna 'nombre' a 'empresa' para mayor claridad (opcional, comentado por seguridad)
-- ALTER TABLE clientes RENAME COLUMN nombre TO empresa;

COMMENT ON COLUMN clientes.contacto_nombre IS 'Nombre de la persona de contacto del cliente';
COMMENT ON COLUMN clientes.contacto_email IS 'Email de la persona de contacto';
COMMENT ON COLUMN clientes.contacto_telefono IS 'Teléfono de la persona de contacto';
