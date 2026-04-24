# Copilot — Plan de nivel producción

> Fecha: 24 abril 2026
> Objetivo: llevar CADA funcionalidad a un nivel vendible

---

## BUGS CRÍTICOS (arreglar primero)

### B1. Configurar → crash / 404
- /copilot/configurar sin ID da 404
- Al hacer click en "Configurar" desde dashboard se cae
- Fix: verificar breadcrumb URLs, agregar redirect si falta ID

### B2. Auditoría → error en abril, vacío en mayo
- copilot_auditorias tiene datos pero el dashboard no los parsea
- "[object Object]" en fortalezas/debilidades → bug de parsing criterios
- Fix: corregir cómo se lee el JSON de criterios en CopilotDashboard.tsx

### B3. Filtro 7/30/90 días muestra lo mismo
- El filtro de periodo no cambia los datos mostrados
- El fetch siempre trae lo mismo porque la fecha desde no se recalcula
- Fix: el useEffect debe depender de `periodo`, no solo cargarse una vez

### B4. Posts sin likes ni comments
- LinkedIn posts vienen con 0 likes, 0 comments
- apimaestro no devuelve reactions_count / comments_count correctamente
- Fix: revisar campos reales del actor, mapear correctamente

### B5. Posts en inglés
- Los posts de Workera son de Google global, no de Workera Chile
- El handle `workerabyqwantec` trae posts de una empresa equivocada
- Fix: validar que los handles corresponden a las empresas correctas

---

## MEJORAS AGENTES (calidad del contenido)

### A1. Copies — nivel actual: kinder
- Copies genéricos, sin análisis de competencia, sin estacionalidad
- Score 100 siempre → el QA no está filtrando nada
- Brief no considera perfil del cliente ni datos de competencia
- **Fix:** reescribir prompt de paso 1 (brief) para incluir:
  - Últimos 10 posts de la competencia con métricas
  - Perfil detallado del cliente (rubro, tono, diferenciadores)
  - Contexto estacional (fechas importantes del mes)
  - Análisis de qué funciona y qué no en la competencia
  - Mínimo 200 palabras por copy
  - Prohibir copies genéricos sin datos concretos

### A2. Guiones — nivel actual: básico
- Guiones de 1 línea, sin estructura real
- Sin timing detallado, sin sugerencias visuales concretas
- **Fix:** reescribir prompt para generar:
  - Gancho específico con timing (0-3 seg)
  - Desarrollo con escenas (3-15/25 seg)
  - CTA concreto con acción medible
  - Sugerencia visual detallada (planos, transiciones, texto overlay)
  - Referencia a posts exitosos de la competencia

### A3. Ideas — nivel actual: pregunta a OpenAI
- Ideas sin correlación con competencia
- Sin análisis de tendencias ni estacionalidad
- **Fix:** el agente de ideas debe analizar:
  - Posts más exitosos de la competencia (por likes/engagement)
  - Gaps de contenido (qué publica la competencia que el cliente no)
  - Fechas relevantes del mes siguiente
  - Tendencias de la industria

### A4. Auditoría — parsing roto
- Criterios vienen como objetos, no como números
- Score general no se calcula bien
- **Fix:** corregir radar-auditoria.js para guardar scores como números simples
- Dashboard: parsear criterios correctamente

### A5. Brief del cliente — no existe
- No hay pantalla para ver/editar el brief estratégico
- El perfil_empresa es básico (nombre + descripción)
- **Fix:** agregar tab "Brief" en dashboard/config con:
  - Propuesta de valor
  - Público objetivo
  - Territorios de contenido
  - Tono detallado
  - Diferenciadores vs competencia
  - El brief alimenta TODOS los agentes

---

## DASHBOARD — rediseño completo

### D1. Tab Competencia
- Filtro 7/30/90 días debe funcionar (cambiar datos reales)
- Posts deben mostrar likes, comments, engagement
- Tabla de empresas debe tener análisis IA inline (resumen por empresa)
- Gráfico de tendencia por empresa (línea de tiempo)
- Top posts por engagement (no solo los últimos)

### D2. Tab Contenido
- Abril y Mayo deben verse igual (mismo formato)
- Copies más largos, con justificación y contexto
- Score debe ser real (no siempre 100)
- Botón "Editar copy" para que el cliente ajuste
- Comparación con período anterior

### D3. Tab Auditoría
- Arreglar parsing de criterios
- Gráfico radar/spider con los 8 criterios
- Comparación mes anterior
- Recomendaciones accionables (no genéricas)

### D4. Tab Guiones
- Scripts detallados con timing
- Preview visual (storyboard básico)
- Referencia a posts exitosos de competencia

### D5. Tab Ideas
- Ideas correlacionadas con datos de competencia
- Categorización inteligente
- Priorización por oportunidad (gap analysis)

### D6. Tab Reporte
- Comparación con mes anterior
- Gráficos (no solo números)
- Análisis IA profundo (no 5 bullets genéricos)
- Conclusiones y recomendaciones accionables
- Exportar como PDF profesional

---

## EMAIL — rediseño completo

### E1. Email diario
- Compacto pero con insights reales
- Top post del día con análisis de por qué funcionó
- Alerta si competidor hace algo inusual

### E2. Email semanal
- Copies en Excel con formato profesional
- Resumen de tendencias de la semana
- Guiones con estructura completa en Excel

### E3. Email mensual
- Grilla en Excel con formato
- Auditoría visual (no texto plano)
- Reporte ejecutivo como PDF adjunto con diseño
- Comparación mes anterior

---

## AUTENTICACIÓN CLIENTE

### Auth1. Login para clientes
- Actualmente el dashboard es público con UUID
- Necesita: login con email + magic link
- Al registrar trial, enviar credenciales en el email de bienvenida
- Proteger /copilot/dashboard/[id] con sesión

---

## ORDEN DE EJECUCIÓN

### Fase 1: Bugs críticos (1 día)
B1, B2, B3, B4, B5

### Fase 2: Agentes inteligentes (2-3 días)
A1 (copies), A2 (guiones), A3 (ideas), A4 (auditoría), A5 (brief)

### Fase 3: Dashboard nivel producción (2-3 días)
D1-D6 completo

### Fase 4: Emails profesionales (1 día)
E1, E2, E3

### Fase 5: Auth + UX final (1 día)
Auth1, links, navegación, edge cases

### Fase 6: Test completo + correcciones (1 día)
Run diario + semanal + mensual con calidad real
Verificar dashboard, emails, adjuntos, PDF

### Total estimado: 8-10 días de desarrollo
