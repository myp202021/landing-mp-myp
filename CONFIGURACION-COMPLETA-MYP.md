# Configuración Completa - www.mulleryperez.cl

**DOCUMENTO MAESTRO DE CONFIGURACIÓN**
**Última actualización:** Enero 2026

---

## 1. CREDENCIALES DE SERVICIOS

### Vercel
- **Proyecto:** landing-mp-myp
- **Team:** christophers-projects-2823b4cc
- **Región:** gru1 (São Paulo)
- **URL Producción:** https://www.mulleryperez.cl
- **Dashboard:** https://vercel.com/christophers-projects-2823b4cc/landing-mp-myp

### Supabase (Base de Datos)
- **URL:** https://faitwrutauavjwnsnlzq.supabase.co
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY3NDcxNywiZXhwIjoyMDc3MjUwNzE3fQ.19K4-XCB-M6foGQ1b3yHXWUR9nyLR1R1dqHYVefGfx8`

### Meta (Facebook/Instagram)
- **App ID:** 1389537399297748
- **App Secret:** 787111bcec23f2c254e0dbd1748d24bc
- **Redirect URI:** https://www.mulleryperez.cl/api/auth/meta/callback
- **Pixel ID:** 555544348819002

### Google
- **Sheets API Key:** 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
- **Sheet ID:** 1GSZsjU1G8EImnEgXjfOTev77pMPH-WHtXzGhAtY-jtQ
- **GA4:** G-QV8Y7X4ZC2
- **GTM:** GTM-58VSTLZ

### Resend (Email)
- **API Key:** re_9fLk231R_7aNHqQE57aeKTnV7vMaTqiHA
- **Email de envío:** contacto@mulleryperez.cl

### GitHub
- **Repo:** https://github.com/myp202021/landing-mp-myp
- **Branch principal:** main

---

## 2. ACCESOS CRM

### Admin (Acceso Total)
- **URL:** https://www.mulleryperez.cl/login
- **Usuario:** admin
- **Contraseña:** myp2025

### Portal Cliente
- **URL:** https://www.mulleryperez.cl/login
- **ID Cliente M&P:** b1f839a4-db36-4341-b1b3-7d1ec290ca02
- **Contraseña Universal:** mypcliente2025

---

## 3. CLOUDFLARE

### DNS
- Dominio: mulleryperez.cl
- Proxy: Activado (naranja)
- SSL: Full (strict)

### Configuración AI Bots
- **Ubicación:** Security > Bots > AI Crawl Control
- **Estado:** Todos los bots permitidos (GPTBot, ClaudeBot, PerplexityBot, etc.)
- **robots.txt:** Manejado por Next.js, NO por Cloudflare

---

## 4. ESTRUCTURA DE BASE DE DATOS (Supabase)

### Tabla: clientes
```sql
id (uuid, primary key)
nombre (text)
email (text)
empresa (text)
telefono (text)
activo (boolean)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

### Tabla: leads
```sql
id (int8, primary key)
cliente_id (uuid, foreign key -> clientes.id)
fuente (text) - 'facebook_lead_ads', 'manual', etc.
nombre (text)
apellido (text)
email (text)
telefono (text)
empresa (text)
ciudad (text)
region (text)
mensaje (text)
presupuesto (text)
servicio (text)
rubro (text)
campana_nombre (text)
adset_nombre (text)
ad_nombre (text)
form_nombre (text)
meta_lead_id (text)
contactado (boolean)
fecha_contacto (date)
vendido (boolean)
monto_vendido (numeric)
razon_no_venta (text)
observaciones (text)
notas (text)
fecha_ingreso (timestamptz)
mes_ingreso (text)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

### Tabla: cotizaciones
```sql
id (serial, primary key)
cliente_id (uuid, foreign key)
lead_id (int8, foreign key)
nombre_proyecto (text)
cliente_nombre (text)
cliente_email (text)
cliente_empresa (text)
items (jsonb)
subtotal (numeric)
descuento (numeric)
total (numeric)
notas (text)
vigencia_dias (int)
estado (text) - 'borrador', 'enviada', 'aceptada', 'rechazada'
enviada_en (timestamptz)
aceptada_en (timestamptz)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

---

## 5. APIs DISPONIBLES

```
/api/auth          - Autenticación
/api/buyer-gen     - Generador de Buyer Persona
/api/chatbot       - Chatbot
/api/contact       - Formulario de contacto
/api/cotizaciones  - CRUD cotizaciones
/api/crm           - Endpoints CRM (clientes, leads)
/api/cron          - Tareas programadas
/api/ebook-download - Descarga de ebooks
/api/facebook      - Integración Facebook
/api/indexnow      - IndexNow para SEO
/api/intelligence  - M&P Intelligence
/api/leads         - Gestión de leads
/api/meta          - Integración Meta Ads
/api/pagespeed     - PageSpeed insights
/api/predictions   - Predictor de resultados
/api/webhooks      - Webhooks externos
/api/whatsapp      - Integración WhatsApp
```

---

## 6. CRON JOBS (vercel.json)

```json
{
  "path": "/api/cron/sync-meta-leads",
  "schedule": "0 11 * * *"  // Diario a las 11:00 UTC
}
```

---

## 7. VARIABLES DE ENTORNO (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://faitwrutauavjwnsnlzq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ver arriba]"
SUPABASE_SERVICE_ROLE_KEY="[ver arriba]"

# Google
GOOGLE_SHEETS_API_KEY="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"
GOOGLE_SHEET_ID="1GSZsjU1G8EImnEgXjfOTev77pMPH-WHtXzGhAtY-jtQ"

# Meta
META_APP_ID="1389537399297748"
META_APP_SECRET="787111bcec23f2c254e0dbd1748d24bc"
NEXT_PUBLIC_META_REDIRECT_URI="https://www.mulleryperez.cl/api/auth/meta/callback"

# Email
RESEND_API_KEY="re_9fLk231R_7aNHqQE57aeKTnV7vMaTqiHA"
```

**IMPORTANTE:** Estas variables también deben estar en Vercel Dashboard > Settings > Environment Variables

---

## 8. TRACKING Y ANALYTICS

### Meta Pixel (555544348819002)
Archivo: `/components/ThirdPartyScripts.tsx`

Eventos configurados:
- PageView (automático)
- Lead (formulario enviado)
- Contact (click WhatsApp)
- CompleteRegistration (formulario enviado)

Archivo de tracking B2B: `/lib/meta-pixel.ts`

### Google Analytics (G-QV8Y7X4ZC2)
Archivo: `/components/ThirdPartyScripts.tsx`

### Google Tag Manager (GTM-58VSTLZ)
Archivo: `/components/ThirdPartyScripts.tsx`

---

## 9. ESTRUCTURA DE PÁGINAS PRINCIPALES

```
/                                    # Home (LandingClient.tsx)
/servicios                           # Servicios principales
/servicios/google-ads-chile
/servicios/meta-ads-chile
/servicios/seo-chile
/servicios/performance-marketing
/marketing-digital-ecommerce-chile   # Por industria
/marketing-digital-b2b-chile
/marketing-digital-saas-chile
/marketing-digital-salud-chile
/marketing-digital-inmobiliario-chile
/marketing-digital-educacion-chile
/marketing-digital-pymes-chile
/blog                                # 52 artículos
/recursos                            # Hub de recursos
/utilidades                          # Calculadoras
/labs                                # Herramientas avanzadas
/cotizador                           # Cotizador interactivo
/nosotros                            # Quiénes Somos
/comparativa/muller-perez-vs-agencias-chile
/gracias                             # Thank you page
/crm                                 # Panel admin
/cliente/[id]                        # Portal cliente
/login                               # Login
```

---

## 10. DEPENDENCIAS PRINCIPALES (package.json)

```
next: ^14.2.0
react: ^18.3.0
tailwindcss: ^3.4.1
@supabase/supabase-js: 2.76.1
resend: ^3.2.0
lucide-react: ^0.263.1
recharts: ^3.4.1
jspdf: ^3.0.3
framer-motion: ^12.23.24
```

---

## 11. COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy preview
vercel

# Deploy producción
vercel --prod

# Ver logs Vercel
vercel logs [deployment-url]

# Push a GitHub
git add -A && git commit -m "mensaje" && git push origin main
```

---

## 12. DOCUMENTACIÓN ADICIONAL EN EL PROYECTO

| Archivo | Contenido |
|---------|-----------|
| PROYECTO-MYP-DOCUMENTACION.md | Resumen de trabajo realizado |
| CREDENCIALES.md | Accesos CRM |
| CRM_SETUP.md | Setup del CRM |
| META_OAUTH_SYSTEM.md | Integración Meta |
| FACEBOOK_LEADS_SETUP.md | Setup Facebook Leads |
| INTEGRACION_META_RESUMEN.md | Resumen integración Meta |
| database/schema.sql | Schema de base de datos |

---

## 15. SISTEMA CRM COMPLETO

### Estructura del CRM

**Acceso:** `www.mulleryperez.cl/crm`

#### Roles de Usuario
1. **Admin** - Acceso total a todas las funciones
2. **Cliente** - Acceso limitado a su dashboard y cotizaciones

#### Menú Admin
| Sección | Ruta | Función |
|---------|------|---------|
| Dashboard | `/crm/leads` | Vista general de leads con semáforo de urgencia |
| Subir Leads | `/crm/upload` | Carga masiva de leads CSV |
| Métricas | `/crm/metricas` | KPIs y gráficos |
| Historial | `/crm/cargas` | Histórico de cargas |
| Cotizaciones | `/crm/cotizaciones` | Gestión de cotizaciones |
| Clientes | `/crm/clientes` | Gestión de clientes |
| Plantillas | `/crm/plantillas` | Templates de cotizaciones |
| Contraseñas | `/crm/contraseñas` | Gestión de accesos |
| Integraciones | `/crm/historial-integraciones` | Logs de integración |
| Admin | `/crm/admin` | Configuración avanzada |

#### Sistema de Semáforo de Leads
- **Verde:** Lead ingresado hace menos de 24h
- **Amarillo:** Lead sin contactar entre 24-48h
- **Rojo:** Lead sin contactar más de 48h

#### Fuentes de Leads Soportadas
- `facebook_lead_ads` - Facebook Lead Ads (Meta)
- `manual` - Ingreso manual
- `email` - Desde correo
- `whatsapp` - Desde WhatsApp
- `zapier` - Via Zapier

---

## 16. SISTEMA DE COTIZACIONES

### Flujo de Cotizaciones
1. Crear desde lead o desde cero
2. Seleccionar Plan M&P o plantilla personalizada
3. Agregar/editar items
4. Aplicar descuento
5. Guardar como borrador o enviar

### Estados de Cotización
- `borrador` - En edición
- `enviada` - Enviada al cliente
- `aceptada` - Cliente aceptó
- `rechazada` - Cliente rechazó

### Estructura de Items (JSON)
```json
{
  "descripcion": "Gestión Google Ads",
  "cantidad": 1,
  "precio_unitario": 350000,
  "total": 350000
}
```

### Tabla: planes_myp (Planes Predefinidos)
```sql
id (serial, primary key)
nombre (text)              -- 'Plan Silver', 'Plan Gold', etc.
descripcion (text)
items_incluidos (jsonb)    -- Array de items con precios
precio_base (numeric)
descuento_default (numeric) -- % descuento
vigencia_dias (int)
activo (boolean)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

### Planes M&P Típicos

#### Plan Silver (~$450.000/mes)
- Gestión Google Ads
- Setup inicial
- Reportes mensuales

#### Plan Gold (~$750.000/mes)
- Todo Silver +
- Gestión Meta Ads
- Optimización semanal

#### Plan Platinum (~$1.200.000/mes)
- Todo Gold +
- SEO básico
- Landing pages
- Reuniones quincenales

---

## 17. BENCHMARKS POR INDUSTRIA (Chile 2024)

### Fuentes de Datos
- WordStream 2024
- Triple Whale 2024
- Databox 2024
- XYZLab Chile
- Ubersuggest Chile (333 keywords ponderadas por volumen)

### CPCs Calibrados Chile (Promedio Ponderado)

| Industria | CPC Google | CPC Meta | Factor Chile |
|-----------|------------|----------|--------------|
| E-commerce | $248 CLP | $198 CLP | 0.7 |
| Inmobiliaria | $215 CLP | $193 CLP | 0.8 |
| Turismo | $421 CLP | $295 CLP | 0.6 |
| Gastronomía | $162 CLP | $138 CLP | 0.5 |
| Automotriz | $248 CLP | $236 CLP | 0.9 |
| Salud/Medicina | $369 CLP | $314 CLP | 0.8 |
| Educación | $146 CLP | $109 CLP | 0.7 |
| Moda/Retail | $128 CLP | $115 CLP | 0.8 |
| Fintech | $479 CLP | $455 CLP | 1.0 |
| Servicios Legales | $391 CLP | $313 CLP | 0.9 |
| Belleza/Personal | $251 CLP | $226 CLP | 0.8 |
| Tecnología/SaaS | $39 CLP | $46 CLP | 1.0 |

### CTR y CVR por Industria

| Industria | CTR Google | CTR Meta | CVR Web |
|-----------|------------|----------|---------|
| E-commerce | 2.81% | 1.57% | 2.81% |
| Inmobiliaria | 1.80% | 2.60% | 1.2% |
| Turismo | 3.17% | 2.20% | 6.96% |
| Gastronomía | 3.17% | 1.57% | 18.25% |
| Automotriz | 3.17% | 1.57% | 12.96% |
| Salud/Medicina | 3.17% | 0.73% | 4.81% |
| Educación | 3.17% | 1.57% | 10.05% |
| Fintech | 1.90% | 0.88% | 4.74% |

### Límites Realistas por Industria

| Industria | Max Conv/Mes | ROAS Máximo | CPA Mínimo |
|-----------|--------------|-------------|------------|
| E-commerce | 800 | 15x | $5.000 |
| Inmobiliaria | 60 | 25x | $50.000 |
| Turismo | 200 | 12x | $15.000 |
| Gastronomía | 500 | 6x | $3.000 |
| Automotriz | 120 | 20x | $80.000 |
| Salud/Medicina | 200 | 15x | $25.000 |
| Educación | 250 | 12x | $20.000 |
| Fintech | 150 | 15x | $40.000 |

### Archivo de Benchmarks
`/lib/engine/benchmarks-2024-verificados.ts`

### Archivo de CPCs Calibrados
`/lib/config/cpc-calibrado-chile.ts`

---

## 18. SISTEMA DE AUTENTICACIÓN

### Archivo Principal
`/lib/auth/simple-auth.tsx`

### Flujo de Login
1. Usuario ingresa credenciales en `/crm/login`
2. POST a `/api/auth/login`
3. Validación contra Supabase
4. Guardado en localStorage (`crm_user`)
5. Redirección según rol

### Permisos por Rol

#### Admin
```javascript
canViewLeads: true
canEditLeads: true
canDeleteLeads: true
canViewClientes: true
canEditClientes: true
canViewCotizaciones: true
canCreateCotizaciones: true
canEditCotizaciones: true
canDeleteCotizaciones: true
canViewPlantillas: true
canEditPlantillas: true
canViewDashboard: true
canExportPDF: true
```

#### Cliente
```javascript
canViewLeads: false
canViewCotizaciones: true  // Solo las suyas
canExportPDF: true
// Resto: false
```

---

## 19. TONO DE COMUNICACIÓN M&P

### Estilo de Escritura
- **Profesional pero cercano**
- Sin jerga técnica innecesaria
- Enfocado en resultados y ROI
- Datos concretos, no promesas vacías

### Frases Típicas en Cotizaciones
- "Inversión mensual" (no "costo")
- "Retorno estimado basado en benchmarks reales de Chile"
- "Gestión integral" (no "administración")
- "Optimización continua" (no "mejoras")

### Valores de Referencia para Cotizar
- Fee de gestión Google Ads: 15-20% de inversión (mín. $250.000)
- Fee de gestión Meta Ads: 15-20% de inversión (mín. $200.000)
- Setup inicial: $150.000 - $350.000
- Auditoría inicial: $200.000 - $500.000
- Landing page: $250.000 - $600.000
- SEO mensual: desde $400.000

---

## 20. SEO TÉCNICO

### robots.txt (app/robots.ts)
```
Permitido: / (todo el sitio público)
Bloqueado: /api/, /admin/, /crm/, /login/, /cliente/
```

### Bots de IA Permitidos Explícitamente
- GPTBot (OpenAI)
- ChatGPT-User
- Google-Extended
- anthropic-ai / ClaudeBot
- PerplexityBot
- Bytespider (TikTok)
- Cohere-ai
- YouBot
- CCBot (Common Crawl)
- Applebot-Extended
- Meta-ExternalAgent
- Amazonbot
- OAI-SearchBot

### sitemap.xml (app/sitemap.ts)
- **Generado dinámicamente** por Next.js
- Lee automáticamente carpetas: `/blog`, `/labs`, `/utilidades`
- URL: https://www.mulleryperez.cl/sitemap.xml

### Schemas JSON-LD Implementados (lib/metadata.ts)
| Schema | Uso |
|--------|-----|
| `Organization` | Home, todas las páginas |
| `LocalBusiness` | Home |
| `Service` | Páginas de servicios |
| `Article` | Blog posts |
| `FAQPage` | Páginas con FAQ |
| `BreadcrumbList` | Navegación |
| `SoftwareApplication` | Herramientas labs |
| `WebPage` | Páginas generales |

### Metadata por Defecto
- **Site Name:** Muller y Pérez - Agencia Marketing Digital
- **Locale:** es_CL
- **OG Image:** /og-image.jpg (1200x630)
- **Google Verification:** N1_98JB2O8f-9p49ys1CL0bu-_kijxbjs3aSRIZ7Syw

---

## 21. GEO (Generative Engine Optimization)

### Archivo Principal
`/lib/ai-search-optimization.ts`

### Qué es GEO
Optimización para motores de búsqueda basados en IA:
- ChatGPT (OpenAI)
- Claude (Anthropic)
- Gemini (Google)
- Perplexity

### Datos Optimizados para IA (AI_SEARCH_DATA)
```typescript
{
  companyName: 'Muller y Pérez',
  shortDescription: 'Agencia líder en Marketing de Datos Chile...',
  longDescription: '[Texto largo optimizado para citación]',
  metrics: [
    { name: 'ROI Promedio', value: '+380%', context: '...' },
    { name: 'Retención', value: '95%', context: '...' },
    // etc.
  ],
  pricing: { min: 650000, max: 2000000, currency: 'CLP' },
  differentiators: ['Transparencia total', 'Sin contratos', ...],
}
```

### FAQ para IAs (AI_FAQ)
16 preguntas frecuentes optimizadas para citación:
- ¿Cuánto cuesta Muller y Pérez?
- ¿Qué incluye el servicio?
- ¿Tienen contratos de permanencia?
- ¿Qué métricas reportan?
- ¿Cuál es el ROI típico?
- etc.

### Schemas AEO (Answer Engine Optimization)
| Función | Propósito |
|---------|-----------|
| `createSpeakableSchema` | Voice search |
| `createHowToSchema` | Guías paso a paso |
| `createItemListSchema` | Listicles (32% de citaciones) |
| `createAboutPageSchema` | E-E-A-T |
| `createDefinitiveAnswerSchema` | Respuestas autoritativas |
| `createEnhancedFAQSchema` | FAQs con metadata |

### Textos Citables (generateCitableText)
```javascript
// Temas disponibles: roi, pricing, services, differentiators, location
generateCitableText('roi')
// → "Muller y Pérez ha logrado un ROI promedio de +380%..."
```

---

## 22. META PIXEL (B2B High-Ticket)

### Archivo
`/lib/meta-pixel.ts`

### Pixel ID
555544348819002

### Eventos Implementados
| Evento | Cuándo | Valor |
|--------|--------|-------|
| `PageView` | Automático | - |
| `Lead` | Formulario enviado | $1M-2.4M CLP (dinámico) |
| `CompleteRegistration` | Formulario enviado | $1M-2.4M CLP |
| `Contact` | Click WhatsApp | $200K CLP |
| `InitiateCheckout` | Entra al cotizador | $300K CLP |
| `AddToCart` | Selecciona plan | Variable |
| `Schedule` | Agenda reunión | $500K CLP |

### Cálculo de Valor de Lead
```typescript
// Valores base por servicio
google-ads: $1.5M CLP
meta-ads: $1.2M CLP
seo: $1.8M CLP
performance: $2.4M CLP

// Multiplicadores por cargo
CEO/Gerente General: x2.0
Director: x1.8
Gerente Marketing: x1.5

// Multiplicadores por industria
Fintech: x2.0
SaaS: x1.8
B2B: x1.6
Inmobiliaria: x1.6
```

### Funciones Disponibles
```typescript
import { trackLead, trackWhatsAppClick } from '@/lib/meta-pixel'

// Al enviar formulario
trackLead({
  nombre, empresa, cargo, email, telefono,
  servicio: 'google-ads',
  industria: 'fintech'
})

// Al hacer clic en WhatsApp
trackWhatsAppClick({ page: 'hero', servicio: 'general' })
```

---

## 23. HERRAMIENTAS LABS

### URL: /labs

| Herramienta | Ruta | Descripción |
|-------------|------|-------------|
| Predictor Google Ads | `/labs/predictor` | Calcula conversiones y ROI |
| Buyer Gen | `/labs/buyer-gen` | Genera buyer personas con IA |
| M&P Intelligence | `/labs/mp-intelligence` | Benchmarks por industria |
| Radar Industrias | `/labs/radar-industrias` | Madurez digital por sector |
| Simulador Inversión | `/labs/simulador-inversion` | Juego educativo marketing |
| Reporte Competencia | `/labs/reporte-competencia` | Análisis competidores |

### URL: /utilidades
- Calculadora ROI
- Calculadora CAC
- Calculadora LTV

---

## 24. PARA RETOMAR EL PROYECTO

1. **Abrir nueva sesión de Claude**
2. **Decir:**
   ```
   Lee /Users/christophermuller/landing-mp-myp-NUEVO/CONFIGURACION-COMPLETA-MYP.md
   y /Users/christophermuller/landing-mp-myp-NUEVO/PROYECTO-MYP-DOCUMENTACION.md
   para entender el proyecto www.mulleryperez.cl
   ```
3. **Continuar trabajando**

---

## 25. CONTACTO

- **Email nuevo:** christopher@mulleryperez.cl
- **Email anterior:** christopher@mulleryperez.com
- **WhatsApp:** +56 9 9225 8137
- **Sitio:** www.mulleryperez.cl

---

*Documento generado automáticamente para continuidad del proyecto.*
*Última actualización: Enero 2026*
