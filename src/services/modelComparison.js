// Servicio para obtener la comparación de modelos entrenados
// Consume GET /admin/models/comparison sin depender de IS_DEMO_MODE.
// No utiliza datos demo como fallback.

import { request } from './api'

/**
 * Obtiene los resultados de comparación de modelos del backend.
 *
 * @returns {Promise<object>} El contrato JSON completo de /admin/models/comparison.
 * @throws {Error} Si el backend devuelve 404 (modelos no entrenados) u otro error HTTP.
 */
export async function getModelComparison() {
  return request('/admin/models/comparison')
}
