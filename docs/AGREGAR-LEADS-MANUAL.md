# 📝 AGREGAR LEADS MANUALES - DOCUMENTACIÓN

## Descripción General

Sistema que permite a **administradores y clientes** agregar leads manualmente al CRM desde diferentes fuentes (Email, WhatsApp, Meta, Zapier).

## ✅ Implementado en

- **Dashboard Admin** (`/app/crm/page.tsx`)
- **Dashboard Cliente** (`/app/crm/cliente/dashboard/page.tsx`)
- **API Route** (`/app/api/crm/leads/route.ts`)

---

## 📊 Flujo de Datos

```
Usuario → Formulario → API POST /api/crm/leads → Supabase → Refresco automático
```

### 1. **Usuario llena formulario**
   - Selecciona fuente (email, whatsapp, meta, zapier)
   - Ingresa datos del lead (nombre, email, teléfono, empresa)
   - Agrega observaciones opcionales

### 2. **API valida y crea el lead**
   - Valida `cliente_id` obligatorio
   - Valida `fuente` obligatoria
   - Valida al menos uno: nombre, email o teléfono
   - Inserta en tabla `leads` de Supabase

### 3. **Sistema registra en historial**
   - Crea entrada en tabla `lead_historial`
   - Registra usuario, acción ("crear") y descripción

### 4. **Dashboard se actualiza**
   - Llama a `loadData()` para refrescar leads
   - Muestra el nuevo lead en la tabla
   - Cierra el modal y resetea el formulario

---

## 🔧 Componentes Técnicos

### API Endpoint: POST /api/crm/leads

**Archivo:** `/app/api/crm/leads/route.ts:92-168`

**Request Body:**
```typescript
{
  cliente_id: string,      // UUID del cliente (obligatorio)
  nombre?: string,         // Nombre del lead
  email?: string,          // Email del lead
  telefono?: string,       // Teléfono del lead
  empresa?: string,        // Empresa del lead
  fuente: string,          // "email" | "whatsapp" | "meta" | "zapier"
  observaciones?: string   // Notas adicionales
}
```

**Response Success (200):**
```typescript
{
  success: true,
  lead: {
    id: number,
    cliente_id: string,
    nombre: string,
    email: string,
    // ... todos los campos del lead
  }
}
```

**Response Error (400/500):**
```typescript
{
  error: string,
  details?: string
}
```

**Validaciones:**
- `cliente_id` es obligatorio
- `fuente` es obligatoria y debe ser una de las 4 opciones
- Al menos uno de: `nombre`, `email` o `telefono` debe estar presente

---

## 🎨 Interfaz de Usuario

### Dashboard Admin

**Ubicación del botón:** Sección de filtros, junto al selector de cliente

```typescript
<Button
  onClick={() => setShowAgregarLeadModal(true)}
  variant="primary"
>
  + Agregar Lead Manual
</Button>
```

**Modal:** Formulario completo con:
- Selector de cliente (dropdown con todos los clientes)
- Selector de fuente (email, whatsapp, meta, zapier) con íconos
- Campos de datos (nombre, email, teléfono, empresa)
- Campo de observaciones (textarea)

### Dashboard Cliente

**Ubicación del botón:** Header de la tabla "Mis Leads"

```typescript
<Button
  onClick={() => setShowAgregarLeadModal(true)}
  variant="primary"
  className="bg-green-600 hover:bg-green-700"
>
  + Agregar Lead Manual
</Button>
```

**Modal:** Similar al admin pero **SIN selector de cliente** (se asigna automáticamente)

**Diferencia clave:**
- Admin: Puede seleccionar para qué cliente es el lead
- Cliente: El lead se asigna automáticamente al `cliente_id` del usuario logueado

---

## 🗄️ Base de Datos (Supabase)

### Tabla: `leads`

**Campos relevantes:**
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  nombre VARCHAR,
  email VARCHAR,
  telefono VARCHAR,
  empresa VARCHAR,
  fuente VARCHAR NOT NULL,
  observaciones TEXT,
  contactado BOOLEAN DEFAULT FALSE,
  vendido BOOLEAN DEFAULT FALSE,
  fecha_ingreso TIMESTAMP DEFAULT NOW(),
  ...
);
```

### Tabla: `lead_historial`

**Registro de cambios:**
```sql
CREATE TABLE lead_historial (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  usuario VARCHAR NOT NULL,
  accion VARCHAR NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Seguridad

### Validación de Cliente_id

**En Admin:**
```typescript
if (!cliente_id) {
  return NextResponse.json(
    { error: 'cliente_id es requerido' },
    { status: 400 }
  )
}
```

**En Cliente:**
```typescript
if (!user?.cliente_id) {
  alert('⚠️ Error: No tienes un cliente asignado. Contacta al administrador.')
  return
}

// Se asigna automáticamente
body: JSON.stringify({
  ...nuevoLead,
  cliente_id: user.cliente_id
})
```

### Validación de Fuente

```typescript
if (!fuente) {
  return NextResponse.json(
    { error: 'fuente es requerida (email, whatsapp, zapier, meta)' },
    { status: 400 }
  )
}
```

---

## 📝 Fuentes de Leads

| Fuente | Valor | Ícono | Descripción |
|--------|-------|-------|-------------|
| Email | `"email"` | 📧 | Leads que llegan por correo electrónico |
| WhatsApp | `"whatsapp"` | 💬 | Leads que llegan por WhatsApp |
| Meta | `"meta"` | 📱 | Leads de Facebook/Instagram Ads |
| Zapier | `"zapier"` | ⚡ | Leads desde integraciones automáticas |

**Visualización en tabla:**
- Columna "Fuente" muestra el valor de la fuente
- Permite filtrar y analizar leads por origen
- ROAS y métricas se calculan por fuente

---

## 🧪 Testing

### Caso de Prueba 1: Admin crea lead para cliente

1. Login como admin
2. Ir a `/crm`
3. Clic en "+ Agregar Lead Manual"
4. Seleccionar cliente de la lista
5. Seleccionar fuente: "Email"
6. Llenar: Nombre, Email
7. Clic en "Crear Lead"
8. **Verificar:** Lead aparece en la tabla
9. **Verificar en DB:**
   ```sql
   SELECT * FROM leads WHERE fuente = 'email' ORDER BY fecha_ingreso DESC LIMIT 1;
   ```

### Caso de Prueba 2: Cliente crea lead propio

1. Login como cliente (username: `myp`, password: `mypcliente2025`)
2. Ir a `/crm/cliente/dashboard`
3. Clic en "+ Agregar Lead Manual" (botón verde en header de tabla)
4. Seleccionar fuente: "WhatsApp"
5. Llenar: Nombre, Teléfono
6. Clic en "Crear Lead"
7. **Verificar:** Lead aparece en la tabla
8. **Verificar en DB:**
   ```sql
   SELECT * FROM leads
   WHERE cliente_id = 'bf1b925e-8799-4db4-bd12-d12fbd106020'
   AND fuente = 'whatsapp'
   ORDER BY fecha_ingreso DESC LIMIT 1;
   ```

### Caso de Prueba 3: Validación de campos

1. Abrir modal de agregar lead
2. Intentar crear sin nombre, email NI teléfono
3. **Esperado:** Alert "Debes proporcionar al menos nombre, email o teléfono"
4. **Verificar:** No se crea el lead en DB

### Caso de Prueba 4: Historial de cambios

1. Crear un lead manual
2. Abrir el lead en "Editar"
3. Ir a la sección "Historial de Cambios"
4. **Verificar:** Aparece entrada "Lead creado manualmente desde [fuente]"
5. **Verificar en DB:**
   ```sql
   SELECT * FROM lead_historial WHERE accion = 'crear' ORDER BY created_at DESC LIMIT 1;
   ```

---

## 🚀 Deployment

### Archivos Modificados

```
app/api/crm/leads/route.ts              # Agregado método POST
app/crm/page.tsx                        # Modal + botón en admin
app/crm/cliente/dashboard/page.tsx      # Modal + botón en cliente
docs/AGREGAR-LEADS-MANUAL.md            # Esta documentación
```

### Comandos de Deploy

```bash
# 1. Commit
git add -A
git commit -m "Agregar leads manuales para clientes y admin con seguimiento de fuente"

# 2. Push
git push origin main

# 3. Auto-deploy en Vercel
# Vercel detecta el push y deploya automáticamente
# Verificar en: https://vercel.com/dashboard

# 4. Verificar en producción
# https://mulleryperez.cl/crm (admin)
# https://mulleryperez.cl/crm/cliente/dashboard (cliente)
```

---

## 📊 Métricas y Analytics

### Tracking por Fuente

El sistema permite analizar:
- Cuántos leads llegan por cada fuente
- Tasa de conversión por fuente
- ROI por fuente (si se asigna costo a cada lead)

**Query para analizar leads por fuente:**
```sql
SELECT
  fuente,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE contactado = true) as contactados,
  COUNT(*) FILTER (WHERE vendido = true) as vendidos,
  ROUND(AVG(monto_vendido), 2) as promedio_venta
FROM leads
WHERE cliente_id = 'bf1b925e-8799-4db4-bd12-d12fbd106020'
GROUP BY fuente
ORDER BY total_leads DESC;
```

---

## ❓ Preguntas Frecuentes

### ¿Por qué el cliente no puede seleccionar el cliente_id?

**R:** Por seguridad. Los clientes solo pueden agregar leads para su propia cuenta. El `cliente_id` se asigna automáticamente del usuario logueado.

### ¿Qué pasa si creo un lead sin email ni teléfono?

**R:** El sistema lo rechaza. Debe tener al menos uno de: nombre, email o teléfono.

### ¿Los leads manuales cuentan para las métricas?

**R:** Sí, todos los leads (automáticos y manuales) se incluyen en:
- Total Leads
- Tasa de Conversión
- ROAS y ROI
- CPF (si se divide inversión / total de leads)

### ¿Se puede cambiar la fuente de un lead después de crearlo?

**R:** No directamente desde la UI. Requeriría modificar la base de datos manualmente.

### ¿Los leads de Zapier se siguen recibiendo automáticamente?

**R:** Sí, este sistema es **adicional**. Los leads de Zapier siguen llegando automáticamente con fuente="zapier". Esta función es para agregar leads de otras fuentes que no están automatizadas.

---

## 🐛 Troubleshooting

### Error: "cliente_id es requerido"

**Causa:** El usuario cliente no tiene `cliente_id` asignado en la tabla `usuarios`

**Solución:**
```sql
UPDATE usuarios
SET cliente_id = 'UUID_DEL_CLIENTE'
WHERE username = 'nombre_usuario';
```

### Error: "Usuario no tiene cliente asignado"

**Causa:** La sesión en localStorage tiene `cliente_id = null`

**Solución:**
1. Logout del CRM
2. Login nuevamente
3. El sistema refrescará automáticamente el `cliente_id` desde Supabase

### Lead no aparece en la tabla

**Verificar:**
1. El lead se creó en la DB:
   ```sql
   SELECT * FROM leads ORDER BY fecha_ingreso DESC LIMIT 10;
   ```
2. El `cliente_id` coincide con el usuario logueado
3. Refrescar la página (F5)

---

## 📚 Referencias

- API Route: `/app/api/crm/leads/route.ts:92-168`
- Admin Component: `/app/crm/page.tsx:80-90, 323-365, 915-1070`
- Cliente Component: `/app/crm/cliente/dashboard/page.tsx:45-54, 260-320, 860-996`
- Supabase Schema: Ver migración `database/migrations/`

---

**Última actualización:** 2025-01-19
**Autor:** Claude Code + Christopher Muller
**Versión:** 1.0.0
