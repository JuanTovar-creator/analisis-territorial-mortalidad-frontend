// Servicio del módulo Informes del cliente
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import {
  demoInformes,
  demoTiposInforme,
  demoDepartamentosInforme,
  demoMunicipiosInforme,
} from '@/features/client/reports/demo/reports-demo'

/**
 * Obtiene la lista de informes con filtros opcionales.
 * En modo demo devuelve datos ficticios filtrados.
 * En modo real llama a la API y propaga errores.
 */
export async function getInformes(filters = {}) {
  if (IS_DEMO_MODE) {
    let result = [...demoInformes]

    if (filters.municipio) {
      result = result.filter(i => i.municipio === filters.municipio)
    }
    if (filters.departamento) {
      result = result.filter(i => i.departamento === filters.departamento)
    }
    if (filters.tipo) {
      result = result.filter(i => i.tipo === filters.tipo)
    }
    if (filters.fechaDesde) {
      result = result.filter(i => i.fechaGeneracion >= filters.fechaDesde)
    }
    if (filters.fechaHasta) {
      result = result.filter(i => i.fechaGeneracion <= filters.fechaHasta)
    }

    return {
      informes: result,
      tipos: demoTiposInforme,
      departamentos: demoDepartamentosInforme,
      municipios: demoMunicipiosInforme,
    }
  }
  return request('/reports', { params: filters })
}

/**
 * Obtiene el detalle de un informe específico.
 * En modo demo devuelve datos ficticios.
 * En modo real llama a la API y propaga errores.
 */
export async function getInformeDetail(id) {
  if (IS_DEMO_MODE) {
    const informe = demoInformes.find(i => i.id === id)
    if (!informe) {
      throw new Error('Informe no encontrado')
    }
    return informe
  }
  return request(`/reports/${id}`)
}

/**
 * Descarga un informe en el formato especificado (pdf o csv).
 * En modo demo simula la descarga con un archivo ficticio.
 * En modo real llama a la API para obtener el archivo generado por el backend.
 */
export async function downloadInforme(id, format = 'pdf') {
  if (IS_DEMO_MODE) {
    const informe = demoInformes.find(i => i.id === id)
    if (!informe) {
      throw new Error('Informe no encontrado')
    }
    if (!informe.formatos.includes(format)) {
      throw new Error(`Formato ${format.toUpperCase()} no disponible para este informe`)
    }
    // Simulación: crear un blob ficticio para descargar
    const content = `INFORME DE DEMOSTRACIÓN\n\nID: ${informe.id}\nTítulo: ${informe.titulo}\nTipo: ${informe.tipoLabel}\nMunicipio: ${informe.municipio}\nDepartamento: ${informe.departamento}\nFecha: ${informe.fechaGeneracion}\n\nEste archivo es una simulación. En producción, el backend generará el informe real.`
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${informe.id}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return { success: true, filename: `${informe.id}.${format}` }
  }
  return request(`/reports/${id}/download?format=${format}`, { responseType: 'blob' })
}
