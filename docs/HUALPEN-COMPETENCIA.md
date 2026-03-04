# Monitor de Competencia Digital — Buses Hualpén

## Qué es

Sistema automático de monitoreo de redes sociales de los competidores directos de Buses Hualpén. Scrappea Instagram y LinkedIn diariamente, guarda en Supabase, y envía un reporte por email todos los días hábiles a las 9:00 AM.

---

## Arquitectura

```
GitHub Actions (cron L-V 08:50 AM)
        ↓
scripts/scrape-competencia.js
        ↓ (Apify API)
Instagram Scraper + LinkedIn Scraper
        ↓
Supabase → tabla reportes_competencia
        ↓ (Resend API)
Email HTML → felipe.munoz@buseshualpen.cl + contacto@mulleryperez.cl
        ↓
CRM Admin /crm → sección "Competencia Hualpén"
API → /api/crm/competencia
```

---

## Archivos del sistema

| Archivo | Descripción |
|---------|-------------|
| `scripts/scrape-competencia.js` | Script principal: scraping + guardado en Supabase + envío de email |
| `scripts/primer-reporte-hualpen.js` | Script ONE-TIME: primer reporte con último post histórico por competidor |
| `.github/workflows/competencia-hualpen.yml` | Workflow diario automático (L-V 09:00 AM) |
| `.github/workflows/primer-reporte-hualpen.yml` | Workflow manual (dispatch) para el primer reporte |
| `app/api/crm/competencia/route.ts` | API route que consulta Supabase |
| `app/crm/page.tsx` | Panel CRM admin — incluye sección Competencia Hualpén |

---

## Competidores monitoreados

| Nombre | Instagram | LinkedIn |
|--------|-----------|----------|
| Viggo | @viggo_chile | /company/viggo-chile/ |
| Tándem Industrial | @tandem.industrial | /company/tandem-industrial/ |
| Yanguas | @yanguas.cl | /company/buses-yanguas/ |
| Buses JM | @busesjm.cl | — |
| CVU | @transportescvu_ssee | /company/transportes-cvu/ |
| Nortrans | @nortransspa | /company/nortrans-ltda/ |
| Géminis | @busesgeminis | /company/geminis/ |
| Verschae | @flota_verschae | — |
| Transportes Calderón | @transportescalderon | — |
| Pullman Yuris | @busesyuris | — |
| Sokol | Solo LinkedIn | /company/sokol-s-a/ |
| Pullman San Luis | — | — |

---

## Supabase — tabla `reportes_competencia`

```sql
CREATE TABLE reportes_competencia (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha_reporte date NOT NULL,
  competidor    text NOT NULL,
  instagram     text,
  linkedin      text,
  post_url      text,
  imagen_url    text,
  caption       text,
  likes         integer DEFAULT 0,
  comentarios   integer DEFAULT 0,
  tipo_post     text,   -- 'instagram' | 'linkedin'
  sin_actividad boolean DEFAULT false,
  timestamp_post timestamptz,
  created_at    timestamptz DEFAULT now()
);
```

---

## Secrets de GitHub Actions requeridos

| Secret | Descripción |
|--------|-------------|
| `APIFY_TOKEN` | Token de Apify (plan Starter mínimo) |
| `RESEND` | API Key de Resend (dominio mulleryperez.cl verificado) |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key de Supabase (no la anon key) |

---

## Apify — actores usados

| Actor | Uso |
|-------|-----|
| `apify~instagram-scraper` | Scraping de posts de Instagram |
| `bebity~linkedin-company-posts-scraper` | Scraping de posts de LinkedIn |

**Plan mínimo:** Starter ($29/mes) — suficiente para el scraping diario de 10 cuentas.

---

## Cómo funciona el reporte diario

1. El cron corre a las **11:50 UTC** (09:00 AM Chile hora de verano)
2. Scrappea los **últimos 6 posts** de cada cuenta de Instagram
3. Filtra solo los publicados en las **últimas 24 horas**
4. Scrappea LinkedIn para los **7 competidores confirmados**
5. Guarda en Supabase con `fecha_reporte = hoy`
6. Genera un email HTML con:
   - Posts con imagen, caption, likes y comentarios
   - Sección de LinkedIn
   - Chips "Sin actividad" para los que no publicaron
7. Envía desde `contacto@mulleryperez.cl` a:
   - `felipe.munoz@buseshualpen.cl`
   - `contacto@mulleryperez.cl`

---

## Primer reporte (one-time)

Para enviar el primer reporte con el **último post histórico** de cada competidor (sin filtro de 24h):

1. Ir a [GitHub Actions → Primer Reporte](https://github.com/myp202021/landing-mp-myp/actions/workflows/primer-reporte-hualpen.yml)
2. Clic en **Run workflow**
3. Escribir `enviar` en el campo de confirmación
4. El email llega en ~3-4 minutos

> Este workflow es de uso único. El reporte diario automático NO usa este script.

---

## CRM Admin — acceso

- URL: `https://www.mulleryperez.cl/crm`
- Contraseña: `myp2025` *(pendiente mover a variable de entorno)*
- Sección: botón **"Competencia Hualpén"** en el panel principal
- Permite ver reportes por fecha con selector de calendario

---

## API

```
GET /api/crm/competencia?fecha=YYYY-MM-DD
```

Devuelve todos los registros de `reportes_competencia` para la fecha indicada, ordenados por `sin_actividad ASC, likes DESC`.

```json
{
  "reportes": [...],
  "fecha": "2026-03-04"
}
```

---

## Contacto cliente

- **Cliente:** Buses Hualpén
- **Contacto:** Felipe Muñoz — felipe.munoz@buseshualpen.cl
- **Inicio monitoreo:** Marzo 2026
