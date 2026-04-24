# Copilot — Auditoría completa 24 abril 2026

## Tablas Supabase (verificadas)

| Tabla | Existe | Uso |
|---|---|---|
| `clipping_suscripciones` | ✅ | Suscriptores (nombre legacy) |
| `radar_posts` | ✅ | Posts scrapeados IG/LI/FB |
| `radar_contenido` | ✅ | Copies (tipo='copy') y grillas (tipo='grilla') |
| `copilot_auditorias` | ✅ | Scores mensuales de auditoría |
| `copilot_guiones` | ✅ | Guiones de reels/stories |
| `copilot_ideas` | ✅ | Banco de ideas acumulativo |

## Flujo de emails

| Email | Destinatario | Subject | From | Estado |
|---|---|---|---|---|
| Informe diario | Cliente (emails_destino o email) | "NombreCliente \| Tu Copilot diario \| X posts \| fecha" | Copilot <contacto@mulleryperez.cl> | ✅ OK |
| Informe semanal | Cliente | "NombreCliente \| Resumen semanal Copilot \| X posts \| fecha" | Copilot <contacto@mulleryperez.cl> | ✅ OK |
| Informe mensual | Cliente | "NombreCliente \| Resumen mensual Copilot \| X posts \| fecha" | Copilot <contacto@mulleryperez.cl> | ✅ OK |
| Cuentas inválidas | Cliente | "NombreCliente \| X cuenta(s) requieren revisión" | M&P Copilot <contacto@mulleryperez.cl> | ✅ OK |
| Trial bienvenida | Cliente | via API /copilot/trial | M&P Copilot <contacto@mulleryperez.cl> | ✅ OK |
| Lifecycle día 5/6/expirado | Cliente | via radar-lifecycle.js | M&P Copilot <contacto@mulleryperez.cl> | ✅ OK |
| Admin | NO se envía | - | - | Sin notificación admin |

## Cadena de agentes (secuencia exacta)

```
1. Validador de cuentas (manual, pre-pipeline)
   → verifica handles IG/LI/FB
   → marca validada: true/false en clipping_suscripciones.cuentas
   → notifica al cliente si hay inválidas

2. Pipeline principal (radar-clipping.js --diario/--semanal/--mensual)
   a. Lee suscriptores activos de clipping_suscripciones
   b. Construye mapa de empresas (extraerEmpresas) — case-insensitive ✅
   c. Salta cuentas marcadas validada:false ✅
   d. Scrapea IG via Apify (apify~instagram-scraper)
   e. Scrapea LI via Apify (harvestapi~linkedin-company-posts)
   f. Scrapea FB via Apify (apify~facebook-posts-scraper)
   g. Persiste posts en radar_posts
   h. Calcula trends vs periodo anterior
   i. Genera análisis IA (OpenAI diario / Claude semanal+mensual)
   j. [semanal/mensual, Pro+Business] Genera copies (radar-contenido.js)
      → Paso 1: OpenAI brief
      → Paso 2: Claude redacción
      → Paso 3: OpenAI QA (score, auto-fix si <70)
      → Guarda en radar_contenido (tipo='copy')
      → Auto-acumula ideas en copilot_ideas
   k. [mensual] Genera grilla (radar-grilla-mensual.js)
      → Guarda en radar_contenido (tipo='grilla')
   l. [semanal/mensual, Business] Genera guiones (radar-guiones.js)
      → Guarda en copilot_guiones
   m. [mensual] Genera auditoría (radar-auditoria.js)
      → Guarda en copilot_auditorias
   n. Genera HTML email (dark theme, Gmail-safe)
   o. Genera PDF (wkhtmltopdf)
   p. [semanal] Genera Excel copies + guiones (ExcelJS)
   q. [mensual] Genera Excel grilla + copies + guiones (ExcelJS)
   r. Envía email con adjuntos via Resend
```

## Dashboard — 6 tabs

| Tab | Tabla | Estado |
|---|---|---|
| Competencia | radar_posts | ✅ Funciona |
| Contenido | radar_contenido | ✅ Funciona |
| Auditoría | copilot_auditorias | ✅ Tabla OK, sin datos aún |
| Guiones | copilot_guiones | ✅ Tabla OK, sin datos aún |
| Ideas | copilot_ideas | ✅ Tabla OK, sin datos aún |
| Reporte | usa datos de otras tabs | ✅ Funciona |

## Páginas verificadas

| Página | Tabla | Estado |
|---|---|---|
| /copilot (landing) | — | ✅ OK |
| /copilot/dashboard/[id] | clipping_suscripciones + radar_posts + radar_contenido + copilot_* | ✅ OK |
| /copilot/configurar/[id] | clipping_suscripciones | ✅ OK |
| /copilot/contratar/[id] | clipping_suscripciones | ✅ CORREGIDO 24 abr |
| /copilot/confirmacion | — | ✅ OK |
| /crm/copilot (admin) | clipping_suscripciones + radar_posts | ✅ CORREGIDO 24 abr |
| /api/copilot/trial | clipping_suscripciones | ✅ OK |
| /api/copilot/checkout | clipping_suscripciones | ✅ OK |
| /api/copilot/activar | clipping_suscripciones | ✅ OK |
| /api/copilot/export-grilla | radar_contenido | ✅ OK |

## Crons

| Workflow | Cron | Estado |
|---|---|---|
| radar-clipping-diario | COMENTADO | ✅ Solo manual |
| radar-clipping-semanal | COMENTADO | ✅ Solo manual |
| radar-clipping-mensual | COMENTADO | ✅ Solo manual |
| radar-lifecycle | COMENTADO | ✅ Solo manual |
| copilot-validar-cuentas | Sin cron | ✅ Solo manual |
| blog-rankings-semanal | Jueves 8AM | ✅ ACTIVO |

## Bugs corregidos 24 abril
1. extraerEmpresas case-insensitive (tabla 0/0/0)
2. ContratarClient.tsx tabla corregida
3. crm/copilot admin delete tabla corregida
4. Google Search Console schema (image, brand, shipping, return policy)
5. Stories dual-actor (apify principal + fallback louisdeconinck)

## Pendiente para test diario
- Todo el código está corregido
- Listo para disparar test diario con suscripción test
- LinkedIn sigue con problema del actor (0 items) — necesita diagnóstico
