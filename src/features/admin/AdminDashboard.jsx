import { Activity, BrainCircuit, Check, Clock3, Database, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoNotice, MetricCard, StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { adminDemoOverview } from './demo/admin-dashboard'

const metricIcons = { database: Database, activity: Activity, brain: BrainCircuit, shield: ShieldCheck }

export default function AdminDashboard() {
  const { metrics, datasets, activity } = adminDemoOverview

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="OPERACIÓN" title="Panel principal" description="Vista general del entorno administrativo y sus componentes." />
      <DemoNotice />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores de demostración">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} icon={metricIcons[metric.icon]} />
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Conjuntos de datos</CardTitle>
              <CardDescription className="mt-1">Estado de las estructuras disponibles en la interfaz demo.</CardDescription>
            </div>
            <Badge variant="outline" className="shrink-0 border-primary/20 bg-primary/5 text-primary">{datasets.length} de muestra</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-slate-100">
              {datasets.map((dataset) => (
                <div key={dataset.name} className="flex flex-col gap-2 py-3 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500"><Database size={15} aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{dataset.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{dataset.kind}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit shrink-0 font-medium">{dataset.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrenamiento y publicación</CardTitle>
            <CardDescription>Estado del modelo dentro de esta demostración.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700"><BrainCircuit size={18} aria-hidden="true" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Sin modelo publicado</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">No hay entrenamientos ni resultados reales conectados a esta vista.</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 size={15} aria-hidden="true" /> Próximo paso</span>
              <span className="text-xs font-medium text-slate-700">Conectar fuentes aprobadas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription className="mt-1">Eventos locales de muestra; no son ejecuciones del sistema.</CardDescription>
          </div>
          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Sparkles size={17} aria-hidden="true" /></span>
        </CardHeader>
        <CardContent>
          {activity.length ? (
            <ol className="flex flex-col">
              {activity.map((item, index) => (
                <li key={item.title} className="flex gap-3 py-3 first:pt-1 last:pb-1">
                  <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${item.tone === 'complete' ? 'bg-emerald-50 text-emerald-700' : item.tone === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.tone === 'complete' ? <Check size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}
                  </span>
                  <div className={`min-w-0 flex-1 ${index < activity.length - 1 ? 'border-b border-slate-100 pb-3' : ''}`}>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : <StatePanel title="Todavía no hay actividad" description="Los eventos aparecerán cuando haya procesos conectados." />}
        </CardContent>
      </Card>
    </div>
  )
}
