# Radar — Inteligencia Competitiva en Redes Sociales

Producto standalone de Muller y Perez. Monitorea competencia en IG, LI, FB y prensa chilena.

## URLs

- **Landing:** https://www.mulleryperez.cl/clipping
- **Panel admin CRM:** https://www.mulleryperez.cl/crm/radar
- **Checkout:** POST /api/clipping/checkout
- **Trial:** POST /api/clipping/trial
- **Webhook Flow:** POST /api/webhooks/flow
- **Confirmacion:** /clipping/confirmacion

## Stack tecnico

| Componente | Tecnologia |
|---|---|
| Landing + API routes | Next.js en Vercel |
| Base de datos | Supabase (clipping_suscripciones, radar_posts) |
| Scraping IG | apify~instagram-scraper |
| Scraping LI | harvestapi~linkedin-company-posts |
| Scraping FB | apify~facebook-posts-scraper |
| Prensa | apify~instagram-scraper sobre 11 medios chilenos |
| IA diario | OpenAI gpt-4o-mini |
| IA semanal/mensual | Anthropic Claude Sonnet |
| Email | Resend |
| PDF | wkhtmltopdf |
| Pagos | Flow.cl (6 planes) |

## Archivos clave

```
scripts/radar-clipping.js          # Script principal v5 (789 lineas)
app/clipping/page.tsx              # Landing server component (SEO + JSON-LD)
app/clipping/ClippingClient.tsx    # Landing client component (UI)
app/clipping/confirmacion/page.tsx # Post-pago
app/api/clipping/trial/route.ts    # Crear trial
app/api/clipping/checkout/route.ts # Crear suscripcion Flow
app/api/webhooks/flow/route.ts     # Webhook pagos Flow
app/crm/radar/page.tsx             # Panel admin CRM
supabase/clipping_suscripciones.sql
supabase/radar_posts.sql
.github/workflows/radar-clipping-diario.yml
.github/workflows/radar-clipping-semanal.yml
.github/workflows/radar-clipping-mensual.yml
```

## Workflows

| Workflow | Cron | Hora Chile |
|---|---|---|
| radar-clipping-diario | `30 10 * * *` | 07:30 AM L-D |
| radar-clipping-semanal | `0 12 * * 1` | 09:00 AM lunes |
| radar-clipping-mensual | `0 12 1 * *` | 09:00 AM 1ro mes |

## Tablas Supabase

### clipping_suscripciones
```
id, email, nombre, plan, periodo, estado (trial|activo|suspendido|cancelado),
cuentas (JSONB: [{red, handle, nombre, keywords?}]),
emails_destino, keywords_alerta, flow_customer_id, flow_subscription_id,
trial_ends, created_at, updated_at
```

### radar_posts
```
id, suscripcion_id, red, handle, nombre_empresa, post_url, texto,
likes, comments, tipo_post, keywords_match, fecha_post, fecha_scrape,
modo, created_at
```

## Planes Flow.cl

| ID Flow | Plan | Precio |
|---|---|---|
| RADAR-STARTER-MENSUAL | Starter mensual | $34.990 |
| RADAR-STARTER-ANUAL | Starter anual | $335.880 |
| RADAR-PRO-MENSUAL | Pro mensual | $69.990 |
| RADAR-PRO-ANUAL | Pro anual | $659.880 |
| RADAR-BUSINESS-MENSUAL | Business mensual | $119.990 |
| RADAR-BUSINESS-ANUAL | Business anual | $1.139.880 |

## Secrets necesarios

```
APIFY_TOKEN
RESEND (o RESEND_API_KEY)
OPENAI_API_KEY
ANTHROPIC_API_KEY_GRILLAS
SUPABASE_URL
SUPABASE_SERVICE_KEY
FLOW_API_KEY
FLOW_SECRET_KEY
```

## Costos por suscriptor

| Plan | Apify/mes | IA/mes | Total | Margen |
|---|---|---|---|---|
| Starter (5 IG) | $3 USD | $0.03 | ~$3 | 90% |
| Pro (15 multi-red) | $10 USD | $0.05 | ~$10 | 83-86% |
| Business (30 todo) | $20 USD | $0.05 | ~$20 | 80-84% |

## Medios prensa monitoreados (11)

La Tercera, BioBioChile, Emol, Diario Financiero, CNN Chile, T13,
Publimetro, El Dinamo, Meganoticias, ADN Radio, Cooperativa
