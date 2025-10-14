# 🎯 M&P INTELLIGENCE SUITE - Plan de Implementación Completo

## 📋 COMPONENTES CONFIRMADOS

### Core (MVP - 4 semanas):
1. ✅ **Meta Ads Tracker** - Anuncios de competencia
2. ✅ **Google Trends Monitor** - Tendencias de búsqueda Chile
3. ⏳ **Prensa Monitor** - Medios chilenos (Fase 2)

### Add-ons (Futuro):
4. 💎 **PR Intelligence** - Análisis de menciones en prensa
5. 💎 **Social Listening** - Monitoreo de redes sociales

---

## 🛠️ QUÉ NECESITAS PARA EMPEZAR

### 1. ACCESOS Y TOKENS (Día 1)

#### A) Meta API Token
```
✅ GRATIS - Solo registro

Pasos:
1. Ir a: https://developers.facebook.com/apps/
2. Crear nueva app → Tipo: "Business"
3. Agregar producto: "Marketing API"
4. Generar token de acceso
5. Copiar token (guardar en .env)

Tiempo: 10-15 minutos
```

#### B) Configurar Variables de Entorno
```bash
# .env.local
META_ACCESS_TOKEN=EAAxxxxxxxx
DATABASE_URL=postgresql://user:pass@localhost:5432/intelligence
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=re_xxxxx (ya lo tienes)
```

---

### 2. INFRAESTRUCTURA (Día 1-2)

#### A) Base de Datos PostgreSQL

**Opción 1: Vercel Postgres (RECOMENDADO para empezar)**
```
✅ Gratis hasta 256 MB
✅ Auto-scaling
✅ Backups automáticos
✅ Integración directa con Vercel

Plan Hobby (GRATIS):
- 256 MB storage
- 60 horas compute/mes
- Suficiente para 10-20 competidores trackear

Plan Pro ($20 USD/mes):
- 10 GB storage
- 100 horas compute
- Suficiente para 50-100 competidores

Cómo agregar:
1. Dashboard Vercel → Storage → Create Database
2. Seleccionar "Postgres"
3. Copiar DATABASE_URL
```

**Opción 2: Railway (ALTERNATIVA)**
```
✅ $5 USD/mes por 8 GB
✅ PostgreSQL + Redis incluidos
✅ Fácil setup
```

**Opción 3: Self-hosted (Para escalamiento)**
```
✅ DigitalOcean: $12 USD/mes (2GB RAM)
✅ Control total
⚠️ Requiere mantenimiento
```

**Recomendación:** Empezar con Vercel Postgres (gratis), migrar a Railway/DO cuando crezcas.

---

#### B) Redis (Para Colas y Caché)

**Opción 1: Upstash Redis (RECOMENDADO)**
```
✅ GRATIS hasta 10,000 comandos/día
✅ Integración directa con Vercel
✅ Global edge

Plan Free:
- 10K comandos/día
- 256 MB storage
- Suficiente para MVP

Cómo agregar:
1. Dashboard Vercel → Storage → Create Database
2. Seleccionar "KV (Redis)"
3. Copiar REDIS_URL
```

**Opción 2: Railway Redis**
```
✅ Incluido con PostgreSQL
✅ $5 USD/mes total
```

**Recomendación:** Upstash (gratis) para empezar.

---

#### C) Servidor Python (Background Jobs)

**Problema:** Vercel NO soporta procesos Python de larga duración

**Solución: Vercel Cron + Serverless Functions**
```
✅ Cron jobs ejecutan scripts Python periódicamente
✅ Serverless functions para procesamiento
✅ Todo en Vercel (no servidor adicional)

Limitación:
- Max 10 segundos por función (Hobby)
- Max 60 segundos (Pro - $20/mes)

Para trabajos largos (scraping):
→ Usar Railway ($5/mes) o DigitalOcean ($6/mes)
```

**Setup Recomendado MVP:**
```
┌─────────────────────────────────────────┐
│  VERCEL (Frontend + API Routes)         │
│  - Next.js dashboard                    │
│  - API endpoints (Meta Ads, Trends)     │
│  - Cron jobs (triggers)                 │
│  Costo: GRATIS (Hobby plan)             │
└─────────────────────────────────────────┘
              ↓ triggers
┌─────────────────────────────────────────┐
│  RAILWAY (Python Background Worker)     │
│  - Celery workers                       │
│  - Scraping scripts                     │
│  - PostgreSQL                           │
│  - Redis                                │
│  Costo: $5-10 USD/mes                   │
└─────────────────────────────────────────┘
```

**Alternativa Todo-en-Vercel (si scripts son <60s):**
```
┌─────────────────────────────────────────┐
│  VERCEL PRO ($20/mes)                   │
│  - Next.js dashboard                    │
│  - API Routes (Python con Runtime)      │
│  - Serverless functions (60s timeout)   │
│  - Vercel Postgres                      │
│  - Upstash Redis                        │
│  Costo total: $20/mes                   │
└─────────────────────────────────────────┘
```

---

### 3. RESUMEN DE COSTOS

#### Escenario 1: MVP Mínimo (Recomendado)
```
Vercel Hobby:           $0/mes
Vercel Postgres:        $0/mes (256 MB)
Upstash Redis:          $0/mes (10K comandos)
Railway (Python):       $5/mes
────────────────────────────────
TOTAL:                  $5 USD/mes (~$4.5K CLP)
```

#### Escenario 2: Producción Pequeña
```
Vercel Pro:             $20/mes
Vercel Postgres Pro:    $20/mes (10 GB)
Upstash Pro:            $10/mes
Railway:                $10/mes
────────────────────────────────
TOTAL:                  $60 USD/mes (~$54K CLP)
```

#### Escenario 3: Escala (50+ clientes)
```
Vercel Pro:             $20/mes
DigitalOcean DB:        $15/mes (25 GB)
Railway Workers:        $20/mes
Upstash Pro:            $20/mes
────────────────────────────────
TOTAL:                  $75 USD/mes (~$68K CLP)
```

**Con 10 clientes a $200K/mes = $2M/mes → Costo infra: 2.7%**

**Recomendación:** Empezar con Escenario 1 ($5/mes), escalar según necesidad.

---

## 🎨 CÓMO SE VERÁ EN LA WEB

### A) ESTRUCTURA DEL SITIO

```
www.mulleryperez.cl/
├── intelligence/                    # Landing del servicio
│   ├── meta-ads                     # Detalle Meta Ads Tracker
│   ├── google-trends                # Detalle Google Trends
│   ├── prensa-monitor               # Detalle Prensa Monitor (futuro)
│   └── pricing                      # Planes y precios
│
├── dashboard/intelligence/          # App principal (requiere login)
│   ├── overview                     # Dashboard principal
│   ├── competitors                  # Lista de competidores
│   │   └── [id]                     # Detalle de competidor
│   │       ├── ads                  # Timeline de ads
│   │       ├── creatives            # Galería de creatividades
│   │       └── insights             # Análisis y reportes
│   ├── trends                       # Google Trends monitor
│   ├── alerts                       # Centro de alertas
│   └── settings                     # Configuración
│
└── api/intelligence/                # API endpoints
    ├── meta-ads/extract             # Cron job extracción
    ├── meta-ads/search              # Búsqueda manual
    ├── trends/extract               # Trends data
    └── alerts/send                  # Envío de alertas
```

---

### B) WIREFRAMES PANTALLAS PRINCIPALES

#### 1. Landing Page (`/intelligence`)

```
╔════════════════════════════════════════════════════════════╗
║  🎯 M&P Intelligence Suite                     [Login] [Demo]║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║         Descubre Qué Hace Tu Competencia                  ║
║         Antes Que Todos Los Demás                         ║
║                                                            ║
║    [Ver Demo Gratis]    [Agendar Llamada]                ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ║
║  │ 📊 Meta Ads  │  │ 📈 Trends    │  │ 📰 Prensa    │    ║
║  │              │  │              │  │              │    ║
║  │ Tracking de  │  │ Tendencias   │  │ Monitoreo    │    ║
║  │ anuncios de  │  │ búsqueda     │  │ de medios    │    ║
║  │ competidores │  │ Chile        │  │ chilenos     │    ║
║  └──────────────┘  └──────────────┘  └──────────────┘    ║
╠════════════════════════════════════════════════════════════╣
║  🎯 Casos de Uso:                                         ║
║  • "Detectamos que tu competidor lanzó 5 nuevas          ║
║     campañas esta semana"                                 ║
║  • "El término 'marketing digital santiago' creció        ║
║     +400% este mes"                                       ║
║  • "Tu industria aparece 15% más en prensa vs mes         ║
║     anterior"                                             ║
╠════════════════════════════════════════════════════════════╣
║  💰 Pricing:                                              ║
║  Basic $150K  | Pro $300K  | Enterprise $600K            ║
╚════════════════════════════════════════════════════════════╝
```

---

#### 2. Dashboard Principal (`/dashboard/intelligence/overview`)

```
╔════════════════════════════════════════════════════════════╗
║ M&P Intelligence      [Competidores] [Trends] [Alertas 🔴3]║
╠════════════════════════════════════════════════════════════╣
║  📊 Resumen Últimos 30 Días                               ║
╠════════════════════════════════════════════════════════════╣
║  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ ║
║  │ 🎯 15          │  │ 📈 +8          │  │ 🔥 3         │ ║
║  │ Competidores   │  │ Nuevos Ads     │  │ Alertas Hoy  │ ║
║  │ Activos        │  │ Esta Semana    │  │              │ ║
║  └────────────────┘  └────────────────┘  └──────────────┘ ║
╠════════════════════════════════════════════════════════════╣
║  🚨 Alertas Recientes:                                    ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ 🔴 Competidor X lanzó 3 nuevos ads hoy               │ ║
║  │    📅 Hace 2 horas                     [Ver detalles]│ ║
║  ├──────────────────────────────────────────────────────┤ ║
║  │ 🟡 Término "marketing b2b" subió +250%               │ ║
║  │    📅 Hace 5 horas                     [Ver análisis]│ ║
║  └──────────────────────────────────────────────────────┘ ║
╠════════════════════════════════════════════════════════════╣
║  📊 Top Competidores por Actividad:                       ║
║  1. Agencia X ████████████ 12 ads activos                ║
║  2. Agencia Y ███████     7 ads activos                   ║
║  3. Agencia Z █████       5 ads activos                   ║
╚════════════════════════════════════════════════════════════╝
```

---

#### 3. Detalle de Competidor (`/dashboard/intelligence/competitors/[id]`)

```
╔════════════════════════════════════════════════════════════╗
║ ← Volver    Agencia Competidora X                [Exportar]║
╠════════════════════════════════════════════════════════════╣
║  Tabs: [📊 Overview] [🎯 Ads] [🎨 Creatividades] [📈 Insights]║
╠════════════════════════════════════════════════════════════╣
║  📊 Métricas Últimos 30 Días                              ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    ║
║  │ 15 Ads   │ │ +5 Nuevos│ │ 12 días  │ │ FB: 60%  │    ║
║  │ Activos  │ │ Semana   │ │ Duración │ │ IG: 40%  │    ║
║  └──────────┘ └──────────┘ └──────────┘ └──────────┘    ║
╠════════════════════════════════════════════════════════════╣
║  📅 Timeline de Anuncios (Últimos 90 días)                ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Ene 1    Ene 15    Feb 1    Feb 15    Mar 1         │ ║
║  │   Ad 1 ████████                                      │ ║
║  │      Ad 2 ██████████                                 │ ║
║  │         Ad 3 ████                                    │ ║
║  │            Ad 4 ██████████████████                   │ ║
║  └──────────────────────────────────────────────────────┘ ║
╠════════════════════════════════════════════════════════════╣
║  🔑 Top Keywords en Copys:                                ║
║  • "Gratis" (8 veces)                                     ║
║  • "Ahora" (6 veces)                                      ║
║  • "Descuento" (5 veces)                                  ║
╠════════════════════════════════════════════════════════════╣
║  📣 CTAs Más Usados:                                      ║
║  [Más información] 40%  [Comprar ahora] 30%              ║
╚════════════════════════════════════════════════════════════╝
```

---

#### 4. Galería de Ads (`/dashboard/intelligence/competitors/[id]/ads`)

```
╔════════════════════════════════════════════════════════════╗
║ Agencia X - Anuncios Activos                              ║
╠════════════════════════════════════════════════════════════╣
║  Filtros: [Activos ▼] [Facebook ▼] [Últimos 30d ▼]       ║
╠════════════════════════════════════════════════════════════╣
║  Grid de Anuncios:                                        ║
║  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐║
║  │ [Screenshot]   │ │ [Screenshot]   │ │ [Screenshot]   │║
║  │                │ │                │ │                │║
║  │ "Aumenta tu    │ │ "Gratis por    │ │ "Solicita tu   │║
║  │ ROAS en 30..."│ │ tiempo limi..." │ │ demo ahora"    │║
║  │                │ │                │ │                │║
║  │ 📅 15 Ene 2025 │ │ 📅 18 Ene 2025 │ │ 📅 20 Ene 2025 │║
║  │ 📱 FB + IG     │ │ 📱 FB only     │ │ 📱 IG only     │║
║  │ [Ver detalle]  │ │ [Ver detalle]  │ │ [Ver detalle]  │║
║  └────────────────┘ └────────────────┘ └────────────────┘║
║  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐║
║  │ [Screenshot]   │ │ [Screenshot]   │ │ [Screenshot]   │║
║  │       ...      │ │       ...      │ │       ...      │║
║  └────────────────┘ └────────────────┘ └────────────────┘║
╚════════════════════════════════════════════════════════════╝
```

---

#### 5. Google Trends Monitor (`/dashboard/intelligence/trends`)

```
╔════════════════════════════════════════════════════════════╗
║ 📈 Google Trends - Marketing Digital Chile                ║
╠════════════════════════════════════════════════════════════╣
║  🔥 Términos Rising (Últimos 30 días)                     ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ 1. "agencia marketing digital santiago" +40,650% 🚀  │ ║
║  │ 2. "diplomado marketing digital"        +700%        │ ║
║  │ 3. "hubspot"                            +400%        │ ║
║  │ 4. "marketing digital pymes"            +300%        │ ║
║  └──────────────────────────────────────────────────────┘ ║
╠════════════════════════════════════════════════════════════╣
║  📊 Interés por Plataforma (Últimos 12 meses)             ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Google Ads    ████████████████████ 75.9              │ ║
║  │ Facebook Ads  ████ 19.3                              │ ║
║  │ Instagram Ads █ 1.3                                  │ ║
║  │ TikTok Ads    █ 0.5                                  │ ║
║  └──────────────────────────────────────────────────────┘ ║
╠════════════════════════════════════════════════════════════╣
║  🗺️ Top Regiones Buscando "Marketing Digital"            ║
║  1. XI Región            ████████ 39                      ║
║  2. Región de Tarapacá   ████████ 38                      ║
║  3. Región de los Ríos   ████████ 36                      ║
╚════════════════════════════════════════════════════════════╝
```

---

### C) NAVEGACIÓN MOBILE

```
┌─────────────────────┐
│ ☰  M&P Intelligence │
├─────────────────────┤
│ 📊 Dashboard        │
│ 🎯 Competidores (3) │
│ 📈 Trends           │
│ 🔔 Alertas [3]      │
│ ⚙️  Configuración   │
└─────────────────────┘
```

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Completo:

```
FRONTEND (Next.js 14)
├── /app/intelligence/          # Landing pages
├── /app/dashboard/intelligence/# Dashboard app
├── /components/intelligence/   # Componentes reutilizables
└── /lib/intelligence/          # Utilidades

BACKEND (API Routes + Python)
├── /app/api/intelligence/
│   ├── meta-ads/
│   │   ├── extract/route.ts    # Cron trigger
│   │   └── search/route.ts     # Manual search
│   ├── trends/
│   │   └── extract/route.ts    # Trends extraction
│   └── alerts/
│       └── send/route.ts       # Email alerts
│
└── /python/intelligence/       # Python scripts
    ├── meta_ads_scraper.py
    ├── trends_analyzer.py
    └── report_generator.py

DATABASE (PostgreSQL)
├── clients
├── competitors
├── ads
├── ad_snapshots
├── metrics_daily
└── alerts

JOBS (Cron en Vercel)
├── Daily: Extract Meta Ads (6am CL)
├── Weekly: Generate reports (Lunes 8am)
├── Monthly: Trends analysis (1ro del mes)
```

---

## 📅 ROADMAP DESARROLLO - 4 SEMANAS

### SEMANA 1: Foundation

**Día 1-2: Setup Infraestructura**
```
[ ] Crear Vercel Postgres database
[ ] Crear Upstash Redis
[ ] Setup Railway para Python workers
[ ] Configurar .env con todos los tokens
[ ] Crear schema PostgreSQL completo
```

**Día 3-4: Meta Ads Extractor**
```
[ ] Python script: Meta Ad Library client
[ ] Función: search_ads_by_page_id()
[ ] Función: save_to_database()
[ ] Test: Extraer ads de 1 competidor real
[ ] Validar: Qué datos obtenemos realmente
```

**Día 5-7: Backend API**
```
[ ] API Route: /api/intelligence/meta-ads/extract
[ ] API Route: /api/intelligence/meta-ads/search
[ ] Integración con PostgreSQL
[ ] Cron job: Ejecución diaria 6am
```

**Entregable Semana 1:** Extracción automática funcionando

---

### SEMANA 2: Dashboard Básico

**Día 8-10: UI Components**
```
[ ] Layout dashboard intelligence
[ ] Página: /dashboard/intelligence/overview
[ ] Página: /dashboard/intelligence/competitors
[ ] Componente: CompetitorCard
[ ] Componente: AdTimeline (básico)
```

**Día 11-12: Detalle Competidor**
```
[ ] Página: /dashboard/intelligence/competitors/[id]
[ ] Tab: Overview con métricas
[ ] Tab: Ads con grid de anuncios
[ ] Modal: Detalle de ad individual
```

**Día 13-14: Google Trends**
```
[ ] Python script: pytrends integration
[ ] API Route: /api/intelligence/trends/extract
[ ] Página: /dashboard/intelligence/trends
[ ] Visualización: Gráficos con Recharts
```

**Entregable Semana 2:** Dashboard navegable con datos reales

---

### SEMANA 3: Features Avanzados

**Día 15-17: Análisis de Copys**
```
[ ] NLP básico con spaCy
[ ] Extracción de keywords
[ ] Detección de CTAs
[ ] Sentiment analysis básico
[ ] Visualización en dashboard
```

**Día 18-19: Sistema de Alertas**
```
[ ] Detector: Nuevos ads (comparar con día anterior)
[ ] Detector: Cambios de estrategia
[ ] Email template para alertas
[ ] Integración con Resend
[ ] Centro de alertas en dashboard
```

**Día 20-21: Reportes PDF**
```
[ ] Template PDF con Puppeteer
[ ] Generación mensual automática
[ ] Secciones: Resumen, insights, recomendaciones
[ ] Envío por email
```

**Entregable Semana 3:** Alertas y reportes funcionando

---

### SEMANA 4: Polish & Launch

**Día 22-24: Landing Pages**
```
[ ] /intelligence - Landing principal
[ ] /intelligence/pricing - Planes
[ ] /intelligence/meta-ads - Detalle producto
[ ] /intelligence/google-trends - Detalle producto
[ ] Formulario de contacto/demo
```

**Día 25-26: Testing & Refinamiento**
```
[ ] Test completo con 3-5 competidores
[ ] Validar extracción diaria
[ ] Verificar alertas
[ ] Performance optimization
[ ] Mobile responsive
```

**Día 27-28: Beta Launch**
```
[ ] Deploy a producción
[ ] Documentación para clientes
[ ] Email a 5-10 clientes potenciales
[ ] Setup onboarding de primeros beta users
```

**Entregable Semana 4:** Producto en producción con beta users

---

## 💰 PRICING FINAL

### Plan BASIC - $150,000 CLP/mes
```
✅ 5 competidores tracked
✅ Actualizaciones diarias
✅ Dashboard web básico
✅ Google Trends monitor
✅ Reporte PDF mensual
✅ Alertas email (nuevos ads)
❌ No análisis NLP
❌ No API access
```

### Plan PRO - $300,000 CLP/mes
```
✅ 20 competidores tracked
✅ Actualizaciones 2x/día
✅ Dashboard completo
✅ Google Trends avanzado
✅ Reporte PDF semanal
✅ Alertas tiempo real (email + Slack)
✅ Análisis de copys con NLP
✅ Descarga de screenshots
✅ Exportación CSV/JSON
❌ No API access
```

### Plan ENTERPRISE - Desde $600,000 CLP/mes
```
✅ Competidores ilimitados
✅ Actualizaciones tiempo real
✅ Todo de Pro +
✅ API REST completa
✅ Prensa Monitor incluido
✅ Integración CRM
✅ Soporte prioritario
✅ Sesión estratégica mensual
✅ White label (opcional)
```

---

## 📋 CHECKLIST PRE-LANZAMIENTO

### Técnico:
```
[ ] Meta API token funcionando
[ ] PostgreSQL con schema completo
[ ] Redis funcionando
[ ] Python scripts testeados
[ ] Cron jobs configurados
[ ] Dashboard responsive
[ ] SSL/HTTPS configurado
[ ] Backups automáticos DB
```

### Negocio:
```
[ ] Landing page publicada
[ ] Pricing definido
[ ] Términos de servicio
[ ] Política de privacidad
[ ] Proceso de onboarding documentado
[ ] Email templates (alertas, reportes)
[ ] Sales deck (presentación ventas)
[ ] 3-5 clientes beta identificados
```

---

## 🎯 PRÓXIMO PASO INMEDIATO

**AHORA MISMO (próximas 2 horas):**

1. ✅ Obtener Meta API token (15 min)
2. ✅ Setup Vercel Postgres (10 min)
3. ✅ Setup Upstash Redis (10 min)
4. ✅ Crear schema PostgreSQL (30 min)
5. ✅ Primer test: Extraer ads de 1 competidor (1 hora)

**¿Empezamos con el paso 1: Obtener Meta API token?**

Te guío paso a paso por el proceso.
