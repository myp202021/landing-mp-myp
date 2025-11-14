# ⚡ EJECUTAR MIGRACIONES SQL EN SUPABASE

## 📋 ESTADO ACTUAL

- ✅ SQL copiado al portapapeles (617 líneas)
- ✅ Supabase SQL Editor abierto
- ⏳ **Acción requerida:** Pegar y ejecutar

---

## 🎯 PASOS PARA EJECUTAR (2 minutos)

### 1. Verificar que el SQL Editor esté abierto
URL: https://supabase.com/dashboard/project/faitwrutauavjwnsnlzq/sql/new

### 2. Pegar el SQL
Presiona **Cmd+V** en el editor

Deberías ver ~617 líneas de SQL divididas en 4 secciones:
```sql
-- ==================================================================
-- MIGRACIÓN 08: PLANES M&P (Silver, Gold, Platinum)
-- ==================================================================

-- ==================================================================
-- MIGRACIÓN 09: HISTORIAL DE AUDITS
-- ==================================================================

-- ==================================================================
-- MIGRACIÓN 10: RESPUESTAS AUTOMÁTICAS
-- ==================================================================

-- ==================================================================
-- MIGRACIÓN 11: INTEGRACIONES LOG
-- ==================================================================
```

### 3. Ejecutar
Click en botón **"Run"** (verde, esquina superior derecha)

### 4. Esperar
El proceso toma ~30 segundos. Verás mensajes de "Success" al finalizar.

---

## ✅ VERIFICACIÓN POST-EJECUCIÓN

Después de ejecutar, verifica que todo funcionó ejecutando estos queries:

### 1. Verificar Planes M&P
```sql
SELECT
  nombre,
  precio_base,
  jsonb_array_length(items_incluidos) as num_items,
  activo
FROM planes_myp
ORDER BY precio_base ASC;
```

**Resultado esperado:** 3 filas (Silver, Gold, Platinum)

### 2. Verificar Tablas Creadas
```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'planes_myp',
    'respuestas_automaticas',
    'emails_enviados',
    'integraciones_log',
    'integraciones_config',
    'cotizaciones_audits'
  )
ORDER BY tablename;
```

**Resultado esperado:** 6 tablas

### 3. Verificar Triggers
```sql
SELECT
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN (
    'trg_nuevo_lead_respuesta_auto',
    'trg_respuestas_updated',
    'trg_integraciones_config_updated'
  );
```

**Resultado esperado:** 3 triggers

---

## 🗄️ LO QUE SE CREARÁ

### **MIGRACIÓN 08: Planes M&P**
- ✅ Tabla `planes_myp` con 3 planes predefinidos
- ✅ Trigger para actualizar timestamps

**Planes incluidos:**
1. **Silver** - $450,000 (5 servicios)
2. **Gold** - $750,000 (6 servicios)
3. **Platinum** - $1,200,000 (7 servicios)

---

### **MIGRACIÓN 09: Historial de Audits**
- ✅ Tabla `lead_historial` (para futuro uso)
- ✅ Tabla `cotizaciones_audits` con índices

---

### **MIGRACIÓN 10: Respuestas Automáticas**
- ✅ Tabla `respuestas_automaticas`
- ✅ Tabla `emails_enviados`
- ✅ Función `trigger_respuesta_automatica_nuevo_lead()`
- ✅ Trigger automático en INSERT de leads
- ✅ Políticas RLS para seguridad

**Sistema de variables:**
- {nombre}, {apellido}, {email}, {telefono}, {empresa}

---

### **MIGRACIÓN 11: Integraciones Log**
- ✅ Tabla `integraciones_log`
- ✅ Tabla `integraciones_config`
- ✅ Función `registrar_integracion_evento()`
- ✅ Vista `v_resumen_integraciones`
- ✅ 6 columnas nuevas en tabla `clientes`:
  - `zapier_webhook_url`
  - `zapier_activo`
  - `google_ads_activo`
  - `google_ads_customer_id`
  - `meta_ads_activo`
  - `meta_ads_account_id`

---

## ⚠️ SI HAY ERRORES

### Error: "already exists"
**Solución:** Ignorar. Significa que la tabla/función ya existe.

### Error: "permission denied"
**Solución:** Verificar que estés logueado como owner del proyecto.

### Error: "syntax error"
**Solución:**
1. Volver a copiar el SQL: `cat /tmp/migraciones_completas.sql | pbcopy`
2. Pegar nuevamente
3. Ejecutar

---

## 📊 ARCHIVO SQL

**Ubicación:** `/tmp/migraciones_completas.sql`
**Tamaño:** 617 líneas
**Archivos origen:**
1. `database/08_PLANES_MYP.sql`
2. `database/09_HISTORIAL_AUDITS.sql`
3. `database/10_RESPUESTAS_AUTOMATICAS.sql`
4. `database/11_INTEGRACIONES_LOG.sql`

---

## 🚀 DESPUÉS DE EJECUTAR

Una vez ejecutado el SQL, el CRM estará **100% funcional** con:

- ✅ Planes M&P disponibles en cotizaciones
- ✅ Sistema de respuestas automáticas activo
- ✅ Historial de integraciones funcionando
- ✅ Wizard de Zapier operativo
- ✅ Todas las funcionalidades de FASE 1

---

## 🎯 SIGUIENTE PASO

Después de ejecutar el SQL:

1. Ir a: https://www.mulleryperez.cl/crm/login
2. Login como admin
3. Probar:
   - Ir a `/crm/contraseñas`
   - Ir a `/crm/cotizaciones/nueva` → Verificar planes M&P
   - Ir a `/crm/historial-integraciones`
   - Ir a `/crm/integraciones` → Configurar Zapier para un cliente

4. Login como cliente
5. Probar:
   - Ir a `/crm/cliente/plantillas` → Crear plantilla
   - Ir a `/crm/cliente/respuestas-automaticas` → Crear respuesta
   - Ir a `/crm/cliente/historial` → Ver historial
   - Ir a `/crm/cliente/cotizaciones/nueva` → Crear cotización

---

**Si todo funciona correctamente, ¡FASE 1 COMPLETADA AL 100%! 🎉**

---

**Generado:** 13 de Noviembre 2025
**Archivo SQL:** /tmp/migraciones_completas.sql
**Estado:** ⏳ Esperando ejecución manual
