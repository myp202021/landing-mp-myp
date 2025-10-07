export interface BasePersona {
  nombre: string
  edad?: string
  ocupacion?: string
  ingresos?: string
  sector?: string
  tama�o?: string
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
      { nombre: "Ana Tecnol�gica", edad: "25-34 a�os", ocupacion: "Profesional digital", ingresos: "Medio-alto", motivaciones: "Busca estar a la vanguardia con las �ltimas tendencias y mejoras tecnol�gicas.", puntosDolor: "Desea productos que le faciliten la vida diaria y le permitan optimizar su tiempo." },
      { nombre: "Carlos Gaming", edad: "18-25 a�os", ocupacion: "Estudiante universitario / Gamer", ingresos: "Medio", motivaciones: "Busca el mejor rendimiento para sus experiencias de juego y estudio.", puntosDolor: "Necesita equilibrar presupuesto con calidad y rendimiento." },
      { nombre: "Sof�a Digital", edad: "35-45 a�os", ocupacion: "Ejecutiva", ingresos: "Alto", motivaciones: "Valora la integraci�n perfecta entre dispositivos y eficiencia.", puntosDolor: "Requiere soluciones que le permitan gestionar su trabajo y vida personal de manera fluida." }
    ],
    salud: [
      { nombre: "Roberto Bienestar", edad: "40-55 a�os", ocupacion: "Profesional con estilo de vida activo", ingresos: "Medio-alto", motivaciones: "Busca mantener y mejorar su salud con soluciones preventivas.", puntosDolor: "Tiempo limitado para cuidar de su bienestar integral." },
      { nombre: "Luisa Consciente", edad: "30-45 a�os", ocupacion: "Mam�/profesional", ingresos: "Medio", motivaciones: "Prioriza la salud familiar y busca opciones naturales y efectivas.", puntosDolor: "Necesita soluciones que se adapten a las diferentes necesidades familiares." },
      { nombre: "Eduardo S�nior", edad: "65+ a�os", ocupacion: "Jubilado activo", ingresos: "Medio", motivaciones: "Busca mantener su independencia y calidad de vida.", puntosDolor: "Requiere soluciones accesibles y f�ciles de usar que mejoren su salud." }
    ],
    educacion: [
      { nombre: "Mar�a Estudiante", edad: "18-25 a�os", ocupacion: "Estudiante universitaria", ingresos: "Bajo", motivaciones: "Busca recursos educativos accesibles y de calidad.", puntosDolor: "Presupuesto limitado pero necesita herramientas competitivas." },
      { nombre: "Pedro Profesional", edad: "30-45 a�os", ocupacion: "Profesional en desarrollo", ingresos: "Medio-alto", motivaciones: "Busca especializaci�n y actualizaci�n constante.", puntosDolor: "Tiempo limitado para estudiar y necesita flexibilidad." }
    ],
    finanzas: [
      { nombre: "Daniel Independiente", edad: "28-40 a�os", ocupacion: "Emprendedor/Freelancer", ingresos: "Variable", motivaciones: "Busca estabilidad financiera y crecimiento de su negocio.", puntosDolor: "Gesti�n de flujo de caja irregular y planificaci�n." },
      { nombre: "Julia Inversora", edad: "30-45 a�os", ocupacion: "Profesional asalariada", ingresos: "Medio-alto", motivaciones: "Busca hacer crecer su patrimonio y diversificar inversiones.", puntosDolor: "Necesita orientaci�n clara sobre opciones de inversi�n." }
    ],
    retail: [
      { nombre: "Paula Moda", edad: "20-35 a�os", ocupacion: "Profesional urbana", ingresos: "Medio", motivaciones: "Sigue tendencias y busca expresar su personalidad.", puntosDolor: "Equilibrio entre calidad, estilo y precio." },
      { nombre: "Gabriel Tecnol�gico", edad: "25-40 a�os", ocupacion: "Profesional tecnol�gico", ingresos: "Medio-alto", motivaciones: "Busca productos que mejoren su estilo de vida.", puntosDolor: "Valora innovaci�n, dise�o y funcionalidad." }
    ],
    servicios: [
      { nombre: "Andr�s Emprendedor", edad: "30-45 a�os", ocupacion: "Emprendedor/peque�o empresario", ingresos: "Variable", motivaciones: "Busca servicios que impulsen su negocio.", puntosDolor: "Requiere soluciones efectivas a costos accesibles." },
      { nombre: "Natalia Ejecutiva", edad: "35-50 a�os", ocupacion: "Profesional senior", ingresos: "Alto", motivaciones: "Valora servicios premium que optimicen su tiempo.", puntosDolor: "Busca excelencia, personalizaci�n y atenci�n exclusiva." }
    ]
  },
  b2b: {
    tecnologia: [
      { nombre: "Empresa Digitalizadora", sector: "Tecnolog�a/Servicios", tama�o: "Mediana empresa (50-200 empleados)", decisores: "CTO, Director de Innovaci�n", motivaciones: "Busca soluciones tecnol�gicas innovadoras para ofrecer a sus clientes.", puntosDolor: "Necesita proveedores confiables con soporte t�cnico y actualizaciones." },
      { nombre: "Startup Innovadora", sector: "Tecnolog�a/Digital", tama�o: "Peque�a (5-50 empleados)", decisores: "Fundadores, CTO", motivaciones: "Busca tecnolog�as que le permitan escalar r�pidamente.", puntosDolor: "Balance entre costo, escalabilidad y flexibilidad." }
    ],
    salud: [
      { nombre: "Centro M�dico Privado", sector: "Salud", tama�o: "Mediano (20-100 empleados)", decisores: "Director M�dico, Gerente de Operaciones", motivaciones: "Busca mejorar la calidad de atenci�n y eficiencia operativa.", puntosDolor: "Cumplimiento normativo y optimizaci�n de recursos." },
      { nombre: "Cl�nica Especializada", sector: "Salud", tama�o: "Peque�a-Mediana (10-50 empleados)", decisores: "Propietarios, M�dicos Jefe", motivaciones: "Busca diferenciaci�n y excelencia en su especialidad.", puntosDolor: "Necesita soluciones espec�ficas para su nicho." }
    ],
    educacion: [
      { nombre: "Instituci�n Educativa Privada", sector: "Educaci�n", tama�o: "Mediana (50-200 empleados)", decisores: "Director, Coordinador Acad�mico", motivaciones: "Busca diferenciaci�n educativa y modernizaci�n.", puntosDolor: "Balance entre tradici�n e innovaci�n educativa." },
      { nombre: "Centro de Formaci�n Profesional", sector: "Educaci�n T�cnica", tama�o: "Peque�o-Mediano (20-100 empleados)", decisores: "Director, Coordinadores de �rea", motivaciones: "Busca herramientas pr�cticas y actualizadas para la formaci�n.", puntosDolor: "Actualizaci�n constante y conexi�n con necesidades del mercado." }
    ],
    finanzas: [
      { nombre: "Fintech Emergente", sector: "Tecnolog�a Financiera", tama�o: "Peque�a-Mediana (10-100 empleados)", decisores: "Fundadores, CTO", motivaciones: "Busca soluciones �giles y disruptivas.", puntosDolor: "Escalabilidad, seguridad y cumplimiento regulatorio." },
      { nombre: "Consultora Financiera", sector: "Servicios Financieros", tama�o: "Peque�a-Mediana (5-50 empleados)", decisores: "Socios, Director General", motivaciones: "Busca herramientas para ofrecer mejores servicios a sus clientes.", puntosDolor: "An�lisis de datos eficiente e informaci�n actualizada." }
    ],
    retail: [
      { nombre: "Tienda Multimarca", sector: "Comercio Minorista", tama�o: "Peque�a-Mediana (5-50 empleados)", decisores: "Propietario, Gerente de Compras", motivaciones: "Busca productos diferenciados con buenos m�rgenes.", puntosDolor: "Rotaci�n de inventario y exclusividad." },
      { nombre: "E-commerce", sector: "Comercio Electr�nico", tama�o: "Variable (5-200 empleados)", decisores: "CEO, Director de Operaciones", motivaciones: "Busca cat�logo amplio y log�stica eficiente.", puntosDolor: "Gesti�n de inventario y tiempos de entrega." }
    ],
    servicios: [
      { nombre: "Consultora", sector: "Servicios Profesionales", tama�o: "Peque�a-Mediana (10-100 empleados)", decisores: "Socios, Director de Operaciones", motivaciones: "Busca soluciones para mejorar sus servicios al cliente.", puntosDolor: "Eficiencia operativa y diferenciaci�n." },
      { nombre: "Agencia Creativa", sector: "Marketing/Comunicaci�n", tama�o: "Peque�a (5-50 empleados)", decisores: "Director Creativo, Director de Cuentas", motivaciones: "Busca herramientas innovadoras para sus clientes.", puntosDolor: "Optimizaci�n de recursos y cumplimiento de plazos." }
    ]
  },
  b2b2c: {
    tecnologia: [
      { nombre: "Platform Tech Company", sector: "Tecnolog�a/Plataforma", tama�o: "Mediana-Grande (50-200+ empleados)", decisores: "CEO, CPO, CMO", motivaciones: "Busca soluciones que beneficien tanto a sus clientes B2B como a usuarios finales.", puntosDolor: "Equilibrio entre necesidades empresariales y experiencia del usuario final." },
      { nombre: "SaaS Multi-tenant", sector: "Software/Cloud", tama�o: "Mediana (30-150 empleados)", decisores: "CTO, Director de Producto", motivaciones: "Necesita escalar a trav�s de partners manteniendo calidad para usuarios.", puntosDolor: "Gesti�n de m�ltiples stakeholders y expectativas diferentes." }
    ]
  }
}
