# Configuración de Zapier para Facebook Lead Ads

## Diagnóstico del Problema

El webhook de Zapier **SÍ está funcionando correctamente**. El problema es que necesitas configurar los Zaps con el `client_id` correcto.

## Clientes Disponibles en Supabase

Actualmente tienes 3 clientes registrados:

| Nombre | ID (UUID) | Activo |
|--------|-----------|--------|
| M&P | `02b52b98-c4b6-4359-97cd-d42b9230bb19` | ❌ No |
| M&P | `b1f839a4-db36-4341-b1b3-7d1ec290ca02` | ❌ No |
| M&P Marketing y Performance | `bf1b925e-8799-4db4-bd12-d12fbd106020` | ✅ Sí |

**⚠️ IMPORTANTE:** Solo hay UN cliente activo: **M&P Marketing y Performance**

## Configuración del Zap

### Paso 1: Trigger (Facebook Lead Ads)

1. Conecta tu cuenta de Facebook
2. Selecciona la página de Facebook
3. Selecciona el formulario de Lead Ads

### Paso 2: Action (Webhooks by Zapier)

**URL del Webhook:**
```
https://www.mulleryperez.cl/api/leads/zapier
```

**Método:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "client_id": "bf1b925e-8799-4db4-bd12-d12fbd106020",
  "full_name": "{{Full Name}}",
  "email": "{{Email}}",
  "phone_number": "{{Phone}}",
  "form_name": "{{Form Name}}",
  "ad_name": "{{Ad Name}}",
  "campaign_name": "{{Campaign Name}}"
}
```

## Mapeo de Campos

| Campo Zapier | Campo en el Webhook | Requerido | Nota |
|--------------|---------------------|-----------|------|
| `client_id` | `client_id` | ✅ Sí | **DEBE ser** `bf1b925e-8799-4db4-bd12-d12fbd106020` |
| Full Name | `full_name` | ⚠️ Uno de los 3 | Nombre completo del lead |
| Email | `email` | ⚠️ Uno de los 3 | Email del lead |
| Phone | `phone_number` | ⚠️ Uno de los 3 | Teléfono del lead |
| Form Name | `form_nombre` | ❌ No | Nombre del formulario |
| Ad Name | `ad_name` | ❌ No | Nombre del anuncio |
| Campaign Name | `campana_nombre` | ❌ No | Nombre de la campaña |

**⚠️ REQUISITO:** Debes enviar **AL MENOS UNO** de: `full_name`, `email`, o `phone_number`

## Crear Nuevos Clientes

Si necesitas crear leads para otros clientes, primero debes crear el cliente en Supabase:

```sql
INSERT INTO clientes (nombre, activo)
VALUES ('Nombre del Cliente', true);
```

Luego ejecuta este script para obtener el nuevo UUID:

```bash
node scripts/list-clients.js
```

## Test del Webhook

Para probar que el webhook funciona:

```bash
bash scripts/test-zapier-webhook.sh
```

Este script enviará un lead de prueba y te mostrará si fue creado exitosamente.

## Solución de Problemas

### Error: "Cliente no encontrado"

**Causa:** El `client_id` no existe en la tabla `clientes` o está mal escrito.

**Solución:** Verifica que estás usando el UUID correcto:
```
bf1b925e-8799-4db4-bd12-d12fbd106020
```

### Error: "client_id es requerido"

**Causa:** No estás enviando el campo `client_id` en el JSON.

**Solución:** Asegúrate de que el campo `client_id` esté hardcodeado en el Body del webhook de Zapier.

### Error: "Se requiere al menos: full_name, email o phone_number"

**Causa:** No estás enviando ninguno de los tres campos de contacto.

**Solución:** Verifica que al menos uno de estos campos tenga datos del formulario de Facebook.

## Verificación

Una vez configurado el Zap:

1. Activa el Zap
2. Envía un lead de prueba desde Facebook
3. Revisa el CRM: https://www.mulleryperez.cl/crm
4. El lead debería aparecer en la tabla de leads

## Notas Importantes

- El webhook crea automáticamente el campo `mes_ingreso` en formato YYYY-MM
- El campo `fuente` siempre será `'zapier'`
- Los leads se crean con `contactado: false` y `vendido: false` por defecto
- El webhook retorna un JSON con el `lead_id` si fue exitoso

## Ejemplo de Respuesta Exitosa

```json
{
  "success": true,
  "lead_id": 491,
  "message": "Lead creado exitosamente"
}
```

## Scripts Útiles

- **Listar clientes:** `node scripts/list-clients.js`
- **Testear webhook:** `bash scripts/test-zapier-webhook.sh`
