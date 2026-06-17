# M&P Operations Platform — Documento Funcional v1

## 1. Visión del Producto

**Nombre:** M&P Ops  
**Propósito:** Panel colaborativo donde el equipo registra trabajo, se compara automáticamente PLAN vs EJECUTADO, y se genera reportería para clientes y gerencia.  
**No reemplaza:** CRM (clientes, leads, cotizaciones ya existen en Supabase).  
**Stack:** Next.js + Supabase + Vercel (mismo que el sitio principal).  
**URL propuesta:** ops.mulleryperez.cl  
**Auth:** Supabase Auth (login email + password, ya existe en M&P).

---

## 2. Modelo de Datos (Supabase PostgreSQL)

### 2.1 Tabla `plans` — Planes contratables

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,           -- 'Silver', 'Gold', 'Gold Plus', 'Platinum', 'Custom'
  slug TEXT UNIQUE NOT NULL,
  fee_mensual INTEGER NOT NULL, -- en CLP sin IVA (ej: 950000)
  
  -- Entregables por área (cantidad mensual incluida)
  -- DISEÑO
  graficas_campana INTEGER DEFAULT 0,
  graficas_organicas INTEGER DEFAULT 0,
  carruseles INTEGER DEFAULT 0,
  historias_diseno INTEGER DEFAULT 0,
  reels INTEGER DEFAULT 0,
  videos INTEGER DEFAULT 0,
  motion_graphics INTEGER DEFAULT 0,
  brochures INTEGER DEFAULT 0,
  presentaciones_ppt INTEGER DEFAULT 0,
  landing_pages INTEGER DEFAULT 0,
  
  -- CONTENIDO
  copies_campana INTEGER DEFAULT 0,
  copies_organicos INTEGER DEFAULT 0,    -- posts orgánicos/mes
  guiones_video INTEGER DEFAULT 0,
  grillas_mensuales INTEGER DEFAULT 1,
  historias_contenido INTEGER DEFAULT 0,
  correos_email INTEGER DEFAULT 0,
  landing_copy INTEGER DEFAULT 0,
  grabaciones INTEGER DEFAULT 0,         -- medias jornadas
  reuniones INTEGER DEFAULT 1,
  
  -- PAID MEDIA
  campanas_google INTEGER DEFAULT 0,
  campanas_meta INTEGER DEFAULT 0,
  campanas_linkedin INTEGER DEFAULT 0,
  campanas_tiktok INTEGER DEFAULT 0,
  email_marketing INTEGER DEFAULT 0,
  informes INTEGER DEFAULT 1,
  optimizaciones INTEGER DEFAULT 0,      -- semanales
  
  -- SEO + IA
  articulos_seo INTEGER DEFAULT 0,       -- blog IA
  auditorias_seo INTEGER DEFAULT 0,
  agentes_ia INTEGER DEFAULT 0,
  automatizaciones INTEGER DEFAULT 0,
  
  -- Config
  dashboard_live BOOLEAN DEFAULT FALSE,
  fairplay BOOLEAN DEFAULT FALSE,        -- piezas extra sin cargo
  is_template BOOLEAN DEFAULT TRUE,      -- plan plantilla vs custom
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Planes pre-cargados:**

| Plan | Fee | Gráficas | Posts org. | Reels | Videos | Reuniones | Campañas G | Campañas M | LinkedIn | Artículos SEO | Grabaciones | Dashboard |
|------|-----|----------|-----------|-------|--------|-----------|------------|------------|----------|--------------|-------------|-----------|
| Silver | $950K | 8 | 8 | 2 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | No |
| Gold | $1.35M | 12 | 16 | 4 | 2 | 2 | 2 | 2 | 0 | 20 | 1 | Sí |
| Gold Plus | $1.5M | 12 | 16 | 4 | 2 | 2 | 2 | 2 | 1 | 25 | 1 | Sí |
| Platinum | $2.2M | 16 | 20 | 6 | 4 | 4 | 3 | 3 | 1 | 30 | 2 | Sí |

### 2.2 Tabla `clients` — Clientes

```sql
CREATE TABLE ops_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  plan_id UUID REFERENCES plans(id),
  plan_custom JSONB,              -- override de cantidades si plan es Custom
  account_manager UUID REFERENCES ops_team(id),
  fee_real INTEGER,               -- fee negociado (puede diferir del plan)
  pauta_mensual INTEGER DEFAULT 0,
  status TEXT DEFAULT 'activo',   -- activo, pausado, churned
  start_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Tabla `ops_team` — Equipo

```sql
CREATE TABLE ops_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,              -- 'admin', 'paid_media', 'disenador', 'publicista', 'seo_ia', 'director'
  area TEXT NOT NULL,              -- 'diseno', 'contenido', 'paid_media', 'seo_ia', 'direccion'
  capacity_hours_month INTEGER DEFAULT 160,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 Tabla `deliverables` — Entregables (el corazón)

```sql
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES ops_clients(id) NOT NULL,
  assigned_to UUID REFERENCES ops_team(id),
  
  area TEXT NOT NULL,              -- 'diseno', 'contenido', 'paid_media', 'seo_ia'
  type TEXT NOT NULL,              -- 'grafica_campana', 'reel', 'copy_organico', 'campana_google', etc.
  quantity INTEGER DEFAULT 1,
  
  month INTEGER NOT NULL,          -- 1-12
  year INTEGER NOT NULL,           -- 2026
  
  status TEXT DEFAULT 'pendiente', -- pendiente, en_proceso, revisar, aprobado, entregado
  date_created DATE DEFAULT CURRENT_DATE,
  date_delivered DATE,
  
  hours_estimated NUMERIC(4,1),
  hours_actual NUMERIC(4,1),
  
  is_extra BOOLEAN DEFAULT FALSE,  -- si es fuera de plan
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deliverables_client ON deliverables(client_id, year, month);
CREATE INDEX idx_deliverables_team ON deliverables(assigned_to, year, month);
CREATE INDEX idx_deliverables_status ON deliverables(status);
```

### 2.5 Tabla `meetings` — Reuniones

```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES ops_clients(id),
  date TIMESTAMPTZ NOT NULL,
  type TEXT DEFAULT 'regular',     -- regular, kickoff, extra, interna
  attendees TEXT[],
  notes TEXT,
  action_items TEXT[],
  created_by UUID REFERENCES ops_team(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.6 Vista `v_compliance` — Cumplimiento automático

```sql
CREATE VIEW v_compliance AS
SELECT 
  c.id AS client_id,
  c.name AS client_name,
  c.status,
  p.name AS plan_name,
  d.year,
  d.month,
  d.area,
  d.type,
  -- Plan
  CASE d.type
    WHEN 'grafica_campana' THEN COALESCE((c.plan_custom->>'graficas_campana')::int, p.graficas_campana)
    WHEN 'grafica_organica' THEN COALESCE((c.plan_custom->>'graficas_organicas')::int, p.graficas_organicas)
    WHEN 'reel' THEN COALESCE((c.plan_custom->>'reels')::int, p.reels)
    WHEN 'video' THEN COALESCE((c.plan_custom->>'videos')::int, p.videos)
    WHEN 'copy_organico' THEN COALESCE((c.plan_custom->>'copies_organicos')::int, p.copies_organicos)
    WHEN 'campana_google' THEN COALESCE((c.plan_custom->>'campanas_google')::int, p.campanas_google)
    WHEN 'campana_meta' THEN COALESCE((c.plan_custom->>'campanas_meta')::int, p.campanas_meta)
    WHEN 'articulo_seo' THEN COALESCE((c.plan_custom->>'articulos_seo')::int, p.articulos_seo)
    ELSE 0
  END AS plan_qty,
  -- Ejecutado
  COUNT(CASE WHEN d.status IN ('aprobado','entregado') THEN 1 END) AS executed_qty,
  COUNT(CASE WHEN d.is_extra THEN 1 END) AS extras_qty,
  COUNT(*) AS total_items,
  COUNT(CASE WHEN d.status = 'pendiente' THEN 1 END) AS pending
FROM ops_clients c
JOIN plans p ON c.plan_id = p.id
LEFT JOIN deliverables d ON d.client_id = c.id
GROUP BY c.id, c.name, c.status, p.name, d.year, d.month, d.area, d.type,
         c.plan_custom, p.graficas_campana, p.graficas_organicas, p.reels, p.videos,
         p.copies_organicos, p.campanas_google, p.campanas_meta, p.articulos_seo;
```

---

## 3. Roles y Permisos

| Rol | Ve | Crea | Edita | Admin |
|-----|-----|------|-------|-------|
| **Director** (Christopher) | Todo | Todo | Todo | Sí — planes, clientes, equipo, reportes |
| **Account Manager** | Sus clientes | Entregables, reuniones | Sus entregables | No |
| **Diseñador** | Sus tareas + overview | Entregables diseño | Sus entregables | No |
| **Publicista** | Sus tareas + overview | Entregables contenido | Sus entregables | No |
| **Paid Media** | Sus clientes | Entregables paid | Sus entregables | No |
| **SEO/IA** | Todo (dirección) | Todo SEO/IA | Todo SEO/IA | Parcial |

---

## 4. Páginas / Wireframes

### 4.1 Dashboard Ejecutivo (`/`)

```
┌─────────────────────────────────────────────────────────────────┐
│  M&P Ops                                          [Christopher] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐ │
│  │  35  │  │   3  │  │   2  │  │  87% │  │ 412  │  │$47.2M│ │
│  │Active│  │Paused│  │Delay │  │Compl.│  │Tasks │  │Factur│ │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘ │
│                                                                 │
│  ┌─── Cumplimiento por Área ─────────────────────────────────┐ │
│  │ Diseño     ████████████████████░░░░  82%  (164/200)       │ │
│  │ Contenido  ██████████████████████░░  91%  (273/300)       │ │
│  │ Paid Media ████████████████████████  98%  (147/150)       │ │
│  │ SEO/IA     ████████████████░░░░░░░░  65%  (130/200)       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─── Clientes con Retraso ──────────────────────────────────┐ │
│  │ 🔴 FÜHL        Diseño 45%  (faltan 6 gráficas)           │ │
│  │ 🟡 Voxa        Contenido 70%  (faltan 3 posts)           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─── Carga del Equipo ──────────────────────────────────────┐ │
│  │ Arturo     ██████████████████████░  88%  ⚠️               │ │
│  │ Diseñador1 ████████████████░░░░░░░  67%                   │ │
│  │ Publicista ██████████████████████░  85%                   │ │
│  │ SEO Bot    ████████████████████████ 100% (automático)     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Vista Cliente (`/cliente/[slug]`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Volver   Genera Chile                    Plan: Gold · $1.35M│
│             Account: Arturo · Desde: Marzo 2026                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Junio 2026                    Cumplimiento global: 87%         │
│                                                                 │
│  ┌─── DISEÑO (82%) ─────────────────────────────────────────┐  │
│  │ Entregable          Plan    Hecho    %      Estado       │  │
│  │ Gráficas campaña      12      10    83%    ██████████░░  │  │
│  │ Gráficas orgánicas     4       4   100%    ████████████  │  │
│  │ Reels                  4       3    75%    █████████░░░  │  │
│  │ Videos                 2       1    50%    ██████░░░░░░  │  │
│  │ EXTRAS                 -       2     -     +2 extras     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─── CONTENIDO (91%) ──────────────────────────────────────┐  │
│  │ Posts orgánicos       16      15    94%    ███████████░  │  │
│  │ Copies campaña         4       4   100%    ████████████  │  │
│  │ Grilla mensual         1       1   100%    ████████████  │  │
│  │ Guiones video          2       1    50%    ██████░░░░░░  │  │
│  │ Reuniones              2       2   100%    ████████████  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─── PAID MEDIA (100%) ────────────────────────────────────┐  │
│  │ Campañas Google        2       2   100%    ████████████  │  │
│  │ Campañas Meta          2       2   100%    ████████████  │  │
│  │ Optimizaciones         4       5   125%    ████████████+ │  │
│  │ Informes               1       1   100%    ████████████  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─── SEO/IA (100%) ────────────────────────────────────────┐  │
│  │ Artículos blog IA     20      22   110%    ████████████+ │  │
│  │ Dashboard live         1       1   100%    ████████████  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [📄 Generar PDF Cliente]  [📊 Generar PDF Interno]            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Registro de Trabajo (`/registrar`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Registrar entregable                                           │
│                                                                 │
│  Cliente:    [Genera Chile        ▾]                            │
│  Área:       [Diseño              ▾]                            │
│  Tipo:       [Gráfica de campaña  ▾]                            │
│  Cantidad:   [1]                                                │
│  Estado:     [Entregado           ▾]                            │
│  Fecha:      [17/06/2026]                                       │
│  Extra:      [ ] Fuera de plan                                  │
│  Notas:      [Adaptación para campaña Q3_________]              │
│                                                                 │
│  [Guardar]  [Guardar y agregar otro]                            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Carga de Equipo (`/equipo`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Carga Operativa — Junio 2026                                   │
│                                                                 │
│  ┌─── Arturo Vargas (Paid Media) ────────────────────────────┐ │
│  │ Clientes: 12  │  Tareas: 34 pendientes, 89 hechas        │ │
│  │ Utilización: ████████████████████░░ 88% ⚠️                │ │
│  │ Genera, INACAP, CyM, Premios, Halterlift, DMP...         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─── Diseñador 1 ──────────────────────────────────────────┐ │
│  │ Clientes: 18  │  Tareas: 22 pendientes, 156 hechas       │ │
│  │ Utilización: ████████████████░░░░░░ 67%                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ⚠️ ALERTAS:                                                    │
│  🔴 Arturo > 80% — reasignar clientes o reducir scope         │
│  🟡 3 clientes con retraso en diseño                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Reportería Automática

### 5.1 PDF para Cliente (mensual)

Generado con Puppeteer (mismo que cotizaciones). Incluye:

1. **Portada:** Logo cliente + logo M&P + mes reportado
2. **Resumen ejecutivo:** Cumplimiento global, highlights
3. **Plan vs Ejecutado:** Tabla por área con barras de progreso
4. **Extras realizados:** Lo que se hizo fuera de plan
5. **Observaciones del ejecutivo:** Texto libre
6. **Próximos pasos:** Action items del mes siguiente

### 5.2 PDF Interno (mensual, para dirección)

1. **Revenue:** Fee × clientes activos, facturación real
2. **Cumplimiento:** % por área, por cliente
3. **Sobrecarga:** Clientes con más extras (candidatos a upgrade)
4. **Equipo:** Utilización por persona, bottlenecks
5. **Rentabilidad:** Fee vs horas consumidas (estimado)
6. **Alertas:** Clientes en riesgo (bajo cumplimiento, muchos extras sin pagar)

### 5.3 Resumen Semanal (email automático)

Cron GitHub Actions cada lunes 08:00:
- Tareas pendientes por persona
- Clientes con retraso
- Cumplimiento parcial del mes
- Envío vía Resend a contacto@mulleryperez.cl

---

## 6. Automatizaciones

| Trigger | Acción | Canal |
|---------|--------|-------|
| Tarea pendiente > 5 días | Notificación al responsable | Email |
| Cliente < 70% cumplimiento a día 20 del mes | Alerta al account manager | Email + dashboard |
| Persona > 80% capacidad | Badge ⚠️ en dashboard | Dashboard |
| Persona > 100% capacidad | Alerta a dirección | Email |
| Cliente con > 3 extras/mes | Sugerencia de upgrade de plan | Dashboard |
| Fin de mes | Generar PDF cliente + PDF interno | Cron |
| Lunes 08:00 | Resumen semanal | Email |

---

## 7. Navegación

```
/                    → Dashboard ejecutivo
/clientes            → Lista de clientes (filtrable por plan, status, área)
/cliente/[slug]      → Ficha individual del cliente
/registrar           → Formulario rápido de registro
/equipo              → Carga operativa del equipo
/planes              → Gestión de planes (CRUD)
/reportes            → Generación de PDFs (cliente + interno)
/config              → Usuarios, roles, permisos
```

---

## 8. Fases de Desarrollo

### Fase 1 — MVP (2-3 semanas)
- Auth + roles básicos
- CRUD clientes + planes
- Registro de entregables
- Vista cliente con plan vs ejecutado
- Dashboard ejecutivo básico

### Fase 2 — Reportería (1-2 semanas)
- PDF cliente con Puppeteer
- PDF interno
- Resumen semanal automático

### Fase 3 — Equipo + Alertas (1 semana)
- Vista carga operativa
- Alertas de capacidad
- Alertas de cumplimiento

### Fase 4 — Extras (ongoing)
- Integración con Supabase existente (clientes del CRM)
- Conexión con dashboards live existentes
- Métricas de rentabilidad
- App mobile (PWA)

---

## 9. Funcionalidades Adicionales Propuestas

1. **Timesheet ligero:** Cada persona registra horas por cliente al entregar. No es obligatorio pero permite calcular rentabilidad real.

2. **Template de kickoff:** Al agregar un cliente nuevo, auto-genera las tareas del primer mes según el plan contratado.

3. **Changelog por cliente:** Historial de cambios de plan, fee, account manager. "Genera subió de Gold a Platinum en julio 2026".

4. **Vista calendario:** Gantt simplificado de entregas por cliente y por persona.

5. **Benchmark interno:** "El promedio de cumplimiento en diseño es 82%. FÜHL está en 45%."

6. **Score de salud del cliente:** Combina cumplimiento + extras + reuniones + feedback. Verde/amarillo/rojo.

7. **Integración WhatsApp:** Botón para enviar el PDF del reporte al grupo de WhatsApp del cliente.

8. **API pública:** Endpoint para que los dashboards live de cada cliente muestren su cumplimiento.

---

## 10. Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js App Router + Tailwind CSS |
| Backend | Next.js API Routes + Supabase |
| Base de datos | Supabase PostgreSQL |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (logos, PDFs) |
| PDF | Puppeteer (Vercel Serverless o GitHub Actions) |
| Email | Resend (ya configurado) |
| Deploy | Vercel |
| Cron | GitHub Actions (resumen semanal, alertas) |
| Repo | GitHub myp202021/myp-ops |

---

*Documento funcional v1 — M&P Operations Platform*  
*Diseñado para Muller y Pérez · Junio 2026*  
*Listo para desarrollo*
