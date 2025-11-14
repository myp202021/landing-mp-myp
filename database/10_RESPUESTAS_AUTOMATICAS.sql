-- ============================================
-- SPRINT 3: Sistema de Respuestas Automáticas
-- Fecha: 13 Nov 2025
-- Descripción: Tablas, triggers y funciones para
-- respuestas automáticas por email
-- ============================================

-- Tabla de respuestas automáticas
CREATE TABLE IF NOT EXISTS respuestas_automaticas (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  activa BOOLEAN DEFAULT false,
  trigger_tipo TEXT NOT NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_respuestas_cliente ON respuestas_automaticas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_activas ON respuestas_automaticas(activa) WHERE activa = true;
CREATE INDEX IF NOT EXISTS idx_respuestas_trigger ON respuestas_automaticas(trigger_tipo);

-- Tabla de historial de envíos
CREATE TABLE IF NOT EXISTS emails_enviados (
  id SERIAL PRIMARY KEY,
  respuesta_automatica_id INTEGER REFERENCES respuestas_automaticas(id) ON DELETE SET NULL,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  destinatario_email TEXT NOT NULL,
  destinatario_nombre TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'enviado', 'error'
  error_mensaje TEXT,
  proveedor TEXT DEFAULT 'resend', -- 'resend', 'sendgrid'
  proveedor_message_id TEXT,
  enviado_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para emails
CREATE INDEX IF NOT EXISTS idx_emails_lead ON emails_enviados(lead_id);
CREATE INDEX IF NOT EXISTS idx_emails_cliente ON emails_enviados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_emails_estado ON emails_enviados(estado);
CREATE INDEX IF NOT EXISTS idx_emails_fecha ON emails_enviados(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_emails_respuesta_auto ON emails_enviados(respuesta_automatica_id);

-- Trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION actualizar_respuesta_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_respuestas_updated ON respuestas_automaticas;
CREATE TRIGGER trg_respuestas_updated
  BEFORE UPDATE ON respuestas_automaticas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_respuesta_timestamp();

-- Función para enviar respuesta automática al crear lead
CREATE OR REPLACE FUNCTION trigger_respuesta_automatica_nuevo_lead()
RETURNS TRIGGER AS $$
DECLARE
  respuesta RECORD;
  mensaje_personalizado TEXT;
BEGIN
  -- Buscar respuestas activas para este cliente con trigger 'nuevo_lead'
  FOR respuesta IN
    SELECT * FROM respuestas_automaticas
    WHERE cliente_id = NEW.cliente_id
      AND activa = true
      AND trigger_tipo = 'nuevo_lead'
  LOOP
    -- Personalizar mensaje (reemplazar variables)
    mensaje_personalizado := respuesta.mensaje;
    mensaje_personalizado := REPLACE(mensaje_personalizado, '{nombre}', COALESCE(NEW.nombre, ''));
    mensaje_personalizado := REPLACE(mensaje_personalizado, '{apellido}', COALESCE(NEW.apellido, ''));
    mensaje_personalizado := REPLACE(mensaje_personalizado, '{email}', COALESCE(NEW.email, ''));
    mensaje_personalizado := REPLACE(mensaje_personalizado, '{telefono}', COALESCE(NEW.telefono, ''));
    mensaje_personalizado := REPLACE(mensaje_personalizado, '{empresa}', COALESCE(NEW.empresa, ''));

    -- Insertar en cola de envío
    INSERT INTO emails_enviados (
      respuesta_automatica_id,
      lead_id,
      cliente_id,
      destinatario_email,
      destinatario_nombre,
      asunto,
      mensaje,
      estado
    ) VALUES (
      respuesta.id,
      NEW.id,
      NEW.cliente_id,
      NEW.email,
      CONCAT(NEW.nombre, ' ', NEW.apellido),
      respuesta.asunto,
      mensaje_personalizado,
      'pendiente'
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Activar trigger en INSERT de leads
DROP TRIGGER IF EXISTS trg_nuevo_lead_respuesta_auto ON leads;
CREATE TRIGGER trg_nuevo_lead_respuesta_auto
  AFTER INSERT ON leads
  FOR EACH ROW
  WHEN (NEW.email IS NOT NULL AND NEW.email != '')
  EXECUTE FUNCTION trigger_respuesta_automatica_nuevo_lead();

-- Comentarios
COMMENT ON TABLE respuestas_automaticas IS 'Plantillas de respuestas automáticas por email para clientes';
COMMENT ON TABLE emails_enviados IS 'Historial de emails enviados a leads';
COMMENT ON COLUMN respuestas_automaticas.trigger_tipo IS 'Valores: nuevo_lead, sin_contactar_24h, sin_contactar_48h';
COMMENT ON COLUMN emails_enviados.estado IS 'Estados: pendiente, enviado, error';

-- ============================================
-- PERMISOS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE respuestas_automaticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_enviados ENABLE ROW LEVEL SECURITY;

-- Políticas para respuestas_automaticas
DROP POLICY IF EXISTS "Clientes ven solo sus respuestas" ON respuestas_automaticas;
CREATE POLICY "Clientes ven solo sus respuestas"
  ON respuestas_automaticas
  FOR SELECT
  USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE id = cliente_id
    )
  );

DROP POLICY IF EXISTS "Clientes pueden crear respuestas" ON respuestas_automaticas;
CREATE POLICY "Clientes pueden crear respuestas"
  ON respuestas_automaticas
  FOR INSERT
  WITH CHECK (
    cliente_id IN (
      SELECT id FROM clientes WHERE id = cliente_id
    )
  );

DROP POLICY IF EXISTS "Clientes pueden actualizar sus respuestas" ON respuestas_automaticas;
CREATE POLICY "Clientes pueden actualizar sus respuestas"
  ON respuestas_automaticas
  FOR UPDATE
  USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE id = cliente_id
    )
  );

DROP POLICY IF EXISTS "Clientes pueden eliminar sus respuestas" ON respuestas_automaticas;
CREATE POLICY "Clientes pueden eliminar sus respuestas"
  ON respuestas_automaticas
  FOR DELETE
  USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE id = cliente_id
    )
  );

-- Políticas para emails_enviados
DROP POLICY IF EXISTS "Clientes ven solo sus emails" ON emails_enviados;
CREATE POLICY "Clientes ven solo sus emails"
  ON emails_enviados
  FOR SELECT
  USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE id = cliente_id
    )
  );

-- Permitir inserción desde trigger (service role)
DROP POLICY IF EXISTS "Service role puede insertar emails" ON emails_enviados;
CREATE POLICY "Service role puede insertar emails"
  ON emails_enviados
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar respuesta automática de ejemplo
-- INSERT INTO respuestas_automaticas (cliente_id, nombre, asunto, mensaje, trigger_tipo, activa)
-- VALUES (
--   (SELECT id FROM clientes LIMIT 1),
--   'Bienvenida a Nuevos Leads',
--   'Gracias por contactarnos',
--   'Hola {nombre} {apellido},\n\nGracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo muy pronto.\n\nSaludos cordiales,\nEquipo M&P',
--   'nuevo_lead',
--   true
-- );

-- ============================================
-- INSTRUCCIONES DE EJECUCIÓN
-- ============================================

-- 1. Ejecutar este archivo en Supabase SQL Editor
-- 2. Verificar tablas creadas:
--    SELECT * FROM respuestas_automaticas;
--    SELECT * FROM emails_enviados;
-- 3. Verificar triggers:
--    SELECT * FROM pg_trigger WHERE tgname LIKE '%respuesta%';
-- 4. Agregar RESEND_API_KEY en .env.local
-- 5. Probar creando un nuevo lead con email

COMMIT;
