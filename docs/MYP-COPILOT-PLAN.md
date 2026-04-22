# M&P Copilot — Plan de producto completo

**Fecha:** 22 abril 2026
**Nombre anterior:** Radar / Clipping
**Nombre nuevo:** M&P Copilot — Tu copiloto de marketing digital

---

## Qué es

Plataforma de inteligencia competitiva + generación de contenido + reportería para empresas que quieren dominar su presencia digital sin tener un equipo interno grande. No es solo monitoreo — es un copiloto que te dice qué hace la competencia, qué publicar, cuándo publicar, y cómo te está yendo.

## Lo que ya funciona (testeado 21 abril)
- Monitoreo IG + LI + FB + prensa de competidores
- Análisis IA diario (OpenAI)
- Copies sugeridos semanales (pipeline 3 agentes: brief→copy→QA)
- Grilla mensual con calendario y copy por post
- Excel descargable de grilla
- Dashboard con tabs Competencia + Contenido
- Config: web, RRSS propios, competidores, frecuencia
- Pagos Flow.cl
- Emails con CTA condicional (trial/activo)
- CRM admin

---

## Mejoras por fase

### FASE 1: Renaming + WhatsApp (mayo 2026)

**Renaming:**
- [ ] URL: /clipping → /copilot
- [ ] Landing rediseñada con branding "M&P Copilot"
- [ ] Dashboard: "Tu Copilot" en vez de "Tu Radar"
- [ ] Emails: "M&P Copilot" en headers
- [ ] Meta tags, JSON-LD, OG tags actualizados
- [ ] CRM admin: pestaña "Copilot" en vez de "Radar"

**WhatsApp Business API:**
- [ ] Integrar con API oficial (Meta Business) o proveedor (Twilio/360dialog)
- [ ] Resumen diario por WhatsApp: "3 posts nuevos de tu competencia, el más relevante es..."
- [ ] Alerta de oportunidad: "Tu competidor X no publica hace 5 días"
- [ ] Alerta de viralidad: "Post de X tiene 10x más engagement que su promedio"
- [ ] Solo para plan Pro y Business
- [ ] Costo API WhatsApp: ~$0.05/mensaje → ~$1.50/mes por cliente (30 mensajes)

### FASE 2: Reportei integrado (junio 2026)

**Reportei = reportería automática de RRSS del cliente**
- [ ] El cliente conecta sus cuentas (IG, FB, LI, Google Ads, GA4) via OAuth
- [ ] Reportei API genera métricas: followers, reach, engagement, ads performance
- [ ] Dashboard "Mi marca" (además de "Competencia" y "Contenido"):
  - Mis followers vs competencia
  - Mi engagement vs competencia
  - Mis mejores posts del mes
  - Comparativa: "Tu engagement es 2.3% vs 1.8% promedio de tu industria"
- [ ] Informe PDF mensual tipo consultora (diseño M&P)
- [ ] Solo plan Pro y Business
- [ ] Costo Reportei API: ya tienen acceso (verificar plan)

### FASE 3: Imágenes para grillas (julio 2026)

**Templates HTML → PNG (costo $0):**
- [ ] 6 layouts: quote, dato, carrusel, tip, CTA, comparativa
- [ ] Requiere upload de logo del cliente en config
- [ ] Colores de marca del perfil_empresa
- [ ] Renderizado con Puppeteer en GitHub Actions
- [ ] Se adjuntan al email mensual como galería
- [ ] Se muestran en dashboard pestaña Contenido
- [ ] Starter: 4 imágenes, Pro: 8, Business: 16

**Alternativa Freepik API ($5 EUR free tier):**
- [ ] Buscar foto relevante por keywords del copy
- [ ] Incrustar en template como fondo
- [ ] Requiere plan API de Freepik (evaluar costo)

### FASE 4: Benchmark acumulativo (agosto 2026)

- [ ] Gráfico de evolución por competidor (posts/mes, engagement/mes)
- [ ] Comparativa mes a mes: quién crece, quién se estanca
- [ ] Detección de tendencias: "X aumentó 40% su actividad en LI este mes"
- [ ] Score de presencia digital por competidor (1-10)
- [ ] Informe trimestral automático con insights

### FASE 5: Calendario inteligente (septiembre 2026)

- [ ] Vista calendario de la grilla mensual (no solo tabla)
- [ ] Drag & drop para reorganizar posts
- [ ] Integración Google Calendar (exportar como .ics)
- [ ] Sugerencia de horario óptimo por plataforma
- [ ] Estado por post: borrador → aprobado → publicado

### FASE 6: Agente de perfil avanzado (octubre 2026)

- [ ] Scrape web del cliente + competidores → análisis automático
- [ ] Propuesta de posicionamiento: "Tu diferenciador vs X es..."
- [ ] Sugerencia de tono, temas a evitar, oportunidades
- [ ] Se actualiza cada mes con datos nuevos

---

## Planes revisados M&P Copilot

| Dimensión | Starter $34.990 | Pro $69.990 | Business $119.990 |
|---|---|---|---|
| **Monitoreo** | IG (5 cuentas) | IG+LI+FB (15 cuentas) | IG+LI+FB (30 cuentas) |
| **Análisis IA** | Diario básico | Diario + semanal profundo | Diario + semanal + mensual |
| **Copies sugeridos** | No | 3/semana | 3/semana |
| **Grilla mensual** | 4 posts | 8 posts | 16 posts + imágenes |
| **Excel grilla** | No | Sí | Sí |
| **WhatsApp** | No | Resumen diario | Resumen + alertas en tiempo real |
| **Reportei (mi marca)** | No | Dashboard básico | Dashboard + PDF mensual |
| **Benchmark** | No | No | Evolución + score competidores |
| **Dashboard** | Competencia | Competencia + Contenido | Todo + Benchmark + Mi marca |
| **Soporte** | Email | Email + WhatsApp | Reunión mensual |

---

## Costos operativos por cliente/mes

| Componente | Starter | Pro | Business |
|---|---|---|---|
| Apify scraping | $2 USD | $4 USD | $6 USD |
| OpenAI (análisis + QA) | $0.50 | $1.50 | $3 |
| Anthropic Claude (copies) | $0 | $1 | $2 |
| WhatsApp API | $0 | $1.50 | $3 |
| Reportei | $0 | $2 | $4 |
| Resend emails | $0.10 | $0.30 | $0.50 |
| **Total** | **~$2.60** | **~$10.30** | **~$18.50** |
| **Precio plan** | **$34.990** | **$69.990** | **$119.990** |
| **Margen** | **92%** | **85%** | **84%** |

---

## Cronograma

| Mes | Fase | Entregable |
|---|---|---|
| Mayo 2026 | Rename + WhatsApp | M&P Copilot live, WhatsApp básico |
| Junio 2026 | Reportei | Dashboard "Mi marca" con métricas propias |
| Julio 2026 | Imágenes | Templates con logo, 6 layouts |
| Agosto 2026 | Benchmark | Evolución competidores, score, gráficos |
| Septiembre 2026 | Calendario | Vista calendario, drag&drop, Google Calendar |
| Octubre 2026 | Agente perfil | Análisis automático de posicionamiento |

---

## Diferenciadores vs competencia (Brand24, Mention, Meltwater)

1. **Precio:** 10x más barato que Mention/Meltwater
2. **Contenido generado:** nadie más te da copies listos para publicar
3. **Grilla mensual:** calendario completo con IA, no solo monitoreo
4. **WhatsApp nativo:** alertas donde el cliente ya está
5. **Reportei integrado:** competencia + tu marca en un solo lugar
6. **En español chileno:** copies con tono local, no genéricos
7. **Imágenes incluidas:** templates con la marca del cliente
