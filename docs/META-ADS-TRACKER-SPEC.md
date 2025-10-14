# 🎯 Meta Ads Competitor Tracker - Especificación Completa

## 📋 Análisis Previo de 7 Repos Open Source

### Repos Analizados:

1. **ViGenAiR** (Google Marketing Solutions)
   - Apache 2.0, arquitectura modular Google Cloud
   - Aprendizaje: Servicios desacoplados, procesamiento por etapas

2. **OSP Marketing Tools**
   - CC BY-SA 4.0, herramientas IA para marketing
   - Aprendizaje: Integración Claude/LLMs, metodología estructurada

3. **Postiz**
   - Open source + SaaS comercial
   - Aprendizaje: Compliance con plataformas, OAuth oficial, monetización mixta

4. **BillionMail**
   - AGPLv3, email marketing escalable
   - Aprendizaje: Auto-hosted, analytics integradas

5. **EspoCRM**
   - AGPLv3, CRM extensible
   - Aprendizaje: Metadata-driven, REST API, modelo dual (free + services)

6. **Socioboard 5.0**
   - Open source + versión comercial
   - Aprendizaje: Multi-plataforma social, modelo de negocio dual exitoso

7. **Mautic**
   - Open source, marketing automation
   - Aprendizaje: Privacy-first, segmentación ilimitada, comunidad fuerte

---

## 🧠 Lecciones Clave para Nuestro Tracker

### ✅ Qué Funciona (Patrones de Éxito):

1. **Modelo de negocio:** Open source core + SaaS/servicios premium (Socioboard, Postiz)
2. **Arquitectura:** Modular, desacoplada, con APIs claras (ViGenAiR, EspoCRM)
3. **Compliance:** Usar APIs oficiales, no scraping (Postiz enfatiza esto)
4. **Privacidad:** Privacy-first approach aumenta confianza (Mautic)
5. **Licencias:** AGPLv3 permite uso libre pero protege de competencia directa

### ❌ Qué Evitar:

1. **Complejidad innecesaria** - No usar Google Cloud si no es necesario
2. **Vendor lock-in** - Mantenerse agnóstico de cloud
3. **Scraping no autorizado** - Solo APIs oficiales
4. **Monetización poco clara** - Definir modelo desde día 1

---

## 🎯 META ADS COMPETITOR TRACKER - ESPECIFICACIÓN

### 1. QUÉ VA A EXTRAER (Data Sources)

#### A) Meta Ad Library API (OFICIAL - LEGAL ✅)

**Endpoint:** `https://graph.facebook.com/v18.0/ads_archive`

**Datos disponibles públicamente:**

```javascript
{
  id: "12345678",                          // Ad ID único
  ad_creation_time: "2025-01-15T10:30:00", // Fecha creación
  ad_creative_bodies: ["Texto del anuncio"], // Copys
  ad_creative_link_captions: ["CTA text"], // Call-to-action
  ad_creative_link_titles: ["Título"],     // Headlines
  ad_snapshot_url: "https://...",          // Screenshot del ad
  page_name: "Nombre Competidor",          // Página que publica
  page_id: "987654",                       // ID de la página
  ad_delivery_start_time: "2025-01-15",    // Cuándo empezó a mostrarse
  ad_delivery_stop_time: null,             // Cuándo terminó (null = activo)
  estimated_audience_size: {               // Alcance estimado
    lower_bound: 10000,
    upper_bound: 50000
  },
  publisher_platforms: ["facebook", "instagram"], // Dónde se muestra
  spend: {                                 // SOLO para anuncios políticos
    lower_bound: 100,
    upper_bound: 999
  },
  impressions: {                           // SOLO anuncios políticos
    lower_bound: 10000,
    upper_bound: 50000
  },
  demographic_distribution: {...},         // Distribución por edad/género
  region_distribution: {...}               // Por región geográfica
}
```

**⚠️ LIMITACIONES IMPORTANTES:**

1. **NO incluye:**
   - Presupuesto exacto (solo rangos para ads políticos)
   - Métricas de performance (CTR, conversiones, ROAS)
   - Targeting exacto (solo resultado: edad/género/región)
   - Bids o estrategia de puja

2. **SÍ incluye:**
   - ✅ Todos los anuncios activos públicamente
   - ✅ Copys y creatividades completas
   - ✅ Fechas de inicio/fin
   - ✅ Plataformas (FB/IG/Messenger/Audience Network)
   - ✅ Alcance estimado (rangos)
   - ✅ Distribución demográfica resultante

#### B) Datos Derivados (Procesamiento Propio)

**Análisis que generaremos:**

1. **Frecuencia de lanzamiento** - Cuántos ads nuevos/semana
2. **Duración promedio** - Cuánto tiempo corren los ads
3. **Patrones de copys** - Palabras clave, estructura, CTAs
4. **Creatividades** - Screenshots, análisis de imágenes
5. **Estacionalidad** - Cuándo lanzan más campañas
6. **Estrategia de plataforma** - FB vs IG vs ambas
7. **Cambios de estrategia** - Detección de pivotes

---

### 2. QUÉ PROCESARÁ (Pipeline de Datos)

#### Pipeline Completo:

```
┌─────────────────────────────────────────────────────────┐
│  EXTRACCIÓN (Python Script - Cron Daily)                │
├─────────────────────────────────────────────────────────┤
│  1. Meta Ad Library API                                 │
│     - Buscar ads de competidores (search_terms)         │
│     - Buscar por page_id conocidos                      │
│     - Filtrar por geo (Chile = CL)                      │
│     - Paginar resultados (hasta 1,000 por query)        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  ALMACENAMIENTO (PostgreSQL)                            │
├─────────────────────────────────────────────────────────┤
│  Tablas:                                                │
│  - competitors (id, name, page_id, industry, ...)       │
│  - ads (id, competitor_id, created_at, copy, ...)       │
│  - ad_snapshots (ad_id, snapshot_url, downloaded_at)    │
│  - metrics_daily (ad_id, date, is_active, ...)          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  PROCESAMIENTO (Python Analytics)                       │
├─────────────────────────────────────────────────────────┤
│  1. Detección de ads nuevos (alertas)                   │
│  2. Análisis de copys (NLP básico)                      │
│     - Extracción de keywords                            │
│     - Análisis de sentiment                             │
│     - Detección de CTAs                                 │
│  3. Descarga de screenshots                             │
│  4. Generación de métricas agregadas                    │
│  5. Detección de patrones (cambios de estrategia)       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  ENTREGA (Next.js Dashboard + PDF Report)               │
├─────────────────────────────────────────────────────────┤
│  1. Dashboard web en tiempo real                        │
│  2. Reporte PDF mensual automatizado                    │
│  3. Alertas por email (nuevos ads)                      │
│  4. API para integraciones                              │
└─────────────────────────────────────────────────────────┘
```

---

### 3. QUÉ VALOR ENTREGARÁ (Outputs)

#### A) Dashboard en Tiempo Real

**Pantallas:**

1. **Overview del Competidor**
   ```
   📊 Competidor X - Últimos 30 días

   ├─ 🎯 15 anuncios activos
   ├─ 📈 +5 nuevos esta semana
   ├─ ⏱️ Duración promedio: 12 días
   ├─ 📱 Plataformas: 60% FB, 40% IG
   └─ 🎨 3 creatividades diferentes
   ```

2. **Timeline de Anuncios**
   ```
   [Gráfico temporal mostrando cuándo se lanzó cada ad]

   Jan 1  ━━━━━━━━━━━━━━━━━━━  Feb 1
          Ad 1 ████████
             Ad 2 ██████████
                  Ad 3 ████
   ```

3. **Análisis de Copys**
   ```
   🔑 Top Keywords:
   - "Gratis" (8 veces)
   - "Ahora" (6 veces)
   - "Descuento" (5 veces)

   📣 CTAs más usados:
   - "Más información" (40%)
   - "Comprar ahora" (30%)
   - "Solicitar demo" (20%)
   ```

4. **Galería de Creatividades**
   ```
   [Grid de screenshots de ads activos]
   - Filtrable por fecha, plataforma, tipo
   ```

#### B) Reporte Mensual PDF

**Secciones:**

1. **Resumen Ejecutivo**
   - Total de ads lanzados en el mes
   - Comparación vs mes anterior
   - Principales cambios detectados

2. **Análisis de Estrategia**
   - Patrones de lanzamiento
   - Estacionalidad
   - Segmentación geográfica

3. **Benchmarking**
   - Comparación con otros competidores
   - Top performers (ads más duraderos)

4. **Insights Accionables**
   - Oportunidades detectadas
   - Gaps en la estrategia del cliente
   - Recomendaciones

#### C) Alertas Automáticas

**Triggers:**

1. ✅ Competidor lanza nuevo anuncio
2. ✅ Competidor cambia copy de ad existente
3. ✅ Competidor pausa/reactiva campaña
4. ✅ Nuevo competidor detectado en mercado
5. ✅ Cambio significativo en frecuencia de ads

**Delivery:** Email + Slack/WhatsApp (opcional)

---

### 4. CÓMO MONETIZAR (Pricing Strategy)

#### Modelo de Negocio: SaaS + Services

**Inspiración:** Socioboard (open source + comercial) + Postiz (freemium)

#### A) Tiers de Servicio

##### **🥉 BASIC - $150,000 CLP/mes**

```
✅ 5 competidores tracked
✅ Actualizaciones diarias
✅ Dashboard web básico
✅ Reporte PDF mensual
✅ Alertas de nuevos ads
❌ No análisis de copys
❌ No API access
```

**Target:** PyMEs, startups

##### **🥈 PRO - $300,000 CLP/mes**

```
✅ 20 competidores tracked
✅ Actualizaciones 2x/día
✅ Dashboard completo con analytics
✅ Reporte PDF semanal
✅ Alertas en tiempo real
✅ Análisis de copys con NLP
✅ Descarga de screenshots
✅ Exportación de datos (CSV/JSON)
❌ No API access
❌ No integración CRM
```

**Target:** Empresas medianas

##### **🥇 ENTERPRISE - Desde $600,000 CLP/mes**

```
✅ Competidores ilimitados
✅ Actualizaciones tiempo real
✅ Dashboard personalizable
✅ Reportes custom
✅ Alertas multi-canal (Email/Slack/WhatsApp)
✅ Análisis avanzado con IA
✅ API completa (REST)
✅ Integración con CRM/herramientas
✅ Soporte prioritario
✅ Sesiones de estrategia mensuales
```

**Target:** Grandes empresas, agencias

#### B) Add-ons Opcionales

```
💰 Análisis histórico (12 meses previos): $200K one-time
💰 Integración CRM custom: $300K-500K one-time
💰 Informe estratégico trimestral: $250K
💰 Capacitación equipo: $150K/sesión
```

#### C) Proyección de Ingresos

**Escenario Conservador (12 meses):**

| Mes | Basic (5) | Pro (3) | Enterprise (1) | MRR | ARR Acumulado |
|-----|-----------|---------|----------------|-----|---------------|
| 1 | $750K | $0 | $0 | $750K | $750K |
| 3 | $1.5M | $900K | $0 | $2.4M | $7.2M |
| 6 | $2.25M | $1.8M | $600K | $4.65M | $27.9M |
| 12 | $3M | $3M | $1.8M | $7.8M | $93.6M |

**Total Year 1:** ~$94M CLP (~$105K USD)

**Escenario Optimista (12 meses):**

| Mes | Basic (10) | Pro (8) | Enterprise (3) | MRR | ARR |
|-----|------------|---------|----------------|-----|-----|
| 12 | $4.5M | $6M | $3.6M | $14.1M | $169.2M |

**Total Year 1:** ~$169M CLP (~$188K USD)

---

### 5. ES LEGAL? (Compliance y Legalidad)

#### ✅ SÍ ES 100% LEGAL

**Razones:**

1. **API Oficial de Meta**
   - No es scraping
   - Meta proporciona estos datos públicamente
   - Ad Library fue creado por Meta para transparencia

2. **Datos Públicos**
   - Todo lo que extraemos es público
   - Cualquiera puede ver estos ads manualmente
   - Solo automatizamos la búsqueda

3. **Términos de Servicio**
   - Meta Ad Library API Terms permiten este uso
   - No violamos ToS de Facebook/Instagram
   - No accedemos a datos privados

4. **Precedentes**
   - Múltiples empresas hacen esto (AdClarity, Pathmatics, Moat)
   - Es industria standard en competitive intelligence

#### 📋 Requisitos Legales

**Necesitamos:**

1. ✅ **Access Token de Meta**
   - Gratuito, se obtiene creando app en Meta for Developers
   - Sin costo, solo registro

2. ✅ **Rate Limits Respetar**
   - 200 requests/hora (user token)
   - 600 requests/hora (app token)

3. ✅ **Términos de Uso Propios**
   - Disclaimer: "Datos obtenidos de Meta Ad Library pública"
   - No revender datos directamente (vendemos análisis)

4. ✅ **Privacidad de Clientes**
   - GDPR/Chilean privacy law compliant
   - No almacenar datos personales de usuarios finales

#### ⚠️ Límites Éticos

**NO haremos:**

- ❌ Scraping de Facebook/Instagram directamente
- ❌ Acceso a cuentas privadas
- ❌ Violación de ToS
- ❌ Reventa de datos crudos

**SÍ haremos:**

- ✅ Usar API oficial
- ✅ Respetar rate limits
- ✅ Agregar valor (análisis, no solo datos)
- ✅ Ser transparentes sobre fuente de datos

---

### 6. REPOS SON PÚBLICOS? (Open Source Strategy)

#### Estrategia Híbrida (Inspirada en Socioboard + Mautic)

##### **A) Open Source (MIT/Apache 2.0)**

**Qué liberar públicamente:**

```
✅ meta-ads-tracker-core/
   ├── scripts/
   │   ├── extract_ads.py       # Script extracción Meta Ad Library
   │   ├── process_analytics.py  # Analytics básicas
   │   └── generate_report.py    # Generador PDF básico
   ├── database/
   │   └── schema.sql            # Esquema PostgreSQL
   ├── docker/
   │   └── docker-compose.yml    # Setup completo
   └── README.md                 # Documentación
```

**Por qué open source core:**

1. ✅ **Marketing gratuito** - GitHub stars, forks, PRs
2. ✅ **Credibilidad** - Transparencia aumenta confianza
3. ✅ **Comunidad** - Otros contribuyen mejoras
4. ✅ **SEO** - "Meta ads competitor tracker open source"
5. ✅ **Barrera de entrada** - Difícil competir si no tienes know-how

##### **B) Propietario (No Public)**

**Qué mantener privado:**

```
❌ meta-ads-tracker-saas/      # Versión SaaS completa
   ├── frontend/               # Dashboard Next.js avanzado
   ├── api/                    # API REST Enterprise
   ├── ml-models/              # Modelos NLP propios
   ├── integrations/           # CRM connectors
   ├── billing/                # Sistema de pagos
   └── advanced-analytics/     # IA analysis
```

**Por qué mantener privado:**

1. ✅ **Ventaja competitiva** - Features únicos
2. ✅ **Monetización** - El valor real está en la implementación
3. ✅ **Soporte** - Controlamos la experiencia del cliente

#### Modelo de Negocio Final:

```
┌─────────────────────────────────────────────┐
│  OPEN SOURCE (Free, Self-hosted)            │
│  - Script básico de extracción              │
│  - Schema DB                                │
│  - Reportes PDF simples                     │
│  - Docker setup                             │
│                                             │
│  → Genera Leads                             │
│  → Brand Awareness                          │
│  → Comunidad                                │
└─────────────────────────────────────────────┘
                  ↓ UPGRADE
┌─────────────────────────────────────────────┐
│  SAAS HOSTED (Paid)                         │
│  - Dashboard avanzado                       │
│  - Multi-tenant                             │
│  - Analytics con IA                         │
│  - Alertas tiempo real                      │
│  - Soporte                                  │
│  - Integraciones                            │
│                                             │
│  → Revenue Recurrente                       │
│  → Escalable                                │
└─────────────────────────────────────────────┘
```

**Inspiración:** Red Hat, GitLab, Mautic

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico

```
BACKEND:
- Python 3.11+
  ├── FastAPI (API REST)
  ├── SQLAlchemy (ORM)
  ├── Celery (Background jobs)
  ├── Redis (Queue + Cache)
  └── Requests (Meta API client)

DATABASE:
- PostgreSQL 15+
  ├── TimescaleDB extension (time-series)
  └── pg_vector (para embeddings futuros)

FRONTEND:
- Next.js 14
  ├── TypeScript
  ├── Tailwind CSS
  ├── Recharts (visualizaciones)
  └── Shadcn/ui (components)

INFRASTRUCTURE:
- Docker + Docker Compose
- Nginx (reverse proxy)
- Let's Encrypt (SSL)
- Cron (scheduling)

ANALYTICS:
- pandas, numpy
- spaCy (NLP básico)
- Pillow (procesamiento imágenes)
```

### Esquema de Base de Datos

```sql
-- Clientes (para SaaS)
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  plan VARCHAR(50), -- basic, pro, enterprise
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competidores a trackear
CREATE TABLE competitors (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  name VARCHAR(255) NOT NULL,
  page_id VARCHAR(100) NOT NULL,
  page_name VARCHAR(255),
  industry VARCHAR(100),
  country_code VARCHAR(2) DEFAULT 'CL',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, page_id)
);

-- Anuncios extraídos
CREATE TABLE ads (
  id VARCHAR(50) PRIMARY KEY, -- Ad ID de Meta
  competitor_id UUID REFERENCES competitors(id),

  -- Meta data
  ad_creation_time TIMESTAMP,
  ad_delivery_start_time TIMESTAMP,
  ad_delivery_stop_time TIMESTAMP,

  -- Creative
  ad_creative_bodies TEXT[],
  ad_creative_link_titles TEXT[],
  ad_creative_link_captions TEXT[],
  ad_snapshot_url TEXT,

  -- Platform
  publisher_platforms TEXT[],

  -- Audience (estimado)
  estimated_audience_lower INT,
  estimated_audience_upper INT,

  -- Metadata
  first_seen_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,

  -- Análisis (procesado)
  keywords TEXT[],
  sentiment_score FLOAT,
  cta_detected VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Snapshots descargados
CREATE TABLE ad_snapshots (
  id UUID PRIMARY KEY,
  ad_id VARCHAR(50) REFERENCES ads(id),
  snapshot_url TEXT,
  local_path TEXT,
  downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Métricas diarias (tracking histórico)
CREATE TABLE metrics_daily (
  id UUID PRIMARY KEY,
  ad_id VARCHAR(50) REFERENCES ads(id),
  date DATE NOT NULL,
  is_active BOOLEAN,
  platforms_active TEXT[],
  UNIQUE(ad_id, date)
);

-- Alertas generadas
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  competitor_id UUID REFERENCES competitors(id),
  ad_id VARCHAR(50) REFERENCES ads(id),
  alert_type VARCHAR(50), -- new_ad, ad_paused, strategy_change
  message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_ads_competitor ON ads(competitor_id);
CREATE INDEX idx_ads_active ON ads(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_ads_dates ON ads(ad_delivery_start_time, ad_delivery_stop_time);
CREATE INDEX idx_metrics_date ON metrics_daily(date DESC);
```

---

## 📅 ROADMAP DE DESARROLLO

### FASE 1: MVP (Semana 1-2)

**Objetivo:** Producto vendible básico

```
Día 1-2: Setup
[ ] Setup PostgreSQL database
[ ] Schema SQL completo
[ ] Docker Compose (DB + Redis)

Día 3-5: Extracción
[ ] Script Python: Meta Ad Library client
[ ] Función: search ads by competitor page_id
[ ] Función: save to database
[ ] Cron job: daily extraction

Día 6-8: Dashboard Básico
[ ] Next.js project setup
[ ] Página: Lista de competidores
[ ] Página: Timeline de ads
[ ] Página: Detalle de ad individual

Día 9-10: Reporte
[ ] Template PDF básico
[ ] Script: generate monthly report
[ ] Email delivery

Día 11-12: Landing + Deploy
[ ] Landing page del servicio
[ ] Pricing page
[ ] Deploy en servidor
[ ] SSL setup

Día 13-14: Testing + Beta
[ ] Testing con 1-2 competidores reales
[ ] Refinamiento
[ ] Email a 3-5 clientes piloto
```

**Entregable:** Producto funcional para vender a primeros clientes

---

### FASE 2: Refinamiento (Semana 3-4)

```
[ ] Análisis de copys (NLP básico)
[ ] Descarga automática de screenshots
[ ] Sistema de alertas por email
[ ] Dashboard mejorado (gráficos)
[ ] Exportación CSV/JSON
```

---

### FASE 3: Escalamiento (Mes 2-3)

```
[ ] Multi-tenant (múltiples clientes)
[ ] API REST para integraciones
[ ] Analytics avanzadas con IA
[ ] Integración Slack/WhatsApp
[ ] Sistema de billing automatizado
```

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### Esta Semana (Día 1-7):

1. **Confirmar viabilidad legal:** ✅ (Ya confirmado arriba)
2. **Obtener Meta API token:** Crear app en Meta for Developers
3. **Setup database:** PostgreSQL local + schema
4. **Primer script:** Extraer ads de 1 competidor
5. **Validar datos:** Verificar qué datos realmente obtenemos

### Decisiones Requeridas:

1. **¿Open source el core?** → Recomendación: SÍ (marketing + comunidad)
2. **¿Self-hosted o solo SaaS?** → Recomendación: SaaS principalmente, self-hosted enterprise
3. **¿Pricing inicial?** → Recomendación: $150K Basic, $300K Pro
4. **¿Primeros clientes piloto?** → Identificar 3-5 para beta

---

## 📋 CHECKLIST PRE-DESARROLLO

Antes de empezar a programar:

```
[ ] ✅ Confirmado: Es legal (Meta Ad Library API oficial)
[ ] ✅ Confirmado: Datos suficientes (copys, fechas, plataformas)
[ ] ✅ Modelo de negocio claro (SaaS, $150K-600K/mes)
[ ] ✅ Estrategia open source definida (core libre, SaaS privado)
[ ] ⏳ Obtener Meta API token
[ ] ⏳ Validar datos con 1 competidor real
[ ] ⏳ Definir 3-5 clientes beta
[ ] ⏳ Crear landing page de pre-venta
```

---

## 💡 VALOR DIFERENCIAL vs Competencia

**Herramientas existentes (internacionales):**
- AdClarity, Pathmatics, Moat, SEMrush Ad Intelligence

**Ventajas de M&P Tracker:**

1. ✅ **Enfoque LATAM** - Datos de Chile, Argentina, México, etc.
2. ✅ **Precio accesible** - $150K vs $1,000+ USD/mes de internacionales
3. ✅ **Soporte en español** - Atención local
4. ✅ **Integración con servicios M&P** - No standalone, parte de suite
5. ✅ **Insights accionables** - No solo datos, recomendaciones
6. ✅ **Open source option** - Para DIY tech-savvy companies

---

## 🚀 LLAMADO A LA ACCIÓN

**¿Procedemos con el desarrollo del MVP?**

**Si SÍ, próximo paso:**
1. Obtener Meta API token (15 min)
2. Validar extracción de datos con 1 competidor (1 hora)
3. Setup PostgreSQL local (30 min)
4. Primer script funcional (2-3 horas)

**Tiempo total para MVP funcional: 12-14 días**

**Revenue esperado mes 1: $500K-1M CLP** (3-5 clientes beta)

**¿Empezamos?** → SÍ / NO / AJUSTAR ALGO
