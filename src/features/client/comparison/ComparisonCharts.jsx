import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const colorObservado = '#6366f1'
const colorPredicho = '#a78bfa'

export default function ComparisonCharts({ data }) {
  const chartData = useMemo(() => {
    return data.map(m => ({
      municipio: m.municipio,
      observado: m.promedioObservado !== null && m.promedioObservado !== undefined
        ? +m.promedioObservado.toFixed(2)
        : null,
      predicho: m.promedioPredicho !== null && m.promedioPredicho !== undefined
        ? +m.promedioPredicho.toFixed(2)
        : null,
    }))
  }, [data])

  const hasData = chartData.some(d => d.observado !== null || d.predicho !== null)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Observado vs. Predicho</CardTitle>
          <CardDescription>
            Comparación visual del porcentaje de defunciones sin asistencia médica entre municipios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[280px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No hay datos de predicción disponibles para los municipios seleccionados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Grouped bar chart: Observed vs Predicted */}
      <Card>
        <CardHeader>
          <CardTitle>Observado vs. Predicho por municipio</CardTitle>
          <CardDescription>
            Comparación del porcentaje de defunciones sin asistencia médica: valor real vs. predicción del modelo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full" role="img" aria-label="Gráfico de barras agrupadas comparando observado vs predicho por municipio">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                <XAxis dataKey="municipio" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                <Tooltip
                  cursor={{ fill: '#f1f3ff' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }}
                  formatter={(value, name) => {
                    if (value === null) return ['No disponible', name === 'observado' ? 'Observado (%)' : 'Predicho (%)']
                    return [`${value}%`, name === 'observado' ? 'Observado (%)' : 'Predicho (%)']
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="observado"
                  name="Observado (%)"
                  fill={colorObservado}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="predicho"
                  name="Predicho (%)"
                  fill={colorPredicho}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards per municipality */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por municipio</CardTitle>
          <CardDescription>
            Valores observados, predichos y diferencia en puntos porcentuales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(m => {
              const observado = m.promedioObservado
              const predicho = m.promedioPredicho
              const diff = (observado !== null && predicho !== null)
                ? +(predicho - observado).toFixed(2)
                : null

              const diffColor = diff === null ? 'text-slate-400'
                : diff > 0 ? 'text-amber-600'
                  : diff < 0 ? 'text-emerald-600'
                    : 'text-slate-600'

              const diffLabel = diff === null ? 'No disponible'
                : diff > 0 ? `+${diff} pp (sobreestimado)`
                  : diff < 0 ? `${diff} pp (subestimado)`
                    : '0.00 pp (exacto)'

              return (
                <div key={m.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-800">{m.municipio}</p>
                    <p className="text-xs text-muted-foreground">{m.departamento}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Observado</span>
                      <span className="text-sm font-mono font-medium text-slate-700">
                        {observado !== null && observado !== undefined ? `${observado.toFixed(2)}%` : 'No disponible'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Predicho</span>
                      <span className="text-sm font-mono font-medium text-slate-700">
                        {predicho !== null && predicho !== undefined ? `${predicho.toFixed(2)}%` : 'No disponible'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-xs text-muted-foreground">Diferencia</span>
                      <span className={`text-xs font-mono ${diffColor}`}>{diffLabel}</span>
                    </div>
                    {m.totalDiagnosticos !== null && m.totalDiagnosticos !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Diagnósticos</span>
                        <span className="text-xs font-mono text-slate-600">{m.totalDiagnosticos}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
