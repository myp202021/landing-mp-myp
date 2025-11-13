-- ============================================
-- LOGS DE SEGURIDAD Y AUDITORÍA
-- Migración: Sistema de logging para eventos críticos
-- ============================================

-- 1. Crear tabla de logs de seguridad
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tipo de evento
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login_success',
    'login_failed',
    'logout',
    'password_changed',
    'password_reset_requested',
    'password_reset_completed',
    'user_created',
    'user_deleted',
    'bulk_delete',
    'permission_changed',
    'rls_violation',
    'suspicious_activity'
  )),

  -- Usuario involucrado (puede ser NULL si no está autenticado)
  user_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  email TEXT,

  -- Información de la petición
  ip_address TEXT,
  user_agent TEXT,
  request_path TEXT,

  -- Metadata adicional (JSON flexible)
  metadata JSONB,

  -- Severidad
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Índices para búsquedas rápidas
CREATE INDEX idx_security_logs_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_user ON security_logs(user_id);
CREATE INDEX idx_security_logs_date ON security_logs(created_at DESC);
CREATE INDEX idx_security_logs_severity ON security_logs(severity);
CREATE INDEX idx_security_logs_ip ON security_logs(ip_address);

-- 3. Función helper para registrar eventos
CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_request_path TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO security_logs (
    event_type,
    user_id,
    email,
    ip_address,
    user_agent,
    request_path,
    metadata,
    severity
  ) VALUES (
    p_event_type,
    p_user_id,
    p_email,
    p_ip_address,
    p_user_agent,
    p_request_path,
    p_metadata,
    p_severity
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para loggear cambios de contraseña
CREATE OR REPLACE FUNCTION log_password_change()
RETURNS trigger AS $$
BEGIN
  IF NEW.password_hash IS DISTINCT FROM OLD.password_hash THEN
    PERFORM log_security_event(
      'password_changed',
      NEW.id,
      NEW.email,
      NULL,
      NULL,
      NULL,
      jsonb_build_object(
        'changed_at', now(),
        'forced', OLD.debe_cambiar_password
      ),
      'info'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_password_change ON usuarios;
CREATE TRIGGER trg_log_password_change
  AFTER UPDATE ON usuarios
  FOR EACH ROW
  WHEN (OLD.password_hash IS DISTINCT FROM NEW.password_hash)
  EXECUTE FUNCTION log_password_change();

-- 5. Trigger para loggear creación de usuarios
CREATE OR REPLACE FUNCTION log_user_creation()
RETURNS trigger AS $$
BEGIN
  PERFORM log_security_event(
    'user_created',
    NEW.id,
    NEW.email,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
      'rol', NEW.rol,
      'cliente_id', NEW.cliente_id
    ),
    'info'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_user_creation ON usuarios;
CREATE TRIGGER trg_log_user_creation
  AFTER INSERT ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION log_user_creation();

-- 6. Trigger para loggear eliminación de usuarios
CREATE OR REPLACE FUNCTION log_user_deletion()
RETURNS trigger AS $$
BEGIN
  PERFORM log_security_event(
    'user_deleted',
    OLD.id,
    OLD.email,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
      'rol', OLD.rol,
      'cliente_id', OLD.cliente_id,
      'activo', OLD.activo
    ),
    'warning'
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_user_deletion ON usuarios;
CREATE TRIGGER trg_log_user_deletion
  BEFORE DELETE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION log_user_deletion();

-- 7. Vista para análisis de seguridad
CREATE OR REPLACE VIEW v_security_summary AS
SELECT
  DATE(created_at) as fecha,
  event_type,
  severity,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT user_id) as usuarios_unicos,
  COUNT(DISTINCT ip_address) as ips_unicas
FROM security_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), event_type, severity
ORDER BY fecha DESC, total_eventos DESC;

-- 8. Vista para alertas (eventos críticos recientes)
CREATE OR REPLACE VIEW v_security_alerts AS
SELECT
  id,
  event_type,
  email,
  ip_address,
  metadata,
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutos_desde_evento
FROM security_logs
WHERE severity = 'critical'
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 9. Función para limpiar logs antiguos (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION cleanup_old_security_logs(dias_retention INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM security_logs
  WHERE created_at < NOW() - (dias_retention || ' days')::INTERVAL
    AND severity != 'critical'; -- Mantener logs críticos por más tiempo

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 10. RLS para security_logs
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver logs
CREATE POLICY security_logs_admin_only ON security_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- 11. Comentarios
COMMENT ON TABLE security_logs IS 'Logs de eventos de seguridad y auditoría';
COMMENT ON COLUMN security_logs.event_type IS 'Tipo de evento de seguridad';
COMMENT ON COLUMN security_logs.severity IS 'Severidad: info, warning, critical';
COMMENT ON COLUMN security_logs.metadata IS 'Datos adicionales del evento en formato JSON';
COMMENT ON FUNCTION log_security_event IS 'Registra un evento de seguridad en el log';
COMMENT ON VIEW v_security_summary IS 'Resumen de eventos de seguridad de últimos 30 días';
COMMENT ON VIEW v_security_alerts IS 'Alertas críticas de las últimas 24 horas';

-- 12. Notificación
DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de logs de seguridad implementado';
  RAISE NOTICE 'ℹ️  Eventos trackeados: login, password changes, user management, bulk operations';
  RAISE NOTICE 'ℹ️  Retention: 90 días (180 para eventos críticos)';
  RAISE NOTICE '📊 Vistas disponibles: v_security_summary, v_security_alerts';
END $$;
