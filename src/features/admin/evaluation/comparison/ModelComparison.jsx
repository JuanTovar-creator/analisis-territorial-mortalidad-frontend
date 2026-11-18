import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatePanel } from '@/components/dashboard/DashboardPrimitives'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MetricsCards from '@/features/admin/training/results/MetricsCards'
import ModelComparisonChart from '@/features/admin/training/results/ModelComparisonChart'
import { getModelComparison } from '@/services/modelComparison'

// Mapeo de modelos del backend a nombres amigables
const MODELS = [
  { id: 'regresion_lineal', name: 'Regresión Lineal' },
  { id: 'random_forest', name: 'Random Forest' },
]

const metricKeys = ['accuracy', 'precision', 'recall', 'f1']
const metricLabels = {
  accuracy: 'Accuracy',
  precision: 'Precision',
  recall: 'Recall',
  f1: 'F1-Score',
}

export default function ModelComparison() {
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getModelComparison()
      .then(data => {
        if (!cancelled) setComparisonData(data)
      })
      .catch(err => {
        if (!cancelled) {
          if (err.message && err.message.includes('404')) {
            setError('Los modelos aún no han sido entrenados y evaluados. Primero debes ejecutar el entrenamiento desde el módulo correspondiente.')
          } else {
            setError(err.message || 'Error al cargar la comparación de modelos')
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const lrDef = MODELS.find(m => m.id === 'regresion_lineal')
  const rfDef = MODELS.find(m => m.id === 'random_forest')

  const lrModelData = comparisonData?.modelos?.['regresion_lineal']
  const rfModelData = comparisonData?.modelos?.['random_forest']
  const recommendedModelId = comparisonData?.modelo_seleccionado
  const criterioSeleccion = comparisonData?.criterio_seleccion

  // Extraer métricas de clasificación convertidas a porcentajes
  const classificationToDisplay = (modelData) => {
    const cls = modelData?.metricas_clasificacion_validacion
    if (!cls) return null
    return {
      accuracy: cls.accuracy * 100,
      precision: cls.precision * 100,
      recall: cls.recall * 100,
      f1: cls.f1_score * 100,
    }
  }

  const lrMetrics = classificationToDisplay(lrModelData)
  const rfMetrics = classificationToDisplay(rfModelData)

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="loading" title="Cargando comparación" description="Obteniendo las métricas de ambos modelos..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel state="error" title="Error al cargar comparación" description={error} />
      </div>
    )
  }

  if (!comparisonData || !lrMetrics || !rfMetrics) {
    return (
      <div className="flex flex-col gap-6">
        <StatePanel title="Sin datos de comparación" description="No hay métricas de evaluación disponibles. Los modelos deben ser entrenados y evaluados primero." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Comparación de modelos</CardTitle>
            <CardDescription className="mt-1">
              Compara ambos modelos con las mismas métricas y el mismo conjunto de validación.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Criterio de selección del backend */}
          {criterioSeleccion && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Criterio de selección
              </h3>
              <p className="text-sm text-slate-600">
                {criterioSeleccion}
              </p>
            </div>
          )}

          {/* Comparison chart */}
          <ModelComparisonChart
            modelA={{ name: lrDef?.name, metrics: lrMetrics }}
            modelB={{ name: rfDef?.name, metrics: rfMetrics }}
          />

          {/* Side by side metrics */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Métricas lado a lado
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Regresión Lineal */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    {lrDef?.name}
                  </h4>
                  {recommendedModelId === 'regresion_lineal' && (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 gap-1 flex items-center">
                      <CheckCircle2 size={12} aria-hidden="true" />
                      Modelo indicado
                    </Badge>
                  )}
                </div>
                <MetricsCards metrics={lrMetrics} />
              </div>
              {/* Random Forest */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    {rfDef?.name}
                  </h4>
                  {recommendedModelId === 'random_forest' && (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 gap-1 flex items-center">
                      <CheckCircle2 size={12} aria-hidden="true" />
                      Modelo indicado
                    </Badge>
                  )}
                </div>
                <MetricsCards metrics={rfMetrics} />
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
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground">{rfDef?.name}</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {metricKeys.map((key) => {
                    const diff = lrMetrics[key] - rfMetrics[key]
                    return (
                      <tr key={key} className="border-b border-slate-100 last:border-0">
                        <td className="p-3 text-sm font-medium text-slate-700">{metricLabels[key]}</td>
                        <td className="p-3 text-right text-sm text-slate-600">{lrMetrics[key].toFixed(2)}</td>
                        <td className="p-3 text-right text-sm text-slate-600">{rfMetrics[key].toFixed(2)}</td>
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
              La diferencia se calcula como Regresión Lineal menos Random Forest. Un valor positivo indica que Regresión Lineal tiene mayor métrica; un valor negativo indica que Random Forest tiene mayor métrica.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
