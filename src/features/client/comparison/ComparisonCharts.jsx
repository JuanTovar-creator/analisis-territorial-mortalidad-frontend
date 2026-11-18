import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const chartColors = ['#6366f1', '#a78bfa', '#f59e0b', '#10b981', '#ef4444']

function riesgoBadge(riesgo) {
  const styles = {
    'Bajo': 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'Moderado': 'border-blue-200 bg-blue-50 text-blue-700',
    'Alto': 'border-amber-200 bg-amber-50 text-amber-700',
    'Muy alto': 'border-red-200 bg-red-50 text-red-700',
  }
  return <Badge variant="outline" className={styles[riesgo] || styles['Moderado']}>{riesgo}</Badge>
}

function tendenciaIcon(tendencia) {
  if (tendencia === 'En aumento') return <TrendingUp size={14} className="text-red-500" aria-hidden="true" />
  if (tendencia === 'En descenso') return <TrendingDown size={14} className="text-emerald-500" aria-hidden="true" />
  return <Minus size={14} className="text-slate-400" aria-hidden="true" />
}

export default function ComparisonCharts({ data }) {
  // Socioeconomic indicators chart data
  const indicatorsChartData = useMemo(() => {
    const keys = ['coberturaSanitaria', 'accesoAgua', 'tasaMortalidad', 'indicePobreza']
    const labels = ['Cobertura sanitaria', 'Acceso a agua', 'Tasa mortalidad (x10)', 'Índice de pobreza (x100)']

    return labels.map((label, i) => {
      const entry = { indicador: label }
      data.forEach(m => {
        let value = m[keys[i]]
        // Normalize: tasaMortalidad * 10, indicePobreza * 100 para escala comparable
        if (i === 2) value = value * 10
        if (i === 3) value = value * 100
        entry[m.municipio] = +value.toFixed(1)
      })
      return entry
    })
  }, [data])

  // Prediction comparison chart data
  const predictionsChartData = useMemo(() => {
    return data.map(m => ({
      municipio: m.municipio,
      probabilidadRiesgo: +(m.predicciones.probabilidadRiesgo * 100).toFixed(1),
    }))
  }, [data])

  // Radar chart data for risk profile
  const radarData = useMemo(() => {
    const keys = ['coberturaSanitaria', 'accesoAgua', 'tasaMortalidad', 'indicePobreza']
    const labels = ['Cobertura sanitaria', 'Acceso a agua', 'Tasa mortalidad', 'Índice de pobreza']

    return labels.map((label, i) => {
      const entry = { indicador: label }
      data.forEach((m, idx) => {
        let value = m[keys[i]]
        // Normalize to 0-100 scale
        if (i === 2) value = value * 10 // tasaMortalidad
        if (i === 3) value = value * 100 // indicePobreza
        entry[`m${idx}`] = +value.toFixed(1)
      })
      return entry
    })
  }, [data])

  return (
    <div className="flex flex-col gap-6">
      {/* Bar chart: socioeconomic indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores socioeconómicos</CardTitle>
          <CardDescription>
            Comparación visual de cobertura sanitaria, acceso a agua, tasa de mortalidad e índice de pobreza.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full" role="img" aria-label="Gráfico de barras comparando indicadores socioeconómicos">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indicatorsChartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                <XAxis dataKey="indicador" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f1f3ff' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {data.map((m, idx) => (
                  <Bar
                    key={m.id}
                    dataKey={m.municipio}
                    name={m.municipio}
                    fill={chartColors[idx % chartColors.length]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar chart: risk profile */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de riesgo</CardTitle>
          <CardDescription>
            Radar comparativo de indicadores de riesgo entre municipios seleccionados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full" role="img" aria-label="Gráfico radar comparando perfil de riesgo">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <PolarGrid stroke="#e9edf5" />
                <PolarAngleAxis dataKey="indicador" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                {data.map((m, idx) => (
                  <Radar
                    key={m.id}
                    name={m.municipio}
                    dataKey={`m${idx}`}
                    stroke={chartColors[idx % chartColors.length]}
                    fill={chartColors[idx % chartColors.length]}
                    fillOpacity={0.15}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Predictions comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Predicciones del modelo</CardTitle>
          <CardDescription>
            Probabilidad de riesgo y tendencia predicha por el modelo para cada municipio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full" role="img" aria-label="Gráfico de barras con probabilidad de riesgo predicha">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionsChartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                <XAxis dataKey="municipio" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} unit="%" />
                <Tooltip cursor={{ fill: '#f1f3ff' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }} />
                <Bar dataKey="probabilidadRiesgo" name="Prob. de riesgo (%)" fill="#f59e0b" radius={[5, 5, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Prediction details table */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((m) => (
              <div key={m.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">{m.municipio}</p>
                  {riesgoBadge(m.predicciones.nivelPredicho)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Probabilidad</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {(m.predicciones.probabilidadRiesgo * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Tendencia</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {tendenciaIcon(m.predicciones.tendencia)}
                      <span className="text-sm font-medium text-slate-700">{m.predicciones.tendencia}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
