// Formato que escribe myp-daily-agent/scripts/reportes-seo/recolectar.mjs (null = sin datos)
export type IndiceReportes = {
  actualizado: string
  clientes: Record<string, { nombre: string; sitio: string; logo?: string | null; meses: string[]; falta?: string | null; fuentes?: { gsc: boolean; ga4: boolean }; actualizado?: string }>
}

export type ReporteMes = {
  cliente: string
  nombre: string
  sitio: string
  mes: string
  periodo: { desde: string; hasta: string; parcial: boolean }
  generado: string
  errores: string[]
  gsc: null | {
    clics: number; impresiones: number; posicion: number | null; ctr: number | null
    porDia: { fecha: string; clics: number; impresiones: number }[]
    consultas: { consulta: string; clics: number; impresiones: number; posicion: number }[]
    paginas: { pagina: string; clics: number; impresiones: number }[]
  }
  ga4: null | {
    desde: string; sesiones: number; organico: number; ia: number; contactosIA: number
    fuentesIA: { fuente: string; sesiones: number }[]
    canales: { canal: string; sesiones: number }[]
  }
  articulos: null | { fecha: string; titulo: string; url: string }[]
  acciones: { fecha: string; texto: string }[]
  visibilidad: null | {
    fecha: string
    busquedas: { busqueda: string; google: number | null; googleUrl: string | null; chatgpt: number | null | 'sin medir'; chatgptVeces: string | null; chatgptMencion: boolean; competidores: string[] }[]
  }
  seguimiento?: null | {
    medicion: string | null; metodo: string | null
    busquedas: {
      q: string; tipo: 'marca' | 'servicio' | 'ciudad' | 'pregunta-ia' | string; ia: boolean
      gsc: null | { posicion: number; clics: number; impresiones: number }
      google: Medida; googleUrl: string | null
      chatgpt: Medida; chatgptVeces: string | null; chatgptMencion: boolean
      gemini: Medida; geminiVeces: string | null; geminiMencion: boolean; geminiNota: string | null
      competidores: string[]
    }[]
  }
  bitacora?: null | { fecha: string; accion: string; url: string | null; tipo: 'técnico' | 'contenido' | 'GEO' | 'indexación' | string; fuente: string; enlaces?: { titulo: string; url: string }[] }[]
  notaSeo?: null | NotaSeo
  pendientes?: null | { actualizado: string; cliente: { texto: string }[]; nosotros: { texto: string; estado: string }[] }
  indexacion: null | { fecha: string; total: number; grupos: Record<string, number>; pendientes: string[] }
}

// número = posición; null = medido y no aparece; 'sin medir' = no se midió; 'no aplica' = búsqueda solo de Google
export type Medida = number | null | 'sin medir' | 'no aplica'

export type NotaSeo = {
  fecha: string; version: string; nota: number | null; muestra: number; urlsSitemap: number; noMide: string
  categorias: { id: string; nombre: string; puntos: number | null; max: number; sinMedir: string[] }[]
  problemas: { categoria: string; problema: string; pierde: number; detalle: string }[]
  criterios: { cat: string; categoria: string; nombre: string; max: number; pts: number | null; detalle: string }[]
}
