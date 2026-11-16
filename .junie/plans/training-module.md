---
sessionId: session-261115-012645-nf2a
---

# Plan de refactorización: Ajuste de responsabilidades frontend/backend

## Requirements

### Overview
Reorganizar los módulos existentes (Datos, Entrenamiento, Evaluación), el Dashboard del administrador y las vistas del cliente para alinear las responsabilidades del frontend con su rol real: **interfaz, interacciones y visualización**. El backend será responsable de procesamiento, entrenamiento, evaluación, selección y publicación de modelos. El plan identifica qué conservar, simplificar o eliminar, y prepara la estructura para integración con API sin modificar archivos aún.

**Precisiones adicionales:**
1. **Separación explícita del modo demo del modo real:** Cuando exista integración con la API, los errores del backend NO se reemplazarán silenciosamente con datos ficticios. El usuario verá el error real.
2. **Distribución configurable:** La distribución 70/15/15 se muestra en la demo, pero en producción se visualizará la configuración real suministrada por el backend, sin imponer valores desde el frontend.

### Scope

**In Scope:**
- Identificar lógica de negocio que debe trasladarse al backend.
- Convertir el módulo Entrenamiento en un módulo de consulta (sin iniciar entrenamientos manualmente).
- Eliminar controles de selección manual de modelo candidato y publicación manual.
- Preparar estructura de servicios API-ready: `api.js` solo con configuración HTTP, servicios por módulo con sus consultas.
- Separar explícitamente el modo demo del modo real sin fallback silencioso.
- Hacer que la distribución de datos sea configurable desde el backend.
- Revisar Dashboard del administrador y vistas del cliente para prepararlos para recibir datos del backend.
- Ajustar roles: administrador visualiza resultados del backend; usuario/cliente ve solo el modelo indicado.
- Conservar componentes visuales reutilizables.
- Mantener datos ficticios mientras no exista integración real.

**Out of Scope:**
- Implementar backend o endpoints.
- Refactorizaciones masivas o abstracciones innecesarias.
- Eliminar funcionalidades visuales útiles.
- Modificar diseño actual o comportamiento responsive.
- Commits, push, merges ni modificaciones en GitHub.

### Functional Requirements (después de la refactorización)

**Administrador:**
1. **Dashboard:** Visualiza indicadores generales (datasets, procesamientos, entrenamientos, modelo publicado) suministrados por el backend. Datos demo mientras no exista API.
2. **Datos:** Carga archivos CSV reales (validación en navegador). Visualiza resultados del pipeline de procesamiento suministrados por el backend. Consulta el dataset integrado con filtros y paginación.
3. **Entrenamiento:** Visualiza la configuración utilizada, progreso, métricas, resultados e historial de entrenamientos suministrados por el backend. No configura parámetros ni inicia entrenamientos manualmente. Las simulaciones se conservan solo como demostración visual.
4. **Evaluación:** Visualiza métricas de ambos modelos suministradas por el backend. Compara modelos lado a lado. Ve cuál es el modelo indicado por el backend. No selecciona manualmente candidatos ni publica modelos.
5. **Publicación:** Visualiza el modelo publicado actualmente (suministrado por el backend). Historial de publicaciones reales.

**Usuario/Cliente:**
1. Visualiza el modelo indicado por el backend y sus predicciones.
2. No puede cambiar de modelo ni comparar los dos algoritmos.
3. Indicadores, gráficos y resultados preparados para recibir información del backend.

## Technical Design

### Análisis de la implementación actual

**Módulo Datos (`src/features/admin/data/`):**
- `FileUploadZone.jsx` / `FileUploadList.jsx`: Validación de archivos CSV en el navegador. ✅ **Mantener** — es lógica de presentación legítima.
- `EDAView.jsx`, `EDAChart.jsx`, `EDAIndicators.jsx`, `EDASummaryTable.jsx`, `EDADataQuality.jsx`: Visualización de análisis exploratorio. ✅ **Mantener** — son componentes visuales puros.
- `ProcessingPipeline.jsx`: Simula 5 etapas de procesamiento con timers. ⚠️ **Simplificar** — en producción, el backend ejecuta el pipeline y notifica el progreso. Mantener la simulación para demo, pero preparar para recibir estados reales.
- `DatasetView.jsx`, `IntegratedDatasetTable.jsx`, `DatasetToolbar.jsx`: Tabla con filtrado, ordenación y paginación en el cliente. ⚠️ **Mantener para demo, preparar para API** — con datasets grandes, el backend debe filtrar/ordenar/paginar.
- `DatasetView.jsx` (export CSV): Genera CSV en el navegador. ⚠️ **Mantener para demo** — en producción, el backend genera el archivo.
- `demo/data-demo.js`: `seededRandom` genera 45 municipios ficticios. ✅ **Mantener** — el usuario solicitó conservarlo.

**Módulo Entrenamiento (`src/features/admin/training/`):**
- `TrainingConfig.jsx`: Formulario de configuración con selects y campos editables. ⚠️ **Convertir a vista de solo lectura** — el backend configura y ejecuta los modelos. El admin visualiza la configuración utilizada, no la modifica.
- `TrainingExecution.jsx`: Simula entrenamiento con timers y 15% de probabilidad de error aleatorio. ⚠️ **Simplificar** — en producción, el backend ejecuta el entrenamiento y devuelve el estado. Mantener la simulación solo como demostración visual cuando no hay datos reales.
- `TrainingResults.jsx`, `MetricsCards.jsx`, `MetricsChart.jsx`, `ModelComparisonChart.jsx`, `ConfusionMatrix.jsx`: Visualización de métricas. ✅ **Mantener** — son componentes visuales puros, API-ready.
- `TrainingHistory.jsx`: Historial en estado local. ⚠️ **Preparar para API** — en producción, el backend persiste y devuelve el historial.
- `demo/training-demo.js`: Datos ficticios de entrenamiento. ✅ **Mantener** mientras no exista API.

**Dashboard del administrador (`src/features/admin/`):**
- `AdminDashboard.jsx`: Muestra indicadores generales (datasets, procesamientos, entrenamientos, modelo publicado) y actividad reciente. ⚠️ **Preparar para API** — los datos actuales (`admin-dashboard.js`) son estáticos. Preparar para recibir indicadores del backend.
- `demo/admin-dashboard.js`: Datos ficticios del dashboard. ✅ **Mantener** mientras no exista API.

**Vistas del cliente (`src/features/client/`):**
- `ClientDashboard.jsx`: Muestra indicadores, filtros, gráfico de barras, mapa territorial (pendiente) y resumen de prioridades (pendiente). ⚠️ **Preparar para API** — los datos actuales (`client-dashboard.js`) son estáticos. Preparar para recibir indicadores y resultados del modelo indicado por el backend.
- `demo/client-dashboard.js`: Datos ficticios del cliente. ✅ **Mantener** mientras no exista API.

**Módulo Evaluación (`src/features/admin/evaluation/`):**
- `EvaluationView.jsx`: Visualización de métricas por modelo. ✅ **Mantener** — componente visual puro.
- `ModelComparison.jsx`: Comparación lado a lado con **selección manual de candidato**. ❌ **Eliminar la selección manual** — el backend determina el modelo indicado, no el usuario.
- `ModelPublication.jsx`: **Publicación manual simulada** con estados, prevención de duplicados, y único modelo activo. ❌ **Eliminar la publicación manual** — el backend gestiona la publicación. Reemplazar por visualización del modelo publicado actualmente.
- `PublicationHistory.jsx`: Historial de publicaciones en estado local. ⚠️ **Preparar para API** — en producción, el backend persiste y devuelve el historial.
- `demo/evaluation-demo.js`: Datos ficticios de publicación. ✅ **Mantener** mientras no exista API.

**Componentes reutilizables:**
- `TabNavigation.jsx`, `DemoBadge.jsx`, `PageHeader.jsx`, `DemoNotice`, `MetricCard`, `StatePanel`: ✅ **Mantener** — son componentes de presentación puros.

### Key Decisions

1. **Eliminar selección manual de modelo candidato:** El backend determina el modelo indicado. El frontend solo lo visualiza. Se elimina el botón "Seleccionar como candidato" en `ModelComparison.jsx` y el flujo de selección en `EvaluationModule.jsx`.

2. **Eliminar publicación manual:** El backend gestiona la publicación. Se elimina `ModelPublication.jsx` (simulación de publicación) y se reemplaza por una vista de solo lectura que muestra el modelo publicado actualmente.

3. **Convertir Entrenamiento a módulo de consulta:** El backend configura y ejecuta los modelos. Se convierte `TrainingConfig.jsx` en una vista de solo lectura que muestra la configuración utilizada. Se elimina el botón "Iniciar entrenamiento simulado" y el flujo de inicio manual. Las simulaciones se conservan solo como demostración visual cuando no hay datos reales.

4. **Separación explícita del modo demo del modo real:** Se creará un archivo de configuración `src/config/app-config.js` con una variable `IS_DEMO_MODE`. Cuando `IS_DEMO_MODE` es `true`, los servicios devuelven datos de demo. Cuando es `false`, los servicios llaman a la API. **Los errores del backend NO se reemplazan con datos demo** — se propagan al componente para mostrar un estado de error al usuario.

5. **Distribución configurable desde el backend:** La distribución 70/15/15 se muestra solo en la demo. En producción, el backend devuelve la distribución real utilizada. El frontend la visualiza sin imponer valores. Se elimina `dataSplit` como valor fijo en el frontend y se recibe como parte de la configuración del entrenamiento.

6. **Estructura de servicios API-ready:** Se creará una carpeta `src/services/` con:
   - `api.js`: **Únicamente** configuración compartida del cliente HTTP (base URL, headers, interceptores). Sin funciones de negocio.
   - `data.js`, `training.js`, `evaluation.js`, `dashboard.js`: Servicios por módulo con sus respectivas consultas. Cada servicio devuelve datos de demo en modo demo, o llama a la API en modo real. Los errores se propagan sin fallback a datos ficticios.
   - No se inventan endpoints definitivos ni formatos de respuesta.

7. **Roles diferenciados:** El administrador ve ambos modelos y puede comparar. El cliente ve solo el modelo indicado. Se preparará la navegación y las vistas para respetar estos roles.

8. **Dashboard admin y cliente preparados para API:** Los indicadores actuales del Dashboard del administrador y las vistas del cliente se preparan para recibir datos del backend mediante los servicios, conservando los datos demo como fallback solo en modo demo.

### Proposed Changes

#### Paso 1: Eliminar selección manual de modelo candidato

**Archivos a modificar:**
- `src/features/admin/evaluation/comparison/ModelComparison.jsx`:
  - Eliminar los botones "Seleccionar como candidato" de ambos modelos.
  - Eliminar el callback `onSelectModel`.
  - Agregar un badge o indicador que muestre cuál es el modelo indicado por el backend (en demo, usar un valor fijo).
  - Actualizar el texto para aclarar que la selección la realiza el backend.

**Archivos a modificar:**
- `src/features/admin/evaluation/EvaluationModule.jsx`:
  - Eliminar el estado `selectedModel` y el handler `handleSelectModel`.
  - Eliminar la pasada de `onSelectModel` a `ModelComparison`.

#### Paso 2: Reemplazar publicación manual por vista de modelo publicado

**Archivos a eliminar:**
- `src/features/admin/evaluation/publication/ModelPublication.jsx` (simulación de publicación manual).

**Archivos nuevos:**
- `src/features/admin/evaluation/publication/PublishedModelView.jsx`:
  - Vista de solo lectura del modelo publicado actualmente.
  - Muestra: nombre del modelo, versión, dataset, fecha de publicación, métricas.
  - En demo, usa datos de `evaluation-demo.js`.
  - Preparado para recibir datos de la API.
  - Estados: cargando, error, sin modelo publicado.

**Archivos a modificar:**
- `src/features/admin/evaluation/EvaluationModule.jsx`:
  - Eliminar estados relacionados con publicación manual: `selectedModel`, `publishedModel`, `sessionPublications`.
  - Eliminar handlers: `handleSelectModel`, `handlePublicationComplete`, `handlePublicationError`, `handleResetPublication`.
  - Reemplazar `ModelPublication` por `PublishedModelView` en la tab Publicación.
  - Simplificar el estado del módulo.

#### Paso 2b: Convertir Entrenamiento a módulo de consulta

**Archivos a eliminar:**
- `src/features/admin/training/config/TrainingConfig.jsx` (formulario con campos editables y botón de inicio).

**Archivos nuevos:**
- `src/features/admin/training/config/TrainingConfigView.jsx`:
  - Vista de solo lectura de la configuración utilizada.
  - Muestra: dataset, modelo, distribución 70/15/15, parámetros.
  - En demo, usa datos de `training-demo.js`.
  - Preparado para recibir datos de la API.
  - Sin botón de inicio ni campos editables.
  - Badge "Simulación de demostración" visible.

**Archivos a modificar:**
- `src/features/admin/training/TrainingModule.jsx`:
  - Reemplazar `TrainingConfig` por `TrainingConfigView` en la tab Configuración.
  - Eliminar el estado `config` y el handler `handleStartExecution`.
  - Eliminar la transición automática de Configuración → Ejecución al iniciar.
  - Mantener las tabs de Ejecución, Resultados e Historial.
- `src/features/admin/training/execution/TrainingExecution.jsx`:
  - Simplificar para mostrar solo el estado del entrenamiento en curso (suministrado por el backend).
  - Mantener la simulación visual como demo cuando no hay datos reales.
  - Eliminar la dependencia de `config` pasada por props del formulario.

#### Paso 3: Crear configuración de modo demo/real y servicios API-ready

**Archivos nuevos:**
- `src/config/app-config.js`:
  - Variable `IS_DEMO_MODE` (por defecto `true` para la demo actual).
  - Variable `API_BASE_URL` (por defecto `''` — sin backend conectado).
  - Documentación clara: cuando `IS_DEMO_MODE` es `true`, los servicios devuelven datos de demo. Cuando es `false`, los servicios llaman a la API y los errores se propagan sin fallback a datos ficticios.

- `src/services/api.js`:
  - **Únicamente** configuración compartida del cliente HTTP.
  - Variables: `BASE_URL`, `TIMEOUT`.
  - Función: `request()` que envuelva `fetch` con headers y manejo de errores.
  - Sin funciones de negocio ni endpoints específicos.
  - En producción, se ajustará la configuración según el backend real.

- `src/services/training.js`:
  - `getTrainingConfig()` — en modo demo devuelve configuración de `training-demo.js` (sin `dataSplit` fijo; la distribución se recibe del backend en modo real). En modo real llama a la API.
  - `getTrainingStatus()` — devuelve estado del entrenamiento en curso.
  - `getTrainingResults(modelId)` — devuelve métricas de demo o de la API.
  - `getTrainingHistory()` — devuelve historial de demo o de la API.
  - **Los errores se propagan sin fallback a datos ficticios.**

- `src/services/evaluation.js`:
  - `getEvaluationMetrics()` — devuelve métricas de ambos modelos.
  - `getPublishedModel()` — devuelve el modelo publicado actual.
  - `getPublicationHistory()` — devuelve historial de publicaciones.
  - **Los errores se propagan sin fallback a datos ficticios.**

- `src/services/data.js`:
  - `getPipelineStatus()` — devuelve estado del pipeline.
  - `getDataset(filters)` — devuelve dataset filtrado.
  - `getEDAMetrics()` — devuelve métricas EDA.
  - **Los errores se propagan sin fallback a datos ficticios.**

- `src/services/dashboard.js`:
  - `getAdminOverview()` — devuelve indicadores generales del admin.
  - `getClientOverview()` — devuelve indicadores generales del cliente.
  - **Los errores se propagan sin fallback a datos ficticios.**

**Archivos a modificar:**
- `src/features/admin/training/TrainingModule.jsx`:
  - Importar datos de `services/training.js` en lugar de importar directamente de `demo/training-demo.js`.
  - Agregar estados de cargando y error.
- `src/features/admin/evaluation/EvaluationModule.jsx`:
  - Importar datos de `services/evaluation.js` en lugar de importar directamente de `demo/evaluation-demo.js`.
  - Agregar estados de cargando y error.
- `src/features/admin/data/DataModule.jsx`:
  - Importar datos de `services/data.js` en lugar de importar directamente de `demo/data-demo.js`.
- `src/features/admin/AdminDashboard.jsx`:
  - Importar datos de `services/dashboard.js` en lugar de importar directamente de `demo/admin-dashboard.js`.
  - Agregar estados de cargando y error.
- `src/features/client/ClientDashboard.jsx`:
  - Importar datos de `services/dashboard.js` en lugar de importar directamente de `demo/client-dashboard.js`.
  - Agregar estados de cargando y error.
- `src/features/admin/training/demo/training-demo.js`:
  - Eliminar `dataSplit` como valor fijo. La distribución se recibirá del backend en modo real.
  - En modo demo, la distribución se incluye en la configuración del entrenamiento como parte de los datos ficticios.

#### Paso 4: Preparar vistas de estado (cargando, error, vacío)

**Archivos a modificar:**
- `src/features/admin/training/results/TrainingResults.jsx`:
  - Agregar estados de cargando y error.
  - Usar `StatePanel` para estados vacíos.

- `src/features/admin/evaluation/evaluation/EvaluationView.jsx`:
  - Agregar estados de cargando y error.
  - Usar `StatePanel` para estados vacíos.

- `src/features/admin/evaluation/comparison/ModelComparison.jsx`:
  - Agregar estados de cargando y error.
  - Usar `StatePanel` para estados vacíos.

- `src/features/admin/AdminDashboard.jsx`:
  - Agregar estados de cargando y error en la carga de indicadores.
  - Usar `StatePanel` para cuando no hay datos.

- `src/features/client/ClientDashboard.jsx`:
  - Agregar estados de cargando y error en la carga de indicadores.
  - Usar `StatePanel` para cuando no hay datos.

#### Paso 5: Ajustar roles en navegación y vistas

**Archivos a modificar:**
- `src/config/navigation.js`:
  - Mantener las rutas de evaluación para el admin.
  - Preparar la navegación del cliente para mostrar solo el modelo indicado.

- `src/features/client/ClientDashboard.jsx`:
  - Preparar para mostrar el modelo indicado y sus predicciones.
  - No mostrar comparación de modelos ni selección.
  - Agregar sección de "Modelo activo" que muestre el modelo indicado por el backend.

### File Structure

**Archivos a crear:**
```
src/config/
  app-config.js       — configuración de modo demo/real (IS_DEMO_MODE, API_BASE_URL)
src/services/
  api.js              — configuración compartida del cliente HTTP (base URL, headers, request wrapper)
  training.js         — servicios del módulo Entrenamiento
  evaluation.js       — servicios del módulo Evaluación
  data.js             — servicios del módulo Datos
  dashboard.js        — servicios del Dashboard admin y cliente
src/features/admin/evaluation/publication/
  PublishedModelView.jsx  — vista de solo lectura del modelo publicado
src/features/admin/training/config/
  TrainingConfigView.jsx  — vista de solo lectura de configuración utilizada
```

**Archivos a eliminar:**
```
src/features/admin/evaluation/publication/ModelPublication.jsx
src/features/admin/training/config/TrainingConfig.jsx  — reemplazado por TrainingConfigView.jsx
```

**Archivos a modificar:**
```
src/features/admin/evaluation/EvaluationModule.jsx
src/features/admin/evaluation/comparison/ModelComparison.jsx
src/features/admin/evaluation/evaluation/EvaluationView.jsx
src/features/admin/evaluation/publication/PublicationHistory.jsx
src/features/admin/training/TrainingModule.jsx
src/features/admin/training/results/TrainingResults.jsx
src/features/admin/training/execution/TrainingExecution.jsx
src/features/admin/training/demo/training-demo.js  — eliminar dataSplit fijo
src/features/admin/data/DataModule.jsx
src/features/admin/AdminDashboard.jsx
src/features/admin/demo/admin-dashboard.js
src/features/client/ClientDashboard.jsx
src/features/client/demo/client-dashboard.js
src/config/navigation.js
```

### Architecture Diagram (después de la refactorización)

``` mermaid
graph LR
  A[App.jsx] --> B[AdminDashboard]
  A --> C[DataModule]
  A --> D[TrainingModule]
  A --> E[EvaluationModule]
  A --> F[ClientDashboard]
  B --> G[services/dashboard.js]
  C --> H[services/data.js]
  D --> I[services/training.js]
  E --> J[services/evaluation.js]
  F --> G
  G --> K[demo/admin-dashboard.js]
  G --> L[demo/client-dashboard.js]
  H --> M[demo/data-demo.js]
  I --> N[demo/training-demo.js]
  J --> O[demo/evaluation-demo.js]
  G --> P[api.js config HTTP]
  H --> P
  I --> P
  J --> P
  P --> Q[app-config.js IS_DEMO_MODE]
  D --> R[TrainingConfigView solo lectura]
  D --> S[TrainingExecution demo]
  E --> T[PublishedModelView solo lectura]
  E --> U[ModelComparison sin selección]
  Q -->|true| V[Datos demo]
  Q -->|false| W[API real, errores sin fallback]
```

### Risks

1. **Eliminar ModelPublication.jsx:** Se pierde la simulación de publicación. Sin embargo, esta simulación contradice la división de responsabilidades (el backend publica, no el frontend). El riesgo es mínimo ya que se reemplaza por una vista de solo lectura.

2. **Eliminar TrainingConfig.jsx y reemplazarlo por TrainingConfigView.jsx:** Se pierde la capacidad de configurar e iniciar entrenamientos manualmente. Sin embargo, esto es coherente con la división de responsabilidades (el backend configura y ejecuta). El riesgo es que la demo pierda interactividad. Se mitigará manteniendo la simulación visual en TrainingExecution.

3. **Separación del modo demo/real:** Al eliminar el fallback silencioso a datos demo, los errores del backend se mostrarán al usuario. El riesgo es que la experiencia sea menos fluida en modo real. Sin embargo, esto es el comportamiento correcto y esperado. Se mitigará con estados de error claros y mensajes informativos.

4. **Eliminar dataSplit fijo:** La distribución 70/15/15 ya no está hardcodeada en el frontend. En modo demo, se incluye en los datos ficticios. En modo real, se recibe del backend. El riesgo es que algún componente asuma la distribución fija. Se mitigará asegurando que todos los componentes reciban la distribución como prop o dato de servicio.

5. **Crear servicios API-ready:** Los servicios inicialmente devuelven datos de demo. El riesgo es que los componentes se acoplen a la estructura de los servicios en lugar de los datos directamente. Sin embargo, esto facilita la integración posterior con la API.

6. **Modificar ModelComparison.jsx:** Eliminar la selección manual cambia el flujo del módulo Evaluación. El riesgo es que se pierda la interactividad de la demo. Sin embargo, la comparación lado a lado se mantiene.

7. **Modificar AdminDashboard y ClientDashboard:** Agregar estados de cargando y error puede afectar la apariencia actual. Se mitigará conservando los datos demo como fallback inmediato en modo demo.

8. **api.js sin funciones de negocio:** Separar la configuración HTTP de las consultas evita duplicación. El riesgo es que se agreguen funciones de negocio a api.js por conveniencia. Se mitigará documentando que api.js contiene solo configuración.

## Testing

### Validación
- Verificar que `app-config.js` exista con `IS_DEMO_MODE` por defecto `true`.
- Verificar que en modo demo, los servicios devuelvan datos de demo sin errores.
- Verificar que en modo real, los errores del backend se propaguen al componente y se muestren con StatePanel.
- Verificar que NO exista fallback silencioso a datos demo cuando falla la API.
- Verificar que el módulo Entrenamiento funcione como vista de consulta sin botón de inicio.
- Verificar que la distribución se muestre como parte de la configuración recibida, no como valor fijo.
- Verificar que el módulo Evaluación funcione sin la selección manual de candidato.
- Verificar que la vista de modelo publicado muestre correctamente los datos de demo.
- Verificar que los servicios devuelvan los mismos datos que los archivos de demo en modo demo.
- Verificar que api.js contenga solo configuración HTTP, sin funciones de negocio.
- Verificar que las vistas de estado (cargando, error, vacío) se muestren correctamente en todos los módulos.
- Verificar que AdminDashboard y ClientDashboard carguen datos desde servicios.
- Verificar que las otras rutas y módulos no se vean afectados.

### Key Scenarios
- Admin navega al Dashboard → ve indicadores generales desde servicios.
- Admin navega a Entrenamiento → ve configuración de solo lectura con distribución recibida, resultados e historial.
- Admin navega a Evaluación → ve métricas de ambos modelos.
- Admin navega a Comparación → ve comparación lado a lado sin botón de selección.
- Admin navega a Publicación → ve el modelo publicado actualmente (de solo lectura).
- Admin navega a Historial → ve publicaciones precargadas.
- Cliente navega al Dashboard → ve indicadores y modelo indicado.
- Cliente no puede acceder a comparación de modelos.
- Modo real con error de API → se muestra estado de error, no datos demo.

### Edge Cases
- Sin modelo publicado: se muestra "Estado vacío" con StatePanel.
- Error al cargar datos en modo real: se muestra "Estado de error" con StatePanel, NO datos demo.
- Error al cargar datos en modo demo: se muestra "Estado de error" con StatePanel (no debería ocurrir).
- Cargando datos: se muestra "Estado de carga" con Skeleton.
- Sin historial de entrenamientos: se muestra "Estado vacío" con StatePanel.
- Datos demo no disponibles: se muestra "Estado de error" con StatePanel.
- Distribución diferente a 70/15/15 en modo real: se muestra la distribución recibida del backend.