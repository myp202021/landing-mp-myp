# Agente Buses Hualpén — documentación (17 nov 2026)

Cliente: Buses Hualpén. Contacto: Felipe Muñoz (felipe.munoz@buseshualpen.cl). Responsable M&P: Christopher.
Repo: `myp202021/landing-mp-myp`. Datos en Supabase.

## Qué entrega (lunes a viernes, antes de las 07:00 Chile)

| Producto | Script | Workflow | Correo |
|---|---|---|---|
| Reporte de competencia (IG posts y stories, LinkedIn, Facebook de 14 competidores; marca ofertas laborales) + PDF adjunto | `scripts/scrape-competencia.js` | `competencia-hualpen.yml` | de contacto@ a felipe.munoz@ y christopher@ |
| Clipping de prensa (IG de 13 medios: La Tercera, BioBio, Emol, DF, CNN Chile, T13, Diario Concepción, Sabes.cl, Publimetro, El Dínamo, Meganoticias, ADN, Cooperativa; filtra transporte, últimas 24 h) | `scripts/clipping-prensa-hualpen.js` | `clipping-prensa-hualpen.yml` | de contacto@ a felipe.munoz@ y contacto@ |

Competidores: Viggo, Tándem Industrial, Yanguas, Buses JM, CVU, Nortrans, Géminis, Verschae, Transportes Calderón, Pullman Yuris, Sokol, Pullman San Luis, Transdiaram, Espacio T (lista en `COMPETIDORES`, línea 30 del script).

Anti-duplicado: antes de correr se revisa en Supabase si ya hay reporte del día (`reportes_competencia.fecha_reporte`; clipping en `clipping_prensa`). Se pueden lanzar varias veces sin mandar dos correos.

Secretos: APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND, GH_PAT.

## Capas para que siempre llegue

El cron de GitHub llega con horas de atraso o no llega, así que el horario lo manejan capas externas:

1. **06:09 Chile, cron-job.org** dispara `competencia-hualpen.yml`. Su paso watchdog dispara también el clipping (min_h = 9 UTC).
2. **06:40 Chile, Vercel Cron** `/api/cron/hualpen-guard` (`app/api/cron/hualpen-guard/route.ts`): si falta alguno, lo dispara y avisa a christopher@ ("⚠️ Hualpén: capa principal falló").
3. **07:17 Chile, crontab del Mac**: `~/.claude/scripts/descargar-reporte-hualpen.sh` baja el PDF al escritorio (log en `~/.claude/scripts/hualpen-download.log`).
4. **Vigilante** (`myp-daily-agent/scripts/vigilante.py`, cada 15 min): relanza `competencia-hualpen.yml` si a las 09:45 UTC no corrió.

El clipping además tiene 6 cron de GitHub de respaldo (07:00–08:30 Chile), que hoy llegan tarde (corridas de las 17–18 h), sin efecto por el anti-duplicado.

Workflows antiguos, inactivos (solo cron dummy 1 de enero): `hualpen-competencia-diario.yml`, `watchdog-hualpen.yml`, `test-competencia-hualpen.yml`, `primer-reporte-hualpen.yml`.

## Estado al 17 nov 2026
- Competencia: corrió y llegó todos los días hábiles del 11 al 17 nov (06:09 Chile).
- Clipping: corrió el 17 nov 06:13 Chile.
- GA4 de buseshualpen.cl (G-QFVPRZE5R4): acceso en contacto@ por propiedad; 19 sesiones desde IA en 7 días (+72,7 %). Pendiente pasar el acceso a christopher@.

## Si no llegó
```bash
gh run list -R myp202021/landing-mp-myp -w competencia-hualpen.yml -L 5
gh run list -R myp202021/landing-mp-myp -w clipping-prensa-hualpen.yml -L 5
gh workflow run competencia-hualpen.yml -R myp202021/landing-mp-myp
gh workflow run clipping-prensa-hualpen.yml -R myp202021/landing-mp-myp
```
Errores típicos: token Apify sin saldo, GH_PAT vencido en Vercel (pasó el 13 nov, 401), GitHub pausa workflows con muchos cron (máximo 2 por workflow en los nuevos).
