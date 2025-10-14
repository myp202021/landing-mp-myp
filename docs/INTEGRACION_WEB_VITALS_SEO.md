# Integración Web Vitals para SEO - Landing M&P

## ¿Por qué esto SÍ es útil AHORA?

Core Web Vitals son **factor de ranking en Google** desde 2021. Afectan directamente tu SEO.

**Problema actual:** No estás midiendo métricas SEO críticas en tiempo real.

---

## ✅ Integración SIMPLE sin GTM (Opción 1 - Recomendada)

Si no tienes GTM configurado o quieres algo más directo, usa `web-vitals` npm package.

### Instalación (30 minutos)

1. **Instalar dependencia**
```bash
npm install web-vitals
```

2. **Crear componente de tracking**
```typescript
// components/WebVitalsTracker.tsx
'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function WebVitalsTracker() {
  useEffect(() => {
    // Solo ejecutar en cliente
    if (typeof window === 'undefined') return;

    function sendToGoogleAnalytics({ name, delta, value, id }: any) {
      // Enviar a GA4
      if (window.gtag) {
        window.gtag('event', name, {
          event_category: 'Web Vitals',
          event_label: id,
          value: Math.round(name === 'CLS' ? delta * 1000 : delta),
          non_interaction: true,
        });
      }

      // También log en consola (desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${name}:`, {
          value: Math.round(value),
          delta: Math.round(delta),
          id,
          rating: getRating(name, value)
        });
      }
    }

    // Trackear todas las métricas
    onCLS(sendToGoogleAnalytics);
    onFID(sendToGoogleAnalytics);
    onFCP(sendToGoogleAnalytics);
    onLCP(sendToGoogleAnalytics);
    onTTFB(sendToGoogleAnalytics);
    onINP(sendToGoogleAnalytics);

  }, []);

  return null; // Componente invisible
}

// Helper para determinar si la métrica es buena/needs improvement/poor
function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [goodThreshold, poorThreshold] = thresholds[metric] || [0, 0];

  if (value <= goodThreshold) return 'good';
  if (value <= poorThreshold) return 'needs-improvement';
  return 'poor';
}
```

3. **Agregar al layout root**
```typescript
// app/layout.tsx
import WebVitalsTracker from '@/components/WebVitalsTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <WebVitalsTracker />
        {children}
      </body>
    </html>
  );
}
```

4. **Ver métricas en GA4**
- Ve a Informes → Eventos
- Busca eventos: CLS, FID, LCP, FCP, TTFB, INP
- Crea exploración personalizada para análisis

---

## ✅ Integración con GTM (Opción 2 - Si ya usas GTM)

### Instalación (45 minutos)

1. **Descargar template**
```bash
curl -O https://raw.githubusercontent.com/google-marketing-solutions/web-vitals-gtm-template/main/template.tpl
```

2. **Importar en GTM**
- Ir a workspace → Templates → Tag Templates
- Crear nuevo → Importar
- Seleccionar `template.tpl`
- Guardar

3. **Crear tag**
- Ir a Tags → Nuevo
- Tipo: Web Vitals Template (el que acabas de importar)
- Configurar:
  - Library URL: `https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js`
  - Event Name Prefix: `web_vitals_`
  - Report All Changes: ✅ (recomendado)

4. **Crear trigger**
- Trigger type: Page View - All Pages
- Activar en todas las páginas

5. **Crear variables data layer**
- Variables → Nuevo → Data Layer Variable
- Crear una por cada métrica:
  - `web_vitals_cls_value`
  - `web_vitals_fid_value`
  - `web_vitals_lcp_value`
  - `web_vitals_fcp_value`
  - `web_vitals_ttfb_value`
  - `web_vitals_inp_value`

6. **Crear tag GA4 para enviar eventos**
- Tags → Nuevo → GA4 Event
- Event Name: `web_vitals`
- Event Parameters:
  - `metric_name`: `{{Event}}` (built-in variable)
  - `metric_value`: `{{web_vitals_{{Event}}_value}}`
  - `metric_rating`: `{{web_vitals_{{Event}}_rating}}`
- Trigger: Custom Event - `web_vitals_*`

7. **Publicar contenedor**

---

## 📊 Dashboard en Looker Studio (GRATIS)

### Crear dashboard (1 hora)

1. **Conectar GA4 a Looker Studio**
- https://lookerstudio.google.com
- Crear informe → Agregar datos → GA4
- Seleccionar propiedad

2. **Configurar campos calculados**

```sql
-- CLS Rating
CASE
  WHEN CLS_value <= 0.1 THEN "Good"
  WHEN CLS_value <= 0.25 THEN "Needs Improvement"
  ELSE "Poor"
END

-- LCP Rating
CASE
  WHEN LCP_value <= 2500 THEN "Good"
  WHEN LCP_value <= 4000 THEN "Needs Improvement"
  ELSE "Poor"
END

-- FID Rating
CASE
  WHEN FID_value <= 100 THEN "Good"
  WHEN FID_value <= 300 THEN "Needs Improvement"
  ELSE "Poor"
END

-- INP Rating
CASE
  WHEN INP_value <= 200 THEN "Good"
  WHEN INP_value <= 500 THEN "Needs Improvement"
  ELSE "Poor"
END

-- TTFB Rating
CASE
  WHEN TTFB_value <= 800 THEN "Good"
  WHEN TTFB_value <= 1800 THEN "Needs Improvement"
  ELSE "Poor"
END

-- FCP Rating
CASE
  WHEN FCP_value <= 1800 THEN "Good"
  WHEN FCP_value <= 3000 THEN "Needs Improvement"
  ELSE "Poor"
END
```

3. **Crear visualizaciones**

**Scorecard (6 cards):**
- CLS promedio (Goal: < 0.1)
- LCP promedio (Goal: < 2500ms)
- FID promedio (Goal: < 100ms)
- INP promedio (Goal: < 200ms)
- TTFB promedio (Goal: < 800ms)
- FCP promedio (Goal: < 1800ms)

**Gauge charts:**
- % de sesiones con "Good" CLS
- % de sesiones con "Good" LCP
- % de sesiones con "Good" FID/INP

**Time series:**
- Evolución de Core Web Vitals por día
- Líneas separadas por métrica
- Threshold lines en los valores "Good"

**Table:**
- Page path | LCP | CLS | FID | INP | Rating
- Ordenado por peor performance

**Pie chart:**
- Distribución de ratings (Good/Needs Improvement/Poor)
- Uno por cada métrica

---

## 🚨 Alertas Automáticas

### Setup alertas en GA4 (20 minutos)

1. **Crear audiencia "Core Web Vitals Poor"**
```
GA4 → Admin → Audiencias → Nueva audiencia

Condiciones:
- Evento: web_vitals_lcp
- LCP_value > 4000 ms
O
- Evento: web_vitals_cls
- CLS_value > 0.25
O
- Evento: web_vitals_inp
- INP_value > 500 ms
```

2. **Configurar notificación**
- GA4 → Admin → Custom Alerts
- Alerta: "Core Web Vitals degradados"
- Métrica: Count of sessions in "Core Web Vitals Poor" audience
- Condición: > 10% of total sessions
- Frecuencia: Diaria
- Email: tu email

---

## 🔧 Troubleshooting / Mejoras

### Si LCP es alto (> 2500ms):

**Diagnóstico:**
```typescript
// Agregar a WebVitalsTracker.tsx
onLCP((metric) => {
  // Identificar qué elemento es el LCP
  const lcpElement = metric.entries[metric.entries.length - 1];

  console.log('LCP Element:', {
    element: lcpElement.element,
    url: lcpElement.url,
    loadTime: metric.value,
    startTime: lcpElement.startTime,
  });
});
```

**Soluciones comunes:**
- Optimizar imágenes (usar Next.js Image component)
- Implementar lazy loading
- Usar CDN para imágenes
- Preload recursos críticos
- Server-side rendering

### Si CLS es alto (> 0.1):

**Diagnóstico:**
```typescript
onCLS((metric) => {
  metric.entries.forEach((entry) => {
    console.log('Layout Shift:', {
      value: entry.value,
      element: entry.sources?.[0]?.node,
      startTime: entry.startTime,
    });
  });
});
```

**Soluciones comunes:**
- Definir width/height en imágenes y videos
- Evitar insertar contenido dinámico sobre contenido existente
- Usar `aspect-ratio` CSS
- Reservar espacio para ads/embeds

### Si INP es alto (> 200ms):

**Soluciones:**
- Debounce de eventos
- Code splitting
- Optimizar event handlers
- Usar Web Workers para operaciones pesadas

---

## 📈 Integrar con Vercel Analytics (Bonus)

Si usas Vercel, tiene Web Vitals integrado:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Ventajas:**
- Dashboard en Vercel UI
- Real User Monitoring
- Filtros por página, dispositivo, país
- Gratis en plan Pro ($20/mes)

---

## ✅ ROI de esta integración

**Impacto SEO directo:**
- ✅ Core Web Vitals son factor de ranking
- ✅ Detectar problemas ANTES de perder posiciones
- ✅ Monitoreo continuo 24/7
- ✅ Dashboards automáticos

**Tiempo de implementación:**
- Opción 1 (npm package): 30 minutos
- Opción 2 (GTM): 45 minutos
- Dashboard Looker: 1 hora
- Alertas: 20 minutos
- **Total: 2-3 horas máximo**

**Costo:**
- **$0** (todo gratis)

---

## 🚀 Plan de acción

**Día 1 (2 horas):**
1. Implementar Web Vitals tracking (30 min)
2. Verificar eventos en GA4 (15 min)
3. Crear dashboard Looker Studio (1 hora)
4. Configurar alertas (15 min)

**Día 2 en adelante:**
- Revisar dashboard semanalmente
- Actuar sobre métricas "Poor"
- Optimizar páginas con peor performance

---

## 📚 Recursos

- [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
