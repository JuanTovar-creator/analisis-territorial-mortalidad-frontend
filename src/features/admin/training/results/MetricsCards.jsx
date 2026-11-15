import { Card, CardContent } from '@/components/ui/card'

const metricLabels = {
  accuracy: { label: 'Accuracy', icon: 'target' },
  precision: { label: 'Precision', icon: 'crosshair' },
  recall: { label: 'Recall', icon: 'search' },
  f1: { label: 'F1-Score', icon: 'award' },
  auc: { label: 'ROC-AUC', icon: 'trending-up' },
}

const metricColors = {
  accuracy: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  precision: 'bg-blue-50 border-blue-200 text-blue-700',
  recall: 'bg-amber-50 border-amber-200 text-amber-700',
  f1: 'bg-purple-50 border-purple-200 text-purple-700',
  auc: 'bg-rose-50 border-rose-200 text-rose-700',
}

function MetricCard({ name, value }) {
  const info = metricLabels[name]
  const colorClass = metricColors[name]

  return (
    <Card className={`border ${colorClass.split(' ').filter(c => c.startsWith('border-')).join(' ')}`}>
      <CardContent className="flex flex-col items-center gap-1 p-5 text-center">
        <span className={`text-xs font-medium ${colorClass.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
          {info?.label || name}
        </span>
        <span className="text-2xl font-bold text-slate-800">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        {name === 'auc' && (
          <span className="text-[11px] text-muted-foreground">
            Datos sintéticos de puntuaciones
          </span>
        )}
      </CardContent>
    </Card>
  )
}

export default function MetricsCards({ metrics }) {
  if (!metrics) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <MetricCard name="accuracy" value={metrics.accuracy} />
      <MetricCard name="precision" value={metrics.precision} />
      <MetricCard name="recall" value={metrics.recall} />
      <MetricCard name="f1" value={metrics.f1} />
      <MetricCard name="auc" value={metrics.auc} />
    </div>
  )
}
