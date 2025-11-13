-- ============================================
-- SCHEMA PARA COTIZACIONES MERCATOR
-- ============================================

-- Tabla principal de cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones_mercator (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_cotizacion TEXT NOT NULL UNIQUE,
  cliente TEXT NOT NULL,

  -- Información general (columna izquierda)
  container TEXT,
  puerto_embarque TEXT,
  oferta_valida TEXT,
  produccion TEXT,

  -- Información proveedor (columna derecha)
  proveedor TEXT DEFAULT 'Mercator Group',
  direccion TEXT DEFAULT 'Franklin 338, Santiago Centro, Chile',
  persona_contacto TEXT DEFAULT 'Jose Marilaf Pablaza',
  email TEXT DEFAULT 'jmarilaf@mercator-group.com',

  -- Totales
  total_usd_fob DECIMAL(12,2) DEFAULT 0,

  -- Condiciones de pago y notas
  condiciones_pago TEXT,
  notas TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);

-- Tabla de items/productos de cada cotización
CREATE TABLE IF NOT EXISTS cotizacion_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cotizacion_id UUID REFERENCES cotizaciones_mercator(id) ON DELETE CASCADE,

  -- Datos del producto
  descripcion TEXT NOT NULL,
  especificacion TEXT,
  empaque TEXT,
  cantidad INTEGER NOT NULL DEFAULT 1,
  unidad TEXT DEFAULT 'unidad',
  precio_fob_unitario DECIMAL(10,2),
  precio_fob_total DECIMAL(12,2),

  -- Foto referencial
  foto_url TEXT,

  -- Orden para mantener secuencia
  orden INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones_mercator(cliente);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_numero ON cotizaciones_mercator(numero_cotizacion);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_created ON cotizaciones_mercator(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_cotizacion ON cotizacion_items(cotizacion_id, orden);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cotizaciones_mercator_updated_at
BEFORE UPDATE ON cotizaciones_mercator
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para calcular precio_fob_total automáticamente
CREATE OR REPLACE FUNCTION calculate_item_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.precio_fob_total = NEW.cantidad * COALESCE(NEW.precio_fob_unitario, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_item_total_trigger
BEFORE INSERT OR UPDATE ON cotizacion_items
FOR EACH ROW
EXECUTE FUNCTION calculate_item_total();

-- Función para recalcular total de cotización
CREATE OR REPLACE FUNCTION update_cotizacion_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cotizaciones_mercator
    SET total_usd_fob = (
        SELECT COALESCE(SUM(precio_fob_total), 0)
        FROM cotizacion_items
        WHERE cotizacion_id = COALESCE(NEW.cotizacion_id, OLD.cotizacion_id)
    )
    WHERE id = COALESCE(NEW.cotizacion_id, OLD.cotizacion_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cotizacion_total_on_item_change
AFTER INSERT OR UPDATE OR DELETE ON cotizacion_items
FOR EACH ROW
EXECUTE FUNCTION update_cotizacion_total();

-- ============================================
-- COMENTARIOS Y NOTAS
-- ============================================

COMMENT ON TABLE cotizaciones_mercator IS 'Cotizaciones generadas para cliente Mercator Group';
COMMENT ON TABLE cotizacion_items IS 'Items/productos de cada cotización';

COMMENT ON COLUMN cotizaciones_mercator.numero_cotizacion IS 'Número único de cotización (ej: 18072025)';
COMMENT ON COLUMN cotizaciones_mercator.container IS 'Tipo de contenedor (ej: 2x40HQ)';
COMMENT ON COLUMN cotizaciones_mercator.puerto_embarque IS 'Puerto de embarque (ej: QINGDAO)';
COMMENT ON COLUMN cotizaciones_mercator.oferta_valida IS 'Días de validez de la oferta';
COMMENT ON COLUMN cotizaciones_mercator.produccion IS 'Días de producción';

COMMENT ON COLUMN cotizacion_items.descripcion IS 'Nombre del producto';
COMMENT ON COLUMN cotizacion_items.especificacion IS 'Especificaciones técnicas del producto';
COMMENT ON COLUMN cotizacion_items.empaque IS 'Tipo de empaque';
COMMENT ON COLUMN cotizacion_items.precio_fob_unitario IS 'Precio FOB por unidad en USD';
COMMENT ON COLUMN cotizacion_items.precio_fob_total IS 'Precio FOB total (calculado automáticamente)';
COMMENT ON COLUMN cotizacion_items.foto_url IS 'URL de foto referencial del producto';
COMMENT ON COLUMN cotizacion_items.orden IS 'Orden de visualización en la cotización';
