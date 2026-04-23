# M&P Copilot — Pipeline de Agentes

> Actualizado: 23 abril 2026

## Arquitectura

Copilot es un set de 10 agentes que corren secuencialmente desde `radar-clipping.js`. El pipeline principal se dispara via GitHub Actions (workflow_dispatch, crons comentados durante testing).

```
Validador → Clipping (scrape) → Análisis IA → Copies (3 agentes) → Guiones → Ideas → Auditoría
                                                                                          ↓
                                                                              Email + Excel + PDF
```

## Agentes

| # | Agente | Script | Trigger | Plan | Costo |
|---|--------|--------|---------|------|-------|
| 1 | Validador cuentas | `radar-validar-cuentas.js` | Manual pre-pipeline | Todos | $0 |
| 2 | Clipping | `radar-clipping.js` | Diario/Semanal/Mensual | Todos | ~$0.25/run Apify |
| 3 | Análisis IA | en `radar-clipping.js` | Con clipping | Todos | ~$0.01 OpenAI/Claude |
| 4 | Copies (brief) | `radar-contenido.js` paso 1 | Semanal/Mensual | Pro+Business | ~$0.01 OpenAI |
| 5 | Copies (redacción) | `radar-contenido.js` paso 2 | Semanal/Mensual | Pro+Business | ~$0.03 Claude |
| 6 | Copies (QA) | `radar-contenido.js` paso 3 | Semanal/Mensual | Pro+Business | ~$0.01 OpenAI |
| 7 | Guiones reels | `radar-guiones.js` | Semanal/Mensual | Business | ~$0.01 OpenAI |
| 8 | Ideas banco | en `radar-contenido.js` | Con copies | Pro+Business | $0 |
| 9 | Auditoría perfil | `radar-auditoria.js` | Mensual | Todos | $0 |
| 10 | Perfil auto | `radar-perfil.js` | Primera vez / semanal | Todos | ~$0.01 OpenAI |
| 11 | Lifecycle emails | `radar-lifecycle.js` | Diario 8 AM | Todos | $0 |
| 12 | Grilla mensual | `radar-grilla-mensual.js` | Mensual | Todos (4/8/16 posts) | ~$0.06 |

## Workflows GitHub Actions

| Workflow | Archivo | Cron (comentado) | Modo |
|---|---|---|---|
| Diario | `radar-clipping-diario.yml` | L-V 7:30 AM Chile | `--diario` |
| Semanal | `radar-clipping-semanal.yml` | Lunes 9:00 AM | `--semanal` |
| Mensual | `radar-clipping-mensual.yml` | 1ro mes 9:00 AM | `--mensual` |
| Lifecycle | `radar-lifecycle.yml` | Diario 8:00 AM | emails trial |
| Validar cuentas | `copilot-validar-cuentas.yml` | Manual | verificar handles |

**Crons comentados durante testing.** Descomentar cuando esté listo para producción.

## Tablas Supabase

| Tabla | Uso |
|---|---|
| `clipping_suscripciones` | Suscriptores (la tabla principal, nombre legacy) |
| `radar_posts` | Posts scrapeados de competidores |
| `radar_contenido` | Copies y grillas generados (tipo: 'copy' o 'grilla') |
| `copilot_auditorias` | Scores mensuales de auditoría |
| `copilot_guiones` | Guiones de reels/stories |
| `copilot_ideas` | Banco de ideas acumulativo |

## Email — Estructura por modo

### Diario (todos los planes)
1. Header dark (#4F46E5) + KPIs
2. Análisis IA (contexto + badges empresa + oportunidad/alerta)
3. Tabla competencia (IG/LI/FB por empresa)
4. Top 5 posts por likes
5. Auditoría mini (si es mensual)
6. CTA dashboard
7. Footer con plan features

### Semanal (Pro + Business)
Todo lo diario +
- Preview copies sugeridos (títulos + scores, full copy en Excel adjunto)
- Preview guiones (títulos, full en Excel adjunto) — solo Business
- Adjuntos: Copies Excel, Guiones Excel (Business)

### Mensual (todos)
Todo lo semanal +
- Preview grilla (3 posts, full en Excel adjunto)
- Auditoría completa (score + redes + criterios)
- Adjuntos: Grilla Excel, Copies Excel, Guiones Excel (Business), Reporte PDF (Business)

## Diferenciación por plan

| Feature | Starter $34.990 | Pro $69.990 | Business $119.990 |
|---|---|---|---|
| Monitoreo diario | ✓ | ✓ | ✓ |
| Análisis IA | ✓ | ✓ | ✓ |
| Auditoría mensual | ✓ | ✓ | ✓ |
| Copies semanales | — | ✓ | ✓ |
| Grilla mensual | 4 posts | 8 posts | 16 posts |
| Guiones reels | — | — | ✓ |
| Reporte ejecutivo PDF | — | — | ✓ |
| Cuentas monitoreadas | 5 IG | 15 multi-red | 30 multi-red |

## Secrets requeridos (GitHub Actions)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `APIFY_TOKEN`
- `RESEND`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY_GRILLAS`

## Validador de cuentas

El agente `radar-validar-cuentas.js`:
1. Hace fetch a la URL pública de cada handle (IG/LI/FB) — sin Apify, $0
2. Marca cada cuenta como `validada: true/false` en el campo `cuentas` de Supabase
3. Si hay cuentas inválidas, envía email al suscriptor con link para corregir
4. El pipeline principal (`radar-clipping.js`) salta cuentas marcadas como `validada: false`

Correr antes del primer scrape de un suscriptor nuevo:
```
Workflow: Copilot — Validar cuentas → dispatch con suscriptor_id
```
