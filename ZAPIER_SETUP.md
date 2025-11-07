# CONFIGURACIÓN ZAPIER - CRM M&P

## ✅ ESTADO: ENDPOINT FUNCIONANDO CORRECTAMENTE

**Verificado**: 2025-11-07 15:29
**Test realizado**: Lead #481 creado exitosamente
**URL**: https://www.mulleryperez.cl/api/leads/zapier

---

## 📋 CONFIGURACIÓN PASO A PASO

### 1. Configuración del Zap

**Trigger** (Facebook Lead Ads):
- Selecciona tu página de Facebook
- Selecciona el formulario que quieres conectar
- Prueba que los datos se reciban correctamente

### 2. Configuración del Action (Webhook)

**Action Type**: Webhooks by Zapier
**Event**: POST

**URL**:
```
https://www.mulleryperez.cl/api/leads/zapier
```

**Payload Type**: `json`

**Headers**:
```
Content-Type: application/json
```

### 3. Campos Obligatorios del Body

Debes mapear estos campos desde los datos del formulario de Facebook:

#### CRÍTICO - Client ID
```json
{
  "client_id": "b1f839a4-db36-4341-b1b3-7d1ec290ca02"
}
```

⚠️ **IMPORTANTE**: Este es el UUID del cliente en Supabase. Para obtenerlo:

1. Ve a tu dashboard de Supabase
2. Abre la tabla `clientes`
3. Busca el cliente (ej: "M&P")
4. Copia el `id` (es un UUID como `b1f839a4-db36-4341-b1b3-7d1ec290ca02`)
5. Este ID debes ponerlo FIJO en el Zap (no se mapea del formulario)

#### Al menos UNO de estos tres:
```json
{
  "full_name": "{{nombre_desde_facebook}}",
  "email": "{{email_desde_facebook}}",
  "phone_number": "{{telefono_desde_facebook}}"
}
```

### 4. Campos Opcionales (Recomendados)

```json
{
  "form_name": "{{form_name}}",
  "ad_name": "{{ad_name}}",
  "campaign_name": "{{campaign_name}}",
  "form_id": "{{form_id}}"
}
```

Estos campos ayudan a rastrear de qué campaña, anuncio y formulario proviene el lead.

---

## 📝 EJEMPLO COMPLETO DEL BODY

```json
{
  "client_id": "b1f839a4-db36-4341-b1b3-7d1ec290ca02",
  "full_name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone_number": "+56912345678",
  "form_name": "Formulario Contacto Web",
  "ad_name": "Anuncio Servicios Marketing",
  "campaign_name": "Campaña Enero 2025",
  "form_id": "123456789"
}
```

---

## 🧪 CÓMO PROBAR

### Opción 1: Desde Zapier
1. Una vez configurado el Zap, actívalo
2. Llena el formulario de Facebook Lead Ads con datos de prueba
3. Espera 1-2 minutos
4. Ve al CRM: https://www.mulleryperez.cl/crm
5. Busca el lead nuevo (tendrá fuente "zapier")

### Opción 2: Prueba Manual con cURL

```bash
curl -X POST "https://www.mulleryperez.cl/api/leads/zapier" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "b1f839a4-db36-4341-b1b3-7d1ec290ca02",
    "full_name": "Test Lead",
    "email": "test@example.com",
    "phone_number": "+56912345678",
    "form_name": "Test Form",
    "ad_name": "Test Ad",
    "campaign_name": "Test Campaign"
  }'
```

**Respuesta esperada** (HTTP 201):
```json
{
  "success": true,
  "lead_id": 481,
  "message": "Lead creado exitosamente"
}
```

---

## ❌ ERRORES COMUNES

### Error 400: "client_id es requerido"
**Causa**: No estás enviando el `client_id` en el body
**Solución**: Agrega el campo `client_id` con el UUID del cliente

### Error 400: "Se requiere al menos: full_name, email o phone_number"
**Causa**: No estás enviando ninguno de estos tres campos
**Solución**: Mapea al menos uno de estos campos desde el formulario

### Error 404: "Cliente no encontrado"
**Causa**: El `client_id` no existe en la base de datos
**Solución**: Verifica que el UUID sea correcto en Supabase

### Error 500: Error interno
**Causa**: Problema con la base de datos o conexión
**Solución**: Revisa los logs en Vercel o contacta soporte

---

## 📊 VERIFICAR QUE FUNCIONA

1. Ve al CRM Admin: https://www.mulleryperez.cl/crm
2. Los leads de Zapier tendrán:
   - Fuente: "zapier"
   - Nombre, email y/o teléfono del formulario
   - Información de campaña/anuncio/formulario (si se envió)

---

## 🔍 DEBUGGING

### Ver logs en tiempo real:

```bash
export VERCEL_TOKEN=tu_token_aqui
vercel logs https://www.mulleryperez.cl --follow
```

### Buscar errores específicos de Zapier:

```bash
vercel logs https://www.mulleryperez.cl --since 1h | grep -i "zapier"
```

---

## 🆘 SOPORTE

Si los leads no llegan después de verificar todo:

1. Revisa que el Zap esté ACTIVADO en Zapier
2. Verifica los logs del Zap en Zapier (Task History)
3. Prueba con el cURL manual primero
4. Revisa los logs de Vercel
5. Verifica que el `client_id` sea el correcto en Supabase

---

## ✅ CHECKLIST FINAL

- [ ] Zap configurado con URL correcta
- [ ] `client_id` fijo en el body del webhook
- [ ] Al menos uno de: `full_name`, `email`, `phone_number` mapeado
- [ ] Headers `Content-Type: application/json` configurado
- [ ] Zap activado
- [ ] Prueba realizada con éxito
- [ ] Lead visible en el CRM con fuente "zapier"
