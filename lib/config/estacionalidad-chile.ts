// Estacionalidad Chile — fechas generales + por rubro
// Usado por el generador de grillas para contextualizar contenido

export const FECHAS_GENERALES: Record<number, { fechas: string[]; contexto: string }> = {
  1: { fechas: ['1 Año Nuevo'], contexto: 'Vuelta al trabajo, planificación anual, propósitos, metas Q1' },
  2: { fechas: ['14 San Valentín'], contexto: 'Clima laboral, bienestar, parejas, regalos' },
  3: { fechas: ['8 Día Internacional de la Mujer', 'Vuelta a clases'], contexto: 'Equidad, liderazgo femenino, educación, inicio de actividades' },
  4: { fechas: ['Semana Santa', 'Ley 40 horas implementación'], contexto: 'Feriados, reflexión, adaptación normativa laboral' },
  5: { fechas: ['1 Día del Trabajador', 'Día de la Madre', 'CyberDay (usualmente)'], contexto: 'Derechos laborales, ausentismo, comercio electrónico, regalos' },
  6: { fechas: ['Día del Padre'], contexto: 'Mid-year review, evaluación de desempeño, mitad de año' },
  7: { fechas: ['16 Virgen del Carmen'], contexto: 'Ajustes presupuestarios, vacaciones de invierno, temporada baja' },
  8: { fechas: ['15 Asunción'], contexto: 'Preparación Fiestas Patrias, segundo semestre, temporada alta comercial se acerca' },
  9: { fechas: ['18-19 Fiestas Patrias'], contexto: 'Chilenidad, ausentismo post-feriado, celebración, consumo alto' },
  10: { fechas: ['31 Halloween', 'CyberMonday (a veces)'], contexto: 'Q4, cierre de año se acerca, planificación 2027, eventos' },
  11: { fechas: ['1 Todos los Santos', 'Cyber Monday', 'Black Friday'], contexto: 'Comercio electrónico peak, descuentos, cierre fiscal, bonos' },
  12: { fechas: ['8 Inmaculada Concepción', '25 Navidad', '31 Año Nuevo'], contexto: 'Aguinaldos, vacaciones colectivas, finiquitos, regalos, cierre de año' },
}

export const ESTACIONALIDAD_RUBRO: Record<string, Record<number, string>> = {
  'ecommerce': {
    1: 'Liquidación verano, rebajas post-navidad',
    3: 'Vuelta a clases, útiles, productos para el hogar',
    5: 'CyberDay — preparar stock, ofertas, landing especiales',
    6: 'Día del Padre — regalos, tech, experiencias',
    9: 'Fiestas Patrias — asados, decoración, productos chilenos',
    10: 'Pre-Cyber, Halloween, disfraces',
    11: 'CyberMonday + BlackFriday — peak del año, despacho rápido',
    12: 'Navidad — regalos, envíos express, gift cards',
  },
  'hr_tech': {
    1: 'Planificación RRHH anual, presupuestos, metas',
    3: '8M equidad, políticas de género, liderazgo',
    4: 'Ley 40 horas, adaptación jornada, turnos',
    5: 'Día Trabajador, beneficios, clima laboral',
    9: 'Ausentismo Fiestas Patrias, gestión licencias',
    11: 'Cierre fiscal, finiquitos, gratificaciones',
    12: 'Vacaciones colectivas, aguinaldos, cierre de año',
  },
  'construccion': {
    3: 'Inicio temporada remodelación otoño',
    4: 'Lluvias — impermeabilización, protección exterior',
    5: 'Mantenimiento pre-invierno',
    8: 'Primavera — temporada alta remodelación comienza',
    9: 'Proyectos de terraza para verano',
    10: 'Construcción activa, proyectos exterior',
    11: 'Cierre de proyectos anuales',
    12: 'Proyectos verano, terrazas, deck',
  },
  'agua_purificacion': {
    1: 'Calor peak — hidratación, consumo máximo',
    2: 'Vuelta a oficina — dispensadores corporativos',
    3: 'Temporada HORECA activa (restaurantes, hoteles)',
    6: 'Ahorro energético invierno — agua caliente instantánea',
    9: 'Eventos Fiestas Patrias — dispensadores para eventos',
    11: 'Presupuesto 2027 — contratos anuales corporativos',
    12: 'Regalos corporativos, cierres de contrato',
  },
  'legal_financiero': {
    3: 'Declaración de renta se acerca, planificación tributaria',
    4: 'Declaración renta, devoluciones, consultas peak',
    5: 'Post-declaración, regularización, multas',
    9: 'Reformas tributarias segundo semestre',
    11: 'Planificación fiscal fin de año',
    12: 'Cierre contable, finiquitos, contratos',
  },
  'salud_bienestar': {
    1: 'Propósitos de salud, detox, inicio de rutinas',
    3: 'Prevención gripe, chequeos preventivos',
    5: 'Salud mental, burnout, Día del Trabajador',
    6: 'Enfermedades invernales, prevención',
    10: 'Salud mental, Octubre rosa (cáncer de mama)',
    12: 'Cierre de beneficios salud, FONASA/Isapre',
  },
  'educacion': {
    1: 'Matrículas, inscripciones, becas',
    3: 'Inicio año académico, adaptación',
    7: 'Vacaciones invierno, reforzamiento, talleres',
    11: 'Admisión, PSU/PAES, postulaciones',
    12: 'Resultados, cierre semestre, planificación siguiente',
  },
  'inmobiliario': {
    1: 'Búsqueda activa post-vacaciones',
    3: 'Temporada alta arriendo (vuelta a clases/trabajo)',
    5: 'Subsidios habitacionales, postulaciones SERVIU',
    8: 'Primavera — visitas a proyectos, open house',
    10: 'Entrega proyectos Q4, cierre de ventas',
    12: 'Últimas oportunidades del año, promesas de compra',
  },
  'tecnologia': {
    1: 'CES, tendencias tech del año',
    3: 'Transformación digital Q1, presupuestos tech',
    5: 'CyberDay — hardware, software, SaaS',
    8: 'Vuelta de vacaciones invierno, adopción tech',
    11: 'BlackFriday tech, renovación equipos, CyberMonday',
    12: 'Cierre presupuesto TI, compras de fin de año',
  },
  'general': {},
}

// Mapea rubro del cliente a key de estacionalidad
export function getRubroKey(rubro: string): string {
  const r = rubro.toLowerCase()
  if (r.includes('ecommerce') || r.includes('e-commerce') || r.includes('tienda') || r.includes('retail')) return 'ecommerce'
  if (r.includes('hr') || r.includes('rrhh') || r.includes('recursos humanos') || r.includes('software de rrhh')) return 'hr_tech'
  if (r.includes('construc') || r.includes('revestimiento') || r.includes('inmaterial') || r.includes('deck') || r.includes('wpc')) return 'construccion'
  if (r.includes('agua') || r.includes('purifica') || r.includes('water') || r.includes('dispens')) return 'agua_purificacion'
  if (r.includes('legal') || r.includes('abogad') || r.includes('financier') || r.includes('contab') || r.includes('pie')) return 'legal_financiero'
  if (r.includes('salud') || r.includes('clinic') || r.includes('bienestar') || r.includes('medic')) return 'salud_bienestar'
  if (r.includes('educa') || r.includes('universidad') || r.includes('colegio') || r.includes('capacit')) return 'educacion'
  if (r.includes('inmobil') || r.includes('propiedad') || r.includes('arriendos')) return 'inmobiliario'
  if (r.includes('tech') || r.includes('software') || r.includes('saas') || r.includes('tecnolog')) return 'tecnologia'
  return 'general'
}

export function getEstacionalidadMes(rubro: string, mes: number): string {
  const key = getRubroKey(rubro)
  const general = FECHAS_GENERALES[mes]
  const especifica = ESTACIONALIDAD_RUBRO[key]?.[mes]

  let resultado = `Fechas clave: ${general.fechas.join(', ')}. ${general.contexto}`
  if (especifica) {
    resultado += `\nContexto específico del rubro: ${especifica}`
  }
  return resultado
}
