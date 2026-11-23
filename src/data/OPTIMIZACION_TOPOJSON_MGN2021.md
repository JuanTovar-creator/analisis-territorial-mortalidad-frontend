# Optimización TopoJSON - Marco Geoestadístico Nacional MGN 2021
## Nivel Municipal (MGNMPIOPOLITICO2021)

**Fecha de optimización:** 2026-11-22  
**Archivo original:** `frontend-IA/src/data/MGNMPIOPOLITICO2021geojson.geojson`  
**Fuente:** DANE - Marco Geoestadístico Nacional MGN 2021  
**Herramientas:** topojson-server v3.0.1, topojson-simplify v3.0.3, topojson-client v3.1.0

---

## 1. Objetivo

Generar una versión geográfica ligera y válida del GeoJSON oficial del DANE para el futuro mapa interactivo de VITALIA, preservando:
- Las 1.121 features (municipios, áreas no municipalizadas, islas)
- Los códigos DIVIPOLA `MPIO_CDPMP`
- Los atributos esenciales (nombre, departamento, tipo, área)
- Los límites compartidos entre municipios
- La validez geométrica

---

## 2. Archivo Original

| Propiedad | Valor |
|-----------|-------|
| Tipo | `FeatureCollection` |
| Features | 1.121 |
| Geometría | 100% `MultiPolygon` |
| CRS | WGS 84 (EPSG:4326) |
| Tamaño | **242.99 MB** |
| Códigos DIVIPOLA | 1.121 únicos (sin duplicados) |

### Distribución por tipo de entidad

| Tipo | Cantidad |
|------|----------|
| MUNICIPIO | 1.102 |
| ÁREA NO MUNICIPALIZADA | 18 |
| ISLA | 1 |

---

## 3. Metodología

### 3.1. Enfoque: Cuantización con geo2topo

Se evaluaron dos estrategias de reducción:

1. **Simplificación con `toposimplify`** (spherical-quantile): Reducción moderada (51-77%)
2. **Cuantización con `geo2topo -q`**: Reducción drástica (99%+)

La cuantización demostró ser mucho más efectiva que la simplificación pura, logrando archivos de menos de 1 MB con TopoJSON mientras se conservan todas las features y atributos.

### 3.2. Comandos ejecutados

#### Conversión base (sin cuantización)
```bash
node node_modules/topojson-server/bin/geo2topo \
  -o MGNMPIOPOLITICO2021_base.topojson \
  "municipios=MGNMPIOPOLITICO2021geojson.geojson"
```
Resultado: 118.48 MB (51% de reducción)

#### Evaluación de simplificación con toposimplify
```bash
node node_modules/topojson-simplify/bin/toposimplify -S <quantile> -o output.topojson input.topojson
```

| Parámetro | Tamaño TopoJSON | Reducción |
|-----------|----------------|-----------|
| -S 0.99 | 111.86 MB | 54% |
| -S 0.97 | 109.61 MB | 55% |
| -S 0.95 | 107.36 MB | 56% |
| -S 0.93 | 105.11 MB | 57% |
| -S 0.90 | 101.74 MB | 58% |
| -S 0.85 | 96.11 MB | 60% |
| -S 0.75 | 84.85 MB | 65% |
| -S 0.50 | 56.77 MB | 77% |

#### Evaluación de cuantización con geo2topo
```bash
node node_modules/topojson-server/bin/geo2topo \
  -q <quantization> \
  -o output.topojson \
  "municipios=MGNMPIOPOLITICO2021geojson.geojson"
```

| Parámetro | TopoJSON | GeoJSON reconstruido | Arcos | Reducción TopoJSON |
|-----------|----------|---------------------|-------|-------------------|
| -q 100 | 0.46 MB | — | 2,802 | 99.81% |
| -q 300 | 0.65 MB | — | 7,165 | 99.73% |
| -q 500 | 0.78 MB | 2.79 MB | 9,342 | 99.68% |
| **-q 800** | **0.98 MB** | **4.19 MB** | **12,266** | **99.60%** |
| -q 1000 | 1.09 MB | 5.08 MB | 13,842 | 99.55% |

---

## 4. Nivel Seleccionado: -q 1000 (Versión Definitiva)

### 4.1. Justificación

Tras la evaluación de calidad cuantitativa (ver `EVALUACION_CALIDAD_TOPOJSON_MGN2021.md`), el nivel `-q 1000` se seleccionó como versión definitiva para producción porque:

- **Tamaño TopoJSON:** 1.09 MB — ideal para carga en navegador
- **Tamaño GeoJSON reconstruido:** 5.08 MB — dentro del rango recomendado (1-10 MB)
- **Arcos TopoJSON:** 13,842 — mayor detalle para visualizar límites municipales
- **Resolución de cuantización:** ~0.015° longitud, ~0.018° latitud (~1.5 km en el ecuador)
- **Integridad total:** 1.121 features, 1.121 códigos DIVIPOLA, 0 geometrías vacías
- **Error promedio de área:** 2.19% — 28% menor que q800 (3.04%)
- **Mejora en municipios pequeños:** hasta 27% menos error en los casos más críticos

### 4.1.1. Versión anterior: -q 800

El nivel `-q 800` se mantuvo como referencia comparativa durante la evaluación:

- **Tamaño TopoJSON:** 0.98 MB
- **Error promedio de área:** 3.04%
- **Archivo:** `MGNMPIOPOLITICO2021_optimized.topojson` (conservado como referencia)

### 4.2. Comando final (q1000)
```bash
node node_modules/topojson-server/bin/geo2topo \
  -q 1000 \
  -o MGNMPIOPOLITICO2021_optimized_q1000.topojson \
  "municipios=MGNMPIOPOLITICO2021geojson.geojson"
```

### 4.3. Comando anterior (q800 — conservado como referencia)
```bash
node node_modules/topojson-server/bin/geo2topo \
  -q 800 \
  -o MGNMPIOPOLITICO2021_optimized.topojson \
  "municipios=MGNMPIOPOLITICO2021geojson.geojson"
```

### 4.4. Conversión a GeoJSON (para comparación)
```javascript
const fs = require('fs');
const topojson = require('topojson-client');
const t = JSON.parse(fs.readFileSync('MGNMPIOPOLITICO2021_optimized_q1000.topojson', 'utf8'));
const geo = topojson.feature(t, t.objects.municipios);
fs.writeFileSync('MGNMPIOPOLITICO2021_optimized_q1000.geojson', JSON.stringify(geo), 'utf8');
```

---

## 5. Resultados de Validación

### 5.1. Integridad de features

| Métrica | Original | Optimizado TopoJSON | Optimizado GeoJSON |
|---------|----------|---------------------|-------------------|
| Features | 1.121 | 1.121 ✓ | 1.121 ✓ |
| Códigos DIVIPOLA únicos | 1.121 | 1.121 ✓ | 1.121 ✓ |
| MUNICIPIO | 1.102 | 1.102 ✓ | 1.102 ✓ |
| ÁREA NO MUNICIPALIZADA | 18 | 18 ✓ | 18 ✓ |
| ISLA | 1 | 1 ✓ | 1 ✓ |
| Geometrías vacías | 0 | 0 ✓ | 0 ✓ |
| Arcos vacíos | — | 0 ✓ | — |

### 5.2. Municipios clave verificados

| Código | Municipio | Estado TopoJSON | Estado GeoJSON |
|--------|-----------|----------------|---------------|
| 11001 | BOGOTÁ, D.C. | ✓ Encontrado | ✓ Encontrado |
| 05001 | MEDELLÍN | ✓ Encontrado | ✓ Encontrado |
| 20001 | VALLEDUPAR | ✓ Encontrado | ✓ Encontrado |

### 5.3. Islas verificadas

| Código | Nombre | Arcos | Estado |
|--------|--------|-------|--------|
| 88001 | SAN ANDRÉS | 4 | ✓ Presente |

### 5.4. Áreas no municipalizadas verificadas (18 de 18)

| Código | Nombre | Departamento | Estado |
|--------|--------|-------------|--------|
| 91263 | EL ENCANTO | AMAZONAS | ✓ |
| 91405 | LA CHORRERA | AMAZONAS | ✓ |
| 91407 | LA PEDRERA | AMAZONAS | ✓ |
| 91430 | LA VICTORIA | AMAZONAS | ✓ |
| 91460 | MIRITÍ - PARANÁ | AMAZONAS | ✓ |
| 91530 | PUERTO ALEGRÍA | AMAZONAS | ✓ |
| 91536 | PUERTO ARICA | AMAZONAS | ✓ |
| 91669 | PUERTO SANTANDER | AMAZONAS | ✓ |
| 91798 | TARAPACÁ | AMAZONAS | ✓ |
| 94883 | SAN FELIPE | GUAINÍA | ✓ |
| 94884 | PUERTO COLOMBIA | GUAINÍA | ✓ |
| 94885 | LA GUADALUPE | GUAINÍA | ✓ |
| 94886 | CACAHUAL | GUAINÍA | ✓ |
| 94887 | PANA PANA | GUAINÍA | ✓ |
| 94888 | MORICHAL | GUAINÍA | ✓ |
| 97511 | PACOA | VAUPÉS | ✓ |
| 97777 | PAPUNAHUA | VAUPÉS | ✓ |
| 97889 | YAVARATÉ | VAUPÉS | ✓ |

### 5.5. Atributos preservados

Todos los atributos originales se conservan intactos en las propiedades de cada feature:

| Campo | Descripción | Estado |
|-------|-------------|--------|
| `MPIO_CDPMP` | Código DIVIPOLA (5 dígitos) | ✓ |
| `MPIO_CNMBR` | Nombre del municipio | ✓ |
| `DPTO_CCDGO` | Código del departamento | ✓ |
| `DPTO_CNMBR` | Nombre del departamento | ✓ |
| `MPIO_CCDGO` | Código corto del municipio | ✓ |
| `MPIO_CRSLC` | Código de resolución | ✓ |
| `MPIO_NAREA` | Área en km² | ✓ |
| `MPIO_CSMBL` | Código de símbolo/estado | ✓ |
| `MPIO_VGNC` | Año de vigencia | ✓ |
| `MPIO_TIPO` | Tipo de entidad | ✓ |
| `Shape_Leng` | Longitud del perímetro | ✓ |
| `Shape_Area` | Área en unidades de proyección | ✓ |

---

## 6. Comparación de Tamaños

| Archivo | Tamaño | Reducción vs original |
|---------|--------|----------------------|
| MGNMPIOPOLITICO2021geojson.geojson (original) | 242.99 MB | — |
| MGNMPIOPOLITICO2021_optimized.topojson | **0.98 MB** | **99.60%** |
| MGNMPIOPOLITICO2021_optimized.geojson | **4.19 MB** | **98.27%** |
| geoBoundaries-COL-ADM2_simplified.geojson (referencia) | 10.11 MB | 95.84% |

### Comparación con archivo GeoBoundaries existente

| Métrica | GeoBoundaries | Optimizado q800 |
|---------|--------------|----------------|
| Tamaño | 10.11 MB | 0.98 MB (TopoJSON) / 4.19 MB (GeoJSON) |
| Features | 1.122 | 1.121 |
| Códigos DIVIPOLA | ❌ No tiene | ✓ MPIO_CDPMP |
| Fuente | GeoBoundaries | DANE oficial |
| Vigencia | Desconocida | 2021 |

---

## 7. Archivos Generados

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| `MGNMPIOPOLITICO2021_optimized_q1000.topojson` | `src/data/` | TopoJSON optimizado q1000 (1.09 MB) — **archivo principal para producción** |
| `MGNMPIOPOLITICO2021_optimized.topojson` | `src/data/` | TopoJSON optimizado q800 (0.98 MB) — conservado como referencia comparativa |
| `test_q1000.topojson` | `src/data/` | TopoJSON q1000 original de prueba (1.09 MB) — conservado como respaldo |
| `MGNMPIOPOLITICO2021_optimized.geojson` | `src/data/` | GeoJSON reconstruido q800 (4.19 MB) — para comparación y herramientas que requieren GeoJSON |

### Archivos NO modificados

- `MGNMPIOPOLITICO2021geojson.geojson` — Original del DANE intacto (242.99 MB)
- `municipios.json` — Sin modificar
- `geoBoundaries-COL-ADM2_simplified.geojson` — Sin modificar

---

## 8. Uso en VITALIA

### Carga del TopoJSON en el navegador

```javascript
// Opción 1: Cargar TopoJSON directamente (versión q1000 — recomendada)
import * as topojson from 'topojson-client';
import municipiosTopo from './data/MGNMPIOPOLITICO2021_optimized_q1000.topojson';

const municipiosGeo = topojson.feature(municipiosTopo, municipiosTopo.objects.municipios);
// municipiosGeo es un FeatureCollection GeoJSON listo para usar

// Opción 2: Cargar GeoJSON directamente
import municipiosGeo from './data/MGNMPIOPOLITICO2021_optimized_q1000.geojson';
```

### Búsqueda por código DIVIPOLA

```javascript
const municipio = municipiosGeo.features.find(
  f => f.properties.MPIO_CDPMP === '05001'
);
// → MEDELLÍN, ANTIOQUIA
```

---

## 9. Limitaciones y Consideraciones

1. **Resolución de cuantización:** Con `-q 1000`, la resolución es ~1.5 km en el ecuador. Esta resolución es adecuada para zoom municipal en el mapa interactivo de VITALIA.

2. **Error de área:** El error promedio de área es del 2.19%. En municipios grandes (> 1.000 km²) el error es < 1%. En municipios pequeños (< 100 km²) puede alcanzar hasta 27%, pero sigue siendo aceptable para visualización web. Ver `EVALUACION_CALIDAD_TOPOJSON_MGN2021.md` para detalles.

3. **Desplazamiento de centroides:** Los desplazamientos de centroides son de 1-4 km para municipios grandes, imperceptibles visualmente a escala municipal.

4. **TopoJSON vs GeoJSON:** El TopoJSON (1.09 MB) es 4.6x más pequeño que el GeoJSON reconstruido (5.08 MB). Se recomienda usar TopoJSON como fuente y convertir en el cliente con `topojson-client`.

5. **Áreas no municipalizadas:** Las 18 áreas no municipalizadas se conservan. Si VITALIA solo necesita municipios, se pueden filtrar por `MPIO_TIPO === 'MUNICIPIO'`.

6. **Islas:** San Andrés (88001) se conserva con error de área del 5.31%. Las islas archipelágicas del Caribe y Pacífico están incluidas en sus municipios correspondientes.

7. **Fronteras compartidas:** TopoJSON preserva los bordes compartidos entre municipios mediante arcos comunes, garantizando que no haya huecos ni superposiciones entre límites adyacentes.

---

## 10. Conclusión

La optimización del GeoJSON oficial del DANE MGN 2021 se completó exitosamente con la versión q1000 seleccionada como definitiva:

- **Reducción del 99.55%** en tamaño (de 243 MB a 1.09 MB en TopoJSON)
- **100% de integridad** en features, códigos DIVIPOLA y atributos
- **Error promedio de área del 2.19%** — 28% menor que q800
- **Todas las islas y áreas no municipalizadas** conservadas
- **Fronteras compartidas** preservadas mediante topología
- **Fuente oficial del DANE** mantenida como base
- **Listo para uso web** en el mapa interactivo de VITALIA

### Archivo de producción

| Archivo | Uso |
|---------|-----|
| `MGNMPIOPOLITICO2021_optimized_q1000.topojson` | **Versión definitiva para el mapa de VITALIA** |
| `MGNMPIOPOLITICO2021_optimized.topojson` | Versión q800 conservada como referencia |
| `test_q1000.topojson` | Archivo de prueba original, conservado como respaldo |
