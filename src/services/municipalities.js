// Servicio del módulo Municipios del cliente
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import { demoMunicipalities, demoDepartamentos, demoRiesgos } from '@/features/client/municipalities/demo/municipalities-demo'

/**
 * Obtiene la lista de municipios con sus indicadores y predicciones.
 * En modo demo devuelve datos ficticios.
 * En modo real llama a la API y propaga errores.
 */
export async function getMunicipalities() {
  if (IS_DEMO_MODE) {
    return {
      municipalities: demoMunicipalities,
      departamentos: demoDepartamentos,
      riesgos: demoRiesgos,
    }
  }
  return request('/municipalities')
}

/**
 * Obtiene el detalle de un municipio específico.
 * En modo demo devuelve datos ficticios.
 * En modo real llama a la API y propaga errores.
 */
export async function getMunicipalityDetail(id) {
  if (IS_DEMO_MODE) {
    const municipality = demoMunicipalities.find(m => m.id === id)
    if (!municipality) {
      throw new Error('Municipio no encontrado')
    }
    return municipality
  }
  return request(`/municipalities/${id}`)
}
