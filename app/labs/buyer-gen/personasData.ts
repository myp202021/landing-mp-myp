export interface BasePersona {
  nombre: string
  edad?: string
  ocupacion?: string
  ingresos?: string
  sector?: string
  tamaño?: string
  decisores?: string
  motivaciones: string
  puntosDolor: string
}

export const personasDatabase: {
  [businessModel: string]: {
    [industry: string]: BasePersona[]
  }
} = {
  b2c: {
    tecnologia: [
      { nombre: "Ana Tecnológica", edad: "25-34 años", ocupacion: "Profesional digital", ingresos: "Medio-alto", motivaciones: "Busca estar a la vanguardia con las últimas tendencias y mejoras tecnológicas.", puntosDolor: "Desea productos que le faciliten la vida diaria y le permitan optimizar su tiempo." },
      { nombre: "Carlos Gaming", edad: "18-25 años", ocupacion: "Estudiante universitario / Gamer", ingresos: "Medio", motivaciones: "Busca el mejor rendimiento para sus experiencias de juego y estudio.", puntosDolor: "Necesita equilibrar presupuesto con calidad y rendimiento." },
      { nombre: "Sofía Digital", edad: "35-45 años", ocupacion: "Ejecutiva", ingresos: "Alto", motivaciones: "Valora la integración perfecta entre dispositivos y eficiencia.", puntosDolor: "Requiere soluciones que le permitan gestionar su trabajo y vida personal de manera fluida." }
    ],
    salud: [
      { nombre: "Roberto Bienestar", edad: "40-55 años", ocupacion: "Profesional con estilo de vida activo", ingresos: "Medio-alto", motivaciones: "Busca mantener y mejorar su salud con soluciones preventivas.", puntosDolor: "Tiempo limitado para cuidar de su bienestar integral." },
      { nombre: "Luisa Consciente", edad: "30-45 años", ocupacion: "Mamá/profesional", ingresos: "Medio", motivaciones: "Prioriza la salud familiar y busca opciones naturales y efectivas.", puntosDolor: "Necesita soluciones que se adapten a las diferentes necesidades familiares." },
      { nombre: "Eduardo Sénior", edad: "65+ años", ocupacion: "Jubilado activo", ingresos: "Medio", motivaciones: "Busca mantener su independencia y calidad de vida.", puntosDolor: "Requiere soluciones accesibles y fáciles de usar que mejoren su salud." }
    ],
    educacion: [
      { nombre: "María Estudiante", edad: "18-25 años", ocupacion: "Estudiante universitaria", ingresos: "Bajo", motivaciones: "Busca recursos educativos accesibles y de calidad.", puntosDolor: "Presupuesto limitado pero necesita herramientas competitivas." },
      { nombre: "Pedro Profesional", edad: "30-45 años", ocupacion: "Profesional en desarrollo", ingresos: "Medio-alto", motivaciones: "Busca especialización y actualización constante.", puntosDolor: "Tiempo limitado para estudiar y necesita flexibilidad." }
    ],
    finanzas: [
      { nombre: "Daniel Independiente", edad: "28-40 años", ocupacion: "Emprendedor/Freelancer", ingresos: "Variable", motivaciones: "Busca estabilidad financiera y crecimiento de su negocio.", puntosDolor: "Gestión de flujo de caja irregular y planificación." },
      { nombre: "Julia Inversora", edad: "30-45 años", ocupacion: "Profesional asalariada", ingresos: "Medio-alto", motivaciones: "Busca hacer crecer su patrimonio y diversificar inversiones.", puntosDolor: "Necesita orientación clara sobre opciones de inversión." }
    ],
    retail: [
      { nombre: "Paula Moda", edad: "20-35 años", ocupacion: "Profesional urbana", ingresos: "Medio", motivaciones: "Sigue tendencias y busca expresar su personalidad.", puntosDolor: "Equilibrio entre calidad, estilo y precio." },
      { nombre: "Gabriel Tecnológico", edad: "25-40 años", ocupacion: "Profesional tecnológico", ingresos: "Medio-alto", motivaciones: "Busca productos que mejoren su estilo de vida.", puntosDolor: "Valora innovación, diseño y funcionalidad." }
    ],
    servicios: [
      { nombre: "Andrés Emprendedor", edad: "30-45 años", ocupacion: "Emprendedor/pequeño empresario", ingresos: "Variable", motivaciones: "Busca servicios que impulsen su negocio.", puntosDolor: "Requiere soluciones efectivas a costos accesibles." },
      { nombre: "Natalia Ejecutiva", edad: "35-50 años", ocupacion: "Profesional senior", ingresos: "Alto", motivaciones: "Valora servicios premium que optimicen su tiempo.", puntosDolor: "Busca excelencia, personalización y atención exclusiva." }
    ]
  },
  b2b: {
    tecnologia: [
      { nombre: "Empresa Digitalizadora", sector: "Tecnología/Servicios", tamaño: "Mediana empresa (50-200 empleados)", decisores: "CTO, Director de Innovación", motivaciones: "Busca soluciones tecnológicas innovadoras para ofrecer a sus clientes.", puntosDolor: "Necesita proveedores confiables con soporte técnico y actualizaciones." },
      { nombre: "Startup Innovadora", sector: "Tecnología/Digital", tamaño: "Pequeña (5-50 empleados)", decisores: "Fundadores, CTO", motivaciones: "Busca tecnologías que le permitan escalar rápidamente.", puntosDolor: "Balance entre costo, escalabilidad y flexibilidad." }
    ],
    salud: [
      { nombre: "Centro Médico Privado", sector: "Salud", tamaño: "Mediano (20-100 empleados)", decisores: "Director Médico, Gerente de Operaciones", motivaciones: "Busca mejorar la calidad de atención y eficiencia operativa.", puntosDolor: "Cumplimiento normativo y optimización de recursos." },
      { nombre: "Clínica Especializada", sector: "Salud", tamaño: "Pequeña-Mediana (10-50 empleados)", decisores: "Propietarios, Médicos Jefe", motivaciones: "Busca diferenciación y excelencia en su especialidad.", puntosDolor: "Necesita soluciones específicas para su nicho." }
    ],
    educacion: [
      { nombre: "Institución Educativa Privada", sector: "Educación", tamaño: "Mediana (50-200 empleados)", decisores: "Director, Coordinador Académico", motivaciones: "Busca diferenciación educativa y modernización.", puntosDolor: "Balance entre tradición e innovación educativa." },
      { nombre: "Centro de Formación Profesional", sector: "Educación Técnica", tamaño: "Pequeño-Mediano (20-100 empleados)", decisores: "Director, Coordinadores de Área", motivaciones: "Busca herramientas prácticas y actualizadas para la formación.", puntosDolor: "Actualización constante y conexión con necesidades del mercado." }
    ],
    finanzas: [
      { nombre: "Fintech Emergente", sector: "Tecnología Financiera", tamaño: "Pequeña-Mediana (10-100 empleados)", decisores: "Fundadores, CTO", motivaciones: "Busca soluciones ágiles y disruptivas.", puntosDolor: "Escalabilidad, seguridad y cumplimiento regulatorio." },
      { nombre: "Consultora Financiera", sector: "Servicios Financieros", tamaño: "Pequeña-Mediana (5-50 empleados)", decisores: "Socios, Director General", motivaciones: "Busca herramientas para ofrecer mejores servicios a sus clientes.", puntosDolor: "Análisis de datos eficiente e información actualizada." }
    ],
    retail: [
      { nombre: "Tienda Multimarca", sector: "Comercio Minorista", tamaño: "Pequeña-Mediana (5-50 empleados)", decisores: "Propietario, Gerente de Compras", motivaciones: "Busca productos diferenciados con buenos márgenes.", puntosDolor: "Rotación de inventario y exclusividad." },
      { nombre: "E-commerce", sector: "Comercio Electrónico", tamaño: "Variable (5-200 empleados)", decisores: "CEO, Director de Operaciones", motivaciones: "Busca catálogo amplio y logística eficiente.", puntosDolor: "Gestión de inventario y tiempos de entrega." }
    ],
    servicios: [
      { nombre: "Consultora", sector: "Servicios Profesionales", tamaño: "Pequeña-Mediana (10-100 empleados)", decisores: "Socios, Director de Operaciones", motivaciones: "Busca soluciones para mejorar sus servicios al cliente.", puntosDolor: "Eficiencia operativa y diferenciación." },
      { nombre: "Agencia Creativa", sector: "Marketing/Comunicación", tamaño: "Pequeña (5-50 empleados)", decisores: "Director Creativo, Director de Cuentas", motivaciones: "Busca herramientas innovadoras para sus clientes.", puntosDolor: "Optimización de recursos y cumplimiento de plazos." }
    ]
  },
  b2b2c: {
    tecnologia: [
      { nombre: "Platform Tech Company", sector: "Tecnología/Plataforma", tamaño: "Mediana-Grande (50-200+ empleados)", decisores: "CEO, CPO, CMO", motivaciones: "Busca soluciones que beneficien tanto a sus clientes B2B como a usuarios finales.", puntosDolor: "Equilibrio entre necesidades empresariales y experiencia del usuario final." },
      { nombre: "SaaS Multi-tenant", sector: "Software/Cloud", tamaño: "Mediana (30-150 empleados)", decisores: "CTO, Director de Producto", motivaciones: "Necesita escalar a través de partners manteniendo calidad para usuarios.", puntosDolor: "Gestión de múltiples stakeholders y expectativas diferentes." }
    ]
  }
}
