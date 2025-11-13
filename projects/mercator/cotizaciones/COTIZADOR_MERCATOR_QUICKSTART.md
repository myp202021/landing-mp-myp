# 🚀 Cotizador Mercator - Guía Rápida

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Ejecutar SQL en Supabase
```bash
# 1. Ve a: https://supabase.com/dashboard/project/YOUR_PROJECT
# 2. Click en "SQL Editor" en el menú izquierdo
# 3. Click "New Query"
# 4. Copia y pega TODO el contenido de:
cotizaciones/supabase-cotizaciones-mercator.sql
# 5. Click "Run" o presiona Cmd+Enter
```

### 2️⃣ Desplegar a Vercel
```bash
cd /Users/christophermuller/google-ads-automation/landing-mp-myp
vercel --prod
```

### 3️⃣ Probar el sistema
```bash
# Abre en tu navegador:
https://mulleryperez.cl/cotizador
```

---

## 📍 URLs del Sistema

| Función | URL |
|---------|-----|
| **Crear cotización** | `/cotizador` |
| **Ver histórico** | `/cotizador/historico` |
| **Ver PDF** | `/cotizador/pdf/[id]` |

---

## 📝 Crear Primera Cotización

1. Ve a `/cotizador`
2. Llena:
   - **N° Cotización:** `30102025`
   - **Cliente:** `ACME Corp`
   - **Producto 1:**
     - Descripción: `Maquinaria Industrial`
     - Cantidad: `2`
     - Precio FOB Unitario: `5000`
3. Click **"Guardar Cotización"**

---

## 🖨️ Generar PDF

1. Ve a `/cotizador/historico`
2. Click **"Ver PDF"** en cualquier cotización
3. Click **"Generar PDF"**
4. Selecciona **"Guardar como PDF"**
5. Nombra: `Cotizacion_ACME_30102025.pdf`

---

## 📂 Archivos Importantes

```
landing-mp-myp/
├── cotizaciones/
│   ├── supabase-cotizaciones-mercator.sql  ← EJECUTA PRIMERO
│   ├── COTIZADOR_MERCATOR_RESUMEN.md       ← DOCUMENTACIÓN COMPLETA
│   └── COTIZADOR_MERCATOR_QUICKSTART.md    ← ESTE ARCHIVO
│
├── app/
│   ├── api/cotizaciones/
│   │   └── route.ts                        ← API endpoints
│   │
│   └── cotizador/
│       ├── page.tsx                        ← Formulario
│       ├── historico/page.tsx              ← Lista
│       └── pdf/[id]/page.tsx               ← Vista PDF
```

---

## ✅ Checklist Post-Instalación

- [ ] SQL ejecutado en Supabase
- [ ] Tablas `cotizaciones_mercator` y `cotizacion_items` creadas
- [ ] Proyecto desplegado en Vercel
- [ ] `/cotizador` abre correctamente
- [ ] Creada una cotización de prueba
- [ ] PDF generado correctamente

---

## 🆘 Solución Rápida de Problemas

### "Tabla no existe"
```sql
-- Verifica en Supabase SQL Editor:
SELECT * FROM cotizaciones_mercator LIMIT 1;
```
Si falla → Ejecuta el SQL nuevamente

### "Error 500 en API"
```bash
# Verifica environment variables en Vercel:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### "PDF no se genera"
- Usa **Chrome** para mejor compatibilidad
- Presiona `Ctrl+P` (Windows) o `Cmd+P` (Mac)
- Selecciona "Guardar como PDF" como destino

---

## 📞 Contacto

**Documentación completa:** Ver `COTIZADOR_MERCATOR_RESUMEN.md`

**Sistema creado para:** Mercator Group
**Desarrollado por:** Müller & Pérez
