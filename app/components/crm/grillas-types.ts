// Tipos de DB para Grillas de Contenido
export {
  type GrillaEstado,
  type GrillaPost,
  type GrillaSemana,
  getEstadoLabel,
  getEstadoColors,
  getPlatformStyle,
  MESES
} from './grillas-mock-data'

export interface GrillaContenido {
  id: string
  cliente_id: string
  mes: number
  anio: number
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'enviado'
  posts: import('./grillas-mock-data').GrillaPost[]
  token_publico: string
  created_at: string
  updated_at: string
  // Joined fields
  clientes?: { nombre: string; rubro: string; contacto_email: string }
}

export interface GrillaComentario {
  id: string
  grilla_id: string
  post_id: string
  autor: string
  texto: string
  es_cliente: boolean
  created_at: string
}
