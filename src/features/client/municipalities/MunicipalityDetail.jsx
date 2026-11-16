import { ArrowLeft, AlertTriangle, Activity, Droplets, Users, HeartPulse, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/dashboard/DashboardPrimitives'

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
  if (tendencia === 'En aumento') return <TrendingUp size={16} className="text-red-500" aria-hidden="true" />
  if (tendencia === 'En descenso') return <TrendingDown size={16} className="text-emerald-500" aria-hidden="true" />
  return <Minus size={16} className="text-slate-400" aria-hidden="true" />
}

export default function MunicipalityDetail({ municipality, onClose }) {
  const { municipio, departamento, tipo, riesgo, poblacion, coberturaSanitaria, tasaMortalidad, accesoAgua, indicePobreza, predicciones } = municipality

  const indicadoresData = [
    { name: 'Cobertura sanitaria', value: coberturaSanitaria, max: 100, fill: '#6366f1' },
    { name: 'Acceso a agua', value: accesoAgua, max: 100, fill: '#a78bfa' },
    { name: 'Tasa mortalidad', value: tasaMortalidad * 10, max: 100, fill: '#f59e0b' },
  ]

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
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-semibold text-slate-800">{municipio}</h2>
            {riesgoBadge(riesgo)}
            <DemoBadge variant="info" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{departamento} · {tipo}</p>
        </div>
      </div>

      {/* Key indicators */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
        <MetricCard label="Población" value={poblacion.toLocaleString('es-CO')} detail="Habitantes registrados" icon={Users} />
        <MetricCard label="Cobertura sanitaria" value={`${coberturaSanitaria}%`} detail="Acceso a servicios de salud" icon={HeartPulse} />
        <MetricCard label="Tasa de mortalidad" value={`${tasaMortalidad}`} detail="Por 1,000 habitantes" icon={Activity} />
        <MetricCard label="Acceso a agua potable" value={`${accesoAgua}%`} detail="Infraestructura disponible" icon={Droplets} />
      </section>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores comparativos</CardTitle>
          <CardDescription>Valores sintéticos de demostración. No representan mediciones reales.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full" role="img" aria-label="Gráfico de barras con indicadores del municipio">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indicadoresData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f1f3ff' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }} />
                <Bar dataKey="value" name="Valor (%)" radius={[5, 5, 0, 0]} maxBarSize={40}>
                  {indicadoresData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Los valores del gráfico son solo un ejemplo visual. No provienen de fuentes oficiales ni de un modelo predictivo.</p>
        </CardContent>
      </Card>

      {/* Prediction section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Predicción del modelo</CardTitle>
            <DemoBadge />
          </div>
          <CardDescription>Resultado sintético suministrado por el backend. No es una predicción real.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nivel de riesgo predicho</p>
                <div className="mt-2 flex items-center gap-2">
                  {riesgoBadge(predicciones.nivelPredicho)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Probabilidad de riesgo</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800">
                  {(predicciones.probabilidadRiesgo * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tendencia</p>
                <div className="mt-1 flex items-center gap-2">
                  {tendenciaIcon(predicciones.tendencia)}
                  <span className="text-sm font-medium text-slate-700">{predicciones.tendencia}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Nota importante</p>
                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Esta predicción es un dato sintético de demostración. En producción, el backend calculará la predicción real basada en los datos del municipio y el modelo publicado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional info */}
      <Card>
        <CardHeader>
          <CardTitle>Información adicional</CardTitle>
          <CardDescription>Indicadores socioeconómicos del municipio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-muted-foreground">Índice de pobreza</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{indicePobreza}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-muted-foreground">Tipo de municipio</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{tipo}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-muted-foreground">Departamento</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{departamento}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-muted-foreground">Nivel de riesgo actual</p>
              <div className="mt-1">{riesgoBadge(riesgo)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
