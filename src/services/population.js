// Servicio de datos de población y defunciones del backend
// Consume los endpoints de /population sin autenticación.
// Independiente de IS_DEMO_MODE: siempre llama a la API real.
// Maneja errores HTTP, tiempos de espera y respuestas vacías.

import { API_BASE_URL } from '@/config/app-config'

const TIMEOUT = 15000 // 15 segundos

// Caché en memoria para evitar consultas repetidas al mismo municipio
const populationCache = new Map()

// AbortController activo para cancelación de solicitudes anteriores
let activeController = null

/**
 * Envuelve `fetch` para endpoints públicos sin token.
 *
 * @param {string} path - Ruta relativa al endpoint (ej: '/population/municipios').
 * @param {object} options - Opciones adicionales para fetch.
 * @returns {Promise<any>} Datos parseados de la respuesta.
 * @throws {Error} Si la respuesta no es OK, hay timeout o la red falla.
 */
async function publicRequest(path, options = {}) {
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

/**
 * Obtiene los datos de población de un municipio específico por código DIVIPOLA.
 * Utiliza caché en memoria para evitar consultas repetidas y cancela solicitudes
 * anteriores si se realiza una nueva consulta antes de que termine la anterior.
 *
 * @param {string} codigo - Código numérico del municipio (ej: '20001', '11001', '05001').
 * @returns {Promise<any>} Datos de población del municipio con indicadores.
 * @throws {Error} Si el código es inválido, la solicitud falla o no hay datos.
 */
export async function getMunicipioPopulation(codigo) {
  if (!codigo) {
    throw new Error('Código de municipio requerido')
  }

  // Normalizar código a 5 dígitos DIVIPOLA
  const normalized = String(codigo).padStart(5, '0')

  // Devolver desde caché si ya está disponible
  if (populationCache.has(normalized)) {
    return populationCache.get(normalized)
  }

  // Cancelar solicitud anterior si aún está en curso
  if (activeController) {
    activeController.abort()
  }

  activeController = new AbortController()
  const { signal } = activeController

  try {
    const data = await publicRequest(`/population/municipios/${normalized}`)

    if (!data) {
      throw new Error(`No se encontraron datos de población para el municipio ${normalized}`)
    }

    // Almacenar en caché
    populationCache.set(normalized, data)
    activeController = null

    return data
  } catch (error) {
    // No lanzar error si la solicitud fue cancelada
    if (error.name === 'AbortError') {
      throw error
    }
    activeController = null
    throw error
  }
}

/**
 * Limpia la caché de población. Útil para forzar recarga de datos.
 */
export function clearPopulationCache() {
  populationCache.clear()
}

/**
 * Obtiene la lista completa de municipios con datos de población y defunciones.
 * El backend devuelve un array con:
 * { cod_municipio, municipio, departamento, anio, poblacion,
 *   defunciones_sin_asistencia, defunciones_con_respuesta_valida,
 *   tasa_por_100000, porcentaje_sin_asistencia_observado, estado_dane }
 *
 * @deprecated Este endpoint falla con HTTP 500 por serialización de NaN en el backend.
 *   Usar getMunicipioPopulation(codigo) para obtener datos de un municipio específico.
 * @returns {Promise<Array>} Lista de municipios con indicadores de población.
 */
export async function getPopulationData() {
  const data = await publicRequest('/population/municipios')

  if (!data || !Array.isArray(data)) {
    throw new Error('Respuesta inválida: los datos de población no son un array')
  }

  return data
}

