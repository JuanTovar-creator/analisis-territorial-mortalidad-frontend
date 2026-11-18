import { useEffect, useMemo, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { getMunicipalities } from '@/services/municipalities'
import MunicipalitiesFilters from './MunicipalitiesFilters'
import MunicipalitiesTable from './MunicipalitiesTable'
import MunicipalityDetail from './MunicipalityDetail'

export default function MunicipalitiesModule() {
  const [municipalities, setMunicipalities] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [riesgos, setRiesgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [riesgo, setRiesgo] = useState('')

  // Detail view
  const [selectedMunicipality, setSelectedMunicipality] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getMunicipalities()
      .then(data => {
        if (!cancelled) {
          setMunicipalities(data.municipalities || [])
          setDepartamentos(data.departamentos || [])
          setRiesgos(data.riesgos || [])
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

  const filteredMunicipalities = useMemo(() => {
    return municipalities.filter(m => {
      const searchLower = search.toLowerCase()
      const matchesSearch = !search ||
        m.municipio.toLowerCase().includes(searchLower) ||
        m.codigo.includes(searchLower)
      const matchesDepartamento = !departamento || m.departamento === departamento
      const matchesRiesgo = !riesgo || m.riesgo === riesgo
      return matchesSearch && matchesDepartamento && matchesRiesgo
    })
  }, [municipalities, search, departamento, riesgo])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Municipios" description="Cargando datos..." />
        <StatePanel state="loading" title="Cargando municipios" description="Obteniendo los datos territoriales..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Municipios" description="Error al cargar datos" />
        <StatePanel state="error" title="Error al cargar municipios" description={error} />
      </div>
    )
  }

  // Detail view
  if (selectedMunicipality) {
    return (
      <div className="flex flex-col gap-6">
        <MunicipalityDetail
          municipality={selectedMunicipality}
          onClose={() => setSelectedMunicipality(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ANÁLISIS TERRITORIAL"
        title="Municipios"
        description="Consulta de municipios disponibles en el sistema de predicción."
      />

      {/* Filters */}
      <MunicipalitiesFilters
        search={search}
        onSearchChange={setSearch}
        departamento={departamento}
        onDepartamentoChange={setDepartamento}
        riesgo={riesgo}
        onRiesgoChange={setRiesgo}
        departamentos={departamentos}
        riesgos={riesgos}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredMunicipalities.length} municipio{filteredMunicipalities.length !== 1 ? 's' : ''} encontrado{filteredMunicipalities.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table or empty state */}
      {filteredMunicipalities.length > 0 ? (
        <MunicipalitiesTable
          data={filteredMunicipalities}
          onSelectMunicipality={setSelectedMunicipality}
        />
      ) : (
        <StatePanel
          title="Sin resultados"
          description="No se encontraron municipios con los filtros seleccionados. Intenta ajustar los criterios de búsqueda."
        />
      )}
    </div>
  )
}
