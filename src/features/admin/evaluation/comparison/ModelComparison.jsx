import { CheckCircle2, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/dashboard/DemoBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MetricsCards from '@/features/admin/training/results/MetricsCards'
import ModelComparisonChart from '@/features/admin/training/results/ModelComparisonChart'
import { metricResults, modelTypes } from '@/features/admin/training/demo/training-demo'

const metricKeys = ['accuracy', 'precision', 'recall', 'f1', 'auc']
const metricLabels = {
  accuracy: 'Accuracy',
  precision: 'Precision',
  recall: 'Recall',
  f1: 'F1-Score',
  auc: 'ROC-AUC',
}

export default function ModelComparison({ onSelectModel }) {
  const lr = metricResults['logistic-regression']
  const dt = metricResults['decision-tree']
  const lrDef = modelTypes.find(m => m.id === 'logistic-regression')
  const dtDef = modelTypes.find(m => m.id === 'decision-tree')

  const handleSelect = (modelId) => {
    onSelectModel({ model: modelId })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Comparación de modelos</CardTitle>
              <CardDescription className="mt-1">
                Compara ambos modelos con las mismas métricas y el mismo conjunto de prueba.
              </CardDescription>
            </div>
            <DemoBadge>Datos sintéticos</DemoBadge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Context notice */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <Info size={16} className="mt-0.5 text-blue-600 shrink-0" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-blue-800">
                Demostración de evaluación final
              </p>
              <p className="text-xs text-blue-700">
                Las métricas reflejan una demostración de evaluación final sobre el 15% de prueba, respetando la distribución 70% entrenamiento, 15% validación y 15% prueba. No se ejecutó una evaluación real.
              </p>
              <p className="text-xs text-blue-700">
                Ningún modelo se declara automáticamente como superior. La selección de candidato es una decisión del usuario.
              </p>
            </div>
          </div>

          {/* Comparison chart */}
          <ModelComparisonChart />

          {/* Side by side metrics */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Métricas lado a lado
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Logistic Regression */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    {lrDef?.name}
                  </h4>
                  <Button
                    size="sm"
                    onClick={() => handleSelect('logistic-regression')}
                    className="gap-1.5 text-xs"
                  >
                    <CheckCircle2 size={14} aria-hidden="true" />
                    Seleccionar como candidato
                  </Button>
                </div>
                <MetricsCards metrics={lr} />
              </div>
              {/* Decision Tree */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    {dtDef?.name}
                  </h4>
                  <Button
                    size="sm"
                    onClick={() => handleSelect('decision-tree')}
                    className="gap-1.5 text-xs"
                  >
                    <CheckCircle2 size={14} aria-hidden="true" />
                    Seleccionar como candidato
                  </Button>
                </div>
                <MetricsCards metrics={dt} />
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Diferencias entre métricas
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">Métrica</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground">{lrDef?.name}</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground">{dtDef?.name}</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {metricKeys.map((key) => {
                    const diff = lr[key] - dt[key]
                    return (
                      <tr key={key} className="border-b border-slate-100 last:border-0">
                        <td className="p-3 text-sm font-medium text-slate-700">{metricLabels[key]}</td>
                        <td className="p-3 text-right text-sm text-slate-600">{lr[key].toFixed(2)}</td>
                        <td className="p-3 text-right text-sm text-slate-600">{dt[key].toFixed(2)}</td>
                        <td className="p-3 text-right text-sm">
                          <span className={`font-medium ${diff > 0 ? 'text-indigo-600' : diff < 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              La diferencia se calcula como Regresión Logística menos Árbol de Decisión. Un valor positivo indica que Regresión Logística tiene mayor métrica; un valor negativo indica que Árbol de Decisión tiene mayor métrica.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
