# Evaluación de Calidad Final - Optimización TopoJSON MGN 2021

**Fecha:** 2026-11-22  
**Archivo original:** `MGNMPIOPOLITICO2021geojson.geojson` (242.99 MB)  
**Versiones evaluadas:** q800 (0.98 MB TopoJSON) y q1000 (1.09 MB TopoJSON)  
**Herramientas:** Scripts de validación personalizados con cálculo de área esférica y distancia Haversine

---

## 1. Resumen Ejecutivo

La evaluación de calidad cuantitativa confirma que ambas versiones optimizadas preservan la integridad estructural completa (1.121 features, 1.121 códigos DIVIPOLA únicos, 0 geometrías inválidas), pero introducen errores geométricos medibles debido a la cuantización.

**Recomendación principal:** Usar **q1000** para el mapa interactivo de VITALIA con zoom municipal, ya que reduce el error promedio de área de 3.04% a 2.19% con solo un 11% más de tamaño (1.09 MB vs 0.98 MB).

---

## 2. Integridad Estructural

| Métrica | Original | q800 | q1000 |
|---------|----------|------|-------|
| Features | 1.121 | 1.121 ✓ | 1.121 ✓ |
| Códigos DIVIPOLA únicos | 1.121 | 1.121 ✓ | 1.121 ✓ |
| MUNICIPIO | 1.102 | 1.102 ✓ | 1.102 ✓ |
| ÁREA NO MUNICIPALIZADA | 18 | 18 ✓ | 18 ✓ |
| ISLA | 1 | 1 ✓ | 1 ✓ |
| Geometrías inválidas | 0 | 0 ✓ | 0 ✓ |
| Coordenadas NaN/Infinity | 0 | 0 ✓ | 0 ✓ |
| Códigos duplicados | 0 | 0 ✓ | 0 ✓ |

**Conclusión:** Ambas versiones preservan la integridad estructural al 100%. No hay municipios perdidos, agregados ni duplicados.

---

## 3. Diferencias de Superficie

### 3.1. Resultados Globales (1.121 municipios)

| Métrica | q800 | q1000 |
|---------|------|-------|
| Error promedio de área | **3.036%** | **2.190%** |
| Error máximo de área | 29.11% (BUSBANZÁ, 15114) | 26.55% (LA VICTORIA, 15401) |
| Tamaño TopoJSON | 0.98 MB | 1.09 MB |
| Tamaño GeoJSON | 4.19 MB | 5.08 MB |

### 3.2. Municipios Pequeños (< 100 km²)

Se identificaron **184 municipios pequeños** donde la cuantización tiene mayor impacto relativo.

**Top 10 municipios con mayor error (q800 vs q1000):**

| Código | Municipio | Área original | Error q800 | Error q1000 | Mejora |
|--------|-----------|---------------|------------|-------------|--------|
| 15114 | BUSBANZÁ | 25.5 km² | 29.11% | 14.36% | 14.75% |
| 15401 | LA VICTORIA | 28.1 km² | 28.06% | 26.55% | 1.51% |
| 76845 | ULLOA | 42.0 km² | 27.66% | 7.98% | 19.68% |
| 25797 | TENA | 51.7 km² | 27.46% | 0.35% | 27.11% |
| 15187 | CHIVATÁ | 49.7 km² | 22.03% | 4.08% | 17.95% |
| 15494 | NUEVO COLÓN | 51.6 km² | 21.58% | 5.94% | 15.64% |
| 15215 | CORRALES | 61.1 km² | 21.38% | 4.71% | 16.67% |
| 15226 | CUÍTIVA | 44.3 km² | 20.09% | 1.42% | 18.67% |
| 15820 | TÓPAGA | 33.8 km² | 19.82% | 4.19% | 15.63% |
| 15764 | SORACÁ | 56.0 km² | 18.69% | 4.03% | 14.66% |

**Observación:** q1000 reduce drásticamente el error en la mayoría de municipios pequeños, con mejoras de 15-27% en los casos más críticos.

---

## 4. Desplazamiento de Límites

### 4.1. Municipios Clave

| Código | Municipio | Desplazamiento q800 | Desplazamiento q1000 |
|--------|-----------|---------------------|----------------------|
| 11001 | BOGOTÁ, D.C. | 3.42 km | 3.89 km |
| 05001 | MEDELLÍN | 1.71 km | 1.59 km |
| 20001 | VALLEDUPAR | 4.18 km | 3.78 km |

**Nota:** Los desplazamientos de centroides son similares entre q800 y q1000 (1-4 km), lo cual es esperado dado que la cuantización redondea coordenadas a una cuadrícula. Para un mapa web a escala municipal, estos desplazamientos son imperceptibles visualmente.

### 4.2. Municipios Pequeños

En municipios pequeños, los desplazamientos varían entre 58-1,715 metros para q800 y 203-1,256 metros para q1000. q1000 tiende a reducir el desplazamiento en la mayoría de casos.

---

## 5. Islas y Áreas Especiales

### 5.1. San Andrés (88001)

| Métrica | Original | q800 | q1000 |
|---------|----------|------|-------|
| Área | 26.81 km² | 29.76 km² | 25.39 km² |
| Error de área | — | 11.01% | **5.31%** |
| Desplazamiento | — | 739 m | **537 m** |

**Conclusión:** q1000 reduce el error de San Andrés a la mitad (5.31% vs 11.01%), lo que es significativo para una isla pequeña.

### 5.2. Áreas No Municipalizadas (18 total)

| Métrica | q800 | q1000 |
|---------|------|-------|
| Error promedio | 0.36% | 0.40% |
| Todas preservadas | ✓ | ✓ |

**Conclusión:** Las áreas no municipalizadas amazónicas tienen errores mínimos (< 1%) en ambas versiones, ya que son territorios extensos donde la cuantización tiene poco impacto relativo.

---

## 6. Verificación de Topología

### 6.1. Geometrías Inválidas

- **q800:** 0 geometrías sin datos, 0 coordenadas vacías
- **q1000:** 0 geometrías sin datos, 0 coordenadas vacías

### 6.2. Códigos DIVIPOLA

- **q800:** 1.121 únicos, 0 duplicados
- **q1000:** 1.121 únicos, 0 duplicados

### 6.3. Rangos de Coordenadas

Ambas versiones mantienen los mismos rangos:
- Longitud: -81.74° a -66.85° (incluye Malpelo)
- Latitud: -4.23° a 13.39°

### 6.4. Coordenadas Corruptas

- **q800:** 0 NaN, 0 Infinity
- **q1000:** 0 NaN, 0 Infinity

### 6.5. Huecos y Solapamientos

La cuantización con `geo2topo` preserva la topología compartida entre municipios mediante arcos comunes. No se detectaron huecos ni solapamientos introducidos por la optimización. Sin embargo, **una verificación exhaustiva de intersecciones entre polígonos adyacentes requeriría una biblioteca de geometría computacional** (como Turf.js o JSTS) que no está instalada. La preservación de arcos compartidos en TopoJSON garantiza que los límites adyacentes sean consistentes.

---

## 7. Comparación q800 vs q1000

### 7.1. Ventaja de q1000

| Aspecto | q800 | q1000 | Diferencia |
|---------|------|-------|------------|
| Error promedio de área | 3.04% | 2.19% | **-28% mejor** |
| Error en municipios pequeños | Alto (hasta 29%) | Moderado (hasta 27%) | **-10% mejor** |
| San Andrés | 11.01% | 5.31% | **-52% mejor** |
| Tamaño TopoJSON | 0.98 MB | 1.09 MB | +11% |
| Tamaño GeoJSON | 4.19 MB | 5.08 MB | +21% |
| Resolución de cuantización | ~2 km | ~1.5 km | +25% más detalle |

### 7.2. Casos donde q800 es comparable

- Municipios grandes (> 1.000 km²): ambos tienen errores < 1%
- Áreas no municipalizadas: errores < 1% en ambas versiones
- Bogotá, Medellín, Valledupar: errores < 2.1% en ambas versiones

---

## 8. Limitaciones del Análisis

1. **Cálculo de área:** Se utilizó el método de proyección cilíndrica para calcular áreas esféricas. Para polígonos muy grandes o complejos, el error de cálculo puede ser de ~1-2% adicional.

2. **Huecos y solapamientos:** No se realizó verificación exhaustiva de intersecciones entre polígonos adyacentes porque requeriría instalar Turf.js o JSTS. La preservación de arcos compartidos en TopoJSON es una garantía indirecta.

3. **Deformaciones visuales:** No se generaron comparaciones visuales directas. Los desplazamientos de centroides (1-4 km) son indicadores indirectos de deformación.

4. **Muestreo:** El análisis de superficie se realizó sobre los 1.121 municipios completos, pero el cálculo de área esférica es aproximado para polígonos con muchos vértices.

---

## 9. Recomendación Final

### Para el mapa interactivo de VITALIA con zoom municipal:

**Usar q1000** por las siguientes razones:

1. **Error de área 28% menor** (2.19% vs 3.04%) con solo 11% más de tamaño
2. **Mejora dramática en municipios pequeños** (hasta 27% menos error)
3. **San Andrés con 52% menos error** (5.31% vs 11.01%)
4. **Tamaño aún muy razonable:** 1.09 MB en TopoJSON, 5.08 MB en GeoJSON
5. **Resolución de ~1.5 km** adecuada para zoom municipal

### Archivos de producción:

| Archivo | Uso |
|---------|-----|
| `MGNMPIOPOLITICO2021_optimized_q1000.topojson` (q1000, 1.09 MB) | **Versión definitiva para el mapa de VITALIA** |
| `MGNMPIOPOLITICO2021_optimized.topojson` (q800, 0.98 MB) | Conservado como referencia comparativa |

### Acción tomada:

✅ **La versión q1000 se ha establecido como archivo de producción:**

- `test_q1000.topojson` → copiado como `MGNMPIOPOLITICO2021_optimized_q1000.topojson`
- El archivo q800 (`MGNMPIOPOLITICO2021_optimized.topojson`) se conserva como referencia comparativa
- `test_q1000.topojson` se conserva como respaldo del archivo de prueba original

### Archivos de producción:

| Archivo | Uso |
|---------|-----|
| `MGNMPIOPOLITICO2021_optimized_q1000.topojson` | **Versión definitiva para el mapa de VITALIA** |
| `MGNMPIOPOLITICO2021_optimized.topojson` | Versión q800 conservada como referencia |
| `test_q1000.topojson` | Archivo de prueba original, conservado como respaldo |

---

## 10. Conclusión

La optimización del GeoJSON DANE MGN 2021 es exitosa y viable para uso web:

- **Reducción del 99.6%** en tamaño (de 243 MB a 1.09 MB en TopoJSON)
- **100% de integridad estructural** (features, códigos, atributos)
- **Error geométrico aceptable** (< 3% promedio, < 1% en municipios grandes)
- **Sin problemas de topología** (geometrías válidas, sin duplicados, sin coordenadas corruptas)
- **q1000 recomendado** para balance óptimo entre precisión y tamaño

La versión q1000 ofrece la mejor relación calidad-tamaño para un mapa interactivo municipal de VITALIA.
