# SPRINT 4: WIZARD ZAPIER E HISTORIAL DE INTEGRACIONES

## Resumen de Implementación

Este sprint implementa un sistema completo de gestión de integraciones con Zapier, incluyendo:

1. ✅ Migración SQL para historial de integraciones
2. ✅ API REST para gestión de historial
3. ✅ Wizard paso a paso para configuración de Zapier
4. ✅ Página de historial con filtros y métricas
5. ✅ Página de integraciones mejorada con tabla de clientes

---

## Archivos Creados

### 1. Migración SQL
- **Archivo:** `/database/11_INTEGRACIONES_LOG.sql`
- **Tamaño:** 7.0 KB
- **Descripción:** Crea tablas, índices, funciones y vistas para el sistema de integraciones

### 2. API de Historial
- **Archivo:** `/app/api/crm/integraciones/historial/route.ts`
- **Tamaño:** 3.1 KB
- **Endpoints:**
  - `GET /api/crm/integraciones/historial` - Listar eventos
  - `POST /api/crm/integraciones/historial` - Registrar evento

### 3. Wizard de Zapier
- **Archivo:** `/app/crm/integraciones/zapier/[clienteId]/page.tsx`
- **Tamaño:** 28 KB
- **Funcionalidad:** Wizard de 4 pasos para configurar Zapier

### 4. Página de Historial
- **Archivo:** `/app/crm/historial-integraciones/page.tsx`
- **Tamaño:** 20 KB
- **Funcionalidad:** Vista completa de eventos con filtros y métricas

### 5. Archivo Modificado
- **Archivo:** `/app/crm/integraciones/page.tsx`
- **Cambios:**
  - Tabla de clientes con estado de integración
  - Botones de configuración/reconfiguración
  - Resumen de integraciones activas
  - Enlace a historial por cliente

---

## Instrucciones de Ejecución

### Paso 1: Ejecutar Migración SQL

Conectarse a Supabase y ejecutar el archivo SQL:

```bash
# Opción 1: Desde Supabase Dashboard
1. Ir a: https://faitwrutauavjwnsnlzq.supabase.co/project/_/sql
2. Copiar el contenido de: /database/11_INTEGRACIONES_LOG.sql
3. Pegar en el editor SQL
4. Ejecutar

# Opción 2: Desde CLI (si tienes supabase CLI instalado)
cd /Users/christophermuller/google-ads-automation/landing-mp-myp
supabase db execute -f database/11_INTEGRACIONES_LOG.sql
```

### Paso 2: Verificar Migración

Ejecutar estas consultas para verificar:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('integraciones_log', 'integraciones_config');

-- Verificar columnas en clientes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'clientes'
AND column_name LIKE '%zapier%';

-- Verificar función creada
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'registrar_integracion_evento';

-- Verificar vista creada
SELECT table_name FROM information_schema.views
WHERE table_name = 'v_resumen_integraciones';
```

### Paso 3: Reiniciar Aplicación

```bash
# Si la app está corriendo, reiniciarla
cd /Users/christophermuller/google-ads-automation/landing-mp-myp
npm run dev
```

### Paso 4: Probar Funcionalidades

1. **Ir a Integraciones:**
   - URL: http://localhost:3000/crm/integraciones
   - Verificar que aparece la tabla de clientes
   - Verificar resumen de integraciones activas

2. **Configurar Zapier para un Cliente:**
   - Click en "Configurar" en cualquier cliente
   - URL: http://localhost:3000/crm/integraciones/zapier/[ID_CLIENTE]
   - Seguir los 4 pasos del wizard
   - Probar generación de webhook URL
   - Realizar test de lead

3. **Ver Historial:**
   - URL: http://localhost:3000/crm/historial-integraciones
   - Verificar filtros funcionan
   - Verificar métricas se calculan
   - Probar exportar CSV

---

## Estructura de Base de Datos

### Tabla: integraciones_log

| Campo        | Tipo        | Descripción                                    |
|--------------|-------------|------------------------------------------------|
| id           | SERIAL      | ID autoincremental                             |
| cliente_id   | UUID        | FK a clientes(id)                              |
| tipo         | TEXT        | zapier, google_ads, meta_ads                   |
| accion       | TEXT        | activado, desactivado, configurado, error, etc |
| descripcion  | TEXT        | Descripción del evento                         |
| metadata     | JSONB       | Datos adicionales en JSON                      |
| webhook_url  | TEXT        | URL del webhook (si aplica)                    |
| user_id      | INTEGER     | FK a usuarios(id)                              |
| creado_en    | TIMESTAMPTZ | Timestamp automático                           |

### Tabla: integraciones_config

| Campo          | Tipo        | Descripción                    |
|----------------|-------------|--------------------------------|
| id             | SERIAL      | ID autoincremental             |
| cliente_id     | UUID        | FK a clientes(id)              |
| tipo           | TEXT        | Tipo de integración            |
| activo         | BOOLEAN     | Estado de la integración       |
| config         | JSONB       | Configuración específica       |
| creado_en      | TIMESTAMPTZ | Timestamp de creación          |
| actualizado_en | TIMESTAMPTZ | Timestamp de última actualización |

### Columnas Agregadas a: clientes

| Campo                | Tipo    | Descripción                           |
|----------------------|---------|---------------------------------------|
| zapier_webhook_url   | TEXT    | URL del webhook de Zapier             |
| zapier_activo        | BOOLEAN | Indica si Zapier está activo          |
| google_ads_activo    | BOOLEAN | Indica si Google Ads está activo      |
| google_ads_customer_id | TEXT  | ID de cliente de Google Ads           |
| meta_ads_activo      | BOOLEAN | Indica si Meta Ads está activo        |
| meta_ads_account_id  | TEXT    | ID de cuenta publicitaria de Meta     |

---

## Endpoints API

### GET /api/crm/integraciones/historial

**Query Parameters:**
- `cliente_id` (opcional): UUID del cliente
- `tipo` (opcional): zapier | google_ads | meta_ads
- `accion` (opcional): activado | desactivado | configurado | error | test_exitoso | test_fallido
- `limit` (opcional): Número de registros (default: 100)
- `offset` (opcional): Offset para paginación (default: 0)

**Respuesta:**
```json
{
  "historial": [
    {
      "id": 1,
      "cliente_id": "uuid",
      "tipo": "zapier",
      "accion": "activado",
      "descripcion": "Integración activada",
      "metadata": {},
      "webhook_url": "https://...",
      "user_id": 1,
      "creado_en": "2025-11-13T22:00:00Z",
      "clientes": { "nombre": "Cliente X" },
      "usuarios": { "nombre": "Admin", "username": "admin" }
    }
  ],
  "total": 150,
  "limit": 100,
  "offset": 0
}
```

### POST /api/crm/integraciones/historial

**Body:**
```json
{
  "cliente_id": "uuid",
  "tipo": "zapier",
  "accion": "activado",
  "descripcion": "Descripción del evento",
  "metadata": { "key": "value" },
  "webhook_url": "https://...",
  "user_id": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "evento": {
    "id": 1,
    "cliente_id": "uuid",
    "tipo": "zapier",
    "accion": "activado",
    "descripcion": "Descripción del evento",
    "metadata": { "key": "value" },
    "webhook_url": "https://...",
    "user_id": 1,
    "creado_en": "2025-11-13T22:00:00Z"
  }
}
```

---

## Funcionalidades del Wizard Zapier

### Paso 1: Introducción
- Explicación de qué es Zapier
- Beneficios de la integración
- Requisitos previos
- Tiempo estimado

### Paso 2: Generar Webhook
- Genera URL única del webhook
- Formato: `https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id={uuid}`
- Botón copiar al portapapeles
- Confirmación visual al copiar

### Paso 3: Instrucciones de Configuración
- Paso a paso detallado para configurar Zapier
- Instrucciones para Facebook Lead Ads
- Configuración de Webhook
- Mapeo de campos requeridos

### Paso 4: Prueba y Activación
- Formulario de prueba con 3 campos:
  - Nombre
  - Email
  - Teléfono
- Envío de lead de prueba
- Verificación automática (polling cada 2s por 30s)
- Estados: idle → sending → checking → success/error
- Registro en historial del resultado
- Botón de activación final
- Actualización de cliente en BD
- Redirect a /crm/integraciones

---

## Funcionalidades de Historial de Integraciones

### Métricas Principales
- Total Eventos
- Integraciones Activas
- Eventos Hoy
- Errores Hoy

### Filtros Disponibles
- Cliente (dropdown de todos los clientes)
- Tipo (Zapier, Google Ads, Meta Ads)
- Acción (activado, desactivado, configurado, error, test_exitoso, test_fallido)
- Botón "Limpiar Filtros"

### Tabla de Eventos
Columnas:
- Fecha/Hora (formato: DD/MM/YYYY HH:mm)
- Cliente (nombre)
- Tipo (con icono)
- Acción (badge colorido)
- Descripción (truncada)
- Usuario (quien realizó la acción)
- Acciones (botón "Ver Detalles")

### Modal de Detalles
- Todos los campos del evento
- Metadata en formato JSON con syntax highlighting
- Webhook URL (si aplica)
- Información del usuario
- Botón cerrar

### Paginación
- 50 registros por página
- Botones "Anterior" y "Siguiente"
- Indicador de página actual

### Exportar CSV
- Genera CSV con todos los campos
- Nombre del archivo: `historial-integraciones-YYYY-MM-DD.csv`

---

## Ejemplo de URL de Webhook Generada

```
https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=550e8400-e29b-41d4-a716-446655440000
```

**Estructura:**
- Base URL: `https://www.mulleryperez.cl/api/webhooks/meta-leads`
- Query Parameter: `cliente_id={UUID_DEL_CLIENTE}`

**Uso:**
Esta URL debe ser configurada en Zapier como endpoint del Webhook para que los leads de Facebook Lead Ads lleguen automáticamente al CRM.

---

## Tipos de Acciones Registradas

| Acción        | Color  | Descripción                                   |
|---------------|--------|-----------------------------------------------|
| activado      | Verde  | Integración fue activada                      |
| desactivado   | Gris   | Integración fue desactivada                   |
| configurado   | Azul   | Integración fue configurada (sin activar)     |
| error         | Rojo   | Ocurrió un error en la integración            |
| test_exitoso  | Esmeralda | Test de conexión fue exitoso               |
| test_fallido  | Naranja | Test de conexión falló                       |

---

## Seguridad

- ✅ Protección de rutas: Solo rol "admin" puede acceder
- ✅ Validación de inputs en API
- ✅ Registro de usuario que realiza cada acción
- ✅ Foreign keys con ON DELETE CASCADE/SET NULL
- ✅ Índices para optimizar consultas

---

## Próximos Pasos Sugeridos

1. **Implementar notificaciones:**
   - Enviar email cuando falla una integración
   - Alertas en dashboard para errores

2. **Dashboard de integraciones:**
   - Gráficos de eventos por día
   - Tendencias de actividad
   - Alertas de anomalías

3. **Google Ads Integration:**
   - Similar wizard para Google Ads
   - Sincronización de métricas
   - Cálculo automático de ROI

4. **Meta Business Integration:**
   - Wizard para Meta Ads
   - Sincronización de campañas
   - Métricas de rendimiento

5. **Webhooks avanzados:**
   - Reintentos automáticos en caso de fallo
   - Cola de procesamiento
   - Rate limiting

---

## Testing

### Pruebas Recomendadas

1. **Test de Migración:**
```sql
-- Insertar evento de prueba
SELECT registrar_integracion_evento(
  (SELECT id FROM clientes LIMIT 1),
  'zapier',
  'test_exitoso',
  'Evento de prueba',
  '{"test": true}'::jsonb,
  'https://example.com/webhook',
  1
);

-- Verificar inserción
SELECT * FROM integraciones_log ORDER BY creado_en DESC LIMIT 1;

-- Verificar vista
SELECT * FROM v_resumen_integraciones;
```

2. **Test de API:**
```bash
# GET historial
curl http://localhost:3000/api/crm/integraciones/historial?limit=10

# POST evento
curl -X POST http://localhost:3000/api/crm/integraciones/historial \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "UUID_CLIENTE",
    "tipo": "zapier",
    "accion": "configurado",
    "descripcion": "Test desde curl"
  }'
```

3. **Test de Wizard:**
- Navegar a `/crm/integraciones`
- Seleccionar un cliente
- Completar los 4 pasos del wizard
- Verificar que se guarda el webhook URL
- Verificar que se registra en historial

---

## Solución de Problemas

### Error: "Tabla integraciones_log no existe"
- Ejecutar migración SQL

### Error: "Cliente no encontrado" en wizard
- Verificar que el clienteId en la URL es válido
- Verificar que el cliente existe en la BD

### Error: "No se detectó el lead" en test
- Verificar que el webhook endpoint está accesible
- Verificar que Zapier está configurado correctamente
- Revisar logs del servidor

### Historial no muestra datos
- Verificar que hay eventos registrados: `SELECT COUNT(*) FROM integraciones_log;`
- Verificar filtros aplicados
- Revisar consola del navegador para errores de API

---

## Changelog

### v1.0.0 - 2025-11-13
- ✅ Creada migración SQL completa
- ✅ Implementada API de historial
- ✅ Creado wizard de Zapier con 4 pasos
- ✅ Implementada página de historial con filtros
- ✅ Mejorada página principal de integraciones
- ✅ Agregadas métricas y resúmenes
- ✅ Implementado sistema de exportación CSV
- ✅ Agregada protección de rutas por rol

---

## Contacto

Para soporte o consultas sobre este sprint:
- Desarrollado por: Claude Code (Anthropic)
- Fecha: 2025-11-13
- Proyecto: CRM Muller & Pérez
