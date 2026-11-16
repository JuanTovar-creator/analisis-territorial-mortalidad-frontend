// Servicio del módulo Entrenamiento
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import {
  demoDatasets,
  modelTypes,
  dataSplit,
  metricResults,
  trainingHistory,
} from '@/features/admin/training/demo/training-demo'

// Configuración de demo
const demoConfig = {
  dataset: 'integrated',
  model: 'logistic-regression',
  params: {
    learning_rate: 0.01,
    regularization: 0.001,
  },
  split: dataSplit,
}

/**
 * Obtiene la configuración del entrenamiento.
 * En modo demo devuelve la configuración ficticia.
 * En modo real llama a la API y propaga errores.
 */
export async function getTrainingConfig() {
  if (IS_DEMO_MODE) {
    return { ...demoConfig, datasets: demoDatasets, models: modelTypes }
  }
  return request('/training/config')
}

/**
 * Obtiene el estado del entrenamiento en curso.
 * En modo demo devuelve un estado completado.
 * En modo real llama a la API y propaga errores.
 */
export async function getTrainingStatus() {
  if (IS_DEMO_MODE) {
    return { status: 'completed', progress: 100 }
  }
  return request('/training/status')
}

/**
 * Obtiene los resultados de un modelo específico.
 * En modo demo devuelve métricas ficticias.
 * En modo real llama a la API y propaga errores.
 */
export async function getTrainingResults(modelId) {
  if (IS_DEMO_MODE) {
    return metricResults[modelId] || metricResults['logistic-regression']
  }
  return request(`/training/results/${modelId}`)
}

/**
 * Obtiene el historial de entrenamientos.
 * En modo demo devuelve registros precargados.
 * En modo real llama a la API y propaga errores.
 */
export async function getTrainingHistory() {
  if (IS_DEMO_MODE) {
    return trainingHistory
  }
  return request('/training/history')
}
