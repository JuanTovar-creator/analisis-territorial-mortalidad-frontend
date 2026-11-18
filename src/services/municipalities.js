// Servicio del módulo Municipios del cliente
// getMunicipalities() consume /predictions/municipios y /predictions/resumen-todos.
// Combina los códigos con los resúmenes agregados y el catálogo de departamentos.
// Los errores se propagan sin fallback a datos ficticios.

import { getMunicipiosList, getResumenTodos } from './predictions'
import { demoMunicipalities } from '@/features/client/municipalities/demo/municipalities-demo'
import municipiosCatalog from '@/data/municipios.json'
import departamentosCatalog from '@/data/departamentos.json'

/**
 * Extrae el nombre del departamento a partir del código DANE de 5 dígitos.
 * Los dos primeros dígitos identifican el departamento.
 */
function getDepartamento(codigo) {
  const prefijo = String(codigo).slice(0, 2)
  return departamentosCatalog[prefijo] || 'No disponible'
}

/**
 * Obtiene la lista de municipios desde el backend real combinando
 * /predictions/municipios (códigos) con /predictions/resumen-todos (datos agregados).
 * Siempre llama a la API real, sin depender de IS_DEMO_MODE.
 */
export async function getMunicipalities() {
  // Obtener lista de códigos y resumen agregado en paralelo
  const [listaData, resumenData] = await Promise.all([
    getMunicipiosList(),
    getResumenTodos().catch(() => null), // Si resumen-todos falla, se continúa sin datos agregados
  ])

  // Crear un mapa de resumen por código para acceso rápido
  const resumenMap = {}
  if (resumenData && Array.isArray(resumenData.municipios)) {
    resumenData.municipios.forEach((m) => {
      resumenMap[m.codigo_municipio] = m
    })
  }

  const municipios = listaData.municipios.map((codigo, index) => {
    const nombre = municipiosCatalog[codigo] || 'Municipio no identificado'
    const resumen = resumenMap[codigo]
    const departamento = getDepartamento(codigo)

    return {
      id: index + 1,
      codigo,
      municipio: `${nombre} (${codigo})`,
      departamento,
      // Datos reales del backend
      promedioPredicho: resumen?.promedio_predicho ?? null,
      promedioObservado: resumen?.promedio_observado ?? null,
      totalDiagnosticos: resumen?.total_diagnosticos ?? null,
      // Compatibilidad con detalle existente
      coberturaSanitaria: 0,
      accesoAgua: 0,
      indicePobreza: 0,
      predicciones: {
        probabilidadRiesgo: resumen?.promedio_predicho ?? null,
        tendencia: 'N/A',
        nivelPredicho: 'N/A',
      },
    }
  })

  // Extraer la lista única de departamentos para el filtro
  const departamentosSet = new Set(municipios.map((m) => m.departamento).filter((d) => d !== 'No disponible'))
  const departamentos = Array.from(departamentosSet).sort()

  return {
    municipalities: municipios,
    departamentos,
    riesgos: [],
    total: listaData.total_municipios,
  }
}

/**
 * Obtiene el detalle de un municipio específico.
 * Actualmente devuelve datos demo; se integrará con el backend cuando se conecte el detalle.
 */
export async function getMunicipalityDetail(id) {
  const municipality = demoMunicipalities.find(m => m.id === id)
  if (!municipality) {
    throw new Error('Municipio no encontrado')
  }
  return municipality
}
