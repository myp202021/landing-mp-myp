# 📄 Generador de Cotizaciones M&P

Sistema para generar cotizaciones profesionales en PDF con el logo de Müller & Pérez.

---

## 📂 Ubicación

```
/Users/christophermuller/google-ads-automation/landing-mp-myp/cotizaciones/
```

---

## 📋 Archivos

- **`generador-cotizaciones.html`** - Template HTML para generar cotizaciones
- **`logo-mp.png`** - Logo oficial de M&P (degradado morado-azul)
- **`README.md`** - Este archivo de instrucciones

---

## 🚀 Cómo Usar

### 1. Abrir el generador:
```bash
open /Users/christophermuller/google-ads-automation/landing-mp-myp/cotizaciones/generador-cotizaciones.html
```

O desde Finder:
1. Ve a: `google-ads-automation/landing-mp-myp/cotizaciones/`
2. Haz doble clic en `generador-cotizaciones.html`

### 2. Generar PDFs:

En la página verás botones en la esquina superior derecha:
- **🖨️ Imprimir Todo** - Imprime las 3 cotizaciones juntas
- **📄 Cotización Sept** - Solo OC Septiembre
- **📄 Cotización Oct** - Solo OC Octubre
- **📄 Cotización Nov** - Solo OC Noviembre

### 3. Guardar como PDF:

1. Haz clic en cualquier botón
2. En el diálogo de impresión, selecciona **"Guardar como PDF"**
3. Nombra el archivo, por ejemplo:
   - `Cotizacion_Cliente_OC_Mes_2024.pdf`

---

## ✏️ Personalizar para Nuevo Cliente

Para crear cotizaciones para un nuevo cliente, edita el archivo HTML:

### Cambiar datos del cliente:

Busca en el HTML las secciones `<div class="cliente-info">` y modifica:

```html
<p><strong>Empresa:</strong> NOMBRE_DEL_CLIENTE</p>
<p><strong>Para:</strong> Orden de Compra MES 2024</p>
<p><strong>Corresponde a:</strong> Servicios prestados en MES 2024</p>
```

### Cambiar número de cotización:

Busca `<p><strong>N°:</strong> COT-XXX-MM-YYYY</p>` y modifica:
- `XXX` = Siglas del cliente (ej: HLP, MYP, etc.)
- `MM` = Mes numérico
- `YYYY` = Año

### Cambiar fechas:

```html
<p><strong>Fecha:</strong> DD de MES de YYYY</p>
<p><strong>Válida hasta:</strong> DD de MES de YYYY</p>
```

### Cambiar monto:

Busca la sección `<div class="totales">` y modifica:

```html
<div class="total-row">
    <span>Subtotal Servicios:</span>
    <span>$XXX.XXX</span>
</div>
<div class="total-row">
    <span>IVA (19%):</span>
    <span>$XXX.XXX</span>
</div>
<div class="total-row final">
    <span>TOTAL A PAGAR:</span>
    <span>$X.XXX.XXX</span>
</div>
```

### Cambiar servicios:

Busca `<div class="servicios">` y modifica los items:

```html
<div class="servicio-item">
    <span class="servicio-numero">1.</span>
    <strong>Título del servicio:</strong> Descripción detallada.
</div>
```

---

## 📝 Ejemplo: Buses Hualpén

El template actual está configurado para **Buses Hualpén** con:

- **Monto:** $952.000 + IVA = $1.132.880
- **Servicios:**
  1. Gestión de redes sociales (LinkedIn, Instagram, Meta)
  2. Generación y publicación de contenidos
  3. Gráficas (reels y videos)
  4. Edición de material del cliente
  5. Reportería e informes mensuales
  6. Reuniones de seguimiento + WhatsApp

- **3 Cotizaciones:**
  - COT-HLP-09-2024 → OC Septiembre (Servicios Agosto)
  - COT-HLP-10-2024 → OC Octubre (Servicios Septiembre)
  - COT-HLP-11-2024 → OC Noviembre (Servicios Octubre)

---

## 🎨 Actualizar el Logo

Si necesitas cambiar el logo:

1. Guarda el nuevo logo como `logo-mp.png` en esta carpeta
2. O actualiza la ruta en el HTML:
   ```html
   <img src="logo-mp.png" alt="M&P Logo" class="logo">
   ```

---

## 💡 Tips

- **Ctrl+P** para abrir el diálogo de impresión rápidamente
- **Cmd+R** para recargar después de hacer cambios
- Guarda el HTML con otro nombre para crear templates diferentes
- Los PDFs mantienen el formato exacto del navegador

---

## 📞 Contacto en Cotizaciones

Todas las cotizaciones incluyen al pie:

- **Email:** contacto@mulleryperez.cl
- **Web:** www.mulleryperez.cl
- **Validez:** 15 días desde emisión

---

## 🔧 Mantenimiento

### Crear nuevo template:

```bash
cp generador-cotizaciones.html generador-cotizaciones-CLIENTE.html
```

Luego edita el nuevo archivo con los datos del cliente.

### Respaldar:

```bash
zip -r cotizaciones-backup.zip /Users/christophermuller/google-ads-automation/landing-mp-myp/cotizaciones/
```

---

**Última actualización:** 30 de Octubre de 2025
