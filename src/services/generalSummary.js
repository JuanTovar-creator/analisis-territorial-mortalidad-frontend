// Servicio para obtener el resumen general del dashboard del usuario.
// Consume GET /predictions/resumen-todos y GET /admin/models/comparison
// sin depender de IS_DEMO_MODE. No utiliza datos demo como fallback.

import { request } from './api'

/**
 * Obtiene el resumen agregado de todos los municipios con sus
 * promedios observados y predichos de defunciones sin asistencia médica.
 *
 * @returns {Promise<object>} { total_municipios, modelo_utilizado, municipios: [{ codigo_municipio, promedio_predicho, promedio_observado, total_diagnosticos }] }
 */
export async function getResumenTodos() {
  return request('/predictions/resumen-todos')
}

/**
 * Obtiene la comparación de modelos entrenados para mostrar
 * qué modelo está activo y sus métricas.
 *
 * @returns {Promise<object>} El contrato JSON completo de /admin/models/comparison.
 */
export async function getGeneralModelComparison() {
  return request('/admin/models/comparison')
}
