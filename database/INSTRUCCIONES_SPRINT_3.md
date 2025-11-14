# SPRINT 3: Sistema de Respuestas Automaticas por Email

## Fecha de Implementacion
13 de Noviembre de 2025

## Resumen
Sistema completo de respuestas automaticas por email para clientes del CRM. Permite enviar emails personalizados a leads de forma automatica segun diferentes triggers (eventos).

---

## Archivos Creados

### 1. Base de Datos
- `/database/10_RESPUESTAS_AUTOMATICAS.sql` - Migracion SQL completa con tablas, triggers y funciones

### 2. Servicios
- `/lib/email/resend-service.ts` - Servicio de envio de emails con Resend

### 3. APIs
- `/app/api/crm/respuestas-automaticas/route.ts` - CRUD de respuestas automaticas
- `/app/api/crm/emails/enviar-pendientes/route.ts` - Procesamiento de cola de emails
- `/app/api/crm/emails/enviar-test/route.ts` - Envio de emails de prueba

### 4. Paginas del Cliente
- `/app/crm/cliente/respuestas-automaticas/page.tsx` - Lista y gestion de respuestas
- `/app/crm/cliente/respuestas-automaticas/nueva/page.tsx` - Crear nueva respuesta
- `/app/crm/cliente/respuestas-automaticas/[id]/page.tsx` - Editar respuesta existente

---

## Instrucciones de Configuracion

### PASO 1: Ejecutar Migracion SQL

1. Ir a Supabase SQL Editor: https://faitwrutauavjwnsnlzq.supabase.co
2. Copiar contenido de `/database/10_RESPUESTAS_AUTOMATICAS.sql`
3. Pegar y ejecutar en SQL Editor
4. Verificar que se crearon las tablas:
   ```sql
   SELECT * FROM respuestas_automaticas;
   SELECT * FROM emails_enviados;
   ```

### PASO 2: Verificar Variables de Entorno

El archivo `.env.local` ya tiene configurado:
```env
NEXT_PUBLIC_SUPABASE_URL=https://eghqubmivhcwasxklwlc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_gAuPAEbW_9XmKDSSnbXgDQqt3nZ58M9Uu
```

### PASO 3: Configurar Dominio en Resend

1. Ir a: https://resend.com/domains
2. Agregar dominio: `mulleryperez.cl`
3. Agregar registros DNS:
   - TXT para verificacion
   - MX, SPF, DKIM para envio
4. Esperar verificacion (puede tomar 24-48 horas)

**IMPORTANTE:** Mientras se verifica el dominio, puedes usar emails de prueba desde `onboarding@resend.dev`

### PASO 4: Probar el Sistema

1. Reiniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Login como cliente:
   - URL: http://localhost:3000/crm/login
   - Usar credenciales de cliente existente

3. Navegar a "Respuestas Automaticas"

4. Crear una respuesta de prueba:
   - Nombre: "Bienvenida a Nuevos Leads"
   - Trigger: "Al recibir nuevo lead"
   - Asunto: "Gracias por contactarnos"
   - Mensaje: Ver ejemplo abajo
   - Activar: SI

5. Enviar email de prueba

6. Crear un lead de prueba:
   ```bash
   # El trigger automaticamente creara un email en cola
   # Ver en Supabase:
   SELECT * FROM emails_enviados WHERE estado = 'pendiente';
   ```

7. Procesar emails pendientes:
   ```bash
   curl -X POST http://localhost:3000/api/crm/emails/enviar-pendientes
   ```

---

## Ejemplo de Mensaje con Variables

```
Hola {nombre} {apellido},

Gracias por contactarnos desde {empresa}. Hemos recibido tu solicitud y nos pondremos en contacto contigo muy pronto.

Tus datos registrados:
- Email: {email}
- Telefono: {telefono}

Nuestro equipo revisara tu consulta y te responderemos a la brevedad.

Saludos cordiales,
Equipo M&P - Muller y Perez
Marketing y Performance
```

### Variables Disponibles
- `{nombre}` - Nombre del lead
- `{apellido}` - Apellido del lead
- `{email}` - Email del lead
- `{telefono}` - Telefono del lead
- `{empresa}` - Empresa del lead

---

## Tipos de Triggers

### 1. `nuevo_lead`
Se ejecuta inmediatamente cuando se crea un nuevo lead con email.

**Trigger SQL:** `trg_nuevo_lead_respuesta_auto`

**Ejemplo de uso:**
- Email de bienvenida
- Confirmacion de recepcion
- Instrucciones siguientes pasos

### 2. `sin_contactar_24h` (Pendiente implementacion)
Se ejecuta si un lead no ha sido contactado en 24 horas.

**Requiere:** Cron job que se ejecute cada hora

### 3. `sin_contactar_48h` (Pendiente implementacion)
Se ejecuta si un lead no ha sido contactado en 48 horas.

**Requiere:** Cron job que se ejecute cada hora

---

## Estructura de Base de Datos

### Tabla `respuestas_automaticas`
```sql
id                SERIAL PRIMARY KEY
cliente_id        UUID (FK a clientes)
nombre            TEXT
asunto            TEXT
mensaje           TEXT
activa            BOOLEAN
trigger_tipo      TEXT ('nuevo_lead', 'sin_contactar_24h', 'sin_contactar_48h')
creado_en         TIMESTAMPTZ
actualizado_en    TIMESTAMPTZ
```

### Tabla `emails_enviados`
```sql
id                          SERIAL PRIMARY KEY
respuesta_automatica_id     INTEGER (FK a respuestas_automaticas)
lead_id                     BIGINT (FK a leads)
cliente_id                  UUID (FK a clientes)
destinatario_email          TEXT
destinatario_nombre         TEXT
asunto                      TEXT
mensaje                     TEXT
estado                      TEXT ('pendiente', 'enviado', 'error')
error_mensaje               TEXT
proveedor                   TEXT ('resend', 'sendgrid')
proveedor_message_id        TEXT
enviado_en                  TIMESTAMPTZ
creado_en                   TIMESTAMPTZ
```

---

## Flujo de Funcionamiento

### Flujo Automatico (nuevo_lead)
1. Usuario crea lead via formulario/API
2. Trigger SQL detecta nuevo lead con email
3. Busca respuestas activas con trigger_tipo='nuevo_lead'
4. Personaliza mensaje reemplazando variables
5. Inserta email en cola (tabla `emails_enviados`)
6. API `/enviar-pendientes` procesa cola
7. Envia email via Resend
8. Actualiza estado en BD

### Flujo Manual (enviar test)
1. Cliente configura respuesta
2. Click en "Enviar Prueba"
3. Ingresa email destino
4. API envia inmediatamente via Resend
5. Email incluye banner de TEST

---

## APIs Disponibles

### GET `/api/crm/respuestas-automaticas`
Listar respuestas de un cliente
```bash
curl "http://localhost:3000/api/crm/respuestas-automaticas?cliente_id=UUID"
```

### POST `/api/crm/respuestas-automaticas`
Crear nueva respuesta
```bash
curl -X POST http://localhost:3000/api/crm/respuestas-automaticas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "UUID",
    "nombre": "Bienvenida",
    "asunto": "Gracias por contactarnos",
    "mensaje": "Hola {nombre}...",
    "trigger_tipo": "nuevo_lead",
    "activa": true
  }'
```

### PATCH `/api/crm/respuestas-automaticas`
Actualizar respuesta existente
```bash
curl -X PATCH http://localhost:3000/api/crm/respuestas-automaticas \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "activa": false
  }'
```

### DELETE `/api/crm/respuestas-automaticas?id=1`
Eliminar respuesta
```bash
curl -X DELETE "http://localhost:3000/api/crm/respuestas-automaticas?id=1"
```

### POST `/api/crm/emails/enviar-pendientes`
Procesar cola de emails (max 100)
```bash
curl -X POST http://localhost:3000/api/crm/emails/enviar-pendientes
```

### POST `/api/crm/emails/enviar-test`
Enviar email de prueba
```bash
curl -X POST http://localhost:3000/api/crm/emails/enviar-test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "usuario@ejemplo.cl",
    "nombre": "Usuario",
    "asunto": "Prueba",
    "mensaje": "Hola mundo"
  }'
```

---

## Implementaciones Futuras

### TAREA PENDIENTE: Cron Job para Triggers 24h/48h

Crear archivo: `/app/api/cron/enviar-respuestas-automaticas/route.ts`

```typescript
// Este endpoint debe ejecutarse cada hora via Vercel Cron Jobs
// Ver: https://vercel.com/docs/cron-jobs

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Buscar leads sin contactar por 24 horas
    const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const { data: leadsSinContactar24h } = await supabase
      .from('leads')
      .select('*')
      .is('primer_contacto', null)
      .lt('creado_en', hace24h.toISOString())
      .not('email', 'is', null)

    // Crear emails para cada lead que cumpla condiciones
    // Similar a trigger de nuevo_lead pero para trigger_tipo='sin_contactar_24h'

    // Repetir para 48h

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

Agregar en `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/enviar-respuestas-automaticas",
    "schedule": "0 * * * *"
  }]
}
```

---

## Seguridad y Permisos

### Row Level Security (RLS)
Las tablas tienen politicas RLS activas:
- Clientes solo ven sus propias respuestas
- Clientes solo ven sus propios emails enviados
- Service role puede insertar emails (necesario para triggers)

### Validaciones
- Email format validation
- Trigger tipo debe ser valido
- Cliente_id es obligatorio
- Asunto y mensaje no pueden estar vacios

---

## Testing

### Test Manual
1. Login como cliente
2. Crear respuesta automatica
3. Activar respuesta
4. Enviar email de prueba
5. Crear lead de prueba
6. Verificar email en cola
7. Procesar cola
8. Verificar email recibido

### Test con Resend Dashboard
Ver emails enviados en: https://resend.com/emails

---

## Troubleshooting

### Error: "No such function: actualizar_respuesta_timestamp"
**Solucion:** Ejecutar migracion SQL completa

### Error: "Invalid API key"
**Solucion:** Verificar RESEND_API_KEY en .env.local

### Email no se envia
**Causas posibles:**
1. Dominio no verificado en Resend
2. Email invalido
3. API key incorrecta
4. Rate limit excedido (3000 emails/mes en plan free)

**Solucion:** Ver logs en Resend Dashboard

### Trigger no se ejecuta
**Causas posibles:**
1. Respuesta no esta activa
2. Lead no tiene email
3. Trigger deshabilitado

**Solucion:** Verificar en SQL:
```sql
SELECT * FROM respuestas_automaticas WHERE activa = true;
SELECT * FROM pg_trigger WHERE tgname = 'trg_nuevo_lead_respuesta_auto';
```

---

## Limites y Consideraciones

### Resend Plan Free
- 3,000 emails/mes
- 100 emails/dia
- 1 email/segundo

### Recomendaciones
1. No activar multiples respuestas para el mismo trigger
2. Probar siempre con email de prueba antes de activar
3. Monitorear cola de emails pendientes
4. Configurar cron job para procesar cola cada 5-10 minutos
5. Verificar dominio en Resend antes de produccion

---

## Soporte

Para dudas o problemas:
1. Revisar logs de Supabase
2. Revisar logs de Resend
3. Verificar variables de entorno
4. Contactar a christopher@mulleryperez.cl

---

## Checklist de Implementacion

- [x] Crear migracion SQL
- [x] Crear servicio de email
- [x] Crear APIs CRUD
- [x] Crear pagina de listado
- [x] Crear pagina de nueva respuesta
- [x] Crear pagina de editar respuesta
- [x] Agregar SUPABASE_SERVICE_ROLE_KEY
- [ ] Ejecutar migracion en Supabase
- [ ] Verificar dominio en Resend
- [ ] Probar envio de emails
- [ ] Implementar cron job para triggers 24h/48h
- [ ] Deploy a produccion

---

Fecha de documento: 13 de Noviembre de 2025
Autor: Claude Code + Christopher Muller
Proyecto: M&P CRM - Landing MP MYP
