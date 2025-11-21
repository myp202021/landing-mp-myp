# Meta Ads - Visualizaciones Mejoradas

## 📊 Resumen de Implementación

Hemos mejorado significativamente las visualizaciones de Meta Ads para incluir:

1. **Desglose por Plataforma** (Instagram vs Facebook vs Audience Network)
2. **Métricas a Nivel de Ad/Post Individual**
3. **Preparación para Contenido Orgánico** (separado del pagado)

---

## ✅ Completado

### 1. Base de Datos (Migración 006) ✅

**Archivo**: `database/migrations/006_add_ad_level_metrics.sql`

**Tablas Nuevas**:
- `ads_metrics_by_ad` - Métricas diarias por anuncio individual
  - Incluye: thumbnails, textos, links del creativo
  - Engagement: likes, comments, shares, video views
  - Breakdown por `publisher_platform` (Instagram, Facebook, etc.)

- `organic_content_metrics` - Métricas de contenido orgánico
  - Posts de páginas de Facebook/Instagram (no ads)
  - Alcance, engagement, video metrics

- `client_social_pages` - Mapeo de páginas sociales a clientes
  - Para conectar páginas de Facebook/Instagram Business

**Campos Agregados**:
- `ads_metrics_daily.publisher_platform` - Plataforma específica

**Estado**: ✅ Migración ejecutada en Supabase

### 2. Script de Sincronización Mejorado ✅

**Archivo**: `scripts/sync-meta-campaigns-enhanced.mjs`

**Funcionalidades**:
- ✅ Obtiene insights con `breakdown=publisher_platform`
- ✅ Separa métricas por Instagram, Facebook, Audience Network, Messenger
- ✅ Descarga datos a nivel de AD individual
- ✅ Captura engagement: likes, comments, shares, video views
- ✅ Guarda info de creativos: thumbnails, textos, links
- ✅ Escribe en ambas tablas: `ads_metrics_daily` y `ads_metrics_by_ad`

**Uso**:
```bash
node scripts/sync-meta-campaigns-enhanced.mjs
```

**Estado**: ⚠️ Necesita token de Meta Ads actualizado

### 3. Componentes de Visualización ✅

#### PlatformComparisonChart
**Archivo**: `app/components/crm/PlatformComparisonChart.tsx`

**Características**:
- Compara Instagram vs Facebook vs otras plataformas
- Gráfico de barras con colores por plataforma
- Cards de resumen por plataforma
- Iconos de Instagram/Facebook
- Métricas: inversión, clicks, impresiones, CTR, CPC

#### AdsGallery
**Archivo**: `app/components/crm/AdsGallery.tsx`

**Características**:
- Vista de galería con thumbnails de anuncios
- Filtro por plataforma (Instagram, Facebook, etc.)
- Ordenamiento por inversión/clicks/engagement
- Muestra engagement: likes, comments, shares
- Links a anuncios originales
- Estados de ads (Activo, Pausado, Archivado)
- Métricas individuales: CTR, CPC, conversiones

---

## 🔄 Próximos Pasos

### Paso 1: Refrescar Token de Meta Ads ⚠️

El token actual expiró. Opciones:

**Opción A - Generar Nuevo System User Token** (Recomendado para producción):
1. Ve a Meta Business Suite
2. Configuración de la empresa
3. System Users
4. Genera nuevo token con permisos `ads_read`
5. Ejecuta:
   ```bash
   node scripts/connect-meta-ads-manual.mjs
   ```

**Opción B - OAuth Flow** (Para desarrollo):
```bash
node scripts/connect-meta-auto.mjs
```

### Paso 2: Sincronizar Datos Mejorados

Una vez tengas el token actualizado:
```bash
node scripts/sync-meta-campaigns-enhanced.mjs
```

Esto poblará las nuevas tablas con:
- Datos por plataforma (Instagram/Facebook)
- Métricas de cada ad individual
- Engagement detallado

### Paso 3: Actualizar API

**Archivo a modificar**: `app/api/crm/campaigns/route.ts`

Agregar endpoints adicionales:
1. Datos por plataforma
2. Lista de ads individuales

**Ejemplo de consulta**:
```typescript
// Datos por plataforma
const { data: platformData } = await supabase
  .from('ads_metrics_daily')
  .select('publisher_platform, inversion, clicks, impresiones')
  .eq('cliente_id', clienteId)
  .gte('fecha', fechaInicio)
  .lte('fecha', fechaFin)

// Agrupar por plataforma
const byPlatform = platformData.reduce((acc, row) => {
  const platform = row.publisher_platform || 'unknown'
  if (!acc[platform]) {
    acc[platform] = {
      platform,
      inversion: 0,
      clicks: 0,
      impresiones: 0
    }
  }
  acc[platform].inversion += row.inversion
  acc[platform].clicks += row.clicks
  acc[platform].impresiones += row.impresiones
  return acc
}, {})

// Ads individuales
const { data: adsData } = await supabase
  .from('ads_metrics_by_ad')
  .select('*')
  .eq('cliente_id', clienteId)
  .gte('fecha', fechaInicio)
  .lte('fecha', fechaFin)
  .order('inversion', { ascending: false })
```

### Paso 4: Integrar Componentes en la Página

**Archivo a modificar**: `app/crm/cliente/campanias/page.tsx`

Importar y usar los nuevos componentes:
```typescript
import PlatformComparisonChart from '@/app/components/crm/PlatformComparisonChart'
import AdsGallery from '@/app/components/crm/AdsGallery'

// En el JSX, después del MultiSeriesChart:
<PlatformComparisonChart data={campanasData.platformData} />
<AdsGallery ads={campanasData.adsData} />
```

### Paso 5: Contenido Orgánico (Opcional)

Para agregar métricas orgánicas de páginas de Facebook/Instagram:

1. **Conectar páginas**:
   - Guardar Page Access Tokens en `client_social_pages`

2. **Crear script de sync orgánico**:
   - Obtener posts de la página: `/page_id/posts`
   - Obtener insights de posts: `/post_id/insights`
   - Guardar en `organic_content_metrics`

3. **Componente de visualización**:
   - Crear `OrganicContentGallery.tsx`
   - Similar a `AdsGallery` pero para posts orgánicos
   - Separador visual "PAGADO" vs "ORGÁNICO"

---

## 📋 Checklist de Implementación

- [x] Crear migración de base de datos
- [x] Ejecutar migración en Supabase
- [x] Crear script de sincronización mejorado
- [x] Crear componente PlatformComparisonChart
- [x] Crear componente AdsGallery
- [ ] Refrescar token de Meta Ads
- [ ] Ejecutar sync mejorado
- [ ] Actualizar API para incluir platformData y adsData
- [ ] Integrar componentes en página de campañas
- [ ] Compilar y desplegar
- [ ] (Opcional) Implementar tracking de contenido orgánico

---

## 🎯 Resultado Esperado

Una vez completados los pasos, el dashboard mostrará:

### Vista General
- ✅ Resumen agregado (como antes)
- ✅ Gráfico de tendencias (como antes)
- ✅ **NUEVO**: Comparación Instagram vs Facebook
- ✅ **NUEVO**: Galería de anuncios individuales con thumbnails

### Vista por Plataforma
- Barras de comparación con colores distintivos
- Instagram: Rosa (#E1306C)
- Facebook: Azul (#1877F2)
- Audience Network: Morado
- Messenger: Azul claro

### Vista de Anuncios
- Grid de cards con thumbnails
- Filtros por plataforma
- Ordenamiento por inversión/clicks/engagement
- Métricas de engagement visibles
- Links directos a anuncios

### (Futuro) Vista Orgánica
- Separación clara "Ads Pagados" vs "Contenido Orgánico"
- Métricas de alcance orgánico
- Engagement rate de posts
- Mejores posts del periodo

---

## 📝 Notas Técnicas

### Limitaciones Actuales
- Token de Meta expira cada 60 días (System User Token)
- Refresh manual requerido
- No hay webhook para actualizaciones en tiempo real

### Optimizaciones Futuras
- Cron job para sincronización automática diaria
- Webhook de Meta para actualizaciones en tiempo real
- Cache de thumbnails en CDN
- Paginación para galería con muchos ads

### Consideraciones de Performance
- Las consultas incluyen índices en `cliente_id`, `fecha`, `publisher_platform`
- El desglose por plataforma puede generar múltiples registros por día
- Considerar agregación pre-calculada para periodos largos

---

## 🚀 Deploy

Una vez completados los pasos anteriores:

```bash
# Compilar
npm run build

# Commit
git add .
git commit -m "feat: enhanced Meta Ads visualizations with platform breakdown and ad-level metrics"

# Push (auto-deploy en Vercel)
git push
```

---

**Última actualización**: 2025-11-20
**Estado**: Implementación base completa, pendiente integración y token refresh
