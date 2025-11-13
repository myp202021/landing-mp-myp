-- Migración: Agregar campo 'notas' a tabla leads
-- Fecha: 2025-11-06
-- Descripción: Campo de texto largo para detalles y observaciones adicionales del lead

-- Agregar columna notas (si no existe)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS notas TEXT;

-- Comentario para documentación
COMMENT ON COLUMN leads.notas IS 'Campo de texto libre para notas, detalles y observaciones sobre el lead';
