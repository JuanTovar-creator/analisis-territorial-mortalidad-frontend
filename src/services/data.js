// Servicio del módulo Datos
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import {
  edaIndicators,
  edaChartData,
  edaSummaryData,
  dataQuality,
  pipelineStages,
  integratedDataset,
} from '@/features/admin/data/demo/data-demo'

/**
 * Obtiene el estado del pipeline de procesamiento.
 * En modo demo devuelve las etapas ficticias.
 * En modo real llama a la API y propaga errores.
 */
export async function getPipelineStatus() {
  if (IS_DEMO_MODE) {
    return pipelineStages
  }
  return request('/data/pipeline-status')
}

/**
 * Obtiene el dataset integrado con filtros opcionales.
 * En modo demo devuelve el dataset ficticio.
 * En modo real llama a la API y propaga errores.
 */
export async function getDataset(filters = {}) {
  if (IS_DEMO_MODE) {
    return integratedDataset
  }
  const params = new URLSearchParams(filters).toString()
  return request(`/data/dataset?${params}`)
}

/**
 * Obtiene las métricas de análisis exploratorio (EDA).
 * En modo demo devuelve métricas ficticias.
 * En modo real llama a la API y propaga errores.
 */
export async function getEDAMetrics() {
  if (IS_DEMO_MODE) {
    return {
      indicators: edaIndicators,
      chartData: edaChartData,
      summaryData: edaSummaryData,
      dataQuality,
    }
  }
  return request('/data/eda')
}

/**
 * Obtiene el estado actual del EDA para DANE y RIPS.
 * Siempre llama a la API directamente, sin pasar por IS_DEMO_MODE.
 *
 * Respuesta esperada:
 * {
 *   dane: { disponible, vigente, generado_en, filas, archivo_raw },
 *   rips: { disponible, vigente, generado_en, filas, archivo_raw }
 * }
 */
export async function getEDAStatus() {
  return request('/eda/status')
}

/**
 * Obtiene las estadísticas EDA reales del dataset DANE.
 * Siempre llama a la API directamente, sin pasar por IS_DEMO_MODE.
 *
 * Respuesta esperada:
 * {
 *   dataset: "DANE",
 *   generado_en: "...",
 *   dimensiones: { filas, columnas },
 *   calidad: { duplicados_exactos, nulos_por_columna, vacios_por_columna, ... },
 *   demografico: { sexo, gru_ed1, gru_ed2, est_civil },
 *   geografico: { a_defun, sit_defun, area_res, top_departamentos },
 *   causas: { cau_homol_top10, c_bas1_top10, causa_667_top10 },
 *   asistencia: { asis_med },
 *   cruces: { a_defun_x_p_pman_iris_top10 }
 * }
 */
export async function getEDADane() {
  return request('/eda/dane')
}

/**
 * Obtiene las estadísticas EDA reales del dataset RIPS.
 * Siempre llama a la API directamente, sin pasar por IS_DEMO_MODE.
 *
 * Respuesta esperada:
 * {
 *   dataset: "RIPS",
 *   generado_en: "...",
 *   dimensiones: { filas, columnas },
 *   calidad: { duplicados_exactos, nulos_por_columna, vacios_por_columna, espacios_por_columna },
 *   numero_atenciones: { minimo, p25, mediana, p75, media, desviacion_estandar, maximo, suma },
 *   univariado: { tipo_atencion, diagnostico_top10 },
 *   geografico: { top_departamentos_filas, top_departamentos_atenciones, municipios_distintos, departamentos_distintos },
 *   cruces: { departamento_x_tipo_atencion_top10 }
 * }
 */
export async function getEDARips() {
  return request('/eda/rips')
}
