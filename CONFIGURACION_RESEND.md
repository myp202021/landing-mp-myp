# Configuracion de Resend para M&P CRM

## Informacion Actual

**API Key Actual:** `re_gAuPAEbW_9XmKDSSnbXgDQqt3nZ58M9Uu`
**Estado:** Activa
**Plan:** Free (3,000 emails/mes)

---

## Paso 1: Verificar API Key

1. Ir a: https://resend.com/login
2. Login con credenciales de M&P
3. Ir a: API Keys
4. Verificar que la key `re_gAuPAEbW_9XmKDSSnbXgDQqt3nZ58M9Uu` este activa

---

## Paso 2: Agregar Dominio

### 2.1 Crear Dominio en Resend

1. Ir a: https://resend.com/domains
2. Click en "Add Domain"
3. Ingresar: `mulleryperez.cl`
4. Click en "Add Domain"

### 2.2 Copiar Registros DNS

Resend te dara 4 registros DNS que debes agregar:

#### Registro 1: Verificacion TXT
```
Type: TXT
Name: _resend
Value: re_xxxxxxxxx
TTL: 3600
```

#### Registro 2: MX (Mail Exchange)
```
Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 3600
```

#### Registro 3: SPF (Sender Policy Framework)
```
Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### Registro 4: DKIM (DomainKeys Identified Mail)
```
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.us-east-1.amazonses.com
TTL: 3600
```

---

## Paso 3: Agregar Registros en DNS Provider

### Si usas Cloudflare:

1. Login en Cloudflare
2. Seleccionar dominio `mulleryperez.cl`
3. Ir a DNS > Records
4. Agregar cada registro DNS:
   - Click "Add record"
   - Copiar Type, Name, Value de Resend
   - Click "Save"
5. Repetir para los 4 registros

### Si usas otro DNS:

1. Login en tu proveedor DNS
2. Buscar la seccion DNS Records / DNS Management
3. Agregar los 4 registros copiados de Resend
4. Guardar cambios

---

## Paso 4: Esperar Verificacion

- **Tiempo estimado:** 24-48 horas
- **Verificacion automatica:** Resend revisa cada hora
- **Notificacion:** Te llegara un email cuando este verificado

**Para verificar manualmente:**
1. Ir a: https://resend.com/domains
2. Verificar que aparezca el dominio con checkmark verde

---

## Paso 5: Configurar Remitente

### Email de Remitente Predeterminado

Actualmente configurado en el codigo:
```typescript
from: 'M&P CRM <crm@mulleryperez.cl>'
```

### Cambiar Remitente (opcional)

Editar archivo: `/lib/email/resend-service.ts`

```typescript
// Linea 9
from = 'M&P CRM <crm@mulleryperez.cl>'

// Cambiar a:
from = 'Tu Nombre <tu-email@mulleryperez.cl>'
```

**Emails validos una vez verificado el dominio:**
- crm@mulleryperez.cl
- contacto@mulleryperez.cl
- ventas@mulleryperez.cl
- info@mulleryperez.cl
- hola@mulleryperez.cl

---

## Mientras NO este verificado el dominio

### Usar Email de Onboarding

Resend permite enviar desde `onboarding@resend.dev` sin verificacion.

**Cambiar temporalmente:**

En `/lib/email/resend-service.ts`, linea 9:
```typescript
from = 'M&P CRM <onboarding@resend.dev>'
```

**IMPORTANTE:** Este email solo funciona para testing. En produccion DEBES usar tu dominio verificado.

---

## Limitaciones del Plan Free

### Limites Mensuales
- **Emails por mes:** 3,000
- **Emails por dia:** 100
- **Rate limit:** 1 email/segundo
- **Dominios:** 1 dominio verificado

### Que pasa si excedes el limite?

- Los emails quedan en cola con estado "error"
- Resend retorna error 429 (Too Many Requests)
- Debes actualizar a plan pago o esperar al proximo mes

### Ver uso actual:

1. Ir a: https://resend.com/overview
2. Ver seccion "Usage"
3. Monitorear emails enviados

---

## Upgrade a Plan Pago (Opcional)

### Plan Pro: $20 USD/mes
- 50,000 emails/mes
- 1,000 emails/dia
- 10 emails/segundo
- 5 dominios
- Soporte prioritario

### Cuando hacer upgrade?

Si envias mas de 3,000 emails/mes o necesitas:
- Mayor rate limit
- Multiples dominios
- Soporte tecnico
- Analytics avanzado

**Link:** https://resend.com/pricing

---

## Verificar que funciona

### Test 1: Email de Prueba desde UI

1. Login al CRM como cliente
2. Ir a Respuestas Automaticas
3. Crear respuesta de prueba
4. Click "Enviar Email de Prueba"
5. Revisar tu bandeja

### Test 2: Email de Prueba via API

```bash
curl -X POST http://localhost:3000/api/crm/emails/enviar-test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tu-email@ejemplo.cl",
    "nombre": "Usuario Test",
    "asunto": "Prueba desde CRM",
    "mensaje": "Este es un test del sistema de emails automaticos"
  }'
```

### Test 3: Trigger Automatico

```bash
# 1. Crear lead con email
curl -X POST http://localhost:3000/api/crm/leads \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Perez",
    "email": "juan@ejemplo.cl",
    "telefono": "+56912345678",
    "empresa": "Test SA",
    "cliente_id": "UUID"
  }'

# 2. El trigger automaticamente creara email en cola

# 3. Procesar cola
curl -X POST http://localhost:3000/api/crm/emails/enviar-pendientes

# 4. Verificar que juan@ejemplo.cl recibio el email
```

---

## Monitoreo en Resend Dashboard

### Ver Emails Enviados

1. Ir a: https://resend.com/emails
2. Ver lista de emails enviados
3. Click en email para ver detalles:
   - Estado (delivered, bounced, failed)
   - Timestamp
   - Remitente y destinatario
   - Contenido
   - Logs

### Estados posibles:

- **Queued:** En cola de envio
- **Sent:** Enviado exitosamente
- **Delivered:** Entregado a bandeja
- **Opened:** Email abierto (si tracking habilitado)
- **Clicked:** Link clickeado (si tracking habilitado)
- **Bounced:** Rebotado (email invalido)
- **Failed:** Fallo en envio

---

## Troubleshooting

### Error: "Invalid API key"
**Solucion:** Verificar que `RESEND_API_KEY` en `.env.local` este correcta

### Error: "Domain not verified"
**Solucion:**
1. Verificar registros DNS
2. Usar `onboarding@resend.dev` temporalmente

### Email no llega
**Revisar:**
1. Spam/Junk folder
2. Email invalido
3. Dominio bloqueado
4. Rate limit excedido

### Email rebota (bounce)
**Causas:**
- Email no existe
- Buzon lleno
- Servidor destino rechaza
- Email en blacklist

**Solucion:** Verificar email del destinatario

---

## Mejores Practicas

### DO (Hacer):
✅ Verificar dominio antes de produccion
✅ Usar email corporativo como remitente
✅ Personalizar mensajes con variables
✅ Probar siempre antes de activar
✅ Monitorear bounce rate
✅ Respetar opt-out/unsubscribe
✅ Mantener listas limpias

### DON'T (No hacer):
❌ Enviar spam
❌ Comprar listas de emails
❌ Usar MAYUSCULAS en asunto
❌ Exceder rate limits
❌ Ignorar bounces
❌ Enviar sin consentimiento
❌ Usar palabras spam (GRATIS, URGENTE, etc)

---

## Recursos Adicionales

### Documentacion Resend
- Website: https://resend.com
- Docs: https://resend.com/docs
- API Reference: https://resend.com/docs/api-reference
- SDKs: https://resend.com/docs/sdks

### Soporte
- Email: support@resend.com
- Discord: https://discord.gg/resend
- Status: https://status.resend.com

### M&P Support
- Developer: Christopher Muller
- Email: christopher@mulleryperez.cl
- Docs: /database/INSTRUCCIONES_SPRINT_3.md

---

## Checklist de Configuracion

- [ ] API Key agregada en .env.local
- [ ] Login en Resend.com exitoso
- [ ] Dominio mulleryperez.cl agregado
- [ ] 4 registros DNS copiados
- [ ] Registros DNS agregados en provider
- [ ] Esperar verificacion 24-48h
- [ ] Verificar dominio en Resend
- [ ] Cambiar remitente a crm@mulleryperez.cl
- [ ] Enviar email de prueba
- [ ] Verificar recepcion
- [ ] Monitorear dashboard
- [ ] Listo para produccion ✅

---

**Ultima actualizacion:** 13 de Noviembre de 2025
**Autor:** Christopher Muller - M&P CRM Team
**Version:** 1.0
