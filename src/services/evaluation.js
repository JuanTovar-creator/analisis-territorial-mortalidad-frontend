// Servicio del módulo Evaluación
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import { metricResults, modelTypes } from '@/features/admin/training/demo/training-demo'
import { demoVersion } from '@/features/admin/evaluation/demo/evaluation-demo'

// Modelo publicado actualmente (demo)
const demoPublishedModel = {
  id: 1,
  model: 'logistic-regression',
  version: demoVersion,
  dataset: 'integrated',
  publishedAt: '2025-11-10T15:00:00',
  status: 'published',
}

/**
 * Obtiene las métricas de evaluación de ambos modelos.
 * En modo demo devuelve métricas ficticias.
 * En modo real llama a la API y propaga errores.
 */
export async function getEvaluationMetrics() {
  if (IS_DEMO_MODE) {
    return {
      models: modelTypes,
      metrics: metricResults,
      recommendedModel: 'logistic-regression',
    }
  }
  return request('/evaluation/metrics')
}

/**
 * Obtiene el modelo publicado actualmente.
 * En modo demo devuelve el modelo ficticio.
 * En modo real llama a la API y propaga errores.
 */
export async function getPublishedModel() {
  if (IS_DEMO_MODE) {
    return demoPublishedModel
  }
  return request('/evaluation/published-model')
}

