import { useEffect, useMemo, useState } from 'react'
import { FileBarChart2 } from 'lucide-react'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { getInformes, getInformeDetail, downloadInforme } from '@/services/reports'
import ReportsFilters from './ReportsFilters'
import ReportsTable from './ReportsTable'
import ReportDetail from './ReportDetail'

export default function ReportsModule() {
  const [informes, setInformes] = useState([])
  const [tipos, setTipos] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters state
  const [search, setSearch] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [tipo, setTipo] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  // Detail view state
  const [selectedInformeId, setSelectedInformeId] = useState(null)
  const [selectedInforme, setSelectedInforme] = useState(null)

  // Download state
  const [downloadLoading, setDownloadLoading] = useState(null)

  // Load reports
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const filters = {
      ...(search && { search }),
      ...(departamento && { departamento }),
      ...(tipo && { tipo }),
      ...(municipio && { municipio }),
      ...(fechaDesde && { fechaDesde }),
      ...(fechaHasta && { fechaHasta }),
    }

    getInformes(filters)
      .then(data => {
        if (!cancelled) {
          setInformes(data.informes || [])
          setTipos(data.tipos || [])
          setDepartamentos(data.departamentos || [])
          setMunicipios(data.municipios || [])
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar los informes')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [search, departamento, tipo, municipio, fechaDesde, fechaHasta])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (search) count++
    if (departamento) count++
    if (tipo) count++
    if (municipio) count++
    if (fechaDesde) count++
    if (fechaHasta) count++
    return count
  }, [search, departamento, tipo, municipio, fechaDesde, fechaHasta])

  const handleResetFilters = () => {
    setSearch('')
    setDepartamento('')
    setTipo('')
    setMunicipio('')
    setFechaDesde('')
    setFechaHasta('')
  }

  const handleViewDetail = async (id) => {
    setSelectedInformeId(id)
    setSelectedInforme(null)

    try {
      const detalle = await getInformeDetail(id)
      setSelectedInforme(detalle)
    } catch (err) {
      setError(err.message || 'Error al cargar el detalle del informe')
    }
  }

  const handleBack = () => {
    setSelectedInformeId(null)
    setSelectedInforme(null)
  }

  const handleDownload = async (id, format) => {
    setDownloadLoading(id)
    try {
      await downloadInforme(id, format)
    } catch (err) {
      setError(err.message || 'Error al descargar el informe')
    } finally {
      setDownloadLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Informes" description="Cargando informes..." />
        <StatePanel state="loading" title="Cargando informes" description="Obteniendo la lista de informes disponibles..." />
      </div>
    )
  }

  if (error && informes.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Informes" description="Error al cargar datos" />
        <StatePanel state="error" title="Error al cargar informes" description={error} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ANÁLISIS TERRITORIAL"
        title="Informes"
        description="Consulta, filtra y descarga los informes territoriales generados por el sistema."
      />

      {/* Detail view */}
      {selectedInformeId ? (
        <ReportDetail
          informe={selectedInforme}
          onBack={handleBack}
          onDownload={handleDownload}
          downloadLoading={downloadLoading}
        />
      ) : (
        /* List view */
        <div className="flex flex-col gap-6">
          <ReportsFilters
            municipios={municipios}
            departamentos={departamentos}
            tipos={tipos}
            search={search}
            departamento={departamento}
            tipo={tipo}
            municipio={municipio}
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
            onSearch={setSearch}
            onDepartamento={setDepartamento}
            onTipo={setTipo}
            onMunicipio={setMunicipio}
            onFechaDesde={setFechaDesde}
            onFechaHasta={setFechaHasta}
            onReset={handleResetFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {error && (
            <StatePanel state="error" title="Error parcial" description={error} />
          )}

          <ReportsTable
            informes={informes}
            onViewDetail={handleViewDetail}
            onDownload={handleDownload}
            downloadLoading={downloadLoading}
          />
        </div>
      )}
    </div>
  )
}
