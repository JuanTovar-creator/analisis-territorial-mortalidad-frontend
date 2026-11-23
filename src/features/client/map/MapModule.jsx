import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker } from 'react-leaflet'
import * as topojson from 'topojson-client'
import { MapPinned, X, Info, AlertTriangle } from 'lucide-react'
import L from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { getMunicipioPopulation } from '@/services/population'
import tasasMunicipales2021 from '@/data/tasas_municipales_2021.json'
import 'leaflet/dist/leaflet.css'

// Fix for Leaflet default icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

// Colombia center coordinates
const COLOMBIA_CENTER = [4.6097, -74.0817]
const DEFAULT_ZOOM = 6

// Build a lookup map: DIVIPOLA (5-digit string) -> rate data
const tasasByDivipola = (() => {
  const map = {}
  for (const item of tasasMunicipales2021) {
    map[item.cod_municipio] = item
  }
  return map
})()

// Compute percentiles 33 and 67 over valid rates (including 0 as legitimate)
function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0
  const idx = (p / 100) * (sortedArr.length - 1)
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  if (lower === upper) return sortedArr[lower]
  const frac = idx - lower
  return sortedArr[lower] * (1 - frac) + sortedArr[upper] * frac
}

const validRates = tasasMunicipales2021
  .filter(d => d.tasa_por_100000 != null && !Number.isNaN(d.tasa_por_100000))
  .map(d => d.tasa_por_100000)
  .sort((a, b) => a - b)

const thresholdLow = percentile(validRates, 33)   // ~percentil 33
const thresholdHigh = percentile(validRates, 67)  // ~percentil 67

// Classify a rate into a color category
function getRateColor(tasa) {
  if (tasa == null || Number.isNaN(tasa)) return '#94a3b8' // gris — sin datos
  if (tasa <= thresholdLow) return '#22c55e'              // verde — tasa baja
  if (tasa <= thresholdHigh) return '#eab308'             // amarillo — tasa intermedia
  return '#ef4444'                                        // rojo — tasa alta
}

function getRateCategory(tasa) {
  if (tasa == null || Number.isNaN(tasa)) return 'sin_datos'
  if (tasa <= thresholdLow) return 'baja'
  if (tasa <= thresholdHigh) return 'intermedia'
  return 'alta'
}

function SelectionMarker({ position }) {
  if (!position) return null
  return (
    <CircleMarker
      center={position}
      radius={8}
      pathOptions={{
        color: '#6366f1',
        fillColor: '#6366f1',
        fillOpacity: 0.5,
        weight: 2,
      }}
    />
  )
}

function MapController({ selectedFeature }) {
  const map = useMap()

  useEffect(() => {
    if (selectedFeature && selectedFeature.geometry) {
      const bounds = L.geoJSON(selectedFeature).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
      }
    }
  }, [selectedFeature, map])

  return null
}

export default function MapModule() {
  const [geojsonData, setGeojsonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMunicipio, setSelectedMunicipio] = useState(null)
  const [hoveredMunicipio, setHoveredMunicipio] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const geoJSONRef = useRef(null)
  const selectedRef = useRef(null)
  const hoveredRef = useRef(null)

  // Per-municipality population data state (loaded on demand)
  const [populationData, setPopulationData] = useState(null)
  const [populationLoading, setPopulationLoading] = useState(false)
  const [populationError, setPopulationError] = useState(null)

  // Load and convert TopoJSON to GeoJSON on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/src/data/MGNMPIOPOLITICO2021_optimized_q1000.topojson')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load TopoJSON')
        return response.json()
      })
      .then(municipiosTopo => {
        if (cancelled) return
        try {
          const geo = topojson.feature(municipiosTopo, municipiosTopo.objects.municipios)
          setGeojsonData(geo)
          setLoading(false)
        } catch (err) {
          setError('Error al convertir la cartografía municipal')
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError('Error al cargar la cartografía municipal')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  // Load population data for the selected municipality on demand
  useEffect(() => {
    if (!selectedMunicipio) {
      setPopulationData(null)
      setPopulationError(null)
      setPopulationLoading(false)
      return
    }

    const divipola = selectedMunicipio.properties.MPIO_CDPMP
    let cancelled = false
    setPopulationLoading(true)
    setPopulationError(null)
    setPopulationData(null)

    getMunicipioPopulation(divipola)
      .then(data => {
        if (cancelled) return
        setPopulationData(data)
        setPopulationLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        // Silenciar errores de cancelación
        if (err.name === 'AbortError') return
        setPopulationError(err.message || 'Error al cargar datos de población')
        setPopulationLoading(false)
      })

    return () => { cancelled = true }
  }, [selectedMunicipio])

  // Get the base rate color for a feature using DIVIPOLA lookup
  const getFeatureBaseColor = useCallback((feature) => {
    const divipola = feature.properties.MPIO_CDPMP
    const rateData = tasasByDivipola[divipola]
    if (rateData && rateData.tasa_por_100000 != null && !Number.isNaN(rateData.tasa_por_100000)) {
      return getRateColor(rateData.tasa_por_100000)
    }
    return '#94a3b8' // gris — sin datos
  }, [])

  // Stable style function reading from refs — defined before handlers so they can reference it
  const geoJSONStyle = useCallback((feature) => {
    const selected = selectedRef.current
    const hovered = hoveredRef.current
    const isSelected = selected && feature.properties.MPIO_CDPMP === selected.properties.MPIO_CDPMP
    const isHovered = hovered && feature.properties.MPIO_CDPMP === hovered.properties.MPIO_CDPMP

    if (isSelected) {
      return {
        fillColor: '#6366f1',
        weight: 3,
        color: '#4f46e5',
        fillOpacity: 0.7,
      }
    }
    if (isHovered) {
      return {
        fillColor: '#818cf8',
        weight: 2.5,
        color: '#6366f1',
        fillOpacity: 0.6,
      }
    }
    // Default: color by observed rate
    return {
      fillColor: getFeatureBaseColor(feature),
      weight: 1,
      color: '#94a3b8',
      fillOpacity: 0.65,
    }
  }, [getFeatureBaseColor])

  // Helper to force Leaflet to re-apply styles on all layers after ref changes
  const refreshStyles = useCallback(() => {
    if (geoJSONRef.current) {
      geoJSONRef.current.eachLayer((layer) => {
        if (layer.feature) {
          layer.setStyle(geoJSONStyle(layer.feature))
        }
      })
    }
  }, [geoJSONStyle])

  const handleClick = useCallback((e) => {
    const layer = e.target
    const feature = layer.feature
    if (feature) {
      selectedRef.current = feature
      setSelectedMunicipio(feature)
      refreshStyles()
    }
  }, [refreshStyles])

  const handleMouseOver = useCallback((e) => {
    const layer = e.target
    const feature = layer.feature
    hoveredRef.current = feature
    setHoveredMunicipio(feature)
    refreshStyles()
  }, [refreshStyles])

  const handleMouseOut = useCallback((e) => {
    hoveredRef.current = null
    setHoveredMunicipio(null)
    refreshStyles()
  }, [refreshStyles])

  const resetSelection = useCallback(() => {
    selectedRef.current = null
    setSelectedMunicipio(null)
    refreshStyles()
  }, [refreshStyles])

  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      mouseover: (e) => handleMouseOver(e),
      mouseout: (e) => handleMouseOut(e),
      click: (e) => handleClick(e),
    })
  }, [handleMouseOver, handleMouseOut, handleClick])

  const geoJSONElement = useMemo(() => {
    if (!geojsonData) return null
    return (
      <GeoJSON
        key="colombia-municipios"
        ref={geoJSONRef}
        data={geojsonData}
        style={geoJSONStyle}
        onEachFeature={onEachFeature}
      />
    )
  }, [geojsonData, geoJSONStyle, onEachFeature])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="ANÁLISIS TERRITORIAL"
          title="Mapa territorial"
          description="Cargando cartografía municipal..."
        />
        <StatePanel
          state="loading"
          title="Cargando mapa"
          description="Preparando la cartografía oficial del DANE 2021..."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="ANÁLISIS TERRITORIAL"
          title="Mapa territorial"
          description="Error al cargar datos"
        />
        <StatePanel
          state="error"
          title="Error al cargar mapa"
          description={error}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ANÁLISIS TERRITORIAL"
        title="Mapa territorial"
        description="Tasas observadas de defunciones sin asistencia médica por 100.000 habitantes — Colombia 2021 (DANE)."
      />

      <div className="relative">
        {/* Map Container */}
        <div className="relative h-[600px] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {!mapReady && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Cargando mapa...</p>
              </div>
            </div>
          )}

          <MapContainer
            center={COLOMBIA_CENTER}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full"
            zoomControl={true}
            attributionControl={true}
            maxBounds={[[-10, -95], [20, -55]]}
            maxBoundsViscosity={0.8}
            minZoom={5}
            maxZoom={12}
            whenReady={() => setMapReady(true)}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {geoJSONElement}

            <SelectionMarker
              position={
                selectedMunicipio?.geometry
                  ? L.geoJSON(selectedMunicipio).getBounds().getCenter()
                  : null
              }
            />
            <MapController selectedFeature={selectedMunicipio} />
          </MapContainer>
        </div>

        {/* Selection Info Panel */}
        {selectedMunicipio && (
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {selectedMunicipio.properties.MPIO_CNMBR}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={resetSelection}
                  aria-label="Cerrar información del municipio"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Geographic info */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Código DIVIPOLA</p>
                  <p className="text-sm font-medium">
                    {selectedMunicipio.properties.MPIO_CDPMP}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Departamento</p>
                  <p className="text-sm font-medium">
                    {selectedMunicipio.properties.DPTO_CNMBR}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="text-sm font-medium">
                    {selectedMunicipio.properties.MPIO_TIPO}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Área</p>
                  <p className="text-sm font-medium">
                    {Number(selectedMunicipio.properties.MPIO_NAREA).toLocaleString('es-CO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} km²
                  </p>
                </div>
              </div>

              {/* Observed indicators section */}
              {populationLoading && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    <span>Cargando indicadores observados...</span>
                  </div>
                </div>
              )}

              {populationError && !populationLoading && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>No se pudieron cargar los indicadores observados: {populationError}</span>
                  </div>
                </div>
              )}

              {populationData && !populationLoading && !populationError && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  {(() => {
                    const popData = populationData
                    const isSinDatosDane = popData.estado_dane === 'sin_datos_dane'

                    return (
                      <>
                        {isSinDatosDane && (
                          <div className="mb-3 flex items-center gap-2 text-xs text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Este municipio no reporta datos al DANE. Los valores disponibles son limitados.</span>
                          </div>
                        )}

                        <p className="mb-2 text-xs font-semibold text-foreground">Indicadores observados (2021)</p>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Población (2021)</p>
                            <p className="text-sm font-medium">
                              {popData.poblacion != null && !Number.isNaN(popData.poblacion)
                                ? Number(popData.poblacion).toLocaleString('es-CO')
                                : 'Sin datos'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Defunciones sin asistencia médica</p>
                            <p className="text-sm font-medium">
                              {popData.defunciones_sin_asistencia != null && !Number.isNaN(popData.defunciones_sin_asistencia)
                                ? Number(popData.defunciones_sin_asistencia).toLocaleString('es-CO')
                                : 'Sin datos'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Tasa por 100.000 hab.</p>
                            <p className="text-sm font-medium">
                              {popData.tasa_por_100000 != null && !Number.isNaN(popData.tasa_por_100000)
                                ? Number(popData.tasa_por_100000).toLocaleString('es-CO', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : 'Sin datos'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">% sin asistencia</p>
                            <p className="text-sm font-medium">
                              {popData.porcentaje_sin_asistencia_observado != null && !Number.isNaN(popData.porcentaje_sin_asistencia_observado)
                                ? `${Number(popData.porcentaje_sin_asistencia_observado).toLocaleString('es-CO', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}%`
                                : 'Sin datos'}
                            </p>
                          </div>
                        </div>

                        {popData.defunciones_con_respuesta_valida != null && !Number.isNaN(popData.defunciones_con_respuesta_valida) && (
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground">
                              Total defunciones con respuesta válida DANE: {Number(popData.defunciones_con_respuesta_valida).toLocaleString('es-CO')}
                            </p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hover tooltip */}
        {hoveredMunicipio && !selectedMunicipio && (
          <div className="absolute bottom-4 left-4 z-[1000] max-w-xs rounded-lg bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
            <p className="font-medium text-foreground">
              {hoveredMunicipio.properties.MPIO_CNMBR}
            </p>
            <p className="text-muted-foreground">
              {hoveredMunicipio.properties.DPTO_CNMBR} • {hoveredMunicipio.properties.MPIO_CDPMP}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Leyenda — Tasas observadas por 100.000 hab. (2021)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            Los colores representan la <strong>tasa observada</strong> de defunciones sin asistencia médica, calculada directamente con datos del DANE. No son predicciones de modelos de aprendizaje automático.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-green-600 bg-green-500" />
              <span className="text-muted-foreground">
                Tasa baja: 0 – {thresholdLow.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-yellow-500 bg-yellow-500" />
              <span className="text-muted-foreground">
                Tasa intermedia: {thresholdLow.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} – {thresholdHigh.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-red-600 bg-red-500" />
              <span className="text-muted-foreground">
                Tasa alta: &gt; {thresholdHigh.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-slate-400 bg-slate-400" />
              <span className="text-muted-foreground">Sin datos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-indigo-600 bg-indigo-500" />
              <span className="text-muted-foreground">Municipio seleccionado</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Umbrales calculados con percentiles 33 ({thresholdLow.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}) y 67 ({thresholdHigh.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}) de las tasas válidas de {validRates.length} municipios.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
