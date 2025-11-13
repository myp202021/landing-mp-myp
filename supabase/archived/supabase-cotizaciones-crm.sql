-- ============================================
-- COTIZACIONES GENÉRICAS PARA CRM
-- ============================================

-- Tabla de cotizaciones vinculadas a leads
CREATE TABLE IF NOT EXISTS cotizaciones_crm (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,

  -- Información básica
  numero_cotizacion TEXT NOT NULL UNIQUE,
  descripcion_servicio TEXT NOT NULL,
  monto_subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  monto_iva DECIMAL(12,2) NOT NULL DEFAULT 0,
  monto_total DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Estado
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviada', 'aceptada', 'rechazada')),
  vendido BOOLEAN DEFAULT FALSE,
  fecha_venta TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_cotizaciones_crm_lead ON cotizaciones_crm(lead_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_crm_cliente ON cotizaciones_crm(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_crm_estado ON cotizaciones_crm(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_crm_vendido ON cotizaciones_crm(vendido);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_crm_created ON cotizaciones_crm(created_at DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_cotizaciones_crm_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cotizaciones_crm_updated_at_trigger
BEFORE UPDATE ON cotizaciones_crm
FOR EACH ROW
EXECUTE FUNCTION update_cotizaciones_crm_updated_at();

-- Trigger para marcar lead como vendido cuando se acepta cotización
CREATE OR REPLACE FUNCTION mark_lead_as_sold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vendido = TRUE AND (OLD.vendido IS NULL OR OLD.vendido = FALSE) THEN
        -- Actualizar el lead como vendido
        UPDATE leads
        SET vendido = TRUE
        WHERE id = NEW.lead_id;

        -- Guardar fecha de venta si no existe
        IF NEW.fecha_venta IS NULL THEN
            NEW.fecha_venta = NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER mark_lead_as_sold_trigger
BEFORE UPDATE ON cotizaciones_crm
FOR EACH ROW
EXECUTE FUNCTION mark_lead_as_sold();

-- Función para generar número de cotización automático
CREATE OR REPLACE FUNCTION generar_numero_cotizacion()
RETURNS TEXT AS $$
DECLARE
    nuevo_numero TEXT;
    contador INT;
BEGIN
    -- Obtener el último número del día actual
    SELECT COUNT(*) INTO contador
    FROM cotizaciones_crm
    WHERE DATE(created_at) = CURRENT_DATE;

    -- Generar nuevo número: COT-YYYYMMDD-XXX
    nuevo_numero := 'COT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((contador + 1)::TEXT, 3, '0');

    RETURN nuevo_numero;
END;
$$ language 'plpgsql';

-- Comentarios
COMMENT ON TABLE cotizaciones_crm IS 'Cotizaciones genéricas del CRM vinculadas a leads';
COMMENT ON COLUMN cotizaciones_crm.lead_id IS 'Lead al que pertenece esta cotización';
COMMENT ON COLUMN cotizaciones_crm.numero_cotizacion IS 'Número único de cotización (ej: COT-20251030-001)';
COMMENT ON COLUMN cotizaciones_crm.descripcion_servicio IS 'Descripción detallada del servicio cotizado';
COMMENT ON COLUMN cotizaciones_crm.estado IS 'Estado: pendiente, enviada, aceptada, rechazada';
COMMENT ON COLUMN cotizaciones_crm.vendido IS 'TRUE si la cotización resultó en venta';
COMMENT ON COLUMN cotizaciones_crm.fecha_venta IS 'Fecha en que se marcó como vendido';

-- Vista para estadísticas de cotizaciones
CREATE OR REPLACE VIEW cotizaciones_stats AS
SELECT
    cliente_id,
    COUNT(*) as total_cotizaciones,
    COUNT(*) FILTER (WHERE estado = 'enviada') as cotizaciones_enviadas,
    COUNT(*) FILTER (WHERE estado = 'aceptada') as cotizaciones_aceptadas,
    COUNT(*) FILTER (WHERE vendido = TRUE) as cotizaciones_vendidas,
    SUM(monto_total) FILTER (WHERE vendido = TRUE) as monto_vendido,
    ROUND(
        (COUNT(*) FILTER (WHERE vendido = TRUE)::DECIMAL /
        NULLIF(COUNT(*), 0) * 100), 2
    ) as tasa_conversion
FROM cotizaciones_crm
GROUP BY cliente_id;

COMMENT ON VIEW cotizaciones_stats IS 'Estadísticas de cotizaciones por cliente';
