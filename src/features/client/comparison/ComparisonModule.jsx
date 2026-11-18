import { useEffect, useMemo, useState } from 'react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { getMunicipalities } from '@/services/municipalities'
import { getCompararResumen } from '@/services/predictions'
import MunicipalitySelector from './MunicipalitySelector'
import ComparisonTable from './ComparisonTable'
import ComparisonCharts from './ComparisonCharts'

const MIN_SELECTION = 2
const MAX_SELECTION = 5

export default function ComparisonModule() {
  const [municipalities, setMunicipalities] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Selection state
  const [selectedIds, setSelectedIds] = useState([])

  // Comparison data from backend
  const [comparisonData, setComparisonData] = useState(null)
  const [comparisonLoading, setComparisonLoading] = useState(false)
  const [comparisonError, setComparisonError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getMunicipalities()
      .then(data => {
        if (!cancelled) {
          setMunicipalities(data.municipalities || [])
          setDepartamentos(data.departamentos || [])
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar los municipios')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const selectedMunicipalities = useMemo(() => {
    return selectedIds.map(id => municipalities.find(m => m.id === id)).filter(Boolean)
  }, [selectedIds, municipalities])

  const availableMunicipalities = useMemo(() => {
    return municipalities.filter(m => !selectedIds.includes(m.id))
  }, [municipalities, selectedIds])

  // Fetch comparison data from backend when selection changes
  useEffect(() => {
    if (selectedMunicipalities.length < MIN_SELECTION) {
      setComparisonData(null)
      setComparisonError(null)
      return
    }

    let cancelled = false
    setComparisonLoading(true)
    setComparisonError(null)

    const codigos = selectedMunicipalities.map(m => m.codigo)
    getCompararResumen(codigos)
      .then(data => {
        if (!cancelled) {
          // Merge backend comparison data with local municipality data
          const resumenMap = {}
          if (data.municipios && Array.isArray(data.municipios)) {
            data.municipios.forEach(r => {
              resumenMap[r.codigo_municipio] = r
            })
          }

          const enriched = selectedMunicipalities.map(m => {
            const resumen = resumenMap[m.codigo]
            return {
              ...m,
              promedioPredicho: resumen?.promedio_predicho ?? m.promedioPredicho,
              promedioObservado: resumen?.promedio_observado ?? m.promedioObservado,
              totalDiagnosticos: resumen?.total_diagnosticos ?? m.totalDiagnosticos,
            }
          })

          setComparisonData(enriched)
        }
      })
      .catch(err => {
        if (!cancelled) {
          // Fallback to pre-loaded data if comparison endpoint fails
          setComparisonData(selectedMunicipalities)
          setComparisonError(err.message || 'Error al obtener datos de comparación')
        }
      })
      .finally(() => {
        if (!cancelled) setComparisonLoading(false)
      })

    return () => { cancelled = true }
  }, [selectedMunicipalities])

  const handleAddMunicipality = (id) => {
    if (selectedIds.length < MAX_SELECTION && !selectedIds.includes(id)) {
      setSelectedIds(prev => [...prev, id])
    }
  }

  const handleRemoveMunicipality = (id) => {
    setSelectedIds(prev => prev.filter(sid => sid !== id))
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Comparación territorial" description="Cargando datos..." />
        <StatePanel state="loading" title="Cargando municipios" description="Obteniendo los datos para la comparación..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Comparación territorial" description="Error al cargar datos" />
        <StatePanel state="error" title="Error al cargar municipios" description={error} />
      </div>
    )
  }

  if (municipalities.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Comparación territorial" description="Sin datos disponibles" />
        <StatePanel
          title="Sin municipios disponibles"
          description="No hay municipios para comparar. El backend debe suministrar los datos territoriales primero."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ANÁLISIS TERRITORIAL"
        title="Comparación territorial"
        description="Compara el porcentaje de defunciones sin asistencia médica entre municipios."
      />
      {/* Selector */}
      <MunicipalitySelector
        available={availableMunicipalities}
        selected={selectedMunicipalities}
        departamentos={departamentos}
        onAdd={handleAddMunicipality}
        onRemove={handleRemoveMunicipality}
        minSelection={MIN_SELECTION}
        maxSelection={MAX_SELECTION}
      />

      {/* Comparison content */}
      {selectedMunicipalities.length >= MIN_SELECTION ? (
        <div className="flex flex-col gap-6">
          {comparisonLoading ? (
            <StatePanel state="loading" title="Cargando comparación" description="Obteniendo datos de comparación del backend..." />
          ) : comparisonData ? (
            <>
              {comparisonError && (
                <StatePanel
                  state="warning"
                  title="Advertencia"
                  description={`No se pudo obtener la comparación actualizada del backend: ${comparisonError}. Se muestran los datos disponibles localmente.`}
                />
              )}
              <ComparisonTable data={comparisonData} />
              <ComparisonCharts data={comparisonData} />
            </>
          ) : (
            <StatePanel
              title="Sin datos de comparación"
              description="No hay datos de predicción disponibles para los municipios seleccionados."
            />
          )}
        </div>
      ) : (
        <StatePanel
          title={`Selecciona al menos ${MIN_SELECTION} municipios`}
          description={`Añade entre ${MIN_SELECTION} y ${MAX_SELECTION} municipios para comparar el porcentaje de defunciones sin asistencia médica.`}
        />
      )}
    </div>
  )
}
