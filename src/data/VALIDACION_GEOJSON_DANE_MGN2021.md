# Validación del GeoJSON DANE - Marco Geoestadístico Nacional 2021
## Nivel Municipal (MGNMPIOPOLITICO2021geojson.geojson)

**Fecha de análisis:** 2026-11-22  
**Archivo:** `frontend-IA/src/data/MGNMPIOPOLITICO2021geojson.geojson`  
**Fuente:** DANE - Marco Geoestadístico Nacional MGN 2021

---

## 1. Validez del GeoJSON

✅ **El archivo es un GeoJSON válido.**

- **Tipo:** `FeatureCollection`
- **Nombre:** `MGNMPIOPOLITICO2021geojson`
- **Sistema de referencia:** `urn:ogc:def:crs:OGC:1.3:CRS84` (WGS 84, EPSG:4326)
- **Total de features:** 1121
- **Tamaño del archivo:** 242.99 MB

---

## 2. Estructura de Propiedades

Cada Feature contiene las siguientes propiedades:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `DPTO_CCDGO` | Código corto del departamento (2 dígitos) | `05` |
| `DPTO_CNMBR` | Nombre del departamento | `ANTIOQUIA` |
| `MPIO_CCDGO` | Código corto del municipio (3 dígitos) | `001` |
| `MPIO_CDPMP` | **Código DIVIPOLA completo (5 dígitos)** | `05001` |
| `MPIO_CNMBR` | Nombre del municipio | `MEDELLÍN` |
| `MPIO_CRSLC` | Código de resolución | `1965` |
| `MPIO_CSMBL` | Código de símbolo/estado | `4` |
| `MPIO_NAREA` | Área en km² | `374,812877467` |
| `MPIO_TIPO` | Tipo de entidad | `MUNICIPIO` / `ÁREA NO MUNICIPALIZADA` / `ISLA` |
| `MPIO_VGNC` | Año de vigencia | `2021` |
| `Shape_Leng` | Longitud del perímetro | `1,03254592618` |
| `Shape_Area` | Área en unidades de proyección | `0,03060592413` |

**Campo clave para DIVIPOLA:** `MPIO_CDPMP` (código municipal de 5 dígitos)

---

## 3. Geometrías y Códigos Municipales

### Resumen de geometrías
- **Tipo de geometría:** 100% `MultiPolygon` (1121 de 1121)
- **Códigos únicos:** 1121 (sin duplicados)
- **Departamentos cubiertos:** 33 (todos los departamentos de Colombia)

### Distribución por tipo de entidad (`MPIO_TIPO`)

| Tipo | Cantidad |
|------|----------|
| MUNICIPIO | 1102 |
| ÁREA NO MUNICIPALIZADA | 18 |
| ISLA | 1 |

### Distribución por departamento (top 10)

| Departamento | Municipios |
|--------------|------------|
| ANTIOQUIA | 125 |
| BOYACÁ | 123 |
| CUNDINAMARCA | 116 |
| SANTANDER | 87 |
| NARIÑO | 64 |
| TOLIMA | 47 |
| BOLÍVAR | 46 |
| VALLE DEL CAUCA | 42 |
| CAUCA | 42 |
| NORTE DE SANTANDER | 40 |

### Estadísticas de área (`MPIO_NAREA`)

- **Mínima:** 15,83 km²
- **Máxima:** 65.597,25 km²
- **Promedio:** 1.017,82 km²

### Vigencia
- **Todos los 1121 features** tienen `MPIO_VGNC = 2021`
- **Todos los 1121 features** tienen `MPIO_CSMBL = 4` (vigente)

---

## 4. Verificación de Municipios Específicos

| Código | Municipio | Departamento | Estado |
|--------|-----------|--------------|--------|
| 20001 | VALLEDUPAR | CESAR | ✅ Encontrado |
| 11001 | BOGOTÁ, D.C. | BOGOTÁ, D.C. | ✅ Encontrado |
| 05001 | MEDELLÍN | ANTIOQUIA | ✅ Encontrado |

---

## 5. Comparación con `municipios.json`

### Resumen

| Métrica | Valor |
|---------|-------|
| Códigos en GeoJSON | 1121 |
| Códigos en municipios.json | 1065 |
| **Códigos comunes** | **1062** |
| Solo en GeoJSON | 59 |
| Solo en municipios.json | 3 |

### 59 códigos solo en GeoJSON (NO en municipios.json)

Son **municipios legítimos y áreas no municipalizadas** que faltan en `municipios.json`:

**Municipios de CASANARE (11):**
- 85015 CHÁMEZA, 85136 LA SALINA, 85139 MANÍ, 85162 MONTERREY, 85225 NUNCHÍA, 85230 OROCUÉ, 85300 SABANALARGA, 85315 SÁCAMA, 85325 SAN LUIS DE PALENQUE, 85400 TÁMARA, 85410 TAURAMENA

**Municipios de PUTUMAYO (11):**
- 86001 MOCOA, 86219 COLÓN, 86320 ORITO, 86568 PUERTO ASÍS, 86569 PUERTO CAICEDO, 86571 PUERTO GUZMÁN, 86573 PUERTO LEGUÍZAMO, 86749 SIBUNDOY, 86755 SAN FRANCISCO, 86757 SAN MIGUEL, 86865 VALLE DEL GUAMUEZ

**Municipios de AMAZONAS (1):**
- 91001 LETICIA

**Áreas no municipalizadas de GUAINÍA (6):**
- 94883 SAN FELIPE, 94884 PUERTO COLOMBIA, 94885 LA GUADALUPE, 94886 CACAHUAL, 94887 PANA PANA, 94888 (y más)

**Áreas no municipalizadas de GUAVIARE, VAUPÉS, VICHADA:**
- Múltiples áreas no municipalizadas de estos departamentos amazónicos

**Islas y territorios especiales:**
- Códigos 95xxx, 97xxx, 99xxx corresponden a islas y territorios especiales

### 3 códigos solo en municipios.json (NO en GeoJSON)

| Código | Nombre en municipios.json | Explicación |
|--------|---------------------------|-------------|
| 05999 | "Sin Informacion - Antioquia" | Placeholder sintético para datos sin municipio |
| 27086 | "Belén De Bajirá" | Municipio en disputa legal (Cundinamarca vs. Meta) — no está en MGN 2021 |
| 52999 | "Sin Informacion - Nariño" | Placeholder sintético para datos sin municipio |

**Conclusión:** `municipios.json` está incompleto. Le faltan 59 municipios legítimos (especialmente de Casanare, Putumayo, y áreas amazónicas) y contiene 3 entradas que no son municipios oficiales del DANE.

---

## 6. Sistema de Coordenadas y Compatibilidad Web

### Sistema de coordenadas
- **CRS declarado:** `urn:ogc:def:crs:OGC:1.3:CRS84` (WGS 84, EPSG:4326)
- **Orden de coordenadas:** [longitude, latitude] (estándar GeoJSON)

### Rangos de coordenadas verificadas

| Eje | Mínimo | Máximo |
|-----|--------|--------|
| Longitud | -81,74° | -66,85° |
| Latitud | -4,23° | 13,39° |

✅ **Los rangos son correctos para Colombia:**
- Longitud: Colombia se extiende aproximadamente de -79° a -67° (los -81,74° corresponden a la isla de Malpelo)
- Latitud: Colombia se extiende aproximadamente de -4,2° a 13,4°

### Compatibilidad con mapas web
✅ **Las geometrías son directamente utilizables en mapas web** con:
- Leaflet
- Mapbox GL JS
- OpenLayers
- D3.js con Projections
- Any library that supports GeoJSON + WGS84

No se requiere transformación de proyección.

---

## 7. Tamaño del Archivo y Recomendaciones de Simplificación

### Tamaño actual
- **Archivo original:** 242,99 MB
- **Archivo respaldo (GeoBoundaries):** 10,11 MB

### Problema
243 MB es **excesivo** para cargar en un navegador web. Un mapa web típico debería tener entre 1-10 MB para nivel municipal.

### Recomendaciones de simplificación

#### Opción A: Simplificación Douglas-Peucker (Recomendada)
- **Algoritmo:** Douglas-Peucker / Ramer-Douglas-Peucker
- **Tolerancia sugerida:** 0.001° a 0.005° (aproximadamente 100-500 metros en la ecuador)
- **Herramienta:** `topojson-simplify`, `shp simplify`, o `ogr2ogr -simplify`
- **Resultado esperado:** Reducción del 90-95% (de 243 MB a ~12-25 MB)
- **Preservación:** Códigos DIVIPOLA, nombres, departamentos y límites reconocibles

#### Opción B: TopoJSON
- **Formato:** Convertir a TopoJSON para compartir bordes entre municipios
- **Ventaja:** Reducción adicional del 30-50% sobre GeoJSON simplificado
- **Resultado esperado:** ~5-15 MB

#### Opción C: Usar el archivo GeoBoundaries existente
- **Archivo:** `geoBoundaries-COL-ADM2_simplified.geojson` (10,11 MB)
- **Ventaja:** Ya simplificado, 1122 features
- **Desventaja:** No tiene códigos DIVIPOLA — usa `shapeID` interno de GeoBoundaries
- **Solución:** Cruzar `shapeName` con nombres de municipios para mapear a DIVIPOLA

### Parámetros clave a preservar al simplificar
1. `MPIO_CDPMP` — Código DIVIPOLA (identificador único)
2. `MPIO_CNMBR` — Nombre del municipio
3. `DPTO_CNMBR` — Nombre del departamento
4. `MPIO_TIPO` — Tipo de entidad
5. Las geometrías deben mantener la topología (sin huecos ni superposiciones)

---

## 8. Limitaciones y Hallazgos

### Limitaciones identificadas

1. **Tamaño excesivo:** 243 MB no es viable para carga directa en navegador. Se requiere simplificación obligatoria.

2. **`municipios.json` desactualizado:** 
   - Faltan 59 municipios legítimos (Casanare, Putumayo, Amazonas, áreas no municipalizadas)
   - Contiene 3 entradas no oficiales (2 placeholders "Sin Informacion" + 1 municipio en disputa)
   - **Recomendación:** Regenerar `municipios.json` a partir del GeoJSON DANE

3. **Belén De Bajirá (27086):** Este municipio está en disputa legal entre Cundinamarca y Meta. No aparece en el MGN 2021 del DANE porque su estatus jurídico no está resuelto.

4. **Áreas no municipalizadas:** 18 features son `ÁREA NO MUNICIPALIZADA` (departamentos amazónicos). Estas no son municipios pero sí tienen geometría oficial. Dependiendo del uso de VITALIA, pueden o no incluirse.

5. **Archivo respaldo GeoBoundaries:** Tiene 1122 features con geometría `Polygon` (no MultiPolygon) pero usa un esquema de propiedades completamente diferente sin códigos DIVIPOLA. No es directamente intercambiable con el GeoJSON DANE.

6. **Precisión decimal:** Las coordenadas tienen hasta 11 decimales (~1 mm de precisión). Para un mapa web, 6-7 decimales (~10 cm) son más que suficientes y reducirían significativamente el tamaño.

### Ventajas del GeoJSON DANE

1. ✅ **Fuente oficial:** Es el Marco Geoestadístico Nacional del DANE — la autoridad máxima en Colombia.
2. ✅ **Actualizado:** Vigencia 2021, la versión más reciente.
3. ✅ **Códigos DIVIPOLA:** Incluye los códigos oficiales de 5 dígitos.
4. ✅ **Completo:** Cubre los 33 departamentos y todos los municipios oficiales.
5. ✅ **Sin duplicados:** 1121 códigos únicos, sin ambigüedades.
6. ✅ **WGS84:** Listo para mapas web sin transformación.
7. ✅ **Metadatos ricos:** Incluye tipo de entidad, área, resolución, vigencia.

---

## 9. Conclusión

El GeoJSON del DANE MGN 2021 es **la fuente de referencia definitiva** para validación geográfica de VITALIA. Es válido, completo, oficial y compatible con mapas web. 

**Acciones recomendadas (en orden de prioridad):**
1. ✅ **Simplificar el archivo para uso web** — Completado. Se generó `MGNMPIOPOLITICO2021_optimized_q1000.topojson` (1.09 MB, reducción del 99.55%).
2. Regenerar `municipios.json` a partir de los 1102 municipios del GeoJSON
3. ✅ **Mantener el archivo original como referencia** — `MGNMPIOPOLITICO2021geojson.geojson` conservado intacto (242.99 MB).
4. Conservar `geoBoundaries-COL-ADM2_simplified.geojson` como respaldo alternativo

**Estado actual de la simplificación:**

La simplificación se completó con éxito usando TopoJSON con cuantización `-q 1000`:

| Archivo | Tamaño | Estado |
|---------|--------|--------|
| `MGNMPIOPOLITICO2021geojson.geojson` | 242.99 MB | Original del DANE, conservado |
| `MGNMPIOPOLITICO2021_optimized_q1000.topojson` | 1.09 MB | **Versión definitiva para producción** |
| `MGNMPIOPOLITICO2021_optimized.topojson` | 0.98 MB | Versión q800, conservada como referencia |

Ver `OPTIMIZACION_TOPOJSON_MGN2021.md` y `EVALUACION_CALIDAD_TOPOJSON_MGN2021.md` para detalles completos del proceso y la evaluación de calidad.
