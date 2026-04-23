# Copilot — Status 23 abril 2026 (cierre del día)

## Lo que se hizo hoy

### Agentes (Prioridad 1)
- ✅ `radar-guiones.js` — genera 2 scripts reels/stories via OpenAI (business)
- ✅ `radar-auditoria.js` — score mensual 8 criterios, $0 costo (todos los planes)
- ✅ Ideas auto-acumulación en `radar-contenido.js`
- ✅ `radar-validar-cuentas.js` — valida handles IG/LI/FB, notifica al cliente

### Pipeline (Prioridad 2)
- ✅ Guiones + auditoría + ideas integrados en radar-clipping.js
- ✅ Crons comentados (solo manual dispatch durante testing)
- ✅ ExcelJS formateado para copies, guiones y grilla (headers purple, colores)
- ✅ enviarEmailV2 con attachments dinámicos por modo/plan
- ✅ Case-insensitive red comparison (Instagram vs instagram)

### Email (Prioridad 3)
- ✅ generarEmailHTML reescrito dark theme (#0F0D2E, table-based, Gmail-safe)
- ✅ Compacto: top 5 posts, previews con "ver en Excel adjunto"
- ✅ Lifecycle emails: Radar→Copilot en 5 templates

### Dashboard (Prioridad 4)
- ✅ Dark theme completo
- ✅ 6 tabs: Competencia, Contenido, Auditoría, Guiones, Ideas, Reporte
- ✅ Tablas corregidas: clipping_suscripciones, radar_posts, radar_contenido
- ✅ Excel export con ExcelJS formateado
- ✅ /copilot/dashboard → redirect a /copilot

### Landing (Prioridad 5)
- ✅ Hero tabs con contenido distinto por tab
- ✅ Sección "Así se ven tus informes" (3 cards dark)
- ✅ Social proof Genera HR
- ✅ 6 mockups PNG del producto

### Config page
- ✅ Dark theme
- ✅ Tabla corregida
- ✅ Placeholders dinámicos por red
- ✅ Guía de formato handles

## Testing diario
- IG: 4 posts (Buk 3, Talana 1) ✅
- LinkedIn: 0 posts (actor harvestapi devuelve 0 raw items) ❌
- Email dark theme: llega a Gmail ✅
- PDF: 29KB ✅

## Pendiente mañana (en orden)
1. Diagnosticar LinkedIn (ver cron Genera 7AM)
2. Buscar actor alternativo si el actual no funciona
3. Completar test diario con LI
4. Correr semanal (copies + guiones + ideas + Excel adjuntos)
5. Correr mensual (grilla + auditoría + reporte PDF + todo)
6. Correcciones
7. Flow.cl
