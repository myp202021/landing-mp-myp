# Radar M&P — Estado al 22 abril 2026

## Producto
SaaS de inteligencia competitiva: scraping RRSS + análisis IA + copies sugeridos + grillas mensuales.

## URLs
- Landing: mulleryperez.cl/clipping
- Dashboard: /radar/[id]
- Config: /radar/configurar/[id]
- Contratar: /clipping/contratar/[id]
- CRM Admin: /crm/radar

## Suscriptores activos
| Cliente | Email | Plan | Estado |
|---|---|---|---|
| Genera HR | christopher@mulleryperez.cl | Pro | Activo (producción, regalo) |
| M&P Test | chmuller5@gmail.com | Test | Activo (testing, $1.000 Flow) |

## Crons (PAUSADOS para ahorrar Apify)
| Cron | Horario | Estado |
|---|---|---|
| radar-clipping-diario | 7:30 AM Chile | PAUSADO |
| radar-clipping-semanal | Lunes 9 AM | PAUSADO |
| radar-clipping-mensual | 1ro 9 AM | PAUSADO |
| radar-lifecycle | 8 AM diario | PAUSADO |

Para reactivar: descomentar la línea `# PAUSADO - cron:` en cada workflow.
Dispatch manual disponible con `--id=UUID` para procesar un solo suscriptor.

## Flujo completo (testeado 21 abril)
1. Trial desde /clipping → email bienvenida (cliente + admin separados)
2. Config: web, RRSS propios, competidores, auto-limpieza URLs
3. Pago Flow.cl → confirmación verifica estado real
4. Diario: scrape IG+LI+FB+prensa → análisis IA → PDF → email con CTA condicional
5. Semanal: pipeline 3 agentes (brief→copy→QA) → copies sugeridos → persisten en radar_contenido
6. Mensual: grilla N posts según plan → Excel adjunto → persisten en radar_contenido
7. Dashboard: tabs Competencia + Contenido + Excel descargable
8. CRM admin: KPIs, filtros, eliminar cascade

## Pipeline IA
```
Scrape (Apify) → radar_posts
  → OpenAI: análisis diario
  → Semanal: OpenAI brief → Claude copy → OpenAI QA → radar_contenido (tipo=copy)
  → Mensual: OpenAI brief grilla → Claude copy × N posts → OpenAI QA → radar_contenido (tipo=grilla)
  → Perfil auto: si falta rubro/productos, OpenAI analiza web + posts → perfil_empresa
```

## Tablas Supabase
- clipping_suscripciones (email, plan, estado, cuentas JSONB, perfil_empresa JSONB, flow_*)
- radar_posts (suscripcion_id, red, handle, texto, likes, comments, fecha_scrape)
- radar_contenido (suscripcion_id, tipo copy|grilla, datos JSONB, mes, score_promedio)

## Planes y precios
| Plan | Precio | Cuentas | Canales | Copies | Grilla |
|---|---|---|---|---|---|
| Starter | $34.990/mes | 5 | IG | No | 4 posts |
| Pro | $69.990/mes | 15 | IG+LI+FB | 3/semana | 8 posts |
| Business | $119.990/mes | 30 | IG+LI+FB | 3/semana | 16 posts |

## Scripts
- scripts/radar-clipping.js (v6, ~900 líneas) — orquestador principal
- scripts/radar-contenido.js — pipeline copies (3 agentes)
- scripts/radar-grilla-mensual.js — grilla con estacionalidad
- scripts/radar-perfil.js — auto-genera perfil empresa
- scripts/radar-lifecycle.js — emails día 0/5/6/desactivación

## APIs
- /api/clipping/trial — crea trial + email bienvenida
- /api/clipping/checkout — Flow.cl pago
- /api/clipping/activar — activa si hay plan pendiente
- /api/webhooks/flow — recibe webhook Flow
- /api/radar/export-grilla — genera Excel descargable

## Pendiente
- [ ] Upload logo cliente en config
- [ ] Imágenes para grillas (templates HTML→PNG evaluado, Freepik API evaluada)
- [ ] Email mensual adjunta Excel (código listo, verificar en producción)
- [ ] Lifecycle emails día 5/6 (requiere esperar 7 días)
- [ ] Dashboard: botón "Publicado/Pendiente" por post
- [ ] Dashboard v2 contenido: más detalle en grillas

## Costos mensuales (con 2 suscriptores)
- Apify: ~$36 USD (PAUSADO)
- OpenAI: ~$2 USD
- Anthropic: ~$2 USD
- Resend: $0 (free tier)
- Total: ~$40 USD/mes (cuando activo)

## Archivos clave
- docs/RADAR-PRODUCTO.md — doc técnica completa
- docs/RADAR-TEST-PLAN.md — plan de test 9 fases
- memory/radar-fix-completo.md — diagnóstico y fix plan
- memory/radar-dashboard-v2.md — plan dashboard con contenido
