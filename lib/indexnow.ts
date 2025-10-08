// IndexNow API para notificar a buscadores sobre contenido nuevo/actualizado
// Soporta: Bing, Yandex, Naver, Seznam.cz

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'f4b3a2c1d5e6f7g8h9i0j1k2l3m4n5o6'
const SITE_URL = 'https://www.mulleryperez.cl'

// Endpoints de IndexNow (todos comparten el mismo protocolo)
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

export interface IndexNowSubmission {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

/**
 * Envía URLs a IndexNow para indexación instantánea
 * @param urls - Array de URLs completas para indexar
 * @returns Promise con el resultado de la sumisión
 */
export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; errors?: string[] }> {
  if (!urls || urls.length === 0) {
    return { success: false, errors: ['No URLs provided'] }
  }

  // Validar que todas las URLs pertenecen al dominio
  const validUrls = urls.filter(url => url.startsWith(SITE_URL))

  if (validUrls.length === 0) {
    return { success: false, errors: ['No valid URLs for this domain'] }
  }

  const submission: IndexNowSubmission = {
    host: 'www.mulleryperez.cl',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: validUrls
  }

  const errors: string[] = []

  // Enviar a todos los endpoints (solo necesitas enviar a uno, pero por redundancia enviamos a todos)
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(submission)
      })

      if (!response.ok) {
        errors.push(`${endpoint}: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      errors.push(`${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Envía una sola URL a IndexNow
 * @param url - URL completa para indexar
 */
export async function submitUrlToIndexNow(url: string): Promise<{ success: boolean; errors?: string[] }> {
  return submitToIndexNow([url])
}

/**
 * Genera el contenido del archivo de clave IndexNow
 * Este archivo debe estar disponible públicamente en /{key}.txt
 */
export function getIndexNowKeyContent(): string {
  return INDEXNOW_KEY
}
