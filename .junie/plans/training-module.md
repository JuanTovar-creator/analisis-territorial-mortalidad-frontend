---
sessionId: session-261115-012645-nf2a
---

# Requirements

### Overview
Implementación del módulo **Entrenamiento de modelos** en el panel administrativo. Permite configurar, ejecutar (simulado), visualizar resultados sintéticos y consultar un historial breve de entrenamientos. Todo el contenido es de demostración y se marca como tal.

### Scope

**In Scope:**
- Configuración del entrenamiento: selección de dataset de demostración, modelo (Regresión Logística / Árbol de Decisión), distribución fija 70/15/15 y parámetros básicos.
- Ejecución simulada con estados: pendiente, ejecutando, completado, error, y barra de progreso.
- Resultados preliminares con métricas sintéticas de clasificación en tarjetas, gráficos Recharts y matriz de confusión.
- Historial breve de ejecuciones simuladas recientes dentro del módulo.
- Datos de demo separados de la lógica visual (API-ready).
- Integración en la ruta `/admin/training` sin alterar otras rutas.

**Out of Scope:**
- Backend real, algoritmos de entrenamiento, o modelos reales.
- Evaluación detallada y publicación de modelos (módulo independiente).
- Historial general del sistema (módulo independiente).
- Commits, push o merges automáticos.
- Semilla aleatoria ni estratificación (se definirán con el equipo de backend).
- Parámetros adicionales como C, max_iter o solver.

### Functional Requirements
1. **Configuración:** El usuario selecciona dataset, tipo de modelo y parámetros (learning_rate + regularization para Regresión Logística; max_depth + min_samples_split para Árbol de Decisión). La distribución 70/15/15 se muestra fija sin controles editables.
2. **Ejecución:** Al iniciar, se simula un entrenamiento con progreso animado (~8-12 seg). Se muestran estados y mensajes claros de que es una simulación. No se permiten ejecuciones simultáneas. Al terminar, se puede iniciar otra.
3. **Resultados:** Tras completar, se muestran métricas sintéticas (Accuracy, Precision, Recall, F1-score, ROC-AUC) en tarjetas y gráficos, más una matriz de confusión (TP, TN, FP, FN) con la clase positiva identificada. Las métricas son coherentes con la matriz. ROC-AUC proviene de datos sintéticos de puntuaciones, no de la matriz. Se puede consultar resultados de ambos modelos sin presentar uno como superior.
4. **Historial:** Lista de las últimas ejecuciones simuladas con fecha, modelo, dataset, distribución 70/15/15, estado y métrica principal. Se diferencian las ejecuciones ficticias precargadas de las simulaciones de la sesión actual.

### Non-Functional Requirements
- Diseño responsive (mobile-first con Tailwind).
- Limpieza correcta de timers y efectos en desmontaje.
- Componentes que reciben datos por props (API-ready).
- Reutilización de componentes shadcn/ui existentes.
- Valores predeterminados razonables y validaciones básicas en parámetros.

# Technical Design

### Current Implementation
- **Rutas:** `App.jsx` define `/admin/training` con un `ModulePlaceholder`. Se reemplazará por un `TrainingModule` lazy-loaded.
- **Navegación:** `navigation.js` ya incluye "Entrenamiento" en el menú admin con ícono `Activity`.
- **Patrón del módulo Datos:** `DataModule.jsx` usa tabs, `PageHeader`, `DemoNotice`, datos de demo en `data-demo.js`, y sub-componentes en carpetas (`upload/`, `eda/`, `processing/`, `dataset/`).
- **Simulación:** `ProcessingPipeline.jsx` demuestra timers, `useRef` para cleanup, estados de progreso y animación con `setInterval`/`setTimeout`.
- **Gráficos:** `EDAChart.jsx` usa Recharts (`BarChart`, `ResponsiveContainer`, `Tooltip`) dentro de `Card`.
- **UI:** Componentes shadcn/ui disponibles: `Card`, `Badge`, `Button`, `Select`, `Field`, `Alert`, `Skeleton`.

### Key Decisions
- **Tabs vs secciones verticales:** Se usarán tabs (como `DataModule`) para organizar: Configuración, Ejecución, Resultados, Historial. Esto mantiene consistencia con el módulo Datos.
- **Datos de demo separados:** Un archivo `demo/training-demo.js` contendrá datasets, modelos, parámetros, métricas, matriz de confusión y historial ficticio. Los componentes reciben todo por props.
- **Simulación de entrenamiento:** Similar a `ProcessingPipeline.jsx`, se usarán `setInterval` para progreso y `setTimeout` para completar, con cleanup en `useEffect`. No se permiten ejecuciones simultáneas.
- **Distribución fija 70/15/15:** Se muestra visualmente (entrenamiento 70%, validación 15%, prueba 15%) sin controles editables. Siempre suma 100%.
- **Matriz de confusión:** Componente visual con TP, TN, FP, FN y clase positiva identificada. Las métricas (Accuracy, Precision, Recall, F1) son coherentes con los valores de la matriz. ROC-AUC proviene de datos sintéticos de puntuaciones separados.
- **Historial diferenciado:** Las ejecuciones precargadas se marcan como "Datos precargados" y las de la sesión actual como "Simulación de sesión", con badges distintos.
- **Gráficos de resultados:** Recharts con `BarChart` para comparar métricas y `BarChart` agrupado para comparar modelos.

### Proposed Changes

**Nuevo módulo:** `src/features/admin/training/`

**Archivos nuevos:**
- `TrainingModule.jsx` — contenedor principal con tabs, `PageHeader` y `DemoNotice`.
- `demo/training-demo.js` — datos ficticios (datasets, modelos, parámetros, métricas, matriz de confusión, historial).
- `config/TrainingConfig.jsx` — formulario de configuración con selects y campos de parámetros.
- `execution/TrainingExecution.jsx` — simulación de entrenamiento con estados y progreso.
- `results/TrainingResults.jsx` — tarjetas y gráficos de métricas sintéticas.
- `results/MetricsCards.jsx` — tarjetas de métricas individuales.
- `results/MetricsChart.jsx` — gráfico de barras de métricas.
- `results/ModelComparisonChart.jsx` — gráfico de comparación entre modelos.
- `results/ConfusionMatrix.jsx` — matriz de confusión visual con TP, TN, FP, FN.
- `history/TrainingHistory.jsx` — tabla de ejecuciones recientes.

**Archivo modificado:**
- `src/App.jsx` — reemplazar `ModulePlaceholder` por `TrainingModule` lazy-loaded en `/admin/training`.

### Data Models / Contracts

**training-demo.js exports:**
```js
export const demoDatasets = [
  { id: 'integrated', name: 'Dataset integrado (demo)', records: 12480, variables: 28 },
  { id: 'municipal', name: 'Dataset municipal (demo)', records: 4500, variables: 15 },
]

export const modelTypes = [
  { id: 'logistic-regression', name: 'Regresión Logística', 
    params: [
      { key: 'learning_rate', label: 'Tasa de aprendizaje', default: 0.01, min: 0.001, max: 0.1, step: 0.001 },
      { key: 'regularization', label: 'Regularización', default: 0.001, min: 0.0001, max: 1.0, step: 0.0001 },
    ] },
  { id: 'decision-tree', name: 'Árbol de Decisión', 
    params: [
      { key: 'max_depth', label: 'Profundidad máxima', default: 5, min: 1, max: 20, step: 1 },
      { key: 'min_samples_split', label: 'Mín. muestras para dividir', default: 2, min: 2, max: 100, step: 1 },
    ] },
]

export const dataSplit = { train: 70, validation: 15, test: 15 }

export const metricResults = {
  'logistic-regression': { 
    accuracy: 0.82, precision: 0.79, recall: 0.76, f1: 0.77, auc: 0.85,
    confusionMatrix: { tp: 312, tn: 340, fp: 88, fn: 106 },
    positiveClass: 'Riesgo de mortalidad evitable (sí)',
  },
  'decision-tree': { 
    accuracy: 0.80, precision: 0.77, recall: 0.78, f1: 0.77, auc: 0.83,
    confusionMatrix: { tp: 318, tn: 332, fp: 96, fn: 98 },
    positiveClass: 'Riesgo de mortalidad evitable (sí)',
  },
}

// Ejecuciones precargadas (ficticias) vs sesiones actuales
export const trainingHistory = [
  { id: 1, date: '2025-11-10T14:30:00', model: 'logistic-regression', dataset: 'integrated', 
    split: '70/15/15', status: 'completed', accuracy: 0.82, source: 'preloaded' },
  { id: 2, date: '2025-11-09T10:15:00', model: 'decision-tree', dataset: 'municipal', 
    split: '70/15/15', status: 'completed', accuracy: 0.80, source: 'preloaded' },
  { id: 3, date: '2025-11-08T16:45:00', model: 'logistic-regression', dataset: 'integrated', 
    split: '70/15/15', status: 'error', accuracy: null, source: 'preloaded' },
]
```

### Architecture Diagram

``` mermaid
graph LR
  A[App.jsx /admin/training] --> B[TrainingModule.jsx]
  B --> C[Tabs: Config / Ejecución / Resultados / Historial]
  C --> D[TrainingConfig.jsx]
  C --> E[TrainingExecution.jsx]
  C --> F[TrainingResults.jsx]
  C --> G[TrainingHistory.jsx]
  D --> H[demo/training-demo.js]
  E --> H
  F --> I[MetricsCards.jsx]
  F --> J[MetricsChart.jsx]
  F --> K[ModelComparisonChart.jsx]
  F --> L[ConfusionMatrix.jsx]
  G --> H
  H --> M[Datos ficticios: datasets, modelos, métricas, matriz de confusión, historial]
```

### Risks
- **Confusión con entrenamiento real:** Se mitigará con `DemoNotice`, badges "Simulación" y textos claros en cada sección.
- **Timers no limpiados:** Se usará `useRef` + `useEffect` cleanup como en `ProcessingPipeline.jsx`.
- **Resultados que parezcan oficiales:** Las métricas se marcarán como "Datos sintéticos de demostración" y no se presentará un modelo como superior.

# Delivery Steps

### ✓ Step 1: Crear estructura del módulo y datos de demo
Se crea la carpeta `src/features/admin/training/` con el archivo de datos ficticios y el componente principal con tabs.
- Crear `demo/training-demo.js` con datasets, modelos con parámetros detallados (learning_rate, regularization, max_depth, min_samples_split), distribución 70/15/15, métricas con matriz de confusión coherente, y historial ficticio con campo `source` (preloaded/session).
- Crear `TrainingModule.jsx` con `PageHeader`, `DemoNotice`, navegación por tabs (Configuración, Ejecución, Resultados, Historial) siguiendo el patrón de `DataModule.jsx`.
- Actualizar `App.jsx`: importar lazy `TrainingModule` y reemplazar `ModulePlaceholder` en `/admin/training`.
- Verificar que la ruta `/admin/training` muestre el módulo con tabs vacíos.

### ✓ Step 2: Implementar Configuración del entrenamiento
Formulario de selección de dataset, modelo y parámetros en la tab Configuración.
- Crear `config/TrainingConfig.jsx` con:
  - `Select` para dataset (de `demoDatasets`).
  - `Select` para tipo de modelo (de `modelTypes`).
  - Visualización fija de distribución 70/15/15 (entrenamiento, validación, prueba) con barras o indicadores visuales. Sin controles editables.
  - Campos de parámetros dinámicos según modelo: learning_rate + regularization para Regresión Logística; max_depth + min_samples_split para Árbol de Decisión. Cada campo tiene valores predeterminados y validación de rango (min/max/step).
  - Botón "Iniciar entrenamiento" que cambia a la tab Ejecución.
- Estado local con `useState` para almacenar la configuración seleccionada y pasarla a la ejecución.

### ✓ Step 3: Implementar Ejecución simulada con estados y progreso
Simulación de entrenamiento con estados animados y cleanup de timers.
- Crear `execution/TrainingExecution.jsx` con:
  - Estados: pendiente → ejecutando → completado / error.
  - Barra de progreso animada con `setInterval` (~8-12 seg duración).
  - Mensajes de estado claros indicando que es una simulación.
  - `useRef` + `useEffect` para cleanup de timers (patrón de `ProcessingPipeline.jsx`).
  - Badge "Simulación de demostración" visible.
  - Bloqueo de ejecuciones simultáneas (botón deshabilitado mientras ejecuta).
  - Al completar, cambiar automáticamente a la tab Resultados.
  - Recepción de configuración por props para mostrar qué modelo se está "entrenando".
  - Al finalizar, permitir reiniciar la simulación.

### ✓ Step 4: Implementar Resultados con métricas, gráficos y matriz de confusión
Tarjetas, gráficos y matriz de confusión con métricas sintéticas de clasificación.
- Crear `results/MetricsCards.jsx`: tarjetas de Accuracy, Precision, Recall, F1-score y ROC-AUC usando `Card` personalizado.
- Crear `results/MetricsChart.jsx`: gráfico de barras con Recharts (`BarChart`) mostrando las 5 métricas del modelo entrenado.
- Crear `results/ModelComparisonChart.jsx`: gráfico de barras agrupadas comparando ambos modelos (Regresión Logística vs Árbol de Decisión) en las mismas métricas.
- Crear `results/ConfusionMatrix.jsx`: matriz visual 2x2 con TP, TN, FP, FN, colores diferenciados, y la clase positiva identificada. Los valores son coherentes con Accuracy, Precision, Recall y F1.
- Crear `results/TrainingResults.jsx`: contenedor que orquesta tarjetas + gráficos + matriz, recibe el modelo seleccionado por props y consulta `metricResults` de demo.
- Todos los gráficos marcados como "Datos sintéticos de demostración".
- Permitir consultar resultados de ambos modelos sin presentar uno como superior.

### ✓ Step 5: Implementar Historial breve de ejecuciones
Lista de ejecuciones simuladas recientes dentro del módulo.
- Crear `history/TrainingHistory.jsx` con:
  - Tabla o lista de `Card` mostrando: fecha/hora, modelo, dataset, distribución 70/15/15, estado (completado/error) y métrica principal.
  - Datos de `trainingHistory` de `training-demo.js`.
  - Badge "Datos precargados" para ejecuciones ficticias y "Simulación de sesión" para las nuevas.
  - Al iniciar un entrenamiento, la nueva ejecución se agrega al historial con `source: 'session'` (estado local del módulo).
  - Texto indicando que no sustituye el módulo de Historial general.
- Integrar en la tab Historial del `TrainingModule.jsx`.

### ✓ Step 6: Integración final y verificación
Conectar todas las tabs, verificar flujo completo y responsive.
- Verificar el flujo completo: Config → Ejecución → Resultados → Historial.
- Asegurar que la configuración se pasa correctamente entre tabs (estado en `TrainingModule.jsx`).
- Verificar responsive en mobile y desktop.
- Confirmar que todos los timers se limpian correctamente.
- Verificar que no se alteran otras rutas ni módulos.
- Revisar que todos los textos indiquen claramente que es una simulación.
- Validar coherencia entre matriz de confusión y métricas calculadas.