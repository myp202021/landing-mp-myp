/**
 * Buyer Gen - Base de datos de Personas y Recomendaciones
 * Datos específicos para el mercado chileno 2025
 */

export interface BasePersona {
  nombre: string
  edad?: string
  ocupacion?: string
  ingresos?: string
  sector?: string
  tamano?: string
  decisores?: string
  motivaciones: string
  puntosDolor: string
}

// Recomendaciones específicas por industria - Chile 2025
export const industryRecommendations: {
  [industry: string]: {
    keywords: string[]
    kpis: string[]
    contentStrategy: string[]
    channels: {
      b2b: string[]
      b2c: string[]
    }
    benchmarks: {
      cpl: string
      ctr: string
      conversion: string
    }
  }
} = {
  tecnologia: {
    keywords: ['software Chile', 'transformacion digital', 'soluciones cloud', 'desarrollo web Santiago', 'automatizacion', 'ciberseguridad empresas'],
    kpis: ['CAC (Costo Adquisicion Cliente)', 'MRR (Monthly Recurring Revenue)', 'Churn Rate', 'NPS', 'Time to Value'],
    contentStrategy: ['Casos de exito de empresas chilenas', 'Webinars sobre tendencias tech', 'Comparativas de soluciones', 'Contenido thought leadership en LinkedIn'],
    channels: {
      b2b: ['LinkedIn Ads', 'Google Search', 'Email nurturing', 'Webinars'],
      b2c: ['Google Search', 'YouTube', 'Meta Ads', 'TikTok']
    },
    benchmarks: { cpl: '$15.000 - $45.000 CLP', ctr: '2.5% - 4%', conversion: '3% - 8%' }
  },
  salud: {
    keywords: ['clinica Santiago', 'medico especialista', 'tratamiento', 'consulta medica online', 'salud preventiva', 'telemedicina Chile'],
    kpis: ['Costo por Paciente Agendado', 'Tasa de Show Rate', 'NPS Pacientes', 'Ticket Promedio', 'Retencion Pacientes'],
    contentStrategy: ['Testimonios de pacientes', 'Contenido educativo sobre salud', 'Videos de procedimientos', 'Tips de bienestar en RRSS'],
    channels: {
      b2b: ['Google Search', 'LinkedIn', 'Email Marketing', 'Directorios medicos'],
      b2c: ['Google Search', 'Meta Ads', 'YouTube', 'Instagram organico']
    },
    benchmarks: { cpl: '$8.000 - $25.000 CLP', ctr: '3% - 6%', conversion: '5% - 12%' }
  },
  educacion: {
    keywords: ['curso online Chile', 'capacitacion empresas', 'diplomado', 'magister Santiago', 'educacion ejecutiva', 'e-learning'],
    kpis: ['Costo por Matricula', 'Tasa de Conversion Lead-Matricula', 'Tasa de Desercion', 'NPS Alumnos', 'ROI por Programa'],
    contentStrategy: ['Webinars gratuitos', 'Casos de exito de egresados', 'Contenido de valor en blog', 'Lives en Instagram/LinkedIn'],
    channels: {
      b2b: ['LinkedIn Ads', 'Google Search', 'Email Marketing', 'Eventos corporativos'],
      b2c: ['Meta Ads', 'Google Search', 'TikTok', 'YouTube']
    },
    benchmarks: { cpl: '$5.000 - $20.000 CLP', ctr: '2% - 4%', conversion: '2% - 6%' }
  },
  finanzas: {
    keywords: ['credito Chile', 'inversion', 'fintech', 'cuenta corriente', 'seguro', 'ahorro', 'prestamo online'],
    kpis: ['CAC', 'LTV', 'Tasa de Aprobacion', 'Costo por Lead Calificado', 'NPS', 'Tasa de Mora'],
    contentStrategy: ['Calculadoras financieras', 'Contenido educativo sobre finanzas', 'Comparativas de productos', 'Testimonios de clientes'],
    channels: {
      b2b: ['LinkedIn Ads', 'Google Search', 'Email Marketing', 'Eventos fintech'],
      b2c: ['Google Search', 'Meta Ads', 'Display programatico', 'YouTube']
    },
    benchmarks: { cpl: '$10.000 - $35.000 CLP', ctr: '1.5% - 3%', conversion: '2% - 5%' }
  },
  retail: {
    keywords: ['tienda online Chile', 'comprar', 'ofertas', 'envio gratis', 'despacho mismo dia', 'cuotas sin interes'],
    kpis: ['ROAS', 'CPA', 'Ticket Promedio', 'Tasa de Conversion', 'Tasa de Abandono Carrito', 'CLV'],
    contentStrategy: ['UGC (User Generated Content)', 'Influencer marketing', 'Ofertas flash en stories', 'Email marketing automatizado'],
    channels: {
      b2b: ['Google Shopping', 'LinkedIn', 'Marketplaces B2B'],
      b2c: ['Meta Ads', 'Google Shopping', 'TikTok Ads', 'Influencers']
    },
    benchmarks: { cpl: '$2.000 - $8.000 CLP', ctr: '1% - 2.5%', conversion: '1.5% - 4%' }
  },
  servicios: {
    keywords: ['servicios profesionales Chile', 'consultoria', 'asesoria', 'outsourcing', 'externalizacion'],
    kpis: ['CPL', 'Tasa de Conversion Lead-Cliente', 'Ticket Promedio', 'NPS', 'Tasa de Retencion'],
    contentStrategy: ['Casos de exito', 'Articulos de expertise', 'Webinars especializados', 'LinkedIn thought leadership'],
    channels: {
      b2b: ['LinkedIn Ads', 'Google Search', 'Email Marketing', 'Networking'],
      b2c: ['Google Search', 'Meta Ads', 'Google Local', 'Directorios']
    },
    benchmarks: { cpl: '$12.000 - $40.000 CLP', ctr: '2% - 4%', conversion: '3% - 8%' }
  },
  inmobiliaria: {
    keywords: ['departamento Santiago', 'casa en venta', 'arriendo', 'inmobiliaria Chile', 'proyecto inmobiliario', 'inversion inmobiliaria'],
    kpis: ['Costo por Lead Calificado', 'Tasa de Visitas', 'Tiempo de Cierre', 'ROI por Proyecto', 'NPS Compradores'],
    contentStrategy: ['Tours virtuales 360', 'Videos de proyectos', 'Testimonios de propietarios', 'Contenido sobre plusvalia'],
    channels: {
      b2b: ['LinkedIn', 'Portales inmobiliarios', 'Email a inversionistas'],
      b2c: ['Meta Ads', 'Google Search', 'Portales inmobiliarios', 'YouTube']
    },
    benchmarks: { cpl: '$20.000 - $80.000 CLP', ctr: '1.5% - 3%', conversion: '1% - 3%' }
  },
  automotriz: {
    keywords: ['auto nuevo Chile', 'test drive', 'financiamiento vehicular', 'concesionario', 'SUV', 'auto usado certificado'],
    kpis: ['Costo por Test Drive', 'Tasa de Cierre', 'Ticket Promedio', 'Margen por Unidad', 'Satisfaccion Cliente'],
    contentStrategy: ['Videos de vehiculos', 'Comparativas de modelos', 'Testimonios de clientes', 'Ofertas y financiamiento'],
    channels: {
      b2b: ['LinkedIn', 'Email Marketing', 'Eventos corporativos'],
      b2c: ['Google Search', 'Meta Ads', 'YouTube', 'Display']
    },
    benchmarks: { cpl: '$15.000 - $50.000 CLP', ctr: '2% - 4%', conversion: '2% - 5%' }
  },
  gastronomia: {
    keywords: ['restaurante Santiago', 'delivery comida', 'reserva restaurante', 'comida a domicilio', 'cocina chilena'],
    kpis: ['Costo por Reserva', 'Ticket Promedio', 'Frecuencia de Visita', 'NPS', 'Tasa de Retencion'],
    contentStrategy: ['Fotos de platos en Instagram', 'Stories del dia a dia', 'Reels de preparacion', 'Influencer marketing'],
    channels: {
      b2b: ['Google My Business', 'LinkedIn para eventos', 'Email corporativo'],
      b2c: ['Meta Ads', 'Google Local', 'TikTok', 'Apps de delivery']
    },
    benchmarks: { cpl: '$1.500 - $5.000 CLP', ctr: '2% - 5%', conversion: '3% - 8%' }
  },
  turismo: {
    keywords: ['viaje Chile', 'paquete turistico', 'hotel Santiago', 'tour Patagonia', 'vuelos baratos', 'vacaciones'],
    kpis: ['Costo por Reserva', 'RevPAR', 'Ocupacion', 'Ticket Promedio', 'NPS', 'Tasa de Repeticion'],
    contentStrategy: ['Contenido aspiracional en RRSS', 'Videos de destinos', 'UGC de viajeros', 'Ofertas de temporada'],
    channels: {
      b2b: ['LinkedIn', 'Email a agencias', 'Ferias de turismo'],
      b2c: ['Meta Ads', 'Google Search', 'YouTube', 'TikTok', 'Influencers']
    },
    benchmarks: { cpl: '$3.000 - $15.000 CLP', ctr: '2% - 4%', conversion: '1.5% - 4%' }
  },
  construccion: {
    keywords: ['constructora Chile', 'remodelacion', 'proyecto construccion', 'materiales construccion', 'arquitecto Santiago'],
    kpis: ['Costo por Cotizacion', 'Tasa de Cierre', 'Margen por Proyecto', 'Tiempo de Ejecucion', 'NPS'],
    contentStrategy: ['Portafolio de proyectos', 'Antes/despues', 'Videos de obras', 'Testimonios de clientes'],
    channels: {
      b2b: ['LinkedIn', 'Google Search', 'Email Marketing', 'Licitaciones'],
      b2c: ['Google Search', 'Meta Ads', 'Instagram', 'Google Local']
    },
    benchmarks: { cpl: '$25.000 - $100.000 CLP', ctr: '1.5% - 3%', conversion: '2% - 5%' }
  },
  legal: {
    keywords: ['abogado Santiago', 'estudio juridico', 'asesoria legal', 'demanda', 'contrato', 'derecho laboral'],
    kpis: ['Costo por Consulta', 'Tasa de Conversion', 'Ticket Promedio', 'Casos Ganados', 'NPS'],
    contentStrategy: ['Articulos legales educativos', 'Videos explicativos', 'Casos de exito', 'LinkedIn thought leadership'],
    channels: {
      b2b: ['LinkedIn', 'Google Search', 'Email Marketing', 'Referidos'],
      b2c: ['Google Search', 'Google Local', 'Meta Ads', 'Directorios legales']
    },
    benchmarks: { cpl: '$15.000 - $60.000 CLP', ctr: '2% - 4%', conversion: '3% - 8%' }
  }
}

export const personasDatabase: {
  [businessModel: string]: {
    [industry: string]: BasePersona[]
  }
} = {
  b2c: {
    tecnologia: [
      { nombre: "Ana Tecnologica", edad: "25-34 anos", ocupacion: "Profesional digital", ingresos: "Medio-alto", motivaciones: "Busca estar a la vanguardia con las ultimas tendencias y mejoras tecnologicas.", puntosDolor: "Desea productos que le faciliten la vida diaria y le permitan optimizar su tiempo." },
      { nombre: "Carlos Gamer", edad: "18-25 anos", ocupacion: "Estudiante universitario / Gamer", ingresos: "Medio", motivaciones: "Busca el mejor rendimiento para sus experiencias de juego y estudio.", puntosDolor: "Necesita equilibrar presupuesto con calidad y rendimiento." },
      { nombre: "Sofia Ejecutiva", edad: "35-45 anos", ocupacion: "Ejecutiva senior", ingresos: "Alto", motivaciones: "Valora la integracion perfecta entre dispositivos y eficiencia.", puntosDolor: "Requiere soluciones que le permitan gestionar su trabajo y vida personal de manera fluida." }
    ],
    salud: [
      { nombre: "Roberto Bienestar", edad: "40-55 anos", ocupacion: "Profesional con estilo de vida activo", ingresos: "Medio-alto", motivaciones: "Busca mantener y mejorar su salud con soluciones preventivas.", puntosDolor: "Tiempo limitado para cuidar de su bienestar integral." },
      { nombre: "Luisa Consciente", edad: "30-45 anos", ocupacion: "Mama/profesional", ingresos: "Medio", motivaciones: "Prioriza la salud familiar y busca opciones naturales y efectivas.", puntosDolor: "Necesita soluciones que se adapten a las diferentes necesidades familiares." },
      { nombre: "Eduardo Senior", edad: "65+ anos", ocupacion: "Jubilado activo", ingresos: "Medio", motivaciones: "Busca mantener su independencia y calidad de vida.", puntosDolor: "Requiere soluciones accesibles y faciles de usar que mejoren su salud." }
    ],
    educacion: [
      { nombre: "Maria Estudiante", edad: "18-25 anos", ocupacion: "Estudiante universitaria", ingresos: "Bajo", motivaciones: "Busca recursos educativos accesibles y de calidad.", puntosDolor: "Presupuesto limitado pero necesita herramientas competitivas." },
      { nombre: "Pedro Profesional", edad: "30-45 anos", ocupacion: "Profesional en desarrollo", ingresos: "Medio-alto", motivaciones: "Busca especializacion y actualizacion constante.", puntosDolor: "Tiempo limitado para estudiar y necesita flexibilidad." },
      { nombre: "Carmen Reconversion", edad: "35-50 anos", ocupacion: "Profesional en cambio de carrera", ingresos: "Medio", motivaciones: "Busca nuevas oportunidades laborales a traves de capacitacion.", puntosDolor: "Necesita programas practicos con salida laboral rapida." }
    ],
    finanzas: [
      { nombre: "Daniel Independiente", edad: "28-40 anos", ocupacion: "Emprendedor/Freelancer", ingresos: "Variable", motivaciones: "Busca estabilidad financiera y crecimiento de su negocio.", puntosDolor: "Gestion de flujo de caja irregular y planificacion." },
      { nombre: "Julia Inversora", edad: "30-45 anos", ocupacion: "Profesional asalariada", ingresos: "Medio-alto", motivaciones: "Busca hacer crecer su patrimonio y diversificar inversiones.", puntosDolor: "Necesita orientacion clara sobre opciones de inversion." },
      { nombre: "Andres Primer Credito", edad: "25-35 anos", ocupacion: "Joven profesional", ingresos: "Medio", motivaciones: "Busca acceso a credito para consolidar sus metas.", puntosDolor: "Sin historial crediticio, necesita opciones accesibles." }
    ],
    retail: [
      { nombre: "Paula Moda", edad: "20-35 anos", ocupacion: "Profesional urbana", ingresos: "Medio", motivaciones: "Sigue tendencias y busca expresar su personalidad.", puntosDolor: "Equilibrio entre calidad, estilo y precio." },
      { nombre: "Gabriel Tecnologico", edad: "25-40 anos", ocupacion: "Profesional tecnologico", ingresos: "Medio-alto", motivaciones: "Busca productos que mejoren su estilo de vida.", puntosDolor: "Valora innovacion, diseno y funcionalidad." },
      { nombre: "Francisca Madre", edad: "30-45 anos", ocupacion: "Mama profesional", ingresos: "Medio-alto", motivaciones: "Busca productos de calidad para su familia.", puntosDolor: "Tiempo limitado, necesita compras eficientes." }
    ],
    servicios: [
      { nombre: "Andres Emprendedor", edad: "30-45 anos", ocupacion: "Emprendedor/pequeno empresario", ingresos: "Variable", motivaciones: "Busca servicios que impulsen su negocio.", puntosDolor: "Requiere soluciones efectivas a costos accesibles." },
      { nombre: "Natalia Ejecutiva", edad: "35-50 anos", ocupacion: "Profesional senior", ingresos: "Alto", motivaciones: "Valora servicios premium que optimicen su tiempo.", puntosDolor: "Busca excelencia, personalizacion y atencion exclusiva." },
      { nombre: "Ricardo Dueno Casa", edad: "35-55 anos", ocupacion: "Propietario de vivienda", ingresos: "Medio-alto", motivaciones: "Busca mantener y mejorar su hogar.", puntosDolor: "Necesita proveedores confiables y con garantia." }
    ],
    inmobiliaria: [
      { nombre: "Pareja Joven", edad: "28-38 anos", ocupacion: "Profesionales jovenes", ingresos: "Medio-alto", motivaciones: "Buscan su primer departamento o casa.", puntosDolor: "Necesitan orientacion sobre financiamiento y ubicacion." },
      { nombre: "Inversionista Particular", edad: "40-55 anos", ocupacion: "Profesional consolidado", ingresos: "Alto", motivaciones: "Busca invertir en propiedades para renta.", puntosDolor: "Necesita proyectos con buena rentabilidad y plusvalia." },
      { nombre: "Familia en Crecimiento", edad: "35-45 anos", ocupacion: "Familia con hijos", ingresos: "Medio-alto", motivaciones: "Busca mas espacio y mejor ubicacion para sus hijos.", puntosDolor: "Balance entre precio, tamano y cercania a colegios." }
    ],
    automotriz: [
      { nombre: "Primer Auto", edad: "25-35 anos", ocupacion: "Profesional joven", ingresos: "Medio", motivaciones: "Busca independencia y movilidad.", puntosDolor: "Presupuesto limitado, necesita financiamiento accesible." },
      { nombre: "Familia SUV", edad: "35-50 anos", ocupacion: "Familia con hijos", ingresos: "Medio-alto", motivaciones: "Busca seguridad y espacio para la familia.", puntosDolor: "Balance entre precio, seguridad y practicidad." },
      { nombre: "Ejecutivo Premium", edad: "40-55 anos", ocupacion: "Ejecutivo senior", ingresos: "Alto", motivaciones: "Busca status y tecnologia de punta.", puntosDolor: "Servicio post-venta y experiencia de compra diferenciada." }
    ],
    gastronomia: [
      { nombre: "Foodie Millennial", edad: "25-35 anos", ocupacion: "Profesional urbano", ingresos: "Medio", motivaciones: "Busca experiencias gastronomicas unicas.", puntosDolor: "Descubrir nuevos lugares, reservas faciles." },
      { nombre: "Familia Delivery", edad: "30-45 anos", ocupacion: "Familia ocupada", ingresos: "Medio-alto", motivaciones: "Busca opciones rapidas y de calidad.", puntosDolor: "Tiempo limitado, necesita variedad y rapidez." },
      { nombre: "Celebrador Social", edad: "30-50 anos", ocupacion: "Profesional social", ingresos: "Medio-alto", motivaciones: "Busca lugares para reuniones y celebraciones.", puntosDolor: "Ambiente, servicio y opciones de grupo." }
    ],
    turismo: [
      { nombre: "Viajero Aventurero", edad: "25-40 anos", ocupacion: "Profesional con vacaciones", ingresos: "Medio-alto", motivaciones: "Busca experiencias unicas y aventura.", puntosDolor: "Planificacion, tiempo limitado de vacaciones." },
      { nombre: "Familia Vacaciones", edad: "35-50 anos", ocupacion: "Familia con hijos", ingresos: "Medio-alto", motivaciones: "Busca destinos familiares seguros.", puntosDolor: "Actividades para ninos, logistica familiar." },
      { nombre: "Pareja Romantica", edad: "28-45 anos", ocupacion: "Parejas", ingresos: "Medio-alto", motivaciones: "Busca escapadas romanticas y relax.", puntosDolor: "Encontrar el destino perfecto, ofertas de parejas." }
    ],
    construccion: [
      { nombre: "Propietario Remodelacion", edad: "35-55 anos", ocupacion: "Dueno de casa", ingresos: "Medio-alto", motivaciones: "Mejorar su vivienda actual.", puntosDolor: "Encontrar profesionales confiables, costos claros." },
      { nombre: "Constructor Proyecto", edad: "30-50 anos", ocupacion: "Inversionista particular", ingresos: "Alto", motivaciones: "Construir para vender o arrendar.", puntosDolor: "Gestion de proyecto, plazos y costos." },
      { nombre: "Primera Vivienda", edad: "28-40 anos", ocupacion: "Pareja joven", ingresos: "Medio", motivaciones: "Construir su casa propia.", puntosDolor: "Presupuesto ajustado, necesita orientacion." }
    ],
    legal: [
      { nombre: "Divorciado", edad: "35-55 anos", ocupacion: "Profesional en proceso de divorcio", ingresos: "Variable", motivaciones: "Resolver su situacion legal de forma justa.", puntosDolor: "Estres emocional, costos legales, tiempos." },
      { nombre: "Trabajador Despedido", edad: "30-55 anos", ocupacion: "Trabajador con conflicto laboral", ingresos: "Medio", motivaciones: "Defender sus derechos laborales.", puntosDolor: "Desconocimiento legal, urgencia economica." },
      { nombre: "Emprendedor Legal", edad: "28-45 anos", ocupacion: "Emprendedor", ingresos: "Variable", motivaciones: "Formalizar su negocio correctamente.", puntosDolor: "Burocracia, costos de constitucion." }
    ]
  },
  b2b: {
    tecnologia: [
      { nombre: "Empresa Digitalizadora", sector: "Tecnologia/Servicios", tamano: "Mediana empresa (50-200 empleados)", decisores: "CTO, Director de Innovacion", motivaciones: "Busca soluciones tecnologicas innovadoras para ofrecer a sus clientes.", puntosDolor: "Necesita proveedores confiables con soporte tecnico y actualizaciones." },
      { nombre: "Startup Innovadora", sector: "Tecnologia/Digital", tamano: "Pequena (5-50 empleados)", decisores: "Fundadores, CTO", motivaciones: "Busca tecnologias que le permitan escalar rapidamente.", puntosDolor: "Balance entre costo, escalabilidad y flexibilidad." },
      { nombre: "Corporativo Enterprise", sector: "Gran empresa", tamano: "Grande (500+ empleados)", decisores: "CIO, Comite TI", motivaciones: "Modernizacion de sistemas legacy.", puntosDolor: "Integracion con sistemas existentes, seguridad, compliance." }
    ],
    salud: [
      { nombre: "Centro Medico Privado", sector: "Salud", tamano: "Mediano (20-100 empleados)", decisores: "Director Medico, Gerente de Operaciones", motivaciones: "Busca mejorar la calidad de atencion y eficiencia operativa.", puntosDolor: "Cumplimiento normativo y optimizacion de recursos." },
      { nombre: "Clinica Especializada", sector: "Salud", tamano: "Pequena-Mediana (10-50 empleados)", decisores: "Propietarios, Medicos Jefe", motivaciones: "Busca diferenciacion y excelencia en su especialidad.", puntosDolor: "Necesita soluciones especificas para su nicho." },
      { nombre: "Laboratorio Clinico", sector: "Salud", tamano: "Mediano (30-100 empleados)", decisores: "Director Tecnico, Gerente General", motivaciones: "Eficiencia en procesos y resultados.", puntosDolor: "Volumen de examenes, tiempos de entrega." }
    ],
    educacion: [
      { nombre: "Institucion Educativa Privada", sector: "Educacion", tamano: "Mediana (50-200 empleados)", decisores: "Director, Coordinador Academico", motivaciones: "Busca diferenciacion educativa y modernizacion.", puntosDolor: "Balance entre tradicion e innovacion educativa." },
      { nombre: "Centro de Capacitacion", sector: "Educacion Tecnica", tamano: "Pequeno-Mediano (20-100 empleados)", decisores: "Director, Coordinadores de Area", motivaciones: "Busca herramientas practicas y actualizadas para la formacion.", puntosDolor: "Actualizacion constante y conexion con necesidades del mercado." },
      { nombre: "Universidad/Instituto", sector: "Educacion Superior", tamano: "Grande (200+ empleados)", decisores: "Rectoria, Direccion de Marketing", motivaciones: "Atraer y retener estudiantes de calidad.", puntosDolor: "Competencia, posicionamiento, desercion." }
    ],
    finanzas: [
      { nombre: "Fintech Emergente", sector: "Tecnologia Financiera", tamano: "Pequena-Mediana (10-100 empleados)", decisores: "Fundadores, CTO", motivaciones: "Busca soluciones agiles y disruptivas.", puntosDolor: "Escalabilidad, seguridad y cumplimiento regulatorio." },
      { nombre: "Consultora Financiera", sector: "Servicios Financieros", tamano: "Pequena-Mediana (5-50 empleados)", decisores: "Socios, Director General", motivaciones: "Busca herramientas para ofrecer mejores servicios a sus clientes.", puntosDolor: "Analisis de datos eficiente e informacion actualizada." },
      { nombre: "Corredora de Seguros", sector: "Seguros", tamano: "Mediana (20-80 empleados)", decisores: "Gerente General, Director Comercial", motivaciones: "Aumentar cartera de clientes y eficiencia.", puntosDolor: "Competencia de canales digitales, comisiones." }
    ],
    retail: [
      { nombre: "Tienda Multimarca", sector: "Comercio Minorista", tamano: "Pequena-Mediana (5-50 empleados)", decisores: "Propietario, Gerente de Compras", motivaciones: "Busca productos diferenciados con buenos margenes.", puntosDolor: "Rotacion de inventario y exclusividad." },
      { nombre: "E-commerce", sector: "Comercio Electronico", tamano: "Variable (5-200 empleados)", decisores: "CEO, Director de Operaciones", motivaciones: "Busca catalogo amplio y logistica eficiente.", puntosDolor: "Gestion de inventario y tiempos de entrega." },
      { nombre: "Cadena Retail", sector: "Retail", tamano: "Grande (200+ empleados)", decisores: "Gerencia Comercial, Marketing", motivaciones: "Aumentar trafico y conversion en tiendas.", puntosDolor: "Omnicanalidad, competencia online." }
    ],
    servicios: [
      { nombre: "Consultora", sector: "Servicios Profesionales", tamano: "Pequena-Mediana (10-100 empleados)", decisores: "Socios, Director de Operaciones", motivaciones: "Busca soluciones para mejorar sus servicios al cliente.", puntosDolor: "Eficiencia operativa y diferenciacion." },
      { nombre: "Agencia Creativa", sector: "Marketing/Comunicacion", tamano: "Pequena (5-50 empleados)", decisores: "Director Creativo, Director de Cuentas", motivaciones: "Busca herramientas innovadoras para sus clientes.", puntosDolor: "Optimizacion de recursos y cumplimiento de plazos." },
      { nombre: "Empresa de RRHH", sector: "Recursos Humanos", tamano: "Mediana (30-100 empleados)", decisores: "Gerente General, Director Comercial", motivaciones: "Ampliar cartera de clientes corporativos.", puntosDolor: "Diferenciacion, margenes de servicio." }
    ],
    inmobiliaria: [
      { nombre: "Inmobiliaria Mediana", sector: "Inmobiliario", tamano: "Mediana (20-80 empleados)", decisores: "Gerente General, Director Comercial", motivaciones: "Vender stock de proyectos activos.", puntosDolor: "Velocidad de venta, costos de marketing." },
      { nombre: "Desarrolladora", sector: "Desarrollo Inmobiliario", tamano: "Grande (100+ empleados)", decisores: "Directorio, Gerencia Comercial", motivaciones: "Posicionar nuevos proyectos.", puntosDolor: "Preventa, financiamiento de proyectos." },
      { nombre: "Corredora de Propiedades", sector: "Corretaje", tamano: "Pequena (5-30 empleados)", decisores: "Dueno, Jefe de Corredores", motivaciones: "Captar propiedades y compradores.", puntosDolor: "Competencia, comisiones, leads calificados." }
    ],
    automotriz: [
      { nombre: "Concesionario Oficial", sector: "Automotriz", tamano: "Mediana (30-100 empleados)", decisores: "Gerente General, Gerente de Ventas", motivaciones: "Cumplir metas de venta de marca.", puntosDolor: "Stock, financiamiento, post-venta." },
      { nombre: "Multimarca Usados", sector: "Automotriz Usados", tamano: "Pequena-Mediana (10-50 empleados)", decisores: "Dueno, Gerente Comercial", motivaciones: "Rotacion de inventario rapida.", puntosDolor: "Captacion de vehiculos, financiamiento." },
      { nombre: "Flota Empresarial", sector: "Leasing/Renting", tamano: "Mediana (20-80 empleados)", decisores: "Gerente Comercial, Director de Flota", motivaciones: "Captar contratos de flota corporativa.", puntosDolor: "Competencia, servicio post-venta." }
    ],
    gastronomia: [
      { nombre: "Cadena de Restaurantes", sector: "Gastronomia", tamano: "Mediana (50-200 empleados)", decisores: "CEO, Director de Marketing", motivaciones: "Expandir locales y aumentar ticket.", puntosDolor: "Consistencia, costos operativos." },
      { nombre: "Proveedor Food Service", sector: "Distribucion", tamano: "Mediana (30-100 empleados)", decisores: "Gerente Comercial, KAM", motivaciones: "Captar clientes HORECA.", puntosDolor: "Logistica, margenes, fidelizacion." },
      { nombre: "Franquicia", sector: "Franquicias", tamano: "Variable", decisores: "Franquiciador, Gerente de Expansion", motivaciones: "Vender nuevas franquicias.", puntosDolor: "Encontrar franquiciados calificados." }
    ],
    turismo: [
      { nombre: "Operador Turistico", sector: "Turismo", tamano: "Mediana (20-80 empleados)", decisores: "Gerente General, Director Comercial", motivaciones: "Aumentar reservas y alianzas.", puntosDolor: "Estacionalidad, margenes, OTAs." },
      { nombre: "Hotel/Apart Hotel", sector: "Hoteleria", tamano: "Variable (20-150 empleados)", decisores: "Gerente General, Revenue Manager", motivaciones: "Maximizar ocupacion y RevPAR.", puntosDolor: "Competencia, dependencia de OTAs." },
      { nombre: "Agencia de Viajes", sector: "Agencias", tamano: "Pequena-Mediana (5-30 empleados)", decisores: "Dueno, Gerente Comercial", motivaciones: "Diferenciarse de ventas online.", puntosDolor: "Margenes, valor agregado." }
    ],
    construccion: [
      { nombre: "Constructora Mediana", sector: "Construccion", tamano: "Mediana (50-200 empleados)", decisores: "Gerente General, Director de Proyectos", motivaciones: "Ganar licitaciones y proyectos.", puntosDolor: "Flujo de caja, plazos, mano de obra." },
      { nombre: "Inmobiliaria Constructor", sector: "Desarrollo", tamano: "Mediana (30-100 empleados)", decisores: "Directorio, Gerencia de Proyectos", motivaciones: "Desarrollar y vender proyectos propios.", puntosDolor: "Permisos, financiamiento, ventas." },
      { nombre: "Empresa de Remodelacion", sector: "Remodelacion", tamano: "Pequena (5-30 empleados)", decisores: "Dueno, Jefe de Proyectos", motivaciones: "Captar proyectos de alto valor.", puntosDolor: "Leads calificados, competencia informal." }
    ],
    legal: [
      { nombre: "Estudio Juridico", sector: "Legal", tamano: "Pequeno-Mediano (5-50 empleados)", decisores: "Socios, Director Administrativo", motivaciones: "Captar clientes corporativos.", puntosDolor: "Diferenciacion, margenes." },
      { nombre: "Consultora Legal", sector: "Consultoria", tamano: "Mediana (20-80 empleados)", decisores: "Socios, Director Comercial", motivaciones: "Expandir servicios y clientes.", puntosDolor: "Competencia, especializacion." },
      { nombre: "Departamento Legal Inhouse", sector: "Corporativo", tamano: "Grande (como parte de empresa)", decisores: "Gerente Legal, Directorio", motivaciones: "Externalizar servicios especificos.", puntosDolor: "Costos, expertise especifico." }
    ]
  },
  b2b2c: {
    tecnologia: [
      { nombre: "Platform Tech Company", sector: "Tecnologia/Plataforma", tamano: "Mediana-Grande (50-200+ empleados)", decisores: "CEO, CPO, CMO", motivaciones: "Busca soluciones que beneficien tanto a sus clientes B2B como a usuarios finales.", puntosDolor: "Equilibrio entre necesidades empresariales y experiencia del usuario final." },
      { nombre: "SaaS Multi-tenant", sector: "Software/Cloud", tamano: "Mediana (30-150 empleados)", decisores: "CTO, Director de Producto", motivaciones: "Necesita escalar a traves de partners manteniendo calidad para usuarios.", puntosDolor: "Gestion de multiples stakeholders y expectativas diferentes." },
      { nombre: "Marketplace", sector: "E-commerce/Tech", tamano: "Variable (20-500 empleados)", decisores: "CEO, VP Growth, VP Operations", motivaciones: "Crecer oferta y demanda simultaneamente.", puntosDolor: "Efecto red, calidad de sellers, experiencia de comprador." }
    ],
    salud: [
      { nombre: "Plataforma Telemedicina", sector: "HealthTech", tamano: "Mediana (30-100 empleados)", decisores: "CEO, Director Medico", motivaciones: "Conectar pacientes con medicos eficientemente.", puntosDolor: "Regulacion, calidad de servicio, adopcion." }
    ],
    finanzas: [
      { nombre: "Plataforma Fintech", sector: "Fintech", tamano: "Mediana (50-200 empleados)", decisores: "CEO, CTO, CPO", motivaciones: "Escalar a traves de alianzas B2B llegando a consumidores.", puntosDolor: "Regulacion, integraciones, confianza." }
    ],
    retail: [
      { nombre: "Marketplace Retail", sector: "E-commerce", tamano: "Grande (100+ empleados)", decisores: "CEO, VP Comercial, VP Tech", motivaciones: "Crecer catalogo y transacciones.", puntosDolor: "Sellers, logistica, competencia." }
    ]
  }
}
