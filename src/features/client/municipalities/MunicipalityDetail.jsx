import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard, StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { getMunicipalityDetail } from '@/services/municipalities'

function formatPorcentaje(valor) {
  if (valor === null || valor === undefined) return 'No disponible'
  return `${valor.toFixed(2)}%`
}

const chartColors = ['#6366f1', '#a78bfa']

export default function MunicipalityDetail({ municipality, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getMunicipalityDetail(municipality.codigo)
      .then(data => {
        if (!cancelled) setDetail(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Error al cargar el detalle')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [municipality.codigo])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={onClose}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-700"
          aria-label="Volver a la lista de municipios"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a la lista
        </button>
        <StatePanel state="loading" title="Cargando detalle" description="Obteniendo los datos del municipio..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={onClose}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-700"
          aria-label="Volver a la lista de municipios"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a la lista
        </button>
        <StatePanel state="error" title="Error al cargar detalle" description={error} />
      </div>
    )
  }

  // Datos del resumen del municipio
  const { municipio, departamento, promedioObservado, promedioPredicho, totalDiagnosticos } = municipality

  // Datos por diagnóstico desde el backend
  const resultados = detail?.resultados || []
  const modeloLabel = detail?.modelo_utilizado === 'random_forest'
    ? 'Random Forest'
    : detail?.modelo_utilizado === 'regresion_lineal'
      ? 'Regresión Lineal'
      : detail?.modelo_utilizado || 'No disponible'

  // Gráfico de barras: observado vs predicho por diagnóstico
  const chartData = resultados
    .filter(r => r.valor_observado !== null && r.valor_predicho !== null)
    .map(r => ({
      diagnostico: r.cod_grupo_diagnostico,
      observado: +r.valor_observado.toFixed(2),
      predicho: +r.valor_predicho.toFixed(2),
    }))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onClose}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-700"
            aria-label="Volver a la lista de municipios"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver a la lista
          </button>
          <h2 className="text-xl font-semibold text-slate-800">{municipio}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{departamento}</p>
        </div>
      </div>

      {/* Key indicators */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
        <MetricCard
          label="% observado sin asistencia"
          value={formatPorcentaje(promedioObservado)}
          detail="Promedio de valores reales"
          icon={() => <span className="text-lg">📊</span>}
        />
        <MetricCard
          label="% predicho sin asistencia"
          value={formatPorcentaje(promedioPredicho)}
          detail={`Modelo: ${modeloLabel}`}
          icon={() => <span className="text-lg">📈</span>}
        />
        <MetricCard
          label="Diagnósticos con datos"
          value={totalDiagnosticos ?? 'No disponible'}
          detail="Grupos de diagnóstico"
          icon={() => <span className="text-lg">🏥</span>}
        />
        <MetricCard
          label="Modelo utilizado"
          value={modeloLabel}
          detail="Modelo de predicción"
          icon={() => <span className="text-lg">🤖</span>}
        />
      </section>

      {/* Chart: observado vs predicho por diagnóstico */}
      {chartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Observado vs. Predicho por diagnóstico</CardTitle>
            <CardDescription>
              Comparación del porcentaje de defunciones sin asistencia médica entre el valor real y la predicción del modelo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full" role="img" aria-label="Gráfico de barras comparando valores observados y predichos por diagnóstico">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                  <XAxis dataKey="diagnostico" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                  <Tooltip cursor={{ fill: '#f1f3ff' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }} />
                  <Bar dataKey="observado" name="% Observado" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="predicho" name="% Predicho" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Los valores representan el porcentaje de defunciones sin asistencia médica por grupo de diagnóstico.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detalle por diagnóstico</CardTitle>
            <CardDescription>No hay datos de predicción disponibles para este municipio.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatePanel
              title="Sin datos de predicción"
              description="El backend no devolvió resultados por diagnóstico para este municipio."
              className="border-dashed bg-slate-50/70 shadow-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Table: resultados por diagnóstico */}
      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados por grupo de diagnóstico</CardTitle>
            <CardDescription>
              Valores observados y predichos para cada grupo de diagnóstico en el municipio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Diagnóstico</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">% Observado</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">% Predicho</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Diferencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resultados.map((r, idx) => {
                    const diff = r.valor_observado !== null && r.valor_predicho !== null
                      ? (r.valor_predicho - r.valor_observado).toFixed(2)
                      : null
                    return (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="px-4 py-2.5 font-medium text-slate-800">{r.cod_grupo_diagnostico || 'No identificado'}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700">{formatPorcentaje(r.valor_observado)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700">{formatPorcentaje(r.valor_predicho)}</td>
                        <td className={`px-4 py-2.5 text-right font-mono text-sm ${diff !== null ? (diff > 0 ? 'text-red-600' : diff < 0 ? 'text-emerald-600' : 'text-slate-600') : 'text-slate-400'}`}>
                          {diff !== null ? `${diff > 0 ? '+' : ''}${diff}%` : 'No disponible'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
