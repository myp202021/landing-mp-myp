# Inventario completo de agentes — mulleryperez.cl

> Actualizado: 23 abril 2026

## Copilot (producto SaaS)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 1 | Validador cuentas | `radar-validar-cuentas.js` | Verifica handles IG/LI/FB, notifica inválidos | Manual |
| 2 | Clipping (scraper) | `radar-clipping.js` | Scrapea IG+LI+FB+Prensa via Apify | Diario/Semanal/Mensual |
| 3 | Análisis IA | en `radar-clipping.js` | Analiza posts con OpenAI (diario) / Claude (semanal) | Con clipping |
| 4 | Copies brief | `radar-contenido.js` paso 1 | OpenAI genera 3 briefs de contenido | Semanal/Mensual |
| 5 | Copies redacción | `radar-contenido.js` paso 2 | Claude redacta copies desde briefs | Semanal/Mensual |
| 6 | Copies QA | `radar-contenido.js` paso 3 | OpenAI revisa + auto-fix score <70 | Semanal/Mensual |
| 7 | Guiones reels | `radar-guiones.js` | Genera 2 scripts reels/stories via OpenAI | Semanal/Mensual (Business) |
| 8 | Ideas banco | en `radar-contenido.js` | Auto-acumula ideas desde copies | Con copies |
| 9 | Auditoría perfil | `radar-auditoria.js` | Score mensual 8 criterios por red | Mensual |
| 10 | Grilla mensual | `radar-grilla-mensual.js` | Genera 4/8/16 posts con OpenAI+Claude | Mensual |
| 11 | Perfil auto | `radar-perfil.js` | Genera perfil empresa desde su web | Primera vez |
| 12 | Lifecycle emails | `radar-lifecycle.js` | Emails trial día 0/5/6/expirado/pago | Diario |

## Hualpén (cliente producción)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 13 | Competencia Hualpén | `scrape-competencia.js` | Scrapea 14 competidores IG+LI+FB+Stories, PDF | L-V 7:00 AM |
| 14 | Clipping prensa Hualpén | `clipping-prensa-hualpen.js` | Scrapea 13 medios IG, filtra keywords transporte | L-V 6:00 AM |

## Genera (cliente producción)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 15 | Competencia Genera | `scrape-genera.js` | Scrapea competidores IG+LI, análisis IA | Manual |

## Swing (cliente)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 16 | Clipping artistas Swing | `clipping-swing-artistas.js` | Scrapea artistas/eventos IG | Manual |

## Grillas M&P (clientes internos)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 17 | Optimizar briefings | `optimizar-briefings.js` | FASE 0: genera brief estratégico por cliente | Manual |
| 18 | Generar grilla PRO | `generar-grilla-pro.js` | FASE 1-2: OpenAI brief → Claude copies → QA | Manual |
| 19 | Revisor grillas | `revisar-grillas.js` | 10 reglas heurísticas + auto-fix + reporte | Manual |

## Blog

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 20 | Blog diario | `generar-blog.js` | Genera artículo SEO diario con OpenAI | Diario |
| 21 | Blog rankings semanal | `blog-rankings-semanal.js` | Rankings/tendencias: OpenAI research → Claude review | Miércoles (nuevo) |
| 22 | IndexNow | `notify-indexnow.js` | Notifica a Google/Bing nuevo contenido | Con blog |

## Indicadores

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 23 | Indicadores marketing | `indicadores-marketing.js` | USD/UF + CPC/CPA calibrado por industria | Sábados |

## Prospección

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 24 | Prospect discover | `prospect-discover.js` | Descubre empresas via Apify | Manual |
| 25 | Prospect enrich | `prospect-enrich.js` | Enriquece datos de prospects | Manual |
| 26 | Prospect benchmark | `prospect-benchmark.js` | Benchmark competitivo 15 dimensiones | Manual |
| 27 | Prospect outreach | `prospect-outreach.js` | Email outreach secuencial | Manual |
| 28 | Prospect followup | `prospect-followup.js` | Follow-up automático | Manual |
| 29 | Prospect verify emails | `prospect-verify-emails.js` | Verifica emails válidos | Manual |

## Chatbot (Mutante)

| # | Agente | Script/API | Qué hace | Trigger |
|---|--------|-----------|----------|---------|
| 30 | Mutante init | `api/chatbot/init` | Inicia sesión de chat | On open |
| 31 | Mutante message | `api/chatbot/message` | Procesa mensaje del usuario | On send |
| 32 | Mutante lead | `api/chatbot/lead` | Captura lead del chatbot | On form submit |

## Reportería (3 agentes)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 33 | Reportes mensuales | `generar-reportes.js` | Email con métricas Reportei por cliente | Manual |
| 34 | Informe PPT | `build-informe-ppt.js` | PPT automática tipo ejecutivo con gráficos | Manual |
| 35 | Connect Meta Ads | `connect-meta-ads-manual.mjs` | Sincroniza data Meta Ads para reportes | Manual |

## Facturación

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 36 | Enviar facturas | `enviar-facturas.js` | CSV → PDFs → emails agrupados | Manual |

## Infraestructura

| # | Agente | Script/Workflow | Qué hace | Trigger |
|---|--------|----------------|----------|---------|
| 37 | Backup Supabase | `backup-supabase.yml` | JSON backup a Artifacts 90 días | Diario 5 AM |

## Radar Propiedades (repo separado: propiedades-bravo-muller)

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 38 | Scraper PI | `radar-propiedades.js` | Scrapea Portal Inmobiliario via Scrapfly | 4 crons |

## Indicadores

| # | Agente | Script | Qué hace | Trigger |
|---|--------|--------|----------|---------|
| 39 | Indicadores marketing | `indicadores-marketing.js` | USD/UF + CPC/CPA calibrado por industria | Sábados |

---

**Total: 39 agentes activos** en el ecosistema mulleryperez.cl
