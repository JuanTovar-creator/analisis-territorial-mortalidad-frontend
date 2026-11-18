// Servicio del módulo Municipios del cliente
// getMunicipalities() ahora consume el backend real /predictions/municipios.
// getMunicipalityDetail() sigue usando datos demo hasta integrar el detalle.
// Los errores se propagan sin fallback a datos ficticios.

import { getMunicipiosList } from './predictions'
import { demoMunicipalities } from '@/features/client/municipalities/demo/municipalities-demo'
import municipiosCatalog from '@/data/municipios.json'

/**
 * Mapea un código de municipio del backend a un objeto compatible con la tabla y filtros del frontend.
 * Como el backend solo devuelve códigos numéricos, se usan valores por defecto para los campos faltantes.
 */
function mapCodigoToMunicipio(codigo, index) {
  const nombre = municipiosCatalog[codigo] || 'Municipio no identificado'
  return {
    id: index + 1,
    codigo,
    municipio: `${nombre} (${codigo})`,
    departamento: 'Por determinar',
    tipo: 'N/A',
    riesgo: 'N/A',
    poblacion: 0,
    coberturaSanitaria: 0,
    tasaMortalidad: 0,
    accesoAgua: 0,
    indicePobreza: 0,
    predicciones: {
      probabilidadRiesgo: 0,
      tendencia: 'N/A',
      nivelPredicho: 'N/A',
    },
  }
}

/**
 * Obtiene la lista de municipios desde el backend real /predictions/municipios.
 * Transforma los códigos numéricos a objetos compatibles con la interfaz.
 * Siempre llama a la API real, sin depender de IS_DEMO_MODE.
 */
export async function getMunicipalities() {
  const data = await getMunicipiosList()
  const municipios = data.municipios.map((codigo, index) => mapCodigoToMunicipio(codigo, index))
  return {
    municipalities: municipios,
    departamentos: [],
    riesgos: [],
    total: data.total_municipios,
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
