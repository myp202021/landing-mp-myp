# M&P — Stack Tecnológico Completo

> Lo que hemos construido internamente. Abril 2026.

---

## Productos propios

### 1. M&P Copilot (SaaS)
Monitoreo de competencia + generación de contenido con IA.
- 12 agentes de IA en pipeline secuencial
- Scraping multi-red (IG, LI, FB, Prensa)
- Copies con 3 agentes: brief → redacción → QA
- Grilla mensual, guiones de reels, auditoría de perfil
- Dashboard dark theme, email dark theme, Excel formateado, PDF ejecutivo
- Flow.cl pagos (3 planes: $34.990 / $69.990 / $119.990)
- **Comparable con:** Metricool, Hootsuite Insights, Sprout Social, Brandwatch

### 2. CRM Propio
Panel admin + portal cliente.
- Gestión de clientes, leads, cotizaciones
- Leads desde Facebook Lead Ads via Zapier
- Dashboard analítica por cliente (leads/día, CPF, ROAS)
- Portal cliente con UUID (sin login)
- Notificaciones email por nuevo lead
- CSV/vCard export, edición inline, eliminación masiva
- **Comparable con:** HubSpot básico, Clientify, Escala CRM

### 3. Chatbot Mutante
Asistente IA con árbol de decisión de 68 nodos.
- 5 ramas: aprender, diagnosticar, herramientas, servicios, contacto
- Captura de leads con tracking UTM
- Sesiones persistidas en Supabase
- Dashboard admin de conversaciones
- Copilot integrado como opción de servicio
- **Comparable con:** Drift, Intercom (versión básica), Tidio

### 4. Predictor de Costos
Motor de predicción de CPC/CPA por industria.
- Calibrado con ~1.200 keywords Chile (Ubersuggest)
- CVR por industria (predictor M&P)
- Cálculo CPA = CPC / CVR
- Versión v1 y v2
- **Comparable con:** Google Keyword Planner + lógica propia

### 5. Calculadoras / Labs
- **Calculadora ROI:** proyección de retorno por inversión
- **Comparador de plataformas:** Google vs Meta vs LinkedIn
- **Buyer Gen:** generador de buyer persona con IA
- **Benchmark CPL Chile 2025:** datos por industria
- **Comparable con:** HubSpot Tools, Neil Patel Free Tools

### 6. Termómetro Marketing Digital (/indicadores)
KPIs semanales del mercado chileno.
- USD/CLP y UF desde mindicador.cl
- CPC calibrado por industria (base Sep 2025)
- CPA = CPC / CVR por sector
- Actualización automática cada sábado
- SEO: JSON-LD Dataset + FAQ
- **Comparable con:** Statista (para Chile), Similar Web (datos de mercado)

### 7. Blog con IA (2 agentes)
- **Blog diario:** artículo táctico SEO generado con OpenAI
- **Blog rankings semanal:** rankings y tendencias con OpenAI + Claude review
- IndexNow para indexación inmediata
- 59+ artículos publicados
- **Comparable con:** Jasper AI Blog, Writesonic, Copy.ai

### 8. Sistema de Grillas (clientes M&P)
Pipeline de producción de contenido para redes sociales.
- FASE 0: Optimizador de briefings (OpenAI)
- FASE 1: Brief PRO (OpenAI gpt-4o)
- FASE 2: Copies (Claude, 1 por post)
- FASE 3: Revisor heurístico (10 reglas + auto-fix)
- Genera grillas de 8-16 posts/mes por cliente
- **Comparable con:** Lately.ai, ContentStudio, Planable

### 9. Sistema de Prospección
Pipeline outbound automatizado.
- Discover → Enrich → Benchmark → Outreach → Follow-up → CRM
- Apify + Supabase + Resend
- Benchmark competitivo 15 dimensiones con rúbrica
- **Comparable con:** Apollo.io, Lemlist, Reply.io (versiones básicas)

### 10. Clipping de Prensa y Competencia
Monitoreo diario para clientes.
- Competencia Hualpén: 14 empresas × 3 redes + Stories + detección ofertas laborales
- Clipping prensa: 13 medios chilenos, filtro keywords
- Competencia Genera: 5 empresas multi-red
- Swing: clipping artistas
- PDF adjunto diario
- **Comparable con:** Meltwater, Mention, Brand24 (para Chile específicamente)

### 11. Radar Propiedades (proyecto con Pancho Bravo)
SaaS alertas inmobiliarias para corredores.
- Scraper multi-corredor (1 scrape por comuna, no por usuario)
- Scrapfly con proxy residencial
- Dashboard corredor: propiedades, alertas, favoritos
- 3 planes: Básico / Pro / Broker
- **Comparable con:** Toctoc Alertas, Yapo Premium, PropTrack

### 12. Facturación Automatizada
- CSV → PDFs → emails agrupados a gestionclientes@
- "Manda las facturas" → proceso completo

### 13. Generador de Imágenes RRSS
Imágenes dark theme para Instagram y LinkedIn.
- HTML con diseño M&P → Puppeteer → PNG retina
- 5-6 imágenes por semana con temáticas actualizadas
- Formato aprobado: 1080x1350 IG, 1200x1200 LinkedIn
- Carpeta: Desktop/Imagenes M&P/
- **Comparable con:** Canva Pro, Adobe Express

### 14. Backup Automático
- Supabase → JSON → GitHub Artifacts (90 días)
- Cron 5:00 AM Chile

---

## Infraestructura

| Componente | Tecnología |
|---|---|
| Framework | Next.js 14 + TypeScript + Tailwind |
| Base de datos | Supabase (2 proyectos: M&P + Propiedades) |
| Hosting | Vercel |
| Email | Resend |
| Pagos | Flow.cl |
| Scraping | Apify (M&P) + Scrapfly (Propiedades) |
| IA | OpenAI (gpt-4o, gpt-4o-mini) + Claude (Sonnet) |
| Cron | GitHub Actions |
| Repo | github.com/myp202021/landing-mp-myp |

---

## Números

- **40 agentes** de IA/automatización activos
- **59+ artículos** de blog generados con IA
- **68 nodos** en el chatbot
- **14 competidores** monitoreados para Hualpén
- **13 medios** scrapeados para clipping
- **11 usuarios** en el CRM (1 admin, 1 cliente, 9 equipo)
- **7 tablas** en Supabase Propiedades, **20+** en M&P principal

---

## ¿Con qué tipo de empresas nos comparamos?

### Lo que M&P ha construido es comparable a una combinación de:

| Herramienta | Precio/mes USD | Qué hace | M&P lo tiene |
|---|---|---|---|
| Hootsuite + Insights | $249-$739 | Monitoreo + scheduling | Copilot |
| Sprout Social | $249-$499 | Social listening + analytics | Copilot + Clipping |
| Brandwatch | $800+ | Social intelligence | Copilot + Prensa |
| HubSpot CRM | $0-$800 | CRM + leads + analytics | CRM propio |
| Jasper AI | $49-$125 | Content generation | Blog IA + Grillas |
| Planable | $33-$83 | Content calendar | Grillas |
| Mention | $49-$179 | Media monitoring | Clipping |
| Apollo.io | $49-$119 | Prospecting + outreach | Prospección |
| Intercom | $74-$289 | Chatbot + support | Mutante |
| Drift | $2.500+ | Conversational marketing | Mutante |

**Si un cliente contratara todas estas herramientas por separado:** ~$4.000-$5.000 USD/mes

**M&P lo ofrece integrado desde $950.000 CLP/mes (~$1.000 USD)** como agencia con equipo incluido, más Copilot como SaaS independiente desde $34.990 CLP/mes (~$37 USD).

### Empresas similares en concepto (agencia + tech):

| Empresa | País | Qué hacen |
|---|---|---|
| **Vendasta** | Canadá | White-label marketing platform para agencias |
| **SEMrush** | USA | Suite de herramientas SEO + content + social |
| **Rompecabeza Digital** | Chile | Agencia con herramientas propias (competitor directo) |
| **Cebra** | Chile | Agencia data-driven con dashboards propios |
| **Lately.ai** | USA | IA que genera contenido desde long-form |
| **Surfer SEO** | Polonia | Optimización de contenido con IA |

### Diferenciador real de M&P:
Ninguna agencia en Chile tiene **36 agentes de IA propios** corriendo en producción. La mayoría usa herramientas de terceros (Hootsuite, HubSpot, Jasper) y las revende. M&P construyó todo internamente, lo que significa:
- Márgenes más altos (no paga licencias)
- Datos propios que nadie más tiene
- Velocidad de iteración (cambios en horas, no meses)
- Productos SaaS como revenue adicional (Copilot, Propiedades)
