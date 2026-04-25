# Copilot — Sistema de Agentes IA Interconectados

> Actualizado: 25 abril 2026 — v7 con upgrades 2-7

## Estado

- **QA E2E**: 83 checks, 78 pass, 5 warn (datos del run anterior), 0 fail
- **Último run semanal exitoso**: 25 abril 2026 (GitHub Actions)
- **Crons**: comentados (testing phase)
- **LinkedIn**: deshabilitado (ningún actor funcional)

## Arquitectura General

```
                    ┌─────────────────┐
                    │  MEMORIA        │ ← Lee histórico de TODAS las tablas
                    │  radar-memoria  │   (copies, ideas, auditoría, competencia, guiones)
                    └────────┬────────┘
                             │ contexto de aprendizaje
                             ▼
┌──────────────┐    ┌─────────────────┐
│ Competencia  │───▶│  BRIEF          │ ← Recomendaciones de auditoría previa
│ (scraping)   │    │  radar-brief    │   + patrones competencia 60 días
│              │    │                 │   + ideas aprobadas/descartadas
└──────────────┘    └────────┬────────┘
                             │ brief estratégico (editable por cliente)
                    ┌────────┴────────────────────────────┐
                    │                │                     │
                    ▼                ▼                     ▼
           ┌──────────────┐ ┌──────────────┐    ┌──────────────┐
           │  CONTENIDO   │ │  GUIONES     │    │  GRILLA      │
           │  (copies)    │ │  (reels)     │    │  (mensual)   │
           │              │ │              │    │              │
           │ + memoria    │ │ + brief      │    │ + brief      │
           │ + brief      │ │ + memoria    │    │ + copies     │
           │ + previos    │ │ + dedup prev │    │ + memoria    │
           └──────┬───────┘ └──────────────┘    └──────────────┘
                  │
                  ▼
           ┌──────────────┐     ┌──────────────┐
           │  IDEAS       │────▶│ NOTIFICACIÓN │ → email M&P
           │  (auto-gen)  │     │ al aprobar   │
           │ + gap anal.  │     └──────────────┘
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  AUDITORÍA   │ ← semanal (light) + mensual (completa)
           │              │   10 criterios (8 base + 2 brief-aware)
           │              │   → fortaleza/debilidad auto
           │              │   → retroalimenta próximo brief
           └──────┬───────┘
                  │
                  ▼
    ┌──────────────────────────────┐
    │  EMAIL + PDF + Excel         │
    │  Brief section + copies      │
    │  preview + auditoría barras  │
    └──────────────────────────────┘
```

## Flujo de Ejecución (por suscriptor)

```
 1. Scraping IG       → radar_posts
 2. Trends            ← radar_posts (período anterior)
 3. MEMORIA           ← TODO (60 días: copies, ideas, auditorías, competencia, guiones)
 4. Perfil auto       → perfil_empresa (si incompleto)
 5. Brief             ← memoria + posts → perfil_empresa.brief
 6. Contenido         ← brief + memoria + previos → radar_contenido + copilot_ideas
 7. Grilla (mensual)  ← brief + copies + memoria → radar_contenido (tipo=grilla)
 8. Guiones           ← brief + copies + dedup previos + memoria → copilot_guiones
 9. Auditoría         ← brief + contenido + posts → copilot_auditorias
10. PDF ejecutivo     ← KPIs + brief + IA + copies + auditoría barras
11. Excel             ← copies + guiones (+ grilla si mensual)
12. Email             ← brief section + IA + empresas + copies preview + auditoría + CTA
```

## 12 Agentes

| # | Agente | Archivo | Input | Output | API | Costo |
|---|--------|---------|-------|--------|-----|-------|
| 1 | Memoria | `radar-memoria.js` | Supabase 6 tablas | Objeto memoria 5 secciones | - | $0 |
| 2 | Perfil | `radar-perfil.js` | Nombre+cuentas | perfil_empresa | OpenAI | ~$0.01 |
| 3 | Brief | `radar-brief.js` | Perfil+posts+memoria | perfil_empresa.brief | OpenAI 4o | ~$0.02 |
| 4 | Contenido | `radar-contenido.js` | Brief+memoria+previos+posts | radar_contenido+ideas | OpenAI+Claude | ~$0.03 |
| 5 | Grilla | `radar-grilla-mensual.js` | Brief+copies+memoria+posts | radar_contenido (grilla) | OpenAI+Claude | ~$0.10 |
| 6 | Guiones | `radar-guiones.js` | Brief+copies+dedup+memoria | copilot_guiones | OpenAI | ~$0.01 |
| 7 | Auditoría | `radar-auditoria.js` | Brief+contenido+posts | copilot_auditorias | - | $0 |
| 8 | Ideas | (en contenido) | Gap analysis de copies | copilot_ideas | - | $0 |
| 9 | QA técnico | `copilot-qa-tecnico.js` | Supabase+web | 57 checks | - | $0 |
| 10 | QA E2E | `copilot-qa-e2e.js` | Supabase+web+memoria | 83 checks | - | $0 |
| 11 | Validador | `radar-validar-cuentas.js` | Handles | Validación+notificación | Apify | ~$0.02 |
| 12 | Orquestador | `radar-clipping.js` v7 | Todo | Email+PDF+Excel | Apify+APIs | variable |

## Feedback Loops (10)

```
 1. Ideas aprobadas     → Brief → Copies (se priorizan)
 2. Ideas descartadas   → Brief → Copies (se evitan)
 3. Auditoría débil     → Brief agrega reglas compensatorias
 4. Competencia crece   → Brief agrega contraataque
 5. Problemas QA        → Memoria → todos los agentes evitan
 6. Formato ganador     → Grilla prioriza
 7. Copies previos      → Contenido + Grilla NO repiten
 8. Guiones previos     → Guiones NO repiten títulos
 9. Cliente edita brief → Próximo run usa brief editado
10. Cliente aprueba idea → Email a M&P + prioridad en copies
```

## Dashboard (7 tabs)

| Tab | Funcionalidad |
|-----|---------------|
| Competencia | Posts por empresa, engagement, top 5, insights IA |
| **Brief** | Visualizar + **editar** (PVU, territorios, reglas, tono) |
| Contenido | Copies + grilla, scores, copy button, export Excel |
| Auditoría | Score 0-100, criterios barras, scores por red, selector mes |
| Guiones | Reel+Story con gancho/escenas/cierre/dirección visual |
| **Ideas** | Banco de ideas + **aprobar/descartar/en_progreso** → notifica M&P |
| Reporte | Ejecutivo imprimible: resumen + empresas + fortalezas/mejoras + top posts |

## Email (secciones en orden)

1. Header (M&P Copilot + fecha + ventana)
2. KPIs (posts, redes, likes, empresas)
3. **Brief resumen** (propuesta valor + territorios + reglas)
4. Análisis IA (contexto + empresas badge + oportunidad + alerta)
5. Tabla empresas (posts, likes, engagement promedio)
6. Top 5 posts (red, texto, likes)
7. **Copies preview** (plataforma + tipo + score + título + **2 líneas preview** + ref competidor)
8. Grilla preview (mensual)
9. Guiones preview (duración + gancho)
10. **Auditoría** (score + scores por red + criterios fortaleza/debilidad)
11. CTA (contratar o ver dashboard)
12. Footer (plan incluye, horario)

## PDF Ejecutivo (dark A4, 2 páginas)

**Página 1:**
- Header M&P Copilot + nombre cliente + fecha
- KPIs: posts, likes, comments, empresas, score auditoría
- Brief: propuesta valor + badges territorios
- Análisis competitivo: tabla empresas + badges + insights
- Oportunidad + alerta

**Página 2:**
- Copies: preview completo + referencia competidor + score
- Auditoría: score grande + barras por criterio con colores

## QA E2E (83 checks, 11 categorías)

| Categoría | Checks | Qué verifica |
|-----------|--------|--------------|
| SUB | 2 | Suscripción carga, perfil existe |
| BRIEF | 11 | Existe, campos llenos, interconexión →grilla/copies/guiones |
| POSTS | 6 | Datos válidos, multi-competidor, texto presente |
| COPIES | 18 | Largo, título, plataforma, score, hashtags, no [object Object], ref competidor |
| GRILLA | 3 | Existe, >=4 posts, score >60 |
| GUIONES | 12 | Títulos, gancho objeto, escenas >=2, cierre CTA, ref competencia |
| AUDIT | 6 | Score numérico, criterios >=8 con nombre+score, scores_red, fortaleza |
| IDEAS | 3 | Existen, títulos, gap analysis |
| MEMORIA | 4 | Carga, copies aprendizaje, competencia, contexto |
| DASH | 6 | HTTP 200, no [object Object], no undefined, dark theme, branding |
| LINKS | 5 | /copilot, /login, /dashboard, /configurar, /contratar |

## Tablas Supabase

| Tabla | Campos clave |
|-------|-------------|
| clipping_suscripciones | id, email, plan, estado, cuentas[], perfil_empresa.brief, emails_destino |
| radar_posts | suscripcion_id, red, handle, texto, likes, comments, tipo_post, fecha_post |
| radar_contenido | suscripcion_id, tipo (copy/grilla), datos[], score_promedio, mes, anio |
| copilot_ideas | suscripcion_id, titulo, descripcion, categoria, prioridad, estado |
| copilot_auditorias | suscripcion_id, score_general, scores_red{}, criterios[], fortaleza, debilidad |
| copilot_guiones | suscripcion_id, datos[] (titulo, gancho{}, escenas[], cierre{}, direccion_visual{}) |

## API Routes

| Ruta | Método | Uso |
|------|--------|-----|
| /api/copilot/trial | POST | Crear suscripción trial |
| /api/copilot/activar | POST | Activar plan |
| /api/copilot/checkout | POST | Flow.cl (pendiente) |
| /api/copilot/export-grilla | GET | Descargar Excel grilla |
| /api/copilot/notify-idea | POST | Notificar M&P al aprobar/descartar idea |

## Workflows GitHub Actions

| Workflow | Schedule | Modo | Status |
|----------|----------|------|--------|
| radar-clipping-diario.yml | L-V 7:30 AM Chile | --diario | cron COMENTADO |
| radar-clipping-semanal.yml | Lunes 9:00 AM Chile | --semanal | cron COMENTADO, dispatch OK |
| radar-clipping-mensual.yml | Día 1, 9:00 AM Chile | --mensual | cron COMENTADO |
| copilot-qa.yml | manual | QA técnico | dispatch OK |

## Plan de Upgrades Pendientes

| # | Upgrade | Estado |
|---|---------|--------|
| 1 | LinkedIn scraping | BLOQUEADO — evaluar Proxycurl/API |
| 2 | Auditoría semanal | ✅ HECHO |
| 3 | QA grilla estricto | ✅ HECHO |
| 4 | Email preview copy | ✅ HECHO |
| 5 | Brief editable | ✅ HECHO |
| 6 | Notificación ideas | ✅ HECHO |
| 7 | PDF ejecutivo | ✅ HECHO |
| 8 | Flow.cl pagos | PENDIENTE (al final) |
| 9 | Crons activados | PENDIENTE (cuando QA 100% + cliente confirme) |
| 10 | Multi-país | FUTURO |
