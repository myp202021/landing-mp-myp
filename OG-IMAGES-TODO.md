# 📸 OG Images - Pendientes de Crear

## ⚠️ CRÍTICO PARA SEO

Las siguientes imágenes Open Graph **NO EXISTEN** y deben crearse:

### 📐 Especificaciones técnicas:
- **Dimensiones**: 1200 x 630 px
- **Formato**: JPG o PNG
- **Peso máximo**: < 1MB (idealmente < 300KB)
- **Ubicación**: `/public/`

---

## 🎨 Imágenes requeridas:

### 1. **og-image.jpg** (Principal)
- Uso: Landing principal + fallback
- Contenido sugerido:
  - Logo Muller y Pérez
  - Texto: "Marketing Digital & Performance Chile"
  - Fondo gradient azul (#1e3a8a → #3b82f6)
  - Sub-texto: "Métricas reales • Resultados medibles"

### 2. **og-predictor.jpg**
- Uso: /labs/predictor
- Contenido sugerido:
  - "Predictor Google Ads Chile"
  - Ícono calculadora o gráficos
  - "Calcula tus conversiones en 30 segundos"

### 3. **og-buyer-gen.jpg**
- Uso: /labs/buyer-gen
- Contenido: "Generador Buyer Personas"

### 4. **og-radar.jpg**
- Uso: /labs/radar-industrias
- Contenido: "Radar Industrias Chile 2024"

### 5. **og-cac.jpg**
- Uso: /utilidades/calculadora-cac
- Contenido: "Calculadora CAC"

### 6. **og-comparador.jpg**
- Uso: /utilidades/comparador-web
- Contenido: "Comparador Velocidad Web"

### 7. **og-funnels.jpg**
- Uso: /utilidades/generador-funnels
- Contenido: "Generador de Funnels CRM"

### 8. **og-juega.jpg**
- Uso: /utilidades/juega-aprende
- Contenido: "Simulador Marketing Digital"

---

## 🛠️ Herramientas recomendadas:

### Opción 1: Canva (Fácil)
1. Template: "Facebook Post" (1200x630)
2. Usar marca M&P
3. Exportar como JPG alta calidad

### Opción 2: Figma (Profesional)
1. Frame 1200x630
2. Diseñar con identidad M&P
3. Export → JPG 2x

### Opción 3: Código (Avanzado)
Usa el template SVG en `/public/og-image-template.svg` y convierte con:
```bash
# Requiere ImageMagick
convert og-image-template.svg -resize 1200x630 og-image.jpg
```

---

## ✅ Después de crear las imágenes:

1. Colocar en `/public/`
2. Actualizar rutas en código:
   - `lib/metadata.ts` → `siteConfig.ogImage`
   - Cada herramienta puede tener su propia imagen

3. Verificar con:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

## 🎯 Prioridad:

1. **og-image.jpg** (URGENTE - se usa en todas las páginas actualmente)
2. og-predictor.jpg
3. Resto según importancia de tráfico

---

**Nota**: Por ahora todas las páginas usan `og-image.jpg` como fallback. Sin esta imagen, Facebook/LinkedIn/Twitter NO mostrarán preview visual.
