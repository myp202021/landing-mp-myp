// Formato que escribe myp-daily-agent/scripts/reportes-seo/recolectar.mjs (null = sin datos)
export type IndiceReportes = {
  actualizado: string
  clientes: Record<string, { nombre: string; sitio: string; meses: string[] }>
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
  indexacion: null | { fecha: string; total: number; grupos: Record<string, number>; pendientes: string[] }
}
