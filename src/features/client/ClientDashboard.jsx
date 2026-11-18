import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Brain, ChartNoAxesColumn, ClipboardList, MapPinned, Percent } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard, StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { getResumenTodos, getGeneralModelComparison } from '@/services/generalSummary'
import municipiosCatalog from '@/data/municipios.json'

const TOP_N = 15

function formatPct(value) {
  if (value == null) return '—'
  return `${Number(value).toFixed(1)} %`
}


export default function ClientDashboard() {
  const [resumen, setResumen] = useState(null)
  const [modelos, setModelos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      getResumenTodos().catch(err => ({ error: err })),
      getGeneralModelComparison().catch(err => ({ error: err })),
    ]).then(([resData, modData]) => {
      if (cancelled) return
      if (resData.error) {
        setError(resData.error.message || 'Error al cargar el resumen de municipios')
      } else {
        setResumen(resData)
      }
      if (modData.error) {
        // No bloquear si solo falla la comparación de modelos
        setModelos(null)
      } else {
        setModelos(modData)
      }
      setLoading(false)
    }).catch(err => {
      if (!cancelled) {
        setError(err.message || 'Error al cargar los datos')
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [])

  // Cálculos derivados
  const {
    municipiosConDatos,
    promedioGeneralObservado,
    promedioGeneralPredicho,
    totalDiagnosticos,
    chartData,
  } = useMemo(() => {
    if (!resumen || !resumen.municipios || resumen.municipios.length === 0) {
      return {
        municipiosConDatos: 0,
        promedioGeneralObservado: null,
        promedioGeneralPredicho: null,
        totalDiagnosticos: 0,
        chartData: [],
      }
    }

    const lista = resumen.municipios
    const total = lista.length

    // Promedios generales (promedio simple de los promedios municipales)
    const sumObs = lista.reduce((acc, m) => acc + (m.promedio_observado || 0), 0)
    const sumPred = lista.reduce((acc, m) => acc + (m.promedio_predicho || 0), 0)
    const sumDiag = lista.reduce((acc, m) => acc + (m.total_diagnosticos || 0), 0)

    // Top N municipios ordenados por promedio observado (desc)
    const sorted = [...lista].sort((a, b) => (b.promedio_observado || 0) - (a.promedio_observado || 0))
    const top = sorted.slice(0, TOP_N)

    const chartData = top.map(m => ({
      municipio: municipiosCatalog[m.codigo_municipio] || m.codigo_municipio,
      codigo: m.codigo_municipio,
      observado: Math.round((m.promedio_observado || 0) * 100) / 100,
      predicho: Math.round((m.promedio_predicho || 0) * 100) / 100,
    }))

    return {
      municipiosConDatos: total,
      promedioGeneralObservado: sumObs / total,
      promedioGeneralPredicho: sumPred / total,
      totalDiagnosticos: sumDiag,
      chartData,
    }
  }, [resumen])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Resumen general" description="Cargando indicadores..." />
        <StatePanel state="loading" title="Cargando panel" description="Obteniendo los indicadores territoriales..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Resumen general" description="Error al cargar datos" />
        <StatePanel state="error" title="Error al cargar el panel" description={error} />
      </div>
    )
  }

  if (!resumen || municipiosConDatos === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Resumen general" description="Sin datos disponibles" />
        <StatePanel
          title="No hay datos de predicción disponibles"
          description="El backend no devolvió municipios con datos. Verifica que los modelos estén entrenados y que exista el dataset de entrenamiento."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="ANÁLISIS TERRITORIAL"
        title="Resumen general"
        description="Indicadores de defunciones sin asistencia médica basados en predicciones del modelo."
      />

      {/* Métricas principales */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
        <MetricCard
          label="Municipios con datos"
          value={municipiosConDatos}
          detail="Municipios con predicciones disponibles"
          icon={MapPinned}
        />
        <MetricCard
          label="Promedio observado"
          value={formatPct(promedioGeneralObservado)}
          detail="Promedio general de defunciones sin asistencia médica"
          icon={Percent}
        />
        <MetricCard
          label="Promedio predicho"
          value={formatPct(promedioGeneralPredicho)}
          detail="Promedio general estimado por el modelo"
          icon={ChartNoAxesColumn}
        />
        <MetricCard
          label="Diagnósticos analizados"
          value={totalDiagnosticos.toLocaleString('es-CO')}
          detail="Modelo de predicción: Random Forest"
          icon={ClipboardList}
        />
      </section>

      {/* Información del modelo Random Forest */}
      {modelos && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain size={18} aria-hidden="true" />
              Modelo de predicción: Random Forest
            </CardTitle>
            <CardDescription>
              Detalles del modelo Random Forest utilizado para generar las predicciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Algoritmo</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">Random Forest</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criterio de selección</p>
                <p className="mt-1 text-sm text-slate-700">{modelos.criterio_seleccion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registros entrenamiento</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {modelos.registros_entrenamiento?.toLocaleString('es-CO') || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Municipios en entrenamiento</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {modelos.municipios_disponibles?.toLocaleString('es-CO') || '—'}
                </p>
              </div>
            </div>

            {/* Métricas de validación de Random Forest */}
            {modelos.modelos?.random_forest?.metricas_validacion && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">Métricas de validación — Random Forest</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left font-medium text-muted-foreground">Métrica</th>
                        <th className="pb-2 text-right font-medium text-muted-foreground">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        modelos.modelos.random_forest.metricas_validacion
                      ).map(([key, value]) => (
                        <tr key={key} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 text-slate-700 capitalize">{key.replace(/_/g, ' ')}</td>
                          <td className="py-2 text-right font-mono text-slate-700">
                            {typeof value === 'number' ? value.toFixed(4) : value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gráfica comparativa */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Observado vs predicho por municipio</CardTitle>
          <CardDescription>
            Top {TOP_N} municipios con mayor porcentaje observado de defunciones sin asistencia médica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full" role="img" aria-label="Gráfico de barras comparando valores observados y predichos por municipio">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 32, left: -18 }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                <XAxis
                  dataKey="municipio"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `${val} %`}
                />
                <Tooltip
                  cursor={{ fill: '#f1f3ff' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(30,41,59,.08)',
                  }}
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)} %`,
                    name === 'observado' ? 'Valor observado' : 'Valor predicho',
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Bar
                  dataKey="observado"
                  name="Observado"
                  fill="#6366f1"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="predicho"
                  name="Predicho"
                  fill="#a78bfa"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Los porcentajes representan el promedio de defunciones sin asistencia médica por municipio,
            no tasas de mortalidad por habitantes.
          </p>
        </CardContent>
      </Card>

      {/* Tabla resumen de municipios */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por municipio</CardTitle>
          <CardDescription>
            Valores observados y predichos promediados por diagnóstico para cada municipio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left font-medium text-muted-foreground">Municipio</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Observado (%)</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Predicho (%)</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Diferencia</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Diagnósticos</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((m) => {
                  const diff = m.predicho - m.observado
                  return (
                    <tr key={m.codigo} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 text-slate-700">{m.municipio}</td>
                      <td className="py-2 text-right font-mono text-slate-700">{m.observado.toFixed(1)}</td>
                      <td className="py-2 text-right font-mono text-slate-700">{m.predicho.toFixed(1)}</td>
                      <td className={`py-2 text-right font-mono ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                      </td>
                      <td className="py-2 text-right text-slate-700">
                        {resumen.municipios.find(x => x.codigo_municipio === m.codigo)?.total_diagnosticos ?? '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {resumen.municipios.length > TOP_N && (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Se muestran los {TOP_N} municipios con mayor porcentaje observado.
              Total: {resumen.municipios.length} municipios con datos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
