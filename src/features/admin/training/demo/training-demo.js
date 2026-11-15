// Datos ficticios de demostración para el módulo Entrenamiento
// Los componentes reciben estos datos como props (patrón API-ready)

export const demoDatasets = [
  { id: 'integrated', name: 'Dataset integrado (demo)', records: 12480, variables: 28 },
  { id: 'municipal', name: 'Dataset municipal (demo)', records: 4500, variables: 15 },
]

export const modelTypes = [
  {
    id: 'logistic-regression',
    name: 'Regresión Logística',
    params: [
      { key: 'learning_rate', label: 'Tasa de aprendizaje', default: 0.01, min: 0.001, max: 0.1, step: 0.001 },
      { key: 'regularization', label: 'Regularización', default: 0.001, min: 0.0001, max: 1.0, step: 0.0001 },
    ],
  },
  {
    id: 'decision-tree',
    name: 'Árbol de Decisión',
    params: [
      { key: 'max_depth', label: 'Profundidad máxima', default: 5, min: 1, max: 20, step: 1 },
      { key: 'min_samples_split', label: 'Mín. muestras para dividir', default: 2, min: 2, max: 100, step: 1 },
    ],
  },
]

export const dataSplit = { train: 70, validation: 15, test: 15 }

// Métricas sintéticas coherentes con la matriz de confusión
// Accuracy = (TP+TN) / (TP+TN+FP+FN)
// Precision = TP / (TP+FP)
// Recall = TP / (TP+FN)
// F1 = 2 * (Precision * Recall) / (Precision + Recall)
// ROC-AUC proviene de datos sintéticos de puntuaciones, no de la matriz
export const metricResults = {
  'logistic-regression': {
    accuracy: 0.82,
    precision: 0.79,
    recall: 0.76,
    f1: 0.77,
    auc: 0.85,
    confusionMatrix: { tp: 312, tn: 340, fp: 88, fn: 106 },
    positiveClass: 'Riesgo de mortalidad evitable (sí)',
  },
  'decision-tree': {
    accuracy: 0.80,
    precision: 0.77,
    recall: 0.78,
    f1: 0.77,
    auc: 0.83,
    confusionMatrix: { tp: 318, tn: 332, fp: 96, fn: 98 },
    positiveClass: 'Riesgo de mortalidad evitable (sí)',
  },
}

// Ejecuciones precargadas (ficticias) vs sesiones actuales
export const trainingHistory = [
  {
    id: 1,
    date: '2025-11-10T14:30:00',
    model: 'logistic-regression',
    dataset: 'integrated',
    split: '70/15/15',
    status: 'completed',
    accuracy: 0.82,
    source: 'preloaded',
  },
  {
    id: 2,
    date: '2025-11-09T10:15:00',
    model: 'decision-tree',
    dataset: 'municipal',
    split: '70/15/15',
    status: 'completed',
    accuracy: 0.80,
    source: 'preloaded',
  },
  {
    id: 3,
    date: '2025-11-08T16:45:00',
    model: 'logistic-regression',
    dataset: 'integrated',
    split: '70/15/15',
    status: 'error',
    accuracy: null,
    source: 'preloaded',
  },
]
