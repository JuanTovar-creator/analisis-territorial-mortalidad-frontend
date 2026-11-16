// Servicio del módulo Datos
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import {
  edaIndicators,
  edaChartData,
  edaSummaryData,
  edaDataQuality,
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
      dataQuality: edaDataQuality,
    }
  }
  return request('/data/eda')
}
