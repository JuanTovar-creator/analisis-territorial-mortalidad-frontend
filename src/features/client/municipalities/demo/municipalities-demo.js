// Datos ficticios de demostración para el módulo Municipios del cliente
// Los componentes reciben estos datos como props (patrón API-ready)
// En producción, el backend suministrará indicadores, riesgos y predicciones.

const departamentos = [
  'Antioquia', 'Bogotá D.C.', 'Bolívar', 'Caldas', 'Cesar',
  'Córdoba', 'Cundinamarca', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
]
const tipos = ['Rural', 'Urbano', 'Mixto']
const riesgos = ['Bajo', 'Moderado', 'Alto', 'Muy alto']

function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

const rng = seededRandom(42)

export const demoMunicipalities = Array.from({ length: 45 }, (_, i) => {
  const deptIndex = Math.floor(rng() * departamentos.length)
  const tipoIndex = Math.floor(rng() * tipos.length)
  const riesgoIndex = Math.floor(rng() * riesgos.length)
  const poblacion = Math.floor(rng() * 50000) + 1000
  const coberturaSanitaria = Math.floor(rng() * 40) + 60
  const tasaMortalidad = +(rng() * 8 + 2).toFixed(2)
  const accesoAgua = Math.floor(rng() * 35) + 65
  const indicePobreza = +(rng() * 0.5 + 0.1).toFixed(2)
  const predicciones = {
    probabilidadRiesgo: +(rng() * 0.6 + 0.1).toFixed(3),
    tendencia: rng() > 0.5 ? 'Estable' : rng() > 0.25 ? 'En aumento' : 'En descenso',
    nivelPredicho: riesgos[Math.floor(rng() * riesgos.length)],
  }

  return {
    id: i + 1,
    municipio: `Municipio ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ''}`,
    departamento: departamentos[deptIndex],
    tipo: tipos[tipoIndex],
    riesgo: riesgos[riesgoIndex],
    poblacion,
    coberturaSanitaria,
    tasaMortalidad,
    accesoAgua,
    indicePobreza,
    predicciones,
  }
})

export const demoDepartamentos = [...new Set(demoMunicipalities.map(m => m.departamento))].sort()

export const demoRiesgos = riesgos
