# 📘 GUÍA: Conectar Cliente con Zapier para Meta Leads

Esta guía explica **paso a paso** cómo conectar un nuevo cliente en el CRM con Zapier para recibir automáticamente leads desde Facebook/Instagram Lead Ads.

---

## 🎯 RESUMEN RÁPIDO

1. **Crear cliente en CRM** → 2. **Copiar URL webhook** → 3. **Configurar Zap** → 4. **Probar conexión**

---

## 📋 PASO 1: Crear o Editar Cliente en el CRM

### 1.1 Acceder a la gestión de clientes

1. Entra al CRM Admin: `https://www.mulleryperez.cl/crm`
2. Login con credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `2025Chile!`
3. Ve a la sección **"Clientes"** en el menú lateral

### 1.2 Crear nuevo cliente (ejemplo: Palomino)

1. Haz clic en el botón **"+ Nuevo Cliente"**
2. Completa los campos:
   - **Nombre**: `Palomino` (nombre del cliente)
   - **Rubro**: `Autos` (industria del cliente)
   - **Email**: `contacto@palomino.cl` (opcional)
   - **Inversión mensual**: `5000000` (presupuesto publicitario mensual)
   - **Estado**: Selecciona **"Activo"** ✅
3. Haz clic en **"Crear Cliente"**

### 1.3 Editar cliente existente

1. En la lista de clientes, haz clic en **"Editar"** del cliente que quieres configurar
2. Se abrirá el modal de edición con todos los datos del cliente

---

## 📎 PASO 2: Copiar URL del Webhook

### 2.1 Obtener la URL

Dentro del modal de edición del cliente, verás una sección azul que dice:

```
🔗 URL del Webhook para Zapier:
┌───────────────────────────────────────────────────────────────┐
│ https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=abc123... │
│                                                    [Copiar]     │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Copiar URL

1. Haz clic en el botón **"Copiar"**
2. Verás el mensaje: **"URL copiada al portapapeles"**
3. **IMPORTANTE**: Cada cliente tiene su propia URL única con su `cliente_id`

**Ejemplo de URL completa:**
```
https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=f47ac10b-58cc-4372-a567-0e02b2c3d479
```

---

## ⚡ PASO 3: Configurar Zap en Zapier

### 3.1 Crear nuevo Zap

1. Ve a [Zapier](https://zapier.com) y haz login
2. Haz clic en **"Create Zap"** (Crear Zap)
3. Dale un nombre descriptivo, por ejemplo: `Meta Leads → Palomino CRM`

### 3.2 Configurar TRIGGER (Disparador)

**Paso 3.2.1 - Seleccionar App:**
- Busca y selecciona: **"Facebook Lead Ads"**
- Evento: **"New Lead"** (Nuevo Lead)
- Haz clic en **"Continue"**

**Paso 3.2.2 - Conectar cuenta de Facebook:**
- Haz clic en **"Sign in to Facebook"**
- Autoriza el acceso a las cuentas de publicidad del cliente
- Selecciona la **cuenta de publicidad** del cliente (Palomino)

**Paso 3.2.3 - Configurar trigger:**
- **Page**: Selecciona la página de Facebook del cliente
- **Form**: Selecciona el formulario de Lead Ads que quieres conectar
- Haz clic en **"Continue"**

**Paso 3.2.4 - Probar trigger:**
- Haz clic en **"Test trigger"**
- Zapier buscará un lead de ejemplo
- Verifica que los datos se vean correctos
- Haz clic en **"Continue"**

### 3.3 Configurar ACTION (Acción)

**Paso 3.3.1 - Seleccionar App:**
- Busca y selecciona: **"Webhooks by Zapier"**
- Action Event: **"POST"**
- Haz clic en **"Continue"**

**Paso 3.3.2 - Configurar webhook:**

En la sección **"URL"**, pega la URL del webhook que copiaste en el Paso 2:
```
https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Paso 3.3.3 - Payload Type:**
- Selecciona: **"JSON"**

**Paso 3.3.4 - Data (mapear campos):**

Configura los siguientes campos mapeando los datos del formulario:

| Campo CRM | Campo de Facebook Lead Ads |
|-----------|---------------------------|
| `nombre` | First Name (Nombre) |
| `apellido` | Last Name (Apellido) |
| `email` | Email |
| `telefono` | Phone Number (Teléfono) |
| `empresa` | Company Name (si aplica) |
| `ciudad` | City (si aplica) |
| `region` | State/Province (si aplica) |
| `mensaje` | Custom Questions (Preguntas personalizadas) |
| `presupuesto` | Budget (si aplica) |
| `servicio` | Service Interest (si aplica) |

**Ejemplo visual de configuración:**
```
Data:
  nombre:     {{Facebook Lead Ads: First Name}}
  apellido:   {{Facebook Lead Ads: Last Name}}
  email:      {{Facebook Lead Ads: Email}}
  telefono:   {{Facebook Lead Ads: Phone}}
  empresa:    {{Facebook Lead Ads: Company}}
  ciudad:     {{Facebook Lead Ads: City}}
  presupuesto: {{Facebook Lead Ads: Budget}}
  servicio:   {{Facebook Lead Ads: Service}}
```

**Notas importantes:**
- Solo mapea los campos que existen en tu formulario de Facebook
- Los campos `nombre` y `email` son **obligatorios**
- Los demás campos son opcionales

**Paso 3.3.5 - Configuraciones adicionales:**
- **Unflatten**: `No`
- **Wrap Request in Array**: `No`
- Deja el resto de campos en blanco

### 3.4 Probar la conexión

**Paso 3.4.1 - Test action:**
- Haz clic en **"Test action"** (Probar acción)
- Zapier enviará los datos del lead de prueba al webhook
- Deberías ver una respuesta exitosa: **Status 200 OK**

**Paso 3.4.2 - Verificar en el CRM:**
1. Ve al CRM: `https://www.mulleryperez.cl/crm`
2. Entra al cliente (Palomino)
3. Ve a la sección **"Leads"**
4. Deberías ver el lead de prueba con:
   - Fuente: `facebook_lead_ads`
   - Estado: Nuevo
   - Datos del formulario

**Paso 3.4.3 - Activar Zap:**
- Si todo funciona correctamente, haz clic en **"Publish Zap"** (Publicar Zap)
- El Zap ahora está activo y funcionando 🎉

---

## ✅ PASO 4: Verificar Funcionamiento

### 4.1 Crear lead de prueba real

1. Ve a Facebook Ads Manager
2. Abre la campaña del cliente
3. Crea un lead de prueba desde el formulario
4. Espera 1-2 minutos (Zapier tiene un delay de procesamiento)

### 4.2 Verificar en CRM

1. Refresca la página de Leads del cliente
2. El nuevo lead debería aparecer automáticamente
3. Verifica que todos los campos se hayan mapeado correctamente

### 4.3 Revisar historial de Zap

Si algo falla:
1. Ve a Zapier → **"Zap History"** (Historial del Zap)
2. Revisa los últimos runs (ejecuciones)
3. Si hay errores, verás:
   - ❌ **Error**: Descripción del problema
   - 🔍 **Detalles**: Click para ver más información

---

## 🛠️ TROUBLESHOOTING (Solución de Problemas)

### Problema 1: Error 404 - Not Found
**Causa**: La URL del webhook está incorrecta
**Solución**:
- Verifica que la URL tenga este formato exacto:
  ```
  https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=...
  ```
- Copia nuevamente la URL desde el CRM
- Asegúrate de no haber cortado parte de la URL al copiar

### Problema 2: Error 500 - Internal Server Error
**Causa**: Faltan campos obligatorios o hay un error en el servidor
**Solución**:
- Asegúrate de mapear al menos `nombre` y `email`
- Revisa los logs de Vercel: `https://vercel.com/christophers-projects-2823b4cc/landing-mp-myp/logs`
- Contacta al desarrollador

### Problema 3: Lead no aparece en CRM
**Causa**: El `cliente_id` no corresponde al cliente correcto
**Solución**:
- Ve al CRM y edita el cliente
- Copia nuevamente la URL del webhook
- Actualiza la URL en Zapier con la correcta

### Problema 4: Campos vacíos en el CRM
**Causa**: El mapeo de campos está incorrecto
**Solución**:
- Ve a Zapier → Editar Zap → Action step
- Revisa el mapeo de campos
- Asegúrate de usar los campos correctos del formulario de Facebook

### Problema 5: Leads duplicados
**Causa**: El mismo formulario está conectado en múltiples Zaps
**Solución**:
- Revisa que solo haya un Zap activo por formulario
- Desactiva Zaps duplicados

---

## 📊 CAMPOS DISPONIBLES

### Campos del Lead (recibidos desde Facebook)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombre` | string | ✅ Sí | Nombre del lead |
| `apellido` | string | ❌ No | Apellido del lead |
| `email` | string | ✅ Sí | Email del lead |
| `telefono` | string | ❌ No | Teléfono del lead |
| `empresa` | string | ❌ No | Nombre de la empresa |
| `ciudad` | string | ❌ No | Ciudad del lead |
| `region` | string | ❌ No | Región/provincia |
| `mensaje` | string | ❌ No | Mensaje o consulta |
| `presupuesto` | string | ❌ No | Presupuesto indicado |
| `servicio` | string | ❌ No | Servicio de interés |
| `rubro` | string | ❌ No | Rubro o industria |

### Campos automáticos (generados por el sistema)

| Campo | Descripción |
|-------|-------------|
| `fuente` | Siempre `facebook_lead_ads` |
| `campana_nombre` | Nombre de la campaña (si disponible) |
| `adset_nombre` | Nombre del conjunto de anuncios |
| `ad_nombre` | Nombre del anuncio |
| `form_nombre` | Nombre del formulario |
| `meta_lead_id` | ID único del lead en Facebook |
| `fecha_ingreso` | Fecha y hora de ingreso (automática) |
| `mes_ingreso` | Mes en formato YYYY-MM |
| `cliente_id` | ID del cliente (desde URL) |

---

## 🔐 SEGURIDAD Y BUENAS PRÁCTICAS

1. **No compartas la URL del webhook públicamente** - Cada URL es única y da acceso directo a ingresar leads

2. **Verifica el cliente_id** - Antes de activar el Zap, verifica que el `cliente_id` en la URL corresponda al cliente correcto

3. **Nombra los Zaps correctamente** - Usa nombres descriptivos como `Meta Leads → Cliente ABC`

4. **Monitorea regularmente** - Revisa el historial de Zapier semanalmente para detectar errores

5. **Prueba después de cambios** - Si actualizas el formulario de Facebook, prueba nuevamente el Zap

6. **Documenta para el cliente** - Cuando configures el Zap para un cliente, documenta qué formularios están conectados

---

## 📞 SOPORTE

Si necesitas ayuda adicional:

- **Desarrollador**: Christopher Müller
- **Documentación Zapier**: https://zapier.com/help
- **API Webhook**: `/api/webhooks/meta-leads`
- **Logs de producción**: Vercel Dashboard

---

## ✨ EJEMPLO COMPLETO: Cliente Palomino

### Datos del cliente
- **Nombre**: Palomino
- **Rubro**: Autos
- **Inversión**: $5.000.000 CLP/mes

### URL del Webhook
```
https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### Configuración del Zap
- **Trigger**: Facebook Lead Ads → Página "Palomino Automotriz" → Formulario "Cotiza tu auto"
- **Action**: POST a webhook con campos:
  - nombre: First Name
  - apellido: Last Name
  - email: Email
  - telefono: Phone
  - mensaje: "¿Qué auto te interesa?"

### Resultado esperado
Cada vez que alguien complete el formulario "Cotiza tu auto" en Facebook/Instagram:
1. Zapier captura el lead
2. Lo envía automáticamente al CRM
3. Aparece en la sección Leads de Palomino
4. El equipo de M&P puede contactarlo de inmediato

---

✅ **¡Listo! Ahora el cliente está conectado y recibirá leads automáticamente desde Facebook/Instagram al CRM.**
