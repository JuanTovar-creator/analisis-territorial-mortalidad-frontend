// Servicio del Dashboard (admin y cliente)
// En modo demo devuelve datos ficticios; en modo real llama a la API.
// Los errores se propagan sin fallback a datos ficticios.

import { IS_DEMO_MODE } from '@/config/app-config'
import { request } from './api'
import { adminDemoOverview } from '@/features/admin/demo/admin-dashboard'
import {
  clientDemoPeriods,
  clientDemoMetrics,
} from '@/features/client/demo/client-dashboard'

/**
 * Obtiene los indicadores generales del Dashboard del administrador.
 * En modo demo devuelve datos ficticios.
 * En modo real llama a la API y propaga errores.
 */
export async function getAdminOverview() {
  if (IS_DEMO_MODE) {
    return adminDemoOverview
  }
  return request('/dashboard/admin')
}

/**
 * Obtiene los indicadores generales del Dashboard del cliente.
 * En modo demo devuelve datos ficticios.
 * En modo real llama a la API y propaga errores.
 */
export async function getClientOverview() {
  if (IS_DEMO_MODE) {
    return {
      periods: clientDemoPeriods,
      metrics: clientDemoMetrics,
    }
  }
  return request('/dashboard/client')
}
