# Configuración de Facebook Lead Ads

## 📋 Resumen

He creado el sistema completo para capturar leads de Facebook Lead Ads en tu CRM. Aquí están las instrucciones para configurarlo.

## 🔧 Variables de Entorno Requeridas

Necesitas agregar estas variables de entorno en Vercel:

1. **FACEBOOK_WEBHOOK_VERIFY_TOKEN**
   - Un token secreto que tú creas (ej: `myp_webhook_2025`)
   - Se usa para verificar el webhook con Facebook

2. **FACEBOOK_APP_SECRET**
   - El App Secret de tu aplicación de Facebook
   - Lo encuentras en https://developers.facebook.com/apps → Tu App → Settings → Basic

3. **FACEBOOK_PAGE_ACCESS_TOKEN**
   - Token de acceso de tu página de Facebook
   - Necesita permisos: `pages_read_engagement`, `pages_manage_ads`, `leads_retrieval`

## 🚀 Pasos de Configuración

### 1. Agregar Variables de Entorno en Vercel

```bash
# Desde la terminal:
vercel env add FACEBOOK_WEBHOOK_VERIFY_TOKEN production
# Cuando pregunte, ingresa: myp_webhook_2025

vercel env add FACEBOOK_APP_SECRET production
# Ingresa el App Secret de tu app de Facebook

vercel env add FACEBOOK_PAGE_ACCESS_TOKEN production
# Ingresa el Page Access Token
```

### 2. Desplegar la Aplicación

```bash
vercel --prod
```

### 3. Configurar Webhook en Facebook

1. Ve a https://developers.facebook.com/apps
2. Selecciona tu aplicación (o crea una nueva)
3. En el menú lateral, busca "Webhooks"
4. Haz clic en "Add Subscription" → "Page"
5. Ingresa:
   - **Callback URL**: `https://www.mulleryperez.cl/api/webhooks/facebook-leads`
   - **Verify Token**: `myp_webhook_2025` (o el que elegiste)
6. Suscríbete al campo: `leadgen`
7. Haz clic en "Verify and Save"

### 4. Conectar la Página de Facebook

1. En tu app de Facebook, ve a "Webhooks"
2. En la sección "Page", haz clic en "Subscribe to this object"
3. Selecciona tu página de Facebook
4. Asegúrate de que el campo `leadgen` esté marcado

### 5. Sincronizar Leads Históricos (Opcional)

Si ya tienes leads en Facebook y quieres traerlos al CRM:

```bash
curl -X POST https://www.mulleryperez.cl/api/facebook/sync-leads \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "TU_CLIENTE_ID",
    "fb_page_id": "TU_PAGE_ID"
  }'
```

## 🔑 Cómo Obtener el Page Access Token

### Opción 1: Graph API Explorer

1. Ve a https://developers.facebook.com/tools/explorer
2. Selecciona tu aplicación
3. Haz clic en "Generate Access Token"
4. Selecciona los permisos:
   - `pages_read_engagement`
   - `pages_manage_ads`
   - `leads_retrieval`
5. Copia el token generado

**⚠️ IMPORTANTE**: Este token expira. Para un token permanente, sigue la Opción 2.

### Opción 2: Token Permanente

```bash
# 1. Obtén un User Access Token de corta duración desde Graph API Explorer

# 2. Intercámbialo por uno de larga duración:
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=TU_APP_ID&\
client_secret=TU_APP_SECRET&\
fb_exchange_token=TU_SHORT_TOKEN"

# 3. Obtén el Page Access Token (no expira):
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?\
access_token=TU_LONG_TOKEN"
```

## 📊 Verificar que Funciona

### Probar el Webhook

1. En https://developers.facebook.com/apps → Tu App → Webhooks
2. Busca "leadgen" en la sección de Page
3. Haz clic en "Test" → "leadgen"
4. Facebook enviará un lead de prueba a tu webhook

### Ver los Logs

```bash
vercel logs https://www.mulleryperez.cl --follow
```

## 🎯 URLs Importantes

- **Webhook URL**: `https://www.mulleryperez.cl/api/webhooks/facebook-leads`
- **Sync Leads URL**: `https://www.mulleryperez.cl/api/facebook/sync-leads`

## 🐛 Troubleshooting

### "Leads no aparecen en el CRM"

1. Verifica que el webhook esté configurado correctamente en Facebook
2. Revisa los logs de Vercel para ver si hay errores
3. Asegúrate de que la tabla `meta_sync` tenga un registro con el `fb_page_id` correcto

### "Error de verificación del webhook"

- El `FACEBOOK_WEBHOOK_VERIFY_TOKEN` en Vercel debe coincidir con el que ingresaste en Facebook

### "Error de firma inválida"

- Verifica que `FACEBOOK_APP_SECRET` sea correcto

### "No se pueden obtener detalles del lead"

- Verifica que `FACEBOOK_PAGE_ACCESS_TOKEN` tenga los permisos correctos
- Asegúrate de que el token no haya expirado

## 📝 Estructura de la Tabla meta_sync

Para que el webhook funcione, necesitas tener registros en la tabla `meta_sync`:

```sql
INSERT INTO meta_sync (cliente_id, fb_page_id, sync_activo)
VALUES ('TU_CLIENTE_ID', 'TU_FB_PAGE_ID', true);
```

Esto permite al sistema saber a qué cliente pertenecen los leads de cada página de Facebook.

## ✅ Checklist

- [ ] Variables de entorno agregadas en Vercel
- [ ] Aplicación desplegada
- [ ] Webhook configurado en Facebook Developer
- [ ] Webhook verificado exitosamente
- [ ] Página de Facebook conectada
- [ ] Campo `leadgen` suscrito
- [ ] Registro en tabla `meta_sync` creado
- [ ] Webhook probado con lead de prueba
- [ ] Lead de prueba aparece en el CRM

## 🎉 ¡Listo!

Una vez completados todos los pasos, los leads de Facebook Lead Ads aparecerán automáticamente en tu CRM en `/crm/leads`.
