// Configuración compartida del cliente HTTP
// Únicamente contiene la configuración base y un wrapper para fetch.
// No incluye funciones de negocio ni endpoints específicos.

import { API_BASE_URL } from '@/config/app-config'

const TIMEOUT = 10000 // 10 segundos

/**
 * Envuelve `fetch` con configuración compartida.
 *
 * @param {string} path - Ruta relativa al endpoint (ej: '/training/config').
 * @param {object} options - Opciones adicionales para fetch.
 * @returns {Promise<any>} Datos parseados de la respuesta.
 * @throws {Error} Si la respuesta no es OK o hay timeout.
 */
export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(`Error ${response.status}: ${body || response.statusText}`)
    }

    return response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}
