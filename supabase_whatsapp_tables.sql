-- ============================================
-- Tablas para WhatsApp Chatbot Integration
-- ============================================

-- Tabla de chatbots por cliente
CREATE TABLE IF NOT EXISTS client_chatbots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  whatsapp_phone VARCHAR(20) NOT NULL,
  welcome_message TEXT DEFAULT '¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?',
  flows JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID REFERENCES client_chatbots(id) ON DELETE CASCADE,
  user_phone VARCHAR(20) NOT NULL,
  user_name VARCHAR(255),
  messages JSONB DEFAULT '[]'::jsonb,
  captured_data JSONB DEFAULT '{}'::jsonb,
  current_step INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, abandoned
  metadata JSONB DEFAULT '{}'::jsonb, -- Datos adicionales (ubicación, etc.)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de respuestas individuales (para análisis)
CREATE TABLE IF NOT EXISTS chatbot_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  chatbot_id UUID REFERENCES client_chatbots(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  data_type VARCHAR(50), -- text, email, phone, number, url, date
  normalized_value TEXT, -- Valor normalizado/validado
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_chatbots_client ON client_chatbots(client_id);
CREATE INDEX IF NOT EXISTS idx_chatbots_phone ON client_chatbots(whatsapp_phone);
CREATE INDEX IF NOT EXISTS idx_chatbots_active ON client_chatbots(active);

CREATE INDEX IF NOT EXISTS idx_conversations_chatbot ON chatbot_conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON chatbot_conversations(user_phone);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON chatbot_conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON chatbot_conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_responses_conversation ON chatbot_responses(conversation_id);
CREATE INDEX IF NOT EXISTS idx_responses_chatbot ON chatbot_responses(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_responses_field ON chatbot_responses(field_name);

-- Row Level Security (RLS)
ALTER TABLE client_chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_responses ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes si existen
DROP POLICY IF EXISTS "Clients can view their chatbots" ON client_chatbots;
DROP POLICY IF EXISTS "Clients can manage their chatbots" ON client_chatbots;
DROP POLICY IF EXISTS "Admins can manage all chatbots" ON client_chatbots;
DROP POLICY IF EXISTS "Clients can view their conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Clients can view their responses" ON chatbot_responses;
DROP POLICY IF EXISTS "Admins can view all responses" ON chatbot_responses;

-- Políticas para client_chatbots
CREATE POLICY "Clients can view their chatbots"
  ON client_chatbots FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can manage their chatbots"
  ON client_chatbots FOR ALL
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all chatbots"
  ON client_chatbots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Políticas para chatbot_conversations
CREATE POLICY "Clients can view their conversations"
  ON chatbot_conversations FOR SELECT
  USING (
    chatbot_id IN (
      SELECT id FROM client_chatbots WHERE client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all conversations"
  ON chatbot_conversations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Políticas para chatbot_responses
CREATE POLICY "Clients can view their responses"
  ON chatbot_responses FOR SELECT
  USING (
    chatbot_id IN (
      SELECT id FROM client_chatbots WHERE client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all responses"
  ON chatbot_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_chatbots_updated_at ON client_chatbots;
CREATE TRIGGER update_chatbots_updated_at
  BEFORE UPDATE ON client_chatbots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON chatbot_conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON chatbot_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios en tablas
COMMENT ON TABLE client_chatbots IS 'Configuración de chatbots de WhatsApp por cliente';
COMMENT ON TABLE chatbot_conversations IS 'Conversaciones de WhatsApp con usuarios';
COMMENT ON TABLE chatbot_responses IS 'Respuestas individuales para análisis y reportes';

COMMENT ON COLUMN client_chatbots.flows IS 'Array de objetos JSON con preguntas y configuración del flujo';
COMMENT ON COLUMN chatbot_conversations.captured_data IS 'Objeto JSON con todos los datos capturados del usuario';
COMMENT ON COLUMN chatbot_conversations.status IS 'Estado: active, completed, abandoned';

-- Vista para análisis de conversaciones
CREATE OR REPLACE VIEW chatbot_analytics AS
SELECT
  cb.id as chatbot_id,
  cb.name as chatbot_name,
  cb.client_id,
  c.name as client_name,
  COUNT(DISTINCT cc.id) as total_conversations,
  COUNT(DISTINCT CASE WHEN cc.status = 'completed' THEN cc.id END) as completed_conversations,
  COUNT(DISTINCT CASE WHEN cc.status = 'active' THEN cc.id END) as active_conversations,
  COUNT(DISTINCT CASE WHEN cc.status = 'abandoned' THEN cc.id END) as abandoned_conversations,
  ROUND(
    COUNT(DISTINCT CASE WHEN cc.status = 'completed' THEN cc.id END)::numeric /
    NULLIF(COUNT(DISTINCT cc.id), 0) * 100,
    2
  ) as completion_rate,
  COUNT(DISTINCT cc.user_phone) as unique_users,
  MIN(cc.created_at) as first_conversation,
  MAX(cc.created_at) as last_conversation
FROM client_chatbots cb
LEFT JOIN chatbot_conversations cc ON cb.id = cc.chatbot_id
LEFT JOIN clients c ON cb.client_id = c.id
GROUP BY cb.id, cb.name, cb.client_id, c.name;

-- Grant permisos en la vista
GRANT SELECT ON chatbot_analytics TO authenticated;

-- Datos de ejemplo (comentados, descomentar para testing)
/*
INSERT INTO client_chatbots (client_id, name, whatsapp_phone, welcome_message, flows)
VALUES (
  (SELECT id FROM clients LIMIT 1), -- Reemplazar con ID real
  'Chatbot de Ventas',
  '+56912345678',
  '¡Hola! 👋 Gracias por contactarnos. Te haré algunas preguntas para ayudarte mejor.',
  '[
    {
      "step": 0,
      "field_name": "nombre",
      "question": "¿Cuál es tu nombre?",
      "data_type": "text",
      "required": true
    },
    {
      "step": 1,
      "field_name": "email",
      "question": "Perfecto, ¿cuál es tu email?",
      "data_type": "email",
      "required": true
    },
    {
      "step": 2,
      "field_name": "empresa",
      "question": "¿De qué empresa eres?",
      "data_type": "text",
      "required": false
    }
  ]'::jsonb
);
*/
