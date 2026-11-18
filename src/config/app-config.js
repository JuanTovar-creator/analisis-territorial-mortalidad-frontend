// Configuración global de la aplicación
// Controla el modo de operación: demostración vs integración real con API.

/**
 * Modo demostración activado por defecto.
 *
 * Cuando IS_DEMO_MODE es `true`:
 *   - Los servicios devuelven datos ficticios de demostración.
 *   - No se realizan llamadas HTTP al backend.
 *
 * Cuando IS_DEMO_MODE es `false`:
 *   - Los servicios llaman a la API del backend.
 *   - Los errores del backend se propagan al componente y se muestran al usuario.
 *   - NO hay fallback silencioso a datos ficticios.
 *
 * Para cambiar a modo real, establece este valor en `false` y configura API_BASE_URL.
 */
export const IS_DEMO_MODE = true

/**
 * URL base del backend API.
 * Se usa solo cuando IS_DEMO_MODE es `false`.
 *
 * Ejemplo: 'http://localhost:8000/api'
 */
export const API_BASE_URL = 'http://localhost:8000'
