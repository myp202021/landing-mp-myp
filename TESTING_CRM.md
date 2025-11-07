# INSTRUCCIONES DE TESTING - CRM MULLER Y PEREZ

## RESUMEN DEL REDISENO COMPLETO

Se ha realizado un rediseno completo del sistema CRM con los colores de marca Muller y Perez.

---

## ARCHIVOS CREADOS

### Componentes Reutilizables (`/app/components/crm/`)
1. **CRMLayout.tsx** - Layout principal con navegacion y colores M&P
2. **Button.tsx** - Botones con estilos M&P (primary, secondary, danger, success)
3. **MetricCard.tsx** - Tarjetas de metricas con iconos y colores
4. **CotizacionCard.tsx** - Tarjeta de cotizacion para listados
5. **LeadCard.tsx** - Tarjeta de lead (no usada actualmente pero disponible)

### Paginas del CRM (`/app/crm/`)
1. **page.tsx** - CRM Admin rediseñado con dashboard de metricas
2. **cotizaciones/page.tsx** - Listado de todas las cotizaciones
3. **cotizaciones/[id]/page.tsx** - Vista individual de cotizacion (editable + imprimible)
4. **cotizaciones/nueva/page.tsx** - Formulario para crear nueva cotizacion
5. **metricas/page.tsx** - Dashboard de metricas y analytics

---

## ARCHIVOS MODIFICADOS

1. **/app/crm/page.tsx** - Completamente rediseñado con:
   - Nuevo diseño con colores M&P
   - Dashboard de metricas en la parte superior
   - Tabla mejorada de leads
   - Modales rediseñados

---

## FUNCIONALIDADES IMPLEMENTADAS

### 1. CRM Admin (`/crm`)
- Dashboard con 5 metricas principales (cards con gradientes)
- Fondo oscuro gradiente slate-900 → blue-900
- Tabla de leads con diseño profesional
- Filtro por cliente
- Seleccion multiple de leads
- Editar lead (modal con gradiente azul)
- Crear cotizacion desde lead
- Ver historial de cotizaciones por lead
- Eliminar leads (individual o multiple)

### 2. Listado de Cotizaciones (`/crm/cotizaciones`)
- Cards de cotizaciones con gradiente azul en header
- Metricas de cotizaciones (total, borradores, enviadas, aceptadas, vendido)
- Filtros por cliente y estado
- Boton "Nueva Cotizacion"
- Click en card para ver detalle

### 3. Cotizacion Individual (`/crm/cotizaciones/[id]`)
- **FONDO BLANCO** (preparado para imprimir)
- Vista profesional tipo factura
- Edicion inline (click para editar)
- Agregar/eliminar items dinamicamente
- Calculos automaticos de subtotal/descuento/total
- Cambiar estado (borrador → enviada → aceptada/rechazada)
- Boton "Imprimir PDF" (usa window.print())
- Boton "Eliminar cotizacion"
- Header con gradiente azul M&P
- Footer para impresion

### 4. Nueva Cotizacion (`/crm/cotizaciones/nueva`)
- Seleccionar cliente (obligatorio)
- Seleccionar lead opcional (filtrado por cliente)
- Nombre del proyecto
- Datos del cliente (nombre, email, empresa)
- Items dinamicos (descripcion, cantidad, precio, total)
- Calculos automaticos
- Descuento
- Vigencia en dias
- Notas/observaciones
- Guardar como borrador o enviar directamente

### 5. Metricas y Analytics (`/crm/metricas`)
- Metricas principales (total leads, conversion, vendido, ticket promedio)
- Metricas de cotizaciones (total, enviadas, tasa aceptacion)
- Evolucion mensual (ultimos 6 meses) con barras de progreso CSS
- Top 5 clientes por ventas
- Resumen de rendimiento (card azul)
- Resumen financiero (card verde)

### 6. Navegacion Global
- Layout compartido con navegacion entre:
  - CRM Admin
  - Cotizaciones
  - Metricas
- Boton "Actualizar" en todas las paginas

---

## COLORES UTILIZADOS

**Paleta Muller y Perez:**
- `#0F172A` (slate-900) - Fondo oscuro
- `#1E3A8A` (blue-900) - Headers y gradientes
- `#3B82F6` (blue-500) - Botones primarios
- `#60A5FA` (blue-400) - Hover states
- `#FFFFFF` (white) - Cotizaciones y cards

**Fondos:**
- CRM Admin y Metricas: Gradiente `from-slate-900 via-blue-900 to-slate-900`
- Cotizaciones individuales: Blanco puro (imprimible)
- Cards y modales: Blanco con sombras

**Gradientes:**
- Headers: `from-blue-900 to-blue-800`
- Titulos: `from-blue-900 to-blue-600`
- Botones: Colores solidos con hover

---

## TESTING - PASO A PASO

### Paso 1: Iniciar el Servidor
```bash
npm run dev
```

### Paso 2: Login al CRM
1. Ir a `http://localhost:3000/crm`
2. Ingresar contraseña: `myp2025`
3. Verificar que se carga el dashboard

### Paso 3: Verificar CRM Admin
- [ ] Ver metricas en cards (Total Leads, Contactados, Vendidos, etc.)
- [ ] Verificar fondo oscuro con gradiente
- [ ] Verificar tabla de leads
- [ ] Filtrar por cliente
- [ ] Seleccionar multiples leads
- [ ] Editar un lead (abrir modal)
- [ ] Ver historial de cotizaciones de un lead (boton 📄)
- [ ] Crear cotizacion desde lead (boton "Cotizar")

### Paso 4: Verificar Listado de Cotizaciones
1. Click en "Cotizaciones" en la navegacion
2. Verificar:
   - [ ] Metricas de cotizaciones en la parte superior
   - [ ] Cards de cotizaciones con diseño profesional
   - [ ] Filtros por cliente y estado funcionan
   - [ ] Boton "Nueva Cotizacion" visible
   - [ ] Click en una cotizacion lleva a vista individual

### Paso 5: Crear Nueva Cotizacion
1. Click en "Nueva Cotizacion"
2. Verificar:
   - [ ] Seleccionar cliente funciona
   - [ ] Al seleccionar cliente, se filtran los leads
   - [ ] Seleccionar lead autocompleta nombre/email
   - [ ] Agregar items funciona (boton +)
   - [ ] Calculos automaticos de total
   - [ ] Descuento se resta correctamente
   - [ ] Guardar como borrador
   - [ ] Guardar como enviada

### Paso 6: Ver/Editar Cotizacion Individual
1. Entrar a una cotizacion existente
2. Verificar:
   - [ ] Fondo blanco (imprimible)
   - [ ] Diseño profesional tipo factura
   - [ ] Header con gradiente azul
   - [ ] Boton "Editar" activa modo edicion
   - [ ] Editar items funciona
   - [ ] Agregar/eliminar items
   - [ ] Calculos se actualizan
   - [ ] Guardar cambios funciona
   - [ ] Cambiar estado (borrador → enviada → aceptada)
   - [ ] Boton "Imprimir PDF" abre dialogo de impresion
   - [ ] Boton "Eliminar" funciona (con confirmacion)

### Paso 7: Verificar Metricas
1. Click en "Metricas" en la navegacion
2. Verificar:
   - [ ] Metricas principales correctas
   - [ ] Metricas de cotizaciones
   - [ ] Grafico de evolucion mensual (ultimos 6 meses)
   - [ ] Barras de progreso CSS funcionan
   - [ ] Top 5 clientes muestra correctamente
   - [ ] Cards de resumen (azul y verde)

### Paso 8: Verificar Responsive
- [ ] Probar en mobile (< 768px)
- [ ] Probar en tablet (768px - 1024px)
- [ ] Probar en desktop (> 1024px)
- [ ] Verificar que todo sea usable en todos los tamaños

### Paso 9: Verificar Impresion
1. Abrir una cotizacion individual
2. Click en "Imprimir PDF"
3. Verificar:
   - [ ] Solo se muestra el contenido de la cotizacion
   - [ ] No aparecen botones ni navegacion
   - [ ] Footer de contacto aparece
   - [ ] Diseño profesional y limpio

---

## QUE FALTA POR HACER

### Funcionalidades Pendientes (Opcionales)
1. **PDF Generation**: Actualmente usa `window.print()`, se puede agregar libreria como `jsPDF` o `react-pdf`
2. **Email Integration**: Enviar cotizaciones por email directamente
3. **Notificaciones**: Alertas cuando cambia estado de cotizacion
4. **Filtros Avanzados**: Filtrar leads por fecha, fuente, estado
5. **Exportar a Excel**: Exportar leads y cotizaciones a CSV/Excel
6. **Graficos Avanzados**: Usar libreria de graficos (Chart.js, Recharts) en lugar de CSS
7. **Historial de Cambios**: Tracking de quien edito que y cuando
8. **Permisos de Usuario**: Diferentes niveles de acceso (admin, vendedor, viewer)

### Mejoras de UX (Opcionales)
1. Confirmacion visual al guardar (toast/snackbar en lugar de alert())
2. Loading states mas elaborados
3. Animaciones de transicion entre paginas
4. Dark mode toggle
5. Personalizar plantilla de cotizacion por cliente

---

## NOTAS IMPORTANTES

1. **Contraseña del CRM**: `myp2025` (cambiar en produccion)
2. **Colores M&P**: Todos definidos en Tailwind, facil de ajustar
3. **Sin Librerias Externas**: Todo con Tailwind CSS y React hooks
4. **Impresion**: Usa clase `print:hidden` para ocultar elementos al imprimir
5. **Responsive**: Todo responsive con grid y flex de Tailwind
6. **TypeScript**: Todo tipado para mejor developer experience

---

## ESTRUCTURA DE ARCHIVOS

```
app/
├── crm/
│   ├── page.tsx                    # CRM Admin rediseñado
│   ├── cotizaciones/
│   │   ├── page.tsx                # Listado de cotizaciones
│   │   ├── [id]/
│   │   │   └── page.tsx            # Vista individual de cotizacion
│   │   └── nueva/
│   │       └── page.tsx            # Crear nueva cotizacion
│   └── metricas/
│       └── page.tsx                # Dashboard de metricas
└── components/
    └── crm/
        ├── CRMLayout.tsx           # Layout compartido
        ├── Button.tsx              # Botones con estilos M&P
        ├── MetricCard.tsx          # Cards de metricas
        ├── CotizacionCard.tsx      # Card de cotizacion
        └── LeadCard.tsx            # Card de lead
```

---

## COMANDOS UTILES

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para produccion
npm run build

# Iniciar servidor de produccion
npm start

# Limpiar cache de Next.js
rm -rf .next
```

---

## CONTACTO

Sistema desarrollado para **Muller y Perez**
Contraseña CRM: `myp2025`

**IMPORTANTE**: Cambiar contraseña en produccion en `/app/crm/page.tsx` linea 78
