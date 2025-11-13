# 📋 Sistema de Cotizaciones Mercator - Resumen Completo

## 📌 ¿Qué se implementó?

Se creó un **sistema completo de cotizaciones online** para Mercator Group que incluye:

1. ✅ **Base de datos** para almacenar cotizaciones e items
2. ✅ **API RESTful** para CRUD de cotizaciones
3. ✅ **Formulario web** editable para crear cotizaciones
4. ✅ **Histórico** de todas las cotizaciones creadas
5. ✅ **Generación de PDF** con formato idéntico al Excel
6. ✅ **Funcionalidad de duplicar** cotizaciones
7. ✅ **Cálculo automático** de totales

---

## 📂 Archivos Creados

### 1. Base de Datos
**Archivo:** `cotizaciones/supabase-cotizaciones-mercator.sql`

```sql
-- Tablas creadas:
- cotizaciones_mercator (tabla principal)
- cotizacion_items (productos de cada cotización)

-- Triggers automáticos:
- Cálculo automático de precio_fob_total por item
- Actualización automática del total de la cotización
- Timestamp updated_at
```

**Para ejecutar:**
1. Ve a tu proyecto Supabase: https://supabase.com/dashboard/project/YOUR_PROJECT
2. Ve a SQL Editor
3. Copia y pega el contenido de `supabase-cotizaciones-mercator.sql`
4. Ejecuta el script

### 2. API Endpoints
**Archivo:** `app/api/cotizaciones/route.ts`

**Endpoints disponibles:**
- `GET /api/cotizaciones` - Listar todas las cotizaciones
- `POST /api/cotizaciones` - Crear nueva cotización
- `PATCH /api/cotizaciones` - Actualizar cotización existente
- `DELETE /api/cotizaciones?id=XXX` - Eliminar cotización

### 3. Páginas Web

#### a) Formulario de Nueva Cotización
**Ruta:** `/cotizador`
**Archivo:** `app/cotizador/page.tsx`

**Características:**
- Formulario completo con todos los campos
- Agregar/eliminar productos dinámicamente
- Cálculo automático de totales
- Validación de campos requeridos

#### b) Histórico de Cotizaciones
**Ruta:** `/cotizador/historico`
**Archivo:** `app/cotizador/historico/page.tsx`

**Características:**
- Lista todas las cotizaciones ordenadas por fecha
- Muestra resumen de cada cotización
- Botones para: Ver PDF, Duplicar, Eliminar
- Preview de productos incluidos

#### c) Vista PDF
**Ruta:** `/cotizador/pdf/[id]`
**Archivo:** `app/cotizador/pdf/[id]/page.tsx`

**Características:**
- Formato idéntico al Excel original
- Botón "Generar PDF" (usa Ctrl+P o Cmd+P)
- Header con N° cotización, cliente, página
- Logo Mercator Group
- Tablas de información general y proveedor
- Tabla de productos con todas las columnas
- Total en USD FOB
- Condiciones de pago y notas
- Footer corporativo

---

## 🚀 Cómo Usar el Sistema

### 1. Primera vez: Ejecutar SQL
```bash
# Ve a Supabase SQL Editor y ejecuta:
cotizaciones/supabase-cotizaciones-mercator.sql
```

### 2. Acceder al sistema
```
# Crear nueva cotización:
https://mulleryperez.cl/cotizador

# Ver histórico:
https://mulleryperez.cl/cotizador/historico
```

### 3. Crear una cotización
1. Ve a `/cotizador`
2. Llena los campos obligatorios:
   - N° Cotización (ej: 18072025)
   - Cliente
   - Al menos 1 producto con descripción y cantidad
3. Campos opcionales:
   - Container, Puerto Embarque, Oferta Válida, Producción
   - Especificación, Empaque por producto
   - Precios FOB
   - Condiciones de pago y notas
4. Haz clic en "Guardar Cotización"

### 4. Ver y generar PDF
1. Ve a `/cotizador/historico`
2. Busca la cotización que quieres
3. Haz clic en "Ver PDF"
4. En la vista PDF, haz clic en "Generar PDF"
5. En el diálogo de impresión, selecciona "Guardar como PDF"
6. Nombra el archivo: `Cotizacion_Cliente_Fecha.pdf`

### 5. Duplicar cotización
1. En el histórico, haz clic en "Duplicar"
2. Se creará una copia con "-COPIA" en el número
3. Puedes editar la duplicada como nueva cotización

---

## 📋 Estructura de Datos

### Tabla: cotizaciones_mercator

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único (auto) |
| numero_cotizacion | TEXT | Número único (ej: 18072025) |
| cliente | TEXT | Nombre del cliente |
| container | TEXT | Tipo contenedor (ej: 2x40HQ) |
| puerto_embarque | TEXT | Puerto (ej: QINGDAO) |
| oferta_valida | TEXT | Días validez (ej: 5 días) |
| produccion | TEXT | Días producción (ej: 35 días) |
| proveedor | TEXT | Default: Mercator Group |
| direccion | TEXT | Default: Franklin 338... |
| persona_contacto | TEXT | Default: Jose Marilaf Pablaza |
| email | TEXT | Default: jmarilaf@mercator-group.com |
| total_usd_fob | DECIMAL | Total (calculado auto) |
| condiciones_pago | TEXT | Condiciones de pago |
| notas | TEXT | Notas adicionales |
| created_at | TIMESTAMP | Fecha creación |
| updated_at | TIMESTAMP | Última actualización |

### Tabla: cotizacion_items

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único (auto) |
| cotizacion_id | UUID | Referencia a cotización |
| descripcion | TEXT | Nombre producto |
| especificacion | TEXT | Specs técnicas |
| empaque | TEXT | Tipo empaque |
| cantidad | INTEGER | Cantidad |
| unidad | TEXT | Default: unidad |
| precio_fob_unitario | DECIMAL | Precio USD/unidad |
| precio_fob_total | DECIMAL | Total (calculado auto) |
| foto_url | TEXT | URL foto referencial |
| orden | INTEGER | Orden visualización |

---

## 🎨 Formato PDF

El PDF generado replica **exactamente** el formato del Excel original:

### Header
```
┌─────────────────────┬─────────────────────┬─────────────────┐
│ Cotización N° : XXX │ Cliente : XXXXX     │ Página: 1 de 1  │
└─────────────────────┴─────────────────────┴─────────────────┘
```

### Logo
```
┌──────────────────────────────────────────────────────────────┐
│                     MERCATOR GROUP                            │
│              (Gradiente morado/azul)                          │
└──────────────────────────────────────────────────────────────┘
```

### Información General
```
┌──────────────────────────┬──────────────────────────────────┐
│ Container      │ 2x40HQ  │ Proveedor        │ Mercator Group│
│ Puerto embarque│ QINGDAO │ Dirección        │ Franklin 338  │
│ Oferta válida  │ 5 días  │ Persona Contacto │ Jose Marilaf  │
│ Producción     │ 35 días │ E-mail           │ jmarilaf@...  │
└──────────────────────────┴──────────────────────────────────┘
```

### Tabla de Productos
```
┌─────────────┬──────────────┬─────────┬──────────┬────────┬──────────┬───────┐
│ Descripción │ Especif.     │ Empaque │ Cantidad │ Precio │ Total    │ Foto  │
│             │              │         │ (unidad) │ FOB    │ FOB USD  │       │
├─────────────┼──────────────┼─────────┼──────────┼────────┼──────────┼───────┤
│ Producto 1  │ Specs...     │ Caja    │ 10 und   │ $100   │ $1,000   │ [img] │
│ Producto 2  │ Specs...     │ Pallet  │ 5 und    │ $200   │ $1,000   │ [img] │
└─────────────┴──────────────┴─────────┴──────────┴────────┴──────────┴───────┘
```

### Total
```
┌────────────────────────────────────────────────────────────┐
│            Total cotizado en USD FOB            $2,000.00  │
└────────────────────────────────────────────────────────────┘
```

### Condiciones y Footer
```
CONDICIONES DE PAGO:
30% adelanto, 70% contra entrega

NOTAS:
Notas adicionales aquí...

─────────────────────────────────────────────────────────────
        MERCATOR GROUP | Franklin 338, Santiago, Chile
```

---

## ✨ Características Especiales

### Cálculos Automáticos
El sistema calcula automáticamente:
- **Precio FOB Total por item** = Cantidad × Precio FOB Unitario
- **Total Cotización** = Suma de todos los items

### Triggers de Base de Datos
```sql
-- Trigger 1: Calcula precio_fob_total al insertar/actualizar item
CREATE TRIGGER calculate_item_total_trigger
BEFORE INSERT OR UPDATE ON cotizacion_items
FOR EACH ROW
EXECUTE FUNCTION calculate_item_total();

-- Trigger 2: Actualiza total_usd_fob de cotización cuando cambian items
CREATE TRIGGER update_cotizacion_total_on_item_change
AFTER INSERT OR UPDATE OR DELETE ON cotizacion_items
FOR EACH ROW
EXECUTE FUNCTION update_cotizacion_total();
```

### Validaciones
- **Número de cotización:** Debe ser único
- **Cliente:** Obligatorio
- **Descripción de productos:** Obligatoria
- **Cantidad:** Mínimo 1
- **Precios:** Pueden ser 0 o vacíos (para cotizaciones sin precio)

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Cotización Simple
```javascript
{
  cotizacion: {
    numero_cotizacion: "30102025",
    cliente: "ACME Corporation",
    container: "1x40HC",
    puerto_embarque: "SHANGHAI",
    oferta_valida: "7 días",
    produccion: "45 días"
  },
  items: [
    {
      descripcion: "Maquinaria Industrial",
      especificacion: "Acero inoxidable 304",
      empaque: "Caja de madera",
      cantidad: 2,
      precio_fob_unitario: 5000
    }
  ]
}
```

**Resultado:**
- Item 1: 2 × $5,000 = $10,000
- **Total: $10,000 USD FOB**

### Ejemplo 2: Cotización Múltiples Items
```javascript
{
  cotizacion: {
    numero_cotizacion: "30102025-B",
    cliente: "Industrias XYZ"
  },
  items: [
    {
      descripcion: "Bomba centrífuga",
      cantidad: 5,
      precio_fob_unitario: 800
    },
    {
      descripcion: "Motor eléctrico",
      cantidad: 5,
      precio_fob_unitario: 1200
    },
    {
      descripcion: "Panel de control",
      cantidad: 1,
      precio_fob_unitario: 2500
    }
  ]
}
```

**Resultado:**
- Item 1: 5 × $800 = $4,000
- Item 2: 5 × $1,200 = $6,000
- Item 3: 1 × $2,500 = $2,500
- **Total: $12,500 USD FOB**

---

## 🔧 Mantenimiento

### Actualizar valores por defecto del proveedor
Si cambias dirección, contacto, etc., edita en la base de datos:

```sql
-- Actualizar defaults en tabla
ALTER TABLE cotizaciones_mercator
ALTER COLUMN proveedor SET DEFAULT 'Nuevo Nombre';

ALTER TABLE cotizaciones_mercator
ALTER COLUMN direccion SET DEFAULT 'Nueva Dirección';
```

O actualiza en el formulario web:
`app/cotizador/page.tsx` líneas 22-25

### Agregar nuevos campos
1. Agrega columna en SQL:
```sql
ALTER TABLE cotizaciones_mercator
ADD COLUMN nuevo_campo TEXT;
```

2. Actualiza API: `app/api/cotizaciones/route.ts`
3. Actualiza formulario: `app/cotizador/page.tsx`
4. Actualiza PDF: `app/cotizador/pdf/[id]/page.tsx`

### Personalizar el logo
Edita el CSS en `app/cotizador/pdf/[id]/page.tsx`:

```css
.logo-section {
  /* Cambia colores del gradiente */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo-text {
  /* Cambia texto si necesario */
  font-size: 48px;
}
```

O reemplaza con imagen:
```html
<div className="logo-section">
  <img src="/mercator-logo.png" alt="Mercator" />
</div>
```

---

## 📱 Responsive

El sistema es **completamente responsive**:
- ✅ Funciona en desktop, tablet, móvil
- ✅ Formulario adaptable a pantallas pequeñas
- ✅ Histórico con scroll horizontal en móvil
- ✅ PDF optimizado para impresión en tamaño carta

---

## 🔒 Seguridad

- Usa **Supabase Service Role Key** para operaciones de escritura
- Validación de datos en backend (API)
- Sanitización de inputs en frontend
- IDs UUID imposibles de adivinar
- Confirmación antes de eliminar

---

## 📈 Próximas Mejoras (Opcionales)

1. **Edición inline:** Editar cotización existente sin duplicar
2. **Upload de imágenes:** Subir fotos de productos directamente
3. **Plantillas:** Guardar plantillas de productos frecuentes
4. **Búsqueda:** Filtrar histórico por cliente, fecha, monto
5. **Exportar Excel:** Además de PDF, exportar a Excel
6. **Estadísticas:** Dashboard con totales, promedios, etc.
7. **Multi-página:** Cotizaciones con muchos items en múltiples páginas PDF
8. **Envío por email:** Botón para enviar PDF por correo
9. **Firmas digitales:** Integración con DocuSign o similar
10. **Versiones:** Mantener historial de cambios en cotización

---

## 🐛 Troubleshooting

### Error: "Tabla no existe"
**Solución:** Ejecuta el SQL en Supabase SQL Editor

### Error: "SUPABASE_SERVICE_ROLE_KEY no definida"
**Solución:** Verifica que la variable de entorno esté en Vercel:
```bash
# Ve a Vercel Dashboard > Project > Settings > Environment Variables
SUPABASE_SERVICE_ROLE_KEY=tu_key_aqui
```

### PDF no se ve igual al Excel
**Solución:** Revisa el CSS en `app/cotizador/pdf/[id]/page.tsx`
Los estilos pueden verse diferentes en cada navegador. Prueba en Chrome para mejor compatibilidad.

### Total no se actualiza
**Solución:** Verifica que los triggers se ejecutaron correctamente:
```sql
-- Verifica triggers existentes
SELECT * FROM information_schema.triggers
WHERE event_object_table IN ('cotizacion_items', 'cotizaciones_mercator');
```

---

## 📞 Soporte

Para cualquier duda o problema:
1. Revisa este documento
2. Revisa los comentarios en el código
3. Verifica los logs en Vercel
4. Revisa las queries en Supabase Dashboard

---

**Última actualización:** 30 de Octubre de 2025

**Sistema creado por:** Müller & Pérez - Marketing & Performance
**Cliente:** Mercator Group
