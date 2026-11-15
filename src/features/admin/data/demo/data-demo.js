// Datos ficticios de demostración para el módulo Datos
// Los componentes reciben estos datos como props (patrón API-ready)

export const edaIndicators = [
  { label: 'Registros totales', value: '12 480', detail: 'Filas en el dataset integrado', icon: 'database', tone: 'primary' },
  { label: 'Municipios cubiertos', value: '45', detail: 'De 45 municipios en la muestra', icon: 'map-pin', tone: 'secondary' },
  { label: 'Variables disponibles', value: '28', detail: 'Camúnicos en el esquema actual', icon: 'table', tone: 'primary' },
  { label: 'Completitud general', value: '87%', detail: 'Proporción de celdas no vacías', icon: 'check-circle', tone: 'secondary' },
]

export const edaChartData = [
  { name: 'DANE', registros: 4200 },
  { name: 'RIPS', registros: 3800 },
  { name: 'SIIOV', registros: 2100 },
  { name: 'MISAU', registros: 1500 },
  { name: 'Otras', registros: 880 },
]

export const edaSummaryData = [
  { categoria: 'Datos demográficos', variables: 8, registros: 4200, completitud: '92%' },
  { categoria: 'Indicadores de salud', variables: 10, registros: 3800, completitud: '85%' },
  { categoria: 'Violencia y victimación', variables: 5, registros: 2100, completitud: '78%' },
  { categoria: 'Servicios públicos', variables: 3, registros: 1500, completitud: '90%' },
  { categoria: 'Georreferenciación', variables: 2, registros: 880, completitud: '81%' },
]

export const edaFilters = {
  periodos: ['2020', '2021', '2022', '2023', '2024'],
  tipos: ['DANE', 'RIPS', 'SIIOV', 'MISAU', 'Otras'],
}

export const dataQuality = {
  missingValues: [
    { variable: 'Ingresos per cápita', faltantes: 320, porcentaje: 2.6 },
    { variable: 'Tasa de mortalidad', faltantes: 180, porcentaje: 1.4 },
    { variable: 'Acceso a agua potable', faltantes: 450, porcentaje: 3.6 },
    { variable: 'Cobertura sanitaria', faltantes: 210, porcentaje: 1.7 },
    { variable: 'Índice de pobreza', faltantes: 560, porcentaje: 4.5 },
    { variable: 'Densidad poblacional', faltantes: 90, porcentaje: 0.7 },
  ],
  duplicates: [
    { fuente: 'DANE', registros_duplicados: 12, porcentaje: 0.3 },
    { fuente: 'RIPS', registros_duplicados: 28, porcentaje: 0.7 },
    { fuente: 'SIIOV', registros_duplicados: 5, porcentaje: 0.2 },
    { fuente: 'MISAU', registros_duplicados: 3, porcentaje: 0.2 },
  ],
  overallCompleteness: 87,
}

export const pipelineStages = [
  { id: 'validation', title: 'Validación', description: 'Verificar estructura y tipos de datos', icon: 'shield-check' },
  { id: 'cleaning', title: 'Limpieza', description: 'Eliminar duplicados y manejar valores nulos', icon: 'sparkles' },
  { id: 'transformation', title: 'Transformación', description: 'Normalizar y estandarizar variables', icon: 'arrow-right-left' },
  { id: 'aggregation', title: 'Agregación', description: 'Consolidar datos por municipio y periodo', icon: 'combine' },
  { id: 'integration', title: 'Integración', description: 'Unificar fuentes en dataset final', icon: 'database-zip' },
]

// 45 municipios ficticios con datos sintéticos
const departamentos = ['Antioquia', 'Bogotá D.C.', 'Bolívar', 'Caldas', 'Cesar', 'Córdoba', 'Cundinamarca', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca']
const tipos = ['Rural', 'Urbano', 'Mixto']
const estados = ['Completado', 'En proceso', 'Pendiente']

function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

const rng = seededRandom(42)

export const integratedDataset = Array.from({ length: 45 }, (_, i) => {
  const deptIndex = Math.floor(rng() * departamentos.length)
  const tipoIndex = Math.floor(rng() * tipos.length)
  const estadoIndex = Math.floor(rng() * estados.length)
  const registros = Math.floor(rng() * 500) + 50
  const variables = Math.floor(rng() * 15) + 10
  const completitud = Math.floor(rng() * 30) + 70

  return {
    id: i + 1,
    municipio: `Municipio ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ''}`,
    departamento: departamentos[deptIndex],
    tipo: tipos[tipoIndex],
    registros,
    variables,
    completitud: `${completitud}%`,
    completitudNum: completitud,
    estado: estados[estadoIndex],
  }
})
