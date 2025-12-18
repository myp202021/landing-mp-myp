# Configuración WhatsApp Business API

## 📋 Requisitos Previos

1. **Facebook Business Manager** activo
2. **Número de WhatsApp Business** verificado
3. **Dominio verificado** en Meta (mulleryperez.cl)

## 🚀 Paso 1: Crear App en Meta for Developers

1. Ve a https://developers.facebook.com/apps/
2. Click en "Crear app"
3. Selecciona "Business" como tipo
4. Completa el formulario:
   - Nombre: "M&P WhatsApp CRM"
   - Email de contacto: contacto@mulleryperez.com
   - Business Manager: Selecciona tu cuenta

## 📱 Paso 2: Configurar WhatsApp Product

1. En tu app, ve a "Agregar productos"
2. Busca "WhatsApp" y click en "Configurar"
3. Ve a "Configuración de WhatsApp" en el menú lateral
4. Selecciona tu Business Manager
5. Agrega tu número de teléfono o usa el de prueba

### Obtener credenciales:

```
📋 Anota estos valores:

1. Phone Number ID:
   WhatsApp > API Setup > Phone number ID
   Ejemplo: 102981234567890

2. WhatsApp Business Account ID:
   WhatsApp > API Setup > WhatsApp Business Account ID
   Ejemplo: 123456789012345

3. Access Token (temporal):
   WhatsApp > API Setup > Temporary access token
   Ejemplo: EAABsbCS1iHgBO...
```

## 🔐 Paso 3: Crear Access Token Permanente

**Importante:** El token temporal expira en 24 horas.

1. Ve a "Configuración" > "Básica"
2. Anota tu "App ID" y "App Secret"
3. Crea un token de sistema:

```bash
# Generar token permanente
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=TU_APP_ID&client_secret=TU_APP_SECRET&fb_exchange_token=TU_TOKEN_TEMPORAL"
```

O usa: https://developers.facebook.com/tools/accesstoken/

## 🌐 Paso 4: Configurar Webhook

1. En tu app Meta, ve a "WhatsApp > Configuración"
2. En "Webhook", click en "Configurar"
3. Ingresa:

```
Callback URL: https://www.mulleryperez.cl/api/whatsapp/webhook
Verify Token: myp_webhook_token_2024
```

4. Suscríbete a estos campos:
   - ✅ messages
   - ✅ message_status (opcional)

## 🔧 Paso 5: Variables de Entorno (Vercel)

Agrega estas variables en Vercel:

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAABsbCS1iHgBO...
WHATSAPP_VERIFY_TOKEN=myp_webhook_token_2024
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
```

## 📊 Paso 6: Crear Tablas en Supabase

Ejecuta este SQL en Supabase SQL Editor:

```sql
-- Tabla de chatbots por cliente
CREATE TABLE client_chatbots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  whatsapp_phone VARCHAR(20) NOT NULL,
  welcome_message TEXT,
  flows JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de conversaciones
CREATE TABLE chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID REFERENCES client_chatbots(id) ON DELETE CASCADE,
  user_phone VARCHAR(20) NOT NULL,
  user_name VARCHAR(255),
  messages JSONB DEFAULT '[]'::jsonb,
  captured_data JSONB DEFAULT '{}'::jsonb,
  current_step INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, abandoned
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX idx_chatbots_client ON client_chatbots(client_id);
CREATE INDEX idx_chatbots_phone ON client_chatbots(whatsapp_phone);
CREATE INDEX idx_conversations_chatbot ON chatbot_conversations(chatbot_id);
CREATE INDEX idx_conversations_user ON chatbot_conversations(user_phone);
CREATE INDEX idx_conversations_status ON chatbot_conversations(status);

-- Row Level Security (RLS)
ALTER TABLE client_chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas: Clientes solo ven sus chatbots
CREATE POLICY "Clients can view their chatbots"
  ON client_chatbots FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ));

CREATE POLICY "Clients can manage their chatbots"
  ON client_chatbots FOR ALL
  USING (client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ));

-- Políticas: Clientes solo ven conversaciones de sus chatbots
CREATE POLICY "Clients can view their conversations"
  ON chatbot_conversations FOR SELECT
  USING (chatbot_id IN (
    SELECT id FROM client_chatbots WHERE client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  ));
```

## 🧪 Paso 7: Probar la Integración

### Probar webhook localmente (opcional):

```bash
# Instalar ngrok
brew install ngrok

# Exponer puerto local
ngrok http 3000

# Usar URL de ngrok en Meta:
# https://abc123.ngrok.io/api/whatsapp/webhook
```

### Probar en producción:

1. Envía un mensaje de WhatsApp al número configurado
2. Revisa logs en Vercel: https://vercel.com/christophers-projects/landing-mp-myp-nuevo/logs
3. Verifica que el webhook recibe el mensaje

## 📖 Estructura de Flujos (JSON)

Ejemplo de configuración de flujo en `client_chatbots.flows`:

```json
[
  {
    "step": 0,
    "field_name": "nombre",
    "question": "¡Hola! ¿Cuál es tu nombre?",
    "data_type": "text",
    "required": true
  },
  {
    "step": 1,
    "field_name": "email",
    "question": "Perfecto [nombre], ¿cuál es tu email?",
    "data_type": "email",
    "required": true,
    "validation": "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  },
  {
    "step": 2,
    "field_name": "telefono",
    "question": "¿Y tu teléfono?",
    "data_type": "phone",
    "required": true
  },
  {
    "step": 3,
    "field_name": "presupuesto",
    "question": "¿Cuál es tu presupuesto mensual aproximado para marketing digital?",
    "data_type": "text",
    "required": false
  }
]
```

## 💰 Costos

- **Primeros 1,000 mensajes/mes**: GRATIS
- **Conversaciones adicionales**:
  - Conversación iniciada por el negocio: ~$0.04 USD
  - Conversación iniciada por el usuario: GRATIS (primeras 24 horas)

## 🔗 Links Útiles

- WhatsApp Business API Docs: https://developers.facebook.com/docs/whatsapp
- Meta for Developers: https://developers.facebook.com/
- Precios: https://developers.facebook.com/docs/whatsapp/pricing
- Plantillas de mensajes: https://business.facebook.com/wa/manage/message-templates/

## ⚠️ Importante

1. **Número de prueba**: Meta te da un número de prueba que solo puede enviar mensajes a 5 números registrados
2. **Verificación**: Para usar tu propio número, debes verificarlo en WhatsApp Business Manager
3. **Templates**: Para enviar mensajes fuera de la ventana de 24h, necesitas templates aprobados por Meta
4. **Límites**: Nuevas cuentas tienen límites de 250 conversaciones/día (aumenta con buen uso)

## 🎯 Próximos Pasos

1. ✅ Configurar Meta App y obtener credenciales
2. ✅ Agregar variables de entorno en Vercel
3. ✅ Crear tablas en Supabase
4. ✅ Configurar webhook en Meta
5. ⏳ Crear interface CRM para configurar chatbots
6. ⏳ Implementar conversión de audio a texto (Whisper API)
7. ⏳ Agregar validaciones y normalización de datos
