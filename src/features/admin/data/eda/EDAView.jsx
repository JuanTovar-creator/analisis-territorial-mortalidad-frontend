import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getEDAStatus, getEDADane } from '@/services/data'
import {
  edaIndicators,
  edaChartData,
  edaSummaryData,
  edaFilters,
  dataQuality,
} from '../demo/data-demo'
import departamentosCatalog from '@/data/departamentos.json'
import EDAFilters from './EDAFilters'
import EDAIndicators from './EDAIndicators'
import EDAChart from './EDAChart'
import EDADataQuality from './EDADataQuality'
import EDASummaryTable from './EDASummaryTable'

/**
 * Tarjeta de estado real del EDA para un dataset (DANE o RIPS).
 * Muestra disponibilidad, vigencia, fecha de generación y filas.
 */
function EDAStatusCard({ label, status }) {
  if (status === null) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-pulse" />
          <span className="text-sm font-medium text-slate-500">{label}</span>
          <span className="text-xs text-slate-400 ml-auto">Cargando…</span>
        </div>
      </div>
    )
  }

  if (status.error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="text-sm font-medium text-amber-800">{label}</span>
          <span className="text-xs text-amber-600 ml-auto">No disponible</span>
        </div>
        <p className="mt-1 text-xs text-amber-700">{status.error}</p>
      </div>
    )
  }

  const disponible = status.disponible === true
  const vigente = status.vigente === true

  return (
    <div className={`rounded-lg border p-4 ${disponible ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-2">
        <div className={`h-2.5 w-2.5 rounded-full ${disponible ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {disponible && vigente && (
          <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">Vigente</Badge>
        )}
        {disponible && !vigente && (
          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">Desactualizado</Badge>
        )}
        {!disponible && (
          <Badge variant="outline" className="text-slate-500 border-slate-300 bg-slate-100">No generado</Badge>
        )}
      </div>
      {disponible && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          <span>Filas: {status.filas?.toLocaleString() ?? '—'}</span>
          <span>Generado: {status.generado_en ?? '—'}</span>
          {status.archivo_raw && <span>Archivo: {status.archivo_raw}</span>}
        </div>
      )}
    </div>
  )
}

/**
 * Calcula la completitud general a partir de los datos de calidad del backend.
 * Evita duplicar nulos y vacíos para la misma columna tomando el máximo.
 * Devuelve un porcentaje entre 0 y 100, o null si no se puede calcular.
 */
function calcularCompletitud(calidad, filas) {
  if (!calidad || !filas || filas <= 0) return null

  const nulos = calidad.nulos_por_columna || {}
  const vacios = calidad.vacios_por_columna || {}

  // Recopilar todas las columnas que tienen nulos o vacíos
  const columnasConProblemas = new Set([...Object.keys(nulos), ...Object.keys(vacios)])

  if (columnasConProblemas.size === 0) return 100

  // Sumar los problemas por columna, tomando el máximo para evitar duplicar
  let totalProblemas = 0
  columnasConProblemas.forEach(col => {
    const n = nulos[col] || 0
    const v = vacios[col] || 0
    totalProblemas += Math.max(n, v)
  })

  const totalCeldas = filas * columnasConProblemas.size
  if (totalCeldas <= 0) return null

  const pct = ((totalCeldas - totalProblemas) / totalCeldas) * 100
  return Math.max(0, Math.min(100, pct))
}

/**
 * Transforma geografico.top_departamentos al formato de EDAChart.
 * Usa el catálogo de departamentos DANE para mostrar nombres reales.
 */
function mapearChartDepartamentos(data) {
  const topDepts = data?.geografico?.top_departamentos
  if (!Array.isArray(topDepts) || topDepts.length === 0) return null

  return topDepts.map(item => {
    const cod = item.cod ?? ''
    const nombre = departamentosCatalog[cod] ?? cod
    return {
      name: nombre,
      registros: item.count ?? 0,
    }
  })
}

/**
 * Transforma demografico.sexo al formato de EDAChart.
 * El backend devuelve los códigos del DANE: "1" = Hombre, "2" = Mujer.
 * Se mapea a [{name, registros}] con etiquetas legibles.
 */
function mapearChartSexo(data) {
  const sexo = data?.demografico?.sexo
  if (!sexo || typeof sexo !== 'object') return null

  const etiquetaSexo = { '1': 'Hombre', '2': 'Mujer' }
  const entries = Object.entries(sexo)

  if (entries.length === 0) return null

  return entries.map(([clave, valor]) => ({
    name: etiquetaSexo[clave] ?? clave,
    registros: valor.count ?? 0,
  }))
}

/**
 * Transforma la respuesta de GET /eda/dane al formato de EDAIndicators.
 */
function mapearIndicadoresDane(data) {
  if (!data) return null

  const filas = data.dimensiones?.filas
  const columnas = data.dimensiones?.columnas
  const topDepts = data.geografico?.top_departamentos
  const calidad = data.calidad

  if (!filas && !columnas) return null

  const departamentos = Array.isArray(topDepts) ? topDepts.length : null
  const completitud = calcularCompletitud(calidad, filas)

  return [
    {
      label: 'Registros totales',
      value: filas != null ? filas.toLocaleString() : '—',
      detail: `Fuente: ${data.dataset ?? 'DANE'}`,
      icon: 'database',
      tone: 'primary',
    },
    {
      label: 'Departamentos en el ranking',
      value: departamentos != null ? departamentos.toString() : '—',
      detail: departamentos != null
        ? `Top departamentos con datos`
        : 'No disponible',
      icon: 'map-pin',
      tone: 'secondary',
    },
    {
      label: 'Variables disponibles',
      value: columnas != null ? columnas.toString() : '—',
      detail: 'Columnas en el dataset',
      icon: 'table',
      tone: 'primary',
    },
    {
      label: 'Completitud general',
      value: completitud != null ? `${completitud.toFixed(1)}%` : 'No disponible',
      detail: completitud != null
        ? 'Calculado a partir de nulos y vacíos'
        : 'No se pudo calcular',
      icon: 'check-circle',
      tone: 'secondary',
    },
  ]
}

export default function EDAView() {
  const [periodo, setPeriodo] = useState('all')
  const [tipo, setTipo] = useState('all')
  const [edaStatus, setEdaStatus] = useState({ dane: null, rips: null })

  // Estado para los indicadores reales del EDA DANE
  const [edaIndicatorsReal, setEdaIndicatorsReal] = useState(null)
  const [edaIndicatorsLoading, setEdaIndicatorsLoading] = useState(true)
  const [edaIndicatorsError, setEdaIndicatorsError] = useState(null)

  // Estado para la gráfica real de departamentos
  const [edaChartDataReal, setEdaChartDataReal] = useState(null)

  // Estado para la gráfica real de distribución por sexo
  const [edaChartSexoReal, setEdaChartSexoReal] = useState(null)

  // Cargar el estado real del EDA desde el backend
  useEffect(() => {
    let cancelled = false

    const loadStatus = async () => {
      try {
        const data = await getEDAStatus()
        if (!cancelled) {
          setEdaStatus({
            dane: data?.dane ?? { disponible: false, vigente: false },
            rips: data?.rips ?? { disponible: false, vigente: false },
          })
        }
      } catch (err) {
        if (!cancelled) {
          const mensaje = err.message?.startsWith?.('Error ') ? err.message : 'Error al conectar con el servidor'
          setEdaStatus({
            dane: { error: mensaje },
            rips: { error: mensaje },
          })
        }
      }
    }

    loadStatus()
    return () => { cancelled = true }
  }, [])

  // Cargar las estadísticas EDA DANE reales para indicadores y gráfica
  useEffect(() => {
    let cancelled = false

    const loadIndicators = async () => {
      try {
        const data = await getEDADane()
        if (!cancelled) {
          const indicators = mapearIndicadoresDane(data)
          if (indicators) {
            setEdaIndicatorsReal(indicators)
            setEdaIndicatorsError(null)
          } else {
            setEdaIndicatorsError('Respuesta sin datos suficientes')
          }
          setEdaIndicatorsLoading(false)

          // Reutilizar los mismos datos para la gráfica de departamentos
          const chartData = mapearChartDepartamentos(data)
          setEdaChartDataReal(chartData)

          // Reutilizar los mismos datos para la gráfica de distribución por sexo
          const chartSexo = mapearChartSexo(data)
          setEdaChartSexoReal(chartSexo)
        }
      } catch (err) {
        if (!cancelled) {
          const mensaje = err.message?.startsWith?.('Error ') ? err.message : 'Error al conectar con el servidor'
          setEdaIndicatorsError(mensaje)
          setEdaIndicatorsLoading(false)
        }
      }
    }

    loadIndicators()
    return () => { cancelled = true }
  }, [])

  // Simulated filtering — in a real app this would query the API
  const filteredChartData = useMemo(() => {
    if (tipo === 'all') return edaChartData
    return edaChartData.filter(item => item.name === tipo)
  }, [tipo])

  const filteredSummaryData = useMemo(() => {
    // In a real app, both filters would affect the data
    return edaSummaryData
  }, [periodo, tipo])

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-slate-800">Análisis exploratorio de datos</h2>

      {/* Estado real del EDA — datos del backend */}
      <div>
        <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Estado real del servidor</p>
        <div className="grid gap-3 md:grid-cols-2">
          <EDAStatusCard label="DANE" status={edaStatus.dane} />
          <EDAStatusCard label="RIPS" status={edaStatus.rips} />
        </div>
      </div>

      {/* Separador visual entre estado real y datos de demostración */}
      <div className="border-t border-slate-200" />

      <EDAFilters
        periodos={edaFilters.periodos}
        tipos={edaFilters.tipos}
        periodo={periodo}
        onPeriodChange={setPeriodo}
        tipo={tipo}
        onTipoChange={setTipo}
      />

      {/* Indicadores EDA — reales del servidor o demo como fallback */}
      {edaIndicatorsLoading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-pulse" />
            <span className="text-sm text-slate-500">Cargando indicadores del servidor…</span>
          </div>
        </div>
      ) : edaIndicatorsError || !edaIndicatorsReal ? (
        /* Fallback a datos demo si el backend no responde */
        <>
          <EDAIndicators indicators={edaIndicators} />
        </>
      ) : (
        /* Indicadores reales del servidor */
        <>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
              Datos reales del servidor
            </Badge>
            <span className="text-xs text-slate-500">Fuente: DANE</span>
          </div>
          <EDAIndicators indicators={edaIndicatorsReal} />
        </>
      )}

      {/* Gráficas — reales o demo como fallback */}
      {edaChartDataReal && edaChartSexoReal ? (
        <>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
              Datos reales del servidor
            </Badge>
            <span className="text-xs text-slate-500">Fuente: DANE</span>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <EDAChart
              data={edaChartDataReal}
              title="Top 10 departamentos con más defunciones"
              description="Distribución de registros según el departamento donde ocurrió el fallecimiento."
            />
            <EDAChart
              data={edaChartSexoReal}
              title="Distribución de defunciones por sexo"
              description="Cantidad de registros según el sexo del fallecido."
            />
          </div>
          <EDADataQuality quality={dataQuality} />
        </>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <EDAChart data={filteredChartData} />
            <EDADataQuality quality={dataQuality} />
          </div>
        </>
      )}

      <EDASummaryTable data={filteredSummaryData} />
    </div>
  )
}
