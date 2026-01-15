# Muller y Pérez - Landing & CRM

**URL Producción:** https://www.mulleryperez.cl
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase, Vercel

---

## Descripción General

Plataforma completa de marketing digital para la agencia M&P que incluye:
- Landing page principal con SEO optimizado
- CRM para gestión de leads y clientes
- M&P Labs: herramientas avanzadas de marketing
- Utilidades: calculadoras simples
- Sistema de cotizaciones
- ChatBot inteligente (Mutante)

---

## Estructura del Proyecto

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing principal
│   ├── labs/                     # M&P Labs (herramientas avanzadas)
│   ├── utilidades/               # Calculadoras simples
│   ├── crm/                      # Sistema CRM completo
│   ├── servicios/                # Páginas de servicios SEO
│   ├── industrias/               # Páginas por industria
│   ├── cotizador/                # Cotizador público
│   ├── blog/                     # Blog con artículos
│   └── api/                      # APIs del backend
├── components/                   # Componentes React
│   ├── ChatBot/                  # ChatBot Mutante
│   └── ...
├── lib/                          # Lógica de negocio
│   ├── engine/                   # Motor de cálculos y predicciones
│   ├── config/                   # Configuraciones (industrias, CPC, etc.)
│   ├── chatbot/                  # Árbol de decisión del chatbot
│   ├── utils/                    # Utilidades (UTM tracking, PDF, etc.)
│   └── auth/                     # Autenticación simple
└── public/                       # Assets estáticos
```

---

## M&P Labs (`/labs`)

Herramientas avanzadas de marketing digital:

| Herramienta | URL | Descripción |
|-------------|-----|-------------|
| **Predictor Google Ads** | `/labs/predictor` | Predice conversiones y revenue según presupuesto e industria |
| **Calculadora ROI** | `/labs/calculadora-roi` | Calcula inversión necesaria para alcanzar objetivos |
| **Comparador Plataformas** | `/labs/comparador-plataformas` | Compara Google Ads vs Meta Ads vs LinkedIn |
| **Generador de Copies** | `/labs/generador-copies` | Genera textos para ads con IA |
| **Buyer Gen** | `/labs/buyer-gen` | Genera perfiles de buyer personas |
| **Radar Industrias** | `/labs/radar-industrias` | Análisis de madurez digital por industria |
| **M&P Intelligence** | `/labs/mp-intelligence` | Red de benchmarks colaborativos |

### Motor de Predicción

El motor está en `lib/engine/` y usa:
- `benchmarks-2024-verificados.ts` - Benchmarks por industria (CTR, CVR, CPC)
- `motor-calculo-2024.ts` - Lógica de cálculos
- `cpc-calibrado-chile.ts` - CPCs por industria en Chile
- 22 industrias configuradas en `lib/config/industries.ts`

---

## Utilidades (`/utilidades`)

Calculadoras simples para usuarios:

| Utilidad | URL | Descripción |
|----------|-----|-------------|
| Calculadora CAC | `/utilidades/calculadora-cac` | Costo de Adquisición de Cliente |
| Calculadora LTV | `/utilidades/calculadora-ltv` | Lifetime Value |
| Calculadora ROI/ROAS | `/utilidades/calculadora-roi-roas` | Retorno de inversión |
| Comparador Web | `/utilidades/comparador-web` | Compara sitios web |
| Generador Funnels | `/utilidades/generador-funnels` | Diseña funnels de conversión |
| Juega y Aprende | `/utilidades/juega-aprende` | Quiz interactivo |

---

## CRM (`/crm`)

Sistema completo de gestión de clientes y leads.

### Acceso
- **Admin:** `/crm/login` → Dashboard admin
- **Cliente:** `/crm/login` → Dashboard cliente

### Módulos Admin

| Módulo | URL | Descripción |
|--------|-----|-------------|
| Dashboard | `/crm` | Vista general |
| Clientes | `/crm/clientes` | CRUD de clientes |
| Cotizaciones | `/crm/cotizaciones` | Gestión de cotizaciones |
| Usuarios | `/crm/usuarios` | Gestión de usuarios CRM |
| Plantillas | `/crm/plantillas` | Plantillas de cotización |
| Métricas | `/crm/metricas` | KPIs generales |
| Integraciones | `/crm/integraciones` | Zapier, Meta, Google |

### Módulos Cliente

| Módulo | URL | Descripción |
|--------|-----|-------------|
| Dashboard | `/crm/cliente/dashboard` | Métricas del cliente, leads, fuentes |
| Cotizaciones | `/crm/cliente/cotizaciones` | Ver cotizaciones recibidas |
| ChatBot | `/crm/cliente/chatbot` | Estadísticas del chatbot |

### Dashboard Cliente - Funcionalidades

1. **Métricas principales:** Total leads, contactados, vendidos, CPF, ROAS, ROA
2. **Leads por Fuente:** Breakdown visual de leads por origen (Google Ads, Meta, Orgánico, etc.)
3. **Filtros de fecha:** Permite filtrar métricas por rango
4. **Tabla de leads:** Con semáforo de tiempo sin contacto
5. **Exportar:** CSV y vCard (contactos)
6. **Agregar lead manual:** Con clasificación de fuente

### Cálculo de Métricas

El CRM calcula las métricas considerando:
- **Inversión total** = inversión_mensual × meses desde primer lead
- **Mes actual** se calcula proporcional al día
- **Leads de test** se excluyen automáticamente (palabras: test, prueba, demo, etc.)

Código en: `app/api/crm/metricas/route.ts`

### Tracking de Fuentes

El sistema detecta automáticamente el origen del lead:

| Parámetro | Clasificación |
|-----------|---------------|
| `gclid` en URL | Google Ads |
| `utm_source=google` + `utm_medium=cpc` | Google Ads |
| `fbclid` en URL | Meta Ads |
| Fuente `zapier` | Meta Ads |
| Referrer google.com sin gclid | Orgánico |
| Sin referrer | Directo |
| Referrer externo | Referido |

Código en: `lib/utils/utm-tracking.ts`

---

## APIs (`/api`)

### Leads

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/leads` | POST | Captura lead del predictor |
| `/api/leads/zapier` | POST | Webhook para Zapier (Meta Ads) |
| `/api/chatbot/lead` | POST | Lead desde ChatBot Mutante |
| `/api/crm/leads` | GET/POST/PATCH/DELETE | CRUD de leads |
| `/api/crm/add-lead-manual` | POST | Agregar lead manualmente |

### CRM

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/crm/clientes` | GET/POST/PATCH | Gestión de clientes |
| `/api/crm/metricas` | GET | KPIs calculados |
| `/api/crm/cotizaciones` | GET/POST | Cotizaciones |

### ChatBot

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/chatbot/session` | POST/PATCH | Sesiones de chat |
| `/api/chatbot/message` | POST | Mensajes del chat |
| `/api/chatbot/lead` | POST | Captura lead + envía emails |

### Otros

| Endpoint | Descripción |
|----------|-------------|
| `/api/auth/session` | Autenticación |
| `/api/predictions/*` | Motor de predicciones |
| `/api/intelligence/*` | M&P Intelligence |

---

## ChatBot Mutante

ChatBot inteligente con árbol de decisión.

- **Componente:** `components/ChatBot/ChatBot.tsx`
- **Árbol de decisión:** `lib/chatbot/decision-tree.ts`
- **Funcionalidades:**
  - Árbol de decisión configurable
  - Captura de leads con tracking de fuente automático
  - Envío de emails automáticos (Resend)
  - Estadísticas de sesiones

---

## Base de Datos (Supabase)

### Tablas Principales

```sql
-- Clientes de la agencia
clientes (
  id UUID PRIMARY KEY,
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  industria TEXT,
  inversion_mensual NUMERIC,
  activo BOOLEAN,
  created_at TIMESTAMP
)

-- Leads capturados
leads (
  id SERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id),
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  nombre_empresa TEXT,
  fuente TEXT,           -- google_ads, meta_ads, organico, directo, zapier, etc.
  form_nombre TEXT,
  observaciones TEXT,
  contactado BOOLEAN,
  vendido BOOLEAN,
  monto_vendido NUMERIC,
  fecha_ingreso TIMESTAMP,
  mes_ingreso TEXT       -- YYYY-MM
)

-- Usuarios del CRM
crm_usuarios (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password_hash TEXT,
  nombre TEXT,
  email TEXT,
  role TEXT,             -- 'admin' o 'cliente'
  cliente_id UUID,       -- Solo para role='cliente'
  activo BOOLEAN
)

-- Sesiones del ChatBot
chat_sessions (
  id UUID PRIMARY KEY,
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  empresa TEXT,
  intent_score TEXT,
  landing_page TEXT,
  referrer TEXT,
  created_at TIMESTAMP,
  ended_at TIMESTAMP
)

-- Cotizaciones
cotizaciones (
  id UUID PRIMARY KEY,
  cliente_id UUID,
  lead_id INTEGER,
  numero TEXT,
  items JSONB,
  total NUMERIC,
  estado TEXT,
  created_at TIMESTAMP
)
```

---

## Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Resend (emails)
RESEND_API_KEY=re_xxx

# Admin
ADMIN_SECRET=myp2025admin
```

---

## Despliegue

### Vercel

```bash
# Build
npm run build

# Deploy producción
vercel --prod
```

### Dominios configurados
- mulleryperez.cl (principal)
- www.mulleryperez.cl

---

## Industrias Soportadas

22 industrias con benchmarks específicos para Chile:

1. Ecommerce
2. Tecnología/SaaS
3. Servicios Profesionales
4. Salud/Medicina
5. Educación Online
6. Inmobiliaria
7. Automotriz
8. Fintech
9. Moda/Retail
10. Turismo
11. Construcción/Remodelación
12. Veterinaria/Mascotas
13. Deportes/Fitness
14. Gastronomía/Delivery
15. Seguros
16. Energía/Solar
17. Legal/Abogados
18. Belleza/Estética
19. Logística/Transporte
20. Agricultura
21. B2B Software
22. Manufactura

Configuración en: `lib/config/industries.ts`

---

## Páginas SEO

### Servicios
- `/servicios/google-ads-chile`
- `/servicios/meta-ads-chile`
- `/servicios/facebook-ads-chile`
- `/servicios/instagram-ads-chile`
- `/servicios/seo-chile`
- `/servicios/performance-marketing`

### Landing pages SEO
- `/agencia-marketing-digital-chile`
- `/agencia-marketing-digital-santiago`
- `/agencia-marketing-digital-vina-del-mar`
- `/consultora-marketing-digital-chile`
- `/cuanto-cuesta-agencia-marketing-digital-chile`
- `/comparativa-agencias-marketing-digital-chile`
- `/google-ads-vs-meta-ads-chile`
- `/marketing-digital-b2b-chile`
- `/marketing-digital-fintech-chile`
- `/marketing-digital-educacion-chile`
- `/marketing-digital-servicios-profesionales-chile`

---

## Blog

URL: `/blog`

Artículos sobre marketing digital:
- IA Generativa en Marketing
- Marketing sin Cookies
- TikTok vs Instagram Reels
- Y más...

---

## Archivos Clave para Desarrollo

| Archivo | Descripción |
|---------|-------------|
| `app/page.tsx` | Landing principal |
| `app/labs/page.tsx` | Índice de M&P Labs |
| `app/crm/cliente/dashboard/page.tsx` | Dashboard cliente (leads, métricas, fuentes) |
| `components/ChatBot/ChatBot.tsx` | ChatBot Mutante |
| `lib/engine/benchmarks-2024-verificados.ts` | Benchmarks por industria |
| `lib/config/industries.ts` | Configuración de industrias |
| `lib/utils/utm-tracking.ts` | Tracking automático de fuentes |
| `lib/chatbot/decision-tree.ts` | Árbol de decisión del chatbot |
| `app/api/crm/metricas/route.ts` | Cálculo de KPIs |
| `app/api/chatbot/lead/route.ts` | Captura de leads del chatbot |
| `app/api/leads/zapier/route.ts` | Webhook para Meta Ads via Zapier |

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Deploy
vercel --prod
```

---

## Integraciones

### Zapier (Meta Ads)
- Endpoint: `POST /api/leads/zapier`
- Requiere: `client_id` en el body
- Campos soportados: full_name, email, phone_number, company, etc.

### Google Ads
- Auto-tagging detecta `gclid` automáticamente
- O usar UTM: `?utm_source=google&utm_medium=cpc&utm_campaign=nombre`

### Resend (Emails)
- Envío de notificaciones de leads
- Confirmación al usuario
- Configurado en: `lib/email/resend-service.ts`

---

## Contacto

- **Web:** https://www.mulleryperez.cl
- **Email:** contacto@mulleryperez.cl
- **WhatsApp:** +56 9 9225 8137

---

*Documentación actualizada: Enero 2026*
