import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartNoAxesColumn, Flag, MapPinned } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DemoNotice, MetricCard, StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { clientDemoMetrics, clientDemoPeriods } from './demo/client-dashboard'

const periodOptions = [
  { label: 'Todos los periodos de demo', value: 'all' },
  { label: 'Primer trimestre demo', value: 'first' },
  { label: 'Segundo trimestre demo', value: 'second' },
]
const scopeOptions = [
  { label: 'Todos los grupos de muestra', value: 'all' },
  { label: 'Grupo de muestra A', value: 'groupA' },
  { label: 'Grupo de muestra B', value: 'groupB' },
]

export default function ClientDashboard() {
  const [period, setPeriod] = useState('all')
  const [scope, setScope] = useState('all')

  const chartData = useMemo(() => {
    const selectedPeriods = period === 'first' ? clientDemoPeriods.slice(0, 3) : period === 'second' ? clientDemoPeriods.slice(3) : clientDemoPeriods
    if (scope === 'all') return selectedPeriods
    return selectedPeriods.map(({ month, [scope]: records }) => ({ month, records }))
  }, [period, scope])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="ANÁLISIS TERRITORIAL" title="Resumen general" description="Vista inicial para consulta de indicadores territoriales." />
      <DemoNotice />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Indicadores disponibles">
        {clientDemoMetrics.map((metric) => {
          const icon = metric.icon === 'map' ? MapPinned : metric.icon === 'flag' ? Flag : ChartNoAxesColumn
          return <MetricCard key={metric.label} {...metric} icon={icon} />
        })}
      </section>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Filtros de consulta</CardTitle>
            <CardDescription className="mt-1">Opciones ilustrativas. No filtran fuentes oficiales.</CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:min-w-[390px]">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="period-filter">Periodo</FieldLabel>
              <Select value={period} onValueChange={(value) => value && setPeriod(value)} items={periodOptions}>
                <SelectTrigger id="period-filter" className="w-full bg-white"><SelectValue placeholder="Selecciona un periodo" /></SelectTrigger>
                <SelectContent><SelectGroup>{periodOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            </Field>
            <Field className="gap-1.5">
              <FieldLabel htmlFor="scope-filter">Grupo sintético</FieldLabel>
              <Select value={scope} onValueChange={(value) => value && setScope(value)} items={scopeOptions}>
                <SelectTrigger id="scope-filter" className="w-full bg-white"><SelectValue placeholder="Selecciona un grupo" /></SelectTrigger>
                <SelectContent><SelectGroup>{scopeOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            </Field>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Distribución de registros de ejemplo</CardTitle>
            <CardDescription>Conteos sintéticos por periodo y grupo de muestra. No representan datos territoriales reales.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full" role="img" aria-label="Gráfico de barras con conteos ficticios de los grupos de muestra A y B entre enero y junio">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="#e9edf5" strokeDasharray="4 4" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f1f3ff' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(30,41,59,.08)' }} />
                  {scope === 'all' ? <>
                    <Bar dataKey="groupA" name="Grupo de muestra A" fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="groupB" name="Grupo de muestra B" fill="#a78bfa" radius={[5, 5, 0, 0]} maxBarSize={24} />
                  </> : <Bar dataKey="records" name={scope === 'groupA' ? 'Grupo de muestra A' : 'Grupo de muestra B'} fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={30} />}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Las cifras del gráfico son solo un ejemplo visual. No provienen de DANE, RIPS ni de un modelo predictivo.</p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Mapa territorial</CardTitle>
              <CardDescription>Vista pendiente de cartografía validada.</CardDescription>
            </CardHeader>
            <CardContent>
              <StatePanel
                title="Geometrías municipales no conectadas"
                description="No se dibuja un mapa provisional para evitar representar límites o ubicaciones ficticias. Esta área se habilitará cuando estén disponibles geometrías oficiales."
                className="border-dashed bg-slate-50/70 shadow-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de prioridades</CardTitle>
              <CardDescription>Clasificación y niveles sujetos a metodología aprobada.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-violet-700"><Flag size={17} aria-hidden="true" /></span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Niveles no definidos</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">No se muestran rangos ni prioridades hasta conectar la taxonomía validada y sus datos.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
