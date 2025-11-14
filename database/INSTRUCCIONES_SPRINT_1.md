# INSTRUCCIONES DE INSTALACIÓN - SPRINT 1

## Resumen de Cambios

El SPRINT 1 implementa 4 funcionalidades críticas para el CRM:

1. **Gestión de Contraseñas** (Módulo Admin)
2. **Planes M&P** (Silver, Gold, Platinum)
3. **Historial de Cambios** (Módulo Cliente)
4. **Filtros de Fecha** (Dashboard Cliente)

---

## Pasos de Instalación

### 1. Ejecutar Migraciones SQL en Supabase

Ejecuta los siguientes archivos SQL en el **SQL Editor** de Supabase, en este orden:

#### Migración 08: Planes M&P
```bash
database/08_PLANES_MYP.sql
```

**Qué hace:**
- Crea tabla `planes_myp` con 3 planes predefinidos (Silver, Gold, Platinum)
- Inserta datos seed con servicios y precios
- Crea índices para búsquedas optimizadas
- Agrega trigger para actualizar timestamps

**Verificación:**
Después de ejecutar, verifica que los planes se crearon correctamente:
```sql
SELECT nombre, precio_base, jsonb_array_length(items_incluidos) as num_items
FROM planes_myp;
```

Deberías ver:
- Silver: $450,000 (5 items)
- Gold: $750,000 (6 items)
- Platinum: $1,200,000 (7 items)

---

#### Migración 09: Tablas de Auditoría
```bash
database/09_HISTORIAL_AUDITS.sql
```

**Qué hace:**
- Crea tabla `lead_historial` (si no existe)
- Crea tabla `cotizaciones_audits` para auditoría de cotizaciones
- Crea índices para consultas rápidas
- Agrega función helper `create_lead_historial_table()`

**Verificación:**
```sql
-- Verificar que las tablas existen
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('lead_historial', 'cotizaciones_audits');
```

---

### 2. Verificar APIs Creadas

Las siguientes APIs se crearon automáticamente:

#### API de Planes M&P
- **GET** `/api/crm/planes-myp` - Listar todos los planes activos
- **GET** `/api/crm/planes-myp?id={id}` - Obtener plan específico
- **POST** `/api/crm/planes-myp` - Crear nuevo plan (admin)
- **PATCH** `/api/crm/planes-myp` - Actualizar plan (admin)
- **DELETE** `/api/crm/planes-myp?id={id}` - Desactivar plan (soft delete)

#### API de Historial de Cotizaciones
- **GET** `/api/crm/cotizaciones/historial?cliente_id={uuid}` - Obtener historial
- **POST** `/api/crm/cotizaciones/historial` - Registrar cambio en auditoría

---

### 3. Acceder a las Nuevas Páginas

#### Para Administradores:

**Gestión de Contraseñas**
```
URL: /crm/contraseñas
Acceso: Solo usuarios con rol "admin"
```

Funcionalidades:
- Lista todos los usuarios (admin y clientes)
- Muestra: ID, username, nombre, rol, cliente asignado, última actualización
- Botón "Reset Password" para cada usuario
- Modal con validación de contraseña (mínimo 8 caracteres)
- Confirmación de éxito al actualizar

---

#### Para Clientes:

**Historial de Cambios**
```
URL: /crm/cliente/historial
Acceso: Solo usuarios con rol "cliente"
```

Funcionalidades:
- 2 pestañas: "Historial de Leads" y "Historial de Cotizaciones"
- Filtros por fecha (desde/hasta)
- Filtro por lead específico (nombre/email)
- Filtro por estado (cotizaciones)
- Paginación: 50 registros por página
- Muestra: fecha, usuario, acción, cambios realizados

---

**Dashboard Cliente con Filtros**
```
URL: /crm/cliente/dashboard
Acceso: Solo usuarios con rol "cliente"
```

Nuevas funcionalidades:
- Card de filtros de fecha al inicio del dashboard
- DatePicker "Desde" (default: hace 30 días)
- DatePicker "Hasta" (default: hoy)
- Botón "Aplicar Filtros"
- Botón "Limpiar" (resetear a últimos 30 días)
- Indicador visual cuando los filtros están activos
- Todas las métricas se recalculan según el rango de fechas seleccionado

---

**Nueva Cotización con Planes M&P**
```
URL: /crm/cotizaciones/nueva
Acceso: Usuarios admin
```

Nuevas funcionalidades:
- Dropdown "Usar Plan M&P" al inicio del formulario
- Muestra Silver, Gold, Platinum con precio total
- Al seleccionar plan, auto-llena items con los del plan
- Los items son editables después de cargar el plan
- Botón "Limpiar y empezar de cero"
- Mantiene compatibilidad con plantillas personalizadas

---

## 4. Testing

### Probar Gestión de Contraseñas:
1. Iniciar sesión como admin
2. Ir a `/crm/contraseñas`
3. Hacer clic en "Reset Password" de cualquier usuario
4. Ingresar nueva contraseña (mínimo 8 caracteres)
5. Confirmar contraseña
6. Verificar que se actualiza correctamente

### Probar Planes M&P:
1. Ir a `/crm/cotizaciones/nueva`
2. Seleccionar plan Silver, Gold o Platinum
3. Verificar que los items se llenan automáticamente
4. Editar algún item
5. Probar botón "Limpiar y empezar de cero"
6. Crear cotización y verificar guardado

### Probar Historial:
1. Iniciar sesión como cliente
2. Ir a `/crm/cliente/historial`
3. Probar pestaña "Historial de Leads"
4. Aplicar filtros de fecha
5. Probar pestaña "Historial de Cotizaciones"
6. Verificar paginación

### Probar Filtros de Fecha:
1. Iniciar sesión como cliente
2. Ir a `/crm/cliente/dashboard`
3. Cambiar fecha "Desde" y "Hasta"
4. Hacer clic en "Aplicar Filtros"
5. Verificar que las métricas cambian
6. Hacer clic en "Limpiar"
7. Verificar que vuelve a últimos 30 días

---

## 5. Configuración de Permisos (RLS en Supabase)

Si tienes Row Level Security (RLS) habilitado, asegúrate de que las nuevas tablas tengan políticas:

```sql
-- Permitir lectura de planes_myp para usuarios autenticados
CREATE POLICY "planes_myp_select" ON planes_myp FOR SELECT USING (true);

-- Permitir todo en cotizaciones_audits (tabla de auditoría)
ALTER TABLE cotizaciones_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cotizaciones_audits_all" ON cotizaciones_audits FOR ALL USING (true);

-- Permitir todo en lead_historial (tabla de auditoría)
ALTER TABLE lead_historial ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lead_historial_all" ON lead_historial FOR ALL USING (true);
```

---

## 6. Variables de Entorno

Verifica que tu archivo `.env.local` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://faitwrutauavjwnsnlzq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

---

## Archivos Creados

### Páginas (Frontend):
1. `/app/crm/contraseñas/page.tsx` - Gestión de contraseñas (admin)
2. `/app/crm/cliente/historial/page.tsx` - Historial con tabs (cliente)

### APIs (Backend):
1. `/app/api/crm/planes-myp/route.ts` - CRUD de planes M&P
2. `/app/api/crm/cotizaciones/historial/route.ts` - Auditoría de cotizaciones

### Migraciones SQL:
1. `/database/08_PLANES_MYP.sql` - Tabla de planes predefinidos
2. `/database/09_HISTORIAL_AUDITS.sql` - Tablas de auditoría

### Modificaciones:
1. `/app/crm/cotizaciones/nueva/page.tsx` - Agregado dropdown de planes M&P
2. `/app/crm/cliente/dashboard/page.tsx` - Agregados filtros de fecha

---

## Troubleshooting

### Error: "Table planes_myp does not exist"
- Ejecuta la migración `08_PLANES_MYP.sql` en Supabase

### Error: "Table cotizaciones_audits does not exist"
- Ejecuta la migración `09_HISTORIAL_AUDITS.sql` en Supabase

### No aparecen los planes en la página de cotizaciones
- Verifica que la API `/api/crm/planes-myp` responda correctamente
- Abre DevTools > Network y verifica la respuesta

### El historial no se guarda
- Las tablas de historial tienen manejo de errores graceful
- Revisa los logs del servidor para ver detalles del error
- Verifica que las tablas existan en Supabase

---

## Próximos Pasos (SPRINT 2)

Si todo funciona correctamente, el SPRINT 1 está completo. Los próximos desarrollos incluirán:
- Reportes avanzados
- Integraciones externas
- Automatizaciones
- Dashboard analytics mejorado

---

**Fecha de implementación:** 2025-11-13
**Desarrollador:** Sistema CRM - Claude Code
**Status:** COMPLETADO ✅
