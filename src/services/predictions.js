// Servicio de predicciones públicas del backend
// Consume los endpoints de /predictions sin autenticación.
// Independiente de IS_DEMO_MODE: siempre llama a la API real.
// Maneja errores HTTP, tiempos de espera y respuestas vacías.

import { API_BASE_URL } from '@/config/app-config'

const TIMEOUT = 15000 // 15 segundos para predicciones

/**
 * Envuelve `fetch` para endpoints públicos sin token.
 *
 * @param {string} path - Ruta relativa al endpoint (ej: '/predictions/municipios').
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
 * Obtiene la lista completa de municipios disponibles para predicción.
 * El backend devuelve: { total_municipios: number, municipios: string[] }
 *
 * @returns {Promise<{total_municipios: number, municipios: string[]}>}
 */
export async function getMunicipiosList() {
  const data = await publicRequest('/predictions/municipios')

  if (!data || !Array.isArray(data.municipios)) {
    throw new Error('Respuesta inválida: la lista de municipios no es un array')
  }

  return data
}

/**
 * Obtiene la predicción detallada de un municipio por su código.
 * El backend devuelve los datos de predicción del municipio solicitado.
 *
 * @param {string} codigo - Código numérico del municipio (ej: '05001').
 * @returns {Promise<any>} Datos de predicción del municipio.
 */
export async function getMunicipioPrediction(codigo) {
  if (!codigo) {
    throw new Error('Código de municipio requerido')
  }

  const data = await publicRequest(`/predictions/municipios/${codigo}`)

  if (!data) {
    throw new Error(`No se encontraron datos de predicción para el municipio ${codigo}`)
  }

  return data
}

/**
 * Compara las predicciones de dos municipios.
 * El backend devuelve la comparación entre los dos códigos proporcionados.
 *
 * @param {string} codigo1 - Código del primer municipio.
 * @param {string} codigo2 - Código del segundo municipio.
 * @returns {Promise<any>} Datos de comparación entre municipios.
 */
export async function compareMunicipios(codigo1, codigo2) {
  if (!codigo1 || !codigo2) {
    throw new Error('Se requieren dos códigos de municipio para comparar')
  }

  const params = new URLSearchParams({ codigo1, codigo2 })
  const data = await publicRequest(`/predictions/comparar?${params}`)

  if (!data) {
    throw new Error('No se pudo obtener la comparación de municipios')
  }

  return data
}

/**
 * Obtiene el resumen agregado de predicciones de un municipio.
 *
 * @param {string} codigo - Código numérico del municipio.
 * @returns {Promise<any>} Resumen agregado del municipio.
 */
export async function getMunicipioResumen(codigo) {
  if (!codigo) {
    throw new Error('Código de municipio requerido')
  }

  const data = await publicRequest(`/predictions/resumen-municipio/${codigo}`)

  if (!data) {
    throw new Error(`No se encontró el resumen para el municipio ${codigo}`)
  }

  return data
}

/**
 * Obtiene el resumen agregado de todos los municipios.
 * El backend devuelve: { total_municipios, modelo_utilizado, municipios: [{ codigo_municipio, promedio_predicho, promedio_observado, total_diagnosticos }] }
 *
 * @returns {Promise<{total_municipios: number, modelo_utilizado: string, municipios: Array}>}
 */
export async function getResumenTodos() {
  const data = await publicRequest('/predictions/resumen-todos')

  if (!data || !Array.isArray(data.municipios)) {
    throw new Error('Respuesta inválida: la lista de resúmenes no es un array')
  }

  return data
}

/**
 * Compara el resumen agregado de entre 2 y 10 municipios.
 * El backend devuelve: { modelo_utilizado, total_municipios, municipios: [{ codigo_municipio, encontrado, promedio_predicho, promedio_observado, total_diagnosticos }] }
 *
 * @param {string[]} codigos - Array de códigos de municipio (ej: ['05001', '08001']).
 * @returns {Promise<{modelo_utilizado: string, total_municipios: number, municipios: Array}>}
 */
export async function getCompararResumen(codigos) {
  if (!codigos || !Array.isArray(codigos) || codigos.length < 2) {
    throw new Error('Se requieren al menos dos códigos de municipio para comparar')
  }

  const params = new URLSearchParams({ codigos: codigos.join(',') })
  const data = await publicRequest(`/predictions/comparar-resumen?${params}`)

  if (!data || !Array.isArray(data.municipios)) {
    throw new Error('Respuesta inválida: la comparación no contiene municipios')
  }

  return data
}

/**
 * Verifica la conectividad con el backend FastAPI.
 * Devuelve true si el endpoint /health responde correctamente.
 *
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const data = await publicRequest('/health')
    return data && data.status === 'ok'
  } catch {
    return false
  }
}
