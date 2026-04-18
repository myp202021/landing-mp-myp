-- Agregar columna perfil_empresa a clipping_suscripciones
-- Ejecutar en Supabase SQL Editor

ALTER TABLE clipping_suscripciones
ADD COLUMN IF NOT EXISTS perfil_empresa JSONB DEFAULT NULL;

-- Ejemplo de perfil_empresa:
-- {
--   "nombre": "Genera HR",
--   "descripcion": "Software de control de asistencia y gestion de personas",
--   "tono": "profesional y directo",
--   "diferenciadores": ["reconocimiento facial", "integracion ERP"],
--   "rubro": "HR Tech / Control de asistencia"
-- }
