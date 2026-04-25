// radar-industria.js
// Datos de industria del predictor M&P — alimenta a todos los agentes
// Lee de lib/config/industries.ts, industry-insights.ts, cpc-calibrado-chile.ts,
// benchmarks-2024-verificados.ts, estacionalidad-chile.ts
// Genera contexto textual para inyectar en prompts de IA

// ═══════════════════════════════════════════════
// DATOS DE INDUSTRIA INLINE (compilados de los archivos TS)
// Actualizados a abril 2026 desde el predictor M&P
// ═══════════════════════════════════════════════

var INDUSTRIAS = {
  'tecnologia': {
    nombre: 'Tecnología / SaaS',
    cpc_google: 587, cpc_meta: 420,
    cvr: 2.35, roas_avg: 5.2, cpl_avg: 8500,
    mejor_plataforma: 'GOOGLE',
    ciclo_venta: '15-45 dias',
    estacionalidad: 'Sin picos fuertes, leve baja en verano (ene-feb)',
    kpis: ['MRR', 'CAC', 'LTV', 'Churn', 'Trial-to-Paid'],
    tips: ['LinkedIn Ads para decision makers B2B', 'Content marketing + retargeting', 'Demos gratuitas como CTA principal'],
    engagement_benchmark: { ig_avg: 45, li_avg: 25 },
  },
  'rrhh': {
    nombre: 'Recursos Humanos / HR Tech',
    cpc_google: 520, cpc_meta: 380,
    cvr: 1.8, roas_avg: 4.5, cpl_avg: 12000,
    mejor_plataforma: 'LINKEDIN',
    ciclo_venta: '30-90 dias',
    estacionalidad: 'Q1 alto (presupuestos nuevos), Q4 bajo (cierre fiscal)',
    kpis: ['Demo requests', 'Free trial signups', 'CAC', 'Employee retention rate'],
    tips: ['Casos de exito con numeros de retencion', 'Thought leadership en LinkedIn', 'Webinars de productividad'],
    engagement_benchmark: { ig_avg: 35, li_avg: 40 },
  },
  'ecommerce': {
    nombre: 'E-commerce / Retail',
    cpc_google: 248, cpc_meta: 198,
    cvr: 2.8, roas_avg: 4.2, cpl_avg: 4500,
    mejor_plataforma: 'GOOGLE',
    ciclo_venta: '1-7 dias',
    estacionalidad: 'Nov-Dic peak (Black Friday, CyberMonday, Navidad). Ene-Feb bajo.',
    kpis: ['ROAS', 'CAC', 'Ticket promedio', 'Tasa abandono carrito'],
    tips: ['Google Shopping obligatorio', 'Remarketing dinamico recupera 15-25% carritos', 'Meta Catalog Ads para descubrimiento'],
    engagement_benchmark: { ig_avg: 80, li_avg: 10 },
  },
  'inmobiliaria': {
    nombre: 'Inmobiliaria / Real Estate',
    cpc_google: 890, cpc_meta: 520,
    cvr: 1.2, roas_avg: 8.5, cpl_avg: 18000,
    mejor_plataforma: 'META',
    ciclo_venta: '30-180 dias',
    estacionalidad: 'Mar-Jun alto, Jul-Ago bajo, Sep-Nov repunta',
    kpis: ['CPL', 'Visitas agendadas', 'Tasa cierre', 'Ticket promedio'],
    tips: ['Video tours generan 3x mas leads', 'Segmentar por ingreso y comuna', 'Retargeting 90 dias por ciclo largo'],
    engagement_benchmark: { ig_avg: 60, li_avg: 15 },
  },
  'salud': {
    nombre: 'Salud / Healthcare',
    cpc_google: 650, cpc_meta: 350,
    cvr: 3.2, roas_avg: 6.0, cpl_avg: 7000,
    mejor_plataforma: 'GOOGLE',
    ciclo_venta: '1-14 dias',
    estacionalidad: 'Invierno peak (gripes), Ene post-vacaciones, Mar vuelta clases',
    kpis: ['Citas agendadas', 'CPL', 'No-show rate', 'Retencion pacientes'],
    tips: ['Google Local Services Ads', 'Reviews de Google son criticos', 'Contenido educativo genera confianza'],
    engagement_benchmark: { ig_avg: 50, li_avg: 20 },
  },
  'educacion': {
    nombre: 'Educacion',
    cpc_google: 420, cpc_meta: 280,
    cvr: 2.5, roas_avg: 3.8, cpl_avg: 6000,
    mejor_plataforma: 'META',
    ciclo_venta: '7-30 dias',
    estacionalidad: 'Ene-Mar peak matriculas, Jul-Ago 2do semestre, Nov-Dic planificacion',
    kpis: ['Matriculas', 'CPL', 'Tasa conversion landing', 'Asistencia a charlas'],
    tips: ['Testimonios de alumnos exitosos', 'Open days virtuales', 'Urgencia con cupos limitados'],
    engagement_benchmark: { ig_avg: 55, li_avg: 30 },
  },
  'servicios_profesionales': {
    nombre: 'Servicios Profesionales / Consultoria',
    cpc_google: 680, cpc_meta: 450,
    cvr: 1.5, roas_avg: 5.5, cpl_avg: 15000,
    mejor_plataforma: 'LINKEDIN',
    ciclo_venta: '30-90 dias',
    estacionalidad: 'Q1 y Q3 altos (inicio de proyectos), Q4 bajo (presupuestos cerrados)',
    kpis: ['Reuniones agendadas', 'Propuestas enviadas', 'Win rate', 'Ticket promedio'],
    tips: ['LinkedIn InMail para C-level', 'Casos de estudio con ROI medible', 'Newsletter semanal con insights'],
    engagement_benchmark: { ig_avg: 30, li_avg: 45 },
  },
  'automotriz': {
    nombre: 'Automotriz',
    cpc_google: 750, cpc_meta: 400,
    cvr: 1.8, roas_avg: 7.0, cpl_avg: 12000,
    mejor_plataforma: 'GOOGLE',
    ciclo_venta: '14-60 dias',
    estacionalidad: 'Mar-May alto, Jul-Ago bajo, Oct-Dic cierre de ano',
    kpis: ['Test drives', 'CPL', 'Cotizaciones', 'Ventas cerradas'],
    tips: ['Video walkaround de vehiculos', 'Google Ads en keywords de modelo especifico', 'Retargeting con ofertas de financiamiento'],
    engagement_benchmark: { ig_avg: 70, li_avg: 15 },
  },
  'alimentos': {
    nombre: 'Alimentos / Food & Delivery',
    cpc_google: 180, cpc_meta: 120,
    cvr: 4.5, roas_avg: 3.5, cpl_avg: 2500,
    mejor_plataforma: 'META',
    ciclo_venta: '1-3 dias',
    estacionalidad: 'Todo el ano con picos en festivos, Fiestas Patrias, fin de semana',
    kpis: ['Pedidos', 'AOV', 'Frecuencia', 'Retencion'],
    tips: ['Fotos de alta calidad del producto', 'UGC (contenido de clientes)', 'Promociones geo-segmentadas'],
    engagement_benchmark: { ig_avg: 120, li_avg: 5 },
  },
  'finanzas': {
    nombre: 'Finanzas / Fintech',
    cpc_google: 920, cpc_meta: 580,
    cvr: 1.5, roas_avg: 6.0, cpl_avg: 20000,
    mejor_plataforma: 'GOOGLE',
    ciclo_venta: '7-30 dias',
    estacionalidad: 'Ene (metas financieras), Abr (declaraciones), Sep-Oct (planificacion)',
    kpis: ['Cuentas abiertas', 'AUM', 'CAC', 'LTV'],
    tips: ['Confianza es todo: testimonios + certificaciones', 'Calculadoras interactivas', 'Content marketing largo plazo'],
    engagement_benchmark: { ig_avg: 35, li_avg: 50 },
  },
  'transporte': {
    nombre: 'Transporte / Logistica',
    cpc_google: 450, cpc_meta: 280,
    cvr: 2.0, roas_avg: 4.0, cpl_avg: 10000,
    mejor_plataforma: 'GOOGLE',
    ciclo_venta: '7-30 dias',
    estacionalidad: 'Fiestas Patrias, Navidad, CyberDay (logistica peak)',
    kpis: ['Cotizaciones', 'Contratos', 'NPS', 'Costo por km'],
    tips: ['Mostrar flota y tecnologia', 'Casos de eficiencia operacional', 'Certificaciones de seguridad'],
    engagement_benchmark: { ig_avg: 25, li_avg: 30 },
  },
  'general': {
    nombre: 'General / Otros',
    cpc_google: 400, cpc_meta: 300,
    cvr: 2.0, roas_avg: 4.0, cpl_avg: 8000,
    mejor_plataforma: 'MIXTO',
    ciclo_venta: '7-30 dias',
    estacionalidad: 'Variable segun industria',
    kpis: ['Leads', 'CPL', 'Conversion rate', 'ROI'],
    tips: ['Testear Google vs Meta', 'Retargeting siempre', 'Landing pages optimizadas'],
    engagement_benchmark: { ig_avg: 50, li_avg: 20 },
  },
}

// ═══════════════════════════════════════════════
// DETECTAR INDUSTRIA DEL CLIENTE
// ═══════════════════════════════════════════════
function detectarIndustria(perfil) {
  if (!perfil) return INDUSTRIAS.general
  var rubro = ((perfil.rubro || '') + ' ' + (perfil.descripcion || '') + ' ' + (perfil.productos || '')).toLowerCase()

  if (rubro.includes('rrhh') || rubro.includes('recursos humanos') || rubro.includes('asistencia') || rubro.includes('talento') || rubro.includes('hr')) return INDUSTRIAS.rrhh
  if (rubro.includes('saas') || rubro.includes('software') || rubro.includes('tecnolog') || rubro.includes('plataforma') || rubro.includes('app')) return INDUSTRIAS.tecnologia
  if (rubro.includes('ecommerce') || rubro.includes('tienda') || rubro.includes('retail') || rubro.includes('venta online')) return INDUSTRIAS.ecommerce
  if (rubro.includes('inmobil') || rubro.includes('propiedad') || rubro.includes('corredor') || rubro.includes('arriendo') || rubro.includes('departamento')) return INDUSTRIAS.inmobiliaria
  if (rubro.includes('salud') || rubro.includes('medic') || rubro.includes('clinic') || rubro.includes('dental') || rubro.includes('hospital')) return INDUSTRIAS.salud
  if (rubro.includes('educa') || rubro.includes('universidad') || rubro.includes('colegio') || rubro.includes('capacit') || rubro.includes('curso')) return INDUSTRIAS.educacion
  if (rubro.includes('consult') || rubro.includes('asesori') || rubro.includes('profesional') || rubro.includes('legal') || rubro.includes('abogad')) return INDUSTRIAS.servicios_profesionales
  if (rubro.includes('auto') || rubro.includes('vehicul') || rubro.includes('moto') || rubro.includes('taller')) return INDUSTRIAS.automotriz
  if (rubro.includes('aliment') || rubro.includes('restaur') || rubro.includes('comida') || rubro.includes('delivery') || rubro.includes('cafe')) return INDUSTRIAS.alimentos
  if (rubro.includes('financ') || rubro.includes('banco') || rubro.includes('inversion') || rubro.includes('fintech') || rubro.includes('credito')) return INDUSTRIAS.finanzas
  if (rubro.includes('transporte') || rubro.includes('logistic') || rubro.includes('bus') || rubro.includes('flota') || rubro.includes('carga')) return INDUSTRIAS.transporte

  return INDUSTRIAS.general
}

// ═══════════════════════════════════════════════
// GENERAR CONTEXTO DE INDUSTRIA PARA PROMPTS
// ═══════════════════════════════════════════════
function generarContextoIndustria(perfil) {
  var ind = detectarIndustria(perfil)
  var ctx = '\n═══ DATOS DE INDUSTRIA (Predictor M&P — datos reales Chile) ═══\n'
  ctx += 'Industria detectada: ' + ind.nombre + '\n'
  ctx += '- CPC promedio Google: $' + ind.cpc_google + ' CLP | Meta: $' + ind.cpc_meta + ' CLP\n'
  ctx += '- Conversion rate promedio: ' + ind.cvr + '%\n'
  ctx += '- ROAS promedio industria: ' + ind.roas_avg + 'x\n'
  ctx += '- CPL promedio: $' + ind.cpl_avg.toLocaleString() + ' CLP\n'
  ctx += '- Mejor plataforma: ' + ind.mejor_plataforma + '\n'
  ctx += '- Ciclo de venta típico: ' + ind.ciclo_venta + '\n'
  ctx += '- Estacionalidad: ' + ind.estacionalidad + '\n'
  ctx += '- KPIs clave de la industria: ' + ind.kpis.join(', ') + '\n'
  ctx += '- Engagement benchmark IG: ~' + ind.engagement_benchmark.ig_avg + ' promedio | LI: ~' + ind.engagement_benchmark.li_avg + '\n'
  ctx += '- Tips industria:\n'
  ind.tips.forEach(function(t) { ctx += '  * ' + t + '\n' })
  ctx += '\nUSA ESTOS DATOS en el contenido: menciona benchmarks reales, compara con promedios de la industria, haz referencias a KPIs específicos del rubro.\n'
  ctx += 'NUNCA inventes porcentajes — usa los datos de arriba como base.\n'
  return ctx
}

module.exports = {
  INDUSTRIAS: INDUSTRIAS,
  detectarIndustria: detectarIndustria,
  generarContextoIndustria: generarContextoIndustria,
}
