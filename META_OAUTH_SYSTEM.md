# Sistema de Integración OAuth con Meta Lead Ads

## 🎯 Resumen

Sistema profesional y escalable para conectar múltiples clientes con sus cuentas de Meta/Facebook, permitiendo:
- ✅ **Conexión OAuth segura** - Tokens que no expiran
- ✅ **Múltiples clientes** - Cada cliente conecta su propia cuenta
- ✅ **Múltiples páginas** - Un cliente puede tener varias páginas
- ✅ **Múltiples formularios** - Control granular por formulario
- ✅ **Sincronización automática** - Los leads llegan en tiempo real vía webhook

## 📊 Estructura de Base de Datos

### Tabla: `meta_connections`
Almacena la conexión OAuth de cada cliente con Meta.

```sql
- id: UUID (PK)
- cliente_id: UUID (FK → clientes) [UNIQUE]
- access_token: TEXT (token de acceso)
- token_expires_at: TIMESTAMP
- meta_user_id: TEXT
- meta_user_name: TEXT
- status: TEXT (active, expired, revoked, error)
```

### Tabla: `meta_pages`
Páginas de Facebook conectadas por cada conexión.

```sql
- id: UUID (PK)
- connection_id: UUID (FK → meta_connections)
- page_id: TEXT [UNIQUE]
- page_name: TEXT
- page_access_token: TEXT (token específico de la página)
- sync_enabled: BOOLEAN (activar/desactivar sincronización)
```

### Tabla: `meta_lead_forms`
Formularios de Lead Ads por página.

```sql
- id: UUID (PK)
- page_id: UUID (FK → meta_pages)
- form_id: TEXT [UNIQUE]
- form_name: TEXT
- form_status: TEXT (ACTIVE, PAUSED, DELETED)
- sync_enabled: BOOLEAN
- auto_sync: BOOLEAN
```

## 🔄 Flujo de Conexión

### 1. Iniciar OAuth
```
GET /api/meta/oauth?cliente_id={UUID}
```

Redirige al usuario a Facebook para autorizar la aplicación.

### 2. Callback de OAuth
```
GET /api/meta/oauth/callback?code=xxx&state=xxx
```

- Intercambia el código por access token
- Obtiene información del usuario de Meta
- Obtiene todas las páginas del usuario
- Para cada página, obtiene sus formularios de Lead Ads
- Guarda todo en la base de datos

### 3. Webhook Automático
```
POST /api/webhooks/facebook-leads
```

Cuando llega un lead:
1. Busca el `page_id` en `meta_pages`
2. Obtiene el `page_access_token` y `cliente_id`
3. Usa el token para obtener los detalles del lead desde Facebook
4. Guarda el lead en la tabla `leads`

## 🚀 Configuración

### Variables de Entorno Requeridas

```bash
# App de Facebook
FACEBOOK_APP_ID=1389537399297748
FACEBOOK_APP_SECRET={tu_app_secret}

# Webhook
FACEBOOK_WEBHOOK_VERIFY_TOKEN=myp_webhook_2025

# URL de la aplicación
NEXT_PUBLIC_APP_URL=https://www.mulleryperez.cl

# Supabase
NEXT_PUBLIC_SUPABASE_URL={tu_url}
SUPABASE_SERVICE_ROLE_KEY={tu_key}
```

### Pasos de Configuración

1. **Crear las tablas en Supabase**
   Ejecutar el script `/tmp/create_meta_oauth_tables.sql`

2. **Agregar variables de entorno en Vercel**
   ```bash
   vercel env add FACEBOOK_APP_ID production
   # Ingresa: 1389537399297748
   ```

3. **Configurar Callback URL en Facebook**
   - Ve a https://developers.facebook.com/apps/{APP_ID}/settings/basic
   - Agrega en "Valid OAuth Redirect URIs":
     `https://www.mulleryperez.cl/api/meta/oauth/callback`

4. **Webhook ya está configurado** ✅
   El webhook actual ya apunta a `/api/webhooks/facebook-leads`

## 👤 Uso desde el CRM

### Para Conectar un Cliente

1. El administrador va a `/crm/integraciones` ✅
2. Selecciona un cliente del dropdown
3. Hace clic en "Conectar con Meta"
4. Se redirige a Facebook para autorizar
5. Regresa al CRM con la conexión establecida
6. Ve todas las páginas y formularios sincronizados

### URL de Acceso
```
https://www.mulleryperez.cl/crm/integraciones
```

### Estado de Conexiones

La interfaz muestra:
- ✅ Estado de conexión (Conectado / Desconectado)
- 👤 Usuario de Meta conectado
- 📄 Lista de páginas de Facebook
- 📝 Formularios de Lead Ads por página
- 🔄 Estado de sincronización (Activo/Inactivo)
- 🔁 Opción para reconectar/actualizar
- 🗑️ Opción para desconectar

## 🔐 Seguridad

- ✅ Tokens encriptados en base de datos
- ✅ Webhook con validación de firma HMAC
- ✅ OAuth 2.0 estándar de Facebook
- ✅ Tokens por página (no expiran si la conexión está activa)
- ✅ Permisos granulares

## ✅ Sistema Completamente Implementado

El sistema OAuth de Meta Lead Ads está 100% funcional y en producción:

### Funcionalidades Activas

1. **Interfaz de Integraciones** (`/crm/integraciones`) ✅
   - Selector de cliente
   - Botón "Conectar con Meta"
   - Lista de conexiones activas
   - Estado de sincronización en tiempo real
   - Visualización de páginas y formularios
   - Opción para reconectar/actualizar
   - Opción para desconectar

2. **APIs Funcionales** ✅
   - `GET /api/meta/oauth` - Iniciar flujo OAuth
   - `GET /api/meta/oauth/callback` - Procesar callback
   - `GET /api/meta/connections` - Obtener estado de conexiones
   - `DELETE /api/meta/connections` - Desconectar cliente
   - `POST /api/webhooks/facebook-leads` - Recibir leads en tiempo real

3. **Base de Datos** ✅
   - Tablas: `meta_connections`, `meta_pages`, `meta_lead_forms`
   - Relaciones y constraints configurados
   - Triggers automáticos para timestamps

### Próximas Mejoras (Opcionales)

1. **Token Refresh Automático**
   - Cron job que verifica tokens próximos a expirar
   - Refresca automáticamente antes de que expiren

2. **Dashboard de Sincronización**
   - Ver leads sincronizados por fuente
   - Estadísticas de conversión
   - Errores de sincronización

3. **Notificaciones**
   - Alertas cuando expira una conexión
   - Notificaciones de nuevos leads

## 🎉 Beneficios del Nuevo Sistema

### Antes (Sistema Manual):
❌ Token expira cada 24-48 horas
❌ Hay que regenerarlo manualmente
❌ Solo funciona para un cliente
❌ Variables de entorno hardcodeadas

### Ahora (Sistema OAuth):
✅ Tokens que no expiran (mientras la conexión esté activa)
✅ Cada cliente gestiona su propia conexión
✅ Soporte para múltiples clientes
✅ Escalable y profesional
✅ Fácil de agregar nuevos clientes
✅ Control granular por página y formulario
