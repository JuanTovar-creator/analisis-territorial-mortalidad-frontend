---
sessionId: session-261115-012645-nf2a
---

# Requirements

### Overview
Implementación del módulo **Evaluación y publicación de modelos** en el panel administrativo. Permite evaluar modelos entrenados (con métricas sintéticas), comparar modelos, seleccionar un candidato y simular su publicación. Todo el contenido es de demostración y se marca como tal.

### Scope

**In Scope:**
- Evaluación de modelos: visualización de métricas (Accuracy, Precision, Recall, F1-score, ROC-AUC), matrices de confusión y gráficos comparativos para Regresión Logística y Árbol de Decisión.
- Comparación y selección: comparar ambos modelos con las mismas métricas y el mismo conjunto de prueba; permitir seleccionar un modelo candidato para publicación sin declarar uno como superior.
- Publicación simulada: interfaz de revisión del modelo seleccionado con nombre, versión demo, dataset, fecha y métricas; simulación de publicación con estados (pendiente, publicando, publicado, error); visualización del modelo publicado en la sesión.
- Historial de publicaciones: registros ficticios de publicaciones anteriores; diferenciación entre registros precargados y publicaciones de sesión; historial en estado local sin persistencia.
- Reutilización de componentes del módulo Entrenamiento (MetricsCards, MetricsChart, ModelComparisonChart, ConfusionMatrix).
- Datos de demo separados de la lógica visual (API-ready).
- Integración en la ruta `/admin/evaluation` sin alterar otras rutas.

**Out of Scope:**
- Backend real, entrenamiento real, predicciones reales o llamadas a endpoints.
- Publicaciones reales o almacenamiento en servidor.
- Historial general del sistema (módulo independiente).
- Commits, push o merges automáticos.
- Evaluación automatizada que declare un modelo como superior.

### Functional Requirements
1. **Evaluación:** El usuario visualiza los modelos disponibles (Regresión Logística y Árbol de Decisión) con sus métricas, matrices de confusión y gráficos comparativos. Las métricas son sintéticas y están marcadas como tales. Se aclara que representan una demostración de evaluación final sobre el 15% de prueba, respetando la distribución 70/15/15, sin afirmar que se ejecutó una evaluación real. La interfaz está preparada para recibir resultados reales de la API.
2. **Comparación y selección:** El usuario compara ambos modelos lado a lado con las mismas métricas y el mismo conjunto de prueba. Puede seleccionar un modelo candidato para publicación. No se declara automáticamente un modelo como superior. Las métricas reflejan una demostración de evaluación final sobre el 15% de prueba.
3. **Publicación:** El usuario revisa el modelo seleccionado (nombre, versión demo, dataset, fecha, métricas) antes de publicarlo. Al iniciar la publicación simulada, se muestran estados: pendiente → publicando → publicado / error. Se visualiza cuál es el modelo publicado actualmente en la sesión. No se realizan publicaciones reales. Solo un modelo puede estar publicado como activo en la sesión. Si se publica otro modelo o versión, reemplaza al anterior como activo, conservando el registro de ambas publicaciones en el historial. Se evita publicar repetidamente el mismo modelo y versión si ya están activos en la sesión, pero se permite publicar una versión diferente.
4. **Historial de publicaciones:** El usuario consulta registros ficticios de publicaciones anteriores. Se diferencian los registros precargados de las publicaciones simuladas durante la sesión. El historial se mantiene en estado local.

### Non-Functional Requirements
- Diseño responsive (mobile-first con Tailwind).
- Limpieza correcta de timers y efectos en desmontaje.
- Componentes que reciben datos por props (API-ready).
- Reutilización de componentes del módulo Entrenamiento para métricas y gráficos.
- Separación de datos demo de componentes visuales.
- No duplicar innecesariamente la lógica de métricas.
- Reutilización de componentes shadcn/ui existentes.

# Technical Design

### Current Implementation
- **Rutas:** `App.jsx` define `/admin/evaluation` con un `ModulePlaceholder`. Se reemplazará por un `EvaluationModule` lazy-loaded.
- **Navegación:** `navigation.js` ya incluye "Evaluación" en el menú admin con ícono `FileBarChart`.
- **Módulo Entrenamiento (reutilizable):** `src/features/admin/training/` contiene:
  - `results/MetricsCards.jsx` — tarjetas de métricas (recibe `metrics` por props).
  - `results/MetricsChart.jsx` — gráfico de barras de métricas (recibe `metrics` por props).
  - `results/ModelComparisonChart.jsx` — gráfico de comparación entre modelos (lee directamente de `training-demo.js`).
  - `results/ConfusionMatrix.jsx` — matriz 2x2 visual (recibe `confusionMatrix` y `positiveClass` por props).
  - `demo/training-demo.js` — `metricResults`, `modelTypes`, `demoDatasets`.
- **Patrón de módulos:** `DataModule.jsx` y `TrainingModule.jsx` usan tabs, `PageHeader`, `DemoNotice`, datos de demo en `demo/*.js`, y sub-componentes en carpetas.
- **Simulación:** `TrainingExecution.jsx` usa `setInterval`/`setTimeout`, `useRef` para cleanup, estados de progreso.
- **Historial:** `TrainingHistory.jsx` usa tabla con badges diferenciados (preloaded/session).
- **UI:** Componentes shadcn/ui: `Card`, `Badge`, `Button`, `Select`, `Field`, `Alert`, `Skeleton`.

### Key Decisions
- **Tabs para organizar el módulo:** Se usarán 4 tabs (Evaluación, Comparación, Publicación, Historial) siguiendo el patrón de `DataModule` y `TrainingModule`.
- **Reutilización de componentes de métricas:** Los componentes `MetricsCards`, `MetricsChart`, `ModelComparisonChart` y `ConfusionMatrix` del módulo Entrenamiento se importarán directamente. No se duplicarán.
- **ModelComparisonChart necesita refactorización leve:** Actualmente lee directamente de `training-demo.js`. Se mantendrá así para evitar cambios en el módulo Entrenamiento, pero se creará una versión que reciba datos por props para el módulo Evaluación si se necesita personalización. En este caso, se reutilizará directamente ya que los datos son los mismos.
- **Datos de demo compartidos:** El archivo `demo/training-demo.js` ya contiene `metricResults`, `modelTypes` y `demoDatasets`. Se reutilizarán directamente. Se creará `demo/evaluation-demo.js` solo para datos exclusivos de evaluación (historial de publicaciones, modelo publicado actual).
- **Simulación de publicación:** Similar a `TrainingExecution.jsx`, se usarán `setTimeout` para simular el proceso de publicación (~5-8 seg), con cleanup en `useEffect`. Estados: pendiente → publicando → publicado / error.
- **Historial de publicaciones:** Patrón idéntico a `TrainingHistory.jsx` con badges diferenciados (preloaded/session) y tabla de registros.
- **Selección de modelo candidato:** Estado local en `EvaluationModule.jsx` que almacena el modelo seleccionado. Se pasa a la tab de Publicación.
- **Modelo publicado en sesión:** Estado local que almacena el modelo publicado actualmente. Solo un modelo puede estar activo. Si se publica otro, reemplaza al anterior como activo, pero ambos quedan en el historial. Se visualiza en la tab de Publicación con badge "Publicado en esta sesión".
- **Prevención de duplicados:** Antes de publicar, se verifica si el mismo modelo y versión ya están activos. Si es así, se bloquea la publicación y se muestra un mensaje. Se permite publicar una versión diferente del mismo modelo.

### Proposed Changes

**Nuevo módulo:** `src/features/admin/evaluation/`

**Archivos nuevos:**
- `EvaluationModule.jsx` — contenedor principal con tabs, `PageHeader`, `DemoNotice`, estado de modelo seleccionado y modelo publicado.
- `demo/evaluation-demo.js` — datos ficticios exclusivos de evaluación (historial de publicaciones precargadas, versión demo del modelo).
- `evaluation/EvaluationView.jsx` — visualización de métricas de ambos modelos usando componentes reutilizados del módulo Entrenamiento.
- `comparison/ModelComparison.jsx` — comparación lado a lado de ambos modelos con métricas, gráficos y selección de candidato.
- `publication/ModelPublication.jsx` — revisión del modelo seleccionado, simulación de publicación con estados, y visualización del modelo publicado.
- `publication/PublicationHistory.jsx` — tabla de publicaciones anteriores con badges diferenciados.

**Archivos modificados:**
- `src/App.jsx` — reemplazar `ModulePlaceholder` por `EvaluationModule` lazy-loaded en `/admin/evaluation`.

**Archivos reutilizados (sin modificación):**
- `src/features/admin/training/results/MetricsCards.jsx`
- `src/features/admin/training/results/MetricsChart.jsx`
- `src/features/admin/training/results/ModelComparisonChart.jsx`
- `src/features/admin/training/results/ConfusionMatrix.jsx`
- `src/features/admin/training/demo/training-demo.js`

### Data Models / Contracts

**evaluation-demo.js exports:**
```js
export const demoVersion = 'v0.1.0-demo'

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
```

**Estado de EvaluationModule.jsx:**
```js
const [activeTab, setActiveTab] = useState('evaluation')
const [selectedModel, setSelectedModel] = useState(null) // modelo candidato para publicación
const [publishedModel, setPublishedModel] = useState(null) // modelo publicado en la sesión
const [sessionPublications, setSessionPublications] = useState([]) // historial de sesión
```

### Architecture Diagram

``` mermaid
graph LR
  A[App.jsx /admin/evaluation] --> B[EvaluationModule.jsx]
  B --> C[Tabs: Evaluación / Comparación / Publicación / Historial]
  C --> D[EvaluationView.jsx]
  C --> E[ModelComparison.jsx]
  C --> F[ModelPublication.jsx]
  C --> G[PublicationHistory.jsx]
  D --> H[MetricsCards.jsx training/]
  D --> I[MetricsChart.jsx training/]
  D --> J[ConfusionMatrix.jsx training/]
  E --> K[ModelComparisonChart.jsx training/]
  E --> H
  F --> L[demo/evaluation-demo.js]
  G --> L
  H --> M[training-demo.js metricResults]
  I --> M
  J --> M
  K --> M
  L --> N[Datos ficticios: historial de publicaciones, versión demo]
```

### Risks
- **Confusión con publicación real:** Se mitigará con `DemoNotice`, badges "Simulación" y textos claros en cada sección.
- **Timers no limpiados en publicación:** Se usará `useRef` + `useEffect` cleanup como en `TrainingExecution.jsx`.
- **Duplicación de componentes de métricas:** Se evitará importando directamente los componentes del módulo Entrenamiento.
- **ModelComparisonChart acoplado a training-demo.js:** Se aceptará este acoplamiento ya que los datos son los mismos y evita cambios en el módulo Entrenamiento.
- **Resultados que parezcan oficiales:** Las métricas se marcarán como "Datos sintéticos de demostración" y no se presentará un modelo como superior.

# Delivery Steps

### ✓ Step 1: Crear estructura del módulo y datos de demo
Se crea la carpeta `src/features/admin/evaluation/` con el archivo de datos ficticios y el componente principal con tabs.
- Crear `demo/evaluation-demo.js` con `demoVersion` y `publicationHistory` (registros precargados ficticios con campo `source: 'preloaded'`).
- Crear `EvaluationModule.jsx` con `PageHeader`, `DemoNotice`, navegación por tabs (Evaluación, Comparación, Publicación, Historial) siguiendo el patrón de `TrainingModule.jsx`.
- Estado local para `selectedModel` (candidato), `publishedModel` (publicado en sesión) y `sessionPublications` (historial de sesión).
- Actualizar `App.jsx`: importar lazy `EvaluationModule` y reemplazar `ModulePlaceholder` en `/admin/evaluation`.
- Verificar que la ruta `/admin/evaluation` muestre el módulo con tabs vacíos.

### ✓ Step 2: Implementar Evaluación de modelos
Visualización de métricas de ambos modelos usando componentes reutilizados del módulo Entrenamiento.
- Crear `evaluation/EvaluationView.jsx` con:
  - Selector de modelo (`Select`) para consultar métricas de Regresión Logística o Árbol de Decisión.
  - Importar y reutilizar `MetricsCards` del módulo Entrenamiento, pasando `metrics` por props.
  - Importar y reutilizar `MetricsChart` del módulo Entrenamiento, pasando `metrics` por props.
  - Importar y reutilizar `ConfusionMatrix` del módulo Entrenamiento, pasando `confusionMatrix` y `positiveClass` por props.
  - Datos de `metricResults` de `training-demo.js` (sin duplicar).
  - Badge "Datos sintéticos de demostración" visible.
  - Texto aclarando que las métricas representan una "demostración de evaluación final sobre el 15% de prueba", respetando la distribución 70/15/15, sin afirmar que se ejecutó una evaluación real.
  - Texto indicando que la interfaz está preparada para recibir resultados reales de la API.

### ✓ Step 3: Implementar Comparación y selección de modelo
Comparación lado a lado de ambos modelos con selección de candidato.
- Crear `comparison/ModelComparison.jsx` con:
  - Importar y reutilizar `ModelComparisonChart` del módulo Entrenamiento (gráfico de barras agrupadas).
  - Importar y reutilizar `MetricsCards` para mostrar métricas de ambos modelos lado a lado.
  - Tabla o cards comparativas mostrando diferencias entre métricas de ambos modelos.
  - Botón "Seleccionar como candidato" para cada modelo.
  - Al seleccionar, actualizar `selectedModel` en el estado de `EvaluationModule.jsx` y cambiar a la tab Publicación.
  - No declarar automáticamente un modelo como superior.
  - Badge "Datos sintéticos" visible.
  - Texto aclarando que las métricas reflejan una demostración de evaluación final sobre el 15% de prueba, respetando la distribución 70/15/15.

### ✓ Step 4: Implementar Publicación simulada del modelo
Revisión del modelo seleccionado y simulación de publicación con estados.
- Crear `publication/ModelPublication.jsx` con:
  - Vista de revisión del modelo seleccionado: nombre, versión demo (de `evaluation-demo.js`), dataset, fecha, métricas (usando `MetricsCards` reutilizado).
  - **Selector de versión:** permitir al usuario elegir una versión diferente (ej. `v0.1.0-demo`, `v0.2.0-demo`) para publicar.
  - **Prevención de duplicados:** antes de iniciar la publicación, verificar si el mismo modelo y versión ya están activos en la sesión (`publishedModel`). Si es así, bloquear el botón y mostrar un mensaje: "Este modelo y versión ya están publicados en la sesión". Se permite publicar una versión diferente.
  - **Único modelo activo:** solo un modelo puede estar publicado como activo. Si se publica otro modelo o versión, reemplaza al anterior como activo en `publishedModel`, pero ambos quedan registrados en `sessionPublications` con `source: 'session'`.
  - Estados de publicación: pendiente → publicando → publicado / error.
  - Simulación con `setTimeout` (~5-8 seg) y `useRef` + `useEffect` cleanup (patrón de `TrainingExecution.jsx`).
  - Barra de progreso durante la publicación.
  - Badge "Simulación de demostración" visible.
  - Al completar, actualizar `publishedModel` en el estado del módulo (reemplazando al anterior) y agregar la nueva publicación a `sessionPublications`.
  - Visualización del modelo publicado actualmente en la sesión con badge "Publicado en esta sesión".
  - Bloqueo de publicaciones simultáneas.
  - Permitir reiniciar la publicación.

### ✓ Step 5: Implementar Historial de publicaciones
Tabla de publicaciones anteriores con badges diferenciados.
- Crear `publication/PublicationHistory.jsx` con:
  - Tabla mostrando: fecha/hora, modelo, versión, dataset, estado (publicado/error) y métrica principal.
  - Datos de `publicationHistory` de `evaluation-demo.js` (precargados).
  - Badge "Datos precargados" para registros ficticios y "Publicación de sesión" para las nuevas.
  - Al publicar un modelo, la nueva publicación se agrega al historial con `source: 'session'`.
  - Texto indicando que no sustituye el módulo de Historial general.
  - Patrón visual idéntico a `TrainingHistory.jsx` para consistencia.
- Integrar en la tab Historial del `EvaluationModule.jsx`.

### ✓ Step 6: Integración final y verificación
Conectar todas las tabs, verificar flujo completo y responsive.
- Verificar el flujo completo: Evaluación → Comparación → Publicación → Historial.
- Asegurar que `selectedModel` se pasa correctamente de Comparación a Publicación.
- Verificar que `publishedModel` y `sessionPublications` se actualizan correctamente.
- Verificar responsive en mobile y desktop.
- Confirmar que todos los timers se limpian correctamente.
- Verificar que no se alteran otras rutas ni módulos.
- Revisar que todos los textos indiquen claramente que es una simulación.
- Validar que los componentes de métricas se reutilizan correctamente sin duplicación.