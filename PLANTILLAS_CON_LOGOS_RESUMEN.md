# 🎨 Sistema de Plantillas por Cliente con Logos

**Estado:** ✅ Fase 1 Completada (75%) - Listo para ejecutar SQL

---

## 📊 PROGRESO ACTUAL

### ✅ COMPLETADO (75%):

1. **Base de Datos** ✅
   - Script SQL completo: `database/04_PLANTILLAS_POR_CLIENTE.sql`
   - Bucket de Supabase Storage configurado
   - Funciones SQL para clonar y gestionar plantillas
   - Columnas agregadas a tablas

2. **Backend/APIs** ✅
   - `/api/crm/plantillas/clonar` - Clonar plantilla para cliente
   - `/api/crm/plantillas/logo` - Actualizar logo
   - `/api/crm/plantillas` (actualizado) - Soporte para logos y filtros

3. **Componentes** ✅
   - `LogoUploader.tsx` - Upload con validaciones completas
   - Validación de formato, tamaño, dimensiones
   - Preview en tiempo real
   - Drag & drop

4. **UI** ✅
   - `/crm/plantillas/crear-para-cliente` - Página completa
   - Flujo: Seleccionar base → Cliente → Personalizar con logo

### ⏳ PENDIENTE (25%):

5. **Integración en Cotizaciones** 🔲
   - Detectar plantilla del cliente automáticamente
   - Mostrar logo en interfaz de cotización

6. **Logo en PDF** 🔲
   - Agregar logo en header del PDF de cotización
   - Ajustar layout del PDF

---

## 🚀 PASO CRÍTICO: EJECUTAR SQL EN SUPABASE

### ⚠️ ANTES DE PROBAR EL SISTEMA:

**Debes ejecutar:** `database/04_PLANTILLAS_POR_CLIENTE.sql` en Supabase Dashboard

```bash
1. Ve a Supabase Dashboard → SQL Editor
2. Copia TODO el contenido de: 04_PLANTILLAS_POR_CLIENTE.sql
3. Pega y ejecuta (Run)
4. Verifica que no haya errores
```

**El script crea:**
- ✅ Bucket `plantillas-logos` en Storage
- ✅ Políticas de acceso (público read, autenticados write)
- ✅ Columnas nuevas en `plantillas_cotizacion`
- ✅ Columna nueva en `clientes`
- ✅ Funciones SQL para gestión
- ✅ Vista `v_plantillas_completas`

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Logo Requirements:
```
Formatos: PNG, JPG, JPEG, WebP
Tamaño: Máximo 500 KB
Dimensiones: 200x75px a 800x300px
Recomendado: 400x150px (horizontal)
Aspect Ratio: 1.5 a 6 (más ancho que alto)
```

### Almacenamiento:
```
Ubicación: Supabase Storage
Bucket: plantillas-logos
Límite Free Tier: 1 GB (suficiente para 2,000-5,000 logos)
Bandwidth: 2 GB/mes gratis
```

### Estructura de Archivos:
```
supabase-storage/
└── plantillas-logos/
    ├── cliente-{uuid}-{timestamp}.png
    └── plantilla-{id}-{timestamp}.png

URL Ejemplo:
https://PROJECT_ID.supabase.co/storage/v1/object/public/plantillas-logos/cliente-abc123-1699123456.png
```

---

## 💡 FLUJO COMPLETO DEL SISTEMA

### 1. Admin Crea Plantilla para Cliente:

```
1. Admin va a: /crm/plantillas/crear-para-cliente

2. Selecciona plantilla base:
   - Marketing Digital - Básico
   - Marketing Digital - Premium
   - Desarrollo Web - Landing Page
   - etc.

3. Selecciona cliente:
   - Lista desplegable con todos los clientes

4. Personaliza:
   - Nombre opcional (auto: "Base - Cliente")
   - Sube logo del cliente (PNG/JPG, 500 KB max)

5. Click "Crear Plantilla para Cliente"

6. Sistema ejecuta:
   - Clona plantilla base
   - Agrega logo personalizado
   - Asigna automáticamente al cliente
   - Guarda en BD: cliente.plantilla_asignada_id = nueva_plantilla.id
```

### 2. Cliente Crea Cotización (PRÓXIMO PASO):

```
1. Cliente inicia sesión
2. Va a: /crm/cotizaciones/nueva
3. Sistema automáticamente:
   - Detecta cliente_id del usuario logueado
   - Busca plantilla asignada
   - Precarga items de la plantilla
   - Muestra logo del cliente
4. Cliente completa detalles y genera cotización
```

### 3. Cotización con Logo (PRÓXIMO PASO):

```
Interfaz:
- Logo en header de la cotización
- Items predefinidos de la plantilla
- Diseño personalizado

PDF:
- Logo en header (esquina superior)
- Marca del cliente en todo el documento
- Items y precios
```

---

## 📁 ARCHIVOS CREADOS

### Base de Datos:
```
database/04_PLANTILLAS_POR_CLIENTE.sql
```

### APIs:
```
app/api/crm/plantillas/route.ts (actualizado)
app/api/crm/plantillas/clonar/route.ts (nuevo)
app/api/crm/plantillas/logo/route.ts (nuevo)
```

### Componentes:
```
app/components/crm/LogoUploader.tsx (nuevo)
```

### UI:
```
app/crm/plantillas/crear-para-cliente/page.tsx (nuevo)
```

---

## 🔧 FUNCIONES SQL DISPONIBLES

### 1. `clonar_plantilla_para_cliente()`
```sql
SELECT clonar_plantilla_para_cliente(
  p_plantilla_base_id := 1,
  p_cliente_id := 'uuid-del-cliente',
  p_nombre_personalizado := 'Plantilla Custom',
  p_logo_url := 'https://...',
  p_logo_filename := 'cliente-logo.png'
);

-- Retorna: ID de la nueva plantilla
-- Efecto: Asigna automáticamente al cliente
```

### 2. `actualizar_logo_plantilla()`
```sql
SELECT actualizar_logo_plantilla(
  p_plantilla_id := 5,
  p_logo_url := 'https://...',
  p_logo_filename := 'nuevo-logo.png'
);

-- Retorna: true
```

### 3. `obtener_plantilla_cliente()`
```sql
SELECT * FROM obtener_plantilla_cliente('uuid-del-cliente');

-- Retorna: Plantilla asignada o plantilla base por defecto
```

### 4. Vista: `v_plantillas_completas`
```sql
SELECT * FROM v_plantillas_completas;

-- Retorna: Todas las plantillas con info de cliente y tipo
```

---

## 🎯 PRÓXIMOS PASOS (Para completar 100%)

### Paso 5: Integrar en Sistema de Cotizaciones

**Ubicación:** `app/crm/cotizaciones/nueva/page.tsx`

**Cambios necesarios:**
```typescript
// 1. Al cargar página, obtener plantilla del cliente
useEffect(() => {
  if (user?.cliente_id) {
    const plantilla = await fetch(
      `/api/crm/plantillas/cliente/${user.cliente_id}`
    )

    // Precargar items de la plantilla
    setItems(plantilla.items_default)

    // Guardar logo para mostrar
    setClienteLogo(plantilla.logo_url)
  }
}, [user])

// 2. Mostrar logo en header de cotización
{clienteLogo && (
  <Image
    src={clienteLogo}
    alt="Logo cliente"
    width={400}
    height={150}
  />
)}
```

### Paso 6: Logo en PDF de Cotización

**Ubicación:** Componente de generación de PDF (buscar en codebase)

**Cambios necesarios:**
```typescript
// Agregar logo en header del PDF
pdf.addImage(logoUrl, 'PNG', 20, 10, 80, 30)

// Ajustar espaciado para el resto del contenido
// Empezar después del logo (Y = 50 en lugar de 20)
```

---

## 🧪 TESTING

### 1. Probar Upload de Logo:
```
1. Ir a: /crm/plantillas/crear-para-cliente
2. Seleccionar plantilla base
3. Seleccionar cliente
4. Arrastrar archivo PNG de 300 KB
5. Verificar preview
6. Crear plantilla
7. Verificar en Supabase Storage que el archivo existe
```

### 2. Verificar en Base de Datos:
```sql
-- Ver plantillas con logos
SELECT
  id,
  nombre,
  es_base,
  cliente_id,
  logo_url
FROM plantillas_cotizacion
ORDER BY es_base DESC, nombre;

-- Ver clientes con plantilla asignada
SELECT
  c.nombre,
  c.plantilla_asignada_id,
  p.nombre as plantilla_nombre,
  p.logo_url
FROM clientes c
LEFT JOIN plantillas_cotizacion p ON c.plantilla_asignada_id = p.id;
```

### 3. Probar API:
```bash
# Listar plantillas base
curl http://localhost:3000/api/crm/plantillas?tipo=base

# Listar plantillas de cliente
curl http://localhost:3000/api/crm/plantillas?tipo=cliente

# Clonar plantilla (POST)
curl -X POST http://localhost:3000/api/crm/plantillas/clonar \
  -H "Content-Type: application/json" \
  -d '{
    "plantilla_base_id": 1,
    "cliente_id": "uuid-cliente",
    "logo_url": "https://..."
  }'
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Bucket plantillas-logos does not exist"
**Solución:** Ejecutar el script SQL 04_PLANTILLAS_POR_CLIENTE.sql

### Error: "Column logo_url does not exist"
**Solución:** Ejecutar el script SQL completo, no parcialmente

### Error: "Function clonar_plantilla_para_cliente does not exist"
**Solución:** Verificar que el script SQL se ejecutó sin errores

### Error al subir imagen: "413 Payload Too Large"
**Solución:** La imagen excede 500 KB, comprímela

### Error: "Invalid dimensions"
**Solución:** Redimensiona la imagen a 200x75px - 800x300px

---

## 💰 COSTOS PROYECTADOS

### Almacenamiento Actual (Supabase Free):
```
Storage: 1 GB gratis
→ Suficiente para ~5,000 logos de 200 KB
→ Costo adicional: $0.021/GB/mes

Bandwidth: 2 GB/mes gratis
→ ~10,000 visualizaciones de logos/mes
→ Costo adicional: $0.09/GB
```

### Plan PRO ($25/mes) recomendado cuando:
- Más de 100 clientes con logos
- Más de 50,000 visualizaciones/mes
- Necesiten backup automático

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de considerar el sistema completo:

- [ ] Script SQL ejecutado sin errores en Supabase
- [ ] Bucket `plantillas-logos` creado en Storage
- [ ] Puedo subir un logo de prueba
- [ ] Logo aparece en preview
- [ ] Plantilla se clona correctamente
- [ ] Cliente tiene plantilla asignada
- [ ] Logo se integra en cotizaciones (PENDIENTE)
- [ ] Logo aparece en PDF de cotización (PENDIENTE)

---

## 📞 SIGUIENTE SESIÓN

**Prioridad:** Completar integración en cotizaciones

1. Detectar automáticamente plantilla del cliente al cotizar
2. Precargar items de la plantilla
3. Mostrar logo en interfaz de cotización
4. Agregar logo en PDF generado

**Tiempo estimado:** 30-45 minutos

---

**Todo el código está commiteado y pusheado a GitHub** ✅
