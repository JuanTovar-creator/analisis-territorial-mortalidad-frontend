// Datos ficticios de demostración para el módulo Evaluación y publicación de modelos
// Los componentes reciben estos datos como props (patrón API-ready)

export const demoVersion = 'v0.1.0-demo'

export const availableVersions = [
  { id: 'v0.1.0-demo', label: 'v0.1.0-demo' },
  { id: 'v0.2.0-demo', label: 'v0.2.0-demo' },
]

export const publicationHistory = [
  {
    id: 1,
    date: '2025-11-10T15:00:00',
    model: 'logistic-regression',
    version: 'v0.1.0-demo',
    dataset: 'integrated',
    status: 'published',
    accuracy: 0.82,
    source: 'preloaded',
  },
  {
    id: 2,
    date: '2025-11-09T11:30:00',
    model: 'decision-tree',
    version: 'v0.0.9-demo',
    dataset: 'municipal',
    status: 'published',
    accuracy: 0.80,
    source: 'preloaded',
  },
  {
    id: 3,
    date: '2025-11-08T17:00:00',
    model: 'logistic-regression',
    version: 'v0.0.8-demo',
    dataset: 'integrated',
    status: 'error',
    accuracy: null,
    source: 'preloaded',
  },
]
