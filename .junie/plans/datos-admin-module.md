---
sessionId: session-261115-010203-1edi
---

# Resumen y Plan

## Estructura encontrada

### Proyecto
- **Stack:** React 19 + Vite + JavaScript/JSX, Tailwind CSS v4, shadcn/ui (base-nova), Recharts 3, Lucide icons.
- **Rutas:** `react-router-dom` v7. Layout principal en `AppShell.jsx` (sidebar fijo 264px + header sticky + `<Outlet />`).
- **Tema:** Fondo `#f8fafc`, sidebar `#1e293b`, primario `#6366f1` (índigo/violeta), tarjetas blancas con `ring-1`.

### Archivos clave
| Archivo | Propósito |
|---|---|
| `src/App.jsx` | Rutas y protección por rol. `/admin/data` muestra `ModulePlaceholder`. |
| `src/config/navigation.js` | Menú lateral. "Datos" → `/admin/data` (icono `Database`). |
| `src/components/layout/AppShell.jsx` | Shell con sidebar, header y `<Outlet />` en `max-w-[1500px]`. |
| `src/components/dashboard/PageHeader.jsx` | Encabezado de página (eyebrow, título, descripción, acción). |
| `src/components/dashboard/DashboardPrimitives.jsx` | `DemoNotice`, `MetricCard`, `StatePanel`. |
| `src/components/dashboard/ModulePlaceholder.jsx` | Placeholder actual de `/admin/data`. |
| `src/features/admin/AdminDashboard.jsx` | Dashboard admin como referencia de patrón. |
| `src/features/admin/demo/admin-dashboard.js` | Datos ficticios del admin. |
| `src/features/client/ClientDashboard.jsx` | Dashboard cliente con filtros + Recharts (patrón a seguir). |
| `src/components/ui/` | Botones, inputs, selects, cards, badges, alerts, fields, skeletons, sheets. |

### Patrones identificados
1. **Páginas como funciones default export** en `src/features/<rol>/`. 
2. **Datos demo en JS plano** en `src/features/<rol>/demo/`.
3. **Composición:** `PageHeader` → `DemoNotice` → métricas → tarjetas/gráficos.
4. **Filtros con `useState` + `useMemo`** (ClientDashboard).
5. **Recharts con `ResponsiveContainer`** y estilo inline.

---

## Ajustes aprobados por el usuario

1. **Carga real de archivos CSV:** seleccionar y arrastrar archivos CSV reales desde el computador con validación de extensión y tamaño en el frontend. Sin simular procesamiento o almacenamiento en servidor.
2. **Distinción clara entre operaciones reales y simulaciones:** estados de carga, validación y procesamiento deben etiquetar explícitamente qué es una operación real del navegador y qué es una simulación de demostración.
3. **EDA con calidad de datos:** además de indicadores, incluir visualización de valores faltantes, duplicados y calidad de datos (información sintética).
4. **Procesamiento como simulación etiquetada:** ejecución claramente marcada como simulación, con limpieza de temporizadores al desmontar y sin ejecuciones simultáneas.
5. **Dataset integrado con export demo:** registros ficticios para probar funcionalidad; archivo exportado identificado como demostración.
6. **Componentes API-ready:** organizar componentes para que luego se puedan reemplazar datos ficticios por respuestas de API sin reescribir interfaces.
7. **Sin modificar otras rutas:** no tocar login, dashboards ni otras rutas existentes salvo lo necesario para integrar el módulo.
8. **Sin operaciones de Git automáticas:** el usuario controla Git manualmente.

---

## Plan de implementación

### Enfoque
El módulo Datos reemplazará el `ModulePlaceholder` de `/admin/data` por una página con **pestañas internas** (sub-rutas no necesarias; se usa `useState` para tabs). Se crearán 4 secciones:

1. **Carga de archivos** — Zona drag-and-drop **real** de archivos CSV desde el computador, validación de extensión (`.csv`) y tamaño (máx 10MB) en el frontend. Sin simular procesamiento o almacenamiento en servidor. Lista de archivos cargados con estados reales (cargado, error de validación).
2. **Análisis exploratorio (EDA)** — Tarjetas de indicadores, gráficos Recharts, tabla resumen, filtros de periodo/tipo. Incluye visualización de calidad de datos: valores faltantes, duplicados y completitud (datos sintéticos).
3. **Procesamiento** — Pipeline visual de 5 etapas (validación → limpieza → transformación → agregación → integración) con estados **claramente etiquetados como simulación**. Limpieza de temporizadores al desmontar, sin ejecuciones simultáneas.
4. **Dataset integrado** — Tabla municipal con búsqueda, filtros (departamento, tipo), ordenamiento, paginación (8 filas), export CSV identificado como demostración.

### Componentes nuevos
```
src/features/admin/data/
  DataModule.jsx              ← Página principal con tabs
  demo/
    data-demo.js              ← Datos ficticios (EDA, pipeline, tabla municipal)
  upload/
    FileUploadZone.jsx        ← Zona drag-and-drop real de archivos CSV
    FileUploadList.jsx        ← Lista de archivos cargados con estados reales
  eda/
    EDAIndicators.jsx         ← Tarjetas de indicadores
    EDAChart.jsx              ← Gráfico Recharts
    EDADataQuality.jsx        ← Visualización de calidad de datos (faltantes, duplicados)
    EDAFilters.jsx            ← Filtros de consulta
    EDASummaryTable.jsx       ← Tabla resumen
  processing/
    ProcessingPipeline.jsx    ← Pipeline visual de etapas (simulación)
  dataset/
    IntegratedDatasetTable.jsx ← Tabla con búsqueda, filtros, paginación
    DatasetToolbar.jsx        ← Barra de herramientas (búsqueda + filtros + export)
```

### Cambios en archivos existentes
- **`src/App.jsx`**: Reemplazar `<ModulePlaceholder>` de `/admin/data` por `<DataModule>` (lazy-loaded). Solo esta ruta.

### Decisiones de diseño
- **Tabs internos** (no sub-rutas) para mantener simplicidad y coherencia con el patrón de ClientDashboard.
- **Datos explícitamente ficticios**: todos los municipios, cifras y estados son de demostración.
- **Sin tasas poblacionales sin denominadores**: los indicadores EDA muestran conteos y porcentajes relativos, nunca tasas.
- **Distinción real vs simulación:** cada componente etiqueta claramente si opera con datos reales del navegador (carga de archivos) o con simulaciones (procesamiento, EDA).
- **Componentes API-ready:** cada componente de vista recibe datos como `props` y no los importa directamente del archivo demo. Un archivo `data-demo.js` actúa como fuente única de datos ficticios, lo que permite reemplazarlo por llamadas a API sin cambiar las interfaces de los componentes.
- **Export CSV**: genera un archivo `.csv` desde los datos demo del frontend (sin backend). El archivo se nombra `dataset-demo.csv` y contiene un encabezado indicando que es una demostración.
- **Responsive**: grids colapsan a 1 columna en móvil, tabla con scroll horizontal.
- **Sin operaciones de Git:** no se realizarán commits, push ni merges automáticamente.

# Delivery Steps

### ✓ Step 1: Crear datos demo y estructura del módulo Datos
Establecer la base del módulo con datos ficticios y la página principal con navegación por tabs.
- Crear `src/features/admin/data/demo/data-demo.js` con datos de demostración: indicadores EDA, etapas de procesamiento, datos de calidad de datos (faltantes, duplicados), y 40+ registros municipales ficticios. Los componentes recibirán estos datos como `props` (patrón API-ready).
- Crear `src/features/admin/data/DataModule.jsx` con tabs internos (Carga, EDA, Procesamiento, Dataset) y `PageHeader` + `DemoNotice`.
- Actualizar `src/App.jsx`: reemplazar `ModulePlaceholder` de `/admin/data` por `DataModule` (lazy-loaded). No tocar otras rutas.
- Validar que la ruta `/admin/data` muestre la estructura base sin errores.

### ✓ Step 2: Implementar vista Carga de archivos con drag-and-drop real
Interfaz para seleccionar y arrastrar archivos CSV reales desde el computador con validación frontend.
- Crear `FileUploadZone.jsx`: zona drag-and-drop **real** que acepta archivos del sistema de archivos del usuario. Usa `onChange` en `<input type="file" accept=".csv">` y eventos `onDragOver`/`onDrop`. Icono, texto instructivo y botón de selección.
- Crear `FileUploadList.jsx`: lista de archivos cargados con estados **reales** del navegador: nombre, tamaño, tipo, estado (válido, error de extensión, error de tamaño). Validación de extensión `.csv` y tamaño máximo 10MB. Mensajes de error claros.
- **Sin simulación de procesamiento o almacenamiento:** los archivos se leen solo para validar y mostrar metadados. No se simula progreso de carga ni envío a servidor.
- Etiqueta visible: "Operación real del navegador" para distinguir de las simulaciones de otros tabs.
- Integrar ambos componentes en el tab "Carga" de `DataModule.jsx`.
- Usar `useState` para gestionar la lista de archivos cargados.

### ✓ Step 3: Implementar vista Análisis exploratorio (EDA) con calidad de datos
Tarjetas, gráficos, filtros y visualización de calidad de datos con información sintética.
- Crear `EDAFilters.jsx`: selects de periodo y tipo de dato (patrón tomado de ClientDashboard).
- Crear `EDAIndicators.jsx`: 4 tarjetas `MetricCard` con indicadores sintéticos (registros, municipios cubiertos, variables, completitud).
- Crear `EDAChart.jsx`: gráfico de barras Recharts con `ResponsiveContainer`, `BarChart`, `Tooltip`, `XAxis`, `YAxis`, `CartesianGrid`.
- Crear `EDADataQuality.jsx`: visualización de calidad de datos con 3 secciones: valores faltantes (gráfico de barras por variable), duplicados (tabla con conteos), y completitud general (barra de progreso). Datos sintéticos.
- Crear `EDASummaryTable.jsx`: tabla compacta con resumen por categoría.
- Etiqueta visible: "Simulación de demostración" para distinguir de operaciones reales.
- Integrar todo en el tab "EDA" con `useMemo` para filtrado reactivo.
- Los componentes reciben datos como `props` para facilitar reemplazo por API.

### ✓ Step 4: Implementar vista Procesamiento como simulación etiquetada
Pipeline visual de 5 etapas con estados simulados, limpieza de temporizadores y sin ejecuciones simultáneas.
- Crear `ProcessingPipeline.jsx`: representación horizontal/vertical de etapas (Validación → Limpieza → Transformación → Agregación → Integración).
- Cada etapa muestra: icono, título, estado (pendiente, en progreso, completado, error), porcentaje, y mensaje descriptivo.
- Botón "Simular ejecución" que avanza las etapas secuencialmente con `setTimeout`.
- `useEffect` con cleanup que limpia todos los temporizadores al desmontar el componente.
- Bloqueo del botón durante ejecución para evitar ejecuciones simultáneas (`isRunning` state).
- Etiqueta visible: "Simulación de demostración — no se procesan datos reales".
- Integrar en el tab "Procesamiento".

### ✓ Step 5: Implementar vista Dataset integrado con tabla completa
Tabla municipal con búsqueda, filtros, ordenamiento, paginación y export CSV identificado como demostración.
- Crear `DatasetToolbar.jsx`: campo de búsqueda (`Input`), filtro de departamento (`Select`), botón exportar CSV.
- Crear `IntegratedDatasetTable.jsx`: tabla con columnas (municipio, departamento, tipo, registros, variables, completitud, estado), ordenamiento por clic en encabezado, paginación de 8 filas por página.
- Implementar exportación CSV: genera `Blob` con los datos filtrados y descarga `dataset-demo.csv`. El archivo incluye una fila de encabezado con "DEMOSTRACIÓN — Datos ficticios".
- Datos de 40+ municipios ficticios con nombres genéricos (Municipio A, B, C…) y departamentos sintéticos.
- Los componentes reciben datos como `props` para facilitar reemplazo por API.
- Integrar en el tab "Dataset integrado".
- Validar responsive: tabla con `overflow-x-auto` en móvil.