# 📘 GUÍA: CONECTAR META ADS AL CRM

## Objetivo
Conectar la cuenta de Meta Ads de M&P al CRM para visualizar campañas en el dashboard del cliente.

---

## PASO 1: Crear App en Meta for Developers

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Haz clic en "My Apps" → "Create App"
3. Selecciona tipo: **"Business"**
4. Rellena:
   - **App Name**: "M&P CRM Integration"
   - **Contact Email**: contacto@mulleryperez.com
   - **Business Account**: Selecciona tu Business Manager
5. Clic en "Create App"

**Resultado:** Obtendrás **App ID** y **App Secret**

---

## PASO 2: Configurar Permisos de la App

1. En el dashboard de tu App, ve a **"Add Products"**
2. Encuentra **"Marketing API"** → Clic en "Set Up"
3. Ve a **"App Review" → "Permissions and Features"**
4. Solicita los siguientes permisos:
   - ✅ `ads_read` - Leer datos de anuncios
   - ✅ `ads_management` - Gestionar anuncios
   - ✅ `business_management` - Gestionar Business Manager

---

## PASO 3: Obtener Access Token de Larga Duración

### Opción A: Usar Graph API Explorer (MÁS FÁCIL)

1. Ve a [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecciona tu App en el dropdown
3. Selecciona permisos:
   - `ads_read`
   - `ads_management`
   - `business_management`
4. Clic en "Generate Access Token"
5. **IMPORTANTE:** Este token dura 60 días

**Copiar el token y guardarlo temporalmente**

### Opción B: Convertir a Long-Lived Token (60 días)

Si el token del Graph Explorer es de corta duración (1-2 horas), conviértelo:

```bash
curl -i -X GET "https://graph.facebook.com/v21.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=TU_APP_ID&\
client_secret=TU_APP_SECRET&\
fb_exchange_token=TU_SHORT_TOKEN"
```

**Resultado:** Obtendrás un `access_token` de larga duración

---

## PASO 4: Obtener ID de tu Cuenta de Ads

1. Ve a [Meta Business Suite](https://business.facebook.com/)
2. Menú → "All Tools" → "Ads Manager"
3. En la URL verás algo como:
   ```
   https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=123456789
   ```
4. El número después de `act=` es tu **Ad Account ID**
   - Formato completo: `act_123456789`

---

## PASO 5: Guardar en el CRM (Manual para TEST)

Ahora que tienes:
- ✅ Access Token
- ✅ Ad Account ID

Vamos a guardarlos en Supabase manualmente para el test.

**Ejecuta el script:**

```bash
node scripts/connect-meta-ads-manual.mjs
```

El script te pedirá:
1. **Access Token** (pegar el token de Meta)
2. **Ad Account ID** (ejemplo: act_123456789)
3. **Account Name** (ejemplo: "M&P Marketing - Principal")

---

## PASO 6: Asignar Cuenta a Cliente "Muller y Perez"

Una vez guardada la integración, asignarla al cliente:

```bash
node scripts/assign-meta-to-client.mjs
```

El script:
1. Busca al cliente "Muller y Perez"
2. Busca la integración de Meta Ads
3. Crea el mapping entre ambos

---

## PASO 7: Sincronizar Datos de Campañas

```bash
node scripts/sync-meta-campaigns.mjs
```

Este script:
1. Lee el Access Token de la DB
2. Llama a Meta Marketing API
3. Obtiene todas las campañas activas
4. Guarda métricas en `ads_metrics_daily`

---

## PASO 8: Ver en el Dashboard

1. Logout/Login como cliente "Muller y Perez"
2. Ir a dashboard → Tab "Campañas"
3. **¡Deberías ver las campañas de Meta Ads!**

---

## 📊 Estructura de Datos

### platform_integrations
```
id: 1
plataforma: 'meta_ads'
account_id: 'act_123456789'
account_name: 'M&P Marketing - Principal'
access_token: 'EAAabc123...'
refresh_token: null (Meta no usa refresh token)
connected_by: 'admin@mulleryperez.cl'
```

### client_platform_mapping
```
id: 1
cliente_id: 'UUID-de-muller-y-perez'
integration_id: 1 (referencia a la integración de arriba)
assigned_by: 'admin@mulleryperez.cl'
```

### ads_metrics_daily
```
cliente_id: 'UUID-de-muller-y-perez'
integration_id: 1
plataforma: 'meta_ads'
campaign_id: '120206479408010123'
campaign_name: 'Prospecting - Cold Audience'
fecha: '2025-11-19'
inversion: 45000
clicks: 234
impresiones: 12500
conversiones: 8
ctr: 1.87
cpc: 192.31
```

---

## 🔄 Renovación de Tokens

**IMPORTANTE:** Los tokens de Meta expiran cada 60 días.

Para renovar automáticamente (futuro):
1. Crear endpoint `/api/cron/renew-meta-tokens`
2. Usar CRON para ejecutar cada 50 días
3. Llamar a Meta API para renovar el token

**Renovación manual (por ahora):**
1. Repetir Paso 3 para obtener nuevo token
2. Ejecutar script de actualización:
   ```bash
   node scripts/update-meta-token.mjs
   ```

---

## 🐛 Troubleshooting

**Error: "Invalid OAuth access token"**
- Token expiró (renovar en Paso 3)

**Error: "Unsufficient permissions"**
- Falta solicitar permisos en App Review

**Error: "Ad account not found"**
- Verifica que el Ad Account ID sea correcto
- Verifica que la App tenga acceso al Business Manager

**No se ven campañas:**
- Verifica que haya campañas activas en los últimos 30 días
- Ejecuta el script de sincronización manualmente

---

## 📚 Referencias

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis/)
- [Access Tokens Guide](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/)
- [Ad Account Structure](https://developers.facebook.com/docs/marketing-api/reference/ad-account/)

---

**Última actualización:** 2025-11-20
**Autor:** Claude Code + Christopher Muller
