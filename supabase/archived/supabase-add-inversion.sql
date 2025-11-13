-- Agregar campo de inversión a la tabla clientes
-- Este campo almacena la inversión mensual o total en marketing

ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS inversion_mensual DECIMAL(12,2) DEFAULT 0;

-- Comentario para el campo
COMMENT ON COLUMN clientes.inversion_mensual IS 'Inversión mensual en marketing (en la moneda local)';
