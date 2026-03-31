// Mock data para prototipo Grillas de Contenido
// Fase 1: solo UI, sin backend

export type GrillaEstado = 'sin_grilla' | 'borrador' | 'en_revision' | 'aprobado' | 'enviado'

export interface GrillaPost {
  id: string
  dia: number
  dia_semana: string
  plataforma: 'LinkedIn' | 'Facebook/Instagram'
  tipo_post: 'Post' | 'Carrusel' | 'Video' | 'Reel'
  copy: string
  copy_grafica?: string // Texto visual: headline para imagen, slides para carrusel, guión para reel
  hashtags: string
  nota_interna: string
}

export interface GrillaSemana {
  rango: string
  dias: GrillaPost[]
}

export interface Grilla {
  mes: string
  mes_num: number
  anio: number
  estado: GrillaEstado
  actualizado_en: string
  semanas: GrillaSemana[]
}

export interface ClienteGrilla {
  id: string
  nombre: string
  rubro: string
  grilla_estado: GrillaEstado
  actualizado_en: string
}

// --- Helpers ---

export function getEstadoLabel(estado: GrillaEstado): string {
  const labels: Record<GrillaEstado, string> = {
    sin_grilla: 'Sin Grilla',
    borrador: 'Borrador',
    en_revision: 'En Revisión',
    aprobado: 'Aprobado',
    enviado: 'Enviado',
  }
  return labels[estado]
}

export function getEstadoColors(estado: GrillaEstado): string {
  const colors: Record<GrillaEstado, string> = {
    sin_grilla: 'bg-gray-100 text-gray-600 border-gray-300',
    borrador: 'bg-gray-100 text-gray-700 border-gray-300',
    en_revision: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    aprobado: 'bg-green-100 text-green-700 border-green-300',
    enviado: 'bg-blue-100 text-blue-700 border-blue-300',
  }
  return colors[estado]
}

export function getPlatformStyle(plataforma: string): { bg: string; text: string; label: string } {
  if (plataforma === 'LinkedIn') {
    return { bg: 'bg-blue-600', text: 'text-white', label: 'LinkedIn' }
  }
  return { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white', label: 'IG / FB' }
}

// --- Mock clientes ---

export const MOCK_CLIENTES: ClienteGrilla[] = [
  { id: 'genera-001', nombre: 'Genera', rubro: 'HR Tech / Software RRHH', grilla_estado: 'aprobado', actualizado_en: '2026-03-20' },
  { id: 'copefrut-002', nombre: 'Copefrut', rubro: 'Agroindustria', grilla_estado: 'en_revision', actualizado_en: '2026-03-18' },
  { id: 'hl-003', nombre: 'HL Soluciones', rubro: 'Ingeniería Eléctrica', grilla_estado: 'borrador', actualizado_en: '2026-03-15' },
  { id: 'swing-004', nombre: 'Swing Producciones', rubro: 'Eventos', grilla_estado: 'sin_grilla', actualizado_en: '' },
  { id: 'mint-005', nombre: 'MINT', rubro: 'Tecnología', grilla_estado: 'enviado', actualizado_en: '2026-03-22' },
]

// --- Mock grilla Genera Marzo 2026 ---

export const MOCK_GRILLA_GENERA: Grilla = {
  mes: 'Marzo',
  mes_num: 3,
  anio: 2026,
  estado: 'aprobado',
  actualizado_en: '2026-03-20',
  semanas: [
    {
      rango: '2 – 6 marzo',
      dias: [
        {
          id: 'p01',
          dia: 2,
          dia_semana: 'Lunes',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'Cada lunes, más de 380.000 personas en Chile fichan su entrada con Genera. No lo hacen porque sea obligatorio — lo hacen porque el proceso dejó de ser una fricción.\n\nCuando la asistencia se gestiona con papel, Excel o sistemas que nadie entiende, lo primero que se pierde no es el dato: es la confianza del equipo. Porque un error en el registro de horas es un error en la liquidación. Y un error en la liquidación es un problema que escala.\n\nGenera convirtió el control de asistencia en un proceso invisible. Marca desde el celular, geolocalización opcional, integración directa con remuneraciones. Sin intermediarios. Sin reprocesos.\n\nEl resultado: empresas que dejaron de perder 12 horas semanales en cuadraturas manuales.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #AsistenciaLaboral #RRHH #GestiónDePersonas',
          nota_interna: 'Imagen: screenshot módulo asistencia con marca desde celular. Template azul corporativo.',
        },
        {
          id: 'p02',
          dia: 3,
          dia_semana: 'Martes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Carrusel',
          copy: '5 señales de que tu control de asistencia te está costando más de lo que crees:\n\n1. Tu equipo de RRHH dedica más de 3 horas semanales a cuadrar datos.\n2. Los trabajadores reclaman diferencias en sus liquidaciones.\n3. No puedes generar un reporte de asistencia en menos de 10 minutos.\n4. Usas más de 2 sistemas distintos para gestionar personas.\n5. Cada cierre de mes es una carrera contra el tiempo.\n\nSi marcaste 3 o más, es momento de conversar.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #ControlAsistencia #RRHH #Digitalización',
          nota_interna: 'Carrusel 5 slides: cada señal en una slide con ícono. Slide final: CTA + logo Genera. Paleta: azul oscuro + blanco.',
        },
        {
          id: 'p03',
          dia: 4,
          dia_semana: 'Miércoles',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'En 2025, la Dirección del Trabajo cursó más de $2.400 millones en multas por infracciones laborales en Chile. El 34% fueron por errores en el registro de jornada.\n\nNo es un problema de intención. Es un problema de herramientas.\n\nCuando el registro de jornada depende de un libro físico o un Excel compartido, los errores son inevitables. Un turno mal registrado. Una hora extra que no se computó. Una licencia que nadie actualizó.\n\nGenera tiene acreditación de la Dirección del Trabajo para registro electrónico de asistencia. Eso significa que cada marca queda respaldada legalmente, sin ambigüedades, sin reprocesos.\n\n+40 años ayudando a empresas a operar sin fricciones.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #NormativaLaboral #DirecciónDelTrabajo #RRHH',
          nota_interna: 'Dato DT verificable. Usar diseño con número grande ($2.400M) destacado. Template corporativo serio.',
        },
        {
          id: 'p04',
          dia: 5,
          dia_semana: 'Jueves',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Post',
          copy: 'Tu equipo de RRHH no debería ser un centro de costos.\n\nCuando automatizas asistencia, remuneraciones y firma de documentos en una sola plataforma, liberas al equipo para lo que realmente importa: retener talento, mejorar clima y construir cultura.\n\nMás de 380.000 personas ya se gestionan con Genera.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #TransformaciónDigital #GestiónDePersonas #Chile',
          nota_interna: 'Visual: equipo de RRHH trabajando vs. equipo atrapado en papeles. Split design.',
        },
      ],
    },
    {
      rango: '9 – 13 marzo',
      dias: [
        {
          id: 'p05',
          dia: 9,
          dia_semana: 'Lunes',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'Ayer fue 8 de marzo. Hoy, la pregunta que importa: ¿cuántas mujeres en tu empresa tienen acceso real a posiciones de liderazgo?\n\nNo hablamos de cuotas. Hablamos de procesos. Cuando la gestión de personas es opaca — cuando los ascensos dependen de quién conoce a quién y no de métricas verificables — el sesgo se institucionaliza sin que nadie lo note.\n\nGenera permite a las empresas tomar decisiones de personas basadas en datos: desempeño, asistencia, cumplimiento, historial. No en percepciones.\n\nPorque la equidad empieza cuando dejas de gestionar con supuestos.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #EquidadLaboral #LiderazgoFemenino #8M #RRHH',
          nota_interna: 'Post día después del 8M. Tono: propositivo, no panfletario. Conectar con datos y gestión, no con eslogan.',
        },
        {
          id: 'p06',
          dia: 10,
          dia_semana: 'Martes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Reel',
          copy: '¿Cuánto tiempo pierde tu equipo de RRHH cada mes en tareas que podrían ser automáticas?\n\nFirmar contratos a mano. Cuadrar asistencia en Excel. Perseguir aprobaciones por email.\n\nCon Genera, todo eso desaparece. En una sola plataforma.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #AutomatizaciónRRHH #FirmaDigital #Chile',
          nota_interna: 'Reel 30s: mostrar proceso manual (papeles, Excel) vs. proceso Genera (clicks). Música corporativa. Subtítulos obligatorios.',
        },
        {
          id: 'p07',
          dia: 11,
          dia_semana: 'Miércoles',
          plataforma: 'LinkedIn',
          tipo_post: 'Carrusel',
          copy: 'La Ley de 40 Horas ya está en fase de implementación. Para 2026, miles de empresas deberán ajustar turnos, jornadas y registros.\n\nEl problema no es la ley. El problema es gestionarla con herramientas que no fueron diseñadas para esto.\n\nGenera tiene un módulo de turnos con IA que permite:\n→ Crear mallas de turno en minutos\n→ Asignar automáticamente según disponibilidad y normativa\n→ Detectar conflictos antes de que ocurran\n→ Generar reportes DT-ready en un click\n\nLa reducción de jornada no tiene por qué ser un dolor de cabeza operativo.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #Ley40Horas #TurnosIA #GestiónLaboral #Chile',
          nota_interna: 'Carrusel 6 slides: contexto ley → problema → 4 beneficios Turnos IA → CTA. Incluir iconografía módulo turnos.',
        },
        {
          id: 'p08',
          dia: 13,
          dia_semana: 'Viernes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Post',
          copy: 'Cada documento que firmas en papel es un riesgo que asumes gratis.\n\nPérdida, deterioro, firma falsificada, plazo vencido. Genera resuelve todo eso con firma electrónica avanzada integrada al flujo de RRHH.\n\nContratos, anexos, finiquitos — firmados en minutos desde cualquier dispositivo.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #FirmaElectrónica #DocumentosLaborales #RRHH',
          nota_interna: 'Visual: documento en papel arrugado vs. documento digital con check verde. Contraste visual fuerte.',
        },
      ],
    },
    {
      rango: '16 – 20 marzo',
      dias: [
        {
          id: 'p09',
          dia: 16,
          dia_semana: 'Lunes',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'Una empresa con 500 trabajadores genera, en promedio, más de 6.000 documentos laborales al año. Contratos, anexos, certificados, liquidaciones, finiquitos.\n\nSi cada documento toma 15 minutos entre imprimir, firmar, escanear y archivar, estás dedicando 1.500 horas anuales a un proceso que no agrega valor.\n\nGenera digitaliza todo el ciclo documental. Desde la emisión hasta la firma electrónica y el archivo automático. Sin papel. Sin demoras.\n\n1.500 horas de vuelta para tu equipo.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #GestiónDocumental #RRHH #Digitalización #Chile',
          nota_interna: 'Número grande: 6.000 documentos / 1.500 horas. Infografía con cálculo visual. Template datos duros.',
        },
        {
          id: 'p10',
          dia: 17,
          dia_semana: 'Martes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Carrusel',
          copy: '3 módulos de Genera que tu equipo de RRHH va a agradecer:\n\n1. GENHORAS — Controla horas extras automáticamente. Sin planillas. Sin errores.\n2. Firma Digital — Contratos firmados en minutos. Desde cualquier lugar.\n3. Turnos IA — Mallas de turno inteligentes que respetan la normativa.\n\nTodo en una sola plataforma. Todo integrado con remuneraciones.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #GENHORAS #TurnosIA #FirmaDigital #RRHH',
          nota_interna: 'Carrusel 4 slides: intro + 3 módulos con ícono y beneficio clave. Slide final CTA. Usar colores del producto.',
        },
        {
          id: 'p11',
          dia: 18,
          dia_semana: 'Miércoles',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'El costo de una liquidación de sueldo con error no es solo el reproceso. Es la confianza que pierdes.\n\nUn trabajador que recibe una liquidación incorrecta no piensa "fue un error del sistema". Piensa "no les importo lo suficiente como para hacerlo bien".\n\nGenera integra asistencia, horas extras, turnos y firma en un solo flujo que alimenta remuneraciones automáticamente. Sin digitación manual. Sin desfases entre sistemas.\n\nEl resultado: liquidaciones correctas, a tiempo, todos los meses. Y un equipo que confía en su empleador.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #Remuneraciones #ConfianzaLaboral #RRHH #Chile',
          nota_interna: 'Ángulo emocional: confianza del trabajador. Tono empático pero firme. Sin imagen de personas tristes — usar flujo integrado.',
        },
        {
          id: 'p12',
          dia: 20,
          dia_semana: 'Viernes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Post',
          copy: '¿Sabías que Genera tiene acreditación oficial de la Dirección del Trabajo?\n\nEso significa que cada registro de asistencia tiene respaldo legal. Sin libros de firma. Sin auditorías estresantes.\n\n+40 años digitalizando la gestión de personas en Chile.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #AcreditaciónDT #AsistenciaLaboral #Chile',
          nota_interna: 'Dato certificación DT como proof point. Visual: sello/badge de acreditación. Formato simple, directo.',
        },
      ],
    },
    {
      rango: '23 – 27 marzo',
      dias: [
        {
          id: 'p13',
          dia: 23,
          dia_semana: 'Lunes',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'El 73% de los gerentes de RRHH en Chile dice que la carga administrativa les impide enfocarse en estrategia. No es falta de voluntad. Es falta de infraestructura.\n\nCuando tu equipo dedica la mitad de su semana a cuadrar datos, perseguir firmas y corregir errores de nómina, no queda espacio para lo que realmente mueve la aguja: desarrollo de talento, retención, cultura.\n\nGenera automatiza lo operativo para que RRHH pueda ser lo que siempre debió ser: un área estratégica.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #EstrategiaRRHH #GestiónDePersonas #Chile',
          nota_interna: 'Stat 73% es referencia general (no inventada pero no citada — revisar si publicar). Template dato duro + reflexión.',
        },
        {
          id: 'p14',
          dia: 24,
          dia_semana: 'Martes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Reel',
          copy: 'Antes: 3 sistemas para gestionar personas.\nAhora: Genera.\n\nAsistencia + Remuneraciones + Firma Digital + Turnos IA.\nTodo en uno. Todo integrado.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #PlataformaRRHH #TodoEnUno #Chile',
          nota_interna: 'Reel 20s: transición rápida antes/después. Pantalla dividida. Música dinámica. Subtítulos grandes.',
        },
        {
          id: 'p15',
          dia: 26,
          dia_semana: 'Jueves',
          plataforma: 'LinkedIn',
          tipo_post: 'Post',
          copy: 'Cierre de mes. El momento que todo equipo de RRHH teme.\n\nPero no tiene que ser así. Cuando asistencia, horas extras y turnos alimentan automáticamente la nómina, el cierre de mes pasa de ser una maratón de 5 días a un proceso de horas.\n\nEmpresas que usan Genera reportan un 65% menos de tiempo en cierre mensual. No porque trabajen más rápido — sino porque eliminaron los reprocesos.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #CierreDeMes #Nómina #RRHH #Automatización',
          nota_interna: 'Timing perfecto: post publicado justo antes de fin de mes. Conectar con dolor real del cierre. Número 65% destacado.',
        },
        {
          id: 'p16',
          dia: 27,
          dia_semana: 'Viernes',
          plataforma: 'Facebook/Instagram',
          tipo_post: 'Post',
          copy: 'Más de 380.000 personas se gestionan con Genera en Chile.\n\nNo porque sea la opción más barata. Sino porque es la que funciona.\n\n+40 años de experiencia. Acreditación DT. Plataforma todo en uno.\n\ngenera.cl — Hablemos de Productividad.',
          hashtags: '#Genera #Productividad #GestiónDePersonas #SoftwareRRHH #Chile',
          nota_interna: 'Cierre de mes — post de authority. Visual: número 380.000 en grande con fondo corporativo. Simple y contundente.',
        },
      ],
    },
  ],
}

// Mapa de grillas por cliente (solo Genera tiene datos completos)
export const MOCK_GRILLAS: Record<string, Grilla> = {
  'genera-001': MOCK_GRILLA_GENERA,
}

// Meses en español
export const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
