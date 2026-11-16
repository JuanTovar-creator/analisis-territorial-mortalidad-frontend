import { useEffect, useMemo, useState } from 'react'
import { GitCompareArrows } from 'lucide-react'
import { DemoNotice, StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { getMunicipalities } from '@/services/municipalities'
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
        description="Compara indicadores, niveles de riesgo y predicciones entre municipios."
      />
      <DemoNotice />

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
          <ComparisonTable data={selectedMunicipalities} />
          <ComparisonCharts data={selectedMunicipalities} />
        </div>
      ) : (
        <StatePanel
          title={`Selecciona al menos ${MIN_SELECTION} municipios`}
          description={`Añade entre ${MIN_SELECTION} y ${MAX_SELECTION} municipios para comparar sus indicadores, niveles de riesgo y predicciones del modelo.`}
        />
      )}
    </div>
  )
}
