-- ============================================
-- M&P ChatBot - Schema de Base de Datos
-- Supabase PostgreSQL
-- ============================================

-- Tabla principal de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  -- Clasificación
  categoria VARCHAR(50), -- planes, precios, metodologia, contrato, marketing, contacto
  subcategoria VARCHAR(100),

  -- Estado
  resuelto BOOLEAN DEFAULT FALSE,
  escalo_humano BOOLEAN DEFAULT FALSE,
  intent_score VARCHAR(20) DEFAULT 'bajo', -- bajo, medio, alto

  -- Datos del lead (opcional)
  nombre VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(50),
  empresa VARCHAR(255),

  -- Metadata
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT,
  landing_page TEXT,

  -- Métricas
  total_messages INTEGER DEFAULT 0,
  total_turns INTEGER DEFAULT 0, -- interacciones usuario-bot

  -- Índices para búsqueda
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes individuales
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,

  -- Contenido
  role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,

  -- Navegación en el árbol
  node_id VARCHAR(100), -- ID del nodo en el árbol de decisión
  option_selected VARCHAR(100), -- Opción que eligió el usuario

  -- Clasificación
  categoria VARCHAR(50),
  subcategoria VARCHAR(100),

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de analytics agregados (para dashboard rápido)
CREATE TABLE IF NOT EXISTS chat_analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL UNIQUE,

  -- Conteos
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,

  -- Por categoría
  sessions_planes INTEGER DEFAULT 0,
  sessions_precios INTEGER DEFAULT 0,
  sessions_metodologia INTEGER DEFAULT 0,
  sessions_contrato INTEGER DEFAULT 0,
  sessions_marketing INTEGER DEFAULT 0,
  sessions_contacto INTEGER DEFAULT 0,

  -- Conversiones
  leads_capturados INTEGER DEFAULT 0,
  escalaron_humano INTEGER DEFAULT 0,

  -- Promedios
  avg_turns DECIMAL(5,2) DEFAULT 0,
  avg_duration_seconds INTEGER DEFAULT 0,

  -- Intent scores
  intent_bajo INTEGER DEFAULT 0,
  intent_medio INTEGER DEFAULT 0,
  intent_alto INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de preguntas frecuentes (para detectar gaps)
CREATE TABLE IF NOT EXISTS chat_unhandled_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id),

  question TEXT NOT NULL,
  context TEXT, -- Nodo donde estaba cuando preguntó

  -- Para priorizar
  count INTEGER DEFAULT 1, -- Cuántas veces se ha preguntado algo similar
  reviewed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_categoria ON chat_sessions(categoria);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_intent ON chat_sessions(intent_score);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_email ON chat_sessions(email) WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_node ON chat_messages(node_id);

CREATE INDEX IF NOT EXISTS idx_chat_analytics_fecha ON chat_analytics_daily(fecha DESC);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para chat_sessions
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular intent score basado en comportamiento
CREATE OR REPLACE FUNCTION calculate_intent_score(
  p_session_id UUID
) RETURNS VARCHAR(20) AS $$
DECLARE
  v_visited_contacto BOOLEAN;
  v_visited_precios BOOLEAN;
  v_left_data BOOLEAN;
  v_total_turns INTEGER;
  v_score VARCHAR(20);
BEGIN
  -- Verificar si visitó sección contacto
  SELECT EXISTS (
    SELECT 1 FROM chat_messages
    WHERE session_id = p_session_id
    AND categoria = 'contacto'
  ) INTO v_visited_contacto;

  -- Verificar si visitó precios
  SELECT EXISTS (
    SELECT 1 FROM chat_messages
    WHERE session_id = p_session_id
    AND categoria = 'precios'
  ) INTO v_visited_precios;

  -- Verificar si dejó datos
  SELECT (nombre IS NOT NULL OR email IS NOT NULL OR telefono IS NOT NULL)
  FROM chat_sessions
  WHERE id = p_session_id
  INTO v_left_data;

  -- Contar turnos
  SELECT total_turns FROM chat_sessions
  WHERE id = p_session_id
  INTO v_total_turns;

  -- Calcular score
  IF v_left_data THEN
    v_score := 'alto';
  ELSIF v_visited_contacto AND v_visited_precios THEN
    v_score := 'alto';
  ELSIF v_visited_contacto OR v_visited_precios THEN
    v_score := 'medio';
  ELSIF v_total_turns >= 5 THEN
    v_score := 'medio';
  ELSE
    v_score := 'bajo';
  END IF;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VISTAS PARA DASHBOARD
-- ============================================

-- Vista de sesiones con métricas calculadas
CREATE OR REPLACE VIEW chat_sessions_enriched AS
SELECT
  cs.*,
  EXTRACT(EPOCH FROM (COALESCE(cs.ended_at, NOW()) - cs.started_at)) as duration_seconds,
  (SELECT COUNT(*) FROM chat_messages cm WHERE cm.session_id = cs.id) as message_count
FROM chat_sessions cs;

-- Vista de top preguntas/nodos más visitados
CREATE OR REPLACE VIEW chat_top_nodes AS
SELECT
  node_id,
  categoria,
  subcategoria,
  COUNT(*) as visit_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM chat_messages
WHERE node_id IS NOT NULL
GROUP BY node_id, categoria, subcategoria
ORDER BY visit_count DESC
LIMIT 50;

-- Vista de métricas diarias
CREATE OR REPLACE VIEW chat_daily_metrics AS
SELECT
  DATE(started_at) as fecha,
  COUNT(*) as total_sessions,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as leads,
  COUNT(CASE WHEN escalo_humano THEN 1 END) as escalaron,
  AVG(total_turns)::DECIMAL(5,2) as avg_turns,
  COUNT(CASE WHEN intent_score = 'alto' THEN 1 END) as intent_alto,
  COUNT(CASE WHEN intent_score = 'medio' THEN 1 END) as intent_medio,
  COUNT(CASE WHEN intent_score = 'bajo' THEN 1 END) as intent_bajo
FROM chat_sessions
GROUP BY DATE(started_at)
ORDER BY fecha DESC;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_unhandled_questions ENABLE ROW LEVEL SECURITY;

-- Política para insertar desde el frontend (anon)
CREATE POLICY "Allow anonymous insert on chat_sessions"
ON chat_sessions FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on chat_messages"
ON chat_messages FOR INSERT
TO anon
WITH CHECK (true);

-- Política para actualizar sesiones (anon) - solo campos permitidos
CREATE POLICY "Allow anonymous update on chat_sessions"
ON chat_sessions FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Política para leer (solo usuarios autenticados - admin)
CREATE POLICY "Allow authenticated read on chat_sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read on chat_messages"
ON chat_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read on chat_analytics_daily"
ON chat_analytics_daily FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read on chat_unhandled_questions"
ON chat_unhandled_questions FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- DATOS INICIALES (opcional)
-- ============================================

-- Insertar registro de analytics para hoy
INSERT INTO chat_analytics_daily (fecha)
VALUES (CURRENT_DATE)
ON CONFLICT (fecha) DO NOTHING;
