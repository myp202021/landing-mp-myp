# Copilot — Sistema de Agentes IA Interconectados

> Actualizado: 25 abril 2026

## Arquitectura General

```
                    ┌─────────────────┐
                    │  MEMORIA        │ ← Lee historico de TODAS las tablas
                    │  radar-memoria  │   (copies, ideas, auditoria, competencia, guiones)
                    └────────┬────────┘
                             │ contexto de aprendizaje
                             ▼
┌──────────────┐    ┌─────────────────┐
│ Competencia  │───▶│  BRIEF          │ ← Recomendaciones de auditoria previa
│ (scraping)   │    │  radar-brief    │   + patrones competencia 60 dias
│              │    │                 │   + ideas aprobadas/descartadas
└──────────────┘    └────────┬────────┘
                             │ brief estrategico
                    ┌────────┴────────────────────────────┐
                    │                │                     │
                    ▼                ▼                     ▼
           ┌──────────────┐ ┌──────────────┐    ┌──────────────┐
           │  CONTENIDO   │ │  GUIONES     │    │  GRILLA      │
           │  (copies)    │ │  (reels)     │    │  (mensual)   │
           │              │ │              │    │              │
           │ + memoria    │ │ + brief      │    │ + brief      │
           │ + brief      │ │ + memoria    │    │ + copies     │
           │ + previos    │ │ + previos    │    │ + memoria    │
           └──────┬───────┘ └──────────────┘    └──────────────┘
                  │
                  │ copies generados + gap analysis
                  ▼
           ┌──────────────┐
           │  IDEAS       │ ← Se generan automaticamente
           │              │   Cliente puede: aprobar/descartar/en_progreso
           │              │   Ideas aprobadas → prioridad en proximo run
           └──────────────┘
                  │
                  ▼
           ┌──────────────┐
           │  AUDITORIA   │ ← Score 0-100, 8-10 criterios
           │  (mensual)   │   Incluye cobertura de territorios (brief)
           │              │   Incluye alineacion con brief
           │              │   Genera fortaleza/debilidad
           │              │   → Retroalimenta proximo brief
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │  EMAIL +     │ ← Recibe TODO: posts, IA, copies, grilla,
           │  DASHBOARD   │   guiones, auditoria, ideas
           │  + PDF/Excel │
           └──────────────┘
```

---

## Agentes en Detalle

### 1. MEMORIA (`radar-memoria.js`)
**Rol:** Sistema de aprendizaje inter-run. Lee datos historicos y genera contexto.
**Input:** Supabase (todas las tablas)
**Output:** Objeto `memoria` con 5 secciones
**Costo:** $0 (solo queries a Supabase)

**Secciones:**
- `copiesAprendizaje`: mejor/peor angulo, mejor plataforma, score promedio, problemas recurrentes, factores de exito
- `ideasContext`: ideas aprobadas (priorizar), descartadas (evitar), en progreso (no duplicar)
- `auditoriaAprendizaje`: ultimo score, tendencia, criterios debiles/fuertes
- `competenciaPatrones`: perfil por competidor (60 dias), tendencias, formato/tema ganador global
- `guionesPrevios`: titulos previos (dedup)

**Funciones exportadas:**
- `cargarMemoria(supabase, suscripcionId)` → objeto memoria
- `generarContextoAprendizaje(memoria)` → texto para inyectar en prompts
- `generarRecomendacionesBrief(memoria)` → array de recomendaciones

---

### 2. BRIEF ESTRATEGICO (`radar-brief.js`)
**Rol:** Director de estrategia. Genera el documento que alimenta todos los agentes.
**Input:** Perfil empresa + posts competencia + memoria (auditoria + ideas + patrones)
**Output:** JSON con 8 campos, guardado en `clipping_suscripciones.perfil_empresa.brief`
**API:** OpenAI gpt-4o
**Costo:** ~$0.02/run

**Campos del brief:**
1. `resumen_negocio` — posicion en mercado
2. `publico_objetivo` — descripcion + pain_points + motivaciones
3. `propuesta_valor_unica` — frase diferenciadora
4. `competidores_analizados` — fortalezas/debilidades/oportunidades por competidor
5. `territorios_contenido` — pilares tematicos con justificacion y formatos
6. `tono_comunicacion` — estilo + palabras a usar/evitar
7. `calendario_estacional` — fechas relevantes + oportunidades
8. `reglas_contenido` — reglas accionables

**Retroalimentacion:**
- Lee auditoria previa → si hay criterios debiles, agrega reglas compensatorias
- Lee ideas aprobadas → las incorpora como directriz
- Lee ideas descartadas → las excluye
- Lee patrones de competencia → adapta territorios

---

### 3. CONTENIDO / COPIES (`radar-contenido.js`)
**Rol:** Pipeline de 3 pasos para generar copies de calidad.
**Input:** Posts competencia + brief + memoria + copies previos
**Output:** 3 copies en `radar_contenido` + ideas en `copilot_ideas`
**APIs:** OpenAI gpt-4o-mini (analisis + QA), Claude Sonnet (copies)
**Costo:** ~$0.03/run

**Pipeline:**
1. **Paso 1 — Analisis (OpenAI):** Top 10 posts por engagement → 3 briefs con justificacion competitiva
2. **Paso 2 — Creacion (Claude):** Copy completo por brief, min 150-250 palabras, referencia competidor
3. **Paso 3 — QA (heuristico):** Score 0-95, 15+ penalizaciones, 6 bonos, auto-fix si <65

**Aprendizaje:**
- Lee copies previos (ultimos 3 batches) → NO repetir temas/angulos
- Lee memoria → mejores angulos, problemas recurrentes, factores de exito
- Lee ideas aprobadas → priorizar esos temas
- Lee ideas descartadas → evitar esos temas
- Genera ideas como efecto secundario (gap analysis)

---

### 4. GRILLA MENSUAL (`radar-grilla-mensual.js`)
**Rol:** Plan de contenido completo para el mes siguiente.
**Input:** Posts competencia + brief + copies ya generados + memoria
**Output:** 4-16 posts en `radar_contenido` (tipo=grilla)
**APIs:** OpenAI gpt-4o (plan), Claude Sonnet (copies), OpenAI gpt-4o-mini (QA)
**Costo:** ~$0.05-0.15/run (depende de cantidad posts)

---

### 5. GUIONES (`radar-guiones.js`)
**Rol:** Guiones de video listos para produccion.
**Input:** Posts competencia + brief + copies generados + memoria
**Output:** 2 guiones en `copilot_guiones`
**API:** OpenAI gpt-4o-mini
**Costo:** ~$0.01/run

**Aprendizaje:**
- Lee titulos de guiones previos → NO repetir
- Lee patrones de competencia → adaptar formatos
- Sigue territorios del brief

---

### 6. AUDITORIA (`radar-auditoria.js`)
**Rol:** Evaluacion mensual del desempeno.
**Input:** Posts + contenido + cuentas + brief
**Output:** Score 0-100 + criterios en `copilot_auditorias`
**Costo:** $0 (pura logica)

**Criterios base (8):** Frecuencia, Engagement, Consistencia, Calidad copies, Hashtags, Horarios, Variedad, Interaccion

**Criterios brief-aware (+2 si brief existe):**
9. Cobertura de territorios
10. Alineacion con brief

---

### 7. IDEAS (`copilot_ideas`)
**Estados (gestionables desde dashboard):**
- `nueva` → `aprobada` (se prioriza) / `descartada` (se evita) / `en_progreso` (no duplicar) → `publicada`

---

## Tablas Supabase

| Tabla | Uso |
|-------|-----|
| `clipping_suscripciones` | Config + perfil_empresa.brief |
| `radar_posts` | Posts competencia (historico) |
| `radar_contenido` | Copies (tipo=copy) + grillas (tipo=grilla) |
| `copilot_ideas` | Ideas con estado |
| `copilot_auditorias` | Auditorias mensuales |
| `copilot_guiones` | Guiones de video |

---

## Flujo de Ejecucion

```
1. Scraping      → radar_posts
2. Trends        ← radar_posts (periodo anterior)
3. MEMORIA       ← TODO (copies, ideas, auditoria, competencia, guiones)
4. Perfil        → clipping_suscripciones.perfil_empresa
5. Brief         ← memoria + posts → perfil_empresa.brief
6. Contenido     ← brief + memoria + previos → radar_contenido + copilot_ideas
7. Grilla        ← brief + copies + memoria → radar_contenido
8. Guiones       ← brief + copies + memoria → copilot_guiones
9. Auditoria     ← brief + contenido + posts → copilot_auditorias
10. Email + PDF  ← TODO
```

## Loops de Retroalimentacion

```
Ideas aprobadas    → Brief → Copies (se priorizan)
Ideas descartadas  → Brief → Copies (se evitan)
Auditoria debil    → Brief → Copies (se compensan)
Copies score bajo  → QA auto-fix → Copies mejorados
Competencia crece  → Brief → Copies (contraataque)
Formato ganador    → Brief → Grilla (se prioriza)
Problemas recurrentes → Memoria → Todos los agentes (se evitan)
```
