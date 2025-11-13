-- TABLA: inversiones
-- Registra la inversión publicitaria mensual por cliente
-- Permite tracking de ROAS y métricas de performance

CREATE TABLE IF NOT EXISTS inversiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  -- Período
  ano INTEGER NOT NULL, -- Año (ej: 2025)
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12), -- Mes (1-12)

  -- Inversión
  monto DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Monto invertido en el mes
  moneda VARCHAR(3) DEFAULT 'CLP', -- Moneda (CLP, USD, etc.)

  -- Metadata
  notas TEXT, -- Notas adicionales
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: solo una inversión por cliente-mes-año
  UNIQUE(cliente_id, ano, mes)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_inversiones_cliente ON inversiones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_inversiones_periodo ON inversiones(ano, mes);
CREATE INDEX IF NOT EXISTS idx_inversiones_cliente_periodo ON inversiones(cliente_id, ano, mes);

-- Trigger para actualizar actualizado_en
CREATE OR REPLACE FUNCTION update_actualizado_en_inversiones()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inversiones
  BEFORE UPDATE ON inversiones
  FOR EACH ROW
  EXECUTE FUNCTION update_actualizado_en_inversiones();

-- RLS Policies (Row Level Security)
ALTER TABLE inversiones ENABLE ROW LEVEL SECURITY;

-- Policy: Admins pueden hacer todo
CREATE POLICY "Admins pueden hacer todo en inversiones"
  ON inversiones
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.rol = 'admin'
      AND usuarios.activo = true
    )
  );

-- Policy: Clientes pueden ver sus propias inversiones
CREATE POLICY "Clientes pueden ver sus inversiones"
  ON inversiones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.cliente_id = inversiones.cliente_id
      AND usuarios.activo = true
    )
  );

-- Comentarios
COMMENT ON TABLE inversiones IS 'Registro de inversión publicitaria mensual por cliente';
COMMENT ON COLUMN inversiones.cliente_id IS 'Referencia al cliente';
COMMENT ON COLUMN inversiones.ano IS 'Año del período de inversión';
COMMENT ON COLUMN inversiones.mes IS 'Mes del período de inversión (1-12)';
COMMENT ON COLUMN inversiones.monto IS 'Monto invertido en el período';
COMMENT ON COLUMN inversiones.moneda IS 'Moneda de la inversión (CLP por defecto)';
