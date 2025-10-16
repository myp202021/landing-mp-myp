# M&P Intelligence - Arquitectura Técnica

## 🎯 Objetivo
Herramienta de inteligencia competitiva que analiza presencia digital de competidores mediante múltiples fuentes públicas.

## 📊 Módulos

### Módulo 1: Meta Ads Radar ⭐ PRIORIDAD
**Qué hace:**
- Busca anuncios activos en Facebook/Instagram de un competidor
- Analiza creatividades, copy, formatos, duración
- Genera timeline de activación publicitaria
- Calcula "Índice de Presión Publicitaria M&P"

**APIs/Fuentes:**
- Meta Ad Library API (oficial)
- Rate limit: 200 calls/hora

**Métricas a mostrar:**
- Número de creatividades activas (últimos 7, 30, 90 días)
- Distribución por formato (imagen/video/carrusel)
- Duración promedio de campañas
- Frecuencia de publicación (diaria/semanal/mensual)
- Timeline visual de activación
- Top 5 CTAs más usados
- Índice M&P de Presión: 0-100 (basado en volumen + frecuencia + variedad)

### Módulo 2: Web Presence Score ⭐ PRIORIDAD
**Qué hace:**
- Analiza performance técnica del sitio web competidor
- Detecta tecnologías usadas (CMS, analytics, ads pixels)
- Compara contra benchmark de la industria

**APIs/Fuentes:**
- Google PageSpeed Insights API
- BuiltWith API (free tier: 250 lookups/mes)
- Wappalyzer API (alternativa)

**Métricas a mostrar:**
- PageSpeed Score (mobile/desktop)
- Core Web Vitals (LCP, FCP, TBT, CLS)
- Tecnologías detectadas: CMS, Analytics, Tag Manager, Pixels
- Certificado SSL válido
- Sitio mobile-friendly
- Score comparativo vs. tu cliente

### Módulo 3: Social Media Activity
**Qué hace:**
- Analiza actividad orgánica en redes sociales
- Frecuencia de publicación y engagement aproximado
- Hashtags y temas más usados

**APIs/Fuentes:**
- Facebook Graph API (posts públicos)
- Instagram Basic Display API (opcional v2)
- YouTube Data API v3 (si aplica)

**Métricas a mostrar:**
- Posts últimos 30 días
- Frecuencia de publicación
- Engagement rate aproximado (likes/followers)
- Top 10 hashtags
- Distribución de contenido (imagen/video/link)

### Módulo 4: SEO Visibility (v2 - opcional)
**Qué hace:**
- Visibilidad en búsquedas orgánicas
- Backlinks públicos
- Keywords posicionadas

**APIs/Fuentes:**
- SERPApi (paid, desde $50/mes)
- Moz API (free tier muy limitado)
- Manual scraping (backup)

---

## 🗄️ Base de Datos (Supabase)

### Tabla: `searches`
Almacena búsquedas realizadas por usuarios.

```sql
CREATE TABLE searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  user_email TEXT,
  competitor_name TEXT NOT NULL,
  competitor_url TEXT,
  competitor_fb_page TEXT,
  status TEXT DEFAULT 'pending', -- pending | processing | completed | error
  modules_requested JSONB, -- {meta_ads: true, web_presence: true, ...}
  results_summary JSONB,
  error_message TEXT
);
```

### Tabla: `meta_ads_cache`
Cache de anuncios de Meta para evitar re-consultar.

```sql
CREATE TABLE meta_ads_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fb_page_id TEXT NOT NULL,
  fb_page_name TEXT,
  ad_id TEXT NOT NULL,
  ad_creative_url TEXT,
  ad_creative_body TEXT,
  ad_format TEXT, -- image | video | carousel
  ad_start_date DATE,
  ad_end_date DATE,
  ad_cta_text TEXT,
  platforms TEXT[], -- {facebook, instagram, messenger}
  fetched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(fb_page_id, ad_id)
);

CREATE INDEX idx_meta_ads_page ON meta_ads_cache(fb_page_id);
CREATE INDEX idx_meta_ads_dates ON meta_ads_cache(ad_start_date, ad_end_date);
```

### Tabla: `web_presence_cache`
Cache de análisis de sitios web.

```sql
CREATE TABLE web_presence_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  pagespeed_score_mobile INT,
  pagespeed_score_desktop INT,
  lcp_mobile FLOAT,
  fcp_mobile FLOAT,
  tbt_mobile FLOAT,
  cls_mobile FLOAT,
  technologies JSONB, -- {cms: "WordPress", analytics: ["GA4"], ...}
  ssl_valid BOOLEAN,
  mobile_friendly BOOLEAN,
  fetched_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_web_presence_url ON web_presence_cache(url);
```

### Tabla: `social_activity_cache`
Cache de actividad en redes sociales.

```sql
CREATE TABLE social_activity_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL, -- facebook | instagram | youtube
  profile_id TEXT NOT NULL,
  profile_name TEXT,
  posts_count_30d INT,
  avg_engagement_rate FLOAT,
  posting_frequency TEXT, -- daily | weekly | monthly
  top_hashtags TEXT[],
  content_types JSONB, -- {image: 50, video: 30, link: 20}
  fetched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, profile_id)
);
```

---

## 🔌 API Routes (Next.js)

### `/api/mp-intelligence/search`
**POST**: Iniciar búsqueda de competidor

```typescript
// Request
{
  competitor_name: string,
  competitor_url?: string,
  competitor_fb_page?: string,
  modules: {
    meta_ads: boolean,
    web_presence: boolean,
    social_activity: boolean
  }
}

// Response
{
  search_id: string,
  status: "processing",
  estimated_time_seconds: 30
}
```

### `/api/mp-intelligence/results/:search_id`
**GET**: Obtener resultados de búsqueda

```typescript
// Response
{
  status: "completed" | "processing" | "error",
  competitor: {
    name: string,
    url: string,
    logo_url?: string
  },
  modules: {
    meta_ads?: { ... },
    web_presence?: { ... },
    social_activity?: { ... }
  },
  pressure_index: number, // 0-100
  generated_at: timestamp
}
```

### `/api/mp-intelligence/export-pdf/:search_id`
**GET**: Exportar resultados a PDF

---

## 🎨 Frontend

### Ruta: `/labs/mp-intelligence`

**Componentes:**
```
/labs/mp-intelligence/
├── page.tsx                    # Landing + búsqueda
├── components/
│   ├── SearchForm.tsx          # Input competitor
│   ├── LoadingState.tsx        # Mientras procesa
│   ├── Dashboard.tsx           # Resultados completos
│   ├── MetaAdsModule.tsx       # Visualización ads
│   ├── WebPresenceModule.tsx   # Visualización web
│   ├── SocialActivityModule.tsx
│   ├── PressureIndexGauge.tsx  # Gauge 0-100
│   └── ExportButton.tsx        # Botón PDF
└── [search_id]/
    └── page.tsx                # Vista de resultados por ID
```

---

## 🎯 Índice de Presión Publicitaria M&P

Fórmula ponderada (0-100):

```javascript
pressure_index = (
  (num_active_ads / 50) * 30 +           // Volumen (máx 50 ads = 30 pts)
  (posting_frequency_score) * 25 +       // Frecuencia (25 pts)
  (format_variety_score) * 20 +          // Variedad formatos (20 pts)
  (avg_ad_duration_score) * 15 +         // Persistencia (15 pts)
  (social_activity_score) * 10           // Actividad orgánica (10 pts)
) * 1.0

// Normalizar a 0-100
```

---

## 🚀 Roadmap de Implementación

### Semana 1-2: MVP (Módulos 1 y 2)
- ✅ Setup base de datos Supabase
- ✅ Meta Ads API integration
- ✅ Web Presence Score (PageSpeed)
- ✅ Frontend básico de búsqueda
- ✅ Dashboard de resultados
- ✅ Cálculo de Pressure Index

### Semana 3: Polish + Export
- ✅ Diseño mejorado de dashboard
- ✅ Gráficos y visualizaciones
- ✅ Export a PDF con branding
- ✅ Cache y optimización

### Semana 4: Módulo 3 + Refinamiento
- ✅ Social Media Activity
- ✅ Comparaciones múltiples competidores
- ✅ Histórico de búsquedas
- ✅ Testing + bugs

---

## 🔐 Seguridad y Rate Limiting

### Variables de entorno requeridas
```env
# Meta API
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=

# Google PageSpeed
GOOGLE_PAGESPEED_API_KEY=

# BuiltWith (opcional)
BUILTWITH_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Rate limiting
- 10 búsquedas/día para usuarios anónimos
- 50 búsquedas/día para usuarios registrados
- 200 búsquedas/día para clientes M&P

---

## 📈 Monetización Futura

### Tier Free
- 3 búsquedas/mes
- Solo Módulos 1 y 2
- Resultados básicos
- PDF con branding M&P

### Tier Pro ($49/mes)
- 50 búsquedas/mes
- Todos los módulos
- Histórico 90 días
- Comparaciones múltiples
- PDF sin marca de agua

### Tier Enterprise (custom)
- Búsquedas ilimitadas
- API access
- White-label
- Alertas automáticas
- Reportes programados
