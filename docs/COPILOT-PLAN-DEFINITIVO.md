# Copilot — Plan definitivo de producción

> 24 abril 2026 — Este es EL plan. No hay otro.

---

## ESTADO ACTUAL (la verdad)

### Lo que funciona
- Instagram scraping: actores OK, data real de Buk/Talana/Workera Chile
- Email dark theme: se envía, llega, se ve bien en Gmail
- Dashboard: carga, dark theme, 6 tabs visibles
- Landing: mockups, trial form, planes
- Config page: dark theme, carga datos

### Lo que está ROTO
- **LinkedIn: COMPLETAMENTE ROTO** — actor apimaestro devuelve posts falsos de Google para todos los handles. 206 posts basura generados y borrados. Actor harvestapi devuelve 0. No hay actor de LinkedIn funcional.
- **Todo el contenido generado es basura** — copies, grilla, guiones, ideas, auditoría se generaron con data falsa de LinkedIn. Todo borrado.
- **Dashboard bugs:** filtro 7/30/90 no cambia datos, auditoría muestra [object Object], configurar crashea, links rotos
- **Calidad agentes: nivel kinder** — copies genéricos sin análisis real, guiones de 1 línea, ideas sin correlación con competencia, score QA siempre 100 (no filtra nada)
- **Sin autenticación** — cualquiera con el UUID entra al dashboard
- **Posts sin engagement** — likes y comments en 0 para LinkedIn (data falsa)

---

## FASE 0: LINKEDIN (resolver o descartar)
**Duración: 1 día**
**Archivos: scripts/radar-clipping.js**

### 0.1 Deshabilitar LinkedIn del pipeline
- Comentar sección LinkedIn en radar-clipping.js
- Copilot corre SOLO con Instagram hasta que LinkedIn funcione
- No gastar más créditos de Apify en actores rotos

### 0.2 Investigar actores reales
- Probar harvestapi con URLs correctas (sin /posts/)
- Probar apimaestro con input diferente (companyUrl vs companyUrls)
- Probar actor 3: harvestapi~linkedin-post-search
- Para CADA uno: verificar que devuelve posts REALES de la empresa correcta
- Verificar: texto del post corresponde a la empresa, likes > 0, idioma correcto

### 0.3 Validación anti-basura
- Antes de persistir posts de LinkedIn, verificar:
  - El texto del post menciona algo relacionado con la empresa
  - O el author coincide con el handle
  - No todos los posts son iguales (deduplicación)
  - Al menos 1 post tiene likes > 0

### 0.4 Decisión
- Si un actor funciona: reactivar LinkedIn con validación
- Si ninguno funciona: Copilot se vende solo con IG + Prensa. LinkedIn queda como "próximamente"

---

## FASE 1: BUGS CRÍTICOS
**Duración: 1 día**
**Archivos: CopilotDashboard.tsx, ConfigClient.tsx, radar-clipping.js, radar-auditoria.js**

### 1.1 Filtro 7/30/90 días
- **Bug:** useEffect no depende de `periodo`, siempre muestra misma data
- **Fix:** agregar `periodo` como dependencia del useEffect en loadData()
- **Archivo:** CopilotDashboard.tsx línea 22

### 1.2 Auditoría [object Object]
- **Bug:** criterios se guardan como objetos, dashboard intenta renderizar objetos
- **Fix:** radar-auditoria.js debe guardar criterios como `[{nombre: "X", score: 8}]` y dashboard debe leer `.score` no el objeto entero
- **Archivos:** radar-auditoria.js + CopilotDashboard.tsx

### 1.3 Configurar crash
- **Bug:** /copilot/configurar sin ID da 404, botón "Configurar" del dashboard apunta mal
- **Fix:** verificar URL en el botón del dashboard header, agregar redirect en /copilot/configurar/page.tsx
- **Archivos:** CopilotDashboard.tsx (link), nueva page.tsx redirect

### 1.4 Links y navegación
- **Bug:** breadcrumb "Copilot" lleva a landing en vez de dashboard, "Configurar" se cae
- **Fix:** revisar TODOS los links en dashboard y config, verificar que cada uno funciona
- **Archivos:** CopilotDashboard.tsx, ConfigClient.tsx

### 1.5 Posts sin likes/comments
- **Bug:** LinkedIn posts tenían 0 likes (data falsa, ya borrada)
- **Fix:** con LinkedIn deshabilitado, solo quedan posts IG que SÍ tienen likes reales
- **Verificar:** que los posts de IG muestran likes y comments correctos en el dashboard

---

## FASE 2: AGENTES INTELIGENTES
**Duración: 3 días**
**Archivos: radar-contenido.js, radar-guiones.js, radar-auditoria.js, radar-clipping.js, NUEVO: radar-brief.js**

### 2.1 Brief del cliente (NUEVO agente)
- **Crear:** scripts/radar-brief.js
- **Qué hace:** genera brief estratégico completo del cliente
- **Input:** perfil_empresa + posts propios (si hay) + posts competencia + industria
- **Output en Supabase:** campo `brief_estrategico` en clipping_suscripciones con:
  - Propuesta de valor diferenciada
  - Público objetivo con pain points
  - 4-5 territorios de contenido
  - Tono detallado con ejemplos
  - Diferenciadores vs cada competidor
  - Estacionalidad del mes
- **Se corre:** primera vez + mensual (para actualizar)
- **El brief alimenta TODOS los demás agentes**

### 2.2 Copies con inteligencia real
- **Reescribir:** radar-contenido.js paso 1 (brief de copies)
- **Input obligatorio:**
  - Brief estratégico del cliente (2.1)
  - Top 10 posts de competencia con más engagement
  - Análisis de qué funciona (formato, tema, tono, largo)
  - Contexto estacional (fechas del mes, eventos de la industria)
  - Posts previos del cliente (evitar repetir)
- **Output:**
  - Copies de mínimo 200 palabras (IG) / 300 palabras (LI)
  - Justificación basada en datos de competencia
  - Hashtags investigados (no genéricos)
  - Nota de diseño específica (no "imagen atractiva")
- **QA real:**
  - Score no puede ser 100 automáticamente
  - Penalizar: genéricos, sin datos, sin estacionalidad, sin referencia a competencia
  - Si score < 70: regenerar con feedback específico

### 2.3 Guiones con estructura real
- **Reescribir:** radar-guiones.js
- **Output por guión:**
  - Gancho: frase exacta + timing (0-3 seg) + qué se ve en pantalla
  - Desarrollo: 3-5 escenas con timing, texto overlay, voz off/on
  - CTA: acción específica medible
  - Referencia: "Este formato funciona porque [competidor] lo usó y tuvo X engagement"
  - Sugerencia visual: planos, transiciones, colores, tipografía
  - Música/audio sugerido

### 2.4 Ideas con correlación real
- **Reescribir:** lógica de ideas en radar-contenido.js
- **Input:** top posts de competencia por engagement + gaps de contenido
- **Output por idea:**
  - Título con ángulo claro
  - Por qué funciona (basado en data de competencia)
  - Qué competidor ya lo hizo y con qué resultado
  - O qué competidor NO lo hizo (oportunidad)
  - Prioridad basada en gap analysis (no random)
  - Categoría inteligente basada en contenido, no genérica

### 2.5 Auditoría con scores reales
- **Reescribir:** radar-auditoria.js
- **Criterios con cálculo real:**
  - Frecuencia: posts/semana del cliente vs promedio competencia
  - Engagement: likes+comments por post vs competencia
  - Consistencia: desviación estándar de posts por semana
  - Variedad: tipos de post usados vs disponibles
  - Calidad copies: score QA promedio de copies generados
  - Hashtags: análisis de hashtags usados vs tendencia
  - Horarios: análisis de cuándo publica vs cuándo la audiencia está activa
  - Interacción: ratio comments/likes vs competencia
- **Output:** JSON con scores numéricos (no objetos), comparación vs competencia, recomendaciones accionables específicas
- **Guardar en copilot_auditorias como:** `criterios: [{nombre: "Frecuencia", score: 8, detalle: "3 posts/sem vs 5 de Buk", recomendacion: "Aumentar a 4 posts/sem"}]`

---

## FASE 3: DASHBOARD NIVEL PRODUCCIÓN
**Duración: 3 días**
**Archivos: CopilotDashboard.tsx**

### 3.1 Tab Competencia
- Filtro 7/30/90 funcional (ya arreglado en Fase 1)
- Tabla de empresas con mini análisis IA por empresa (1 línea de insight)
- Top 5 posts por engagement (no los últimos, los MEJORES)
- Posts muestran likes, comments, tipo de post
- Gráfico de barras por empresa (no solo por día)
- Tendencia: comparación vs período anterior (sube/baja por empresa)

### 3.2 Tab Contenido
- Formato CONSISTENTE entre meses (abril = mayo)
- Copies completos visibles (no truncados)
- Score con color y justificación visible
- Botón "Copiar copy" para cada uno
- Grilla con todos los posts, no solo 8
- Hashtags visibles
- Nota de diseño visible

### 3.3 Tab Auditoría
- Score general grande con color
- Scores por red con barras de progreso
- Criterios con score numérico + detalle + recomendación
- Comparación mes anterior (si hay datos)
- Sección "Qué mejorar este mes" con acciones concretas

### 3.4 Tab Guiones
- Cada guión con secciones claras: gancho, desarrollo, cierre
- Timing visible
- Sugerencia visual con detalle
- Referencia a competencia

### 3.5 Tab Ideas
- Ideas con contexto de competencia
- Gap analysis visible
- Prioridad con justificación
- Filtros funcionales

### 3.6 Tab Reporte
- Comparación mes anterior en cada sección
- Gráficos (barras de comparación, no solo números)
- Análisis IA profundo con conclusiones y acciones
- PDF descargable con diseño profesional (no window.print)
- Score de auditoría correcto (no [object Object])

---

## FASE 4: EMAILS PROFESIONALES
**Duración: 1 día**
**Archivos: radar-clipping.js (generarEmailHTML), radar-lifecycle.js**

### 4.1 Email diario
- KPIs reales con datos correctos
- Top post del día con análisis de por qué funcionó
- Tabla de empresas SIN columnas vacías
- Análisis IA que diga algo útil (no genérico)

### 4.2 Email semanal
- Resumen de tendencias de la semana
- Preview de copies con contexto (no solo título)
- Excel adjunto con formato (ExcelJS, ya implementado)
- Guiones en Excel con estructura completa

### 4.3 Email mensual
- Todo lo del semanal +
- Grilla completa en Excel formateado
- Auditoría visual (scores reales, recomendaciones)
- Reporte ejecutivo PDF adjunto con diseño dark M&P
- Comparación mes anterior

---

## FASE 5: AUTENTICACIÓN Y UX
**Duración: 1 día**
**Archivos: nuevas pages, middleware, API routes**

### 5.1 Login cliente
- Página /copilot/login con email + magic link (Supabase Auth)
- Al crear trial: crear usuario en Supabase Auth + enviar magic link
- Email de bienvenida con link de acceso (no UUID público)

### 5.2 Proteger dashboard
- Middleware que verifica sesión en /copilot/dashboard/*
- Si no hay sesión: redirect a /copilot/login
- Si hay sesión pero no coincide con suscripción: error

### 5.3 Navegación
- Breadcrumbs funcionales
- Todos los links verificados
- "Configurar" siempre funciona
- "Volver" siempre funciona
- No más 404 en navegación

---

## FASE 6: TEST COMPLETO Y CORRECCIONES
**Duración: 1 día**

### 6.1 Limpiar data de test
- Borrar suscripción test 209ef08d
- Crear suscripción limpia con handles verificados (solo IG)
- Validar handles con el agente validador

### 6.2 Correr pipeline completo
- Diario: verificar email + dashboard con data real
- Semanal: verificar copies + guiones + ideas + Excel adjuntos
- Mensual: verificar grilla + auditoría + reporte PDF

### 6.3 Verificar cada tab
- Competencia: datos correctos, filtros funcionan, engagement real
- Contenido: copies de calidad, scores reales, formato consistente
- Auditoría: scores numéricos, recomendaciones útiles
- Guiones: estructura completa, timing, visual
- Ideas: correlación con competencia, gap analysis
- Reporte: comparación, gráficos, PDF descargable

### 6.4 Verificar cada email
- Diario llega con datos correctos
- Semanal llega con Excel adjuntos formateados
- Mensual llega con todo

### 6.5 Verificar auth
- Login funciona
- Dashboard protegido
- Magic link funciona

---

## ORDEN DE EJECUCIÓN

| Fase | Qué | Días | Dependencia |
|------|-----|------|-------------|
| 0 | LinkedIn: resolver o descartar | 1 | Ninguna |
| 1 | Bugs críticos | 1 | Fase 0 |
| 2 | Agentes inteligentes | 3 | Fase 1 |
| 3 | Dashboard producción | 3 | Fase 2 |
| 4 | Emails profesionales | 1 | Fase 3 |
| 5 | Auth + UX | 1 | Fase 4 |
| 6 | Test + correcciones | 1 | Fase 5 |
| **Total** | | **11 días** | |

---

## REGLAS DE ESTE PLAN

1. NO se salta fases
2. NO se dispara el pipeline sin verificar la data
3. NO se mandan emails de test a clientes
4. Cada fase se verifica ANTES de pasar a la siguiente
5. Si un agente genera contenido genérico, se reescribe el prompt
6. Si un actor de scraping devuelve basura, se deshabilita
7. Documentar cada cambio en GitHub
8. Guardar estado en memoria al final de cada día
