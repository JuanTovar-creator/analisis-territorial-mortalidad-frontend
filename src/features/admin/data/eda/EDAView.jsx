import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getEDAStatus, getEDADane, getEDARips } from '@/services/data'
import {
  edaIndicators,
} from '../demo/data-demo'
import departamentosCatalog from '@/data/departamentos.json'
import EDAIndicators from './EDAIndicators'
import EDAChart from './EDAChart'
import EDADuplicateQuality from './EDADuplicateQuality'
import EDANumericStats from './EDANumericStats'

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

// ─── Funciones genéricas de mapeo ───────────────────────────────────────

/**
 * Transforma un objeto de frecuencias {clave: {count, pct}} al formato {name, registros}.
 */
function mapearFrecuencias(freqObj) {
  if (!freqObj || typeof freqObj !== 'object') return null
  const entries = Object.entries(freqObj)
  if (entries.length === 0) return null
  return entries.map(([clave, valor]) => ({
    name: clave,
    registros: valor.count ?? 0,
  }))
}

/**
 * Transforma un array [{codigo, count}] al formato {name, registros}.
 */
function mapearTopList(list) {
  if (!Array.isArray(list) || list.length === 0) return null
  return list.map(item => ({
    name: item.codigo ?? '',
    registros: item.count ?? 0,
  }))
}

// ─── Mapeos adicionales para DANE ──────────────────────────────────────

function mapearChartGRU_ED1(data) {
  return mapearFrecuencias(data?.demografico?.gru_ed1)
}

function mapearChartGRU_ED2(data) {
  return mapearFrecuencias(data?.demografico?.gru_ed2)
}

function mapearChartEST_CIVIL(data) {
  return mapearFrecuencias(data?.demografico?.est_civil)
}

function mapearChartA_DEFUN(data) {
  return mapearFrecuencias(data?.geografico?.a_defun)
}

function mapearChartSIT_DEFUN(data) {
  return mapearFrecuencias(data?.geografico?.sit_defun)
}

function mapearChartAREA_RES(data) {
  return mapearFrecuencias(data?.geografico?.area_res)
}

function mapearChartCAU_HOMOL(data) {
  return mapearTopList(data?.causas?.cau_homol_top10)
}

function mapearChartC_BAS1(data) {
  return mapearTopList(data?.causas?.c_bas1_top10)
}

function mapearChartCAUSA_667(data) {
  return mapearTopList(data?.causas?.causa_667_top10)
}

function mapearChartASIS_MED(data) {
  return mapearFrecuencias(data?.asistencia?.asis_med)
}

// ─── Mapeos para RIPS ──────────────────────────────────────────────────

function mapearIndicadoresRips(data) {
  if (!data) return null

  const filas = data.dimensiones?.filas
  const columnas = data.dimensiones?.columnas
  const calidad = data.calidad
  const municipios = data?.geografico?.municipios_distintos
  const departamentos = data?.geografico?.departamentos_distintos

  if (!filas && !columnas) return null

  const completitud = calcularCompletitud(calidad, filas)

  return [
    {
      label: 'Registros totales',
      value: filas != null ? filas.toLocaleString() : '—',
      detail: `Fuente: ${data.dataset ?? 'RIPS'}`,
      icon: 'database',
      tone: 'primary',
    },
    {
      label: 'Municipios cubiertos',
      value: municipios != null ? municipios.toLocaleString() : '—',
      detail: municipios != null
        ? 'Municipios con atenciones registradas'
        : 'No disponible',
      icon: 'map-pin',
      tone: 'secondary',
    },
    {
      label: 'Departamentos cubiertos',
      value: departamentos != null ? departamentos.toString() : '—',
      detail: departamentos != null
        ? 'Departamentos con atenciones'
        : 'No disponible',
      icon: 'map-pin',
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

function mapearChartTipoAtencion(data) {
  const tipo = data?.univariado?.tipo_atencion
  if (!tipo || typeof tipo !== 'object') return null
  const entries = Object.entries(tipo)
  if (entries.length === 0) return null
  return entries.map(([clave, valor]) => ({
    name: clave,
    registros: valor.suma ?? valor.filas ?? 0,
  }))
}

function mapearChartDiagnostico(data) {
  const diag = data?.univariado?.diagnostico_top10
  if (!Array.isArray(diag) || diag.length === 0) return null
  return diag.map(item => ({
    name: item.codigo ?? '',
    registros: item.atenciones ?? item.filas ?? 0,
  }))
}

function mapearChartDeptoFilas(data) {
  const topFilas = data?.geografico?.top_departamentos_filas
  if (!Array.isArray(topFilas) || topFilas.length === 0) return null
  return topFilas.map(item => {
    const cod = item.cod ?? item.departamento ?? ''
    const nombre = departamentosCatalog[cod] ?? cod
    return {
      name: nombre,
      registros: item.filas ?? item.count ?? 0,
    }
  })
}

function mapearChartDeptoAtenciones(data) {
  const topAtenc = data?.geografico?.top_departamentos_atenciones
  if (!Array.isArray(topAtenc) || topAtenc.length === 0) return null
  return topAtenc.map(item => {
    const cod = item.cod ?? item.departamento ?? ''
    const nombre = departamentosCatalog[cod] ?? cod
    return {
      name: nombre,
      registros: item.atenciones ?? item.suma ?? 0,
    }
  })
}

function mapearChartCrucesDeptoTipo(data) {
  const cruces = data?.cruces?.departamento_x_tipo_atencion_top10
  if (!Array.isArray(cruces) || cruces.length === 0) return null
  return cruces.map(item => ({
    name: `${item.departamento ?? ''} — ${item.tipo_atencion ?? ''}`,
    registros: item.atenciones ?? item.count ?? 0,
  }))
}

export default function EDAView() {
  const [activeTab, setActiveTab] = useState('dane')
  const [edaStatus, setEdaStatus] = useState({ dane: null, rips: null })

  // Estado para DANE
  const [daneLoading, setDaneLoading] = useState(true)
  const [daneError, setDaneError] = useState(null)
  const [daneData, setDaneData] = useState(null)

  // Estado para RIPS
  const [ripsLoading, setRipsLoading] = useState(true)
  const [ripsError, setRipsError] = useState(null)
  const [ripsData, setRipsData] = useState(null)

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

  // Cargar las estadísticas EDA DANE
  useEffect(() => {
    let cancelled = false

    const loadDane = async () => {
      try {
        const data = await getEDADane()
        if (!cancelled) {
          setDaneData(data)
          setDaneError(null)
          setDaneLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          const mensaje = err.message?.startsWith?.('Error ') ? err.message : 'Error al conectar con el servidor'
          setDaneError(mensaje)
          setDaneLoading(false)
        }
      }
    }

    loadDane()
    return () => { cancelled = true }
  }, [])

  // Cargar las estadísticas EDA RIPS
  useEffect(() => {
    let cancelled = false

    const loadRips = async () => {
      try {
        const data = await getEDARips()
        if (!cancelled) {
          setRipsData(data)
          setRipsError(null)
          setRipsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          const mensaje = err.message?.startsWith?.('Error ') ? err.message : 'Error al conectar con el servidor'
          setRipsError(mensaje)
          setRipsLoading(false)
        }
      }
    }

    loadRips()
    return () => { cancelled = true }
  }, [])

  // ─── Datos mapeados para DANE ──────────────────────────────────────
  const daneIndicators = daneData ? mapearIndicadoresDane(daneData) : null
  const daneChartDepts = daneData ? mapearChartDepartamentos(daneData) : null
  const daneChartSexo = daneData ? mapearChartSexo(daneData) : null
  const daneChartGRU_ED1 = daneData ? mapearChartGRU_ED1(daneData) : null
  const daneChartGRU_ED2 = daneData ? mapearChartGRU_ED2(daneData) : null
  const daneChartEST_CIVIL = daneData ? mapearChartEST_CIVIL(daneData) : null
  const daneChartA_DEFUN = daneData ? mapearChartA_DEFUN(daneData) : null
  const daneChartSIT_DEFUN = daneData ? mapearChartSIT_DEFUN(daneData) : null
  const daneChartAREA_RES = daneData ? mapearChartAREA_RES(daneData) : null
  const daneChartCAU_HOMOL = daneData ? mapearChartCAU_HOMOL(daneData) : null
  const daneChartC_BAS1 = daneData ? mapearChartC_BAS1(daneData) : null
  const daneChartCAUSA_667 = daneData ? mapearChartCAUSA_667(daneData) : null
  const daneChartASIS_MED = daneData ? mapearChartASIS_MED(daneData) : null
  const daneQuality = daneData?.calidad || null

  // ─── Datos mapeados para RIPS ──────────────────────────────────────
  const ripsIndicators = ripsData ? mapearIndicadoresRips(ripsData) : null
  const ripsChartTipo = ripsData ? mapearChartTipoAtencion(ripsData) : null
  const ripsChartDiag = ripsData ? mapearChartDiagnostico(ripsData) : null
  const ripsChartDeptoFilas = ripsData ? mapearChartDeptoFilas(ripsData) : null
  const ripsChartDeptoAtenc = ripsData ? mapearChartDeptoAtenciones(ripsData) : null
  const ripsChartCruces = ripsData ? mapearChartCrucesDeptoTipo(ripsData) : null
  const ripsQuality = ripsData?.calidad || null
  const ripsNumericStats = ripsData?.numero_atenciones || null

  // ─── Render ────────────────────────────────────────────────────────
  const loading = daneLoading || ripsLoading

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

      {/* Separador visual entre estado del backend y datos del análisis */}
      <div className="border-t border-slate-200" />

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-pulse" />
            <span className="text-sm text-slate-500">Cargando datos del servidor…</span>
          </div>
        </div>
      ) : (
        /* Pestañas DANE / RIPS */
        <div>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'dane'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('dane')}
            >
              DANE
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'rips'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('rips')}
            >
              RIPS
            </button>
          </div>

          {/* Panel DANE */}
          {activeTab === 'dane' && (
            <div className="flex flex-col gap-6 mt-6">
              {daneError ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">No se pudo cargar el EDA de DANE.</p>
                  <p className="mt-1 text-xs text-amber-600">{daneError}</p>
                </div>
              ) : !daneData ? (
                <EDAIndicators indicators={edaIndicators} />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                      Datos reales del servidor
                    </Badge>
                    <span className="text-xs text-slate-500">Fuente: DANE</span>
                  </div>

                  {daneIndicators && <EDAIndicators indicators={daneIndicators} />}
                  {daneQuality && <EDADuplicateQuality quality={daneQuality} />}

                  <div className="grid gap-5 xl:grid-cols-2">
                    {daneChartDepts && (
                      <EDAChart
                        data={daneChartDepts}
                        title="Top 10 departamentos con más defunciones"
                        description="Distribución de registros según el departamento donde ocurrió el fallecimiento."
                      />
                    )}
                    {daneChartSexo && (
                      <EDAChart
                        data={daneChartSexo}
                        title="Distribución de defunciones por sexo"
                        description="Cantidad de registros según el sexo del fallecido."
                      />
                    )}
                    {daneChartGRU_ED1 && (
                      <EDAChart
                        data={daneChartGRU_ED1}
                        title="Distribución por grupo de edad (GRU_ED1)"
                        description="Registros según el grupo de edad principal del fallecido."
                      />
                    )}
                    {daneChartGRU_ED2 && (
                      <EDAChart
                        data={daneChartGRU_ED2}
                        title="Distribución por grupo de edad (GRU_ED2)"
                        description="Registros según el grupo de edad detallado del fallecido."
                      />
                    )}
                    {daneChartEST_CIVIL && (
                      <EDAChart
                        data={daneChartEST_CIVIL}
                        title="Distribución por estado civil"
                        description="Registros según el estado civil del fallecido."
                      />
                    )}
                    {daneChartA_DEFUN && (
                      <EDAChart
                        data={daneChartA_DEFUN}
                        title="Lugar de defunción (A_DEFUN)"
                        description="Registros según el lugar donde ocurrió la defunción."
                      />
                    )}
                    {daneChartSIT_DEFUN && (
                      <EDAChart
                        data={daneChartSIT_DEFUN}
                        title="Sitio de defunción (SIT_DEFUN)"
                        description="Registros según el sitio específico de la defunción."
                      />
                    )}
                    {daneChartAREA_RES && (
                      <EDAChart
                        data={daneChartAREA_RES}
                        title="Área de residencia"
                        description="Registros según el área de residencia del fallecido (Urbano/Rural)."
                      />
                    )}
                    {daneChartCAU_HOMOL && (
                      <EDAChart
                        data={daneChartCAU_HOMOL}
                        title="Top 10 causas de muerte (CAU_HOMOL)"
                        description="Causas de muerte homologadas más frecuentes."
                      />
                    )}
                    {daneChartC_BAS1 && (
                      <EDAChart
                        data={daneChartC_BAS1}
                        title="Top 10 causas básicas (C_BAS1)"
                        description="Causas básicas de muerte más frecuentes."
                      />
                    )}
                    {daneChartCAUSA_667 && (
                      <EDAChart
                        data={daneChartCAUSA_667}
                        title="Top 10 causas 667"
                        description="Causas 667 más frecuentes."
                      />
                    )}
                    {daneChartASIS_MED && (
                      <EDAChart
                        data={daneChartASIS_MED}
                        title="Asistencia médica"
                        description="Registros según si hubo asistencia médica."
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Panel RIPS */}
          {activeTab === 'rips' && (
            <div className="flex flex-col gap-6 mt-6">
              {ripsError ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">No se pudo cargar el EDA de RIPS.</p>
                  <p className="mt-1 text-xs text-amber-600">{ripsError}</p>
                </div>
              ) : !ripsData ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">No hay datos EDA de RIPS disponibles.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                      Datos reales del servidor
                    </Badge>
                    <span className="text-xs text-slate-500">Fuente: RIPS</span>
                  </div>

                  {ripsIndicators && <EDAIndicators indicators={ripsIndicators} />}
                  {ripsQuality && <EDADuplicateQuality quality={ripsQuality} />}
                  {ripsNumericStats && (
                    <EDANumericStats
                      stats={ripsNumericStats}
                      title="Estadísticas de atenciones"
                      description="Resumen estadístico del número de atenciones por municipio y diagnóstico."
                    />
                  )}

                  <div className="grid gap-5 xl:grid-cols-2">
                    {ripsChartTipo && (
                      <EDAChart
                        data={ripsChartTipo}
                        title="Distribución por tipo de atención"
                        description="Atenciones totales según el tipo (Consulta, Procedimiento, Urgencia, Hospitalización)."
                      />
                    )}
                    {ripsChartDiag && (
                      <EDAChart
                        data={ripsChartDiag}
                        title="Top 10 diagnósticos"
                        description="Diagnósticos con mayor número de atenciones registradas."
                      />
                    )}
                    {ripsChartDeptoFilas && (
                      <EDAChart
                        data={ripsChartDeptoFilas}
                        title="Top 10 departamentos por registros"
                        description="Departamentos con más filas de atenciones registradas."
                      />
                    )}
                    {ripsChartDeptoAtenc && (
                      <EDAChart
                        data={ripsChartDeptoAtenc}
                        title="Top 10 departamentos por atenciones"
                        description="Departamentos con mayor volumen total de atenciones."
                      />
                    )}
                    {ripsChartCruces && (
                      <EDAChart
                        data={ripsChartCruces}
                        title="Cruces: Departamento × Tipo de atención"
                        description="Combinaciones de departamento y tipo de atención con más atenciones."
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
